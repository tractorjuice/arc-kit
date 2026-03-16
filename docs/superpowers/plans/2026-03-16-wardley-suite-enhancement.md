# Wardley Mapping Suite Enhancement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand ArcKit's Wardley Mapping from 1 command into a composable suite of 5 commands (wardley, wardley.value-chain, wardley.doctrine, wardley.gameplay, wardley.climate) backed by enriched shared reference files distilled from 3 Wardley Mapping books.

**Architecture:** Layered approach — enriched shared reference files (Layer 1) are read by focused commands (Layer 2) that produce versioned document artifacts. The existing `/arckit.wardley` orchestrates by consuming sibling artifacts when available. All commands convert to 5 AI platforms via `scripts/converter.py`.

**Tech Stack:** Markdown (commands, templates, guides, references), JavaScript/MJS (doc-types, hooks), Python (converter), Bash (generate-document-id.sh)

**Spec:** `docs/superpowers/specs/2026-03-16-wardley-suite-enhancement-design.md`

**Content Sources:**

- `research/Introduction to Wardley Mapping Doctrine.md` (~283K)
- `research/Introduction to Wardley Mapping Gameplays.md` (~484K)
- `research/Introduction to Wardley Mapping Climatic Patterns - Kindle - v1.0.1.md` (~357K)
- melodic-software/claude-code-plugins wardley-mapping skill (researched in conversation, not local)

---

## Chunk 1: Infrastructure (doc-types, shell script, hook, converter)

### Task 1: Register new document types in doc-types.mjs

**Files:**

- Modify: `arckit-claude/config/doc-types.mjs:29` (after WARD entry)
- Modify: `arckit-claude/config/doc-types.mjs:74-77` (MULTI_INSTANCE_TYPES)
- Modify: `arckit-claude/config/doc-types.mjs:82-93` (SUBDIR_MAP)

- [ ] **Step 1: Add 4 new type codes to DOC_TYPES**

In `arckit-claude/config/doc-types.mjs`, after the `'WARD'` line (line 29), add:

```javascript
  'WDOC':      { name: 'Wardley Doctrine Assessment',  category: 'Architecture' },
  'WGAM':      { name: 'Wardley Gameplay Analysis',     category: 'Architecture' },
  'WCLM':      { name: 'Wardley Climate Assessment',    category: 'Architecture' },
  'WVCH':      { name: 'Wardley Value Chain',            category: 'Architecture' },
```

- [ ] **Step 2: Add multi-instance types**

In the `MULTI_INSTANCE_TYPES` set (line 74-77), add `'WGAM', 'WCLM', 'WVCH'` (WDOC is single-instance, do NOT add it):

```javascript
export const MULTI_INSTANCE_TYPES = new Set([
  'ADR', 'DIAG', 'DFD', 'WARD', 'DMC',
  'RSCH', 'AWRS', 'AZRS', 'GCRS', 'DSCT',
  'WGAM', 'WCLM', 'WVCH',
]);
```

- [ ] **Step 3: Add subdirectory mappings**

In the `SUBDIR_MAP` object (after line 86 `'WARD': 'wardley-maps'`), add:

```javascript
  'WDOC': 'wardley-maps',
  'WGAM': 'wardley-maps',
  'WCLM': 'wardley-maps',
  'WVCH': 'wardley-maps',
```

- [ ] **Step 4: Verify the file is valid JavaScript**

Run: `node -e "import('./arckit-claude/config/doc-types.mjs').then(m => console.log(Object.keys(m.DOC_TYPES).length, 'types,', m.MULTI_INSTANCE_TYPES.size, 'multi-instance,', Object.keys(m.SUBDIR_MAP).length, 'subdirs'))"`

Expected: `51 types, 13 multi-instance, 14 subdirs` (was 47 types, 10 multi-instance, 10 subdirs)

- [ ] **Step 5: Commit**

```bash
git add arckit-claude/config/doc-types.mjs
git commit -m "feat: register WDOC, WGAM, WCLM, WVCH document types"
```

---

### Task 2: Update generate-document-id.sh

**Files:**

- Modify: `scripts/bash/generate-document-id.sh:18-19` (comment)
- Modify: `scripts/bash/generate-document-id.sh:85` (MULTI_INSTANCE_TYPES)

- [ ] **Step 1: Add new types to MULTI_INSTANCE_TYPES**

On line 85, change:

```bash
MULTI_INSTANCE_TYPES="ADR DIAG DFD WARD DMC RSCH AWRS AZRS GCRS DSCT"
```

to:

```bash
MULTI_INSTANCE_TYPES="ADR DIAG DFD WARD DMC RSCH AWRS AZRS GCRS DSCT WGAM WCLM WVCH"
```

Update the comment on lines 18-19 to include the new types:

```bash
# Multi-instance types (require --next-num for sequence numbering):
#   ADR, DIAG, DFD, WARD, DMC, RSCH, AWRS, AZRS, GCRS, DSCT, WGAM, WCLM, WVCH
```

- [ ] **Step 2: Test document ID generation**

Run:

```bash
bash scripts/bash/generate-document-id.sh 001 WDOC 1.0
bash scripts/bash/generate-document-id.sh 001 WGAM 1.0 --filename --next-num /tmp
bash scripts/bash/generate-document-id.sh 001 WVCH 1.0 --filename --next-num /tmp
bash scripts/bash/generate-document-id.sh 001 WCLM 1.0 --filename --next-num /tmp
```

Expected:

```text
ARC-001-WDOC-v1.0
ARC-001-WGAM-001-v1.0.md
ARC-001-WVCH-001-v1.0.md
ARC-001-WCLM-001-v1.0.md
```

- [ ] **Step 3: Commit**

```bash
git add scripts/bash/generate-document-id.sh
git commit -m "feat: add WGAM, WCLM, WVCH to multi-instance types"
```

---

### Task 3: Extend validate-wardley-math.mjs hook

**Files:**

- Modify: `arckit-claude/hooks/validate-wardley-math.mjs:68` (file filter)

- [ ] **Step 1: Read the current hook to find the file filter**

Read `arckit-claude/hooks/validate-wardley-math.mjs` and locate the line that filters for `-WARD-` in filenames (around line 68).

