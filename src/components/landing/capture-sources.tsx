import {
  Bookmark,
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
  tagline: string;
  route: { icon: LucideIcon; label: string };
}[] = [
  { icon: StickyNote, name: "Notes", tone: "text-violet-500", chipBg: "bg-violet-400/10", tagline: "typed ideas, auto-linked", route: { icon: Keyboard, label: "⌘K" } },
  { icon: Monitor, name: "Screenshots", tone: "text-cyan-500", chipBg: "bg-cyan-400/10", tagline: "OCR — every word searchable", route: { icon: Sparkles, label: "auto" } },
  { icon: LinkIcon, name: "Links & pages", tone: "text-sky-500", chipBg: "bg-sky-400/10", tagline: "full pages embedded", route: { icon: PlugZap, label: "extension" } },
  { icon: FileText, name: "Documents", tone: "text-rose-500", chipBg: "bg-rose-400/10", tagline: "text + structure extracted", route: { icon: Upload, label: "drag & drop" } },
  { icon: Search, name: "Web activity", tone: "text-emerald-500", chipBg: "bg-emerald-400/10", tagline: "visits summarized & connected", route: { icon: MousePointerClick, label: "opt-in" } },
  { icon: Bookmark, name: "Bookmarks", tone: "text-amber-500", chipBg: "bg-amber-400/10", tagline: "re-indexed, now findable", route: { icon: Bookmark, label: "kept" } },
];

export function CaptureSources() {
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => {
          const Icon = source.icon;
          const RouteIcon = source.route.icon;
          return (
            <div
              key={source.name}
              className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-border/50 bg-card/55 px-4 py-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-2/40 hover:bg-card/70 hover:shadow-[0_18px_44px_-28px_color-mix(in_oklab,var(--aurora-2)_45%,transparent)]"
            >
              <div className="flex items-center gap-2.5">
                <span className={`relative grid size-8 shrink-0 place-items-center rounded-lg ${source.chipBg}`}>
                  <Icon className={`size-3.5 ${source.tone}`} />
                  <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-emerald-400 ring-2 ring-card" />
                </span>
                <h3 className="font-display text-sm font-semibold tracking-tight">{source.name}</h3>
                <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                  <RouteIcon className="size-3" />
                  {source.route.label}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{source.tagline}</p>
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