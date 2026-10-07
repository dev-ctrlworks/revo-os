const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const requests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requests.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requests.set(ip, recent);
    return true;
  }
  recent.push(now);
  requests.set(ip, recent);
  return false;
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export function isRateLimitedRequest(request: Request): boolean {
  return isRateLimited(getClientIp(request));
}