# ReadMe

# RevoOS
**Your digital life, all connected.**
RevoOS is an AI-powered memory layer for your digital life. Capture notes, links, screenshots, images, and documents in one place, preserve the context behind them, and rediscover what matters through search and AI.
Instead of leaving useful information scattered across browser tabs, folders, screenshots, and notes, RevoOS helps turn saved items into a connected, searchable personal knowledge library.
## Vision
Build a personal memory system that helps people capture anything, understand what they have saved, and connect information across their digital lives.
### What makes RevoOS different?
*   **Capture anything:** Save links, notes, screenshots, images, and documents.
*   **Preserve context:** Keep useful information about what an item contains, where it came from, and why it matters.
*   **Find things naturally:** Search your library and ask questions about saved information.
*   **Connect memories:** Discover related items through explicit links and contextual relationships.
*   **Keep knowledge organized:** Use types, contextual tags, and collections without requiring a complicated filing system.
## Product Principles
1. **Context over clutter.** Saving information should preserve more than a URL or file.
2. **Capture first.** Saving a memory should be quick and straightforward.
3. **Recall over filing.** Users should be able to find information without remembering exactly where they put it.
4. **Grounded AI.** AI answers about a user's library must be supported by retrieved memories.
5. **Private by default.** Personal memories and uploaded files must be protected by appropriate access controls.
6. **Simple on the surface.** Advanced capabilities should not make everyday use complicated.
## Current Status
RevoOS is under active development. Features described in this README represent the intended product direction, not a guarantee that every capability is currently implemented.
Keep this section updated as the project evolves.

| Area | Direction |
| ---| --- |
| Web app | Main interface for the memory library |
| Capture | Create memories from links, notes, and uploaded files |
| Organization | Types, contextual tags, and collections |
| Search | Search and filter saved memories |
| AI recall | Answers grounded in relevant saved memories |
| Connections | Related memories and a knowledge graph |
| Browser extension | Capture information directly from the browser |
| Mobile apps | Capture and access memories on the go |
| Collaboration | Shared spaces in a later phase |

Clearly distinguish working features from prototypes, mocked functionality, and planned integrations.
## Technology Stack
Follow the existing repository configuration and `docs/TECHNICAL_ARCHITECTURE.md`.

| Layer | Preferred technology |
| ---| --- |
| Web framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui and reusable project components |
| Authentication | Supabase Auth |
| Database | Supabase PostgreSQL |
| File storage | Supabase Storage |
| Validation | Zod |
| Initial search | PostgreSQL full-text search |
| AI integration | Server-side OpenAI call (provider abstraction is a future direction) |
| Browser extension | WXT, TypeScript, and React when introduced |
| Mobile | React Native and Expo in a later phase |
| Testing | Vitest, React Testing Library, and Playwright where configured |

Do not introduce a technology solely because it appears in this table. Check the installed dependencies and current implementation first.
## Getting Started
### Prerequisites
Install the following:
*   Node.js version compatible with the repository's Next.js version
*   npm
*   Git
A Supabase project and AI provider credentials are only required for features that depend on those services.
### 1\. Clone the repository

```bash
git clone https://github.com/dev-ctrlworks/revo-os.git
cd revo-os
```

### 2\. Install dependencies

```coffeescript
npm install
```

### 3\. Configure environment variables
If the repository contains an `.env.example` file, copy it:

```dpr
cp .env.example .env.local
```

On Windows PowerShell, you can use:

```rust
Copy-Item .env.example .env.local
```

Fill in the required values for the services configured in the project.
Potential environment variables include:

```cpp
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

OPENAI_API_KEY=
OPENAI_MODEL=
```

These names are examples, not a guarantee that the current implementation uses them all. Check the source code and `.env.example` for the actual requirements.
**Security notes:**
*   Never commit `.env.local` or real credentials.
*   Never expose service-role keys or other privileged secrets to the browser.
*   Server-side secrets must not use the `NEXT_PUBLIC_` prefix.
*   Do not configure an AI integration until its credentials and server-side implementation are ready.
### 4\. Start the development server

