"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileDown,
  FolderPlus,
  FolderPen,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { Collection, Memory } from "@/lib/types";
import {
  addMemoryToCollectionAction,
  deleteCollectionAction,
  removeMemoryFromCollectionAction,
  summarizeCollectionPdfAction,
  updateCollectionAction,
} from "@/features/collections/actions";
import { MemoryCard } from "@/components/memories/memory-card";
import { EmptyState } from "@/components/layout/empty-state";
import { ToastViewport, useToasts } from "@/components/layout/toasts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { DialogShell, FieldLabel } from "@/components/ui/dialog-shell";
import { accentBar, accentSoft } from "./accents";

interface CollectionDetailProps {
  collection: Collection;
  memories: Memory[];
  availableMemories: Memory[];
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CollectionDetail({
  collection,
  memories,
  availableMemories,
}: CollectionDetailProps) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [, startTransition] = useTransition();

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const [editDescription, setEditDescription] = useState(collection.description);
  const [editEmoji, setEditEmoji] = useState(collection.emoji);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  const candidateMemories = useMemo(() => {
    const query = addQuery.trim().toLowerCase();
    if (!query) return availableMemories;
    return availableMemories.filter(
      (memory) =>
        memory.title.toLowerCase().includes(query) ||
        memory.content.toLowerCase().includes(query)
    );
  }, [availableMemories, addQuery]);

  function openEdit() {
    setEditName(collection.name);
    setEditDescription(collection.description);
    setEditEmoji(collection.emoji);
    setEditOpen(true);
  }

