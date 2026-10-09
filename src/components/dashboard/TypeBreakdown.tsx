"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Memory, MemoryType } from "@/lib/types";
import { MemoryTypeIcon, memoryTypeLabel } from "@/components/memories/memory-type-icon";

const TYPE_COLORS: Record<MemoryType, string> = {
  screenshot: "from-violet-500 to-fuchsia-500",
  note: "from-amber-500 to-orange-500",
  document: "from-sky-500 to-blue-500",
  link: "from-emerald-500 to-teal-500",
  image: "from-rose-500 to-pink-500",
  discussion: "from-teal-500 to-cyan-500",
  email: "from-indigo-500 to-violet-500",
  archive: "from-slate-500 to-slate-600",
};

interface TypeBreakdownProps {
  memories: Memory[];
  className?: string;
  onTypeClick?: (type: MemoryType) => void;
}

export function TypeBreakdown({ memories, className, onTypeClick }: TypeBreakdownProps) {
  const breakdown = useMemo(() => {
    const counts = new Map<MemoryType, number>();
    for (const m of memories) {
      counts.set(m.type, (counts.get(m.type) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([type, count]) => ({ type, count, percentage: memories.length > 0 ? (count / memories.length) * 100 : 0 }))
      .sort((a, b) => b.count - a.count);
  }, [memories]);

  if (breakdown.length === 0) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border/60 bg-card/40 p-6 text-center backdrop-blur-xl", className)}>
        <MemoryTypeIcon type="document" size="md" className="mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-xs font-medium">No memories yet</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border/50 bg-card/55 p-4 backdrop-blur-xl overflow-hidden", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold tracking-tight">Memory Types</h3>
        <span className="text-[10px] text-muted-foreground">{breakdown.length} types</span>
      </div>

      <div className="space-y-1.5" role="list" aria-label="Memory type breakdown">
        {breakdown.map(({ type, count, percentage }) => (
          <button
            key={type}
            onClick={() => onTypeClick?.(type)}
            className={cn(
              "group relative w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-aurora-2/10",
              onTypeClick && "cursor-pointer"
            )}
            role="listitem"
          >
            <span className={cn("relative flex size-6 shrink-0 items-center justify-center rounded-md", TYPE_COLORS[type])}>
              <MemoryTypeIcon type={type} size="xs" className="text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium truncate">{memoryTypeLabel(type)}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{count}</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted/50">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${TYPE_COLORS[type].replace("from-", "").replace(" to-", ", ")})`,
                  }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}