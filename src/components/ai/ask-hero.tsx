"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EXAMPLE_QUERIES = [
  "What did I save about travel?",
  "Summarize my recent notes",
  "Where did I save that article?",
];

/**
 * Branded entry point to Ask on the dashboard. Submitting navigates to /ask
 * with the query, which actually runs the grounded search there.
 */
export function AskHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function submit(value: string) {
    const trimmed = value.trim();
    router.push(trimmed ? `/ask?q=${encodeURIComponent(trimmed)}` : "/ask");
  }

  return (
    <section className="app-panel relative isolate overflow-hidden p-6 sm:p-8">
      <div
        aria-hidden
        className="app-wash pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div className="flex items-center gap-2 text-xs font-medium text-primary">
        <Sparkles className="size-4" />
        Ask your memory
      </div>
      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-heading sm:text-3xl">
        Your memory layer
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Ask questions in plain language and get answers grounded in what
        you&apos;ve saved — with the sources it used.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(query);
        }}
        className="relative mt-5 max-w-xl"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask anything about what you've saved…"
          className="h-12 rounded-2xl border-border bg-background pl-10 pr-24 text-sm shadow-sm"
          aria-label="Ask a question"
          maxLength={500}
        />
        <Button
          type="submit"
          className="absolute right-1.5 top-1.5"
          disabled={!query.trim()}
        >
          Ask
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLE_QUERIES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => submit(example)}
            className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:border-primary/30 hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>
    </section>
  );
}
