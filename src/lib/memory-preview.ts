import type { Memory, MemoryType } from "./types";

const coverPalettes: Record<MemoryType, readonly [string, string]> = {
  screenshot: ["#8b5cf6", "#d946ef"],
  note: ["#f59e0b", "#f97316"],
  document: ["#0ea5e9", "#3b82f6"],
  link: ["#10b981", "#14b8a6"],
  image: ["#f43f5e", "#ec4899"],
  discussion: ["#14b8a6", "#06b6d4"],
  email: ["#6366f1", "#8b5cf6"],
  archive: ["#64748b", "#475569"],
};

const coverEmoji: Record<MemoryType, string> = {
  screenshot: "📸",
  note: "📝",
  document: "📄",
  link: "🔗",
  image: "🖼️",
  discussion: "💬",
  email: "✉️",
  archive: "🗄️",
};

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(value: string, max: number): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned.length > max ? `${cleaned.slice(0, max).trimEnd()}…` : cleaned;
}

export function generatedMemoryPreview(
  memory: Pick<Memory, "type" | "title" | "collection" | "domain" | "source">
): string {
  const [from, to] = coverPalettes[memory.type] ?? coverPalettes.note;
  const emoji = coverEmoji[memory.type] ?? "📄";
  const label = memory.type.charAt(0).toUpperCase() + memory.type.slice(1);
  const title = truncate(memory.title, 44);
  const subtitle = truncate(
    memory.type === "link" && memory.domain
      ? memory.domain
      : memory.collection || "Revo OS",
    40
  );

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">`,
    `<defs>`,
    `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0%" stop-color="${from}"/>`,
    `<stop offset="100%" stop-color="${to}"/>`,
    `</linearGradient>`,
    `</defs>`,
    `<rect width="1200" height="630" fill="url(#g)"/>`,
    `<circle cx="1050" cy="60" r="270" fill="#ffffff" opacity="0.14"/>`,
    `<circle cx="120" cy="570" r="200" fill="#ffffff" opacity="0.10"/>`,
    `<rect x="64" y="52" width="212" height="54" rx="27" fill="#ffffff" opacity="0.20"/>`,
    `<text x="170" y="87" font-size="26" font-family="system-ui, sans-serif" font-weight="600" fill="#ffffff" text-anchor="middle">${esc(label)}</text>`,
    `<text x="600" y="330" font-size="156" text-anchor="middle">${emoji}</text>`,
    `<text x="80" y="522" font-size="48" font-family="system-ui, sans-serif" font-weight="700" fill="#ffffff">${esc(title)}</text>`,
    `<text x="80" y="568" font-size="27" font-family="system-ui, sans-serif" fill="#ffffff" opacity="0.85">${esc(subtitle)}</text>`,
    `</svg>`,
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}