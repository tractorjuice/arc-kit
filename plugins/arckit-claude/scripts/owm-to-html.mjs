#!/usr/bin/env node
/**
 * Render an OnlineWardleyMaps (OWM) file as a self-contained interactive HTML
 * map: inline SVG, no network fetches, no build step, no dependencies.
 *
 * `/arckit:wardley` previously ended at a code block the reader had to paste
 * into <https://create.wardleymaps.ai> to see. That is a poor fit for
 * OFFICIAL-SENSITIVE work (the map leaves the estate) and for air-gapped
 * review. This renderer keeps the map inside the repository.
 *
 * The output opens in `file://`, embeds nothing external, and carries the
 * OWM source in a `<script type="application/vnd.arckit.owm">` block so the
 * artifact stays round-trippable.
 *
 * Usage:
 *   node owm-to-html.mjs <input.owm> [output.html] [--title "..."] [--json]
 *   node owm-to-html.mjs <input.owm> --stdout
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import process from 'node:process';
import { parseOwm, EVOLUTION_STAGES, stageFor } from './owm-parse.mjs';

// ── Geometry ────────────────────────────────────────────────────────────────
const WIDTH = 1440;
const HEIGHT = 900;
const MARGIN = { top: 56, right: 220, bottom: 92, left: 132 };
const PLOT = {
  width: WIDTH - MARGIN.left - MARGIN.right,
  height: HEIGHT - MARGIN.top - MARGIN.bottom,
};

const clamp01 = (n) => (Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0);
const round = (n) => Math.round(n * 100) / 100;

/** Evolution (0..1) → SVG x. */
const xFor = (evo) => round(MARGIN.left + clamp01(evo) * PLOT.width);
/** Visibility (0..1, 1 = visible to user) → SVG y. */
const yFor = (vis) => round(MARGIN.top + (1 - clamp01(vis)) * PLOT.height);

/** Escape text for use in an XML/HTML text node or attribute. */
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Stable, collision-free DOM id for a component name. */
function idFor(name, index) {
  const slug = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return `c${index}${slug ? `-${slug}` : ''}`;
}

/** Wrap a label into at most `maxLines` lines of about `maxChars` each. */
function wrapLabel(text, maxChars = 22, maxLines = 2) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (!current) { current = word; continue; }
    if (`${current} ${word}`.length <= maxChars) { current += ` ${word}`; continue; }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }
  if (current) lines.push(current);
  const remaining = words.slice(lines.join(' ').split(/\s+/).length);
  if (remaining.length && lines.length === maxLines) {
    lines[maxLines - 1] = `${lines[maxLines - 1]}…`;
  }
  return lines.slice(0, maxLines);
}

const SOURCING_LABEL = { build: 'Build', buy: 'Buy', outsource: 'Outsource' };

// ── SVG construction ────────────────────────────────────────────────────────

function renderAxes() {
  const parts = [];
  const left = MARGIN.left;
  const right = MARGIN.left + PLOT.width;
  const top = MARGIN.top;
  const bottom = MARGIN.top + PLOT.height;

  parts.push(`<rect class="plot-bg" x="${left}" y="${top}" width="${PLOT.width}" height="${PLOT.height}" rx="4"/>`);

  // Evolution bands and their dividers.
  for (const stage of EVOLUTION_STAGES) {
    const bandX = xFor(stage.min);
    const bandWidth = round(xFor(stage.max) - bandX);
    parts.push(
      `<rect class="band" x="${bandX}" y="${top}" width="${bandWidth}" height="${PLOT.height}" data-stage="${esc(stage.name)}"/>`
    );
    if (stage.min > 0) {
      parts.push(`<line class="divider" x1="${bandX}" y1="${top}" x2="${bandX}" y2="${bottom}"/>`);
    }
    parts.push(
      `<text class="axis-stage" x="${round(bandX + bandWidth / 2)}" y="${bottom + 26}" text-anchor="middle">${esc(stage.name)}</text>`
    );
  }

  // Horizontal guide lines at each quartile of visibility.
  for (let i = 1; i < 4; i += 1) {
    const y = yFor(i / 4);
    parts.push(`<line class="guide" x1="${left}" y1="${y}" x2="${right}" y2="${y}"/>`);
  }

  // Axis frames and titles.
  parts.push(`<line class="axis" x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}"/>`);
  parts.push(`<line class="axis" x1="${left}" y1="${top}" x2="${left}" y2="${bottom}"/>`);
  parts.push(
    `<text class="axis-title" x="${round(left + PLOT.width / 2)}" y="${bottom + 58}" text-anchor="middle">Evolution &#8594;</text>`
  );
  parts.push(
    `<text class="axis-title" transform="translate(${left - 92} ${round(top + PLOT.height / 2)}) rotate(-90)" text-anchor="middle">Value chain</text>`
  );
  parts.push(`<text class="axis-note" x="${left - 14}" y="${top + 6}" text-anchor="end">Visible</text>`);
  parts.push(`<text class="axis-note" x="${left - 14}" y="${bottom}" text-anchor="end">Invisible</text>`);
  return parts.join('\n      ');
}

