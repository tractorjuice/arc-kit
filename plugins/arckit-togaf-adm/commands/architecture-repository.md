---
description: Build architecture repository — patterns library, standards register, reusable building blocks
argument-hint: "<optional project ID for scope, e.g. '000', 'global repository'>"
effort: max
handoffs:
  - command: adm-preliminary
    description: Feed repository standards back into next ADM cycle
---

You are helping an enterprise architect create an **Architecture Repository** — the central knowledge store for the organisation's architecture artefacts including patterns, standards, reference architectures, lessons learned, and reusable building blocks. This is a global-scope artefact that synthesises learnings from all completed ADM cycles and projects into a living reference library.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Synthesis Sources

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**MANDATORY** (warn if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Guiding principles, decision framework, technology standards, compliance requirements
  - If missing: STOP and ask user to run `/arckit:principles` first. The repository must be grounded in architecture principles.

**RECOMMENDED** (read if available, note if missing):

- **ADR-\*** (Architecture Decision Records across all projects) — Extract: Decisions made, alternatives considered, consequences, rationale. These feed directly into the patterns library and standards register.
- **DIAG-\*** (Architecture Diagrams across all projects) — Extract: Reference architecture patterns, system context diagrams, integration patterns. These feed into the reference architectures section.
- **STORY-\*** (Project stories/narratives across all projects) — Extract: Project outcomes, what worked, what didn't, unexpected challenges. These feed into lessons learned.
- **ANALYZE-\*** (Analysis artefacts across all projects) — Extract: Technical findings, performance data, assessment results. These feed into building blocks and lessons learned.

**OPTIONAL** (read if available, skip silently if missing):

- **BPCM** (Business Capability Maps) — Extract: Capability patterns that repeat across projects
- **GAPA** (Gap Analyses) — Extract: Recurring gaps and solutions
- **TRANS** (Transition Architectures) — Extract: Reusable transition patterns
- **APP** (Application Inventories) — Extract: Technology platform decisions
- **BORD** (Architecture Board decisions) — Extract: Governance decisions that become standards
- **ACHG** (Architecture Change Requests) — Extract: Changes that reveal systemic issues

### Prerequisites 1b: Scan all project directories for artefacts

Scan all `projects/*/` directories for the following artefact types:

- **ADR** files (`ARC-*-ADR-v*.md`, `ARC-*-ADR-*-*-v*.md`) — Architecture Decision Records
- **DIAG** files (`ARC-*-DIAG-v*.md`) — Architecture diagrams and reference models
- **STORY** files (`ARC-*-STORY-v*.md`) — Project stories and narratives
- **ANALYZE** files (`ARC-*-ANALYZE-v*.md`) — Technical analysis documents
- **BPCM**, **GAPA**, **TRANS**, **APP**, **BORD**, **ACHG** files — Supplementary sources for cross-domain patterns

### Prerequisites 1c: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract enterprise standards, technology standards catalogues, industry best practice guidelines
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise architecture standards, compliance frameworks, security standards
- If no external standards docs found but they would improve the output, ask: "Do you have any enterprise standards catalogues, technology standards, or industry best practice documents? I can read PDFs and images directly. Place them in `projects/000-global/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents.

## Instructions

### 1. Identify Scope

This command operates at **global scope** by default. The repository synthesises learnings from ALL projects.

- If the user provides a project ID argument, scope the scan to that specific project's artefacts (useful for project-specific repositories)
- If no argument provided, scan all `projects/*/` directories for synthesis
- Set `PROJECT_ID` = `000` for global repository, or the user-specified project ID for project-scoped repository

### 2. Read Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/architecture-repository-template.md` exists in the project root
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/architecture-repository-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize architecture-repository`

### 3. Gather and Classify Artefacts

Read PRIN and scan all available project artefacts. Classify each artefact's content into repository categories:

#### From PRIN → Standards Register

- Extract all technology standards, compliance requirements, and decision frameworks
- Each principle clause that defines a "must" or "shall" becomes a standard entry
- Group by domain: Security, Architecture, Data, Application, Technology, Governance

#### From ADR → Patterns Library + Reference Architectures

- Each ADR with a generalisable solution becomes a pattern entry
- Extract: problem context, solution approach, consequences, applicability conditions
- ADR decisions that establish reusable architectural approaches become reference architectures
- Group patterns by domain and reuse frequency

#### From DIAG → Reference Architectures

- Diagrams that represent reusable architectural patterns (not project-specific)
- Include: system integration patterns, security architectures, data flow templates, cloud reference models
- Each reference architecture links back to the original diagram source

#### From STORY + ANALYZE → Lessons Learned

- Story outcomes that reveal process improvements become lessons
- Analysis findings that identify technical pitfalls or successes become lessons
- Categorise: Technical (architecture, technology, performance), Process (delivery, governance, planning), People (skills, collaboration, communication)

#### From all artefacts → Reusable Building Blocks

- Components, APIs, services, patterns that have been proven in production
- Assess maturity: Prototype (used once), Proven (used in 2+ projects), Standard (enterprise-adopted)
- Link to source artefacts for provenance

### 4. Generate Architecture Repository

Create the repository document following the template structure.

#### Standards Register

Extract and catalogue all standards from PRIN and ADR artefacts:

| Standard ID | Name | Domain | Status | Last Review | Source |
|-------------|------|--------|--------|-------------|--------|

**Minimum quality requirement**: ≥5 standards with complete entries

Standards categories to extract:

- **Security**: Information security standards, access control, encryption, compliance (e.g., NCSC CAF, ISO 27001 mappings)
- **Architecture**: Design patterns, integration standards, service boundaries, API governance
- **Data**: Data modelling standards, data quality, retention, classification
- **Technology**: Approved technology stack, hosting standards, platform requirements
- **Governance**: Decision-making processes, change control, compliance reporting

For each standard:

- `Standard ID`: `STD-NNN` format
- `Name`: Descriptive standard name
- `Domain`: Primary domain (Security/Architecture/Data/Technology/Governance)
- `Status`: Active, Deprecated, Proposed, Under Review
- `Last Review`: Date of last review or adoption
- `Source`: Originating PRIN or ADR artefact

#### Patterns Library

Catalogue reusable architectural patterns from ADR artefacts:

**Pattern structure** (for each pattern):

- **Context**: When and why to apply this pattern
- **Problem**: The problem statement this pattern addresses
- **Solution**: Detailed solution description with architectural considerations
- **Consequences**: Trade-offs, benefits, risks, and performance characteristics
- **Related**: Related patterns, anti-patterns, and complementary standards
- **Source Project**: Which project's ADR this pattern was extracted from

**Minimum quality requirement**: ≥3 patterns with full description

Pattern grouping:

- Group patterns by domain (Security, Integration, Data, Platform, etc.)
- Cross-reference related patterns
- Indicate maturity level and production validation

#### Reference Architectures

Catalogue reference architectures from DIAG artefacts:

| Reference ID | Name | Domain | Diagram | Last Used |
|-------------|------|--------|---------|-----------|

**Minimum quality requirement**: ≥2 reference architectures

Reference architecture types:

- **Integration architectures**: API gateways, service mesh, event-driven patterns
- **Security architectures**: Zero trust, defence in depth, secure access
- **Data architectures**: Data lakes, data fabric, stream processing
- **Cloud architectures**: Cloud-native, hybrid, multi-cloud reference models
- **Application architectures**: Microservices, monolith-to-service migration

Each reference architecture includes:

- `Reference ID`: `REF-NNN` format
- `Diagram`: Link to the source DIAG artefact
- `Last Used`: Most recent project where this architecture was applied

#### Lessons Learned

Catalogue lessons from STORY and ANALYZE artefacts:

| Lesson ID | Project | Lesson | Category | Impact |
|-----------|---------|--------|----------|--------|

**Minimum quality requirement**: ≥3 lessons learned

Lesson categories:

- **Technical**: Architecture decisions, technology choices, performance learnings
- **Process**: Delivery approaches, governance effectiveness, planning accuracy
- **People**: Team composition, skills gaps, collaboration patterns

Each lesson includes:

- `Lesson ID`: `LL-NNN` format
- `Project`: Source project identifier
- `Impact`: High/Medium/Low — how significant was this lesson's impact
- Actionable takeaway that can prevent recurrence or replicate success

#### Reusable Building Blocks

Catalogue proven components and solutions:

| Block ID | Name | Type | Maturity | Documentation |
|----------|------|------|----------|---------------|

**Minimum quality requirement**: ≥3 building blocks

Building block types:

- **Component**: Self-contained software components, services, libraries
- **Pattern**: Reusable architectural patterns with implementation guidance
- **API**: Standardised interfaces and contracts
- **Template**: Configuration templates, deployment templates, architecture templates

Maturity levels:

- **Prototype**: Used in a single project, limited validation
- **Proven**: Used successfully in 2+ projects, production-tested
- **Standard**: Enterprise-adopted, part of approved technology stack

#### Search Index

Create a keyword-based search index for quick artefact lookup:

| Keyword | Artefacts |
|---------|-----------|

- Index all standards, patterns, reference architectures, lessons, and building blocks
- Group related keywords together
- Include cross-domain keywords (e.g., "security" should link to security standards, security patterns, security reference architectures, and security-related lessons)

#### Traceability

Create a traceability matrix showing the provenance of repository entries:

| Source Type | Source Artefact | Repository Entry | Relationship |
|-------------|-----------------|------------------|-------------|

- Trace every repository entry back to its source artefact
- Show PRIN → ADR → DIAG → REPO lineage
- Verify no orphan entries (every entry must have a traceable source)

### 5. UK Government Specifics

If the user indicates this is a UK Government project, include:

- **Technology Code of Practice (TCoP)**: Standards aligned to 13 TCoP points
- **GDS Technology Standards**: Standards from the GDS Technology Standards Catalogue
- **NCSC CAF**: Cyber Assessment Framework controls as security standards
- **G-Cloud/DOS**: Procurement standards and approved suppliers
- **Cross-Government Services**: Standards for GOV.UK Pay, Notify, Verify, Design System integration

### 6. MOD Specifics

If this is a Ministry of Defence project, include:

- **Defiance Programme**: Cloud migration standards and MOD Cloud Programme alignment
- **JSP 440**: System project management standards
- **IAMM**: Information assurance maturity standards
- **JSP 936**: AI assurance standards
- **SSE**: Single Source Estate compliance requirements
- **Cyber Essentials Plus**: Security baseline standards

### 7. Load Mermaid Syntax References

Read `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/flowchart.md` for official Mermaid syntax — node shapes, edge labels, and styling options for repository structure diagrams.

### 8. Mermaid Diagram Requirements

Include a **repository structure diagram** (Mermaid flowchart):

1. **Repository Structure** — Show the hierarchy: Standards → Patterns → Reference Architectures → Building Blocks → Lessons Learned, with cross-references between sections

**Syntax Rules**:

- ✅ Flowcharts: Node labels can use `<br/>`, edge labels cannot
- ✅ Use subgraphs for each repository section
- ✅ Show traceability links between sections

### 9. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **REPO** per-type checks pass. Fix any failures before proceeding.

**Additional quality checks for Architecture Repository**:

1. **Standards Register**: ≥5 standards with complete entries (ID, name, domain, status, last review, source)
2. **Patterns Library**: ≥3 patterns with full description (context, problem, solution, consequences, related, source project)
3. **Reference Architectures**: ≥2 reference architectures with ID, name, domain, diagram link, last used
4. **Lessons Learned**: ≥3 lessons with ID, project, lesson, category, impact
5. **Building Blocks**: ≥3 building blocks with ID, name, type, maturity, documentation
6. **Search Index**: Present with meaningful keyword-to-artefact mappings
7. **Traceability**: Complete provenance — every entry traces to a source artefact

### 10. Write the Repository File

**IMPORTANT**: The Architecture Repository document will be a large document (typically 400-700 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/000-global/ARC-000-REPO-v1.0.md
```

For project-scoped repositories (when a specific project ID is provided):

```text
projects/{P}/ARC-{P}-REPO-v1.0.md
```

Use the Write tool with the complete repository content following the template structure.

#### Auto-Populate Document Control Fields

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-000-REPO-v{VERSION}` (global) or `ARC-{PROJECT_ID}-REPO-v{VERSION}` (project-scoped)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → `000` for global, or extracted from project path
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Architecture Repository"
- `[COMMAND]` → "arckit.architecture-repository"

*User-provided fields* (extract from project metadata or user input):

- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Review Date → Current date + 90 days (quarterly review cycle)

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:architecture-repository` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

```markdown
**Generated by**: ArcKit `/arckit:architecture-repository` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: Global Repository (Project 000)
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents and projects synthesised]
```

### 11. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Architecture Repository Created

**Document**: `projects/000-global/ARC-000-REPO-v1.0.md`
**Document ID**: ARC-000-REPO-v1.0

### Repository Contents

| Section | Count | Status |
|---------|-------|--------|
| Standards Register | [N] standards | ✅ [≥5 required] |
| Patterns Library | [N] patterns | ✅ [≥3 required] |
| Reference Architectures | [N] references | ✅ [≥2 required] |
| Lessons Learned | [N] lessons | ✅ [≥3 required] |
| Building Blocks | [N] blocks | ✅ [≥3 required] |
| Search Index | [N] keywords | ✅ Present |

### Standards Summary
| Domain | Count |
|--------|-------|
| Security | [N] |
| Architecture | [N] |
| Data | [N] |
| Technology | [N] |
| Governance | [N] |

### Patterns Summary
1. **[Pattern 1]**: [Brief description] — Source: [ARC-XXX-ADR]
2. **[Pattern 2]**: [Brief description] — Source: [ARC-XXX-ADR]
3. **[Pattern 3]**: [Brief description] — Source: [ARC-XXX-ADR]

### Reference Architectures Summary
1. **[REF-001]**: [Name] — [Domain] — Source: [ARC-XXX-DIAG]
2. **[REF-002]**: [Name] — [Domain] — Source: [ARC-XXX-DIAG]

### Top Lessons Learned
1. **[LL-001]**: [Lesson] — [Category] — [Impact]
2. **[LL-002]**: [Lesson] — [Category] — [Impact]
3. **[LL-003]**: [Lesson] — [Category] — [Impact]

### Building Blocks Summary
| Block | Type | Maturity |
|-------|------|----------|
| [BB-001] | [Type] | [Maturity] |
| [BB-002] | [Type] | [Maturity] |
| [BB-003] | [Type] | [Maturity] |

### Sources Synthesised
- ✅ Architecture Principles: ARC-000-PRIN-v[N].md
- ✅ ADR artefacts: [N] decisions across [N] projects
- ✅ DIAG artefacts: [N] diagrams across [N] projects
- ✅ STORY artefacts: [N] stories across [N] projects
- ✅ ANALYZE artefacts: [N] analyses across [N] projects

### Traceability
- [N] repository entries traced to source artefacts
- [N] standards derived from principles
- [N] patterns derived from decisions
- [N] reference architectures derived from diagrams
- [N] lessons derived from stories/analyses

### Next Steps
1. Review repository with Architecture Board / Enterprise Architecture team
2. Validate standards against current technology strategy
3. Feed repository standards into next ADM cycle: `/arckit:adm-preliminary`
4. Add new patterns as projects complete — re-run `/arckit:architecture-repository`
5. Maintain search index as new artefacts are added

### Usage
- Reference this repository when creating new architecture artefacts
- Use patterns library as design starting point for new projects
- Use standards register as compliance checklist
- Use lessons learned to avoid known pitfalls
- Use building blocks to accelerate delivery

**File location**: `projects/000-global/ARC-000-REPO-v1.0.md`
```

## Important Notes

1. **Synthesis, Not Generation**: This command synthesises existing artefacts into a curated knowledge repository. It should NOT generate new information but rather consolidate and classify existing architectural decisions, patterns, and learnings.

2. **Use Write Tool**: The repository document is typically 400-700 lines. ALWAYS use the Write tool to create it. Never output the full content in chat.

3. **Global Scope**: By default, this command operates across all projects. Use the argument to scope to a specific project when creating project-specific repositories.

4. **Quality Thresholds**: The minimum quality requirements (≥5 standards, ≥3 patterns, ≥2 reference architectures, ≥3 lessons, ≥3 building blocks) ensure the repository provides genuine value. If thresholds cannot be met, note the gaps and suggest which artefacts would help fill them.

5. **Living Document**: The Architecture Repository is a living artefact. Schedule quarterly reviews (`/arckit:architecture-repository`) to incorporate learnings from new projects. Version management (v1.0 → v2.0) tracks evolution.

6. **Traceability is Critical**: Every repository entry must trace back to source artefacts. Orphan entries without provenance should be flagged and either sourced or removed.

7. **Integration with Other Commands**:
   - **Input**: Synthesises from PRIN, ADR, DIAG, STORY, ANALYZE, BPCM, GAPA, TRANS, APP, BORD, ACHG
   - **Output**: Feeds into `/arckit:adm-preliminary` (standards inform scope), all future project artefacts (reference patterns and standards)
   - **Feedback loop**: New projects create artefacts → repository is updated → next ADM cycle uses updated repository

8. **TOGAF Alignment**: This document maps to the TOGAF Architecture Repository content meta-model: Architecture Capability, Architecture Methods, Tools, Governance, Standards, Reference Architectures, Patterns, and Lessons Learned.

9. **Search and Retrieval**: The search index enables quick lookup of patterns, standards, and lessons. Maintain this index as the repository grows — it's the primary discovery mechanism for architects.

10. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
