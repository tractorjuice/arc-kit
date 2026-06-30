# Claude Plugin Standalone Repo Migration Plan

> **For agentic workers:** Implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Keep unrelated dirty files, generated session memory, and local health output out of commits.

**Goal:** Publish the Claude Code core ArcKit plugin to its own standalone repository, `tractorjuice/arckit-claude`, matching the standalone distribution pattern used by `arckit-codex`, `arckit-gemini`, `arckit-opencode`, `arckit-copilot`, `arckit-paperclip`, and `arckit-vibe`.

**Architecture:** Use a two-stage migration. First, keep `plugins/arckit-claude/` as the canonical source inside `tractorjuice/arc-kit` and mirror that directory into a standalone public repo during release. This matches the existing extension repo model and avoids breaking the converter, tests, Claude marketplace overlays, and release tooling. Second, only after the mirror is stable, decide whether to make `tractorjuice/arckit-claude` the source of truth and have `arc-kit` consume it through a controlled vendor sync, subtree, or submodule.

**Tech Stack:** Bash release scripts, Claude Code plugin manifests, Claude marketplace metadata, GitHub CLI, Python and Node test suites, `scripts/converter.py`, release documentation, and install docs.

**Branch:** `feat/claude-standalone-repo`.

---

## Current State

- `plugins/arckit-claude/` is the core Claude Code plugin source.
- `scripts/converter.py` hard-codes `plugins/arckit-claude` as the core source for agents, scripts, guides, config, schemas, skills, references, and fallback copies into generated non-Claude extensions.
- The existing standalone repo publisher is `scripts/push-extensions.sh`; it currently maps only `gemini`, `codex`, `opencode`, `copilot`, `paperclip`, and `vibe`.
- `scripts/bump-version.sh` updates `plugins/arckit-claude/VERSION`, `plugins/arckit-claude/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, and generated extension version files in lockstep.
- `.claude-plugin/marketplace.json` currently serves the Claude marketplace from `tractorjuice/arc-kit` and points the core plugin entry at `./plugins/arckit-claude`.
- `.agents/plugins/marketplace.json` already points Codex users at `https://github.com/tractorjuice/arckit-codex`; this is the distribution shape to mirror for Claude.

---

## Target Shape

### Stage 1: Standalone Mirror

`tractorjuice/arc-kit` remains the development source of truth. Release tooling copies `plugins/arckit-claude/` into `tractorjuice/arckit-claude` and publishes the same `vX.Y.Z` tag and GitHub Release as the other standalone repos.

The standalone `arckit-claude` repo root contains:

| Path | Source | Purpose |
|---|---|---|
| `.claude-plugin/plugin.json` | `plugins/arckit-claude/.claude-plugin/plugin.json` | Claude plugin manifest |
| `.claude-plugin/marketplace.json` | new generated or maintained file | Standalone marketplace entry with `source: "."` |
| `.mcp.json` | `plugins/arckit-claude/.mcp.json` | Bundled MCP server config |
| `commands/`, `agents/`, `hooks/`, `skills/`, `templates/`, `scripts/`, `docs/`, `config/`, `schemas/`, `references/` | `plugins/arckit-claude/` | Runtime plugin content |
| `README.md`, `CHANGELOG.md`, `VERSION`, `LICENSE` | `plugins/arckit-claude/` | Standalone repo metadata |

### Stage 2: Optional Source Split

If the standalone mirror is stable for at least one release, choose whether the canonical source should move to `tractorjuice/arckit-claude`. If yes, keep a vendored copy in `plugins/arckit-claude/` for converter and tests, refreshed by an explicit sync script. Do not delete or submodule the core path until converter and CI are taught to handle the new source boundary.

---

## Non-Goals

- Do not split the community Claude overlay plugins in this change.
- Do not change `/arckit:*` command names or generated non-Claude command names.
- Do not remove `plugins/arckit-claude/` from `arc-kit` during Stage 1.
- Do not move proprietary `arckit-uk-gcloud` content into generated public extension repos.
- Do not break the existing `tractorjuice/arc-kit` Claude marketplace during the transition.

---

## File Map

