#!/usr/bin/env node
/**
 * ArcKit Telemetry Recorder — multi-purpose hook
 *
 * Registered for several events; the input's `hook_event_name` (or the
 * fields present) tells us which kind of record to write. Each invocation
 * appends one JSON line to `.arckit/memory/.telemetry.jsonl`. The file is
 * read and truncated by `session-learner.mjs` on Stop, so it stays small
 * across sessions.
 *
 * Records (one of):
 *
 *   {"ts":"...","kind":"hook_duration","tool":"Write","duration_ms":42,"effort":"high"}
 *     - emitted on PostToolUse for every tool with duration_ms (Claude Code
 *       v2.1.119+). Skipped silently when duration_ms is absent (older
 *       client, PreToolUse-rejected calls, etc.)
 *
 *   {"ts":"...","kind":"mcp_call","server":"govreposcrape","tool":"...","args":{...},"effort":"high"}
 *     - emitted on PostToolUse for MCP calls matching `mcp__govreposcrape__.*`.
 *       Records the called tool name and its arguments (sanitised — only
 *       primitive values kept, large blobs replaced with `<…>`).
 *
 *   {"ts":"...","kind":"agent_spawn","agent":"arckit-research","effort":"max"}
 *     - emitted on TaskCreated (v2.1.84+). Records the spawned agent's
 *       subagent_type so session-learner can summarise agent usage.
 *
 * Every record also carries the session's `effort` level (Claude Code
 * v2.1.133+) when the harness supplies one — read from hookInput
 * `effort.level` or the `$CLAUDE_EFFORT` env var. Omitted on older
 * clients or when no explicit effort was set.
 *
 * Hook Type:  PostToolUse | TaskCreated
 * Input:      JSON hook input (shape varies by event)
 * Output:     none (silent telemetry; tool output unchanged)
 * Exit:       0 always (telemetry must never break a session)
 */

import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { isDir, parseHookInput } from './hook-utils.mjs';

const data = parseHookInput();
const cwd = data.cwd || process.cwd();

// Only collect telemetry inside an ArcKit project. Detect either:
//   - .arckit/ — created by the CLI's `arckit init`
//   - projects/ — created by plugin-only installs (test repos that
//     never ran the CLI scaffolder)
// If neither exists, this isn't an ArcKit project; exit silently. If
// projects/ exists but .arckit/ doesn't, the .arckit/memory/ dir gets
// created below when we go to write the JSONL.
if (!isDir(join(cwd, '.arckit')) && !isDir(join(cwd, 'projects'))) process.exit(0);

const event = data.hook_event_name || data.hookEventName || '';
const tool = data.tool_name || '';

// Effort level the call was running at (Claude Code v2.1.133+). Preferred:
// hookInput `effort.level`. Fallback: `$CLAUDE_EFFORT` env var. Null on
// older clients or when no explicit effort was set. Attached to every
// record so downstream analysis can compare e.g. p95 latency at `xhigh`
// vs `max` for the same tool.
const effortLevel = (data.effort && typeof data.effort === 'object' ? data.effort.level : null) || process.env.CLAUDE_EFFORT || null;

// Subagent context (Claude Code v2.1.145+): present only when the hook fires
// inside a subagent call. `agent_type` is the subagent name (e.g.
// "arckit-research"); `agent_id` is the unique instance. Attached to
// latency/MCP records so session-learner can attribute tool activity by agent.
// (Hook input exposes agent_id/agent_type but NOT parent_agent_id, so the
// dispatch tree cannot be reconstructed — only per-agent attribution.)
const agentType = data.agent_type || null;
const agentId = data.agent_id || null;

let record = null;
const ts = new Date().toISOString();

if (event === 'TaskCreated' || tool === 'TaskCreate') {
  // TaskCreated: the spawned agent is in tool_input.subagent_type
  const agent = data.tool_input?.subagent_type || data.tool_input?.agent || null;
  if (agent) {
    record = { ts, kind: 'agent_spawn', agent };
  }
} else if (tool.startsWith('mcp__govreposcrape__')) {
  // MCP call recording for govreposcrape
  // Tool name shape: mcp__<server>__<tool>
  const parts = tool.split('__');
  const server = parts[1] || 'unknown';
  const mcpTool = parts.slice(2).join('__') || 'unknown';
  record = {
    ts,
    kind: 'mcp_call',
    server,
    tool: mcpTool,
    args: sanitiseArgs(data.tool_input),
  };
} else if (typeof data.duration_ms === 'number') {
  // PostToolUse duration recording (v2.1.119+).
  // Skip TaskCreate and govreposcrape MCP calls — those are recorded
  // under their own kinds above; we only want pure latency for everything
  // else (Write/Edit/Bash/etc.) so the duration histogram is uncluttered.
  if (tool && tool !== 'TaskCreate' && !tool.startsWith('mcp__govreposcrape__')) {
    record = { ts, kind: 'hook_duration', tool, duration_ms: data.duration_ms };
  }
}

if (record) {
  if (effortLevel) record.effort = effortLevel;
  // Attribute latency/MCP activity to the subagent it ran inside (if any).
  if (record.kind === 'hook_duration' || record.kind === 'mcp_call') {
    if (agentType) record.agent_type = agentType;
    if (agentId) record.agent_id = agentId;
  }
  const memoryDir = join(cwd, '.arckit', 'memory');
  try {
    mkdirSync(memoryDir, { recursive: true });
    appendFileSync(join(memoryDir, '.telemetry.jsonl'), JSON.stringify(record) + '\n');
  } catch {
    // Telemetry must never break a session. Swallow any write failure.
  }
}

process.exit(0);

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Reduce tool_input down to primitive values + short strings so the
 * telemetry file stays small. Long strings (e.g. file content) are
 * replaced with a length marker. Nested objects are flattened to
 * `<object>`.
 */
function sanitiseArgs(input) {
  if (!input || typeof input !== 'object') return null;
  const out = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === null || v === undefined) {
      out[k] = v;
    } else if (typeof v === 'string') {
      out[k] = v.length > 200 ? `<string len=${v.length}>` : v;
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      out[k] = v;
    } else if (Array.isArray(v)) {
      out[k] = `<array len=${v.length}>`;
    } else {
      out[k] = '<object>';
    }
  }
  return out;
}
