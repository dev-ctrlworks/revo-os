import { createClient } from "@/lib/supabase/server";
import type { MemoryRow } from "@/types/database";
import type { Memory } from "@/lib/types";
import { toUiMemory } from "@/features/memories/model";

export interface RetrievedSource {
  id: string;
  title: string;
  content: string;
  domain: string | null;
}

/**
 * Retrieves the authenticated user's most relevant memories for a query using
 * Postgres full-text search. Runs server-side with RLS, so results are always
 * scoped to the current user — the client never supplies the sources.
 */
export async function retrieveSources(
  query: string,
  limit = 6
): Promise<RetrievedSource[]> {
  const supabase = await createClient();
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .textSearch("search_vector", trimmed, {
      type: "websearch",
      config: "english",
    })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as MemoryRow[]).map((row) => {
    const memory: Memory = toUiMemory(row);
    return {
      id: memory.id,
      title: memory.title,
      content: (row.content_text || memory.description || "").slice(0, 1500),
      domain: memory.domain ?? null,
    };
  });
}
