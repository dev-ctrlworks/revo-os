// Context-matched, CC0/public-domain sample photos (via Openverse).
// Pools are photo sets under public/images/samples; the resolver below picks a
// pool from the memory's title/tags first, then its type, then its collection.
import type { Memory } from "@/lib/types";

export const SAMPLE_IMAGES: Record<string, string[]> = {
  apartment: [
    "/images/samples/apartment-1.jpg",
    "/images/samples/apartment-2.jpg",
    "/images/samples/apartment-3.jpg",
  ],
  archive: [
    "/images/samples/archive-1.jpg",
    "/images/samples/archive-2.jpg",
    "/images/samples/archive-3.jpg",
  ],
  books: [
    "/images/samples/books-1.jpg",
    "/images/samples/books-2.jpg",
    "/images/samples/books-3.jpg",
  ],
  camera: [
    "/images/samples/camera-1.jpg",
    "/images/samples/camera-2.jpg",
    "/images/samples/camera-3.jpg",
  ],
  cinema: [
    "/images/samples/cinema-1.jpg",
    "/images/samples/cinema-2.jpg",
    "/images/samples/cinema-3.jpg",
  ],
  code: [
    "/images/samples/code-1.jpg",
    "/images/samples/code-2.jpg",
    "/images/samples/code-3.jpg",
  ],
  computer: [
    "/images/samples/computer-1.jpg",
    "/images/samples/computer-2.jpg",
    "/images/samples/computer-3.jpg",
  ],
  conversation: [
    "/images/samples/conversation-1.jpg",
    "/images/samples/conversation-2.jpg",
    "/images/samples/conversation-3.jpg",
  ],
  desk: [
    "/images/samples/desk-1.jpg",
    "/images/samples/desk-2.jpg",
    "/images/samples/desk-3.jpg",
  ],
  document: [
    "/images/samples/document-1.jpg",
    "/images/samples/document-2.jpg",
    "/images/samples/document-3.jpg",
  ],
  dog: [
    "/images/samples/dog-1.jpg",
    "/images/samples/dog-2.jpg",
    "/images/samples/dog-3.jpg",
  ],
  espresso: [
    "/images/samples/espresso-1.jpg",
    "/images/samples/espresso-2.jpg",
    "/images/samples/espresso-3.jpg",
  ],
  flight: [
    "/images/samples/flight-1.jpg",
    "/images/samples/flight-2.jpg",
    "/images/samples/flight-3.jpg",
  ],
  "fujifilm-camera": [
    "/images/samples/fujifilm-camera-1.jpg",
    "/images/samples/fujifilm-camera-2.jpg",
    "/images/samples/fujifilm-camera-3.jpg",
  ],
  gift: [
    "/images/samples/gift-1.jpg",
    "/images/samples/gift-2.jpg",
    "/images/samples/gift-3.jpg",
  ],
  gym: [
    "/images/samples/gym-1.jpg",
    "/images/samples/gym-2.jpg",
    "/images/samples/gym-3.jpg",
  ],
  health: [
    "/images/samples/health-1.jpg",
    "/images/samples/health-2.jpg",
    "/images/samples/health-3.jpg",
  ],
  hiking: [
    "/images/samples/hiking-1.jpg",
    "/images/samples/hiking-2.jpg",
    "/images/samples/hiking-3.jpg",
  ],
  home: [
    "/images/samples/home-1.jpg",
    "/images/samples/home-2.jpg",
    "/images/samples/home-3.jpg",
  ],
  idea: [
    "/images/samples/idea-1.jpg",
    "/images/samples/idea-2.jpg",
    "/images/samples/idea-3.jpg",
  ],
  japan: [
    "/images/samples/japan-1.jpg",
    "/images/samples/japan-2.jpg",
    "/images/samples/japan-3.jpg",
  ],
  journal: [
    "/images/samples/journal-1.jpg",
    "/images/samples/journal-2.jpg",
    "/images/samples/journal-3.jpg",
  ],
  kitchen: [
    "/images/samples/kitchen-1.jpg",
    "/images/samples/kitchen-2.jpg",
    "/images/samples/kitchen-3.jpg",
  ],
  kyoto: [
    "/images/samples/kyoto-1.jpg",
    "/images/samples/kyoto-2.jpg",
    "/images/samples/kyoto-3.jpg",
  ],
  lens: [
    "/images/samples/lens-1.jpg",
    "/images/samples/lens-2.jpg",
    "/images/samples/lens-3.jpg",
  ],
  mail: [
    "/images/samples/mail-1.jpg",
    "/images/samples/mail-2.jpg",
    "/images/samples/mail-3.jpg",
  ],
  "nikon-camera": [
    "/images/samples/nikon-camera-1.jpg",
    "/images/samples/nikon-camera-2.jpg",
    "/images/samples/nikon-camera-3.jpg",
  ],
  notebook: [
    "/images/samples/notebook-1.jpg",
    "/images/samples/notebook-2.jpg",
    "/images/samples/notebook-3.jpg",
  ],
  office: [
    "/images/samples/office-1.jpg",
    "/images/samples/office-2.jpg",
    "/images/samples/office-3.jpg",
  ],
  phone: [
    "/images/samples/phone-1.jpg",
    "/images/samples/phone-2.jpg",
    "/images/samples/phone-3.jpg",
  ],
  photography: [
    "/images/samples/photography-1.jpg",
    "/images/samples/photography-2.jpg",
    "/images/samples/photography-3.jpg",
  ],
  ryokan: [
    "/images/samples/ryokan-1.jpg",
    "/images/samples/ryokan-2.jpg",
    "/images/samples/ryokan-3.jpg",
  ],
  "sony-camera": [
    "/images/samples/sony-camera-1.jpg",
    "/images/samples/sony-camera-2.jpg",
    "/images/samples/sony-camera-3.jpg",
  ],
  sourdough: [
    "/images/samples/sourdough-1.jpg",
    "/images/samples/sourdough-2.jpg",
    "/images/samples/sourdough-3.jpg",
  ],
  train: [
    "/images/samples/train-1.jpg",
    "/images/samples/train-2.jpg",
    "/images/samples/train-3.jpg",
  ],
  tv: [
    "/images/samples/tv-1.jpg",
    "/images/samples/tv-2.jpg",
    "/images/samples/tv-3.jpg",
  ],
  watercolor: [
    "/images/samples/watercolor-1.jpg",
    "/images/samples/watercolor-2.jpg",
    "/images/samples/watercolor-3.jpg",
  ],
  web: [
    "/images/samples/web-1.jpg",
    "/images/samples/web-2.jpg",
    "/images/samples/web-3.jpg",
  ],
};

