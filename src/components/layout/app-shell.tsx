import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AuroraBackground } from "@/components/motion/aurora-background";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBackground />
      <AppSidebar />
      <main className="lg:pl-16">{children}</main>
    </div>
  );
}