# UAE Federal Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the 12-command **UAE Federal Overlay** as ArcKit v4.10.0 — official baseline goes from 68 → 80 commands. Plugin userConfig gains `governance_framework: UAE Federal` (recommended value) and a new `classification_scheme` field. All ~83 existing templates per directory get a Document Control marker that resolves to a UK or UAE partial at command-execution time.

**Architecture:** Approach 2 from the spec. Flat overlay (12 sibling command files, no agents, no new hooks) plus userConfig extension plus Document Control conditional via partial-fragment resolution applied by the AI assistant at command-execution time. Non-UAE projects must produce byte-identical Document Control headers to today.

**Tech Stack:** Markdown command/template authoring, JavaScript (`doc-types.mjs`), Python (`scripts/converter.py`), bash (validation scripts), `markdownlint-cli2` for lint, `gh` for PR.

**Design Spec:** `docs/superpowers/specs/2026-04-30-uae-overlay-design.md`

**Branch:** Already on `feat/uae-overlay-spec`. Continue here for implementation; do not branch again until merge.

---

## File Structure

### New (43 files)

**Commands (12)** — `arckit-claude/commands/uae-*.md`:
`uae-classification.md`, `uae-pdpl.md`, `uae-ias.md`, `uae-cloud-residency.md`, `uae-uaepass.md`, `uae-zero-bureaucracy.md`, `uae-digital-records.md`, `uae-data-sharing.md`, `uae-priorities-alignment.md`, `uae-ai-charter.md`, `uae-ai-autonomy-tier.md`, `uae-procurement.md`.

**Templates (24)** — same 12 names with `-template.md` suffix, in **both** `arckit-claude/templates/` and `.arckit/templates/`.

**Document Control partials (4)**:
- `arckit-claude/templates/_partials/document-control-uk.md`
- `arckit-claude/templates/_partials/document-control-uae.md`
- `.arckit/templates/_partials/document-control-uk.md`
- `.arckit/templates/_partials/document-control-uae.md`

**Validation script (1)**: `scripts/tests/test-doc-types-dual-registration.mjs`

**Migration helper (1)**: `scripts/python/migrate_classification.py` (one-time, removed in v5.0.0)

**Documentation (5)**:
- `docs/guides/uae-overlay.md`
- `docs/guides/uae-overlay-maintenance.md`
- `docs/articles/2026-04-30-uae-overlay-launch.md`
- `docs/articles/2026-04-30-uae-overlay-launch-hero.png`
- `docs/articles/generate-hero-uae-overlay.py`

### Modified (~190 files)

- `arckit-claude/.claude-plugin/plugin.json` (1) — userConfig extension and version bump
- `arckit-claude/config/doc-types.mjs` (1) — 12 new type codes
- `arckit-claude/commands/pages.md` (1) — 12 new rows in document-types table
- `.github/CODEOWNERS` (1) — three glob entries for `uae-*` paths
- `scripts/converter.py` (1) — recognise new userConfig fields in env-var rewrite
- `.github/workflows/lint-markdown.yml` (1) — wire in dual-registration test
- ~83 templates in `arckit-claude/templates/` (Document Control section replaced with marker)
- ~83 templates in `.arckit/templates/` (mirror change)
- `README.md` (1) — count update 68→80, new section
- `docs/index.html` (1)
- `docs/DEPENDENCY-MATRIX.md` (1)
- `docs/WORKFLOW-DIAGRAMS.md` (1)
- `CHANGELOG.md` (1)
- 15 version files via `scripts/bump-version.sh 4.10.0`

### Test infrastructure note

ArcKit has no command runtime test suite; validation is `markdownlint-cli2`, `python -m py_compile` on scripts, custom node-based registration tests, converter round-trip checks, and end-to-end manual runs against the public test repo `arckit-test-project-v20-uae-moi-ipad`. Each task names the verification command and the expected output explicitly.

---

# PHASE A — PLUMBING

Goal: ship the userConfig fields, the type codes, the Document Control partials, and the marker substitution across all existing templates. End of Phase A, no UAE commands exist yet but the foundation is laid.

## Task A1: Add `classification_scheme` userConfig field and extend `governance_framework` description

**Files:**
- Modify: `arckit-claude/.claude-plugin/plugin.json`

- [ ] **Step 1: Edit `governance_framework` description**

Use the Edit tool. Find:
```
    "governance_framework": {
      "title": "Governance Framework",
      "description": "Default governance framework: 'UK Gov' for Service Standard/TCoP/NCSC CAF, or 'Generic' for non-government",
      "type": "string"
    }
```
Replace with:
```
    "governance_framework": {
      "title": "Governance Framework",
      "description": "Default governance framework: 'UK Gov' for Service Standard/TCoP/NCSC CAF, 'UAE Federal' for UAE Cabinet instruments + PDPL + IAS, or 'Generic' for non-government",
      "type": "string"
    },
    "classification_scheme": {
      "title": "Classification Scheme",
      "description": "Classification ladder used in Document Control headers: 'UK' (PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET) or 'UAE Smart Data' (Open / Shared / Confidential / Secret / Top Secret). Defaults to UK when blank.",
      "type": "string"
    }
```

- [ ] **Step 2: Verify the JSON parses**

Run: `python -c "import json; json.load(open('arckit-claude/.claude-plugin/plugin.json'))" && echo OK`
Expected: `OK`

- [ ] **Step 3: Verify the new field is registered**

Run: `python -c "import json; d=json.load(open('arckit-claude/.claude-plugin/plugin.json')); print(list(d['userConfig'].keys()))"`
Expected output contains `'classification_scheme'`:
```
['GOOGLE_API_KEY', 'DATA_COMMONS_API_KEY', 'organisation_name', 'default_classification', 'governance_framework', 'classification_scheme']
```

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/.claude-plugin/plugin.json
git commit -m "feat(plugin): add classification_scheme userConfig and extend governance_framework for UAE Federal"
```

---

## Task A2: Create the four Document Control partials

**Files:**
- Create: `arckit-claude/templates/_partials/document-control-uk.md`
- Create: `arckit-claude/templates/_partials/document-control-uae.md`
- Create: `.arckit/templates/_partials/document-control-uk.md`
- Create: `.arckit/templates/_partials/document-control-uae.md`

- [ ] **Step 1: Create the UK partial**

Use the Bash tool: `mkdir -p arckit-claude/templates/_partials .arckit/templates/_partials`

Use the Write tool to create `arckit-claude/templates/_partials/document-control-uk.md` with this exact content:

```markdown
| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-[TYPE_CODE]-v[VERSION] |
| **Document Type** | [DOCUMENT_TYPE_NAME] |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | [DISTRIBUTION_LIST] |
```

- [ ] **Step 2: Create the UAE partial**

Use the Write tool to create `arckit-claude/templates/_partials/document-control-uae.md` with this exact content:

```markdown
| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-[TYPE_CODE]-v[VERSION] |
| **Document Type** | [DOCUMENT_TYPE_NAME] |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [Open / Shared / Confidential / Secret / Top Secret] |
| **Status** | DRAFT |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | [DISTRIBUTION_LIST] |
| **Federal Entity** | ${user_config.organisation_name} |
| **Cabinet Instrument cited** | [PENDING — e.g. UAE Code for Government Services and Zero Bureaucracy] |
| **Sovereign Cloud Region** | [PENDING — e.g. UAE North (Dubai) / UAE Central (Abu Dhabi) / FedNet / N/A] |
| **AI Autonomy Tier** | [PENDING — Tier 1 / Tier 2 / Tier 3 / N/A] |
```

- [ ] **Step 3: Mirror to `.arckit/templates/_partials/`**

```bash
cp arckit-claude/templates/_partials/document-control-uk.md .arckit/templates/_partials/document-control-uk.md
cp arckit-claude/templates/_partials/document-control-uae.md .arckit/templates/_partials/document-control-uae.md
```

- [ ] **Step 4: Verify all four partials exist and match by checksum**

Run:
```bash
ls -la arckit-claude/templates/_partials/ .arckit/templates/_partials/
md5sum arckit-claude/templates/_partials/document-control-uk.md .arckit/templates/_partials/document-control-uk.md
md5sum arckit-claude/templates/_partials/document-control-uae.md .arckit/templates/_partials/document-control-uae.md
```
Expected: each pair has identical md5 hashes.

- [ ] **Step 5: Lint the partials**

Run: `npx markdownlint-cli2 "arckit-claude/templates/_partials/*.md" ".arckit/templates/_partials/*.md"`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add arckit-claude/templates/_partials/ .arckit/templates/_partials/
git commit -m "feat(templates): add UK and UAE Document Control partials"
```

---

## Task A3: Register the 12 UAE type codes in `doc-types.mjs`

**Files:**
- Modify: `arckit-claude/config/doc-types.mjs`

- [ ] **Step 1: Append the UAE type codes block**

Use the Edit tool. Find:
```
  // Austrian Government (Community-contributed, maintained by @gtonic)
  'ATDSG':     { name: 'Austrian Data Protection Assessment',          category: 'Compliance' },
  'ATNISG':    { name: 'Austrian NISG (NIS2) Assessment',              category: 'Compliance' },
  'BVERGG':    { name: 'Austrian Public Procurement (BVergG 2018)',    category: 'Procurement' },
};
```