/** Fallback keyword per memory type when no subject or collection is known. */
export const memoryTypeKeyword: Record<Memory["type"], string> = {
  screenshot: "computer",
  note: "notebook",
  document: "document",
  link: "web",
  image: "photography",
  discussion: "conversation",
  email: "mail",
  archive: "archive",
};

const collectionKeywords: Record<string, string> = {
  "Camera research": "camera",
  "Camera gear": "camera",
  "Apartment search": "apartment",
  "Japan trip": "japan",
  Ideas: "idea",
  Career: "office",
  Mango: "dog",
  "Tech stack": "code",
  Reading: "books",
  Kitchen: "kitchen",
  Journal: "journal",
  "Home ideas": "home",
  Hiking: "hiking",
  Health: "health",
  Entertainment: "cinema",
};

/** Resolve a sample-image keyword from a collection name (falls back to note). */
export function collectionKeyword(collection?: string): string {
  if (collection && collectionKeywords[collection]) {
    return collectionKeywords[collection];
  }
  return "notebook";
}

// Ordered subject rules matched against the memory's title + tags. More specific
// patterns come first so, e.g., a "Tamron lens for Sony E" resolves to a lens
// photo rather than a Sony body. First match wins.
const subjectRules: { pattern: RegExp; keyword: string }[] = [
  // cameras (lens before brands, since a lens title may also name a mount)
  { pattern: /\btamron\b|\blens\b|24-70|17-28|35mm/, keyword: "lens" },
  { pattern: /\bsony\b|\ba7\b|a6400|\balpha\b/, keyword: "sony-camera" },
  { pattern: /\bfujifilm\b|\bfuji\b|xt-?5/, keyword: "fujifilm-camera" },
  { pattern: /\bnikon\b|z-?6\b/, keyword: "nikon-camera" },
  {
    pattern: /\bcamera\b|photography|mirrorless|full-frame|autofocus|ibis\b/,
    keyword: "camera",
  },
  // japan trip
  { pattern: /\bryokan\b|onsen|hakone|gora\b/, keyword: "ryokan" },
  { pattern: /\bshinkansen\b|rail pass|\bjr\b|\btrain\b/, keyword: "train" },
  { pattern: /\bfushimi\b|inari|kyoto|arashiyama|torii\b/, keyword: "kyoto" },
  { pattern: /\bflight\b|nonstop|airline|\bsfo\b|\bnrt\b/, keyword: "flight" },
  { pattern: /\bjapan\b|tokyo|osaka|nara\b|itinerary/, keyword: "japan" },
  // housing
  { pattern: /\blease\b|contract|agreement|kestrel\b/, keyword: "apartment" },
  {
    pattern: /\bapartment\b|listing|\brent\b|loft|yardley|summit station|housing|bedroom\b/,
    keyword: "apartment",
  },
  // food / home / lifestyle
  { pattern: /\bespresso\b|coffee\b/, keyword: "espresso" },
  { pattern: /\bsourdough\b|crackers|\brecipe\b|\bbake\b/, keyword: "sourdough" },
  { pattern: /\bwatercolor\b/, keyword: "watercolor" },
  { pattern: /\bgym\b|workout|\bppl\b|dumbbell|fitness\b/, keyword: "gym" },
  { pattern: /\bphone\b|pixel|iphone|smartphone/, keyword: "phone" },
  { pattern: /\bgift\b|birthday|\bpresent\b/, keyword: "gift" },
  { pattern: /\bmango\b|\bdog\b|retriever|\bvet\b/, keyword: "dog" },
  { pattern: /\bstreaming\b|severance|the bear|\bwatch\b|\btv\b/, keyword: "tv" },
  { pattern: /\bhike\b|hiking|\btrail\b|mount tam|stinson|muir\b/, keyword: "hiking" },
  { pattern: /\bread\b|reading|\bbook\b|rubin|high castle/, keyword: "books" },
  { pattern: /\bfigma\b|wireframe|\bdesign\b/, keyword: "desk" },
  { pattern: /\bkitchen\b|\bcook\b/, keyword: "kitchen" },
];

