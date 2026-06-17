/**
 * ArcKit project-context builder.
 *
 * Returns a markdown string describing the current ArcKit repo state —
 * detected projects, ARC-* artifacts (top-level + subdirectories),
 * vendor profiles, tech notes, external documents, and global policies.
 *
 * Used by:
 *   - arckit-context.mjs        (UserPromptSubmit hook — fires on direct
 *                                user `/arckit:foo ...` prompts)
 *   - inject-agent-context.mjs  (PreToolUse hook on the Agent tool —
 *                                injects context when the LLM dispatches
 *                                an arckit-* subagent that wasn't
 *                                triggered by a user prompt, since
 *                                UserPromptSubmit hooks do NOT fire on
 *                                Agent/Skill tool dispatch)
 *
 * Returns `null` if `projects/` does not exist under the repo root, or
 * if no projects are present. Callers must handle that case.
 */

import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOC_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs';
import { isDir, isFile, listFilesRecursive, mtimeMs, readText, extractDocType } from './hook-utils.mjs';

function docTypeName(code) {
  return DOC_TYPES[code]?.name || code;
}

export function buildProjectContext(repoRoot) {
  if (!repoRoot) return null;
  const projectsDir = join(repoRoot, 'projects');
  if (!isDir(projectsDir)) return null;

  const pluginRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  const arckitVersion = readText(join(pluginRoot, 'VERSION'))?.trim() || 'unknown';

  const lines = [];
  lines.push('## ArcKit Project Context (auto-detected by hook)\n');
  lines.push(`Repository: ${repoRoot}`);
  lines.push(`ArcKit Version: ${arckitVersion}\n`);

  const projectEntries = readdirSync(projectsDir)
    .filter(e => isDir(join(projectsDir, e)))
    .sort();

  if (projectEntries.length === 0) return null;

  lines.push(`**${projectEntries.length} project(s) found:**\n`);

  for (const projectName of projectEntries) {
    const projectDir = join(projectsDir, projectName);

    let projectNumber = '';
    const pm = projectName.match(/^(\d{3})-/);
    if (pm) projectNumber = pm[1];

    lines.push(`### ${projectName}`);
    lines.push(`- **Path**: ${projectDir}`);
    if (projectNumber) lines.push(`- **Project ID**: ${projectNumber}`);

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

    const externalDir = join(projectDir, 'external');
    if (isDir(externalDir)) {
      const extList = [];
      for (const file of listFilesRecursive(externalDir)) {
        if (file.name === 'README.md') continue;
        const extMtime = mtimeMs(file.path);
        if (extMtime > newestArtifactMtime) {
          extList.push(`  - \`${file.relativePath}\` (**NEW** — newer than latest artifact)`);
        } else {
          extList.push(`  - \`${file.relativePath}\``);
        }
      }
      if (extList.length > 0) {
        lines.push(`- **External documents** (${extList.length}) in \`external/\`:`);
        lines.push(...extList);
      }
    }

    lines.push('');
  }

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

  return lines.join('\n');
}
