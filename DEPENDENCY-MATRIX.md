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

| PRODUCES → | plan | principles | stakeholders | risk | sobc | requirements | data-model | data-mesh-contract | dpia | research | wardley | sow | dos | gcloud-search | gcloud-clarify | evaluate | hld-review | dld-review | backlog | diagram | servicenow | traceability | analyze | principles-compliance | service-assessment | tcop | ai-playbook | atrs | secure | mod-secure | jsp-936 | story |
|------------|------|------------|--------------|------|------|--------------|------------|------------------|------|----------|---------|-----|-----|---------------|----------------|----------|------------|------------|---------|---------|------------|--------------|---------|-------------------|------|-------------|------|--------|------------|---------|-------|
| **plan** | - | O | O | O | O | O | | | | | | | | | | | | | | | | | | | R | | | | | | | | O |
| **principles** | O | - | R | R | R | R | | | R | | O | | M | R | | M | M | M | | O | | | M | M | R | M | | | M | M | | O |
| **stakeholders** | O | | - | R | M | R | R | | R | R | | | R | | | | | | R | | | | M | R | R | | | | | | | O |
| **risk** | O | | | - | R | R | | | R | | | | | | | | | | R | | | | M | R | R | | | | R | R | | O |
| **sobc** | O | | | | - | R | O | | | | | | | | | | | | | | | | R | | R | | | | | | | O |
| **requirements** | O | | | | | - | M | R | R | M | M | M | M | M | | M | M | M | M | M | M | M | M | R | M | M | O | O | M | M | M | O |
| **data-model** | | | | | | | - | M | M | R | | | | | | | | | R | R | R | R | M | R | R | | | | | | O | O |
| **data-mesh-contract** | | | | | | | | - | R | R | | | | | | | | | | | | R | M | R | R | | | | | | | O |
| **dpia** | | | | R | | | | | - | R | | | | | | | | | R | R | | | R | R | M | R | | R | R | R | R | R | O |
| **research** | | | | | | | | | | - | M | R | | R | | R | | | | | | | M | | R | | | | | | | O |
| **wardley** | | | | | | | | | | | - | R | | | | R | | | | | | | M | | R | | | | | | | O |
| **sow** | | | | | | | | | | | | - | O | | | R | O | | | | | | M | | | | | | | | | O |
| **dos** | | | | | | | | | | | | | - | | | R | | | | | | | M | | | | | | | | | O |
| **gcloud-search** | | | | | | | | | | | | | | - | M | R | | | | | | | M | | | | | | | | | O |
| **gcloud-clarify** | | | | | | | | | | | | | | | - | R | | | | | | | M | | | | | | | | | O |
| **evaluate** | | | | | | | | | | | | | | | | - | | | | | | | M | | | | | | | | | O |
| **HLD** (external) | | | | | | | | | | | | | | | | | - | M | M | R | R | M | M | R | M | | | | | | | O |
| **DLD** (external) | | | | | | | | | | | | | | | | | | - | R | O | | M | M | R | M | | | | | | | O |
| **diagram** | | | | | | | | | | | | | | | | | | | | - | R | R | M | | R | O | | | O | O | O | O |
| **hld-review** | | | | | | | | | | | | | | | | | | | | | | | M | R | R | | | | | | | O |
| **dld-review** | | | | | | | | | | | | | | | | | | | | | | | M | R | R | | | | | | | O |
| **backlog** | | | | | | | | | | | | | | | | | | | - | | | | M | | R | | | | | | | O |
| **servicenow** | | | | | | | | | | | | | | | | | | | | | - | | M | | R | | | | | | | O |
| **traceability** | | | | | | | | | | | | | | | | | | | | | | - | M | R | R | | | | | | | O |
| **analyze** | | O | O | O | O | O | O | | O | | | O | | | | O | | | | | | O | - | O | | O | O | O | | O | | O |
| **principles-compliance** | | | | | | | | | | | | | | | | | | | | | | | O | - | O | | | | | | | O |
| **service-assessment** | | | | | | | | | O | | | | | | | | | | | | | | | O | - | O | O | O | O | O | O | O |
| **tcop** | | | | | | | | | | | O | | | | | | | | | O | | | O | R | O | - | | | O | | | O |
| **ai-playbook** | | | | | | | | | R | | O | | | | | | | | | O | | | O | | O | | - | O | | | | O |
| **atrs** | | | | | | | | | R | | O | | | | | | | | | O | | | O | | O | | | - | | | | O |
| **secure** | | | | | | | | | R | | | | | | | | | | | O | | | O | R | O | | | | - | | | O |
| **mod-secure** | | | | | | | | | R | | | | | | | | | | | O | | | O | R | O | | | | | - | | O |
| **jsp-936** | | | | | | | | | R | | | | | | | | | | | O | | | O | | O | | | | | | - | O |
| **story** | | | | | | | | O | | | | | | | | | | | | | | | O | | | | | | | | - |

---

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

### Tier 4: Detailed Design (Depends on Requirements)
All these commands REQUIRE requirements.md:
- **data-model** → Depends on: requirements (M), stakeholders (R), sobc (O)
- **dpia** → Depends on: data-model (M), requirements (R), principles (R), stakeholders (R)
- **research** → Depends on: requirements (M), stakeholders (R), data-model (R)
- **wardley** → Depends on: requirements (M), research (M)
- **diagram** → Depends on: requirements (M)

