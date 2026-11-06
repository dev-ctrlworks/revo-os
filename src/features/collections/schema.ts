import { z } from "zod";

export const collectionSchema = z.object({
  name: z.string().trim().min(1, "A name is required.").max(120),
  description: z.string().trim().max(1000).optional(),
  emoji: z.string().trim().min(1).max(16).optional(),
});

export const updateCollectionSchema = collectionSchema.partial();

export type CollectionInput = z.infer<typeof collectionSchema>;
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>;
