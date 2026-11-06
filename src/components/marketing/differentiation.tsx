import { Check, X } from "lucide-react";
import { SectionHeading, SectionShell } from "./section";
import { Reveal } from "./motion";
import { differentiationRows } from "./content";

export function DifferentiationSection() {
  return (
    <SectionShell>
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          kicker="Why it's different"
          accent="var(--magenta)"
          title="Built so your notes actually talk to each other."
          underline="talk"
          lead="Most tools give you a place to put things. Revo OS is built around getting them back with their context intact."
        />

        <Reveal className="mt-12" y={28}>
          <div className="overflow-hidden rounded-[32px] border border-border bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="border-b border-border bg-secondary/40 px-6 py-4 sm:border-b-0 sm:border-r">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Typical tools
                </p>
              </div>
              <div className="bg-primary/[0.06] px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Revo OS
                </p>
              </div>
            </div>

            {differentiationRows.map((row) => (
              <div
                key={row.us}
                className="grid grid-cols-1 border-t border-border/70 sm:grid-cols-2"
              >
                <div className="flex items-start gap-3 border-b border-border/70 px-6 py-5 transition-colors hover:bg-secondary/30 sm:border-b-0 sm:border-r">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                    <X className="size-3" />
                  </span>
                  <p className="text-sm leading-relaxed text-muted-foreground line-through decoration-border">
                    {row.them}
                  </p>
                </div>
                <div className="flex items-start gap-3 px-6 py-5 transition-colors hover:bg-primary/[0.04]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Check className="size-3" />
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-heading">
                    {row.us}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
