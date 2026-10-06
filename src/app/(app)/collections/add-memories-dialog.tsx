"use client";

import { Check, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import type { Memory } from "@/lib/types";
import { suggestMemoriesForCollection } from "@/lib/ai-collections";
import { moveMemoryToCollection } from "@/lib/memory-store";
import { useMemoryStore } from "@/lib/use-memory-store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DialogShell, FieldLabel } from "@/components/ui/dialog-shell";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { saveButtonClass } from "@/app/(app)/collections/collection-options";
import {
  MemoryTypeIcon,
  memoryTypeLabel,
} from "@/components/memories/memory-type-icon";

export function AddMemoriesDialog({
  name,
  trigger,
}: {
  name: string;
  trigger?: ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [justAdded, setJustAdded] = useState(0);
  const all = useMemoryStore();

  const notInCollection = useMemo(
    () => all.filter((m) => m.collection !== name),
    [all, name]
  );

  const { suggestions: aiSuggestions, ids: suggestedIds } = useMemo(() => {
    const list = suggestMemoriesForCollection(all, name);
    return { suggestions: list.slice(0, 8), ids: new Set(list.map((m) => m.id)) };
  }, [all, name]);

  const manualList = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return notInCollection.filter((m) => !suggestedIds.has(m.id));
    return notInCollection.filter(
      (m) =>
        m.title.toLowerCase().includes(lower) ||
        m.content.toLowerCase().includes(lower) ||
        m.collection.toLowerCase().includes(lower) ||
        m.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }, [notInCollection, suggestedIds, query]);

  const visibleManual = manualList.filter((m) => !suggestedIds.has(m.id));

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleAdd = () => {
    let count = 0;
    for (const id of selected) {
      moveMemoryToCollection(id, name);
      count++;
    }
    setJustAdded(count);
    setSelected(new Set());
    setTimeout(() => setJustAdded(0), 2000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSelected(new Set());
          setQuery("");
        }
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 rounded-lg"
              aria-label={`Add memories to ${name}`}
            >
              <Sparkles className="mr-1.5 size-3.5 text-indigo-500" />
              Add memories
            </Button>
          )
        }
      />
      <DialogShell
        icon={Sparkles}
        title="Add memories"
        description="Revo OS found related memories. Pick any to add, or search and add manually."
        footer={
          <DialogFooter className="-mx-0 -mb-0 px-5 py-4 sm:px-6">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAdd();
                setOpen(false);
              }}
              disabled={selected.size === 0}
              className={saveButtonClass}
            >
{justAdded
            ? `Added ${justAdded}`
            : `Add ${selected.size} ${selected.size === 1 ? "memory" : "memories"}`}
        </Button>
          </DialogFooter>
        }
      >
        <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
          <div>
            <FieldLabel htmlFor="add-memories-search">
              <span className="sr-only">Search memories</span>
            </FieldLabel>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="add-memories-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all other memories..."
                className="pl-9"
              />
            </div>
          </div>

          {aiSuggestions.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Sparkles className="size-3 text-indigo-500" />
                Suggested by AI
              </h4>
              <div className="space-y-2">
                {aiSuggestions.map((memory) => (
                  <MemoryRow
                    key={memory.id}
                    memory={memory}
                    selected={selected.has(memory.id)}
                    onToggle={() => toggle(memory.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {visibleManual.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
                {aiSuggestions.length ? "All others" : "All memories"}
              </h4>
              <div className="space-y-2">
                {visibleManual.slice(0, 24).map((memory) => (
                  <MemoryRow
                    key={memory.id}
                    memory={memory}
                    selected={selected.has(memory.id)}
                    onToggle={() => toggle(memory.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogShell>
    </Dialog>
  );
}

function MemoryRow({
  memory,
  selected,
  onToggle,
}: {
  memory: Memory;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={memory.title}
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
        selected
          ? "border-indigo-500/50 bg-indigo-500/5"
          : "border-border/50 bg-card/60 hover:border-border hover:bg-card"
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          selected
            ? "border-indigo-500 bg-indigo-500 text-white"
            : "border-border bg-background"
        )}
      >
        {selected && <Check className="size-3.5" />}
      </span>

      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <MemoryTypeIcon type={memory.type} size="sm" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="line-clamp-1 block text-sm font-medium">
          {memory.title}
        </span>
        <span className="line-clamp-1 block text-[11px] text-muted-foreground">
          {memory.collection !== "New captures" && memory.collection}
          {memory.collection !== "New captures" && " · "}
          {memoryTypeLabel(memory.type)}
        </span>
      </span>
    </button>
  );
}