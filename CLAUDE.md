# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ArcKit is an **Enterprise Architecture Governance & Vendor Procurement Toolkit** that provides AI-assisted workflows for enterprise architects. It transforms architecture governance from scattered documents into a systematic, template-driven process using AI coding assistants (Claude Code, Codex CLI, Gemini CLI).

**Core Value Proposition**: Enable enterprise architects to establish governance principles, analyze stakeholders, assess risks, create business cases, define requirements, research technology options, manage vendor procurement, conduct design reviews, and maintain traceability - all through structured AI-assisted workflows.

## Build & Development Commands

```bash
# Install in development mode
pip install -e .
# Or using uv (recommended)
uv pip install -e .

# Test CLI
arckit --help
arckit check

# Test project initialization
arckit init test-project --ai claude --no-git
cd test-project && ls -la .claude/commands/

# Build distribution
python -m build

# Convert Claude commands to Gemini format
python scripts/converter.py

# Debug data path resolution
python -c "from arckit_cli import get_data_paths; print(get_data_paths())"
```

## Architecture

### Key Components

**CLI Entry Point** (`src/arckit_cli/__init__.py`):
- Main CLI using `typer` for command parsing
- `arckit init` command creates project structure and copies templates/commands
- `arckit check` validates tool installation
- Handles data path resolution for templates/scripts across different install methods (uv tools, pip, source)

**Data Files** (distributed with package):
- `.claude/commands/arckit.*.md` - 33+ slash commands for Claude Code (frontmatter + prompt)
- `.gemini/commands/arckit/*.toml` - Gemini CLI equivalents (generated via `scripts/converter.py`)
- `.arckit/templates/*.md` - 33+ document templates for all artifact types
- `scripts/bash/*.sh` - Helper scripts (create-project.sh, generate-document-id.sh, etc.)

**Project Structure Created by `arckit init`**:
```
project-name/
├── .arckit/
│   ├── memory/               # Global architecture principles
│   ├── templates/            # Document templates
│   └── scripts/bash/         # Automation scripts
├── .claude/commands/         # Slash commands (or .codex/ or .gemini/)
└── projects/                 # Individual architecture projects (001-*, 002-*, etc.)
    └── 001-project-name/
        ├── requirements.md
        ├── stakeholder-drivers.md
        ├── risk-register.md
        ├── sobc.md           # Strategic Outline Business Case
        ├── data-model.md
        ├── research-findings.md
        ├── wardley-maps/
        ├── sow.md            # Statement of Work (RFP)
        ├── vendors/
        └── traceability-matrix.md
```

### Slash Command System

ArcKit's primary interface is **30 slash commands** that generate architecture artifacts:

**Command Structure**: `.claude/commands/arckit.{command}.md` files contain:
1. **Frontmatter** (YAML): `description` field
2. **Prompt**: Multi-step instructions for Claude to generate artifacts
   - Check prerequisites (architecture principles exist, stakeholder analysis exists, etc.)
   - Create/find project using `create-project.sh` script
   - Read template from `.arckit/templates/{type}-template.md`
   - Generate artifact using template structure
   - Use **Write tool** to create file (critical for large documents to avoid 32K token limit)
   - Show summary only (not full document)

