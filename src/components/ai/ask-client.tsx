"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/layout/empty-state";

interface SourceChip {
  id: string;
  title: string;
  domain: string | null;
}

interface AskEntry {
  id: string;
  query: string;
  answer: string;
  degraded: boolean;
  sources: SourceChip[];
}

const EXAMPLE_QUERIES = [
  "What did I save about travel plans?",
  "Summarize my notes on the project",
  "Where did I save that article?",
];

export function AskClient({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<AskEntry[]>([]);
  const [pending, setPending] = useState(false);
  const firedInitial = useRef(false);
  const busy = useRef(false);

  const ask = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || busy.current) return;
    busy.current = true;
    setPending(true);
    setQuery("");
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setEntries((prev) => [
          {
            id: crypto.randomUUID(),
            query: trimmed,
            answer: payload.error ?? "Something went wrong.",
            degraded: true,
            sources: [],
          },
          ...prev,
        ]);
        return;
      }
      setEntries((prev) => [
        {
          id: crypto.randomUUID(),
          query: trimmed,
          answer: payload.answer,
          degraded: Boolean(payload.degraded),
          sources: payload.sources ?? [],
        },
        ...prev,
      ]);
    } catch {
      setEntries((prev) => [
        {
          id: crypto.randomUUID(),
          query: trimmed,
          answer: "Network error. Please try again.",
          degraded: true,
          sources: [],
        },
        ...prev,
      ]);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }, []);

  useEffect(() => {
    if (firedInitial.current) return;
    const trimmed = initialQuery?.trim();
    if (!trimmed) return;
    firedInitial.current = true;
    const id = window.setTimeout(() => void ask(trimmed), 0);
    return () => window.clearTimeout(id);
  }, [initialQuery, ask]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          Grounded in your memories
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-heading">
          Ask your memory
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Answers are grounded in the memories you&apos;ve saved, with the
          sources cited.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void ask(query);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask a question about your memories…"
          className="h-12 rounded-2xl border-border bg-background pl-10 pr-24 text-sm shadow-sm"
          aria-label="Ask a question"
          maxLength={500}
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-1.5"
          disabled={pending || !query.trim()}
        >
          {pending ? "Thinking…" : "Ask"}
        </Button>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_QUERIES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => void ask(example)}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>

      {entries.length === 0 && !pending ? (
        <EmptyState
          icon={Sparkles}
          title="Ask anything about what you've saved"
          description="Revo searches your memories and answers in plain language, citing the sources it used."
          variant="expressive"
        />
      ) : (
        <div className="space-y-6">
          {pending && (
            <p className="text-sm text-muted-foreground" role="status">
              Searching your memories…
            </p>
          )}
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="app-panel p-4 sm:p-5"
            >
              <p className="text-sm font-medium text-foreground">
                {entry.query}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {entry.answer}
              </p>
              {entry.degraded && (
                <Badge variant="outline" className="mt-3">
                  AI unavailable — showing matching memories only
                </Badge>
              )}
              {entry.sources.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Sources
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {entry.sources.map((source) => (
                      <Link
                        key={source.id}
                        href={`/memory/${source.id}`}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-primary/25 hover:bg-muted"
                      >
                        <span className="truncate">{source.title}</span>
                        {source.domain && (
                          <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                            {source.domain}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
