#!/usr/bin/env node
/**
 * Smoke tests for plugins/arckit-claude/hooks/graph-utils.mjs
 *
 * Verifies:
 *   1. v1 default output (no opts) is byte-stable — only the v1 keys appear on nodes.
 *   2. Opt flags add the expected enrichments and aggregations.
 *
 * Run with:  node tests/plugin/test_graph_utils.mjs
 */

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  scanAllArtifacts,
} from '../../plugins/arckit-claude/hooks/graph-utils.mjs';

// ── Fixture builder ────────────────────────────────────────────────────────

function makeFixture() {
  const root = mkdtempSync(join(tmpdir(), 'arckit-graph-'));
  const projectsDir = join(root, 'projects');

  const project = '001-fixture';
  const projectDir = join(projectsDir, project);
  mkdirSync(join(projectDir, 'decisions'), { recursive: true });
  mkdirSync(join(projectDir, 'reviews'), { recursive: true });
  mkdirSync(join(projectDir, 'vendors', 'acme', 'reviews'), { recursive: true });
  mkdirSync(join(projectDir, 'external'), { recursive: true });
  mkdirSync(join(projectDir, 'external', '7. RFI'), { recursive: true });

  const globalDir = join(projectsDir, '000-global');
  mkdirSync(globalDir, { recursive: true });

  const docCtl = (id, type, fields = {}) => `# ${type} — ${id}

| Field | Value |
|---|---|
| **Document ID** | ${id} |
| **Document Type** | ${type} |
| **Status** | ${fields.Status || 'DRAFT'} |
| **Version** | 1.0 |
| **Created Date** | 2026-01-01 |
| **Last Modified** | 2026-01-15 |
| **Owner** | ${fields.Owner || 'EA Team'} |
| **Classification** | ${fields.Classification || 'OFFICIAL'} |

## Body

`;

  // Requirements doc
  writeFileSync(
    join(projectDir, 'ARC-001-REQ-v1.0.md'),
    docCtl('ARC-001-REQ-v1.0', 'REQ') +
      `### BR-001: Provide ingest pipeline\n\n| Priority | MUST |\n\n` +
      `### FR-002: Accept JSON payloads\n\n| Priority | SHOULD |\n\n` +
      `Cross-ref to ARC-001-ADR-001.\n`
  );

  // ADR doc
  writeFileSync(
    join(projectDir, 'decisions', 'ARC-001-ADR-001-v1.0.md'),
    docCtl('ARC-001-ADR-001-v1.0', 'ADR', { Status: 'Proposed' }) +
      `## Status\n\nProposed\n\nReferences BR-001 and FR-002.\n`
  );

  // Vendor HLD
  writeFileSync(
    join(projectDir, 'vendors', 'acme', 'ARC-001-HLD-v1.0.md'),
    docCtl('ARC-001-HLD-v1.0', 'HLD') + `Implements BR-001.\n`
  );

  // Vendor review
  writeFileSync(
    join(projectDir, 'vendors', 'acme', 'reviews', 'ARC-001-HLDR-001-v1.0.md'),
    docCtl('ARC-001-HLDR-001-v1.0', 'HLDR') +
      `Verdict: APPROVED WITH CONDITIONS\n`
  );

  // External file
  writeFileSync(join(projectDir, 'external', 'spec.api.yaml'), 'openapi: 3.0\n');
  writeFileSync(join(projectDir, 'external', '7. RFI', 'RFI_CAP_CoreBancario_v1.docx'), 'rfi\n');
  writeFileSync(join(projectDir, 'external', 'meeting-transcript.vtt'), 'WEBVTT\n\n00:00:00.000 --> 00:00:03.000\nArchitecture board discussion.\n');
  writeFileSync(join(projectDir, 'external', 'walkthrough-subtitles.srt'), '1\n00:00:00,000 --> 00:00:03,000\nLegacy platform walkthrough.\n');

  // Global PRIN
  writeFileSync(
    join(globalDir, 'ARC-000-PRIN-v1.0.md'),
    docCtl('ARC-000-PRIN-v1.0', 'PRIN') +
      `## 1. Security Principles\n\n### 1. Least privilege\n\n**Principle Statement**: only grant minimum access.\n`
  );

  // RISK doc (basic)
  writeFileSync(
    join(projectDir, 'ARC-001-RISK-v1.0.md'),
    docCtl('ARC-001-RISK-v1.0', 'RISK') +
      `### R-001: Vendor lock-in\n\n| Likelihood | Medium |\n| Impact | High |\n`
  );

  return { root, projectsDir, project };
}

// ── Tests ──────────────────────────────────────────────────────────────────

