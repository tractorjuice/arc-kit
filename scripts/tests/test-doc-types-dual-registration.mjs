#!/usr/bin/env node
/**
 * Dual-registration test for ArcKit doc-type codes.
 *
 * Asserts that every code in `arckit-claude/config/doc-types.mjs` also appears
 * in the document-types allow-list table inside `arckit-claude/commands/pages.md`,
 * and vice versa. The two registries must stay in sync; without this test the
 * silent-omission failure mode (PR #317) recurs whenever a new overlay lands.
 *
 * Exit 0 = sync. Exit 1 = mismatch (prints the diff).
 *
 * Note on regex: pages.md uses the table format `| | CODE | \`ARC-*-CODE-*.md\` | Name |`
 * (empty first column for grouping). We extract CODE from the second cell when the
 * first cell is empty AND the third cell looks like an `ARC-*-CODE-*.md` glob, which
 * uniquely identifies type-code rows and excludes section headers / unrelated tables.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

const docTypesPath = resolve(repoRoot, 'arckit-claude/config/doc-types.mjs');
const pagesPath = resolve(repoRoot, 'arckit-claude/commands/pages.md');

const { DOC_TYPES } = await import(docTypesPath);
const docTypesCodes = new Set(Object.keys(DOC_TYPES));

const pagesContent = await readFile(pagesPath, 'utf8');
// Match `| | CODE | `ARC-*-CODE-*.{md,html}` | ... |` rows in the document-types allow-list table.
// CODE may include hyphens (e.g. PRIN-COMP, SECD-MOD).
const codeRowRe = /^\|\s*\|\s*([A-Z][A-Z0-9]*(?:-[A-Z][A-Z0-9]*)*)\s*\|\s*`ARC-\*-\1-\*\.(?:md|html)`\s*\|/gm;
const pagesCodes = new Set();
for (const m of pagesContent.matchAll(codeRowRe)) pagesCodes.add(m[1]);

const inDocTypesNotPages = [...docTypesCodes].filter((c) => !pagesCodes.has(c)).sort();
const inPagesNotDocTypes = [...pagesCodes].filter((c) => !docTypesCodes.has(c)).sort();

let ok = true;
if (inDocTypesNotPages.length > 0) {
  ok = false;
  console.error('[FAIL] Codes in doc-types.mjs but missing from pages.md table:');
  for (const c of inDocTypesNotPages) console.error('  -', c);
}
if (inPagesNotDocTypes.length > 0) {
  ok = false;
  console.error('[FAIL] Codes in pages.md table but missing from doc-types.mjs:');
  for (const c of inPagesNotDocTypes) console.error('  -', c);
}

if (ok) {
  console.log(`[PASS] ${docTypesCodes.size} codes registered consistently across both registries.`);
  process.exit(0);
}
process.exit(1);
