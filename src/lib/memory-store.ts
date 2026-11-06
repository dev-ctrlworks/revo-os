"use client";

import { useSyncExternalStore } from "react";
import type { Collection, Memory } from "@/lib/types";
import type { Relationship } from "@/lib/types";

interface StoreState {
  memories: Memory[];
  collections: Collection[];
  relationships: Relationship[];
}

let state: StoreState = { memories: [], collections: [], relationships: [] };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function seedStore(next: Partial<StoreState>): void {
  state = { ...state, ...next };
  emit();
}

export function getSnapshot(): StoreState {
  return state;
}

/**
 * Client cache seeded from the server layout. Mutations are performed through
 * server actions; this store keeps the UI in sync optimistically without
 * inventing data.
 */
export function addMemory(memory: Memory): void {
  state = { ...state, memories: [memory, ...state.memories] };
  emit();
}

export function updateMemoryLocal(
  id: string,
  patch: Partial<Memory>
): void {
  state = {
    ...state,
    memories: state.memories.map((m) => (m.id === id ? { ...m, ...patch } : m)),
  };
  emit();
}

export function removeMemory(id: string): void {
  state = { ...state, memories: state.memories.filter((m) => m.id !== id) };
  emit();
}

export function addRelationshipLocal(relationship: Relationship): void {
  state = {
    ...state,
    relationships: [relationship, ...state.relationships],
  };
  emit();
}

export function removeRelationshipLocal(id: string): void {
  state = {
    ...state,
    relationships: state.relationships.filter((r) => r.id !== id),
  };
  emit();
}

export function useMemoryStore(): StoreState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
