#!/usr/bin/env node
/**
 * owm-tidy.mjs — tidy the labels of an OnlineWardleyMaps (OWM) map.
 *
 * Sibling to `wardley-tidy.mjs` (the mermaid `wardley-beta` adapter). Both feed
 * the same renderer-agnostic placement engine (`wardley-label-placement.mjs`);
 * only the projection layer differs. This file uses the OnlineWardleyMaps
 * renderer geometry, recovered from
 * https://github.com/tractorjuice/onlinewardleymaps:
 *
 *   - PositionCalculator.js  -> projection (NO padding; dot lives in 0..W,0..H)
 *         x = maturity        * mapWidth
 *         y = (1 - visibility) * mapHeight
 *   - constants/defaults.js  -> MapDimensions { width: 500, height: 600 }
 *   - constants/mapstyles.js -> component.radius 5 (wardley/plain) / 7 (colour),
 *                               component.fontSize 13px
 *   - ComponentText.js       -> label origin = dot + (label.x, label.y),
 *                               text-anchor:start, baseline at y (no textAnchor
 *                               prop is passed -> SVG default 'start').
 *
 * CAVEAT — responsive canvas. Unlike mermaid's fixed 900x600 SVG, the OWM
 * canvas size is window-derived at runtime (App.js getWidth/getHeight). Label
 * offsets are absolute pixels, so there is no single "correct" tidy. We tidy
 * against the documented default 500x600: the smallest realistic canvas, hence
 * the conservative choice (labels non-overlapping when dots are crowded stay
 * non-overlapping when a wider window spreads them apart).
 *
 * Unlike the mermaid `wardley-beta` block — which is "a rendering" and is
 * tidied automatically by the `tidy-wardley-labels.mjs` PostToolUse hook — the
 * ```wardley (OWM) block is the canonical, author-edited source and OWM is an
 * interactive drag editor. Tidying it is therefore OPT-IN: triggered by
 * `/arckit:wardley --tidy-owm`, never by a silent hook.
 *
 * Exports: `tidyOwm` (single pass), `tidyOwmToFixpoint` (iterate to a stable
 * result), `tidyMarkdown` (tidy every fenced ```wardley block in a markdown
 * document, leaving prose and ```mermaid blocks verbatim). Also a CLI — see the
 * bottom of the file.
 */
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { autoPlaceLabels, estimateLabelBox } from './wardley-label-placement.mjs';

// --- OWM renderer constants (recovered from onlinewardleymaps source) --------
const REF_WIDTH = 500; // Defaults.MapDimensions.width
const REF_HEIGHT = 600; // Defaults.MapDimensions.height
const NODE_RADIUS = 5; // mapstyles Plain/Wardley component.radius
const LABEL_FONT_SIZE = 13; // mapstyles component.fontSize '13px'

// Same engine config the mermaid adapter uses — slot distances are absolute px.
const PLACEMENT_CONFIG = {
  slotDistances: [12, 22, 36, 54],
  leaderThreshold: 34,
  refinementCount: 3,
};

// OWM keeps coordinates in 0..1; unlike mermaid there is no 0..100 rescale.
const parseLabel = (s) => {
  const m = /label\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/.exec(s);
  return m ? { ox: Number(m[1]), oy: Number(m[2]) } : null;
};

// OWM statement keywords — a line starting with one of these is never an edge.
const NON_LINK_KEYWORDS =
  /^(component|market|anchor|note|annotation|annotations|pipeline|evolve|evolution|title|style|build|buy|outsource|ecosystem|url|submap|size|y-axis|pioneers|settlers|townplanners)\b/;

/**
 * Tidy the component labels of an OWM map (single pass).
 * @param {string} owmText
 * @returns {{ text: string, changed: number, total: number }}
 */
