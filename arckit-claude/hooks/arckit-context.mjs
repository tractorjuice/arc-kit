#!/usr/bin/env node
/**
 * ArcKit UserPromptSubmit Hook
 *
 * Pre-computes project context when any /arckit: command is run.
 * Injects project inventory, artifact lists, and external documents
 * via additionalContext so commands don't need to discover this themselves.
 *
 * Hook Type: UserPromptSubmit
 * Input (stdin): JSON with prompt, cwd, etc.
 * Output (stdout): JSON with additionalContext containing project context
 */

import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DOC_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs';
import {
  isDir, isFile, mtimeMs, readText,
  findRepoRoot, extractDocType, parseHookInput,
} from './hook-utils.mjs';

function docTypeName(code) {
  return DOC_TYPES[code]?.name || code;
}

// --- Main ---
const data = parseHookInput();

const userPrompt = data.prompt || '';

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
const arckitVersion = readText(join(pluginRoot, 'VERSION'))?.trim() || 'unknown';

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
      const dtype = extractDocType(f) || f;
      const dname = docTypeName(dtype);
      artifactList.push(`  - \`${f}\` (${dname})`);
      artifactCount++;
      const amtime = mtimeMs(fp);
      if (amtime > newestArtifactMtime) newestArtifactMtime = amtime;
    }
  }

  // Also scan subdirectories (derived from SUBDIR_MAP + reviews)
  const subdirs = [...new Set(Object.values(SUBDIR_MAP)), 'reviews'];
  for (const subdir of subdirs) {
    const subPath = join(projectDir, subdir);
    if (isDir(subPath)) {
      for (const f of readdirSync(subPath).sort()) {
        const fp = join(subPath, f);
        if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
          const dtype = extractDocType(f) || f;
          const dname = docTypeName(dtype);
          artifactList.push(`  - \`${subdir}/${f}\` (${dname})`);
          artifactCount++;
          const amtime = mtimeMs(fp);
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

  // Check for vendor directories and profiles
  const vendorsDir = join(projectDir, 'vendors');
  if (isDir(vendorsDir)) {
    const vendorDirs = [];
    const vendorProfiles = [];
    for (const vname of readdirSync(vendorsDir).sort()) {
      const vpath = join(vendorsDir, vname);
      if (isDir(vpath)) vendorDirs.push(`  - ${vname}`);
      else if (isFile(vpath) && vname.endsWith('-profile.md')) vendorProfiles.push(`  - ${vname}`);
    }
    if (vendorDirs.length > 0 || vendorProfiles.length > 0) {
      lines.push(`- **Vendors** (${vendorDirs.length + vendorProfiles.length}):`);
      lines.push(...vendorProfiles, ...vendorDirs);
    }
  }

  // Check for tech notes
  const techNotesDir = join(projectDir, 'tech-notes');
  if (isDir(techNotesDir)) {
    const noteList = [];
    for (const f of readdirSync(techNotesDir).sort()) {
      if (isFile(join(techNotesDir, f)) && f.endsWith('.md')) noteList.push(`  - ${f}`);
    }
    if (noteList.length > 0) {
      lines.push(`- **Tech Notes** (${noteList.length}):`);
      lines.push(...noteList);
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
      const extMtime = mtimeMs(fp);
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
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: contextText,
  },
};
console.log(JSON.stringify(output));
