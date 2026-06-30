# ArcKit TOGAF ADM + Agent Architecture Plugins — Implementation Plan

> **For Hermes:** Use subagent-driven-development to execute tasks. Each task = one command/template/recipe component.

**Goal:** Implement two new ArcKit plugin overlays — `arckit-togaf-adm` (enterprise architecture governance via TOGAF ADM) and `arckit-agent-architecture` (AI agent governance dimension) — that compose on the existing ArcKit foundation.

**Architecture:** Both plugins follow the proven ArcKit overlay pattern: Claude Code plugins with commands, templates, recipes, and references. They register as community overlays (like `arckit-us`, `arckit-eu`) with `[COMMUNITY]` prefix and dependency on core `arckit`. Non-Claude extensions generated via `scripts/converter.py`.

**Tech Stack:** Markdown commands, YAML recipes, Mermaid diagrams, Python CLI scaffolding, Claude Code plugin manifest.

---

## Architecture

### Plugin Layout

```
plugins/
├── arckit-togaf-adm/                    # TOGAF ADM overlay (Phase A-H + Preliminary)
│   ├── README.md                        # Plugin description, install, recipe
│   ├── CHANGELOG.md
│   ├── VERSION
│   ├── .claude-plugin/
│   │   └── plugin.json                 # Plugin manifest (name, dependencies, userConfig)
│   ├── commands/                        # 9 ADM commands
│   │   ├── adm-preliminary.md           # Preliminary: scope, drivers, vision
│   │   ├── business-capability-map.md   # Phase A: capability hierarchy, value streams
│   │   ├── application-inventory.md    # Phase B: application catalog
│   │   ├── application-rationalization.md  # Phase B: keep/merge/replace/retire
│   │   ├── gap-analysis.md              # Phase E: capability matrix, gap severity
│   │   ├── transition-architecture.md  # Phase F: work packages, transition specs
│   │   ├── architecture-board.md      # Phase G: board charter, compliance
│   │   ├── architecture-change.md     # Phase H: change requests, ADM re-entry
│   │   └── architecture-repository.md # Repository: patterns, standards, lessons
│   ├── templates/                       # 9 templates + partials
│   │   ├── adm-preliminary-template.md
│   │   ├── capability-map-template.md
│   │   ├── application-inventory-template.md
│   │   ├── rationalization-template.md
│   │   ├── gap-analysis-template.md
│   │   ├── transition-architecture-template.md
│   │   ├── architecture-board-template.md
│   │   ├── architecture-change-template.md
│   │   ├── architecture-repository-template.md
│   │   └── _partials/
│   │       ├── document-control-uk.md  # Reuse from core
│   │       └── rendering.md
│   ├── references/
│   │   └── togaf-adm-reference.md     # TOGAF ADM phase descriptions, artefact types
│   └── recipes/
│       └── togaf-adm-full.yaml        # Full ADM cycle recipe
│
└── arckit-agent-architecture/          # AI Agent Architecture overlay
    ├── README.md
    ├── CHANGELOG.md
    ├── VERSION
    ├── .claude-plugin/
    │   └── plugin.json
    ├── commands/
    │   ├── agent-inventory.md        # Catalog existing agents
    │   ├── agent-design.md           # Agent architecture specification
    │   ├── agent-governance.md       # Guardrails, audit, human oversight
    │   ├── agent-integration.md     # Multi-agent orchestration contracts
    │   ├── agent-security.md        # Sandboxing, permissions, injection
    │   └── agent-maturity.md        # Maturity model for AI agent programs
    ├── templates/
    │   ├── agent-inventory-template.md
    │   ├── agent-design-template.md
    │   ├── agent-governance-template.md
    │   ├── agent-integration-template.md
    │   ├── agent-security-template.md
    │   └── agent-maturity-template.md
    ├── references/
    │   └── agent-architecture-reference.md
    └── recipes/
        └── agent-architecture.yaml  # Agent architecture recipe
```

### New Doc Type Codes

| Code | Artifact | Plugin |
|------|----------|--------|
| `ADMP` | ADM Preliminary (Architecture Vision) | togaf-adm |
| `BPCM` | Business Capability Map | togaf-adm |
| `APP`  | Application Inventory | togaf-adm |
| `APPR` | Application Rationalization | togaf-adm |
| `GAPA` | Gap Analysis | togaf-adm |
| `TRANS`| Transition Architecture | togaf-adm |
| `BORD` | Architecture Board | togaf-adm |
| `ACHG` | Architecture Change | togaf-adm |
| `REPO` | Architecture Repository | togaf-adm |
| `AAGI` | Agent Inventory | agent-architecture |
| `AAGR` | Agent Design/Spec | agent-architecture |
| `AAOV` | Agent Governance | agent-architecture |
| `AAIN` | Agent Integration | agent-architecture |
| `AASE` | Agent Security | agent-architecture |
| `AAMT` | Agent Maturity | agent-architecture |

