# Venture OS Mobile Integration: Ranked Execution Plan

## Purpose

This is the implementation and review contract for integrating Venture OS into AutoPilot Mobile. It is intentionally task-oriented: an implementation agent should be able to execute one ticket without reconstructing product intent, and a reviewer should be able to decide objectively whether the result meets the original goal.

## Product Architecture

AutoPilot and Venture OS are not separate mobile applications. They are domains inside one authenticated mobile shell:

- **AutoPilot:** operating dashboard, AI agents, approvals, audit activity, and connected data.
- **Venture OS:** curriculum, company context, workbook/playbook, toolbox, and community.
- **Shared shell:** identity, entitlement, notifications, deep links, settings, analytics, and domain switching.
- **Native by default:** shell, navigation, forms, progress, community lists, notifications, approvals, and cached summaries.
- **WebView by exception:** rich article bodies, diagrams, matrices, or existing web-only interactions during migration.
- **Backend later:** frontend code targets typed repositories. Local implementations support development until both backend repositories are available.

The live product at `https://ventureos.runautopilot.ai/venture-os` is the content and product-reference source. It is not a license to wrap the entire site in a WebView. Mobile should preserve the program's 10 modules, 22 lessons, 10 industry examples, inline reflections, private guidance, 10 artifacts, 55-tool directory, and cohort community while adapting interaction density to mobile.

## Priority Model

Rank = severity plus dependency value:

1. **P0:** credential or privacy exposure; stop and resolve before shipping.
2. **P1:** blocks coherent integration or makes later work disposable.
3. **P2:** core learner value and production readiness.
4. **P3:** optimization and polish after measurable workflows exist.

## Current Findings

| Rank | Problem | Why it matters | Status |
| --- | --- | --- | --- |
| P0 | Azure credential is present in client/public configuration and local proxy source | Public Expo variables are bundled into clients; exposed credentials cannot be made safe by UI code | Blocked on key owner rotation |
| P1 | Demo login and role switching are not authentication or authorization | Direct routes and local role changes bypass any real security boundary | Contract needed before backend phase |
| P1 | Venture OS had no deterministic return to AutoPilot | Cold deep links could strand users inside the program | Fixed and browser-verified |
| P1 | Venture OS screens began as static placeholders | Context and curriculum workflows now mutate persisted state; Module 1 has authored lessons; playbook, toolbox, community, and 19 lessons remain incomplete | Partially fixed |
| P1 | State and backend boundaries were undefined | Typed intent-based repository contracts and a deterministic local adapter now isolate screens from future backend APIs | Frontend boundary complete |
| P1 | Venture OS state was in memory only and unused by screens | Company context, progress, selected track, and lesson reflections now use a versioned local repository | Core learner state implemented |
| P1 | Native/WebView ownership and bridge security were undefined | Lessons now use a typed native bridge, strict origin/event policy, and web fallback | Implemented; native runtime pending |
| P2 | Flat tab routes do not own lesson, artifact, tool, and thread details | Curriculum now owns nested module and lesson routes; artifact, tool, and thread details remain open | Curriculum fixed |
| P2 | No automated workflow tests or CI quality gate exists | Type checking alone cannot catch navigation, persistence, or permission regressions | Open |
| P2 | Required loading, empty, error, offline, and accessibility states are incomplete | The current happy-path shell is not release-ready | Open |

---

## Ticket P0-01: Revoke and Remove Exposed AI Credentials

**Owner capability:** Azure resource owner plus implementation agent. This task cannot be completed by repository edits alone.

**Goal:** No reusable provider credential is shipped in, tracked by, or recoverable from the mobile client or repository history.

**Scope:** `.env`, `proxy.js`, Git history, Azure key management, environment documentation, and future AI service boundary.

**Implementation instructions:**

