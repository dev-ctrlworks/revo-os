import type { CSSProperties } from "react";
import { Parallax } from "./motion";

type Blob = {
  color: string;
  className: string;
  motion?: "mkt-drift" | "mkt-float" | "mkt-float-slow";
  delay?: number;
};

const presets: Record<AmbientVariant, { opacity: number; blobs: Blob[] }> = {
  hero: {
    opacity: 0.7,
    blobs: [
      { color: "var(--sky)", className: "left-[6%] top-[-8%] h-80 w-80", motion: "mkt-drift" },
      { color: "var(--pink)", className: "right-[4%] top-[-2%] h-96 w-96", motion: "mkt-float-slow" },
      { color: "var(--lime)", className: "left-[40%] top-[14%] h-72 w-72", motion: "mkt-drift" },
      { color: "var(--lavender)", className: "left-[13%] top-[42%] h-64 w-64", motion: "mkt-float-slow" },
      { color: "var(--cyan)", className: "right-[14%] top-[46%] h-64 w-64", motion: "mkt-drift" },
    ],
  },
  section: {
    opacity: 0.3,
    blobs: [
      { color: "var(--sky)", className: "left-[-4%] top-[12%] h-72 w-72", motion: "mkt-drift" },
      { color: "var(--pink)", className: "right-[-4%] bottom-[8%] h-80 w-80", motion: "mkt-float-slow" },
      { color: "var(--lime)", className: "left-[42%] bottom-[-6%] h-64 w-64", motion: "mkt-drift" },
    ],
  },
  band: {
    opacity: 0.45,
    blobs: [
      { color: "var(--lavender)", className: "left-[8%] top-[-20%] h-64 w-64", motion: "mkt-float-slow" },
      { color: "var(--pink)", className: "right-[10%] bottom-[-24%] h-72 w-72", motion: "mkt-drift" },
      { color: "var(--cyan)", className: "left-[46%] top-[10%] h-56 w-56", motion: "mkt-float" },
    ],
  },
};

export type AmbientVariant = "hero" | "section" | "band";

/**
 * Full-bleed decorative wash shared by every marketing section: a slow-moving
 * multi-pastel aurora plus a few blurred blobs. Purely visual.
 *
 * The wrapper establishes its own stacking context (`isolate`) so its `-z-10`
 * layer paints above the section background but below the section content —
 * without this, an opaque ancestor background (e.g. the layout's `bg-white`)
 * would paint over the wash and hide it.
 */
export function AmbientBackdrop({
  variant = "section",
  parallax = true,
  parallaxDistance = 60,
}: {
  variant?: AmbientVariant;
  parallax?: boolean;
  parallaxDistance?: number;
}) {
  const preset = presets[variant];

  const layer = (
    <>
      <div
        className="mkt-aurora mkt-aurora-drift absolute inset-0"
        style={{ opacity: preset.opacity }}
      />
      {preset.blobs.map((blob, i) => (
        <span
          key={`${blob.color}-${i}`}
          className={`mkt-blob ${blob.className} ${blob.motion ?? "mkt-drift"}`}
          style={
            {
              "--mkt-color": blob.color,
              animationDelay: `${(i % 3) * -2.2}s`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );

  return (
    <div className="pointer-events-none absolute inset-0 isolate -z-10" aria-hidden>
      {parallax ? (
        <Parallax className="absolute inset-0" distance={parallaxDistance} ariaHidden>
          {layer}
        </Parallax>
      ) : (
        layer
      )}
    </div>
  );
}