- [ ] **Step 2: Extend the filter to include `-WVCH-`**

Change the filter condition from checking only `-WARD-` to also accepting `-WVCH-`. The exact edit depends on the current code pattern — it may be a string `.includes('-WARD-')` or a regex. Add `-WVCH-` using the same pattern (e.g., `f.includes('-WARD-') || f.includes('-WVCH-')`).

- [ ] **Step 3: Verify the hook still works**

Run: `node arckit-claude/hooks/validate-wardley-math.mjs` (it should exit cleanly with no errors when run outside a project context)

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/hooks/validate-wardley-math.mjs
git commit -m "feat: extend wardley math hook to validate WVCH documents"
```

---

### Task 4: Fix pre-existing wardley.md hook bug

**Files:**

- Modify: `arckit-claude/commands/wardley.md:16` (hooks frontmatter)

- [ ] **Step 1: Fix the hook command**

On line 16 of `arckit-claude/commands/wardley.md`, change:

```yaml
          command: "python3 ${CLAUDE_PLUGIN_ROOT}/hooks/validate-wardley-math.py"
```

to:

```yaml
          command: "node ${CLAUDE_PLUGIN_ROOT}/hooks/validate-wardley-math.mjs"
```

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/commands/wardley.md
git commit -m "fix: correct wardley.md hook from python3 .py to node .mjs"
```

---

### Task 5: Fix converter regexes for dot-namespaced commands

**Files:**

- Modify: `scripts/converter.py:537` (colon-format regex)
- Modify: `scripts/converter.py:542` (dot-format regex)
- Modify: `scripts/converter.py:549` (prompts-format regex)

- [ ] **Step 1: Update all three regexes**

In `scripts/converter.py`, in the `rewrite_codex_skills()` function:

Line 537 — change `r"/arckit:(\w[\w-]*)"` to `r"/arckit:(\w[\w.-]*)"`

Line 542 — change `r"(?<=\s)/arckit\.(\w[\w-]*)"` to `r"(?<=\s)/arckit\.(\w[\w.-]*)"`

Line 549 — change `r"/prompts:arckit\.(\w[\w-]*)"` to `r"/prompts:arckit\.(\w[\w.-]*)"`

- [ ] **Step 2: Verify the converter runs without errors**

Run: `python scripts/converter.py`

Expected: Converter completes successfully, no Python errors. Check that the output log shows the expected number of generated files.

- [ ] **Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "fix: update converter regexes to handle dot-namespaced commands"
```

---

## Chunk 2: Reference File Enhancements

Each reference file is an independent task that can be parallelized. All files are in `arckit-claude/skills/wardley-mapping/references/`.

**Critical instruction for all reference file tasks**: Read the corresponding research book AND the existing reference file. Produce a distilled summary — NOT verbatim book content. Preserve any existing structure that works well (e.g., YAML blocks, assessment templates). The enhanced file must be self-contained and usable as a context reference for AI commands.

### Task 6: Enhance doctrine.md (120 → ~400 lines)

**Files:**

- Modify: `arckit-claude/skills/wardley-mapping/references/doctrine.md`

**Source material**: Read `research/Introduction to Wardley Mapping Doctrine.md`

- [ ] **Step 1: Read existing file and source book**

Read `arckit-claude/skills/wardley-mapping/references/doctrine.md` (current 120 lines).
Read `research/Introduction to Wardley Mapping Doctrine.md` (full book — focus on the phase tables, category details, and implementation journeys).

- [ ] **Step 2: Rewrite doctrine.md with enhanced content**

Preserve the existing YAML assessment template and 1-5 scoring structure. Add:

1. **Strategy Cycle** section — Purpose → Landscape → Climate → Doctrine → Leadership (from book intro)
2. **Doctrine Phase/Category Matrix** — The canonical table (4 phases × 6 categories with all ~40 principles). Source: the book's Figure 2 table (around page 8-9 of the markdown)
3. **Phase I: Stop Self-Harm** — Communication (common language, challenge assumptions, understand context), Development (know users, focus on needs, remove bias, appropriate methods), Operation (know details), Learning (systematic learning)
4. **Phase II: Becoming More Context Aware** — add Leading (move fast, strategy is iterative) and Structure (small teams, distribute power, aptitude & attitude) categories
5. **Phase III: Better for Less** — Operation (optimize flow), Learning (bias to new, do better with less, exceptional standards), Leading (commit, be owner, inspire, embrace uncertainty, be humble), Structure (seek best, purpose/mastery/autonomy)
6. **Phase IV: Continuously Evolving** — Learning (listen to ecosystem), Leading (exploit landscape, no core), Structure (no single culture, design for constant evolution)
7. **Implementation Journeys** — Brief per-category journey summaries (Communication Journey, Development Journey, Operation Journey, Learning Journey, Leading Journey, Structure Journey)
8. **Assessment Template** — Keep existing 1-5 scoring but expand to cover all 40+ principles with phase grouping

Target: ~400 lines, distilled summaries with the key principle names, descriptions, and phase/category placement.

- [ ] **Step 3: Verify line count and structure**

Run: `wc -l arckit-claude/skills/wardley-mapping/references/doctrine.md`

Expected: 350-450 lines. Verify it has: Strategy Cycle, Phase/Category Matrix, Phase I-IV details, Implementation Journeys, Assessment Template.

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/skills/wardley-mapping/references/doctrine.md
git commit -m "feat: expand doctrine reference to 40+ principles across 4 phases"
```

---

### Task 7: Enhance gameplay-patterns.md (171 → ~600 lines)

**Files:**

- Modify: `arckit-claude/skills/wardley-mapping/references/gameplay-patterns.md`

**Source material**: Read `research/Introduction to Wardley Mapping Gameplays.md`

- [ ] **Step 1: Read existing file and source book**

Read `arckit-claude/skills/wardley-mapping/references/gameplay-patterns.md` (current 171 lines).
Read `research/Introduction to Wardley Mapping Gameplays.md` — focus on Chapter 3 (all gameplays by category) and Chapter 4 (case studies).

- [ ] **Step 2: Rewrite gameplay-patterns.md with enhanced content**

