#!/usr/bin/env node
/**
 * Parse OnlineWardleyMaps (OWM) source into a plain, renderer-agnostic object.
 *
 * Extracted so `/arckit:wardley` has exactly one OWM reading of record. The
 * dialect accepted here is the one `/arckit:wardley` emits and that
 * `owm-to-mermaid.mjs` already converts (PRs #339-#344, #508): components with
 * `[visibility, evolution]`, label offsets, pipelines in both the coordinate
 * and explicit-block forms, evolve targets, annotations, notes, anchors,
 * `build`/`buy`/`outsource` sourcing directives and `inertia`.
 *
 * Coordinates follow OWM convention: visibility 0.0 (bottom of the value
 * chain) to 1.0 (top, visible to the user); evolution 0.0 (Genesis) to 1.0
 * (Commodity).
 *
 * Usage:
 *   import { parseOwm } from './owm-parse.mjs';
 *   const map = parseOwm(readFileSync('map.owm', 'utf8'));
 */

/** Evolution stage boundaries, per Wardley's standard four-stage axis. */
export const EVOLUTION_STAGES = [
  { name: 'Genesis', min: 0.0, max: 0.25 },
  { name: 'Custom Built', min: 0.25, max: 0.5 },
  { name: 'Product (+rental)', min: 0.5, max: 0.75 },
  { name: 'Commodity (+utility)', min: 0.75, max: 1.0 },
];

/** Return the evolution stage name for an evolution coordinate. */
export function stageFor(evo) {
  if (!Number.isFinite(evo)) return null;
  for (const stage of EVOLUTION_STAGES) {
    if (evo < stage.max) return stage.name;
  }
  return EVOLUTION_STAGES[EVOLUTION_STAGES.length - 1].name;
}

/** Strip a trailing `// comment`, leaving `://` inside URLs intact. */
function stripInlineComment(line) {
  const m = line.match(/^(.+?)\s+\/\/(?!\/)(.*)$/);
  if (m && !m[1].includes('://')) return m[1].trim();
  return line;
}

/** Remove surrounding double quotes from an OWM name. */
function unquote(name) {
  if (!name) return '';
  const trimmed = name.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

const COMPONENT_RE = /^(component|anchor)\s+(.+?)\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*(.*)$/i;
// A pipeline child declared inside a `{ … }` block carries only an evolution
// coordinate; its visibility is the parent's. `/arckit:wardley`'s own worked
// example uses this form (`component "Text-Based Guidance" [0.25]`), and
// owm-to-mermaid.mjs emits it, so rejecting it desynchronised the HTML and
// Mermaid renderings of the same map.
const COMPONENT_EVO_ONLY_RE = /^(component|anchor)\s+(.+?)\s*\[\s*(-?[\d.]+)\s*\]\s*(.*)$/i;
const PIPELINE_COORD_RE = /^pipeline\s+(.+?)\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*$/i;
const PIPELINE_BARE_RE = /^pipeline\s+(.+?)(?:\s*\{)?\s*$/i;
const EVOLVE_RE = /^evolve\s+(.+?)\s+(-?[\d.]+)\s*(?:label\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\])?\s*(?:label\s+(.+))?$/i;
const LINK_RE = /^(.+?)\s*(->|\+>|\+<>)\s*(.+)$/;
// `annotation 1 [v, e] text` and the comma form `annotation 1,[v, e] "text"`
// are both current OWM; the second is what owm-to-mermaid.mjs re-emits and what
// the worked example in commands/wardley.md uses. The coordinate group is
// greedy so a multi-point `[[v,e],[v,e]]` list is captured whole rather than
// truncated at the first `]`.
const ANNOTATION_RE = /^annotation\s+(\d+)\s*,?\s*\[(.+)\]\s*(.*)$/i;
const ANNOTATIONS_BOX_RE = /^annotations\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*$/i;
const NOTE_RE = /^note\s+(.+?)\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]\s*$/i;
const SOURCING_RE = /^(build|buy|outsource)\s+(.+)$/i;
const LABEL_RE = /\blabel\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/i;
const TITLE_RE = /^title\s+(.+)$/i;

