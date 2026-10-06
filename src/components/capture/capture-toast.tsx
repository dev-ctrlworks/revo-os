"use client";

import { Check } from "lucide-react";

export function CaptureToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 animate-scale-in px-4"
    >
      <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-background/90 py-2 pl-2.5 pr-4 text-sm text-emerald-600 shadow-lg shadow-emerald-500/10 backdrop-blur dark:text-emerald-400">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
          <Check className="size-3" strokeWidth={3} />
        </span>
        <span className="min-w-0">{message}</span>
      </div>
    </div>
  );
}