# Technical Architecture

**Document type:** Engineering specification
**Product:** RevoOS
**Publisher:** Ctrl Works
**Status:** Proposed architecture
**Primary goal:** Build a secure, extensible AI memory platform with a web application, browser extension, and a foundation for future mobile applications.
* * *

## 1\. Architecture Principles
RevoOS should be built around these principles:
1. **Capture once, access everywhere.** Every saved memory belongs to the user's account and can eventually be accessed across web, browser extension, and mobile.
2. **Keep original content.** Preserve uploaded files, source URLs, and original text whenever possible. AI-generated summaries and extracted text are additional representations, not replacements.
3. **Ground AI in saved information.** Answers must be based on retrieved memories, with references to the sources used.
4. **Private by default.** Users can only access their own memories unless explicit sharing permissions are introduced.
5. **Build incrementally.** Start with reliable capture, storage, and search before adding sophisticated AI, graph analysis, collaboration, and mobile apps.
6. **Separate responsibilities.** UI components, business logic, database access, file processing, and AI integrations should not be tightly coupled.
7. **Avoid unnecessary infrastructure.** Prefer managed services and a modular monolith until actual usage justifies more complex systems.
8. **Maintain a consistent design system.** Follow `docs/DESIGN_SYSTEM.md` and reuse shared UI components rather than introducing unrelated styling conventions.
## 2\. Recommended Technology Stack

| Layer | Technology | Responsibility |
| ---| ---| --- |
| Web application | Next.js App Router | Pages, layouts, server rendering, API endpoints |
| Language | TypeScript | Type safety across application modules |
| UI | React | Interactive user interface |
| Styling | Tailwind CSS v4 | Utility styling and design tokens |
| UI components | shadcn/ui with compatible component primitives | Accessible, reusable interface elements |
| Validation | Zod | Validate API inputs and environment configuration |
| Authentication | Supabase Auth | Sign-in, sessions, identity |
| Database | Supabase PostgreSQL | Users, memories, metadata, relationships |
| File storage | Supabase Storage | Original uploads and derived assets |
| Access control | PostgreSQL Row Level Security (RLS) | Enforce ownership and access policies |
| Search | PostgreSQL full-text search | Initial keyword and extracted-text search |
| Semantic search | pgvector | Future embedding-based retrieval |
| AI | Provider abstraction with OpenAI as an initial option | Summaries, natural-language recall, answers |
| Browser extension | WXT + TypeScript + React | Webpage capture and quick access |
| Testing | Vitest + React Testing Library + Playwright | Unit, component, and end-to-end testing |
| Deployment | Cloudflare or another compatible hosting platform | Web deployment, subject to runtime compatibility |

### Stack rules
*   Use the versions already established by the repository where possible.
*   Do not downgrade Tailwind CSS v4 to v3 to accommodate an outdated tutorial or component configuration.
*   Verify compatibility between the selected shadcn/ui component primitives and the existing project.
*   Use server-side code for privileged database access, AI requests, and sensitive file operations.
*   Keep provider-specific APIs behind internal interfaces.
*   Do not add Redis, a separate vector database, microservices, or a dedicated job platform until there is a demonstrated need.
**Hosting note:** Choose the deployment environment based on the actual Next.js runtime and required server functionality. If using Cloudflare, verify compatibility with the chosen adapter and deployment mode before depending on Node.js-specific features.
## 3\. High-Level System Architecture

```sql
flowchart TD
    User[User]
    Web[RevoOS Web App]
    Ext[Browser Extension]
    Mobile[Future Mobile App]

    Web --> API[Application Services]
    Ext --> API
    Mobile -. Future .-> API

    API --> Auth[Supabase Auth]
    API --> DB[(PostgreSQL)]
    API --> Storage[Private Object Storage]
    API --> AI[AI Provider Adapter]

    Storage --> Processing[Content Processing]
    Processing --> DB

    DB --> Search[Search and Retrieval]
    Search --> AI
    AI --> API
```

