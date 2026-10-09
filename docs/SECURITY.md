# Security

This document describes the security model, the controls currently in place,
and the known limitations of the Revo OS prototype.

## Threat model

Revo OS is a public, no-account prototype. The assets worth protecting are:

- **Runtime secrets** — the OpenAI key and the Supabase service-role key.
- **Supabase tables** — `waitlist` and `feedback` (spam, scraping, and data
  integrity are the concern; the data is low-sensitivity public submissions).
- **User privacy** — captured memories must stay in the browser.

The primary attackers are opportunistic: bots abusing the public API
(LLM cost, waitlist spam), cross-site request forgery, and reflected/stored XSS
in rendered memory content or links.

## Response headers and CSP

Defined in `next.config.ts` and applied to `/(.*)`:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | see below |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `X-DNS-Prefetch-Control` | `off` |

CSP directives:

```
default-src 'self';
base-uri 'self'; form-action 'self'; object-src 'none';
frame-ancestors 'none'; manifest-src 'self';
img-src 'self' data: blob: https:;
font-src 'self' data:;
style-src 'self' 'unsafe-inline';
script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://*.posthog.com;
connect-src 'self' https://cloudflareinsights.com https://*.posthog.com;
worker-src 'self' blob: data:;
upgrade-insecure-requests
```

- In dev, `script-src` adds `'unsafe-eval'` and `connect-src` adds `ws:`/`wss:`
  for the HMR client.
- `'unsafe-inline'` is required because the policy is static (no per-request
  nonce). This is a deliberate trade-off — see `ARCHITECTURE.md`.
- `/api/*` responses are sent with `Cache-Control: no-store`.

## API hardening

Shared helpers live in `src/lib/security.ts` and are applied by every route
handler.

### Rate limiting

`enforceRateLimit(request, namespace, { limit, windowMs })`:

- Uses the Cloudflare **Rate Limiting binding** (`RATE_LIMITER`, see
  `wrangler.jsonc`) for a distributed edge cap, when running on Workers.
- Falls back to a bounded in-memory limiter (max 10k tracked keys, pruned by
  window) for local `next start` or if the binding is unavailable.
- Keyed by `${namespace}:${clientIp}`.

Per-route limits:

| Route | Limit |
| --- | --- |
| `/api/ask` | 10 / 60 s |
| `/api/waitlist` | 5 / 60 s |
| `/api/feedback` | 5 / 60 s |
| `/api/counts` | 60 / 60 s |
| `/api/privacy` | 3 / 10 min |

### Client IP resolution

`getClientIp()` prefers `cf-connecting-ip`, then `x-real-ip`, then the first
`x-forwarded-for` entry. Trusting the Cloudflare header prevents spoofing the
limiter key.

### Origin / CSRF

`isAllowedOrigin()` rejects cross-site requests: when an `Origin` header is
present it must equal the request `Host`; `Origin: null` is rejected. Missing
`Origin` is allowed (same-origin fetches and non-browser clients). All `POST`
routes call this first and return `403` on failure.

### Body limits and validation

- `readJsonBody(request, maxBytes)` enforces a byte cap via `content-length`
  and the actual text length, then `JSON.parse`. Default cap 16 KB;
  `/api/ask` uses 64 KB.
- `asString(value, max)` trims and length-caps all string inputs.
- `/api/ask` sanitizes each source (`sanitizeSource`) to a fixed shape and
  truncates content to 600 chars, max 6 sources, query to 500 chars, tags to
  40 chars each (max 12).
- Email inputs are validated with a regex and a 320-char cap.
- Waitlist duplicates are tolerated: Postgres unique-violation code `23505` is
  treated as success.

## XSS defenses

- `src/lib/safe-url.ts`
  - `safeExternalUrl()` normalizes input to `http(s)` only and rejects
    `javascript:`, `data:`, `vbscript:`, etc. Used before placing URLs in
    `href` / `window.open`.
  - `hostnameOf()` derives a display hostname safely.
  - `jsonLdScript()` escapes `<`, `>`, `&`, and U+2028/U+2029 before embedding
    JSON-LD in a `<script type="application/ld+json">`.
- `src/lib/summarize.ts` strips URLs from generated summaries.
- React escapes all rendered text by default; the only
  `dangerouslySetInnerHTML` is the sanitized JSON-LD in `src/app/page.tsx`.
- `Permissions-Policy` disables camera/microphone/geolocation/payment.

## Secret management

- Runtime secrets are **never** committed and **never** baked into the client
  bundle:
  - `.env.local` and `.dev.vars` are gitignored and temporarily moved aside by
    `scripts/build-cf.sh` during Cloudflare builds.
  - Production runtime values are set with
    `wrangler secret put OPENAI_API_KEY|OPENAI_MODEL|SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY`.
- Only public values are tracked in `.env.production`:
  `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN` and
  `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` / `NEXT_PUBLIC_POSTHOG_HOST` (a PostHog
  project token is a public write key).
- The Supabase **service-role** key is used only server-side
  (`src/lib/supabase.ts`) and must never be exposed to the client.
- `poweredByHeader: false` removes the `X-Powered-By` fingerprint.

## Privacy-preserving telemetry

Analytics is opt-in and reversible:

- Consent is stored under `revo-consent-v1` (`src/lib/consent.ts`) and is one
  of `granted` / `denied` / unset. Unexpired/unset state shows the cookie
  banner (`src/components/layout/cookie-notice.tsx`); users can change the
  choice any time via the cookie settings button.
- PostHog is initialized **only** after `granted`
  (`src/components/analytics/posthog-analytics.tsx`). On `denied`,
  `opt_out_capturing()` + `reset()` are called.
- Events are routed through the first-party `/ingest` reverse proxy and use
  `person_profiles: "identified_only"`.
- Server-side events (`waitlist_joined`, `feedback_submitted`,
  `ai_question_asked`) are emitted via `after()` and only when the client
  sends an `x-posthog-distinct-id` header — i.e. only after consent. Events
  carry no PII (counts, page path only).
- Cloudflare Web Analytics is loaded only if `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN`
  is set, and it is cookieless.

## Data rights

`POST /api/privacy` supports `export` and `delete` by email:

- Both actions use case-insensitive `ilike` matching on the email.
- `export` returns the matching `waitlist` (`email`, `created_at`) and
  `feedback` (`message`, `page`, `created_at`) rows.
- `delete` removes matching rows from both tables.
- Rate limited to 3 / 10 min and origin-checked.
- Because the endpoint is unauthenticated (no user accounts), the export
  returns data only for the exact email supplied. This is acceptable for the
  low-sensitivity pilot data but is not a strong authorization boundary; see
  limitations.

## Known limitations

- **No authentication.** All API routes are public. Rate limits + origin checks
  are the only abuse controls; they are deterrents, not guarantees.
- **Email-based privacy endpoint is not verified.** Anyone who knows an email
  can export/delete rows for it. Acceptable only while the data is
  low-sensitivity and no accounts exist.
- **Static CSP uses `'unsafe-inline'`** for scripts and styles. A stricter
  nonce/hash CSP would require giving up fully static pages.
- **No WAF or bot management** is configured beyond the rate limiter.
- **`x-forwarded-for` fallback** is spoofable if the app is ever run without a
  trusted proxy in front; the Cloudflare header is preferred for this reason.
- **Service-role key bypasses RLS.** RLS is enabled on the tables and there is
  a public-insert policy, but the app always uses the service-role key, so RLS
  is defense-in-depth rather than the enforced boundary.

## Reporting

Security issues: `hello@revoos.app` (see the Organization JSON-LD on the
landing page).
