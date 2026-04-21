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

export function quoteName(name) {
  if (!name) return name;
  if (name.startsWith('"') && name.endsWith('"')) return name;
  // Always quote — safest approach to avoid keyword collisions
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
        if (/\.(svg|png|jpg|jpeg|gif|md|txt)$/i.test(name)) continue;
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

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('//')) continue;

    const srcMatch = trimmed.match(/^(build|buy|outsource)\s+(.+)/i);
    if (srcMatch) {
      sourcing[srcMatch[2].trim().toLowerCase()] = srcMatch[1].toLowerCase();
    }

    const compMatch = trimmed.match(/^component\s+(.+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/);
    if (compMatch) {
      compCoords[compMatch[1].trim()] = {
        vis: parseFloat(compMatch[2]),
        evo: parseFloat(compMatch[3]),
      };
    }

    const pipeMatch = trimmed.match(/^pipeline\s+(.+?)\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]\s*$/);
    if (pipeMatch) {
      pipelineRanges[pipeMatch[1].trim()] = {
        min: parseFloat(pipeMatch[2]),
        max: parseFloat(pipeMatch[3]),
      };
    }
  }

  // ── PASS 1b: Detect pipeline children ──
  const pipelineChildren = {};
  const isPipelineChild = new Set();

  for (const [pipeName, range] of Object.entries(pipelineRanges)) {
    const parent = compCoords[pipeName];
    if (!parent) continue;

    const children = [];
    for (const [cName, cCoord] of Object.entries(compCoords)) {
      if (cName === pipeName) continue;
      if (isPipelineChild.has(cName)) continue;
      if (Math.abs(cCoord.vis - parent.vis) <= 0.05 &&
          cCoord.evo >= range.min - 0.01 && cCoord.evo <= range.max + 0.01) {
        children.push({ name: cName, evo: cCoord.evo });
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
      const anchorMatch = trimmed.match(/^anchor\s+(.+?)\s*(\[[\d.,\s]+\])/);
      if (anchorMatch) {
        const qName = quoteName(anchorMatch[1].trim());
        mermaidLines.push(`anchor ${qName} ${anchorMatch[2]}`);
      }
      continue;
    }

    if (/^pipeline\s+.+\[\s*[\d.]+\s*,\s*[\d.]+\s*\]\s*$/.test(trimmed)) {
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
      const compMatch = trimmed.match(/^component\s+(.+?)\s*(\[[\d.,\s]+\])/);
      if (!compMatch) continue;

      const compName = compMatch[1].trim();
      const coords = compMatch[2];
      const hasInertia = /\binertia\s*$/i.test(trimmed);

      if (isPipelineChild.has(compName)) continue;

      const qName = quoteName(compName);

      let line;
      if (inPipelineBlock) {
        const innerCoord = coords.replace(/[\[\]]/g, '').trim();
        line = `  component ${qName.startsWith('"') ? qName : `"${compName}"`} [${innerCoord}]`;
      } else {
        line = `component ${qName} ${coords}`;
      }

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
          mermaidLines.push(`  component ${quoteName(child.name)} [${child.evo}]`);
        }
        mermaidLines.push('}');
      }

      continue;
    }

    if (/^evolve\s+/i.test(trimmed)) {
      const evolveMatch = trimmed.match(/^evolve\s+(.+?)\s+([\d.]+)/i);
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
