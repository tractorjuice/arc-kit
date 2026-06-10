# arckit-uk-gcloud Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `arckit-uk-gcloud`, the 13th ArcKit marketplace plugin — a Proprietary, supplier-side G-Cloud bid-authoring overlay (11 commands, 8 doc-types, 3 skills) ported from the standalone `gcloud-kit` plugin and composed with ArcKit core.

**Architecture:** A community overlay that requires `arckit` core and reuses its `projects/` + `ARC-` artefact model. Each G-Cloud service = one ArcKit project; supplier-wide docs live in `projects/000-global/supplier/`. Domain content (SDD question sets, NCSC mappings, declaration, pricing, skills) is ported intact from gcloud-kit; the scaffolding (paths, IDs, Document Control, frontmatter) is rewritten to ArcKit conventions. The plugin ships Proprietary inside the otherwise-MIT repo via per-plugin LICENSE + a repo-root carve-out.

**Tech Stack:** Claude Code plugin (Markdown commands/templates/skills, JSON manifests), Node ESM config + CI guard scripts (`scripts/tests/*.mjs`), Python converter (`scripts/converter.py`), bash helpers (`scripts/bash/*`), `claude plugin tag` validation.

**Spec:** `docs/specs/2026-06-10-arckit-uk-gcloud-overlay-design.md`

**Branch:** `feat/arckit-uk-gcloud-overlay` (already created; spec committed).

**Porting note:** "Port" = copy the gcloud-kit source file, then apply the transformation listed in the spec's §7 Source-mapping table. The source file IS the content; each task names the source path and the exact transformation. Keep domain prose verbatim; rewrite only the scaffolding.

---

## Conventions used throughout

- **Commit after every task.** Use `git add <explicit paths>` then `git reset HEAD <pre-existing tracked file>` if needed — never `git add -A` (sessions.md and other tracked files must not be swept in).
- **Dual-location templates:** every template is written to BOTH `plugins/arckit-uk-gcloud/templates/` and `.arckit/templates/`.
- **Colon notation:** all command references use `/arckit:X` (CI-guarded by `scripts/standardise-colon.py --check`).
- **Version:** current repo version is `5.12.1`; the new plugin's `plugin.json` version and `arckit` dependency pin both use the CURRENT version at scaffold time (the release bump later moves all in lockstep).

---

## Task 0: Clone gcloud-kit source for porting

**Files:**
- Create: `/tmp/gcloud-kit/` (working clone, not committed)

- [ ] **Step 1: Clone the source repo**

Run:
```bash
cd /tmp && rm -rf gcloud-kit && gh repo clone tractorjuice/gcloud-kit -- --depth 1
```
Expected: `Cloning into 'gcloud-kit'...` and `/tmp/gcloud-kit/plugin/commands/` exists.

- [ ] **Step 2: Verify the source files referenced by this plan exist**

Run:
```bash
ls /tmp/gcloud-kit/plugin/commands/{supplier-profile,service-design,sdd-lot1,sdd-lot2,sdd-lot3,declaration,pricing,security,compare,review,submission-pack}.md \
   /tmp/gcloud-kit/plugin/templates/{supplier-profile,service-design,sdd-lot1,sdd-lot2,sdd-lot3,declaration,pricing,security}-template.md
ls -d /tmp/gcloud-kit/plugin/skills/{gcloud-framework,cloud-security,sfia-skills}
```
Expected: every path lists without error.

(No commit — `/tmp` is not in the repo.)

---

## Task 1: Scaffold the plugin skeleton + manifest

**Files:**
- Create: `plugins/arckit-uk-gcloud/.claude-plugin/plugin.json`
- Create: `plugins/arckit-uk-gcloud/VERSION`
- Create: `plugins/arckit-uk-gcloud/commands/.gitkeep`, `.../templates/.gitkeep`, `.../skills/.gitkeep`, `.../recipes/.gitkeep`

- [ ] **Step 1: Create the directory tree**

Run:
```bash
mkdir -p plugins/arckit-uk-gcloud/.claude-plugin \
         plugins/arckit-uk-gcloud/commands \
         plugins/arckit-uk-gcloud/templates \
         plugins/arckit-uk-gcloud/skills \
         plugins/arckit-uk-gcloud/recipes
```

- [ ] **Step 2: Write `plugins/arckit-uk-gcloud/.claude-plugin/plugin.json`**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "arckit-uk-gcloud",
  "version": "5.12.1",
  "defaultEnabled": false,
  "description": "UK G-Cloud Supplier Bid-Authoring Overlay for ArcKit — 11 supplier-side commands that drive a G-Cloud 14 Digital Marketplace submission end to end: supplier profile, service design, Service Definition Documents (Lots 1/2/3), supplier declaration, pricing, NCSC Cloud Security Principles assertions, competitor benchmark, submission review, and CCS submission packaging. Recipe: uk-gcloud-submission. Requires arckit core plugin. PROPRIETARY — not covered by the repository MIT licence. EXPERIMENTAL.",
  "author": {
    "name": "TractorJuice",
    "url": "https://github.com/tractorjuice"
  },
  "homepage": "https://arckit.org",
  "repository": "https://github.com/tractorjuice/arc-kit",
  "license": "Proprietary",
  "keywords": [
    "architecture",
    "governance",
    "uk",
    "gcloud",
    "g-cloud",
    "digital-marketplace",
    "ccs",
    "crown-commercial-service",
    "procurement",
    "supplier",
    "sdd",
    "bid"
  ],
  "dependencies": [
    {
      "name": "arckit",
      "version": "=5.12.1"
    }
  ]
}
```

- [ ] **Step 3: Write `plugins/arckit-uk-gcloud/VERSION`**

```
5.12.1
```

- [ ] **Step 4: Add .gitkeep placeholders so empty dirs commit**

Run:
```bash
touch plugins/arckit-uk-gcloud/{commands,templates,skills,recipes}/.gitkeep
```

- [ ] **Step 5: Validate the manifest is well-formed JSON**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('plugins/arckit-uk-gcloud/.claude-plugin/plugin.json','utf8')); console.log('OK')"
```
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add plugins/arckit-uk-gcloud/.claude-plugin/plugin.json plugins/arckit-uk-gcloud/VERSION plugins/arckit-uk-gcloud/{commands,templates,skills,recipes}/.gitkeep
git commit -m "feat(uk-gcloud): scaffold plugin skeleton + manifest"
```

---

## Task 2: Register the 8 doc-types (TDD via dual-registration guard)

**Files:**
- Modify: `plugins/arckit-claude/config/doc-types.mjs` (Procurement block, after `GCLC` at line ~92)
- Modify: `plugins/arckit-claude/commands/pages.md` (Procurement section ~line 255–256, and the category row ~line 59)
- Test: `scripts/tests/test-doc-types-dual-registration.mjs`

- [ ] **Step 1: Run the dual-registration guard to confirm baseline GREEN**

Run:
```bash
node scripts/tests/test-doc-types-dual-registration.mjs
```
Expected: PASS (exit 0). This is the baseline before changes.

- [ ] **Step 2: Add the 8 codes to `doc-types.mjs` ONLY (expect the guard to then FAIL)**

In `plugins/arckit-claude/config/doc-types.mjs`, immediately after the `'GCLC':` line in the `// Procurement` block, insert:

```javascript
  // G-Cloud supplier bid-authoring (community overlay: arckit-uk-gcloud)
  'SUPP':      { name: 'Supplier Profile',                 category: 'Procurement', regime: 'UK' },
  'SVCD':      { name: 'Service Design',                   category: 'Procurement', regime: 'UK' },
  'SDD':       { name: 'Service Definition Document',      category: 'Procurement', regime: 'UK', severity: 'HIGH' },
  'DECL':      { name: 'Supplier Declaration',             category: 'Procurement', regime: 'UK', severity: 'HIGH' },
  'PRIC':      { name: 'Pricing Document',                 category: 'Procurement', regime: 'UK' },
  'SECA':      { name: 'Security Assertions',              category: 'Procurement', regime: 'UK', severity: 'HIGH' },
  'GCMP':      { name: 'G-Cloud Competitor Benchmark',     category: 'Procurement', regime: 'UK' },
  'GCRV':      { name: 'G-Cloud Submission Review',        category: 'Procurement', regime: 'UK' },
```

- [ ] **Step 3: Run the guard — verify it FAILS (codes missing from pages.md)**

Run:
```bash
node scripts/tests/test-doc-types-dual-registration.mjs
```
Expected: FAIL listing `SUPP, SVCD, SDD, DECL, PRIC, SECA, GCMP, GCRV` as present in doc-types.mjs but missing from pages.md.

- [ ] **Step 4: Add the matching rows to `pages.md`**

In `plugins/arckit-claude/commands/pages.md`, in the `**Procurement**` table after the `GCLC` row (~line 256), insert:

```markdown
| | SUPP | `ARC-*-SUPP-*.md` | Supplier Profile |
| | SVCD | `ARC-*-SVCD-*.md` | Service Design |
| | SDD | `ARC-*-SDD-*.md` | Service Definition Document |
| | DECL | `ARC-*-DECL-*.md` | Supplier Declaration |
| | PRIC | `ARC-*-PRIC-*.md` | Pricing Document |
| | SECA | `ARC-*-SECA-*.md` | Security Assertions |
| | GCMP | `ARC-*-GCMP-*.md` | G-Cloud Competitor Benchmark |
| | GCRV | `ARC-*-GCRV-*.md` | G-Cloud Submission Review |
```

Also append the eight command stems to the Procurement category row (~line 59) so the dashboard groups them:
```markdown
| Procurement | sow, evaluate, dos, gcloud-search, gcloud-clarify, procurement, supplier-profile, service-design, sdd-lot1, sdd-lot2, sdd-lot3, declaration, pricing, security, gcloud-competitors, review |
```

- [ ] **Step 5: Run the guard — verify it PASSES**

Run:
```bash
node scripts/tests/test-doc-types-dual-registration.mjs
```
Expected: PASS (exit 0).

- [ ] **Step 6: Run the regime guard (no change expected, UK already registered)**

Run:
```bash
node scripts/tests/test-regime-registration.mjs
```
Expected: PASS. (`UK` is already in `REGIMES`/`REGIME_LABELS`; no edit needed.)

- [ ] **Step 7: Commit**

```bash
git add plugins/arckit-claude/config/doc-types.mjs plugins/arckit-claude/commands/pages.md
git commit -m "feat(uk-gcloud): register 8 G-Cloud supplier doc-types (SUPP/SVCD/SDD/DECL/PRIC/SECA/GCMP/GCRV)"
```

---

## Task 3: Add the marketplace.json entry

**Files:**
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Add the plugin entry**

In `.claude-plugin/marketplace.json`, add to the `plugins` array (keep existing formatting/ordering — place after the other UK overlays):

```json
    {
      "name": "arckit-uk-gcloud",
      "source": "./plugins/arckit-uk-gcloud",
      "description": "UK G-Cloud supplier bid-authoring overlay — 11 supplier-side commands driving a G-Cloud 14 Digital Marketplace submission end to end. Requires arckit core. Proprietary, experimental.",
      "license": "Proprietary",
      "category": "productivity"
    }
```

