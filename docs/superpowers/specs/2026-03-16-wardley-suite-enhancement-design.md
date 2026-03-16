# Wardley Mapping Suite Enhancement Design

**Date**: 2026-03-16
**Status**: Draft
**Author**: ArcKit Team

## Summary

Enhance ArcKit's Wardley Mapping capabilities from a single `/arckit.wardley` command into a composable suite of 5 commands (1 existing + 4 new), backed by massively enriched shared reference files. Content drawn from three Wardley Mapping books (Climatic Patterns, Doctrine, Gameplays) and patterns validated by the melodic-software/claude-code-plugins Wardley mapping skill.

## Goals

1. Expand strategic analysis depth — doctrine (15→40+ principles), gameplays (8→60+ patterns), climatic patterns (9→32 patterns)
2. Add standalone commands for doctrine assessment, gameplay analysis, climate assessment, and value chain decomposition
3. Maintain composability — every command works standalone but gets richer when sibling artifacts exist
4. Support all 5 AI platforms via the converter
5. Follow existing ArcKit patterns (templates, document control, handoffs, references)

## Non-Goals

- Agents for the new commands (none require heavy web research)
- MCP server for OnlineWardleyMaps API (future opportunity)
- Mermaid.js output format (future opportunity)
- Breaking changes to existing `/arckit.wardley` command behavior

---

## Section 1: New Command Suite

### Existing Command (Enhanced)

- **`/arckit.wardley`** — Map creation. Stays as-is but reads enriched references and consumes outputs from new commands when available. Additional handoffs added to new sibling commands.

### New Commands (4)

| Command | File | Purpose | Doc Code | Multi-instance? |
|---------|------|---------|----------|-----------------|
| `/arckit.wardley.value-chain` | `wardley.value-chain.md` | Decompose user needs into value chains. Anchor identification, dependency tracing, visibility assessment. Pre-step to `/arckit.wardley` | `WVCH` | Yes |
| `/arckit.wardley.doctrine` | `wardley.doctrine.md` | Assess organizational doctrine maturity across 4 phases, 6 categories, 40+ principles. Scores 1-5 per principle, produces phased improvement roadmap | `WDOC` | No (one per project) |
| `/arckit.wardley.gameplay` | `wardley.gameplay.md` | Analyze strategic play options from 60+ gameplay catalog across 11 categories. Produces play recommendations with D&D alignment classification | `WGAM` | Yes |
| `/arckit.wardley.climate` | `wardley.climate.md` | Assess climatic patterns affecting components — 32 patterns across 6 categories. Produces climate assessment with impact per component | `WCLM` | Yes |

### Argument Hints

| Command | argument-hint |
|---------|--------------|
| `wardley.value-chain` | `"<user need or domain, e.g. 'online shopping', 'patient booking'>"` |
| `wardley.doctrine` | `"<organization or project, e.g. 'DWP Benefits Team', 'Platform Engineering'>"` |
| `wardley.gameplay` | `"<strategic context, e.g. 'cloud migration', 'market entry for chatbot'>"` |
| `wardley.climate` | `"<domain or market, e.g. 'AI in healthcare', 'UK government digital services'>"` |

### Hooks

| Command | Stop Hook | Rationale |
|---------|-----------|-----------|
| `wardley.value-chain` | `validate-wardley-math.mjs` | Produces OWM syntax with component coordinates |
| `wardley.doctrine` | None | No OWM syntax — produces scoring matrix only |
| `wardley.gameplay` | None | No OWM syntax — produces play analysis only |
| `wardley.climate` | None | No OWM syntax — produces pattern impact matrix only |

### Template Naming Convention

Command dots are replaced with hyphens for template filenames: command `wardley.doctrine` → template `wardley-doctrine-template.md`.

### Re-assessment Support

`wardley.doctrine` supports re-assessment: if a previous WDOC artifact exists, it reads it and presents a score comparison (previous vs current) with trend indicators. The template includes a "Previous Assessment Comparison" section.

### Document Output Locations

All artifacts saved to `projects/{id}-{name}/wardley-maps/`:

- `ARC-{ID}-WVCH-{NNN}-v1.0.md` — Value Chain
- `ARC-{ID}-WDOC-v1.0.md` — Doctrine Assessment (single instance)
- `ARC-{ID}-WGAM-{NNN}-v1.0.md` — Gameplay Analysis
- `ARC-{ID}-WCLM-{NNN}-v1.0.md` — Climate Assessment

---

## Section 2: Reference File Enhancements

Six existing files in `arckit-claude/skills/wardley-mapping/references/`, all expanded using the three research books.