1. Revoke and regenerate the exposed Azure OpenAI key in Azure first. Assume the current value is compromised.
2. Search the current tree and Git history for the old value and related credential names. Do not print secret values in tickets, logs, screenshots, or chat.
3. Remove AI provider credentials from all `EXPO_PUBLIC_*` variables. Public Expo variables may contain non-secret base URLs or feature flags only.
4. Move provider calls behind a server-controlled endpoint in the backend phase. The mobile app should receive a short-lived authenticated application session, not a provider key.
5. Replace the local proxy's hardcoded key with a non-public process environment variable for local-only tooling. Restrict CORS to required local origins.
6. Ignore `.env` by default, add a redacted `.env.example`, and remove `.env` from tracking without deleting the developer's local file.
7. Decide with the repository owner whether history rewriting is required. Do not rewrite shared history without explicit approval.

**Non-goals:** Implementing production AI chat or storing a replacement key in SecureStore. Provider keys must not be distributed to clients at all.

**Success criteria:**

- The old key has been revoked at the provider.
- `git grep` and an approved history scan find no provider credential.
- A production web/native bundle contains no provider key.
- Local proxy startup fails with a clear message when its server-only environment variable is absent.
- Mobile AI requests can only target an application backend contract, not Azure/OpenAI/Anthropic/Gemini directly.

**Reviewer checks:** Inspect the diff for renamed-but-still-public secrets, scan generated bundles, and require evidence of provider rotation from the owner. Compilation alone does not pass this ticket.

---

## Ticket P1-01: Define the Shared App Shell and Domain Switcher

**Goal:** Users can move predictably between AutoPilot and Venture OS from entry, deep link, and restored state.

**Scope:** root routing, Dashboard program entry, Venture OS shared header, route constants, and navigation tests.

**Implementation instructions:**

1. Keep one Expo Router root stack and the existing domain-specific tab layouts.
2. AutoPilot Dashboard launches Venture OS through a visible Programs surface.
3. Every Venture OS top-level screen exposes a visible `AutoPilot` return control that replaces the route with `/(tabs)/dashboard`.
4. Add typed route helpers/constants only if they remove repeated path strings; do not add another navigator library.
5. Preserve each domain's tab state when practical, but prioritize deterministic recovery over complex history restoration.

**Success criteria:**

- From Dashboard, one visible action opens `/venture-os/curriculum`.
- Cold-opening `/venture-os/community` exposes a visible, accessible return action.
- Activating it lands on `/dashboard` without relying on hardware Back.
- Android hardware Back and browser history do not create an infinite domain-switch loop.
- Existing AutoPilot tab navigation remains unchanged.

**Reviewer checks:** Run `npx tsc --noEmit`, open both URLs directly, exercise visible controls, and inspect the history behavior. **Current status: implemented and browser-verified; native Back remains to be tested on Android.**

---

## Ticket P1-02: Introduce Frontend Domain Contracts and Local Repositories

**Status:** Complete for the frontend/local-adapter phase. Verified with TypeScript, diagnostics, and the live curriculum route at a 390 x 844 viewport. Persistent storage remains P1-03; backend adapters remain deferred until backend access exists.

**Goal:** Build frontend workflows now without coupling screens to fixtures or inventing backend endpoints.

**Allowed new areas:** `src/features/ventureOS/**`, `src/services/ventureOS/**`, `src/types/ventureOS.ts`. Thin route files may be updated to render feature screens.

**Implementation instructions:**

1. Define domain entities for company context, module, lesson, reflection, artifact, tool, cohort post, entitlement, and progress.
2. Define repository interfaces by user intent, such as `getCurriculum`, `saveCompanyContext`, `saveReflection`, `appendArtifactGuidance`, and `listTools`. Do not mirror hypothetical REST endpoint names.
3. Implement deterministic local repositories backed by typed seed data. Include controllable loading, empty, and error modes for UI development.
4. Keep DTO/API mapping out of components. Later backend adapters must be swappable without changing screen props.
5. Split AutoPilot and Venture OS domain state. Shared shell state may contain identity and entitlement only.

**Non-goals:** Adding Axios, guessing backend URLs, migrating every existing AutoPilot fixture, or adopting a global state library without a demonstrated need.

**Success criteria:**

- No Venture OS screen imports seed arrays directly.
- A local repository can be replaced by a fake in a test or Story-like harness.
- Repository errors map to typed, user-actionable states.
- Company context and progress types are used by both state and UI.
- `npx tsc --noEmit` passes with no `any` added at domain boundaries.

