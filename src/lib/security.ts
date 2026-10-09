import { getCloudflareContext } from "@opennextjs/cloudflare";

const DEFAULT_WINDOW_MS = 60_000;
const MAX_TRACKED_KEYS = 10_000;
const MAX_BODY_BYTES = 16_384;

interface RateLimitConfig {
  /** Maximum requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. Defaults to 60s. */
  windowMs?: number;
}

interface RateLimiterBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

const buckets = new Map<string, number[]>();

/**
 * Resolves the client IP, preferring headers set by the trusted proxy
 * (Cloudflare) over the spoofable `x-forwarded-for`.
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown";
}

function pruneBuckets(now: number, windowMs: number): void {
  if (buckets.size <= MAX_TRACKED_KEYS) return;
  for (const [key, times] of buckets) {
    const last = times[times.length - 1];
    if (last === undefined || now - last > windowMs) buckets.delete(key);
  }
  if (buckets.size <= MAX_TRACKED_KEYS) return;
  for (const key of buckets.keys()) {
    buckets.delete(key);
    if (buckets.size <= MAX_TRACKED_KEYS) break;
  }
}

function isRateLimitedMemory(key: string, windowMs: number, limit: number): boolean {
  const now = Date.now();
  pruneBuckets(now, windowMs);

  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return true;
  }

  recent.push(now);
  buckets.set(key, recent);
  return false;
}

function getRateLimiterBinding(): RateLimiterBinding | null {
  try {
    const { env } = getCloudflareContext();
    const binding = (env as unknown as Record<string, unknown>).RATE_LIMITER;
    if (binding && typeof (binding as RateLimiterBinding).limit === "function") {
      return binding as RateLimiterBinding;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Per-IP rate limit scoped by namespace.
 *
 * Uses the Cloudflare Rate Limiting binding (`RATE_LIMITER`) when running on
 * Workers for a distributed, edge-enforced cap, and falls back to a bounded
 * in-memory limiter for the per-route limit (and for local `next start`).
 */
export async function enforceRateLimit(
  request: Request,
  namespace: string,
  { limit, windowMs = DEFAULT_WINDOW_MS }: RateLimitConfig
): Promise<boolean> {
  const key = `${namespace}:${getClientIp(request)}`;

  const binding = getRateLimiterBinding();
  if (binding) {
    try {
      const { success } = await binding.limit({ key });
      if (!success) return true;
    } catch {
      // Binding unavailable/failed — rely on the in-memory limiter below.
    }
  }

  return isRateLimitedMemory(key, windowMs, limit);
}

/**
 * Rejects cross-site requests. When an Origin header is present it must match
 * the request host, which blocks CSRF and cross-site abuse of the API routes.
 */
export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  if (origin === "null") return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const host = request.headers.get("host");
  return !!host && originHost === host;
}

/** Reads and parses a JSON body while enforcing a byte cap. */
export async function readJsonBody<T = unknown>(
  request: Request,
  maxBytes: number = MAX_BODY_BYTES
): Promise<T | null> {
  const declared = Number(request.headers.get("content-length") ?? "");
  if (Number.isFinite(declared) && declared > maxBytes) return null;

  let text: string;
  try {
    text = await request.text();
  } catch {
    return null;
  }
  if (text.length > maxBytes) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/** Coerces unknown input to a trimmed, length-capped string. */
export function asString(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