function renderPipelines(map, byName) {
  const parts = [];
  for (const pipeline of map.pipelines) {
    const parent = byName.get(pipeline.name);
    if (!parent) continue;
    const evolutions = pipeline.children
      .map((child) => byName.get(child))
      .filter(Boolean)
      .map((child) => child.evo);
    const min = pipeline.min !== null ? pipeline.min : Math.min(parent.evo, ...evolutions);
    const max = pipeline.max !== null ? pipeline.max : Math.max(parent.evo, ...evolutions);
    if (!Number.isFinite(min) || !Number.isFinite(max)) continue;
    const x = xFor(min);
    const width = Math.max(12, round(xFor(max) - x));
    const y = round(yFor(parent.vis) + 14);
    parts.push(
      `<g class="pipeline" data-pipeline="${esc(pipeline.name)}">` +
        `<rect x="${x}" y="${y}" width="${width}" height="18" rx="3"/>` +
        `<title>Pipeline: ${esc(pipeline.name)}</title>` +
      `</g>`
    );
  }
  return parts.join('\n      ');
}

function renderLinks(map, byName, idOf) {
  const parts = [];
  for (const link of map.links) {
    const from = byName.get(link.from);
    const to = byName.get(link.to);
    if (!from || !to) continue;
    const x1 = xFor(from.evo);
    const y1 = yFor(from.vis);
    const x2 = xFor(to.evo);
    const y2 = yFor(to.vis);
    const classes = ['link'];
    if (link.flow) classes.push('flow');
    parts.push(
      `<g class="${classes.join(' ')}" data-from="${esc(idOf.get(link.from))}" data-to="${esc(idOf.get(link.to))}">` +
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` +
        (link.label
          ? `<text class="link-label" x="${round((x1 + x2) / 2)}" y="${round((y1 + y2) / 2 - 5)}" text-anchor="middle">${esc(link.label)}</text>`
          : '') +
      `</g>`
    );
  }
  return parts.join('\n      ');
}

function renderEvolution(map, idOf) {
  const parts = [];
  for (const component of map.components) {
    if (component.evolveTo === null || !Number.isFinite(component.evolveTo)) continue;
    const y = yFor(component.vis);
    const x1 = xFor(component.evo);
    const x2 = xFor(component.evolveTo);
    if (Math.abs(x2 - x1) < 1) continue;
    parts.push(
      `<g class="evolve" data-for="${esc(idOf.get(component.name))}">` +
        `<line x1="${round(x1 + 8 * Math.sign(x2 - x1))}" y1="${y}" x2="${round(x2 - 9 * Math.sign(x2 - x1))}" y2="${y}" marker-end="url(#arrow-evolve)"/>` +
        `<circle class="evolve-target" cx="${x2}" cy="${y}" r="6"/>` +
        (component.evolveLabel
          ? `<text class="evolve-label" x="${x2}" y="${round(y - 12)}" text-anchor="middle">${esc(component.evolveLabel)}</text>`
          : '') +
        `<title>${esc(component.name)} evolves to ${round(component.evolveTo)} (${esc(stageFor(component.evolveTo))})</title>` +
      `</g>`
    );
  }
  return parts.join('\n      ');
}

function renderComponents(map, idOf) {
  const parts = [];
  for (const component of map.components) {
    const id = idOf.get(component.name);
    const x = xFor(component.evo);
    const y = yFor(component.vis);
    const classes = ['node', component.kind];
    if (component.sourcing) classes.push(`sourcing-${component.sourcing}`);
    if (component.pipelineParent) classes.push('in-pipeline');

    const offset = component.labelOffset || { x: 12, y: -12 };
    const labelX = round(x + offset.x);
    const labelY = round(y + offset.y);
    const anchor = offset.x < 0 ? 'end' : 'start';
    const lines = wrapLabel(component.name);
    const label = lines
      .map((line, index) =>
        `<tspan x="${labelX}" dy="${index === 0 ? 0 : 13}">${esc(line)}</tspan>`
      )
      .join('');

    const tooltipParts = [
      component.name,
      `${component.kind === 'anchor' ? 'Anchor' : 'Component'} · ${stageFor(component.evo)}`,
      `evolution ${round(component.evo)} · visibility ${round(component.vis)}`,
    ];
    if (component.sourcing) tooltipParts.push(SOURCING_LABEL[component.sourcing]);
    if (component.inertia) tooltipParts.push('Inertia — resistance to change');
    if (component.pipelineParent) tooltipParts.push(`In pipeline: ${component.pipelineParent}`);

    parts.push(
      `<g id="${esc(id)}" class="${classes.join(' ')}" tabindex="0" role="button"` +
        ` data-name="${esc(component.name)}" data-evo="${round(component.evo)}"` +
        ` data-vis="${round(component.vis)}" data-stage="${esc(stageFor(component.evo))}"` +
        ` data-sourcing="${esc(component.sourcing || '')}">` +
        (component.inertia
          ? `<line class="inertia" x1="${round(x + 11)}" y1="${round(y - 11)}" x2="${round(x + 11)}" y2="${round(y + 11)}"/>`
          : '') +
        `<circle class="halo" cx="${x}" cy="${y}" r="13"/>` +
        `<circle class="dot" cx="${x}" cy="${y}" r="6.5"/>` +
        `<text class="node-label" x="${labelX}" y="${labelY}" text-anchor="${anchor}">${label}</text>` +
        `<title>${esc(tooltipParts.join('\n'))}</title>` +
      `</g>`
    );
  }
  return parts.join('\n      ');
}

function renderAnnotations(map) {
  const parts = [];
  // OWM authors habitually place an annotation on the exact coordinate of the
  // component it describes. Drawn there the marker hides the component dot, so
  // offset it clear of the halo. Down-and-right, because component labels
  // default to up-and-right and the two would otherwise overlap.
  const ANNOTATION_OFFSET = { x: 15, y: 17 };
  for (const annotation of map.annotations) {
    for (const point of annotation.points) {
      const cx = round(xFor(point.evo) + ANNOTATION_OFFSET.x);
      const cy = round(yFor(point.vis) + ANNOTATION_OFFSET.y);
      parts.push(
        `<g class="annotation" data-annotation="${annotation.number}">` +
          `<line class="annotation-leader" x1="${xFor(point.evo)}" y1="${yFor(point.vis)}" x2="${cx}" y2="${cy}"/>` +
          `<circle cx="${cx}" cy="${cy}" r="9"/>` +
          `<text x="${cx}" y="${round(cy + 4)}" text-anchor="middle">${annotation.number}</text>` +
          `<title>${esc(annotation.text)}</title>` +
        `</g>`
      );
    }
  }
  for (const note of map.notes) {
    parts.push(
      `<text class="note" x="${xFor(note.evo)}" y="${yFor(note.vis)}">${esc(note.text)}</text>`
    );
  }
  return parts.join('\n      ');
}

function renderSvg(map, idOf, byName) {
  return `<svg id="map" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(map.title || 'Wardley Map')}">
      <defs>
        <marker id="arrow-evolve" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z"/>
        </marker>
      </defs>
      <g id="viewport">
      ${renderAxes()}
      ${renderPipelines(map, byName)}
      ${renderLinks(map, byName, idOf)}
      ${renderEvolution(map, idOf)}
      ${renderComponents(map, idOf)}
      ${renderAnnotations(map)}
      </g>
    </svg>`;
}

// ── Page shell ──────────────────────────────────────────────────────────────

const STYLES = `
:root {
  color-scheme: light;
  --bg: #f4f6f8; --panel: #ffffff; --ink: #0b0c0c; --muted: #505a5f;
  --line: #b1b4b6; --band: #eef2f5; --band-alt: #e7edf1; --guide: #dde3e7;
  --accent: #1d70b8; --accent-soft: #d2e2f1;
  --build: #00703c; --buy: #1d70b8; --outsource: #d4351c;
  --evolve: #6f72af; --anno: #f47738; --shadow: rgba(11, 12, 12, .12);
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0f1418; --panel: #161d23; --ink: #e8eef2; --muted: #9aa7b0;
  --line: #39454e; --band: #18212a; --band-alt: #1d2830; --guide: #26313a;
  --accent: #5aa8e8; --accent-soft: #1c3c58;
  --build: #4bbf80; --buy: #5aa8e8; --outsource: #ff7a6b;
  --evolve: #a3a6e0; --anno: #ffa366; --shadow: rgba(0, 0, 0, .45);
}
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font: 15px/1.5 "Helvetica Neue", Arial, system-ui, sans-serif;
}
header {
  display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap;
  padding: 18px 24px 12px;
}
h1 { font-size: 22px; margin: 0; font-weight: 700; }
.meta { color: var(--muted); font-size: 13px; }
.wrap { display: flex; gap: 16px; align-items: flex-start; padding: 0 24px 24px; flex-wrap: wrap; }
.stage {
  flex: 1 1 720px; min-width: 320px; background: var(--panel);
  border: 1px solid var(--line); border-radius: 6px; box-shadow: 0 1px 3px var(--shadow);
  overflow: hidden;
}
svg { display: block; width: 100%; height: auto; touch-action: none; cursor: grab; }
svg.dragging { cursor: grabbing; }
aside {
  flex: 0 1 260px; min-width: 220px; background: var(--panel);
  border: 1px solid var(--line); border-radius: 6px; padding: 14px 16px;
  box-shadow: 0 1px 3px var(--shadow);
}
aside h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin: 0 0 8px; }
aside + aside { margin-top: 12px; }
.legend-row { display: flex; align-items: center; gap: 8px; margin: 5px 0; font-size: 13px; }
.swatch { width: 12px; height: 12px; border-radius: 50%; flex: none; }
.controls { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }
button {
  font: inherit; font-size: 13px; padding: 6px 12px; border-radius: 4px;
  border: 1px solid var(--line); background: var(--panel); color: var(--ink); cursor: pointer;
}
button:hover { border-color: var(--accent); color: var(--accent); }
button:focus-visible, .node:focus-visible { outline: 3px solid #ffdd00; outline-offset: 2px; }
.notes-list { margin: 0; padding-left: 18px; font-size: 13px; color: var(--muted); }
.notes-list li { margin: 4px 0; }
#detail { font-size: 13px; }
#detail dt { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; margin-top: 8px; }
#detail dd { margin: 2px 0 0; }
footer { padding: 0 24px 28px; color: var(--muted); font-size: 12px; }

/* Map primitives */
.plot-bg, .band, .divider, .guide, .axis,
.axis-stage, .axis-note, .axis-title, .note, .link-label,
.evolve-label, .pipeline { pointer-events: none; }
.plot-bg { fill: var(--panel); }
.band { fill: var(--band); }
.band:nth-of-type(even) { fill: var(--band-alt); }
.divider, .guide { stroke: var(--guide); stroke-width: 1; }
.divider { stroke-dasharray: 4 4; }
.axis { stroke: var(--line); stroke-width: 1.5; }
.axis-stage, .axis-note { fill: var(--muted); font-size: 13px; }
.axis-title { fill: var(--ink); font-size: 14px; font-weight: 600; }
.link line { stroke: var(--line); stroke-width: 1.4; }
.link.flow line { stroke: var(--accent); stroke-width: 2.2; }
.link-label { fill: var(--muted); font-size: 11px; }
.evolve line { stroke: var(--evolve); stroke-width: 1.6; stroke-dasharray: 5 4; }
.evolve line { marker-end: url(#arrow-evolve); }
#arrow-evolve path, marker path { fill: var(--evolve); }
.evolve-target { fill: none; stroke: var(--evolve); stroke-width: 1.6; }
.evolve-label { fill: var(--evolve); font-size: 11px; font-style: italic; }
.pipeline rect { fill: none; stroke: var(--muted); stroke-width: 1.2; stroke-dasharray: 3 3; }
.inertia { stroke: var(--ink); stroke-width: 3; }
.node { cursor: pointer; }
.node .halo { fill: transparent; pointer-events: all; }
.node .node-label { pointer-events: all; }
.node .dot { fill: var(--panel); stroke: var(--ink); stroke-width: 2; }
.node.anchor .dot { fill: var(--ink); }
.node.sourcing-build .dot { stroke: var(--build); }
.node.sourcing-buy .dot { stroke: var(--buy); }
.node.sourcing-outsource .dot { stroke: var(--outsource); }
.node-label { fill: var(--ink); font-size: 12.5px; }
.annotation circle { fill: var(--anno); }
.annotation-leader { stroke: var(--anno); stroke-width: 1; opacity: .6; }
.annotation text { fill: #ffffff; font-size: 11px; font-weight: 700; }
.note { fill: var(--muted); font-size: 12px; font-style: italic; }

/* Focus mode */
svg.focused .node, svg.focused .link, svg.focused .evolve,
svg.focused .annotation, svg.focused .pipeline { opacity: .18; }
svg.focused .node.is-active, svg.focused .node.is-related,
svg.focused .link.is-active, svg.focused .evolve.is-active { opacity: 1; }
.node.is-active .dot { stroke: var(--accent); stroke-width: 3.5; r: 8; }
.link.is-active line { stroke: var(--accent); stroke-width: 2.4; }

@media (prefers-reduced-motion: no-preference) { .node, .link, .evolve { transition: opacity .15s ease; } }
@media print { .controls, aside { display: none; } .stage { border: none; box-shadow: none; } }
`;

const SCRIPT = `
(function () {
  var svg = document.getElementById('map');
  var viewport = document.getElementById('viewport');
  var detail = document.getElementById('detail');
  var root = document.documentElement;

  // ── Theme ────────────────────────────────────────────────────────────────
  var stored = null;
  try { stored = localStorage.getItem('arckit-wardley-theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(stored || (prefersDark ? 'dark' : 'light'));
  function setTheme(mode) {
    root.setAttribute('data-theme', mode);
    var button = document.getElementById('theme');
    if (button) button.textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
    try { localStorage.setItem('arckit-wardley-theme', mode); } catch (e) {}
  }
  document.getElementById('theme').addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ── Pan and zoom ─────────────────────────────────────────────────────────
  var view = { x: 0, y: 0, k: 1 };
  function apply() {
    viewport.setAttribute('transform', 'translate(' + view.x + ' ' + view.y + ') scale(' + view.k + ')');
  }
  function reset() { view = { x: 0, y: 0, k: 1 }; apply(); clearFocus(); }
  document.getElementById('reset').addEventListener('click', reset);

  svg.addEventListener('wheel', function (event) {
    event.preventDefault();
    var rect = svg.getBoundingClientRect();
    var scale = svg.viewBox.baseVal.width / rect.width;
    var px = (event.clientX - rect.left) * scale;
    var py = (event.clientY - rect.top) * scale;
    var factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
    var next = Math.min(8, Math.max(0.5, view.k * factor));
    factor = next / view.k;
    view.x = px - (px - view.x) * factor;
    view.y = py - (py - view.y) * factor;
    view.k = next;
    apply();
  }, { passive: false });

  var drag = null;
  svg.addEventListener('pointerdown', function (event) {
    if (event.target.closest('.node')) return;
    drag = { x: event.clientX, y: event.clientY, vx: view.x, vy: view.y };
    svg.classList.add('dragging');
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove', function (event) {
    if (!drag) return;
    var rect = svg.getBoundingClientRect();
    var scale = svg.viewBox.baseVal.width / rect.width;
    view.x = drag.vx + (event.clientX - drag.x) * scale;
    view.y = drag.vy + (event.clientY - drag.y) * scale;
    apply();
  });
  function endDrag() { drag = null; svg.classList.remove('dragging'); }
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  // ── Focus a component and its immediate dependencies ─────────────────────
  var links = Array.prototype.slice.call(svg.querySelectorAll('.link'));
  var nodes = Array.prototype.slice.call(svg.querySelectorAll('.node'));
  var evolves = Array.prototype.slice.call(svg.querySelectorAll('.evolve'));

  function clearFocus() {
    svg.classList.remove('focused');
    nodes.forEach(function (n) { n.classList.remove('is-active', 'is-related'); });
    links.forEach(function (l) { l.classList.remove('is-active'); });
    evolves.forEach(function (e) { e.classList.remove('is-active'); });
    detail.innerHTML = '<p class="meta">Select a component to trace its dependencies.</p>';
  }

  function focusNode(node) {
    var id = node.id;
    clearFocus();
    svg.classList.add('focused');
    node.classList.add('is-active');
    var related = [];
    links.forEach(function (link) {
      var from = link.getAttribute('data-from');
      var to = link.getAttribute('data-to');
      if (from !== id && to !== id) return;
      link.classList.add('is-active');
      related.push(from === id ? to : from);
    });
    related.forEach(function (rid) {
      var target = document.getElementById(rid);
      if (target) target.classList.add('is-related');
    });
    evolves.forEach(function (evolve) {
      if (evolve.getAttribute('data-for') === id) evolve.classList.add('is-active');
    });

    var rows = [
      ['Stage', node.getAttribute('data-stage')],
      ['Evolution', node.getAttribute('data-evo')],
      ['Visibility', node.getAttribute('data-vis')]
    ];
    var sourcing = node.getAttribute('data-sourcing');
    if (sourcing) rows.push(['Sourcing', sourcing.charAt(0).toUpperCase() + sourcing.slice(1)]);
    rows.push(['Dependencies', String(related.length)]);
    var html = '<h2>' + node.getAttribute('data-name') + '</h2><dl>';
    rows.forEach(function (row) {
      html += '<dt>' + row[0] + '</dt><dd>' + row[1] + '</dd>';
    });
    detail.innerHTML = html + '</dl>';
  }

  nodes.forEach(function (node) {
    node.addEventListener('click', function (event) {
      event.stopPropagation();
      if (node.classList.contains('is-active')) { clearFocus(); return; }
      focusNode(node);
    });
    node.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      node.classList.contains('is-active') ? clearFocus() : focusNode(node);
    });
  });
  svg.addEventListener('click', function (event) {
    if (!event.target.closest('.node')) clearFocus();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') clearFocus();
  });

  // ── Export the map as a standalone .svg ──────────────────────────────────
  document.getElementById('export').addEventListener('click', function () {
    var clone = svg.cloneNode(true);
    clone.removeAttribute('id');
    var style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.textContent = document.getElementById('map-style').textContent;
    clone.insertBefore(style, clone.firstChild);
    var markup = '<?xml version="1.0" encoding="UTF-8"?>\\n' + new XMLSerializer().serializeToString(clone);
    var blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = document.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.svg';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });

  clearFocus();
})();
`;

/**
 * Render a parsed OWM map to a complete HTML document.
 *
 * @param {ReturnType<typeof parseOwm>} map
 * @param {{title?: string, source?: string, generated?: string}} [options]
 * @returns {string} A self-contained HTML document.
 */
export function renderHtml(map, options = {}) {
  const title = options.title || map.title || 'Wardley Map';
  const idOf = new Map();
  map.components.forEach((component, index) => {
    idOf.set(component.name, idFor(component.name, index));
  });
  const byName = new Map(map.components.map((c) => [c.name, c]));

  const counts = { build: 0, buy: 0, outsource: 0 };
  for (const component of map.components) {
    if (component.sourcing) counts[component.sourcing] += 1;
  }
  const stageCounts = new Map(EVOLUTION_STAGES.map((s) => [s.name, 0]));
  for (const component of map.components) {
    const stage = stageFor(component.evo);
    stageCounts.set(stage, (stageCounts.get(stage) || 0) + 1);
  }

  const legendRows = [
    ['var(--build)', `Build (${counts.build})`],
    ['var(--buy)', `Buy (${counts.buy})`],
    ['var(--outsource)', `Outsource (${counts.outsource})`],
  ]
    .map(
      ([colour, label]) =>
        `<div class="legend-row"><span class="swatch" style="border:2px solid ${colour}"></span>${esc(label)}</div>`
    )
    .join('\n        ');

  const stageRows = EVOLUTION_STAGES.map(
    (stage) =>
      `<div class="legend-row"><span>${esc(stage.name)}</span><strong style="margin-left:auto">${stageCounts.get(stage.name) || 0}</strong></div>`
  ).join('\n        ');

  const annotationList = map.annotations.length
    ? `<aside><h2>Annotations</h2><ol class="notes-list">${map.annotations
        .slice()
        .sort((a, b) => a.number - b.number)
        .map((a) => `<li value="${a.number}">${esc(a.text)}</li>`)
        .join('')}</ol></aside>`
    : '';

  const warningList = map.warnings.length
    ? `<aside><h2>Parser warnings</h2><ul class="notes-list">${map.warnings
        .map((w) => `<li>${esc(w)}</li>`)
        .join('')}</ul></aside>`
    : '';

  const generated = options.generated || new Date().toISOString().slice(0, 10);
  // The HTML tokenizer ends a script data block at `</script` followed by
  // whitespace, `/` or `>` — not just the literal `</script>`. Neutralise
  // every one of those forms so authored OWM text can never break out of the
  // embedded source block.
  const sourceBlock = options.source
    ? `<script type="application/vnd.arckit.owm" id="owm-source">${String(options.source)
        .replace(/<\/(script)([\s/>])/gi, '<\\/$1$2')
        .replace(/<\/script$/gi, '<\\/script')}</script>`
    : '';

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="ArcKit owm-to-html">
<title>${esc(title)}</title>
<style id="map-style">${STYLES}</style>
</head>
<body>
<header>
  <h1>${esc(title)}</h1>
  <span class="meta">${map.components.length} components · ${map.links.length} dependencies · generated ${esc(generated)}</span>
  <div class="controls">
    <button id="theme" type="button">Dark mode</button>
    <button id="reset" type="button">Reset view</button>
    <button id="export" type="button">Download SVG</button>
  </div>
</header>
<div class="wrap">
  <div class="stage">
    ${renderSvg(map, idOf, byName)}
  </div>
  <div style="flex:0 1 260px;min-width:220px">
    <aside id="detail-panel"><div id="detail"></div></aside>
    <aside><h2>Sourcing</h2>${legendRows}</aside>
    <aside><h2>Evolution profile</h2>${stageRows}</aside>
    ${annotationList}
    ${warningList}
  </div>
</div>
<footer>
  Scroll to zoom, drag to pan, click a component to trace its dependencies, Esc to clear.
  Rendered from OnlineWardleyMaps source by ArcKit — no external requests.
</footer>
${sourceBlock}
<script>${SCRIPT}</script>
</body>
</html>
`;
}

/** Convert OWM source text straight to an HTML document. */
export function convert(owm, options = {}) {
  const map = parseOwm(owm);
  return renderHtml(map, { ...options, source: owm });
}

// ── CLI ─────────────────────────────────────────────────────────────────────
function main(argv) {
  const args = argv.slice(2);
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: owm-to-html.mjs <input.owm> [output.html] [--title "..."] [--stdout] [--json]');
    process.exit(args.length ? 0 : 2);
  }

  let title = null;
  let toStdout = false;
  let asJson = false;
  const positional = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--title') { title = args[i + 1]; i += 1; continue; }
    if (arg.startsWith('--title=')) { title = arg.slice(8); continue; }
    if (arg === '--stdout') { toStdout = true; continue; }
    if (arg === '--json') { asJson = true; continue; }
    positional.push(arg);
  }

  const input = positional[0];
  if (!input) {
    console.error('owm-to-html: no input file given.');
    process.exit(2);
  }

  let source;
  try {
    source = readFileSync(resolve(input), 'utf8');
  } catch (error) {
    console.error(`owm-to-html: cannot read ${input}: ${error.message}`);
    process.exit(2);
  }

  const map = parseOwm(source);
  if (!map.components.length) {
    console.error('owm-to-html: no components found — is this an OWM file?');
    process.exit(1);
  }

  const html = renderHtml(map, { title, source });

  if (toStdout) {
    process.stdout.write(html);
    return;
  }

  const output = positional[1] || resolve(input).replace(/\.(owm|wm|txt|md)$/i, '') + '.html';
  writeFileSync(output, html, 'utf8');

  if (asJson) {
    console.log(JSON.stringify({
      ok: true,
      output,
      title: title || map.title,
      components: map.components.length,
      links: map.links.length,
      pipelines: map.pipelines.length,
      annotations: map.annotations.length,
      warnings: map.warnings,
    }, null, 2));
  } else {
    console.log(`Wrote ${output} (${map.components.length} components, ${map.links.length} dependencies)`);
    for (const warning of map.warnings) console.warn(`  warning: ${warning}`);
  }
}

const invokedDirectly =
  process.argv[1] && basename(process.argv[1]) === 'owm-to-html.mjs';
if (invokedDirectly) main(process.argv);

export default convert;
