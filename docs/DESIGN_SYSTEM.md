# Design System

Your digital memories, brought together in a living canvas.
**Product:** RevoOS
**Publisher:** Ctrl Works
**Theme:** Light
**Visual reference:** Adora — impressionist color behind a crisp, minimal interface
**Design direction:** Editorial, expressive, colorful, premium, content-first
* * *

## 1\. Design Philosophy
RevoOS uses Adora's distinctive visual language: a precise, clean interface presented against soft impressionist color, with generous rounded containers, vivid violet actions, pastel accents, and bold typography.
The product itself should remain functional and easy to navigate. The expressive styling belongs primarily to the landing page, product showcases, empty states, and selected visual accents. The actual memory library must remain readable and practical.
### Core principles
1. **Clean interface, expressive atmosphere.** White surfaces and crisp typography sit against painterly pastel backgrounds.
2. **Memories are the hero.** Images, screenshots, documents, and webpages should be visually recognizable.
3. **Bold typography.** Large geometric headings communicate the product's value with confidence.
4. **Violet drives action.** One vivid violet is the primary conversion and interaction color.
5. **Pastels provide personality.** Sky blue, lime, and pink appear as painterly accents, not as competing interface colors.
6. **Rounded, generous surfaces.** Large cards and showcase frames create a soft gallery-like feeling.
7. **Simple interactions.** Decorative styling must never compromise navigation, search, capture, or content readability.
### Brand tagline
**Everything you save, connected and remembered.**
### Brand character
*   Creative, but not childish.
*   Expressive, but not cluttered.
*   Intelligent, but not overly technical.
*   Premium, but approachable.
*   Colorful, without looking like a rainbow productivity dashboard.
* * *

## 2\. Color Tokens
Use the Adora palette as the foundation of RevoOS's visual identity.
### Core colors

| Name | Value | Token | Role |
| ---| ---| ---| --- |
| Electric Violet | `#592EFF` | `--color-primary` | Primary buttons, active links, important actions |
| Midnight Plum | `#21164C` | `--color-heading` | Display headings and strong typography |
| Obsidian Charcoal | `#353241` | `--color-text` | Body text, icons, UI labels |
| Slate Smoke | `#5F5F69` | `--color-muted` | Secondary text, descriptions, metadata |
| Pearl Mist | `#E0E0DB` | `--color-border` | Borders, separators, input outlines |
| Soft Concrete | `#EEEEEE` | `--color-surface-muted` | Secondary surfaces and subtle fills |
| Pure White | `#FFFFFF` | `--color-white` | Main canvas, cards, navigation, dialogs |

### Pastel accents

| Name | Value | Token | Role |
| ---| ---| ---| --- |
| Sky Tint | `#BCF2FF` | `--color-sky` | Painterly backgrounds and soft blue highlights |
| Lime Spritz | `#DFFF9D` | `--color-lime` | Decorative washes and occasional accents |
| Cotton Candy | `#FFAAE6` | `--color-pink` | Decorative washes and editorial highlights |

### Bright accents

| Name | Value | Token | Role |
| ---| ---| ---| --- |
| Neon Cyan | `#2ED6FF` | `--color-cyan` | Small informational accents |
| Lime Pop | `#A2EA13` | `--color-lime-bright` | Small positive or category accents |
| Magenta Pulse | `#F843C2` | `--color-magenta` | Small feature and category accents |

### Color usage rules
*   Keep most interface surfaces white.
*   Use Electric Violet for the primary CTA and selected interactive states.
*   Use Midnight Plum for large headings instead of pure black.
*   Use Obsidian Charcoal for body text.
*   Use Slate Smoke for metadata and helper text.
*   Reserve pastel washes for showcase backgrounds, selected marketing visuals, and decorative accents.
*   Keep vivid cyan, lime, and magenta confined to small badges and illustrations.
*   Do not use pastel colors as the default background for every memory card.
*   Do not use multiple saturated filled buttons in the same visual section.
The overall visual balance should be predominantly neutral, with violet as the main action color and pastel colors as atmospheric decoration.
* * *

## 3\. Typography
### Display font: PolySans
Use PolySans for prominent marketing headlines, page titles, and section headings when the font is available and properly licensed.
**Fallback:** General Sans, then Space Grotesk.
Characteristics:
*   Geometric.
*   Bold and confident.
*   Tight letter spacing.
*   Strong visual hierarchy.
### Body and interface font: Plus Jakarta Sans
Use Plus Jakarta Sans for body copy, navigation, controls, buttons, metadata, and supporting text.
**Fallback:** Inter.
### Font tokens

