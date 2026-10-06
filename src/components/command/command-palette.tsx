"use client";

import { Command as CommandPrimitive } from "cmdk";
import {
  ArrowUpRight,
  CalendarDays,
  Camera,
  Clock3,
  Home,
  LayoutGrid,
  Network,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useMemoryStore } from "@/lib/use-memory-store";
import { timeAgo } from "@/lib/utils-format";

const navigation = [
  { group: "Navigate", items: [
    { id: "nav-home", label: "Home", icon: Home, href: "/dashboard" },
    { id: "nav-search", label: "Search memories", icon: Search, href: "/search" },
    { id: "nav-capture", label: "Capture new memory", icon: Camera, href: "/capture" },
    { id: "nav-collections", label: "Collections", icon: LayoutGrid, href: "/collections" },
    { id: "nav-graph", label: "Memory Graph", icon: Network, href: "/graph" },
    { id: "nav-timeline", label: "Timeline", icon: Clock3, href: "/timeline" },
    { id: "nav-settings", label: "Settings", icon: Settings, href: "/settings" },
  ]},
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const memories = useMemoryStore();

  useEffect(() => {
    function down(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    function openPalette() {
      setOpen(true);
    }
    document.addEventListener("keydown", down);
    window.addEventListener("revoos:open-palette", openPalette);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("revoos:open-palette", openPalette);
    };
  }, []);

  const searchResults = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return memories
      .map((m) => {
        const haystack = `${m.title} ${m.content} ${m.tags.join(" ")} ${m.collection}`.toLowerCase();
        const score = tokens.filter((t) => haystack.includes(t)).length;
        return { memory: m, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((item) => item.memory);
  }, [query, memories]);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandPrimitive shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search memories or jump to…"
          className="h-12 text-sm"
        />
        <CommandList className="max-h-[420px]">
          {query.trim() && (
            <>
              {searchResults.length === 0 && (
                <CommandEmpty>
                  <div className="py-8 text-center">
                    <Sparkles className="mx-auto mb-3 size-5 text-indigo-400" />
                    <p className="text-sm font-medium">No memories found</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try a different phrase or browse the timeline.
                    </p>
                  </div>
                </CommandEmpty>
              )}
              {searchResults.length > 0 && (
                <CommandGroup heading="Memories">
                  {searchResults.map((m) => (
                    <CommandItem
                      key={m.id}
                      value={m.id}
                      onSelect={() => navigate(`/memory/${m.id}`)}
                      className="flex items-center gap-3"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 text-[10px] font-bold text-indigo-500">
                        {m.type[0].toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{m.title}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          {m.collection} · {timeAgo(m.createdAt)}
                        </span>
                      </span>
                      <ArrowUpRight className="size-3.5 text-muted-foreground/50" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandSeparator />
            </>
          )}
          {(!query.trim() || searchResults.length > 0) && (
            <CommandGroup heading="Navigate">
              {navigation[0].items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => navigate(item.href)}
                  className="flex items-center gap-3"
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {!query.trim() && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Quick actions">
                <CommandItem
                  value="new"
                  onSelect={() => navigate("/capture")}
                  className="flex items-center gap-3"
                >
                  <Plus className="size-4 text-muted-foreground" />
                  <span className="text-sm">Capture a new memory</span>
                </CommandItem>
                <CommandItem
                  value="today"
                  onSelect={() => navigate("/timeline")}
                  className="flex items-center gap-3"
                >
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <span className="text-sm">Jump to today</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandPrimitive>
    </CommandDialog>
  );
}

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CommandPalette />
    </>
  );
}