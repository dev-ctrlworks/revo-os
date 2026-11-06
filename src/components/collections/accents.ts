import { cn } from "@/lib/utils";

// Map deterministic collection colors onto the RevoOS design tokens so
// collections feel part of the same palette as memory types.
const ACCENT_BAR: Record<string, string> = {
  violet: "bg-primary",
  sky: "bg-sky",
  lime: "bg-lime",
  pink: "bg-pink",
  amber: "bg-amber",
};

const ACCENT_SOFT: Record<string, string> = {
  violet: "bg-lavender text-lavender-foreground",
  sky: "bg-[color-mix(in_oklab,var(--sky)_42%,white)] text-sky-deep",
  lime: "bg-[color-mix(in_oklab,var(--lime)_42%,white)] text-lime-deep",
  pink: "bg-[color-mix(in_oklab,var(--pink)_42%,white)] text-pink-deep",
  amber: "bg-[color-mix(in_oklab,var(--amber)_42%,white)] text-amber-deep",
};

/** Top accent bar class for a deterministic collection color. */
export function accentBar(color: string): string {
  return cn(ACCENT_BAR[color] ?? ACCENT_BAR.violet);
}

/** Soft tinted chip class for a deterministic collection color. */
export function accentSoft(color: string): string {
  return cn(ACCENT_SOFT[color] ?? ACCENT_SOFT.violet);
}
