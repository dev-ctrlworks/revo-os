# Revo OS — launch kit

**Site:** https://revoos.app
**Sitemap:** https://revoos.app/sitemap.xml
**Feedback/waitlist:** live (Supabase), counts read from `/api/counts`.

---

## Pitch blurbs (copy-paste)

### X / Twitter
> Built a thing I've wanted for years: an AI memory layer for your digital life.
> Revo OS quietly captures screenshots, notes, links, docs — then answers questions in plain language. No folders. No filing. Just memory.
> Try it: revoos.app

### LinkedIn
> Most "second brain" tools make you file everything. Revo OS inverts it: you capture by pasting, screenshots, pages, or a quick note — and it does the memory-keeping.
> Ask "what camera was I researching in April?" and it answers with the sources it pulled from.
> Working prototype → https://revoos.app (waitlist open on the page).

### Threads / short form
> Your digital life, with a memory. That's Revo OS — capture anything, then ask it anything. revoos.app

### Hacker News (Show HN)
> Show HN: Revo OS — an AI memory layer for your digital life. Local-first prototype: capture via screenshot/paste/link/browser/note, auto-grouped collections, a memory graph, and grounded Q&A with sources. Waitlist + feedback live → revoos.app

---

## Screenshots (take before posting)
- Landing hero: capture, how-it-works, waitlist section.
- Dashboard ask flow: ask one question, show the AI summary + source cards.
- Memory Graph page (best visual wow).
- Capture page (show the 5 capture methods).

Crop to 1600px wide; X likes 16:9, LinkedIn 1200×627.

---

## Before-you-announce checklist
1. **AI answers:** the OpenAI key needs credits for `/api/ask` to answer for real (today it returns a canned fallback). Add credits → flips on automatically, no code change.
2. **Google Search Console:** verified? Submit a Domain property and request indexing of `/` (sitemap auto-crawled).
3. **Bing:** IndexNow key already live at `/IndexNow.txt` — ping after any big update (see below).
4. **Analytics:** Web Analytics beacon token → put it in `.env.production` as `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN`, then `npm run deploy:cf`.
5. **Deploy after changes:** `npm run deploy:cf` (strips secrets from the bundle; env comes from `wrangler secret put`).

---

## Indexing notes
- GSC: https://search.google.com/search-console — Domain property → verify via Cloudflare provider (zone is on Cloudflare).
- IndexNow key: `d512a71e8c9f5cc3622568457d769d10`
  - Ping: `https://api.indexnow.org/indexnow?url=https://revoos.app/&key=d512a71e8c9f5cc3622568457d769d10`
  - Key is public (ownership proof served from the site root) — don't reuse it as a secret.

## Deploy/ops cheatsheet
- Live domain: https://revoos.app (Cloudflare Worker `revoos`; custom domain via `wrangler.jsonc` routes).
- Runtime secrets are per-worker `wrangler secret put OPENAI_API_KEY|OPENAI_MODEL|SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY` (never baked into the bundle).
- Rebuild+deploy: `npm run deploy:cf` · local preview: `npm run preview:cf` (or `next dev` for :3000).