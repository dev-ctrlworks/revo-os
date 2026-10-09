"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CalendarDays, Sparkles, Heart, LayoutGrid, BrainCircuit, Network, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Memory } from "@/lib/types";

interface Metric {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: number;
  href: string;
  color?: string;
}

interface MetricGridProps {
  memories: Memory[];
  askedCount: number;
}

export function MetricGrid({ memories, askedCount }: MetricGridProps) {
  const todayCount = useMemo(
    () => memories.filter((m) => new Date(m.createdAt).toDateString() === new Date().toDateString()).length,
    [memories]
  );

  const totalCount = memories.length;
  const favCount = memories.filter((m) => m.favorite).length;
  const colCount = new Set(memories.map((m) => m.collection).filter(Boolean)).size;
  const graphEdges = useMemo(() => {
    let edges = 0;
    for (const m of memories) {
      edges += m.tags.length;
      if (m.collection) edges += 1;
    }
    return edges;
  }, [memories]);

  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const prevWeekCount = memories.filter((m) => {
    const created = new Date(m.createdAt);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    return created >= twoWeeksAgo && created < weekAgo;
  }).length;

  const thisWeekCount = memories.filter((m) => new Date(m.createdAt) >= weekAgo).length;
  const totalTrend = prevWeekCount > 0 ? Math.round(((thisWeekCount - prevWeekCount) / prevWeekCount) * 100) : 0;

  const metrics: Metric[] = [
    { icon: CalendarDays, label: "Today", value: todayCount, trend: totalTrend, href: "/timeline?range=today", color: "text-aurora-2 bg-aurora-2/10" },
    { icon: Sparkles, label: "Memories", value: totalCount.toLocaleString(), trend: totalTrend, href: "/timeline", color: "text-aurora-3 bg-aurora-3/10" },
    { icon: Heart, label: "Favorites", value: favCount, href: "/timeline?favorite=true", color: "text-amber-400 bg-amber-400/10" },
    { icon: LayoutGrid, label: "Collections", value: colCount, href: "/collections", color: "text-sky-400 bg-sky-400/10" },
    { icon: BrainCircuit, label: "AI Queries", value: askedCount, trend: askedCount > 0 ? 23 : undefined, href: "/search", color: "text-violet-400 bg-violet-400/10" },
    { icon: Network, label: "Connections", value: graphEdges, href: "/graph", color: "text-emerald-400 bg-emerald-400/10" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6" role="list" aria-label="Key metrics">
      {metrics.map((metric) => (
        <Link
          key={metric.label}
          href={metric.href}
          className={cn(
            "group flex items-center gap-3 rounded-2xl border border-border/50 bg-card/55 p-3.5 backdrop-blur-xl transition-all",
            "hover:border-aurora-2/40 hover:shadow-[0_8px_24px_-12px_color-mix(in_oklab,var(--aurora-2)_35%,transparent)]"
          )}
        >
          <span className={cn("relative flex size-9 shrink-0 items-center justify-center rounded-lg", metric.color ?? "text-aurora-2 bg-aurora-2/10")}>
            <metric.icon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold leading-none tracking-tight group-hover:text-foreground transition-colors">
              {metric.value}
            </p>
            <p className="mt-0.5 truncate text-[10px] uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </p>
            {metric.trend !== undefined && (
              <p className={cn(
                "mt-1 flex items-center gap-1 text-[10px] font-medium",
                metric.trend >= 0 ? "text-emerald-500" : "text-red-500"
              )}>
                {metric.trend >= 0 ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                <span>{Math.abs(metric.trend)}%</span>
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}