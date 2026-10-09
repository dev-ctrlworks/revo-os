# Design System

Revo OS's visual language is a soft, light "aurora" aesthetic: a near-white
lavender canvas, a purple→blue→cyan accent range, glassy translucent
surfaces, generous radii, and gentle motion. Tokens are defined CSS-first in
`src/app/globals.css` using Tailwind v4's `@theme inline`.

## Typography

Loaded in `src/app/layout.tsx` via `next/font/google`, exposed as CSS vars and
mapped in `@theme`:

| Token | Font | Usage |
| --- | --- | --- |
| `--font-sans` (`--font-inter`) | Inter | Body text (default on `html`). |
| `--font-display` / `--font-heading` (`--font-space-grotesk`) | Space Grotesk | Headings, logo, display numbers. |
| `--font-mono` | System monospace stack | Code/mono text. |

Use the Tailwind classes `font-sans`, `font-display`/`font-heading`, and
`font-mono`. Headings commonly pair `font-display` with `tracking-tight` and
`text-balance`.

## Color tokens

Defined as OKLCH custom properties on `:root` and surfaced as Tailwind color
utilities via `@theme inline` (e.g. `--color-background: var(--background)` →
`bg-background`).

| Token | Light value (OKLCH) | Role |
| --- | --- | --- |
| `--background` | `0.978 0.006 295` | App canvas (lavender-tinted white). |
| `--foreground` | `0.285 0.032 292` | Primary text. |
| `--card` / `--popover` | `1 0 0` | Surfaces (pure white). |
| `--primary` | `0.56 0.19 292` | Brand purple; focus ring. |
| `--primary-foreground` | `0.99 0.005 290` | Text on primary. |
| `--secondary` / `--muted` | `~0.95 0.01 293` | Subtle fills. |
| `--muted-foreground` | `0.48 0.02 292` | Secondary text, labels. |
| `--accent` | `0.94 0.022 290` | Hover/active tint. |
| `--destructive` | `0.58 0.22 25` | Errors/destructive actions. |
| `--border` | `0.3 0.02 292 / 12%` | Hairline borders. |
| `--input` | `0.3 0.02 292 / 14%` | Input borders. |
| `--ring` | `0.56 0.19 292` | Focus ring. |

Chart tokens `--chart-1..5` run purple → blue → violet → cyan → magenta.
Sidebar tokens (`--sidebar*`) mirror the surface scheme.

### Aurora accent tokens

Four `--aurora-*` values drive gradients, glows, and the animated background:

| Token | OKLCH | Feel |
| --- | --- | --- |
| `--aurora-1` | `0.58 0.19 292` | violet |
| `--aurora-2` | `0.58 0.19 292` | primary purple (most-used accent) |
| `--aurora-3` | `0.76 0.13 240` | sky blue |
| `--aurora-4` | `0.78 0.07 300` | lavender |

Referenced as `text-aurora-2`, `bg-aurora-2/10`, `from-aurora-2`, etc. The
brand gradient (`src/lib/brand.ts`) is
`linear-gradient(135deg, oklch(0.58 0.19 292), oklch(0.62 0.16 260) 55%,
oklch(0.76 0.13 240))`.

> Dark mode is scaffolded (`@custom-variant dark (&:is(.dark *))`) but no
> `.dark` token block is defined yet; the product currently ships light-only.

## Radius

Base `--radius: 0.75rem`, scaled via `@theme`:

| Token | Multiplier | Approx |
| --- | --- | --- |
| `rounded-sm` | 0.6× | 7.2px |
| `rounded-md` | 0.8× | 9.6px |
| `rounded-lg` | 1.0× | 12px |
| `rounded-xl` | 1.4× | 16.8px |
| `rounded-2xl` | 1.8× | 21.6px |
| `rounded-3xl` | 2.2× | 26.4px |
| `rounded-4xl` | 2.6× | 31.2px |

Cards and panels frequently use `rounded-2xl`; hero/CTA panels use
`rounded-[28px]`; pills and CTAs often use `rounded-full`.

## Elevation and surfaces

- Shadows are soft, colored, and low-opacity, typically spelled inline, e.g.
  `shadow-[0_12px_32px_-12px_color-mix(in_oklab,var(--aurora-2)_70%,transparent)]`.
  There is no fixed shadow scale — compose with `color-mix` against
  `--aurora-2`.
- **Glass surface:** `.glass` = card at 55% opacity + `backdrop-blur(20px)`.
  Panels commonly use `bg-card/55 backdrop-blur-xl` with `border-border/50`.
- **Ring glow:** `.ring-glow` combines a 1px aurora ring with a soft colored
  shadow.

## Utility classes (`@layer utilities`)

Brand and decoration:

