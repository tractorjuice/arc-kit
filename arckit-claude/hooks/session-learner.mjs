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

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
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

// ── TiM Phase 1: Decision Thought Extraction ──

const thoughtsFile = join(memoryDir, 'thoughts.jsonl');
const newThoughts = [];

// Read existing thoughts for dedup and ID generation
let existingThoughts = [];
if (isFile(thoughtsFile)) {
  const raw = readText(thoughtsFile);
  if (raw) {
    existingThoughts = raw.trim().split('\n').filter(Boolean).map(line => {
      try { return JSON.parse(line); } catch { return null; }
    }).filter(Boolean);
  }
}

const recentContent = new Set(existingThoughts.slice(0, 20).map(t => t.content));
let nextId = existingThoughts.reduce((max, t) => {
  const n = parseInt(t.id?.replace('t-', ''), 10);
  return n > max ? n : max;
}, 0) + 1;

const dateStr_ = new Date().toISOString().substring(0, 10);

// ADR content parsing — extract decisions from ADR files modified this session
const adrFiles = files.filter(f => /ARC-\d{3}-ADR-/.test(f));
for (const adrFile of adrFiles) {
  const adrPath = join(cwd, adrFile);
  if (!isFile(adrPath)) continue;

  let adrContent;
  try { adrContent = readFileSync(adrPath, 'utf8'); } catch { continue; }

  // Extract decision text from ## Decision heading or **Decision:** bold line
  let decision = null;
  const headingMatch = adrContent.match(/^##\s+(?:Context and )?Decision\s*\n+([\s\S]*?)(?=\n##\s|\n---|\Z)/im);
  if (headingMatch) {
    // Take first non-empty paragraph
    const paragraphs = headingMatch[1].split(/\n\n/).map(p => p.trim()).filter(Boolean);
    if (paragraphs.length > 0) decision = paragraphs[0].replace(/\n/g, ' ').trim();
  }

  if (!decision) {
    const boldMatch = adrContent.match(/\*\*Decision\*\*:\s*(.+)/i);
    if (boldMatch) decision = boldMatch[1].trim();
  }

  if (!decision || recentContent.has(decision)) continue;

  // Extract project number from filename
  const projMatch = adrFile.match(/ARC-(\d{3})-/);
  const projNum = projMatch ? projMatch[1] : '000';

  newThoughts.push({
    id: `t-${String(nextId++).padStart(3, '0')}`,
    created: dateStr_,
    project: projNum,
    type: 'decision',
    content: decision,
    source: 'adr',
    artifact: basename(adrFile),
    tags: ['architecture'],
  });
  recentContent.add(decision);
}

// Write thoughts to JSONL (prepend new, trim to 100)
if (newThoughts.length > 0) {
  mkdirSync(memoryDir, { recursive: true });
  const newLines = newThoughts.map(t => JSON.stringify(t));
  const allLines = [...newLines, ...existingThoughts.map(t => JSON.stringify(t))];
  writeFileSync(thoughtsFile, allLines.slice(0, 100).join('\n') + '\n');
}

// ── End TiM Phase 1 ──

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
