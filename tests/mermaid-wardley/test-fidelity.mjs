#!/usr/bin/env node
/**
 * OWM → Mermaid wardley-beta Conversion Fidelity Test
 *
 * For each map in swardley/WARDLEY-MAP-REPOSITORY:
 *   1. Parse the source OWM file  (reference)
 *   2. Convert OWM → Mermaid wardley-beta       (via convert.mjs)
 *   3. Parse the Mermaid output   (ours)
 *   4. Compare reference vs ours.
 *
 * Reported metrics (per map + aggregate):
 *   - Component retention       (% of source components present in output)
 *   - Anchor retention          (% of source anchors present in output)
 *   - Link retention            (% of source links present in output)
 *   - |Δvis| / |Δevo|           (mean absolute coordinate drift, retained components)
 *   - ε-bias / ν-bias           (mean signed drift — systematic offsets)
 *   - |Δε| cumulative buckets   (noise-floor comparison, matched-pair pooled)
 *
 * Methodology modelled on tractorjuice/wardleymap_math_model
 * (skills/wardley-map-workspace/compare_all_25.py).
 *
 * Usage: node test-fidelity.mjs [--limit N] [--verbose] [--save-diffs]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findMapFiles, owmToMermaid } from './convert.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const owmDir = join(__dirname, 'owm-maps');
const diffsDir = join(__dirname, 'output', 'fidelity-diffs');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

const args = process.argv.slice(2);
const limit = (() => {
  const idx = args.indexOf('--limit');
  return idx >= 0 && args[idx + 1] ? parseInt(args[idx + 1], 10) : 200;
})();
const verbose = args.includes('--verbose');
const saveDiffs = args.includes('--save-diffs');

// ── Parser shared by both OWM and Mermaid wardley-beta ──
//
// Both grammars share the OWM-style shape:
//   component <name> [vis, evo]       (decorators optional)
//   anchor    <name> [vis, evo]
//   <a> -> <b>                        (optionally ; annotation)
// Names may be quoted in Mermaid output.

function stripQuotes(s) {
  if (!s) return s;
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1);
  }
  return s;
}

function normalize(name) {
  // Strip surrounding quotes first, then drop any remaining quote chars
  // (the converter rewrites internal double-quotes to single-quotes, so
  // `"Best" (legacy)` in source becomes `"'Best' (legacy)"` in output —
  // we treat both as equivalent for retention matching).
  return stripQuotes(name)
    .replace(/["']/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function parseWardley(text) {
  const components = new Map();   // normalizedName → { name, vis, evo, decorators }
  const anchors    = new Map();   // normalizedName → { name, vis, evo }
  const links      = new Set();   // "from|to" (normalized)
  const pipelines  = new Map();   // normalizedParent → [normalizedChild]

  const lines = text.split('\n');
  let inPipelineBlock = false;
  let pipelineParent = null;
  // Track last top-level component placement so we can give pipeline children
  // the same visibility (which is how wardley-beta pipeline blocks work).
  let parentPlacement = null;

  // Regex shared by OWM and Mermaid forms. Quoted or bare names accepted.
  // Bare names may contain spaces (until a `[`).
  const NAMED_COORD = /^(component|anchor)\s+(?:"([^"]+)"|([^[\]]+?))\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\](.*)$/i;
  const ANCHOR_BARE = /^anchor\s+(?:"([^"]+)"|([^[\]]+?))\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/i;
  const PIPE_RANGE  = /^pipeline\s+(?:"([^"]+)"|([^[\]]+?))\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]\s*$/i;
  const PIPE_BLOCK  = /^pipeline\s+(?:"([^"]+)"|([^[{}]+?))\s*\{\s*$/i;
  const PIPE_CHILD  = /^component\s+(?:"([^"]+)"|([^[\]]+?))\s*\[\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\]/i;
  const LINK_RE     = /^(?:"([^"]+)"|([^\s"->][^->]*?))\s*->\s*(?:"([^"]+)"|([^\s"->][^->;]*?))\s*(?:;.*)?$/;

  for (let rawLine of lines) {
    let trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    // Strip inline // comments (but preserve :// in URLs)
    const commentMatch = trimmed.match(/^(.+?)\s+\/\/(?!\/)(.*)$/);
    if (commentMatch && !commentMatch[1].includes('://')) {
      trimmed = commentMatch[1].trim();
    }
    if (!trimmed) continue;

    // Open / close pipeline block
    const pipeBlockMatch = trimmed.match(PIPE_BLOCK);
    if (pipeBlockMatch) {
      pipelineParent = (pipeBlockMatch[1] || pipeBlockMatch[2] || '').trim();
      inPipelineBlock = true;
      if (!pipelines.has(normalize(pipelineParent))) {
        pipelines.set(normalize(pipelineParent), []);
      }
      // Find parent's own coords so we can assign vis to 1-D children
      parentPlacement = components.get(normalize(pipelineParent)) || null;
      continue;
    }
    if (inPipelineBlock && trimmed === '}') {
      inPipelineBlock = false;
      pipelineParent = null;
      parentPlacement = null;
      continue;
    }

    // Inside a pipeline block, children may use 1-D [evo] or 2-D [vis, evo]
    if (inPipelineBlock) {
      const childMatch = trimmed.match(PIPE_CHILD);
      if (childMatch) {
        const cname = (childMatch[1] || childMatch[2]).trim();
        const evo = parseFloat(childMatch[4] != null ? childMatch[4] : childMatch[3]);
        const vis = childMatch[4] != null
          ? parseFloat(childMatch[3])
          : (parentPlacement ? parentPlacement.vis : NaN);
        if (!Number.isNaN(vis) && !Number.isNaN(evo)) {
          const key = normalize(cname);
          components.set(key, { name: cname, vis, evo, decorators: [] });
          const arr = pipelines.get(normalize(pipelineParent));
          if (arr && !arr.includes(key)) arr.push(key);
        }
        continue;
      }
    }

    // Skip `pipeline X [min, max]` range declarations — they aren't components
    if (PIPE_RANGE.test(trimmed)) continue;

    // Top-level component / anchor
    const namedMatch = trimmed.match(NAMED_COORD);
    if (namedMatch) {
      const kind = namedMatch[1].toLowerCase();
      const name = (namedMatch[2] || namedMatch[3]).trim();
      const vis = parseFloat(namedMatch[4]);
      const evo = parseFloat(namedMatch[5]);
      const rest = (namedMatch[6] || '').trim();
      if (kind === 'component') {
        // Decorators in Mermaid: (build) (buy) (outsource) (inertia) (market)
        const decorators = [];
        const decMatches = rest.match(/\(([a-z]+)\)/gi) || [];
        for (const d of decMatches) decorators.push(d.slice(1, -1).toLowerCase());
        // OWM "inertia" marker trailing after coords
        if (/\binertia\b/i.test(rest) && !decorators.includes('inertia')) {
          decorators.push('inertia');
        }
        components.set(normalize(name), { name, vis, evo, decorators });
      } else {
        anchors.set(normalize(name), { name, vis, evo });
      }
      continue;
    }

    // OWM build/buy/outsource markers — record as decorators on components.
    const srcMatch = trimmed.match(/^(build|buy|outsource)\s+(.+)$/i);
    if (srcMatch) {
      const n = normalize(srcMatch[2]);
      const existing = components.get(n);
      if (existing && !existing.decorators.includes(srcMatch[1].toLowerCase())) {
        existing.decorators.push(srcMatch[1].toLowerCase());
      }
      continue;
    }

    // Links — only recognise lines that don't start with a known keyword.
    if (trimmed.includes('->')) {
      if (/^(evolve|component|pipeline|anchor|note|annotation|annotations)\s/i.test(trimmed)) continue;
      const lm = trimmed.match(LINK_RE);
      if (lm) {
        const from = (lm[1] || lm[2]).trim();
        const to   = (lm[3] || lm[4]).trim();
        links.add(`${normalize(from)}|${normalize(to)}`);
      }
    }
  }

  return { components, anchors, links, pipelines };
}

// ── Comparison engine ──

function cumulativeBuckets(values, thresholds) {
  if (!values.length) return Object.fromEntries(thresholds.map(t => [t, null]));
  return Object.fromEntries(
    thresholds.map(t => [t, values.filter(v => Math.abs(v) <= t).length / values.length])
  );
}

function compare(ref, ours) {
  const refNames = new Set(ref.components.keys());
  const oursNames = new Set(ours.components.keys());

  const retained = [...refNames].filter(n => oursNames.has(n));
  const lost     = [...refNames].filter(n => !oursNames.has(n));
  const added    = [...oursNames].filter(n => !refNames.has(n));

  const drifts = retained.map(n => {
    const r = ref.components.get(n);
    const o = ours.components.get(n);
    return { name: n, dvis: o.vis - r.vis, devo: o.evo - r.evo };
  });

  const absDevo = drifts.map(d => Math.abs(d.devo));
  const absDvis = drifts.map(d => Math.abs(d.dvis));
  const signedDevo = drifts.map(d => d.devo);
  const signedDvis = drifts.map(d => d.dvis);

  const mean = xs => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;

  const refAnchors = new Set(ref.anchors.keys());
  const oursAnchors = new Set(ours.anchors.keys());
  const anchorsRetained = [...refAnchors].filter(n => oursAnchors.has(n));

  const refLinks = ref.links;
  const oursLinks = ours.links;
  const linksRetained = [...refLinks].filter(l => oursLinks.has(l));

  // Perfect placements: |Δε| and |Δν| both ≤ 1e-6
  const perfect = drifts.filter(d =>
    Math.abs(d.devo) <= 1e-6 && Math.abs(d.dvis) <= 1e-6
  ).length;

  return {
    refComponents:   refNames.size,
    oursComponents:  oursNames.size,
    retained:        retained.length,
    lost:            lost.length,
    added:           added.length,
    componentRetention: refNames.size ? retained.length / refNames.size : 1,
    perfect,
    perfectRate:    retained.length ? perfect / retained.length : 1,
    meanAbsDevo:    mean(absDevo),
    meanAbsDvis:    mean(absDvis),
    biasDevo:       mean(signedDevo),
    biasDvis:       mean(signedDvis),
    refAnchors:     refAnchors.size,
    anchorsRetained: anchorsRetained.length,
    anchorRetention: refAnchors.size ? anchorsRetained.length / refAnchors.size : 1,
    refLinks:       refLinks.size,
    oursLinks:      oursLinks.size,
    linksRetained:  linksRetained.length,
    linkRetention:  refLinks.size ? linksRetained.length / refLinks.size : 1,
    allDevo:        signedDevo,
    allDvis:        signedDvis,
    lostNames:      lost,
  };
}

// ── Main ──

async function main() {
  console.log(`${BOLD}Wardley Conversion Fidelity (OWM → Mermaid wardley-beta)${RESET}`);
  console.log(`${'='.repeat(70)}`);

  console.log(`\nScanning ${owmDir} for OWM map files...`);
  const allFiles = findMapFiles(owmDir);
  console.log(`Found ${allFiles.length} map files`);

  const testFiles = allFiles.slice(0, limit);
  console.log(`Testing ${testFiles.length} maps (limit: ${limit})\n`);

  if (saveDiffs) mkdirSync(diffsDir, { recursive: true });

  const results = [];
  for (const filePath of testFiles) {
    const relPath = relative(owmDir, filePath);
    const name = relPath.replace(/[/\\]/g, '--').replace(/\.\w+$/, '') || relPath;

    let owmContent;
    try {
      owmContent = readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }
    if (owmContent.trim().length < 30) continue;

    let mermaidContent;
    try {
      mermaidContent = owmToMermaid(owmContent, filePath);
    } catch (err) {
      console.log(`  ${RED}CONV_ERR${RESET}  ${name} — ${err.message}`);
      continue;
    }

    const ref  = parseWardley(owmContent);
    const ours = parseWardley(mermaidContent);

    // Pipeline children are sometimes not declared as top-level components
    // in the OWM source (declared inside a pipeline). When that's the case,
    // the ref parser records them via inPipelineBlock handling already.
    // But OWM also uses `pipeline NAME [min, max]` + flat component list,
    // which we model differently. Align by treating the ref pipeline children
    // (if any) as components.

    if (ref.components.size === 0) continue;   // skip empty sources

    const stats = compare(ref, ours);
    stats.name = name;
    results.push(stats);

    // Tag:
    //   LOSSLESS — 100% component+link retention, |Δε|=0, |Δν|=0
    //   CLEAN    — 100% component retention, |Δε|=0 (|Δν| drift is pipeline-child
    //              flattening, a grammar-level projection, not a converter bug)
    //   MINOR    — ≥90% retention, small |Δε|
    //   LOSSY    — < 90% retention or large |Δε|
    const fullRetention = stats.componentRetention >= 0.9999 &&
                          stats.linkRetention    >= 0.9999;
    const tag = fullRetention && stats.meanAbsDevo <= 1e-6 && stats.meanAbsDvis <= 1e-6
      ? `${GREEN}LOSSLESS${RESET}`
      : fullRetention && stats.meanAbsDevo <= 1e-6
        ? `${CYAN}CLEAN   ${RESET}`
        : stats.componentRetention >= 0.90
          ? `${YELLOW}MINOR   ${RESET}`
          : `${RED}LOSSY   ${RESET}`;

    const line =
      `  ${tag} ${name.padEnd(50)} ` +
      `comp ${stats.retained}/${stats.refComponents} ` +
      `anc ${stats.anchorsRetained}/${stats.refAnchors} ` +
      `lnk ${stats.linksRetained}/${stats.refLinks} ` +
      `|Δε| ${stats.meanAbsDevo.toFixed(4)}`;
    console.log(line);

    if (verbose && stats.lost.length > 0) {
      console.log(`      ${DIM}lost: ${stats.lostNames.slice(0, 6).join(', ')}${stats.lostNames.length > 6 ? '…' : ''}${RESET}`);
    }

    if (saveDiffs && (stats.lost > 0 || stats.meanAbsDevo > 1e-6)) {
      const safe = name.replace(/[^a-zA-Z0-9_-]/g, '_');
      writeFileSync(join(diffsDir, `${safe}.diff.json`), JSON.stringify(stats, null, 2));
    }
  }

  // ── Aggregates ──
  const n = results.length;
  if (!n) {
    console.log(`\n${RED}No maps parsed.${RESET}`);
    process.exit(1);
  }

  const agg = (key) => results.reduce((a, r) => a + r[key], 0) / n;
  const sum = (key) => results.reduce((a, r) => a + r[key], 0);

  console.log(`\n${'='.repeat(70)}`);
  console.log(`${BOLD}Aggregate Results (n=${n} maps)${RESET}\n`);

  const totalRef = sum('refComponents');
  const totalRetained = sum('retained');
  const totalLost = sum('lost');
  const totalRefAnch = sum('refAnchors');
  const totalRetAnch = sum('anchorsRetained');
  const totalRefLinks = sum('refLinks');
  const totalRetLinks = sum('linksRetained');
  const totalPerfect = sum('perfect');

  console.log(`  Components         retained ${totalRetained}/${totalRef} (${(totalRetained/totalRef*100).toFixed(1)}%)  lost ${totalLost}`);
  console.log(`  Anchors            retained ${totalRetAnch}/${totalRefAnch} (${totalRefAnch ? (totalRetAnch/totalRefAnch*100).toFixed(1) : '—'}%)`);
  console.log(`  Links              retained ${totalRetLinks}/${totalRefLinks} (${totalRefLinks ? (totalRetLinks/totalRefLinks*100).toFixed(1) : '—'}%)`);
  console.log(`  Lossless placement ${totalPerfect}/${totalRetained} (${totalRetained ? (totalPerfect/totalRetained*100).toFixed(1) : '—'}%)  of retained components`);

  console.log(`\n  Mean |Δε|          ${agg('meanAbsDevo').toFixed(6)}`);
  console.log(`  Mean |Δν|          ${agg('meanAbsDvis').toFixed(6)}  ${DIM}(grammar-level — pipeline children inherit parent vis in wardley-beta)${RESET}`);
  console.log(`  ε-bias             ${agg('biasDevo').toFixed(6)}  ${DIM}(signed, positive = ours more commoditised)${RESET}`);
  console.log(`  ν-bias             ${agg('biasDvis').toFixed(6)}  ${DIM}(signed, positive = ours more visible)${RESET}`);

  // Pooled Δε cumulative distribution
  const pooledDevo = results.flatMap(r => r.allDevo);
  const thresholds = [0, 1e-6, 0.01, 0.05, 0.10, 0.20];
  const buckets = cumulativeBuckets(pooledDevo, thresholds);
  console.log(`\n  ${BOLD}Pooled |Δε| distribution${RESET} (${pooledDevo.length} matched pairs):`);
  for (const t of thresholds) {
    const frac = buckets[t];
    const label = t === 0 ? '|Δε| = 0        ' : `|Δε| ≤ ${t.toFixed(6).padStart(8)}`;
    console.log(`    ${label}   ${(frac * 100).toFixed(1)}%`);
  }

  // Worst 5 maps by |Δε|
  const worst = [...results].sort((a, b) => b.meanAbsDevo - a.meanAbsDevo).slice(0, 5);
  if (worst.some(w => w.meanAbsDevo > 0)) {
    console.log(`\n  ${BOLD}Worst 5 by mean |Δε|${RESET}:`);
    for (const w of worst) {
      console.log(`    ${w.name.padEnd(55)} |Δε| ${w.meanAbsDevo.toFixed(4)}  comp ${w.retained}/${w.refComponents}`);
    }
  }

  // Worst 5 by component loss
  const worstLoss = [...results].sort((a, b) => a.componentRetention - b.componentRetention).slice(0, 5);
  if (worstLoss.some(w => w.componentRetention < 1)) {
    console.log(`\n  ${BOLD}Worst 5 by component retention${RESET}:`);
    for (const w of worstLoss) {
      console.log(`    ${w.name.padEnd(55)} ${(w.componentRetention*100).toFixed(1)}% (${w.retained}/${w.refComponents})`);
    }
  }

  // Save JSON summary
  const summary = {
    n,
    aggregates: {
      componentRetention: totalRetained / totalRef,
      anchorRetention: totalRefAnch ? totalRetAnch / totalRefAnch : null,
      linkRetention: totalRefLinks ? totalRetLinks / totalRefLinks : null,
      meanAbsDevo: agg('meanAbsDevo'),
      meanAbsDvis: agg('meanAbsDvis'),
      biasDevo: agg('biasDevo'),
      biasDvis: agg('biasDvis'),
      perfectPlacementRate: totalRetained ? totalPerfect / totalRetained : null,
    },
    pooled: {
      pairs: pooledDevo.length,
      devoBuckets: buckets,
    },
    perMap: results.map(r => ({
      name: r.name,
      refComponents: r.refComponents,
      retained: r.retained,
      componentRetention: r.componentRetention,
      meanAbsDevo: r.meanAbsDevo,
      meanAbsDvis: r.meanAbsDvis,
      refLinks: r.refLinks,
      linksRetained: r.linksRetained,
    })),
  };
  const summaryPath = join(__dirname, 'output', 'fidelity-summary.json');
  mkdirSync(dirname(summaryPath), { recursive: true });
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\n  Summary saved to ${relative(__dirname, summaryPath)}`);

  // Exit non-zero only if aggregate fidelity is egregious
  const pass = (totalRetained / totalRef) >= 0.90;
  process.exit(pass ? 0 : 1);
}

main();
