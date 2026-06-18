#!/usr/bin/env node
/**
 * Regression tests for plugins/arckit-claude/scripts/export-okf.mjs.
 *
 * Run with: node tests/plugin/test_export_okf.mjs
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { exportOkf, parseArgs } from '../../plugins/arckit-claude/scripts/export-okf.mjs';
import { parseFrontmatter } from '../../plugins/arckit-claude/hooks/okf-frontmatter.mjs';

function makeRepo() {
  const root = mkdtempRoot();
  mkdirSync(join(root, 'projects', '001-demo', 'decisions'), { recursive: true });
  mkdirSync(join(root, 'projects', '001-demo', 'research'), { recursive: true });
  mkdirSync(join(root, 'projects', '002-other'), { recursive: true });

  writeFileSync(
    join(root, 'projects', '001-demo', 'ARC-001-REQ-v1.0.md'),
    '# Requirements\n\nThe service shall retain governance evidence.\n'
  );
  writeFileSync(
    join(root, 'projects', '001-demo', 'decisions', 'ARC-001-ADR-001-v1.0.md'),
    `---
owner: Jane Doe
arckit:
  custom_key: keep-me
---
# Use PostgreSQL

Decision body.
`
  );
  writeFileSync(
    join(root, 'projects', '001-demo', 'research', 'ARC-001-RSCH-012-v2.0.md'),
    '# Vendor Research\n\nResearch body.\n'
  );
  writeFileSync(
    join(root, 'projects', '001-demo', 'ARC-001-FOO-v1.0.md'),
    '# Custom Artifact\n\nCustom body.\n'
  );
  writeFileSync(
    join(root, 'projects', '002-other', 'ARC-002-REQ-v1.0.md'),
    '# Other Requirements\n\nOther body.\n'
  );
  return root;
}

function mkdtempRoot() {
  const root = join(tmpdir(), `arckit-okf-export-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(root, { recursive: true });
  return root;
}

function readExported(root, relativePath) {
  return readFileSync(join(root, 'okf', relativePath), 'utf8');
}

test('parseArgs requires exactly one project selector', () => {
  assert.deepEqual(parseArgs(['--project', '001', '--out', 'okf/001']), {
    all: false,
    project: '001',
    out: 'okf/001',
    cwd: process.cwd(),
  });
  assert.throws(() => parseArgs([]), /provide --all or --project/);
  assert.throws(() => parseArgs(['--all', '--project', '001']), /choose either --all or --project/);
  assert.throws(() => parseArgs(['--project', '001', '--out']), /--out requires a path/);
});

test('exportOkf copies one project with OKF frontmatter and index files', () => {
  const root = makeRepo();
  try {
    const summary = exportOkf({ all: false, project: '001', out: 'okf', cwd: root });

    assert.equal(summary.ok, true);
    assert.equal(summary.artifact_count, 4);
    assert.deepEqual(summary.projects, ['001-demo']);
    assert.equal(summary.warnings.length, 0);
    assert.ok(existsSync(join(root, 'okf', 'index.md')));
    assert.ok(existsSync(join(root, 'okf', 'log.md')));
    assert.ok(!existsSync(join(root, 'okf', 'projects', '002-other', 'ARC-002-REQ-v1.0.md')));

    const req = parseFrontmatter(readExported(root, 'projects/001-demo/ARC-001-REQ-v1.0.md'));
    assert.equal(req.error, null);
    assert.equal(req.data.type, 'Requirements');
    assert.equal(req.data.title, 'Requirements');
    assert.equal(req.data.resource, 'projects/001-demo/ARC-001-REQ-v1.0.md');
    assert.equal(req.data.arckit.document_id, 'ARC-001-REQ-v1.0');
    assert.equal(req.data.arckit.doc_type, 'REQ');
    assert.equal(req.data.arckit.project, '001-demo');
    assert.ok(req.data.tags.includes('arckit'));
    assert.ok(req.data.tags.includes('req'));

    const adr = parseFrontmatter(readExported(root, 'projects/001-demo/decisions/ARC-001-ADR-001-v1.0.md'));
    assert.equal(adr.data.owner, 'Jane Doe');
    assert.equal(adr.data.arckit.custom_key, 'keep-me');
    assert.equal(adr.data.arckit.document_id, 'ARC-001-ADR-001-v1.0');
    assert.equal(adr.data.arckit.doc_type, 'ADR');
    assert.equal(adr.data.title, 'Use PostgreSQL');

    const research = parseFrontmatter(readExported(root, 'projects/001-demo/research/ARC-001-RSCH-012-v2.0.md'));
    assert.equal(research.data.arckit.doc_type, 'RSCH');
    assert.equal(research.data.arckit.version, '2.0');

    const custom = parseFrontmatter(readExported(root, 'projects/001-demo/ARC-001-FOO-v1.0.md'));
    assert.equal(custom.data.type, 'ArcKit FOO Artifact');
    assert.equal(custom.data.arckit.doc_type, 'FOO');

    const source = readFileSync(join(root, 'projects', '001-demo', 'ARC-001-REQ-v1.0.md'), 'utf8');
    assert.equal(source, '# Requirements\n\nThe service shall retain governance evidence.\n');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('exportOkf supports --all and rejects ambiguous short project selectors', () => {
  const root = makeRepo();
  try {
    mkdirSync(join(root, 'projects', '001-copy'), { recursive: true });
    writeFileSync(join(root, 'projects', '001-copy', 'ARC-001-REQ-v1.0.md'), '# Copy\n');

    assert.throws(() => exportOkf({ all: false, project: '001', out: 'okf', cwd: root }), /project is ambiguous/);

    const summary = exportOkf({ all: true, project: null, out: 'okf-all', cwd: root });
    assert.equal(summary.artifact_count, 6);
    assert.deepEqual(summary.projects, ['001-copy', '001-demo', '002-other']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
