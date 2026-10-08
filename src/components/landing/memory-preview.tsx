import type { CSSProperties } from "react";
import {
  Check,
  LinkIcon,
  Monitor,
  Newspaper,
  Search,
  Sparkles,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nodes: { label: string; icon: LucideIcon; cls: string; tone: string; chip: string }[] = [
  { label: "Screenshot", icon: Monitor, cls: "left-[5%] top-[14%]", tone: "text-cyan-500", chip: "border-cyan-400/25 bg-cyan-400/10" },
  { label: "Note", icon: StickyNote, cls: "left-[5%] top-[70%]", tone: "text-violet-500", chip: "border-violet-400/25 bg-violet-400/10" },
  { label: "Link", icon: LinkIcon, cls: "right-[5%] top-[22%]", tone: "text-sky-500", chip: "border-sky-400/25 bg-sky-400/10" },
  { label: "Page", icon: Newspaper, cls: "right-[5%] top-[72%]", tone: "text-rose-500", chip: "border-rose-400/25 bg-rose-400/10" },
];

const links: { d: string; tone: string; mid: [number, number] }[] = [
  { d: "M 20 19 C 32 22, 38 42, 50 50", tone: "text-cyan-500", mid: [31, 29] },
  { d: "M 20 75 C 32 74, 38 58, 50 50", tone: "text-violet-500", mid: [31, 66] },
  { d: "M 80 27 C 68 26, 62 42, 50 50", tone: "text-sky-500", mid: [69, 29] },
  { d: "M 80 77 C 68 76, 62 58, 50 50", tone: "text-rose-500", mid: [69, 66] },
];

const ranked = [
  { name: "Sony A7 IV", match: 92 },
  { name: "Nikon Z6 III", match: 71 },
  { name: "Fujifilm X-T5", match: 64 },
];

export function MemoryPreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-xl">
      <div className="absolute -inset-8 -z-10 bg-gradient-to-br from-aurora-1/25 via-aurora-2/10 to-aurora-4/20 blur-3xl" />
      <div
        className="aurora-orb left-[-10%] top-[30%] -z-10 size-56 opacity-50"
        style={{ "--color": "var(--aurora-2)" } as CSSProperties}
      />

      <div className="relative overflow-hidden rounded-[26px] border border-border/50 bg-card/75 shadow-[0_32px_80px_-40px_rgba(30,27,46,0.45)] backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-px animate-gradient-x bg-gradient-to-r from-aurora-1 via-aurora-3 to-aurora-1" />

        <div className="relative h-60 overflow-hidden sm:h-72">
          <svg
            aria-hidden
            fill="none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 hidden h-full w-full sm:block"
          >
            <circle
              cx="50"
              cy="50"
              r="34"
              stroke="currentColor"
              strokeOpacity="0.4"
              vectorEffect="non-scaling-stroke"
              className="animate-path-flow text-aurora-2"
            />
            {links.map((link) => (
              <path
                key={link.d}
                d={link.d}
                stroke="currentColor"
                strokeOpacity="0.5"
                vectorEffect="non-scaling-stroke"
                className={cn("animate-path-flow", link.tone)}
              />
            ))}
            {links.map((link) => (
              <circle
                key={`${link.mid[0]}-${link.mid[1]}`}
                cx={link.mid[0]}
                cy={link.mid[1]}
                r="1.4"
                className={cn("animate-pulse fill-current", link.tone)}
              />
            ))}
          </svg>

          {nodes.map((node) => (
            <span
              key={node.label}
              className={cn(
                "absolute hidden items-center gap-1.5 rounded-full border bg-card/90 px-2.5 py-1.5 text-[10px] font-medium text-foreground/80 shadow-md shadow-black/5 backdrop-blur-xl sm:flex",
                node.cls,
                node.chip
              )}
            >
              <node.icon className={cn("size-3.5", node.tone)} />
              {node.label}
            </span>
          ))}

          <div className="absolute left-1/2 top-1/2 w-[186px] -translate-x-1/2 -translate-y-1/2 sm:w-[210px]">
            <div
              className="aurora-orb absolute -inset-12 -z-10 size-auto opacity-60"
              style={{ "--color": "var(--aurora-2)" } as CSSProperties}
            />
            <div className="relative rounded-[22px] border border-aurora-2/40 bg-card/90 p-4 text-center shadow-[0_24px_60px_-28px_color-mix(in_oklab,var(--aurora-2)_80%,transparent)] backdrop-blur-2xl">
              <span className="mb-1.5 flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                <Search className="size-3 text-aurora-2" />
                Revo OS · memory
              </span>
              <p className="truncate text-[11px] font-medium text-foreground/85">
                Which camera should I buy?
              </p>
              <div className="animate-dash mx-auto my-2.5 h-px w-16" />
              <p className="text-gradient text-base font-semibold">Sony A7 IV</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-aurora-2/25 bg-aurora-2/10 px-2 py-0.5 text-[10px] font-semibold text-aurora-2">
                <span className="size-1 animate-pulse rounded-full bg-aurora-2" />
                92% fit
              </span>
            </div>
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
                <span className="tabular-nums opacity-80">{camera.match}%</span>
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Sparkles className="size-3 text-aurora-2" />
              local-first
            </span>
          </div>
          <p className="mt-2.5 text-[10px] text-muted-foreground">
            38 memories searched · 4 sources, one answer — every source open
          </p>
        </div>
      </div>
    </div>
  );
}