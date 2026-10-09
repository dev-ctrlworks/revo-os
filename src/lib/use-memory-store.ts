"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  syncFromStorage,
  getAskedCount,
  setAskedCount,
} from "./memory-store";

export function useMemoryStore(): ReturnType<typeof getSnapshot> {
  const memories = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    syncFromStorage();
  }, []);

  return memories;
}

export function useAskedCount(): number {
  return getAskedCount();
}

export function incrementAskedCount(): void {
  setAskedCount(getAskedCount() + 1);
}