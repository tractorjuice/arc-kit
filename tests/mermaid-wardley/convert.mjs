/**
 * Shared OWM → Mermaid wardley-beta converter + file walker.
 * Consumed by test-real-maps.mjs (syntax validation) and
 * test-fidelity.mjs (conversion-fidelity comparison).
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

// Characters that require quoting in the Mermaid wardley-beta grammar
// Includes hyphen (-) because it triggers arrow parsing (->)
export const NEEDS_QUOTING = /[&/+?'.<>=:%#(){};!@$^~`\\|[\]\-]/;

// Keywords that shadow grammar terminals and need quoting
export const KEYWORDS = new Set([
  'market', 'build', 'buy', 'outsource', 'inertia', 'pipeline', 'evolve',
  'anchor', 'component', 'note', 'title', 'size', 'evolution', 'annotations',
  'annotation', 'accelerator', 'deaccelerator', 'label',
]);

// wardley-beta requires integer label offsets. OWM sources occasionally carry
// fractional offsets (legacy renderers allowed them); round to the nearest
// integer so the Mermaid parser accepts them. Returns null if the label
// string doesn't parse as two numbers.
function normaliseLabel(labelStr) {
  if (!labelStr) return null;
  const m = labelStr.match(/\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/);
  if (!m) return null;
  return `[${Math.round(parseFloat(m[1]))}, ${Math.round(parseFloat(m[2]))}]`;
}

// Matches the Mermaid wardley-beta NAME_WITH_SPACES terminal verbatim:
//   [A-Za-z][A-Za-z0-9_()&]*(?:[ \t]+[A-Za-z(][A-Za-z0-9_()&]*)*
// A name is safe unquoted iff it matches this; anything else (hyphens,
// dots, slashes, digit-start, standalone ampersand between spaces, etc.)
// must be wrapped in "..." — which the grammar accepts as STRING in every
// place a name appears.
const SAFE_NAME = /^[A-Za-z][A-Za-z0-9_()&]*(?:[ \t]+[A-Za-z(][A-Za-z0-9_()&]*)*$/;

// Keywords that shadow grammar terminals. These must be quoted when they
// appear either (a) as the first *word* of a name (e.g. `build release
// cycle`) OR (b) as a prefix of the first word followed by letters
// (e.g. `labelling`, `marketplace`, `evolved`, `building`) — the Mermaid
// lexer tokenises the keyword greedily in both cases.
const RESERVED_PREFIXES = [
  'market', 'build', 'buy', 'outsource', 'inertia', 'pipeline', 'evolve',
  'anchor', 'component', 'note', 'title', 'size', 'evolution', 'annotation',
  'annotations', 'accelerator', 'deaccelerator', 'label',
];

function startsWithReserved(name) {
  const first = name.split(/\s+/, 1)[0].toLowerCase();
  for (const kw of RESERVED_PREFIXES) {
    if (first === kw) return true;
    if (first.length > kw.length && first.startsWith(kw) && /[a-z]/.test(first[kw.length])) {
      return true;
    }
  }
  return false;
}

export function quoteName(name) {
  if (!name) return name;
  if (name.startsWith('"') && name.endsWith('"')) return name;
  if (SAFE_NAME.test(name) && !startsWithReserved(name)) {
    return name;
  }
  return `"${name.replace(/"/g, "'")}"`;
}

export function findMapFiles(dir) {
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
        const name = entry.name;
        if (name === 'LICENSE' || name === '.DS_Store' || name === 'README.md') continue;
        // Skip binaries, docs, scripts, and our own generated Mermaid output
        if (/\.(svg|png|jpg|jpeg|gif|md|txt|mmd|mjs|js|ts|json|ya?ml)$/i.test(name)) continue;
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

export function owmToMermaid(owmContent, filename) {
  const lines = owmContent.split('\n');
  const mermaidLines = ['wardley-beta'];
  let hasTitleLine = false;

  // ── PASS 1: Collect metadata for pipeline child detection ──
  const sourcing = {};
  const compCoords = {};
  const pipelineRanges = {};
  // Pipelines whose range declaration is followed (possibly across a blank
  // line) by an explicit `{` block. Their children inside `{}` are
  // authoritative; PASS 1b should not also auto-inject implicit children.
  const pipelinesWithExplicitBlock = new Set();

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('//')) continue;

    const srcMatch = trimmed.match(/^(build|buy|outsource)\s+(.+)/i);
    if (srcMatch) {
      sourcing[srcMatch[2].trim().toLowerCase()] = srcMatch[1].toLowerCase();
    }

    const compMatch = trimmed.match(/^component\s+(.+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\](.*)$/);
    if (compMatch) {
      const labelMatch = compMatch[4].match(/\blabel\s+(\[-?[\d.,\s-]+\])/);
      compCoords[compMatch[1].trim()] = {
        vis: parseFloat(compMatch[2]),
        evo: parseFloat(compMatch[3]),
        label: labelMatch ? labelMatch[1] : null,
      };
    }

    const pipeMatch = trimmed.match(/^pipeline\s+(.+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]\s*(\{?)\s*$/);
    if (pipeMatch) {
      const name = pipeMatch[1].trim();
      pipelineRanges[name] = {
        min: parseFloat(pipeMatch[2]),
        max: parseFloat(pipeMatch[3]),
      };
      // Explicit block on same line: `pipeline X [a,b] {`
      if (pipeMatch[4] === '{') {
        pipelinesWithExplicitBlock.add(name);
      } else {
        // Look ahead for a `{` on a following line (skipping blanks/comments)
        for (let j = i + 1; j < lines.length; j++) {
          const t = lines[j].trim();
          if (!t || t.startsWith('//')) continue;
          if (t === '{' || t.startsWith('{')) pipelinesWithExplicitBlock.add(name);
          break;
        }
      }
    }
  }

  // ── PASS 1b: Detect pipeline children ──
  const pipelineChildren = {};
  const isPipelineChild = new Set();

  for (const [pipeName, range] of Object.entries(pipelineRanges)) {
    // Pipelines with an explicit `{ ... }` block own their children directly;
    // skip implicit vis/evo proximity detection for those.
    if (pipelinesWithExplicitBlock.has(pipeName)) continue;

    const parent = compCoords[pipeName];
    if (!parent) continue;

    const children = [];
    for (const [cName, cCoord] of Object.entries(compCoords)) {
      if (cName === pipeName) continue;
      if (isPipelineChild.has(cName)) continue;
      if (Math.abs(cCoord.vis - parent.vis) <= 0.05 &&
          cCoord.evo >= range.min - 0.01 && cCoord.evo <= range.max + 0.01) {
        children.push({ name: cName, evo: cCoord.evo, label: cCoord.label });
      }
    }

    if (children.length > 0) {
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

    if (!trimmed) {
      mermaidLines.push('');
      continue;
    }

    if (trimmed.startsWith('//')) continue;

    const commentMatch = trimmed.match(/^(.+?)\s+\/\/(?!\/)(.*)$/);
    if (commentMatch && !commentMatch[1].includes('://')) {
      trimmed = commentMatch[1].trim();
    }
    if (!trimmed) continue;

    if (/^style\s+wardley\s*$/i.test(trimmed)) continue;
    if (/^(build|buy|outsource)\s+/i.test(trimmed)) continue;
    if (/^[xy]-axis\s+/i.test(trimmed)) continue;
    // Skip OWM `market <name> [vis, evo]` directive only — don't accidentally
    // swallow links whose source component is named "Market ..." (e.g.,
    // `Market segmentation -> Last Mile`).
    if (/^market\s+[^[\]]+\[\s*[\d.]+\s*,/i.test(trimmed)) continue;
    if (/^(ecosystem|submap|url|pioneer|settler|townplanner)\s+/i.test(trimmed)) continue;

    if (/^title\s+/i.test(trimmed)) {
      mermaidLines.push(trimmed);
      mermaidLines.push('size [1100, 800]');
      hasTitleLine = true;
      continue;
    }

    if (/^evolution\s+/i.test(trimmed)) {
      mermaidLines.push(trimmed);
      continue;
    }

    if (/^anchor\s+/i.test(trimmed)) {
      // wardley-beta's `anchor` rule doesn't accept a `label` clause; drop any
      // OWM label on anchors and emit the bare anchor. Components keep them.
      const anchorMatch = trimmed.match(/^anchor\s+(.+?)\s*(\[[\d.,\s]+\])/);
      if (anchorMatch) {
        const qName = quoteName(anchorMatch[1].trim());
        mermaidLines.push(`anchor ${qName} ${anchorMatch[2]}`);
      }
      continue;
    }

    // OWM `pipeline X [min, max]` with optional trailing `{`. If the pipeline
    // has an explicit `{ ... }` block (same line or next), open a Mermaid
    // pipeline block using the parent's name. Otherwise skip — children are
    // injected via the implicit detection in PASS 1b.
    const pipeRangeMatch = trimmed.match(/^pipeline\s+(.+?)\s*\[\s*[\d.]+\s*,\s*[\d.]+\s*\]\s*(\{?)\s*$/i);
    if (pipeRangeMatch) {
      const name = pipeRangeMatch[1].trim();
      if (pipelinesWithExplicitBlock.has(name)) {
        const pName = quoteName(name);
        if (pipeRangeMatch[2] === '{') {
          mermaidLines.push(`pipeline ${pName} {`);
          inPipelineBlock = true;
        } else {
          pendingPipelineName = pName;
        }
      }
      continue;
    }

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

    if (pendingPipelineName && trimmed === '{') {
      mermaidLines.push(`pipeline ${pendingPipelineName} {`);
      inPipelineBlock = true;
      pendingPipelineName = null;
      continue;
    }

    if ((inPipelineBlock || pendingPipelineName) && trimmed === '}') {
      if (pendingPipelineName) {
        pendingPipelineName = null;
      } else {
        mermaidLines.push('}');
        inPipelineBlock = false;
      }
      continue;
    }

    if (/^component\s+/i.test(trimmed)) {
      const compMatch = trimmed.match(/^component\s+(.+?)\s*(\[[\d.,\s]+\])(.*)$/);
      if (!compMatch) continue;

      const compName = compMatch[1].trim();
      const coords = compMatch[2];
      const rest = compMatch[3];
      const hasInertia = /\binertia\s*$/i.test(trimmed);
      const rawLabelMatch = rest.match(/\blabel\s+(\[[^\]]+\])/);
      const label = normaliseLabel(rawLabelMatch && rawLabelMatch[1]);

      if (isPipelineChild.has(compName)) continue;

      const qName = quoteName(compName);

      let line;
      if (inPipelineBlock) {
        const innerCoord = coords.replace(/[\[\]]/g, '').trim();
        line = `  component ${qName.startsWith('"') ? qName : `"${compName}"`} [${innerCoord}]`;
      } else {
        line = `component ${qName} ${coords}`;
      }

      // wardley-beta requires `label` to precede decorators, so append it
      // before the (build)/(buy)/(outsource)/(inertia) markers.
      if (label) line += ` label ${label}`;

      const decorators = [];
      if (sourcing[compName.toLowerCase()]) {
        decorators.push(`(${sourcing[compName.toLowerCase()]})`);
      }
      if (hasInertia) decorators.push('(inertia)');
      if (decorators.length > 0) line += ' ' + decorators.join(' ');

      mermaidLines.push(line);

      if (pipelineChildren[compName] && !inPipelineBlock) {
        mermaidLines.push(`pipeline ${qName} {`);
        for (const child of pipelineChildren[compName]) {
          let childLine = `  component ${quoteName(child.name)} [${child.evo}]`;
          const childLabel = normaliseLabel(child.label);
          if (childLabel) childLine += ` label ${childLabel}`;
          mermaidLines.push(childLine);
        }
        mermaidLines.push('}');
      }

      continue;
    }

    if (/^evolve\s+/i.test(trimmed)) {
      // Require the position to be a properly-formed number followed by
      // whitespace or EOL — avoids misparsing names containing ".X" (e.g.
      // `evolve Lamp / .Net 0.72` would previously capture "." as position).
      const evolveMatch = trimmed.match(/^evolve\s+(.+?)\s+(\d+(?:\.\d+)?)(?=\s|$)/i);
      if (evolveMatch) {
        const eName = quoteName(evolveMatch[1].trim());
        mermaidLines.push(`evolve ${eName} ${evolveMatch[2]}`);
      }
      continue;
    }

    if (/^note\s+/i.test(trimmed)) {
      const noteMatch = trimmed.match(/^note\s+(.+)\s+(\[[\d.,\s]+\])\s*$/i);
      if (noteMatch) {
        let noteText = noteMatch[1].trim();
        const noteCoord = noteMatch[2];
        const labelIdx = noteText.lastIndexOf('] label ');
        if (labelIdx > 0) {
          noteText = noteText.substring(0, labelIdx + 1);
        }
        noteText = noteText.replace(/^"/, '').replace(/"$/, '');
        noteText = `"${noteText.replace(/"/g, "'")}"`;
        mermaidLines.push(`note ${noteText} ${noteCoord}`);
      }
      continue;
    }

    if (/^annotations\s+\[/i.test(trimmed)) {
      mermaidLines.push(trimmed);
      continue;
    }

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

    if (trimmed.includes('->') && !/^(evolve|component|pipeline|anchor|note)\s/i.test(trimmed)) {
      let linkLine = trimmed;

      let annotation = '';
      const semiIdx = linkLine.indexOf(';');
      if (semiIdx > 0) {
        annotation = linkLine.substring(semiIdx);
        linkLine = linkLine.substring(0, semiIdx).trim();
      }

      const arrowIdx = linkLine.indexOf('->');
      if (arrowIdx > 0) {
        let left = linkLine.substring(0, arrowIdx).trim();
        let right = linkLine.substring(arrowIdx + 2).trim();

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
  }

  if (!hasTitleLine) {
    const defaultTitle = basename(filename).replace(/\.\w+$/, '').replace(/[-_]/g, ' ');
    mermaidLines.splice(1, 0, `title ${defaultTitle}`, 'size [1100, 800]');
  }

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
