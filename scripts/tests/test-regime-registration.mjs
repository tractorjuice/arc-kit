#!/usr/bin/env node
/**
 * Regime-registration test for ArcKit doc-type regimes.
 *
 * Every `regime:` value declared on an entry in
 * `plugins/arckit-claude/config/doc-types.mjs` MUST also be registered in the exported
 * `REGIMES` array AND have a label in `REGIME_LABELS`. Consumers that iterate
 * `REGIMES` (e.g. `hooks/graph-inject.mjs`: compliance-presence listing and
 * readiness scorecard) silently skip any jurisdiction whose regime code is
 * declared on doc-types but absent from `REGIMES` — the artefacts validate on
 * disk but never surface in the injected governance context.
 *
 * This invariant is invisible to the dual-registration test (which checks
 * code ↔ pages.md), and the gap has recurred twice: `CA` (12 doc-types shipped
 * before `'CA'` was added to `REGIMES`, fixed in #441) and `US` (10 doc-types,
 * fixed in #545). This guard exists so it cannot recur silently again.
 *
 * Exit 0 = every declared regime is registered + labelled. Exit 1 = mismatch.
 */

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const docTypesPath = resolve(repoRoot, 'plugins/arckit-claude/config/doc-types.mjs');

const { DOC_TYPES, REGIMES, REGIME_LABELS, REGIME_PARTIALS, UK_FALLBACK_BY_DESIGN } =
  await import(docTypesPath);

const declaredRegimes = new Set(
  Object.values(DOC_TYPES)
    .map((info) => info.regime)
    .filter(Boolean),
);
const registered = new Set(REGIMES);
const labelled = new Set(Object.keys(REGIME_LABELS));

const declaredNotRegistered = [...declaredRegimes].filter((r) => !registered.has(r)).sort();
const registeredNotLabelled = [...registered].filter((r) => !labelled.has(r)).sort();
const labelledNotRegistered = [...labelled].filter((r) => !registered.has(r)).sort();

let ok = true;
if (declaredNotRegistered.length > 0) {
  ok = false;
  console.error('[FAIL] regime codes declared on doc-types but missing from REGIMES:');
  for (const r of declaredNotRegistered) console.error('  -', r);
}
if (registeredNotLabelled.length > 0) {
  ok = false;
  console.error('[FAIL] regimes in REGIMES but missing a REGIME_LABELS entry:');
  for (const r of registeredNotLabelled) console.error('  -', r);
}
if (labelledNotRegistered.length > 0) {
  ok = false;
  console.error('[FAIL] regimes in REGIME_LABELS but missing from REGIMES:');
  for (const r of labelledNotRegistered) console.error('  -', r);
}

// --- Document Control partial routing ------------------------------------
// Every regime must name a partial that exists, and any regime not using the
// UK partial must actually differ from it — a copy-paste that forgets to swap
// the Classification row is otherwise invisible.
const partialsDir = resolve(repoRoot, 'plugins/arckit-claude/templates/_partials');
const UK_PARTIAL = 'document-control-uk.md';
const CLASSIFICATION_RE = /^\| \*\*Classification\*\* \| (.+?) \|$/gm;

function classificationRows(file) {
  const text = readFileSync(resolve(partialsDir, file), 'utf8');
  return [...text.matchAll(CLASSIFICATION_RE)].map((m) => m[1].trim());
}

const unmappedRegimes = [...registered].filter((r) => !REGIME_PARTIALS[r]).sort();
if (unmappedRegimes.length > 0) {
  ok = false;
  console.error('[FAIL] regimes in REGIMES but missing a REGIME_PARTIALS entry:');
  for (const r of unmappedRegimes) console.error('  -', r);
}

const partialledNotRegistered = Object.keys(REGIME_PARTIALS).filter((r) => !registered.has(r)).sort();
if (partialledNotRegistered.length > 0) {
  ok = false;
  console.error('[FAIL] regimes in REGIME_PARTIALS but missing from REGIMES:');
  for (const r of partialledNotRegistered) console.error('  -', r);
}

const mappedFiles = [...new Set(Object.values(REGIME_PARTIALS))].sort();
const missingFiles = mappedFiles.filter((f) => !existsSync(resolve(partialsDir, f)));
if (missingFiles.length > 0) {
  ok = false;
  console.error('[FAIL] REGIME_PARTIALS names partials that do not exist in _partials/:');
  for (const f of missingFiles) console.error('  -', f);
}

