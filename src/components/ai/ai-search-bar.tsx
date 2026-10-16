"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIAnswer } from "@/lib/types";
import { generateAnswer, searchMemories } from "@/lib/ai";
import { exampleQueries } from "@/lib/mock-data";

function makeFallbackAnswer(query: string, sources: ReturnType<typeof searchMemories>): AIAnswer {
  return {
    id: crypto.randomUUID(),
    query,
    answer: generateAnswer(query, sources),
    sources,
    createdAt: new Date().toISOString(),
  };
}

export function AISearchBar({
  onAnswer,
  onLoadingChange,
  autoFocus = false,
  initialQuery,
  big = false,
  suggestions,
  autoRun = false,
}: {
  onAnswer?: (answer: AIAnswer) => void;
  onLoadingChange?: (query: string | null) => void;
  autoFocus?: boolean;
  initialQuery?: string;
  big?: boolean;
  suggestions?: { label: string; query: string }[];
  autoRun?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastRunRef = useRef<string | null>(null);

  async function runSearch(q?: string) {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery || loading) return;
    setQuery(finalQuery);
    setLoading(true);
    inputRef.current?.blur();
    onLoadingChange?.(finalQuery);
    const sources = searchMemories({ query: finalQuery });

    let madeAnswer: AIAnswer;
    let degraded = false;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: finalQuery,
          sources: sources.map(({ title, content, collection, createdAt, source, tags }) => ({
            title,
            content,
            collection,
            createdAt,
            source,
            tags,
          })),
        }),
      });
      const data = await res.json();
      if (data && !data.fallback && typeof data.answer === "string") {
        madeAnswer = {
          id: crypto.randomUUID(),
          query: finalQuery,
          answer: data.answer,
          sources,
          createdAt: new Date().toISOString(),
        };
      } else {
        madeAnswer = makeFallbackAnswer(finalQuery, sources);
        degraded = true;
      }
    } catch {
      madeAnswer = makeFallbackAnswer(finalQuery, sources);
      degraded = true;
    }

    madeAnswer.degraded = degraded;
    setLoading(false);
    onAnswer?.(madeAnswer);
    onLoadingChange?.(null);
  }

  useEffect(() => {
    if (!autoRun) return;
    const q = (initialQuery ?? "").trim();
    if (!q || lastRunRef.current === q) return;
    lastRunRef.current = q;
    void runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, initialQuery]);

  return (
    <div className={cn("w-full", big && "mx-auto max-w-2xl")}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch();
        }}
        className={cn(
          "relative flex items-center gap-2 rounded-xl border border-border bg-card transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
          big ? "h-12 px-3.5" : "h-10 px-3"
        )}
      >
        <Search className={cn("shrink-0 text-muted-foreground", big ? "size-4" : "size-3.5")} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to find?"
          className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          autoFocus={autoFocus}
        />
        {loading ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <button
            type="submit"
            disabled={!query.trim()}
            aria-label={big ? "Ask" : "Search memories"}
            className={cn(
              "flex shrink-0 items-center justify-center gap-1 rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50",
              big ? "h-8 px-3 text-xs font-medium" : "size-8"
            )}
          >
            {big ? (
              <>
                Ask
                <ArrowRight className="size-3.5" />
              </>
            ) : (
              <ArrowRight className="size-3.5" />
            )}
          </button>
        )}
      </form>

      {big && !suggestions && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {exampleQueries.slice(0, 4).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setQuery(q);
                runSearch(q);
              }}
              disabled={loading}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {big && suggestions && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {suggestions.map((s) => (
            <button
              key={s.query}
              type="button"
              onClick={() => {
                setQuery(s.query);
                runSearch(s.query);
              }}
              disabled={loading}
              className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3.5 py-3 text-left text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-50"
            >
              <span className="line-clamp-2 leading-snug">{s.label}</span>
              <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}