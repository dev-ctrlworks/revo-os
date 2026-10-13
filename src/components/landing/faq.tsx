import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";
import { Reveal } from "@/components/motion/reveal";

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Revo OS?",
    answer:
      "A personal AI memory. Save what matters, then ask for it later and get an answer with its sources.",
  },
  {
    question: "What can I save?",
    answer:
      "Paste, notes, links, files, and drag & drop — plus sample memories in the demo. Screenshots and app imports are planned.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "Captured memories stay in your browser. Waitlist and feedback are stored on our servers, and analytics only run with your consent.",
  },
  {
    question: "What happens when I ask a question?",
    answer:
      "Only the memories relevant to your question are sent to our AI provider to write the answer. Every answer stays grounded in what you saved, with sources you can open.",
  },
  {
    question: "How is this different from a notes app or bookmarks?",
    answer:
      "Instead of filing everything yourself, you save first and ask later. Revo finds the sources and answers in plain language.",
  },
  {
    question: "Does it connect to other apps yet?",
    answer:
      "Not yet. The prototype works with the capture methods above and sample data. Connecting apps and importing existing notes is planned.",
  },
  {
    question: "Is it free?",
    answer:
      "The prototype is free to explore. We haven't set pricing for future versions — we'll share it openly first.",
  },
  {
    question: "How do I get early access?",
    answer: "Join the waitlist below. You'll get early access before the public launch.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <SectionHeader
        kicker="FAQ"
        align="center"
        title="Questions, answered honestly."
        lead="No inflated claims — just where things stand today."
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {faqs.map((faq, i) => (
          <Reveal key={faq.question} delay={i * 0.03}>
            <details className="group rounded-2xl border border-border/50 bg-card/55 backdrop-blur-xl transition-colors open:border-aurora-2/30 open:bg-card/70">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Still have a question?{" "}
        <a
          href="mailto:hello@revoos.app"
          className="font-medium text-aurora-2 underline-offset-4 hover:underline"
        >
          hello@revoos.app
        </a>
      </p>
    </section>
  );
}
