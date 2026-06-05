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

import { writeFileSync, mkdirSync, unlinkSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDir, isFile, readText, parseHookInput, parseVersion, compareVersions } from './hook-utils.mjs';
import { DOC_TYPES } from '../config/doc-types.mjs';
import { selectNudge } from './session-nudge.mjs';
import { summariseTelemetry, rollupTelemetry } from './telemetry-rollup.mjs';

const data = parseHookInput();
const cwd = data.cwd || '.';

// Detect StopFailure — extract error reason if present
const isFailure = !!(data.error || data.reason || data.hookEventName === 'StopFailure');
const failureReason = data.error?.message || data.error?.type || data.reason || data.error || null;

// Effort level the session was running at (Claude Code v2.1.133+).
// Preferred: hookInput `effort.level`. Fallback: `$CLAUDE_EFFORT` env var.
// May be null on older clients or when no explicit effort was set.
const effortLevel = (data.effort && typeof data.effort === 'object' ? data.effort.level : null) || process.env.CLAUDE_EFFORT || null;

// Only proceed if we're inside an ArcKit project. Detect either:
//   - .arckit/ — CLI scaffolding from `arckit init`
//   - projects/ — plugin-only install
// .arckit/memory/ gets created on demand when we go to write.
if (!isDir(join(cwd, '.arckit')) && !isDir(join(cwd, 'projects'))) {
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
// Doc-type codes touched this session, keyed by project number — feeds the
// end-of-turn nudge (selectNudge) at the bottom of this file.
const projectCodes = new Map();

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

      if (!projectCodes.has(projNum)) projectCodes.set(projNum, new Set());
      projectCodes.get(projNum).add(code);
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
if (effortLevel) {
  entry += `- **Effort:** ${effortLevel}\n`;
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
// Read .telemetry.jsonl written by telemetry.mjs across the session.
// Two outputs:
//   1. Prose one-liner appended to the session entry below (sessions.md)
//   2. Structured rollup written to docs/telemetry.json (newer-first,
//      capped at 50) so the pages dashboard can render a "Recent Activity"
//      panel without extra fetches.
// Silent when the file is absent or empty. Truncate after reading so the
// next session starts clean.
const telemetryFile = join(memoryDir, '.telemetry.jsonl');
let telemetryRollup = null;
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
    telemetryRollup = rollupTelemetry(events);
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

// ── Dashboard rollup (docs/telemetry.json) ────────────────────────────
// Persist a structured per-session record so the pages dashboard can show
// a "Recent Activity" panel. Only write when docs/ already exists (i.e.
// the project has run /arckit:pages) — we don't want to materialise a
// docs/ directory just for telemetry. Failure is non-fatal.
const docsDir = join(cwd, 'docs');
if (isDir(docsDir)) {
  const dashboardFile = join(docsDir, 'telemetry.json');
  let dashboard = { generated: now.toISOString(), sessions: [] };
  if (isFile(dashboardFile)) {
    try {
      const parsed = JSON.parse(readText(dashboardFile) || '{}');
      if (Array.isArray(parsed.sessions)) dashboard.sessions = parsed.sessions;
    } catch {
      // Corrupt file — start over rather than fail.
    }
  }

  const sessionRecord = {
    ts: now.toISOString(),
    type: entryType,
    isFailure,
    commits: commitCount,
    filesChanged: files.length,
    artifacts: serialiseArtifacts(projectArtifacts),
  };
  if (effortLevel) sessionRecord.effort = effortLevel;
  if (telemetryRollup) sessionRecord.telemetry = telemetryRollup;

  // Newer-first; cap at 50 (≈ a few weeks of daily use).
  dashboard.sessions.unshift(sessionRecord);
  dashboard.sessions = dashboard.sessions.slice(0, 50);
  dashboard.generated = now.toISOString();

  try {
    writeFileSync(dashboardFile, JSON.stringify(dashboard, null, 2));
  } catch {
    // Non-fatal — telemetry must never break a session.
  }
}

// Write timestamp for next session boundary
writeFileSync(lastSessionFile, now.toISOString());

// ── End-of-turn nudge (Claude Code v2.1.163+) ────────────────────────────
// A reactive next-step suggestion when this session left a traceability-chain
// gap (e.g. created requirements but no traceability matrix). Emitted as
// hookSpecificOutput.additionalContext, which Stop hooks may return without
// being labelled a hook error only on v2.1.163+ — so we gate on the version
// persisted by version-check.mjs at SessionStart and stay silent otherwise.
// Wrapped so it can never affect the session-summary writes above.
try {
  const nudge = buildNudge();
  if (nudge) {
    console.log(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'Stop', additionalContext: nudge.message },
    }));
  }
} catch {
  // Nudge is best-effort — never let it break the session.
}

process.exit(0);

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Decide whether to emit an end-of-turn nudge. Returns the selectNudge result
 * or null. Guards: not a failure turn, opt-out env var unset, client confirmed
 * >= 2.1.163, and at least one artefact touched this session.
 */
function buildNudge() {
  if (isFailure) return null;
  if (process.env.ARCKIT_NO_NUDGE) return null;
  if (projectCodes.size === 0) return null;

  // Version gate: read the client version persisted by version-check.mjs.
  const ccFile = join(memoryDir, '.cc-version');
  const cc = isFile(ccFile) ? parseVersion(readText(ccFile)) : null;
  if (!cc || compareVersions(cc, '2.1.163') < 0) return null;

  const diskCodesByProject = new Map();
  for (const projNum of projectCodes.keys()) {
    diskCodesByProject.set(projNum, scanProjectDiskCodes(cwd, projNum));
  }
  return selectNudge({ projectCodes, diskCodesByProject });
}

/**
 * Collect the doc-type codes present on disk for a project, by recursively
 * scanning its `projects/NNN-*` directory. Uses the same filename test as the
 * git-based detection above. Returns a Set of codes (empty on any failure).
 */
function scanProjectDiskCodes(baseCwd, projNum) {
  const found = new Set();
  const projectsDir = join(baseCwd, 'projects');
  let projectDir = null;
  try {
    for (const entry of readdirSync(projectsDir)) {
      if (entry === projNum || entry.startsWith(`${projNum}-`)) {
        projectDir = join(projectsDir, entry);
        break;
      }
    }
  } catch {
    return found;
  }
  if (!projectDir) return found;

  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        walk(join(dir, e.name));
      } else {
        for (const code of Object.keys(DOC_TYPES)) {
          if (e.name.includes(`-${code}-`) || e.name.includes(`-${code}.`)) found.add(code);
        }
      }
    }
  };
  walk(projectDir);
  return found;
}

/**
 * Convert the projectArtifacts Map<projectNum, Map<category, Set<typeName>>>
 * into a plain JSON-serialisable shape for docs/telemetry.json.
 */
function serialiseArtifacts(projectArtifactsMap) {
  const out = [];
  for (const [projNum, catMap] of [...projectArtifactsMap.entries()].sort()) {
    const categories = {};
    for (const [category, names] of catMap) {
      categories[category] = [...names].sort();
    }
    out.push({ project: projNum, categories });
  }
  return out;
}
