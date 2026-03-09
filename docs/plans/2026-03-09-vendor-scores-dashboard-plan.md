# Vendor Scores Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Display vendor scoring comparison tables on the pages dashboard by reading `scores.json` during manifest generation and rendering the data in the HTML template.

**Architecture:** The sync-guides hook (`sync-guides.mjs`) already scans project `vendors/` directories. We add `scores.json` reading there, compute category averages server-side, and attach a `vendorScores` object to each project in `manifest.json`. The pages template (`pages-template.html`) reads this data and renders a comparison table + bar chart below the existing KPI cards.

**Tech Stack:** Node.js (hook), vanilla JavaScript (template), GOV.UK Design System CSS

---

### Task 1: Add missing guide metadata for new commands

**Files:**

- Modify: `arckit-claude/hooks/sync-guides.mjs:92-121`

**Step 1: Add search, score, impact to GUIDE_CATEGORIES**

In `sync-guides.mjs`, add these entries to the `GUIDE_CATEGORIES` object (line ~112-114):

```javascript
// Add after the existing 'procurement' line (112):
  'score': 'Procurement',
// Add after 'aws-research' line (113):
  'search': 'Governance', 'impact': 'Governance',
```

The full lines 111-114 should become:

```javascript
  'sow': 'Procurement', 'evaluate': 'Procurement', 'dos': 'Procurement',
  'gcloud-search': 'Procurement', 'gcloud-clarify': 'Procurement', 'procurement': 'Procurement',
  'score': 'Procurement',
  'aws-research': 'Research', 'azure-research': 'Research', 'gcp-research': 'Research',
  'search': 'Governance', 'impact': 'Governance',
  'template-builder': 'Other',
```

**Step 2: Add search, score, impact to GUIDE_STATUS**

Add `'search','score','impact'` to the `beta` status list on line 119:

```javascript
for (const name of ['dpia','research','strategy','roadmap','adr','hld-review','dld-review','backlog','servicenow','analyze','service-assessment','tcop','secure','presentation','artifact-health','design-review','procurement','knowledge-compounding','c4-layout-science','security-hooks','codes-of-practice','data-quality-framework','govs-007-security','national-data-strategy','upgrading','start','conformance','productivity','remote-control','mcp-servers','search','score','impact']) GUIDE_STATUS[name] = 'beta';
```

**Step 3: Verify the hook still runs**

Run:

```bash
node -c arckit-claude/hooks/sync-guides.mjs
```

Expected: No syntax errors

**Step 4: Commit**

```bash
git add arckit-claude/hooks/sync-guides.mjs
git commit -m "fix: add search, score, impact to guide categories and status maps"
```

---

### Task 2: Read scores.json in scanProject and attach to manifest

**Files:**

- Modify: `arckit-claude/hooks/sync-guides.mjs:348-386` (vendors section of `scanProject`)
- Modify: `arckit-claude/hooks/sync-guides.mjs:595-620` (stats counting)
- Modify: `arckit-claude/hooks/sync-guides.mjs:643-660` (stats output)

**Step 1: Add scores.json reading after the existing vendors scanning block**

After line 386 (end of vendors `if` block) and before line 388 (tech notes), insert:

```javascript
  // Vendor scores
  const scoresPath = join(projectDir, 'vendors', 'scores.json');
  if (isFile(scoresPath)) {
    try {
      const scoresRaw = readFileSync(scoresPath, 'utf8');
      const scoresData = JSON.parse(scoresRaw);
      if (scoresData.criteria && scoresData.vendors) {
        const categories = [...new Set(scoresData.criteria.map(c => c.category))];
        const vendorSummaries = [];
        for (const [slug, vendor] of Object.entries(scoresData.vendors)) {
          const categoryAverages = {};
          for (const cat of categories) {
            const catCriteria = scoresData.criteria.filter(c => c.category === cat);
            const catScores = catCriteria.map(c => {
              const s = vendor.scores.find(s => s.criterionId === c.id);
              return s ? s.score : 0;
            });
            categoryAverages[cat] = catScores.length > 0
              ? Math.round((catScores.reduce((a, b) => a + b, 0) / catScores.length) * 100) / 100
              : 0;
          }
          vendorSummaries.push({
            name: vendor.displayName || slug,
            slug,
            totalWeighted: vendor.totalWeighted || 0,
            totalRaw: vendor.totalRaw || 0,
            maxPossible: vendor.maxPossible || 0,
            categoryAverages,
          });
        }
        vendorSummaries.sort((a, b) => b.totalWeighted - a.totalWeighted);
        project.vendorScores = {
          lastUpdated: scoresData.lastUpdated || null,
          categories,
          vendors: vendorSummaries,
        };
      }
    } catch (e) {
      // Silently skip malformed scores.json
    }
  }
```

