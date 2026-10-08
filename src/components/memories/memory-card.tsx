"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Heart } from "lucide-react";
import type { Memory, MemoryType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils-format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MemoryTypeIcon, memoryTypeLabel } from "./memory-type-icon";

const topPalette: Record<MemoryType, string> = {
  screenshot: "from-violet-500 to-fuchsia-500",
  note: "from-amber-500 to-orange-500",
  document: "from-sky-500 to-blue-500",
  link: "from-emerald-500 to-teal-500",
  image: "from-rose-500 to-pink-500",
  discussion: "from-teal-500 to-cyan-500",
  email: "from-indigo-500 to-violet-500",
  archive: "from-slate-500 to-slate-600",
};

export function MemoryCard({
  memory,
  compact = false,
}: {
  memory: Memory;
  compact?: boolean;
}) {
  const top = topPalette[memory.type] ?? topPalette.note;

  return (
    <Link href={`/memory/${memory.id}`} className="group block h-full">
      <Card className="flex h-full flex-col gap-0 overflow-hidden border-border/50 bg-card/55 p-0 shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-2/40 hover:shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--aurora-2)_50%,transparent)]">
        <div className={cn("h-1 bg-gradient-to-r shadow-[0_2px_12px_-2px_color-mix(in_oklab,var(--aurora-2)_55%,transparent)]", top)} />
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <MemoryTypeIcon type={memory.type} />
              {memoryTypeLabel(memory.type)}
            </span>
            {memory.favorite && (
              <Heart className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>

          {memory.collection && (
            <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
              {memory.collection}
            </p>
          )}

          <h3
            className={cn(
              "line-clamp-1 font-display font-semibold leading-snug tracking-tight",
              compact ? "text-[13px]" : "text-sm"
            )}
          >
            {memory.title}
          </h3>

          <p
            className={cn(
              "mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted-foreground",
              compact && "line-clamp-1"
            )}
          >
            {memory.content}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="size-3" />
              {timeAgo(memory.createdAt)}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              Open
              <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function MemoryCardSkeleton() {
  return (
    <Card className="animate-pulse gap-0 overflow-hidden border-border/50 p-0">
      <div className="h-1 bg-muted/60" />
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
          <div className="size-3.5 rounded bg-muted" />
        </div>
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
        <div className="mt-2.5 h-3 w-full rounded bg-muted" />
        <div className="mt-1.5 h-3 w-5/6 rounded bg-muted" />
        <div className="mt-4 h-px w-full bg-muted/70" />
        <div className="mt-3 flex items-center justify-between">
          <div className="h-3 w-12 rounded bg-muted" />
          <div className="h-3 w-8 rounded bg-muted" />
        </div>
      </div>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl icon-chip text-muted-foreground">
        <MemoryTypeIcon type="document" size="md" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button className="mt-5" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}