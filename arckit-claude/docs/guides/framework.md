# Framework Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.framework` transforms existing project artifacts into a structured, phased framework with an overview document and executive guide, organising scattered architecture outputs into a coherent, actionable structure.

---

## Purpose

As architecture projects progress, they accumulate a wealth of artifacts -- requirements, strategies, data models, stakeholder analyses, research reports, decision records. Individually, each artifact serves its purpose, but collectively they can become difficult to navigate, prioritise, and act upon. Without a unifying structure:

- **Scattered recommendations** -- insights are spread across dozens of documents with no clear implementation sequence
- **No phased roadmap** -- stakeholders cannot see what to do first, next, or later
- **Executive inaccessibility** -- senior leaders lack a concise summary of what the project recommends and why
- **Completeness gaps** -- it is hard to verify that all requirements and principles are addressed

The `/arckit.framework` command **synthesises and organises** all existing artifacts into a phased framework that:

- Organises scattered documents into a coherent, navigable structure
- Creates an executive-friendly overview for senior stakeholder briefings
- Enables phased adoption with clear implementation sequencing
- Demonstrates completeness by mapping artifacts to framework phases
- Provides a single entry point for understanding the entire project

---

## Inputs

| Artifact | Requirement | What It Provides |
|----------|-------------|------------------|
| Architecture Principles (PRIN) | **MANDATORY** | Framework must reference and align with architecture principles |
| Requirements Specification (REQ) | **MANDATORY** | Framework must address all business, functional, and non-functional requirements |
| Stakeholder Analysis (STKE) | Recommended | Stakeholder context, roles, influence, and communication needs |
| Architecture Strategy (STRAT) | Recommended | Strategic direction, capability gaps, target state vision |
| Data Model (DATA) | Recommended | Data architecture, entity relationships, data governance needs |
| Research Report (RSCH) | Recommended | Technology research findings, vendor evaluations, build vs buy analysis |
| All other ARC-* artifacts | Optional | Any additional artifact (ADR, RISK, SOBC, DIAG, WARD, etc.) can be included and categorised into framework phases |

> **Note**: At minimum, architecture principles and requirements must exist before running. The more artifacts available, the richer and more comprehensive the framework will be.

---

## Command

```bash
/arckit.framework Create framework for <project-name>
```

Outputs:

- `projects/<id>/framework/` -- directory with phase subdirectories
- `projects/<id>/ARC-<id>-FWRK-v1.0.md` -- Framework Overview
- `projects/<id>/framework/<Project-Name>-Executive-Guide.md` -- Executive Guide

---

## What It Produces

The framework command generates a structured output comprising:

| Output | Description |
|--------|-------------|
| **Framework directory** (`framework/`) | Top-level directory containing phase subdirectories that organise recommendations by implementation stage |
| **Phase subdirectories** | Numbered directories (e.g., `phase-1-foundation/`, `phase-2-core/`) grouping related recommendations |
| **Framework Overview** (`ARC-{PID}-FWRK-v1.0.md`) | Comprehensive document mapping all artifacts, requirements, and recommendations into the phased structure with traceability |
| **Executive Guide** (`{Project-Name}-Executive-Guide.md`) | Concise, non-technical summary designed for senior stakeholders and decision-makers |

---

## Framework Structure

The framework organises recommendations into five default phases, though these adapt based on the project's domain and content:

| Phase | Name | Purpose |
|-------|------|---------|
| 1 | **Foundation** | Governance, principles, standards, and baseline capabilities that must be established first |
| 2 | **Core** | Essential platform components, data architecture, and integration patterns |
| 3 | **Enhancement** | Extended capabilities, advanced features, and optimisation of core components |
| 4 | **Integration** | Cross-system integration, external interfaces, and ecosystem connectivity |
| 5 | **Optimisation** | Continuous improvement, maturity advancement, and operational excellence |

Phases adapt to the project domain. For example, a data governance project might use phases like "Data Discovery", "Data Quality", "Data Cataloguing", "Data Stewardship", and "Data Monetisation". The command analyses the content of available artifacts to determine the most appropriate phase structure.

---

## Workflow Position

The framework command sits LATE in the ArcKit workflow -- it requires many artifacts to already exist so it can synthesise them into a coherent structure:

```text
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   PRIN   │  │   REQ    │  │   STKE   │  │   STRAT  │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │              │
     │   ┌─────────┤   ┌────────┤   ┌──────────┘
     │   │  ┌──────┘   │  ┌─────┘   │
     │   │  │    ┌─────┘  │   ┌─────┘
     ▼   ▼  ▼    ▼        ▼   ▼
┌──────────────────────────────────────┐
│         /arckit.framework            │
└──────────────────┬───────────────────┘
                   │
          ┌────────┼────────┐
          ▼                 ▼
  ┌──────────────┐  ┌────────────────┐
  │   Glossary   │  │ Maturity Model │
  └──────────────┘  └────────────────┘
```

**Best Practice**: Run the framework command when you have at least 5 artifacts in place. The framework synthesises and organises -- it needs substantial source material to produce a meaningful structure.

---

## Key Differentiators

