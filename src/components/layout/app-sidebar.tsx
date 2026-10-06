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
  SlidersHorizontal,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/capture", label: "Capture", icon: Plus },
  { href: "/collections", label: "Collections", icon: LayoutGrid },
  { href: "/graph", label: "Memory Graph", icon: Network },
  { href: "/timeline", label: "Timeline", icon: Clock3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 select-none" aria-label="Revo OS home">
      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 shadow-lg shadow-indigo-500/25">
        <span className="absolute inset-0 rounded-xl ring-1 ring-white/20 ring-inset" />
        <BrainCircuit className="size-4 text-white" />
      </span>
      {!collapsed && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight">Revo OS</span>
          <span className="text-[10px] text-muted-foreground">memory layer</span>
        </span>
      )}
    </Link>
  );
}

function NavLinks({
  collapsed,
  setOpen,
}: {
  collapsed?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        const icon = <item.icon className="size-[18px]" />;
        const label = (
          <span className="text-[13px] font-medium">{item.label}</span>
        );
        if (collapsed) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={<Link href={item.href} onClick={() => setOpen?.(false)} />}
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl transition-all",
                  active
                    ? "bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/25"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {icon}
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen?.(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 transition-all",
              active
                ? "bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/25"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {icon}
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-16 shrink-0 flex-col border-r border-border/40 bg-card/60 backdrop-blur-xl lg:flex">
        <div className="flex h-14 items-center justify-center border-b border-border/40">
          <Logo collapsed />
        </div>
        <div className="flex flex-1 flex-col py-4">
          <NavLinks collapsed />
        </div>
        <div className="border-t border-border/40 p-3">
          <Tooltip>
            <TooltipTrigger
              render={<Link href="/settings" />}
              className="flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <SlidersHorizontal className="size-[18px]" />
            </TooltipTrigger>
            <TooltipContent side="right">Open settings</TooltipContent>
          </Tooltip>
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
        <SheetContent side="left" className="w-70 p-0">
          <SheetHeader className="h-14 items-start justify-center border-b border-border/40 px-4">
            <SheetTitle className="flex w-auto items-center gap-2.5">
              <span className="relative flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 shadow-lg shadow-indigo-500/25">
                <span className="absolute inset-0 rounded-xl ring-1 ring-white/20 ring-inset" />
                <BrainCircuit className="size-4 text-white" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-semibold tracking-tight">Revo OS</span>
                <span className="text-[10px] text-muted-foreground">memory layer</span>
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="pt-3">
            <NavLinks setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}