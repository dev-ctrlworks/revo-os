"use client";

import { Suspense } from "react";
import { FilterChips } from "@/components/dashboard/FilterChips";

interface FilterChipsWrapperProps {
  filters: {
    types: import("@/lib/types").MemoryType[];
    collections: string[];
    dateRange: string;
    favoriteOnly: boolean;
    search: string;
  };
  onChange: (filters: Partial<{
    types: import("@/lib/types").MemoryType[];
    collections: string[];
    dateRange: string;
    favoriteOnly: boolean;
    search: string;
  }>) => void;
  collections: string[];
}

export function FilterChipsWrapper({ filters, onChange, collections }: FilterChipsWrapperProps) {
  return (
    <Suspense fallback={<div className="h-9 w-full rounded-xl bg-muted/30 animate-pulse" />}>
      <FilterChips filters={filters} onChange={onChange} collections={collections} />
    </Suspense>
  );
}