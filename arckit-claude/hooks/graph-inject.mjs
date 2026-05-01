#!/usr/bin/env node
/**
 * ArcKit Graph Injection Hook
 *
 * Single UserPromptSubmit hook that builds the artifact graph (via
 * graph-utils.mjs) and injects per-command additionalContext for the
 * scan-driven slash commands.
 *
 * Migration progress (#162):
 *   - /arckit:search       ✅ handled here (replaces search-scan.mjs)
 *   - /arckit:impact       ✅ handled here (replaces impact-scan.mjs)
 *   - /arckit:traceability ✅ handled here (replaces traceability-scan.mjs)
 *   - /arckit:health       ✅ handled here (replaces health-scan.mjs)
 *   - /arckit:analyze      ✅ handled here (replaces governance-scan.mjs)
 *
 * Graph-aware new commands (#359):
 *   - /arckit:navigator    "what's next" project GPS — coverage + gaps + recommended commands
 *   - /arckit:graph-report governance metrics dashboard — coverage by category, cross-ref
 *                          density, compliance readiness, multi-project comparison
 *
 * Hook Type: UserPromptSubmit (sync)
 * Input  (stdin):  JSON with prompt, cwd, etc.
 * Output (stdout): JSON with hookSpecificOutput.additionalContext
 *
 * Recipe shape:
 *   command:    short name (for logging/clarity)
 *   rawRe:      pattern that matches a raw "/arckit:cmd ..." prompt
 *   expandedRe: pattern that matches the Skill-tool expanded body
 *   opts:       static graph opts OR (prompt) => opts
 *   format:     (graph, prompt) => string | null  (null = exit silently)
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isDir, readText, findRepoRoot, parseHookInput,
  extractRequirementIds,
} from './hook-utils.mjs';
import { scanAllArtifacts } from './graph-utils.mjs';
import {
  DOC_TYPES,
  HIGH_SEVERITY_TYPES,
  HIGH_SEVERITY_BY_REGIME,
  REGIMES,
  REGIME_LABELS,
} from '../config/doc-types.mjs';
import {
  ESSENTIAL_TYPES,
  CONTEXTUAL_TYPES,
  STALE_THRESHOLD_DAYS,
} from './graph-rollups.mjs';

// ── Recipe table ───────────────────────────────────────────────────────────

const RECIPES = [
  {
    command: 'search',
    rawRe: /^\s*\/arckit[.:]+search\b/i,
    expandedRe: /description:\s*Search across all project artifacts/i,
    opts: { withNodeMetadata: true, withPreview: true },
    format: formatSearch,
  },
  {
    command: 'impact',
    rawRe: /^\s*\/arckit[.:]+impact\b/i,
    expandedRe: /description:\s*Analyse the blast radius/i,
    // Keep node payload lean — impact serializes the entire nodes object
    // into the prompt context, so v1 fields only.
    opts: {},
    format: formatImpact,
  },
  {
    command: 'graph-report',
    rawRe: /^\s*\/arckit[.:]+graph-report\b/i,
    expandedRe: /description:\s*Governance metrics dashboard|#\s*Graph Report/i,
    opts: { excludeGlobal: false, withNodeMetadata: false },
    format: formatGraphReport,
  },
  {
    command: 'navigator',
    rawRe: /^\s*\/arckit[.:]+navigator\b/i,
    expandedRe: /description:\s*Project-level GPS|#\s*Navigator/i,
    opts: prompt => {
      const arg = parseProjectArg(prompt, 'navigator');
      return {
        excludeGlobal: false,    // need to know if global PRIN exists
        withNodeMetadata: true,  // status, version, owner, reqIds
        ...(arg ? { projectFilter: arg } : {}),
      };
    },
    format: formatNavigator,
  },
  {
    command: 'analyze',
    rawRe: /^\s*\/arckit[.:]+analyze\b/i,
    expandedRe: /description:\s*Perform comprehensive governance quality analysis|#\s*Identify inconsistencies, gaps, ambiguities/i,
    // Scan everything (incl. 000-global for principles); formatter filters.
    opts: {
      excludeGlobal: false,
      withNodeMetadata: true,
      withContent: true,
      withRequirements: true,
      withVendors: true,
      withPrinciples: true,
      withRisks: true,
    },
    format: formatAnalyze,
  },
  {
    command: 'health',
    rawRe: /^\s*\/arckit[.:]+health\b/i,
    expandedRe: /description:\s*Scan all projects for stale|#\s*Artifact Health Check/i,
    opts: prompt => {
      const arg = parseProjectArg(prompt, 'health');
      return {
        excludeGlobal: true,
        withNodeMetadata: true,
        withContent: true,
        withExternals: true,
        ...(arg ? { projectFilter: arg } : {}),
      };
    },
    format: formatHealth,
  },
  {
    command: 'traceability',
    rawRe: /^\s*\/arckit[.:]+traceability\b/i,
    expandedRe: /description:\s*Generate requirements traceability/i,
    opts: prompt => {
      const arg = parseProjectArg(prompt, 'traceability');
      return {
        excludeGlobal: true,
        withRequirements: true,
        withVendors: true,
        // formatTraceability reads node.reqIds for every non-REQ artifact to
        // build refMap. Without withNodeMetadata, reqIds is never assigned
        // (graph-utils.mjs:181-188), so refMap stays empty and coverage
        // reports 0% even when sibling artifacts genuinely cite requirements.
        withNodeMetadata: true,
        ...(arg ? { projectFilter: arg } : {}),
      };
    },
    format: formatTraceability,
  },
];

function matchRecipe(prompt) {
  for (const r of RECIPES) {
    if (r.rawRe.test(prompt) || r.expandedRe.test(prompt)) return r;
  }
  return null;
}

// ── Shared helpers ─────────────────────────────────────────────────────────

function parseProjectArg(prompt, command) {
  const text = prompt.replace(new RegExp(`^/arckit[.:]+${command}\\s*`, 'i'), '');
  const projectMatch = text.match(/\bPROJECT\s*=\s*(\S+)/i);
  if (projectMatch) return projectMatch[1];
  const numMatch = text.match(/\b(\d{3})\b/);
  if (numMatch) return numMatch[1];
  return null;
}

function readArckitVersion() {
  const pluginRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  return readText(join(pluginRoot, 'VERSION'))?.trim() || 'unknown';
}

function pct(covered, total) {
  if (total === 0) return '0%';
  return `${Math.round((covered / total) * 100)}%`;
}

// ── Health-rule helpers ────────────────────────────────────────────────────

function daysBetween(dateStr, baseline) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return -1;
  return Math.floor((baseline.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function extractAdrStatus(content, fields) {
  const status = fields['Status'] || '';
  const sectionMatch = content.match(/##\s*Status\s*\n+\s*(\w+)/i);
  const sectionStatus = sectionMatch ? sectionMatch[1] : '';
  if (/proposed/i.test(status) || /proposed/i.test(sectionStatus)) return 'Proposed';
  if (/accepted/i.test(status) || /accepted/i.test(sectionStatus)) return 'Accepted';
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
  const m = content.match(/###?\s*(?:\d+\.?\d*\s+)?Conditions\s*\n([\s\S]*?)(?=\n###?\s|\n---|\n##\s|$)/i);
  if (!m) return [];
  const out = [];
  for (const line of m[1].split('\n')) {
    const t = line.trim();
    if (/^[-*]\s+/.test(t) || /^\d+\.\s+/.test(t)) {
      const text = t.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim();
      if (text) out.push(text);
    }
  }
  return out;
}

const EXT_RECOMMEND = [
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
  for (const { patterns, commands } of EXT_RECOMMEND) {
    if (patterns.some(p => p.test(filename))) return commands;
  }
  return '/arckit:requirements, /arckit:analyze';
}

const SEVERITY_ORDER = { HIGH: 3, MEDIUM: 2, LOW: 1 };

// ── Formatters ─────────────────────────────────────────────────────────────

function formatSearch(graph, prompt) {
  const text = prompt.replace(/^\/arckit[.:]+search\s*/i, '').trim();

  // search expected an array; flatten nodes into the same record shape it had.
  const records = Object.entries(graph.nodes).map(([fullId, n]) => ({
    filename: fullId + '.md',
    relPath: n.subdir ? `${n.subdir}/${fullId}.md` : `${fullId}.md`,
    project: n.project,
    docType: n.type,
    version: n.version,
    title: n.title,
    status: n.status,
    owner: n.owner,
    reqIds: n.reqIds,
    preview: n.preview,
    controlFields: Object.entries(n.controlFields)
      .map(([k, v]) => `${k}: ${v}`)
      .join('; '),
  }));

  const lines = [];
  lines.push('## Search Pre-processor Complete (hook)');
  lines.push('');
  lines.push(`**Indexed ${records.length} artifacts across ${graph.projects.length} project(s).**`);
  lines.push('');
  lines.push(`**User query:** ${text || '(no query provided)'}`);
  lines.push('');
  lines.push('### SEARCH INDEX (JSON)');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(records, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('### Instructions');
  lines.push('- Parse the query for keywords, --type=XXX, --project=NNN, --id=XX-NNN filters');
  lines.push('- Score results: title match=10, control fields=5, preview=3, filename=2');
  lines.push('- Output ranked table with top result preview');
  lines.push('- If no results, suggest broadening the search');

  return lines.join('\n');
}