### doctrine.md (120 → ~400 lines)

**Current**: 15 principles, checklist format, 5 categories, 1-5 scoring.

**Enhanced**:

- 40+ principles from Doctrine book
- 4 phases: Stop Self-Harm → Context Aware → Better for Less → Continuously Evolving
- 6 categories: Communication, Development, Operation, Learning, Leading, Structure
- Full phase/category matrix table (the canonical Wardley doctrine table)
- Implementation journey per category
- Strategy Cycle framework (Purpose → Landscape → Climate → Doctrine → Leadership)

**Source**: Doctrine book, chapters Phase I–IV + Implementing Doctrine.

### gameplay-patterns.md (171 → ~600 lines)

**Current**: 8 patterns (5 offensive, 3 defensive), basic build/buy/outsource.

**Enhanced**:

- 60+ patterns from Gameplays book
- 11 categories: User Perception, Accelerators, De-accelerators, Dealing with Toxicity, Market, Defensive, Attacking, Ecosystem, Competitor, Positional, Poison
- D&D alignment classification per gameplay (Lawful Good → Chaotic Evil)
- Play-position matrix (your position × market position → recommended plays)
- Play compatibility and conflict guidance
- Strategic anti-patterns section
- 9 company case studies as brief examples (AWS, Netflix, Tesla, Spotify, Apple, Google Android, Ubuntu, Airbnb, Amazon Retail)

**Source**: Gameplays book, Chapter 3 (all 11 categories) + Chapter 4 (case studies).

### climatic-patterns.md (273 → ~500 lines)

**Current**: 9 patterns across 5 categories.

**Enhanced to 32 patterns across 6 categories**:

- **Component patterns** (8): Everything evolves, rates vary by ecosystem, characteristics change, Red Queen effect, no single method, co-evolution, multiple waves of diffusion, commoditization ≠ centralization
- **Financial patterns** (6): Higher-order systems create value, Jevons Paradox, capital flows to new areas, creative destruction (Schumpeter), inverse value/certainty, increasing local order and energy
- **Speed patterns** (5): Componentization effect (efficiency enables innovation), communication evolution accelerates overall evolution, stability increases agility, non-linear/discontinuous change, punctuated equilibrium
- **Inertia patterns** (3): Success breeds inertia, inertia can kill, past success amplifies inertia
- **Competitor patterns** (2): Actions change the game, most have poor situational awareness
- **Prediction patterns** (8): P[what] vs P[when], peace/war/wonder cycles, predictable vs unpredictable disruption, industrialization causes org evolution, cannot measure evolution over time, less evolved = more uncertain, not everything survives

**Source**: Climatic Patterns book, chapters IV–IX.

### evolution-stages.md (101 → ~180 lines)

**Enhanced**:

- Detailed characteristics per stage from all 3 books
- Enhanced indicator checklists (from melodic-software evolution-analysis skill)
- Transition timing heuristics and weak signals
- Expanded pioneers→settlers→planners talent model

**Source**: Fundamentals chapters from all 3 books + melodic-software evolution-analysis skill.

### mapping-examples.md (307 → ~450 lines)

**Enhanced**:

- 2-3 additional worked examples from books (TechnoGadget smart home, streaming service)
- Cross-references to gameplay case studies (AWS ILC pattern, Netflix transition)
- Worked value chain decomposition example (e-commerce and SaaS patterns from melodic-software)

**Source**: Gameplays book Chapter 4 + Climatic Patterns TechnoGadget + melodic-software value-chain skill.

### mathematical-models.md (254 → ~300 lines)

**Enhanced**:

- Play-position scoring from melodic-software strategic-analysis
- Pattern impact weighting per component for climate assessment
- Modest growth — this file is already strong

**Source**: melodic-software strategic-analysis patterns.

---

## Section 3: Document Types, Templates & Registration

### New Document Type Codes

Register in `arckit-claude/config/doc-types.mjs`:

| Code | Name | Category | Multi-instance? | Subdirectory |
|------|------|----------|-----------------|--------------|
| `WDOC` | Wardley Doctrine Assessment | Architecture | No | `wardley-maps/` |
| `WGAM` | Wardley Gameplay Analysis | Architecture | Yes | `wardley-maps/` |
| `WCLM` | Wardley Climate Assessment | Architecture | Yes | `wardley-maps/` |
| `WVCH` | Wardley Value Chain | Architecture | Yes | `wardley-maps/` |

Register in `scripts/bash/generate-document-id.sh`:

- Add `WGAM WCLM WVCH` to `MULTI_INSTANCE_TYPES`