- [ ] **Step 2: Validate JSON**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json','utf8')); console.log('OK')"
```
Expected: `OK`

- [ ] **Step 3: Confirm the bump-version drift check passes (disk plugin now in marketplace.json)**

Run:
```bash
grep -c '"source": "./plugins/arckit-uk-gcloud"' .claude-plugin/marketplace.json
```
Expected: `1`

- [ ] **Step 4: Commit**

```bash
git add .claude-plugin/marketplace.json
git commit -m "feat(uk-gcloud): add marketplace.json entry"
```

---

## Task 4: Port the 8 templates (Document Control prepend)

**Files (each written to BOTH locations):**
- Create: `plugins/arckit-uk-gcloud/templates/{supplier-profile,service-design,sdd-lot1,sdd-lot2,sdd-lot3,declaration,pricing,security}-template.md`
- Create: `.arckit/templates/{…same 8…}-template.md`

The transformation for ALL eight: copy the gcloud-kit template body verbatim, then **prepend** the standard ArcKit Document Control block + Revision History, and align tokens (gcloud-kit tokens like `[SERVICE_NAME]` stay; ensure the footer matches the ArcKit standard footer).

- [ ] **Step 1: Capture the canonical Document Control header from an existing ArcKit template**

Run:
```bash
sed -n '1,40p' .arckit/templates/requirements-template.md
```
Use the Document Control table + Revision History shape shown as the prefix for each ported template (swap Document Type/Document ID per the table below).

| Template | Document Type label | Doc ID pattern |
|---|---|---|
| supplier-profile | Supplier Profile | `ARC-000-SUPP-vX.Y` |
| service-design | Service Design | `ARC-{NNN}-SVCD-vX.Y` |
| sdd-lot1 | Service Definition Document (Lot 1) | `ARC-{NNN}-SDD-vX.Y` |
| sdd-lot2 | Service Definition Document (Lot 2) | `ARC-{NNN}-SDD-vX.Y` |
| sdd-lot3 | Service Definition Document (Lot 3) | `ARC-{NNN}-SDD-vX.Y` |
| declaration | Supplier Declaration | `ARC-000-DECL-vX.Y` |
| pricing | Pricing Document | `ARC-{NNN}-PRIC-vX.Y` |
| security | Security Assertions | `ARC-{NNN}-SECA-vX.Y` |

- [ ] **Step 2: Port supplier-profile + declaration (supplier-wide)**

Run (copy bodies into place; you will hand-edit the header in the next sub-step):
```bash
cp /tmp/gcloud-kit/plugin/templates/supplier-profile-template.md plugins/arckit-uk-gcloud/templates/supplier-profile-template.md
cp /tmp/gcloud-kit/plugin/templates/declaration-template.md      plugins/arckit-uk-gcloud/templates/declaration-template.md
```
Then prepend the Document Control + Revision History block (from Step 1) to each, using the Document Type / Doc ID from the table. Keep `Classification: OFFICIAL` default and the ArcKit standard footer.

- [ ] **Step 3: Port the per-service templates**

Run:
```bash
for t in service-design sdd-lot1 sdd-lot2 sdd-lot3 pricing security; do
  cp /tmp/gcloud-kit/plugin/templates/$t-template.md plugins/arckit-uk-gcloud/templates/$t-template.md
done
```
Then prepend the Document Control + Revision History block to each (Document Type / Doc ID per table). For the three SDD templates add a Document Control row `| Lot | N |` recording the lot.

- [ ] **Step 4: Mirror all 8 to `.arckit/templates/`**

Run:
```bash
for t in supplier-profile service-design sdd-lot1 sdd-lot2 sdd-lot3 declaration pricing security; do
  cp plugins/arckit-uk-gcloud/templates/$t-template.md .arckit/templates/$t-template.md
done
```

- [ ] **Step 5: Verify both copies are byte-identical**

Run:
```bash
for t in supplier-profile service-design sdd-lot1 sdd-lot2 sdd-lot3 declaration pricing security; do
  diff -q plugins/arckit-uk-gcloud/templates/$t-template.md .arckit/templates/$t-template.md || echo "DRIFT: $t";
done; echo done
```
Expected: `done` with no `DRIFT:` lines.

- [ ] **Step 6: Verify every template starts with a Document Control table**

Run:
```bash
for t in supplier-profile service-design sdd-lot1 sdd-lot2 sdd-lot3 declaration pricing security; do
  head -20 plugins/arckit-uk-gcloud/templates/$t-template.md | grep -q "Document Control" || echo "MISSING HEADER: $t";
