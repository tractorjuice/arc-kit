#!/usr/bin/env node
/**
 * ArcKit Health Pre-processor Hook
 *
 * Fires on UserPromptSubmit for /arckit:health commands.
 * Pre-extracts metadata from all ARC-* artifacts and applies 7 detection
 * rules in Node.js, providing structured findings in the systemMessage.
 * The command then just formats the console output.
 *
 * This follows the same pattern as sync-guides.mjs for /arckit:pages.
 *
 * Hook Type: UserPromptSubmit (sync, not async)
 * Input (stdin): JSON with user_prompt, cwd, etc.
 * Output (stdout): JSON with systemMessage containing structured findings
 */

import { readFileSync, writeFileSync, statSync, readdirSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
function listDir(p) {
  try { return readdirSync(p).sort(); } catch { return []; }
}
function mtimeMs(p) {
  try { return statSync(p).mtimeMs; } catch { return 0; }
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

// ── Date helpers ──

function daysBetween(dateStr, baseline) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return -1;
  const diff = baseline.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return 'unknown';
  return dateStr;
}

// ── Doc type extraction ──

const COMPOUND_TYPES = ['SECD-MOD', 'PRIN-COMP'];

function extractDocType(filename) {
  const m = filename.match(/^ARC-\d{3}-(.+)-v\d+(\.\d+)?\.md$/);
  if (!m) return null;
  let rest = m[1];

  // Try compound types first
  for (const code of COMPOUND_TYPES) {
    if (rest.startsWith(code)) return code;
  }

  // Strip trailing -NNN for multi-instance types (ADR-001, DIAG-002)
  rest = rest.replace(/-\d{3}$/, '');
  return rest;
}

function extractVersion(filename) {
  const m = filename.match(/-v(\d+(?:\.\d+)?)\.md$/);
  return m ? m[1] : null;
}

// ── Metadata extraction ──

const DOC_CONTROL_RE = /^\|\s*\*\*([^*]+)\*\*\s*\|\s*(.+?)\s*\|/;
const REQ_ID_PATTERN = /\b(BR-\d{3}|FR-\d{3}|NFR-[A-Z]+-\d{3}|NFR-\d{3}|INT-\d{3}|DR-\d{3})\b/g;
const RESOLUTION_KEYWORDS = [
  'resolved', 'addressed', 'completed', 'condition met',
  'fixed in v', 'implemented', 'mitigated', 'satisfied',
];

function extractDocControlFields(content) {
  const fields = {};
  for (const line of content.split('\n')) {
    const m = line.match(DOC_CONTROL_RE);
    if (m) {
      fields[m[1].trim()] = m[2].trim();
    }
  }
  return fields;
}

function extractRequirementIds(content) {
  const ids = new Set();
  let m;
  const re = new RegExp(REQ_ID_PATTERN.source, 'g');
  while ((m = re.exec(content)) !== null) {
    ids.add(m[1]);
  }
  return ids;
}

function extractAdrStatus(content) {
  // Look for Status field in doc control
  const fields = extractDocControlFields(content);
  const status = fields['Status'] || '';

  // Also check for ## Status section content
  const statusMatch = content.match(/##\s*Status\s*\n+\s*(\w+)/i);
  const sectionStatus = statusMatch ? statusMatch[1] : '';

  // Return the most specific one
  if (/proposed/i.test(status)) return 'Proposed';
  if (/proposed/i.test(sectionStatus)) return 'Proposed';
  if (/accepted/i.test(status)) return 'Accepted';
  if (/accepted/i.test(sectionStatus)) return 'Accepted';
  if (/deprecated/i.test(status)) return 'Deprecated';
  if (/superseded/i.test(status)) return 'Superseded';
  return status || sectionStatus || 'Unknown';
}

function extractReviewVerdict(content) {
  if (/APPROVED\s+WITH\s+CONDITIONS/i.test(content)) return 'APPROVED WITH CONDITIONS';
  if (/\bREJECTED\b/i.test(content)) return 'REJECTED';
  if (/\bAPPROVED\b/i.test(content)) return 'APPROVED';
  if (/\bPENDING\b/i.test(content)) return 'PENDING';
  return null;
}

function extractConditions(content) {
  const condSection = content.match(/###?\s*(?:\d+\.?\d*\s+)?Conditions\s*\n([\s\S]*?)(?=\n###?\s|\n---|\n##\s|$)/i);
  if (!condSection) return [];

  const conditions = [];
  const lines = condSection[1].split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const text = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim();
      if (text) conditions.push(text);
    }
  }
  return conditions;
}

function hasResolutionEvidence(content) {
  const lower = content.toLowerCase();
  for (const keyword of RESOLUTION_KEYWORDS) {
    if (lower.includes(keyword)) return true;
  }
  return false;
}

// ── Argument parsing ──

function parseArguments(prompt) {
  const args = {
    project: null,
    severity: 'LOW',
    since: null,
    json: false,
  };

  const text = prompt.replace(/^\/arckit[.:]+health\s*/i, '');

  const projectMatch = text.match(/\bPROJECT\s*=\s*(\S+)/i);
  if (projectMatch) args.project = projectMatch[1];

  const severityMatch = text.match(/\bSEVERITY\s*=\s*(HIGH|MEDIUM|LOW)/i);
  if (severityMatch) args.severity = severityMatch[1].toUpperCase();

  const sinceMatch = text.match(/\bSINCE\s*=\s*(\d{4}-\d{2}-\d{2})/i);
  if (sinceMatch) args.since = sinceMatch[1];

  if (/\bJSON\s*=\s*true\b/i.test(text)) args.json = true;

  return args;
}

// ── Artifact scanning ──

function scanArtifacts(projectDir) {
  const artifacts = [];

  for (const f of listDir(projectDir)) {
    const fp = join(projectDir, f);
    if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
      artifacts.push({ filename: f, path: fp, subdir: null });
    }
  }

  for (const subdir of ['decisions', 'diagrams', 'wardley-maps', 'data-contracts', 'reviews']) {
    const subPath = join(projectDir, subdir);
    if (!isDir(subPath)) continue;
    for (const f of listDir(subPath)) {
      const fp = join(subPath, f);
      if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
        artifacts.push({ filename: f, path: fp, subdir });
      }
    }
  }

  return artifacts;
}

