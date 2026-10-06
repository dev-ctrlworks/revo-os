"use client";

import { useRef, useState } from "react";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIAnswer } from "@/lib/types";
import { searchMemories } from "@/lib/ai";
import { exampleQueries } from "@/lib/mock-data";

export function AISearchBar({
  onAnswer,
  onLoadingChange,
  autoFocus = false,
  initialQuery,
  big = false,
}: {
  onAnswer?: (answer: AIAnswer) => void;
  onLoadingChange?: (query: string | null) => void;
  autoFocus?: boolean;
  initialQuery?: string;
  big?: boolean;
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

    const madeAnswer = await new Promise<AIAnswer>((resolve) => {
      setTimeout(() => {
        const text =
          sources.length > 0
            ? `Based on your memories, here's what I've connected. I found **${sources.length} related items** — the most relevant are ${sources
                .slice(0, 3)
                .map((s) => `"${s.title}"`)
                .join(", ")}. You saved these across ${
                sources[0]?.collection ? `your "${sources[0].collection}" collection` : "your library"
              }, and they all point toward the same through-line. I can summarize each one, dig into the details, or find related memories if you want to explore further — just ask.`
            : `I couldn't find anything in your memories matching "${finalQuery}". Try rephrasing, or browse the Timeline tab to see everything you've captured.`;
        resolve({
          id: crypto.randomUUID(),
          query: finalQuery,
          answer: text,
          sources,
          createdAt: new Date().toISOString(),
        });
      }, 1100 + Math.random() * 600);
    });

    setLoading(false);
    onAnswer?.(madeAnswer);
    onLoadingChange?.(null);
  }

  return (
    <div className={cn("w-full", big && "mx-auto max-w-2xl")}>
      <div className={cn("relative group", big && "group")}>
        {big && (
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-sky-400/20 to-cyan-400/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100" />
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
          className={cn(
            "relative flex items-center gap-2 border bg-background/80 backdrop-blur-xl transition-all",
            big
              ? "rounded-2xl border-border/60 px-4 h-14 shadow-sm group-focus-within:border-indigo-500/40 group-focus-within:shadow-lg group-focus-within:shadow-indigo-500/10"
              : "rounded-xl border-border/50 px-3 h-11 shadow-sm group-focus-within:border-indigo-500/40"
          )}
        >
          <Sparkles className={cn("shrink-0 text-indigo-500", big ? "size-5" : "size-4")} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you remember?"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus={autoFocus}
          />
          {loading ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-indigo-500" />
          ) : (
            <button
              type="submit"
              disabled={!query.trim()}
              aria-label="Search memories"
              className={cn(
                "flex shrink-0 items-center justify-center gap-1 rounded-lg bg-indigo-500 text-white transition-all hover:bg-indigo-600 disabled:bg-muted disabled:text-muted-foreground",
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

      {big && (
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
              className="rounded-full border border-border/60 bg-card/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}