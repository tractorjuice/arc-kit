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
| `scripts/sync-claude-plugin-layout.py [--check]` | Mirrors the Claude overlay plugins into `plugins/arckit-claude/plugins/...`, matching the standalone `tractorjuice/arckit-claude` repository layout used by the local standalone marketplace metadata |
| `scripts/generate-release-notes.sh [prev-tag]` | Parses `git log` between tags into Keep a Changelog markdown (Added / Fixed / Changed / Breaking Changes), filters out `chore: bump version` commits, auto-detects previous tag if omitted |
| `scripts/push-extensions.sh [name...]` | Pushes standalone distribution dirs to their separate GitHub repos (`tractorjuice/arckit-claude`, `tractorjuice/arckit-gemini`, `tractorjuice/arckit-codex`, etc.), then creates or preserves each repo's `vX.Y.Z` tag and GitHub Release. The `claude` target publishes the full Claude Code marketplace repo: core plugin at the root, with overlays under structured `plugins/...` paths. Uses `GH_TOKEN`. Skips repos that don't yet exist on GitHub. Set `ARCKIT_SKIP_EXTENSION_RELEASES=1` only for a commit-only sync |
| `.github/workflows/release.yml` | Creates the GitHub Release automatically on `v*` tag push (tag-push triggered, does not commit back to main) |

## Releasing from macOS

Releases were cut on GNU/Linux until v6.13.0, and the helper scripts grew Linux assumptions. What to know on a Mac:

- **`bump-version.sh` runs on a stock Mac** (BSD sed, bash 3.2) as of the fix that followed v6.13.0. It avoids `sed -i` entirely — BSD sed parses `sed -i -E` as `-i` with backup suffix `-E`, so the old in-place edits silently no-op'd on macOS and left `*-E` backup files; the v6.13.0 release shipped its `pyproject.toml`, README and `docs/README.md` bumps by hand because of this. The script now also asserts each substitution landed: an `Error: <file> does not contain "…" after edit` failure means the target file drifted from the pattern (the fate of the old `docs/index.html` sed, which matched nothing after the page's visible version line was removed) — fix the pattern or the file; it is not a sed-flavour problem.
- **`tag-plugins.sh` and `push-extensions.sh` need bash ≥ 4** (`mapfile`, `declare -A`); macOS ships bash 3.2. `brew install bash`, then invoke explicitly — `/opt/homebrew/bin/bash scripts/push-extensions.sh` — because Homebrew's bash can be shadowed by `/bin/bash` on `PATH`.
- **`converter.py` and the step-7 test suite need Python ≥ 3.11** (`tomllib`) plus PyYAML / pytest / jsonschema. No project venv is required with uv:

  ```bash
  uv run --no-project --python 3.12 --with pyyaml python scripts/converter.py
  uv run --no-project --python 3.12 --with pytest --with pyyaml --with jsonschema \
    python -m pytest tests/codex/test_codex_extension.py \
    tests/gemini tests/opencode tests/copilot \
    tests/vibe/test_vibe_extension.py \
    tests/paperclip/test_commands_json.py \
    tests/plugin/test_release_process.py
  ```

- **If `git push` fails with `protocol error: bad line length` / `unexpected disconnect while reading sideband packet`**, raise the HTTP post buffer: `git config http.postBuffer 157286400`. `push-extensions.sh` pushes from temporary clones that do not see repo-local config — inject it via the environment instead: `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=http.postBuffer GIT_CONFIG_VALUE_0=157286400 ./scripts/push-extensions.sh`.
- **`GH_TOKEN` for step 12** can come from an authenticated gh CLI: `GH_TOKEN=$(gh auth token) ./scripts/push-extensions.sh`.

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

# 6. Refresh the local Claude standalone marketplace layout
python scripts/sync-claude-plugin-layout.py

# 7. Validate generated extension outputs
pytest tests/codex/test_codex_extension.py \
  tests/gemini tests/opencode tests/copilot \
  tests/vibe/test_vibe_extension.py \
  tests/paperclip/test_commands_json.py \
  tests/plugin/test_release_process.py

# 8. Commit the bump (claude plugin tag below requires a clean tree)
git add -A && git commit -m "chore: bump version to X.Y.Z"

