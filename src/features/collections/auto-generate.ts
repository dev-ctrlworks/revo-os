"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resolveEntitlements } from "@/config/pricing";
import { getUserPlan } from "@/features/billing/plan";
import { generateSuggestedCollections } from "@/lib/ai";
import { logError } from "@/lib/log";

export async function generateCollectionsAction(): Promise<{ ok: boolean; collections?: any[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "You must be signed in." };

    const planId = await getUserPlan(user.id);
    const entitlements = resolveEntitlements(planId);
    if (!entitlements.autoCollections) {
      return { ok: false, error: "Automated collections are available on Plus and Pro." };
    }

    const { data: memories, error } = await supabase
      .from("memories")
      .select("id, title, content_text, type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(40);

    if (error || !memories || memories.length < 2) {
      return { ok: false, error: memories && memories.length < 2 ? "Add more memories to generate collections." : "Failed to load memories." };
    }

    const result = await generateSuggestedCollections({
      memories: memories.map((m) => ({
        id: m.id,
        title: m.title,
        content: m.content_text || "",
        type: m.type,
      })),
    });

    if (result.collections.length === 0) {
      return { ok: false, error: result.degraded ? "AI collections unavailable." : "No collections suggested." };
    }

    return { ok: true, collections: result.collections };
  } catch (error) {
    logError("collections.autoGenerate", "failed", error);
    return { ok: false, error: "Failed to generate collections." };
  }
}

export async function createFromSuggestionsAction(suggestions: Array<{ name: string; description: string; memoryIds: string[] }>): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "You must be signed in." };

    for (const suggestion of suggestions) {
      if (!suggestion.name.trim() || suggestion.memoryIds.length === 0) continue;
      const { data: collection, error: colError } = await supabase
        .from("collections")
        .insert({ user_id: user.id, name: suggestion.name.trim(), description: suggestion.description?.trim() || null })
        .select("id")
        .single();

      if (colError || !collection) continue;

      const links = suggestion.memoryIds.map((memoryId) => ({
        collection_id: collection.id,
        memory_id: memoryId,
        user_id: user.id,
      }));
      await supabase.from("collection_memories").insert(links);
    }

    revalidatePath("/collections");
    revalidatePath("/library");
    return { ok: true };
  } catch (error) {
    logError("collections.createFromSuggestions", "failed", error);
    return { ok: false, error: "Failed to create collections." };
  }
}
