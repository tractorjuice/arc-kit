#!/usr/bin/env node
/**
 * ArcKit Stop Hook — Session Learner
 *
 * Fires when a session ends (Stop event). Analyses recent git commits
 * to build a session summary and appends it to .arckit/memory/sessions.md.
 *
 * Uses timestamp tracking (.arckit/memory/.last-session) to capture
 * exactly the commits from this session — no overlap, no gaps.
 *
 * Hook Type: Stop (Notification)
 * Input (stdin):  JSON with session_id, cwd, etc.
 * Output (stdout): empty (notification hook, no output required)
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDir, isFile, readText, parseHookInput } from './hook-utils.mjs';
import { DOC_TYPES } from '../config/doc-types.mjs';

const data = parseHookInput();
const cwd = data.cwd || '.';

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
  process.exit(0);
}

if (!commits) process.exit(0);

const commitLines = commits.split('\n').filter(Boolean);
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

// Detect artifact types from filenames using DOC_TYPES config
const detectedTypes = new Set();
for (const f of files) {
  for (const [code, info] of Object.entries(DOC_TYPES)) {
    if (f.includes(`-${code}-`) || f.includes(`-${code}.`)) {
      detectedTypes.add(`${info.name} (${info.category})`);
    }
  }
}

// Classify session by dominant DOC_TYPES category (priority order)
const CATEGORY_PRIORITY = [
  'Compliance', 'Governance', 'Research', 'Procurement',
  'Architecture', 'Planning', 'Discovery', 'Operations',
];

function classifySession(types) {
  const categories = new Set();
  for (const t of types) {
    const match = t.match(/\((.+)\)$/);
    if (match) categories.add(match[1]);
  }
  for (const cat of CATEGORY_PRIORITY) {
    if (categories.has(cat)) return cat.toLowerCase();
  }
  return 'general';
}

const sessionType = classifySession(detectedTypes);

// Extract commit message summaries (strip hashes)
const commitSummaries = commitLines.map(line => {
  const spaceIdx = line.indexOf(' ');
  return spaceIdx > 0 ? line.substring(spaceIdx + 1) : line;
});

// Build markdown entry
const now = new Date();
const dateStr = now.toISOString().substring(0, 10);
const timeStr = now.toISOString().substring(11, 16);
const artifactList = [...detectedTypes].join(', ') || 'none detected';

let entry = `### ${dateStr} ${timeStr} — ${sessionType}\n\n`;
entry += `- **Commits:** ${commitCount} | **Files changed:** ${files.length}\n`;
entry += `- **Artifacts:** ${artifactList}\n`;

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
