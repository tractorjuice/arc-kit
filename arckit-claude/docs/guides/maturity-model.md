# Maturity Model Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.maturity-model` generates a domain-specific capability maturity model with 5 maturity levels, assessment criteria per dimension, and a self-assessment questionnaire for baseline and progress measurement.

---

## Purpose

Organisations often lack a structured way to understand where they are today and where they need to be. Maturity models provide a repeatable framework for:

- **Structured improvement** -- moving from ad-hoc practices to optimised, data-driven operations across defined capability dimensions
- **Measurable progress** -- concrete evidence criteria at each level so teams can objectively demonstrate advancement
- **Stakeholder alignment** -- a shared language for discussing current state vs target state with leadership, delivery teams, and governance bodies
- **Investment prioritisation** -- directing effort and funding toward the capability dimensions with the greatest gap between current and target maturity

The `/arckit.maturity-model` command **analyses project artifacts and domain context** to produce a tailored maturity model that:

- Defines 4-6 capability dimensions relevant to the specific project domain
- Provides 5 maturity levels per dimension with measurable evidence criteria
- Includes transition criteria for progressing between levels
- Creates a self-assessment questionnaire with calibrated answers
- Maps architecture principles to capability dimensions for traceability

---

## Inputs

| Artifact | Requirement | What It Provides |
|----------|-------------|------------------|
| Architecture Principles | Recommended | Guiding principles to align maturity dimensions with, governance standards |
| Architecture Strategy | Optional | Strategic themes, capability targets, current and target state vision |
| Requirements Specification | Optional | Non-functional requirements implying maturity targets (performance, security, data quality) |
| Stakeholder Analysis | Optional | Stakeholder expectations for capability maturity, governance bodies responsible for assessment |
| Risk Register | Optional | Risks indicating capability gaps or maturity deficiencies |
| Data Model | Optional | Data governance maturity indicators, data quality dimensions, metadata management maturity |

> **Note**: At minimum, have architecture principles in place before running. The more artifacts available, the more precisely the maturity dimensions can be tailored to the project context.

---

## Command

```bash
/arckit.maturity-model Create maturity model for <project-name>
```

Outputs: `projects/<id>/ARC-<id>-MMOD-v1.0.md`

---

## Maturity Model Structure

| Section | Contents |
|---------|----------|
| **Document Control** | Document ID, version, owner, classification, review cycle |
| **Capability Dimensions** | 4-6 domain-specific dimensions with name, scope, business justification, and principles alignment |
| **Maturity Level Definitions** | 5 levels per dimension (Initial through Optimised) with characteristics, evidence criteria, and examples |
| **Transition Criteria** | Specific, measurable requirements for progressing from one level to the next |
| **Self-Assessment Questionnaire** | 3-5 calibrated questions per dimension with L1, L3, and L5 example responses |
| **Principles-to-Dimensions Matrix** | Traceability showing which principles drive which dimensions |
| **Assessment Summary** | Scoring template for recording baseline and target maturity per dimension |

---

## Workflow Position

The maturity model sits after foundational artifacts and before execution planning:

```text
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Principles  │    │   Strategy   │    │ Requirements │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ /arckit.maturity-model │
              └────────────┬───────────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
       ┌──────────────┐         ┌──────────────┐
       │   Roadmap    │         │   Strategy   │
       └──────────────┘         └──────────────┘
```

**Best Practice**: Create the maturity model AFTER architecture principles are defined. Principles anchor the capability dimensions and ensure you are measuring what the organisation has agreed matters.

---

## Example Usage

### Minimal (Principles only)

```bash
# Ensure principles exist
/arckit.principles Create principles for Data Platform

# Generate maturity model
/arckit.maturity-model Create maturity model for Data Platform
```

### Comprehensive (With strategy and requirements)

```bash
# Create foundational artifacts first
/arckit.principles Create principles for Cloud Migration
/arckit.strategy Create strategy for Cloud Migration
/arckit.requirements Create requirements for Cloud Migration
/arckit.stakeholders Analyze stakeholders for Cloud Migration
/arckit.risk Create risk register for Cloud Migration

# Generate maturity model with full context
/arckit.maturity-model Create maturity model for Cloud Migration
```

---

## Key Differentiators

| Aspect | Maturity Model | Strategy | Roadmap |
|--------|---------------|----------|---------|
| **Audience** | Assessment teams, governance boards | Leadership, sponsors | Delivery teams, programme managers |
| **Focus** | Current capability level and improvement criteria | Vision, strategic themes, target state | Phased delivery plan with timelines |
| **Output** | Level definitions, assessment questionnaire, transition criteria | Strategic objectives, capability targets, principles | Milestones, dependencies, resource plans |

---

## Tips

- **Customise dimensions to the project domain**: The maturity model dimensions are derived from project context, not a generic framework. A data management project will have very different dimensions to a cloud migration or digital service project.

- **Use the assessment with stakeholders**: Run the self-assessment questionnaire as a workshop exercise. Comparing scores across teams reveals alignment gaps and areas of disagreement about current capability.

- **Align dimensions to architecture principles**: Every capability dimension should trace back to one or more principles. If a dimension lacks principle coverage, consider whether a principle is missing or the dimension is out of scope.

- **Version as maturity improves**: Re-run the maturity model periodically (quarterly recommended) to create a new version that captures progress. Comparing v1.0 to v2.0 provides concrete evidence of improvement to stakeholders and governance boards.

---

## Follow-On Commands

After creating the maturity model, typical next steps include:

| Command | Purpose |
|---------|---------|
| `/arckit.roadmap` | Create a phased roadmap based on maturity progression targets |
| `/arckit.strategy` | Incorporate maturity targets into the architecture strategy |

---

## Output Example

```text
## Capability Maturity Model Created

**Document**: `projects/011-national-highways-data/ARC-011-MMOD-v1.0.md`
**Document ID**: ARC-011-MMOD-v1.0

### Maturity Model Overview
- **Capability Dimensions**: 5 dimensions defined
- **Maturity Levels**: 5 levels per dimension (L1 Initial through L5 Optimised)
- **Assessment Questions**: 4 questions per dimension (20 total)
- **Principles Mapped**: 8 principles aligned to dimensions

### Dimensions Defined
1. **Data Quality Management**: Accuracy, completeness, and timeliness of highway data assets
2. **Data Governance**: Policies, ownership, stewardship, and compliance across data domains
3. **Data Integration**: Interoperability, API maturity, and real-time data exchange capabilities
4. **Analytics & Insight**: Descriptive, predictive, and prescriptive analytics capability
5. **Data Security & Privacy**: Classification, access control, and regulatory compliance

### Source Artifacts
- ARC-000-PRIN-v1.0.md (Architecture Principles)
- ARC-011-STRAT-v1.0.md (Architecture Strategy)
- ARC-011-REQ-v1.0.md (Requirements Specification)

### Coverage Gaps
- Stakeholder Analysis not available (would refine governance dimension)
- Risk Register not available (would highlight capability gap risks)

**File location**: `projects/011-national-highways-data/ARC-011-MMOD-v1.0.md`
```