**Reviewer checks:** Trace one screen request from route to feature to repository and back. Reject wrappers that merely rename static imports without creating a replaceable boundary.

---

## Ticket P1-03: Persistent Company Context Workflow

**Status:** Implemented and web-verified at 390 x 844 and 320 x 844. Required-field validation, ten-field save, summary, edit, and full-page reload persistence pass. Android/iOS keyboard and reload validation remains required before this ticket is fully closed.

**Goal:** A learner completes and later edits the ten-field company profile that personalizes Venture OS.

**Dependencies:** P1-02. Use Expo 57-compatible storage selected from versioned docs.

**Implementation instructions:**

1. Build a multi-step native form for name, company, industry, stage, customer target, painful workflow, current tools, AI maturity, constraints, and goals.
2. Group fields into short logical steps with visible progress, Back, Continue, Save, validation, and unsaved-change handling.
3. Persist non-secret profile data locally through the repository adapter. Hydrate before deciding whether to show setup or summary.
4. Derive Context completion statistics from actual field values; remove fixed `0%` copy.
5. Provide summary and edit states. Do not store BYOK API keys in this workflow.

**Success criteria:**

- Required fields block progression with text errors announced accessibly.
- Completing the form updates the Context summary and survives full app reload.
- Editing a saved value updates dependent summary copy immediately after save.
- Hydration has an explicit loading state; storage failure has Retry and does not erase entered data.
- Keyboard navigation, narrow 320-point width, and enlarged text do not hide actions or fields.

**Reviewer checks:** Complete, reload, edit, force a repository error, and inspect stored data for secrets. Test web and one native platform.

---

## Ticket P1-04: Native/WebView Lesson Boundary and Typed Bridge

**Goal:** Rich lessons render safely across native and web while reflections and navigation remain owned by the mobile app.

**Dependencies:** P1-02. Install `react-native-webview` only with `npx expo install react-native-webview` after reading Expo SDK 57 docs.

**Implementation instructions:**

1. Create platform files: a native WebView adapter and a web renderer/fallback with the same typed props.
2. Define a versioned discriminated-union protocol for `READY`, `CONTENT_HEIGHT`, `SAVE_REFLECTION`, `APPEND_TO_PLAYBOOK`, and `OPEN_EXTERNAL_LINK`.
3. Parse unknown messages defensively. Reject malformed, oversized, unsupported-version, or unexpected-origin messages.
4. Allowlist Venture OS production and approved local development origins. External links open through the OS/browser after explicit policy checks.
5. Keep authentication tokens and provider keys out of query strings, injected JavaScript, HTML, logs, and bridge payloads.
6. Provide skeleton/loading, timeout, offline, render error, Retry, and Open in Browser states.

**Success criteria:**

- A fixture lesson renders on Android/iOS and the web fallback renders on web.
- Valid reflection messages update native state exactly once.
- Invalid JSON, unknown event types, disallowed origins, and duplicate event IDs are ignored and logged without sensitive payloads.
- WebView cannot navigate to an unapproved origin internally.
- Back behavior first handles in-lesson history when intended, then returns to the curriculum stack.

**Reviewer checks:** Inspect origin and message validation, send malformed bridge events, test offline/timeout behavior, and verify no secret crosses the bridge.

**Implementation status (2026-07-24):** Implemented. The shared contract now resolves to a native WebView adapter and a React Native web fallback. The v1 parser enforces exact origins, payload limits, event schemas, HTTPS-only external links, and duplicate event IDs without logging payloads. A fixture route is linked from Curriculum.

**Verified:** Expo web cold deep link and reflection callback at 320x844; parser assertions for valid, duplicate, malformed, oversized, unsupported-version, disallowed-origin, and unsafe-link messages; `npx tsc --noEmit`; touched-file diagnostics; `git diff --check`.

**Pending native validation:** Exercise Android or iOS fixture rendering, WebView offline/timeout/retry and external-link states, hardware Back through in-lesson history, and exactly-once native callback delivery when a device or simulator is available.

---

## Ticket P2-01: Scalable Nested Routes and Curriculum MVP

**Status:** Implemented and web-verified. Android/iOS navigation, WebView rendering, and hardware Back checks remain required before release acceptance.

