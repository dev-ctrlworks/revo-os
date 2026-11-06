/**
 * Centralized pricing and entitlement configuration.
 *
 * This module is the single source of truth for everything the pricing page
 * displays: prices, allowances, feature availability, the comparison table,
 * and the FAQ. The pricing cards, the comparison table, and the JSON-LD in
 * `app/pricing/page.tsx` all read from here so they cannot drift apart.
 *
 * IMPORTANT — read before changing these values:
 *
 * 1. There is no payment provider and no subscription system in this project
 *    yet. These prices are *proposed launch configuration*. Nothing here
 *    creates a checkout, stores payment details, or grants a paid plan.
 * 2. The allowances below are **not enforced**. There is no usage-tracking
 *    table and no server-side quota check, so every account currently has the
 *    same access regardless of plan. `LIMITS_ARE_ENFORCED` records this, and
 *    the pricing page states it plainly rather than implying limits are live.
 * 3. Feature availability is tracked separately from plan entitlements.
 *    A capability can be included in a plan (entitlement = true) and still be
 *    unbuilt (status = "planned"). The page marks those cells "Planned"
 *    instead of showing a checkmark, per AGENTS.md §4.1.
 *
 * When billing and quota enforcement are implemented, `resolveEntitlements()`
 * and the `PlanLimits` values are the hook points — update the enforcement
 * status flag and the UI note at the same time.
 */

export type PlanId = "free" | "plus" | "pro";

export type BillingCycle = "monthly" | "annual";

/** Whether a capability works in the product today. */
export type FeatureStatus = "available" | "planned";

export const PLAN_IDS: readonly PlanId[] = ["free", "plus", "pro"] as const;

/**
 * True only once the server rejects requests that exceed a plan's allowances.
 * Today it is false: there is no subscription, usage-tracking, or quota
 * enforcement layer in the app.
 */
export const LIMITS_ARE_ENFORCED = false;

/**
 * Shown on the pricing page so visitors are never told a limit is being
 * applied when it is not.
 */
export const ENFORCEMENT_NOTE =
  "Plan allowances and paid features are being rolled out. Automated limit enforcement isn't switched on yet, so every account currently has the same access and nothing is charged.";

/* -------------------------------------------------------------------------- */
/* Entitlements                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Boolean capability matrix per plan. Kept flat and exhaustive so a new
 * capability has to be classified for every plan instead of silently
 * inheriting a default.
 */
export interface PlanEntitlements {
  /** Keyword / full-text search across saved memories. */
  keywordSearch: boolean;
  /** Embedding-based semantic search (not built — search is full-text). */
  semanticSearch: boolean;
  /** Submitting a question to the AI recall feature. */
  aiRecallQuestions: boolean;
  /** Generating a one-page AI summary of a collection or connections, downloadable as PDF. */
  aiSummaries: boolean;
  /** AI-generated tags and organization (not built). */
  autoTagging: boolean;
  /** Text extraction / OCR for images (not built). */
  ocr: boolean;
  /** Manual tags and collections. */
  tagsAndCollections: boolean;
  /** Manually linking two memories. */
  manualConnections: boolean;
  /** The knowledge graph view. */
  knowledgeGraph: boolean;
  /** AI-suggested relationships between memories. */
  aiSuggestedConnections: boolean;
  /** AI-generated collections from memories. */
  autoCollections: boolean;
  /** Filtering the graph by memory properties (not built). */
  graphFilters: boolean;
  /** Deeper relationship discovery across memories (not built). */
  advancedRelationshipDiscovery: boolean;
  /** Browser extension capture (not shipped in this repository). */
  browserCapture: boolean;
  /** Uploading images and documents. */
  fileUploads: boolean;
  /** Importing individual files as memories. */
  basicImports: boolean;
  /** Importing many files at once (not built). */
  bulkImports: boolean;
  /** Exporting your data (not built — no export route exists). */
  dataExport: boolean;
  /** Exporting many memories at once (not built). */
  bulkExport: boolean;
  /** Linking a third-party account (no integrations exist yet). */
  connectedServices: boolean;
  /** Continuous sync with a connected service (not built). */
  automaticSync: boolean;
  /** Managing connected services and their settings (not built). */
  integrationManagement: boolean;
  /** Advanced synchronization rules (not built). */
  advancedSyncControls: boolean;
  /** Scheduled workflows and automations (not built). */
  automation: boolean;
  /** A public API and webhooks for customers (not built). */
  apiAccess: boolean;
  /** Background sync between your devices (not built). */
  crossDeviceSync: boolean;
  /** Priority support channel (not built). */
  prioritySupport: boolean;
  /** Advanced account controls (not built). */
  advancedAccountControls: boolean;
}