test('v1 default output: only v1 keys appear on nodes', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir);

    // Top-level keys: only v1 set
    assert.deepEqual(
      Object.keys(g).sort(),
      ['edges', 'nodes', 'projects', 'reqIndex'],
      'no v2 aggregations should appear by default'
    );

    // Each node has exactly the v1 keys, no more
    const v1Keys = ['type', 'project', 'path', 'title', 'status', 'severity',
                    'createdDate', 'lastModified'].sort();
    for (const [id, node] of Object.entries(g.nodes)) {
      assert.deepEqual(
        Object.keys(node).sort(), v1Keys,
        `node ${id} leaks v2 fields under default opts`
      );
    }

    // Sanity: edges + reqIndex still populated
    assert.ok(g.edges.length > 0, 'edges should be discovered');
    assert.ok('BR-001' in g.reqIndex, 'reqIndex should include BR-001');
    assert.ok(g.projects.includes('001-fixture'));
    assert.ok(g.projects.includes('000-global'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('withNodeMetadata adds version/owner/etc.', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { withNodeMetadata: true });
    const adr = g.nodes['ARC-001-ADR-001-v1.0'];
    assert.ok(adr, 'ADR node exists');
    assert.equal(adr.version, '1.0');
    assert.equal(adr.owner, 'EA Team');
    assert.equal(adr.classification, 'OFFICIAL');
    assert.equal(adr.subdir, 'decisions');
    assert.equal(adr.vendor, null);
    assert.ok(Array.isArray(adr.reqIds));
    assert.ok(adr.reqIds.includes('BR-001'));
    assert.ok(adr.controlFields);

    const hld = g.nodes['ARC-001-HLD-v1.0'];
    assert.equal(hld.vendor, 'acme');
    assert.equal(hld.subdir, 'vendors/acme');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('withContent adds content + mtimeMs', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { withContent: true });
    const req = g.nodes['ARC-001-REQ-v1.0'];
    assert.ok(typeof req.content === 'string');
    assert.ok(req.content.includes('BR-001'));
    assert.ok(typeof req.mtimeMs === 'number');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('withPreview adds preview', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { withPreview: true });
    const req = g.nodes['ARC-001-REQ-v1.0'];
    assert.ok(typeof req.preview === 'string');
    assert.ok(req.preview.length > 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('withRequirements aggregates full requirement records', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { withRequirements: true });
    assert.ok(g.requirements);
    const reqs = g.requirements['001-fixture'];
    assert.ok(reqs);
    const br = reqs.find(r => r.id === 'BR-001');
    assert.ok(br);
    assert.equal(br.category, 'Business');
    assert.equal(br.sourceFile, 'ARC-001-REQ-v1.0.md');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('withVendors collects vendor docs + reviews + verdicts', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { withVendors: true });
    assert.ok(g.vendors);
    const vendors = g.vendors['001-fixture'];
    assert.equal(vendors.length, 1);
    const acme = vendors[0];
    assert.equal(acme.name, 'acme');
    assert.ok(acme.docs.length > 0);
    assert.equal(acme.reviews.length, 1);
    assert.equal(acme.reviews[0].verdict, 'APPROVED WITH CONDITIONS');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('withPrinciples aggregates from 000-global', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { withPrinciples: true });
    assert.ok(g.principles);
    const globalPrin = g.principles['000-global'];
    assert.ok(globalPrin);
    assert.ok(globalPrin.length > 0);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('withRisks aggregates risk entries', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { withRisks: true });
    assert.ok(g.risks);
    // Existence is enough — exact structure depends on extractRiskEntries behaviour
    assert.ok(g.risks['001-fixture']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('withExternals lists external/ files', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { withExternals: true });
    assert.ok(g.externalFiles);
    const ext = g.externalFiles['001-fixture'];
    assert.equal(ext.length, 4);
    const filenames = ext.map(f => f.filename).sort();
    assert.deepEqual(filenames, [
      '7. RFI/RFI_CAP_CoreBancario_v1.docx',
      'meeting-transcript.vtt',
      'spec.api.yaml',
      'walkthrough-subtitles.srt',
    ]);
    assert.ok(ext.every(f => typeof f.mtimeMs === 'number'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('excludeGlobal drops 000-global', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { excludeGlobal: true });
    assert.ok(!g.projects.includes('000-global'));
    assert.ok(g.projects.includes('001-fixture'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('projectFilter restricts to one project', () => {
  const { root, projectsDir } = makeFixture();
  try {
    const g = scanAllArtifacts(projectsDir, { projectFilter: '001' });
    assert.deepEqual(g.projects, ['001-fixture']);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
