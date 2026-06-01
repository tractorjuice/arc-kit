# UK Government Overlay Extraction — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract all UK-specific functionality out of the neutral `arckit` core into two new official overlays (`arckit-uk`, `arckit-uk-mod`), making core jurisdiction-neutral and the overlay model symmetric.

**Architecture:** Move 15 commands (13 → `arckit-uk` with `uk-` prefix, 2 → `arckit-uk-mod` with `uk-mod-` prefix) plus their templates, 8 agents, the govreposcrape MCP, and 4 recipes. Neutralise `risk`/`sobc` in core via the existing `governance_framework` userConfig. Make core's recommendation engine (hooks + workflow skills) regime-aware by reading the `governance_framework` userConfig — hooks read it from the `CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK` env var Claude Code exports to hook subprocesses; command bodies read `${user_config.governance_framework}`. Re-point ~260 cross-references. Ship as v6.0.0.

**Tech Stack:** Markdown command/template files, Node ESM hooks (`.mjs`), YAML recipes, Python tooling (`converter.py`, `check_references.py`, `sync-shared-assets.py`), `claude plugin tag` CLI.

**Source spec:** `docs/superpowers/specs/2026-06-01-uk-gov-overlay-extraction-design.md`

**Scope:** This plan covers the in-repo refactor only (Phases 0–6). Migrating the 27 external test repos is a separate follow-on plan executed after v6.0.0 is tagged.

**Green-gate model:** Phases 1–4 are an extraction transaction whose intermediate commits are WIP (cross-references are dangling mid-transaction). The hard validation gate is **Phase 5** — everything must pass there before Phase 6 (version bump). Phase 0 is independently green.

**Conventions:**
- `git mv` for every move so history follows the file.
- Never `git add -A`/`git add .` — stage explicit paths only. Leave the pre-existing unstaged `.arckit/memory/sessions.md` and `.arckit/templates/story-template.md` changes alone.
- Work on branch `uk-gov-overlay-extraction` (already created; the spec commit is its first commit).

---

## File / responsibility map

**New plugin `arckit-uk/`** (UK jurisdiction baseline, default-on):
- `.claude-plugin/plugin.json`, `VERSION`, `CHANGELOG.md`, `README.md`, `.mcp.json` (govreposcrape)
- `commands/uk-*.md` (13), `templates/uk-*-template.md` (13) + `templates/_partials/`, `agents/arckit-uk-*.md` (8), `recipes/uk-saas.yaml`, `references/{citation-instructions,quality-checklist}.md`

**New plugin `arckit-uk-mod/`** (defence sector, default-off):
- Same skeleton; `commands/uk-mod-*.md` (2), `templates/uk-mod-*-template.md` (2), `recipes/uk-mod-sovereign.yaml`, no agents, no MCP.

**Core `arckit-claude/` modified:** remove 15 commands/templates/agents + govreposcrape `.mcp.json` entry; neutralise `commands/risk.md` + `commands/sobc.md`; regime-gate `hooks/graph-inject.mjs`, `hooks/graph-rollups.mjs`, `scripts/bash/create-project.sh`, `commands/{analyze,health,impact}.md`, `skills/architecture-workflow/references/*-path.md`; new `skills/arckit-build/recipes/baseline.yaml`; re-point ~230 cosmetic refs.

**Repo tooling modified:** `.claude-plugin/marketplace.json`, `scripts/converter.py` (`PLUGIN_SOURCES`), `scripts/sync-shared-assets.py` (overlay list), both `CHANGELOG.md`, `README.md`, `docs/index.html`, `docs/DEPENDENCY-MATRIX.md`, `CLAUDE.md`, new `docs/MIGRATION-v6.md`.

**Other overlays modified:** `arckit-uae/recipes/*` (drop UK targets), `arckit-au/recipes/au-federal.yaml` (swap ai-playbook), `arckit-uk-nhs/*` + `arckit-uk-finance/*` (deps + cross-refs + relocate recipes).

---

## Phase 0 — Spikes + scaffolding (independently green)

### Task 0.1: Spike — hook regime-gating mechanism — RESOLVED

**Finding:** Claude Code exports plugin `userConfig` fields to hook subprocesses as `CLAUDE_PLUGIN_OPTION_<FIELD_UPPERCASED>` env vars. Confirmed: `arckit-claude/hooks/notify-stale-artifacts.mjs:39` reads `process.env.CLAUDE_PLUGIN_OPTION_DESKTOP_NOTIFICATIONS`. So hooks **can** read `governance_framework` directly.

