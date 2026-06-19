#!/usr/bin/env bash
set -uo pipefail

# push-extensions.sh — Publish extension directories to their separate GitHub repos.
# Usage: ./scripts/push-extensions.sh [extension...]
#
# Examples:
#   ./scripts/push-extensions.sh              # Push all extensions
#   ./scripts/push-extensions.sh gemini codex # Push only gemini and codex
#
# Requires: GH_TOKEN with repo scope, or gh CLI authenticated with push access.
# By default this also creates/preserves a vX.Y.Z tag and GitHub Release in
# each extension repo. Set ARCKIT_SKIP_EXTENSION_RELEASES=1 for a commit-only
# sync.

REPO_OWNER="tractorjuice"

# ── Auth: prefer GH_TOKEN PAT for push (codespaces scope GITHUB_TOKEN to one repo)
AUTH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

# ── Extension config ──────────────────────────────────────────────────────────
# Format: local_dir:repo_name
declare -A EXTENSIONS=(
  [gemini]="extensions/arckit-gemini:arckit-gemini"
  [codex]="extensions/arckit-codex:arckit-codex"
  [opencode]="extensions/arckit-opencode:arckit-opencode"
  [copilot]="extensions/arckit-copilot:arckit-copilot"
  [paperclip]="extensions/arckit-paperclip:arckit-paperclip"
  [vibe]="extensions/arckit-vibe:arckit-vibe"
)

# ── Determine which extensions to push ────────────────────────────────────────
if [[ $# -gt 0 ]]; then
  TARGETS=("$@")
else
  TARGETS=("gemini" "codex" "opencode" "copilot" "paperclip" "vibe")
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
    yellow "  Extension release publishing disabled by ARCKIT_SKIP_EXTENSION_RELEASES=1"
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

# ── Main loop ─────────────────────────────────────────────────────────────────
PROCESSED=0
SKIPPED=0
FAILED=0

for target in "${TARGETS[@]}"; do
  if [[ ! ${EXTENSIONS[$target]+_} ]]; then
    red "  Unknown extension: $target"
    echo "  Valid: ${!EXTENSIONS[*]}"
    ((FAILED++))
    continue
  fi

  IFS=':' read -r local_dir repo_name <<< "${EXTENSIONS[$target]}"
  source_path="$ROOT_DIR/$local_dir"

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
  tar -C "$source_path" \
    --exclude='./node_modules' \
    --exclude='./.npm' \
    --exclude='./.pnpm-store' \
    --exclude='./.yarn/cache' \
    -cf - . | tar -C "$clone_path" -xf -

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
