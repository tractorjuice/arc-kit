# ArcKit - Gemini CLI Extension

**Enterprise Architecture Governance & Vendor Procurement Toolkit for Gemini CLI**

ArcKit provides 48 slash commands for generating architecture artifacts, vendor procurement documents, and UK Government compliance assessments — all from within Gemini CLI.

## Installation

```bash
gemini extensions install https://github.com/tractorjuice/arckit-gemini
```

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

## All 48 Commands

### Phase 0: Project Planning

| Command | Description |
|---------|-------------|
| `/arckit:init` | Initialize ArcKit project structure |
| `/arckit:plan` | Project plan with GDS Agile Delivery phases and Mermaid Gantt charts |
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
| `/arckit:data-mesh-contract` | Federated data product contract (ODCS v3.0.2) |
| `/arckit:dpia` | Data Protection Impact Assessment (GDPR Article 35) |
| `/arckit:platform-design` | Platform strategy using Platform Design Toolkit |
| `/arckit:wardley` | Wardley Map with strategic analysis |
| `/arckit:roadmap` | Multi-year strategic architecture roadmap |
| `/arckit:adr` | Architecture Decision Record (MADR format) |
| `/arckit:diagram` | Architecture diagrams (C4, Mermaid) |

### Phase 3: Research & Procurement

| Command | Description |
|---------|-------------|
| `/arckit:research` | Technology research with build vs buy analysis |
| `/arckit:datascout` | Data source discovery and API catalogue search |
| `/arckit:aws-research` | AWS service research (via AWS Knowledge MCP) |
| `/arckit:azure-research` | Azure service research (via Microsoft Learn MCP) |
| `/arckit:gcp-research` | GCP service research (via Google Developer Knowledge MCP) |
| `/arckit:gcloud-search` | G-Cloud 14 framework search |
| `/arckit:gcloud-clarify` | G-Cloud supplier clarification questions |
| `/arckit:dos` | Digital Outcomes and Specialists procurement |
| `/arckit:sow` | Statement of Work for RFP |
| `/arckit:evaluate` | Vendor scoring and evaluation |

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
| `/arckit:atrs` | AI Transparency Risk Standards assessment |
| `/arckit:ai-playbook` | AI Playbook compliance check |

### Phase 5: Operations & Delivery

| Command | Description |
|---------|-------------|
| `/arckit:devops` | DevOps maturity assessment and CI/CD pipeline design |
| `/arckit:finops` | FinOps cloud cost optimization assessment |
| `/arckit:mlops` | MLOps maturity assessment and ML pipeline design |
| `/arckit:operationalize` | Service operationalization and runbook generation |
| `/arckit:backlog` | Sprint-ready backlog generation |
| `/arckit:story` | Executive story for steering committee |

### Analysis & Reporting

| Command | Description |
|---------|-------------|
| `/arckit:analyze` | Comprehensive gap analysis across all artifacts |
| `/arckit:traceability` | Requirements traceability matrix |
| `/arckit:servicenow` | ServiceNow CMDB export design |
| `/arckit:trello` | Trello board export |
| `/arckit:pages` | GitHub Pages documentation site |

### Utilities

| Command | Description |
|---------|-------------|
| `/arckit:customize` | Template customization manager |

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
/arckit:gcloud-search Search G-Cloud 14 for payment processing services

# 6. Design reviews
/arckit:hld-review Review high-level design for microservices architecture
/arckit:secure Conduct Secure by Design review

# 7. Delivery
/arckit:backlog Generate sprint backlog with velocity 20 and 8 sprints
```

## MCP Servers

The extension bundles three MCP servers for cloud research:

| Server | Purpose | Auth Required |
|--------|---------|---------------|
| AWS Knowledge | AWS service docs, best practices | None |
| Microsoft Learn | Azure and Microsoft docs | None |
| Google Developer Knowledge | GCP docs | `GOOGLE_API_KEY` |

MCP servers are bridged via `mcp-remote` (requires Node.js).

## Alternative Installation: ArcKit CLI

If you prefer project-local commands instead of a global extension:

```bash
# Install CLI
pip install git+https://github.com/tractorjuice/arc-kit.git

# Scaffold project with Gemini commands
arckit init my-project --ai gemini
```

The CLI copies commands and templates into the project directory. The extension is recommended for most users as it provides automatic updates and a cleaner project structure.

## Links

- **Main ArcKit repo**: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
- **Claude Code plugin**: Install via `/plugin marketplace add tractorjuice/arc-kit`
- **Issues**: [github.com/tractorjuice/arc-kit/issues](https://github.com/tractorjuice/arc-kit/issues)
- **Gemini CLI**: [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)

## License

MIT License - see [LICENSE](LICENSE) for details.
