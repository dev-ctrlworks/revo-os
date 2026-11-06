# Security and Privacy

**Document type:** Security and privacy specification
**Product:** RevoOS
**Publisher:** Ctrl Works
**Status:** Proposed
**Applies to:** Web application, browser extension, APIs, database, file storage, AI integrations, and future mobile applications.
* * *

## 1\. Purpose
RevoOS stores personal information that users intentionally save from their digital lives, including links, notes, screenshots, images, documents, and contextual information.
Security and privacy must be foundational to the product.
This document defines the minimum requirements for authentication, authorization, data storage, AI processing, browser-extension behavior, deletion, logging, and future collaboration.
It is an implementation specification, not a claim that these controls have already been implemented or independently audited.
## 2\. Core Security Principles
1. **Private by default.** Personal memories must not be accessible to other users without explicit authorization.
2. **Least privilege.** Every component receives only the permissions necessary for its function.
3. **Server-enforced authorization.** Hiding UI elements is never a substitute for access control.
4. **Defense in depth.** Use application checks, database policies, storage policies, validation, and testing together.
5. **Data minimization.** Collect and retain only information necessary for product functionality.
6. **Explicit AI boundaries.** Never send unrelated user memories to an AI provider merely because they are available.
7. **Preserve user control.** Users should be able to inspect, export where supported, and delete their own data.
8. **No silent capture.** Browser capture must be initiated by the user unless a separately defined, transparent opt-in feature is introduced.
9. **Secure defaults.** New tables, storage buckets, APIs, and integrations must begin with restrictive permissions.
10. **Honest security claims.** Do not advertise encryption, zero-knowledge architecture, end-to-end encryption, or certifications unless those properties are actually implemented and verified.
## 3\. Data Classification
Classify information according to its sensitivity and handling requirements.

| Classification | Examples | Required handling |
| ---| ---| --- |
| Public | Published marketing pages and public documentation | May be publicly accessible |
| Internal | Application configuration and non-sensitive operational metadata | Restrict access to authorized operators |
| Private user data | Saved URLs, notes, titles, tags, collections, search queries | Authenticated, owner-scoped access |
| Private files and content | Screenshots, PDFs, images, extracted text, AI summaries | Private storage and strict access checks |
| Secrets | API keys, service-role credentials, signing keys, session tokens | Secret management; never expose in client code or logs |

A publicly accessible webpage does not make the user's saved copy, annotations, search history, or associated project context public.
Treat the relationships between saved items as private user data too.
## 4\. Authentication
Use Supabase Auth for identity and session management.
### Requirements
*   Require authentication for private memory operations.
*   Use supported Supabase session handling for the selected Next.js version.
*   Validate sessions on protected server-side requests.
*   Use secure cookie settings where cookie-based sessions are used.
*   Protect authentication callbacks and validate redirect destinations.
*   Handle session expiry and refresh failures safely.
*   Provide a reliable sign-out flow.
*   Avoid exposing authentication tokens in URLs, logs, analytics, or error messages.
*   Rate-limit sensitive authentication endpoints where appropriate.
*   Do not implement custom password storage when using Supabase Auth.
### Account lifecycle
The system must define behavior for:
*   New account creation.
*   Email verification, if enabled.
*   Password recovery.
*   Session revocation and sign-out.
*   Account deletion.
*   Cleanup of associated memories and uploaded files.
Creating an account must not automatically make any saved content public.
## 5\. Authorization and Ownership
Authorization must be enforced independently of the user interface.
### 5.1 Personal memory access
For the personal MVP, a user may access only records they own.
Every memory-related operation must verify authorization, including:
*   List and detail retrieval.
*   Search and AI retrieval.
*   Memory creation, editing, and deletion.
*   Upload initiation and download access.
*   Tag and collection operations.
*   Relationship creation and retrieval.
*   Content extraction and AI-processing requests.
Never trust a client-supplied `user_id` as proof of ownership.
Derive the authenticated identity from a verified session and apply it consistently to database and storage operations.
### 5.2 Supabase Row Level Security
Enable Row Level Security (RLS) on all tables containing private user data.
This includes, where implemented:
*   `profiles`
*   `memories`
*   `memory_files`
*   `tags`
*   `memory_tags`
*   `collections`
*   `collection_memories`
*   `memory_relationships`
*   Processing-job records
*   Embedding records
Define policies for each required operation: `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
For updates, use both `USING` and `WITH CHECK` as appropriate so users cannot change a record's ownership to another account.
Example for a user-owned memory table:

```sql
alter table public.memories enable row level security;