| Aspect | `/arckit.framework` | `/arckit.strategy` | `/arckit.presentation` |
|--------|---------------------|--------------------|-----------------------|
| **Purpose** | Organises artifacts into a phased implementation structure | Creates an executive strategic narrative and roadmap | Generates a slide deck for a specific audience |
| **Audience** | All stakeholders (technical, business, executive) | CTO, Strategy Board, senior leadership | Specific target audience (varies) |
| **Output** | Framework directory, overview document, executive guide | Strategy document with vision, goals, roadmap | Presentation slides with speaker notes |
| **Focus** | Implementation sequencing and completeness | Strategic direction and investment case | Communication and persuasion |
| **When to use** | After many artifacts exist, to organise them | Early/mid-project, to set direction | Before a specific meeting or briefing |

---

## Example Usage

### Minimal (5 artifacts)

```bash
# Create the mandatory artifacts
/arckit.principles Create principles for Training Marketplace
/arckit.requirements Create requirements for Training Marketplace

# Add recommended context
/arckit.stakeholders Analyze stakeholders for Training Marketplace
/arckit.strategy Create strategy for Training Marketplace
/arckit.data-model Create data model for Training Marketplace

# Generate framework from available artifacts
/arckit.framework Create framework for Training Marketplace
```

### Comprehensive (15+ artifacts)

```bash
# Build a rich set of artifacts first
/arckit.principles Create principles for NHS Appointment Booking
/arckit.requirements Create requirements for NHS Appointment Booking
/arckit.stakeholders Analyze stakeholders for NHS Appointment Booking
/arckit.strategy Create strategy for NHS Appointment Booking
/arckit.data-model Create data model for NHS Appointment Booking
/arckit.research Research technology options for NHS Appointment Booking
/arckit.sobc Create business case for NHS Appointment Booking
/arckit.risk Create risk register for NHS Appointment Booking
/arckit.adr Record decision on API gateway for NHS Appointment Booking
/arckit.adr Record decision on authentication approach for NHS Appointment Booking
/arckit.diagram Create integration architecture diagram for NHS Appointment Booking
/arckit.wardley Create wardley map for NHS Appointment Booking
/arckit.codes-of-practice Assess codes of practice for NHS Appointment Booking
/arckit.conformance Create conformance assessment for NHS Appointment Booking
/arckit.devops Create DevOps strategy for NHS Appointment Booking

# Generate comprehensive framework
/arckit.framework Create framework for NHS Appointment Booking
```

---

## Tips

- **Run when you have 5+ artifacts**: The framework command synthesises existing work. With fewer than 5 artifacts, the framework will be thin and the phasing less meaningful. Wait until you have substantial material.

- **Re-run to update as artifacts evolve**: As you create new artifacts or update existing ones, re-run the framework command to incorporate new content. A new version (v2.0) will be created, reflecting the latest project state.

- **Adapt phases to your domain**: The default five phases (Foundation, Core, Enhancement, Integration, Optimisation) are starting points. The command analyses your artifacts and adapts phase names and boundaries to suit the project domain.

- **Use the Executive Guide for stakeholder briefings**: The Executive Guide is specifically designed for senior stakeholders who need a concise overview without technical detail. Use it as a briefing document, board paper appendix, or steering committee handout.

- **Pair with maturity model**: After creating the framework, use `/arckit.maturity-model` to define how to measure progress through framework phases and track adoption maturity.

---

## Follow-On Commands

After creating the framework, typical next steps include:

| Command | Purpose |
|---------|---------|
| `/arckit.glossary` | Generate glossary of framework terminology for consistent language |
| `/arckit.maturity-model` | Create maturity model to measure progress through framework phases |

---

## Output Example

```text
## Framework Created

**Framework Overview**: `projects/007-nhs-appointment/ARC-007-FWRK-v1.0.md`
**Executive Guide**: `projects/007-nhs-appointment/framework/NHS-Appointment-Booking-Executive-Guide.md`
**Document ID**: ARC-007-FWRK-v1.0

### Framework Summary
- **Phases Defined**: 5
- **Source Artifacts Analysed**: 12
- **Requirements Mapped**: 47
- **Principles Referenced**: 8
- **Recommendations Categorised**: 63

### Phase Overview
| Phase | Name | Recommendations | Key Artifacts |
|-------|------|-----------------|---------------|
| 1 | Foundation & Governance | 14 | PRIN, STKE, CoP |
| 2 | Core Platform | 18 | REQ, DATA, ADR-001 |
| 3 | Integration & APIs | 12 | REQ (INT), ADR-002, DIAG |
| 4 | Security & Compliance | 10 | RISK, CONF, NFR-SEC |
| 5 | Optimisation & Scale | 9 | WARD, DevOps, NFR-P |

### Executive Guide Highlights
- Strategic context and project rationale
- Phased implementation roadmap (visual timeline)
- Investment summary by phase
- Key risks and mitigations
- Success metrics and governance approach

### Coverage
- All 47 requirements mapped to framework phases
- All 8 architecture principles referenced
- 3 artifacts with no direct framework mapping (flagged for review)

**Framework directory**: `projects/007-nhs-appointment/framework/`
```
