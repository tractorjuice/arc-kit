---
name: pr-review-community-overlay
description: Use when reviewing a PR to tractorjuice/arc-kit that adds or extends a community jurisdictional overlay (e.g. au-*, ca-*, uae-*, fr-*, at-*, eu-*, future state-level like au-vic-*) — produces a structured review with blockers, important issues, minor issues, and positive callouts.
---

# PR Review — Community Overlay (ArcKit)

Reviews ArcKit community-overlay PRs (`xx-*` jurisdictional command bundles) against the integration checklist that catches the recurring failure classes. Encodes the checklist used on PR #441 (au-federal) which surfaced 4 blockers and 6 important issues that the author had missed.

## When to Use

- PR adds new community overlay (e.g. `au-federal`, `ca-federal-fitaa`, future `au-vic-*`)
- PR extends an existing overlay (new `xx-*` command, new recipe target)
- PR ships a new build recipe alongside `xx-*` commands
- Author is contributor (not maintainer) and PR is large (10+ files, 5K+ lines)

Skip for: official-baseline command changes, plugin infrastructure, hooks, agents — these have their own review surfaces.

## Output shape (always)

```markdown
## Code Review

**Verdict:** [one-line conclusion]

### BLOCKERS (must fix before merge)
[numbered, file:line, fix instruction, comparison to working precedent]

### IMPORTANT (should fix)
### MINOR (nits)
### POSITIVE (worth calling out)
### Recommended pre-merge sequence
[ordered fix steps]
```

End with: `gh pr comment <N> --body "$(cat <<'EOF'...EOF)"` to post.

## The 5 recurring blocker classes

These are the failure modes that recur across overlay PRs. Check each, in order:

### B1 — Templates lack `## Document Control` heading

**Symptom:** Templates have `<!-- DOC-CONTROL-HEADER -->` directly under the `> **Template Origin**…` blockquote with no `## Document Control` heading above.

**Why it matters:** The partial (`document-control-uk.md` / `document-control-uae.md`) is just the table — it has no heading. After inlining, artefact has a Document Control table with no section heading.

**Verification:**

```bash
for f in arckit-claude/templates/<prefix>-*-template.md; do
  head -10 "$f" | grep -q "^## Document Control" || echo "MISSING heading: $f"
done
```

**Working precedent:** `arckit-claude/templates/ca-pia-template.md:5-7` and `uae-pdpl-template.md:5-7` both have `## Document Control\n\n<!-- DOC-CONTROL-HEADER -->\n<!-- Resolved at command-execution time per _partials/RENDERING.md. -->`.

### B2 — Commands don't override the UK classification line

**Symptom:** Overlay introduces a non-UK classification scheme (Canadian Protected/A/B/C, AU UNOFFICIAL/PROTECTED, etc.) but commands say only `Resolve the <!-- DOC-CONTROL-HEADER --> marker per RENDERING.md.` — no instruction to substitute the classification line.

**Why it matters:** `arckit-claude/templates/_partials/RENDERING.md` only routes `governance_framework: UAE Federal` or `classification_scheme: UAE Smart Data` to a non-UK partial. Everything else falls back to `document-control-uk.md` which renders `[PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET]`. Without an explicit override, the body content (which references the AU/CA/etc. ladder) becomes inconsistent with the header.

**Verification:**

```bash
grep -L "classification scheme\|UK line in the header" arckit-claude/commands/<prefix>-*.md
# Files printed = files MISSING the override
```

**Working precedent:** `arckit-claude/commands/ca-pia.md:32`:
> Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.

**Proper long-term fix (separate PR):** ship a `document-control-<regime>.md` partial, extend RENDERING.md routing, extend `plugin.json` userConfig to accept the regime governance framework value.

### B3 — `generate-document-id.sh` mis-invocation

**Symptom:** Commands write `scripts/bash/generate-document-id.sh <TYPECODE> --filename` (single positional arg).