function formatImpact(graph, prompt) {
  const text = prompt.replace(/^\/arckit[.:]+impact\s*/i, '').trim();
  const { nodes, edges, reqIndex, projects } = graph;
  const nodeCount = Object.keys(nodes).length;
  const edgeCount = edges.length;
  const reqCount = Object.keys(reqIndex).length;

  const lines = [];
  lines.push('## Impact Pre-processor Complete (hook)');
  lines.push('');
  lines.push(`**Dependency graph built: ${nodeCount} documents, ${edgeCount} cross-references, ${reqCount} requirement IDs across ${projects.length} project(s).**`);
  lines.push('');
  lines.push(`**User query:** ${text || '(no query provided)'}`);
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
  lines.push(`| Compliance/Governance | HIGH | ${HIGH_SEVERITY_TYPES.join(', ')} |`);
  lines.push('| Architecture | MEDIUM | HLDR, DLDR, ADR, DATA, DIAG, PLAT |');
  lines.push('| Planning/Reporting | LOW | PLAN, ROAD, BKLG, SOBC, OPS, STORY, PRES |');
  lines.push('');
  lines.push('### Instructions');
  lines.push('- Parse query: ARC document ID, requirement ID (e.g. BR-003), or type+project');
  lines.push('- Perform reverse traversal through edges (max depth 5)');
  lines.push('- Classify impact severity using node severity field');
  lines.push('- Output impact chain table, summary counts, and recommended actions');
  lines.push('- Suggest specific /arckit commands to re-run for HIGH severity impacts');

  return lines.join('\n');
}

function formatGraphReport(graph) {
  const workingProjects = graph.projects.filter(p => p !== '000-global');
  if (workingProjects.length === 0) return null;

  // Build per-project metrics
  const rows = [];
  let categoryTotals = null;

  for (const projectName of workingProjects) {
    const projectNodes = Object.values(graph.nodes).filter(n => n.project === projectName);
    const projectFullIds = new Set(projectNodes.map(n => n.path.split('/').pop().replace(/\.md$/, '')));

    // Edges where source is in this project
    const projectEdges = graph.edges.filter(e => projectFullIds.has(e.from));
    const density = projectNodes.length === 0 ? 0 : projectEdges.length / projectNodes.length;

    // Category coverage — group nodes by DOC_TYPES[].category
    const presentTypes = new Set(projectNodes.map(n => n.type).filter(Boolean));
    const presentByCategory = {};
    for (const t of presentTypes) {
      const info = DOC_TYPES[t];
      if (!info) continue;
      if (!presentByCategory[info.category]) presentByCategory[info.category] = new Set();
      presentByCategory[info.category].add(t);
    }

    // Total possible types per category (computed once, reused)
    if (!categoryTotals) {
      categoryTotals = {};
      for (const [type, info] of Object.entries(DOC_TYPES)) {
        if (!categoryTotals[info.category]) categoryTotals[info.category] = new Set();
        categoryTotals[info.category].add(type);
      }
    }

    // Compliance readiness — scored per-regime so projects targeting non-UK
    // jurisdictions are not penalised for missing UK Gov / MOD artifacts.
    // A project is considered "engaged" with a regime when any of its artifacts
    // (HIGH-severity or otherwise) carry that regime tag in DOC_TYPES.
    const engagedRegimes = new Set();
    for (const t of presentTypes) {
      const r = DOC_TYPES[t]?.regime;
      if (r) engagedRegimes.add(r);
    }

    const readiness = {};
    // UNIVERSAL is always scored — these types apply regardless of jurisdiction.
    for (const bucket of ['UNIVERSAL', ...REGIMES]) {
      if (bucket !== 'UNIVERSAL' && !engagedRegimes.has(bucket)) continue;
      const types = HIGH_SEVERITY_BY_REGIME[bucket] || [];
      if (types.length === 0) continue;
      const present = types.filter(t => presentTypes.has(t));
      const missing = types.filter(t => !presentTypes.has(t));
      const pct = Math.round((present.length / types.length) * 100);
      readiness[bucket] = { present, missing, pct, total: types.length };
    }

    // Headline: UNIVERSAL pct (regime-agnostic governance hygiene).
    const headlinePct = readiness.UNIVERSAL?.pct ?? 0;
    const headlinePresent = readiness.UNIVERSAL?.present.length ?? 0;
    const headlineTotal = readiness.UNIVERSAL?.total ?? 0;

    rows.push({
      project: projectName,
      artifactCount: projectNodes.length,
      edgeCount: projectEdges.length,
      density,
      presentByCategory,
      readiness,
      engagedRegimes: [...engagedRegimes],
      headlinePct,
      headlinePresent,
      headlineTotal,
    });
  }

  // Pre-sort categories: known order, then anything else alphabetically
  const CATEGORY_ORDER = ['Discovery', 'Planning', 'Architecture', 'Governance',
    'Compliance', 'Operations', 'Procurement', 'Research', 'Reporting'];
  const allCategories = Object.keys(categoryTotals).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const lines = [];
  lines.push('## Graph Report Pre-processor Complete (hook)');
  lines.push('');
  lines.push(`**Projects scanned**: ${workingProjects.length}`);
  lines.push(`**Total artifacts**: ${rows.reduce((s, r) => s + r.artifactCount, 0)}`);
  lines.push(`**Total cross-references**: ${rows.reduce((s, r) => s + r.edgeCount, 0)}`);
  lines.push('');

  lines.push('### Project Comparison');
  lines.push('');
  lines.push('| Project | Artifacts | Cross-refs | Density (refs/doc) | Universal readiness | Engaged regimes |');
  lines.push('|---------|-----------|------------|--------------------|---------------------|-----------------|');
  for (const r of rows) {
    const regimes = r.engagedRegimes.length > 0 ? r.engagedRegimes.join(', ') : '_none_';
    lines.push(`| ${r.project} | ${r.artifactCount} | ${r.edgeCount} | ${r.density.toFixed(2)} | ${r.headlinePresent}/${r.headlineTotal} (${r.headlinePct}%) | ${regimes} |`);
  }
  lines.push('');

  lines.push('### Coverage by Category');
  lines.push('');
  const headerCells = ['Project', ...allCategories];
  lines.push('| ' + headerCells.join(' | ') + ' |');
  lines.push('|' + headerCells.map(() => '---').join('|') + '|');
  for (const r of rows) {
    const cells = [r.project];
    for (const cat of allCategories) {
      const present = r.presentByCategory[cat]?.size || 0;
      const total = categoryTotals[cat].size;
      const pctVal = total === 0 ? 0 : Math.round((present / total) * 100);
      cells.push(`${present}/${total} (${pctVal}%)`);
    }
    lines.push('| ' + cells.join(' | ') + ' |');
  }
  lines.push('');

  lines.push('### Compliance Readiness (HIGH-severity doc types, scored per-regime)');
  lines.push('');
  lines.push('UNIVERSAL types apply regardless of jurisdiction. A regime row only appears when the project has at least one artifact tagged for that regime — projects targeting one jurisdiction are not penalised for missing artifacts from another.');
  lines.push('');
  for (const r of rows) {
    lines.push(`#### ${r.project}`);
    lines.push('');
    lines.push('| Regime | Score | Present | Missing |');
    lines.push('|--------|-------|---------|---------|');
    const buckets = ['UNIVERSAL', ...REGIMES.filter(reg => r.readiness[reg])];
    for (const b of buckets) {
      const data = r.readiness[b];
      if (!data) continue;
      const label = b === 'UNIVERSAL' ? 'Universal' : (REGIME_LABELS[b] || b);
      const score = `${data.present.length}/${data.total} (${data.pct}%)`;
      const present = data.present.length > 0 ? data.present.join(', ') : '_none_';
      const missing = data.missing.length > 0 ? data.missing.join(', ') : '_all present_';
      lines.push(`| ${label} | ${score} | ${present} | ${missing} |`);
    }
    lines.push('');
  }

  lines.push('### Cross-Reference Density Interpretation');
  lines.push('');
  lines.push('| Density | Meaning |');
  lines.push('|---------|---------|');
  lines.push('| 0.0 | No cross-references — artifacts are isolated, traceability is broken |');
  lines.push('| 0.0–0.5 | Sparse — most artifacts stand alone, suggesting traceability gaps |');
  lines.push('| 0.5–1.5 | Moderate — typical for early-stage projects |');
  lines.push('| 1.5–3.0 | Healthy — good traceability for a mature project |');
  lines.push('| 3.0+ | Dense — every artifact references multiple others (mature, well-governed) |');
  lines.push('');

  lines.push('### What to do');
  lines.push('- **Render the report** using the tables above.');
  lines.push('- **Highlight outliers**: lowest compliance readiness, lowest density, projects missing whole categories.');
  lines.push('- **Recommend remediation**: missing HIGH-severity types → run the corresponding `/arckit:*` command.');
  lines.push('- **No files are written** — graph-report is read-only.');

  return lines.join('\n');
}

