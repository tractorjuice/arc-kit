#!/usr/bin/env node
/**
 * ArcKit Graph Rollups — Shared health, coverage, and compliance computations
 *
 * Used by:
 * - graph-inject.mjs (formatNavigator, formatGraphReport, formatHealth)
 * - sync-guides.mjs  (manifest.projectHealth + per-node health flags for the
 *                     dashboard Document Map and Project Health panel)
 *
 * Pure data — no Markdown formatting. Callers shape the output.
 */

import { DOC_TYPES } from '../config/doc-types.mjs';

// ── Constants ──────────────────────────────────────────────────────────────

/**
 * Doc types whose category yields HIGH severity in classifySeverity().
 * Used for "compliance readiness" scoring.
 */
export const HIGH_SEVERITY_TYPES = ['TCOP', 'SECD', 'SECD-MOD', 'DPIA', 'SVCASS',
  'RISK', 'TRAC', 'CONF', 'PRIN-COMP', 'AIPB', 'ATRS', 'JSP936'];

/**
 * Essential doc types per tier — used by navigator to compute coverage and
 * recommend the next command. Tiers represent rough dependency order.
 */
export const ESSENTIAL_TYPES = [
  { type: 'REQ',  tier: 1, command: '/arckit:requirements',  label: 'Requirements' },
  { type: 'STKE', tier: 1, command: '/arckit:stakeholders',  label: 'Stakeholder Analysis' },
  { type: 'RISK', tier: 1, command: '/arckit:risk',          label: 'Risk Register' },
  { type: 'SOBC', tier: 2, command: '/arckit:sobc',          label: 'Strategic Outline Business Case' },
  { type: 'ADR',  tier: 3, command: '/arckit:adr',           label: 'Architecture Decision Record' },
  { type: 'HLDR', tier: 3, command: '/arckit:hld-review',    label: 'High-Level Design Review' },
  { type: 'TRAC', tier: 4, command: '/arckit:traceability',  label: 'Traceability Matrix' },
  { type: 'CONF', tier: 4, command: '/arckit:conformance',   label: 'Conformance Assessment' },
];

export const CONTEXTUAL_TYPES = [
  { type: 'DPIA', command: '/arckit:dpia',       trigger: 'processing personal data' },
  { type: 'SECD', command: '/arckit:secure',     trigger: 'security-sensitive system' },
  { type: 'TCOP', command: '/arckit:tcop',       trigger: 'UK Gov Service Standard' },
  { type: 'DATA', command: '/arckit:data-model', trigger: 'DR-* requirements present' },
];

/** Days since lastModified before a node is flagged stale. */
export const STALE_THRESHOLD_DAYS = 90;

// ── Helpers ────────────────────────────────────────────────────────────────

