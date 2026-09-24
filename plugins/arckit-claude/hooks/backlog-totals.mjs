/**
 * Backlog totals rules — pure, side-effect-free.
 *
 * `/arckit:backlog` states every aggregate (story count, points per epic,
 * points per MoSCoW bucket) alongside the items it summarises, and nothing
 * checked the two agreed: the model asserted totals rather than computing
 * them, and a revision updated some sections and not others (#855, #856).
 * These rules recompute each aggregate from the backlog JSON's own items and
 * report every declared value that disagrees.
 *
 * The JSON is the structured record the Markdown is rendered from, so it is
 * checked rather than the Markdown, whose labels are translated when a
 * backlog is written in another language.
 *
 * `stories[]` holds every backlog item — user stories and the technical tasks
 * Step 6 creates from NFRs — which is how `/arckit:trello` reads it.
 *
 * Invoked by `validate-backlog-totals.mjs`.
 */

const BUCKETS = ['must', 'should', 'could', 'wont'];
const RANK = { must: 4, should: 3, could: 2, wont: 1 };
const LABEL = { must: 'Must Have', should: 'Should Have', could: 'Could Have', wont: "Won't Have" };

/**
 * Normalise a MoSCoW value: "Must Have", "MUST_HAVE", "must", "M",
 * "Won't Have", "WONT_HAVE". Returns null for anything else, including
 * translated labels, so an unrecognised scale is skipped rather than guessed.
 */