**Why it matters:** Script signature is `PROJECT_ID DOC_TYPE [VERSION] [OPTIONS]`. With one positional arg, TYPECODE is read as PROJECT_ID and DOC_TYPE is empty.

**Verification:**

```bash
grep -n "generate-document-id.sh" arckit-claude/commands/<prefix>-*.md | grep -v "<PROJECT_ID>\|{P}"
```

**Working precedent:** `arckit-claude/commands/ca-pia.md:32`:
> `scripts/bash/generate-document-id.sh <PROJECT_ID> PIA --filename`

**Note:** `uae-*` commands share this bug. Worth fixing in the same sweep.

### B4 — Converter outputs are stale

**Symptom:** Re-running `python scripts/converter.py` on the PR branch produces drift on files that were not the focus of the PR (commonly `arckit-pages` variants).

**Why it matters:** Author may have run the converter at branch creation and not re-run after rebasing main. Result: variants regress to an older version of canonical commands.

**Verification:**

```bash
git checkout pr-<N>
python scripts/converter.py
git status --porcelain | grep -v "memory/"
# Should be empty. Anything printed = stale converter output in the PR.
```

**Cross-check:** Run the same on `main` first to confirm `main` itself is clean (otherwise the drift isn't the PR's fault).

**Fix:** ask author to rebase on main, re-run converter, and amend.

### B5 — Regime not registered in `REGIMES` / `REGIME_LABELS`

**Symptom:** New `regime: '<XX>'` declared on each new doc-type entry in `arckit-claude/config/doc-types.mjs`, but the `<XX>` code is missing from the exported `REGIMES` array and/or `REGIME_LABELS` object.

**Why it matters:** Per-record `regime:` controls which bucket each artefact falls into, but consumers iterating `REGIMES` (dashboards, group headers, navigator UI) silently skip the unregistered jurisdiction. The `HIGH_SEVERITY_BY_REGIME` derivation has a fallback so the local file still works — but downstream consumers don't. Symptom is invisible in unit tests.

**Verification:**

```bash
# Confirm the new regime code appears in BOTH the array and the labels object.
# Anchor on the export blocks (avoids matching every doc-type entry as noise).
grep -nA 1 "^export const REGIMES" arckit-claude/config/doc-types.mjs
grep -nA 12 "^export const REGIME_LABELS" arckit-claude/config/doc-types.mjs
# Then cross-check against the regime values declared on new doc-types
grep -oE "regime: '[A-Z]+'" arckit-claude/config/doc-types.mjs | sort -u
```

**Working precedent:** PR #441 (au-federal) added both `'AU'` and `'CA'` (the latter a corrective for an earlier omission), e.g. `arckit-claude/config/doc-types.mjs:165-179`. Note the `REGIME_LABELS` ordering convention is officially-maintained-first then community alphabetical.

**Discovered in:** Test review of merged PR #432 (ca-federal-fitaa) where 12 doc-types declared `regime: 'CA'` but the `REGIMES` array shipped without `'CA'`. Bug shipped and was only fixed retroactively in #441.

## Integration checklist

Beyond the 4 blockers, verify:

