"use client";

import { Network } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Relationship, Entity, Memory } from "@/lib/types";

interface RelationshipListProps {
  memories: Memory[];
  entities: Entity[];
  relationships: Relationship[];
}

const typeLabel: Record<Relationship["type"], string> = {
  "related-topic": "Related topic",
  "in-project": "Same collection/project",
  "same-entity": "Same entity",
  supports: "Supports",
  user: "Added by you",
};

export function RelationshipList({
  memories,
  entities,
  relationships,
}: RelationshipListProps) {
  if (relationships.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-secondary">
          <Network className="size-4 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No relationships yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          As you capture more memories, connections will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {relationships.slice(0, 20).map((rel) => {
        const from = memories.find((m) => m.id === rel.fromId);
        const toEntity = entities.find((e) => e.id === rel.toId);
        const toMem = memories.find((m) => m.id === rel.toId);
        return (
          <Card key={rel.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {from?.title || rel.fromId}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                → {toEntity?.name || toMem?.title || rel.toId}
              </p>
            </div>
            <Badge variant="secondary" className="text-[11px]">
              {typeLabel[rel.type]}
            </Badge>
          </Card>
        );
      })}
    </div>
  );
}
