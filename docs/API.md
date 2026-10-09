# API

Revo OS exposes five route handlers. All are stateless, edge-compatible, and
originated from the same host. Shared validation and protection helpers are in
`src/lib/security.ts` (see `SECURITY.md`).

## Conventions

- **Format:** JSON in, JSON out (`Response.json`).
- **Origin check:** every `POST` calls `isAllowedOrigin(request)` first and
  returns `403` if a present `Origin` does not match the request `Host`.
- **Rate limiting:** `enforceRateLimit(request, namespace, { limit, windowMs })`
  keyed by client IP.
- **Body cap:** `readJsonBody` rejects bodies over the limit (default 16 KB;
  `ask` uses 64 KB).
- **Caching:** `/api/*` is sent `Cache-Control: no-store` by `next.config.ts`.
  `/api/counts` overrides with a public `s-maxage` cache.
- **Analytics:** `waitlist`, `feedback`, and `ask` emit a PostHog server event
  via `after()` when the request carries `x-posthog-distinct-id` (consent).

---

## `POST /api/ask`

Answer a question grounded in a small set of memory sources using OpenAI.

**Request**

```jsonc
{
  "query": "what camera was I researching in April?",   // required, <= 500 chars
  "sources": [                                           // optional, <= 6 entries
    {
      "title": "Sony A7 IV spec sheet",                 // <= 200 chars
      "content": "Full-frame 33MP ...",                  // <= 2000 chars sent, 600 to model
      "collection": "Camera research",                   // <= 80 chars
      "createdAt": "2026-03-18T14:22:00Z",               // <= 40 chars
      "source": "screenshot",                            // <= 300 chars
      "tags": ["camera", "gear"]                         // <= 12 tags, 40 chars each
    }
  ]
}
```

**Behavior**

1. Origin check, then rate limit (10 / 60 s).
2. Validate body, `query`, and sanitize each source to the fixed `AskSource`
   shape. Empty/malformed sources are dropped.
3. Fire `ai_question_asked` (with `source_count`) via `after()` if consented.
4. If `OPENAI_API_KEY` is unset, return the fallback immediately.
5. Otherwise call OpenAI Chat Completions (`OPENAI_MODEL` or `gpt-4o-mini`,
   `temperature: 0.3`, `max_tokens: 500`, 15 s timeout). The system prompt
   instructs the model to answer only from the sources, treat source content as
   data (never instructions), and format as 1–3 short bolded paragraphs.

**Responses**

| Status | Body | Meaning |
| --- | --- | --- |
| `200` | `{ "answer": "..." }` | Model answer. |
| `200` | `{ "fallback": true }` | No key, upstream error, timeout, or empty answer — client falls back to `generateAnswer()`. |
| `400` | `{ "fallback": true }` | Missing/invalid JSON body or empty query. |
| `403` | `{ "fallback": true }` | Cross-origin request. |
| `429` | `{ "fallback": true }` | Rate limited. |

> The client (not the server) selects which memories to send, so the full
> memory corpus is never transmitted.

---

## `POST /api/waitlist`

Add an email to the waitlist. Idempotent.

**Request**

```json
{ "email": "you@example.com" }
```

- Email is trimmed, capped at 320 chars, and regex-validated
  (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).

**Behavior**

- Origin check, rate limit (5 / 60 s), validate, then insert into `waitlist`.
- Postgres unique violation (`23505`) is treated as success.
- Emits `waitlist_joined` via `after()` if consented.

**Responses**

| Status | Body |
| --- | --- |
| `200` | `{ "ok": true }` |
| `400` | `{ "error": "Invalid JSON" \| "Please enter a valid email address." }` |
| `403` | `{ "error": "Forbidden" }` |
| `429` | `{ "error": "Too many requests" }` |
| `500` | `{ "error": "Something went wrong. Please try again." }` |

---

## `POST /api/feedback`

Submit in-app feedback.

**Request**

```json
{ "message": "Love the graph view", "email": "you@example.com", "page": "/graph" }
```

- `message` required, 1–2000 chars.
- `email` optional; if present, regex-validated and <= 320 chars.
- `page` optional, <= 200 chars (stored as `null` when empty).

**Behavior**

- Origin check, rate limit (5 / 60 s), validate, insert into `feedback`.
- Emits `feedback_submitted` (with `page`) via `after()` if consented.

**Responses**

| Status | Body |
| --- | --- |
| `200` | `{ "ok": true }` |
| `400` | `{ "error": "Invalid JSON" \| "Please write a message (max 2000 characters)." \| "Please enter a valid email address." }` |
| `403` | `{ "error": "Forbidden" }` |
| `429` | `{ "error": "Too many requests" }` |
| `500` | `{ "error": "Something went wrong. Please try again." }` |

---

## `GET /api/counts`

Live waitlist count.

**Behavior**

- Rate limit (60 / 60 s).
- Exact head count on `waitlist`.
- Successful responses set
  `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.
- Any error returns `{ "waitlist": 0 }` rather than failing.

**Responses**

| Status | Body |
| --- | --- |
| `200` | `{ "waitlist": 128 }` |
| `429` | `{ "waitlist": 0 }` |

---

## `POST /api/privacy`

Export or delete waitlist/feedback data for an email (GDPR-style self-service).

**Request**

```json
{ "email": "you@example.com", "action": "export" }
```

- `action` must be `"export"` or `"delete"`.
- Email trimmed, capped at 320 chars, regex-validated.

**Behavior**

- Origin check, rate limit (3 / 10 min).
- Matching is case-insensitive (`ilike` on `email`).
- `export` returns `waitlist` (`email`, `created_at`) and `feedback`
  (`message`, `page`, `created_at`).
- `delete` removes matching rows from both tables.

**Responses**

| Status | Body |
| --- | --- |
| `200` | `{ "ok": true, "email": "...", "waitlist": [...], "feedback": [...] }` (export) |
| `200` | `{ "ok": true }` (delete) |
| `400` | `{ "error": "Invalid JSON" \| "Please enter a valid email address." \| "Unsupported action." }` |
| `403` | `{ "error": "Forbidden" }` |
| `429` | `{ "error": "Too many requests" }` |
| `500` | `{ "error": "Something went wrong. Please try again." }` |

> This endpoint is unauthenticated. It returns data only for the exact email
> supplied, which is acceptable for low-sensitivity pilot data but is not a
> strong authorization boundary.

---

## Client-side analytics header

The client sends `x-posthog-distinct-id` on the above requests **only when
consent is `granted`**. `getPostHogDistinctId()` reads it; when absent,
`captureServerEvent` is a no-op. See `src/lib/posthog-server.ts`.

## Non-API routes

- `/ingest/*` — reverse-proxy rewrites to PostHog (US), not exported by the
  app. `/ingest/static/*` → `us-assets.i.posthog.com`; everything else →
  `us.i.posthog.com`.
- `/sitemap.xml` and `/robots.txt` — generated by `src/app/sitemap.ts` and
  `src/app/robots.ts`.
