---
description: Embed security into agile sprint rhythm — threat modeling, compliance evidence, and security backlog items
doc-type: OASEC
argument-hint: "<product or programme name, e.g. 'Observability Stack', 'AI platform'>"
effort: medium
handoffs:

  - command: agile-governance
    description: Establish governance cadence including security review gates

  - command: agile-strategy
    description: Align security strategy with dual transformation tracks
---

You are helping an enterprise architect create an **Agile Security** document using Open Agile Architecture (O-AA, C208) Learning Unit 9: Agile Security. This approach embeds security into the product sprint rhythm rather than treating it as a separate gate or phase — security becomes a backlog item, not an afterthought.

## User Input

```text
$ARGUMENTS
```text

## Trigger Guidance

Use this command when **any** of the following conditions are met:

- Client wants **security embedded in sprint rhythm** rather than separate security phases

- Product requires **continuous compliance evidence** generated alongside development artifacts

- **Threat modeling** needs to be a backlog item, not a one-time activity

- Client operates in regulated environments (APRA, GDPR, APP, AI Act) with **sprint-aligned compliance**

- Product involves AI/ML systems requiring **algorithmic transparency and bias assessment** per sprint

**Do NOT use** when:

- Client requires traditional security audit with separate audit phases — use full TOGAF ADM with dedicated security phase

- Multi-year security programme with 50+ review gates outside sprint cadence

- Client needs standalone penetration testing or security assessment (use dedicated security tools instead)

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Security principles, compliance requirements, data classification standards

  - If missing: warn user to run `/arckit:principles` first

- **OAPR** (Agile Product Architecture) — Extract: Product mission, guardrails, technology constraints

  - If missing: note that product architecture context is limited

- **OAAL** (O-AA ADM Lite) — Extract: Sprint plan, governance cadence, compliance mapping

  - If missing: note that O-AA Lite context is not available

- **OASTR** (Agile Strategy Canvas) — Extract: Risk profile, transformation risks, security strategy

  - If missing: note that strategy context is limited

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract security policies, compliance requirements, threat models, regulatory obligations

- Read any **enterprise standards** in `projects/000-global/external/` — extract security standards, data classification policies, incident response procedures

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

- **First**, check if `.arckit/templates-custom/agile-security-template.md` exists in the project root

- **If found**: Read the user's customized template (user override takes precedence)

- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agile-security-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize agile-security`

### 3. O-AA Agile Security Framework

O-AA Learning Unit 9 (Agile Security) establishes that:

- **Security as backlog items**: Security work enters the product backlog as epics/features/stories — not a separate security workstream

- **Sprint-aligned compliance**: Compliance evidence is generated continuously alongside development artifacts, not accumulated for end-of-phase audits

- **Threat modeling per sprint**: Each sprint cycle includes threat model updates as a backlog item, not a one-time activity at project start

- **O-AA Axiom 4**: "Architecture must be fit for purpose." — security controls proportional to product risk, not a compliance checklist

- **Shared security ownership**: Security is the team's responsibility, not a dedicated security team's gate

### 4. Shared Schema Definitions

Agile security commands reuse schema definitions:

- **`security-backlog.json`** — Security backlog item schema (O-AA specific)

- **`threat-model.yaml`** — Threat model schema (shared with traditional security workflows)

- **`compliance-evidence.json`** — Sprint compliance evidence schema

- **`vision.yaml`** — Architecture vision security constraints (shared with `/arckit-oaa:oaa-adm-lite`)

### 5. Generate Agile Security Document

Create the Agile Security document following the template structure.

#### Document Control

- Generate Document ID: `ARC-{P}-OASEC-v1.0` (for filename: `ARC-{P}-OASEC-v1.0.md`)

- Set owner, dates, status, classification

- Review cycle: Per sprint cycle

#### Security Backlog Integration

- **Security epic categories**: Data protection, authentication/authorization, encryption, monitoring/observability, incident response, compliance reporting

- **Sprint capacity**: Target 20-30% of sprint capacity for security items (adjust based on risk profile)

- **Security story format**: "As a [role], I want [security control] so that [threat mitigated]"

- **Acceptance criteria**: Each security story includes testable security acceptance criteria

#### Threat Modeling per Sprint

- **Sprint 0 threat model**: Initial threat model covering product architecture (STRIDE or equivalent)

- **Sprint N threat updates**: Each sprint updates threat model based on new features, identified vulnerabilities, and environment changes

- **Threat model as backlog item**: "Update threat model for Sprint N features" enters backlog each sprint

- **Automated threat detection**: Integration with SAST/DAST tools feeding threat model updates

#### Compliance Evidence per Sprint

- **Evidence generation**: Compliance evidence artifacts generated alongside feature development

- **Regulatory mapping**: Map sprint deliverables to regulatory requirements (GDPR, APRA, APP, AI Act)

- **Continuous evidence**: Evidence is never accumulated for audits — it's always current

- **Evidence schema**: Standardized evidence format per sprint (compliance-evidence.json)

#### Security Architecture Guardrails

- **Non-negotiable constraints**: Data encryption at rest/in transit, authentication requirements, logging standards

- **Technology standards**: Approved security building blocks and libraries

- **Anti-patterns**: Forbidden security approaches (e.g., rolling your own crypto, hardcoded credentials)

- **Security review gates**: Lightweight sprint-level security reviews, not heavy-gate audits

#### AI/ML Security Considerations

- **Algorithmic transparency**: ATRS compliance per sprint for AI/ML features

- **Bias and fairness**: Automated bias testing in sprint CI/CD pipeline

- **Model security**: Model poisoning, data leakage, and adversarial attack mitigations

- **Privacy preservation**: Differential privacy, federated learning where applicable

### 6. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.

### 7. Write the Document

**IMPORTANT**: The Agile Security document will be a substantial document (typically 180-300 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-OASEC-v1.0.md
```text

