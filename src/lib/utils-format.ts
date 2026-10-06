export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.round(days / 365);
  return `${years}y ago`;
}

export function titleCase(input: string): string {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatMemoryCount(count: number): string {
  return `${count} ${count === 1 ? "memory" : "memories"}`;
}

export function groupMemoriesByMonth(createdAtList: string[]): string {
  if (!createdAtList.length) return "";
  const sorted = createdAtList.sort(
    (a, b) => +new Date(a) - +new Date(b)
  );
  const start = new Date(sorted[0]);
  const end = new Date(sorted[sorted.length - 1]);
  const sameYear = start.getFullYear() === end.getFullYear();
  const startLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: sameYear ? undefined : "numeric",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(end);
  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
}