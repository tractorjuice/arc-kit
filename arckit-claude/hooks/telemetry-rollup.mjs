/**
 * ArcKit Telemetry Rollup — pure aggregation of the per-session telemetry
 * events written by telemetry.mjs to `.arckit/memory/.telemetry.jsonl`.
 *
 * Two views over the same event list:
 *   - summariseTelemetry(events) → one-line prose for the sessions.md entry
 *   - rollupTelemetry(events)    → structured object for docs/telemetry.json
 *
 * Both group activity BY AGENT when subagent context is present: each
 * hook_duration / mcp_call event may carry `agent_type` (the subagent the
 * tool ran inside, e.g. "arckit-research"); events with no agent_type are
 * main-thread work, bucketed under "main". This lets the dashboard and the
 * session log show where the research agents spend tool time and MCP calls.
 * (Hook input exposes agent_id/agent_type but NOT parent_agent_id, so we
 * attribute by agent — we cannot reconstruct the dispatch tree.)
 *
 * Pure: no fs, no side effects on import. Imported by session-learner.mjs;
 * unit-tested in tests/plugin/telemetry-rollup.test.mjs.
 */

const MAIN = 'main';

/**
 * Group hook_duration durations and mcp_call counts by agent bucket
 * (agent_type, or "main" when absent).
 *
 * @returns {Map<string, { durations: number[], mcpCalls: number }>}
 */
function groupByAgent(events) {
  const byAgent = new Map();
  const bucket = (key) => {
    if (!byAgent.has(key)) byAgent.set(key, { durations: [], mcpCalls: 0 });
    return byAgent.get(key);
  };
  for (const ev of events) {
    const agent = ev.agent_type || MAIN;
    if (ev.kind === 'hook_duration' && typeof ev.duration_ms === 'number') {
      bucket(agent).durations.push(ev.duration_ms);
    } else if (ev.kind === 'mcp_call') {
      bucket(agent).mcpCalls += 1;
    }
  }
  return byAgent;
}

function pct(sorted, p) {
  return sorted[Math.floor(sorted.length * p)];
}

/**
 * Build the per-agent breakdown array, sorted by total activity descending.
 * Returns null when the only bucket is "main" (no subagent work to attribute).
 *
 * @returns {Array<{ agent: string, toolCalls: number, p50?: number, p95?: number, mcpCalls: number }> | null}
 */
function buildByAgent(events) {
  const grouped = groupByAgent(events);
  const hasSubagent = [...grouped.keys()].some((k) => k !== MAIN);
  if (!hasSubagent) return null;

  const rows = [];
  for (const [agent, { durations, mcpCalls }] of grouped) {
    const sorted = [...durations].sort((a, b) => a - b);
    const row = { agent, toolCalls: sorted.length, mcpCalls };
    if (sorted.length > 0) {
      row.p50 = pct(sorted, 0.5);
      row.p95 = pct(sorted, 0.95);
    }
    rows.push(row);
  }
  rows.sort((a, b) => (b.toolCalls + b.mcpCalls) - (a.toolCalls + a.mcpCalls));
  return rows;
}

/**
 * One-line prose summary for the sessions.md entry. Returns null when there
 * is nothing meaningful to report.
 */
export function summariseTelemetry(events) {
  const durationsByTool = new Map();
  const mcpCalls = new Map();
  const agentSpawns = new Map();

  for (const ev of events) {
    if (ev.kind === 'hook_duration' && ev.tool && typeof ev.duration_ms === 'number') {
      if (!durationsByTool.has(ev.tool)) durationsByTool.set(ev.tool, []);
      durationsByTool.get(ev.tool).push(ev.duration_ms);
    } else if (ev.kind === 'mcp_call' && ev.server) {
      mcpCalls.set(ev.server, (mcpCalls.get(ev.server) || 0) + 1);
    } else if (ev.kind === 'agent_spawn' && ev.agent) {
      agentSpawns.set(ev.agent, (agentSpawns.get(ev.agent) || 0) + 1);
    }
  }

  const parts = [];

  if (durationsByTool.size > 0) {
    const all = [];
    for (const arr of durationsByTool.values()) all.push(...arr);
    all.sort((a, b) => a - b);
    parts.push(`${all.length} tool calls (p50=${pct(all, 0.5)}ms, p95=${pct(all, 0.95)}ms)`);
  }

  if (agentSpawns.size > 0) {
    const total = [...agentSpawns.values()].reduce((a, b) => a + b, 0);
    const top = [...agentSpawns.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([a, n]) => (n > 1 ? `${a}×${n}` : a))
      .join(', ');
    parts.push(`${total} agent${total === 1 ? '' : 's'} (${top})`);
  }

  if (mcpCalls.size > 0) {
    const top = [...mcpCalls.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([s, n]) => `${s}×${n}`)
      .join(', ');
    parts.push(`MCP: ${top}`);
  }

  // By-agent breakdown — only when a subagent did tool work.
  const byAgent = buildByAgent(events);
  if (byAgent) {
    const top = byAgent
      .slice(0, 3)
      .map((a) => {
        if (a.toolCalls > 0) return `${a.agent}(${a.toolCalls} call${a.toolCalls === 1 ? '' : 's'}, p95=${a.p95}ms)`;
        return `${a.agent}(${a.mcpCalls} MCP)`;
      })
      .join(', ');
    parts.push(`by agent: ${top}`);
  }

  return parts.length > 0 ? parts.join(' | ') : null;
}

/**
 * Structured rollup for docs/telemetry.json. Returns null when there are no
 * meaningful events.
 */
export function rollupTelemetry(events) {
  const all = [];
  const agents = new Map();
  const mcp = new Map();

  for (const ev of events) {
    if (ev.kind === 'hook_duration' && typeof ev.duration_ms === 'number') {
      all.push(ev.duration_ms);
    } else if (ev.kind === 'mcp_call' && ev.server) {
      mcp.set(ev.server, (mcp.get(ev.server) || 0) + 1);
    } else if (ev.kind === 'agent_spawn' && ev.agent) {
      agents.set(ev.agent, (agents.get(ev.agent) || 0) + 1);
    }
  }

  if (all.length === 0 && agents.size === 0 && mcp.size === 0) return null;

  const result = {};
  if (all.length > 0) {
    all.sort((a, b) => a - b);
    result.toolCalls = all.length;
    result.p50 = pct(all, 0.5);
    result.p95 = pct(all, 0.95);
  }
  if (agents.size > 0) {
    result.agents = [...agents.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }
  if (mcp.size > 0) {
    result.mcp = [...mcp.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([server, count]) => ({ server, count }));
  }

  const byAgent = buildByAgent(events);
  if (byAgent) result.byAgent = byAgent;

  return result;
}