# 9. Validate the manifests and the plugin components. `--strict` fails on
#    unrecognised fields; the components form checks every SKILL.md, agent and
#    command frontmatter (v2.1.233+ reports a SKILL.md whose frontmatter fails
#    to parse — the failure mode that otherwise surfaces as a silently missing skill).
claude plugin validate --strict .claude-plugin/marketplace.json
claude plugin validate --strict plugins/arckit-claude/.claude-plugin/plugin.json
claude plugin validate plugins/arckit-claude/skills
claude plugin validate plugins/arckit-claude/agents
claude plugin validate plugins/arckit-claude/commands

# 10. Validate plugin/marketplace version agreement (Claude Code v2.1.118+)
claude plugin tag plugins/arckit-claude --dry-run

# 11. (optional) Prune orphaned plugin dependencies
claude plugin prune --dry-run

# 12. Tag, push — GitHub Release created automatically.
#     Push the one tag by name. `git push --tags` pushes EVERY local tag,
#     which published a stray `pre-rebase-*` backup tag during v6.8.0.
git tag -a vX.Y.Z -m "vX.Y.Z"
git push && git push origin vX.Y.Z

# 13. Push to standalone repos (Claude, Gemini, Codex, etc.).
#     This also publishes each standalone repo's vX.Y.Z tag and GitHub Release.
./scripts/push-extensions.sh
```

Use `./scripts/push-extensions.sh claude` when you intentionally need to publish only the
standalone Claude Code marketplace repo. That repo keeps the `arckit` core plugin at the
repository root and copies overlay plugins into structured paths such as `plugins/uk/finance`
and `plugins/uk/gcloud`.

After step 12, verify the umbrella GitHub Release and every standalone GitHub Release exists:

- `tractorjuice/arc-kit`
- `tractorjuice/arckit-claude`
- `tractorjuice/arckit-gemini`
- `tractorjuice/arckit-codex`
- `tractorjuice/arckit-opencode`
- `tractorjuice/arckit-copilot`
- `tractorjuice/arckit-paperclip`
- `tractorjuice/arckit-vibe`
- `tractorjuice/arckit-kimi`

### Release article

Every release with major features gets a write-up in `docs/articles/`
(`YYYY-MM-DD-<slug>.md`), in the voice of the existing pieces, with a hero
generator script in the house style (1200×630, see the `generate-hero-*.py`
siblings). The directory is gitignored as a drafts folder — force-add the
keepers with `git add -f`, as every published article has been.

**List it.** Add a card to `docs/articles.html` and a teaser to the "Latest
writing" strip on `docs/index.html` (keep eight; drop the oldest). Both are
hand-maintained HTML; `scripts/check-article-listing.py` (run by
`tests/plugin/test_article_listing.py` in CI) fails when a tracked article has
no card or the newest is not on the home page — four articles shipped unlisted
in September 2026 before it existed.

**No Markdown tables in articles.** LinkedIn and Medium do not render them —
a comparison lands as a wall of pipes. Write it as prose instead.

**Write for the person who uses ArcKit, not the person who maintains it.**
Lead every section with what changed for them and why it matters, then
explain how. No file names, hook names, schema or regex talk in the body —
say what a mechanism does for the reader ("a poisoned page can no longer
reach the part that writes your document"), not what it is called. Name a
technique by its effect. The hero image labels follow the same rule. The
maintainer-level detail belongs in the CHANGELOG and the PR body, which the
article can link to.

End with the `<!-- arckit:community-block -->` section, and credit
contributors by @handle in the article *and* in the CHANGELOG entry — the
handle appearing in a CHANGELOG is what makes `check-contributor-credits.py`
enforce their card on the contributors page.

### PyPI (`arckit-cli`)

Step 11's tag push also publishes the CLI to PyPI, via the `pypi` job in
`.github/workflows/release.yml`. There is no manual upload step, and nothing to do
in the local flow above.

This used to be manual, which is why it stopped happening: PyPI sat at **6.4.1**
while the repo was on 6.7.5, so `pip install arckit-cli` served a three-release-old
CLI to anyone not using the git URL (#730).

Publishing uses [PyPI Trusted Publishing](https://docs.pypi.org/trusted-publishers/),
so there is no API credential stored in the repository. It needs a **one-time**
configuration on PyPI, under the project's *Publishing* tab → *GitHub Actions*:

| Field | Value |
|---|---|
| Owner | `tractorjuice` |
| Repository | `arc-kit` |
| Workflow name | `release.yml` |
| Environment name | `pypi` |

These must match the workflow exactly or the OIDC exchange is rejected. The
`pypi` environment also has to exist under *Settings → Environments*; add a
required reviewer there if you want releases to pause for approval before upload.

Two guards worth knowing about:

- The job **fails if the tag disagrees with the built version**, because PyPI never
  lets a version number be reused — a wrong upload cannot be undone, only yanked.
- The build runs through `hatch_build.py`, so a wheel whose extension trees are
  empty cannot be published (#730). See "Adding New Package Data Files" below.

To publish a version whose tag already exists (as 6.7.5 did when this was added),
either delete and re-push the tag, or upload once by hand with
`python -m build && python -m twine upload dist/*`.

**Follow-up once the first automated publish lands.** Every install instruction in
the repo currently uses the git URL, because PyPI was three releases stale and
`pip install arckit-cli` would have served 6.4.1. Once PyPI is current, these can
move to `pip install arckit-cli`: `README.md` (installation, upgrade, and the
Copilot and Codex sections), `docs/getting-started.html`, `docs/index.html` (the
FAQ answer, which is JSON-LD and feeds search engines' rich results),
`docs/guides/upgrading.md` — then `scripts/check-guide-parity.py --sync` — and each
`extensions/*/README.md`. Note the PyPI package is **`arckit-cli`**; `arckit` is an
unrelated third-party ARC-AGI package, and the FAQ answer pointed at it until #731.

### Note on `claude plugin tag`

This command creates `{plugin-name}--vX.Y.Z` style tags (e.g. `arckit--v4.14.0`), which would not trigger `.github/workflows/release.yml` (it matches `v[0-9]+.[0-9]+.[0-9]+`). We use `--dry-run` for its validation behaviour only — it cross-checks `plugins/arckit-claude/.claude-plugin/plugin.json` against the marketplace entry in `.claude-plugin/marketplace.json` and exits non-zero on mismatch, catching version drift before the real `git tag -a vX.Y.Z` runs.

## v6.0.0+ — single Claude marketplace repo

From v6.0.0 the standalone `tractorjuice/arckit-claude` repo is the preferred Claude Code marketplace. It ships 16 plugins in one repo: the `arckit` core plugin at the root plus regional, sector, method, agent-architecture, tooling, and supplier overlays under structured `plugins/...` paths. All Claude plugins share one version, bumped together. The `arckit-uk-gcloud` overlay is public for installation and inspection but remains proprietary, so the standalone repo license carries an explicit exception for `plugins/uk/gcloud/`.

The root `.claude-plugin/marketplace.json` in `tractorjuice/arc-kit` remains a compatibility marketplace for existing users who already added the old repo. Keep its `name` as `arc-kit` and its sources pointed at monorepo paths such as `./plugins/arckit-claude` and `./plugins/arckit-uae`. The standalone marketplace metadata lives at `plugins/arckit-claude/.claude-plugin/marketplace.json` and uses `.` plus `./plugins/...` sources for `tractorjuice/arckit-claude`.

Step 8 changes — validate every plugin manifest:

```bash
mapfile -t manifests < <(find plugins -maxdepth 3 -path '*/.claude-plugin/plugin.json' | sort)

