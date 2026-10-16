import type { Memory } from "./types";

export interface AIProvider {
  generateAnswer(query: string, sources: Memory[]): Promise<string> | string;
}

function getDegradedProvider(): AIProvider {
  return {
    generateAnswer: (query: string, sources: Memory[]) => {
      const matched = new Set(sources.flatMap((s) => s.collectionIds ?? [s.collection]));
      const collectionList = Array.from(matched).slice(0, 2).join(" and ");
      if (sources.length === 0) {
        return `I couldn't find anything in your memories matching "${query}". Try rephrasing, or browse the Library or Timeline.`;
      }
      const top = sources
        .slice(0, 3)
        .map((s) => `**${s.title}**`)
        .join(", ");
      return `I found **${sources.length} memories**${collectionList ? ` across ${collectionList}` : ""} related to that. Top matches: ${top}. Open the cited sources for full context.`;
    },
  };
}

let provider: AIProvider = getDegradedProvider();

export function getAIProvider(): AIProvider {
  return provider;
}

export function setAIProvider(p: AIProvider): void {
  provider = p;
}
