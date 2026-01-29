# ArcKit Command Dependency Structure Matrix (DSM)

This matrix shows which commands depend on outputs from other commands.

**Legend:**
- **M** = MANDATORY dependency (command will fail without it)
- **R** = RECOMMENDED dependency (command works better with it)
- **O** = OPTIONAL dependency (command can use if available)
- **Empty** = No dependency

**Reading the Matrix:**
- **Rows** = Commands that produce outputs
- **Columns** = Commands that consume those outputs
- Example: If row "principles" has "R" in column "stakeholders", it means stakeholders RECOMMENDS having principles first

---

## Dependency Structure Matrix

| PRODUCES → | plan | principles | stakeholders | risk | sobc | requirements | data-model | data-mesh-contract | platform-design | dpia | research | azure-research | wardley | roadmap | adr | sow | dos | gcloud-search | gcloud-clarify | evaluate | hld-review | dld-review | backlog | diagram | servicenow | devops | mlops | finops | operationalize | traceability | analyze | principles-compliance | service-assessment | tcop | ai-playbook | atrs | secure | mod-secure | jsp-936 | story | pages |
|------------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|
| **plan** | - | R | R | R | O | O |  |  |  |  |  |  | O | R |  |  | O | O |  |  | R |  |  |  |  |  |  |  |  |  | R |  | M | O |  |  |  |  |  | R | R |
| **principles** |  | - | M | R | R | R |  |  | M | R |  |  |  | M | M |  | M | R |  |  | M | M |  |  |  | R |  | R |  |  | R | M |  | M |  |  | M | M |  |  | R |
| **stakeholders** |  | O | - | M | M | M | R | O | R | R | O | R | M | O | O | R |  |  |  |  |  | R |  |  |  |  |  |  |  | R | R | R | R |  |  |  |  |  | R | R |
| **risk** |  |  |  | - | M | R |  |  | O | R |  |  |  | R | O |  |  |  |  |  | R | R | R |  |  |  |  |  | R |  | R | R | R |  | R |  | R | R | M | R | R |
| **sobc** |  |  | O | O | - | M | O |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  | R |  | R | R |  |  |  |  |  | R | R |
| **requirements** |  |  |  |  |  | - | M | M | M | M | M | M | M | M | M | M | M | M | R | M | M | M | M | M | M | M | M | M | M | M | R | R | M | M | M | M | M | M | M | R | R |
| **data-model** |  |  |  |  |  |  | - | M | O | M | R | R |  |  |  | O |  |  |  |  |  |  |  | R | R |  | R |  |  | R | R | R | R |  | R |  |  |  |  |  | R |
| **data-mesh-contract** |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |
| **platform-design** |  |  |  |  |  |  | O | R | - | O | O |  | R |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  | R |
| **dpia** |  |  |  |  |  |  |  |  |  | - |  |  |  | O |  | R |  |  |  | O |  |  |  | O |  |  |  |  |  | O | R | R | R |  | R | R | R | R |  | R | R |
| **research** |  |  |  |  |  |  |  |  |  |  | - |  | R |  |  | R |  | R | O | R |  |  |  |  |  | R | R |  |  |  |  |  |  |  | O |  |  |  |  |  | R |
| **azure-research** |  |  |  |  |  |  |  |  |  |  |  | - | R |  | R |  |  |  |  |  |  |  | R | R |  | R | R | R |  |  |  |  |  |  |  |  |  |  |  | R |
| **wardley** |  |  |  |  |  |  |  |  | R |  | O |  | - | R |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  | R |
| **roadmap** |  |  |  |  |  |  |  |  | O |  |  |  | O | - |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R |
| **adr** |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |
| **sow** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  | O |  | R |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  |  | R |
| **dos** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |
| **gcloud-search** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | M |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |
| **gcloud-clarify** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |
| **evaluate** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  |  | R |
| **hld-review** |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  | - | M | M |  |  |  |  |  |  | M |  | R |  |  |  |  |  |  |  | R | R |
| **dld-review** |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  | - | R |  |  |  |  |  |  | M |  | R |  |  |  |  |  |  |  | R | R |
| **backlog** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |
| **diagram** |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  | R | R |  | - | M | R |  | R | R |  | R |  | R |  |  |  | O | O |  |  | R |
| **servicenow** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  | R | O |  |  |  |  |  |  |  |  |  |  | R |
| **devops** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  | R |  |  |  |  |  |  |  |  |  |  |  | R | R |
| **mlops** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  | R | R |
| **finops** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  | R | R |
| **operationalize** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  | R | R |
| **traceability** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  | - | R | R |  |  |  |  |  |  |  | R | R |
| **analyze** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | O | R | O |  |  |  |  |  | O | R |
| **principles-compliance** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  |  | R |
| **service-assessment** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | O | - |  |  |  |  |  |  | R | R |
| **tcop** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R | R | - |  |  |  |  |  |  | R |
| **ai-playbook** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  | O |  | R |  | - | R |  |  | R |  | R |
| **atrs** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  | - |  |  | R |  | R |
| **secure** |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | R | R |  | O | O | - | R | O | R | R |
| **mod-secure** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | R | O |  |  |  |  | - | R |  | R |
| **jsp-936** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  | O |  |  |  |  |  | - |  | R |
| **story** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  | O |  |  |  |  |  |  | - | R |
| **pages** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |
| **HLD (external)** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | M | O |  |  | R |  |  |  |  | M | O |  | R |  |  |  |  |  |  |  | R |
| **DLD (external)** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | M | M |  |  |  |  |  |  | M |  |  | R |  |  |  |  |  |  |  | R |

