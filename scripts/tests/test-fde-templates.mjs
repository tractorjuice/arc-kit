#!/usr/bin/env node
/**
 * Consistency guard for the arckit-fde site-generator templates.
 *
 * 1. Every scalar {{TOKEN}} used in templates/ is documented in the fenced
 *    ```tokens block of references/config-schema.md, and vice versa.
 *    Item-scoped tokens ({{ITEM_*}}) are excluded.
 * 2. Every <!-- BEGIN: x --> (or # BEGIN: x) has a matching END per file.
 * 3. Both presets carry every required top-level key, with no leftover
 *    <verbatim>/<from source> placeholders.
 *
 * Exit 0 = consistent. Exit 1 = drift. No external dependencies.
 */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync, readdirSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const plugin = resolve(repoRoot, 'plugins/arckit-fde');
const templatesDir = resolve(plugin, 'templates');
const schemaPath = resolve(plugin, 'references/config-schema.md');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const templateFiles = walk(templatesDir);
const templateText = templateFiles
  .filter((p) => /\.(html|css|txt|xml)$/.test(p) || p.endsWith('nojekyll'))
  .map((p) => readFileSync(p, 'utf8'))
  .join('\n');

const usedTokens = new Set(
  [...templateText.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)]
    .map((m) => m[1])
    .filter((t) => !t.startsWith('ITEM_')),
);

const schema = readFileSync(schemaPath, 'utf8');
const tokensBlock = schema.match(/```tokens\n([\s\S]*?)```/);
if (!tokensBlock) {
  console.error('[FAIL] no ```tokens block in config-schema.md');
  process.exit(1);
}
const documented = new Set(
  [...tokensBlock[1].matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map((m) => m[1]),
);

let ok = true;
const usedNotDocumented = [...usedTokens].filter((t) => !documented.has(t)).sort();
const documentedNotUsed = [...documented].filter((t) => !usedTokens.has(t)).sort();
if (usedNotDocumented.length) {
  ok = false;
  console.error('[FAIL] tokens used in templates but not documented:', usedNotDocumented);
}
if (documentedNotUsed.length) {
  ok = false;
  console.error('[FAIL] tokens documented but never used in templates:', documentedNotUsed);
}

for (const file of templateFiles) {
  if (!/\.(html|txt)$/.test(file)) continue;
  const t = readFileSync(file, 'utf8');
  const begins = [...t.matchAll(/BEGIN:\s*([a-z-]+)/g)].map((m) => m[1]).sort();
  const ends = [...t.matchAll(/END:\s*([a-z-]+)/g)].map((m) => m[1]).sort();
  if (JSON.stringify(begins) !== JSON.stringify(ends)) {
    ok = false;
    console.error(`[FAIL] BEGIN/END mismatch in ${file}:`, { begins, ends });
  }
}

const requiredKeys = [
  'market_preset', 'area_served', 'eyebrow', 'page_title_suffix', 'meta_description',
  'hero_alt', 'footer_tagline', 'cta_eyebrow', 'cta_headline', 'examples_heading',
  'powered_by_arckit', 'tagline', 'cta_primary', 'pricing', 'signal_band', 'value_props',
  'offer_pack', 'public_sector_benefits', 'follow_on_areas', 'policy_frameworks',
  'worked_examples', 'bootstrap_cadence',
];
for (const preset of ['uk-public-sector.yaml', 'generic.yaml']) {
  const text = readFileSync(resolve(plugin, 'presets', preset), 'utf8');
  const missing = requiredKeys.filter((k) => !new RegExp(`^${k}:`, 'm').test(text));
  if (missing.length) {
    ok = false;
    console.error(`[FAIL] ${preset} missing keys:`, missing);
  }
  if (/<verbatim|<from source/.test(text)) {
    ok = false;
    console.error(`[FAIL] ${preset} still contains placeholder markers`);
  }
}

if (ok) console.log('[OK] arckit-fde templates, schema and presets are consistent');
process.exit(ok ? 0 : 1);