### Composition Model

```
arckit (core — 75 commands)
├── arckit-togaf-adm (community overlay — 9 commands, depends: arckit)
│   └── recipe: togaf-adm-full (composes core commands + ADM commands)
├── arckit-agent-architecture (community overlay — 6 commands, depends: arckit)
│   └── recipe: agent-architecture (composes agent commands + ADRs + governance)
├── arckit-us (existing — composes with togaf-adm optionally)
├── arckit-eu (existing — composes with togaf-adm optionally)
└── ... (11 existing overlays)
```

**Key integration points:**
- `gap-analysis` reads `PRIN`, `REQ`, `STKE`, `WARD` from existing commands (same pattern as `strategy`)
- `transition-architecture` extends `roadmap` output — reads `ARC-*-ROAD-*.md` as input
- `architecture-board` complements `hld-review` — adds governance structure to existing review checklists
- `agent-inventory` can layer on `application-inventory` (agents as a subset of applications)
- Both plugins' recipes compose with `uk-saas.yaml` and other jurisdiction recipes via optional targets

### Command Design Pattern

Every command follows the existing ArcKit pattern:

1. **Frontmatter**: `description`, `argument-hint`, `effort`, `handoffs`
2. **Prerequisites**: MANDATORY (stop if missing), RECOMMENDED (note if missing), OPTIONAL (skip silently)
3. **Template**: Read from `${CLAUDE_PLUGIN_ROOT}/templates/` with `.arckit/templates/` override
4. **Generation**: Synthesise from existing artifacts, generate document with Mermaid diagrams
5. **Quality**: Read `references/quality-checklist.md` before writing
6. **Output**: `ARC-{PROJECT_ID}-{TYPE}-v{VERSION}.md`
7. **Summary**: Concise summary table to user, not full document

---

## Implementation Plan

### Phase 1: Plugin Scaffolding (Tasks 1-4)

Set up both plugin directories, manifests, and infrastructure.

#### Task 1: Create `arckit-togaf-adm` plugin skeleton

**Files:**
- Create: `plugins/arckit-togaf-adm/README.md`
- Create: `plugins/arckit-togaf-adm/CHANGELOG.md`
- Create: `plugins/arckit-togaf-adm/VERSION`
- Create: `plugins/arckit-togaf-adm/.claude-plugin/plugin.json`
- Create: `plugins/arckit-togaf-adm/commands/.gitkeep`
- Create: `plugins/arckit-togaf-adm/templates/.gitkeep`
- Create: `plugins/arckit-togaf-adm/references/togaf-adm-reference.md`
- Create: `plugins/arckit-togaf-adm/recipes/.gitkeep`

**Steps:**
1. Copy `plugins/arckit-us/.claude-plugin/plugin.json` as template, modify:
   - `name: arckit-togaf-adm`
   - `description: "TOGAF ADM — Enterprise Architecture Development Method for AI-assisted governance"`
   - `defaultEnabled: false`
   - `requires: [{name: arckit, version: ">=5.15.0"}]`
2. Write `VERSION` = `1.0.0`
3. Write `CHANGELOG.md` with v1.0.0 entry
4. Write `README.md` with plugin overview, 9 commands, recipe, install instructions
5. Write `togaf-adm-reference.md` with TOGAF ADM phase descriptions, artefact types, viewpoints

**Verify:** `cat plugins/arckit-togaf-adm/.claude-plugin/plugin.json | python3 -m json.tool`

#### Task 2: Create `arckit-agent-architecture` plugin skeleton

**Files:**
- Create: `plugins/arckit-agent-architecture/README.md`
- Create: `plugins/arckit-agent-architecture/CHANGELOG.md`
- Create: `plugins/arckit-agent-architecture/VERSION`
- Create: `plugins/arckit-agent-architecture/.claude-plugin/plugin.json`
- Create: `plugins/arckit-agent-architecture/commands/.gitkeep`
- Create: `plugins/arckit-agent-architecture/templates/.gitkeep`
- Create: `plugins/arckit-agent-architecture/references/agent-architecture-reference.md`
- Create: `plugins/arckit-agent-architecture/recipes/.gitkeep`

