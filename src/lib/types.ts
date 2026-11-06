export type MemoryType = "screenshot" | "note" | "document" | "link" | "image" | "discussion" | "email" | "archive";

export type ProcessingStatus = "ready" | "pending" | "failed";

export interface AISummary {
  text: string;
  generatedAt: string;
  provider: string;
}

export interface MemoryTag {
  name: string;
}

export interface Memory {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  createdAt: string;
  source: string;
  domain?: string;
  tags: string[];
  favorite: boolean;
  /**
   * Primary/default collection. Denormalized from `collectionIds[0]` so
   * existing single-collection views keep working; `collectionIds` is the
   * source of truth for membership.
   */
  collection: string;
  /** Full membership set (many-to-many). */
  collectionIds?: string[];
  /** Last edit time; falls back to `createdAt` when absent. */
  updatedAt?: string;
  /** User-authored context ("why I saved this"). */
  userContext?: string;
  /** AI-generated interpretation, kept separate from the original. */
  aiSummary?: AISummary;
  /** Enrichment pipeline state. */
  processingStatus?: ProcessingStatus;
  highlight?: string;
  summary?: string;
  description?: string;
  keyPoints?: string[];
  previewUrl?: string;
  /** MIME type of the attached original file, when one exists. */
  previewMime?: string;
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  description: string;
  memoryCount: number;
  color: string;
}

export interface SearchResult {
  answer: string;
  sources: Memory[];
  id: string;
}

export interface AIAnswer {
  id: string;
  query: string;
  answer: string;
  sources: Memory[];
  createdAt: string;
  degraded?: boolean;
}

export interface TimelineGroup {
  label: string;
  memories: Memory[];
}

export type RelationshipType = "related_to" | "references" | "derived_from" | "contradicts";

export interface Relationship {
  id: string;
  sourceMemoryId: string;
  targetMemoryId: string;
  relationshipType: RelationshipType;
  createdBy: "user" | "ai";
}

export type ViewMode = "grid" | "list";