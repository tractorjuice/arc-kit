#!/usr/bin/env node
/**
 * Real-World Wardley Map Validator
 *
 * Converts OWM (OnlineWardleyMaps) syntax maps from swardley/WARDLEY-MAP-REPOSITORY
 * to Mermaid wardley-beta format, then validates them with mermaid.parse().
 *
 * Usage: node test-real-maps.mjs [--limit N] [--save-converted] [--verbose]
 *
 * Options:
 *   --limit N          Test only the first N maps (default: 100)
 *   --save-converted   Save converted .mmd files to output/converted/
 *   --verbose          Show conversion details and full errors
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const owmDir = join(__dirname, 'owm-maps');
const convertedDir = join(__dirname, 'output', 'converted');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

// --- Parse CLI args ---
const args = process.argv.slice(2);
const limit = (() => {
  const idx = args.indexOf('--limit');
  return idx >= 0 && args[idx + 1] ? parseInt(args[idx + 1], 10) : 100;
})();
const saveConverted = args.includes('--save-converted');
const verbose = args.includes('--verbose');

// --- Find all OWM map files ---
function findMapFiles(dir) {
  const results = [];

  function walk(d) {
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        walk(full);
      } else if (entry.isFile()) {
        // Include .owm, .own, .map, and extensionless files
        const name = entry.name;
        if (name === 'LICENSE' || name === '.DS_Store' || name === 'README.md') continue;
        if (/\.(svg|png|jpg|jpeg|gif|md|txt)$/i.test(name)) continue;

        // Check if file content looks like an OWM map (has component or title)
        try {
          const content = readFileSync(full, 'utf8');
          if (content.includes('component ') || content.includes('title ')) {
            results.push(full);
          }
        } catch {
          // Skip unreadable files
        }
      }
    }
  }

  walk(dir);
  return results.sort();
}

// --- OWM to Mermaid Converter ---

// Characters that require quoting in the Mermaid wardley-beta grammar
// Includes hyphen (-) because it triggers arrow parsing (->)
const NEEDS_QUOTING = /[&/+?'.<>=:%#(){};!@$^~`\\|[\]\-]/;
// Keywords that shadow grammar terminals and need quoting
const KEYWORDS = new Set([
  'market', 'build', 'buy', 'outsource', 'inertia', 'pipeline', 'evolve',
  'anchor', 'component', 'note', 'title', 'size', 'evolution', 'annotations',
  'annotation', 'accelerator', 'deaccelerator', 'label',
]);

function quoteName(name) {
  if (!name) return name;
  // Already quoted
  if (name.startsWith('"') && name.endsWith('"')) return name;
  // Always quote — safest approach to avoid keyword collisions
  // (e.g., "labelling" starts with keyword "label", "market" is a keyword)
  return `"${name.replace(/"/g, "'")}"`;
}

function owmToMermaid(owmContent, filename) {
  const lines = owmContent.split('\n');
  const mermaidLines = ['wardley-beta'];
  let hasTitleLine = false;

  // ── PASS 1: Collect metadata for pipeline child detection ──
  const sourcing = {};       // { normalizedName: 'build'|'buy'|'outsource' }
  const compCoords = {};     // { name: { vis, evo } }
  const pipelineRanges = {}; // { name: { min, max } }

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('//')) continue;

    // Sourcing markers
    const srcMatch = trimmed.match(/^(build|buy|outsource)\s+(.+)/i);
    if (srcMatch) {
      sourcing[srcMatch[2].trim().toLowerCase()] = srcMatch[1].toLowerCase();
    }

    // Component coordinates
    const compMatch = trimmed.match(/^component\s+(.+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/);
    if (compMatch) {
      compCoords[compMatch[1].trim()] = {
        vis: parseFloat(compMatch[2]),
        evo: parseFloat(compMatch[3]),
      };
    }

    // Pipeline range declarations
    const pipeMatch = trimmed.match(/^pipeline\s+(.+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]\s*$/);
    if (pipeMatch) {
      pipelineRanges[pipeMatch[1].trim()] = {
        min: parseFloat(pipeMatch[2]),
        max: parseFloat(pipeMatch[3]),
      };
    }
  }

  // ── PASS 1b: Detect pipeline children ──
  // A child has visibility within ±0.05 of parent AND evolution within [min, max]
  const pipelineChildren = {};  // { parentName: [{ name, evo }] }
  const isPipelineChild = new Set(); // names consumed as children

  for (const [pipeName, range] of Object.entries(pipelineRanges)) {
    const parent = compCoords[pipeName];
    if (!parent) continue;

    const children = [];
    for (const [cName, cCoord] of Object.entries(compCoords)) {
      if (cName === pipeName) continue;
      if (isPipelineChild.has(cName)) continue; // already claimed
      if (Math.abs(cCoord.vis - parent.vis) <= 0.05 &&
          cCoord.evo >= range.min - 0.01 && cCoord.evo <= range.max + 0.01) {
        children.push({ name: cName, evo: cCoord.evo });
      }
    }

    if (children.length > 0) {
      // Sort children by evolution
      children.sort((a, b) => a.evo - b.evo);
      pipelineChildren[pipeName] = children;
      for (const c of children) isPipelineChild.add(c.name);
    }
  }

  // ── PASS 2: Convert lines ──
  let inPipelineBlock = false;
  let pendingPipelineName = null;

  for (let i = 0; i < lines.length; i++) {
    let trimmed = lines[i].trim();

    // Skip empty lines (keep for readability)
    if (!trimmed) {
      mermaidLines.push('');
      continue;
    }

    // Skip pure comment lines
    if (trimmed.startsWith('//')) continue;

    // Strip inline comments (but not URLs with ://)
    const commentMatch = trimmed.match(/^(.+?)\s+\/\/(?!\/)(.*)$/);
    if (commentMatch && !commentMatch[1].includes('://')) {
      trimmed = commentMatch[1].trim();
    }
    if (!trimmed) continue;

    // Skip 'style wardley'
    if (/^style\s+wardley\s*$/i.test(trimmed)) continue;

    // Skip standalone build/buy/outsource lines
    if (/^(build|buy|outsource)\s+/i.test(trimmed)) continue;

    // Skip directives Mermaid doesn't support
    if (/^[xy]-axis\s+/i.test(trimmed)) continue;
    if (/^market\s+/i.test(trimmed) && !trimmed.startsWith('component')) continue;
    if (/^(ecosystem|submap|url|pioneer|settler|townplanner)\s+/i.test(trimmed)) continue;

    // Title
    if (/^title\s+/i.test(trimmed)) {
      mermaidLines.push(trimmed);
      mermaidLines.push('size [1100, 800]');
      hasTitleLine = true;
      continue;
    }

    // Evolution labels
    if (/^evolution\s+/i.test(trimmed)) {
      mermaidLines.push(trimmed);
      continue;
    }

    // Anchor — quote the name
    if (/^anchor\s+/i.test(trimmed)) {
      const anchorMatch = trimmed.match(/^anchor\s+(.+?)\s*(\[[\d.,\s]+\])/);
      if (anchorMatch) {
        const qName = quoteName(anchorMatch[1].trim());
        mermaidLines.push(`anchor ${qName} ${anchorMatch[2]}`);
      }
      continue;
    }

    // Pipeline with range [min, max] — skip (handled via pipelineChildren injection)
    if (/^pipeline\s+.+\[\s*[\d.]+\s*,\s*[\d.]+\s*\]\s*$/.test(trimmed)) {
      continue;
    }

    // Pipeline block start (OWM inline {} style)
    if (/^pipeline\s+/i.test(trimmed) && !trimmed.match(/\[[\d]/)) {
      const nameMatch = trimmed.match(/^pipeline\s+(.+?)(?:\s*\{)?\s*$/i);
      if (nameMatch) {
        const pName = quoteName(nameMatch[1].trim());
        if (trimmed.includes('{')) {
          mermaidLines.push(`pipeline ${pName} {`);
          inPipelineBlock = true;
        } else {
          pendingPipelineName = pName;
        }
      }
      continue;
    }

    // Opening brace for pending pipeline
    if (pendingPipelineName && trimmed === '{') {
      mermaidLines.push(`pipeline ${pendingPipelineName} {`);
      inPipelineBlock = true;
      pendingPipelineName = null;
      continue;
    }

    // Closing brace for pipeline block
    if ((inPipelineBlock || pendingPipelineName) && trimmed === '}') {
      if (pendingPipelineName) {
        pendingPipelineName = null;
      } else {
        mermaidLines.push('}');
        inPipelineBlock = false;
      }
      continue;
    }

    // Component
    if (/^component\s+/i.test(trimmed)) {
      const compMatch = trimmed.match(/^component\s+(.+?)\s*(\[[\d.,\s]+\])/);
      if (!compMatch) continue; // Malformed — skip

      const compName = compMatch[1].trim();
      const coords = compMatch[2];
      const hasInertia = /\binertia\s*$/i.test(trimmed);

      // Skip components consumed as pipeline children (they'll be emitted in the pipeline block)
      if (isPipelineChild.has(compName)) continue;

      const qName = quoteName(compName);

      // Build component line
      let line;
      if (inPipelineBlock) {
        const innerCoord = coords.replace(/[\[\]]/g, '').trim();
        line = `  component ${qName.startsWith('"') ? qName : `"${compName}"`} [${innerCoord}]`;
      } else {
        line = `component ${qName} ${coords}`;
      }

      // Decorators
      const decorators = [];
      if (sourcing[compName.toLowerCase()]) {
        decorators.push(`(${sourcing[compName.toLowerCase()]})`);
      }
      if (hasInertia) decorators.push('(inertia)');
      if (decorators.length > 0) line += ' ' + decorators.join(' ');

      mermaidLines.push(line);

      // If this component is a pipeline parent, inject the pipeline block
      if (pipelineChildren[compName] && !inPipelineBlock) {
        mermaidLines.push(`pipeline ${qName} {`);
        for (const child of pipelineChildren[compName]) {
          mermaidLines.push(`  component ${quoteName(child.name)} [${child.evo}]`);
        }
        mermaidLines.push('}');
      }

      continue;
    }

    // Evolve — strip label, quote name
    if (/^evolve\s+/i.test(trimmed)) {
      const evolveMatch = trimmed.match(/^evolve\s+(.+?)\s+([\d.]+)/i);
      if (evolveMatch) {
        const eName = quoteName(evolveMatch[1].trim());
        mermaidLines.push(`evolve ${eName} ${evolveMatch[2]}`);
      }
      continue;
    }

    // Note — ensure text is quoted
    if (/^note\s+/i.test(trimmed)) {
      // Match the LAST [number, number] as coordinates (note text may contain brackets)
      const noteMatch = trimmed.match(/^note\s+(.+)\s+(\[[\d.,\s]+\])\s*$/i);
      if (noteMatch) {
        let noteText = noteMatch[1].trim();
        const noteCoord = noteMatch[2];
        // Strip any label offset from the text
        const labelIdx = noteText.lastIndexOf('] label ');
        if (labelIdx > 0) {
          noteText = noteText.substring(0, labelIdx + 1);
        }
        // Ensure quotes — strip any existing quotes first to normalize
        noteText = noteText.replace(/^"/, '').replace(/"$/, '');
        noteText = `"${noteText.replace(/"/g, "'")}"`;
        mermaidLines.push(`note ${noteText} ${noteCoord}`);
      }
      continue;
    }

    // Annotation index position: annotations [x, y]
    if (/^annotations\s+\[/i.test(trimmed)) {
      mermaidLines.push(trimmed);
      continue;
    }

    // Numbered annotation: annotation N [x,y] text → annotation N,[x,y] "text"
    if (/^annotation\s+\d/i.test(trimmed)) {
      const annoMatch = trimmed.match(/^annotation\s+(\d+)\s*,?\s*(\[[\d.,\s]+\])\s*(.*)/i);
      if (annoMatch) {
        const num = annoMatch[1];
        const coords = annoMatch[2];
        let text = annoMatch[3].trim();
        if (text && !text.startsWith('"')) {
          text = `"${text.replace(/"/g, "'")}"`;
        }
        if (text) {
          mermaidLines.push(`annotation ${num},${coords} ${text}`);
        } else {
          mermaidLines.push(`annotation ${num},${coords}`);
        }
      }
      continue;
    }

    // Links: A->B or A -> B [; annotation]
    if (trimmed.includes('->') && !/^(evolve|component|pipeline|anchor|note)\s/i.test(trimmed)) {
      let linkLine = trimmed;

      // Extract annotation (after ;)
      let annotation = '';
      const semiIdx = linkLine.indexOf(';');
      if (semiIdx > 0) {
        annotation = linkLine.substring(semiIdx);
        linkLine = linkLine.substring(0, semiIdx).trim();
      }

      // Split on -> (first occurrence only for simple A->B)
      const arrowIdx = linkLine.indexOf('->');
      if (arrowIdx > 0) {
        let left = linkLine.substring(0, arrowIdx).trim();
        let right = linkLine.substring(arrowIdx + 2).trim();

        // Quote both sides if they contain special chars
        left = quoteName(left);
        right = quoteName(right);

        linkLine = `${left} -> ${right}`;
      }

      if (annotation) {
        linkLine += annotation;
      }

      mermaidLines.push(linkLine);
      continue;
    }

    // Skip unrecognized lines silently (OWM-specific directives)
  }

  // If no title was found, add a default
  if (!hasTitleLine) {
    const defaultTitle = basename(filename).replace(/\.\w+$/, '').replace(/[-_]/g, ' ');
    mermaidLines.splice(1, 0, `title ${defaultTitle}`, 'size [1100, 800]');
  }

  // Clean up: remove consecutive empty lines (max 1)
  const cleaned = [];
  let lastEmpty = false;
  for (const line of mermaidLines) {
    if (line === '') {
      if (!lastEmpty) cleaned.push(line);
      lastEmpty = true;
    } else {
      cleaned.push(line);
      lastEmpty = false;
    }
  }

  return cleaned.join('\n');
}

// --- Main ---
async function main() {
  console.log(`${BOLD}Real-World Wardley Map Validation${RESET}`);
  console.log(`${'='.repeat(55)}`);

  // Set up DOM for mermaid (must happen before importing mermaid)
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  globalThis.document = dom.window.document;
  globalThis.window = dom.window;

  const { default: DOMPurify } = await import('dompurify');
  globalThis.DOMPurify = DOMPurify;

  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({ startOnLoad: false, suppressErrors: false });

  // Find map files
  console.log(`\nScanning ${owmDir} for OWM map files...`);
  const allFiles = findMapFiles(owmDir);
  console.log(`Found ${allFiles.length} map files`);

  const testFiles = allFiles.slice(0, limit);
  console.log(`Testing ${testFiles.length} maps (limit: ${limit})\n`);

  if (saveConverted) {
    mkdirSync(convertedDir, { recursive: true });
  }

  let converted = 0;
  let parsed = 0;
  let parseFailed = 0;
  let convertFailed = 0;
  const failures = [];
  const successes = [];

  for (const filePath of testFiles) {
    const relPath = relative(owmDir, filePath);
    const name = relPath.replace(/[/\\]/g, '--').replace(/\.\w+$/, '') || relPath;

    // Read OWM content
    let owmContent;
    try {
      owmContent = readFileSync(filePath, 'utf8');
    } catch (err) {
      console.log(`  ${RED}READ_ERR${RESET}  ${name}`);
      convertFailed++;
      continue;
    }

    // Skip very short files (likely not real maps)
    if (owmContent.trim().length < 30) {
      if (verbose) console.log(`  ${DIM}SKIP${RESET}     ${name} (too short)`);
      continue;
    }

    // Convert OWM -> Mermaid
    let mermaidContent;
    try {
      mermaidContent = owmToMermaid(owmContent, filePath);
      converted++;
    } catch (err) {
      console.log(`  ${RED}CONV_ERR${RESET}  ${name}`);
      if (verbose) console.log(`            ${err.message}`);
      convertFailed++;
      continue;
    }

    // Save converted file if requested
    if (saveConverted) {
      const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
      writeFileSync(join(convertedDir, `${safeName}.mmd`), mermaidContent);
    }

    // Parse with Mermaid
    try {
      await mermaid.parse(mermaidContent);
      console.log(`  ${GREEN}PASS${RESET}  ${name}`);
      parsed++;
      successes.push(name);
    } catch (err) {
      const msg = err.message || String(err);
      const firstLine = msg.split('\n').find(l => l.includes('error') || l.includes('Error') || l.includes('Expect')) || msg.split('\n')[0];
      console.log(`  ${RED}FAIL${RESET}  ${name}`);
      console.log(`        ${DIM}${firstLine.substring(0, 120)}${RESET}`);
      parseFailed++;
      failures.push({ name, error: msg, mermaidContent });
    }
  }

  // --- Summary ---
  console.log(`\n${'='.repeat(55)}`);
  console.log(`${BOLD}Results${RESET}`);
  console.log(`  Maps found:     ${allFiles.length}`);
  console.log(`  Maps tested:    ${testFiles.length}`);
  console.log(`  Converted:      ${converted}`);
  console.log(`  ${GREEN}Parse PASS:   ${parsed}${RESET}`);
  if (parseFailed > 0) {
    console.log(`  ${RED}Parse FAIL:   ${parseFailed}${RESET}`);
  }
  if (convertFailed > 0) {
    console.log(`  ${YELLOW}Convert ERR:  ${convertFailed}${RESET}`);
  }
  const passRate = converted > 0 ? ((parsed / converted) * 100).toFixed(1) : 0;
  console.log(`\n  ${BOLD}Pass rate: ${passRate}% (${parsed}/${converted})${RESET}`);

  // Show failure details
  if (failures.length > 0 && verbose) {
    console.log(`\n${RED}${'='.repeat(55)}${RESET}`);
    console.log(`${RED}${BOLD}Failure Details${RESET}`);
    for (const f of failures) {
      console.log(`\n${RED}--- ${f.name} ---${RESET}`);
      console.log(f.error.substring(0, 500));
      if (f.mermaidContent) {
        console.log(`\n${DIM}Converted content (first 20 lines):${RESET}`);
        console.log(f.mermaidContent.split('\n').slice(0, 20).join('\n'));
      }
    }
  } else if (failures.length > 0) {
    console.log(`\n${YELLOW}Run with --verbose to see full failure details${RESET}`);
    console.log(`${YELLOW}Run with --save-converted to save .mmd files for inspection${RESET}`);
  }

  process.exit(parseFailed > 0 ? 1 : 0);
}

main();
