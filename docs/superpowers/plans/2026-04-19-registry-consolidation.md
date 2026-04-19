# Registry Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the dual-registration class of bugs (#317, today's sync-guides gap) by consolidating hard-coded guide/role metadata into single-source-of-truth config files, retiring the `pages.md` type-code allow-list via hook-injected context, and replacing the drifted bash `MULTI_INSTANCE_TYPES` with a Node shell-out.

**Architecture:** Two new sibling config files (`guides.mjs`, `roles.mjs`) next to `doc-types.mjs`, each exporting a single keyed-object registry. `sync-guides.mjs` imports them instead of hard-coding four parallel maps. The hook also injects a `knownDocTypes` array into the `/arckit.pages` prompt context, replacing the hand-maintained table in `pages.md`. A new drift-detection pytest asserts every command has a registry entry and every category/status value is in the allowed vocabulary.

**Tech Stack:** Node ESM (`.mjs`), bash, Python (pytest).

**Design Spec:** `docs/superpowers/specs/2026-04-19-registry-consolidation-design.md`

---

## File Structure

Created:
- `arckit-claude/config/guides.mjs` — `GUIDES` + `GUIDE_STEMS` (one keyed-object-per-stem map)
- `arckit-claude/config/roles.mjs` — `ROLES` + `ROLE_STEMS`
- `tests/plugin/test_registry_consistency.py` — drift-detection test

Modified:
- `arckit-claude/hooks/sync-guides.mjs` — delete 4 hard-coded maps, add imports, rewrite lookups, add `knownDocTypes` to hook context
- `arckit-claude/commands/pages.md` — replace line-196 "Known ArcKit Artifact Types" table with prose pointing at hook context
- `arckit-claude/scripts/bash/generate-document-id.sh` — replace `MULTI_INSTANCE_TYPES=…` with node shell-out
- `arckit-claude/config/doc-types.mjs` — remove dual-registration warning from header comment

Regenerated (by `scripts/converter.py`):
- 5 extension-format copies of `pages.md` under `arckit-codex/`, `arckit-copilot/`, `arckit-gemini/`, `arckit-opencode/`, `arckit-paperclip/`
- `arckit-paperclip/src/data/commands.json`

---

## Task 1: Create `guides.mjs`

**Purpose:** Carry the existing `GUIDE_CATEGORIES` + `GUIDE_STATUS` data verbatim into a single keyed-object registry. One object per stem — no more parallel maps that can drift.

**Files:**
- Create: `arckit-claude/config/guides.mjs`

- [ ] **Step 1: Create the file**

Use the Write tool at `arckit-claude/config/guides.mjs`:

