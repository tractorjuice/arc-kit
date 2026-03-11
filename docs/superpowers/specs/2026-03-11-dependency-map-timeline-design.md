# Dependency Map Timeline View — Design Spec

**Date**: 2026-03-11
**Status**: Approved

## Overview

Add a timeline layout mode to the dependency map in the ArcKit pages template. Documents are placed into date-based columns (X-axis) while retaining category bands (Y-axis). A toggle switches between the existing "Category" sequential-fill view and the new "Timeline" date-column view.

## Data Layer

**File**: `arckit-claude/hooks/graph-utils.mjs`

In `scanProjectDir()`, `extractDocControlFields(content)` is already called and its result stored in `fields`. Add two fields to each node object alongside the existing `status` extraction:

```js
nodes[fullId] = {
  type: docType,
  project: projectName,
  path: `projects/${projectName}/${prefix}${f}`,
  title,
  status,
  severity: classifySeverity(docType),
  createdDate: fields['Created Date'] || null,   // e.g. "2026-01-15"
  lastModified: fields['Last Modified'] || null,  // e.g. "2026-03-10"
};
```

No new parsing logic needed — `extractDocControlFields()` already reads the Document Control table which contains these fields in every ArcKit template.

## Auto-detect Granularity

Runs client-side in the timeline layout function. Collects all `createdDate` values from visible nodes (after project filter is applied), parses them as `Date` objects, discards any that fail to parse (invalid/malformed), computes the date range, and selects bucket size:

| Date range | Granularity | Column header format |
|------------|-------------|---------------------|
| < 90 days | Weekly | "W1 Jan", "W2 Jan" |
| 90 days – 18 months | Monthly | "Jan 2026", "Feb 2026" |
| > 18 months | Quarterly | "Q1 2026", "Q2 2026" |

**Bucket computation algorithm:**

1. Collect all valid `createdDate` values from filtered nodes, parse as `new Date(str)`
2. Skip any `NaN` / invalid results
3. If zero valid dates remain, hide Timeline toggle — only Category view available
4. Find `minDate` and `maxDate`, compute `rangeMs = maxDate - minDate`
5. Select granularity based on `rangeDays = rangeMs / 86400000`
6. Generate contiguous buckets using **calendar boundaries**:
   - **Weekly**: ISO weeks — bucket starts on Monday of each week from `minDate`'s week to `maxDate`'s week
   - **Monthly**: Calendar months — `YYYY-MM` from `minDate`'s month to `maxDate`'s month
   - **Quarterly**: Calendar quarters — Q1 (Jan–Mar), Q2 (Apr–Jun), Q3 (Jul–Sep), Q4 (Oct–Dec)
7. No gaps skipped — every bucket in the range gets a column, even if empty
8. Assign each dated node to its bucket by comparing `createdDate` against bucket boundaries
9. Nodes with no `createdDate` (null or invalid) go in a "No Date" column at the far right

**"No Date" column:**

- Positioned as the rightmost column after all date columns
- Header text: "No Date"
- Header colour: `#b1b4b6` (same grey as `CATEGORY_COLORS.Other`)
- Nodes sorted within by project then type (same as category view)
- Hidden entirely if all nodes have valid dates

## Layout Toggle

**Location**: Controls bar, before the Project filter dropdown.

```text
Layout: [Category] [Timeline]   Project: [All Projects ▾]   12 nodes, 8 edges
```

Two buttons styled as a segmented control. "Category" is the default. Selection persists across page loads via new `localStorage` key `arckit-depmap-layout` (distinct from existing `arckit-theme` key).

Both buttons call `renderGraph()` which checks the current layout mode and delegates to the appropriate layout function. When no nodes have valid dates, the Timeline button is hidden and only Category is shown.

## Timeline Layout

### Axes

