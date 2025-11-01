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

| PRODUCES → | plan | principles | stakeholders | risk | sobc | requirements | data-model | research | wardley | sow | dos | gcloud-search | gcloud-clarify | evaluate | hld-review | dld-review | backlog | diagram | servicenow | traceability | analyze | service-assessment | tcop | ai-playbook | atrs | secure | mod-secure | jsp-936 |
|------------|------|------------|--------------|------|------|--------------|------------|----------|---------|-----|-----|---------------|----------------|----------|------------|------------|---------|---------|------------|--------------|---------|-------------------|------|-------------|------|--------|------------|---------|
| **plan** | - | O | O | O | O | O | | | | | | | | | | | | | | | | R | | | | | | |
| **principles** | | - | R | R | R | R | | | | | M | R | | M | M | M | | | | | M | R | M | | | M | M | |
| **stakeholders** | | | - | R | M | R | R | R | | | R | | | | | | R | | | | M | R | | | | | | |
| **risk** | | | | - | R | R | | | | | | | | | | | R | | | | M | R | | | | R | R | |
| **sobc** | | | | | - | R | O | | | | | | | | | | | | | | R | R | | | | | | |
| **requirements** | | | | | | - | M | M | M | M | M | M | | M | M | M | M | M | M | M | M | M | M | O | O | M | M | M |
| **data-model** | | | | | | | - | R | | | | | | | | | R | R | R | R | M | R | | | | | | |
| **research** | | | | | | | | - | M | R | | R | | R | | | | | | | M | R | | | | | | |
| **wardley** | | | | | | | | | - | R | | | | R | | | | | | | M | R | | | | | | |
| **sow** | | | | | | | | | | - | | | | R | | | | | | | M | | | | | | | |
| **dos** | | | | | | | | | | | - | | | R | | | | | | | M | | | | | | | |
| **gcloud-search** | | | | | | | | | | | | - | M | R | | | | | | | M | | | | | | | |
| **gcloud-clarify** | | | | | | | | | | | | | - | R | | | | | | | M | | | | | | | |
| **evaluate** | | | | | | | | | | | | | | - | | | | | | | M | | | | | | | |
| **HLD** (external) | | | | | | | | | | | | | | | - | M | M | R | R | M | M | M | | | | | | |
| **DLD** (external) | | | | | | | | | | | | | | | | - | R | | | M | M | M | | | | | | |
| **diagram** | | | | | | | | | | | | | | | | | | - | R | R | M | R | | | | | | |
| **hld-review** | | | | | | | | | | | | | | | | | | | | | M | R | | | | | | |
| **dld-review** | | | | | | | | | | | | | | | | | | | | | M | R | | | | | | |
| **backlog** | | | | | | | | | | | | | | | | | - | | | | M | R | | | | | | |
| **servicenow** | | | | | | | | | | | | | | | | | | | - | | M | R | | | | | | |
| **traceability** | | | | | | | | | | | | | | | | | | | | - | M | R | | | | | | |
| **tcop** | | | | | | | | | | | | | | | | | | | | | M | M | | | | | | |
| **ai-playbook** | | | | | | | | | | | | | | | | | | | | | M | M | | | | | | |
| **atrs** | | | | | | | | | | | | | | | | | | | | | M | M | | | | | | |
| **secure** | | | | | | | | | | | | | | | | | | | | | M | M | | | | | | |
| **mod-secure** | | | | | | | | | | | | | | | | | | | | | M | M | | | | | | |
| **jsp-936** | | | | | | | | | | | | | | | | | | | | | M | M | | | | | | |

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

### Tier 9: Quality Assurance (Depends on ALL Artifacts)
- **analyze** → Depends on: ALL artifacts (principles, stakeholders, risk, sobc, requirements, data-model, designs, compliance assessments)

### Tier 10: Compliance Assessment (Depends on Multiple Artifacts)
These assess compliance across the project:
- **service-assessment** → Depends on: requirements (M), plan (R), data-model (R), principles (R), stakeholders (R), risk (R), analyze (R), hld-review (R), dld-review (R), diagram (R), traceability (R), wardley (R), tcop (M), ai-playbook (M), atrs (M), secure (M), mod-secure (M)
- **tcop** → Depends on: requirements (M), principles (M)
- **ai-playbook** → Depends on: requirements (O) [if AI system]
- **atrs** → Depends on: requirements (O) [if AI system]
- **secure** → Depends on: requirements (M), principles (M), risk (R)
- **mod-secure** → Depends on: requirements (M), principles (M), risk (R)
- **jsp-936** → Depends on: requirements (M) [if MOD AI system]

---

## Critical Paths

### Standard Project Path (Non-AI, Non-Government)
```
plan → principles → stakeholders → risk → sobc → requirements → research → wardley →
sow/evaluate → hld-review → backlog → servicenow → traceability → analyze
```

### UK Government Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → gcloud-search → gcloud-clarify → evaluate → hld-review → dld-review →
backlog → servicenow → traceability → analyze → service-assessment → tcop → secure
```

### UK Government AI Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → gcloud-search → evaluate → hld-review → dld-review → backlog → servicenow →
traceability → analyze → service-assessment → tcop → ai-playbook → atrs → secure
```

### MOD Defence Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → dos → evaluate → hld-review → dld-review → backlog → servicenow →
traceability → analyze → service-assessment → tcop → mod-secure
```

### MOD Defence AI Project Path
```
plan → principles → stakeholders → risk → sobc → requirements → data-model → research →
wardley → dos → evaluate → hld-review → dld-review → backlog → servicenow →
traceability → analyze → service-assessment → tcop → mod-secure → jsp-936
```

---

## Artifact Dependencies Summary

### Commands That Are Frequently Consumed (High Fan-In)

**requirements.md** - consumed by 22 commands:
- data-model (M), research (M), wardley (M), sow (M), dos (M), gcloud-search (M), evaluate (M), hld-review (M), dld-review (M), backlog (M), diagram (M), servicenow (M), traceability (M), analyze (M), service-assessment (M), tcop (M), ai-playbook (O), atrs (O), secure (M), mod-secure (M), jsp-936 (M), gcloud-clarify (M - implicit)

**principles.md** - consumed by 14 commands:
- stakeholders (R), risk (R), sobc (R), requirements (R), dos (M), gcloud-search (R), evaluate (M), hld-review (M), dld-review (M), analyze (M), service-assessment (R), tcop (M), secure (M), mod-secure (M)

**stakeholders.md** - consumed by 9 commands:
- risk (R), sobc (M), requirements (R), data-model (R), research (R), dos (R), backlog (R), analyze (M), service-assessment (R)

**HLD** (external document) - consumed by 7 commands:
- dld-review (M), backlog (M), diagram (R), servicenow (R), traceability (M), analyze (M), hld-review (validates it), service-assessment (M)

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
4. **Compliance commands are terminal** - They analyze but don't produce artifacts consumed by others
5. **analyze is the quality gate** - It consumes all artifacts and identifies gaps
6. **External artifacts** - HLD and DLD are created outside ArcKit but validated by hld-review/dld-review commands

---

## Version

- **ArcKit Version**: 0.8.2
- **Matrix Date**: 2025-11-01
- **Commands Documented**: 28
