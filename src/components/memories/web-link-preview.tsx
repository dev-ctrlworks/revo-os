"use client";

import { ArrowUpRight, LinkIcon } from "lucide-react";
import type { Memory } from "@/lib/types";
import { hostnameOf, safeExternalUrl } from "@/lib/safe-url";

export function WebLinkPreview({ memory }: { memory: Memory }) {
  const url = safeExternalUrl(memory.source);
  const host = hostnameOf(memory.source) || memory.source;

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-border/40 bg-muted/40 px-5 py-3 sm:px-6">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </span>
        <span className="flex h-6 min-w-0 flex-1 items-center gap-1.5 rounded-md bg-background px-2 font-mono text-[11px] text-muted-foreground">
          <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
          <span className="truncate">{url}</span>
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 text-base font-bold text-emerald-600">
            {host.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <a
              href={url ?? undefined}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-1.5 text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors hover:text-emerald-500"
            >
              <span className="line-clamp-2">{memory.title}</span>
              <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
            </a>
            <p className="mt-0.5 text-[11px] font-medium text-emerald-500">
              {memory.domain ?? host}
            </p>
          </div>
          <a
            href={url ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-500/25 transition-all hover:brightness-110"
          >
            <LinkIcon className="size-3.5" />
            Open
          </a>
        </div>

        <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted-foreground">
          {memory.content}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/40 px-5 py-3 text-[11px] text-muted-foreground sm:px-6">
        <span className="min-w-0 truncate">Web preview · {host}</span>
        <a
          href={url ?? undefined}
          target="_blank"
          rel="noreferrer"
          className="ml-2 inline-flex shrink-0 items-center gap-1 font-medium text-emerald-500 transition-colors hover:text-emerald-400"
        >
          Visit page
          <ArrowUpRight className="size-3" />
        </a>
      </div>
    </div>
  );
}