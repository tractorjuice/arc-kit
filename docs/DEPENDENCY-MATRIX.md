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

| PRODUCES → | plan | principles | stakeholders | risk | sobc | requirements | data-model | data-mesh-contract | platform-design | dpia | research | azure-research | aws-research | gcp-research | datascout | dfd | wardley | roadmap | strategy | framework | glossary | adr | sow | dos | gcloud-search | gcloud-clarify | evaluate | hld-review | dld-review | backlog | trello | diagram | servicenow | devops | mlops | finops | operationalize | traceability | analyze | principles-compliance | conformance | maturity-model | service-assessment | tcop | ai-playbook | atrs | secure | mod-secure | jsp-936 | story | pages | presentation | gov-reuse | gov-code-search | gov-landscape |
|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|
| **plan** | - | R | R | R | O | O |  |  |  |  |  |  | O | | | | | R |  |  |  |  |  | O | O |  |  | R |  |  |  |  |  |  |  |  |  |  | R |  |  |  | M | O |  |  |  |  |  | R | R | R | |  |  |
| **principles** |  | - | M | R | R | R | R |  | M | R |  |  |  | | R | O | R | M | M | M |  | M |  | M | R |  |  | M | M |  |  |  |  | M |  | R |  |  | R | M | M | R |  | M |  |  | M | M |  |  | R | R | |  | R |
| **stakeholders** |  | O | - | M | M | M | R | O | R | R | O | R | M | R | R |  | R | R | M | R |  | O | O | R |  |  |  |  |  | R |  |  |  |  |  |  |  |  | R | R |  |  | R | R |  |  |  |  |  | R | R | R | |  |  |
| **risk** |  |  |  | - | M | R |  |  | O | R |  |  |  | | | | | R | O |  |  | R |  |  |  |  |  | R | R | R |  |  |  |  |  |  | R |  | R | R | O |  | R |  | R |  | R | R | M | R | R | R | |  |  |
| **sobc** |  |  | O | O | - | M | O |  |  |  |  |  |  | | | | | R | R |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  | R |  |  |  | R | R |  |  |  |  |  | R | R | R | |  |  |
| **requirements** |  |  |  |  |  | - | M | M | M | M | M | M | M | M | M | O | M | M |  | M | R | M | M | M | M | R | M | M | M | M |  | O | M | M | M | M | M | M | R | R | R |  | M | M | M | M | M | M | M | R | R | R | M | O | R |
| **data-model** |  |  |  |  |  |  | - | M | O | M | R | R |  | R | O | R | O |  |  | R | R |  | O |  |  |  |  |  |  |  |  | R | R |  | R |  |  | R | R | R |  |  | R |  | R |  |  |  |  |  | R | R | |  |  |
| **data-mesh-contract** |  |  |  |  |  |  |  | - |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | O | |  |  |
| **platform-design** |  |  |  |  |  |  | O | R | - | O | O |  | R | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  |  |  | R | O | |  |  |
| **dpia** |  |  |  |  |  |  |  |  |  | - |  |  |  | | | | | O |  |  |  |  | R |  |  |  | O |  |  |  |  | O |  |  |  |  |  | O | R | R |  |  | R |  | R | R | R | R |  | R | R | R | |  |  |
| **research** |  |  |  |  |  |  |  |  |  |  | - |  | R | | | | |  |  | R |  |  | R |  | R | O | R |  |  |  |  |  |  | R | R |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  | R | R | |  |  |
| **azure-research** |  |  |  |  |  |  |  |  |  |  |  | - |  | | | | R |  |  |  |  | R |  |  |  |  |  |  |  | R |  | R |  | R | R | R |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  | R | |  |  |
| **aws-research** |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  | R |  |  |  |  | R |  |  |  |  |  |  |  | R |  | R |  | R | R | R |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  | R | |  |  |
| **gcp-research** |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  | R |  |  |  |  | R |  |  |  |  |  |  |  | R |  | R |  | R | R | R |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  | R | |  |  |
| **datascout** | | | | | | | R | | | O | R | | | | - | | | |  |  |  | R | | | | | | | | |  | O | | | | | | R | | |  |  | | | | | | | | | R | O | |  |  |
| **gov-reuse** |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |
| **gov-code-search** |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | - |  |
| **gov-landscape** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  | - |
| **dfd** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | O |  |  |  |  |  |  |  |  |  |  | R | R | O | |  |  |
| **wardley** |  |  |  |  |  |  |  |  | R |  | O |  |  | | | | - | R | R |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  | R | R | |  |  |
| **roadmap** |  |  |  |  |  |  |  |  | O |  |  |  | O | | | | | - | R |  |  |  |  |  |  |  |  | O |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R | R | |  |  |
| **strategy** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  | - | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R | R | |  |  |
| **framework** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  | R | R | O | |  |  |
| **glossary** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R | O | |  |  |
| **adr** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | M |  |  |  |  |  |  |  |  |  | R | R | |  |  |
| **sow** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  | - |  | O |  | R |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  |  |  |  | R | O | |  |  |
| **dos** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  | - |  |  | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | O | |  |  |
| **gcloud-search** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  | - | M |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | O | |  |  |
| **gcloud-clarify** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | O | |  |  |
| **evaluate** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  |  |  |  |  |  |  |  |  | R | O | |  |  |
| **hld-review** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | |  |  | R |  |  |  |  |  |  |  | - | M | M |  |  |  |  |  |  |  |  | M |  | R | R |  |  |  |  |  |  |  |  | R | R | R | |  |  |
| **dld-review** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | |  |  | O |  |  |  |  |  |  |  |  | - | R |  |  |  |  |  |  |  |  | M |  | R | R |  |  |  |  |  |  |  |  | R | R | R | |  |  |
| **backlog** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  | - | M |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | O | |  |  |
| **trello** |  |  |  |  |  |  |  |  |  |  |  |  |  | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | |  |  |
| **diagram** |  |  |  |  |  |  |  |  |  | O |  |  |  | | | O | |  |  |  |  |  |  |  |  |  |  | R | R |  |  | - | M | R |  | R | R |  | R |  |  |  | R |  |  |  | O | O |  |  | R | R | |  |  |
| **servicenow** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  | R | O |  |  |  |  |  |  |  |  |  |  |  |  | R | O | |  |  |
| **devops** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  | R |  |  |  |  | O |  |  |  |  |  |  |  |  | R | R | R | |  |  |
| **mlops** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R | O | |  |  |
| **finops** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R | O | |  |  |
| **operationalize** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  |  |  |  |  |  | R | R | O | |  |  |
| **traceability** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | O | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  |  | - | R | R | R |  |  |  |  |  |  |  |  | R | R | O | |  |  |
| **analyze** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | O | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | O |  |  | R | O |  |  |  |  |  | O | R | O | |  |  |
| **principles-compliance** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - | R |  | R |  |  |  |  |  |  |  | R | O | |  |  |
| **conformance** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  | - |  | O |  |  |  |  |  |  | R | R | O | |  |  |
| **maturity-model** |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  |  |  |  |  |  |  | R | R | O | |  |  |
| **service-assessment** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | O |  |  | - |  |  |  |  |  |  | R | R | O | |  |  |
| **tcop** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R | R |  |  | R | - |  |  |  |  |  |  | R | O | |  |  |
| **ai-playbook** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | R |  |  |  | O |  |  |  | R |  | - | R |  |  | R |  | R | O | |  |  |
| **atrs** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  | - |  |  | R |  | R | O | |  |  |
| **secure** |  |  |  |  |  |  |  |  |  | R |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | R |  |  | R |  | O | O | - | R | O | R | R | O | |  |  |
| **mod-secure** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O | R |  |  | O |  |  |  |  | - | R |  | R | O | |  |  |
| **jsp-936** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  | O |  |  |  |  |  | - |  | R | O | |  |  |
| **story** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | R | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | O |  |  |  | O |  |  |  |  |  |  | - | R | O | |  |  |
| **pages** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | R | |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | - |  | |  |  |
| **presentation** | | | | | | | | | | | | | | | | O | | | |  |  | | | | | | | | | | | | | | | | | | | |  |  | | | | | | | | | | - | |  |  |
| **HLD (external)** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  | M | O |  |  |  | R |  |  |  |  | R | O |  | R |  | R |  |  |  |  |  |  |  | R | R | |  |  |
| **DLD (external)** |  |  |  |  |  |  |  |  |  |  |  |  |  | | | | |  |  |  |  |  |  |  |  |  |  |  | M | M |  |  |  |  |  |  |  | R |  |  | R |  | R |  |  |  |  |  |  |  | R | R | |  |  |

