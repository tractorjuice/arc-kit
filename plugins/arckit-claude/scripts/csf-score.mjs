#!/usr/bin/env node
/**
 * Score an EU Cloud Sovereignty Framework assessment against the official
 * Annex calculator (`plugins/arckit-eu/data/csf-criteria-calculator-2026-06-01.json`).
 *
 * Fixes arc-kit#782: `/arckit:eu-cloud-sovereignty` stated the formula
 * `Sovereignty Score = Σ (Score(SOVn) / Max.Score(SOVn)) × Weight(SOVn)` but
 * never defined `Score(SOVn)` or `Max.Score(SOVn)`, so the model had to invent
 * a scale — and two runs over identical evidence could disagree. This script
 * implements the calculator's own definitions:
 *
 *   Score(SOVn)     = SUM of the selected answers' `value` fields for
 *                     objective n's criteria (calculator: E4=SUM(E5:E44), …).
 *   Max.Score(SOVn) = a NOMINAL 1000 for every objective, by construction.
 *                     The calculator's top-level formula (E1) divides by
 *                     this SHARED nominal 1000, not by each objective's own
 *                     computed maximum (which is 1000.03 / 1002.00 / 1000.00 /
 *                     1002.00 / 1001.00 / 1000.00 / 1001.00 / 1000.00 for
 *                     SOV-1..SOV-8 respectively, due to 2dp answer rounding
 *                     in the source workbook). A MAXIMAL response therefore
 *                     scores 100.0756%, not 100% — that is the framework's
 *                     own behaviour and this script reports it faithfully
 *                     rather than clamping to 100.
 *
 * SEAL is NOT an input to the Score and the Score does not determine SEAL —
 * per the Implementation guidance (p.9), both are independent readings of the
 * same 48 answers. Overall SEAL (calculator F2) is the MINIMUM seal level
 * across every answered criterion, not an average and not derived from the
 * weighted Score. See the `scoring` block in the catalogue JSON for the full
 * definitions and caveats (adaptability of answer values, the "Score
 * (examples)" weight-column caption, and the fictitious worked example).
 *
 * Usage:
 *   node csf-score.mjs --answers <file.json> [--json] [--catalogue <file.json>]
 *
 * Answers file shape — objective code -> criterion number -> zero-based index
 * into that criterion's `answers` array (an unanswered criterion is simply
 * omitted; an objective with no answered criteria is also valid):
 *
 *   {
 *     "SOV-1": { "1": 3, "2": 2, "3": 1, "4": 3, "5": 2, "7": 2, "8": 2 },
 *     "SOV-2": { ... }
 *   }
 *
 * Pure Node, zero npm dependencies — see generate-document-id.mjs for why
 * that matters (the marketplace never runs `npm install` for plugin scripts).
 *
 * Non-Claude command targets (Codex, Gemini, OpenCode, Copilot) do not ship
 * this script — `scripts/converter.py` deliberately excludes it from the
 * generated extensions, matching `generate-document-id.mjs`'s NOT being
 * copied there either for scoring purposes. Those targets still ship the
 * catalogue JSON itself (merged like `templates/`), so the command markdown
 * instructs the model to compute the same per-criterion arithmetic directly
 * from the catalogue when this script is unavailable — the artefact must
 * show that arithmetic either way, so the score is checkable without a
 * scorer at all.
 */

import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Every objective shares this divisor — see the module doc comment and the
// catalogue's `scoring.maxScoreDefinition`. Do NOT substitute an objective's
// own actual maximum here; that is precisely the bug this script fixes.
export const NOMINAL_MAX_SCORE = 1000;

// Candidate catalogue locations, tried in order. The first two cover the two
// checkout shapes this repo ships: the monorepo dev tree (arckit-eu is a
// sibling plugin) and the standalone `arckit-claude` marketplace repo, where
// `scripts/sync-claude-plugin-layout.py` mirrors arckit-eu under
// `plugins/eu/`. Unlike `generate-document-id.mjs`'s `../config/doc-types.mjs`
// import, this data lives in a DIFFERENT plugin, so the relative path is not
// the same in both layouts and both must be tried.
const CATALOGUE_CANDIDATES = [
  // Monorepo dev checkout: plugins/arckit-claude/scripts -> plugins/arckit-eu/data
  resolve(__dirname, '../../arckit-eu/data/csf-criteria-calculator-2026-06-01.json'),
  // Standalone arckit-claude repo (mirrored layout): scripts -> ../plugins/eu/data
  resolve(__dirname, '../plugins/eu/data/csf-criteria-calculator-2026-06-01.json'),
];

/**
 * Resolve the catalogue path, trying each candidate location in turn.
 * `explicitPath`, when given, is used as-is with no fallback.
 */
export function resolveCataloguePath(explicitPath) {
  if (explicitPath) return resolve(explicitPath);
  for (const candidate of CATALOGUE_CANDIDATES) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(
    `Could not find csf-criteria-calculator-2026-06-01.json. Tried:\n` +
      CATALOGUE_CANDIDATES.map((c) => `  ${c}`).join('\n')
  );
}

/** Load and parse the catalogue JSON from `path` (or the resolved default). */
export function loadCatalogue(path) {
  const cataloguePath = resolveCataloguePath(path);
  const raw = readFileSync(cataloguePath, 'utf8');
  return JSON.parse(raw);
}

