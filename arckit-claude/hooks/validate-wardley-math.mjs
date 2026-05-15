#!/usr/bin/env node
/**
 * ArcKit PreToolUse (Write) Hook — Wardley Map Math Validation
 *
 * Validates a Wardley Map document about to be written for consistency:
 *   1. Stage-evolution alignment (Component Inventory tables)
 *   2. Coordinate range validation (all values in [0.00, 1.00])
 *   3. OWM syntax consistency (wardley/owm code block vs Component Inventory)
 *   4. Mermaid wardley-beta syntax (unquoted bare-digit tokens break rendering)
 *
 * Hook Type: PreToolUse
 * Matcher: Write
 * Scoped via an `if:` rule in hooks.json that matches Write calls under
 * projects/<id>/wardley-maps/ so it only runs for ARC Wardley Map artefacts.
 *
 * Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, ... }
 * Output (stdout): JSON { decision: "block", reason } on failure; empty on pass.
 * Exit code:       0 in all cases (block via JSON decision so the reason is fed
 *                  back to the model instead of producing a hard permission error).
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

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

// Defense-in-depth: the `if:` rule in hooks.json already narrows this,
// but skip cleanly if either field is empty or the path isn't a Wardley artefact.
if (!filePath || !content) process.exit(0);
if (!filePath.includes('/wardley-maps/')) process.exit(0);

const filename = basename(filePath);
const contentLines = content.split('\n');

const errors = [];
const stageErrors = [];
const owmErrors = [];

// Regex for table rows: | Component | 0.XX | 0.XX | Stage | ... |
const tableRowRe = /^\|\s*([^|]+?)\s*\|\s*(\d+\.\d+)\s*\|\s*(\d+\.\d+)\s*\|\s*(Genesis|Custom|Product|Commodity)\s*\|/;

// --- Check 1 & 2: Stage-evolution alignment and coordinate range ---
const tableVis = {};
const tableEvo = {};

for (const line of contentLines) {
  const m = line.match(tableRowRe);
  if (!m) continue;
  const comp = m[1].trim();
  const vis = m[2];
  const evo = m[3];
  const stage = m[4];

  // Skip template placeholder rows
  if (comp.includes('{') || comp === 'Component') continue;

  // Check stage-evolution alignment
  const expected = evolutionToStage(evo);
  if (stage !== expected) {
    stageErrors.push(`- '${comp}' has evolution ${evo} but Stage is '${stage}' (expected '${expected}')`);
  }

  // Check coordinate range
  const visF = parseFloat(vis);
  const evoF = parseFloat(evo);
  if (visF < 0.0 || visF > 1.0) {
    errors.push(`- '${comp}' has visibility ${vis} outside valid range [0.00, 1.00]`);
  }
  if (evoF < 0.0 || evoF > 1.0) {
    errors.push(`- '${comp}' has evolution ${evo} outside valid range [0.00, 1.00]`);
  }

  // Store for cross-reference
  tableVis[comp] = vis;
  tableEvo[comp] = evo;
}

// --- Check 3: OWM syntax consistency ---
// Accepts both ```wardley and ```owm fence aliases (OnlineWardleyMaps uses both).
const owmVis = {};
const owmEvo = {};
let inWardley = false;
const componentRe = /^\s*component\s+(.+?)\s+\[\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]/;
const owmFenceOpenRe = /^\s*```(?:wardley|owm)\b/;

for (const line of contentLines) {
  if (owmFenceOpenRe.test(line)) {
    inWardley = true;
    continue;
  }
  if (inWardley && /^\s*```/.test(line)) {
    inWardley = false;
    continue;
  }
  if (inWardley) {
    const cm = line.match(componentRe);
    if (cm) {
      const compName = cm[1].trim();
      owmVis[compName] = cm[2];
      owmEvo[compName] = cm[3];

      // Also enforce OWM coordinate range — the plane is unit square [0, 1].
      const oVisF = parseFloat(cm[2]);
      const oEvoF = parseFloat(cm[3]);
      if (oVisF < 0.0 || oVisF > 1.0) {
        errors.push(`- '${compName}' OWM block has visibility ${cm[2]} outside valid range [0.00, 1.00]`);
      }
      if (oEvoF < 0.0 || oEvoF > 1.0) {
        errors.push(`- '${compName}' OWM block has evolution ${cm[3]} outside valid range [0.00, 1.00]`);
      }
    }
  }
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

// --- Check 4: Mermaid wardley-beta syntax (unquoted bare-digit tokens) ---
//
// The wardley-beta parser tokenises bare numeric words (like `2031`, `27001`)
// as numeric literals, which breaks rendering with errors such as:
//   "Parse error on line N, column M: Expecting token of type '[' but found '2031'."
// Any name containing a whitespace-separated pure-digit word MUST be quoted
// everywhere it appears — component/anchor declarations, both sides of `->`
// edges, `evolve` targets, and `pipeline` parents.

const mermaidErrors = [];
let inMermaidBlock = false;
let inMermaidWardley = false;

function extractNameZones(line) {
  // component NAME [v, e] (decorators)
  let m = line.match(/^\s*component\s+(.+?)\s*\[/);
  if (m) return [m[1]];
  // anchor NAME [v, e]
  m = line.match(/^\s*anchor\s+(.+?)\s*\[/);
  if (m) return [m[1]];
  // evolve NAME 0.45 (trailing number is the target evolution coord)
  m = line.match(/^\s*evolve\s+(.+?)\s+[0-9.]+\s*$/);
  if (m) return [m[1]];
  // pipeline NAME [v1, v2]? (brackets optional)
  m = line.match(/^\s*pipeline\s+(.+?)(?:\s*\[|\s*$)/);
  if (m) return [m[1]];
  // edge: NAME -> NAME (single arrow, two zones)
  if (line.includes('->') && !/^\s*(?:component|anchor|evolve|pipeline|note|annotation|annotations|title|size|style)\b/.test(line)) {
    const parts = line.split('->');
    if (parts.length === 2) return [parts[0], parts[1]];
  }
  return [];
}

function bareDigitWords(nameZone) {
  // Strip quoted substrings and decorator groups so we only inspect unquoted words
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
if (mermaidErrors.length > 0) {
  reportParts.push('**Mermaid wardley-beta Syntax Errors (bare numeric tokens break rendering):**\n' + mermaidErrors.join('\n'));
}

if (reportParts.length > 0) {
  const report = reportParts.join('\n\n');
  const reason = `Wardley Map validation errors in ${filename}:\n\n${report}\n\nFix these errors and re-issue the Write.`;
  console.log(JSON.stringify({ decision: 'block', reason }));
}

process.exit(0);
