#!/usr/bin/env node
/**
 * ArcKit PreToolUse (Write) Hook — Wardley Map Math + OWM Lint
 *
 * Validates a Wardley Map document about to be written for consistency:
 *   1. Stage-evolution alignment (Component Inventory tables)
 *   2. Coordinate range validation (all values in [0.00, 1.00])
 *   3. OWM syntax consistency (wardley/owm code block vs Component Inventory)
 *   4. OWM parser-class lint (dangling refs, annotation reuse, pipeline
 *      range, style-name typos) — see issue #436 failure-class list
 *   5. Mermaid wardley-beta syntax (unquoted bare-digit tokens break rendering)
 *   6. Component provenance — every Component Inventory row whose table
 *      carries a `Source` column must cite something that exists
 *   7. Visibility join — a row sourced to the project's value chain must
 *      carry the value chain's own visibility
 *
 * Checks 6 and 7 live in the pure `wardley-provenance.mjs`; this file finds
 * the project's artefacts on disk and feeds them in. Both are claim-scoped:
 * a table with no `Source` column is not provenance-checked, and visibility
 * is joined only for rows that name the value chain, so a map deliberately
 * anchored on a different user need is never blocked for disagreeing with it.
 *
 * Hook Type: PreToolUse
 * Matcher: Write
 * Scoped via an `if:` rule in hooks.json that matches Write calls under
 * projects/<id>/wardley-maps/ so it only runs for ARC Wardley Map artefacts.
 *
 * Scope vs sibling issue #435 (Mermaid block validator):
 *   This hook owns OWM/`wardley`-fenced blocks inside Wardley artefacts.
 *   General Mermaid validation belongs in #435's `mermaid-block-scanner`.
 *   The narrow `wardley-beta` bare-digit check below stays here because it
 *   targets a Wardley-template-specific rendering trap, not general Mermaid
 *   correctness; the two hooks therefore coexist without overlap.
 *
 * Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, ... }
 * Output (stdout): JSON { decision: "block", reason } on failure; empty on pass.
 * Exit code:       0 in all cases (block via JSON decision so the reason is fed
 *                  back to the model instead of producing a hard permission error).
 */

import { readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

import {
  parseInventoryRows,
  parseValueChainInventory,
  parseCitations,
  parseRegisterDocIds,
  checkProvenance,
} from './wardley-provenance.mjs';

const VALID_OWM_STYLES = new Set(['wardley', 'colour', 'plain', 'handwritten', 'dark']);
// OWM statement keywords that must NOT be treated as edges even if a line
// happens to contain `->` (e.g. in a `title` or `note` string).
const OWM_STATEMENT_KEYWORDS = new Set([
  'component', 'anchor', 'note', 'submap', 'market',
  'pipeline', 'evolve', 'title', 'style', 'size',
  'annotation', 'annotations', 'build', 'sourcing',
  'y-axis', 'inertia', 'url',
]);

function normalizeName(raw) {
  // Strip surrounding whitespace and surrounding double quotes.
  let s = raw.trim();
  if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) s = s.slice(1, -1);
  return s;
}

function evolutionToStage(evo) {
  const val = parseFloat(evo);
  if (val < 0.25) return 'Genesis';
  if (val < 0.50) return 'Custom';
  if (val < 0.75) return 'Product';
  return 'Commodity';
}

// --- Main ---
let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}
if (!raw || !raw.trim()) process.exit(0);

let data;
try {
  data = JSON.parse(raw);
} catch {
  process.exit(0);
}

const filePath = (data.tool_input || {}).file_path || '';
const content = (data.tool_input || {}).content || '';

if (!filePath || !content) process.exit(0);
if (!filePath.includes('/wardley-maps/')) process.exit(0);

const filename = basename(filePath);
const contentLines = content.split('\n');

const errors = [];
const stageErrors = [];
const owmErrors = [];
const danglingErrors = [];
const annotationErrors = [];
const pipelineRangeErrors = [];
const styleErrors = [];