function safeParseDate(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function daysBetween(date, baseline) {
  return Math.floor((baseline.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

function shortIdOf(fullId) {
  return fullId.replace(/-v[\d.]+$/, '');
}

function fullIdFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '');
}

// ── Per-node health ────────────────────────────────────────────────────────

/**
 * Compute health flags for every node in the graph and attach them as
 * `node.health = { stale, draft, orphan, ageDays }`.
 *
 * Mutates graph.nodes in place. Returns the graph for chaining.
 *
 * `stale` = lastModified (or createdDate) older than STALE_THRESHOLD_DAYS
 * `draft` = status matches /draft/i
 * `orphan` = no incoming or outgoing edges within the project's id-space
 */
export function tagNodeHealth(graph, baseline = new Date()) {
  if (!graph || !graph.nodes) return graph;

  // Build per-project full-id sets so orphan detection is project-scoped.
  const projectIds = {};
  for (const [fullId, node] of Object.entries(graph.nodes)) {
    if (!projectIds[node.project]) projectIds[node.project] = new Set();
    projectIds[node.project].add(fullId);
  }

  // Build connected sets per project from edges.
  const connectedByProject = {};
  for (const projectName of Object.keys(projectIds)) {
    connectedByProject[projectName] = new Set();
  }
  for (const e of graph.edges || []) {
    const fromNode = graph.nodes[e.from];
    if (!fromNode) continue;
    const proj = fromNode.project;
    const set = connectedByProject[proj];
    if (!set) continue;
    set.add(e.from);
    // Edge `to` is short-id; connect any matching full-id in the same project.
    for (const fullId of projectIds[proj]) {
      if (fullId === e.to || shortIdOf(fullId) === e.to) {
        set.add(fullId);
      }
    }
  }

  for (const [fullId, node] of Object.entries(graph.nodes)) {
    const dateStr = node.lastModified || node.createdDate;
    const d = safeParseDate(dateStr);
    const ageDays = d ? daysBetween(d, baseline) : null;
    const stale = ageDays != null && ageDays >= STALE_THRESHOLD_DAYS;
    const draft = /draft/i.test(node.status || '');
    const connected = connectedByProject[node.project];
    const orphan = !!connected && !connected.has(fullId);

    node.health = { stale, draft, orphan, ageDays };
  }

  return graph;
}

// ── Per-project rollup ─────────────────────────────────────────────────────

/**
 * Compute a per-project rollup with coverage, compliance, density, and
 * recommended next commands. Mirrors the formulas used in graph-inject.mjs
 * formatNavigator + formatGraphReport but returns structured data.
 *
 * @param {string} projectName  e.g. '001-foo'
 * @param {object} graph        from scanAllArtifacts (must include nodes, edges)
 * @param {Date}   baseline     reference "now" for stale calculations
 * @returns {object}            project rollup
 */
export function computeProjectRollup(projectName, graph, baseline = new Date()) {
  const projectNodes = Object.values(graph.nodes).filter(n => n.project === projectName);
  const projectFullIds = new Set(projectNodes.map(n => fullIdFromPath(n.path)));

  // Edges originating in this project
  const projectEdges = (graph.edges || []).filter(e => projectFullIds.has(e.from));
  const density = projectNodes.length === 0
    ? 0
    : projectEdges.length / projectNodes.length;

  // Type set
  const presentTypes = new Set(projectNodes.map(n => n.type).filter(Boolean));

  // Essential coverage (Tier 1–4 doc types)
  const essentialPresent = ESSENTIAL_TYPES.filter(e => presentTypes.has(e.type));
  const essentialMissing = ESSENTIAL_TYPES.filter(e => !presentTypes.has(e.type));
  const essentialPct = ESSENTIAL_TYPES.length === 0
    ? 0
    : Math.round((essentialPresent.length / ESSENTIAL_TYPES.length) * 100);

  // Contextual artifact suggestions (only flag those NOT present)
  const contextualMissing = CONTEXTUAL_TYPES.filter(c => !presentTypes.has(c.type));

  // Compliance readiness (HIGH-severity types)
  const presentHigh = HIGH_SEVERITY_TYPES.filter(t => presentTypes.has(t));
  const missingHigh = HIGH_SEVERITY_TYPES.filter(t => !presentTypes.has(t));
  const compliancePct = HIGH_SEVERITY_TYPES.length === 0
    ? 0
    : Math.round((presentHigh.length / HIGH_SEVERITY_TYPES.length) * 100);

  // Coverage by category — counts vs total possible types per category
  const presentByCategory = {};
  for (const t of presentTypes) {
    const info = DOC_TYPES[t];
    if (!info) continue;
    if (!presentByCategory[info.category]) presentByCategory[info.category] = 0;
    presentByCategory[info.category]++;
  }

  // Health rollup (count nodes already tagged via tagNodeHealth)
  const tagged = projectNodes.every(n => n.health !== undefined);
  const staleCount = tagged ? projectNodes.filter(n => n.health.stale).length : 0;
  const draftCount = tagged ? projectNodes.filter(n => n.health.draft).length : 0;
  const orphanCount = tagged ? projectNodes.filter(n => n.health.orphan).length : 0;

  // Global principles presence
  const hasGlobalPrin = Object.values(graph.nodes).some(
    n => n.project === '000-global' && n.type === 'PRIN'
  );

  // Recommended next commands — missing essentials in tier order, capped at 3
  const recommendations = essentialMissing
    .slice()
    .sort((a, b) => a.tier - b.tier)
    .slice(0, 3)
    .map(e => ({
      command: e.command,
      label: e.label,
      type: e.type,
      tier: e.tier,
      reason: `Tier ${e.tier} essential missing`,
    }));

  return {
    project: projectName,
    projectId: projectName.match(/^(\d{3})/)?.[1] || '',
    artifactCount: projectNodes.length,
    edgeCount: projectEdges.length,
    density: Number(density.toFixed(2)),
    coverage: {
      essentialPresent: essentialPresent.map(e => e.type),
      essentialMissing: essentialMissing.map(e => ({
        type: e.type,
        command: e.command,
        label: e.label,
        tier: e.tier,
      })),
      essentialPct,
      presentTypes: [...presentTypes].sort(),
      presentByCategory,
    },
    compliance: {
      presentHigh,
      missingHigh,
      pct: compliancePct,
      total: HIGH_SEVERITY_TYPES.length,
    },
    health: { stale: staleCount, draft: draftCount, orphan: orphanCount },
    contextualSuggestions: contextualMissing.map(c => ({
      command: c.command,
      type: c.type,
      trigger: c.trigger,
    })),
    hasGlobalPrin,
    recommendations,
  };
}

/**
 * Compute rollups for every working project in the graph (excludes 000-global).
 *
 * @param {object} graph     from scanAllArtifacts
 * @param {Date}   baseline  reference "now"
 * @returns {object[]}       array of per-project rollups, sorted by project name
 */
export function computeAllProjectRollups(graph, baseline = new Date()) {
  if (!graph || !graph.projects) return [];
  const working = graph.projects.filter(p => p !== '000-global').sort();
  return working.map(p => computeProjectRollup(p, graph, baseline));
}
