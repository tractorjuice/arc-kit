---
name: release
description: "Cut a new ArcKit release — bump versions in lockstep, regenerate non-Claude formats, validate plugin/marketplace agreement, tag, and push to standalone repos. Use when the user says 'cut a release', 'release ArcKit', 'ship vX.Y.Z', 'bump the version and release', 'do the release flow', 'tag and publish', or 'push the extensions'. This is a manual, high-consequence workflow: it never runs automatically."
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
   plugin version (`cat plugins/arckit-claude/VERSION`) and CLI version (`cat VERSION`).
4. `GH_TOKEN` is set, or `gh auth token` prints one (needed by `push-extensions.sh`).

If any precondition fails, stop and surface it. Do not work around it.

## Release flow

Run these in order. Each script is idempotent or safe to re-run except the `git tag`/`git push`
steps. Pause after step 8 (the commit) and after step 11 before tagging to let the user confirm.

```bash
# 1. Edit CHANGELOGs by hand — both of them:
#    CHANGELOG.md (everything) and plugins/arckit-claude/CHANGELOG.md (only
#    what core plugin users notice). Check every PR merged since the last tag
#    has an entry: many merge without one. Preview what shipped to seed them:
./scripts/generate-release-notes.sh
gh pr list --state merged --limit 200 --search "merged:>=YYYY-MM-DD"

# 2. Bump every version file in lockstep (VERSION files, all 18 plugin
#    manifests and their =X.Y.Z pins, both marketplaces, the extension
#    versions, README badges, docs):
PREV=$(git describe --tags --abbrev=0 --match 'v[0-9]*' | sed 's/^v//')
./scripts/bump-version.sh X.Y.Z

# 3. Update the core pins written as prose, which the script skips
#    (README.md and plugins/arckit-oaa/README.md):
git grep -nF "=$PREV" -- '*.md' ':!**/CHANGELOG.md' ':!docs/changelog/**' ':!plugins/arckit-claude/plugins/**'

# 4. Regenerate the Codex/OpenCode/Gemini/Copilot/Paperclip/Vibe/Kimi
#    formats from the plugin source — MUST run after the bump so the
#    extensions carry the new version:
python scripts/converter.py

# 5. Refresh the nested Claude marketplace layout (copies step 3's O-AA
#    README change into plugins/arckit-claude/plugins/oaa/):
python scripts/sync-claude-plugin-layout.py

# 6. Validate generated extension outputs before committing:
pytest tests/codex/test_codex_extension.py \
  tests/gemini tests/opencode tests/copilot \
  tests/vibe/test_vibe_extension.py \
  tests/paperclip/test_commands_json.py \
  tests/plugin/test_release_process.py

# 7. Sanity-check the tree (no stray edits, counts/versions consistent):
git status && git diff --stat

# 8. Commit the bump — a clean tree is required for `claude plugin tag`:
git add -A && git commit -m "chore: bump version to X.Y.Z"

# 9. Validate the manifests and components (`--strict` fails on
#    unrecognised fields; the component checks catch a SKILL.md, agent or
#    command whose frontmatter fails to parse):
claude plugin validate --strict .claude-plugin/marketplace.json
claude plugin validate --strict plugins/arckit-claude/.claude-plugin/plugin.json
claude plugin validate plugins/arckit-claude/skills
claude plugin validate plugins/arckit-claude/agents
claude plugin validate plugins/arckit-claude/commands

# 10. Validate EVERY plugin manifest against the marketplace entry.
#    Discover plugins dynamically — do NOT hardcode the list (it grows).
#    Search from `plugins`, not `.`: from the repo root the manifests sit at
#    depth 4, so `find . -maxdepth 3` matches nothing and the loop below
#    "passes" having validated not one plugin.
mapfile -t manifests < <(find plugins -maxdepth 3 -path '*/.claude-plugin/plugin.json' | sort)

(( ${#manifests[@]} > 0 )) || { echo "No plugin manifests found — check the find path"; exit 1; }
echo "Validating ${#manifests[@]} plugin manifests..."

for manifest in "${manifests[@]}"; do
  dir=${manifest%/.claude-plugin/plugin.json}   # PATH — `claude plugin tag` rejects the name
  claude plugin tag "$dir" --dry-run || { echo "VERSION DRIFT: $dir"; exit 1; }
done

# 11. (optional) Prune orphaned plugin deps:
claude plugin prune --dry-run

# 12. Tag the umbrella release and push — this triggers
#    .github/workflows/release.yml, which creates the GitHub Release.
#    Push the tag BY NAME: `git push --tags` pushes every local tag, and
#    published a stray `pre-rebase-*` backup tag during v6.8.0.
git tag -a vX.Y.Z -m "vX.Y.Z"
git push && git push origin vX.Y.Z

# 13. Create native per-plugin tags (arckit--vX.Y.Z, arckit-uae--vX.Y.Z, …).
#    Auto-discovers plugins; idempotent (skips existing tags):
./scripts/tag-plugins.sh X.Y.Z

# 14. Push each distribution to its standalone GitHub repo
#     (tractorjuice/arckit-claude, arckit-gemini, arckit-codex, …).
#     The claude target publishes the full Claude marketplace repo: core at
#     plugins/arckit, overlays under plugins/... paths, only the marketplace,
#     README and LICENSE at the root. This also creates or preserves each
#     repo's vX.Y.Z tag and GitHub Release. It pushes from temporary clones
#     that need the git identity and post buffer passed in — see the
#     "Releasing from a Mac" gotcha:
GH_TOKEN=$(gh auth token) ./scripts/push-extensions.sh
```

