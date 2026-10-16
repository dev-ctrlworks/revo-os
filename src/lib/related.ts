import { getCollectionIds } from "./memory-store";
import type { Memory, Entity, Relationship } from "./types";

export interface RelatedResult {
  topics: string[];
  entities: Entity[];
  relationships: Relationship[];
}

const stop = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "this",
  "that",
  "these",
  "those",
  "from",
  "at",
  "by",
]);

export function deriveRelated(memory: Memory): RelatedResult {
  const topics = new Set<string>();
  for (const t of memory.tags) {
    const v = t.trim().toLowerCase();
    if (v && !stop.has(v)) topics.add(v);
  }
  const collections = getCollectionIds(memory);
  for (const c of collections) {
    const v = c.trim().toLowerCase();
    if (v && v !== "new captures" && !stop.has(v)) topics.add(v);
  }
  const text = `${memory.title} ${memory.content}`.toLowerCase();
  const tokens = text.match(/\b[a-z]{4,}\b/g) || [];
  for (const tok of tokens) {
    if (!stop.has(tok)) topics.add(tok);
  }

  const entities: Entity[] = Array.from(topics)
    .slice(0, 6)
    .map((name, i) => ({
      id: `e-${memory.id}-${i}`,
      type: "topic",
      name: name.charAt(0).toUpperCase() + name.slice(1),
      aliases: [],
    }));

  const relationships: Relationship[] = [];
  if (collections.length) {
    relationships.push({
      id: `r-${memory.id}-col`,
      fromId: memory.id,
      toId: `c-${collections[0]}`,
      type: "in-project",
      origin: "derived",
      evidence: `Shared collection ${collections[0]}`,
      reviewStatus: "suggested",
    });
  }
  if (entities.length) {
    relationships.push({
      id: `r-${memory.id}-t0`,
      fromId: memory.id,
      toId: entities[0].id,
      type: "related-topic",
      origin: "derived",
      evidence: "Co-occurrence",
      reviewStatus: "suggested",
    });
  }

  return {
    topics: Array.from(topics).slice(0, 8),
    entities,
    relationships,
  };
}
