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

import { readFileSync, writeFileSync, statSync, mkdirSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';

// ── Utility functions ──

function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}
function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}
function readText(p) {
  try { return readFileSync(p, 'utf8'); } catch { return null; }
}

function findRepoRoot(cwd) {
  let current = resolve(cwd);
  while (true) {
    if (isDir(join(current, 'projects'))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return null;
}

// ── Static data ──

const DOC_TYPE_META = {
  // Discovery
  'REQ':       { category: 'Discovery',     title: 'Requirements' },
  'STKE':      { category: 'Discovery',     title: 'Stakeholder Drivers' },
  'RSCH':      { category: 'Discovery',     title: 'Research Findings' },
  // Planning
  'SOBC':      { category: 'Planning',      title: 'Strategic Outline Business Case' },
  'PLAN':      { category: 'Planning',      title: 'Project Plan' },
  'ROAD':      { category: 'Planning',      title: 'Roadmap' },
  'STRAT':     { category: 'Planning',      title: 'Architecture Strategy' },
  'BKLG':      { category: 'Planning',      title: 'Product Backlog' },
  // Architecture
  'PRIN':      { category: 'Architecture',  title: 'Architecture Principles' },
  'HLDR':      { category: 'Architecture',  title: 'High-Level Design Review' },
  'DLDR':      { category: 'Architecture',  title: 'Detailed Design Review' },
  'DATA':      { category: 'Architecture',  title: 'Data Model' },
  'WARD':      { category: 'Architecture',  title: 'Wardley Map' },
  'DIAG':      { category: 'Architecture',  title: 'Architecture Diagrams' },
  'DFD':       { category: 'Architecture',  title: 'Data Flow Diagram' },
  'ADR':       { category: 'Architecture',  title: 'Architecture Decision Records' },
  // Governance
  'RISK':      { category: 'Governance',    title: 'Risk Register' },
  'TRAC':      { category: 'Governance',    title: 'Traceability Matrix' },
  'PRIN-COMP': { category: 'Governance',    title: 'Principles Compliance' },
  'CONF':      { category: 'Governance',    title: 'Conformance Assessment' },
  'PRES':      { category: 'Governance',    title: 'Presentation' },
  'ANAL':      { category: 'Governance',    title: 'Analysis Report' },
  // Compliance
  'TCOP':      { category: 'Compliance',    title: 'TCoP Assessment' },
  'SECD':      { category: 'Compliance',    title: 'Secure by Design' },
  'SECD-MOD':  { category: 'Compliance',    title: 'MOD Secure by Design' },
  'AIPB':      { category: 'Compliance',    title: 'AI Playbook Assessment' },
  'ATRS':      { category: 'Compliance',    title: 'ATRS Record' },
  'DPIA':      { category: 'Compliance',    title: 'Data Protection Impact Assessment' },
  'JSP936':    { category: 'Compliance',    title: 'JSP 936 Assessment' },
  'SVCASS':    { category: 'Compliance',    title: 'Service Assessment' },
  // Operations
  'SNOW':      { category: 'Operations',    title: 'ServiceNow Design' },
  'DEVOPS':    { category: 'Operations',    title: 'DevOps Strategy' },
  'MLOPS':     { category: 'Operations',    title: 'MLOps Strategy' },
  'FINOPS':    { category: 'Operations',    title: 'FinOps Strategy' },
  'OPS':       { category: 'Operations',    title: 'Operational Readiness' },
  'PLAT':      { category: 'Operations',    title: 'Platform Design' },
  // Procurement
  'SOW':       { category: 'Procurement',   title: 'Statement of Work' },
  'EVAL':      { category: 'Procurement',   title: 'Evaluation Criteria' },
  'DOS':       { category: 'Procurement',   title: 'DOS Requirements' },
  'GCLD':      { category: 'Procurement',   title: 'G-Cloud Search' },
  'GCLC':      { category: 'Procurement',   title: 'G-Cloud Clarifications' },
  'DMC':       { category: 'Procurement',   title: 'Data Mesh Contract' },
  // Research
  'AWRS':      { category: 'Research',      title: 'AWS Research' },
  'AZRS':      { category: 'Research',      title: 'Azure Research' },
  'GCRS':      { category: 'Research',      title: 'GCP Research' },
  'DSCT':      { category: 'Research',      title: 'Data Source Discovery' },
  // Other
  'STORY':     { category: 'Other',         title: 'Project Story' },
};

// Subdirectory name → manifest array key
const SUBDIR_TO_KEY = {
  'diagrams': 'diagrams',
  'decisions': 'decisions',
  'wardley-maps': 'wardleyMaps',
  'data-contracts': 'dataContracts',
  'reviews': 'reviews',
  'research': 'research',
};

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
