# Complete Command Reference

## All 68 Commands (as of v4.6.6)

### Core Governance

| Command | Description | Agent? |
|---------|-------------|--------|
| `principles` | Architecture principles (technology-agnostic) | No |
| `principles-compliance` | Assess compliance against principles | No |
| `requirements` | Business and technical requirements (BR/FR/NFR/INT/DR) | No |
| `stakeholders` | Stakeholder drivers and goals analysis | No |
| `risk` | Risk management (Orange Book, Three Lines Model) | No |
| `sobc` | Strategic Outline Business Case (Green Book 2026) | No |
| `sow` | Statement of Work | No |
| `adr` | Architecture Decision Records (multi-instance) | No |
| `conformance` | Architecture conformance assessment | No |
| `glossary` | Project glossary with contextual definitions | No |

### Planning & Strategy

| Command | Description | Agent? |
|---------|-------------|--------|
| `plan` | Implementation planning | No |
| `roadmap` | Technology roadmap | No |
| `strategy` | Strategic analysis | No |
| `story` | User stories from requirements | No |
| `backlog` | Product backlog generation | No |
| `evaluate` | Technology evaluation | No |
| `maturity-model` | Capability maturity assessment | No |
| `start` | Quick project start | No |
| `init` | Initialize project structure | No |

### Research & Discovery

| Command | Description | Agent? |
|---------|-------------|--------|
| `research` | Market research, vendor eval, build vs buy, TCO | Yes |
| `datascout` | Data source discovery, API catalogues | Yes |
| `aws-research` | AWS service research | Yes |
| `azure-research` | Azure service research | Yes |
| `gcp-research` | GCP service research | Yes |
| `grants` | UK grants, funding, accelerators | Yes |

### Government Code Discovery

| Command | Description | Agent? |
|---------|-------------|--------|
| `gov-reuse` | Government code reuse assessment | Yes |
| `gov-code-search` | Government code semantic search | Yes |
| `gov-landscape` | Government code landscape analysis | Yes |

### Diagrams & Visualization

| Command | Description | Agent? |
|---------|-------------|--------|
| `diagram` | Architecture diagrams (Mermaid) | No |
| `dfd` | Data flow diagrams | No |
| `presentation` | Presentation generation | No |

### Wardley Mapping Suite

| Command | Description | Agent? |
|---------|-------------|--------|
| `wardley` | Wardley Map generation (OWM + Mermaid dual output) | No |
| `wardley.value-chain` | Value chain decomposition | No |
| `wardley.doctrine` | Organizational doctrine assessment (40+ principles) | No |
| `wardley.gameplay` | Strategic gameplay analysis (60+ patterns) | No |
| `wardley.climate` | Climatic pattern assessment (32 patterns) | No |

### Data Architecture

| Command | Description | Agent? |
|---------|-------------|--------|
| `data-model` | Comprehensive data modeling | No |
| `data-mesh-contract` | Data mesh contract generation | No |
| `dpia` | Data Protection Impact Assessment | No |

### Security & Compliance

| Command | Description | Agent? |
|---------|-------------|--------|
| `secure` | UK Government Secure by Design (NCSC CAF) | No |
| `mod-secure` | MOD Secure by Design (JSP 453) | No |
| `jsp-936` | MOD JSP 936 assessment | No |
| `atrs` | Algorithmic Transparency Recording Standard | No |
| `ai-playbook` | UK Government AI Playbook | No |
| `tcop` | Technology Code of Practice review | No |

### Procurement

| Command | Description | Agent? |
|---------|-------------|--------|
| `dos` | Digital Outcomes and Specialists | No |
| `score` | Vendor scoring with JSON storage | No |

### Platform & Operations

| Command | Description | Agent? |
|---------|-------------|--------|
| `platform-design` | Platform design | No |
| `devops` | DevOps assessment | No |
| `mlops` | MLOps assessment | No |
| `finops` | FinOps assessment | No |
| `operationalize` | Operational readiness | No |
| `servicenow` | ServiceNow service management design | No |

### Reviews

| Command | Description | Agent? |
|---------|-------------|--------|
| `analyze` | Governance quality analysis | No |
| `hld-review` | High-level design review | No |
| `dld-review` | Detailed-level design review | No |
| `service-assessment` | GDS Service Standard assessment | No |

### Knowledge Management

| Command | Description | Agent? |
|---------|-------------|--------|
| `framework` | Transform artifacts into structured framework | Yes |
| `traceability` | Traceability matrix | No |
| `impact` | Blast radius / reverse dependency analysis | No |
| `search` | Cross-project artifact search | No |

### Cloud Research

| Command | Description | Agent? |
|---------|-------------|--------|
| `gcloud-clarify` | GCP concept clarification | No |
| `gcloud-search` | GCP documentation search | No |

### Project Management

| Command | Description | Agent? |
|---------|-------------|--------|
| `trello` | Trello board generation | No |
| `pages` | Generate project dashboard website | No |
| `health` | Stale artifact detection | No |
| `customize` | Template customization | No |
| `template-builder` | Interactive template creation | No |

## Command Naming Across Platforms

| Claude Code | Codex CLI | Gemini CLI | OpenCode CLI | Copilot |
|------------|-----------|------------|--------------|---------|
| `/arckit.requirements` | `$arckit-requirements` | `/arckit:requirements` | `/arckit.requirements` | `/arckit-requirements` |

## Effort Levels

Commands can override the session effort via `effort:` frontmatter:

- **max**: Deep reasoning commands (requirements, research, etc.)
- **high**: Analysis commands (analyze, dfd, diagram, etc.)
- **medium/low**: Simple utility commands (inherit session default)

As of v4.6.0, 58 of 67 commands had effort explicitly set.