Preserve the existing build/buy/outsource decision framework. Restructure to 11 categories with all gameplays:

1. **Category A: User Perception** (8 plays) — Education (LG), Bundling (N), Creating Artificial Needs (LE), Confusion of Choice (LE), Brand & Marketing (N), FUD (LE), Artificial Competition (CE), Lobbying (CE)
2. **Category B: Accelerators** (5 plays) — Market Enablement (LG), Open Approaches (LG), Exploiting Network Effects (N), Co-operation (N), Industrial Policy (N)
3. **Category C: De-accelerators** (3 plays) — Exploiting Constraint (LE), IPR (LE), Creating Constraints (CE)
4. **Category D: Dealing with Toxicity** (4 plays) — Pig in a Poke (CE), Disposal of Liability (N), Sweat and Dump (LE), Refactoring (LG)
5. **Category E: Market** (8 plays) — Differentiation (N), Pricing Policy (N), Buyer/Supplier Power (LE), Harvesting (LE), Standards Game (LE), Last Man Standing (LE), Signal Distortion (CE), Trading (N)
6. **Category F: Defensive** (6 plays) — Threat Acquisition (N), Raising Barriers (N), Procrastination (N), Defensive Regulation (LE), Limitation of Competition (CE), Managing Inertia (N)
7. **Category G: Attacking** (7 plays) — Directed Investment (LG), Experimentation (LG), Centre of Gravity (N), Undermining Barriers (N), Fool's Mate (LE), Press Release Process (LE), Playing Both Sides (N)
8. **Category H: Ecosystem** (8 plays) — Alliances (LG), Co-creation (LG), Sensing Engines/ILC (N), Tower and Moat (N), N-sided Markets (N), Co-opting (LE), Embrace and Extend (LE), Channel Conflicts (N)
9. **Category I: Competitor** (8 plays) — Ambush (N), Fragmentation (LE), Reinforcing Inertia (LE), Sapping (LE), Misdirection (CE), Restriction of Movement (CE), Talent Raid (CE), Circling and Probing (N)
10. **Category J: Positional** (4 plays) — Land Grab (N), First Mover/Fast Follower (N), Aggregation (N), Weak Signal/Horizon (N)
11. **Category K: Poison** (3 plays) — Licensing Play (LE), Insertion (CE), Designed to Fail (CE)

Each play needs: name, D&D alignment (LG/N/LE/CE), 1-2 sentence description, when to use, evolution stage applicability.

Also add:

- **D&D Alignment Key** — Lawful Good, Neutral, Lawful Evil, Chaotic Evil definitions
- **Play-Position Matrix** — Table mapping (your position × market position → recommended plays)
- **Play Compatibility** — Which plays work together vs conflict
- **Anti-Patterns** — Strategic mistakes to avoid
- **Case Study Summaries** — Brief 2-3 line summaries of AWS, Netflix, Tesla, Spotify, Apple, Google Android, Ubuntu, Airbnb, Amazon Retail strategies
- Keep existing **Build vs Buy vs Outsource** framework and **Innovation Investment** section

Target: ~600 lines.

- [ ] **Step 3: Verify line count and structure**

Run: `wc -l arckit-claude/skills/wardley-mapping/references/gameplay-patterns.md`

Expected: 550-650 lines. Verify it has all 11 categories, D&D alignment key, play-position matrix, case studies.

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/skills/wardley-mapping/references/gameplay-patterns.md
git commit -m "feat: expand gameplay patterns to 60+ plays across 11 categories"
```

---

### Task 8: Enhance climatic-patterns.md (273 → ~500 lines)

**Files:**

- Modify: `arckit-claude/skills/wardley-mapping/references/climatic-patterns.md`

**Source material**: Read `research/Introduction to Wardley Mapping Climatic Patterns - Kindle - v1.0.1.md`

- [ ] **Step 1: Read existing file and source book**

Read `arckit-claude/skills/wardley-mapping/references/climatic-patterns.md` (current 273 lines).
Read `research/Introduction to Wardley Mapping Climatic Patterns - Kindle - v1.0.1.md` — focus on chapters IV-IX (the 6 pattern categories).

- [ ] **Step 2: Rewrite climatic-patterns.md with enhanced content**

Restructure into 6 categories with all 32 patterns:

1. **Component Patterns** (8): Everything evolves through supply/demand competition, Rates vary by ecosystem, Characteristics change as components evolve, No choice over evolution (Red Queen), No single method fits all, Components can co-evolve, Multiple waves of diffusion with chasms, Commoditization ≠ centralization
2. **Financial Patterns** (6): Higher-order systems create new value sources, Jevons Paradox (efficiency ≠ reduced spend), Capital flows to new value areas, Creative destruction (Schumpeter), Future value inversely proportional to certainty, Evolution increases local order and energy consumption
3. **Speed Patterns** (5): Efficiency enables innovation (componentization), Communication evolution increases overall speed, Stability of lower-order systems increases agility, Change is not always linear (discontinuous/exponential), Product-to-utility shifts show punctuated equilibrium
4. **Inertia Patterns** (3): Success breeds inertia, Inertia can kill an organization, Inertia increases with past model success
5. **Competitor Patterns** (2): Competitors' actions change the game, Most competitors have poor situational awareness
6. **Prediction Patterns** (8): P[what] vs P[when] (what is predictable, when is not), Economy has cycles (peace/war/wonder), Predictable vs unpredictable disruption, War (industrialization) causes org evolution, Cannot measure evolution over time or adoption, Less evolved = more uncertain, Not everything survives

Each pattern: name, 2-3 sentence description, strategic implication, assessment question.

Preserve existing assessment questions and pattern recognition template sections. Add:

- **Peace/War/Wonder Cycle** — Detailed explanation with phase characteristics
- **Pattern Interaction Map** — Which patterns reinforce or counteract each other
- **Per-Component Assessment Template** — How to score pattern impact per component

Target: ~500 lines.

- [ ] **Step 3: Verify line count and structure**

Run: `wc -l arckit-claude/skills/wardley-mapping/references/climatic-patterns.md`

Expected: 450-550 lines. Verify all 6 categories with 32 patterns present.

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/skills/wardley-mapping/references/climatic-patterns.md
git commit -m "feat: expand climatic patterns to 32 patterns across 6 categories"
```