Replace with:
```
  // Austrian Government (Community-contributed, maintained by @gtonic)
  'ATDSG':     { name: 'Austrian Data Protection Assessment',          category: 'Compliance' },
  'ATNISG':    { name: 'Austrian NISG (NIS2) Assessment',              category: 'Compliance' },
  'BVERGG':    { name: 'Austrian Public Procurement (BVergG 2018)',    category: 'Procurement' },
  // UAE Federal Overlay (Official, maintained by @tractorjuice) — anchored on 23 April 2026 Cabinet decree
  'PDPL':      { name: 'UAE PDPL Compliance Assessment',               category: 'Compliance' },
  'IAS':       { name: 'UAE IAS Statement of Applicability',           category: 'Compliance' },
  'CRES':      { name: 'UAE Sovereign Cloud Residency Assessment',     category: 'Architecture' },
  'CLAS':      { name: 'UAE Smart Data Classification Register',       category: 'Governance' },
  'UPASS':     { name: 'UAE Pass Integration Design',                  category: 'Architecture' },
  'ZBUR':      { name: 'UAE Zero Bureaucracy Service Review',          category: 'Governance' },
  'DREC':      { name: 'UAE Digital Records Plan',                     category: 'Governance' },
  'DSHR':      { name: 'UAE Data Sharing Agreement',                   category: 'Governance' },
  'NPRA':      { name: 'UAE National Priorities Alignment Statement',  category: 'Governance' },
  'AICH':      { name: 'UAE AI Charter Compliance Assessment',         category: 'Compliance' },
  'AUTI':      { name: 'UAE AI Autonomy Tier Posture',                 category: 'Architecture' },
  'FPRO':      { name: 'UAE Federal Procurement Strategy',             category: 'Procurement' },
};
```

- [ ] **Step 2: Verify the file parses as JS**

Run: `node --check arckit-claude/config/doc-types.mjs && echo OK`
Expected: `OK`

- [ ] **Step 3: Verify all 12 codes are registered and unique**