**Decision:** gate UK suggestions in hooks on `process.env.CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK === 'UK Gov'` (matches spec decision 7 — the user's declared regime, not a plugin-presence proxy). Reads at call time; degrades cleanly to off when unset. (Earlier draft assumed hooks could not read userConfig and proposed sibling-plugin detection — superseded.)

- [x] Verified via `grep -rn "CLAUDE_PLUGIN_OPTION" arckit-claude/hooks/*.mjs`.

### Task 0.2: Spike — `defaultEnabled: true` (release gate) — RUNTIME OK

- [x] Local Claude Code is `2.1.159` (≥ v2.1.154, which introduced `defaultEnabled`), so the runtime supports the field. Behavioural confirmation that a fresh marketplace install *auto-enables* `arckit-uk` (not merely installs it) should still be smoke-tested before release, but it does not block the build.

### Task 0.3: Scaffold `arckit-uk` plugin skeleton

**Files:**
- Create: `arckit-uk/.claude-plugin/plugin.json`, `arckit-uk/VERSION`, `arckit-uk/CHANGELOG.md`, `arckit-uk/README.md`, `arckit-uk/.mcp.json`
- Create dirs: `arckit-uk/{commands,templates,templates/_partials,agents,recipes,references}/`

- [ ] **Step 1: Create `arckit-uk/.claude-plugin/plugin.json`**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "arckit-uk",
  "version": "5.8.0",
  "defaultEnabled": true,
  "description": "UK Government overlay for ArcKit — 13 commands for GDS Service Standard, Technology Code of Practice, Secure by Design (NCSC CAF), DPIA (UK GDPR), AI Playbook + ATRS, G-Cloud/DOS procurement, government code reuse (govreposcrape), and UK grants. Recipe: uk-saas. The UK jurisdiction baseline; officially maintained. Requires arckit core.",
  "author": { "name": "TractorJuice", "url": "https://github.com/tractorjuice" },
  "homepage": "https://arckit.org",
  "repository": "https://github.com/tractorjuice/arc-kit",
  "license": "MIT",
  "keywords": ["architecture", "governance", "uk-government", "gds", "ncsc", "tcop", "compliance"],
  "dependencies": [ { "name": "arckit", "version": "=5.8.0" } ]
}
```

Note: scaffold at the current `5.8.0`; Phase 6 bumps all to `6.0.0` atomically via `bump-version.sh`.

- [ ] **Step 2: Create `arckit-uk/.mcp.json`** (govreposcrape, copied verbatim from core; keep deferred — no `alwaysLoad`)

```json
{
  "mcpServers": {
    "govreposcrape": {
      "type": "http",
      "url": "https://govreposcrape-api-1060386346356.us-central1.run.app/mcp"
    }
  }
}
```

- [ ] **Step 3: Create `arckit-uk/VERSION`** containing `5.8.0`, and stub `CHANGELOG.md` / `README.md` (one-line title + "See repository root README for the overlay model.").

- [ ] **Step 4: Copy shared reference assets** (source of truth is core; `sync-shared-assets.py` will keep them in sync later):

```bash
cp arckit-claude/references/citation-instructions.md arckit-uk/references/
cp arckit-claude/references/quality-checklist.md arckit-uk/references/
cp arckit-claude/templates/_partials/*.md arckit-uk/templates/_partials/ 2>/dev/null || true
git add arckit-uk
```

- [ ] **Step 5: Verify the skeleton is valid JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('arckit-uk/.claude-plugin/plugin.json'));JSON.parse(require('fs').readFileSync('arckit-uk/.mcp.json'));console.log('ok')"`
Expected: `ok`

### Task 0.4: Scaffold `arckit-uk-mod` plugin skeleton

**Files:** mirror of 0.3 for `arckit-uk-mod/` (no `.mcp.json`, no `agents/`).

- [ ] **Step 1: Create `arckit-uk-mod/.claude-plugin/plugin.json`**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "arckit-uk-mod",
  "version": "5.8.0",
  "defaultEnabled": false,
  "description": "UK Ministry of Defence overlay for ArcKit — 2 commands for MOD Secure by Design (JSP 440, IAMM, CAAT continuous assurance) and JSP 936 dependable-AI assurance. Recipe: uk-mod-sovereign. Defence sector overlay on the UK baseline; requires arckit core and arckit-uk.",
  "author": { "name": "TractorJuice", "url": "https://github.com/tractorjuice" },
  "homepage": "https://arckit.org",
  "repository": "https://github.com/tractorjuice/arc-kit",
  "license": "MIT",
  "keywords": ["architecture", "governance", "uk-government", "mod", "defence", "jsp-936", "secure-by-design"],
  "dependencies": [
    { "name": "arckit", "version": "=5.8.0" },
    { "name": "arckit-uk", "version": "=5.8.0" }
  ]
}
```

- [ ] **Step 2: Create `VERSION` (`5.8.0`), stub `CHANGELOG.md`/`README.md`, copy reference assets + `_partials`** (as in 0.3 steps 3–4). `git add arckit-uk-mod`.

### Task 0.5: Register the two plugins in repo tooling

**Files:**
- Modify: `.claude-plugin/marketplace.json` (add two `plugins[]` entries)
- Modify: `scripts/converter.py:216` (`PLUGIN_SOURCES`)
- Modify: `scripts/sync-shared-assets.py` (overlay list)

- [ ] **Step 1: Add marketplace entries.** Append after the existing `arckit-uk-nhs`/`arckit-uk-finance` entries (descriptions/keywords are manual — the drift check requires the entry to exist):

```json
    {
      "name": "arckit-uk",
      "source": "./arckit-uk",
      "description": "UK Government overlay — 13 commands for GDS Service Standard, TCoP, Secure by Design (NCSC CAF), DPIA, AI Playbook/ATRS, G-Cloud/DOS, gov code reuse, and grants. The UK jurisdiction baseline.",
      "version": "5.8.0",
      "author": { "name": "TractorJuice" },
      "homepage": "https://github.com/tractorjuice/arc-kit",
      "repository": "https://github.com/tractorjuice/arc-kit",
      "license": "MIT",
      "keywords": ["architecture", "governance", "uk-government", "gds", "ncsc", "compliance"],
      "category": "productivity"
    },
    {
      "name": "arckit-uk-mod",
      "source": "./arckit-uk-mod",
      "description": "UK MOD defence overlay — MOD Secure by Design (JSP 440, CAAT) and JSP 936 dependable-AI assurance. Requires arckit-uk.",
      "version": "5.8.0",
      "author": { "name": "TractorJuice" },
      "homepage": "https://github.com/tractorjuice/arc-kit",
      "repository": "https://github.com/tractorjuice/arc-kit",
      "license": "MIT",
      "keywords": ["architecture", "governance", "uk-government", "mod", "defence", "compliance"],
      "category": "productivity"
    }
```

- [ ] **Step 2: Add both to `PLUGIN_SOURCES` in `scripts/converter.py`** (after `"arckit-uk-finance"`):

```python
    "arckit-uk",
    "arckit-uk-mod",
```

- [ ] **Step 3: Add both to the overlay list in `scripts/sync-shared-assets.py`.** Locate the array of overlay dir names and append `"arckit-uk"`, `"arckit-uk-mod"`:

Run: `grep -n "arckit-uk-finance\|arckit-au-energy" scripts/sync-shared-assets.py`
Then add the two entries in the same list.

- [ ] **Step 4: Verify marketplace JSON + drift check**

Run: `python -c "import json;json.load(open('.claude-plugin/marketplace.json'));print('ok')"`
Expected: `ok`

- [ ] **Step 5: Commit (green checkpoint — two empty registered plugins, repo unchanged behaviourally)**

```bash
git add arckit-uk arckit-uk-mod .claude-plugin/marketplace.json scripts/converter.py scripts/sync-shared-assets.py
git commit -m "feat(uk): scaffold arckit-uk + arckit-uk-mod plugin skeletons (v6.0.0 prep)"
```

---

## Phase 1 — Move commands, templates, agents, MCP (WIP)

### Task 1.1: Move + rename the 13 `arckit-uk` command files

**Files:** `git mv` each, renaming to `uk-*`.

- [ ] **Step 1: Move and rename**

```bash
cd /workspaces/arc-kit
declare -A UK=( [tcop]=uk-tcop [secure]=uk-secure [dpia]=uk-dpia [ai-playbook]=uk-ai-playbook \
  [atrs]=uk-atrs [service-assessment]=uk-service-assessment [dos]=uk-dos \
  [gcloud-search]=uk-gcloud-search [gcloud-clarify]=uk-gcloud-clarify \
  [gov-reuse]=uk-gov-reuse [gov-code-search]=uk-gov-code-search \
  [gov-landscape]=uk-gov-landscape [grants]=uk-grants )
for old in "${!UK[@]}"; do
  git mv "arckit-claude/commands/$old.md" "arckit-uk/commands/${UK[$old]}.md"
done
```

- [ ] **Step 2: Verify 13 moved, none left in core**

Run: `ls arckit-uk/commands | wc -l && ls arckit-claude/commands | grep -cE '^(tcop|secure|dpia|ai-playbook|atrs|service-assessment|dos|gcloud-search|gcloud-clarify|gov-reuse|gov-code-search|gov-landscape|grants)\.md$'`
Expected: `13` then `0`

### Task 1.2: Move + rename the 2 `arckit-uk-mod` command files

- [ ] **Step 1: Move and rename**

```bash
git mv arckit-claude/commands/mod-secure.md   arckit-uk-mod/commands/uk-mod-secure.md
git mv arckit-claude/commands/jsp-936.md       arckit-uk-mod/commands/uk-mod-jsp-936.md
```

- [ ] **Step 2: Verify**

Run: `ls arckit-uk-mod/commands`
Expected: `uk-mod-jsp-936.md  uk-mod-secure.md`

### Task 1.3: Move + rename the templates

**Files:** template filenames in core do not all match command names (see map). Move the actual files.

- [ ] **Step 1: Move arckit-uk templates** (core name → overlay name)

```bash
git mv arckit-claude/templates/tcop-review-template.md                  arckit-uk/templates/uk-tcop-template.md
git mv arckit-claude/templates/ukgov-secure-by-design-template.md       arckit-uk/templates/uk-secure-template.md
git mv arckit-claude/templates/dpia-template.md                          arckit-uk/templates/uk-dpia-template.md
git mv arckit-claude/templates/uk-gov-ai-playbook-template.md            arckit-uk/templates/uk-ai-playbook-template.md
git mv arckit-claude/templates/uk-gov-atrs-template.md                   arckit-uk/templates/uk-atrs-template.md
git mv arckit-claude/templates/service-assessment-prep-template.md       arckit-uk/templates/uk-service-assessment-template.md
git mv arckit-claude/templates/dos-requirements-template.md              arckit-uk/templates/uk-dos-template.md
git mv arckit-claude/templates/gcloud-requirements-template.md           arckit-uk/templates/uk-gcloud-search-template.md
git mv arckit-claude/templates/gcloud-clarify-template.md                arckit-uk/templates/uk-gcloud-clarify-template.md
git mv arckit-claude/templates/gov-reuse-template.md                     arckit-uk/templates/uk-gov-reuse-template.md
git mv arckit-claude/templates/gov-code-search-template.md               arckit-uk/templates/uk-gov-code-search-template.md
git mv arckit-claude/templates/gov-landscape-template.md                 arckit-uk/templates/uk-gov-landscape-template.md
git mv arckit-claude/templates/grants-template.md                        arckit-uk/templates/uk-grants-template.md
```

- [ ] **Step 2: Move arckit-uk-mod templates**

```bash
git mv arckit-claude/templates/mod-secure-by-design-template.md  arckit-uk-mod/templates/uk-mod-secure-template.md
git mv arckit-claude/templates/jsp-936-template.md                arckit-uk-mod/templates/uk-mod-jsp-936-template.md
```

- [ ] **Step 3: Remove the moved templates from the `.arckit/templates/` CLI mirror**

```bash
git rm .arckit/templates/{tcop-review-template,ukgov-secure-by-design-template,dpia-template,uk-gov-ai-playbook-template,uk-gov-atrs-template,service-assessment-prep-template,dos-requirements-template,gcloud-requirements-template,gcloud-clarify-template,mod-secure-by-design-template,jsp-936-template}.md
```

- [ ] **Step 4: Verify no moved template remains in core or mirror**

Run: `ls arckit-claude/templates | grep -cE 'tcop-review|ukgov-secure|^dpia-|ai-playbook|atrs-template|service-assessment-prep|dos-requirements|gcloud|gov-reuse|gov-code-search|gov-landscape|grants-template|mod-secure|jsp-936'`
Expected: `0`

### Task 1.4: Move + rename the 8 agents

- [ ] **Step 1: Move and rename to `arckit-uk-*`**

```bash
git mv arckit-claude/agents/arckit-gov-reuse.md          arckit-uk/agents/arckit-uk-gov-reuse.md
git mv arckit-claude/agents/arckit-gov-reuse-reader.md   arckit-uk/agents/arckit-uk-gov-reuse-reader.md
git mv arckit-claude/agents/arckit-gov-reuse-writer.md   arckit-uk/agents/arckit-uk-gov-reuse-writer.md
git mv arckit-claude/agents/arckit-gov-code-search.md    arckit-uk/agents/arckit-uk-gov-code-search.md
git mv arckit-claude/agents/arckit-gov-landscape.md      arckit-uk/agents/arckit-uk-gov-landscape.md
git mv arckit-claude/agents/arckit-grants.md             arckit-uk/agents/arckit-uk-grants.md
git mv arckit-claude/agents/arckit-grants-reader.md      arckit-uk/agents/arckit-uk-grants-reader.md
git mv arckit-claude/agents/arckit-grants-writer.md      arckit-uk/agents/arckit-uk-grants-writer.md
```

- [ ] **Step 2: Move the agents' schemas/rubrics** (gov-reuse + grants handoff schemas and scoring rubrics)

```bash
git mv arckit-claude/schemas/gov-reuse-handoff.schema.json arckit-uk/schemas/gov-reuse-handoff.schema.json
git mv arckit-claude/schemas/grants-handoff.schema.json     arckit-uk/schemas/grants-handoff.schema.json
mkdir -p arckit-uk/schemas/scoring-rubrics
git mv arckit-claude/schemas/scoring-rubrics/gov-reuse-generic.yaml  arckit-uk/schemas/scoring-rubrics/
git mv arckit-claude/schemas/scoring-rubrics/gov-reuse-uk-gov.yaml   arckit-uk/schemas/scoring-rubrics/
git mv arckit-claude/schemas/scoring-rubrics/grants-generic.yaml     arckit-uk/schemas/scoring-rubrics/
git mv arckit-claude/schemas/scoring-rubrics/grants-uk-gov.yaml      arckit-uk/schemas/scoring-rubrics/
```

Note: `datascout-handoff.schema.json` and `datascout` rubrics stay in core (datascout is neutral).

- [ ] **Step 3: Verify only datascout schema/rubrics remain in core**

Run: `ls arckit-claude/schemas/ arckit-claude/schemas/scoring-rubrics/`
Expected: only `datascout-handoff.schema.json` and the two `generic.yaml`/`uk-gov.yaml` datascout rubrics remain.

### Task 1.5: Move the govreposcrape MCP entry out of core

**Files:** Modify `arckit-claude/.mcp.json` (remove `govreposcrape` block; it now lives in `arckit-uk/.mcp.json` from Task 0.3).

- [ ] **Step 1: Delete the `govreposcrape` block** from `arckit-claude/.mcp.json` (keep aws-knowledge, microsoft-learn, google-developer-knowledge, datacommons-mcp).

- [ ] **Step 2: Remove govreposcrape from the core hook auto-allow list.** `hooks/allow-mcp-tools.mjs` auto-allows `mcp__govreposcrape__`. Move that entry to an equivalent allow-list in `arckit-uk` if one exists, or leave a copy — verify:

Run: `grep -rn "govreposcrape" arckit-claude/.mcp.json arckit-claude/hooks/`
Expected after edit: `.mcp.json` clean; note any remaining hook reference for Phase 3 regime-gating.

- [ ] **Step 3: Update self-references inside the moved command/agent/template bodies.** Each moved file references its own command name, template path, and agent. Apply the rename map to file *bodies* in the new locations:

```bash
cd /workspaces/arc-kit
# command + template path self-refs (uk-)
grep -rlE '/arckit[:.](tcop|secure|dpia|ai-playbook|atrs|service-assessment|dos|gcloud-search|gcloud-clarify|gov-reuse|gov-code-search|gov-landscape|grants)\b' arckit-uk | while read f; do
  sed -i -E 's#/arckit:tcop#/arckit-uk:uk-tcop#g; s#/arckit\.tcop#/arckit-uk:uk-tcop#g' "$f"
  # ...repeat per command; or use the generated sed script from Task 4.1
done
```

Use the canonical `sed` rename script authored in **Task 4.1** (it covers every old→new mapping and both `:`/`.` separators) against `arckit-uk` and `arckit-uk-mod` here. Also fix `${CLAUDE_PLUGIN_ROOT}/templates/<old>-template.md` → new template filename in each command body.

- [ ] **Step 4: Verify no moved command body still points at an old core name**

Run: `grep -rnE '/arckit[:.](tcop|secure|dpia|ai-playbook|atrs|service-assessment|dos|gcloud-search|gcloud-clarify|gov-reuse|gov-code-search|gov-landscape|grants|mod-secure|jsp-936)\b' arckit-uk arckit-uk-mod | grep -v 'arckit-uk:'`
Expected: no output.

- [ ] **Step 5: Commit (WIP)**

```bash
git add arckit-uk arckit-uk-mod arckit-claude/commands arckit-claude/templates arckit-claude/agents arckit-claude/schemas arckit-claude/.mcp.json .arckit/templates
git commit -m "refactor(uk): move 15 commands, templates, agents, MCP to arckit-uk/arckit-uk-mod [WIP]"
```

---

## Phase 2 — Recipes (WIP)

### Task 2.1: Relocate + re-point `uk-saas` → `arckit-uk`

**Files:** `git mv arckit-claude/skills/arckit-build/recipes/uk-saas.yaml arckit-uk/recipes/uk-saas.yaml`

- [ ] **Step 1: Move it**

```bash
git mv arckit-claude/skills/arckit-build/recipes/uk-saas.yaml arckit-uk/recipes/uk-saas.yaml
```

- [ ] **Step 2: Re-point its 6 UK targets** in `arckit-uk/recipes/uk-saas.yaml`:

```bash
sed -i -E \
 -e 's#skill: arckit:gov-reuse#skill: arckit-uk:uk-gov-reuse#' \
 -e 's#skill: arckit:tcop#skill: arckit-uk:uk-tcop#' \
 -e 's#skill: arckit:secure#skill: arckit-uk:uk-secure#' \
 -e 's#skill: arckit:dpia#skill: arckit-uk:uk-dpia#' \
 -e 's#skill: arckit:ai-playbook#skill: arckit-uk:uk-ai-playbook#' \
 -e 's#skill: arckit:service-assessment#skill: arckit-uk:uk-service-assessment#' \
 arckit-uk/recipes/uk-saas.yaml
```

- [ ] **Step 3: Verify uk-saas now references only neutral `arckit:` + `arckit-uk:` skills**

Run: `grep -E "skill: arckit:(tcop|secure|dpia|ai-playbook|service-assessment|gov-reuse)\b" arckit-uk/recipes/uk-saas.yaml`
Expected: no output.

### Task 2.2: Author the neutral `baseline` default recipe in core

**Files:** Create `arckit-claude/skills/arckit-build/recipes/baseline.yaml`

- [ ] **Step 1: Create `baseline.yaml`** — `uk-saas` minus all UK targets (no GOV_REUSE optional, no tcop/secure/dpia/ai-playbook/atrs/service-assessment targets). Reuse the `uk-saas` header/`{P}`/`{NAME}` substitution block and the neutral waves (PRIN, GLOSSARY, REQ, STKE, RESEARCH, AWS/AZURE/GCP_RESEARCH, DATASCOUT, ADR×8, STRATEGY, WARDLEY, RISK, HLDR, SOBC, DIAGRAM×3, PLAN, ROADMAP, DEVOPS, FINOPS, OPS, TRACE). Set:

```yaml
recipe: baseline
schema_version: 1
description: >
  Neutral ArcKit governance baseline — strategy, architecture, delivery,
  and assurance artefacts with no jurisdiction-specific compliance. Layer a
  jurisdiction overlay (arckit-uk, arckit-au, arckit-us, ...) for regional
  compliance recipes.
```

- [ ] **Step 2: Verify baseline chains zero UK commands**

Run: `grep -cE "skill: arckit:(tcop|secure|dpia|ai-playbook|atrs|service-assessment|gov-reuse|dos|gcloud)" arckit-claude/skills/arckit-build/recipes/baseline.yaml`
Expected: `0`

- [ ] **Step 3: Switch the build skill default from `uk-saas` to `baseline`** in `arckit-claude/skills/arckit-build/SKILL.md` (lines referencing the default recipe and the `uk-saas`/`uk-mod-sovereign` core-recipe list — remove the moved recipes, add `baseline`).

Run: `grep -n "uk-saas\|uk-mod-sovereign\|Default recipe" arckit-claude/skills/arckit-build/SKILL.md`
Then edit those lines: default → `baseline`; core recipe list → `baseline` only.

### Task 2.3: Relocate `uk-mod-sovereign` → `arckit-uk-mod` and re-point

- [ ] **Step 1: Move + re-point** (its targets: tcop, mod-secure, dpia, ai-playbook, jsp-936, atrs)

```bash
git mv arckit-claude/skills/arckit-build/recipes/uk-mod-sovereign.yaml arckit-uk-mod/recipes/uk-mod-sovereign.yaml
sed -i -E \
 -e 's#skill: arckit:tcop#skill: arckit-uk:uk-tcop#' \
 -e 's#skill: arckit:dpia#skill: arckit-uk:uk-dpia#' \
 -e 's#skill: arckit:ai-playbook#skill: arckit-uk:uk-ai-playbook#' \
 -e 's#skill: arckit:atrs#skill: arckit-uk:uk-atrs#' \
 -e 's#skill: arckit:mod-secure#skill: arckit-uk-mod:uk-mod-secure#' \
 -e 's#skill: arckit:jsp-936#skill: arckit-uk-mod:uk-mod-jsp-936#' \
 arckit-uk-mod/recipes/uk-mod-sovereign.yaml
```

- [ ] **Step 2: Verify**

Run: `grep -E "skill: arckit:(tcop|dpia|ai-playbook|atrs|mod-secure|jsp-936)\b" arckit-uk-mod/recipes/uk-mod-sovereign.yaml`
Expected: no output.

### Task 2.4: Relocate NHS + Finance recipes and re-point

- [ ] **Step 1: Move** `uk-nhs-clinical-safety.yaml` → `arckit-uk-nhs/recipes/`, `uk-fs-payments.yaml` → `arckit-uk-finance/recipes/`

```bash
git mv arckit-claude/skills/arckit-build/recipes/uk-nhs-clinical-safety.yaml arckit-uk-nhs/recipes/uk-nhs-clinical-safety.yaml
git mv arckit-claude/skills/arckit-build/recipes/uk-fs-payments.yaml          arckit-uk-finance/recipes/uk-fs-payments.yaml
```

- [ ] **Step 2: Re-point UK targets** in both (nhs uses gov-reuse, tcop, secure, dpia, ai-playbook, atrs, service-assessment; finance uses dpia) using the same per-command `sed` block as Task 2.1/2.3.

- [ ] **Step 3: Verify neither recipe references an unmigrated `arckit:<uk-cmd>`**

Run: `grep -rnE "skill: arckit:(tcop|secure|dpia|ai-playbook|atrs|service-assessment|gov-reuse)\b" arckit-uk-nhs/recipes arckit-uk-finance/recipes`
Expected: no output.

### Task 2.5: Decouple the UAE + AU recipes

- [ ] **Step 1: Drop the 5 redundant UK targets from both UAE recipes.** Remove the target blocks for `arckit:tcop`, `arckit:secure`, `arckit:dpia`, `arckit:ai-playbook`, `arckit:atrs` in `arckit-uae/recipes/uae-federal-ai.yaml` and `uae-agentic-transformation.yaml` (UAE keeps its native `uae-pdpl`/`uae-ias`/`uae-ai-charter`/`uae-ai-autonomy-tier`). Update any `deps:` lists that referenced the removed target IDs.

Run: `grep -nE "skill: arckit:(tcop|secure|dpia|ai-playbook|atrs)\b" arckit-uae/recipes/*.yaml`
Then delete each matched target block (the `- id:` line through its `output:`), and scrub the IDs from downstream `deps:`.

- [ ] **Step 2: Swap AU's one UK target** in `arckit-au/recipes/au-federal.yaml`: replace `skill: arckit:ai-playbook` with `skill: arckit-au:au-ai-assurance` (AU already ships `au-ai-assurance`). Update the target `id`/`output type` to the AU doc-type. Update the comment lines that mention `arckit:secure`/`arckit:dpia`/`arckit:tcop` to drop the stale `arckit:` form.

- [ ] **Step 3: Verify no overlay recipe references a moved UK command**

Run: `grep -rnE "skill: arckit:(tcop|secure|dpia|ai-playbook|atrs|service-assessment|dos|gcloud-search|gcloud-clarify|gov-reuse|gov-code-search|gov-landscape|grants|mod-secure|jsp-936)\b" arckit-uae arckit-au arckit-ca arckit-eu arckit-fr arckit-at arckit-us arckit-au-energy`
Expected: no output.

- [ ] **Step 4: Commit (WIP)**

```bash
git add arckit-uk arckit-uk-mod arckit-uk-nhs arckit-uk-finance arckit-uae arckit-au arckit-claude/skills/arckit-build
git commit -m "refactor(uk): relocate + re-point recipes; neutral baseline default; decouple UAE/AU [WIP]"
```

---

## Phase 3 — Core neutralisation (WIP)

### Task 3.1: Neutralise `commands/risk.md` on `governance_framework`

**Files:** Modify `arckit-claude/commands/risk.md`

- [ ] **Step 1: Add a framework switch near the top of the command body** (after the intro), making Orange Book conditional:

```markdown
## Risk framework selection

Read `${user_config.governance_framework}` (defaults to `Generic`).

- **`UK Gov`** → use the HM Treasury Orange Book (2023) structure described below (5x5 matrix, the four Ts, risk appetite per the Orange Book).
- **`Generic`** → use an ISO 31000-aligned register: same columns, but frame methodology as ISO 31000 (risk identification, analysis, evaluation, treatment) with no HM Treasury / Orange Book references. Omit the Orange Book governance roles section.
```

- [ ] **Step 2: Guard the UK-only prose.** Wrap the "About Orange Book" and Orange-Book-specific sections so they apply only under `UK Gov`; provide the ISO 31000 wording for `Generic`. Update the frontmatter `description` to "Create a comprehensive risk register (ISO 31000; HM Treasury Orange Book under UK Gov governance framework)".

- [ ] **Step 3: Verify the command no longer hard-asserts UK framing in its description**

Run: `head -3 arckit-claude/commands/risk.md`
Expected: description mentions ISO 31000 (neutral default), Orange Book conditional.

### Task 3.2: Neutralise `commands/sobc.md` on `governance_framework`

**Files:** Modify `arckit-claude/commands/sobc.md`

- [ ] **Step 1:** `sobc` already branches on UK mentions. Replace the ad-hoc detection with the explicit `${user_config.governance_framework}` switch: `UK Gov` → full Green Book 5-case; `Generic` → 5-case structure with neutral wording (no HM Treasury / Green Book discount-rate references). Update the frontmatter `description` accordingly.

- [ ] **Step 2: Verify**

Run: `grep -n "governance_framework\|Green Book" arckit-claude/commands/sobc.md | head`
Expected: Green Book references are inside the `UK Gov` branch.

### Task 3.3: Regime-gate `hooks/graph-inject.mjs`

**Files:** Modify `arckit-claude/hooks/graph-inject.mjs`

- [ ] **Step 1: Add the regime gate.** Import the shared helper created in Task 3.4 (`hooks/regime.mjs`):

```js
import { ukGov } from './regime.mjs';

// ukGov() reads process.env.CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK === 'UK Gov'
// (Claude Code exports plugin userConfig to hook subprocesses; see
// notify-stale-artifacts.mjs). Reads at call time; off when unset.
```

- [ ] **Step 2: Split `EXT_RECOMMEND` into neutral base + UK-gated, replacing the current array:**

```js
const EXT_RECOMMEND_BASE = [
  { patterns: [/api/i, /swagger/i, /openapi/i], commands: '/arckit:requirements, /arckit:data-model, /arckit:diagram' },
  { patterns: [/schema/i, /erd/i, /\.sql$/i], commands: '/arckit:data-model, /arckit:data-mesh-contract' },
  { patterns: [/cost/i, /pricing/i, /budget/i], commands: '/arckit:sobc, /arckit:finops' },
  { patterns: [/pipeline/i, /\bci\b/i, /deploy/i], commands: '/arckit:devops' },
  { patterns: [/rfp/i, /itt/i, /tender/i], commands: '/arckit:sow, /arckit:evaluate' },
  { patterns: [/risk/i, /threat/i], commands: '/arckit:risk' },
  { patterns: [/policy/i, /standard/i], commands: '/arckit:principles' },
];

const EXT_RECOMMEND_UK = [
  { patterns: [/security/i, /pentest/i, /vuln/i], commands: '/arckit-uk:uk-secure, /arckit-uk:uk-dpia' },
  { patterns: [/compliance/i, /audit/i], commands: '/arckit-uk:uk-tcop, /arckit:conformance' },
];

function extRecommend() {
  return ukGov() ? [...EXT_RECOMMEND_UK, ...EXT_RECOMMEND_BASE] : EXT_RECOMMEND_BASE;
}
```

Note: define `ukGov` in `hooks/regime.mjs` (Task 3.4) and import it here — do Task 3.4 first, or create `regime.mjs` as the opening step of this task.

- [ ] **Step 3: Update `recommendCommands`** to call `extRecommend()`:

```js
function recommendCommands(filename) {
  for (const { patterns, commands } of extRecommend()) {
    if (patterns.some(p => p.test(filename))) return commands;
  }
  return '/arckit:requirements, /arckit:analyze';
}
```

- [ ] **Step 4: Write a behavioural test.** Create `tests/plugin/test_graph_inject_regime.mjs`:

```js
import assert from 'node:assert';

// ukGov() reads the env var at call time, so one import + flipping the env
// between calls exercises both regimes.
const { recommendForTest } = await import('../../arckit-claude/hooks/graph-inject.mjs');

process.env.CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK = 'Generic';
assert.ok(!recommendForTest('pentest-report.pdf').includes('uk-secure'), 'neutral: no uk-secure');

process.env.CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK = 'UK Gov';
assert.ok(recommendForTest('pentest-report.pdf').includes('uk-secure'), 'UK Gov: uk-secure');

console.log('ok');
```

Add `export const recommendForTest = recommendCommands;` at the end of `graph-inject.mjs`.

- [ ] **Step 5: Run the test**

Run: `node tests/plugin/test_graph_inject_regime.mjs`
Expected: `ok`

### Task 3.4: Regime-gate `hooks/graph-rollups.mjs` + `scripts/bash/create-project.sh`

**Files:** Modify `arckit-claude/hooks/graph-rollups.mjs`, `arckit-claude/scripts/bash/create-project.sh`

- [ ] **Step 0: Create the shared helper `arckit-claude/hooks/regime.mjs`** (imported by both `graph-inject.mjs` and `graph-rollups.mjs`, DRY):

```js
// arckit-claude/hooks/regime.mjs
// True when the user's ArcKit governance framework is UK Gov. Claude Code
// exports plugin userConfig to hook subprocesses as CLAUDE_PLUGIN_OPTION_<FIELD>
// (see notify-stale-artifacts.mjs). Read at call time; off when unset.
export function ukGov() {
  return (process.env.CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK || '') === 'UK Gov';
}
```

- [ ] **Step 1: In `graph-rollups.mjs`,** re-point the `CONTEXTUAL_TYPES` DPIA/SECD/TCOP commands to `arckit-uk:uk-*` and gate them on `ukGov()`. Keep `DATA` neutral. The hook subprocess has the env var set at spawn, so evaluating at module load is correct:

```js
import { ukGov } from './regime.mjs';
export const CONTEXTUAL_TYPES = [
  ...(ukGov() ? [
    { type: 'DPIA', command: '/arckit-uk:uk-dpia',   trigger: 'processing personal data' },
    { type: 'SECD', command: '/arckit-uk:uk-secure', trigger: 'security-sensitive system' },
    { type: 'TCOP', command: '/arckit-uk:uk-tcop',   trigger: 'UK Gov Service Standard' },
  ] : []),
  { type: 'DATA', command: '/arckit:data-model', trigger: 'DR-* requirements present' },
];
```

- [ ] **Step 2: In `create-project.sh`,** make the welcome text's UK command list conditional, or drop the UK command names from the generic welcome text (lines ~175, ~249–251). Simplest neutral fix: remove `/arckit.secure`, `/arckit.tcop`, `/arckit.ai-playbook` from the generic welcome and keep neutral commands.

Run: `grep -n "arckit.secure\|arckit.tcop\|arckit.ai-playbook" arckit-claude/scripts/bash/create-project.sh`
Then edit those lines.

- [ ] **Step 3: Verify both hooks import the shared helper and tests pass**

Run: `node tests/plugin/test_graph_inject_regime.mjs && node -e "import('./arckit-claude/hooks/graph-rollups.mjs').then(()=>console.log('loads'))"`
Expected: `ok` then `loads`

### Task 3.5: Regime-gate `analyze`/`health`/`impact` + architecture-workflow paths

**Files:** Modify `arckit-claude/commands/{analyze,health,impact}.md`, `arckit-claude/skills/architecture-workflow/references/{uk-gov-path,defence-path,ai-ml-path,data-path,standard-path}.md`

- [ ] **Step 1: In `analyze.md`/`health.md`/`impact.md`,** wrap the UK command recommendations in a `${user_config.governance_framework} == UK Gov` conditional (these are model-side command bodies, so they CAN read userConfig), and re-point the names to `/arckit-uk:uk-*`. Keep neutral recommendations unconditional.

- [ ] **Step 2: In the workflow path skills,** the `uk-gov-path.md` and `defence-path.md` are inherently UK — re-point their command refs to `/arckit-uk:uk-*` and `/arckit-uk-mod:uk-mod-*` and note at the top "requires arckit-uk (+ arckit-uk-mod for defence)". Remove UK command refs from the neutral `standard-path.md`/`data-path.md`/`ai-ml-path.md`, or gate them with a "if UK Gov" note.

- [ ] **Step 3: Commit (WIP)**

```bash
git add arckit-claude/commands/risk.md arckit-claude/commands/sobc.md arckit-claude/commands/analyze.md arckit-claude/commands/health.md arckit-claude/commands/impact.md arckit-claude/hooks arckit-claude/scripts/bash/create-project.sh arckit-claude/skills/architecture-workflow tests/plugin/test_graph_inject_regime.mjs
git commit -m "refactor(core): neutralise risk/sobc; regime-aware recommendation engine [WIP]"
```

---

## Phase 4 — Re-point cosmetic references (WIP)

### Task 4.1: Author the canonical rename `sed` script

**Files:** Create `scripts/migrate-uk-refs.sh` (throwaway migration helper; delete before Phase 5 commit or keep under `scripts/` — decide in 4.4)

- [ ] **Step 1: Write the script** mapping every old → new, both `:` and `.` separators, longest-match-first to avoid `secure`→`uk-secure` double-application:

```bash
#!/usr/bin/env bash
# Re-point /arckit:<old> and /arckit.<old> references to the new overlay names.
set -euo pipefail
declare -a MAP=(
  "mod-secure:arckit-uk-mod:uk-mod-secure"
  "jsp-936:arckit-uk-mod:uk-mod-jsp-936"
  "service-assessment:arckit-uk:uk-service-assessment"
  "gcloud-search:arckit-uk:uk-gcloud-search"
  "gcloud-clarify:arckit-uk:uk-gcloud-clarify"
  "gov-code-search:arckit-uk:uk-gov-code-search"
  "gov-landscape:arckit-uk:uk-gov-landscape"
  "gov-reuse:arckit-uk:uk-gov-reuse"
  "ai-playbook:arckit-uk:uk-ai-playbook"
  "tcop:arckit-uk:uk-tcop"
  "secure:arckit-uk:uk-secure"
  "dpia:arckit-uk:uk-dpia"
  "atrs:arckit-uk:uk-atrs"
  "dos:arckit-uk:uk-dos"
  "grants:arckit-uk:uk-grants"
)
for f in "$@"; do
  for m in "${MAP[@]}"; do
    IFS=: read -r old plug new <<<"$m"
    sed -i -E "s#/arckit[:.]${old}\b#/${plug}:${new}#g" "$f"
  done
done
```

Order matters: `mod-secure` and `gov-*` precede `secure`/`gov-reuse` substrings; `\b` plus the leading `/arckit[:.]` anchor prevents partial hits. (`gcloud-search`/`gcloud-clarify` precede nothing risky.)

- [ ] **Step 2: Dry-run on one file and eyeball the diff**

```bash
cp arckit-claude/commands/analyze.md /tmp/analyze.bak
bash scripts/migrate-uk-refs.sh arckit-claude/commands/analyze.md
diff /tmp/analyze.bak arckit-claude/commands/analyze.md
```

Expected: only the intended `/arckit:secure`→`/arckit-uk:uk-secure` style rewrites, no double-prefixing.

### Task 4.2: Run the rename across core (excluding CHANGELOG history + already-moved dirs)

- [ ] **Step 1: Apply to core commands, agents, templates, skills, guides, scripts** (NOT `CHANGELOG.md` — historical):

```bash
mapfile -t FILES < <(grep -rlE '/arckit[:.](tcop|secure|dpia|ai-playbook|atrs|service-assessment|dos|gcloud-search|gcloud-clarify|gov-reuse|gov-code-search|gov-landscape|grants|mod-secure|jsp-936)\b' \
  arckit-claude/commands arckit-claude/agents arckit-claude/templates arckit-claude/skills arckit-claude/docs/guides arckit-claude/scripts \
  --include=*.md --include=*.sh 2>/dev/null)
bash scripts/migrate-uk-refs.sh "${FILES[@]}"
```

- [ ] **Step 2: Apply to the other overlays' command bodies** (fr, eu, at, us, au, nhs, finance):

```bash
mapfile -t OFILES < <(grep -rlE '/arckit[:.](tcop|secure|dpia|ai-playbook|atrs|service-assessment|dos|gcloud-search|gcloud-clarify|gov-reuse|gov-code-search|gov-landscape|grants|mod-secure|jsp-936)\b' \
  arckit-fr arckit-eu arckit-at arckit-us arckit-au arckit-uk-nhs arckit-uk-finance --include=*.md 2>/dev/null)
bash scripts/migrate-uk-refs.sh "${OFILES[@]}"
```

- [ ] **Step 3: Verify no stale `/arckit:<moved>` ref remains outside CHANGELOGs**

```bash
grep -rnE '/arckit[:.](tcop|secure|dpia|ai-playbook|atrs|service-assessment|dos|gcloud-search|gcloud-clarify|gov-reuse|gov-code-search|gov-landscape|grants|mod-secure|jsp-936)\b' \
  arckit-claude arckit-fr arckit-eu arckit-at arckit-us arckit-au arckit-uk-nhs arckit-uk-finance \
  --include=*.md --include=*.sh --include=*.mjs | grep -v 'CHANGELOG' | grep -vE '/(arckit-uk|arckit-uk-mod):'
```

Expected: no output. (Any hit is a missed reference — re-run the script on that file.)

### Task 4.3: Fix the `roles/*` and `uk-government/*` guide groupings + doc-type comments

- [ ] **Step 1: Re-point the doc-type→command comments** in `arckit-claude/config/doc-types.mjs` (the `// → /arckit:tcop`-style comments) and tag `SECD` with `regime: 'UK'`:

Run: `grep -n "SECD'\|/arckit:" arckit-claude/config/doc-types.mjs | head`
Then edit the `SECD` entry to add `regime: 'UK'` and fix any command-name comments.

- [ ] **Step 2: Verify doc-types still parse + dual-registration holds**

Run: `node -e "import('./arckit-claude/config/doc-types.mjs').then(m=>console.log(Object.keys(m.DOC_TYPES||{}).length,'types'))"`
Expected: prints the type count without error.

### Task 4.4: Commit cosmetic re-pointing

- [ ] **Step 1: Decide on the helper script.** Keep `scripts/migrate-uk-refs.sh` under version control (useful for the test-repo migration plan) or `git rm` it. Recommended: keep it.

- [ ] **Step 2: Commit (WIP)**

```bash
git add -u arckit-claude arckit-fr arckit-eu arckit-at arckit-us arckit-au arckit-uk-nhs arckit-uk-finance scripts/migrate-uk-refs.sh
git commit -m "refactor: re-point ~260 cross-references to arckit-uk/arckit-uk-mod [WIP]"
```

Note: `git add -u <paths>` stages only tracked modifications under the named paths — it does NOT sweep untracked files, and the explicit path list keeps `.arckit/memory/sessions.md` out.

---

## Phase 5 — Dependencies, docs, converter, validation (GREEN GATE)

### Task 5.1: Re-parent NHS + Finance onto `arckit-uk`

**Files:** Modify `arckit-uk-nhs/.claude-plugin/plugin.json`, `arckit-uk-finance/.claude-plugin/plugin.json`

- [ ] **Step 1: Add `arckit-uk` to each `dependencies` array**

```json
    { "name": "arckit-uk", "version": "=5.8.0" }
```

- [ ] **Step 2: Verify both depend on arckit + arckit-uk**

Run: `grep -A8 '"dependencies"' arckit-uk-nhs/.claude-plugin/plugin.json arckit-uk-finance/.claude-plugin/plugin.json`
Expected: each lists `arckit` and `arckit-uk`.

### Task 5.2: Documentation sweep

**Files:** `README.md`, `docs/index.html`, `docs/DEPENDENCY-MATRIX.md`, `CLAUDE.md`, both `CHANGELOG.md`, new `docs/MIGRATION-v6.md`

- [ ] **Step 1: Create `docs/MIGRATION-v6.md`** with the old→new command table (the 15 mappings from spec section 5), an "enable arckit-uk (default-on)" note, and the `arckit-uk-mod`/NHS/Finance dependency notes.

- [ ] **Step 2: Update `README.md`:** move the UK command sections under an `arckit-uk`/`arckit-uk-mod` overlay heading; fix the `/arckit:<overlay-cmd>` namespace error globally to `/arckit-<overlay>:<cmd>`; update the core blurb to drop "including UK Government compliance"; update command counts (core 71→56; new overlays).

- [ ] **Step 3: Update `CLAUDE.md`** (plugin list, command counts, agent table — move the 8 UK agents to an arckit-uk note), `docs/DEPENDENCY-MATRIX.md`, `docs/index.html` (command tables / plugin list).

- [ ] **Step 4: Add `### Changed`/`### Removed` entries to BOTH `CHANGELOG.md` and `arckit-claude/CHANGELOG.md`** describing the extraction (root has it; plugin one must match — the known parity gotcha).

- [ ] **Step 5: Markdown lint the changed docs**

Run: `npx markdownlint-cli2 "README.md" "CLAUDE.md" "docs/MIGRATION-v6.md" "docs/DEPENDENCY-MATRIX.md"`
Expected: no errors (fix any).

### Task 5.3: Regenerate non-Claude formats

- [ ] **Step 1: Run the converter**

Run: `python scripts/converter.py`
Expected: emits Codex/OpenCode/Gemini/Copilot/Paperclip outputs including `uk-*`/`uk-mod-*` commands; `Sources: 13 plugin dirs` (or current count) printed.

- [ ] **Step 2: Verify the new commands landed in a generated format**

Run: `grep -rl "uk-tcop" arckit-codex arckit-opencode arckit-gemini | head`
Expected: at least one generated file per format references `uk-tcop`.

### Task 5.4: Run all CI guards (the green gate)

- [ ] **Step 1: Cross-reference linter**

Run: `python scripts/check_references.py`
Expected: exit 0, no dangling `${CLAUDE_PLUGIN_ROOT}` paths / handoff slugs / user_config keys.

- [ ] **Step 2: Regime registration + dual registration**

Run: `node scripts/tests/test-regime-registration.mjs`
Expected: pass (UK + MOD already registered; SECD now tagged UK).

- [ ] **Step 3: Hook regime test + markdownlint full**

Run: `node tests/plugin/test_graph_inject_regime.mjs && npx markdownlint-cli2 "**/*.md"`
Expected: `ok` then lint clean (fix residual).

