# Kimi V3 Model Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Moonshot AI's Kimi V3 a documented, opt-in, selectable model for the two ArcKit distributions where the user picks the model (Codex CLI and OpenCode CLI), and harden the one genuinely model-aware code path (`provenance-stamp.mjs`) so a provider-prefixed or suffixed model id is parsed instead of silently dropped.

**Architecture:** ArcKit ships in six formats; only Codex CLI and OpenCode CLI let the user choose the underlying model, so those are the only Kimi-relevant surfaces. For Codex, agent roles already inherit the user's configured model (no hardcoded model exists to change), so "adding Kimi" is a **config-and-docs** change: ship a commented Moonshot provider block plus a profile. For OpenCode, add a documented (disabled-by-default) Moonshot provider entry to `opencode.json`. Separately, extract the pure model/effort helpers out of the self-executing `provenance-stamp.mjs` hook into an importable `provenance-model.mjs` module so they can be unit-tested, then widen the model-id regex and tidy the effort matrix.

**Tech Stack:** Python 3.12 (`scripts/converter.py`), Node ESM hooks (`plugins/arckit-claude/hooks/*.mjs`), `node:test`/`node:assert` test suites (`tests/plugin/*.test.mjs`), pytest extension tests (`tests/codex/`, `tests/opencode/`), TOML (Codex config) and strict JSON (OpenCode config).

## Global Constraints

- **Never push to `main`.** All work lands via a feature branch and PR. This plan's branch is `docs/kimi-v3-plan-revision` (planning) → implementation lands on its own branch.
- **`plugins/arckit-claude/` is the single source of truth.** The Codex/OpenCode/Gemini/Copilot/Vibe extension dirs under `extensions/` are gitignored converter outputs. Never hand-edit generated files; edit the source and re-run `python scripts/converter.py`.
- **Hand-authored, tracked OpenCode file:** `extensions/arckit-opencode/opencode.json` is a hand-maintained manifest (NOT a converter output), so edits there are committed directly.
- **Test naming for auto-discovery:** CI runs `node --test tests/plugin/*.test.mjs` (`.github/workflows/lint-markdown.yml:101`). New Node test suites MUST use the `*.test.mjs` suffix to be picked up automatically.
- **`opencode.json` is strict JSON — no comments allowed.** A "documented provider stanza" must be a real JSON object (use `"enabled": false`), with the human-facing explanation living in the OpenCode README, not inline.
- **Both CHANGELOGs:** repo root `CHANGELOG.md` and `plugins/arckit-claude/CHANGELOG.md`.
- **Pre-push checklist for converter/hook changes:** `python scripts/converter.py` then run `tests/codex/` and `tests/opencode/`, run `node --test tests/plugin/*.test.mjs`, run `python scripts/sync-shared-assets.py --check`, and `npx markdownlint-cli2 "**/*.md"`.
- **Effort strings are Claude-only.** The converter strips `effort:` from command/agent markdown frontmatter for non-Claude targets; Codex agent `.toml` files carry neither `model` nor `effort`. Do not introduce effort semantics for Kimi.

---

## Correction log — what changed from the 2026-07-21 draft

This plan revises `docs/plans/2026-07-21-add-kimi-v3-model.md` (branch `claude/kimi-v3-model-plan-6bpq48`). The prior draft's framing (Kimi only matters for Codex + OpenCode; do not add Kimi to `MODEL_MAX_EFFORT`) was correct and is retained. The following claims were **verified against the code and corrected**:

1. **The prior draft's "primary change point" was a misidentification.** It named `scripts/converter.py:1191-1193` (`model = frontmatter.get("model", "mistral-large-2")`) as "the only place the non-Claude *agent* model is chosen." That line is inside `generate_vibe_agent_toml_files()` (def at `converter.py:1159`) — it generates the **Mistral Vibe** (`arckit-vibe`) extension, where `mistral-large-2` is the correct, intentional default. Kimi is not Vibe. **This line must NOT be touched.**
2. **There is no hardcoded non-Claude *Codex/OpenCode* agent model to parameterise.** Codex agent `.toml` files (`generate_agent_toml_files()`, `converter.py:1081`) contain only `name` and `developer_instructions` — no `model`, no `effort`. `generate_codex_config_toml()` (`converter.py:852`) sets no top-level `model`, no `[profiles]`, and no `[model_providers]`. Codex agents inherit the user's configured model. So the prior draft's proposed `DEFAULT_VIBE_MODEL` converter constant is dropped entirely — there is nothing to parameterise, and the name would have pointed at the Vibe generator.
3. **A second `mistral-large-2` literal exists** at `scripts/convert_vibe_agents.py:143` — also a Vibe generator, also correct as-is, also out of scope.
4. **The effort matrix is a Claude-only hook, confirmed.** `provenance-stamp.mjs` never runs under Codex/OpenCode, so adding Kimi to `MODEL_MAX_EFFORT` is a no-op. Retained. The prior draft billed "add the missing `claude-opus-4-8` row" as a "real fix" — it is cosmetic (see Task 3): `xhigh` is already the top `EFFORT_RANK`, so any cap of `xhigh` never downgrades, identical to the model being absent. We still add it for clarity, but honestly labelled.
5. **The regex fix is real but was scoped too narrowly.** The prior draft widened `extractModelFromContent` for `/` and `:` only. The current Claude id in use is `claude-opus-4-8[1m]` — the `[` `]` of the context-window suffix **also** breaks the `[a-z0-9.-]+` class. Task 2 widens for `/ : [ ]` together.
6. **The functions cannot be unit-tested as-is.** `provenance-stamp.mjs` exports nothing and self-executes (`process.exit(0)` at top level), so importing it in a test runs the whole hook. Following the codebase's own `session-nudge.mjs` precedent, Task 1 first extracts the pure helpers into an importable `provenance-model.mjs`. The prior draft's "add a unit case" step was not achievable without this.

