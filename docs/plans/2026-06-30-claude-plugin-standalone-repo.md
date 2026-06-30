# Claude Plugin Standalone Repo Migration Plan

> **Version boundary:** v6.0.0.

## Goal

Publish all Claude Code ArcKit plugins from one public standalone marketplace
repo, `tractorjuice/arckit-claude`, matching the standalone distribution pattern
used by `arckit-codex`, `arckit-gemini`, `arckit-opencode`,
`arckit-copilot`, `arckit-paperclip`, and `arckit-vibe`.

The `tractorjuice/arc-kit` monorepo remains the development source of truth.
Release tooling copies the Claude core plugin and Claude-only overlays into the
standalone repo during release.

## Target Shape

The standalone `tractorjuice/arckit-claude` repo contains the core plugin at the
repository root for the normal Claude Code install path:

```text
.claude-plugin/plugin.json
.claude-plugin/marketplace.json
commands/
agents/
hooks/
skills/
templates/
scripts/
docs/
config/
schemas/
references/
README.md
CHANGELOG.md
VERSION
LICENSE
```

Overlay plugins are copied into structured paths:

| Plugin | Standalone repo path |
|---|---|
| `arckit-uae` | `plugin/uae` |
| `arckit-fr` | `plugin/fr` |
| `arckit-ca` | `plugin/ca` |
| `arckit-eu` | `plugin/eu` |
| `arckit-at` | `plugin/at` |
| `arckit-au` | `plugin/au` |
| `arckit-au-energy` | `plugin/au/energy` |
| `arckit-us` | `plugin/us` |
| `arckit-uk-finance` | `plugin/uk/finance` |
| `arckit-uk-nhs` | `plugin/uk/nhs` |
| `arckit-fde` | `plugin/fde` |
| `arckit-uk-gcloud` | `plugin/uk/gcloud` |

`arckit-uk-gcloud` is public for installation and inspection but remains
proprietary. The root standalone repo `LICENSE` must explicitly exclude
`plugin/uk/gcloud/` from the MIT grant.

## Install Paths

Preferred Claude Code install:

```text
/plugin marketplace add tractorjuice/arckit-claude
```

Core plugin:

```bash
claude plugin install arckit@arckit-claude
```

Examples:

```bash
claude plugin install arckit arckit-uk-finance
claude plugin install arckit arckit-au arckit-au-energy
claude plugin install arckit-fde@arckit-claude
```

The older `tractorjuice/arc-kit` marketplace may remain available for
compatibility and pre-merge branch testing, but user-facing production docs
should prefer `tractorjuice/arckit-claude`.

## Implementation Tasks

- [x] Create the public `tractorjuice/arckit-claude` repo.
- [x] Publish the initial core-only mirror so the repo exists and can be
      inspected.
- [x] Add standalone marketplace metadata at
      `plugins/arckit-claude/.claude-plugin/marketplace.json`.
- [x] Point Claude plugin manifests and marketplace entries at
      `https://github.com/tractorjuice/arckit-claude`.
- [x] Teach `scripts/push-extensions.sh claude` to publish the full Claude
      marketplace repo instead of only copying `plugins/arckit-claude/`.
- [x] Copy the core plugin to the standalone repo root and all overlays into
      structured `plugin/...` paths.
- [x] Generate a standalone `LICENSE` with the proprietary
      `plugin/uk/gcloud/` exception.
- [x] Add release-process tests for the single-repo Claude marketplace layout.
- [x] Update install docs, test-repo templates, and release docs.
- [x] Bump the release version to `6.0.0`.
- [ ] Merge the ArcKit PR.
- [ ] Cut the `v6.0.0` release from `main`.
- [ ] Run `./scripts/tag-plugins.sh 6.0.0`.
- [ ] Run `./scripts/push-extensions.sh claude` to publish the structured
      `tractorjuice/arckit-claude` repo and create its `v6.0.0` release.
- [ ] Verify a clean project can install the marketplace and all expected plugin
      entries are discoverable.

## Validation

Run before opening or merging the PR:

```bash
bash -n scripts/push-extensions.sh
jq empty .claude-plugin/marketplace.json plugins/arckit-claude/.claude-plugin/marketplace.json plugins/arckit-*/.claude-plugin/plugin.json
python scripts/converter.py
pytest tests/plugin/test_release_process.py
pytest tests/codex/test_codex_extension.py tests/gemini tests/opencode tests/copilot tests/vibe/test_vibe_extension.py tests/paperclip/test_commands_json.py
npx markdownlint-cli2 README.md docs/RELEASING.md docs/llms.txt docs/guides/mcp-servers.md docs/guides/testing-plugin-branches.md docs/plans/2026-06-30-claude-plugin-standalone-repo.md plugins/arckit-claude/README.md .claude/skills/release/SKILL.md
git diff --check
```

After merge and release, verify:

- `https://github.com/tractorjuice/arckit-claude` contains the core plugin at the
  root.
- The standalone marketplace lists all 13 Claude plugins.
- `plugin/uk/finance` and `plugin/uk/gcloud` exist in the standalone repo.
- `plugin/uk/gcloud/` is covered by the proprietary license exception.
- `claude plugin install arckit@arckit-claude` works from a clean project.
