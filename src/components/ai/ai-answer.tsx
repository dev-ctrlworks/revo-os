"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import type { AIAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils-format";
import { Card } from "@/components/ui/card";
import { MemoryTypeIcon, memoryTypeLabel } from "@/components/memories/memory-type-icon";
import type { Memory } from "@/lib/types";

function renderRichText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AIAnswerView({
  answer,
  compact = false,
}: {
  answer: AIAnswer;
  compact?: boolean;
}) {
  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.06] via-card to-card/60 p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <BookOpenText className="size-3.5 text-indigo-400" />
          AI summary
          <span className="text-muted-foreground/60">•</span>
          <span>{timeAgo(answer.createdAt)}</span>
        </div>
        <p
          className={cn(
            "leading-relaxed text-foreground/90",
            compact ? "text-sm" : "text-[15px]"
          )}
        >
          {renderRichText(answer.answer)}
        </p>
      </Card>

      {answer.sources.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500/10 text-[10px] font-semibold text-indigo-500">
              {answer.sources.length}
            </span>
            Source memories
          </div>
          <div className="flex flex-col gap-2">
            {answer.sources.map((source) => (
              <SourceChip key={source.id} memory={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SourceChip({ memory }: { memory: Memory }) {
  return (
    <Link href={`/memory/${memory.id}`} className="group block">
      <Card className="flex items-center gap-3 border-border/50 bg-card/50 p-3 transition-all hover:border-indigo-500/40 hover:bg-card">
        <MemoryTypeIcon type={memory.type} />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-[13px] font-medium">{memory.title}</p>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>{memoryTypeLabel(memory.type)}</span>
            <span>·</span>
            <span className="truncate">{memory.collection}</span>
          </p>
        </div>
        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </Card>
    </Link>
  );
}

export function SourceBadge({ memory }: { memory: Memory }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
      <MemoryTypeIcon type={memory.type} size="sm" />
      {memoryTypeLabel(memory.type)}
    </span>
  );
}