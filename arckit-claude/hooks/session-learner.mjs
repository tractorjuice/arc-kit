#!/usr/bin/env node
/**
 * ArcKit Stop / StopFailure Hook — Session Learner
 *
 * Fires when a session ends (Stop event) or when a turn fails due to an
 * API error such as rate limit or auth failure (StopFailure event).
 *
 * Analyses recent git commits to build a session summary and appends it
 * to .arckit/memory/sessions.md. On StopFailure, also records the error
 * reason so the session log captures interrupted work.
 *
 * Uses timestamp tracking (.arckit/memory/.last-session) to capture
 * exactly the commits from this session — no overlap, no gaps.
 *
 * Hook Type: Stop / StopFailure (Notification)
 * Input (stdin):  JSON with session_id, cwd, error (StopFailure only), etc.
 * Output (stdout): empty (notification hook, no output required)
 */

import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDir, isFile, readText, parseHookInput } from './hook-utils.mjs';
import { DOC_TYPES } from '../config/doc-types.mjs';

const data = parseHookInput();
const cwd = data.cwd || '.';

// Detect StopFailure — extract error reason if present
const isFailure = !!(data.error || data.reason || data.hookEventName === 'StopFailure');
const failureReason = data.error?.message || data.error?.type || data.reason || data.error || null;

// Only proceed if we're in a project with .arckit directory
if (!isDir(join(cwd, '.arckit'))) {
  process.exit(0);
}

// Read last-session timestamp for --since boundary
const memoryDir = join(cwd, '.arckit', 'memory');
const lastSessionFile = join(memoryDir, '.last-session');
let sinceArg = '4 hours ago'; // first-run fallback

if (isFile(lastSessionFile)) {
  const ts = readText(lastSessionFile)?.trim();
  if (ts) sinceArg = ts;
}

// Collect git commits since last session
let commits = '';
try {
  commits = execFileSync('git', ['log', `--since=${sinceArg}`, '--oneline', '--no-merges'], {
    cwd,
    encoding: 'utf8',
    timeout: 5000,
  }).trim();
} catch {
  // On failure events, continue even without commits
  if (!isFailure) process.exit(0);
}

// For normal Stop, require commits; for StopFailure, always log
if (!commits && !isFailure) process.exit(0);

const commitLines = commits ? commits.split('\n').filter(Boolean) : [];
const commitCount = commitLines.length;

// Detect changed files from recent commits
let changedFiles = '';
try {
  changedFiles = execFileSync('git', ['log', `--since=${sinceArg}`, '--no-merges', '--name-only', '--pretty=format:'], {
    cwd,
    encoding: 'utf8',
    timeout: 5000,
  }).trim();
} catch {
  changedFiles = '';
}

const files = [...new Set(changedFiles.split('\n').filter(Boolean))];

// Detect artifact types from filenames, grouped by project number
// projectArtifacts: Map<projectNum, Map<category, Set<typeName>>>
const projectArtifacts = new Map();
const allCategories = new Set();

for (const f of files) {
  // Extract project number from ARC filename (e.g., ARC-001-REQ-v1.0.md → 001)
  const projMatch = f.match(/ARC-(\d{3})-/);
  if (!projMatch) continue;
  const projNum = projMatch[1];

  for (const [code, info] of Object.entries(DOC_TYPES)) {
    if (f.includes(`-${code}-`) || f.includes(`-${code}.`)) {
      if (!projectArtifacts.has(projNum)) projectArtifacts.set(projNum, new Map());
      const projMap = projectArtifacts.get(projNum);
      if (!projMap.has(info.category)) projMap.set(info.category, new Set());
      projMap.get(info.category).add(info.name);
      allCategories.add(info.category);
    }
  }
}

// Classify session by dominant DOC_TYPES category (priority order)
const CATEGORY_PRIORITY = [
  'Compliance', 'Governance', 'Research', 'Procurement',
  'Architecture', 'Planning', 'Discovery', 'Operations',
];

function classifySession(categories) {
  for (const cat of CATEGORY_PRIORITY) {
    if (categories.has(cat)) return cat.toLowerCase();
  }
  return 'general';
}

const sessionType = classifySession(allCategories);

// Extract commit message summaries (strip hashes)
const commitSummaries = commitLines.map(line => {
  const spaceIdx = line.indexOf(' ');
  return spaceIdx > 0 ? line.substring(spaceIdx + 1) : line;
});