**Key Commands** (in workflow order):
1. `/arckit.plan` → `projects/XXX/project-plan.md` (timeline, phases, gates)
2. `/arckit.principles` → `.arckit/memory/architecture-principles.md` (global)
3. `/arckit.stakeholders` → `projects/XXX/stakeholder-drivers.md`
4. `/arckit.risk` → `projects/XXX/risk-register.md` (HM Treasury Orange Book)
5. `/arckit.sobc` → `projects/XXX/sobc.md` (Green Book 5-case model)
6. `/arckit.requirements` → `projects/XXX/requirements.md` (BR/FR/NFR/INT/DR)
7. `/arckit.data-model` → `projects/XXX/data-model.md` (ERD, GDPR compliance)
8. `/arckit.dpia` → `projects/XXX/dpia.md` (UK GDPR Article 35 impact assessment)
9. `/arckit.platform-design` → `projects/XXX/platform-design.md` (Platform Design Toolkit 8 canvases)
10. `/arckit.research` → `projects/XXX/research-findings.md` (build vs buy analysis)
11. `/arckit.wardley` → `projects/XXX/wardley-maps/{name}.md` (strategic positioning)
12. `/arckit.roadmap` → `projects/XXX/roadmap.md` (multi-year strategic roadmap)
13. `/arckit.adr` → `projects/XXX/decisions/ADR-{NUM}-{title}.md` (architecture decisions)
14. `/arckit.diagram` → `projects/XXX/diagrams/{type}-{name}.md` (Mermaid C4/deployment/sequence)
15. `/arckit.sow` → `projects/XXX/sow.md` (vendor RFP)
16. `/arckit.evaluate` → `projects/XXX/evaluation-criteria.md` + vendor scoring
17. `/arckit.hld-review` → `projects/XXX/vendors/{vendor}/reviews/hld-review.md`
18. `/arckit.dld-review` → `projects/XXX/vendors/{vendor}/reviews/dld-review.md`
19. `/arckit.backlog` → `projects/XXX/backlog.md` (requirements → GDS user stories)
20. `/arckit.servicenow` → `projects/XXX/servicenow-design.md` (CMDB, SLAs, incident mgmt)
21. `/arckit.traceability` → `projects/XXX/traceability-matrix.md`
22. `/arckit.principles-compliance` → `projects/XXX/principles-compliance.md` (RAG assessment)
23. `/arckit.analyze` → `projects/XXX/analysis-report.md` (governance quality check)
24. `/arckit.story` → `projects/XXX/project-story.md` (narrative with timeline)
25. `/arckit.data-mesh-contract` → `projects/XXX/data-contracts/{domain}.md` (ODCS data contracts)

**UK Government Specific**:
- `/arckit.tcop` - Technology Code of Practice (13 points)
- `/arckit.service-assessment` - GDS Service Standard (14 points)
- `/arckit.secure` - NCSC CAF, Cyber Essentials, UK GDPR
- `/arckit.ai-playbook` - Responsible AI for gov projects
- `/arckit.atrs` - Algorithmic Transparency Recording Standard
- `/arckit.gcloud-search` - G-Cloud service search on Digital Marketplace
- `/arckit.gcloud-clarify` - Supplier clarification questions
- `/arckit.dos` - Digital Outcomes and Specialists procurement

**MOD Specific**:
- `/arckit.mod-secure` - JSP 440, IAMM, security clearances
- `/arckit.jsp-936` - AI assurance for defence systems

### Template System

All document generation uses **templates** from `.arckit/templates/`:
- Each template defines structure, required sections, document control metadata
- Templates include placeholders: `[PROJECT_ID]`, `[PROJECT_NAME]`, `[DATE]`, etc.
- Commands auto-populate document control fields (using `generate-document-id.sh`)
- Revision history table for governance tracking
- Generation metadata footer (ArcKit version, AI model, timestamp)

**Template Categories**:
- **Governance**: principles, stakeholders, risk register
- **Business Case**: SOBC (5-case model), research findings
- **Requirements**: requirements, data model
- **Strategic Planning**: Wardley maps, architecture diagrams, project plan
- **Procurement**: SOW, DOS, G-Cloud, evaluation criteria, vendor scoring
- **Design Review**: HLD review, DLD review
- **Operations**: ServiceNow design, backlog
- **Compliance**: TCoP, Service Assessment, Secure by Design, AI Playbook, ATRS, JSP 936
- **Traceability**: traceability matrix, analysis report

### Helper Scripts

**Bash Scripts** (`scripts/bash/`):
- `create-project.sh --name "project-name" --json` - Creates numbered project directory (001-*, 002-*), returns JSON with path
- `generate-document-id.sh PROJECT_ID DOC_TYPE VERSION` - Generates doc ID (e.g., ARC-001-REQ-v1.0)
- `list-projects.sh` - Lists all projects with metadata
- `check-prerequisites.sh` - Validates environment (git, templates, etc.)
- `common.sh` - Shared utilities

**Python Scripts** (`scripts/`):
- `converter.py` - Converts Claude commands (.md) to Gemini format (.toml)

### Multi-AI Support

