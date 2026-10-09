"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MemoryType } from "@/lib/types";

const emptySubscribe = () => () => {};

export function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface FeedFiltersState {
  types: MemoryType[];
  collections: string[];
  dateRange: string;
  favoriteOnly: boolean;
  search: string;
}

interface DashboardState {
  // View mode
  viewMode: "list" | "grid" | "compact";
  setViewMode: (mode: "list" | "grid" | "compact") => void;

  // Feed filters
  filters: FeedFiltersState;
  setFilters: (filters: Partial<FeedFiltersState>) => void;
  clearFilters: () => void;

  // Multi-select
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const defaultFilters: FeedFiltersState = {
  types: [],
  collections: [],
  dateRange: "",
  favoriteOnly: false,
  search: "",
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      viewMode: "list",
      setViewMode: (mode) => set({ viewMode: mode }),

      filters: defaultFilters,
      setFilters: (newFilters) => set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      clearFilters: () => set({ filters: defaultFilters }),

      selectedIds: new Set(),
      toggleSelection: (id) => set((state) => {
        const next = new Set(state.selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return { selectedIds: next };
      }),
      selectAll: (ids) => set({ selectedIds: new Set(ids) }),
      clearSelection: () => set({ selectedIds: new Set() }),

      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: "revoos.dashboard.v1",
      partialize: (state) => ({
        viewMode: state.viewMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);