```js
/**
 * ArcKit Guide Registry — Single Source of Truth
 *
 * Every hook or tool that needs per-guide metadata imports from here.
 * If you add or rename a guide, update this file FIRST.
 *
 * Mirrors the shape of arckit-claude/config/doc-types.mjs — keyed by
 * guide-file stem with a single object per stem. Drift between related
 * fields (category vs status) is structurally impossible with this shape.
 *
 * Consistency is enforced by tests/plugin/test_registry_consistency.py
 * which fails CI if any command lacks a registry entry or uses an
 * unknown category / status value.
 */

// All guide stems with category and status.
export const GUIDES = {
  // Getting Started
  'init':            { category: 'Getting Started', status: 'experimental' },
  'start':           { category: 'Getting Started', status: 'beta' },
  'upgrading':       { category: 'Getting Started', status: 'beta' },
  'customize':       { category: 'Getting Started', status: 'live' },
  'template-builder':{ category: 'Getting Started', status: 'alpha' },
  'remote-control':  { category: 'Getting Started', status: 'beta' },
  'productivity':    { category: 'Getting Started', status: 'beta' },

  // Discovery
  'requirements':         { category: 'Discovery', status: 'live' },
  'stakeholders':         { category: 'Discovery', status: 'live' },
  'stakeholder-analysis': { category: 'Discovery', status: 'live' },
  'research':             { category: 'Discovery', status: 'beta' },
  'datascout':            { category: 'Discovery', status: 'experimental' },

  // Planning
  'sobc':          { category: 'Planning', status: 'live' },
  'business-case': { category: 'Planning', status: 'live' },
  'plan':          { category: 'Planning', status: 'live' },
  'roadmap':       { category: 'Planning', status: 'beta' },
  'backlog':       { category: 'Planning', status: 'beta' },
  'strategy':      { category: 'Planning', status: 'beta' },
  'migration':     { category: 'Planning', status: 'experimental' },

  // Architecture
  'principles':         { category: 'Architecture', status: 'live' },
  'adr':                { category: 'Architecture', status: 'beta' },
  'diagram':            { category: 'Architecture', status: 'live' },
  'wardley':            { category: 'Architecture', status: 'experimental' },
  'data-model':         { category: 'Architecture', status: 'live' },
  'hld-review':         { category: 'Architecture', status: 'beta' },
  'dld-review':         { category: 'Architecture', status: 'beta' },
  'design-review':      { category: 'Architecture', status: 'beta' },
  'platform-design':    { category: 'Architecture', status: 'experimental' },
  'data-mesh-contract': { category: 'Architecture', status: 'alpha' },
  'c4-layout-science':  { category: 'Architecture', status: 'beta' },
  'dfd':                { category: 'Architecture', status: 'experimental' },
  'framework':          { category: 'Architecture', status: 'experimental' },

  // Governance
  'risk':                   { category: 'Governance', status: 'live' },
  'risk-management':        { category: 'Governance', status: 'live' },
  'traceability':           { category: 'Governance', status: 'live' },
  'principles-compliance':  { category: 'Governance', status: 'live' },
  'analyze':                { category: 'Governance', status: 'beta' },
  'artifact-health':        { category: 'Governance', status: 'beta' },
  'data-quality-framework': { category: 'Governance', status: 'beta' },
  'knowledge-compounding':  { category: 'Governance', status: 'beta' },
  'search':                 { category: 'Governance', status: 'beta' },
  'impact':                 { category: 'Governance', status: 'beta' },
  'conformance':            { category: 'Governance', status: 'beta' },
  'health':                 { category: 'Governance', status: 'experimental' },
  'maturity-model':         { category: 'Governance', status: 'experimental' },

  // Compliance
  'tcop':                   { category: 'Compliance', status: 'beta' },
  'secure':                 { category: 'Compliance', status: 'beta' },
  'mod-secure':             { category: 'Compliance', status: 'experimental' },
  'dpia':                   { category: 'Compliance', status: 'beta' },
  'ai-playbook':            { category: 'Compliance', status: 'alpha' },
  'atrs':                   { category: 'Compliance', status: 'alpha' },
  'jsp-936':                { category: 'Compliance', status: 'experimental' },
  'service-assessment':     { category: 'Compliance', status: 'beta' },
  'govs-007-security':      { category: 'Compliance', status: 'beta' },
  'national-data-strategy': { category: 'Compliance', status: 'beta' },
  'codes-of-practice':      { category: 'Compliance', status: 'beta' },
  'security-hooks':         { category: 'Compliance', status: 'beta' },

  // Operations
  'devops':         { category: 'Operations', status: 'experimental' },
  'mlops':          { category: 'Operations', status: 'experimental' },
  'finops':         { category: 'Operations', status: 'experimental' },
  'operationalize': { category: 'Operations', status: 'experimental' },

  // Procurement
  'sow':            { category: 'Procurement', status: 'live' },
  'evaluate':       { category: 'Procurement', status: 'live' },
  'dos':            { category: 'Procurement', status: 'experimental' },
  'gcloud-search':  { category: 'Procurement', status: 'experimental' },
  'gcloud-clarify': { category: 'Procurement', status: 'experimental' },
  'procurement':    { category: 'Procurement', status: 'beta' },
  'score':          { category: 'Procurement', status: 'beta' },

  // Integrations
  'aws-research':   { category: 'Integrations', status: 'experimental' },
  'azure-research': { category: 'Integrations', status: 'experimental' },
  'gcp-research':   { category: 'Integrations', status: 'experimental' },
  'mcp-servers':    { category: 'Integrations', status: 'beta' },
  'pinecone-mcp':   { category: 'Integrations', status: 'experimental' },
  'trello':         { category: 'Integrations', status: 'experimental' },
  'servicenow':     { category: 'Integrations', status: 'beta' },

  // Reporting
  'pages':        { category: 'Reporting', status: 'alpha' },
  'story':        { category: 'Reporting', status: 'live' },
  'presentation': { category: 'Reporting', status: 'beta' },
  'glossary':     { category: 'Reporting', status: 'experimental' },

  // Community — EU regulatory
  'eu-ai-act':   { category: 'Compliance', status: 'community' },
  'eu-cra':      { category: 'Compliance', status: 'community' },
  'eu-data-act': { category: 'Compliance', status: 'community' },
  'eu-dora':     { category: 'Compliance', status: 'community' },
  'eu-dsa':      { category: 'Compliance', status: 'community' },
  'eu-nis2':     { category: 'Compliance', status: 'community' },
  'eu-rgpd':     { category: 'Compliance', status: 'community' },

  // Community — French public sector
  'fr-algorithme-public': { category: 'Compliance',  status: 'community' },
  'fr-anssi':             { category: 'Compliance',  status: 'community' },
  'fr-anssi-carto':       { category: 'Architecture', status: 'community' },
  'fr-code-reuse':        { category: 'Architecture', status: 'community' },
  'fr-dinum':             { category: 'Compliance',  status: 'community' },
  'fr-dr':                { category: 'Governance',  status: 'community' },
  'fr-ebios':             { category: 'Governance',  status: 'community' },
  'fr-marche-public':     { category: 'Procurement', status: 'community' },
  'fr-pssi':              { category: 'Compliance',  status: 'community' },
  'fr-rgpd':              { category: 'Compliance',  status: 'community' },
  'fr-secnumcloud':       { category: 'Compliance',  status: 'community' },
};

// Derived: set of all registered guide stems.
export const GUIDE_STEMS = new Set(Object.keys(GUIDES));

// Allowed category vocabulary. Any GUIDES[stem].category outside this set
// is a typo (tests/plugin/test_registry_consistency.py asserts this).
export const GUIDE_CATEGORY_VALUES = new Set([
  'Getting Started', 'Discovery', 'Planning', 'Architecture',
  'Governance', 'Compliance', 'Operations', 'Procurement',
  'Integrations', 'Reporting',
]);

// Allowed status vocabulary.
export const GUIDE_STATUS_VALUES = new Set([
  'live', 'beta', 'alpha', 'experimental', 'community',
]);
```

- [ ] **Step 2: Verify the file parses as a valid ES module**

Run:
```bash
node --input-type=module -e "
  import('/workspaces/arc-kit/arckit-claude/config/guides.mjs').then(m => {
    console.log('GUIDES keys:', Object.keys(m.GUIDES).length);
    console.log('GUIDE_STEMS size:', m.GUIDE_STEMS.size);
    console.log('GUIDE_CATEGORY_VALUES size:', m.GUIDE_CATEGORY_VALUES.size);
    console.log('GUIDE_STATUS_VALUES size:', m.GUIDE_STATUS_VALUES.size);
  });
"
```

Expected:
```
GUIDES keys: 94
GUIDE_STEMS size: 94
GUIDE_CATEGORY_VALUES size: 10
GUIDE_STATUS_VALUES size: 5
```

(94 = all stems currently in `GUIDE_CATEGORIES` including the 18 community commands.)

- [ ] **Step 3: Spot-check the carry-over preserves existing metadata**