## Command Groups by Dependency Level

### Tier 0: Foundation (No Mandatory Dependencies)
These commands can run first:
- **plan** - Project planning and timeline (can optionally read: stakeholders, requirements, principles, sobc, risk if they exist)
- **principles** - Architecture principles

### Tier 1: Strategic Context (Depends on Foundation)
- **stakeholders** → Depends on: principles (R)
- **risk** → Depends on: principles (R), stakeholders (R)

### Tier 2: Business Justification
- **sobc** → Depends on: stakeholders (M), risk (R), principles (R)

### Tier 3: Requirements Definition
- **requirements** → Depends on: stakeholders (R), sobc (R), principles (R)

### Tier 3.5: Strategic Planning (Platform Strategy)
- **platform-design** → Depends on: principles (M), stakeholders (R), requirements (R), wardley (R), risk (O), sobc (O), data-model (O)
  - Note: Designs multi-sided platform strategy using Platform Design Toolkit (PDT) methodology
  - Best run after requirements when designing ecosystem-based platforms (Government as a Platform, marketplaces, data platforms)
  - Can run earlier if stakeholders and principles exist (requirements/wardley are recommended for better auto-population)

### Tier 4: Detailed Design (Depends on Requirements)
All these commands REQUIRE ARC-*-REQ-*.md:
- **data-model** → Depends on: requirements (M), stakeholders (R), sobc (O)
- **dpia** → Depends on: data-model (M), requirements (R), principles (R), stakeholders (R)
- **research** → Depends on: requirements (M), stakeholders (R), data-model (R), platform-design (R)
- **azure-research** → Depends on: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
  - Note: Requires Microsoft Learn MCP server to be installed for authoritative Azure documentation
- **wardley** → Depends on: requirements (M), research (M), platform-design (R)
- **diagram** → Depends on: requirements (M), platform-design (R)

### Tier 5: Procurement (Depends on Requirements)
All procurement commands REQUIRE ARC-*-REQ-*.md:
- **sow** → Depends on: requirements (M), research (R)
- **dos** → Depends on: requirements (M), principles (M), stakeholders (R)
- **gcloud-search** → Depends on: requirements (M), research (R), principles (R)
- **gcloud-clarify** → Depends on: requirements (M), gcloud-search (M)
- **evaluate** → Depends on: requirements (M), principles (M), sow/dos (R), research (R), gcloud-clarify (R)