export function normalisePriority(value) {
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase().replace(/[’`]/g, "'").replace(/[\s_-]+/g, ' ');
  if (/^(must|m)( have)?$/.test(v)) return 'must';
  if (/^(should|s)( have)?$/.test(v)) return 'should';
  if (/^(could|c)( have)?$/.test(v)) return 'could';
  if (/^(won'?t|w)( have)?$/.test(v)) return 'wont';
  return null;
}

function isNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

function sprintNumber(v) {
  if (isNumber(v)) return v;
  if (typeof v === 'string' && /^\s*-?\d+\s*$/.test(v)) return parseInt(v, 10);
  return null;
}

function points(item) {
  return isNumber(item.story_points) ? item.story_points : null;
}

/**
 * Parse MoSCoW priorities out of a requirements document: each
 * `## BR-001:` / `#### NFR-P-002:` heading, then the first `**Priority**:`
 * line before the next heading. Priorities on the CRITICAL/HIGH/MEDIUM/LOW
 * scale are not MoSCoW and are left out.
 *
 * @returns {Map<string, string>} requirement ID -> normalised bucket
 */
export function parseRequirementPriorities(markdown) {
  const out = new Map();
  let current = null;
  for (const line of markdown.split('\n')) {
    const heading = line.match(/^#{2,6}\s+((?:BR|FR|NFR(?:-[A-Z]+)?|INT|DR)-\d{1,3})\b/);
    if (heading) {
      current = heading[1];
      continue;
    }
    if (/^#{1,6}\s/.test(line)) {
      current = null;
      continue;
    }
    if (!current || out.has(current)) continue;
    const pri = line.match(/^\s*\*\*Priority\*\*\s*:\s*\[?\s*([A-Za-z'’_ ]+?)\s*\]?\s*(?:\(|$)/);
    if (pri) {
      const bucket = normalisePriority(pri[1]);
      if (bucket) out.set(current, bucket);
    }
  }
  return out;
}

/**
 * Check a parsed backlog JSON.
 *
 * @param {object} backlog  the parsed JSON
 * @param {Map<string,string>} [requirementPriorities]  from parseRequirementPriorities
 * @returns {{ totals: string[], epics: string[], sprints: string[], priorities: string[] }}
 */
export function checkBacklog(backlog, requirementPriorities = new Map()) {
  const totals = [];
  const epics = [];
  const sprints = [];
  const priorities = [];
  const result = { totals, epics, sprints, priorities };

  if (!backlog || typeof backlog !== 'object' || !Array.isArray(backlog.stories)) {
    totals.push('- `stories` must be an array holding every backlog item (user stories and technical tasks).');
    return result;
  }

  const items = backlog.stories.filter((s) => s && typeof s === 'object');
  const epicList = Array.isArray(backlog.epics) ? backlog.epics.filter((e) => e && typeof e === 'object') : [];
  const summary = backlog.summary && typeof backlog.summary === 'object' ? backlog.summary : {};

  const unpointed = items.filter((s) => points(s) === null).map((s) => s.id ?? '(no id)');
  if (unpointed.length > 0) {
    totals.push(`- ${unpointed.length} item(s) have no numeric \`story_points\`: ${unpointed.slice(0, 10).join(', ')}${unpointed.length > 10 ? ', …' : ''}. Totals cannot be checked until every item is estimated.`);
  }
  const sum = (list) => list.reduce((acc, s) => acc + (points(s) ?? 0), 0);

  // --- Summary totals ---
  if (isNumber(summary.total_stories) && summary.total_stories !== items.length) {
    totals.push(`- \`summary.total_stories\` is ${summary.total_stories}, but \`stories\` holds ${items.length} items.`);
  }
  if (isNumber(summary.total_epics) && summary.total_epics !== epicList.length) {
    totals.push(`- \`summary.total_epics\` is ${summary.total_epics}, but \`epics\` holds ${epicList.length}.`);
  }
  if (unpointed.length === 0 && isNumber(summary.total_points) && summary.total_points !== sum(items)) {
    totals.push(`- \`summary.total_points\` is ${summary.total_points}, but the items' \`story_points\` add up to ${sum(items)}.`);
  }

  // Per-priority points: only when every item's priority is a recognised
  // MoSCoW value, so a translated scale is skipped rather than miscounted.
  const buckets = items.map((s) => normalisePriority(s.priority));
  if (unpointed.length === 0 && buckets.every((b) => b !== null)) {
    for (const bucket of BUCKETS) {
      const key = `${bucket}_have_points`;
      if (!isNumber(summary[key])) continue;
      const actual = sum(items.filter((_, i) => buckets[i] === bucket));
      if (summary[key] !== actual) {
        totals.push(`- \`summary.${key}\` is ${summary[key]}, but ${LABEL[bucket]} items add up to ${actual}.`);
      }
    }
  }

  if (isNumber(summary.total_requirements) && Array.isArray(backlog.traceability)
      && summary.total_requirements !== backlog.traceability.length) {
    totals.push(`- \`summary.total_requirements\` is ${summary.total_requirements}, but \`traceability\` has ${backlog.traceability.length} rows.`);
  }

  // --- Epics ---
  const epicIds = new Set(epicList.map((e) => e.id).filter(Boolean));
  for (const epic of epicList) {
    const children = items.filter((s) => s.epic === epic.id);
    if (unpointed.length === 0 && isNumber(epic.points) && epic.points !== sum(children)) {
      epics.push(`- ${epic.id}: \`points\` is ${epic.points}, but its ${children.length} items add up to ${sum(children)}.`);
    }
    if (Array.isArray(epic.stories)) {
      const listed = new Set(epic.stories.filter((id) => typeof id === 'string' && id !== '...'));
      const actual = new Set(children.map((s) => s.id));
      const missing = [...actual].filter((id) => !listed.has(id));
      const extra = [...listed].filter((id) => !actual.has(id));
      if (missing.length > 0) epics.push(`- ${epic.id}: items with \`"epic": "${epic.id}"\` missing from its \`stories\` list: ${missing.join(', ')}.`);
      if (extra.length > 0) epics.push(`- ${epic.id}: \`stories\` lists ${extra.join(', ')}, which ${extra.length === 1 ? 'is' : 'are'} not an item of this epic.`);
    }
  }
  if (epicIds.size > 0) {
    for (const s of items) {
      if (s.epic && !epicIds.has(s.epic)) epics.push(`- ${s.id}: \`epic\` is ${s.epic}, which is not in \`epics\`.`);
    }
  }

  // --- Sprints ---
  const sprintList = Array.isArray(backlog.sprints) ? backlog.sprints.filter((sp) => sp && typeof sp === 'object') : [];
  const badSprint = (owner, value) => {
    const n = sprintNumber(value);
    if (n !== null && n < 1) sprints.push(`- ${owner}: sprint is ${value}. Sprints are numbered from 1; use \`null\` for an item not yet scheduled.`);
  };
  for (const s of items) badSprint(s.id, s.sprint);
  if (Array.isArray(backlog.traceability)) {
    for (const row of backlog.traceability) {
      if (row && typeof row === 'object') badSprint(`traceability ${row.requirement}`, row.sprint);
    }
  }
  const byId = new Map(items.map((s) => [s.id, s]));
  for (const sp of sprintList) {
    const n = sprintNumber(sp.number);
    if (n === null || !Array.isArray(sp.stories)) continue;
    const wrong = sp.stories.filter((id) => byId.has(id) && sprintNumber(byId.get(id).sprint) !== n);
    for (const id of wrong) {
      sprints.push(`- Sprint ${n} lists ${id}, but ${id} has \`"sprint": ${JSON.stringify(byId.get(id).sprint)}\`.`);
    }
  }

  // --- Priority drift against the requirements document ---
  if (requirementPriorities.size > 0) {
    const trace = new Map();
    if (Array.isArray(backlog.traceability)) {
      for (const row of backlog.traceability) {
        if (row && typeof row.requirement === 'string') trace.set(row.requirement, row);
      }
    }
    for (const [req, reqBucket] of requirementPriorities) {
      const covering = items.filter((s) => Array.isArray(s.requirements) && s.requirements.includes(req));
      const ranks = covering.map((s) => normalisePriority(s.priority)).filter(Boolean).map((b) => RANK[b]);
      if (ranks.length === 0 || ranks.length !== covering.length) continue;
      const best = Math.max(...ranks);
      if (best >= RANK[reqBucket]) continue;
      const reason = trace.get(req)?.priority_change;
      if (typeof reason === 'string' && reason.trim().length > 0) continue;
      const bestLabel = LABEL[BUCKETS.find((b) => RANK[b] === best)];
      priorities.push(`- ${req} is ${LABEL[reqBucket]} in the requirements document, but its highest-priority backlog item (${covering.map((s) => s.id).join(', ')}) is ${bestLabel}. Raise the item's priority, or record why on the requirement's \`traceability\` row as \`"priority_change": "<reason>"\`.`);
    }
  }

  return result;
}
