"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, LayoutGrid, Clock3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs: {
  href: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
}[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/ask", label: "Ask", icon: Search },
  { href: "/capture", label: "Capture", icon: Plus, primary: true },
  { href: "/collections", label: "Collections", icon: LayoutGrid },
  { href: "/timeline", label: "Timeline", icon: Clock3 },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden"
    >
      <div className="flex items-end justify-around gap-1 rounded-2xl border border-border/60 bg-card/85 px-2 py-1.5 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;

          if (tab.primary) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label={tab.label}
                className="-mt-5 flex size-12 shrink-0 items-center justify-center rounded-2xl brand-gradient text-white shadow-[0_12px_28px_-10px_color-mix(in_oklab,var(--aurora-2)_75%,transparent)] transition-transform hover:scale-105"
              >
                <Icon className="size-5" />
              </Link>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium transition-colors",
                active
                  ? "text-aurora-2"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-[18px]" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
