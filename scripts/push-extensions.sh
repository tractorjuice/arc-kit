#!/usr/bin/env bash
set -uo pipefail

# push-extensions.sh — Publish ArcKit distributions to separate GitHub repos.
# Usage: ./scripts/push-extensions.sh [distribution...]
#
# Examples:
#   ./scripts/push-extensions.sh              # Push all standalone distributions
#   ./scripts/push-extensions.sh claude codex # Push only Claude and Codex
#
# Requires: GH_TOKEN with repo scope, or gh CLI authenticated with push access.
# By default this also creates/preserves a vX.Y.Z tag and GitHub Release in
# each standalone repo. Set ARCKIT_SKIP_EXTENSION_RELEASES=1 for a commit-only
# sync.

REPO_OWNER="tractorjuice"

# ── Auth: prefer GH_TOKEN PAT for push (codespaces scope GITHUB_TOKEN to one repo)
AUTH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

# ── Standalone repo config ────────────────────────────────────────────────────
# Format: local_dir:repo_name
declare -A EXTENSIONS=(
  [claude]="plugins/arckit-claude:arckit-claude"
  [gemini]="extensions/arckit-gemini:arckit-gemini"
  [codex]="extensions/arckit-codex:arckit-codex"
  [opencode]="extensions/arckit-opencode:arckit-opencode"
  [copilot]="extensions/arckit-copilot:arckit-copilot"
  [paperclip]="extensions/arckit-paperclip:arckit-paperclip"
  [vibe]="extensions/arckit-vibe:arckit-vibe"
  [kimi]="extensions/arckit-kimi:arckit-kimi"
)

# Generated distributions are gitignored in the monorepo and must be created in
# the release worktree before publishing. These checks prevent a clean checkout
# from wiping standalone repos with only the few tracked scaffold files.
declare -A GENERATED_EXTENSION_REQUIRED_PATHS=(
  [gemini]="commands/arckit skills templates agents policies/rules.toml"
  [codex]=".codex-plugin/plugin.json .mcp.json config.toml agents commands prompts skills templates"
  [opencode]="commands skills templates agents"
  [copilot]="prompts skills templates agents copilot-instructions.md"
  [paperclip]="src/data/commands.json skills templates docs/guides config"
  [vibe]="skills templates agents config docs/guides"
  [kimi]="skills templates config docs/guides kimi.plugin.json"
)

# Claude Code plugins are published together to the arckit-claude marketplace
# repo. Every plugin, the core included, lives in its own folder under
# plugins/; the repo root holds only the marketplace, a README and the LICENSE.
# The core used to sit at the root, which made its plugin folder the whole repo
# (every overlay beneath it): the Claude plugin directory's validator timed out
# on it, and it broke the directory's 512-file plugin-folder limit.
CLAUDE_PLUGIN_REPO="arckit-claude"
CLAUDE_PLUGIN_CORE_DIR="plugins/arckit-claude"
CLAUDE_PLUGIN_CORE_SUBDIR="plugins/arckit"
CLAUDE_PLUGIN_LAYOUT=(
  "plugins/arckit-uae:plugins/uae"
  "plugins/arckit-fr:plugins/fr"
  "plugins/arckit-nl:plugins/nl"
  "plugins/arckit-ca:plugins/ca"
  "plugins/arckit-eu:plugins/eu"
  "plugins/arckit-at:plugins/at"
  "plugins/arckit-au:plugins/au"
  "plugins/arckit-au-energy:plugins/au/energy"
  "plugins/arckit-us:plugins/us"
  "plugins/arckit-uk-finance:plugins/uk/finance"
  "plugins/arckit-uk-nhs:plugins/uk/nhs"
  "plugins/arckit-fde:plugins/fde"
  "plugins/arckit-uk-gcloud:plugins/uk/gcloud"
  "plugins/arckit-togaf-adm:plugins/togaf/adm"
  "plugins/arckit-oaa:plugins/oaa"
  "plugins/arckit-agent-architecture:plugins/agent/architecture"
  "plugins/arckit-repo:plugins/repo"
)

