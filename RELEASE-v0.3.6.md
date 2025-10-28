# ArcKit v0.3.6 Release Notes

**Release Date:** 2025-10-28
**Release Type:** Minor Release (Major Feature + Multi-AI Support + UK Gov Procurement)
**Previous Version:** v0.3.5

---

## 🚀 Major Feature: Project Planning Command

### `/arckit.plan` - Comprehensive Project Planning

**NEW COMMAND**: Create detailed project plans with visual timelines, phases, gates, and Mermaid diagrams following GDS Agile Delivery methodology.

#### What it Does

Generates comprehensive project plans with:
- **GDS Agile Delivery Phases**: Discovery → Alpha → Beta → Live
- **Mermaid Gantt Chart**: Visual timeline with activities, dependencies, and milestones
- **Workflow & Gates Diagram**: Flowchart showing decision points and approval paths
- **Phase-by-Phase Tables**: Activities, timelines, ArcKit commands, and deliverables
- **Approval Criteria**: Discovery, Alpha, and Beta assessment gates
- **Timeline Estimates**: Project complexity-based duration (small/medium/large)

#### Intelligent Context Awareness

The plan command **reads existing artifacts** to tailor the plan:
- **Stakeholder Analysis** → Impacts Discovery timeline complexity
- **Requirements** → Impacts Alpha/Beta duration
- **Architecture Principles** → Identifies compliance needs (PCI-DSS, GDPR)
- **Business Case** → Informs budget and team sizing
- **Risk Register** → Highlights timeline risks and mitigation needs

#### Project Complexity Classification

**Small Projects (3-6 months)**:
- < 30 requirements
- 1-2 integrations
- Standard tech stack
- Basic compliance

**Medium Projects (6-12 months)**:
- 30-100 requirements
- 3-5 integrations
- Custom development
- PCI-DSS/GDPR compliance

**Large Projects (12-24 months)**:
- 100+ requirements
- 5+ integrations
- Complex custom development
- Multiple compliance regimes
- Data migration

#### Usage Examples

```bash
# Claude Code
/arckit.plan Create project plan for cloud migration with 8-month timeline

# OpenAI Codex CLI
/prompts:arckit.plan Create plan for payment gateway modernization

# Gemini CLI
arckit plan Create plan for NHS appointment system
```

#### Output Structure

Generated plan includes:
1. **Executive Summary** - Duration, budget, team size, success criteria
2. **Gantt Timeline** (Mermaid) - All phases with activities and gates
3. **Workflow Diagram** (Mermaid) - Gate approvals and feedback loops
4. **Discovery Phase** - Activities table + approval criteria
5. **Alpha Phase** - Activities table + HLD review + approval criteria
6. **Beta Phase** - Activities table + DLD review + UAT + go/no-go
7. **Live Phase** - Deployment + hypercare + benefits realization
8. **ArcKit Commands Integration** - When to run each command
9. **Timeline Estimates** - Justification for durations
10. **Risk & Assumptions** - Key constraints and dependencies

**File Location**: `projects/{project-name}/project-plan.md`

---

## 🎯 Triple AI System Support (Claude + Codex + Gemini)

### Gemini CLI Integration

**NEW**: Full support for Google's Gemini CLI (third AI system!)

ArcKit now works with **THREE AI systems**:
1. **Claude Code** (Anthropic) - `.claude/commands/` → `/arckit.*`
2. **OpenAI Codex CLI** - `.codex/prompts/` → `/prompts:arckit.*`
3. **Gemini CLI** (Google) - `.gemini/commands/arckit/` → `arckit *`

#### Converter Script

**New Tool**: `converter.py` - Automatic conversion from Claude commands to Gemini .toml format

```bash
# Convert all Claude commands to Gemini format
python converter.py

# Automatically creates .gemini/commands/arckit/*.toml files
```

**Features**:
- Converts `.claude/commands/*.md` → `.gemini/commands/arckit/*.toml`
- Handles YAML frontmatter → TOML format
- Replaces `$ARGUMENTS` → `{{args}}`
- Preserves all command logic and examples

