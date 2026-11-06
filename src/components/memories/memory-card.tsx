"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Memory } from "@/lib/types";
import { memoryTypeMeta } from "@/lib/memory-type";

interface MemoryCardProps {
  memory: Memory;
  onToggleFavorite?: (memory: Memory) => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isImagePreview(memory: Memory): boolean {
  if (!memory.previewUrl) return false;
  if (memory.previewMime) return memory.previewMime.startsWith("image/");
  return memory.type === "image" || memory.type === "screenshot";
}

/**
 * Preview zone. Shows the memory's real attached image when one exists; other
 * types show a semantic type tint with the type icon (no fabricated imagery).
 */
function MediaPreview({ memory }: { memory: Memory }) {
  const meta = memoryTypeMeta[memory.type];
  const Icon = meta.icon;

  if (isImagePreview(memory)) {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-secondary">
        <Image
          src={memory.previewUrl as string}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 320px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-[16/10] w-full items-center justify-center rounded-xl",
        meta.accent.tint
      )}
    >
      <Icon className={cn("size-7", meta.accent.text)} />
    </div>
  );
}

export function MemoryCard({ memory, onToggleFavorite }: MemoryCardProps) {
  const meta = memoryTypeMeta[memory.type];
  const Icon = meta.icon;

  return (
    <div className="app-lift app-card group relative flex flex-col gap-3 overflow-hidden p-4 hover:border-primary/25">
      <MediaPreview memory={memory} />

      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
            meta.accent.soft
          )}
        >
          <Icon className="size-3" />
          {meta.label}
        </span>
        {onToggleFavorite && (
          <button
            type="button"
            aria-label={memory.favorite ? "Unfavorite" : "Favorite"}
            aria-pressed={memory.favorite}
            onClick={() => onToggleFavorite(memory)}
            className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-favorite focus-visible:opacity-100 group-hover:opacity-100 aria-pressed:text-favorite aria-pressed:opacity-100"
          >
            <Star
              className={cn("size-4", memory.favorite && "fill-favorite")}
            />
          </button>
        )}
      </div>

      <Link href={`/memory/${memory.id}`} className="flex flex-1 flex-col gap-1.5">
        <h3 className="line-clamp-2 text-sm font-semibold text-heading">
          {memory.title}
        </h3>
        {(memory.description || memory.content) && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {memory.description || memory.content}
          </p>
        )}
      </Link>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">
          {memory.domain ?? formatDate(memory.createdAt)}
        </span>
        {memory.domain && <span className="shrink-0">{formatDate(memory.createdAt)}</span>}
      </div>

      {memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {memory.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
