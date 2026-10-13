import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";
import { Reveal } from "@/components/motion/reveal";

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What is Revo OS?",
    answer:
      "A personal AI memory system designed to bring your digital information together and make it easier to retrieve and connect. It captures what you save, keeps the context, and answers plain-language questions with sources you can open.",
  },
  {
    question: "What can I save?",
    answer:
      "In the working prototype you can add memories by pasting text, writing a note, saving a link, uploading a file, or dragging and dropping — and explore a set of sample memories that ship with the demo. Screenshot capture, browser trails, and app imports are on the roadmap, not available yet.",
  },
  {
    question: "Can I import information from other apps?",
    answer:
      "Not yet. Today the prototype works with the capture methods above and sample data. Connecting apps and importing existing notes, links, and files is planned — those integrations are clearly labeled as future work and no partnerships are implied.",
  },
  {
    question: "Is Revo OS available now?",
    answer:
      "An interactive prototype is available to explore right now — no signup, no setup. The broader product is still evolving, and the features shown as \"planned\" are not built yet.",
  },
  {
    question: "Does Revo OS use my real data in the prototype?",
    answer:
      "No. The prototype runs on sample data, and any memories you capture stay in your own browser. If you ask a question, only the relevant sample memories are sent to our AI provider to synthesize the answer.",
  },
  {
    question: "Is it free?",
    answer:
      "The prototype is free to explore today. We haven't set pricing for future versions — we'll share that openly before anything changes, and waitlist members will hear first.",
  },
  {
    question: "How can I get early access?",
    answer:
      "Join the waitlist below. You'll get early access before the public launch and can follow development as new capabilities ship.",
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
