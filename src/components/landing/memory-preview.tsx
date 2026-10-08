import {
  BookOpenText,
  Camera,
  Check,
  Link2,
  Search,
  Sparkles,
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

export function MemoryPreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-xl">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-aurora-2/25 via-aurora-3/10 to-transparent blur-2xl"
      />
      <div
        aria-hidden
        className="absolute inset-x-8 -bottom-3 -z-10 h-14 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl"
      />

      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/70 shadow-[0_24px_60px_-32px_rgba(30,27,46,0.4)] backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-aurora-2/40 via-aurora-2/20 to-aurora-3/40" />

        <div className="flex h-11 items-center justify-between border-b border-border/40 px-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <span className="grid size-4 place-items-center rounded brand-gradient text-[8px] font-bold text-white">
              R
            </span>
            Revo OS
          </div>
          <span className="hidden items-center gap-1 rounded-md border border-border/50 bg-card/60 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-flex">
            <span className="font-semibold">⌘</span>K
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/50 bg-card/55 py-1.5 pl-3.5 pr-1.5 shadow-sm backdrop-blur-xl">
            <Search className="size-4 shrink-0 text-aurora-2" />
            <p className="truncate text-sm text-foreground/90">Which camera should I buy?</p>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-aurora-1 to-aurora-3 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_6px_18px_-8px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]">
              Ask
              <span className="text-white/70">↵</span>
            </span>
          </div>

          <div className="mt-3.5 rounded-2xl border border-aurora-2/20 bg-gradient-to-br from-aurora-2/[0.07] via-card/50 to-aurora-3/[0.07] p-4 backdrop-blur-xl">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-aurora-2">
                <BookOpenText className="size-3.5" />
                Memory answer
              </p>
              <span className="shrink-0 rounded-full border border-aurora-2/25 bg-aurora-2/10 px-2 py-0.5 text-[10px] font-medium text-aurora-2">
                grounded in {sources.length} sources
              </span>
            </div>

            <p className="text-sm leading-relaxed">
              The <strong className="font-semibold text-aurora-2">Sony A7 IV</strong> fits best —
              full-frame with IBIS and class-leading AF, and used bodies run ≈$400 under their
              street price, comfortably inside your $2,800 budget.
            </p>

            <div className="mt-3 space-y-1.5">
              {shortlist.map((camera) => (
                <div
                  key={camera.name}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border px-3 py-2 backdrop-blur-xl",
                    camera.match
                      ? "border-aurora-2/35 bg-aurora-2/[0.08] shadow-[0_8px_24px_-16px_color-mix(in_oklab,var(--aurora-2)_80%,transparent)]"
                      : "border-border/50 bg-card/55"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-lg",
                      camera.match ? "brand-gradient text-white" : "icon-chip text-muted-foreground"
                    )}
                  >
                    {camera.match ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Camera className="size-3.5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">{camera.name}</span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {camera.note}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      camera.match ? "text-aurora-2" : "text-muted-foreground"
                    )}
                  >
                    {camera.price}
                  </span>
                  {camera.match && (
                    <span className="rounded-full bg-gradient-to-r from-aurora-1 to-aurora-3 px-2 py-0.5 text-[9px] font-bold text-white">
                      BEST
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            {sources.map((memory) => (
              <span
                key={memory.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-xl"
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

      <div
        className="animate-float absolute -right-4 -top-9 hidden w-44 rounded-2xl border border-border/50 bg-card/70 px-3 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl lg:block"
        style={{ animationDelay: "0.4s" }}
      >
        <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Just captured
        </p>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-foreground/85">
          tamron-24-70-review.jpg indexed
        </p>
      </div>

      <div
        className="animate-float absolute -bottom-9 -right-5 hidden w-48 rounded-2xl border border-aurora-2/25 bg-card/70 px-3 py-2.5 shadow-lg shadow-black/5 backdrop-blur-xl lg:block"
        style={{ animationDelay: "1.6s" }}
      >
        <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-aurora-2">
          <Link2 className="size-3" />
          Thread linked
        </p>
        <p className="truncate text-[11px] leading-relaxed text-foreground/85">
          “camera decision” ↔ “lens research”
        </p>
      </div>
    </div>
  );
}