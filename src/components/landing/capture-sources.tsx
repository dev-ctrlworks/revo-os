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
  route: { icon: LucideIcon; label: string };
}[] = [
  { icon: StickyNote, name: "Notes", tone: "text-violet-500", chipBg: "bg-violet-400/10", route: { icon: Keyboard, label: "quick note" } },
  { icon: Monitor, name: "Screenshots", tone: "text-cyan-500", chipBg: "bg-cyan-400/10", route: { icon: Sparkles, label: "automatic" } },
  { icon: LinkIcon, name: "Links & pages", tone: "text-sky-500", chipBg: "bg-sky-400/10", route: { icon: PlugZap, label: "browser extension" } },
  { icon: FileText, name: "Documents", tone: "text-rose-500", chipBg: "bg-rose-400/10", route: { icon: Upload, label: "drag & drop" } },
  { icon: Search, name: "Web activity", tone: "text-emerald-500", chipBg: "bg-emerald-400/10", route: { icon: MousePointerClick, label: "opt-in trail" } },
  { icon: Bookmark, name: "Bookmarks", tone: "text-amber-500", chipBg: "bg-amber-400/10", route: { icon: Bookmark, label: "save for later" } },
];

export function CaptureSources() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="mb-4 text-center text-[13px] text-muted-foreground">
        Revo OS memorizes what you already create — connect once, and it stays
        searchable forever.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => {
          const Icon = source.icon;
          const RouteIcon = source.route.icon;
          return (
            <div
              key={source.name}
              className="group relative flex items-center gap-3 rounded-2xl border border-border/50 bg-card/55 px-4 py-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-2/40 hover:bg-card/70 hover:shadow-[0_18px_44px_-28px_color-mix(in_oklab,var(--aurora-2)_45%,transparent)]"
            >
              <span className={`relative grid size-10 shrink-0 place-items-center rounded-xl ${source.chipBg}`}>
                <Icon className={`size-4.5 ${source.tone}`} />
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-card" />
              </span>

              <div className="min-w-0">
                <h3 className="truncate font-display text-[15px] font-semibold tracking-tight">
                  {source.name}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                  <RouteIcon className="size-3 shrink-0" />
                  {source.route.label}
                </p>
              </div>

              <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-500">
                <Check className="size-2.5" />
                memorized
              </span>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-5 flex max-w-fit items-center gap-1.5 rounded-full border border-aurora-2/20 bg-gradient-to-r from-aurora-2/5 via-aurora-2/10 to-aurora-3/5 px-5 py-1.5 text-[11px] text-foreground/70">
        <Sparkles className="size-3.5 text-aurora-2" />
        Six sources. One memory. Fully private.
      </p>
    </div>
  );
}