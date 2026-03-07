# ArcKit Codex CLI Extension

<p align="center">
  <img src="../docs/assets/ArcKit_Logo_Horizontal_Dark.svg" alt="ArcKit" height="32">
</p>

Standalone [OpenAI Codex CLI](https://chatgpt.com/features/codex) extension for ArcKit -- Enterprise Architecture Governance & Vendor Procurement Toolkit.

> **Auto-generated**: Files in this directory are generated from plugin commands by `python scripts/converter.py`. Do not edit them directly -- edit the source in `arckit-plugin/commands/` and re-run the converter.

## Prerequisites

1. **ChatGPT Plan**: Codex CLI is included with ChatGPT Plus, Pro, Business, Edu, or Enterprise plans
2. **Codex CLI installed**: Follow [installation instructions](https://developers.openai.com/codex/cli/)
3. **Git repository**: ArcKit works best inside a git repository

## Installation

### Option 1: CLI (Recommended)

The ArcKit CLI scaffolds a complete project with commands, skills, agents, and MCP config in one step:

```bash
# Install the CLI
pip install git+https://github.com/tractorjuice/arc-kit.git
# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Create a new project
arckit init my-project --ai codex
cd my-project
codex --auto
```

This creates a project with:

- `.codex/prompts/` -- 57 slash commands
- `.codex/agents/` -- 6 agent configs (research, datascout, cloud providers, framework)
- `.codex/config.toml` -- MCP servers and agent roles
- `.agents/skills/` -- 4 skills (architecture workflow, Mermaid, PlantUML, Wardley mapping)
- `.arckit/templates/` -- document templates
- `.arckit/scripts/` -- helper scripts

### Option 2: Standalone Extension (manual)

This repo can also be used as a standalone extension installed once and shared across projects.

**Step 1: Commands (prompts)**

Set the `CODEX_HOME` environment variable to point at this directory:

```bash
# Add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export CODEX_HOME="/path/to/arckit-codex"
```

This makes all 57 ArcKit commands available as `/prompts:arckit.X` in every Codex session.

**Step 2: Skills**

Copy the `skills/` directory into your Codex agents directory:

```bash
cp -r /path/to/arckit-codex/skills/* ~/.agents/skills/
```

Skills are automatically activated when Codex detects a matching context. You can also reference them explicitly with `$skill-name` in your prompts.

**Step 3: MCP Servers and Agents**

Merge the contents of `config.toml` into your global Codex configuration:

```bash
# If you don't have a global config yet, copy directly
cp /path/to/arckit-codex/config.toml ~/.codex/config.toml

# If you already have a config, manually merge the [mcp_servers] and [agents] sections
```

MCP servers require no API keys except for Google Developer Knowledge (`GOOGLE_API_KEY`) and Data Commons (`DATA_COMMONS_API_KEY`). AWS Knowledge and Microsoft Learn work without authentication.

## Skills

Skills provide domain-specific knowledge that Codex can draw on automatically. Install them to `~/.agents/skills/` as described above.

| Skill | Invocation | Description |
|-------|------------|-------------|
| **architecture-workflow** | `$architecture-workflow` | ArcKit command sequencing, workflow paths, project onboarding, and "what comes next" guidance |
| **mermaid-syntax** | `$mermaid-syntax` | Mermaid diagram syntax for all diagram types (flowchart, sequence, C4, Gantt, ER, etc.), styling, theming, and troubleshooting |
| **plantuml-syntax** | `$plantuml-syntax` | PlantUML syntax including C4-PlantUML, sequence, class, activity, deployment diagrams, and layout patterns |
| **wardley-mapping** | `$wardley-mapping` | Wardley Mapping concepts: evolution stages, gameplay patterns, doctrine, build vs buy, quantitative scoring |

## Agents (Experimental)

Agents run as autonomous sub-processes to handle research-intensive tasks. They require the Codex multi-agent feature flag to be enabled.

> **Status**: The Codex CLI multi-agent system is experimental. Agent configuration is provided in `config.toml` under the `[agents]` section. Enable via the Codex multi-agent feature flag.

| Agent | Description |
|-------|-------------|
| **arckit-research** | Market research, vendor evaluation, build vs buy analysis, TCO comparison, UK Digital Marketplace search |
| **arckit-datascout** | External data source discovery -- APIs, datasets, open data portals, commercial data providers |
| **arckit-aws-research** | AWS service research via AWS Knowledge MCP (service matching, Well-Architected guidance, Security Hub controls) |
| **arckit-azure-research** | Azure service research via Microsoft Learn MCP (service matching, Well-Architected guidance, Security Benchmark controls) |
| **arckit-gcp-research** | Google Cloud research via Google Developer Knowledge MCP (service matching, Architecture Framework guidance) |
| **arckit-framework** | Transform project artifacts into a structured framework with phased organization, overview document, and executive guide |

Each agent has a system prompt (`agents/arckit-{name}.md`) and a TOML configuration (`agents/arckit-{name}.toml`).

## MCP Servers

Four Model Context Protocol servers are configured in `config.toml` to provide cloud platform and data knowledge:

| Server | URL | Auth Required |
|--------|-----|---------------|
| **aws-knowledge** | `https://knowledge-mcp.global.api.aws` | No |
| **microsoft-learn** | `https://learn.microsoft.com/api/mcp` | No |
| **google-developer-knowledge** | `https://developerknowledge.googleapis.com/mcp` | Yes (`GOOGLE_API_KEY`) |
| **datacommons-mcp** | `https://api.datacommons.org/mcp` | Yes (`DATA_COMMONS_API_KEY`) |

## Commands

All 57 commands are invoked as `/prompts:arckit.<command>` in Codex CLI.

### Foundation and Governance

```bash
/prompts:arckit.plan           # Project plan with GDS Agile Delivery phases
/prompts:arckit.principles     # Architecture principles
/prompts:arckit.stakeholders   # Stakeholder analysis with Power-Interest Grid
/prompts:arckit.risk           # Risk register (HM Treasury Orange Book)
/prompts:arckit.sobc           # Strategic Outline Business Case (Green Book 5-case)
/prompts:arckit.strategy       # Architecture strategy
/prompts:arckit.start          # Guided project onboarding
/prompts:arckit.init           # Initialize project structure
```

### Requirements and Data

```bash
/prompts:arckit.requirements       # Business, functional, non-functional requirements
/prompts:arckit.data-model         # Data model with ERD and GDPR compliance
/prompts:arckit.data-mesh-contract # Federated data product contract (ODCS v3.0.2)
/prompts:arckit.dpia               # Data Protection Impact Assessment
/prompts:arckit.platform-design    # Platform Design Toolkit (8 PDT canvases)
/prompts:arckit.glossary           # Domain glossary
```

### Research and Procurement

```bash
/prompts:arckit.research        # Market research with build vs buy analysis
/prompts:arckit.datascout       # External data source discovery
/prompts:arckit.aws-research    # AWS service research via MCP
/prompts:arckit.azure-research  # Azure service research via MCP
/prompts:arckit.gcp-research    # Google Cloud research via MCP
/prompts:arckit.wardley         # Wardley mapping
/prompts:arckit.roadmap         # Multi-year strategic roadmap
/prompts:arckit.evaluate        # Vendor scoring against requirements
/prompts:arckit.sow             # RFP statement of work
/prompts:arckit.gcloud-search   # G-Cloud framework search
/prompts:arckit.gcloud-clarify  # Supplier clarification questions
/prompts:arckit.dos             # Digital Outcomes and Specialists procurement
/prompts:arckit.finops          # Cloud financial operations
```

### Delivery and Quality

```bash
/prompts:arckit.adr             # Architecture Decision Records (MADR format)
/prompts:arckit.diagram         # C4 architecture diagrams
/prompts:arckit.dfd             # Data flow diagrams
/prompts:arckit.backlog         # Sprint-ready GDS backlog from requirements
/prompts:arckit.hld-review      # High-level design review
/prompts:arckit.dld-review      # Detailed design review
/prompts:arckit.analyze         # Cross-artifact quality analysis
/prompts:arckit.traceability    # Traceability matrix
/prompts:arckit.devops          # DevOps pipeline design
/prompts:arckit.mlops           # MLOps pipeline design
/prompts:arckit.operationalize  # Operational readiness
/prompts:arckit.servicenow      # ServiceNow CMDB export
/prompts:arckit.trello          # Trello board export
/prompts:arckit.framework       # Structured framework generation
/prompts:arckit.health          # Architecture health check
/prompts:arckit.presentation    # Executive presentation
/prompts:arckit.pages           # Documentation site generation
/prompts:arckit.template-builder # Custom template creation
/prompts:arckit.maturity-model  # Architecture maturity assessment
```

### Compliance and Governance Reporting

```bash
/prompts:arckit.principles-compliance  # Principles compliance (RAG evidence)
/prompts:arckit.conformance            # Architecture conformance review
/prompts:arckit.service-assessment     # GDS Service Standard assessment
/prompts:arckit.secure                 # Secure by Design review
/prompts:arckit.mod-secure             # MOD Secure by Design assessment
/prompts:arckit.jsp-936                # JSP 936 AI assurance documentation
/prompts:arckit.tcop                   # Technology Code of Practice compliance
/prompts:arckit.atrs                   # Algorithmic Transparency Record
/prompts:arckit.ai-playbook            # UK Government AI Playbook alignment
/prompts:arckit.story                  # Programme story for governance reporting
/prompts:arckit.customize              # Template customization
```

## Differences from Claude Code

| Feature | Claude Code (Plugin) | Codex CLI (Extension) |
|---------|---------------------|-----------------------|
| **Command format** | `/arckit.principles` | `/prompts:arckit.principles` |
| **Command location** | `arckit-plugin/commands/` | `arckit-codex/prompts/` |
| **Skills** | Supported (plugin skills/) | Supported (`~/.agents/skills/`) |
| **Agents** | Supported (Task tool) | Experimental (multi-agent flag) |
| **MCP servers** | Supported (plugin config) | Supported (`config.toml`) |
| **Hooks** | Supported (plugin hooks/) | Not supported |
| **Approval modes** | Automatic | `--auto`, `--read-only`, `--network` |
| **Template paths** | `${CLAUDE_PLUGIN_ROOT}/templates/` | `.arckit/templates/` |
| **Installation** | Marketplace plugin | Manual (`CODEX_HOME` + file copy) |

## File Structure

```
arckit-codex/
├── README.md              # This file
├── VERSION                # Extension version (tracks plugin)
├── config.toml            # MCP servers + agent configuration
├── prompts/               # 57 slash commands (/prompts:arckit.X)
│   ├── arckit.plan.md
│   ├── arckit.principles.md
│   ├── arckit.requirements.md
│   ├── arckit.research.md
│   └── ...
├── skills/                # 4 skills (copy to ~/.agents/skills/)
│   ├── architecture-workflow/
│   ├── mermaid-syntax/
│   ├── plantuml-syntax/
│   └── wardley-mapping/
├── agents/                # 6 agent configs + system prompts
│   ├── arckit-research.md
│   ├── arckit-research.toml
│   ├── arckit-datascout.md
│   ├── arckit-datascout.toml
│   └── ...
├── templates/             # Document templates
├── scripts/               # Helper scripts (bash, python)
└── docs/
    └── guides/            # Command usage guides
```

## Version

**Current Release: v3.1.2 (57 commands)**

---

**ArcKit Codex CLI Extension** -- Generated by `scripts/converter.py`
