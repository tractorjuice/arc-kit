#!/usr/bin/env node
/**
 * ArcKit Graph Utilities — Shared dependency graph builder
 *
 * Used by:
 * - impact-scan.mjs (UserPromptSubmit hook for /arckit:impact)
 * - sync-guides.mjs (UserPromptSubmit hook for /arckit:pages → manifest.json)
 */

import { join } from 'node:path';
import {
  isDir, isFile, readText, listDir,
  extractDocType,
  extractDocControlFields, extractRequirementIds,
} from './hook-utils.mjs';
import { DOC_TYPES } from '../config/doc-types.mjs';

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
 * Scan a single project directory for ARC documents and build graph data.
 * Mutates nodes, edges, reqIndex in-place.
 */
export function scanProjectDir(projectDir, projectName, nodes, edges, reqIndex) {
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

      const reqIds = extractRequirementIds(content);
      for (const reqId of reqIds) {
        if (!reqIndex[reqId]) reqIndex[reqId] = [];
        if (!reqIndex[reqId].includes(fullId)) {
          reqIndex[reqId].push(fullId);
        }
      }

      // Extract cross-references to other ARC documents
      const ARC_REF_RE = /\bARC-(\d{3})-([A-Z][\w-]*?)(?:-(\d{3}))?(?:-v[\d.]+)?(?:\.md)?\b/g;
      for (const m of content.matchAll(ARC_REF_RE)) {
        const refStr = m[0].replace(/\.md$/, '');
        const refShort = refStr.replace(/-v[\d.]+$/, '');
        if (refShort !== shortId) {
          edges.push({ from: fullId, to: refShort, type: 'references' });
        }
      }
    }
  }
}

/**
 * Scan all projects in the projects/ directory and build a complete dependency graph.
 * Returns { nodes, edges, reqIndex, projects }.
 */
export function scanAllArtifacts(projectsDir) {
  const nodes = {};
  const edges = [];
  const reqIndex = {};

  const projectDirs = listDir(projectsDir)
    .filter(e => isDir(join(projectsDir, e)) && /^\d{3}-/.test(e));

  for (const projectName of projectDirs) {
    const projectDir = join(projectsDir, projectName);
    scanProjectDir(projectDir, projectName, nodes, edges, reqIndex);
  }

  return { nodes, edges, reqIndex, projects: projectDirs };
}
