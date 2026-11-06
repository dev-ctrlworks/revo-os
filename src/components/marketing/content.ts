import { memories } from "@/lib/mock-data";
import type { Memory } from "@/lib/types";

/**
 * Static copy and sample-data references for the marketing landing page.
 *
 * Everything here is either product copy or content drawn from the labeled
 * sample memories in `@/lib/mock-data`. The interactive showcase is explicitly
 * illustrative — it never claims to be a live AI answer.
 */

export interface MarketingNavItem {
  href: string;
  label: string;
  /** Short one-line subtitle shown under the label in dropdown menus. */
  desc?: string;
  children?: MarketingNavItem[];
}

export const marketingNav: MarketingNavItem[] = [
  {
    href: "#product",
    label: "Product",
    children: [
      { href: "/product/overview", label: "Overview", desc: "What Revo OS is and why it exists" },
      { href: "#features", label: "Features", desc: "A closer look at capture and recall" },
      { href: "#how", label: "How it works", desc: "Capture, connect, then ask it back" },
      { href: "#library", label: "Use case", desc: "Explore a sample memory library" },
    ],
  },
  {
    href: "/resources",
    label: "Resources",
    children: [
      { href: "/docs", label: "Documentation", desc: "Guides to get set up" },
      { href: "/blog", label: "Blogs", desc: "Product news and writing" },
      { href: "/help", label: "Help", desc: "Answers to common questions" },
      { href: "/compare", label: "Compare", desc: "How Revo OS compares" },
      { href: "/contact", label: "Contact", desc: "Get in touch with the team" },
    ],
  },
  { href: "/download", label: "Download" },
  { href: "/pricing", label: "Pricing" },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Revo OS?",
    answer:
      "A personal AI memory layer. Save what matters — notes, links, screenshots, files — then ask for it later and get an answer with its sources.",
  },
  {
    question: "What can I save today?",
    answer:
      "Paste, notes, links, files, and drag & drop are working capture methods. Screenshots and app imports are planned.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Your memories and uploads are stored privately in Supabase, scoped to your account with row-level security. Only you can access what you save.",
  },
  {
    question: "What happens when I ask a question?",
    answer:
      "Only the memories relevant to your question are sent to the AI provider to draft an answer. Every answer stays grounded in what you saved, with sources you can open.",
  },
  {
    question: "How is this different from a notes app or bookmarks?",
    answer:
      "Instead of filing everything yourself, you save first and ask later. Revo finds the sources and answers in plain language — and keeps related memories connected.",
  },
  {
    question: "Does it connect to other apps yet?",
    answer:
      "Not yet. Revo works with the capture methods above. Connecting apps and importing existing notes is planned.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes — you can create an account and start saving for free, with no credit card required.",
  },
  {
    question: "How do I get started?",
    answer:
      "Create a free account and start saving right away. You can also explore a live demo without signing up.",
  },
];

/** Capture methods that exist in the product today, plus where they stand. */
export const captureMethods: { label: string; detail: string; status: "live" | "planned" }[] = [
  { label: "Paste", detail: "Clipboard → memory", status: "live" },
  { label: "Note", detail: "Type it in", status: "live" },
  { label: "Link", detail: "Save a page by URL", status: "live" },
  { label: "Upload", detail: "Files, images & PDFs", status: "live" },
  { label: "Drag & drop", detail: "Drop it anywhere", status: "live" },
  { label: "Screenshot capture", detail: "Browser extension", status: "planned" },
];

type MemoryTypeLabel = Memory["type"];

export interface ShowcaseSource {
  id: string;
  title: string;
  type: MemoryTypeLabel;
  collection?: string;
}

export interface ShowcaseQuery {
  question: string;
  answer: string;
  sources: ShowcaseSource[];
}

function source(id: string): ShowcaseSource | null {
  const memory = memories.find((m) => m.id === id);
  if (!memory) return null;
  return { id: memory.id, title: memory.title, type: memory.type, collection: memory.collection };
}

function sources(...ids: string[]): ShowcaseSource[] {
  return ids
    .map(source)
    .filter((s): s is ShowcaseSource => s !== null);
}