ArcKit supports 3 AI assistants with different command formats:

| AI Assistant | Command Format | Config Location |
|--------------|----------------|-----------------|
| Claude Code | `/arckit.requirements` | `.claude/commands/arckit.requirements.md` |
| Codex CLI | `/prompts:arckit.requirements` | `.codex/prompts/arckit/requirements.md` (CODEX_HOME) |
| Gemini CLI | `/arckit:requirements` | `.gemini/commands/arckit/requirements.toml` |

**Codex CLI Specifics**:
- Requires `CODEX_HOME` environment variable pointing to `.codex/`
- Uses `.envrc` (direnv) for automatic setup
- `.gitignore` excludes auth tokens but includes prompts

## Common Development Tasks

### Adding a New Slash Command

1. Create command file: `.claude/commands/arckit.newcommand.md`
   ```yaml
   ---
   description: Brief description (shown in command list)
   ---

   You are helping an enterprise architect...

   ## User Input
   ```text
   $ARGUMENTS
   ```

   ## Instructions
   1. Check prerequisites
   2. Create/find project
   3. Read template
   4. Generate artifact
   5. **Use Write tool** to create file
   6. Show summary only
   ```

2. Create template: `.arckit/templates/newcommand-template.md`
   - Include document control section
   - Define required sections
   - Add placeholders for auto-population

3. Convert for Gemini: `python scripts/converter.py`

4. Update README.md workflow documentation

5. Test command:
   ```bash
   arckit init test-project --ai claude
   cd test-project
   claude
   # In Claude: /arckit.newcommand Test this command
   ```

### Modifying Templates

Templates are the source of truth for document structure. When modifying:

1. **Edit template** in `.arckit/templates/{type}-template.md`
2. **Test generation**: Run corresponding command to verify output
3. **Document changes**: Update CHANGELOG.md with template modifications
4. **Compatibility**: Consider backward compatibility - existing projects may use old templates

**Template Best Practices**:
- Keep document control section consistent across templates
- Use clear placeholders: `[FIELD_NAME]` for manual updates, `{field}` for auto-population
- Include "Generation Metadata" footer for AI transparency
- Add traceability sections (link to stakeholders, requirements, risks, etc.)

### Testing Slash Commands

**Manual Testing**:
```bash
# Test in fresh project
arckit init test-cmd --ai claude --no-git
cd test-cmd
claude

# In Claude, test command sequence:
/arckit.principles Create test principles
/arckit.stakeholders Analyze stakeholders for test project
/arckit.requirements Create requirements for test system
# Verify: cat projects/001-*/requirements.md
```

**Verification Checklist**:
- [ ] File created in correct location
- [ ] Document control fields auto-populated
- [ ] All template sections present
- [ ] Traceability links work (references to stakeholders, principles, etc.)
- [ ] Summary output shows key metrics
- [ ] Token usage stays under 32K (use Write tool for large docs)

### Package Data Resolution

The CLI must find templates/scripts across different install methods:

**Search Order** (in `get_data_paths()`):
1. **uv tool install**: `~/.local/share/uv/tools/arckit-cli/share/arckit/`
2. **pip install**: `{site-packages}/share/arckit/` or `../../../share/arckit/`
3. **platformdirs**: `{user_data_dir}/arckit/`
4. **Source/dev mode**: `{repo_root}/.arckit/`, `{repo_root}/scripts/`

**When adding new data files**: Update `pyproject.toml` `[tool.hatch.build.targets.wheel.shared-data]` to include in package.

### Version Management

**Version is defined in 2 places** (keep synchronized):
1. `VERSION` file (source of truth) - e.g., `0.9.1`
2. `pyproject.toml` - `version = "0.9.1"`

**Release Process**:
1. Update VERSION file
2. Update pyproject.toml version
3. Document changes in CHANGELOG.md
4. Commit: `git commit -m "chore: release vX.Y.Z"`
5. Tag: `git tag vX.Y.Z`
6. Push: `git push && git push --tags`

### Debugging Installation Issues

**Common Issues**:

1. **Templates not found**: Check `get_data_paths()` resolution
   ```bash
   python -c "from arckit_cli import get_data_paths; print(get_data_paths())"
   ```

