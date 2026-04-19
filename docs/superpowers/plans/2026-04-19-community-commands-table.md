# Community Commands Table on `commands.html` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second, visually distinct table to `docs/commands.html` that lists the 18 community-contributed EU/FR commands with its own independent filter bar, below the official table and above the Dependency Matrix.

**Architecture:** Single-file change to `docs/commands.html`. A new CSS rule, one HTML section (heading + banner + filter bar + 18-row table), and a duplicated JS filter function `filterCommunityTable()` scoped to a second table id `#community-table`. The existing official-table behaviour (`filterTable()`, `sortTable()`, existing DOM IDs) is left untouched. No other files are modified; no converter run is needed.

**Tech Stack:** Static HTML, GOV.UK Frontend CSS classes already present in the file, vanilla JS (no framework).

**Design Spec:** `docs/superpowers/specs/2026-04-19-community-commands-table-design.md`

---

## File Structure

Only one file is touched:

- **Modify:** `docs/commands.html`
  - Add CSS rule for `.app-status-community` (one line, after line 246)
  - Append one sentence to the lead paragraph at line 516
  - Insert a new `<section>`-equivalent block between line 1379 and line 1382 (between the closing `</div>` of `id="commands"` and the Command Dependencies comment)
  - Append a new `filterCommunityTable()` function, a new sort handler block, and a second filter/sort init call inside the existing `<script>` block (before its closing tag around line 4368)

There is no automated test suite for this static HTML file. Verification in each task is done via `grep`, `wc -l`, `node --check`, and (at the end) a local browser render.

---

## Task 1: Scaffold the community section (CSS + empty skeleton)

**Purpose:** Add the CSS rule, lead-paragraph sentence, and the HTML skeleton — heading, banner, filter bar, empty `<tbody>` — so the structural bones land as a coherent commit. Rows come in Task 2; JS in Task 3.

**Files:**
- Modify: `docs/commands.html`

- [ ] **Step 1: Add the CSS rule for the Community badge**

Use the Edit tool to insert a new CSS line after the existing `.app-status-experimental` line (around line 246):

Find:
```
        .app-status-experimental { background: #912b88; color: white; }
```
Replace with:
```
        .app-status-experimental { background: #912b88; color: white; }
        .app-status-community { background: #f3f2f1; color: #383f43; border: 1px solid #b1b4b6; }
```

- [ ] **Step 2: Verify CSS rule inserted**

Run: `grep -n "app-status-community" /workspaces/arc-kit/docs/commands.html`

Expected: one hit around line 247:
```
247:        .app-status-community { background: #f3f2f1; color: #383f43; border: 1px solid #b1b4b6; }
```

- [ ] **Step 3: Append a sentence to the lead paragraph under the main `<h2>`**

Use the Edit tool at line 516:

Find:
```
        <p class="govuk-body">Complete command reference with descriptions, example outputs, and maturity status:</p>
```
Replace with:
```
        <p class="govuk-body">Complete command reference with descriptions, example outputs, and maturity status. An additional 18 community-contributed commands appear in <a href="#community-commands" class="govuk-link">their own section below</a>.</p>
```

- [ ] **Step 4: Insert the community section skeleton**

Use the Edit tool to insert the new section between line 1379 (closing `</div>` of `id="commands"`) and line 1382 (`<!-- Command Dependencies Section -->`).

