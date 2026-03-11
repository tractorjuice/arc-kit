# Dependency Map Timeline View — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a timeline layout mode to the dependency map that places documents into date-based columns while retaining category bands on the Y-axis.

**Architecture:** Two-layer change. Backend (graph-utils.mjs) adds `createdDate` and `lastModified` to each node. Frontend (pages-template.html) adds a layout toggle, timeline rendering with auto-detect granularity, and last-modified indicator dots. No new files or dependencies.

**Tech Stack:** Vanilla JS, SVG DOM API, existing hook infrastructure

**Spec:** `docs/superpowers/specs/2026-03-11-dependency-map-timeline-design.md`

---

## Task 1: Add date fields to graph nodes

**Files:**

- Modify: `arckit-claude/hooks/graph-utils.mjs:86-93`

- [ ] **Step 1: Add createdDate and lastModified to node object**

In `scanProjectDir()`, the `fields` variable already contains parsed Document Control fields (line 79). Add two fields to the node object at lines 86-93:

```js
      nodes[fullId] = {
        type: docType,
        project: projectName,
        path: `projects/${projectName}/${prefix}${f}`,
        title,
        status,
        severity: classifySeverity(docType),
        createdDate: fields['Created Date'] || null,
        lastModified: fields['Last Modified'] || null,
      };
```

- [ ] **Step 2: Verify the change**

Run in a test repo (or the main repo which has `projects/` dir):

```bash
node -e "
import { scanAllArtifacts } from './arckit-claude/hooks/graph-utils.mjs';
const g = scanAllArtifacts('projects');
const firstNode = Object.values(g.nodes)[0];
console.log('createdDate:', firstNode?.createdDate);
console.log('lastModified:', firstNode?.lastModified);
"
```

Expected: `createdDate` and `lastModified` fields present (values depend on whether test docs have Document Control tables).

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/hooks/graph-utils.mjs
git commit -m "feat: add createdDate and lastModified to dependency graph nodes"
```

---

## Task 2: Update CATEGORY_ORDER in dependency map

**Files:**

- Modify: `arckit-claude/templates/pages-template.html:2878-2881`

- [ ] **Step 1: Update the CATEGORY_ORDER array**

The dependency map has its own `CATEGORY_ORDER` (line 2878) that is out of sync with the current categories. Replace:

```js
            const CATEGORY_ORDER = [
                'Discovery', 'Planning', 'Architecture', 'Governance',
                'Compliance', 'Operations', 'Procurement', 'Research', 'Reporting', 'Other'
            ];
```

With:

```js
            const CATEGORY_ORDER = [
                'Getting Started', 'Discovery', 'Planning', 'Architecture', 'Governance',
                'Compliance', 'Operations', 'Procurement', 'Integrations', 'Reporting', 'Other'
            ];
```

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "fix: update CATEGORY_ORDER in dependency map to match current categories"
```

---

## Task 3: Add layout toggle CSS

**Files:**

- Modify: `arckit-claude/templates/pages-template.html` (CSS section, after `.app-depmap-empty` around line 1644)

- [ ] **Step 1: Add CSS for layout toggle and last-modified dot**

Insert after the `.app-depmap-empty` rule (before the closing `</style>` tag):

```css
        .app-depmap-layout-toggle {
            display: inline-flex;
            border: 1px solid var(--border-main);
            border-radius: 4px;
            overflow: hidden;
        }
        .app-depmap-layout-toggle button {
            border: none;
            background: var(--bg-surface);
            color: var(--text-primary);
            font-size: 12px;
            font-weight: 600;
            padding: 4px 12px;
            cursor: pointer;
        }
        .app-depmap-layout-toggle button:not(:last-child) {
            border-right: 1px solid var(--border-main);
        }
        .app-depmap-layout-toggle button.active {
            background: var(--text-primary);
            color: var(--bg-surface);
        }
        .app-depmap-layout-toggle button:hover:not(.active) {
            background: var(--bg-surface-alt);
        }
```

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: add CSS for dependency map layout toggle"
```

---

## Task 4: Add layout toggle UI to controls bar

**Files:**

- Modify: `arckit-claude/templates/pages-template.html` (in `showDependencyMap()`, around line 2883-2917)

- [ ] **Step 1: Check for valid dates and determine if timeline is available**

Insert after `const CATEGORY_ORDER = [...]` (line 2881) and before `// Build controls DOM`:

