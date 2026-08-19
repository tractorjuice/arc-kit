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
 *   - a PROSE pair `SOV-<n> <objective name> <NN>%`, which is how
 *     `references/quality-checklist.md` states the eight weights. That item
 *     is the checklist's own defence against the permutation bug, and it was
 *     itself unguarded: it is neither a table row nor a `(Weight: ...)`
 *     header, and its 31 copies live outside the weight-table roots, so the
 *     two shapes above could not see it. Reverting the checklist's SOV-1 and
 *     SOV-5 values by hand still produced a green run.
 *
 * The first two shapes require the percentage to be either the entire
 * content of its own table cell or captured inside `(Weight: ...)`. The
 * prose shape instead requires a literal match on the objective's OWN name
 * from `OBJECTIVES` below. All three therefore ignore prose that merely
 * mentions "SOV-1 to SOV-8" alongside an unrelated "100%" (e.g. "weights
 * summing to 100%", which appears in that same checklist line) — a loose
 * `SOV-<n>...<NN>%` scan reads that as SOV-8 being 100%.
 *
 * Anchoring the prose shape on the name buys a second assertion for free:
 * a code paired with the WRONG objective name is caught too. That is the
 * same defect class as the weights themselves — the shipped weights were a
 * permutation, and `SEAL-3` was shipped under a name ("Digital Resilience")
 * that appears nowhere in the framework.
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

// The eight EUCSF objectives — weight AND name — per the primary sources
// cited above. The name is ground truth in its own right: it is what the
// prose shape matches on, and a code paired with another objective's name is
// the same permutation defect as a code paired with another's weight.
const OBJECTIVES = {
  'SOV-1': { weight: 20, name: 'Strategic Sovereignty' },
  'SOV-2': { weight: 10, name: 'Legal & Jurisdictional Sovereignty' },
  'SOV-3': { weight: 10, name: 'Data & AI Sovereignty' },
  'SOV-4': { weight: 15, name: 'Operational Sovereignty' },
  'SOV-5': { weight: 10, name: 'Supply Chain Sovereignty' },
  'SOV-6': { weight: 15, name: 'Technology Sovereignty' },
  'SOV-7': { weight: 15, name: 'Security & Compliance Sovereignty' },
  'SOV-8': { weight: 5, name: 'Environmental Sustainability' },
};
const EXPECTED_KEYS = Object.keys(OBJECTIVES);
const CORRECT_WEIGHTS = Object.fromEntries(
  Object.entries(OBJECTIVES).map(([k, v]) => [k, v.weight]),
);

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

// `references/quality-checklist.md` is a shared asset copied into EVERY
// plugin, so its EUCSF weight list exists 31 times over, all but two of them
// outside the roots above. Collected by basename rather than by listing the
// copies, so a new plugin is covered the day it is added — the enumeration
// drift this guard exists to catch should not be reintroduced in the guard.
const CHECKLIST_ROOTS = ['plugins', '.arckit'];
const CHECKLIST_BASENAME = 'quality-checklist.md';

function collectByBasename(root, basename) {
  const abs = resolve(repoRoot, root);
  if (!existsSync(abs) || !statSync(abs).isDirectory()) return [];
  const out = [];
  const stack = [abs];
  while (stack.length > 0) {
    const dir = stack.pop();
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) stack.push(p);
      else if (entry.isFile() && entry.name === basename) out.push(p);
    }
  }
  return out;
}

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

// Matches the checklist's prose pairs, e.g. `SOV-1 Strategic Sovereignty
// 20%`. Built from OBJECTIVES so the alternation cannot drift from the
// ground truth, and deliberately anchored on the NAME: a bare
// `SOV-(\d)[^,]*?(\d{1,3})%` scan matches "SOV-1 to SOV-8 ... 100%" in the
// same checklist line and reports SOV-8 as 100%.
const NAME_ALTERNATION = Object.values(OBJECTIVES)
  .map((o) => o.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');
const PROSE_RE = new RegExp(`SOV-(\\d)\\s+(${NAME_ALTERNATION})\\s+(\\d{1,3})%`, 'g');

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
let checklistsFound = 0;
for (const root of CHECKLIST_ROOTS) {
  for (const f of collectByBasename(root, CHECKLIST_BASENAME)) {
    files.add(f);
    checklistsFound += 1;
  }
}

for (const file of [...files].sort()) {
  const rel = relative(repoRoot, file);
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const occurrences = [];

  lines.forEach((line, idx) => {
    // Prose pairs are scanned first and are cumulative: one line carries all
    // eight, so this cannot `return` after the first hit the way the two
    // single-occurrence-per-line table shapes do.
    PROSE_RE.lastIndex = 0;
    let proseMatch;
    let sawProse = false;
    while ((proseMatch = PROSE_RE.exec(line)) !== null) {
      sawProse = true;
      occurrences.push({
        lineNo: idx + 1,
        sov: `SOV-${proseMatch[1]}`,
        weight: Number(proseMatch[3]),
        name: proseMatch[2],
      });
    }
    if (sawProse) return;

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
    // Only the prose shape carries a name to check. A wrong pairing here is
    // the permutation defect wearing its other face.
    if (occ.name !== undefined && occ.name !== OBJECTIVES[occ.sov].name) {
      ok = false;
      console.error(
        `[FAIL] ${rel}:${occ.lineNo}: ${occ.sov} is named "${occ.name}", the framework says ` +
          `"${OBJECTIVES[occ.sov].name}"`,
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

// The same self-defence for the checklist half. If the shared asset is ever
// moved or renamed, the prose list must fail loudly rather than fall out of
// coverage the silent way it was in until now.
if (checklistsFound === 0) {
  ok = false;
  console.error(
    `[FAIL] no ${CHECKLIST_BASENAME} found under ${CHECKLIST_ROOTS.join(', ')} — the guard\'s ` +
      'checklist roots are broken',
  );
}

if (ok) {
  console.log(
    `[PASS] ${occurrencesChecked} SOV weight occurrence(s) across ${filesChecked} file(s) ` +
      `(including ${checklistsFound} ${CHECKLIST_BASENAME} copies) all match the framework ` +
      '(SOV-1 20%, SOV-2 10%, SOV-3 10%, SOV-4 15%, SOV-5 10%, SOV-6 15%, SOV-7 15%, SOV-8 5%), ' +
      'and every prose pair names its own objective.',
  );
  process.exit(0);
}
process.exit(1);
