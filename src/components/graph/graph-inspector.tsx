"use client";

import {
  CalendarDays,
  Compass,
  ExternalLink,
  FolderKanban,
  Hash,
  Lightbulb,
  MapPin,
  Package,
  Plane,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import type { EntityKind, GraphEdge, GraphNode, GraphSelection } from "@/lib/graph";
import { ENTITY_KIND_META, RELATION_META } from "@/lib/graph";
import { MemoryTypeIcon, memoryTypeLabel } from "@/components/memories/memory-type-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KIND_ICONS: Record<EntityKind, LucideIcon> = {
  person: User,
  place: MapPin,
  product: Package,
  project: FolderKanban,
  trip: Plane,
  event: CalendarDays,
  idea: Lightbulb,
  topic: Hash,
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export interface GraphInspectorProps {
  selection: GraphSelection | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
  neighbors: Map<string, Set<string>>;
  activeTopicLabel?: string | null;
  onOpenMemory: (id: string) => void;
  onExplore: (id: string) => void;
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  onClear: () => void;
}

export function GraphInspector({
  selection,
  nodes,
  edges,
  neighbors,
  activeTopicLabel,
  onOpenMemory,
  onExplore,
  onSelectNode,
  onSelectEdge,
  onClear,
}: GraphInspectorProps) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));

  const selectedNode = selection?.type === "node" ? nodeById.get(selection.id) : undefined;
  const selectedEdge = selection?.type === "edge" ? edgeById.get(selection.id) : undefined;

  return (
    <aside className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/60">
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Compass className="size-4 text-indigo-500" />
          {selectedEdge ? "Connection" : selectedNode ? "Node" : "Inspector"}
        </div>
        {(selectedNode || selectedEdge) && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
        {selectedEdge ? (
          <EdgeDetail
            edge={selectedEdge}
            source={nodeById.get(selectedEdge.source)}
            target={nodeById.get(selectedEdge.target)}
            onSelectNode={onSelectNode}
            onOpenMemory={onOpenMemory}
          />
        ) : selectedNode ? (
          <NodeDetail
            node={selectedNode}
            nodes={nodes}
            edges={edges}
            neighbors={neighbors}
            onOpenMemory={onOpenMemory}
            onExplore={onExplore}
            onSelectNode={onSelectNode}
            onSelectEdge={onSelectEdge}
          />
        ) : (
          <EmptyState activeTopicLabel={activeTopicLabel} />
        )}
      </div>
    </aside>
  );
}

function EmptyState({ activeTopicLabel }: { activeTopicLabel?: string | null }) {
  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>
        Click any node to see what Revo OS knows about it, or click a line to
        understand why two memories are connected.
      </p>
      <div className="space-y-2 rounded-xl border border-border/50 bg-background/60 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Sparkles className="size-3.5 text-pink-500" />
          RevoOS discovered
        </p>
        <p className="text-xs">
          Pink dashed connections are links the AI inferred across topics — open
          one to read the reasoning.
        </p>
      </div>
      {activeTopicLabel && (
        <p className="text-xs">
          Focused on <span className="font-medium text-foreground">{activeTopicLabel}</span>.
        </p>
      )}
    </div>
  );
}