  function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editName.trim()) return;
    startTransition(async () => {
      const result = await updateCollectionAction(collection.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        emoji: editEmoji.trim() || undefined,
      });
      if (!result.ok) {
        push(result.error ?? "Could not update the collection.", "error");
        return;
      }
      push("Collection updated.", "success");
      setEditOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    startTransition(async () => {
      const result = await deleteCollectionAction(collection.id);
      if (!result.ok) {
        setDeleting(false);
        push(result.error ?? "Could not delete the collection.", "error");
        return;
      }
      push("Collection deleted.", "success");
      router.push("/collections");
      router.refresh();
    });
  }

  function handleAdd(memoryId: string) {
    if (addingId) return;
    setAddingId(memoryId);
    startTransition(async () => {
      const result = await addMemoryToCollectionAction(
        collection.id,
        memoryId
      );
      setAddingId(null);
      if (!result.ok) {
        push(result.error ?? "Could not add the memory.", "error");
        return;
      }
      push("Memory added to collection.", "success");
      router.refresh();
    });
  }

  async function handleSummarize() {
    if (summarizing) return;
    setSummarizing(true);
    try {
      const result = await summarizeCollectionPdfAction(collection.id);
      if (!result.ok || !result.data) {
        push(result.error ?? "Could not summarize this collection.", "error");
        return;
      }
      const bytes = Uint8Array.from(atob(result.data), (char) =>
        char.charCodeAt(0)
      );
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename ?? "collection-summary.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      push(
        result.degraded
          ? "AI was unavailable, so the PDF is a note instead of a summary."
          : "Summary downloaded.",
        result.degraded ? "error" : "success"
      );
    } catch {
      push("Could not summarize this collection.", "error");
    } finally {
      setSummarizing(false);
    }
  }

  function handleRemove(memoryId: string) {
    if (removingId) return;
    setRemovingId(memoryId);
    startTransition(async () => {
      const result = await removeMemoryFromCollectionAction(
        collection.id,
        memoryId
      );
      setRemovingId(null);
      if (!result.ok) {
        push(result.error ?? "Could not remove the memory.", "error");
        return;
      }
      push("Memory removed from collection.", "success");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Collections
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl ${accentSoft(collection.color)}`}
          >
            {collection.emoji || <FolderPen className="size-6" />}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold tracking-tight text-heading">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                {collection.description}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {collection.memoryCount}{" "}
              {collection.memoryCount === 1 ? "memory" : "memories"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSummarize}
            disabled={summarizing || memories.length === 0}
          >
            {summarizing ? <FileDown /> : <Sparkles />}
            {summarizing ? "Summarizing…" : "Summarize"}
          </Button>
          <Button variant="outline" size="sm" onClick={openEdit}>
            <FolderPen />
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
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <FolderPlus />
            Add memories
          </Button>
        </div>
      </div>

      <div className={`h-1 w-full rounded-full ${accentBar(collection.color)}`} aria-hidden />

      {memories.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="This collection is empty"
          description="Add memories from your library to start building this collection."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <FolderPlus />
              Add memories
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory) => (
            <div key={memory.id} className="relative">
              <MemoryCard memory={memory} />
              <button
                type="button"
                aria-label={`Remove ${memory.title} from collection`}
                disabled={removingId !== null}
                onClick={() => handleRemove(memory.id)}
                className="absolute -top-2 -right-2 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogShell
          icon={FolderPen}
          title="Edit collection"
          footer={
            <div className="flex flex-col-reverse gap-2 border-t border-border/40 bg-muted/50 p-4 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-collection-form"
                disabled={!editName.trim()}
              >
                Save changes
              </Button>
            </div>
          }
        >
          <form
            id="edit-collection-form"
            onSubmit={handleEdit}
            className="space-y-4 p-5"
          >
            <div className="space-y-1.5">
              <FieldLabel htmlFor="edit-collection-name">Name</FieldLabel>
              <Input
                id="edit-collection-name"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                placeholder="Collection name"
                maxLength={120}
                required
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="edit-collection-description">
                Description
              </FieldLabel>
              <Textarea
                id="edit-collection-description"
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                placeholder="What belongs in this collection?"
                rows={3}
                maxLength={1000}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel htmlFor="edit-collection-emoji">Emoji</FieldLabel>
              <Input
                id="edit-collection-emoji"
                value={editEmoji}
                onChange={(event) => setEditEmoji(event.target.value)}
                placeholder="✨"
                maxLength={16}
                className="w-24"
              />
            </div>
          </form>
        </DialogShell>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogShell
          icon={Trash2}
          title="Delete collection"
          description={`“${collection.name}” will be removed. The memories inside it stay in your library.`}
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
                {deleting ? "Deleting…" : "Delete collection"}
              </Button>
            </div>
          }
        >
          <p className="px-5 py-4 text-sm text-muted-foreground">
            This only removes the collection itself. Its memories will remain
            available in your library.
          </p>
        </DialogShell>
      </Dialog>

      <Dialog
        open={addOpen}
        onOpenChange={(next) => {
          setAddOpen(next);
          if (!next) setAddQuery("");
        }}
      >
        <DialogShell
          icon={FolderPlus}
          title="Add memories"
          description="Pick memories from your library to add to this collection."
          className="sm:max-w-lg"
          footer={
            <div className="flex justify-end border-t border-border/40 bg-muted/50 p-4">
              <Button variant="outline" onClick={() => setAddOpen(false)}>
                Done
              </Button>
            </div>
          }
        >
          <div className="space-y-3 p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={addQuery}
                onChange={(event) => setAddQuery(event.target.value)}
                placeholder="Search your library…"
                className="pl-9"
                aria-label="Search memories to add"
              />
            </div>

            {candidateMemories.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {availableMemories.length === 0
                  ? "Every memory in your library is already in this collection."
                  : "No memories match your search."}
              </p>
            ) : (
              <ul className="max-h-[50dvh] divide-y divide-border/60 overflow-y-auto app-control border border-border">
                {candidateMemories.map((memory) => (
                  <li
                    key={memory.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {memory.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {memory.domain ?? formatDate(memory.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleAdd(memory.id)}
                      disabled={addingId !== null}
                    >
                      {addingId === memory.id ? (
                        "Adding…"
                      ) : (
                        <>
                          <Plus />
                          Add
                        </>
                      )}
                    </Button>
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
