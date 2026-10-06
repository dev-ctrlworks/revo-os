import { Search, CalendarDays, FolderOpen, Network, BookOpenText } from "lucide-react";
import { memories } from "@/lib/mock-data";
import { MemoryTypeIcon } from "@/components/memories/memory-type-icon";
import type { MemoryType } from "@/lib/types";

const typeLabels: Record<MemoryType, string> = {
  screenshot: "Screenshot",
  note: "Note",
  document: "Document",
  link: "Link",
  image: "Image",
  discussion: "Conversation",
  email: "Email",
  archive: "Archive",
};

const sourceIds = ["m1", "m3", "m4", "m5"];
const sources = sourceIds
  .map((id) => memories.find((m) => m.id === id))
  .filter((m) => m !== undefined);

const floatingChips = [
  { id: "m6", position: "-left-6 top-24 -rotate-6", delay: "0s" },
  { id: "m11", position: "-right-8 top-8 rotate-3", delay: "1.2s" },
  { id: "m13", position: "-left-4 bottom-24 rotate-2", delay: "2s" },
];

export function MemoryPreview() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-4xl">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[420px] w-[720px] rounded-full bg-gradient-to-br from-indigo-500/20 via-sky-500/10 to-cyan-400/20 blur-3xl" />
      </div>

      <div className="animate-fade-up relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-border/60 bg-muted/30 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <div className="mx-auto flex items-center gap-1.5 rounded-md bg-background/70 px-3 py-1 text-[11px] text-muted-foreground ring-1 ring-border/50">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            revo.app/search
          </div>
          <span className="hidden text-[10px] text-muted-foreground sm:block">prototype</span>
        </div>

        <div className="grid md:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-border/60 p-4 md:block">
            <div className="mb-6 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-sky-500 to-cyan-400 shadow-md shadow-indigo-500/25">
                <Network className="size-3.5 text-white" />
              </span>
              <span className="text-sm font-semibold tracking-tight">Revo OS</span>
            </div>
            <nav className="space-y-1 text-sm">
              <a className="flex items-center gap-2.5 rounded-lg bg-indigo-500/10 px-2.5 py-2 text-indigo-600 dark:text-indigo-400">
                <Search className="size-4" />
                Ask
              </a>
              <a className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
                <CalendarDays className="size-4" />
                Timeline
              </a>
              <a className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
                <FolderOpen className="size-4" />
                Collections
              </a>
            </nav>
          </aside>

          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm text-muted-foreground">
              <Search className="size-4 text-indigo-500" />
              What cameras have I been considering?
              <span className="ml-auto size-1.5 animate-pulse rounded-full bg-indigo-500" />
            </div>

            <div className="mt-4 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.06] via-card to-card/60 p-5">
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                <BookOpenText className="size-3.5 text-indigo-400" />
                AI summary
                <span className="text-muted-foreground/60">•</span>
                <span>just now</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                You have <strong className="font-semibold text-indigo-600 dark:text-indigo-400">3 cameras</strong>{" "}
                on your shortlist: the <strong className="font-semibold">Sony A7 IV</strong>,{" "}
                <strong className="font-semibold">Nikon Z6 III</strong>, and{" "}
                <strong className="font-semibold">Fujifilm X-T5</strong> — all within your{" "}
                <strong className="font-semibold text-indigo-600 dark:text-indigo-400">$2,800 budget</strong>.
                Based on your decision criteria, the A7 IV fits best: full-frame, 4K60, IBIS, and
                refurb deals are acceptable.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <span className="flex size-5 items-center justify-center rounded-full bg-indigo-500/10 text-[10px] font-semibold text-indigo-500">
                {sources.length}
              </span>
              Source memories
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {sources.map((memory) => (
                <div
                  key={memory.id}
                  className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/50 p-2.5"
                >
                  <MemoryTypeIcon type={memory.type} />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-[13px] font-medium">{memory.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {typeLabels[memory.type]} · {memory.collection}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {floatingChips.map((chip) => {
        const memory = memories.find((m) => m.id === chip.id);
        if (!memory) return null;
        return (
          <div
            key={chip.id}
            className={`animate-float absolute ${chip.position} hidden w-44 rounded-xl border border-border/60 bg-card/90 p-3 shadow-xl shadow-black/5 backdrop-blur-lg lg:block`}
            style={{ animationDelay: chip.delay }}
          >
            <div className="mb-1.5 flex items-center gap-1.5">
              <MemoryTypeIcon type={memory.type} />
              <p className="line-clamp-1 text-[11px] font-semibold">{memory.title}</p>
            </div>
            <p className="line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
              {memory.highlight ?? memory.content}
            </p>
          </div>
        );
      })}
    </div>
  );
}