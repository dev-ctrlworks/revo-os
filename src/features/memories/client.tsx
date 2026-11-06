"use client";

import { useEffect } from "react";
import type { Collection, Memory } from "@/lib/types";
import type { Relationship } from "@/lib/types";
import { seedStore } from "@/lib/memory-store";

interface MemoriesProviderProps {
  memories: Memory[];
  collections: Collection[];
  relationships: Relationship[];
  children: React.ReactNode;
}

/**
 * Seeds the client memory store from server-fetched data. The server layout is
 * the source of truth; client mutations write through server actions and then
 * update the store locally.
 */
export function MemoriesProvider({
  memories,
  collections,
  relationships,
  children,
}: MemoriesProviderProps) {
  useEffect(() => {
    seedStore({ memories, collections, relationships });
  }, [memories, collections, relationships]);

  return <>{children}</>;
}
