# RevoOS — Product architecture

Companion to `docs/redesign-audit.md`. Describes the target information
architecture, routes, shared components, domain model, and data flow for the
redesign.

## 1. Product principles

1. Capture without friction.
2. Preserve context (why it was saved).
3. Visual discovery.
4. Grounded AI (real citations, no fabrication).
5. Connected knowledge.
6. User control (AI never silently reorganizes).
7. Honest functionality.

## 2. Information architecture

| Destination | Route | Notes |
| --- | --- | --- |
| Home | `/dashboard` | AI search above a recent-memory grid + collections |
| Library | `/library` | All memories; grid/list, search, filters, sort, multi-select |
| Collections | `/collections`, `/collections/[slug]` | Manual + AI-suggested groups (approved by the user) |
| Connections | `/connections` | Relationship list + graph over the same model |
| Timeline | `/timeline` | Chronological, grouped by day/week/month |
| Quick Capture | global + `/capture` | Header button, command palette, mobile center action |
| Settings | `/settings` | Functional controls only; planned items labeled |

- Desktop: persistent sidebar (224–240px) with a collapsible compact mode.
- Mobile: compact header + bottom navigation; secondary destinations in a sheet.
- Global command palette on `Cmd/Ctrl+K`; `Esc` closes the top overlay and
  restores focus.
- `/ask` remains as a secondary recall view (question history); Home surfaces AI
  search primary.
- `/graph` 301-redirects to `/connections`.

## 3. Design system

Tokens defined once in `src/app/globals.css` as semantic CSS variables and mapped
through Tailwind v4 `@theme inline`. Light theme only (no dark-mode feature).

| Token | Value |
| --- | --- |
| background | `#F8F8FB` |
| surface / card | `#FFFFFF` |
| secondary surface | `#F1F0F7` |
| foreground | `#242333` |
| muted foreground | `#777487` |
| primary | `#6D55D9` |
| border | `#E7E5EF` |
| success | `#16845B` |
| destructive | `#C43D4B` |

- Type: Inter (body/UI), Space Grotesk (display).
- Spacing on a 4px scale (8/12/16/24/32).
- Radii: cards 12–16px, inputs 10–12px, dialogs 16px.
- Motion: small and purposeful only; respect `prefers-reduced-motion` and the
  in-app reduced-motion toggle.

## 4. Shared component system

| Responsibility | Component |
| --- | --- |
| App shell / sidebar | `layout/app-shell.tsx`, `layout/app-sidebar.tsx` |
| Mobile nav | `layout/mobile-tab-bar.tsx` |
| Command palette | `command/command-palette.tsx` |
| AI search input | `ai/ai-search-bar.tsx` |
| AI answer + citations | `ai/ai-answer.tsx` |
| Quick capture entry | `capture/quick-capture.tsx` (global) + `capture/*` panels |
| Memory card / grid / list | `memories/memory-card.tsx`, `memories/memory-grid.tsx` |
| Memory detail | `app/(app)/memory/[id]/page.tsx` + `memories/detail-*` |
| Collection card / editor | `app/(app)/collections/*` |
| Topic/entity chips | `memories/entity-chip.tsx` |
| Relationship list | `connections/relationship-list.tsx` |
| Knowledge graph | `graph/*` |
| Timeline feed | `app/(app)/timeline/page.tsx` |
| Empty / loading / error | `ui/empty-state.tsx`, `ui/skeleton.tsx`, `ui/toast.tsx` |

Domain logic, data access, and presentation stay separated: retrieval/AI in
`src/lib/*`, storage in `src/lib/memory-store.ts`, presentation in components.

## 5. Domain model (`src/lib/types.ts`, v2)

```ts
interface Memory {
  id: string;
  type: MemoryType;              // screenshot | image | note | document | link | paste
  title: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  originalRef?: string;          // url or data reference for the original
  extractedText?: string;        // extracted/readable content
  previewUrl?: string;
  processingStatus: "ready" | "pending" | "failed";
  metadata?: Record<string, unknown>;
  userContext?: string;          // user-authored "why I saved this"
  aiSummary?: { text: string; generatedAt: string; provider: string };
  collectionIds: string[];       // many-to-many membership
  tags: string[];
  favorite: boolean;
}

interface Collection { id; name; description?; cover?; source: "user" | "suggested"; createdAt; }

interface Entity { id; type: "project" | "person" | "place" | "topic" | "idea"; name; aliases: string[]; }

interface Relationship {
  id; fromId; toId;
  type: "related-topic" | "in-project" | "same-entity" | "supports" | "user";
  origin: "derived" | "user" | "ai";
  evidence?: string;
  reviewStatus?: "suggested" | "accepted" | "dismissed";
}

interface AIConversation { id; messages: AIMessage[]; }
interface AIMessage { id; role: "user" | "assistant"; text: string; citedMemoryIds: string[]; createdAt; degraded?: boolean; }
```

### Migration

A versioned, non-destructive `revoos.v1 → v2` migration in `memory-store.ts`:
map the legacy `collection: string` to `collectionIds: [collection]`, backfill
`updatedAt`/`processingStatus`, and preserve tombstones, edit patches, and
export/import compatibility.

## 6. Data flow

```
UI (pages/components)
  → src/lib/* (retrieval, ai, collections, summarize)   [no fetch in components]
  → src/lib/memory-store.ts  (localStorage repository, subscribed via useSyncExternalStore)
  → /api/ask | /api/waitlist | /api/feedback | /api/privacy   [server, keys server-side]
```

- Retrieval runs client-side over `getAllMemories()` (local-first).
- `Memory.collectionIds` is the source of truth for membership; derived data
  (topics/entities/relationships) is recomputed, never authoritative.
- Deletion removes the memory, its memberships, and any derived references.
- The AI provider is behind an interface; when unavailable, the app shows a
  clearly-labeled local keyword fallback (never a fabricated answer).

## 7. Responsive & accessibility

- Desktop: persistent sidebar, balanced grid, contextual panels.
- Tablet: collapsible sidebar, fewer columns, collapsible panels.
- Mobile: compact nav, one-column detail, full-width capture sheet, no hover-only
  actions.
- Semantic HTML, keyboard navigation, visible focus, labeled icon-only controls,
  sufficient contrast, reduced-motion support, no color-only meaning.

## 8. Implementation phases

1. Foundation — tokens, shell, navigation, responsive, shared components.
2. Core memory workflows — Library, detail, capture, collections, search, states.
3. Intelligence — retrieval/provider extraction, citations, related, entities.
4. Exploration — Timeline, Connections, graph.
5. QA — workflows, console/routes, responsive, a11y, API/error states, build.
