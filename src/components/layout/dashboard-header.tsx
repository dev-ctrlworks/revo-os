"use client";

import { CommandPaletteTrigger } from "@/components/command/command-palette-trigger";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemoryStore } from "@/lib/use-memory-store";

export function DashboardHeader() {
  const memories = useMemoryStore();
  const count = memories.length;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-border/50 bg-card/60 pl-14 pr-4 backdrop-blur-xl sm:pr-6 lg:pl-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aurora-2/50 to-transparent" />
      <div className="flex w-full items-center gap-3 lg:ml-0 lg:w-auto lg:min-w-0">
        <span className="aurora-text shrink-0 text-sm font-display font-semibold tracking-tight lg:hidden">
          Revo OS
        </span>
        <div className="w-full lg:w-72">
          <CommandPaletteTrigger />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge
          variant="secondary"
          className="hidden rounded-full text-[11px] font-medium text-muted-foreground sm:inline-flex"
          title="Your memory layer is stored locally and up to date"
        >
          <span className="relative mr-1.5 inline-flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          {count} memories · synced
        </Badge>
        <Link
          href="/capture"
          aria-label="Capture a memory"
          className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background/50 text-foreground backdrop-blur transition-all hover:bg-muted sm:hidden"
        >
          <Plus className="size-4" />
        </Link>
        <Link
          href="/capture"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/50 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur hover:bg-muted hover:text-foreground transition-all"
        >
          <Plus className="size-3.5" />
          Capture
        </Link>
      </div>
    </header>
  );
}