Find (exact context — the inset-text `</div>` followed by the outer `</div>` and the blank lines before the Dependencies comment):
```
        </div>
    </div>


    <!-- Command Dependencies Section -->
```
Replace with:
```
        </div>
    </div>


    <!-- Community Commands Section -->
    <div class="govuk-width-container govuk-!-margin-top-9" id="community-commands">
        <h2 class="govuk-heading-l">18 Community Commands</h2>
        <div class="govuk-inset-text">
            <strong>Community-contributed.</strong> These 18 commands extend ArcKit into EU and French regulatory territory. They were contributed by <a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a> and follow the same template-driven patterns as the official commands. They are <strong>not yet regression-tested</strong> across ArcKit's reference repositories, so output quality may lag the official set as underlying regulations and ArcKit schemas evolve. Issues welcome.
        </div>

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
                <input type="text" id="community-search-filter" placeholder="Search community commands&hellip;">
            </div>
            <div class="app-command-count">
                Showing <span id="community-visible-count">18</span> of 18 commands
            </div>
        </div>

        <div class="app-command-table-container">
            <table class="app-command-table" id="community-table">
                <thead>
                    <tr>
                        <th data-sort="asc" data-sort-col="0">Command <span class="sort-indicator">&#8597;</span></th>
                        <th data-sort-col="1">Description <span class="sort-indicator">&#8597;</span></th>
                        <th data-sort-col="2">Category <span class="sort-indicator">&#8597;</span></th>
                        <th data-sort-col="3">Jurisdiction <span class="sort-indicator">&#8597;</span></th>
                        <th>Contributor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>


    <!-- Command Dependencies Section -->
```

- [ ] **Step 5: Verify skeleton HTML inserted**

Run: `grep -cE 'id="community-commands"|id="community-table"|id="community-jurisdiction-filter"|id="community-search-filter"|id="community-visible-count"' /workspaces/arc-kit/docs/commands.html`

Expected: `5` (each id appears exactly once)

Run: `grep -n "18 Community Commands\|thomas-jardinet" /workspaces/arc-kit/docs/commands.html`

Expected: two hits — heading and banner link.

- [ ] **Step 6: Commit**

```bash
cd /workspaces/arc-kit
git add docs/commands.html
git commit -m "$(cat <<'EOF'
docs(commands): scaffold community commands section skeleton

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Populate the community table with 18 rows

**Purpose:** Fill the empty `<tbody>` with one `<tr>` per community command. Rows are ordered alphabetically by command name (same order as `ls` of `arckit-claude/commands/{eu-,fr-}*.md`).

**Files:**
- Modify: `docs/commands.html`

**Row data** (authoritative mapping from spec + extracted descriptions; already has `[COMMUNITY] ` prefixes stripped):

| # | Command | Category key | Category label | Jurisdiction key | Jurisdiction label |
|---|---|---|---|---|---|
| 1 | `eu-ai-act` | `quality-compliance` | Quality &amp; Compliance | `eu` | EU |
| 2 | `eu-cra` | `quality-compliance` | Quality &amp; Compliance | `eu` | EU |
| 3 | `eu-data-act` | `quality-compliance` | Quality &amp; Compliance | `eu` | EU |
| 4 | `eu-dora` | `quality-compliance` | Quality &amp; Compliance | `eu` | EU |
| 5 | `eu-dsa` | `quality-compliance` | Quality &amp; Compliance | `eu` | EU |
| 6 | `eu-nis2` | `quality-compliance` | Quality &amp; Compliance | `eu` | EU |
| 7 | `eu-rgpd` | `quality-compliance` | Quality &amp; Compliance | `eu` | EU |
| 8 | `fr-algorithme-public` | `quality-compliance` | Quality &amp; Compliance | `france` | France |
| 9 | `fr-anssi` | `quality-compliance` | Quality &amp; Compliance | `france` | France |
| 10 | `fr-anssi-carto` | `detailed-design` | Detailed Design | `france` | France |
| 11 | `fr-code-reuse` | `detailed-design` | Detailed Design | `france` | France |
| 12 | `fr-dinum` | `strategic-context` | Strategic Context | `france` | France |
| 13 | `fr-dr` | `risk-justification` | Risk &amp; Justification | `france` | France |
| 14 | `fr-ebios` | `risk-justification` | Risk &amp; Justification | `france` | France |
| 15 | `fr-marche-public` | `procurement` | Procurement | `france` | France |
| 16 | `fr-pssi` | `quality-compliance` | Quality &amp; Compliance | `france` | France |
| 17 | `fr-rgpd` | `quality-compliance` | Quality &amp; Compliance | `france` | France |
| 18 | `fr-secnumcloud` | `quality-compliance` | Quality &amp; Compliance | `france` | France |

**Note on ordering:** alphabetical sort puts `fr-anssi` (row 9) before `fr-anssi-carto` (row 10), matching `ls` output. Keep this order literally.

- [ ] **Step 1: Insert all 18 rows into the empty `<tbody>`**

Use the Edit tool. Find (the empty tbody created in Task 1):

```
                <tbody>
                </tbody>
            </table>
        </div>
    </div>


    <!-- Command Dependencies Section -->