**Steps:**
1. Copy plugin.json pattern from Task 1:
   - `name: arckit-agent-architecture`
   - `description: "AI Agent Architecture — Governance, design, and security for autonomous AI agent programs"`
   - `requires: [{name: arckit, version: ">=5.15.0"}]`
2. Write `VERSION` = `1.0.0`
3. Write remaining files following Task 1 pattern
4. Write `agent-architecture-reference.md` with agent design patterns, security models, governance frameworks

**Verify:** `cat plugins/arckit-agent-architecture/.claude-plugin/plugin.json | python3 -m json.tool`

#### Task 3: Create quality checklists for both plugins

**Files:**
- Create: `plugins/arckit-togaf-adm/references/quality-checklist.md`
- Create: `plugins/arckit-agent-architecture/references/quality-checklist.md`

**Steps:**
1. Read `plugins/arckit-us/references/quality-checklist.md` as template
2. Add new type codes (ADMP, BPCM, APP, APPR, GAPA, TRANS, BORD, ACHG, REPO for togaf; AAGI, AAGR, AAOV, AAIN, AASE, AAMT for agent)
3. Each type: required sections, Mermaid diagram requirements, traceability checks, citation checks
4. Include common checks (document control, versioning, markdown escaping)

**Verify:** Checklist covers all 15 new doc types with type-specific checks

#### Task 4: Register plugins in marketplace catalog

**Files:**
- Modify: `.claude-plugin/marketplace.json`

**Steps:**
1. Read `.claude-plugin/marketplace.json`
2. Add `arckit-togaf-adm` and `arckit-agent-architecture` to the plugins array
3. Include: name, path, version, description, dependency, `community: true`
4. Update README.md main plugin count if needed

**Verify:** `python3 -c "import json; json.load(open('.claude-plugin/marketplace.json'))"` (valid JSON)

### Phase 2: TOGAF ADM Commands (Tasks 5-13)

#### Task 5: `adm-preliminary` — Architecture Vision & Scope

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/adm-preliminary.md`
- Create: `plugins/arckit-togaf-adm/templates/adm-preliminary-template.md`

**Steps:**
1. Write template: Architecture Vision document structure — scope, drivers, constraints, resources, stakeholders, high-level architecture landscape, success criteria
2. Write command:
   - Prerequisites: PRIN (mandatory), STKE (recommended)
   - Generates `ARC-{P}-ADMP-v1.0.md` in project directory
   - Sections: Vision statement, scope boundaries, stakeholders (from STKE), drivers/constraints, success criteria, high-level context diagram (Mermaid C4 Container)
   - Handoffs: `business-capability-map`, `gap-analysis`
3. Template includes TOGAF ADM Preliminary artefacts: Architecture Vision, Scope Document

**Verify:** Template renders document control correctly with ADMP type code

#### Task 6: `business-capability-map` — Phase A Business Architecture

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/business-capability-map.md`
- Create: `plugins/arckit-togaf-adm/templates/capability-map-template.md`

**Steps:**
1. Write template: Business Capability Map — hierarchical capability model (Level 1: domains, Level 2: sub-capabilities, Level 3: detailed capabilities), value stream mapping, capability maturity scoring (L1-L5), capability-requirement traceability
2. Write command:
   - Prerequisites: ADMP (mandatory), REQ (recommended), STKE (recommended)
   - Generates `ARC-{P}-BPCM-v1.0.md`
   - Sections: Capability hierarchy (Mermaid mindmap or flowchart), value streams (Mermaid flowchart with swimlanes), capability maturity assessment, capability-to-requirement traceability matrix, value stream analysis
   - Interactive: AskUserQuestion for capability domain scope and depth level
   - Handoffs: `gap-analysis`, `application-inventory`

**Verify:** Template produces 3-level capability hierarchy with Mermaid diagram

#### Task 7: `application-inventory` — Application Catalog

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/application-inventory.md`
- Create: `plugins/arckit-togaf-adm/templates/application-inventory-template.md`

**Steps:**
1. Write template: Application Inventory — catalog of existing/pipeline applications with strategic fit scoring (strategic/critical/support/replace), technology stack, owner, lifecycle status, dependencies, risk profile
2. Write command:
   - Prerequisites: ADMP (mandatory), BPCM (recommended), REQ (recommended)
   - Generates `ARC-{P}-APP-v1.0.md`
   - Sections: Application register (table), strategic fit matrix, technology landscape heatmap (Mermaid quadrant chart), dependency map (Mermaid flowchart), application-to-capability mapping, lifecycle timeline
   - Interactive: AskUserQuestion for inventory scope (all org, specific portfolio, project scope)
   - Handoffs: `application-rationalization`, `gap-analysis`

**Verify:** Template includes strategic fit scoring with keep/merge/replace/retire decision framework

#### Task 8: `application-rationalization` — Application Portfolio Decisions

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/application-rationalization.md`
- Create: `plugins/arckit-togaf-adm/templates/rationalization-template.md`

