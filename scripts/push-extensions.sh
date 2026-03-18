#!/usr/bin/env bash
set -euo pipefail

# push-extensions.sh — Push extension directories to their separate GitHub repos.
# Usage: ./scripts/push-extensions.sh [extension...]
#
# Examples:
#   ./scripts/push-extensions.sh              # Push all extensions
#   ./scripts/push-extensions.sh gemini codex # Push only gemini and codex
#
# Requires: gh CLI authenticated with push access to tractorjuice/* repos.

REPO_OWNER="tractorjuice"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

# ── Extension config ──────────────────────────────────────────────────────────
# Format: local_dir:repo_name
declare -A EXTENSIONS=(
  [gemini]="arckit-gemini:arckit-gemini"
  [codex]="arckit-codex:arckit-codex"
  [opencode]="arckit-opencode:arckit-opencode"
  [copilot]="arckit-copilot:arckit-copilot"
)

# ── Determine which extensions to push ────────────────────────────────────────
if [[ $# -gt 0 ]]; then
  TARGETS=("$@")
else
  TARGETS=("gemini" "codex" "opencode" "copilot")
fi

# ── Read version from root VERSION file ───────────────────────────────────────
VERSION=$(cat "$ROOT_DIR/VERSION")
COMMIT_MSG="chore: sync with arc-kit v${VERSION}"

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

# ── Main loop ─────────────────────────────────────────────────────────────────
PUSHED=0
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

  # Clone into temp dir
  clone_path="$WORK_DIR/$repo_name"
  echo "  Cloning ${REPO_OWNER}/${repo_name}..."
  if ! gh repo clone "${REPO_OWNER}/${repo_name}" "$clone_path" -- --depth 1 2>/dev/null; then
    red "  Failed to clone ${REPO_OWNER}/${repo_name}"
    ((FAILED++))
    continue
  fi

  # Remove all tracked files (except .git) to handle deletions
  find "$clone_path" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +

  # Copy extension files
  echo "  Syncing files from $local_dir/..."
  cp -a "$source_path"/. "$clone_path"/

  # Check for changes
  cd "$clone_path"
  git add -A
  if git diff --cached --quiet; then
    yellow "  No changes — already up to date"
    ((SKIPPED++))
    cd "$ROOT_DIR"
    continue
  fi

  # Show summary of changes
  CHANGED=$(git diff --cached --stat | tail -1)
  echo "  Changes: $CHANGED"

  # Commit and push
  git commit -m "$COMMIT_MSG" --quiet
  git push --quiet
  green "  ✓ Pushed to ${REPO_OWNER}/${repo_name}"
  ((PUSHED++))
  cd "$ROOT_DIR"
done

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "── Summary ──"
echo "  Pushed:  $PUSHED"
echo "  Skipped: $SKIPPED"
echo "  Failed:  $FAILED"

[[ $FAILED -eq 0 ]] || exit 1