---

### Task 9: Enhance evolution-stages.md (101 → ~180 lines)

**Files:**

- Modify: `arckit-claude/skills/wardley-mapping/references/evolution-stages.md`

**Source material**: Fundamentals chapters from all 3 books + melodic-software evolution-analysis skill patterns (documented in spec conversation).

- [ ] **Step 1: Read existing file**

Read `arckit-claude/skills/wardley-mapping/references/evolution-stages.md` (current 101 lines).

- [ ] **Step 2: Enhance with additional content**

Keep existing structure (stage characteristics, indicators table, positioning criteria, common mistakes). Add:

- **Enhanced Stage Indicators** — More detailed checklists per stage from the books (ubiquity markers, certainty markers, market maturity markers, failure mode descriptions)
- **Transition Timing Heuristics** — Weak signals for stage transitions: conference talks emerging, documentation appearing, pricing model shifts, standardization efforts, open-source alternatives appearing
- **Pioneers/Settlers/Planners** — Expanded talent model section explaining which talent types work best at each stage, how to manage handoffs between talent types
- **Assessment Questions per Stage** — Practical questions to validate component placement ("Can you buy this off the shelf?" → Product/Commodity; "Are there multiple competing approaches?" → Custom)

Target: ~180 lines.

- [ ] **Step 3: Verify and commit**

```bash
wc -l arckit-claude/skills/wardley-mapping/references/evolution-stages.md
git add arckit-claude/skills/wardley-mapping/references/evolution-stages.md
git commit -m "feat: enhance evolution stages with transition heuristics and talent model"
```

---

### Task 10: Enhance mapping-examples.md (307 → ~450 lines)

**Files:**

- Modify: `arckit-claude/skills/wardley-mapping/references/mapping-examples.md`

**Source material**: Gameplays book Chapter 4 (case studies), Climatic Patterns book (TechnoGadget), melodic-software value-chain skill (e-commerce/SaaS examples).

- [ ] **Step 1: Read existing file**

Read `arckit-claude/skills/wardley-mapping/references/mapping-examples.md` (current 307 lines).

- [ ] **Step 2: Add new examples**

Keep existing 3 examples (E-Commerce, DevOps Platform, ML Product). Add:

- **TechnoGadget Smart Home** example — from the Climatic Patterns book. Smart thermostat company value chain: User Need → Smart Thermostat → Mobile App → Cloud Infrastructure → Data Analytics. Include OWM syntax and component positioning.
- **Value Chain Decomposition Example** — Step-by-step decomposition of an e-commerce user need ("Buy products online") showing anchor identification, first-level components, recursive decomposition, dependency establishment, validation. Based on melodic-software's value-chain skill patterns.
- **Case Study Cross-References** — Brief summaries linking to gameplay patterns: AWS (ILC pattern: innovate internal infrastructure → leverage as EC2/S3 → commoditize as utility computing), Netflix (transition from DVD to streaming — attacking play + ecosystem play), Spotify (two-factor market: free users + premium subscribers + artists).

Target: ~450 lines.

- [ ] **Step 3: Verify and commit**

```bash
wc -l arckit-claude/skills/wardley-mapping/references/mapping-examples.md
git add arckit-claude/skills/wardley-mapping/references/mapping-examples.md
git commit -m "feat: add TechnoGadget, value chain, and case study examples"
```

---

### Task 11: Enhance mathematical-models.md (254 → ~300 lines)

**Files:**

- Modify: `arckit-claude/skills/wardley-mapping/references/mathematical-models.md`

- [ ] **Step 1: Read existing file**

Read `arckit-claude/skills/wardley-mapping/references/mathematical-models.md` (current 254 lines).

- [ ] **Step 2: Add play-position scoring and climate impact weighting**

Keep all existing content. Add:

- **Play-Position Scoring** — Quantitative framework for evaluating gameplay options based on your evolution position and market position. Score = f(position_match, capability_fit, risk_tolerance). Based on melodic-software's strategic-analysis patterns.
- **Climate Pattern Impact Weighting** — How to score the impact of each climatic pattern on each component. Impact matrix: pattern × component → impact score (1-5). Aggregate to identify most-affected components and highest-impact patterns.

Target: ~300 lines.

- [ ] **Step 3: Verify and commit**

```bash
wc -l arckit-claude/skills/wardley-mapping/references/mathematical-models.md
git add arckit-claude/skills/wardley-mapping/references/mathematical-models.md
git commit -m "feat: add play-position scoring and climate impact weighting"
```

---

## Chunk 3: Templates

### Task 12: Create wardley-value-chain-template.md

**Files:**

- Create: `arckit-claude/templates/wardley-value-chain-template.md`
- Create: `.arckit/templates/wardley-value-chain-template.md` (mirror)

- [ ] **Step 1: Create the template**

Use the existing `arckit-claude/templates/wardley-map-template.md` as the structural pattern (Document Control table, Revision History, section structure, Generation Footer). Create `arckit-claude/templates/wardley-value-chain-template.md` with sections per the spec:

- Document Control (Document ID: `ARC-[PROJECT_ID]-WVCH-[NNN]-v[VERSION]`, Document Type: `Wardley Value Chain`)
- Revision History
- Executive Summary
- User Need / Anchor (`{anchor_description}` — the user need this chain serves)
- Users and Personas table
- Value Chain Diagram (ASCII art placeholder + OWM notation block)
- Component Inventory table (ID, Component, Description, Depends On, Visibility score 0.0-1.0)
- Dependency Matrix (component × component grid)
- Critical Path Analysis
- Validation Checklist (completeness, accuracy, usefulness — checkboxes)
- Visibility Assessment (Y-axis positioning guide table: 0.90-1.0 direct interaction → 0.00-0.09 utilities)
- Assumptions and Open Questions
- Generation Footer (`/arckit.wardley.value-chain`)