```coffeescript
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/).
### 5\. Run project checks
Inspect `package.json` for available scripts. Common commands, if configured, include:

```coffeescript
npm run lint
npx tsc --noEmit
npm run build
```

Run the project's tests using its configured test script.
If a command is not configured or requires missing environment variables, document the limitation rather than claiming the check passed.
## Project Structure
The following is the intended organization. Adapt it to the actual repository rather than creating empty folders unnecessarily.

```java
revo-os/
├── AGENTS.md
├── README.md
├── package.json
├── public/
├── docs/
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── DESIGN_SYSTEM.md
│   ├── APP_STRUCTURE.md
│   ├── TECHNICAL_ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── AI_BEHAVIOR.md
│   ├── SECURITY_AND_PRIVACY.md
│   └── ROADMAP.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   └── ...
│   ├── components/
│   ├── features/
│   ├── lib/
│   └── types/
├── supabase/
│   └── migrations/
└── tests/
```

### Directory responsibilities
*   `src/app/` — Pages, layouts, route handlers, and application entry points.
*   `src/components/` — Shared UI components.
*   `src/features/` — Feature-specific components, hooks, schemas, and logic.
*   `src/lib/` — Shared utilities and service clients.
*   `src/types/` — Shared TypeScript types where needed.
*   `supabase/migrations/` — Version-controlled database schema changes.
*   `tests/` — Automated tests.
*   `docs/` — Product and engineering documentation.
Avoid duplicating the same component or business logic across features.
## Core Product Modules
### Memories
The primary unit of information in RevoOS.
A memory may represent a link, note, image, screenshot, or document. Preserve original content and source metadata separately from extracted text and AI-generated summaries.
### Library
The main place to browse, search, filter, and manage saved memories.
Use content-type filters and contextual tags. **Tags must not be a top-level navigation destination.**
### AI Search and Recall
Allow users to ask questions about their saved information.
Answers should be based on relevant, authorized memories, include useful source references, and acknowledge when the available evidence is insufficient.
### Collections
Let users group memories around a project, topic, or purpose.
Collections should complement search and contextual links rather than force users to file every item manually.
### Connections and Graph
Represent meaningful relationships between memories.
Introduce this capability after the core capture, persistence, and retrieval workflows are reliable. A graph should help users explore information, not exist solely as a decorative visualization.
### Capture Integrations
Support low-friction capture from the web and, in later phases, mobile devices and other sources.
Integrations should request only the permissions they need and clearly communicate what is being captured.
## Design Direction
RevoOS follows an Adora-inspired visual direction: expressive accents surrounding a clean, functional, premium interface.
*   White and near-white surfaces.
*   Electric Violet (`#592EFF`) for primary actions.
*   Midnight Plum (`#21164C`) for prominent headings.
*   Restrained pastel accents in sky blue, lime, and pink.
*   Generous spacing, subtle borders, and rounded surfaces.
*   Visual emphasis on saved content and useful context.
*   Minimal, practical application screens.
The guiding principle is **expressive outside, practical inside**.
See `docs/DESIGN_SYSTEM.md` for the full visual specification.
## Security and Privacy
Personal memories may contain sensitive information. Security is a core requirement, not a later enhancement.
*   Authenticate users before accessing private resources.
*   Enforce ownership on the server and through appropriate database policies.
*   Use Row Level Security for private Supabase data.
*   Store private uploads in private storage buckets.
*   Validate uploads and API inputs.
*   Keep privileged keys on the server.
*   Restrict AI retrieval to memories the user is authorized to access.
*   Avoid unnecessary retention of private content in logs.
*   Support appropriate deletion of memories and associated files.
Review `docs/SECURITY_AND_PRIVACY.md` before implementing authentication, uploads, AI retrieval, or sharing.
## Development Guidelines
Before implementing a feature:
1. Read [`AGENTS.md`](http://AGENTS.md) and the relevant documents under `docs/`.
2. Inspect the existing implementation and installed dependencies.
3. Define the smallest useful implementation that meets the requirements.
4. Follow existing naming, component, and architectural conventions.
5. Add appropriate validation, error handling, and tests.
6. Run the available checks.
7. Update documentation when behavior or configuration changes.
Do not claim that a feature works until it has been implemented and verified. Keep prototypes and mock data clearly separated from production integrations.
## Development Roadmap
The intended order of work is:
1. **Capture foundation:** Memory creation, library browsing, uploads, persistence, and access control.
2. **Search and recall:** Search, AI summaries, natural-language questions, and grounded answers.
3. **Organization and connections:** Contextual tags, collections, related memories, and graph exploration.
4. **Browser extension:** Convenient capture from web pages.
5. **Collaboration:** Shared spaces and permissions.
6. **Mobile:** Capture and recall from mobile devices.
The exact scope and acceptance criteria are defined in `docs/ROADMAP.md` and `docs/PRODUCT_REQUIREMENTS.md`.
Do not build every phase at once. Finish and verify the current phase before introducing unnecessary complexity.
## Documentation

| Document | Purpose |
| ---| --- |
| `AGENTS.md` | Coding-agent instructions and working conventions |
| `docs/PRODUCT_REQUIREMENTS.md` | Requirements, user journeys, and acceptance criteria |
| `docs/DESIGN_SYSTEM.md` | Visual system and UI rules |
| `docs/APP_STRUCTURE.md` | Screens, navigation, and interactions |
| `docs/TECHNICAL_ARCHITECTURE.md` | Architecture and technical decisions |
| `docs/DATA_MODEL.md` | Database entities and relationships |
| `docs/AI_BEHAVIOR.md` | AI grounding, retrieval, and output behavior |
| `docs/SECURITY_AND_PRIVACY.md` | Security and privacy requirements |
| `docs/ROADMAP.md` | Phases, priorities, and milestones |

Some documents may still be in preparation. Keep this table synchronized with the actual files in the repository.
## License
The project's license has not been specified in this README. Add the appropriate license before distributing the code publicly or accepting external contributions.