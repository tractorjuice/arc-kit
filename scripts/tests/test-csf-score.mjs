#!/usr/bin/env node
/**
 * Structural invariants for the EU Cloud Sovereignty Framework scorer.
 *
 * arc-kit#782: `/arckit:eu-cloud-sovereignty` stated the formula
 * `Sovereignty Score = Σ (Score(SOVn) / Max.Score(SOVn)) × Weight(SOVn)` but
 * never defined `Score(SOVn)` or `Max.Score(SOVn)` — the model had to invent
 * a scale, and two runs over identical evidence could disagree. This guards
 * the fix: `plugins/arckit-eu/data/csf-criteria-calculator-2026-06-01.json`
 * (the transcribed official Annex calculator) and
 * `plugins/arckit-claude/scripts/csf-score.mjs` (the scorer that implements
 * the calculator's own definitions), so nothing quietly re-introduces the
 * undefined-scale bug or clamps away the framework's own rounding overshoot.
 *
 * Exit 0 = every invariant holds. Exit 1 = mismatch.
 */

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const scorerPath = resolve(repoRoot, 'plugins/arckit-claude/scripts/csf-score.mjs');
const cataloguePath = resolve(
  repoRoot,
  'plugins/arckit-eu/data/csf-criteria-calculator-2026-06-01.json'
);

const { loadCatalogue, scoreObjective, scoreAssessment, NOMINAL_MAX_SCORE } =
  await import(scorerPath);

let ok = true;
function pass(msg) {
  console.log(`[PASS] ${msg}`);
}
function failCheck(msg) {
  ok = false;
  console.error(`[FAIL] ${msg}`);
}
function approxEqual(a, b, epsilon = 1e-6) {
  return Math.abs(a - b) < epsilon;
}

const catalogue = loadCatalogue(cataloguePath);

// --- Ground truth, derived independently in the approved plan from the ----
// --- official calculator workbook (E4=SUM(E5:E44) etc.), not read back    ---
// --- from this catalogue file — a self-referential check would prove      ---
// --- nothing about whether the transcription is correct.                  ---
const EXPECTED_CRITERION_COUNTS = {
  'SOV-1': 8,
  'SOV-2': 6,
  'SOV-3': 5,
  'SOV-4': 6,
  'SOV-5': 7,
  'SOV-6': 5,
  'SOV-7': 7,
  'SOV-8': 4,
};

const EXPECTED_ACTUAL_MAXIMA = {
  'SOV-1': 1000.03,
  'SOV-2': 1002.0,
  'SOV-3': 1000.0,
  'SOV-4': 1002.0,
  'SOV-5': 1001.0,
  'SOV-6': 1000.0,
  'SOV-7': 1001.0,
  'SOV-8': 1000.0,
};

const EXPECTED_WEIGHTS = {
  'SOV-1': 0.2,
  'SOV-2': 0.1,
  'SOV-3': 0.1,
  'SOV-4': 0.15,
  'SOV-5': 0.1,
  'SOV-6': 0.15,
  'SOV-7': 0.15,
  'SOV-8': 0.05,
};

// --- 1. catalogue shape: 8 objectives, each with the code we expect -------
if (catalogue.objectives.length !== 8) {
  failCheck(`catalogue has ${catalogue.objectives.length} objectives, expected 8`);
} else {
  pass('catalogue has exactly 8 objectives');
}

const byCode = new Map(catalogue.objectives.map((o) => [o.code, o]));
const missingCodes = Object.keys(EXPECTED_WEIGHTS).filter((c) => !byCode.has(c));
if (missingCodes.length > 0) {
  failCheck(`catalogue is missing objective(s): ${missingCodes.join(', ')}`);
} else {
  pass('catalogue has SOV-1 through SOV-8');
}

// --- 2. weights sum to exactly 1.0, and match the calculator per-objective -
let weightSum = 0;
for (const o of catalogue.objectives) weightSum += o.weight;
if (!approxEqual(weightSum, 1.0)) {
  failCheck(`objective weights sum to ${weightSum}, expected 1.0`);
} else {
  pass('objective weights sum to exactly 1.0');
}

