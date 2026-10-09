const SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

/**
 * Returns a normalized http(s) URL, or null when the input is not a safe
 * external link. Blocks `javascript:`, `data:`, `vbscript:`, and other
 * schemes that can lead to XSS when placed in an href or window.open.
 */
export function safeExternalUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidate = SCHEME_RE.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.toString();
}

export function hostnameOf(raw: string): string {
  const url = safeExternalUrl(raw);
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Serializes data for embedding in a <script type="application/ld+json"> tag.
 * Escapes characters that could break out of the script element.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
