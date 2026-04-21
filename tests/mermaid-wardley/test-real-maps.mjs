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

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { findMapFiles, owmToMermaid } from './convert.mjs';

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
