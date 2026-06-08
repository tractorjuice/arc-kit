#!/usr/bin/env node
/**
 * ArcKit Graph Utilities — Shared dependency graph builder
 *
 * Used by:
 * - impact-scan.mjs (UserPromptSubmit hook for /arckit:impact)
 * - sync-guides.mjs (UserPromptSubmit hook for /arckit:pages → manifest.json)
 *
 * v2: Optional `opts` enrich the graph with content, full requirement records,
 * vendors, principles, risks, and external-file listings. Defaults preserve v1
 * behaviour exactly so existing consumers need no changes. See issue #162.
 */

import { join } from 'node:path';
import {
  isDir, isFile, readText, listDir, mtimeMs,
  extractDocType, extractVersion,
  extractDocControlFields, extractRequirementIds,
  extractRequirementDetails, extractPrinciples, extractRiskEntries,
} from './hook-utils.mjs';
import { DOC_TYPES } from '../config/doc-types.mjs';

const DEFAULT_OPTS = Object.freeze({
  withNodeMetadata: false, // version, owner, classification, vendor, subdir, controlFields, reqIds
  withContent: false,      // full text + mtimeMs
  withPreview: false,      // ~500-char post-control preview
  withRequirements: false, // full requirement records per project
  withVendors: false,      // vendor structure with reviews + verdicts
  withPrinciples: false,   // extracted principles per project
  withRisks: false,        // extracted risk entries per project
  withExternals: false,    // projects/*/external/ listing
  excludeGlobal: false,    // skip 000-global
  projectFilter: null,     // dir name or 3-digit prefix
});

function resolveOpts(opts) {
  return { ...DEFAULT_OPTS, ...(opts || {}) };
}

/**
 * Extract first markdown heading from content.
 */
export function extractTitle(content) {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : null;
}

/**
 * Classify impact severity based on document type category.
 * HIGH = Compliance/Governance, MEDIUM = Architecture, LOW = everything else.
 */
export function classifySeverity(docType) {
  const info = DOC_TYPES[docType];
  if (!info) return 'LOW';
  const cat = info.category;
  if (cat === 'Compliance' || cat === 'Governance') return 'HIGH';
  if (cat === 'Architecture') return 'MEDIUM';
  return 'LOW';
}

/**
 * Build a ~500-char preview by skipping the leading doc-control table.
 */
export function extractPreview(content, maxLen = 500) {
  const lines = content.split('\n');
  let inTable = false;
  let pastControl = false;
  const previewLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!pastControl) {
      if (trimmed.startsWith('|') || trimmed === '' || trimmed.startsWith('#') || trimmed.startsWith('---')) {
        if (trimmed.startsWith('|')) inTable = true;
        else if (inTable && !trimmed.startsWith('|')) {
          inTable = false;
          pastControl = true;
        }
        continue;
      }
      pastControl = true;
    }

    if (pastControl && trimmed) {
      previewLines.push(trimmed);
    }

    if (previewLines.join(' ').length >= maxLen) break;
  }

  return previewLines.join(' ').substring(0, maxLen);
}

/**
 * Derive { subdir, vendor } from the prefix used while scanning.
 *   ''                       → { subdir: null, vendor: null }
 *   'decisions/'             → { subdir: 'decisions', vendor: null }
 *   'vendors/foo/'           → { subdir: 'vendors/foo', vendor: 'foo' }
 *   'vendors/foo/reviews/'   → { subdir: 'vendors/foo/reviews', vendor: 'foo' }
 */
function locationFromPrefix(prefix) {
  if (!prefix) return { subdir: null, vendor: null };
  const stripped = prefix.replace(/\/$/, '');
  const vendorMatch = stripped.match(/^vendors\/([^/]+)/);
  return { subdir: stripped, vendor: vendorMatch ? vendorMatch[1] : null };
}

