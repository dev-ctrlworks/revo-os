"use client";

import { useState } from "react";
import { Clock, Search, Trash2 } from "lucide-react";
import type { AIAnswer } from "@/lib/types";
import { AISearchBar } from "@/components/ai/ai-search-bar";
import { AIAnswerView } from "@/components/ai/ai-answer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SearchPage() {
  const [answers, setAnswers] = useState<AIAnswer[]>([]);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  function handleAnswer(answer: AIAnswer) {
    setPendingQuery(null);
    setAnswers((prev) => [answer, ...prev]);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-cyan-400/15">
              <Search className="size-4 text-indigo-500" />
            </span>
            Search your <span className="text-gradient">mind</span>
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
            Clear
          </Button>
        )}
      </div>

      <div className="max-w-2xl">
        <AISearchBar
          onAnswer={handleAnswer}
          onLoadingChange={setPendingQuery}
        />
      </div>

      {pendingQuery && (
        <div className="animate-fade-in flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500/10">
            <span className="size-2 animate-pulse rounded-full bg-indigo-500" />
          </span>
          Thinking about &ldquo;{pendingQuery}&rdquo;
          <span className="animate-pulse">…</span>
        </div>
      )}

      {answers.length === 0 && !pendingQuery && (
        <EmptySearchHistory />
      )}

      <div className="space-y-6">
        {answers.map((answer, index) => (
          <div
            key={answer.id}
            className={
              index === 0
                ? "animate-fade-up"
                : "animate-fade-up opacity-100"
            }
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-indigo-500/10 text-[10px] font-bold text-indigo-500">
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

function EmptySearchHistory() {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed border-border/70 py-16 text-center">
      <div className="relative mb-5">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-400/15">
          <Clock className="size-6 text-indigo-500" />
        </div>
      </div>
      <h3 className="text-base font-semibold">Ask your memories anything</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Your previous questions and AI answers will stack up here — like a chat
        with your past self.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {[
          "What cameras have I been considering?",
          "What apartments did I save?",
          "Show my Japan plans.",
        ].map((q) => (
          <span
            key={q}
            className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground"
          >
            {q}
          </span>
        ))}
      </div>
    </Card>
  );
}