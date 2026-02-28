#!/usr/bin/env node
/**
 * ArcKit Traceability Pre-processor Hook
 *
 * Fires on UserPromptSubmit for /arckit:traceability commands.
 * Pre-extracts all requirement IDs from REQ files, scans ADRs, vendor
 * HLD/DLD files, and review documents for cross-references, computes
 * coverage analysis, and injects structured data as a systemMessage.
 * The command then focuses on AI reasoning (building the matrix, writing
 * the report) rather than I/O.
 *
 * Follows the same pattern as health-scan.mjs for /arckit:health.
 *
 * Hook Type: UserPromptSubmit (sync, not async)
 * Input (stdin): JSON with user_prompt, cwd, etc.
 * Output (stdout): JSON with systemMessage containing structured findings
 */

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

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

// ── Requirement detail extraction ──

/**
 * Parse requirement headings and details from a REQ document.
 * Looks for ### ID: Description headings and priority markers.
 * Returns array of { id, category, description, priority }
 */
function extractRequirementDetails(content) {
  const requirements = [];
  const lines = content.split('\n');

  // Map prefix to category
  const categoryMap = {
    'BR': 'Business',
    'FR': 'Functional',
    'NFR': 'Non-Functional',
    'INT': 'Integration',
    'DR': 'Data',
  };

  // Pattern for requirement headings: ### BR-001: Description text
  const headingRe = /^###\s+((?:BR|FR|NFR(?:-[A-Z]+)?|INT|DR)-\d{3}):\s*(.+)/;
  // Priority patterns in table rows or inline markers
  const priorityRe = /\b(MUST|SHOULD|MAY)\b/;

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(headingRe);
    if (!headingMatch) continue;

    const id = headingMatch[1];
    const description = headingMatch[2].trim();

    // Determine category from prefix
    let category = 'Unknown';
    for (const [prefix, cat] of Object.entries(categoryMap)) {
      if (id.startsWith(prefix)) {
        category = cat;
        break;
      }
    }

    // Look for priority in the next ~10 lines (table rows, inline text)
    let priority = 'SHOULD'; // default
    for (let j = i + 1; j < Math.min(i + 11, lines.length); j++) {
      // Stop if we hit another heading
      if (/^###?\s+/.test(lines[j])) break;
      const pMatch = lines[j].match(priorityRe);
      if (pMatch) {
        priority = pMatch[1];
        break;
      }
    }

    requirements.push({ id, category, description, priority });
  }

  // Fallback: if no heading-style requirements found, extract IDs from content
  // and create minimal entries
  if (requirements.length === 0) {
    const ids = extractRequirementIds(content);
    for (const id of ids) {
      let category = 'Unknown';
      for (const [prefix, cat] of Object.entries(categoryMap)) {
        if (id.startsWith(prefix)) {
          category = cat;
          break;
        }
      }
      requirements.push({ id, category, description: '(extracted from content)', priority: 'SHOULD' });
    }
  }

  return requirements;
}

// ── Argument parsing ──

function parseArguments(prompt) {
  const args = { project: null };

  const text = prompt.replace(/^\/arckit[.:]+traceability\s*/i, '');

  const projectMatch = text.match(/\bPROJECT\s*=\s*(\S+)/i);
  if (projectMatch) {
    args.project = projectMatch[1];
    return args;
  }

  const numMatch = text.match(/\b(\d{3})\b/);
  if (numMatch) {
    args.project = numMatch[1];
    return args;
  }

  return args;
}

// ── Design document scanning ──

/**
 * Scan design documents for requirement ID references.
 * Returns map: reqId -> [{ file, type, vendor? }]
 */
