import {
  ArrowRight,
  Bookmark,
  FileText,
  LinkIcon,
  MessageCircleQuestion,
  Monitor,
  Search,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

const tape: {
  icon: LucideIcon;
  kind: string;
  title: string;
  time: string;
  chip: string;
  tone: string;
}[] = [
  { icon: Monitor, kind: "Screenshot", title: "budget_shot_0412.png", time: "now", chip: "bg-cyan-400/10", tone: "text-cyan-500" },
  { icon: LinkIcon, kind: "Link", title: "shopmuse · 50mm f/1.4 G-Master ending soon", time: "1m", chip: "bg-sky-400/10", tone: "text-sky-500" },
  { icon: StickyNote, kind: "Note", title: "budget for camera + lens", time: "3m", chip: "bg-violet-400/10", tone: "text-violet-500" },
  { icon: FileText, kind: "Document", title: "lens-comparison.pdf — 12 pages indexed", time: "6m", chip: "bg-rose-400/10", tone: "text-rose-500" },
  { icon: Search, kind: "Web", title: "“Sony A7 IV used price” saved", time: "11m", chip: "bg-emerald-400/10", tone: "text-emerald-500" },
  { icon: Bookmark, kind: "Bookmark", title: "DPReview · Sony A7 IV review", time: "14m", chip: "bg-amber-400/10", tone: "text-amber-500" },
  { icon: Monitor, kind: "Screenshot", title: "price_watch_A7IV.png", time: "19m", chip: "bg-cyan-400/10", tone: "text-cyan-500" },
  { icon: StickyNote, kind: "Note", title: "ask: which camera should I buy?", time: "1h", chip: "bg-violet-400/10", tone: "text-violet-500" },
  { icon: Search, kind: "Web", title: "JFK → NRT flights saved", time: "1h", chip: "bg-emerald-400/10", tone: "text-emerald-500" },
];

const legend = [
  { icon: StickyNote, label: "Notes", tone: "text-violet-500" },
  { icon: Monitor, label: "Screenshots", tone: "text-cyan-500" },
  { icon: LinkIcon, label: "Links & pages", tone: "text-sky-500" },
  { icon: FileText, label: "Documents", tone: "text-rose-500" },
  { icon: Search, label: "Web activity", tone: "text-emerald-500" },
  { icon: Bookmark, label: "Bookmarks", tone: "text-amber-500" },
];

export function CaptureSources() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/55 shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)] backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-aurora-2/0 via-aurora-2/50 to-aurora-3/0" />

        <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            <p className="font-display text-sm font-semibold tracking-tight">Live capture</p>
            <span className="hidden rounded-full border border-border/50 bg-card/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
              auto-ingesting, quietly
            </span>
          </div>
          <span className="rounded-full border border-aurora-2/30 bg-aurora-2/10 px-2.5 py-1 text-[10px] font-semibold text-aurora-2">
            6 sources · all opt-in
          </span>
        </div>

        <div className="relative h-56 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
          <div className="animate-tape absolute inset-0">
            <TapeRows />
            <TapeRows />
          </div>
        </div>

        <div className="border-t border-border/40 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 shadow-sm backdrop-blur-xl">
            <MessageCircleQuestion className="size-4 shrink-0 text-aurora-2" />
            <span className="truncate text-xs text-muted-foreground">
              One memory — ask anything, grounded in what you keep
            </span>
            <span className="ml-auto grid size-6 shrink-0 place-items-center rounded-lg brand-gradient">
              <ArrowRight className="size-3.5 text-white" />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
        {legend.map((item) => {
          const Icon = item.icon;
          return (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[11px] font-medium text-foreground/75 backdrop-blur-xl"
            >
              <Icon className={item.tone ? `size-3 ${item.tone}` : "size-3"} />
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function TapeRows() {
  return (
    <div className="flex flex-col">
      {tape.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={`${item.kind}-${item.title}`}
            className="flex h-12 items-center gap-2.5 border-b border-border/15 px-4 sm:px-5"
          >
            <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${item.chip}`}>
              <Icon className={`size-3.5 ${item.tone}`} />
            </span>
            <span className="w-[74px] shrink-0 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {item.kind}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-foreground/80">
              {item.title}
            </span>
            <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">
              {item.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}