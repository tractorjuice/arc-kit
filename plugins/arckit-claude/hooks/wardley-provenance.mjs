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
 *      itself declares, an artefact that exists in the repository, or an
 *      explicit `Assumption`. A Source naming a document that is not there
 *      is a fabricated provenance and is blocked. A citation or Document
 *      Register row that names an ARC document is held to the same test, so
 *      a self-authored table row cannot launder an invented ID.
 *
 *   2. Visibility join — there the model chooses the product card and the
 *      server fills in the price. Here the model chooses which components
 *      the map carries, and the value chain owns their visibility: a row
 *      sourced to a WVCH artefact must carry that artefact's own number.
 *      The join is against the value chain the row actually cites — a
 *      project may hold several — never against "whichever one was found".
 *
 * Both are claim-scoped: a table with no `Source` column is not checked at
 * all (maps written before the column existed keep working), and visibility
 * is joined only for rows that claim a value chain as their source, so a
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

/**
 * Split one Markdown table line into trimmed cells, dropping the empty
 * fragments the leading and trailing pipes produce. An escaped pipe (`\|`)
 * and a pipe inside a code span are cell content, not separators — the
 * plugin's own templates use `\|` inside cells.
 */
export function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return null;
  const cells = [];
  let cell = '';
  let inCode = false;
  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (ch === '\\' && trimmed[i + 1] === '|') {
      cell += '|';
      i += 1;
      continue;
    }
    if (ch === '`') inCode = !inCode;
    if (ch === '|' && !inCode) {
      cells.push(cell.trim());
      cell = '';
      continue;
    }
    cell += ch;
  }
  cells.push(cell.trim());
  cells.shift();
  if (cells.length && cells[cells.length - 1] === '') cells.pop();
  return cells;
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c));
}

