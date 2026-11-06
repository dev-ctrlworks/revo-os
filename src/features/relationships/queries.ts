import { createClient } from "@/lib/supabase/server";
import type { MemoryRelationshipRow, MemoryRow } from "@/types/database";
import type { Relationship } from "@/lib/types";
import type { GroundingSource } from "@/lib/ai";

function toUi(row: MemoryRelationshipRow): Relationship {
  return {
    id: row.id,
    sourceMemoryId: row.source_memory_id,
    targetMemoryId: row.target_memory_id,
    relationshipType: row.relationship_type,
    createdBy: row.created_by,
  };
}

export async function listRelationships(): Promise<Relationship[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memory_relationships")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as MemoryRelationshipRow[]).map(toUi);
}

export async function listRelationshipsForMemory(
  memoryId: string
): Promise<Relationship[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memory_relationships")
    .select("*")
    .or(`source_memory_id.eq.${memoryId},target_memory_id.eq.${memoryId}`);
  if (error) throw error;
  return ((data ?? []) as MemoryRelationshipRow[]).map(toUi);
}

/**
 * Loads all memories that participate in any relationship (the connected
 * component set). Used for summarizing the connections graph as a single brief.
 */
export async function getConnectedMemoriesForSummary(
  limit = 40
): Promise<GroundingSource[]> {
  const supabase = await createClient();
  const { data: rels, error: relError } = await supabase
    .from("memory_relationships")
    .select("source_memory_id, target_memory_id")
    .limit(200);
  if (relError || !rels || rels.length === 0) return [];

  const ids = new Set<string>();
  for (const rel of rels) {
    ids.add(rel.source_memory_id);
    ids.add(rel.target_memory_id);
  }

  const idArray = Array.from(ids).slice(0, limit);

  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .in("id", idArray)
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