let weightMismatch = false;
for (const [code, expected] of Object.entries(EXPECTED_WEIGHTS)) {
  const o = byCode.get(code);
  if (!o) continue;
  if (!approxEqual(o.weight, expected)) {
    weightMismatch = true;
    failCheck(`${code} weight is ${o.weight}, expected ${expected}`);
  }
}
if (!weightMismatch) {
  pass('per-objective weights match the calculator (20/10/10/15/10/15/15/5)');
}

// --- 3. criterion counts per objective (8/6/5/6/7/5/7/4 = 48 total) -------
let countMismatch = false;
let totalCriteria = 0;
for (const [code, expectedCount] of Object.entries(EXPECTED_CRITERION_COUNTS)) {
  const o = byCode.get(code);
  if (!o) continue;
  totalCriteria += o.criteria.length;
  if (o.criteria.length !== expectedCount) {
    countMismatch = true;
    failCheck(`${code} has ${o.criteria.length} criteria, expected ${expectedCount}`);
  }
}
if (!countMismatch) {
  pass('criterion counts match the calculator (8/6/5/6/7/5/7/4)');
}
if (totalCriteria !== 48) {
  failCheck(`total criteria across all objectives is ${totalCriteria}, expected 48`);
} else {
  pass('total criteria across all objectives is 48 (the calculator, not the 43-question guidance narrative)');
}

// --- 4. per-objective maxima match exactly (2dp-rounded answer values) ----
// Independently recomputed from the raw answers — NOT read from any cached
// "actualPerObjectiveMaxima" field in the catalogue — so this proves the
// transcribed answer values are correct, not merely that a summary field is
// internally consistent with itself.
let maxMismatch = false;
for (const [code, expectedMax] of Object.entries(EXPECTED_ACTUAL_MAXIMA)) {
  const o = byCode.get(code);
  if (!o) continue;
  let computedMax = 0;
  for (const criterion of o.criteria) {
    computedMax += Math.max(...criterion.answers.map((a) => a.value));
  }
  if (!approxEqual(computedMax, expectedMax, 1e-9)) {
    maxMismatch = true;
    failCheck(`${code} computed maximum is ${computedMax}, expected ${expectedMax}`);
  }
}
if (!maxMismatch) {
  pass('per-objective actual maxima match exactly (1000.03/1002/1000/1002/1001/1000/1001/1000)');
}

// --- 5. Max.Score(SOVn) used by the scorer is the SHARED NOMINAL 1000, ----
// -----  not each objective's own (higher) actual maximum -------------------
if (NOMINAL_MAX_SCORE !== 1000) {
  failCheck(`NOMINAL_MAX_SCORE is ${NOMINAL_MAX_SCORE}, expected 1000`);
} else {
  pass('NOMINAL_MAX_SCORE (Max.Score(SOVn) for every objective) is 1000');
}

// --- 6. every answer carries a SEAL in 0..4 --------------------------------
let sealOutOfRange = 0;
let answerTotal = 0;
for (const o of catalogue.objectives) {
  for (const criterion of o.criteria) {
    for (const answer of criterion.answers) {
      answerTotal += 1;
      if (
        typeof answer.seal !== 'number' ||
        !Number.isInteger(answer.seal) ||
        answer.seal < 0 ||
        answer.seal > 4
      ) {
        sealOutOfRange += 1;
      }
    }
  }
}
if (sealOutOfRange > 0) {
  failCheck(`${sealOutOfRange} of ${answerTotal} answers carry a SEAL outside 0..4`);
} else {
  pass(`all ${answerTotal} answers carry a SEAL in 0..4`);
}

// --- 7. SEAL is not derivable from Score: a maximal response's SEAL is not -
// -----  simply "4 because the score is high" by construction — assert the -
// -----  scorer computes it independently as MIN(seal), never as a function -
// -----  of the weighted score. Covered functionally by check 9 below      -
// -----  (the minimum-not-average check), which is the operative guard.    -

