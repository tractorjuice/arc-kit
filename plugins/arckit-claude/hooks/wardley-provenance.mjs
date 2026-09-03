/**
 * ArcKit — Wardley Map component provenance + visibility join (pure rules).
 *
 * `validate-wardley-math.mjs` owns a map's *internal* consistency: the stage
 * matches the evolution, coordinates sit in [0,1], the OWM block agrees with
 * the Component Inventory. None of that asks where a component came from, so
 * a fabricated component with self-consistent numbers passed every check.
 *
 * This module adds the two rules borrowed from Anthropic's commerce-agents
 * example (github.com/anthropics/commerce-agents):
 *
 *   1. Provenance — the cart there accepts only product ids a tool returned
 *      this session; here the Component Inventory accepts only components
 *      whose `Source` cell resolves to something real: a citation the map
 *      itself declares, an artefact that exists in the project, or an
 *      explicit `Assumption`. A Source naming a document that is not there
 *      is a fabricated provenance and is blocked.
 *
 *   2. Visibility join — there the model chooses the product card and the
 *      server fills in the price. Here the model chooses which components
 *      the map carries, and the value chain owns their visibility: a row
 *      sourced to the WVCH artefact must carry the WVCH's own number.
 *
 * Both are claim-scoped: a table with no `Source` column is not checked at
 * all (maps written before the column existed keep working), and visibility
 * is joined only for rows that claim the value chain as their source, so a
 * map deliberately re-anchored on a different user need is never blocked for
 * disagreeing with it.
 *
 * Pure by design — no fs, no process. `validate-wardley-math.mjs` reads the
 * files and calls in; the tests call in directly.
 */

/** Visibility values are authored to 2dp in both tables; anything beyond half
 *  a unit in the last place is a disagreement rather than a rounding artefact. */
export const VISIBILITY_TOLERANCE = 0.005;

const PLACEHOLDER_CELL = /^(?:[—–-]+|n\/?a|none|tbd|tbc|\.{3}|…)$/i;

/** Split one Markdown table line into trimmed cells, dropping the empty
 *  fragments the leading and trailing pipes produce. */
export function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return null;
  const cells = trimmed.split('|').map((c) => c.trim());
  cells.shift();
  if (cells.length && cells[cells.length - 1] === '') cells.pop();
  return cells;
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
}

/** Component names are compared across two documents authored at different
 *  times, so ignore case, surrounding quotes/emphasis and internal spacing. */
export function normalizeComponentName(raw) {
  return String(raw ?? '')
    .replace(/[*`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    // Quotes are stripped after trimming, or padding hides them from the anchors.
    .replace(/^"(.*)"$/, '$1')
    .trim()
    .replace(/[.,;:]+$/, '')
    .toLowerCase();
}

function headerIndex(cells, pattern) {
  return cells.findIndex((c) => pattern.test(c));
}

/**
 * Rows of the map's Component Inventory tables.
 *
 * Only tables whose header carries Component + Visibility + Evolution + Stage
 * qualify, which keeps the Evolution Analysis tables (Component / Current
 * Position / Risk / …) out of scope. `hasSource` is per row because the
 * inventory is split across several tables and a partially migrated document
 * may have the column on some of them.
 *
 * @returns {{rows: Array<{name: string, visibility: string, source: string|null, hasSource: boolean, line: number}>}}
 */
export function parseInventoryRows(lines) {
  const rows = [];
  let header = null;

  for (let i = 0; i < lines.length; i++) {
    const cells = splitRow(lines[i]);
    if (!cells || cells.length < 4) {
      // A blank line or prose ends the current table; a `###` heading does too.
      if (!cells) header = null;
      continue;
    }
    if (isSeparatorRow(cells)) continue;

    const componentAt = headerIndex(cells, /^component$/i);
    const visibilityAt = headerIndex(cells, /^visibility\b/i);
    const evolutionAt = headerIndex(cells, /^evolution\b/i);
    const stageAt = headerIndex(cells, /^stage$/i);
    if (componentAt === 0 && visibilityAt > 0 && evolutionAt > 0 && stageAt > 0) {
      header = { componentAt, visibilityAt, sourceAt: headerIndex(cells, /^sources?$/i) };
      continue;
    }
    if (!header) continue;

    const name = cells[header.componentAt] ?? '';
    // Template placeholders (`{Component 1}`) are not yet real components.
    if (!name || name.includes('{')) continue;
    const visibility = cells[header.visibilityAt] ?? '';
    if (!/^-?\d+(?:\.\d+)?$/.test(visibility)) continue;

    const source = header.sourceAt >= 0 ? (cells[header.sourceAt] ?? '') : null;
    rows.push({
      name,
      visibility,
      source,
      hasSource: header.sourceAt >= 0,
      line: i + 1,
    });
  }

  return { rows };
}

