import {
  BrainCircuit,
  MessageCircleQuestion,
  Monitor,
  ScanLine,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: ScanLine,
    title: "Capture",
    text: "The browser extension, desktop app, and mobile app funnel notes, screenshots, links, documents, and selected activity into one place — only what you allow.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Understand",
    text: "Revo OS embeds and connects every capture. People, projects, places, and plans start linking themselves — across sources and devices.",
  },
  {
    number: "03",
    icon: MessageCircleQuestion,
    title: "Ask",
    text: "Ask in plain language. Get answers grounded in your own memory, with sources you can open and trust.",
  },
];

export function HowItWorks() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute bottom-8 left-8 top-0 w-px bg-gradient-to-b from-aurora-2/0 via-aurora-2/40 to-aurora-2/0 lg:left-1/2 lg:-translate-x-px" />

      <div className="space-y-14 lg:space-y-20">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={cn(
              "relative grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-16",
              i % 2 === 1 && "lg:[&>*:first-child]:order-2"
            )}
          >
            <div className="relative pl-12 lg:pl-0">
              <span
                className={cn(
                  "absolute left-0 top-1 flex size-8 items-center justify-center rounded-full border border-aurora-2/40 bg-background font-display text-xs font-semibold text-aurora-2 ring-4 ring-aurora-2/10",
                  "lg:static lg:mb-4 lg:inline-flex"
                )}
              >
                {step.number}
              </span>
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl icon-chip lg:hidden">
                <step.icon className="size-5 text-aurora-2" />
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{step.text}</p>
              <div className="mt-5 hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
                <span className="flex size-8 items-center justify-center rounded-lg icon-chip">
                  <step.icon className="size-4 text-aurora-2" />
                </span>
                {stepLineCaption(step.number)}
              </div>
            </div>

            <div className="pl-12 lg:pl-0">
              <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                {visualFor(step.number)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function stepLineCaption(number: string) {
  if (number === "01") return "Meta: sources → memory";
  if (number === "02") return "Embedding · linking · clustering";
  return "Grounding · retrieval · citations";
}

function visualFor(number: string) {
  if (number === "01") {
    return (
      <div className="space-y-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Sources in, one funnel
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { icon: Monitor, label: "Desktop app" },
            { icon: Smartphone, label: "Mobile" },
            { icon: Sparkles, label: "Extension" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-xs font-medium"
            >
              <Icon className="size-3.5 text-aurora-2" />
              {label}
            </span>
          ))}
          <span className="text-aurora-2/60">→</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-aurora-2/25 bg-gradient-to-br from-aurora-2/[0.09] to-card px-3 py-2.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-aurora-2" />
          Screenshot_2026-04-12.png captured and embedded
        </div>
      </div>
    );
  }
  if (number === "02") {
    return <Cluster />;
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm text-muted-foreground">
        <Sparkles className="size-4 text-aurora-2" />
        Which cameras fit my budget?
        <span className="ml-auto size-1.5 animate-pulse rounded-full bg-aurora-2" />
      </div>
      <div className="rounded-xl border border-aurora-2/25 bg-gradient-to-br from-aurora-2/[0.09] via-card to-card/70 p-4 text-sm leading-relaxed">
        <span className="font-semibold text-aurora-2">3 cameras</span> on your shortlist
        within <span className="font-semibold">$2,800</span> — the{" "}
        <span className="font-semibold">Sony A7 IV</span> fits best.
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["camera-decision.md", "tamron review", "budget screenshot"].map((s) => (
            <span
              key={s}
              className="rounded-full border border-border/60 bg-card/70 px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cluster() {
  const nodes = [
    { x: 60, y: 40, label: "Japan", tone: "fill-rose-400/80" },
    { x: 220, y: 26, label: "rental", tone: "fill-cyan-400/80" },
    { x: 130, y: 120, label: "Camera", tone: "fill-violet-400/80" },
    { x: 250, y: 140, label: "lease", tone: "fill-amber-400/80" },
    { x: 40, y: 150, label: "ideas", tone: "fill-emerald-400/80" },
  ];
  const center = { x: 145, y: 85 };
  const edges = nodes.map((n) => ({
    x1: center.x,
    y1: center.y,
    x2: n.x,
    y2: n.y,
  }));

  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Embeddings link themselves
      </p>
      <svg viewBox="0 0 280 170" className="w-full">
        <g stroke="currentColor" strokeWidth="1" className="text-aurora-2/40">
          {edges.map((e) => (
            <line key={`${e.x1}-${e.y1}`} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
          ))}
        </g>
        {nodes.map((n) => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r={9} className={cn("fill-current", n.tone)} />
            <text
              x={n.x}
              y={n.y + 24}
              textAnchor="middle"
              className="fill-current text-[9px] font-medium"
            >
              {n.label}
            </text>
          </g>
        ))}
        <circle cx={center.x} cy={center.y} r={16} className="fill-aurora-2/20" />
        <circle cx={center.x} cy={center.y} r={7} className="fill-aurora-2" />
        <text
          x={center.x}
          y={center.y + 34}
          textAnchor="middle"
          className="fill-current text-[10px] font-semibold"
        >
          your memory
        </text>
      </svg>
    </div>
  );
}