function NodeDetail({
  node,
  nodes,
  edges,
  neighbors,
  onOpenMemory,
  onExplore,
  onSelectNode,
  onSelectEdge,
}: {
  node: GraphNode;
  nodes: GraphNode[];
  edges: GraphEdge[];
  neighbors: Map<string, Set<string>>;
  onOpenMemory: (id: string) => void;
  onExplore: (id: string) => void;
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
}) {
  const nodeById = new Map(nodes.map((item) => [item.id, item]));
  const connected = new Set(neighbors.get(node.id) ?? []);
  const connectedNodes = Array.from(connected)
    .map((id) => nodeById.get(id))
    .filter((item): item is GraphNode => Boolean(item))
    .sort((a, b) => b.degree - a.degree);

  const connectionEdges = edges.filter(
    (edge) => edge.source === node.id || edge.target === node.id
  );

  const relations = Array.from(new Set(connectionEdges.map((edge) => edge.relation)));

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          {node.kind === "memory" && node.memoryType ? (
            <MemoryTypeIcon type={node.memoryType} size="md" />
          ) : node.hub ? (
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-lg"
              style={{ backgroundColor: `${node.color}1f` }}
            >
              {node.emoji ?? "•"}
            </span>
          ) : (
            <EntityIcon kind={node.entityKind} color={node.color} />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-foreground">
              {node.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{describeNode(node)}</p>
          </div>
        </div>

        {node.kind === "memory" ? (
          <Button
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-sm shadow-indigo-500/25 hover:from-indigo-400 hover:to-cyan-300"
            onClick={() => onOpenMemory(node.id)}
          >
            <ExternalLink className="size-3.5" />
            Open memory
          </Button>
        ) : (
          <Button variant="outline" className="w-full rounded-lg" onClick={() => onExplore(node.id)}>
            <Compass className="size-3.5 text-indigo-500" />
            Explore connections
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Stat label="Connections" value={connectionEdges.length} />
        <Stat label="Direct nodes" value={connectedNodes.length} />
      </div>

      {node.kind === "memory" && (node.tags?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <SectionLabel>Tags</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {node.tags?.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {relations.length > 0 && (
        <div className="space-y-2">
          <SectionLabel>Relationships</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {relations.map((relation) => (
              <span
                key={relation}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 px-2 py-0.5 text-[10px] font-medium"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: RELATION_META[relation].color }}
                />
                {RELATION_META[relation].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {connectedNodes.length > 0 && (
        <div className="space-y-2">
          <SectionLabel>Connects to</SectionLabel>
          <div className="space-y-1">
            {connectedNodes.slice(0, 8).map((item) => {
              const linking = connectionEdges.filter(
                (edge) => edge.source === item.id || edge.target === item.id
              );
              const relation = linking[0];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    relation ? onSelectEdge(relation.id) : onSelectNode(item.id)
                  }
                  className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border/60 hover:bg-muted/50"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                    {item.label}
                  </span>
                  {relation && (
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {RELATION_META[relation.relation].label}
                    </span>
                  )}
                </button>
              );
            })}
            {connectedNodes.length > 8 && (
              <p className="px-2 pt-1 text-[11px] text-muted-foreground">
                +{connectedNodes.length - 8} more
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EdgeDetail({
  edge,
  source,
  target,
  onSelectNode,
  onOpenMemory,
}: {
  edge: GraphEdge;
  source?: GraphNode;
  target?: GraphNode;
  onSelectNode: (id: string) => void;
  onOpenMemory: (id: string) => void;
}) {
  const meta = RELATION_META[edge.relation];
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
            style={{ backgroundColor: meta.color }}
          >
            {meta.label}
          </span>
          {edge.discovered && (
            <Badge variant="outline" className="gap-1 border-pink-500/40 text-pink-600">
              <Sparkles className="size-3" />
              AI inferred
            </Badge>
          )}
        </div>
        <p className="text-sm leading-relaxed text-foreground">{edge.explanation}</p>
        <p className="text-[11px] text-muted-foreground">{meta.description}</p>
      </div>

      <div className="space-y-2">
        <SectionLabel>Between</SectionLabel>
        {[source, target].filter((item): item is GraphNode => Boolean(item)).map((node) => (
          <div key={node.id} className="rounded-xl border border-border/50 bg-background/60 p-2.5">
            <button
              type="button"
              onClick={() => onSelectNode(node.id)}
              className="flex w-full items-center gap-2.5 text-left"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                {node.label}
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {node.kind === "memory" ? "Memory" : describeKind(node)}
              </span>
            </button>
            {node.kind === "memory" && (
              <button
                type="button"
                onClick={() => onOpenMemory(node.id)}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-500 transition-colors hover:text-indigo-400"
              >
                <ExternalLink className="size-3" />
                Open memory
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EntityIcon({ kind, color }: { kind?: EntityKind; color: string }) {
  const Icon = kind ? KIND_ICONS[kind] : Hash;
  const tint = kind ? ENTITY_KIND_META[kind].tint : "text-slate-500";
  return (
    <span
      className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", tint)}
      style={{ backgroundColor: `${color}1f` }}
    >
      <Icon className="size-4" />
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/60 px-3 py-2">
      <p className="text-base font-semibold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function describeKind(node: GraphNode): string {
  return node.entityKind ? ENTITY_KIND_META[node.entityKind].label : "Topic";
}

function describeNode(node: GraphNode): string {
  if (node.kind === "memory") {
    const type = node.memoryType ? memoryTypeLabel(node.memoryType) : "Memory";
    const date = node.date ? dateFormatter.format(new Date(node.date)) : "";
    return [type, date].filter(Boolean).join(" · ");
  }
  if (node.hub) return `${node.collection ?? "Topic"} · topic hub`;
  return describeKind(node);
}