# An empty glob would make the loop below exit 0 having validated nothing.
(( ${#manifests[@]} > 0 )) || { echo "No plugin manifests found — check the find path"; exit 1; }
echo "Validating ${#manifests[@]} plugin manifests..."

for manifest in "${manifests[@]}"; do
  dir=${manifest%/.claude-plugin/plugin.json}          # a PATH, not the plugin name
  claude plugin tag "$dir" --dry-run || { echo "VERSION DRIFT: $dir"; exit 1; }
done
```

> **`claude plugin tag` takes a path, not a plugin name.** Passing the `name` field
> from `plugin.json` (`arckit`) resolves it relative to the repo root and fails with
> `✘ Path not found: /…/arckit`. Post-relayout the path is the plugin directory —
> `plugins/arckit-claude`, not `arckit` and not a bare `arckit-claude`.
>
> **Keep the `-maxdepth 3` and the `plugins` prefix.** Together they select exactly
> the 16 real plugin directories. Searching from `.` instead pushes the manifests to
> depth 4 and matches nothing; raising the depth pulls in the nested publish mirrors
> under `plugins/arckit-claude/plugins/…`, which are not separately taggable.
>
> **Run this before `tag-plugins.sh`, not after.** Once the native `name--vX.Y.Z`
> tags exist the dry-run fails with `Tag "…" already exists locally`, which is not
> version drift.

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