## Command Groups by Dependency Level

### Tier 0: Foundation (No Mandatory Dependencies)

These commands can run first:

- **start** - Onboarding and navigation (console-only diagnostic, no file output; recommends `init` and `principles`)
- **plan** - Project planning and timeline (can optionally read: stakeholders, requirements, principles, sobc, risk if they exist)
- **principles** - Architecture principles

### Tier 1: Strategic Context (Depends on Foundation)

- **stakeholders** → Depends on: principles (R)

### Tier 2: Risk Assessment (Depends on Stakeholders)

- **risk** → Depends on: stakeholders (M), principles (R)

### Tier 3: Business Justification

- **sobc** → Depends on: stakeholders (M), risk (R), principles (R)

### Tier 4: Requirements Definition

- **requirements** → Depends on: stakeholders (R), sobc (R), principles (R)

### Tier 5: Strategic Planning (Platform Strategy, Roadmaps & Strategy Synthesis)

- **platform-design** → Depends on: principles (M), stakeholders (R), requirements (R), wardley (R), risk (O), sobc (O), data-model (O)
  - Note: Designs multi-sided platform strategy using Platform Design Toolkit (PDT) methodology
  - Best run after requirements when designing ecosystem-based platforms (Government as a Platform, marketplaces, data platforms)
  - Can run earlier if stakeholders and principles exist (requirements/wardley are recommended for better auto-population)
- **roadmap** → Depends on: principles (M), stakeholders (R), requirements (R), wardley (R), risk (R)
  - Note: Creates strategic architecture roadmap with multi-year timeline and capability evolution
  - Requires principles as foundation; stakeholders and requirements provide strategic context
