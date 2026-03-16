#!/usr/bin/env node
/**
 * ArcKit Wardley Map Math Validation
 *
 * Validates a generated Wardley Map document for consistency:
 *   1. Stage-evolution alignment (Component Inventory tables)
 *   2. Coordinate range validation (all values in [0.00, 1.00])
 *   3. OWM syntax consistency (wardley code block vs Component Inventory)
 *
 * Input (stdin):  JSON { stop_hook_active, ... }
 * Output (stdout): JSON with "decision": "block" and "reason" on failure, or empty on success
 * Exit codes:      0 always (block via JSON decision, not exit code)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}
function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
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

// If this is already a re-fire after a block, allow stop to prevent infinite loops
if (data.stop_hook_active) process.exit(0);

// --- Find most recently modified WARD file ---
let wardFile = null;
let newestMtime = 0;
const now = Date.now();
const maxAge = 300000; // 5 minutes in ms

// Walk projects/*/wardley-maps/ looking for ARC-*-WARD-*.md
const projectsDir = resolve('projects');
if (isDir(projectsDir)) {
  const projectDirs = readdirSync(projectsDir).sort();
  for (const pd of projectDirs) {
    const wmDir = join(projectsDir, pd, 'wardley-maps');
    if (!isDir(wmDir)) continue;
    for (const f of readdirSync(wmDir)) {
      const fp = join(wmDir, f);
      if (!isFile(fp)) continue;
      if (!f.startsWith('ARC-') || !(f.includes('-WARD-') || f.includes('-WVCH-')) || !f.endsWith('.md')) continue;
      try {
        const mt = statSync(fp).mtimeMs;
        const age = now - mt;
        if (age <= maxAge && mt > newestMtime) {
          newestMtime = mt;
          wardFile = fp;
        }
      } catch { /* skip */ }
    }
  }
}

// No recent wardley file found - not a wardley run, allow stop
if (!wardFile) process.exit(0);

const filename = wardFile.split('/').pop();
const content = readFileSync(wardFile, 'utf8');
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
const owmVis = {};
const owmEvo = {};
let inWardley = false;
const componentRe = /^\s*component\s+(.+?)\s+\[\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]/;

for (const line of contentLines) {
  if (/^\s*```wardley/.test(line)) {
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

if (reportParts.length > 0) {
  const report = reportParts.join('\n\n');
  const reason = `Wardley Map validation errors in ${filename}:\n\n${report}\n\nFix these errors in the document, then stop again.`;
  console.log(JSON.stringify({ decision: 'block', reason }));
}

process.exit(0);
