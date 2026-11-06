"use client";

import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { MobileTabBar } from "./mobile-tab-bar";

interface AppShellProps {
  account: { email: string; name: string | null };
  children: React.ReactNode;
}

const STORAGE_KEY = "revo:sidebar-collapsed";

export function AppShell({ account, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Restore the saved preference after mount. Deferred to a task so the effect
  // body never calls setState synchronously (react-hooks/set-state-in-effect).
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
      } catch {
        // Ignore unavailable storage.
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Ignore unavailable storage.
      }
      return next;
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`hidden shrink-0 border-r border-border transition-[width] duration-200 ease-out md:block ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div className="sticky top-0 h-screen">
          <AppSidebar
            account={account}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
          />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pt-8">
            {children}
          </div>
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}
