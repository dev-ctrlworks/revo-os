import { Bookmark, Check, Minus, NotebookPen, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";
import { Reveal } from "@/components/motion/reveal";

const columns = [
  {
    icon: Bookmark,
    label: "Traditional bookmarks",
    ring: "border-border/50 bg-card/45",
    items: [
      "Primarily save links",
      "You must remember where things are",
      "Usually require manual organization",
    ],
  },
  {
    icon: NotebookPen,
    label: "Notes apps",
    ring: "border-border/50 bg-card/45",
    items: [
      "Store useful information",
      "You manage the structure and connections",
      "Searching means guessing the right words",
    ],
  },
];

const revo = [
  "Bring different kinds of memories into one space",
  "Find information through natural-language questions",
  "Reconnect related notes, links, screenshots, and documents",
  "Preserve the context that makes saved information useful",
];

export function WhyRevo() {
  return (
    <section id="compare" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <SectionHeader
        kicker="Why Revo OS"
        align="center"
        title={
          <>
            Not another place to save things.{" "}
            <span className="text-gradient">A better way to remember them.</span>
          </>
        }
        lead="Collecting information is easy. Being able to use it later is the hard part."
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {columns.map(({ icon: Icon, label, items, ring }, i) => (
          <Reveal key={label} delay={i * 0.05}>
            <div className={`h-full rounded-3xl border p-6 backdrop-blur-xl sm:p-8 ${ring}`}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <Icon className="size-3" />
                {label}
              </span>
              <ul className="mt-5 space-y-3.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-border/60 bg-card/60">
                      <Minus className="size-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}

        <Reveal delay={0.1}>
          <div className="relative h-full overflow-hidden rounded-3xl border border-aurora-2/30 bg-gradient-to-br from-aurora-2/[0.08] via-card/55 to-aurora-3/[0.08] p-6 shadow-[0_28px_70px_-40px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)] backdrop-blur-xl sm:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-aurora-2/30 bg-aurora-2/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-aurora-2">
              <Sparkles className="size-3" />
              Revo OS — the vision
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
              A memory that keeps its reasons
            </h3>
            <ul className="mt-5 space-y-3.5">
              {revo.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-aurora-2/15 text-aurora-2">
                    <Check className="size-3" />
                  </span>
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-balance text-base font-medium text-foreground/80">
        Other tools help you save information. Revo OS is being built to help you
        find it, understand it, and connect it again.
      </p>
    </section>
  );
}
