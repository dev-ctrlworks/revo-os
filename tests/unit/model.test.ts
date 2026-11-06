import { describe, expect, it } from "vitest";
import { domainFromUrl, toUiMemory, previewUrlFor } from "@/features/memories/model";
import { colorForName } from "@/features/collections/queries";
import type { MemoryRow } from "@/types/database";

function row(overrides: Partial<MemoryRow> = {}): MemoryRow {
  return {
    id: "abc",
    user_id: "user",
    type: "link",
    title: "Example",
    description: null,
    source_url: "https://www.example.com/article",
    source_domain: null,
    content_text: "body",
    extracted_text: null,
    ai_summary: null,
    metadata: {},
    processing_status: "ready",
    processing_error_code: null,
    favorite: false,
    captured_at: null,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z",
    ...overrides,
  };
}

describe("domainFromUrl", () => {
  it("strips protocol and www", () => {
    expect(domainFromUrl("https://www.example.com/x")).toBe("example.com");
  });

  it("returns null for invalid urls", () => {
    expect(domainFromUrl("nonsense")).toBeNull();
    expect(domainFromUrl(null)).toBeNull();
  });
});

describe("toUiMemory", () => {
  it("maps row fields and derives domain", () => {
    const memory = toUiMemory(row());
    expect(memory.id).toBe("abc");
    expect(memory.content).toBe("body");
    expect(memory.domain).toBe("example.com");
    expect(memory.collection).toBe("");
    expect(memory.processingStatus).toBe("ready");
  });

  it("uses the provided collection ids and preview", () => {
    const memory = toUiMemory(row(), {
      collectionIds: ["c1"],
      previewUrl: previewUrlFor("abc"),
      previewMime: "image/png",
    });
    expect(memory.collection).toBe("c1");
    expect(memory.collectionIds).toEqual(["c1"]);
    expect(memory.previewUrl).toBe("/api/files/abc/preview");
  });

  it("coerces an unknown processing status to pending", () => {
    const memory = toUiMemory(row({ processing_status: "processing" as never }));
    expect(memory.processingStatus).toBe("pending");
  });
});

describe("colorForName", () => {
  it("is deterministic", () => {
    expect(colorForName("Travel")).toBe(colorForName("Travel"));
  });
});
