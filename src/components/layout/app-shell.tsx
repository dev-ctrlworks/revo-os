import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[560px] bg-gradient-to-b from-indigo-500/[0.08] via-transparent to-transparent" />
        <div className="absolute -left-40 top-24 h-[420px] w-[560px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -right-32 top-64 h-[360px] w-[460px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[280px] w-[420px] rounded-full bg-sky-500/5 blur-3xl" />
      </div>
      <AppSidebar />
      <main className="lg:pl-16">{children}</main>
    </div>
  );
}