| Path | Action | Purpose |
|---|---|---|
| `plugins/arckit-claude/.claude-plugin/marketplace.json` | create | Standalone Claude marketplace metadata copied into `arckit-claude` repo |
| `plugins/arckit-claude/.claude-plugin/plugin.json` | modify | Change `repository` to `https://github.com/tractorjuice/arckit-claude`; verify version count text |
| `.claude-plugin/marketplace.json` | modify | Keep old marketplace working; optionally update core plugin repository/homepage to standalone repo |
| `scripts/push-extensions.sh` | modify | Add `claude` target mapping `plugins/arckit-claude:arckit-claude` |
| `tests/plugin/test_release_process.py` | modify | Assert the Claude standalone repo is named in the publisher and release docs |
| `docs/RELEASING.md` | modify | Add `arckit-claude` to standalone publish and verification steps |
| `.claude/skills/release/SKILL.md` | modify | Keep guided release flow aligned with `docs/RELEASING.md` |
| `plugins/arckit-claude/README.md` | modify | Add standalone marketplace install path |
| `docs/getting-started.html` | modify | Prefer standalone core install, keep umbrella marketplace instructions for overlays |
| `README.md`, `docs/index.html`, `docs/llms.txt`, `docs/PLATFORM-COMPARISON.md` | audit/modify | Update links and install wording that point at the old in-repo path |
| `scripts/converter.py` | no Stage 1 change | Continue reading `plugins/arckit-claude` as the core source |
| `tests/extension_helpers.py`, `tests/codex/test_codex_extension.py` | no Stage 1 change | Continue mirroring converter source inventory |

---

## Task 0: Preflight and Repo Inventory

- [ ] **Step 1: Confirm current source and version state**

```bash
git status --short
cat VERSION
cat plugins/arckit-claude/VERSION
jq -r '.version, .repository' plugins/arckit-claude/.claude-plugin/plugin.json
```

Expected:
- Unrelated dirty files are identified and not swept into this work.
- Root and Claude plugin versions match.
- The current plugin repository still points at `tractorjuice/arc-kit` before the migration.

- [ ] **Step 2: Confirm the new remote does not already exist, or read its state if it does**

```bash
gh repo view tractorjuice/arckit-claude --json name,visibility,description,homepageUrl,defaultBranchRef,repositoryTopics
```

If it does not exist, create it in Task 4. If it already exists, treat its current contents as user-owned state and inspect before overwriting.

- [ ] **Step 3: Capture the current publisher inventory**

```bash
grep -n 'declare -A EXTENSIONS' -A12 scripts/push-extensions.sh
pytest tests/plugin/test_release_process.py
```

Expected: tests pass before changes, and the publisher currently lists six standalone non-Claude repos.

---

## Task 1: Add Standalone Claude Marketplace Metadata

