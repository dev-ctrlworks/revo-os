import type { CSSProperties } from "react";
import { Network, Plus, Sparkles, type LucideIcon } from "lucide-react";
import { SectionHeading, SectionShell } from "./section";
import { DrawLine, Stagger, StaggerItem } from "./motion";
import { accentInk, howItWorksSteps, type Step } from "./content";

const icons: Record<Step["icon"], LucideIcon> = {
  save: Plus,
  connect: Network,
  recall: Sparkles,
};

export function HowItWorksSection() {
  return (
    <SectionShell id="how">
      <SectionHeading
        kicker="How it works"
        accent="var(--cyan)"
        title="Capture, connect, recall."
        underline="recall"
        lead="Capture it, let it connect, then ask for it back."
      />

      <Stagger className="relative mt-14 grid gap-5 md:grid-cols-3">
        <DrawLine className="pointer-events-none absolute left-0 right-0 top-[46px] hidden h-[3px] rounded-full bg-gradient-to-r from-[var(--cyan)] via-[var(--lime-bright)] to-[var(--magenta)] opacity-70 md:block" />

        {howItWorksSteps.map(({ icon, step, title, text, accent }) => {
          const Icon = icons[icon];
          return (
            <StaggerItem key={title} className="h-full">
              <div
                className="mkt-lift relative flex h-full flex-col overflow-hidden rounded-[32px] border border-border bg-white p-8"
                style={{ "--step-accent": accent } as CSSProperties}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--step-accent), color-mix(in oklab, var(--step-accent) 18%, transparent))",
                  }}
                  aria-hidden
                />
                <div className="flex items-center justify-between">
                  <span
                    className="grid size-12 place-items-center rounded-2xl"
                    style={{
                      backgroundColor:
                        "color-mix(in oklab, var(--step-accent) 48%, white)",
                      color: accentInk(accent),
                    }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span
                    className="font-display text-2xl font-bold tracking-tight"
                    style={{ color: accentInk(accent) }}
                  >
                    {step}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-heading">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text/75">{text}</p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </SectionShell>
  );
}
