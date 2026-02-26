#!/usr/bin/env bash
# ArcKit SessionStart Hook
#
# Fires once at session start (and on resume/clear/compact).
# Injects ArcKit plugin version into the context window and exports
# ARCKIT_VERSION as an environment variable for Bash tool calls.
#
# Input (stdin): JSON with session_id, cwd, etc.
# Output (stdout): JSON with additionalContext

set -euo pipefail

# Read hook input from stdin
INPUT=$(cat)

# Extract working directory
CWD=$(echo "$INPUT" | jq -r '.cwd // "."')
ENV_FILE=$(echo "$INPUT" | jq -r '.env_file // ""')

# Read plugin version
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
VERSION_FILE="${PLUGIN_ROOT}/VERSION"

if [[ -f "$VERSION_FILE" ]]; then
  ARCKIT_VERSION=$(cat "$VERSION_FILE" | tr -d '[:space:]')
else
  ARCKIT_VERSION="unknown"
fi

# Export ARCKIT_VERSION so Bash tool calls can use it
if [[ -n "$ENV_FILE" ]]; then
  echo "ARCKIT_VERSION=${ARCKIT_VERSION}" >> "$ENV_FILE"
fi

# Check for projects directory
CONTEXT="ArcKit Plugin v${ARCKIT_VERSION} is active."
NL=$'\n'

if [[ -d "${CWD}/projects" ]]; then
  CONTEXT="${CONTEXT}${NL}${NL}Projects directory: found at ${CWD}/projects"
else
  CONTEXT="${CONTEXT}${NL}${NL}No projects/ directory found. Run /arckit:init to scaffold a new project or /arckit:create to add one."
fi

# Check for external files newer than latest artifacts
if [[ -d "${CWD}/projects" ]]; then
  EXT_ALERTS=""
  for project_dir in "${CWD}/projects"/*/; do
    [[ -d "$project_dir" ]] || continue
    [[ -d "${project_dir}external" ]] || continue

    project_name=$(basename "$project_dir")

    # Find newest ARC-* artifact mtime across main dir and subdirs
    NEWEST_ARTIFACT=0
    for f in "$project_dir"ARC-*.md; do
      [[ -f "$f" ]] || continue
      mtime=$(stat -c %Y "$f" 2>/dev/null || echo 0)
      [[ $mtime -gt $NEWEST_ARTIFACT ]] && NEWEST_ARTIFACT=$mtime
    done
    for subdir in decisions diagrams wardley-maps data-contracts reviews; do
      if [[ -d "${project_dir}${subdir}" ]]; then
        for f in "${project_dir}${subdir}"/ARC-*.md; do
          [[ -f "$f" ]] || continue
          mtime=$(stat -c %Y "$f" 2>/dev/null || echo 0)
          [[ $mtime -gt $NEWEST_ARTIFACT ]] && NEWEST_ARTIFACT=$mtime
        done
      fi
    done

    # Compare external files against newest artifact
    NEW_EXT_FILES=()
    for f in "${project_dir}external"/*; do
      [[ -f "$f" ]] || continue
      fname=$(basename "$f")
      [[ "$fname" == "README.md" ]] && continue
      ext_mtime=$(stat -c %Y "$f" 2>/dev/null || echo 0)
      if [[ $ext_mtime -gt $NEWEST_ARTIFACT ]]; then
        NEW_EXT_FILES+=("$fname")
      fi
    done

    if [[ ${#NEW_EXT_FILES[@]} -gt 0 ]]; then
      EXT_ALERTS="${EXT_ALERTS}${NL}[${project_name}] ${#NEW_EXT_FILES[@]} external file(s) newer than latest artifact:"
      for ef in "${NEW_EXT_FILES[@]}"; do
        EXT_ALERTS="${EXT_ALERTS}${NL}  - ${ef}"
      done
      # Print to stderr so the user sees it in terminal
      echo >&2 "[ArcKit] ${project_name}: ${#NEW_EXT_FILES[@]} new external file(s) detected"
    fi
  done

  if [[ -n "$EXT_ALERTS" ]]; then
    CONTEXT="${CONTEXT}${NL}${NL}## New External Files Detected${NL}${EXT_ALERTS}${NL}${NL}Consider re-running relevant commands to incorporate these files. Run /arckit:health for detailed recommendations."
  fi
fi

# Output additionalContext
jq -n --arg ctx "$CONTEXT" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $ctx
  }
}'
