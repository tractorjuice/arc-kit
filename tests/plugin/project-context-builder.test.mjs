#!/usr/bin/env node
/**
 * Smoke tests for plugins/arckit-claude/hooks/project-context-builder.mjs
 *
 * Verifies external text assets, including subtitle/transcript files, are
 * surfaced to ArcKit commands through injected project context.
 *
 * Run with: node tests/plugin/project-context-builder.test.mjs
 */

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildProjectContext,
} from '../../plugins/arckit-claude/hooks/project-context-builder.mjs';

test('project context includes subtitle and transcript external files', () => {
  const root = mkdtempSync(join(tmpdir(), 'arckit-context-'));
  try {
    const projectDir = join(root, 'projects', '001-transcripts');
    const externalDir = join(projectDir, 'external');
    mkdirSync(externalDir, { recursive: true });

    writeFileSync(
      join(projectDir, 'ARC-001-REQ-v1.0.md'),
      `# Requirements\n\n| Field | Value |\n|---|---|\n| **Document ID** | ARC-001-REQ-v1.0 |\n| **Document Type** | REQ |\n`
    );
    writeFileSync(join(externalDir, 'README.md'), '# External Documents\n');
    writeFileSync(join(externalDir, 'architecture-board.vtt'), 'WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nApprove the target architecture.\n');
    writeFileSync(join(externalDir, 'supplier-demo.srt'), '1\n00:00:00,000 --> 00:00:02,000\nSupplier demonstrates failover.\n');

    const context = buildProjectContext(root);

    assert.ok(context.includes('External documents'));
    assert.ok(context.includes('architecture-board.vtt'));
    assert.ok(context.includes('supplier-demo.srt'));
    assert.ok(!context.includes('README.md'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
