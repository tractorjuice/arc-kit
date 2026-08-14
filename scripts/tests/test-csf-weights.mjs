#!/usr/bin/env node
/**
 * SOV weight guard for the EU Cloud Sovereignty Framework (EUCSF) assessment.
 *
 * Ground truth, verified against the European Commission's primary sources —
 * NOT re-derived here:
 *   - Implementation guidance, p.7:
 *     https://commission.europa.eu/document/download/2ad80a48-166f-4c77-a513-80c53ca2a128_en?filename=Cloud+Sovereignty+Framework+-+Implementation+guidance.pdf
 *   - Annex calculator XLSX, cells D4/D45/D76/D102/D133/D169/D195/D231:
 *     https://commission.europa.eu/document/download/3acb8fe8-8a4a-4339-ae74-f56138d913d1_en?filename=Annex+-+Sovereignty+assessment+calculator.xlsx
 *
 * arc-kit previously shipped SOV-1 15%, SOV-5 20%, SOV-7 10% — wrong, but a
 * PERMUTATION of the correct eight values, so it still summed to 100%. Two
 * independent "totals exactly 100%" checks (this guard's predecessor and
 * `quality-checklist.md`'s EUCSF checklist item) both passed against the
 * wrong data, because a permutation of a correct set is invariant to a sum
 * check. This guard exists so that can never happen again: every SOV-N is
 * asserted INDIVIDUALLY against its own known-correct weight, never only as
 * a sum.
 *
 * It globs every file that carries an SOV weight table — the canonical
 * sources AND their generated mirrors — because the defect this guards
 * against is exactly the kind that survives a sync: a wrong canonical value
 * propagates byte-for-byte into every mirror, and per-file parity checks
 * (`sync-shared-assets.py --check`, `sync-claude-plugin-layout.py --check`,
 * `check-guide-parity.py`) all pass since the mirrors match their (wrong)
 * source exactly.
 *
 * A "weight occurrence" is recognised in two shapes:
 *   - a markdown table row whose first cell starts with `SOV-<n>` and some
 *     later cell is exactly `<NN>%` (covers the Executive Summary table, the
 *     Objective Weights table, and the Scored Result table, which all place
 *     the weight in a different column position)
 *   - a subsection header of the form `SOV-<n> ... (Weight: <NN>%)`
 *
 * Both shapes require the percentage to be either the entire content of its
 * own table cell or captured inside `(Weight: ...)` — so prose that merely
 * mentions "SOV-1 to SOV-8" alongside an unrelated "100%" (e.g. "weights
 * summing to 100%") is never mistaken for a per-objective weight.
 *
 * Exit 0 = every SOV-N weight occurrence found under the guarded roots
 * matches the framework, and no file carrying a weight table is missing an
 * objective. Exit 1 = mismatch.
 */

import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative, join } from 'node:path';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

// The eight EUCSF objective weights, per the primary sources cited above.
const CORRECT_WEIGHTS = {
  'SOV-1': 20, // Strategic Sovereignty
  'SOV-2': 10, // Legal & Jurisdictional Sovereignty
  'SOV-3': 10, // Data & AI Sovereignty
  'SOV-4': 15, // Operational Sovereignty
  'SOV-5': 10, // Supply Chain Sovereignty
  'SOV-6': 15, // Technology Sovereignty
  'SOV-7': 15, // Security & Compliance Sovereignty
  'SOV-8': 5, // Environmental Sustainability
};
const EXPECTED_KEYS = Object.keys(CORRECT_WEIGHTS);

// Canonical sources AND every generated mirror that can carry a copy of the
// weight table. Neither `sync-shared-assets.py` nor `sync-claude-plugin-
// layout.py` nor `check-guide-parity.py --sync` can fix a WRONG value that
// is correctly propagated from a wrong canonical source — only this guard,
// run against every root, can.
const ROOTS = [
  'plugins/arckit-eu',
  'plugins/arckit-claude/plugins/eu',
  '.arckit/templates',
  'docs/guides/eu-cloud-sovereignty.md',
  'plugins/arckit-claude/docs/guides',
];

