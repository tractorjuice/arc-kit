# Glossary Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.glossary` consolidates terms, acronyms, and definitions from all project artifacts into a single authoritative reference document.

---

## Purpose

Architecture projects accumulate terminology across dozens of artifacts: requirements introduce domain-specific language, data models define entity names, stakeholder analyses reference governance bodies, and business cases use financial jargon. Without a single source of truth for terminology, teams suffer from:

- **Ambiguity** -- the same term means different things to different people
- **Onboarding friction** -- new team members spend weeks decoding project-specific language
- **Inconsistent language** -- artifacts use different terms for the same concept

The `/arckit.glossary` command **extracts and consolidates** all terminology from existing artifacts into a structured glossary that:

- Provides a shared vocabulary for the entire project team
- Reduces miscommunication between business and technical stakeholders
- Onboards new team members quickly with clear, authoritative definitions
- Ensures consistent language across all architecture artifacts
- Flags terminology inconsistencies found across documents

---

## Inputs

| Artifact | Requirement | What It Provides |
|----------|-------------|------------------|
| Requirements Specification | Recommended | Domain terms, requirement ID prefixes, technical/business terms, acronyms |
| Data Model | Recommended | Entity names, attribute definitions, data types, relationship terminology |
| Stakeholder Analysis | Optional | Role titles, organizational terms, governance bodies |
| Architecture Principles | Optional | Principle names, governance terminology, compliance terms |
| Strategic Business Case | Optional | Financial/business terms, investment terminology |
| Research Report | Optional | Technology terms, vendor-specific terminology, industry standards |
| Architecture Decision Records | Optional | Architectural pattern names, technology choices |
| Architecture Strategy | Optional | Strategic themes, capability terms, maturity model terminology |
| Risk Register | Optional | Risk categories, mitigation terms, likelihood/impact terminology |

> **Note**: The more artifacts available, the more comprehensive the glossary. At minimum, have requirements or a data model in place before running.

---

## Command

```bash
/arckit.glossary Generate glossary for <project-name>
```

Outputs: `projects/<id>/ARC-<id>-GLOS-v1.0.md`

---

## Glossary Structure

| Section | Contents |
|---------|----------|
| **Document Control** | Document ID, version, owner, classification, review cycle |
| **Business Terms** | Domain-specific business terminology with definitions |
| **Technical Terms** | Architecture patterns, technology terms, standards |
| **Governance Terms** | Compliance frameworks, assessment criteria, maturity levels |
| **Financial Terms** | Investment terminology, procurement vehicle names |
| **Data Terms** | Entity names, attribute definitions, data types |
| **Security Terms** | Security standards, classification levels, access control terms |
| **Acronyms and Abbreviations** | Quick-reference table of all acronyms with expansions |
| **Standards Referenced** | Named standards with versions and URLs |
| **Cross-Reference Index** | Related terms linked for navigation |
| **Consistency Notes** | Terms with conflicting definitions across artifacts |

---

## Workflow Position

The glossary command sits at a consolidation point in the ArcKit workflow -- it reads existing artifacts to extract terminology:

```text
┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Requirements │    │  Data Model │    │ Stakeholders │
└──────┬───────┘    └──────┬──────┘    └──────┬───────┘
       │                   │                  │
       └───────────────────┼──────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  /arckit.glossary   │
                └──────────┬──────────┘
                           │
              ┌────────────┼────────────┐
              ▼                         ▼
       ┌──────────────┐         ┌─────────────┐
       │ Presentation │         │  Framework  │
       └──────────────┘         └─────────────┘
```

**Best Practice**: Create the glossary AFTER you have built several artifacts (requirements, data model, stakeholders at minimum). The glossary extracts terminology -- it needs source material to work from.

---

## Example Usage

### Minimal (Requirements only)

```bash
# Ensure at least one artifact exists
/arckit.requirements Create requirements for Smart Meter App

# Generate glossary from available artifacts
/arckit.glossary Generate glossary for Smart Meter App
```

### Comprehensive (Many artifacts available)

```bash
# Create multiple artifacts first
/arckit.requirements Create requirements for Fuel Price Service
/arckit.data-model Create data model for Fuel Price Service
/arckit.stakeholders Analyze stakeholders for Fuel Price Service
/arckit.principles Create principles for Fuel Price Service
/arckit.sobc Create business case for Fuel Price Service
/arckit.research Research technology options for Fuel Price Service
/arckit.adr Record decision on API gateway for Fuel Price Service

# Generate comprehensive glossary
/arckit.glossary Generate glossary for Fuel Price Service
```

---

## Tips

- **Run after multiple artifacts exist**: The glossary extracts terminology from existing documents. The more artifacts available, the more comprehensive and useful the glossary will be.

- **Update as new artifacts are created**: When you add new artifacts (ADRs, risk registers, research reports), re-run the glossary command to capture new terminology. A new version (v2.0) will be created.

- **Use "all projects" scope for cross-project glossaries**: Run `/arckit.glossary Generate glossary for all projects` to create a consolidated glossary across all project directories, saved in `projects/000-global/`.

- **Review with domain experts**: The glossary infers definitions from artifact context. Have domain experts validate definitions, especially for business-specific terms that may have organisation-specific meanings.

- **Resolve inconsistencies**: The glossary flags terms defined differently across artifacts. Use these flags as a prompt to align terminology across your project.

---

## Follow-On Commands

After creating the glossary, typical next steps include:

| Command | Purpose |
|---------|---------|
| `/arckit.data-model` | Review data model using validated entity/attribute names from glossary |
| `/arckit.framework` | Create assessment framework with consistent terminology |

---

## Output Example

```text
## Project Glossary Created

**Document**: `projects/017-fuel-prices/ARC-017-GLOS-v1.0.md`
**Document ID**: ARC-017-GLOS-v1.0

### Glossary Overview
- **Total Terms Defined**: 87
- **Acronyms Catalogued**: 34
- **Standards Referenced**: 12
- **Source Artifacts Scanned**: 5

### Terms by Category
- **Business**: 18 terms
- **Technical**: 24 terms
- **Governance**: 11 terms
- **Financial**: 9 terms
- **Data**: 16 terms
- **Security**: 9 terms

### Source Artifacts
- ARC-017-REQ-v1.0.md (Requirements Specification)
- ARC-017-DATA-v1.0.md (Data Model)
- ARC-017-STKE-v1.0.md (Stakeholder Analysis)
- ARC-017-SOBC-v1.0.md (Strategic Business Case)
- ARC-000-PRIN-v1.0.md (Architecture Principles)

### Coverage Gaps
- Risk Register not available (would add risk/mitigation terminology)
- Research Report not available (would add vendor/technology terminology)
- 3 terms flagged with ambiguous definitions requiring expert review

**File location**: `projects/017-fuel-prices/ARC-017-GLOS-v1.0.md`
```
