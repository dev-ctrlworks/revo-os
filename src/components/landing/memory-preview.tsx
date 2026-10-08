import type { CSSProperties } from "react";
import {
  BookOpenText,
  Camera,
  Check,
  Link2,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { memories } from "@/lib/mock-data";
import { MemoryTypeIcon } from "@/components/memories/memory-type-icon";

const sourceIds = ["m1", "m3", "m4", "m5"];
const sources = sourceIds
  .map((id) => memories.find((m) => m.id === id))
  .filter((m) => m !== undefined);

const shortlist = [
  { name: "Sony A7 IV", price: "$2,499", match: true, note: "full-frame · IBIS · class-leading AF" },
  { name: "Nikon Z6 III", price: "$2,499", match: false, note: "strong hybrid video" },
  { name: "Fujifilm X-T5", price: "$1,699", match: false, note: "stills-first compromise" },
];

const sparkles = [
  { top: "8%", left: "-4%", delay: "0s", size: "4px" },
  { top: "30%", left: "102%", delay: "1.2s", size: "3px" },
  { top: "72%", left: "-6%", delay: "2.1s", size: "3px" },
  { top: "88%", left: "104%", delay: "0.6s", size: "4px" },
];

export function MemoryPreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-xl">
      <div className="absolute -inset-10 -z-20 bg-gradient-to-br from-aurora-1/30 via-aurora-2/15 to-aurora-4/20 blur-3xl" />
      <div className="aurora-orb left-[-14%] top-[6%] -z-10 size-64 opacity-60" style={{ "--color": "var(--aurora-1)" } as CSSProperties} />
      <div
        className="aurora-orb right-[-12%] bottom-[-6%] -z-10 size-72 opacity-50"
        style={{ "--color": "var(--aurora-3)", animationDelay: "3s" } as CSSProperties}
      />

      {sparkles.map((s) => (
        <span
          key={`${s.top}-${s.left}`}
          aria-hidden
          className="animate-float absolute -z-10 hidden rounded-full bg-gradient-to-br from-aurora-2 to-aurora-3 opacity-60 blur-[1px] lg:block"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}

      <div className="relative overflow-hidden rounded-[28px] border border-aurora-2/25 shadow-[0_36px_90px_-42px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)]">
        <div
          aria-hidden
          className="absolute -inset-[150%] animate-spin-slow opacity-50 blur-3xl"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, transparent 0deg, var(--aurora-1) 50deg, var(--aurora-3) 110deg, transparent 170deg, transparent 240deg, var(--aurora-2) 300deg, transparent 350deg)",
          }}
        />
        <div className="relative m-[1px] overflow-hidden rounded-[27px] bg-card/80 backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-px animate-gradient-x bg-gradient-to-r from-aurora-1 via-aurora-3 to-aurora-1 bg-[length:200%_100%]" />

          <div className="relative flex h-12 items-center justify-between border-b border-border/40 px-4">
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
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
              </span>
              synced
            </span>
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

            <div className="relative mt-3.5 overflow-hidden rounded-2xl border border-aurora-2/25 bg-gradient-to-br from-aurora-2/10 via-card/60 to-aurora-3/10 p-4 backdrop-blur-xl">
              <div className="aurora-orb right-[-20%] top-[-40%] size-40 opacity-40" style={{ "--color": "var(--aurora-2)" } as CSSProperties} />
              <div className="relative">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-aurora-2">
                    <BookOpenText className="size-3.5" />
                    Memory answer
                    <span className="inline-block size-1 animate-pulse rounded-full bg-aurora-2" />
                  </p>
                  <span className="shrink-0 rounded-full border border-aurora-2/25 bg-aurora-2/10 px-2 py-0.5 text-[10px] font-medium text-aurora-2">
                    grounded in {sources.length} sources
                  </span>
                </div>

                <p className="text-sm leading-relaxed">
                  The <strong className="text-gradient font-semibold">Sony A7 IV</strong> fits best —
                  full-frame with IBIS and class-leading AF, and used bodies run ≈$400 under their
                  street price, comfortably inside your <strong className="font-semibold">$2,800 budget</strong>.
                </p>
                <div className="animate-dash mt-3 h-px" />

                <div className="mt-3 space-y-1.5">
                  {shortlist.map((camera, i) => (
                    <div
                      key={camera.name}
                      className={cn(
                        "animate-fade-up relative flex items-center gap-2.5 rounded-xl border px-3 py-2 backdrop-blur-xl",
                        camera.match
                          ? "border-aurora-2/40 bg-gradient-to-r from-aurora-2/15 via-aurora-2/5 to-aurora-3/15 shadow-[0_14px_34px_-20px_color-mix(in_oklab,var(--aurora-2)_90%,transparent)]"
                          : "border-border/50 bg-card/60",
                        i > 0 && `delay-${i * 100}`
                      )}
                    >
                      {camera.match && (
                        <span
                          aria-hidden
                          className="aurora-orb absolute -inset-x-2 -top-2 bottom-[-6px] -z-10 size-auto opacity-40"
                          style={{ "--color": "var(--aurora-2)", animationDelay: "0.8s" } as CSSProperties}
                        />
                      )}
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-lg",
                          camera.match
                            ? "brand-gradient text-white shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--aurora-2)_80%,transparent)]"
                            : "icon-chip text-muted-foreground"
                        )}
                      >
                        {camera.match ? <Check className="size-3.5" /> : <Camera className="size-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium">{camera.name}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">
                          {camera.note}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            camera.match
                              ? "animate-pulse bg-aurora-2"
                              : "bg-muted-foreground/30"
                          )}
                        />
                        <span
                          className={cn(
                            "text-[11px] font-semibold",
                            camera.match ? "text-aurora-2" : "text-muted-foreground"
                          )}
                        >
                          {camera.price}
                        </span>
                      </span>
                      {camera.match && (
                        <span className="animate-gradient-x rounded-full bg-gradient-to-r from-aurora-1 to-aurora-3 px-2 py-0.5 text-[9px] font-bold text-white bg-[length:200%_100%]">
                          BEST
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-3.5">
              <div className="animate-dash mb-2 h-px" />
              <div className="flex flex-wrap items-center gap-1.5">
                {sources.map((memory) => (
                  <span
                    key={memory.id}
                    className="animate-fade-in inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-xl transition-colors hover:border-aurora-2/40 hover:text-foreground"
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
              <p className="mt-2 text-[10px] text-muted-foreground">
                {sources.length} sources matched from 38 memories · open, verify, and trace any answer
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="animate-float absolute -right-5 -top-9 hidden w-44 overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-0 shadow-xl shadow-black/10 ring-glow backdrop-blur-xl lg:block"
        style={{ animationDelay: "0.4s" }}
      >
        <span className="animate-shimmer absolute inset-0" aria-hidden />
        <div className="relative flex items-center gap-2.5 p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-[0_6px_14px_-6px_rgba(52,211,153,0.6)]">
            <Camera className="size-4" />
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
        className="animate-float absolute -bottom-10 -right-6 hidden w-52 overflow-hidden rounded-2xl border border-aurora-2/30 bg-card/80 p-0 shadow-xl shadow-black/10 ring-glow backdrop-blur-xl lg:block"
        style={{ animationDelay: "1.6s" }}
      >
        <span className="animate-shimmer absolute inset-0" aria-hidden />
        <div className="relative flex items-center gap-2.5 p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl brand-gradient text-white shadow-[0_6px_14px_-6px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]">
            <Link2 className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-aurora-2">
              <span className="size-1.5 animate-pulse rounded-full bg-aurora-2" />
              Thread linked
            </span>
            <span className="block truncate text-[11px] leading-snug text-foreground/85">
              “camera decision” ↔ “lens research”
            </span>
          </span>
        </div>
      </div>

      <div
        className="animate-float absolute -left-7 top-1/3 hidden w-36 overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-3 shadow-xl shadow-black/10 backdrop-blur-xl lg:block"
        style={{ animationDelay: "2.7s" }}
      >
        <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Zap className="size-3 text-aurora-2" />
          Indexed
        </p>
        <p className="flex items-center gap-1 text-[11px] font-semibold text-foreground/85">
          38 memory
          <span className="ml-auto size-1.5 animate-pulse rounded-full bg-aurora-2" />
        </p>
      </div>
    </div>
  );
}