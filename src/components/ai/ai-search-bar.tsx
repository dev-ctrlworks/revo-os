"use client";

import { useRef, useState } from "react";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
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
}: {
  onAnswer?: (answer: AIAnswer) => void;
  onLoadingChange?: (query: string | null) => void;
  autoFocus?: boolean;
  initialQuery?: string;
  big?: boolean;
  suggestions?: { label: string; query: string }[];
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function runSearch(q?: string) {
    const finalQuery = (q ?? query).trim();
    if (!finalQuery || loading) return;
    setQuery(finalQuery);
    setLoading(true);
    inputRef.current?.blur();
    onLoadingChange?.(finalQuery);
    const sources = searchMemories({ query: finalQuery });

    let madeAnswer: AIAnswer;
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
      madeAnswer =
        data && !data.fallback && typeof data.answer === "string"
          ? {
              id: crypto.randomUUID(),
              query: finalQuery,
              answer: data.answer,
              sources,
              createdAt: new Date().toISOString(),
            }
          : makeFallbackAnswer(finalQuery, sources);
    } catch {
      madeAnswer = makeFallbackAnswer(finalQuery, sources);
    }

    setLoading(false);
    onAnswer?.(madeAnswer);
    onLoadingChange?.(null);
  }

  return (
    <div className={cn("w-full", big && "mx-auto max-w-2xl")}>
      <div className={cn("relative group", big && "group")}>
        {big && (
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-aurora-2/25 via-aurora-2/20 to-aurora-3/25 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
          className={cn(
            "relative flex items-center gap-2 border bg-background/80 backdrop-blur-xl transition-all",
            big
              ? "rounded-2xl border-border/60 px-4 h-14 shadow-sm group-focus-within:border-aurora-2/40 group-focus-within:shadow-lg group-focus-within:shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--aurora-2)_40%,transparent)]"
              : "rounded-xl border-border/50 px-3 h-11 shadow-sm group-focus-within:border-aurora-2/40"
          )}
        >
          <Sparkles className={cn("shrink-0 text-aurora-2", big ? "size-5" : "size-4")} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you remember?"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus={autoFocus}
          />
          {loading ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-aurora-2" />
          ) : (
            <button
              type="submit"
              disabled={!query.trim()}
              aria-label="Search memories"
              className={cn(
                "flex shrink-0 items-center justify-center gap-1 rounded-lg bg-aurora-2 text-white transition-all hover:bg-aurora-2 disabled:bg-muted disabled:text-muted-foreground",
                big ? "h-9 px-3 text-xs font-medium" : "size-8"
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
      </div>

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
              className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-aurora-2/40 hover:text-foreground disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {big && suggestions && (
        <div className="mt-3.5 grid gap-2 sm:grid-cols-2">
          {suggestions.map((s) => (
            <button
              key={s.query}
              type="button"
              onClick={() => {
                setQuery(s.query);
                runSearch(s.query);
              }}
              disabled={loading}
              className="group flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/50 px-3.5 py-3 text-left text-[13px] text-muted-foreground transition-all hover:border-aurora-2/40 hover:bg-card hover:text-foreground disabled:opacity-50"
            >
              <span className="line-clamp-2 leading-snug">{s.label}</span>
              <ArrowRight className="size-3.5 shrink-0 text-aurora-2 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}