Run:
```bash
node --input-type=module -e "
import('./arckit-claude/config/doc-types.mjs').then(m => {
  const uae = ['PDPL','IAS','CRES','CLAS','UPASS','ZBUR','DREC','DSHR','NPRA','AICH','AUTI','FPRO'];
  for (const c of uae) {
    if (!m.DOC_TYPES[c]) throw new Error('Missing: ' + c);
    console.log(c, '→', m.DOC_TYPES[c].name);
  }
  console.log('Total registered:', Object.keys(m.DOC_TYPES).length);
});
"
```
Expected: each of the 12 codes prints with its name, and total count is the previous count + 12.

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/config/doc-types.mjs
git commit -m "feat(types): register 12 UAE Federal Overlay type codes (PDPL, IAS, CRES, CLAS, UPASS, ZBUR, DREC, DSHR, NPRA, AICH, AUTI, FPRO)"
```

---

## Task A4: Mirror the 12 type codes into `pages.md` document-types table

**Files:**
- Modify: `arckit-claude/commands/pages.md`

- [ ] **Step 1: Locate the document-types allow-list**

Run: `grep -n "ATDSG\|BVERGG\|Austrian" arckit-claude/commands/pages.md | head -20`
Expected: lines showing where the Austrian community block ends in the allow-list. Note the line number of the closing entry.

- [ ] **Step 2: Add the UAE block after the Austrian block**

Use the Edit tool. Find the Austrian community block (the `BVERGG` entry is the last one). Insert immediately after it (preserve table column alignment of the existing entries):

```
| `PDPL` | UAE PDPL Compliance Assessment | Compliance |
| `IAS` | UAE IAS Statement of Applicability | Compliance |
| `CRES` | UAE Sovereign Cloud Residency Assessment | Architecture |
| `CLAS` | UAE Smart Data Classification Register | Governance |
| `UPASS` | UAE Pass Integration Design | Architecture |
| `ZBUR` | UAE Zero Bureaucracy Service Review | Governance |
| `DREC` | UAE Digital Records Plan | Governance |
| `DSHR` | UAE Data Sharing Agreement | Governance |
| `NPRA` | UAE National Priorities Alignment Statement | Governance |
| `AICH` | UAE AI Charter Compliance Assessment | Compliance |
| `AUTI` | UAE AI Autonomy Tier Posture | Architecture |
| `FPRO` | UAE Federal Procurement Strategy | Procurement |
```

(Adjust the column-pipe spacing to match the existing rows in `pages.md` for visual consistency. The literal table cell content above must match `doc-types.mjs` exactly.)

- [ ] **Step 3: Verify all 12 UAE codes appear in pages.md**

Run: `for c in PDPL IAS CRES CLAS UPASS ZBUR DREC DSHR NPRA AICH AUTI FPRO; do grep -q "\`$c\`" arckit-claude/commands/pages.md && echo "$c OK" || echo "$c MISSING"; done`
Expected: 12 lines, all `OK`.

- [ ] **Step 4: Lint the file**

Run: `npx markdownlint-cli2 arckit-claude/commands/pages.md`
Expected: no errors (or matching the pre-existing baseline).

- [ ] **Step 5: Commit**

```bash
git add arckit-claude/commands/pages.md
git commit -m "feat(pages): mirror 12 UAE type codes into dashboard allow-list"
```

---

## Task A5: Write the dual-registration validation test

**Files:**
- Create: `scripts/tests/test-doc-types-dual-registration.mjs`

- [ ] **Step 1: Create the test directory and write the script**

Run: `mkdir -p scripts/tests`

Use the Write tool to create `scripts/tests/test-doc-types-dual-registration.mjs` with this exact content:

```javascript
#!/usr/bin/env node
/**
 * Dual-registration test for ArcKit doc-type codes.
 *
 * Asserts that every code in `arckit-claude/config/doc-types.mjs` also appears
 * in the document-types allow-list table inside `arckit-claude/commands/pages.md`,
 * and vice versa. The two registries must stay in sync; without this test the
 * silent-omission failure mode (PR #317) recurs whenever a new overlay lands.
 *
 * Exit 0 = sync. Exit 1 = mismatch (prints the diff).
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

const docTypesPath = resolve(repoRoot, 'arckit-claude/config/doc-types.mjs');
const pagesPath = resolve(repoRoot, 'arckit-claude/commands/pages.md');

const { DOC_TYPES } = await import(docTypesPath);
const docTypesCodes = new Set(Object.keys(DOC_TYPES));

const pagesContent = await readFile(pagesPath, 'utf8');
// Match `| \`CODE\` | ... | ... |` lines inside markdown tables.
const codeMatches = pagesContent.matchAll(/^\|\s*`([A-Z][A-Z0-9]*)`\s*\|/gm);
const pagesCodes = new Set();
for (const m of codeMatches) pagesCodes.add(m[1]);

const inDocTypesNotPages = [...docTypesCodes].filter((c) => !pagesCodes.has(c)).sort();
const inPagesNotDocTypes = [...pagesCodes].filter((c) => !docTypesCodes.has(c)).sort();

let ok = true;
if (inDocTypesNotPages.length > 0) {
  ok = false;
  console.error('[FAIL] Codes in doc-types.mjs but missing from pages.md table:');
  for (const c of inDocTypesNotPages) console.error('  -', c);
}
if (inPagesNotDocTypes.length > 0) {
  ok = false;
  console.error('[FAIL] Codes in pages.md table but missing from doc-types.mjs:');
  for (const c of inPagesNotDocTypes) console.error('  -', c);
}

if (ok) {
  console.log(`[PASS] ${docTypesCodes.size} codes registered consistently across both registries.`);
  process.exit(0);
}
process.exit(1);
```

- [ ] **Step 2: Make the script executable and run it**

```bash
chmod +x scripts/tests/test-doc-types-dual-registration.mjs
node scripts/tests/test-doc-types-dual-registration.mjs
```
Expected: `[PASS] N codes registered consistently across both registries.` (where N is the total count after Task A3 + A4).

- [ ] **Step 3: Provoke a failure to confirm the test detects drift**

Temporarily comment out the `'PDPL':` line in `doc-types.mjs`, re-run the script, expect a `[FAIL]` printout. Restore the line.

```bash
# Confirm restoration
node --check arckit-claude/config/doc-types.mjs && node scripts/tests/test-doc-types-dual-registration.mjs
```
Expected: `[PASS]` again.

- [ ] **Step 4: Wire the test into the markdown-lint workflow**

Use the Edit tool on `.github/workflows/lint-markdown.yml`. Append a new step after the existing `markdownlint` step (preserve YAML indentation):

```yaml
      - name: Dual-registration test for doc-types
        run: node scripts/tests/test-doc-types-dual-registration.mjs
```

Verify with: `cat .github/workflows/lint-markdown.yml | grep -A 1 "Dual-registration"`

- [ ] **Step 5: Commit**

```bash
git add scripts/tests/test-doc-types-dual-registration.mjs .github/workflows/lint-markdown.yml
git commit -m "test(types): add dual-registration check for doc-types.mjs vs pages.md"
```

---

## Task A6: Apply the Document Control marker to all existing templates

The change is mechanical: every template's existing Document Control table is replaced with a single marker line. The marker resolves at command-execution time to either the UK or UAE partial (Phase A leaves the resolution instruction implicit; commands and consumers will handle it from Task B onwards).

**Files:**
- Modify: ~83 templates in `arckit-claude/templates/`
- Modify: ~83 templates in `.arckit/templates/`

- [ ] **Step 1: Capture the canonical Document Control footprint**

Run: `grep -l "## Document Control" arckit-claude/templates/*.md | wc -l`
Expected: a number close to 83. Note the actual count (call it N1) for the verification step.

Run: `grep -l "## Document Control" .arckit/templates/*.md | wc -l`
Expected: same N1 (the directories are mirrored).

- [ ] **Step 2: Snapshot the rendered Document Control headers for regression baseline**

```bash
mkdir -p /tmp/uae-overlay-baseline
grep -l "## Document Control" arckit-claude/templates/*.md > /tmp/uae-overlay-baseline/touched.txt
for f in $(cat /tmp/uae-overlay-baseline/touched.txt); do
  awk '/## Document Control/,/## Revision History/' "$f" > "/tmp/uae-overlay-baseline/$(basename $f).docctl"
done
ls /tmp/uae-overlay-baseline/ | wc -l
```
Expected: N1 + 1 (`touched.txt` plus N1 `.docctl` files).

- [ ] **Step 3: Write the substitution script**

Use the Write tool to create `scripts/python/apply_doc_control_marker.py`:

```python
#!/usr/bin/env python3
"""
Replace each template's `## Document Control` table with a marker that the
command runtime resolves to the UK or UAE partial. Idempotent — running twice
leaves the file unchanged.

Usage:
  python scripts/python/apply_doc_control_marker.py <template-dir>

Exits 0 with a count of files modified.
"""
import re
import sys
from pathlib import Path

MARKER = "<!-- DOC-CONTROL-HEADER -->\n<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->\n"

# Match from "## Document Control" up to (but not including) the next "## " heading.
PATTERN = re.compile(r"## Document Control\n.*?(?=\n## )", re.DOTALL)

def transform(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if MARKER in text:
        return False  # already migrated
    if not PATTERN.search(text):
        return False  # no Document Control section to migrate
    new = PATTERN.sub("## Document Control\n\n" + MARKER, text)
    if new == text:
        return False
    path.write_text(new, encoding="utf-8")
    return True

def main() -> int:
    if len(sys.argv) != 2:
        print("usage: apply_doc_control_marker.py <template-dir>", file=sys.stderr)
        return 2
    target = Path(sys.argv[1])
    if not target.is_dir():
        print(f"not a directory: {target}", file=sys.stderr)
        return 2
    modified = 0
    for md in sorted(target.glob("*.md")):
        if transform(md):
            modified += 1
            print(f"modified: {md}")
    print(f"\nTotal modified: {modified}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

Make it executable: `chmod +x scripts/python/apply_doc_control_marker.py`

- [ ] **Step 4: Dry-run on a single template to verify the substitution**

Pick a non-UAE / non-EU template (e.g. `requirements-template.md`) and inspect the output:

```bash
cp arckit-claude/templates/requirements-template.md /tmp/uae-overlay-baseline/requirements-template.md.before
python scripts/python/apply_doc_control_marker.py arckit-claude/templates
diff /tmp/uae-overlay-baseline/requirements-template.md.before arckit-claude/templates/requirements-template.md | head -40
```
Expected: the Document Control table is removed and replaced with the two-line marker. The Revision History and downstream sections are unchanged.

- [ ] **Step 5: Run on the second directory**

```bash
python scripts/python/apply_doc_control_marker.py .arckit/templates
```

- [ ] **Step 6: Verify counts match**

```bash
grep -l "DOC-CONTROL-HEADER" arckit-claude/templates/*.md | wc -l
grep -l "DOC-CONTROL-HEADER" .arckit/templates/*.md | wc -l
```
Expected: both equal to N1 from Step 1.

- [ ] **Step 7: Verify no template still carries the old inline Document Control block**

```bash
grep -l "## Document Control" arckit-claude/templates/*.md | xargs -I{} grep -L "DOC-CONTROL-HEADER" {} | wc -l
```
Expected: `0` (every template that has a Document Control section now has the marker).

- [ ] **Step 8: Lint touched templates**

```bash
npx markdownlint-cli2 "arckit-claude/templates/*.md" ".arckit/templates/*.md"
```
Expected: no new errors compared to the pre-change baseline. (If new errors appear they're typically MD041/MD025; investigate and adjust the marker formatting.)

- [ ] **Step 9: Commit**

```bash
git add scripts/python/apply_doc_control_marker.py arckit-claude/templates/ .arckit/templates/
git commit -m "feat(templates): replace inline Document Control with resolver marker across all templates"
```

---

## Task A7: Add the rendering instruction file

The marker needs an authoritative description of how to resolve. This file is read by every command body (existing 68 + new 12 + future overlays) so the resolution discipline lives in one place.

**Files:**
- Create: `arckit-claude/templates/_partials/RENDERING.md`
- Create: `.arckit/templates/_partials/RENDERING.md`

- [ ] **Step 1: Write the rendering instruction**

Use the Write tool to create `arckit-claude/templates/_partials/RENDERING.md`:

```markdown
# ArcKit Template Rendering Rules

When a template contains the marker `<!-- DOC-CONTROL-HEADER -->`, the command that reads the template MUST resolve the marker to the contents of one of the partials in this directory before writing the artefact to disk:

1. **Read the user's plugin userConfig** for `governance_framework` and `classification_scheme`.
2. **Choose the partial**:
   - If `governance_framework` is `UAE Federal` OR `classification_scheme` is `UAE Smart Data` → use `document-control-uae.md`.
   - Otherwise → use `document-control-uk.md`.
3. **Inline the chosen partial's contents** at the marker location, applying the standard `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions.
4. **Remove the `<!-- DOC-CONTROL-HEADER -->` marker line and its descriptive comment** from the final output.
5. **Populate the UAE-specific fields** (Federal Entity, Cabinet Instrument cited, Sovereign Cloud Region, AI Autonomy Tier) from upstream artefacts where available, or leave the `[PENDING — ...]` placeholder for the architect to fill.

The marker comment is informational only; it does not appear in any rendered artefact.

## Quick reference

| User config | Partial used | UAE-specific block |
|---|---|---|
| `governance_framework: UK Gov`, any `classification_scheme` other than `UAE Smart Data` | `document-control-uk.md` | omitted |
| `governance_framework: Generic`, any `classification_scheme` other than `UAE Smart Data` | `document-control-uk.md` | omitted |
| `governance_framework: UAE Federal`, any `classification_scheme` | `document-control-uae.md` | included |
| any `governance_framework`, `classification_scheme: UAE Smart Data` | `document-control-uae.md` | included |
```

- [ ] **Step 2: Mirror to `.arckit/templates/_partials/`**

```bash
cp arckit-claude/templates/_partials/RENDERING.md .arckit/templates/_partials/RENDERING.md
md5sum arckit-claude/templates/_partials/RENDERING.md .arckit/templates/_partials/RENDERING.md
```
Expected: identical hashes.

- [ ] **Step 3: Lint**

Run: `npx markdownlint-cli2 "arckit-claude/templates/_partials/*.md" ".arckit/templates/_partials/*.md"`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/templates/_partials/RENDERING.md .arckit/templates/_partials/RENDERING.md
git commit -m "feat(templates): add RENDERING.md describing Document Control marker resolution"
```

---

## Task A8: Phase A regression sweep

Verify three UK/Generic test repos produce byte-identical Document Control headers after the Phase A change. This is the gate before any Phase B command-authoring begins.

**Files:** No file changes. Verification only.

- [ ] **Step 1: Clone three test repos to a scratch area**

```bash
mkdir -p /tmp/uae-overlay-regression
cd /tmp/uae-overlay-regression
gh repo clone tractorjuice/arckit-test-project-v3-windows11 v3
gh repo clone tractorjuice/arckit-test-project-v8-ons-data-platform v8
gh repo clone tractorjuice/arckit-test-project-v17-fuel-prices v17
cd /workspaces/arc-kit
```

- [ ] **Step 2: For each repo, capture the existing Document Control headers as a baseline**

```bash
for repo in v3 v8 v17; do
  for art in /tmp/uae-overlay-regression/$repo/projects/*/ARC-*.md; do
    awk '/## Document Control/,/## Revision History/' "$art" \
      > "/tmp/uae-overlay-regression/${repo}-$(basename $art).docctl-before"
  done