**Step 2: Add vendorScores stat counting**

After line 619 (`techNoteCount` line), add:

```javascript
  let scoredVendorCount = 0;
  for (const p of manifest.projects) {
    if (p.vendorScores) scoredVendorCount = scoredVendorCount + p.vendorScores.vendors.length;
  }
```

Note: this goes inside the existing stats section (after line 620, before line 622).

**Step 3: Add vendorScores to stats output**

After line 659 (`Tech Notes` stat), add:

```javascript
  `| Scored Vendors | ${scoredVendorCount} |`,
```

**Step 4: Verify syntax**

Run:

```bash
node -c arckit-claude/hooks/sync-guides.mjs
```

Expected: No syntax errors

**Step 5: Commit**

```bash
git add arckit-claude/hooks/sync-guides.mjs
git commit -m "feat: read scores.json and include vendor scores in manifest"
```

---

### Task 3: Add vendor scores CSS to pages-template.html

**Files:**

- Modify: `arckit-claude/templates/pages-template.html:541-780` (dashboard styles section)

**Step 1: Add CSS after existing dashboard styles**

Find the last dashboard style block (around line 780, before the `@media` queries). Add these styles before the first `@media` query:

```css
        /* Vendor Scores */
        .app-dashboard-scores-section {
            margin-bottom: 1.5rem;
        }
        .app-dashboard-scores-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.5rem;
        }
        .app-dashboard-scores-date {
            font-size: 0.8125rem;
            color: var(--text-muted, #505a5f);
        }
        .app-dashboard-score-bar {
            display: flex;
            align-items: center;
            margin-bottom: 0.375rem;
        }
        .app-dashboard-score-bar-label {
            min-width: 150px;
            font-size: 0.875rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .app-dashboard-score-bar-track {
            flex: 1;
            height: 18px;
            background: var(--surface-secondary, #f3f2f1);
            border-radius: 3px;
            margin: 0 0.5rem;
        }
        .app-dashboard-score-bar-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.3s ease;
        }
        .app-dashboard-score-bar-pct {
            min-width: 40px;
            text-align: right;
            font-size: 0.875rem;
            font-weight: bold;
        }
        .app-dashboard-score-cell {
            text-align: center;
            font-weight: bold;
            border-radius: 3px;
            padding: 2px 6px;
        }
```

**Step 2: Verify no syntax errors in template**

Open the file and confirm the CSS is properly nested within the `<style>` tag.

