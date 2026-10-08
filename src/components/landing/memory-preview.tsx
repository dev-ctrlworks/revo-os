import { BookOpenText, Search, Sparkles } from "lucide-react";
import { memories } from "@/lib/mock-data";
import { MemoryTypeIcon } from "@/components/memories/memory-type-icon";

const sourceIds = ["m1", "m3", "m4", "m5"];
const sources = sourceIds
  .map((id) => memories.find((m) => m.id === id))
  .filter((m) => m !== undefined);

export function MemoryPreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-xl">
      <div className="space-y-4">
        <div className="animate-fade-up flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/55 px-4 py-3 shadow-[0_10px_30px_-22px_rgba(30,27,46,0.35)] backdrop-blur-xl">
          <Search className="size-4 shrink-0 text-aurora-2" />
          <p className="truncate text-sm text-foreground/90">
            What cameras have I been considering?
          </p>
          <span className="ml-auto inline-block h-4 w-[2px] animate-pulse rounded-full bg-aurora-2" />
          <span className="hidden shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-aurora-1 to-aurora-3 px-2.5 py-1 text-[11px] font-semibold text-white sm:inline-flex">
            Ask
            <span className="text-white/70">↵</span>
          </span>
        </div>

        <div className="animate-fade-up delay-100 relative overflow-hidden rounded-2xl border border-aurora-2/20 bg-gradient-to-br from-aurora-2/10 to-aurora-3/10 p-5 shadow-[0_20px_50px_-30px_rgba(124,92,255,0.45)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aurora-2/50 to-transparent" />
          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-aurora-2">
            <BookOpenText className="size-3.5 text-aurora-2" />
            Memory recall
            <span className="text-muted-foreground/60">•</span>
            <span className="text-muted-foreground">grounded in {sources.length} sources</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            You have <strong className="font-semibold text-aurora-2">3 cameras</strong> on your
            shortlist: the <strong className="font-semibold">Sony A7 IV</strong>,{" "}
            <strong className="font-semibold">Nikon Z6 III</strong>, and{" "}
            <strong className="font-semibold">Fujifilm X-T5</strong> — all within your{" "}
            <strong className="font-semibold text-aurora-2">$2,800 budget</strong>. Based on your
            decision criteria, the A7 IV fits best.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {sources.map((memory) => (
              <span
                key={memory.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/60 px-2.5 py-1 text-[11px] text-muted-foreground backdrop-blur-xl"
              >
                <MemoryTypeIcon type={memory.type} size="sm" className="size-auto" />
                <span className="line-clamp-1">{memory.title}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="animate-fade-up delay-150 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <span className="flex size-5 items-center justify-center rounded-full bg-aurora-2/15 text-[10px] font-bold text-aurora-2">
            4
          </span>
          sources matched from 38 memories
          <span className="size-1 rounded-full bg-aurora-2/40" />
          <span className="inline-flex items-center gap-1">
            <Sparkles className="size-3 text-aurora-2" />
            local-first
          </span>
        </div>
      </div>

      <div className="animate-float absolute -right-6 -top-10 hidden w-44 rounded-2xl border border-white/70 bg-white/70 p-3 shadow-lg shadow-black/5 backdrop-blur-xl lg:block" style={{ animationDelay: "0.4s" }}>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Just captured
        </p>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-foreground/85">
          tamron-24-70-review.jpg indexed
        </p>
      </div>

      <div className="animate-float absolute -bottom-8 -right-10 hidden w-48 rounded-2xl border border-aurora-2/25 bg-white/70 p-3 shadow-lg shadow-black/5 backdrop-blur-xl lg:block" style={{ animationDelay: "1.6s" }}>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-aurora-2">
          Thread linked
        </p>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-foreground/85">
          “camera decision” ↔ “Tamron lens research”
        </p>
      </div>
    </div>
  );
}