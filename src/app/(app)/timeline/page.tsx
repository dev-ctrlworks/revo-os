"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, Clock3, Filter } from "lucide-react";
import type { MemoryType } from "@/lib/types";
import { useMemoryStore } from "@/lib/use-memory-store";
import { groupMemoriesByDate } from "@/lib/ai";
import { formatDate } from "@/lib/utils-format";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MemoryCard } from "@/components/memories/memory-card";
import { cn } from "@/lib/utils";

const typeFilters: Array<{ value: MemoryType | "all"; label: string }> = [
  { value: "all", label: "All types" },
  { value: "screenshot", label: "Screenshots" },
  { value: "note", label: "Notes" },
  { value: "link", label: "Links" },
  { value: "document", label: "Documents" },
  { value: "discussion", label: "Conversations" },
  { value: "email", label: "Emails" },
  { value: "image", label: "Images" },
];

export default function TimelinePage() {
  const [activeType, setActiveType] = useState<MemoryType | "all">("all");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const memories = useMemoryStore();

  const groups = useMemo(() => {
    const filtered =
      activeType === "all"
        ? memories
        : memories.filter((m) => m.type === activeType);
    return groupMemoriesByDate(filtered);
  }, [activeType, memories]);

  function toggleDate(dateKey: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(dateKey)) next.delete(dateKey);
      else next.add(dateKey);
      return next;
    });
  }

  const totalMemories = groups.reduce((sum, g) => sum + g.memories.length, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-cyan-400/15">
              <Clock3 className="size-4 text-indigo-500" />
            </span>
            <span className="text-gradient">Timeline</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalMemories} memories · every fragment, in order.
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="rounded-lg" />}>
              <Filter className="mr-1.5 size-3.5" />
              {typeFilters.find((f) => f.value === activeType)?.label}
              <ChevronDown className="ml-1.5 size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {typeFilters.map((filter) => (
                <DropdownMenuCheckboxItem
                  key={filter.value}
                  checked={activeType === filter.value}
                  onCheckedChange={() =>
                    setActiveType(filter.value as MemoryType | "all")
                  }
                >
                  {filter.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative space-y-8 pl-6">
        <div className="absolute bottom-2 left-[9px] top-2 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        {groups.map((group) => {
          const isOpen = expanded.has(group.date);
          const dayMemories = isOpen ? group.memories : group.memories.slice(0, 2);
          return (
            <section key={group.date} className="relative">
              <button
                type="button"
                onClick={() => toggleDate(group.date)}
                className="group mb-3 flex items-center gap-3 text-left"
              >
                <span className="absolute -left-6 mt-1.5 flex size-[18px] items-center justify-center rounded-full border border-border bg-card shadow-sm">
                  <span className="size-1.5 rounded-full bg-indigo-500" />
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays className="size-3.5 text-muted-foreground" />
                  {formatDate(group.date)}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {group.memories.length}
                </span>
                {group.memories.length > 2 && (
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                    {isOpen ? "Show less" : "Expand all"}
                    <ChevronDown
                      className={cn(
                        "size-3 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </span>
                )}
              </button>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dayMemories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} compact />
                ))}
              </div>
            </section>
          );
        })}

        {groups.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 py-16 text-center">
            <p className="text-base font-semibold">No memories match</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Try broadening the type filter.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
        <Badge variant="secondary" className="rounded-full text-[10px]">
          {typeFilters.find((f) => f.value === activeType)?.label}
        </Badge>
        <span>
          {totalMemories} memories · source: mock data, no backend
        </span>
      </div>
    </div>
  );
}