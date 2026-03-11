# Dependency Graph Dashboard Panel — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive "Dependency Map" visualization to the ArcKit pages dashboard that renders document cross-references as an SVG graph with category-layered layout, hover highlights, click navigation, project filtering, and orphan detection.

**Architecture:** Extract the graph-building logic from `impact-scan.mjs` into a shared `graph-utils.mjs` module. Extend `sync-guides.mjs` to call this module and write the graph into `manifest.json` under a `dependencyGraph` key. Add a new `#dependency-map` hash route in `pages-template.html` that renders an interactive SVG graph using the manifest data, with a header nav link to access it.

**Tech Stack:** Vanilla JS (no libraries), inline SVG rendering, existing GDS colour palette from `CATEGORY_COLORS`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `arckit-claude/hooks/graph-utils.mjs` | **Create** | Shared graph-building functions: `scanAllArtifacts()`, `classifySeverity()`, `extractTitle()` — extracted from impact-scan.mjs |
| `arckit-claude/hooks/impact-scan.mjs` | **Modify** | Replace duplicated functions with imports from `graph-utils.mjs` |
| `arckit-claude/hooks/sync-guides.mjs` | **Modify** | Import `scanAllArtifacts` from `graph-utils.mjs`, build graph, write to manifest |
| `arckit-claude/templates/pages-template.html` | **Modify** | Add nav link, hash route, `showDependencyMap()` function, SVG layout + interaction code, CSS styles |

---

## Chunk 1: Extract shared graph utilities and wire into manifest

### Task 1: Create `graph-utils.mjs` with extracted functions

**Files:**
- Create: `arckit-claude/hooks/graph-utils.mjs`

The graph-building logic currently lives in `impact-scan.mjs` (lines 30-143). Extract five functions into a shared module: `extractTitle`, `classifySeverity`, `scanProjectDir`, `scanAllArtifacts`. These are pure functions with no hook-specific logic.

- [ ] **Step 1: Create `graph-utils.mjs`**

Copy the following functions from `impact-scan.mjs` into the new file, converting them to named exports:
- `extractTitle` (lines 32-35)
- `classifySeverity` (lines 39-46)
- `scanProjectDir` (lines 66-143) — includes vendor directory scanning and cross-reference extraction
- `scanAllArtifacts` (lines 50-64) — orchestrates scanning all project directories

Import dependencies: `join` from `node:path`, `isDir`, `isFile`, `readText`, `listDir`, `extractDocType`, `extractVersion`, `extractDocControlFields`, `extractRequirementIds` from `./hook-utils.mjs`, and `DOC_TYPES` from `../config/doc-types.mjs`.

- [ ] **Step 2: Verify file is syntactically valid**

Run: `node -c arckit-claude/hooks/graph-utils.mjs`
Expected: No syntax errors

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/hooks/graph-utils.mjs
git commit -m "refactor: extract graph-building logic into shared graph-utils.mjs"
```

---

### Task 2: Refactor `impact-scan.mjs` to use shared module

**Files:**
- Modify: `arckit-claude/hooks/impact-scan.mjs`

Replace the duplicated `extractTitle`, `classifySeverity`, `scanProjectDir`, and `scanAllArtifacts` functions (lines 30-143) with a single import from `graph-utils.mjs`. Keep `parseArguments` and the main hook logic (lines 145-208) as-is.

- [ ] **Step 1: Replace imports and remove duplicated functions**

Replace lines 1-143 with:
- Same file header comment
- Import `join` from `node:path`
- Import `isDir`, `findRepoRoot`, `parseHookInput` from `./hook-utils.mjs`
- Import `scanAllArtifacts` from `./graph-utils.mjs`
- Keep `parseArguments` function

The rest of the file (from `// -- Main --` onwards, lines 145-208) stays exactly as-is. The `scanAllArtifacts` call on line 166 now resolves to the imported function.

- [ ] **Step 2: Verify hook still parses correctly**