/**
 * Scan a single project directory for ARC documents and build graph data.
 * Mutates nodes, edges, reqIndex in-place (legacy contract preserved).
 *
 * Optional `opts` (v2) enriches per-node fields and accumulates aggregations
 * into the optional `aggregations` argument when provided.
 */
export function scanProjectDir(projectDir, projectName, nodes, edges, reqIndex, opts, aggregations) {
  const o = resolveOpts(opts);
  const dirsToScan = [
    { dir: projectDir, prefix: '' },
    { dir: join(projectDir, 'decisions'), prefix: 'decisions/' },
    { dir: join(projectDir, 'diagrams'), prefix: 'diagrams/' },
    { dir: join(projectDir, 'wardley-maps'), prefix: 'wardley-maps/' },
    { dir: join(projectDir, 'data-contracts'), prefix: 'data-contracts/' },
    { dir: join(projectDir, 'reviews'), prefix: 'reviews/' },
    { dir: join(projectDir, 'research'), prefix: 'research/' },
  ];

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

  // Aggregations only populated when caller passes the bucket
  const reqAccum = aggregations?.requirements;
  const principlesAccum = aggregations?.principles;
  const risksAccum = aggregations?.risks;

  for (const { dir, prefix } of dirsToScan) {
    if (!isDir(dir)) continue;
    for (const f of listDir(dir)) {
      if (!f.startsWith('ARC-') || !f.endsWith('.md')) continue;
      const fp = join(dir, f);
      if (!isFile(fp)) continue;

      const content = readText(fp);
      if (!content) continue;

      const docType = extractDocType(f);
      const fields = extractDocControlFields(content);
      const title = extractTitle(content) || fields['Document Title'] || f;
      const status = fields['Status'] || '';
      const { subdir, vendor } = locationFromPrefix(prefix);

      const shortId = f.replace(/-v[\d.]+\.md$/, '');
      const fullId = f.replace(/\.md$/, '');

      const reqIdsSet = extractRequirementIds(content);

      // v1 fields — always populated, identical to pre-v2 output
      const node = {
        type: docType,
        project: projectName,
        path: `projects/${projectName}/${prefix}${f}`,
        title,
        status,
        severity: classifySeverity(docType),
        createdDate: fields['Created Date'] || null,
        lastModified: fields['Last Modified'] || null,
      };

      // v2 enrichments — gated to keep impact/pages output byte-stable
      if (o.withNodeMetadata) {
        node.version = extractVersion(f);
        node.owner = fields['Owner'] || fields['Document Owner'] || '';
        node.classification = fields['Classification'] || '';
        node.vendor = vendor;
        node.subdir = subdir;
        node.controlFields = fields;
        node.reqIds = Array.from(reqIdsSet);
      }
      if (o.withContent) {
        node.content = content;
        node.mtimeMs = mtimeMs(fp);
      }
      if (o.withPreview) {
        node.preview = extractPreview(content);
      }

      nodes[fullId] = node;

      for (const reqId of reqIdsSet) {
        if (!reqIndex[reqId]) reqIndex[reqId] = [];
        if (!reqIndex[reqId].includes(fullId)) {
          reqIndex[reqId].push(fullId);
        }
      }

      // Extract cross-references to other ARC documents (deduplicated per source)
      const ARC_REF_RE = /\bARC-(\d{3})-([A-Z][\w-]*?)(?:-(\d{3}))?(?:-v[\d.]+)?(?:\.md)?\b/g;
      const seenRefs = new Set();
      for (const m of content.matchAll(ARC_REF_RE)) {
        const refStr = m[0].replace(/\.md$/, '');
        const refShort = refStr.replace(/-v[\d.]+$/, '');
        const edgeKey = fullId + '>' + refShort;
        if (refShort !== shortId && !seenRefs.has(edgeKey)) {
          seenRefs.add(edgeKey);
          edges.push({ from: fullId, to: refShort, type: 'references' });
        }
      }

      // Aggregations
      if (reqAccum && docType === 'REQ') {
        if (!reqAccum[projectName]) reqAccum[projectName] = [];
        const details = extractRequirementDetails(content);
        for (const r of details) {
          reqAccum[projectName].push({ ...r, sourceFile: f });
        }
      }
      if (principlesAccum && docType === 'PRIN') {
        if (!principlesAccum[projectName]) principlesAccum[projectName] = [];
        for (const p of extractPrinciples(content)) {
          principlesAccum[projectName].push({ ...p, sourceFile: f });
        }
      }
      if (risksAccum && docType === 'RISK') {
        if (!risksAccum[projectName]) risksAccum[projectName] = [];
        for (const r of extractRiskEntries(content)) {
          risksAccum[projectName].push({ ...r, sourceFile: f });
        }
      }
    }
  }
}

