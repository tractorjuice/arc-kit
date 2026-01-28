# Using ArcKit with Gemini CLI

<p align="center">
  <img src="../docs/assets/ArcKit_Logo_Horizontal_Dark.svg" alt="ArcKit" height="32">
</p>

This directory contains ArcKit commands adapted for [Google Gemini CLI](https://cloud.google.com/gemini/docs/cli).

## Prerequisites

1. **Node.js and npm**: Required to install Gemini CLI
2. **Git repository**: ArcKit works best in a git repository

## Setup

### 1. Install Gemini CLI

```bash
# Install globally via npm (recommended)
npm install -g @google/gemini-cli@latest

# Or run without installing using npx
npx @google/gemini-cli
```

### 2. Project Setup

ArcKit commands are pre-installed in the `.gemini/commands/arckit:` directory. The Gemini CLI will automatically discover them when you're in the project directory.

```bash
cd /path/to/your/project
gemini
```

## Command Invocation

Gemini CLI uses colon-separated namespaces for commands in subdirectories. ArcKit commands are available under the `arckit` namespace:

```bash
# Format: /arckit:<command-name> <arguments>
/arckit:plan Create project plan for cloud migration with 6-month timeline
/arckit:principles Create cloud-first architecture principles
/arckit:stakeholders Analyze stakeholders for payment gateway project
```

## Document Control Standard

All commands that produce Markdown artifacts must render the canonical **Document Control** table and **Revision History**. See [`CLAUDE.md`](../CLAUDE.md#document-control-standard) for the full specification.

Key requirements:
- Generate Document IDs with `./scripts/bash/generate-document-id.sh <PROJECT_ID> <DOC_CODE> <VERSION>`
- Populate every standard field (Classification, Status, Review Cycle, Next Review Date, Owner, Reviewed/Approved By, Distribution) before writing body content
- Use existing templates in `.arckit/templates/` as reference examples
- Append doc-specific metadata (e.g., ADR Number, Financial Years Covered) after the standard rows to keep the header layout identical across deliverables.
- Always read `.arckit/VERSION` so metadata reflects the current ArcKit release.

## ArcKit Commands (35 Available)

### Phase 0: Project Planning

```bash
/arckit:plan Create project plan with timeline, phases, gates, and Mermaid diagrams
```

Creates: `projects/001-project-name/project-plan.md`

**Generates comprehensive project plan with:**
- GDS Agile Delivery phases (Discovery → Alpha → Beta → Live)
- Mermaid Gantt chart showing timeline, dependencies, and milestones
- Workflow diagram showing gates and decision points
- Phase-by-phase activity tables with ArcKit command integration
- Approval criteria for Discovery, Alpha, and Beta assessments

### Phase 1: Discovery

```bash
# Establish architecture principles
/arckit:principles Create cloud-first principles for our organisation

# Analyze stakeholders
/arckit:stakeholders Analyze stakeholders for cloud migration where CFO wants cost savings

# Risk assessment
/arckit:risk Create risk register for cloud migration project

# Business case
/arckit:sobc Create Strategic Outline Business Case for cloud migration with £2M investment
```

**Outputs:**
- `projects/000-global/ARC-000-PRIN-v1.0.md`
- `projects/001-project-name/stakeholder-drivers.md`
- `projects/001-project-name/risk-register.md`
- `projects/001-project-name/sobc.md`

### Phase 2: Alpha

```bash
# Define requirements
/arckit:requirements Create requirements for the cloud migration project

# Platform strategy (for ecosystem platforms)
/arckit:platform-design Design NHS appointment booking platform using Platform Design Toolkit (8 PDT canvases)

# Data modelling
/arckit:data-model Create data model for payment gateway with ERD and GDPR compliance

# Data mesh contracts
/arckit:data-mesh-contract Create federated data product contract for analytics platform (ODCS v3.0.2)

# Data protection
/arckit:dpia Generate Data Protection Impact Assessment for GDPR Article 35 compliance

# Strategic planning
/arckit:wardley Create Wardley map for digital services showing build vs buy strategy
/arckit:roadmap Create multi-year strategic architecture roadmap with capability evolution
/arckit:adr Document architectural decisions with MADR format and UK Government compliance

# Technology research
/arckit:research Research cloud hosting options with build vs buy analysis
```

**Outputs:**
- `projects/001-project-name/requirements.md`
- `projects/001-project-name/data-model.md`
- `projects/001-project-name/dpia.md`
- `projects/001-project-name/wardley-map.md`
- `projects/001-project-name/research/technology-name/`

### Phase 3: Procurement

```bash
# Digital Marketplace
/arckit:gcloud-search Search G-Cloud 14 framework for cloud services
/arckit:gcloud-clarify Generate clarification questions for G-Cloud supplier
/arckit:dos Generate Digital Outcomes and Specialists procurement documents

# RFP Management
/arckit:sow Generate statement of work for cloud migration RFP
/arckit:evaluate Score vendors against requirements
```

**Outputs:**
- `projects/001-project-name/procurement/digital-marketplace-search.md`
- `projects/001-project-name/procurement/gcloud-search.md`
- `projects/001-project-name/sow.md`
- `projects/001-project-name/vendor-evaluation.md`

### Phase 4: Beta & Live

```bash
# Design reviews
/arckit:hld-review Review high-level design for scalability
/arckit:dld-review Review detailed design for security

# Compliance & security
/arckit:principles-compliance Assess compliance with approved architecture principles using RAG evidence
/arckit:service-assessment GDS Service Standard assessment preparation
/arckit:secure UK Government Secure by Design review
/arckit:mod-secure MOD Secure by Design review
/arckit:jsp-936 Generate JSP 936 AI assurance documentation
/arckit:tcop Technology Code of Practice assessment
/arckit:atrs AI Transparency Risk Standards assessment
/arckit:ai-playbook AI Playbook compliance check

# Analysis & visualisation
/arckit:analyze Comprehensive gap analysis across all project artifacts
/arckit:diagram Generate architecture diagrams with Mermaid
/arckit:traceability Generate requirements traceability matrix
/arckit:servicenow Export architecture to ServiceNow CMDB

# Delivery management
/arckit:backlog Generate sprint-ready backlog with velocity 20 and 8 sprints
/arckit:story Create executive story for steering committee update
```

**Outputs:**
- `projects/001-project-name/hld-review-YYYYMMDD.md`
- `projects/001-project-name/dld-review-YYYYMMDD.md`
- `projects/001-project-name/compliance/secure-by-design.md`
- `projects/001-project-name/compliance/service-assessment.md`
- `projects/001-project-name/compliance/jsp-936.md`
- `projects/001-project-name/analysis/gap-analysis.md`
- `projects/001-project-name/diagrams/`
- `projects/001-project-name/backlog.md` (+ `.csv`, `.json`)
- `projects/001-project-name/story.md` (+ `story-summary.md`)

## Workflow Example

```bash
# Start Gemini CLI in your project
cd /path/to/your/project
gemini

# 0. Create project plan
/arckit:plan Create project plan for cloud migration with 6-month timeline, £2M budget

# 1. Establish governance
/arckit:principles Create cloud-first architecture principles

# 2. Discovery phase
/arckit:stakeholders Analyze stakeholders for cloud migration: CFO wants cost savings, CTO wants innovation
/arckit:risk Create risk register for cloud migration
/arckit:sobc Create Strategic Outline Business Case with £2M investment

# 3. Alpha phase
/arckit:requirements Create requirements for cloud migration
/arckit:data-model Create data model for customer data with GDPR compliance
/arckit:dpia Generate DPIA covering GDPR Article 35 requirements
/arckit:wardley Create Wardley map showing build vs buy for cloud infrastructure

# 4. Research & procurement
/arckit:research Research AWS, Azure, and GCP for cloud hosting
/arckit:gcloud-search Search G-Cloud 14 for cloud hosting services
/arckit:dos Generate Digital Outcomes and Specialists procurement
/arckit:sow Generate RFP statement of work
/arckit:evaluate Score supplier proposals against evaluation criteria

# 5. Beta phase
/arckit:hld-review Review high-level design for microservices architecture
/arckit:secure Conduct Secure by Design review

# 6. Delivery & reporting
/arckit:backlog Generate sprint backlog with velocity 20 and 8 sprints
/arckit:story Create executive story for steering committee update

# 7. Analysis
/arckit:analyze Comprehensive gap analysis across all artifacts
/arckit:diagram Generate C4 architecture diagrams
/arckit:traceability Generate requirements traceability matrix
```

## File Structure

```
your-project/
├── .gemini/
│   ├── README.md (this file)
│   └── commands/
│       └── arckit/
│           ├── adr.toml
│           ├── ai-playbook.toml
│           ├── analyze.toml
│           ├── atrs.toml
│           ├── backlog.toml
│           ├── data-mesh-contract.toml
│           ├── data-model.toml
│           ├── diagram.toml
│           ├── dld-review.toml
│           ├── dos.toml
│           ├── dpia.toml
│           ├── evaluate.toml
│           ├── gcloud-clarify.toml
│           ├── gcloud-search.toml
│           ├── hld-review.toml
│           ├── jsp-936.toml
│           ├── mod-secure.toml
│           ├── plan.toml
│           ├── principles.toml
│           ├── requirements.toml
│           ├── research.toml
│           ├── roadmap.toml
│           ├── risk.toml
│           ├── secure.toml
│           ├── service-assessment.toml
│           ├── servicenow.toml
│           ├── sobc.toml
│           ├── sow.toml
│           ├── stakeholders.toml
│           ├── story.toml
│           ├── tcop.toml
│           ├── traceability.toml
│           └── wardley.toml
├── .arckit/
│   ├── scripts/
│   │   └── bash/
│   │       └── create-project.sh
│   └── templates/
│       ├── architecture-principles-template.md
│       ├── stakeholder-drivers-template.md
│       ├── requirements-template.md
│       ├── sow-template.md
│       └── (other templates)
└── projects/
    ├── 000-global/
    │   └── ARC-000-PRIN-v1.0.md
    └── 001-project-name/
        ├── project-plan.md
        ├── stakeholder-drivers.md
        ├── risk-register.md
        ├── sobc.md
        ├── requirements.md
        ├── data-model.md
        ├── sow.md
        └── (other artifacts)
```

## Comparison: AI CLI Tools

| Feature | Claude Code | Codex CLI | Gemini CLI |
|---------|-------------|-----------|------------|
| **Command format** | `/arckit.plan` | `/prompts:arckit.plan` | `/arckit:plan` |
| **Command location** | `.claude/commands/` | `.codex/prompts/` | `.gemini/commands/arckit/` |
| **Installation** | Built-in | Python CLI | npm package |
| **Authentication** | Built-in | ChatGPT account | Google account |
| **Cost** | Claude subscription | ChatGPT Plus/Pro ($20/mo) | Free with Gemini |
| **Bash scripts** | ✅ Automatic | ✅ With `--auto` | ✅ Supported |
| **File access** | ✅ Full workspace | ✅ Sandboxed | ✅ Full workspace |
| **Best for** | Professional use | Enterprise users | Free access, Google ecosystem |

## Key Differences from Other CLIs

### From Claude Code

- **Command invocation**: `/arckit:plan` instead of `/arckit.plan` (colon separator for subdirectories)
- **Installation**: npm package vs built-in IDE integration
- **Authentication**: Google account vs Claude subscription
- **Namespace structure**: Subdirectories use colon notation (`.gemini/commands/arckit/` → `/arckit:*`)

### From Codex CLI

- **Installation method**: npm vs Python
- **Command syntax**: `/arckit:plan` instead of `/prompts:arckit.plan`
- **Namespace format**: Colon (`:`) for subdirectories vs `prompts:` prefix
- **Cost**: Free with Gemini vs ChatGPT Plus/Pro subscription

## Troubleshooting

### Commands Not Found

If `/arckit:plan` doesn't work:

1. **Check you're in the project directory**:
   ```bash
   pwd
   # Should show your project root with .gemini/ directory
   ```

2. **Verify files exist**:
   ```bash
   ls -la .gemini/commands/arckit:
   # Should show .toml files
   ```

3. **Restart Gemini CLI**:
   ```bash
   exit
   gemini
   ```

4. **Check Gemini CLI version**:
   ```bash
   gemini --version
   # Ensure you have the latest version
   ```

### Permission Errors

If Gemini CLI asks for file permissions:

```bash
# Gemini CLI may ask for permission to read/write files
# This is normal for ArcKit operations
# Approve file read/write permissions when prompted
```

## Advanced Usage

### Using Different Gemini Models

```bash
# Use Gemini 1.5 Pro (default)
gemini

# Use Gemini 1.5 Flash (faster)
gemini --model gemini-1.5-flash

# Use Gemini 2.0 (latest)
gemini --model gemini-2.0-pro
```

### Batch Processing

```bash
# Process multiple commands in sequence
gemini << EOF
/arckit:principles Create cloud-first principles
/arckit:stakeholders Analyze stakeholders for payment gateway
/arckit:requirements Create requirements based on stakeholder analysis
EOF
```

## Version

**Current Release: v1.0.0 (40 commands)**

ArcKit 1.0.0 - Production Release. All 40 commands available in Gemini CLI.

**ArcKit 1.0.0 Highlights:**
- 40 slash commands for complete architecture governance
- UK Government compliance (TCoP, Service Standard, Secure by Design, AI Playbook)
- HM Treasury frameworks (Green Book SOBC, Orange Book Risk Management)
- Multi-AI support (Claude Code, OpenAI Codex CLI, Gemini CLI)

**What was New in v0.3.6:**
- 🗓️ Added `/arckit:plan` - Project planning with GDS Agile Delivery phases, Mermaid Gantt charts
- 🤖 Added Gemini CLI support (third AI system!)
- 🏛️ Added `/arckit:dos` - Digital Outcomes and Specialists procurement
- 🏛️ Added `/arckit:gcloud-search` and `/arckit:gcloud-clarify` - G-Cloud Framework procurement
- 📚 Triple-AI documentation (Claude Code + Codex CLI + Gemini CLI)

**What was New in v0.3.0:**
- 🎯 Added `/arckit:sobc` - HM Treasury Green Book Strategic Outline Business Case
- 🛡️ Added `/arckit:risk` - HM Treasury Orange Book Risk Management
- 📊 Added `/arckit:data-model` - Data modelling with ERD, GDPR compliance, data governance
- 🔄 Updated workflow: Stakeholders → Risk → SOBC → Requirements → Data Model → Vendor selection
- ✅ Complete UK Government compliance (Green Book + Orange Book)
- 🔗 End-to-end traceability: Stakeholder → Driver → Goal → Risk → Benefit → Requirement → Entity

## Support

- **Documentation**: See main [ArcKit README](../README.md)
- **Issues**: Report Gemini-specific issues with `[Gemini]` prefix on [GitHub](https://github.com/tractorjuice/arc-kit/issues)
- **Workflow Guide**: See `.arckit/templates/` for template examples
- **Gemini CLI Docs**: [Official documentation](https://cloud.google.com/gemini/docs/cli)
- **Custom Commands Guide**: [Custom slash commands tutorial](https://cloud.google.com/blog/topics/developers-practitioners/gemini-cli-custom-slash-commands)

## Development Note

The `.gemini/commands/arckit:*.toml` files are automatically generated from Claude Code commands using `scripts/converter.py`. End users don't need to run the converter - all formats are pre-installed with ArcKit.

**For developers**: If you modify Claude commands, run `python scripts/converter.py` to regenerate Gemini TOML files.

## Next Steps

1. **Install Gemini CLI**: `npm install -g @google/gemini-cli@latest`
2. **Start Gemini**: `gemini`
3. **Create plan**: `/arckit:plan Create project plan for cloud migration`
4. **Create principles**: `/arckit:principles Create cloud-first principles`
5. **Analyze stakeholders**: `/arckit:stakeholders <your project description>`
6. **Define requirements**: `/arckit:requirements <your project description>`

---

**Happy architecting with ArcKit + Gemini CLI!** 🏗️✨