```js
            // Check if any nodes have valid dates (for timeline toggle)
            const hasValidDates = nodeIds.some(id => {
                const d = nodes[id].createdDate;
                return d && !isNaN(new Date(d).getTime());
            });

            let currentLayout = 'category';
            if (hasValidDates) {
                const stored = localStorage.getItem('arckit-depmap-layout');
                if (stored === 'timeline') currentLayout = 'timeline';
            }
```

- [ ] **Step 2: Add toggle buttons to controls bar**

After `controls.appendChild(label);` is created (line 2897) but before the Project select is appended, insert the layout toggle. Replace the controls section (lines 2895-2917) with:

```js
            const layoutLabel = document.createElement('label');
            layoutLabel.textContent = 'Layout:';
            layoutLabel.style.cssText = 'font-size:14px;font-weight:700;color:var(--text-primary)';
            controls.appendChild(layoutLabel);

            const toggleWrap = document.createElement('div');
            toggleWrap.className = 'app-depmap-layout-toggle';

            const btnCategory = document.createElement('button');
            btnCategory.textContent = 'Category';
            btnCategory.className = currentLayout === 'category' ? 'active' : '';
            toggleWrap.appendChild(btnCategory);

            if (hasValidDates) {
                const btnTimeline = document.createElement('button');
                btnTimeline.textContent = 'Timeline';
                btnTimeline.className = currentLayout === 'timeline' ? 'active' : '';
                toggleWrap.appendChild(btnTimeline);

                btnTimeline.addEventListener('click', () => {
                    currentLayout = 'timeline';
                    localStorage.setItem('arckit-depmap-layout', 'timeline');
                    btnCategory.className = '';
                    btnTimeline.className = 'active';
                    renderGraph(select.value);
                });
            }

            btnCategory.addEventListener('click', () => {
                currentLayout = 'category';
                localStorage.setItem('arckit-depmap-layout', 'category');
                btnCategory.className = 'active';
                const btnT = toggleWrap.querySelector('button:nth-child(2)');
                if (btnT) btnT.className = '';
                renderGraph(select.value);
            });

            controls.appendChild(toggleWrap);

            const label = document.createElement('label');
            label.setAttribute('for', 'depmap-project-filter');
            label.textContent = 'Project:';
            controls.appendChild(label);

            const select = document.createElement('select');
            select.id = 'depmap-project-filter';
            const optAll = document.createElement('option');
            optAll.value = '';
            optAll.textContent = 'All Projects';
            select.appendChild(optAll);
            for (const p of projects) {
                const opt = document.createElement('option');
                opt.value = p;
                opt.textContent = p;
                select.appendChild(opt);
            }
            controls.appendChild(select);

            const statsSpan = document.createElement('span');
            statsSpan.id = 'depmap-stats';
            statsSpan.style.cssText = 'margin-left:auto;font-size:12px;color:var(--text-secondary)';
            controls.appendChild(statsSpan);
```

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: add layout toggle UI to dependency map controls"
```

---

## Task 5: Add last-modified indicator dot to node rendering

**Files:**

- Modify: `arckit-claude/templates/pages-template.html` (in `renderGraph()`, node rendering loop around line 3090-3134)

- [ ] **Step 1: Add last-modified dot after the title text element**

After the `titleText` element is appended to `g` (after line 3134 `g.appendChild(titleText);`), insert:

```js
                    // Last-modified indicator dot
                    if (node.lastModified) {
                        const lmDate = new Date(node.lastModified);
                        if (!isNaN(lmDate.getTime())) {
                            const now = Date.now();
                            const daysAgo = (now - lmDate.getTime()) / 86400000;
                            let dotColor = null;
                            if (daysAgo < 7) dotColor = '#00703c';
                            else if (daysAgo < 30) dotColor = '#f47738';
                            if (dotColor) {
                                const dot = document.createElementNS(NS, 'circle');
                                dot.setAttribute('cx', pos.x + nodeW - 6);
                                dot.setAttribute('cy', pos.y + 6);
                                dot.setAttribute('r', '3');
                                dot.setAttribute('fill', dotColor);
                                g.appendChild(dot);
                            }
                        }
                    }