### Tier 6: Design Reviews (Depends on Design Documents + Requirements)
- **hld-review** → Depends on: requirements (M), principles (M), HLD (M)
- **dld-review** → Depends on: requirements (M), principles (M), HLD (M), DLD (M)

### Tier 7: Implementation Planning (Depends on Design Reviews)
- **backlog** → Depends on: requirements (M), HLD (M), stakeholders (R), risk (R)

### Tier 8: Operations (Depends on Architecture)
- **servicenow** → Depends on: requirements (M), diagram (R), data-model (R)
- **devops** → Depends on: requirements (M), diagram (R), research (R), principles (R)
- **mlops** → Depends on: requirements (M), data-model (R), ai-playbook (R), research (R) [for AI projects]
- **finops** → Depends on: requirements (M), devops (R), diagram (R), principles (R)
- **operationalize** → Depends on: requirements (M), servicenow (R), diagram (R), risk (R)
- **traceability** → Depends on: requirements (M), HLD (M), DLD (M), data-model (R)

### Tier 9: Quality Assurance (Can Run Before or After Compliance)
- **analyze** → Depends on: principles (O), stakeholders (O), risk (O), sobc (O), requirements (O), data-model (O), platform-design (O), sow (O), evaluate (O), traceability (O), tcop (O), ai-playbook (O), atrs (O), mod-secure (O)
  - Note: All dependencies are optional - analyze identifies gaps for missing artifacts

### Tier 10: Compliance Assessment (Depends on Multiple Artifacts)
These assess compliance across the project:
- **principles-compliance** → Depends on: principles (M), requirements (R), stakeholders (R), risk (R), data-model (R), platform-design (R), HLD (R), DLD (R), hld-review (R), dld-review (R), traceability (R), dpia (R), tcop (R), secure (R), mod-secure (R)
  - Note: All dependencies except principles are RECOMMENDED - better assessment with more artifacts
- **service-assessment** → Depends on: requirements (M), plan (R), data-model (R), platform-design (O), principles (R), stakeholders (R), risk (R), analyze (R), hld-review (R), dld-review (R), diagram (R), traceability (R), wardley (R), tcop (O), ai-playbook (O), atrs (O), secure (O), mod-secure (O), jsp-936 (O), principles-compliance (O)
  - Note: Compliance artifacts are optional - service-assessment identifies them as gaps if missing
- **tcop** → Depends on: requirements (M), principles (M)
- **ai-playbook** → Depends on: requirements (O) [if AI system]
- **atrs** → Depends on: requirements (O) [if AI system]
- **secure** → Depends on: requirements (M), principles (M), risk (R)
- **mod-secure** → Depends on: requirements (M), principles (M), risk (R)
- **jsp-936** → Depends on: requirements (M) [if MOD AI system]

### Tier 11: Project Story & Reporting (Depends on All Artifacts)
Final reporting command that creates comprehensive project narrative:
- **story** → Depends on: All artifacts (O)
  - Note: All dependencies are optional - story scans and reports on whatever artifacts exist in the project
  - Generates comprehensive historical record with timeline analysis, traceability chains, governance achievements
  - Best run at project milestones or completion when most/all artifacts are complete

### Tier 12: Documentation Publishing (Utility)
Publishing command that generates documentation site:
- **pages** → Depends on: All document-producing artifacts (R)
  - Note: pages indexes and displays all project documents - more documents = better site
  - Recommended dependencies: principles, stakeholders, risk, sobc, requirements, data-model, dpia, research, wardley, roadmap, adr, sow, evaluate, hld-review, dld-review, backlog, diagram, servicenow, traceability, analyze, principles-compliance, service-assessment, tcop, ai-playbook, atrs, secure, mod-secure, jsp-936, story, HLD, DLD
  - Generates GitHub Pages site with Mermaid diagram support
  - Best run when project has substantial documentation to publish

