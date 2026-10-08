import type { CSSProperties } from "react";
import { Check, LinkIcon, Monitor, Search, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { memories } from "@/lib/mock-data";
import { MemoryTypeIcon } from "@/components/memories/memory-type-icon";

const sourceIds = ["m1", "m3", "m4", "m5"];
const sources = sourceIds
  .map((id) => memories.find((m) => m.id === id))
  .filter((m) => m !== undefined);

const ranked = [
  {
    name: "Sony A7 IV",
    match: 92,
    price: "$2,499",
    note: "full-frame · IBIS · class-leading AF",
    winner: true,
  },
  { name: "Nikon Z6 III", match: 71, price: "$2,499", note: "strong hybrid video", winner: false },
  { name: "Fujifilm X-T5", match: 64, price: "$1,699", note: "stills-first compromise", winner: false },
];

export function MemoryPreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-xl">
      <div className="absolute -inset-8 -z-10 bg-gradient-to-br from-aurora-1/25 via-aurora-2/10 to-aurora-4/20 blur-3xl" />
      <div
        className="aurora-orb left-[-12%] top-[-16%] -z-10 size-60 opacity-50"
        style={{ "--color": "var(--aurora-2)" } as CSSProperties}
      />
      <div
        className="aurora-orb right-[-12%] bottom-[-18%] -z-10 size-64 opacity-40"
        style={{ "--color": "var(--aurora-3)", animationDelay: "3.2s" } as CSSProperties}
      />

      <div className="relative overflow-hidden rounded-[26px] border border-border/50 bg-card/75 shadow-[0_32px_80px_-40px_rgba(30,27,46,0.45)] backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-px animate-gradient-x bg-gradient-to-r from-aurora-1 via-aurora-3 to-aurora-1" />

        <div className="flex h-12 items-center justify-between border-b border-border/40 px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="hidden items-center gap-1.5 text-[11px] font-medium text-muted-foreground sm:flex">
              <span className="grid size-4 place-items-center rounded brand-gradient text-[8px] font-bold text-white">
                R
              </span>
              Revo OS
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              synced
            </span>
          </div>
          <span className="hidden items-center gap-1 rounded-md border border-border/50 bg-card/60 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-flex">
            <span className="font-semibold">⌘</span>K
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2.5 overflow-hidden rounded-2xl border border-border/50 bg-card/60 py-1.5 pl-3 pr-1.5 shadow-sm backdrop-blur-xl">
            <span className="grid size-6 shrink-0 place-items-center rounded-lg icon-chip">
              <Search className="size-3.5 text-aurora-2" />
            </span>
            <p className="truncate text-sm text-foreground/90">Which camera should I buy?</p>
            <span className="inline-block h-4 w-[2px] shrink-0 animate-pulse rounded-full bg-aurora-2" />
            <span className="relative ml-auto inline-flex shrink-0 items-center gap-1 overflow-hidden rounded-full bg-gradient-to-r from-aurora-1 to-aurora-3 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_6px_18px_-8px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]">
              <span className="animate-shimmer absolute inset-0" />
              Ask
              <span className="text-white/70">↵</span>
            </span>
          </div>

          <div className="mb-3 mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-aurora-2">
              <Sparkles className="size-3" />
              Ranked answer
            </span>
            <span className="size-1 rounded-full bg-aurora-2/40" />
            <span>searched 38 memories</span>
            <span className="size-1 rounded-full bg-aurora-2/40" />
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 animate-pulse rounded-full bg-aurora-2" />
              0.9s
            </span>
          </div>

          <div className="space-y-1.5">
            {ranked.map((camera, i) => (
              <div
                key={camera.name}
                className={cn(
                  "animate-fade-up rounded-xl border px-3 py-2.5 backdrop-blur-xl",
                  camera.winner
                    ? "border-aurora-2/40 bg-gradient-to-r from-aurora-2/15 via-aurora-2/5 to-aurora-3/15 shadow-[0_16px_40px_-24px_color-mix(in_oklab,var(--aurora-2)_90%,transparent)]"
                    : "border-border/50 bg-card/60",
                  i > 0 && `delay-${i * 100}`
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-lg text-[11px] font-bold",
                      camera.winner
                        ? "brand-gradient text-white shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--aurora-2)_80%,transparent)]"
                        : "icon-chip text-muted-foreground"
                    )}
                  >
                    {camera.winner ? <Check className="size-3.5" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">{camera.name}</span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {camera.note}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold tabular-nums",
                      camera.winner ? "text-aurora-2" : "text-muted-foreground"
                    )}
                  >
                    {camera.match}%
                  </span>
                  <span className="hidden text-[11px] font-semibold text-muted-foreground sm:block">
                    {camera.price}
                  </span>
                  {camera.winner && (
                    <span className="animate-gradient-x rounded-full bg-gradient-to-r from-aurora-1 to-aurora-3 bg-[length:200%_200%] px-2 py-0.5 text-[9px] font-bold text-white">
                      BEST
                    </span>
                  )}
                </div>
                <div className="ml-9 mt-2 h-1.5 overflow-hidden rounded-full bg-muted-foreground/15">
                  <div
                    className="animate-bar-grow h-full rounded-full bg-gradient-to-r from-aurora-1 via-aurora-2 to-aurora-3"
                    style={{ width: `${camera.match}%`, animationDelay: `${0.15 + i * 0.12}s` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-1.5 rounded-lg border border-dashed border-border/50 bg-card/50 px-2.5 py-1.5 text-[11px] text-muted-foreground">
            <LinkIcon className="size-3 shrink-0 text-aurora-2" />
            <span className="truncate">
              Thread linked: “camera decision” ↔ “lens research”
            </span>
          </div>

          <div className="mt-4">
            <div className="animate-dash mb-2 h-px" />
            <div className="flex flex-wrap items-center gap-1.5">
              {sources.map((memory) => (
                <span
                  key={memory.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-xl transition-colors hover:border-aurora-2/40 hover:text-foreground"
                >
                  <MemoryTypeIcon type={memory.type} size="sm" className="size-auto" />
                  <span className="line-clamp-1">{memory.title}</span>
                </span>
              ))}
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <Sparkles className="size-3 text-aurora-2" />
                local-first
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="animate-float absolute -right-5 -top-10 hidden w-44 overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-3 shadow-xl shadow-black/10 backdrop-blur-xl lg:block"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-[0_6px_14px_-6px_rgba(52,211,153,0.6)]">
            <Monitor className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Just captured
            </span>
            <span className="block truncate text-[11px] leading-snug text-foreground/85">
              tamron-24-70-review.jpg indexed
            </span>
          </span>
        </div>
      </div>

      <div
        className="animate-float absolute -left-6 bottom-[-14px] hidden w-36 items-center gap-2.5 overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-3 shadow-xl shadow-black/10 backdrop-blur-xl lg:flex"
        style={{ animationDelay: "2.4s" }}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-xl icon-chip">
          <Zap className="size-4 text-aurora-2" />
        </span>
        <span className="min-w-0">
          <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Indexed
          </span>
          <span className="block text-[11px] font-semibold text-foreground/85">
            38 memory
            <span className="ml-1.5 inline-block size-1.5 animate-pulse rounded-full bg-aurora-2" />
          </span>
        </span>
      </div>
    </div>
  );
}