function scanDesignDocs(projectDir) {
  const refMap = {}; // reqId -> [{ file, type, vendor }]

  function addRefs(filePath, relPath, docType, vendor) {
    const content = readText(filePath);
    if (!content) return;
    const ids = extractRequirementIds(content);
    for (const id of ids) {
      if (!refMap[id]) refMap[id] = [];
      refMap[id].push({ file: relPath, type: docType, vendor: vendor || null });
    }
  }

  // ADRs: decisions/ARC-*-ADR-*.md
  const decisionsDir = join(projectDir, 'decisions');
  if (isDir(decisionsDir)) {
    for (const f of listDir(decisionsDir)) {
      if (f.startsWith('ARC-') && f.endsWith('.md') && f.includes('-ADR-')) {
        addRefs(join(decisionsDir, f), `decisions/${f}`, 'ADR', null);
      }
    }
  }

  // Vendor docs: vendors/{vendor}/*.md
  const vendorsDir = join(projectDir, 'vendors');
  if (isDir(vendorsDir)) {
    for (const vendor of listDir(vendorsDir)) {
      const vendorDir = join(vendorsDir, vendor);
      if (!isDir(vendorDir)) continue;

      for (const f of listDir(vendorDir)) {
        if (!f.endsWith('.md')) continue;
        const fp = join(vendorDir, f);
        if (!isFile(fp)) continue;

        // Determine doc type from filename
        let docType = 'Vendor Doc';
        if (f.includes('-HLD-') || f.includes('-HLD.')) docType = 'Vendor HLD';
        else if (f.includes('-DLD-') || f.includes('-DLD.')) docType = 'Vendor DLD';

        addRefs(fp, `vendors/${vendor}/${f}`, docType, vendor);
      }

      // Also scan reviews subdirectory
      const reviewsDir = join(vendorDir, 'reviews');
      if (isDir(reviewsDir)) {
        for (const f of listDir(reviewsDir)) {
          if (!f.endsWith('.md')) continue;
          const fp = join(reviewsDir, f);
          if (!isFile(fp)) continue;

          let docType = 'Review';
          if (f.includes('-HLDR-')) docType = 'HLDR';
          else if (f.includes('-DLDR-')) docType = 'DLDR';

          addRefs(fp, `vendors/${vendor}/reviews/${f}`, docType, vendor);
        }
      }
    }
  }

  // Root-level reviews: reviews/ARC-*-HLDR-*.md and reviews/ARC-*-DLDR-*.md
  const reviewsDir = join(projectDir, 'reviews');
  if (isDir(reviewsDir)) {
    for (const f of listDir(reviewsDir)) {
      if (!f.startsWith('ARC-') || !f.endsWith('.md')) continue;
      let docType = 'Review';
      if (f.includes('-HLDR-')) docType = 'HLDR';
      else if (f.includes('-DLDR-')) docType = 'DLDR';
      addRefs(join(reviewsDir, f), `reviews/${f}`, docType, null);
    }
  }

  // Also check root-level HLDR/DLDR files
  for (const f of listDir(projectDir)) {
    if (!f.startsWith('ARC-') || !f.endsWith('.md')) continue;
    if (f.includes('-HLDR-') || f.includes('-DLDR-')) {
      let docType = f.includes('-HLDR-') ? 'HLDR' : 'DLDR';
      addRefs(join(projectDir, f), f, docType, null);
    }
  }

  return refMap;
}

/**
 * Collect design document stats for reporting.
 * Returns { adrs: [], vendorDocs: { vendor: [files] }, reviews: [] }
 */
function collectDesignDocStats(projectDir) {
  const stats = { adrs: [], vendorDocs: {}, reviews: [] };

  // ADRs
  const decisionsDir = join(projectDir, 'decisions');
  if (isDir(decisionsDir)) {
    for (const f of listDir(decisionsDir)) {
      if (f.startsWith('ARC-') && f.endsWith('.md') && f.includes('-ADR-')) {
        stats.adrs.push(`decisions/${f}`);
      }
    }
  }

  // Vendor docs
  const vendorsDir = join(projectDir, 'vendors');
  if (isDir(vendorsDir)) {
    for (const vendor of listDir(vendorsDir)) {
      const vendorDir = join(vendorsDir, vendor);
      if (!isDir(vendorDir)) continue;

      for (const f of listDir(vendorDir)) {
        if (!f.endsWith('.md')) continue;
        if (!isFile(join(vendorDir, f))) continue;
        if (!stats.vendorDocs[vendor]) stats.vendorDocs[vendor] = [];
        stats.vendorDocs[vendor].push(f);
      }

      // Reviews in vendor subdirectory
      const reviewsDir = join(vendorDir, 'reviews');
      if (isDir(reviewsDir)) {
        for (const f of listDir(reviewsDir)) {
          if (!f.endsWith('.md') || !isFile(join(reviewsDir, f))) continue;
          stats.reviews.push(`vendors/${vendor}/reviews/${f}`);
        }
      }
    }
  }

  // Root-level reviews
  const reviewsDir = join(projectDir, 'reviews');
  if (isDir(reviewsDir)) {
    for (const f of listDir(reviewsDir)) {
      if (f.startsWith('ARC-') && f.endsWith('.md')) {
        stats.reviews.push(`reviews/${f}`);
      }
    }
  }

  // Root-level HLDR/DLDR
  for (const f of listDir(projectDir)) {
    if (!f.startsWith('ARC-') || !f.endsWith('.md')) continue;
    if (f.includes('-HLDR-') || f.includes('-DLDR-')) {
      stats.reviews.push(f);
    }
  }

  return stats;
}

// ── Coverage analysis ──