**Goal:** Replace static curriculum presentation with navigable modules and lessons while preserving the five top-level tabs.

**Implementation instructions:**

1. Convert each tab that owns details into a directory with `_layout.tsx`, `index.tsx`, and typed dynamic routes.
2. Curriculum routes must support module list, module detail, and lesson detail deep links.
3. Render 10 modules and 22 lesson records from the repository contract using `FlatList`.
4. Add selected industry track, completion state, and inline reflection entry points.
5. Make the current “Up next” surface a real accessible action or remove its affordance.

**Success criteria:**

- Every module and lesson has a stable deep-linkable ID.
- Progress is derived from completed lessons and updates without fixed statistics.
- A learner can switch among all 10 industry tracks without losing reflection drafts.
- Lists have loading, empty, error, and populated states.
- Deep-linking to an unknown lesson shows a recoverable not-found state.

**Reviewer checks:** Open a known and unknown lesson URL, complete a lesson, change tracks, reload, and verify progress plus draft preservation.

**Implementation evidence (2026-07-24):** Curriculum now owns a nested Expo Router Stack with repository-backed module, module-detail, and lesson-detail routes. Ten modules and 22 lessons render through `FlatList`; stable IDs drive URLs; progress and per-module counts derive from persisted completion; all ten industry tracks persist as an accessible radio group; and lesson reflections persist through the same versioned repository boundary. Unknown module and lesson URLs provide visible recovery actions without removing the five Venture OS tabs.

**Verified:** `npx tsc --noEmit`; workspace diagnostics; `git diff --check`; cold web routes for curriculum, a known module, a known lesson, an unknown module, and an unknown lesson; track selection and full reload hydration; reflection save and full reload hydration; lesson completion and derived `1 of 22` / `1 of 3` progress; checked radio semantics; and no horizontal overflow at 320 x 844.

**Pending native validation:** Exercise the nested Stack on Android or iOS, confirm minimum touch targets and enlarged-text behavior, verify native lesson reflection delivery through WebView, and test hardware Back from lesson to module to curriculum when a device or emulator is available.

---

## Ticket P2-02: Playbook, Toolbox, and Community Vertical Slices

Execute these as three separate delegated tasks after P1-02, not one broad task.

### Playbook slice

**Status:** Implemented and web-verified. Native keyboard, enlarged-text, and storage-failure exercise remain pending.

- List all 10 artifact types with real status derived from drafts.
- Open and edit one artifact end to end.
- Append AI guidance as visibly attributed draft content, never silently overwrite learner text.
- Success: edit, append, reload, and attribution all persist; conflict/error states preserve the learner's draft.

**Implementation evidence (2026-07-24):** Playbook now owns nested list and artifact-detail routes. Ten repository-seeded artifacts cover economics, customer evidence, opportunity selection, system roles, prototyping, trust, GTM, operations, risk, and the 30/60/90-day plan. The versioned local state persists learner content, explicit `not-started` / `draft` / `complete` status, and separately stored guidance records with visible AI attribution. Empty content cannot be marked complete, save failures preserve the editor draft, unknown IDs recover to the Playbook, and the list derives all counters from persisted artifacts.

**Verified:** `npx tsc --noEmit`; fresh Expo web route manifest; all ten artifacts at `/venture-os/playbook`; economics artifact deep link; disabled actions for empty content; learner draft save; AI suggestion attribution without learner-text replacement; explicit completion; full-page reload persistence for content, guidance, and status; derived `1 Complete` list count; and no horizontal overflow at 320 x 844.

### Toolbox slice

**Status:** Implemented and web-verified. Physical-device, enlarged-text, and offline/storage-failure exercise remain pending.

- Load 55 typed tools grouped across Coding, Agents, RAG, Voice, Media, Compliance, and Research.
- Use `FlatList`, search, category filters, saved state, and tool details.
- Success: combined search/filter results are deterministic, empty filters recover cleanly, and saved tools survive reload.