done
ls /tmp/uae-overlay-regression/*.docctl-before | wc -l
```
Note the count for Step 4.

- [ ] **Step 3: With the Phase A changes in place, regenerate one artefact in each repo**

For each test repo, open it with the plugin enabled (use the existing `.claude/settings.json` already wired to the marketplace). In each repo's Claude Code session, regenerate one of the existing artefacts using its slash command (e.g. `/arckit.requirements` against the existing requirements). Save the regenerated file's Document Control section as a `.docctl-after` snapshot.

Manual step — capture the snapshot path for each regenerated artefact under `/tmp/uae-overlay-regression/<repo>-<artefact>.docctl-after`.

- [ ] **Step 4: Diff before vs after**

```bash
for f in /tmp/uae-overlay-regression/*.docctl-after; do
  before="${f%.docctl-after}.docctl-before"
  if ! diff -q "$before" "$f"; then
    echo "DIFF: $f"
    diff "$before" "$f" | head -20
  fi
done
```
Expected: no `DIFF:` lines printed. Any difference means the Phase A change has altered UK/Generic behaviour and must be fixed before progressing.

- [ ] **Step 5: Document the regression result**

Append a one-line note to a tracking file at `docs/superpowers/plans/2026-04-30-uae-federal-overlay-regression-log.md`:

```markdown
# UAE Overlay Regression Log

## Phase A regression (YYYY-MM-DD)

- v3 windows11: PASS (N artefacts diffed clean)
- v8 ons-data-platform: PASS
- v17 fuel-prices: PASS

Phase A is regression-clean. Proceeding to Phase B.
```

- [ ] **Step 6: Commit the log**

```bash
git add docs/superpowers/plans/2026-04-30-uae-federal-overlay-regression-log.md
git commit -m "test(uae): Phase A regression sweep clean against v3/v8/v17"
```

---

# PHASE B — FEDERAL DATA + SECURITY COMMANDS (4)

Authoring four commands and their templates, with citation cross-checks. Each command follows the same structural pattern. Tasks B1–B4 are independent and can be parallelised; B5 is the integration gate.

## Task B1: Author `uae-classification`

**Files:**
- Create: `arckit-claude/commands/uae-classification.md`
- Create: `arckit-claude/templates/uae-classification-template.md`
- Create: `.arckit/templates/uae-classification-template.md`

- [ ] **Step 1: Write the command file**

Use the Write tool to create `arckit-claude/commands/uae-classification.md`:

```markdown
---
description: "Generate a UAE Smart Data Classification Register for a project, mapping every dataset to Open / Shared / Confidential / Secret / Top Secret with handling rules and declassification schedule. Anchored on the UAE Smart Data Framework."
argument-hint: "<project ID or service name>"
effort: high
handoffs:
  - command: data-model
    description: The classification register feeds the data model entity-by-entity sensitivity tags.
  - command: uae-cloud-residency
    description: Residency obligations follow from the classification level (Confidential and above require UAE-resident sovereign cloud).
  - command: uae-data-sharing
    description: Data sharing agreements depend on per-dataset classification.
---

You are an enterprise architect generating a UAE Smart Data Classification Register for a UAE federal entity.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles)
   - The project's existing artefacts under `projects/<project-id>/`
   - `arckit-claude/templates/_partials/RENDERING.md` (Document Control resolution rules)
2. Read the template `arckit-claude/templates/uae-classification-template.md`.
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh CLAS --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` based on the user's plugin userConfig.
6. For each dataset the project handles, propose a Smart Data classification level with explicit handling, storage, and declassification rules. Cite the UAE Smart Data Classifications publication where the level definitions are stated.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph, list of datasets and their proposed classifications).

## Authoritative anchor

UAE Smart Data Classifications (TDRA / Cabinet Smart Data initiative). Primary URL: https://u.ae/en/about-the-uae/digital-uae/data/data-operability

This citation must be present in the artefact's External References section.
```

- [ ] **Step 2: Write the template file**

Use the Write tool to create `arckit-claude/templates/uae-classification-template.md`:

```markdown
# UAE Smart Data Classification Register

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.uae-classification`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | [AUTHOR] | Initial draft | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the project's data estate, the proposed classification posture, and the residency implications that flow from it.]

## Classification Levels Used

For each Smart Data level (Open, Shared, Confidential, Secret, Top Secret), state whether the project holds data at that level and the count of datasets per level.

| Level | Holds data? | Count | Notes |
|-------|-------------|-------|-------|
| Open | [Y/N] | [n] | [notes] |
| Shared | [Y/N] | [n] | [notes] |
| Confidential | [Y/N] | [n] | [notes] |
| Secret | [Y/N] | [n] | [notes] |
| Top Secret | [Y/N] | [n] | [notes] |

## Dataset Register

| Dataset ID | Description | Source system | Classification | Handling rules | Storage location | Declassification schedule |
|------------|-------------|---------------|----------------|----------------|------------------|---------------------------|
| [DS-001] | [description] | [source] | [level] | [rules] | [location] | [schedule] |

## Handling Rules per Level

For each level the project uses, state the handling rules (encryption at rest, encryption in transit, network controls, access controls, audit-log retention, residency obligations).

## Cross-Reference Index

Map each Dataset ID to:
- Upstream BR / DR requirements that drove its capture
- Downstream INT requirements that consume it
- The applicable PDPL lawful basis (if personal data)

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| UAE-SMARTDATA | UAE Smart Data Classifications | https://u.ae/en/about-the-uae/digital-uae/data/data-operability | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [SDC-1] | UAE-SMARTDATA | Classification levels | Classification Levels Used |

---

**Generated by**: ArcKit `/arckit.uae-classification` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

- [ ] **Step 3: Mirror the template to `.arckit/templates/`**

```bash
cp arckit-claude/templates/uae-classification-template.md .arckit/templates/uae-classification-template.md
md5sum arckit-claude/templates/uae-classification-template.md .arckit/templates/uae-classification-template.md
```
Expected: identical hashes.

- [ ] **Step 4: Lint**

```bash
npx markdownlint-cli2 arckit-claude/commands/uae-classification.md arckit-claude/templates/uae-classification-template.md .arckit/templates/uae-classification-template.md
```
Expected: no errors.

- [ ] **Step 5: Run dual-registration test**

```bash
node scripts/tests/test-doc-types-dual-registration.mjs
```
Expected: PASS (CLAS code is in both registries from Phase A).

- [ ] **Step 6: Commit**

```bash
git add arckit-claude/commands/uae-classification.md arckit-claude/templates/uae-classification-template.md .arckit/templates/uae-classification-template.md
git commit -m "feat(uae): add uae-classification command and template (CLAS)"
```

---

## Task B2: Author `uae-pdpl`

Same structural pattern as Task B1.

**Files:**
- Create: `arckit-claude/commands/uae-pdpl.md`
- Create: `arckit-claude/templates/uae-pdpl-template.md`
- Create: `.arckit/templates/uae-pdpl-template.md`

- [ ] **Step 1: Write the command file**

Use the Write tool to create `arckit-claude/commands/uae-pdpl.md`:

```markdown
---
description: "Generate a UAE PDPL (Federal Decree-Law 45/2021) compliance assessment including DPIA, lawful-basis register, data-subject-rights procedure, and cross-border transfer log. Anchored on the UAE Data Office statutory framework."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: risks
    description: DPIA outputs feed the risk register's privacy and regulatory entries.
  - command: uae-data-sharing
    description: Per-share lawful-basis mapping continues into the data sharing agreement.
  - command: uae-classification
    description: PDPL-relevant datasets must be classified appropriately.
---

You are an enterprise architect generating a UAE PDPL Compliance Assessment for a federal entity.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md`
   - The project's REQ, DR, and DMOD artefacts (if present)
   - `arckit-claude/templates/_partials/RENDERING.md`
2. Read `arckit-claude/templates/uae-pdpl-template.md`.
3. Use `scripts/bash/generate-document-id.sh PDPL --filename`.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
5. Generate:
   - Scope statement (what processing is covered, what carve-outs apply — note free-zone regimes DIFC DPL / ADGM DPR are out of scope)
   - Lawful basis register (per processing activity, citing PDPL Article 5 and 6)
   - Data subject rights procedure (access, rectification, erasure, restriction, portability, object, withdraw consent, complain to Data Office)
   - DPIA (against PDPL Article 21 triggers — new tech, large-scale, profiling/automated decisions, systematic monitoring, sensitive categories)
   - Cross-border transfer log (PDPL Articles 22–23 — adequate countries, SCCs, derogations)
   - Breach notification playbook (PDPL Article 9 — Data Office and data subjects, applicable timelines)
6. Write the artefact via the Write tool. Show only a summary.

## Authoritative anchor

Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data. Authority: UAE Data Office. Primary URL: https://uaelegislation.gov.ae/en/legislations/1972/download

The PDPL Executive Regulation status MUST be flagged as "verified as of [date]" in the External References section because publication status changes (see `docs/guides/uae-overlay-maintenance.md` for the current verification date).
```

- [ ] **Step 2: Write the template file**

Use the Write tool to create `arckit-claude/templates/uae-pdpl-template.md`:

```markdown
# UAE PDPL Compliance Assessment

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit.uae-pdpl`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | [AUTHOR] | Initial draft | [PENDING] | [PENDING] |

## Executive Summary

[Two to three paragraphs describing the personal-data processing, the PDPL applicability assessment, and the headline compliance posture.]

## Scope

| Item | Value |
|------|-------|
| Controller | [name] |
| Processor(s) | [names] |
| Joint controllers | [names if applicable] |
| Categories of data subjects | [employees / citizens / customers / etc.] |
| Categories of personal data | [identifiers / sensitive (Article 7) / financial / etc.] |
| Out-of-scope (free zones) | DIFC DPL: [Y/N], ADGM DPR: [Y/N], healthcare under ADHICS: [Y/N] |

## Lawful Basis Register

| Processing activity | Lawful basis (Article) | Justification | Notes |
|---------------------|------------------------|---------------|-------|

## Data Subject Rights Procedure

For each right (access, rectification, erasure, restriction, portability, object, withdraw consent, complain), state the channel, the response SLA, and the operational owner.

## DPIA

| DPIA trigger (Article 21) | Applies? | Mitigation |
|---------------------------|----------|------------|

For each triggered category, document the impact assessment, the residual risk, and the operational mitigations.

## Cross-Border Transfers

| Destination | Mechanism (Article 22 / 23) | Review date | Owner |
|-------------|------------------------------|-------------|-------|

## Breach Notification Playbook

State the trigger criteria, the Data Office notification SLA, the data-subject notification trigger, and the operational owner.

## Penalties (informational only)

Reference the current administrative fines per Cabinet Resolution. This section is informational and is not used for compliance scoring.

## External References

### Document Register

| Doc ID | Title | URL | Verified date |
|--------|-------|-----|---------------|
| UAE-PDPL-FDL45-2021 | Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data | https://uaelegislation.gov.ae/en/legislations/1972/download | [YYYY-MM-DD] |

### Citations

| Citation | Doc ID | Section | Used in |
|----------|--------|---------|---------|
| [PDPL-1] | UAE-PDPL-FDL45-2021 | Article 5 | Lawful Basis Register |
| [PDPL-2] | UAE-PDPL-FDL45-2021 | Article 21 | DPIA |
| [PDPL-3] | UAE-PDPL-FDL45-2021 | Article 22 | Cross-Border Transfers |

---

**Generated by**: ArcKit `/arckit.uae-pdpl` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
```

- [ ] **Step 3: Mirror, lint, dual-registration test, commit**

```bash
cp arckit-claude/templates/uae-pdpl-template.md .arckit/templates/uae-pdpl-template.md
npx markdownlint-cli2 arckit-claude/commands/uae-pdpl.md arckit-claude/templates/uae-pdpl-template.md .arckit/templates/uae-pdpl-template.md
node scripts/tests/test-doc-types-dual-registration.mjs
git add arckit-claude/commands/uae-pdpl.md arckit-claude/templates/uae-pdpl-template.md .arckit/templates/uae-pdpl-template.md
git commit -m "feat(uae): add uae-pdpl command and template (PDPL)"
```

---

## Task B3: Author `uae-ias`

Same structural pattern as B2 with citation anchored on the UAE Cybersecurity Council IAS v2.

**Files:**
- Create: `arckit-claude/commands/uae-ias.md`
- Create: `arckit-claude/templates/uae-ias-template.md`
- Create: `.arckit/templates/uae-ias-template.md`

- [ ] **Step 1: Write the command file**

Use the Write tool to create `arckit-claude/commands/uae-ias.md` with:
- `description`: "Generate a UAE IAS Statement of Applicability against the 188 controls (60 management M1–M6 + 128 technical T1–T9), priority-tiered P1–P4. Anchored on the UAE Cybersecurity Council Information Assurance Standard v2."
- `argument-hint`: "<project ID or system description>"
- `effort: high`
- `handoffs`: `risks`, `uae-cloud-residency`
- Body: read prerequisites, read template, generate the SoA per control family with applicability + implementation status + priority tier + responsible owner. Authoritative anchor: UAE CSC IAS, primary URL `https://csc.gov.ae/en/w/uae-information-assurance-standard`.

- [ ] **Step 2: Write the template**

Use the Write tool to create `arckit-claude/templates/uae-ias-template.md` with sections:
- `## Document Control` with the `<!-- DOC-CONTROL-HEADER -->` marker
- `## Revision History`
- `## Executive Summary`
- `## Scope` (federal entity, CII sector if applicable, in-scope assets)
- `## Statement of Applicability` — table per control family (M1–M6, T1–T9) with columns: Control ID, Description, Priority (P1–P4), Applicable (Y/N), Implementation Status, Owner, Evidence ref
- `## Risk Treatment Plan` (gaps and target-state plan)
- `## CII Registration` (if applicable)
- `## External References` with one Document Register row pointing to the IAS publication

Mirror to `.arckit/templates/uae-ias-template.md`.

- [ ] **Step 3: Lint, dual-registration test, commit**

```bash
npx markdownlint-cli2 arckit-claude/commands/uae-ias.md arckit-claude/templates/uae-ias-template.md .arckit/templates/uae-ias-template.md
node scripts/tests/test-doc-types-dual-registration.mjs
git add arckit-claude/commands/uae-ias.md arckit-claude/templates/uae-ias-template.md .arckit/templates/uae-ias-template.md
git commit -m "feat(uae): add uae-ias command and template (IAS)"
```

---

## Task B4: Author `uae-cloud-residency`

Same pattern. Anchor: National Cloud Security Policy v2 (CSC).

**Files:**
- Create: `arckit-claude/commands/uae-cloud-residency.md`
- Create: `arckit-claude/templates/uae-cloud-residency-template.md`
- Create: `.arckit/templates/uae-cloud-residency-template.md`

- [ ] **Step 1: Write the command file**

Frontmatter:
- `description`: "Assess sovereign cloud residency under the UAE National Cloud Security Policy v2. Validates per-classification residency, names approved CSP options (Core42 / G42 sovereign / Microsoft UAE North + Central, TDRA FedNet, e& Sovereign Launchpad on AWS), and captures shared-responsibility matrix and exit/portability plan."
- `argument-hint`: "<project ID or service name>"
- `effort: high`
- `handoffs`: `uae-classification` (must complete first), `adr` (per material residency choice)
- Body: read prerequisites including the `uae-classification` register (must exist), read template, generate the residency assessment per dataset, validate that data classified Confidential and above resides on UAE-resident infrastructure. Authoritative anchor: National Cloud Security Policy v2, URL `https://csc.gov.ae/documents/38662/489552/National+Cloud+Security+Policy_V2.0.pdf`.

- [ ] **Step 2: Write the template**

Sections:
- Document Control marker, Revision History, Executive Summary
- `## Scope` (services in scope, dependencies on other services' residency posture)
- `## Per-Dataset Residency Assessment` — table mapping CLAS register Dataset ID → Classification → Required residency → Chosen CSP → Region → Compliance check
- `## CSP Due-Diligence Pack` — per CSP candidate (Core42/G42, Microsoft UAE, FedNet, e& AWS) the certification posture (DESC, CSC), regional footprint, sovereign-data scope
- `## Shared-Responsibility Matrix` — per CSP, division of security responsibilities
- `## Exit and Portability Plan`
- External References

Mirror to `.arckit/templates/`.

- [ ] **Step 3: Lint, test, commit**

```bash
npx markdownlint-cli2 arckit-claude/commands/uae-cloud-residency.md arckit-claude/templates/uae-cloud-residency-template.md .arckit/templates/uae-cloud-residency-template.md
node scripts/tests/test-doc-types-dual-registration.mjs
git add arckit-claude/commands/uae-cloud-residency.md arckit-claude/templates/uae-cloud-residency-template.md .arckit/templates/uae-cloud-residency-template.md
git commit -m "feat(uae): add uae-cloud-residency command and template (CRES)"
```

---

## Task B5: Phase B end-to-end validation on the v20 test repo

Verify the four federal data + security commands run cleanly on `arckit-test-project-v20-uae-moi-ipad` and produce coherent artefacts.

**Files:** No file changes; validation only.

- [ ] **Step 1: Update v20 plugin userConfig**

In `/tmp/uae-overlay-regression/v20-test/.claude/settings.json` (clone the repo first if not done), set:
```json
{
  "extraKnownMarketplaces": {
    "arc-kit": {
      "source": { "source": "github", "repo": "tractorjuice/arc-kit", "ref": "feat/uae-overlay-spec" }
    }
  },
  "enabledPlugins": { "arckit@arc-kit": true }
}
```

Note the use of `ref` (per memory: feedback_plugin_branch_testing) so the v20 repo loads the plugin from this feature branch.

- [ ] **Step 2: Run the four commands in order on a fresh project in v20**

In Claude Code session opened in v20:
```
/arckit.uae-classification 007-pathfinder-residency-pilot
/arckit.uae-pdpl 007-pathfinder-residency-pilot
/arckit.uae-ias 007-pathfinder-residency-pilot
/arckit.uae-cloud-residency 007-pathfinder-residency-pilot
```

- [ ] **Step 3: Verify artefacts landed**

```bash
ls -la /tmp/uae-overlay-regression/v20-test/projects/007-pathfinder-residency-pilot/
```
Expected: four artefacts present — `ARC-007-CLAS-v1.0.md`, `ARC-007-PDPL-v1.0.md`, `ARC-007-IAS-v1.0.md`, `ARC-007-CRES-v1.0.md`.

- [ ] **Step 4: Verify Document Control headers render the UAE block**

```bash
for art in /tmp/uae-overlay-regression/v20-test/projects/007-pathfinder-residency-pilot/ARC-007-*.md; do
  grep -q "Federal Entity" "$art" && grep -q "Cabinet Instrument" "$art" && echo "$art OK" || echo "$art MISSING UAE block"
done
```
Expected: 4 lines, all `OK`.

- [ ] **Step 5: Verify classification labels are UAE Smart Data**

```bash
for art in /tmp/uae-overlay-regression/v20-test/projects/007-pathfinder-residency-pilot/ARC-007-*.md; do
  grep -E "Open / Shared / Confidential / Secret / Top Secret" "$art" > /dev/null && echo "$art OK" || echo "$art WRONG LADDER"
done
```
Expected: 4 lines, all `OK`.

- [ ] **Step 6: Verify citation traceability**

For each of the four artefacts, confirm the External References section names the correct primary URL (`u.ae` for CLAS, `uaelegislation.gov.ae` for PDPL, `csc.gov.ae` for IAS and CRES).

- [ ] **Step 7: Append Phase B regression result**

Append to `docs/superpowers/plans/2026-04-30-uae-federal-overlay-regression-log.md`:

```markdown
## Phase B regression (YYYY-MM-DD)

- v20 uae-moi-ipad: 4 artefacts produced, UAE Document Control rendered correctly, citations verified.

Phase B complete. Proceeding to Phase C.
```

- [ ] **Step 8: Commit**

```bash
git add docs/superpowers/plans/2026-04-30-uae-federal-overlay-regression-log.md
git commit -m "test(uae): Phase B end-to-end clean on v20 test repo"
```

---

# PHASE C — IDENTITY + CABINET INSTRUMENTS + AI + PROCUREMENT (8)

Eight commands authored on the same template, command, mirror, lint, test, commit cycle as Phase B. Tasks C1–C8 are independent.

## Task C1: Author `uae-uaepass`

Anchor: UAE Pass (TDRA + ICP). URL: https://docs.uaepass.ae/

Frontmatter `description`: "Generate UAE Pass integration design (OIDC/OAuth flow, claim mapping, Basic vs Verified profile selection, Service Provider onboarding pack, e-signature audit trail design)."
Handoffs: `integration`, `adr`.
Template sections: Document Control marker, Scope, Authentication Flow Diagram (Mermaid), Profile Selection (Basic vs Verified), Claim Mapping table, Service Provider Onboarding checklist, E-signature Audit Trail design, External References.

Run: lint, dual-registration test, commit with message `feat(uae): add uae-uaepass command and template (UPASS)`.

## Task C2: Author `uae-zero-bureaucracy`

Anchor: UAE Code for Government Services and Zero Bureaucracy (Cabinet Affairs). URL: https://mediaoffice.ae/en/news/2026/april/23-04/mohammed-bin-rashid-chairs-uae-cabinet-meeting

Frontmatter `description`: "Generate a Service Catalogue review under the UAE Code for Government Services and Zero Bureaucracy. Captures service catalogue mapping, bureaucracy-elimination baseline, and customer-experience KPIs."
`keep-coding-instructions: true` (long synthesis).
Handoffs: `uae-priorities-alignment`.
Template sections: Document Control marker, Service Catalogue Mapping, Bureaucracy Elimination Baseline (current vs target steps, fields, time, cost), Customer Experience KPIs, Code Compliance Statement.

Run: lint, dual-registration test, commit with message `feat(uae): add uae-zero-bureaucracy command and template (ZBUR)`.

## Task C3: Author `uae-digital-records`

Anchor: Government Services Digital Records Policy (Cabinet Affairs). Same Cabinet announcement URL.

Frontmatter `description`: "Generate a Digital Records Plan under the UAE Government Services Digital Records Policy. Captures the source-of-truth register per service, retention schedule, and records-as-official-source designation."
`keep-coding-instructions: true`.
Handoffs: `data-model`, `uae-data-sharing`.
Template sections: Document Control marker, Source-of-Truth Register, Retention Schedule, Records-as-Official-Source Designation, Records Lifecycle, Audit & Disposal procedures.

Run: lint, test, commit `feat(uae): add uae-digital-records command and template (DREC)`.

## Task C4: Author `uae-data-sharing`

Anchor: Government Services Data Sharing Policy ("collect once, use securely"). Same Cabinet URL.

Frontmatter `description`: "Generate a Data Sharing Agreement under the UAE Government Services Data Sharing Policy. Captures collect-once mapping, federation/API plan, and PDPL lawful basis per share."
`keep-coding-instructions: true`.
Handoffs: `integration`, `uae-pdpl`.
Template sections: Document Control marker, Sharing Parties, Datasets Shared (with Dataset IDs from CLAS register), Lawful Basis per Share, Federation/API Mechanism, Information-Security Safeguards, Data-Subject Rights Implications.

Run: lint, test, commit `feat(uae): add uae-data-sharing command and template (DSHR)`.

## Task C5: Author `uae-priorities-alignment`

Anchor: Federal Government Guide to Aligning Digital Government Projects with National Priorities. Same Cabinet URL plus references to NIS 2031 (https://u.ae/en/about-the-uae/strategies-initiatives-and-awards/strategies-plans-and-visions/finance-and-economy/we-the-uae-2031-vision), AI Strategy 2031, Digital Economy Strategy.

Frontmatter `description`: "Generate a National Priorities Alignment Statement under the UAE Federal Government Guide. Captures reuse-vs-build justification, capability-reuse register (UAE Pass, FedNet), and strategy alignment to NIS 2031 / AI 2031 / Digital Economy Strategy / We the UAE 2031."
`keep-coding-instructions: true`.
Handoffs: `sobc`, `uae-uaepass`.
Template sections: Document Control marker, Strategic Alignment Matrix (per strategy), Reuse-vs-Build Justification, Capability Reuse Register, Resource-Efficiency Calculation, Feasibility & Pilot Plan.

Run: lint, test, commit `feat(uae): add uae-priorities-alignment command and template (NPRA)`.

## Task C6: Author `uae-ai-charter`

Anchor: UAE Charter for the Development and Use of AI. URL: https://uaelegislation.gov.ae/en/policy/details/the-uae-charter-for-the-development-and-use-of-artificial-intelligence

Frontmatter `description`: "Generate a UAE Charter for AI compliance assessment against the 12 principles (human-machine ties, safety, bias mitigation, data privacy, transparency, human oversight, governance/accountability, technological excellence, human commitment, peaceful coexistence, inclusive access, lawful compliance)."
Handoffs: `uae-ai-autonomy-tier`, `risks`.
Template sections: Document Control marker, AI System Inventory, 12-Principle Assessment table (one row per principle: principle, applies?, evidence, gap, mitigation), Bias & Fairness Assessment, Human-in-the-Loop Design.

Run: lint, test, commit `feat(uae): add uae-ai-charter command and template (AICH)`.

## Task C7: Author `uae-ai-autonomy-tier`

Anchor: lifted from v20 test repo NFR-SEC-7 / P27 (no public regulatory anchor — internal ArcKit synthesis based on the federal three-tier model).

Frontmatter `description`: "Generate a three-tier AI autonomy posture (Tier 1 internal-productivity, Tier 2 investor-facing-with-approval, Tier 3 regulated/financial). Captures per-tier guard-rails, approval gates, audit obligations, and tier-promotion criteria."
Handoffs: `adr`, `risks`.
Template sections: Document Control marker, AI Use-Case Inventory (mapped to tier), Per-Tier Guard-Rail Matrix (Tier 1, 2, 3), Approval Gates per Tier, Audit Obligations per Tier, Tier-Promotion Criteria.

Run: lint, test, commit `feat(uae): add uae-ai-autonomy-tier command and template (AUTI)`.

## Task C8: Author `uae-procurement`

Anchor: Federal Decree-Law 11/2023. URL: https://mof.gov.ae/wp-content/uploads/2024/01/Federal-Law-No.-11-of-2023-on-Procurements-in-the-Federal-Government.pdf

Frontmatter `description`: "Generate a federal procurement strategy under UAE Federal Decree-Law 11/2023. Produces ITT/RFP packs against the MoF Digital Procurement Platform templates, In-Country Value (ICV) plan, evaluation report structure, and contract register."
Handoffs: `evaluate`, `sobc`.
Template sections: Document Control marker, Procurement Strategy, ITT/RFP Pack Outline (DPP-aligned), ICV Plan, Evaluation Methodology, Contract Register Schema.

Run: lint, test, commit `feat(uae): add uae-procurement command and template (FPRO)`.

---

## Task C9: Phase C end-to-end canonical chain on v20

Run the full canonical chain (`uae-classification` through `uae-procurement`) end to end on the v20 test repo. Verify all 12 artefacts land correctly with handoff continuity.

**Files:** Validation only.

- [ ] **Step 1: Run the chain**

In v20 Claude Code session, on the `007-pathfinder-residency-pilot` project from Task B5, continue the chain:
```
/arckit.uae-uaepass 007-pathfinder-residency-pilot
/arckit.uae-data-sharing 007-pathfinder-residency-pilot
/arckit.uae-digital-records 007-pathfinder-residency-pilot
/arckit.uae-zero-bureaucracy 007-pathfinder-residency-pilot
/arckit.uae-ai-charter 007-pathfinder-residency-pilot
/arckit.uae-ai-autonomy-tier 007-pathfinder-residency-pilot
/arckit.uae-priorities-alignment 007-pathfinder-residency-pilot
/arckit.uae-procurement 007-pathfinder-residency-pilot
```

- [ ] **Step 2: Verify all 12 artefacts present**

```bash
ls /tmp/uae-overlay-regression/v20-test/projects/007-pathfinder-residency-pilot/ARC-007-*.md | wc -l
```
Expected: at least 12 ARC-007 files (the four from Phase B plus the eight from Phase C).

- [ ] **Step 3: Verify each artefact's type code matches its filename and is registered**

```bash
for art in /tmp/uae-overlay-regression/v20-test/projects/007-pathfinder-residency-pilot/ARC-007-*.md; do
  code=$(echo "$art" | grep -oE 'ARC-007-([A-Z]+)' | sed 's/ARC-007-//')
  grep -q "'$code':" arckit-claude/config/doc-types.mjs && echo "$code OK" || echo "$code UNREGISTERED"
done
```
Expected: 12 lines, all `OK`.

- [ ] **Step 4: Verify handoff continuity**

For each artefact, manually confirm the External References section cites the right anchor and that downstream artefacts (e.g. `DSHR` references `CLAS` Dataset IDs and `PDPL` lawful bases).

- [ ] **Step 5: Multi-AI sanity check**

Generate a Codex-targeted scaffold:
```bash
cd /tmp && rm -rf multi-ai-test && mkdir multi-ai-test && cd multi-ai-test
arckit init . --ai codex --no-git
ls .agents/skills/arckit-uae-pdpl/
```
Expected: the `arckit-uae-pdpl` skill directory exists with `SKILL.md` and `agents/openai.yaml`.

Repeat for `--ai gemini`, `--ai opencode`, `--ai copilot` (one command spot-check on each).

- [ ] **Step 6: Append Phase C regression result and commit**

Append to the regression log:

```markdown
## Phase C regression (YYYY-MM-DD)

- v20 canonical chain: 12 artefacts produced, type codes registered, handoffs verified.
- Multi-AI sanity check: codex/gemini/opencode/copilot scaffolds emit uae-* commands.

Phase C complete. Proceeding to Phase D.
```

```bash
git add docs/superpowers/plans/2026-04-30-uae-federal-overlay-regression-log.md
git commit -m "test(uae): Phase C canonical chain clean on v20; multi-AI scaffolds verified"
```

---

# PHASE D — DOCUMENTATION + RELEASE

## Task D1: Author the overlay guide and maintenance doc

**Files:**
- Create: `docs/guides/uae-overlay.md`
- Create: `docs/guides/uae-overlay-maintenance.md`

- [ ] **Step 1: Write `docs/guides/uae-overlay.md`**

Use the Write tool. Sections required: Purpose, When to Use, Prerequisites (plugin userConfig setup), The 12 Commands (one paragraph per command with anchor + handoffs), The Canonical Chain, Document Control rendering explanation, Migration from UK ladder (links to `arckit migrate-classification`), Known Limitations (links to maintenance doc), Contributing (Help wanted callout for UAE domain co-maintainer).

- [ ] **Step 2: Write `docs/guides/uae-overlay-maintenance.md`**

Use the Write tool. Sections required:
- Citation Register (table: regulation, full title, authority, primary URL, verified date, next review date — one row per regulation cited by any uae-* command)
- Quarterly Review Cadence (process)
- Known Limitations / Not-Verified Items (the six explicit gaps from the spec — PDPL Executive Regulation status, Smart Data Classifications exact level names, UAE Pass LoA-to-eIDAS mapping, AWS me-south-1 acceptability, Central Bank AI guidance, Cabinet Affairs vs National Archives ownership)
- Open GitHub Issues (links to one issue per gap)
- Help Wanted (UAE domain co-maintainer recruiting brief)
- v4.10 / v5.0 Backlog (Federal Mandate doc-types category; uae-translate; sector overlays; sovereign-vendor evaluation)

- [ ] **Step 3: Lint and commit**

```bash
npx markdownlint-cli2 docs/guides/uae-overlay.md docs/guides/uae-overlay-maintenance.md
git add docs/guides/uae-overlay.md docs/guides/uae-overlay-maintenance.md
git commit -m "docs(uae): add overlay guide and maintenance reference"
```

## Task D2: Update README, dependency matrix, workflow diagrams

**Files:**
- Modify: `README.md`
- Modify: `docs/index.html`
- Modify: `docs/DEPENDENCY-MATRIX.md`
- Modify: `docs/WORKFLOW-DIAGRAMS.md`

- [ ] **Step 1: Update `README.md`**

Use the Edit tool to update the command count (find every occurrence of `68 commands` or similar and update to `80 official commands` and recompute community totals). Add a new section `## UAE Federal Overlay` after the existing `## EU and French Regulatory Overlay` section, listing the 12 commands grouped by category.

- [ ] **Step 2: Update `docs/index.html`**

Add the 12 commands to the commands table. Match the existing table structure for EU/FR/Austrian commands. Update any "command count" badge.

- [ ] **Step 3: Update `docs/DEPENDENCY-MATRIX.md`**

Add 12 rows for the UAE commands, each with their handoffs as listed in the Phase B/C task descriptions.

- [ ] **Step 4: Update `docs/WORKFLOW-DIAGRAMS.md`**

Add a new section `## UAE Federal Workflow` with a Mermaid diagram showing the canonical chain `principles → uae-classification → uae-pdpl → ... → sobc → wardley → framework`.

- [ ] **Step 5: Lint and commit**

```bash
npx markdownlint-cli2 README.md docs/DEPENDENCY-MATRIX.md docs/WORKFLOW-DIAGRAMS.md
git add README.md docs/index.html docs/DEPENDENCY-MATRIX.md docs/WORKFLOW-DIAGRAMS.md
git commit -m "docs: update README, index, dependency matrix, workflow diagrams for UAE overlay"
```

## Task D3: Author the launch article and hero

**Files:**
- Create: `docs/articles/2026-04-30-uae-overlay-launch.md`
- Create: `docs/articles/generate-hero-uae-overlay-launch.py`
- Create: `docs/articles/2026-04-30-uae-overlay-launch-hero.png` (output of generator)

- [ ] **Step 1: Write the article**

Long-form essay matching the existing `2026-04-19-v470-eu-french-regulatory.md` voice and structure. Title: "ArcKit v4.10: 12 UAE Federal Commands, Official Baseline". Sections: opening hook (Cabinet decree of 23 April), what's in the release (the 12 commands), why official-tier and not community, the Document Control conditional, the v20 reference repo, what's deferred, what's next.

- [ ] **Step 2: Write the hero generator (visually distinct from the three UAE articles already shipped)**

Use one of the existing `generate-hero-*.py` scripts as a template. Suggested visual: 12 command cards in a 4×3 grid with category-coded colours, plus an "Official Baseline" badge, plus the four Cabinet instruments highlighted.

- [ ] **Step 3: Generate the PNG**

```bash
python docs/articles/generate-hero-uae-overlay-launch.py
ls -la docs/articles/2026-04-30-uae-overlay-launch-hero.png
```
Expected: 1200×630 PNG.

- [ ] **Step 4: Lint and commit**

```bash
npx markdownlint-cli2 docs/articles/2026-04-30-uae-overlay-launch.md
git add docs/articles/2026-04-30-uae-overlay-launch.md docs/articles/generate-hero-uae-overlay-launch.py docs/articles/2026-04-30-uae-overlay-launch-hero.png
git commit -m "docs(articles): publish v4.10 UAE Federal Overlay launch article and hero"
```

## Task D4: One-time `arckit migrate-classification` helper

**Files:**
- Create: `scripts/python/migrate_classification.py`
- Modify: `src/arckit_cli/__init__.py` (wire in CLI subcommand)

- [ ] **Step 1: Write the migration script**

Use the Write tool to create `scripts/python/migrate_classification.py`:

```python
#!/usr/bin/env python3
"""
arckit migrate-classification — one-time helper for the v4.10 UAE overlay.

Walks projects/ for ARC-* artefacts, proposes a UAE Smart Data classification
for each based on the existing UK ladder value, and produces a unified diff
the architect can review before committing. Does NOT modify files.

Mapping:
  PUBLIC            → Open
  OFFICIAL          → Shared
  OFFICIAL-SENSITIVE → Confidential
  SECRET            → Secret  (no change)
  TOP SECRET        → Top Secret (no change; rare in ArcKit corpora)

Use:
  arckit migrate-classification              # report only, propose mappings
  arckit migrate-classification --apply      # write the changes (architect-approved)
"""
import argparse
import re
import sys
from pathlib import Path

MAPPING = {
    "PUBLIC": "Open",
    "OFFICIAL": "Shared",
    "OFFICIAL-SENSITIVE": "Confidential",
    "SECRET": "Secret",
    "TOP SECRET": "Top Secret",
}

CLASSIFICATION_LINE = re.compile(
    r"^(\|\s*\*\*Classification\*\*\s*\|\s*)(PUBLIC|OFFICIAL|OFFICIAL-SENSITIVE|SECRET|TOP SECRET)(\s*\|)$",
    re.MULTILINE,
)

def propose(text: str) -> tuple[str, list[tuple[str, str]]]:
    changes = []
    def replace(match):
        old = match.group(2)
        new = MAPPING.get(old, old)
        changes.append((old, new))
        return f"{match.group(1)}{new}{match.group(3)}"
    new_text = CLASSIFICATION_LINE.sub(replace, text)
    return new_text, changes

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Apply the proposed mappings (default: report only)")
    parser.add_argument("--root", default="projects", help="Root directory to walk (default: projects)")
    args = parser.parse_args()

    root = Path(args.root)
    if not root.is_dir():
        print(f"not a directory: {root}", file=sys.stderr)
        return 2

    total_files = 0
    total_changes = 0
    for art in sorted(root.glob("**/ARC-*.md")):
        text = art.read_text(encoding="utf-8")
        new_text, changes = propose(text)
        if not changes:
            continue
        total_files += 1
        for old, new in changes:
            total_changes += 1
            print(f"{art}: {old} → {new}")
        if args.apply:
            art.write_text(new_text, encoding="utf-8")

    action = "applied" if args.apply else "proposed (use --apply to write)"
    print(f"\n{total_changes} change(s) {action} across {total_files} file(s).")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Wire it into the CLI**

