import { getAllMemories, getCollectionIds } from "./memory-store";
import type { Memory } from "./types";

export interface SearchOptions {
  query: string;
  limit?: number;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreMemory(memory: Memory, tokens: string[]): number {
  if (!tokens.length) return 0;
  const searchable = [
    memory.title,
    memory.content,
    memory.domain ?? "",
    ...memory.tags,
    ...getCollectionIds(memory),
    memory.source,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (searchable.includes(token)) score += 4;
    if (memory.title.toLowerCase().includes(token)) score += 3;
    if (memory.tags.some((tag) => tag.includes(token))) score += 2;
    if (getCollectionIds(memory).some((c) => c.toLowerCase().includes(token))) score += 1;
  }
  return score;
}

export function searchMemories({ query, limit = 7 }: SearchOptions): Memory[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  return getAllMemories()
    .map((memory) => ({ memory, score: scoreMemory(memory, tokens) }))
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        +new Date(b.memory.createdAt) - +new Date(a.memory.createdAt)
    )
    .slice(0, limit)
    .map((item) => item.memory);
}

export function getRelatedMemories(memory: Memory, limit = 3): Memory[] {
  const pool = getAllMemories();
  const shared = pool
    .filter((m) => m.id !== memory.id)
    .map((m) => {
      const overlap = m.tags.filter((tag) => memory.tags.includes(tag)).length;
      const sameCollection = getCollectionIds(m).some((c) =>
        getCollectionIds(memory).includes(c)
      )
        ? 1
        : 0;
      return { memory: m, score: overlap * 2 + sameCollection };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.memory);

  if (shared.length) return shared;
  return pool.filter((m) => m.id !== memory.id).slice(0, limit);
}
