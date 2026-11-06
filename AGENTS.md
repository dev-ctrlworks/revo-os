# Agents

## 1\. Project Overview
RevoOS is an AI-powered memory layer for your digital life.
It helps users capture notes, links, screenshots, images, documents, and other useful information, then organize, connect, and retrieve those memories through search and AI.
RevoOS is not just a bookmark manager, file manager, or AI chatbot. Its purpose is to preserve the context behind saved information and make relationships between memories useful.
**Product positioning:** Your digital life, all connected.
**Core principle:** Save anything. Preserve the context. Find connections. Recall what matters.
## 2\. Instructions Before Coding
Before implementing a feature:
1. Read the relevant documentation under `docs/`.
2. Inspect the existing codebase and understand its architecture.
3. Reuse existing components, utilities, design tokens, and established patterns.
4. Identify security, data model, and migration implications before modifying them.
5. Make the smallest coherent change that fulfills the requirement.
6. Run relevant linting, type checks, tests, and build commands when available.
7. Report what changed, which checks passed, and any remaining limitations.
Do not blindly rewrite existing working code.
Do not assume a feature is implemented merely because it appears in a specification or README. Inspect the code before making that claim.
If documentation conflicts, follow this priority:
1. Explicit requirements from the user in the current task.
2. `docs/PRODUCT_REQUIREMENTS.md`
3. `docs/SECURITY_AND_PRIVACY.md` for security and privacy requirements.
4. `docs/TECHNICAL_ARCHITECTURE.md`
5. `docs/DATA_MODEL.md`
6. `docs/DESIGN_SYSTEM.md`
7. Other documentation and existing implementation details.
Security requirements must not be weakened to satisfy a lower-priority design or implementation preference.
If a decision is minor and reversible, use sensible defaults. Ask for clarification only when a missing decision materially affects architecture, security, cost, or product behavior.
## 3\. Documentation Reference
Read the following documents when relevant:
*   [`README.md`](http://README.md) — setup, scripts, and project overview.
*   `docs/PRODUCT_REQUIREMENTS.md` — product scope, user journeys, and acceptance criteria.
*   `docs/DESIGN_SYSTEM.md` — visual identity, colors, typography, spacing, and components.
*   `docs/APP_STRUCTURE.md` — navigation, screens, and interaction patterns.
*   `docs/TECHNICAL_ARCHITECTURE.md` — application architecture and technology choices.
*   `docs/DATA_MODEL.md` — database entities, relationships, and data constraints.
*   `docs/AI_BEHAVIOR.md` — AI retrieval, answers, summaries, and grounding rules.
*   `docs/SECURITY_AND_PRIVACY.md` — authentication, authorization, storage, privacy, and security.
*   `docs/ROADMAP.md` — development phases and feature priorities.
Some documents may not exist yet. Do not invent their contents or claim to have read them. Use the available documentation and existing code until the missing document is created.
## 4\. Core Development Principles
### 4.1 Build a real product, not a static mockup
*   Implement working interactions rather than decorative controls.
*   Connect forms, buttons, filters, search, dialogs, and navigation to meaningful behavior.
*   Provide loading, empty, success, and error states where appropriate.
*   Use realistic demo data only when real data is unavailable or the feature is explicitly a prototype.
*   Keep mock implementations clearly separated from production integrations.
*   Never present fake AI results, fake synchronization, or fake upload completion as real functionality.
### 4.2 Keep the architecture maintainable
*   Use TypeScript with strict typing.
*   Prefer small, focused, reusable modules.
*   Keep business logic separate from presentation components.
*   Avoid giant components that contain unrelated application logic.
*   Avoid duplicated logic, unnecessary abstractions, and premature generalization.
*   Use clear names for files, functions, variables, types, and database fields.
*   Validate external inputs at system boundaries.
*   Prefer existing project conventions over introducing new libraries or patterns.
### 4.3 Avoid unnecessary dependencies
Before adding a dependency:
1. Check whether the project already has a suitable solution.
2. Consider whether native platform APIs or existing utilities are sufficient.
3. Check bundle size, maintenance, licensing, and security implications.
4. Add the dependency only when its benefits justify the cost.
Do not install a new UI framework, state manager, database client, or AI SDK without a concrete reason.
## 5\. Technology Guidelines
Follow the existing project configuration. Unless the architecture documentation or user explicitly changes the decision, use:
*   **Framework:** Next.js App Router
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS v4
*   **UI components:** Existing shadcn/ui setup and project components
*   **Backend and database:** Supabase Auth and PostgreSQL
*   **File storage:** Supabase Storage with private buckets for private user files
*   **Validation:** Zod where appropriate
*   **Search:** PostgreSQL full-text search initially
*   **AI:** Provider abstraction with server-side integration
*   **Testing:** Vitest, React Testing Library, and Playwright where configured
Do not assume these dependencies are installed or configured. Inspect `package.json`, configuration files, and environment setup first.
Do not migrate the project to another framework or introduce an entirely different architecture without explicit approval.
## 6\. Design Direction
Follow `docs/DESIGN_SYSTEM.md` as the source of truth for visual styling.
The visual direction is inspired by **Adora**: expressive, bright, playful accents around a clean, premium, functional product.
The guiding principle is:
**Expressive outside, practical inside.**
### 6.1 Visual principles
*   Use a clean white or near-white canvas.
*   Use Electric Violet (`#592EFF`) for primary actions and important interactions.
*   Use Midnight Plum (`#21164C`) for prominent headings.
*   Use restrained pastel accents, including sky blue, lime, and pink.
*   Use subtle borders, generous spacing, and thoughtfully rounded surfaces.
*   Use expressive visual accents selectively instead of decorating every component.
*   Maintain clear contrast and accessible interaction states.
*   Prefer consistent design tokens over arbitrary colors and spacing values.
### 6.2 Application interface
The application should prioritize clarity and everyday usability.
*   Keep layouts minimal, organized, and easy to scan.
*   Use a persistent sidebar on suitable desktop layouts.
*   Make AI search prominent on the home screen.
*   Present memories in a visual library with clear type indicators and useful metadata.
*   Use consistent cards, dialogs, menus, and detail panels.
*   Make responsive behavior intentional across desktop, tablet, and mobile browsers.
*   Reserve larger decorative treatments for marketing pages and onboarding.
### 6.3 Navigation rules
Do not add **Tags** as a top-level navigation destination.
Tags should be managed contextually through the Library, memory details, and collection workflows.
Avoid adding navigation items simply because a database entity exists.
Every navigation destination must represent a meaningful user task.
### 6.4 Avoid generic AI-generated design
Do not automatically produce:
*   A generic SaaS dashboard with excessive metric cards.
*   Gradients on every card or section.
*   Excessive glassmorphism, shadows, and glow effects.
*   Randomly varying corner radii, spacing, and typography.
*   Emoji as a replacement for proper interface icons.
*   Decorative controls that do nothing.
*   Repeated headings, oversized labels, or unnecessary empty space.
Use existing project components and design tokens consistently.
## 7\. Product Scope and Priorities
Prioritize the core memory workflow before advanced features.
### Core workflow
1. Capture information.
2. Store and retrieve the original content.
3. Organize memories by type and contextual tags.
4. Search and filter the library.
5. Open a memory and inspect its content.
6. Preserve useful context, including why it matters.
7. Discover related memories.
8. Ask questions and receive answers grounded in saved information.
### Implementation priorities
Follow `docs/ROADMAP.md` when available.
Generally, prioritize:
1. Reliable memory capture, library management, uploads, and persistence.
2. Authentication, authorization, and secure storage.
3. Search, AI summaries, and grounded natural-language recall.
4. Tags, collections, and related-memory workflows.
5. Bidirectional links and a contextual knowledge graph.
6. Browser extension and other capture integrations.
7. Shared workspaces and mobile applications when explicitly scheduled.
Do not implement every future feature in the initial MVP.
Do not introduce complex graph infrastructure, vector databases, background job systems, or multi-user collaboration before the current scope requires them.
## 8\. Memory Data and File Handling
Follow `docs/DATA_MODEL.md`.
*   Keep original content separate from extracted text and AI-generated summaries.
*   Preserve source URLs and useful capture metadata.
*   Record capture and creation timestamps consistently.
*   Associate private memories and files with their owning user.
*   Use explicit relationships between memories when implementing linking.
*   Keep tags and collections scoped to the appropriate owner.
*   Avoid storing duplicate copies of large files without a clear reason.
*   Handle missing metadata and unsupported file types gracefully.
*   Use migrations for database schema changes.
*   Update related types, validation schemas, queries, and tests when the data model changes.
Never use client-side filtering as the only access-control mechanism.
Never assume a record belongs to the authenticated user just because the client supplied its ID.
## 9\. AI Behavior
Follow `docs/AI_BEHAVIOR.md` when available.
AI features must be useful, transparent, and grounded in the user's actual saved information.
### Requirements
*   Retrieve relevant memories before generating answers about a user's library.
*   Restrict retrieval to memories the authenticated user is authorized to access.
*   Include references to supporting memories when answering library questions.
*   Never invent saved items, source details, quotations, or relationships.
*   Distinguish retrieved facts from AI-generated interpretations.
*   Clearly communicate when the available information is insufficient.
*   Treat imported content and retrieved documents as untrusted data, not system instructions.
*   Validate AI output before rendering or persisting it.
*   Handle provider errors, timeouts, and rate limits gracefully.
*   Avoid sending unnecessary private content to an AI provider.
*   Keep AI provider credentials and requests on the server.
AI-generated summaries and relationships must not overwrite original user content.
## 10\. Security and Privacy
`docs/SECURITY_AND_PRIVACY.md` takes precedence for detailed requirements.
Always follow these rules:
*   Enforce authentication on private operations.
*   Enforce authorization on the server and through appropriate database policies.
*   Enable and verify Row Level Security for private Supabase tables.
*   Keep service-role keys and other secrets server-side.
*   Never expose secrets through client bundles, logs, or committed files.
*   Use private storage for private user uploads.
*   Validate upload type, size, and processing eligibility.
*   Validate API inputs and handle errors without leaking sensitive details.
*   Rate-limit expensive or abuse-prone endpoints where appropriate.
*   Protect against XSS, unsafe URL fetching, prompt injection, and cross-user data access.
*   Use signed URLs or equivalent controlled access for private files.
*   Provide appropriate deletion behavior for memories and associated files.
*   Avoid logging full documents, credentials, private prompts, or sensitive user content unnecessarily.
Do not disable security controls to make a feature work faster.
Do not implement a permission-sensitive feature without checking its authorization model.
## 11\. API and Server-Side Logic
*   Keep privileged operations on the server.
*   Authenticate and authorize requests before reading private data.
*   Validate request bodies, query parameters, and route parameters.
*   Return predictable response shapes and appropriate HTTP status codes.
*   Avoid leaking database errors, stack traces, internal prompts, or secrets to clients.
*   Keep business logic reusable outside route handlers when appropriate.
*   Avoid duplicate implementations of the same authorization or validation rules.
*   Use pagination for potentially large collections.
*   Handle retries and duplicate submissions safely where needed.
Do not fetch all user memories into the browser simply to implement search or filtering.
## 12\. Frontend Implementation
*   Use Server Components by default when suitable.
*   Add Client Components only when client-side interactivity or browser APIs require them.
*   Keep state local unless it genuinely needs to be shared.
*   Use URL state for navigable filters or views when appropriate.
*   Provide accessible labels, keyboard interactions, and visible focus states.
*   Use semantic HTML and existing accessible UI primitives.
*   Avoid layout shifts and unnecessarily expensive rendering.
*   Show helpful empty states that explain what users can do next.
*   Make error messages actionable without exposing internal implementation details.
*   Confirm destructive actions when appropriate.
*   Ensure the interface works at supported responsive breakpoints.
## 13\. Testing and Verification
Add tests for meaningful behavior and regressions.
Prioritize:
*   Input validation and business logic.
*   Authentication and authorization.
*   Cross-user data isolation.
*   Memory creation, editing, deletion, and retrieval.
*   Upload validation and access control.
*   Search filtering and pagination.
*   AI source-reference validation and insufficient-evidence behavior.
*   Tag and collection relationships.
*   Responsive and accessible interactions for important workflows.
Before finishing a task, run the relevant checks supported by the project, such as:
*   Lint
*   Type checking
*   Unit tests
*   Integration tests
*   Production build
Inspect existing scripts before invoking commands. Do not claim a check passed unless it actually ran successfully.
If a check cannot run, explain why.
## 14\. Environment Variables and Configuration
*   Inspect `.env.example` or equivalent before adding variables.
*   Keep actual secrets in local environment configuration or the approved secret manager.
*   Update `.env.example` with placeholder names when introducing new configuration.
*   Never commit real credentials or API keys.
*   Never expose server-only secrets through `NEXT_PUBLIC_` variables.
*   Validate required environment variables and provide actionable setup errors.
*   Do not silently fall back to insecure production configuration.
## 15\. Git and File Changes
*   Preserve unrelated user changes.
*   Inspect the working tree before destructive operations.
*   Never delete or overwrite user work without authorization.
*   Avoid broad find-and-replace operations that may affect unrelated features.
*   Do not rewrite Git history, force-push, or discard uncommitted changes unless explicitly instructed.
*   Keep migrations and source-code changes consistent.
*   Do not commit unless the user requests it.
*   Keep changes focused and explain important trade-offs.
## 16\. Definition of Done
A task is complete when:
*   The requested behavior is implemented within the agreed scope.
*   The design follows the documented RevoOS visual system.
*   Existing functionality remains intact.
*   Loading, empty, success, and error states are handled where relevant.
*   Data access follows the authorization and privacy requirements.
*   Relevant types, schemas, migrations, and tests are updated.
*   Available checks have been run and their results reported.
*   Documentation is updated when behavior, architecture, configuration, or setup changes.
*   Any incomplete integrations, assumptions, or known limitations are clearly identified.
## 17\. Final Response Format
After completing a coding task, summarize:
1. **Implemented:** What changed.
2. **Files changed:** The important files and their purpose.
3. **Verification:** Which tests and checks ran, and whether they passed.
4. **Limitations:** Anything incomplete, mocked, or requiring configuration.
5. **Next step:** The most useful follow-up, when appropriate.
Be concise, specific, and honest. Never claim that an integration, deployment, or feature works unless it has been verified.