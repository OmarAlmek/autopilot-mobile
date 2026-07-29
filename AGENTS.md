# AutoPilot Mobile Agent Rules

## Platform source of truth

- This repository uses Expo SDK 57 and Expo Router. Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before changing Expo, React Native, navigation, storage, linking, or WebView code.
- Extend Expo Router. Never add a second `NavigationContainer`.
- Preserve the existing React Native `StyleSheet`, shared token, safe-area, and Material Community Icons conventions.

## Product boundaries

- AutoPilot and Venture OS are two product domains inside one mobile shell.
- AutoPilot owns operational workflows: dashboard, agents/chat, actions, approvals, activity, and data.
- Venture OS owns the learning journey: curriculum, company context, playbook, toolbox, and community.
- Navigation between domains must always be visible and deterministic, including after a cold deep link.
- Prefer native UI for navigation, forms, progress, lists, notifications, approvals, and offline-capable interactions.
- Use WebView only for rich lesson content, diagrams, matrices, or an existing web workflow that cannot yet be implemented natively. Every WebView must have a typed bridge, origin allowlist, loading/error state, external-link policy, and web fallback.
- Backend integration is a later cross-repository phase. Until access is available, define typed interfaces and local adapters without inventing production endpoints or claiming client checks are secure authorization.

## Reviewer-led execution

- Start each task from `VENTURE_OS_EXECUTION_PLAN.md` or write an equivalent self-contained task contract before editing.
- Rank work by user impact, security risk, dependency value, and validation cost. Fix blockers and architectural boundaries before decorative polish.
- Delegate bounded implementation tasks to lower-cost agents only when the task names exact scope, allowed files, non-goals, acceptance criteria, and executable checks.
- The reviewing agent must inspect the resulting diff, run the acceptance checks, and exercise the changed workflow. A worker's claim that a task is complete is not evidence.
- Reject work that only adds static presentation when the acceptance criteria require navigation, state mutation, persistence, accessibility, or failure states.
- Do not broaden a delegated task. Record adjacent problems in the ranked plan instead.

## Definition of done

- TypeScript and touched-file diagnostics pass.
- The primary behavior is exercised on at least web plus one native target when native behavior is involved.
- Loading, empty, error, disabled, and populated states are implemented where relevant.
- Controls have accessible names and minimum practical touch targets; text works at narrow mobile width and enlarged font settings.
- No secrets, API keys, tokens, personal data, or private learner content are added to tracked files, public Expo environment variables, logs, screenshots, fixtures, or WebView messages.
- Documentation and the execution plan are updated when an architectural decision or priority changes.
