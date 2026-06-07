#!/usr/bin/env node
/**
 * v5-migration-banner.mjs — one-shot SessionStart hook for the v4→v5 plugin split.
 *
 * Prints install suggestions for the per-jurisdiction community plugins the
 * user previously used in this project. Reads .arckit/manifest.json to detect
 * prior usage. Stops firing once .arckit/v5-migration-acked exists.
 *
 * Exit codes: always 0. Output goes to stdout for the SessionStart context.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const manifestPath = join(cwd, '.arckit/manifest.json');
const ackPath = join(cwd, '.arckit/v5-migration-acked');

if (existsSync(ackPath)) process.exit(0);
if (!existsSync(manifestPath)) process.exit(0);

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
} catch {
  process.exit(0);
}

const JURISDICTION_RE = /^arckit:(uae|fr|ca|eu|at)-/;
const used = new Set();
for (const entry of manifest.artefacts || []) {
  const m = entry.command?.match(JURISDICTION_RE);
  if (m) used.add(m[1]);
}

if (used.size === 0) process.exit(0);

const sorted = [...used].sort();
const plugins = sorted.map((j) => `arckit-${j}`).join(' ');
console.log(`
ArcKit v5.0.0 — community overlays now ship as separate plugins.

This project previously used: ${sorted.map((j) => `arckit:${j}-*`).join(', ')}

Install the matching plugins to keep those commands available:
  claude plugin install ${plugins}

Acknowledge (suppresses this banner):
  touch .arckit/v5-migration-acked
`);