### Tier 5: Procurement (Depends on Requirements)
All procurement commands REQUIRE requirements.md:
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
- **traceability** → Depends on: requirements (M), HLD (M), DLD (M), data-model (R)

### Tier 9: Quality Assurance (Can Run Before or After Compliance)
- **analyze** → Depends on: principles (O), stakeholders (O), risk (O), sobc (O), requirements (O), data-model (O), sow (O), evaluate (O), traceability (O), tcop (O), ai-playbook (O), atrs (O), mod-secure (O)
  - Note: All dependencies are optional - analyze identifies gaps for missing artifacts

### Tier 10: Compliance Assessment (Depends on Multiple Artifacts)
These assess compliance across the project:
- **principles-compliance** → Depends on: principles (M), requirements (R), stakeholders (R), risk (R), data-model (R), HLD (R), DLD (R), hld-review (R), dld-review (R), traceability (R), dpia (R), tcop (R), secure (R), mod-secure (R)
  - Note: All dependencies except principles are RECOMMENDED - better assessment with more artifacts
- **service-assessment** → Depends on: requirements (M), plan (R), data-model (R), principles (R), stakeholders (R), risk (R), analyze (R), hld-review (R), dld-review (R), diagram (R), traceability (R), wardley (R), tcop (O), ai-playbook (O), atrs (O), secure (O), mod-secure (O), jsp-936 (O), principles-compliance (O)
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

---

## Critical Paths

### Standard Project Path (Non-AI, Non-Government)
```
plan → principles → stakeholders → risk → sobc → requirements → research → wardley →
sow/evaluate → hld-review → backlog → servicenow → traceability → principles-compliance → analyze → story
```

### UK Government Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → gcloud-search → gcloud-clarify → evaluate → hld-review → dld-review →
backlog → servicenow → traceability → tcop → secure → principles-compliance → analyze → service-assessment → story
```

### UK Government AI Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → gcloud-search → evaluate → hld-review → dld-review → backlog → servicenow →
traceability → tcop → ai-playbook → atrs → secure → principles-compliance → analyze → service-assessment → story
```

### MOD Defence Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → dos → evaluate → hld-review → dld-review → backlog → servicenow →
traceability → tcop → mod-secure → principles-compliance → analyze → service-assessment → story
```

### MOD Defence AI Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → dos → evaluate → hld-review → dld-review → backlog → servicenow →
traceability → tcop → mod-secure → jsp-936 → principles-compliance → analyze → service-assessment → story
```

**Note**: analyze and service-assessment can also run earlier in the workflow to identify gaps in missing artifacts (all their dependencies are optional). The story command can be run at any project milestone to create a narrative snapshot, but is most comprehensive when run after all artifacts are complete. The paths above show the complete workflow with story as the final reporting step.

---

## Artifact Dependencies Summary

### Commands That Are Frequently Consumed (High Fan-In)

**requirements.md** - consumed by 22 commands:
- data-model (M), research (M), wardley (M), sow (M), dos (M), gcloud-search (M), evaluate (M), hld-review (M), dld-review (M), backlog (M), diagram (M), servicenow (M), traceability (M), analyze (O), service-assessment (M), tcop (M), ai-playbook (O), atrs (O), secure (M), mod-secure (M), jsp-936 (M), gcloud-clarify (M - implicit)

**principles.md** - consumed by 14 commands:
- stakeholders (R), risk (R), sobc (R), requirements (R), dos (M), gcloud-search (R), evaluate (M), hld-review (M), dld-review (M), analyze (O), service-assessment (R), tcop (M), secure (M), mod-secure (M)

**stakeholders.md** - consumed by 9 commands:
- risk (R), sobc (M), requirements (R), data-model (R), research (R), dos (R), backlog (R), analyze (O), service-assessment (R)

**HLD** (external document) - consumed by 7 commands:
- dld-review (M), backlog (M), diagram (R), servicenow (R), traceability (M), hld-review (validates it), service-assessment (M)
  - Note: analyze reads HLD directly if available (O), not via hld-review

### Commands That Produce Critical Artifacts (High Fan-Out)

**requirements** produces requirements.md → consumed by 22 commands (highest)
**principles** produces principles.md → consumed by 14 commands
**stakeholders** produces stakeholder-drivers.md → consumed by 9 commands
**HLD** (external) → consumed by 7 commands
**risk** produces risk-register.md → consumed by 6 commands

---

## Design Notes

1. **requirements.md is the central artifact** - Nearly all downstream commands depend on it
2. **principles.md is the governance foundation** - All design reviews check against principles
3. **Strategic order matters** - stakeholders → risk → sobc → requirements ensures business justification before technical work
4. **Quality gates can run iteratively** - analyze and service-assessment have optional dependencies, allowing them to run early (identifying gaps) or late (validating completeness)
5. **Compliance assessments feed quality gates** - tcop, ai-playbook, atrs, secure, mod-secure, jsp-936 outputs are optionally consumed by analyze and service-assessment
6. **External artifacts** - HLD and DLD are created outside ArcKit but validated by hld-review/dld-review commands

---

## Version

- **ArcKit Version**: 0.8.3
- **Matrix Date**: 2025-11-04 (Added principles-compliance command)
- **Commands Documented**: 31
- **Matrix Rows**: 33 (31 commands + 2 external documents)

## Changelog

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