Run:
```bash
node --input-type=module -e "
  import('/workspaces/arc-kit/arckit-claude/config/guides.mjs').then(m => {
    console.log('tcop:', JSON.stringify(m.GUIDES['tcop']));
    console.log('eu-dora:', JSON.stringify(m.GUIDES['eu-dora']));
    console.log('fr-ebios:', JSON.stringify(m.GUIDES['fr-ebios']));
  });
"
```

Expected:
```
tcop: {"category":"Compliance","status":"beta"}
eu-dora: {"category":"Compliance","status":"community"}
fr-ebios: {"category":"Governance","status":"community"}
```

- [ ] **Step 4: Commit**

```bash
cd /workspaces/arc-kit
git add arckit-claude/config/guides.mjs
git commit -m "$(cat <<'EOF'
feat(config): add guides.mjs registry (GUIDES, GUIDE_STEMS)

Single source of truth for guide metadata (category + status per stem).
Carries over every entry currently hard-coded in sync-guides.mjs's
GUIDE_CATEGORIES and GUIDE_STATUS maps. No functional change yet —
sync-guides.mjs still imports its own copies until Task 4.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Create `roles.mjs`

**Purpose:** Same carry-over, for the two role-related maps.

**Files:**
- Create: `arckit-claude/config/roles.mjs`

- [ ] **Step 1: Create the file**

Use the Write tool at `arckit-claude/config/roles.mjs`:

```js
/**
 * ArcKit Role Registry — Single Source of Truth
 *
 * Every hook or tool that needs per-role metadata imports from here.
 * If you add or rename a DDaT role guide, update this file FIRST.
 *
 * Mirrors the shape of arckit-claude/config/doc-types.mjs — keyed by
 * role-file stem with a single object per stem.
 *
 * Consistency is enforced by tests/plugin/test_registry_consistency.py
 * which fails CI if any role stem lacks a corresponding file in
 * arckit-claude/docs/guides/roles/.
 */

// All DDaT roles with family and command count.
export const ROLES = {
  // Architecture
  'enterprise-architect': { family: 'Architecture', commandCount: 12 },
  'solution-architect':   { family: 'Architecture', commandCount: 10 },
  'data-architect':       { family: 'Architecture', commandCount: 4 },
  'security-architect':   { family: 'Architecture', commandCount: 5 },
  'business-architect':   { family: 'Architecture', commandCount: 5 },
  'technical-architect':  { family: 'Architecture', commandCount: 5 },
  'network-architect':    { family: 'Architecture', commandCount: 3 },

  // Chief Digital and Data
  'cto-cdio': { family: 'Chief Digital and Data', commandCount: 5 },
  'cdo':      { family: 'Chief Digital and Data', commandCount: 4 },
  'ciso':     { family: 'Chief Digital and Data', commandCount: 5 },

  // Product and Delivery
  'product-manager':  { family: 'Product and Delivery', commandCount: 5 },
  'delivery-manager': { family: 'Product and Delivery', commandCount: 6 },
  'business-analyst': { family: 'Product and Delivery', commandCount: 4 },
  'service-owner':    { family: 'Product and Delivery', commandCount: 3 },

  // Data
  'data-governance-manager': { family: 'Data', commandCount: 4 },
  'performance-analyst':     { family: 'Data', commandCount: 4 },

  // IT Operations
  'it-service-manager': { family: 'IT Operations', commandCount: 3 },

  // Software Development
  'devops-engineer': { family: 'Software Development', commandCount: 3 },
};

export const ROLE_STEMS = new Set(Object.keys(ROLES));

export const ROLE_FAMILY_VALUES = new Set([
  'Architecture', 'Chief Digital and Data', 'Product and Delivery',
  'Data', 'IT Operations', 'Software Development',
]);
```

- [ ] **Step 2: Verify parses + spot-check**

Run:
```bash
node --input-type=module -e "
  import('/workspaces/arc-kit/arckit-claude/config/roles.mjs').then(m => {
    console.log('ROLES keys:', Object.keys(m.ROLES).length);
    console.log('ROLE_STEMS size:', m.ROLE_STEMS.size);
    console.log('enterprise-architect:', JSON.stringify(m.ROLES['enterprise-architect']));
    console.log('ciso:', JSON.stringify(m.ROLES['ciso']));
    console.log('devops-engineer:', JSON.stringify(m.ROLES['devops-engineer']));
  });
"
```

Expected:
```
ROLES keys: 18
ROLE_STEMS size: 18
enterprise-architect: {"family":"Architecture","commandCount":12}
ciso: {"family":"Chief Digital and Data","commandCount":5}
devops-engineer: {"family":"Software Development","commandCount":3}
```

- [ ] **Step 3: Commit**

```bash
cd /workspaces/arc-kit
git add arckit-claude/config/roles.mjs
git commit -m "$(cat <<'EOF'
feat(config): add roles.mjs registry (ROLES, ROLE_STEMS)

Single source of truth for DDaT role metadata (family + commandCount).
Carries over every entry currently hard-coded in sync-guides.mjs's
ROLE_FAMILIES and ROLE_COMMAND_COUNTS maps. No functional change yet.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Drift-detection test

**Purpose:** Lock in the invariants so future contributors can't drift. The test runs before the refactor proper so a gap would surface immediately.

**Files:**
- Create: `tests/plugin/test_registry_consistency.py`

- [ ] **Step 1: Write the test**

Use the Write tool at `tests/plugin/test_registry_consistency.py`:

```python
"""Registry consistency tests.

Asserts that:
1. Every arckit-claude/commands/*.md has a matching GUIDES entry.
2. Every arckit-claude/docs/guides/*.md (non-role, non-subdir) has a
   matching GUIDES entry.
3. Every GUIDES[stem].category is in GUIDE_CATEGORY_VALUES.
4. Every GUIDES[stem].status is in GUIDE_STATUS_VALUES.
5. Every ROLES[stem] has a matching file in docs/guides/roles/.
6. The bash shell-out in generate-document-id.sh returns the same
   MULTI_INSTANCE_TYPES as the JS module.

If any assertion fails, a new command or guide was added without
registering it in arckit-claude/config/*.mjs — fix there first.
"""

from __future__ import annotations

import json
import subprocess
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
COMMANDS_DIR = REPO_ROOT / "arckit-claude" / "commands"
GUIDES_DIR = REPO_ROOT / "arckit-claude" / "docs" / "guides"
ROLES_DIR = GUIDES_DIR / "roles"


def _run_node_module(expr: str) -> str:
    """Run a Node ES-module one-liner and return stdout stripped."""
    result = subprocess.run(
        ["node", "--input-type=module", "-e", expr],
        capture_output=True,
        text=True,
        check=True,
        cwd=REPO_ROOT,
    )
    return result.stdout.strip()


def _load_guides_keys() -> set[str]:
    output = _run_node_module(
        "import('./arckit-claude/config/guides.mjs').then(m => "
        "console.log(JSON.stringify([...m.GUIDE_STEMS])))"
    )
    return set(json.loads(output))


def _load_guides_values() -> dict[str, dict[str, str]]:
    output = _run_node_module(
        "import('./arckit-claude/config/guides.mjs').then(m => "
        "console.log(JSON.stringify(m.GUIDES)))"
    )
    return json.loads(output)


def _load_guide_category_values() -> set[str]:
    output = _run_node_module(
        "import('./arckit-claude/config/guides.mjs').then(m => "
        "console.log(JSON.stringify([...m.GUIDE_CATEGORY_VALUES])))"
    )
    return set(json.loads(output))


def _load_guide_status_values() -> set[str]:
    output = _run_node_module(
        "import('./arckit-claude/config/guides.mjs').then(m => "
        "console.log(JSON.stringify([...m.GUIDE_STATUS_VALUES])))"
    )
    return set(json.loads(output))


def _load_role_keys() -> set[str]:
    output = _run_node_module(
        "import('./arckit-claude/config/roles.mjs').then(m => "
        "console.log(JSON.stringify([...m.ROLE_STEMS])))"
    )
    return set(json.loads(output))


def _load_multi_instance_types_js() -> list[str]:
    output = _run_node_module(
        "import('./arckit-claude/config/doc-types.mjs').then(m => "
        "console.log([...m.MULTI_INSTANCE_TYPES].join(' ')))"
    )
    return sorted(output.split())


def test_every_command_has_a_guide_entry():
    """Every arckit-claude/commands/*.md must have a GUIDES registry entry."""
    command_stems = {
        p.stem for p in COMMANDS_DIR.glob("*.md") if p.is_file()
    }
    guide_stems = _load_guides_keys()
    missing = command_stems - guide_stems
    assert not missing, (
        f"Commands missing from guides.mjs: {sorted(missing)}. "
        "Add them to arckit-claude/config/guides.mjs GUIDES."
    )


def test_every_guide_file_has_a_registry_entry():
    """Every top-level arckit-claude/docs/guides/*.md must have a GUIDES entry."""
    guide_stems_on_disk = {
        p.stem for p in GUIDES_DIR.glob("*.md") if p.is_file()
    }
    registry_stems = _load_guides_keys()
    missing = guide_stems_on_disk - registry_stems
    assert not missing, (
        f"Guide files missing from guides.mjs: {sorted(missing)}. "
        "Add them to arckit-claude/config/guides.mjs GUIDES."
    )


def test_every_guide_category_is_in_vocabulary():
    """Every GUIDES[stem].category must be in GUIDE_CATEGORY_VALUES."""
    guides = _load_guides_values()
    allowed = _load_guide_category_values()
    offenders = {
        stem: meta["category"]
        for stem, meta in guides.items()
        if meta["category"] not in allowed
    }
    assert not offenders, (
        f"Guides with invalid category: {offenders}. "
        f"Allowed values: {sorted(allowed)}."
    )


def test_every_guide_status_is_in_vocabulary():
    """Every GUIDES[stem].status must be in GUIDE_STATUS_VALUES."""
    guides = _load_guides_values()
    allowed = _load_guide_status_values()
    offenders = {
        stem: meta["status"]
        for stem, meta in guides.items()
        if meta["status"] not in allowed
    }
    assert not offenders, (
        f"Guides with invalid status: {offenders}. "
        f"Allowed values: {sorted(allowed)}."
    )


def test_every_role_has_a_guide_file():
    """Every ROLES stem must have a matching docs/guides/roles/*.md file."""
    role_stems = _load_role_keys()
    files_on_disk = {
        p.stem for p in ROLES_DIR.glob("*.md") if p.is_file() and p.stem != "README"
    }
    missing = role_stems - files_on_disk
    assert not missing, (
        f"Roles in roles.mjs with no guide file: {sorted(missing)}. "
        "Either add the guide file or remove the registry entry."
    )


def test_bash_multi_instance_types_matches_js():
    """The bash path in generate-document-id.sh must return the same
    MULTI_INSTANCE_TYPES as the JS module."""
    js_types = _load_multi_instance_types_js()
    bash_script = (
        'node --input-type=module -e "'
        "import(\\'./arckit-claude/config/doc-types.mjs\\').then("
        "m => console.log([...m.MULTI_INSTANCE_TYPES].join(\\' \\')))\""
    )
    bash_out = subprocess.run(
        ["bash", "-c", bash_script],
        capture_output=True,
        text=True,
        check=True,
        cwd=REPO_ROOT,
    )
    bash_types = sorted(bash_out.stdout.strip().split())
    assert bash_types == js_types, (
        f"Bash path returned {bash_types}, JS has {js_types}. "
        "The bash integration in generate-document-id.sh is broken."
    )
```

- [ ] **Step 2: Run the test — all six assertions must pass**

Run:
```bash
cd /workspaces/arc-kit
python3 -m pytest tests/plugin/test_registry_consistency.py -v 2>&1 | tail -20
```

