#!/usr/bin/env node
/**
 * ArcKit Supplier Isolation Hook
 *
 * While /arckit:evaluate or /arckit:score runs, only arckit-evaluate-reader may
 * open a supplier's documents, so raw bid text never reaches the context that
 * scores it (#873). See docs/READER-PATTERN.md and docs/ENFORCEMENT.md.
 *
 * The gate is switched per command by a session marker. A frontmatter hook can't
 * do this: it stays on for the session and would block /arckit:hld-review, which
 * reads the same folders in the main thread.
 *
 *   - UserPromptSubmit: a typed evaluate or score sets the marker; any other
 *     /command clears it. A plain reply or a file path leaves it alone, because
 *     the command may have asked a question in chat.
 *   - PreToolUse(Skill): the same, for a command started through the Skill tool.
 *     A reference skill doesn't clear it.
 *   - PreToolUse(Read|Grep|Bash|PowerShell): denies a supplier document while the marker is
 *     set. This stops the orchestrator reading a bid by accident. It isn't a
 *     sandbox: nothing here is adversarial until a bid has been read, which is
 *     the thing being prevented.
 *
 * Hook Type: UserPromptSubmit, PreToolUse
 * Input (stdin):  JSON with session_id, prompt or tool_name + tool_input
 * Output (stdout): JSON permissionDecision 'deny' on a blocked read, else nothing
 */

import { createHash } from 'node:crypto';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isMainModule, listDir, parseHookInput } from './hook-utils.mjs';

const READER = 'arckit-evaluate-reader';
const HOOKS_DIR = dirname(fileURLToPath(import.meta.url));

// What ArcKit writes under vendors/. A vendor's own folder holds only what the
// supplier sent: a bid pack can name a file anything, so ArcKit's per-vendor
// output lives in vendors/_evaluations/, apart from the folder a pack goes into
// but still under vendors/, so a rule keeping vendors out of git covers it.
const OWN_FILE = /^(scores\.json|[^/]+-profile\.md|_evaluations(?:\/.*)?)$/;

const VENDORS = /(?:^|\/)projects\/[^/]+\/vendors(?:\/(.*))?$/;
const SHELL_DELIMITERS = String.raw`\s'"\x60;|&()<>`;
// A project's vendors folder, or a path that starts at vendors/. Anchored, so
// src/vendors.ts or a URL with /vendors/ in it isn't a bid.
const SHELL_VENDORS = new RegExp(
  String.raw`(?:^|[\s'"\x60=(])((?:[^${SHELL_DELIMITERS}=]*\/)?projects\/[^/${SHELL_DELIMITERS}]+\/vendors(?![\w.-])(?:\/[^${SHELL_DELIMITERS}]*)?|vendors\/[^${SHELL_DELIMITERS}]*)`,
  'g',
);
const SHELL_PROJECT_FOLDER = /(?:^|\/)projects(?:\/[^/]+)?(?:\/\*{0,2})?$/;
// None of these opens a file's contents.
const SAFE = new Set(['ls', 'mkdir', 'test', '[']);
const SAFE_GIT = new Set(['add', 'status']);
// These open everything below a folder, so a project folder reaches its bids.
const RECURSIVE = new Set(['grep', 'egrep', 'fgrep', 'rg', 'ag', 'ack', 'find', 'tar', 'zip', 'cp', 'rsync', 'get-childitem', 'gci']);

function normalise(path) {
  return posix.normalize(String(path).replace(/\\/g, '/'));
}

/** The path below a project's vendors/ ('' for the folder itself), or null if it isn't under one. */
function belowVendors(path) {
  const m = normalise(path).match(VENDORS);
  return m ? m[1] ?? '' : null;
}

export function isSupplierPath(path) {
  const below = belowVendors(path);
  return Boolean(below) && !OWN_FILE.test(below);
}

/** 'evaluate' or 'score' if this prompt starts one of those commands, else null. */
export function isolatingCommand(prompt) {
  const m = String(prompt ?? '').match(/^\s*(?:<command-name>)?\/arckit[.:]+(evaluate|score)(?![\w-])/i);
  return m ? m[1].toLowerCase() : null;
}

/** True if this prompt runs a slash command. A reply can be a file path, which also starts with a slash. */
export function isSlashCommand(prompt) {
  return /^\s*\/[A-Za-z][\w.:-]*(?:\s|$)/.test(String(prompt ?? ''));
}

function isolatingSkill(skill) {
  const m = String(skill ?? '').match(/^arckit:(evaluate|score)$/);
  return m ? m[1] : null;
}

/** True for another ArcKit command. A reference skill such as arckit:mermaid-syntax isn't one. */
function isArckitCommand(skill) {
  const m = String(skill ?? '').match(/^arckit:([\w.-]+)$/);
  return Boolean(m) && existsSync(join(HOOKS_DIR, '..', 'commands', `${m[1]}.md`));
}