/**
 * Curated examples for the interactive recall preview. Answers are written by
 * hand and attributed to the actual sample memories they draw from — so the
 * demonstration is honest rather than a live AI call.
 */
export const showcaseQueries: ShowcaseQuery[] = [
  {
    question: "Which camera was I leaning towards?",
    answer:
      "Your shortlist comes down to three: the Sony A7 IV leads on full-frame 4K60 and autofocus, the Nikon Z6 III is the runner-up, and the Fujifilm X-T5 is the compromise — all inside your $2,800 budget, with the Tamron 24-70 as your lens pick.",
    sources: sources("m1", "m3", "m4", "m30"),
  },
  {
    question: "What did I decide for the Japan trip?",
    answer:
      "A 14-day October trip: Tokyo, then a Hakone ryokan at Gora Kadan, Kyoto, and Osaka. You flagged a $680 nonstop JAL flight to book within 48 hours, and worked out that a JR pass only pays off if you add the Kiso Valley.",
    sources: sources("m11", "m12", "m13", "m28"),
  },
  {
    question: "Where am I with the apartment search?",
    answer:
      "The Kestrel is your front-runner — new building, pool and gym, and a 1-month-free move-in special. Yardley Court is the quieter pre-war backup. You drafted a lease for The Kestrel, unit 4C, with a June 1 move-in.",
    sources: sources("m6", "m7", "m23", "m24"),
  },
  {
    question: "What should I get Jane for her birthday?",
    answer:
      "A Saturday watercolor workshop at the community center is your best idea so far — around $85, well under the $150 budget, and it matches her photography and hiking interests. Backup options are a trail-running gift card or a sourdough book.",
    sources: sources("m19", "m34"),
  },
];

/** Topic clusters for the connections preview, built from sample memories. */
export const showcaseConnections: {
  topic: string;
  accent: string;
  items: ShowcaseSource[];
}[] = [
  {
    topic: "Camera research",
    accent: "var(--sky)",
    items: sources("m1", "m3", "m30"),
  },
  {
    topic: "Japan trip",
    accent: "var(--pink)",
    items: sources("m11", "m12", "m28"),
  },
  {
    topic: "Apartment search",
    accent: "var(--lime)",
    items: sources("m6", "m23", "m24"),
  },
];

/** Semantic accent per memory type (docs/DESIGN_SYSTEM.md §12). */
export const memoryTypeAccent: Record<MemoryTypeLabel, string> = {
  screenshot: "var(--cyan)",
  note: "var(--lime)",
  document: "var(--lavender)",
  link: "var(--sky)",
  image: "var(--pink)",
  discussion: "var(--lime-bright)",
  email: "var(--sky)",
  archive: "var(--border)",
};

export const memoryTypeLabels: Record<MemoryTypeLabel, string> = {
  screenshot: "Screenshot",
  note: "Note",
  document: "Document",
  link: "Link",
  image: "Image",
  discussion: "Conversation",
  email: "Email",
  archive: "Archive",
};

/**
 * Deeper shade of a pastel accent for text and icons that need contrast on
 * light pastel surfaces. Falls back to the accent itself for vivid colors.
 */
const accentInkMap: Record<string, string> = {
  "var(--sky)": "var(--sky-deep)",
  "var(--lime)": "var(--lime-deep)",
  "var(--pink)": "var(--pink-deep)",
  "var(--cyan)": "var(--cyan-deep)",
  "var(--lime-bright)": "var(--lime-bright-deep)",
  "var(--magenta)": "var(--magenta-deep)",
  "var(--lavender)": "var(--lavender-deep)",
  "var(--mint)": "var(--mint-deep)",
  "var(--coral)": "var(--coral-deep)",
  "var(--amber)": "var(--amber-deep)",
  "var(--periwinkle)": "var(--periwinkle-deep)",
  "var(--rose)": "var(--rose-deep)",
  "var(--teal)": "var(--teal-deep)",
  "var(--violet)": "var(--violet-deep)",
  "var(--border)": "var(--muted-foreground)",
};

