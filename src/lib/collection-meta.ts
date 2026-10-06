import { collections } from "./mock-data";

export interface CollectionMeta {
  emoji: string;
  description: string;
  color: string;
  aiGenerated?: boolean;
}

const known: Record<string, CollectionMeta> = Object.fromEntries(
  collections.map((c) => [
    c.name,
    { emoji: c.emoji, description: c.description, color: c.color },
  ])
);

export const defaultCollectionMeta: CollectionMeta = {
  emoji: "📁",
  description: "Captured memories",
  color: "from-indigo-500/20 to-cyan-500/5",
};

export function getCollectionMeta(name: string): CollectionMeta {
  return known[name] ?? defaultCollectionMeta;
}

export function getKnownCollectionNames(): string[] {
  return Object.keys(known);
}
