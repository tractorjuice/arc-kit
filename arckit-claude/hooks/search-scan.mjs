#!/usr/bin/env node
/**
 * ArcKit Search Pre-processor Hook
 *
 * Fires on UserPromptSubmit for /arckit:search commands.
 * Scans all projects for ARC-*.md files and builds a search-ready index
 * with document metadata and content previews.
 *
 * Hook Type: UserPromptSubmit (sync)
 * Input (stdin): JSON with prompt, cwd, etc.
 * Output (stdout): JSON with additionalContext containing search index
 */

import { join } from 'node:path';
import {
  isDir, isFile, readText, listDir,
  findRepoRoot, extractDocType, extractVersion,
  extractDocControlFields, extractRequirementIds,
  parseHookInput,
} from './hook-utils.mjs';

// ── Argument parsing ──

function parseArguments(prompt) {
  const text = prompt.replace(/^\/arckit[.:]+search\s*/i, '');
  return text.trim();
}

// ── Content preview extraction ──

function extractPreview(content, maxLen = 500) {
  // Skip document control table and revision history
  const lines = content.split('\n');
  let inTable = false;
  let pastControl = false;
  const previewLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip leading headings and tables (doc control area)
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

// ── Title extraction ──

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)/m);
  return match ? match[1].trim() : null;
}

// ── Artifact scanning ──

function scanProject(projectDir, projectName) {
  const artifacts = [];

  function scanDir(dir, relPrefix) {
    if (!isDir(dir)) return;
    for (const f of listDir(dir)) {
      const fp = join(dir, f);
      if (!isFile(fp) || !f.startsWith('ARC-') || !f.endsWith('.md')) continue;

      const content = readText(fp);
      if (!content) continue;

      const docType = extractDocType(f);
      const version = extractVersion(f);
      const fields = extractDocControlFields(content);
      const title = extractTitle(content) || fields['Document Title'] || f;
      const reqIds = [...extractRequirementIds(content)];
      const preview = extractPreview(content);
      const relPath = relPrefix ? `${relPrefix}/${f}` : f;

      artifacts.push({
        filename: f,
        relPath,
        project: projectName,
        docType,
        version,
        title,
        status: fields['Status'] || '',
        owner: fields['Owner'] || fields['Document Owner'] || '',
        reqIds,
        preview,
        controlFields: Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('; '),
      });
    }
  }

  // Root level
  scanDir(projectDir, null);

  // Subdirectories
  for (const subdir of ['decisions', 'diagrams', 'wardley-maps', 'data-contracts', 'reviews', 'research']) {
    scanDir(join(projectDir, subdir), subdir);
  }

  // Vendor directories
  const vendorsDir = join(projectDir, 'vendors');
  if (isDir(vendorsDir)) {
    for (const vendor of listDir(vendorsDir)) {
      const vendorDir = join(vendorsDir, vendor);
      if (!isDir(vendorDir)) continue;
      scanDir(vendorDir, `vendors/${vendor}`);
      scanDir(join(vendorDir, 'reviews'), `vendors/${vendor}/reviews`);
    }
  }

  return artifacts;
}

// ── Main ──

const data = parseHookInput();

// Guard: only fire for /arckit:search
const userPrompt = data.prompt || '';
const isRawCommand = /^\s*\/arckit[.:]+search\b/i.test(userPrompt);
const isExpandedBody = /description:\s*Search across all project artifacts/i.test(userPrompt);
if (!isRawCommand && !isExpandedBody) process.exit(0);

const query = parseArguments(userPrompt);

// Find repo root
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const projectsDir = join(repoRoot, 'projects');
if (!isDir(projectsDir)) process.exit(0);

// Discover and scan all projects
const allArtifacts = [];
const projectDirs = listDir(projectsDir)
  .filter(e => isDir(join(projectsDir, e)) && /^\d{3}-/.test(e));

for (const projectName of projectDirs) {
  const projectDir = join(projectsDir, projectName);
  const artifacts = scanProject(projectDir, projectName);
  allArtifacts.push(...artifacts);
}

// Build output
const lines = [];
lines.push('## Search Pre-processor Complete (hook)');
lines.push('');
lines.push(`**Indexed ${allArtifacts.length} artifacts across ${projectDirs.length} project(s).**`);
lines.push('');
lines.push(`**User query:** ${query || '(no query provided)'}`);
lines.push('');
lines.push('### SEARCH INDEX (JSON)');
lines.push('');
lines.push('```json');
lines.push(JSON.stringify(allArtifacts, null, 2));
lines.push('```');
lines.push('');
lines.push('### Instructions');
lines.push('- Parse the query for keywords, --type=XXX, --project=NNN, --id=XX-NNN filters');
lines.push('- Score results: title match=10, control fields=5, preview=3, filename=2');
lines.push('- Output ranked table with top result preview');
lines.push('- If no results, suggest broadening the search');

const message = lines.join('\n');

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: message,
  },
};
console.log(JSON.stringify(output));
