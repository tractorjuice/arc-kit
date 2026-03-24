# ArcKit Plugin for Claude Code

Enterprise Architecture Governance & Vendor Procurement Toolkit - a Claude Code plugin providing 67 slash commands for generating architecture artifacts.

## Installation

### Step 1: Add the marketplace

In Claude Code, run:

```text
/plugin marketplace add tractorjuice/arc-kit
```

### Step 2: Install the plugin

```text
/plugin
```

Go to the **Discover** tab, find **arckit**, and install it. Or via CLI:

```bash
claude plugin install arckit@arc-kit
```

### Alternative: Load for a single session

```bash
claude --plugin-dir /path/to/arc-kit/arckit-claude
```

## Prerequisites

- **Claude Code** v2.1.63 or later (recommended minimum)
- **Bash** shell (for helper scripts)
- For `/arckit:aws-research`: AWS Knowledge MCP server (included)
- For `/arckit:azure-research`: Microsoft Learn MCP server (included)
- For `/arckit:gcp-research`: Google Developer Knowledge MCP (requires `GOOGLE_API_KEY` — see [MCP Servers](#mcp-servers))

> **Why v2.1.63?** This version includes memory leak fixes for subagents and long-running sessions, which directly improves stability for ArcKit's 9 research agents. It also fixes MCP server cache leaks (important for the 5 bundled MCP servers), resolves stale skill caching after `/clear`, and adds worktree config sharing for multi-repo workflows.

## Quick Start

After installing the plugin:

1. **Initialize a project** (optional - commands will create structure automatically):

   ```text
   /arckit:init
   ```

2. **Create architecture principles**:

   ```text
   /arckit:principles
   ```

3. **Create requirements for a project**:

   ```text
   /arckit:requirements NHS appointment booking system
   ```

## What's Included

| Component | Count | Description |
|-----------|-------|-------------|
| Commands | 67 | Slash commands for architecture artifacts |
| Skills | 1 | Conversational Wardley Mapping with interactive guidance |
| Agents | 9 | Autonomous research agents |
| Templates | 45 | Document templates with UK Government compliance |
| Scripts | 6 | Helper bash scripts |
| Guides | 52 | Command usage documentation |

## Template Customization

ArcKit templates can be customized per-project to match your organization's requirements, branding, or compliance frameworks.

### How It Works

1. **User templates override plugin templates**: If a template exists in `.arckit/templates/`, it takes precedence over the plugin's default template.

2. **Copy and customize**: Use `/arckit:customize` to copy templates to your project for editing.

### Quick Start

```bash
# List available templates
/arckit:customize list

# Copy a template to customize
/arckit:customize requirements

# Copy all templates
/arckit:customize all
```

### Common Customizations

**For non-UK Government projects:**

- Remove "UK Government Alignment" sections
- Change classification scheme from OFFICIAL-SENSITIVE to your organization's scheme
- Remove TCoP, GDS Service Standard references

**For your organization:**

- Add custom Document Control fields (Cost Centre, Programme, Department)
- Change requirement ID prefixes (BR/FR/NFR → your taxonomy)
- Add organization branding and headers
- Modify compliance frameworks (ISO27001, SOX, HIPAA instead of UK Gov)

### Template Location

```text
project-root/
├── .arckit/
│   └── templates/              # Your customized templates
│       ├── requirements-template.md
│       ├── risk-register-template.md
│       └── ...
└── projects/
    └── ...
```

### Keeping Templates Updated

When ArcKit plugin updates with new features:

- Your customized templates are **not** automatically updated
- Compare your templates with plugin versions periodically
- Merge new sections you want to adopt

## Skills

The plugin includes conversational skills that activate automatically when you ask relevant questions:

- **Wardley Mapping** — Ask about evolution stages, doctrine maturity, build vs. buy decisions, gameplay patterns, or create interactive maps. For formal documents, use `/arckit:wardley` instead.

## Commands Overview

### Core Governance

- `/arckit:principles` - Create architecture principles
- `/arckit:stakeholders` - Analyze stakeholders and goals
- `/arckit:requirements` - Generate comprehensive requirements
- `/arckit:risk` - Create risk register (Orange Book)
- `/arckit:sobc` - Strategic Outline Business Case (Green Book)

### Technical Design

- `/arckit:data-model` - Data model with GDPR compliance
- `/arckit:diagram` - Architecture diagrams (Mermaid)
- `/arckit:wardley` - Wardley Maps for strategy
- `/arckit:adr` - Architecture Decision Records

### Research & Procurement

- `/arckit:research` - Technology market research
- `/arckit:aws-research` - AWS service research (MCP)
- `/arckit:azure-research` - Azure service research (MCP)
- `/arckit:datascout` - External data source discovery
- `/arckit:evaluate` - Vendor evaluation framework
- `/arckit:sow` - Statement of Work / RFP
- `/arckit:gcloud-search` - G-Cloud marketplace search
- `/arckit:dos` - Digital Outcomes & Specialists

### UK Government Compliance

- `/arckit:tcop` - Technology Code of Practice review
- `/arckit:secure` - Secure by Design assessment
- `/arckit:dpia` - Data Protection Impact Assessment
- `/arckit:ai-playbook` - AI Playbook compliance
- `/arckit:service-assessment` - GDS Service Standard

### Operations & Delivery

- `/arckit:devops` - DevOps strategy
- `/arckit:finops` - FinOps cloud cost management
- `/arckit:mlops` - MLOps strategy
- `/arckit:operationalize` - Operational readiness
- `/arckit:backlog` - Product backlog generation
- `/arckit:roadmap` - Architecture roadmap

See the full command list with `/help arckit`.

## Project Structure

ArcKit creates this structure in your project:

```text
projects/
├── 000-global/           # Cross-project artifacts
│   ├── policies/         # Organization policies
│   └── ARC-000-PRIN-*.md # Architecture principles
└── 001-project-name/     # Project artifacts
    ├── ARC-001-REQ-*.md  # Requirements
    ├── ARC-001-STKE-*.md # Stakeholders
    ├── vendors/          # Vendor evaluations
    └── external/         # External documents
```

## MCP Servers

The plugin includes 5 MCP (Model Context Protocol) servers for cloud and government research:

| MCP Server | API Key Required | Used By |
|------------|-----------------|---------|
| AWS Knowledge | No | `/arckit:aws-research` |
| Microsoft Learn | No | `/arckit:azure-research` |
| Google Developer Knowledge | Yes (`GOOGLE_API_KEY`) | `/arckit:gcp-research` |
| Data Commons | Yes (`DATA_COMMONS_API_KEY`) | Data statistics lookups |
| govreposcrape | No | `/arckit:gov-reuse`, `/arckit:gov-code-search`, `/arckit:gov-landscape` |

AWS Knowledge and Microsoft Learn work out of the box with no configuration. The Google and Data Commons servers require API keys — if you don't set them, you'll see errors in the plugin UI, but **all other commands work normally**.

### Setting up optional API keys

**Google Developer Knowledge** (for `/arckit:gcp-research`):

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Set the environment variable: `export GOOGLE_API_KEY="your-key-here"`

**Data Commons** (for data statistics lookups):

1. Get an API key from [datacommons.org](https://datacommons.org)
2. Set the environment variable: `export DATA_COMMONS_API_KEY="your-key-here"`

## Migration from CLI

If you previously used `arckit init --ai claude`:

```bash
# Remove CLI-generated files (plugin replaces them)
rm -rf .claude/commands/arckit.*.md
rm -rf .claude/agents/arckit-*.md
rm -rf .arckit/templates/
rm -rf .arckit/scripts/

# Keep your project data
# projects/ directory stays (user data)
```

> **Note:** The ArcKit CLI no longer distributes Claude Code commands. Claude Code users should use this plugin instead.

## For Gemini/Codex Users

This plugin is for Claude Code. For other AI assistants:

- **Gemini CLI**: Install the [ArcKit Gemini extension](https://github.com/tractorjuice/arckit-gemini) (`gemini extensions install https://github.com/tractorjuice/arckit-gemini`)
- **Codex CLI**: Install the ArcKit CLI (`pip install arckit-cli && arckit init --ai codex`)

## Links

- [Repository](https://github.com/tractorjuice/arc-kit)
- [Documentation](https://tractorjuice.github.io/arc-kit)
- [Changelog](https://github.com/tractorjuice/arc-kit/blob/main/CHANGELOG.md)

## License

MIT