// --- 8. a maximal response scores 100.0756% (the framework's own overshoot,
// -----  not clamped to 100%) ------------------------------------------------
function maximalSelections(objective) {
  const selections = {};
  for (const criterion of objective.criteria) {
    let bestIdx = 0;
    let bestValue = -Infinity;
    criterion.answers.forEach((answer, idx) => {
      if (answer.value > bestValue) {
        bestValue = answer.value;
        bestIdx = idx;
      }
    });
    selections[String(criterion.n)] = bestIdx;
  }
  return selections;
}

const maximalAnswers = {};
for (const o of catalogue.objectives) maximalAnswers[o.code] = maximalSelections(o);

const maximalResult = scoreAssessment(catalogue, maximalAnswers);
const EXPECTED_OVERSHOOT_PERCENT = 100.0756;
if (!approxEqual(maximalResult.sovereigntyScorePercent, EXPECTED_OVERSHOOT_PERCENT, 1e-3)) {
  failCheck(
    `maximal response scores ${maximalResult.sovereigntyScorePercent}%, expected ` +
      `${EXPECTED_OVERSHOOT_PERCENT}% (the framework's own 2dp-rounding overshoot — ` +
      `do not clamp this to 100%)`
  );
} else {
  pass(`a maximal response scores ${maximalResult.sovereigntyScorePercent.toFixed(4)}% (not clamped to 100%)`);
}

if (maximalResult.sovereigntyScorePercent <= 100) {
  failCheck('maximal response did not exceed 100% — the overshoot invariant regressed');
} else {
  pass('maximal response exceeds 100%, confirming Max.Score(SOVn)=1000 is nominal, not each objective\'s own higher actual maximum');
}

// --- 9. overall SEAL is a MINIMUM across answered criteria, not an average -
// A maximal-everywhere response has every seal at 4, so its overall SEAL is
// trivially 4 either way. Prove "minimum, not average" by taking the maximal
// response and dropping ONE objective's SEAL to 0 while its Score stays
// high — an average would barely move (48 criteria, one dragged to 0), but
// the minimum must collapse to SEAL-0.
if (maximalResult.overallSeal !== 'SEAL-4') {
  failCheck(`maximal response overall SEAL is ${maximalResult.overallSeal}, expected SEAL-4`);
} else {
  pass('maximal response overall SEAL is SEAL-4');
}

const sov3 = byCode.get('SOV-3');
const zeroSealCriterion = sov3?.criteria.find((c) =>
  c.answers.some((a) => a.seal === 0)
);
if (!zeroSealCriterion) {
  failCheck('could not find a SOV-3 criterion with a SEAL-0 answer to build the minimum-not-average fixture');
} else {
  const zeroSealAnswerIdx = zeroSealCriterion.answers.findIndex((a) => a.seal === 0);
  const outlierAnswers = JSON.parse(JSON.stringify(maximalAnswers));
  outlierAnswers['SOV-3'][String(zeroSealCriterion.n)] = zeroSealAnswerIdx;
  const outlierResult = scoreAssessment(catalogue, outlierAnswers);

  if (outlierResult.overallSeal !== 'SEAL-0') {
    failCheck(
      `dropping one criterion's SEAL to 0 (out of 48, 47 still at SEAL-4) produced overall ` +
        `SEAL ${outlierResult.overallSeal}, expected SEAL-0 — overall SEAL must be a MINIMUM, not an average`
    );
  } else {
    pass('overall SEAL is a minimum: one SEAL-0 answer among 47 SEAL-4 answers still yields SEAL-0, not a near-4 average');
  }

  // The Score barely moved (one criterion's contribution dropped), while the
  // SEAL collapsed completely — demonstrating the two are independent axes,
  // not one derived from the other.
  if (outlierResult.sovereigntyScorePercent <= 50) {
    failCheck(
      `Score collapsed alongside SEAL (${outlierResult.sovereigntyScorePercent}%) — Score and SEAL ` +
        `must be independent readings of the same answers, not coupled`
    );
  } else {
    pass(
      `Score stayed high (${outlierResult.sovereigntyScorePercent.toFixed(2)}%) while SEAL collapsed to ` +
        `SEAL-0 — confirms Score and SEAL are independent (SEAL is not an input to the Score)`
    );
  }
}