After step 14, confirm the GitHub Release was created (the `release.yml` workflow runs on the
`vX.Y.Z` tag push). Also confirm every standalone repo has a `vX.Y.Z` tag and GitHub
Release, then report the release URLs and which standalone repos were pushed. The Claude plugin
directory should pick up the new `arckit-claude` version within minutes through its push webhook,
or through its scheduled check about every six hours; see RELEASING.md.

Then write the release article for the major features — `docs/articles/YYYY-MM-DD-<slug>.md`
plus a hero generator script, force-added past the drafts-folder gitignore. **No Markdown
tables** — LinkedIn and Medium do not render them; write comparisons as prose. See
"Release article" in RELEASING.md for the full conventions (voice, hero style, community
block, contributor credits).

## Common Gotchas

The highest-signal failures — collected from real releases. Read these before running anything.

- **Releasing from a feature branch.** Releases are cut from `main` after the PR is merged.
  Tagging a branch ships an unmerged tree. Always `git checkout main && git pull` first.
- **Forgetting the converter (step 4).** `bump-version.sh` updates the plugin source, but the
  Codex/OpenCode/Gemini/Copilot/Paperclip/Vibe/Kimi copies are *generated*. Skip `converter.py` and the
  extensions ship the **old** version. The converter must run *after* the bump and *before* the
  commit, so the regenerated files are included.
- **Skipping extension tests.** Run the step 6 extension suite after `converter.py`. It validates
  Codex, Gemini, OpenCode, Copilot, Vibe, Paperclip, release inventory, version alignment, and
  platform-specific command rewrites before anything is tagged.
- **Releasing from a Mac.** `bump-version.sh` runs on stock macOS (BSD sed, bash 3.2) and asserts
  every substitution lands — a `does not contain "…" after edit` error is pattern drift, not a
  sed-flavour problem. `tag-plugins.sh` and `push-extensions.sh` still need bash ≥ 4:
  `brew install bash`, then `/opt/homebrew/bin/bash scripts/…`. Full macOS notes (uv commands for
  the converter and tests, the `http.postBuffer` fix for `protocol error: bad line length` pushes,
  `GH_TOKEN` via `gh auth token`) live in RELEASING.md's "Releasing from macOS" section.
  `push-extensions.sh` also fails on every repo with `Author identity unknown` (nothing is
  pushed) when the git identity is set only in this repo, because its temporary clones don't
  see repo-local config. Pass `user.name` and `user.email` with the post buffer through
  `GIT_CONFIG_COUNT`, as RELEASING.md shows, and re-run.
- **Changelog gaps.** `[Unreleased]` only holds what each PR remembered to add; for 6.18.3
  the week's command fixes, the answer-first guides and the certification launch had none. Check the merged-PR list (step 1) before bumping, and
  credit outside contributors by @handle so `check-contributor-credits.py` enforces their card.
- **Releasing from a dirty checkout.** If the usual checkout has local edits or `main` is
  checked out in another worktree, release from a clean one: `git worktree add
  ../arc-kit-release main`. The session hook's `.arckit/memory/sessions.md` edits then land
  in the session's own checkout, not in the release tree.
- **Hardcoding the plugin list.** The Claude marketplace now ships 18 plugins (core plus
  regional, sector, method, agent-architecture, tooling, and supplier overlays) and keeps growing. Older examples listed
  only 7, silently skipping newer plugins. Discover plugins dynamically (step 10) -- this is the
  exact bug that shipped `arckit-uk-nhs` untagged mid-v5.4.0, which is why `tag-plugins.sh`
  now auto-discovers. Never copy a static plugin array.
