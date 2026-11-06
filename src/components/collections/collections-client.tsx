"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderHeart, FolderPlus, Sparkles } from "lucide-react";
import type { Collection } from "@/lib/types";
import { createCollectionAction } from "@/features/collections/actions";
import { generateCollectionsAction, createFromSuggestionsAction } from "@/features/collections/auto-generate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogShell, FieldLabel } from "@/components/ui/dialog-shell";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ToastViewport, useToasts } from "@/components/layout/toasts";
import { accentBar, accentSoft } from "./accents";
import { resolveEntitlements, type PlanId } from "@/config/pricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CollectionsClientProps {
  collections: Collection[];
  planId?: PlanId;
}

export function CollectionsClient({ collections, planId = "free" }: CollectionsClientProps) {
  const entitlements = resolveEntitlements(planId);
  const canAuto = entitlements.autoCollections;
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("");
  const [pending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [creating, setCreating] = useState(false);

  function resetForm() {
    setName("");
    setDescription("");
    setEmoji("");
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !name.trim()) return;
    startTransition(async () => {
      const result = await createCollectionAction({
        name: name.trim(),
        description: description.trim() || undefined,
        emoji: emoji.trim() || undefined,
      });
      if (!result.ok) {
        push(result.error ?? "Could not create the collection.", "error");
        return;
      }
      push("Collection created.", "success");
      setOpen(false);
      resetForm();
      router.refresh();
    });
  }

  async function handleGenerate() {
    if (!canAuto) {
      push("Automated collections are available on Plus and Pro.", "error");
      return;
    }
    setGenerating(true);
    try {
      const result = await generateCollectionsAction();
      if (result.ok && result.collections) {
        setSuggestions(result.collections);
        push("Collections suggested", "success");
      } else {
        push(result.error ?? "Could not generate collections.", "error");
      }
    } catch {
      push("Could not generate collections.", "error");
    } finally {
      setGenerating(false);
    }
  }

  async function handleCreateFromSuggestions() {
    if (suggestions.length === 0) return;
    setCreating(true);
    try {
      const result = await createFromSuggestionsAction(suggestions);
      if (result.ok) {
        setSuggestions([]);
        push("Collections created", "success");
        router.refresh();
      } else {
        push(result.error ?? "Could not create collections.", "error");
      }
    } catch {
      push("Could not create collections.", "error");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Collections"
        description={
          collections.length === 0
            ? "Group related memories into collections."
            : `${collections.length} ${collections.length === 1 ? "collection" : "collections"}`
        }
        actions={
          <Dialog
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              if (!next) resetForm();
            }}
          >
            <DialogTrigger
              render={
                <Button>
                  <FolderPlus />
                  New collection
                </Button>
              }
            />
            <DialogShell
              icon={FolderPlus}
              title="New collection"
              description="Collections group related memories so you can revisit them together."
              footer={
                <div className="flex flex-col-reverse gap-2 border-t border-border/40 bg-muted/50 p-4 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={pending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="create-collection-form"
                    disabled={pending || !name.trim()}
                  >
                    {pending ? "Creating…" : "Create collection"}
                  </Button>
                </div>
              }
            >
              <form
                id="create-collection-form"
                onSubmit={handleCreate}
                className="space-y-4 p-5"
              >
                <div className="space-y-1.5">
                  <FieldLabel htmlFor="collection-name">Name</FieldLabel>
                  <Input
                    id="collection-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Research, Recipes, Travel…"
                    maxLength={120}
                    autoFocus
                    required
                  />
                </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="collection-description">
                  Description
                </FieldLabel>
                <Textarea
                  id="collection-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What belongs in this collection?"
                  rows={3}
                  maxLength={1000}
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="collection-emoji">Emoji</FieldLabel>
                <Input
                  id="collection-emoji"
                  value={emoji}
                  onChange={(event) => setEmoji(event.target.value)}
                  placeholder="✨"
                  maxLength={16}
                  className="w-24"
                />
              </div>
            </form>
            </DialogShell>
          </Dialog>
        }
      />

      {collections.length === 0 ? (
        <EmptyState
          icon={FolderHeart}
          title="No collections yet"
          description="Create a collection to group related memories together."
          action={
            <Button onClick={() => setOpen(true)}>
              <FolderPlus />
              New collection
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="app-lift app-card relative flex flex-col gap-3 overflow-hidden p-4 pt-5 hover:border-primary/25"
            >
              <span
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 ${accentBar(collection.color)}`}
              />
              <div className="flex items-start gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg ${accentSoft(collection.color)}`}
                >
                  {collection.emoji || <FolderHeart className="size-5" />}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-heading">
                    {collection.name}
                  </h2>
                  {collection.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {collection.description}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {collection.memoryCount}{" "}
                {collection.memoryCount === 1 ? "memory" : "memories"}
              </p>
            </Link>
          ))}
        </div>
      )}

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