/**
 * Resolve a LINK_RE match into a link, or null when either endpoint is not a
 * declared component.
 *
 * Returning null (rather than warning) lets Pass 2 use this as a test for
 * "is this line really a dependency?" before the directive keyword skip-list
 * runs, so a component whose name begins with a keyword still links correctly.
 */
function parseLink(match, byName) {
  // A link label may follow the target: `A -> B label`.
  let toRaw = match[3].trim();
  let label = null;
  if (toRaw.startsWith('"')) {
    const close = toRaw.indexOf('"', 1);
    if (close > 0) {
      const after = toRaw.slice(close + 1).trim();
      if (after) label = after;
      toRaw = toRaw.slice(0, close + 1);
    }
  }
  const from = unquote(match[1]);
  const to = unquote(toRaw);
  if (!byName.has(from) || !byName.has(to)) return null;
  return { from, to, flow: match[2] !== '->', label };
}

/**
 * Parse OWM text.
 *
 * @param {string} source OWM source text.
 * @returns {{
 *   title: string|null,
 *   components: Array<object>,
 *   links: Array<{from: string, to: string, flow: boolean, label: string|null}>,
 *   pipelines: Array<{name: string, min: number|null, max: number|null, children: string[]}>,
 *   annotations: Array<{number: number, points: Array<{vis: number, evo: number}>, text: string}>,
 *   annotationsBox: {vis: number, evo: number}|null,
 *   notes: Array<{text: string, vis: number, evo: number}>,
 *   warnings: string[]
 * }}
 */