**Steps:**
1. Write template: Rationalization decisions — for each application: strategic fit assessment, overlap analysis, integration complexity, TCO analysis, recommendation rationale, migration approach (lift-shift/replatform/refactor/retire), timeline
2. Write command:
   - Prerequisites: APP (mandatory — inventory must exist), BPCM (recommended), ADR-* (recommended)
   - Generates `ARC-{P}-APPR-v1.0.md`
   - Sections: Rationalization summary, per-application decisions (Keep/Merge/Replace/Retire), portfolio target state, consolidation benefits, risk register for changes, implementation sequencing
   - Handoffs: `gap-analysis`, `transition-architecture`

**Verify:** Template links to APP inventory by application ID for traceability

#### Task 9: `gap-analysis` — Phase E Gap Analysis

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/gap-analysis.md`
- Create: `plugins/arckit-togaf-adm/templates/gap-analysis-template.md`

**Steps:**
1. Write template: Gap Analysis — capability matrix (current vs target), gap severity scoring (size × urgency), gap-to-workstream mapping, risk register for unmitigated gaps
2. Write command:
   - Prerequisites: BPCM (mandatory — capabilities), APP (recommended), STRAT (recommended), PRIN (recommended)
   - Generates `ARC-{P}-GAPA-v1.0.md`
   - Sections: Capability gap matrix (table: capability, current state, target state, gap severity, workstream), gap heatmap (Mermaid quadrant chart by size vs urgency), workstream mapping, risk register, assumptions and constraints
   - Interactive: AskUserQuestion for gap severity weighting (balanced/strategic-risk/operational)
   - Handoffs: `transition-architecture`, `architecture-board`

**Verify:** Template produces capability gap matrix with severity ratings from existing capability maturity scores

#### Task 10: `transition-architecture` — Phase F Migration Planning

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/transition-architecture.md`
- Create: `plugins/arckit-togaf-adm/templates/transition-architecture-template.md`

**Steps:**
1. Write template: Transition Architecture — Architecture 2/N specifications, work packages with deliverables, resource requirements, migration dependencies, acceptance criteria, cost estimates
2. Write command:
   - Prerequisites: GAPA (mandatory), ROAD (recommended — extends roadmap), APPR (recommended), ADR-* (recommended)
   - Generates `ARC-{P}-TRANS-v1.0.md`
   - Sections: Transition architecture overview, work packages (numbered, with scope, deliverables, dependencies, resources, timeline), Architecture 2/3/4 specifications, migration dependencies (Mermaid flowchart), resource plan, risk and contingency plan, acceptance criteria per work package
   - Interactive: AskUserQuestion for number of transition architectures and wave granularity
   - Handoffs: `architecture-board`, `architecture-change`

**Verify:** Template breaks roadmap themes into numbered work packages with acceptance criteria

#### Task 11: `architecture-board` — Phase G Governance

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/architecture-board.md`
- Create: `plugins/arckit-togaf-adm/templates/architecture-board-template.md`

**Steps:**
1. Write template: Architecture Board — board charter, membership, decision framework, compliance scorecard, exception process, review cadence, escalation path
2. Write command:
   - Prerequisites: PRIN (mandatory), ADMP (recommended), HLD or REQ (recommended)
   - Generates `ARC-{P}-BORD-v1.0.md`
   - Sections: Board charter (purpose, scope, authority), membership (roles, quorum), decision framework (voting, consensus, escalation), compliance scorecard (current state per principle/domain), exception process (request, review, approve/deny, appeal), review cadence (monthly ARB, quarterly programme board), decision register template
   - Handoffs: `architecture-change`

**Verify:** Template includes compliance scorecard that references existing principles (PRIN)

#### Task 12: `architecture-change` — Phase H Change Management

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/architecture-change.md`
- Create: `plugins/arckit-togaf-adm/templates/architecture-change-template.md`

