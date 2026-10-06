"use client";

import { Search } from "lucide-react";

export function CommandPaletteTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("revoos:open-palette"))}
      className="flex w-full items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-left text-[13px] text-muted-foreground transition-all hover:border-border hover:bg-card hover:text-foreground"
      aria-label="Open command palette"
    >
      <Search className="size-3.5 shrink-0" />
      <span className="flex-1 truncate">Search memories…</span>
      <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-border/70 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium sm:flex">
        <span>⌘</span>
        <span>K</span>
      </kbd>
    </button>
  );
}