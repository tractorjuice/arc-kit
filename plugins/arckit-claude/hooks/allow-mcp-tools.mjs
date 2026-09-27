#!/usr/bin/env node
/**
 * ArcKit PermissionRequest Hook - Auto-Allow Bundled MCP Tools
 *
 * Auto-approves permission requests for the read-only MCP documentation tools
 * bundled with ArcKit (AWS Knowledge, Microsoft Learn, Google Developer Knowledge,
 * DataCommons, govreposcrape, uk-tenders). Everything else falls through to the
 * normal permission dialog. The user's own deny and ask rules still apply.
 *
 * Tools of an MCP server that a plugin ships are named
 * mcp__plugin_<plugin>_<server>__<tool>, so the plugin's own servers are
 * mcp__plugin_arckit_<server>__. The bare mcp__<server>__ form matches only a
 * server the user added by hand under the same key; both are accepted. Until
 * 6.16.3 only the bare form was listed, and the hook printed a top-level
 * {"decision":"allow"} (a top-level decision only accepts "block") and exited
 * 1 on no match, so it never approved anything and logged a hook error on
 * every other MCP call. The Claude plugin directory's validator caught it.
 *
 * Hook Type: PermissionRequest
 * Input (stdin):  JSON { tool_name, ... }
 * Output (stdout): {"hookSpecificOutput": {"hookEventName": "PermissionRequest",
 *                   "decision": {"behavior": "allow"}}} for matched tools;
 *                   nothing otherwise
 * Exit code:       0 always (no output = no decision, normal flow)
 */

import { readFileSync } from 'node:fs';

const SERVERS = [
  'aws-knowledge',
  'microsoft-learn',
  'google-developer-knowledge',
  'datacommons-mcp',
  'govreposcrape',
  'uk-tenders',
];

const ALLOWED_PREFIXES = [
  ...SERVERS.map((server) => `mcp__plugin_arckit_${server}__`),
  ...SERVERS.map((server) => `mcp__${server}__`),
  // Microsoft's own microsoft-docs plugin ships the same Learn server.
  'mcp__plugin_microsoft-docs_microsoft-learn__',
];

function isAllowed(toolName) {
  return typeof toolName === 'string'
    && ALLOWED_PREFIXES.some((prefix) => toolName.startsWith(prefix));
}

let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}
if (!raw || !raw.trim()) process.exit(0);

let data;
try {
  data = JSON.parse(raw);
} catch {
  process.exit(0);
}

const toolName = data.tool_name || '';

if (isAllowed(toolName)) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PermissionRequest',
      decision: { behavior: 'allow' },
    },
  }));
}

process.exit(0);
