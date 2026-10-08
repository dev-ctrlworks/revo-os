"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, FolderOpen, Network, BookOpenText, Search } from "lucide-react";
import { memories, collections } from "@/lib/mock-data";
import { MemoryTypeIcon } from "@/components/memories/memory-type-icon";
import { cn } from "@/lib/utils";

const panes = [
  {
    id: "timeline",
    icon: CalendarDays,
    name: "Timeline",
    blurb: "Replay your days, grouped automatically.",
  },
  {
    id: "collections",
    icon: FolderOpen,
    name: "Collections",
    blurb: "Everything auto-grouped into living folders.",
  },
  {
    id: "graph",
    icon: Network,
    name: "Memory Graph",
    blurb: "Watch people, places, and plans connect.",
  },
  {
    id: "search",
    icon: Search,
    name: "AI answers",
    blurb: "Plain-language questions, cited answers.",
  },
];

export function ProductShowcase() {
  const [active, setActive] = useState("timeline");
  const activePane = panes.find((p) => p.id === active)!;

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-1.5">
        {panes.map((pane, i) => {
          const selected = pane.id === active;
          return (
            <button
              key={pane.id}
              type="button"
              onClick={() => setActive(pane.id)}
              className={cn(
                "group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-300",
                selected
                  ? "border-aurora-2/30 bg-gradient-to-r from-aurora-2/12 to-aurora-3/12"
                  : "border-transparent hover:border-border/50 hover:bg-card/50"
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  selected ? "brand-gradient text-white" : "icon-chip"
                )}
              >
                <pane.icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {pane.name}
                  <span className="text-[10px] text-muted-foreground/60">0{i + 1}</span>
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                  {pane.blurb}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/55 shadow-[0_20px_50px_-30px_rgba(124,92,255,0.35)] backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-border/50 bg-card/55 px-4 py-2.5 backdrop-blur-xl">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <p className="mx-auto flex items-center gap-1.5 rounded-md bg-card/65 px-3 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/50 backdrop-blur-xl">
            {activePane.icon && <activePane.icon className="size-3 text-aurora-2" />}
            {activePane.name}
          </p>
        </div>

        <div className="min-h-[320px] p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {active === "timeline" && <TimelinePreview />}
              {active === "collections" && <CollectionsPreview />}
              {active === "graph" && <MemoryGraph />}
              {active === "search" && <AISearchPreview />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const toneClasses = {
  amber: { dot: "fill-amber-400/80" },
  cyan: { dot: "fill-cyan-400/80" },
  sky: { dot: "fill-sky-400/80" },
  rose: { dot: "fill-rose-400/80" },
  violet: { dot: "fill-violet-400/80" },
  emerald: { dot: "fill-emerald-400/80" },
};

function MemoryGraph() {
  const center = { x: 280, y: 150, label: "Your memory" };
  const topics = [
    { x: 90, y: 60, label: "Japan" },
    { x: 470, y: 60, label: "Camera" },
    { x: 90, y: 250, label: "The move" },
    { x: 470, y: 250, label: "Mango" },
    { x: 280, y: 26, label: "Career" },
  ];
  const leaves = [
    { x: 26, y: 36, label: "flights" },
    { x: 150, y: 22, label: "ryokan" },
    { x: 545, y: 22, label: "A7 IV" },
    { x: 552, y: 116, label: "Z6 III" },
    { x: 30, y: 262, label: "lease" },
    { x: 555, y: 228, label: "vet visit" },
  ];
  const edges = [
    ...topics.map((t) => ({ x1: center.x, y1: center.y, x2: t.x, y2: t.y })),
    { x1: 90, y1: 60, x2: 26, y2: 36 },
    { x1: 90, y1: 60, x2: 150, y2: 22 },
    { x1: 470, y1: 60, x2: 545, y2: 22 },
    { x1: 470, y1: 60, x2: 552, y2: 116 },
    { x1: 90, y1: 250, x2: 30, y2: 262 },
    { x1: 470, y1: 250, x2: 555, y2: 228 },
  ];

  return (
    <svg viewBox="0 0 560 300" className="mx-auto h-[260px] w-full max-w-xl">
      <defs>
        <radialGradient id="graph-glow-lg">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="currentColor" strokeWidth="1" className="text-aurora-2/40">
        {edges.map((e) => (
          <line key={`${e.x1}-${e.y1}-${e.x2}-${e.y2}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
        ))}
      </g>
      {topics.map((t, i) => {
        const tone = ["amber", "cyan", "sky", "rose", "violet"][i % 5];
        return (
          <g key={t.label}>
            <circle cx={t.x} cy={t.y} r={17} className="fill-muted/40" />
            <circle
              cx={t.x}
              cy={t.y}
              r={14}
              className={cn("fill-current", toneClasses[tone as keyof typeof toneClasses].dot)}
            />
            <text
              x={t.x}
              y={t.y + 30}
              textAnchor="middle"
              className="fill-current text-[11px] font-medium"
            >
              {t.label}
            </text>
          </g>
        );
      })}
      {leaves.map((l) => (
        <g key={l.label}>
          <circle cx={l.x} cy={l.y} r={4} className="fill-aurora-2/85" />
          <text
            x={l.x}
            y={l.y + 15}
            textAnchor="middle"
            className="fill-current text-[9px] text-muted-foreground"
          >
            {l.label}
          </text>
        </g>
      ))}
      <circle cx={center.x} cy={center.y} r={60} fill="url(#graph-glow-lg)" />
      <circle
        cx={center.x}
        cy={center.y}
        r={24}
        className="fill-none stroke-aurora-2/60"
        strokeWidth={1}
      >
        <animate attributeName="r" values="20;26;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={center.x} cy={center.y} r={9} className="fill-card" />
      <circle cx={center.x} cy={center.y} r={4.5} className="fill-aurora-2" />
    </svg>
  );
}

function TimelinePreview() {
  const rows = [
    { date: "Apr 11", memory: memories.find((m) => m.id === "m34")! },
    { date: "Apr 10", memory: memories.find((m) => m.id === "m23")! },
    { date: "Apr 9", memory: memories.find((m) => m.id === "m29")! },
  ];

  return (
    <div className="relative space-y-3 pl-5">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-transparent via-aurora-2/40 to-transparent" />
      {rows.map(({ date, memory }) => (
        <div key={memory.id} className="relative">
          <span className="absolute -left-5 mt-4 size-2.5 rounded-full bg-aurora-2 ring-4 ring-aurora-2/20" />
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {date}
          </p>
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 p-3 backdrop-blur-xl">
            <MemoryTypeIcon type={memory.type} />
            <div className="min-w-0">
              <p className="line-clamp-1 text-[13px] font-medium">{memory.title}</p>
              <p className="line-clamp-1 text-[11px] text-muted-foreground">
                {memory.highlight ?? memory.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectionsPreview() {
  const featured = collections.slice(0, 6);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {featured.map((c) => (
        <div
          key={c.id}
          className="relative overflow-hidden rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-xl"
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b opacity-60",
              c.color
            )}
          />
          <div className="relative">
            <span className="text-2xl">{c.emoji}</span>
            <p className="mt-2 font-semibold tracking-tight">{c.name}</p>
            <p className="line-clamp-1 text-[11px] text-muted-foreground">
              {c.memoryCount} memories · {c.description.split(",")[0]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AISearchPreview() {
  const sources = ["m1", "m3", "m30"]
    .map((id) => memories.find((m) => m.id === id))
    .filter((m) => m !== undefined);

  return (
    <div className="mx-auto max-w-lg space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-3.5 py-2.5 text-sm backdrop-blur-xl">
        <Search className="size-4 text-aurora-2" />
        <span className="text-muted-foreground">What have I been researching lately?</span>
      </div>
      <div className="rounded-xl border border-aurora-2/20 bg-gradient-to-br from-aurora-2/10 via-card/50 to-aurora-3/10 p-4 backdrop-blur-xl">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <BookOpenText className="size-3.5 text-aurora-2" />
          AI summary
          <span className="text-muted-foreground/60">•</span>
          <span>grounded in 3 memories</span>
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/90">
          You&apos;re researching <strong className="font-semibold">three threads</strong>: cameras,
          an apartment, and Japan. <strong className="font-semibold text-aurora-2">3 cameras</strong>{" "}
          are on your shortlist within your $2,800 budget — and the{" "}
          <strong className="font-semibold">A7 IV</strong> fits best.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((memory) => (
          <span
            key={memory.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-xl"
          >
            <MemoryTypeIcon type={memory.type} size="sm" className="size-auto" />
            <span className="line-clamp-1">{memory.title}</span>
          </span>
        ))}
      </div>
    </div>
  );
}