---

## Critical Paths

### Standard Project Path (Non-AI, Non-Government)
```
plan → principles → stakeholders → risk → sobc → requirements → research → wardley →
sow/evaluate → hld-review → backlog → servicenow → devops → operationalize →
traceability → principles-compliance → analyze → story
```

### UK Government Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → gcloud-search → gcloud-clarify → evaluate → hld-review → dld-review →
backlog → servicenow → devops → operationalize → traceability →
tcop → secure → principles-compliance → analyze → service-assessment → story
```

### UK Government Platform Strategy Path
```
plan → principles → stakeholders → risk → sobc → requirements → platform-design → data-model → research →
wardley → gcloud-search → evaluate → hld-review → dld-review → backlog → servicenow →
devops → operationalize → traceability → tcop → secure → principles-compliance →
analyze → service-assessment → story
```

### UK Government AI Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → gcloud-search → evaluate → hld-review → dld-review → backlog → servicenow →
devops → mlops → operationalize → traceability → tcop → ai-playbook → atrs → secure →
principles-compliance → analyze → service-assessment → story
```

### MOD Defence Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → dos → evaluate → hld-review → dld-review → backlog → servicenow →
devops → operationalize → traceability → tcop → mod-secure → principles-compliance →
analyze → service-assessment → story
```

### MOD Defence AI Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → dos → evaluate → hld-review → dld-review → backlog → servicenow →
devops → mlops → operationalize → traceability → tcop → mod-secure → jsp-936 →
principles-compliance → analyze → service-assessment → story
```

**Note**: analyze and service-assessment can also run earlier in the workflow to identify gaps in missing artifacts (all their dependencies are optional). The story command can be run at any project milestone to create a narrative snapshot, but is most comprehensive when run after all artifacts are complete. The paths above show the complete workflow with story as the final reporting step.

**Platform Design**: The platform-design command is used when designing multi-sided platforms (Government as a Platform, marketplaces, data platforms) and should be inserted after requirements definition but before detailed design. See "UK Government Platform Strategy Path" above.

---

## Artifact Dependencies Summary

### Commands That Are Frequently Consumed (High Fan-In)

**ARC-*-REQ-*.md** - consumed by 27 commands:
- platform-design (R), data-model (M), research (M), wardley (M), sow (M), dos (M), gcloud-search (M), evaluate (M), hld-review (M), dld-review (M), backlog (M), diagram (M), servicenow (M), devops (M), mlops (M), finops (M), operationalize (M), traceability (M), analyze (O), service-assessment (M), tcop (M), ai-playbook (O), atrs (O), secure (M), mod-secure (M), jsp-936 (M), gcloud-clarify (M - implicit)

**ARC-000-PRIN-v*.md** - consumed by 17 commands:
- platform-design (M), stakeholders (R), risk (R), sobc (R), requirements (R), dos (M), gcloud-search (R), evaluate (M), hld-review (M), dld-review (M), devops (R), finops (R), analyze (O), service-assessment (R), tcop (M), secure (M), mod-secure (M)

**ARC-*-STKE-*.md** - consumed by 10 commands:
- platform-design (R), risk (R), sobc (M), requirements (R), data-model (R), research (R), dos (R), backlog (R), analyze (O), service-assessment (R)

**HLD** (external document) - consumed by 7 commands:
- dld-review (M), backlog (M), diagram (R), servicenow (R), traceability (M), hld-review (validates it), service-assessment (M)
  - Note: analyze reads HLD directly if available (O), not via hld-review

**ARC-*-PLAT-*.md** - consumed by 6 commands:
- research (R), wardley (R), diagram (R), analyze (M), principles-compliance (R), service-assessment (R)