export type FeatureKey = keyof PlanEntitlements;

/**
 * Whether each capability works today. "planned" means it is part of the plan
 * design but not shipped, so the UI must not present it as available.
 */
export const FEATURE_STATUS: Record<FeatureKey, FeatureStatus> = {
  keywordSearch: "available",
  semanticSearch: "planned",
  aiRecallQuestions: "available",
  aiSummaries: "available",
  autoTagging: "available",
  ocr: "planned",
  tagsAndCollections: "available",
  manualConnections: "available",
  knowledgeGraph: "available",
  aiSuggestedConnections: "available",
  autoCollections: "available",
  graphFilters: "planned",
  advancedRelationshipDiscovery: "planned",
  browserCapture: "available",
  fileUploads: "available",
  basicImports: "available",
  bulkImports: "available",
  dataExport: "available",
  bulkExport: "available",
  connectedServices: "planned",
  automaticSync: "planned",
  integrationManagement: "planned",
  advancedSyncControls: "planned",
  automation: "planned",
  apiAccess: "planned",
  crossDeviceSync: "planned",
  prioritySupport: "planned",
  advancedAccountControls: "planned",
};

/* -------------------------------------------------------------------------- */
/* Limits                                                                      */
/* -------------------------------------------------------------------------- */

export interface PlanLimits {
  /** Maximum saved memories. `null` means no cap is proposed. */
  memories: number | null;
  /** Storage allowance in gigabytes. */
  storageGb: number;
  /** AI recall questions per month. */
  aiQuestionsPerMonth: number;
  /** AI summaries per month. */
  aiSummariesPerMonth: number;
  /** Visible knowledge-graph nodes. `null` means the whole library. */
  graphNodes: number | null;
  /** Connected third-party services. `null` means not defined yet. */
  connectedServices: number | null;
  supportLevel: "standard" | "priority";
}

/* -------------------------------------------------------------------------- */
/* Plans                                                                       */
/* -------------------------------------------------------------------------- */

export interface PlanHighlight {
  label: string;
  /** Mirrors the global feature status for the capability being highlighted. */
  status: FeatureStatus;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  /** Short audience-focused line shown under the plan name. */
  tagline: string;
  /** Longer positioning sentence used on the card. */
  description: string;
  /** Price per month in USD when billed monthly. */
  monthlyPrice: number;
  /** Price per year in USD when billed annually. */
  annualPrice: number;
  cta: string;
  /** Where the primary CTA leads. */
  href: string;
  /** Accent token used for the plan's chips and numbers. */
  accent: string;
  /** Marks the recommended plan. */
  featured: boolean;
  limits: PlanLimits;
  entitlements: PlanEntitlements;
  /** Compact key benefits rendered on the card. */
  highlights: PlanHighlight[];
  /** Small note rendered under the CTA (e.g. purchase state). */
  note: string;
}

const FREE_ENTITLEMENTS: PlanEntitlements = {
  keywordSearch: true,
  semanticSearch: false,
  aiRecallQuestions: true,
  aiSummaries: true,
  autoTagging: false,
  ocr: false,
  tagsAndCollections: true,
  manualConnections: true,
  knowledgeGraph: true,
  aiSuggestedConnections: false,
  autoCollections: false,
  graphFilters: false,
  advancedRelationshipDiscovery: false,
  browserCapture: true,
  fileUploads: true,
  basicImports: true,
  bulkImports: false,
  dataExport: false,
  bulkExport: false,
  connectedServices: false,
  automaticSync: false,
  integrationManagement: false,
  advancedSyncControls: false,
  automation: false,
  apiAccess: false,
  crossDeviceSync: false,
  prioritySupport: false,
  advancedAccountControls: false,
};

const PLUS_ENTITLEMENTS: PlanEntitlements = {
  ...FREE_ENTITLEMENTS,
  semanticSearch: true,
  aiSummaries: true,
  autoTagging: true,
  ocr: true,
  aiSuggestedConnections: true,
  autoCollections: true,
  graphFilters: true,
  browserCapture: true,
  bulkImports: true,
  dataExport: true,
  connectedServices: true,
  automaticSync: true,
  integrationManagement: true,
  advancedSyncControls: true,
  crossDeviceSync: true,
};

