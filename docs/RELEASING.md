# Releasing ArcKit

This document covers version management, the release flow, and the helper scripts that automate it. For day-to-day development guidance, see `CLAUDE.md`.

> **Driving a release with Claude Code?** Run `/release X.Y.Z` — the `.claude/skills/release/` skill turns the flow below into a guided, gotcha-aware checklist. It is manual-invocation only (`disable-model-invocation: true`) so a release is never triggered automatically. This document remains the source of truth; the skill defers to it.

## Version Files

ArcKit ships in seven formats, each with its own version file. They are all bumped in lockstep by `scripts/bump-version.sh`.

**CLI version** (independent from the plugin):

1. `VERSION` — source of truth
2. `pyproject.toml` — `version` field

**Plugin version** (independent from the CLI):

1. `arckit-claude/VERSION` — source of truth
2. `arckit-claude/.claude-plugin/plugin.json` — `version` field

**Extension versions** (track the plugin):

- `arckit-gemini/VERSION` + `arckit-gemini/gemini-extension.json`
- `arckit-opencode/VERSION`
- `arckit-codex/VERSION`
- `arckit-copilot/VERSION`

`scripts/bump-version.sh <version>` updates all 15 version-bearing locations (VERSION files, manifests, README badges, docs, plugin.json) in one go.

## Release Helpers

| Script | Purpose |
|--------|---------|
| `scripts/bump-version.sh <version>` | Updates all version files in one pass |
| `scripts/generate-release-notes.sh [prev-tag]` | Parses `git log` between tags into Keep a Changelog markdown (Added / Fixed / Changed / Breaking Changes), filters out `chore: bump version` commits, auto-detects previous tag if omitted |
| `scripts/push-extensions.sh [name...]` | Pushes extension dirs to their separate GitHub repos (`tractorjuice/arckit-gemini`, `tractorjuice/arckit-codex`, etc.). Uses `GH_TOKEN`. Skips repos that don't yet exist on GitHub |
| `.github/workflows/release.yml` | Creates the GitHub Release automatically on `v*` tag push (tag-push triggered, does not commit back to main) |

## Development Workflow

All changes go through a feature branch and are merged to `main` via PR. **Never push directly to `main`.**

```bash
# 1. Create a feature branch
git checkout -b feat/my-feature

# 2. Make changes, commit
git add <files> && git commit -m "feat: description"

# 3. Push branch and create PR
git push -u origin feat/my-feature
gh pr create --title "feat: description" --body "Summary of changes"

# 4. Merge PR (squash or merge commit)
gh pr merge --squash
```

## Local Release Flow

After your PR is merged to `main`:

```bash
# 1. Ensure you're on main with latest changes
git checkout main && git pull

# 2. Edit CHANGELOGs manually

# 3. Preview release notes (optional)
./scripts/generate-release-notes.sh

# 4. Bump all version files
./scripts/bump-version.sh X.Y.Z

# 5. Regenerate Codex/OpenCode/Gemini/Copilot formats
python scripts/converter.py

# 6. Commit the bump (claude plugin tag below requires a clean tree)
git add -A && git commit -m "chore: bump version to X.Y.Z"

# 7. Validate plugin/marketplace version agreement (Claude Code v2.1.118+)
claude plugin tag arckit-claude --dry-run

# 8. (optional) Prune orphaned plugin dependencies
claude plugin prune --dry-run

# 9. Tag, push — GitHub Release created automatically
git tag -a vX.Y.Z -m "vX.Y.Z"
git push && git push --tags

# 10. Push to extension repos (Gemini, Codex, etc.)
./scripts/push-extensions.sh
```

### Note on `claude plugin tag`

This command creates `{plugin-name}--vX.Y.Z` style tags (e.g. `arckit--v4.14.0`), which would not trigger `.github/workflows/release.yml` (it matches `v[0-9]+.[0-9]+.[0-9]+`). We use `--dry-run` for its validation behaviour only — it cross-checks `arckit-claude/.claude-plugin/plugin.json` against the marketplace entry in `.claude-plugin/marketplace.json` and exits non-zero on mismatch, catching version drift before the real `git tag -a vX.Y.Z` runs.

## v5.0.0+ — multi-plugin release flow

After v5.0.0 the marketplace ships 7 plugins (`arckit` core + 6 community overlays: UAE, FR, CA, EU, AT, AU). All 7 share one version, bumped together.

Step 7 changes — validate every plugin manifest:

```bash
for p in arckit-claude arckit-uae arckit-fr arckit-ca arckit-eu arckit-at arckit-au; do
  claude plugin tag "$p" --dry-run || exit 1
done
```

After the umbrella tag (step 9), also create native per-plugin tags:

```bash
./scripts/tag-plugins.sh X.Y.Z
```

This creates `arckit--vX.Y.Z`, `arckit-uae--vX.Y.Z`, ..., `arckit-at--vX.Y.Z` for the Claude Code plugin system's bookkeeping. Idempotent — re-running skips tags that already exist.

## Adding New Package Data Files

Update `pyproject.toml` `[tool.hatch.build.targets.wheel.shared-data]` so the file ships with the CLI wheel.
