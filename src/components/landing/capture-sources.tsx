import {
  Bookmark,
  Check,
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

const sources: {
  icon: LucideIcon;
  name: string;
  tone: string;
  chipBg: string;
  desc: string;
  example: { line: string; foot: string };
  route: { icon: LucideIcon; label: string };
}[] = [
  {
    icon: StickyNote,
    name: "Notes",
    tone: "text-violet-500",
    chipBg: "bg-violet-400/10",
    desc: "Type or paste thoughts anywhere. Revo OS links each note to the people, projects, and dates it mentions — then finds it later.",
    example: { line: "lens comparison — check 24-70mm f/2.8 vs 24-105 if budget allows", foot: "linked to camera · budget · lens" },
    route: { icon: Keyboard, label: "⌘K · quick note" },
  },
  {
    icon: Monitor,
    name: "Screenshots",
    tone: "text-cyan-500",
    chipBg: "bg-cyan-400/10",
    desc: "Grab anything on screen from desktop or mobile. Text inside every image is read and made searchable immediately.",
    example: { line: "budget_shot_0412.png", foot: "OCR · 312 words extracted" },
    route: { icon: Sparkles, label: "Automatic" },
  },
  {
    icon: LinkIcon,
    name: "Links & pages",
    tone: "text-sky-500",
    chipBg: "bg-sky-400/10",
    desc: "Save a tab or drop a link. The full page content is embedded locally, so you can ask about articles you never re-read.",
    example: { line: "DPReview · Sony A7 IV review", foot: "full text embedded · quotable" },
    route: { icon: PlugZap, label: "Browser extension" },
  },
  {
    icon: FileText,
    name: "Documents",
    tone: "text-rose-500",
    chipBg: "bg-rose-400/10",
    desc: "Drop in résumés, leases, and plans. Text and layout stay queryable — no filing needed.",
    example: { line: "lens-comparison.pdf", foot: "12 pages · structure indexed" },
    route: { icon: Upload, label: "Drag & drop" },
  },
  {
    icon: Search,
    name: "Web activity",
    tone: "text-emerald-500",
    chipBg: "bg-emerald-400/10",
    desc: "Opt in to let Revo OS summarize the pages you visit and connect them to what you've saved.",
    example: { line: "“Sony A7 IV used price”", foot: "3 visits · summarized" },
    route: { icon: MousePointerClick, label: "Browser opt-in" },
  },
  {
    icon: Bookmark,
    name: "Bookmarks",
    tone: "text-amber-500",
    chipBg: "bg-amber-400/10",
    desc: "Everything you keep for later gets re-indexed, so it's findable the moment you need it.",
    example: { line: "DPReview · A7 IV review ★", foot: "resurfaced in answers" },
    route: { icon: Bookmark, label: "Kept for later" },
  },
];

export function CaptureSources() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => {
          const Icon = source.icon;
          const RouteIcon = source.route.icon;
          return (
            <div
              key={source.name}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/55 p-5 shadow-[0_10px_30px_-24px_rgba(30,27,46,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-2/40 hover:bg-card/70 hover:shadow-[0_18px_44px_-28px_color-mix(in_oklab,var(--aurora-2)_45%,transparent)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-aurora-2/0 via-aurora-2/40 to-aurora-3/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${source.chipBg}`}>
                    <Icon className={`size-4 ${source.tone}`} />
                  </span>
                  <h3 className="font-display text-base font-semibold tracking-tight">
                    {source.name}
                  </h3>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-500">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                  </span>
                  on · opt-in
                </span>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{source.desc}</p>

              <div className="mt-4 rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 backdrop-blur-xl transition-colors group-hover:border-aurora-2/25">
                <div className="flex items-center gap-2">
                  <span className={`grid size-6 shrink-0 place-items-center rounded-lg ${source.chipBg}`}>
                    <Icon className={`size-3 ${source.tone}`} />
                  </span>
                  <span className="min-w-0 truncate text-xs font-medium">{source.example.line}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 pl-8 text-[10px] text-muted-foreground">
                  <Check className="size-3 shrink-0 text-aurora-2" />
                  <span className="truncate">{source.example.foot}</span>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <RouteIcon className="size-3" />
                  {source.route.label}
                </span>
                <span className="inline-flex items-center gap-1 text-aurora-2">
                  <Search className="size-3" />
                  findable later
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mx-auto mt-5 max-w-2xl overflow-hidden rounded-full border border-aurora-2/20 bg-gradient-to-r from-aurora-2/5 via-aurora-2/10 to-aurora-3/5 px-6 py-2.5 text-center text-xs text-foreground/70">
        <Sparkles className="mr-1.5 inline size-3.5 text-aurora-2" />
        All six feed one memory — instant, always-on, and fully private
      </div>
    </div>
  );
}