#!/usr/bin/env node
/**
 * Locate a user-installed Archify skill (https://github.com/tt-a1i/archify).
 *
 * ArcKit deliberately does not vendor Archify. It is MIT-licensed but ships
 * ~7.5MB of renderer that would be copied into every community plugin by
 * sync-shared-assets.py and into all seven generated extensions by
 * converter.py, and it moves fast enough that a fork would drift within
 * weeks. `/arckit:archify` therefore treats it as an optional peer tool:
 * detected at run time, used when present, degraded to `/arckit:diagram`
 * Mermaid when absent.
 *
 * Search order puts an explicit override first, then the project, then each
 * agent runtime's global skill directory.
 *
 * Usage:
 *   node archify-detect.mjs [--json]
 *
 * Exit codes: 0 found, 1 not found, 2 usage error.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';

/** Candidate roots, most specific first. */
export function candidateRoots(env = process.env, cwd = process.cwd(), home = homedir()) {
  const roots = [];
  if (env.ARCKIT_ARCHIFY_HOME) roots.push(resolve(env.ARCKIT_ARCHIFY_HOME));
  // Project-local installs
  roots.push(
    join(cwd, '.claude', 'skills', 'archify'),
    join(cwd, '.agents', 'skills', 'archify'),
    join(cwd, '.opencode', 'skill', 'archify'),
    join(cwd, 'node_modules', 'archify'),
  );
  // Global installs, one per supported runtime
  roots.push(
    join(home, '.claude', 'skills', 'archify'),
    join(home, '.codex', 'skills', 'archify'),
    join(home, '.agents', 'skills', 'archify'),
    join(home, '.config', 'opencode', 'skill', 'archify'),
    join(home, '.raven', 'workspace', 'skills', 'archify'),
    join(home, '.cursor', 'skills', 'archify'),
  );
  return roots;
}

/** An Archify install is identified by its CLI entry point plus schemas. */
export function isArchifyRoot(root) {
  try {
    return (
      statSync(root).isDirectory() &&
      existsSync(join(root, 'bin', 'archify.mjs')) &&
      existsSync(join(root, 'schemas'))
    );
  } catch {
    return false;
  }
}

function readVersion(root) {
  for (const [file, key] of [['skill-release.json', 'version'], ['package.json', 'version']]) {
    try {
      const parsed = JSON.parse(readFileSync(join(root, file), 'utf8'));
      if (parsed && typeof parsed[key] === 'string') return parsed[key];
    } catch {
      // fall through to the next candidate
    }
  }
  return null;
}

/** Diagram types the installed Archify can render, read from its schemas. */
function readTypes(root) {
  const known = ['architecture', 'workflow', 'sequence', 'dataflow', 'lifecycle'];
  return known.filter((type) => existsSync(join(root, 'schemas', `${type}.schema.json`)));
}

/**
 * @returns {{found: boolean, root: string|null, version: string|null,
 *            cli: string|null, types: string[], searched: string[]}}
 */
export function detectArchify(options = {}) {
  const roots = candidateRoots(options.env, options.cwd, options.home);
  for (const root of roots) {
    if (!isArchifyRoot(root)) continue;
    return {
      found: true,
      root,
      version: readVersion(root),
      cli: join(root, 'bin', 'archify.mjs'),
      types: readTypes(root),
      searched: roots,
    };
  }
  return { found: false, root: null, version: null, cli: null, types: [], searched: roots };
}

function main(argv) {
  const args = argv.slice(2);
  const asJson = args.includes('--json');
  if (args.some((a) => a === '--help' || a === '-h')) {
    console.log('Usage: archify-detect.mjs [--json]');
    process.exit(0);
  }

  const result = detectArchify();

  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.found) {
    console.log(`Archify ${result.version || '(unknown version)'} at ${result.root}`);
    console.log(`Types: ${result.types.join(', ') || 'none detected'}`);
  } else {
    console.log('Archify not found. Install it with:');
    console.log('  npx skills add tt-a1i/archify -g');
    console.log('Or set ARCKIT_ARCHIFY_HOME to an existing checkout.');
  }
  process.exit(result.found ? 0 : 1);
}

const invokedDirectly =
  process.argv[1] && process.argv[1].endsWith('archify-detect.mjs');
if (invokedDirectly) main(process.argv);

export default detectArchify;
