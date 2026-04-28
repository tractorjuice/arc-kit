#!/usr/bin/env node
/**
 * ArcKit PermissionRequest Hook - Auto-Allow Bundled MCP Tools
 *
 * Auto-approves permission requests for the read-only MCP documentation tools
 * bundled with ArcKit (AWS Knowledge, Microsoft Learn, Google Developer Knowledge,
 * DataCommons, govreposcrape). Non-MCP tools fall through to the normal permission dialog.
 *
 * Hook Type: PermissionRequest
 * Input (stdin):  JSON { tool_name, ... }
 * Output (stdout): JSON with "decision": "allow" for matched tools
 * Exit codes:      0 = allow (matched MCP tool), 1 = pass-through (not matched)
 */

import { readFileSync } from 'node:fs';

const ALLOWED_PREFIXES = [
  'mcp__aws-knowledge__',
  'mcp__microsoft-learn__',
  'mcp__plugin_microsoft-docs_microsoft-learn__',
  'mcp__google-developer-knowledge__',
  'mcp__datacommons-mcp__',
  'mcp__govreposcrape__',
];

let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  process.exit(1);
}
if (!raw || !raw.trim()) process.exit(1);

let data;
try {
  data = JSON.parse(raw);
} catch {
  process.exit(1);
}

const toolName = data.tool_name || '';

if (ALLOWED_PREFIXES.some(prefix => toolName.startsWith(prefix))) {
  console.log(JSON.stringify({
    decision: 'allow',
    reason: 'ArcKit: auto-allowed bundled MCP documentation tool',
  }));
  process.exit(0);
}

process.exit(1);