// --- 10. SOV-1 partial worked example, reproduced from the calculator's own
// -----   (fictitious, illustrative) column-E example. Rows 5-44 of the     -
// -----   official workbook have exactly seven of SOV-1's eight criteria    -
// -----   answered — criterion 6 ("Participation in EU strategic            -
// -----   programs") is left blank in the source. THIS FIXTURE IS           -
// -----   FICTITIOUS, per the guidance's own description of column E, and   -
// -----   is used only to check the scorer's arithmetic reproduces the same -
// -----   answer-selection pattern the calculator ships — not as a claim    -
// -----   about any real provider. -------------------------------------------
const SOV1_PARTIAL_FICTITIOUS_SELECTIONS = {
  1: 3, // "4. Entirely within the EU" -> 125.01
  2: 2, // "3. Somewhat likely takeover..." -> 62.5
  3: 1, // "2. Through \"voice of the customer\"..." -> 41.67
  4: 3, // "4. Majority of funding is EU-based" -> 93.75
  5: 2, // "3. Balanced EU/non-EU" -> 62.5
  // criterion 6 intentionally left unanswered, matching the source workbook
  7: 2, // "Already measured achievement and existing dedicated governance" -> 83
  8: 2, // "3. Can continue temporarily based on contractual agreement with EC" -> 62.5
};
const EXPECTED_SOV1_PARTIAL_SCORE = 125.01 + 62.5 + 41.67 + 93.75 + 62.5 + 83 + 62.5; // 530.93

const sov1 = byCode.get('SOV-1');
const sov1Partial = scoreObjective(sov1, SOV1_PARTIAL_FICTITIOUS_SELECTIONS);

if (!approxEqual(sov1Partial.score, EXPECTED_SOV1_PARTIAL_SCORE, 1e-9)) {
  failCheck(
    `SOV-1 partial fictitious example scores ${sov1Partial.score}, expected ` +
      `${EXPECTED_SOV1_PARTIAL_SCORE} (sum of the calculator's own per-answer values for this selection)`
  );
} else {
  pass(
    `SOV-1 partial fictitious example (7 of 8 criteria answered, matching the calculator's own worked ` +
      `example) scores ${sov1Partial.score.toFixed(2)} — precise sum of the transcribed answer values`
  );
}

if (sov1Partial.answeredCount !== 7 || sov1Partial.totalCriteria !== 8) {
  failCheck(
    `SOV-1 partial fixture answered ${sov1Partial.answeredCount}/${sov1Partial.totalCriteria}, expected 7/8`
  );
} else {
  pass('SOV-1 partial fixture correctly reports 7 of 8 criteria answered (a partial objective is valid)');
}

// Documented, not asserted equal: the calculator's OWN hand-typed example
// total for this same selection is 533 (125+63+42+94+63+83+63), because the
// workbook's example column holds independently-rounded illustrative
// integers rather than a formula over the precise per-answer values. The
// guidance explicitly disclaims column E as "fictitious values that do not
// refer to any specific example for the sole purpose of exemplification", so
// this script computes from the precise scale (the authoritative
// Score(SOVn) definition) rather than reproducing the workbook's own
// rounding artefact.
const WORKBOOK_OWN_ROUNDED_EXAMPLE_TOTAL = 533;
console.log(
  `[INFO] calculator's own hand-typed example total for this selection is ` +
    `${WORKBOOK_OWN_ROUNDED_EXAMPLE_TOTAL} (independently rounded per-answer integers in column E); ` +
    `this scorer computes ${sov1Partial.score.toFixed(2)} from the precise per-answer values — the ` +
    `${(WORKBOOK_OWN_ROUNDED_EXAMPLE_TOTAL - sov1Partial.score).toFixed(2)}-point gap is the workbook's own ` +
    `example-column rounding, not a scorer discrepancy`
);

if (ok) {
  console.log(`\n[PASS] all csf-score invariants hold (${answerTotal} answers across 48 criteria checked).`);
  process.exit(0);
}
console.error('\n[FAIL] one or more csf-score invariants failed — see above.');
process.exit(1);
