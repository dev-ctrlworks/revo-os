"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { AIAnswer } from "@/lib/types";
import { AISearchBar } from "@/components/ai/ai-search-bar";
import { AIAnswerView } from "@/components/ai/ai-answer";

export function SearchDemo() {
  const [answer, setAnswer] = useState<AIAnswer | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AISearchBar big onAnswer={setAnswer} onLoadingChange={(q) => setLoading(q !== null)} />
      <div className="mt-5 min-h-32">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-aurora-2" />
            Connecting the dots…
          </div>
        )}
        {answer && !loading && (
          <div key={answer.id} className="animate-fade-up">
            <AIAnswerView answer={answer} />
          </div>
        )}
      </div>
    </div>
  );
}