#### Gemini CLI Commands

```bash
# All ArcKit commands available in Gemini
arckit plan Create project plan with timeline
arckit principles Create architecture principles
arckit stakeholders Analyze stakeholders
arckit requirements Create requirements
arckit diagram Generate C4 architecture diagrams
# ... all 25 commands
```

---

## 🏛️ UK Public Sector Procurement Commands

### Digital Marketplace Commands (Split & Enhanced)

**Previously**: Single `/arckit.digital-marketplace` command (now deprecated)

**Now**: Two focused commands for UK Government Digital Marketplace:

#### 1. `/arckit.dos` - Digital Outcomes and Specialists

For **service procurement** (consultancy, developers, specialists):
- Generates DOS-compliant requirements
- Specialist roles and day rates
- Outcome-based deliverables
- 2-6 month typical engagements
- £10K - £500K typical budgets

**Use Cases**:
- Cloud migration consultancy
- Security specialists
- Agile delivery teams
- Digital service development

#### 2. `/arckit.gcloud` - G-Cloud Framework

For **technology procurement** (SaaS, PaaS, IaaS, software):
- G-Cloud service catalog requirements
- Commercial terms and pricing
- Service characteristics
- Data location and security
- Integration requirements

**Use Cases**:
- SaaS applications
- Cloud infrastructure (AWS, Azure, GCP)
- Software licenses
- Managed services

**Available in all three AI systems** (Claude, Codex, Gemini).

---

## 🔧 Bug Fixes

### .gitignore Fix

**Issue**: `.codex/.gitignore` file was being excluded by global `.gitignore` rules, causing Codex CLI configuration to not be committed properly.

**Fix**: Explicitly included `.codex/.gitignore` in repository `.gitignore` to ensure it's tracked.

**Impact**: Codex CLI users can now properly version control their configuration.

---

## 📚 Documentation Updates

### Updated Documentation for /arckit.plan

**New Documentation**:
- `docs/guides/plan.md` (660 lines) - Comprehensive guide with examples
- `.claude/COMMANDS.md` - Added /arckit.plan as command #1, renumbered all others
- `README.md` - Added Phase 0: Project Planning
- `.codex/README.md` - Added Phase 0 with workflow instructions

**Multi-AI Documentation**:
- All three AI systems fully documented
- Command format comparison tables
- Setup instructions for each platform

### Updated Workflow Diagram

```
Phase 0: Project Planning
    ↓
Phase 1: Architecture Principles
    ↓
Phase 2: Stakeholder Analysis
    ↓
Phase 3: Risk Assessment
    ↓
Phase 4: Business Case
    ↓
...
```

---

## 📊 Command Count

**Total Commands**: 25 (was 21)

**New Commands** (v0.3.6):
- `/arckit.plan` - Project planning with Mermaid diagrams
- `/arckit.dos` - Digital Outcomes and Specialists
- `/arckit.gcloud` - G-Cloud Framework

**Deprecated** (v0.3.6):
- `/arckit.digital-marketplace` - Split into dos and gcloud (still works but shows deprecation notice)

---

## 🚀 Installation

### For All Users

```bash
# Clone repository
git clone https://github.com/tractorjuice/arc-kit.git
cd arc-kit
```

### Claude Code Users

```bash
# Commands available immediately
# Use /arckit.*
```

### OpenAI Codex CLI Users

```bash
# Set environment
export CODEX_HOME="$(pwd)/.codex"
codex --auto

# Use /prompts:arckit.*
```

### Gemini CLI Users

```bash
# Commands available immediately
# Use: arckit <command> <args>
```

---

## 📝 What's Included

### Added (v0.3.6)
- **`/arckit.plan`** - Project planning command with Mermaid diagrams
- **Gemini CLI support** - Third AI system integration
- **`converter.py`** - Claude → Gemini command converter
- **`/arckit.dos`** - Digital Outcomes and Specialists procurement
- **`/arckit.gcloud`** - G-Cloud Framework procurement
- **Comprehensive planning guide** (`docs/guides/plan.md`)
- **Triple-AI documentation** - All systems documented