// Parsed once per file and kept, because the RENDERING.md ladder assertion
// below needs the same rows: re-reading there put seven parses of
// document-control-uk.md in a single run. A file that is missing, or whose
// Classification row is unusable, is simply absent from the map — every later
// check reads through `has()`/`get()` and skips it, so the failure above is
// reported once instead of aborting the run with an ENOENT stack trace.
const laddersByFile = new Map();
for (const file of mappedFiles.filter((f) => !missingFiles.includes(f))) {
  const rows = classificationRows(file);
  if (rows.length !== 1) {
    ok = false;
    console.error(`[FAIL] ${file}: expected exactly 1 Classification row, found ${rows.length}`);
    continue;
  }
  if (rows[0].length === 0) {
    ok = false;
    console.error(`[FAIL] ${file}: Classification row is empty`);
    continue;
  }
  laddersByFile.set(file, rows[0]);
}

if (laddersByFile.has(UK_PARTIAL)) {
  const ukLadder = laddersByFile.get(UK_PARTIAL);
  for (const [regime, file] of Object.entries(REGIME_PARTIALS)) {
    if (file === UK_PARTIAL || !laddersByFile.has(file)) continue;
    if (laddersByFile.get(file) === ukLadder) {
      ok = false;
      console.error(
        `[FAIL] regime ${regime} maps to ${file} but its Classification row is identical to ${UK_PARTIAL} — the ladder was not swapped`,
      );
    }
  }
}

// Which partial, not just "a different one". The check above only proved a
// non-UK partial carries a non-UK ladder, so swapping two regimes' partials
// passed it: pointing CA at document-control-au.md gave Canadian artefacts the
// Australian ladder and exited 0. A regime outside UK_FALLBACK_BY_DESIGN must
// name the partial derived from its own code; a regime inside it must name the
// UK partial, which makes the US/FR deferral a registered decision rather than
// an unguarded hole.
const fallbackNotRegistered = [...UK_FALLBACK_BY_DESIGN].filter((r) => !registered.has(r)).sort();
if (fallbackNotRegistered.length > 0) {
  ok = false;
  console.error('[FAIL] regimes in UK_FALLBACK_BY_DESIGN but missing from REGIMES:');
  for (const r of fallbackNotRegistered) console.error('  -', r);
}

for (const [regime, file] of Object.entries(REGIME_PARTIALS)) {
  if (UK_FALLBACK_BY_DESIGN.has(regime)) {
    if (file !== UK_PARTIAL) {
      ok = false;
      console.error(
        `[FAIL] regime ${regime} is in UK_FALLBACK_BY_DESIGN but maps to ${file}, not ${UK_PARTIAL} — drop it from the set or point it at the UK partial`,
      );
    }
    continue;
  }
  const expected = `document-control-${regime.toLowerCase()}.md`;
  if (file !== expected) {
    ok = false;
    console.error(
      `[FAIL] regime ${regime} maps to ${file}, expected ${expected} — a regime routes to its own ladder unless it is registered in UK_FALLBACK_BY_DESIGN`,
    );
  }
}

