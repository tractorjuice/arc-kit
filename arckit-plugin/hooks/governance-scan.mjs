#!/usr/bin/env node
/**
 * ArcKit Governance Pre-processor Hook
 *
 * Fires on UserPromptSubmit for /arckit:analyze commands.
 * Pre-extracts all artifact metadata, requirements, principles, risks,
 * cross-references, vendor data, and placeholder counts in Node.js,
 * providing structured data via additionalContext. The command then
 * focuses on AI reasoning (semantic analysis, detection passes, report
 * generation) rather than I/O.
 *
 * Follows the same pattern as health-scan.mjs and traceability-scan.mjs.
 *
 * Hook Type: UserPromptSubmit (sync, not async)
 * Input (stdin): JSON with prompt, cwd, etc.
 * Output (stdout): JSON with additionalContext containing structured findings
 */

import { join, resolve } from 'node:path';
import {
  isDir, isFile, readText, listDir,
  findRepoRoot, extractDocType, extractVersion,
  extractDocControlFields, extractRequirementIds,
  extractRequirementDetails, extractPrinciples, extractRiskEntries,
  parseHookInput,
} from './hook-utils.mjs';

// ── Argument parsing ──

function parseArguments(prompt) {
  const args = { project: null, allProjects: false };

  const text = prompt.replace(/^\/arckit[.:]+analyze\s*/i, '');

  if (/\ball\s+projects?\b/i.test(text)) {
    args.allProjects = true;
    return args;
  }

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

// ── Artifact scanning ──

function scanArtifacts(projectDir) {
  const artifacts = [];

  for (const f of listDir(projectDir)) {
    const fp = join(projectDir, f);
    if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
      artifacts.push({ filename: f, path: fp, subdir: null });
    }
  }

  for (const subdir of ['decisions', 'diagrams', 'wardley-maps', 'data-contracts', 'reviews', 'research']) {
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

// ── Design document scanning (reused from traceability pattern) ──

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

        let docType = 'Vendor Doc';
        if (f.includes('-HLD-') || f.includes('-HLD.') || /\bhld\b/i.test(f)) docType = 'Vendor HLD';
        else if (f.includes('-DLD-') || f.includes('-DLD.') || /\bdld\b/i.test(f)) docType = 'Vendor DLD';

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
      const docType = f.includes('-HLDR-') ? 'HLDR' : 'DLDR';
      addRefs(join(projectDir, f), f, docType, null);
    }
  }

  return refMap;
}

// ── Coverage analysis ──

function computeCoverage(requirements, refMap) {
  const coverage = {
    total: requirements.length,
    covered: 0,
    orphan: [],
    byCategory: {},
    byPriority: {},
  };

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
      coverage.byCategory[req.category] = { total: 0, covered: 0 };
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

  return coverage;
}

// ── Vendor scanning ──

function scanVendors(projectDir) {
  const vendors = [];
  const vendorsDir = join(projectDir, 'vendors');
  if (!isDir(vendorsDir)) return vendors;

  for (const vendor of listDir(vendorsDir)) {
    const vendorDir = join(vendorsDir, vendor);
    if (!isDir(vendorDir)) continue;

    const entry = { name: vendor, docs: [], reviews: [] };

    for (const f of listDir(vendorDir)) {
      if (!f.endsWith('.md')) continue;
      if (!isFile(join(vendorDir, f))) continue;
      entry.docs.push(f);
    }

    // Reviews subdirectory
    const reviewsDir = join(vendorDir, 'reviews');
    if (isDir(reviewsDir)) {
      for (const f of listDir(reviewsDir)) {
        if (!f.endsWith('.md') || !isFile(join(reviewsDir, f))) continue;
        const content = readText(join(reviewsDir, f));
        let verdict = null;
        if (content) {
          if (/APPROVED\s+WITH\s+CONDITIONS/i.test(content)) verdict = 'APPROVED WITH CONDITIONS';
          else if (/\bREJECTED\b/i.test(content)) verdict = 'REJECTED';
          else if (/\bAPPROVED\b/i.test(content)) verdict = 'APPROVED';
          else if (/\bPENDING\b/i.test(content)) verdict = 'PENDING';
        }
        entry.reviews.push({ file: f, verdict });
      }
    }

    vendors.push(entry);
  }

  return vendors;
}

