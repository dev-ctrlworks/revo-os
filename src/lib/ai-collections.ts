import type { Memory } from "./types";

export interface AICollectionSuggestion {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  memberIds: string[];
  score: number;
  keywords: string[];
}

const GENERIC_TAGS = new Set([
  "todo",
  "idea",
  "ideas",
  "notes",
  "note",
  "research",
  "misc",
  "important",
  "watch",
  "buy",
  "want",
  "later",
  "maybe",
  "inbox",
  "favorite",
  "new",
  "capture",
]);

const EMOJI_LEXICON: Array<[RegExp, string]> = [
  [/camera|lens|sony|fujifilm|nikon|photo/i, "📸"],
  [/japan|tokyo|kyoto|osaka|ryokan|travel|flight|trip/i, "🗾"],
  [/apartment|rent|housing|lease|house|home|move/i, "🏠"],
  [/career|resume|interview|job|speak|conference/i, "💼"],
  [/gift|birthday|present|jane/i, "🎁"],
  [/mango|dog|puppy|vet|pet/i, "🐕"],
  [/hiking|hike|trail|outdoor|camping/i, "🥾"],
  [/health|gym|fitness|workout|run|running|diet/i, "💪"],
  [/book|reading|read|creative|podcast/i, "📚"],
  [/movie|series|tv|watch|film|show/i, "🎬"],
  [/coffee|espresso|brew|grinder/i, "☕"],
  [/kitchen|cook|recipe|sourdough|dinner/i, "🍳"],
  [/tech|phone|pixel|iphone|app|software|design/i, "📱"],
  [/journal|diary|reflection|week/i, "📔"],
];

const AI_COLORS = [
  "from-indigo-500/20 to-cyan-500/5",
  "from-sky-500/20 to-indigo-500/5",
  "from-amber-500/20 to-orange-500/5",
  "from-rose-500/20 to-pink-500/5",
  "from-emerald-500/20 to-teal-500/5",
  "from-violet-500/20 to-purple-500/5",
];

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function collectionEmoji(name: string): string {
  const match = EMOJI_LEXICON.find(([re]) => re.test(name));
  return match ? match[1] : "📁";
}

function collectionColor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AI_COLORS[hash % AI_COLORS.length];
}

function descriptiveWords(memory: Memory): Set<string> {
  const words = new Set<string>();
  for (const tag of memory.tags) {
    if (!GENERIC_TAGS.has(tag.toLowerCase()) && tag.length > 2) {
      words.add(tag.toLowerCase());
    }
  }
  return words;
}

function collectionsOf(memory: Memory): string {
  return memory.collection && memory.collection !== "New captures"
    ? memory.collection.toLowerCase()
    : "";
}

/**
 * Auto-detects groups of related memories and suggests collections, without
 * repeating groups that already exist. Deterministic so it is SSR/hydration safe.
 */
export function suggestAICollections(
  memories: Memory[],
  existingNames: string[] = []
): AICollectionSuggestion[] {
  const existing = new Set(existingNames.map((n) => n.toLowerCase()));

  const byTag = new Map<string, Memory[]>();
  for (const memory of memories) {
    for (const tag of memory.tags) {
      const key = tag.toLowerCase();
      if (key.length < 3 || GENERIC_TAGS.has(key)) continue;
      const list = byTag.get(key) ?? [];
      list.push(memory);
      byTag.set(key, list);
    }
  }

  const seenKeys = new Set<string>();
  const suggestions: AICollectionSuggestion[] = [];

  for (const [tag, members] of byTag) {
    if (members.length < 2) continue;
    const single = new Set(members.map((m) => collectionsOf(m)));
    if (single.size === 1 && Array.from(single)[0]) continue;

    const claimed = new Set(members.map((m) => m.collection.toLowerCase()));
    const name = titleCase(tag);
    const nameKey = slug(name);
    if (existing.has(name.toLowerCase()) || seenKeys.has(nameKey)) continue;

    const memberIds = [...new Set(members.map((m) => m.id))];
    const extra = new Set<string>();
    for (const memory of members) {
      for (const w of descriptiveWords(memory)) extra.add(w);
    }
    extra.delete(tag);

    seenKeys.add(nameKey);
    suggestions.push({
      id: `ai-${nameKey}`,
      name,
      emoji: collectionEmoji(name),
      description: generateCollectionDescription(members, Array.from(extra)),
      color: collectionColor(name),
      memberIds,
      score: memberIds.length * 2 + (claimed.has("") ? 1 : 0),
      keywords: [tag, ...Array.from(extra).slice(0, 2)],
    });
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 8);
}

/**
 * Finds memories that look like they belong in `collectionName` but live
 * somewhere else — used for the AI-driven "add related memories" flow.
 */
export function suggestMemoriesForCollection(
  memories: Memory[],
  collectionName: string
): Memory[] {
  const members = memories.filter((m) => m.collection === collectionName);
  if (!members.length) return [];

  const signature = new Map<string, number>();
  for (const memory of members) {
    for (const tag of memory.tags) {
      const key = tag.toLowerCase();
      if (key.length < 3 || GENERIC_TAGS.has(key)) continue;
      signature.set(key, (signature.get(key) ?? 0) + 1);
    }
  }
  if (!signature.size) return [];

  const scored = memories
    .filter((m) => m.collection !== collectionName)
    .map((memory) => {
      let score = 0;
      for (const tag of memory.tags) {
        const key = tag.toLowerCase();
        const weight = signature.get(key);
        if (weight) score += 2 + weight;
      }
      return { memory, score };
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        +new Date(b.memory.createdAt) - +new Date(a.memory.createdAt)
    )
    .slice(0, 8);

  return scored.map((item) => item.memory);
}

export function generateCollectionDescription(
  members: Memory[],
  keywords: string[] = []
): string {
  const n = members.length;
  const word = n === 1 ? "memory" : "memories";
  const keys = keywords.slice(0, 3);

  if (keys.length) {
    const topic = keys.map((k) => titleCase(k)).join(", ");
    return `AI grouped ${n} ${word} around ${topic}. Stays organized automatically.`;
  }
  if (n === 1) {
    return `AI grouped 1 memory into this collection — add more to keep it growing.`;
  }
  return `AI grouped ${n} ${word} that share the same thread. Stays organized automatically.`;
}