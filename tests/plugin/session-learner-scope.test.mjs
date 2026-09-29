/**
 * session-learner.mjs counts only artefacts under the repository's own
 * top-level projects/ directory.
 *
 * Before, any committed file named ARC-NNN-* counted, wherever it lived. The
 * ArcKit repository commits eval fixtures such as
 * plugins/arckit-claude/evals/fixtures/.../projects/001-benefits-portal/
 * ARC-001-STKE-v1.0.md, and the end-of-turn nudge then told the maintainer
 * that "project 001" had stakeholders but no requirements.
 *
 * NOTE the filename: CI runs `tests/plugin/*.test.mjs`.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const HOOK = resolve('plugins/arckit-claude/hooks/session-learner.mjs');

function git(cwd, ...args) {
  const r = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', ...args], { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`);
}

function runWith(relPath) {
  const dir = mkdtempSync(join(tmpdir(), 'arckit-learner-'));
  try {
    git(dir, 'init', '-q');
    mkdirSync(join(dir, '.arckit', 'memory'), { recursive: true });
    writeFileSync(join(dir, '.arckit', 'memory', '.cc-version'), '2.1.284\n');
    mkdirSync(join(dir, 'projects'), { recursive: true });
    mkdirSync(join(dir, dirname(relPath)), { recursive: true });
    writeFileSync(join(dir, relPath), '# Stakeholders\n');
    git(dir, 'add', '-A');
    git(dir, 'commit', '-q', '-m', 'add stakeholders');
    const env = { ...process.env };
    delete env.ARCKIT_NO_NUDGE;
    const r = spawnSync('node', [HOOK], {
      cwd: dir, env, encoding: 'utf8',
      input: JSON.stringify({ cwd: dir, hook_event_name: 'Stop', session_id: 't' }),
    });
    assert.equal(r.status, 0, r.stderr);
    return r.stdout;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('a stakeholder analysis under projects/ triggers the requirements nudge', () => {
  const out = runWith('projects/001-portal/ARC-001-STKE-v1.0.md');
  assert.match(out, /project `001` has stakeholder analysis but no requirements/);
});

test('the same file inside an eval fixture triggers nothing', () => {
  const out = runWith('plugins/arckit-claude/evals/fixtures/demo/projects/001-portal/ARC-001-STKE-v1.0.md');
  assert.doesNotMatch(out, /project `001`/);
});
