import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/marketing/section";
import { Reveal } from "@/components/marketing/motion";
import { faqs } from "@/components/marketing/content";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-28 px-5 py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          kicker="FAQ"
          accent="var(--primary)"
          title="The honest answers, plainly told."
          underline="honest"
          lead="No inflated claims — just where things stand today."
        />

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 0.03}>
                <details className="group rounded-3xl border border-l-4 border-border bg-white transition-colors hover:bg-secondary/20 open:border-t-primary/25 open:border-r-primary/25 open:border-b-primary/25 open:border-l-primary open:bg-primary/[0.03]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 group-open:text-primary" />
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-text/75">
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
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            hello@revoos.app
          </a>
        </p>
      </div>
    </section>
  );
}
