"use client";

import { Suspense, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock, Search, Trash2 } from "lucide-react";
import type { AIAnswer } from "@/lib/types";
import { AISearchBar } from "@/components/ai/ai-search-bar";
import { AIAnswerView } from "@/components/ai/ai-answer";
import { useHydrated, useLocalStorageJson } from "@/lib/use-local-storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STORAGE_KEY = "revoos.ask.history.v1";
const EMPTY_HISTORY: AIAnswer[] = [];

const starterQueries = [
  "What cameras have I been considering?",
  "What apartments did I save?",
  "Show my Japan plans.",
];

function AskPageContent() {
  const searchParams = useSearchParams();
  const initialFromUrl = searchParams.get("q") ?? undefined;

  const hydrated = useHydrated();
  const [answers, setAnswers] = useLocalStorageJson<AIAnswer[]>(
    STORAGE_KEY,
    EMPTY_HISTORY
  );
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const [preset, setPreset] = useState<string | undefined>(initialFromUrl);

  const handleAnswer = useCallback(
    (answer: AIAnswer) => {
      setPendingQuery(null);
      setAnswers([answer, ...answers].slice(0, 50));
    },
    [answers, setAnswers]
  );

  const runPreset = useCallback((query: string) => {
    setPreset(query);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="flex size-9 items-center justify-center rounded-lg icon-chip">
              <Search className="size-4 text-aurora-2" />
            </span>
            <span>Ask your memories</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every answer is synthesized from the memories it cites.
          </p>
        </div>
        {answers.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setAnswers([])}
          >
            <Trash2 className="mr-1.5 size-3.5" />
            Clear history
          </Button>
        )}
      </div>

      <div className="max-w-2xl">
        <AISearchBar
          onAnswer={handleAnswer}
          onLoadingChange={setPendingQuery}
          initialQuery={preset}
          autoRun={Boolean(preset)}
        />
      </div>

      {pendingQuery && (
        <div className="animate-fade-in flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-5 items-center justify-center rounded-full bg-aurora-2/15">
            <span className="size-2 animate-pulse rounded-full bg-aurora-2" />
          </span>
          Thinking about &ldquo;{pendingQuery}&rdquo;
          <span className="animate-pulse">…</span>
        </div>
      )}

      {hydrated && answers.length === 0 && !pendingQuery && (
        <EmptyAskHistory onPick={runPreset} />
      )}

      <div className="space-y-6">
        {answers.map((answer, index) => (
          <div
            key={answer.id}
            className={
              index === 0 ? "animate-fade-up" : "animate-fade-up opacity-100"
            }
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-aurora-2/15 text-[10px] font-bold text-aurora-ink">
                Q{answers.length - index}
              </span>
              <span className="text-sm font-medium">{answer.query}</span>
            </div>
            <AIAnswerView answer={answer} compact />
          </div>
        ))}
      </div>
    </div>
  );
}

function AskPageFallback() {
  return <Skeleton className="h-11 max-w-2xl rounded-xl" />;
}

export default function AskPage() {
  return (
    <Suspense fallback={<AskPageFallback />}>
      <AskPageContent />
    </Suspense>
  );
}

function EmptyAskHistory({ onPick }: { onPick: (query: string) => void }) {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed border-border/70 py-16 text-center">
      <div className="relative mb-5">
        <div className="flex size-14 items-center justify-center rounded-2xl icon-chip">
          <Clock className="size-6 text-aurora-2" />
        </div>
      </div>
      <h2 className="text-base font-semibold">Ask your memories anything</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Your previous questions and AI answers will stack up here — like a chat
        with your past self.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {starterQueries.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-aurora-2/40 hover:text-foreground"
          >
            {q}
          </button>
        ))}
      </div>
    </Card>
  );
}