Run: `node -c arckit-claude/hooks/impact-scan.mjs`
Expected: No syntax errors

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/hooks/impact-scan.mjs
git commit -m "refactor: import graph-building from shared graph-utils.mjs in impact-scan"
```

---

### Task 3: Extend `sync-guides.mjs` to build graph and write to manifest

**Files:**
- Modify: `arckit-claude/hooks/sync-guides.mjs`

Add a graph-building step between manifest building (line 634) and manifest writing (line 637). Import `scanAllArtifacts` from `graph-utils.mjs` and attach the result to the manifest object.

- [ ] **Step 1: Add import at top of file**

After the existing imports from `./hook-utils.mjs`, add:

```javascript
import { scanAllArtifacts } from './graph-utils.mjs';
```

- [ ] **Step 2: Add graph data to manifest**

In the `buildManifest` function (around line 509, just before `return manifest;`), add:

```javascript
  // Dependency graph for dashboard visualization
  const projectsDir = join(repoRoot, 'projects');
  if (isDir(projectsDir)) {
    const graph = scanAllArtifacts(projectsDir);
    if (Object.keys(graph.nodes).length > 0) {
      manifest.dependencyGraph = {
        nodes: graph.nodes,
        edges: graph.edges,
      };
    }
  }
```

Note: Intentionally exclude `reqIndex` from manifest (large, only needed by impact command). Also exclude the `projects` array (redundant with manifest's own project list).

- [ ] **Step 3: Update stats output to include graph info**

In the stats table (around line 708, after the `Scored Vendors` row), add two new rows:

```
| Graph Nodes | ${manifest.dependencyGraph ? Object.keys(manifest.dependencyGraph.nodes).length : 0} |
| Graph Edges | ${manifest.dependencyGraph ? manifest.dependencyGraph.edges.length : 0} |
```

- [ ] **Step 4: Verify hook still parses correctly**

Run: `node -c arckit-claude/hooks/sync-guides.mjs`
Expected: No syntax errors

- [ ] **Step 5: Commit**

```bash
git add arckit-claude/hooks/sync-guides.mjs
git commit -m "feat: build dependency graph in manifest.json for dashboard visualization"
```

---

## Chunk 2: Dashboard visualization

### Task 4: Add CSS styles for the dependency map

**Files:**
- Modify: `arckit-claude/templates/pages-template.html`

Add styles for the dependency map container, controls bar, SVG canvas, node rectangles, edge paths, tooltips, legend strip, orphan indicator (dashed border), and hover states (highlighted/dimmed classes). Insert in the `<style>` block after existing dashboard styles. Key classes:

- `.app-depmap-container` — outer wrapper with border and rounded corners
- `.app-depmap-controls` — flexbox bar with project filter dropdown
- `.app-depmap-svg` — responsive SVG canvas
- `.app-depmap-node` — clickable node group with hover transition
- `.app-depmap-edge` — path with 0.3 default opacity, transitions to 1.0 when highlighted
- `.app-depmap-node.orphan circle` — dashed stroke for unconnected nodes
- `.app-depmap-node.dimmed` / `.app-depmap-edge.dimmed` — low opacity when not connected to hovered node
- `.app-depmap-tooltip` — absolute positioned tooltip with title + meta
- `.app-depmap-legend` — flex row of category colour swatches
- `.app-depmap-empty` — centred empty state message

- [ ] **Step 1: Add the CSS block**

Write the full CSS for all classes listed above.

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: add CSS styles for dependency map dashboard panel"
```

---

### Task 5: Add header nav link and hash routing for Dependency Map

**Files:**
- Modify: `arckit-claude/templates/pages-template.html`

- [ ] **Step 1: Add nav link in header**

After the Roles link (line 1552), add a "Map" link:
```html
<a href="#dependency-map" id="depmap-link" class="app-header__guides-link">Map</a>
```

- [ ] **Step 2: Add event listener for the new link**

After the roles link event listener, add a `depmap-link` click handler that sets `window.location.hash = 'dependency-map'` and closes mobile sidebar.

- [ ] **Step 3: Add hash route handling**