/** Header cells may be emphasised (`**Component**`) or code-spanned. */
function headerText(cell) {
  return String(cell ?? '').replace(/[*_`]/g, '').trim();
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
  return cells.findIndex((c) => pattern.test(headerText(c)));
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

    const componentAt = headerIndex(cells, /^component(?:\s+name)?$/i);
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
 * A row whose name or visibility is still a template placeholder (`{…}`) is
 * not a component yet and is left out — `{0.00}` is not a number to trust.
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

    const componentAt = headerIndex(cells, /^component(?:\s+name)?$/i);
    const visibilityAt = headerIndex(cells, /^visibility\b/i);
    if (componentAt >= 0 && visibilityAt >= 0) {
      header = { componentAt, visibilityAt };
      continue;
    }
    if (!header) continue;

    const name = cells[header.componentAt] ?? '';
    if (!name || name.includes('{')) continue;
    const raw = cells[header.visibilityAt] ?? '';
    if (raw.includes('{') || !/^-?\d+(?:\.\d+)?$/.test(raw)) continue;

    const key = normalizeComponentName(name);
    if (!components.has(key)) components.set(key, { name, visibility: raw });
  }

  return components;
}

/**
 * Citations the map itself declares, as citation ID -> the Doc ID it cites.
 * The Doc ID is what lets a component sourced as `[WVCH-C3]` be recognised as
 * a value-chain claim and so joined against that value chain's own numbers.
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
    const id = headerText(cells[0]);
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
    const id = headerText(cells[0]);
    if (!id || /^doc id$/i.test(id) || PLACEHOLDER_CELL.test(id)) continue;
    ids.add(id.trim().toUpperCase());
  }

  return ids;
}

const CITATION_MARKER = /\[([A-Z0-9][A-Z0-9._-]*-C\d+)\]/gi;
// An ARC document reference, with or without its version: `ARC-001-WVCH-001-v1.0`
// (the form on disk) or `ARC-001-WVCH-001` (the form `/arckit:impact` and the
// requirement graph use). The version, when present, is the trailing `-vN.N`.
const DOC_REF = /\bARC-\d{3}-[A-Z][A-Z0-9-]*[A-Z0-9](?:-v\d+\.\d+)?(?![A-Z0-9.])/gi;
const TOKEN = /[A-Za-z0-9][A-Za-z0-9._-]*/g;

/** The doc-type code inside an upper-cased ARC document ID, hyphenated types included. */
export function docTypeOf(docId, knownTypes = null) {
  const m = String(docId).toUpperCase().match(/^ARC-\d{3}-(.+?)(?:-\d{3})?(?:-V\d+\.\d+)?$/);
  if (!m) return null;
  const rest = m[1];
  if (knownTypes) {
    // Longest registered code that prefixes the remainder wins (SECD-MOD over SECD).
    let best = null;
    for (const code of knownTypes) {
      const up = code.toUpperCase();
      if ((rest === up || rest.startsWith(up + '-')) && (!best || up.length > best.length)) best = up;
    }
    if (best) return best;
  }
  return rest.replace(/-\d{3}$/, '');
}

/**
 * Resolve an ARC document reference against the repository's document IDs.
 * An exact ID must exist; a version-less reference resolves to the highest
 * version on disk. Returns the upper-cased on-disk ID, or null.
 */
export function resolveDocRef(ref, projectDocIds) {
  const key = String(ref).toUpperCase();
  if (projectDocIds.has(key)) return key;
  if (/-V\d+\.\d+$/.test(key)) return null;
  let best = null;
  let bestVersion = -1;
  for (const id of projectDocIds) {
    if (!id.startsWith(key + '-V')) continue;
    const m = id.match(/-V(\d+)\.(\d+)$/);
    if (!m) continue;
    const version = parseInt(m[1], 10) * 1000 + parseInt(m[2], 10);
    if (version > bestVersion) {
      bestVersion = version;
      best = id;
    }
  }
  return best;
}

/**
 * Does a `Source` cell resolve to something that exists?
 *
 * Resolution is deliberately generous about *form* and strict about
 * *existence*: a citation marker, an ARC document ID (with or without its
 * version), an external Doc ID from the map's own Document Register, a
 * doc-type code for an artefact the repository holds, or the literal
 * `Assumption`. What it refuses is a reference to a document that is not
 * there — the fabricated-provenance case — including one reached through a
 * citation or register row the map wrote for itself.
 *
 * @param {object} context
 * @param {Map<string,string>} context.citations   citation ID -> Doc ID (upper-cased)
 * @param {Set<string>} context.registerDocIds     Document Register IDs (upper-cased)
 * @param {Set<string>} context.projectDocIds      every ARC document ID on disk, all projects (upper-cased)
 * @param {Set<string>} context.projectDocTypes    every doc-type code on disk (upper-cased)
 * @param {string|null} context.defaultValueChainDocId  the project's own current WVCH, for a bare `WVCH` source
 * @param {Iterable<string>} [context.knownTypes]  registered doc-type codes, for hyphenated types
 * @returns {{ok: true, valueChainDocId: string|null} | {ok: false, reason: string}}
 */
export function resolveSource(source, context) {
  const {
    citations,
    registerDocIds,
    projectDocIds,
    projectDocTypes,
    defaultValueChainDocId = null,
    knownTypes = null,
  } = context;
  const cell = String(source ?? '').trim();

  if (!cell || PLACEHOLDER_CELL.test(cell)) {
    return { ok: false, reason: 'the Source cell is empty' };
  }
  if (/^assumption\b/i.test(cell)) {
    return { ok: true, valueChainDocId: null };
  }

  let valueChainDocId = null;
  let resolved = false;

  const noteValueChain = (docId) => {
    if (docTypeOf(docId, knownTypes) === 'WVCH' && !valueChainDocId) valueChainDocId = docId;
  };

  // A reference to an ARC document that must exist on disk; null when it does not.
  const resolveArc = (ref) => resolveDocRef(ref, projectDocIds);

  for (const [, id] of cell.matchAll(CITATION_MARKER)) {
    const key = id.toUpperCase();
    if (!citations.has(key)) {
      return {
        ok: false,
        reason: `citation ${id} is not declared in this map's Citations table`,
      };
    }
    const citedDoc = citations.get(key) || '';
    const arcRefs = [...citedDoc.matchAll(DOC_REF)].map((m) => m[0]);
    for (const ref of arcRefs) {
      const onDisk = resolveArc(ref);
      if (!onDisk) {
        return {
          ok: false,
          reason: `citation ${id} cites ${ref}, which is not an artefact in this repository`,
        };
      }
      noteValueChain(onDisk);
    }
    resolved = true;
  }

  for (const [ref] of cell.matchAll(DOC_REF)) {
    const key = ref.toUpperCase();
    const onDisk = resolveArc(ref);
    if (onDisk) {
      noteValueChain(onDisk);
      resolved = true;
      continue;
    }
    if (registerDocIds.has(key)) {
      // An ARC-shaped ID in the Document Register still has to exist: the
      // register is the map's own table and cannot vouch for a fabrication.
      return {
        ok: false,
        reason: `document ${ref} is listed in this map's Document Register but is not an artefact in this repository`,
      };
    }
    return {
      ok: false,
      reason: `document ${ref} is not an artefact in this repository`,
    };
  }

  if (resolved) return { ok: true, valueChainDocId };

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
      if (key === 'WVCH' && defaultValueChainDocId && !valueChainDocId) {
        valueChainDocId = defaultValueChainDocId.toUpperCase();
      }
      continue;
    }
    if (/^[A-Z][A-Z0-9-]{2,}$/.test(token)) unresolved.push(token);
  }

  if (!resolved) {
    const seen = unresolved.length ? `'${unresolved.join("', '")}'` : `'${cell}'`;
    return {
      ok: false,
      reason: `${seen} does not name an artefact in this repository or a document in this map's Document Register`,
    };
  }

  return { ok: true, valueChainDocId };
}

