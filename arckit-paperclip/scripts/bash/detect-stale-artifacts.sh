#!/usr/bin/env bash
# ArcKit Stale Artifact Scanner
#
# One-shot scan wired into the plugin's `monitors` manifest key. Fires at
# session start (when the plugin is enabled in an ArcKit repo), emits one
# stdout line per stale artifact, and exits.
#
# Stale criteria:
#   1. Document Control "Next Review Date" is in the past
#   2. Status is DRAFT and the file hasn't been touched in >14 days
#
# Output format is a single notification line per artifact, readable as
# an additionalContext signal by Claude Code. Silent exit if the cwd is
# not an ArcKit project (no projects/ directory).

set -u

cwd="$(pwd)"
if [[ ! -d "$cwd/projects" ]]; then
  exit 0
fi

today="$(date +%Y-%m-%d)"
stale_count=0
max_report=10

# Resolve a GNU-style date threshold for draft staleness (14 days ago).
# Falls back silently if `date -d` unsupported.
draft_threshold=""
if date -d "14 days ago" +%Y-%m-%d >/dev/null 2>&1; then
  draft_threshold="$(date -d "14 days ago" +%Y-%m-%d)"
fi

# Iterate ARC-*.md files under projects/, ignoring symlinks and node_modules
while IFS= read -r -d '' file; do
  [[ $stale_count -ge $max_report ]] && break

  # Pull Document Control table fields. Anchor Status to a row whose label is
  # exactly "Status" (with optional **markdown bold**) so we don't match
  # entity-attribute tables further down the file.
  next_review="$(grep -m1 -i "Next Review Date" "$file" 2>/dev/null \
    | sed -E 's/.*\| *([0-9]{4}-[0-9]{2}-[0-9]{2}).*/\1/')"
  status="$(grep -m1 -iE '^\| *\*{0,2} *Status *\*{0,2} *\|' "$file" 2>/dev/null \
    | grep -oiE '(DRAFT|IN_REVIEW|APPROVED|PUBLISHED|SUPERSEDED|ARCHIVED)' \
    | head -1 \
    | tr '[:lower:]' '[:upper:]')"
  last_modified="$(grep -m1 -i "Last Modified" "$file" 2>/dev/null \
    | sed -E 's/.*\| *([0-9]{4}-[0-9]{2}-[0-9]{2}).*/\1/')"

  rel="${file#$cwd/}"

  # Overdue review
  if [[ -n "$next_review" && "$next_review" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    if [[ "$next_review" < "$today" ]]; then
      echo "[ArcKit monitor] STALE: $rel — review overdue since $next_review"
      stale_count=$((stale_count + 1))
      continue
    fi
  fi

  # Long-running draft
  if [[ "$status" == "DRAFT" && -n "$draft_threshold" \
        && -n "$last_modified" && "$last_modified" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
    if [[ "$last_modified" < "$draft_threshold" ]]; then
      echo "[ArcKit monitor] STALE: $rel — DRAFT unchanged since $last_modified"
      stale_count=$((stale_count + 1))
    fi
  fi
done < <(find "$cwd/projects" -type f -name "ARC-*.md" -not -path "*/node_modules/*" -print0 2>/dev/null)

if [[ $stale_count -eq 0 ]]; then
  exit 0
fi

if [[ $stale_count -ge $max_report ]]; then
  echo "[ArcKit monitor] (reporting first $max_report; run /arckit.health for the full list)"
else
  echo "[ArcKit monitor] Found $stale_count stale artifact(s). Run /arckit.health for details."
fi