export function accentInk(accent: string): string {
  return accentInkMap[accent] ?? accent;
}

/**
 * Uniform-contrast colour system. Every chip or icon tile is tinted in OKLCH at
 * a fixed lightness and chroma, so all colours share the same contrast and only
 * the hue varies. Hues are spread with the golden angle so neighbours never
 * repeat a colour.
 */
const GOLDEN_ANGLE = 137.508;
const HUE_START = 18;

export function hueFor(index: number): number {
  return (HUE_START + index * GOLDEN_ANGLE) % 360;
}

/** OKLCH tints derived from a hue, at fixed lightness/chroma for equal contrast. */
export function hueTints(hue: number) {
  return {
    bg: `oklch(0.95 0.045 ${hue})`,
    border: `oklch(0.82 0.075 ${hue})`,
    tile: `oklch(0.88 0.075 ${hue})`,
    ink: `oklch(0.42 0.1 ${hue})`,
  };
}

/* ------------------------------------------------------------------ *
 * Section content
 * ------------------------------------------------------------------ */

export interface HeroChip {
  label: string;
  accent: string;
}

export const heroChips: HeroChip[] = [
  { label: "No signup to explore", accent: "var(--sky)" },
  { label: "Private by default", accent: "var(--lime)" },
  { label: "Runs on sample data", accent: "var(--pink)" },
];

/** Muted social-proof-style line under the hero CTAs. Factual only. */
export const heroTrustLine =
  "Free to start · No credit card · Your memories stay private";

/** Product-principle quote closing the hero (no fabricated attribution). */
export const heroQuote =
  "Save anything. Preserve the context. Find connections. Recall what matters.";

export interface ProblemCard {
  icon: "search" | "context" | "scatter";
  title: string;
  text: string;
  accent: string;
}

export const problemCards: ProblemCard[] = [
  {
    icon: "search",
    title: "Lost in the pile",
    text: "You saved something useful, but weeks later you can't find it again.",
    accent: "var(--pink)",
  },
  {
    icon: "context",
    title: "Missing context",
    text: "You find the link, but you've forgotten why it mattered in the first place.",
    accent: "var(--sky)",
  },
  {
    icon: "scatter",
    title: "Scattered everywhere",
    text: "Notes, links, and files live in different apps with no thread between them.",
    accent: "var(--lime)",
  },
];

export const problemResolutions: string[] = [
  "One place for every kind of memory.",
  "Find things by asking, not by remembering.",
  "Related memories stay connected.",
];

export interface Step {
  icon: "save" | "connect" | "recall";
  step: string;
  title: string;
  text: string;
  accent: string;
}

export const howItWorksSteps: Step[] = [
  {
    icon: "save",
    step: "01",
    title: "Save",
    text: "Paste a note, drop a link, upload a file. No folders, no naming conventions, no deciding where it goes.",
    accent: "var(--sky)",
  },
  {
    icon: "connect",
    step: "02",
    title: "Connect",
    text: "Revo OS keeps the context around each save and links related memories together by topic — automatically.",
    accent: "var(--lime)",
  },
  {
    icon: "recall",
    step: "03",
    title: "Recall",
    text: "Ask in plain language and get an answer grounded in your memories, with the sources attached.",
    accent: "var(--pink)",
  },
];

export interface DifferentiationRow {
  them: string;
  us: string;
}

export const differentiationRows: DifferentiationRow[] = [
  {
    them: "Stores what you typed and nothing else.",
    us: "Keeps the reason you saved it alongside it.",
  },
  {
    them: "Saves links you'll never open again.",
    us: "Answers questions about what you saved.",
  },
  {
    them: "Matches the exact words you search for.",
    us: "Understands what you actually mean.",
  },
  {
    them: "Makes you file everything into folders.",
    us: "Connects related memories on its own.",
  },
];