```

Replace with:

```
                <tbody>
                    <tr data-jurisdiction="eu" data-category="quality-compliance">
                        <td><code>/arckit.eu-ai-act</code></td>
                        <td class="description">Assess EU AI Act (Regulation 2024/1689) compliance obligations, risk classification, and conformity requirements for AI systems</td>
                        <td>Quality &amp; Compliance</td>
                        <td>EU</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="eu" data-category="quality-compliance">
                        <td><code>/arckit.eu-cra</code></td>
                        <td class="description">Assess EU Cyber Resilience Act (CRA, Regulation 2024/2847) compliance obligations for products with digital elements placed on the EU market</td>
                        <td>Quality &amp; Compliance</td>
                        <td>EU</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="eu" data-category="quality-compliance">
                        <td><code>/arckit.eu-data-act</code></td>
                        <td class="description">Assess EU Data Act (Regulation 2023/2854) compliance for connected products, data holders, and data processing service providers</td>
                        <td>Quality &amp; Compliance</td>
                        <td>EU</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="eu" data-category="quality-compliance">
                        <td><code>/arckit.eu-dora</code></td>
                        <td class="description">Assess DORA (Digital Operational Resilience Act, EU 2022/2554) compliance for financial sector entities operating in the EU</td>
                        <td>Quality &amp; Compliance</td>
                        <td>EU</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="eu" data-category="quality-compliance">
                        <td><code>/arckit.eu-dsa</code></td>
                        <td class="description">Assess EU Digital Services Act (DSA, Regulation 2022/2065) compliance obligations for online intermediary services, platforms, and very large online platforms</td>
                        <td>Quality &amp; Compliance</td>
                        <td>EU</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="eu" data-category="quality-compliance">
                        <td><code>/arckit.eu-nis2</code></td>
                        <td class="description">Assess NIS2 Directive compliance obligations for EU member state operators of essential services and important entities</td>
                        <td>Quality &amp; Compliance</td>
                        <td>EU</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="eu" data-category="quality-compliance">
                        <td><code>/arckit.eu-rgpd</code></td>
                        <td class="description">Generate GDPR (EU 2016/679) compliance assessment for EU/EEA data processing &mdash; legal basis mapping, data subject rights, transfers, DPIA screening, and breach notification across all member states</td>
                        <td>Quality &amp; Compliance</td>
                        <td>EU</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="quality-compliance">
                        <td><code>/arckit.fr-algorithme-public</code></td>
                        <td class="description">Generate a public algorithm transparency notice complying with Article L311-3-1 CRPA (Loi R&eacute;publique Num&eacute;rique) for French public administration algorithmic decisions</td>
                        <td>Quality &amp; Compliance</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="quality-compliance">
                        <td><code>/arckit.fr-anssi</code></td>
                        <td class="description">Assess compliance with ANSSI security recommendations &mdash; Guide d'hygi&egrave;ne informatique (42 measures) and cloud security recommendations</td>
                        <td>Quality &amp; Compliance</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="detailed-design">
                        <td><code>/arckit.fr-anssi-carto</code></td>
                        <td class="description">Produce an ANSSI-methodology information system cartography across four reading levels &mdash; business, application, system, and network</td>
                        <td>Detailed Design</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="detailed-design">
                        <td><code>/arckit.fr-code-reuse</code></td>
                        <td class="description">Assess public code reuse opportunities before building from scratch &mdash; search code.gouv.fr, the SILL, and European public code repositories; produce a build-vs-reuse decision matrix</td>
                        <td>Detailed Design</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="strategic-context">
                        <td><code>/arckit.fr-dinum</code></td>
                        <td class="description">Assess compliance with French digital administration standards &mdash; RGI, RGAA, RGESN, RGS, and DINUM doctrine cloud de l'&Eacute;tat</td>
                        <td>Strategic Context</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="risk-justification">
                        <td><code>/arckit.fr-dr</code></td>
                        <td class="description">Assess Diffusion Restreinte (DR) handling compliance &mdash; marking, storage, transmission, and destruction rules for French administrative sensitive information</td>
                        <td>Risk &amp; Justification</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="risk-justification">
                        <td><code>/arckit.fr-ebios</code></td>
                        <td class="description">Conduct an EBIOS Risk Manager risk analysis study following the ANSSI methodology &mdash; five workshops from study framing to risk treatment and homologation recommendation</td>
                        <td>Risk &amp; Justification</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="procurement">
                        <td><code>/arckit.fr-marche-public</code></td>
                        <td class="description">Generate French public procurement documentation aligned with code de la commande publique, UGAP catalogue, and DINUM digital standards</td>
                        <td>Procurement</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="quality-compliance">
                        <td><code>/arckit.fr-pssi</code></td>
                        <td class="description">Generate an Information System Security Policy (PSSI) for French public or private organisations &mdash; security objectives, principles, organisational structure, and applicable ANSSI/RGS standards</td>
                        <td>Quality &amp; Compliance</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="quality-compliance">
                        <td><code>/arckit.fr-rgpd</code></td>
                        <td class="description">Assess CNIL-specific GDPR obligations for French deployments &mdash; cookies, health data (HDS), minors, d&eacute;lib&eacute;rations CNIL, and French enforcement patterns</td>
                        <td>Quality &amp; Compliance</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                    <tr data-jurisdiction="france" data-category="quality-compliance">
                        <td><code>/arckit.fr-secnumcloud</code></td>
                        <td class="description">Assess SecNumCloud 3.2 qualification compliance for French sovereign cloud procurement and OIV/OSE obligations</td>
                        <td>Quality &amp; Compliance</td>
                        <td>France</td>
                        <td><a href="https://github.com/thomas-jardinet" class="govuk-link">@thomas-jardinet</a></td>
                        <td><span class="app-status-tag app-status-community">Community</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <!-- Command Dependencies Section -->