- **strategy** → Depends on: principles (M), stakeholders (M), wardley (R), roadmap (R), sobc (R), risk (O)
  - Note: Synthesises strategic artifacts into executive-level Architecture Strategy document
  - Requires both principles AND stakeholders as mandatory inputs (unique among ArcKit commands)
  - Best run after creating principles, stakeholders, wardley, roadmap, and sobc for comprehensive strategy
- **framework** → Depends on: principles (M), requirements (M), stakeholders (R), strategy (R), data-model (R), research (R)
  - Note: Transforms architecture artifacts into a structured, reusable framework with principles, patterns, and implementation guidance
  - Agent-delegating command (runs autonomously via arckit-framework agent)
  - Best run after strategy and requirements when sufficient artifacts exist for framework synthesis
- **glossary** → Depends on: requirements (R), data-model (R), principles (O), sobc (O), research (O), adr (O), strategy (O), risk (O)
  - Note: Generates comprehensive project glossary; accepts all available artifacts as term sources
  - Can run at any point once requirements exist; richer with more artifacts available

### Tier 6: Detailed Design (Depends on Requirements)

Most commands in this tier require or strongly recommend ARC-*-REQ-*.md:

- **data-model** → Depends on: requirements (M), principles (R), stakeholders (R), sobc (O)
- **dpia** → Depends on: data-model (M), requirements (M), principles (R), stakeholders (R), risk (R)
- **research** → Depends on: requirements (M), stakeholders (R), data-model (R), platform-design (R)
  - Note: Also spawns `vendors/{slug}-profile.md` and `tech-notes/{slug}.md` for reusable knowledge (use `--no-spawn` to skip)
- **azure-research** → Depends on: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
  - Note: Requires Microsoft Learn MCP server to be installed for authoritative Azure documentation
- **aws-research** → Depends on: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
  - Note: Requires AWS Knowledge MCP server to be installed for authoritative AWS documentation
- **gcp-research** → Depends on: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
  - Note: Requires Google Developer Knowledge MCP server (with API key) for authoritative Google Cloud documentation
- **datascout** → Depends on: requirements (M), data-model (O), stakeholders (R), principles (R)
  - Note: Discovers external data sources (APIs, datasets, open data portals) to fulfil project data requirements
  - Bidirectional with data-model: data-model is optional input, datascout recommends data-model updates as output
- **dfd** → Depends on: requirements (O), data-model (R), principles (O), diagram (O)
  - Note: Can generate DFDs from user description alone; richer output when requirements and data-model exist
  - Multi-instance document type (ARC-*-DFD-{NUM}-v*.md)
- **wardley.value-chain** → Depends on: requirements (M), stakeholders (R)
  - Note: Decomposes user needs into value chains for Wardley Mapping; produces WVCH artifacts
  - Multi-instance document type (ARC-*-WVCH-{NUM}-v*.md), stored in wardley-maps/ subdirectory
- **wardley** → Depends on: requirements (R), principles (R), research (O), data-model (O), tcop (O), ai-playbook (O)
  - Note: Can create initial map from user description alone; enhanced with requirements, principles, research
- **wardley.doctrine** → Depends on: principles (M), wardley (R), stakeholders (R)
  - Note: Assesses organizational doctrine maturity across 4 phases and 40+ principles; produces WDOC artifact
  - Single instance per project (ARC-*-WDOC-v*.md), stored in wardley-maps/ subdirectory
- **wardley.gameplay** → Depends on: wardley (M), wardley.climate (R), wardley.doctrine (R)
  - Note: Analyzes strategic plays from 60+ gameplay patterns; produces WGAM artifacts
  - Multi-instance document type (ARC-*-WGAM-{NUM}-v*.md), stored in wardley-maps/ subdirectory
- **wardley.climate** → Depends on: wardley (M), requirements (R), research (R)
  - Note: Assesses 32 climatic patterns affecting mapped components; produces WCLM artifacts
  - Multi-instance document type (ARC-*-WCLM-{NUM}-v*.md), stored in wardley-maps/ subdirectory
- **diagram** → Depends on: requirements (O), platform-design (R)
  - Note: Can generate diagrams from user description alone; richer output when requirements and other artifacts exist
- **adr** → Depends on: principles (R), requirements (R), risk (R), stakeholders (O), research (O), wardley (O)
  - Note: Architecture Decision Records; principles recommended but can create decisions without them
- **data-mesh-contract** → Depends on: principles (M), data-model (R), stakeholders (R)
  - Note: Federated data product contracts for mesh architectures; requires principles for governance standards

### Tier 7: Procurement (Depends on Requirements)

Most procurement commands require ARC-*-REQ-*.md:

- **sow** → Depends on: requirements (M), research (R)
- **dos** → Depends on: requirements (M), stakeholders (M), sobc (R), research (R)
- **gcloud-search** → Depends on: requirements (R), Digital Marketplace access (External)
  - Note: Requirements recommended for search context but not mandatory
