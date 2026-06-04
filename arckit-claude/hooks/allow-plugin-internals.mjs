#!/usr/bin/env node
/**
 * ArcKit PermissionRequest Hook — Auto-Allow Plugin-Internal Reads & Scripts
 *
 * Reading the plugin's own bundled files (templates, schemas, scripts,
 * agent prompts, references) and invoking the plugin's own bundled
 * helper scripts (validate-handoff.mjs, create-project.sh, generate-
 * document-id.sh, etc.) should not require user approval each session.
 * They are part of the plugin the user has already trusted by enabling.
 *
 * This hook auto-approves PermissionRequests for:
 *   - Read against any path under the plugin root
 *   - Bash invocations whose command string contains a path under
 *     ${CLAUDE_PLUGIN_ROOT}/scripts/ (validate-handoff.mjs,
 *     scripts/bash/*.sh helpers)
 *
 * Anything else (Read of project files, Bash for arbitrary commands,
 * Write of project artefacts, etc.) falls through to the normal
 * permission dialog.
 *
 * Hook Type: PreToolUse
 * Input (stdin):  JSON { tool_name, tool_input: {...}, ... }
 * Output (stdout):
 *   On match (allow):
 *     {"hookSpecificOutput": {
 *       "hookEventName": "PreToolUse",
 *       "permissionDecision": "allow",
 *       "permissionDecisionReason": "..."
 *     }}
 *   On no-match: silent pass-through (exit 0, no JSON).
 *
 * Exit code 0 always — pass-through is a non-decision, not a failure.
 * Hook auto-allow does NOT override user/project deny rules: per the
 * Claude Code docs, deny rules take precedence over plugin hook allows.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Plugin root = parent of the hooks/ dir this script lives in.
const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, '..');
const SCRIPTS_DIR = resolve(PLUGIN_ROOT, 'scripts');

main();

function main() {
  let raw = '';
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    process.exit(0); // silent pass-through
  }
  if (!raw || !raw.trim()) process.exit(0);

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const toolName = data.tool_name || '';
  const input = data.tool_input || {};

  if (toolName === 'Read') {
    const filePath = input.file_path || '';
    if (isUnderPluginRoot(filePath)) {
      allow(`ArcKit: auto-allowed Read of plugin-internal file (${shortPath(filePath)})`);
    }
    if (isArcKitTempfile(filePath)) {
      allow('ArcKit: auto-allowed Read of ArcKit-managed tempfile');
    }
  }

  if (toolName === 'Bash') {
    const command = input.command || '';
    if (commandTouchesPluginScripts(command)) {
      allow('ArcKit: auto-allowed Bash invocation of plugin-internal helper script');
    }
  }

  // No match — silent pass-through. Claude Code falls back to the
  // normal permission flow (user prompt, deny rules, etc.).
  process.exit(0);
}

// ── Helpers ────────────────────────────────────────────────────────────

function isUnderPluginRoot(p) {
  if (!p || typeof p !== 'string') return false;
  // Resolve to absolute, then check prefix. Don't follow symlinks; the
  // plugin's distributed files are real files in a marketplace cache.
  const abs = resolve(p).replaceAll('\\', '/');
  const root = PLUGIN_ROOT.replaceAll('\\', '/');
  return abs === root || abs.startsWith(root + '/');
}

function commandTouchesPluginScripts(cmd) {
  if (!cmd || typeof cmd !== 'string') return false;
  // Two trust markers — either form qualifies:
  //   1. Resolved absolute path: /.../arckit-claude/scripts/...
  //   2. Env-var literal: ${CLAUDE_PLUGIN_ROOT}/scripts/... — Claude
  //      Code passes the LLM-emitted command to the hook with the env
  //      var unexpanded; bash expands at execution time.
  // An attacker-forged command can't fabricate the real plugin path,
  // and ${CLAUDE_PLUGIN_ROOT} is a sentinel string the LLM only emits
  // when the prompt instructed it to use plugin-internal helpers.
  const PREFIXES = [
    SCRIPTS_DIR.replaceAll('\\', '/') + '/',
    '${CLAUDE_PLUGIN_ROOT}/scripts/',
  ];
  let anyPrefixHit = false;
  for (const p of PREFIXES) if (cmd.includes(p)) { anyPrefixHit = true; break; }
  if (!anyPrefixHit) return false;

  const KNOWN = new Set([
    'validate-handoff.mjs',
    'bash/common.sh',
    'bash/create-project.sh',
    'bash/generate-document-id.sh',
    'bash/check-prerequisites.sh',
    'bash/list-projects.sh',
    'bash/migrate-filenames.sh',
    'bash/detect-stale-artifacts.sh',
  ]);

  // Collect every "scripts/<filename>" reference in the command string,
  // regardless of which prefix introduces it. If any reference points
  // to a filename NOT in the allowlist, refuse to auto-allow.
  const refs = [];
  for (const prefix of PREFIXES) {
    const re = new RegExp(escapeRegex(prefix) + '([A-Za-z0-9_./-]+)', 'g');
    const matches = [...cmd.matchAll(re)];
    for (const m of matches) refs.push(m[1]);
  }
  if (refs.length === 0) return false;
  for (const tail of refs) {
    if (!KNOWN.has(tail)) return false;
  }
  return true;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isArcKitTempfile(p) {
  if (!p || typeof p !== 'string') return false;
  // ArcKit-managed tempfiles created by an orchestrator's mktemp call:
  //   /tmp/datascout-handoff.AbCdEf.json
  //   /tmp/grants-handoff.AbCdEf.json
  //   /tmp/grants-handoff-open-data.AbCdEf.json     (per-category dispatch)
  //   /tmp/gov-reuse-handoff.AbCdEf.json            (hyphenated agent name)
  //   /tmp/gov-reuse-handoff-appointment-booking.AbCdEf.json
  //   /tmp/arckit-grants-handoff.AbCdEf.json        (alt prefix form)
  //
  // Pattern: optional "arckit-" prefix, then a lowercase agent name
  // (which may itself contain hyphens, e.g. "gov-reuse"), then "-handoff",
  // then optional further hyphenated qualifiers (e.g. funder category)
  // and the mktemp random tail. Auto-allow Read against these so the
  // orchestrator can re-inspect a payload it just wrote.
  //
  // Risk surface: Read-only, /tmp-scoped, transient. To exploit this an
  // attacker would already need Bash auto-allow to plant the file.
  return /^\/tmp\/(?:arckit-)?[a-z][a-z0-9-]*-handoff(?:-[a-z][a-z0-9-]*)?[A-Za-z0-9.-]*\.json$/.test(p);
}

function shortPath(p) {
  if (typeof p !== 'string') return '';
  const idx = p.indexOf('/arckit-claude/');
  return idx >= 0 ? '…' + p.slice(idx) : p;
}

function allow(reason) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'allow',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}