```

- [ ] **Step 2: Verify row count**

Run: `grep -c 'data-jurisdiction=' /workspaces/arc-kit/docs/commands.html`

Expected: `18`

- [ ] **Step 3: Verify jurisdiction split**

Run: `grep -c 'data-jurisdiction="eu"' /workspaces/arc-kit/docs/commands.html && grep -c 'data-jurisdiction="france"' /workspaces/arc-kit/docs/commands.html`

Expected:
```
7
11
```

- [ ] **Step 4: Verify every community command has a row and every row matches a real file**

Run:
```bash
ls /workspaces/arc-kit/arckit-claude/commands/ | grep -E '^(eu-|fr-)' | sed 's/\.md$//' | sort > /tmp/community_expected.txt
grep -oE '/arckit\.(eu-|fr-)[a-z-]+' /workspaces/arc-kit/docs/commands.html | sed 's|/arckit\.||' | sort -u > /tmp/community_html.txt
diff /tmp/community_expected.txt /tmp/community_html.txt
```

Expected: no output (empty diff). If anything prints, the row set is wrong — stop and fix.

- [ ] **Step 5: Verify every row has a contributor link**

Run: `grep -c 'github.com/thomas-jardinet' /workspaces/arc-kit/docs/commands.html`

Expected: `19` (1 banner + 18 row links)

- [ ] **Step 6: Verify every row has a Community badge**

Run: `grep -c 'app-status-community' /workspaces/arc-kit/docs/commands.html`

Expected: `19` (1 CSS rule + 18 badge instances)

- [ ] **Step 7: Commit**

```bash
cd /workspaces/arc-kit
git add docs/commands.html
git commit -m "$(cat <<'EOF'
docs(commands): populate community table with 18 EU/FR commands

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Add filter, sort, and init JavaScript for the community table