function computeCoverage(requirements, refMap) {
  const coverage = {
    total: requirements.length,
    covered: 0,
    orphan: [],         // in REQ but no design reference
    designOnly: [],     // in design docs but not in REQ
    byCategory: {},     // { Business: { total, covered }, ... }
    byPriority: {},     // { MUST: { total, covered }, ... }
  };

  const reqIdSet = new Set(requirements.map(r => r.id));

  for (const req of requirements) {
    const refs = refMap[req.id];
    const isCovered = refs && refs.length > 0;

    if (isCovered) {
      coverage.covered = coverage.covered + 1;
    } else {
      coverage.orphan.push(req);
    }

    // By category
    if (!coverage.byCategory[req.category]) {
      coverage.byCategory[req.category] = { total: 0, covered: 0, prefix: '' };
    }
    coverage.byCategory[req.category].total = coverage.byCategory[req.category].total + 1;
    if (isCovered) {
      coverage.byCategory[req.category].covered = coverage.byCategory[req.category].covered + 1;
    }

    // By priority
    if (!coverage.byPriority[req.priority]) {
      coverage.byPriority[req.priority] = { total: 0, covered: 0 };
    }
    coverage.byPriority[req.priority].total = coverage.byPriority[req.priority].total + 1;
    if (isCovered) {
      coverage.byPriority[req.priority].covered = coverage.byPriority[req.priority].covered + 1;
    }
  }

  // Set category prefixes for display
  const prefixMap = { 'Business': 'BR', 'Functional': 'FR', 'Non-Functional': 'NFR', 'Integration': 'INT', 'Data': 'DR' };
  for (const [cat, catData] of Object.entries(coverage.byCategory)) {
    catData.prefix = prefixMap[cat] || cat;
  }

  // Design-only references: IDs in refMap but not in REQ
  for (const id of Object.keys(refMap)) {
    if (!reqIdSet.has(id)) {
      coverage.designOnly.push({ id, refs: refMap[id] });
    }
  }

  return coverage;
}

// ── Version detection ──

function detectExistingTracVersion(projectDir) {
  let highestVersion = null;
  let highestNum = 0;

  for (const f of listDir(projectDir)) {
    if (!f.startsWith('ARC-') || !f.endsWith('.md')) continue;
    const docType = extractDocType(f);
    if (docType !== 'TRAC') continue;

    const version = extractVersion(f);
    if (!version) continue;

    const num = parseFloat(version);
    if (num > highestNum) {
      highestNum = num;
      highestVersion = version;
    }
  }

  return highestVersion;
}

function suggestNextVersion(existingVersion) {
  if (!existingVersion) return '1.0';
  const parts = existingVersion.split('.');
  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1] || '0', 10);
  return `${major}.${minor + 1}`;
}

// ── Percentage formatting ──

