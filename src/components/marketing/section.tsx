import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { accentInk } from "./content";
import { Reveal } from "./motion";
import { SquiggleUnderline } from "./squiggle-underline";

/**
 * Small uppercase label that introduces a section. Uses a pastel accent chip so
 * each section carries its own colour without decorating everything.
 */
export function Kicker({
  children,
  accent = "var(--primary)",
  className,
}: {
  children: ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur",
        className
      )}
      style={
        {
          color: accentInk(accent),
          borderColor: "color-mix(in oklab, var(--kicker-accent) 55%, transparent)",
          backgroundColor: "color-mix(in oklab, var(--kicker-accent) 26%, white)",
          "--kicker-accent": accent,
        } as CSSProperties
      }
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: accentInk(accent) }}
      />
      {children}
    </p>
  );
}

/**
 * The standard centered/left section title block. Wrapped in a scroll reveal so
 * every section enters the same way.
 */
export function SectionHeading({
  kicker,
  title,
  underline,
  lead,
  align = "center",
  accent = "var(--primary)",
  className,
}: {
  kicker?: ReactNode;
  title: string;
  underline?: string;
  lead?: ReactNode;
  align?: "left" | "center";
  accent?: string;
  className?: string;
}) {
  const at = underline ? title.indexOf(underline) : -1;
  const before = at >= 0 ? title.slice(0, at) : title;
  const match = at >= 0 ? underline : "";
  const after = at >= 0 ? title.slice(at + underline!.length) : "";

  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {kicker && <Kicker accent={accent}>{kicker}</Kicker>}
      <h2 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-heading sm:text-5xl">
        {at >= 0 ? (
          <>
            {before}
            <SquiggleUnderline color={accent}>{match}</SquiggleUnderline>
            {after}
          </>
        ) : (
          title
        )}
      </h2>
      {lead && (
        <p className="mt-4 text-balance text-lg leading-relaxed text-text/80">
          {lead}
        </p>
      )}
    </Reveal>
  );
}

/** Consistent vertical rhythm + horizontal gutter for a landing section. */
export function SectionShell({
  id,
  children,
  className,
  bordered = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-28 overflow-hidden px-5 py-20 sm:py-24",
        bordered && "border-y border-border/60",
        className
      )}
    >
      <div className="relative mx-auto max-w-[1200px]">{children}</div>
    </section>
  );
}
