"use client";

import { useMemo } from "react";
import { useMemoryStore } from "@/lib/use-memory-store";
import { deriveRelated } from "@/lib/related";
import { RelationshipList } from "@/components/connections/relationship-list";
import type { Entity, Relationship } from "@/lib/types";

export function RelationshipsPanel() {
  const memories = useMemoryStore();

  const { entities, relationships } = useMemo(() => {
    const entities: Entity[] = [];
    const relationships: Relationship[] = [];
    for (const m of memories.slice(0, 20)) {
      const r = deriveRelated(m);
      entities.push(...r.entities);
      relationships.push(...r.relationships);
    }
    return { entities, relationships };
  }, [memories]);

  return (
    <RelationshipList
      memories={memories}
      entities={entities}
      relationships={relationships}
    />
  );
}
