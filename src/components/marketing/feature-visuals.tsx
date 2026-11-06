import type { ReactNode } from "react";
import {
  ArrowRightLeft,
  Bookmark,
  Check,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Link as LinkIcon,
  Lock,
  Monitor,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { hueTints } from "./content";
import { TypingText } from "./typing-text";

function Shell({ hue, children }: { hue: number; children: ReactNode }) {
  const { bg } = hueTints(hue);
  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(150deg, ${bg} 0%, #fbfbff 92%)` }}
    >
      <div className="flex h-full w-full flex-col p-3.5 sm:p-4">{children}</div>
    </div>
  );
}

function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-white shadow-sm">
      <div className="min-h-0 flex-1 overflow-hidden p-3">{children}</div>
    </div>
  );
}

function Bar({ w, className }: { w: string; className?: string }) {
  return (
    <span
      className={`block h-1.5 rounded-full bg-foreground/12 ${className ?? ""}`}
      style={{ width: w }}
    />
  );
}

/* 0 — Save anything: the capture inbox */
function SaveUI() {
  const rows = [
    { icon: LinkIcon, tone: "var(--sky)" },
    { icon: Monitor, tone: "var(--pink)" },
    { icon: StickyNote, tone: "var(--lime)" },
    { icon: FileText, tone: "var(--cyan)" },
  ];
  return (
    <Chrome>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-2 py-1.5">
        <LinkIcon className="mkt-blink size-3 text-primary" />
        <Bar w="62%" />
        <span className="mkt-caret text-foreground/50" />
        <span className="ml-auto rounded bg-primary px-1.5 py-0.5 text-[7px] font-medium text-primary-foreground">
          Save
        </span>
      </div>
      <div className="relative mt-2 space-y-1.5 overflow-hidden">
        <span aria-hidden className="mkt-scan" />
        {rows.map((r, i) => (
          <div
            key={i}
            className="mkt-rise relative flex items-center gap-2 overflow-hidden rounded-lg border border-border/70 bg-white px-2 py-1.5"
            style={{ animationDelay: `${0.1 + i * 0.14}s` }}
          >
            <span
              aria-hidden
              className="mkt-cycle-row pointer-events-none absolute inset-0 bg-primary/[0.06]"
              style={{ animationDelay: `${i * 1.4}s` }}
            />
            <span
              className="grid size-5 shrink-0 place-items-center rounded-md"
              style={{ backgroundColor: `color-mix(in oklab, ${r.tone} 45%, white)` }}
            >
              <r.icon className="size-2.5 text-heading" />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <Bar w={i % 2 ? "54%" : "66%"} />
              <Bar w="34%" />
            </div>
            <Check className="size-3 shrink-0 text-primary" />
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* 1 — Ask in plain language: grounded answer */
function AskUI() {
  return (
    <Chrome>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5">
        <Sparkles className="size-3 shrink-0 text-primary" />
        <TypingText
          text="Which camera was I leaning towards?"
          className="whitespace-nowrap text-[8px] font-medium text-heading"
        />
        <span className="mkt-caret text-primary" />
      </div>
      <div className="mkt-rise mt-2 rounded-lg border border-primary/25 bg-primary/[0.05] p-2.5" style={{ animationDelay: "0.15s" }}>
        <span className="flex items-center gap-1 text-[7px] font-medium uppercase tracking-wide text-muted-foreground">
          <Sparkles className="mkt-blink size-2.5 text-primary" />
          Answer · from 4 memories
        </span>
        <p className="mt-1 text-[8.5px] font-semibold leading-snug text-primary">
          Sony A7 IV
        </p>
        <div className="mkt-glow mt-1.5 space-y-1">
          <Bar w="92%" />
          <Bar w="78%" />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="mkt-rise flex items-center gap-1.5 rounded-md border border-border/70 bg-white px-1.5 py-1"
            style={{ animationDelay: `${0.35 + i * 0.12}s` }}
          >
            <span className="size-4 rounded bg-secondary" />
            <Bar w="60%" />
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* 2 — See the connections: knowledge graph */
function ConnectionsUI() {
  const nodes = [
    { x: 20, y: 26, tone: "var(--sky)" },
    { x: 78, y: 22, tone: "var(--lime)" },
    { x: 16, y: 74, tone: "var(--pink)" },
    { x: 82, y: 70, tone: "var(--cyan)" },
  ];
  return (
    <Chrome>
      <div className="relative h-full w-full">
        <svg
          className="absolute inset-0 h-full w-full text-primary"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {nodes.map((n, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={n.x}
              y2={n.y}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity="0.3"
            />
          ))}
        </svg>
        <svg
          className="absolute inset-0 h-full w-full text-primary opacity-70"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {nodes.map((n, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={n.x}
              y2={n.y}
              stroke="currentColor"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
              className="mkt-path-flow"
            />
          ))}
        </svg>
        <span className="mkt-blink absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 bg-white px-2 py-1 text-[8px] font-semibold text-heading shadow-sm">
          Camera research
        </span>
        {nodes.map((n, i) => (
          <span
            key={i}
            className="absolute grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-border/70 bg-white shadow-sm"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              aria-hidden
              className="mkt-ping pointer-events-none absolute inset-0 rounded-lg border border-primary/50"
              style={{ animationDelay: `${i * 0.45}s` }}
            />
            <span
              className="size-2.5 rounded"
              style={{ backgroundColor: `color-mix(in oklab, ${n.tone} 55%, white)` }}
            />
          </span>
        ))}
      </div>
    </Chrome>
  );
}

/* 3 — Search everything: full-text results */
function SearchUI() {
  const rows = [
    { tone: "var(--sky)", label: "Japan trip", active: true },
    { tone: "var(--lime)", label: "Apartment", active: false },
    { tone: "var(--pink)", label: "Camera", active: false },
  ];
  return (
    <Chrome>
      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-white px-2.5 py-1.5 shadow-sm">
        <Search className="mkt-blink size-3 text-primary" />
        <span className="text-[8px] font-medium text-heading">japan trip</span>
        <span className="ml-auto text-[7px] text-muted-foreground">28</span>
      </div>
      <div className="relative mt-2 space-y-1.5 overflow-hidden">
        <span aria-hidden className="mkt-scan" />
        {rows.map((r, i) => (
          <div
            key={i}
            className={`relative flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
              r.active ? "border-primary/30 bg-primary/[0.05]" : "border-border/70 bg-white"
            }`}
          >
            {!r.active && (
              <span
                aria-hidden
                className="mkt-cycle-row pointer-events-none absolute inset-0 rounded-lg bg-primary/[0.07]"
                style={{ animationDelay: `${i * 1.4}s` }}
              />
            )}
            <span
              className="size-6 shrink-0 rounded-md"
              style={{ backgroundColor: `color-mix(in oklab, ${r.tone} 50%, white)` }}
            />
            <div className="min-w-0 flex-1 space-y-1">
              <Bar w={r.active ? "70%" : "58%"} />
              <Bar w="38%" />
            </div>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* 4 — Collections build themselves */
function CollectionsUI() {
  const groups = [
    { name: "Camera research", tone: "var(--sky)", count: "6" },
    { name: "Japan trip", tone: "var(--pink)", count: "7" },
  ];
  return (
    <Chrome>
      <div className="grid h-full grid-cols-2 gap-2">
        {groups.map((g, i) => (
          <div
            key={i}
            className="mkt-sway flex flex-col rounded-lg border border-border/70 bg-white p-2"
            style={{ animationDelay: `${i * 1.6}s` }}
          >
            <span className="flex items-center gap-1.5">
              <span className="relative size-2.5 rounded-full" style={{ backgroundColor: g.tone }}>
                <span
                  aria-hidden
                  className="mkt-ping pointer-events-none absolute inset-0 rounded-full border border-primary/60"
                  style={{ animationDelay: `${i * 0.55}s` }}
                />
              </span>
              <span className="truncate text-[8px] font-semibold text-heading">
                {g.name}
              </span>
            </span>
            <span className="mt-1 text-[7px] text-muted-foreground">
              {g.count} memories
            </span>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {[0, 1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="mkt-tile aspect-[4/3] rounded"
                  style={{
                    animationDelay: `${0.1 + (i * 4 + n) * 0.07}s`,
                    backgroundColor: `color-mix(in oklab, ${g.tone} ${
                      45 - n * 8
                    }%, white)`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-white/60 px-2 py-1.5">
        <FolderOpen className="size-3 text-muted-foreground" />
        <Bar w="46%" />
      </div>
    </Chrome>
  );
}

/* 5 — Keep the context */
function ContextUI() {
  return (
    <Chrome>
      <div className="flex items-start gap-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary">
          <Bookmark className="mkt-pulse size-3 text-heading" />
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <span className="block h-2 rounded-full bg-foreground/25" style={{ width: "72%" }} />
          <Bar w="44%" />
        </div>
      </div>
      <div className="mkt-glow mt-2 rounded-lg border border-primary/20 bg-primary/[0.05] p-2">
        <span className="text-[7px] font-semibold uppercase tracking-wide text-primary">
          Why it matters
        </span>
        <div className="mt-1.5 space-y-1">
          <Bar w="90%" />
          <Bar w="70%" />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {["camera", "under $2,800", "full-frame"].map((t, i) => (
          <span
            key={t}
            className="mkt-tile rounded-full border border-border bg-white px-1.5 py-0.5 text-[7px] text-muted-foreground"
            style={{ animationDelay: `${0.28 + i * 0.1}s` }}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 rounded-md border border-border/70 bg-white px-1.5 py-1">
        <LinkIcon className="mkt-blink size-2.5 text-primary" />
        <Bar w="52%" />
      </div>
    </Chrome>
  );
}

/* 6 — Private by default */
function PrivateUI() {
  const items = [
    { label: "Scoped to your account" },
    { label: "Private storage" },
    { label: "Signed file access" },
  ];
  return (
    <Chrome>
      <div className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.05] px-2 py-1.5">
        <Lock className="mkt-blink size-3.5 text-primary" />
        <span className="text-[8px] font-semibold text-heading">
          Private by default
        </span>
      </div>
      <div className="relative mt-2 space-y-1.5 overflow-hidden">
        <span aria-hidden className="mkt-scan" />
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-border/70 bg-white px-2 py-1.5"
          >
            <ShieldCheck className="size-3 shrink-0 text-primary" />
            <span className="truncate text-[8px] text-heading">{it.label}</span>
            <span
              className="mkt-verify ml-auto grid size-3.5 shrink-0 place-items-center rounded-full bg-primary"
              style={{ animationDelay: `${0.4 + i * 1.4}s` }}
            >
              <Check className="size-2.5 text-primary-foreground" />
            </span>
          </div>
        ))}
      </div>
    </Chrome>
  );
}

/* 7 — With you everywhere */
function EverywhereUI() {
  return (
    <Chrome>
      <div className="relative flex h-full items-center justify-center gap-3">
        <div className="w-[54%] rounded-lg border border-border/70 bg-white p-2 shadow-sm">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full" style={{ backgroundColor: "var(--sky)" }} />
            <Bar w="46%" />
          </span>
          <div className="mt-2 grid grid-cols-2 gap-1">
            {[0, 1, 2, 3].map((n) => (
              <span
                key={n}
                className="aspect-[4/3] rounded"
                style={{ backgroundColor: `color-mix(in oklab, var(--sky) ${40 - n * 6}%, white)` }}
              />
            ))}
          </div>
        </div>
        <ArrowRightLeft className="mkt-pulse size-4 shrink-0 text-primary" />
        <div className="w-[22%] rounded-[10px] border border-border/70 bg-white p-1.5 shadow-sm">
          <span className="mx-auto block h-0.5 w-3 rounded-full bg-foreground/15" />
          <div className="mt-1.5 space-y-1">
            {[0, 1, 2].map((n) => (
              <span
                key={n}
                className="block h-3 rounded"
                style={{ backgroundColor: `color-mix(in oklab, var(--pink) ${34 - n * 6}%, white)` }}
              />
            ))}
          </div>
        </div>
        <Smartphone className="absolute bottom-0 left-0 size-3 text-muted-foreground/40" />
        <ImageIcon className="absolute -right-1 -top-1 size-4 text-muted-foreground/10" />
        <span aria-hidden className="absolute left-1/2 top-1/2 h-0 w-16 -translate-x-1/2">
          <span className="mkt-track size-1.5 -translate-y-1/2 rounded-full bg-primary shadow-sm" />
        </span>
      </div>
    </Chrome>
  );
}

const VARIANTS = [
  SaveUI,
  AskUI,
  ConnectionsUI,
  SearchUI,
  CollectionsUI,
  ContextUI,
  PrivateUI,
  EverywhereUI,
];

export function FeatureVisual({ index, hue }: { index: number; hue: number }) {
  const Visual = VARIANTS[index] ?? SaveUI;
  return (
    <Shell hue={hue}>
      <Visual />
    </Shell>
  );
}