## Where model-awareness actually lives (corrected audit)

| Location | What it is | Touch for Kimi? |
|----------|-----------|-----------------|
| `provenance-stamp.mjs:127` `extractModelFromContent()` | Regex `[a-z0-9.-]+` on the footer's model line. Rejects `/`, `:`, `[`, `]` → provider-prefixed/suffixed ids parse as `null`. Claude-only hook. | **Yes — Task 2.** Real correctness fix, worth it independent of Kimi (fixes `claude-opus-4-8[1m]` today). |
| `provenance-stamp.mjs:74-89` `MODEL_MAX_EFFORT` / `downgradeEffort()` | Effort-downgrade matrix. Missing `claude-opus-4-8`. Claude-only hook. | **Cosmetic — Task 3.** Add `claude-opus-4-8` row + Claude-only comment. Do NOT add Kimi (no-op). |
| `generate_codex_config_toml()` `converter.py:852` | Emits `[features]`, hooks, MCP, and `[agents.*]` role stubs. No `[model_providers]`, no profile, no `model`. | **Yes — Task 5.** Append a commented Moonshot provider + `kimi` profile. |
| `extensions/arckit-opencode/opencode.json` | Hand-authored manifest. `mcp` block only; no `provider`/`model`. | **Yes — Task 6.** Add a disabled Moonshot provider entry + README note. |
| `converter.py:1191-1193` `generate_vibe_agent_toml_files()` | **Mistral Vibe** agent model default `mistral-large-2`. | **No — leave alone.** Vibe is Mistral by design. |
| `scripts/convert_vibe_agents.py:143` | Second **Mistral Vibe** generator, `mistral-large-2`. | **No — leave alone.** |
| Codex agent `.toml` (`generate_agent_toml_files()` `converter.py:1081`) | `name` + `developer_instructions` only. | **No — nothing to change; agents inherit the user's model.** |
| `CLAUDE.md` effort paragraph, README, `docs/index.html`, templates' `[AI_MODEL]` footer | Documentation / self-report placeholder. | **Yes — Task 8.** Docs + footer id alignment. |

## File Structure

**New files:**
- `plugins/arckit-claude/hooks/provenance-model.mjs` — pure, side-effect-free model/effort helpers (`EFFORT_RANK`, `MODEL_MAX_EFFORT`, `downgradeEffort`, `extractModelFromContent`), exported for import. Mirrors the `session-nudge.mjs` (pure) vs `session-learner.mjs` (hook) split.
- `tests/plugin/provenance-model.test.mjs` — `node:test` suite for the extracted helpers. Auto-discovered by CI.

**Modified files:**
- `plugins/arckit-claude/hooks/provenance-stamp.mjs` — import the four helpers from `provenance-model.mjs`; delete the local copies.
- `scripts/converter.py` — `generate_codex_config_toml()` gains a commented Moonshot provider + `kimi` profile block.
- `extensions/arckit-opencode/opencode.json` — add a disabled `provider.moonshot` entry.
- `extensions/arckit-opencode/README.md` — document the Moonshot/Kimi provider.
- `tests/codex/test_codex_extension.py` — assert the commented provider block is present in generated `config.toml`.
- `CLAUDE.md`, `README.md`, `docs/index.html` — Kimi V3 docs, effort-strip clarification.
- `CHANGELOG.md`, `plugins/arckit-claude/CHANGELOG.md` — changelog entries.

Phase 1 (Tasks 1-3) is pure correctness in a Claude-only hook and is shippable as a standalone PR, independent of the Kimi id being finalised. Phase 2 (Tasks 4-7) is the Kimi config work, gated on the Task 4 fact-check. Phase 3 (Task 8) is docs.

---

## Task 1: Extract pure model/effort helpers into an importable module

**Files:**
- Create: `plugins/arckit-claude/hooks/provenance-model.mjs`
- Create (test): `tests/plugin/provenance-model.test.mjs`
- Modify: `plugins/arckit-claude/hooks/provenance-stamp.mjs:62-90,127-130`