- **gcloud-clarify** → Depends on: requirements (M), gcloud-search (M)
- **evaluate** → Depends on: requirements (M), sow (M), principles (R), research (R), gcloud-clarify (R)
- **score** → Depends on: evaluate (M), requirements (M)
  - Note: Structured vendor scoring with JSON storage, comparison, and audit trail
  - Integrates with evaluate criteria; scores stored in `projects/{id}/vendors/scores.json`

### Tier 8: Design Reviews (Depends on Design Documents + Requirements)

- **hld-review** → Depends on: requirements (M), principles (M), HLD (M)
- **dld-review** → Depends on: requirements (M), principles (M), HLD (M), DLD (M)

### Tier 9: Implementation Planning (Depends on Design Reviews)

- **backlog** → Depends on: requirements (M), HLD (M), stakeholders (R), risk (R)

### Tier 10: Backlog Export (Depends on Backlog)

- **trello** → Depends on: backlog (M) — specifically the JSON export (`ARC-*-BKLG-*.json`)
  - Note: Exports backlog to Trello board with sprint lists, labelled cards, and acceptance criteria checklists
  - Requires `TRELLO_API_KEY` and `TRELLO_TOKEN` environment variables

### Tier 11: Operations (Depends on Architecture)

- **servicenow** → Depends on: requirements (M), diagram (M), principles (R), HLD/DLD (R)
- **devops** → Depends on: requirements (M), principles (M), diagram (R), research (R)
- **mlops** → Depends on: requirements (M), data-model (R), ai-playbook (R), research (R) [for AI projects]
- **finops** → Depends on: requirements (M), devops (R), diagram (R), principles (R)
- **operationalize** → Depends on: requirements (M), diagram (M), HLD/DLD (R), principles (R), risk (R)
- **traceability** → Depends on: requirements (M), HLD (R), DLD (R), data-model (R)
  - Note: Hook pre-processing reduces dependency on direct HLD/DLD file reads

### Tier 12: Quality Assurance (Can Run Before or After Compliance)

- **analyze** → Depends on: principles (M), requirements (R), stakeholders (R), all other artifacts (O)
  - Note: Requires principles as foundation; other dependencies are optional - analyze identifies gaps for missing artifacts

### Tier 13: Compliance Assessment (Depends on Multiple Artifacts)

These assess compliance across the project:

- **principles-compliance** → Depends on: principles (M), requirements (R), stakeholders (R), risk (R), data-model (R), platform-design (R), HLD (R), DLD (R), hld-review (R), dld-review (R), traceability (R), dpia (R), tcop (R), secure (R), mod-secure (R)
  - Note: All dependencies except principles are RECOMMENDED - better assessment with more artifacts
- **conformance** → Depends on: principles (M), adr (M), requirements (R), hld-review (R), dld-review (R), principles-compliance (R), traceability (R), HLD (R), DLD (R), risk (O), devops (O)
  - Note: Checks decided-vs-designed conformance — ADR decision implementation, cross-decision consistency, architecture drift, technical debt
  - Bridges health (quick metadata scan) and analyze (deep governance) with systematic conformance checking
- **maturity-model** → Depends on: principles (R)
  - Note: Generates capability maturity model with current-state assessment, target-state definition, and improvement roadmap
  - Can run once principles exist; feeds into roadmap and strategy for improvement planning
- **service-assessment** → Depends on: requirements (M), plan (R), data-model (R), platform-design (O), principles (R), stakeholders (R), risk (R), analyze (R), hld-review (R), dld-review (R), diagram (R), traceability (R), wardley (R), tcop (O), ai-playbook (O), atrs (O), secure (O), mod-secure (O), jsp-936 (O), principles-compliance (O), conformance (O)
  - Note: Compliance artifacts are optional - service-assessment identifies them as gaps if missing
- **tcop** → Depends on: requirements (M), principles (R), diagram (R)
- **ai-playbook** → Depends on: requirements (O) [if AI system]
- **atrs** → Depends on: requirements (M), principles (R), data-model (R) [for AI/algorithmic systems]
- **secure** → Depends on: requirements (M), principles (M), risk (R)
- **mod-secure** → Depends on: requirements (M), principles (M), risk (R)
- **jsp-936** → Depends on: requirements (M), principles (M), mod-secure (R), risk (R) [for MOD AI systems]

### Tier 14: Project Story & Reporting (Depends on All Artifacts)

Final reporting commands that create comprehensive project narratives and presentations:

- **story** → Depends on: principles (M), all other artifacts (R)
  - Note: Requires principles as foundation; recommends multiple artifacts for comprehensive narrative
  - Generates comprehensive historical record with timeline analysis, traceability chains, governance achievements
  - Best run at project milestones or completion when most/all artifacts are complete
- **presentation** → Depends on: all artifacts (R), none mandatory
  - Note: Reads available artifacts and reformats into MARP slide deck for governance boards
  - Supports focus modes: Executive, Technical, Stakeholder, Procurement
  - Can run at any milestone when at least 3 artifacts exist; more artifacts = richer slides

### Tier 15: Documentation Publishing (Utility)

Publishing command that generates documentation site:

- **pages** → Depends on: All document-producing artifacts (R)
  - Note: pages indexes and displays all project documents - more documents = better site
  - Recommended dependencies: principles, stakeholders, risk, sobc, requirements, data-model, dpia, research, wardley, roadmap, adr, sow, evaluate, hld-review, dld-review, backlog, diagram, servicenow, traceability, analyze, principles-compliance, service-assessment, tcop, ai-playbook, atrs, secure, mod-secure, jsp-936, story, presentation, HLD, DLD
  - Generates GitHub Pages site with Mermaid diagram support
  - Best run when project has substantial documentation to publish

---

## Critical Paths

### Standard Project Path (Non-AI, Non-Government)

```text
plan → principles → stakeholders → risk → sobc → requirements → research → wardley →
sow/evaluate → hld-review → backlog → servicenow → devops → operationalize →
traceability → principles-compliance → conformance → analyze → story
```

### UK Government Project Path

```text
plan → principles → stakeholders → risk → sobc → requirements → datascout → data-model → research →
wardley → gcloud-search → gcloud-clarify → evaluate → hld-review → dld-review →
backlog → servicenow → devops → operationalize → traceability →
tcop → secure → principles-compliance → conformance → analyze → service-assessment → story
```

### UK Government Platform Strategy Path

```text
plan → principles → stakeholders → risk → sobc → requirements → platform-design → datascout → data-model → research →
wardley → gcloud-search → evaluate → hld-review → dld-review → backlog → servicenow →
devops → operationalize → traceability → tcop → secure → principles-compliance →
conformance → analyze → service-assessment → story
```

### UK Government AI Project Path

```text
plan → principles → stakeholders → risk → sobc → requirements → datascout → data-model → research →
wardley → gcloud-search → evaluate → hld-review → dld-review → backlog → servicenow →
devops → mlops → operationalize → traceability → tcop → ai-playbook → atrs → secure →
principles-compliance → conformance → analyze → service-assessment → story
```

### MOD Defence Project Path

```text
plan → principles → stakeholders → risk → sobc → requirements → datascout → data-model → research →
wardley → dos → evaluate → hld-review → dld-review → backlog → servicenow →
devops → operationalize → traceability → tcop → mod-secure → principles-compliance →
conformance → analyze → service-assessment → story
```

### MOD Defence AI Project Path

```text
plan → principles → stakeholders → risk → sobc → requirements → datascout → data-model → research →
wardley → dos → evaluate → hld-review → dld-review → backlog → servicenow →
devops → mlops → operationalize → traceability → tcop → mod-secure → jsp-936 →
principles-compliance → conformance → analyze → service-assessment → story
```

**Note**: analyze and service-assessment can also run earlier in the workflow to identify gaps in missing artifacts (all their dependencies are optional). The story command can be run at any project milestone to create a narrative snapshot, but is most comprehensive when run after all artifacts are complete. The paths above show the complete workflow with story as the final reporting step.

**Platform Design**: The platform-design command is used when designing multi-sided platforms (Government as a Platform, marketplaces, data platforms) and should be inserted after requirements definition but before detailed design. See "UK Government Platform Strategy Path" above.

---

## Artifact Dependencies Summary

### Commands That Are Frequently Consumed (High Fan-In)

**ARC-*-REQ-*.md** - consumed by 36 commands:

- data-model (M), data-mesh-contract (M), platform-design (M), dpia (M), research (M), azure-research (M), aws-research (M), gcp-research (M), datascout (M), wardley (M), roadmap (M), adr (M), sow (M), dos (M), gcloud-search (R), gcloud-clarify (M), evaluate (M), hld-review (M), dld-review (M), backlog (M), servicenow (M), devops (M), mlops (M), finops (M), operationalize (M), traceability (R), analyze (R), principles-compliance (M), service-assessment (M), tcop (M), ai-playbook (M), atrs (M), secure (M), mod-secure (M), jsp-936 (M), story (R), pages (R)

**ARC-000-PRIN-v*.md** - consumed by 21 commands:

- stakeholders (M), risk (R), sobc (R), requirements (R), platform-design (M), dpia (R), wardley (M), roadmap (M), strategy (M), sow (M), dos (R), evaluate (M), hld-review (M), servicenow (R), mlops (R), traceability (R), analyze (M), service-assessment (M), atrs (M), secure (M), story (R)

**ARC-*-STKE-*.md** - consumed by 23 commands:

- risk (M), sobc (M), requirements (M), data-model (R), data-mesh-contract (O), platform-design (R), dpia (R), research (O), azure-research (R), aws-research (M), gcp-research (R), datascout (R), wardley (O), roadmap (O), strategy (M), adr (R), hld-review (R), operationalize (R), traceability (R), analyze (R), principles-compliance (R), mod-secure (R), jsp-936 (R)

**HLD** (external document) - consumed by 7 commands:

- dld-review (M), backlog (M), diagram (R), servicenow (R), traceability (M), hld-review (validates it), service-assessment (M)
  - Note: analyze reads HLD directly if available (O), not via hld-review

**ARC-*-PLAT-*.md** - consumed by 6 commands:

- research (R), wardley (R), diagram (R), analyze (M), principles-compliance (R), service-assessment (R)

### Commands That Produce Critical Artifacts (High Fan-Out)