function provenanceHint(reason) {
  return (
    `${reason}. Cite where this component came from, in one of these forms: ` +
    'the document ID of an artefact in this repository (for example the value ' +
    'chain it was decomposed from, `ARC-001-WVCH-001-v1.0`, or the requirements, ' +
    '`ARC-001-REQ-v1.0`); a doc-type code the project holds (`WVCH`, `REQ`); a ' +
    "citation ID from this map's own Citations table (`[WVCH-C1]`); an external " +
    "Doc ID from this map's Document Register; or the literal `Assumption` when " +
    'the component is your own judgement with no source document behind it.'
  );
}

/**
 * Provenance and visibility-join errors for one map.
 *
 * @param {object} input
 * @param {ReturnType<typeof parseInventoryRows>['rows']} input.rows
 * @param {Map<string, Map<string, {name: string, visibility: string}>>} input.valueChains
 *        upper-cased WVCH Doc ID -> its parsed inventory; a chain that exists on
 *        disk but could not be read is simply absent from this map, and its rows
 *        are then not joined
 * @param {string|null} input.defaultValueChainDocId  the project's own current WVCH
 * @returns {{provenanceErrors: string[], visibilityErrors: string[]}}
 */
export function checkProvenance({
  rows,
  valueChains = new Map(),
  defaultValueChainDocId = null,
  citations = new Map(),
  registerDocIds = new Set(),
  projectDocIds = new Set(),
  projectDocTypes = new Set(),
  knownTypes = null,
}) {
  const provenanceErrors = [];
  const visibilityErrors = [];
  const context = {
    citations,
    registerDocIds,
    projectDocIds,
    projectDocTypes,
    defaultValueChainDocId,
    knownTypes,
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
    if (!resolved.valueChainDocId) continue;

    const chainId = resolved.valueChainDocId;
    const chain = valueChains.get(chainId);
    // The cited value chain exists (resolveSource proved it) but could not be
    // read: nothing to join against, so the row is not judged on visibility.
    if (!chain) continue;

    if (chain.size === 0) {
      provenanceErrors.push(
        `- Line ${row.line}: '${row.name}' is sourced to ${chainId}, but that value ` +
          'chain has no components yet (its inventory is still the template). ' +
          'Fill in the value chain with `/arckit:wardley.value-chain` first, or ' +
          'change the Source to where this component actually came from.'
      );
      continue;
    }

    const entry = chain.get(normalizeComponentName(row.name));
    if (!entry) {
      provenanceErrors.push(
        `- Line ${row.line}: '${row.name}' is sourced to ${chainId}, but no ` +
          'component of that name is in that value chain. ' +
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
        `- Line ${row.line}: '${row.name}' has visibility ${row.visibility} but ` +
          `${chainId} puts it at ${entry.visibility}. The value chain owns ` +
          'visibility: use its number here (and in the OWM block), or correct the ' +
          'value chain and re-run this map.'
      );
    }
  }

  return { provenanceErrors, visibilityErrors };
}
