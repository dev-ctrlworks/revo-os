"use client";

import type { CollectionMeta } from "./collection-meta";
import { getCollectionMeta } from "./collection-meta";
import {
  getCollectionMetaOverrides,
  getCollectionNames as getStoreCollectionNames,
} from "./memory-store";
import { useMemoryStore } from "./use-memory-store";

export function resolveCollectionMeta(name: string): CollectionMeta {
  return { ...getCollectionMeta(name), ...getCollectionMetaOverrides()[name] };
}

export function useCollectionMeta(name: string): CollectionMeta {
  useMemoryStore();
  return resolveCollectionMeta(name);
}

export function useCollectionNames(): string[] {
  useMemoryStore();
  return getStoreCollectionNames();
}