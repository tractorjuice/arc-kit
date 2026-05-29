#!/usr/bin/env node
/**
 * Regime-registration test for ArcKit doc-type regimes.
 *
 * Every `regime:` value declared on an entry in
 * `arckit-claude/config/doc-types.mjs` MUST also be registered in the exported
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const docTypesPath = resolve(repoRoot, 'arckit-claude/config/doc-types.mjs');

const { DOC_TYPES, REGIMES, REGIME_LABELS } = await import(docTypesPath);

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

if (ok) {
  console.log(
    `[PASS] ${declaredRegimes.size} declared regime(s) all registered in REGIMES (${REGIMES.length}) and labelled.`,
  );
  process.exit(0);
}
process.exit(1);