```css
--font-display: "PolySans", "General Sans", "Space Grotesk", sans-serif;
--font-sans: "Plus Jakarta Sans", "Inter", sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
```

Do not add a new font dependency if the project already has a suitable font configured. Use an available fallback until the intended font is installed.
### Type scale

| Role | Size | Weight | Line height |
| ---| ---| ---| --- |
| Marketing display | 68px | 700 | 1.10 |
| Marketing heading | 58px | 700 | 1.10 |
| Page heading | 38px | 700 | 1.10 |
| Section heading | 32px | 700 | 1.10 |
| Card heading | 20–28px | 600–700 | 1.20 |
| Body | 18px | 400 | 1.60 |
| UI body | 16px | 400–500 | 1.50–1.60 |
| Small text | 14px | 400–500 | 1.50 |
| Metadata | 12px | 400–500 | 1.40 |

### Typography rules
*   Use approximately `-0.02em` letter spacing for display headings.
*   Use tight line height for large headings.
*   Keep paragraph line height comfortable.
*   Use sentence case for most UI labels.
*   Use bold, oversized typography on the landing page.
*   Use more restrained sizes in the actual application to preserve content density.
*   Do not use gradient-filled text.
* * *

## 4\. Spacing and Layout
**Base unit:** 4px
**Density:** Comfortable
**Marketing max-width:** 1200px
### Spacing scale

| Token | Value |
| ---| --- |
| `--spacing-4` | 4px |
| `--spacing-8` | 8px |
| `--spacing-12` | 12px |
| `--spacing-16` | 16px |
| `--spacing-20` | 20px |
| `--spacing-24` | 24px |
| `--spacing-32` | 32px |
| `--spacing-40` | 40px |
| `--spacing-48` | 48px |
| `--spacing-60` | 60px |
| `--spacing-80` | 80px |
| `--spacing-100` | 100px |

### Layout rules
*   Center marketing content in a maximum 1200px column.
*   Use generous vertical separation of approximately 80px between major marketing sections.
*   Give marketing feature cards around 32px of internal padding.
*   Use 24–32px page padding in desktop application layouts.
*   Keep the browser extension compact.
*   Preserve enough density in the application to make a large memory library practical.
*   On mobile, reduce padding and headline sizes without losing the visual identity.
* * *

## 5\. Border Radius
Large, confident rounding is a defining characteristic of the reference.

| Element | Radius |
| ---| --- |
| Buttons | 8–12px |
| Inputs | 12px |
| Small controls | 8px |
| Badges | 200px / pill |
| Memory cards | 24–32px |
| Marketing feature cards | 32–40px |
| Floating navigation | 40px |
| Product showcase frame | 48–64px |
| Dialogs and large overlays | 24–32px |

Use the largest radii for marketing showcase frames and prominent content containers. In the operational memory library, use moderately rounded cards so users can browse many items efficiently.
* * *

## 6\. Navigation
### Marketing navigation: Floating pill
The landing page uses a floating white navigation pill, not a full-width header bar.
Appearance:
*   White background.
*   1px Pearl Mist border.
*   40px border radius.
*   Approximately 56–64px tall.
*   Horizontal padding around 20px.
*   Centered within the page.
*   Subtle shadow only if needed for separation.
*   RevoOS logo on the left.
*   Navigation links in the middle.
*   Primary CTA on the right.
Suggested links:
*   Product
*   Features
*   How it works
*   Pricing, when applicable
*   Sign in
*   Try RevoOS
The primary CTA uses Electric Violet with white text.
### Application navigation
The signed-in application should use a functional sidebar or compact workspace navigation rather than the marketing navigation pill.
Primary destinations:
1. Home
2. Library
3. Collections
4. Graph
5. Shared — when collaboration is available
Settings and account controls belong near the bottom of the sidebar or inside the account menu.
Do not add Tags as a separate primary navigation destination. Tags should be managed within the library, memory details, and collection workflows.
* * *

## 7\. Primary Action Button
**Purpose:** Highest-priority action in a section.
Appearance:
*   Background: `#592EFF`
*   Text: `#FFFFFF`
*   Font: Plus Jakarta Sans, 16px, weight 500
*   Padding: approximately 10px 20px
*   Radius: 8px
*   No prominent border
Interaction:
*   Slightly darker violet on hover.
*   Clear pressed state.
*   Visible keyboard focus.
*   No large glow or dramatic scaling animation.
Use one dominant filled CTA per major visual area wherever practical.
Examples:
*   Try RevoOS
*   Save to RevoOS
*   Create collection
*   Upload files
* * *

