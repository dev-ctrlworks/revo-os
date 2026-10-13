"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenText, MousePointerClick, Search, Sparkles } from "lucide-react";
import { AISearchBar } from "@/components/ai/ai-search-bar";
import { AIAnswerView } from "@/components/ai/ai-answer";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/landing/section-header";
import { Reveal } from "@/components/motion/reveal";
import type { AIAnswer } from "@/lib/types";

const suggestions = [
  { label: "Which cameras was I considering buying?", query: "Which cameras was I considering buying?" },
  { label: "What apartments did I shortlist?", query: "What apartments did I shortlist?" },
  { label: "Show my Japan trip plans", query: "Show my Japan trip plans" },
  { label: "When is Mango's vet appointment?", query: "When is Mango's vet appointment?" },
];

export function Demo() {
  const [answer, setAnswer] = useState<AIAnswer | null>(null);

  return (
    <section id="demo" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <SectionHeader
        kicker="Interactive demo"
        align="center"
        title={
          <>
            Don&apos;t just take our word for it.{" "}
            <span className="text-gradient">Try it.</span>
          </>
        }
        lead="Ask the pre-loaded sample memories a question. Watch it pull the sources and answer in plain language — no signup, no setup."
      />

      <Reveal className="mt-10" y={28}>
        <div className="mx-auto max-w-3xl rounded-[28px] border border-border/50 bg-card/55 p-6 shadow-[0_24px_60px_-30px_rgba(124,92,255,0.35)] backdrop-blur-xl sm:p-8">
          <AISearchBar big suggestions={suggestions} onAnswer={setAnswer} />

          <div className="mt-7">
            {answer ? (
              <div className="animate-fade-up">
                <AIAnswerView answer={answer} />
              </div>
            ) : (
              <DemoHint />
            )}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 sm:flex-row">
            <p className="text-center text-xs text-muted-foreground sm:text-left">
              Runs on sample data in your browser. Revo OS never sees your real
              memories here.
            </p>
            <Button
              className="shrink-0 rounded-full bg-gradient-to-r from-[color-mix(in_oklab,var(--aurora-1)_92%,black)] to-aurora-3 px-6 shadow-[0_12px_28px_-10px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]"
              render={<Link href="/dashboard" />}
              nativeButton={false}
            >
              Explore RevoOS
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function DemoHint() {
  const steps = [
    { icon: MousePointerClick, text: "Pick a suggested question, or type your own." },
    { icon: Search, text: "Revo OS finds the matching sample memories." },
    { icon: BookOpenText, text: "You get a grounded answer with its sources." },
  ];

  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 p-6 text-center backdrop-blur-xl">
      <span className="mx-auto mb-3 grid size-11 place-items-center rounded-2xl icon-chip">
        <Sparkles className="size-5 text-aurora-2" />
      </span>
      <p className="text-sm font-medium">Ask your memories anything</p>
      <div className="mx-auto mt-5 grid max-w-lg gap-2.5 text-left sm:grid-cols-3">
        {steps.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="rounded-xl border border-border/50 bg-card/60 p-3 backdrop-blur-xl"
          >
            <Icon className="size-3.5 text-aurora-2" />
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
