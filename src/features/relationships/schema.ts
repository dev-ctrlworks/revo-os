import { z } from "zod";

export const RELATIONSHIP_TYPES = [
  "related_to",
  "references",
  "derived_from",
  "contradicts",
] as const;

export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

export const createRelationshipSchema = z
  .object({
    sourceMemoryId: z.string().uuid(),
    targetMemoryId: z.string().uuid(),
    relationshipType: z.enum(RELATIONSHIP_TYPES),
  })
  .refine((value) => value.sourceMemoryId !== value.targetMemoryId, {
    message: "A memory cannot be related to itself.",
    path: ["targetMemoryId"],
  });

export type CreateRelationshipInput = z.infer<typeof createRelationshipSchema>;