## 8\. Secondary and Ghost Buttons
### Secondary button
*   White background.
*   1px Pearl Mist border.
*   Obsidian Charcoal text.
*   8px radius.
*   10px 20px padding.
### Ghost button
*   Transparent background.
*   No permanent heavy border.
*   Obsidian Charcoal text.
*   Optional thin-stroke icon.
*   Subtle neutral hover surface.
Use secondary and ghost buttons for actions that should not compete with the main CTA.
* * *

## 9\. Feature Cards
Feature cards use Adora's generous rounded geometry and white surfaces.
### Appearance
*   White background.
*   1px Pearl Mist border.
*   32–40px radius.
*   28–32px padding.
*   No heavy shadow.
*   Optional product screenshot or relevant memory preview.
*   Heading in Midnight Plum.
*   Body text in Obsidian Charcoal.
*   Optional understated text link.
### RevoOS feature-card examples
**Capture everything**
Show a browser page, saved screenshot, or uploaded document inside a rounded preview frame.
**Ask your memories**
Show an AI query with a concise answer and the saved memories that support it.
**See the connections**
Show a small, meaningful relationship graph connecting a few memory cards.
**Build a shared knowledge space**
When collaboration becomes available, show shared items and member indicators.
Do not invent screenshots of features that are not implemented. Use clearly labeled prototypes for future functionality.
* * *

## 10\. Product Showcase Frame
The product showcase is one of the most important expressions of the Adora visual style.
### Structure
*   Large atmospheric background using pastel sky blue, lime, and pink.
*   A central white product frame.
*   Frame radius around 48–64px.
*   A real RevoOS interface screenshot inside the frame.
*   Minimal surrounding decoration.
*   No lifestyle photography or unnecessary 3D elements.
### Background treatment
Use softly blended color areas with large blurred shapes or an appropriately subtle painterly background asset.
Suggested colors:
*   Sky: `#BCF2FF`
*   Lime: `#DFFF9D`
*   Pink: `#FFAAE6`
The colors should blend gently. Avoid sharp gradient bands, neon glows, and excessive saturation.
The background must remain behind the product frame and must not reduce screenshot readability.
### Screenshot rules
*   Use real product UI whenever possible.
*   Show the AI search field, memory cards, and meaningful content.
*   Keep screenshots crisp.
*   Do not distort the product interface to fit decorative compositions.
*   Use a neutral fallback frame while the real screenshot is unavailable.
* * *

## 11\. Squiggle Underline
The hand-drawn squiggle underline is a distinctive marketing accent.
### Appearance
*   SVG stroke with a hand-drawn wave.
*   Approximately 2–3px thick.
*   Extend slightly beyond the highlighted word.
*   Use pink, sky blue, or lime.
*   Place beneath the baseline without obstructing text.
### Rules
*   Use under one or two words in a prominent marketing headline.
*   Never apply to ordinary paragraph text, navigation, or button labels.
*   Do not use in every heading.
*   Keep the underline legible at responsive sizes.
*   Use accessible text that does not rely on the underline to convey meaning.
Example headline:
"Your saved memories, finally **connected**."
The word "connected" may receive a pink squiggle underline.
* * *

## 12\. Tag Badges and Memory Metadata
RevoOS uses many content types, topics, and tags. The Adora badge style should be adapted carefully to avoid turning the library into a colorful collection of pills.
### Marketing badges
*   Pill-shaped.
*   1px pastel or bright-accent border.
*   Transparent or very light fill.
*   14px Plus Jakarta Sans, weight 500.
### Application badges
Use subdued styling by default.
*   Neutral backgrounds for file types.
*   Soft semantic colors for processing status.
*   Occasional accent borders for meaningful tags.
*   Limit the number of visible tags per memory card.
*   Truncate or collapse additional tags when necessary.
Suggested content-type accents:
*   Links: sky blue.
*   Notes: lime.
*   Documents: lavender.
*   Images: pink.
*   Screenshots: cyan.
These are semantic accents, not mandatory full-card background colors. Maintain sufficient text contrast and avoid assigning arbitrary colors to every individual tag.
* * *

## 13\. Logo Lockup
The RevoOS logo should remain simple and recognizable.
### Appearance
*   RevoOS wordmark.
*   Small abstract memory or connection symbol.
*   Electric Violet as the primary icon accent.
*   Midnight Plum for the wordmark.
*   Plus Jakarta Sans or the existing brand display font for the wordmark.
### Rules
*   Use the existing official logo asset if available.
*   Do not replace the official mark with an unrelated decorative swirl.
*   Keep the logo consistent across the landing page, web app, extension, and future mobile apps.
*   Use a white or transparent background where practical.
*   Provide an appropriate monochrome variant when required.
* * *

