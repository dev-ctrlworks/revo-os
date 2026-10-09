import { Network } from "lucide-react";
import { getMemoryCount } from "@/lib/ai";
import { MemoryGraph } from "@/components/graph/memory-graph";

export default function GraphPage() {
  const count = getMemoryCount();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="flex size-9 items-center justify-center rounded-lg icon-chip">
            <Network className="size-4 text-aurora-2" />
          </span>
          <span>Memory Graph</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          {count} memories wired to the people, places, products, and topics
          they mention. Search to find a thread, filter by type or topic, then
          click any node or connection to see why it&apos;s linked — including
          the connections Revo OS discovered on its own.
        </p>
      </div>

      <MemoryGraph />
    </div>
  );
}
