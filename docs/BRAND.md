# Revo OS — Brand Kit

The official identity for Revo OS, derived from the live design tokens in
`src/app/globals.css` and the assets in `public/`. Use this to produce on-brand
graphics, docs, and marketing without guesswork.

## Identity

| | |
| --- | --- |
| **Name** | Revo OS |
| **Short names** | Revo, RevoOS |
| **Category** | The AI memory layer for your digital life |
| **Tagline** | Save anything. Remember why. |
| **Differentiator** | Not another place to dump links. |
| **Domain** | https://revoos.app |
| **Contact** | hello@revoos.app |
| **Publisher** | Ctrl Works |

**Voice.** Product-brand only — no founder or personal identity. Calm,
clear, honest. Always distinguish what is **live today** (working prototype:
capture + keyword search + grounded answers, browser-local) from what the
**waitlist unlocks** (accounts/sync, automatic capture, natural-language
recall).

## Logo

The mark is the white lucide **`brain-circuit`** glyph on the **brand-gradient**
rounded square (rounded-xl corner), matching the in-app header badge.

| Asset | File | Size |
| --- | --- | --- |
| Primary mark (vector) | `public/icon.svg` | 64×64 viewBox |
| Favicon | `public/favicon.ico` | 32×32 |
| Apple touch icon | `public/apple-touch-icon.png` | 180×180 |
| Structured-data logo | `public/logo.png` | 512×512 |
| Social card | `public/og.png` | 1200×630 |

Regenerate all assets from `icon.svg`:

```bash
node scripts/generate-logos.mjs
```

**Clear space:** keep padding of at least the glyph's stroke width on all sides.
**Don't:** recolor the glyph, replace the gradient, stretch, or place the mark on
a busy background without the rounded-square backing.

## Color palette

Hex values are converted from the OKLCH source tokens.

| Role | Hex | OKLCH | Use |
| --- | --- | --- | --- |
| Canvas / background | `#F8F7FB` | `0.978 0.006 295` | App/landing background (lavender-tinted white) |
| Surface / card | `#FFFFFF` | `1 0 0` | Cards, popovers |
| Foreground (text) | `#2A2739` | `0.285 0.032 292` | Primary text |
| Primary / `--aurora-2` | `#7B56D8` | `0.56 0.19 292` | Brand purple, CTAs, focus ring |
| `--aurora-1` | `#805DDF` | `0.58 0.19 292` | Gradient start |
| `--aurora-3` (sky) | `#59BBFB` | `0.76 0.13 240` | Gradient end |
| `--aurora-4` (lavender) | `#BEAEDE` | `0.78 0.07 300` | Soft accents |
| Secondary | `#F0EFF8` | `0.955 0.012 293` | Subtle fills |
| Muted | `#EFEEF5` | `0.952 0.01 293` | Muted fills |
| Muted foreground | `#5D5C68` | `0.48 0.02 292` | Secondary text, labels |
| Accent | `#EAE9F9` | `0.94 0.022 290` | Hover/active tint |
| Destructive | `#DF202E` | `0.58 0.22 25` | Errors, destructive actions |
| Border | `oklch(0.3 0.02 292 / 12%)` | — | Hairline borders (12% opacity) |

**Browser theme color:** `#F4F3FB`. The product ships **light only**; dark mode
is scaffolded (`@custom-variant dark`) but has no token block yet.

## Gradients

| Name | Stops | Angle | Use |
| --- | --- | --- | --- |
| Brand gradient | `#805DDF → #4983E5 55% → #59BBFB` | 135° | Logo, primary CTAs |
| Text gradient | `#7C5CFF → #5C9BFF 50% → #38BDF8` | 90° | Headline accents |
| Aurora text | `aurora-1 → aurora-2 40% → aurora-3 75% → aurora-4` | 120° | Display text accents |

## Typography

| Token | Font | Use |
| --- | --- | --- |
| `--font-display` / `--font-heading` | **Space Grotesk** | Headings, logo wordmark, display numbers |
| `--font-sans` | **Inter** | Body text (default) |
| `--font-mono` | System monospace stack | Code / mono text |

Headings pair `font-display` with `tracking-tight` and balanced wrapping.

## Shape, surfaces, motion

- **Radius:** base `12px` (`--radius: 0.75rem`). Cards `rounded-2xl` (~21.6px),
  hero/CTA panels `28px`, pills and CTAs `rounded-full`.
- **Surfaces:** glassy — `bg-card/55` with `backdrop-blur(20px)` and a hairline
  `border-border/50`.
- **Elevation:** soft, colored shadows composed with `color-mix` against
  `--aurora-2` (e.g. `0 12px 32px -12px aurora-2@70%`). `.ring-glow` = 1px
  aurora ring + soft glow.
- **Background treatment:** blurred aurora orbs (`.aurora-orb`,
  `.pastel-wash`), subtle grain (~3.5% noise via `.grain`).
- **Motion:** entrances ease `cubic-bezier(0.16, 1, 0.3, 1)`; fade-up,
  scale-in, gentle float, shimmer. Honors `prefers-reduced-motion`.
- **Overall feel:** soft light "aurora" — near-white lavender canvas,
  purple→blue→cyan accents, translucent panels, generous radii, calm motion.

## Do / Don't

- **Do** keep gradients at 135° for the brand surface and 90° for text.
- **Do** place the mark on the brand-gradient rounded square, never bare.
- **Don't** introduce off-palette colors, hard black text, or heavy drop shadows.
- **Don't** claim future features as live — label live vs. coming.