**Steps:**
1. Write template: Architecture Change Request — change type (evolutionary/transformational/corrective), impact assessment (scope, cost, risk, schedule), affected artefacts, ADM cycle re-entry point, approval workflow
2. Write command:
   - Prerequisites: BORD (recommended), existing project artefacts
   - Generates `ARC-{P}-ACHG-v1.0.md` (multi-instance: `ACHG-001`, `ACHG-002`, etc.)
   - Sections: Change request ID, change type, rationale, impact assessment (capability, application, technology, governance), affected artefacts list, ADM re-entry point (which phase), cost/benefit, risk assessment, approval workflow, implementation plan link
   - Handoffs: back to `adm-preliminary` (if scope change), `transition-architecture`, `gap-analysis`

**Verify:** Template produces multi-instance change requests with unique IDs and ADM cycle re-entry mapping

#### Task 13: `architecture-repository` — Architecture Content Framework

**Files:**
- Create: `plugins/arckit-togaf-adm/commands/architecture-repository.md`
- Create: `plugins/arckit-togaf-adm/templates/architecture-repository-template.md`

**Steps:**
1. Write template: Architecture Repository — patterns library, standards register, reference architectures, lessons learned, reusable building blocks
2. Write command:
   - Prerequisites: PRIN (mandatory), ADR-* (recommended), all project artefacts (read-only synthesis)
   - Generates `projects/000-global/ARC-000-REPO-v1.0.md` (global scope)
   - Sections: Standards register (from PRIN + ADR), patterns library (reusable solutions from projects), reference architectures (from DIAG artefacts), lessons learned (from STORY/ANALYZE), reusable building blocks catalog, search/index
   - Handoffs: None (terminal — feeds back into ADM cycle via standards/patterns)

**Verify:** Template aggregates from cross-project artefacts in `000-global/`

### Phase 3: Agent Architecture Commands (Tasks 14-19)

#### Task 14: `agent-inventory` — AI Agent Catalog

**Files:**
- Create: `plugins/arckit-agent-architecture/commands/agent-inventory.md`
- Create: `plugins/arckit-agent-architecture/templates/agent-inventory-template.md`

**Steps:**
1. Write template: Agent Inventory — agent name, purpose, model/LLM, tools/MCPs, memory, orchestration pattern, deployment, data access, risk level
2. Write command:
   - Prerequisites: ADMP or APP (recommended — inherits from TOGAF if available)
   - Generates `ARC-{P}-AAGI-v1.0.md`
   - Sections: Agent register (table), capability matrix, dependency map (Mermaid flowchart), lifecycle status, security classification, human oversight level
   - Handoffs: `agent-design`, `agent-security`

**Verify:** Template includes security classification and oversight level per agent

#### Task 15: `agent-design` — Agent Architecture Specification

**Files:**
- Create: `plugins/arckit-agent-architecture/commands/agent-design.md`
- Create: `plugins/arckit-agent-architecture/templates/agent-design-template.md`

**Steps:**
1. Write template: Agent Design — architecture pattern (single/chain/multi-agent), tool contract (MCP specs), memory design (session/durable/vector), skills, orchestration (LangGraph/CrewAI/etc.), guardrails
2. Write command:
   - Prerequisites: AAGI (recommended), REQ or PRIN (recommended)
   - Generates `ARC-{P}-AAGR-v1.0.md`
   - Sections: Agent architecture overview, component diagram (Mermaid C4), tool contract matrix, memory architecture, orchestration design, skill set, guardrail configuration, testing strategy
   - Handoffs: `agent-integration`, `agent-security`

**Verify:** Template produces component diagram with Mermaid C4 notation

#### Task 16: `agent-governance` — AI Agent Guardrails & Oversight

**Files:**
- Create: `plugins/arckit-agent-architecture/commands/agent-governance.md`
- Create: `plugins/arckit-agent-architecture/templates/agent-governance-template.md`

**Steps:**
1. Write template: Agent Governance — oversight model (human-in-loop/on-loop/out-of-loop), approval workflows, audit trail requirements, escalation procedures, performance monitoring, incident response
2. Write command:
   - Prerequisites: AAGI or AAGR (recommended), PRIN (recommended), BORD (recommended if available)
   - Generates `ARC-{P}-AAOV-v1.0.md`
   - Sections: Oversight model, approval matrix (by risk tier), audit requirements, monitoring KPIs, escalation procedures, incident response plan, compliance mapping (UK AI Playbook, EU AI Act, NIST AI RMF if applicable)
   - Handoffs: `agent-security`

**Verify:** Template includes risk-tiered approval matrix and compliance mapping hooks

