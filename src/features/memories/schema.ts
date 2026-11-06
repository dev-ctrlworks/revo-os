import { z } from "zod";
import type { MemoryType } from "@/lib/types";

export const MEMORY_TYPES = [
  "screenshot",
  "note",
  "document",
  "link",
  "image",
  "discussion",
  "email",
  "archive",
] as const satisfies readonly MemoryType[];

export const memoryTypeSchema = z.enum(MEMORY_TYPES);

export const createMemorySchema = z.object({
  type: memoryTypeSchema,
  title: z.string().trim().min(1, "A title is required.").max(300),
  description: z.string().trim().max(2000).optional(),
  content: z.string().max(200_000).optional(),
  sourceUrl: z.string().trim().url().max(2048).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(50)).max(25).optional(),
});

export const updateMemorySchema = z.object({
  title: z.string().trim().min(1, "A title is required.").max(300).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  content: z.string().max(200_000).optional(),
  favorite: z.boolean().optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(25).optional(),
  collectionIds: z.array(z.string().uuid()).max(50).optional(),
});

export const listMemoriesSchema = z.object({
  search: z.string().trim().max(200).optional(),
  type: memoryTypeSchema.optional(),
  favorite: z.boolean().optional(),
  collectionId: z.string().uuid().optional(),
  sort: z.enum(["newest", "oldest", "title"]).default("newest"),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(24),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
export type ListMemoriesInput = z.infer<typeof listMemoriesSchema>;