In `src/arckit_cli/__init__.py`, add a `migrate-classification` Typer subcommand that invokes the script.

(Inspect the existing `arckit init` and `arckit check` subcommands and follow the same pattern.)

- [ ] **Step 3: Smoke-test on a temporary clone**

```bash
cd /tmp && rm -rf v8-migrate-test && cp -r /tmp/uae-overlay-regression/v8 v8-migrate-test
cd v8-migrate-test && python /workspaces/arc-kit/scripts/python/migrate_classification.py --root projects | head -20
```
Expected: a list of `OFFICIAL → Shared` etc proposals. No files modified.

```bash
python /workspaces/arc-kit/scripts/python/migrate_classification.py --root projects --apply
git -C /tmp/v8-migrate-test diff --stat | head -5
```
Expected: a small diff in the Classification lines. Discard the test repo afterwards.

- [ ] **Step 4: Commit**

```bash
git add scripts/python/migrate_classification.py src/arckit_cli/__init__.py
git commit -m "feat(cli): add migrate-classification one-time helper for UAE overlay"
```

## Task D5: CODEOWNERS, CHANGELOG, version bump, tag, push

**Files:**
- Modify: `.github/CODEOWNERS`
- Modify: `CHANGELOG.md`
- Modify: 15 version files via `scripts/bump-version.sh`