done; echo done
```
Expected: `done` with no `MISSING HEADER:` lines.

- [ ] **Step 7: Commit**

```bash
git add plugins/arckit-uk-gcloud/templates/*.md .arckit/templates/{supplier-profile,service-design,sdd-lot1,sdd-lot2,sdd-lot3,declaration,pricing,security}-template.md
git commit -m "feat(uk-gcloud): port 8 bid-authoring templates with ArcKit Document Control headers"
```

---

## Task 5: Port the supplier-wide commands (supplier-profile, declaration)

**Files:**
- Create: `plugins/arckit-uk-gcloud/commands/supplier-profile.md`
- Create: `plugins/arckit-uk-gcloud/commands/declaration.md`

Transformation (both): port the gcloud-kit command body; replace `services/` path logic with a write to `projects/000-global/supplier/`; use `${CLAUDE_PLUGIN_ROOT}/templates/<name>-template.md`; output `ARC-000-SUPP-v1.0.md` / `ARC-000-DECL-v1.0.md`; add ArcKit frontmatter; use the Write tool for output; add citation-traceability instructions.

- [ ] **Step 1: Reference the canonical command shape**

Run:
```bash
sed -n '1,30p' plugins/arckit-uk-finance/commands/uk-fs-safeguarding.md
```
Match its frontmatter style (`description`, `effort`, `handoffs`) and its prerequisite/Write-tool/summary structure.

- [ ] **Step 2: Write `supplier-profile.md`**

Frontmatter:
```yaml
---
description: Create or update a reusable supplier profile for G-Cloud submissions
effort: high
handoffs:
  - command: /arckit:service-design
    description: Design the first service offering once the supplier profile exists
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/supplier-profile.md`. Replace its path-resolution block with: ensure `projects/000-global/supplier/` exists (`mkdir -p`), read `${CLAUDE_PLUGIN_ROOT}/templates/supplier-profile-template.md`, write the populated document to `projects/000-global/supplier/ARC-000-SUPP-v1.0.md` using the Write tool, then print a short summary only.

- [ ] **Step 3: Write `declaration.md`**

Frontmatter:
```yaml
---
description: Generate the supplier declaration for the G-Cloud framework
effort: high
handoffs:
  - command: /arckit:review
    description: Validate the declaration as part of submission completeness
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/declaration.md`; read `${CLAUDE_PLUGIN_ROOT}/templates/declaration-template.md`; write to `projects/000-global/supplier/ARC-000-DECL-v1.0.md` via the Write tool. Retain the exclusion-grounds/insurance/tax content verbatim.

- [ ] **Step 4: Verify no stale gcloud-kit references remain**

Run:
```bash
grep -nE "gcloud-kit:|services/|os\.environ" plugins/arckit-uk-gcloud/commands/{supplier-profile,declaration}.md || echo "clean"
```
Expected: `clean` (no matches). If matches appear, fix them.

- [ ] **Step 5: Commit**

```bash
git add plugins/arckit-uk-gcloud/commands/supplier-profile.md plugins/arckit-uk-gcloud/commands/declaration.md
git commit -m "feat(uk-gcloud): port supplier-profile + declaration commands (000-global/supplier)"
```

---

## Task 6: Port the service-creation command (service-design)

**Files:**
- Create: `plugins/arckit-uk-gcloud/commands/service-design.md`

Transformation: port the gcloud-kit body; replace its `services/{NNN}` creation with ArcKit's `create-project.sh --json` to make `projects/{NNN}-service-name/`; output `ARC-{NNN}-SVCD-v1.0.md` (use `generate-document-id.sh`); Write tool; ArcKit frontmatter; citation traceability.

- [ ] **Step 1: Confirm the project-creation helper contract**

Run:
```bash
bash scripts/bash/create-project.sh --help 2>&1 | head -20 || sed -n '1,40p' scripts/bash/create-project.sh
```
Use the documented `--json` output (project path + number) in the command body.

- [ ] **Step 2: Write `service-design.md`**

Frontmatter:
```yaml
---
description: Design a new cloud service offering for the G-Cloud marketplace
effort: high
handoffs:
  - command: /arckit:sdd-lot2
    description: Generate the Service Definition Document for the chosen lot
  - command: /arckit:pricing
    description: Produce the G-Cloud pricing document for this service
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/service-design.md`. Steps: (1) run `bash scripts/bash/create-project.sh --json "<service name>"` to create/locate the service project; (2) read `${CLAUDE_PLUGIN_ROOT}/templates/service-design-template.md`; (3) get the doc ID via `bash scripts/bash/generate-document-id.sh --filename <project-dir> SVCD`; (4) Write the populated doc to the project dir; (5) summary only.

- [ ] **Step 3: Verify no stale references**

Run:
```bash
grep -nE "gcloud-kit:|^.*\bservices/|os\.environ" plugins/arckit-uk-gcloud/commands/service-design.md || echo "clean"
```
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add plugins/arckit-uk-gcloud/commands/service-design.md
git commit -m "feat(uk-gcloud): port service-design command (create-project + SVCD)"
```

---

## Task 7: Port the SDD lot commands (sdd-lot1, sdd-lot2, sdd-lot3)

**Files:**
- Create: `plugins/arckit-uk-gcloud/commands/sdd-lot1.md`
- Create: `plugins/arckit-uk-gcloud/commands/sdd-lot2.md`
- Create: `plugins/arckit-uk-gcloud/commands/sdd-lot3.md`

Transformation (all three): port the gcloud-kit body; resolve the service project (existing `projects/{NNN}-<name>/`); read the matching `sdd-lotN-template.md`; output `ARC-{NNN}-SDD-v1.0.md` with a `Lot: N` Document Control row; Write tool; ArcKit frontmatter; citation traceability. The ~50-question content is retained verbatim.

- [ ] **Step 1: Write `sdd-lot1.md`**

Frontmatter:
```yaml
---
description: Generate the Service Definition Document for Lot 1 (Cloud Hosting / IaaS / PaaS)
effort: max
handoffs:
  - command: /arckit:pricing
    description: Produce the pricing document for this service
  - command: /arckit:security
    description: Generate NCSC Cloud Security Principles assertions
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/sdd-lot1.md`; locate the service project (argument = service slug); read `${CLAUDE_PLUGIN_ROOT}/templates/sdd-lot1-template.md`; doc ID via `generate-document-id.sh ... SDD`; Write to project dir; record `Lot 1`.

- [ ] **Step 2: Write `sdd-lot2.md`**

Same as Step 1 but lot 2: `description: … Lot 2 (Cloud Software / SaaS)`, template `sdd-lot2-template.md`, record `Lot 2`. Port body from `/tmp/gcloud-kit/plugin/commands/sdd-lot2.md`.

- [ ] **Step 3: Write `sdd-lot3.md`**

Same but lot 3: `description: … Lot 3 (Cloud Support)`, template `sdd-lot3-template.md`, record `Lot 3`. Port body from `/tmp/gcloud-kit/plugin/commands/sdd-lot3.md`. Its handoffs should include `/arckit:pricing` and `/arckit:security` as above.

- [ ] **Step 4: Verify no stale references and Write-tool usage present**

Run:
```bash
grep -nE "gcloud-kit:|os\.environ" plugins/arckit-uk-gcloud/commands/sdd-lot*.md || echo "clean"
for f in sdd-lot1 sdd-lot2 sdd-lot3; do grep -qi "Write tool" plugins/arckit-uk-gcloud/commands/$f.md || echo "NO WRITE-TOOL NOTE: $f"; done; echo done
```
Expected: `clean` then `done` (no `NO WRITE-TOOL NOTE` lines — large outputs must use the Write tool, 32K limit).

- [ ] **Step 5: Commit**

```bash
git add plugins/arckit-uk-gcloud/commands/sdd-lot1.md plugins/arckit-uk-gcloud/commands/sdd-lot2.md plugins/arckit-uk-gcloud/commands/sdd-lot3.md
git commit -m "feat(uk-gcloud): port SDD lot1/lot2/lot3 commands (SDD doc-type + lot metadata)"
```

---

## Task 8: Port pricing + security commands

**Files:**
- Create: `plugins/arckit-uk-gcloud/commands/pricing.md`
- Create: `plugins/arckit-uk-gcloud/commands/security.md`

Transformation (both): port body; resolve service project; read matching template; output `ARC-{NNN}-PRIC-v1.0.md` / `ARC-{NNN}-SECA-v1.0.md`; Write tool; ArcKit frontmatter; citation traceability. The NCSC Cloud Security Principles mapping in `security` is retained verbatim.

- [ ] **Step 1: Write `pricing.md`**

Frontmatter:
```yaml
---
description: Generate the G-Cloud pricing document for a service
effort: high
handoffs:
  - command: /arckit:gcloud-competitors
    description: Benchmark this pricing against Digital Marketplace rivals
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/pricing.md`; template `pricing-template.md`; doc ID `PRIC`; Write to project dir.

- [ ] **Step 2: Write `security.md`**

Frontmatter:
```yaml
---
description: Generate NCSC Cloud Security Principles assertions and evidence for a service
effort: high
handoffs:
  - command: /arckit:dpia
    description: Produce a Data Protection Impact Assessment using ArcKit core
  - command: /arckit:review
    description: Validate security evidence as part of submission completeness
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/security.md`; template `security-template.md`; doc ID `SECA`; Write to project dir. Keep the 14 NCSC Cloud Security Principles mapping intact.

- [ ] **Step 3: Verify no stale references**

Run:
```bash
grep -nE "gcloud-kit:|os\.environ" plugins/arckit-uk-gcloud/commands/{pricing,security}.md || echo "clean"
```
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add plugins/arckit-uk-gcloud/commands/pricing.md plugins/arckit-uk-gcloud/commands/security.md
git commit -m "feat(uk-gcloud): port pricing + security commands (PRIC + SECA)"
```

---

## Task 9: Port the supplier-side competitor command (gcloud-competitors)

**Files:**
- Create: `plugins/arckit-uk-gcloud/commands/gcloud-competitors.md` (ported from gcloud-kit `compare.md`)

Transformation: rename to `gcloud-competitors`; emit `GCMP`; make **WebSearch** the primary data path; **remove** the `marketplace` MCP (Option A) path (deferred); add an optional enrichment step that reads core `TNDR`/`CMPT` artefacts for award evidence; output `ARC-{NNN}-GCMP-v1.0.md`; Write tool; ArcKit frontmatter; citation traceability. No template (inline structure).

- [ ] **Step 1: Write `gcloud-competitors.md`**

Frontmatter:
```yaml
---
description: Benchmark a G-Cloud service against Digital Marketplace rivals (supplier-side)
effort: high
handoffs:
  - command: /arckit:pricing
    description: Adjust pricing based on the competitive benchmark
  - command: /arckit:review
    description: Fold competitive positioning into the submission review
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/compare.md` with these specific edits:
  1. Load the service's `ARC-{NNN}-SVCD/SDD/PRIC` from the project dir (replace the `services/$ARGUMENTS` block).
  2. Keep the **WebSearch** path (`site:applytosupply.digitalmarketplace.service.gov.uk …`) + WebFetch as the primary method.
  3. **Delete the "Option A: Marketplace Data Extractor MCP" section** entirely; add one line: "Structured marketplace extraction via the `marketplace` MCP is a future enhancement (ships with the market-intelligence overlay)."
  4. Replace the `tender-intel.md` enrichment block with: "If `ARC-*-TNDR-*.md` or `ARC-*-CMPT-*.md` artefacts exist in this repo (produced by `/arckit:tenders` / `/arckit:competitors`), read them and back the benchmark with their real award counts/values, quoting existing citations and carrying the **awarded value ≠ actual spend** caveat."
  5. Keep the feature/pricing/certification/support tables, SWOT, the `quadrantChart` Mermaid positioning block, and recommendations verbatim.
  6. Write the report to `projects/{NNN}-service/ARC-{NNN}-GCMP-v1.0.md` (doc ID via `generate-document-id.sh ... GCMP`).

- [ ] **Step 2: Verify the MCP path was removed and no stale references remain**

Run:
```bash
grep -nE "mcp__marketplace__|gcloud-kit:|services/|tender-intel\.md|os\.environ" plugins/arckit-uk-gcloud/commands/gcloud-competitors.md || echo "clean"
```
Expected: `clean` (the Option-A MCP calls, `services/` paths, and `tender-intel.md` are all gone).

- [ ] **Step 3: Commit**

```bash
git add plugins/arckit-uk-gcloud/commands/gcloud-competitors.md
git commit -m "feat(uk-gcloud): add /arckit:gcloud-competitors (GCMP, WebSearch + TNDR/CMPT enrichment)"
```

---

## Task 10: Port review + submission-pack commands

**Files:**
- Create: `plugins/arckit-uk-gcloud/commands/review.md`
- Create: `plugins/arckit-uk-gcloud/commands/submission-pack.md`

- [ ] **Step 1: Write `review.md`**

Frontmatter:
```yaml
---
description: Review a G-Cloud service submission for completeness before CCS submission
effort: high
handoffs:
  - command: /arckit:submission-pack
    description: Bundle the service documents once the review is clean
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/review.md`; check for the presence/completeness of the service's `ARC-{NNN}-SVCD/SDD/PRIC/SECA` plus supplier-wide `ARC-000-SUPP/DECL`; output a `GCRV` report `ARC-{NNN}-GCRV-v1.0.md` (doc ID via `generate-document-id.sh ... GCRV`) referencing those ARC-IDs; Write tool.

- [ ] **Step 2: Write `submission-pack.md`**

Frontmatter:
```yaml
---
description: Bundle all approved documents for a G-Cloud service into a CCS submission pack
effort: medium
---
```
Body: port `/tmp/gcloud-kit/plugin/commands/submission-pack.md`; gather the service's artefacts from `projects/{NNN}-service/` plus supplier-wide docs from `projects/000-global/supplier/`; copy them into `projects/{NNN}-service/submission/` and write a `submission/manifest.md` index. No doc-type (export action).

- [ ] **Step 3: Verify no stale references**

Run:
```bash
grep -nE "gcloud-kit:|os\.environ" plugins/arckit-uk-gcloud/commands/{review,submission-pack}.md || echo "clean"
```
Expected: `clean`.

- [ ] **Step 4: Commit**

```bash
git add plugins/arckit-uk-gcloud/commands/review.md plugins/arckit-uk-gcloud/commands/submission-pack.md
git commit -m "feat(uk-gcloud): port review (GCRV) + submission-pack (export) commands"
```

---

## Task 11: Port the 3 skills

**Files:**
- Create: `plugins/arckit-uk-gcloud/skills/gcloud-framework/` (SKILL.md + references/)
- Create: `plugins/arckit-uk-gcloud/skills/cloud-security/` (SKILL.md + references/)
- Create: `plugins/arckit-uk-gcloud/skills/sfia-skills/` (SKILL.md + references/)

- [ ] **Step 1: Copy the three skill directories wholesale**

Run:
```bash
for s in gcloud-framework cloud-security sfia-skills; do
  cp -r /tmp/gcloud-kit/plugin/skills/$s plugins/arckit-uk-gcloud/skills/$s
done
```

- [ ] **Step 2: Rewrite any `gcloud-kit:` command references to `arckit:`**

Run:
```bash
grep -rln "gcloud-kit:" plugins/arckit-uk-gcloud/skills/ || echo "none"
```
For each file listed, replace `/gcloud-kit:<cmd>` with `/arckit:<cmd>` (e.g. `/gcloud-kit:sdd-lot2` → `/arckit:sdd-lot2`). Re-run the grep until it prints `none`.

- [ ] **Step 3: Verify SKILL.md frontmatter is valid (name + description present)**

Run:
```bash
for s in gcloud-framework cloud-security sfia-skills; do
  head -6 plugins/arckit-uk-gcloud/skills/$s/SKILL.md | grep -q "^name:" && head -6 plugins/arckit-uk-gcloud/skills/$s/SKILL.md | grep -q "^description:" || echo "BAD FRONTMATTER: $s";
done; echo done
```
Expected: `done` with no `BAD FRONTMATTER` lines.

- [ ] **Step 4: Commit**

```bash
git add plugins/arckit-uk-gcloud/skills/
git commit -m "feat(uk-gcloud): port gcloud-framework, cloud-security, sfia-skills skills"
```

---

## Task 12: Add the build recipe

**Files:**
- Create: `plugins/arckit-uk-gcloud/recipes/uk-gcloud-submission.yaml`

- [ ] **Step 1: Reference the recipe schema**

Run:
```bash
sed -n '1,60p' plugins/arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml
```
Match the schema (`recipe`, `schema_version: 1`, `description`, `defaults.version`, `post_build_hooks`, `targets`).

- [ ] **Step 2: Write `uk-gcloud-submission.yaml`**

```yaml
# ArcKit build recipe — UK G-Cloud Supplier Submission overlay
#
# Recipe schema v1. Loaded by the arckit-build skill at runtime.
# Override via .arckit/recipes/uk-gcloud-submission.yaml at the project root.
#
# Variable substitution: {P} project id, {NAME} slug, {V} version.

recipe: uk-gcloud-submission
schema_version: 1
description: >
  UK G-Cloud supplier submission overlay — drives a single G-Cloud service
  from supplier profile to a review-ready CCS submission pack. Composes the
  ArcKit baseline with supplier-side bid artefacts: supplier profile,
  service design, Service Definition Document, pricing, NCSC Cloud Security
  Principles assertions, competitor benchmark, and submission review.
  PROPRIETARY, EXPERIMENTAL — every output requires review by the supplier's
  bid/compliance team before submission to Crown Commercial Service.

defaults:
  version: "1.0"

post_build_hooks:
  - skill: arckit:review
    args: "{P}"
  - skill: arckit:health
    args: ""

targets:
  - command: arckit:supplier-profile
    args: ""
  - command: arckit:service-design
    args: "{P}"
  - command: arckit:sdd-lot2
    args: "{P}"
  - command: arckit:pricing
    args: "{P}"
  - command: arckit:security
    args: "{P}"
  - command: arckit:gcloud-competitors
    args: "{P}"
```

(Default lot is Lot 2 / Cloud Software — the most common SaaS case; users swap to `arckit:sdd-lot1`/`arckit:sdd-lot3` via a project override.)

- [ ] **Step 3: Validate YAML parses**

Run:
```bash
python3 -c "import yaml,sys; yaml.safe_load(open('plugins/arckit-uk-gcloud/recipes/uk-gcloud-submission.yaml')); print('OK')"
```
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add plugins/arckit-uk-gcloud/recipes/uk-gcloud-submission.yaml
git commit -m "feat(uk-gcloud): add uk-gcloud-submission build recipe"
```

---

## Task 13: Licensing — per-plugin LICENSE + repo-root carve-out

**Files:**
- Create: `plugins/arckit-uk-gcloud/LICENSE`
- Modify: `LICENSE` (repo root)
- Modify: `README.md` (repo root — licence section)

- [ ] **Step 1: Reference an existing per-plugin LICENSE for shape**

Run:
```bash
sed -n '1,10p' plugins/arckit-fde/LICENSE
```

- [ ] **Step 2: Write `plugins/arckit-uk-gcloud/LICENSE` (Proprietary)**

```text
Copyright (c) 2026 Mark Craddock. All rights reserved.

PROPRIETARY AND CONFIDENTIAL

This directory (plugins/arckit-uk-gcloud/ and all files within it) is
proprietary software and is NOT licensed under the MIT License that governs
the remainder of the arc-kit repository. No permission is granted to use,
copy, modify, merge, publish, distribute, sublicense, or sell copies of this
software without the prior written consent of the copyright holder.

For licensing enquiries contact mark.craddock@mcc.co.uk.
```

- [ ] **Step 3: Add a carve-out to the repo-root `LICENSE`**

At the TOP of the repo-root `LICENSE`, before the `MIT License` line, prepend:

```text
NOTE: The MIT License below applies to the arc-kit repository EXCEPT for the
directory `plugins/arckit-uk-gcloud/`, which is proprietary and licensed
separately — see `plugins/arckit-uk-gcloud/LICENSE`. The MIT grant does not
extend to that directory.

```

- [ ] **Step 4: Add a one-line licence note to repo-root `README.md`**

Find the existing Licence/License section in `README.md` and append:

```markdown
> **Exception:** `plugins/arckit-uk-gcloud/` is proprietary (not MIT) — see `plugins/arckit-uk-gcloud/LICENSE`.
```

- [ ] **Step 5: Verify the carve-out text is present**

Run:
```bash
grep -q "plugins/arckit-uk-gcloud/" LICENSE && grep -qi "proprietary" plugins/arckit-uk-gcloud/LICENSE && echo OK
```
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add LICENSE README.md plugins/arckit-uk-gcloud/LICENSE
git commit -m "feat(uk-gcloud): proprietary licence + repo-root MIT carve-out"
```

---

## Task 14: Converter integration

**Files:**
- Modify: `scripts/converter.py` (`PLUGIN_SOURCES`, and `SYNC_EXEMPT_PLUGINS` if required)

> **Licence caveat:** the converter pushes overlay content into the MIT extension repos. Per the spec §13, the extension repos must declare/inherit the Proprietary licence for this overlay's files. If that mechanism is not yet decided at execution time, STOP and confirm with the user whether to (a) include this overlay in the converter with extension-repo licence handling, or (b) keep it Claude-only (remove from `PLUGIN_SOURCES`). Default per spec §3: include it (full overlay convention).

- [ ] **Step 1: Add `arckit-uk-gcloud` to `PLUGIN_SOURCES`**

In `scripts/converter.py`, add to the `PLUGIN_SOURCES` list (before the `arckit-claude` "core last" entry):

```python
    "plugins/arckit-uk-gcloud",
```

- [ ] **Step 2: Check whether shared-asset sync needs an exemption**

Run:
```bash
grep -n "SYNC_EXEMPT_PLUGINS" scripts/sync-shared-assets.py
```
If `arckit-fde` is listed there as exempt (Claude-only/no-doc-types), add `arckit-uk-gcloud` to the same list ONLY if it should be exempt from shared-asset propagation. (This overlay DOES register doc-types and convert, so it is generally NOT exempt — only add it if running Step 4 reports a shared-asset mismatch that is intentional.)

- [ ] **Step 3: Run the converter**

Run:
```bash
python scripts/converter.py
```
Expected: completes without error; output lists `arckit-uk-gcloud` among the sources and the extension dirs now contain the new commands (e.g. `extensions/arckit-codex/.agents/skills/arckit-supplier-profile/`).

- [ ] **Step 4: Verify the new commands landed in the generated formats**

Run:
```bash
ls extensions/arckit-codex/.agents/skills/ | grep -E "arckit-(supplier-profile|sdd-lot1|gcloud-competitors)" && echo OK
```
Expected: the three skill dirs listed, then `OK`. (Extension dirs are gitignored — do not commit them.)

- [ ] **Step 5: Commit (converter.py only — extensions are gitignored)**

```bash
git add scripts/converter.py
git commit -m "feat(uk-gcloud): add overlay to converter PLUGIN_SOURCES"
```

---

## Task 15: Reference + notation guards

**Files:** none modified (validation only; fix-ups committed if needed)

- [ ] **Step 1: Run the cross-reference checker**

Run:
```bash
python scripts/check_references.py
```
Expected: PASS. It validates `${CLAUDE_PLUGIN_ROOT}/...` paths, `handoffs[].command` slugs, and `${user_config.KEY}` keys against disk. If it flags a missing template path or an unknown handoff slug in the new commands, fix the command file and re-run.

- [ ] **Step 2: Run the colon-notation guard**

Run:
```bash
python scripts/standardise-colon.py --check
```
Expected: PASS (no dot-notation command refs). Fix any dot-form `/arckit.NAME` to colon-form `/arckit:NAME` in the new files and re-run.

- [ ] **Step 3: If any fix-ups were made, commit them**

```bash
git add plugins/arckit-uk-gcloud/
git commit -m "fix(uk-gcloud): satisfy reference + colon-notation guards"
```
(Skip if Steps 1–2 passed with no changes.)

---

## Task 16: Plugin packaging validation (clean-tree dry-run)

**Files:** none

- [ ] **Step 1: Confirm a clean working tree (required by `claude plugin tag`)**

Run:
```bash
git status --porcelain
```
Expected: empty (all prior tasks committed). If `.arckit/memory/sessions.md` shows as modified, leave it — do NOT commit it; `claude plugin tag --dry-run` tolerates untracked/unrelated changes only if they don't affect the release. If it errors on the dirty tree, stash sessions.md: `git stash push -- .arckit/memory/sessions.md`.

- [ ] **Step 2: Dry-run tag the new plugin (validation only)**

Run:
```bash
claude plugin tag plugins/arckit-uk-gcloud --dry-run
```
Expected: validation success (no "Path not found", no manifest errors). Note: the path is `plugins/arckit-uk-gcloud` (a PATH, not the bare plugin name).

- [ ] **Step 3: Dry-run the core plugin too (doc-types/pages changes live there)**

Run:
```bash
claude plugin tag plugins/arckit-claude --dry-run
```
Expected: validation success.

(No commit — validation only.)

---

## Task 17: Documentation updates

**Files:**
- Modify: `README.md` (repo root — plugin list + command count)
- Modify: `docs/index.html` (plugin/command counts, plugin card)
- Modify: `docs/DEPENDENCY-MATRIX.md`
- Modify: `CHANGELOG.md` (root)
- Modify: `plugins/arckit-claude/CHANGELOG.md`
- Optionally: invoke the `new-command-docs` skill for the count sweep

- [ ] **Step 1: Use the new-command-docs skill to enumerate the doc surface**

Invoke the `arckit` `new-command-docs` skill (it lists every doc file + count that must change when commands are added). Apply its checklist to the files below.

- [ ] **Step 2: Update repo-root `README.md`**

Add `arckit-uk-gcloud` to the plugin list/table (13th plugin; "supplier-side G-Cloud bid authoring; Proprietary"). Update any "N plugins / M commands" totals (plugins 12→13; community commands +11).

- [ ] **Step 3: Update `docs/index.html`**

Add a plugin card/entry for `arckit-uk-gcloud` and bump the plugin/command counters to match README.

- [ ] **Step 4: Update `docs/DEPENDENCY-MATRIX.md`**

Add the 11 new commands and their doc-types (SUPP/SVCD/SDD/DECL/PRIC/SECA/GCMP/GCRV), marking the `arckit` core dependency.

- [ ] **Step 5: Add CHANGELOG entries to BOTH changelogs**

Add an identical `### Added` entry to `CHANGELOG.md` AND `plugins/arckit-claude/CHANGELOG.md` under an Unreleased/next-version heading:
```markdown
### Added
- **arckit-uk-gcloud** (13th marketplace plugin) — Proprietary supplier-side G-Cloud bid-authoring overlay: 11 commands (supplier-profile, service-design, sdd-lot1/2/3, declaration, pricing, security, gcloud-competitors, review, submission-pack), 8 doc-types (SUPP/SVCD/SDD/DECL/PRIC/SECA/GCMP/GCRV), 3 skills, and the uk-gcloud-submission build recipe. Requires arckit core. Ported from the standalone gcloud-kit plugin.
```
(Remember: `bump-version.sh` stamps only the root CHANGELOG — the plugin CHANGELOG must be edited by hand, per the known release gotcha.)

- [ ] **Step 6: Verify counts are internally consistent**

Run:
```bash
ls plugins/arckit-uk-gcloud/commands/*.md | grep -v '.gitkeep' | wc -l
```
Expected: `11`. Cross-check this number appears in README + index.html.

- [ ] **Step 7: Run markdownlint on changed docs**

Run:
```bash
npx markdownlint-cli2 "plugins/arckit-uk-gcloud/**/*.md" "docs/specs/2026-06-10-arckit-uk-gcloud-overlay-design.md" 2>&1 | tail -20
```
Expected: no errors (or only pre-existing repo-wide warnings). Fix new violations.

- [ ] **Step 8: Commit**

```bash
git add README.md docs/index.html docs/DEPENDENCY-MATRIX.md CHANGELOG.md plugins/arckit-claude/CHANGELOG.md
git commit -m "docs(uk-gcloud): document 13th plugin across README, index, matrix, changelogs"
```

---

## Task 18: Full guard sweep + open PR

**Files:** none (final validation), then PR

- [ ] **Step 1: Re-run every guard in sequence**

Run:
```bash
node scripts/tests/test-doc-types-dual-registration.mjs && \
node scripts/tests/test-regime-registration.mjs && \
python scripts/check_references.py && \
python scripts/standardise-colon.py --check && \
echo "ALL GUARDS PASS"
```
Expected: `ALL GUARDS PASS`.

- [ ] **Step 2: Re-run the converter to confirm idempotency**

Run:
```bash
python scripts/converter.py && git status --porcelain scripts/ plugins/
```
Expected: converter completes; no unexpected tracked-file changes (extensions are gitignored).

- [ ] **Step 3: Push the branch**

Run:
```bash
git push -u origin feat/arckit-uk-gcloud-overlay
```

- [ ] **Step 4: Open the PR**

Run:
```bash
gh pr create --title "feat: arckit-uk-gcloud supplier bid-authoring overlay (13th plugin)" --body "$(cat <<'EOF'
## Summary
Adds **arckit-uk-gcloud**, the 13th ArcKit marketplace plugin — a Proprietary, supplier-side G-Cloud bid-authoring overlay ported from the standalone gcloud-kit plugin and composed with ArcKit core.

