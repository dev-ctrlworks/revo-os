import type { MemoryType } from "./types";

export interface Summarizable {
  type: MemoryType;
  title?: string;
  content?: string;
  collection?: string;
  source?: string;
  domain?: string;
}

const typeWord: Record<MemoryType, string> = {
  screenshot: "screenshot",
  note: "note",
  document: "document",
  link: "page",
  image: "image",
  discussion: "conversation",
  email: "email",
  archive: "file",
};

const STOPWORDS = new Set([
  "the","a","an","and","or","but","if","then","so","for","nor","yet","of","to",
  "in","on","at","by","with","from","as","is","are","was","were","be","been",
  "being","have","has","had","do","does","did","will","would","can","could",
  "should","may","might","must","this","that","these","those","it","its","he",
  "she","we","they","you","your","my","our","their","his","her","i","me","us",
  "them","there","here","one","two","about","into","over","under","again",
  "further","than","also","too","very","just","not","no","yes","up","down",
  "out","off","like","more","most","some","any","each","few","both","all",
  "when","while","because","which","who","whom","whose","what","how","where",
  "why","the","had","its","was","were",
]);

function words(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9][a-z0-9'’-]*/g) ?? []).filter(
    (w) => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w)
  );
}

function cleanContent(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string): string[] {
  if (!text) return [];
  return (text.match(/[^.!?]+[.!?]+/g) ?? [])
    .map((s) => s.trim())
    .filter((s) => s.length >= 8);
}

function buildFreq(text: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const w of words(text)) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return freq;
}

function scoreSentence(sentence: string, freq: Map<string, number>): number {
  const toks = words(sentence);
  if (!toks.length) return -Infinity;
  let sum = 0;
  for (const t of toks) sum += freq.get(t) ?? 0;
  const weighted = sum / toks.length;
  const length =
    toks.length >= 6 && toks.length <= 28 ? 0.5 : Math.min(toks.length * 0.03, 0.25);
  return weighted * 2 + length;
}

function pickSentences(
  content: string,
  count: number,
  maxChars: number,
  dedupe: boolean
): string[] {
  const sentences = splitSentences(cleanContent(content));
  if (!sentences.length) return [];
  const freq = buildFreq(content);
  const scored = sentences
    .map((s) => ({ s, score: scoreSentence(s, freq) }))
    .filter((x) => Number.isFinite(x.score))
    .sort((a, b) => b.score - a.score);

  const chosen: string[] = [];
  const usedTokens = new Set<string>();
  for (const { s } of scored) {
    if (chosen.length >= count) break;
    const toks = words(s);
    if (toks.length < 3) continue;
    const duplicates = dedupe && [...toks].some((t) => usedTokens.has(t));
    if (duplicates && chosen.length > 0) continue;
    if (chosen.join(" ").length + s.length + 1 > maxChars) continue;
    toks.forEach((t) => usedTokens.add(t));
    chosen.push(s);
  }
  return chosen;
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value;
}

function originOf(m: Summarizable): string {
  if (m.source?.startsWith("Upload · ")) {
    return ` ${m.source.slice("Upload · ".length)}`;
  }
  if (m.source === "clipboard") {
    return " from the clipboard";
  }
  if (m.domain) {
    return ` from ${m.domain}`;
  }
  if (m.source && m.source !== "note") {
    return ` from ${m.source}`;
  }
  return "";
}

function bylineOf(m: Summarizable): string {
  return m.collection && m.collection !== "New captures"
    ? ` filed under “${m.collection}”`
    : "";
}

function titleFallback(m: Summarizable): string {
  return m.title && m.title.trim() ? ` titled “${truncate(m.title.trim(), 60)}”` : "";
}

export function generateMemorySummary(m: Summarizable): string {
  const word = typeWord[m.type] ?? "memory";
  const picks = pickSentences(m.content ?? "", 1, 160, true);
  const head = `A ${word}${originOf(m)}${bylineOf(m)}`;

  if (!picks.length) {
    return `${head}${titleFallback(m)}.`;
  }

  if (m.type === "note") {
    return m.source === "clipboard"
      ? `A note pasted from the clipboard: ${picks[0]}`
      : `A note recording: ${picks[0]}`;
  }

  return `${head}. ${picks[0]}`;
}

export function generateMemoryDescription(m: Summarizable): string {
  const word = typeWord[m.type] ?? "memory";
  const picks = pickSentences(m.content ?? "", 3, 420, false);

  if (!picks.length) {
    return `This ${word}${originOf(m)}${bylineOf(m)}.${titleFallback(m)} The full details were saved and made searchable.`;
  }

  const sourceWord =
    m.domain ??
    (m.source && m.source !== "note"
      ? m.source.replace(/^Upload · /, "").toLowerCase()
      : "");
  const opener = sourceWord ? `Key points from ${sourceWord}` : "Key points";
  const core = picks.join(" ");
  return `${opener}: ${core}${/[.!?]$/.test(core) ? "" : "."}`;
}

export function generateMemoryKeyPoints(m: Summarizable, max = 4): string[] {
  return pickSentences(m.content ?? "", max, 340, true).map((s) =>
    s.endsWith(".") ? s : `${s}.`
  );
}