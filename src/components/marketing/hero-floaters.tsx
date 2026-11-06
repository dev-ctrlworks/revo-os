import type { CSSProperties } from "react";
import {
  Camera,
  Link2,
  Lock,
  Mail,
  Sparkles,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { MemoryThumb } from "./memory-thumb";
import { accentInk, heroChips } from "./content";

type Motion = "mkt-float" | "mkt-float-slow" | "mkt-drift";

const cardBase =
  "pointer-events-auto absolute hidden rounded-2xl border border-border/60 bg-white/95 p-3 shadow-[0_16px_40px_-24px_rgba(33,22,76,0.4)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 xl:block";

const chipBase =
  "pointer-events-auto absolute items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[11px] font-medium whitespace-nowrap shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1";

const tileBase =
  "pointer-events-auto absolute grid size-11 place-items-center rounded-xl border border-white/70 shadow-sm backdrop-blur-sm transition-transform duration-300 hover:scale-105";

const noteRows = [
  { label: "Kyoto trip ideas", accent: "var(--sky)" },
  { label: "Lens reviews", accent: "var(--pink)" },
  { label: "Weekly recap", accent: "var(--lime)" },
];

const chipPos: { pos: string; motion: Motion; display: string }[] = [
  { pos: "left-[8%] top-[10%] -rotate-3", motion: "mkt-float", display: "flex" },
  {
    pos: "right-[6%] top-[62%] rotate-2",
    motion: "mkt-float-slow",
    display: "hidden lg:flex",
  },
  { pos: "left-[8%] top-[90%] -rotate-2", motion: "mkt-float", display: "flex" },
];

const chipDelay = [-1.2, -2.6, -0.8];

const tiles: {
  pos: string;
  motion: Motion;
  delay: number;
  Icon: LucideIcon;
  bg: string;
  ink: string;
}[] = [
  {
    pos: "left-[32%] top-[9%]",
    motion: "mkt-float",
    delay: -0.6,
    Icon: Camera,
    bg: "bg-sky/60",
    ink: "text-sky-deep",
  },
  {
    pos: "left-[62%] top-[7%]",
    motion: "mkt-drift",
    delay: -3.4,
    Icon: Mail,
    bg: "bg-coral/60",
    ink: "text-coral-deep",
  },
  {
    pos: "right-[7%] top-[44%]",
    motion: "mkt-float-slow",
    delay: -2.2,
    Icon: Link2,
    bg: "bg-lime/60",
    ink: "text-lime-deep",
  },
  {
    pos: "left-[70%] top-[9%]",
    motion: "mkt-drift",
    delay: -4,
    Icon: Sparkles,
    bg: "bg-pink/60",
    ink: "text-magenta-deep",
  },
];

const delay = (seconds: number): CSSProperties =>
  ({ animationDelay: `${seconds}s` }) as CSSProperties;

const chipStyle = (accent: string): CSSProperties =>
  ({
    borderColor: `color-mix(in oklab, ${accent} 55%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${accent} 28%, white)`,
    color: accentInk(accent),
    "--chip-accent": accent,
  }) as CSSProperties;

/**
 * Capacities-style hero collage: a soft centre glow with rotated mockup cards,
 * feature chips, and icon tiles drifting behind the copy. Purely decorative
 * (`aria-hidden`; only hover-lift affordances are interactive) and hidden below
 * `md` so it never crowds smaller screens. Text in the hero renders above this
 * layer, so the white cards sitting behind it do not affect readability.
 */
export function HeroFloaters() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-28 z-0 hidden h-[34rem] md:block"
      aria-hidden
    >
      <span className="absolute left-1/2 top-[46%] h-[16rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_55%,transparent),transparent)] opacity-40 blur-3xl" />

      <div
        className={`${cardBase} left-[6%] top-[42%] w-[13rem] -rotate-4 mkt-float-slow`}
        style={delay(-1.4)}
      >
        <div className="flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-pink/60">
            <StickyNote className="size-3.5 text-pink-deep" />
          </span>
          <span className="text-xs font-semibold text-heading">
            Meeting notes
          </span>
          <span className="ml-auto rounded-full bg-lime/40 px-1.5 py-0.5 text-[9px] font-semibold text-lime-deep">
            Today
          </span>
        </div>
        <ul className="mt-2.5 space-y-1.5">
          {noteRows.map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-2 text-[10px] text-text/70"
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: row.accent }}
              />
              <span className="truncate">{row.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[9px] text-muted-foreground">
          Captured with context
        </p>
      </div>

      <div
        className={`${cardBase} right-[6%] top-[12%] w-[12.5rem] rotate-3 mkt-float`}
        style={delay(-2.6)}
      >
        <MemoryThumb
          type="image"
          title="Kyoto 2019"
          tags={["japan"]}
          context="Japan trip"
          seed="hero-floater"
          className="h-16 w-full"
        />
        <p className="mt-2 truncate text-xs font-semibold text-heading">
          kyoto-2019.jpg
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Image · Japan trip
        </p>
      </div>

      <div
        className={`${cardBase} right-[6%] top-[74%] w-[14rem] -rotate-2 mkt-float`}
        style={delay(-3.8)}
      >
        <div className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-white px-2 py-1">
          <Link2 className="size-3 shrink-0 text-sky-deep" />
          <span className="truncate text-[10px] text-text/60">
            revoos.app/blog/context
          </span>
        </div>
        <p className="mt-2 text-xs font-semibold leading-snug text-heading">
          Why context beats folders
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Saved with the page’s context
        </p>
      </div>

      {heroChips.map((chip, i) => (
        <div
          key={chip.label}
          className={`${chipBase} ${chipPos[i].pos} ${chipPos[i].motion} ${chipPos[i].display}`}
          style={{ ...chipStyle(chip.accent), ...delay(chipDelay[i]) }}
        >
          {chip.label.toLowerCase().includes("private") ? (
            <Lock
              className="size-3.5 shrink-0"
              style={{ color: accentInk(chip.accent) }}
            />
          ) : (
            <Sparkles
              className="size-3.5 shrink-0"
              style={{ color: accentInk(chip.accent) }}
            />
          )}
          {chip.label}
        </div>
      ))}

      {tiles.map((tile) => (
        <span
          key={tile.pos}
          className={`${tileBase} ${tile.pos} ${tile.motion} ${tile.bg}`}
          style={delay(tile.delay)}
        >
          <tile.Icon className={`size-5 ${tile.ink}`} />
        </span>
      ))}
    </div>
  );
}
