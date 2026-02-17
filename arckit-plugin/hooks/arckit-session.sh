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

# Output additionalContext
jq -n --arg ctx "$CONTEXT" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $ctx
  }
}'
