"use client";

import { Network } from "lucide-react";
import { useMemoryStore } from "@/lib/use-memory-store";
import { MemoryGraph } from "@/components/graph/memory-graph";
import { RelationshipsPanel } from "./relationships";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ConnectionsPage() {
  const memories = useMemoryStore();
  const count = memories.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="flex size-9 items-center justify-center rounded-lg bg-secondary">
            <Network className="size-4 text-primary" />
          </span>
          <span>Connections</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {count} memories wired to the people, places, products, and topics
          they mention. Search to find a thread, then explore the relationship
          list or the interactive graph.
        </p>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="list">Relationships</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <RelationshipsPanel />
        </TabsContent>
        <TabsContent value="graph" className="mt-4">
          <MemoryGraph />
        </TabsContent>
      </Tabs>
    </div>
  );
}