The initial release consists of the web application, a browser extension, Supabase services, and an AI integration.
The mobile application and advanced processing infrastructure are future extensions, not MVP dependencies.
## 4\. Application Architecture
Use a modular monolith: one web application with clearly separated modules and server-side business logic.
### 4.1 Frontend responsibilities
The frontend handles:
*   Page navigation and responsive layouts.
*   Search input and result presentation.
*   Memory cards, detail views, collections, and graph visualization.
*   Upload interfaces and capture feedback.
*   Loading, empty, error, and success states.
*   Optimistic UI updates where safe.
*   Authentication-aware navigation.
The frontend must not contain privileged credentials or implement authorization as UI-only checks.
### 4.2 Server responsibilities
The server handles:
*   Authentication and session verification.
*   Ownership and permission checks.
*   Memory creation, updates, and deletion.
*   File upload authorization and processing coordination.
*   Content extraction and indexing.
*   AI provider calls.
*   Search and retrieval.
*   Collection membership and memory relationships.
*   Rate limiting and request validation.
Every API endpoint must validate its input and enforce access control independently of the frontend.
### 4.3 Module boundaries
Organize code around product capabilities rather than placing all business logic inside page components.
Recommended modules:
*   `auth`: sessions, identity, account lifecycle.
*   `memories`: CRUD operations and metadata.
*   `capture`: webpage and manual capture.
*   `uploads`: file validation, storage, and processing status.
*   `search`: keyword retrieval and search ranking.
*   `ai`: summaries, answer generation, and provider abstraction.
*   `collections`: user-defined groups of memories.
*   `connections`: explicit relationships between memories.
*   `graph`: graph data retrieval and visualization support.
*   `sharing`: future workspace membership and access policies.
Modules should expose clear interfaces. A module should not directly depend on internal implementation details of unrelated modules.
## 5\. Recommended Project Structure
Adapt this structure to the existing repository rather than replacing working code without inspection.

```sql
revo-os/
├── AGENTS.md
├── README.md
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
│   │   ├── (marketing)/
│   │   ├── (app)/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── memories/
│   │   ├── search/
│   │   ├── collections/
│   │   └── graph/
│   ├── features/
│   │   ├── auth/
│   │   ├── memories/
│   │   ├── capture/
│   │   ├── uploads/
│   │   ├── search/
│   │   ├── ai/
│   │   ├── collections/
│   │   └── connections/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── ai/
│   │   ├── validation/
│   │   ├── security/
│   │   └── utils/
│   └── types/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── package.json
```

Keep route-specific code inside `src/app`. Put reusable business logic in `src/features` or `src/lib`, and avoid importing server-only modules into client components.
The browser extension should eventually live in a separate workspace or package, for example `apps/extension/`, with its own manifest, permissions, build configuration, and tests. Do not force extension-specific code into the Next.js application bundle.
## 6\. Database and Storage Architecture
Use Supabase PostgreSQL as the source of truth for application metadata.
### 6.1 Core entities
The initial data model should support:
*   **Profiles:** application-specific user settings.
*   **Memories:** saved items and their metadata.
*   **Memory files:** original files and derived assets.
*   **Collections:** user-created groups.
*   **Collection members:** memories belonging to collections.
*   **Tags:** labels associated with memories.
*   **Memory tags:** many-to-many tag assignments.
*   **Memory relationships:** links between related memories.
*   **Processing jobs or status records:** track extraction, indexing, and summary generation.
Detailed columns, constraints, and relationships belong in `docs/DATA_MODEL.md`.
### 6.2 Memory types
Support these initial item types:
*   `link`
*   `note`
*   `image`
*   `document`
*   `screenshot`
Use validated, consistent identifiers rather than deriving application behavior from display labels.
A memory may include:
*   Title and description.
*   Original URL or source information.
*   User-provided content.
*   Extracted text.
*   AI-generated summary.
*   Tags and collection memberships.
*   Creation and update timestamps.
*   Processing status.
*   Optional file references.
*   Optional links to related memories.
Keep original content separate from extracted content and AI-generated content so each can be updated independently.
### 6.3 Database migrations
*   Store schema changes in version-controlled Supabase migrations.
*   Do not rely on manually changing the production schema through a dashboard.
*   Use foreign keys, appropriate indexes, unique constraints, and transactions.
*   Add indexes based on actual query patterns.
*   Use a consistent timezone strategy, storing timestamps as PostgreSQL `timestamptz`.
*   Generate or maintain TypeScript database types from the schema.
*   Never use production user data as development seed data.
### 6.4 File storage
Store original uploads in a private Supabase Storage bucket.
Recommended storage pattern:

```coffeescript
users/{user_id}/memories/{memory_id}/{file_id}
```

This is an organizational convention, not an authorization mechanism. Enforce access with authenticated server checks and storage policies.
Store file metadata in PostgreSQL, including:
*   Storage object key.
*   Original filename.
*   MIME type.
*   File size.
*   Checksum when useful.
*   Processing status.
*   Optional extracted-text or thumbnail references.
Do not store large file contents directly in ordinary database rows.
Use short-lived signed URLs when a client needs direct access to a private object. Never expose permanent public URLs for private user files.
## 7\. Authentication and Authorization
Use Supabase Auth for authentication and session management.
### Requirements
*   Require authentication for private memory operations.
*   Associate every user-owned record with a valid owner ID.
*   Enable RLS on all tables containing private user data.
*   Check ownership on server-side operations.
*   Enforce storage object access separately from database access.
*   Prevent users from changing owner IDs to access another user's records.
*   Keep administrative credentials server-only.
*   Use secure session handling appropriate to the selected Next.js and Supabase integration.
*   Verify access control on reads, updates, deletes, uploads, downloads, and search requests.
### Row Level Security
For personal memories, the default policy should restrict access to the authenticated owner.
Conceptually:

```sql
-- Illustrative policy; adapt to the actual schema.
create policy "Users can read their own memories"
on public.memories
for select
to authenticated
using ((select auth.uid()) = user_id);
```

Equivalent ownership checks are required for inserts, updates, and deletes. Use `WITH CHECK` for write policies where appropriate.
Do not copy this example blindly: define policies for every table, relationship, and storage bucket, including indirect access paths.
### Future shared workspaces
Do not implement collaboration by weakening personal-memory policies.
When sharing is introduced, add explicit workspace membership, roles, and resource permissions. Access should be granted through deliberate membership and sharing rules, not because an item is discoverable through search.
## 8\. Browser Extension Architecture
The browser extension is a primary capture surface for RevoOS.
Use WXT with TypeScript and React, subject to the chosen browser targets and build configuration.
### 8.1 Initial functionality
*   Capture the current webpage URL.
*   Read the page title and permitted metadata.
*   Allow the user to add a note or select a collection.
*   Send a capture request to RevoOS.
*   Display success, duplicate, authentication, and failure states.
*   Open the saved memory in the web application.
*   Support sign-in through a secure authentication flow.
### 8.2 Extension components
*   **Popup:** quick capture, note entry, and status.
*   **Background/service worker:** extension events and supported background tasks.
*   **Content script:** optional page-specific extraction when required.
*   **Authentication module:** manages the extension's supported sign-in flow.
*   **API client:** communicates with authenticated RevoOS endpoints.
Request only the browser permissions that are necessary. Do not collect browsing history or run automatic background capture without an explicit product decision and clear user consent.
### 8.3 Capture flow
1. User opens a webpage and activates the extension.
2. Extension reads the current tab's permitted metadata.
3. User confirms the capture or adds context.
4. Extension submits an authenticated request.
5. Server validates the request and checks ownership.
6. Server creates the memory record.
7. The UI shows success and offers a link to the saved item.
For the initial release, save URLs and metadata rather than attempting to archive every page perfectly. Full-page extraction, paywall handling, and complex dynamic websites can be added incrementally.
### 8.4 Authentication considerations
Browser extensions have different storage and redirect constraints from normal web pages.
*   Use a supported OAuth or authentication flow.
*   Validate redirect destinations.
*   Do not embed privileged keys in the extension.
*   Avoid logging access tokens.
*   Use appropriate extension storage and token handling.
*   Do not assume the extension can reuse the web application's cookies.
*   Test sign-in, token refresh, sign-out, and expired sessions explicitly.
The extension must use the same memory API and ownership rules as the web application.
## 9\. File Upload and Content Processing
Uploads should be handled as a staged process, not as a single long-running HTTP request.
### 9.1 Initial supported content
Prioritize common images and PDFs, with additional document formats added based on requirements.
Validate file type, size, filename, and actual file contents where feasible. Do not trust a client-provided MIME type alone.
### 9.2 Processing pipeline

