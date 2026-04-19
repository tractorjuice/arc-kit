# Registry Consolidation — Single Source of Truth for Doc Types, Guides, Roles

**Date:** 2026-04-19
**Status:** Approved — ready for implementation plan
**Scope:** Refactor only. No user-visible behaviour change.

## Problem

ArcKit suffers from a recurring class of dual-registration bugs where new commands or artifact types silently default to wrong metadata because a hard-coded allow-list somewhere wasn't updated:

- **#317 (v4.7.1):** The `/arckit.pages` command prompt had a hard-coded table of 18 doc type codes at `pages.md:198`. The 18 v4.7.0 community-contributed codes landed, were correctly recorded in the manifest, but were silently omitted from the dashboard because `pages.md:198` didn't know about them.
- **Today's sync-guides gap:** 18 new community guides landed in #321. The `sync-guides.mjs` hook uses `GUIDE_CATEGORIES` and `GUIDE_STATUS` hard-coded maps keyed by stem. None of the 18 new stems were registered, so all 18 guides rendered as `category: 'Other'` / `status: 'beta'` in generated project dashboards.
- **`generate-document-id.sh`:** has its own bash `MULTI_INSTANCE_TYPES` list with 10 entries. The JS `MULTI_INSTANCE_TYPES` in `doc-types.mjs` has 17. Already drifted.

The `doc-types.mjs` header comment self-documents this: *"long term the two registries should be unified. See PR #317 for context."*

This design consolidates hard-coded registries across hooks, prompts, and scripts into the existing `arckit-claude/config/` single-source-of-truth pattern, eliminating the dual-registration class of bugs.

## Goals

1. Every piece of per-stem metadata (guide category/status, role family/count, doc-type name/category, multi-instance flag, required subdir) lives in exactly one place.
2. Every consumer — hooks, prompts, bash scripts — reads from that one place, not from its own copy.
3. Drift becomes impossible (structurally) or caught at CI (via consistency tests).
4. Zero user-visible behaviour change — `/arckit.pages` output, generated document IDs, and dashboard rendering are bit-identical before and after.

## Non-Goals

- Unifying the category vocabularies between `DOC_TYPES` (9 categories) and `GUIDES` (10 categories). Some guides have no corresponding doc-type (role guides, `init`, `start`). Alignment could be a follow-up once the structural consolidation is in place.
- Moving per-command status/category from `commands.html` into a command registry. That's scope D from the brainstorm — a whole separate project with its own spec.
- Dropping the `live / beta / alpha / experimental / community` vocabulary. These tiers stay as-is; only where they're stored changes.
- Changing any extension-format behaviour. The Codex/OpenCode/Gemini/Copilot/Paperclip generators continue to inherit the plugin source of truth via `scripts/converter.py`.

## Design

### File structure

Three config files under `arckit-claude/config/`:

```
arckit-claude/config/
├── doc-types.mjs   # existing — DOC_TYPES, MULTI_INSTANCE_TYPES, SUBDIR_MAP, KNOWN_TYPES
├── guides.mjs      # new — GUIDES, GUIDE_STEMS
└── roles.mjs       # new — ROLES, ROLE_STEMS
```

Existing `doc-types.mjs` imports stay untouched. The dual-registration warning comment in its header is deleted once the `pages.md` allow-list is retired.

### Shape of new exports

Both new files mirror the keyed-object shape `DOC_TYPES` already establishes. One object per stem replaces today's parallel-maps shape — drift between related fields becomes structurally impossible.

```js
// arckit-claude/config/guides.mjs
export const GUIDES = {
  'init':  { category: 'Getting Started', status: 'experimental' },
  'start': { category: 'Getting Started', status: 'beta' },
  // … all existing guide stems carried over from sync-guides.mjs ~1:1
  'tcop':  { category: 'Compliance',      status: 'beta' },
  'dpia':  { category: 'Compliance',      status: 'beta' },
  // Community — EU (7)
  'eu-ai-act': { category: 'Compliance',  status: 'community' },
  'eu-cra':    { category: 'Compliance',  status: 'community' },
  // … other EU/FR stems
};
export const GUIDE_STEMS = new Set(Object.keys(GUIDES));
```

