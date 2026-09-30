#!/usr/bin/env node
/**
 * ArcKit PreToolUse Hook — Auto-Allow Reads of the Plugin's Own Files
 *
 * Every ArcKit command reads its template, reference and schema files from
 * the plugin's install directory, which sits outside the user's working
 * directory, so each read would otherwise ask for approval. Claude Code has
 * no way for a plugin to pre-approve reads of its own files (a
 * `Read(${CLAUDE_PLUGIN_ROOT}/...)` rule in `allowed-tools` is not
 * substituted; tested on v2.1.285), so this hook approves exactly that:
 *
 *   - Read of a file whose real path (symlinks and `..` resolved) is inside
 *     the plugin root;
 *   - Read of an ArcKit handoff tempfile in /tmp (legacy; kept for
 *     orchestrators on older command bodies).
 *
 * It grants nothing else. It used to approve Bash commands that invoked
 * plugin scripts, but that check looked only for the script path, so
 * a script call with any other command chained after it was approved whole. Plugin
 * scripts are now pre-approved natively by each command's `allowed-tools`
 * Bash rules, which Claude Code checks per subcommand, and reader output is
 * validated by hooks/validate-reader-handoff.mjs without Bash.
 *
 * Hook Type: PreToolUse (matcher Read)
 * Output on match: {"hookSpecificOutput": {"hookEventName": "PreToolUse",
 *   "permissionDecision": "allow", "permissionDecisionReason": "..."}}
 * No match: silent pass-through. Exit code 0 always. User and project deny
 * rules still take precedence over a hook allow.
 */

import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Plugin root = parent of the hooks/ dir this script lives in.
const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(__dirname, '..');

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

  // No match — silent pass-through. Claude Code falls back to the
  // normal permission flow (user prompt, deny rules, etc.).
  process.exit(0);
}

// ── Helpers ────────────────────────────────────────────────────────────

function isUnderPluginRoot(p) {
  if (!p || typeof p !== 'string') return false;
  // Resolve `..` and follow symlinks on both sides, so neither a traversal
  // nor a symlink inside the plugin can reach a file outside it. A path that
  // doesn't exist can't be read anyway; don't approve it.
  let real, root;
  try {
    real = realpathSync(resolve(p)).replaceAll('\\', '/');
    root = realpathSync(PLUGIN_ROOT).replaceAll('\\', '/');
  } catch {
    return false;
  }
  return real === root || real.startsWith(root + '/');
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
