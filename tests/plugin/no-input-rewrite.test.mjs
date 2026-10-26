/**
 * No ArcKit hook approves its own actions or rewrites a tool call.
 *
 * The Claude plugin directory declined the core plugin twice (6.17.1, 6.17.2)
 * with "This plugin grants itself permissions". 6.17.2 removed the last hook
 * that returned `allow`; the scan still flagged three PreToolUse entries,
 * which were the hooks that rewrote a tool's input. From 6.17.3:
 *
 *   - project context reaches ArcKit subagents through SubagentStart
 *     `additionalContext` (inject-agent-context.mjs), not a rewritten prompt;
 *   - a misnamed artefact is blocked with the corrected path in the reason
 *     (validate-arc-filename.mjs), not silently moved;
 *   - reader hand-backs pass untouched or are denied (covered in
 *     validate-reader-handoff.test.mjs).
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PLUGIN = resolve(__dirname, '../../plugins/arckit-claude');
const HOOKS_DIR = resolve(PLUGIN, 'hooks');
const hooksJson = JSON.parse(readFileSync(resolve(HOOKS_DIR, 'hooks.json'), 'utf8')).hooks;
const scriptsFor = (event) => [...new Set((hooksJson[event] || []).flatMap((g) =>
  g.hooks.map((h) => (h.args || [])[0]).filter(Boolean).map((a) => a.split('/').pop())))];

const { decide: injectDecide, wantsContext } = await import(resolve(HOOKS_DIR, 'inject-agent-context.mjs'));

function arcRepo() {
  const root = mkdtempSync(join(tmpdir(), 'arckit-norewrite-'));
  mkdirSync(join(root, 'projects', '001-payments'), { recursive: true });
  return root;
}

test('no PreToolUse hook rewrites tool input or returns allow', () => {
  const scripts = scriptsFor('PreToolUse');
  assert.ok(scripts.length > 0);
  for (const script of scripts) {
    const source = readFileSync(resolve(HOOKS_DIR, script), 'utf8');
    assert.doesNotMatch(source, /updatedInput/, `${script} rewrites tool input`);
    assert.doesNotMatch(source, /permissionDecision:\s*['"]allow['"]/, `${script} approves a tool call`);
    assert.doesNotMatch(source, /decision:\s*['"]approve['"]/, `${script} approves a tool call`);
  }
});

test('project context is injected at SubagentStart, not by rewriting the Agent call', () => {
  assert.ok(!(hooksJson.PreToolUse || []).some((g) => g.matcher === 'Agent'), 'no PreToolUse hook on Agent');
  assert.deepEqual(scriptsFor('SubagentStart'), ['inject-agent-context.mjs']);
  // Claude Code treats a matcher made only of letters, digits, '-', '_' and '|'
  // as exact names, so a bare "arckit-" never fired (found live on v2.1.284:
  // the framework agent saw no projects). It must be a real regex that
  // matches the plugin-scoped agent_type Claude Code sends.
  const matcher = hooksJson.SubagentStart[0].matcher;
  assert.match(matcher, /[\^$.*+?()[\]{}\\]/, `"${matcher}" would be read as an exact name`);
  assert.match('arckit:arckit-framework', new RegExp(matcher));
});

test('ArcKit subagents get context in both name forms; readers, writers and other agents do not', () => {
  assert.equal(wantsContext('arckit:arckit-framework'), true);
  assert.equal(wantsContext('arckit-framework'), true);
  assert.equal(wantsContext('arckit:arckit-research-reader'), false);
  assert.equal(wantsContext('arckit:arckit-research-writer'), false);
  assert.equal(wantsContext('Explore'), false);
  assert.equal(wantsContext('other-plugin:arckit-lookalike'), false, 'another plugin\'s agent');
  assert.equal(wantsContext(undefined), false);
});

test('SubagentStart output carries the project context as additionalContext', () => {
  const root = arcRepo();
  try {
    const out = injectDecide(
      { hook_event_name: 'SubagentStart', agent_type: 'arckit:arckit-framework', cwd: root },
      () => 'PROJECT CONTEXT',
    );
    assert.deepEqual(out, { hookSpecificOutput: { hookEventName: 'SubagentStart', additionalContext: 'PROJECT CONTEXT' } });
    assert.equal(injectDecide({ hook_event_name: 'SubagentStart', agent_type: 'arckit:arckit-tenders-reader', cwd: root }, () => 'x'), null);
    assert.equal(injectDecide({ hook_event_name: 'SubagentStart', agent_type: 'arckit:arckit-framework', cwd: tmpdir() }, () => 'x'), null, 'no projects/, no context');
    assert.equal(injectDecide({ hook_event_name: 'PreToolUse', agent_type: 'arckit:arckit-framework', cwd: root }, () => 'x'), null);

    const r = spawnSync('node', [resolve(HOOKS_DIR, 'inject-agent-context.mjs')], {
      input: JSON.stringify({ hook_event_name: 'SubagentStart', agent_type: 'arckit:arckit-framework', cwd: root }),
      encoding: 'utf8',
    });
    assert.equal(r.status, 0, r.stderr);
    const printed = JSON.parse(r.stdout);
    assert.equal(printed.hookSpecificOutput.hookEventName, 'SubagentStart');
    assert.match(printed.hookSpecificOutput.additionalContext, /001-payments/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a misnamed artefact is blocked with the corrected path, never moved', () => {
  const root = arcRepo();
  try {
    const run = (filePath) => {
      const r = spawnSync('node', [resolve(HOOKS_DIR, 'validate-arc-filename.mjs')], {
        input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath, content: '# x' }, cwd: root }),
        encoding: 'utf8',
      });
      assert.equal(r.status, 0, r.stderr);
      return r.stdout.trim() ? JSON.parse(r.stdout) : null;
    };
    const project = join(root, 'projects', '001-payments');

    const padded = run(join(project, 'ARC-1-REQ-v1.md'));
    assert.equal(padded.decision, 'block');
    assert.ok(padded.reason.includes(join(project, 'ARC-001-REQ-v1.0.md')), padded.reason);
    assert.ok(!('updatedInput' in padded));

    const adr = run(join(project, 'ARC-001-ADR-v1.0.md'));
    assert.equal(adr.decision, 'block');
    assert.ok(adr.reason.includes(join(project, 'decisions', 'ARC-001-ADR-001-v1.0.md')), adr.reason);

    assert.equal(run(join(project, 'ARC-001-REQ-v1.0.md')), null, 'a correct name passes');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
