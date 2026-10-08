import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  FileText,
  LinkIcon,
  MessageCircleQuestion,
  Monitor,
  Search,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sources = [
  { icon: StickyNote, label: "Notes", sub: "typed ideas & quick thoughts", tone: "text-violet-400" },
  { icon: Monitor, label: "Screenshots", sub: "everything you grab", tone: "text-cyan-400" },
  { icon: LinkIcon, label: "Links & pages", sub: "articles, tabs, saved reading", tone: "text-sky-400" },
  { icon: FileText, label: "Documents", sub: "résumés, leases, plans", tone: "text-rose-400" },
  { icon: Search, label: "Web activity", sub: "searches & what you open", tone: "text-emerald-400" },
  { icon: Bookmark, label: "Bookmarks", sub: "kept for later — now findable", tone: "text-amber-400" },
];

export function CaptureSources() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,7fr)] lg:items-stretch lg:gap-8">
      <div>
        <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Six sources, all opt-in
        </p>
        <div className="space-y-2.5">
          {sources.map((source) => {
            const Icon = source.icon;
            return (
              <div key={source.label} className="flex items-center gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border/50 bg-card/55 px-4 py-3 shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)] backdrop-blur-xl transition-colors hover:border-aurora-2/40 hover:bg-card/70">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl icon-chip">
                    <Icon className={cn("size-4", source.tone)} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium tracking-tight">{source.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{source.sub}</span>
                  </span>
                </div>
                <div className="relative hidden h-px w-14 shrink-0 bg-gradient-to-r from-aurora-2/30 to-aurora-3/80 lg:block">
                  <ArrowRight className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 text-aurora-3" />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-center gap-1 pt-3 lg:hidden">
          <span className="h-8 w-px bg-gradient-to-b from-aurora-2/30 to-aurora-3/80" />
          <ArrowDown className="size-3.5 text-aurora-3" />
        </div>
      </div>

      <MemoryPane />
    </div>
  );
}

function MemoryPane() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/55 p-5 shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)] backdrop-blur-xl sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-aurora-2/0 via-aurora-2/50 to-aurora-3/0" />

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg icon-chip">
            <Sparkles className="size-4 text-aurora-2" />
          </span>
          <div>
            <p className="font-display text-base font-semibold tracking-tight">One memory</p>
            <p className="text-[11px] text-muted-foreground">everything, in one searchable layer</p>
          </div>
        </div>
        <span className="hidden shrink-0 rounded-full border border-aurora-2/30 bg-aurora-2/10 px-2.5 py-1 text-[10px] font-semibold text-aurora-2 sm:inline-flex sm:items-center sm:gap-1.5">
          <span className="size-1.5 rounded-full bg-aurora-2" />
          6 sources connected
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 backdrop-blur-xl">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-400/60 to-cyan-400/60">
            <Monitor className="size-3.5 text-white" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">Budget shot_0412.png</p>
            <p className="text-[11px] text-muted-foreground">captured · indexed · searchable</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 text-xs leading-relaxed backdrop-blur-xl">
          lens comparison — check{" "}
          <span className="rounded bg-aurora-2/15 px-1 font-semibold text-aurora-2">24-70mm f/2.8</span>{" "}
          vs 24-105 if budget allows
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 backdrop-blur-xl">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg icon-chip">
            <LinkIcon className="size-3.5 text-sky-400" />
          </span>
          <div className="flex flex-wrap gap-1.5">
            {["Tamron review", "Summit rents", "JFK→NRT"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-border/50 bg-card/80 px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 backdrop-blur-xl">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg icon-chip">
            <FileText className="size-3.5 text-rose-400" />
          </span>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">18 documents</span> auto-indexed this month
          </p>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 shadow-sm backdrop-blur-xl">
          <MessageCircleQuestion className="size-4 shrink-0 text-aurora-2" />
          <span className="truncate text-xs text-muted-foreground">
            Ask anything — grounded in your memory
          </span>
          <span className="ml-auto grid size-6 shrink-0 place-items-center rounded-lg brand-gradient">
            <ArrowRight className="size-3.5 text-white" />
          </span>
        </div>
      </div>
    </div>
  );
}