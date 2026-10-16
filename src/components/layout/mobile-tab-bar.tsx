"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Plus, Network, Clock3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs: {
  href: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
}[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: Library },
  { href: "/capture", label: "Capture", icon: Plus, primary: true },
  { href: "/connections", label: "Connections", icon: Network },
  { href: "/timeline", label: "Timeline", icon: Clock3 },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden"
    >
      <div className="flex items-end justify-around gap-1 rounded-2xl border border-border bg-card px-2 py-1.5 shadow-sm">
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
                className="-mt-5 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
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
                  ? "text-primary"
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
