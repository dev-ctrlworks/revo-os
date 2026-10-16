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
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-border bg-background pl-14 pr-4 sm:pr-6 lg:pl-6">
      <div className="flex w-full items-center gap-3 lg:ml-0 lg:w-auto lg:min-w-0">
        <span className="shrink-0 text-sm font-display font-semibold tracking-tight lg:hidden">
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
          title="Captured memories are stored in this browser"
        >
          <span className="mr-1.5 inline-flex size-1.5 rounded-full bg-success" />
          {count} memories · saved locally
        </Badge>
        <Link
          href="/capture"
          aria-label="Capture a memory"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">Capture</span>
        </Link>
      </div>
    </header>
  );
}