const PRO_ENTITLEMENTS: PlanEntitlements = {
  ...PLUS_ENTITLEMENTS,
  advancedRelationshipDiscovery: true,
  bulkExport: true,
  automation: true,
  apiAccess: true,
  prioritySupport: true,
  advancedAccountControls: true,
};

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "A useful starting point for building a personal memory library.",
    description:
      "Capture what matters, organize it by hand, and ask your library questions — without a card.",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Get Started Free",
    href: "/sign-up",
    accent: "var(--sky)",
    featured: false,
    limits: {
      memories: 500,
      storageGb: 1,
      aiQuestionsPerMonth: 20,
      aiSummariesPerMonth: 10,
      graphNodes: 100,
      connectedServices: null,
      supportLevel: "standard",
    },
    entitlements: FREE_ENTITLEMENTS,
    highlights: [
      { label: "Save up to 500 memories", status: "available" },
      { label: "1 GB of storage", status: "available" },
      { label: "20 AI recall questions a month", status: "available" },
      { label: "10 AI collection summaries a month", status: "available" },
      { label: "Keyword search, tags, and collections", status: "available" },
      { label: "Manual connections and a basic graph", status: "available" },
      { label: "Image and file uploads", status: "available" },
    ],
    note: "No card required.",
  },
  plus: {
    id: "plus",
    name: "Plus",
    tagline: "Connect your digital life and find what matters faster.",
    description:
      "More room, more AI assistance, and the full knowledge graph for a library that's growing.",
    monthlyPrice: 5.99,
    annualPrice: 59.99,
    cta: "Get Plus",
    href: "/sign-up",
    accent: "var(--violet)",
    featured: true,
    limits: {
      memories: 5000,
      storageGb: 25,
      aiQuestionsPerMonth: 300,
      aiSummariesPerMonth: 100,
      graphNodes: null,
      connectedServices: null,
      supportLevel: "standard",
    },
    entitlements: PLUS_ENTITLEMENTS,
    highlights: [
      { label: "Up to 5,000 memories", status: "available" },
      { label: "25 GB of storage", status: "available" },
      { label: "300 AI recall questions a month", status: "available" },
      { label: "100 AI collection summaries a month", status: "available" },
      { label: "Semantic search and AI-assisted tagging", status: "planned" },
      { label: "Full knowledge graph with filters", status: "planned" },
      { label: "AI-suggested connections", status: "planned" },
      { label: "Connected services and automatic sync", status: "planned" },
    ],
    note: "No credit card required.",
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "More capacity and control for a growing knowledge network.",
    description:
      "The largest allowance, deeper relationship discovery, and the widest control over how your library is managed.",
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    cta: "Get Pro",
    href: "/sign-up",
    accent: "var(--periwinkle)",
    featured: false,
    limits: {
      memories: 20000,
      storageGb: 100,
      aiQuestionsPerMonth: 1000,
      aiSummariesPerMonth: 300,
      graphNodes: null,
      connectedServices: null,
      supportLevel: "priority",
    },
    entitlements: PRO_ENTITLEMENTS,
    highlights: [
      { label: "Up to 20,000 memories", status: "available" },
      { label: "100 GB of storage", status: "available" },
      { label: "1,000 AI recall questions a month", status: "available" },
      { label: "300 AI collection summaries a month", status: "available" },
      { label: "Advanced graph exploration and filters", status: "planned" },
      { label: "Deeper relationship discovery", status: "planned" },
      { label: "Bulk import and export", status: "planned" },
      { label: "Priority support", status: "planned" },
    ],
    note: "No credit card required.",
  },
};

export const PLAN_ORDER: readonly PlanId[] = ["free", "plus", "pro"] as const;

/* -------------------------------------------------------------------------- */
/* Pricing helpers                                                             */
/* -------------------------------------------------------------------------- */

/** The effective monthly price when billed annually (annual ÷ 12). */
export function annualEffectiveMonthly(plan: PlanConfig): number {
  if (plan.annualPrice === 0) return 0;
  return plan.annualPrice / 12;
} 