**requirements** produces ARC-*-REQ-*.md → consumed by 37 commands (highest)
**principles** produces ARC-000-PRIN-v*.md → consumed by 21 commands
**stakeholders** produces ARC-*-STKE-*.md → consumed by 22 commands
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

- **ArcKit Version**: 1.6.0
- **Matrix Date**: 2026-03-16
- **Commands Documented**: 64
- **Matrix Rows**: 58 (56 document-generating commands + 2 external documents)
- **Note**: `/arckit.customize`, `/arckit.template-builder`, `/arckit.health`, `/arckit.search`, `/arckit.impact`, `/arckit.init`, and `/arckit.start` are utility/diagnostic commands not in the matrix — they have no dependencies and produce no outputs consumed by other commands

## Changelog

### 2026-03-16 - Wardley Mapping Suite

- **Added**: wardley.value-chain command — Depends on: requirements (M), stakeholders (R). Produces WVCH artifacts
- **Added**: wardley.doctrine command — Depends on: principles (M), wardley (R), stakeholders (R). Produces WDOC artifacts
- **Added**: wardley.gameplay command — Depends on: wardley (M), wardley.climate (R), wardley.doctrine (R). Produces WGAM artifacts
- **Added**: wardley.climate command — Depends on: wardley (M), requirements (R), research (R). Produces WCLM artifacts
- **Updated**: Commands documented from 60 to 64

### 2026-03-13 - Dependency Matrix Audit Fixes

- **Fixed**: data-model row — added principles (R) dependency (command reads principles for data governance standards)
- **Fixed**: adr row — changed risk from (O) to (R) (command reads risk register for decision context)
- **Fixed**: data-mesh-contract tier text — removed spurious diagram (R) dependency (command never reads diagrams)
- **Fixed**: devops row — changed principles from (R) to (M), corrected tier text to show principles (M) and diagram (R)
- **Fixed**: dfd row — changed requirements from (M) to (O) (command can generate DFDs from user description alone)
- **Fixed**: diagram row — changed requirements from (M) to (O) (command can generate diagrams from user description alone)
- **Fixed**: traceability row — changed HLD/DLD from (M) to (R) (hook pre-processing reduces direct file read dependency)
- **Updated**: glossary tier text — added optional dependencies (principles, sobc, research, adr, strategy, risk)
- **Updated**: wardley tier text — added optional dependencies (research, data-model, tcop, ai-playbook)
- **Updated**: ARC-*-REQ-*.md consumption count from 38 to 36 (dfd and diagram changed from M to O)
- **Note**: Audit performed by comparing matrix entries against actual command file implementations

### 2026-03-09 - Added Impact Analysis Command

- **Added**: `/arckit.impact` command (60th ArcKit command) for blast radius analysis and reverse dependency tracing
- **Not in matrix**: Diagnostic command with console-only output — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 59 to 60
- **Note**: Uses UserPromptSubmit pre-processing hook (`impact-scan.mjs`) to build a dependency graph with doc-to-doc edges for reverse traversal

### 2026-03-08 - Added Vendor Scoring Command

- **Added**: `/arckit.score` command (59th ArcKit command) for structured vendor scoring with JSON storage, comparison, and audit trail
- **Added**: score row and column to dependency matrix
- **Updated**: Tier 7 Procurement to include score command
- **Dependencies**: evaluate (M), requirements (M)
- **Consumed by**: sow (O), pages (R)
- **Updated**: Commands Documented count from 58 to 59
- **Note**: First command to use structured JSON output instead of Markdown; includes PreToolUse validator hook for scores.json integrity

### 2026-03-08 - Added Project Search Command

- **Added**: `/arckit.search` command (58th ArcKit command) for keyword, type, and requirement ID search across all project artifacts
- **Not in matrix**: Diagnostic/query command with console-only output — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 57 to 58
- **Note**: Uses UserPromptSubmit pre-processing hook (`search-scan.mjs`) to index artifacts before search

### 2026-03-08 - Added DFD Command to Matrix

- **Added**: `/arckit.dfd` row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include dfd command
- **Dependencies**: requirements (M), data-model (R), principles (O), diagram (O)
- **Consumed by**: traceability (O), analyze (O), story (R), pages (R), presentation (O)
- **Note**: Multi-instance document type (ARC-*-DFD-{NUM}-v*.md); generates Yourdon-DeMarco Data Flow Diagrams
- **Updated**: Matrix Rows from 53 to 54
- **Added**: `/arckit.init` to utility command exclusion note

### 2026-03-06 - Added Framework, Glossary, and Maturity Model Commands

- **Added**: `/arckit.framework` command (55th ArcKit command) for transforming architecture artifacts into a structured, reusable framework
- **Added**: framework row and column to dependency matrix
- **Updated**: Tier 5 Strategic Planning to include framework command
- **Dependencies**: principles (M), requirements (M), stakeholders (R), strategy (R), data-model (R), research (R)
- **Consumed by**: glossary (R), maturity-model (R), story (R), pages (R), presentation (O)
- **Note**: Agent-delegating command using arckit-framework agent for synthesis

- **Added**: `/arckit.glossary` command (56th ArcKit command) for generating comprehensive project glossary
- **Added**: glossary row and column to dependency matrix
- **Updated**: Tier 5 Strategic Planning to include glossary command
- **Dependencies**: requirements (R), data-model (R)
- **Consumed by**: story (R), pages (R), presentation (O)

