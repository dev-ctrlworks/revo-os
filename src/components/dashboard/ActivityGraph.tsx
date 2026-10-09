"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Memory } from "@/lib/types";

type TimeRange = "week" | "month" | "quarter";

interface ActivityGraphProps {
  memories: Memory[];
  className?: string;
}

const RANGE_CONFIG: Record<TimeRange, { label: string; days: number; buckets: number }> = {
  week: { label: "Week", days: 7, buckets: 7 },
  month: { label: "Month", days: 30, buckets: 10 },
  quarter: { label: "Quarter", days: 90, buckets: 12 },
};

export function ActivityGraph({ memories, className }: ActivityGraphProps) {
  const [range, setRange] = useState<TimeRange>("week");

  const { bars, maxCount, totalInRange } = useMemo(() => {
    const config = RANGE_CONFIG[range];
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - config.days);

    const bucketSize = config.days / config.buckets;
    const buckets: number[] = new Array(config.buckets).fill(0);

    for (const m of memories) {
      const created = new Date(m.createdAt);
      if (created >= cutoff && created <= now) {
        const daysAgo = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        const bucketIndex = Math.min(Math.floor(daysAgo / bucketSize), config.buckets - 1);
        buckets[bucketIndex]++;
      }
    }

    const maxCount = Math.max(...buckets, 1);
    const totalInRange = buckets.reduce((a, b) => a + b, 0);

    return { bars: buckets, maxCount, totalInRange };
  }, [memories, range]);

  const formatBucketLabel = (index: number) => {
    const config = RANGE_CONFIG[range];
    const bucketSize = config.days / config.buckets;
    const daysAgo = Math.floor((index + 0.5) * bucketSize);

    if (range === "week") {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
    if (range === "month") {
      if (index % 3 === 0) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
      return "";
    }
    if (index % 4 === 0) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      return date.toLocaleDateString("en-US", { month: "short" });
    }
    return "";
  };

  return (
    <div className={cn("rounded-xl border border-border/50 bg-card/55 p-4 backdrop-blur-xl overflow-hidden", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-display text-sm font-semibold tracking-tight">Capture Trend</h3>
        <div className="flex gap-0.5 rounded-lg border border-border/50 bg-card/55 p-0.5">
          {(Object.keys(RANGE_CONFIG) as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
                range === r
                  ? "bg-aurora-2/15 text-aurora-2"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {RANGE_CONFIG[r].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-xl font-semibold tracking-tight">{totalInRange}</span>
        <span className="text-[10px] text-muted-foreground">captures</span>
      </div>

      <div className="flex items-end gap-0.5" style={{ height: 60 }}>
        {bars.map((count, i) => {
          const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
          return (
            <div key={i} className="group relative flex-1 h-full flex items-end">
              <div
                className="w-full rounded-t bg-gradient-to-t from-aurora-2/60 to-aurora-3/80 transition-all duration-300 group-hover:from-aurora-2 group-hover:to-aurora-3"
                style={{ height: `${Math.max(height, 4)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-1 flex gap-0.5">
        {bars.map((_, i) => (
          <div key={i} className="flex-1 text-center text-[8px] text-muted-foreground/60 truncate">
            {formatBucketLabel(i)}
          </div>
        ))}
      </div>
    </div>
  );
}