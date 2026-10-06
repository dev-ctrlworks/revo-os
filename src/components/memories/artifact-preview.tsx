"use client";

import {
  Calendar,
  Inbox,
  PenLine,
  Send,
} from "lucide-react";
import type { Memory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils-format";

export function Highlight({ memory }: { memory: Memory }) {
  if (!memory.highlight) return null;
  return (
    <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-amber-600 dark:text-amber-400">
        Highlight
      </p>
      <p className="mt-1 text-sm font-medium leading-relaxed">
        {memory.highlight}
      </p>
    </div>
  );
}

function senderLabel(memory: Memory, fallback: string): string {
  const source = memory.source;
  if (!source || source === memory.type || source === "clipboard") return fallback;
  return source.replace(/^Upload · /, "");
}

function initialOf(name: string): string {
  return (name.trim()[0] ?? "R").toUpperCase();
}

export function EmailPreview({ memory }: { memory: Memory }) {
  const from = senderLabel(memory, "Captured email");
  const paragraphs = memory.content.split("\n").filter(Boolean);

  return (
    <div className="bg-muted/20">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/40 bg-card px-5 py-3 text-[11px] text-muted-foreground sm:px-6">
        <span>
          from <span className="font-medium text-foreground/70">{from}</span>
        </span>
        <span className="flex-1" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
          <Inbox className="size-3" />
          Inbox
        </span>
      </div>

      <div className="px-5 py-6 sm:px-6 sm:py-7">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-semibold text-white">
            {initialOf(from)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{from}</p>
            <p className="truncate text-[11px] text-muted-foreground">
              to me · {formatDateTime(memory.createdAt)}
            </p>
          </div>
        </div>

        <h3 className="mt-5 text-lg font-semibold tracking-tight">
          {memory.title}
        </h3>
        <div className="mt-4 space-y-3 border-l-2 border-indigo-500/20 pl-4">
          {paragraphs.map((line, i) => (
            <p
              key={i}
              className="text-[13.5px] leading-relaxed text-foreground/85"
            >
              {line}
            </p>
          ))}
        </div>
        <Highlight memory={memory} />
      </div>
    </div>
  );
}

export function DiscussionPreview({ memory }: { memory: Memory }) {
  const sender = senderLabel(memory, "Revo Assistant");
  const conversation = memory.content
    .split(/\n\s*\n/)
    .filter(Boolean);

  return (
    <div className="bg-muted/20">
      <div className="flex items-center gap-3 border-b border-border/40 bg-card px-5 py-3 sm:px-6">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-xs font-bold text-white">
          {initialOf(sender)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{sender}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            Conversation · {formatDateTime(memory.createdAt)}
          </p>
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6">
        <div className="mx-auto max-w-xl space-y-3.5">
          {conversation.map((block, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[90%] rounded-2xl border border-teal-500/20 bg-teal-500/[0.06] px-4 py-3.5",
                i === 0 ? "rounded-tl-md" : "rounded-tl-lg"
              )}
            >
              <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-foreground/90">
                {block}
              </p>
            </div>
          ))}
          <p className="flex items-center gap-1.5 pt-1 text-[10px] text-muted-foreground">
            <Calendar className="size-3" />
            Captured {formatDateTime(memory.createdAt)}
          </p>
        </div>
        <Highlight memory={memory} />
      </div>

      <div className="border-t border-border/40 bg-card px-5 py-3 sm:px-6">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <div className="flex-1 rounded-full bg-muted px-4 py-2 text-[11px] text-muted-foreground">
            This conversation was captured by Revo OS
          </div>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
            <Send className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function NotePreview({ memory }: { memory: Memory }) {
  return (
    <div className="px-5 py-7 sm:px-8 sm:py-9">
      <div className="relative mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <PenLine className="size-3.5 text-amber-500" />
                Written note
              </span>
              <time className="tabular-nums">{formatDateTime(memory.createdAt)}</time>
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              {memory.title}
            </h3>
            <p className="mt-5 whitespace-pre-wrap border-l-2 border-amber-400/40 pl-5 text-[14.5px] leading-8 text-foreground/90">
              {memory.content}
            </p>
            <Highlight memory={memory} />
          </div>
        </div>
      </div>
    </div>
  );
}