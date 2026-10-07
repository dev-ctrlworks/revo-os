import type { MemoryType } from "./types";

export const PREVIEW_LIMIT = 1_500_000;

export interface UploadedFile {
  uid: string;
  name: string;
  sizeLabel: string;
  status: "indexing" | "indexed" | "failed";
  memoryId?: string;
  summary?: string;
  file?: File;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function readAsDataURL(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(reader.result ? String(reader.result) : undefined);
    reader.onerror = () => resolve(undefined);
    reader.readAsDataURL(file);
  });
}

export function extensionOf(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function inferMemoryType(name: string): MemoryType {
  const ext = extensionOf(name);
  if (["png", "jpg", "jpeg", "webp", "heic", "gif", "svg", "avif"].includes(ext)) {
    return "image";
  }
  if (["pdf", "doc", "docx", "txt", "md", "rtf", "pages"].includes(ext)) {
    return "document";
  }
  if (["zip", "dmg", "rar", "7z", "tar", "gz"].includes(ext)) {
    return "archive";
  }
  return "document";
}

export function titleFromName(name: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  if (!base.trim()) return name;
  return base.replace(/[-_]+/g, " ").trim();
}