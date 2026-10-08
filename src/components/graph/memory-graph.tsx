"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Compass, RotateCcw, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import type { GraphFilters, GraphSelection, RelationKind } from "@/lib/graph";
import { RELATION_META, RELATION_ORDER, buildGraph, resolveGraphView } from "@/lib/graph";
import type { MemoryType } from "@/lib/types";
import { useMemoryStore } from "@/lib/use-memory-store";
import { memoryTypeLabel } from "@/components/memories/memory-type-icon";
import { GraphCanvas, type GraphCanvasHandle } from "@/components/graph/graph-canvas";
import { GraphInspector } from "@/components/graph/graph-inspector";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MEMORY_TYPE_ORDER: MemoryType[] = [
  "screenshot",
  "note",
  "link",
  "document",
  "image",
  "discussion",
  "email",
  "archive",
];

const RANGE_OPTIONS: Array<{ value: GraphFilters["range"]; label: string }> = [
  { value: "all", label: "All time" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "year", label: "This year" },
];

export function MemoryGraph() {
  const router = useRouter();
  const canvasRef = useRef<GraphCanvasHandle>(null);
  const memories = useMemoryStore();

  const graph = useMemo(() => buildGraph(memories), [memories]);

  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [range, setRange] = useState<GraphFilters["range"]>("all");
  const [types, setTypes] = useState<Set<MemoryType>>(new Set(MEMORY_TYPE_ORDER));
  const [relations, setRelations] = useState<Set<RelationKind>>(new Set(RELATION_ORDER));
  const [selection, setSelection] = useState<GraphSelection | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [exploreId, setExploreId] = useState<string | null>(null);

  const availableTypes = useMemo(() => {
    const present = new Set(memories.map((memory) => memory.type));
    return MEMORY_TYPE_ORDER.filter((type) => present.has(type));
  }, [memories]);

  const view = useMemo(
    () => resolveGraphView(graph, { query, types, topic, range, relations }),
    [graph, query, types, topic, range, relations]
  );

  const searching = query.trim().length > 0 && view.focusIds.size > 0;
  const focusNodeId =
    hoveredId ??
    (selection?.type === "node" ? selection.id : null) ??
    exploreId ??
    null;

  const activeIds = useMemo(() => {
    const active = new Set<string>();
    if (searching) {
      view.focusIds.forEach((id) => active.add(id));
    }
    if (focusNodeId && view.visibleIds.has(focusNodeId)) {
      addNeighborhood(active, focusNodeId, view.neighbors, view.visibleIds);
    }
    if (!searching && !focusNodeId) {
      view.visibleIds.forEach((id) => active.add(id));
    }
    return active;
  }, [searching, focusNodeId, view]);

  const labelIds = useMemo(() => {
    const labels = new Set<string>();
    if (searching) view.focusIds.forEach((id) => labels.add(id));
    if (focusNodeId && view.visibleIds.has(focusNodeId)) {
      addNeighborhood(labels, focusNodeId, view.neighbors, view.visibleIds);
    }
    return labels;
  }, [searching, focusNodeId, view]);

  const topicById = useMemo(
    () => new Map(graph.topics.map((item) => [item.id, item])),
    [graph.topics]
  );

  const visibleMemories = view.nodes.filter((node) => node.kind === "memory").length;
  const visibleEntities = view.nodes.filter((node) => node.kind === "entity").length;

  const exploreNode = exploreId ? view.nodeById.get(exploreId) : undefined;
  const exploreCount = exploreId ? (view.neighbors.get(exploreId)?.size ?? 0) : 0;

  function toggleType(type: MemoryType) {
    setTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function toggleRelation(relation: RelationKind) {
    setRelations((current) => {
      const next = new Set(current);
      if (next.has(relation)) next.delete(relation);
      else next.add(relation);
      return next;
    });
  }

  function selectNode(id: string) {
    const node = graph.nodes.find((item) => item.id === id);
    if (selection?.type === "node" && selection.id === id && node?.kind === "memory" && node.memoryId) {
      router.push(`/memory/${node.memoryId}`);
      return;
    }
    setSelection({ type: "node", id });
  }

  function explore(id: string) {
    setExploreId(id);
    setSelection({ type: "node", id });
    canvasRef.current?.focus(id);
  }

  function reset() {
    setQuery("");
    setTopic(null);
    setRange("all");
    setTypes(new Set(MEMORY_TYPE_ORDER));
    setRelations(new Set(RELATION_ORDER));
    setSelection(null);
    setHoveredId(null);
    setExploreId(null);
    canvasRef.current?.reset();
  }

  const activeFilterCount =
    (topic ? 1 : 0) +
    (range !== "all" ? 1 : 0) +
    (types.size !== availableTypes.length ? 1 : 0) +
    (relations.size !== RELATION_ORDER.length ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people, places, memories…"
              className="rounded-lg pl-8"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="rounded-lg" />}>
              <SlidersHorizontal className="mr-1.5 size-3.5" />
              Types
              {types.size !== availableTypes.length && (
                <span className="ml-1.5 rounded-full bg-aurora-2/20 px-1.5 text-[10px] font-semibold text-aurora-2">
                  {types.size}
                </span>
              )}
              <ChevronDown className="ml-1.5 size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Memory type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={types.has(type)}
                    onCheckedChange={() => toggleType(type)}
                  >
                    {memoryTypeLabel(type)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center rounded-lg border border-border/60 bg-background p-0.5">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  range === option.value
                    ? "bg-aurora-2/15 text-aurora-2"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg text-muted-foreground"
            onClick={reset}
            disabled={activeFilterCount === 0 && !selection && !exploreId && !query}
          >
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset
          </Button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TopicChip
            label="All topics"
            active={topic === null}
            onClick={() => setTopic(null)}
          />
          {graph.topics.map((item) => (
            <TopicChip
              key={item.id}
              label={`${item.emoji} ${item.label}`}
              color={item.color}
              active={topic === item.id}
              onClick={() => setTopic(topic === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>

      {exploreNode && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-aurora-2/30 bg-aurora-2/[0.09] px-4 py-2.5">
          <Compass className="size-4 text-aurora-2" />
          <p className="text-xs text-foreground">
            Exploring <span className="font-semibold">{exploreNode.label}</span> ·{" "}
            {exploreCount} direct connections highlighted
          </p>
          <button
            type="button"
            onClick={() => {
              setExploreId(null);
              canvasRef.current?.reset();
            }}
            className="ml-auto text-[11px] font-medium text-aurora-2 transition-colors hover:text-aurora-2"
          >
            Exit explore
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="h-[480px] sm:h-[600px]">
          <GraphCanvas
            ref={canvasRef}
            nodes={view.nodes}
            edges={view.edges}
            width={graph.width}
            height={graph.height}
            visibleIds={view.visibleIds}
            activeIds={activeIds}
            labelIds={labelIds}
            selected={selection}
            hoveredId={hoveredId}
            onNodeClick={selectNode}
            onNodeHover={setHoveredId}
            onEdgeClick={(id) => setSelection({ type: "edge", id })}
            onBackgroundClick={() => {
              setSelection(null);
              setExploreId(null);
            }}
          />
        </div>

        <div className="h-[420px] lg:h-[600px]">
          <GraphInspector
            selection={selection}
            nodes={view.nodes}
            edges={view.edges}
            neighbors={view.neighbors}
            activeTopicLabel={topic ? topicById.get(topic)?.label : null}
            onOpenMemory={(id) => {
              const node = view.nodeById.get(id);
              if (node?.memoryId) router.push(`/memory/${node.memoryId}`);
            }}
            onExplore={explore}
            onSelectNode={selectNode}
            onSelectEdge={(id) => setSelection({ type: "edge", id })}
            onClear={() => {
              setSelection(null);
              setExploreId(null);
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        {RELATION_ORDER.map((relation) => {
          const meta = RELATION_META[relation];
          const active = relations.has(relation);
          return (
            <button
              key={relation}
              type="button"
              onClick={() => toggleRelation(relation)}
              title={meta.description}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2 py-1 transition-colors",
                active
                  ? "border-border/60 text-foreground"
                  : "border-transparent text-muted-foreground/50"
              )}
            >
              {relation === "discovered" ? (
                <Sparkles className="size-3 text-pink-500" />
              ) : (
                <span
                  className="h-0 w-4 border-t"
                  style={{
                    borderColor: meta.color,
                    borderStyle: meta.dashed ? "dashed" : "solid",
                  }}
                />
              )}
              {meta.label}
            </button>
          );
        })}
        <span className="ml-auto">
          {visibleMemories} memories · {visibleEntities} entities · {view.edges.length} connections
        </span>
      </div>
    </div>
  );
}

function TopicChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
        active
          ? "border-aurora-2/40 bg-aurora-2/15 text-aurora-2"
          : "border-border/60 bg-card/60 text-muted-foreground hover:text-foreground"
      )}
    >
      {color && (
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      )}
      {label}
    </button>
  );
}

function addNeighborhood(
  target: Set<string>,
  centerId: string,
  neighbors: Map<string, Set<string>>,
  visible: Set<string>
) {
  target.add(centerId);
  for (const id of neighbors.get(centerId) ?? []) {
    if (visible.has(id)) target.add(id);
  }
}
