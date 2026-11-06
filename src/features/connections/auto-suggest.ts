"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resolveEntitlements } from "@/config/pricing";
import { getUserPlan } from "@/features/billing/plan";
import { generateSuggestedConnections } from "@/lib/ai";
import { logError } from "@/lib/log";

export async function suggestConnectionsAction(): Promise<{ ok: boolean; suggestions?: any[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "You must be signed in." };

    const planId = await getUserPlan(user.id);
    const entitlements = resolveEntitlements(planId);
    if (!entitlements.aiSuggestedConnections) {
      return { ok: false, error: "AI-suggested connections are available on Plus and Pro." };
    }

    const { data: memories, error } = await supabase
      .from("memories")
      .select("id, title, content_text, type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error || !memories || memories.length < 2) {
      return { ok: false, error: memories && memories.length < 2 ? "Add more memories to generate suggestions." : "Failed to load memories." };
    }

    const result = await generateSuggestedConnections({
      memories: memories.map((m) => ({
        id: m.id,
        title: m.title,
        content: m.content_text || "",
        type: m.type,
      })),
    });

    if (result.suggestions.length === 0) {
      return { ok: false, error: result.degraded ? "AI suggestions unavailable." : "No suggestions found." };
    }

    return { ok: true, suggestions: result.suggestions };
  } catch (error) {
    logError("connections.suggest", "failed", error);
    return { ok: false, error: "Failed to generate suggestions." };
  }
}

export async function acceptSuggestedConnectionAction(input: {
  sourceMemoryId: string;
  targetMemoryId: string;
  relationshipType: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "You must be signed in." };

    const { error } = await supabase
      .from("memory_relationships")
      .insert({
        user_id: user.id,
        source_memory_id: input.sourceMemoryId,
        target_memory_id: input.targetMemoryId,
        relationship_type: input.relationshipType as any,
      });

    if (error) {
      logError("connections.acceptSuggestion", "insert failed", error);
      return { ok: false, error: "Could not create connection." };
    }

    revalidatePath("/connections");
    return { ok: true };
  } catch (error) {
    logError("connections.acceptSuggestion", "failed", error);
    return { ok: false, error: "Failed to create connection." };
  }
}
