#!/usr/bin/env node
/**
 * ArcKit Impact Analysis Pre-processor Hook
 *
 * Fires on UserPromptSubmit for /arckit:impact commands.
 * Builds a dependency graph from cross-references between ARC documents,
 * enabling reverse traversal to determine the blast radius of changes.
 *
 * Hook Type: UserPromptSubmit (sync)
 * Input (stdin): JSON with prompt, cwd, etc.
 * Output (stdout): JSON with additionalContext containing dependency graph
 */

import { join } from 'node:path';
import {
  isDir, isFile, readText, listDir,
  findRepoRoot, extractDocType, extractVersion,
  extractDocControlFields, extractRequirementIds,
  parseHookInput,
} from './hook-utils.mjs';
import { DOC_TYPES } from '../config/doc-types.mjs';

// ── Argument parsing ──

function parseArguments(prompt) {
  const text = prompt.replace(/^\/arckit[.:]+impact\s*/i, '');
  return text.trim();
}

// ── Title extraction ──

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : null;
}

// ── Severity classification by doc type category ──

function classifySeverity(docType) {
  const info = DOC_TYPES[docType];
  if (!info) return 'LOW';
  const cat = info.category;
  if (cat === 'Compliance' || cat === 'Governance') return 'HIGH';
  if (cat === 'Architecture') return 'MEDIUM';
  return 'LOW';
}

// ── Artifact scanning ──

function scanAllArtifacts(projectsDir) {
  const nodes = {};   // docId -> { type, project, path, title, status }
  const edges = [];   // { from, to, type }
  const reqIndex = {}; // reqId -> [docIds]

  const projectDirs = listDir(projectsDir)
    .filter(e => isDir(join(projectsDir, e)) && /^\d{3}-/.test(e));

  for (const projectName of projectDirs) {
    const projectDir = join(projectsDir, projectName);
    scanProjectDir(projectDir, projectName, nodes, edges, reqIndex);
  }

  return { nodes, edges, reqIndex, projects: projectDirs };
}

function scanProjectDir(projectDir, projectName, nodes, edges, reqIndex) {
  const dirsToScan = [
    { dir: projectDir, prefix: '' },
    { dir: join(projectDir, 'decisions'), prefix: 'decisions/' },
    { dir: join(projectDir, 'diagrams'), prefix: 'diagrams/' },
    { dir: join(projectDir, 'wardley-maps'), prefix: 'wardley-maps/' },
    { dir: join(projectDir, 'data-contracts'), prefix: 'data-contracts/' },
    { dir: join(projectDir, 'reviews'), prefix: 'reviews/' },
    { dir: join(projectDir, 'research'), prefix: 'research/' },
  ];

  // Also scan vendor directories
  const vendorsDir = join(projectDir, 'vendors');
  if (isDir(vendorsDir)) {
    for (const vendor of listDir(vendorsDir)) {
      const vd = join(vendorsDir, vendor);
      if (isDir(vd)) {
        dirsToScan.push({ dir: vd, prefix: `vendors/${vendor}/` });
        const vrd = join(vd, 'reviews');
        if (isDir(vrd)) {
          dirsToScan.push({ dir: vrd, prefix: `vendors/${vendor}/reviews/` });
        }
      }
    }
  }

  for (const { dir, prefix } of dirsToScan) {
    if (!isDir(dir)) continue;
    for (const f of listDir(dir)) {
      if (!f.startsWith('ARC-') || !f.endsWith('.md')) continue;
      const fp = join(dir, f);
      if (!isFile(fp)) continue;

      const content = readText(fp);
      if (!content) continue;

      const docType = extractDocType(f);
      const version = extractVersion(f);
      const fields = extractDocControlFields(content);
      const title = extractTitle(content) || fields['Document Title'] || f;
      const status = fields['Status'] || '';

      // Build a short document ID (without version for matching)
      const shortId = f.replace(/-v[\d.]+\.md$/, '');
      const fullId = f.replace(/\.md$/, '');

      nodes[fullId] = {
        type: docType,
        project: projectName,
        path: `projects/${projectName}/${prefix}${f}`,
        title,
        status,
        severity: classifySeverity(docType),
      };

      // Extract requirement IDs referenced in this document
      const reqIds = extractRequirementIds(content);
      for (const reqId of reqIds) {
        if (!reqIndex[reqId]) reqIndex[reqId] = [];
        if (!reqIndex[reqId].includes(fullId)) {
          reqIndex[reqId].push(fullId);
        }
      }

      // Extract cross-references to other ARC documents
      const ARC_REF_RE = /\bARC-(\d{3})-([A-Z][\w-]*?)(?:-(\d{3}))?(?:-v[\d.]+)?(?:\.md)?\b/g;
      let match;
      while ((match = ARC_REF_RE.exec(content)) !== null) {
        const refStr = match[0].replace(/\.md$/, '');
        // Build a normalized reference ID
        const refShort = refStr.replace(/-v[\d.]+$/, '');
        if (refShort !== shortId) {
          edges.push({ from: fullId, to: refShort, type: 'references' });
        }
      }
    }
  }
}

// ── Main ──

const data = parseHookInput();

// Guard: only fire for /arckit:impact
const userPrompt = data.prompt || '';
const isRawCommand = /^\s*\/arckit[.:]+impact\b/i.test(userPrompt);
const isExpandedBody = /description:\s*Analyse the blast radius/i.test(userPrompt);
if (!isRawCommand && !isExpandedBody) process.exit(0);

const query = parseArguments(userPrompt);

// Find repo root
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const projectsDir = join(repoRoot, 'projects');
if (!isDir(projectsDir)) process.exit(0);

// Build dependency graph
const { nodes, edges, reqIndex, projects } = scanAllArtifacts(projectsDir);

const nodeCount = Object.keys(nodes).length;
const edgeCount = edges.length;
const reqCount = Object.keys(reqIndex).length;

// Build output
const lines = [];
lines.push('## Impact Pre-processor Complete (hook)');
lines.push('');
lines.push(`**Dependency graph built: ${nodeCount} documents, ${edgeCount} cross-references, ${reqCount} requirement IDs across ${projects.length} project(s).**`);
lines.push('');
lines.push(`**User query:** ${query || '(no query provided)'}`);
lines.push('');
lines.push('### DEPENDENCY GRAPH (JSON)');
lines.push('');
lines.push('```json');
lines.push(JSON.stringify({ nodes, edges, reqIndex }, null, 2));
lines.push('```');
lines.push('');
lines.push('### Impact Severity Classification');
lines.push('| Category | Severity | Document Types |');
lines.push('|----------|----------|---------------|');
lines.push('| Compliance/Governance | HIGH | TCOP, SECD, DPIA, SVCASS, RISK, TRAC, CONF |');
lines.push('| Architecture | MEDIUM | HLDR, DLDR, ADR, DATA, DIAG, PLAT |');
lines.push('| Planning/Other | LOW | PLAN, ROAD, BKLG, SOBC, OPS, PRES |');
lines.push('');
lines.push('### Instructions');
lines.push('- Parse query: ARC document ID, requirement ID (e.g. BR-003), or type+project');
lines.push('- Perform reverse traversal through edges (max depth 5)');
lines.push('- Classify impact severity using node severity field');
lines.push('- Output impact chain table, summary counts, and recommended actions');
lines.push('- Suggest specific /arckit commands to re-run for HIGH severity impacts');

const message = lines.join('\n');

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: message,
  },
};
console.log(JSON.stringify(output));