#### Task 17: `agent-integration` — Multi-Agent Orchestration

**Files:**
- Create: `plugins/arckit-agent-architecture/commands/agent-integration.md`
- Create: `plugins/arckit-agent-architecture/templates/agent-integration-template.md`

**Steps:**
1. Write template: Agent Integration — inter-agent contracts, message protocols, shared state management, API gateways, failure isolation
2. Write command:
   - Prerequisites: AAGR (mandatory — at least one agent design), AAGI (recommended)
   - Generates `ARC-{P}-AAIN-v1.0.md`
   - Sections: Integration architecture, inter-agent contracts (interface specs), message protocol (event stream/queue/gRPC), shared state design, failure isolation boundaries (Mermaid sequence diagram), observability design
   - Handoffs: `agent-governance`, `agent-security`

**Verify:** Template includes inter-agent contract matrix and sequence diagram

#### Task 18: `agent-security` — AI Agent Security & Sandboxing

**Files:**
- Create: `plugins/arckit-agent-architecture/commands/agent-security.md`
- Create: `plugins/arckit-agent-architecture/templates/agent-security-template.md`

**Steps:**
1. Write template: Agent Security — sandboxing model, tool permissions, data handling, prompt injection defences, output validation, secret management
2. Write command:
   - Prerequisites: AAGI or AAGR (recommended), SEC or SBD (recommended — existing secure-by-design)
   - Generates `ARC-{P}-AASE-v1.0.md`
   - Sections: Threat model (Mermaid attack surface diagram), sandboxing architecture, tool permission matrix, data handling policy, prompt injection defences, output validation pipeline, secret management, incident response
   - Handoffs: `agent-governance`

**Verify:** Template includes threat model and permission matrix

#### Task 19: `agent-maturity` — AI Agent Program Maturity Model

**Files:**
- Create: `plugins/arckit-agent-architecture/commands/agent-maturity.md`
- Create: `plugins/arckit-agent-architecture/templates/agent-maturity-template.md`

**Steps:**
1. Write template: Agent Maturity Model — 5 levels (Ad-hoc → Reactive → Defined → Managed → Optimized) across dimensions: design, governance, security, integration, operations
2. Write command:
   - Prerequisites: AAGI or AAGR (recommended), maturity-model output from core (recommended)
   - Generates `ARC-{P}-AAMT-v1.0.md`
   - Sections: Maturity model framework, current state assessment, target state, improvement roadmap, benchmarks against industry standards
   - Handoffs: `agent-design`, `agent-governance`

**Verify:** Template produces 5×5 maturity matrix (5 dimensions × 5 levels)

### Phase 4: Recipes (Tasks 20-21)

#### Task 20: `togaf-adm-full.yaml` recipe

**Files:**
- Create: `plugins/arckit-togaf-adm/recipes/togaf-adm-full.yaml`

**Steps:**
1. Read `plugins/arckit-claude/skills/arckit-build/recipes/uk-saas.yaml` as reference
2. Write recipe following schema v1:
   - **Wave 0 (Foundation)**: PRIN, GLOSSARY (from core)
   - **Wave 1 (Scope)**: ADMP (depends: PRIN), BPCM (depends: ADMP)
   - **Wave 2 (Inventory)**: APP (depends: ADMP, BPCM), APPR (depends: APP, BPCM)
   - **Wave 3 (Gap)**: GAPA (depends: BPCM, APP, APPR, STRAT)
   - **Wave 4 (Transition)**: TRANS (depends: GAPA, ROAD, APPR)
   - **Wave 5 (Governance)**: BORD (depends: PRIN, ADMP), ACHG (depends: BORD, optional targets)
   - **Wave 6 (Repository)**: REPO (depends: PRIN, all ADR)
   - Optional targets: BORD, ACHG (enabled with `--enable`)
   - Post-build hooks: `arckit:health`, `arckit:traceability`
3. Variable substitution: `{P}`, `{NAME}`, `{V}`

**Verify:** `python3 -c "import yaml; yaml.safe_load(open('plugins/arckit-togaf-adm/recipes/togaf-adm-full.yaml'))"`

#### Task 21: `agent-architecture.yaml` recipe

**Files:**
- Create: `plugins/arckit-agent-architecture/recipes/agent-architecture.yaml`

