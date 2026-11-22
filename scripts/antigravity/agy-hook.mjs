#!/usr/bin/env node
/**
 * Runs ArcKit's Claude Code hooks inside Google Antigravity.
 *
 * Antigravity calls a hook with its own JSON on stdin and expects its own JSON
 * on stdout. ArcKit's gates are written for Claude Code's shapes. This adapter
 * sits between the two so the gates ship unchanged:
 *
 *     node ./hooks/agy-hook.mjs pre  validate-arc-filename file-protection ...
 *     node ./hooks/agy-hook.mjs post update-manifest
 *
 * Antigravity runs a plugin's hook commands with the plugin root as the
 * working directory, so the hook files are found beside this one.
 *
 * In (Antigravity):   { toolCall: { name, args }, workspacePaths, conversationId, ... }
 * Out, `pre`:         { decision: "allow" } or { decision: "deny", reason }
 * Out, `post`:        {}
 *
 * A `pre` run stops at the first gate that blocks. Antigravity ignores a hook
 * that exits non-zero, so this script always exits 0 and says what it decided
 * on stdout. A gate that crashes or times out while the file being written is
 * an ARC-* artefact is reported as a deny: on ArcKit's own artefacts a check
 * that could not run must not read as a pass.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(HERE, '..');
const GATE_TIMEOUT_MS = 20000;

/** Antigravity's file-writing tools, as the Claude Code tool each one stands for. */
const TOOL_MAP = {
  write_to_file: 'Write',
  replace_file_content: 'Edit',
  multi_replace_file_content: 'Edit',
};

function out(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
  process.exit(0);
}

/** Build the input a Claude Code hook expects from an Antigravity payload. */
export function toClaudeInput(payload, eventName) {
  const call = (payload && payload.toolCall) || {};
  const args = call.args && typeof call.args === 'object' ? call.args : {};
  const tool = TOOL_MAP[call.name];
  const target = typeof args.TargetFile === 'string' ? args.TargetFile : '';
  if (!tool || !target) return null;

  const workspaces = Array.isArray(payload.workspacePaths) ? payload.workspacePaths.filter((p) => typeof p === 'string') : [];
  // The workspace the file is in, or the first one, or the file's own folder.
  const cwd =
    workspaces.find((w) => isAbsolute(target) && resolve(target).startsWith(resolve(w) + '/')) ||
    workspaces[0] ||
    (isAbsolute(target) ? dirname(target) : process.cwd());

  const toolInput = { file_path: isAbsolute(target) ? target : resolve(cwd, target) };
  if (call.name === 'write_to_file') {
    toolInput.content = typeof args.CodeContent === 'string' ? args.CodeContent : '';
  } else if (call.name === 'replace_file_content') {
    toolInput.old_string = typeof args.TargetContent === 'string' ? args.TargetContent : '';
    toolInput.new_string = typeof args.ReplacementContent === 'string' ? args.ReplacementContent : '';
  } else {
    const chunks = Array.isArray(args.ReplacementChunks) ? args.ReplacementChunks : [];
    toolInput.old_string = chunks.map((c) => (c && c.TargetContent) || '').join('\n');
    toolInput.new_string = chunks.map((c) => (c && c.ReplacementContent) || '').join('\n');
  }

  return {
    hook_event_name: eventName,
    tool_name: tool,
    tool_input: toolInput,
    cwd,
    session_id: typeof payload.conversationId === 'string' ? payload.conversationId : '',
  };
}

/** Read a Claude Code hook's verdict from what it printed. */
export function readVerdict(stdout) {
  const text = (stdout || '').trim();
  if (!text) return { blocked: false };
  let data;
  try {
    data = JSON.parse(text.split('\n').filter(Boolean).pop());
  } catch {
    return { blocked: false, unparsed: true };
  }
  const specific = (data && data.hookSpecificOutput) || {};
  if (data && (data.decision === 'block' || specific.permissionDecision === 'deny')) {
    return { blocked: true, reason: data.reason || specific.permissionDecisionReason || 'Blocked by an ArcKit check.' };
  }
  return { blocked: false };
}

function runHook(name, input) {
  if (!/^[a-z0-9-]+$/.test(name)) return { status: 1, stdout: '', error: 'bad hook name' };
  const res = spawnSync(process.execPath, [join(HERE, `${name}.mjs`)], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    timeout: GATE_TIMEOUT_MS,
    cwd: input.cwd,
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT, CLAUDE_PROJECT_DIR: input.cwd },
  });
  return { status: res.status, stdout: res.stdout || '', error: res.error ? String(res.error.message || res.error) : '' };
}

function main() {
  const [mode, ...hooks] = process.argv.slice(2);
  const pass = mode === 'pre' ? { decision: 'allow' } : {};

  let payload;
  try {
    payload = JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    out(pass);
  }
  const input = toClaudeInput(payload, mode === 'pre' ? 'PreToolUse' : 'PostToolUse');
  if (!input) out(pass);

  const isArtefact = basename(input.tool_input.file_path).startsWith('ARC-');

  for (const name of hooks) {
    const res = runHook(name, input);
    if (mode !== 'pre') continue;
    if (res.status !== 0) {
      if (isArtefact) {
        out({
          decision: 'deny',
          reason: `ArcKit: the ${name} check could not run (${res.error || 'exit ' + res.status}), so this write to an ARC artefact was stopped. Check that Node.js 18 or later is installed, then retry.`,
        });
      }
      continue;
    }
    const verdict = readVerdict(res.stdout);
    // The gates' messages name the assistant they were written for.
    if (verdict.blocked) out({ decision: 'deny', reason: String(verdict.reason).replaceAll('Claude Code', 'Antigravity') });
  }
  out(pass);
}

// Run only when Node was asked to run this file, so tests can import it.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
