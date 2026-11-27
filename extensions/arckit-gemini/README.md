# ArcKit - Gemini CLI Extension

**The Enterprise Architecture Governance Harness for Gemini CLI**

ArcKit provides 75 core slash commands across strategy, architecture, delivery, assurance, and interoperability — including UK Government compliance — all from within Gemini CLI. Regional, sector and method overlay commands are included too and are not listed below.

## Installation

```bash
gemini extensions install https://github.com/tractorjuice/arckit-gemini
```

Using Google Antigravity? ArcKit has an experimental plugin for it: [arckit-antigravity](https://github.com/tractorjuice/arckit-antigravity).

### Prerequisites

- **[Gemini CLI](https://github.com/google-gemini/gemini-cli)**: `npm install -g @google/gemini-cli@latest`
- **Node.js**: Required for MCP server bridges (AWS Knowledge, Microsoft Learn)

### Optional: Google Cloud Research

To use `/arckit:gcp-research`, configure your Google API key:

```bash
# Set via Gemini CLI settings, or export directly:
export GOOGLE_API_KEY="your-api-key"
```

Get a key at https://makersuite.google.com/app/apikey

## Quick Start

```bash
# Start Gemini CLI in your project
cd /path/to/your/project
gemini

# Create a project plan
/arckit:plan Create project plan for cloud migration with 6-month timeline

# Establish governance
/arckit:principles Create cloud-first architecture principles

# Analyze stakeholders
/arckit:stakeholders Analyze stakeholders for payment gateway where CFO wants cost savings

# Define requirements
/arckit:requirements Create requirements for cloud migration project

# Research cloud platforms
/arckit:aws-research Evaluate AWS services for serverless architecture
/arckit:azure-research Evaluate Azure services for enterprise integration
/arckit:gcp-research Evaluate GCP services for data analytics platform
```

## Core Commands

### Phase 0: Project Planning

| Command | Description |
|---------|-------------|
| `/arckit:init` | Initialize ArcKit project structure |
| `/arckit:plan` | Project plan with GDS Agile Delivery phases and Mermaid Gantt charts |
| `/arckit:start` | Guided project onboarding, workflow selection, and command recommendations |
| `/arckit:strategy` | Enterprise architecture strategy document |

### Phase 1: Discovery

| Command | Description |
|---------|-------------|
| `/arckit:principles` | Architecture principles (global, cross-project) |
| `/arckit:stakeholders` | Stakeholder analysis with drivers, goals, RACI |
| `/arckit:risk` | Risk register (HM Treasury Orange Book) |
| `/arckit:sobc` | Strategic Outline Business Case (HM Treasury Green Book) |

### Phase 2: Alpha

| Command | Description |
|---------|-------------|
| `/arckit:requirements` | Comprehensive requirements (BR/FR/NFR/INT/DR) |
| `/arckit:data-model` | Data model with ERD, GDPR compliance |
| `/arckit:data-mesh-contract` | Federated data product contract (ODCS v3.2.0) |
| `/arckit:dpia` | Data Protection Impact Assessment (GDPR Article 35) |
| `/arckit:platform-design` | Platform strategy using Platform Design Toolkit |
| `/arckit:wardley` | Wardley Map with strategic analysis |
| `/arckit:wardley.value-chain` | Value chain decomposition for Wardley Mapping |
| `/arckit:wardley.doctrine` | Doctrine maturity assessment |
| `/arckit:wardley.climate` | Climatic pattern assessment |
| `/arckit:wardley.gameplay` | Strategic play analysis |
| `/arckit:roadmap` | Multi-year strategic architecture roadmap |
| `/arckit:adr` | Architecture Decision Record (MADR format) |
| `/arckit:dfd` | Yourdon-DeMarco Data Flow Diagrams (DFDs) with structured analysis notation |
| `/arckit:diagram` | Architecture diagrams (C4, Mermaid) |
| `/arckit:archify` | Governed artefacts as interactive HTML diagrams |

### Phase 3: Research & Procurement

| Command | Description |
|---------|-------------|
| `/arckit:research` | Technology research: options, facts and costs |
| `/arckit:datascout` | Data source discovery and API catalogue search |
| `/arckit:aws-research` | AWS service research (via AWS Knowledge MCP) |
| `/arckit:azure-research` | Azure service research (via Microsoft Learn MCP) |
| `/arckit:gcp-research` | GCP service research (via Google Developer Knowledge MCP) |
| `/arckit:gcloud-search` | G-Cloud framework search |
| `/arckit:gcloud-clarify` | G-Cloud supplier clarification questions |
| `/arckit:dos` | Digital Outcomes and Specialists procurement |
| `/arckit:sow` | Statement of Work for RFP |
| `/arckit:evaluate` | Vendor scoring and evaluation |
| `/arckit:framework` | Transform artifacts into structured framework with principles and guidance |
| `/arckit:gov-reuse` | Discover reusable UK government code before building from scratch |
| `/arckit:gov-code-search` | Search UK government repositories using natural language |
| `/arckit:gov-landscape` | Map the UK government code landscape for a domain |
| `/arckit:grants` | UK grants, charitable funding and accelerator research |
| `/arckit:tenders` | UK procurement market intelligence from the UK Tenders MCP |
| `/arckit:competitors` | Competitor landscape from the UK Tenders MCP |
| `/arckit:score` | Persistent vendor scoring, comparison and audit |

### Phase 4: Beta & Live

| Command | Description |
|---------|-------------|
| `/arckit:hld-review` | High-Level Design review |
| `/arckit:dld-review` | Detailed-Level Design review |
| `/arckit:principles-compliance` | Architecture principles compliance (RAG evidence) |
| `/arckit:service-assessment` | GDS Service Standard assessment |
| `/arckit:secure` | UK Government Secure by Design review |
| `/arckit:mod-secure` | MOD Secure by Design review |
| `/arckit:jsp-936` | JSP 936 AI assurance documentation |
| `/arckit:tcop` | Technology Code of Practice assessment |
| `/arckit:atrs` | Algorithmic Transparency Recording Standard (ATRS) record |
| `/arckit:ai-playbook` | AI Playbook compliance check |
| `/arckit:conformance` | Architecture conformance assessment (ADR implementation, drift, debt) |

### Phase 5: Operations & Delivery

| Command | Description |
|---------|-------------|
| `/arckit:devops` | DevOps maturity assessment and CI/CD pipeline design |
| `/arckit:finops` | FinOps cloud cost optimization assessment |
| `/arckit:mlops` | MLOps maturity assessment and ML pipeline design |
| `/arckit:operationalize` | Service operationalization and runbook generation |
| `/arckit:backlog` | Sprint-ready backlog generation |
| `/arckit:presentation` | MARP presentation slides from project artifacts |
| `/arckit:story` | Executive story for steering committee |

### Analysis & Reporting

| Command | Description |
|---------|-------------|
| `/arckit:analyze` | Comprehensive governance quality analysis across architecture artifacts |
| `/arckit:traceability` | Requirements traceability matrix |
| `/arckit:servicenow` | ServiceNow CMDB export design |
| `/arckit:trello` | Trello board export |
| `/arckit:glossary` | Consolidated project glossary of terms and acronyms |
| `/arckit:health` | Project health scan (stale research, orphaned artifacts, drift) |
| `/arckit:maturity-model` | Capability maturity model with assessment criteria |
| `/arckit:pages` | GitHub Pages documentation site |
| `/arckit:search` | Search project artifacts by keyword, document type or requirement ID |
| `/arckit:navigator` | Coverage against the ArcKit baseline and next command to run |
| `/arckit:impact` | Blast radius of a change to a requirement, decision or design |
| `/arckit:graph-report` | Governance metrics dashboard |

### Utilities

| Command | Description |
|---------|-------------|
| `/arckit:customize` | Template customization manager |
| `/arckit:template-builder` | Create new document templates via interactive interview |

### Interoperability

| Command | Description |
|---------|-------------|
| `/arckit:export-okf` | Export ArcKit artifacts as an OKF-compatible Markdown bundle |
| `/arckit:import-okf` | Import OKF bundles as reviewable research notes |

## Agents

ArcKit includes 14 autonomous agents that handle web-intensive tasks. The main ones are:

- **arckit-research** — Market research: options, checked facts, published costs
- **arckit-datascout** — Data source discovery, API catalogue search
- **arckit-aws-research** — AWS service research (via AWS Knowledge MCP)
- **arckit-azure-research** — Azure service research (via Microsoft Learn MCP)
- **arckit-gcp-research** — GCP service research (via Google Developer Knowledge MCP)
- **arckit-framework** — Transform artifacts into structured framework
- **arckit-gov-reuse**, **arckit-gov-code-search**, **arckit-gov-landscape** — UK government code reuse, search and landscape (via govreposcrape)
- **arckit-grants** — UK grants and funding research
- **arckit-tenders**, **arckit-competitors** — UK procurement award benchmarks and competitor landscape
- **arckit-evaluate**, **arckit-score** — Vendor evaluation and scoring

## Hooks

Automation hooks fire during your session to provide context and enforce standards:

- **Session Init** — Injects ArcKit version and project status on startup
- **Context Inject** — Adds project artifact inventory before agent planning
- **Filename Validator** — Validates ARC-xxx naming convention on file writes
- **File Protection** — Blocks writes to sensitive/protected files
- **Manifest Updater** — Updates manifest.json after writing project files

## Policies

Policy rules enforce extension safety:

- Prevent modification of ArcKit extension system files
- Warn when file content may contain potential secrets

## Theme

ArcKit includes a GDS-branded terminal theme using official UK Government Design System colors.

## Template Customization

Override default templates by placing customized versions in your project:

```bash
# Create override directory
mkdir -p .arckit/templates

# Copy and edit a template
cp ~/.gemini/extensions/arckit/templates/requirements-template.md .arckit/templates/

# Edit to match your organization's needs
# Commands will automatically use your override
```

Common customizations:

- Remove UK Government sections for non-UK Gov projects
- Add organization-specific Document Control fields
- Change requirement ID prefixes
- Add branding, headers, footers

## Workflow Example

```bash
# 1. Create project plan
/arckit:plan Create project plan for payment modernization with 6-month timeline

# 2. Establish governance
/arckit:principles Create cloud-first principles for financial services

# 3. Discovery phase
/arckit:stakeholders Analyze stakeholders for payment gateway
/arckit:risk Create risk register for payment modernization
/arckit:sobc Create Strategic Outline Business Case with £2M investment

# 4. Alpha phase
/arckit:requirements Create requirements for payment gateway
/arckit:data-model Create data model for payment transactions with PCI-DSS compliance
/arckit:wardley Create Wardley map showing build vs buy for payment infrastructure

# 5. Research & procurement
/arckit:research Research payment processing platforms
/arckit:aws-research Evaluate AWS payment services
/arckit:gcloud-search Search G-Cloud for payment processing services

# 6. Design reviews
/arckit:hld-review Review high-level design for microservices architecture
/arckit:secure Conduct Secure by Design review

# 7. Delivery
/arckit:backlog Generate sprint backlog with velocity 20 and 8 sprints
```

## MCP Servers

The extension bundles five MCP servers for cloud, data and UK government code research:

| Server | Purpose | Auth Required |
|--------|---------|---------------|
| AWS Knowledge | AWS service docs, best practices | None |
| Microsoft Learn | Azure and Microsoft docs | None |
| Google Developer Knowledge | GCP docs | `GOOGLE_API_KEY` |
| Data Commons | Statistical data | `DATA_COMMONS_API_KEY` |
| govreposcrape | UK government code search | None |

MCP servers are bridged via `mcp-remote` (requires Node.js).

## Alternative Installation: ArcKit CLI

The extension is recommended for all Gemini CLI users as it provides automatic updates and a clean zero-config experience.

## Links

- **Main ArcKit repo**: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
- **Claude Code plugins**: Install via `/plugin marketplace add tractorjuice/arckit-claude`
- **Issues**: [github.com/tractorjuice/arc-kit/issues](https://github.com/tractorjuice/arc-kit/issues)
- **Gemini CLI**: [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)

## License

MIT License - see [LICENSE](LICENSE) for details.
