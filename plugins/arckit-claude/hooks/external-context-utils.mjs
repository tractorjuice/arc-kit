import { readdirSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { isDir, listDirsRecursive } from './hook-utils.mjs';

export function collectExternalWatchPaths(repoRoot) {
  const projectsDir = join(repoRoot, 'projects');
  if (!isDir(projectsDir)) return [];

  const watchPaths = [];
  for (const entry of readdirSync(projectsDir).sort()) {
    const projectDir = join(projectsDir, entry);
    if (!isDir(projectDir)) continue;

    const externalDir = join(projectDir, 'external');
    if (!isDir(externalDir)) continue;

    watchPaths.push(...listDirsRecursive(externalDir));
  }

  return watchPaths;
}

export function resolveEventPath(filePath, cwd) {
  if (!filePath) return '';
  return isAbsolute(filePath) ? resolve(filePath) : resolve(cwd || process.cwd(), filePath);
}

export function findExternalDocumentChange(repoRoot, filePath) {
  const projectsDir = join(repoRoot, 'projects');
  if (!isDir(projectsDir) || !filePath) return null;

  for (const projectName of readdirSync(projectsDir).sort()) {
    const projectDir = join(projectsDir, projectName);
    if (!isDir(projectDir)) continue;

    const externalDir = join(projectDir, 'external');
    if (!isDir(externalDir)) continue;

    const rel = relative(externalDir, filePath);
    if (!rel || rel.startsWith('..') || isAbsolute(rel)) continue;
    if (rel === 'README.md' || rel.endsWith('/README.md')) return null;

    return {
      projectName,
      relativePath: rel.split('\\').join('/'),
      projectRelativePath: relative(repoRoot, filePath).split('\\').join('/'),
    };
  }

  return null;
}