- **Added**: `/arckit.maturity-model` command (57th ArcKit command) for generating capability maturity model
- **Added**: maturity-model row and column to dependency matrix
- **Updated**: Tier 13 Compliance Assessment to include maturity-model command
- **Dependencies**: principles (R)
- **Consumed by**: roadmap (R), strategy (R), story (R), pages (R), presentation (O)

- **Updated**: Commands Documented count from 54 to 57
- **Updated**: Matrix Rows from 52 to 55

### 2026-03-02 - Added Template Builder Command

- **Added**: `/arckit.template-builder` command (54th ArcKit command) for creating new document templates through interactive interview
- **Not in matrix**: Utility command that generates community-origin templates, guides, and optional shareable bundles — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 53 to 54
- **Note**: Introduces three-tier origin model (Official/Custom/Community) for templates and guides

### 2026-02-25 - Added Architecture Conformance Assessment Command

- **Added**: `/arckit.conformance` command (52nd ArcKit command) for systematic decided-vs-designed conformance checking
- **Added**: conformance row and column to dependency matrix
- **Updated**: Tier 13 Compliance Assessment to include conformance command
- **Dependencies**: principles (M), adr (M), requirements (R), hld-review (R), dld-review (R), principles-compliance (R), traceability (R), HLD (R), DLD (R), risk (O), devops (O)
- **Consumed by**: analyze (O), service-assessment (O), story (R), pages (R), presentation (O)
- **Doc ID**: `ARC-{PID}-CONF-v{VERSION}`
- **Note**: Bridges `/arckit.health` (quick metadata scan) and `/arckit.analyze` (deep governance) with 12 conformance checks covering ADR implementation, cross-decision consistency, architecture drift, technical debt, and custom constraint rules

### 2026-02-20 - Added Health Check Command

- **Added**: `/arckit.health` command (51st ArcKit command) for scanning projects for stale research, forgotten ADRs, unresolved conditions, orphaned requirements, missing traceability, and version drift
- **Not in matrix**: Diagnostic command with console-only output — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 50 to 51

### 2026-02-20 - Research Knowledge Compounding

- **Updated**: `/arckit.research` now spawns `vendors/{slug}-profile.md` and `tech-notes/{slug}.md` from research findings
- **Note**: New output files are standalone knowledge — not consumed by other commands via the dependency matrix
- **Flag**: `--no-spawn` skips knowledge compounding

### 2026-02-19 - Added Presentation Command

- **Added**: `/arckit.presentation` command (50th ArcKit command) for generating MARP-format slide decks from project artifacts
- **Added**: presentation row and column to dependency matrix
- **Updated**: Tier 14 to include presentation alongside story
- **Dependencies**: All artifacts (R) — reads whatever is available, minimum 3 recommended
- **Consumed by**: pages (R)
- **Note**: Similar to story in consuming all artifacts; output is MARP markdown that renders to PDF/PPTX/HTML

### 2026-02-09 - Added GCP Research Command

- **Added**: `/arckit.gcp-research` command (47th ArcKit command) for Google Cloud-specific technology research using Google Developer Knowledge MCP server
- **Added**: gcp-research row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include gcp-research command
- **Dependencies**: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
- **Consumed by**: diagram (R), devops (R), finops (R), adr (R), pages (R)
- **Note**: Requires Google Developer Knowledge MCP server with API key (`GOOGLE_API_KEY`) for authoritative Google Cloud documentation

### 2026-02-05 - Added Template Customization Command

- **Added**: `/arckit.customize` command (46th ArcKit command) for copying templates to `.arckit/templates-custom/`
- **Not in matrix**: Utility command with no dependencies and no outputs consumed by other commands
- **Purpose**: Enables template customization that persists across `arckit init` updates

### 2026-02-05 - Added Architecture Strategy Command

- **Added**: `/arckit.strategy` command (45th ArcKit command) for synthesising strategic artifacts into executive-level Architecture Strategy document
- **Added**: strategy row and column to dependency matrix
- **Updated**: Tier 5 Strategic Planning to include strategy command
- **Dependencies**: principles (M), stakeholders (M), wardley (R), roadmap (R), sobc (R), risk (O)
- **Consumed by**: story (R), pages (R)
- **Note**: Unique among ArcKit commands in requiring TWO mandatory inputs (principles AND stakeholders)
- **Purpose**: Creates single coherent strategic narrative from multiple strategic artifacts for executive stakeholders

### 2026-02-04 - Added Trello Export Command

- **Added**: `/arckit.trello` command (44th ArcKit command) for exporting product backlog to Trello boards
- **Added**: trello row and column to dependency matrix
- **Added**: Tier 10 Backlog Export for trello command
- **Dependencies**: backlog (M) — reads `ARC-*-BKLG-*.json`
- **Consumed by**: None (external Trello board output)
- **Note**: Requires `TRELLO_API_KEY` and `TRELLO_TOKEN` environment variables; uses Trello REST API via curl

### 2026-02-01 - Added Data Source Discovery Command

