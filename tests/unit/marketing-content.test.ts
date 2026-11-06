import { describe, expect, it } from "vitest";
import { memories } from "@/lib/mock-data";
import {
  captureMethods,
  faqs,
  marketingNav,
  memoryTypeLabels,
  showcaseConnections,
  showcaseQueries,
} from "@/components/marketing/content";

const memoryIds = new Set(memories.map((m) => m.id));

describe("marketing content", () => {
  it("references only real sample memories in the showcase", () => {
    for (const query of showcaseQueries) {
      expect(query.sources.length).toBeGreaterThan(0);
      for (const source of query.sources) {
        expect(memoryIds.has(source.id)).toBe(true);
      }
    }
    for (const cluster of showcaseConnections) {
      expect(cluster.items.length).toBeGreaterThan(0);
      for (const item of cluster.items) {
        expect(memoryIds.has(item.id)).toBe(true);
      }
    }
  });

  it("keeps navigation hrefs unique and valid (anchor or root path)", () => {
    const hrefs = marketingNav.map((n) => n.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) {
      expect(href.startsWith("#") || href.startsWith("/")).toBe(true);
    }
  });

  it("includes the product anchor and the page links used by CTAs", () => {
    const byLabel = new Map(marketingNav.map((n) => [n.label, n.href]));
    expect(byLabel.get("Product")).toBe("#product");
    expect(byLabel.get("Resources")).toBe("/resources");
    expect(byLabel.get("Download")).toBe("/download");
    expect(byLabel.get("Pricing")).toBe("/pricing");
  });

  it("labels every capture method and ships FAQ entries", () => {
    expect(captureMethods.length).toBeGreaterThan(0);
    for (const method of captureMethods) {
      expect(["live", "planned"]).toContain(method.status);
    }
    expect(faqs.length).toBeGreaterThan(0);
    for (const faq of faqs) {
      expect(faq.question.length).toBeGreaterThan(0);
      expect(faq.answer.length).toBeGreaterThan(0);
    }
  });

  it("covers every memory type with a human label", () => {
    for (const memory of memories) {
      expect(memoryTypeLabels[memory.type]).toBeTruthy();
    }
  });
});
