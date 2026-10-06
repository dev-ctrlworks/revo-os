import type { Memory, MemoryType } from "./types";

export type EntityKind =
  | "person"
  | "place"
  | "product"
  | "project"
  | "trip"
  | "event"
  | "idea"
  | "topic";

export type NodeKind = "memory" | "entity";

export type RelationKind =
  | "part-of"
  | "mentions"
  | "related"
  | "similar"
  | "follows"
  | "source-of"
  | "discovered";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  label: string;
  color: string;
  cluster: string;
  hub?: boolean;
  entityKind?: EntityKind;
  emoji?: string;
  memoryType?: MemoryType;
  memoryId?: string;
  date?: string;
  collection?: string;
  tags?: string[];
  favorite?: boolean;
  degree: number;
  x: number;
  y: number;
  r: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: RelationKind;
  discovered: boolean;
  explanation: string;
  weight: number;
}

export interface GraphSelection {
  type: "node" | "edge";
  id: string;
}

export interface TopicDef {
  id: string;
  label: string;
  kind: EntityKind;
  emoji: string;
  color: string;
  collections: string[];
}

export interface GraphResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  topics: TopicDef[];
  width: number;
  height: number;
}

export const ENTITY_KIND_META: Record<
  EntityKind,
  { label: string; icon: string; tint: string; bg: string }
> = {
  person: { label: "Person", icon: "User", tint: "text-amber-500", bg: "bg-amber-500/10" },
  place: { label: "Place", icon: "MapPin", tint: "text-sky-500", bg: "bg-sky-500/10" },
  product: { label: "Product", icon: "Package", tint: "text-violet-500", bg: "bg-violet-500/10" },
  project: { label: "Project", icon: "FolderKanban", tint: "text-indigo-500", bg: "bg-indigo-500/10" },
  trip: { label: "Trip", icon: "Plane", tint: "text-rose-500", bg: "bg-rose-500/10" },
  event: { label: "Event", icon: "CalendarDays", tint: "text-emerald-500", bg: "bg-emerald-500/10" },
  idea: { label: "Idea", icon: "Lightbulb", tint: "text-yellow-500", bg: "bg-yellow-500/10" },
  topic: { label: "Topic", icon: "Hash", tint: "text-slate-500", bg: "bg-slate-500/10" },
};

export const RELATION_ORDER: RelationKind[] = [
  "part-of",
  "mentions",
  "related",
  "similar",
  "follows",
  "source-of",
  "discovered",
];

export const RELATION_META: Record<
  RelationKind,
  { label: string; color: string; dashed: boolean; width: number; description: string }
> = {
  "part-of": {
    label: "Part of",
    color: "#94a3b8",
    dashed: false,
    width: 1,
    description: "Belongs to a topic",
  },
  mentions: {
    label: "Mentions",
    color: "#14b8a6",
    dashed: false,
    width: 1,
    description: "Refers to a person, place, or thing",
  },
  related: {
    label: "Related",
    color: "#6366f1",
    dashed: false,
    width: 1.2,
    description: "Shares context inside a topic",
  },
  similar: {
    label: "Similar",
    color: "#8b5cf6",
    dashed: false,
    width: 1.2,
    description: "Looks like something in another topic",
  },
  follows: {
    label: "Follows",
    color: "#f59e0b",
    dashed: false,
    width: 1,
    description: "Comes after another memory in time",
  },
  "source-of": {
    label: "Source of",
    color: "#0ea5e9",
    dashed: false,
    width: 1.4,
    description: "Directly informs the connected memory",
  },
  discovered: {
    label: "RevoOS discovered",
    color: "#ec4899",
    dashed: true,
    width: 1.3,
    description: "An AI-inferred connection across topics",
  },
};

const TOPIC_PALETTE = [
  "#6366f1",
  "#0ea5e9",
  "#f43f5e",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#84cc16",
  "#14b8a6",
  "#ec4899",
  "#64748b",
  "#06b6d4",
  "#a855f7",
  "#22c55e",
];