- **Added**: `/arckit.datascout` command (43rd ArcKit command) for discovering external data sources (APIs, datasets, open data portals, commercial providers)
- **Added**: datascout row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include datascout command
- **Dependencies**: requirements (M), data-model (O), stakeholders (R), principles (R)
- **Consumed by**: data-model (R), research (R), adr (R), dpia (O), diagram (O), traceability (R), pages (R)
- **Note**: Bidirectional with data-model; prioritises UK Government open data sources (TCoP Point 10)

### 2026-01-29 - Added AWS Research Command

- **Added**: `/arckit.aws-research` command (42nd ArcKit command) for AWS-specific technology research using AWS Knowledge MCP server
- **Added**: aws-research row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include aws-research command
- **Dependencies**: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
- **Consumed by**: diagram (R), devops (R), finops (R), adr (R), pages (R)
- **Note**: Requires AWS Knowledge MCP server for authoritative AWS documentation

### 2026-01-29 - Added Azure Research Command

- **Added**: `/arckit.azure-research` command (41st ArcKit command) for Azure-specific technology research using Microsoft Learn MCP server
- **Added**: azure-research row and column to dependency matrix
- **Updated**: Tier 6 Detailed Design to include azure-research command
- **Dependencies**: requirements (M), data-model (R), stakeholders (R), MCP Server (External)
- **Consumed by**: diagram (R), devops (R), finops (R), adr (R), secure (O), pages (R)
- **Note**: Requires Microsoft Learn MCP server for authoritative Azure documentation

### 2026-01-28 - Added Missing Operations Commands to Matrix

- **Fixed**: Added devops, mlops, finops, operationalize rows and columns to the matrix
- **Updated**: ARC-*-REQ-*.md consumption count from 23 to 27 commands
- **Updated**: ARC-000-PRIN-v*.md consumption count from 15 to 17 commands
- **Note**: These commands were documented in Tier 11 but missing from the actual DSM table

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
- **Updated**: Tier 11 Operations to include finops command
- **Dependencies**: requirements (M), devops (R), diagram (R), principles (R)

### 2026-01-09 - Added DevOps, MLOps, and Operationalize Commands

- **Added**: `/arckit.devops` command (34th ArcKit command) for DevOps strategy with CI/CD pipelines, IaC, container orchestration
- **Added**: `/arckit.mlops` command (35th ArcKit command) for MLOps strategy with model lifecycle, training pipelines, serving, monitoring
- **Added**: `/arckit.operationalize` command (36th ArcKit command) for operational readiness with SRE practices, runbooks, DR/BCP
- **Updated**: Tier 11 Operations to include devops, mlops (AI projects), operationalize commands
- **Updated**: All 6 critical paths to include new commands in operations phase
- **Dependencies**:
  - devops: requirements (M), diagram (R), research (R), principles (R)
  - mlops: requirements (M), data-model (R), ai-playbook (R), research (R)
  - operationalize: requirements (M), servicenow (R), diagram (R), risk (R)

### 2025-01-06 - Added Platform Design Command

- **Added**: `/arckit.platform-design` command (33rd ArcKit command) for multi-sided platform strategy design using Platform Design Toolkit (PDT) methodology
- **Added**: platform-design row and column to dependency matrix
- **Added**: New critical path: "UK Government Platform Strategy Path" showing where platform-design fits
- **Added**: Tier 5 "Strategic Planning (Platform Strategy)" for platform-design placement
- **Updated**: Tier 6 commands to optionally consume platform-design (research R, wardley R, diagram R)
- **Updated**: analyze to consume platform-design (O), principles-compliance (R), service-assessment (O)
- **Dependencies**: principles (M), stakeholders (R), requirements (R), wardley (R), risk (O), sobc (O), data-model (O)
- **Consumed by**: research (R), wardley (R), diagram (R), analyze (M), principles-compliance (R), service-assessment (R)
- **Use case**: Designing Government as a Platform (GaaP) services, data marketplaces, multi-sided platforms

### 2025-11-04 - Added Principles Compliance Command

- **Added**: `/arckit.principles-compliance` command for measuring architecture principles adherence
- **Added**: principles-compliance row and column to dependency matrix
- **Updated**: All critical paths to include principles-compliance assessment
- **Updated**: Tier 13 description to include principles-compliance command
- **Updated**: service-assessment to optionally consume principles-compliance output (O)
- **Dependencies**: principles (M), requirements (R), stakeholders (R), risk (R), data-model (R), HLD (R), DLD (R), hld-review (R), dld-review (R), traceability (R), dpia (R), tcop (R), secure (R), mod-secure (R)

### 2025-11-02 - Critical Fixes + Optional Dependencies

- **Added**: analyze row showing optional dependencies on all artifacts
- **Fixed**: service-assessment compliance dependencies changed from M to O (tcop, ai-playbook, atrs, secure, mod-secure, jsp-936)
- **Fixed**: analyze compliance dependencies changed from M to O (tcop, ai-playbook, atrs, mod-secure)
- **Updated**: Critical paths reordered to show compliance commands before quality gates
- **Updated**: Tier 12 and Tier 13 descriptions to reflect optional dependencies and iterative execution
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