**Step 3: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: add vendor scores CSS to pages template"
```

---

### Task 4: Add vendor scores rendering to showDashboard function

**Files:**

- Modify: `arckit-claude/templates/pages-template.html:2465-2490` (between projects table and guide maturity)

**Step 1: Add renderVendorScores helper function**

Before the `showDashboard` function (around line 2340), add:

```javascript
        function scoreColor(score) {
            if (score >= 2.5) return '#00703c';
            if (score >= 1.5) return '#f47738';
            if (score >= 0.5) return '#f47738';
            return '#d4351c';
        }

        function renderVendorScores(manifest) {
            let html = '';
            const projects = (manifest.projects || []).filter(p => p.vendorScores);
            if (projects.length === 0) return '';

            projects.forEach(project => {
                const vs = project.vendorScores;
                const categories = vs.categories || [];
                const vendors = vs.vendors || [];
                if (vendors.length === 0) return;

                const dateStr = vs.lastUpdated
                    ? new Date(vs.lastUpdated).toLocaleDateString()
                    : '';

                // Table header
                let catHeaders = categories.map(c => `<th>${escapeHtml(c)}</th>`).join('');
                let tableRows = '';
                vendors.forEach(v => {
                    const pct = v.maxPossible > 0
                        ? Math.round((v.totalRaw / v.maxPossible) * 100)
                        : 0;
                    let catCells = categories.map(c => {
                        const avg = (v.categoryAverages && v.categoryAverages[c]) || 0;
                        return `<td><span class="app-dashboard-score-cell" style="background:${scoreColor(avg)}20;color:${scoreColor(avg)}">${avg.toFixed(1)}</span></td>`;
                    }).join('');
                    tableRows += `<tr>
                        <td>${escapeHtml(v.name)}</td>
                        <td style="font-weight:bold">${v.totalWeighted.toFixed(2)}</td>
                        <td>${v.totalRaw}/${v.maxPossible}</td>
                        ${catCells}
                    </tr>`;
                });

                // Score bars
                let bars = '';
                vendors.forEach(v => {
                    const pct = v.maxPossible > 0
                        ? Math.round((v.totalRaw / v.maxPossible) * 100)
                        : 0;
                    bars += `
                        <div class="app-dashboard-score-bar">
                            <div class="app-dashboard-score-bar-label">${escapeHtml(v.name)}</div>
                            <div class="app-dashboard-score-bar-track">
                                <div class="app-dashboard-score-bar-fill" style="width:${pct}%;background:${scoreColor(v.totalWeighted)}"></div>
                            </div>
                            <div class="app-dashboard-score-bar-pct">${pct}%</div>
                        </div>
                    `;
                });

                html += `
                    <div class="app-dashboard-panel app-dashboard-scores-section" style="margin-bottom:1.5rem;">
                        <div class="app-dashboard-scores-header">
                            <h3>Vendor Scores &mdash; ${escapeHtml(project.name)}</h3>
                            ${dateStr ? `<span class="app-dashboard-scores-date">Updated: ${dateStr}</span>` : ''}
                        </div>
                        <table class="app-dashboard-table">
                            <thead><tr><th>Vendor</th><th>Weighted</th><th>Raw</th>${catHeaders}</tr></thead>
                            <tbody>${tableRows}</tbody>
                        </table>
                        ${bars}
                    </div>
                `;
            });

            return html;
        }
```

**Step 2: Call renderVendorScores in showDashboard**

In the `showDashboard` function, after the projects table section (around line 2465, after the closing `}` of the `if (m.projectMetrics.length > 0)` block), add:

```javascript
            // Row 3.5: Vendor Scores
            html += renderVendorScores(manifest);
```

**Step 3: Verify no syntax errors**

Open in browser or check with a quick grep that all braces match.

**Step 4: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: render vendor scores comparison table on pages dashboard"
```

---

### Task 5: Update pages command summary template

**Files:**

- Modify: `arckit-claude/commands/pages.md:436-441`

**Step 1: Add Vendor Scores stat to summary template**

After the `Vendor Profiles` line in the summary template (line ~438), add:

```text
- Vendor Scores: {scored_vendor_count} scored across {scored_project_count} project(s)
```

**Step 2: Commit**

```bash
git add arckit-claude/commands/pages.md
git commit -m "feat: add vendor scores stat to pages summary template"
```

---

### Task 6: Run converter and verify

**Step 1: Run the converter to update all extension formats**

```bash
python scripts/converter.py
```

Expected: Completes without errors. The updated `pages.md` should propagate to Codex, OpenCode, Gemini, and Copilot formats.

**Step 2: Verify guide metadata propagated**

Check the generated manifest would include search/score/impact guides by confirming the guides exist:

```bash
ls docs/guides/search.md docs/guides/score.md docs/guides/impact.md
```

Expected: All three exist.

**Step 3: Run markdown lint**

```bash
npx markdownlint-cli2 "arckit-claude/commands/pages.md"
```

Expected: No errors.

**Step 4: Commit any converter output changes**

```bash
git add -A
git status
git commit -m "chore: regenerate extension formats after pages dashboard update"
```

---

### Task 7: Manual verification in v13

**Step 1: Push daily branch**

```bash
git push origin daily
```

**Step 2: In v13 codespace (pointing at daily branch)**

1. Restart Claude Code to pick up updated plugin
2. Run `/arckit.pages`
3. Open `docs/index.html` in browser
4. Verify:
   - Dashboard loads with existing KPIs
   - "Vendor Scores — Plymouth Research..." section appears below projects table
   - Table shows Streamlit with weighted score 2.55, raw 20/24
   - Category columns (Technical, Commercial, Governance, Operational, Sustainability) show averages
   - Horizontal bar shows Streamlit at 83%
   - Score cells are colour-coded (green for 3.0, amber for 2.0, orange for 1.0)
   - Summary output includes "Scored Vendors: 1"

**Step 3: Verify with no scores.json**

In a test repo without `scores.json`, run `/arckit.pages` and confirm:
- No "Vendor Scores" section appears
- No errors
- Dashboard otherwise unchanged