const BASE_TOPICS: TopicDef[] = [
  { id: "camera", label: "Camera upgrade", kind: "project", emoji: "📷", color: "#f59e0b", collections: ["Camera research"] },
  { id: "apartment", label: "Apartment hunt", kind: "project", emoji: "🏠", color: "#0ea5e9", collections: ["Apartment search"] },
  { id: "japan", label: "Japan 2026", kind: "trip", emoji: "🗾", color: "#f43f5e", collections: ["Japan trip"] },
  { id: "career", label: "Career & speaking", kind: "project", emoji: "💼", color: "#8b5cf6", collections: ["Career"] },
  { id: "ideas", label: "Ideas & gifts", kind: "idea", emoji: "💡", color: "#10b981", collections: ["Ideas"] },
  { id: "home", label: "Home & kitchen", kind: "topic", emoji: "🍳", color: "#eab308", collections: ["Kitchen", "Home ideas"] },
  { id: "mango", label: "Mango", kind: "topic", emoji: "🐕", color: "#84cc16", collections: ["Mango"] },
  { id: "outdoors", label: "Outdoors & hiking", kind: "topic", emoji: "🥾", color: "#22c55e", collections: ["Hiking"] },
  { id: "health", label: "Health & fitness", kind: "topic", emoji: "💪", color: "#ef4444", collections: ["Health"] },
  { id: "reading", label: "Reading & creativity", kind: "topic", emoji: "📚", color: "#14b8a6", collections: ["Reading"] },
  { id: "entertainment", label: "Entertainment", kind: "topic", emoji: "🎬", color: "#d946ef", collections: ["Entertainment"] },
  { id: "tech", label: "Tech & phone", kind: "product", emoji: "📱", color: "#06b6d4", collections: ["Tech stack"] },
  { id: "journal", label: "Journal", kind: "topic", emoji: "📔", color: "#64748b", collections: ["Journal"] },
];

interface EntityDef {
  id: string;
  label: string;
  kind: EntityKind;
  topic: string;
  keywords: string[];
}

const ENTITY_DEFS: EntityDef[] = [
  { id: "jane", label: "Jane", kind: "person", topic: "ideas", keywords: ["jane"] },
  { id: "mom", label: "Mom", kind: "person", topic: "apartment", keywords: ["mom"] },
  { id: "tom", label: "Tom", kind: "person", topic: "japan", keywords: ["tom"] },
  { id: "priya", label: "Priya", kind: "person", topic: "japan", keywords: ["priya"] },
  { id: "alex", label: "Alex", kind: "person", topic: "japan", keywords: ["alex"] },
  { id: "duke", label: "Duke", kind: "person", topic: "mango", keywords: ["duke"] },

  { id: "tokyo", label: "Tokyo", kind: "place", topic: "japan", keywords: ["tokyo"] },
  { id: "kyoto", label: "Kyoto", kind: "place", topic: "japan", keywords: ["kyoto"] },
  { id: "osaka", label: "Osaka", kind: "place", topic: "japan", keywords: ["osaka"] },
  { id: "hakone", label: "Hakone", kind: "place", topic: "japan", keywords: ["hakone"] },
  { id: "nara", label: "Nara", kind: "place", topic: "japan", keywords: ["nara"] },
  { id: "pinecrest", label: "Pinecrest Park", kind: "place", topic: "apartment", keywords: ["pinecrest"] },
  { id: "mount-tam", label: "Mount Tam", kind: "place", topic: "outdoors", keywords: ["mount tam", "tamalpais"] },
  { id: "zurich", label: "Zurich", kind: "place", topic: "career", keywords: ["zurich", "switzerland"] },

  { id: "a7iv", label: "Sony A7 IV", kind: "product", topic: "camera", keywords: ["a7 iv", "a7iv"] },
  { id: "z6iii", label: "Nikon Z6 III", kind: "product", topic: "camera", keywords: ["z6 iii", "z6iii"] },
  { id: "xt5", label: "Fujifilm X-T5", kind: "product", topic: "camera", keywords: ["x-t5", "xt5"] },
  { id: "tamron-2470", label: "Tamron 24-70 G2", kind: "product", topic: "camera", keywords: ["24-70mm", "tamron 24"] },
  { id: "tamron-35", label: "Tamron 35mm f/1.4", kind: "product", topic: "camera", keywords: ["35mm f/1.4", "tamron 35"] },
  { id: "pixel9", label: "Pixel 9 Pro", kind: "product", topic: "tech", keywords: ["pixel 9"] },
  { id: "iphone16", label: "iPhone 16 Pro", kind: "product", topic: "tech", keywords: ["iphone 16"] },
  { id: "bambino", label: "Breville Bambino", kind: "product", topic: "home", keywords: ["bambino"] },
  { id: "niche-zero", label: "Niche Zero", kind: "product", topic: "home", keywords: ["niche zero"] },
  { id: "kestrel", label: "The Kestrel", kind: "product", topic: "apartment", keywords: ["kestrel"] },
  { id: "yardley", label: "Yardley Court", kind: "product", topic: "apartment", keywords: ["yardley"] },
  { id: "summit-station", label: "Summit Station lofts", kind: "product", topic: "apartment", keywords: ["summit station"] },
  { id: "gora-kadan", label: "Gora Kadan", kind: "product", topic: "japan", keywords: ["gora kadan"] },
  { id: "jr-pass", label: "JR Pass", kind: "product", topic: "japan", keywords: ["jr pass", "rail pass", "jr east"] },

  { id: "jane-birthday", label: "Jane's birthday", kind: "event", topic: "ideas", keywords: ["jane's birthday", "birthday"] },
  { id: "watercolor", label: "Watercolor workshop", kind: "event", topic: "ideas", keywords: ["watercolor"] },
  { id: "mango-vet", label: "Mango's vet visit", kind: "event", topic: "mango", keywords: ["vet appointment", "vca", "checkup"] },
  { id: "ux-summit", label: "UX Design Summit", kind: "event", topic: "career", keywords: ["design summit", "cfp"] },

  { id: "settings-redesign", label: "Settings redesign", kind: "project", topic: "career", keywords: ["settings redesign", "settings layout"] },
  { id: "contextual-note-app", label: "Contextual note app", kind: "idea", topic: "ideas", keywords: ["contextual note app", "memory, not notebook"] },
  { id: "revo-os", label: "Revo OS", kind: "project", topic: "ideas", keywords: ["revo os"] },
  { id: "memory-systems-talk", label: "Memory systems talk", kind: "project", topic: "career", keywords: ["designing for memory systems", "memory systems"] },
  { id: "sourdough", label: "Sourdough starter", kind: "idea", topic: "home", keywords: ["sourdough", "starter"] },
  { id: "creative-act", label: "The Creative Act", kind: "idea", topic: "reading", keywords: ["creative act"] },
  { id: "severance", label: "Severance S2", kind: "idea", topic: "entertainment", keywords: ["severance"] },
];

