# Pages Sidebar Version Display — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show document version badges in the pages sidebar, with an inline dropdown selector when multiple versions of the same document exist.

**Architecture:** Pure frontend change to `pages-template.html`. Extract version from `documentId` already in manifest, group documents by base ID, render static badge (single version) or inline `<select>` (multiple versions). No manifest schema or hook changes.

**Tech Stack:** Vanilla JS, CSS — all inline in the single-page HTML template.

**Spec:** `docs/superpowers/specs/2026-04-06-pages-version-display-design.md`

---

### Task 1: Add CSS for version badge and version select

**Files:**
- Modify: `arckit-claude/templates/pages-template.html:351-356` (insert after `.app-nav-file-type` block)

- [ ] **Step 1: Add the two new CSS classes**

Insert immediately after the `.app-nav-file-type` closing brace (after line 356):

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

- [ ] **Step 2: Verify no CSS syntax errors**

Open the HTML file and confirm the CSS is well-formed by searching for the new class names:

```bash
grep -n 'app-nav-version' arckit-claude/templates/pages-template.html
```

Expected: two class definitions (`.app-nav-version` and `.app-nav-version-select`), no other hits yet.

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "style: add CSS for sidebar version badge and dropdown"
```

---

### Task 2: Add JS helper functions for version extraction and document grouping

**Files:**
- Modify: `arckit-claude/templates/pages-template.html` (insert before `buildNavSection` function, around line 3710)

- [ ] **Step 1: Add the three helper functions**

Insert immediately before the `function buildNavSection` line (line 3711):

```js
        // ── Version display helpers ──

        function extractVersion(documentId) {
            if (!documentId) return null;
            const m = documentId.match(/-v(\d+\.\d+)$/);
            return m ? m[1] : null;
        }

        function baseDocId(documentId) {
            return documentId ? documentId.replace(/-v\d+(\.\d+)?$/, '') : null;
        }

        function renderVersionedDocList(docs) {
            // Group by base document ID
            const groups = {};
            const order = [];
            docs.forEach(doc => {
                const key = baseDocId(doc.documentId) || doc.path;
                if (!groups[key]) {
                    groups[key] = [];
                    order.push(key);
                }
                groups[key].push(doc);
            });

            // Sort each group by version ascending (highest last = default)
            Object.values(groups).forEach(group => {
                group.sort((a, b) => {
                    const va = extractVersion(a.documentId) || '0';
                    const vb = extractVersion(b.documentId) || '0';
                    return va.localeCompare(vb, undefined, { numeric: true });
                });
            });

            let html = '';
            order.forEach(key => {
                const group = groups[key];
                const latest = group[group.length - 1]; // highest version

                if (group.length === 1) {
                    // Single version: static badge
                    const ver = extractVersion(latest.documentId);
                    const badge = ver ? ` <span class="app-nav-version">v${ver}</span>` : '';
                    html += `<li><a href="#${latest.path}" data-path="${latest.path}">${latest.title}${badge}</a></li>`;
                } else {
                    // Multiple versions: inline select
                    let options = '';
                    group.forEach(doc => {
                        const ver = extractVersion(doc.documentId) || '?';
                        const sel = doc === latest ? ' selected' : '';
                        options += `<option value="${doc.path}"${sel}>v${ver}</option>`;
                    });
                    html += `<li><a href="#${latest.path}" data-path="${latest.path}" class="app-nav-versioned">${latest.title} <select class="app-nav-version-select">${options}</select></a></li>`;
                }
            });

            return html;
        }

```

- [ ] **Step 2: Verify the functions are syntactically correct**

```bash
grep -n 'function extractVersion\|function baseDocId\|function renderVersionedDocList' arckit-claude/templates/pages-template.html
```

Expected: three lines showing the three new function definitions.

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: add version extraction and grouped doc rendering helpers"
```

---

### Task 3: Update `buildNavSection` to use versioned rendering

**Files:**
- Modify: `arckit-claude/templates/pages-template.html:3711-3739` (`buildNavSection` function)

The current function groups docs by category and renders each as a plain `doc.title` link. Replace the inner rendering loop to use `renderVersionedDocList`.

- [ ] **Step 1: Replace `buildNavSection` body**

