"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  GitCompare,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  ListOrdered,
  Mail,
  Menu,
  Newspaper,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { marketingNav, type MarketingNavItem } from "./content";

/**
 * Small icon in a pastel tile per dropdown item so the menus read less flat.
 * Each uses a soft accent background with the matching deep tone for the glyph.
 */
const navIcons: Record<string, { icon: LucideIcon; bg: string; color: string }> = {
  Overview: { icon: LayoutDashboard, bg: "bg-lavender/60", color: "text-primary" },
  Features: { icon: Layers, bg: "bg-sky/60", color: "text-sky-deep" },
  "How it works": { icon: ListOrdered, bg: "bg-amber/60", color: "text-amber-deep" },
  "Use case": { icon: LayoutGrid, bg: "bg-pink/60", color: "text-magenta-deep" },
  Documentation: { icon: BookOpen, bg: "bg-teal/60", color: "text-teal-deep" },
  Blogs: { icon: Newspaper, bg: "bg-coral/60", color: "text-coral-deep" },
  Help: { icon: CircleHelp, bg: "bg-lime/60", color: "text-lime-deep" },
  Compare: { icon: GitCompare, bg: "bg-periwinkle/60", color: "text-periwinkle-deep" },
  Contact: { icon: Mail, bg: "bg-rose/60", color: "text-rose-deep" },
};

export function BrandMark({
  href = "/",
  label = "Revo OS home",
  className,
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("flex items-center gap-2.5", className)}
    >
      <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-sm">
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 to-transparent" />
        <BrainCircuit className="relative size-4" />
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight text-heading">
        Revo OS
      </span>
    </Link>
  );
}

function NavItem({
  item,
  className,
  onNavigate,
}: {
  item: MarketingNavItem;
  className: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const go = (href: string) => {
    onNavigate?.();
    if (href.startsWith("#")) {
      // The menu's scroll guard restores scroll while it is mounted, so wait
      // for the popup to close and release before jumping to the section.
      window.setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } else {
      router.push(href);
    }
  };

  if (item.children?.length) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          openOnHover
          delay={140}
          closeDelay={160}
          className={cn(
            "flex items-center gap-1 rounded-full transition-colors hover:bg-secondary hover:text-heading data-[popup-open]:bg-secondary data-[popup-open]:text-heading",
            className
          )}
        >
          {item.label}
          <ChevronDown className="size-3.5 opacity-60 transition-transform duration-200 data-[popup-open]:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={10}
          className="min-w-72 sm:min-w-80 max-w-(--available-width) rounded-2xl border border-primary/10 p-2 shadow-[0_24px_60px_-24px_rgba(89,46,255,0.5)] ring-primary/15"
        >
          {item.children.map((child) => {
            const entry = navIcons[child.label];
            const Icon = entry.icon;
            return (
              <DropdownMenuItem
                key={child.href}
                onClick={() => go(child.href)}
                className="gap-3 rounded-xl px-3 py-2 focus:bg-primary/10 focus:text-primary"
              >
                {entry ? (
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-lg p-1.5",
                      entry.bg
                    )}
                  >
                    <Icon className={cn("size-4", entry.color)} />
                  </span>
                ) : null}
                <span className="flex min-w-0 flex-col gap-0.5 text-left">
                  <span className="text-sm font-medium leading-tight">
                    {child.label}
                  </span>
                  <span className="text-xs leading-tight text-muted-foreground">
                    {child.desc}
                  </span>
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return item.href.startsWith("#") ? (
    <a
      href={item.href}
      onClick={onNavigate}
      className={className}
    >
      {item.label}
    </a>
  ) : (
    <Link href={item.href} onClick={onNavigate} className={className}>
      {item.label}
    </Link>
  );
}

export function MarketingNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1120px] items-center justify-between gap-3 rounded-[40px] border border-border/70 bg-white/80 px-3 py-2 backdrop-blur-xl transition-shadow duration-300 sm:px-4",
          scrolled
            ? "shadow-[0_14px_40px_-24px_rgba(33,22,76,0.35)]"
            : "shadow-none"
        )}
      >
        <div className="pl-1.5">
          <BrandMark />
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {marketingNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-heading"
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-heading sm:block"
          >
            Sign in
          </Link>
          <Button
            className="hidden sm:inline-flex"
            render={<Link href="/sign-up" />}
            nativeButton={false}
          >
            Start free
            <ArrowRight className="size-4" />
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="marketing-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full border border-border/70 bg-white text-heading transition-colors hover:bg-secondary lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="marketing-mobile-nav"
          className="animate-fade-up mx-auto mt-2 w-full max-w-[1120px] rounded-[28px] border border-border/70 bg-white/95 p-2 shadow-[0_24px_60px_-30px_rgba(33,22,76,0.4)] backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {marketingNav.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-heading transition-colors hover:bg-secondary"
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
          <div className="mt-1 flex flex-col gap-2 border-t border-border/60 p-2 pt-3">
            <Button
              className="w-full"
              render={<Link href="/sign-up" onClick={() => setOpen(false)} />}
              nativeButton={false}
            >
              Start free
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white"
              render={<Link href="/sign-in" onClick={() => setOpen(false)} />}
              nativeButton={false}
            >
              Sign in
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