interface CuratedEdge {
  source: string;
  target: string;
  relation: RelationKind;
  explanation: string;
}

const CURATED_EDGES: CuratedEdge[] = [
  { source: "m23", target: "m8", relation: "discovered", explanation: "The Kestrel lease charges $500 + $25/mo for a pet — exactly the pet-friendly requirement you set for Mango in your apartment priorities." },
  { source: "m22", target: "m23", relation: "discovered", explanation: "Mango's vet visit and the lease pet clause are the two things you're lining up before the June 1 move." },
  { source: "m26", target: "m11", relation: "source-of", explanation: "The $680 JAL flight pins the exact Oct 8–22 dates in your draft itinerary." },
  { source: "m11", target: "m12", relation: "source-of", explanation: "The Hakone leg of your itinerary is what put the Gora Kadan ryokan on the shortlist." },
  { source: "m13", target: "m11", relation: "discovered", explanation: "The JR pass only pays off if you add the Kiso Valley stop to the itinerary — otherwise a regional pass is cheaper." },
  { source: "m16", target: "m33", relation: "discovered", explanation: "Your 'Designing for memory systems' talk reuses the systems-thinking positioning from résumé v4." },
  { source: "m28", target: "m16", relation: "discovered", explanation: "The settings redesign metrics (NPS +11, churn −18%) are the headline results on résumé v4." },
  { source: "m15", target: "m30", relation: "discovered", explanation: "Both are camera-quality calls — the Pixel 9 Pro comparison weighs the same low-light shots the Tamron lenses are for." },
  { source: "m1", target: "m30", relation: "discovered", explanation: "The A7 IV's IBIS is the reason the Tamron f/2.8 lenses can handhold at night." },
  { source: "m5", target: "m1", relation: "source-of", explanation: "The used-market check sets your ~$2,000 target against the A7 IV's $2,499 new price." },
  { source: "m19", target: "m35", relation: "source-of", explanation: "The Saturday watercolor workshop is the top pick from your Jane's-birthday brainstorm." },
  { source: "m34", target: "m22", relation: "discovered", explanation: "Mango's park day and the upcoming vet checkup are both from your 'everything about Mango' thread." },
  { source: "m20", target: "m18", relation: "discovered", explanation: "Sourdough crackers and the espresso guide both feed the same home-kitchen upgrade list." },
  { source: "m31", target: "m25", relation: "discovered", explanation: "'The Creative Act' and 'Four Thousand Weeks' inform the memory-not-notebook framing of your startup idea." },
  { source: "m27", target: "m26", relation: "discovered", explanation: "Tom, Priya, and Alex's Japan plans all hinge on the Oct 8 flight you flagged to book within 48h." },
  { source: "m17", target: "m9", relation: "discovered", explanation: "Your March 16 weekly review tracks the rental search that surfaced the Summit Station loft lead." },
  { source: "m32", target: "m17", relation: "discovered", explanation: "The PPL gym split lines up with the Tue/Thu/Sat runs you logged in the weekly review." },
  { source: "m25", target: "m33", relation: "discovered", explanation: "The contextual note app and the conference talk both explore memory as a system — one as product, one as talk." },
  { source: "m10", target: "m6", relation: "source-of", explanation: "Your mom's tip to ask what's included is why the Kestrel's 'heat & water covered' detail stands out." },
  { source: "m21", target: "m24", relation: "similar", explanation: "Both are Bay Area local intel — trailheads and a neighborhood guide for the same move." },
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function matchesKeyword(haystack: string, keyword: string): boolean {
  const key = keyword.toLowerCase();
  if (/\s|-|\//.test(key)) return haystack.includes(key);
  return new RegExp(`\\b${escapeRegex(key)}\\b`, "i").test(haystack);
}

function haystackOf(memory: Memory): string {
  return [memory.title, memory.content, memory.domain ?? "", memory.source, memory.collection, ...memory.tags]
    .join(" ")
    .toLowerCase();
}

function collectTopics(memories: Memory[]): TopicDef[] {
  const present = new Set(memories.map((memory) => memory.collection));
  const used = BASE_TOPICS.filter((topic) =>
    topic.collections.some((collection) => present.has(collection))
  );
  const claimed = new Set(used.flatMap((topic) => topic.collections));
  const extras = Array.from(present)
    .filter((collection) => !claimed.has(collection))
    .sort()
    .map<TopicDef>((collection, index) => ({
      id: `col-${slug(collection)}`,
      label: collection,
      kind: "topic",
      emoji: "•",
      color: TOPIC_PALETTE[(used.length + index) % TOPIC_PALETTE.length],
      collections: [collection],
    }));
  return [...used, ...extras];
}

function buildEdges(
  memoryNodes: GraphNode[],
  entityNodes: GraphNode[],
  entityMatches: Map<string, string[]>,
  topicHubId: (topicId: string) => string
): GraphEdge[] {
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

  const add = (edge: GraphEdge) => {
    if (!seen.has(edge.id)) {
      seen.add(edge.id);
      edges.push(edge);
    }
  };

  const hasPair = (a: string, b: string) => seen.has(`${a}->${b}:pair`);

  for (const node of memoryNodes) {
    add({
      id: `${node.id}->${topicHubId(node.cluster)}:part-of`,
      source: node.id,
      target: topicHubId(node.cluster),
      relation: "part-of",
      discovered: false,
      explanation: `${node.label} is filed under this topic.`,
      weight: 1,
    });
  }

  const memoryNodeById = new Map(memoryNodes.map((node) => [node.id, node]));

  for (const [source, targets] of entityMatches) {
    for (const target of targets) {
      add({
        id: `${source}->${target}:mentions`,
        source,
        target,
        relation: "mentions",
        discovered: false,
        explanation: `${memoryNodeById.get(source)?.label ?? "This memory"} mentions ${entityNodes.find((node) => node.id === target)?.label ?? "it"}.`,
        weight: 1,
      });
    }
  }

  for (const curated of CURATED_EDGES) {
    if (!memoryNodeById.has(curated.source) || !memoryNodeById.has(curated.target)) continue;
    add({
      id: `${curated.source}->${curated.target}:${curated.relation}`,
      source: curated.source,
      target: curated.target,
      relation: curated.relation,
      discovered: curated.relation === "discovered",
      explanation: curated.explanation,
      weight: curated.relation === "discovered" ? 2 : 1.6,
    });
    seen.add(`${pairKey(curated.source, curated.target)}:pair`);
  }

  const byTopic = new Map<string, GraphNode[]>();
  for (const node of memoryNodes) {
    const list = byTopic.get(node.cluster) ?? [];
    list.push(node);
    byTopic.set(node.cluster, list);
  }

  for (const nodes of byTopic.values()) {
    const sorted = [...nodes].sort((a, b) => +new Date(a.date ?? 0) - +new Date(b.date ?? 0));
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      if (hasPair(a.id, b.id)) continue;
      add({
        id: `${a.id}->${b.id}:follows`,
        source: a.id,
        target: b.id,
        relation: "follows",
        discovered: false,
        explanation: `${a.label} came before ${b.label} in this topic.`,
        weight: 0.8,
      });
    }
  }

  const relatedCount = new Map<string, number>();
  const canLink = (a: string, b: string, limit: number) =>
    (relatedCount.get(a) ?? 0) < limit && (relatedCount.get(b) ?? 0) < limit;
  const markLinked = (a: string, b: string) => {
    relatedCount.set(a, (relatedCount.get(a) ?? 0) + 1);
    relatedCount.set(b, (relatedCount.get(b) ?? 0) + 1);
  };

  for (let i = 0; i < memoryNodes.length; i++) {
    for (let j = i + 1; j < memoryNodes.length; j++) {
      const a = memoryNodes[i];
      const b = memoryNodes[j];
      if (a.cluster !== b.cluster) continue;
      const shared = (a.tags ?? []).filter((tag) => (b.tags ?? []).includes(tag));
      if (shared.length < 1) continue;
      if (hasPair(a.id, b.id)) continue;
      if (!canLink(a.id, b.id, 3)) continue;
      markLinked(a.id, b.id);
      add({
        id: `${a.id}->${b.id}:related`,
        source: a.id,
        target: b.id,
        relation: "related",
        discovered: false,
        explanation: `Both live in this topic and share ${shared.join(", ")}.`,
        weight: 1,
      });
    }
  }

  for (let i = 0; i < memoryNodes.length; i++) {
    for (let j = i + 1; j < memoryNodes.length; j++) {
      const a = memoryNodes[i];
      const b = memoryNodes[j];
      if (a.cluster === b.cluster) continue;
      const shared = (a.tags ?? []).filter((tag) => (b.tags ?? []).includes(tag));
      if (shared.length < 2) continue;
      if (hasPair(a.id, b.id)) continue;
      if (!canLink(a.id, b.id, 2)) continue;
      markLinked(a.id, b.id);
      add({
        id: `${a.id}->${b.id}:similar`,
        source: a.id,
        target: b.id,
        relation: "similar",
        discovered: false,
        explanation: `Both are tagged ${shared.join(", ")} across different topics.`,
        weight: 1,
      });
    }
  }

  return edges;
}

function layoutGraph(nodes: GraphNode[], topics: TopicDef[]): { width: number; height: number } {
  const home = new Map<string, { x: number; y: number }>();

  const satellites = new Map<string, GraphNode[]>();
  for (const node of nodes) {
    if (node.hub) continue;
    const list = satellites.get(node.cluster) ?? [];
    list.push(node);
    satellites.set(node.cluster, list);
  }

  const maxSpread = Math.max(
    120,
    ...topics.map((topic) => {
      const count = satellites.get(topic.id)?.length ?? 0;
      return 62 * Math.sqrt(count + 1);
    })
  );
  const hubRadius = maxSpread + 160;

  topics.forEach((topic, index) => {
    const angle = (index / topics.length) * Math.PI * 2 - Math.PI / 2;
    const hub = nodes.find((node) => node.id === `topic:${topic.id}`);
    if (!hub) return;
    hub.x = Math.cos(angle) * hubRadius * 1.35;
    hub.y = Math.sin(angle) * hubRadius * 0.92;
    home.set(hub.id, { x: hub.x, y: hub.y });

    const list = (satellites.get(topic.id) ?? []).sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "memory" ? -1 : 1;
      if (a.kind === "memory" && b.kind === "memory") {
        return +new Date(a.date ?? 0) - +new Date(b.date ?? 0);
      }
      return b.degree - a.degree || a.label.localeCompare(b.label);
    });

    const spread = 52 + Math.min(30, list.length * 2);
    list.forEach((node, index) => {
      const angleStep = index * 2.399963229728653;
      const radius = spread * Math.sqrt(index + (node.kind === "memory" ? 0.6 : 1.1));
      node.x = hub.x + Math.cos(angleStep) * radius;
      node.y = hub.y + Math.sin(angleStep) * radius;
      home.set(node.id, { x: node.x, y: node.y });
    });
  });

  const positions = new Map(nodes.map((node) => [node.id, { x: node.x, y: node.y }]));
  const labelPad = (node: GraphNode) => (node.hub || node.kind === "entity" ? 30 : 4);

  for (let iteration = 0; iteration < 90; iteration++) {
    for (const node of nodes) {
      if (node.hub) continue;
      const current = positions.get(node.id)!;
      let fx = 0;
      let fy = 0;
      for (const other of nodes) {
        if (other.id === node.id) continue;
        const otherPos = positions.get(other.id)!;
        const dx = current.x - otherPos.x;
        const dy = current.y - otherPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const minDistance = node.r + other.r + labelPad(node) + labelPad(other) * 0.5;
        if (distance < minDistance) {
          const push = ((minDistance - distance) / distance) * 0.4;
          fx += dx * push;
          fy += dy * push;
        }
      }
      const target = home.get(node.id);
      if (target) {
        fx += (target.x - current.x) * 0.03;
        fy += (target.y - current.y) * 0.03;
      }
      const magnitude = Math.sqrt(fx * fx + fy * fy);
      if (magnitude > 14) {
        fx = (fx / magnitude) * 14;
        fy = (fy / magnitude) * 14;
      }
      current.x += fx;
      current.y += fy;
    }
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    const position = positions.get(node.id)!;
    node.x = position.x;
    node.y = position.y;
    minX = Math.min(minX, node.x - node.r);
    minY = Math.min(minY, node.y - node.r);
    maxX = Math.max(maxX, node.x + node.r);
    maxY = Math.max(maxY, node.y + node.r);
  }

  const padding = 90;
  const offsetX = padding - minX;
  const offsetY = padding - minY;
  for (const node of nodes) {
    node.x += offsetX;
    node.y += offsetY;
  }

  return {
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

export function buildGraph(memories: Memory[]): GraphResult {
  const topics = collectTopics(memories);
  const topicByCollection = new Map<string, string>();
  for (const topic of topics) {
    for (const collection of topic.collections) topicByCollection.set(collection, topic.id);
  }
  const topicMap = new Map(topics.map((topic) => [topic.id, topic]));
  const topicHubId = (topicId: string) => `topic:${topicId}`;

  const nodes: GraphNode[] = [];
  const memoryNodes: GraphNode[] = [];

  for (const topic of topics) {
    nodes.push({
      id: topicHubId(topic.id),
      kind: "entity",
      label: topic.label,
      color: topic.color,
      cluster: topic.id,
      hub: true,
      entityKind: topic.kind,
      emoji: topic.emoji,
      tags: [],
      degree: 0,
      x: 0,
      y: 0,
      r: 0,
    });
  }

  for (const memory of memories) {
    const topicId = topicByCollection.get(memory.collection) ?? topics[0]?.id ?? "journal";
    const topic = topicMap.get(topicId);
    const node: GraphNode = {
      id: memory.id,
      kind: "memory",
      label: memory.title,
      color: topic?.color ?? TOPIC_PALETTE[0],
      cluster: topicId,
      memoryType: memory.type,
      memoryId: memory.id,
      date: memory.createdAt,
      collection: memory.collection,
      tags: memory.tags,
      favorite: memory.favorite,
      degree: 0,
      x: 0,
      y: 0,
      r: 7,
    };
    nodes.push(node);
    memoryNodes.push(node);
  }

  const haystacks = new Map(memories.map((memory) => [memory.id, haystackOf(memory)]));
  const entityMatches = new Map<string, string[]>();

  for (const def of ENTITY_DEFS) {
    const matched = memoryNodes.filter((node) => {
      const haystack = haystacks.get(node.id) ?? "";
      return def.keywords.some((keyword) => matchesKeyword(haystack, keyword));
    });
    if (!matched.length) continue;

    const cluster = topicMap.has(def.topic)
      ? def.topic
      : matched[0].cluster;
    const topic = topicMap.get(cluster);
    const node: GraphNode = {
      id: `entity:${def.id}`,
      kind: "entity",
      label: def.label,
      color: topic?.color ?? TOPIC_PALETTE[0],
      cluster,
      entityKind: def.kind,
      tags: [],
      degree: 0,
      x: 0,
      y: 0,
      r: 6.5 + Math.min(5.5, matched.length * 0.8),
    };
    nodes.push(node);
    entityMatches.set(node.id, matched.map((memoryNode) => memoryNode.id));
  }

  const edges = buildEdges(memoryNodes, nodes, entityMatches, topicHubId);

  const degree = new Map<string, number>();
  for (const edge of edges) {
    degree.set(edge.source, (degree.get(edge.source) ?? 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) ?? 0) + 1);
  }
  for (const node of nodes) {
    node.degree = degree.get(node.id) ?? 0;
    if (node.hub) node.r = 15 + Math.min(10, node.degree * 0.5);
    else if (node.kind === "memory") node.r = 7;
    else node.r = 6.5 + Math.min(5.5, node.degree * 0.35);
  }

  const { width, height } = layoutGraph(nodes, topics);

  return { nodes, edges, topics, width, height };
}

