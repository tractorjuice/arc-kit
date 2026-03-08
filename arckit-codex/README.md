# ArcKit Codex CLI Extension

<p align="center">
  <img src="../docs/assets/ArcKit_Logo_Horizontal_Dark.svg" alt="ArcKit" height="32">
</p>

Standalone [OpenAI Codex CLI](https://chatgpt.com/features/codex) extension for ArcKit -- Enterprise Architecture Governance & Vendor Procurement Toolkit.

> **Auto-generated**: Files in this directory are generated from plugin commands by `python scripts/converter.py`. Do not edit them directly -- edit the source in `arckit-claude/commands/` and re-run the converter.

## Prerequisites

1. **ChatGPT Plan**: Codex CLI is included with ChatGPT Plus, Pro, Business, Edu, or Enterprise plans
2. **Codex CLI installed**: Follow [installation instructions](https://developers.openai.com/codex/cli/)
3. **Git repository**: ArcKit works best inside a git repository

## Installation

### Option 1: CLI (Recommended)

The ArcKit CLI scaffolds a complete project with skills, agents, and MCP config in one step:

```bash
# Install the CLI
pip install git+https://github.com/tractorjuice/arc-kit.git
# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Create a new project
arckit init my-project --ai codex
cd my-project
codex
```

That's it -- no environment variables, no config files. Codex auto-discovers skills from `.agents/skills/`.

This creates a project with:

- `.agents/skills/` -- 63 skills (59 commands + 4 reference skills, auto-discovered by Codex)
- `.codex/agents/` -- 6 agent configs (research, datascout, cloud providers, framework)
- `.codex/config.toml` -- MCP servers and agent roles
- `.arckit/templates/` -- document templates
- `.arckit/scripts/` -- helper scripts

### Option 2: Standalone Extension (manual)

This repo can also be used as a standalone extension installed once and shared across projects.

**Step 1: Skills (commands)**

Copy the `skills/` directory into your project or home directory:

```bash
# Per-project (auto-discovered from repo root)
cp -r /path/to/arckit-codex/skills/* .agents/skills/

# Or global (auto-discovered from $HOME)
cp -r /path/to/arckit-codex/skills/* ~/.agents/skills/
```

This makes all 59 ArcKit commands available as `$arckit-*` skills plus 4 reference skills.

**Step 2: MCP Servers and Agents**

Merge the contents of `config.toml` into your global Codex configuration:

```bash
# If you don't have a global config yet, copy directly
cp /path/to/arckit-codex/config.toml ~/.codex/config.toml

# If you already have a config, manually merge the [mcp_servers] and [agents] sections
```

MCP servers require no API keys except for Google Developer Knowledge (`GOOGLE_API_KEY`) and Data Commons (`DATA_COMMONS_API_KEY`). AWS Knowledge and Microsoft Learn work without authentication.

## Skills

All 59 commands are available as skills, invoked with `$arckit-<command>` in Codex CLI. Additionally, 4 reference skills provide domain knowledge.

### Reference Skills

| Skill | Invocation | Description |
|-------|------------|-------------|
| **architecture-workflow** | `$architecture-workflow` | ArcKit command sequencing, workflow paths, project onboarding, and "what comes next" guidance |
| **mermaid-syntax** | `$mermaid-syntax` | Mermaid diagram syntax for all diagram types (flowchart, sequence, C4, Gantt, ER, etc.), styling, theming, and troubleshooting |
| **plantuml-syntax** | `$plantuml-syntax` | PlantUML syntax including C4-PlantUML, sequence, class, activity, deployment diagrams, and layout patterns |
| **wardley-mapping** | `$wardley-mapping` | Wardley Mapping concepts: evolution stages, gameplay patterns, doctrine, build vs buy, quantitative scoring |

### Command Skills

#### Foundation and Governance

```bash
$arckit-plan           # Project plan with GDS Agile Delivery phases
$arckit-principles     # Architecture principles
$arckit-stakeholders   # Stakeholder analysis with Power-Interest Grid
$arckit-risk           # Risk register (HM Treasury Orange Book)
$arckit-sobc           # Strategic Outline Business Case (Green Book 5-case)
$arckit-strategy       # Architecture strategy
$arckit-start          # Guided project onboarding
$arckit-init           # Initialize project structure
```

#### Requirements and Data

```bash
$arckit-requirements       # Business, functional, non-functional requirements
$arckit-data-model         # Data model with ERD and GDPR compliance
$arckit-data-mesh-contract # Federated data product contract (ODCS v3.0.2)
$arckit-dpia               # Data Protection Impact Assessment
$arckit-platform-design    # Platform Design Toolkit (8 PDT canvases)
$arckit-glossary           # Domain glossary
```

#### Research and Procurement

```bash
$arckit-research        # Market research with build vs buy analysis
$arckit-datascout       # External data source discovery
$arckit-aws-research    # AWS service research via MCP
$arckit-azure-research  # Azure service research via MCP
$arckit-gcp-research    # Google Cloud research via MCP
$arckit-wardley         # Wardley mapping
$arckit-roadmap         # Multi-year strategic roadmap
$arckit-evaluate        # Vendor scoring against requirements
$arckit-sow             # RFP statement of work
$arckit-gcloud-search   # G-Cloud framework search
$arckit-gcloud-clarify  # Supplier clarification questions
$arckit-dos             # Digital Outcomes and Specialists procurement
$arckit-finops          # Cloud financial operations
```

#### Delivery and Quality

```bash
$arckit-adr             # Architecture Decision Records (MADR format)
$arckit-diagram         # C4 architecture diagrams
$arckit-dfd             # Data flow diagrams
$arckit-backlog         # Sprint-ready GDS backlog from requirements
$arckit-hld-review      # High-level design review
$arckit-dld-review      # Detailed design review
$arckit-analyze         # Cross-artifact quality analysis
$arckit-traceability    # Traceability matrix
$arckit-devops          # DevOps pipeline design
$arckit-mlops           # MLOps pipeline design
$arckit-operationalize  # Operational readiness
$arckit-servicenow      # ServiceNow CMDB export
$arckit-trello          # Trello board export
$arckit-framework       # Structured framework generation
$arckit-health          # Architecture health check
$arckit-presentation    # Executive presentation
$arckit-pages           # Documentation site generation
$arckit-template-builder # Custom template creation
$arckit-maturity-model  # Architecture maturity assessment
```

#### Compliance and Governance Reporting

```bash
$arckit-principles-compliance  # Principles compliance (RAG evidence)
$arckit-conformance            # Architecture conformance review
$arckit-service-assessment     # GDS Service Standard assessment
$arckit-secure                 # Secure by Design review
$arckit-mod-secure             # MOD Secure by Design assessment
$arckit-jsp-936                # JSP 936 AI assurance documentation
$arckit-tcop                   # Technology Code of Practice compliance
$arckit-atrs                   # Algorithmic Transparency Record
$arckit-ai-playbook            # UK Government AI Playbook alignment
$arckit-story                  # Programme story for governance reporting
$arckit-customize              # Template customization
```

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

## Differences from Claude Code

| Feature | Claude Code (Plugin) | Codex CLI (Extension) |
|---------|---------------------|-----------------------|
| **Command format** | `/arckit.principles` | `$arckit-principles` |
| **Command location** | `arckit-claude/commands/` | `arckit-codex/skills/arckit-*/` |
| **Skills** | Supported (plugin skills/) | Supported (`.agents/skills/`, auto-discovered) |
| **Agents** | Supported (Task tool) | Experimental (multi-agent flag) |
| **MCP servers** | Supported (plugin config) | Supported (`config.toml`) |
| **Hooks** | Supported (plugin hooks/) | Not supported |
| **Approval modes** | Automatic | `--auto`, `--read-only`, `--network` |
| **Template paths** | `${CLAUDE_PLUGIN_ROOT}/templates/` | `.arckit/templates/` |
| **Installation** | Marketplace plugin | CLI (`arckit init --ai codex`) or manual file copy |

## File Structure

```text
arckit-codex/
├── README.md              # This file
├── VERSION                # Extension version (tracks plugin)
├── config.toml            # MCP servers + agent configuration
├── skills/                # 63 skills (59 commands + 4 reference)
│   ├── arckit-requirements/
│   │   ├── SKILL.md       # Command prompt with frontmatter
│   │   └── agents/
│   │       └── openai.yaml  # allow_implicit_invocation: false
│   ├── arckit-principles/
│   ├── ...                # 55 more command skills
│   ├── architecture-workflow/  # Reference skill
│   ├── mermaid-syntax/         # Reference skill
│   ├── plantuml-syntax/        # Reference skill
│   └── wardley-mapping/        # Reference skill
├── prompts/               # 59 prompts (deprecated, use skills instead)
├── agents/                # 6 agent configs + system prompts
│   ├── arckit-research.md
│   ├── arckit-research.toml
│   └── ...
├── templates/             # Document templates
├── scripts/               # Helper scripts (bash, python)
└── docs/
    └── guides/            # Command usage guides
```

## Version

**Current Release: v3.1.2 (59 commands, 4 reference skills)**

---

**ArcKit Codex CLI Extension** -- Generated by `scripts/converter.py`
