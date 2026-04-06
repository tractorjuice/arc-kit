# Pages Sidebar Version Display

**Date**: 2026-04-06
**Status**: Draft
**Scope**: `arckit-claude/templates/pages-template.html` only

## Problem

The pages sidebar lists documents by title only. When multiple versions of the same document type exist in a project (e.g., Data Model v1.0 and v2.0), the sidebar shows two identical entries with no way to distinguish them.

Example from [fuel-prices test repo](https://tractorjuice.github.io/arckit-test-project-v17-fuel-prices/#projects/001-uk-fuel-price-transparency-service/ARC-001-DATA-v1.0.md):

```
Data
  Data Model        ← which version?
  Data Model        ← which version?
```

## Design

### Always show version badges

Every document with a `documentId` gets a version indicator in the sidebar. The version is extracted from the `documentId` field already present in `manifest.json` (e.g., `ARC-001-DATA-v1.0` -> `v1.0`).

### Single version: static badge

Documents that are the only version of their type show a muted right-aligned badge:

```
Requirements                    v1.0
Stakeholder Drivers             v1.0
```

### Multiple versions: inline dropdown

When multiple versions of the same base document exist (same `baseDocId`), they collapse into a single sidebar entry with an inline `<select>` dropdown:

```
Data Model                  [v2.0 ▾]
```

The dropdown lists all available versions. The highest version is selected by default. Changing the selection loads that version's document.

## Implementation

### Helper functions

```js
// Extract version string from documentId
// "ARC-001-DATA-v1.0" -> "1.0"
function extractVersion(documentId) {
  if (!documentId) return null;
  const m = documentId.match(/-v(\d+\.\d+)$/);
  return m ? m[1] : null;
}

// Strip version to get grouping key
// "ARC-001-DATA-v1.0" -> "ARC-001-DATA"
function baseDocId(documentId) {
  return documentId ? documentId.replace(/-v\d+(\.\d+)?$/, '') : null;
}
```

### Grouping logic

A function groups a flat array of document objects by `baseDocId`:

```js
// Input:  [{ title: "Data Model", documentId: "ARC-001-DATA-v1.0", path: "..." },
//          { title: "Data Model", documentId: "ARC-001-DATA-v2.0", path: "..." }]
// Output: { "ARC-001-DATA": [sorted by version ascending] }
function groupByBaseDoc(docs) {
  const groups = {};
  docs.forEach(doc => {
    const key = baseDocId(doc.documentId) || doc.path;
    if (!groups[key]) groups[key] = [];
    groups[key].push(doc);
  });
  // Sort each group by version ascending so highest is last
  Object.values(groups).forEach(group => {
    group.sort((a, b) => {
      const va = extractVersion(a.documentId) || '0';
      const vb = extractVersion(b.documentId) || '0';
      return va.localeCompare(vb, undefined, { numeric: true });
    });
  });
  return groups;
}
```

### Rendering

For each group in a category:

**Single version** — static badge:

```html
<li>
  <a href="#projects/001/ARC-001-REQ-v1.0.md" data-path="projects/001/ARC-001-REQ-v1.0.md">
    Requirements
    <span class="app-nav-version">v1.0</span>
  </a>
</li>
```

**Multiple versions** — link with inline select (highest version selected by default):

```html
<li>
  <a href="#projects/001/ARC-001-DATA-v2.0.md" data-path="projects/001/ARC-001-DATA-v2.0.md" class="app-nav-versioned">
    Data Model
    <select class="app-nav-version-select">
      <option value="projects/001/ARC-001-DATA-v1.0.md">v1.0</option>
      <option value="projects/001/ARC-001-DATA-v2.0.md" selected>v2.0</option>
    </select>
  </a>
</li>
```

### CSS

```css
.app-nav-version {
  float: right;
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 400;
}

.app-nav-version-select {
  float: right;
  font-size: 0.7rem;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 3px;
  padding: 0 4px;
  cursor: pointer;
}
```

### Interaction

1. Clicking the `<a>` link loads the currently-selected version (default: highest)
2. Changing the `<select>` updates the link's `data-path` and `href`, then triggers document load
3. `<select>` click event uses `stopPropagation()` to prevent the link's click handler from firing
4. Active state highlighting works as before, based on the current `data-path`
5. When navigating via URL hash (e.g., `#.../ARC-001-DATA-v1.0.md`), the sidebar selects the correct version in the dropdown and marks the entry active

### Where rendering functions change

All document rendering in these functions follows the same pattern (`doc.title` -> grouped with version badge/select):

- `buildNavSection()` — global documents
- `buildProjectNav()` — all project document arrays (documents, diagrams, decisions, wardleyMaps, dataContracts, research, reviews, vendors, vendorProfiles, techNotes)

A shared `renderDocList(docs)` helper avoids duplicating the grouping + badge/select logic across all these call sites.

## What changes

- `arckit-claude/templates/pages-template.html`: JS (helper functions, rendering functions) and CSS (two new classes)

## What does NOT change

- Manifest schema — no new fields, `documentId` already exists
- Hooks (`update-manifest.mjs`, `sync-guides.mjs`) — no changes
- `/arckit.pages` command — no changes
- Guides, role guides, external docs — these lack `documentId`, no version badge shown (unchanged)
