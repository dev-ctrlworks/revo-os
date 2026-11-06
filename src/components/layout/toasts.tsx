"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  title: string;
  variant: "default" | "error" | "success";
}

let counter = 0;
export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (title: string, variant: ToastMessage["variant"] = "default") => {
      const id = `toast-${++counter}`;
      setToasts((prev) => [...prev, { id, title, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}

interface ToastViewportProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

/** Minimal, accessible toast viewport. */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null;
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2 md:bottom-6"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => onDismiss(toast.id)}
          className={cn(
            "rounded-xl border px-4 py-2.5 text-sm font-medium shadow-[0_10px_30px_-18px_rgba(33,22,76,0.5)] transition-colors backdrop-blur",
            toast.variant === "error"
              ? "border-destructive/25 bg-destructive/10 text-destructive hover:bg-destructive/15"
              : toast.variant === "success"
                ? "border-[color-mix(in_oklab,var(--success)_30%,transparent)] bg-[color-mix(in_oklab,var(--success)_12%,white)] text-[var(--success)] hover:bg-[color-mix(in_oklab,var(--success)_18%,white)]"
                : "border-border bg-background/95 text-foreground hover:bg-muted"
          )}
        >
          {toast.title}
        </button>
      ))}
    </div>
  );
}
