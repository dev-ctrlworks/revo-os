"use client";

import { CalendarDays, FolderOpen, Network, BookOpenText, Search } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { memories, collections } from "@/lib/mock-data";
import { MemoryTypeIcon } from "@/components/memories/memory-type-icon";
import { cn } from "@/lib/utils";

const graph = {
  center: { x: 280, y: 170, label: "Your memory" },
  topics: [
    { x: 90, y: 70, label: "Japan" },
    { x: 470, y: 70, label: "Camera" },
    { x: 90, y: 275, label: "The move" },
    { x: 470, y: 275, label: "Mango" },
    { x: 280, y: 30, label: "Career" },
    { x: 280, y: 308, label: "Ideas" },
  ],
  leaves: [
    { x: 26, y: 40, label: "flights" },
    { x: 150, y: 26, label: "ryokan" },
    { x: 548, y: 26, label: "A7 IV" },
    { x: 556, y: 128, label: "Z6 III" },
    { x: 30, y: 288, label: "lease" },
    { x: 558, y: 250, label: "vet visit" },
  ],
};

function MemoryGraph() {
  const { center, topics, leaves } = graph;

  const topicEdges = topics.map((t) => ({
    x1: center.x,
    y1: center.y,
    x2: t.x,
    y2: t.y,
  }));
  const leafEdges = [
    { x1: 90, y1: 70, x2: 26, y2: 40 },
    { x1: 90, y1: 70, x2: 150, y2: 26 },
    { x1: 470, y1: 70, x2: 548, y2: 26 },
    { x1: 470, y1: 70, x2: 556, y2: 128 },
    { x1: 90, y1: 275, x2: 30, y2: 288 },
    { x1: 470, y1: 275, x2: 558, y2: 250 },
  ];
  const edges = [...topicEdges, ...leafEdges];

  return (
    <svg
      viewBox="0 0 560 340"
      className="mx-auto h-[300px] w-full max-w-2xl"
      role="img"
      aria-label="Memory graph connecting capture topics"
    >
      <defs>
        <radialGradient id="graph-glow">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g stroke="currentColor" strokeWidth="1" className="text-indigo-500/25">
        {edges.map((e) => (
          <line key={`${e.x1}-${e.y1}-${e.x2}-${e.y2}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
        ))}
      </g>

      {topics.map((t) => {
        const tone = ["amber", "cyan", "sky", "rose", "violet", "emerald"][
          topics.indexOf(t) % 6
        ];
        return (
          <g key={t.label}>
            <circle cx={t.x} cy={t.y} r={20} className="fill-muted/40" />
            <circle
              cx={t.x}
              cy={t.y}
              r={17}
              className={cn("fill-current", toneClasses[tone as keyof typeof toneClasses].dot)}
            />
            <circle
              cx={t.x}
              cy={t.y}
              r={17}
              className="fill-none stroke-white/20"
              strokeWidth={1}
            />
            <text
              x={t.x}
              y={t.y + 34}
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
          <circle cx={l.x} cy={l.y} r={4} className="fill-indigo-500/70" />
          <text
            x={l.x}
            y={l.y + 16}
            textAnchor="middle"
            className="fill-current text-[9px] text-muted-foreground"
          >
            {l.label}
          </text>
        </g>
      ))}

      <circle cx={center.x} cy={center.y} r={64} fill="url(#graph-glow)" />
      <circle
        cx={center.x}
        cy={center.y}
        r={26}
        className="fill-none stroke-indigo-400/60"
        strokeWidth={1}
      >
        <animate attributeName="r" values="22;28;22" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx={center.x} cy={center.y} r={26} className="fill-transparent stroke-indigo-500" strokeWidth={1.5} />
      <circle cx={center.x} cy={center.y} r={10} className="fill-card" />
      <circle cx={center.x} cy={center.y} r={5} className="fill-indigo-400" />
      <text
        x={center.x}
        y={center.y + 48}
        textAnchor="middle"
        className="fill-current text-[11px] font-semibold"
      >
        {center.label}
      </text>
    </svg>
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

function TimelinePreview() {
  const rows = [
    { date: "Apr 11", memory: memories.find((m) => m.id === "m34")! },
    { date: "Apr 10", memory: memories.find((m) => m.id === "m23")! },
    { date: "Apr 9", memory: memories.find((m) => m.id === "m29")! },
  ];

  return (
    <div className="relative space-y-3 pl-5">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent" />
      {rows.map(({ date, memory }) => (
        <div key={memory.id} className="relative">
          <span className="absolute -left-5 mt-4 size-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/15" />
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {date}
          </p>
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 p-3">
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
          className="relative overflow-hidden rounded-xl border border-border/50 bg-card/60 p-4"
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
      <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/70 px-3.5 py-2.5 text-sm">
        <Search className="size-4 text-indigo-500" />
        <span className="text-muted-foreground">What have I been researching lately?</span>
      </div>
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.06] via-card to-card/60 p-4">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <BookOpenText className="size-3.5 text-indigo-400" />
          AI summary
          <span className="text-muted-foreground/60">•</span>
          <span>grounded in 3 memories</span>
        </div>
        <p className="text-[13px] leading-relaxed text-foreground/90">
          You&apos;re researching <strong className="font-semibold">three threads</strong>: cameras,
          an apartment, and Japan. <strong className="font-semibold text-indigo-600 dark:text-indigo-400">3 cameras</strong>{" "}
          are on your shortlist within your $2,800 budget — and the{" "}
          <strong className="font-semibold">A7 IV</strong> fits best.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((memory) => (
          <span
            key={memory.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground"
          >
            <MemoryTypeIcon type={memory.type} size="sm" className="size-auto" />
            <span className="line-clamp-1">{memory.title}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <Tabs defaultValue="timeline" className="mx-auto max-w-3xl">
      <TabsList variant="line" className="mx-auto flex-wrap justify-center gap-1">
        <TabsTrigger value="timeline" className="gap-1.5 data-active:text-foreground">
          <CalendarDays className="size-3.5" />
          Timeline
        </TabsTrigger>
        <TabsTrigger value="collections" className="gap-1.5 data-active:text-foreground">
          <FolderOpen className="size-3.5" />
          Collections
        </TabsTrigger>
        <TabsTrigger value="graph" className="gap-1.5 data-active:text-foreground">
          <Network className="size-3.5" />
          Memory Graph
        </TabsTrigger>
        <TabsTrigger value="search" className="gap-1.5 data-active:text-foreground">
          <Search className="size-3.5" />
          AI Search
        </TabsTrigger>
      </TabsList>

      <div className="mt-6 rounded-2xl border border-border/60 bg-gradient-to-b from-muted/30 to-background p-5 shadow-lg shadow-black/5 sm:p-7">
        <TabsContent value="timeline">
          <TimelinePreview />
        </TabsContent>
        <TabsContent value="collections">
          <CollectionsPreview />
        </TabsContent>
        <TabsContent value="graph">
          <MemoryGraph />
        </TabsContent>
        <TabsContent value="search">
          <AISearchPreview />
        </TabsContent>
      </div>
    </Tabs>
  );
}