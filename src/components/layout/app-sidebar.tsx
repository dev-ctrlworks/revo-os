"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  Home,
  Library,
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

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: Library },
  { href: "/collections", label: "Collections", icon: LayoutGrid },
  { href: "/connections", label: "Connections", icon: Network },
  { href: "/timeline", label: "Timeline", icon: Clock3 },
];

type IconType = React.ComponentType<{ className?: string }>;

function Logo({ expanded }: { expanded: boolean }) {
  return (
    <Link
      href="/dashboard"
      className="flex select-none items-center gap-2.5"
      aria-label="Revo OS home"
    >
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <BrainCircuit className="size-4" />
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
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={!expanded ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
        !expanded && "justify-center",
        active
          ? "bg-lavender text-lavender-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      )}
    >
      <span
        className={cn(
          "absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
          active ? "opacity-100" : "opacity-0"
        )}
      />
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg",
          active ? "text-lavender-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        <Icon className="size-[17px]" />
      </span>
      {expanded && <span className="ml-3 truncate">{label}</span>}
    </Link>
  );
}

function CaptureButton({
  expanded,
  onNavigate,
}: {
  expanded: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/capture"
      onClick={onNavigate}
      aria-label="Capture a memory"
      className={cn(
        "mb-4 flex items-center gap-2 rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover",
        expanded ? "px-3 py-2.5" : "justify-center px-0 py-2.5"
      )}
    >
      <Plus className="size-4 shrink-0" />
      {expanded && <span>Capture</span>}
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
      <CaptureButton expanded={expanded} onNavigate={onNavigate} />

      <nav className="mb-6 flex flex-col gap-1">
        {PRIMARY_NAV.map((item) => (
          <NavItem
            key={item.href}
            {...item}
            onNavigate={onNavigate}
            expanded={expanded}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-border pt-3">
        <NavItem
          href="/ask"
          label="Ask"
          icon={Search}
          onNavigate={onNavigate}
          expanded={expanded}
        />
        <NavItem
          href="/settings"
          label="Settings"
          icon={Settings}
          onNavigate={onNavigate}
          expanded={expanded}
        />
        {expanded ? (
          <div className="flex items-center gap-2.5 rounded-xl bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
            <span className="size-1.5 shrink-0 rounded-full bg-success" />
            <span className="truncate">{memories.length} memories · saved locally</span>
          </div>
        ) : (
          <div
            className="flex justify-center rounded-xl py-2.5"
            title={`${memories.length} memories · saved locally`}
          >
            <span className="size-1.5 rounded-full bg-success" />
          </div>
        )}
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-border bg-sidebar lg:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
          <Logo expanded />
        </div>
        <NavBody expanded />
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
          <SheetHeader className="h-14 items-start justify-center border-b border-border px-4">
            <SheetTitle className="flex w-auto items-center gap-2.5">
              <Logo expanded />
            </SheetTitle>
          </SheetHeader>
          <NavBody expanded onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
