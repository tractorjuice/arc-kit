# ArcKit Plugin for Claude Code

The Enterprise Architecture Governance Harness — a Claude Code plugin providing 75 slash commands across strategy, architecture, delivery, assurance, and interoperability.

## Installation

### Step 0: Make sure Claude Code is up to date

ArcKit v4.14.0 needs Claude Code **v2.1.121 or later** (see Prerequisites below). The simplest way to land on a supported version — even if you've never installed Claude Code before — is:

```bash
claude install latest
```

If you don't yet have the `claude` CLI on your PATH, follow the [official Claude Code install guide](https://docs.claude.com/en/docs/claude-code/quickstart) first, then run `claude install latest`. To check what you're on:

```bash
claude --version
```

### Step 1: Add the marketplace

In Claude Code, run:

```text
/plugin marketplace add tractorjuice/arckit-claude
```

### Step 2: Install the plugin

```text
/plugin
```

Go to the **Discover** tab, find **arckit**, and install it. Or via CLI:

```bash
claude plugin install arckit@arckit-claude
```

### Installing with ArcKit overlay plugins

The same marketplace hosts the core plugin plus regional, sector, and tooling overlays.
Install only the plugins you need:

```bash
claude plugin install arckit arckit-uae
claude plugin install arckit arckit-au arckit-au-energy
claude plugin install arckit arckit-uk-finance
```

The `arckit-uk-gcloud` overlay is public for installation and inspection, but remains
proprietary and is not MIT licensed.

### Alternative: Load for a single session

```bash
claude --plugin-dir /path/to/arckit-claude
```

## Prerequisites

- **Claude Code** v2.1.121 or later (recommended minimum)
- **Bash** shell (for helper scripts)
- For `/arckit:aws-research`: AWS Knowledge MCP server (included)
- For `/arckit:azure-research`: Microsoft Learn MCP server (included)
- For `/arckit:gcp-research`: Google Developer Knowledge MCP (requires `GOOGLE_API_KEY` — see [MCP Servers](#mcp-servers))

> **Why v2.1.121?** ArcKit now uses MCP `alwaysLoad` to eager-load AWS Knowledge and Microsoft Learn tools at session start (skips a discovery round-trip on `/arckit:aws-research` and `/arckit:azure-research`), and PostToolUse `hookSpecificOutput.updatedToolOutput` so provenance-stamp and manifest hooks surface their effects to the model in-band — both v2.1.121 features. The release flow uses `claude plugin tag --dry-run` (v2.1.118) to validate plugin/marketplace version agreement, and the session-telemetry hook records `duration_ms` on every tool call (v2.1.119). Carries forward the v2.1.117 unlocks: Opus 4.7 `/context` correctly sized to 1M instead of 200K (long research sessions no longer autocompact early) and agent frontmatter `mcpServers` loading for `--agent` sessions; the v2.1.111+ unlocks: Opus 4.7 `xhigh` effort tier, Auto mode without `--enable-auto-mode`, read-only bash glob patterns without permission prompts; and the v2.1.97 fixes: `claude plugin update` correctly detects new commits for git-based plugins (critical for ArcKit distribution), MCP HTTP/SSE memory leak fix (~50 MB/hr, affects ArcKit's 5 bundled servers), proper 429 exponential backoff (benefits 10 research agents), Stop/SubagentStop hooks no longer fail on long sessions (affects session-learner), and subagent working directory leak fix.

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
| Commands | 75 | Slash commands for architecture artifacts and OKF interoperability |
| Skills | 1 | Conversational Wardley Mapping with interactive guidance |
| Agents | 20 | Autonomous research agents and subagent definitions |
| Templates | 68 | Document templates with UK Government compliance |
| Scripts | 15 | Helper bash, Python, and Node scripts |
| Hooks | 17 | Automation hooks across 7 event types |
| Guides | 167 | Command and reference documentation |

## Hooks

Automation hooks run automatically to provide context and enforce standards. See the [Hooks Guide](docs/guides/hooks.md) for full details.

| Event | Hooks | Purpose |
|-------|-------|---------|
| SessionStart | arckit-session, version-check | Inject version/context, check for updates |
| Stop / StopFailure | session-learner | Record session activity for future context |
| UserPromptSubmit | arckit-context, secret-detection, + 6 command-specific | Project context, secret scanning, pre-processing |
| PreToolUse | validate-arc-filename, score-validator, file-protection, secret-file-scanner | Filename enforcement, security, validation |
| PostToolUse | update-manifest | Keep manifest.json in sync |
| PermissionRequest | allow-mcp-tools | Auto-allow bundled MCP servers |

## OKF Interoperability

- `/arckit:export-okf` exports ArcKit `ARC-*.md` artifacts as copied Markdown with OKF-compatible frontmatter.
- `/arckit:import-okf` scans OKF Markdown bundles, writes `.arckit/tmp/okf-import-report.json`, and materializes safe imports as `RSCH` review notes.
- Source ARC frontmatter stamping is opt-in via `ARCKIT_OKF_FRONTMATTER=1` or `.arckit/config.json` with `{ "okfFrontmatter": true }`.

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

- [Repository](https://github.com/tractorjuice/arckit-claude)
- [Documentation](https://tractorjuice.github.io/arc-kit)
- [Changelog](https://github.com/tractorjuice/arckit-claude/blob/main/CHANGELOG.md)

## License

MIT