function readArtifactMetadata(artifact) {
  const content = readText(artifact.path);
  if (!content) return null;

  const docType = extractDocType(artifact.filename);
  const version = extractVersion(artifact.filename);
  const fields = extractDocControlFields(content);
  const createdDate = fields['Created Date'] || fields['Created'] || null;
  const lastModified = fields['Last Modified'] || fields['Modified'] || null;
  const status = fields['Status'] || null;

  const meta = {
    filename: artifact.filename,
    path: artifact.path,
    subdir: artifact.subdir,
    relPath: artifact.subdir ? `${artifact.subdir}/${artifact.filename}` : artifact.filename,
    docType,
    version,
    createdDate,
    lastModified,
    status,
    content,
  };

  if (docType === 'ADR') {
    meta.adrStatus = extractAdrStatus(content);
    meta.reqIds = extractRequirementIds(content);
  }

  if (docType === 'HLDR' || docType === 'DLDR') {
    meta.verdict = extractReviewVerdict(content);
    if (meta.verdict === 'APPROVED WITH CONDITIONS') {
      meta.conditions = extractConditions(content);
      meta.unresolvedConditions = meta.conditions.filter(
        () => !hasResolutionEvidence(content)
      );
    }
  }

  if (docType === 'REQ') {
    meta.reqIds = extractRequirementIds(content);
  }

  return meta;
}

// ── External file patterns for recommendations ──

const EXT_PATTERNS = [
  { patterns: [/api/i, /swagger/i, /openapi/i], commands: '/arckit:requirements, /arckit:data-model, /arckit:diagram' },
  { patterns: [/schema/i, /erd/i, /\.sql$/i], commands: '/arckit:data-model, /arckit:data-mesh-contract' },
  { patterns: [/security/i, /pentest/i, /vuln/i], commands: '/arckit:secure, /arckit:dpia' },
  { patterns: [/compliance/i, /audit/i], commands: '/arckit:tcop, /arckit:conformance' },
  { patterns: [/cost/i, /pricing/i, /budget/i], commands: '/arckit:sobc, /arckit:finops' },
  { patterns: [/pipeline/i, /\bci\b/i, /deploy/i], commands: '/arckit:devops' },
  { patterns: [/rfp/i, /itt/i, /tender/i], commands: '/arckit:sow, /arckit:evaluate' },
  { patterns: [/risk/i, /threat/i], commands: '/arckit:risk, /arckit:secure' },
  { patterns: [/policy/i, /standard/i], commands: '/arckit:principles, /arckit:tcop' },
];

function recommendCommands(filename) {
  for (const { patterns, commands } of EXT_PATTERNS) {
    if (patterns.some(p => p.test(filename))) return commands;
  }
  return '/arckit:requirements, /arckit:analyze';
}

// ── Rule application ──

const SEVERITY_ORDER = { HIGH: 3, MEDIUM: 2, LOW: 1 };