### Fixed (v0.3.6)
- `.codex/.gitignore` now properly tracked in repository

### Deprecated (v0.3.6)
- `/arckit.digital-marketplace` - Use `/arckit.dos` or `/arckit.gcloud` instead

### Unchanged
- All existing CLI functionality
- `.arckit/` directory structure
- Bash scripts and templates

---

## 🎯 Multi-AI System Comparison

| Feature | Claude Code | Codex CLI | Gemini CLI |
|---------|-------------|-----------|------------|
| **Command Format** | `/arckit.*` | `/prompts:arckit.*` | `arckit *` |
| **Location** | `.claude/commands/` | `.codex/prompts/` | `.gemini/commands/arckit/` |
| **File Format** | Markdown + frontmatter | Markdown + frontmatter | TOML |
| **Total Commands** | 25 | 25 | 25 |
| **Setup** | Built-in | `CODEX_HOME` env | Built-in |
| **Best For** | Claude users | ChatGPT Plus users | Gemini users |

---

## 🗺️ Project Planning Workflow

### Start with the Plan

```bash
# 1. Create comprehensive project plan
/arckit.plan Create plan for digital transformation project

# The plan tells you when to run each command:
```

**Discovery Phase** (Weeks 1-8):
```bash
# Week 1-2
/arckit.stakeholders Analyze stakeholders

# Week 5-6
/arckit.requirements Create business requirements

# Week 7
/arckit.principles Create architecture principles

# Week 8
/arckit.sobc Create business case
/arckit.risk Create risk register
```

**Alpha Phase** (Weeks 9-20):
```bash
# Week 9-11
/arckit.requirements Create detailed requirements (FR, NFR, INT, DR)

# Week 12-15
/arckit.diagram Generate architecture diagrams
/arckit.data-model Create data model

# Week 11-13 (if vendor needed)
/arckit.dos Generate DOS requirements
/arckit.evaluate Score vendors

# Week 18
/arckit.hld-review Review high-level design
```

**Beta Phase** (Weeks 21-40):
```bash
# Week 25
/arckit.dld-review Review detailed design

# Week 32-33
/arckit.traceability Verify design → code → tests
/arckit.analyze Quality analysis

# If AI system
/arckit.ai-playbook AI compliance
/arckit.atrs Transparency standards
```

---

## 🔜 What's Next

**v0.3.7 (Q4 2025)**: Additional compliance commands
- NCSC Cloud Security Principles assessment
- ISO 27001 compliance checker
- NIST Cybersecurity Framework mapping

**v0.4.0 (Q1 2026)**: Web UI Phase 1
- Next.js + FastAPI foundation
- Project dashboard
- Requirements management interface
- Diagram viewers

---

## 📊 Version Summary

| Component | Change |
|-----------|--------|
| **Project Planning** | Added - `/arckit.plan` with Mermaid diagrams |
| **Gemini CLI** | Added - Third AI system support with converter |
| **UK Procurement** | Added - DOS and G-Cloud focused commands |
| **Documentation** | Updated - All three AI systems documented |
| **Command Count** | Increased - 21 → 25 commands |
| **Breaking Changes** | None (digital-marketplace deprecated but works) |
| **Migration Required** | No |

---

## 🔗 Resources

- **GitHub Repository**: https://github.com/tractorjuice/arc-kit
- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Planning Guide**: `docs/guides/plan.md`
- **Converter Script**: `converter.py`
- **Changelog**: `CHANGELOG.md`

---

## 🤝 Contributors

Special thanks to:
- **@umag** - Gemini CLI support and converter script
- Community members for testing and feedback

---

## 💡 Why Three AI Systems?

**Choice**: Users can pick their preferred AI based on subscription, features, and workflow

**Consistency**: Same ArcKit methodology across all systems

**Innovation**: Learn from each AI's unique strengths

**Future-Proof**: Not locked into a single AI provider

---

**Built with ❤️ for enterprise architects who want systematic, AI-assisted governance.**
