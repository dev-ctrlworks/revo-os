import type { CSSProperties } from "react";
import {
  Check,
  FolderSearch,
  HelpCircle,
  Unlink,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading, SectionShell } from "./section";
import { Reveal, Stagger, StaggerItem } from "./motion";
import {
  accentInk,
  problemCards,
  problemResolutions,
  type ProblemCard,
} from "./content";

const icons: Record<ProblemCard["icon"], LucideIcon> = {
  search: FolderSearch,
  context: HelpCircle,
  scatter: Unlink,
};

const dotAccents = ["var(--lime-bright)", "var(--sky)", "var(--pink)"];

export function ProblemSection() {
  return (
    <SectionShell id="why">
      <SectionHeading
        kicker="The problem"
        accent="var(--magenta)"
        title="Saved for a reason. Recall it when it matters."
        underline="reason"
        lead="You save everything. Finding it again — and remembering why — is another story."
      />

      <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
        {problemCards.map((card) => {
          const Icon = icons[card.icon];
          return (
            <StaggerItem key={card.title} className="h-full">
              <div
                className="mkt-lift group relative flex h-full flex-col overflow-hidden rounded-[32px] border border-border bg-white p-8"
                style={{ "--card-accent": card.accent } as CSSProperties}
              >
                <span
                  className="absolute inset-x-0 top-0 h-1.5"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--card-accent), color-mix(in oklab, var(--card-accent) 18%, transparent))",
                  }}
                  aria-hidden
                />
                <span
                  className="grid size-11 place-items-center rounded-2xl"
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, var(--card-accent) 46%, white)",
                    color: accentInk(card.accent),
                  }}
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-heading">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text/75">
                  {card.text}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal className="mt-6" y={26}>
        <div className="relative overflow-hidden rounded-[32px] border border-primary/15 bg-[#f6f4ff] p-8 sm:p-10">
          <span
            className="mkt-blob right-[-4%] top-[-30%] h-56 w-56 opacity-50"
            style={{ "--mkt-color": "var(--sky)" } as CSSProperties}
            aria-hidden
          />
          <span
            className="mkt-blob bottom-[-40%] left-[12%] h-52 w-52 opacity-45"
            style={{ "--mkt-color": "var(--pink)" } as CSSProperties}
            aria-hidden
          />
          <p className="relative text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            With Revo OS
          </p>
          <ul className="relative mt-5 grid gap-4 sm:grid-cols-3">
            {problemResolutions.map((resolution, i) => (
              <li key={resolution} className="flex items-start gap-2.5 text-sm">
                <span
                  className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full"
                  style={{
                    backgroundColor:
                      "color-mix(in oklab, var(--dot-accent) 34%, white)",
                    color: accentInk(dotAccents[i]),
                    "--dot-accent": dotAccents[i],
                  } as CSSProperties}
                >
                  <Check className="size-3" />
                </span>
                <span className="font-medium text-heading">{resolution}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </SectionShell>
  );
}
