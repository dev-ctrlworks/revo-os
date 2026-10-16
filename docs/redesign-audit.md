# RevoOS — Redesign audit

Scope: the in-app prototype (`src/app/(app)/**`, `src/components/**`, storage and
API layers). The marketing landing page is out of scope for this redesign.

Stack: Next.js 16.3.8 (App Router, Turbopack), React 19, Tailwind CSS v4,
`@base-ui/react` + shadcn primitives, zustand, framer-motion, lucide-react.
Deployed to Cloudflare Workers via `@opennextjs/cloudflare`.

## 1. What currently works (retain)

- **Deployment & ops.** OpenNext build/deploy (`scripts/build-cf.sh`,
  `deploy-cf.sh`), CI (`.github/workflows/ci.yml`), uptime checks, Cloudflare Web
  Analytics, PostHog consent gating, `waitlist`/`feedback`/`privacy`/`counts` API
  routes with rate limiting and origin checks (`src/lib/security.ts`).
- **Local-first storage.** `src/lib/memory-store.ts` is a real persistence layer:
  captured memories + base demo data, edit patches, tombstones, collection meta
  overrides, storage-quota warnings, and JSON export/import. SSR-safe subscription
  hooks live in `src/lib/use-local-storage.ts` and `src/lib/use-memory-store.ts`.
- **Capture.** `src/components/capture/*` implements link, note, paste, upload,
  and (clipboard-derived) screenshot capture with a drop zone and result toasts.
  `src/lib/summarize.ts` and `src/lib/ai-collections.ts` provide honest,
  rule-based enrichment and grouping suggestions.
- **App chrome.** Command palette (`src/components/command/command-palette.tsx`),
  sidebar, mobile tab bar, toasts, dialogs, skeletons, and a broad `ui/*` kit.
- **Connections foundation.** `buildGraph(memories)` in
  `src/components/graph/memory-graph.tsx:47` derives memory + entity nodes from
  real data (not hard-coded), and the page reports real counts.
- **Honest labeling.** `settings/page.tsx` already disables unimplemented
  switches and labels them "Planned"/"Coming soon".

## 2. What needs redesign

- **Information architecture.** No **Library** page; "Home" (`/dashboard`) is a
  metrics-leaning view; the graph is a standalone page rather than integrated
  connections. Target IA: Home · Library · Collections · Connections · Timeline ·
  Quick Capture · Settings.
- **Visual language.** Heavy aurora gradients (`AuroraBackground`), glass
  (`bg-card/60 backdrop-blur-xl`), and decorative motion dominate the app chrome.
  Brief calls for calm, minimal, content-first surfaces.
- **Memory detail.** No split between original content, extracted text,
  user-authored context, and AI-generated interpretation; no context panel
  (type, date, collections, topics, entities, related).
- **Collections.** `Memory.collection: string` allows only one membership.
  Brief requires adding a memory to multiple collections without duplicating it.
- **Dashboard.** Card-in-card density and stat/heatmap blocks the brief
  discourages.

## 3. What is incomplete or broken

- **AI answers are degraded.** `/api/ask` returns `{"fallback":true}` (OpenAI key
  has no credits). The client already flags this via `AIAnswer.degraded`
  (`src/components/ai/ai-search-bar.tsx`); this must remain a clearly-labeled
  local keyword fallback, never a fabricated answer.
- **No domain model for connections.** Relationships and "entities" are derived
  ad hoc inside the graph component; there is no `Entity`/`Relationship` type,
  and no `updatedAt`, `processingStatus`, `userContext`, or AI-provenance fields
  on `Memory`.
- **Single-collection model** blocks multi-membership and clean "add to
  collection" flows.
- **No Library-level multi-select / bulk actions.**
- **No OCR, browser extension, sync, or accounts** — and none are claimed in the
  UI. These must stay labeled as planned.

## 4. What should be removed or reduced

- Decorative `AuroraBackground` and oversized gradients/glass in the app shell.
- Redundant dashboard metrics/heatmap blocks.
- Duplicate card nesting and pill-heavy chrome.
- Unused aesthetic keyframes/utilities where they are no longer referenced.

## 5. Architectural risks

- **`localStorage` schema change.** Moving from `collection: string` to
  `collectionIds: string[]` plus new fields requires a versioned, non-destructive
  migration (`revoos.v1 → v2`). Existing tombstones/edits/export must survive.
- **Route renames.** `/graph → /connections` needs a 301 and updates to the
  sidebar, command palette, sitemap, and any links. Adding `/library` touches nav
  in three places (sidebar, mobile bar, palette).
- **Scope.** This is a multi-phase redesign. Each phase must keep the app
  runnable and pass `lint` → `typecheck` → `build:cf`.
- **Honesty.** Every new surface must distinguish real vs suggested/planned, and
  never simulate persistence or integrations that do not exist.

## 6. Phased implementation plan

1. **Foundation** — audit + architecture docs; consolidate design tokens; rebuild
   the app shell (collapsible sidebar, mobile header + bottom nav, palette);
   responsive behavior; standardize shared components; trim decorative layers.
2. **Core memory workflows** — Library; memory detail with provenance + context
   panel; global Quick Capture; edit/delete; multi-collection membership; global
   search; empty/loading/error states.
3. **Intelligence** — move retrieval + provider logic out of components; keep
   grounded answers with real source citations; honest degraded fallback; related
   memories; topics/entities derived from actual content.
4. **Exploration** — Timeline rework; Connections page (relationship list first,
   graph on the same model); imports/integrations only where genuinely supported.
5. **Quality assurance** — workflows, console/route errors, responsive keyboards,
   accessibility, API/error states, and the full `lint`/`typecheck`/`build` suite.

See `docs/product-architecture.md` for the target routes, components, data model,
and data flow.