- [ ] **Step 1: Update CODEOWNERS**

Use the Edit tool to append:

```
# UAE Federal Overlay — official baseline, maintained by @tractorjuice (recruiting UAE domain co-maintainer)
arckit-claude/commands/uae-*.md                @tractorjuice
arckit-claude/templates/uae-*-template.md      @tractorjuice
.arckit/templates/uae-*-template.md            @tractorjuice
```

- [ ] **Step 2: Update CHANGELOG**

Use the Edit tool. Add a new top entry under `# Changelog`:

```markdown
## [4.10.0] - 2026-04-30

### Added

- 12-command UAE Federal Overlay as official baseline (68 → 80 commands):
  - Federal data + security: `uae-classification`, `uae-pdpl`, `uae-ias`, `uae-cloud-residency`
  - Federal identity: `uae-uaepass`
  - Cabinet instruments: `uae-zero-bureaucracy`, `uae-digital-records`, `uae-data-sharing`, `uae-priorities-alignment`
  - AI governance: `uae-ai-charter`, `uae-ai-autonomy-tier`
  - Procurement: `uae-procurement`
- New `classification_scheme` plugin userConfig (UK or UAE Smart Data).
- `arckit migrate-classification` one-time CLI helper for migrating existing artefacts from UK ladder to UAE Smart Data.
- Dual-registration CI test catching `doc-types.mjs`/`pages.md` drift.
- New guide `docs/guides/uae-overlay.md` and maintenance doc `docs/guides/uae-overlay-maintenance.md`.

### Changed

- `governance_framework` userConfig description extended to recommend `UAE Federal` as a third value.
- All ~83 templates per directory: Document Control table replaced with `<!-- DOC-CONTROL-HEADER -->` marker resolved at command-execution time.

### Breaking changes

None. Non-UAE projects produce byte-identical Document Control output to v4.9.4.

### Deferred to v4.11 / v5.0

- Bilingual Arabic / English (`uae-translate`).
- Federal Mandate doc-types category (currently the four Cabinet instruments sit under `Governance`).
- Sector overlays (ADHICS, Dubai ISR) as community contributions.
```

