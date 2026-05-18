# arckit-au Plugin — Australian Federal Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land the Australian Federal / DISP-supplier compliance overlay (sourced from #441) as the 6th community plugin `arckit-au`, structured for the v5.0.0 plugin split.

**Architecture:** New `arckit-au/` directory at repo root, peer to `arckit-uae`, `arckit-fr`, `arckit-ca`, `arckit-eu`, `arckit-at`. Self-contained marketplace plugin with its own `commands/`, `templates/`, and `recipes/`. Doc-type codes stay in core (`arckit-claude/config/doc-types.mjs`) per the v5.0.0 design — single source of truth for the `validate-arc-filename` hook.

**Tech Stack:** Claude Code plugin manifest format, marketplace.json schema, Python (`scripts/converter.py`), Bash (helper scripts), Node.js ESM (`doc-types.mjs`).

**Source:** PR #441 (`au-federal-recipe` branch by @royster70). PR #441 is **closed and superseded** by this plan — the same content is restructured into `arckit-au/` layout rather than `arckit-claude/`.

**Spec:** v5.0.0 spec `docs/superpowers/specs/2026-05-17-plugin-split-design.md` defines the per-jurisdiction overlay shape this plan implements for Australia.

---

## Pre-requisites

This plan **depends on** v5.0.0 plugin split (PR #485) merging to main first. Reasons:

1. The 5 existing community plugin dirs (`arckit-uae`, `arckit-fr`, `arckit-ca`, `arckit-eu`, `arckit-at`) and the marketplace.json registration pattern only exist after v5.0.0 merges.
2. The `arckit-build` skill's three-tier recipe lookup (Task 9 of the v5 plan) is needed for the `au-federal` recipe to resolve.
3. The converter (`scripts/converter.py`) is rewritten in Task 10 of the v5 plan to walk all 6 PLUGIN_SOURCES — without that, regenerating non-Claude extensions for `au-*` commands won't work.

**Do not start execution until v5.0.0 is on main.**

---

## File structure

### New files

```
arckit-au/
├── .claude-plugin/plugin.json
├── README.md
├── VERSION
├── commands/                              # 8 files ported from #441
│   ├── au-ai-assurance.md
│   ├── au-disp-attestation.md
│   ├── au-dss.md
│   ├── au-e8-posture.md
│   ├── au-ism-controls.md
│   ├── au-ndb-playbook.md
│   ├── au-pia.md
│   └── au-pspf.md
├── templates/                             # 8 files ported from #441
│   ├── au-ai-assurance-template.md
│   ├── au-disp-attestation-template.md
│   ├── au-dss-template.md
│   ├── au-e8-posture-template.md
│   ├── au-ism-controls-template.md
│   ├── au-ndb-playbook-template.md
│   ├── au-pia-template.md
│   └── au-pspf-template.md
└── recipes/
    └── au-federal.yaml                    # 35 targets, 9 build waves
```

### Modified files (in `arckit-claude/`)

| File | Change |
|---|---|
| `arckit-claude/config/doc-types.mjs` | Add 8 AU doc-type codes (`AUE8`, `AUISM`, `AUPIA`, `AUNDB`, `AUDSS`, `AUPSPF`, `AUAIA`, `AUDISP`); add `'AU'` to `REGIMES` array and `REGIME_LABELS` object |
| `arckit-claude/commands/pages.md` | Dual-register the 8 new type codes in Document Types allow-list |
| `arckit-claude/skills/arckit-build/SKILL.md` | Add `au-federal` row to Built-in recipes table (`arckit-au` plugin) |

### Modified files (repo-level)

| File | Change |
|---|---|
| `.claude-plugin/marketplace.json` | Add `arckit-au` entry (7th plugin) |
| `README.md` | Australian Federal / DISP-supplier overlay community section |
| `CHANGELOG.md` + `arckit-au/CHANGELOG.md` | New entry |
| `docs/guides/au-federal-overlay.md` | Single overlay maintenance guide |
| `docs/au-federal-validation-scorecard.md` | Validation evidence (25/25 scorecard, 220 AU framework references, 0 UK leakage) |

### Generated outputs (Task 9)

The converter regenerates non-Claude format variants for the 8 new commands:

- `arckit-codex/commands/arckit.au-*.md` + `arckit-codex/prompts/arckit.au-*.md` + `arckit-codex/skills/arckit-au-*/SKILL.md`
- `arckit-opencode/commands/arckit.au-*.md`
- `arckit-gemini/commands/arckit/au-*.toml`
- `arckit-copilot/prompts/arckit-au-*.prompt.md`
- `arckit-paperclip/src/data/commands.json`

**Total: ~25 new files in `arckit-au/`, ~3 modifications to core, ~50 generated files in extensions.**

---

## Branch strategy

All work happens on `feat/arckit-au-plugin` branched from `main` **after v5.0.0 lands**. Sub-tasks land as separate commits on this branch. Branch opens as a draft PR after Task 2 and flips to ready in Task 12.

**Do not push directly to `main`.** Never `git add -A` — always explicit paths.

---

## Task 1: Branch from main (post-v5.0.0)

- [ ] **Step 1: Confirm v5.0.0 is on main**

```bash
git checkout main
git pull
git log --oneline | grep -E "v5\.0\.0|plugin-split"
```

Expected: A merge commit referencing v5.0.0 plugin split (PR #485 merged).

- [ ] **Step 2: Branch off main**

```bash
git checkout -b feat/arckit-au-plugin
```

- [ ] **Step 3: Verify the 5 existing community plugin dirs exist**

```bash
ls -d arckit-{uae,fr,ca,eu,at}/
```

Expected: 5 directories listed. If any is missing, v5.0.0 didn't merge cleanly — investigate before continuing.

---

## Task 2: Scaffold `arckit-au/` and register in marketplace

**Files:**
- Create: `arckit-au/.claude-plugin/plugin.json`, `arckit-au/README.md`, `arckit-au/VERSION`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Write `arckit-au/.claude-plugin/plugin.json`**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-plugin-manifest.json",
  "name": "arckit-au",
  "version": "5.1.0",
  "description": "Australian Federal Overlay for ArcKit — 8 commands for ASD Essential Eight, ISM, DTA Digital Service Standard, Privacy Act 1988 PIA, OAIC Notifiable Data Breach, PSPF, DTA AI Assurance, and DISP supplier attestation. Recipe: au-federal. Requires arckit core plugin.",
  "author": {
    "name": "TractorJuice",
    "url": "https://github.com/tractorjuice"
  },
  "repository": "https://github.com/tractorjuice/arc-kit",
  "license": "MIT"
}
```

Version: `5.1.0` because AU lands in the first post-v5.0.0 minor cycle. If v5.0.0 hasn't shipped yet at execution time, bump to whatever is current `5.0.x` and target the next minor.

- [ ] **Step 2: Write `arckit-au/README.md`**

Same shape as `arckit-uae/README.md`. Lists the 8 commands, the `au-federal` recipe, the install snippet, and a note that @royster70 is the domain co-maintainer.

- [ ] **Step 3: Write `arckit-au/VERSION`**

```
5.1.0
```

- [ ] **Step 4: Add `arckit-au` entry to `.claude-plugin/marketplace.json`**

Insert after the existing `arckit-at` entry (alphabetical-ish; AT, AU adjacent makes scanning easy). Pattern:

```json
{
  "name": "arckit-au",
  "source": "./arckit-au",
  "description": "Australian Federal Overlay — 8 commands for ASD Essential Eight, ISM, DTA DSS, Privacy Act 1988, OAIC NDB, PSPF, AI Assurance, DISP attestation",
  "version": "5.1.0",
  "author": { "name": "TractorJuice" },
  "homepage": "https://github.com/tractorjuice/arc-kit",
  "repository": "https://github.com/tractorjuice/arc-kit",
  "license": "MIT",
  "keywords": ["architecture", "governance", "australia", "compliance", "disp"],
  "category": "productivity"
}
```

- [ ] **Step 5: Validate JSON parses**

```bash
python3 -c "import json; json.load(open('.claude-plugin/marketplace.json'))"
python3 -c "import json; json.load(open('arckit-au/.claude-plugin/plugin.json'))"
```

- [ ] **Step 6: Commit, push, open draft PR**

```bash
git add arckit-au/.claude-plugin/plugin.json arckit-au/README.md arckit-au/VERSION .claude-plugin/marketplace.json
git commit -m "feat(plugins): scaffold arckit-au community plugin dir"
git push -u origin feat/arckit-au-plugin
gh pr create --draft --title "feat: arckit-au — Australian Federal / DISP-supplier overlay (v5.1.0)" --body "Implements docs/superpowers/plans/2026-05-18-arckit-au-plugin.md. Supersedes #441. Tracked task-by-task. Draft until all tasks complete."
```

---

## Task 3: Port the 8 AU commands from #441

**Files:**
- Create: `arckit-au/commands/au-{e8-posture,pia,dss,ism-controls,ndb-playbook,pspf,ai-assurance,disp-attestation}.md` (8 files)

- [ ] **Step 1: Fetch #441's command sources**

```bash
git fetch origin pull/441/head:au-source
git show au-source:arckit-claude/commands/au-e8-posture.md > arckit-au/commands/au-e8-posture.md
# repeat for the other 7 commands
```

Or use `gh pr checkout 441` in a worktree and copy files across.

- [ ] **Step 2: Adjust each command for the new plugin layout**

In each command body, `${CLAUDE_PLUGIN_ROOT}` now resolves to `arckit-au/` not `arckit-claude/`. Confirm template references still work:

```bash
grep -n "CLAUDE_PLUGIN_ROOT" arckit-au/commands/au-*.md
```

Each line like `${CLAUDE_PLUGIN_ROOT}/templates/au-...-template.md` resolves to `arckit-au/templates/...` after Task 4 — correct.

- [ ] **Step 3: Check the B2 classification-line override is present**

Per `.claude/skills/pr-review-community-overlay/SKILL.md` (recurring blocker class B2), every `au-*` command must explicitly tell the executor to swap the UK classification line for the AU ladder. Verify:

```bash
grep -L "classification scheme\|UK line in the header" arckit-au/commands/au-*.md
```

Expected: no output. Anything printed = missing override; fix before continuing.

- [ ] **Step 4: Check `generate-document-id.sh` invocations are correct**

Per blocker class B3:

```bash
grep -n "generate-document-id.sh" arckit-au/commands/au-*.md | grep -v "<PROJECT_ID>\|{P}"
```

Expected: no matches (i.e. all invocations use `<PROJECT_ID> <DOCTYPE>` positional pattern).

- [ ] **Step 5: Commit**

```bash
git add arckit-au/commands
git commit -m "feat(arckit-au): port 8 AU commands from #441"
```

---

## Task 4: Port the 8 AU templates from #441

**Files:**
- Create: `arckit-au/templates/au-*-template.md` (8 files)

- [ ] **Step 1: Copy template files from #441**

```bash
for t in au-e8-posture au-pia au-dss au-ism-controls au-ndb-playbook au-pspf au-ai-assurance au-disp-attestation; do
  git show au-source:arckit-claude/templates/${t}-template.md > arckit-au/templates/${t}-template.md
done
```

- [ ] **Step 2: Check `## Document Control` heading is present (blocker class B1)**

```bash
for f in arckit-au/templates/au-*-template.md; do
  head -10 "$f" | grep -q "^## Document Control" || echo "MISSING heading: $f"
done
```

Expected: no output. Any "MISSING heading" line = blocker; fix before continuing.

- [ ] **Step 3: Commit**

```bash
git add arckit-au/templates
git commit -m "feat(arckit-au): port 8 AU templates from #441"
```

---

## Task 5: Port the `au-federal` recipe

**Files:**
- Create: `arckit-au/recipes/au-federal.yaml`

- [ ] **Step 1: Copy recipe from #441**

```bash
git show au-source:arckit-claude/skills/arckit-build/recipes/au-federal.yaml > arckit-au/recipes/au-federal.yaml
```

- [ ] **Step 2: Validate the recipe**

```bash
python3 -c "
import yaml
r = yaml.safe_load(open('arckit-au/recipes/au-federal.yaml'))
ids = {t['id'] for t in r['targets']}
ok = all(d.rstrip('*') in {i.rstrip('-') for i in ids} or any(i.startswith(d.rstrip('*')) for i in ids) for t in r['targets'] for d in t['deps'])
print('ok' if ok else 'FAIL')
"
```

Expected: `ok`.

- [ ] **Step 3: Confirm the recipe resolves via the three-tier lookup**

The `arckit-build` skill (updated in v5.0.0 Task 9) globs `${CLAUDE_PLUGIN_ROOT}/../arckit-*/recipes/{NAME}.yaml`. With `arckit-au/recipes/au-federal.yaml` in place, `arckit:build --recipe au-federal` should resolve to this file.

Smoke-test in a test repo if possible. Otherwise rely on the validation in Task 11.

- [ ] **Step 4: Commit**

```bash
git add arckit-au/recipes
git commit -m "feat(arckit-au): port au-federal recipe (35 targets, 9 waves)"
```

---

## Task 6: Register 8 AU doc-type codes in core

**Files:**
- Modify: `arckit-claude/config/doc-types.mjs`
- Modify: `arckit-claude/commands/pages.md` (Document Types allow-list)

Per the v5.0.0 spec: doc-types stay in core forever (single source of truth for `validate-arc-filename` hook). Doc-type registration is a core change, not an `arckit-au` change.

- [ ] **Step 1: Add 8 entries to `doc-types.mjs`**

For each of `AUE8`, `AUISM`, `AUPIA`, `AUNDB`, `AUDSS`, `AUPSPF`, `AUAIA`, `AUDISP`: add a record with `regime: 'AU'`, correct `category` (Compliance vs Governance), and `severity: 'HIGH'` for assessment-class types (PIA-equivalent, AI-assurance — match the #441 entries).

Source data: `git show au-source:arckit-claude/config/doc-types.mjs` — copy the AU entries verbatim.

- [ ] **Step 2: Register `'AU'` in `REGIMES` and `REGIME_LABELS`**

Per blocker class B5 in the community-overlay review skill. Order convention: officially-maintained first, then community alphabetical. `AU` slots in before `CA`.

- [ ] **Step 3: Update `arckit-claude/commands/pages.md` allow-list**

Add the 8 new type codes under the correct section header per the existing convention.

- [ ] **Step 4: Verify the validation hook accepts the new codes**

```bash
# Synthetic filename test — should not error
node arckit-claude/hooks/validate-arc-filename.mjs <<< '{"tool_input":{"file_path":"projects/001-test/ARC-001-AUPIA-v1.0.md"}}'
```

Expected: exit 0 (no block).

- [ ] **Step 5: Commit**

```bash
git add arckit-claude/config/doc-types.mjs arckit-claude/commands/pages.md
git commit -m "feat(arckit-au): register 8 AU doc-type codes + AU regime in core"
```

---

## Task 7: Port the overlay guide

**Files:**
- Create: `docs/guides/au-federal-overlay.md`

- [ ] **Step 1: Copy guide from #441**

```bash
git show au-source:docs/guides/au-federal-overlay.md > docs/guides/au-federal-overlay.md
```

- [ ] **Step 2: Update path references inside the guide**

Any references to `arckit-claude/commands/au-*.md` or `arckit-claude/templates/au-*-template.md` get rewritten to `arckit-au/commands/au-*.md` / `arckit-au/templates/au-*-template.md`.

```bash
sed -i 's|arckit-claude/commands/au-|arckit-au/commands/au-|g; s|arckit-claude/templates/au-|arckit-au/templates/au-|g; s|arckit-claude/skills/arckit-build/recipes/au-|arckit-au/recipes/au-|g' docs/guides/au-federal-overlay.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/guides/au-federal-overlay.md
git commit -m "docs(arckit-au): port au-federal overlay guide"
```

---

## Task 8: Port the validation scorecard

**Files:**
- Create: `docs/au-federal-validation-scorecard.md`

- [ ] **Step 1: Copy from #441**

```bash
git show au-source:docs/au-federal-validation-scorecard.md > docs/au-federal-validation-scorecard.md
```

- [ ] **Step 2: Update path references**

Same `sed` as Task 7.

- [ ] **Step 3: Commit**

```bash
git add docs/au-federal-validation-scorecard.md
git commit -m "docs(arckit-au): port au-federal validation scorecard"
```

---

## Task 9: Update `arckit-build` SKILL.md and regenerate extensions

**Files:**
- Modify: `arckit-claude/skills/arckit-build/SKILL.md` (Built-in recipes table)
- Generated: `arckit-codex/`, `arckit-opencode/`, `arckit-gemini/`, `arckit-copilot/`, `arckit-paperclip/` outputs for the 8 `au-*` commands

- [ ] **Step 1: Add `au-federal` row to the Built-in recipes table**

```markdown
| `au-federal` | `arckit-au` | Australian Federal / DISP-supplier — full ASD/PSPF/DTA/Privacy Act compliance bundle |
```

Insert after the existing `ca-federal-fitaa` row.

- [ ] **Step 2: Run the converter**

```bash
python scripts/converter.py
```

Expected: 8 new command variants generated under each non-Claude format.

- [ ] **Step 3: Verify no incidental drift**

```bash
git status --porcelain | grep -vE "^M arckit-(codex|opencode|gemini|copilot|paperclip)/" | grep -vE "memory/" || echo "CLEAN"
```

Expected: `CLEAN` (only extension outputs changed; no other untouched files affected).

If the converter introduces drift on unrelated files, that's a pre-existing converter bug in v5.0.0 — fix it in a separate PR; don't bundle here.

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/skills/arckit-build/SKILL.md arckit-codex arckit-opencode arckit-gemini arckit-copilot arckit-paperclip
git commit -m "feat(arckit-au): add au-federal to SKILL.md recipes table; regenerate extensions"
```

---

## Task 10: README and CHANGELOG

**Files:**
- Modify: `README.md` (community overlay section)
- Modify: `CHANGELOG.md`
- Create: `arckit-au/CHANGELOG.md`

- [ ] **Step 1: Add Australian Federal section to `README.md`**

Slot between `arckit-at` (Austrian) and any non-overlay section. Mirror the shape used for `arckit-uae` and `arckit-ca`.

- [ ] **Step 2: Add Unreleased entry to top-level `CHANGELOG.md`**

```markdown
### Added

- **`arckit-au`** community plugin (Australian Federal / DISP-supplier overlay) — 8 commands (`au-e8-posture`, `au-pia`, `au-dss`, `au-ism-controls`, `au-ndb-playbook`, `au-pspf`, `au-ai-assurance`, `au-disp-attestation`) and the `au-federal` recipe (35 targets, 9 waves). Domain co-maintainer: @royster70. Supersedes #441.
```

- [ ] **Step 3: Create `arckit-au/CHANGELOG.md`**

Standard shape — version 5.1.0 initial entry.

- [ ] **Step 4: Commit**

```bash
git add README.md CHANGELOG.md arckit-au/CHANGELOG.md
git commit -m "docs(arckit-au): README and CHANGELOG entries"
```

---

## Task 11: Lint and validate

- [ ] **Step 1: Markdown lint**

```bash
npx markdownlint-cli2 "arckit-au/**/*.md" "docs/guides/au-federal-overlay.md" "docs/au-federal-validation-scorecard.md"
```

Expected: 0 errors.

- [ ] **Step 2: Cross-reference linter**

```bash
python scripts/check_references.py
```

Expected: 0 errors. Verifies every `${CLAUDE_PLUGIN_ROOT}/...` path inside `arckit-au/commands/` resolves to an actual file inside `arckit-au/`.

- [ ] **Step 3: Recipe linter**

```bash
python scripts/check_recipes.py
```

Expected: `au-federal` recipe validates; every target's command exists (in `arckit-au/`, `arckit-claude/`, or another community plugin per the three-tier lookup).

- [ ] **Step 4: Doc-type collision check**

```bash
python scripts/check_doctype_collisions.py
```

Expected: 0 collisions. The 8 AU type codes don't clash with existing codes.

---

## Task 12: Flip PR ready, close #441, communicate handoff

- [ ] **Step 1: Mark PR ready for review**

```bash
gh pr ready
```

- [ ] **Step 2: Comment on PR #441 with the handoff**

```bash
gh pr comment 441 --body "$(cat <<'EOF'
Closing this PR with thanks — the content is being superseded by `arckit-au` as the 6th community plugin in the v5.0.0 split.

The substance of your work (8 commands, 8 templates, `au-federal` recipe, doc-type registrations, validation scorecard, overlay guide) is ported verbatim into the new `arckit-au/` plugin directory. Co-maintainer credit (@royster70) carried across. Plan: `docs/superpowers/plans/2026-05-18-arckit-au-plugin.md`. Successor PR: #<NEW>.

The structural change is layout-only: `arckit-claude/commands/au-*.md` → `arckit-au/commands/au-*.md`, etc. No re-validation needed — your 25/25 scorecard evidence is preserved.

Thanks for the careful work on this one.
EOF
)"
```

- [ ] **Step 3: Close #441**

```bash
gh pr close 441
```

- [ ] **Step 4: Wait for review on the new PR, address feedback, squash-merge to main**

Standard flow. Bump to a `5.1.0` tag once merged (per `docs/RELEASING.md`).

- [ ] **Step 5: Notify @royster70**

Once merged, a follow-up comment on the closed #441 with the new PR number and tag, so they know where their contribution landed.

---

## Risks and open questions

| Risk | Mitigation |
|---|---|
| #441 has stale converter outputs that drift further during this re-port | Task 9 step 3 explicitly checks for incidental drift; surface as a separate cleanup PR if present |
| AU regime missing from `REGIMES` array shipped (recurring blocker B5 from #441 author's own validation) | Task 6 step 2 explicitly verifies; review skill's B5 check catches it |
| Sector overlay #440 (`au-energy`) blocked on this PR | Note in #440: re-target the 2 sector commands at `arckit-au/commands/` once this PR merges |
| @royster70 prefers a different layout | Comment on #441 before closing; let them weigh in before opening the new PR |

---

## Done when

- [ ] PR opens green, all linters pass, all CI gates pass
- [ ] PR #441 closed with handoff comment
- [ ] @royster70 acknowledged in `CHANGELOG.md` and `arckit-au/README.md`
- [ ] Squash-merged to main; `5.1.0` tag created and pushed
- [ ] `arckit-au` discoverable in marketplace; install snippet in `arckit-au/README.md` works against a test repo
