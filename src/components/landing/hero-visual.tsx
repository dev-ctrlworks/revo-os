import type { CSSProperties } from "react";
import {
  Check,
  FileText,
  Lightbulb,
  LinkIcon,
  Monitor,
  Plane,
  Search,
  Sparkles,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { memories } from "@/lib/mock-data";

const inputs: { label: string; icon: LucideIcon; tone: string; chip: string }[] = [
  { label: "Screenshot", icon: Monitor, tone: "text-cyan-500", chip: "border-cyan-400/25 bg-cyan-400/10" },
  { label: "Link", icon: LinkIcon, tone: "text-sky-500", chip: "border-sky-400/25 bg-sky-400/10" },
  { label: "Note", icon: StickyNote, tone: "text-violet-500", chip: "border-violet-400/25 bg-violet-400/10" },
  { label: "PDF", icon: FileText, tone: "text-rose-500", chip: "border-rose-400/25 bg-rose-400/10" },
  { label: "Trip plan", icon: Plane, tone: "text-emerald-500", chip: "border-emerald-400/25 bg-emerald-400/10" },
  { label: "Idea", icon: Lightbulb, tone: "text-amber-500", chip: "border-amber-400/25 bg-amber-400/10" },
];

const sources = [
  { id: "m1", title: "Sony A7 IV spec sheet" },
  { id: "m30", title: "Tamron 24-70 review" },
  { id: "m3", title: "Camera decision criteria" },
  { id: "m5", title: "Used A7 IV market check" },
];

const ranked = [
  { name: "Sony A7 IV", match: "Top match" },
  { name: "Nikon Z6 III", match: "Runner-up" },
  { name: "Fujifilm X-T5", match: "Compromise" },
];

export function HeroVisual() {
  const sourced = sources.filter((s) => memories.some((m) => m.id === s.id));

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-8 -z-10 bg-gradient-to-br from-aurora-1/25 via-aurora-2/10 to-aurora-4/20 blur-3xl" />
      <div
        className="aurora-orb left-[-10%] top-[30%] -z-10 size-56 opacity-50"
        style={{ "--color": "var(--aurora-2)" } as CSSProperties}
      />

      <div className="relative overflow-hidden rounded-[26px] border border-border/50 bg-card/75 shadow-[0_32px_80px_-40px_rgba(30,27,46,0.45)] backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-px animate-gradient-x bg-gradient-to-r from-aurora-1 via-aurora-3 to-aurora-1" />

        <div className="border-b border-border/40 px-4 py-4 sm:px-5">
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Everything you save
          </p>
          <div className="flex flex-wrap gap-1.5">
            {inputs.map((item) => (
              <span
                key={item.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border bg-card/90 px-2.5 py-1 text-[11px] font-medium text-foreground/80 shadow-sm backdrop-blur-xl",
                  item.chip
                )}
              >
                <item.icon className={cn("size-3.5", item.tone)} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative px-4 py-6 sm:px-5">
          <div
            className="aurora-orb absolute inset-x-8 top-1/3 -z-10 h-24 opacity-50"
            style={{ "--color": "var(--aurora-2)" } as CSSProperties}
          />
          <div className="relative mx-auto max-w-[340px] rounded-[22px] border border-aurora-2/40 bg-card/90 p-4 shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--aurora-2)_80%,transparent)] backdrop-blur-2xl">
            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              <Search className="size-3 text-aurora-2" />
              Ask in plain language
            </span>
            <p className="truncate text-[12px] font-medium text-foreground/85">
              &ldquo;Which camera was I considering?&rdquo;
            </p>
            <div className="animate-dash mx-auto my-2.5 h-px w-16" />
            <p className="text-gradient text-lg font-semibold">Sony A7 IV</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Best full-frame fit under your $2,800 budget — with the Tamron 24-70.
            </p>
          </div>
        </div>

        <div className="border-t border-border/40 p-3.5 sm:px-5 sm:py-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {ranked.map((camera, i) => (
              <span
                key={camera.name}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                  i === 0
                    ? "animate-gradient-x border-transparent bg-[length:200%_200%] bg-gradient-to-r from-aurora-1 to-aurora-3 text-white shadow-[0_8px_20px_-10px_color-mix(in_oklab,var(--aurora-2)_80%,transparent)]"
                    : "border-border/50 bg-card/60 text-muted-foreground"
                )}
              >
                {i === 0 && <Check className="size-3" />}
                {camera.name}
                <span className="opacity-80">{camera.match}</span>
              </span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              From
            </span>
            {sourced.map((s) => (
              <span
                key={s.title}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur-xl"
              >
                <Sparkles className="size-3 text-aurora-2" />
                <span className="line-clamp-1">{s.title}</span>
              </span>
            ))}
          </div>
          <p className="mt-2.5 text-[10px] text-muted-foreground">
            Illustrative example · {memories.length} sample memories, one grounded answer
          </p>
        </div>
      </div>
    </div>
  );
}
