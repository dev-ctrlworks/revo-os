import {
  Check,
  FolderTree,
  HelpCircle,
  Sparkles,
  Unlink,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/landing/section-header";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const problems: { icon: LucideIcon; title: string; text: string; tone: string }[] = [
  {
    icon: FolderTree,
    title: "Lost in the pile",
    text: "You saved something useful but can't find it again.",
    tone: "text-amber-500",
  },
  {
    icon: HelpCircle,
    title: "Missing context",
    text: "You find the link but forget why it mattered.",
    tone: "text-sky-500",
  },
  {
    icon: Unlink,
    title: "Scattered",
    text: "Notes, links, and files live in different apps.",
    tone: "text-rose-500",
  },
];

const revo = [
  "One place for every kind of memory.",
  "Find things by asking, not remembering.",
  "Related memories stay connected.",
];

export function Problem() {
  return (
    <section id="why" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <SectionHeader
        kicker="The problem"
        align="center"
        title={
          <>
            You save everything.{" "}
            <span className="text-gradient">Finding it again</span> is another
            story.
          </>
        }
        lead="Your useful stuff ends up scattered across six different apps — and weeks later you can't remember where any of it went."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {problems.map(({ icon: Icon, title, text, tone }, i) => (
          <Reveal key={title} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-border/50 bg-card/55 p-5 backdrop-blur-xl">
              <span className={cn("grid size-10 place-items-center rounded-xl icon-chip", tone)}>
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-6" y={28}>
        <div className="rounded-[28px] border border-aurora-2/30 bg-gradient-to-br from-aurora-2/[0.08] via-card/55 to-aurora-3/[0.08] p-6 shadow-[0_28px_70px_-40px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)] backdrop-blur-xl sm:p-8">
          <ul className="grid gap-4 sm:grid-cols-3">
            {revo.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-aurora-2/15 text-aurora-2">
                  <Check className="size-3" />
                </span>
                <span className="font-medium text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles className="size-3.5 text-aurora-2" />
            With Revo OS — the prototype runs on sample data.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
