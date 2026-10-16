import { memories as baseMemories } from "./mock-data";
import {
  generateMemoryDescription,
  generateMemoryKeyPoints,
  generateMemorySummary,
} from "./summarize";
import type { CollectionMeta } from "./collection-meta";
import type { Memory, MemoryType } from "./types";

const STORAGE_KEY = "revoos.captured.memories.v1";
const EDITS_KEY = "revoos.memory-edits.v1";
const COLLECTION_META_KEY = "revoos.collection-meta.v1";
const DELETED_KEY = "revoos.deleted-memories.v1";
const ASKED_COUNT_KEY = "revoos.asked-count.v1";
const SCHEMA_VERSION_KEY = "revoos.schema.version";
const SCHEMA_VERSION = 2;

/**
 * Normalizes a memory to the v2 shape (multi-collection membership, timestamps,
 * processing status). Safe to call repeatedly; used as the read-time migration
 * so every memory returned from the store has a consistent shape.
 */
export function normalizeMemory(memory: Memory): Memory {
  const collectionIds =
    memory.collectionIds && memory.collectionIds.length
      ? memory.collectionIds
      : memory.collection
        ? [memory.collection]
        : [];
  const primary = memory.collection || collectionIds[0] || "New captures";
  return {
    ...memory,
    collection: primary,
    collectionIds: collectionIds.length ? collectionIds : [primary],
    updatedAt: memory.updatedAt ?? memory.createdAt,
    processingStatus: memory.processingStatus ?? "ready",
  };
}

/** Membership set for a memory (falls back to the primary collection). */
export function getCollectionIds(memory: Memory): string[] {
  if (memory.collectionIds && memory.collectionIds.length) {
    return memory.collectionIds;
  }
  return memory.collection ? [memory.collection] : [];
}

export const STORAGE_FULL_MESSAGE =
  "Demo storage is full. Clear captured memories in Settings to keep capturing.";
const STORAGE_LIMIT_BYTES = 5_000_000;

let storageWarning: string | null = null;

function writeLocal(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    if (storageWarning) storageWarning = null;
    return true;
  } catch {
    storageWarning = STORAGE_FULL_MESSAGE;
    return false;
  }
}

function removeLocal(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    storageWarning = STORAGE_FULL_MESSAGE;
  }
}

function bytesOf(value: string | null): number {
  if (!value) return 0;
  try {
    return new Blob([value]).size;
  } catch {
    return value.length;
  }
}

export function getStorageError(): string | null {
  return storageWarning;
}

export function clearStorageError(): void {
  if (storageWarning) {
    storageWarning = null;
    notify();
  }
}

export function getStorageUsageBytes(): number {
  if (typeof window === "undefined") return 0;
  return bytesOf(window.localStorage.getItem(STORAGE_KEY)) +
    bytesOf(window.localStorage.getItem(EDITS_KEY)) +
    bytesOf(window.localStorage.getItem(COLLECTION_META_KEY)) +
    bytesOf(window.localStorage.getItem(DELETED_KEY));
}

export function getStorageLimitBytes(): number {
  return STORAGE_LIMIT_BYTES;
}

