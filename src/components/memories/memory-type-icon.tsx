"use client";

import { cn } from "@/lib/utils";
import type { MemoryType } from "@/lib/types";
import { memoryTypeMeta } from "@/lib/memory-type";

export { memoryTypeLabel } from "@/lib/memory-type";

export function MemoryTypeIcon({
  type,
  size = "sm",
  className,
}: {
  type: MemoryType;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const meta = memoryTypeMeta[type];
  const Icon = meta.icon;
  const dims =
    size === "xs"
      ? "size-5 rounded"
      : size === "sm"
        ? "size-7 rounded-lg"
        : size === "md"
          ? "size-9 rounded-xl"
          : "size-10 rounded-xl";
  const iconSize =
    size === "xs"
      ? "size-2.5"
      : size === "sm"
        ? "size-3.5"
        : size === "md"
          ? "size-4.5"
          : "size-5";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        dims,
        meta.bg,
        className
      )}
    >
      <Icon className={cn(iconSize, meta.color)} />
    </span>
  );
}
