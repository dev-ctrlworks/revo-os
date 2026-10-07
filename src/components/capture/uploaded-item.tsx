"use client";

import Link from "next/link";
import { AlertCircle, ArrowUpRight, Check, Loader2, X } from "lucide-react";
import type { UploadedFile } from "@/lib/capture-shared";
import { cn } from "@/lib/utils";

export function UploadedItem({
  file,
  onRemove,
}: {
  file: UploadedFile;
  onRemove: () => void;
}) {
  const indexed = file.status === "indexed";
  const failed = file.status === "failed";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3.5 py-2.5 text-xs shadow-sm shadow-black/[0.02]">
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-md",
          indexed
            ? "bg-emerald-500/10 text-emerald-500"
            : failed
              ? "bg-red-500/10 text-red-500"
              : "bg-indigo-500/10 text-indigo-400"
        )}
      >
        {indexed ? (
          <Check className="size-3.5" strokeWidth={2.5} />
        ) : failed ? (
          <AlertCircle className="size-3.5" />
        ) : (
          <Loader2 className="size-3.5 animate-spin" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{file.name}</span>
        {failed ? (
          <span className="mt-0.5 block text-[10px] leading-snug text-red-500/80">
            Not saved — demo storage is full. Clear captured memories in
            Settings first.
          </span>
        ) : indexed && file.summary ? (
          <>
            <span className="block text-[10px] text-muted-foreground">
              {file.sizeLabel} · indexed
            </span>
            <span className="mt-0.5 line-clamp-2 block text-[10px] leading-snug text-indigo-500/80">
              ✦ Auto summary: {file.summary}
            </span>
          </>
        ) : (
          <span className="block text-[10px] text-muted-foreground">
            {file.sizeLabel}
            {indexed ? " · indexed" : " · indexing…"}
          </span>
        )}
      </span>
      {indexed && file.memoryId ? (
        <Link
          href={`/memory/${file.memoryId}`}
          className="inline-flex h-6 shrink-0 items-center gap-0.5 rounded-md px-1.5 text-[11px] font-medium text-indigo-500 underline-offset-2 transition-colors hover:text-indigo-400 hover:underline"
        >
          View
          <ArrowUpRight className="size-3" />
        </Link>
      ) : (
        <span className="w-10 shrink-0" />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Remove ${file.name}`}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}