/** Formats a price with two decimals only when it isn't a whole number. */
export function formatUsd(value: number): string {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

/**
 * Percentage saved by paying annually versus monthly, rounded to the nearest
 * whole percent. Derived from the prices so it stays correct when they change.
 */
export function annualSavingsPercent(plan: PlanConfig): number {
  if (plan.monthlyPrice === 0 || plan.annualPrice === 0) return 0;
  const fullYear = plan.monthlyPrice * 12;
  return Math.round((1 - plan.annualPrice / fullYear) * 100);
}

/** The largest annual saving across the paid plans. */
export function maxAnnualSavingsPercent(): number {
  return Math.max(...PLAN_ORDER.map((id) => annualSavingsPercent(PLANS[id])));
}

export interface DisplayedPrice {
  /** The amount actually charged for the selected billing cycle. */
  total: number;
  /** The unit the total is charged in. */
  unit: "month" | "year";
  /** The per-month equivalent, only meaningful for yearly billing. */
  perMonth: number;
  /** Whether `perMonth` differs from `total` and needs its own label. */
  showsEquivalent: boolean;
}

/** Resolves what to show for a plan under the selected billing cycle. */
export function displayedPrice(
  plan: PlanConfig,
  billing: BillingCycle
): DisplayedPrice {
  if (billing === "monthly") {
    return {
      total: plan.monthlyPrice,
      unit: "month",
      perMonth: plan.monthlyPrice,
      showsEquivalent: false,
    };
  }
  return {
    total: plan.annualPrice,
    unit: "year",
    perMonth: annualEffectiveMonthly(plan),
    showsEquivalent: plan.annualPrice > 0,
  };
}

/** Resolves the entitlement set for a plan. */
export function resolveEntitlements(planId: PlanId): PlanEntitlements {
  return PLANS[planId].entitlements;
}

/* -------------------------------------------------------------------------- */
/* Comparison table                                                            */
/* -------------------------------------------------------------------------- */

export type ComparisonCell =
  | { kind: "text"; text: string }
  | { kind: "yes" }
  | { kind: "no" }
  | { kind: "planned" };

export interface ComparisonRow {
  label: string;
  /** Resolves the cell for a plan from that plan's own configuration. */
  cell: (plan: PlanConfig) => ComparisonCell;
}

export interface ComparisonGroup {
  id: string;
  title: string;
  rows: ComparisonRow[];
}

/**
 * Builds a cell from a plan entitlement plus the global feature status:
 * not included → "no"; included and shipped → yes; included but unbuilt →
 * "planned", so the page never implies an unbuilt capability is available.
 */
function featureCell(
  plan: PlanConfig,
  key: FeatureKey
): ComparisonCell {
  if (!plan.entitlements[key]) return { kind: "no" };
  return FEATURE_STATUS[key] === "available"
    ? { kind: "yes" }
    : { kind: "planned" };
}

function limitText(plan: PlanConfig, value: number | null): string {
  if (value === null) return "Unlimited";
  return value.toLocaleString("en-US");
}

export const COMPARISON_GROUPS: ComparisonGroup[] = [
  {
    id: "memory",
    title: "Memory and storage",
    rows: [
      {
        label: "Saved memory limit",
        cell: (plan) => ({
          kind: "text",
          text: limitText(plan, plan.limits.memories),
        }),
      },
      {
        label: "Storage capacity",
        cell: (plan) => ({
          kind: "text",
          text: `${plan.limits.storageGb} GB`,
        }),
      },
      {
        label: "Keyword search",
        cell: (plan) => featureCell(plan, "keywordSearch"),
      },
      {
        label: "Semantic search",
        cell: (plan) => featureCell(plan, "semanticSearch"),
      },
      {
        label: "AI recall questions per month",
        cell: (plan) => ({
          kind: "text",
          text: plan.limits.aiQuestionsPerMonth.toLocaleString("en-US"),
        }),
      },
      {
        label: "AI collection summaries",
        cell: (plan) => featureCell(plan, "aiSummaries"),
      },
      {
        label: "AI collection summaries per month",
        cell: (plan) => ({
          kind: "text",
          text: plan.limits.aiSummariesPerMonth.toLocaleString("en-US"),
        }),
      },
      {
        label: "AI-assisted organization",
        cell: (plan) => featureCell(plan, "autoTagging"),
      },
      {
        label: "OCR for supported content",
        cell: (plan) => featureCell(plan, "ocr"),
      },
    ],
  },
  {
    id: "graph",
    title: "Organization and knowledge graph",
    rows: [
      {
        label: "Tags and collections",
        cell: (plan) => featureCell(plan, "tagsAndCollections"),
      },
      {
        label: "Manual memory connections",
        cell: (plan) => featureCell(plan, "manualConnections"),
      },
      {
        label: "Knowledge graph",
        cell: (plan) => featureCell(plan, "knowledgeGraph"),
      },
      {
        label: "Visible graph nodes",
        cell: (plan) => ({
          kind: "text",
          text:
            plan.limits.graphNodes === null
              ? "Full library"
              : `Up to ${plan.limits.graphNodes.toLocaleString("en-US")}`,
        }),
      },
      {
        label: "AI-suggested connections",
        cell: (plan) => featureCell(plan, "aiSuggestedConnections"),
      },
      {
        label: "Graph filters",
        cell: (plan) => featureCell(plan, "graphFilters"),
      },
      {
        label: "Advanced relationship discovery",
        cell: (plan) => featureCell(plan, "advancedRelationshipDiscovery"),
      },
    ],
  },
  {
    id: "capture",
    title: "Capture and imports",
    rows: [
      {
        label: "Web app capture (links, notes, images, files)",
        cell: (plan) =>
          plan.entitlements.fileUploads
            ? { kind: "yes" }
            : { kind: "no" },
      },
      {
        label: "Browser extension capture",
        cell: (plan) => featureCell(plan, "browserCapture"),
      },
      {
        label: "Image and document uploads",
        cell: (plan) => featureCell(plan, "fileUploads"),
      },
      {
        label: "Individual file imports",
        cell: (plan) => featureCell(plan, "basicImports"),
      },
      {
        label: "Bulk imports",
        cell: (plan) => featureCell(plan, "bulkImports"),
      },
      {
        label: "Data export",
        cell: (plan) => featureCell(plan, "dataExport"),
      },
      {
        label: "Bulk export",
        cell: (plan) => featureCell(plan, "bulkExport"),
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations and sync",
    rows: [
      {
        label: "Direct connected services",
        cell: (plan) => featureCell(plan, "connectedServices"),
      },
      {
        label: "Connected services allowed",
        cell: (plan) => ({
          kind: "text",
          text:
            plan.limits.connectedServices === null
              ? "Not defined yet"
              : String(plan.limits.connectedServices),
        }),
      },
      {
        label: "Automatic synchronization",
        cell: (plan) => featureCell(plan, "automaticSync"),
      },
      {
        label: "Integration management",
        cell: (plan) => featureCell(plan, "integrationManagement"),
      },
      {
        label: "Advanced sync controls",
        cell: (plan) => featureCell(plan, "advancedSyncControls"),
      },
      {
        label: "Automation and scheduled workflows",
        cell: (plan) => featureCell(plan, "automation"),
      },
      {
        label: "API and webhooks",
        cell: (plan) => featureCell(plan, "apiAccess"),
      },
    ],
  },
  {
    id: "account",
    title: "Account and support",
    rows: [
      {
        label: "Cross-device synchronization",
        cell: (plan) => featureCell(plan, "crossDeviceSync"),
      },
      {
        label: "Priority support",
        cell: (plan) => featureCell(plan, "prioritySupport"),
      },
      {
        label: "Advanced account controls",
        cell: (plan) => featureCell(plan, "advancedAccountControls"),
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Integrations section                                                        */
/* -------------------------------------------------------------------------- */

export interface IntegrationGroup {
  id: string;
  title: string;
  summary: string;
  /** Individual points shown under the group. */
  points: string[];
  /** False when the capability isn't available in the product yet. */
  available: boolean;
}

export const INTEGRATION_GROUPS: IntegrationGroup[] = [
  {
    id: "capture",
    title: "Browser capture",
    summary:
      "Save from the web app and keep the source attached to what you saved.",
    points: [
      "Save links and notes straight from the Revo OS web app",
      "Upload images and documents, or drag and drop them in",
      "The originating link and domain stay attached to the memory",
    ],
    available: true,
  },
  {
    id: "files",
    title: "Files and documents",
    summary:
      "Bring your own files in and they become first-class memories.",
    points: [
      "Images: PNG, JPEG, GIF, WebP, and AVIF",
      "Documents: PDF, plain text, Markdown, and JSON",
      "Up to 25 MB per file, stored privately with your account",
    ],
    available: true,
  },
  {
    id: "cloud",
    title: "Cloud storage",
    summary:
      "Importing from a cloud drive is on the roadmap, but no cloud account can be linked today.",
    points: [
      "Google Drive import is not available yet",
      "One-time import and continuous sync are separate features",
      "Nothing syncs from an external account automatically",
    ],
    available: false,
  },
  {
    id: "notes",
    title: "Notes and knowledge tools",
    summary:
      "Revo OS does not connect to other note apps yet — imported content becomes a memory in your own library.",
    points: [
      "Notion import is not available yet",
      "Manual file import is not the same as a connected account",
      "Every imported item can be tagged, collected, and linked by hand",
    ],
    available: false,
  },
  {
    id: "advanced",
    title: "Advanced workflows",
    summary:
      "Automations, a public API, and webhooks are part of the plan design but have not shipped.",
    points: [
      "Scheduled workflows are planned, not live",
      "There is no public API or webhook access today",
      "Priority processing depends on infrastructure that isn't in place",
    ],
    available: false,
  },
];

/* -------------------------------------------------------------------------- */
/* Knowledge graph / AI section                                                */
/* -------------------------------------------------------------------------- */

export interface GraphTier {
  planId: PlanId;
  title: string;
  points: string[];
}

export const GRAPH_TIERS: GraphTier[] = [
  {
    planId: "free",
    title: "Organize",
    points: [
      "Organize memories by hand with tags and collections",
      "Create manual connections between related memories",
      "Explore a basic knowledge graph",
    ],
  },
  {
    planId: "plus",
    title: "Discover",
    points: [
      "Find related memories with AI-assisted search",
      "Get suggested connections between memories you saved",
      "Explore the full library in the graph with filters",
    ],
  },
  {
    planId: "pro",
    title: "Understand",
    points: [
      "Explore a larger memory network",
      "Use advanced graph controls and deeper relationship discovery",
      "Manage the full library with bulk import and export",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export interface PricingFaq {
  question: string;
  answer: string;
}

export const PRICING_FAQS: PricingFaq[] = [
  {
    question: "Can I use RevoOS for free?",
    answer:
      "Yes. The Free plan includes a personal memory library with up to 500 saved memories, 1 GB of storage, 20 AI recall questions and 10 AI collection summaries a month, keyword search, manual tags and collections, manual connections between memories, a basic knowledge graph, and image and file uploads. No credit card is required.",
  },
  {
    question: "What counts as an AI recall question?",
    answer:
      "One question you submit in Ask. RevoOS searches your saved memories with full-text search, sends only the relevant matches to the AI provider, and writes an answer you can open back to its sources. Each submission counts as one recall question. Unused questions don't roll over into the next month.",
  },
  {
    question: "What counts as an AI summary?",
    answer:
      "One summary of a collection or of your connections (linked memories). Open a collection and use Summarize, or open Connections and use Summarize, to generate a one-page, grounded brief you can download as a PDF, with the sources it drew on. Each generation counts as one summary. Automated enforcement of the monthly allowance isn't switched on yet, so no account is currently blocked for passing it.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Paid plans can't be purchased yet, so there are no plan changes to make today and every account currently has the same access. When paid plans open, you'll be able to move between them from your account and switch between monthly and yearly billing.",
  },
  {
    question: "Which integrations are supported?",
    answer:
      "Today everything is captured directly into RevoOS: links, notes, images, and files (PNG, JPEG, GIF, WebP, AVIF, PDF, plain text, Markdown, and JSON). There are no connected account integrations — Google Drive, Notion, and other services can't be linked, and nothing syncs automatically. Importing a file is a one-time copy into your library, not a live connection.",
  },
  {
    question: "What happens when I reach my limits?",
    answer:
      "The published allowances are 500 memories, 1 GB, 20 recall questions, and 10 summaries a month on Free; 5,000, 25 GB, 300, and 100 on Plus; and 20,000, 100 GB, 1,000, and 300 on Pro. Automated enforcement isn't switched on yet, so no account is currently blocked or charged for passing them. When enforcement is switched on, reaching a memory or storage limit stops new saves and uploads, and reaching the AI allowance pauses Ask until the monthly allowance resets. Your memories are never deleted to make room.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "There's no subscription to cancel — paid plans can't be purchased, and nothing has been charged. Cancellation controls will be available in your account when billing opens.",
  },
  {
    question: "Are my memories private?",
    answer:
      "Yes. Your memories and uploaded files are stored in a private Supabase project scoped to your account and protected by row-level security, so only you can read them. Files live in a private storage bucket and are served through short-lived signed URLs. When you ask a question, only the memories relevant to that question are sent to the AI provider, and you can delete your account and its data from Settings at any time.",
  },
];