function applyRules(projectId, artifacts, externalDir, baseline) {
  const findings = [];
  const metaByType = {};
  const allMeta = [];

  for (const artifact of artifacts) {
    const meta = readArtifactMetadata(artifact);
    if (!meta) continue;
    allMeta.push(meta);
    if (!metaByType[meta.docType]) metaByType[meta.docType] = [];
    metaByType[meta.docType].push(meta);
  }

  // Rule 1: STALE-RSCH
  for (const meta of (metaByType['RSCH'] || [])) {
    const dateStr = meta.lastModified || meta.createdDate;
    if (!dateStr) continue;
    const age = daysBetween(dateStr, baseline);
    if (age > 180) {
      findings.push({
        severity: 'HIGH',
        rule: 'STALE-RSCH',
        file: meta.relPath,
        message: `Last modified: ${formatDate(dateStr)} (${age} days ago)`,
        action: 'Re-run /arckit:research to refresh pricing and vendor data',
      });
    }
  }

  // Rule 2: FORGOTTEN-ADR
  for (const meta of (metaByType['ADR'] || [])) {
    if (meta.adrStatus === 'Proposed') {
      const dateStr = meta.createdDate || meta.lastModified;
      if (!dateStr) continue;
      const age = daysBetween(dateStr, baseline);
      if (age > 30) {
        findings.push({
          severity: 'HIGH',
          rule: 'FORGOTTEN-ADR',
          file: meta.relPath,
          message: `Status: Proposed since ${formatDate(dateStr)} (${age} days without review)`,
          action: 'Schedule architecture review or accept/reject the decision',
        });
      }
    }
  }

  // Rule 3: UNRESOLVED-COND
  for (const type of ['HLDR', 'DLDR']) {
    for (const meta of (metaByType[type] || [])) {
      if (meta.verdict === 'APPROVED WITH CONDITIONS' && meta.unresolvedConditions && meta.unresolvedConditions.length > 0) {
        const condList = meta.unresolvedConditions.map(c => `    - ${c}`).join('\n');
        findings.push({
          severity: 'HIGH',
          rule: 'UNRESOLVED-COND',
          file: meta.relPath,
          message: `Verdict: APPROVED WITH CONDITIONS\n  Unresolved conditions: ${meta.unresolvedConditions.length}\n  Conditions:\n${condList}`,
          action: 'Address conditions and update review document, or schedule follow-up review',
        });
      }
    }
  }

  // Rule 4: ORPHAN-REQ
  const reqMetas = metaByType['REQ'] || [];
  const adrMetas = metaByType['ADR'] || [];

  if (reqMetas.length > 0) {
    const adrReferencedIds = new Set();
    for (const adr of adrMetas) {
      if (adr.reqIds) {
        for (const id of adr.reqIds) adrReferencedIds.add(id);
      }
    }
    // Also check HLDR/DLDR/TRAC for references
    for (const type of ['HLDR', 'DLDR', 'TRAC']) {
      for (const meta of (metaByType[type] || [])) {
        const ids = extractRequirementIds(meta.content);
        for (const id of ids) adrReferencedIds.add(id);
      }
    }

    for (const reqMeta of reqMetas) {
      if (!reqMeta.reqIds || reqMeta.reqIds.size === 0) continue;
      const orphaned = [];
      for (const id of reqMeta.reqIds) {
        if (!adrReferencedIds.has(id)) orphaned.push(id);
      }
      if (orphaned.length > 0) {
        const examples = orphaned.slice(0, 5).join(', ');
        const moreText = orphaned.length > 5 ? ` (+${orphaned.length - 5} more)` : '';
        findings.push({
          severity: 'MEDIUM',
          rule: 'ORPHAN-REQ',
          file: reqMeta.relPath,
          message: `Total requirements: ${reqMeta.reqIds.size}\n  Requirements not referenced by any ADR: ${orphaned.length}\n  Examples: ${examples}${moreText}`,
          action: 'Review whether these requirements need architectural decisions documented as ADRs',
        });
      }
    }
  }

  // Rule 5: MISSING-TRACE
  for (const meta of adrMetas) {
    if (!meta.reqIds || meta.reqIds.size === 0) {
      const hasReqRef = /ARC-\d{3}-REQ/i.test(meta.content);
      if (!hasReqRef) {
        const titleMatch = meta.content.match(/^#\s+(.+)/m);
        const title = titleMatch ? titleMatch[1].trim() : meta.filename;
        findings.push({
          severity: 'MEDIUM',
          rule: 'MISSING-TRACE',
          file: meta.relPath,
          message: `ADR title: ${title}\n  Status: ${meta.adrStatus || 'Unknown'}`,
          action: 'Add requirement references to link this decision to specific requirements',
        });
      }
    }
  }

  // Rule 6: VERSION-DRIFT
  const typeGroups = {};
  for (const meta of allMeta) {
    const key = meta.docType;
    if (!key) continue;
    if (!typeGroups[key]) typeGroups[key] = [];
    typeGroups[key].push(meta);
  }

  for (const [type, metas] of Object.entries(typeGroups)) {
    if (metas.length < 2) continue;
    const sorted = [...metas].sort((a, b) => {
      const va = parseFloat(a.version || '0');
      const vb = parseFloat(b.version || '0');
      return vb - va;
    });
    const latest = sorted[0];
    const dateStr = latest.lastModified || latest.createdDate;
    if (!dateStr) continue;
    const age = daysBetween(dateStr, baseline);
    if (age > 90) {
      const versions = sorted.map(m => `v${m.version}`).join(', ');
      findings.push({
        severity: 'LOW',
        rule: 'VERSION-DRIFT',
        file: latest.relPath,
        message: `Versions found: ${versions}\n  Latest version: ${latest.relPath} (last modified: ${formatDate(dateStr)}, ${age} days ago)`,
        action: 'Confirm the latest version is current, or archive superseded versions',
      });
    }
  }

  // Rule 7: STALE-EXT
  if (isDir(externalDir)) {
    let newestArtifactMtime = 0;
    for (const meta of allMeta) {
      const mt = mtimeMs(meta.path);
      if (mt > newestArtifactMtime) newestArtifactMtime = mt;
    }

    const staleFiles = [];
    for (const f of listDir(externalDir)) {
      if (f === 'README.md') continue;
      const fp = join(externalDir, f);
      if (!isFile(fp)) continue;
      const extMtime = mtimeMs(fp);
      if (extMtime > newestArtifactMtime || newestArtifactMtime === 0) {
        staleFiles.push({
          filename: f,
          commands: recommendCommands(f),
        });
      }
    }

    if (staleFiles.length > 0) {
      const fileList = staleFiles.map(sf => `    - ${sf.filename} → Recommended: ${sf.commands}`).join('\n');
      findings.push({
        severity: 'HIGH',
        rule: 'STALE-EXT',
        file: projectId,
        message: `Unincorporated external files: ${staleFiles.length}\n  Files:\n${fileList}`,
        action: 'Re-run recommended commands to incorporate external file content into architecture artifacts',
      });
    }
  }

  return { findings, artifactCount: allMeta.length };
}

// ── Severity filtering ──

function filterBySeverity(findings, minSeverity) {
  const minLevel = SEVERITY_ORDER[minSeverity] || 1;
  return findings.filter(f => (SEVERITY_ORDER[f.severity] || 0) >= minLevel);
}

// ── JSON output builder ──

function buildJsonOutput(projectResults, baseline) {
  const summary = { HIGH: 0, MEDIUM: 0, LOW: 0, total: 0 };
  const byType = {
    'STALE-RSCH': 0, 'FORGOTTEN-ADR': 0, 'UNRESOLVED-COND': 0,
    'STALE-EXT': 0, 'ORPHAN-REQ': 0, 'MISSING-TRACE': 0, 'VERSION-DRIFT': 0,
  };

  let totalArtifacts = 0;
  const projects = [];

  for (const pr of projectResults) {
    totalArtifacts = totalArtifacts + pr.artifactCount;
    const projEntry = {
      id: pr.projectId,
      artifacts: pr.artifactCount,
      findings: [],
    };

    for (const f of pr.findings) {
      summary[f.severity] = (summary[f.severity] || 0) + 1;
      summary.total = summary.total + 1;
      byType[f.rule] = (byType[f.rule] || 0) + 1;
      projEntry.findings.push({
        severity: f.severity,
        rule: f.rule,
        file: f.file,
        message: f.message,
        action: f.action,
      });
    }

    projects.push(projEntry);
  }

  return {
    generated: baseline.toISOString(),
    scanned: {
      projects: projectResults.length,
      artifacts: totalArtifacts,
    },
    summary,
    byType,
    projects,
  };
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

// Guard: hooks.json matcher triggers on substring "/arckit:health" which can
// false-positive when another command's expanded body mentions /arckit:health.
// Accept raw slash command OR the Skill-expanded body (starts with frontmatter/heading).
const userPrompt = data.user_prompt || '';
const isRawCommand = /^\s*\/arckit[.:]+health\b/i.test(userPrompt);
const isExpandedBody = /^---\s*\n[\s\S]*?description:\s*Scan all projects for stale/i.test(userPrompt)
  || /^#\s*Artifact Health Check/i.test(userPrompt);
if (!isRawCommand && !isExpandedBody) process.exit(0);

// Parse arguments
const args = parseArguments(userPrompt);

// Find repo root
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const projectsDir = join(repoRoot, 'projects');
if (!isDir(projectsDir)) process.exit(0);

// Determine baseline date
const baseline = args.since ? new Date(args.since) : new Date();

// Discover projects to scan
let projectDirs = listDir(projectsDir)
  .filter(e => isDir(join(projectsDir, e)) && /^\d{3}-/.test(e) && e !== '000-global');

// Filter to specific project if requested
if (args.project) {
  const match = projectDirs.find(d =>
    d === args.project || d.startsWith(args.project)
  );
  if (match) {
    projectDirs = [match];
  } else {
    // Project not found — let the command handle the error
    process.exit(0);
  }
}

if (projectDirs.length === 0) process.exit(0);

// Scan all projects
const projectResults = [];

for (const projectName of projectDirs) {
  const projectDir = join(projectsDir, projectName);
  const externalDir = join(projectDir, 'external');
  const artifacts = scanArtifacts(projectDir);

  const { findings, artifactCount } = applyRules(
    projectName, artifacts, externalDir, baseline
  );

  const filtered = filterBySeverity(findings, args.severity);

  projectResults.push({
    projectId: projectName,
    artifactCount,
    findings: filtered,
  });
}

// Build JSON data
const jsonData = buildJsonOutput(projectResults, baseline);

// Write docs/health.json if JSON=true
if (args.json) {
  const docsDir = join(repoRoot, 'docs');
  if (!isDir(docsDir)) mkdirSync(docsDir, { recursive: true });
  writeFileSync(
    join(docsDir, 'health.json'),
    JSON.stringify(jsonData, null, 2),
    'utf8'
  );
}

// Build systemMessage
const lines = [];
lines.push('## Health Pre-processor Complete (hook)');
lines.push('');
lines.push('**All metadata extracted and rules applied. The command only needs to format the console output.**');
lines.push('');
lines.push('### Scan Parameters');
lines.push(`- **Baseline date**: ${baseline.toISOString().split('T')[0]}`);
lines.push(`- **Projects scanned**: ${jsonData.scanned.projects}`);
lines.push(`- **Artifacts scanned**: ${jsonData.scanned.artifacts}`);
lines.push(`- **Severity filter**: ${args.severity}`);
if (args.project) lines.push(`- **Project filter**: ${args.project}`);
if (args.json) lines.push(`- **JSON output**: docs/health.json written`);
lines.push('');

lines.push('### Summary');
lines.push(`- **HIGH**: ${jsonData.summary.HIGH} findings`);
lines.push(`- **MEDIUM**: ${jsonData.summary.MEDIUM} findings`);
lines.push(`- **LOW**: ${jsonData.summary.LOW} findings`);
lines.push(`- **TOTAL**: ${jsonData.summary.total} findings`);
lines.push('');

lines.push('### Findings by Type');
for (const [rule, count] of Object.entries(jsonData.byType)) {
  lines.push(`- **${rule}**: ${count}`);
}
lines.push('');

lines.push('### Per-Project Findings');
lines.push('');

for (const pr of projectResults) {
  lines.push(`#### PROJECT: ${pr.projectId}`);
  lines.push(`Artifacts scanned: ${pr.artifactCount}`);
  lines.push('');

  if (pr.findings.length === 0) {
    lines.push('No issues found.');
    lines.push('');
    continue;
  }

  for (const f of pr.findings) {
    lines.push(`[${f.severity}] ${f.rule}: ${f.file}`);
    for (const msgLine of f.message.split('\n')) {
      lines.push(`  ${msgLine}`);
    }
    lines.push(`  Action: ${f.action}`);
    lines.push('');
  }
}

lines.push('### What to do');
lines.push('- **Skip Steps 1-3** — all metadata has been extracted and rules applied');
lines.push('- **Format the Step 4 console output** using the findings above');
lines.push('- **Include the Step 4.3 Recommended Actions** section using finding counts');
if (args.json) {
  lines.push('- **Step 5 JSON already written** — docs/health.json is complete');
} else {
  lines.push('- **Skip Step 5** — JSON output was not requested');
}

const message = lines.join('\n');

const output = {
  suppressOutput: true,
  systemMessage: message,
};
console.log(JSON.stringify(output));