/**
 * The `ID | Component | … | Visibility` inventory of a WVCH value-chain
 * artefact, as a lookup from normalised component name to its visibility.
 */
export function parseValueChainInventory(markdown) {
  const lines = String(markdown ?? '').split('\n');
  const components = new Map();
  let header = null;

  for (const line of lines) {
    const cells = splitRow(line);
    if (!cells || cells.length < 3) {
      if (!cells) header = null;
      continue;
    }
    if (isSeparatorRow(cells)) continue;

    const componentAt = headerIndex(cells, /^component$/i);
    const visibilityAt = headerIndex(cells, /^visibility\b/i);
    if (componentAt >= 0 && visibilityAt >= 0) {
      header = { componentAt, visibilityAt };
      continue;
    }
    if (!header) continue;

    const name = cells[header.componentAt] ?? '';
    if (!name || name.includes('{')) continue;
    const raw = (cells[header.visibilityAt] ?? '').replace(/[{}]/g, '');
    if (!/^-?\d+(?:\.\d+)?$/.test(raw)) continue;

    const key = normalizeComponentName(name);
    if (!components.has(key)) components.set(key, { name, visibility: raw });
  }

  return components;
}

/**
 * Citations the map itself declares, as citation ID -> the Doc ID it cites.
 * The Doc ID is what lets a component sourced as `[WVCH-C3]` be recognised as
 * a value-chain claim and so joined against the value chain's own numbers.
 */
export function parseCitations(lines) {
  const citations = new Map();
  let inCitations = false;

  for (const line of lines) {
    if (/^\s*#{2,4}\s+/.test(line)) {
      inCitations = /^\s*#{2,4}\s+Citations\s*$/i.test(line);
      continue;
    }
    if (!inCitations) continue;
    const cells = splitRow(line);
    if (!cells || cells.length < 2 || isSeparatorRow(cells)) continue;
    const id = cells[0];
    if (!id || /^citation id$/i.test(id) || PLACEHOLDER_CELL.test(id)) continue;
    const docId = PLACEHOLDER_CELL.test(cells[1] ?? '') ? '' : (cells[1] ?? '').trim();
    citations.set(id.replace(/[[\]]/g, '').trim().toUpperCase(), docId.toUpperCase());
  }

  return citations;
}

/** Document IDs the map declares in its Document Register. */
export function parseRegisterDocIds(lines) {
  const ids = new Set();
  let inRegister = false;

  for (const line of lines) {
    if (/^\s*#{2,4}\s+/.test(line)) {
      inRegister = /^\s*#{2,4}\s+Document Register\s*$/i.test(line);
      continue;
    }
    if (!inRegister) continue;
    const cells = splitRow(line);
    if (!cells || cells.length < 2 || isSeparatorRow(cells)) continue;
    const id = cells[0];
    if (!id || /^doc id$/i.test(id) || PLACEHOLDER_CELL.test(id)) continue;
    ids.add(id.trim().toUpperCase());
  }

  return ids;
}

const CITATION_MARKER = /\[([A-Z0-9][A-Z0-9._-]*-C\d+)\]/gi;
const DOC_ID = /\bARC-\d{3}-[A-Z][A-Z0-9-]*?(?:-\d+)?-v\d+\.\d+\b/gi;
const TOKEN = /[A-Za-z0-9][A-Za-z0-9._-]*/g;

/** True when a Doc ID or doc-type code names the project's value chain. */
function isValueChainRef(key, valueChainKey) {
  return key === 'WVCH' || (valueChainKey !== null && key === valueChainKey);
}

/**
 * Does a `Source` cell resolve to something that exists?
 *
 * Resolution is deliberately generous about *form* and strict about
 * *existence*: a citation marker, an ARC document ID, an external Doc ID from
 * the map's own Document Register, a doc-type code for an artefact the
 * project holds, or the literal `Assumption`. What it refuses is a reference
 * to a document that is not there — the fabricated-provenance case.
 *
 * @returns {{ok: true, citesValueChain: boolean} | {ok: false, reason: string}}
 */