- `.brand-gradient`, `.text-gradient`, `.aurora-text` — gradient fills.
- `.icon-chip` — subtle aurora-tinted chip background.
- `.color-copy-primary` — primary-tinted copy color.
- `.glass`, `.ring-glow`, `.grain` (noise overlay), `.text-balance`.
- `.pastel-wash`, `.aurora-orb` — blurred color blobs for backgrounds.

Motion (see below for keyframes):

- `.animate-fade-up`, `.animate-fade-in`, `.animate-scale-in`,
  `.animate-gradient-x`, `.animate-float`, `.animate-spin-slow`,
  `.animate-dash`, `.animate-shimmer`, `.animate-bar-grow`,
  `.animate-path-flow`, `.animate-track`, `.animate-tape`,
  `.animate-beam-dash`, `.animate-scan`.
- Stagger helpers: `.delay-100` … `.delay-700`.

Dashboard utilities:

- `.scrollbar-hide`
- `.dashboard-density-comfortable|compact|dense` — set `--card-padding`,
  `--card-gap`, `--item-height`.
- `.dashboard-grid` — 1 → 2 (sm) → 4 (lg) column responsive grid.
- `.heatmap-cell`, `.type-bar`, `.selection-ring`, `.metric-strip`,
  `.empty-state-pulse`, `.feed-row`, `.filter-chip-active`, `.quick-action`.

## Motion

- `@keyframes`: `fadeUp`, `fadeIn`, `scaleIn`, `gradientX`, `floatY`,
  `breathe`, `shimmer`, `spinSlow`, `dashFlow`, `barGrow`, `pathFlow`,
  `trackTravel`, `tapeScroll`, `beamStrip`, `scan`, `pulse-ring`.
- Easing convention: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances.
- React-level motion uses `framer-motion` through the `motion/` components:
  `Reveal` (scroll reveal), `Stagger`/`StaggerItem`, `CountUp`, and
  `AuroraBackground`.
- **Reduced motion is respected** globally: a
  `@media (prefers-reduced-motion: reduce)` block forces near-zero
  animation/transition durations and disables smooth scrolling.

## Components

### Primitives (`src/components/ui/`)

Built on Base UI + shadcn conventions, styled with CVA and `cn`:
`avatar`, `badge`, `button`, `card`, `checkbox`, `command`, `dialog` +
`dialog-shell`, `dropdown-menu`, `input`, `input-group`, `label`, `popover`,
`progress`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`,
`switch`, `tabs`, `textarea`, `toggle`, `tooltip`.

### Composite areas

- `layout/` — `app-shell`, `app-sidebar` (collapsible rail with hover-expand,
  mobile sheet), `dashboard-header`, `cookie-notice`.
- `landing/` — `section-header`, `capture-sources`, `how-it-works`,
  `connection-diagram`, `product-showcase`, `use-cases`, `privacy`,
  `memory-preview`.
- `dashboard/` — `MetricGrid`, `ActivityHeatmap`, `ActivityGraph`,
  `TypeBreakdown`, `QuickActions`, `FilterChips(+Wrapper)`, `ViewModeToggle`,
  `DashboardLayout`.
- `memories/` — `memory-card`, `memory-type-icon`, `memory-edit-dialog`,
  `artifact-preview`, `web-link-preview`, `collection-picker`.
- `capture/`, `graph/`, `ai/`, `command/`, `feedback/`, `waitlist/`,
  `legal/`, `analytics/`, `motion/`.

## Component patterns

- **Buttons:** primary CTAs use a gradient fill + soft colored shadow +
  `rounded-full`, often with `hover:scale-[1.02]`. Secondary CTAs use
  `variant="outline"` with `bg-card/55 backdrop-blur-xl`. Polymorphism uses
  Base UI's `render` prop (`render={<Link href=... />}` + `nativeButton={false}`).
- **Cards/panels:** `rounded-2xl border border-border/50 bg-card/55
  backdrop-blur-xl` with a soft inline shadow.
- **Active nav:** gradient tint background, aurora left indicator bar, and an
  aurora glow dot — see `app-sidebar.tsx`.
- **Chips/pills:** `rounded-full border-border/50 bg-card/45` for trust tags;
  `filter-chip-active` for selected filters.
- **Status dot:** `animate-ping` ring + solid emerald dot for the
  "N memories · synced" indicator.
- **Empty states:** `empty-state-pulse` radiating ring behind a CTA.
- **Icon chips:** `.icon-chip` background with an `aurora-2` icon.

## Accessibility

- Semantic landmarks (`header`, `main`, `nav`, `footer`, `aside`) and
  `aria-label`s on icon-only controls.
- Visible focus driven by `--ring` (via the base `*` rule
  `outline-ring/50`).
- Motion honors `prefers-reduced-motion`.
- `viewport-fit: cover` and a `#f4f3fb` theme color set in `layout.tsx`.
