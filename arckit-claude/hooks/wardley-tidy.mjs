#!/usr/bin/env node
/**
 * wardley-tidy.mjs — tidy the labels of a mermaid `wardley-beta` map.
 *
 * Reads wardley-beta source, computes non-overlapping label positions with
 * mermaid's pure placement engine, and rewrites each `component` /
 * pipeline-child line with a computed `label [x, y]` pixel offset. Existing
 * authored labels are kept when collision-free (minimal diffs).
 *
 * Exports `tidyMap(text)` / `tidyToFixpoint(text)`; used by the
 * `tidy-wardley-labels.mjs` PostToolUse hook. Run directly as a CLI — see the
 * bottom of the file.
 *
 * Vendored verbatim from https://github.com/tractorjuice/wardley-maps-mermaid
 * (`tools/tidy.mjs`, commit 9abfec6adb842266bb13c12105ab8f260397084a). Only the
 * `wardley-label-placement.mjs` import path differs from upstream. Do not
 * hand-edit — re-sync from upstream instead (see hooks/README.md).
 *
 * Parser scope (line-oriented, not the full langium grammar):
 *   HANDLED: `size [w,h]`; `component <name> [vis,evo] [label[..]] [decorator]`;
 *     `pipeline <parent> { ... }` with child `component <name> [evo] [label[..]]`;
 *     links (`A -> B`, `-.->`, ports, quoted labels) as obstacles.
 *   SKIPPED (left verbatim): anchors (no anchor label-offset in the grammar —
 *     parsed as obstacles only, never relabelled), annotations, notes,
 *     accelerators, attitudes, evolves, evolution-stage customisation.
 */
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { autoPlaceLabels, estimateLabelBox } from './wardley-label-placement.mjs';

// mermaid wardley renderer constants (getConfigValues defaults).
const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 600;
const PADDING = 48;
const NODE_RADIUS = 6;
const LABEL_FONT_SIZE = 10;
const SQUARE_SIZE = NODE_RADIUS * 1.6; // pipeline parent square side
const PIPELINE_BOX_HEIGHT = NODE_RADIUS * 4;
const PIPELINE_BOX_PADDING = 15;
// Same config buildPlacement passes to autoPlaceLabels.
const PLACEMENT_CONFIG = {
  slotDistances: [12, 22, 36, 54],
  leaderThreshold: 34,
  refinementCount: 3,
};
const DECORATORS = ['build', 'buy', 'outsource', 'market', 'ecosystem'];

// 0-1 -> 0-100; 0-100 stays. Mirrors wardleyParser.toPercent.
const toPercent = (v) => (v <= 1 ? v * 100 : v);

// Parse a `label [ -?INT , -?INT ]` token's numbers, or null.
const parseLabel = (s) => {
  const m = /label\s*\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]/.exec(s);
  return m ? { ox: Number(m[1]), oy: Number(m[2]) } : null;
};

/**
 * Tidy the labels of a wardley-beta map.
 * @param {string} mmdText
 * @returns {{ text: string, changed: number, total: number }}
 */