2. **Commands not available**: Verify files copied during init
   ```bash
   ls -la .claude/commands/arckit.*.md
   ```

3. **Scripts not executable**: Commands may reference bash scripts
   ```bash
   chmod +x .arckit/scripts/bash/*.sh
   ```

4. **Codex CODEX_HOME not set**:
   ```bash
   export CODEX_HOME="$PWD/.codex"
   # Or install direnv and run: direnv allow
   ```

### Updating Test Repositories

ArcKit maintains test repositories on GitHub (both public and private) for testing and demonstration purposes. These repos follow the naming pattern `arckit-test-project-v*`.

**Finding All Test Repositories** (including private):
```bash
# Requires GH_TOKEN environment variable with repo access
export GH_TOKEN="<github-token>"
gh repo list tractorjuice --limit 200 --json name,url,visibility | jq '.[] | select(.name | contains("arckit"))'
```

**Current Test Repositories**:
- **Public**: v1-m365, v2-hmrc-chatbot, v3-windows11, v6-patent-system, v7-nhs-appointment, v8-ons-data-platform, v9-cabinet-office-genai
- **Private**: v0-mod-chatbot, v4-ipa, v5-dstl

**Updating Test Repos with Latest Changes**:

```bash
# Clone all repos
mkdir -p /tmp/arckit-test-repos && cd /tmp/arckit-test-repos
for repo in v0-mod-chatbot v1-m365 v2-hmrc-chatbot v3-windows11 v4-ipa v5-dstl v6-patent-system v7-nhs-appointment v8-ons-data-platform v9-cabinet-office-genai; do
    GH_TOKEN="<token>" gh repo clone tractorjuice/arckit-test-project-$repo
done

# Update script (/tmp/update-repo.sh):
#!/bin/bash
REPO_DIR="$1"
SOURCE_DIR="/workspaces/arc-kit"
cd "$REPO_DIR"
rsync -av --delete "$SOURCE_DIR/.claude/commands/" ".claude/commands/"
rsync -av --delete "$SOURCE_DIR/.codex/prompts/" ".codex/prompts/"
rsync -av --delete "$SOURCE_DIR/.gemini/commands/" ".gemini/commands/"
rsync -av --delete "$SOURCE_DIR/.arckit/templates/" ".arckit/templates/"
mkdir -p .arckit/scripts/bash
rsync -av "$SOURCE_DIR/scripts/bash/" ".arckit/scripts/bash/"
chmod +x .arckit/scripts/bash/*.sh

# Run on all repos, commit, and push
for repo in /tmp/arckit-test-repos/arckit-test-project-*; do
    /tmp/update-repo.sh "$repo"
    cd "$repo" && git add -A && git commit -m "chore: sync with arc-kit" && git push
done
```

**When to Update Test Repos**: After adding/modifying commands, templates, or scripts; before releases.

## Requirements Context

**Requirement Types** (used across templates):
- **BR-xxx**: Business Requirements (ROI, timeline, stakeholder needs)
- **FR-xxx**: Functional Requirements (user stories, features, workflows)
- **NFR-xxx**: Non-Functional Requirements
  - **NFR-P-xxx**: Performance (response time, throughput, concurrency)
  - **NFR-SEC-xxx**: Security (authentication, encryption, compliance)
  - **NFR-S-xxx**: Scalability (growth projections, load handling)
  - **NFR-A-xxx**: Availability (uptime SLA, MTBF, MTTR)
  - **NFR-C-xxx**: Compliance (PCI-DSS, GDPR, HIPAA, SOX, etc.)
- **INT-xxx**: Integration Requirements (upstream/downstream systems, APIs)
- **DR-xxx**: Data Requirements (schemas, retention, privacy, GDPR)

**Traceability Chain**:
1. Stakeholder Drivers → Goals → Outcomes
2. Goals → Requirements (BR/FR/NFR/INT/DR)
3. Requirements → Data Model (DR-xxx → Entities)
4. Requirements → Architecture Components (C4 diagrams)
5. Components → CMDB CIs (ServiceNow design)
6. Requirements → User Stories (Backlog)
7. User Stories → Sprints
8. Requirements → Test Cases (via traceability matrix)