| Check | Where | What to verify |
|---|---|---|
| Doc-types registered | `arckit-claude/config/doc-types.mjs` | All new type codes present, correct `category` (Compliance/Governance/Procurement), correct `regime`. Regime registered in `REGIMES` + `REGIME_LABELS` (B5). Severity-HIGH check: `grep "severity: 'HIGH'" arckit-claude/config/doc-types.mjs \| grep "regime: '<XX>'"` — assessment-class types (PIA-equivalent, AI-assurance, FITAA-equivalent, ITSG-equivalent) should be HIGH. |
| Pages allow-list | `arckit-claude/commands/pages.md` (Document Types table) | Every new type code listed under correct section header, mirrors `doc-types.mjs`. |
| Templates dual-located | `arckit-claude/templates/` AND `.arckit/templates/` | `diff -rq arckit-claude/templates/ .arckit/templates/` shows zero diffs for new templates. |
| Recipe schema | `arckit-claude/skills/arckit-build/recipes/<recipe>.yaml` | Run author's verbatim Python snippet (deps resolution check). Manually verify wave shape, flagship target's deps. |
| SKILL.md recipes table | `arckit-claude/skills/arckit-build/SKILL.md` | New recipe row added. |
| README overlay section | `README.md` | New `[COMMUNITY]` section with command table, type codes, recipe link, "help wanted" call. |
| CHANGELOG entry | `CHANGELOG.md` | Unreleased entry. **Verify command count math:** `ls arckit-claude/commands/*.md \| wc -l` should match the post-PR total. |
| Overlay guide | `docs/guides/<recipe>-overlay.md` | Exists. Check that the `governance_framework` / `classification_scheme` userConfig values it tells users to set are actually wired through RENDERING.md (per B2). |
| Citation traceability | `arckit-claude/references/citation-instructions.md` referenced from each command | Inline `[DOC_ID-CN]` markers required when reading external docs/MCP/web. Often missing — flag as IMPORTANT, not BLOCKER (precedent across all overlays). |

## Per-command checklist

For each new `xx-*` command file:

- [ ] **Frontmatter:** `description` present. No invalid fields (`name:`, `color:`, `permissionMode:`, `tools:` are NOT valid plugin command frontmatter — `name:` in particular is a common contributor mistake; filename is source of truth).
- [ ] **`$ARGUMENTS` placeholder** present in body — `tests/plugin/test_commands_structure.py::test_arguments_placeholder_present` checks this. Existing `ca-*`/`uae-*` commands fail this test (32 known failures); new overlay commands should pass.
- [ ] **`create-project.sh` lookup** — only required for project-bootstrapping commands (`principles`, `requirements`, the first command someone runs). Most overlay commands assume the project already exists and skip this; that matches the FR/AT/EU/CA precedent. Not a defect when absent.
- [ ] **`generate-document-id.sh`** invoked correctly (B3).
- [ ] **`<!-- DOC-CONTROL-HEADER -->` resolution** instruction (B2 — should override classification when not UK/UAE).
- [ ] **Write tool** used to save artefact (32K output token limit otherwise).
- [ ] **Handoffs:** every `handoffs.command` value resolves to a real file in `arckit-claude/commands/`. Common bug: pluralisation (`risks` vs `risk`); deps on commands shipping in sibling PRs. Validation needs YAML parsing (handoffs are nested under YAML frontmatter — raw grep misses), e.g.:

  ```python
  import yaml, glob, pathlib
  cmds = {pathlib.Path(p).stem for p in glob.glob('arckit-claude/commands/*.md')}
  for f in glob.glob('arckit-claude/commands/<prefix>-*.md'):
      fm = yaml.safe_load(open(f).read().split('---')[1])
      for h in (fm or {}).get('handoffs', []):
          if h['command'] not in cmds: print(f, '→', h['command'])
  ```

- [ ] **Template path** references `${CLAUDE_PLUGIN_ROOT}/templates/<name>-template.md` with `templates-custom` then `.arckit/templates/` fallback.
- [ ] **Per-template footer:** `**Generated by**`, `**Generated on**`, `**ArcKit Version**`, `**Project**`, `**Model**` all present.

## UK leakage check

For non-UK overlays, grep for unintended UK terminology:

```bash
grep -rE '\b(NCSC|ICO|Cyber Essentials|GovS|UK GDPR|GDS|Cabinet Office|DPA 2018|DPIA)\b' arckit-claude/commands/<prefix>-*.md arckit-claude/templates/<prefix>-*.md
```