// Regex for Component Inventory table rows: | Component | 0.XX | 0.XX | Stage | ... |
const tableRowRe = /^\|\s*([^|]+?)\s*\|\s*(\d+\.\d+)\s*\|\s*(\d+\.\d+)\s*\|\s*(Genesis|Custom|Product|Commodity)\s*\|/;

// --- Checks 1 & 2: Stage-evolution alignment and coordinate range (table) ---
const tableVis = {};
const tableEvo = {};

for (const line of contentLines) {
  const m = line.match(tableRowRe);
  if (!m) continue;
  const comp = m[1].trim();
  const vis = m[2];
  const evo = m[3];
  const stage = m[4];

  if (comp.includes('{') || comp === 'Component') continue;

  const expected = evolutionToStage(evo);
  if (stage !== expected) {
    stageErrors.push(`- '${comp}' has evolution ${evo} but Stage is '${stage}' (expected '${expected}')`);
  }

  const visF = parseFloat(vis);
  const evoF = parseFloat(evo);
  if (visF < 0.0 || visF > 1.0) {
    errors.push(`- '${comp}' has visibility ${vis} outside valid range [0.00, 1.00]`);
  }
  if (evoF < 0.0 || evoF > 1.0) {
    errors.push(`- '${comp}' has evolution ${evo} outside valid range [0.00, 1.00]`);
  }

  tableVis[comp] = vis;
  tableEvo[comp] = evo;
}

// --- Walk OWM/wardley block(s) ---
// Accepts both ```wardley and ```owm fence aliases.
// Single pass collects:
//   - declared: components/anchors/notes/submaps/markets (and pipelines)
//   - references: from evolve, pipeline, and `A -> B` edges (including `link`)
//   - annotation index usage (for reuse detection)
//   - style declarations (for whitelist check)
//   - pipeline coord brackets (for range check)
//   - component coord cross-reference vs the Component Inventory table

const owmVis = {};
const owmEvo = {};
const declared = new Map();           // normalized name -> {line, raw}
const annotationFirstLine = new Map(); // id (number) -> firstLine (1-indexed)
const references = [];                // {name, line, kind}