export interface GraphFilters {
  query: string;
  types: Set<MemoryType>;
  topic: string | null;
  range: "all" | "30d" | "90d" | "year";
  relations: Set<RelationKind>;
}

export function rangeCutoff(range: GraphFilters["range"]): number | null {
  if (range === "all") return null;
  const now = Date.now();
  if (range === "30d") return now - 30 * 24 * 60 * 60 * 1000;
  if (range === "90d") return now - 90 * 24 * 60 * 60 * 1000;
  return new Date(new Date().getFullYear(), 0, 1).getTime();
}

export interface GraphViewResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visibleIds: Set<string>;
  focusIds: Set<string>;
  nodeById: Map<string, GraphNode>;
  neighbors: Map<string, Set<string>>;
}

export function resolveGraphView(
  graph: GraphResult,
  filters: GraphFilters
): GraphViewResult {
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const adjacency = new Map<string, Set<string>>();
  const pairEdges = new Map<string, GraphEdge[]>();

  for (const edge of graph.edges) {
    if (!filters.relations.has(edge.relation)) continue;
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
    if (!adjacency.has(edge.target)) adjacency.set(edge.target, new Set());
    adjacency.get(edge.source)!.add(edge.target);
    adjacency.get(edge.target)!.add(edge.source);
    const key = edge.source < edge.target ? `${edge.source}|${edge.target}` : `${edge.target}|${edge.source}`;
    const list = pairEdges.get(key) ?? [];
    list.push(edge);
    pairEdges.set(key, list);
  }

  const cutoff = rangeCutoff(filters.range);
  const query = filters.query.trim().toLowerCase();

  const passesStructural = (node: GraphNode): boolean => {
    if (node.hub) return true;
    if (node.kind === "memory") {
      if (!filters.types.has(node.memoryType ?? "note")) return false;
      if (filters.topic && node.cluster !== filters.topic) return false;
      if (cutoff !== null && +new Date(node.date ?? 0) < cutoff) return false;
      return true;
    }
    if (filters.topic && node.cluster !== filters.topic) return false;
    return true;
  };

  const structurallyVisible = new Set(
    graph.nodes.filter(passesStructural).map((node) => node.id)
  );

  for (const node of graph.nodes) {
    if (node.hub || node.kind !== "entity") continue;
    const hasVisibleNeighbor = Array.from(adjacency.get(node.id) ?? []).some((id) =>
      structurallyVisible.has(id)
    );
    if (!hasVisibleNeighbor) structurallyVisible.delete(node.id);
  }

  const visibleIds = new Set(structurallyVisible);
  const focusIds = new Set<string>();

  if (query) {
    const matched = graph.nodes.filter((node) => {
      if (!visibleIds.has(node.id)) return false;
      const haystack = [node.label, node.collection ?? "", (node.tags ?? []).join(" ")]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
    for (const node of matched) {
      focusIds.add(node.id);
      for (const neighbor of adjacency.get(node.id) ?? []) {
        if (visibleIds.has(neighbor)) focusIds.add(neighbor);
      }
    }
  }

  const edges: GraphEdge[] = [];
  for (const [, list] of pairEdges) {
    for (const edge of list) {
      if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) continue;
      edges.push(edge);
    }
  }

  return {
    nodes: graph.nodes.filter((node) => visibleIds.has(node.id)),
    edges,
    visibleIds,
    focusIds,
    nodeById,
    neighbors: adjacency,
  };
}
