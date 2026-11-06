"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { domainFromUrl, previewUrlFor } from "./model";
import { setMemoryTags } from "./tags";
import { createMemorySchema, updateMemorySchema } from "./schema";
import type { Memory } from "@/lib/types";
import { autoTagOnCreate } from "./auto-tag";

export interface MemoryActionResult {
  ok: boolean;
  memory?: Memory;
  error?: string;
}

function fail(error: string): MemoryActionResult {
  return { ok: false, error };
}

async function currentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function createMemoryAction(
  input: unknown
): Promise<MemoryActionResult> {
  const parsed = createMemorySchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid memory.");
  }

  const userId = await currentUserId();
  if (!userId) return fail("You must be signed in.");

  const supabase = await createClient();
  const { type, title, description, content, sourceUrl, tags } = parsed.data;
  const url = sourceUrl || null;

  const { data, error } = await supabase
    .from("memories")
    .insert({
      user_id: userId,
      type,
      title,
      description: description || null,
      content_text: content || null,
      source_url: url,
      source_domain: domainFromUrl(url),
      captured_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error || !data) {
    logError("memories.create", "insert failed", error);
    return fail("Could not save the memory.");
  }

  if (tags && tags.length > 0) {
    await setMemoryTags(supabase, userId, data.id, tags);
  } else {
    // Auto-tag for Plus/Pro if no manual tags provided
    void autoTagOnCreate(data.id, userId);
  }

  revalidatePath("/library");
  revalidatePath("/dashboard");

  return {
    ok: true,
    memory: {
      id: data.id,
      type: data.type,
      title: data.title,
      content: data.content_text ?? "",
      createdAt: data.created_at,
      source: data.source_url ?? "",
      domain: data.source_domain ?? undefined,
      tags: tags ?? [],
      favorite: data.favorite,
      collection: "",
      collectionIds: [],
      updatedAt: data.updated_at,
      processingStatus: "ready",
      description: data.description ?? undefined,
    },
  };
}

export async function updateMemoryAction(
  memoryId: string,
  input: unknown
): Promise<MemoryActionResult> {
  const parsed = updateMemorySchema.safeParse(input);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Invalid update.");
  }
  const userId = await currentUserId();
  if (!userId) return fail("You must be signed in.");

  const supabase = await createClient();
  const { title, description, content, favorite, tags, collectionIds } =
    parsed.data;

  const patch: {
    title?: string;
    description?: string | null;
    content_text?: string;
    favorite?: boolean;
  } = {};
  if (title !== undefined) patch.title = title;
  if (description !== undefined) patch.description = description;
  if (content !== undefined) patch.content_text = content;
  if (favorite !== undefined) patch.favorite = favorite;

  if (Object.keys(patch).length > 0) {
    const { error } = await supabase
      .from("memories")
      .update(patch)
      .eq("id", memoryId);
    if (error) {
      logError("memories.update", "update failed", error, { memoryId });
      return fail("Could not update the memory.");
    }
  }

  if (tags !== undefined) {
    await setMemoryTags(supabase, userId, memoryId, tags);
  }

  if (collectionIds !== undefined) {
    await supabase
      .from("collection_memories")
      .delete()
      .eq("memory_id", memoryId);
    if (collectionIds.length > 0) {
      await supabase.from("collection_memories").insert(
        collectionIds.map((collectionId) => ({
          collection_id: collectionId,
          memory_id: memoryId,
          user_id: userId,
        }))
      );
    }
  }

  revalidatePath("/library");
  revalidatePath(`/memory/${memoryId}`);
  return { ok: true };
}

export async function toggleFavoriteAction(
  memoryId: string,
  favorite: boolean
): Promise<MemoryActionResult> {
  const userId = await currentUserId();
  if (!userId) return fail("You must be signed in.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("memories")
    .update({ favorite })
    .eq("id", memoryId);
  if (error) {
    logError("memories.favorite", "toggle failed", error, { memoryId });
    return fail("Could not update the memory.");
  }
  revalidatePath("/library");
  return { ok: true };
}

export async function deleteMemoryAction(
  memoryId: string
): Promise<MemoryActionResult> {
  const userId = await currentUserId();
  if (!userId) return fail("You must be signed in.");

  const supabase = await createClient();

  // Remove the attached file (if any) from storage before deleting the row.
  const { data: file } = await supabase
    .from("memory_files")
    .select("storage_path")
    .eq("memory_id", memoryId)
    .maybeSingle();
  if (file?.storage_path) {
    await supabase.storage.from("memories").remove([file.storage_path]);
  }

  const { error } = await supabase.from("memories").delete().eq("id", memoryId);
  if (error) {
    logError("memories.delete", "delete failed", error, { memoryId });
    return fail("Could not delete the memory.");
  }

  revalidatePath("/library");
  revalidatePath("/dashboard");
  return { ok: true };
}

export { previewUrlFor };
