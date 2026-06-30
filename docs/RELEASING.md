# Releasing ArcKit

This document covers version management, the release flow, and the helper scripts that automate it. For day-to-day development guidance, see `CLAUDE.md`.

> **Driving a release with Claude Code?** Run `/release X.Y.Z` — the `.claude/skills/release/` skill turns the flow below into a guided, gotcha-aware checklist. It is manual-invocation only (`disable-model-invocation: true`) so a release is never triggered automatically. This document remains the source of truth; the skill defers to it.

## Version Files

ArcKit ships in multiple formats, each with its own version file. They are all bumped in lockstep by `scripts/bump-version.sh`.

**CLI version** (independent from the plugin):

1. `VERSION` — source of truth
2. `pyproject.toml` — `version` field

**Plugin version** (independent from the CLI):

1. `plugins/arckit-claude/VERSION` — source of truth
2. `plugins/arckit-claude/.claude-plugin/plugin.json` — `version` field

**Extension versions** (track the plugin):

- `extensions/arckit-gemini/VERSION` + `extensions/arckit-gemini/gemini-extension.json`
- `extensions/arckit-opencode/VERSION`
- `extensions/arckit-codex/VERSION`
- `extensions/arckit-copilot/VERSION`

`scripts/bump-version.sh <version>` updates all version-bearing locations (VERSION files, manifests, README badges, docs, plugin.json, and standalone marketplace metadata) in one go.

## Release Helpers

| Script | Purpose |
|--------|---------|
| `scripts/bump-version.sh <version>` | Updates all version files in one pass |
| `scripts/generate-release-notes.sh [prev-tag]` | Parses `git log` between tags into Keep a Changelog markdown (Added / Fixed / Changed / Breaking Changes), filters out `chore: bump version` commits, auto-detects previous tag if omitted |
| `scripts/push-extensions.sh [name...]` | Pushes standalone distribution dirs to their separate GitHub repos (`tractorjuice/arckit-claude`, `tractorjuice/arckit-gemini`, `tractorjuice/arckit-codex`, etc.), then creates or preserves each repo's `vX.Y.Z` tag and GitHub Release. The `claude` target publishes the full Claude Code marketplace repo: core plugin at the root, with overlays under structured `plugin/...` paths. Uses `GH_TOKEN`. Skips repos that don't yet exist on GitHub. Set `ARCKIT_SKIP_EXTENSION_RELEASES=1` only for a commit-only sync |
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

# 6. Validate generated extension outputs
pytest tests/codex/test_codex_extension.py \
  tests/gemini tests/opencode tests/copilot \
  tests/vibe/test_vibe_extension.py \
  tests/paperclip/test_commands_json.py \
  tests/plugin/test_release_process.py

# 7. Commit the bump (claude plugin tag below requires a clean tree)
git add -A && git commit -m "chore: bump version to X.Y.Z"

# 8. Validate plugin/marketplace version agreement (Claude Code v2.1.118+)
claude plugin tag plugins/arckit-claude --dry-run

# 9. (optional) Prune orphaned plugin dependencies
claude plugin prune --dry-run

# 10. Tag, push — GitHub Release created automatically
git tag -a vX.Y.Z -m "vX.Y.Z"
git push && git push --tags

# 11. Push to standalone repos (Claude, Gemini, Codex, etc.).
#     This also publishes each standalone repo's vX.Y.Z tag and GitHub Release.
./scripts/push-extensions.sh
```

Use `./scripts/push-extensions.sh claude` when you intentionally need to publish only the
standalone Claude Code marketplace repo. That repo keeps the `arckit` core plugin at the
repository root and copies overlay plugins into structured paths such as `plugin/uk/finance`
and `plugin/uk/gcloud`.

After step 11, verify the umbrella GitHub Release and every standalone GitHub Release exists:

- `tractorjuice/arc-kit`
- `tractorjuice/arckit-claude`
- `tractorjuice/arckit-gemini`
- `tractorjuice/arckit-codex`
- `tractorjuice/arckit-opencode`
- `tractorjuice/arckit-copilot`
- `tractorjuice/arckit-paperclip`
- `tractorjuice/arckit-vibe`

### Note on `claude plugin tag`

This command creates `{plugin-name}--vX.Y.Z` style tags (e.g. `arckit--v4.14.0`), which would not trigger `.github/workflows/release.yml` (it matches `v[0-9]+.[0-9]+.[0-9]+`). We use `--dry-run` for its validation behaviour only — it cross-checks `plugins/arckit-claude/.claude-plugin/plugin.json` against the marketplace entry in `.claude-plugin/marketplace.json` and exits non-zero on mismatch, catching version drift before the real `git tag -a vX.Y.Z` runs.

## v6.0.0+ — single Claude marketplace repo

From v6.0.0 the standalone `tractorjuice/arckit-claude` repo is the preferred Claude Code marketplace. It ships 13 plugins in one repo: the `arckit` core plugin at the root plus regional, sector, tooling, and supplier overlays under structured `plugin/...` paths. All Claude plugins share one version, bumped together. The `arckit-uk-gcloud` overlay is public for installation and inspection but remains proprietary, so the standalone repo license carries an explicit exception for `plugin/uk/gcloud/`.

Step 8 changes — validate every plugin manifest:

```bash
for manifest in $(find plugins -maxdepth 3 -path '*/.claude-plugin/plugin.json' | sort); do
  p=$(python3 -c "import json;print(json.load(open('$manifest'))['name'])")
  claude plugin tag "$p" --dry-run || { echo "VERSION DRIFT: $p"; exit 1; }
done
```

After the umbrella tag (step 10), also create native per-plugin tags:

```bash
./scripts/tag-plugins.sh X.Y.Z
```

This creates native Claude Code plugin tags such as `arckit--vX.Y.Z`,
`arckit-uae--vX.Y.Z`, and `arckit-uk-finance--vX.Y.Z` for every discovered
Claude plugin manifest. Idempotent — re-running skips tags that already exist.

Extension README files do not carry release numbers. Keep release identity in `VERSION` files,
manifests, tags, and GitHub Releases so README content cannot drift from marketplace-visible
artifacts.

## Adding New Package Data Files

Update `pyproject.toml` `[tool.hatch.build.targets.wheel.shared-data]` so the file ships with the CLI wheel.