export function resolveSource(source, context) {
  const { citations, registerDocIds, projectDocIds, projectDocTypes, valueChainDocId } = context;
  const cell = String(source ?? '').trim();

  if (!cell || PLACEHOLDER_CELL.test(cell)) {
    return { ok: false, reason: 'the Source cell is empty' };
  }
  if (/^assumption\b/i.test(cell)) {
    return { ok: true, citesValueChain: false };
  }

  const valueChainKey = valueChainDocId ? valueChainDocId.toUpperCase() : null;
  let citesValueChain = false;
  let resolved = false;

  for (const [, id] of cell.matchAll(CITATION_MARKER)) {
    const key = id.toUpperCase();
    if (!citations.has(key)) {
      return {
        ok: false,
        reason: `citation ${id} is not declared in this map's Citations table`,
      };
    }
    const citedDoc = citations.get(key) || '';
    if (isValueChainRef(citedDoc, valueChainKey) || citedDoc.includes('WVCH')) {
      citesValueChain = true;
    }
    resolved = true;
  }

  for (const [full] of cell.matchAll(DOC_ID)) {
    const key = full.toUpperCase();
    if (!projectDocIds.has(key) && !registerDocIds.has(key)) {
      return {
        ok: false,
        reason: `document ${full} is not in this project and is not in this map's Document Register`,
      };
    }
    if (isValueChainRef(key, valueChainKey)) citesValueChain = true;
    resolved = true;
  }

  if (resolved) return { ok: true, citesValueChain };

  // No marker and no ARC document ID: the cell may still name an external
  // document from the Document Register, or an artefact type the project holds.
  const tokens = [...cell.matchAll(TOKEN)].map((m) => m[0]);
  const unresolved = [];
  for (const token of tokens) {
    const key = token.toUpperCase();
    if (registerDocIds.has(key)) {
      resolved = true;
      continue;
    }
    if (projectDocTypes.has(key)) {
      resolved = true;
      if (isValueChainRef(key, valueChainKey)) citesValueChain = true;
      continue;
    }
    if (/^[A-Z][A-Z0-9-]{2,}$/.test(token)) unresolved.push(token);
  }

  if (!resolved) {
    const seen = unresolved.length ? `'${unresolved.join("', '")}'` : `'${cell}'`;
    return {
      ok: false,
      reason: `${seen} does not name an artefact in this project or a document in this map's Document Register`,
    };
  }

  return { ok: true, citesValueChain };
}

function provenanceHint(reason) {
  return (
    `${reason}. Cite where this component came from: a citation ID from this ` +
    "map's own Citations table, the document ID of an artefact in this project " +
    '(for example the value chain it was decomposed from), or the literal ' +
    '`Assumption` when the component is your own judgement with no source ' +
    'document behind it.'
  );
}

/**
 * Provenance and visibility-join errors for one map.
 *
 * @param {object} input
 * @param {ReturnType<typeof parseInventoryRows>['rows']} input.rows
 * @param {Map<string, {name: string, visibility: string}>} input.valueChain
 * @param {string|null} input.valueChainDocId
 * @returns {{provenanceErrors: string[], visibilityErrors: string[]}}
 */
export function checkProvenance({
  rows,
  valueChain = new Map(),
  valueChainDocId = null,
  citations = new Map(),
  registerDocIds = new Set(),
  projectDocIds = new Set(),
  projectDocTypes = new Set(),
}) {
  const provenanceErrors = [];
  const visibilityErrors = [];
  const context = {
    citations,
    registerDocIds,
    projectDocIds,
    projectDocTypes,
    valueChainDocId,
  };

  for (const row of rows) {
    // A table with no Source column predates the rule and is not checked.
    if (!row.hasSource) continue;

    const resolved = resolveSource(row.source, context);
    if (!resolved.ok) {
      provenanceErrors.push(
        `- Line ${row.line}: '${row.name}' — ${provenanceHint(resolved.reason)}`
      );
      continue;
    }
    if (!resolved.citesValueChain || valueChain.size === 0) continue;

    const entry = valueChain.get(normalizeComponentName(row.name));
    if (!entry) {
      provenanceErrors.push(
        `- Line ${row.line}: '${row.name}' is sourced to the value chain, but no ` +
          `component of that name is in ${valueChainDocId ?? 'the WVCH artefact'}. ` +
          'Add it to the value chain first with `/arckit:wardley.value-chain`, or ' +
          'change the Source to where this component actually came from.'
      );
      continue;
    }

    const mapVis = parseFloat(row.visibility);
    const chainVis = parseFloat(entry.visibility);
    if (Number.isFinite(mapVis) && Number.isFinite(chainVis)
        && Math.abs(mapVis - chainVis) > VISIBILITY_TOLERANCE) {
      visibilityErrors.push(
        `- Line ${row.line}: '${row.name}' has visibility ${row.visibility} but the ` +
          `value chain it cites puts it at ${entry.visibility}. The value chain owns ` +
          'visibility: use its number here (and in the OWM block), or correct the ' +
          'value chain and re-run this map.'
      );
    }
  }

  return { provenanceErrors, visibilityErrors };
}
