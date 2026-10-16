# RevoOS — Design System & UI Guidelines

> **Product:** RevoOS  
> **Tagline:** Save anything. Find everything.  
> **Category:** The AI memory layer for your digital life  
> **Design philosophy:** Minimal, functional, content-first.

This document defines the visual language, component behavior, layout principles, and UX standards for redesigning the RevoOS application.

OpenCode must treat this document as the source of truth for UI and UX decisions throughout the project.

The goal is to create a polished, minimalist knowledge workspace inspired by the usability of MyMind, Fabric, Recall, and Capacities, without copying their branding or interfaces.

---

## 1. Design Principles

### 1.1 Minimalism over decoration

The interface should feel calm, clean, and purposeful.

- Prefer solid backgrounds over gradients.
- Use borders and spacing to define sections.
- Use color sparingly and intentionally.
- Avoid unnecessary decorative elements.
- Avoid excessive shadows, glowing effects, blur, and glassmorphism.
- Do not add visual elements that do not improve usability or understanding.

Every element should serve a functional purpose.

### 1.2 Content comes first

Saved memories are the most important part of the interface.

Screenshots, images, documents, links, notes, and other saved items should be visually prominent. Application chrome, navigation, and metadata should remain secondary.

Do not make the application look like an analytics dashboard or a generic SaaS admin panel.

### 1.3 Functional, not sterile

Minimalism should not make the product feel empty or lifeless.

Use clear typography, subtle surface differentiation, meaningful icons, carefully designed empty states, and small interaction details to create a polished experience.

Avoid excessive whitespace that reduces the amount of useful content visible on screen.

### 1.4 Consistency

Use shared design tokens and reusable components.

Buttons, inputs, cards, dialogs, navigation items, menus, badges, and metadata must behave and look consistent throughout the application.

Do not create different styling rules for the same component on different pages without a clear reason.

---

## 2. Visual Direction

### Overall aesthetic

- Minimalist.
- Modern.
- Neutral.
- Content-focused.
- Quietly premium.
- Practical and approachable.
- Dense enough to be useful, with enough spacing to remain readable.

The application should feel like a personal workspace for information rather than a marketing landing page.

### Avoid

- Large gradient backgrounds.
- Gradient text.
- Rainbow accents.
- Glowing purple or blue surfaces.
- Glass cards.
- Excessive rounded containers.
- Cards nested inside other cards.
- Oversized headings throughout the app.
- Large empty hero sections inside authenticated screens.
- Decorative charts and meaningless statistics.
- Excessive badges and colored labels.
- Animations that delay common tasks.

**Gradient policy:** Do not use gradients by default. Use solid colors for page backgrounds, cards, buttons, navigation, and inputs. Gradients are permitted only when there is a specific, meaningful design reason, and should never dominate the interface.

---

## 3. Color System

Use a neutral, light-first palette with one restrained primary accent.

### Light theme

| Token | Color | Purpose |
|---|---|---|
| `background` | `#FAFAFA` | Main application background |
| `surface` | `#FFFFFF` | Cards, panels, dialogs |
| `surface-secondary` | `#F4F4F5` | Subtle secondary surfaces |
| `foreground` | `#18181B` | Primary text |
| `muted-foreground` | `#71717A` | Secondary text and metadata |
| `border` | `#E4E4E7` | Dividers and component outlines |
| `primary` | `#6558C8` | Primary actions and selected states |
| `primary-foreground` | `#FFFFFF` | Text on primary surfaces |
| `success` | `#15803D` | Successful states |
| `warning` | `#A16207` | Warnings |
| `destructive` | `#B91C1C` | Destructive actions |
| `focus-ring` | `#8175DE` | Keyboard focus indicators |

The primary accent should be used selectively for important actions, active navigation, selected states, links, and focused controls.

Do not color every icon, label, or card with the primary accent.

### Color usage rules

