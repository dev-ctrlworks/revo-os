import { afterEach, describe, expect, it, vi } from "vitest";
import { renderSummaryPdf } from "@/lib/pdf";
import { summarizeCollection } from "@/lib/ai";

const MARKDOWN = [
  "# Research brief",
  "",
  "## Overview",
  "A short overview of the collection and why it matters.",
  "",
  "## Key themes",
  "- Theme one with a citation [1]",
  "- Theme two",
  "",
  "## Notable items",
  "- First memory worth revisiting [1]",
  "",
  "## Open questions",
  "- What is still missing?",
].join("\n");

describe("renderSummaryPdf", () => {
  it("returns valid PDF bytes for a summary", async () => {
    const bytes = await renderSummaryPdf({
      collectionName: "Design research",
      markdown: MARKDOWN,
      generatedAt: new Date("2026-01-02T00:00:00Z"),
    });

    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(500);
    const header = new TextDecoder().decode(bytes.slice(0, 5));
    expect(header).toBe("%PDF-");
  });

  it("handles empty markdown without throwing", async () => {
    const bytes = await renderSummaryPdf({
      collectionName: "Empty",
      markdown: "",
      generatedAt: new Date("2026-01-02T00:00:00Z"),
    });
    expect(bytes.length).toBeGreaterThan(200);
  });
});

describe("summarizeCollection", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("returns a labeled notice when no provider is configured", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const result = await summarizeCollection({
      name: "Ideas",
      description: "",
      memories: [{ id: "1", title: "Note", content: "text", domain: null }],
    });
    expect(result.degraded).toBe(true);
    expect(result.markdown).toMatch(/unavailable/i);
  });

  it("returns an empty-collection notice without calling the provider", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const result = await summarizeCollection({
      name: "Ideas",
      description: "",
      memories: [],
    });
    expect(result.degraded).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns the provider summary when configured", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: MARKDOWN } }],
        }),
      }))
    );
    const result = await summarizeCollection({
      name: "Ideas",
      description: "my collection",
      memories: [{ id: "1", title: "Note", content: "text", domain: "x.com" }],
    });
    expect(result.degraded).toBe(false);
    expect(result.markdown).toBe(MARKDOWN);
  });

  it("degrades gracefully on provider failure", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, json: async () => ({}) }))
    );
    const result = await summarizeCollection({
      name: "Ideas",
      description: "",
      memories: [{ id: "1", title: "Note", content: "text", domain: null }],
    });
    expect(result.degraded).toBe(true);
    expect(result.markdown).toMatch(/could not be generated/i);
  });
});