A small number of intentional comparison references is fine (PR #441 had 2 in `au-dss.md` + `au-pia.md`) — author should call them out in the PR body. Anything else is leakage.

## Tests + CI

- [ ] Run `pytest tests/plugin/` and check for new failures specific to this PR's files.
- [ ] If PR adds `.github/workflows/*` (first-time CI), run the full suite locally and report pre-existing failure count to the author.
- [ ] If PR adds a recipe-validation test, verify it codifies the headline scorecard claims (target count, deps, doc-types registration, regime registration, pages allow-list).

## Verification commands (one-shot)

```bash
# Setup
git fetch origin pull/<N>/head:pr-<N>
git checkout pr-<N>

# B1: missing Document Control heading
for f in arckit-claude/templates/*-template.md; do
  head -10 "$f" | grep -q "^## Document Control" || echo "B1 missing: $f"
done | grep -E "<prefix>-"

# B2: missing classification override
grep -L "classification scheme\|UK line in the header" arckit-claude/commands/<prefix>-*.md

# B3: generate-document-id.sh mis-invocation
grep -n "generate-document-id.sh [A-Z]\+ --filename" arckit-claude/commands/<prefix>-*.md

# B4: converter drift
python scripts/converter.py && git status --porcelain | grep -v "memory/"

# B5: regime registration (anchored on export blocks to avoid doc-type noise)
grep -nA 1 "^export const REGIMES" arckit-claude/config/doc-types.mjs
grep -nA 12 "^export const REGIME_LABELS" arckit-claude/config/doc-types.mjs
grep -oE "regime: '[A-Z]+'" arckit-claude/config/doc-types.mjs | sort -u

# Recipe schema
python3 -c "
import yaml
r = yaml.safe_load(open('arckit-claude/skills/arckit-build/recipes/<recipe>.yaml'))
ids = {t['id'] for t in r['targets']}
for t in r['targets']:
  for d in t.get('deps', []):
    d_clean = d.rstrip('*')
    if d_clean not in {i.rstrip('-') for i in ids} and not any(i.startswith(d_clean) for i in ids):
      print(f'BROKEN: {t[\"id\"]} -> {d}')
"

# Dual-template parity
diff -rq arckit-claude/templates/ .arckit/templates/ | grep -E "<prefix>-"

# Tests
pytest tests/plugin/ --tb=line -q 2>&1 | tail -10

# Command count check vs CHANGELOG
ls arckit-claude/commands/*.md | wc -l
```

## Posting the review

Use the heredoc form so the markdown renders correctly:

```bash
gh pr comment <N> --body "$(cat <<'EOF'
## Code Review

**Verdict:** ...
EOF
)"
```

Verify with the URL the command returns.

## Reference test cases

- **PR #441 (au-federal, 2026-05-05)** — canonical fixture for B1–B4. Exhibited all four (template heading, classification override, doc-id invocation, converter drift) plus 6 important issues. Posted review: https://github.com/tractorjuice/arc-kit/pull/441#issuecomment-4386152326
- **PR #432 (ca-federal-fitaa, merged 2026-05-05)** — fixture for B5 (regime registration). Shipped 12 doc-types with `regime: 'CA'` while `'CA'` was missing from the `REGIMES` array. Bug only surfaced retroactively in #441. Validates the skill against an already-merged overlay where B1–B4 all PASS but a different blocker class exists.

## Common mistakes by reviewers (self-checks)

| Mistake | Fix |
|---|---|
| Trusting the PR body's "regenerated converter outputs" claim | Always re-run `python scripts/converter.py` and check `git status` |
| Trusting headline test count claims | Run `pytest tests/` and verify the numbers |
| Reviewing only the canonical files, not converter outputs | Diff `main..pr-<N>` for `arckit-codex/`, `arckit-opencode/`, `arckit-gemini/`, `arckit-copilot/`, `arckit-paperclip/` |
| Missing the dual-template requirement | `diff -rq arckit-claude/templates/ .arckit/templates/` |
| Missing classification rendering issue (B2) | Read `arckit-claude/templates/_partials/RENDERING.md` to confirm only UAE has non-UK routing |
| Verifying CHANGELOG count from prose, not file count | `ls arckit-claude/commands/*.md \| wc -l` |
