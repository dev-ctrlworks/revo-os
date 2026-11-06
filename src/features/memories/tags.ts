import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function normalizeTag(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Replaces a memory's tags with the supplied set, creating any missing tag
 * rows for the user. Tags are scoped to the owner via RLS.
 */
export async function setMemoryTags(
  supabase: SupabaseClient<Database>,
  userId: string,
  memoryId: string,
  tagNames: string[]
): Promise<void> {
  const normalized = Array.from(
    new Map(
      tagNames
        .map((name) => ({ name: name.trim(), normalized: normalizeTag(name) }))
        .filter((t) => t.normalized.length > 0)
        .map((t) => [t.normalized, t])
    ).values()
  ).slice(0, 25);

  await supabase.from("memory_tags").delete().eq("memory_id", memoryId);

  if (normalized.length === 0) return;

  const { data: existing } = await supabase
    .from("tags")
    .select("id, normalized_name")
    .in(
      "normalized_name",
      normalized.map((t) => t.normalized)
    );

  const byNormalized = new Map(
    (existing ?? []).map((t) => [t.normalized_name, t.id])
  );

  const toCreate = normalized.filter((t) => !byNormalized.has(t.normalized));
  if (toCreate.length > 0) {
    const { data: created } = await supabase
      .from("tags")
      .insert(
        toCreate.map((t) => ({
          user_id: userId,
          name: t.name,
          normalized_name: t.normalized,
        }))
      )
      .select("id, normalized_name");
    for (const tag of created ?? []) {
      byNormalized.set(tag.normalized_name, tag.id);
    }
  }

  const links = normalized
    .map((t) => byNormalized.get(t.normalized))
    .filter((id): id is string => Boolean(id))
    .map((tagId) => ({ memory_id: memoryId, tag_id: tagId, user_id: userId }));

  if (links.length > 0) {
    await supabase.from("memory_tags").insert(links);
  }
}
