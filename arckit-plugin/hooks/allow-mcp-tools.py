#!/usr/bin/env python3
"""
ArcKit PermissionRequest Hook - Auto-Allow Bundled MCP Tools

Auto-approves permission requests for the read-only MCP documentation tools
bundled with ArcKit (AWS Knowledge, Microsoft Learn, Google Developer Knowledge,
DataCommons). Non-MCP tools fall through to the normal permission dialog.

Hook Type: PermissionRequest
Input (stdin):  JSON { tool_name, ... }
Output (stdout): JSON with "decision": "allow" for matched tools
Exit codes:      0 = allow (matched MCP tool), 1 = pass-through (not matched)
"""

import json
import sys

ALLOWED_PREFIXES = (
    "mcp__aws-knowledge__",
    "mcp__microsoft-learn__",
    "mcp__plugin_microsoft-docs_microsoft-learn__",
    "mcp__google-developer-knowledge__",
    "mcp__datacommons-mcp__",
)


def main():
    try:
        raw = sys.stdin.read()
        if not raw or not raw.strip():
            sys.exit(1)
        data = json.loads(raw)
    except (json.JSONDecodeError, ValueError, EOFError):
        sys.exit(1)

    tool_name = data.get("tool_name", "")

    if tool_name.startswith(ALLOWED_PREFIXES):
        print(json.dumps({
            "decision": "allow",
            "reason": "ArcKit: auto-allowed bundled MCP documentation tool",
        }))
        sys.exit(0)

    sys.exit(1)


if __name__ == "__main__":
    main()