### New Templates

4 new templates in `arckit-claude/templates/` (mirrored to `.arckit/templates/`):

**`wardley-doctrine-template.md`**:

- Document Control, Executive Summary, Strategy Cycle Context
- Doctrine Assessment Matrix (4 phases × 6 categories, 1-5 scoring per principle)
- Phase-by-Phase Analysis (I–IV) with evidence and scores
- Critical Gaps identification
- Implementation Roadmap (immediate 0-3mo / short-term 3-12mo / long-term 12-24mo)
- Recommendations, Traceability, Generation Footer

**`wardley-gameplay-template.md`**:

- Document Control, Executive Summary
- Map Reference (link to WARD artifact)
- Situational Assessment (position, capabilities, market context)
- Play Options organized by 11 categories with D&D alignment
- Play-Position Matrix evaluation
- Play Compatibility Analysis
- Selected Plays with execution steps, success criteria, review points
- Risk Assessment and Anti-patterns
- Case Study References, Traceability, Generation Footer

**`wardley-climate-template.md`**:

- Document Control, Executive Summary
- Map Reference (link to WARD artifact)
- Component Inventory (from WARD)
- Climate Assessment by 6 categories (component, financial, speed, inertia, competitors, prediction)
- Per-Component Impact Matrix (pattern × component)
- Prediction Horizons (6-month, 18-month)
- Wave Analysis (peace/war/wonder positioning)
- Inertia Assessment per component
- Strategic Implications, Traceability, Generation Footer

**`wardley-value-chain-template.md`**:

- Document Control, Executive Summary
- User Need / Anchor definition
- Users and Personas
- Value Chain Diagram (ASCII + OWM notation)
- Component Inventory with visibility scores
- Dependency Matrix
- Critical Path Analysis
- Validation Checklist (completeness, accuracy, usefulness)
- Visibility Assessment (Y-axis positioning guide)
- Assumptions and Open Questions, Traceability, Generation Footer

### Registration Checklist

1. `arckit-claude/config/doc-types.mjs` — add 4 types to `DOC_TYPES`, add `WGAM WCLM WVCH` to `MULTI_INSTANCE_TYPES` set, add all 4 to `SUBDIR_MAP`:

   ```javascript
   'WDOC': { name: 'Wardley Doctrine Assessment',  category: 'Architecture' },
   'WGAM': { name: 'Wardley Gameplay Analysis',     category: 'Architecture' },
   'WCLM': { name: 'Wardley Climate Assessment',    category: 'Architecture' },
   'WVCH': { name: 'Wardley Value Chain',            category: 'Architecture' },
   // MULTI_INSTANCE_TYPES: add 'WGAM', 'WCLM', 'WVCH'
   // SUBDIR_MAP:
   'WDOC': 'wardley-maps',
   'WGAM': 'wardley-maps',
   'WCLM': 'wardley-maps',
   'WVCH': 'wardley-maps',
   ```

2. `scripts/bash/generate-document-id.sh` — add `WGAM WCLM WVCH` to `MULTI_INSTANCE_TYPES`
3. `arckit-claude/hooks/validate-wardley-math.mjs` — extend file filter to scan `-WVCH-` in addition to existing `-WARD-` pattern (only WVCH produces OWM syntax; WDOC/WGAM/WCLM do not need validation)
4. Templates copied to both `arckit-claude/templates/` and `.arckit/templates/`

---

## Section 4: Command Composition & Handoffs

### Workflow

```text
                    ┌──────────────────────┐
                    │ wardley.value-chain   │  (pre-step)
                    │   WVCH artifact       │
                    └────────┬─────────────┘
                             │ handoff
                             ▼
                    ┌──────────────────────┐
                    │    wardley            │  (map creation)
                    │   WARD artifact       │
                    └──┬─────┬────┬────────┘
                       │     │    │  handoffs
              ┌────────┘     │    └────────┐
              ▼              ▼             ▼
    ┌────────────────┐ ┌───────────────┐ ┌────────────────┐
    │wardley.doctrine│ │wardley.climate│ │wardley.gameplay │
    │  WDOC artifact │ │ WCLM artifact │ │ WGAM artifact  │
    └───────┬────────┘ └──────┬────────┘ └──────┬─────────┘
            │                 │                  │
            └─────────┬──────┘                   │
                      ▼                          │
             ┌──────────────┐                    │
             │   wardley     │◄───────────────────┘
             │  (re-run with │
             │  richer context)
             └──────┬───────┘
                    │ existing handoffs
             ┌──────┴──────┐
             ▼             ▼
        /arckit.roadmap  /arckit.strategy
```

