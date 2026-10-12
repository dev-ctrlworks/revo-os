import { Check, X } from "lucide-react";

const dumpRows = [
  "Saved, then buried in a folder you never reopen",
  "A flat pile of links, screenshots, and files",
  "You re-research the same thing a month later",
  "The reason you saved it lived in your head",
];

const memoryRows = [
  "Every capture keeps its context — project, topic, the moment",
  "Related items link to each other by shared subject, automatically",
  "Everything connected to a memory is one hop away",
  "The reason stays with the item, not in your head",
];

export function Difference() {
  return (
    <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-border/50 bg-card/40 p-6 backdrop-blur-xl sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <X className="size-3" />
          A place to dump
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-muted-foreground">
          Another saved-links graveyard
        </h3>
        <ul className="mt-5 space-y-3.5">
          {dumpRows.map((row) => (
            <li key={row} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-border/60 bg-card/60">
                <X className="size-3" />
              </span>
              {row}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-aurora-2/30 bg-gradient-to-br from-aurora-2/[0.08] via-card/55 to-aurora-3/[0.08] p-6 shadow-[0_28px_70px_-40px_color-mix(in_oklab,var(--aurora-2)_60%,transparent)] backdrop-blur-xl sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-aurora-2/30 bg-aurora-2/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-aurora-2">
          <Check className="size-3" />
          Revo OS
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
          A memory that keeps its reasons
        </h3>
        <ul className="mt-5 space-y-3.5">
          {memoryRows.map((row) => (
            <li key={row} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-aurora-2/15 text-aurora-2">
                <Check className="size-3" />
              </span>
              <span className="text-foreground/90">{row}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