- 11 commands (supplier-profile, service-design, sdd-lot1/2/3, declaration, pricing, security, gcloud-competitors, review, submission-pack)
- 8 new doc-types (SUPP/SVCD/SDD/DECL/PRIC/SECA/GCMP/GCRV), regime UK
- 3 skills (gcloud-framework, cloud-security, sfia-skills)
- uk-gcloud-submission build recipe
- Service = ArcKit project; supplier-wide docs in projects/000-global/supplier/
- **Proprietary** licence with repo-root MIT carve-out

Spec: docs/specs/2026-06-10-arckit-uk-gcloud-overlay-design.md
Plan: docs/plans/2026-06-10-arckit-uk-gcloud-overlay.md

## Validation
- doc-types dual-registration ✅
- regime registration ✅
- check_references.py ✅
- standardise-colon.py --check ✅
- converter idempotent ✅
- claude plugin tag --dry-run (uk-gcloud + claude) ✅

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
Expected: PR URL printed.

---

## Self-Review (completed by plan author)

**Spec coverage:**
- §4 command set (11 commands) → Tasks 5–10, 9 ✅
- §4a gcloud-competitors data path → Task 9 ✅
- §5 artefact model (service=project, 000-global/supplier) → Tasks 5, 6 ✅
- §6 doc-type registration (8 codes, dual) → Task 2 ✅
- §7 source mapping (templates + commands + skills) → Tasks 4, 5–11 ✅
- §9 supporting assets (templates dual-location, recipe) → Tasks 4, 12 ✅
- §10 packaging (plugin.json, marketplace.json, converter, licensing) → Tasks 1, 3, 13, 14 ✅
- §11 counts impact → Task 17 ✅
- §13 risks (licensing leak into extensions, template size/Write tool) → Task 14 caveat, Task 7 Step 4 ✅

**Placeholder scan:** No "TBD"/"add error handling" placeholders; ports name an exact source file + exact transformation. The command/template bodies are not inlined because they are verbatim ports of named source files (the source IS the content) — each task names the file and the precise edits.

**Type/name consistency:** doc-type codes (SUPP/SVCD/SDD/DECL/PRIC/SECA/GCMP/GCRV), command names, and ARC-ID patterns are consistent across Tasks 2, 4–10, 17. `/arckit:gcloud-competitors` (prefixed) vs bare names matches spec §4 naming convention.

**Open execution-time decisions flagged:** Task 14 licence-vs-converter caveat; Task 16 sessions.md dirty-tree handling.