let inWardley = false;
const owmFenceOpenRe = /^\s*```(?:wardley|owm)\b/;
// Coord groups allow a leading `-` so out-of-range negative values still
// match the pattern (and get flagged by the range checks below) rather than
// silently slipping through.
const componentDeclRe = /^\s*(component|anchor|note|submap|market)\s+(.+?)\s+\[\s*(-?[0-9.]+)\s*,\s*(-?[0-9.]+)\s*\]/;
const pipelineRe = /^\s*pipeline\s+(.+?)\s+\[\s*(-?[0-9.]+)\s*,\s*(-?[0-9.]+)\s*\]/;
// Optional non-capturing `label ...` suffix — without it a labelled evolve
// line never lands in `references[]`, so an evolve pointing at an undeclared
// or typo'd component silently skips the undeclared-reference check.
const evolveRe = /^\s*evolve\s+(.+?)\s+[0-9.]+(?:\s+label\b.*)?$/;
const annotationRe = /^\s*annotation\s+(\d+)\s+\[/;
const styleRe = /^\s*style\s+(\S+)/;

for (let i = 0; i < contentLines.length; i++) {
  const line = contentLines[i];
  const ln = i + 1;

  if (owmFenceOpenRe.test(line)) {
    inWardley = true;
    continue;
  }
  if (inWardley && /^\s*```/.test(line)) {
    inWardley = false;
    continue;
  }
  if (!inWardley) continue;

  // Skip blank/comment-only lines fast
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('//')) continue;

  // --- Component / anchor / note / submap / market declarations ---
  const dm = line.match(componentDeclRe);
  if (dm) {
    const compName = normalizeName(dm[2]);
    const vis = dm[3];
    const evo = dm[4];

    // First-write wins for the declared set; later duplicates are tolerated
    // (OWM permits but discourages them; ignore vs. erroring keeps the
    // hook focused on the issue's failure classes).
    if (!declared.has(compName)) declared.set(compName, { line: ln, raw: dm[2] });

    if (dm[1] === 'component' || dm[1] === 'anchor') {
      owmVis[compName] = vis;
      owmEvo[compName] = evo;
    }

    const visF = parseFloat(vis);
    const evoF = parseFloat(evo);
    if (visF < 0.0 || visF > 1.0) {
      errors.push(`- '${compName}' OWM ${dm[1]} has visibility ${vis} outside valid range [0.00, 1.00] (line ${ln})`);
    }
    if (evoF < 0.0 || evoF > 1.0) {
      errors.push(`- '${compName}' OWM ${dm[1]} has evolution ${evo} outside valid range [0.00, 1.00] (line ${ln})`);
    }
    continue;
  }

  // --- Pipeline declarations ---
  // `pipeline NAME [v1, v2]` — NAME must reference an already-declared
  // component; the bracket pair carries evolution-axis endpoints, both of
  // which must sit inside the unit interval.
  const pm = line.match(pipelineRe);
  if (pm) {
    const pipeName = normalizeName(pm[1]);
    const p1 = parseFloat(pm[2]);
    const p2 = parseFloat(pm[3]);

    references.push({ name: pipeName, line: ln, kind: 'pipeline' });

    if (p1 < 0.0 || p1 > 1.0 || p2 < 0.0 || p2 > 1.0) {
      pipelineRangeErrors.push(
        `- Line ${ln}: pipeline '${pipeName}' has range [${pm[2]}, ${pm[3]}] — both endpoints must sit in [0.00, 1.00]`
      );
    }
    if (p1 >= p2) {
      pipelineRangeErrors.push(
        `- Line ${ln}: pipeline '${pipeName}' has range [${pm[2]}, ${pm[3]}] — first endpoint must be strictly less than the second`
      );
    }
    continue;
  }

  // --- evolve TARGET 0.45 ---
  const em = line.match(evolveRe);
  if (em) {
    references.push({ name: normalizeName(em[1]), line: ln, kind: 'evolve' });
    continue;
  }

  // --- Annotations ---
  const am = line.match(annotationRe);
  if (am) {
    const id = parseInt(am[1], 10);
    if (annotationFirstLine.has(id)) {
      annotationErrors.push(
        `- Line ${ln}: annotation index ${id} reused (first declared on line ${annotationFirstLine.get(id)}) — each annotation needs a unique numeric ID`
      );
    } else {
      annotationFirstLine.set(id, ln);
    }
    continue;
  }

  // --- Style name whitelist ---
  const sm = line.match(styleRe);
  if (sm) {
    if (!VALID_OWM_STYLES.has(sm[1])) {
      const valid = [...VALID_OWM_STYLES].sort().join(', ');
      styleErrors.push(
        `- Line ${ln}: unknown OWM style '${sm[1]}' — valid styles: ${valid}`
      );
    }
    continue;
  }

  // --- Edges: NAME -> NAME (and `link NAME -> NAME`) ---
  if (!line.includes('->')) continue;
  let edgeLine = trimmed;
  if (/^link\s+/.test(edgeLine)) edgeLine = edgeLine.replace(/^link\s+/, '');
  const firstWord = edgeLine.split(/\s+/)[0].toLowerCase();
  if (OWM_STATEMENT_KEYWORDS.has(firstWord)) continue;

  const parts = edgeLine.split('->');
  if (parts.length !== 2) continue;
  const left = normalizeName(parts[0]);
  const right = normalizeName(parts[1]);
  if (left) references.push({ name: left, line: ln, kind: 'edge' });
  if (right) references.push({ name: right, line: ln, kind: 'edge' });
}

// Cross-reference OWM coordinates vs table coordinates
for (const compName of Object.keys(owmVis)) {
  if (compName in tableVis) {
    const tVis = tableVis[compName];
    const tEvo = tableEvo[compName];
    const oVis = owmVis[compName];
    const oEvo = owmEvo[compName];

    if (oVis !== tVis || oEvo !== tEvo) {
      owmErrors.push(
        `- '${compName}' is [${oVis}, ${oEvo}] in OWM but [${tVis}, ${tEvo}] in Component Inventory`
      );
    }
  }
}

