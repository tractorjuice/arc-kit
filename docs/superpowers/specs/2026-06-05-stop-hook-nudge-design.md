# Stop-hook end-of-turn nudge — design

**Date:** 2026-06-05
**Tracker:** [#522](https://github.com/tractorjuice/arc-kit/issues/522) item 70
**Status:** Approved design, pre-implementation

## Problem

ArcKit's `session-learner.mjs` runs at `Stop` and silently records a session
summary. Claude Code v2.1.163 added the ability for `Stop`/`SubagentStop`
hooks to return `hookSpecificOutput.additionalContext` to feed the model
end-of-turn feedback **without being labelled a hook error**. We want to use
that to surface a gentle, reactive next-step nudge when a session leaves an
obvious governance/traceability gap — e.g. "you created requirements this
session but there's no traceability matrix; consider `/arckit:traceability`".

This is distinct from existing surfaces:

- The SessionStart `stale-artifact-scan` monitor flags *standing* overdue /
  stale artefacts. The nudge is *reactive* to what the just-finished turn did.
- `/arckit:navigator` / `/arckit:health` are user-invoked full-project scans.

## Constraints

1. **Capability floor.** `additionalContext` from a `Stop` hook is
   **v2.1.163+**. ArcKit's supported floor is **v2.1.156**
   (`version-check.mjs` `MIN_CLAUDE_CODE_VERSION`). On clients in the
   2.1.156–2.1.162 gap, emitting `additionalContext` from `Stop` could surface
   as a hook error. The nudge MUST therefore be version-gated and stay silent
   (today's behaviour) unless the client is confirmed ≥ 2.1.163.
2. **No free version signal.** `CLAUDE_CODE_VERSION` is unset in the hook
   environment (confirmed); that is why `version-check.mjs` already falls back
   to spawning `claude --version`. We will not add latency to session end.
3. **Must never break the existing hook.** All nudge logic runs *after* the
   existing `sessions.md` / `docs/telemetry.json` writes and is wrapped so a
   failure can never derail those writes or the user's turn.
4. **Low noise.** At most one nudge per session.

## Behaviour

When a normal `Stop` fires inside an ArcKit project, after the existing session
summary is written:

1. Determine which ArcKit doc-type **codes** this session's commits touched,
   per project (data `session-learner` already computes from git).
2. For each project touched, determine which doc-type codes are **present on
   disk** (recursive scan of `projects/NNN-*/`).
3. Evaluate the curated rule set in priority order; emit the **first** match
   (across touched projects, lowest project number first) as a single nudge.
4. Emit `{ hookSpecificOutput: { hookEventName: "Stop", additionalContext } }`.
   When no nudge fires, emit `{}` (no behavioural change from today).

### Curated rule set

Evaluated top-to-bottom; first match wins.

| Priority | Touched this session | Complement absent on disk | Suggested command |
|----------|----------------------|----------------------------|-------------------|
| 1 | `REQ` (Requirements) | `TRAC` (Traceability Matrix, HIGH severity) | `/arckit:traceability` |
| 2 | `STKE` (Stakeholder Analysis) | `REQ` (Requirements) | `/arckit:requirements` |
| 3 | `REQ` (Requirements) | `DATA` (Data Model) | `/arckit:data-model` |
| 4 | `ADR` (Architecture Decision Records) | `DIAG` (Architecture Diagrams) | `/arckit:diagram` |

Rationale for the order: TRAC is the canonical example and a HIGH-severity
governance gap; STKE→REQ is the most foundational chain gap (nothing flows
without requirements); REQ→DATA is architecture completeness; ADR→DIAG is
visual evidence for a decision. A session that creates `REQ` could match rules
1 and 3 — emitting only the first keeps the nudge gentle and deterministic.

### Guards (all must hold for a nudge to emit)

- Persisted client version ≥ **2.1.163**.
- Event is a normal `Stop` (never `StopFailure` — a failed turn should not be
  nudged).
- `ARCKIT_NO_NUDGE` environment variable is unset (opt-out).
- We are inside an ArcKit project (existing `.arckit` / `projects/` guard).

### Nudge message shape

A short, single-paragraph string naming the project, what was touched, the
missing complement, and the suggested command. Example:

> ArcKit: project `001` gained requirements this session but has no
> traceability matrix. Consider running `/arckit:traceability` to keep the
> requirements-to-design chain auditable.

The model receives this as end-of-turn context and can relay/offer it to the
user. It is advisory only — never blocking.

## Version gating mechanism

Chosen approach: **persist from SessionStart, read at Stop** (no added latency,
single source of truth, reuses existing detection).

- `version-check.mjs` (SessionStart) already detects the client version. After
  detection, if running inside an ArcKit project, it writes the bare version
  string to `.arckit/memory/.cc-version` (best-effort; `mkdir -p` the memory
  dir; all failures swallowed — version-check must never break startup, and
  must not create `.arckit/` in non-ArcKit repos).
- `session-learner.mjs` (Stop) reads `.arckit/memory/.cc-version`. Absent,
  unparseable, or `< 2.1.163` ⇒ no nudge (silent, today's behaviour). This is a
  conservative default: we only nudge when we can positively confirm ≥ 2.1.163.

If `version-check.mjs` could not detect a version (returns null), it writes
nothing and the nudge stays dormant — safe.

## Components and isolation

### `selectNudge({ projectCodes, diskCodesByProject })` — pure function

- **Input:** `projectCodes` = `Map<projNum, Set<code>>` (touched this session);
  `diskCodesByProject` = `Map<projNum, Set<code>>` (present on disk).
- **Output:** `{ projNum, command, message } | null`.
- Encapsulates the rule table and priority order. No git, no fs, no version
  logic — fully unit-testable.
- **Lives in its own module** `arckit-claude/hooks/session-nudge.mjs`, exported
  and imported by `session-learner.mjs`. It must NOT live in
  `session-learner.mjs` itself, because that file executes on import (it calls
  `parseHookInput()` at top level and runs the hook), so a test importing from
  it would trigger the whole hook. The sibling module has no side effects on
  import.

### `session-learner.mjs` (Stop)

- During the existing artefact-detection loop, also build
  `projectCodes: Map<projNum, Set<code>>` (one extra `.add(code)`).
- Add `scanProjectDiskCodes(cwd, projNum)` — recursively list files under the
  matching `projects/NNN-*/` directory and collect doc-type codes via the same
  `-${code}-` / `-${code}.` filename test already used for git files.
- After the existing writes: evaluate guards, call `selectNudge`, and emit the
  appropriate JSON. Wrap the whole nudge block in try/catch so it can never
  affect the session-summary writes.
- `StopFailure` path: skip the nudge entirely.

### `version-check.mjs` (SessionStart)

- Add the best-effort `.cc-version` write described above.

### `hook-utils.mjs`

- Hoist `parseVersion` and `compareVersions` (currently inline in
  `version-check.mjs`) into shared helpers so both hooks use one copy. Update
  `version-check.mjs` to import them. Minor refactor in service of the work.

## Testing

- New test file `tests/plugin/session-nudge.test.mjs` using `node --test`
  (matching the style of the existing `tests/plugin/*.test.mjs` Wardley hook
  tests). Imports `selectNudge` from `arckit-claude/hooks/session-nudge.mjs`.
- Cases: each of the four rules fires correctly; priority order (REQ present
  with both TRAC and DATA missing → rule 1 wins); no-match returns null;
  multi-project picks the lowest project number; complement present ⇒ no nudge.
- Add `compareVersions` coverage to the existing `tests/plugin/test_hook_utils.mjs`
  (it already tests `hook-utils.mjs`, where the function now lives): rejects
  `< 2.1.163`, accepts `≥ 2.1.163`, handles ragged version strings.
- Wire `session-nudge.test.mjs` into the existing `node --test` step in
  `.github/workflows/lint-markdown.yml` (the same step that runs the Wardley
  label-tidy hook tests) so it runs in CI.

## Out of scope (YAGNI)

- More than one nudge per session.
- Scanning projects not touched this session.
- Configurable rule sets / per-rule toggles (only the global `ARCKIT_NO_NUDGE`
  opt-out).
- Any change to non-Claude extensions — hooks are Claude-only and not
  propagated by the converter, so no converter run is required.

## Risks

- **Coupling** between `version-check.mjs` and `session-learner.mjs` via the
  `.cc-version` file. Mitigated: the contract is a single bare-version file;
  absence is handled gracefully (no nudge).
- **Stale `.cc-version`** after a client downgrade. Mitigated: rewritten every
  SessionStart, so it always reflects the current client.
- **Noise.** Mitigated by one-nudge-max, reactive-only triggering, and the
  `ARCKIT_NO_NUDGE` opt-out. The rule set can be trimmed if any rule proves
  naggy ("skills/hooks are grown, not built").