### 8. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Agile Security Document Created

**Document**: `projects/{P}/ARC-{P}-OASEC-v1.0.md`
**Document ID**: ARC-{P}-OASEC-v1.0

### Security Backlog Profile
- **Security epic categories**: [N] categories defined

- **Sprint capacity target**: [X]% of sprint capacity

- **Regulatory mappings**: [N] frameworks mapped (GDPR, APRA, etc.)

### Threat Modeling
- **Initial threat model**: [N] threat categories, [N] identified threats

- **Per-sprint updates**: Threat model backlog item defined

- **Automated detection**: [Tools/integrations configured]

### Compliance Evidence
- **Evidence per sprint**: [N] evidence categories

- **Regulatory coverage**: [Frameworks covered]

- **Continuous audit trail**: [Evidence generation approach]

### Shared Schemas
- ✅ security-backlog.json → schemas/security-backlog.json

- ✅ threat-model.yaml → schemas/threat-model.yaml

- ✅ compliance-evidence.json → schemas/compliance-evidence.json

### Synthesised From
- [✅/⚠️] Architecture Principles: ARC-000-PRIN-v[N].md

- [✅/⚠️] Product Architecture: ARC-{P}-OAPR-v[N].md

- [✅/⚠️] O-AA ADM Lite: ARC-{P}-OAAL-v[N].md

- [✅/⚠️] Agile Strategy: ARC-{P}-OASTR-v[N].md

### Next Steps
1. Create security epics for Sprint 0
2. Run initial threat model: STRIDE analysis for product architecture
3. Establish governance cadence: `/arckit-oaa:agile-governance`
4. Configure CI/CD security pipeline integration

**File location**: `projects/{P}/ARC-{P}-OASEC-v1.0.md`
```text

## Important Notes

1. **Security as Backlog Items**: Security is not a phase or gate in O-AA. It's backlog items that compete with feature work for sprint capacity. The team decides security priority alongside feature priority.

2. **Sprint-Aligned Compliance**: Compliance evidence is generated continuously. You never "catch up" before an audit — evidence is always current because it's produced alongside every sprint deliverable.

3. **Threat Modeling is Living**: The threat model updates each sprint. It's not a document you write once at project start. New features create new attack surfaces.

4. **Shared Schemas**: The `vision.yaml` schema is shared between O-AA and traditional TOGAF commands. This ensures consistency regardless of which approach the client selects.

5. **Use Write Tool**: The Agile Security document is typically 180-300 lines. ALWAYS use the Write tool to create it.

6. **Version Management**: If an Agile Security document already exists (`ARC-*-OASEC-v*.md`), create a new version (v2.0) rather than overwriting.

7. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
