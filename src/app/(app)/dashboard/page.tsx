"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Flame, MessageCircleQuestion, Sparkles, Inbox } from "lucide-react";
import type { AIAnswer, Memory } from "@/lib/types";
import { useMemoryStore } from "@/lib/use-memory-store";
import { timeAgo } from "@/lib/utils-format";
import { exampleQueries } from "@/lib/mock-data";
import { AISearchBar } from "@/components/ai/ai-search-bar";
import { AIAnswerView } from "@/components/ai/ai-answer";
import { MemoryCard } from "@/components/memories/memory-card";
import { MemoryTypeIcon, memoryTypeLabel } from "@/components/memories/memory-type-icon";
import { Card } from "@/components/ui/card";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Night owl";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function bucketLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, now)) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (same(d, yesterday)) return "Yesterday";
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  if (d > weekAgo) return "This week";
  return "Earlier";
}

export default function DashboardPage() {
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  const [asked, setAsked] = useState(0);
  const memories = useMemoryStore();

  const recent = useMemo(
    () =>
      [...memories]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 8),
    [memories]
  );

  const feed = useMemo(() => {
    const buckets: { label: string; items: Memory[] }[] = [];
    for (const memory of recent) {
      const label = bucketLabel(memory.createdAt);
      const bucket = buckets.find((b) => b.label === label);
      if (bucket) bucket.items.push(memory);
      else buckets.push({ label, items: [memory] });
    }
    return buckets;
  }, [recent]);

  const favorites = useMemo(
    () => memories.filter((m) => m.favorite).slice(0, 4),
    [memories]
  );

  const todayCount = memories.filter(
    (m) => new Date(m.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const suggestions = exampleQueries.map((q) => ({ label: q, query: q }));

  const isEmpty = memories.length === 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-6 sm:px-6 sm:py-8">
      <section>
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/55 px-3 py-1 text-xs font-bold uppercase tracking-widest text-aurora-2 shadow-sm backdrop-blur-xl">
          <Sparkles className="size-3.5 text-aurora-2" />
          {greeting()} ·{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              What do you <span className="text-gradient">remember?</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ask in plain language. Revo OS searches{" "}
              {memories.length.toLocaleString()} memories and answers with sources
              you can open.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <AISearchBar
            big
            suggestions={suggestions}
            onAnswer={(a) => {
              setAnswer(a);
              setAsked((n) => n + 1);
            }}
          />
        </div>
      </section>

      {answer && (
        <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="animate-fade-up">
            <AIAnswerView answer={answer} />
          </div>
          <aside className="space-y-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Around this answer
            </p>
            <div className="flex flex-wrap gap-1.5">
              {answer.sources.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/55 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-xl"
                >
                  {s.title}
                </span>
              ))}
            </div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground pt-2">
              Recent captures
            </p>
            <div className="space-y-2">
              {recent.slice(0, 3).map((memory) => (
                <MemoryCard key={memory.id} memory={memory} compact />
              ))}
            </div>
          </aside>
        </section>
      )}

      {!answer && !isEmpty && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: CalendarDays,
              label: "Today",
              value: String(todayCount),
              hint: "new captures today",
            },
            { icon: Flame, label: "Streak", value: "12 days", hint: "captures in a row" },
            {
              icon: Sparkles,
              label: "Curated",
              value: memories.length.toLocaleString(),
              hint: "memories auto-grouped",
            },
            {
              icon: MessageCircleQuestion,
              label: "Asked",
              value: String(asked),
              hint: "questions this session",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50 bg-card/55 p-5 shadow-[0_10px_30px_-22px_rgba(30,27,46,0.3)] backdrop-blur-xl">
              <div className="mb-2 flex size-8 items-center justify-center rounded-lg icon-chip">
                <stat.icon className="size-4 text-aurora-2" />
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

      {!answer && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight">Memory feed</h2>
            <span className="text-xs text-muted-foreground">
              {recent.length} most recent
            </span>
          </div>

          {isEmpty ? (
            <Card className="border-dashed border-border/50 bg-card/40 p-10 text-center backdrop-blur-xl">
              <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl icon-chip">
                <Inbox className="size-6 text-aurora-2" />
              </span>
              <p className="font-display text-lg font-semibold tracking-tight">
                No memories yet
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Capture your first screenshot, note, or link and it will appear
                here — connected and ready to ask about.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {feed.map((bucket) => (
                <div key={bucket.label}>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
                    {bucket.label} · {bucket.items.length}
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl">
                    {bucket.items.map((memory, i) => (
                      <FeedRow
                        key={memory.id}
                        memory={memory}
                        last={i === bucket.items.length - 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {!answer && favorites.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight">★ Favorites</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} compact />
            ))}
          </div>
        </section>
      )}

      <p className="pt-2 text-xs text-muted-foreground">
        {recent[0] ? `Last capture ${timeAgo(recent[0].createdAt)}` : "No captures yet"} ·
        prototype data stored locally
      </p>
    </div>
  );
}

function FeedRow({ memory, last }: { memory: Memory; last: boolean }) {
  return (
    <a
      href={`/memory/${memory.id}`}
      className={`flex items-center gap-3 bg-transparent px-4 py-3 transition-colors hover:bg-card/50 ${
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
    </a>
  );
}