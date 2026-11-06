"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Link2,
  Share2,
  Sparkles,
  FileDown,
  Unlink,
} from "lucide-react";
import type { Memory, Relationship, RelationshipType } from "@/lib/types";
import { RELATIONSHIP_TYPES } from "@/features/relationships/schema";
import {
  createRelationshipAction,
  deleteRelationshipAction,
  summarizeConnectionsPdfAction,
} from "@/features/relationships/actions";
import { suggestConnectionsAction, acceptSuggestedConnectionAction } from "@/features/connections/auto-suggest";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogShell, FieldLabel } from "@/components/ui/dialog-shell";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { SectionHeading } from "@/components/layout/section-heading";
import { ToastViewport, useToasts } from "@/components/layout/toasts";
import { cn } from "@/lib/utils";
import { resolveEntitlements, type PlanId } from "@/config/pricing";

interface ConnectionsClientProps {
  relationships: Relationship[];
  memories: Memory[];
  planId?: PlanId;
}

interface LinkRow {
  key: string;
  /** Every stored row for this undirected pair + type (both directions). */
  relationshipIds: string[];
  sourceMemoryId: string;
  targetMemoryId: string;
  relationshipType: RelationshipType;
  createdBy: Relationship["createdBy"];
}

interface GraphPoint {
  x: number;
  y: number;
}

interface GraphNode extends GraphPoint {
  id: string;
  label: string;
}

interface GraphEdge {
  key: string;
  from: GraphPoint;
  to: GraphPoint;
}

const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  related_to: "Related to",
  references: "References",
  derived_from: "Derived from",
  contradicts: "Contradicts",
};

function createdByLabel(createdBy: Relationship["createdBy"]): string {
  return createdBy === "user" ? "By you" : "By AI";
}

const GRAPH_WIDTH = 720;
const GRAPH_HEIGHT = 440;

