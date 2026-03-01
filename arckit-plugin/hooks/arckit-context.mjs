#!/usr/bin/env node
/**
 * ArcKit UserPromptSubmit Hook
 *
 * Pre-computes project context when any /arckit: command is run.
 * Injects project inventory, artifact lists, and external documents
 * as a systemMessage so commands don't need to discover this themselves.
 *
 * Hook Type: UserPromptSubmit
 * Input (stdin): JSON with user_prompt, cwd, etc.
 * Output (stdout): JSON with systemMessage containing project context
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}
function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}
function mtime(p) {
  try { return statSync(p).mtimeMs; } catch { return 0; }
}

// Doc type code to human-readable name mapping
const DOC_TYPE_NAMES = {
  'PRIN': 'Architecture Principles',
  'STKE': 'Stakeholder Analysis',
  'REQ': 'Requirements',
  'RISK': 'Risk Register',
  'SOBC': 'Business Case',
  'PLAN': 'Project Plan',
  'ROAD': 'Roadmap',
  'STRAT': 'Architecture Strategy',
  'BKLG': 'Product Backlog',
  'HLDR': 'High-Level Design Review',
  'DLDR': 'Detailed Design Review',
  'DATA': 'Data Model',
  'WARD': 'Wardley Map',
  'DIAG': 'Architecture Diagram',
  'DFD': 'Data Flow Diagram',
  'ADR': 'Architecture Decision Record',
  'TRAC': 'Traceability Matrix',
  'TCOP': 'TCoP Assessment',
  'SECD': 'Secure by Design',
  'SECD-MOD': 'MOD Secure by Design',
  'AIPB': 'AI Playbook Assessment',
  'ATRS': 'ATRS Record',
  'DPIA': 'Data Protection Impact Assessment',
  'JSP936': 'JSP 936 Assessment',
  'SVCASS': 'Service Assessment',
  'SNOW': 'ServiceNow Design',
  'DEVOPS': 'DevOps Strategy',
  'MLOPS': 'MLOps Strategy',
  'FINOPS': 'FinOps Strategy',
  'OPS': 'Operational Readiness',
  'PLAT': 'Platform Design',
  'SOW': 'Statement of Work',
  'EVAL': 'Evaluation Criteria',
  'DOS': 'DOS Requirements',
  'GCLD': 'G-Cloud Search',
  'GCLC': 'G-Cloud Clarifications',
  'DMC': 'Data Mesh Contract',
  'RSCH': 'Research Findings',
  'AWRS': 'AWS Research',
  'AZRS': 'Azure Research',
  'GCRS': 'GCP Research',
  'DSCT': 'Data Source Discovery',
  'STORY': 'Project Story',
  'ANAL': 'Analysis Report',
  'PRIN-COMP': 'Principles Compliance',
  'CONF': 'Conformance Assessment',
};

// Multi-instance type regex
const MULTI_INSTANCE_RE = /^([A-Z]+-?[A-Z]*)-\d{3}$/;

function docTypeName(code) {
  return DOC_TYPE_NAMES[code] || code;
}

function extractDocType(filename) {
  // ARC-001-REQ-v1.0.md -> REQ
  // ARC-001-ADR-001-v1.0.md -> ADR
  // ARC-001-SECD-MOD-v1.0.md -> SECD-MOD
  const m = filename.match(/^ARC-\d{3}-(.+)$/);
  if (!m) return filename;
  let rest = m[1];
  // Remove version suffix: -vN.N.md or -vN.N
  rest = rest.replace(/-v\d+(\.\d+)?\.md$/, '');
  rest = rest.replace(/-v\d+(\.\d+)?$/, '');
  // Strip trailing -NNN for multi-instance types
  const mm = rest.match(MULTI_INSTANCE_RE);
  if (mm) return mm[1];
  return rest;
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

// --- Main ---
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

const userPrompt = data.user_prompt || '';

// Only run for /arckit: commands
if (!userPrompt.startsWith('/arckit:')) process.exit(0);

// Commands that don't need project context
const cmdMatch = userPrompt.match(/^\/arckit:([a-z_-]*)/);
if (cmdMatch) {
  const command = cmdMatch[1];
  if (['pages', 'customize', 'create', 'init', 'list', 'trello'].includes(command)) {
    process.exit(0);
  }
}

// Find repo root
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const projectsDir = join(repoRoot, 'projects');
if (!isDir(projectsDir)) process.exit(0);

// Read ArcKit version from plugin VERSION file
const pluginRoot = resolve(import.meta.url.replace('file://', ''), '..', '..');
let arckitVersion = 'unknown';
try {
  arckitVersion = readFileSync(join(pluginRoot, 'VERSION'), 'utf8').trim();
} catch { /* ignore */ }

