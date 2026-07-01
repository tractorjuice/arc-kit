#!/usr/bin/env node
/**
 * Export ArcKit ARC artefacts as an Open Knowledge Format-shaped bundle.
 *
 * This script mutates only the output directory. Source files under projects/
 * are copied with OKF frontmatter merged into the exported copy.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildOkfFieldsForArcArtifact,
  mergeOkfFrontmatter,
} from '../hooks/okf-frontmatter.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CWD = resolve(SCRIPT_DIR, '..', '..', '..');

function usage() {
  return `Usage: export-okf.mjs (--all | --project <project-id>) [--out <path>] [--cwd <repo-root>]`;
}

function parseArgs(argv) {
  const args = {
    all: false,
    project: null,
    out: 'okf',
    cwd: process.cwd(),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--all') {
      args.all = true;
    } else if (arg === '--project') {
      args.project = argv[++i] || null;
    } else if (arg === '--out') {
      args.out = argv[++i] || null;
    } else if (arg === '--cwd') {
      args.cwd = argv[++i] || null;
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  if (args.help) return args;
  if (!args.all && !args.project) throw new Error('provide --all or --project <project-id>');
  if (args.all && args.project) throw new Error('choose either --all or --project, not both');
  if (!args.out) throw new Error('--out requires a path');
  if (!args.cwd) args.cwd = DEFAULT_CWD;
  return args;
}

function toPosix(path) {
  return path.split(/[\\/]/).join('/');
}

function findProjectDirs(repoRoot, projectArg, all) {
  const projectsRoot = join(repoRoot, 'projects');
  if (!existsSync(projectsRoot) || !statSync(projectsRoot).isDirectory()) {
    throw new Error(`projects directory not found: ${projectsRoot}`);
  }

  const projects = readdirSync(projectsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /^\d{3}($|-)/.test(entry.name))
    .map(entry => entry.name)
    .sort();

  if (all) return projects.map(name => join(projectsRoot, name));

  const matches = projects.filter(name => name === projectArg || name.startsWith(`${projectArg}-`));
  if (matches.length === 0) throw new Error(`project not found: ${projectArg}`);
  if (matches.length > 1) throw new Error(`project is ambiguous: ${projectArg} (${matches.join(', ')})`);
  return [join(projectsRoot, matches[0])];
}

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(path));
    } else if (entry.isFile() && /^ARC-\d{3}-.+-v\d+(?:\.\d+)?\.md$/.test(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

function writeIndex(outDir, exported, generatedAt) {
  const lines = [
    '---',
    'type: OKF Bundle Index',
    'title: ArcKit OKF Export Index',
    'description: Index of ArcKit artefacts exported as an OKF bundle.',
    `timestamp: ${JSON.stringify(generatedAt)}`,
    'tags:',
    '  - arckit',
    '  - okf',
    '---',
    '',
    '# ArcKit OKF Export Index',
    '',
    `Generated: ${generatedAt}`,
    '',
    '| Artifact | Type | Source |',
    '|---|---|---|',
  ];

  for (const item of exported) {
    lines.push(`| [${item.documentId}](${item.outputPath}) | ${item.type} | \`${item.sourcePath}\` |`);
  }

  writeFileSync(join(outDir, 'index.md'), `${lines.join('\n')}\n`, 'utf8');
}

function writeLog(outDir, summary) {
  const lines = [
    '---',
    'type: OKF Export Log',
    'title: ArcKit OKF Export Log',
    'description: Export log for an ArcKit OKF bundle.',
    `timestamp: ${JSON.stringify(summary.generated_at)}`,
    'tags:',
    '  - arckit',
    '  - okf',
    '  - export-log',
    '---',
    '',
    '# ArcKit OKF Export Log',
    '',
    `Generated: ${summary.generated_at}`,
    `Repository root: \`${summary.repo_root}\``,
    `Output directory: \`${summary.output_dir}\``,
    `Artifact count: ${summary.artifact_count}`,
    '',
    '## Projects',
    '',
    ...summary.projects.map(project => `- \`${project}\``),
    '',
  ];
  writeFileSync(join(outDir, 'log.md'), `${lines.join('\n')}\n`, 'utf8');
}

function exportOkf(args) {
  const repoRoot = resolve(args.cwd);
  const outDir = resolve(repoRoot, args.out);
  const projectDirs = findProjectDirs(repoRoot, args.project, args.all);
  const generatedAt = new Date().toISOString();
  const exported = [];
  const warnings = [];

  mkdirSync(outDir, { recursive: true });

  for (const projectDir of projectDirs) {
    const artifactPaths = walk(projectDir);
    if (artifactPaths.length === 0) warnings.push(`no ARC markdown artefacts found in ${toPosix(relative(repoRoot, projectDir))}`);

    for (const artifactPath of artifactPaths) {
      const sourceRel = toPosix(relative(repoRoot, artifactPath));
      const content = readFileSync(artifactPath, 'utf8');
      const stat = statSync(artifactPath);
      const fields = buildOkfFieldsForArcArtifact({
        filePath: artifactPath,
        content,
        resource: sourceRel,
        timestamp: stat.mtime.toISOString(),
      });
      if (!fields) {
        warnings.push(`skipped non-ARC file: ${sourceRel}`);
        continue;
      }

      const outputRel = sourceRel;
      const outputPath = join(outDir, ...outputRel.split('/'));
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, mergeOkfFrontmatter(content, fields), 'utf8');

      exported.push({
        documentId: fields.arckit.document_id,
        type: fields.type,
        sourcePath: sourceRel,
        outputPath: toPosix(relative(outDir, outputPath)),
      });
    }
  }

  exported.sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
  const summary = {
    ok: true,
    generated_at: generatedAt,
    repo_root: repoRoot,
    output_dir: outDir,
    artifact_count: exported.length,
    projects: projectDirs.map(projectDir => relative(join(repoRoot, 'projects'), projectDir)).sort(),
    artifacts: exported,
    warnings,
  };

  writeIndex(outDir, exported, generatedAt);
  writeLog(outDir, summary);
  return summary;
}

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      console.log(usage());
      return;
    }
    const summary = exportOkf(args);
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
    process.exit(1);
  }
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] || '')) {
  main();
}

export { exportOkf, parseArgs };
