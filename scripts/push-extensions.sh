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
)

# Claude Code plugins are published together to the arckit-claude marketplace
# repo. The core plugin stays at the repo root for compatibility with the
# original standalone mirror. Overlays live under structured plugin paths.
CLAUDE_PLUGIN_REPO="arckit-claude"
CLAUDE_PLUGIN_CORE_DIR="plugins/arckit-claude"
CLAUDE_PLUGIN_LAYOUT=(
  "plugins/arckit-uae:plugin/uae"
  "plugins/arckit-fr:plugin/fr"
  "plugins/arckit-ca:plugin/ca"
  "plugins/arckit-eu:plugin/eu"
  "plugins/arckit-at:plugin/at"
  "plugins/arckit-au:plugin/au"
  "plugins/arckit-au-energy:plugin/au/energy"
  "plugins/arckit-us:plugin/us"
  "plugins/arckit-uk-finance:plugin/uk/finance"
  "plugins/arckit-uk-nhs:plugin/uk/nhs"
  "plugins/arckit-fde:plugin/fde"
  "plugins/arckit-uk-gcloud:plugin/uk/gcloud"
)

# ── Determine which distributions to push ─────────────────────────────────────
if [[ $# -gt 0 ]]; then
  TARGETS=("$@")
else
  TARGETS=("claude" "gemini" "codex" "opencode" "copilot" "paperclip" "vibe")
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
    -cf - . | tar -C "$destination_path" -xf -
}

write_claude_standalone_license() {
  local license_path="$1"

  cat > "$license_path" <<'EOF'
NOTE: The MIT License below applies to the arckit-claude repository EXCEPT for
the directory `plugin/uk/gcloud/`, which is proprietary and licensed
separately — see `plugin/uk/gcloud/LICENSE`. The MIT grant below does not
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

  echo "  Syncing core plugin from $CLAUDE_PLUGIN_CORE_DIR/..."
  copy_distribution_files "$ROOT_DIR/$CLAUDE_PLUGIN_CORE_DIR" "$clone_path"
  write_claude_standalone_license "$clone_path/LICENSE"

  for entry in "${CLAUDE_PLUGIN_LAYOUT[@]}"; do
    IFS=':' read -r source_path repo_subdir <<< "$entry"
    echo "  Syncing $source_path/ -> $repo_subdir/..."
    copy_distribution_files "$ROOT_DIR/$source_path" "$clone_path/$repo_subdir"
  done

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
