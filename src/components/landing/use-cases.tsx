import { Search } from "lucide-react";

const useCases: { question: string; answer: string }[] = [
  {
    question: "Recap what I saved about sourdough.",
    answer: "75% hydration, bulk ferment overnight, bake at 250°C — plus the discard cracker recipe.",
  },
  {
    question: "Which camera should I buy?",
    answer: "Sony A7 IV — best full-frame under your $2,800 budget, with the Tamron 24-70.",
  },
  {
    question: "What did I decide for the Tokyo trip?",
    answer: "Oct 8–22, stay in Shinjuku, Gora Kadan ryokan in Hakone, JR pass worth it.",
  },
];

export function UseCases() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {useCases.map((item) => (
        <div
          key={item.question}
          className="group flex flex-col rounded-2xl border border-border/50 bg-card/55 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-aurora-2/40 hover:bg-card/70 hover:shadow-[0_18px_44px_-28px_color-mix(in_oklab,var(--aurora-2)_45%,transparent)]"
        >
          <div className="flex items-start gap-2 rounded-xl border border-border/50 bg-card/60 px-3 py-2 backdrop-blur-xl">
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
      ))}
    </div>
  );
}