**Purpose:** Wire up the jurisdiction dropdown, search input, visible-count, and per-column sort so the community table behaves like the main one but independently.

**Files:**
- Modify: `docs/commands.html`

- [ ] **Step 1: Add `filterCommunityTable()` function**

Use the Edit tool. Find the end of the existing `filterTable()` function and insert the new function immediately after it.

Find:
```
            document.getElementById('visible-count').textContent = visibleCount;
        }

        // Sort table by column
```
Replace with:
```
            document.getElementById('visible-count').textContent = visibleCount;
        }

        // Filter community table based on selected filters
        function filterCommunityTable() {
            const jurisdictionFilter = document.getElementById('community-jurisdiction-filter').value;
            const searchFilter = document.getElementById('community-search-filter').value.toLowerCase();
            const table = document.getElementById('community-table');
            const rows = table.querySelectorAll('tbody tr');
            let visibleCount = 0;

            rows.forEach(row => {
                const jurisdiction = row.getAttribute('data-jurisdiction');
                const text = row.textContent.toLowerCase();

                const jurisdictionMatch = jurisdictionFilter === 'all' || jurisdiction === jurisdictionFilter;
                const searchMatch = searchFilter === '' || text.includes(searchFilter);

                if (jurisdictionMatch && searchMatch) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            document.getElementById('community-visible-count').textContent = visibleCount;
        }

        // Sort table by column
```

- [ ] **Step 2: Add parallel `sortCommunityTable()` function**

The existing `sortTable(columnIndex)` hard-codes `document.getElementById('command-table')` and has a Status column at index 4. Rather than parameterise it (risking regressions on the one well-tested flow), add a parallel function with the community-table DOM id and a simpler sort body (no special-case Status maturity order — the community Status column is uniform, so alphabetical sort suffices).

Find (the closing brace of `sortTable()` and the start of the init block):
```
            // Re-append sorted rows
            rows.forEach(row => tbody.appendChild(row));
        }

        // Initialize table and bind event listeners
```
Replace with:
```
            // Re-append sorted rows
            rows.forEach(row => tbody.appendChild(row));
        }

        // Sort community table by column
        function sortCommunityTable(columnIndex) {
            const table = document.getElementById('community-table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const header = table.querySelectorAll('th')[columnIndex];
            const isAscending = header.getAttribute('data-sort') !== 'asc';

            // Update sort indicators
            table.querySelectorAll('th').forEach(th => {
                th.classList.remove('sorted');
                th.setAttribute('data-sort', '');
            });
            header.classList.add('sorted');
            header.setAttribute('data-sort', isAscending ? 'asc' : 'desc');

            // Sort rows
            rows.sort((a, b) => {
                const aValue = a.cells[columnIndex].textContent.trim().toLowerCase();
                const bValue = b.cells[columnIndex].textContent.trim().toLowerCase();
                return isAscending
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            });

            // Re-append sorted rows
            rows.forEach(row => tbody.appendChild(row));
        }

        // Initialize table and bind event listeners
```

- [ ] **Step 3: Wire community filter/sort inside the existing DOMContentLoaded handler**

Find:
```
            document.querySelectorAll('#command-table th[data-sort-col]').forEach(function(th) {
                th.addEventListener('click', function() {
                    sortTable(parseInt(th.getAttribute('data-sort-col'), 10));
                });
            });

            filterTable();
        });
```
Replace with:
```
            document.querySelectorAll('#command-table th[data-sort-col]').forEach(function(th) {
                th.addEventListener('click', function() {
                    sortTable(parseInt(th.getAttribute('data-sort-col'), 10));
                });
            });

            document.getElementById('community-jurisdiction-filter').addEventListener('change', filterCommunityTable);
            document.getElementById('community-search-filter').addEventListener('input', filterCommunityTable);

            document.querySelectorAll('#community-table th[data-sort-col]').forEach(function(th) {
                th.addEventListener('click', function() {
                    sortCommunityTable(parseInt(th.getAttribute('data-sort-col'), 10));
                });
            });

            filterTable();
            filterCommunityTable();
        });
```