export interface FooterColumn {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { href: "/sign-up", label: "Start free" },
      { href: "/download", label: "Download" },
      { href: "#product", label: "Product tour" },
      { href: "#how", label: "How it works" },
      { href: "/dashboard", label: "Live demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/sign-in", label: "Sign in" },
      { href: "mailto:hello@revoos.app", label: "Contact", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

/**
 * Download page content. The browser extension is the primary, ready-to-install
 * surface; mobile and desktop apps are shown as upcoming so the page never
 * presents an unbuilt product as available (see AGENTS.md §4.1).
 */
export type DownloadStatus = "available" | "coming-soon";

export interface DownloadStep {
  step: string;
  title: string;
  text: string;
}

export const downloadSteps: DownloadStep[] = [
  {
    step: "01",
    title: "Add to your browser",
    text: "Install the Revo OS extension from the Chrome Web Store or Firefox Add-ons.",
  },
  {
    step: "02",
    title: "Sign in once",
    text: "Connect the extension to your Revo OS account. It stays signed in on that device.",
  },
  {
    step: "03",
    title: "Save as you browse",
    text: "Click the toolbar button, or use the shortcut, to save a page with its context.",
  },
];

export interface DownloadFaq {
  question: string;
  answer: string;
}

export const downloadFaqs: DownloadFaq[] = [
  {
    question: "Is the extension free?",
    answer:
      "Yes. The extension is free and included with your Revo OS account — there's no separate purchase or upgrade to install it.",
  },
  {
    question: "Which browsers are supported?",
    answer:
      "The extension is available for Chrome and Firefox today. Support for other Chromium browsers, and for Safari, is coming next.",
  },
  {
    question: "Do the mobile or desktop apps exist yet?",
    answer:
      "Not yet. Mobile apps for iOS and Android and a desktop app are planned; this page will link to them here once they ship.",
  },
  {
    question: "Can I use Revo OS without the extension?",
    answer:
      "Absolutely. The web app works on its own and you can capture, organize, and ask questions right away — the extension just makes saving as you browse faster.",
  },
];

export const extensionStores = {
  chrome: "https://chromewebstore.google.com/detail/revo-os",
  firefox: "https://addons.mozilla.org/firefox/addon/revo-os/",
} as const;

export interface FuturePlatform {
  key: "ios" | "android" | "desktop";
  name: string;
  note: string;
  accent: string;
}

export const futurePlatforms: FuturePlatform[] = [
  { key: "ios", name: "iOS", note: "iPhone & iPad", accent: "var(--sky)" },
  { key: "android", name: "Android", note: "Phones & tablets", accent: "var(--lime)" },
  { key: "desktop", name: "Desktop", note: "macOS & Windows", accent: "var(--pink)" },
];

export interface ShowcaseTab {
  key: "capture" | "recall" | "connections";
  label: string;
  hint: string;
  accent: string;
}

export const showcaseTabs: ShowcaseTab[] = [
  { key: "capture", label: "Capture", hint: "Save anything", accent: "var(--sky)" },
  { key: "recall", label: "Ask", hint: "Get an answer with sources", accent: "var(--lime)" },
  { key: "connections", label: "Connect", hint: "See what links up", accent: "var(--pink)" },
];

/**
 * Product overview page copy. Describes the product's current capabilities plus
 * clearly-labelled planned work; it never presents an unbuilt surface as live
 * (see AGENTS.md §4.1).
 */
export const overviewHero = {
  kicker: "Product overview",
  title: "Your whole digital life, in one connected memory.",
  lead: "Revo OS is a personal AI memory layer. Save notes, links, screenshots, and files in one place — then find anything by asking in plain language.",
} as const;

export const overviewPrinciples: string[] = [
  "Save anything",
  "Preserve the context",
  "Find connections",
  "Recall what matters",
];

export interface OverviewValuePoint {
  title: string;
  text: string;
  accent: string;
}

export const overviewValuePoints: OverviewValuePoint[] = [
  {
    title: "One place, every kind of memory",
    text: "Notes, links, screenshots, images, and files land together — no folders to build, no naming to fight.",
    accent: "var(--sky)",
  },
  {
    title: "Context kept, not discarded",
    text: "Every memory carries why it mattered and where it came from, so it still makes sense months later.",
    accent: "var(--lime)",
  },
  {
    title: "Recall instead of re-search",
    text: "Ask a question and get an answer grounded in what you saved, with the sources attached.",
    accent: "var(--pink)",
  },
];

export interface OverviewCapability {
  key:
    | "capture"
    | "recall"
    | "connections"
    | "search"
    | "collections"
    | "privacy"
    | "anywhere";
  title: string;
  text: string;
  accent: string;
  status?: "planned";
}

export const overviewCapabilities: OverviewCapability[] = [
  {
    key: "capture",
    title: "Capture anything",
    text: "Paste a note, save a link, upload a file, or drag and drop. The source and metadata are kept with it.",
    accent: "var(--sky)",
  },
  {
    key: "recall",
    title: "Ask in plain language",
    text: "A natural-language question returns an answer drawn from your memories, with references you can open.",
    accent: "var(--violet)",
  },
  {
    key: "connections",
    title: "See the connections",
    text: "Revo surfaces how memories relate, so the thread behind an idea is never lost.",
    accent: "var(--pink)",
  },
  {
    key: "search",
    title: "Search everything",
    text: "Full-text search across every note, page, and document you've saved.",
    accent: "var(--lime)",
  },
  {
    key: "collections",
    title: "Collections that build themselves",
    text: "Related memories group automatically, so there's nothing to file by hand.",
    accent: "var(--cyan)",
  },
  {
    key: "privacy",
    title: "Private by default",
    text: "Your memories and uploads are scoped to your account with row-level security and private storage.",
    accent: "var(--teal)",
  },
  {
    key: "anywhere",
    title: "With you everywhere",
    text: "Use the web app today; the browser extension (Chrome, Plus/Pro) is available now, with mobile and desktop apps on the way.",
    accent: "var(--periwinkle)",
    status: "planned",
  },
];

export interface OverviewStep {
  step: string;
  title: string;
  text: string;
  accent: string;
}

export const overviewSteps: OverviewStep[] = [
  {
    step: "01",
    title: "Capture",
    text: "Drop in whatever's useful — a link, a note, a screenshot, a file. No decision about where it goes.",
    accent: "var(--sky)",
  },
  {
    step: "02",
    title: "Connect",
    text: "Revo keeps the context and links related memories by topic, building collections as you go.",
    accent: "var(--lime)",
  },
  {
    step: "03",
    title: "Recall",
    text: "Ask for what you need and get an answer grounded in your memories, with sources attached.",
    accent: "var(--pink)",
  },
];

export interface OverviewComparisonRow {
  them: string;
  us: string;
}

export const overviewComparisonRows: OverviewComparisonRow[] = [
  { them: "Stores what you typed, and nothing else.", us: "Keeps the reason you saved it alongside it." },
  { them: "Saves links you'll never open again.", us: "Answers questions about what you saved." },
  { them: "Matches only the exact words you search.", us: "Understands what you actually mean." },
  { them: "Makes you file everything into folders.", us: "Connects related memories on its own." },
];

export const overviewFaqs: { question: string; answer: string }[] = [
  {
    question: "What exactly is Revo OS?",
    answer:
      "A personal AI memory layer. You save notes, links, screenshots, and files in one place, and Revo keeps the context around each one so you can find and use it later.",
  },
  {
    question: "What can I capture today?",
    answer:
      "Paste, notes, links, file uploads, and drag & drop are live. Screenshots and selection capture are available via the Chrome browser extension (Plus/Pro), along with mobile and desktop apps planned.",
  },
  {
    question: "How is this different from a notes or bookmarks app?",
    answer:
      "Instead of filing everything yourself, you save first and ask later. Revo finds the sources, answers in plain language, and keeps related memories connected.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Your memories and uploads are stored privately in Supabase, scoped to your account with row-level security. Only you can access what you save.",
  },
  {
    question: "What happens when I ask a question?",
    answer:
      "Only the memories relevant to your question are sent to the AI provider to draft an answer. Every answer stays grounded in what you saved, with sources you can open.",
  },
  {
    question: "Does Revo OS connect to other apps yet?",
    answer:
      "Not yet. Revo works with the capture methods above. Connecting apps and importing existing notes is planned.",
  },
];