- Main backgrounds should be white or near-white.
- Cards should normally use white surfaces with subtle borders.
- Secondary surfaces should use light neutral gray.
- Body text should have strong contrast.
- Muted text must remain readable.
- Status colors should be reserved for actual status information.
- Tags should use neutral styling by default.
- If tags have colors, use a restrained, consistent palette.
- Do not use color as the only indicator of state.

### Dark theme

If dark mode is already supported or is part of the redesign, define a separate set of semantic tokens for it.

Do not mechanically invert the light theme. Maintain readable contrast, subtle borders, and restrained accent usage.

---

## 4. Typography

Use typography to establish hierarchy rather than relying on color, large containers, or decorative styling.

### Font family

- **Primary:** Inter.
- **Fallback:** A clean system sans-serif stack.
- Reuse the existing font setup if it is already configured and working.

Do not add extra font families unless they materially improve the product.

### Type scale

| Element | Recommended size |
|---|---:|
| Page title | 24–28px |
| Section title | 16–20px |
| Card title | 14–16px |
| Body text | 14–15px |
| Secondary text | 13–14px |
| Metadata | 12–13px |
| Small labels | 12px |

Use medium or semibold weights for headings and important labels. Avoid using bold weights for everything.

Keep line heights comfortable and ensure that long titles and content previews wrap gracefully.

---

## 5. Layout and Spacing

Use a consistent 4px spacing scale.

Common spacing values:

- 4px: compact internal spacing.
- 8px: closely related elements.
- 12px: card content and control groups.
- 16px: standard component spacing.
- 24px: section spacing.
- 32px: major layout separation.

Avoid excessive padding that causes users to see very little content at once.

### Application shell

Desktop layout:

- Persistent sidebar: approximately 220–240px.
- Main content area: flexible width.
- Main content padding: approximately 24–32px.
- Consistent page headers.
- Optional contextual panels where useful.

The sidebar should feel compact and functional, not oversized.

### Responsive behavior

**Desktop**
- Persistent sidebar.
- Multi-column memory grid.
- Optional contextual detail panels.
- Efficient use of horizontal space.

**Tablet**
- Collapsible sidebar.
- Fewer grid columns.
- Reduced horizontal padding.

**Mobile**
- Compact header.
- Bottom navigation for primary destinations.
- One-column detail views.
- Touch-friendly menus and actions.
- Full-width capture dialogs or sheets.

Never allow horizontal overflow in normal application views.

---

## 6. Navigation

The primary navigation must contain:

1. Home.
2. Library.
3. Collections.
4. Connections.
5. Timeline.

Settings should be accessible separately, outside the primary navigation group.

Provide a global Quick Capture action and global search.

### Important rule: no Tags destination

**Do not create a dedicated Tags item in the primary navigation or mobile bottom navigation.**

Tags are organizational metadata, not a top-level destination.

Tag functionality should be available contextually in:

- Library filters.
- Memory detail pages.
- Memory editing interfaces.
- Collection workflows.
- Relevant search and filtering controls.

Users must still be able to create, edit, assign, remove, and filter tags.

### Navigation styling

- Use simple monochrome line icons.
- Keep icon sizes consistent.
- Use neutral text for inactive items.
- Use a subtle neutral background or restrained accent for the active item.
- Avoid gradients and oversized active-state indicators.
- Provide clear hover, focus, and selected states.

---

## 7. Memory Library

The Library is one of the most important screens in RevoOS.

It should feel like a well-organized visual collection of saved information.

### Layout

Include:

- Page title.
- Global or contextual search.
- Quick Capture action.
- Filter controls.
- Grid/list view toggle.
- Sort controls.
- Memory grid or list.

Keep controls compact and aligned.

### Memory cards

Cards should prioritize content rather than decoration.

Each card may contain:

- Image or document preview.
- Title.
- Content type.
- Short summary or excerpt.
- Relevant tags.
- Capture date or useful metadata.
- Contextual actions.

Not every piece of metadata needs to appear on every card. Show only what helps users scan and understand the content.

### Card styling

- White or neutral surface.
- Thin border.
- Approximately 10–14px corner radius.
- No gradient backgrounds.
- No strong drop shadows by default.
- Subtle hover border or surface change.
- Consistent internal padding.