- [ ] **Step 4: Stale-reference sweep (final)**

Run the Task 4.2 Step 3 verification grep again across the whole repo.
Expected: no output.

- [ ] **Step 5: Commit the green state**

```bash
git add -u README.md CLAUDE.md docs arckit-claude arckit-uk arckit-uk-mod arckit-uk-nhs arckit-uk-finance arckit-codex arckit-opencode arckit-gemini arckit-copilot arckit-paperclip
git add docs/MIGRATION-v6.md
git commit -m "refactor(uk): re-parent NHS/Finance, doc sweep, regenerate extensions (green)"
```

### Task 5.5: Plugin-tag dry-run (requires clean tree)

- [ ] **Step 1: Confirm clean tree, then dry-run every plugin** (use directory name for core)

```bash
git status --porcelain | grep -v '.arckit/memory/sessions.md\|.arckit/templates/story-template.md' && echo "DIRTY" || true
for d in arckit-claude arckit-uk arckit-uk-mod arckit-uae arckit-fr arckit-ca arckit-eu arckit-at arckit-au arckit-au-energy arckit-us arckit-uk-nhs arckit-uk-finance; do
  echo "== $d =="; claude plugin tag "$d" --dry-run || echo "FAIL $d"
done
```

Expected: each validates (version/marketplace agreement). At `5.8.0` the deps pin `=5.8.0` consistently across new + existing plugins, so this is clean pre-bump.