// Build context string
const lines = [];
lines.push('## ArcKit Project Context (auto-detected by hook)\n');
lines.push(`Repository: ${repoRoot}`);
lines.push(`ArcKit Version: ${arckitVersion}\n`);

// Count projects
const projectEntries = readdirSync(projectsDir)
  .filter(e => isDir(join(projectsDir, e)))
  .sort();
lines.push(`**${projectEntries.length} project(s) found:**\n`);

// Scan each project
for (const projectName of projectEntries) {
  const projectDir = join(projectsDir, projectName);

  // Extract project number
  let projectNumber = '';
  const pm = projectName.match(/^(\d{3})-/);
  if (pm) projectNumber = pm[1];

  lines.push(`### ${projectName}`);
  lines.push(`- **Path**: ${projectDir}`);
  if (projectNumber) lines.push(`- **Project ID**: ${projectNumber}`);

  // Scan for ARC-* artifacts in main project dir
  const artifactList = [];
  let artifactCount = 0;
  let newestArtifactMtime = 0;

  for (const f of readdirSync(projectDir).sort()) {
    const fp = join(projectDir, f);
    if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
      const dtype = extractDocType(f);
      const dname = docTypeName(dtype);
      artifactList.push(`  - \`${f}\` (${dname})`);
      artifactCount++;
      const amtime = mtime(fp);
      if (amtime > newestArtifactMtime) newestArtifactMtime = amtime;
    }
  }

  // Also scan subdirectories
  for (const subdir of ['decisions', 'diagrams', 'wardley-maps', 'data-contracts', 'reviews']) {
    const subPath = join(projectDir, subdir);
    if (isDir(subPath)) {
      for (const f of readdirSync(subPath).sort()) {
        const fp = join(subPath, f);
        if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
          const dtype = extractDocType(f);
          const dname = docTypeName(dtype);
          artifactList.push(`  - \`${subdir}/${f}\` (${dname})`);
          artifactCount++;
          const amtime = mtime(fp);
          if (amtime > newestArtifactMtime) newestArtifactMtime = amtime;
        }
      }
    }
  }

  if (artifactCount > 0) {
    lines.push(`- **Artifacts** (${artifactCount}):`);
    lines.push(...artifactList);
  } else {
    lines.push('- **Artifacts**: none');
  }

  // Check for vendor directories
  const vendorsDir = join(projectDir, 'vendors');
  if (isDir(vendorsDir)) {
    const vendorList = [];
    for (const vname of readdirSync(vendorsDir).sort()) {
      const vpath = join(vendorsDir, vname);
      if (isDir(vpath)) vendorList.push(`  - ${vname}`);
    }
    if (vendorList.length > 0) {
      lines.push(`- **Vendors** (${vendorList.length}):`);
      lines.push(...vendorList);
    }
  }

  // Check for external documents
  const externalDir = join(projectDir, 'external');
  if (isDir(externalDir)) {
    const extList = [];
    for (const f of readdirSync(externalDir).sort()) {
      const fp = join(externalDir, f);
      if (!isFile(fp)) continue;
      if (f === 'README.md') continue;
      const extMtime = mtime(fp);
      if (extMtime > newestArtifactMtime) {
        extList.push(`  - \`${f}\` (**NEW** \u2014 newer than latest artifact)`);
      } else {
        extList.push(`  - \`${f}\``);
      }
    }
    if (extList.length > 0) {
      lines.push(`- **External documents** (${extList.length}) in \`external/\`:`);
      lines.push(...extList);
    }
  }

  lines.push(''); // blank line between projects
}

// Check for global policies
const policiesDir = join(projectsDir, '000-global', 'policies');
if (isDir(policiesDir)) {
  const policyList = [];
  for (const f of readdirSync(policiesDir).sort()) {
    const fp = join(policiesDir, f);
    if (isFile(fp)) policyList.push(`  - \`${f}\``);
  }
  if (policyList.length > 0) {
    lines.push('### Global Policies (000-global/policies/)');
    lines.push(...policyList);
    lines.push('');
  }
}

const contextText = lines.join('\n');

const output = {
  suppressOutput: true,
  systemMessage: contextText,
};
console.log(JSON.stringify(output));
