#!/usr/bin/env bash
set -euo pipefail

# generate-release-notes.sh — Parse git log into Keep a Changelog format.
# Usage: ./scripts/generate-release-notes.sh [previous-tag]
#
# If no previous tag given, auto-detects the most recent v* tag.
# Output is clean markdown to stdout — pipe to gh release create or
# copy-paste into CHANGELOGs.

PREV_TAG="${1:-}"

# ── Auto-detect previous tag if not supplied ──────────────────────────────────

if [[ -z "$PREV_TAG" ]]; then
  PREV_TAG=$(git tag -l 'v*' --sort=-v:refname | head -1)
  if [[ -z "$PREV_TAG" ]]; then
    echo "Error: No v* tags found in this repository." >&2
    exit 1
  fi
fi

# ── Determine range ───────────────────────────────────────────────────────────

# If HEAD is a tag, use prev..current; otherwise prev..HEAD
CURRENT_TAG=$(git tag --points-at HEAD 2>/dev/null | grep '^v' | head -1 || true)
if [[ -n "$CURRENT_TAG" ]]; then
  RANGE="${PREV_TAG}..${CURRENT_TAG}"
else
  RANGE="${PREV_TAG}..HEAD"
fi

# ── Collect commits ───────────────────────────────────────────────────────────

COMMITS=$(git log --oneline --no-merges "$RANGE" 2>/dev/null || true)

if [[ -z "$COMMITS" ]]; then
  echo "No commits found in range $RANGE" >&2
  exit 0
fi

# ── Categorize ────────────────────────────────────────────────────────────────

BREAKING=""
ADDED=""
FIXED=""
CHANGED=""

while IFS= read -r line; do
  # Strip the short hash
  msg="${line#* }"

  # Skip version bump noise
  if echo "$msg" | grep -qi '^chore: bump version'; then
    continue
  fi

  # Detect breaking changes
  if echo "$msg" | grep -qiE 'BREAKING|!:'; then
    entry=$(echo "$msg" | sed -E 's/^[a-z]+(\([^)]*\))?!?:\s*//')
    entry="$(echo "${entry:0:1}" | tr '[:lower:]' '[:upper:]')${entry:1}"
    BREAKING="${BREAKING}- ${entry}"$'\n'
    continue
  fi

  # Categorize by conventional commit prefix
  case "$msg" in
    feat:*|feat\(*)
      entry=$(echo "$msg" | sed -E 's/^feat(\([^)]*\))?:\s*//')
      entry="$(echo "${entry:0:1}" | tr '[:lower:]' '[:upper:]')${entry:1}"
      ADDED="${ADDED}- ${entry}"$'\n'
      ;;
    fix:*|fix\(*)
      entry=$(echo "$msg" | sed -E 's/^fix(\([^)]*\))?:\s*//')
      entry="$(echo "${entry:0:1}" | tr '[:lower:]' '[:upper:]')${entry:1}"
      FIXED="${FIXED}- ${entry}"$'\n'
      ;;
    docs:*|docs\(*|chore:*|chore\(*|refactor:*|refactor\(*|build:*|build\(*|style:*|style\(*|ci:*|ci\(*|perf:*|perf\(*|test:*|test\(*)
      entry=$(echo "$msg" | sed -E 's/^[a-z]+(\([^)]*\))?:\s*//')
      entry="$(echo "${entry:0:1}" | tr '[:lower:]' '[:upper:]')${entry:1}"
      CHANGED="${CHANGED}- ${entry}"$'\n'
      ;;
    *)
      # No recognized prefix — treat as Changed
      entry="$(echo "${msg:0:1}" | tr '[:lower:]' '[:upper:]')${msg:1}"
      CHANGED="${CHANGED}- ${entry}"$'\n'
      ;;
  esac
done <<< "$COMMITS"

# ── Output ────────────────────────────────────────────────────────────────────

OUTPUT=""

if [[ -n "$BREAKING" ]]; then
  OUTPUT="${OUTPUT}### Breaking Changes\n\n${BREAKING}\n"
fi

if [[ -n "$ADDED" ]]; then
  OUTPUT="${OUTPUT}### Added\n\n${ADDED}\n"
fi

if [[ -n "$FIXED" ]]; then
  OUTPUT="${OUTPUT}### Fixed\n\n${FIXED}\n"
fi

if [[ -n "$CHANGED" ]]; then
  OUTPUT="${OUTPUT}### Changed\n\n${CHANGED}\n"
fi

# Print without trailing newline artifacts
echo -e "$OUTPUT" | sed -e '/^$/{ N; /^\n$/d; }' -e '$ { /^$/d; }'
