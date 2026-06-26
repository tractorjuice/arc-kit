#!/usr/bin/env node
/**
 * Focused tests for the Self-Harness autoresearch utilities.
 *
 * Run with: node tests/plugin/self-harness.test.mjs
 */

import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { processTraceInput } from '../../plugins/arckit-claude/hooks/autoresearch-tracer.mjs';
import { validateHarness } from '../../plugins/arckit-claude/hooks/harness-validator.mjs';
import { applyProposal } from '../../plugins/arckit-claude/hooks/harness-proposer.mjs';
import { mineWeaknesses } from '../../plugins/arckit-claude/hooks/weakness-miner.mjs';

function withTempDir(prefix, fn) {
  const root = mkdtempSync(join(tmpdir(), prefix));
  const originalCwd = process.cwd();
  try {
    process.chdir(root);
    return fn(root);
  } finally {
    process.chdir(originalCwd);
    rmSync(root, { recursive: true, force: true });
  }
}

test('autoresearch tracer processes JSON input and writes a trace file', () => {
  withTempDir('arckit-selfharness-trace-', (root) => {
    const result = processTraceInput(JSON.stringify({
      command: 'requirements',
      iteration: 7,
      mode: 'prompt',
      toolCalls: [{ name: 'Read', path: 'fixtures/project.md' }],
      tokenCount: 123,
      durationMs: 456,
      artifacts: ['projects/001/ARC-001-REQ-v1.0.md'],
      verifier: { passed: true }
    }));

    assert.deepEqual(result, { traceSaved: true, traceId: 'iter-7' });

    const tracePath = join(root, '.arckit', 'autoresearch-traces', 'requirements', 'prompt', 'iteration-007.json');
    const trace = JSON.parse(readFileSync(tracePath, 'utf8'));
    assert.equal(trace.target, 'requirements');
    assert.equal(trace.execution.tokenCount, 123);
  });
});

test('harness validator rejects unscored tasks instead of inventing scores', () => {
  withTempDir('arckit-selfharness-validator-', () => {
    const result = validateHarness({
      command: 'requirements',
      mode: 'prompt',
      heldInTasks: ['001'],
      heldOutTasks: ['002'],
      baselineScores: { heldIn: 8, heldOut: 8 },
      iteration: 1
    });

    assert.equal(result.accepted, false);
    assert.match(result.reason, /missing scored validation result/);
    assert.equal(result.heldInResults[0].score, null);
    assert.equal(result.heldOutResults[0].score, null);
  });
});

test('harness validator accepts explicit scored task results deterministically', () => {
  withTempDir('arckit-selfharness-validator-', () => {
    const options = {
      command: 'requirements',
      mode: 'prompt',
      heldInTasks: ['001'],
      heldOutTasks: ['002'],
      taskResults: {
        heldIn: { '001': { structural: 'PASS', score: 8.5 } },
        heldOut: { '002': { structural: 'PASS', score: 8.1 } }
      },
      baselineScores: { heldIn: 8, heldOut: 8 },
      iteration: 2
    };

    const first = validateHarness(options);
    const second = validateHarness(options);

    assert.equal(first.accepted, true);
    assert.equal(second.accepted, true);
    assert.deepEqual(first.candidateScores, second.candidateScores);
    assert.deepEqual(first.deltas, second.deltas);
  });
});

test('weakness miner keeps cluster frequency numeric after repeated failures', () => {
  withTempDir('arckit-selfharness-miner-', () => {
    writeFileSync('trace.json', JSON.stringify({
      execution: { toolCalls: [], durationMs: 0, artifactsCreated: [] },
      output: 'short'
    }));

    const verifier = { passed: false, failures: ['Document Control'] };
    mineWeaknesses('requirements', 1, 'prompt', 'trace.json', verifier, 0, 8);
    mineWeaknesses('requirements', 2, 'prompt', 'trace.json', verifier, 0, 8);

    const clustersPath = join('.arckit', 'autoresearch-traces', 'requirements', 'prompt', 'clusters.json');
    const clusters = JSON.parse(readFileSync(clustersPath, 'utf8'));
    assert.equal(clusters.length, 1);
    assert.equal(typeof clusters[0].frequency, 'number');
    assert.equal(clusters[0].frequency, 1);
    assert.deepEqual(clusters[0].traces, [1, 2]);
  });
});

test('harness proposer applies tool config changes to object-shaped MCP config', () => {
  withTempDir('arckit-selfharness-proposer-', () => {
    const configPath = 'mcp.json';
    writeFileSync(configPath, JSON.stringify({
      mcpServers: {
        'uk-tenders': { type: 'http', url: 'https://example.test/mcp' },
        'aws-knowledge': { type: 'http', url: 'https://example.test/aws' }
      }
    }, null, 2));

    applyProposal({
      changes: [
        {
          type: 'restrict',
          tools: ['Bash'],
          action: 'require_justification',
          content: 'Explain why Bash is necessary'
        },
        {
          type: 'disable',
          tools: ['uk-tenders']
        },
        {
          type: 'add_tool',
          tools: ['WebSearch']
        }
      ]
    }, configPath);

    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    assert.equal(config.mcpServers['uk-tenders'], undefined);
    assert.ok(config.mcpServers['aws-knowledge']);
    assert.equal(config.toolRestrictions.Bash.action, 'require_justification');
    assert.deepEqual(config.disabledTools, ['uk-tenders']);
    assert.deepEqual(config.allowedTools, ['WebSearch']);
  });
});