## 14\. Input Fields and AI Search
### Standard input
*   White background.
*   1px Pearl Mist border.
*   12px radius.
*   12–16px padding.
*   Placeholder in Slate Smoke.
*   Violet focus border.
*   No strong glow.
### AI search field
The AI search field is a central RevoOS component.
Appearance:
*   Large white surface.
*   Subtle Pearl Mist border.
*   16–24px radius depending on the context.
*   Search icon and optional restrained AI indicator.
*   Comfortable text entry area.
*   Violet submit button or clear submit affordance.
*   Optional example queries beneath it.
The search field may sit within a subtle pastel showcase background on the marketing page. In the application, prioritize readability and fast access.
Example placeholder:
"Ask anything about what you've saved..."
### Search answer presentation
*   Display the answer clearly.
*   Show source memory cards below or alongside the answer.
*   Make sources clickable.
*   Distinguish generated summaries from original content.
*   Use restrained violet accents for citations and selected source states.
*   Show a useful empty state when evidence is insufficient.
* * *

## 15\. Memory Cards and Library
The memory library is the functional center of RevoOS. It should borrow Adora's rounded cards and content-led presentation without inheriting unnecessary marketing decoration.
### Grid view
*   White cards with thin Pearl Mist borders.
*   Rounded corners around 24–32px.
*   Image-led previews for visual content.
*   Clear title and optional excerpt.
*   Compact source and date metadata.
*   Tags shown only when useful.
*   Subtle hover treatment.
### List view
*   More compact rows.
*   Clear title, type, source, and date.
*   Subtle separators.
*   Hover-revealed secondary actions.
*   No oversized decorative elements.
### Memory detail
Use a clean white content panel with a large radius and generous spacing.
Organize content into:
1. Original content or preview.
2. Title and source.
3. User notes and context.
4. AI summary and extracted text.
5. Tags and collections.
6. Related memories and backlinks.
7. Actions.
The visual style must never obscure the original content or the source of AI-generated information.
* * *

## 16\. Collections and Graph
### Collections
Collections may use:
*   White rounded cards.
*   A representative thumbnail or small collage.
*   Midnight Plum titles.
*   Compact item counts.
*   Subtle pastel accents on selected collections.
*   Minimal action menus.
Avoid a separate large color block for every collection.
### Knowledge graph
The graph should be visually light and readable.
*   Neutral nodes by default.
*   Meaningful memory previews when practical.
*   Low-contrast connection lines.
*   Electric Violet for selected nodes and important relationships.
*   Pastel colors only for useful categories or selected clusters.
*   Clear hover, selection, and focus states.
Do not apply the painterly marketing background behind dense graph content. The graph must remain navigable and understandable.
* * *

## 17\. Empty States and Illustrations
Empty states may use more expressive styling than regular application screens.
Examples:
*   An empty library can feature a small collection of abstract memory cards.
*   An empty collection can use a soft sky-blue or pink wash.
*   An empty graph can show a few illustrative connected nodes.
*   A successful capture can use a restrained violet confirmation mark.
Keep illustrations simple, minimal, and consistent. Use painterly pastels as supporting decoration, not as a substitute for useful instructions.
Every empty state must explain what the user can do next.
* * *

## 18\. Elevation Philosophy
Follow Adora's restrained approach to depth.
Use three primary techniques:
1. Thin borders to distinguish white surfaces.
2. Large corner radii to create softness.
3. White-on-white layering for menus, navigation, and overlays.
Shadows should be subtle and infrequent. Use them only where a floating element needs separation from the page.
Never use heavy multi-layer shadow stacks, neon glows, or large shadows on every memory card.
* * *

## 19\. Motion and Interaction
*   Use short hover transitions.
*   Keep buttons responsive.
*   Use gentle menu and dialog transitions.
*   Use restrained animation for successful capture and upload progress.
*   Avoid constant animated painterly backgrounds.
*   Avoid dramatic card scaling.
*   Respect reduced-motion preferences.
*   Never delay saving, searching, or navigation to finish an animation.
Motion should reinforce the polished, expressive visual language without slowing down everyday work.
* * *

## 20\. Responsive Behavior
### Desktop
*   Floating navigation pill on the marketing site.
*   Large centered hero and product showcase.
*   Spacious feature cards.
*   Persistent application sidebar.
*   Multi-column memory grid.
### Tablet
*   More compact floating navigation.
*   Reduced headline sizes and showcase padding.
*   Two-column card grids where appropriate.
*   Collapsible application sidebar.
### Mobile
*   Compact navigation with a menu.
*   Responsive hero typography.
*   Stacked CTA buttons when needed.
*   Product showcase with reduced frame radius and padding.
*   Single-column or appropriately sized memory cards.
*   Compact extension-inspired capture actions in mobile applications.
*   No horizontal overflow.
Keep the pastel atmosphere and typography recognizable at all sizes.
* * *

