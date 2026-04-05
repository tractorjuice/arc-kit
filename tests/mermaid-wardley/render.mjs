#!/usr/bin/env node
/**
 * Mermaid Wardley-Beta SVG Renderer
 *
 * Uses @mermaid-js/mermaid-cli (mmdc) to render each .mmd fixture to SVG.
 * SVGs are written to the output/ directory for visual inspection.
 *
 * Usage: node render.mjs
 * Exit code: 0 if all render, 1 if any fail
 */

import { readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, 'fixtures');
const outputDir = join(__dirname, 'output');
const puppeteerConfig = join(__dirname, 'puppeteer-config.json');

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

function fileSize(path) {
  try {
    const stat = statSync(path);
    const kb = (stat.size / 1024).toFixed(1);
    return `${kb} KB`;
  } catch {
    return 'unknown size';
  }
}

function findMmdc() {
  // mmdc is in node_modules/.bin/
  const localMmdc = join(__dirname, 'node_modules', '.bin', 'mmdc');
  try {
    statSync(localMmdc);
    return localMmdc;
  } catch {
    // Fall back to global
    return 'mmdc';
  }
}

async function main() {
  // Ensure output directory exists
  mkdirSync(outputDir, { recursive: true });

  const mmdc = findMmdc();

  // Collect .mmd files sorted by name
  const files = readdirSync(fixturesDir)
    .filter(f => f.endsWith('.mmd'))
    .sort();

  if (files.length === 0) {
    console.log(`${YELLOW}No .mmd fixtures found in ${fixturesDir}${RESET}`);
    process.exit(0);
  }

  console.log(`${BOLD}Mermaid Wardley-Beta SVG Renderer${RESET}`);
  console.log(`${'='.repeat(50)}`);
  console.log(`Found ${files.length} fixtures`);
  console.log(`Output: ${outputDir}\n`);

  let rendered = 0;
  let failed = 0;
  const failures = [];

  for (const file of files) {
    const inputPath = join(fixturesDir, file);
    const name = basename(file, '.mmd');
    const outputPath = join(outputDir, `${name}.svg`);

    try {
      const args = [
        '-i', inputPath,
        '-o', outputPath,
        '-p', puppeteerConfig,
        '-b', 'transparent',
      ];
      // Apply CSS for font styling if the file exists
      const cssFile = join(__dirname, 'wardley-style.css');
      try { statSync(cssFile); args.push('-C', cssFile); } catch {}
      await execFileAsync(mmdc, args, { timeout: 30000 });

      const size = fileSize(outputPath);
      console.log(`  ${GREEN}RENDERED${RESET}  ${name}  ${DIM}(${size})${RESET}`);
      rendered++;
    } catch (err) {
      const msg = err.stderr || err.message || String(err);
      console.log(`  ${RED}FAILED${RESET}    ${name}`);
      console.log(`            ${msg.split('\n')[0]}`);
      failed++;
      failures.push({ name, error: msg });
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`${BOLD}Results: ${rendered}/${files.length} rendered${RESET}`);
  if (failed > 0) {
    console.log(`${RED}${failed} fixture(s) failed to render${RESET}\n`);
    for (const f of failures) {
      console.log(`${RED}--- ${f.name} ---${RESET}`);
      console.log(f.error);
      console.log();
    }
  } else {
    console.log(`${GREEN}All fixtures rendered successfully!${RESET}`);
    console.log(`\nSVGs available in: ${outputDir}`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