// ── Placeholder detection ──

const PLACEHOLDER_RE = /\b(TODO|TBD|TBC)\b|\?\?\?|\[PENDING\]/gi;

function countPlaceholders(content) {
  const matches = content.match(PLACEHOLDER_RE);
  return matches ? matches.length : 0;
}

// ── Percentage formatting ──

function pct(covered, total) {
  if (total === 0) return '0%';
  return `${Math.round((covered / total) * 100)}%`;
}

// ── Main ──

const data = parseHookInput();

// Guard: hooks.json matcher triggers on substring "/arckit:analyze" which can
// false-positive when another command's expanded body mentions /arckit:analyze.
// Accept raw slash command OR the Skill-expanded body (unique description/heading).
// No ^ anchors — Skill tool may wrap the expanded body in XML tags.
const userPrompt = data.prompt || '';
const isRawCommand = /^\s*\/arckit[.:]+analyze\b/i.test(userPrompt);
const isExpandedBody = /description:\s*Perform comprehensive governance quality analysis/i.test(userPrompt)
  || /#\s*Identify inconsistencies, gaps, ambiguities/i.test(userPrompt);
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
    process.exit(0);
  }
}

// Analyze is single-project unless "all projects" specified
if (projectDirs.length === 0) process.exit(0);
if (projectDirs.length > 1 && !args.allProjects) {
  // No project specified and multiple exist — let the command ask the user
  process.exit(0);
}

// Read ArcKit version
const pluginRoot = resolve(import.meta.url.replace('file://', ''), '..', '..');
const arckitVersion = readText(join(pluginRoot, 'VERSION'))?.trim() || 'unknown';

// Process each project (typically just one for analyze)
const allOutput = [];