```dpr
flowchart TD
    Upload[Upload requested]
    Validate[Validate file and permissions]
    Store[Store original file]
    Record[Create metadata record]
    Extract[Extract text or OCR]
    Index[Index searchable content]
    Summarize[Generate optional summary]
    Ready[Mark memory ready]

    Upload --> Validate
    Validate --> Store
    Store --> Record
    Record --> Extract
    Extract --> Index
    Index --> Summarize
    Summarize --> Ready
```

Processing stages should be independently retryable. A summary failure must not destroy the original upload or its extracted text.
### 9.3 Processing status
Use explicit statuses such as:
*   `pending`
*   `processing`
*   `ready`
*   `failed`
Persist enough error information for debugging without exposing internal stack traces or sensitive content to users.
For an MVP, a small server-side processing workflow may be sufficient. Introduce a durable job queue when file processing duration, retries, concurrency, or workload makes synchronous execution unreliable.
### 9.4 OCR and extraction
*   Extract text from supported PDFs and documents.
*   Use OCR for images or scanned documents when required.
*   Preserve extracted text separately from the original file.
*   Record extraction failures and unsupported formats.
*   Avoid assuming that every file contains extractable text.
*   Treat document contents as untrusted input when sending them to AI models.
Do not perform expensive extraction or AI processing repeatedly when the file has not changed. Use processing state and, where useful, checksums to avoid unnecessary work.
## 10\. Search and AI Architecture
AI functionality should be built on top of a reliable memory retrieval layer.
### 10.1 Initial search
Implement keyword search across available fields such as:
*   Memory title.
*   User notes.
*   Original URL and metadata.
*   Extracted document text.
*   AI summary, where available.
Use PostgreSQL full-text search and appropriate indexes. Combine it with simpler field matching where useful.
Search results must be scoped to the authenticated user before they are returned or passed to the AI layer.
### 10.2 Future semantic search
Add embeddings and pgvector when semantic recall is ready.
The retrieval pipeline may combine:
1. Keyword retrieval.
2. Semantic similarity.
3. Metadata filters.
4. Recency and relevance ranking.
5. Deduplication and result limits.
Treat this as a hybrid retrieval system, not as a replacement for exact keyword search.
### 10.3 AI provider abstraction
Keep provider-specific implementation details behind an internal interface.
Example conceptual interface:

```css
export interface AIProvider {
  summarize(input: SummarizeInput): Promise<SummarizeResult>;
  answer(input: AnswerInput): Promise<AnswerResult>;
  embed?(input: EmbedInput): Promise<EmbedResult>;
}
```

The types are illustrative; define actual input and output schemas in the codebase.
The application should not call a vendor's SDK directly from unrelated UI components or feature modules. This allows the model or provider to be changed without rewriting the product.
### 10.4 Natural-language recall flow
1. Receive and validate the user's query.
2. Authenticate the user.
3. Retrieve only memories the user is authorized to access.
4. Rank and limit the candidate memories.
5. Pass the query and relevant source content to the AI provider.
6. Generate an answer grounded in the retrieved sources.
7. Validate the answer structure and source references.
8. Return the answer with links to the memories used.
### 10.5 Grounding and reliability
*   Do not invent facts about the user's saved content.
*   Distinguish retrieved evidence from generated interpretation.
*   Include source references for factual claims when supported.
*   Handle insufficient evidence honestly.
*   Validate that returned source IDs belong to the actual retrieval set.
*   Do not treat content inside saved webpages or documents as trusted system instructions.
*   Limit input size, retrieval count, and output length.
*   Do not send unrelated memories to an AI provider.
*   Do not log full prompts or document contents by default.
AI-generated summaries and embeddings should be traceable to the source content version used to produce them. Reprocess them when the source changes or the processing strategy is intentionally updated.
### 10.6 Cost control
*   Avoid regenerating summaries on every page view.
*   Reuse valid summaries until their source content changes.
*   Set token and request limits.
*   Limit retrieval results to relevant sources.
*   Track usage by operation and model.
*   Provide clear failure behavior for provider timeouts, rate limits, and unavailable services.
## 11\. API Design
Use Next.js Route Handlers for application endpoints where appropriate.
Example endpoint organization:

| Endpoint | Purpose |
| ---| --- |
| `POST /api/memories` | Create a memory |
| `GET /api/memories` | List and filter memories |
| `GET /api/memories/[id]` | Retrieve one authorized memory |
| `PATCH /api/memories/[id]` | Update memory metadata |
| `DELETE /api/memories/[id]` | Delete a memory and coordinate cleanup |
| `POST /api/uploads` | Authorize or initiate an upload |
| `POST /api/memories/[id]/process` | Request supported processing |
| `GET /api/search` | Search memories |
| `POST /api/ask` | Answer a natural-language question |
| `GET /api/collections` | List collections |
| `POST /api/collections` | Create a collection |

This is a proposed contract, not a requirement to implement every route immediately.
### API conventions
*   Validate request bodies, query parameters, and identifiers.
*   Use consistent response formats and HTTP status codes.
*   Return safe, actionable errors.
*   Enforce authentication and authorization for every private operation.
*   Use pagination for potentially large result sets.
*   Set limits on uploads, search results, and AI requests.
*   Make retryable operations idempotent where practical.
*   Avoid leaking database errors, internal implementation details, or secrets.
For the initial application, direct server-side module calls may be simpler than creating internal HTTP APIs for every operation. Use HTTP endpoints at actual boundaries, including extension requests and external clients.
## 12\. Design System Integration
All interfaces must follow `docs/DESIGN_SYSTEM.md`.
The visual reference is Adora-inspired: white surfaces, Electric Violet actions, Midnight Plum headings, pastel painterly accents, rounded cards, and restrained shadows.
### Implementation rules
*   Define design tokens centrally in `src/app/globals.css`.
*   Reuse shared buttons, inputs, dialogs, cards, and navigation components.
*   Keep UI components presentational when possible.
*   Place data fetching and business operations in the appropriate server or feature layer.
*   Use consistent loading, empty, error, and success states.
*   Keep the main application more functional and less decorative than the marketing site.
*   Do not add a primary Tags navigation item; manage tags within the Library, memory details, and collection workflows.
*   Ensure keyboard navigation, visible focus, accessible labels, and reduced-motion support.
Do not introduce a second color system or override the established tokens inside individual pages without a documented reason.
## 13\. Testing Strategy
Testing must cover both expected behavior and access boundaries.
### Unit tests
Test:
*   Input validation.
*   Memory transformations.
*   Search filters and ranking helpers.
*   AI response parsing.
*   Content-processing status transitions.
*   Utility functions.
### Integration tests
Test:
*   Authenticated memory creation and retrieval.
*   Database ownership rules.
*   Upload authorization and metadata creation.
*   Collection membership.
*   Search scoping.
*   AI source-reference validation.
*   Processing failures and retries.
### End-to-end tests
Test at least:
1. User signs in.
2. User captures a webpage through the extension.
3. The saved memory appears in the web library.
4. User uploads a supported document or image.
5. Search retrieves an authorized memory.
6. AI answers a question using retrieved memories.
7. User edits and deletes a memory.
8. Another user cannot access the first user's private memories or files.
Use isolated test accounts and test data. Do not disable authorization checks to make tests pass.
## 14\. Observability and Operations
The initial system should make operational failures visible without collecting unnecessary personal content.
Monitor:
*   API error rates and latency.
*   Authentication failures.
*   Upload and extraction failures.
*   Search latency.
*   AI request failures and latency.
*   AI usage and estimated costs.
*   Processing backlog, if background jobs are introduced.
Use structured logs with request IDs and safe error metadata.
Never log secrets, access tokens, complete private documents, or full AI prompts by default.
Add error reporting and analytics only with suitable privacy settings and data minimization. Analytics must not become a source of private memory content.
## 15\. Environment Configuration
Maintain a documented `.env.example` containing placeholder values only.
Potential variables include:

```plain
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=
```