// --- Dangling-reference check ---
// For each reference, the target must have been declared somewhere in the
// OWM block. Reports first-seen line per (name, kind) to keep output short.
{
  const seen = new Set();
  for (const ref of references) {
    if (declared.has(ref.name)) continue;
    const key = `${ref.kind}:${ref.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    danglingErrors.push(
      `- Line ${ref.line}: ${ref.kind} references undeclared name '${ref.name}' — declare with \`component ${ref.name} [v, e]\` (or anchor/note/submap/market) earlier in the block`
    );
  }
}

// --- Check 5: Mermaid wardley-beta syntax (unquoted bare-digit tokens) ---
//
// Scoped to wardley-beta diagrams only — general Mermaid validation is the
// territory of issue #435 / `mermaid-block-scanner` (not this hook).

const mermaidErrors = [];
let inMermaidBlock = false;
let inMermaidWardley = false;

function extractNameZones(line) {
  let m = line.match(/^\s*component\s+(.+?)\s*\[/);
  if (m) return [m[1]];
  m = line.match(/^\s*anchor\s+(.+?)\s*\[/);
  if (m) return [m[1]];
  m = line.match(/^\s*evolve\s+(.+?)\s+[0-9.]+(?:\s+label\b.*)?$/);
  if (m) return [m[1]];
  m = line.match(/^\s*pipeline\s+(.+?)(?:\s*\[|\s*$)/);
  if (m) return [m[1]];
  if (line.includes('->') && !/^\s*(?:component|anchor|evolve|pipeline|note|annotation|annotations|title|size|style)\b/.test(line)) {
    const parts = line.split('->');
    if (parts.length === 2) return [parts[0], parts[1]];
  }
  return [];
}

function bareDigitWords(nameZone) {
  const stripped = nameZone
    .replace(/"[^"]*"/g, '')
    .replace(/\([^)]*\)/g, '')
    .trim();
  if (!stripped) return [];
  return stripped.split(/\s+/).filter((w) => /^\d+$/.test(w));
}

for (let i = 0; i < contentLines.length; i++) {
  const line = contentLines[i];
  const trimmed = line.trim();

  if (/^```mermaid\b/.test(trimmed)) {
    inMermaidBlock = true;
    inMermaidWardley = false;
    continue;
  }
  if (inMermaidBlock && /^```/.test(trimmed)) {
    inMermaidBlock = false;
    inMermaidWardley = false;
    continue;
  }
  if (!inMermaidBlock) continue;

  if (!inMermaidWardley) {
    if (/^wardley-beta\b/.test(trimmed)) inMermaidWardley = true;
    continue;
  }

  for (const zone of extractNameZones(line)) {
    const bad = bareDigitWords(zone);
    if (bad.length > 0) {
      mermaidErrors.push(
        `- Line ${i + 1}: unquoted name '${zone.trim()}' contains bare numeric word(s) '${bad.join("', '")}' — wrap the whole name in double quotes everywhere it appears (declaration, both sides of '->', 'evolve' targets, 'pipeline' parents)`
      );
    }
  }
}

// --- Checks 6 & 7: Component provenance and the value-chain visibility join ---
//
// The math checks above prove a map is consistent with itself; they cannot
// tell an invented component from a real one. These two read the project the
// map sits in, so a Source cell has to name something that is actually there.
// Every filesystem read is best-effort: a project we cannot walk yields an
// empty artefact set, which makes both checks no-ops rather than blockers.

const provenanceErrors = [];
const visibilityErrors = [];

/** Files under `dir`, at most `maxDepth` levels down. */
function walkFiles(dir, maxDepth = 3) {
  const found = [];
  if (maxDepth < 0) return found;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      found.push(...walkFiles(join(dir, entry.name), maxDepth - 1));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

// `.../projects/<id>/wardley-maps/<file>.md` — the project is the grandparent.
const mapsDir = dirname(filePath);
const projectDir = dirname(mapsDir);

// Doc IDs and doc-type codes are read from artefact filenames, which
// `validate-arc-filename.mjs` already holds to the ARC-<nnn>-<TYPE>-v<n>.<n>
// shape, so a filename is a reliable index of what the project holds.
const ARTEFACT_NAME = /^(ARC-\d{3}-([A-Z][A-Z0-9]*)(?:-\d+)?-v(\d+)\.(\d+))\.md$/;
const projectDocIds = new Set();
const projectDocTypes = new Set();
let valueChainDocId = null;
let valueChainPath = null;
let valueChainVersion = -1;

for (const file of walkFiles(projectDir)) {
  const match = basename(file).match(ARTEFACT_NAME);
  if (!match) continue;
  projectDocIds.add(match[1].toUpperCase());
  projectDocTypes.add(match[2].toUpperCase());
  // A project should hold one current value chain; where several versions
  // sit side by side the highest wins, compared numerically so v10.0 beats
  // v9.0 (a filename sort would not).
  if (match[2].toUpperCase() !== 'WVCH') continue;
  const version = parseInt(match[3], 10) * 1000 + parseInt(match[4], 10);
  if (version > valueChainVersion) {
    valueChainVersion = version;
    valueChainDocId = match[1].toUpperCase();
    valueChainPath = file;
  }
}

// The map being written may be new — count its own ID as present so a
// self-reference is never reported as a missing document.
const selfMatch = filename.match(ARTEFACT_NAME);
if (selfMatch) {
  projectDocIds.add(selfMatch[1].toUpperCase());
  projectDocTypes.add(selfMatch[2].toUpperCase());
}

let valueChain = new Map();
if (valueChainPath) {
  try {
    valueChain = parseValueChainInventory(readFileSync(valueChainPath, 'utf8'));
  } catch {
    valueChain = new Map();
  }
}

// A fault in the provenance rules must never block a write that the math
// checks accept: an unreadable project or an unparseable table degrades to
// no findings, exactly as an absent Source column does.
try {
  const { rows } = parseInventoryRows(contentLines);
  const result = checkProvenance({
    rows,
    valueChain,
    valueChainDocId,
    citations: parseCitations(contentLines),
    registerDocIds: parseRegisterDocIds(contentLines),
    projectDocIds,
    projectDocTypes,
  });
  provenanceErrors.push(...result.provenanceErrors);
  visibilityErrors.push(...result.visibilityErrors);
} catch {
  provenanceErrors.length = 0;
  visibilityErrors.length = 0;
}

// --- Build error report ---
const reportParts = [];

if (stageErrors.length > 0) {
  reportParts.push('**Stage-Evolution Mismatches:**\n' + stageErrors.join('\n'));
}
if (errors.length > 0) {
  reportParts.push('**Coordinate Range Errors:**\n' + errors.join('\n'));
}
if (owmErrors.length > 0) {
  reportParts.push('**OWM Coordinate Mismatches:**\n' + owmErrors.join('\n'));
}
if (danglingErrors.length > 0) {
  reportParts.push('**Dangling OWM References:**\n' + danglingErrors.join('\n'));
}
if (annotationErrors.length > 0) {
  reportParts.push('**Annotation Index Reuse:**\n' + annotationErrors.join('\n'));
}
if (pipelineRangeErrors.length > 0) {
  reportParts.push('**Pipeline Range Errors:**\n' + pipelineRangeErrors.join('\n'));
}
if (styleErrors.length > 0) {
  reportParts.push('**Unknown OWM Style:**\n' + styleErrors.join('\n'));
}
if (mermaidErrors.length > 0) {
  reportParts.push('**Mermaid wardley-beta Syntax Errors (bare numeric tokens break rendering):**\n' + mermaidErrors.join('\n'));
}
if (provenanceErrors.length > 0) {
  reportParts.push('**Component Provenance (a component must cite where it came from):**\n' + provenanceErrors.join('\n'));
}
if (visibilityErrors.length > 0) {
  reportParts.push('**Value-Chain Visibility Mismatches:**\n' + visibilityErrors.join('\n'));
}

if (reportParts.length > 0) {
  const report = reportParts.join('\n\n');
  const reason = `Wardley Map validation errors in ${filename}:\n\n${report}\n\nFix these errors and re-issue the Write.`;
  console.log(JSON.stringify({ decision: 'block', reason }));
}

process.exit(0);
