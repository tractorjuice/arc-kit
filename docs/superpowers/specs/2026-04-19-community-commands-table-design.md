# Community Commands Table on `commands.html`

**Date:** 2026-04-19
**Status:** Approved — ready for implementation plan
**Scope:** Single-file change to `docs/commands.html` (no converter, no other docs)

## Problem

As of v4.7.0, ArcKit ships 86 commands: 68 officially-maintained baseline + 18 community-contributed (all 18 are EU or French regulatory, contributed by [@thomas-jardinet](https://github.com/thomas-jardinet)). The policy recorded in project memory is: **top-line "N commands" figures refer to the baseline only; community overlays are counted inside their own section**.

`commands.html` currently lists the 68 official commands only. The 18 community commands are invisible to anyone browsing the site, which makes them undiscoverable despite being real, installable, and shipped in the plugin. A visitor searching for `/arckit.fr-rgpd` finds nothing.

This design adds a second table — explicitly framed as community-contributed — beneath the main one, without collapsing the maintenance-tier distinction.

## Goals

1. Make the 18 community commands discoverable on `commands.html`.
2. Signal the maintenance-tier distinction clearly but neutrally (no amber warnings; no apology).
3. Credit contributors visibly at the row level.
4. Preserve the existing official-table UX (filters, sort, search) unchanged.
5. Keep the change self-contained in `commands.html` — no ripple into other docs, converters, or extension formats.

## Non-Goals

- Regenerating Gemini / Codex / OpenCode / Copilot extension formats.
- Adding community commands to the Dependency Matrix grid on `commands.html`.
- Updating `index.html`, `llms.txt`, `DEPENDENCY-MATRIX.md`, or any other doc. Those are separate follow-ups if desired.
- Changing the top-line "68 AI Commands" hero stat, `<h2>` heading, or meta descriptions.
- Adding per-command reference-project examples for community commands (none exist yet; column is dropped).

## Design

### Page layout

A new `<section>` is inserted between the main command table (closing `</div>` of its `app-command-table-container`, around line 1359) and the Dependency Matrix block (opens around line 1411):

```
[main command table, unchanged]
───
<h2 id="community-commands">18 Community Commands</h2>
<div class="app-community-banner">…contributor credit + maintenance note…</div>
<div class="app-filter-controls">…jurisdiction dropdown, search, visible-count…</div>
<div class="app-command-table-container">
  <table id="community-table">…18 rows…</table>
</div>
───
[Dependency Matrix, unchanged]
```

The existing `<h2>` (line 515) stays as `68 ArcKit AI Commands`. A sentence is appended to the lead paragraph underneath: *"An additional 18 community-contributed commands appear in their own section below."*

### Banner

Neutral grey, no amber warnings. Contributor credit lives here at the section level (rows also carry per-command attribution):

> **Community-contributed.** These 18 commands extend ArcKit into EU and French regulatory territory. They were contributed by [@thomas-jardinet](https://github.com/thomas-jardinet) and follow the same template-driven patterns as the official commands. They are **not yet regression-tested** across ArcKit's reference repositories, so output quality may lag the official set as underlying regulations and ArcKit schemas evolve. Issues welcome.

### Table structure

Six columns — Examples is dropped (no reference outputs exist yet), Jurisdiction and Contributor are added:

| Column | Notes |
|---|---|
| Command | `<code>/arckit.eu-xxx</code>` format, matching main table |
| Description | Frontmatter `description` with leading `[COMMUNITY] ` stripped |
| Category | See category mapping below |
| Jurisdiction | `EU` (7 commands) or `France` (11 commands) |
| Contributor | `<a href="https://github.com/thomas-jardinet">@thomas-jardinet</a>` for all 18 |
| Status | Single `<span class="app-status-tag app-status-community">Community</span>` badge |

A new CSS rule: `.app-status-community { background:#f3f2f1; color:#383f43; border:1px solid #b1b4b6; }` — neutral grey, distinct from the amber/green maturity tags used in the official table.

Row attributes: `<tr data-jurisdiction="eu|france" data-category="...">` to support filter JS.

### Category mapping

Default for all 18 is **Quality & Compliance** (they're compliance assessment commands). Exceptions where an existing ArcKit functional category fits better:

| Command | Category |
|---|---|
| `fr-marche-public` | Procurement |
| `fr-code-reuse` | Detailed Design |
| `fr-anssi-carto` | Detailed Design |
| `fr-ebios` | Risk & Justification |
| `fr-dr` | Risk & Justification |
| `fr-dinum` | Strategic Context |
| (all 12 others) | Quality & Compliance |

### Filter bar

Independent from the main table's filter bar — each table's controls only affect that table:

```html
<div class="app-filter-controls">
  <div>
    <label for="community-jurisdiction-filter">Jurisdiction:</label>
    <select id="community-jurisdiction-filter">
      <option value="all">All jurisdictions</option>
      <option value="eu">EU</option>
      <option value="france">France</option>
    </select>
  </div>
  <div>
    <label for="community-search-filter">Search:</label>
    <input type="text" id="community-search-filter" placeholder="Search community commands…">
  </div>
  <div class="app-command-count">
    Showing <span id="community-visible-count">18</span> of 18 commands
  </div>
</div>
```

### JavaScript

Duplicate the existing `filterTable()` function as `filterCommunityTable()` targeting `#community-table`, `#community-jurisdiction-filter`, `#community-search-filter`, `#community-visible-count`. Reasons for duplication over generalisation:

1. The existing function is 25 lines of hard-coded element IDs; retrofitting it to be table-agnostic risks breaking the one well-tested behaviour on this page.
2. The two filter schemas differ genuinely (status+category vs. jurisdiction), so a shared function would branch on table ID anyway — no real reuse.

Sort handler: an additional `querySelectorAll('#community-table th[data-sort-col]')` block mirrors the existing main-table sort wiring. The initial `filterTable()` call on DOMContentLoaded gains a sibling `filterCommunityTable()` call.

### Trade-off: duplicated filter code

Accepted as a deliberate trade-off — the two tables will diverge further over time (a future German, Dutch, etc. contribution would extend the community table's jurisdictional dropdown, not the main table's category dropdown), so the code paths are not really converging. If a third filterable table is ever added to the page, extract at that point, not now.

## Testing

- Render `commands.html` locally, visually confirm the community table appears below the main one with 18 rows, neutral-grey badges, contributor links, Jurisdiction column populated (7 EU + 11 France).
- Typing `DORA` in the main search empties the main table but leaves the community table showing all 18. Typing `DORA` in the community search filters to `/arckit.eu-dora` without touching the main table.
- Jurisdiction dropdown: `EU` shows 7, `France` shows 11, `All` shows 18. Visible-count updates.
- Clicking a community column header sorts that table only; main table sort state is unchanged.
- `grep -c '<tr data-jurisdiction' commands.html` returns 18.
- Every `<code>/arckit.xxx</code>` in the community table corresponds to a real file in `arckit-claude/commands/`. Contributor link resolves to `https://github.com/thomas-jardinet`.
- `<label for="…">` bindings correct; `<h2>` precedes the table and serves as caption; new `data-sort-col` attributes follow the existing pattern.

## Files Touched

- `docs/commands.html` — single-file change (HTML section, CSS rule, JS function + sort/init wiring)

## Follow-ups (out of scope for this spec)

- `docs/index.html` — mention the community set in the platform summary
- `docs/llms.txt` — add an entry pointing at the community section anchor
- `docs/DEPENDENCY-MATRIX.md` — add dependency rows for the 18 community commands
- `docs/commands.html` Dependency Matrix grid — extend to cover community commands
