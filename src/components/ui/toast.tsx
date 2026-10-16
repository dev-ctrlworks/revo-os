"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info";

export function Toast({
  message,
  variant = "success",
  className,
}: {
  message: string | null;
  variant?: ToastVariant;
  className?: string;
}) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm shadow-black/5",
          variant === "error"
            ? "border-destructive/30 text-destructive"
            : variant === "info"
              ? "border-primary/30 text-primary"
              : "border-emerald-500/30 text-foreground"
        )}
      >
        {variant === "error" ? (
          <AlertCircle className="size-4 shrink-0" />
        ) : variant === "info" ? (
          <Info className="size-4 shrink-0" />
        ) : (
          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
        )}
        <span className="min-w-0">{message}</span>
      </div>
    </div>
  );
}