```

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: add last-modified indicator dot to dependency map nodes"
```

---

## Task 6: Implement timeline layout with auto-detect granularity

**Files:**

- Modify: `arckit-claude/templates/pages-template.html` (in `renderGraph()`, around line 2952)

This is the main feature. The `renderGraph()` function currently contains the category layout directly. We need to:

1. Wrap the existing category layout in a condition
2. Add the timeline layout as an alternative path

- [ ] **Step 1: Add date bucket utility functions**

Insert before `function renderGraph(filterProject)` (around line 2952):

```js
            // ── Timeline utilities ──
            function computeDateBuckets(filteredIds) {
                const validDates = [];
                for (const id of filteredIds) {
                    const d = nodes[id].createdDate;
                    if (!d) continue;
                    const parsed = new Date(d);
                    if (isNaN(parsed.getTime())) continue;
                    validDates.push(parsed);
                }
                if (validDates.length === 0) return null;

                validDates.sort((a, b) => a - b);
                const minDate = validDates[0];
                const maxDate = validDates[validDates.length - 1];
                const rangeDays = (maxDate - minDate) / 86400000;

                let granularity, buckets;

                if (rangeDays < 90) {
                    granularity = 'weekly';
                    buckets = generateWeeklyBuckets(minDate, maxDate);
                } else if (rangeDays <= 547) {
                    granularity = 'monthly';
                    buckets = generateMonthlyBuckets(minDate, maxDate);
                } else {
                    granularity = 'quarterly';
                    buckets = generateQuarterlyBuckets(minDate, maxDate);
                }

                return { granularity, buckets };
            }

            function generateWeeklyBuckets(minDate, maxDate) {
                const buckets = [];
                const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                // Start from Monday of minDate's week
                const start = new Date(minDate);
                const day = start.getDay();
                const diff = day === 0 ? -6 : 1 - day;
                start.setDate(start.getDate() + diff);
                start.setHours(0, 0, 0, 0);

                const end = new Date(maxDate);
                end.setHours(23, 59, 59, 999);

                let current = new Date(start);
                while (current <= end) {
                    const weekStart = new Date(current);
                    const weekEnd = new Date(current);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    weekEnd.setHours(23, 59, 59, 999);

                    // Week number within the month
                    const weekNum = Math.ceil(weekStart.getDate() / 7);
                    const label = 'W' + weekNum + ' ' + MONTHS[weekStart.getMonth()];

                    buckets.push({ label, start: weekStart, end: weekEnd });
                    current.setDate(current.getDate() + 7);
                }
                return buckets;
            }

            function generateMonthlyBuckets(minDate, maxDate) {
                const buckets = [];
                const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                let y = minDate.getFullYear(), m = minDate.getMonth();
                const endY = maxDate.getFullYear(), endM = maxDate.getMonth();

                while (y < endY || (y === endY && m <= endM)) {
                    const start = new Date(y, m, 1);
                    const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
                    const label = MONTHS[m] + ' ' + y;
                    buckets.push({ label, start, end });
                    m++;
                    if (m > 11) { m = 0; y++; }
                }
                return buckets;
            }

            function generateQuarterlyBuckets(minDate, maxDate) {
                const buckets = [];
                let y = minDate.getFullYear();
                let q = Math.floor(minDate.getMonth() / 3);
                const endY = maxDate.getFullYear();
                const endQ = Math.floor(maxDate.getMonth() / 3);

                while (y < endY || (y === endY && q <= endQ)) {
                    const startMonth = q * 3;
                    const start = new Date(y, startMonth, 1);
                    const end = new Date(y, startMonth + 3, 0, 23, 59, 59, 999);
                    const label = 'Q' + (q + 1) + ' ' + y;
                    buckets.push({ label, start, end });
                    q++;
                    if (q > 3) { q = 0; y++; }
                }
                return buckets;
            }

            function assignNodeToBucket(node, buckets) {
                if (!node.createdDate) return -1;
                const d = new Date(node.createdDate);
                if (isNaN(d.getTime())) return -1;
                for (let i = 0; i < buckets.length; i++) {
                    if (d >= buckets[i].start && d <= buckets[i].end) return i;
                }
                return -1;
            }
```

