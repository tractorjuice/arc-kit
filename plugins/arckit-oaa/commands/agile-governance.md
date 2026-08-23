---
description: Establish governance cadence for agile architecture — lightweight review gates, compliance evidence, and change management
doc-type: OAGOV
argument-hint: "<product or programme name, e.g. 'Observability Stack', 'enterprise AI platform'>"
effort: medium
handoffs:

  - command: oaa-adm-lite
    description: Re-plan sprint cadence based on governance findings

  - command: agile-security
    description: Update security backlog from governance review findings
---

You are helping an enterprise architect create an **Agile Governance** document using Open Agile Architecture (O-AA, C208) — Ch. 8 Agile Governance. This approach establishes lightweight governance cadence aligned to sprint cycles — architecture review gates, compliance evidence collection, and change management that operates at sprint velocity rather than quarterly boards.

## User Input

```text
$ARGUMENTS
```

## Trigger Guidance

Use this command when **any** of the following conditions are met:

- Client wants **governance aligned to sprint cycles** rather than quarterly architecture boards

- Architecture review needs to be **lightweight and continuous** rather than heavy-gate audits

- **Compliance evidence** must be collected per sprint, not accumulated for end-of-phase reviews

- Client requires **change management at sprint velocity** — architecture changes evaluated and approved within sprint cycles

- **Architecture board** replaced by sprint review panels with cross-functional representation

**Do NOT use** when:

- Client requires traditional quarterly architecture board with 20+ member governance panels

- Multi-year programme with formal governance stages and stage-gate reviews

- Regulatory environment mandates formal governance cadence outside sprint cycles

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Governance principles, decision authority, compliance obligations

  - If missing: warn user to run `/arckit:principles` first

- **OAAL** (O-AA ADM Lite) — Extract: Sprint plan, governance cadence, compliance mapping

  - If missing: note that O-AA Lite context is not available

- **OAPR** (Agile Product Architecture) — Extract: Product guardrails, compliance requirements

  - If missing: note that product architecture context is limited

- **OASEC** (Agile Security) — Extract: Security compliance evidence, regulatory mappings

  - If missing: note that security context is limited

- **OASTR** (Agile Strategy Canvas) — Extract: Governance strategy, risk appetite

  - If missing: note that strategy context is limited

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract governance frameworks, compliance obligations, change management policies, risk registers

- Read any **enterprise standards** in `projects/000-global/external/` — extract governance policies, architecture review procedures, approval workflows

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Read Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/agile-governance-template.md` exists in the project root

- **If found**: Read the user's customized template (user override takes precedence)

- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agile-governance-template.md` (default)

- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.

- **Also** apply the O-AA placeholder substitutions in `${CLAUDE_PLUGIN_ROOT}/references/placeholder-substitutions.md` (`${user_config.project_issue_prefix}`, `${user_config.safety_checklist_id}`, `${user_config.references_dir}`) wherever they appear in the template.

> **Tip**: Users can customise templates with `/arckit:customize agile-governance`

### 3. O-AA Agile Governance Framework

O-AA agile governance practice (C208 Ch. 8) establishes that:

- **Sprint-aligned governance**: Governance cadence matches sprint cycles — review gates occur at sprint boundaries, not quarterly

- **Lightweight review panels**: Cross-functional sprint review panels replace heavy architecture boards (3-5 members vs. 20+)

- **Continuous compliance evidence**: Compliance artifacts generated per sprint, always current for audit

- **Change management at sprint velocity**: Architecture change requests evaluated and decided within sprint cycles

- **Axiom 7 (Authority, Responsibility, and Accountability Distribution)** — decision authority, responsibility, and accountability are distributed across the sprint review panel, not concentrated in a top-down board

- **Governance as service**: Governance enables delivery by providing clear decision paths, not by adding friction

### 4. Shared Artefact Definitions

The agile governance command defines artefacts whose structure is inlined in `agile-governance-template.md`:

- **`governance-report.yaml`** — sprint governance report (cadence, panel, gates, compliance monitoring)

- **`change-request.yaml`** — architecture change request (one per change request)

- **`compliance-evidence.yaml`** — sprint compliance evidence, always current (shared with `/arckit:agile-security`)

- **`vision.yaml`** — governance constraints from architecture vision (inherited from `/arckit:oaa-adm-lite`)

### 5. Generate Agile Governance Document

Create the Agile Governance document following the template structure.

#### Document Control

- Generate Document ID with `node scripts/generate-document-id.mjs {P} OAGOV --filename` (canonical form: `ARC-{P}-OAGOV-v1.0`)

- Set owner, dates, status, classification

- Review cycle: Per sprint cycle

#### Governance Cadence

- **Sprint review panel**: Composition, roles, decision authority, meeting cadence

  - Panel members: Product Owner, Lead Architect, AI Safety Engineer, DevOps Lead, Compliance Representative

  - Decision authority matrix: What decisions the panel can make autonomously vs. escalate

  - Sprint boundary reviews: Architecture compliance check at sprint end

- **Governance artifacts per sprint**: Compliance evidence, architecture decisions, risk assessments