Replace the entire `buildNavSection` function (the version at the line numbers after Task 2's insertion — find it by searching for `function buildNavSection`) with:

```js
        function buildNavSection(title, documents, sectionId) {
            if (!documents || documents.length === 0) return '';

            // Group by category
            const byCategory = {};
            documents.forEach(doc => {
                const cat = doc.category || 'Other';
                if (!byCategory[cat]) byCategory[cat] = [];
                byCategory[cat].push(doc);
            });

            let listHtml = '';
            Object.keys(byCategory).forEach(category => {
                listHtml += `<li class="app-nav-category">${category}</li>`;
                listHtml += renderVersionedDocList(byCategory[category]);
            });

            return `
                <div class="app-nav-section">
                    <button class="app-nav-section-header">
                        ${title}
                        <span class="chevron">&#9660;</span>
                    </button>
                    <ul class="app-nav-list">${listHtml}</ul>
                </div>
            `;
        }
```

The only change from the original is replacing the inner `forEach` loop with `renderVersionedDocList(byCategory[category])`.

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: use versioned rendering in buildNavSection"
```

---

### Task 4: Update `buildProjectNav` to use versioned rendering

**Files:**
- Modify: `arckit-claude/templates/pages-template.html` (`buildProjectNav` function, the version at current line numbers after prior insertions — search for `function buildProjectNav`)

The current function has ~12 blocks each rendering a flat list of docs with `doc.title`. Replace each doc rendering loop with `renderVersionedDocList`.

- [ ] **Step 1: Replace `buildProjectNav` body**

Replace the entire `buildProjectNav` function with:

```js
        function buildProjectNav(project) {
            let listHtml = '';

            // Main documents by category
            if (project.documents) {
                const byCategory = {};
                project.documents.forEach(doc => {
                    const cat = doc.category || 'Other';
                    if (!byCategory[cat]) byCategory[cat] = [];
                    byCategory[cat].push(doc);
                });

                Object.keys(byCategory).forEach(category => {
                    listHtml += `<li class="app-nav-category">${category}</li>`;
                    listHtml += renderVersionedDocList(byCategory[category]);
                });
            }

            // Diagrams
            if (project.diagrams && project.diagrams.length > 0) {
                listHtml += `<li class="app-nav-category">Diagrams</li>`;
                listHtml += renderVersionedDocList(project.diagrams);
            }

            // Decisions (ADRs)
            if (project.decisions && project.decisions.length > 0) {
                listHtml += `<li class="app-nav-category">Decisions</li>`;
                listHtml += renderVersionedDocList(project.decisions);
            }

            // Wardley Maps
            if (project.wardleyMaps && project.wardleyMaps.length > 0) {
                listHtml += `<li class="app-nav-category">Wardley Maps</li>`;
                listHtml += renderVersionedDocList(project.wardleyMaps);
            }

            // Data Contracts
            if (project.dataContracts && project.dataContracts.length > 0) {
                listHtml += `<li class="app-nav-category">Data Contracts</li>`;
                listHtml += renderVersionedDocList(project.dataContracts);
            }

            // Research
            if (project.research && project.research.length > 0) {
                listHtml += `<li class="app-nav-category">Research</li>`;
                listHtml += renderVersionedDocList(project.research);
            }

            // Reviews
            if (project.reviews && project.reviews.length > 0) {
                listHtml += `<li class="app-nav-category">Reviews</li>`;
                listHtml += renderVersionedDocList(project.reviews);
            }

            // Vendors
            if (project.vendors && project.vendors.length > 0) {
                listHtml += `<li class="app-nav-category">Vendors</li>`;
                project.vendors.forEach(vendor => {
                    if (vendor.documents) {
                        vendor.documents.forEach(doc => {
                            const ver = extractVersion(doc.documentId);
                            const badge = ver ? ` <span class="app-nav-version">v${ver}</span>` : '';
                            listHtml += `<li><a href="#${doc.path}" data-path="${doc.path}">${vendor.name}: ${doc.title}${badge}</a></li>`;
                        });
                    }
                });
            }

            // Vendor Profiles
            if (project.vendorProfiles && project.vendorProfiles.length > 0) {
                listHtml += `<li class="app-nav-category">Vendor Profiles</li>`;
                listHtml += renderVersionedDocList(project.vendorProfiles);
            }

            // Tech Notes
            if (project.techNotes && project.techNotes.length > 0) {
                listHtml += `<li class="app-nav-category">Tech Notes</li>`;
                listHtml += renderVersionedDocList(project.techNotes);
            }

            // External Documents (mention only - not clickable)
            if (project.external && project.external.length > 0) {
                listHtml += `<li class="app-nav-category">External Documents</li>`;
                project.external.forEach(doc => {
                    listHtml += `<li class="app-nav-external">${doc.title} <span class="app-nav-file-type">${doc.type || ''}</span></li>`;
                });
            }

            const displayName = project.name || project.id;
            return `
                <div class="app-nav-section">
                    <button class="app-nav-section-header">
                        ${displayName}
                        <span class="chevron">&#9660;</span>
                    </button>
                    <ul class="app-nav-list">${listHtml}</ul>
                </div>
            `;
        }
```

Key changes from original:
- Each `forEach(doc => ...)` rendering loop replaced with `renderVersionedDocList(array)`
- **Vendors** keep their special `vendor.name: doc.title` format but add a version badge (no grouping — vendor docs have unique names)
- **External Documents** unchanged (no `documentId`, not clickable)

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: use versioned rendering in buildProjectNav"
```

---

### Task 5: Add version select interaction handlers

**Files:**
- Modify: `arckit-claude/templates/pages-template.html` — inside `buildNavigation` function, after the existing click handler block (around the line that adds `a[data-path]` click handlers)

- [ ] **Step 1: Add select change handler and stopPropagation**

Find the closing of the `a[data-path]` click handler block in `buildNavigation` (the line `});` after `closeMobileSidebar();`). Insert immediately after that block (after the `});` that closes `container.querySelectorAll('a[data-path]').forEach`):

```js
            // Add change handlers for version selects
            container.querySelectorAll('.app-nav-version-select').forEach(select => {
                // Prevent select clicks from triggering the parent link
                select.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                });

                select.addEventListener('change', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const newPath = select.value;
                    const link = select.closest('a');
                    if (link) {
                        link.href = '#' + newPath;
                        link.dataset.path = newPath;
                    }
                    window.location.hash = newPath;
                    loadDocument(newPath);

                    // Update active state
                    container.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    if (link) link.classList.add('active');

                    closeMobileSidebar();
                });
            });
```

- [ ] **Step 2: Add hash-based version select sync**

Find the initial hash handling block near line 4564 (`const link = document.querySelector(\`a[data-path="${path}"]\`);`). This handles marking the correct sidebar link as active on initial page load. Replace that `if (link)` block with logic that also syncs version selects:

Find:
```js
                        // Mark as active
                        const link = document.querySelector(`a[data-path="${path}"]`);
                        if (link) link.classList.add('active');
```

Replace with:
```js
                        // Mark as active — check both direct links and version selects
                        let link = document.querySelector(`a[data-path="${path}"]`);
                        if (!link) {
                            // Path might be a non-default version — find its select option
                            const option = document.querySelector(`.app-nav-version-select option[value="${path}"]`);
                            if (option) {
                                option.selected = true;
                                const select = option.closest('select');
                                const parentLink = select ? select.closest('a') : null;
                                if (parentLink) {
                                    parentLink.href = '#' + path;
                                    parentLink.dataset.path = path;
                                    link = parentLink;
                                }
                            }
                        }
                        if (link) link.classList.add('active');
```

This handles the case where a user navigates directly to a non-latest version via URL hash (e.g., `#.../ARC-001-DATA-v1.0.md` when v2.0 is the default). The select dropdown syncs to show v1.0, and the link is updated to match.

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "feat: add version select interaction and hash sync"
```

---

### Task 6: Verify with markdownlint and visual check

**Files:**
- Read: `arckit-claude/templates/pages-template.html` (final verification)

- [ ] **Step 1: Run markdownlint to check for any issues in the HTML file**

```bash
npx markdownlint-cli2 "arckit-claude/templates/pages-template.html" 2>&1 || true
```

Expected: no errors (HTML files are typically not linted by markdownlint, but confirm no unexpected issues).

- [ ] **Step 2: Grep to confirm all changes are in place**

```bash
grep -c 'app-nav-version' arckit-claude/templates/pages-template.html
```

Expected: multiple hits — CSS classes (2 definitions), JS references in `renderVersionedDocList`, vendor badge in `buildProjectNav`, and select handlers.

```bash
grep -c 'renderVersionedDocList' arckit-claude/templates/pages-template.html
```

Expected: 10+ hits — 1 function definition, calls in `buildNavSection` (1), calls in `buildProjectNav` (8: diagrams, decisions, wardleyMaps, dataContracts, research, reviews, vendorProfiles, techNotes), plus the category loop calls.

- [ ] **Step 3: Final commit if any fixups were needed**

```bash
git add arckit-claude/templates/pages-template.html
git commit -m "fix: address any review issues from version display"
```

Only if changes were made in this step.