function safeParse(raw: string | null): Memory[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function safeParseEdits(raw: string | null): Record<string, Partial<Memory>> {
  if (!raw) return {};
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function safeParseMeta(raw: string | null): Record<string, Partial<CollectionMeta>> {
  if (!raw) return {};
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function getDeletedIds(): Set<string> {
  if (typeof window === "undefined" || !hydratedFromStorage) return new Set();
  try {
    const value = JSON.parse(window.localStorage.getItem(DELETED_KEY) ?? "[]");
    return new Set(Array.isArray(value) ? value.filter((v) => typeof v === "string") : []);
  } catch {
    return new Set();
  }
}

export function getCapturedMemories(): Memory[] {
  if (typeof window === "undefined" || !hydratedFromStorage) return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function getEdits(): Record<string, Partial<Memory>> {
  if (typeof window === "undefined" || !hydratedFromStorage) return {};
  return safeParseEdits(window.localStorage.getItem(EDITS_KEY));
}

export function getAllMemories(): Memory[] {
  const edits = getEdits();
  const deleted = getDeletedIds();
  return [...getCapturedMemories(), ...baseMemories]
    .filter((m) => !deleted.has(m.id))
    .map((m) => normalizeMemory(edits[m.id] ? { ...m, ...edits[m.id] } : m));
}

export function updateMemory(id: string, patch: Partial<Memory>): void {
  const edits = getEdits();
  const merged = { ...edits[id], ...patch };
  if (!("updatedAt" in patch)) merged.updatedAt = new Date().toISOString();
  edits[id] = merged;
  writeLocal(EDITS_KEY, JSON.stringify(edits));
  notify();
}

export function renameCollection(oldName: string, newName: string): void {
  if (!newName || oldName === newName) return;
  const edits = getEdits();
  for (const m of getCapturedMemories()) {
    if (m.collection === oldName) {
      edits[m.id] = { ...(edits[m.id] ?? {}), collection: newName };
    }
  }
  for (const m of baseMemories) {
    if (m.collection === oldName) {
      edits[m.id] = { ...(edits[m.id] ?? {}), collection: newName };
    }
  }
  const meta = getCollectionMetaOverrides();
  if (meta[oldName]) {
    meta[newName] = { ...(meta[newName] ?? {}), ...meta[oldName] };
    delete meta[oldName];
    writeLocal(COLLECTION_META_KEY, JSON.stringify(meta));
  }
  writeLocal(EDITS_KEY, JSON.stringify(edits));
  notify();
}

export function getCollectionMetaOverrides(): Record<string, Partial<CollectionMeta>> {
  if (typeof window === "undefined" || !hydratedFromStorage) return {};
  return safeParseMeta(window.localStorage.getItem(COLLECTION_META_KEY));
}

export function updateCollectionMeta(
  name: string,
  patch: Partial<CollectionMeta>
): void {
  const meta = getCollectionMetaOverrides();
  meta[name] = { ...(meta[name] ?? {}), ...patch };
  writeLocal(COLLECTION_META_KEY, JSON.stringify(meta));
  notify();
}

export function createCollection(
  name: string,
  meta?: Partial<CollectionMeta>
): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  const current = getCollectionMetaOverrides();
  current[trimmed] = { ...(current[trimmed] ?? {}), ...meta };
  writeLocal(COLLECTION_META_KEY, JSON.stringify(current));
  notify();
}

export function deleteCollection(name: string): void {
  if (!name) return;
  const meta = getCollectionMetaOverrides();
  if (meta[name]) {
    delete meta[name];
    writeLocal(COLLECTION_META_KEY, JSON.stringify(meta));
  }
  const edits = getEdits();
  for (const m of getAllMemories()) {
    if (m.collection === name) {
      edits[m.id] = { ...(edits[m.id] ?? {}), collection: "New captures" };
    }
  }
  writeLocal(EDITS_KEY, JSON.stringify(edits));
  notify();
}

export function moveMemoryToCollection(id: string, collection: string): void {
  const name = collection.trim() || "New captures";
  const memory = getAllMemories().find((m) => m.id === id);
  const ids = memory ? getCollectionIds(memory) : [];
  const nextIds = ids.includes(name) ? ids : [name, ...ids];
  updateMemory(id, { collection: name, collectionIds: nextIds });
}

/** Adds a memory to an additional collection without removing its others. */
export function addMemoryToCollection(id: string, collection: string): void {
  const name = collection.trim();
  if (!name) return;
  const memory = getAllMemories().find((m) => m.id === id);
  if (!memory) return;
  const ids = getCollectionIds(memory);
  if (ids.includes(name)) return;
  updateMemory(id, { collectionIds: [...ids, name] });
}

export function removeMemoryFromCollection(id: string, collection?: string): void {
  const memory = getAllMemories().find((m) => m.id === id);
  const ids = memory ? getCollectionIds(memory) : [];
  const target = collection ?? memory?.collection;
  const nextIds = target ? ids.filter((n) => n !== target) : [];
  const fallback = nextIds[0] ?? "New captures";
  updateMemory(id, {
    collectionIds: nextIds.length ? nextIds : [fallback],
    collection: fallback,
  });
}

export function getCollectionNames(): string[] {
  const names = new Set<string>();
  for (const m of getAllMemories()) {
    for (const name of getCollectionIds(m)) names.add(name);
  }
  for (const m of getCapturedMemories()) {
    if (m.collection) names.add(m.collection);
  }
  Object.keys(getCollectionMetaOverrides()).forEach((n) => names.add(n));
  return Array.from(names).filter(Boolean).sort((a, b) => a.localeCompare(b));
}

export function addMemory(input: {
  type: MemoryType;
  title: string;
  content: string;
  source?: string;
  domain?: string;
  tags?: string[];
  collection?: string;
  highlight?: string;
  summary?: string;
  description?: string;
  keyPoints?: string[];
  favorite?: boolean;
  previewUrl?: string;
}): Memory | null {
  const now = new Date().toISOString();
  const collectionName = input.collection ?? "New captures";
  const memory: Memory = {
    id: `cap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type: input.type,
    title: input.title,
    content: input.content,
    createdAt: now,
    updatedAt: now,
    source: input.source ?? input.type,
    domain: input.domain,
    tags: input.tags ?? [],
    favorite: input.favorite ?? false,
    collection: collectionName,
    collectionIds: [collectionName],
    processingStatus: "ready",
    highlight: input.highlight,
    summary: input.summary ?? generateMemorySummary(input),
    description: input.description ?? generateMemoryDescription(input),
    keyPoints: input.keyPoints ?? generateMemoryKeyPoints(input),
    previewUrl: input.previewUrl,
  };
  const next = [memory, ...getCapturedMemories()];
  const ok = writeLocal(STORAGE_KEY, JSON.stringify(next));
  notify();
  return ok ? memory : null;
}

export function removeMemory(id: string): void {
  const next = getCapturedMemories().filter((m) => m.id !== id);
  const deleted = getDeletedIds();
  deleted.add(id);
  writeLocal(STORAGE_KEY, JSON.stringify(next));
  writeLocal(DELETED_KEY, JSON.stringify(Array.from(deleted)));
  const edits = getEdits();
  delete edits[id];
  writeLocal(EDITS_KEY, JSON.stringify(edits));
  notify();
}

export function clearCapturedMemories(): void {
  removeLocal(STORAGE_KEY);
  const edits = getEdits();
  Object.keys(edits).forEach((id) => {
    if (id.startsWith("cap-")) delete edits[id];
  });
  writeLocal(EDITS_KEY, JSON.stringify(edits));
  notify();
}

export function exportData(): string {
  if (typeof window === "undefined") return "{}";
  let deleted: string[] = [];
  try {
    const value = JSON.parse(window.localStorage.getItem(DELETED_KEY) ?? "[]");
    deleted = Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  } catch {
    deleted = [];
  }
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    captured: safeParse(window.localStorage.getItem(STORAGE_KEY)),
    edits: safeParseEdits(window.localStorage.getItem(EDITS_KEY)),
    collectionMeta: safeParseMeta(window.localStorage.getItem(COLLECTION_META_KEY)),
    deleted,
  };
  return JSON.stringify(payload, null, 2);
}

export function importData(json: string): { ok: boolean; error?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "That file doesn't look like a Revo OS export." };
  }
  const data = parsed as Record<string, unknown>;
  const captured = Array.isArray(data.captured) ? data.captured : [];
  const edits =
    data.edits && typeof data.edits === "object" ? data.edits : {};
  const collectionMeta =
    data.collectionMeta && typeof data.collectionMeta === "object"
      ? data.collectionMeta
      : {};
  const deleted = Array.isArray(data.deleted)
    ? data.deleted.filter((v) => typeof v === "string")
    : [];
  writeLocal(STORAGE_KEY, JSON.stringify(captured));
  writeLocal(EDITS_KEY, JSON.stringify(edits));
  writeLocal(COLLECTION_META_KEY, JSON.stringify(collectionMeta));
  writeLocal(DELETED_KEY, JSON.stringify(deleted));
  notify();
  return { ok: true };
}

export function restoreDemoData(): void {
  removeLocal(DELETED_KEY);
  notify();
}

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

let cachedSnapshot: Memory[] | null = null;
let hydratedFromStorage = false;

function computeSnapshot(): Memory[] {
  return getAllMemories();
}

export function getSnapshot(): Memory[] {
  if (cachedSnapshot === null) return baseMemories;
  return cachedSnapshot;
}

export function getServerSnapshot(): Memory[] {
  return baseMemories;
}

export function syncFromStorage(): void {
  if (typeof window === "undefined" || hydratedFromStorage) return;
  hydratedFromStorage = true;
  migrateStorageToV2();
  notify();
}

/**
 * One-time, non-destructive v1 → v2 upgrade of captured memories: backfills
 * `collectionIds`, `updatedAt`, and `processingStatus`. Read-time normalization
 * still applies if this is skipped or fails.
 */
function migrateStorageToV2(): void {
  if (typeof window === "undefined") return;
  try {
    const version = parseInt(
      window.localStorage.getItem(SCHEMA_VERSION_KEY) ?? "0",
      10
    );
    if (version >= SCHEMA_VERSION) return;
    const captured = safeParse(window.localStorage.getItem(STORAGE_KEY));
    if (captured.length) {
      writeLocal(STORAGE_KEY, JSON.stringify(captured.map(normalizeMemory)));
    }
    writeLocal(SCHEMA_VERSION_KEY, String(SCHEMA_VERSION));
  } catch {
    // best-effort; read-time normalization still applies
  }
}

function notify(): void {
  cachedSnapshot = computeSnapshot();
  listeners.forEach((listener) => listener());
}

export function getAskedCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(window.localStorage.getItem(ASKED_COUNT_KEY) ?? "0", 10);
  } catch {
    return 0;
  }
}

export function setAskedCount(count: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ASKED_COUNT_KEY, String(count));
  } catch {
    // ignore
  }
}