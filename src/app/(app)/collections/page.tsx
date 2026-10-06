"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, FolderPlus, LayoutGrid, Sparkles } from "lucide-react";
import { useMemoryStore } from "@/lib/use-memory-store";
import {
  resolveCollectionMeta,
  useCollectionNames,
} from "@/lib/use-collection-meta";
import { suggestAICollections } from "@/lib/ai-collections";
import {
  createCollection,
  moveMemoryToCollection,
} from "@/lib/memory-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreateCollectionDialog } from "@/app/(app)/collections/collection-create-dialog";
import { saveButtonClass } from "@/app/(app)/collections/collection-options";

type CollectionCardProps = {
  name: string;
  emoji: string;
  description: string;
  color: string;
  generated?: boolean;
  memoryCount: number;
};

export function CollectionCard({
  name,
  emoji,
  description,
  color,
  generated,
  memoryCount,
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${encodeURIComponent(name)}`}
      className="group block h-full"
    >
      <Card className="relative flex h-full flex-col gap-0 overflow-hidden border-border/50 p-0 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-xl hover:shadow-indigo-500/5">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-50 transition-opacity duration-300 group-hover:opacity-90",
            color
          )}
        />
        <div className="relative flex h-full flex-col p-4">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card/80 text-base shadow-sm ring-1 ring-border/40 backdrop-blur">
              {emoji}
            </span>
            {generated ? (
              <Badge className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-2 py-0.5 text-[10px] font-medium text-white">
                AI-curated
              </Badge>
            ) : (
              <span className="rounded-md bg-card/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-sm ring-1 ring-border/40 backdrop-blur">
                {memoryCount}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold tracking-tight">{name}</h3>
          <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
            <span className="text-[11px] text-muted-foreground">
              {generated ? "Auto-built" : `${memoryCount} ${memoryCount === 1 ? "memory" : "memories"}`}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-foreground">
              Open
              <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function AISuggestionCard({
  name,
  emoji,
  description,
  color,
  memoryCount,
  busy,
  onCreate,
}: CollectionCardProps & {
  busy: boolean;
  onCreate: () => void;
}) {
  return (
    <Card className="relative flex h-full flex-col gap-0 overflow-hidden border-dashed border-indigo-500/30 p-0 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-b opacity-40",
          color
        )}
      />
      <div className="relative flex h-full flex-col p-4">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card/80 text-base shadow-sm ring-1 ring-border/40 backdrop-blur">
            {emoji}
          </span>
          <Badge className="bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-500 ring-1 ring-inset ring-indigo-500/20">
            AI-suggested
          </Badge>
        </div>
        <h3 className="text-sm font-semibold tracking-tight">{name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-2.5">
          <span className="text-[11px] text-muted-foreground">
            {memoryCount} {memoryCount === 1 ? "memory" : "memories"} spotted
          </span>
          <Button
            size="sm"
            onClick={onCreate}
            disabled={busy}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs",
              busy ? "bg-emerald-500 text-white" : saveButtonClass
            )}
          >
            {busy ? (
              <>
                <Check className="mr-1 size-3" />
                Created
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function CollectionsPage() {
  const memories = useMemoryStore();
  const collectionNames = useCollectionNames();
  const [notice, setNotice] = useState<string | null>(null);
  const [creating, setCreating] = useState<Set<string>>(new Set());

  const yourCollections = useMemo(() => {
    const counts = new Map<string, number>();
    memories.forEach((m) =>
      counts.set(m.collection, (counts.get(m.collection) ?? 0) + 1)
    );
    return collectionNames
      .map((name) => ({
        name,
        memoryCount: counts.get(name) ?? 0,
        ...resolveCollectionMeta(name),
      }))
      .sort((a, b) => b.memoryCount - a.memoryCount || a.name.localeCompare(b.name));
  }, [memories, collectionNames]);

  const suggestions = useMemo(
    () => suggestAICollections(memories, collectionNames),
    [memories, collectionNames]
  );

  const createFromSuggestion = (name: string, memoryCount: number) => {
    const suggestion = suggestions.find((s) => s.name === name);
    if (!suggestion) return;
    createCollection(suggestion.name, {
      emoji: suggestion.emoji,
      description: suggestion.description,
      color: suggestion.color,
      aiGenerated: true,
    });
    for (const id of suggestion.memberIds) {
      moveMemoryToCollection(id, suggestion.name);
    }
    setCreating((prev) => new Set(prev).add(suggestion.name));
    setNotice(`AI-created “${suggestion.name}” with ${memoryCount} ${memoryCount === 1 ? "memory" : "memories"}.`);
    setTimeout(() => setNotice(null), 3200);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-cyan-400/15">
              <LayoutGrid className="size-4 text-indigo-500" />
            </span>
            <span className="text-gradient">Collections</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Revo OS groups related memories automatically — you stay in control.
          </p>
        </div>
        <CreateCollectionDialog
          onCreated={(name) => setNotice(`Created “${name}”`)}
        />
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-sm text-indigo-600">
          <Check className="size-4 shrink-0" />
          {notice}
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-indigo-500" />
          <h2 className="text-sm font-semibold">Suggested by AI</h2>
          <span className="ml-auto hidden text-[11px] text-muted-foreground sm:block">
            Detected from shared tags and related content
          </span>
        </div>

        {suggestions.length === 0 ? (
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border/70 px-5 py-8 text-sm text-muted-foreground">
            <Sparkles className="size-5 text-indigo-500/70" />
            <span>
              You&apos;re all organized — Revo OS couldn&apos;t find any new
              groups to suggest. Capture more and they&apos;ll show up here.
            </span>
          </div>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {suggestions.map((suggestion) => (
              <AISuggestionCard
                key={suggestion.id}
                name={suggestion.name}
                emoji={suggestion.emoji}
                description={suggestion.description}
                color={suggestion.color}
                memoryCount={suggestion.memberIds.length}
                busy={creating.has(suggestion.name)}
                onCreate={() =>
                  createFromSuggestion(suggestion.name, suggestion.memberIds.length)
                }
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Your collections</h2>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {yourCollections.map((collection) => (
            <CollectionCard
              key={collection.name}
              {...collection}
              generated={Boolean(collection.aiGenerated)}
            />
          ))}
          <CreateCollectionDialog
            onCreated={(name) => setNotice(`Created “${name}”`)}
            trigger={
              <button
                type="button"
                className="group flex h-full min-h-36 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/30 p-4 text-center transition-colors hover:border-indigo-500/40 hover:bg-card/60"
              >
                <span className="flex flex-col items-center gap-2 text-muted-foreground">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-muted/60 transition-colors group-hover:text-indigo-500">
                    <FolderPlus className="size-4" />
                  </span>
                  <span className="text-xs font-medium">New collection</span>
                </span>
              </button>
            }
          />
        </div>
      </section>
    </div>
  );
}