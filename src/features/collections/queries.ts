import { createClient } from "@/lib/supabase/server";
import type { CollectionRow, MemoryRow } from "@/types/database";
import type { Collection } from "@/lib/types";
import type { GroundingSource } from "@/lib/ai";

/** Deterministic accent color derived from the collection name. */
const COLORS = ["violet", "sky", "lime", "pink", "amber"] as const;

export function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function toCollection(
  row: CollectionRow,
  memoryCount: number
): Collection {
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    description: row.description ?? "",
    memoryCount,
    color: colorForName(row.name),
  };
}

export async function listCollections(): Promise<Collection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = (data ?? []) as CollectionRow[];

  const { data: links } = await supabase
    .from("collection_memories")
    .select("collection_id");

  const counts = new Map<string, number>();
  for (const link of links ?? []) {
    counts.set(link.collection_id, (counts.get(link.collection_id) ?? 0) + 1);
  }

  return rows.map((row) => toCollection(row, counts.get(row.id) ?? 0));
}

export async function getCollection(id: string): Promise<Collection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { count } = await supabase
    .from("collection_memories")
    .select("memory_id", { count: "exact", head: true })
    .eq("collection_id", id);

  return toCollection(data as CollectionRow, count ?? 0);
}

/**
 * Loads a collection's memories as grounding sources for summarization. Runs
 * server-side under RLS (scoped to the current user), newest first, capped so a
 * summary stays bounded in cost and length. Content is truncated per item.
 */
export async function getCollectionMemoriesForSummary(
  id: string,
  limit = 40
): Promise<GroundingSource[]> {
  const supabase = await createClient();

  const { data: links, error: linkError } = await supabase
    .from("collection_memories")
    .select("memory_id")
    .eq("collection_id", id)
    .limit(limit);
  if (linkError || !links || links.length === 0) return [];

  const ids = links.map((link) => link.memory_id);

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .in("id", ids)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];

  return (data as MemoryRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    content: (row.content_text || row.description || "").slice(0, 1500),
    domain: row.source_domain ?? null,
  }));
}
