#!/usr/bin/env node
/**
 * Regression tests for external-context-watch.mjs.
 *
 * Run with: node tests/plugin/external-context-watch.test.mjs
 */

import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { runExternalContextWatch } from '../../plugins/arckit-claude/hooks/external-context-watch.mjs';

function makeProject() {
  const root = mkdtempSync(join(tmpdir(), 'arckit-external-watch-'));
  const projectDir = join(root, 'projects', '001-demo');
  const externalDir = join(projectDir, 'external');
  const nestedDir = join(externalDir, 'nested');
  mkdirSync(nestedDir, { recursive: true });
  writeFileSync(join(projectDir, 'ARC-001-REQ-v1.0.md'), '# Requirements\n');
  writeFileSync(join(externalDir, 'README.md'), '# External documents\n');
  return { root, projectDir, externalDir, nestedDir };
}

test('FileChanged injects refreshed context for a new external document', () => {
  const { root, externalDir, nestedDir } = makeProject();
  try {
    const briefingPath = join(externalDir, 'briefing.md');
    writeFileSync(briefingPath, '# Briefing\n');

    const output = runExternalContextWatch({
      hook_event_name: 'FileChanged',
      cwd: root,
      file_path: briefingPath,
      event: 'add',
    });

    assert.equal(output.hookSpecificOutput.hookEventName, 'FileChanged');
    assert.deepEqual(output.hookSpecificOutput.watchPaths, [externalDir, nestedDir]);
    assert.match(output.hookSpecificOutput.additionalContext, /ArcKit External Document Update/);
    assert.match(output.hookSpecificOutput.additionalContext, /A project external document was added/);
    assert.match(output.hookSpecificOutput.additionalContext, /projects\/001-demo\/external\/briefing\.md/);
    assert.match(output.hookSpecificOutput.additionalContext, /External documents/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('FileChanged outside external directories refreshes watches without context', () => {
  const { root, externalDir, nestedDir, projectDir } = makeProject();
  try {
    const notePath = join(projectDir, 'notes.md');
    writeFileSync(notePath, '# Notes\n');

    const output = runExternalContextWatch({
      hook_event_name: 'FileChanged',
      cwd: root,
      file_path: notePath,
      event: 'add',
    });

    assert.equal(output.hookSpecificOutput.hookEventName, 'FileChanged');
    assert.deepEqual(output.hookSpecificOutput.watchPaths, [externalDir, nestedDir]);
    assert.equal(output.hookSpecificOutput.additionalContext, undefined);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
