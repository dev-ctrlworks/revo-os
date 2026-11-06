"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { resolveEntitlements } from "@/config/pricing";
import { getUserPlan } from "@/features/billing/plan";
import { generateAutoTags } from "@/lib/ai";
import { setMemoryTags } from "./tags";
import { logError } from "@/lib/log";

export async function autoTagMemoryAction(memoryId: string): Promise<{ ok: boolean; tags?: string[]; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "You must be signed in." };

    const planId = await getUserPlan(user.id);
    const entitlements = resolveEntitlements(planId);
    if (!entitlements.autoTagging) {
      return { ok: false, error: "Auto-tagging is available on Plus and Pro." };
    }

    const { data: memory, error } = await supabase
      .from("memories")
      .select("title, content_text, type")
      .eq("id", memoryId)
      .eq("user_id", user.id)
      .single();

    if (error || !memory) {
      return { ok: false, error: "Memory not found." };
    }

    const result = await generateAutoTags({
      title: memory.title,
      content: memory.content_text,
      type: memory.type,
    });

    if (result.tags.length === 0) {
      return { ok: false, error: result.degraded ? "Auto-tagging unavailable." : "No tags generated." };
    }

    await setMemoryTags(supabase, user.id, memoryId, result.tags);
    return { ok: true, tags: result.tags };
  } catch (error) {
    logError("memories.autoTag", "failed", error);
    return { ok: false, error: "Failed to generate tags." };
  }
}

export async function autoTagOnCreate(memoryId: string, userId: string): Promise<void> {
  try {
    const planId = await getUserPlan(userId);
    const entitlements = resolveEntitlements(planId);
    if (!entitlements.autoTagging) return;

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: memory } = await supabase
      .from("memories")
      .select("title, content_text, type")
      .eq("id", memoryId)
      .eq("user_id", userId)
      .single();

    if (!memory) return;

    const result = await generateAutoTags({
      title: memory.title,
      content: memory.content_text,
      type: memory.type,
    });

    if (result.tags.length > 0) {
      // Use service client for tag operations to avoid RLS issues in background context
      await setMemoryTags(supabase as any, userId, memoryId, result.tags);
    }
  } catch (error) {
    logError("memories.autoTagOnCreate", "failed", error);
  }
}