## UK Government Compliance Context

ArcKit has deep UK Government integration:

**GDS Service Standard** (14 points):
- Mandatory for all UK gov digital services
- Assessment at Alpha, Beta, Live phases
- Evidence requirements mapped to ArcKit artifacts

**Technology Code of Practice** (13 points):
- Point 5: Cloud First → deployment diagrams use AWS/Azure/GCP
- Point 8: Share, Reuse and Collaborate → GOV.UK services (Pay, Notify, Design System)
- Point 11: Define Your Purchasing Strategy → Digital Marketplace (G-Cloud, DOS)
- Point 13: Responsible AI → AI Playbook + ATRS for AI systems

**Digital Marketplace**:
- **G-Cloud**: Off-the-shelf cloud services (IaaS, PaaS, SaaS)
- **DOS**: Custom development (Digital Outcomes, Specialists, User Research)
- Commands use **WebSearch** to find live marketplace services

**Security Frameworks**:
- **NCSC CAF**: Cyber Assessment Framework (14 principles)
- **Cyber Essentials**: 5 controls (Firewalls, Secure Config, Access Control, Malware, Patching)
- **UK GDPR**: DPIA, data subject rights, ICO reporting
- **Data Classifications**: PUBLIC, OFFICIAL, OFFICIAL-SENSITIVE, SECRET

**MOD Specific**:
- **JSP 440**: Defence Project Management
- **JSP 936**: Dependable AI in Defence (ethical principles, risk levels, lifecycle)
- **IAMM**: Information Assurance Maturity Model
- **Security Clearances**: BPSS, SC, DV, eDV

## Wardley Mapping Integration

**Evolution Stages** (critical for build vs buy decisions):
- **Genesis (0.00-0.25)**: Novel, unproven → Build only if strategic differentiator
- **Custom (0.25-0.50)**: Bespoke, emerging → Critical build vs buy decision
- **Product (0.50-0.75)**: Commercial products → Buy from vendors
- **Commodity (0.75-1.00)**: Utility services → Use cloud/commodity

**Wardley Map Types**:
- Current state, Future state, Gap analysis, Vendor comparison, Procurement strategy

**Format**: OnlineWardleyMaps syntax (visualize at https://create.wardleymaps.ai)

## Important Notes

- **Token Limit Handling**: Commands MUST use Write tool for large documents (requirements, SOBC, research findings, etc.) to avoid exceeding 32K output token limit. Only show summary to user.
- **Document Control**: All artifacts MUST use the standard table + revision history defined in `docs/templates/document-control.md` (populate Document ID via `generate-document-id.sh`, fill review cycle/next review date, owner, reviewers, approvers before writing content).
- **Traceability**: Every artifact links back to stakeholders, principles, requirements for full governance chain.
- **Multi-phase Workflow**: Commands designed to run in sequence (plan → principles → stakeholders → risk → SOBC → requirements → data-model → dpia → research → wardley → roadmap → adr → procurement → design review → backlog → operations → traceability → analyze → story).
- **Template-Driven**: Never generate freeform documents - always use templates from `.arckit/templates/`.
- **Git Integration**: Projects should be version-controlled (git init by default, --no-git to skip).
- **Slash Command Prefix**: Claude uses `/arckit.command`, Codex uses `/prompts:arckit.command`, Gemini uses `/arckit:command`.

## Critical Patterns

**When Adding a New Command**:
1. Create `.claude/commands/arckit.{name}.md` with YAML frontmatter (`description:`)
2. Create `.arckit/templates/{name}-template.md` with document control section
3. Run `python scripts/converter.py` to generate Gemini TOML
4. Test: `arckit init test --ai claude --no-git && cd test && claude` then run the command
5. Update README.md Available Commands table

**Command Prompt Structure** (every slash command follows this pattern):
1. Check prerequisites (architecture-principles.md exists, etc.)
2. Create/find project via `create-project.sh --name "X" --json`
3. Read template from `.arckit/templates/{type}-template.md`
4. Generate document using template structure
5. **Use Write tool** to create file (avoids 32K token limit)
6. Show only a summary to user