**Implementation evidence (2026-07-29):** The typed local repository now seeds 55 tools across all seven required categories and persists saved state through the existing versioned storage boundary. The Toolbox renders a virtualized directory with deferred search, All/Saved/category filters, derived counts, accessible sibling controls for details and saving, an external-link policy through Expo Linking, and explicit loading, error, mutation-error, and empty-result recovery states.

**Verified:** `npx tsc --noEmit`; touched-file diagnostics; exact catalog and category counts; Chrome mobile viewport at 390 x 844; 55-result initial state; query filtering; combined RAG/query filtering; zero-result recovery to all 55 tools; details and website actions; save, Saved view, and full-page reload persistence; deterministic return to `/dashboard`; no horizontal overflow; no nested interactive controls or hydration errors. Native validation was not performed.

### Community slice

**Status:** Implemented and web-verified for feed, detail, mutations, reporting, persistence, and navigation. Injected storage-failure and physical-device validation remain pending.

- Build feed, post detail, composer, comment, and explicit empty/loading/error states against a local repository.
- Keep moderation/reporting affordances in the contract even if backend execution is deferred.
- Success: create a local post/comment, deep-link to detail, recover from failure without duplicate submission, and verify accessible author/action labels.

**Implementation evidence (2026-07-29):** Community now uses typed posts, comments, mutation inputs, and local report state behind the existing repository boundary. Optional version-1 persisted fields preserve compatibility with older local state. The feed provides a retained-on-failure composer, empty/loading/error states, stable discussion links, separate accessible Open and Report controls, and explicit local-moderation disclosure. Detail routes support comments, comment reporting, unknown-ID recovery, and deterministic return to the feed after a cold deep link. Repository writes validate trimmed input and roll back maps when persistence fails.

**Verified:** `npx tsc --noEmit`; touched-file diagnostics; Chrome at 390 x 844 CSS pixels; disabled empty composers; one post creation; stable post deep link; one comment creation; persisted report state; full-page deep-link reload preserving post, comment, and report state; deterministic back to `/venture-os/community`; exactly five visible tabs; no horizontal overflow; and no nested interactive controls. Failure-state UI is implemented, but an injected storage-write failure was not exercised in the browser. Native validation was not performed.

---

## Ticket P2-04: Authored Lesson System and Learning Experience

**Status:** Reference slice implemented and web-verified. Module 1 contains three published lessons; the remaining 19 lesson records are explicitly drafts and require product/content authoring.

**Goal:** Turn the 22 lesson records into a coherent mobile learning program that teaches one decision at a time and produces reusable company-specific work.

**Content contract:** Every published lesson must define a clear outcome, estimated duration, two to four authored teaching sections, one concrete industry example, one action exercise, and one specific reflection prompt. Content belongs to the curriculum repository contract; route components render it and must not invent lesson copy.

**Implementation instructions:**

1. Expand `VentureLesson` with publication state, duration, outcome, authored sections, an action exercise, reflection prompt, and track-specific examples. Keep stable lesson and prompt IDs so saved work survives copy revisions.
2. Author Module 1 as the reference slice: AI-native economics, the leverage gap, and the founder thesis. Each lesson should build on the previous one and end in a decision the learner can apply this week.
3. Personalize examples using the selected industry track and available company context without sending private context through URLs or WebView messages.
4. Render a visible lesson orientation containing duration and outcome, then teaching, industry example, action exercise, reflection, and completion. Do not mark a lesson complete automatically when a reflection saves.
5. Add explicit `draft` and `published` states. Draft lessons may appear in the module roadmap but must not masquerade as finished instruction or accept completion.
6. Author the remaining modules against the same schema only after the Module 1 slice passes content, product, accessibility, and persistence review.

**Success criteria:**

- No published lesson displays generated phrases such as `Apply {title} to your company context`.
- Module 1 contains three distinct, authored lessons with track-specific examples for all ten tracks.
- Changing tracks updates the example without changing the lesson URL or erasing a saved reflection.
- Reload preserves reflection text and completion while content revisions remain repository-owned.
- At 320-point width and enlarged text, lesson order, headings, inputs, and footer actions remain readable and reachable.
- A reviewer can identify the lesson outcome, teaching point, example, exercise, learner response, and completion state without consulting source code.