- [ ] **Step 2: Refactor renderGraph to support both layouts**

The existing `renderGraph()` function body (from line 2952 to line 3192) contains the category layout. Wrap the layout-specific section (from the `// Layout constants` comment at line 2988 through the SVG building at line 3191) in a conditional:

After the `// Sort within each category` block (line 2986), replace the rest of `renderGraph()` (lines 2988-3191) with:

```js
                if (currentLayout === 'timeline') {
                    renderTimelineLayout(filteredIds, catGroups, connectedIds, visibleEdges, filteredSet);
                } else {
                    renderCategoryLayout(filteredIds, catGroups, connectedIds, visibleEdges, filteredSet);
                }
```

Then extract the existing category layout code into `renderCategoryLayout()` and add `renderTimelineLayout()`. Both functions go inside `showDependencyMap()`, after the utility functions from Step 1.

**`renderCategoryLayout`**: Move existing lines 2988-3191 into this function. The function signature:

```js
            function renderCategoryLayout(filteredIds, catGroups, connectedIds, visibleEdges, filteredSet) {
                const statsEl = document.getElementById('depmap-stats');
                // ... existing layout code from lines 2988-3191 ...
                // (nodeW, nodeH, gapX, gapY constants + positions + SVG building)
            }
```

Note: move the `statsEl` lookup and the `stats.textContent = ...` line into each layout function since both need it.

- [ ] **Step 3: Implement renderTimelineLayout**