### Commands That Produce Critical Artifacts (High Fan-Out)

**requirements** produces ARC-*-REQ-*.md → consumed by 23 commands (highest)
**principles** produces ARC-000-PRIN-v*.md → consumed by 15 commands
**stakeholders** produces ARC-*-STKE-*.md → consumed by 10 commands
**HLD** (external) → consumed by 7 commands
**risk** produces ARC-*-RISK-*.md → consumed by 6 commands
**platform-design** produces ARC-*-PLAT-v*.md → consumed by 6 commands

---

## Design Notes

1. **ARC-*-REQ-*.md is the central artifact** - Nearly all downstream commands depend on it
2. **ARC-000-PRIN-v*.md is the governance foundation** - All design reviews check against principles
3. **Strategic order matters** - stakeholders → risk → sobc → requirements ensures business justification before technical work
4. **Platform strategy bridges business and technical** - platform-design sits between requirements (business needs) and design (technical architecture), useful for ecosystem-based platforms
5. **Quality gates can run iteratively** - analyze and service-assessment have optional dependencies, allowing them to run early (identifying gaps) or late (validating completeness)
6. **Compliance assessments feed quality gates** - tcop, ai-playbook, atrs, secure, mod-secure, jsp-936 outputs are optionally consumed by analyze and service-assessment
7. **External artifacts** - HLD and DLD are created outside ArcKit but validated by hld-review/dld-review commands

---

## Version

- **ArcKit Version**: 1.0.2
- **Matrix Date**: 2026-01-29 (Added azure-research command)
- **Commands Documented**: 41
- **Matrix Rows**: 43 (41 commands + 2 external documents)

## Changelog

### 2026-01-29 - Added Azure Research Command
- **Added**: `/arckit.azure-research` command (41st ArcKit command) for Azure-specific technology research using Microsoft Learn MCP server
- **Added**: azure-research row and column to dependency matrix
- **Updated**: Tier 4 Detailed Design to include azure-research command
- **Dependencies**: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
- **Consumed by**: diagram (R), devops (R), finops (R), adr (R), secure (O), pages (R)
- **Note**: Requires Microsoft Learn MCP server for authoritative Azure documentation

### 2026-01-28 - Added Missing Operations Commands to Matrix
- **Fixed**: Added devops, mlops, finops, operationalize rows and columns to the matrix
- **Updated**: ARC-*-REQ-*.md consumption count from 23 to 27 commands
- **Updated**: ARC-000-PRIN-v*.md consumption count from 15 to 17 commands
- **Note**: These commands were documented in Tier 8 but missing from the actual DSM table

### 2026-01-28 - Standardized Filename Patterns
- **Updated**: All filename references now use Document ID pattern `ARC-{PROJECT_ID}-{TYPE}-v*.md`
- **Updated**: Multi-instance types use `ARC-{PROJECT_ID}-{TYPE}-{NUM}-v*.md` (ADR, DIAG, WARD, DMC)
- **Updated**: Subdirectory references use explicit patterns (`wardley-maps/ARC-*-WARD-*.md`, `diagrams/ARC-*-DIAG-*.md`)
- **Updated**: Vendor submissions use versioned pattern (`hld-v*.md`, `dld-v*.md`)
- **Version**: Bumped to 1.0.0

### 2026-01-22 - Added Pages Command
- **Added**: `/arckit.pages` command (40th ArcKit command) for GitHub Pages documentation site generation with Mermaid diagram support
- **Category**: Documentation & Publishing
- **Dependencies**: None (utility command)

### 2026-01-21 - Added FinOps Command
- **Added**: `/arckit.finops` command (39th ArcKit command) for FinOps strategy with cloud cost management, optimization, governance, and forecasting
- **Updated**: Tier 8 Operations to include finops command
- **Dependencies**: requirements (M), devops (R), diagram (R), principles (R)

