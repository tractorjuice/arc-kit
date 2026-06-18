#!/usr/bin/env node
/**
 * Unit tests for OKF frontmatter helpers.
 *
 * Run with: node tests/plugin/test_okf_frontmatter.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildOkfFieldsForArcArtifact,
  extractArcMetadataFromPath,
  extractDocTypeFromFilename,
  extractFirstHeading,
  mergeOkfFrontmatter,
  parseFrontmatter,
  stripFrontmatter,
} from '../../plugins/arckit-claude/hooks/okf-frontmatter.mjs';

test('mergeOkfFrontmatter adds frontmatter to a plain ARC artifact', () => {
  const body = '# Decision\n\nUse PostgreSQL.\n';
  const merged = mergeOkfFrontmatter(body, {
    type: 'Architecture Decision Record',
    title: 'Decision',
    tags: ['arckit', 'adr'],
    arckit: {
      document_id: 'ARC-001-ADR-001-v1.0',
      doc_type: 'ADR',
    },
  });

  const parsed = parseFrontmatter(merged);
  assert.equal(parsed.error, null);
  assert.equal(parsed.data.type, 'Architecture Decision Record');
  assert.equal(parsed.data.title, 'Decision');
  assert.deepEqual(parsed.data.tags, ['arckit', 'adr']);
  assert.equal(parsed.data.arckit.document_id, 'ARC-001-ADR-001-v1.0');
  assert.equal(parsed.body, body);
});

test('mergeOkfFrontmatter preserves unknown top-level and arckit keys', () => {
  const content = `---
owner: Jane Doe
arckit:
  custom_key: keep-me
  document_id: ARC-001-ADR-001-v1.0
---
# Existing
`;

  const merged = mergeOkfFrontmatter(content, {
    title: 'Updated',
    arckit: {
      document_id: 'ARC-001-ADR-001-v1.1',
      doc_type: 'ADR',
    },
  });
  const parsed = parseFrontmatter(merged);

  assert.equal(parsed.data.owner, 'Jane Doe');
  assert.equal(parsed.data.title, 'Updated');
  assert.equal(parsed.data.arckit.custom_key, 'keep-me');
  assert.equal(parsed.data.arckit.document_id, 'ARC-001-ADR-001-v1.1');
  assert.equal(parsed.data.arckit.doc_type, 'ADR');
});

test('stripFrontmatter and extractFirstHeading ignore frontmatter only at file top', () => {
  const content = `---
title: Frontmatter Title
---

# Body Title

\`\`\`yaml
---
not: frontmatter
---
\`\`\`
`;

  assert.equal(extractFirstHeading(content), 'Body Title');
  assert.ok(stripFrontmatter(content).startsWith('\n# Body Title'));

  const noFrontmatter = '# Body\n\n---\nnot: frontmatter\n---\n';
  assert.equal(extractFirstHeading(noFrontmatter), 'Body');
  assert.equal(stripFrontmatter(noFrontmatter), noFrontmatter);
});

test('malformed frontmatter fails closed and merge returns original content', () => {
  const content = `---
title: Missing close
# Body
`;
  const parsed = parseFrontmatter(content);
  assert.equal(parsed.hasFrontmatter, false);
  assert.equal(parsed.error, 'unterminated frontmatter');
  assert.equal(mergeOkfFrontmatter(content, { title: 'Should not write' }), content);
});

test('extractDocTypeFromFilename handles simple, compound and multi-instance names', () => {
  assert.equal(extractDocTypeFromFilename('ARC-001-REQ-v1.0.md'), 'REQ');
  assert.equal(extractDocTypeFromFilename('ARC-001-PRIN-COMP-v1.0.md'), 'PRIN-COMP');
  assert.equal(extractDocTypeFromFilename('ARC-001-ADR-001-v1.0.md'), 'ADR');
  assert.equal(extractDocTypeFromFilename('ARC-001-RSCH-012-v2.0.md'), 'RSCH');
});

test('extractArcMetadataFromPath derives ArcKit metadata from project path', () => {
  const meta = extractArcMetadataFromPath('/repo/projects/001-demo/decisions/ARC-001-ADR-001-v1.0.md');
  assert.equal(meta.documentId, 'ARC-001-ADR-001-v1.0');
  assert.equal(meta.projectNumber, '001');
  assert.equal(meta.project, '001-demo');
  assert.equal(meta.docType, 'ADR');
  assert.equal(meta.category, 'Architecture');
  assert.equal(meta.version, '1.0');
  assert.ok(meta.tags.includes('arckit'));
  assert.ok(meta.tags.includes('adr'));
});

test('buildOkfFieldsForArcArtifact maps ARC artifact to OKF fields', () => {
  const fields = buildOkfFieldsForArcArtifact({
    filePath: '/repo/projects/001-demo/ARC-001-REQ-v1.0.md',
    resource: 'projects/001-demo/ARC-001-REQ-v1.0.md',
    timestamp: '2026-06-18T00:00:00.000Z',
    content: '# Requirements\n\nBody.\n',
  });

  assert.equal(fields.type, 'Requirements');
  assert.equal(fields.title, 'Requirements');
  assert.equal(fields.resource, 'projects/001-demo/ARC-001-REQ-v1.0.md');
  assert.equal(fields.timestamp, '2026-06-18T00:00:00.000Z');
  assert.equal(fields.arckit.document_id, 'ARC-001-REQ-v1.0');
  assert.equal(fields.arckit.doc_type, 'REQ');
  assert.equal(fields.arckit.project, '001-demo');
  assert.equal(fields.arckit.source_path, 'projects/001-demo/ARC-001-REQ-v1.0.md');
});

