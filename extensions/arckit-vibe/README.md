# ArcKit for Mistral Vibe

The Enterprise Architecture Governance Harness for Mistral Vibe CLI.

> **Status**: Beta (Community Preview) 🟡
> **Version**: 5.13.1
> **ArcKit Version**: 5.13.1
>
> **Note**: This extension is currently in beta. The extension is published from the standalone `tractorjuice/arckit-vibe` repository and regenerated from ArcKit's canonical plugin sources.

## Overview

ArcKit for Mistral Vibe brings the full power of the Enterprise Architecture Governance Harness to Mistral's CLI coding agent. This extension provides 73+ commands (skills) across strategy, architecture, delivery, and assurance workflows, plus 10+ specialized agents for complex research and analysis tasks.

## Installation

### Option 1: Clone and Link (Recommended)

```bash
# Clone the standalone extension repository
git clone https://github.com/tractorjuice/arckit-vibe.git
cd arckit-vibe

# Create the extensions directory if it doesn't exist
mkdir -p ~/.vibe/extensions/

# Link the ArcKit Vibe extension
ln -s $(pwd) ~/.vibe/extensions/arckit
```

### Option 2: Copy Files

```bash
# Clone the repository
git clone https://github.com/tractorjuice/arckit-vibe.git

# Copy the extension to your Vibe extensions directory
cp -r arckit-vibe ~/.vibe/extensions/arckit
```

### Option 3: Manual Setup

1. Create directory: `mkdir -p ~/.vibe/extensions/arckit`
2. Copy all files from the standalone `arckit-vibe` repository to `~/.vibe/extensions/arckit/`
3. Ensure directory structure is preserved

## Configuration

### MCP Servers

ArcKit includes MCP (Model Context Protocol) servers for authoritative documentation access:

| Server | Description | Enabled by Default |
|--------|-------------|-------------------|
| `aws-knowledge` | AWS service documentation | Yes |
| `microsoft-learn` | Microsoft Azure documentation | Yes |
| `google-developer-knowledge` | Google Cloud documentation | No (requires API key) |
| `govreposcrape` | UK Government repository data | Yes |
| `datacommons-mcp` | Statistical and demographic data | No (requires API key) |

To enable MCP servers, add to your `~/.vibe/config.toml`:

```toml
[mcp]
aws-knowledge = { enabled = true }
microsoft-learn = { enabled = true }
google-developer-knowledge = { 
    enabled = true, 
    headers = { X-Goog-Api-Key = "${GOOGLE_API_KEY}" }
}
govreposcrape = { enabled = true }
```

### User Configuration

Set default values for document generation in `~/.vibe/config.toml`:

```toml
[extension.arckit]
organisation_name = "Your Organization"
default_classification = "OFFICIAL"
governance_framework = "UK Gov"
GOOGLE_API_KEY = "your-google-api-key"
DATA_COMMONS_API_KEY = "your-datacommons-api-key"
```

Or use environment variables:

```bash
export GOOGLE_API_KEY="your-api-key"
export DATA_COMMONS_API_KEY="your-api-key"
```

## Usage

### Skills (Commands)

All ArcKit commands are available as Mistral Vibe skills. Invoke them with the `/` prefix:

```bash
# Architecture principles
vibe /arckit-principles Create cloud-first principles for financial services

# Comprehensive requirements
vibe /arckit-requirements payment-processing-system

# Stakeholder analysis
vibe /arckit-stakeholders Analyze stakeholders for customer portal project

# Architecture diagrams
vibe /arckit-diagram Create a C4 context diagram for the e-commerce platform

# Wardley mapping
vibe /arckit-wardley Map the value chain for payment processing

# Risk assessment
vibe /arckit-risk Create risk register for the new platform

# Data modeling
vibe /arckit-data-model Design data model for customer management

# Build vs buy analysis
vibe /arckit-build Analyze build vs buy for authentication system
```

### Agents

Specialized agents for complex workflows. Invoke with the `--agent` flag:

```bash
# Technology market research
vibe --agent arckit-research "Research cloud providers for healthcare application"

# AWS-specific research
vibe --agent arckit-aws-research "Find serverless patterns for data processing"

# Azure-specific research
vibe --agent arckit-azure-research "Compare Cosmos DB vs SQL Database for our use case"

# GCP-specific research
vibe --agent arckit-gcp-research "Evaluate BigQuery vs Snowflake for analytics"
```

## Command Categories

### Strategy & Planning

| Skill | Description |
|-------|-------------|
| `/arckit-principles` | Create architecture principles |
| `/arckit-roadmap` | Create technology roadmap |
| `/arckit-wardley` | Create Wardley maps |
| `/arckit-stakeholders` | Analyze stakeholders |
| `/arckit-backlog` | Create product backlog |

### Architecture

| Skill | Description |
|-------|-------------|
| `/arckit-adr` | Create Architecture Decision Records |
| `/arckit-dfd` | Create Data Flow Diagrams |
| `/arckit-data-model` | Create data models |
| `/arckit-diagram` | Create architecture diagrams |
| `/arckit-trg` | Create Target Reference Architecture |
| `/arckit-framework` | Evaluate architecture frameworks |

### Requirements & Analysis

| Skill | Description |
|-------|-------------|
| `/arckit-requirements` | Create comprehensive requirements |
| `/arckit-analyze` | Analyze existing systems |
| `/arckit-competitors` | Analyze competitors |
| `/arckit-datascout` | Scout data landscape |
| `/arckit-gov-landscape` | Map government technology landscape |

### Delivery

| Skill | Description |
|-------|-------------|
| `/arckit-build` | Build vs buy analysis |
| `/arckit-devops` | DevOps assessment |
| `/arckit-finops` | FinOps assessment |
| `/arckit-devops` | DevOps capability assessment |

### Assurance & Compliance

| Skill | Description |
|-------|-------------|
| `/arckit-conformance` | Conformance assessment |
| `/arckit-risk` | Risk management |
| `/arckit-dpia` | Data Protection Impact Assessment |
| `/arckit-dos` | Digital Operation Standards |
| `/arckit-dld-review` | Design review (HLD/DLD) |

### Research

| Skill | Description |
|-------|-------------|
| `/arckit-research` | Technology market research |
| `/arckit-aws-research` | AWS-specific research |
| `/arckit-azure-research` | Azure-specific research |
| `/arckit-gcp-research` | GCP-specific research |
| `/arckit-gov-code-search` | Government code search |

### Vendor Management

| Skill | Description |
|-------|-------------|
| `/arckit-sow` | Create Statement of Work |
| `/arckit-evaluate` | Vendor evaluation |
| `/arckit-rfq` | Request for Quote |
| `/arckit-tenders` | UK tender search |
| `/arckit-gov-reuse` | Government platform reuse |

## Templates

ArcKit includes comprehensive templates for all artifact types. Templates are loaded from:

1. **Project-local custom**: `.arckit/templates-custom/` (highest priority)
2. **Project-local**: `.arckit/templates/`
3. **Extension defaults**: `${VIBE_EXTENSION_ROOT}/templates/`

To customize a template:

```bash
# Create custom templates directory
mkdir -p .arckit/templates-custom/

# Copy a template to customize
cp ~/.vibe/extensions/arckit/templates/architecture-principles-template.md \
   .arckit/templates-custom/architecture-principles-template.md

# Edit the custom template
```

## Project Structure

ArcKit recommends the following project structure:

```text
project-root/
├── .arckit/
│   ├── templates-custom/      # Custom templates
│   └── templates/            # Project templates
├── projects/
│   ├── 000-global/            # Global artifacts
│   │   ├── ARC-000-PRIN-v1.0.md      # Architecture principles
│   │   ├── ARC-000-RISK-v1.0.md      # Global risk register
│   │   └── policies/                 # Global policies
│   ├── 001-payment-processing/       # Project-specific
│   │   ├── ARC-001-REQ-v1.0.md       # Requirements
│   │   ├── ARC-001-ADR-v1.0.md       # Architecture decisions
│   │   ├── ARC-001-DATA-v1.0.md      # Data model
│   │   └── external/                # External documents
│   └── 002-customer-portal/
│       ├── ARC-002-STKE-v1.0.md      # Stakeholders
│       └── ARC-002-USTOR-v1.0.md     # User stories
└── README.md
```

