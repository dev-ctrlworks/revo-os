# Code Style

Conventions for contributing to Revo OS. The guiding principle is: match the
surrounding code, keep it strictly typed, and keep components small.

## Tooling

- **TypeScript** with `strict: true`, `noEmit`, `moduleResolution: bundler`,
  `isolatedModules`. Path alias `@/* -> ./src/*` (`tsconfig.json`).
- **ESLint** flat config (`eslint.config.mjs`) extending
  `eslint-config-next/core-web-vitals` and `/typescript`. Ignores `.next`,
  `out`, `build`, `.open-next`, `.wrangler`, `next-env.d.ts`.
- Run before finishing:
  ```bash
  npm run lint
  npx tsc --noEmit
  ```

> Next.js 16 note: only the App Router exists, and `middleware` is renamed to
> `proxy`. Read the bundled guides in `node_modules/next/dist/docs/` before
> using framework features — this is not the Next.js from training data.

## Comments

The project convention is **no comments unless they explain a non-obvious
"why"**. Do not narrate code with "what" comments. JSDoc is reserved for
exported helpers whose contract is subtle (e.g. `safeExternalUrl`,
`enforceRateLimit`).

## TypeScript

- Prefer `interface` for object shapes and `type` for unions/aliases
  (see `src/lib/types.ts`).
- No `any`. Narrow `unknown` at boundaries (API bodies, `localStorage`).
- Use `asString` and type predicates (e.g. `(source): source is AskSource`)
  at input edges.
- `import type { ... }` for type-only imports.
- Keep domain types centralized in `src/lib/types.ts`.

## File and naming conventions

- **Components:** `PascalCase` files when the file is a component
  (`MemoryCard.tsx` in `dashboard/`, `graph-canvas.tsx` elsewhere — both
  patterns exist; match the folder). Hooks: `use-*.ts`. Logic/helpers:
  `kebab-case.ts`.
- **Functions/variables:** `camelCase`. Constants: `SCREAMING_SNAKE_CASE`
  (`STORAGE_LIMIT_BYTES`, `MAX_BODY_BYTES`).
- **Types/interfaces:** `PascalCase`.
- **localStorage keys:** `revoos.<thing>.v1` (see `DATABASE.md`).
- `src/lib/utils.ts` re-exports `cn` from the `cn` package. Use `cn(...)`
  for conditional class composition.

## Components and React

- App Router server components by default; add `"use client"` only when a file
  needs state, effects, refs, or browser APIs.
- Class components and `React.FC` are not used. Declare props inline with an
  interface or object type parameter.
- Prefer Base UI's `render` prop for "as" polymorphism over wrapper elements:
  ```tsx
  <Button render={<Link href="/dashboard" />} nativeButton={false}>Open</Button>
  ```
- Client state:
  - Cross-component reads use `useSyncExternalStore` against plain modules
    (`useMemoryStore`, `useAskedCount`, consent). The module owns
    `subscribe` / `getSnapshot` / `getServerSnapshot`.
  - Persisted UI state uses `zustand` + `persist` (`use-dashboard-store.ts`),
    with `partialize` to persist only what should survive reloads.
- Keep heavy derivations in `src/lib` (e.g. `graph.ts`, `summarize.ts`), not
  inside components.
- Lists that can change use stable ids as keys (`memory.id`, not index).

## Server code

- Route handlers live at `src/app/api/<name>/route.ts` and export
  `GET`/`POST`. Start each mutating handler with `isAllowedOrigin` →
  `enforceRateLimit` → `readJsonBody` → validation.
- Never trust the client body: coerce with `asString`, cap lengths, and
  drop unexpected fields.
- Catch and log server errors without leaking internals; return generic
  `{ error: "Something went wrong. Please try again." }`.
- Never import server-only secrets into client components. Only
  `NEXT_PUBLIC_*` values may reach the browser.
- Defer side effects that must not block the response with `after()` from
  `next/server`.

## Styling

- Tailwind CSS v4 utility classes inline. Use the design tokens
  (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`,
  `aurora-*`) rather than raw colors (see `DESIGN_SYSTEM.md`).
- Conditional classes via `cn`, often with class-variance-authority in
  `ui/` primitives.
- Reusable brand styles live in `src/lib/brand.ts` (`gradientButtonClass`,
  `iconChipClass`).
- Global utilities/animations belong in `src/app/globals.css` under
  `@layer utilities`.

## Formatting

- Two-space indentation; double quotes; semicolons; trailing commas in
  multi-line literals.
- Formatting is not enforced by a formatter in-repo — follow the existing
  files' style.
- Prefer early returns over deep nesting.
- Ordering inside files: imports, constants, helper functions, exported
  functions/components.

## Imports

- Use the `@/` alias for intra-`src` imports.
- Group order seen in the codebase: external packages, then `@/components`,
  then `@/lib`, then relative types. Keep `import type` separate when mixing.

## Error handling

- Guard all `localStorage` / `JSON.parse` access with try/catch and return a
  safe default (`safeParse*` pattern in `memory-store.ts`).
- Wrap `fetch` to external services in try/catch with a timeout
  (`AbortSignal.timeout`) and degrade gracefully.
- Prefer returning a fallback result over throwing in user-facing paths.