**Interfaces:**
- Produces: `extractModelFromContent(content: string): string | null`, `downgradeEffort(requested: string | null, model: string | null): string | null`, and constants `EFFORT_RANK: Record<string,number>`, `MODEL_MAX_EFFORT: Record<string,string>` — all exported from `provenance-model.mjs`.
- Consumes: nothing (leaf module).

This task is a **behaviour-preserving refactor**: the extracted module keeps the *current* regex (`[a-z0-9.-]+`) and *current* 4-row matrix. The regex widening (Task 2) and the matrix row (Task 3) come after, each as its own reviewable delta.

- [ ] **Step 1: Write the characterization test (locks current behaviour, including the known bug)**

Create `tests/plugin/provenance-model.test.mjs`:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { extractModelFromContent, downgradeEffort, MODEL_MAX_EFFORT } =
  await import(resolve('plugins/arckit-claude/hooks/provenance-model.mjs'));

test('extractModelFromContent: plain Claude id parses', () => {
  assert.equal(extractModelFromContent('**Model**: claude-opus-4-7\n'), 'claude-opus-4-7');
});

test('extractModelFromContent: "AI Model" label parses', () => {
  assert.equal(extractModelFromContent('**AI Model**: claude-sonnet-4-6\n'), 'claude-sonnet-4-6');
});

test('extractModelFromContent: backtick-wrapped id parses without backticks', () => {
  assert.equal(extractModelFromContent('**Model**: `claude-haiku-4-5`\n'), 'claude-haiku-4-5');
});

test('extractModelFromContent: no model line returns null', () => {
  assert.equal(extractModelFromContent('# Heading\n\nBody text.\n'), null);
});

// KNOWN BUG (fixed in Task 2): provider-prefixed / suffixed ids currently drop to null.
test('extractModelFromContent: slash id currently returns null (pre-fix baseline)', () => {
  assert.equal(extractModelFromContent('**Model**: moonshotai/kimi-v3\n'), null);
});

test('downgradeEffort: null requested returns null', () => {
  assert.equal(downgradeEffort(null, 'claude-opus-4-6'), null);
});

test('downgradeEffort: model not in matrix returns requested unchanged', () => {
  assert.equal(downgradeEffort('high', 'claude-opus-4-8'), 'high');
});

test('downgradeEffort: caps above the model max (current 4-6 behaviour)', () => {
  // Baseline of current code: EFFORT_RANK ranks xhigh(4) above max(3),
  // so xhigh on opus-4-6 (cap 'max') downgrades to 'max'. See Task 3 note.
  assert.equal(downgradeEffort('xhigh', 'claude-opus-4-6'), 'max');
});

