import { MessagesSquare, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/landing/section-header";
import { Reveal } from "@/components/motion/reveal";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WaitlistCount } from "@/components/waitlist/waitlist-count";
import { memories } from "@/lib/mock-data";

const perks: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Zap,
    title: "Early access",
    text: "Try new versions before the public launch.",
  },
  {
    icon: MessagesSquare,
    title: "Shape the product",
    text: "Your feedback goes straight into the roadmap.",
  },
];

export function WaitlistSection() {
  return (
    <section id="waitlist" className="container mx-auto max-w-7xl px-5 py-20 sm:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeader
            kicker="Private preview · forming now"
            title={
              <>
                Help shape the future of{" "}
                <span className="text-gradient">personal AI memory.</span>
              </>
            }
            lead="Join the waitlist to follow development and try new versions first. No spam — just a note when something ships."
          />
          <div className="mt-9 space-y-4">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl icon-chip">
                  <Icon className="size-4 text-aurora-2" />
                </span>
                <div>
                  <p className="text-sm font-semibold tracking-tight">{title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="rounded-[28px] border border-border/50 bg-card/55 p-1 shadow-[0_24px_60px_-30px_rgba(124,92,255,0.35)] backdrop-blur-xl">
            <div className="p-7 sm:p-9">
              <Badge
                variant="secondary"
                className="mb-4 gap-1.5 rounded-full border-border/50 bg-card/65 px-3 py-1 text-[11px] font-semibold text-aurora-2 shadow-sm backdrop-blur-xl"
              >
                <Sparkles className="size-3" />
                Join the preview
              </Badge>
              <WaitlistForm />
              <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-center sm:gap-6">
                <div>
                  <p className="font-display text-2xl font-semibold tracking-tight">
                    <WaitlistCount />
                  </p>
                  <p className="text-xs text-muted-foreground">on the list</p>
                </div>
                <span className="h-8 w-px bg-border" />
                <div>
                  <p className="font-display text-2xl font-semibold tracking-tight">
                    {memories.length.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">sample memories indexed</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