export const tidyMap = (mmdText) => {
  const lines = mmdText.split('\n');

  // ---- 1. line-oriented parse ----
  let width = DEFAULT_WIDTH;
  let height = DEFAULT_HEIGHT;
  /** @type {Array<{lineIndex:number,kind:string,name:string,vis:number,evo:number,
   *   manualOffset:?{ox:number,oy:number},decorator:?string,pipelineParent:?string,
   *   isPipelineParent:boolean}>} */
  const components = [];
  const links = [];
  const pipelineChildren = new Map(); // parent name -> [child names]
  let currentPipeline;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('//')) {
      continue;
    }

    const sizeM = /^size\s*\[\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\]/.exec(line);
    if (sizeM) {
      width = Number(sizeM[1]);
      height = Number(sizeM[2]);
      continue;
    }

    const pipeOpen = /^pipeline\s+(.+?)\s*\{/.exec(line);
    if (pipeOpen) {
      currentPipeline = pipeOpen[1].trim();
      pipelineChildren.set(currentPipeline, []);
      const parent = components.find((c) => c.name === currentPipeline);
      if (parent) {
        parent.isPipelineParent = true;
      }
      continue;
    }
    if (currentPipeline && line === '}') {
      currentPipeline = undefined;
      continue;
    }

    if (currentPipeline) {
      const childM =
        /^component\s+(.+?)\s*\[\s*(-?\d+(?:\.\d+)?)\s*\](\s*label\s*\[[^\]]*\])?/.exec(line);
      if (childM) {
        components.push({
          lineIndex: i,
          kind: 'pipeline-child',
          name: childM[1].trim(),
          vis: 0, // inherits parent's vis below
          evo: toPercent(Number(childM[2])),
          manualOffset: childM[3] ? parseLabel(childM[3]) : null,
          decorator: null,
          pipelineParent: currentPipeline,
          isPipelineParent: false,
        });
        pipelineChildren.get(currentPipeline).push(childM[1].trim());
        continue;
      }
    }

    const anchorM =
      /^anchor\s+(.+?)\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/.exec(line);
    if (anchorM) {
      components.push({
        lineIndex: i,
        kind: 'anchor',
        name: anchorM[1].trim(),
        vis: toPercent(Number(anchorM[2])),
        evo: toPercent(Number(anchorM[3])),
        manualOffset: null,
        decorator: null,
        pipelineParent: null,
        isPipelineParent: false,
      });
      continue;
    }

    const compM =
      /^component\s+(.+?)\s*\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\](\s*label\s*\[[^\]]*\])?\s*(build|buy|outsource|market|ecosystem)?/.exec(
        line
      );
    if (compM) {
      components.push({
        lineIndex: i,
        kind: 'component',
        name: compM[1].trim(),
        vis: toPercent(Number(compM[2])),
        evo: toPercent(Number(compM[3])),
        manualOffset: compM[4] ? parseLabel(compM[4]) : null,
        decorator: DECORATORS.includes(compM[5]) ? compM[5] : null,
        pipelineParent: null,
        isPipelineParent: false,
      });
      continue;
    }

    const linkM = /^(.+?)\s*\+?[<>]*\s*-?\.?-+>?\s*\+?[<>]*\s*(.+?)(?:\s*'[^']*')?$/.exec(line);
    if (
      linkM &&
      /-+>|-\.-/.test(line) &&
      !/^(component|anchor|note|annotation|pipeline|evolve|title|size)\b/.test(line)
    ) {
      links.push({ source: linkM[1].trim(), target: linkM[2].trim() });
    }
  }

  for (const c of components) {
    if (c.kind === 'pipeline-child' && c.pipelineParent) {
      const parent = components.find((p) => p.name === c.pipelineParent);
      if (parent) {
        c.vis = parent.vis;
      }
    }
  }

  // ---- 2. projection (exact mermaid replica) ----
  const chartWidth = width - PADDING * 2;
  const chartHeight = height - PADDING * 2;
  const projectX = (v) => PADDING + (v / 100) * chartWidth;
  const projectY = (v) => height - PADDING - (v / 100) * chartHeight;

  const pos = new Map(); // name -> { x, y }
  for (const c of components) {
    pos.set(c.name, { x: projectX(c.evo), y: projectY(c.vis) });
  }

  // ---- pipeline pre-pass: reposition parent square + collect boxes ----
  const pipelineBoxes = [];
  for (const [parentName, childNames] of pipelineChildren) {
    let minX = Infinity;
    let maxX = -Infinity;
    let y = 0;
    for (const cn of childNames) {
      const p = pos.get(cn);
      if (p) {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        y = p.y;
      }
    }
    if (minX === Infinity) {
      continue;
    }
    const parentPos = pos.get(parentName);
    if (parentPos) {
      parentPos.x = (minX + maxX) / 2;
      parentPos.y = y - PIPELINE_BOX_HEIGHT / 2 - SQUARE_SIZE / 6;
    }
    pipelineBoxes.push({
      x: minX - PIPELINE_BOX_PADDING,
      y: y - PIPELINE_BOX_HEIGHT / 2,
      width: maxX - minX + PIPELINE_BOX_PADDING * 2,
      height: PIPELINE_BOX_HEIGHT,
    });
  }

  // ---- 3. build LabelBox[] + Obstacle[] (mirror buildPlacement) ----
  const markerRadius = (c) => {
    if (c.isPipelineParent) {
      return SQUARE_SIZE;
    }
    return c.decorator ? NODE_RADIUS * 2 : NODE_RADIUS;
  };

  const labels = [];
  const obstacles = [];
  let priority = 0;
  const boxByName = new Map(); // name -> estimated {width,height}

  for (const c of components) {
    const p = pos.get(c.name);
    const box = estimateLabelBox(c.name, LABEL_FONT_SIZE);
    boxByName.set(c.name, box);

    // Existing authored label -> manualRect, so a collision-free one is kept.
    // Component text-anchor:start/baseline:auto; anchor middle/middle.
    let manualRect;
    if (c.manualOffset) {
      const textX = p.x + c.manualOffset.ox;
      const textY = p.y + c.manualOffset.oy;
      manualRect =
        c.kind === 'anchor'
          ? { x: textX - box.width / 2, y: textY - box.height / 2, width: box.width, height: box.height }
          : { x: textX, y: textY - box.height, width: box.width, height: box.height };
    }

    labels.push({
      id: `node:${c.name}`,
      anchor: { x: p.x, y: p.y },
      width: box.width,
      height: box.height,
      kind: c.kind === 'anchor' ? 'anchor' : 'component',
      priority: priority++,
      preferredDirection: c.kind === 'pipeline-child' ? { x: 0, y: 1 } : undefined,
      manualRect,
    });
    obstacles.push({ type: 'circle', x: p.x, y: p.y, radius: markerRadius(c) });
  }

  for (const link of links) {
    const a = pos.get(link.source);
    const b = pos.get(link.target);
    if (a && b) {
      obstacles.push({ type: 'segment', x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }
  for (const box of pipelineBoxes) {
    obstacles.push({ type: 'rect', x: box.x, y: box.y, width: box.width, height: box.height });
  }

  const bounds = { x: PADDING, y: PADDING, width: chartWidth, height: chartHeight };

  // ---- 4. run the engine ----
  const placed = autoPlaceLabels(labels, obstacles, bounds, PLACEMENT_CONFIG);
  const placedById = new Map(placed.map((pl) => [pl.id, pl]));

  // ---- 5. invert each placed rect -> wardley `label [ox, oy]` pixel offset ----
  const offsets = new Map(); // name -> { ox, oy }
  for (const c of components) {
    if (c.kind === 'anchor') {
      continue; // grammar has no anchor label-offset production
    }
    const pl = placedById.get(`node:${c.name}`);
    if (!pl) {
      continue;
    }
    const node = pos.get(c.name);
    const r = pl.rect;
    // Inverse of the manualRect construction above (component form).
    const ox = Math.round(r.x - node.x);
    const oy = Math.round(r.y + r.height - node.y);
    offsets.set(c.name, { ox, oy });
  }

  // ---- 6. rewrite ----
  const outLines = [...lines];
  let changed = 0;
  let total = 0;
  for (const c of components) {
    if (c.kind === 'anchor') {
      continue;
    }
    total++;
    const off = offsets.get(c.name);
    if (!off) {
      continue;
    }
    const token = `label [${off.ox}, ${off.oy}]`;
    const original = outLines[c.lineIndex];
    const next = c.manualOffset
      ? original.replace(/label\s*\[[^\]]*\]/, token)
      : original.replace(']', `] ${token}`);
    if (next !== original) {
      changed++;
    }
    outLines[c.lineIndex] = next;
  }

  return { text: outLines.join('\n'), changed, total };
};

/**
 * Apply `tidyMap` repeatedly until the result is stable.
 *
 * A single `tidyMap` pass is not always a fixpoint: the first pass auto-places
 * an untuned map, and the second pass re-reads every result as an authored
 * `manualRect`, which can shift a few keep-vs-replace decisions. Most maps
 * converge within two passes. A few have two equally-scored candidate slots
 * that flip each pass — a 2-cycle that never reaches a true fixpoint. When a
 * cycle is detected, the lexicographically smallest member is returned so the
 * result is deterministic and `tidyToFixpoint` is idempotent for every input.
 *
 * @param {string} mmdText
 * @param {number} [maxPasses]
 * @returns {{ text: string, changed: boolean, total: number, passes: number }}
 */
export const tidyToFixpoint = (mmdText, maxPasses = 12) => {
  const seen = [mmdText];
  let text = mmdText;
  let total = 0;
  let passes = 0;
  for (; passes < maxPasses; passes++) {
    const r = tidyMap(text);
    total = r.total;
    if (r.text === text) {
      break; // true fixpoint
    }
    const cycleStart = seen.indexOf(r.text);
    if (cycleStart !== -1) {
      // Oscillation — pick a canonical member of the cycle.
      text = seen.slice(cycleStart).reduce((a, b) => (b < a ? b : a));
      break;
    }
    seen.push(r.text);
    text = r.text;
  }
  return { text, changed: text !== mmdText, total, passes };
};

// ---- CLI ----
// Usage:
//   node tools/tidy.mjs <file.mmd>          rewrite the file in place
//   node tools/tidy.mjs --check <file.mmd>  exit 1 if tidying would change it
//   node tools/tidy.mjs --stdout <file.mmd> print the tidied map, do not write
// `process.argv[1]` may be a `node_modules/.bin` symlink when invoked as the
// `wardley-tidy` bin, so resolve it before comparing with this module's path.
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
  // `npx <pkg> wardley-tidy ...` forwards the bin name as a stray arg when the
  // package has a single bin — drop it so the real file arg is found.
  const args = process.argv.slice(2).filter((a) => a !== 'wardley-tidy');
  const check = args.includes('--check');
  const stdout = args.includes('--stdout');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('usage: node tools/tidy.mjs [--check|--stdout] <file.mmd>');
    process.exit(2);
  }
  const path = resolve(file);
  const src = readFileSync(path, 'utf8');
  const { text, changed, total } = tidyToFixpoint(src);
  if (check) {
    if (changed) {
      console.error(`tidy: ${file} would change (${total} labels)`);
      process.exit(1);
    }
    console.error(`tidy: ${file} already tidy`);
    process.exit(0);
  }
  if (stdout) {
    process.stdout.write(text);
    process.exit(0);
  }
  if (changed) {
    writeFileSync(path, text, 'utf8');
    console.error(`tidy: ${file} — ${total} labels tidied`);
  } else {
    console.error(`tidy: ${file} — already tidy`);
  }
}
