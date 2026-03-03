/**
 * ArcKit Hook Utilities — Shared module for all hooks
 *
 * Extracts common file-system helpers, repo discovery, doc-type parsing,
 * metadata extraction, and stdin/JSON parsing so each hook can import
 * them instead of copy-pasting ~80 lines of identical code.
 *
 * Issue #98: "Reusable utilities could be extracted into a shared
 * hook-utils.mjs module as the hook count grows."
 */

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DOC_TYPES } from '../config/doc-types.mjs';

// ── File System ──

export function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

export function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}

export function readText(p) {
  try { return readFileSync(p, 'utf8'); } catch { return null; }
}

export function listDir(p) {
  try { return readdirSync(p).sort(); } catch { return []; }
}

export function mtimeMs(p) {
  try { return statSync(p).mtimeMs; } catch { return 0; }
}

// ── Repository Discovery ──

export function findRepoRoot(cwd) {
  let current = resolve(cwd);
  while (true) {
    if (isDir(join(current, 'projects'))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return null;
}

// ── Doc Type Extraction ──

// Derive compound types from DOC_TYPES config instead of hardcoding
const COMPOUND_TYPES = Object.keys(DOC_TYPES).filter(k => k.includes('-'));

export function extractDocType(filename) {
  const m = filename.match(/^ARC-\d{3}-(.+)-v\d+(\.\d+)?\.md$/);
  if (!m) return null;
  let rest = m[1];

  // Try compound types first (e.g. SECD-MOD, PRIN-COMP)
  for (const code of COMPOUND_TYPES) {
    if (rest.startsWith(code)) return code;
  }

  // Strip trailing -NNN for multi-instance types (ADR-001, DIAG-002)
  rest = rest.replace(/-\d{3}$/, '');
  return rest;
}

export function extractVersion(filename) {
  const m = filename.match(/-v(\d+(?:\.\d+)?)\.md$/);
  return m ? m[1] : null;
}

// ── Metadata Extraction ──

const DOC_CONTROL_RE = /^\|\s*\*\*([^*]+)\*\*\s*\|\s*(.+?)\s*\|/;
const REQ_ID_PATTERN = /\b(BR-\d{3}|FR-\d{3}|NFR-[A-Z]+-\d{3}|NFR-\d{3}|INT-\d{3}|DR-\d{3})\b/g;

export function extractDocControlFields(content) {
  const fields = {};
  for (const line of content.split('\n')) {
    const m = line.match(DOC_CONTROL_RE);
    if (m) {
      fields[m[1].trim()] = m[2].trim();
    }
  }
  return fields;
}

export function extractRequirementIds(content) {
  const ids = new Set();
  let m;
  const re = new RegExp(REQ_ID_PATTERN.source, 'g');
  while ((m = re.exec(content)) !== null) {
    ids.add(m[1]);
  }
  return ids;
}

// ── Hook Input ──

/**
 * Read stdin and parse as JSON. Exits the process silently on any failure
 * (empty stdin, invalid JSON). This consolidates the 12-line pattern that
 * every hook repeats.
 *
 * @returns {object} Parsed hook input data
 */
export function parseHookInput() {
  let raw = '';
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    process.exit(0);
  }
  if (!raw || !raw.trim()) process.exit(0);

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  return data;
}