## Community Overlays

ArcKit includes jurisdiction-specific command overlays:

| Overlay | Prefix | Description |
|---------|--------|-------------|
| UK Government | (default) | UK Service Standard, TCoP, NCSC CAF |
| UAE Federal | `arckit-uae-` | UAE Cabinet instruments, PDPL, IAS |
| France | `arckit-fr-` | French government standards |
| Canada | `arckit-ca-` | Canadian government standards |
| EU | `arckit-eu-` | EU digital standards |
| Austria | `arckit-at-` | Austrian government standards |
| Australia | `arckit-au-` | Australian government standards |
| US Federal | `arckit-us-` | US federal standards |
| UK NHS | `arckit-uk-nhs-` | NHS-specific standards |
| UK G-Cloud | `arckit-uk-gcloud-` | G-Cloud procurement (proprietary) |

To use community overlays:

```bash
# UAE-specific commands
vibe /arckit-uae-ai-charter

# France-specific commands  
vibe /arckit-fr-secnumcloud
```

**Note:** Community overlay commands are available for UK, UAE, France, Canada, EU, Austria, Australia, US Federal, UK NHS, and UK G-Cloud jurisdictions. Run `vibe /arckit-` and use tab completion to see available commands for each overlay.

## Quality Assurance

### Document Standards

All ArcKit artifacts follow consistent patterns:

- **Document ID**: `ARC-{PROJECT_ID}-{TYPE}-v{VERSION}.md`
- **Filename**: Matches document ID
- **Frontmatter**: Standard metadata fields
- **Sections**: Consistent structure across types
- **Revision History**: Version tracking

### Citation Traceability

When referencing external documents:

1. Place inline citation markers: `[DOC-C1]`, `[PP-C2]`, etc.
2. List all citations in "External References" section
3. Include source document name and page/section

## Troubleshooting

### MCP Server Connection Issues

If MCP servers fail to connect:

1. **Check your internet connection**
2. **Verify the server URL** in the MCP configuration
3. **For Google services**, ensure `GOOGLE_API_KEY` is set:

   ```bash
   export GOOGLE_API_KEY="your-api-key"
   ```

4. **Check Mistral Vibe logs** for connection errors
5. **Test MCP manually**:

   ```bash
   curl https://knowledge-mcp.global.api.aws/health
   ```

### Command Not Found

If a skill is not found:

1. **Verify the extension is properly linked**:

   ```bash
   ls -la ~/.vibe/extensions/arckit
   ```

2. **Check for typos** in the skill name
3. **List available skills**:

   ```bash
   ls ~/.vibe/extensions/arckit/skills/
   ```

4. **Run help command**:

   ```bash
   vibe /arckit-help
   ```

5. **Ensure you're using the latest version**

### Template Issues

If templates don't render:

1. **Check custom template syntax**:

   ```bash
   cat .arckit/templates-custom/architecture-principles-template.md
   ```

2. **Verify template file names** match expected patterns
3. **Ensure YAML frontmatter** is valid in templates
4. **Check file permissions** on template files

### Performance Issues

If commands are slow:

1. **Limit MCP servers** - Disable unused servers in config
2. **Use specific agents** for research instead of general commands
3. **Pre-scan documents** before running commands
4. **Check memory usage** - Vibe may need more resources

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/tractorjuice/arc-kit/issues)
- **Documentation**: [ArcKit Docs](https://tractorjuice.github.io/arc-kit/)
- **Discussion**: [GitHub Discussions](https://github.com/tractorjuice/arc-kit/discussions)
- **ArcKit Repository**: [tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 5.13.1 | 2026-06-16 | Initial Mistral Vibe extension release |

## Acknowledgments

- Built on [Mistral Vibe](https://github.com/mistralai/mistral-vibe)
- Uses [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol/spec)
- Inspired by enterprise architecture frameworks (TOGAF, Zachman)
- Compatible with UK Government standards (Service Standard, TCoP, NCSC CAF)
