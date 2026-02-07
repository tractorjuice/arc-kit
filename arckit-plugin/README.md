# ArcKit Plugin for Claude Code

Enterprise Architecture Governance & Vendor Procurement Toolkit - a Claude Code plugin providing 45 slash commands for generating architecture artifacts.

## Installation

### Step 1: Add the marketplace

In Claude Code, run:

```
/plugin marketplace add tractorjuice/arc-kit
```

### Step 2: Install the plugin

```
/plugin
```

Go to the **Discover** tab, find **arckit**, and install it. Or via CLI:

```bash
claude plugin install arckit@arc-kit
```

### Alternative: Load for a single session

```bash
claude --plugin-dir /path/to/arc-kit/arckit-plugin
```

## Prerequisites

- **Claude Code** v1.0.0 or later
- **Bash** shell (for helper scripts)
- For `/arckit:aws-research`: AWS Knowledge MCP server (included)
- For `/arckit:azure-research`: Microsoft Learn MCP server (install separately)

## Quick Start

After installing the plugin:

1. **Initialize a project** (optional - commands will create structure automatically):
   ```
   /arckit:init
   ```

2. **Create architecture principles**:
   ```
   /arckit:principles
   ```

3. **Create requirements for a project**:
   ```
   /arckit:requirements NHS appointment booking system
   ```

## What's Included

| Component | Count | Description |
|-----------|-------|-------------|
| Commands | 46 | Slash commands for architecture artifacts |
| Agents | 4 | Autonomous research agents |
| Templates | 45 | Document templates with UK Government compliance |
| Scripts | 6 | Helper bash scripts |
| Guides | 51 | Command usage documentation |

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

```
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

```
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

The plugin includes configuration for:
- **AWS Knowledge MCP** - Official AWS documentation for `/arckit:aws-research`
- **Microsoft Learn MCP** - Official Azure documentation for `/arckit:azure-research`

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

This plugin is for Claude Code. For Gemini CLI or Codex CLI, continue using the Python CLI:

```bash
pip install arckit-cli
arckit init --ai gemini
```

## Links

- [Repository](https://github.com/tractorjuice/arc-kit)
- [Documentation](https://tractorjuice.github.io/arc-kit)
- [Changelog](https://github.com/tractorjuice/arc-kit/blob/main/CHANGELOG.md)

## License

MIT