**Files:**
- Create: `plugins/arckit-claude/.claude-plugin/marketplace.json`
- Modify: `plugins/arckit-claude/.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Add standalone marketplace metadata**

Create `plugins/arckit-claude/.claude-plugin/marketplace.json`:

```json
{
  "name": "arckit-claude",
  "owner": {
    "name": "TractorJuice",
    "email": "tractorjuice@users.noreply.github.com"
  },
  "metadata": {
    "description": "The Enterprise Architecture Governance Harness for Claude Code",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "arckit",
      "source": ".",
      "description": "ArcKit core for Claude Code: architecture governance, procurement, research, delivery, and assurance workflows",
      "version": "<current plugin version>",
      "author": {
        "name": "TractorJuice"
      },
      "homepage": "https://github.com/tractorjuice/arckit-claude",
      "repository": "https://github.com/tractorjuice/arckit-claude",
      "license": "MIT",
      "keywords": [
        "architecture",
        "governance",
        "enterprise",
        "procurement",
        "vendor-evaluation",
        "claude-code"
      ],
      "category": "productivity"
    }
  ]
}
```

Use `jq --arg v "$(cat plugins/arckit-claude/VERSION)"` or a small checked-in generator if manual version drift becomes a concern.

- [ ] **Step 2: Update the core plugin manifest repository field**

Set `plugins/arckit-claude/.claude-plugin/plugin.json`:

```json
"repository": "https://github.com/tractorjuice/arckit-claude"
```

Keep `name: "arckit"` unchanged. The plugin name is user-facing and should not become `arckit-claude`.

- [ ] **Step 3: Keep the umbrella marketplace compatible**

In `.claude-plugin/marketplace.json`, keep:

```json
"source": "./plugins/arckit-claude"
```

Update only metadata fields such as `repository` or `homepage` if desired. Keeping the source path unchanged preserves installs through `tractorjuice/arc-kit`, especially for users installing overlays from the umbrella marketplace.

- [ ] **Step 4: Add version drift coverage**

Extend `scripts/bump-version.sh` so it also updates:

```text
plugins/arckit-claude/.claude-plugin/marketplace.json .plugins[].version
```

Extend `tests/plugin/test_release_process.py` with a check that:
- the standalone Claude marketplace file exists,
- its only plugin is named `arckit`,
- its source is `.`,
- its version matches `plugins/arckit-claude/VERSION`.

---

## Task 2: Teach the Publisher About `arckit-claude`

**Files:**
- Modify: `scripts/push-extensions.sh`
- Modify: `tests/plugin/test_release_process.py`
- Optional later rename: `scripts/push-extensions.sh` to `scripts/push-standalone-repos.sh`

- [ ] **Step 1: Add a Claude target to the existing publisher**

Update the extension map:

```bash
[claude]="plugins/arckit-claude:arckit-claude"
```

Update default targets:

```bash
TARGETS=("claude" "gemini" "codex" "opencode" "copilot" "paperclip" "vibe")
```

Keep the script name for the first PR to minimize blast radius. The behavior already matches what is needed: clone standalone repo, replace contents, commit, push, tag, and create a GitHub Release.

- [ ] **Step 2: Make publish messaging accurate**

Update comments and release docs from "extension repos" to "standalone repos" where the Claude repo is included. Avoid a broad rename in the same PR unless every docs/test reference is updated.

- [ ] **Step 3: Update release process tests**

Add `claude` to `EXPECTED_EXTENSIONS` or rename that fixture to `EXPECTED_STANDALONE_REPOS`:

```python
"claude": ("plugins/arckit-claude", "arckit-claude"),
```

Adjust README-version tests if needed. The Claude README may mention minimum Claude Code versions, but it should not pin the current ArcKit release number outside `VERSION`, manifests, tags, and releases.

- [ ] **Step 4: Add a focused test for standalone release artifact behavior**

Extend `test_push_extensions_publishes_tags_and_github_releases` so the same tag and GitHub Release assertions apply after adding `claude`.

---

## Task 3: Update Release Documentation and Install Docs

**Files:**
- Modify: `docs/RELEASING.md`
- Modify: `.claude/skills/release/SKILL.md`
- Modify: `plugins/arckit-claude/README.md`
- Modify: `docs/getting-started.html`
- Audit/modify: `README.md`, `docs/index.html`, `docs/llms.txt`, `docs/PLATFORM-COMPARISON.md`, `scripts/README.md`

- [ ] **Step 1: Update release docs**

In `docs/RELEASING.md`:
- add `tractorjuice/arckit-claude` to the standalone repo verification list,
- change "Push to extension repos" to "Push to standalone repos",
- note that `scripts/push-extensions.sh claude` can publish just the Claude mirror,
- keep `plugins/arckit-claude/` as the source path for versioning and converter generation.

- [ ] **Step 2: Update the release skill**

In `.claude/skills/release/SKILL.md`:
- mirror the same standalone repo language,
- update gotchas to mention the Claude standalone mirror,
- keep the hard gate for public publishing.

- [ ] **Step 3: Update Claude install docs**

Preferred core install path after the standalone repo is live:

```text
/plugin marketplace add tractorjuice/arckit-claude
/plugin
```

Keep umbrella marketplace guidance for overlays:

```text
/plugin marketplace add tractorjuice/arc-kit --sparse .claude-plugin arckit-claude arckit-uae arckit-fr arckit-ca arckit-eu arckit-at arckit-au arckit-us
```

Do not remove old instructions in the first release. Mark the standalone repo as the preferred core path and the umbrella repo as the overlay/multi-plugin path.

- [ ] **Step 4: Fix stale links**

Search and update links that imply the Claude plugin root is a top-level `arckit-claude/` directory in the `arc-kit` repo. Prefer:

```text
https://github.com/tractorjuice/arckit-claude
```

for public user-facing install links, and keep:

```text
plugins/arckit-claude/
```

for contributor docs describing the source tree inside `arc-kit`.

---

## Task 4: Create and Seed the Standalone Repo

**Requires:** GitHub write access and `GH_TOKEN` or authenticated `gh`.

- [ ] **Step 1: Create the repo if missing**

```bash
gh repo create tractorjuice/arckit-claude \
  --public \
  --description "ArcKit plugin for Claude Code" \
  --homepage "https://arckit.org"
```

- [ ] **Step 2: Add repo topics**

Use `gh api` to set topics, then verify by reading them back:

```bash
gh api repos/tractorjuice/arckit-claude/topics \
  -X PUT \
  -H 'Accept: application/vnd.github+json' \
  -f names[]='arckit' \
  -f names[]='claude-code' \
  -f names[]='claude-code-plugin' \
  -f names[]='enterprise-architecture' \
  -f names[]='governance' \
  -f names[]='model-context-protocol' \
  -f names[]='public-sector'