export function ConnectionsClient({
  relationships,
  memories,
  planId = "free",
}: ConnectionsClientProps) {
  const entitlements = resolveEntitlements(planId);
  const canSuggest = entitlements.aiSuggestedConnections;
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [pending, startTransition] = useTransition();

  const [linkOpen, setLinkOpen] = useState(false);
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [relationshipType, setRelationshipType] =
    useState<RelationshipType>("related_to");
  const [confirmRow, setConfirmRow] = useState<LinkRow | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  const memoryById = useMemo(() => {
    const map = new Map<string, Memory>();
    for (const memory of memories) map.set(memory.id, memory);
    return map;
  }, [memories]);

  const pickerMemories = useMemo(
    () =>
      [...memories].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      ),
    [memories]
  );

  // Collapse the two stored directions of each relationship into one row.
  const rows = useMemo(() => {
    const map = new Map<string, LinkRow>();
    for (const rel of relationships) {
      const [a, b] = [rel.sourceMemoryId, rel.targetMemoryId].sort();
      const key = `${a}|${b}|${rel.relationshipType}`;
      const existing = map.get(key);
      if (existing) {
        existing.relationshipIds.push(rel.id);
      } else {
        map.set(key, {
          key,
          relationshipIds: [rel.id],
          sourceMemoryId: rel.sourceMemoryId,
          targetMemoryId: rel.targetMemoryId,
          relationshipType: rel.relationshipType,
          createdBy: rel.createdBy,
        });
      }
    }
    return Array.from(map.values());
  }, [relationships]);

  const graph = useMemo(() => {
    const cx = GRAPH_WIDTH / 2;
    const cy = GRAPH_HEIGHT / 2;
    const radius = Math.min(cx, cy) - 72;

    const ids = Array.from(
      new Set(
        relationships.flatMap((rel) => [
          rel.sourceMemoryId,
          rel.targetMemoryId,
        ])
      )
    ).sort();
    const total = ids.length;

    const positions = new Map<string, GraphPoint>();
    if (total > 0) {
      ids.forEach((id, index) => {
        const angle = (index / total) * Math.PI * 2;
        positions.set(id, {
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
        });
      });
    }

    const nodes: GraphNode[] = ids.flatMap((id) => {
      const point = positions.get(id);
      if (!point) return [];
      const memory = memoryById.get(id);
      const title = memory?.title?.trim() || "Missing memory";
      return [
        {
          id,
          x: point.x,
          y: point.y,
          label: title.length > 22 ? `${title.slice(0, 21)}…` : title,
        },
      ];
    });

    const edges: GraphEdge[] = [];
    for (const row of rows) {
      const from = positions.get(row.sourceMemoryId);
      const to = positions.get(row.targetMemoryId);
      if (from && to) edges.push({ key: row.key, from, to });
    }

    return { nodes, edges };
  }, [relationships, rows, memoryById]);

  const canLink =
    sourceId !== "" && targetId !== "" && sourceId !== targetId;

  function resetLinkForm() {
    setSourceId("");
    setTargetId("");
    setRelationshipType("related_to");
  }

  function handleCreateLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !canLink) return;
    startTransition(async () => {
      const result = await createRelationshipAction({
        sourceMemoryId: sourceId,
        targetMemoryId: targetId,
        relationshipType,
      });
      if (!result.ok) {
        push(result.error ?? "Could not link the memories.", "error");
        return;
      }
      push("Memories linked.", "success");
      setLinkOpen(false);
      resetLinkForm();
      router.refresh();
    });
  }

  function handleUnlink() {
    if (pending || !confirmRow) return;
    const ids = confirmRow.relationshipIds;
    startTransition(async () => {
      for (const id of ids) {
        const result = await deleteRelationshipAction(id);
        if (!result.ok) {
          push(result.error ?? "Could not remove the link.", "error");
          return;
        }
      }
      push("Link removed.", "success");
      setConfirmRow(null);
      router.refresh();
    });
  }

  function openNode(id: string) {
    router.push(`/memory/${id}`);
  }

  async function handleSuggest() {
    if (!canSuggest) {
      push("AI-suggested connections are available on Plus and Pro.", "error");
      return;
    }
    setSuggesting(true);
    try {
      const result = await suggestConnectionsAction();
      if (result.ok && result.suggestions) {
        setSuggestions(result.suggestions);
        push("Suggestions generated", "success");
      } else {
        push(result.error ?? "Could not generate suggestions.", "error");
      }
    } catch {
      push("Could not generate suggestions.", "error");
    } finally {
      setSuggesting(false);
    }
  }

  async function handleAcceptSuggestion(suggestion: any) {
    try {
      const result = await acceptSuggestedConnectionAction(suggestion);
      if (result.ok) {
        setSuggestions((prev) => prev.filter((s) => !(s.sourceMemoryId === suggestion.sourceMemoryId && s.targetMemoryId === suggestion.targetMemoryId)));
        push("Connection added", "success");
        router.refresh();
      } else {
        push(result.error ?? "Could not add connection.", "error");
      }
    } catch {
      push("Could not add connection.", "error");
    }
  }

  function handleDismissSuggestion(suggestion: any) {
    setSuggestions((prev) => prev.filter((s) => !(s.sourceMemoryId === suggestion.sourceMemoryId && s.targetMemoryId === suggestion.targetMemoryId)));
  }

  async function handleSummarize() {
    if (summarizing) return;
    setSummarizing(true);
    try {
      const result = await summarizeConnectionsPdfAction();
      if (!result.ok || !result.data) {
        push(result.error ?? "Could not summarize your connections.", "error");
        return;
      }
      const bytes = Uint8Array.from(atob(result.data), (char) =>
        char.charCodeAt(0)
      );
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename ?? "connections-summary.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      push(
        result.degraded
          ? "AI was unavailable, so the PDF is a note instead of a summary."
          : "Connections summary downloaded.",
        result.degraded ? "error" : "success"
      );
    } catch {
      push("Could not summarize your connections.", "error");
    } finally {
      setSummarizing(false);
    }
  }

  function handleNodeKeyDown(
    event: React.KeyboardEvent<SVGGElement>,
    id: string
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openNode(id);
    }
  }

  const linkDialog = (
    <Dialog
      open={linkOpen}
      onOpenChange={(next) => {
        setLinkOpen(next);
        if (!next) resetLinkForm();
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Link2 />
            Link two memories
          </Button>
        }
      />
      <DialogShell
        icon={Link2}
        title="Link two memories"
        description="Connect two memories so they can be found together later."
        footer={
          <div className="flex flex-col-reverse gap-2 border-t border-border/40 bg-muted/50 p-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setLinkOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="link-memories-form"
              disabled={pending || !canLink}
            >
              {pending ? "Linking…" : "Link memories"}
            </Button>
          </div>
        }
      >
        <form
          id="link-memories-form"
          onSubmit={handleCreateLink}
          className="space-y-4 p-5"
        >
          <div className="space-y-1.5">
            <FieldLabel htmlFor="link-source">Source memory</FieldLabel>
            <select
              id="link-source"
              value={sourceId}
              onChange={(event) => setSourceId(event.target.value)}
              className="app-control h-10 w-full border border-input bg-background px-3 text-sm"
              required
            >
              <option value="">Choose a memory…</option>
              {pickerMemories.map((memory) => (
                <option key={memory.id} value={memory.id}>
                  {memory.title || "Untitled memory"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="link-target">Target memory</FieldLabel>
            <select
              id="link-target"
              value={targetId}
              onChange={(event) => setTargetId(event.target.value)}
              className="app-control h-10 w-full border border-input bg-background px-3 text-sm"
              required
            >
              <option value="">Choose a memory…</option>
              {pickerMemories.map((memory) => (
                <option
                  key={memory.id}
                  value={memory.id}
                  disabled={memory.id === sourceId}
                >
                  {memory.title || "Untitled memory"}
                </option>
              ))}
            </select>
            {sourceId && targetId && sourceId === targetId && (
              <p className="mt-1.5 text-[11px] text-destructive">
                A memory cannot be related to itself.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="link-type">Relationship</FieldLabel>
            <select
              id="link-type"
              value={relationshipType}
              onChange={(event) =>
                setRelationshipType(event.target.value as RelationshipType)
              }
              className="app-control h-10 w-full border border-input bg-background px-3 text-sm"
            >
              {RELATIONSHIP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {RELATIONSHIP_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          {pickerMemories.length < 2 && (
            <p className="text-[11px] text-muted-foreground">
              You need at least two memories before you can link them.
            </p>
          )}
        </form>
      </DialogShell>
    </Dialog>
  );

  const confirmDialog = (
    <Dialog
      open={confirmRow !== null}
      onOpenChange={(next) => {
        if (!next) setConfirmRow(null);
      }}
    >
      <DialogShell
        icon={Unlink}
        tone="destructive"
        title="Unlink memories?"
        description="The two memories will stop referencing each other. Their content is not changed."
        footer={
          <div className="flex flex-col-reverse gap-2 border-t border-border/40 bg-muted/50 p-4 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmRow(null)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnlink}
              disabled={pending}
            >
              {pending ? "Removing…" : "Unlink"}
            </Button>
          </div>
        }
      >
        <div className="space-y-3 p-5">
          {confirmRow && (
            <>
              <div className="app-control border border-border bg-secondary/40 p-3 text-sm">
                <p className="font-medium">
                  {memoryById.get(confirmRow.sourceMemoryId)?.title ||
                    "Missing memory"}
                </p>
                <p className="my-1 text-xs text-muted-foreground">
                  {RELATIONSHIP_LABELS[confirmRow.relationshipType]}
                </p>
                <p className="font-medium">
                  {memoryById.get(confirmRow.targetMemoryId)?.title ||
                    "Missing memory"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                This removes the link from both memories.
              </p>
            </>
          )}
        </div>
      </DialogShell>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Connections"
        description={
          relationships.length === 0
            ? "Link related memories so they can be found together."
            : `${rows.length} ${rows.length === 1 ? "connection" : "connections"} across ${graph.nodes.length} ${graph.nodes.length === 1 ? "memory" : "memories"}`
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSummarize}
              disabled={summarizing || rows.length === 0}
            >
              {summarizing ? <FileDown /> : <Sparkles />}
              {summarizing ? "Summarizing…" : "Summarize"}
            </Button>
            {linkDialog}
          </div>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="No connections yet"
          description="Link two related memories to see them here and on the graph."
          action={<Button onClick={() => setLinkOpen(true)}>Link two memories</Button>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3">
            <SectionHeading
              aside={`${rows.length} ${rows.length === 1 ? "link" : "links"}`}
            >
              Links
            </SectionHeading>
            <ul className="app-card divide-y divide-border/60 overflow-hidden">
              {rows.map((row) => {
                const source = memoryById.get(row.sourceMemoryId);
                const target = memoryById.get(row.targetMemoryId);
                return (
                  <li
                    key={row.key}
                    className="app-row-hover flex flex-wrap items-center gap-3 p-4"
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Link
                          href={`/memory/${row.sourceMemoryId}`}
                          className={cn(
                            "max-w-full truncate font-medium hover:underline",
                            !source && "italic text-muted-foreground"
                          )}
                        >
                          {source?.title || "Missing memory"}
                        </Link>
                        <Badge variant="lavender">
                          {RELATIONSHIP_LABELS[row.relationshipType]}
                        </Badge>
                        <Link
                          href={`/memory/${row.targetMemoryId}`}
                          className={cn(
                            "max-w-full truncate font-medium hover:underline",
                            !target && "italic text-muted-foreground"
                          )}
                        >
                          {target?.title || "Missing memory"}
                        </Link>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline">
                          {createdByLabel(row.createdBy)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setConfirmRow(row)}
                      disabled={pending}
                    >
                      <Unlink />
                      Unlink
                    </Button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="space-y-3">
            <SectionHeading
              aside={`${graph.nodes.length} nodes · ${graph.edges.length} edges`}
            >
              Graph
            </SectionHeading>
            <div className="app-card overflow-x-auto p-3">
              <svg
                viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
                className="h-auto w-full min-w-[520px]"
                role="img"
                aria-label="Graph of connected memories"
              >
                <g>
                  {graph.edges.map((edge) => (
                    <line
                      key={edge.key}
                      x1={edge.from.x}
                      y1={edge.from.y}
                      x2={edge.to.x}
                      y2={edge.to.y}
                      className="stroke-border"
                      strokeWidth={1.5}
                    />
                  ))}
                </g>
                {graph.nodes.map((node) => (
                  <g
                    key={node.id}
                    tabIndex={0}
                    role="link"
                    aria-label={`Open ${node.label}`}
                    className="cursor-pointer outline-none hover:[&>circle]:fill-primary-hover focus-visible:[&>circle]:stroke-ring focus-visible:[&>circle]:stroke-2"
                    onClick={() => openNode(node.id)}
                    onKeyDown={(event) => handleNodeKeyDown(event, node.id)}
                  >
                    <title>{node.label}</title>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={9}
                      className="fill-primary stroke-background stroke-2"
                    />
                    <text
                      x={node.x}
                      y={node.y + 24}
                      textAnchor="middle"
                      className="pointer-events-none fill-foreground text-[11px]"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">
              Select a node to open that memory.
            </p>
          </section>
        </div>
      )}

      {confirmDialog}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
