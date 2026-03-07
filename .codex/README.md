# Using ArcKit with OpenAI Codex CLI

<p align="center">
  <img src="../docs/assets/ArcKit_Logo_Horizontal_Dark.svg" alt="ArcKit" height="32">
</p>

This directory contains ArcKit agent configs and MCP configuration for [OpenAI Codex CLI](https://chatgpt.com/features/codex).

> **Note**: ArcKit commands are now delivered as skills in `.agents/skills/` (auto-discovered by Codex). The deprecated `.codex/prompts/` format is no longer used.

## Prerequisites

1. **ChatGPT Plan**: Codex CLI is included with ChatGPT Plus, Pro, Business, Edu, or Enterprise plans
2. **Codex CLI installed**: Follow [installation instructions](https://developers.openai.com/codex/cli/)
3. **Git repository**: ArcKit works best in a git repository

## Setup

### Option 1: CLI (Recommended)

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai codex
cd my-project
codex
```

No environment variables needed -- Codex auto-discovers skills from `.agents/skills/`.

### Option 2: Standalone Extension

See the [arckit-codex repo](https://github.com/tractorjuice/arckit-codex) for manual installation.

## Document Control Standard

Every command that generates an artifact must insert the canonical **Document Control** table and **Revision History**. See [`CLAUDE.md`](../CLAUDE.md#document-control-standard) for the full specification.

## Command Invocation

ArcKit commands are invoked as skills using the `$arckit-` prefix:

### Foundation & Governance

```bash
$arckit-plan Create project plan with timeline, phases, gates, and Mermaid diagrams
$arckit-principles Create architecture principles for financial services
$arckit-stakeholders Analyze stakeholders for cloud migration project
$arckit-risk Create risk register for payment gateway using Orange Book
$arckit-sobc Create Strategic Outline Business Case for payment gateway
```

### Requirements & Data

```bash
$arckit-requirements Create requirements for payment gateway modernization
$arckit-platform-design Design NHS appointment booking platform using Platform Design Toolkit
$arckit-data-model Create data model with ERD and GDPR compliance
$arckit-data-mesh-contract Create federated data product contract (ODCS v3.0.2)
$arckit-dpia Generate Data Protection Impact Assessment with ICO 9-criteria screening
```

### Research & Procurement

```bash
$arckit-research Research market options with build vs buy analysis
$arckit-wardley Create Wardley map for digital services strategy
$arckit-roadmap Create multi-year strategic architecture roadmap
$arckit-adr Document architectural decisions with MADR format
$arckit-gcloud-search Search G-Cloud 14 for compliant services
$arckit-gcloud-clarify Generate clarification questions for shortlisted suppliers
$arckit-dos Produce Digital Outcomes and Specialists procurement pack
$arckit-sow Generate RFP statement of work
$arckit-evaluate Score vendors against requirements
```

### Delivery & Quality

```bash
$arckit-backlog Generate sprint-ready GDS backlog from requirements
$arckit-hld-review Review high-level design for scalability and compliance
$arckit-dld-review Review detailed design for security and implementation readiness
$arckit-analyze Run cross-artifact quality analysis
$arckit-diagram Generate C4 architecture diagrams
$arckit-traceability Generate traceability matrix
$arckit-servicenow Export architecture to ServiceNow CMDB
```

### Compliance & Governance Reporting

```bash
$arckit-principles-compliance Assess compliance with architecture principles using RAG evidence
$arckit-service-assessment Prepare for GDS Service Standard assessment
$arckit-secure Conduct Secure by Design review
$arckit-mod-secure Run MOD Secure by Design assessment
$arckit-jsp-936 Generate JSP 936 AI assurance documentation
$arckit-tcop Assess Technology Code of Practice compliance
$arckit-atrs Produce Algorithmic Transparency Record
$arckit-ai-playbook Check UK Government AI Playbook alignment
$arckit-story Create programme story summarising governance outcomes
```

## Workflow

### 0. Project Plan (Start Here!)

```bash
$arckit-plan Create project plan for cloud migration with 6-month timeline
```

### 1. Architecture Principles (Foundation)

```bash
$arckit-principles Create cloud-first principles for our organization
```

### 2. Stakeholder Analysis

```bash
$arckit-stakeholders Analyze stakeholders for cloud migration
```

### 3. Risk Assessment

```bash
$arckit-risk Create risk register for cloud migration project
```

### 4. Business Case

```bash
$arckit-sobc Create SOBC for cloud migration with 2M investment
```

### 5. Requirements

```bash
$arckit-requirements Create requirements for the cloud migration project
```

### 6. Data Model

```bash
$arckit-data-model Create data model for payment gateway
```

### 7. Vendor RFP

```bash
$arckit-sow Generate statement of work for cloud migration RFP
$arckit-gcloud-search Search G-Cloud 14 for cloud hosting services
$arckit-evaluate Score vendors against requirements
```

### 8. Product Backlog

```bash
$arckit-backlog Generate sprint-ready backlog with velocity 25 and 8 sprints
```

## Approval Modes

```bash
codex --auto           # Auto-executes scripts and file creation (recommended)
codex --read-only      # Review plans before making changes
codex --auto --network # Allows network access without approval
```

## Differences from Claude Code

| Feature | Claude Code | Codex CLI |
|---------|-------------|-----------|
| **Command format** | `/arckit.principles` | `$arckit-principles` |
| **Command location** | Plugin (`arckit-plugin/commands/`) | `.agents/skills/arckit-*/` |
| **Discovery** | Plugin auto-discovery | Skill auto-discovery |
| **Approval modes** | Automatic | `--auto`, `--read-only`, `--network` |
| **Bash scripts** | Automatic | With approval (or `--auto`) |

## File Structure

```
your-project/
├── .agents/skills/           # Skills (auto-discovered by Codex)
│   ├── arckit-requirements/
│   │   ├── SKILL.md          # Command prompt
│   │   └── agents/
│   │       └── openai.yaml   # allow_implicit_invocation: false
│   ├── arckit-principles/
│   ├── ...                   # 57 command skills
│   ├── architecture-workflow/ # Reference skill
│   ├── mermaid-syntax/        # Reference skill
│   ├── plantuml-syntax/       # Reference skill
│   └── wardley-mapping/       # Reference skill
├── .codex/
│   ├── agents/               # Agent configs (.toml + .md)
│   └── config.toml           # MCP servers + agent roles
├── .arckit/
│   ├── scripts/bash/
│   └── templates/
└── projects/
    ├── 000-global/
    └── 001-project-name/
```

## Troubleshooting

### Commands Not Found

If `$arckit-principles` doesn't work:

1. **Check skills exist**:
   ```bash
   ls .agents/skills/arckit-principles/SKILL.md
   ```

2. **Ensure you're in a git repo** (Codex walks up to `.git` to find skills):
   ```bash
   git rev-parse --is-inside-work-tree
   ```

3. **Restart Codex**:
   ```bash
   exit
   codex
   ```

## Next Steps

1. **Start Codex**: `codex`
2. **Create principles**: `$arckit-principles Create cloud-first principles`
3. **Analyze stakeholders**: `$arckit-stakeholders <your project description>`
4. **Define requirements**: `$arckit-requirements <your project description>`

---

**Happy architecting with ArcKit + Codex CLI!**
