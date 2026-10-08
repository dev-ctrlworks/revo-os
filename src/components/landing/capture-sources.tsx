import {
  Bookmark,
  FileText,
  Keyboard,
  LinkIcon,
  Monitor,
  MousePointerClick,
  PlugZap,
  Search,
  Sparkles,
  StickyNote,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sources: {
  icon: LucideIcon;
  name: string;
  tone: string;
  chipBg: string;
  tagline: string;
  route: { icon: LucideIcon; label: string };
}[] = [
  { icon: StickyNote, name: "Notes", tone: "text-violet-500", chipBg: "bg-violet-400/10", tagline: "typed ideas, auto-linked", route: { icon: Keyboard, label: "⌘K" } },
  { icon: Monitor, name: "Screenshots", tone: "text-cyan-500", chipBg: "bg-cyan-400/10", tagline: "OCR — every word searchable", route: { icon: Sparkles, label: "auto" } },
  { icon: LinkIcon, name: "Links & pages", tone: "text-sky-500", chipBg: "bg-sky-400/10", tagline: "full pages embedded", route: { icon: PlugZap, label: "extension" } },
  { icon: FileText, name: "Documents", tone: "text-rose-500", chipBg: "bg-rose-400/10", tagline: "text + structure extracted", route: { icon: Upload, label: "drag & drop" } },
  { icon: Search, name: "Web activity", tone: "text-emerald-500", chipBg: "bg-emerald-400/10", tagline: "visits summarized & connected", route: { icon: MousePointerClick, label: "opt-in" } },
  { icon: Bookmark, name: "Bookmarks", tone: "text-amber-500", chipBg: "bg-amber-400/10", tagline: "re-indexed, now findable", route: { icon: Bookmark, label: "kept" } },
];

export function CaptureSources() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source, i) => {
          const Icon = source.icon;
          const RouteIcon = source.route.icon;
          return (
            <div
              key={source.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/55 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-2/40 hover:bg-card/70 hover:shadow-[0_18px_44px_-28px_color-mix(in_oklab,var(--aurora-2)_45%,transparent)]"
            >
              <Scene step={i} tone={source.tone} />

              <div className="flex flex-1 flex-col gap-2 px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <span className={`relative grid size-8 shrink-0 place-items-center rounded-lg ${source.chipBg}`}>
                    <Icon className={`size-3.5 ${source.tone}`} />
                    <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-emerald-400 ring-2 ring-card" />
                  </span>
                  <h3 className="font-display text-sm font-semibold tracking-tight">{source.name}</h3>
                  <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                    <RouteIcon className="size-3" />
                    {source.route.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{source.tagline}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-5 flex max-w-fit items-center gap-1.5 rounded-full border border-aurora-2/20 bg-gradient-to-r from-aurora-2/5 via-aurora-2/10 to-aurora-3/5 px-5 py-1.5 text-[11px] text-foreground/70">
        <Sparkles className="size-3.5 text-aurora-2" />
        Six sources. One memory. Fully private.
      </p>
    </div>
  );
}

function Scene({ step, tone }: { step: number; tone: string }) {
  return (
    <div className="relative h-24 overflow-hidden border-b border-border/40 bg-card/40">
      <SceneInner step={step} tone={tone} />
    </div>
  );
}

function Chip({ text, tone }: { text: string; tone: string }) {
  return (
    <span
      className={cn(
        "absolute right-2 top-2 z-10 rounded-full border border-white/10 bg-card/90 px-2 py-0.5 text-[9px] font-semibold shadow-sm backdrop-blur-xl",
        tone
      )}
    >
      {text}
    </span>
  );
}

function SceneInner({ step, tone }: { step: number; tone: string }) {
  if (step === 0) {
    return (
      <div className="relative flex h-full items-center justify-center bg-violet-500/10">
        <div className="w-[56%] -rotate-3 rounded-md border border-violet-300/40 bg-card/95 p-2 shadow-sm">
          <div className="space-y-1.5">
            <span className="block h-1 w-full rounded-full bg-violet-300/30" />
            <span className="block h-1 w-4/5 rounded-full bg-violet-300/30" />
            <span className="block h-1 w-3/5 rounded-full bg-violet-400/60" />
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-cyan-300/50 via-sky-300/25 to-cyan-400/40">
        <span className="absolute right-6 top-4 size-5 rounded-full bg-white/80" />
        <span className="absolute -bottom-4 left-1/2 h-10 w-[130%] -translate-x-1/2 rounded-[50%] bg-cyan-400/25" />
        <span className="animate-scan absolute inset-x-2 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" />
        <Chip text="OCR · 312 words" tone={tone} />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="relative h-full bg-sky-500/10 p-2.5">
        <div className="flex h-full flex-col overflow-hidden rounded-lg border border-sky-300/40 bg-card/95 shadow-sm">
          <div className="flex h-4 shrink-0 items-center gap-1 border-b border-sky-300/20 px-1.5">
            <span className="size-1 rounded-full bg-sky-400/50" />
            <span className="size-1 rounded-full bg-sky-400/50" />
            <span className="size-1 rounded-full bg-sky-400/50" />
            <span className="ml-1.5 h-1.5 w-1/2 rounded-full bg-sky-300/40" />
          </div>
          <div className="space-y-1 p-1.5">
            <span className="block h-1 w-full rounded-full bg-sky-300/30" />
            <span className="block h-1 w-3/4 rounded-full bg-sky-300/30" />
            <span className="block h-1 w-1/2 rounded-full bg-sky-300/30" />
          </div>
        </div>
        <Chip text="embedded" tone={tone} />
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="relative h-full bg-rose-500/10">
        <div className="absolute left-1/2 top-1/2 h-12 w-20 -translate-x-[62%] -translate-y-1/2 rotate-2 rounded-md border border-rose-300/40 bg-rose-200/40" />
        <div className="absolute left-1/2 top-1/2 h-14 w-20 -translate-x-1/2 -translate-y-1/2 rounded-md border border-rose-300/50 bg-card/95 p-2 shadow-sm">
          <div className="space-y-1">
            <span className="block h-1 w-full rounded-full bg-rose-300/30" />
            <span className="block h-1 w-4/5 rounded-full bg-rose-300/30" />
            <span className="block h-1 w-3/5 rounded-full bg-rose-300/30" />
          </div>
          <span className="absolute bottom-0 right-0 size-3 rounded-br-md bg-gradient-to-br from-rose-300/50 to-rose-400/50" />
        </div>
        <Chip text="12 pages" tone={tone} />
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="relative h-full bg-emerald-500/10">
        <svg viewBox="0 0 96 80" preserveAspectRatio="none" className="h-full w-full">
          <g stroke="currentColor" strokeWidth="0.5" className="text-emerald-400/40">
            <line x1="48" y1="40" x2="16" y2="18" />
            <line x1="48" y1="40" x2="84" y2="16" />
            <line x1="48" y1="40" x2="26" y2="66" />
            <line x1="48" y1="40" x2="78" y2="68" />
          </g>
          <circle cx="16" cy="18" r="2.4" className="animate-pulse fill-emerald-400/70" />
          <circle cx="84" cy="16" r="2" className="animate-pulse fill-emerald-400/70" />
          <circle cx="26" cy="66" r="2" className="animate-pulse fill-emerald-400/70" />
          <circle cx="78" cy="68" r="2.4" className="animate-pulse fill-emerald-400/70" />
          <circle cx="48" cy="40" r="6.5" className="fill-emerald-400/20" />
          <circle cx="48" cy="40" r="3.2" className="animate-pulse fill-emerald-400" />
        </svg>
        <Chip text="3 visits" tone={tone} />
      </div>
    );
  }

  return (
    <div className="relative h-full bg-amber-500/10">
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-end gap-2">
        <span className="h-8 w-4 -rotate-6 rounded-t-sm border border-amber-400/40 bg-amber-400/50 [clip-path:polygon(50%_0,100%_0,100%_100%,50%_82%,0_100%,0_0)]" />
        <span className="h-10 w-5 rounded-t-sm bg-amber-400 shadow-[0_6px_16px_-4px_rgba(251,191,36,0.6)] [clip-path:polygon(50%_0,100%_0,100%_100%,50%_82%,0_100%,0_0)]" />
        <span className="h-8 w-4 rotate-6 rounded-t-sm border border-amber-400/40 bg-amber-400/50 [clip-path:polygon(50%_0,100%_0,100%_100%,50%_82%,0_100%,0_0)]" />
      </div>
      <Chip text="pinned" tone={tone} />
    </div>
  );
}