export function parseOwm(source) {
  const lines = String(source ?? '').split('\n');
  const warnings = [];

  let title = null;
  const components = [];
  const byName = new Map();
  const links = [];
  const pipelineOrder = [];
  const pipelines = new Map();
  const annotations = [];
  const notes = [];
  let annotationsBox = null;
  const sourcing = new Map();
  const explicitBlocks = new Map();

  // ── Pass 1: components, pipelines, sourcing, explicit pipeline blocks.
  let pendingPipeline = null;
  let openBlock = null;

  for (const raw of lines) {
    let line = raw.trim();
    if (!line || line.startsWith('//')) continue;
    line = stripInlineComment(line);
    if (!line) continue;

    // An explicit `pipeline X` / `{` ... `}` block claims its children by name.
    if (openBlock) {
      if (line === '}') { openBlock = null; continue; }
      const child = line.match(COMPONENT_RE) || line.match(COMPONENT_EVO_ONLY_RE);
      if (child) {
        explicitBlocks.get(openBlock).push(unquote(child[2]));
      }
      // fall through so the child is also registered as a component
    }

    if (pendingPipeline && line === '{') {
      openBlock = pendingPipeline;
      if (!explicitBlocks.has(openBlock)) explicitBlocks.set(openBlock, []);
      pendingPipeline = null;
      continue;
    }
    if (pendingPipeline && line !== '{') pendingPipeline = null;

    const mSource = line.match(SOURCING_RE);
    if (mSource && !/\[/.test(line)) {
      sourcing.set(unquote(mSource[2]).toLowerCase(), mSource[1].toLowerCase());
      continue;
    }

    const mPipeCoord = line.match(PIPELINE_COORD_RE);
    if (mPipeCoord) {
      const name = unquote(mPipeCoord[1]);
      if (!pipelines.has(name)) pipelineOrder.push(name);
      pipelines.set(name, {
        name,
        min: parseFloat(mPipeCoord[2]),
        max: parseFloat(mPipeCoord[3]),
        children: [],
      });
      pendingPipeline = name;
      continue;
    }

    if (/^pipeline\s+/i.test(line) && !/\[\s*-?[\d.]/.test(line)) {
      const mPipeBare = line.match(PIPELINE_BARE_RE);
      if (mPipeBare) {
        const name = unquote(mPipeBare[1]);
        if (!pipelines.has(name)) {
          pipelineOrder.push(name);
          pipelines.set(name, { name, min: null, max: null, children: [] });
        }
        if (line.includes('{')) {
          openBlock = name;
          if (!explicitBlocks.has(name)) explicitBlocks.set(name, []);
        } else {
          pendingPipeline = name;
        }
        continue;
      }
    }

    const mComp = line.match(COMPONENT_RE);
    const mCompEvo = mComp ? null : line.match(COMPONENT_EVO_ONLY_RE);
    if (mComp || mCompEvo) {
      const kind = (mComp || mCompEvo)[1].toLowerCase();
      const name = unquote((mComp || mCompEvo)[2]);
      const rest = (mComp ? mComp[5] : mCompEvo[4]) || '';
      const mLabel = rest.match(LABEL_RE);
      const mDecorator = rest.match(/\((build|buy|outsource)\)/i);
      if (byName.has(name)) {
        warnings.push(`Duplicate component "${name}" — later declaration ignored.`);
        continue;
      }
      const component = {
        name,
        kind: kind === 'anchor' ? 'anchor' : 'component',
        // Evolution-only form: visibility is inherited from the pipeline
        // parent in Pass 3. NaN until then so a stray one is detectable.
        vis: mComp ? parseFloat(mComp[3]) : NaN,
        evo: mComp ? parseFloat(mComp[4]) : parseFloat(mCompEvo[3]),
        visInherited: !mComp,
        labelOffset: mLabel
          ? { x: parseFloat(mLabel[1]), y: parseFloat(mLabel[2]) }
          : null,
        inertia: /\binertia\b/i.test(rest),
        sourcing: mDecorator ? mDecorator[1].toLowerCase() : null,
        evolveTo: null,
        evolveLabel: null,
        pipeline: null,
        pipelineParent: null,
      };
      components.push(component);
      byName.set(name, component);
      continue;
    }
  }

  // Sourcing directives declared separately from the component line.
  for (const component of components) {
    if (!component.sourcing) {
      const found = sourcing.get(component.name.toLowerCase());
      if (found) component.sourcing = found;
    }
  }

  // ── Pass 2: links, evolve, annotations, notes, title.
  //    Deferred so forward references to components resolve.
  let inBlock = false;
  for (const raw of lines) {
    let line = raw.trim();
    if (!line || line.startsWith('//')) continue;
    line = stripInlineComment(line);
    if (!line) continue;

    if (line === '{') { inBlock = true; continue; }
    if (line === '}') { inBlock = false; continue; }

    // A dependency line is recognised BEFORE the keyword skip-list, because a
    // component name may legitimately begin with a directive keyword. Gating on
    // "both endpoints are declared components" keeps this unambiguous: it
    // matches `Market Data -> Feed` and `Title Service -> API`, and does not
    // match `evolution Genesis -> Custom -> Product`, whose endpoints are
    // stages rather than components. Previously the skip-list ran first, so
    // such a link was dropped and `Title Service -> API` was parsed as a
    // `title` statement, silently renaming the whole map.
    const mEarlyLink = line.match(LINK_RE);
    if (mEarlyLink) {
      const parsed = parseLink(mEarlyLink, byName);
      if (parsed) { links.push(parsed); continue; }
    }

    const mTitle = line.match(TITLE_RE);
    if (mTitle) { title = mTitle[1].trim(); continue; }

    if (COMPONENT_RE.test(line) || COMPONENT_EVO_ONLY_RE.test(line) || PIPELINE_COORD_RE.test(line)) continue;
    if (/^pipeline\s+/i.test(line)) continue;
    if (SOURCING_RE.test(line) && !/\[/.test(line)) continue;
    if (/^(style|size|evolution|x-axis|y-axis|market|ecosystem|submap|url|pioneer|settler|townplanner)\b/i.test(line)) continue;

    const mAnnBox = line.match(ANNOTATIONS_BOX_RE);
    if (mAnnBox) {
      annotationsBox = { vis: parseFloat(mAnnBox[1]), evo: parseFloat(mAnnBox[2]) };
      continue;
    }

    const mAnn = line.match(ANNOTATION_RE);
    if (mAnn) {
      const points = [];
      // Either `[vis, evo]` or `[[v1, e1], [v2, e2]]`.
      const coordPairs = mAnn[2].matchAll(/(-?[\d.]+)\s*,\s*(-?[\d.]+)/g);
      for (const pair of coordPairs) {
        points.push({ vis: parseFloat(pair[1]), evo: parseFloat(pair[2]) });
      }
      annotations.push({
        number: parseInt(mAnn[1], 10),
        points,
        text: unquote(mAnn[3]),
      });
      continue;
    }

    const mNote = line.match(NOTE_RE);
    if (mNote) {
      notes.push({
        text: unquote(mNote[1]),
        vis: parseFloat(mNote[2]),
        evo: parseFloat(mNote[3]),
      });
      continue;
    }

    const mEvolve = line.match(EVOLVE_RE);
    if (mEvolve) {
      const name = unquote(mEvolve[1]);
      const target = byName.get(name);
      if (!target) {
        warnings.push(`evolve references unknown component "${name}".`);
        continue;
      }
      target.evolveTo = parseFloat(mEvolve[2]);
      if (mEvolve[5]) target.evolveLabel = mEvolve[5].trim();
      continue;
    }

    // Any remaining `->` line failed parseLink above, which means an endpoint
    // was never declared. Name it rather than dropping the line in silence.
    const mLink = line.match(LINK_RE);
    if (mLink) {
      let toRaw = mLink[3].trim();
      if (toRaw.startsWith('"')) {
        const close = toRaw.indexOf('"', 1);
        if (close > 0) toRaw = toRaw.slice(0, close + 1);
      }
      for (const [role, raw] of [['from', mLink[1]], ['to', toRaw]]) {
        const name = unquote(raw);
        if (!byName.has(name)) {
          warnings.push(`Link ${role} references unknown component "${name}".`);
        }
      }
      continue;
    }

    // Nothing matched. A non-empty line that no rule claims is almost always a
    // typo in a directive; the old parser discarded it without a trace.
    warnings.push(`Unrecognised line ignored: "${line}".`);
  }

  // ── Pass 3: resolve pipeline membership.
  const claimed = new Set();
  for (const name of pipelineOrder) {
    const pipeline = pipelines.get(name);
    const explicit = explicitBlocks.get(name);
    if (explicit && explicit.length) {
      pipeline.children = explicit.filter((child) => byName.has(child));
      for (const child of pipeline.children) claimed.add(child);
      continue;
    }
    // Coordinate form: children sit on the parent's visibility line, within
    // the declared evolution range. Matches owm-to-mermaid.mjs proximity rules.
    const parent = byName.get(name);
    if (!parent || pipeline.min === null) continue;
    const children = components
      .filter((c) => c.name !== name && !claimed.has(c.name))
      .filter((c) => Math.abs(c.vis - parent.vis) <= 0.05)
      .filter((c) => c.evo >= pipeline.min - 0.01 && c.evo <= pipeline.max + 0.01)
      .sort((a, b) => a.evo - b.evo);
    pipeline.children = children.map((c) => c.name);
    for (const child of pipeline.children) claimed.add(child);
  }

  for (const name of pipelineOrder) {
    const pipeline = pipelines.get(name);
    const parent = byName.get(name);
    if (parent) parent.pipeline = pipeline;
    for (const child of pipeline.children) {
      const component = byName.get(child);
      if (!component) continue;
      component.pipelineParent = name;
      // Evolution-only children take their visibility from the parent.
      if (component.visInherited && parent) component.vis = parent.vis;
    }
  }

  // An evolution-only component outside any pipeline has no visibility to
  // inherit. Place it mid-chain and say so, rather than rendering at NaN.
  for (const component of components) {
    if (component.visInherited && !Number.isFinite(component.vis)) {
      component.vis = 0.5;
      warnings.push(
        `"${component.name}" declares only an evolution coordinate but is not in a ` +
        `pipeline; visibility defaulted to 0.5.`
      );
    }
  }

  return {
    title,
    components,
    links,
    pipelines: pipelineOrder.map((n) => pipelines.get(n)),
    annotations,
    annotationsBox,
    notes,
    warnings,
  };
}

export default parseOwm;
