import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <AppSidebar />
      <main className="lg:pl-60">{children}</main>
      <MobileTabBar />
    </div>
  );
}