---

## Phase 6 — Version bump + memory

### Task 6.1: Bump to v6.0.0

- [ ] **Step 1: Run the bump script** (auto-discovers the two new plugins from disk and pins all `arckit*` deps to `=6.0.0`, per the v5.8.0 fix)

Run: `scripts/bump-version.sh 6.0.0`
Expected: all 15+ version locations + new plugins → `6.0.0`; `arckit-uk-mod`/`arckit-uk-nhs`/`arckit-uk-finance` deps on `arckit-uk`/`arckit` → `=6.0.0`.

- [ ] **Step 2: Re-run converter + the green-gate guards** (Task 5.3–5.4) to confirm nothing regressed at the new version.

Run: `python scripts/converter.py && python scripts/check_references.py && node scripts/tests/test-regime-registration.mjs`
Expected: all pass.

- [ ] **Step 3: Finalise both CHANGELOGs** with the `6.0.0` heading and date; ensure root + `arckit-claude/CHANGELOG.md` match.

- [ ] **Step 4: Commit**

```bash
git add -u
git reset HEAD .arckit/memory/sessions.md .arckit/templates/story-template.md
git commit -m "chore(release): v6.0.0 — extract UK Government overlay"
```

(`git add -u` then explicit `git reset` of the two pre-existing unrelated changes — never `-A`.)

