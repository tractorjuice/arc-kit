#!/usr/bin/env node
/**
 * ArcKit PostToolUse (Write|Edit) Hook — Wardley Map Label Tidying
 *
 * When a Wardley Map artefact is written, the embedded Mermaid `wardley-beta`
 * block can have components whose default label positions overlap, making the
 * rendered map unreadable. This hook rewrites that block's `label [x, y]`
 * offsets so labels no longer collide.
 *
 * It is deliberately block-scoped. An ArcKit Wardley artefact is a `.md` file
 * holding two fenced blocks: a canonical ```wardley (OWM) block and a ```mermaid
 * `wardley-beta` rendering block. This hook touches ONLY the ```mermaid block —
 * the ```wardley block (owned by validate-wardley-math.mjs), prose, tables and
 * Document Control are left byte-for-byte unchanged.
 *
 * The placement engine is vendored alongside this hook (`wardley-tidy.mjs` +
 * `wardley-label-placement.mjs`) so tidying runs offline with no install step —
 * no `npx`, no network. The hook always exits 0 and never blocks: a tidy
 * failure leaves the file exactly as written.
 *
 * Hook Type: PostToolUse
 * Matcher:   Write|Edit  (registered in hooks.json with an `if:` glob that
 *            scopes it to artefacts under projects/.../wardley-maps/)
 * Input:     JSON { tool_name, tool_input: { file_path }, cwd }
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { realpathSync } from 'node:fs';
import { parseHookInput } from './hook-utils.mjs';
import { tidyToFixpoint } from './wardley-tidy.mjs';

/**
 * Tidy one chunk of wardley-beta text via the vendored placement engine.
 * @param {string} text
 * @returns {string} tidied text (no trailing newline)
 */
export function tidyBlock(text) {
  return tidyToFixpoint(text).text.replace(/\n$/, '');
}

/**
 * Tidy every fenced ```mermaid block holding a wardley-beta map, in place.
 * Non-mermaid fences and non-wardley mermaid blocks are returned verbatim.
 * @param {string} md markdown source
 * @param {(text: string) => string} tidy
 * @returns {string}
 */
export function tidyMarkdown(md, tidy) {
  const fence = /(^|\n)([ \t]*)(`{3,})mermaid[ \t]*\n([\s\S]*?)\n[ \t]*\3/g;
  return md.replace(fence, (whole, pre, indent, ticks, body) => {
    if (!/^\s*wardley-beta\b/m.test(body)) {
      return whole;
    }
    const tidied = tidy(body);
    return `${pre}${indent}${ticks}mermaid\n${tidied}\n${indent}${ticks}`;
  });
}

/**
 * Compute the tidied content for a written file, or null if nothing to do.
 * @param {string} filePath
 * @param {string} content
 * @param {(text: string) => string} tidy
 * @returns {string|null}
 */
export function tidyFileContent(filePath, content, tidy) {
  if (/\.mmd$/i.test(filePath)) {
    if (!/^\s*wardley-beta\b/m.test(content)) {
      return null;
    }
    return tidy(content);
  }
  if (/\.md$/i.test(filePath)) {
    return tidyMarkdown(content, tidy);
  }
  return null;
}

function main() {
  const data = parseHookInput();
  const tool = data.tool_name;
  if (tool !== 'Write' && tool !== 'Edit') {
    process.exit(0);
  }
  const filePath = (data.tool_input || {}).file_path || '';
  if (!filePath || !/\.(mmd|md)$/i.test(filePath)) {
    process.exit(0);
  }
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch {
    process.exit(0);
  }
  try {
    const next = tidyFileContent(filePath, content, tidyBlock);
    if (next != null && next !== content) {
      writeFileSync(filePath, next, 'utf8');
    }
  } catch {
    // Tidy failed — leave the file as-is, never block the write.
  }
  process.exit(0);
}

const isMain = (() => {
  if (!process.argv[1]) {
    return false;
  }
  try {
    return fileURLToPath(import.meta.url) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
})();

if (isMain) {
  main();
}