**Steps:**
1. Write recipe following schema v1:
   - **Wave 0**: AAGI (depends: PRIN or ADMP)
   - **Wave 1**: AAGR (depends: AAGI), AAIN (depends: AAGR)
   - **Wave 2**: AAOV (depends: AAGR, AAGI), AASE (depends: AAGR, AAGI)
   - **Wave 3**: AAMT (depends: AAGR, AAOV, AASE)
   - Optional targets: AAMT, AAIN (enabled with `--enable`)
   - Post-build hooks: `arckit:health`, `arckit:pages`
2. Include `defaults` with version
3. Variable substitution: `{P}`, `{NAME}`, `{V}`

**Verify:** `python3 -c "import yaml; yaml.safe_load(open('plugins/arckit-agent-architecture/recipes/agent-architecture.yaml'))"`

### Phase 5: Integration & Conversion (Tasks 22-24)

#### Task 22: Update converter.py for new plugins

**Files:**
- Modify: `scripts/converter.py`

**Steps:**
1. Read `scripts/converter.py` to understand plugin discovery
2. Ensure `arckit-togaf-adm` and `arckit-agent-architecture` are discovered by the converter
3. If converter iterates plugin directories, no change needed — it discovers all `plugins/arckit-*/` directories
4. If hardcoded, add both plugin names to the discovery list
5. Test: run `python3 scripts/converter.py` and verify both plugins generate output in `extensions/`

**Verify:** `ls extensions/arckit-codex/commands/ | grep -E "togaf|agent-"` shows new commands

#### Task 23: Create combined `togaf-agent-full` composition recipe

**Files:**
- Create: `plugins/arckit-togaf-adm/recipes/togaf-agent-full.yaml`

**Steps:**
1. Write composition recipe that chains `togaf-adm-full` then `agent-architecture`
2. Agent inventory can read from application inventory (composition: AAGI depends on APP)
3. Agent governance can compose with architecture board (AAOV depends on BORD)
4. This is the "full enterprise + AI agent" recipe for users who want both dimensions

**Verify:** `python3 -c "import yaml; yaml.safe_load(open('plugins/arckit-togaf-adm/recipes/togaf-agent-full.yaml'))"`

#### Task 24: Update main README.md and documentation

**Files:**
- Modify: `README.md`
- Create: `docs/guides/togaf-adm-overlay.md`
- Create: `docs/guides/agent-architecture-overlay.md`

**Steps:**
1. Add TOGAF ADM section to README.md (after existing overlay sections):
   - Description: TOGAF ADM enterprise architecture governance overlay
   - 9 commands table with descriptions
   - Install: `claude plugin install arckit arckit-togaf-adm`
2. Add Agent Architecture section:
   - 6 commands table
   - Install: `claude plugin install arckit arckit-agent-architecture`
3. Write guides following `docs/guides/uae-overlay.md` pattern
4. Document composition: `togaf-agent-full` recipe for combined use
5. Document `[COMMUNITY]` status and co-maintainer recruitment

**Verify:** `npx markdownlint-cli2 "README.md" --fix` passes

### Phase 6: Testing & Validation (Tasks 25-27)

#### Task 25: Test CLI conversion

**Steps:**
1. Run `python3 scripts/converter.py`
2. Verify all 15 new commands appear in generated extensions:
   - `extensions/arckit-codex/commands/`
   - `extensions/arckit-gemini/commands/`
   - `extensions/arckit-opencode/commands/`
   - `extensions/arckit-copilot/commands/`
3. Verify user_config placeholder rewriting works for non-Claude formats
4. Verify Copilot slash command rewriting (`/arckit:` → `/arckit-`)

**Verify:** `find extensions/ -name "*togaf*" -o -name "*agent-*"` counts = 15 commands × 5 extensions = 75 files (or fewer if some formats skip)

#### Task 26: Validate recipe YAML

**Steps:**
1. Validate all 3 recipes parse correctly:
   ```bash
   for r in plugins/arckit-togaf-adm/recipes/*.yaml plugins/arckit-agent-architecture/recipes/*.yaml; do
     python3 -c "import yaml; yaml.safe_load(open('$r'))" && echo "$r: OK"
   done
   ```
2. Verify target dependencies are acyclic (no circular deps)
3. Verify all target `skill:` references exist (core commands or new commands)

**Verify:** All recipes parse + no circular dependency warnings

#### Task 27: End-to-end documentation validation

**Steps:**
1. `npx markdownlint-cli2 "**/*.md"` — all new files pass lint
2. Verify all templates render correctly (no unclosed YAML frontmatter, valid Mermaid syntax references)
3. Cross-check: every command references its template, template references its quality checklist section
4. Verify README.md plugin count is updated

**Verify:** Zero markdownlint errors, all templates have valid frontmatter

