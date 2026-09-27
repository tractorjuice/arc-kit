/**
 * allow-mcp-tools.mjs: the PermissionRequest hook that auto-approves ArcKit's
 * bundled, read-only MCP documentation servers.
 *
 * Until 6.16.3 it never approved anything, for three reasons the Claude plugin
 * directory's validator surfaced:
 *   1. it listed only mcp__<server>__ names, but a plugin's own servers are
 *      named mcp__plugin_arckit_<server>__;
 *   2. it printed a top-level {"decision":"allow"}, which Claude Code ignores
 *      (a top-level decision only accepts "block"; PermissionRequest wants
 *      hookSpecificOutput.decision.behavior);
 *   3. it exited 1 on no match, which Claude Code logs as a hook error.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const HOOK = resolve('plugins/arckit-claude/hooks/allow-mcp-tools.mjs');

function run(toolName) {
  const r = spawnSync('node', [HOOK], {
    input: JSON.stringify({ hook_event_name: 'PermissionRequest', tool_name: toolName }),
    encoding: 'utf8',
  });
  return { status: r.status, out: r.stdout.trim() ? JSON.parse(r.stdout) : null };
}

const SERVERS = [
  'aws-knowledge',
  'microsoft-learn',
  'google-developer-knowledge',
  'datacommons-mcp',
  'govreposcrape',
  'uk-tenders',
];

for (const server of SERVERS) {
  test(`approves the plugin's own ${server} server`, () => {
    const { status, out } = run(`mcp__plugin_arckit_${server}__some_tool`);
    assert.equal(status, 0);
    assert.deepEqual(out, {
      hookSpecificOutput: {
        hookEventName: 'PermissionRequest',
        decision: { behavior: 'allow' },
      },
    });
  });
}

test('approves a hand-added server under the same key', () => {
  assert.equal(run('mcp__govreposcrape__search_uk_gov_code').out.hookSpecificOutput.decision.behavior, 'allow');
});

test('every bundled MCP server in .mcp.json is covered', async () => {
  const { readFileSync } = await import('node:fs');
  const mcp = JSON.parse(readFileSync(resolve('plugins/arckit-claude/.mcp.json'), 'utf8'));
  for (const server of Object.keys(mcp.mcpServers)) {
    assert.ok(SERVERS.includes(server), `${server} is bundled but this test does not cover it`);
    assert.ok(run(`mcp__plugin_arckit_${server}__x`).out, `${server} is not approved`);
  }
});

test('other tools get no decision and exit 0', () => {
  for (const tool of ['Bash', 'Read', 'mcp__plugin_other_server__tool', 'mcp__plugin_arckit_unknown__tool']) {
    const { status, out } = run(tool);
    assert.equal(status, 0, `${tool} exited ${status}`);
    assert.equal(out, null, `${tool} got a decision`);
  }
});

test('empty or malformed input exits 0 with no decision', () => {
  for (const input of ['', 'not json']) {
    const r = spawnSync('node', [HOOK], { input, encoding: 'utf8' });
    assert.equal(r.status, 0);
    assert.equal(r.stdout.trim(), '');
  }
});
