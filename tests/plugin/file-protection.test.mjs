import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const HOOK = resolve('plugins/arckit-claude/hooks/file-protection.mjs');
const REPO = resolve('.');

function runHook(toolName, toolInput, cwd) {
  const input = JSON.stringify({ tool_name: toolName, cwd, tool_input: toolInput });
  const r = spawnSync('node', [HOOK], { input, encoding: 'utf-8', cwd });
  return r.stdout.trim() ? JSON.parse(r.stdout) : {};
}

function blocks(filePath, cwd, toolName = 'Write') {
  return runHook(toolName, { file_path: filePath, content: 'x' }, cwd).decision === 'block';
}

function makeRepo() {
  const root = mkdtempSync(join(tmpdir(), 'arckit-fp-'));
  mkdirSync(join(root, '.git'));
  writeFileSync(join(root, '.git', 'config'), '[core]\n');
  mkdirSync(join(root, 'docs'));
  mkdirSync(join(root, 'projects', '001-demo'), { recursive: true });
  return root;
}

test('symlink under docs/ pointing at .git/config is blocked', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  symlinkSync('../.git/config', join(root, 'docs', 'x.md'));
  assert.equal(blocks(join(root, 'docs', 'x.md'), root), true);
  assert.equal(blocks('docs/x.md', root, 'Edit'), true);
});

test('dangling symlink pointing at a missing .env is blocked', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  symlinkSync('../.env', join(root, 'docs', 'notes.md'));
  assert.equal(blocks(join(root, 'docs', 'notes.md'), root), true);
});

test('symlinked parent directory into .git is blocked', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  symlinkSync('../.git', join(root, 'docs', 'meta'), 'dir');
  assert.equal(blocks(join(root, 'docs', 'meta', 'hooks', 'pre-commit'), root), true);
});

test('symlink to a keyword-named file outside allowed directories is blocked', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  writeFileSync(join(root, 'api_key.txt'), 'x');
  symlinkSync('../api_key.txt', join(root, 'docs', 'readme.md'));
  assert.equal(blocks(join(root, 'docs', 'readme.md'), root), true);
});

for (const name of ['.env', '.env.staging', '.env.test', '.env.prod', '.ENV.Local']) {
  test(`${name} is blocked`, () => {
    assert.equal(blocks(join(REPO, name), REPO), true);
    assert.equal(blocks(join(REPO, 'projects', '001-demo', name), REPO), true);
  });
}

for (const name of ['.env.example', '.env.sample', '.env.template']) {
  test(`${name} placeholder is allowed`, () => {
    assert.equal(blocks(join(REPO, name), REPO), false);
  });
}

test('keyword file under a docs/ directory outside the repo is blocked', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const outside = mkdtempSync(join(tmpdir(), 'arckit-fp-out-'));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  assert.equal(blocks(join(outside, 'docs', 'api_key.txt'), root), true);
  assert.equal(blocks('/tmp/docs/api_key.txt', root), true);
});

test('allowed directories are anchored to the repo root', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.equal(blocks(join(root, 'docs', 'api-key-rotation.md'), root), false);
  assert.equal(blocks(join(root, 'projects', '001-demo', 'secret-management.md'), root), false);
  assert.equal(blocks(join(root, 'src', 'docs', 'api-key-rotation.md'), root), true);
  assert.equal(blocks(join(root, 'vendor', 'projects', 'secret-management.md'), root), true);
});

test('plugin directories are anchored to the plugin root', () => {
  assert.equal(blocks(join(REPO, 'plugins/arckit-claude/commands/secret-rotation.md'), REPO), false);
  assert.equal(blocks(join(REPO, 'plugins/arckit-claude/hooks/secret-detection.mjs'), REPO), false);
  assert.equal(blocks(join(REPO, 'other/arckit-claude/commands/secret-rotation.md'), REPO), true);
});

test('protected paths still win inside allowed directories', () => {
  assert.equal(blocks(join(REPO, 'docs', '.env.staging'), REPO), true);
  assert.equal(blocks(join(REPO, 'projects', '001-demo', 'server.pem'), REPO), true);
});

test('NotebookEdit notebook_path and MultiEdit are checked', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const out = runHook('NotebookEdit', { notebook_path: join(root, 'src', 'api_key.ipynb'), new_source: 'x' }, root);
  assert.equal(out.decision, 'block');
  assert.equal(blocks(join(root, '.env.staging'), root, 'MultiEdit'), true);
});

test('ordinary files and non-edit tools pass', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.equal(blocks(join(root, 'src', 'main.py'), root), false);
  assert.equal(blocks(join(root, 'docs', 'Mapping.md'), root), false);
  assert.equal(runHook('Read', { file_path: join(root, '.env') }, root).decision, undefined);
});

test('block reason names the resolved target of a symlink', (t) => {
  const root = makeRepo();
  t.after(() => rmSync(root, { recursive: true, force: true }));
  symlinkSync('../.git/config', join(root, 'docs', 'x.md'));
  const out = runHook('Write', { file_path: join(root, 'docs', 'x.md'), content: 'x' }, root);
  assert.match(out.reason, /Resolves to: .*\.git[\\/]config/);
});
