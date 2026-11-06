"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import type { Memory, MemoryType } from "@/lib/types";
import { MEMORY_TYPES } from "@/features/memories/schema";
import { toggleFavoriteAction } from "@/features/memories/actions";
import { memoryTypeLabel } from "@/lib/memory-type";
import { MemoryCard } from "@/components/memories/memory-card";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ToastViewport, useToasts } from "@/components/layout/toasts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimelineClientProps {
  memories: Memory[];
}

const TYPE_OPTIONS: Record<string, string> = {
  all: "All types",
  ...Object.fromEntries(MEMORY_TYPES.map((type) => [type, memoryTypeLabel(type)])),
};

interface DayGroup {
  key: string;
  label: string;
  memories: Memory[];
}

interface MonthGroup {
  key: string;
  label: string;
  days: DayGroup[];
}

function dayLabel(date: Date, now: Date): string {
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const diff = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  const options: Intl.DateTimeFormatOptions =
    date.getFullYear() === now.getFullYear()
      ? { weekday: "long", month: "long", day: "numeric" }
      : { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

/** Groups memories into month -> day buckets, newest first. */
function groupByDay(memories: Memory[]): MonthGroup[] {
  const now = new Date();
  const months: MonthGroup[] = [];
  const dayIndex = new Map<string, DayGroup>();

  for (const memory of memories) {
    const date = new Date(memory.createdAt);
    const valid = !Number.isNaN(date.getTime());
    const dayKey = valid ? date.toDateString() : "unknown-date";
    const monthKey = valid
      ? `${date.getFullYear()}-${date.getMonth()}`
      : "unknown-date";

    let day = dayIndex.get(dayKey);
    if (!day) {
      let month = months[months.length - 1];
      if (!month || month.key !== monthKey) {
        month = {
          key: monthKey,
          label: valid
            ? date.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })
            : "Unknown date",
          days: [],
        };
        months.push(month);
      }
      day = {
        key: dayKey,
        label: valid ? dayLabel(date, now) : "Unknown date",
        memories: [],
      };
      month.days.push(day);
      dayIndex.set(dayKey, day);
    }
    day.memories.push(memory);
  }

  return months;
}

export function TimelineClient({ memories }: TimelineClientProps) {
  const router = useRouter();
  const { toasts, push, dismiss } = useToasts();
  const [typeFilter, setTypeFilter] = useState<MemoryType | "">("");

  const filtered = useMemo(
    () => (typeFilter ? memories.filter((m) => m.type === typeFilter) : memories),
    [memories, typeFilter]
  );

  const months = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => {
      const at = Date.parse(a.createdAt);
      const bt = Date.parse(b.createdAt);
      const av = Number.isNaN(at) ? -Infinity : at;
      const bv = Number.isNaN(bt) ? -Infinity : bt;
      return bv - av;
    });
    return groupByDay(sorted);
  }, [filtered]);

  async function handleToggleFavorite(memory: Memory) {
    const result = await toggleFavoriteAction(memory.id, !memory.favorite);
    if (!result.ok) {
      push(result.error ?? "Could not update the memory.", "error");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Timeline"
        description={
          memories.length === 0
            ? "Your memories, newest first."
            : `${memories.length} ${memories.length === 1 ? "memory" : "memories"}`
        }
        actions={
          <Select
            items={TYPE_OPTIONS}
            value={typeFilter || "all"}
            onValueChange={(value) =>
              setTypeFilter(value === "all" ? "" : (value as MemoryType))
            }
          >
            <SelectTrigger
              aria-label="Filter by type"
              className="app-control h-10 min-w-[9.5rem] justify-between border-border bg-background px-3 text-foreground data-[size=default]:h-10"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="app-control p-1 shadow-[0_12px_32px_-16px_rgba(33,22,76,0.35)]">
              {Object.entries(TYPE_OPTIONS).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="rounded-[10px] py-2 pl-2.5 data-highlighted:bg-primary/8 data-selected:font-medium"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {memories.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No memories yet"
          description="Capture your first memory and it will appear here, newest first."
          action={
            <Button render={<Link href="/capture" />}>Capture a memory</Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={`No ${memoryTypeLabel(typeFilter as MemoryType)} memories`}
          description="Nothing of that type yet. Try another type."
          action={
            <Button variant="outline" onClick={() => setTypeFilter("")}>
              Clear filter
            </Button>
          }
        />
      ) : (
        <div className="relative">
          <span
            aria-hidden
            className="absolute bottom-4 left-3 top-4 w-px bg-gradient-to-b from-primary/40 via-border to-transparent"
          />
          <div className="space-y-8">
            {months.map((month) => (
              <section key={month.key} className="space-y-5">
                <h2 className="pl-9 font-display text-xs font-semibold tracking-wide text-heading uppercase">
                  {month.label}
                </h2>
                <div className="space-y-5">
                  {month.days.map((day) => (
                    <div
                      key={day.key}
                      className="grid grid-cols-[24px_1fr] gap-x-3"
                    >
                      <div className="relative flex justify-center pt-1.5">
                        <span className="size-3 rounded-full bg-primary ring-4 ring-background" />
                      </div>
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h3 className="app-h3">
                            {day.label}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {day.memories.length}{" "}
                            {day.memories.length === 1 ? "memory" : "memories"}
                          </span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {day.memories.map((memory) => (
                            <MemoryCard
                              key={memory.id}
                              memory={memory}
                              onToggleFavorite={handleToggleFavorite}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
