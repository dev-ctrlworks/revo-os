"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  Home,
  LayoutGrid,
  Plus,
  Search,
  Settings,
  Clock3,
  BrainCircuit,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMemoryStore } from "@/lib/use-memory-store";

const GROUPS = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Home", icon: Home },
      { href: "/search", label: "Search", icon: Search },
      { href: "/capture", label: "Capture", icon: Plus },
    ],
  },
  {
    label: "Organize",
    items: [
      { href: "/timeline", label: "Timeline", icon: Clock3 },
      { href: "/collections", label: "Collections", icon: LayoutGrid },
      { href: "/graph", label: "Memory Graph", icon: Network },
    ],
  },
];

type IconType = React.ComponentType<{ className?: string }>;

function Logo({ expanded }: { expanded: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 select-none"
      aria-label="Revo OS home"
    >
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-xl brand-gradient shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--aurora-2)_65%,transparent)]">
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/20 ring-inset" />
        <BrainCircuit className="size-4 text-white" />
      </span>
      {expanded && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight">Revo OS</span>
          <span className="text-[10px] text-muted-foreground">memory layer</span>
        </span>
      )}
    </Link>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  onNavigate,
  expanded,
}: {
  href: string;
  label: string;
  icon: IconType;
  onNavigate?: () => void;
  expanded: boolean;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={!expanded ? label : undefined}
      className={cn(
        "group relative flex items-center rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200",
        !expanded && "justify-center",
        active
          ? "bg-gradient-to-r from-aurora-2/15 to-aurora-3/15 text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--aurora-2)_28%,transparent),0_10px_26px_-16px_color-mix(in_oklab,var(--aurora-2)_65%,transparent)]"
          : "text-muted-foreground hover:bg-aurora-2/10 hover:text-foreground"
      )}
    >
      <span
        className={cn(
          "absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-aurora-2 transition-opacity",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
        )}
      />
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
          active ? "bg-aurora-2/15" : "group-hover:bg-aurora-2/10"
        )}
      >
        <Icon
          className={cn(
            "size-[17px] transition-colors",
            active ? "text-aurora-2" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
      </span>
      {expanded && <span className="ml-3 truncate">{label}</span>}
      {expanded && active && pathname !== "/" && (
        <span className="ml-auto size-1.5 rounded-full bg-aurora-2 shadow-[0_0_8px_var(--aurora-2)]" />
      )}
    </Link>
  );
}

function NavBody({
  expanded,
  onNavigate,
}: {
  expanded: boolean;
  onNavigate?: () => void;
}) {
  const memories = useMemoryStore();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-3 py-4">
      {GROUPS.map((group) => (
        <div key={group.label} className={expanded ? "mb-6" : "mb-4"}>
          {expanded && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {group.label}
            </p>
          )}
          <nav className="flex flex-col gap-1.5">
            {group.items.map((item) => (
              <NavItem
                key={item.href}
                {...item}
                onNavigate={onNavigate}
                expanded={expanded}
              />
            ))}
          </nav>
        </div>
      ))}

      <div className="mt-auto space-y-2 border-t border-border/50 pt-3">
        {expanded ? (
          <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/50 px-3 py-2.5 text-xs text-muted-foreground">
            <span className="relative flex size-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="truncate">{memories.length} memories · synced</span>
          </div>
        ) : (
          <div
            className="flex justify-center rounded-xl py-2.5"
            title={`${memories.length} memories · synced`}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
          </div>
        )}
        <NavItem
          href="/settings"
          label="Settings"
          icon={Settings}
          onNavigate={onNavigate}
          expanded={expanded}
        />
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <aside
        data-expanded={expanded}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden shrink-0 flex-col overflow-hidden border-r border-border/50 backdrop-blur-xl transition-[width] duration-300 ease-in-out lg:flex",
          expanded
            ? "w-64 bg-card/85 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)]"
            : "w-[76px] bg-card/60"
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-aurora-2/25 to-transparent" />
        <div
          className={cn(
            "flex h-14 items-center border-b border-border/50",
            expanded ? "px-4" : "justify-center px-0"
          )}
        >
          <Logo expanded={expanded} />
        </div>
        <NavBody expanded={expanded} />
        <div
          className={cn(
            "flex items-center justify-center border-t border-border/50 py-2.5",
            expanded ? "px-3" : "px-0"
          )}
        >
          <span className="text-[10px] text-muted-foreground">
            {expanded ? "revo.app" : "•"}
          </span>
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-3 z-40 size-10 lg:hidden"
              aria-label="Open menu"
            />
          }
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="h-14 items-start justify-center border-b border-border/50 px-4">
            <SheetTitle className="flex w-auto items-center gap-2.5">
              <Logo expanded />
            </SheetTitle>
          </SheetHeader>
          <NavBody expanded onNavigate={() => setOpen(false)} />
          <div className="flex items-center justify-center border-t border-border/50 px-4 py-2.5">
            <span className="text-[10px] text-muted-foreground">revo.app</span>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