/**
 * Score a single objective against a selection map.
 *
 * @param {object} objective - one entry of `catalogue.objectives` ({ code,
 *   weight, criteria: [{ n, answers: [{ value, seal }] }] }).
 * @param {Record<string, number>} selections - criterion `n` (as a string
 *   key) -> zero-based index into that criterion's `answers` array. A
 *   criterion absent from this map is treated as unanswered.
 * @returns {{
 *   code: string, score: number, answeredCount: number, totalCriteria: number,
 *   minSeal: number|null, rows: Array<object>
 * }}
 */
export function scoreObjective(objective, selections = {}) {
  let score = 0;
  let answeredCount = 0;
  let minSeal = null;
  const rows = [];

  for (const criterion of objective.criteria) {
    const key = String(criterion.n);
    const idx = Object.prototype.hasOwnProperty.call(selections, key)
      ? selections[key]
      : undefined;

    if (idx === undefined || idx === null) {
      rows.push({ n: criterion.n, answered: false });
      continue;
    }

    const answer = criterion.answers[idx];
    if (!answer) {
      throw new Error(
        `${objective.code} criterion ${criterion.n}: answer index ${idx} is out of range ` +
          `(0..${criterion.answers.length - 1})`
      );
    }

    score += answer.value;
    answeredCount += 1;
    if (minSeal === null || answer.seal < minSeal) minSeal = answer.seal;

    rows.push({
      n: criterion.n,
      answered: true,
      label: answer.label,
      value: answer.value,
      seal: answer.seal,
    });
  }

  return {
    code: objective.code,
    score,
    answeredCount,
    totalCriteria: objective.criteria.length,
    minSeal,
    rows,
  };
}

/**
 * Score a full assessment across all eight objectives.
 *
 * @param {object} catalogue - the parsed catalogue JSON (`{ objectives: [...] }`).
 * @param {Record<string, Record<string, number>>} answersByObjective -
 *   objective code -> selections (see `scoreObjective`). An objective absent
 *   from this map is treated as entirely unanswered.
 * @returns {{
 *   objectives: Array<object>, sovereigntyScorePercent: number,
 *   overallSeal: string|null, nominalMaxScore: number
 * }}
 */
export function scoreAssessment(catalogue, answersByObjective = {}) {
  const objectives = [];
  let weightedSum = 0;
  let overallMinSeal = null;

  for (const objective of catalogue.objectives) {
    const result = scoreObjective(objective, answersByObjective[objective.code] || {});
    weightedSum += objective.weight * result.score;

    if (result.minSeal !== null && (overallMinSeal === null || result.minSeal < overallMinSeal)) {
      overallMinSeal = result.minSeal;
    }

    objectives.push({
      ...result,
      weight: objective.weight,
      // Every objective divides by the SAME nominal 1000 — see NOMINAL_MAX_SCORE.
      maxScore: NOMINAL_MAX_SCORE,
      weightedContributionPercent: (objective.weight * result.score * 100) / NOMINAL_MAX_SCORE,
    });
  }

  return {
    objectives,
    sovereigntyScorePercent: (weightedSum * 100) / NOMINAL_MAX_SCORE,
    overallSeal: overallMinSeal === null ? null : `SEAL-${overallMinSeal}`,
    nominalMaxScore: NOMINAL_MAX_SCORE,
  };
}

// --- CLI ---------------------------------------------------------------

function isMainModule() {
  return import.meta.url === `file://${process.argv[1]}`;
}

function fail(...lines) {
  for (const line of lines) console.error(line);
  process.exit(1);
}

function formatTable(result) {
  const lines = [];
  lines.push('Objective  Weight   Score    Max Score  Weighted Contribution');
  for (const o of result.objectives) {
    lines.push(
      `${o.code.padEnd(10)} ${(o.weight * 100).toFixed(0).padStart(3)}%    ` +
        `${o.score.toFixed(2).padStart(8)}  ${o.maxScore.toFixed(0).padStart(9)}  ` +
        `${o.weightedContributionPercent.toFixed(4).padStart(8)}%`
    );
  }
  lines.push('');
  lines.push(`Sovereignty Score: ${result.sovereigntyScorePercent.toFixed(4)}%`);
  lines.push(`Overall SEAL:      ${result.overallSeal ?? '(no criteria answered)'}`);
  return lines.join('\n');
}

if (isMainModule()) {
  const argv = process.argv.slice(2);
  let answersPath = null;
  let cataloguePath = null;
  let asJson = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--answers') {
      answersPath = argv[++i];
    } else if (arg === '--catalogue') {
      cataloguePath = argv[++i];
    } else if (arg === '--json') {
      asJson = true;
    } else {
      fail(`Unknown argument: ${arg}`, 'Usage: csf-score.mjs --answers <file.json> [--json] [--catalogue <file.json>]');
    }
  }

  if (!answersPath) {
    fail('Error: --answers <file.json> is required', 'Usage: csf-score.mjs --answers <file.json> [--json] [--catalogue <file.json>]');
  }

  let catalogue;
  try {
    catalogue = loadCatalogue(cataloguePath);
  } catch (err) {
    fail(`Error loading catalogue: ${err.message}`);
  }

  let answers;
  try {
    answers = JSON.parse(readFileSync(resolve(answersPath), 'utf8'));
  } catch (err) {
    fail(`Error loading answers file '${answersPath}': ${err.message}`);
  }

  const result = scoreAssessment(catalogue, answers);
  process.stdout.write((asJson ? JSON.stringify(result, null, 2) : formatTable(result)) + '\n');
}