function formatNavigator(graph, prompt) {
  const projectArg = parseProjectArg(prompt, 'navigator');
  const workingProjects = graph.projects.filter(p => p !== '000-global');
  if (workingProjects.length === 0) return null;

  let targets;
  if (projectArg) {
    targets = workingProjects.filter(p => p === projectArg || p.startsWith(projectArg));
    if (targets.length === 0) return null;
  } else if (workingProjects.length === 1) {
    targets = workingProjects;
  } else {
    return null;  // ambiguous, exit silently
  }

  const blocks = [];
  for (const projectName of targets) {
    blocks.push(formatNavigatorProject(projectName, graph));
  }
  return blocks.join('\n\n---\n\n');
}

function formatNavigatorProject(projectName, graph) {
  const baseline = new Date();
  const projectId = projectName.match(/^(\d{3})/)?.[1] || '000';

  const projectNodes = Object.values(graph.nodes).filter(n => n.project === projectName);
  const typeSet = new Set(projectNodes.map(n => n.type));
  const hasGlobalPrin = (graph.nodes && Object.values(graph.nodes).some(
    n => n.project === '000-global' && n.type === 'PRIN'
  ));

  const present = ESSENTIAL_TYPES.filter(e => typeSet.has(e.type));
  const missing = ESSENTIAL_TYPES.filter(e => !typeSet.has(e.type));
  const coveragePct = ESSENTIAL_TYPES.length === 0
    ? 0
    : Math.round((present.length / ESSENTIAL_TYPES.length) * 100);

  // DRAFT artifacts
  const draftNodes = projectNodes.filter(n => /draft/i.test(n.status || ''));

  // Stale artifacts (lastModified older than threshold)
  const staleNodes = projectNodes
    .map(n => {
      const dateStr = n.lastModified || n.createdDate;
      if (!dateStr) return null;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return null;
      const age = Math.floor((baseline.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      return age >= STALE_THRESHOLD_DAYS ? { node: n, age } : null;
    })
    .filter(Boolean);

  // Orphan artifacts: ARC docs with no incoming or outgoing edges in this project's namespace.
  const projectFullIds = new Set(projectNodes.map(n => n.path.split('/').pop().replace(/\.md$/, '')));
  const connected = new Set();
  for (const e of graph.edges) {
    if (projectFullIds.has(e.from)) {
      connected.add(e.from);
      connected.add(e.to);
    }
    if (projectFullIds.has(e.to.replace(/-v[\d.]+$/, '')) || projectFullIds.has(e.to)) {
      connected.add(e.from);
    }
  }
  const orphans = projectNodes.filter(n => {
    const id = n.path.split('/').pop().replace(/\.md$/, '');
    const shortId = id.replace(/-v[\d.]+$/, '');
    return !connected.has(id) && !connected.has(shortId);
  });

  // Recommended next commands: missing essentials in tier order, contextual types as "consider"
  const nextCommands = missing
    .slice()
    .sort((a, b) => a.tier - b.tier);

  const rel = n => {
    const filename = n.path.split('/').pop();
    return n.subdir ? `${n.subdir}/${filename}` : filename;
  };

  const lines = [];
  lines.push('## Navigator Pre-processor Complete (hook)');
  lines.push('');
  lines.push(`**Project**: ${projectName} (Project ${projectId})`);
  lines.push(`**Artifacts present**: ${projectNodes.length}`);
  lines.push(`**Essential coverage**: ${present.length} / ${ESSENTIAL_TYPES.length} doc types (${coveragePct}%)`);
  lines.push(`**Global principles**: ${hasGlobalPrin ? 'present (000-global)' : 'NOT FOUND — recommend running /arckit:principles first'}`);
  lines.push('');

  lines.push('### Coverage by Tier');
  lines.push('');
  lines.push('| Tier | Doc Type | Command | Status |');
  lines.push('|------|----------|---------|--------|');
  for (const e of ESSENTIAL_TYPES) {
    const status = typeSet.has(e.type) ? '✅ present' : '❌ missing';
    lines.push(`| ${e.tier} | ${e.type} (${e.label}) | \`${e.command}\` | ${status} |`);
  }
  lines.push('');

  lines.push('### Recommended Next Steps (tier order)');
  lines.push('');
  if (nextCommands.length === 0) {
    lines.push('All essential doc types are present. Consider contextual artifacts below.');
  } else {
    for (const e of nextCommands) {
      lines.push(`- **Tier ${e.tier}** — Run \`${e.command}\` to create the missing ${e.label} (${e.type}).`);
    }
  }
  lines.push('');

  lines.push('### Contextual Artifacts (run if applicable)');
  lines.push('');
  for (const c of CONTEXTUAL_TYPES) {
    const has = typeSet.has(c.type);
    if (has) continue;
    lines.push(`- \`${c.command}\` — recommended if **${c.trigger}**.`);
  }
  lines.push('');

  if (draftNodes.length > 0) {
    lines.push('### DRAFT Artifacts');
    lines.push('');
    for (const n of draftNodes) {
      lines.push(`- ${rel(n)} (status: ${n.status})`);
    }
    lines.push('');
  }

  if (staleNodes.length > 0) {
    lines.push(`### Stale Artifacts (>${STALE_THRESHOLD_DAYS} days since last modified)`);
    lines.push('');
    for (const s of staleNodes.sort((a, b) => b.age - a.age)) {
      lines.push(`- ${rel(s.node)} (${s.age} days, last modified ${s.node.lastModified || s.node.createdDate})`);
    }
    lines.push('');
  }

  if (orphans.length > 0) {
    lines.push('### Orphan Artifacts (no cross-references)');
    lines.push('');
    for (const n of orphans) {
      lines.push(`- ${rel(n)} (type: ${n.type})`);
    }
    lines.push('');
  }

  lines.push('### What to do');
  lines.push('- **Render the report** using the tables and lists above.');
  lines.push('- **Highlight the top recommendation** from "Recommended Next Steps".');
  lines.push('- **Flag any DRAFT, stale, or orphan artifacts** that need attention.');
  lines.push('- **No files are written** — navigator is read-only.');

  return lines.join('\n');
}

function formatAnalyze(graph, prompt) {
  const projectArg = parseProjectArg(prompt, 'analyze');
  const allProjects = /\ball\s+projects?\b/i.test(prompt);

  const workingProjects = graph.projects.filter(p => p !== '000-global');
  if (workingProjects.length === 0) return null;

  let targets;
  if (projectArg) {
    targets = workingProjects.filter(p => p === projectArg || p.startsWith(projectArg));
    if (targets.length === 0) return null;
  } else if (allProjects) {
    targets = workingProjects;
  } else if (workingProjects.length === 1) {
    targets = workingProjects;
  } else {
    return null; // ambiguous, exit silently
  }

  const arckitVersion = readArckitVersion();
  const blocks = [];

  for (const projectName of targets) {
    blocks.push(formatAnalyzeProject(projectName, graph, arckitVersion));
  }

  return blocks.join('\n\n---\n\n');
}

const PLACEHOLDER_RE = /\b(TODO|TBD|TBC)\b|\?\?\?|\[PENDING\]/gi;

function formatAnalyzeProject(projectName, graph, arckitVersion) {
  const projectId = projectName.match(/^(\d{3})/)?.[1] || '000';

  const projectNodes = Object.values(graph.nodes).filter(n => n.project === projectName);
  const rel = n => {
    const filename = n.path.split('/').pop();
    return n.subdir ? `${n.subdir}/${filename}` : filename;
  };

  const artifactMeta = projectNodes.map(n => ({
    relPath: rel(n),
    filename: n.path.split('/').pop(),
    docType: n.type,
    version: n.version,
    status: n.status,
    classification: n.classification,
    owner: n.owner,
    lastModified: n.lastModified,
    content: n.content,
    placeholders: (n.content?.match(PLACEHOLDER_RE) || []).length,
  }));
  const placeholderCounts = artifactMeta
    .filter(m => m.placeholders > 0)
    .map(m => ({ file: m.relPath, count: m.placeholders }));

  const typeSet = new Set(artifactMeta.map(m => m.docType).filter(Boolean));
  const reqFiles = artifactMeta.filter(m => m.docType === 'REQ').map(m => m.filename);

  // Missing recommended artifacts
  const recommended = [
    { type: 'STKE', command: '/arckit:stakeholders' },
    { type: 'RISK', command: '/arckit:risk' },
    { type: 'SOBC', command: '/arckit:sobc' },
    { type: 'DATA', command: '/arckit:data-model' },
    { type: 'TRAC', command: '/arckit:traceability' },
  ];
  const hasDataReqs = artifactMeta.some(m =>
    m.docType === 'REQ' && /\bDR-\d{1,3}\b/.test(m.content || '')
  );
  const missingRecommended = recommended.filter(r => {
    if (typeSet.has(r.type)) return false;
    if (r.type === 'DATA' && !hasDataReqs) return false;
    return true;
  });

  // Per-regime artifact presence — derived from DOC_TYPES so officially-maintained
  // and community-contributed regimes are surfaced side-by-side.
  const presentByRegime = {};
  for (const r of REGIMES) presentByRegime[r] = [];
  for (const t of typeSet) {
    const reg = DOC_TYPES[t]?.regime;
    if (reg && presentByRegime[reg]) presentByRegime[reg].push(t);
  }

  // Requirements + coverage (single-project view)
  const allRequirements = (graph.requirements || {})[projectName] || [];
  const priorityDist = { MUST: 0, SHOULD: 0, MAY: 0 };
  for (const req of allRequirements) {
    if (priorityDist[req.priority] !== undefined) priorityDist[req.priority]++;
  }

  const DESIGN_TYPES = new Set(['ADR', 'HLD', 'DLD', 'HLDR', 'DLDR']);
  const refMap = {};
  for (const n of projectNodes) {
    if (n.type === 'REQ') continue;
    if (!Array.isArray(n.reqIds) || n.reqIds.length === 0) continue;
    let label = n.type;
    if (DESIGN_TYPES.has(n.type) && n.vendor && (n.type === 'HLD' || n.type === 'DLD')) {
      label = `Vendor ${n.type}`;
    } else if (!DESIGN_TYPES.has(n.type) && n.vendor) {
      label = 'Vendor Doc';
    }
    for (const id of n.reqIds) {
      if (!refMap[id]) refMap[id] = [];
      refMap[id].push({ file: rel(n), type: label, vendor: n.vendor });
    }
  }

  const coverage = { total: allRequirements.length, covered: 0, orphan: [], byCategory: {}, byPriority: {} };
  for (const req of allRequirements) {
    const isCovered = !!(refMap[req.id] && refMap[req.id].length > 0);
    if (isCovered) coverage.covered++;
    else coverage.orphan.push(req);
    if (!coverage.byCategory[req.category]) coverage.byCategory[req.category] = { total: 0, covered: 0 };
    coverage.byCategory[req.category].total++;
    if (isCovered) coverage.byCategory[req.category].covered++;
    if (!coverage.byPriority[req.priority]) coverage.byPriority[req.priority] = { total: 0, covered: 0 };
    coverage.byPriority[req.priority].total++;
    if (isCovered) coverage.byPriority[req.priority].covered++;
  }

  // Principles (always from 000-global)
  const allPrinciples = (graph.principles || {})['000-global'] || [];
  const globalPrinFiles = [...new Set(allPrinciples.map(p => p.sourceFile))];

  // Risks
  const allRisks = (graph.risks || {})[projectName] || [];
  const riskSeverity = { 'Very High': 0, 'High': 0, 'Medium': 0, 'Low': 0, 'Very Low': 0 };
  for (const risk of allRisks) {
    const m = (risk.inherent || '').match(/\b(Very High|High|Medium|Low|Very Low)\b/i);
    if (m) {
      const bucket = m[1].replace(/\b\w/g, c => c.toUpperCase());
      if (riskSeverity[bucket] !== undefined) riskSeverity[bucket]++;
    }
  }

  // Vendors
  const vendors = (graph.vendors || {})[projectName] || [];

  // ── Output ──
  const lines = [];
  lines.push('## Governance Scan Pre-processor Complete');
  lines.push('');
  lines.push('**All artifact metadata, requirements, principles, risks, and cross-references pre-extracted.**');
  lines.push('');

  lines.push('### Scan Parameters');
  lines.push(`- **Project**: ${projectName}`);
  lines.push(`- **Project ID**: ${projectId}`);
  lines.push(`- **ArcKit Version**: ${arckitVersion}`);
  lines.push(`- **Artifacts scanned**: ${artifactMeta.length}`);
  lines.push(`- **Artifact types found**: ${[...typeSet].sort().join(', ')}`);
  lines.push(`- **REQ files**: ${reqFiles.length > 0 ? reqFiles.join(', ') : 'none'}`);
  lines.push(`- **PRIN files (global)**: ${globalPrinFiles.length > 0 ? globalPrinFiles.join(', ') : 'none'}`);
  lines.push(`- **Vendors**: ${vendors.length > 0 ? vendors.map(v => v.name).join(', ') : 'none'}`);
  lines.push('');

  lines.push('### Artifact Inventory');
  lines.push('');
  lines.push('| File | Doc Type | Version | Status | Classification | Owner | Last Modified |');
  lines.push('|------|----------|---------|--------|----------------|-------|---------------|');
  for (const meta of artifactMeta) {
    lines.push(`| ${meta.relPath} | ${meta.docType || '?'} | ${meta.version || '?'} | ${meta.status || '—'} | ${meta.classification || '—'} | ${meta.owner || '—'} | ${meta.lastModified || '—'} |`);
  }
  lines.push('');

  if (missingRecommended.length > 0) {
    lines.push('### Missing Recommended Artifacts');
    lines.push('');
    for (const m of missingRecommended) {
      lines.push(`- **${m.type}**: Not found — create with \`${m.command}\``);
    }
    lines.push('');
  }

  lines.push('### Compliance Artifact Presence');
  lines.push('');
  for (const reg of REGIMES) {
    const present = presentByRegime[reg];
    const label = REGIME_LABELS[reg] || reg;
    const highForRegime = HIGH_SEVERITY_BY_REGIME[reg] || [];
    const hint = highForRegime.length > 0 ? ` (HIGH: ${highForRegime.join('/')})` : '';
    lines.push(`- **${label}**${hint}: ${present.length > 0 ? present.join(', ') : 'none found'}`);
  }
  lines.push('');

  if (allRequirements.length > 0) {
    lines.push('### Requirements Inventory');
    lines.push('');
    lines.push('| Req ID | Category | Priority | Description | Covered |');
    lines.push('|--------|----------|----------|-------------|---------|');
    for (const req of allRequirements) {
      const isCovered = !!(refMap[req.id] && refMap[req.id].length > 0);
      const desc = req.description.length > 80 ? req.description.substring(0, 77) + '...' : req.description;
      lines.push(`| ${req.id} | ${req.category} | ${req.priority} | ${desc} | ${isCovered ? 'Yes' : 'No'} |`);
    }
    lines.push('');

    lines.push('### Priority Distribution');
    lines.push('');
    lines.push(`- **MUST**: ${priorityDist.MUST}`);
    lines.push(`- **SHOULD**: ${priorityDist.SHOULD}`);
    lines.push(`- **MAY**: ${priorityDist.MAY}`);
    lines.push('');

    lines.push('### Coverage Summary');
    lines.push('');
    lines.push('| Metric | Covered | Total | Pct |');
    lines.push('|--------|---------|-------|-----|');
    lines.push(`| Overall | ${coverage.covered} | ${coverage.total} | ${pct(coverage.covered, coverage.total)} |`);
    for (const cat of ['Business', 'Functional', 'Non-Functional', 'Integration', 'Data']) {
      const c = coverage.byCategory[cat];
      if (!c) continue;
      lines.push(`| ${cat} | ${c.covered} | ${c.total} | ${pct(c.covered, c.total)} |`);
    }
    for (const pri of ['MUST', 'SHOULD', 'MAY']) {
      const p = coverage.byPriority[pri];
      if (!p) continue;
      lines.push(`| ${pri} priority | ${p.covered} | ${p.total} | ${pct(p.covered, p.total)} |`);
    }
    lines.push('');

    if (coverage.orphan.length > 0) {
      lines.push('### Orphan Requirements (no design coverage)');
      lines.push('');
      for (const req of coverage.orphan) {
        lines.push(`- **${req.id}** (${req.priority}): ${req.description}`);
      }
      lines.push('');
    }
  }

  if (allPrinciples.length > 0) {
    lines.push('### Principles');
    lines.push('');
    lines.push('| # | Title | Category | Statement | Gates Passed |');
    lines.push('|---|-------|----------|-----------|--------------|');
    for (const p of allPrinciples) {
      const stmt = (p.statement || '').length > 60 ? p.statement.substring(0, 57) + '...' : (p.statement || '');
      const gates = p.gateCount > 0 ? `${p.gatesPassed}/${p.gateCount}` : '—';
      lines.push(`| ${p.id} | ${p.title} | ${p.category} | ${stmt} | ${gates} |`);
    }
    lines.push('');
  }

  if (allRisks.length > 0) {
    lines.push('### Risks');
    lines.push('');
    lines.push('| Risk ID | Title | Category | Inherent | Residual | Owner | Status | Response |');
    lines.push('|---------|-------|----------|----------|----------|-------|--------|----------|');
    for (const r of allRisks) {
      const title = (r.title || '').length > 40 ? r.title.substring(0, 37) + '...' : (r.title || '');
      lines.push(`| ${r.id} | ${title} | ${r.category} | ${r.inherent} | ${r.residual} | ${r.owner} | ${r.status} | ${r.response} |`);
    }
    lines.push('');
    lines.push('**Risk Severity Summary**:');
    for (const [bucket, count] of Object.entries(riskSeverity)) {
      if (count > 0) lines.push(`- ${bucket}: ${count}`);
    }
    lines.push('');
  }

  if (vendors.length > 0) {
    lines.push('### Vendor Inventory');
    lines.push('');
    for (const v of vendors) {
      lines.push(`#### ${v.name}`);
      lines.push(`- **Documents**: ${v.docs.length > 0 ? v.docs.join(', ') : 'none'}`);
      if (v.reviews.length > 0) {
        for (const rv of v.reviews) {
          lines.push(`- **Review**: ${rv.file} — Verdict: ${rv.verdict || 'not determined'}`);
        }
      }
      lines.push('');
    }
  }

  if (Object.keys(refMap).length > 0) {
    lines.push('### Cross-Reference Map');
    lines.push('');
    lines.push('| Req ID | Referenced By |');
    lines.push('|--------|---------------|');
    for (const [reqId, refs] of Object.entries(refMap).sort()) {
      lines.push(`| ${reqId} | ${refs.map(r => r.file).join(', ')} |`);
    }
    lines.push('');
  }

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

  lines.push('### Document Control Fields');
  lines.push('');
  lines.push('| File | Classification | Status | Owner |');
  lines.push('|------|----------------|--------|-------|');
  for (const meta of artifactMeta) {
    lines.push(`| ${meta.relPath} | ${meta.classification || '—'} | ${meta.status || '—'} | ${meta.owner || '—'} |`);
  }
  lines.push('');

  lines.push('### What to do');
  lines.push('');
  lines.push('**Rule 1 — Hook tables are primary data.** Use them directly for all detection passes. Do NOT re-read any artifact file listed in the Artifact Inventory table.');
  lines.push('');
  lines.push('**Rule 2 — Targeted reads only.** When a detection pass needs evidence beyond hook tables (e.g. full principle validation criteria, TCoP per-point scores, risk appetite thresholds), use Grep for specific patterns or Read with offset/limit. NEVER read an entire artifact file.');
  lines.push('');
  lines.push('**Rule 3 — Skip Steps 1-2 entirely.** Go directly to Step 3 (Build Semantic Models) using the pre-extracted tables. Still read the template (Step 0) for output formatting.');
  lines.push('');
  lines.push('Passes A, C, K need zero file reads — hook data is sufficient. Passes B, D, E, F, G, H, I, J may need surgical Grep reads for specific evidence sections only.');

  return lines.join('\n');
}

function formatHealth(graph, prompt, repoRoot) {
  const text = prompt.replace(/^\/arckit[.:]+health\s*/i, '');
  const severityArg = (text.match(/\bSEVERITY\s*=\s*(HIGH|MEDIUM|LOW)/i)?.[1] || 'LOW').toUpperCase();
  const sinceArg = text.match(/\bSINCE\s*=\s*(\d{4}-\d{2}-\d{2})/i)?.[1] || null;
  const projectArg = parseProjectArg(prompt, 'health');

  if (graph.projects.length === 0) return null;
  if (projectArg && graph.projects.length === 0) return null;

  const baseline = sinceArg ? new Date(sinceArg) : new Date();
  const minLevel = SEVERITY_ORDER[severityArg] || 1;

  const projectResults = [];

  for (const projectName of graph.projects) {
    const projectNodes = Object.values(graph.nodes).filter(n => n.project === projectName);
    const findings = [];

    // Group by docType for rule application
    const byType = {};
    for (const n of projectNodes) {
      if (!byType[n.type]) byType[n.type] = [];
      byType[n.type].push(n);
    }

    // Helper: pretty rel path
    const rel = n => {
      const filename = n.path.split('/').pop();
      return n.subdir ? `${n.subdir}/${filename}` : filename;
    };

    // Rule 1: STALE-RSCH
    for (const n of (byType['RSCH'] || [])) {
      const dateStr = n.lastModified || n.createdDate;
      if (!dateStr) continue;
      const age = daysBetween(dateStr, baseline);
      if (age > 180) {
        findings.push({
          severity: 'HIGH',
          rule: 'STALE-RSCH',
          file: rel(n),
          message: `Last modified: ${dateStr} (${age} days ago)`,
          action: 'Re-run /arckit:research to refresh pricing and vendor data',
        });
      }
    }

    // Rule 2: FORGOTTEN-ADR
    for (const n of (byType['ADR'] || [])) {
      const status = extractAdrStatus(n.content, n.controlFields);
      if (status !== 'Proposed') continue;
      const dateStr = n.createdDate || n.lastModified;
      if (!dateStr) continue;
      const age = daysBetween(dateStr, baseline);
      if (age > 30) {
        findings.push({
          severity: 'HIGH',
          rule: 'FORGOTTEN-ADR',
          file: rel(n),
          message: `Status: Proposed since ${dateStr} (${age} days without review)`,
          action: 'Schedule architecture review or accept/reject the decision',
        });
      }
    }

    // Rule 3: UNRESOLVED-COND
    for (const type of ['HLDR', 'DLDR']) {
      for (const n of (byType[type] || [])) {
        const verdict = extractReviewVerdict(n.content);
        if (verdict !== 'APPROVED WITH CONDITIONS') continue;
        const conditions = extractConditions(n.content);
        const lower = n.content.toLowerCase();
        const unresolved = conditions.filter(c => !lower.includes(c.toLowerCase()));
        if (unresolved.length === 0) continue;
        const condList = unresolved.map(c => `    - ${c}`).join('\n');
        findings.push({
          severity: 'HIGH',
          rule: 'UNRESOLVED-COND',
          file: rel(n),
          message: `Verdict: APPROVED WITH CONDITIONS\n  Unresolved conditions: ${unresolved.length}\n  Conditions:\n${condList}`,
          action: 'Address conditions and update review document, or schedule follow-up review',
        });
      }
    }

    // Rule 4: ORPHAN-REQ
    const reqMetas = byType['REQ'] || [];
    if (reqMetas.length > 0) {
      const adrReferenced = new Set();
      for (const n of (byType['ADR'] || [])) {
        for (const id of n.reqIds) adrReferenced.add(id);
      }
      for (const type of ['HLDR', 'DLDR', 'TRAC']) {
        for (const n of (byType[type] || [])) {
          for (const id of extractRequirementIds(n.content)) adrReferenced.add(id);
        }
      }
      for (const reqNode of reqMetas) {
        if (!reqNode.reqIds || reqNode.reqIds.length === 0) continue;
        const orphaned = reqNode.reqIds.filter(id => !adrReferenced.has(id));
        if (orphaned.length === 0) continue;
        const examples = orphaned.slice(0, 5).join(', ');
        const more = orphaned.length > 5 ? ` (+${orphaned.length - 5} more)` : '';
        findings.push({
          severity: 'MEDIUM',
          rule: 'ORPHAN-REQ',
          file: rel(reqNode),
          message: `Total requirements: ${reqNode.reqIds.length}\n  Requirements not referenced by any ADR: ${orphaned.length}\n  Examples: ${examples}${more}`,
          action: 'Review whether these requirements need architectural decisions documented as ADRs',
        });
      }
    }

    // Rule 5: MISSING-TRACE
    for (const n of (byType['ADR'] || [])) {
      if (n.reqIds && n.reqIds.length > 0) continue;
      if (/ARC-\d{3}-REQ/i.test(n.content)) continue;
      const titleMatch = n.content.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1].trim() : n.path.split('/').pop();
      findings.push({
        severity: 'MEDIUM',
        rule: 'MISSING-TRACE',
        file: rel(n),
        message: `ADR title: ${title}\n  Status: ${extractAdrStatus(n.content, n.controlFields) || 'Unknown'}`,
        action: 'Add requirement references to link this decision to specific requirements',
      });
    }

    // Rule 6: VERSION-DRIFT
    for (const group of Object.values(byType)) {
      if (group.length < 2) continue;
      const sorted = [...group].sort((a, b) => parseFloat(b.version || '0') - parseFloat(a.version || '0'));
      const latest = sorted[0];
      const dateStr = latest.lastModified || latest.createdDate;
      if (!dateStr) continue;
      const age = daysBetween(dateStr, baseline);
      if (age > 90) {
        const versions = sorted.map(m => `v${m.version}`).join(', ');
        findings.push({
          severity: 'LOW',
          rule: 'VERSION-DRIFT',
          file: rel(latest),
          message: `Versions found: ${versions}\n  Latest version: ${rel(latest)} (last modified: ${dateStr}, ${age} days ago)`,
          action: 'Confirm the latest version is current, or archive superseded versions',
        });
      }
    }

    // Rule 7: STALE-EXT
    const externals = (graph.externalFiles || {})[projectName] || [];
    if (externals.length > 0) {
      let newestArtifactMtime = 0;
      for (const n of projectNodes) {
        if (typeof n.mtimeMs === 'number' && n.mtimeMs > newestArtifactMtime) {
          newestArtifactMtime = n.mtimeMs;
        }
      }
      const stale = [];
      for (const ext of externals) {
        if (ext.mtimeMs > newestArtifactMtime || newestArtifactMtime === 0) {
          stale.push({ filename: ext.filename, commands: recommendCommands(ext.filename) });
        }
      }
      if (stale.length > 0) {
        const fileList = stale.map(sf => `    - ${sf.filename} → Recommended: ${sf.commands}`).join('\n');
        findings.push({
          severity: 'HIGH',
          rule: 'STALE-EXT',
          file: projectName,
          message: `Unincorporated external files: ${stale.length}\n  Files:\n${fileList}`,
          action: 'Re-run recommended commands to incorporate external file content into architecture artifacts',
        });
      }
    }

    const filtered = findings.filter(f => (SEVERITY_ORDER[f.severity] || 0) >= minLevel);
    projectResults.push({
      projectId: projectName,
      artifactCount: projectNodes.length,
      findings: filtered,
    });
  }

  // Build JSON for docs/health.json
  const summary = { HIGH: 0, MEDIUM: 0, LOW: 0, total: 0 };
  const byTypeCounts = {
    'STALE-RSCH': 0, 'FORGOTTEN-ADR': 0, 'UNRESOLVED-COND': 0,
    'STALE-EXT': 0, 'ORPHAN-REQ': 0, 'MISSING-TRACE': 0, 'VERSION-DRIFT': 0,
  };
  let totalArtifacts = 0;
  const projectsJson = [];
  for (const pr of projectResults) {
    totalArtifacts += pr.artifactCount;
    const projEntry = { id: pr.projectId, artifacts: pr.artifactCount, findings: [] };
    for (const f of pr.findings) {
      summary[f.severity] = (summary[f.severity] || 0) + 1;
      summary.total++;
      byTypeCounts[f.rule] = (byTypeCounts[f.rule] || 0) + 1;
      projEntry.findings.push({ ...f });
    }
    projectsJson.push(projEntry);
  }

  const jsonData = {
    generated: baseline.toISOString(),
    scanned: { projects: projectResults.length, artifacts: totalArtifacts },
    summary,
    byType: byTypeCounts,
    projects: projectsJson,
  };

  // Write docs/health.json (preserve dashboard side effect)
  const docsDir = join(repoRoot, 'docs');
  if (!isDir(docsDir)) mkdirSync(docsDir, { recursive: true });
  writeFileSync(join(docsDir, 'health.json'), JSON.stringify(jsonData, null, 2), 'utf8');

  // additionalContext output
  const lines = [];
  lines.push('## Health Pre-processor Complete (hook)');
  lines.push('');
  lines.push('**All metadata extracted and rules applied. The command only needs to format the console output.**');
  lines.push('');
  lines.push('### Scan Parameters');
  lines.push(`- **Baseline date**: ${baseline.toISOString().split('T')[0]}`);
  lines.push(`- **Projects scanned**: ${jsonData.scanned.projects}`);
  lines.push(`- **Artifacts scanned**: ${jsonData.scanned.artifacts}`);
  lines.push(`- **Severity filter**: ${severityArg}`);
  if (projectArg) lines.push(`- **Project filter**: ${projectArg}`);
  lines.push(`- **JSON output**: docs/health.json written`);
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
      for (const msgLine of f.message.split('\n')) lines.push(`  ${msgLine}`);
      lines.push(`  Action: ${f.action}`);
      lines.push('');
    }
  }
  lines.push('### What to do');
  lines.push('- **Skip Steps 1-3** — all metadata has been extracted and rules applied');
  lines.push('- **Format the Step 4 console output** using the findings above');
  lines.push('- **Include the Step 4.3 Recommended Actions** section using finding counts');
  lines.push('- **Step 5 JSON already written** — docs/health.json is complete');

  return lines.join('\n');
}

