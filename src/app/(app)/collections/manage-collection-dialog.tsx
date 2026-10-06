"use client";

import { ArrowRightLeft, Check } from "lucide-react";
import { useState } from "react";
import { useMemoryStore } from "@/lib/use-memory-store";
import {
  moveMemoryToCollection,
  removeMemoryFromCollection,
} from "@/lib/memory-store";
import { CollectionPicker } from "@/components/memories/collection-picker";
import { MemoryTypeIcon } from "@/components/memories/memory-type-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import {
  DialogShell,
  FieldLabel,
  HelperText,
} from "@/components/ui/dialog-shell";
import { cn } from "@/lib/utils";

export function ManageCollectionDialog({
  open,
  onOpenChange,
  name,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
}) {
  const memories = useMemoryStore();
  const members = memories.filter((m) => m.collection === name);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [destination, setDestination] = useState("");

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const clear = () => {
    setSelected(new Set());
    setDestination("");
    onOpenChange(false);
  };

  const handleRemove = () => {
    for (const id of selected) removeMemoryFromCollection(id);
    clear();
  };

  const handleMove = () => {
    if (!destination.trim() || destination === name) return;
    for (const id of selected) moveMemoryToCollection(id, destination);
    clear();
  };

  const label = (n: number) => `${n} ${n === 1 ? "memory" : "memories"}`;

  return (
    <Dialog open={open} onOpenChange={clear}>
      <DialogShell
        icon={ArrowRightLeft}
        title="Organize memories"
        description={`${label(members.length)} in ${name}. Pick some, then remove or move them.`}
        footer={
          <DialogFooter
            className="-mx-0 -mb-0 flex-col-reverse gap-3 px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6"
          >
            <div className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <FieldLabel htmlFor="manage-move-target">
                  Move selected to
                </FieldLabel>
                <CollectionPicker
                  id="manage-move-target"
                  value={destination}
                  onChange={setDestination}
                />
              </div>
              <Button
                variant="secondary"
                className="rounded-lg"
                onClick={handleMove}
                disabled={
                  selected.size === 0 ||
                  !destination.trim() ||
                  destination === name
                }
              >
                Move
              </Button>
            </div>
            <div className="flex items-center justify-end gap-2 sm:justify-end">
              <Button
                variant="outline"
                className="rounded-lg"
                onClick={() => onOpenChange(false)}
              >
                Done
              </Button>
              <Button
                variant="destructive"
                className="rounded-lg"
                onClick={handleRemove}
                disabled={selected.size === 0}
              >
                Remove
              </Button>
            </div>
          </DialogFooter>
        }
      >
        <div className="space-y-3 px-5 py-5 sm:px-6 sm:py-6">
          {members.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nothing here yet — add memories first.
            </p>
          ) : (
            <>
              <HelperText>
                {selected.size > 0
                  ? `${selected.size} selected`
                  : "Select memories to organize."}
              </HelperText>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {members.map((memory) => (
                  <button
                    key={memory.id}
                    type="button"
                    role="checkbox"
                    aria-checked={selected.has(memory.id)}
                    onClick={() => toggle(memory.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                      selected.has(memory.id)
                        ? "border-indigo-500/50 bg-indigo-500/5"
                        : "border-border/50 bg-card/60 hover:border-border hover:bg-card"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                        selected.has(memory.id)
                          ? "border-indigo-500 bg-indigo-500 text-white"
                          : "border-border bg-background"
                      )}
                    >
                      {selected.has(memory.id) && <Check className="size-3.5" />}
                    </span>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-xs text-muted-foreground">
                      <MemoryTypeIcon type={memory.type} size="sm" />
                    </span>
                    <span className="line-clamp-1 min-w-0 flex-1 text-sm font-medium">
                      {memory.title}
                    </span>
                  </button>
                ))}
              </div>
              <HelperText>
                Removing moves memories back to &ldquo;New captures&rdquo;. Moving
                re-files them to another collection.
              </HelperText>
            </>
          )}
        </div>
      </DialogShell>
    </Dialog>
  );
}