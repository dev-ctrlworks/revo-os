"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { summarizeCollection } from "@/lib/ai";
import { renderSummaryPdf } from "@/lib/pdf";
import { getCollectionMemoriesForSummary } from "./queries";
import { collectionSchema, updateCollectionSchema } from "./schema";

export interface CollectionActionResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export interface SummarizeCollectionResult {
  ok: boolean;
  /** Base64-encoded PDF bytes, for download in the browser. */
  data?: string;
  filename?: string;
  /** True when the brief is a labeled notice rather than a real summary. */
  degraded?: boolean;
  error?: string;
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "collection"
  );
}

/**
 * Summarizes the authenticated user's collection into a downloadable one-page
 * PDF brief. Reads memories under RLS, generates the digest server-side, and
 * renders the PDF without persisting anything.
 */
export async function summarizeCollectionPdfAction(
  collectionId: string
): Promise<SummarizeCollectionResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const supabase = await createClient();
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("name, description")
    .eq("id", collectionId)
    .maybeSingle();
  if (collectionError || !collection) {
    return { ok: false, error: "That collection could not be found." };
  }

  const memories = await getCollectionMemoriesForSummary(collectionId);
  if (memories.length === 0) {
    return {
      ok: false,
      error: "Add a few memories to this collection before summarizing it.",
    };
  }

  const summary = await summarizeCollection({
    name: collection.name,
    description: collection.description ?? "",
    memories,
  });

  try {
    const pdf = await renderSummaryPdf({
      collectionName: collection.name,
      markdown: summary.markdown,
      generatedAt: new Date(),
    });
    return {
      ok: true,
      data: Buffer.from(pdf).toString("base64"),
      filename: `${slugify(collection.name)}-summary.pdf`,
      degraded: summary.degraded,
    };
  } catch (error) {
    logError("collections.summarize", "pdf render failed", error, {
      collectionId,
    });
    return { ok: false, error: "Could not build the summary PDF." };
  }
}

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function createCollectionAction(
  input: unknown
): Promise<CollectionActionResult> {
  const parsed = collectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .insert({
      user_id: userId,
      name: parsed.data.name,
      description: parsed.data.description || null,
      emoji: parsed.data.emoji || undefined,
    })
    .select("id")
    .single();

  if (error || !data) {
    logError("collections.create", "insert failed", error);
    return { ok: false, error: "Could not create the collection." };
  }

  revalidatePath("/collections");
  return { ok: true, id: data.id };
}

export async function updateCollectionAction(
  id: string,
  input: unknown
): Promise<CollectionActionResult> {
  const parsed = updateCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("collections")
    .update({
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.description !== undefined
        ? { description: parsed.data.description || null }
        : {}),
      ...(parsed.data.emoji !== undefined ? { emoji: parsed.data.emoji } : {}),
    })
    .eq("id", id);

  if (error) {
    logError("collections.update", "update failed", error, { id });
    return { ok: false, error: "Could not update the collection." };
  }

  revalidatePath("/collections");
  revalidatePath(`/collections/${id}`);
  return { ok: true, id };
}

export async function deleteCollectionAction(
  id: string
): Promise<CollectionActionResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) {
    logError("collections.delete", "delete failed", error, { id });
    return { ok: false, error: "Could not delete the collection." };
  }

  revalidatePath("/collections");
  return { ok: true, id };
}

export async function addMemoryToCollectionAction(
  collectionId: string,
  memoryId: string
): Promise<CollectionActionResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const supabase = await createClient();
  const { error } = await supabase.from("collection_memories").upsert(
    { collection_id: collectionId, memory_id: memoryId, user_id: userId },
    { onConflict: "collection_id,memory_id" }
  );
  if (error) {
    logError("collections.addMemory", "insert failed", error, {
      collectionId,
      memoryId,
    });
    return { ok: false, error: "Could not add the memory." };
  }

  revalidatePath("/collections");
  revalidatePath(`/collections/${collectionId}`);
  return { ok: true };
}

export async function removeMemoryFromCollectionAction(
  collectionId: string,
  memoryId: string
): Promise<CollectionActionResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: "You must be signed in." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("collection_memories")
    .delete()
    .eq("collection_id", collectionId)
    .eq("memory_id", memoryId);
  if (error) {
    logError("collections.removeMemory", "delete failed", error, {
      collectionId,
      memoryId,
    });
    return { ok: false, error: "Could not remove the memory." };
  }

  revalidatePath("/collections");
  revalidatePath(`/collections/${collectionId}`);
  return { ok: true };
}
