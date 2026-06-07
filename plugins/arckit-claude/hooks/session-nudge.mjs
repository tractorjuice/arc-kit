/**
 * ArcKit Session Nudge — pure rule engine for the Stop-hook end-of-turn nudge.
 *
 * Given the doc-type codes a session's commits touched (per project) and the
 * codes present on disk (per project), returns at most one gentle next-step
 * suggestion when the session leaves an obvious traceability-chain gap.
 *
 * Pure: no git, no fs, no version logic, no side effects on import. The Stop
 * hook (session-learner.mjs) gathers the inputs and handles version gating;
 * this module just decides which nudge (if any) to surface. Unit-tested in
 * tests/plugin/session-nudge.test.mjs.
 *
 * See docs/superpowers/specs/2026-06-05-stop-hook-nudge-design.md.
 */

/**
 * Curated rule set, in priority order. Each rule fires when `trigger` was
 * touched this session AND `missing` is absent on disk for the same project.
 * The first matching (rule, project) pair wins — rule priority is the primary
 * key, ascending project number the tiebreaker.
 */
export const NUDGE_RULES = [
  {
    trigger: 'REQ',
    missing: 'TRAC',
    command: '/arckit:traceability',
    describe: (p) =>
      `ArcKit: project \`${p}\` gained requirements this session but has no traceability matrix. ` +
      `Consider running \`/arckit:traceability\` to keep the requirements-to-design chain auditable.`,
  },
  {
    trigger: 'STKE',
    missing: 'REQ',
    command: '/arckit:requirements',
    describe: (p) =>
      `ArcKit: project \`${p}\` has stakeholder analysis but no requirements yet. ` +
      `Consider running \`/arckit:requirements\` to turn stakeholder needs into BR/FR/NFR.`,
  },
  {
    trigger: 'REQ',
    missing: 'DATA',
    command: '/arckit:data-model',
    describe: (p) =>
      `ArcKit: project \`${p}\` gained requirements this session but has no data model. ` +
      `Consider running \`/arckit:data-model\` to capture the entities and data requirements.`,
  },
  {
    trigger: 'ADR',
    missing: 'DIAG',
    command: '/arckit:diagram',
    describe: (p) =>
      `ArcKit: project \`${p}\` recorded an architecture decision this session but has no diagram. ` +
      `Consider running \`/arckit:diagram\` to visualise the decision.`,
  },
];

/**
 * Pick at most one nudge.
 *
 * @param {object} input
 * @param {Map<string, Set<string>>} input.projectCodes
 *        doc-type codes touched THIS session, keyed by project number.
 * @param {Map<string, Set<string>>} input.diskCodesByProject
 *        doc-type codes present ON DISK, keyed by project number.
 * @returns {{ projNum: string, command: string, message: string } | null}
 */
export function selectNudge({ projectCodes, diskCodesByProject } = {}) {
  if (!(projectCodes instanceof Map) || projectCodes.size === 0) return null;
  const disk = diskCodesByProject instanceof Map ? diskCodesByProject : new Map();

  // Ascending numeric project order for the tiebreaker.
  const projects = [...projectCodes.keys()].sort((a, b) => Number(a) - Number(b));

  for (const rule of NUDGE_RULES) {
    for (const projNum of projects) {
      const touched = projectCodes.get(projNum) || new Set();
      const present = disk.get(projNum) || new Set();
      if (touched.has(rule.trigger) && !present.has(rule.missing)) {
        return { projNum, command: rule.command, message: rule.describe(projNum) };
      }
    }
  }
  return null;
}