- **A `for` loop over an empty glob exits 0.** Step 10's discovery searched from `.` while the
  manifests sit at depth 4, so `-maxdepth 3` matched nothing and the validation reported a
  clean pass having checked not one plugin -- through every release from v6.0.0 to v6.7.4.
  Dynamic discovery only helps if you assert it found something, hence the count check and the
  `Validating N plugin manifests...` line. Treat any loop whose body might never run as
  unvalidated until it prints what it covered.
- **`claude plugin tag` takes a PATH, not a plugin name.** Passing the `name` from `plugin.json`
  (`arckit`) resolves relative to the repo root and fails `✘ Path not found: /…/arckit`. Use the
  plugin directory: `plugins/arckit-claude`. This compounded the bug above -- had the glob ever
  matched, every iteration would have failed anyway.
- **Validate before `tag-plugins.sh`, never after.** Once the native `name--vX.Y.Z` tags exist,
  the dry-run fails with `Tag "…" already exists locally` -- correct behaviour, not version drift,
  but it will send you hunting for a problem that isn't there.
- **`claude plugin tag` needs a clean tree.** Run it *after* the commit (step 8), not before, or
  it errors on the dirty working tree.
- **`claude plugin tag` is `--dry-run` only here.** It creates `name--vX.Y.Z` style tags that do
  **not** match `release.yml`'s `v[0-9]+.[0-9]+.[0-9]+` trigger. We use it solely for its
  validation side effect (cross-checking `plugin.json` vs `marketplace.json`). The real release
  tag is the `git tag -a vX.Y.Z` in step 12.
- **Two CHANGELOGs, not one.** `CHANGELOG.md` is the CLI changelog; `plugins/arckit-claude/CHANGELOG.md`
  is the plugin changelog. Both need an entry. They are human-authored — `generate-release-notes.sh`
  only *previews* what changed, it does not write them. `bump-version.sh` then runs
  `scripts/trim-plugin-changelog.py`, which keeps the plugin file under 64 KB by moving whole
  older minor series to `docs/changelog/arckit-plugin-archive.md`; commit both files.
- **CLI and plugin versions are independent but bumped together.** `bump-version.sh` moves both to
  the same number by design; don't try to skew them.
- **`push-extensions.sh` needs `GH_TOKEN`** and skips repos that don't yet exist on GitHub — a
  "skipped" line is not an error for a brand-new extension, but double-check it's not skipping a
  repo that *should* exist. The `claude` target writes the full `arckit-claude` marketplace repo,
  including the public-but-proprietary `plugins/uk/gcloud/` overlay and its license exception. It
  now creates/preserves standalone repo `vX.Y.Z` tags and GitHub Releases; use
  `ARCKIT_SKIP_EXTENSION_RELEASES=1` only when intentionally doing a commit-only sync.
- **Tables in release articles.** LinkedIn and Medium do not render Markdown tables — a
  comparison pasted there lands as a wall of pipes. Write it as prose. Articles live in the
  gitignored `docs/articles/` drafts folder; force-add the keepers (`git add -f`).
- **Articles are for users, not maintainers.** Lead each section with what changed for the
  reader and why it matters; no file names, hook names, schema or regex talk in the body — say
  what a mechanism does, not what it is called. Hero labels follow the same rule. The first draft
  of the commerce-skills article (#845) had to be rewritten for this; the maintainer detail lives
  in the CHANGELOG and the PR body, which the article can link to.
- **The core plugin publishes to `plugins/arckit`, not the repo root.** Until 6.16.2 it sat at the
  root, so its plugin folder was the whole repo: the Claude plugin directory's validator timed out
  on it and every install carried a copy of all the overlays. Anything in the core that needs an
  overlay's files must look beside the core (`${CLAUDE_PLUGIN_ROOT}/../../arckit-*/*/` in the
  install cache, `${CLAUDE_PLUGIN_ROOT}/../` in a repo checkout), never inside it.
- **Do not put release numbers in extension READMEs.** Extension release identity lives in
  `VERSION` files, manifests, Git tags, and GitHub Releases. README-pinned versions drift and
  are blocked by `tests/plugin/test_release_process.py`.
- **Order is load-bearing.** changelogs → bump → prose pins → convert → layout sync → extension tests → commit → validate →
  tag → tag-plugins → push-extensions.
  Re-running an earlier step after a later one (e.g. editing files after the commit) means the tag
  no longer points at the released tree. If you edit after committing, redo from the commit.

## Reference

- [`docs/RELEASING.md`](../../../docs/RELEASING.md) — full release documentation and rationale
- `scripts/bump-version.sh` — version bump across all files
- `scripts/generate-release-notes.sh` — changelog preview from git log
- `scripts/tag-plugins.sh` — native per-plugin tags (auto-discovers)
- `scripts/push-extensions.sh` — pushes distribution dirs to standalone repos
- `.github/workflows/release.yml` — creates the GitHub Release on `v*` tag push
