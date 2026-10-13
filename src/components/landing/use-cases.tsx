import {
  Briefcase,
  GraduationCap,
  Home,
  Lightbulb,
  Plane,
  Search,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const useCases: {
  kicker: string;
  icon: LucideIcon;
  tone: string;
  chipBg: string;
  question: string;
  answer: string;
}[] = [
  {
    kicker: "Research & learning",
    icon: GraduationCap,
    tone: "text-emerald-500",
    chipBg: "bg-emerald-400/10",
    question: "Recap what I saved about sourdough.",
    answer: "75% hydration, bulk ferment overnight, bake at 250°C — plus the discard cracker recipe.",
  },
  {
    kicker: "Shopping decisions",
    icon: ShoppingBag,
    tone: "text-pink-500",
    chipBg: "bg-pink-400/10",
    question: "Which camera should I buy?",
    answer: "Sony A7 IV — best full-frame under your $2,800 budget, with the Tamron 24-70.",
  },
  {
    kicker: "Projects & ideas",
    icon: Lightbulb,
    tone: "text-amber-500",
    chipBg: "bg-amber-400/10",
    question: "What did I collect for my new project?",
    answer: "A contextual note-app concept, a settings redesign, and a résumé v4 case study.",
  },
  {
    kicker: "Travel planning",
    icon: Plane,
    tone: "text-sky-500",
    chipBg: "bg-sky-400/10",
    question: "What did I decide for the Tokyo trip?",
    answer: "Oct 8–22, stay in Shinjuku, Gora Kadan ryokan in Hakone, JR pass worth it.",
  },
  {
    kicker: "Work & productivity",
    icon: Briefcase,
    tone: "text-violet-500",
    chipBg: "bg-violet-400/10",
    question: "Summarize my weekly review.",
    answer: "Shipped the settings redesign, two apartment tours, camera down to three candidates.",
  },
  {
    kicker: "Everyday life",
    icon: Home,
    tone: "text-rose-500",
    chipBg: "bg-rose-400/10",
    question: "What was that gift idea for Jane?",
    answer: "A weekend watercolor workshop at the community center, plus a new brush set.",
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
                <span className="font-semibold text-aurora-2">Answer · </span>
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