/**
 * Resolve the best sample-image keyword for a memory. Precedence:
 * 1. title/tag subject rules (most specific)
 * 2. type rules for document/link (a document shows a doc photo, a link a web one)
 * 3. collection context
 * 4. generic type fallback
 */
export function memorySampleKeyword(
  type: Memory["type"],
  title?: string,
  tags?: string[],
  collection?: string
): string {
  const haystack = `${title ?? ""} ${(tags ?? []).join(" ")}`.toLowerCase();
  for (const rule of subjectRules) {
    if (rule.pattern.test(haystack)) return rule.keyword;
  }
  if (type === "document") return "document";
  if (type === "link") return "web";
  if (collection) return collectionKeyword(collection);
  return memoryTypeKeyword[type];
}

function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Deterministic pick from a keyword's pool, so SSR and client agree. */
export function pickSample(keyword: string, seed: string): string {
  const list = SAMPLE_IMAGES[keyword];
  if (!list || list.length === 0) {
    const firstKey = Object.keys(SAMPLE_IMAGES)[0];
    const fallback = SAMPLE_IMAGES[firstKey] ?? [];
    return fallback[hash(seed) % Math.max(fallback.length, 1)] ?? "";
  }
  return list[hash(`${keyword}:${seed}`) % list.length];
}
