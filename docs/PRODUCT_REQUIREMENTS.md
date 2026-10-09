# Product Requirements

## Vision

**Your digital life, with a memory.**

Revo OS is an AI memory layer. It quietly captures what you read, watch,
screenshot, and save, connects it, and answers questions about it in plain
language — with sources you can open. No folders. No filing. Just memory.

## Problem

"Second brain" tools (Notion, Obsidian, Evernote) shift the work onto the
user: you must decide where things go, name them, tag them, and keep the
system tidy. Most people capture plenty and organize nothing, so their saved
content becomes an unsearchable pile. Meanwhile the useful questions people
actually ask ("what camera was I researching in April?", "where was that
ryokan?") require reasoning across many scattered items.

## Solution

Capture by pasting, screenshotting, linking, uploading, or typing a note.
Revo OS stores it, summarizes it, auto-groups it into collections, links it
into a relationship graph, and lets you ask questions that return a synthesized
answer plus the exact memories it used.

## Target user

The working prototypical user is an information-heavy individual (knowledge
worker, researcher, hobbyist with deep interests) who saves things constantly
across apps and browsers and wants them to be recallable without maintenance.

## The demo persona

The prototype ships pre-populated with one coherent persona so the app is
immediately alive. Their memories span:

- **Camera research** — Sony A7 IV, Nikon Z6 III, Fujifilm X-T5, budget and
  decision criteria.
- **Apartment search** — The Kestrel and other Summit listings, rent ceiling,
  pet-friendly for their dog **Mango**.
- **Japan trip** — two-week Oct 8–22 itinerary, Gora Kadan ryokan, JAL flight.
- **Gift ideas** — a watercolor workshop for **Jane**.
- **Life admin** — Mango's vet appointment, résumé v4, gym routine, reading
  list, espresso gear, TV watchlist.

These seed the search, collections, timeline, and graph so every surface has
real content on first load.

## Core capabilities

### 1. Capture (five methods)

Available on `/capture` and via the capture panels:

| Method | Component | Result |
| --- | --- | --- |
| Paste | `paste-panel.tsx` | Clipboard text becomes a memory. |
| Note | `note-panel.tsx` | Free-form note. |
| Link / browser | `link-panel.tsx`, `browser-panel.tsx` | URL captured with inferred title/domain/excerpt (`capture-sites.ts`). |
| Upload | `upload-panel.tsx` | File captured (name/preview). |
| Drag & drop | `capture-drop-zone.tsx` | Wraps the capture surface. |

Each capture is summarized on save via `summarize.ts`
(summary, description, key points) and filed under "New captures" by default.

### 2. Understand

- **Collections** — memories grouped by topic; renameable, creatable,
  deletable; per-collection emoji/description/color.
- **Timeline** — chronological browse of everything.
- **Memory graph** — a force/layout graph of memory and entity nodes with
  typed relationships (`part-of`, `mentions`, `related`, `similar`, `follows`,
  `source-of`, `discovered`), with an inspector to explore connections.
- **Search** — keyword ranking (`ai.ts`) with recent-first tie-breaks.

### 3. Ask

- Plain-language question → top matching memories become `sources` → sent to
  `/api/ask` → grounded answer with citations, or a canned fallback
  (`generateAnswer`) when OpenAI is unavailable.
- Answer card renders bolded key facts and links to the source memories.

### 4. Memory detail & editing

`/memory/[id]` shows the full record with generated summary/description/key
points, related memories, and an edit dialog (`memory-edit-dialog.tsx`) for
title, content, tags, collection, and favorite.

### 5. Dashboard

`/dashboard` presents metrics, a capture heatmap, type breakdown, activity
graph, quick actions, filter chips, and a selectable feed with list/grid/
compact view modes.

### 6. Settings

`/settings` covers preferences and data controls: storage usage against the
~5 MB cap, localStorage reset, and theme/appearance.

## Growth & feedback surfaces

- **Waitlist** — landing-page form (`waitlist-form.tsx`) with live count
  (`waitlist-count.tsx` reads `/api/counts`), backed by Supabase. Duplicate
  emails are idempotent.
- **Feedback** — floating `feedback-button.tsx` dialog on every screen, posts
  to `/api/feedback`.
- **Command palette** — ⌘K (`command-palette.tsx`) for navigation and actions.

## Landing page sections

In order: hero (CTAs, trust chips), demo stat strip, **Capture** (six sources),
**How it works** (capture → understand → ask + connection diagram),
**Product** showcase (timeline, collections, graph, search),
**Use cases**, **Privacy**, **Waitlist** (form + perks), final CTA, footer.

## Compliance & privacy requirements

- Clear, honest privacy and terms pages (`/privacy`, `/terms`) with a
  copyright notice.
- Consent-gated analytics (no PostHog load before opt-in) and a cookie banner
  with an easy way to change the choice.
- A self-service data export/delete form at `/privacy/request`.
- The privacy messaging must accurately reflect behavior: captures stay in the
  browser; AI answers send the relevant memories to the AI provider.

## Success metrics

- Waitlist signups (count via `/api/counts`) and feedback volume/quality.
- Query satisfaction: fraction of `/search` questions answered without
  falling back to the canned responses.
- Activation: a new visitor performs at least one capture and one ask.
- Engagement via consent-granted analytics (pageviews, `ai_question_asked`,
  `waitlist_joined`, `feedback_submitted`).

## Non-goals (for the prototype)

- User accounts, login, or cross-device sync.
- Server-side storage of memories.
- Multi-user sharing or collaboration.
- True semantic/vector retrieval (search is keyword-based; the LLM synthesizes
  but does not embed).
- Monetization or billing.

## Roadmap themes

1. **Real capture pipeline** — browser extension and share sheet that save
   full article text/images, plus screenshot OCR.
2. **Semantic retrieval** — embeddings + reranking so "ask" works over the
   whole corpus, not just keyword matches.
3. **Sync & accounts** — optionally sync memories across devices with
   end-to-end encryption.
4. **Agentic actions** — reminders, follow-ups, and proactive resurfacing
   (e.g. "your Ryokan booking window opens today").
5. **Hardening** — stronger CSP, authenticated data-rights requests, bot
   management on public APIs.