```js
            function renderTimelineLayout(filteredIds, catGroups, connectedIds, visibleEdges, filteredSet) {
                const statsEl = document.getElementById('depmap-stats');
                const bucketResult = computeDateBuckets(filteredIds);

                // Fallback to category if no valid dates
                if (!bucketResult) {
                    renderCategoryLayout(filteredIds, catGroups, connectedIds, visibleEdges, filteredSet);
                    return;
                }

                const { buckets } = bucketResult;

                // Layout constants
                const nodeW = 110, nodeH = 44;
                const gapX = 16, gapY = 24;
                const rowPadTop = 30, rowPadBot = 14, rowGapY = 10;
                const labelW = 110, padL = 16, padR = 16, padT = 16;
                const colW = nodeW + gapX;
                const headerH = 24;

                // Total columns = date buckets + optional "No Date"
                const hasUndated = filteredIds.some(id => assignNodeToBucket(nodes[id], buckets) === -1);
                const totalCols = buckets.length + (hasUndated ? 1 : 0);

                // Assign nodes to cells: { catKey: { colIdx: [nodeIds] } }
                const cells = {};
                for (const id of filteredIds) {
                    const node = nodes[id];
                    const cat = (node.type && TYPE_CATEGORIES[node.type]) || 'Other';
                    const colIdx = assignNodeToBucket(node, buckets);
                    const actualCol = colIdx === -1 ? buckets.length : colIdx; // "No Date" = last col
                    if (!cells[cat]) cells[cat] = {};
                    if (!cells[cat][actualCol]) cells[cat][actualCol] = [];
                    cells[cat][actualCol].push(id);
                }

                // Sort within each cell by project then type
                for (const cat of Object.keys(cells)) {
                    for (const col of Object.keys(cells[cat])) {
                        cells[cat][col].sort((a, b) => {
                            const na = nodes[a], nb = nodes[b];
                            return (na.project || '').localeCompare(nb.project || '') || (na.type || '').localeCompare(nb.type || '');
                        });
                    }
                }

                // Compute row heights (expand for stacked nodes)
                const positions = {};
                let y = padT + headerH;
                const rowBands = [];

                for (const cat of CATEGORY_ORDER) {
                    if (!catGroups[cat] || catGroups[cat].length === 0) continue;

                    // Find max stack in any column for this category
                    let maxStack = 1;
                    if (cells[cat]) {
                        for (const col of Object.keys(cells[cat])) {
                            maxStack = Math.max(maxStack, cells[cat][col].length);
                        }
                    }

                    const numRows = maxStack;
                    const rowH = rowPadTop + numRows * nodeH + (numRows - 1) * rowGapY + rowPadBot;
                    rowBands.push({ cat, y, h: rowH });

                    // Position nodes
                    if (cells[cat]) {
                        for (const [colStr, ids] of Object.entries(cells[cat])) {
                            const col = parseInt(colStr, 10);
                            for (let i = 0; i < ids.length; i++) {
                                positions[ids[i]] = {
                                    x: padL + labelW + col * colW,
                                    y: y + rowPadTop + i * (nodeH + rowGapY),
                                };
                            }
                        }
                    }

                    y += rowH + gapY;
                }

                const svgW = padL + labelW + totalCols * colW + padR;
                const svgH = y - gapY + padT;

                statsEl.textContent = filteredIds.length + ' nodes, ' + visibleEdges.length + ' edges';

                // Build SVG
                const NS = 'http://www.w3.org/2000/svg';
                const svg = document.createElementNS(NS, 'svg');
                svg.setAttribute('class', 'app-depmap-svg');
                svg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);
                svg.setAttribute('width', svgW);
                svg.setAttribute('height', svgH);

                // Column headers
                for (let i = 0; i < buckets.length; i++) {
                    const cx = padL + labelW + i * colW + colW / 2;
                    const hdr = document.createElementNS(NS, 'text');
                    hdr.setAttribute('x', cx);
                    hdr.setAttribute('y', padT + headerH - 6);
                    hdr.setAttribute('text-anchor', 'middle');
                    hdr.setAttribute('font-size', '10');
                    hdr.setAttribute('font-weight', '600');
                    hdr.setAttribute('fill', 'var(--text-secondary, #666)');
                    hdr.textContent = buckets[i].label;
                    svg.appendChild(hdr);
                }

                // "No Date" header
                if (hasUndated) {
                    const cx = padL + labelW + buckets.length * colW + colW / 2;
                    const hdr = document.createElementNS(NS, 'text');
                    hdr.setAttribute('x', cx);
                    hdr.setAttribute('y', padT + headerH - 6);
                    hdr.setAttribute('text-anchor', 'middle');
                    hdr.setAttribute('font-size', '10');
                    hdr.setAttribute('font-weight', '600');
                    hdr.setAttribute('fill', '#b1b4b6');
                    hdr.textContent = 'No Date';
                    svg.appendChild(hdr);
                }

                // Column separator lines
                for (let i = 1; i < totalCols; i++) {
                    const lx = padL + labelW + i * colW - gapX / 2;
                    const line = document.createElementNS(NS, 'line');
                    line.setAttribute('x1', lx);
                    line.setAttribute('y1', padT + headerH);
                    line.setAttribute('x2', lx);
                    line.setAttribute('y2', svgH - padT);
                    line.setAttribute('stroke', 'var(--border-main, #e8e8e8)');
                    line.setAttribute('stroke-width', '1');
                    line.setAttribute('opacity', '0.3');
                    svg.appendChild(line);
                }

                // Row backgrounds
                for (const band of rowBands) {
                    const color = CATEGORY_COLORS[band.cat] || CATEGORY_COLORS.Other;
                    const bg = document.createElementNS(NS, 'rect');
                    bg.setAttribute('x', 0);
                    bg.setAttribute('y', band.y);
                    bg.setAttribute('width', svgW);
                    bg.setAttribute('height', band.h);
                    bg.setAttribute('fill', color);
                    bg.setAttribute('opacity', '0.06');
                    bg.setAttribute('rx', '4');
                    svg.appendChild(bg);

                    const lbl = document.createElementNS(NS, 'text');
                    lbl.setAttribute('x', padL);
                    lbl.setAttribute('y', band.y + 18);
                    lbl.setAttribute('font-size', '11');
                    lbl.setAttribute('font-weight', '700');
                    lbl.setAttribute('fill', color);
                    lbl.textContent = band.cat;
                    svg.appendChild(lbl);
                }

                // Edges (same as category view)
                for (const e of visibleEdges) {
                    const fromPos = positions[e.from];
                    if (!fromPos) continue;
                    const toId = filteredIds.find(id => id.startsWith(e.to));
                    if (!toId) continue;
                    const toPos = positions[toId];
                    if (!toPos) continue;

                    const x1 = fromPos.x + nodeW / 2;
                    const y1 = fromPos.y + nodeH;
                    const x2 = toPos.x + nodeW / 2;
                    const y2 = toPos.y;
                    const dy = Math.abs(y2 - y1) * 0.4;
                    const color = CATEGORY_COLORS[TYPE_CATEGORIES[nodes[e.from].type] || 'Other'] || CATEGORY_COLORS.Other;

                    const path = document.createElementNS(NS, 'path');
                    path.setAttribute('class', 'app-depmap-edge');
                    path.dataset.from = e.from;
                    path.dataset.to = toId;
                    path.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + x1 + ',' + (y1 + dy) + ' ' + x2 + ',' + (y2 - dy) + ' ' + x2 + ',' + y2);
                    path.setAttribute('stroke', color);
                    svg.appendChild(path);
                }

                // Nodes (reuse same rendering as category — extracted as shared function)
                renderNodes(svg, filteredIds, positions, connectedIds, NS);

                svgWrap.textContent = '';
                svgWrap.appendChild(svg);
            }
```

