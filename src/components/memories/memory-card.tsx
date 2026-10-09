"use client";

import Link from "next/link";
import { Calendar, Heart, Check, ChevronRight } from "lucide-react";
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

export type MemoryCardVariant = "default" | "compact" | "grid" | "feed";

interface MemoryCardProps {
  memory: Memory;
  variant?: MemoryCardVariant;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onFavoriteToggle?: (id: string, favorite: boolean) => void;
  onCollectionChange?: (id: string, collection: string) => void;
}

export function MemoryCard({
  memory,
  variant = "default",
  selected = false,
  onSelect,
  onFavoriteToggle,
  onCollectionChange,
}: MemoryCardProps) {
  const top = topPalette[memory.type] ?? topPalette.note;
  const isInteractive = Boolean(onSelect || onFavoriteToggle || onCollectionChange);
  const isOuterLink = !isInteractive;

  const handleClick = (e: React.SyntheticEvent) => {
    if (isInteractive) {
      e.preventDefault();
      e.stopPropagation();
      if (onSelect) {
        onSelect(memory.id, !selected);
      }
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(memory.id, !memory.favorite);
  };

  const renderContent = () => (
    <>
      <div className={cn("h-1 bg-gradient-to-r shadow-[0_2px_12px_-2px_color-mix(in_oklab,var(--aurora-2)_55%,transparent)]", top)} />
      <div className={cn("flex flex-1 flex-col", variant === "grid" ? "p-4" : "p-5")}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <MemoryTypeIcon type={memory.type} size={variant === "compact" ? "sm" : "md"} />
            {memoryTypeLabel(memory.type)}
          </span>
          <div className="flex items-center gap-1">
            {memory.favorite && (
              <Heart className="size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Favorite" />
            )}
            {onFavoriteToggle && (
              <button
                onClick={handleFavoriteToggle}
                className={cn(
                  "p-1 rounded-lg transition-colors hover:bg-aurora-2/20",
                  memory.favorite && "text-amber-400"
                )}
                aria-label={memory.favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className="size-3.5" />
              </button>
            )}
            {onSelect && (
              <button
                onClick={handleClick}
                className={cn(
                  "p-1 rounded-lg transition-colors",
                  selected ? "bg-aurora-2/20 text-aurora-2" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-label={selected ? "Deselect" : "Select"}
                aria-pressed={selected}
              >
                <Check className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {memory.collection && (
          <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">
            {memory.collection}
          </p>
        )}

        <h3
          className={cn(
            "line-clamp-1 font-display font-semibold leading-snug tracking-tight",
            variant === "compact" ? "text-[13px]" : variant === "grid" ? "text-base" : "text-sm"
          )}
        >
          {memory.title}
        </h3>

        {variant !== "compact" && (
          <p
            className={cn(
              "mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted-foreground",
              variant === "grid" && "line-clamp-3"
            )}
          >
            {memory.content}
          </p>
        )}

        {variant === "feed" && (
          <div className="mt-2 flex flex-wrap gap-1">
            {memory.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                {tag}
              </span>
            ))}
            {memory.tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                +{memory.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className={cn(
          "mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-3",
          variant === "compact" && "mt-2 pt-2"
        )}>
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="size-3" />
            {timeAgo(memory.createdAt)}
          </span>
          {onSelect ? (
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              {selected ? "Selected" : "Click to select"}
            </span>
          ) : isOuterLink ? (
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              Open
              <ChevronRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          ) : (
            <Link
              href={`/memory/${memory.id}`}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Open
              <ChevronRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </>
  );

  if (!isOuterLink) {
    return (
      <div
        className={cn(
          "group relative rounded-2xl border overflow-hidden transition-all duration-300",
          "border-border/50 bg-card/55 backdrop-blur-xl",
          selected && "border-aurora-2/40 bg-aurora-2/5 shadow-[0_0_0_1px_var(--aurora-2),0_12px_32px_-16px_color-mix(in_oklab,var(--aurora-2)_40%,transparent)]",
          "hover:border-aurora-2/40 hover:shadow-[0_12px_32px_-16px_color-mix(in_oklab,var(--aurora-2)_40%,transparent)]"
        )}
        onClick={onSelect ? handleClick : undefined}
        role={onSelect ? "checkbox" : undefined}
        aria-checked={onSelect ? selected : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={
          onSelect
            ? (e) => e.key === " " && (e.preventDefault(), handleClick(e))
            : undefined
        }
      >
        {renderContent()}
        {onSelect && selected && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aurora-2/10 to-aurora-3/10" />
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/memory/${memory.id}`}
      className={cn(
        "group block h-full rounded-2xl border overflow-hidden transition-all duration-300",
        "border-border/50 bg-card/55 backdrop-blur-xl",
        "hover:-translate-y-0.5 hover:border-aurora-2/40 hover:shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--aurora-2)_50%,transparent)]",
        variant === "grid" && "flex flex-col"
      )}
    >
      {renderContent()}
    </Link>
  );
}

export function MemoryCardSkeleton({ variant = "default" }: { variant?: MemoryCardVariant }) {
  return (
    <Card className={cn("animate-pulse gap-0 overflow-hidden border-border/50 p-0", variant === "grid" && "flex flex-col")}>
      <div className="h-1 bg-muted/60" />
      <div className={cn("flex flex-1 flex-col", variant === "grid" ? "p-4" : "p-5")}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
          </div>
          <div className="size-3.5 rounded bg-muted" />
        </div>
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
        {variant !== "compact" && (
          <>
            <div className="mt-2.5 h-3 w-full rounded bg-muted" />
            <div className="mt-1.5 h-3 w-5/6 rounded bg-muted" />
          </>
        )}
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
  icon = "document",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: MemoryType;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl icon-chip text-muted-foreground">
        <MemoryTypeIcon type={icon} size="md" />
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

export function MemoryCardFeedRow({
  memory,
  last = false,
  onClick,
}: {
  memory: Memory;
  last?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 bg-transparent px-4 py-3 transition-colors hover:bg-card/50",
        !last && "border-b border-border/40"
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => onClick && e.key === "Enter" && onClick()}
    >
      <MemoryTypeIcon type={memory.type} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">{memory.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {memoryTypeLabel(memory.type)}
          {memory.collection ? ` · ${memory.collection}` : ""}
        </p>
      </div>
      <span className="shrink-0 text-[11px] text-muted-foreground">
        {timeAgo(memory.createdAt)}
      </span>
      <ChevronRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
    </div>
  );
}