function collectMarkdownFiles(root) {
  const abs = resolve(repoRoot, root);
  if (!existsSync(abs)) return [];
  const stat = statSync(abs);
  if (stat.isFile()) return abs.endsWith('.md') ? [abs] : [];
  const out = [];
  const stack = [abs];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) stack.push(p);
      else if (entry.isFile() && entry.name.endsWith('.md')) out.push(p);
    }
  }
  return out;
}

// Matches subsection headers like `### 4.1 SOV-1 Strategic Sovereignty
// (Weight: 15%)`. The percentage must be inside the `(Weight: ...)` group,
// not merely present anywhere on the line.
const HEADER_RE = /SOV-(\d)\b.*\(Weight:\s*(\d{1,3})%\)/;

// Splits a markdown table row into trimmed cells, dropping the empty
// leading/trailing cells produced by the row's outer pipes. Returns null for
// lines that are not table rows.
function parseRowCells(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return null;
  let cells = trimmed.split('|').map((c) => c.trim());
  if (cells[0] === '') cells = cells.slice(1);
  if (cells.length > 0 && cells[cells.length - 1] === '') cells = cells.slice(0, -1);
  return cells;
}

let ok = true;
let filesChecked = 0;
let occurrencesChecked = 0;

const files = new Set();
for (const root of ROOTS) {
  for (const f of collectMarkdownFiles(root)) files.add(f);
}

for (const file of [...files].sort()) {
  const rel = relative(repoRoot, file);
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const occurrences = [];

  lines.forEach((line, idx) => {
    const headerMatch = line.match(HEADER_RE);
    if (headerMatch) {
      occurrences.push({
        lineNo: idx + 1,
        sov: `SOV-${headerMatch[1]}`,
        weight: Number(headerMatch[2]),
      });
      return;
    }

    const cells = parseRowCells(line);
    if (!cells || cells.length < 2) return;
    const firstCell = cells[0].replace(/\*\*/g, '');
    const sovMatch = firstCell.match(/^SOV-(\d)\b/);
    if (!sovMatch) return;

    // The weight is whichever later cell is EXACTLY `<digits>%` — this
    // correctly skips placeholder cells like `[Score]` or `[Max]` that
    // precede the weight column in the Scored Result table.
    const pctCell = cells.slice(1).find((c) => /^\d{1,3}%$/.test(c));
    if (!pctCell) return;

    occurrences.push({
      lineNo: idx + 1,
      sov: `SOV-${sovMatch[1]}`,
      weight: Number(pctCell.slice(0, -1)),
    });
  });

  if (occurrences.length === 0) continue; // no SOV weight table in this file — nothing to check

  filesChecked += 1;

  for (const occ of occurrences) {
    occurrencesChecked += 1;
    const expected = CORRECT_WEIGHTS[occ.sov];
    if (expected === undefined) {
      ok = false;
      console.error(`[FAIL] ${rel}:${occ.lineNo}: unrecognised objective ${occ.sov} (not one of SOV-1..SOV-8)`);
      continue;
    }
    if (occ.weight !== expected) {
      ok = false;
      console.error(
        `[FAIL] ${rel}:${occ.lineNo}: ${occ.sov} weight is ${occ.weight}%, the framework says ${expected}%`,
      );
    }
  }

  const foundKeys = new Set(occurrences.map((o) => o.sov));
  const missing = EXPECTED_KEYS.filter((k) => !foundKeys.has(k));
  if (missing.length > 0) {
    ok = false;
    console.error(
      `[FAIL] ${rel}: carries an SOV weight table but is missing objective(s) ${missing.join(', ')}`,
    );
  }
}

if (filesChecked === 0) {
  ok = false;
  console.error(
    '[FAIL] no file under the guarded roots carries an SOV weight table — the guard\'s roots are broken:',
  );
  for (const root of ROOTS) console.error('  -', root);
}

if (ok) {
  console.log(
    `[PASS] ${occurrencesChecked} SOV weight occurrence(s) across ${filesChecked} file(s) all match the ` +
      'framework (SOV-1 20%, SOV-2 10%, SOV-3 10%, SOV-4 15%, SOV-5 10%, SOV-6 15%, SOV-7 15%, SOV-8 5%).',
  );
  process.exit(0);
}
process.exit(1);
