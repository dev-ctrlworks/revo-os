"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Star, Library as LibraryIcon } from "lucide-react";
import type { Memory } from "@/lib/types";
import type { ListMemoriesInput } from "@/features/memories/schema";
import type { MemoryListResult } from "@/features/memories/queries";
import { MEMORY_TYPES } from "@/features/memories/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MemoryCard } from "@/components/memories/memory-card";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { toggleFavoriteAction } from "@/features/memories/actions";
import { updateMemoryLocal } from "@/lib/memory-store";
import { memoryTypeLabel } from "@/lib/memory-type";

interface LibraryClientProps {
  result: MemoryListResult;
  filters: ListMemoriesInput;
}

const TYPE_OPTIONS: Record<string, string> = {
  all: "All types",
  ...Object.fromEntries(MEMORY_TYPES.map((type) => [type, memoryTypeLabel(type)])),
};

const SORT_OPTIONS: Record<string, string> = {
  newest: "Newest",
  oldest: "Oldest",
  title: "Title",
};

export function LibraryClient({ result, filters }: LibraryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.search ?? "");

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  function goToPage(page: number) {
    const next = new URLSearchParams(searchParams.toString());
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  }

  async function handleToggleFavorite(memory: Memory) {
    const nextFav = !memory.favorite;
    updateMemoryLocal(memory.id, { favorite: nextFav });
    const res = await toggleFavoriteAction(memory.id, nextFav);
    if (!res.ok) updateMemoryLocal(memory.id, { favorite: memory.favorite });
  }

  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Library"
        description={`${result.total} ${result.total === 1 ? "memory" : "memories"}`}
        actions={<Button render={<Link href="/capture" />}>Capture</Button>}
      />

      <div className="app-panel flex flex-wrap items-center gap-2 p-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateParams({ search: search || null });
          }}
          className="relative flex-1 min-w-[220px]"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search memories…"
            className="app-control border-transparent bg-muted pl-9 shadow-none"
            aria-label="Search memories"
          />
        </form>

        <Select
          items={TYPE_OPTIONS}
          value={filters.type ?? "all"}
          onValueChange={(value) =>
            updateParams({ type: value === "all" ? null : String(value) })
          }
        >
          <SelectTrigger
            aria-label="Filter by type"
            className="app-control h-10 min-w-[9.5rem] justify-between border-border bg-background px-3 text-foreground data-[size=default]:h-10"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="app-control p-1 shadow-[0_12px_32px_-16px_rgba(33,22,76,0.35)]">
            {Object.entries(TYPE_OPTIONS).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
                className="rounded-[10px] py-2 pl-2.5 data-highlighted:bg-primary/8 data-selected:font-medium"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={SORT_OPTIONS}
          value={filters.sort}
          onValueChange={(value) => updateParams({ sort: String(value) })}
        >
          <SelectTrigger
            aria-label="Sort"
            className="app-control h-10 min-w-[7.5rem] justify-between border-border bg-background px-3 text-foreground data-[size=default]:h-10"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="app-control p-1 shadow-[0_12px_32px_-16px_rgba(33,22,76,0.35)]">
            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
                className="rounded-[10px] py-2 pl-2.5 data-highlighted:bg-primary/8 data-selected:font-medium"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant={filters.favorite ? "secondary" : "outline"}
          className="app-control"
          onClick={() => updateParams({ favorite: filters.favorite ? null : "1" })}
          aria-pressed={filters.favorite}
        >
          <Star className={filters.favorite ? "fill-favorite text-favorite" : ""} />
          Favorites
        </Button>
      </div>

      {isPending && (
        <p className="text-sm text-muted-foreground" role="status">
          Loading…
        </p>
      )}

      {result.memories.length === 0 ? (
        <EmptyState
          icon={LibraryIcon}
          title="No memories found"
          description={
            filters.search || filters.type || filters.favorite
              ? "Try clearing your filters or searching for something else."
              : "Capture your first memory to start building your layer."
          }
          action={
            <Button render={<Link href="/capture" />}>Capture a memory</Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={result.page <= 1}
            onClick={() => goToPage(result.page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {result.page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={result.page >= totalPages}
            onClick={() => goToPage(result.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
