#!/usr/bin/env bash
# ArcKit PermissionRequest Hook — Auto-Allow Bundled MCP Tools
#
# Auto-approves permission requests for the read-only MCP documentation tools
# bundled with ArcKit (AWS Knowledge, Microsoft Learn, Google Developer Knowledge,
# DataCommons). Non-MCP tools fall through to the normal permission dialog.
#
# Input (stdin):  JSON { tool_name, ... }
# Output (stdout): JSON with "decision": "allow" for matched tools
# Exit codes:      0 = allow (matched MCP tool), 1 = pass-through (not matched)

set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""')

case "$TOOL_NAME" in
  mcp__aws-knowledge__*|\
  mcp__microsoft-learn__*|\
  mcp__plugin_microsoft-docs_microsoft-learn__*|\
  mcp__google-developer-knowledge__*|\
  mcp__datacommons-mcp__*)
    echo '{"decision":"allow","reason":"ArcKit: auto-allowed bundled MCP documentation tool"}'
    exit 0
    ;;
  *)
    exit 1
    ;;
esac
