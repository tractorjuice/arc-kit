#!/usr/bin/env node
/**
 * Regression tests for plugins/arckit-claude/hooks/update-manifest.mjs.
 *
 * Run with: node tests/plugin/test_update_manifest.mjs
 */

import { closeSync, mkdtempSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

const repoRoot = resolve(import.meta.dirname, '..', '..');
const HOOK = join(repoRoot, 'plugins', 'arckit-claude', 'hooks', 'update-manifest.mjs');

function writePayload(root, filePath, payloadName = 'payload.json') {
  const payloadPath = join(root, payloadName);
  writeFileSync(
    payloadPath,
    JSON.stringify({
      cwd: root,
      tool_name: 'Write',
      tool_input: {
        file_path: filePath,
        content: readFileSync(filePath, 'utf8'),
      },
    })
  );
  return payloadPath;
}

function runHook(payloadPath) {
  const stdin = openSync(payloadPath, 'r');
  try {
    const result = spawnSync('node', [HOOK], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: [stdin, 'pipe', 'pipe'],
    });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  } finally {
    closeSync(stdin);
  }
}

test('update-manifest tolerates global manifest entries missing documentId', () => {
  const root = mkdtempSync(join(tmpdir(), 'arckit-manifest-global-'));
  try {
    const globalDir = join(root, 'projects', '000-global');
    const docsDir = join(root, 'docs');
    mkdirSync(globalDir, { recursive: true });
    mkdirSync(docsDir, { recursive: true });

    const artifactPath = join(globalDir, 'ARC-000-PRIN-v1.1.md');
    writeFileSync(artifactPath, '# Principles\n');
    writeFileSync(
      join(docsDir, 'manifest.json'),
      JSON.stringify({
        generated: '2026-01-01T00:00:00.000Z',
        global: [
          {
            path: 'projects/000-global/ARC-000-PRIN-v1.0.md',
            title: 'Legacy principles entry',
          },
        ],
        projects: [],
      })
    );

    runHook(writePayload(root, artifactPath));

    const manifest = JSON.parse(readFileSync(join(docsDir, 'manifest.json'), 'utf8'));
    assert.equal(manifest.global.length, 1);
    assert.equal(manifest.global[0].documentId, 'ARC-000-PRIN-v1.1');
    assert.equal(manifest.defaultDocument, 'projects/000-global/ARC-000-PRIN-v1.1.md');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('update-manifest tolerates project manifest entries missing documentId', () => {
  const root = mkdtempSync(join(tmpdir(), 'arckit-manifest-project-'));
  try {
    const projectDir = join(root, 'projects', '001-demo');
    const docsDir = join(root, 'docs');
    mkdirSync(projectDir, { recursive: true });
    mkdirSync(docsDir, { recursive: true });

    const artifactPath = join(projectDir, 'ARC-001-REQ-v1.1.md');
    writeFileSync(artifactPath, '# Requirements\n');
    writeFileSync(
      join(docsDir, 'manifest.json'),
      JSON.stringify({
        generated: '2026-01-01T00:00:00.000Z',
        projects: [
          {
            id: '001-demo',
            name: 'Demo',
            documents: [
              {
                path: 'projects/001-demo/ARC-001-REQ-v1.0.md',
                title: 'Legacy requirements entry',
              },
            ],
          },
        ],
      })
    );

    runHook(writePayload(root, artifactPath));

    const manifest = JSON.parse(readFileSync(join(docsDir, 'manifest.json'), 'utf8'));
    const project = manifest.projects.find(p => p.id === '001-demo');
    assert.equal(project.documents.length, 1);
    assert.equal(project.documents[0].documentId, 'ARC-001-REQ-v1.1');
    assert.equal(project.documents[0].path, 'projects/001-demo/ARC-001-REQ-v1.1.md');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('update-manifest uses frontmatter title for subdirectory artifacts without headings', () => {
  const root = mkdtempSync(join(tmpdir(), 'arckit-manifest-frontmatter-title-'));
  try {
    const decisionsDir = join(root, 'projects', '001-demo', 'decisions');
    const docsDir = join(root, 'docs');
    mkdirSync(decisionsDir, { recursive: true });
    mkdirSync(docsDir, { recursive: true });

    const artifactPath = join(decisionsDir, 'ARC-001-ADR-001-v1.0.md');
    writeFileSync(
      artifactPath,
      `---
title: Frontmatter Decision Title
type: Architecture Decision Record
---

Decision body without an h1.
`
    );
    writeFileSync(
      join(docsDir, 'manifest.json'),
      JSON.stringify({
        generated: '2026-01-01T00:00:00.000Z',
        projects: [],
      })
    );

    runHook(writePayload(root, artifactPath));

    const manifest = JSON.parse(readFileSync(join(docsDir, 'manifest.json'), 'utf8'));
    const project = manifest.projects.find(p => p.id === '001-demo');
    assert.equal(project.decisions.length, 1);
    assert.equal(project.decisions[0].title, 'Frontmatter Decision Title');
    assert.equal(project.decisions[0].documentId, 'ARC-001-ADR-001-v1.0');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