---

## Target File Structure (After Implementation)

```
plugins/
├── arckit-togaf-adm/
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── VERSION
│   ├── .claude-plugin/plugin.json
│   ├── commands/                    # 9 files
│   │   ├── adm-preliminary.md
│   │   ├── business-capability-map.md
│   │   ├── application-inventory.md
│   │   ├── application-rationalization.md
│   │   ├── gap-analysis.md
│   │   ├── transition-architecture.md
│   │   ├── architecture-board.md
│   │   ├── architecture-change.md
│   │   └── architecture-repository.md
│   ├── templates/                   # 9 + partials
│   │   ├── adm-preliminary-template.md
│   │   ├── capability-map-template.md
│   │   ├── application-inventory-template.md
│   │   ├── rationalization-template.md
│   │   ├── gap-analysis-template.md
│   │   ├── transition-architecture-template.md
│   │   ├── architecture-board-template.md
│   │   ├── architecture-change-template.md
│   │   ├── architecture-repository-template.md
│   │   └── _partials/               # Reuse from core
│   ├── references/
│   │   ├── togaf-adm-reference.md
│   │   └── quality-checklist.md
│   └── recipes/
│       ├── togaf-adm-full.yaml
│       └── togaf-agent-full.yaml
│
└── arckit-agent-architecture/
    ├── README.md
    ├── CHANGELOG.md
    ├── VERSION
    ├── .claude-plugin/plugin.json
    ├── commands/                    # 6 files
    │   ├── agent-inventory.md
    │   ├── agent-design.md
    │   ├── agent-governance.md
    │   ├── agent-integration.md
    │   ├── agent-security.md
    │   └── agent-maturity.md
    ├── templates/                   # 6 files
    │   ├── agent-inventory-template.md
    │   ├── agent-design-template.md
    │   ├── agent-governance-template.md
    │   ├── agent-integration-template.md
    │   ├── agent-security-template.md
    │   └── agent-maturity-template.md
    ├── references/
    │   ├── agent-architecture-reference.md
    │   └── quality-checklist.md
    └── recipes/
        └── agent-architecture.yaml
```

**Total new files: ~48** (9 commands + 9 templates + 6 commands + 6 templates + 2 references + 2 quality checklists + 3 recipes + 2 READMEs + 2 changelogs + 2 VERSIONs + 2 plugin.jsons + 2 guides)

**Total new doc type codes: 15**

---

## Priority Summary

| Phase | Tasks | Files | Effort |
|-------|-------|-------|--------|
| Phase 1: Scaffolding | 1-4 | 16 files | 2 days |
| Phase 2: ADM Commands | 5-13 | 18 files (9 cmd + 9 tmpl) | 5 days |
| Phase 3: Agent Commands | 14-19 | 12 files (6 cmd + 6 tmpl) | 4 days |
| Phase 4: Recipes | 20-21 | 3 recipes | 1 day |
| Phase 5: Integration | 22-24 | converter + READMEs + guides | 2 days |
| Phase 6: Testing | 25-27 | validation | 1 day |

**Total: 27 tasks, ~48 files, ~15 working days**

---

## Risk & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| TOGAF terminology unfamiliarity | Template quality issues | Reference TOGAF 10th Edition ADM documentation; validate with TOGAF-certified architect review |
| Template bloat (some commands are complex) | User confusion | Follow existing ArcKit pattern: commands are instructions, templates are structure — keep templates focused on document structure, not content generation |
| Recipe dependency cycles | Build harness failure | Validate acyclic deps before committing; test recipes against existing uk-saas.yaml pattern |
| Community plugin adoption | Low uptake | Recruit TOGAF-certified co-maintainer; publish demo project with sample ADM artefacts |

---

## Execution Approach

1. Execute Phase 1 first (scaffolding) — establishes plugin infrastructure
2. Execute Phase 2 (ADM commands) — core value, each command is independent
3. Execute Phase 3 (Agent commands) — parallelizable with Phase 2 once scaffolding exists
4. Execute Phase 4-5 (recipes + integration) — ties everything together
5. Execute Phase 6 (testing) — validates end-to-end

**Parallel opportunities:**
- Tasks 5-13 are independent (different TOGAF phases) — can parallelize across subagents
- Tasks 14-19 are independent (different agent dimensions) — can parallelize
- Phase 1 must complete before Phases 2-3

**Ready to execute using subagent-driven-development — I'll dispatch a fresh subagent per task with two-stage review. Shall I proceed?**