for (const projectName of projectDirs) {
  const projectDir = join(projectsDir, projectName);
  const projectId = projectName.match(/^(\d{3})/)?.[1] || '000';

  const lines = [];

  // ── Phase 1: Artifact inventory ──

  const artifacts = scanArtifacts(projectDir);
  const artifactMeta = [];
  const typeSet = new Set();
  const placeholderCounts = [];

  for (const artifact of artifacts) {
    const content = readText(artifact.path);
    if (!content) continue;

    const docType = extractDocType(artifact.filename);
    const version = extractVersion(artifact.filename);
    const fields = extractDocControlFields(content);
    const relPath = artifact.subdir ? `${artifact.subdir}/${artifact.filename}` : artifact.filename;

    if (docType) typeSet.add(docType);

    const placeholders = countPlaceholders(content);

    artifactMeta.push({
      filename: artifact.filename,
      relPath,
      docType,
      version,
      status: fields['Status'] || '',
      classification: fields['Classification'] || '',
      owner: fields['Owner'] || '',
      createdDate: fields['Created Date'] || fields['Created'] || '',
      lastModified: fields['Last Modified'] || fields['Modified'] || '',
      content,
      placeholders,
    });

    if (placeholders > 0) {
      placeholderCounts.push({ file: relPath, count: placeholders });
    }
  }

  // ── Phase 1b: Global artifacts (PRIN from 000-global) ──

  const globalDir = join(projectsDir, '000-global');
  const globalPrinFiles = [];
  if (isDir(globalDir)) {
    for (const f of listDir(globalDir)) {
      if (f.startsWith('ARC-') && f.endsWith('.md') && f.includes('-PRIN-')) {
        globalPrinFiles.push({ filename: f, path: join(globalDir, f) });
      }
    }
  }

  // ── Phase 2: Missing artifacts detection ──

  const recommendedTypes = ['STKE', 'RISK', 'SOBC', 'DATA', 'TRAC'];
  const ukGovTypes = ['TCOP', 'AIPB', 'ATRS'];
  const modTypes = ['SECD-MOD'];

  const missingRecommended = [];
  const hasDataReqs = artifactMeta.some(a => {
    if (a.docType !== 'REQ') return false;
    return /\bDR-\d{3}\b/.test(a.content);
  });

  const commandMap = {
    'STKE': '/arckit:stakeholders',
    'RISK': '/arckit:risk',
    'SOBC': '/arckit:sobc',
    'DATA': '/arckit:data-model',
    'TRAC': '/arckit:traceability',
  };

  for (const type of recommendedTypes) {
    if (typeSet.has(type)) continue;
    // DATA only recommended if DR-xxx requirements exist
    if (type === 'DATA' && !hasDataReqs) continue;
    missingRecommended.push({ type, command: commandMap[type] || '' });
  }

  const presentUkGov = ukGovTypes.filter(t => typeSet.has(t));
  const presentMod = modTypes.filter(t => typeSet.has(t));

  // ── Phase 3: Requirements inventory ──

  const allRequirements = [];
  const reqFiles = [];

  for (const meta of artifactMeta) {
    if (meta.docType !== 'REQ') continue;
    reqFiles.push(meta.filename);
    const reqs = extractRequirementDetails(meta.content);
    for (const req of reqs) {
      req.sourceFile = meta.filename;
      allRequirements.push(req);
    }
  }

  // Priority distribution
  const priorityDist = { MUST: 0, SHOULD: 0, MAY: 0 };
  for (const req of allRequirements) {
    if (priorityDist[req.priority] !== undefined) {
      priorityDist[req.priority] = priorityDist[req.priority] + 1;
    }
  }

  // ── Phase 4: Principles extraction ──

  const allPrinciples = [];
  for (const pf of globalPrinFiles) {
    const content = readText(pf.path);
    if (!content) continue;
    const principles = extractPrinciples(content);
    for (const p of principles) {
      p.sourceFile = pf.filename;
      allPrinciples.push(p);
    }
  }

  // ── Phase 5: Cross-reference map + coverage ──

  const refMap = scanDesignDocs(projectDir);
  const coverage = computeCoverage(allRequirements, refMap);

  // ── Phase 6: Risk extraction ──

  const allRisks = [];
  for (const meta of artifactMeta) {
    if (meta.docType !== 'RISK') continue;
    const risks = extractRiskEntries(meta.content);
    for (const r of risks) {
      r.sourceFile = meta.filename;
      allRisks.push(r);
    }
  }

  // Severity buckets (parse inherent score for numeric comparison)
  const riskSeverity = { 'Very High': 0, 'High': 0, 'Medium': 0, 'Low': 0, 'Very Low': 0 };
  for (const risk of allRisks) {
    // Try to match score like "20 (Very High)" or just "Very High"
    const scoreMatch = risk.inherent.match(/\b(Very High|High|Medium|Low|Very Low)\b/i);
    if (scoreMatch) {
      const bucket = scoreMatch[1].replace(/\b\w/g, c => c.toUpperCase());
      if (riskSeverity[bucket] !== undefined) {
        riskSeverity[bucket] = riskSeverity[bucket] + 1;
      }
    }
  }

  // ── Phase 7: Vendor inventory ──

  const vendors = scanVendors(projectDir);

  // ── Phase 8: Build additionalContext ──

  lines.push('## Governance Scan Pre-processor Complete');
  lines.push('');
  lines.push('**All artifact metadata, requirements, principles, risks, and cross-references pre-extracted.**');
  lines.push('');

  // Section 1: Scan Parameters
  lines.push('### Scan Parameters');
  lines.push(`- **Project**: ${projectName}`);
  lines.push(`- **Project ID**: ${projectId}`);
  lines.push(`- **ArcKit Version**: ${arckitVersion}`);
  lines.push(`- **Artifacts scanned**: ${artifactMeta.length}`);
  lines.push(`- **Artifact types found**: ${[...typeSet].sort().join(', ')}`);
  lines.push(`- **REQ files**: ${reqFiles.length > 0 ? reqFiles.join(', ') : 'none'}`);
  lines.push(`- **PRIN files (global)**: ${globalPrinFiles.length > 0 ? globalPrinFiles.map(f => f.filename).join(', ') : 'none'}`);
  lines.push(`- **Vendors**: ${vendors.length > 0 ? vendors.map(v => v.name).join(', ') : 'none'}`);
  lines.push('');

  // Section 2: Artifact Inventory
  lines.push('### Artifact Inventory');
  lines.push('');
  lines.push('| File | Doc Type | Version | Status | Classification | Owner | Last Modified |');
  lines.push('|------|----------|---------|--------|----------------|-------|---------------|');
  for (const meta of artifactMeta) {
    lines.push(`| ${meta.relPath} | ${meta.docType || '?'} | ${meta.version || '?'} | ${meta.status || '\u2014'} | ${meta.classification || '\u2014'} | ${meta.owner || '\u2014'} | ${meta.lastModified || '\u2014'} |`);
  }
  lines.push('');

  // Section 3: Missing Recommended Artifacts
  if (missingRecommended.length > 0) {
    lines.push('### Missing Recommended Artifacts');
    lines.push('');
    for (const m of missingRecommended) {
      lines.push(`- **${m.type}**: Not found \u2014 create with \`${m.command}\``);
    }
    lines.push('');
  }

  // Section 4: UK Gov / MOD Artifact Presence
  lines.push('### Compliance Artifact Presence');
  lines.push('');
  lines.push(`- **UK Gov (TCOP/AIPB/ATRS)**: ${presentUkGov.length > 0 ? presentUkGov.join(', ') : 'none found'}`);
  lines.push(`- **MOD (SECD-MOD)**: ${presentMod.length > 0 ? presentMod.join(', ') : 'none found'}`);
  lines.push('');

  // Section 5: Requirements Inventory
  if (allRequirements.length > 0) {
    lines.push('### Requirements Inventory');
    lines.push('');
    lines.push('| Req ID | Category | Priority | Description | Covered |');
    lines.push('|--------|----------|----------|-------------|---------|');
    for (const req of allRequirements) {
      const refs = refMap[req.id];
      const isCovered = refs && refs.length > 0;
      const desc = req.description.length > 80
        ? req.description.substring(0, 77) + '...'
        : req.description;
      lines.push(`| ${req.id} | ${req.category} | ${req.priority} | ${desc} | ${isCovered ? 'Yes' : 'No'} |`);
    }
    lines.push('');

    // Section 6: Priority Distribution
    lines.push('### Priority Distribution');
    lines.push('');
    lines.push(`- **MUST**: ${priorityDist.MUST}`);
    lines.push(`- **SHOULD**: ${priorityDist.SHOULD}`);
    lines.push(`- **MAY**: ${priorityDist.MAY}`);
    lines.push('');

    // Section 7: Coverage Summary
    lines.push('### Coverage Summary');
    lines.push('');
    lines.push('| Metric | Covered | Total | Pct |');
    lines.push('|--------|---------|-------|-----|');
    lines.push(`| Overall | ${coverage.covered} | ${coverage.total} | ${pct(coverage.covered, coverage.total)} |`);

    const categoryOrder = ['Business', 'Functional', 'Non-Functional', 'Integration', 'Data'];
    for (const cat of categoryOrder) {
      const catData = coverage.byCategory[cat];
      if (!catData) continue;
      lines.push(`| ${cat} | ${catData.covered} | ${catData.total} | ${pct(catData.covered, catData.total)} |`);
    }

    const priorityOrder = ['MUST', 'SHOULD', 'MAY'];
    for (const pri of priorityOrder) {
      const priData = coverage.byPriority[pri];
      if (!priData) continue;
      lines.push(`| ${pri} priority | ${priData.covered} | ${priData.total} | ${pct(priData.covered, priData.total)} |`);
    }
    lines.push('');

    // Section 8: Orphan Requirements
    if (coverage.orphan.length > 0) {
      lines.push('### Orphan Requirements (no design coverage)');
      lines.push('');
      for (const req of coverage.orphan) {
        lines.push(`- **${req.id}** (${req.priority}): ${req.description}`);
      }
      lines.push('');
    }
  }

  // Section 9: Principles
  if (allPrinciples.length > 0) {
    lines.push('### Principles');
    lines.push('');
    lines.push('| # | Title | Category | Statement | Gates Passed |');
    lines.push('|---|-------|----------|-----------|--------------|');
    for (const p of allPrinciples) {
      const stmt = p.statement.length > 60
        ? p.statement.substring(0, 57) + '...'
        : p.statement;
      const gates = p.gateCount > 0 ? `${p.gatesPassed}/${p.gateCount}` : '\u2014';
      lines.push(`| ${p.id} | ${p.title} | ${p.category} | ${stmt} | ${gates} |`);
    }
    lines.push('');
  }

  // Section 10: Risks
  if (allRisks.length > 0) {
    lines.push('### Risks');
    lines.push('');
    lines.push('| Risk ID | Title | Category | Inherent | Residual | Owner | Status | Response |');
    lines.push('|---------|-------|----------|----------|----------|-------|--------|----------|');
    for (const r of allRisks) {
      const title = r.title.length > 40 ? r.title.substring(0, 37) + '...' : r.title;
      lines.push(`| ${r.id} | ${title} | ${r.category} | ${r.inherent} | ${r.residual} | ${r.owner} | ${r.status} | ${r.response} |`);
    }
    lines.push('');

    // Severity summary
    lines.push('**Risk Severity Summary**:');
    for (const [bucket, count] of Object.entries(riskSeverity)) {
      if (count > 0) lines.push(`- ${bucket}: ${count}`);
    }
    lines.push('');
  }

  // Section 11: Vendor Inventory
  if (vendors.length > 0) {
    lines.push('### Vendor Inventory');
    lines.push('');
    for (const v of vendors) {
      lines.push(`#### ${v.name}`);
      lines.push(`- **Documents**: ${v.docs.length > 0 ? v.docs.join(', ') : 'none'}`);
      if (v.reviews.length > 0) {
        for (const rv of v.reviews) {
          lines.push(`- **Review**: ${rv.file} \u2014 Verdict: ${rv.verdict || 'not determined'}`);
        }
      }
      lines.push('');
    }
  }

  // Section 12: Cross-Reference Map
  if (Object.keys(refMap).length > 0) {
    lines.push('### Cross-Reference Map');
    lines.push('');
    lines.push('| Req ID | Referenced By |');
    lines.push('|--------|---------------|');
    for (const [reqId, refs] of Object.entries(refMap).sort()) {
      const refList = refs.map(r => r.file).join(', ');
      lines.push(`| ${reqId} | ${refList} |`);
    }
    lines.push('');
  }

  // Section 13: Placeholder Counts
  if (placeholderCounts.length > 0) {
    lines.push('### Placeholder Counts (TODO/TBD/TBC/???/[PENDING])');
    lines.push('');
    lines.push('| File | Count |');
    lines.push('|------|-------|');
    for (const pc of placeholderCounts.sort((a, b) => b.count - a.count)) {
      lines.push(`| ${pc.file} | ${pc.count} |`);
    }
    lines.push('');
  }

  // Section 14: Document Control Fields
  lines.push('### Document Control Fields');
  lines.push('');
  lines.push('| File | Classification | Status | Owner |');
  lines.push('|------|----------------|--------|-------|');
  for (const meta of artifactMeta) {
    lines.push(`| ${meta.relPath} | ${meta.classification || '\u2014'} | ${meta.status || '\u2014'} | ${meta.owner || '\u2014'} |`);
  }
  lines.push('');

  // Section 15: What to do
  lines.push('### What to do');
  lines.push('- **Skip Steps 1-2 entirely** \u2014 all artifact data is pre-extracted above');
  lines.push('- **Go directly to Step 3** (Build Semantic Models) using the pre-extracted tables');
  lines.push('- **Do NOT re-read artifacts** listed in the hook output');
  lines.push('- **Still read the template** (Step 0) for output formatting');
  lines.push('- **Focus on Steps 3-6**: semantic analysis, detection passes A-K, severity assignment, report generation');

  allOutput.push(lines.join('\n'));
}

const message = allOutput.join('\n\n---\n\n');

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: message,
  },
};
console.log(JSON.stringify(output));