/**
 * Build a per-project vendor structure with reviews + verdicts.
 */
function scanVendors(projectDir) {
  const vendors = [];
  const vendorsDir = join(projectDir, 'vendors');
  if (!isDir(vendorsDir)) return vendors;

  for (const name of listDir(vendorsDir)) {
    const vendorDir = join(vendorsDir, name);
    if (!isDir(vendorDir)) continue;

    const entry = { name, docs: [], reviews: [] };

    for (const f of listDir(vendorDir)) {
      if (!f.endsWith('.md')) continue;
      if (!isFile(join(vendorDir, f))) continue;
      entry.docs.push(f);
    }

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

/**
 * List files in projects/<name>/external/ with mtimes (excluding README.md).
 */
function scanExternals(projectDir) {
  const externalDir = join(projectDir, 'external');
  if (!isDir(externalDir)) return [];
  const out = [];
  for (const f of listDir(externalDir)) {
    if (f === 'README.md') continue;
    const fp = join(externalDir, f);
    if (!isFile(fp)) continue;
    out.push({ filename: f, path: fp, mtimeMs: mtimeMs(fp) });
  }
  return out;
}

/**
 * Scan all projects in the projects/ directory and build a complete dependency graph.
 *
 * v1 contract preserved: with no `opts`, returns `{ nodes, edges, reqIndex, projects }`
 * exactly as before. Optional fields (`requirements`, `vendors`, `principles`, `risks`,
 * `externalFiles`) are added only when the corresponding flag is set.
 */
export function scanAllArtifacts(projectsDir, opts) {
  const o = resolveOpts(opts);
  const nodes = {};
  const edges = [];
  const reqIndex = {};

  let projectDirs = listDir(projectsDir)
    .filter(e => isDir(join(projectsDir, e)) && /^\d{3}-/.test(e));

  if (o.excludeGlobal) {
    projectDirs = projectDirs.filter(e => e !== '000-global');
  }

  if (o.projectFilter) {
    projectDirs = projectDirs.filter(d =>
      d === o.projectFilter || d.startsWith(o.projectFilter)
    );
  }

  // Aggregation buckets (only built when requested)
  const aggregations = {};
  if (o.withRequirements) aggregations.requirements = {};
  if (o.withPrinciples) aggregations.principles = {};
  if (o.withRisks) aggregations.risks = {};

  for (const projectName of projectDirs) {
    const projectDir = join(projectsDir, projectName);
    scanProjectDir(projectDir, projectName, nodes, edges, reqIndex, o, aggregations);
  }

  const result = { nodes, edges, reqIndex, projects: projectDirs };

  if (o.withRequirements) result.requirements = aggregations.requirements;
  if (o.withPrinciples) result.principles = aggregations.principles;
  if (o.withRisks) result.risks = aggregations.risks;

  if (o.withVendors) {
    result.vendors = {};
    for (const projectName of projectDirs) {
      result.vendors[projectName] = scanVendors(join(projectsDir, projectName));
    }
  }

  if (o.withExternals) {
    result.externalFiles = {};
    for (const projectName of projectDirs) {
      result.externalFiles[projectName] = scanExternals(join(projectsDir, projectName));
    }
  }

  return result;
}