// --- RENDERING.md is the runtime authority and must match the registry ------
// Community overlay plugins ship templates/_partials but no config/ directory,
// so the model resolving <!-- DOC-CONTROL-HEADER --> reads RENDERING.md, never
// this registry. Its two tables therefore have to stay in step with the data
// here, or overlays render from a stale rule with nothing to catch it.
const renderingPath = resolve(partialsDir, 'RENDERING.md');
if (!existsSync(renderingPath)) {
  ok = false;
  console.error(`[FAIL] ${renderingPath} is missing — the runtime routing rule has no home`);
} else {
  const rendering = readFileSync(renderingPath, 'utf8');

  // A separator row may carry GFM alignment colons (`|:---|---:|`), which the
  // old `[\s-]+` test did not match — the separator then became a data row and
  // the run failed claiming the table listed a regime called `:---`.
  const SEPARATOR_RE = /^\|(?:\s*:?-{3,}:?\s*\|)+$/;

  function table(heading) {
    const section = rendering.split(`## ${heading}`)[1];
    if (section === undefined) return { missing: 'section' };
    const lines = section
      .split(/\n## /)[0]
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('|') && !SEPARATOR_RE.test(line))
      .map((line) => line.slice(1, -1).split('|').map((cell) => cell.trim()));
    if (lines.length === 0) return { missing: 'table' };
    const [header, ...rest] = lines;
    return {
      header,
      // A repeated header means a second table under the same heading; it is
      // not data. The filter this replaced dropped it by testing cells[0].
      rows: rest.filter((cells) => cells.join('|') !== header.join('|')),
      col: (name) => {
        const i = header.indexOf(name);
        return i === -1 ? null : i;
      },
    };
  }

  // Cells are addressed by COLUMN NAME, never by position. Reading `c[3]`
  // means a column reorder in RENDERING.md silently changes what is asserted —
  // the table would still parse, and the guard would still pass, while checking
  // the wrong thing.
  //
  // Every structural failure is caught here rather than at the point of use, so
  // a caller only ever sees rows it can safely index: an absent section, an
  // empty one, a missing column, a row with the wrong cell count (a dropped
  // cell is the commonest hand-edit error in a four-column table, and used to
  // throw inside the ladder comparison), or a duplicated key (`new Map` keeps
  // the last, so the first copy would never be validated). Returns null on
  // failure — having reported every problem it found — or `{ rows, col, byKey }`.
  function readTable(heading, required, keyColumn) {
    const t = table(heading);
    if (t.missing === 'section') {
      ok = false;
      console.error(`[FAIL] RENDERING.md has no "## ${heading}" section`);
      return null;
    }
    if (t.missing === 'table') {
      ok = false;
      console.error(`[FAIL] RENDERING.md "## ${heading}" section contains no table`);
      return null;
    }
    const absent = required.filter((n) => t.col(n) === null);
    if (absent.length > 0) {
      ok = false;
      console.error(
        `[FAIL] RENDERING.md "${heading}" table is missing column(s) ${absent.join(', ')} — found: ${t.header.join(' | ')}`,
      );
      return null;
    }
    const ragged = t.rows.filter((cells) => cells.length !== t.header.length);
    for (const cells of ragged) {
      ok = false;
      console.error(
        `[FAIL] RENDERING.md "${heading}" row "${cells.join(' | ')}" has ${cells.length} cell(s), header has ${t.header.length}`,
      );
    }
    if (ragged.length > 0) return null;
    const key = t.col(keyColumn);
    const byKey = new Map();
    const duplicated = [];
    for (const cells of t.rows) {
      if (byKey.has(cells[key])) duplicated.push(cells[key]);
      byKey.set(cells[key], cells);
    }
    for (const k of duplicated) {
      ok = false;
      console.error(`[FAIL] RENDERING.md "${heading}" table has more than one row for ${k}`);
    }
    return duplicated.length > 0 ? null : { rows: t.rows, col: t.col, byKey };
  }

  // The documented ladder is prose and abbreviates one contiguous run of rungs:
  // CA writes "Protected A–C" where document-control-ca.md spells out all
  // three. That abbreviation is registered here so the comparison can stay
  // EXACT. Comparing only the first and last rung, as this check first did,
  // lets a row keep its ends while describing an entirely different scheme in
  // between — AU rewritten to "UNOFFICIAL / OFFICIAL-SENSITIVE / TOP SECRET /
  // RESTRICTED / SECRET" passed. The middle rungs are the jurisdiction-
  // distinguishing part, so an unregistered divergence is drift, not shorthand.
  const LADDER_ABBREVIATIONS = {
    'Protected A–C': ['Protected A', 'Protected B', 'Protected C'],
  };

  function ladderRungs(text) {
    if (typeof text !== 'string') return null;
    const parts = text.replace(/^\[|\]$/g, '').split('/').map((s) => s.trim()).filter(Boolean);
    return parts.length === 0 ? null : parts.flatMap((p) => LADDER_ABBREVIATIONS[p] ?? [p]);
  }

  // Both tables carry a Routing column, so both are held to UK_FALLBACK_BY_DESIGN
  // — which also stops the two from contradicting each other.
  function checkRouting(heading, regime, text) {
    const documentedFallsThrough = text.startsWith('falls through');
    if (documentedFallsThrough !== UK_FALLBACK_BY_DESIGN.has(regime)) {
      ok = false;
      console.error(
        `[FAIL] RENDERING.md "${heading}" says ${regime} "${text}", but UK_FALLBACK_BY_DESIGN ${UK_FALLBACK_BY_DESIGN.has(regime) ? 'contains' : 'does not contain'} it`,
      );
    }
  }

  const routing = readTable(
    'Regime routing',
    ['Regime', 'Partial', 'Classification ladder', 'Routing'],
    'Regime',
  );
  if (routing) {
    const cPartial = routing.col('Partial');
    const cLadder = routing.col('Classification ladder');
    const cRouting = routing.col('Routing');
    for (const regime of REGIMES) {
      const row = routing.byKey.get(regime);
      if (!row) {
        ok = false;
        console.error(`[FAIL] RENDERING.md "Regime routing" table has no row for regime ${regime}`);
        continue;
      }
      if (row[cPartial] !== `\`${REGIME_PARTIALS[regime]}\``) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md routes ${regime} to ${row[cPartial]}, REGIME_PARTIALS says \`${REGIME_PARTIALS[regime]}\``,
        );
      }
      // The ladder column was previously never checked at all: a row could
      // name the right partial while describing a completely different scheme.
      const documentedLadder = ladderRungs(row[cLadder]);
      const partialLadder = ladderRungs(laddersByFile.get(REGIME_PARTIALS[regime]));
      if (!documentedLadder) {
        ok = false;
        console.error(`[FAIL] RENDERING.md "Regime routing" has an empty ladder for ${regime}`);
      } else if (partialLadder && documentedLadder.join(' / ') !== partialLadder.join(' / ')) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md documents ${regime}'s ladder as "${documentedLadder.join(' / ')}", but ${REGIME_PARTIALS[regime]} contains "${partialLadder.join(' / ')}"`,
        );
      }
      checkRouting('Regime routing', regime, row[cRouting]);
    }
    for (const regime of routing.byKey.keys()) {
      if (!registered.has(regime)) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md "Regime routing" table lists ${regime}, which is not in REGIMES`,
        );
      }
    }
  }

  // Label and Routing were present in this table but asserted nowhere, which is
  // the same "column exists, nothing verifies it" defect the ladder check was
  // added for. Overlays read only RENDERING.md, so a row reading
  // `| CA | Belgium | falls through to step 2 |` was a live wrong instruction
  // to the model that exited 0.
  const index = readTable(
    'Regime index',
    ['Regime', 'Label', 'Routing', 'Doc-type codes'],
    'Regime',
  );
  if (index) {
    const codesByRegime = {};
    for (const [code, info] of Object.entries(DOC_TYPES)) {
      if (!info.regime) continue;
      (codesByRegime[info.regime] ||= []).push(code);
    }
    const iLabel = index.col('Label');
    const iRouting = index.col('Routing');
    const iCodes = index.col('Doc-type codes');
    for (const regime of REGIMES) {
      const row = index.byKey.get(regime);
      if (!row) {
        ok = false;
        console.error(`[FAIL] RENDERING.md "Regime index" table has no row for regime ${regime}`);
        continue;
      }
      if (row[iLabel] !== REGIME_LABELS[regime]) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md labels ${regime} "${row[iLabel]}", REGIME_LABELS says "${REGIME_LABELS[regime]}"`,
        );
      }
      checkRouting('Regime index', regime, row[iRouting]);
      const listed = row[iCodes].split(',').map((s) => s.trim().replace(/`/g, '')).filter(Boolean);
      const actual = (codesByRegime[regime] || []).slice().sort();
      const missingCodes = actual.filter((c) => !listed.includes(c));
      const extraCodes = [...listed].sort().filter((c) => !actual.includes(c));
      if (missingCodes.length > 0) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md "Regime index" omits ${regime} doc-type(s): ${missingCodes.join(', ')}`,
        );
      }
      if (extraCodes.length > 0) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md "Regime index" lists ${regime} doc-type(s) that are not registered with that regime: ${extraCodes.join(', ')}`,
        );
      }
    }
    // Mirrors the routing table's reverse check. Without it an invented row
    // told the model that a jurisdiction-agnostic doc-type carried a regime
    // whose partial does not exist, and the run still exited 0.
    for (const regime of index.byKey.keys()) {
      if (!registered.has(regime)) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md "Regime index" table lists ${regime}, which is not in REGIMES`,
        );
      }
    }
  }
}

if (ok) {
  console.log(
    `[PASS] ${declaredRegimes.size} declared regime(s) all registered in REGIMES (${REGIMES.length}) and labelled.`,
  );
  process.exit(0);
}
process.exit(1);
