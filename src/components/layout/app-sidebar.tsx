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
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useMemoryStore } from "@/lib/use-memory-store";

const groups = [
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

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 select-none" aria-label="Revo OS home">
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-xl brand-gradient shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--aurora-2)_65%,transparent)]">
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/20 ring-inset" />
        <BrainCircuit className="size-4 text-white" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight">Revo OS</span>
        <span className="text-[10px] text-muted-foreground">memory layer</span>
      </span>
    </Link>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all",
        active
          ? "brand-gradient text-white shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)]"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-aurora-2 opacity-0 transition-opacity group-hover:opacity-60" />
      <Icon className={cn("size-[18px] shrink-0", active ? "text-white" : "text-aurora-2/70")} />
      {label}
      {active && pathname !== "/" && (
        <span className="ml-auto size-1 rounded-full bg-white/70" />
      )}
    </Link>
  );
}

function NavBody({ onNavigate }: { onNavigate?: () => void }) {
  const memories = useMemoryStore();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
      {groups.map((group) => (
        <div key={group.label} className="mb-5">
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {group.label}
          </p>
          <nav className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavItem key={item.href} {...item} onNavigate={onNavigate} />
            ))}
          </nav>
        </div>
      ))}

      <div className="mt-auto space-y-1 border-t border-border/60 pt-3">
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          {memories.length} memories · synced
        </div>
        <NavItem href="/settings" label="Settings" icon={Settings} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card/60 backdrop-blur-xl lg:flex">
        <div className="flex h-14 items-center border-b border-border/60 px-4">
          <Logo />
        </div>
        <NavBody />
        <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5">
          <span className="text-[10px] text-muted-foreground">revo.app</span>
          <ThemeToggle />
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-4 z-40 size-9 lg:hidden"
              aria-label="Open menu"
            />
          }
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="h-14 items-start justify-center border-b border-border/60 px-4">
            <SheetTitle className="flex w-auto items-center gap-2.5">
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <NavBody onNavigate={() => setOpen(false)} />
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5">
            <span className="text-[10px] text-muted-foreground">revo.app</span>
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}