#!/usr/bin/env node
/**
 * ArcKit PostToolUse (Write) Hook - Auto-update docs/manifest.json
 *
 * Fires after any Write tool call. If the written file is an ARC-*.md under
 * projects/, the hook incrementally updates docs/manifest.json so it stays
 * current without requiring a full /arckit:pages re-run.
 *
 * Guards (exit silently if any fail):
 *   - docs/manifest.json doesn't exist (no pages setup yet)
 *   - File path doesn't contain /projects/
 *   - Filename doesn't match ARC-NNN-*-vN.N.md pattern
 *
 * Hook Type: PostToolUse
 * Matcher: Write
 * Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, cwd }
 * Output (stdout): none (PostToolUse hooks are silent)
 * Exit codes:      0 always
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { DOC_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs';
import { isDir, isFile, findRepoRoot, parseHookInput } from './hook-utils.mjs';

// ── Static data (derived from central config) ──

// DOC_TYPE_META: { code: { category, title } } — derived from DOC_TYPES
const DOC_TYPE_META = Object.fromEntries(
  Object.entries(DOC_TYPES).map(([code, { name, category }]) => [code, { category, title: name }])
);

// Subdirectory name → manifest array key (derived from SUBDIR_MAP + reviews)
const SUBDIR_TO_KEY = {};
for (const dir of new Set(Object.values(SUBDIR_MAP))) {
  SUBDIR_TO_KEY[dir] = dir.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
SUBDIR_TO_KEY['reviews'] = 'reviews';

// ── Doc type extraction ──

function extractDocType(filename) {
  const m = filename.match(/^ARC-\d{3}-(.+)-v\d+(\.\d+)?\.md$/);
  if (!m) return null;
  let rest = m[1];

  // Try compound types first (longest match)
  for (const code of Object.keys(DOC_TYPE_META)) {
    if (code.includes('-') && rest.startsWith(code)) {
      return code;
    }
  }

  // Strip trailing -NNN for multi-instance types
  rest = rest.replace(/-\d{3}$/, '');

  return rest;
}

function extractDocId(filename) {
  return filename.replace(/\.md$/, '');
}

/** Strip version to get base ID for dedup: ARC-001-REQ-v1.0 → ARC-001-REQ */
function baseId(documentId) {
  return documentId.replace(/-v\d+(\.\d+)?$/, '');
}

/** Extract first # heading from markdown content */
function extractFirstHeading(content) {
  if (!content) return null;
  const lines = content.split('\n', 20);
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)/);
    if (m) return m[1].trim();
  }
  return null;
}

// ── Main ──

const data = parseHookInput();

const filePath = (data.tool_input || {}).file_path || '';
const fileContent = (data.tool_input || {}).content || '';
const cwd = data.cwd || process.cwd();

// ── Guard: must be an ARC file under projects/ ──
if (!filePath.includes('/projects/')) process.exit(0);

const filename = basename(filePath);
if (!/^ARC-\d{3}-.+-v\d+(\.\d+)?\.md$/.test(filename)) process.exit(0);

// ── Guard: repo must have docs/manifest.json ──
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const manifestPath = join(repoRoot, 'docs', 'manifest.json');
if (!isFile(manifestPath)) process.exit(0);

// ── Parse manifest ──
let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch {
  process.exit(0);
}

// ── Extract file metadata ──
const docType = extractDocType(filename);
const meta = DOC_TYPE_META[docType] || { category: 'Other', title: docType || 'Unknown' };
const documentId = extractDocId(filename);
const newBaseId = baseId(documentId);

// ── Determine project dir and subdirectory from path ──
// Path: .../projects/{NNN-name}/[subdir/]ARC-*.md
const afterProjects = filePath.split('/projects/')[1]; // "001-foo/ARC-..." or "001-foo/decisions/ARC-..."
const parts = afterProjects.split('/');
const projectDirName = parts[0]; // "001-foo" or "000-global"

// Determine if file is in a subdirectory
let subdirName = null;
if (parts.length === 3) {
  // projects/001-foo/decisions/ARC-*.md
  subdirName = parts[1];
}

// Build the relative path for manifest
const relPath = `projects/${afterProjects}`;

// Determine title: for multi-instance types in subdirs, use first heading
let title = meta.title;
if (subdirName && fileContent) {
  const heading = extractFirstHeading(fileContent);
  if (heading) title = heading;
}

// Build the new entry
const newEntry = { path: relPath, title, documentId };

// ── Handle 000-global ──
if (projectDirName === '000-global') {
  // Add category for global docs
  newEntry.category = meta.category;

  if (!Array.isArray(manifest.global)) manifest.global = [];

  // Dedup: remove any existing entry with same base ID
  manifest.global = manifest.global.filter(e => baseId(e.documentId) !== newBaseId);
  manifest.global.push(newEntry);

  // Update defaultDocument if this is a PRIN doc
  if (docType === 'PRIN') {
    const existing = manifest.global.find(d => d.documentId && d.documentId.includes('PRIN'));
    if (existing) {
      existing.isDefault = true;
      manifest.defaultDocument = existing.path;
    }
  }

  // Update timestamp and write
  manifest.generated = new Date().toISOString();
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  process.exit(0);
}

// ── Handle numbered project ──
if (!Array.isArray(manifest.projects)) manifest.projects = [];

// Find existing project or create new one
let project = manifest.projects.find(p => p.id === projectDirName);
if (!project) {
  // Derive display name: "001-fuel-prices" → "Fuel Prices"
  const displayName = projectDirName
    .replace(/^\d{3}-/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  project = {
    id: projectDirName,
    name: displayName,
    documents: [],
  };
  manifest.projects.push(project);
}

// Determine target array key
let targetKey = 'documents';
if (subdirName && SUBDIR_TO_KEY[subdirName]) {
  targetKey = SUBDIR_TO_KEY[subdirName];
}

// Ensure target array exists
if (!Array.isArray(project[targetKey])) project[targetKey] = [];

// For root documents, include category
if (targetKey === 'documents') {
  newEntry.category = meta.category;
}

// Dedup: remove any existing entry with same base ID
project[targetKey] = project[targetKey].filter(e => baseId(e.documentId) !== newBaseId);
project[targetKey].push(newEntry);

// Update timestamp and write
manifest.generated = new Date().toISOString();
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
process.exit(0);