function agentName(agentType) {
  return String(agentType).slice(String(agentType).lastIndexOf(':') + 1);
}

function looksLikeAFolder(path) {
  return path === '' || path.endsWith('/') || !path.split('/').pop().includes('.');
}

function bashOpensABid(command) {
  const text = String(command).replace(/\\/g, '/');
  for (const segment of text.split(/&&|\|\||[;|\n]/)) {
    const words = segment.trim().replace(/^(?:\w+=\S*\s+)+/, '').split(/\s+/);
    const [first, second] = words;
    if (SAFE.has(first) || (first === 'git' && SAFE_GIT.has(second))) continue;
    for (const [, raw] of segment.matchAll(SHELL_VENDORS)) {
      const below = normalise(raw).match(/(?:^|\/)vendors(?:\/(.*))?$/)?.[1] ?? '';
      if (/[*?[]/.test(below) || looksLikeAFolder(below) || !OWN_FILE.test(below)) return true;
    }
    if (RECURSIVE.has(first.toLowerCase()) || (first === 'git' && second === 'grep')) {
      for (const word of words.map((w) => w.replace(/^['"]|['"]$/g, ''))) {
        if (SHELL_PROJECT_FOLDER.test(word) && looksLikeAFolder(word)) return true;
      }
    }
  }
  return false;
}

function holdsVendorFolders(dir) {
  if (existsSync(join(dir, 'vendors'))) return true;
  const projects = basename(dir) === 'projects' ? dir : join(dir, 'projects');
  return listDir(projects).some((name) => existsSync(join(projects, name, 'vendors')));
}

function grepReachesABid(path, cwd) {
  const target = resolve(String(cwd || '.'), String(path || '.'));
  const below = belowVendors(target);
  if (below !== null) return below === '' || !OWN_FILE.test(below);
  return holdsVendorFolders(target);
}

function opensABid(event) {
  const input = event.tool_input || {};
  if (event.tool_name === 'Read') return isSupplierPath(input.file_path);
  if (event.tool_name === 'Grep') return grepReachesABid(input.path, event.cwd);
  if (event.tool_name === 'Bash' || event.tool_name === 'PowerShell') return bashOpensABid(input.command);
  return false;
}

function deny(reason) {
  return {
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason },
  };
}

const KEPT_OUT =
  `ArcKit keeps supplier documents out of this session while /arckit:evaluate or /arckit:score runs. ` +
  `Dispatch ${READER} for this vendor and score from its claims. ` +
  `A search must not reach vendors/: narrow its path. ` +
  `This stays on until another /command runs or the session is cleared.`;

const NOT_ARMED =
  `ArcKit couldn't switch on the gate that keeps supplier documents out of this session, because it can't write ` +
  `to the temp folder, so this command hasn't started. Fix the temp folder and run it again.`;

/** The PreToolUse decision for one call: a deny, or null to let it through. */
export function decide(event, { isolated }) {
  if (!isolated || !opensABid(event)) return null;
  if (event.agent_type && agentName(event.agent_type) === READER) return null;
  return deny(KEPT_OUT);
}

function markerPath(sessionId) {
  const name = createHash('sha256').update(String(sessionId)).digest('hex').slice(0, 32);
  return join(tmpdir(), `arckit-supplier-isolation-${name}`);
}

function setMarker(sessionId, on) {
  const path = markerPath(sessionId);
  if (on) writeFileSync(path, '', { mode: 0o600 });
  else rmSync(path, { force: true });
}

/** Switch the gate on. False if it can't be, so the command mustn't start without it. */
function arm(sessionId) {
  try {
    setMarker(sessionId, true);
    return true;
  } catch {
    return false;
  }
}

function main(event) {
  const id = event.session_id;
  if (!id) return null;
  if (event.hook_event_name === 'UserPromptSubmit') {
    if (isolatingCommand(event.prompt)) return arm(id) ? null : { decision: 'block', reason: NOT_ARMED };
    if (isSlashCommand(event.prompt)) setMarker(id, false);
    return null;
  }
  if (event.tool_name === 'Skill') {
    const skill = (event.tool_input || {}).skill;
    if (isolatingSkill(skill)) return arm(id) ? null : deny(NOT_ARMED);
    if (isArckitCommand(skill)) setMarker(id, false);
    return null;
  }
  return decide(event, { isolated: existsSync(markerPath(id)) });
}

if (isMainModule(import.meta.url)) {
  const event = parseHookInput();
  let out = null;
  try {
    out = main(event);
  } catch (e) {
    process.stderr.write(`[ArcKit] supplier isolation check failed: ${e.message}\n`);
    if (event.tool_name === 'Read' && isSupplierPath((event.tool_input || {}).file_path)) out = deny(KEPT_OUT);
  }
  if (out) process.stdout.write(JSON.stringify(out));
  process.exit(0);
}