**Reviewer checks:** Read all three Module 1 lessons, switch between at least three tracks, save and edit a reflection, reload, complete a lesson, inspect stored data, and verify draft lessons cannot be represented as complete content.

**Implementation evidence (2026-07-24):** `VentureLesson` now owns publication status, duration, outcome, immutable teaching sections, action exercise, stable reflection prompt, and track-specific examples. Module 1 forms a three-lesson arc from AI-native economics, through bounded human/AI roles, to a falsifiable founder thesis. The shared web/native lesson contract renders orientation, teaching, selected-track example, exercise, reflection, and separate completion. Draft lessons show an in-development state and cannot accept completion. Curriculum progress counts only published lessons while retaining all 22 roadmap records.

**Verified:** `npx tsc --noEmit`; touched-file diagnostics; all three Module 1 routes at 320 x 844; distinct outcomes, sections, Clinical examples, exercises, and prompts; Property-to-Clinical track change without URL or reflection loss; backward compatibility with the existing lesson 1 reflection key; new lesson 2 reflection save and full reload hydration; explicit completion action; published-only `1 of 3` progress; and draft route recovery without reflection or completion controls.

**Next content phase:** Author Modules 2–10 one module at a time against the approved schema. Each module must pass content review and the same track, persistence, responsive, and draft-state checks before its lessons become `published`.

---

## Ticket P2-03: Quality Gate and Review Harness

**Goal:** Make completion claims reproducible for both implementation and reviewer agents.

**Implementation instructions:**

1. Add scripts for typecheck, lint, unit/component tests, and a focused end-to-end smoke test using tools compatible with Expo SDK 57.
2. Test pure domain logic and repository contracts first; add navigation/workflow tests for context persistence and domain switching.
3. Add CI that installs from the lockfile and runs non-interactive checks.
4. Document the device matrix: web mobile viewport, Android, and iOS when macOS/build access exists.

**Success criteria:**

- One command runs the local quality gate and exits nonzero on failure.
- CI runs from a clean checkout using the committed lockfile.
- Tests fail when domain return navigation, context persistence, or bridge validation is deliberately broken.
- Reviewer evidence records commands, behavior exercised, and unresolved platform gaps.

---

## Delegation Template

Use this exact structure when assigning a ticket to a lower-cost implementation model:

```text
Task: <one ticket and one behavioral outcome>

Read first:
- AGENTS.md
- VENTURE_OS_EXECUTION_PLAN.md, ticket <ID>
- <exact owning files>
- Expo SDK 57 documentation for any touched Expo API

Current behavior:
<observable starting state>

Required behavior:
<observable end state>

Allowed scope:
<specific files/directories>

Non-goals:
<what must remain unchanged>

Implementation constraints:
<architecture, security, UI, platform rules>

Acceptance criteria:
1. <binary behavior criterion>
2. <failure/edge criterion>
3. <accessibility/responsive criterion>
4. <persistence/security criterion when relevant>

Validation commands and actions:
- <narrow executable command>
- <exact route and interaction path>

Return to reviewer:
- Files changed
- Validation output summary
- Screens/behaviors manually exercised
- Known gaps or assumptions
```

## Reviewer Gate

For every delegated result:

1. Re-read the original ticket, not the worker's summary.
2. Inspect the diff for scope creep, duplicated abstractions, secrets, hardcoded success data, and inaccessible controls.
3. Run the ticket's narrow checks before broad checks.
4. Exercise the primary workflow and at least one failure path.
5. Compare observable behavior to every success criterion and mark each pass/fail with evidence.
6. Reject partial work explicitly; create a small repair task tied to the failed criterion.
7. Update this plan only after the behavior is verified.

## Next Recommended Sequence

1. Owner completes P0-01 credential rotation and repository cleanup.
2. Reviewer completes Android Back validation for P1-01.
3. Implement P1-02 domain contracts and local repositories.
4. Implement P1-03 Company Context as the first complete persisted vertical slice.
5. Implement P1-04 WebView bridge with fixture content before real lesson integration.
6. Build P2-01 curriculum routes and reader.
7. Delegate Playbook, Toolbox, and Community as separate P2-02 slices.
8. Establish P2-03 quality gates before backend adapters arrive.