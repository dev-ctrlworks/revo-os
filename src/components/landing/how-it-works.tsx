import { Fragment } from "react";
import {
  ArrowDown,
  ArrowRight,
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
    step: "Ingest",
    title: "Capture",
    text: "Browser extension, desktop, and mobile route notes, screenshots, links, documents, and selected browsing into one place — only what you allow.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    step: "Connect",
    title: "Understand",
    text: "Every capture is embedded and linked. People, projects, places, and plans start connecting themselves across sources and devices.",
  },
  {
    number: "03",
    icon: MessageCircleQuestion,
    step: "Retrieve",
    title: "Ask",
    text: "Ask in plain language. Answers are grounded in your own memory, with sources you can open and trust.",
  },
];

export function HowItWorks() {
  return (
    <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
      {steps.map((step, i) => (
        <Fragment key={step.number}>
          {i > 0 && <Connector />}
          <StepCard step={step} />
        </Fragment>
      ))}
    </div>
  );
}

function StepCard({ step }: { step: (typeof steps)[number] }) {
  const Icon = step.icon;
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/55 p-6 shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)] backdrop-blur-xl transition-colors hover:border-aurora-2/40 hover:bg-card/70">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-aurora-2/0 via-aurora-2/50 to-aurora-3/0" />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-3 right-4 font-display text-6xl font-bold tracking-tight text-aurora-2/[0.08]"
      >
        {step.number}
      </span>

      <span className="grid size-11 place-items-center rounded-xl icon-chip">
        <Icon className="size-5 text-aurora-2" />
      </span>
      <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-aurora-2">{step.step}</p>
      <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">{step.title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{step.text}</p>

      <div className="mt-5 rounded-xl border border-dashed border-border/40 bg-card/40 p-3.5">
        <Visual number={step.number} />
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center justify-center md:w-16">
      <span className="hidden rounded-full border border-aurora-2/30 bg-aurora-2/10 p-2 shadow-[0_8px_20px_-10px_rgba(124,92,255,0.5)] md:block">
        <ArrowRight className="size-4 text-aurora-2" />
      </span>
      <span className="flex flex-col items-center md:hidden">
        <span className="h-6 w-px bg-gradient-to-b from-aurora-2/30 to-aurora-3/80" />
        <ArrowDown className="mt-1 size-3.5 text-aurora-3" />
      </span>
    </div>
  );
}

function Visual({ number }: { number: string }) {
  if (number === "01") {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { icon: Monitor, label: "Desktop" },
            { icon: Smartphone, label: "Mobile" },
            { icon: Sparkles, label: "Extension" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 rounded-lg border border-border/50 bg-card/55 px-2 py-1 text-[10px] font-medium"
            >
              <Icon className="size-3 text-aurora-2" />
              {label}
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <ArrowRight className="size-3 shrink-0 text-aurora-3" />
          <span className="rounded bg-aurora-2/12 px-1.5 py-0.5 font-medium text-aurora-2">
            Screenshot_0412.png
          </span>
          <span>captured & embedded</span>
        </div>
      </div>
    );
  }

  if (number === "02") {
    return <Cluster />;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-card/55 px-2.5 py-1.5 text-[11px] text-muted-foreground">
        <Sparkles className="size-3 text-aurora-2" />
        <span className="truncate">Which cameras fit my budget?</span>
      </div>
      <div className="rounded-lg border border-aurora-2/20 bg-gradient-to-br from-aurora-2/10 via-card/50 to-aurora-3/10 px-2.5 py-2 text-[11px] leading-relaxed">
        <span className="font-semibold text-aurora-2">Sony A7 IV</span> — best within $2,800.
        <span className="ml-1.5 inline-block rounded-full border border-border/50 bg-card/60 px-1.5 py-0.5 text-[9px] text-muted-foreground">
          from 3 sources
        </span>
      </div>
    </div>
  );
}

function Cluster() {
  const nodes = [
    { x: 56, y: 40, label: "Japan", tone: "fill-rose-400/80", anchor: "middle" as const },
    { x: 170, y: 26, label: "rental", tone: "fill-cyan-400/80", anchor: "middle" as const },
    { x: 108, y: 102, label: "Camera", tone: "fill-violet-400/80", anchor: "middle" as const },
    { x: 190, y: 104, label: "lease", tone: "fill-amber-400/80", anchor: "middle" as const },
    { x: 32, y: 112, label: "ideas", tone: "fill-emerald-400/80", anchor: "middle" as const },
  ];
  const center = { x: 120, y: 70 };
  const edges = nodes.map((n) => ({
    x1: center.x,
    y1: center.y,
    x2: n.x,
    y2: n.y,
  }));

  return (
    <svg viewBox="0 0 220 130" className="w-full">
      <g stroke="currentColor" strokeWidth="1" className="text-aurora-2/40">
        {edges.map((e) => (
          <line
            key={`${e.x2}-${e.y2}`}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
          />
        ))}
      </g>
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r={6} className={cn("fill-current", n.tone)} />
          <text
            x={n.x}
            y={n.y + 18}
            textAnchor={n.anchor}
            className="fill-current text-[8px] font-medium text-muted-foreground"
          >
            {n.label}
          </text>
        </g>
      ))}
      <circle cx={center.x} cy={center.y} r={11} className="fill-aurora-2/20" />
      <circle cx={center.x} cy={center.y} r={5} className="fill-aurora-2" />
      <text
        x={center.x}
        y={center.y + 26}
        textAnchor="middle"
        className="fill-current text-[9px] font-semibold text-aurora-2"
      >
        your memory
      </text>
    </svg>
  );
}