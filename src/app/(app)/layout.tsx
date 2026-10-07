import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { PaletteProvider } from "@/components/command/command-palette";
import { FeedbackButton } from "@/components/feedback/feedback-button";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <PaletteProvider>
      <AppShell>
        <DashboardHeader />
        <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </AppShell>
      <FeedbackButton />
    </PaletteProvider>
  );
}