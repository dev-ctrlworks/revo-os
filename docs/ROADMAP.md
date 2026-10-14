# Revo OS — Roadmap

**Your digital life, with a memory.**

This is the product + business roadmap for Revo OS. It builds on
[`PRODUCT_REQUIREMENTS.md`](./PRODUCT_REQUIREMENTS.md) (what the product is and
why) and [`ARCHITECTURE.md`](./ARCHITECTURE.md) (how it is built). It is a
living plan — horizons are relative to **October 2026**.

## North star

> Weekly active people who **both capture and ask**.

Capture → recall is the product loop. A person doing only one side is not yet
retained, so this metric — not signups, not pageviews — is the one to optimize.

Supporting metrics: waitlist signups (`/api/counts`), query satisfaction
(fraction of `/search` questions answered without the canned fallback),
activation (a new visitor performs ≥1 capture and ≥1 ask), and consent-granted
engagement events (`ai_question_asked`, `waitlist_joined`,
`feedback_submitted`).

## Principles

- **Local-first by default.** Memories live in the user's browser; the server
  stays small and stateless.
- **Zero maintenance.** No folders, naming, or filing required to get value.
- **Honesty.** Every claim is labeled live vs planned. No fabricated
  integrations, stats, or partnerships.
- **Grounded answers.** Answers cite the exact memories they used.

## Current state (as of Oct 2026)

**Real today**

- Marketing site + full local-first app: capture (paste / note / link / upload /
  drag & drop), collections, timeline, memory graph, dashboard, search + ask,
  settings, waitlist, feedback, legal pages.
- Keyword retrieval (`src/lib/ai.ts`) + LLM synthesis (`/api/ask`).
- `localStorage` store (`src/lib/memory-store.ts`), ~5 MB cap.
- Supabase-backed waitlist / feedback / counts.

**Not real yet**

- Real AI answers — the OpenAI key has **no credits**, so `/api/ask` returns
  the canned fallback (`generateAnswer`). Adding credits flips this on with no
  code change.
- Semantic/vector retrieval (search is keyword-only).
- Real capture pipeline (browser extension, share sheet, screenshot OCR).
- Accounts, sync, billing.

**Immediate blockers** (Phase 0): OpenAI credits · Supabase `waitlist.interest`
column · `hello@revoos.app` mailbox.

---

## Phase 0 — Launch readiness · Now → +2 weeks

**Goal:** everything the site claims is true, and every public flow works.

**Workstreams**

- **Ops blockers:** add OpenAI credits (real answers); apply
  `alter table waitlist add column if not exists interest text;`; provision
  `hello@revoos.app` via Cloudflare Email Routing; verify Google Search Console
  + submit sitemap; submit the IndexNow ping; add the Cloudflare Web Analytics
  token; add Google-eligible favicon sizes.
- **Reliability:** error logging/alerting (Cloudflare or Sentry); uptime check
  on `/` and `/api/ask`; commit `supabase/migrations/` to the repo and harden
  the waitlist route so a missing column can never 500.
- **Quality:** mobile, `prefers-reduced-motion`, and keyboard/a11y pass;
  Lighthouse pass; refresh the stale pitches in `docs/launch.md`; capture
  screenshots for posts.

**Exit criteria:** `/api/ask` returns real answers; waitlist submit-with-interest
works; mail arrives at `hello@revoos.app`; site indexed; funnel events firing.

## Phase 1 — Make the promise real · +2 weeks → +2 months

**Goal:** "ask" works over *any* saved content, and capture is effortless.

**Workstreams**

- **Semantic retrieval:** embeddings + `pgvector` (or client-side embed +
  rerank), chunking, hybrid keyword + vector search, reranking. Stop requiring
  the client to pre-select sources. *(Replaces keyword-only `searchMemories`.)*
- **Real capture pipeline:** browser extension (full page / selection /
  read-later), PWA share target, mobile share sheet, screenshot + OCR, optional
  clipboard watcher.
- **Understanding:** LLM-assisted summarize + auto-collections + duplicate
  detection (upgrade `summarize.ts`, `ai-collections.ts`).
- **Ask UX:** streaming answers, follow-up questions, confidence, and
  "explain these sources".

**Exit criteria:** ask works with no manual source selection; the extension
saves real pages; OCR passes on screenshots; p95 ask latency < 3s.

## Phase 2 — Accounts & sync · +2 → +4 months

**Goal:** your memory follows you across devices, privately.

**Workstreams**

- Optional auth (magic link / passkeys) that *upgrades* the local-first default
  rather than replacing it.
- **E2E-encrypted sync**, conflict resolution (CRDT, or last-write-wins +
  tombstones), background sync.
- **Import/export:** browser bookmarks, Pocket/Readwise, Notion; full data
  export; authenticated data-rights requests.
- Update privacy messaging and `SECURITY.md` for the new data flows.

**Exit criteria:** sign in on two devices and sync E2E; at least one real
importer ships; privacy/terms reflect sync.

## Phase 3 — Proactive memory (agentic) · +4 → +7 months

**Goal:** Revo OS surfaces things before you ask.

**Workstreams**

- Reminders / follow-ups (e.g. "your ryokan booking window opens today").
- Proactive resurfacing ("you saved three things about X — recap?").
- Grounded actions: compare, plan, draft — all cited to memories.
- Daily/weekly email digest.
- Multi-modal: voice memos, richer image understanding.

**Exit criteria:** a measurable share of sessions opened from a nudge; digest
retention holds week over week.

## Phase 4 — Platform & business · +6 → +12 months

**Goal:** a sustainable product and an ecosystem.

**Workstreams**

- **Billing** (Stripe): free tier + paid (sync, storage, volume, agentic).
- **Platform:** public API, shareable memories, an **MCP server** so Revo OS can
  act as the memory layer for other AI tools, and an integrations path.
- Enterprise/privacy tier; SLOs and LLM cost controls.

**Exit criteria:** first paying users and MRR; external API/MCP usage.

---

## Cross-cutting tracks

- **Security, privacy & compliance:** CSP hardening, bot management on public
  APIs, DPAs, authenticated data-rights requests, eventual SOC 2 readiness.
- **Growth & GTM:** content/SEO, build-in-public, communities, Show HN; a
  waitlist → activation funnel; referrals.
- **Design & brand:** extend the design system and motion language; WCAG AA
  accessibility; internationalization later. See `DESIGN_SYSTEM.md`, `BRAND.md`.
- **Ops & infra:** CI (GitHub Actions), preview deploys, in-repo DB migrations,
  backups, observability.

## Decision gates

- **Before Phase 2:** is there retention (repeat capture + ask)? Sync is
  expensive — don't build it on a leaky funnel.
- **Before Phase 4:** validated willingness to pay.

## Risks

- **Cost:** LLM and embedding spend at scale — mitigate with tiering, caching,
  and cheap default models.
- **Local-first ⇄ sync tension:** E2E encryption complicates search and support.
- **Privacy perception:** a "memory of everything" reads as surveillance —
  local-first + honesty are the answer.
- **Incumbents:** Apple / Google / Microsoft Recall ship memory features.

## Dependency chain

Phase 0 → real answers (Phase 1 retrieval) → extension/OCR (Phase 1) →
accounts/sync (Phase 2) → proactive (Phase 3) → billing/platform (Phase 4).