### Task 6.2: Update memory

- [ ] **Step 1: Update the memory files** noted in spec section 10: `project_command_count_policy` (official baseline now spans 3 official plugins: arckit 56 + arckit-uk 13 + arckit-uk-mod 2), `project_reader_writer_pattern` (grants + gov-reuse families moved to arckit-uk; datascout stays), `project_overlay_registration_checklist` (two new official plugins; converter/marketplace/sync-shared-assets updated), and the `MEMORY.md` version index (v6.0.0, 13 plugins).

- [ ] **Step 2: Final acceptance check** against spec section 13. Confirm: core has zero UK-specific commands; `risk`/`sobc` gate on `governance_framework`; NHS/Finance deps include `arckit-uk`; converter emits `uk-*`; `MIGRATION-v6.md` exists; README namespace error fixed.

Run: `ls arckit-claude/commands | grep -cE '^(tcop|secure|dpia|ai-playbook|atrs|service-assessment|dos|gcloud-search|gcloud-clarify|gov-reuse|gov-code-search|gov-landscape|grants|mod-secure|jsp-936)\.md$'`
Expected: `0`

---

## Out of scope (separate follow-on plans)

- **Test-repo migration:** apply `scripts/migrate-uk-refs.sh` across the 27 external test repos and enable `arckit-uk` in their plugin config. Post-tag, mechanical, per-repo.
- **PR + release:** open PR from `uk-gov-overlay-extraction`, squash-merge, then the standard release flow (`tag-plugins.sh`, `push-extensions.sh`) — Mark drives releases.
- **Neutral AI-governance / threat-model commands in core** (deferred net-new).
- **Moving the gated UK suggestion tables out of core hooks into `arckit-uk`** (framework change).

---

## Self-review

- **Spec coverage:** decisions 1–7 → Phases 1–5 (extraction, defence split, uk- prefix, default-on, UAE/AU decouple in 2.5, uk-saas+baseline in 2.1–2.2, regime-aware in 3.3–3.5). Blast radius Tier 1 → 2.5/2.x; Tier 2 → 4.x; NHS/Finance → 5.1. Registration checklist → 0.5/5.x. Migration → 5.2. Acceptance criteria → 5.4/6.2.
- **Mechanism risks surfaced as spikes:** hook gating (0.1) resolved to reading the `CLAUDE_PLUGIN_OPTION_GOVERNANCE_FRAMEWORK` env var (hooks can read userConfig after all); `defaultEnabled` (0.2) confirmed runtime-supported (CC 2.1.159), behavioural smoke-test flagged as a non-blocking release gate.
- **No silent caps:** the stale-ref grep (4.2.3 / 5.4.4) is the completeness guard — any missed reference fails it loudly.
