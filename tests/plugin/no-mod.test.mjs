/**
 * Core ArcKit ships no Claude Code mod.
 *
 * The Claude plugin directory holds any plugin that includes a mod (a hooks
 * module named by the `modules` key in hooks.json) for a content-policy
 * reviewer. The status band in `hooks/mod/` was the last hold on core in
 * 6.18.1, so it was removed. Every gate is a classic hook; keep it that way.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOKS_DIR = resolve(__dirname, '../../plugins/arckit-claude/hooks');

test('hooks.json names no hooks module', () => {
  const hooks = JSON.parse(readFileSync(resolve(HOOKS_DIR, 'hooks.json'), 'utf8'));
  assert.equal(hooks.modules, undefined, 'a `modules` entry makes the plugin directory hold core for review');
});

test('core carries no hooks/mod/ folder', () => {
  assert.equal(existsSync(resolve(HOOKS_DIR, 'mod')), false, 'hooks/mod/ is where a mod lives; core ships none');
});