test('MODEL_MAX_EFFORT is Claude-only (no kimi/moonshot keys)', () => {
  for (const key of Object.keys(MODEL_MAX_EFFORT)) {
    assert.ok(key.startsWith('claude-'), `unexpected non-Claude matrix key: ${key}`);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails (module does not exist yet)**

Run: `node --test tests/plugin/provenance-model.test.mjs`
Expected: FAIL — `Cannot find module '.../provenance-model.mjs'`.

- [ ] **Step 3: Create the extracted module with the CURRENT (unchanged) logic**

Create `plugins/arckit-claude/hooks/provenance-model.mjs`:

```javascript
// Pure, side-effect-free model/effort helpers for provenance-stamp.mjs.
// Kept separate (like session-nudge.mjs vs session-learner.mjs) so they can be
// unit-tested by import without running the hook, which calls process.exit(0).
//
// CLAUDE-ONLY BY DESIGN: provenance-stamp.mjs is a Claude Code plugin hook. It
// never runs under Codex, OpenCode, or any non-Claude model. Do NOT add
// non-Claude ids (e.g. Kimi/Moonshot) to MODEL_MAX_EFFORT — it would be a no-op.

// ── Effort downgrade matrix ────────────────────────────────────────────
// Mirrors the Claude Code harness behaviour: effort levels not supported
// by the active model are silently downgraded to the highest supported.
export const EFFORT_RANK = { low: 0, medium: 1, high: 2, max: 3, xhigh: 4 };

export const MODEL_MAX_EFFORT = {
  'claude-opus-4-7': 'xhigh',
  'claude-opus-4-6': 'max',
  'claude-sonnet-4-6': 'high',
  'claude-haiku-4-5': 'medium',
};

export function downgradeEffort(requested, model) {
  if (!requested) return null;
  if (!model) return null;
  const cap = MODEL_MAX_EFFORT[model];
  if (!cap) return requested;
  if (EFFORT_RANK[requested] <= EFFORT_RANK[cap]) return requested;
  return cap;
}

// Detect model from existing footer ("AI Model: claude-opus-4-7" or "Model: ...").
// Trusts the model's self-report — that's what's in the human-authored footer
// today and is the only source of truth until upstream Claude Code exposes
// the active model to hooks (see arc-kit#407).
export function extractModelFromContent(content) {
  const m = content.match(/^\s*\*?\*?(?:AI )?Model\*?\*?:\s*`?([a-z0-9.-]+)`?\s*$/im);
  return m ? m[1].trim() : null;
}
```

- [ ] **Step 4: Wire `provenance-stamp.mjs` to import from the new module**

In `plugins/arckit-claude/hooks/provenance-stamp.mjs`, add the import after the `okf-frontmatter.mjs` import block (currently ends around line 66):

```javascript
import { extractModelFromContent, downgradeEffort } from './provenance-model.mjs';
```

Then delete the now-duplicated local definitions. Remove this block (currently lines 72-90):

```javascript
// ── Effort downgrade matrix ────────────────────────────────────────────
// Mirrors the Claude Code harness behaviour: effort levels not supported
// by the active model are silently downgraded to the highest supported.
const EFFORT_RANK = { low: 0, medium: 1, high: 2, max: 3, xhigh: 4 };
const MODEL_MAX_EFFORT = {
  'claude-opus-4-7': 'xhigh',
  'claude-opus-4-6': 'max',
  'claude-sonnet-4-6': 'high',
  'claude-haiku-4-5': 'medium',
};

function downgradeEffort(requested, model) {
  if (!requested) return null;
  if (!model) return null;
  const cap = MODEL_MAX_EFFORT[model];
  if (!cap) return requested;
  if (EFFORT_RANK[requested] <= EFFORT_RANK[cap]) return requested;
  return cap;
}
```

And remove this block (currently lines 123-130):

```javascript
// Detect model from existing footer ("AI Model: claude-opus-4-7" or "Model: ...").
// Trusts the model's self-report — that's what's in the human-authored footer
// today and is the only source of truth until upstream Claude Code exposes
// the active model to hooks (see arc-kit#407).
function extractModelFromContent(content) {
  const m = content.match(/^\s*\*?\*?(?:AI )?Model\*?\*?:\s*`?([a-z0-9.-]+)`?\s*$/im);
  return m ? m[1].trim() : null;
}
```

The two call sites (`extractModelFromContent(content)` at ~line 336 and `downgradeEffort(effortRequested, model)` at ~line 339) now resolve to the imported functions — leave them unchanged.

- [ ] **Step 5: Run the extracted-helper tests to verify they pass**

Run: `node --test tests/plugin/provenance-model.test.mjs`
Expected: PASS — all 9 tests green.

- [ ] **Step 6: Run the existing provenance regression suite to prove no behaviour change**

Run: `node --test tests/plugin/test_provenance_okf_frontmatter.mjs`
Expected: PASS — the hook still stamps provenance identically (it now imports the helpers instead of defining them).

- [ ] **Step 7: Commit**

```bash
git add plugins/arckit-claude/hooks/provenance-model.mjs \
        plugins/arckit-claude/hooks/provenance-stamp.mjs \
        tests/plugin/provenance-model.test.mjs
git commit -m "refactor(hooks): extract testable model/effort helpers into provenance-model.mjs"
```

---

## Task 2: Widen the model-id regex to accept provider-prefixed and suffixed ids

**Files:**
- Modify: `plugins/arckit-claude/hooks/provenance-model.mjs` (`extractModelFromContent` regex)
- Modify (test): `tests/plugin/provenance-model.test.mjs`

**Interfaces:**
- Produces: `extractModelFromContent` now returns ids containing `/`, `:`, `[`, `]` (e.g. `moonshotai/kimi-v3`, `claude-opus-4-8[1m]`, `kimi-k2-0711-preview`) instead of `null`.

- [ ] **Step 1: Update the test — flip the baseline `null` case and add the new expectations**

In `tests/plugin/provenance-model.test.mjs`, replace the `pre-fix baseline` test:

```javascript
// KNOWN BUG (fixed in Task 2): provider-prefixed / suffixed ids currently drop to null.
test('extractModelFromContent: slash id currently returns null (pre-fix baseline)', () => {
  assert.equal(extractModelFromContent('**Model**: moonshotai/kimi-v3\n'), null);
});
```

with:

```javascript
test('extractModelFromContent: provider-prefixed id (slash) parses', () => {
  assert.equal(extractModelFromContent('**Model**: moonshotai/kimi-v3\n'), 'moonshotai/kimi-v3');
});

test('extractModelFromContent: context-window suffix (brackets) parses', () => {
  assert.equal(extractModelFromContent('**AI Model**: claude-opus-4-8[1m]\n'), 'claude-opus-4-8[1m]');
});

test('extractModelFromContent: colon-versioned id parses', () => {
  assert.equal(extractModelFromContent('**Model**: kimi-k2-0711-preview\n'), 'kimi-k2-0711-preview');
});

test('extractModelFromContent: bedrock-style dotted prefix parses', () => {
  assert.equal(extractModelFromContent('**Model**: us.anthropic.claude-opus-4-8\n'), 'us.anthropic.claude-opus-4-8');
});
```

- [ ] **Step 2: Run the test to verify the new cases fail**

Run: `node --test tests/plugin/provenance-model.test.mjs`
Expected: FAIL — the `slash`, `brackets` cases return `null` (colon/dotted may already pass; slash and brackets will not).

- [ ] **Step 3: Widen the character class in the regex**

In `plugins/arckit-claude/hooks/provenance-model.mjs`, change the `extractModelFromContent` regex. Replace:

```javascript
  const m = content.match(/^\s*\*?\*?(?:AI )?Model\*?\*?:\s*`?([a-z0-9.-]+)`?\s*$/im);
```

with:

```javascript
  // Character class covers provider prefixes (moonshotai/kimi-v3), colon/dot
  // versioned ids (us.anthropic.claude-...), and bracketed context suffixes
  // (claude-opus-4-8[1m]). `-` is last, brackets are escaped.
  const m = content.match(/^\s*\*?\*?(?:AI )?Model\*?\*?:\s*`?([a-z0-9._:/\[\]-]+)`?\s*$/im);
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test tests/plugin/provenance-model.test.mjs`
Expected: PASS — all cases green, including slash, brackets, colon, and dotted prefixes.

- [ ] **Step 5: Commit**

```bash
git add plugins/arckit-claude/hooks/provenance-model.mjs tests/plugin/provenance-model.test.mjs
git commit -m "fix(hooks): parse provider-prefixed and bracket-suffixed model ids in provenance footer"
```

---

## Task 3: Add the `claude-opus-4-8` matrix row and mark the matrix Claude-only

**Files:**
- Modify: `plugins/arckit-claude/hooks/provenance-model.mjs` (`MODEL_MAX_EFFORT`)
- Modify (test): `tests/plugin/provenance-model.test.mjs`

**Interfaces:**
- Produces: `MODEL_MAX_EFFORT['claude-opus-4-8'] === 'xhigh'`.

**Honesty note (do not oversell this).** Because `xhigh` is the top `EFFORT_RANK` (4), a cap of `xhigh` never triggers a downgrade — behaviour is identical to the model being absent from the matrix. This row is documentation-as-code (it makes the supported model explicit), not a runtime fix. Add it as `'xhigh'`, never `'max'` (mapping Opus 4.8 to `'max'` would wrongly downgrade a requested `xhigh`).

**Open question flagged, deliberately NOT fixed here.** The code ranks `xhigh`(4) above `max`(3), but `CLAUDE.md` documents `max` as the deepest tier *above* `xhigh`, and says `xhigh` on Opus 4.6 should fall to `high` (the code produces `max`). Reconciling `EFFORT_RANK` with `CLAUDE.md` is a separate correctness question about real harness behaviour and is out of scope for the Kimi work — do not change `EFFORT_RANK` in this task. It is recorded here so it is not silently "fixed" wrong. Raise it as its own issue.

- [ ] **Step 1: Add the test**

In `tests/plugin/provenance-model.test.mjs`, add:

```javascript
test('downgradeEffort: opus-4-8 is capped at xhigh (never downgrades)', () => {
  assert.equal(downgradeEffort('xhigh', 'claude-opus-4-8'), 'xhigh');
  assert.equal(downgradeEffort('max', 'claude-opus-4-8'), 'max');
  assert.equal(downgradeEffort('high', 'claude-opus-4-8'), 'high');
});

test('MODEL_MAX_EFFORT includes claude-opus-4-8', () => {
  assert.equal(MODEL_MAX_EFFORT['claude-opus-4-8'], 'xhigh');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/plugin/provenance-model.test.mjs`
Expected: FAIL — `MODEL_MAX_EFFORT['claude-opus-4-8']` is `undefined` (the `xhigh`/`max`/`high` cases pass by accident via the not-in-matrix path, but the `MODEL_MAX_EFFORT includes...` assertion fails).

- [ ] **Step 3: Add the row and the Claude-only comment**

In `plugins/arckit-claude/hooks/provenance-model.mjs`, change:

```javascript
export const MODEL_MAX_EFFORT = {
  'claude-opus-4-7': 'xhigh',
  'claude-opus-4-6': 'max',
  'claude-sonnet-4-6': 'high',
  'claude-haiku-4-5': 'medium',
};
```

to:

```javascript
// Claude-only by design (see module header). `claude-opus-4-8`: 'xhigh' is the
// top rank, so it never downgrades — the row is for explicitness, not behaviour.
export const MODEL_MAX_EFFORT = {
  'claude-opus-4-8': 'xhigh',
  'claude-opus-4-7': 'xhigh',
  'claude-opus-4-6': 'max',
  'claude-sonnet-4-6': 'high',
  'claude-haiku-4-5': 'medium',
};
```

- [ ] **Step 4: Run the full Phase 1 suite to verify everything passes**

Run: `node --test tests/plugin/provenance-model.test.mjs tests/plugin/test_provenance_okf_frontmatter.mjs`
Expected: PASS — all green.

- [ ] **Step 5: Commit**

```bash
git add plugins/arckit-claude/hooks/provenance-model.mjs tests/plugin/provenance-model.test.mjs
git commit -m "chore(hooks): add claude-opus-4-8 to effort matrix; mark matrix Claude-only"
```

**Phase 1 is complete and shippable as a standalone PR here.** It has zero dependency on the Kimi model id and no user-facing behaviour change beyond correct provenance parsing.

---

## Task 4: Confirm the Kimi V3 facts (gate for Phase 2)

**Files:** none (research task; record findings in the PR description and inline config comments).

Knowledge cutoff is Jan 2026 and the Kimi line moves fast. Do **not** hardcode ids from memory. Confirm each item below before writing Tasks 5-6, and paste the confirmed values into the PR description so the config comments can cite them.

- [ ] **Step 1: Confirm the exact model id string(s)**

Determine, from Moonshot's current API docs and OpenRouter's model list:
- the **native** Moonshot id (historically `kimi-k2-*`, e.g. `kimi-k2-0711-preview`; confirm whether "V3" ships as `kimi-v3`, `kimi-k3`, or a dated `kimi-k2-*` successor), and
- the **OpenRouter** id (`moonshotai/kimi-*`).

Record both. The id that goes in the config must match the id users are told to expect in the `[AI_MODEL]` footer (Task 8).

- [ ] **Step 2: Confirm the provider endpoint and auth**

- Moonshot OpenAI-compatible base URL: global `.ai` (e.g. `https://api.moonshot.ai/v1`) vs `.cn`. Record both; do not hardcode one.
- API-key env var (expected `MOONSHOT_API_KEY`).
- Confirm both Codex (`config.toml` `[model_providers.*]`) and OpenCode (`provider` block in `opencode.json`) accept it as a generic OpenAI-compatible provider, and note the exact field names each expects (Codex: `name`/`base_url`/`env_key`/`wire_api`; OpenCode: check the `provider` schema at `https://opencode.ai/config.json`).

- [ ] **Step 3: Confirm context window and tool-calling reliability**

ArcKit commands are long (templates + citations) and every agent role leans on tool use (Read/Write/Bash/MCP). Confirm the context window is adequate and that function/tool-calling is reliable enough to not degrade agent roles. This gates any future *default* switch (it does not gate opt-in shipping).

- [ ] **Step 4: Decide the canonical footer string**

If Kimi does not reliably self-report its id into the `[AI_MODEL]` footer, document a fixed string for users to set manually (Task 8) rather than relying on self-report.

Record all findings in the PR description. Proceed to Task 5 once the id, endpoint, and env var are confirmed.

---

## Task 5: Ship a commented Moonshot provider + `kimi` profile in the Codex config

**Files:**
- Modify: `scripts/converter.py` — `generate_codex_config_toml()` (append before the file write at ~line 986)
- Modify (test): `tests/codex/test_codex_extension.py`

**Interfaces:**
- Consumes: confirmed id/base-url/env-var from Task 4.
- Produces: generated `extensions/arckit-codex/config.toml` contains a commented `[model_providers.moonshot]` block and a `kimi` profile, one uncomment away from use. Existing Codex users are unaffected (the block is inert until uncommented).

Codex agent roles inherit the user's model — there is no per-agent model to set. This task adds an opt-in, copy-paste-ready provider so a Codex user can select Kimi by uncommenting and setting `MOONSHOT_API_KEY`.

- [ ] **Step 1: Add the assertion to the Codex extension test**

In `tests/codex/test_codex_extension.py`, add a test that loads the generated `config.toml` text and asserts the provider block is present (as a commented block — assert on the literal comment lines):

```python
def test_codex_config_includes_commented_moonshot_provider(tmp_path):
    """The generated Codex config ships an opt-in, commented Moonshot/Kimi provider."""
    config_text = _generate_codex_config_text(tmp_path)  # existing helper that runs the generator
    assert "[model_providers.moonshot]" in config_text
    assert "MOONSHOT_API_KEY" in config_text
    assert "Kimi" in config_text
    # It must ship commented (opt-in) so existing users are unaffected.
    for line in config_text.splitlines():
        if "[model_providers.moonshot]" in line:
            assert line.lstrip().startswith("#"), "Moonshot provider must ship commented-out"
```

If `_generate_codex_config_text` does not exist, reuse the pattern the existing `tests/codex/test_codex_extension.py` uses to invoke `generate_codex_config_toml()` and read the output file. Match the file's existing helper style rather than inventing a new one.

- [ ] **Step 2: Run the test to verify it fails**

Run: `python -m pytest tests/codex/test_codex_extension.py::test_codex_config_includes_commented_moonshot_provider -v`
Expected: FAIL — `[model_providers.moonshot]` not found.

- [ ] **Step 3: Append the commented provider block in the generator**

In `scripts/converter.py`, inside `generate_codex_config_toml()`, at function-body indent (4 spaces) and **unconditionally** (outside the `if os.path.isdir(agents_dir):` agent-roles block), immediately before the `os.makedirs(os.path.dirname(output_path), ...)` write at line 986, append the block. Use the ids/URL confirmed in Task 4; the example below uses example ids to be replaced with the confirmed strings:

```python
    # ── Optional: Moonshot AI (Kimi V3) provider ────────────────────────
    # Opt-in. Codex agent roles inherit the model the user configures;
    # uncomment this block and set MOONSHOT_API_KEY to run ArcKit under
    # Kimi V3. Confirm the exact id/base_url against Moonshot's current
    # docs before use (see docs/plans Kimi V3 plan, Task 4).
    lines.append("# [model_providers.moonshot]")
    lines.append('# name = "Moonshot AI"')
    lines.append('# base_url = "https://api.moonshot.ai/v1"   # global; use .cn endpoint in China')
    lines.append('# env_key = "MOONSHOT_API_KEY"')
    lines.append('# wire_api = "chat"')
    lines.append("#")
    lines.append("# [profiles.kimi]")
    lines.append('# model = "kimi-v3"                          # confirm exact id (native vs moonshotai/kimi-*)')
    lines.append('# model_provider = "moonshot"')
    lines.append("")
```

- [ ] **Step 4: Regenerate and run the test to verify it passes**

Run: `python scripts/converter.py && python -m pytest tests/codex/test_codex_extension.py -v`
Expected: PASS — the new test and all existing Codex tests green.

- [ ] **Step 5: Commit**

```bash
git add scripts/converter.py tests/codex/test_codex_extension.py
git commit -m "feat(codex): ship opt-in commented Moonshot (Kimi V3) provider in generated config"
```

---

## Task 6: Add a disabled Moonshot provider entry to the OpenCode manifest

**Files:**
- Modify: `extensions/arckit-opencode/opencode.json`
- Modify: `extensions/arckit-opencode/README.md`
- Modify (test): `tests/opencode/test_opencode_extension.py`

**Interfaces:**
- Consumes: confirmed base-url/env-var/provider-schema from Task 4.
- Produces: `opencode.json` gains a `provider.moonshot` object with `"enabled": false`; the README documents enabling it.

`opencode.json` is strict JSON (no comments), so the provider ships as a real but **disabled** entry, matching the existing `"enabled": false` pattern used for `google-developer-knowledge` in the `mcp` block. Confirm the exact `provider` field names against the OpenCode schema in Task 4 before finalising.

- [ ] **Step 1: Add the assertion to the OpenCode test**

In `tests/opencode/test_opencode_extension.py`, add:

```python
def test_opencode_config_has_disabled_moonshot_provider():
    config = _load_opencode_config()  # existing helper used by test_opencode_config_is_valid_...
    provider = config.get("provider", {})
    assert "moonshot" in provider, "expected an opt-in Moonshot (Kimi) provider"
    assert provider["moonshot"].get("enabled") is False, "Moonshot provider must ship disabled (opt-in)"
```

Reuse whatever loader `test_opencode_config_is_valid_and_uses_remote_mcp_servers` already uses to read the JSON; do not add a new one.

- [ ] **Step 2: Run the test to verify it fails**

Run: `python -m pytest tests/opencode/test_opencode_extension.py::test_opencode_config_has_disabled_moonshot_provider -v`
Expected: FAIL — no `provider` key.

- [ ] **Step 3: Add the disabled provider entry to `opencode.json`**

Add a top-level `"provider"` block (sibling of `"mcp"`). Use the confirmed base-url/id from Task 4:

```json
  "provider": {
    "moonshot": {
      "enabled": false,
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.moonshot.ai/v1",
        "apiKey": "{env:MOONSHOT_API_KEY}"
      },
      "models": {
        "kimi-v3": {
          "name": "Kimi V3 (Moonshot AI)"
        }
      }
    }
  }
```

Confirm `npm`, `options`, and `models` field names against `https://opencode.ai/config.json` (Task 4) and adjust to the schema; keep `"enabled": false`.

- [ ] **Step 4: Document it in the OpenCode README**

In `extensions/arckit-opencode/README.md`, add a short "Running ArcKit under Kimi V3" subsection: set `MOONSHOT_API_KEY`, flip `provider.moonshot.enabled` to `true`, and confirm the model id. Keep prose free of em-dashes and tables (repo copy convention).

- [ ] **Step 5: Run the test to verify it passes**

Run: `python -m pytest tests/opencode/test_opencode_extension.py -v`
Expected: PASS — new test and existing OpenCode tests green.

- [ ] **Step 6: Commit**

```bash
git add extensions/arckit-opencode/opencode.json extensions/arckit-opencode/README.md tests/opencode/test_opencode_extension.py
git commit -m "feat(opencode): add opt-in disabled Moonshot (Kimi V3) provider + README"
```

---

## Task 7: Regenerate extensions and run the full pre-push checklist

**Files:** none authored; verification only.

- [ ] **Step 1: Regenerate all extensions**

Run: `python scripts/converter.py`
Expected: completes without error; `extensions/arckit-codex/config.toml` now contains the commented Moonshot block.

- [ ] **Step 2: Run the Node hook suite**

Run: `node --test tests/plugin/*.test.mjs tests/plugin/test_hook_utils.mjs`
Expected: PASS — including the new `provenance-model.test.mjs`.

- [ ] **Step 3: Run the Codex and OpenCode extension suites**

Run: `python -m pytest tests/codex/ tests/opencode/ -v`
Expected: PASS.

- [ ] **Step 4: Verify shared-asset parity**

Run: `python scripts/sync-shared-assets.py --check`
Expected: no drift reported.

- [ ] **Step 5: Lint markdown**

Run: `npx markdownlint-cli2 "**/*.md"`
Expected: no errors (fix with `npx markdownlint-cli2 --fix "**/*.md"` if needed, then re-run).

- [ ] **Step 6: Commit any regeneration side effects (if the working tree is dirty after Step 1)**

```bash
git status --short
# Stage only tracked, intended files — never `git add -A`.
```

---

## Task 8: Documentation and provenance-string alignment

**Files:**
- Modify: `CLAUDE.md` (effort paragraph, ~line 75)
- Modify: `README.md`, `docs/index.html` (if a supported-model matrix is advertised)
- Modify: `CHANGELOG.md`, `plugins/arckit-claude/CHANGELOG.md`

- [ ] **Step 1: Clarify effort-stripping for non-Claude targets in `CLAUDE.md`**

Add one sentence to the effort paragraph noting that non-Claude targets (Codex, OpenCode, and any model a user wires in such as Kimi V3) do not use Claude's `effort:` tiers — the converter strips `effort:` from command/agent frontmatter, and Codex agent `.toml` files carry neither `model` nor `effort`.

- [ ] **Step 2: Add a "Running ArcKit under Kimi V3" note**

In `CLAUDE.md` (Codex/OpenCode sections) and/or the extension READMEs, add a short note: Kimi V3 is a user-selected model for Codex/OpenCode only; the Claude Code plugin cannot run on Kimi by construction. Reference the opt-in provider blocks from Tasks 5-6 and the confirmed model id from Task 4.

- [ ] **Step 3: Align the footer `[AI_MODEL]` id string**

Ensure the canonical Kimi id documented for the `**Model**: [AI_MODEL]` footer matches the id used in the Codex/OpenCode configs (from Task 4). No template code change; this is a docs alignment so the footer, the config, and the widened regex (Task 2) all agree.

- [ ] **Step 4: Add CHANGELOG entries (both files)**

Add entries to `CHANGELOG.md` and `plugins/arckit-claude/CHANGELOG.md` describing: the provenance regex fix and `claude-opus-4-8` matrix row (Phase 1), and the opt-in Moonshot/Kimi V3 providers for Codex and OpenCode (Phase 2).

- [ ] **Step 5: Lint and commit**

```bash
npx markdownlint-cli2 "**/*.md"
git add CLAUDE.md README.md docs/index.html CHANGELOG.md plugins/arckit-claude/CHANGELOG.md
git commit -m "docs: document opt-in Kimi V3 for Codex/OpenCode and effort-strip behaviour"
```

---

## Explicit non-goals

- **Do NOT touch the Mistral Vibe generators** (`converter.py:1191-1193`, `convert_vibe_agents.py:143`). `mistral-large-2` is correct there; Kimi is not Vibe.
- **Do NOT add Kimi (or any non-Claude id) to `MODEL_MAX_EFFORT`.** The hook is Claude-only; it would be a no-op.
- **Do NOT default Codex/OpenCode to Kimi.** Ship opt-in (disabled/commented). Revisit a default only after Task 4's tool-calling check passes against a live `arckit init --ai codex` + `/arckit:*` run — capture that decision as an ADR (the issue carries the `architecture` label).
- **Do NOT change `EFFORT_RANK`.** The `max`-vs-`xhigh` ordering discrepancy with `CLAUDE.md` is real but is its own issue, out of scope here (see Task 3).
- **Do NOT hardcode a single Moonshot region or an unconfirmed model id.** Ship both `.ai`/`.cn` as documented options and use the id confirmed in Task 4.

## Self-review

- **Spec coverage:** every touchpoint in the corrected audit maps to a task — regex (Task 2), matrix row (Task 3), Codex provider (Task 5), OpenCode provider (Task 6), docs/footer (Task 8), regeneration/verification (Task 7), and the fact-check gate (Task 4). The extraction prerequisite (Task 1) that the original plan missed is now explicit.
- **Placeholder scan:** the only intentionally-deferred literals are the Kimi model id and Moonshot base URL, which are genuine external unknowns gated behind Task 4 and shipped commented/disabled; every code/edit step otherwise contains complete, copy-ready content.
- **Type/name consistency:** `extractModelFromContent`, `downgradeEffort`, `EFFORT_RANK`, `MODEL_MAX_EFFORT` are named identically across Tasks 1-3, the module, and the hook import. Test file is `tests/plugin/provenance-model.test.mjs` throughout (`.test.mjs` suffix for CI auto-discovery). Provider key is `moonshot` and profile is `kimi` consistently across Codex and OpenCode tasks.
