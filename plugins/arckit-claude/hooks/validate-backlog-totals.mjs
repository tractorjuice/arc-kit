#!/usr/bin/env node
/**
 * ArcKit PreToolUse (Write) Hook — Backlog Totals
 *
 * Validates a product backlog JSON (`ARC-<nnn>-BKLG-v<n>.<n>.json`) about to
 * be written, recomputing every aggregate from the backlog's own items:
 *   1. Summary totals — item count, epic count, total points, points per
 *      MoSCoW bucket, requirement count
 *   2. Epics — each epic's points equal its items' points, its `stories` list
 *      matches the items that name it, and every item's epic exists
 *   3. Sprints — no sprint numbered below 1 (a `Sprint 0` placeholder), and a
 *      sprint's `stories` list agrees with each item's own `sprint`
 *   4. Priority drift — a requirement the project's REQ document marks with a
 *      MoSCoW priority must have a backlog item at that priority or higher,
 *      unless its `traceability` row records a `priority_change` reason
 *
 * The rules live in the pure `backlog-totals.mjs`. Claude Code only: the other
 * runtimes (except Kimi, through its adapter) do not run this hook.
 *
 * Hook Type: PreToolUse
 * Matcher: Write
 * Scoped via an `if:` rule in hooks.json to Write calls on `ARC-*-BKLG-*.json`
 * under projects/.
 *
 * Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, ... }
 * Output (stdout): JSON { decision: "block", reason } on failure; empty on pass.
 * Exit code:       0 in all cases (block via JSON decision so the reason is fed
 *                  back to the model instead of producing a hard permission error).
 */

import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import { parseHookInput } from './hook-utils.mjs';
import { checkBacklog, parseRequirementPriorities } from './backlog-totals.mjs';

const data = parseHookInput();
const filePath = (data.tool_input || {}).file_path || '';
const filename = basename(filePath);
if (!/^ARC-\d{3}-BKLG(?:-\d+)?-v\d+\.\d+\.json$/i.test(filename)) process.exit(0);

const content = (data.tool_input || {}).content || '';
if (!content.trim()) process.exit(0);

let backlog;
try {
  backlog = JSON.parse(content);
} catch (e) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `Invalid JSON in ${filename}: ${e.message}\n\nFix the JSON and re-issue the Write.`,
  }));
  process.exit(0);
}

// The project's current requirements document: highest REQ version in the
// same project directory. Absent or unreadable, the priority check is skipped.
let requirementPriorities = new Map();
try {
  const dir = dirname(filePath);
  let best = null;
  let bestRank = -1;
  for (const name of readdirSync(dir)) {
    const m = name.match(/^ARC-\d{3}-REQ-v(\d+)\.(\d+)\.md$/i);
    if (!m) continue;
    const rank = parseInt(m[1], 10) * 1000 + parseInt(m[2], 10);
    if (rank > bestRank) {
      bestRank = rank;
      best = name;
    }
  }
  if (best) requirementPriorities = parseRequirementPriorities(readFileSync(join(dir, best), 'utf8'));
} catch {
  // No readable requirements document: nothing to compare priorities against.
}

let result;
try {
  result = checkBacklog(backlog, requirementPriorities);
} catch {
  // A fault in the rules must never block a backlog write.
  process.exit(0);
}

const parts = [];
if (result.totals.length > 0) parts.push('**Totals that do not match the items:**\n' + result.totals.join('\n'));
if (result.epics.length > 0) parts.push('**Epic totals and membership:**\n' + result.epics.join('\n'));
if (result.sprints.length > 0) parts.push('**Sprint assignments:**\n' + result.sprints.join('\n'));
if (result.priorities.length > 0) parts.push('**Priority lowered from the requirements document without a recorded reason:**\n' + result.priorities.join('\n'));

if (parts.length > 0) {
  const reason = `Backlog validation errors in ${filename}:\n\n${parts.join('\n\n')}\n\n`
    + 'Recompute every total from the items rather than editing the numbers to match, '
    + 'carry the corrected figures into the Markdown backlog, and re-issue the Write.';
  console.log(JSON.stringify({ decision: 'block', reason }));
}

process.exit(0);