```

- [ ] **Step 3: Publish the initial mirror**

After Task 1 and Task 2 are merged to `main`, run:

```bash
./scripts/push-extensions.sh claude
```

Expected:
- files from `plugins/arckit-claude/` are copied to the standalone repo root,
- the repo gets a sync commit,
- the repo gets `vX.Y.Z`,
- the repo gets a GitHub Release for `vX.Y.Z`.

- [ ] **Step 4: Verify install behavior**

From a clean temporary project:

```bash
claude plugin marketplace add tractorjuice/arckit-claude
claude plugin install arckit
claude plugin list
```

Also verify the legacy umbrella marketplace path still works:

```bash
claude plugin marketplace add tractorjuice/arc-kit
claude plugin install arckit@arc-kit
```

---

## Task 5: Validation Before Merge

Run focused validation before opening the PR:

```bash
python scripts/converter.py
pytest tests/plugin/test_release_process.py
pytest tests/codex/test_codex_extension.py tests/gemini tests/opencode tests/copilot tests/vibe/test_vibe_extension.py tests/paperclip/test_commands_json.py
node tests/plugin/test_graph_inject.mjs
claude plugin tag plugins/arckit-claude --dry-run
```

Expected:
- converter output is unchanged except for expected generated metadata changes,
- release process tests include the new Claude standalone repo,
- Codex and other generated extension parity tests still pass,
- Claude plugin tag validation still cross-checks the umbrella marketplace entry,
- no unrelated `.arckit/memory/*`, `docs/health.json`, or autoresearch trace files are committed.

---

## Task 6: Optional Stage 2 Source-of-Truth Split

Do this only after at least one release has successfully published `tractorjuice/arckit-claude` as a mirror.

- [ ] **Step 1: Choose the source ownership model**

Recommended order:

| Option | Recommendation | Reason |
|---|---|---|
| Keep mirror only | Preferred unless repo size or contribution flow demands a split | Lowest release risk; matches current generated extension pattern |
| Git subtree | Best if standalone repo becomes canonical but umbrella still needs a full vendored copy | Explicit sync commits; no submodule checkout footguns |
| Git submodule | Avoid unless contributors are comfortable with submodule workflows | Easy to break converter/tests in fresh checkouts |
| Runtime clone during converter | Avoid | Network dependency in generation and CI |

- [ ] **Step 2: If splitting source, add a sync script**

Create a script such as `scripts/sync-claude-plugin.sh` that:
- verifies the target ref in `tractorjuice/arckit-claude`,
- copies or subtree-pulls into `plugins/arckit-claude/`,
- preserves ignored local project files,
- refuses to run with a dirty target path,
- records the source commit in a checked-in file such as `plugins/arckit-claude/SOURCE_COMMIT`.

- [ ] **Step 3: Update contributor docs**

If source moves out:
- new Claude plugin changes start in `tractorjuice/arckit-claude`,
- `arc-kit` PRs consume synced plugin snapshots,
- converter and release PRs happen in `arc-kit`,
- emergency fixes may land in both repos only through the sync script.

- [ ] **Step 4: Add source-sync CI**

Add a test that fails when `plugins/arckit-claude/SOURCE_COMMIT` does not match the expected standalone repo ref, unless the PR intentionally updates the vendored copy.

---

## Acceptance Criteria

- `tractorjuice/arckit-claude` exists, is public, has appropriate topics, and contains the root-level Claude plugin mirror.
- `claude plugin marketplace add tractorjuice/arckit-claude` can discover and install `arckit`.
- `tractorjuice/arc-kit` marketplace installs still work for existing users and overlay installs.
- `scripts/push-extensions.sh claude` publishes the Claude standalone repo with `vX.Y.Z` tag and GitHub Release.
- `docs/RELEASING.md` and `.claude/skills/release/SKILL.md` both name `tractorjuice/arckit-claude` in release verification.
- Release process tests cover the Claude standalone repo alongside Codex, Gemini, OpenCode, Copilot, Paperclip, and Vibe.
- `scripts/converter.py` and generated extension tests still use `plugins/arckit-claude/` as the core source during Stage 1.
- Public docs clearly distinguish the preferred standalone core install from the umbrella overlay marketplace path.

---

## Cutover Notes

- Keep both marketplace paths live for at least one minor release.
- Announce the standalone repo as a distribution mirror, not a source split, until Stage 2 is explicitly approved.
- If a future release removes the umbrella core marketplace entry, do it in a separate PR with a deprecation note and install-doc update.
- The first release after this change should explicitly verify all standalone repos: `arckit-claude`, `arckit-gemini`, `arckit-codex`, `arckit-opencode`, `arckit-copilot`, `arckit-paperclip`, and `arckit-vibe`.
