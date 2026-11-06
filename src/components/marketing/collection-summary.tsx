"use client";

import { ArrowRight, FileText, Share2, Sparkles } from "lucide-react";
import { memories } from "@/lib/mock-data";
import type { Memory } from "@/lib/types";
import { SectionHeading, SectionShell } from "./section";
import { Reveal, useEnteredViewport } from "./motion";
import { MemoryThumb } from "./memory-thumb";

const SAMPLE_IDS = ["m1", "m3", "m6", "m14"];

const BRIEF_LINES = [
  "## Overview",
  "Four linked memories reveal a clear research thread connecting camera specs, pricing, and availability across multiple sources.",
  "## Key themes",
  "• Portability emerges as the shared priority across reviews [1]",
  "• Price sensitivity links discussions around value and deals [2]",
  "• Availability constraints connect sourcing notes across regions [3]",
];

const GRAPH_NODES = [
  { id: "n1", x: 20, y: 30 },
  { id: "n2", x: 78, y: 22 },
  { id: "n3", x: 68, y: 78 },
  { id: "n4", x: 18, y: 72 },
];

const GRAPH_EDGES = [
  ["n1", "n2"],
  ["n2", "n3"],
  ["n3", "n4"],
  ["n4", "n1"],
  ["n1", "n3"],
];

/**
 * Connections summary showcase: an illustrative before/after that turns a
 * web of linked memories into a single one-page brief. Rendered on labeled
 * sample data; not a live backend.
 */
