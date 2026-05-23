#!/usr/bin/env node
/**
 * Convert an OWM (Online Wardley Maps) file to a Mermaid wardley-beta block.
 *
 * Originated as tests/mermaid-wardley/convert.mjs in this repo (PRs #339,
 * #340, #341, #344), untracked in #348 (commit 4681f146), then evolved at
 * tractorjuice/wardleymap_math_model with explicit-block pipeline handling
 * and evolution-stage quoting, and re-vendored here so /arckit:wardley
 * converts OWM deterministically rather than regenerating wardley-beta
 * by hand.
 *
 * Strategy: always emit double-quoted names. Mermaid's wardley-beta grammar
 * accepts `STRING | ID | NAME_WITH_SPACES` everywhere a name is expected;
 * using STRING (double-quoted) sidesteps every collision at once and keeps
 * output compatible with both 11.14.0 and newer renderers.
 *
 * Why quoting matters:
 *   - Mermaid 11.14.0 does not allow hyphens or slashes in bare names.
 *     Mermaid 11.15.0 allows hyphens that are not part of `->`, but quoted
 *     names remain valid and preserve compatibility with 11.14.0 dashboards.
 *   - Keyword terminals (`label`, `evolve`, `note`, `pipeline`, …) are
 *     matched eagerly at any word boundary; a bare name starting with one
 *     (e.g. `labelling`) is lexed as keyword+suffix and fails.
 *   - Pure-digit names (OWM annotation markers like `1`) aren't valid IDs.
 *
 * Quoting produces `component "real-time processing" [...]` which is
 * parsed as the STRING alternative and accepted verbatim. Internal double
 * quotes inside a name are replaced with single quotes.
 *
 * Usage:
 *   node owm-to-mermaid.mjs <input.owm>      # writes mermaid to stdout
 */
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import process from 'node:process';

