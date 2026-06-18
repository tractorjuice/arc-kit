#!/usr/bin/env node
/**
 * Regression tests for optional OKF frontmatter stamping in provenance-stamp.mjs.
 *
 * Run with: node tests/plugin/test_provenance_okf_frontmatter.mjs
 */

import { closeSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { parseFrontmatter } from '../../plugins/arckit-claude/hooks/okf-frontmatter.mjs';

const repoRoot = resolve(import.meta.dirname, '..', '..');
const HOOK = join(repoRoot, 'plugins', 'arckit-claude', 'hooks', 'provenance-stamp.mjs');

function makeRepo() {
  const root = join(tmpdir(), `arckit-okf-stamp-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const projectDir = join(root, 'projects', '001-demo');
  mkdirSync(projectDir, { recursive: true });
  const artifactPath = join(projectDir, 'ARC-001-REQ-v1.0.md');
  writeFileSync(artifactPath, '# Requirements\n\nBody.\n');
  return { root, artifactPath };
}

function runHook(root, artifactPath, env = {}) {
  const payloadPath = join(root, 'payload.json');
  writeFileSync(
    payloadPath,
    JSON.stringify({
      cwd: root,
      tool_name: 'Write',
      tool_input: {
        file_path: artifactPath,
      },
    })
  );
  const stdin = openSync(payloadPath, 'r');
  try {
    return spawnSync('node', [HOOK], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: [stdin, 'pipe', 'pipe'],
      env: {
        ...process.env,
        ARCKIT_OKF_FRONTMATTER: '',
        ...env,
      },
    });
  } finally {
    closeSync(stdin);
  }
}

test('provenance-stamp does not add OKF frontmatter unless opted in', () => {
  const { root, artifactPath } = makeRepo();
  try {
    const original = readFileSync(artifactPath, 'utf8');
    const result = runHook(root, artifactPath);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '');
    assert.equal(readFileSync(artifactPath, 'utf8'), original);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('provenance-stamp adds OKF frontmatter when config opts in', () => {
  const { root, artifactPath } = makeRepo();
  try {
    mkdirSync(join(root, '.arckit'), { recursive: true });
    writeFileSync(join(root, '.arckit', 'config.json'), JSON.stringify({ okfFrontmatter: true }));

    const result = runHook(root, artifactPath);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /OKF frontmatter stamped/);

    const content = readFileSync(artifactPath, 'utf8');
    const parsed = parseFrontmatter(content);
    assert.equal(parsed.error, null);
    assert.equal(parsed.data.type, 'Requirements');
    assert.equal(parsed.data.title, 'Requirements');
    assert.equal(parsed.data.resource, 'projects/001-demo/ARC-001-REQ-v1.0.md');
    assert.equal(parsed.data.arckit.document_id, 'ARC-001-REQ-v1.0');
    assert.equal(parsed.data.arckit.doc_type, 'REQ');

    const second = runHook(root, artifactPath);
    assert.equal(second.status, 0, second.stderr);
    assert.equal(second.stdout, '');
    assert.equal(readFileSync(artifactPath, 'utf8'), content);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('provenance-stamp accepts ARCKIT_OKF_FRONTMATTER=1', () => {
  const { root, artifactPath } = makeRepo();
  try {
    const result = runHook(root, artifactPath, { ARCKIT_OKF_FRONTMATTER: '1' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /OKF frontmatter stamped/);

    const parsed = parseFrontmatter(readFileSync(artifactPath, 'utf8'));
    assert.equal(parsed.data.arckit.source_path, 'projects/001-demo/ARC-001-REQ-v1.0.md');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
