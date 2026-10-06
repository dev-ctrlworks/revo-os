"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  syncFromStorage,
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