import type { MemoryRow } from "@/types/database";
import type { Memory, MemoryType, ProcessingStatus } from "@/lib/types";

const PROCESSING_STATUSES: readonly ProcessingStatus[] = ["ready", "pending", "failed"];

function coerceProcessingStatus(value: string): ProcessingStatus {
  return (PROCESSING_STATUSES as readonly string[]).includes(value)
    ? (value as ProcessingStatus)
    : "pending";
}

/** Extracts a bare hostname from a URL, or null when unparseable. */
export function domainFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Signed-URL endpoint for a memory's attached file, used by <img>/preview. */
export function previewUrlFor(memoryId: string): string {
  return `/api/files/${memoryId}/preview`;
}

interface MemoryTagsByMemoryId {
  [memoryId: string]: string[];
}

interface UiMemoryExtras {
  tags?: string[];
  collectionIds?: string[];
  previewUrl?: string;
  previewMime?: string;
  userContext?: string;
}

/** Maps a database row (plus joined metadata) into the UI Memory shape. */
export function toUiMemory(
  row: MemoryRow,
  extras: UiMemoryExtras = {}
): Memory {
  const collectionIds = extras.collectionIds ?? [];
  return {
    id: row.id,
    type: row.type as MemoryType,
    title: row.title,
    content: row.content_text ?? "",
    createdAt: row.created_at,
    source: row.source_url ?? "",
    domain: row.source_domain ?? domainFromUrl(row.source_url) ?? undefined,
    tags: extras.tags ?? [],
    favorite: row.favorite,
    collection: collectionIds[0] ?? "",
    collectionIds,
    updatedAt: row.updated_at,
    userContext: extras.userContext ?? row.description ?? undefined,
    processingStatus: coerceProcessingStatus(row.processing_status),
    description: row.description ?? undefined,
    previewUrl: extras.previewUrl,
    previewMime: extras.previewMime,
  };
}

export type { MemoryTagsByMemoryId };
