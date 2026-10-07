"use client";

import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  clearStorageError,
  getStorageError,
  subscribe,
} from "@/lib/memory-store";

export function StorageWarningBanner() {
  const error = useSyncExternalStore(subscribe, getStorageError, () => null);

  if (!error) return null;

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
      <p className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        {error}{" "}
        <Link
          href="/settings"
          className="ml-0.5 shrink-0 font-medium underline underline-offset-2 hover:opacity-80"
        >
          Open settings
        </Link>
      </p>
      <button
        type="button"
        onClick={clearStorageError}
        aria-label="Dismiss storage warning"
        className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}