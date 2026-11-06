# Product Requirements

**Version:** 1.0
**Status:** Draft
**Product:** RevoOS
**Publisher:** Ctrl Works
**Website:** [https://revoos.app/](https://revoos.app/)
* * *

## 1\. Product Overview
RevoOS is a personal AI memory system that helps people save, organize, find, and connect information from their digital lives.
Users can capture webpages, links, notes, documents, photos, screenshots, and other files. RevoOS extracts useful information, preserves context, connects related memories, and makes everything searchable through natural language.
The product should feel like a clean, visual library combined with an intelligent assistant — not another complicated note-taking app or file manager.
### Product tagline
One home for everything you save.
### Core principle
**Capture anything. Find it later. Understand how it connects.**
* * *

## 2\. Problem Statement
Important information is scattered across browser bookmarks, screenshots, downloads, notes, documents, and different applications.
Users often struggle to:
*   Remember where they saved something.
*   Recall why they saved it or what they intended to do with it.
*   Find information without remembering its exact title or keywords.
*   Connect related information saved at different times.
*   Turn saved content into useful knowledge.
*   Share useful collections of information with other people.
Traditional folders, bookmarks, and note-taking tools depend heavily on manual organization.
RevoOS should reduce this burden by making capture effortless and organization, retrieval, and connections more intelligent.
* * *

## 3\. Product Goals
### Primary goals
1. Make saving digital information fast and frictionless.
2. Provide one searchable library for different content types.
3. Help users retrieve information using natural language.
4. Preserve the context and purpose behind saved items.
5. Automatically identify useful relationships between memories.
6. Support private personal memories and explicitly shared knowledge.
7. Establish a shared foundation for browser, web, and future mobile applications.
### Non-goals for the initial release
*   Replacing a full document editor.
*   Replacing project management software.
*   Building a general-purpose social network.
*   Automatically monitoring every user activity without consent.
*   Requiring users to maintain complex folder structures.
*   Launching every platform simultaneously.
* * *

## 4\. Target Users
### Primary audience
People who frequently encounter useful information online and want to remember it later.
Examples include:
*   Researchers and students.
*   Developers and designers.
*   Founders and entrepreneurs.
*   Content creators.
*   People planning purchases, trips, projects, or personal goals.
*   Individuals who save many links, screenshots, notes, and documents.
### Core user need
"I saved something useful before. I want to find it again, remember why it mattered, and connect it to what I'm working on now."
* * *

## 5\. Product Principles
### 5.1 Capture first
Saving information should require minimal effort. Users should not have to decide on folders, tags, or categories before saving.
### 5.2 Context over storage
A memory should contain more than a file or URL. Preserve useful context such as its title, source, summary, topics, associated project, and relationships.
### 5.3 AI grounded in saved information
AI answers should use the user's accessible memories as evidence. When possible, answers should link directly to the source memories. The system must distinguish retrieved facts from uncertain inferences.
### 5.4 Automatic organization, user control
AI may suggest tags, collections, and relationships. Users must be able to edit, remove, or override those suggestions.
### 5.5 Simple by default
Keep the interface minimal, visual, and easy to understand. Advanced organization and graph functionality should not overwhelm everyday capture and search.
### 5.6 Privacy by default
Personal memories remain private unless the user explicitly shares them. Shared spaces must enforce access permissions across files, search, AI, and relationships.
* * *

## 6\. Core Features
### 6.1 Browser Extension
**Priority: P0 — Initial release**
The browser extension is the primary capture entry point.
Requirements:
*   Save the current webpage with one action.
*   Save a URL, title, and source metadata.
*   Capture selected text together with its source URL.
*   Add a quick note while saving.
*   Display a confirmation when an item is saved.
*   Detect duplicate URLs and offer to open the existing memory.
*   Allow users to assign a collection or add tags when useful.
*   Provide access to recent saves.
*   Authenticate users securely and synchronize saves with their account.
*   Handle offline or failed requests gracefully where practical.
The extension must not collect unrelated browsing activity. Capture should be initiated by the user unless a separately authorized feature is introduced later.
### 6.2 Memory Library
**Priority: P0 — Initial release**
The library is the central location for all saved memories.
Supported item types:
*   Webpages and links.
*   Notes and plain text.
*   PDFs and supported documents.
*   Photos and images.
*   Screenshots.
*   Other file formats explicitly supported by the application.
Requirements:
*   Display items in a clean visual grid and list view.
*   Show previews, titles, content types, and relevant metadata.
*   Search, sort, and filter memories.
*   Filter by content type, date, collection, and tags.
*   Open a detailed view for each memory.
*   Edit titles, descriptions, tags, and notes.
*   Favorite or pin important memories.
*   Archive or delete memories.
*   Provide loading, empty, processing, and error states.
*   Support responsive layouts for desktop and mobile browsers.
Tags must not have a dedicated primary navigation destination. Manage them contextually within the library, memory details, and collection workflows.
### 6.3 File and Photo Uploads
**Priority: P0 — Initial release**
Users must be able to import existing information, not just save webpages.
Requirements:
*   Upload individual files and multiple files where supported.
*   Upload common image formats such as JPEG, PNG, and WebP.
*   Support PDF, TXT, Markdown, and selected document formats.
*   Validate file types, sizes, and upload permissions.
*   Store originals in private storage.
*   Generate previews or thumbnails where appropriate.
*   Extract text from supported documents.
*   Apply OCR to supported images and scanned documents.
*   Display upload and processing progress.
*   Show clear states: pending, processing, ready, or failed.
*   Allow failed processing jobs to be retried.
*   Make extracted text searchable.
*   Preserve the original file and provide a way to open or download it.
*   Enforce configurable upload limits and storage quotas.
Unsupported formats must receive a clear error message rather than being silently accepted.
### 6.4 AI Memory Processing
**Priority: P1 — Core AI release**
After a memory is saved, RevoOS should process it where supported.
Requirements:
*   Generate a concise summary.
*   Extract searchable text and key information.
*   Suggest relevant tags and topics.
*   Identify potential relationships with existing memories.
*   Generate embeddings for semantic retrieval.
*   Preserve source metadata and links.
*   Track processing status and failures.
*   Allow users to edit AI-generated metadata.
AI processing should be asynchronous when appropriate. Saving an item must not fail simply because summarization or embedding generation fails.
### 6.5 AI Search and Recall
**Priority: P1 — Core AI release**
The home screen should place AI search prominently above the visual library.
Example queries:
*   "What cameras have I been considering?"
*   "Find the apartments I saved last month."
*   "Show me the articles about my current project."
*   "What were the reasons I saved these products?"
*   "Find information related to my Japan travel plans."
Requirements:
*   Support natural-language queries.
*   Combine keyword and semantic retrieval.
*   Use only memories the current user is authorized to access.
*   Generate answers grounded in retrieved sources.
*   Link answer claims to relevant memories where possible.
*   Show source cards alongside answers.
*   Allow users to open related memories.
*   Display a useful empty state when evidence is insufficient.
*   Clearly communicate when the system cannot find enough evidence.
*   Handle AI failures and rate limits gracefully.
The system must not invent saved memories or present unsupported assumptions as facts.
### 6.6 Collections and Organization
**Priority: P1**
Collections group memories around a project, topic, goal, or purpose.
Requirements:
*   Create, rename, and delete collections.
*   Add or remove memories from collections.
*   Support manual organization.
*   Suggest collections using AI where useful.
*   Show collection contents in a visual layout.
*   Provide collection-level search.
*   Allow collections to be shared in a later collaboration phase.
Collections should be more prominent than manually managed folder hierarchies.
### 6.7 Memory Connections and Knowledge Graph
**Priority: P2**
RevoOS should reveal relationships between saved items.
Requirements:
*   Suggest related memories.
*   Support manual links between memories.
*   Display backlinks on memory detail pages.
*   Show related items based on topics, sources, or shared context.
*   Provide a graph visualization of memories and their relationships.
*   Allow users to open a memory from the graph.
*   Filter graph views by collection, topic, or content type.
*   Avoid displaying a graph that becomes unusably cluttered at scale.
Graph visualization should supplement search and library navigation, not replace them.
### 6.8 Multiplayer and Shared Spaces
**Priority: P3 — Collaboration release**
Users should be able to share selected memories and collaborate without exposing their entire personal library.
Requirements:
*   Create shared spaces.
*   Invite members.
*   Support owner, editor, and viewer roles.
*   Add selected memories to shared spaces.
*   Search authorized shared memories.
*   Support comments and mentions in a later iteration.
*   Track relevant activity.
*   Synchronize shared changes across clients.
*   Display clear ownership and sharing indicators.
*   Allow members to be removed and access to be revoked.
*   Enforce permissions in database queries, file access, search results, AI context, and graph traversal.
Personal and shared memories must have clearly defined access rules. Sharing must always be explicit.
### 6.9 Accounts and Synchronization
**Priority: P0 — Initial release**
Requirements:
*   Secure account registration and login.
*   Secure session handling.
*   Synchronization between the extension and web application.
*   Account-level memory ownership.
*   Private file storage.
*   Account settings.
*   Logout and session revocation.
*   Account deletion and data export workflows.
### 6.10 Future Mobile Applications
**Priority: P4**
After the extension and web experience are stable, build iOS and Android applications using a shared backend.
Planned capabilities:
*   Capture through the operating system's share sheet.
*   Upload photos and files.
*   Browse and search memories.
*   Use AI recall.
*   View collections and connections.
*   Synchronize with the same account.
*   Manage shared spaces.
The backend and data model should support mobile clients from the beginning, but mobile development should not delay the first release.
* * *

## 7\. Core User Journeys
### Journey A: Save a webpage
1. User opens a useful webpage.
2. User clicks the RevoOS extension.
3. RevoOS captures the page title, URL, and available metadata.
4. The item is saved to the user's library.
5. Processing begins if required.
6. The user can open the memory in the web application.
**Success condition:** The item is saved reliably without requiring manual folder selection.
### Journey B: Upload a photo or document
1. User opens the web library.
2. User selects one or more files.
3. RevoOS validates the files.
4. Files are uploaded to private storage.
5. Text extraction, OCR, previews, and AI processing run where supported.
6. The memory appears in the library.
7. The user can search for its extracted content.
**Success condition:** The user can find supported content inside an uploaded file without manually transcribing it.
### Journey C: Recall an old memory
1. User enters a natural-language question on the home screen.
2. RevoOS retrieves relevant authorized memories.
3. The AI prepares an answer using retrieved evidence.
4. The interface displays the answer and supporting memories.
5. The user opens a source to inspect the original information.
**Success condition:** The user can locate useful information without remembering its exact title or storage location.
### Journey D: Discover connections
1. User opens a memory.
2. RevoOS displays related memories and backlinks.
3. User opens a related item or creates a manual connection.
4. The relationship appears in relevant detail and graph views.
**Success condition:** Users can move between related information without manually searching for every item.
### Journey E: Collaborate
1. User creates a shared space.
2. User invites another member.
3. The owner assigns an appropriate role.
4. Members add or access authorized memories.
5. Shared search and collaboration features respect membership permissions.
**Success condition:** Users can collaborate on selected knowledge without exposing private memories.
* * *

## 8\. Information Architecture
### Primary navigation
1. **Home** — AI search and recent or recommended memories.
2. **Library** — all saved items, filters, and contextual tags.
3. **Collections** — manually or automatically organized groups.
4. **Graph** — connected memories and relationships.
5. **Shared** — shared spaces and collaborative content, when collaboration launches.
Account settings should be accessed through the user menu.
The browser extension should focus on capture and quick access rather than duplicating the entire web application.
Navigation may evolve as usability testing identifies better arrangements. Do not add Tags as a separate primary navigation item.
* * *

## 9\. Data and Permission Requirements
The underlying data model should accommodate:
*   Users and profiles.
*   Memories and source metadata.
*   File assets and extracted content.
*   AI summaries and embeddings.
*   Tags and memory-tag associations.
*   Collections and collection membership.
*   Memory-to-memory relationships.
*   Shared spaces and memberships.
*   Invitations, roles, and comments.
*   Processing jobs and activity events.
Requirements:
*   Every private memory must have a clear owner.
*   Every shared resource must have an explicit access model.
*   Every file must be protected by appropriate storage permissions.
*   Deletion must address associated files and derived data according to the retention policy.
*   AI retrieval must apply authorization filters before generating an answer.
*   Background jobs must verify ownership and permissions.
*   Sensitive secrets must remain on the server and never be embedded in client bundles.
The schema may evolve during implementation, but permission boundaries must be established before real user data is introduced.
* * *

## 10\. Non-Functional Requirements
### Performance
*   Keep common navigation and library interactions responsive.
*   Use pagination or incremental loading for large libraries.
*   Generate large previews and AI summaries asynchronously.
*   Avoid blocking capture while nonessential processing runs.
*   Optimize image and document previews.
### Reliability
*   Handle network failures and interrupted uploads.
*   Make processing jobs retryable.
*   Prevent accidental duplicate saves where practical.
*   Provide clear feedback for failed operations.
*   Avoid losing user-entered notes during errors.
### Security and privacy
*   Use server-side authorization and database access policies.
*   Keep uploaded files private by default.
*   Validate uploads and request payloads.
*   Apply rate limits to expensive operations.
*   Never expose private memories through shared search, graph views, logs, or AI responses.
*   Provide user controls for export and deletion.
### Accessibility
*   Support keyboard navigation.
*   Provide accessible labels for controls.
*   Maintain readable contrast.
*   Communicate status changes without relying on color alone.
*   Respect reduced-motion preferences.
### Maintainability
*   Use reusable components and clear module boundaries.
*   Separate AI providers from application logic.
*   Separate extension-specific code from shared business logic.
*   Validate data at API boundaries.
*   Include automated tests for critical permissions and workflows.
*   Document significant architectural decisions.
* * *

## 11\. Suggested Technology Direction
This is a proposed implementation direction, subject to validation against project constraints.
*   **Web application:** Next.js, TypeScript, Tailwind CSS v4, and reusable UI components.
*   **Browser extension:** Chrome Manifest V3 with TypeScript and React, using a suitable extension framework.
*   **Backend:** Supabase with PostgreSQL, authentication, private object storage, and row-level security.
*   **AI:** Server-side model provider abstraction for summarization, embeddings, and grounded question answering.
*   **Retrieval:** PostgreSQL full-text search combined with vector search.
*   **Background processing:** Retryable asynchronous jobs for extraction, OCR, summaries, and embeddings.
*   **Mobile:** React Native with Expo, introduced after the web and extension experience stabilizes.
Use environment variables for secrets. Avoid adding infrastructure or dependencies without a clear requirement.
* * *

## 12\. Release Priorities
### Phase 1 — Capture and Library
*   Chrome extension.
*   Authentication.
*   Web library.
*   Save webpages, links, selected text, and quick notes.
*   Upload files and photos.
*   Private storage.
*   Text extraction and basic search.
*   Responsive design.
*   Synchronization between extension and web.
### Phase 2 — AI Recall
*   AI summaries.
*   OCR for supported files.
*   Natural-language search.
*   Source-grounded answers.
*   Suggested tags and collections.
*   Related-memory recommendations.
### Phase 3 — Knowledge Connections
*   Bidirectional links and backlinks.
*   Manual relationships.
*   Related-memory views.
*   Interactive graph.
### Phase 4 — Multiplayer
*   Shared spaces.
*   Invitations and roles.
*   Shared memory access.
*   Permission-aware AI search.
*   Comments and activity.
### Phase 5 — Mobile
*   iOS and Android applications.
*   Share-sheet capture.
*   Mobile uploads.
*   Synced library and AI recall.
* * *

## 13\. MVP Acceptance Criteria
The initial release is not complete until:
*   A user can create an account and sign in.
*   A user can save a webpage through the browser extension.
*   Saved items appear in the correct account's library.
*   A user can upload supported documents and images.
*   Uploaded files remain private unless explicitly shared.
*   Supported extracted text is searchable.
*   Users can view and edit memory metadata.
*   Failed uploads and processing jobs show understandable errors.
*   Users can access their library on another authenticated session.
*   Private data cannot be accessed by another user through APIs or direct file URLs.
*   Core workflows work on desktop and mobile-sized web layouts.
*   Automated tests cover authentication, ownership, uploads, and authorization boundaries.
AI answer quality, graph functionality, multiplayer, and mobile applications are subsequent release milestones rather than blockers for the initial capture-and-library release.
* * *

## 14\. Product Success Metrics
Measure whether RevoOS helps users preserve and retrieve useful information.
### Activation
*   Percentage of new users who save their first memory.
*   Time from signup to first successful save.
*   Percentage who return to search or open a saved item.
### Engagement
*   Weekly active users.
*   Memories saved per active user.
*   Search frequency and successful retrieval rate.
*   Percentage of users returning to older memories.
*   Repeat usage of the browser extension.
### Quality
*   Upload and processing success rates.
*   Search result relevance.
*   Percentage of AI answers with usable source references.
*   Rate of unanswered or unsupported questions.
*   User corrections to generated summaries and suggested relationships.
### Reliability and trust
*   Failed synchronization rate.
*   Upload failure rate.
*   Permission-related incidents.
*   Account deletion and export success rates.
Avoid optimizing solely for the number of memories saved. RevoOS succeeds when users can retrieve and use what they saved.
* * *

## 15\. Open Decisions
Resolve these before or during implementation:
*   Maximum upload sizes and storage quotas.
*   Exact document formats supported in the first release.
*   AI model and per-user usage limits.
*   Data retention and deletion policy.
*   Whether the initial release requires email verification.
*   How duplicate files and duplicate webpages are handled.
*   Whether collections can be shared independently of shared spaces.
*   Which browser to support after Chrome.
*   Which mobile platform to prioritize first.
*   Pricing and free-tier limits.
Do not invent product decisions when an unresolved choice affects security, user data, recurring costs, or architecture. Document the chosen option and rationale.
* * *

## 16\. Definition of Done
A feature is complete when:
1. Its requirements and expected behavior are clear.
2. The user interface includes loading, empty, success, and error states as applicable.
3. Permissions are enforced on the server.
4. Data is validated and failures are handled.
5. Critical paths have automated tests.
6. The feature works with the responsive design system.
7. Documentation is updated where necessary.
8. No secrets, mock production behavior, or unsupported claims are introduced.
**Final product direction:** RevoOS should make saving effortless, finding information natural, and understanding connections automatic — while keeping the experience minimal and user-controlled.