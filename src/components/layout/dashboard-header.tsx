"use client";

import { CommandPaletteTrigger } from "@/components/command/command-palette-trigger";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemoryStore } from "@/lib/use-memory-store";

export function DashboardHeader() {
  const memories = useMemoryStore();
  const count = memories.length;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-card/60 px-4 backdrop-blur-2xl sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="flex items-center gap-3 lg:hidden">
        <span className="text-gradient text-sm font-semibold tracking-tight">Revo OS</span>
      </div>

      <div className="ml-10 hidden w-full max-w-md lg:block lg:ml-0">
        <CommandPaletteTrigger />
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
        <Button size="sm" className="hidden sm:inline-flex" render={<Link href="/capture" />} nativeButton={false}>
          <Plus className="mr-1.5 size-3.5" />
          Capture
        </Button>
        <Avatar className="size-8">
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-cyan-400 text-[10px] font-semibold text-white">
            BR
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}