Avoid making every card a large, colorful container.

### Interactions

- Clicking the card opens its detail view.
- Hover actions should remain subtle and accessible.
- Mobile actions must not depend on hover.
- Selection controls should be separate from the card's primary click target.
- Multi-selection should expose relevant bulk actions.

Support both grid and list views. Use masonry only when it improves browsing of genuinely variable-height content.

---

## 8. Memory Detail

The memory detail screen should make the saved content the primary focus.

### Main content area

Display:

- Title.
- Original content or preview.
- Extracted text when available.
- AI-generated summary.
- User-authored notes or context.
- Source information.
- Relevant timestamps.

### Contextual information

Display:

- Type.
- Tags.
- Collections.
- Outgoing links.
- Backlinks.
- Related memories.
- AI-suggested connections, when available.

Use a clear hierarchy with compact sections and subtle dividers.

Do not put every section into a separate heavily bordered card. Prefer simple section headings, spacing, and dividers.

Keep original content, user-authored notes, and AI-generated information clearly distinguishable.

---

## 9. Tags and Collections

Tags should help users organize and retrieve memories without creating visual clutter.

### Tags

- Use compact chips.
- Prefer neutral backgrounds.
- Use subtle borders when needed.
- Avoid bright rainbow-colored chips.
- Avoid excessive pill padding.
- Allow multiple tags without overwhelming the layout.
- Make tag editing discoverable but unobtrusive.

Tags must remain accessible through contextual controls and filters, not a separate primary navigation destination.

### Collections

Collections can have a slightly stronger visual presence than tags because they represent meaningful groups of content.

Use simple collection cards with:

- Title.
- Optional description.
- Memory count when accurate.
- Optional cover image or representative preview.

Avoid decorative gradients or artificial cover designs by default.

---

## 10. AI Summaries and AI Recall

AI should feel integrated into the workspace, not like a separate flashy chatbot product.

### AI summaries

Display summaries using ordinary typography and subtle section labels.

- Label generated content as an AI summary.
- Preserve access to the original content.
- Show processing states when summaries are being generated.
- Handle unavailable or failed summaries gracefully.
- Do not use gradient text or glowing borders to distinguish AI content.

### AI recall

Use a clean search input with a clear placeholder and concise supporting examples where helpful.

AI answers should:

- Use readable paragraphs and lists.
- Include clickable citations to real saved memories.
- Distinguish evidence from inference.
- Explain when the available information is insufficient.

Citations should look like simple links or compact source previews, not decorative badges.

---

## 11. Bi-directional Links

Links and backlinks should be presented as useful content relationships.

Include clear sections for:

- Linked memories.
- Backlinks.
- Related content.
- AI-suggested connections.

Use compact rows or small memory previews.

Do not create a visually elaborate card for every relationship.

Explicit links must automatically produce backlinks. AI-suggested connections must remain distinguishable from user-created links.

---

## 12. Knowledge Graph

The graph should be functional, readable, and visually restrained.

### Appearance

- Neutral canvas.
- Thin, subtle connecting lines.
- Small, clearly identifiable nodes.
- Limited, meaningful color.
- No glowing nodes by default.
- No gradient backgrounds.
- No excessive animation.
- Clear hover, selected, and focused states.

### Behavior

- Clicking a node opens the relevant memory or preview.
- Selected nodes should be easy to identify.
- Users can zoom and pan.
- Filters should allow users to focus on relevant content.
- Relationship types should be distinguishable without relying only on color.
- Large graphs should remain responsive.

The graph must reflect actual stored relationships. Do not add arbitrary edges for visual effect.

Prefer clarity and navigation usefulness over visual spectacle.

---

## 13. Inputs, Buttons, and Controls

### Buttons

Use three main visual levels:

- **Primary:** Solid primary color for the main action.
- **Secondary:** Neutral surface with a subtle border.
- **Ghost:** Minimal styling for secondary actions and icon controls.

Use consistent button heights, padding, and icon alignment.

Avoid gradients, oversized pills, and unnecessary shadows.

