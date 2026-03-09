# Vendor Scores on Pages Dashboard

**Date**: 2026-03-09
**Status**: Approved
**Branch**: daily

## Problem

The `/arckit.score` command writes structured vendor scoring data to `projects/{id}/vendors/scores.json`, but the pages dashboard has no awareness of this data. Users must open the raw JSON or re-run the score command to compare vendors.

## Design

Add a vendor scores comparison table to the existing pages dashboard, visible below the KPI cards/charts section.

### Data Flow

The `sync-guides.mjs` hook already scans `vendors/` for profiles during manifest building. We extend `scanProject()` to also check for `vendors/scores.json`. If found, parse it and compute category averages server-side, then attach a `vendorScores` summary object to the project entry in `manifest.json`.

### Manifest Schema Addition

Each project in `manifest.json` gains an optional `vendorScores` field:

```json
{
  "id": "001-project-name",
  "vendorScores": {
    "lastUpdated": "2026-03-09T00:00:00Z",
    "criteria": [
      { "id": "C-001", "name": "Technical Fit", "weight": 0.25, "category": "Technical" }
    ],
    "vendors": [
      {
        "name": "Streamlit (+ Community Cloud)",
        "slug": "streamlit",
        "totalWeighted": 2.55,
        "totalRaw": 20,
        "maxPossible": 24,
        "categoryAverages": {
          "Technical": 3.0,
          "Commercial": 3.0,
          "Sustainability": 3.0,
          "Governance": 1.5,
          "Operational": 3.0
        }
      }
    ]
  }
}
```

Only summary data goes into the manifest. Evidence and risk text stay in the full `scores.json`.

### Dashboard UI

A new section titled "Vendor Scores" appears below the existing KPI cards/charts. Only rendered if any project has `vendorScores` data.

Per project with scores:

- **Header**: "Vendor Scores -- {Project Name}" with last-updated date
- **Table**: Columns are Vendor | Weighted Total | Raw Score | one column per category (dynamic from criteria)
- **Bars**: Horizontal bars below the table showing relative scores as percentage of max possible
- **Sorting**: Vendors sorted by weighted total descending (winner on top)
- **Colour coding**: Score cells use 3=green, 2=amber, 1=orange, 0=red
- **Multiple projects**: Each project with scores gets its own section

### Files to Change

| File | Change |
|------|--------|
| `arckit-claude/hooks/sync-guides.mjs` | Read `vendors/scores.json` in `scanProject()`, compute category averages, attach to manifest |
| `arckit-claude/hooks/sync-guides.mjs` | Add `search`, `score`, `impact` to `GUIDE_CATEGORIES` and `GUIDE_STATUS` maps |
| `arckit-claude/templates/pages-template.html` | Add vendor scores section to dashboard rendering JS |
| `arckit-claude/commands/pages.md` | Add `Vendor Scores` stat to Step 5 summary template |

### What We Are NOT Doing

- No new files, hooks, or architectural changes
- No per-criterion detail (evidence/risks) on the dashboard -- that stays in `scores.json`
- No interactive features (expand/collapse, filtering)
- No hardcoded category names -- derived dynamically from criteria in `scores.json`
