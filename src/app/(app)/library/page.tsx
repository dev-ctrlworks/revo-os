"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  CheckSquare,
  LayoutGrid,
  List,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { MemoryType } from "@/lib/types";
import { useMemoryStore } from "@/lib/use-memory-store";
import { removeMemory } from "@/lib/memory-store";
import { memoryTypeMeta } from "@/lib/memory-type";
import {
  MemoryCard,
  MemoryCardFeedRow,
} from "@/components/memories/memory-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const typeFilters = Object.keys(memoryTypeMeta) as MemoryType[];

type SortKey = "recent" | "oldest" | "title";

const sortLabels: Record<SortKey, string> = {
  recent: "Newest first",
  oldest: "Oldest first",
  title: "Title A–Z",
};

export default function LibraryPage() {
  const memories = useMemoryStore();
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<MemoryType>>(
    () => new Set()
  );
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const list = memories.filter((m) => {
      if (selectedTypes.size > 0 && !selectedTypes.has(m.type)) return false;
      if (!tokens.length) return true;
      const haystack = `${m.title} ${m.content} ${m.tags.join(" ")} ${m.collection}`.toLowerCase();
      return tokens.every((t) => haystack.includes(t));
    });
    return [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      const da = +new Date(a.createdAt);
      const db = +new Date(b.createdAt);
      return sort === "oldest" ? da - db : db - da;
    });
  }, [memories, query, selectedTypes, sort]);

  const filterLabel =
    selectedTypes.size === 0
      ? "All types"
      : selectedTypes.size === 1
        ? memoryTypeMeta[[...selectedTypes][0]].label
        : `${selectedTypes.size} types`;

  function toggleType(type: MemoryType) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function toggleSelect(id: string, isSelected: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (isSelected) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  function removeSelected() {
    for (const id of selected) removeMemory(id);
    exitSelectMode();
  }

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Library
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} of {memories.length} memories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectMode ? "secondary" : "outline"}
            size="sm"
            className="rounded-lg"
            onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
          >
            <CheckSquare className="mr-1.5 size-3.5" />
            {selectMode ? "Cancel" : "Select"}
          </Button>
          <div className="flex items-center rounded-lg border border-border p-0.5">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-colors",
                view === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground"
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => {
                setView("list");
                if (selectMode) exitSelectMode();
              }}
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-colors",
                view === "list" ? "bg-secondary text-foreground" : "text-muted-foreground"
              )}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your library…"
            className="h-10 rounded-lg pl-9"
            aria-label="Search library"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="sm" className="rounded-lg" />}
          >
            {filterLabel}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedTypes.size === 0}
                onCheckedChange={() => setSelectedTypes(new Set())}
              >
                All types
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {typeFilters.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.has(type)}
                  onCheckedChange={() => toggleType(type)}
                >
                  {memoryTypeMeta[type].label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="sm" className="rounded-lg" />}
          >
            <ArrowDownUp className="mr-1.5 size-3.5" />
            {sortLabels[sort]}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={sort === key}
                onCheckedChange={() => setSort(key)}
              >
                {sortLabels[key]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-4 py-2.5">
          <span className="text-sm font-medium">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg"
              onClick={() =>
                setSelected(allSelected ? new Set() : new Set(filtered.map((m) => m.id)))
              }
            >
              {allSelected ? "Clear" : "Select all"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-lg"
              disabled={selected.size === 0}
              onClick={removeSelected}
            >
              <Trash2 className="mr-1.5 size-3.5" />
              Remove
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-lg"
              aria-label="Exit selection"
              onClick={exitSelectMode}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-base font-semibold">No memories found</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {memories.length === 0
              ? "Capture your first memory to get started."
              : "Try a different search or clear the type filter."}
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              variant="grid"
              selected={selected.has(memory.id)}
              onSelect={selectMode ? toggleSelect : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {filtered.map((memory, i) => (
            <MemoryCardFeedRow
              key={memory.id}
              memory={memory}
              last={i === filtered.length - 1}
            />
          ))}
        </div>
      )}

      {view === "grid" && !selectMode && filtered.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Tip: use Select to remove memories in bulk.
        </p>
      )}
    </div>
  );
}