function quoteName(name) {
  if (!name) return name;
  name = name.trim();
  if (name.startsWith('"') && name.endsWith('"')) return name;
  return '"' + name.replace(/"/g, "'") + '"';
}

function inlineCommentStrip(s) {
  // remove trailing // comment unless part of a URL (://)
  const m = s.match(/^(.+?)\s+\/\/(?!\/)(.*)$/);
  if (m && !m[1].includes('://')) return m[1].trim();
  return s;
}

export function convert(owm, filename = '') {
  const lines = owm.split('\n');
  const out = ['wardley-beta'];
  let hasTitle = false;

  // ── Pass 1: sourcing, component coords, pipeline ranges
  const sourcing = {};               // name(lower) → 'build'|'buy'|'outsource'
  const compCoords = {};             // name(orig-case) → {vis, evo}
  const pipelineRanges = {};         // name(orig-case) → {min, max}
  const explicitBlockPipelines = new Set();

  const SRC_RE  = /^(build|buy|outsource)\s+(.+)$/i;
  const COMP_RE = /^component\s+(.+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/i;
  const PIPE_RE = /^pipeline\s+(.+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]\s*$/i;

  // Pre-scan for `pipeline X [min, max]` followed by `{`
  let pendingExplicit = null;
  for (const raw of lines) {
    const s = raw.trim();
    if (!s || s.startsWith('//')) continue;
    if (pendingExplicit !== null) {
      if (s === '{') explicitBlockPipelines.add(pendingExplicit);
      pendingExplicit = null;
    }
    const mp = s.match(PIPE_RE);
    if (mp) pendingExplicit = mp[1].trim();
  }

  for (const raw of lines) {
    const s = raw.trim();
    if (s.startsWith('//')) continue;
    const ms = s.match(SRC_RE);
    if (ms) {
      sourcing[ms[2].trim().toLowerCase()] = ms[1].toLowerCase();
      continue;
    }
    const mc = s.match(COMP_RE);
    if (mc) {
      const ml = s.match(/\blabel\s*\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]/i);
      compCoords[mc[1].trim()] = {
        vis: parseFloat(mc[2]),
        evo: parseFloat(mc[3]),
        label: ml ? [parseInt(ml[1], 10), parseInt(ml[2], 10)] : null,
      };
    }
    const mp = s.match(PIPE_RE);
    if (mp) {
      pipelineRanges[mp[1].trim()] = { min: parseFloat(mp[2]), max: parseFloat(mp[3]) };
    }
  }

  // ── Pass 1b: proximity-detect pipeline children (skip explicit-block pipelines)
  const pipelineChildren = {};
  const isPipelineChild = new Set();
  for (const [pipeName, rng] of Object.entries(pipelineRanges)) {
    if (explicitBlockPipelines.has(pipeName)) continue;
    const parent = compCoords[pipeName];
    if (!parent) continue;
    const children = [];
    for (const [cName, cCoord] of Object.entries(compCoords)) {
      if (cName === pipeName) continue;
      if (isPipelineChild.has(cName)) continue;
      if (Math.abs(cCoord.vis - parent.vis) <= 0.05 &&
          cCoord.evo >= rng.min - 0.01 && cCoord.evo <= rng.max + 0.01) {
        children.push({ name: cName, evo: cCoord.evo, label: cCoord.label });
      }
    }
    if (children.length > 0) {
      children.sort((a, b) => a.evo - b.evo);
      pipelineChildren[pipeName] = children;
      for (const c of children) isPipelineChild.add(c.name);
    }
  }

  // ── Pass 2: emit
  let inPipelineBlock = false;
  let pendingPipelineName = null;

  const DROP_SINGLE_RE   = /^(ecosystem|submap|url|pioneer|settler|townplanner)\s+/i;
  const MARKET_DROP_RE   = /^market\s+[^\[\]]+\[\s*[\d.]+\s*,/i;
  const AXIS_DROP_RE     = /^[xy]-axis\s+/i;
  const STYLE_WARDLEY_RE = /^style\s+wardley\s*$/i;
  const BBO_RE           = /^(build|buy|outsource)\s+/i;

  for (const raw of lines) {
    let s = raw.trim();
    if (!s) { out.push(''); continue; }
    if (s.startsWith('//')) continue;
    s = inlineCommentStrip(s);
    if (!s) continue;

    // A pending-pipeline-parent is only consumed by an immediately-following
    // `{`. Any other non-blank directive clears the pending slot.
    if (pendingPipelineName && s !== '{') pendingPipelineName = null;

    if (STYLE_WARDLEY_RE.test(s)) continue;
    if (BBO_RE.test(s))           continue;
    if (AXIS_DROP_RE.test(s))     continue;
    if (MARKET_DROP_RE.test(s))   continue;
    if (DROP_SINGLE_RE.test(s))   continue;

    // title
    if (/^title\s+/i.test(s)) {
      out.push(s);
      out.push('size [1100, 800]');
      hasTitle = true;
      continue;
    }

    // evolution — quote every stage name and secondaryName
    const me = s.match(/^evolution\s+(.+)$/i);
    if (me) {
      const stages = me[1].split('->').map(p => p.trim());
      const parts = [];
      for (const stage of stages) {
        let work = stage;
        let boundary = null;
        let secondary = null;
        if (work.includes('@')) {
          const idx = work.indexOf('@');
          const head = work.slice(0, idx);
          const tail = work.slice(idx + 1);
          work = head.trim();
          const mb = tail.match(/^\s*([\d.]+)\s*(.*)$/);
          if (mb) {
            boundary = mb[1];
            const after = mb[2].trim();
            if (after.startsWith('/')) secondary = after.slice(1).trim();
          }
        }
        if (work.includes('/') && secondary === null) {
          const idx = work.indexOf('/');
          secondary = work.slice(idx + 1).trim();
          work = work.slice(0, idx).trim();
        }
        let piece = quoteName(work);
        if (boundary) piece += `@${boundary}`;
        if (secondary) piece += ` / ${quoteName(secondary)}`;
        parts.push(piece);
      }
      out.push('evolution ' + parts.join(' -> '));
      continue;
    }

    // anchor
    const ma = s.match(/^anchor\s+(.+?)\s*(\[[\d.,\s]+\])/i);
    if (ma) {
      out.push(`anchor ${quoteName(ma[1].trim())} ${ma[2]}`);
      continue;
    }

    // pipeline X [min, max] — set pending so a following `{` opens a block
    const mpr = s.match(PIPE_RE);
    if (mpr) {
      pendingPipelineName = quoteName(mpr[1].trim());
      continue;
    }

    // pipeline X  or  pipeline X { ... }
    const mpb = s.match(/^pipeline\s+(.+?)(?:\s*\{)?\s*$/i);
    if (/^pipeline\s+/i.test(s) && !/\[\d/.test(s) && mpb) {
      const pname = quoteName(mpb[1].trim());
      if (s.includes('{')) {
        out.push(`pipeline ${pname} {`);
        inPipelineBlock = true;
      } else {
        pendingPipelineName = pname;
      }
      continue;
    }
    if (pendingPipelineName && s === '{') {
      out.push(`pipeline ${pendingPipelineName} {`);
      inPipelineBlock = true;
      pendingPipelineName = null;
      continue;
    }
    if ((inPipelineBlock || pendingPipelineName) && s === '}') {
      if (pendingPipelineName) {
        pendingPipelineName = null;
      } else {
        out.push('}');
        inPipelineBlock = false;
      }
      continue;
    }

    // component
    const mcomp = s.match(/^component\s+(.+?)\s*(\[[\d.,\s]+\])/i);
    if (mcomp) {
      const cname = mcomp[1].trim();
      const coords = mcomp[2];
      const hasInertia = /\binertia\s*$/i.test(s);
      const inlineSrcMatch = s.match(/\((build|buy|outsource)\)/i);
      const inlineSrc = inlineSrcMatch ? inlineSrcMatch[1].toLowerCase() : null;
      // Preserve `label [dx, dy]` from the remainder after the coord closing `]`.
      // Label offsets are integers in the Label grammar (INT, not WARDLEY_NUMBER).
      const coordsEnd = s.indexOf(coords) + coords.length;
      const tail = s.slice(coordsEnd);
      const mlabel = tail.match(/\blabel\s*\[\s*(-?\d+)\s*,\s*(-?\d+)\s*\]/i);
      const labelSuffix = mlabel ? ` label [${mlabel[1]}, ${mlabel[2]}]` : '';
      if (isPipelineChild.has(cname)) continue;
      const qname = quoteName(cname);

      if (inPipelineBlock) {
        let inner = coords.replace(/[\[\]]/g, '').trim();
        // Pipeline-child grammar only takes evolution; drop visibility if 2 coords
        const parts = inner.split(',').map(p => p.trim());
        if (parts.length === 2) inner = parts[1];
        out.push(`  component ${qname} [${inner}]${labelSuffix}`);
      } else {
        let line = `component ${qname} ${coords}${labelSuffix}`;
        const decorators = [];
        const src = inlineSrc || sourcing[cname.toLowerCase()];
        if (src) decorators.push(`(${src})`);
        if (hasInertia) decorators.push('(inertia)');
        if (decorators.length) line += ' ' + decorators.join(' ');
        out.push(line);

        const children = pipelineChildren[cname];
        if (children) {
          out.push(`pipeline ${qname} {`);
          for (const ch of children) {
            const childLabel = ch.label ? ` label [${ch.label[0]}, ${ch.label[1]}]` : '';
            out.push(`  component ${quoteName(ch.name)} [${ch.evo}]${childLabel}`);
          }
          out.push('}');
        }
      }
      continue;
    }

    // evolve — anchor target at end so quoted names with embedded digits
    // (e.g. "Foo (Project 003)") aren't mis-parsed by the lazy name group.
    const mev = s.match(/^evolve\s+(.+?)\s+([\d.]+)\s*$/i);
    if (mev) {
      out.push(`evolve ${quoteName(mev[1].trim())} ${mev[2]}`);
      continue;
    }

    // note "text" [v, e]
    const mn = s.match(/^note\s+(.+?)\s+(\[[\d.,\s]+\])\s*$/i);
    if (mn) {
      let text = mn[1].trim();
      const coord = mn[2];
      const lblIdx = text.lastIndexOf('] label ');
      if (lblIdx > 0) text = text.slice(0, lblIdx + 1);
      text = text.replace(/^"|"$/g, '');
      out.push(`note "${text.replace(/"/g, "'")}" ${coord}`);
      continue;
    }

    // annotations [x, y]
    if (/^annotations\s+\[/i.test(s)) { out.push(s); continue; }

    // annotation N, [x, y] text
    const man = s.match(/^annotation\s+(\d+)\s*,?\s*(\[[\d.,\s]+\])\s*(.*)$/i);
    if (man) {
      const num = man[1];
      const coords = man[2];
      let text = man[3].trim();
      if (text && !text.startsWith('"')) text = '"' + text.replace(/"/g, "'") + '"';
      out.push(text ? `annotation ${num},${coords} ${text}` : `annotation ${num},${coords}`);
      continue;
    }

    // link (edge)
    if (s.includes('->') && !/^(evolve|component|pipeline|anchor|note)\s/i.test(s)) {
      let link = s;
      let annotation = '';
      const semi = link.indexOf(';');
      if (semi > 0) { annotation = link.slice(semi); link = link.slice(0, semi).trim(); }
      const arrow = link.indexOf('->');
      if (arrow > 0) {
        const left  = quoteName(link.slice(0, arrow).trim());
        const right = quoteName(link.slice(arrow + 2).trim());
        link = `${left} -> ${right}`;
      }
      out.push(link + annotation);
      continue;
    }

    // unknown — silently skip
  }

  // Synthesise a title from filename if none was declared
  if (!hasTitle && filename) {
    const base = basename(filename).replace(/\.\w+$/, '').replace(/[-_]/g, ' ');
    out.splice(1, 0, `title ${base}`, 'size [1100, 800]');
  }

  // Collapse consecutive blank lines
  const cleaned = [];
  let lastEmpty = false;
  for (const ln of out) {
    if (ln === '') {
      if (!lastEmpty) cleaned.push(ln);
      lastEmpty = true;
    } else {
      cleaned.push(ln);
      lastEmpty = false;
    }
  }
  return cleaned.join('\n');
}

function main() {
  if (process.argv.length < 3) {
    console.error('usage: owm-to-mermaid.mjs <file.owm>');
    process.exit(2);
  }
  const src = process.argv[2];
  const mermaid = convert(readFileSync(src, 'utf8'), src);
  process.stderr.write(`${basename(src)}: ${mermaid.split('\n').length} lines emitted\n`);
  console.log(mermaid);
}

// Only run main if invoked directly (allows import as a module)
if (import.meta.url === `file://${process.argv[1]}`) main();