function formatTraceability(graph, prompt) {
  const arg = parseProjectArg(prompt, 'traceability');

  if (graph.projects.length === 0) return null;
  if (graph.projects.length > 1 && !arg) return null;

  const projectName = graph.projects[0];
  const requirements = (graph.requirements || {})[projectName] || [];
  if (requirements.length === 0) {
    // Surface the failure mode instead of silently exiting — otherwise the
    // slash-command's manual-fallback path makes it look like the hook never ran.
    const projectNodes = Object.values(graph.nodes).filter(n => n.project === projectName);
    if (projectNodes.length === 0) return null;
    return [
      '## Traceability Pre-processor (hook)',
      '',
      `**No requirements extracted from \`${projectName}\`.**`,
      '',
      'The extractor expects requirement headings of the form:',
      '  - `### BR-1:` / `### BR-001:` (Business)',
      '  - `#### FR-1:` / `#### FR-001:` (Functional, NFR, INT, DR)',
      '',
      'Falling back to manual extraction. If the REQ document uses table-row format only',
      '(no headings), or a non-standard ID prefix, the hook cannot help and the slash command',
      'will read artifacts directly.',
    ].join('\n');
  }

  // Build refMap: reqId → [{ file, type, vendor }]
  // Source: every non-REQ node in this project whose reqIds list cites the ID.
  const DESIGN_TYPES = new Set(['ADR', 'HLD', 'DLD', 'HLDR', 'DLDR']);
  const refMap = {};
  const projectNodes = Object.values(graph.nodes).filter(n => n.project === projectName);

  for (const n of projectNodes) {
    if (n.type === 'REQ') continue;
    if (!Array.isArray(n.reqIds) || n.reqIds.length === 0) continue;

    let label = n.type;
    if (DESIGN_TYPES.has(n.type) && n.vendor && (n.type === 'HLD' || n.type === 'DLD')) {
      label = `Vendor ${n.type}`;
    } else if (!DESIGN_TYPES.has(n.type) && n.vendor) {
      label = 'Vendor Doc';
    }

    const filename = n.path.split('/').pop();
    const rel = n.subdir ? `${n.subdir}/${filename}` : filename;

    for (const id of n.reqIds) {
      if (!refMap[id]) refMap[id] = [];
      refMap[id].push({ file: rel, type: label, vendor: n.vendor });
    }
  }

  // Coverage
  const reqIdSet = new Set(requirements.map(r => r.id));
  const coverage = {
    total: requirements.length,
    covered: 0,
    orphan: [],
    designOnly: [],
    byCategory: {},
    byPriority: {},
  };
  const prefixMap = { Business: 'BR', Functional: 'FR', 'Non-Functional': 'NFR', Integration: 'INT', Data: 'DR' };

  for (const req of requirements) {
    const isCovered = !!(refMap[req.id] && refMap[req.id].length > 0);
    if (isCovered) coverage.covered++;
    else coverage.orphan.push(req);

    if (!coverage.byCategory[req.category]) {
      coverage.byCategory[req.category] = { total: 0, covered: 0, prefix: prefixMap[req.category] || req.category };
    }
    coverage.byCategory[req.category].total++;
    if (isCovered) coverage.byCategory[req.category].covered++;

    if (!coverage.byPriority[req.priority]) {
      coverage.byPriority[req.priority] = { total: 0, covered: 0 };
    }
    coverage.byPriority[req.priority].total++;
    if (isCovered) coverage.byPriority[req.priority].covered++;
  }

  for (const id of Object.keys(refMap)) {
    if (!reqIdSet.has(id)) coverage.designOnly.push({ id, refs: refMap[id] });
  }

  // Doc stats — derived from project nodes
  const adrs = projectNodes
    .filter(n => n.type === 'ADR')
    .map(n => `decisions/${n.path.split('/').pop()}`);

  const vendorEntries = (graph.vendors || {})[projectName] || [];
  const vendorDocsMap = {};
  let totalVendorDocs = 0;
  for (const v of vendorEntries) {
    if (v.docs.length > 0) {
      vendorDocsMap[v.name] = v.docs;
      totalVendorDocs += v.docs.length;
    }
  }

  const reviews = projectNodes
    .filter(n => n.type === 'HLDR' || n.type === 'DLDR')
    .map(n => {
      const filename = n.path.split('/').pop();
      return n.subdir ? `${n.subdir}/${filename}` : filename;
    });

  // Existing TRAC version
  const tracVersions = projectNodes
    .filter(n => n.type === 'TRAC' && n.path.endsWith('.md'))
    .map(n => {
      const m = n.path.match(/-v([\d.]+)\.md$/);
      return m ? m[1] : null;
    })
    .filter(Boolean)
    .sort((a, b) => parseFloat(b) - parseFloat(a));
  const existingVersion = tracVersions[0] || null;
  const suggestedVersion = (() => {
    if (!existingVersion) return '1.0';
    const [maj, min = '0'] = existingVersion.split('.');
    return `${parseInt(maj, 10)}.${parseInt(min, 10) + 1}`;
  })();

  const reqFiles = [...new Set(requirements.map(r => r.sourceFile))];

  // Output
  const lines = [];
  lines.push('## Traceability Pre-processor Complete (hook)');
  lines.push('');
  lines.push('**All requirement IDs extracted and cross-referenced.**');
  lines.push('');
  lines.push('### Project');
  lines.push(`- **Project**: ${projectName}`);
  lines.push(`- **ArcKit Version**: ${readArckitVersion()}`);
  lines.push(`- **REQ files scanned**: ${reqFiles.join(', ')}`);
  lines.push(`- **Existing TRAC version**: ${existingVersion || 'none'}`);
  lines.push(`- **Suggested next version**: v${suggestedVersion}`);
  lines.push('');

  lines.push('### REQUIREMENTS — use these directly to build the matrix');
  lines.push('');
  lines.push('| Req ID | Category | Priority | Description | Covered | Referenced By |');
  lines.push('|--------|----------|----------|-------------|---------|---------------|');
  for (const req of requirements) {
    const refs = refMap[req.id];
    const isCovered = refs && refs.length > 0;
    const refList = isCovered ? refs.map(r => r.file).join(', ') : '—';
    const desc = req.description.length > 80 ? req.description.substring(0, 77) + '...' : req.description;
    lines.push(`| ${req.id} | ${req.category} | ${req.priority} | ${desc} | ${isCovered ? 'Yes' : 'No'} | ${refList} |`);
  }
  lines.push('');

  lines.push('### COVERAGE SUMMARY');
  lines.push('');
  lines.push('| Metric | Covered | Total | Pct |');
  lines.push('|--------|---------|-------|-----|');
  lines.push(`| Overall | ${coverage.covered} | ${coverage.total} | ${pct(coverage.covered, coverage.total)} |`);

  for (const cat of ['Business', 'Functional', 'Non-Functional', 'Integration', 'Data']) {
    const c = coverage.byCategory[cat];
    if (!c) continue;
    lines.push(`| ${cat} (${c.prefix}) | ${c.covered} | ${c.total} | ${pct(c.covered, c.total)} |`);
  }
  for (const pri of ['MUST', 'SHOULD', 'MAY']) {
    const p = coverage.byPriority[pri];
    if (!p) continue;
    lines.push(`| ${pri} priority | ${p.covered} | ${p.total} | ${pct(p.covered, p.total)} |`);
  }
  lines.push('');

  if (coverage.orphan.length > 0) {
    lines.push('### Orphan Requirements (no design coverage)');
    lines.push('');
    for (const req of coverage.orphan) lines.push(`- ${req.id}: ${req.description}`);
    lines.push('');
  }

  if (coverage.designOnly.length > 0) {
    lines.push('### Design-Only References (not in REQ — scope creep?)');
    lines.push('');
    for (const e of coverage.designOnly) {
      const files = e.refs.map(r => r.file).join(', ');
      lines.push(`- ${e.id} referenced in ${files}`);
    }
    lines.push('');
  }

  lines.push('### Design Documents Scanned');
  lines.push('');
  lines.push(`- ADRs: ${adrs.length}${adrs.length > 0 ? ` (${adrs.join(', ')})` : ''}`);
  const vendorListEntries = Object.entries(vendorDocsMap);
  if (vendorListEntries.length > 0) {
    const vendorList = vendorListEntries.map(([v, files]) => `${v}: ${files.join(', ')}`).join('; ');
    lines.push(`- Vendor docs: ${totalVendorDocs} (${vendorList})`);
  } else {
    lines.push('- Vendor docs: 0');
  }
  lines.push(`- Reviews: ${reviews.length}${reviews.length > 0 ? ` (${reviews.join(', ')})` : ''}`);
  lines.push('');

  lines.push('### What to do');
  lines.push('- **Use the requirements table and coverage data** to build the traceability matrix');
  lines.push('- **Still read vendor HLD/DLD** if you need component names for design mapping columns');
  lines.push('- **Still read the template** for formatting');
  lines.push('- **Write outputs** per the command instructions');

  return lines.join('\n');
}

// ── Main ──────────────────────────────────────────────────────────────────

const data = parseHookInput();
const prompt = data.prompt || '';
const recipe = matchRecipe(prompt);
if (!recipe) process.exit(0);

const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const projectsDir = join(repoRoot, 'projects');
if (!isDir(projectsDir)) process.exit(0);

const opts = typeof recipe.opts === 'function' ? recipe.opts(prompt) : recipe.opts;
const graph = scanAllArtifacts(projectsDir, opts);
const additionalContext = recipe.format(graph, prompt, repoRoot);

if (additionalContext == null) process.exit(0);

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext,
  },
}));
