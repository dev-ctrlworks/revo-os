import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { PaletteProvider } from "@/components/command/command-palette";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <PaletteProvider>
      <AppShell>
        <DashboardHeader />
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </AppShell>
    </PaletteProvider>
  );
}