- [ ] **Step 4: Extract shared node rendering into `renderNodes()`**

Both layouts render nodes identically (rect + type text + title text + last-modified dot + event listeners). Extract this from the category layout into a shared function to avoid duplication:

```js
            function renderNodes(svg, filteredIds, positions, connectedIds, NS) {
                const nodeW = 110, nodeH = 44;

                for (const id of filteredIds) {
                    const node = nodes[id];
                    const pos = positions[id];
                    if (!pos) continue;
                    const color = CATEGORY_COLORS[TYPE_CATEGORIES[node.type] || 'Other'] || CATEGORY_COLORS.Other;
                    const isOrphan = !connectedIds.has(id);

                    const shortTitle = (node.title || '').length > 16
                        ? node.title.substring(0, 15) + '\u2026'
                        : (node.title || id);

                    const g = document.createElementNS(NS, 'g');
                    g.setAttribute('class', 'app-depmap-node' + (isOrphan ? ' orphan' : ''));
                    g.dataset.id = id;
                    g.dataset.path = node.path;

                    const rect = document.createElementNS(NS, 'rect');
                    rect.setAttribute('x', pos.x);
                    rect.setAttribute('y', pos.y);
                    rect.setAttribute('width', nodeW);
                    rect.setAttribute('height', nodeH);
                    rect.setAttribute('rx', '4');
                    rect.setAttribute('fill', 'var(--bg-surface, #fff)');
                    rect.setAttribute('stroke', color);
                    rect.setAttribute('stroke-width', '1.5');
                    g.appendChild(rect);

                    const typeText = document.createElementNS(NS, 'text');
                    typeText.setAttribute('x', pos.x + nodeW / 2);
                    typeText.setAttribute('y', pos.y + 16);
                    typeText.setAttribute('text-anchor', 'middle');
                    typeText.setAttribute('font-size', '11');
                    typeText.setAttribute('font-weight', '700');
                    typeText.setAttribute('fill', color);
                    typeText.textContent = node.type;
                    g.appendChild(typeText);

                    const titleText = document.createElementNS(NS, 'text');
                    titleText.setAttribute('x', pos.x + nodeW / 2);
                    titleText.setAttribute('y', pos.y + 30);
                    titleText.setAttribute('text-anchor', 'middle');
                    titleText.setAttribute('font-size', '8');
                    titleText.setAttribute('fill', 'var(--text-secondary, #666)');
                    titleText.textContent = shortTitle;
                    g.appendChild(titleText);

                    // Last-modified indicator dot
                    if (node.lastModified) {
                        const lmDate = new Date(node.lastModified);
                        if (!isNaN(lmDate.getTime())) {
                            const daysAgo = (Date.now() - lmDate.getTime()) / 86400000;
                            let dotColor = null;
                            if (daysAgo < 7) dotColor = '#00703c';
                            else if (daysAgo < 30) dotColor = '#f47738';
                            if (dotColor) {
                                const dot = document.createElementNS(NS, 'circle');
                                dot.setAttribute('cx', pos.x + nodeW - 6);
                                dot.setAttribute('cy', pos.y + 6);
                                dot.setAttribute('r', '3');
                                dot.setAttribute('fill', dotColor);
                                g.appendChild(dot);
                            }
                        }
                    }

                    // Event listeners
                    g.addEventListener('mouseenter', () => {
                        const nodeId = g.dataset.id;
                        const connNodes = new Set([nodeId]);
                        svg.querySelectorAll('.app-depmap-edge').forEach(p => {
                            if (p.dataset.from === nodeId || p.dataset.to === nodeId) {
                                p.classList.add('highlighted');
                                connNodes.add(p.dataset.from);
                                connNodes.add(p.dataset.to);
                            } else {
                                p.classList.add('dimmed');
                            }
                        });
                        svg.querySelectorAll('.app-depmap-node').forEach(n => {
                            if (!connNodes.has(n.dataset.id)) n.classList.add('dimmed');
                        });

                        const nd = nodes[nodeId];
                        if (nd) {
                            const ttTitle = document.createElement('strong');
                            ttTitle.textContent = nd.title || nodeId;
                            const ttMeta = document.createElement('span');
                            ttMeta.textContent = nd.type + ' \u00b7 ' + nd.project + ' \u00b7 ' + (nd.status || 'No status') + ' \u2014 Severity: ' + (nd.severity || 'LOW');
                            tooltip.textContent = '';
                            tooltip.appendChild(ttTitle);
                            tooltip.appendChild(ttMeta);
                            tooltip.style.display = 'block';
                            const r = g.getBoundingClientRect();
                            tooltip.style.left = (r.right + 8) + 'px';
                            tooltip.style.top = r.top + 'px';
                        }
                    });

                    g.addEventListener('mouseleave', () => {
                        svg.querySelectorAll('.app-depmap-edge').forEach(p => {
                            p.classList.remove('highlighted', 'dimmed');
                        });
                        svg.querySelectorAll('.app-depmap-node').forEach(n => {
                            n.classList.remove('dimmed');
                        });
                        tooltip.style.display = 'none';
                    });

                    g.addEventListener('click', () => {
                        const docPath = g.dataset.path;
                        if (docPath) {
                            tooltip.style.display = 'none';
                            window.location.hash = docPath;
                        }
                    });

                    svg.appendChild(g);
                }
            }
```