```js
// arckit-claude/config/roles.mjs
export const ROLES = {
  'enterprise-architect': { family: 'Architecture', commandCount: 12 },
  'solution-architect':   { family: 'Architecture', commandCount: 10 },
  // … all 12 DDaT roles
};
export const ROLE_STEMS = new Set(Object.keys(ROLES));
```

**Status values:** `live` / `beta` / `alpha` / `experimental` / `community` — the five tiers already in use after today's v4.7.3-queued fix.

**Category values:** preserved verbatim from the existing `sync-guides.mjs` map (Getting Started, Discovery, Planning, Architecture, Governance, Compliance, Operations, Procurement, Integrations, Reporting).

### Refactor `sync-guides.mjs`

Delete the four hard-coded blocks:

- `GUIDE_CATEGORIES` (current lines 93–137)
- `GUIDE_STATUS` assembly loop (current lines 139–144 including today's community loop)
- `ROLE_FAMILIES` (current line 157)
- `ROLE_COMMAND_COUNTS` (current line 171)

Add imports at the top of the file:

```js
import { GUIDES } from '../config/guides.mjs';
import { ROLES } from '../config/roles.mjs';
```

Rewrite the `buildGuides()` lookup (~line 236):

```js
// before
category: GUIDE_CATEGORIES[stem] || 'Other',
status: GUIDE_STATUS[stem] || 'beta',

// after
const meta = GUIDES[stem];
category: meta?.category || 'Other',
status: meta?.status || 'beta',
```

Same pattern for role lookups (~line 228):

```js
family: ROLES[stem]?.family || 'Other',
commandCount: ROLES[stem]?.commandCount || 0,
```

The `'Other' / 'beta' / 0` fallbacks stay as safety nets but should never fire in practice — the consistency test (below) asserts every stem has an entry.

### Retire the `pages.md:198` allow-list

The sync-guides hook already builds a hook-context payload consumed by `/arckit:pages`. Add one field:

```js
// sync-guides.mjs, near where hookContext is assembled
import { DOC_TYPES, KNOWN_TYPES } from '../config/doc-types.mjs';

hookContext.knownDocTypes = [...KNOWN_TYPES].map(code => ({
  code,
  name: DOC_TYPES[code].name,
  category: DOC_TYPES[code].category,
}));
```

In `arckit-claude/commands/pages.md`, replace the hand-maintained table at line ~198 with prose that points at the hook context:

> **Known artifact types.** The sync-guides hook injects a `knownDocTypes` array into context above, containing every valid type code with its display name and category. Use this list — and only this list — to decide which artifacts to render. If a manifest entry's type code is not in `knownDocTypes`, skip it silently (it will be flagged by the `validate-arc-filename.mjs` hook upstream). Group by `category` when building the dashboard sidebar.

The existing duplicate type-code table in `pages.md` is removed entirely. The dual-registration warning in the `doc-types.mjs` header comment is deleted.

**Converter impact:** the 5 non-Claude extension formats (Codex, OpenCode, Gemini, Copilot, Paperclip) currently inherit the `pages.md` prompt verbatim. They too lose their hard-coded tables — acceptable because those platforms either have their own sync-guides equivalent or don't run `/arckit.pages` at all.

### Bash path for `generate-document-id.sh`

Replace the drifted bash `MULTI_INSTANCE_TYPES` array with a shell-out to Node:

```bash
# Read MULTI_INSTANCE_TYPES from doc-types.mjs (single source of truth)
MULTI_INSTANCE_TYPES=($(node --input-type=module -e "
  import('${CLAUDE_PLUGIN_ROOT:-${BASH_SOURCE%/*/*/*}}/arckit-claude/config/doc-types.mjs')
    .then(m => console.log([...m.MULTI_INSTANCE_TYPES].join(' ')))
" 2>/dev/null))

if [[ ${#MULTI_INSTANCE_TYPES[@]} -eq 0 ]]; then
  echo "ERROR: Could not read MULTI_INSTANCE_TYPES from doc-types.mjs" >&2
  exit 1
fi
```

Notes:

- `${CLAUDE_PLUGIN_ROOT:-…}` falls back to computing the path from `$BASH_SOURCE` so the script works both as a plugin hook (where `CLAUDE_PLUGIN_ROOT` is set) and when invoked directly from a checkout.
- Node is already a hard dependency of the ArcKit plugin (every hook is `.mjs`), so no new runtime requirement.
- ~100 ms overhead on each script invocation — invisible compared to filesystem work already happening.
- Hard fail if the import returns nothing, rather than silently using an empty list.

### Drift-detection test

New test file `tests/plugin/test_registry_consistency.py` runs as part of the existing pytest suite. Asserts:

1. **Command ↔ guide coverage:** every `arckit-claude/commands/*.md` stem has a matching entry in `GUIDES`. Catches "new command added, guide registration forgotten" — today's #321-class gap.
2. **Guide ↔ registry coverage:** every `arckit-claude/docs/guides/*.md` stem has a matching entry in `GUIDES`. Catches "guide added, registry entry forgotten" — today's sync-guides gap.
3. **Category vocabulary:** every `GUIDES[stem].category` value is one of the 10 allowed categories (Getting Started, Discovery, Planning, Architecture, Governance, Compliance, Operations, Procurement, Integrations, Reporting). Fails fast on typos.
4. **Status vocabulary:** every `GUIDES[stem].status` value is one of `live / beta / alpha / experimental / community`. Fails fast on typos.
5. **Role ↔ guide coverage:** every `ROLES` stem has a matching file in `arckit-claude/docs/guides/roles/`.
6. **Bash integration works:** shell out to `node --input-type=module -e …` from the test, assert the returned array equals `MULTI_INSTANCE_TYPES` read directly from the JS. Proves the bash path in `generate-document-id.sh` actually works.

### Regression test for the refactor

Before-and-after parity:

1. On `main` at current HEAD, run `/arckit.pages` against a representative test repo (e.g. a local checkout of `arckit-test-project-v17-fuel-prices`). Save the generated `docs/index.html`.
2. Apply the refactor branch. Re-run `/arckit.pages` against the same repo.
3. `diff` the two `index.html` files. Expected: zero semantic differences. Any diff beyond trivial whitespace/ordering is a refactor regression and blocks the merge.

Plus all existing tests (989 pytest + any others) must still pass.

## Files Touched

Direct changes:

- `arckit-claude/config/guides.mjs` — NEW
- `arckit-claude/config/roles.mjs` — NEW
- `arckit-claude/config/doc-types.mjs` — edit header (remove dual-registration warning)
- `arckit-claude/hooks/sync-guides.mjs` — delete 4 hard-coded blocks, add imports, rewrite lookups, add `knownDocTypes` to hook context
- `arckit-claude/commands/pages.md` — replace line-198 table with prose pointing at hook context
- `arckit-claude/scripts/bash/generate-document-id.sh` — replace `MULTI_INSTANCE_TYPES=(…)` with node shell-out
- `tests/plugin/test_registry_consistency.py` — NEW

Indirect (regenerated by `scripts/converter.py`):

- 5 extension-format copies of `pages.md` under `arckit-codex/`, `arckit-copilot/`, `arckit-gemini/`, `arckit-opencode/`, `arckit-paperclip/`
- Paperclip `commands.json`

## Migration

Single PR targeting `main`, single release cycle. Changes are internal-only — no migration required for users, no changes to existing project data, no changes to generated output format.

## Follow-ups (out of scope for this spec)

- Unify the category vocabularies between `DOC_TYPES` (9 categories) and `GUIDES` (10 categories).
- Full command registry (scope D from the brainstorm): hoist `commands.html` per-row status/category, `DEPENDENCY-MATRIX` dependencies, and other command-level metadata into a single `COMMANDS` registry.
- Extend the consistency test to also check that every command has a corresponding `DOC_TYPES` entry for its primary output type code (would have caught the #317 root cause earlier).