In both the initial hash handler and the `hashchange` listener, add:
```javascript
} else if (path === 'dependency-map') {
    showDependencyMap();
```

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: add Dependency Map nav link and hash routing"
```

---

### Task 6: Implement `showDependencyMap()` function

**Files:**
- Modify: `arckit-claude/templates/pages-template.html`

This is the core rendering function. Add it after the `showDashboard()` function (after line 2722). Key design:

**Layout algorithm** — Layered by category:
- Y-axis: category bands (Discovery at top, Research at bottom) using `CATEGORY_ORDER` array
- X-axis: nodes sorted by project then doc type within each category row
- Each row has a tinted background rectangle and a category label on the left
- Node rectangles are 90x36px with 24px horizontal gap and 20px vertical gap between rows

**Node rendering:**
- Rounded rectangle per node, stroke colour from `CATEGORY_COLORS[category]`
- Two text lines: type code (bold, coloured) and truncated title (muted, 8px)
- Orphan nodes (not in any edge) get `stroke-dasharray: 4,3`

**Edge rendering:**
- Curved SVG `<path>` using cubic bezier from source node bottom to target node top
- Stroke colour matches source node's category
- Default opacity 0.3, highlighted opacity 1.0

**Interactions:**
- **Hover node**: Add `highlighted` class to hovered node + connected nodes/edges. Add `dimmed` to everything else. Show tooltip with title, type, project, status, severity.
- **Click node**: Navigate to document via `window.location.hash = path`
- **Project filter**: `<select>` dropdown re-renders the graph with only nodes from selected project

**Empty states:**
- No `manifest.dependencyGraph`: Show message suggesting `/arckit:pages`
- No nodes: Show message suggesting creating documents
- No nodes for selected project: Show inline SVG text

**Function structure:**
```
showDependencyMap()
  ├── Guard: check manifest.dependencyGraph exists → empty state if not
  ├── Build project list for filter dropdown
  ├── Build connectedIds set for orphan detection
  ├── Render outer HTML (header, container, controls, SVG, legend)
  ├── Render legend from CATEGORY_COLORS
  ├── renderGraph(filterProject)  ← inner function, called on init and filter change
  │   ├── Filter nodeIds by project
  │   ├── Group by category
  │   ├── Sort within category by project + type
  │   ├── Compute positions (layered layout)
  │   ├── Render category row backgrounds
  │   ├── Render edges as curved paths
  │   ├── Render nodes as rect groups
  │   └── Attach hover/click event listeners
  └── Attach filter change handler
```

- [ ] **Step 1: Write the complete `showDependencyMap` function**

Add after `showDashboard()` closing brace (line 2722). The function should be approximately 200-250 lines implementing the design above.

Key implementation details:
- Use `escapeHtml()` (already exists in template) for all user-facing text
- Use `TYPE_CATEGORIES` (already exists, line ~2180) to look up category from type code
- Use `CATEGORY_COLORS` (already exists, line 2187) for node/edge colours
- Use `loadDocument(path)` (already exists) for click navigation
- Tooltip positioning: calculate relative to SVG bounding rect

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: implement interactive dependency map visualization with SVG rendering"
```

---

### Task 7: End-to-end verification

- [ ] **Step 1: Run the converter to propagate changes**

Run: `python scripts/converter.py`
Expected: 300 files generated, no errors

- [ ] **Step 2: Verify all modified hooks parse correctly**

Run: `node -c arckit-claude/hooks/graph-utils.mjs && node -c arckit-claude/hooks/impact-scan.mjs && node -c arckit-claude/hooks/sync-guides.mjs && echo "All OK"`
Expected: `All OK`

- [ ] **Step 3: Test in a test repo (manual)**

In a test repo with the plugin enabled:
1. Run `/arckit:pages` — should see `Graph Nodes` and `Graph Edges` in the stats table
2. Open `docs/index.html` in browser
3. Click "Map" in the header nav
4. Verify: nodes render as coloured rectangles grouped by category row
5. Verify: edges render as curved paths between nodes
6. Verify: hover on a node highlights connected edges and dims others
7. Verify: click on a node navigates to the document
8. Verify: project filter dropdown changes visible nodes
9. Verify: orphan nodes (no connections) have dashed borders
10. Verify: empty state shows helpful message if no graph data

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: add interactive dependency map to pages dashboard"
```