### Handoff Declarations

**`wardley.value-chain.md`** frontmatter:

```yaml
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
```

**`wardley.md`** (add new handoffs + fix pre-existing bug: hook references `python3 validate-wardley-math.py` but actual file is `validate-wardley-math.mjs` — change to `node validate-wardley-math.mjs`):

```yaml
handoffs:
  - command: roadmap
    description: Create strategic roadmap from evolution analysis
  - command: strategy
    description: Synthesise Wardley insights into architecture strategy
  - command: research
    description: Research vendors for Custom-Built components
    condition: "Custom-Built components identified that need market research"
  - command: wardley.doctrine
    description: Assess organizational doctrine maturity
  - command: wardley.gameplay
    description: Identify strategic plays from the map
  - command: wardley.climate
    description: Assess climatic patterns affecting components
```

**`wardley.doctrine.md`** frontmatter:

```yaml
handoffs:
  - command: wardley
    description: Create or refine Wardley Map informed by doctrine gaps
    condition: "Doctrine gaps affect component positioning or strategy"
  - command: wardley.gameplay
    description: Select gameplays that address doctrine weaknesses
```

**`wardley.gameplay.md`** frontmatter:

```yaml
handoffs:
  - command: roadmap
    description: Create roadmap to execute selected plays
  - command: strategy
    description: Synthesise gameplay into architecture strategy
  - command: wardley.climate
    description: Validate plays against climatic patterns
    condition: "Climate assessment not yet performed"
```

**`wardley.climate.md`** frontmatter:

```yaml
handoffs:
  - command: wardley.gameplay
    description: Select gameplays informed by climate forces
  - command: wardley
    description: Update map with climate-driven evolution predictions
    condition: "Climate analysis reveals evolution velocity changes"
```

### Prerequisite Reading per Command

| Command | Mandatory | Recommended | Optional |
|---------|-----------|-------------|---------|
| `wardley.value-chain` | REQ | STKE | PRIN |
| `wardley` (existing) | PRIN, REQ | STKE, RSCH, WVCH | WDOC, WCLM, DATA, TCOP |
| `wardley.doctrine` | PRIN | WARD, STKE | REQ |
| `wardley.gameplay` | WARD | WCLM, WDOC | RSCH, PRIN |
| `wardley.climate` | WARD | REQ, RSCH | WDOC, PRIN |

### Composition Principle

Every command works standalone (produces useful output without siblings) but gets richer when related artifacts exist (reads them from `wardley-maps/` directory if present).

---

## Section 5: Converter & Multi-AI Impact

### Dot-Namespaced Filenames Through the Converter

The converter uses `base_name = filename.replace(".md", "")`. For `wardley.doctrine.md`:

| Target | Output Filename | Invocation |
|--------|----------------|------------|
| Claude Code | `wardley.doctrine.md` (source) | `/arckit.wardley.doctrine` |
| Codex CLI | `arckit.wardley.doctrine.md` | `$arckit-wardley.doctrine` |
| Codex Extension | `skills/arckit-wardley.doctrine/SKILL.md` | Skill auto-discovery |
| OpenCode CLI | `arckit.wardley.doctrine.md` | `/arckit.wardley.doctrine` |
| Gemini CLI | `wardley.doctrine.toml` | `/arckit:wardley.doctrine` |
| Copilot | `arckit-wardley.doctrine.prompt.md` | `/arckit-wardley.doctrine` |

**Note on dot-namespacing**: This is the first use of dots in command filenames in ArcKit. All 60 existing commands use flat names with hyphens. The following converter code paths must be validated for all 5 AI targets.

### Automatic Handling (No Converter Changes)

- Reference file copying: `copy_extension_files()` already handles `references/`
- Template copying: `copy_extension_files()` already handles `templates/`
- New commands: converter processes all `.md` files in `commands/` automatically
- `base_name = filename.replace(".md", "")` correctly produces `wardley.doctrine` etc.

### Required Converter Changes