create policy "Users can read their own memories"
on public.memories
for select
to authenticated
using ((select auth.uid()) = user_id);
```

This is an illustrative policy, not a complete security implementation. Equivalent policies and write checks are required for the actual schema.
### 5.3 Related records
A record being individually owned is not enough if it references another user's record.
Enforce these invariants:
*   A file belongs to the same owner as its parent memory.
*   A tag and its assigned memory have the same owner.
*   A collection and its included memories have the same owner in the personal MVP.
*   Both endpoints of a personal memory relationship belong to the same owner.
*   Processing jobs and embeddings cannot be used to access another user's memory.
Use foreign keys, constraints where suitable, RLS, and server-side authorization checks together.
### 5.4 Service-role credentials
Supabase service-role credentials bypass normal RLS protections.
*   Never expose them in client-side code or browser-extension bundles.
*   Never prefix them with `NEXT_PUBLIC_`.
*   Use them only in trusted server-side operations that genuinely require elevated access.
*   Validate the caller's authorization before performing privileged operations.
*   Avoid using elevated credentials for routine user-scoped reads and writes.
*   Do not assume service-role operations are safe merely because they execute on the server.
## 6\. File Storage Security
All private user uploads must be stored in private Supabase Storage buckets.
### Requirements
*   Do not make private memory buckets public.
*   Apply storage policies to upload, read, update, and delete operations.
*   Verify that the requested object belongs to an authorized memory.
*   Generate short-lived signed URLs for authorized access where necessary.
*   Do not expose permanent public links to private objects.
*   Validate actual file content where feasible, not only filename extensions or client-provided MIME types.
*   Apply upload size and format limits.
*   Generate storage paths on the server rather than trusting arbitrary client paths.
*   Treat filenames as untrusted data.
*   Prevent path traversal and object-key manipulation.
*   Clean up storage objects when memories or accounts are deleted.
### Malware and unsafe files
Uploaded documents may contain malicious or malformed content.
*   Use maintained parsing libraries.
*   Keep file-processing dependencies updated.
*   Apply file size, page count, decompression, and processing-time limits where applicable.
*   Do not execute uploaded files.
*   Consider malware scanning before offering higher-risk file processing or sharing.
*   Isolate resource-intensive processing from normal web requests where practical.
*   Return safe errors without exposing parser stack traces.
The original file should remain unchanged when extraction fails.
## 7\. Browser Extension Security
The RevoOS extension can access webpage metadata and send user-selected content to the application. Its permissions must remain narrow and transparent.
### 7.1 Permissions
*   Request only the browser permissions required for current functionality.
*   Prefer user-triggered capture over continuous browsing observation.
*   Avoid collecting full browsing history.
*   Do not read page content beyond what the active capture feature requires.
*   Explain permissions in clear language.
*   Do not introduce automatic capture without a separately defined consent flow.
### 7.2 Authentication
*   Use a supported authentication flow appropriate for browser extensions.
*   Do not assume the extension can safely reuse web-app cookies.
*   Protect tokens using an appropriate extension authentication and storage strategy.
*   Never embed database service-role keys or AI provider keys in the extension.
*   Validate redirect URLs and authentication callbacks.
*   Handle expired sessions without repeatedly retrying protected requests.
*   Clear locally stored credentials during sign-out as appropriate.
### 7.3 Message and content security
*   Validate messages between popup, background service worker, and content scripts.
*   Restrict which components can send privileged messages.
*   Treat webpage titles, URLs, HTML, and extracted content as untrusted input.
*   Escape or safely render user-controlled content.
*   Do not insert captured HTML into the extension UI without sanitization.
*   Validate capture payloads on the server even if the extension already validates them.
The extension must communicate through the same authenticated memory API and ownership rules as the web application.
## 8\. AI and External Provider Privacy
AI features may process user queries, saved content, extracted text, and metadata. These operations must be limited to what is necessary to complete the user's request.
### 8.1 Data minimization
*   Retrieve relevant memories before constructing an AI request.
*   Send only the content needed to answer the query.
*   Avoid sending an entire library when a small set of memories is sufficient.
*   Avoid including unrelated metadata, authentication information, or secrets in prompts.
*   Apply token and result limits.
*   Do not send private content to analytics systems.
*   Keep AI-provider credentials on the server.
### 8.2 Provider configuration
Before enabling a provider in production, review its current terms and configuration for:
*   Data retention.
*   Use of submitted data for model training.
*   Available data-control settings.
*   Processing location, where relevant.
*   Applicable contractual commitments.
*   Data deletion and logging behavior.
Do not promise that AI inputs are never retained or used for training unless the selected service, account configuration, and applicable terms support that statement.
Document the actual providers used by the product and disclose relevant processing in the privacy notice.
### 8.3 Prompt injection and untrusted content
Saved webpages, PDFs, notes, and screenshots may contain instructions intended to manipulate AI behavior.
*   Treat retrieved memory content as untrusted reference material.
*   Never allow retrieved content to override system or developer instructions.
*   Do not execute commands found in saved content.
*   Do not let content request unrestricted access to other memories.
*   Keep retrieval authorization separate from model reasoning.
*   Validate returned source identifiers against the authorized retrieval set.
*   Require explicit authorization before any external action or destructive operation.
AI-generated content must not be treated as verified truth simply because it was produced by a model.
### 8.4 Grounded answers
*   Return references to memories used in an answer.
*   Verify that every returned reference points to an accessible memory.
*   Handle insufficient evidence honestly.
*   Distinguish saved facts from model-generated inference.
*   Do not fabricate quotations or source references.
*   Avoid retaining complete prompts and retrieved content in operational logs by default.
### 8.5 AI failure behavior
If a provider times out, returns malformed output, or reaches a rate limit:
*   Return a safe, understandable error.
*   Preserve the original memory and extracted text.
*   Allow a retry when appropriate.
*   Avoid silently returning invented answers.
*   Do not expose provider keys, internal prompts, or raw exception traces.
## 9\. Data Retention and Deletion
Users must have a clear path to manage and delete their saved information.
### 9.1 Memory deletion
When a memory is deleted:
1. Verify the user's authorization.
2. Remove or invalidate the memory record according to the product's deletion policy.
3. Remove tag assignments, collection memberships, and relationships.
4. Remove or schedule removal of associated files.
5. Clean up derived artifacts such as embeddings and processing jobs.
6. Ensure the deleted memory no longer appears in search results or AI retrieval.
7. Handle failed storage cleanup with retryable operations.
Database transactions and object-storage deletion are not necessarily atomic. Use a reliable cleanup process to prevent orphaned private objects.
### 9.2 Account deletion
Account deletion must define a complete lifecycle covering:
*   Profile records.
*   Memories and metadata.
*   Uploaded files.
*   Tags and collections.
*   Relationships.
*   Extracted text and AI summaries.
*   Embeddings and processing jobs.
*   Sessions and account identity.
*   Relevant backups and retention obligations.
Do not claim immediate physical erasure from every backup if the infrastructure uses backup retention periods. Document the actual retention and expiry behavior.
### 9.3 Retention limits
Do not retain failed-processing payloads, debug copies of private files, or redundant AI inputs indefinitely.
Define retention periods for operational data based on actual requirements. Avoid collecting data that the product does not need.
### 9.4 Export
If data export is implemented, verify the user's identity and scope the export to their authorized records. Protect generated archives with short-lived access and ensure temporary files are cleaned up.
## 10\. API Security
Every endpoint must be treated as an independent security boundary.
### Requirements
*   Authenticate private operations.
*   Validate all inputs using schemas such as Zod.
*   Apply ownership and permission checks.
*   Enforce request size limits.
*   Limit expensive operations, including AI queries and content extraction.
*   Use pagination and result limits.
*   Avoid trusting client-supplied IDs or ownership fields.
*   Return safe error messages.
*   Use appropriate HTTP status codes.
*   Protect state-changing browser requests according to the selected session and authentication model.
*   Apply rate limiting where abuse or cost exposure warrants it.
*   Make retryable operations idempotent where practical.
### Common risks to prevent
*   Insecure direct object references (IDOR).
*   Cross-user memory leakage.
*   Unauthorized file downloads.
*   Mass assignment of protected fields.
*   Stored and reflected cross-site scripting (XSS).
*   Server-side request forgery (SSRF) during URL processing.
*   Denial of service through oversized uploads or expensive processing.
*   Abuse of AI endpoints to create unexpected costs.
*   Injection attacks against SQL or content parsers.
Use parameterized database operations and safe URL-fetching practices. If server-side URL retrieval is introduced, block private/internal network destinations and unsafe redirect targets, and revalidate each redirect to reduce SSRF risk.
## 11\. Web Application Security
*   Use HTTPS in deployed environments.
*   Render untrusted content using safe React rendering patterns.
*   Avoid `dangerouslySetInnerHTML` unless there is a reviewed, necessary, and sanitized use case.
*   Configure security headers appropriate to the deployment environment.
*   Introduce a Content Security Policy compatible with the app and required integrations.
*   Keep dependencies updated and review security advisories.
*   Do not expose server-only modules or secrets through client bundles.
*   Avoid placing sensitive content in URLs, query parameters, or analytics events.
*   Restrict redirects to trusted destinations where appropriate.
*   Use safe error boundaries and avoid leaking stack traces in production.
Security-header configuration must be tested against the actual deployment platform rather than copied blindly from a different hosting environment.
## 12\. Logging, Analytics, and Monitoring
Logs should help diagnose failures without becoming a second store of private user content.
### Log where appropriate
*   Request or correlation IDs.
*   Operation names.
*   Status codes.
*   Processing durations.
*   Safe error codes.
*   AI usage metrics and estimated costs.
*   Upload and extraction success/failure.
*   Authentication and authorization failures.
### Do not log by default
*   Passwords or authentication tokens.
*   API keys and secrets.
*   Full private documents or extracted text.
*   Complete AI prompts containing user content.
*   Signed file URLs.
*   Unnecessary personal information.
*   Raw authorization headers.
Apply access controls and retention limits to logs and monitoring systems. Review analytics settings to prevent private memory content from being captured.
## 13\. Shared Workspaces — Future Requirements
RevoOS may eventually support shared collections, workspaces, and collaborative AI search.
Collaboration must not weaken the personal-memory security model.
Before implementing sharing:
*   Define workspace ownership and membership.
*   Define roles and permissions.
*   Decide how personally owned memories become shared.
*   Restrict retrieval to authorized workspace content.
*   Enforce access rules in the database and application.
*   Handle revocation of access.
*   Define behavior for copying, moving, and deleting shared memories.
*   Consider auditing security-sensitive membership and permission changes.
*   Test access using users with different roles.
A memory must not become accessible merely because its ID appears in a shared collection or AI-generated graph.
## 14\. Security Testing
Security controls must be tested, not just documented.
### Required test cases
**Authentication**
*   Anonymous users cannot access private memories.
*   Expired sessions are rejected appropriately.
*   Sign-out invalidates access according to the session design.
**Ownership**
*   User A cannot retrieve User B's memory by changing an ID.
*   User A cannot edit or delete User B's memory.
*   User A cannot access User B's files using guessed storage paths.
*   User A cannot assign User B's tags or memories to their collections.
*   Search and AI endpoints do not return another user's content.
**Uploads**
*   Oversized or unsupported files are rejected.
*   Forged MIME types are handled safely.
*   Unauthorized downloads are denied.
*   Failed processing does not expose private data.
**AI**
*   Retrieved content is limited to authorized memories.
*   Untrusted document instructions cannot override model instructions.
*   Invalid source references are rejected.
*   Provider failures do not produce fabricated answers.
**Browser extension**
*   Privileged messages are validated.
*   Credentials are not exposed in bundles or logs.
*   Untrusted webpage content is rendered safely.
*   Unnecessary browser permissions are not requested.
**Deletion**
*   Deleted memories disappear from retrieval.
*   Related database records and stored files are cleaned up.
*   Failed cleanup is detectable and retryable.
Automate these tests where possible and run them before production releases.
## 15\. Incident Response
Maintain a basic incident-response procedure before launching to the public.
The procedure should include:
1. Detect and document the incident.
2. Determine the affected service, accounts, and data.
3. Contain the issue, including revoking compromised credentials where necessary.
4. Preserve relevant security logs.
5. Fix the root cause and verify the remediation.
6. Determine whether user notification or other action is required under applicable law.
7. Document lessons learned and preventive changes.
Do not store incident evidence in publicly accessible locations or include secrets in issue trackers.
## 16\. Privacy Notice and User Communication
The product's privacy notice should accurately explain:
*   What data RevoOS collects and stores.
*   What the browser extension can access.
*   How saved content is processed.
*   Which external AI or infrastructure providers process data.
*   How users can delete their memories and accounts.
*   What retention and backup limitations apply.
*   How users can contact the operator about privacy concerns.
Do not make unsupported claims such as “zero data retention,” “end-to-end encrypted,” “never shared,” or “fully anonymous.”
For a Malaysia-based launch serving global users, review applicable Malaysian data-protection requirements and any additional laws relevant to the users and markets served. Obtain qualified legal advice where necessary.
## 17\. Secrets and Environment Configuration
Use environment variables and the deployment platform's secret manager for sensitive configuration.
Rules:
*   Commit only placeholder values in `.env.example`.
*   Never commit real credentials.
*   Rotate exposed keys promptly.
*   Use separate credentials for development and production.
*   Keep service-role and AI-provider keys server-only.
*   Restrict production access to authorized maintainers.
*   Avoid printing secrets during debugging.
*   Review build artifacts to ensure secrets are not included in client bundles.
If a secret is exposed, remove the exposure and rotate the credential. Deleting it from the latest commit alone may not remove it from repository history or existing deployments.
## 18\. Pre-Launch Security Checklist
### Database and access control
*   RLS is enabled on all private tables.
*   Read, write, update, and delete policies have been reviewed.
*   Cross-user access tests pass.
*   Related-record ownership is enforced.
*   Storage buckets are private where required.
*   Database migrations are version-controlled.
### Application
*   API inputs are validated.
*   Privileged credentials remain server-only.
*   Production errors do not reveal stack traces or secrets.
*   Security headers and redirect behavior are reviewed.
*   Rate limits and upload limits are configured.
*   Dependencies have been reviewed for known vulnerabilities.
### AI and content processing
*   AI requests contain only relevant authorized data.
*   Provider data-handling terms and settings are reviewed.
*   AI output references are validated.
*   Untrusted content is treated as data, not instructions.
*   Processing failures are safe and retryable.
*   Logs do not retain private prompts or files by default.
### Browser extension
*   Permissions are limited to actual needs.
*   Authentication and token handling are reviewed.
*   No privileged credentials are bundled.
*   Capture is user-initiated and transparent.
*   Messages and webpage content are validated.
### Operations and privacy
*   Account and memory deletion behavior is defined.
*   Backup retention and recovery are understood.
*   Monitoring avoids unnecessary private content.
*   Privacy documentation reflects actual behavior.
*   Incident-response steps and a security contact are established.
## 19\. Instructions for OpenCode
When implementing security-related features:
1. Read `docs/TECHNICAL_ARCHITECTURE.md` and `docs/DATA_MODEL.md`.
2. Inspect the existing repository and migrations before changing the schema.
3. Implement the narrowest permission set that supports the feature.
4. Enforce access controls in the database and server, not only in the UI.
5. Never expose privileged keys or tokens to browser clients.
6. Add tests for unauthorized and cross-user access.
7. Do not disable RLS to work around a failing query.
8. Do not weaken privacy protections for convenience.
9. Do not claim a security feature is complete until it has been implemented and tested.
10. Update this document whenever security-relevant behavior changes.
* * *

## Final Security Decision
RevoOS must treat personal memories, contextual metadata, relationships, search queries, AI outputs, and uploaded files as private by default.
For the MVP, prioritize verified authentication, strict ownership enforcement, private storage, safe content processing, minimal AI disclosure, and tested deletion behavior. Introduce shared access only through an explicit permission model.
Security must be an enforced property of the system, not a promise made by the interface.