- [ ] **Step 4: Verify JS additions by ID-appearance count**

Each new element id should appear exactly 4 times in the file: `<label for="...">`, the form element's own `id="..."`, `getElementById('...')` inside the new filter function, and the `addEventListener` binding in the init block.

Run:
```bash
grep -c 'function filterCommunityTable' /workspaces/arc-kit/docs/commands.html
grep -c 'function sortCommunityTable' /workspaces/arc-kit/docs/commands.html
grep -c 'community-jurisdiction-filter' /workspaces/arc-kit/docs/commands.html
grep -c 'community-search-filter' /workspaces/arc-kit/docs/commands.html
grep -c 'community-visible-count' /workspaces/arc-kit/docs/commands.html
```

Expected:
```
1
1
4
4
2
```

(`community-visible-count` appears only twice: the `<span id>` in the skeleton and the `getElementById` inside `filterCommunityTable()`.)

- [ ] **Step 5: Verify JS is syntactically valid**

Extract the final `<script>` block (the one containing `filterTable`) to a temp file and syntax-check it with `node --check`. No execution — `--check` only parses.

Run:
```bash
python3 -c "
import re, sys
html = open('/workspaces/arc-kit/docs/commands.html').read()
blocks = re.findall(r'<script>(.*?)</script>', html, flags=re.DOTALL)
# The inline block with our filter code is the one containing filterTable
target = next(b for b in blocks if 'filterTable' in b)
open('/tmp/commands_inline.js', 'w').write(target)
print('extracted', len(target), 'bytes')
"
node --check /tmp/commands_inline.js && echo "syntax ok"
```

Expected: `extracted <N> bytes` followed by `syntax ok`. If `node --check` reports a SyntaxError, stop and fix the JS before committing.

- [ ] **Step 6: Commit**