### 2026-01-09 - Added DevOps, MLOps, and Operationalize Commands
- **Added**: `/arckit.devops` command (34th ArcKit command) for DevOps strategy with CI/CD pipelines, IaC, container orchestration
- **Added**: `/arckit.mlops` command (35th ArcKit command) for MLOps strategy with model lifecycle, training pipelines, serving, monitoring
- **Added**: `/arckit.operationalize` command (36th ArcKit command) for operational readiness with SRE practices, runbooks, DR/BCP
- **Updated**: Tier 8 Operations to include devops, mlops (AI projects), operationalize commands
- **Updated**: All 6 critical paths to include new commands in operations phase
- **Dependencies**:
  - devops: requirements (M), diagram (R), research (R), principles (R)
  - mlops: requirements (M), data-model (R), ai-playbook (R), research (R)
  - operationalize: requirements (M), servicenow (R), diagram (R), risk (R)

### 2025-01-06 - Added Platform Design Command
- **Added**: `/arckit.platform-design` command (33rd ArcKit command) for multi-sided platform strategy design using Platform Design Toolkit (PDT) methodology
- **Added**: platform-design row and column to dependency matrix
- **Added**: New critical path: "UK Government Platform Strategy Path" showing where platform-design fits
- **Added**: Tier 3.5 "Strategic Planning (Platform Strategy)" for platform-design placement
- **Updated**: Tier 4 commands to optionally consume platform-design (research R, wardley R, diagram R)
- **Updated**: analyze to consume platform-design (O), principles-compliance (R), service-assessment (O)
- **Dependencies**: principles (M), stakeholders (R), requirements (R), wardley (R), risk (O), sobc (O), data-model (O)
- **Consumed by**: research (R), wardley (R), diagram (R), analyze (M), principles-compliance (R), service-assessment (R)
- **Use case**: Designing Government as a Platform (GaaP) services, data marketplaces, multi-sided platforms

### 2025-11-04 - Added Principles Compliance Command
- **Added**: `/arckit.principles-compliance` command for measuring architecture principles adherence
- **Added**: principles-compliance row and column to dependency matrix
- **Updated**: All critical paths to include principles-compliance assessment
- **Updated**: Tier 10 description to include principles-compliance command
- **Updated**: service-assessment to optionally consume principles-compliance output (O)
- **Dependencies**: principles (M), requirements (R), stakeholders (R), risk (R), data-model (R), HLD (R), DLD (R), hld-review (R), dld-review (R), traceability (R), dpia (R), tcop (R), secure (R), mod-secure (R)

### 2025-11-02 - Critical Fixes + Optional Dependencies
- **Added**: analyze row showing optional dependencies on all artifacts
- **Fixed**: service-assessment compliance dependencies changed from M to O (tcop, ai-playbook, atrs, secure, mod-secure, jsp-936)
- **Fixed**: analyze compliance dependencies changed from M to O (tcop, ai-playbook, atrs, mod-secure)
- **Updated**: Critical paths reordered to show compliance commands before quality gates
- **Updated**: Tier 9 and Tier 10 descriptions to reflect optional dependencies and iterative execution
- **Added**: 23 optional dependencies to complete matrix:
  - plan: principles, stakeholders, risk, sobc, requirements (5)
  - diagram: principles, DLD, tcop, ai-playbook, atrs (5)
  - wardley: principles, tcop, ai-playbook, atrs (4)
  - tcop: diagram, wardley (2)
  - ai-playbook: diagram, wardley, atrs (3)
  - atrs: diagram, wardley (2)
  - secure: diagram (1)
  - mod-secure: diagram (1)
  - jsp-936: data-model, diagram (2)
  - sow: dos, hld-review (2)
  - DLD: diagram (1)
- **Updated Templates**:
  - architecture-diagram-template.md: Added ATRS to Linked Artifacts
  - wardley-map-template.md: Added AI Playbook/ATRS mapping sections for AI systems