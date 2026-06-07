import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { summariseTelemetry, rollupTelemetry } = await import(
  resolve('plugins/arckit-claude/hooks/telemetry-rollup.mjs')
);

// hook_duration event helper
const dur = (tool, ms, agent_type) => ({ kind: 'hook_duration', tool, duration_ms: ms, ...(agent_type ? { agent_type } : {}) });
// mcp_call event helper
const mcp = (server, agent_type) => ({ kind: 'mcp_call', server, tool: 't', ...(agent_type ? { agent_type } : {}) });

test('rollup buckets tool durations by agent, main-thread calls under "main"', () => {
  const events = [
    dur('Write', 10),                 // main
    dur('Bash', 20),                  // main
    dur('WebFetch', 100, 'arckit-research'),
    dur('WebFetch', 300, 'arckit-research'),
  ];
  const r = rollupTelemetry(events);
  assert.ok(Array.isArray(r.byAgent));
  const byName = Object.fromEntries(r.byAgent.map((a) => [a.agent, a]));
  assert.equal(byName.main.toolCalls, 2);
  assert.equal(byName['arckit-research'].toolCalls, 2);
  assert.equal(typeof byName['arckit-research'].p95, 'number');
});

test('rollup attributes mcp calls to the agent that made them', () => {
  const events = [
    mcp('govreposcrape', 'arckit-gov-reuse-reader'),
    mcp('govreposcrape', 'arckit-gov-reuse-reader'),
    mcp('uk-tenders', 'arckit-tenders-reader'),
  ];
  const r = rollupTelemetry(events);
  const byName = Object.fromEntries(r.byAgent.map((a) => [a.agent, a]));
  assert.equal(byName['arckit-gov-reuse-reader'].mcpCalls, 2);
  assert.equal(byName['arckit-tenders-reader'].mcpCalls, 1);
});

test('rollup preserves the existing top-line fields', () => {
  const events = [dur('Write', 10), dur('Edit', 30), mcp('govreposcrape', 'arckit-research')];
  const r = rollupTelemetry(events);
  assert.equal(r.toolCalls, 2);
  assert.equal(typeof r.p50, 'number');
  assert.deepEqual(r.mcp, [{ server: 'govreposcrape', count: 1 }]);
});

test('rollup omits byAgent when all activity is main-thread only', () => {
  const r = rollupTelemetry([dur('Write', 10), dur('Bash', 20)]);
  assert.equal(r.byAgent, undefined);
});

test('rollup returns null for empty events', () => {
  assert.equal(rollupTelemetry([]), null);
});

test('summary includes a by-agent segment when a subagent did work', () => {
  const events = [
    dur('Write', 10),
    dur('WebFetch', 100, 'arckit-research'),
    dur('WebFetch', 200, 'arckit-research'),
  ];
  const s = summariseTelemetry(events);
  assert.match(s, /by agent/i);
  assert.match(s, /arckit-research/);
});

test('summary omits the by-agent segment when only main-thread work', () => {
  const s = summariseTelemetry([dur('Write', 10), dur('Bash', 20)]);
  assert.doesNotMatch(s, /by agent/i);
});