Then update `renderCategoryLayout` to call `renderNodes(svg, filteredIds, positions, connectedIds, NS)` instead of the inline node loop, and remove the inline node rendering code from it.

- [ ] **Step 5: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: implement timeline layout with auto-detect granularity"
```

---

## Task 7: Propagate and verify

**Files:**

- Copy: `arckit-claude/templates/pages-template.html` → `.arckit/templates/pages-template.html`
- Run: `scripts/converter.py`

- [ ] **Step 1: Copy template**

```bash
cp arckit-claude/templates/pages-template.html .arckit/templates/pages-template.html
```

- [ ] **Step 2: Run converter**

```bash
python scripts/converter.py
```

Expected: `Generated 60 Codex Extension + 60 Codex Skills + 60 OpenCode CLI + 60 Gemini CLI + 60 Copilot = 300 total files.`

- [ ] **Step 3: Verify no undefined CSS variables**

```bash
grep -n 'var(--color-' arckit-claude/templates/pages-template.html
```

Expected: No matches (all should use `--bg-surface`, `--text-primary`, etc.)

- [ ] **Step 4: Commit all propagated files**

```bash
git add arckit-claude/templates/pages-template.html .arckit/templates/pages-template.html
git add arckit-codex/ arckit-copilot/ arckit-opencode/ arckit-gemini/
git commit -m "chore: propagate timeline layout to all extension templates"
```

---

## Task 8: Final integration and PR

- [ ] **Step 1: Run markdown lint**

```bash
npx markdownlint-cli2 "docs/**/*.md"
```

Fix any issues if found.

- [ ] **Step 2: Create feature branch and PR**

```bash
git checkout -b feat/depmap-timeline
# Cherry-pick or squash all commits from Tasks 1-7
git push -u origin feat/depmap-timeline
gh pr create --title "feat: add timeline layout to dependency map" --body "..."
```

- [ ] **Step 3: Merge and tag release**

After CI passes, merge PR, bump version, tag release per standard workflow.