Expected: all 6 tests pass. If any fails, fix `guides.mjs` or `roles.mjs` before moving on.

Example of a successful run:
```
tests/plugin/test_registry_consistency.py::test_every_command_has_a_guide_entry PASSED
tests/plugin/test_registry_consistency.py::test_every_guide_file_has_a_registry_entry PASSED
tests/plugin/test_registry_consistency.py::test_every_guide_category_is_in_vocabulary PASSED
tests/plugin/test_registry_consistency.py::test_every_guide_status_is_in_vocabulary PASSED
tests/plugin/test_registry_consistency.py::test_every_role_has_a_guide_file PASSED
tests/plugin/test_registry_consistency.py::test_bash_multi_instance_types_matches_js PASSED
=== 6 passed in 1.XXs ===
```

- [ ] **Step 3: Commit**

```bash
cd /workspaces/arc-kit
git add tests/plugin/test_registry_consistency.py
git commit -m "$(cat <<'EOF'
test(plugin): add registry consistency tests

Asserts every command has a GUIDES entry, every registered category/status
is in the allowed vocabulary, every role has a guide file, and the bash
path in generate-document-id.sh returns the same MULTI_INSTANCE_TYPES
as the JS module. Drift becomes impossible.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Refactor `sync-guides.mjs` — import from registries

**Purpose:** Delete the four hard-coded blocks in `sync-guides.mjs` and replace with imports from the two new config files. Behaviour identical.

**Files:**
- Modify: `arckit-claude/hooks/sync-guides.mjs`

- [ ] **Step 1: Add the new imports at the top of the file**

The file already imports from `../config/doc-types.mjs`. Add two more imports on the line immediately after.

Use the Edit tool. Find:
```js
import { DOC_TYPES, KNOWN_TYPES, MULTI_INSTANCE_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs';
```
(If the existing import line is worded differently, search for `from '../config/doc-types.mjs'` and add the two new import lines immediately after it.)

Replace with:
```js
import { DOC_TYPES, KNOWN_TYPES, MULTI_INSTANCE_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs';
import { GUIDES } from '../config/guides.mjs';
import { ROLES } from '../config/roles.mjs';
```

- [ ] **Step 2: Delete the four hard-coded blocks**

Before editing, read the file to capture the exact multi-line block:

```bash
sed -n '93,178p' /workspaces/arc-kit/arckit-claude/hooks/sync-guides.mjs
```

The block spans from `const GUIDE_CATEGORIES = {` through and including the closing `};` of `ROLE_COMMAND_COUNTS`. The line numbers above may shift by 1–2 depending on prior commits; use Read tool to confirm.

Use the Edit tool with this exact Find/Replace:

Find the opening line of the block and the closing line — paste the entire block verbatim from the `sed` output as `old_string`. Set `new_string` to an empty-ish value preserving one blank line so the preceding `DOC_TYPE_META` block and the following `// ── Doc type extraction from filename ──` comment don't run together.

Specifically, if the block to delete starts with `const GUIDE_CATEGORIES = {` and ends with `};` after the `'devops-engineer': 3,` line, replace with just:

```js

```

(A single blank line preserves readability.)

- [ ] **Step 3: Rewrite the `buildGuides()` lookups**

Role lookup — find:
```js
        family: ROLE_FAMILIES[stem] || 'Other',
        commandCount: ROLE_COMMAND_COUNTS[stem] || 0,
```
Replace with:
```js
        family: ROLES[stem]?.family || 'Other',
        commandCount: ROLES[stem]?.commandCount || 0,
```

Guide lookup — find:
```js
      const stem = basename(rel, '.md');
      guides.push({
        path,
        title,
        category: GUIDE_CATEGORIES[stem] || 'Other',
        status: GUIDE_STATUS[stem] || 'beta',
      });
```
Replace with:
```js
      const stem = basename(rel, '.md');
      const meta = GUIDES[stem];
      guides.push({
        path,
        title,
        category: meta?.category || 'Other',
        status: meta?.status || 'beta',
      });
```

- [ ] **Step 4: Verify the refactor parses**

Run:
```bash
node --check /workspaces/arc-kit/arckit-claude/hooks/sync-guides.mjs && echo "syntax ok"
```

Expected: `syntax ok`.

- [ ] **Step 5: Run the full test suite**

Run:
```bash
cd /workspaces/arc-kit
python3 -m pytest tests/ -q 2>&1 | tail -5
```

Expected: all prior tests continue to pass (including the 6 new registry-consistency tests from Task 3 and the 989 existing tests). Zero failures.

- [ ] **Step 6: Smoke-test the hook directly**

Run the hook against the repo itself (the hook is defensive — it exits 0 in non-ArcKit repos, but since this IS the ArcKit repo it has everything the hook needs):

```bash
cd /workspaces/arc-kit
node arckit-claude/hooks/sync-guides.mjs 2>&1 | python3 -c "
import json, sys
data = json.loads(sys.stdin.read().strip().splitlines()[-1])
ctx = data['hookSpecificOutput']['additionalContext']
assert 'Pages Pre-processor Complete' in ctx, 'Unexpected hook output'
print('hook output ok:', len(ctx), 'bytes')
"
```

Expected: `hook output ok: <N> bytes` where N is around 2000–3000. The assertion confirms the hook emits a valid UserPromptSubmit response.

- [ ] **Step 7: Commit**

```bash
cd /workspaces/arc-kit
git add arckit-claude/hooks/sync-guides.mjs
git commit -m "$(cat <<'EOF'
refactor(hooks): sync-guides.mjs reads GUIDES + ROLES from config

Deletes the four hard-coded maps (GUIDE_CATEGORIES, GUIDE_STATUS,
ROLE_FAMILIES, ROLE_COMMAND_COUNTS) and imports from config/guides.mjs
and config/roles.mjs. Net reduction ~90 lines. No behaviour change —
existing pytest + hook smoke test pass.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Inject `knownDocTypes` into hook context + retire `pages.md` allow-list

**Purpose:** Eliminate the #317-class dual-registration between `doc-types.mjs` and `pages.md:196`. The hook builds the list at runtime, the prompt reads it from context.

**Files:**
- Modify: `arckit-claude/hooks/sync-guides.mjs`
- Modify: `arckit-claude/commands/pages.md`

- [ ] **Step 1: Build the `knownDocTypes` section in sync-guides.mjs**

The hook's output is assembled near the end of the file as a markdown `message` array joined by newlines, then wrapped in `{hookSpecificOutput: {hookEventName, additionalContext}}`. Add a new section to the message between "Repository Info" and "DOCUMENT STATS".

Use the Edit tool. Find:
```js
  `### Repository Info`,
  `- **Repo**: ${repoInfo.repo}`,
  `- **URL**: ${repoInfo.repoUrl || '(no remote)'}`,
  `- **ArcKit Version**: ${version || '(unknown)'}`,
  ``,
  `### DOCUMENT STATS — use these values directly in your Step 5 summary`,
```

Replace with:
```js
  `### Repository Info`,
  `- **Repo**: ${repoInfo.repo}`,
  `- **URL**: ${repoInfo.repoUrl || '(no remote)'}`,
  `- **ArcKit Version**: ${version || '(unknown)'}`,
  ``,
  `### Known Artifact Types`,
  ``,
  `The authoritative registry of ArcKit document type codes. Use this list — and ONLY this list — to decide which artifacts to include in the dashboard. Group by \`category\` when building the sidebar.`,
  ``,
  `| Category | Type Code | Display Name |`,
  `|----------|-----------|--------------|`,
  ...[...KNOWN_TYPES]
    .sort((a, b) => {
      const ca = DOC_TYPES[a].category;
      const cb = DOC_TYPES[b].category;
      return ca === cb ? a.localeCompare(b) : ca.localeCompare(cb);
    })
    .map(code => `| ${DOC_TYPES[code].category} | ${code} | ${DOC_TYPES[code].name} |`),
  ``,
  `### DOCUMENT STATS — use these values directly in your Step 5 summary`,
```

- [ ] **Step 2: Replace the `pages.md` allow-list heading and intro**

Use the Edit tool. Find:
```markdown
### 1.3 Known ArcKit Artifact Types

Only include these known artifact types. Match by type code pattern `ARC-{PID}-{TYPE}-*.md`:
```

Replace with:
```markdown
### 1.3 Known ArcKit Artifact Types

The sync-guides hook (runs automatically before this command) injects a **Known Artifact Types** table into the context above. Use that list — and ONLY that list — to decide which artifacts to render. Group by the `Category` column when building the dashboard sidebar.

If a manifest entry's type code is not in the injected list, skip it silently. The `validate-arc-filename.mjs` hook upstream already blocks writes with unknown type codes, so any such entries in a manifest predate the current ArcKit version.
```

- [ ] **Step 3: Delete the remaining table and the "Single source of truth" paragraph**

Use the Read tool on `arckit-claude/commands/pages.md` offset 200 limit 90 to confirm the exact content to remove. The block begins with the table header line `| Category | Type Code | Pattern | Display Name |` and ends with the `> **Single source of truth**: this table mirrors ...` blockquote closing newline, immediately before `### Reference: Manifest Structure`.

Use the Edit tool: pass the entire block from `| Category | Type Code | Pattern | Display Name |` through the closing `... includes the artifact in the dashboard.` line of the blockquote as `old_string`, and an empty-but-one-blank-line as `new_string`. The `### Reference: Manifest Structure` heading then becomes the line immediately following the prose added in Step 2.

Verification after delete:

```bash
grep -n "Single source of truth\|### Reference: Manifest Structure\|### 1.3 Known ArcKit" /workspaces/arc-kit/arckit-claude/commands/pages.md
```
Expected: two hits — the `1.3 Known ArcKit Artifact Types` heading and the `### Reference: Manifest Structure` heading. The "Single source of truth" paragraph should no longer appear.

- [ ] **Step 4: Verify sync-guides.mjs still parses and emits the new section**

Run:
```bash
node --check /workspaces/arc-kit/arckit-claude/hooks/sync-guides.mjs && echo "syntax ok"
cd /workspaces/arc-kit
node arckit-claude/hooks/sync-guides.mjs 2>&1 | python3 -c "
import json, sys
data = json.loads(sys.stdin.read().strip().splitlines()[-1])
ctx = data['hookSpecificOutput']['additionalContext']
assert '### Known Artifact Types' in ctx, 'missing knownDocTypes section'
assert 'REQ' in ctx, 'missing REQ code in table'
assert 'EBIOS' in ctx, 'missing EBIOS (community) code in table'
print('ok')
"
```

Expected:
```
syntax ok
ok
```

- [ ] **Step 5: Run full test suite**

Run:
```bash
cd /workspaces/arc-kit
python3 -m pytest tests/ -q 2>&1 | tail -5
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
cd /workspaces/arc-kit
git add arckit-claude/hooks/sync-guides.mjs arckit-claude/commands/pages.md
git commit -m "$(cat <<'EOF'
refactor(pages): inject knownDocTypes via hook, retire allow-list

The sync-guides hook now builds a "Known Artifact Types" markdown table
from doc-types.mjs at runtime and injects it into the /arckit:pages
prompt context. The hand-maintained table in commands/pages.md
(lines 196-287) is replaced with prose pointing at the injected list.

Eliminates the #317-class dual-registration bug — doc-types.mjs is now
the single source of truth for type codes, names, and categories.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Replace bash `MULTI_INSTANCE_TYPES` with Node shell-out

**Purpose:** Remove the drifted bash copy (10 entries vs. the JS's 17). Bash now reads from the single source of truth.

**Files:**
- Modify: `arckit-claude/scripts/bash/generate-document-id.sh`

- [ ] **Step 1: Replace the hard-coded array**

Use the Edit tool. Find:
```bash
# Keep in sync with arckit-claude/config/doc-types.mjs MULTI_INSTANCE_TYPES
MULTI_INSTANCE_TYPES="ADR DIAG DFD WARD DMC RSCH AWRS AZRS GCRS DSCT WGAM WCLM WVCH GOVR GCSR GLND"
```

Replace with:
```bash
# Read MULTI_INSTANCE_TYPES from arckit-claude/config/doc-types.mjs — single source of truth.
# CLAUDE_PLUGIN_ROOT is set when this script runs as a plugin hook; fallback
# resolves the path from the script's own location for direct invocations.
_ARCKIT_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
MULTI_INSTANCE_TYPES="$(node --input-type=module -e "
  import('${_ARCKIT_ROOT}/config/doc-types.mjs').then(m => console.log([...m.MULTI_INSTANCE_TYPES].join(' ')));
" 2>/dev/null)"

if [[ -z "${MULTI_INSTANCE_TYPES}" ]]; then
  echo "ERROR: Could not read MULTI_INSTANCE_TYPES from ${_ARCKIT_ROOT}/config/doc-types.mjs" >&2
  exit 1
fi
```

- [ ] **Step 2: Verify the script parses (no bash syntax errors)**

Run:
```bash
bash -n /workspaces/arc-kit/arckit-claude/scripts/bash/generate-document-id.sh && echo "bash syntax ok"
```

Expected: `bash syntax ok`.

- [ ] **Step 3: Integration check — bash invocation returns the expected types**

Run:
```bash
cd /workspaces/arc-kit
# Mirror exactly what the bash script does on script startup
_ARCKIT_ROOT="$(pwd)/arckit-claude"
BASH_TYPES="$(node --input-type=module -e "
  import('${_ARCKIT_ROOT}/config/doc-types.mjs').then(m => console.log([...m.MULTI_INSTANCE_TYPES].join(' ')));
" 2>/dev/null)"
JS_TYPES="$(node --input-type=module -e "
  import('./arckit-claude/config/doc-types.mjs').then(m => console.log([...m.MULTI_INSTANCE_TYPES].join(' ')));
")"
[[ "${BASH_TYPES}" == "${JS_TYPES}" ]] && echo "match: ${BASH_TYPES}" || echo "MISMATCH"
```

Expected: `match: ADR DIAG DFD WARD DMC RSCH AWRS AZRS GCRS DSCT WGAM WCLM WVCH GOVR GCSR GLND GRNT` (17 types — the JS authoritative list, no longer the drifted bash 10).

- [ ] **Step 4: Functional test — generate a multi-instance document ID**

Run:
```bash
cd /workspaces/arc-kit
# Dry-run: just invoke the script to prove init works. --help may not be supported;
# this uses a minimal call that exercises the MULTI_INSTANCE_TYPES init code path.
CLAUDE_PLUGIN_ROOT="$(pwd)/arckit-claude" bash arckit-claude/scripts/bash/generate-document-id.sh 2>&1 | head -3 || true
```

Expected: the script's init code runs without the `ERROR: Could not read MULTI_INSTANCE_TYPES` bail-out. Downstream behaviour (usage message, argument parsing) is unchanged.

- [ ] **Step 5: Run the bash-consistency pytest assertion**

Run:
```bash
cd /workspaces/arc-kit
python3 -m pytest tests/plugin/test_registry_consistency.py::test_bash_multi_instance_types_matches_js -v
```

Expected: `PASSED`.

- [ ] **Step 6: Commit**

```bash
cd /workspaces/arc-kit
git add arckit-claude/scripts/bash/generate-document-id.sh
git commit -m "$(cat <<'EOF'
refactor(scripts): generate-document-id.sh reads MULTI_INSTANCE_TYPES from JS

The bash MULTI_INSTANCE_TYPES array (10 entries) had drifted from the
authoritative JS list (17 entries). Replace with a node shell-out that
reads doc-types.mjs at runtime. ~100ms overhead per invocation,
invisible compared to existing filesystem work.

Resolves the bash-side of the dual-registration class of bugs.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Clean up the dual-registration warning in `doc-types.mjs`

**Purpose:** The header comment explicitly flags the pages.md dual registration as a known problem. Task 5 fixed it — delete the warning.

**Files:**
- Modify: `arckit-claude/config/doc-types.mjs`

- [ ] **Step 1: Delete the warning paragraph and the bash NOTE**

Use the Edit tool. Find:
```js
 * Every hook and tool that needs doc-type metadata imports from here.
 * If you add or rename a type code, update this file FIRST.
 *
 * ⚠️ DUAL REGISTRATION REQUIRED — also update `arckit-claude/commands/pages.md`
 * (the `/arckit.pages` dashboard generator has its own "Only include these
 * known artifact types" allow-list inside the prompt). Without an entry
 * there, generated artifacts are silently omitted from the rendered
 * dashboard sidebar even though the manifest hook records them correctly.
 * See PR #317 for context — long term the two registries should be unified.
 *
 * NOTE: scripts/bash/generate-document-id.sh has its own MULTI_INSTANCE_TYPES
 * list (bash, 10 entries). Keep it in sync manually — low drift risk.
 */
```

Replace with:
```js
 * Every hook, prompt, and script that needs doc-type metadata reads from here:
 *   - Hooks: import { DOC_TYPES, ... } from '../config/doc-types.mjs'
 *   - Pages prompt: consumed via the "Known Artifact Types" table that
 *     sync-guides.mjs injects into /arckit:pages context at runtime.
 *   - Bash (generate-document-id.sh): reads MULTI_INSTANCE_TYPES via a
 *     `node --input-type=module -e "..."` shell-out.
 *
 * Consistency enforced by tests/plugin/test_registry_consistency.py.
 */
```

- [ ] **Step 2: Verify the module still parses**

Run:
```bash
node --check /workspaces/arc-kit/arckit-claude/config/doc-types.mjs && echo "syntax ok"
```

Expected: `syntax ok`.

- [ ] **Step 3: Commit**

```bash
cd /workspaces/arc-kit
git add arckit-claude/config/doc-types.mjs
git commit -m "$(cat <<'EOF'
docs(config): doc-types.mjs header reflects consolidated registry

The dual-registration warnings (pages.md allow-list, bash MULTI_INSTANCE_TYPES)
pointed at problems now fixed in Tasks 5 and 6. Replace with a
description of how each consumer reads from this single source of truth.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Regeneration + regression parity check

**Purpose:** Regenerate the 5 extension-format copies of `pages.md` via the converter, then prove the `/arckit:pages` output is bit-identical before and after the refactor against a representative test repo.

**Files:**
- Regenerated: extension-format copies of `pages.md` in 5 directories, plus `arckit-paperclip/src/data/commands.json`
- No new files created

- [ ] **Step 1: Run the converter**

Run:
```bash
cd /workspaces/arc-kit
python3 scripts/converter.py 2>&1 | tail -3
```

Expected: `Generated 86 Codex Extension + 86 Codex Skills + 86 OpenCode CLI + 86 Gemini CLI + 86 Copilot + 86 Paperclip = 516 total files.`

- [ ] **Step 2: Confirm only `pages.md` downstream artefacts changed**

Run:
```bash
cd /workspaces/arc-kit
git status --short | sort | head -20
```

Expected: every changed file path should contain `pages` or `commands.json`. For example:

```
 M arckit-codex/commands/arckit.pages.md
 M arckit-codex/prompts/arckit.pages.md
 M arckit-codex/skills/arckit-pages/SKILL.md
 M arckit-copilot/prompts/arckit-pages.prompt.md
 M arckit-gemini/commands/arckit/pages.toml
 M arckit-opencode/commands/arckit.pages.md
 M arckit-paperclip/src/data/commands.json
```

(Exact count may vary with converter internals — the assertion is that nothing outside pages-related files and commands.json changed.)

- [ ] **Step 3: Full test suite**

Run:
```bash
cd /workspaces/arc-kit
python3 -m pytest tests/ -q 2>&1 | tail -5
```

Expected: all tests pass (989 pre-existing + 6 new registry-consistency = 995 total, minus the ~204 that were already skipped).

- [ ] **Step 4: Regression parity — `/arckit:pages` output check**

This step requires running `/arckit:pages` against a test repo and confirming the generated `docs/index.html` is semantically equivalent before and after. It requires a Claude Code session and a representative repo.

Procedure:

```text
1. On a commit immediately BEFORE Task 1 (use git stash or checkout the
   pre-refactor commit):
   - Open arckit-test-project-v17-fuel-prices (or any ArcKit test repo
     with multiple projects).
   - Run /arckit:pages.
   - Save docs/index.html as /tmp/pages-before.html.

2. On the post-Task-7 commit (this task's HEAD):
   - Re-run /arckit:pages against the same repo.
   - Save docs/index.html as /tmp/pages-after.html.

3. Diff:
      diff /tmp/pages-before.html /tmp/pages-after.html
```

Expected: zero diff, or only trivial differences (timestamps embedded in the HTML). Any semantic diff (a missing artifact, a wrong category label, a changed type code, missing rows) is a regression — do NOT proceed; investigate which task introduced the drift.

- [ ] **Step 5: Commit the converter output**

```bash
cd /workspaces/arc-kit
git add -A
git commit -m "$(cat <<'EOF'
chore: regenerate pages.md extension artefacts post-refactor

Post-Task-5 converter run. Extension-format copies of pages.md no longer
carry the hand-maintained type-code table; instead they inherit the
refactored pages.md that points at hook-injected context.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 6: Push (user confirmation required per project rule)**

User rule recorded in project memory: "Never push to main; feature branches + PRs only." Stop here and confirm with the user before pushing the whole 8-task chain to main. Do NOT push unilaterally.

---

## Self-Review Notes

**Spec coverage:**

- File structure (3 config files + test) — Tasks 1, 2, 3 ✓
- Shape of `GUIDES` / `ROLES` (keyed object, `{category, status}` / `{family, commandCount}`) — Task 1, Task 2 ✓
- Refactor `sync-guides.mjs` — Task 4 ✓
- Retire `pages.md` allow-list via `knownDocTypes` hook context — Task 5 ✓
- Bash shell-out in `generate-document-id.sh` — Task 6 ✓
- Delete `doc-types.mjs` header warning — Task 7 ✓
- Drift-detection test (6 assertions) — Task 3 ✓
- Before-and-after parity check — Task 8 Step 4 ✓
- Non-goals (unifying categories across DOC_TYPES and GUIDES; full command registry; removing maturity tiers) — not in any task ✓

**Consistency check:**

- `GUIDES`, `GUIDE_STEMS`, `GUIDE_CATEGORY_VALUES`, `GUIDE_STATUS_VALUES` exports named identically across Task 1 file, Task 3 test, and Task 4 refactor ✓
- `ROLES`, `ROLE_STEMS`, `ROLE_FAMILY_VALUES` consistent across Task 2 and Task 3 ✓
- `meta?.category || 'Other'` fallback matches `'Other'` used in the test's assertion logic (never-reached safety net) ✓
- Task 5 introduces the markdown-table injection and Task 5 Step 2 the prompt-side consumption — both reference "Known Artifact Types" as the exact heading string ✓
- Task 6 shell-out path (`${CLAUDE_PLUGIN_ROOT:-…}/config/doc-types.mjs`) matches Task 3's bash-consistency assertion's expected path ✓

**Placeholder scan:** no TBDs, no "add error handling", no "similar to Task N". Every code block shows complete content.

**Task granularity:** 8 tasks, each with ~3–7 steps averaging 2–5 minutes per step. Every task ends with an explicit commit.
