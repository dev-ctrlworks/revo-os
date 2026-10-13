import {
  FolderTree,
  HelpCircle,
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
    text: "You remember saving something useful, but you can't find it again.",
    tone: "text-amber-500",
  },
  {
    icon: HelpCircle,
    title: "Missing context",
    text: "You find the link or screenshot but forget why it mattered.",
    tone: "text-sky-500",
  },
  {
    icon: Unlink,
    title: "Disconnected information",
    text: "The note, document, and reference that belong together are scattered across different places.",
    tone: "text-rose-500",
  },
];

const scattered = [
  { label: "Screenshots", where: "Camera roll" },
  { label: "Bookmarks", where: "Browser" },
  { label: "Notes", where: "Notes app" },
  { label: "PDFs", where: "Downloads" },
  { label: "Links", where: "Chat" },
  { label: "Docs", where: "Work drive" },
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
        lead="Useful information lands across bookmarks, screenshots, notes, documents, messages, and downloads. Weeks later you can't recall where something went — or why you kept it."
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

      <Reveal className="mt-12" y={28}>
        <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-card/45 p-6 backdrop-blur-xl sm:p-10">
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Where it ends up today
              </p>
              <div className="grid grid-cols-2 gap-2">
                {scattered.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border/50 bg-card/60 px-3 py-2.5 backdrop-blur-xl"
                  >
                    <p className="text-[13px] font-medium">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground">{item.where}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <span className="flex size-11 items-center justify-center rounded-2xl brand-gradient text-white shadow-[0_12px_30px_-14px_color-mix(in_oklab,var(--aurora-2)_80%,transparent)]">
                <span className="font-display text-lg font-bold">→</span>
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-aurora-2">
                One memory layer
              </p>
              <div className="rounded-2xl border border-aurora-2/30 bg-gradient-to-br from-aurora-2/[0.08] via-card/55 to-aurora-3/[0.08] p-5 shadow-[0_28px_70px_-40px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)] backdrop-blur-xl">
                <p className="font-display text-lg font-semibold tracking-tight">
                  Everything, in one searchable place
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  Context preserved, related items linked, and answers one
                  natural-language question away.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <p className="mx-auto mt-10 max-w-2xl text-center text-balance text-base font-medium text-foreground/80">
        Your digital life shouldn&apos;t depend on your ability to remember which
        app you used.
      </p>
    </section>
  );
}