- [ ] **Step 3: Run the version bump**

```bash
./scripts/bump-version.sh 4.10.0
git status --short
```
Expected: 15 version files updated.

- [ ] **Step 4: Run the converter to regenerate non-Claude variants**

```bash
python scripts/converter.py
git status --short
```
Expected: changes under `.codex/`, `.opencode/`, `arckit-codex/`, `arckit-opencode/`, `arckit-gemini/`, `arckit-copilot/` covering the 12 new commands.

- [ ] **Step 5: Commit version bump and converter output**

```bash
git add -A
git commit -m "chore: bump version to 4.10.0 and regenerate non-Claude variants for UAE overlay"
```

- [ ] **Step 6: Push and tag (after PR merge)**

This step runs **after** the PR opens, is reviewed, and merges to main. Do not tag from the feature branch.

```bash
# After merge to main:
git checkout main && git pull
git tag -a v4.10.0 -m "v4.10.0 — UAE Federal Overlay"
git push --tags
./scripts/push-extensions.sh
```

The GitHub Release is created automatically by `.github/workflows/release.yml` on tag push.

- [ ] **Step 7: Open the PR for the implementation**

```bash
gh pr create --title "feat: UAE Federal Overlay (v4.10.0)" --body "$(cat <<'EOF'
## Summary

Implements the UAE Federal Overlay design spec (`docs/superpowers/specs/2026-04-30-uae-overlay-design.md`).

- 12 new official-baseline `uae-*` commands (count 68 → 80).
- New `classification_scheme` plugin userConfig.
- Document Control marker substitution across all ~83 templates per directory.
- Dual-registration CI test.
- One-time `arckit migrate-classification` CLI helper.
- New guide and maintenance doc.
- Launch article and hero.
- Version bumped to v4.10.0; non-Claude variants regenerated.

## Test plan

- [x] CI: markdown lint, dual-registration test, converter round-trip.
- [x] Phase A regression sweep clean on v3 / v8 / v17 (UK/Generic ladder unchanged).
- [x] Phase B end-to-end clean on v20 (4 federal data + security commands).
- [x] Phase C canonical chain clean on v20 (12 artefacts, handoffs verified).
- [x] Multi-AI sanity check: codex / gemini / opencode / copilot scaffolds.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# Post-ship (Phase E — outside the implementation plan)

After the v4.10.0 tag lands:

1. Open one tracking issue per not-verified citation (six issues from the spec maintenance doc).
2. Open the "Help wanted: UAE domain co-maintainer" recruiting issue.
3. Update memory file `project_uae_overlay.md` with the launch date and key decisions.
4. After two stable weeks, plan v4.11 (Federal Mandate doc-types category, `uae-translate`).

---

# Self-Review Checklist (writing-plans skill)

After writing the complete plan, the following inline check has been performed:

**1. Spec coverage:**

- [x] Section 1 (Summary) → covered by Tasks A1, A3, B1–B4, C1–C8.
- [x] Section 2 (Locked constraints) → encoded in command frontmatter (no `[COMMUNITY]` prefix, official Template Origin) and the userConfig values.
- [x] Section 3 (12 commands + handoffs) → Tasks B1–B4 + C1–C8.
- [x] Section 4 (userConfig) → Task A1.
- [x] Section 5 (Document Control conditional + classification rendering) → Tasks A2, A6, A7.
- [x] Section 6 (File inventory) → covered across all tasks; the 5 docs land in D1+D3.
- [x] Section 7 (Validation) → static (Task A5), behavioural (Tasks A8, B5, C9).
- [x] Section 8 (Rollout) → maps directly to Phase A/B/C/D.
- [x] Section 9 (Risks + deferrals) → addressed in Phase D maintenance doc; deferrals listed in CHANGELOG and maintenance doc backlog.
- [x] Section 10 (Acceptance criteria) → encoded in Task D5 PR test plan checkboxes.
- [x] Section 11 (References) → already in repo from spec PR.

**2. Placeholder scan:** all `[bracketed]` strings in this plan are intentional template placeholders that the implementer fills (project IDs, dates, etc.), or example content the implementer writes. No `TBD` / `TODO` / "fill in" anywhere.

**3. Type consistency:** the 12 type codes are referenced identically across Task A3 (registration), A4 (pages.md mirror), B/C (per-command tasks), C9 (validation grep), D2 (dependency matrix), D5 (CHANGELOG). Verified by visual scan against the spec Section 3 table.
