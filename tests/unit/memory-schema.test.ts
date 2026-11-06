import { describe, expect, it } from "vitest";
import {
  createMemorySchema,
  updateMemorySchema,
  listMemoriesSchema,
  MEMORY_TYPES,
} from "@/features/memories/schema";
import { createRelationshipSchema } from "@/features/relationships/schema";
import { collectionSchema } from "@/features/collections/schema";
import { signInSchema, signUpSchema, deleteAccountSchema } from "@/features/auth/schema";
import { validateUpload, storageExtensionFor, MAX_UPLOAD_BYTES } from "@/features/uploads/validation";

const UUID = "11111111-1111-4111-8111-111111111111";

describe("memory schemas", () => {
  it("accepts a valid note", () => {
    const parsed = createMemorySchema.safeParse({ type: "note", title: "Hello" });
    expect(parsed.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const parsed = createMemorySchema.safeParse({ type: "note", title: "  " });
    expect(parsed.success).toBe(false);
  });

  it("allows an empty source url but rejects a junk url", () => {
    expect(
      createMemorySchema.safeParse({ type: "link", title: "x", sourceUrl: "" }).success
    ).toBe(true);
    expect(
      createMemorySchema.safeParse({ type: "link", title: "x", sourceUrl: "not a url" }).success
    ).toBe(false);
  });

  it("has exactly the eight supported memory types", () => {
    expect(MEMORY_TYPES).toHaveLength(8);
  });

  it("defaults list pagination", () => {
    const parsed = listMemoriesSchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.sort).toBe("newest");
  });

  it("accepts a partial update", () => {
    expect(updateMemorySchema.safeParse({ favorite: true }).success).toBe(true);
  });
});

describe("relationship schema", () => {
  it("rejects self-links", () => {
    const parsed = createRelationshipSchema.safeParse({
      sourceMemoryId: UUID,
      targetMemoryId: UUID,
      relationshipType: "related_to",
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts a link between two distinct memories", () => {
    const parsed = createRelationshipSchema.safeParse({
      sourceMemoryId: UUID,
      targetMemoryId: "22222222-2222-4222-8222-222222222222",
      relationshipType: "references",
    });
    expect(parsed.success).toBe(true);
  });
});

describe("collection schema", () => {
  it("requires a name", () => {
    expect(collectionSchema.safeParse({ name: "" }).success).toBe(false);
    expect(collectionSchema.safeParse({ name: "Trips" }).success).toBe(true);
  });
});

describe("auth schemas", () => {
  it("requires an 8+ character password on sign up", () => {
    expect(
      signUpSchema.safeParse({ email: "a@b.com", password: "short" }).success
    ).toBe(false);
    expect(
      signUpSchema.safeParse({ email: "a@b.com", password: "longenough" }).success
    ).toBe(true);
  });

  it("rejects an invalid email on sign in", () => {
    expect(signInSchema.safeParse({ email: "nope", password: "x" }).success).toBe(false);
  });

  it("requires the exact DELETE confirmation", () => {
    expect(deleteAccountSchema.safeParse({ confirmation: "delete" }).success).toBe(false);
    expect(deleteAccountSchema.safeParse({ confirmation: "DELETE" }).success).toBe(true);
  });
});

describe("upload validation", () => {
  it("rejects unsupported types and empty files", () => {
    expect(validateUpload({ size: 10, type: "application/zip" }).ok).toBe(false);
    expect(validateUpload({ size: 0, type: "image/png" }).ok).toBe(false);
  });

  it("rejects files over the size limit", () => {
    expect(
      validateUpload({ size: MAX_UPLOAD_BYTES + 1, type: "image/png" }).ok
    ).toBe(false);
    expect(validateUpload({ size: 1024, type: "image/png" }).ok).toBe(true);
  });

  it("maps mime types to storage extensions", () => {
    expect(storageExtensionFor("image/jpeg")).toBe("jpg");
    expect(storageExtensionFor("application/pdf")).toBe("pdf");
    expect(storageExtensionFor("application/unknown")).toBe("bin");
  });
});