export const tidyOwm = (owmText) => {
  const lines = owmText.split('\n');

  // ---- 1. line-oriented parse --------------------------------------------
  /** @type {Array<{lineIndex:number,kind:string,name:string,vis:number,
   *   mat:number,manualOffset:?{ox:number,oy:number}}>} */
  const nodes = [];
  const links = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('//')) {
      continue;
    }

    // component / market — relabelable. OWM: `<kw> Name [vis, mat] [label..]`.
    const compM =
      /^(component|market)\s+(.+?)\s*\[\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\](\s*label\s*\[[^\]]*\])?/.exec(
        line
      );
    if (compM) {
      nodes.push({
        lineIndex: i,
        kind: 'component',
        name: compM[2].trim(),
        vis: Number(compM[3]),
        mat: Number(compM[4]),
        manualOffset: compM[5] ? parseLabel(compM[5]) : null,
      });
      continue;
    }

    // anchor — obstacle only (OWM grammar relabels anchors, but parity with
    // wardley-tidy.mjs keeps tidying scoped to component labels).
    const anchorM = /^anchor\s+(.+?)\s*\[\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]/.exec(line);
    if (anchorM) {
      nodes.push({
        lineIndex: i,
        kind: 'anchor',
        name: anchorM[1].trim(),
        vis: Number(anchorM[2]),
        mat: Number(anchorM[3]),
        manualOffset: null,
      });
      continue;
    }

    // link — `A->B`, `A+<>B`, `A+<B`, `A+>B`, optional +'label'.
    const linkM = /^(.+?)\s*\+?(?:'[^']*')?[<>]*-+[<>]*\s*(.+?)$/.exec(line);
    if (linkM && /-+/.test(line) && !NON_LINK_KEYWORDS.test(line)) {
      links.push({ source: linkM[1].trim(), target: linkM[2].trim() });
    }
  }

  // ---- 2. projection (PositionCalculator.js — no padding) ----------------
  const projectX = (mat) => mat * REF_WIDTH;
  const projectY = (vis) => (1 - vis) * REF_HEIGHT;

  const pos = new Map();
  for (const n of nodes) {
    pos.set(n.name, { x: projectX(n.mat), y: projectY(n.vis) });
  }

  // ---- 3. build LabelBox[] + Obstacle[] ----------------------------------
  const labels = [];
  const obstacles = [];
  let priority = 0;

  for (const n of nodes) {
    const p = pos.get(n.name);
    const box = estimateLabelBox(n.name, LABEL_FONT_SIZE);

    // OWM label: text origin at dot+(ox,oy), text-anchor:start, baseline at y.
    // Box top-left = (textX, textY - height). Identical form to wardley-tidy's
    // component branch.
    let manualRect;
    if (n.manualOffset) {
      const textX = p.x + n.manualOffset.ox;
      const textY = p.y + n.manualOffset.oy;
      manualRect = { x: textX, y: textY - box.height, width: box.width, height: box.height };
    }

    if (n.kind === 'component') {
      labels.push({
        id: `node:${n.name}`,
        anchor: { x: p.x, y: p.y },
        width: box.width,
        height: box.height,
        kind: 'component',
        priority: priority++,
        manualRect,
      });
    }
    obstacles.push({ type: 'circle', x: p.x, y: p.y, radius: NODE_RADIUS });
  }

  for (const link of links) {
    const a = pos.get(link.source);
    const b = pos.get(link.target);
    if (a && b) {
      obstacles.push({ type: 'segment', x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }

  const bounds = { x: 0, y: 0, width: REF_WIDTH, height: REF_HEIGHT };

  // ---- 4. run the engine -------------------------------------------------
  const placed = autoPlaceLabels(labels, obstacles, bounds, PLACEMENT_CONFIG);
  const placedById = new Map(placed.map((pl) => [pl.id, pl]));

  // ---- 5. invert placed rect -> OWM `label [ox, oy]` offset --------------
  const offsets = new Map();
  for (const n of nodes) {
    if (n.kind !== 'component') {
      continue;
    }
    const pl = placedById.get(`node:${n.name}`);
    if (!pl) {
      continue;
    }
    const node = pos.get(n.name);
    const r = pl.rect;
    offsets.set(n.name, {
      ox: Math.round(r.x - node.x),
      oy: Math.round(r.y + r.height - node.y),
    });
  }

  // ---- 6. rewrite --------------------------------------------------------
  const outLines = [...lines];
  let changed = 0;
  let total = 0;
  for (const n of nodes) {
    if (n.kind !== 'component') {
      continue;
    }
    total++;
    const off = offsets.get(n.name);
    if (!off) {
      continue;
    }
    const labelTok = `label [${off.ox}, ${off.oy}]`;
    const original = outLines[n.lineIndex];
    const next = n.manualOffset
      ? original.replace(/label\s*\[[^\]]*\]/, labelTok)
      : original.replace(']', `] ${labelTok}`);
    if (next !== original) {
      changed++;
    }
    outLines[n.lineIndex] = next;
  }

  return { text: outLines.join('\n'), changed, total };
};

/**
 * Apply `tidyOwm` repeatedly until the result is stable.
 *
 * A single pass is not always a fixpoint: the first pass auto-places an
 * untuned map, and the second re-reads every result as an authored
 * `manualRect`, which can shift a few keep-vs-replace decisions. Most maps
 * converge within two passes. A few have two equally-scored candidate slots
 * that flip each pass — a 2-cycle. When a cycle is detected the
 * lexicographically smallest member is returned, so the result is
 * deterministic and `tidyOwmToFixpoint` is idempotent for every input.
 *
 * @param {string} owmText
 * @param {number} [maxPasses]
 * @returns {{ text: string, changed: boolean, total: number, passes: number }}
 */
export const tidyOwmToFixpoint = (owmText, maxPasses = 12) => {
  const seen = [owmText];
  let text = owmText;
  let total = 0;
  let passes = 0;
  for (; passes < maxPasses; passes++) {
    const r = tidyOwm(text);
    total = r.total;
    if (r.text === text) {
      break; // true fixpoint
    }
    const cycleStart = seen.indexOf(r.text);
    if (cycleStart !== -1) {
      text = seen.slice(cycleStart).reduce((a, b) => (b < a ? b : a));
      break;
    }
    seen.push(r.text);
    text = r.text;
  }
  return { text, changed: text !== owmText, total, passes };
};

/**
 * Tidy every fenced ```wardley block in a markdown document, in place.
 *
 * Only ```wardley fences (the canonical OWM block) are touched. Prose and
 * ```mermaid blocks — including the `wardley-beta` rendering block, which is
 * the `tidy-wardley-labels.mjs` hook's responsibility — are returned verbatim.
 *
 * @param {string} md markdown source
 * @returns {string}
 */
export const tidyMarkdown = (md) => {
  const fence = /(^|\n)([ \t]*)(`{3,})wardley[ \t]*\n([\s\S]*?)\n[ \t]*\3/g;
  return md.replace(fence, (whole, pre, indent, ticks, body) => {
    const tidied = tidyOwmToFixpoint(body).text.replace(/\n$/, '');
    return `${pre}${indent}${ticks}wardley\n${tidied}\n${indent}${ticks}`;
  });
};

// ---- CLI --------------------------------------------------------------------
// Usage:
//   node owm-tidy.mjs <file.owm|file.md>   rewrite in place
//   node owm-tidy.mjs --check <file>       exit 1 if tidying would change it
//   node owm-tidy.mjs --stdout <file>      print the tidied result, do not write
// A `.md` file is treated as markdown (only ```wardley fences tidied); any
// other extension is treated as a bare OWM map.
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
  const { readFileSync, writeFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const stdout = args.includes('--stdout');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('usage: node owm-tidy.mjs [--check|--stdout] <file.owm|file.md>');
    process.exit(2);
  }
  const path = resolve(file);
  const src = readFileSync(path, 'utf8');
  const next = /\.md$/i.test(path) ? tidyMarkdown(src) : tidyOwmToFixpoint(src).text;
  const changed = next !== src;
  if (check) {
    console.error(`owm-tidy: ${file} ${changed ? 'would change' : 'already tidy'}`);
    process.exit(changed ? 1 : 0);
  }
  if (stdout) {
    process.stdout.write(next);
    process.exit(0);
  }
  if (changed) {
    writeFileSync(path, next, 'utf8');
    console.error(`owm-tidy: ${file} — tidied`);
  } else {
    console.error(`owm-tidy: ${file} — already tidy`);
  }
}