The exact variables depend on the installed Supabase client version and chosen authentication integration.
Rules:
*   Public variables may be exposed to the browser; private credentials must not use the `NEXT_PUBLIC_` prefix.
*   Keep the Supabase service role key server-only and avoid using it when normal user-scoped access is sufficient.
*   Never commit real secrets.
*   Validate required environment variables at startup or at the relevant server boundary.
*   Document which variables are required for local development, tests, and deployment.
*   Keep development, test, preview, and production credentials separate.
## 16\. Deployment and Environments
Maintain separate development, preview, and production environments.
### Development
*   Local Next.js application.
*   Development Supabase project or isolated local Supabase setup.
*   Synthetic seed data.
*   Test AI provider configuration or controlled real-provider usage.
### Preview
*   Isolated test configuration where practical.
*   No access to production secrets by default.
*   Safe test accounts and test uploads.
### Production
*   HTTPS.
*   Managed environment secrets.
*   Versioned database migrations.
*   Database and storage access policies.
*   Error monitoring.
*   Backup and recovery procedures appropriate to the selected Supabase plan.
*   A tested deployment and rollback process.
Before selecting Cloudflare Pages, Workers, or another host, validate compatibility with the exact Next.js deployment mode, authentication callbacks, server APIs, upload handling, and any processing runtime. Avoid relying on long-running requests for work that should be asynchronous.
## 17\. Implementation Phases
### Phase 1 — Foundation and capture
Build:
*   Project setup and shared design tokens.
*   Authentication and protected application routes.
*   Supabase schema, migrations, and RLS.
*   Memory creation, listing, editing, and deletion.
*   Private file uploads and storage.
*   Basic keyword search.
*   Browser extension webpage capture.
*   Error handling and automated tests.
**Exit criteria:** A user can securely capture a webpage, upload supported content, and retrieve their own saved memories.
### Phase 2 — AI recall
Build:
*   Content extraction and OCR for supported formats.
*   Processing status and retry handling.
*   AI summaries.
*   Natural-language questions.
*   Grounded answers with clickable source memories.
*   Search improvements and usage tracking.
**Exit criteria:** Users can ask questions about saved information and receive answers tied to retrieved sources.
### Phase 3 — Connections and knowledge graph
Build:
*   Explicit memory relationships.
*   Related-memory discovery.
*   Collection workflows.
*   Graph data endpoints.
*   Interactive graph visualization.
**Exit criteria:** Users can discover and navigate meaningful relationships between their saved items.
### Phase 4 — Shared workspaces
Build:
*   Workspace membership.
*   Roles and permissions.
*   Explicit memory sharing.
*   Shared collections and search.
*   Collaboration audit and access controls.
**Exit criteria:** Shared information remains isolated according to workspace permissions.
### Phase 5 — Mobile applications
Build:
*   Cross-platform mobile client.
*   Authenticated capture and upload.
*   Library and AI search.
*   Shared API and data contracts.
*   Mobile-specific offline and synchronization behavior as required.
**Exit criteria:** Users can access and capture memories across web, browser extension, and mobile.
## 18\. Non-Negotiable Engineering Rules
1. Inspect the existing repository before making structural changes.
2. Preserve working features unless a change is explicitly required.
3. Do not build all future phases into the MVP.
4. Never trust frontend-only authorization.
5. Enforce private-memory access in the database and server.
6. Never expose service role keys or AI API keys to clients.
7. Keep AI provider calls behind an abstraction.
8. Preserve original files and source metadata.
9. Make content processing observable and retryable.
10. Keep schema changes version-controlled.
11. Follow `docs/DESIGN_SYSTEM.md` for every new interface.
12. Add tests for critical functionality and permission boundaries.
13. Avoid unnecessary dependencies and infrastructure.
14. Update documentation when architecture or API contracts change.
15. Do not claim a feature is implemented until its code and relevant tests are in place.
## 19\. Definition of Done
A feature is complete when:
*   Its acceptance criteria are satisfied.
*   It follows the established architecture and design system.
*   Authentication and authorization are enforced where applicable.
*   Inputs are validated and errors handled.
*   Loading, empty, success, and failure states are addressed.
*   Relevant tests pass.
*   No secrets or private content are unintentionally exposed.
*   Required migrations and configuration documentation are included.
*   The implementation does not break existing functionality.
* * *

## Final Architecture Decision
RevoOS should begin as a **Next.js modular monolith backed by Supabase**, with a separate browser extension client and a provider-independent AI layer.
Keep PostgreSQL as the source of truth, private object storage for original files, and keyword search as the reliable initial retrieval method. Add semantic search, OCR, graph features, collaboration, and mobile capabilities in stages as the product matures.
The architecture should make RevoOS easy to build now without locking it into an expensive or unnecessarily complex infrastructure later.