- **Y-axis**: Category bands using `CATEGORY_ORDER` from the existing code. Currently: `['Getting Started', 'Discovery', 'Planning', 'Architecture', 'Governance', 'Compliance', 'Operations', 'Procurement', 'Integrations', 'Reporting', 'Other']`. Band background colour from `CATEGORY_COLORS`. Category label on the left. (Note: the `CATEGORY_ORDER` array in the dependency map must be updated to match the current categories — it still has the old `Research` entry.)
- **X-axis**: Date columns from auto-detect. Column headers rendered as SVG `<text>` elements at the top of the SVG canvas, centred within each column. Font: 10px, weight 600, fill `var(--text-secondary, #666)`. Light vertical separator lines (1px, `var(--border-main, #e8e8e8)`, opacity 0.3) between columns.

### Column dimensions

- Column width: `nodeW + gapX` (110 + 16 = 126px) — matches current node spacing
- SVG width grows with number of date columns — scrollable via existing `overflow-x: auto` on the wrapper div
- Column header area: 24px tall at top of SVG, above the first category band

### Node placement

Each node is placed at the intersection of its category row and date-bucket column:

1. Determine the node's date bucket from `createdDate`
2. Determine the node's category from `TYPE_CATEGORIES[node.type]`
3. Place at `(columnX, categoryRowY)`
4. If multiple nodes land in the same cell (same category + same date bucket), stack top-to-bottom within the cell, sorted by project then type (same order as category view). No maximum — the category band height expands to fit all stacked nodes. Each additional node adds `nodeH + rowGapY` (44 + 10 = 54px) to the band height.

### Edges

Same curved Bézier paths as current view, connecting from source node bottom to target node top. Colour matches source node category.

### Interactions

All existing interactions preserved:

- Hover: highlight connected edges, dim others, show tooltip
- Click: navigate to document
- Project filter: re-renders with filtered nodes (granularity recomputed for filtered set)

## Last Modified Indicator

Nodes with recent `lastModified` dates display a small indicator dot (4px circle) in the top-right corner of the node rectangle:

| Recency | Colour | Meaning |
|---------|--------|---------|
| < 7 days | Green (#00703c) | Recently updated |
| 7–30 days | Amber (#f47738) | Updated this month |
| > 30 days or null | No dot | Not recently modified |

This indicator appears in **both** Category and Timeline views. This is the one visual addition to the Category view — the layout and positioning logic remains unchanged.

## Category View

Layout and positioning logic remains exactly as-is (sequential fill within category bands). The only addition is the last-modified indicator dot on nodes (see above). The toggle simply switches which layout function executes inside `renderGraph()`.

## Files Changed

1. **`arckit-claude/hooks/graph-utils.mjs`** — Add `createdDate` and `lastModified` to node data (2 lines added). This is the only backend change.
2. **`arckit-claude/templates/pages-template.html`** (source of truth) — Layout toggle UI, timeline layout function, auto-detect granularity logic, last-modified indicator dots, column header rendering, update `CATEGORY_ORDER` to match current categories
3. **`.arckit/templates/pages-template.html`** — Copy from above (keeps the two in sync)
4. **Run `scripts/converter.py`** — Propagates template changes to `arckit-codex/`, `arckit-opencode/`, `arckit-gemini/`, `arckit-copilot/` extension directories

## Graceful Degradation

- Manifest gains two new optional fields per node (`createdDate`, `lastModified`)
- All timeline rendering code must null-check these fields — `if (!node.createdDate)` routes to "No Date" column
- Old manifests without these fields: Timeline toggle hidden (zero valid dates), Category view works as before
- Category view (default) unchanged except for last-modified dots
- No new files, no new dependencies

## Edge Cases

- **All dates identical**: Single date column with all nodes stacked by category — functional but sparse
- **Very wide date ranges** (years): Quarterly buckets keep column count manageable
- **Mixed dated/undated**: Dated nodes in their columns, undated in "No Date" column at right
- **Single project filter**: Global docs (000-global) included as they are today; their dates participate in column generation
- **Malformed dates**: Treated same as missing — node goes to "No Date" column
- **All dates missing**: Timeline toggle hidden, only Category view available