- **Escalation paths**: When issues exceed sprint panel authority

#### Architecture Review Gates

- **Pre-sprint gate**: Architecture alignment check before sprint planning

- **Mid-sprint check**: Lightweight architecture health check

- **Post-sprint gate**: Compliance evidence review, architecture decision validation

- **Gate criteria**: Pass/fail criteria per gate, remediation paths for failures

#### Change Management Process

- **Change request format**: Standardized architecture change request (change-request.yaml)

- **Evaluation criteria**: Impact assessment, compliance implications, effort estimation

- **Decision timeline**: Change requests evaluated within sprint cycle (not held for quarterly boards)

- **Change log**: Maintained per sprint, traceable to architecture decisions

#### Compliance Evidence Framework

- **Evidence categories**: Regulatory compliance, security controls, architecture standards, quality gates

- **Evidence per sprint**: Each sprint produces compliance evidence artifacts

- **Audit readiness**: Evidence is always current — no audit preparation needed

- **Regulatory mapping**: Map evidence to regulatory requirements (GDPR, APRA, APP, AI Act)

#### Governance Metrics

- **Decision velocity**: Average time from change request to decision

- **Compliance rate**: Percentage of sprint deliverables passing governance gates

- **Architecture debt**: Accumulated exceptions and workarounds requiring remediation

- **Risk exposure**: Open risk items and mitigation progress

#### Exception Handling

- **Exception types**: Architecture exceptions, compliance exceptions, security exceptions

- **Exception process**: Raised, assessed, approved/rejected, documented

- **Exception register**: Maintained with resolution tracking

- **Exception review**: Exceptions reviewed at sprint boundary, resolved or escalated

### 6. External References

Populate the `## External References` section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Every claim taken from an `external/` document, a `projects/000-global/external/` policy, or a web source MUST carry an inline `[DOC_ID-CN]` citation marker resolving to a Document Register row. The Open Group *Open Agile Architecture* standard (C208) MUST appear in the Document Register with its primary URL and the verification date.

### 7. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **OAGOV** per-type checks pass. Fix any failures before proceeding.

### 8. Write the Document

**IMPORTANT**: The Agile Governance document will be a substantial document (typically 180-300 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-OAGOV-v1.0.md
```

### 9. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Agile Governance Document Created

**Document**: `projects/{P}/ARC-{P}-OAGOV-v1.0.md`
**Document ID**: ARC-{P}-OAGOV-v1.0

### Governance Cadence Profile
- **Review panel**: [N] members, [Roles]

- **Decision authority**: [Scope of autonomous decisions]

- **Sprint gates**: [N] gates per sprint (pre/mid/post)

### Change Management
- **Decision timeline**: [Target cycle time for change requests]

- **Exception process**: [Exception handling workflow]

- **Change log**: [Maintenance approach]

### Compliance Evidence
- **Evidence categories**: [N] categories

- **Regulatory coverage**: [Frameworks covered]

- **Audit readiness**: [Evidence currency approach]

### Governance Metrics
- **Decision velocity target**: [Target]

- **Compliance rate target**: [Target]

- **Risk exposure tracking**: [Approach]

### Sprint Artifacts
- ✅ governance-report.yaml

- ✅ change-request.yaml

- ✅ compliance-evidence.yaml

### Synthesised From
- [✅/⚠️] Architecture Principles: ARC-000-PRIN-v[N].md

- [✅/⚠️] O-AA ADM Lite: ARC-{P}-OAAL-v[N].md

- [✅/⚠️] Product Architecture: ARC-{P}-OAPR-v[N].md

- [✅/⚠️] Agile Security: ARC-{P}-OASEC-v[N].md

- [✅/⚠️] Agile Strategy: ARC-{P}-OASTR-v[N].md

### Next Steps
1. Establish Sprint 0 review panel composition
2. Configure governance cadence in sprint planning tool
3. Create initial compliance evidence template
4. Run first sprint review gate at Sprint 0 end

**File location**: `projects/{P}/ARC-{P}-OAGOV-v1.0.md`
```

## Important Notes

1. **Governance at Sprint Velocity**: O-AA governance operates at sprint cadence. Change requests are decided within sprint cycles, not held for quarterly boards. The value is in fast decisions that enable delivery.

2. **Lightweight Review Panels**: Replace 20+ member architecture boards with 3-5 person sprint review panels. Cross-functional representation ensures decisions consider product, architecture, security, and compliance perspectives.

3. **Continuous Compliance Evidence**: Compliance is not a phase activity. Evidence is generated per sprint alongside feature development. You are always audit-ready.

4. **Sprint Artefacts**: The `governance-report.yaml`, `change-request.yaml`, and `compliance-evidence.yaml` structures are defined inline in `agile-governance-template.md`. Validate artefacts against those structures; they stay consistent with the traditional TOGAF commands without sharing schema files.

5. **Use Write Tool**: The Agile Governance document is typically 180-300 lines. ALWAYS use the Write tool to create it.

6. **Version Management**: If an Agile Governance document already exists (`ARC-*-OAGOV-v*.md`), create a new version (v2.0) rather than overwriting.

7. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
