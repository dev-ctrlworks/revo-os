import type { Memory, MemoryType } from "./types";

const coverPalettes: Record<MemoryType, readonly [string, string]> = {
  screenshot: ["#eeecff", "#eaf0ff"],
  note: ["#eaf0ff", "#eeecff"],
  document: ["#eeecff", "#e6e4ff"],
  link: ["#eaf0ff", "#e4ecff"],
  image: ["#eeecff", "#eaf0ff"],
  discussion: ["#e9e9ff", "#eeecff"],
  email: ["#e6e7ff", "#eeecff"],
  archive: ["#f1f2f8", "#eeecff"],
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
    `<circle cx="1050" cy="60" r="270" fill="#6258cc" opacity="0.08"/>`,
    `<circle cx="120" cy="570" r="200" fill="#4968d9" opacity="0.07"/>`,
    `<rect x="64" y="52" width="212" height="54" rx="27" fill="#ffffff" opacity="0.7"/>`,
    `<text x="170" y="87" font-size="26" font-family="system-ui, sans-serif" font-weight="600" fill="#4941a0" text-anchor="middle">${esc(label)}</text>`,
    `<text x="600" y="330" font-size="156" text-anchor="middle">${emoji}</text>`,
    `<text x="80" y="522" font-size="48" font-family="system-ui, sans-serif" font-weight="700" fill="#383a83">${esc(title)}</text>`,
    `<text x="80" y="568" font-size="27" font-family="system-ui, sans-serif" fill="#4941a0" opacity="0.8">${esc(subtitle)}</text>`,
    `</svg>`,
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}