"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Hash,
  Heart,
  Inbox,
  LayoutDashboard,
  LayoutGrid,
  Plus,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import type { AIAnswer, Memory, MemoryType } from "@/lib/types";
import { useMemoryStore } from "@/lib/use-memory-store";
import { timeAgo } from "@/lib/utils-format";
import { exampleQueries } from "@/lib/mock-data";
import { AISearchBar } from "@/components/ai/ai-search-bar";
import { AIAnswerView } from "@/components/ai/ai-answer";
import { MemoryTypeIcon, memoryTypeLabel } from "@/components/memories/memory-type-icon";
import { Button } from "@/components/ui/button";

const cardClass =
  "rounded-2xl border border-border/50 bg-card/55 backdrop-blur-xl shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)]";

const typeBar: Record<MemoryType, string> = {
  screenshot: "from-violet-500 to-fuchsia-500",
  note: "from-amber-500 to-orange-500",
  document: "from-sky-500 to-blue-500",
  link: "from-emerald-500 to-teal-500",
  image: "from-rose-500 to-pink-500",
  discussion: "from-teal-500 to-cyan-500",
  email: "from-indigo-500 to-violet-500",
  archive: "from-slate-500 to-slate-600",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Night owl";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function DashboardPage() {
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  const [asked, setAsked] = useState(0);
  const memories = useMemoryStore();
  const answerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (answer) {
      answerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [answer]);

  const sorted = useMemo(
    () => [...memories].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [memories]
  );

  const recent = useMemo(() => sorted.slice(0, 6), [sorted]);

  const favorites = useMemo(() => memories.filter((m) => m.favorite), [memories]);

  const collections = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of memories) {
      if (m.collection) map.set(m.collection, (map.get(m.collection) ?? 0) + 1);
    }
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [memories]);

  const typeDist = useMemo(() => {
    const map = new Map<MemoryType, number>();
    for (const m of memories) map.set(m.type, (map.get(m.type) ?? 0) + 1);
    return [...map.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [memories]);

  const topTags = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of memories) for (const t of m.tags) map.set(t, (map.get(t) ?? 0) + 1);
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [memories]);

  const daySeries = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 14 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (13 - i));
      const next = new Date(day);
      next.setDate(day.getDate() + 1);
      const count = memories.filter((m) => {
        const t = +new Date(m.createdAt);
        return t >= +day && t < +next;
      }).length;
      return { day, count };
    });
  }, [memories]);

  const { todayCount, weekCount, prevWeekCount } = useMemo(() => {
    const last7 = daySeries.slice(7).reduce((n, d) => n + d.count, 0);
    const prev7 = daySeries.slice(0, 7).reduce((n, d) => n + d.count, 0);
    return {
      todayCount: daySeries[daySeries.length - 1]?.count ?? 0,
      weekCount: last7,
      prevWeekCount: prev7,
    };
  }, [daySeries]);

  const heatmap = useMemo(() => {
    const today = startOfDay(new Date());
    const start = new Date(today);
    start.setDate(today.getDate() - 363);
    start.setDate(start.getDate() - start.getDay());
    const cells: { date: Date; count: number }[] = [];
    const cur = new Date(start);
    while (cur <= today) {
      const next = new Date(cur);
      next.setDate(cur.getDate() + 1);
      const count = memories.filter((m) => {
        const t = +new Date(m.createdAt);
        return t >= +cur && t < +next;
      }).length;
      cells.push({ date: new Date(cur), count });
      cur.setDate(cur.getDate() + 1);
    }
    const weeks: { date: Date; count: number }[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    const monthLabels = weeks.map((week, i) => {
      const d = week[0]?.date;
      if (!d) return "";
      const prev = weeks[i - 1]?.[0]?.date;
      if (prev && prev.getMonth() === d.getMonth()) return "";
      return d.toLocaleDateString("en-US", { month: "short" });
    });
    const total = cells.reduce((n, c) => n + c.count, 0);
    const max = Math.max(...cells.map((c) => c.count), 1);
    return { weeks, monthLabels, total, max };
  }, [memories]);

  const weekDelta =
    prevWeekCount === 0 ? null : Math.round(((weekCount - prevWeekCount) / prevWeekCount) * 100);

  const maxType = Math.max(...typeDist.map((t) => t.count), 1);
  const maxCollection = Math.max(...collections.map((c) => c.count), 1);

  const suggestions = exampleQueries.map((q) => ({ label: q, query: q }));
  const isEmpty = memories.length === 0;

  const kpis = [
    {
      icon: Sparkles,
      label: "Total memories",
      value: memories.length.toLocaleString(),
      hint: "in your layer",
    },
    {
      icon: CalendarDays,
      label: "Captured today",
      value: String(todayCount),
      hint: "since midnight",
    },
    {
      icon: TrendingUp,
      label: "This week",
      value: String(weekCount),
      hint: "last 7 days",
      delta: weekDelta,
    },
    {
      icon: LayoutGrid,
      label: "Collections",
      value: String(collections.length),
      hint: "auto-grouped",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-aurora-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aurora-2 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-aurora-2" />
            </span>
            {greeting()} ·{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-3 flex items-center gap-2.5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="flex size-9 items-center justify-center rounded-lg icon-chip">
              <LayoutDashboard className="size-4 text-aurora-2" />
            </span>
            <span>Dashboard</span>
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-3xl">
        <AISearchBar
          big
          suggestions={suggestions}
          onAnswer={(a) => {
            setAnswer(a);
            setAsked((n) => n + 1);
          }}
        />
      </div>

      {answer && (
        <section
          ref={answerRef}
          aria-live="polite"
          className="scroll-mt-24 space-y-3"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 shrink-0 text-aurora-2" />
              <span className="truncate">
                Answer for{" "}
                <span className="font-medium text-foreground">“{answer.query}”</span>
              </span>
            </p>
            <button
              type="button"
              onClick={() => setAnswer(null)}
              aria-label="Clear results"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/50 bg-card/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-xl transition-colors hover:border-aurora-2/40 hover:text-foreground"
            >
              <X className="size-3" />
              Clear
            </button>
          </div>
          <div className="animate-fade-up">
            <AIAnswerView answer={answer} />
          </div>
        </section>
      )}

      {answer && <div className="border-t border-border/40" />}

      {isEmpty ? (
        <div className={`${cardClass} relative overflow-hidden border-dashed p-10 text-center sm:p-16`}>
          <span className="pointer-events-none absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full icon-chip opacity-70 blur-3xl" />
          <span className="relative mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl icon-chip">
            <Inbox className="size-6 text-aurora-2" />
          </span>
          <h2 className="relative font-display text-lg font-semibold tracking-tight">
            Your dashboard is waiting
          </h2>
          <p className="relative mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Capture your first screenshot, note, or link — your stats, charts, and
            searchable memory will appear here.
          </p>
          <Button
            className="relative mt-5"
            size="sm"
            render={<Link href="/capture" />}
            nativeButton={false}
          >
            <Plus className="mr-1.5 size-3.5" />
            Capture your first memory
          </Button>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className={`${cardClass} p-4 sm:p-5`}>
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-xl icon-chip">
                    <kpi.icon className="size-4 text-aurora-2" />
                  </span>
                  {typeof kpi.delta === "number" && (
                    <span
                      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        kpi.delta >= 0
                          ? "bg-emerald-500/12 text-emerald-600"
                          : "bg-rose-500/12 text-rose-600"
                      }`}
                    >
                      {kpi.delta >= 0 ? (
                        <TrendingUp className="size-3" />
                      ) : (
                        <TrendingDown className="size-3" />
                      )}
                      {kpi.delta >= 0 ? "+" : ""}
                      {kpi.delta}%
                    </span>
                  )}
                </div>
                <p className="mt-4 text-2xl font-bold leading-none tracking-tight sm:text-3xl">
                  {kpi.value}
                </p>
                <p className="mt-1.5 text-xs font-medium text-foreground">{kpi.label}</p>
                <p className="text-[11px] text-muted-foreground">{kpi.hint}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className={`${cardClass} p-5 lg:col-span-2`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-sm font-semibold tracking-tight">
                    Activity heatmap
                  </h2>
                  <p className="text-[11px] text-muted-foreground">last 12 months</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold leading-none tracking-tight">
                    {heatmap.total}
                  </p>
                  <p className="text-[11px] text-muted-foreground">captures</p>
                </div>
              </div>

              <div className="mt-7 overflow-x-auto pb-1">
                <div className="inline-flex gap-2">
                  <div className="flex flex-col gap-[2px] pt-4">
                    {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
                      <span
                        key={i}
                        className="h-3 w-6 text-[9px] leading-3 text-muted-foreground/60"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-[2px]">
                      {heatmap.monthLabels.map((label, i) => (
                        <span
                          key={i}
                          className="w-3 text-[9px] leading-3 whitespace-nowrap text-muted-foreground/60"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-[2px]">
                      {heatmap.weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[2px]">
                          {week.map((cell, di) => {
                            const ratio = cell.count / heatmap.max;
                            const tone =
                              cell.count === 0
                                ? "bg-muted/60"
                                : ratio <= 0.25
                                  ? "bg-aurora-2/25"
                                  : ratio <= 0.5
                                    ? "bg-aurora-2/45"
                                    : ratio <= 0.75
                                      ? "bg-aurora-2/70"
                                      : "bg-aurora-2";
                            return (
                              <span
                                key={di}
                                title={`${cell.count} on ${cell.date.toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}`}
                                className={`size-3 rounded-[3px] ${tone}`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
                <span>Less</span>
                <span className="size-2.5 rounded-[2px] bg-muted/60" />
                <span className="size-2.5 rounded-[2px] bg-aurora-2/25" />
                <span className="size-2.5 rounded-[2px] bg-aurora-2/45" />
                <span className="size-2.5 rounded-[2px] bg-aurora-2/70" />
                <span className="size-2.5 rounded-[2px] bg-aurora-2" />
                <span>More</span>
              </div>
            </div>

            <div className={`${cardClass} p-5`}>
              <h2 className="font-display text-sm font-semibold tracking-tight">
                Capture mix
              </h2>
              <p className="text-[11px] text-muted-foreground">by memory type</p>
              <div className="mt-5 space-y-3.5">
                {typeDist.slice(0, 6).map((t) => (
                  <div key={t.type}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <MemoryTypeIcon type={t.type} className="size-4 rounded-md" />
                        {memoryTypeLabel(t.type)}
                      </span>
                      <span className="font-semibold text-foreground">{t.count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted/70">
                      <div
                        className={`animate-bar-grow h-full rounded-full bg-gradient-to-r ${typeBar[t.type]}`}
                        style={{ width: `${(t.count / maxType) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <div className={`${cardClass} lg:col-span-2`}>
              <div className="flex items-center justify-between p-5 pb-3">
                <h2 className="font-display text-sm font-semibold tracking-tight">
                  Recent memories
                </h2>
                <Link
                  href="/timeline"
                  className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="border-t border-border/40">
                {recent.map((memory, i) => (
                  <FeedRow key={memory.id} memory={memory} last={i === recent.length - 1} />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className={`${cardClass} p-5`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-semibold tracking-tight">
                    Top collections
                  </h2>
                  <LayoutGrid className="size-4 text-aurora-2" />
                </div>
                <div className="mt-4 space-y-3">
                  {collections.slice(0, 4).map((c) => (
                    <Link key={c.name} href="/collections" className="group block">
                      <div className="mb-1.5 flex items-center justify-between gap-2 text-[12px]">
                        <span className="truncate font-medium transition-colors group-hover:text-aurora-2">
                          {c.name}
                        </span>
                        <span className="shrink-0 text-muted-foreground">{c.count}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted/70">
                        <div
                          className="animate-bar-grow h-full rounded-full brand-gradient"
                          style={{ width: `${(c.count / maxCollection) * 100}%` }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className={`${cardClass} p-5`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-semibold tracking-tight">
                    Favorites
                  </h2>
                  <Heart className="size-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="mt-3 space-y-0.5">
                  {favorites.length === 0 ? (
                    <p className="py-2 text-[12px] text-muted-foreground">
                      Star a memory to pin it here.
                    </p>
                  ) : (
                    favorites.slice(0, 4).map((memory) => (
                      <Link
                        key={memory.id}
                        href={`/memory/${memory.id}`}
                        className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-aurora-2/10"
                      >
                        <MemoryTypeIcon type={memory.type} />
                        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                          {memory.title}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {topTags.length > 0 && (
                <div className={`${cardClass} p-5`}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-sm font-semibold tracking-tight">
                      Top tags
                    </h2>
                    <Hash className="size-4 text-aurora-2" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {topTags.map((t) => (
                      <Link
                        key={t.name}
                        href="/search"
                        className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-card/70 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-aurora-2/40 hover:text-foreground"
                      >
                        {t.name}
                        <span className="text-muted-foreground/60">{t.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {!answer && (
        <p className="pt-1 text-xs text-muted-foreground">
          {recent[0]
            ? `Last capture ${timeAgo(recent[0].createdAt)}`
            : "No captures yet"}{" "}
          · prototype data stored locally
          {asked > 0 ? ` · ${asked} questions asked` : ""}
        </p>
      )}
    </div>
  );
}

function FeedRow({ memory, last }: { memory: Memory; last: boolean }) {
  return (
    <Link
      href={`/memory/${memory.id}`}
      className={`group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-card/50 ${
        !last ? "border-b border-border/40" : ""
      }`}
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
      <ArrowRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
    </Link>
  );
}