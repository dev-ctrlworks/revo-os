import { collections } from "./mock-data";
import { getAllMemories } from "./memory-store";
import type { AIAnswer, Memory } from "./types";

export interface SearchOptions {
  query: string;
  limit?: number;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function scoreMemory(memory: Memory, tokens: string[]): number {
  if (!tokens.length) return 0;
  const searchable = [
    memory.title,
    memory.content,
    memory.domain ?? "",
    ...memory.tags,
    memory.collection,
    memory.source,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (searchable.includes(token)) score += 4;
    if (memory.title.toLowerCase().includes(token)) score += 3;
    if (memory.tags.some((tag) => tag.includes(token))) score += 2;
    if (memory.collection.toLowerCase().includes(token)) score += 1;
  }
  return score;
}

export function searchMemories({ query, limit = 7 }: SearchOptions): Memory[] {
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  return getAllMemories()
    .map((memory) => ({ memory, score: scoreMemory(memory, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || +new Date(b.memory.createdAt) - +new Date(a.memory.createdAt))
    .slice(0, limit)
    .map((item) => item.memory);
}

export function getMemoryById(id: string): Memory | undefined {
  return getAllMemories().find((memory) => memory.id === id);
}

export function getRelatedMemories(memory: Memory, limit = 3): Memory[] {
  const pool = getAllMemories();
  const shared = pool
    .filter((m) => m.id !== memory.id)
    .map((m) => {
      const overlap = m.tags.filter((tag) => memory.tags.includes(tag)).length;
      const sameCollection = m.collection === memory.collection ? 1 : 0;
      return { memory: m, score: overlap * 2 + sameCollection };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.memory);

  if (shared.length) return shared;
  return pool.filter((m) => m.id !== memory.id).slice(0, limit);
}

export function generateAnswer(query: string, sources: Memory[]): string {
  const matchedCollections = new Set(sources.map((s) => s.collection));
  const collectionList = Array.from(matchedCollections).slice(0, 2).join(" and ");

  const researchQuery = /research|working on|been up to|focusing on|recently/i.test(query);
  const cameraQuery = /camera|lens|sony|fujifilm|nikon|body|gear/i.test(query);
  const apartmentQuery = /apartment|rent|housing|lease|place|home/i.test(query);
  const japanQuery = /japan|tokyo|kyoto|osaka|ryokan|trip|itinerary|flight/i.test(query);
  const giftQuery = /gift|jane|birthday|present/i.test(query);
  const mangoQuery = /mango|dog|vet|puppy/i.test(query);
  const watchlistQuery = /watch|tv|stream|series|movie/i.test(query);
  const resumeQuery = /resume|cv|career|job/i.test(query);
  const readingQuery = /book|read|reading/i.test(query);
  const coffeeQuery = /coffee|espresso|brew/i.test(query);
  const fitnessQuery = /gym|workout|fitness|running|health/i.test(query);

  if (researchQuery) {
    return `You've been researching **three threads** this quarter. Cameras: you're down to the **Sony A7 IV**, **Nikon Z6 III**, and **Fujifilm X-T5** — all inside your **$2,800 budget**, with the A7 IV ahead on full-frame 4K60 + IBIS. Apartment: **The Kestrel** leads your Summit shortlist against a **$2,600** rent ceiling and pet-friendly requirement. Japan: the **Oct 8–22 trip** is locked with a $680 JAL flight flagged, and Gora Kadan ryokan opens bookings soon. Your weekly reviews keep all three moving.`;
  }

  if (cameraQuery) {
    return `You've been comparing **${sources.length} cameras** recently. Your shortlist from your decision criteria notes is: the **Sony A7 IV** (33MP full-frame, 4K60p, ~$2,499 new or ~$2,000 used per your eBay check), the **Nikon Z6 III** (partially stacked 24.5MP, 6K60p RAW, $2,499), and the **Fujifilm X-T5** (40MP, great stills but weaker video, $1,699). You're also looking at Tamron f/2.8 lenses for Sony E — the 24-70mm G2 or 35mm f/1.4 SP. Your budget cap is **$2,800** and you want 4K60, strong autofocus, IBIS, and weather sealing.`;
  }

  if (apartmentQuery) {
    return `You have **${sources.length} saved listings** in Summit. Top contenders: **The Kestrel** (1BR from $2,150, new building, pool + gym + coworking lounge, 12 min to Caltrain, 1-month-free move-in special) and **Yardley Court** (2BR/1BA pre-war, $2,450, includes heat/water, hardwoods, quiet street — but it's a walk-up with a broker fee). Summit Station lofts are gorgeous but pricier ($2,600+) with a waitlist. Your criteria: commute ≤30 min, rent ≤$2,600, in-unit or building laundry, pet-friendly for **Mango**, and big windows for your WFH setup. You've also drafted a lease draft for The Kestrel — unit 4C, June 1 move-in.`;
  }

  if (japanQuery) {
    return `Your **14-day Japan trip** is Oct 8–22: Tokyo (3 days) → Hakone ryokan at **Gora Kadan** (2 days, private in-room onsen, ~$480/night, book when the 6-month window opens) → Kyoto (4 days, including a sunrise Fushimi Inari hike) → Osaka (2 days + Nara day trip) → back to Tokyo for shopping. There's a **$680 nonstop SFO→NRT flight on JAL** saved that you flagged to book within 48h. Tom & Priya join for the Kyoto leg (Oct 11–14), Alex may join Tokyo. A 14-day JR pass saves roughly ¥9,000 — worth it if you add Kiso Valley.`;
  }

  if (giftQuery) {
    return `Your best Jane idea so far: a **Saturday watercolor workshop** at Summit Community Center ($35, supplies included) plus a new brush set — total ~$85, well under your $150 budget. Backup plan: a trail-running shoe gift card for her hiking habit, or a sourdough-related book since her starter *Steven* is thriving. Nothing beats the workshop — it matches her photography/hiking interests and is a shared experience.`;
  }

  if (mangoQuery) {
    return `Mango's **annual vet checkup is April 24 at 10:30am** (VCA Animal Hospital) — includes DAPP + rabies vaccines, fecal, and a standard exam. He's the best boy: you took him to Pinecrest Park this week (first time meeting Duke the German shepherd pup, chased a leaf for 10 minutes, 10/10). For the Kestrel move, the pet fee is **$500 + $25/mo**. Remember the grooming reminder before beach season.`;
  }

  if (watchlistQuery) {
    return `Priority watch is **Severance S2** (Apple TV) — you wanted to start it tonight with dinner. Then: **The Bear S4** (Hulu), **Dune: Prophecy** (Max), and **Slow Horses S5** (Apple TV+). Also noted: a Studio Ghibli 4K set on sale at Barnes & Noble that you were tempted by.`;
  }

  if (resumeQuery) {
    return `Your résumé is at **v4** — reframed around systems thinking and AI workflows. Key numbers: **reduced onboarding churn 18%**, **NPS +11** after the settings redesign, design system shipped across **4 products** at Nimbus, and 2 juniors mentored. It's trimmed to 1 page. This also ties into your conference idea: a 'Designing for Memory Systems' talk for UX Design Summit 2026 (CFP extended to May 15).`;
  }

  if (readingQuery) {
    return `Currently reading **'The Creative Act'** by Rick Rubin (the 'make space, not time' idea is on repeat) and **'Four Thousand Weeks'**. **'Project Hail Mary'** is your next audiobook for the commute, and **'The Man in the High Castle'** is queued after that.`;
  }

  if (coffeeQuery) {
    return `Your espresso math: the **Breville Bambino Plus ($499)** plus a **Niche Zero grinder (~$800)** beats most machines under $1,500 — unless you go prosumer with the **Rancilio Silvia Pro X ($2,080)** or Profitec Go ($1,250+). Since you drink mostly milk drinks, the Bambino's steam wand is worth real points.`;
  }

  if (fitnessQuery) {
    return `Your PPL split is Mon/Tue push-pull, Thu legs, Sat push + core. Range: 8–12 reps, 0–2 RIR, add 2.5lb weekly on compounds until you need a deload. You also planned 30-min runs Tue/Thu/Sat in your March 16 weekly review (which you did the same week as a shipped settings redesign — solid week).`;
  }

  if (sources.length === 0) {
    return `I couldn't find anything in your memories matching **"${query}"**. Try rephrasing, or check the Timeline tab to browse everything you've captured.`;
  }

  const top = sources
    .slice(0, 3)
    .map((s) => `**${s.title}**`)
    .join(", ");

  return `I found **${sources.length} memories** across ${collectionList || "your library"} related to that. The most relevant ones are: ${top}. Open any of the highlighted sources below for the full detail, or ask me to go deeper on one of them — for example I can summarize, compare, or find related memories across your collections.`;
}

export function getCollectionById(id: string) {
  return collections.find((collection) => collection.id === id);
}

export function getMemoryCount() {
  return getAllMemories().length;
}

export function getFavorites() {
  return getAllMemories().filter((memory) => memory.favorite);
}

export function getRecentMemories(limit = 6) {
  return getAllMemories()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

export function getCommuteFeed() {
  return getAllMemories().sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export function groupMemoriesByDate(all: Memory[]) {
  const sorted = [...all].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
  const groups = new Map<string, Memory[]>();
  for (const memory of sorted) {
    const key = new Date(memory.createdAt).toDateString();
    const existing = groups.get(key) ?? [];
    existing.push(memory);
    groups.set(key, existing);
  }
  return Array.from(groups.entries()).map(([dateKey, mems]) => ({
    date: dateKey,
    memories: mems,
  }));
}

export function makeFakeAIAnswer(query: string): AIAnswer {
  let sources = searchMemories({ query });
  if (sources.length === 0 && researchQueryRegex.test(query)) {
    sources = [...getAllMemories()]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 4);
  }
  const answer = generateAnswer(query, sources);
  return {
    id: crypto.randomUUID(),
    query,
    answer,
    sources,
    createdAt: new Date().toISOString(),
  };
}

const researchQueryRegex = /research|working on|been up to|focusing on|recently/i;