| Change | Scope | Detail |
|--------|-------|--------|
| **`rewrite_codex_skills()` regexes** | **Critical** | Three regexes in this function use `[\w-]*` which stops at dots. All three must update their character class to `[\w.-]*`: (1) colon-format `r"/arckit:(\w[\w-]*)"`, (2) dot-format `r"(?<=\s)/arckit\.(\w[\w-]*)"`, (3) prompts-format `r"/prompts:arckit\.(\w[\w-]*)"`. Without this fix, cross-references like `/arckit:wardley.doctrine` would only capture `wardley` |
| **Gemini TOML filenames** | Verify | `wardley.doctrine.toml` — verify Gemini CLI loads TOML files with dots. If not, map dots to hyphens for Gemini target only |
| **Copilot prompt filenames** | Verify | `arckit-wardley.doctrine.prompt.md` — verify VS Code prompt discovery handles dots before `.prompt.md` |
| **Codex skill directory names** | Verify | `skills/arckit-wardley.doctrine/SKILL.md` — verify Codex discovers skill directories with dots |
| **Copilot `agent:` field references** | Verify | Cross-command references in `.agent.md` files if they reference dot-namespaced commands |
| `generate-document-id.sh` | Required | Add new types before running converter |

### Agent Consideration

None of the 4 new commands require agents. They read local artifacts and reference files, then produce documents. No heavy web research (>10 WebSearch/WebFetch calls). Fully portable across all 5 AI targets.

---

## Section 6: Documentation Updates

### Files Requiring Updates

| File | What Changes |
|------|-------------|
| `README.md` | Add 4 new commands to command table, update count 60→64, add Wardley suite description |
| `docs/README.md` | Add 4 new commands to documentation index |
| `docs/index.html` | Add 4 new commands to GitHub Pages searchable command reference |
| `docs/DEPENDENCY-MATRIX.md` | Add 4 new commands with prerequisite/output dependencies |
| `docs/WORKFLOW-DIAGRAMS.md` | Add Wardley suite workflow diagram |
| `CHANGELOG.md` | Document new commands and reference enhancements |
| `arckit-claude/CHANGELOG.md` | Plugin-specific changelog entry |

### New Guide Files

4 new usage guides in `docs/guides/` (mirrored to `arckit-claude/guides/`):

| Guide | Content |
|-------|---------|
| `wardley-doctrine.md` | When to use, prerequisites, scoring system, example output, integration with other Wardley commands |
| `wardley-gameplay.md` | When to use, requires WARD artifact, 11 gameplay categories, D&D alignment system, play selection example |
| `wardley-climate.md` | When to use, 6 pattern categories overview, impact matrix reading guide, prediction horizons |
| `wardley-value-chain.md` | When to use, anchor identification, decomposition process, feeds into `/arckit.wardley` |

### Existing Guide Updates

| Guide | Changes |
|-------|---------|
| `docs/guides/wardley.md` | Add Wardley suite overview section, recommended workflow order, links to new commands |

### Count Updates

| File | Change |
|------|--------|
| `README.md` | Command count 60→64 |
| `docs/index.html` | Command count in header |

---

## Content Sources

| Source | Used For |
|--------|----------|
| `research/Introduction to Wardley Mapping Doctrine.md` (~283K) | doctrine.md reference, wardley.doctrine command, doctrine template |
| `research/Introduction to Wardley Mapping Gameplays.md` (~484K) | gameplay-patterns.md reference, wardley.gameplay command, gameplay template |
| `research/Introduction to Wardley Mapping Climatic Patterns - Kindle - v1.0.1.md` (~357K) | climatic-patterns.md reference, wardley.climate command, climate template |
| melodic-software/claude-code-plugins wardley-mapping skill | Value chain methodology, evolution-analysis indicators, strategic-plays catalog structure, play-position matrix, doctrine-advisor scoring pattern |

## Implementation Order

1. **Reference files** — Enrich all 6 reference files (foundation for everything else)
2. **Doc types & templates** — Register WVCH, WDOC, WGAM, WCLM; create 4 templates
3. **Commands** — Create 4 new command files, update existing wardley.md handoffs
4. **Converter** — Verify dot-naming works across targets, run converter
5. **Documentation** — README, guides, index.html, DEPENDENCY-MATRIX, WORKFLOW-DIAGRAMS, CHANGELOGs
6. **Testing** — Run commands in a test repo, verify artifacts, check converter output

## Design Decisions

1. **Doctrine re-assessment**: Yes — `wardley.doctrine` reads existing WDOC if present and produces score comparison with trend indicators. Template includes "Previous Assessment Comparison" section.
2. **Hook extension**: Yes — `validate-wardley-math.mjs` must extend its file filter to scan for `-WVCH-` files in addition to `-WARD-`. Other new types (WDOC, WGAM, WCLM) do not produce OWM syntax and don't need validation.
3. **Reference file content**: Distilled summaries, not verbatim book content. Target line counts (~400, ~600, ~500 lines) keep token cost manageable while capturing all patterns, categories, and key examples. Full book text stays in `research/` for human reference.
