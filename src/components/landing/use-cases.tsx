import {
  Bookmark,
  Briefcase,
  FileText,
  GraduationCap,
  HeartPulse,
  Home,
  LinkIcon,
  Monitor,
  Plane,
  Search,
  ShoppingBag,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

const useCases: {
  kicker: string;
  icon: LucideIcon;
  tone: string;
  chipBg: string;
  question: string;
  lead: string;
  rest: string;
  sources: { icon: LucideIcon; label: string }[];
}[] = [
  {
    kicker: "Shopping",
    icon: ShoppingBag,
    tone: "text-pink-500",
    chipBg: "bg-pink-400/10",
    question: "Which camera should I buy?",
    lead: "Sony A7 IV",
    rest: "— best full-frame under your $2,800 budget.",
    sources: [
      { icon: Monitor, label: "spec sheet" },
      { icon: StickyNote, label: "budget note" },
    ],
  },
  {
    kicker: "Travel",
    icon: Plane,
    tone: "text-sky-500",
    chipBg: "bg-sky-400/10",
    question: "What did I decide for the Tokyo trip?",
    lead: "JFK→NRT, stay in Shinjuku",
    rest: "— and rent the 24-70 lens.",
    sources: [
      { icon: LinkIcon, label: "flight page" },
      { icon: StickyNote, label: "itinerary" },
    ],
  },
  {
    kicker: "Work",
    icon: Briefcase,
    tone: "text-violet-500",
    chipBg: "bg-violet-400/10",
    question: "Summarize my Q3 planning notes.",
    lead: "Three priorities:",
    rest: "onboarding, pricing, and hiring.",
    sources: [
      { icon: FileText, label: "planning.pdf" },
      { icon: StickyNote, label: "meeting note" },
    ],
  },
  {
    kicker: "Home",
    icon: Home,
    tone: "text-amber-500",
    chipBg: "bg-amber-400/10",
    question: "What did the landlord say about the lease?",
    lead: "12-month term,",
    rest: "utilities extra, photograph every unit.",
    sources: [
      { icon: FileText, label: "lease.pdf" },
      { icon: Monitor, label: "unit photos" },
    ],
  },
  {
    kicker: "Learning",
    icon: GraduationCap,
    tone: "text-emerald-500",
    chipBg: "bg-emerald-400/10",
    question: "Recap what I saved about sourdough.",
    lead: "75% hydration,",
    rest: "bulk ferment overnight, bake at 250°C.",
    sources: [
      { icon: LinkIcon, label: "recipe" },
      { icon: Bookmark, label: "saved post" },
    ],
  },
  {
    kicker: "Health",
    icon: HeartPulse,
    tone: "text-rose-500",
    chipBg: "bg-rose-400/10",
    question: "What was that sleep idea I saved?",
    lead: "Deep-work block 6–9am,",
    rest: "no meetings, phone outside the room.",
    sources: [
      { icon: Bookmark, label: "podcast" },
      { icon: StickyNote, label: "note" },
    ],
  },
];

export function UseCases() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {useCases.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.kicker}
            className="group flex flex-col rounded-2xl border border-border/50 bg-card/55 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-2/40 hover:bg-card/70 hover:shadow-[0_18px_44px_-28px_color-mix(in_oklab,var(--aurora-2)_45%,transparent)]"
          >
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${item.tone}`}>
              <span className={`grid size-5 place-items-center rounded-md ${item.chipBg}`}>
                <Icon className="size-3" />
              </span>
              {item.kicker}
            </span>

            <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-border/50 bg-card/60 px-3 py-2 backdrop-blur-xl">
              <Search className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <p className="text-xs font-medium">{item.question}</p>
            </div>

            <div className="mt-2 rounded-xl border border-aurora-2/20 bg-gradient-to-br from-aurora-2/10 via-card/50 to-aurora-3/10 px-3 py-2.5 backdrop-blur-xl">
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-aurora-2">{item.lead}</span> {item.rest}
              </p>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
              {item.sources.map((source) => {
                const SrcIcon = source.icon;
                return (
                  <span
                    key={source.label}
                    className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-card/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    <SrcIcon className="size-2.5" />
                    {source.label}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}