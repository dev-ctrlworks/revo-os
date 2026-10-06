"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Flame, Sparkles } from "lucide-react";
import type { AIAnswer } from "@/lib/types";
import { useMemoryStore } from "@/lib/use-memory-store";
import { timeAgo } from "@/lib/utils-format";
import { AISearchBar } from "@/components/ai/ai-search-bar";
import { AIAnswerView } from "@/components/ai/ai-answer";
import { MemoryCard } from "@/components/memories/memory-card";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  const memories = useMemoryStore();

  const recent = useMemo(
    () =>
      [...memories]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 6),
    [memories]
  );

  const favorites = useMemo(
    () => memories.filter((m) => m.favorite).slice(0, 4),
    [memories]
  );

  const todayCount = memories.filter(
    (m) => new Date(m.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-10">
      <section className="pt-4 sm:pt-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-indigo-500">
          Revo OS memory
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          What do you <span className="animate-gradient-x bg-gradient-to-r from-indigo-500 via-sky-400 to-cyan-400 bg-clip-text text-transparent">remember?</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Ask in plain language. Revo OS searches {memories.length} memories and
          answers with sources you can open.
        </p>

        <div className="mt-8">
          <AISearchBar big onAnswer={setAnswer} />
        </div>
      </section>

      {answer && (
        <section className="animate-fade-up max-w-3xl">
          <AIAnswerView answer={answer} />
        </section>
      )}

      {!answer && (
        <section className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: CalendarDays,
              label: "Today",
              value: todayCount,
              hint: "new captures today",
            },
            {
              icon: Flame,
              label: "Streak",
              value: "12 days",
              hint: "captures in a row",
            },
            {
              icon: Sparkles,
              label: "Curated",
              value: `${memories.length} memories`,
              hint: "across auto-grouped collections",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50 p-5">
              <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-cyan-400/15">
                <stat.icon className="size-4 text-indigo-500" />
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
            </Card>
          ))}
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight">
            Recent memories
          </h2>
          <span className="text-xs text-muted-foreground">
            {recent.length} of {memories.length}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      </section>

      {favorites.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight">
            ★ Favorites
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} compact />
            ))}
          </div>
        </section>
      )}

      <p className="pt-4 text-xs text-muted-foreground">
        Last capture {recent[0] ? timeAgo(recent[0].createdAt) : ""} · prototype
        data stored locally
      </p>
    </div>
  );
}