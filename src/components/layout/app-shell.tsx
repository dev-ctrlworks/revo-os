import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-indigo-500/[0.07] via-transparent to-transparent" />
        <div className="absolute -right-40 top-16 h-[460px] w-[560px] rounded-full bg-violet-500/[0.09] blur-3xl" />
      </div>
      <AppSidebar />
      <main className="lg:pl-16">{children}</main>
    </div>
  );
}