- [ ] **Step 2: Mirror to .arckit/templates/**

```bash
cp arckit-claude/templates/wardley-value-chain-template.md .arckit/templates/wardley-value-chain-template.md
```

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/templates/wardley-value-chain-template.md .arckit/templates/wardley-value-chain-template.md
git commit -m "feat: add wardley value chain template"
```

---

### Task 13: Create wardley-doctrine-template.md

**Files:**

- Create: `arckit-claude/templates/wardley-doctrine-template.md`
- Create: `.arckit/templates/wardley-doctrine-template.md` (mirror)

- [ ] **Step 1: Create the template**

Document Control (Document ID: `ARC-[PROJECT_ID]-WDOC-v[VERSION]`, Document Type: `Wardley Doctrine Assessment`), Revision History, then:

- Executive Summary (overall maturity score, phase positioning, critical findings)
- Strategy Cycle Context (Purpose, Landscape summary, Climate summary, Leadership context)
- Doctrine Assessment Matrix — Large table: rows = all ~40 principles grouped by phase (I-IV), columns = Category, Principle, Score (1-5), Evidence, Improvement Action
- Phase I Assessment (Stop Self-Harm) — detailed findings per principle
- Phase II Assessment (Becoming More Context Aware)
- Phase III Assessment (Better for Less)
- Phase IV Assessment (Continuously Evolving)
- Previous Assessment Comparison (if re-assessment: table with Principle, Previous Score, Current Score, Trend ↑↓→)
- Critical Gaps — Top 5 gaps with phase, category, current score, target score, business impact
- Implementation Roadmap — Immediate (0-3mo), Short-term (3-12mo), Long-term (12-24mo)
- Recommendations
- Traceability (links to PRIN, WARD, STKE)
- Generation Footer (`/arckit.wardley.doctrine`)

- [ ] **Step 2: Mirror and commit**

```bash
cp arckit-claude/templates/wardley-doctrine-template.md .arckit/templates/wardley-doctrine-template.md
git add arckit-claude/templates/wardley-doctrine-template.md .arckit/templates/wardley-doctrine-template.md
git commit -m "feat: add wardley doctrine assessment template"
```

---

### Task 14: Create wardley-gameplay-template.md

**Files:**

- Create: `arckit-claude/templates/wardley-gameplay-template.md`
- Create: `.arckit/templates/wardley-gameplay-template.md` (mirror)

- [ ] **Step 1: Create the template**

Document Control (Document ID: `ARC-[PROJECT_ID]-WGAM-[NNN]-v[VERSION]`, Document Type: `Wardley Gameplay Analysis`), Revision History, then:

- Executive Summary
- Map Reference (link to WARD artifact: `ARC-[PROJECT_ID]-WARD-[NNN]-v[VERSION]`)
- Situational Assessment (Position Analysis, Capability Assessment, Market Context — based on melodic-software's play selection framework questions)
- Play Options — 11 category sections, each with applicable plays, D&D alignment tag, applicability assessment, and recommendation (Apply/Monitor/Skip)
- Play-Position Matrix Evaluation (your position × market → recommended plays, with scoring)
- Play Compatibility Analysis (selected plays: do they reinforce or conflict?)
- Selected Plays — For each selected play: Description, Prerequisites, Execution Steps (1-N), Expected Outcomes (short/long term), Risks and Mitigations, Resource Requirements, Success Criteria, Review Points
- Risk Assessment and Anti-Patterns
- Case Study References (which real-world examples inform the selected plays)
- Traceability (links to WARD, WCLM, WDOC, PRIN)
- Generation Footer (`/arckit.wardley.gameplay`)

- [ ] **Step 2: Mirror and commit**

```bash
cp arckit-claude/templates/wardley-gameplay-template.md .arckit/templates/wardley-gameplay-template.md
git add arckit-claude/templates/wardley-gameplay-template.md .arckit/templates/wardley-gameplay-template.md
git commit -m "feat: add wardley gameplay analysis template"
```

---

### Task 15: Create wardley-climate-template.md

**Files:**

- Create: `arckit-claude/templates/wardley-climate-template.md`
- Create: `.arckit/templates/wardley-climate-template.md` (mirror)

- [ ] **Step 1: Create the template**

Document Control (Document ID: `ARC-[PROJECT_ID]-WCLM-[NNN]-v[VERSION]`, Document Type: `Wardley Climate Assessment`), Revision History, then:

- Executive Summary
- Map Reference (link to WARD artifact)
- Component Inventory (extracted from WARD — table: Component, Visibility, Evolution, Stage)
- Climate Assessment by Category:
  - Component Patterns assessment (8 patterns × impact on this project)
  - Financial Patterns assessment (6 patterns)
  - Speed Patterns assessment (5 patterns)
  - Inertia Patterns assessment (3 patterns)
  - Competitor Patterns assessment (2 patterns)
  - Prediction Patterns assessment (8 patterns)
- Per-Component Impact Matrix (rows = components, columns = key patterns, cells = impact H/M/L)
- Prediction Horizons (6-month outlook, 18-month outlook — per component: current stage, predicted stage, confidence, key signals)
- Wave Analysis (current position in peace/war/wonder cycle, implications)
- Inertia Assessment (per component: inertia type, severity, mitigation strategy)
- Strategic Implications (summary of how climate affects strategy)
- Traceability (links to WARD, REQ, RSCH)
- Generation Footer (`/arckit.wardley.climate`)

- [ ] **Step 2: Mirror and commit**

```bash
cp arckit-claude/templates/wardley-climate-template.md .arckit/templates/wardley-climate-template.md
git add arckit-claude/templates/wardley-climate-template.md .arckit/templates/wardley-climate-template.md
git commit -m "feat: add wardley climate assessment template"
```

---

## Chunk 4: Commands

### Task 16: Create wardley.value-chain.md command

**Files:**

- Create: `arckit-claude/commands/wardley.value-chain.md`

- [ ] **Step 1: Create the command file**

Use the existing `arckit-claude/commands/wardley.md` as the structural pattern (YAML frontmatter with description, argument-hint, handoffs, hooks; then prompt body with steps).

YAML frontmatter:

```yaml
---
description: Decompose user needs into value chains for Wardley Mapping
argument-hint: "<user need or domain, e.g. 'online shopping', 'patient booking'>"
handoffs:
  - command: wardley
    description: Create Wardley Map from this value chain
  - command: wardley.doctrine
    description: Assess organizational doctrine maturity
    condition: "Value chain reveals organizational capability gaps"
hooks:
  Stop:
    - hooks:
        - type: command
          command: "node ${CLAUDE_PLUGIN_ROOT}/hooks/validate-wardley-math.mjs"
          timeout: 10
---
```

Prompt body structure (model on existing wardley.md patterns):

1. Role description — expert in value chain decomposition using Wardley Mapping methodology
2. User Input — `$ARGUMENTS`
3. Step 1: Read prerequisites — MANDATORY: REQ. RECOMMENDED: STKE. OPTIONAL: PRIN. Also read existing WVCH artifacts.
4. Step 2: Identify the Anchor (User Need) — Good vs bad anchor guidance, anchor identification questions (from melodic-software value-chain skill and books). Reference `${CLAUDE_PLUGIN_ROOT}/skills/wardley-mapping/references/evolution-stages.md` for positioning.
5. Step 3: Decompose into Components — Recursive decomposition method, component identification checklist, stop conditions.
6. Step 4: Establish Dependencies — Dependency types (requires, uses, enables), dependency rules, circular dependency warning.
7. Step 5: Assess Visibility — Y-axis positioning guide (0.90-1.0 direct interaction → 0.00-0.09 utilities). Reference `${CLAUDE_PLUGIN_ROOT}/skills/wardley-mapping/references/evolution-stages.md`.
8. Step 6: Validate the Chain — Completeness, accuracy, usefulness checklists. Common validation issues (too shallow, too deep, missing components, solution bias).
9. Step 7: Generate Output — Read template, populate Document Control, create project path via create-project.sh, write file using Write tool. Include OWM notation for the value chain.
10. Summary message to user with file location and next step recommendations.

Include standard ArcKit patterns: Document Control auto-population, quality checklist reference (`${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md`), markdown escaping note.

Target: ~350-450 lines.

- [ ] **Step 2: Verify YAML frontmatter is valid**

Run: `head -20 arckit-claude/commands/wardley.value-chain.md` — verify frontmatter opens and closes with `---`.

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/commands/wardley.value-chain.md
git commit -m "feat: add wardley.value-chain command for value chain decomposition"
```

---

### Task 17: Create wardley.doctrine.md command

**Files:**

- Create: `arckit-claude/commands/wardley.doctrine.md`

- [ ] **Step 1: Create the command file**

YAML frontmatter:

```yaml
---
description: Assess organizational doctrine maturity using Wardley's 4-phase framework
argument-hint: "<organization or project, e.g. 'DWP Benefits Team', 'Platform Engineering'>"
handoffs:
  - command: wardley
    description: Create or refine Wardley Map informed by doctrine gaps
    condition: "Doctrine gaps affect component positioning or strategy"
  - command: wardley.gameplay
    description: Select gameplays that address doctrine weaknesses
---
```

Prompt body:

1. Role — expert in organizational maturity assessment using Wardley's doctrine framework
2. User Input — `$ARGUMENTS`
3. Step 1: Read prerequisites — MANDATORY: PRIN. RECOMMENDED: WARD, STKE. OPTIONAL: REQ. Also read existing WDOC for re-assessment comparison.
4. Step 2: Read reference material — Read `${CLAUDE_PLUGIN_ROOT}/skills/wardley-mapping/references/doctrine.md` for the full doctrine framework (40+ principles, 4 phases, 6 categories).
5. Step 3: Gather Evidence — For each doctrine principle, assess using evidence from available artifacts, project context, and user input. Score 1-5 (1=not practiced, 2=ad-hoc, 3=developing, 4=mature, 5=cultural norm).
6. Step 4: Analyze by Phase — Phase I through IV analysis. Emphasize: phases build sequentially — skipping foundational work undermines higher phases.
7. Step 5: Re-assessment Comparison — If previous WDOC exists, produce comparison table (Principle, Previous Score, Current Score, Trend ↑↓→).
8. Step 6: Identify Critical Gaps — Top 5 gaps with largest business impact. Focus on Phase I gaps first (stop self-harm before improving strategy).
9. Step 7: Create Implementation Roadmap — Immediate (0-3mo), Short-term (3-12mo), Long-term (12-24mo) actions.
10. Step 8: Generate Output — Read template, populate, write file.
11. Summary message.

Target: ~400-500 lines.

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/commands/wardley.doctrine.md
git commit -m "feat: add wardley.doctrine command for doctrine maturity assessment"
```

---

### Task 18: Create wardley.gameplay.md command

**Files:**

- Create: `arckit-claude/commands/wardley.gameplay.md`

- [ ] **Step 1: Create the command file**

YAML frontmatter:

```yaml
---
description: Analyze strategic play options from Wardley Maps using 60+ gameplay patterns
argument-hint: "<strategic context, e.g. 'cloud migration', 'market entry for chatbot'>"
handoffs:
  - command: roadmap
    description: Create roadmap to execute selected plays
  - command: strategy
    description: Synthesise gameplay into architecture strategy
  - command: wardley.climate
    description: Validate plays against climatic patterns
    condition: "Climate assessment not yet performed"
---
```

Prompt body:

1. Role — expert strategist in Wardley Mapping gameplays and competitive positioning
2. User Input — `$ARGUMENTS`
3. Step 1: Read prerequisites — MANDATORY: WARD (Wardley Map must exist). RECOMMENDED: WCLM, WDOC. OPTIONAL: RSCH, PRIN.
4. Step 2: Read reference material — Read `${CLAUDE_PLUGIN_ROOT}/skills/wardley-mapping/references/gameplay-patterns.md` for the full 60+ gameplay catalog across 11 categories with D&D alignments.
5. Step 3: Situational Assessment — Position analysis (where are your components?), Capability assessment (what can you execute?), Market context (growing/consolidating? regulatory?). Extract from WARD artifact.
6. Step 4: Evaluate Play Options — For each of the 11 categories, assess which plays are applicable given the current map position. Use the play-position matrix. Tag each with D&D alignment.
7. Step 5: Check Play Compatibility — Do selected plays reinforce or conflict? Reference compatibility guidance from the reference file.
8. Step 6: Detail Selected Plays — For each selected play: execution steps, prerequisites, expected outcomes, risks, success criteria, review points.
9. Step 7: Anti-Pattern Check — Verify the strategy doesn't fall into common anti-patterns (playing in wrong stage, single play dependence, ignoring inertia, ecosystem hubris).
10. Step 8: Cross-reference Case Studies — Which real-world examples (AWS, Netflix, etc.) inform the selected plays?
11. Step 9: Generate Output — Read template, populate, write file.
12. Summary message.

Target: ~450-550 lines.

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/commands/wardley.gameplay.md
git commit -m "feat: add wardley.gameplay command for strategic play analysis"
```

---

### Task 19: Create wardley.climate.md command

**Files:**

- Create: `arckit-claude/commands/wardley.climate.md`

- [ ] **Step 1: Create the command file**

YAML frontmatter:

```yaml
---
description: Assess climatic patterns affecting Wardley Map components
argument-hint: "<domain or market, e.g. 'AI in healthcare', 'UK government digital services'>"
handoffs:
  - command: wardley.gameplay
    description: Select gameplays informed by climate forces
  - command: wardley
    description: Update map with climate-driven evolution predictions
    condition: "Climate analysis reveals evolution velocity changes"
---
```

Prompt body:

1. Role — expert in Wardley Mapping climatic patterns and strategic forecasting
2. User Input — `$ARGUMENTS`
3. Step 1: Read prerequisites — MANDATORY: WARD. RECOMMENDED: REQ, RSCH. OPTIONAL: WDOC, PRIN.
4. Step 2: Read reference material — Read `${CLAUDE_PLUGIN_ROOT}/skills/wardley-mapping/references/climatic-patterns.md` for all 32 patterns across 6 categories. Also read `${CLAUDE_PLUGIN_ROOT}/skills/wardley-mapping/references/mathematical-models.md` for impact weighting.
5. Step 3: Extract Component Inventory — From WARD artifact, list all components with their visibility and evolution positions.
6. Step 4: Assess Climatic Patterns — For each of the 6 categories (component, financial, speed, inertia, competitors, prediction), evaluate which patterns are actively affecting the mapped landscape. Provide evidence and strategic implications per pattern.
7. Step 5: Per-Component Impact Matrix — For each component, score the impact of key patterns (H/M/L). Identify most-affected components.
8. Step 6: Prediction Horizons — 6-month and 18-month forecasts per component: current stage, predicted stage, confidence level, key signals to watch.
9. Step 7: Wave Analysis — Position the landscape in the peace/war/wonder cycle. Identify which components are in which phase and implications.
10. Step 8: Inertia Assessment — Per component: type of inertia, severity, mitigation strategy.
11. Step 9: Generate Output — Read template, populate, write file.
12. Summary message.

Target: ~400-500 lines.

- [ ] **Step 2: Commit**

```bash
git add arckit-claude/commands/wardley.climate.md
git commit -m "feat: add wardley.climate command for climatic pattern assessment"
```

---

### Task 20: Update existing wardley.md handoffs

**Files:**

- Modify: `arckit-claude/commands/wardley.md:4-17` (frontmatter)

- [ ] **Step 1: Add new handoffs to wardley.md frontmatter**

In the `handoffs:` section, add 3 new entries after the existing `research` handoff:

```yaml
  - command: wardley.doctrine
    description: Assess organizational doctrine maturity
  - command: wardley.gameplay
    description: Identify strategic plays from the map
  - command: wardley.climate
    description: Assess climatic patterns affecting components
```

- [ ] **Step 2: Add WVCH/WDOC/WCLM to recommended reading**

In the command body where prerequisites are listed (Step 1), add to RECOMMENDED:

- WVCH (Value Chain) — Extract: anchor, components, visibility, dependencies
- WDOC (Doctrine Assessment) — Extract: doctrine scores, capability gaps
- WCLM (Climate Assessment) — Extract: pattern impacts, predictions

And to OPTIONAL:

- WGAM (Gameplay Analysis) — Extract: selected plays, execution steps

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/commands/wardley.md
git commit -m "feat: add wardley suite handoffs and sibling artifact reading"
```

---

## Chunk 5: Converter Verification

### Task 21: Run converter and verify output

**Files:**

- No new files — verification only

- [ ] **Step 1: Run the converter**

```bash
python scripts/converter.py
```

Expected: Converter completes without errors. Check the output log for the 4 new commands appearing in each target.

- [ ] **Step 2: Verify Codex extension output**

```bash
ls arckit-codex/skills/arckit-wardley.value-chain/SKILL.md
ls arckit-codex/skills/arckit-wardley.doctrine/SKILL.md
ls arckit-codex/skills/arckit-wardley.gameplay/SKILL.md
ls arckit-codex/skills/arckit-wardley.climate/SKILL.md
```

Verify all 4 skill directories exist with SKILL.md files. Check one file for correct cross-references: `grep 'arckit' arckit-codex/skills/arckit-wardley.gameplay/SKILL.md | head -5` — verify `/arckit.wardley.doctrine` was rewritten to `$arckit-wardley.doctrine` (not truncated to `$arckit-wardley`).

- [ ] **Step 3: Verify Gemini extension output**

```bash
ls arckit-gemini/commands/arckit/wardley.value-chain.toml
ls arckit-gemini/commands/arckit/wardley.doctrine.toml
ls arckit-gemini/commands/arckit/wardley.gameplay.toml
ls arckit-gemini/commands/arckit/wardley.climate.toml
```

If dots in TOML filenames cause issues, fix the converter to map dots to hyphens for Gemini target and re-run.

- [ ] **Step 4: Verify OpenCode and Copilot output**

```bash
ls arckit-opencode/commands/arckit.wardley.value-chain.md
ls arckit-opencode/commands/arckit.wardley.doctrine.md
ls arckit-copilot/prompts/arckit-wardley.value-chain.prompt.md
ls arckit-copilot/prompts/arckit-wardley.doctrine.prompt.md
```

- [ ] **Step 5: Verify reference files and templates were copied**

```bash
ls arckit-codex/references/wardley-mapping/
ls arckit-gemini/references/wardley-mapping/
ls arckit-codex/templates/wardley-doctrine-template.md
ls arckit-gemini/templates/wardley-doctrine-template.md
```

- [ ] **Step 6: Commit all generated files**

```bash
git add arckit-codex/ arckit-gemini/ arckit-opencode/ arckit-copilot/ .codex/ .opencode/
git commit -m "chore: regenerate extension formats with wardley suite commands"
```

---

## Chunk 6: Documentation

### Task 22: Create 4 new guide files

**Files:**

- Create: `docs/guides/wardley-value-chain.md` + mirror to `arckit-claude/guides/`
- Create: `docs/guides/wardley-doctrine.md` + mirror to `arckit-claude/guides/`
- Create: `docs/guides/wardley-gameplay.md` + mirror to `arckit-claude/guides/`
- Create: `docs/guides/wardley-climate.md` + mirror to `arckit-claude/guides/`

- [ ] **Step 1: Create each guide**

Use `docs/guides/wardley.md` as the structural template (Guide Origin header, Inputs table, Command section, Output section, Key Concepts, Tips).

Each guide should cover: when to use, prerequisites, command invocation, output artifact, key concepts from the domain, integration with other Wardley commands, tips.

- [ ] **Step 2: Mirror all guides**

```bash
cp docs/guides/wardley-value-chain.md arckit-claude/guides/wardley-value-chain.md
cp docs/guides/wardley-doctrine.md arckit-claude/guides/wardley-doctrine.md
cp docs/guides/wardley-gameplay.md arckit-claude/guides/wardley-gameplay.md
cp docs/guides/wardley-climate.md arckit-claude/guides/wardley-climate.md
```

- [ ] **Step 3: Update existing wardley.md guide**

Add a "Wardley Mapping Suite" section to `docs/guides/wardley.md` describing the full suite, recommended workflow order (value-chain → wardley → doctrine/climate/gameplay), and links to the 4 new guides. Mirror to `arckit-claude/guides/wardley.md`.

- [ ] **Step 4: Commit**

```bash
git add docs/guides/ arckit-claude/guides/
git commit -m "docs: add guides for wardley suite commands"
```

---

### Task 23: Update README.md

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Update command count**

Change `60` to `64` wherever the command count appears.

- [ ] **Step 2: Add 4 new commands to the command table**

Find the command table and add entries for the 4 new commands in the Architecture section, near the existing `wardley` entry:

| Command | Description |
|---------|-------------|
| `wardley.value-chain` | Decompose user needs into value chains for Wardley Mapping |
| `wardley.doctrine` | Assess organizational doctrine maturity using 4-phase framework |
| `wardley.gameplay` | Analyze strategic play options from 60+ gameplay patterns |
| `wardley.climate` | Assess climatic patterns affecting mapped components |

- [ ] **Step 3: Add Wardley Mapping Suite description**

Add a brief paragraph in the relevant section describing the Wardley suite: "The Wardley Mapping suite provides composable commands for strategic analysis. Start with `/arckit.wardley.value-chain` to decompose user needs, create maps with `/arckit.wardley`, then deepen analysis with doctrine assessment, gameplay analysis, and climate assessment."

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add wardley suite commands to README"
```

---

### Task 24: Update docs/index.html

**Files:**

- Modify: `docs/index.html`

- [ ] **Step 1: Update command count in header**

Change `60` to `64` in any header/meta text.

- [ ] **Step 2: Add 4 new command entries**

Add entries for the 4 new commands following the existing pattern in the HTML. Place them near the existing `wardley` entry in the Architecture category.

- [ ] **Step 3: Commit**

```bash
git add docs/index.html
git commit -m "docs: add wardley suite commands to GitHub Pages index"
```

---

### Task 25: Update docs/DEPENDENCY-MATRIX.md

**Files:**

- Modify: `docs/DEPENDENCY-MATRIX.md`

- [ ] **Step 1: Add 4 new commands**

Add entries for each new command showing prerequisites, outputs, and handoffs per the spec's prerequisite table and handoff declarations.

- [ ] **Step 2: Commit**

```bash
git add docs/DEPENDENCY-MATRIX.md
git commit -m "docs: add wardley suite to dependency matrix"
```

---

### Task 26: Update docs/WORKFLOW-DIAGRAMS.md

**Files:**

- Modify: `docs/WORKFLOW-DIAGRAMS.md`

- [ ] **Step 1: Add Wardley Suite workflow diagram**

Add the Wardley suite composition diagram from the spec (Section 4) showing: value-chain → wardley → doctrine/climate/gameplay → wardley (re-run) → roadmap/strategy.

- [ ] **Step 2: Commit**

```bash
git add docs/WORKFLOW-DIAGRAMS.md
git commit -m "docs: add wardley suite workflow diagram"
```

---

### Task 27: Update docs/README.md

**Files:**

- Modify: `docs/README.md`

- [ ] **Step 1: Add 4 new commands to documentation index**

Add entries for the 4 new commands in the appropriate section.

- [ ] **Step 2: Commit**

```bash
git add docs/README.md
git commit -m "docs: add wardley suite to documentation index"
```

---

### Task 28: Update CHANGELOGs

**Files:**

- Modify: `CHANGELOG.md`
- Modify: `arckit-claude/CHANGELOG.md`

- [ ] **Step 1: Add entries to both changelogs**

Add under `## [Unreleased]` or the next version:

```markdown
### Added
- `/arckit.wardley.value-chain` — Decompose user needs into value chains
- `/arckit.wardley.doctrine` — Assess organizational doctrine maturity (4 phases, 40+ principles)
- `/arckit.wardley.gameplay` — Analyze strategic plays from 60+ gameplay catalog with D&D alignment
- `/arckit.wardley.climate` — Assess 32 climatic patterns across 6 categories
- Wardley reference files enriched from 3 Wardley Mapping books (doctrine, gameplays, climatic patterns)
- 4 new document types: WVCH, WDOC, WGAM, WCLM
- 4 new templates and usage guides

### Fixed
- `wardley.md` hook reference corrected from `python3 .py` to `node .mjs`
```

- [ ] **Step 2: Commit**

```bash
git add CHANGELOG.md arckit-claude/CHANGELOG.md
git commit -m "docs: update changelogs with wardley suite additions"
```
