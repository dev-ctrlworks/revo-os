"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Link2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Unlink,
} from "lucide-react";
import type { Memory, Relationship, RelationshipType } from "@/lib/types";
import {
  createRelationshipAction,
  deleteRelationshipAction,
} from "@/features/relationships/actions";
import { RELATIONSHIP_TYPES } from "@/features/relationships/schema";
import {
  deleteMemoryAction,
  toggleFavoriteAction,
  updateMemoryAction,
} from "@/features/memories/actions";
import { memoryTypeMeta } from "@/lib/memory-type";
import { safeExternalUrl } from "@/lib/safe-url";
import { EmptyState } from "@/components/layout/empty-state";
import { ToastViewport, useToasts } from "@/components/layout/toasts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { DialogShell, FieldLabel } from "@/components/ui/dialog-shell";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  related_to: "Related to",
  references: "References",
  derived_from: "Derived from",
  contradicts: "Contradicts",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseTags(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

interface MemoryDetailProps {
  memory: Memory;
  relationships: Relationship[];
  allMemories: Memory[];
}

export function MemoryDetail({
  memory,
  relationships,
  allMemories,
}: MemoryDetailProps) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [, startTransition] = useTransition();

  const meta = memoryTypeMeta[memory.type];
  const TypeIcon = meta.icon;
  const sourceUrl = safeExternalUrl(memory.source);

  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(memory.title);
  const [editDescription, setEditDescription] = useState(
    memory.description ?? ""
  );
  const [editContent, setEditContent] = useState(memory.content);
  const [editTags, setEditTags] = useState(memory.tags.join(", "));

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkQuery, setLinkQuery] = useState("");
  const [linkType, setLinkType] = useState<RelationshipType>("related_to");
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);

  const memoryById = useMemo(
    () => new Map(allMemories.map((item) => [item.id, item])),
    [allMemories]
  );

  const linkedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const rel of relationships) {
      if (rel.sourceMemoryId === memory.id) ids.add(rel.targetMemoryId);
      if (rel.targetMemoryId === memory.id) ids.add(rel.sourceMemoryId);
    }
    ids.delete(memory.id);
    return ids;
  }, [relationships, memory.id]);

  const linkCandidates = useMemo(() => {
    const query = linkQuery.trim().toLowerCase();
    return allMemories.filter(
      (item) =>
        item.id !== memory.id &&
        !linkedIds.has(item.id) &&
        (!query || item.title.toLowerCase().includes(query))
    );
  }, [allMemories, linkQuery, linkedIds, memory.id]);

  const selectedTarget = selectedTargetId
    ? memoryById.get(selectedTargetId)
    : undefined;

  function openEdit() {
    setEditTitle(memory.title);
    setEditDescription(memory.description ?? "");
    setEditContent(memory.content);
    setEditTags(memory.tags.join(", "));
    setEditOpen(true);
  }

  function handleFavorite() {
    startTransition(async () => {
      const result = await toggleFavoriteAction(memory.id, !memory.favorite);
      if (!result.ok) {
        push(result.error ?? "Could not update the memory.", "error");
        return;
      }
      router.refresh();
    });
  }

  function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editTitle.trim()) return;
    startTransition(async () => {
      const result = await updateMemoryAction(memory.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        content: editContent,
        tags: parseTags(editTags),
      });
      if (!result.ok) {
        push(result.error ?? "Could not update the memory.", "error");
        return;
      }
      push("Memory updated.", "success");
      setEditOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    startTransition(async () => {
      const result = await deleteMemoryAction(memory.id);
      if (!result.ok) {
        setDeleting(false);
        push(result.error ?? "Could not delete the memory.", "error");
        return;
      }
      push("Memory deleted.", "success");
      router.push("/library");
      router.refresh();
    });
  }

  function handleUnlink(rel: Relationship) {
    if (unlinkingId) return;
    setUnlinkingId(rel.id);
    // Links are stored in both directions; remove the mirror row too so the
    // relationship disappears from both memories.
    const mirror = relationships.find(
      (item) =>
        item.id !== rel.id &&
        item.sourceMemoryId === rel.targetMemoryId &&
        item.targetMemoryId === rel.sourceMemoryId &&
        item.relationshipType === rel.relationshipType
    );
    startTransition(async () => {
      const result = await deleteRelationshipAction(rel.id);
      if (!result.ok) {
        setUnlinkingId(null);
        push(result.error ?? "Could not remove the link.", "error");
        return;
      }
      if (mirror) {
        const mirrorResult = await deleteRelationshipAction(mirror.id);
        if (!mirrorResult.ok) {
          push(mirrorResult.error ?? "Could not remove the link.", "error");
        }
      }
      setUnlinkingId(null);
      push("Link removed.", "success");
      router.refresh();
    });
  }

  function handleLink() {
    if (!selectedTargetId || linking) return;
    setLinking(true);
    startTransition(async () => {
      const result = await createRelationshipAction({
        sourceMemoryId: memory.id,
        targetMemoryId: selectedTargetId,
        relationshipType: linkType,
      });
      setLinking(false);
      if (!result.ok) {
        push(result.error ?? "Could not link the memories.", "error");
        return;
      }
      push("Memories linked.", "success");
      setLinkOpen(false);
      setSelectedTargetId(null);
      setLinkQuery("");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/library"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Library
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.accent.soft}`}
            >
              <TypeIcon className="size-3.5" />
              {meta.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Saved {formatDate(memory.createdAt)}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-heading">
            {memory.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={memory.favorite ? "Unfavorite" : "Favorite"}
            aria-pressed={memory.favorite}
            onClick={handleFavorite}
            className={memory.favorite ? "text-favorite" : undefined}
          >
            <Star className={memory.favorite ? "fill-favorite" : undefined} />
          </Button>
          <Button variant="outline" size="sm" onClick={openEdit}>
            <Pencil />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      {memory.previewUrl && (
        // The endpoint responds with a 302 redirect to a signed URL.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={memory.previewUrl}
          alt={memory.title}
          className="max-h-96 w-full rounded-2xl border border-border bg-muted/20 object-contain"
        />
      )}

      {(memory.description || sourceUrl) && (
        <div className="space-y-3">
          {memory.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {memory.description}
            </p>
          )}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent-blue underline-offset-4 hover:underline"
            >
              <ExternalLink className="size-3.5" />
              {memory.domain || sourceUrl}
            </a>
          )}
        </div>
      )}

      <Separator />

      <section className="space-y-3">
        <h2 className="app-h3">Content</h2>
        {memory.content ? (
          <div className="app-card whitespace-pre-wrap bg-muted/30 p-4 text-sm leading-relaxed text-foreground">
            {memory.content}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No content stored</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="app-h3">Tags</h2>
        {memory.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {memory.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No tags</p>
        )}
        <Button variant="ghost" size="sm" onClick={openEdit}>
          <Pencil />
          Edit tags
        </Button>
      </section>

      <Separator />

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="app-h3">
            Related memories
          </h2>
          <Button size="sm" onClick={() => setLinkOpen(true)}>
            <Plus />
            Link a memory
          </Button>
        </div>

        {relationships.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="No related memories"
            description="Link this memory to others in your library to keep their context together."
            action={
              <Button onClick={() => setLinkOpen(true)}>
                <Plus />
                Link a memory
              </Button>
            }
          />
        ) : (
          <ul className="app-card divide-y divide-border/60 overflow-hidden">
            {relationships.map((rel) => {
              const otherId =
                rel.sourceMemoryId === memory.id
                  ? rel.targetMemoryId
                  : rel.sourceMemoryId;
              const other = memoryById.get(otherId);
              return (
                <li
                  key={rel.id}
                  className="app-row-hover flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/memory/${otherId}`}
                      className="block min-w-0"
                    >
                      <p className="truncate text-sm font-medium text-foreground hover:underline">
                        {other?.title ?? "Memory not in recent list"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {RELATIONSHIP_LABELS[rel.relationshipType]}
                        {rel.createdBy === "ai" && " · suggested by AI"}
                      </p>
                    </Link>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Unlink"
                    disabled={unlinkingId !== null}
                    onClick={() => handleUnlink(rel)}
                  >
                    <Unlink />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Dialog
        open={editOpen}
        onOpenChange={(next) => {
          setEditOpen(next);
        }}
      >
        <DialogShell
          icon={Pencil}
          title="Edit memory"
          footer={
            <div className="flex flex-col-reverse gap-2 border-t border-border/40 bg-muted/50 p-4 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-memory-form"
                disabled={!editTitle.trim()}
              >
                Save changes
              </Button>
            </div>
          }
        >
          <form
            id="edit-memory-form"
            onSubmit={handleEdit}
            className="space-y-4 p-5"
          >
            <div className="space-y-1.5">
              <FieldLabel htmlFor="edit-memory-title">Title</FieldLabel>
              <Input
                id="edit-memory-title"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                placeholder="Memory title"
                maxLength={300}
                required
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="edit-memory-description">
                Description
              </FieldLabel>
              <Textarea
                id="edit-memory-description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                placeholder="Why did you save this?"
                rows={3}
                maxLength={2000}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="edit-memory-content">Content</FieldLabel>
              <Textarea
                id="edit-memory-content"
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                placeholder="The original content of this memory"
                rows={8}
                maxLength={200_000}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="edit-memory-tags">Tags</FieldLabel>
              <Input
                id="edit-memory-tags"
                value={editTags}
                onChange={(event) => setEditTags(event.target.value)}
                placeholder="research, ideas, follow-up"
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Separate tags with commas.
              </p>
            </div>
          </form>
        </DialogShell>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogShell
          icon={Trash2}
          title="Delete memory"
          description={`“${memory.title}” and its stored content will be permanently removed.`}
          tone="destructive"
          footer={
            <div className="flex flex-col-reverse gap-2 border-t border-border/40 bg-muted/50 p-4 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete memory"}
              </Button>
            </div>
          }
        >
          <p className="px-5 py-4 text-sm text-muted-foreground">
            This cannot be undone. Any attached file is removed as well.
          </p>
        </DialogShell>
      </Dialog>

      <Dialog
        open={linkOpen}
        onOpenChange={(next) => {
          setLinkOpen(next);
          if (!next) {
            setLinkQuery("");
            setSelectedTargetId(null);
          }
        }}
      >
        <DialogShell
          icon={Link2}
          title="Link a memory"
          description="Connect this memory to another one in your library."
          className="sm:max-w-lg"
          footer={
            <div className="flex items-center justify-between gap-2 border-t border-border/40 bg-muted/50 p-4 sm:justify-end">
              <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {selectedTarget ? selectedTarget.title : "Select a memory"}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setLinkOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLink} disabled={!selectedTargetId || linking}>
                  {linking ? "Linking…" : "Link"}
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4 p-5">
            <div className="space-y-1.5">
              <FieldLabel>Relationship</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {RELATIONSHIP_TYPES.map((type) => (
                  <Button
                    key={type}
                    type="button"
                    size="xs"
                    variant={linkType === type ? "default" : "outline"}
                    aria-pressed={linkType === type}
                    onClick={() => setLinkType(type)}
                  >
                    {RELATIONSHIP_LABELS[type]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={linkQuery}
                onChange={(event) => setLinkQuery(event.target.value)}
                placeholder="Search your library…"
                className="pl-9"
                aria-label="Search memories to link"
              />
            </div>

            {linkCandidates.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {allMemories.length - linkedIds.size <= 1
                  ? "There are no other memories to link."
                  : "No memories match your search."}
              </p>
            ) : (
              <ul className="max-h-[45dvh] divide-y divide-border/60 overflow-y-auto app-control border border-border">
                {linkCandidates.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedTargetId(item.id)}
                      aria-pressed={selectedTargetId === item.id}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60 aria-pressed:bg-muted ${
                        selectedTargetId === item.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.domain ?? formatDate(item.createdAt)}
                        </p>
                      </div>
                      {selectedTargetId === item.id && (
                        <Badge variant="outline">Selected</Badge>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogShell>
      </Dialog>

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