### Inputs

- Neutral background.
- Subtle border.
- Clear label or placeholder.
- Visible focus ring.
- Consistent height.
- Readable error messages.

Search fields should be visually prominent enough to find but should not dominate every screen.

### Menus and dialogs

- Clear titles.
- Compact spacing.
- Straightforward actions.
- Proper focus management.
- Escape-to-close behavior where appropriate.
- Confirmation for destructive actions.
- Responsive mobile sheets when suitable.

---

## 14. Icons and Imagery

Use one consistent icon library, preferably the existing Lucide-based setup.

Icons should be:

- Simple line icons.
- Consistent in size and stroke.
- Mostly neutral in color.
- Used to clarify actions or content types.

Do not use emoji as primary interface icons.

Images should come from actual saved content, supported previews, or intentional empty-state illustrations.

Do not add decorative illustrations to every page.

Use appropriate fallbacks when previews are missing or unavailable.

---

## 15. Motion and Interaction

Motion should provide feedback rather than decoration.

Recommended duration:

- Hover and focus transitions: 100–160ms.
- Dialog and menu transitions: 150–200ms.
- More complex transitions: no longer than necessary.

Prefer subtle changes in opacity, border, or background.

Avoid:

- Large animated gradients.
- Constantly moving backgrounds.
- Bouncy animations.
- Long entrance animations.
- Animations that delay access to content.

Respect reduced-motion preferences.

---

## 16. Loading, Empty, and Error States

Design these states as part of the interface rather than adding them as an afterthought.

### Loading

Use subtle skeletons that resemble the final content layout.

### Empty

Explain what the screen is for and provide a relevant next action.

### Errors

Use concise, understandable messages with retry options when appropriate.

### Processing

Show clear progress or status for extraction, uploads, and AI summaries.

Never display fake progress or claim an operation succeeded before it actually does.

---

## 17. Technical Design Requirements

Before making changes, inspect the existing application and identify reusable components, existing design tokens, working functionality, and technical constraints.

- Preserve the existing Next.js and TypeScript architecture where practical.
- Use the existing Tailwind CSS v4 setup correctly.
- Reuse the existing component library when suitable.
- Prefer semantic CSS variables for theme colors.
- Avoid duplicate component systems.
- Avoid unnecessary dependencies.
- Keep components small and reusable.
- Separate UI from data access and business logic.
- Preserve existing working functionality.
- Ensure all visible controls have meaningful behavior.
- Test responsive layouts and keyboard interactions.

Do not rewrite the project simply to match a preferred architecture if the existing architecture already works.

---

## 18. Final Quality Checklist

Before considering the redesign complete, verify the following:

- [ ] The interface is minimal, functional, and content-first.
- [ ] Gradients are absent from ordinary UI surfaces.
- [ ] Colors are restrained and consistently applied.
- [ ] Typography and spacing are consistent.
- [ ] Navigation contains Home, Library, Collections, Connections, and Timeline.
- [ ] Tags are not a primary navigation destination.
- [ ] Tags remain manageable through contextual interfaces.
- [ ] Memory cards prioritize saved content.
- [ ] Memory detail distinguishes original content from AI-generated information.
- [ ] AI summaries and recall have clear loading and error states.
- [ ] Bi-directional links and backlinks are easy to understand.
- [ ] The graph displays real relationships.
- [ ] Desktop, tablet, and mobile layouts work correctly.
- [ ] Keyboard focus and touch interactions are accessible.
- [ ] Existing useful functionality has been preserved.
- [ ] No visible control is knowingly nonfunctional.
- [ ] Relevant lint, type-check, tests, and production build have been run.

## Final instruction

When making design decisions, always prioritize:

1. Clarity.
2. Content readability.
3. Ease of use.
4. Consistency.
5. Performance.
6. Visual polish.

**The desired result is a quiet, refined, minimalist workspace where the user's saved information is the visual focus. Use solid colors, subtle borders, thoughtful spacing, and restrained accents. Do not rely on gradients, glows, or decorative effects to make the application look premium.**
