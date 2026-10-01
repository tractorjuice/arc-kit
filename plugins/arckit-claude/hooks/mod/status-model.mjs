/**
 * ArcKit status band: the pure half.
 *
 * Turns the artefacts under projects/ into the one line the status-band mod
 * draws above the prompt. No I/O and no Node imports, so the mod (which runs
 * in Claude Code's mods sandbox, with no Node) and `node --test` both load it.
 *
 * The DRAFT and review-overdue rules match detect-stale-artifacts.sh and the
 * STALE-DRAFT / REVIEW-OVERDUE rules in graph-inject.mjs formatHealth, so the
 * band never disagrees with /arckit:health.
 */

export const STALE_DRAFT_DAYS = 30;

const ISO_DATE = /\d{4}-\d{2}-\d{2}/;
const STATUSES = /(DRAFT|IN_REVIEW|APPROVED|PUBLISHED|SUPERSEDED|ARCHIVED)/i;

export function isArtefactName(name) {
  return /^ARC-.+\.md$/.test(name);
}

export function isProjectDir(name) {
  return /^\d{3}-/.test(name);
}

function dateOnRow(lines, label) {
  const row = lines.find((line) => label.test(line));
  const match = row && row.match(ISO_DATE);
  return match ? match[0] : null;
}

/**
 * The Document Control facts the band counts. Status is read only from a row
 * labelled exactly "Status" (bold allowed), so an entity table further down
 * the file cannot be mistaken for it.
 */
export function documentFacts(text) {
  const lines = String(text).split('\n');
  const statusRow = lines.find((line) => /^\|\s*\*{0,2}\s*Status\s*\*{0,2}\s*\|/i.test(line));
  const statusMatch = statusRow && statusRow.match(STATUSES);
  return {
    status: statusMatch ? statusMatch[1].toUpperCase() : null,
    nextReview: dateOnRow(lines, /Next Review Date/i),
    lastModified: dateOnRow(lines, /Last Modified/i),
  };
}

export function daysBefore(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const at = new Date(Date.UTC(y, m - 1, d - days));
  return at.toISOString().slice(0, 10);
}

/**
 * @param {string[]} projectNames the NNN-name directories under projects/
 * @param {string[]} texts each artefact's content
 * @param {string} today YYYY-MM-DD
 */
export function summarise(projectNames, texts, today) {
  const staleBefore = daysBefore(today, STALE_DRAFT_DAYS);
  const summary = { projects: projectNames.length, artefacts: texts.length, draft: 0, staleDraft: 0, overdue: 0 };
  for (const text of texts) {
    const facts = documentFacts(text);
    if (facts.nextReview && facts.nextReview < today) {
      summary.overdue += 1;
    }
    if (facts.status === 'DRAFT') {
      summary.draft += 1;
      if (facts.lastModified && facts.lastModified < staleBefore) {
        summary.staleDraft += 1;
      }
    }
  }
  return summary;
}

export function needsAttention(summary) {
  return summary.overdue > 0 || summary.staleDraft > 0;
}

function plural(count, one, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`;
}

export function bandText(summary) {
  const parts = [
    'ArcKit',
    plural(summary.projects, 'project'),
    plural(summary.artefacts, 'artefact'),
  ];
  if (summary.draft > 0) {
    parts.push(summary.staleDraft > 0 ? `${summary.draft} draft (${summary.staleDraft} stale)` : `${summary.draft} draft`);
  }
  if (summary.overdue > 0) {
    parts.push(`${plural(summary.overdue, 'review')} overdue`);
  }
  const line = parts.join(' · ');
  return needsAttention(summary) ? `${line} — run /arckit:health` : line;
}