```bash
cd /workspaces/arc-kit
git add docs/commands.html
git commit -m "$(cat <<'EOF'
docs(commands): add independent filter/sort JS for community table

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Final cross-check and visual verification

**Purpose:** Sanity-check the complete change and visually confirm in a browser before pushing.

**Files:** none (verification only)

- [ ] **Step 1: Global grep audit**

Run each of these and confirm the expected output:

```bash
cd /workspaces/arc-kit
echo "=== count rows ==="; grep -c 'data-jurisdiction=' docs/commands.html
echo "=== count EU ==="; grep -c 'data-jurisdiction="eu"' docs/commands.html
echo "=== count FR ==="; grep -c 'data-jurisdiction="france"' docs/commands.html
echo "=== community badges ==="; grep -c 'app-status-community' docs/commands.html
echo "=== contributor refs ==="; grep -c 'github.com/thomas-jardinet' docs/commands.html
echo "=== no stale 67s ==="; grep -E '(>67 AI|67 ArcKit|67 commands|of 67 commands|all 67 commands)' docs/commands.html || echo "clean"
echo "=== official table rows still present ==="; grep -c '<tr data-status=' docs/commands.html
```

Expected:
```
=== count rows ===
18
=== count EU ===
7
=== count FR ===
11
=== community badges ===
19
=== contributor refs ===
19
=== no stale 67s ===
clean
=== official table rows still present ===
68
```

The `68` on the last line is the count of `<tr data-status=…>` rows in the official table (after the previous session's fix that added the missing `/arckit.grants` row). This is not a count to edit — it's a sanity check that no official rows were accidentally removed while adding the community section.

- [ ] **Step 2: Byte-level diff summary**

Run: `git diff --stat HEAD~3 -- docs/commands.html`

Expected: a single file changed with roughly 200–260 insertions, 2 deletions (the one lead-paragraph line replaced in Task 1).

- [ ] **Step 3: Local browser render**

Start a local server in the background:
```bash
cd /workspaces/arc-kit/docs
python3 -m http.server 8765 >/tmp/httpd.log 2>&1 &
echo $! > /tmp/httpd.pid
sleep 1
echo "Open http://localhost:8765/commands.html in a browser"
```

In the browser, check:

1. The main official table (68 rows) renders unchanged with its existing filter bar.
2. Scroll down past the "Example repos" inset. A new **"18 Community Commands"** heading appears.
3. Below the heading: a grey banner with the `@thomas-jardinet` link.
4. Below the banner: a filter row with a **Jurisdiction** dropdown, a **Search** input, and "Showing 18 of 18 commands".
5. The community table shows all 18 rows with neutral grey **Community** badges.
6. Below the community table: the existing **Command Dependencies** section renders unchanged.

Test interactively:

7. Type `dora` in the **main** search input → main table shows 0 rows, community table still shows 18. Clear it.
8. Type `dora` in the **community** search input → community table shows exactly `/arckit.eu-dora` (1 row); visible-count shows "1 of 18". Main table unaffected.
9. Select `EU` in the community jurisdiction dropdown → community table shows 7 rows (all EU), visible-count "7 of 18".
10. Select `France` → 11 rows, visible-count "11 of 18".
11. Select `All jurisdictions` → back to 18.
12. Click the community table's **Command** header → rows re-sort alphabetically; main table's sort state unchanged.
13. Click the community table's **Jurisdiction** header → rows sort by EU/France.

Stop the local server:
```bash
kill $(cat /tmp/httpd.pid); rm /tmp/httpd.pid
```

If every check passes, the implementation is complete. If any check fails, go back to the relevant task and fix.

- [ ] **Step 4: Push (per user rule — needs confirmation)**

User rule recorded in project memory: "Never push to main; feature branches + PRs only." If this work was done on `main` (as in the current session's flow), stop and confirm with the user before pushing — do not push unilaterally. Otherwise push the feature branch and open a PR.

---

## Self-Review Notes

**Spec coverage:**
- Banner copy → Task 1 Step 4 ✓
- 18 rows with 6 columns → Task 2 ✓
- Category mapping table → Task 2 (every row literal) ✓
- Independent filter bar → Task 1 Step 4 + Task 3 Steps 1, 3 ✓
- Duplicated `filterCommunityTable` function → Task 3 Step 1 ✓
- Sort wiring (new `sortCommunityTable`) → Task 3 Step 2 ✓
- CSS badge rule → Task 1 Step 1 ✓
- Anchor `id="community-commands"` → Task 1 Step 4 ✓
- Placement before Dependency Matrix → Task 1 Step 4 ✓
- Lead paragraph update → Task 1 Step 3 ✓
- Testing → Task 4 ✓
- Out-of-scope items (converter, index.html, llms.txt, DEPENDENCY-MATRIX, matrix grid) — explicitly noted as follow-ups in the spec, not in any task ✓

**Consistency check:**
- Function names match spec: `filterCommunityTable` in spec and plan; `sortCommunityTable` added in plan (parallel to the spec's "duplicate filterTable" rationale, which also applies to sort).
- Element IDs consistent: `community-table`, `community-jurisdiction-filter`, `community-search-filter`, `community-visible-count`, `community-commands` used identically across HTML skeleton (Task 1), row data (Task 2, via `data-jurisdiction`), and JS (Task 3).
- `data-jurisdiction` values `eu` / `france` match between the HTML rows (Task 2) and the filter JS comparisons (Task 3).
- Verification counts are self-consistent: 18 rows ⇒ 18 jurisdiction attrs ⇒ 19 `app-status-community` hits (1 CSS + 18 badges) ⇒ 19 contributor links (1 banner + 18 rows).

**Placeholder scan:** no TBDs, no "add error handling", no "similar to Task N". Every code block is complete.