function pct(covered, total) {
  if (total === 0) return '0%';
  return `${Math.round((covered / total) * 100)}%`;
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

// Guard: hooks.json matcher triggers on substring "/arckit:traceability" which can
// false-positive when another command's expanded body mentions /arckit:traceability.
// Accept raw slash command OR the Skill-expanded body (starts with frontmatter/heading).
const userPrompt = data.user_prompt || '';
const isRawCommand = /^\s*\/arckit[.:]+traceability\b/i.test(userPrompt);
const isExpandedBody = /^---\s*\n[\s\S]*?description:\s*Generate requirements traceability/i.test(userPrompt)
  || /^#\s*You are helping an enterprise architect/i.test(userPrompt);
if (!isRawCommand && !isExpandedBody) process.exit(0);

// Parse arguments
const args = parseArguments(userPrompt);

// Find repo root
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const projectsDir = join(repoRoot, 'projects');
if (!isDir(projectsDir)) process.exit(0);

// Discover projects
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

// Traceability is single-project; if multiple found and no filter, exit silently
if (projectDirs.length === 0) process.exit(0);
if (projectDirs.length > 1 && !args.project) {
  // No project specified and multiple exist — let the command ask the user
  process.exit(0);
}

const projectName = projectDirs[0];
const projectDir = join(projectsDir, projectName);

// Phase 1: Requirements extraction
const allRequirements = [];
const reqFiles = [];

for (const f of listDir(projectDir)) {
  if (!f.startsWith('ARC-') || !f.endsWith('.md')) continue;
  const docType = extractDocType(f);
  if (docType !== 'REQ') continue;

  const content = readText(join(projectDir, f));
  if (!content) continue;

  reqFiles.push(f);
  const reqs = extractRequirementDetails(content);
  for (const req of reqs) {
    req.sourceFile = f;
    allRequirements.push(req);
  }
}

if (allRequirements.length === 0) {
  // No requirements found — let the command handle this
  process.exit(0);
}

// Phase 2: Design document scanning
const refMap = scanDesignDocs(projectDir);
const docStats = collectDesignDocStats(projectDir);

// Phase 3: Coverage analysis
const coverage = computeCoverage(allRequirements, refMap);

// Phase 4: Version detection
const existingVersion = detectExistingTracVersion(projectDir);
const suggestedVersion = suggestNextVersion(existingVersion);

// Phase 5: Build systemMessage
const lines = [];

lines.push('## Traceability Pre-processor Complete (hook)');
lines.push('');
lines.push('**All requirement IDs extracted and cross-referenced.**');
lines.push('');

lines.push('### Project');
lines.push(`- **Project**: ${projectName}`);
lines.push(`- **REQ files scanned**: ${reqFiles.join(', ')}`);
lines.push(`- **Existing TRAC version**: ${existingVersion || 'none'}`);
lines.push(`- **Suggested next version**: v${suggestedVersion}`);
lines.push('');

// Requirements table
lines.push('### REQUIREMENTS \u2014 use these directly to build the matrix');
lines.push('');
lines.push('| Req ID | Category | Priority | Description | Covered | Referenced By |');
lines.push('|--------|----------|----------|-------------|---------|---------------|');

for (const req of allRequirements) {
  const refs = refMap[req.id];
  const isCovered = refs && refs.length > 0;
  const refList = isCovered
    ? refs.map(r => r.file).join(', ')
    : '\u2014';
  // Truncate long descriptions for the table
  const desc = req.description.length > 80
    ? req.description.substring(0, 77) + '...'
    : req.description;
  lines.push(`| ${req.id} | ${req.category} | ${req.priority} | ${desc} | ${isCovered ? 'Yes' : 'No'} | ${refList} |`);
}

lines.push('');

// Coverage summary
lines.push('### COVERAGE SUMMARY');
lines.push('');
lines.push('| Metric | Covered | Total | Pct |');
lines.push('|--------|---------|-------|-----|');
lines.push(`| Overall | ${coverage.covered} | ${coverage.total} | ${pct(coverage.covered, coverage.total)} |`);

// By category
const categoryOrder = ['Business', 'Functional', 'Non-Functional', 'Integration', 'Data'];
for (const cat of categoryOrder) {
  const catData = coverage.byCategory[cat];
  if (!catData) continue;
  lines.push(`| ${cat} (${catData.prefix}) | ${catData.covered} | ${catData.total} | ${pct(catData.covered, catData.total)} |`);
}

// By priority
const priorityOrder = ['MUST', 'SHOULD', 'MAY'];
for (const pri of priorityOrder) {
  const priData = coverage.byPriority[pri];
  if (!priData) continue;
  lines.push(`| ${pri} priority | ${priData.covered} | ${priData.total} | ${pct(priData.covered, priData.total)} |`);
}

lines.push('');

// Orphan requirements
if (coverage.orphan.length > 0) {
  lines.push('### Orphan Requirements (no design coverage)');
  lines.push('');
  for (const req of coverage.orphan) {
    lines.push(`- ${req.id}: ${req.description}`);
  }
  lines.push('');
}

// Design-only references
if (coverage.designOnly.length > 0) {
  lines.push('### Design-Only References (not in REQ \u2014 scope creep?)');
  lines.push('');
  for (const entry of coverage.designOnly) {
    const files = entry.refs.map(r => r.file).join(', ');
    lines.push(`- ${entry.id} referenced in ${files}`);
  }
  lines.push('');
}

// Design documents scanned
lines.push('### Design Documents Scanned');
lines.push('');
lines.push(`- ADRs: ${docStats.adrs.length}${docStats.adrs.length > 0 ? ` (${docStats.adrs.join(', ')})` : ''}`);

const vendorEntries = Object.entries(docStats.vendorDocs);
const totalVendorDocs = vendorEntries.reduce((sum, [, files]) => sum + files.length, 0);
if (vendorEntries.length > 0) {
  const vendorList = vendorEntries.map(([v, files]) => `${v}: ${files.join(', ')}`).join('; ');
  lines.push(`- Vendor docs: ${totalVendorDocs} (${vendorList})`);
} else {
  lines.push('- Vendor docs: 0');
}

lines.push(`- Reviews: ${docStats.reviews.length}${docStats.reviews.length > 0 ? ` (${docStats.reviews.join(', ')})` : ''}`);
lines.push('');

// What to do
lines.push('### What to do');
lines.push('- **Use the requirements table and coverage data** to build the traceability matrix');
lines.push('- **Still read vendor HLD/DLD** if you need component names for design mapping columns');
lines.push('- **Still read the template** for formatting');
lines.push('- **Write outputs** per the command instructions');

const message = lines.join('\n');

const output = {
  suppressOutput: true,
  systemMessage: message,
};
console.log(JSON.stringify(output));
