---
name: release
description: "Cut a new ArcKit release — bump versions in lockstep, regenerate non-Claude formats, validate plugin/marketplace agreement, tag, and push to extension repos. Use when the user says 'cut a release', 'release ArcKit', 'ship vX.Y.Z', 'bump the version and release', 'do the release flow', 'tag and publish', or 'push the extensions'. This is a manual, high-consequence workflow: it never runs automatically."
disable-model-invocation: true
argument-hint: "[X.Y.Z]"
---

# Release ArcKit

Drive the ArcKit release flow end to end. This skill is the executable companion to
[`docs/RELEASING.md`](../../../docs/RELEASING.md) — that doc is the source of truth; if the two
disagree, trust `RELEASING.md` and update this skill.

The target version is `$ARGUMENTS` (e.g. `/release 5.10.0`). If no version was given, ask
for it before doing anything — never guess a version.

<HARD-GATE>
This workflow tags and publishes to public GitHub repos. Do NOT run any step that pushes,
tags, or publishes without the user confirming the version and that the PR is already merged
to `main`. Show the plan and the computed version first, then proceed step by step.
</HARD-GATE>

## Preconditions

Confirm all of these before touching version files:

1. The feature PR is **merged to `main`** — releases are cut from `main`, never from a branch.
2. Working tree is on `main` and clean: `git checkout main && git pull && git status`.
3. The version `$ARGUMENTS` is valid semver (`X.Y.Z`) and **greater** than the current
   plugin version (`cat arckit-claude/VERSION`) and CLI version (`cat VERSION`).
4. `GH_TOKEN` is set in the environment (needed by `push-extensions.sh`).

If any precondition fails, stop and surface it. Do not work around it.

## Release flow

Run these in order. Each script is idempotent or safe to re-run except the `git tag`/`git push`
steps. Pause after step 5 (the commit) and after step 8 (validation) to let the user confirm.

```bash
# 1. Edit CHANGELOGs by hand — both of them:
#    CHANGELOG.md (CLI) and arckit-claude/CHANGELOG.md (plugin).
#    Preview what shipped since the last tag to seed the entries:
./scripts/generate-release-notes.sh

# 2. Bump every version file in lockstep (15 locations: VERSION files,
#    manifests, README badges, docs, plugin.json):
./scripts/bump-version.sh X.Y.Z

# 3. Regenerate Codex/OpenCode/Gemini/Copilot/Paperclip formats from the
#    plugin source — MUST run after the bump so the extensions carry the
#    new version:
python scripts/converter.py

# 4. Sanity-check the tree (no stray edits, counts/versions consistent):
git status && git diff --stat

# 5. Commit the bump — a clean tree is required for `claude plugin tag`:
git add -A && git commit -m "chore: bump version to X.Y.Z"

# 6. Validate EVERY plugin manifest against the marketplace entry.
#    Discover plugins dynamically — do NOT hardcode the list (it grows):
for manifest in $(find . -maxdepth 3 -path '*/.claude-plugin/plugin.json' -not -path '*/node_modules/*' | sort); do
  p=$(python3 -c "import json;print(json.load(open('$manifest'))['name'])")
  claude plugin tag "$p" --dry-run || { echo "VERSION DRIFT: $p"; exit 1; }
done

# 7. (optional) Prune orphaned plugin deps:
claude plugin prune --dry-run

# 8. Tag the umbrella release and push — this triggers
#    .github/workflows/release.yml, which creates the GitHub Release:
git tag -a vX.Y.Z -m "vX.Y.Z"
git push && git push --tags

# 9. Create native per-plugin tags (arckit--vX.Y.Z, arckit-uae--vX.Y.Z, …).
#    Auto-discovers plugins; idempotent (skips existing tags):
./scripts/tag-plugins.sh X.Y.Z

# 10. Push each extension to its standalone GitHub repo
#     (tractorjuice/arckit-gemini, arckit-codex, …):
./scripts/push-extensions.sh
```

After step 10, confirm the GitHub Release was created (the `release.yml` workflow runs on the
`vX.Y.Z` tag push) and report the release URL and which extension repos were pushed.

## Common Gotchas

The highest-signal failures — collected from real releases. Read these before running anything.

- **Releasing from a feature branch.** Releases are cut from `main` after the PR is merged.
  Tagging a branch ships an unmerged tree. Always `git checkout main && git pull` first.
- **Forgetting the converter (step 3).** `bump-version.sh` updates the plugin source, but the
  Codex/OpenCode/Gemini/Copilot/Paperclip copies are *generated*. Skip `converter.py` and the
  extensions ship the **old** version. The converter must run *after* the bump and *before* the
  commit, so the regenerated files are included.
- **Hardcoding the plugin list.** The marketplace now ships 11 plugins (core + 10 overlays) and
  keeps growing. The `--dry-run` validation loop in older `RELEASING.md` examples lists only 7 —
  that silently skips newer plugins. Discover plugins dynamically (step 6) — this is the exact
  bug that shipped `arckit-uk-nhs` untagged mid-v5.4.0, which is why `tag-plugins.sh` now
  auto-discovers. Never copy a static plugin array.
- **`claude plugin tag` needs a clean tree.** Run it *after* the commit (step 5), not before, or
  it errors on the dirty working tree.
- **`claude plugin tag` is `--dry-run` only here.** It creates `name--vX.Y.Z` style tags that do
  **not** match `release.yml`'s `v[0-9]+.[0-9]+.[0-9]+` trigger. We use it solely for its
  validation side effect (cross-checking `plugin.json` vs `marketplace.json`). The real release
  tag is the `git tag -a vX.Y.Z` in step 8.
- **Two CHANGELOGs, not one.** `CHANGELOG.md` is the CLI changelog; `arckit-claude/CHANGELOG.md`
  is the plugin changelog. Both need an entry. They are human-authored — `generate-release-notes.sh`
  only *previews* what changed, it does not write them.
- **CLI and plugin versions are independent but bumped together.** `bump-version.sh` moves both to
  the same number by design; don't try to skew them.
- **`push-extensions.sh` needs `GH_TOKEN`** and skips repos that don't yet exist on GitHub — a
  "skipped" line is not an error for a brand-new extension, but double-check it's not skipping a
  repo that *should* exist.
- **Order is load-bearing.** bump → convert → commit → validate → tag → tag-plugins → push-extensions.
  Re-running an earlier step after a later one (e.g. editing files after the commit) means the tag
  no longer points at the released tree. If you edit after committing, redo from the commit.

## Reference

- [`docs/RELEASING.md`](../../../docs/RELEASING.md) — full release documentation and rationale
- `scripts/bump-version.sh` — version bump across all files
- `scripts/generate-release-notes.sh` — changelog preview from git log
- `scripts/tag-plugins.sh` — native per-plugin tags (auto-discovers)
- `scripts/push-extensions.sh` — pushes extension dirs to standalone repos
- `.github/workflows/release.yml` — creates the GitHub Release on `v*` tag push
