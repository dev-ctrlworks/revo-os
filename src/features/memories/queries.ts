import { createClient } from "@/lib/supabase/server";
import type { MemoryRow } from "@/types/database";
import type { Memory } from "@/lib/types";
import { toUiMemory, previewUrlFor } from "./model";
import type { ListMemoriesInput } from "./schema";

export interface MemoryListResult {
  memories: Memory[];
  total: number;
  page: number;
  pageSize: number;
}

interface RelatedMeta {
  tags: Record<string, string[]>;
  collectionIds: Record<string, string[]>;
  fileMime: Record<string, string>;
}

/** Loads tags, collection membership, and file mime types for a page of rows. */
async function loadRelatedMeta(
  memoryIds: string[]
): Promise<RelatedMeta> {
  const meta: RelatedMeta = { tags: {}, collectionIds: {}, fileMime: {} };
  if (memoryIds.length === 0) return meta;

  const supabase = await createClient();

  const [{ data: tagLinkRows }, { data: collectionRows }, { data: fileRows }] =
    await Promise.all([
      supabase
        .from("memory_tags")
        .select("memory_id, tag_id")
        .in("memory_id", memoryIds),
      supabase
        .from("collection_memories")
        .select("memory_id, collection_id")
        .in("memory_id", memoryIds),
      supabase
        .from("memory_files")
        .select("memory_id, mime_type")
        .in("memory_id", memoryIds),
    ]);

  const tagIds = Array.from(
    new Set((tagLinkRows ?? []).map((row) => row.tag_id))
  );
  const tagNameById = new Map<string, string>();
  if (tagIds.length > 0) {
    const { data: tagRows } = await supabase
      .from("tags")
      .select("id, name")
      .in("id", tagIds);
    for (const tag of tagRows ?? []) tagNameById.set(tag.id, tag.name);
  }

  for (const row of tagLinkRows ?? []) {
    const name = tagNameById.get(row.tag_id);
    if (!name) continue;
    (meta.tags[row.memory_id] ??= []).push(name);
  }
  for (const row of collectionRows ?? []) {
    (meta.collectionIds[row.memory_id] ??= []).push(row.collection_id);
  }
  for (const row of fileRows ?? []) {
    meta.fileMime[row.memory_id] = row.mime_type;
  }

  return meta;
}

function toMemories(rows: MemoryRow[], meta: RelatedMeta): Memory[] {
  return rows.map((row) =>
    toUiMemory(row, {
      tags: meta.tags[row.id],
      collectionIds: meta.collectionIds[row.id],
      previewMime: meta.fileMime[row.id],
      previewUrl: meta.fileMime[row.id] ? previewUrlFor(row.id) : undefined,
    })
  );
}

export async function listMemories(
  input: Partial<ListMemoriesInput> = {}
): Promise<MemoryListResult> {
  const supabase = await createClient();
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("memories").select("*", { count: "exact" });

  if (input.search) {
    query = query.textSearch("search_vector", input.search, {
      type: "websearch",
      config: "english",
    });
  }
  if (input.type) query = query.eq("type", input.type);
  if (input.favorite) query = query.eq("favorite", true);

  if (input.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (input.sort === "title") {
    query = query.order("title", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const rows = (data ?? []) as MemoryRow[];
  const meta = await loadRelatedMeta(rows.map((r) => r.id));
  return {
    memories: toMemories(rows, meta),
    total: count ?? 0,
    page,
    pageSize,
  };
}

/** Loads the most recent memories for seeding the client store. */
export async function listRecentMemories(limit = 200): Promise<Memory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;

  const rows = (data ?? []) as MemoryRow[];
  const meta = await loadRelatedMeta(rows.map((r) => r.id));
  return toMemories(rows, meta);
}

export async function getMemory(id: string): Promise<Memory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const meta = await loadRelatedMeta([id]);
  return toMemories([data as MemoryRow], meta)[0] ?? null;
}