export function CollectionSummarySection() {
  const { ref, entered } = useEnteredViewport<HTMLDivElement>();
  const cards = SAMPLE_IDS.map((id) =>
    memories.find((memory) => memory.id === id)
  ).filter((memory): memory is Memory => Boolean(memory));

  return (
    <SectionShell id="summaries">
      <SectionHeading
        kicker="One-page briefs"
        accent="var(--violet)"
        title="Turn your connections into a one-page brief."
        underline="connections"
        lead="Linked memories reveal patterns faster than browsing alone. Revo OS turns your connections into a single, grounded one-page brief you can download as a PDF — with the sources it used. Summarizing a collection works too."
      />

      <Reveal className="mt-14" y={30}>
        <div
          ref={ref}
          className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]"
        >
          <div className="rounded-[28px] border border-border bg-white/85 p-4 shadow-[0_40px_100px_-70px_rgba(33,22,76,0.5)] backdrop-blur sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-heading">
                <span className="grid size-6 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Share2 className="size-3.5" />
                </span>
                Connections
              </span>
              <span className="text-[11px] text-muted-foreground">
                {cards.length} linked memories · sample
              </span>
            </div>
            <div className="relative h-[180px] overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-white via-white to-violet-50/60">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--primary) 6%, transparent), transparent 70%)",
                }}
              />
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
                    <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {GRAPH_EDGES.map(([from, to], index) => {
                  const a = GRAPH_NODES.find((n) => n.id === from)!;
                  const b = GRAPH_NODES.find((n) => n.id === to)!;
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="url(#edge-grad)"
                      strokeWidth={entered ? 1.2 : 0.6}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                      style={{
                        strokeDasharray: entered ? 0 : 40,
                        strokeDashoffset: entered ? 0 : 40,
                        transitionDelay: `${index * 140}ms`,
                        opacity: entered ? 1 : 0,
                      }}
                    />
                  );
                })}
                {GRAPH_NODES.map((node, index) => (
                  <g
                    key={node.id}
                    style={{
                      transform: entered
                        ? "scale(1)"
                        : "scale(0.4)",
                      transformOrigin: `${node.x}px ${node.y}px`,
                      opacity: entered ? 1 : 0,
                      transition:
                        "transform 600ms cubic-bezier(0.22,1,0.36,1), opacity 600ms cubic-bezier(0.22,1,0.36,1)",
                      transitionDelay: `${index * 110 + 200}ms`,
                    }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={entered ? 5.5 : 3.5}
                      className="fill-primary/15 transition-all duration-700"
                      style={{ transitionDelay: `${index * 110 + 200}ms` }}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={entered ? 3.2 : 2}
                      className="fill-primary transition-all duration-700"
                      style={{ transitionDelay: `${index * 110 + 200}ms` }}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={entered ? 7 : 4}
                      className="fill-primary/8 animate-pulse transition-all duration-700"
                      style={{ transitionDelay: `${index * 110 + 200}ms` }}
                    />
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-medium text-muted-foreground shadow-sm">
                Graph · sample
              </div>
              <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-primary/[0.08] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-primary">
                <span className="size-1 rounded-full bg-primary animate-pulse" />
                Linking
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {cards.map((memory) => (
                <div
                  key={memory.id}
                  className="flex items-center gap-2 rounded-xl border border-border/70 bg-white px-2 py-1.5"
                >
                  <MemoryThumb
                    type={memory.type}
                    title={memory.title}
                    tags={memory.tags}
                    context={memory.collection}
                    seed={memory.id}
                    className="size-7 rounded-lg"
                  />
                  <p className="line-clamp-1 text-[10px] font-medium text-heading">
                    {memory.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <span className="relative inline-flex size-12 items-center justify-center rounded-full border border-primary/30 bg-white shadow-[0_20px_60px_-30px_rgba(89,46,255,0.9)]">
              <span className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              <ArrowRight className="relative size-5 text-primary" />
              <span className="sr-only">Summarized into</span>
            </span>
          </div>

          <div
            className="relative overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow-[0_50px_120px_-70px_rgba(33,22,76,0.6)]"
            style={{
              perspective: "1000px",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-10 right-[-20%] h-40 w-40 rounded-full bg-primary/5 blur-3xl"
            />
            <div
              className="mb-4 flex items-center gap-2 border-b border-border/70 pb-3"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-4" />
              </span>
              <span className="text-[13px] font-semibold text-heading">
                Connections — brief.pdf
              </span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                <Sparkles className="size-3" />
                Available
              </span>
            </div>

            <div
              className={`relative overflow-hidden rounded-2xl border border-border/60 bg-white p-4 ${
                entered ? "mkt-pdf-unfold mkt-pdf-shimmer" : "opacity-0"
              }`}
            >
              {entered && <span aria-hidden className="mkt-brief-sweep" />}
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? "translateX(0)" : "translateX(-6px)",
                    transition: "all 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                    transitionDelay: "450ms",
                  }}
                >
                  Overview
                </span>
                <span
                  className="h-px flex-1 bg-border/60"
                  style={{
                    transform: entered ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                    transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                    transitionDelay: "500ms",
                  }}
                />
              </div>
              <div className="mt-3 space-y-2.5">
                {BRIEF_LINES.map((line, index) => (
                  <p
                    key={line}
                    className={
                      line.startsWith("•")
                        ? "pl-3 text-[11px] leading-relaxed text-text/80"
                        : "text-[11px] leading-relaxed text-text/80"
                    }
                    style={{
                      opacity: entered ? 1 : 0,
                      transform: entered ? "translateY(0)" : "translateY(8px)",
                      transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
                      transitionDelay: `${550 + index * 140}ms`,
                    }}
                  >
                    {line.replace(/^#+\s*/, "").replace(/^•\s*/, "• ").split(/(\[\d+\])/).map((part, i) => 
                      /\[\d+\]/.test(part) ? (
                        <sup
                          key={i}
                          className={entered ? "mkt-cite-pop text-[9px] font-semibold text-primary ml-0.5" : ""}
                          style={{ animationDelay: `${750 + index * 140}ms` }}
                        >
                          {part}
                        </sup>
                      ) : part
                    )}
                  </p>
                ))}
              </div>
              <div
                className="mt-4 flex items-center justify-between text-[9px] text-muted-foreground"
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(4px)",
                  transition: "all 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                  transitionDelay: "950ms",
                }}
              >
                <span className="inline-flex items-center gap-1">
                  <span className="size-1 rounded-full bg-primary" />
                  Revo OS · Connections brief
                </span>
                <span>1 / 1</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Product preview · shown with sample data
      </p>
    </SectionShell>
  );
}
