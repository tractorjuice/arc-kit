#!/usr/bin/env node
/**
 * Mermaid Wardley-Beta Syntax Validator
 *
 * Imports mermaid, iterates over all .mmd fixtures, and calls mermaid.parse()
 * on each one. Reports pass/fail with error details.
 *
 * Usage: node validate.mjs
 * Exit code: 0 if all pass, 1 if any fail
 *
 * Note: mermaid requires a browser-like DOM environment. We set up a jsdom
 * shim before importing mermaid via dynamic import() so the shim is in place
 * when mermaid's module-level code runs. Static `import` is hoisted and would
 * execute before the shim, so dynamic import is required here.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, 'fixtures');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

async function main() {
  // Set up jsdom shim BEFORE importing mermaid.
  // mermaid calls DOMPurify.addHook() and window.addEventListener() at
  // module load time, so the DOM must exist when the module is first imported.
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  globalThis.document = dom.window.document;
  globalThis.window = dom.window;

  // DOMPurify also needs window set before it initialises.
  const { default: DOMPurify } = await import('dompurify');
  globalThis.DOMPurify = DOMPurify;

  // Now it is safe to import mermaid.
  const { default: mermaid } = await import('mermaid');

  // Initialize mermaid (required before parse)
  mermaid.initialize({
    startOnLoad: false,
    suppressErrors: false,
  });

  // Collect .mmd files sorted by name
  const files = readdirSync(fixturesDir)
    .filter(f => f.endsWith('.mmd'))
    .sort();

  if (files.length === 0) {
    console.log(`${YELLOW}No .mmd fixtures found in ${fixturesDir}${RESET}`);
    process.exit(0);
  }

  console.log(`${BOLD}Mermaid Wardley-Beta Syntax Validation${RESET}`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Found ${files.length} fixtures\n`);

  let passed = 0;
  let failed = 0;
  const failures = [];

  for (const file of files) {
    const filePath = join(fixturesDir, file);
    const content = readFileSync(filePath, 'utf8');
    const name = basename(file, '.mmd');

    try {
      await mermaid.parse(content);
      console.log(`  ${GREEN}PASS${RESET}  ${name}`);
      passed++;
    } catch (err) {
      console.log(`  ${RED}FAIL${RESET}  ${name}`);
      const msg = err.message || String(err);
      // Extract line info if available
      const lineMatch = msg.match(/line\s*(\d+)/i);
      if (lineMatch) {
        console.log(`        Line ${lineMatch[1]}: ${msg.split('\n')[0]}`);
      } else {
        console.log(`        ${msg.split('\n')[0]}`);
      }
      failed++;
      failures.push({ name, error: msg });
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`${BOLD}Results: ${passed}/${files.length} passed${RESET}`);
  if (failed > 0) {
    console.log(`${RED}${failed} fixture(s) failed${RESET}\n`);
    for (const f of failures) {
      console.log(`${RED}--- ${f.name} ---${RESET}`);
      console.log(f.error);
      console.log();
    }
  } else {
    console.log(`${GREEN}All fixtures passed!${RESET}`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