# ── Determine which distributions to push ─────────────────────────────────────
if [[ $# -gt 0 ]]; then
  TARGETS=("$@")
else
  TARGETS=("claude" "gemini" "codex" "opencode" "copilot" "paperclip" "vibe" "kimi")
fi

# ── Read version from root VERSION file ───────────────────────────────────────
VERSION=$(cat "$ROOT_DIR/VERSION")
COMMIT_MSG="chore: sync with arc-kit v${VERSION}"
TAG="v${VERSION}"
SKIP_RELEASES="${ARCKIT_SKIP_EXTENSION_RELEASES:-0}"

# ── Helpers ───────────────────────────────────────────────────────────────────
green()  { printf '\033[0;32m%s\033[0m\n' "$1"; }
red()    { printf '\033[0;31m%s\033[0m\n' "$1"; }
yellow() { printf '\033[0;33m%s\033[0m\n' "$1"; }

check_repo_exists() {
  local repo="$1"
  if gh repo view "${REPO_OWNER}/${repo}" &>/dev/null; then
    return 0
  else
    return 1
  fi
}

validate_generated_extension_source() {
  local target="$1"
  local source_path="$2"
  local local_dir="$3"
  local required_paths="${GENERATED_EXTENSION_REQUIRED_PATHS[$target]:-}"
  local rel_path
  local missing=()

  if [[ -z "$required_paths" ]]; then
    return 0
  fi

  for rel_path in $required_paths; do
    if [[ ! -e "$source_path/$rel_path" ]]; then
      missing+=("$rel_path")
    fi
  done

  if [[ ${#missing[@]} -gt 0 ]]; then
    red "  Generated distribution is incomplete: $local_dir/"
    red "  Missing generated path(s): ${missing[*]}"
    yellow "  Run python scripts/converter.py before publishing standalone extensions."
    return 1
  fi
}

remote_tag_commit() {
  local tag="$1"
  local commit

  # Annotated tags expose the target commit through ^{}; lightweight tags do not.
  commit=$(git ls-remote --tags origin "refs/tags/${tag}^{}" | awk '{print $1}' | head -1)
  if [[ -z "$commit" ]]; then
    commit=$(git ls-remote --tags origin "refs/tags/${tag}" | awk '{print $1}' | head -1)
  fi
  printf '%s' "$commit"
}

ensure_repo_topic() {
  local repo_name="$1"
  local wanted_topic="$2"
  local current_json
  local next_json

  current_json=$(gh api "repos/${REPO_OWNER}/${repo_name}/topics" \
    -H 'Accept: application/vnd.github+json' 2>/dev/null) || {
      yellow "  Could not read topics for ${REPO_OWNER}/${repo_name} — skipping topic check"
      return 0
    }

  if jq -e --arg topic "$wanted_topic" '(.names // []) | index($topic)' \
      <<<"$current_json" >/dev/null; then
    return 0
  fi

  next_json=$(jq --arg topic "$wanted_topic" \
    '.names = (((.names // []) + [$topic]) | unique)' \
    <<<"$current_json")

  if gh api "repos/${REPO_OWNER}/${repo_name}/topics" \
      -X PUT \
      -H 'Accept: application/vnd.github+json' \
      --input - <<<"$next_json" >/dev/null; then
    green "  ✓ Added GitHub topic: ${wanted_topic}"
  else
    yellow "  Could not update topics for ${REPO_OWNER}/${repo_name}"
  fi
}

publish_release_artifacts() {
  local repo_name="$1"
  local head_sha
  local existing_tag_commit
  local release_notes

  if [[ "$SKIP_RELEASES" == "1" ]]; then
    yellow "  Standalone repo release publishing disabled by ARCKIT_SKIP_EXTENSION_RELEASES=1"
    return 0
  fi

  head_sha=$(git rev-parse HEAD)
  existing_tag_commit=$(remote_tag_commit "$TAG")

  if [[ -n "$existing_tag_commit" ]]; then
    if [[ "$existing_tag_commit" != "$head_sha" ]]; then
      red "  Tag ${TAG} already exists but points at ${existing_tag_commit:0:8}, not ${head_sha:0:8}"
      return 1
    fi
    yellow "  Tag ${TAG} already exists at HEAD"
  else
    echo "  Creating tag ${TAG}..."
    if ! git tag -a "$TAG" -m "${repo_name} ${TAG}"; then
      red "  Failed to create tag ${TAG} for ${REPO_OWNER}/${repo_name}"
      return 1
    fi
    if ! git push --quiet origin "refs/tags/${TAG}"; then
      red "  Failed to push tag ${TAG} for ${REPO_OWNER}/${repo_name}"
      return 1
    fi
    green "  ✓ Pushed tag ${TAG}"
  fi

  if gh release view "$TAG" --repo "${REPO_OWNER}/${repo_name}" &>/dev/null; then
    yellow "  GitHub Release ${TAG} already exists"
    return 0
  fi

  release_notes=$(cat <<EOF
Synced from tractorjuice/arc-kit ${TAG}.

Main ArcKit release: https://github.com/tractorjuice/arc-kit/releases/tag/${TAG}
Source commit: ${head_sha}
EOF
)

  echo "  Creating GitHub Release ${TAG}..."
  if gh release create "$TAG" \
      --repo "${REPO_OWNER}/${repo_name}" \
      --title "${repo_name} ${TAG}" \
      --notes "$release_notes" >/dev/null; then
    green "  ✓ Created GitHub Release ${TAG}"
  else
    red "  Failed to create GitHub Release ${TAG} for ${REPO_OWNER}/${repo_name}"
    return 1
  fi
}

copy_distribution_files() {
  local source_path="$1"
  local destination_path="$2"

  mkdir -p "$destination_path"
  tar -C "$source_path" \
    --exclude='./node_modules' \
    --exclude='./.npm' \
    --exclude='./.pnpm-store' \
    --exclude='./.yarn/cache' \
    --exclude='./evals/results' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.DS_Store' \
    -cf - . | tar -C "$destination_path" -xf -
}

# The core plugin's own folder: everything in plugins/arckit-claude except the
# nested overlay mirror (the overlays are published beside it from their own
# sources) and the marketplace file (which belongs at the repo root).
copy_claude_core_files() {
  local source_path="$1"
  local destination_path="$2"

  mkdir -p "$destination_path"
  tar -C "$source_path" \
    --exclude='./node_modules' \
    --exclude='./.npm' \
    --exclude='./.pnpm-store' \
    --exclude='./.yarn/cache' \
    --exclude='./evals/results' \
    --exclude='__pycache__' \
    --exclude='*.pyc' \
    --exclude='.DS_Store' \
    --exclude='./plugins' \
    --exclude='./.claude-plugin/marketplace.json' \
    -cf - . | tar -C "$destination_path" -xf -
}

# The local marketplace file lives inside the core plugin and lists the core as
# "." (locally the core folder is the marketplace root). Published, the core is
# one folder down, so its source becomes ./plugins/arckit; overlays keep theirs.
write_claude_root_marketplace() {
  local source_marketplace="$1"
  local destination_marketplace="$2"

  mkdir -p "$(dirname "$destination_marketplace")"
  python3 - "$source_marketplace" "$destination_marketplace" "./$CLAUDE_PLUGIN_CORE_SUBDIR" <<'PY'
import json, sys
src, dst, core_source = sys.argv[1:4]
with open(src, encoding="utf-8") as f:
    marketplace = json.load(f)
cores = [p for p in marketplace["plugins"] if p["source"] in (".", "./")]
if len(cores) != 1 or cores[0]["name"] != "arckit":
    sys.exit(f"expected exactly one root-sourced plugin named arckit, found {[p['name'] for p in cores]}")
cores[0]["source"] = core_source
with open(dst, "w", encoding="utf-8") as f:
    json.dump(marketplace, f, indent=2, ensure_ascii=False)
    f.write("\n")
PY
}

write_claude_root_readme() {
  local readme_path="$1"

  cat > "$readme_path" <<'README_EOF'
# ArcKit for Claude

The Claude Code marketplace for [ArcKit](https://arckit.org), the Enterprise Architecture Governance Harness: slash commands, agents, skills and hooks that turn architecture governance into a systematic, template-driven process.

## Install

```text
/plugin marketplace add tractorjuice/arckit-claude
/plugin install arckit@arckit-claude
```

Then add any overlays you need, for example `/plugin install arckit-uae@arckit-claude`. Every overlay needs the `arckit` core plugin.

## Plugins

Each plugin lives in its own folder under `plugins/`, with its own README:

- [`plugins/arckit`](plugins/arckit): the core plugin
- Jurisdiction overlays: [`uae`](plugins/uae), [`fr`](plugins/fr), [`nl`](plugins/nl), [`ca`](plugins/ca), [`eu`](plugins/eu), [`at`](plugins/at), [`au`](plugins/au), [`au/energy`](plugins/au/energy), [`us`](plugins/us)
- Sector overlays: [`uk/finance`](plugins/uk/finance), [`uk/nhs`](plugins/uk/nhs), [`uk/gcloud`](plugins/uk/gcloud) (proprietary, see its LICENSE)
- Method overlays: [`togaf/adm`](plugins/togaf/adm), [`oaa`](plugins/oaa), [`agent/architecture`](plugins/agent/architecture)
- Tooling: [`repo`](plugins/repo), [`fde`](plugins/fde)

## Data and privacy

ArcKit collects no usage data. What each plugin sends, and when, is in its README; the core plugin's is in [`plugins/arckit/README.md`](plugins/arckit/README.md#data-and-privacy). Privacy policy: <https://arckit.org/privacy.html>.

## Source

This repository is generated from [tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit) at each release. Open issues and pull requests there.
README_EOF
}

write_claude_standalone_license() {
  local license_path="$1"

  cat > "$license_path" <<'EOF'
NOTE: The MIT License below applies to the arckit-claude repository EXCEPT for
the directory `plugins/uk/gcloud/`, which is proprietary and licensed
separately — see `plugins/uk/gcloud/LICENSE`. The MIT grant below does not
extend to that directory or any files within it.

MIT License

Copyright (c) 2025 Mark Craddock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
}

publish_claude_plugins_repo() {
  local repo_name="$CLAUDE_PLUGIN_REPO"
  local clone_path="$WORK_DIR/$repo_name"
  local clone_url="https://x-access-token:${AUTH_TOKEN}@github.com/${REPO_OWNER}/${repo_name}.git"
  local source_path
  local repo_subdir
  local changed

  echo ""
  echo "── claude (${repo_name}) ──"

  if [[ ! -d "$ROOT_DIR/$CLAUDE_PLUGIN_CORE_DIR" ]]; then
    red "  Source directory not found: $CLAUDE_PLUGIN_CORE_DIR/"
    return 1
  fi

  for entry in "${CLAUDE_PLUGIN_LAYOUT[@]}"; do
    IFS=':' read -r source_path repo_subdir <<< "$entry"
    if [[ ! -d "$ROOT_DIR/$source_path" ]]; then
      red "  Source directory not found: $source_path/"
      return 1
    fi
  done

  if ! check_repo_exists "$repo_name"; then
    yellow "  Repo ${REPO_OWNER}/${repo_name} not found on GitHub — skipping"
    yellow "  Create it with: gh repo create ${REPO_OWNER}/${repo_name} --public"
    return 2
  fi

  echo "  Cloning ${REPO_OWNER}/${repo_name}..."
  if ! git clone --depth 1 --quiet "$clone_url" "$clone_path" 2>/dev/null; then
    red "  Failed to clone ${REPO_OWNER}/${repo_name}"
    return 1
  fi

  find "$clone_path" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

  echo "  Syncing core plugin from $CLAUDE_PLUGIN_CORE_DIR/ -> $CLAUDE_PLUGIN_CORE_SUBDIR/..."
  copy_claude_core_files "$ROOT_DIR/$CLAUDE_PLUGIN_CORE_DIR" "$clone_path/$CLAUDE_PLUGIN_CORE_SUBDIR"
  if ! write_claude_root_marketplace \
      "$ROOT_DIR/$CLAUDE_PLUGIN_CORE_DIR/.claude-plugin/marketplace.json" \
      "$clone_path/.claude-plugin/marketplace.json"; then
    red "  Failed to write the root marketplace"
    cd "$ROOT_DIR"
    return 1
  fi
  write_claude_root_readme "$clone_path/README.md"
  write_claude_standalone_license "$clone_path/LICENSE"

  for entry in "${CLAUDE_PLUGIN_LAYOUT[@]}"; do
    IFS=':' read -r source_path repo_subdir <<< "$entry"
    echo "  Syncing $source_path/ -> $repo_subdir/..."
    copy_distribution_files "$ROOT_DIR/$source_path" "$clone_path/$repo_subdir"
  done

  # Namespace overlay command invocations for Claude Code. MUST run after the
  # loop above: that loop tar-extracts the RAW overlay sources over the same
  # paths the core copy just populated, so it overwrites the already-namespaced
  # mirror from sync-claude-plugin-layout.py. Without this the published repo
  # ships `/arckit:uae-x`, which does not resolve (Claude Code namespaces by the
  # plugin's own name, and only core is named `arckit`).
  #
  # This also covers the core tree itself — guides and commands under the repo
  # root that reference overlay commands — which the mirror never touched.
  echo "  Namespacing overlay command invocations for Claude Code..."
  if ! python3 "$ROOT_DIR/scripts/claude_command_namespacing.py" "$clone_path"; then
    red "  Failed to namespace overlay command invocations"
    cd "$ROOT_DIR"
    return 1
  fi

  cd "$clone_path"
  git add -A
  if git diff --cached --quiet; then
    yellow "  No changes — already up to date"
  else
    changed=$(git diff --cached --stat | tail -1)
    echo "  Changes: $changed"

    if ! git commit -m "$COMMIT_MSG" --quiet; then
      red "  Failed to commit changes for ${REPO_OWNER}/${repo_name}"
      cd "$ROOT_DIR"
      return 1
    fi
    if ! git push --quiet; then
      red "  Failed to push ${REPO_OWNER}/${repo_name}"
      cd "$ROOT_DIR"
      return 1
    fi
    green "  ✓ Pushed to ${REPO_OWNER}/${repo_name}"
  fi

  if ! publish_release_artifacts "$repo_name"; then
    cd "$ROOT_DIR"
    return 1
  fi

  cd "$ROOT_DIR"
  return 0
}

# ── Main loop ─────────────────────────────────────────────────────────────────
PROCESSED=0
SKIPPED=0
FAILED=0

for target in "${TARGETS[@]}"; do
  if [[ ! ${EXTENSIONS[$target]+_} ]]; then
    red "  Unknown distribution: $target"
    echo "  Valid: ${!EXTENSIONS[*]}"
    ((FAILED++))
    continue
  fi

  IFS=':' read -r local_dir repo_name <<< "${EXTENSIONS[$target]}"
  source_path="$ROOT_DIR/$local_dir"

  if [[ "$target" == "claude" ]]; then
    if publish_claude_plugins_repo; then
      ((PROCESSED++))
    else
      status=$?
      if [[ $status -eq 2 ]]; then
        ((SKIPPED++))
      else
        ((FAILED++))
      fi
    fi
    cd "$ROOT_DIR"
    continue
  fi

  echo ""
  echo "── $target ($repo_name) ──"

  # Check source dir exists
  if [[ ! -d "$source_path" ]]; then
    red "  Source directory not found: $local_dir/"
    ((FAILED++))
    continue
  fi

  if ! validate_generated_extension_source "$target" "$source_path" "$local_dir"; then
    ((FAILED++))
    continue
  fi

  # Check remote repo exists
  if ! check_repo_exists "$repo_name"; then
    yellow "  Repo ${REPO_OWNER}/${repo_name} not found on GitHub — skipping"
    yellow "  Create it with: gh repo create ${REPO_OWNER}/${repo_name} --public"
    ((SKIPPED++))
    continue
  fi

  # Clone into temp dir using token-authenticated URL
  clone_path="$WORK_DIR/$repo_name"
  clone_url="https://x-access-token:${AUTH_TOKEN}@github.com/${REPO_OWNER}/${repo_name}.git"
  echo "  Cloning ${REPO_OWNER}/${repo_name}..."
  if ! git clone --depth 1 --quiet "$clone_url" "$clone_path" 2>/dev/null; then
    red "  Failed to clone ${REPO_OWNER}/${repo_name}"
    ((FAILED++))
    continue
  fi

  # Remove all tracked files (except .git) to handle deletions
  find "$clone_path" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

  # Copy extension files, excluding local dependency/install artefacts.
  echo "  Syncing files from $local_dir/..."
  copy_distribution_files "$source_path" "$clone_path"

  # Check for changes
  cd "$clone_path"
  git add -A
  if git diff --cached --quiet; then
    yellow "  No changes — already up to date"
  else
    # Show summary of changes
    CHANGED=$(git diff --cached --stat | tail -1)
    echo "  Changes: $CHANGED"

    # Commit and push
    if ! git commit -m "$COMMIT_MSG" --quiet; then
      red "  Failed to commit changes for ${REPO_OWNER}/${repo_name}"
      ((FAILED++))
      cd "$ROOT_DIR"
      continue
    fi
    if ! git push --quiet; then
      red "  Failed to push ${REPO_OWNER}/${repo_name}"
      ((FAILED++))
      cd "$ROOT_DIR"
      continue
    fi
    green "  ✓ Pushed to ${REPO_OWNER}/${repo_name}"
  fi

  if [[ "$target" == "gemini" ]]; then
    ensure_repo_topic "$repo_name" "gemini-cli-extension"
  fi

  if ! publish_release_artifacts "$repo_name"; then
    ((FAILED++))
    cd "$ROOT_DIR"
    continue
  fi

  ((PROCESSED++))
  cd "$ROOT_DIR"
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "── Summary ──"
echo "  Processed: $PROCESSED"
echo "  Skipped:   $SKIPPED"
echo "  Failed:    $FAILED"

[[ $FAILED -eq 0 ]] || exit 1
