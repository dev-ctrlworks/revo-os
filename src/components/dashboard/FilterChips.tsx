"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { X, Tag, Calendar, Star, FolderGit2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MemoryType } from "@/lib/types";

const MEMORY_TYPES: { value: MemoryType; label: string }[] = [
  { value: "screenshot", label: "Screenshots" },
  { value: "note", label: "Notes" },
  { value: "document", label: "Documents" },
  { value: "link", label: "Links" },
  { value: "image", label: "Images" },
  { value: "discussion", label: "Discussions" },
  { value: "email", label: "Emails" },
  { value: "archive", label: "Archives" },
];

const DATE_RANGES = [
  { value: "", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "quarter", label: "This quarter" },
  { value: "year", label: "This year" },
];

interface FeedFiltersState {
  types: MemoryType[];
  collections: string[];
  dateRange: string;
  favoriteOnly: boolean;
  search: string;
}

interface FilterChipsProps {
  filters: FeedFiltersState;
  onChange?: (filters: Partial<FeedFiltersState>) => void;
  collections?: string[];
}

export function FilterChips({ onChange }: FilterChipsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const types = (searchParams.get("type")?.split(",").filter(Boolean) ?? []) as MemoryType[];
  const selectedCollections = searchParams.get("collection")?.split(",").filter(Boolean) ?? [];
  const dateRange = searchParams.get("range") ?? "";
  const favoriteOnly = searchParams.get("favorite") === "true";
  const search = searchParams.get("q") ?? "";

  const apply = (next: FeedFiltersState) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.types.length > 0) params.set("type", next.types.join(","));
    else params.delete("type");

    if (next.collections.length > 0) params.set("collection", next.collections.join(","));
    else params.delete("collection");

    if (next.dateRange) params.set("range", next.dateRange);
    else params.delete("range");

    if (next.favoriteOnly) params.set("favorite", "true");
    else params.delete("favorite");

    if (next.search) params.set("q", next.search);
    else params.delete("q");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    onChange?.(next);
  };

  const current: FeedFiltersState = {
    types,
    collections: selectedCollections,
    dateRange,
    favoriteOnly,
    search,
  };

  const hasActiveFilters = types.length > 0 || selectedCollections.length > 0 || dateRange || favoriteOnly || search;

  const clearAll = () => {
    apply({ types: [], collections: [], dateRange: "", favoriteOnly: false, search: "" });
  };

  const toggleType = (type: MemoryType) => {
    apply({
      ...current,
      types: types.includes(type) ? types.filter((t) => t !== type) : [...types, type],
    });
  };

  const toggleCollection = (collection: string) => {
    apply({
      ...current,
      collections: selectedCollections.includes(collection)
        ? selectedCollections.filter((c) => c !== collection)
        : [...selectedCollections, collection],
    });
  };

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAll}
        className="gap-1.5 text-muted-foreground hover:text-foreground"
        aria-label="Clear all filters"
      >
        <X className="size-3.5" />
        <span className="hidden sm:inline">Clear all</span>
      </Button>

      {types.map((type) => {
        const typeInfo = MEMORY_TYPES.find((t) => t.value === type);
        return (
          <span key={type} className="inline-flex items-center gap-1.5 rounded-full border border-aurora-2/40 bg-aurora-2/10 px-2.5 py-1 text-xs font-medium text-aurora-2">
            <Tag className="size-3" />
            {typeInfo?.label ?? type}
            <button
              onClick={() => toggleType(type)}
              className="p-0.5 rounded-full hover:bg-aurora-2/20 transition-colors"
              aria-label={`Remove ${typeInfo?.label ?? type} filter`}
            >
              <X className="size-3" />
            </button>
          </span>
        );
      })}

      {selectedCollections.map((collection) => (
        <span key={collection} className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-400/10 px-2.5 py-1 text-xs font-medium text-sky-400">
          <FolderGit2 className="size-3" />
          {collection}
          <button
            onClick={() => toggleCollection(collection)}
            className="p-0.5 rounded-full hover:bg-sky-400/20 transition-colors"
            aria-label={`Remove ${collection} filter`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      {dateRange && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-400">
          <Calendar className="size-3" />
          {DATE_RANGES.find((r) => r.value === dateRange)?.label ?? dateRange}
          <button
            onClick={() => apply({ ...current, dateRange: "" })}
            className="p-0.5 rounded-full hover:bg-amber-400/20 transition-colors"
            aria-label="Remove date range filter"
          >
            <X className="size-3" />
          </button>
        </span>
      )}

      {favoriteOnly && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-400">
          <Star className="size-3 fill-current" />
          Favorites
          <button
            onClick={() => apply({ ...current, favoriteOnly: false })}
            className="p-0.5 rounded-full hover:bg-amber-400/20 transition-colors"
            aria-label="Remove favorites filter"
          >
            <X className="size-3" />
          </button>
        </span>
      )}

      {search && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/40 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-400 max-w-[200px]">
          <Search className="size-3" />
          <span className="truncate">Search: &quot;{search}&quot;</span>
          <button
            onClick={() => apply({ ...current, search: "" })}
            className="p-0.5 rounded-full hover:bg-violet-400/20 transition-colors flex-shrink-0"
            aria-label="Remove search filter"
          >
            <X className="size-3" />
          </button>
        </span>
      )}
    </div>
  );
}