## 21\. Do's and Don'ts
### Do
*   Follow Adora's white surfaces and violet action color.
*   Use pastel painterly backgrounds behind selected product showcases.
*   Use large rounded frames for hero screenshots.
*   Use bold display typography and selective squiggle underlines.
*   Keep feature cards generous and image-led.
*   Use thin borders and subtle elevation.
*   Keep the actual memory library functional and readable.
*   Use the same design language across RevoOS surfaces.
*   Use real product screenshots when available.
### Don't
*   Replace the Adora visual language with a generic minimal dashboard.
*   Use large painterly backgrounds behind every application screen.
*   Use pastel fills for every memory card.
*   Use multiple saturated primary buttons in the same section.
*   Add decorative squiggles to ordinary application headings.
*   Overload cards with colorful badges.
*   use oversized marketing typography for normal app controls.
*   Add Tags as a primary navigation item.
*   Present planned features as working functionality.
*   Invent a new logo when the official asset exists.
* * *

## 22\. CSS Custom Properties
Use these tokens as the starting point for `src/app/globals.css`. Merge them into the existing Tailwind CSS v4 and component theme rather than creating duplicate token definitions.

```css
:root {
  /* Core colors */
  --color-primary: #592eff;
  --color-heading: #21164c;
  --color-text: #353241;
  --color-muted: #5f5f69;
  --color-border: #e0e0db;
  --color-surface-muted: #eeeeee;
  --color-white: #ffffff;

  /* Pastel accents */
  --color-sky: #bcf2ff;
  --color-lime: #dfff9d;
  --color-pink: #ffaae6;

  /* Small bright accents */
  --color-cyan: #2ed6ff;
  --color-lime-bright: #a2ea13;
  --color-magenta: #f843c2;

  /* Typography */
  --font-display: "PolySans", "General Sans", "Space Grotesk", sans-serif;
  --font-sans: "Plus Jakarta Sans", "Inter", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-60: 60px;
  --spacing-80: 80px;
  --spacing-100: 100px;

  /* Radius */
  --radius-button: 8px;
  --radius-input: 12px;
  --radius-card: 32px;
  --radius-feature-card: 40px;
  --radius-nav-pill: 40px;
  --radius-showcase: 64px;
  --radius-badge: 200px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 32px;
  --element-gap: 12px;

  /* Gradients */
  --gradient-aurora: linear-gradient(
    120deg,
    #bcf2ff 0%,
    #dfff9d 50%,
    #ffaae6 100%
  );

  /* Motion */
  --duration-fast: 120ms;
  --duration-normal: 180ms;
  --duration-slow: 240ms;
}
```

### Tailwind CSS v4 integration
*   Map the palette and typography into the existing `@theme inline` block.
*   Preserve existing shadcn/UI tokens and component compatibility.
*   Do not duplicate existing CSS variables.
*   Use the current font-loading setup where possible.
*   Use actual font assets or configured fallbacks instead of assuming PolySans or General Sans is installed.
*   Keep the palette consistent across marketing pages, application screens, and the browser extension.
* * *

## 23\. Instructions for OpenCode
When implementing this design system:
1. Read [`AGENTS.md`](http://AGENTS.md), `PRODUCT_REQUIREMENTS.md`, and this file before changing the UI.
2. Use Adora as the visual reference for colors, typography, navigation, rounding, pastel backgrounds, and showcase layouts.
3. Do not reinterpret the design as a generic Apple/Notion interface.
4. Preserve the RevoOS product structure and behavior.
5. Prioritize the floating marketing navigation, expressive hero, product showcase, rounded feature cards, and violet CTA.
6. Apply the same design language to the application with appropriate reductions in decoration and typography size.
7. Keep memory content legible and visually recognizable.
8. Do not add Tags to the primary navigation.
9. Do not create fake working states for future features.
10. Inspect existing styles before editing them.
11. Reuse components and tokens wherever practical.
12. Run the project's type checks, linting, and tests after implementation.
### Definition of done
The landing page should unmistakably reflect Adora's visual language, while the RevoOS application should feel like the same brand adapted for everyday memory capture, search, organization, and discovery.
**Final principle:** Expressive outside, practical inside — Adora's visual identity, shaped around RevoOS.