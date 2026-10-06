export type MemoryType = "screenshot" | "note" | "document" | "link" | "image" | "discussion" | "email" | "archive";

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
  collection: string;
  highlight?: string;
  summary?: string;
  description?: string;
  keyPoints?: string[];
  previewUrl?: string;
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
}

export interface TimelineGroup {
  label: string;
  memories: Memory[];
}

export type ViewMode = "grid" | "list";