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

for (const file of mappedFiles.filter((f) => !missingFiles.includes(f))) {
  const rows = classificationRows(file);
  if (rows.length !== 1) {
    ok = false;
    console.error(`[FAIL] ${file}: expected exactly 1 Classification row, found ${rows.length}`);
  } else if (rows[0].length === 0) {
    ok = false;
    console.error(`[FAIL] ${file}: Classification row is empty`);
  }
}

if (!missingFiles.includes(UK_PARTIAL)) {
  const ukLadder = classificationRows(UK_PARTIAL)[0];
  for (const [regime, file] of Object.entries(REGIME_PARTIALS)) {
    if (file === UK_PARTIAL || missingFiles.includes(file)) continue;
    if (classificationRows(file)[0] === ukLadder) {
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

  function tableRows(heading) {
    const section = rendering.split(`## ${heading}`)[1];
    if (section === undefined) return null;
    return section
      .split(/\n## /)[0]
      .split('\n')
      .filter((line) => line.startsWith('|') && !/^\|[\s-]+\|/.test(line))
      .map((line) => line.slice(1, -1).split('|').map((cell) => cell.trim()))
      .filter((cells) => cells[0] !== 'Regime');
  }

  const routingRows = tableRows('Regime routing');
  if (!routingRows) {
    ok = false;
    console.error('[FAIL] RENDERING.md has no "## Regime routing" section');
  } else {
    const documented = new Map(routingRows.map((c) => [c[0], { partial: c[1], routing: c[3] }]));
    for (const regime of REGIMES) {
      const row = documented.get(regime);
      if (!row) {
        ok = false;
        console.error(`[FAIL] RENDERING.md "Regime routing" table has no row for regime ${regime}`);
        continue;
      }
      if (row.partial !== `\`${REGIME_PARTIALS[regime]}\``) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md routes ${regime} to ${row.partial}, REGIME_PARTIALS says \`${REGIME_PARTIALS[regime]}\``,
        );
      }
      const documentedFallsThrough = row.routing.startsWith('falls through');
      if (documentedFallsThrough !== UK_FALLBACK_BY_DESIGN.has(regime)) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md says ${regime} "${row.routing}", but UK_FALLBACK_BY_DESIGN ${UK_FALLBACK_BY_DESIGN.has(regime) ? 'contains' : 'does not contain'} it`,
        );
      }
    }
    for (const regime of documented.keys()) {
      if (!registered.has(regime)) {
        ok = false;
        console.error(
          `[FAIL] RENDERING.md "Regime routing" table lists ${regime}, which is not in REGIMES`,
        );
      }
    }
  }

  const indexRows = tableRows('Regime index');
  if (!indexRows) {
    ok = false;
    console.error('[FAIL] RENDERING.md has no "## Regime index" section');
  } else {
    const codesByRegime = {};
    for (const [code, info] of Object.entries(DOC_TYPES)) {
      if (!info.regime) continue;
      (codesByRegime[info.regime] ||= []).push(code);
    }
    const documentedCodes = new Map(
      indexRows.map((c) => [c[0], c[3].split(',').map((s) => s.trim().replace(/`/g, '')).filter(Boolean)]),
    );
    for (const regime of REGIMES) {
      const listed = documentedCodes.get(regime);
      if (!listed) {
        ok = false;
        console.error(`[FAIL] RENDERING.md "Regime index" table has no row for regime ${regime}`);
        continue;
      }
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
  }
}

if (ok) {
  console.log(
    `[PASS] ${declaredRegimes.size} declared regime(s) all registered in REGIMES (${REGIMES.length}) and labelled.`,
  );
  process.exit(0);
}
process.exit(1);