// Build markdown entry
const now = new Date();
const dateStr = now.toISOString().substring(0, 10);
const timeStr = now.toISOString().substring(11, 16);

const failureLabel = isFailure
  ? ` (${typeof failureReason === 'string' ? failureReason : 'api_error'})`
  : '';
const entryType = isFailure ? `failure${failureLabel}` : sessionType;

let entry = `### ${dateStr} ${timeStr} — ${entryType}\n\n`;
if (isFailure) {
  entry += `- **Status:** session interrupted by API error\n`;
}
entry += `- **Commits:** ${commitCount} | **Files changed:** ${files.length}\n`;

if (projectArtifacts.size > 0) {
  entry += '- **Artifacts:**\n';
  for (const [projNum, catMap] of [...projectArtifacts.entries()].sort()) {
    const parts = [];
    for (const [category, names] of catMap) {
      parts.push(`${category}: ${[...names].join(', ')}`);
    }
    entry += `  - [${projNum}] ${parts.join(' | ')}\n`;
  }
} else {
  entry += '- **Artifacts:** none detected\n';
}

if (commitSummaries.length > 0) {
  entry += '- **Summary:**\n';
  for (const s of commitSummaries.slice(0, 8)) {
    entry += `  - ${s}\n`;
  }
}

// ── Telemetry summary (Claude Code v2.1.84 / v2.1.118 / v2.1.119) ──
// Read .telemetry.jsonl written by telemetry.mjs across the session,
// roll it up into a one-line summary, and truncate so it doesn't grow
// across sessions. Silent when the file is absent or empty.
const telemetryFile = join(memoryDir, '.telemetry.jsonl');
if (isFile(telemetryFile)) {
  const raw = readText(telemetryFile) || '';
  const events = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    try {
      events.push(JSON.parse(line));
    } catch {
      // skip malformed line — telemetry must never break a session
    }
  }
  if (events.length > 0) {
    const summary = summariseTelemetry(events);
    if (summary) entry += `- **Telemetry:** ${summary}\n`;
  }
  // Truncate (delete) so next session starts clean. Failure is non-fatal.
  try { unlinkSync(telemetryFile); } catch { /* ignore */ }
}

// Ensure memory directory exists
mkdirSync(memoryDir, { recursive: true });

const sessionsFile = join(memoryDir, 'sessions.md');

// Read existing content or create with header
let existing = '';
if (isFile(sessionsFile)) {
  existing = readText(sessionsFile) || '';
}

if (!existing.trim()) {
  existing = '# Session Log\n\nAutomated session summaries captured by the ArcKit session-learner hook.\n';
}

// Split into header + entries, prepend new entry, trim to 30
const sections = existing.split(/\n(?=### \d{4}-\d{2}-\d{2})/);
const header = sections[0];
const entries = sections.slice(1);

entries.unshift(entry);

const trimmed = entries.slice(0, 30);
const output = header.trimEnd() + '\n\n' + trimmed.join('\n') + '\n';

writeFileSync(sessionsFile, output);

// Write timestamp for next session boundary
writeFileSync(lastSessionFile, now.toISOString());

process.exit(0);

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Roll up telemetry events from telemetry.mjs into a single line for
 * the session entry. Records:
 *   - hook_duration{tool, duration_ms}: per-tool latency histogram
 *   - mcp_call{server, tool, args}:     MCP call count (govreposcrape only)
 *   - agent_spawn{agent}:               agent spawn counts
 *
 * Returns a one-line string or null if nothing meaningful to report.
 */
function summariseTelemetry(events) {
  const durationsByTool = new Map(); // tool → array of duration_ms
  const mcpCalls = new Map();        // server → count
  const agentSpawns = new Map();     // agent → count

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
    // Compute total tool calls and overall p50/p95
    const all = [];
    for (const arr of durationsByTool.values()) all.push(...arr);
    all.sort((a, b) => a - b);
    const p50 = all[Math.floor(all.length * 0.5)];
    const p95 = all[Math.floor(all.length * 0.95)];
    parts.push(`${all.length} tool calls (p50=${p50}ms, p95=${p95}ms)`);
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

  return parts.length > 0 ? parts.join(' | ') : null;
}
