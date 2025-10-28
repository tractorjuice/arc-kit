# ArcKit v0.4.0 Release Notes

**Release Date:** 2025-10-28
**Release Type:** Minor Release (Major Feature + Comprehensive Documentation)
**Previous Version:** v0.3.6

---

## 🎯 Theme: "Plan First, Execute Right"

This release introduces **comprehensive project planning** capabilities and **extensively expanded documentation** to help enterprise architects plan and execute complex projects with confidence.

---

## 🚀 Major New Feature: Project Planning Command

### `/arckit.plan` - Start Every Project with a Plan

**THE BIG ONE**: Create comprehensive, gate-driven project plans with visual timelines following UK Government GDS Agile Delivery methodology.

#### Why This Matters

Before v0.4.0, architects jumped straight into stakeholders and requirements. Now you start with a **complete project plan** that:
- Shows the entire journey from Discovery to Live
- Identifies when to run each ArcKit command
- Provides governance gates with approval criteria
- Adapts to your project's complexity
- Visualizes dependencies and critical paths

#### What It Generates

**1. Executive Summary**
- Project objectives and success criteria
- Duration, budget, and team sizing
- Key milestones and delivery model

**2. Mermaid Gantt Chart**
- Visual timeline across all four GDS phases
- Activities with dependencies and durations
- Gate milestones (Discovery, Alpha, Beta assessments)
- Start dates and critical path

**3. Workflow & Gates Diagram**
- Flowchart showing decision points
- Approval paths (✅ Approved / ❌ Rejected)
- Feedback loops (Refine HLD, Fix Issues, etc.)
- Complete project lifecycle visualization

**4. Phase-by-Phase Activity Tables**
- Discovery: Stakeholders, BRs, principles, business case (Weeks 1-8)
- Alpha: Detailed requirements, HLD, vendor procurement, threat model (Weeks 9-20)
- Beta: DLD, implementation sprints, testing, UAT (Weeks 21-40)
- Live: Deployment, hypercare, benefits realization

**5. ArcKit Command Integration**
- Maps every command to specific weeks
- Shows when to run `/arckit.stakeholders`, `/arckit.requirements`, etc.
- Integrates design reviews at HLD and DLD gates

**6. Approval Criteria**
- Checklists for Discovery Assessment gate
- Checklists for HLD Review gate
- Checklists for Alpha Assessment gate
- Checklists for DLD Review gate
- Checklists for Beta Assessment (Go/No-Go)

#### Intelligent Context Awareness

The plan command **reads existing project artifacts** to tailor the timeline:

```bash
# Reads if they exist:
projects/{project}/stakeholder-analysis.md  → Impacts Discovery complexity
projects/{project}/requirements.md          → Impacts Alpha/Beta duration
.arckit/memory/architecture-principles.md   → Identifies compliance needs
projects/{project}/business-case.md         → Informs budget constraints
projects/{project}/risk-register.md         → Highlights timeline risks
```

**Result**: Plans are customized to YOUR project, not generic templates.

#### Project Complexity Classification

**Small Projects (3-6 months)**:
- < 30 total requirements
- 1-2 external integrations
- Standard technology stack
- Basic security compliance
- Example: Internal dashboard, API integration

**Medium Projects (6-12 months)**:
- 30-100 total requirements
- 3-5 external integrations
- Some custom development
- PCI-DSS/GDPR compliance
- Vendor procurement needed
- Example: Payment gateway, citizen portal

**Large Projects (12-24+ months)**:
- 100+ total requirements
- 5+ integrations
- Significant custom development
- Multiple compliance regimes
- Data migration required
- Example: Digital transformation, NHS appointment system

#### Usage Examples

**Claude Code:**
```bash
/arckit.plan Create project plan for NHS appointment booking system with 12-month timeline

/arckit.plan Create plan for payment gateway modernization including PCI-DSS compliance
```

**OpenAI Codex CLI:**
```bash
/prompts:arckit.plan Create plan for cloud migration with vendor procurement

/prompts:arckit.plan Create plan for HMRC chatbot with 8-month delivery
```

**Gemini CLI:**
```bash
arckit plan Create project plan for patent system modernization

arckit plan Create plan for MOD secure messaging platform
```

#### Output Location

Plans are saved to:
- If project exists: `projects/{project-name}/project-plan.md`
- If no project: `project-plan.md` (root directory)

---

## 📚 Comprehensive Documentation Expansion

### New Planning Guide (660 lines)

**`docs/guides/plan.md`** - Complete guide to project planning with:
- What is a project plan and why it matters
- When to create the plan (before vs after other artifacts)
- How the plan adapts to project complexity
- Complete Mermaid examples (Gantt + workflow diagrams)
- Gate approval criteria explanations
- Integration with other ArcKit commands
- UK Government GDS framework alignment
- Tips for realistic timeline estimation

### Expanded Design Review Guide (+167 lines)

**`docs/guides/design-review.md`** (669 → 836 lines):
- **New**: "Why Design Reviews Matter" section
  - Reduces rework by 30-50%
  - Identifies architectural flaws early
  - Enforces governance and standards
  - Facilitates knowledge sharing
- **New**: "Integration with Other Requirements" section
  - Links to principles, requirements, risk register
  - Traceability to business case
  - Compliance validation (GDPR, PCI-DSS)
- **New**: "Common Gaps and How to Fix Them" (8 gaps documented)
  - Missing non-functional requirements validation
  - No threat model reference
  - Incomplete integration mapping
  - Missing rollback strategy
  - Plus 4 more common gaps with fixes
- Enhanced HLD/DLD checklists
- Proper footer with date and version

### Expanded Procurement Guide (+191 lines)

**`docs/guides/procurement.md`** (504 → 695 lines):
- **New**: "Why Vendor Procurement Matters" section
  - Ensures competitive pricing
  - Validates vendor capability
  - Reduces procurement risk
  - Ensures compliance with UK regulations
- **New**: "Integration with Other Requirements" section
  - Links to requirements (FR, NFR, INT, DR)
  - Validates against architecture principles
  - Aligns with business case budget
  - Incorporates risk register findings
- **New**: "Common Gaps and How to Fix Them" (8 gaps documented)
  - Incomplete NFR scoring
  - Missing integration requirements
  - Unclear acceptance criteria
  - Insufficient vendor due diligence
  - Plus 4 more gaps with solutions
- Enhanced SOW, evaluation, and selection checklists

### Updated Command Documentation

**`.claude/COMMANDS.md`**:
- Added `/arckit.plan` as command #1 (top priority)
- Renumbered all subsequent commands
- Updated Quick Reference table
- Enhanced workflow diagram
- Added plan command detailed documentation with examples

**Main `README.md`**:
- Added Phase 0: Project Planning before all other phases
- Updated workflow to show plan-first approach
- Added Mermaid diagram feature highlights

**`.codex/README.md`**:
- Added Phase 0 in command list
- Added comprehensive workflow instructions for plan command
- Updated file structure to show `arckit.plan.md`
- Added version history for v0.4.0

---

## 🔄 Multi-AI Deployment Complete

All three AI systems now have full project planning capabilities:

### Claude Code
- **File**: `.claude/commands/arckit.plan.md` (433 lines)
- **Usage**: `/arckit.plan <description>`
- **Status**: ✅ Deployed and documented

### OpenAI Codex CLI
- **File**: `.codex/prompts/arckit.plan.md` (433 lines)
- **Usage**: `/prompts:arckit.plan <description>`
- **Status**: ✅ Deployed and documented

### Gemini CLI
- **File**: `.gemini/commands/arckit/plan.toml` (converted via converter.py)
- **Usage**: `arckit plan <description>`
- **Status**: ✅ Deployed and documented

---

## 🧹 Asset Management

### Removed Versioned Banners
- Deleted `docs/assets/arckit-banner.png` (had version number)
- Deleted `docs/assets/arckit-v0.3.2-banner.png` (1.5MB, outdated)
- Updated `docs/assets/README.md` to reference version-agnostic SVG only
- **Benefit**: No need to update banners with each release

---

## 🔧 Version Consistency Fixes

### Synchronized All Version References
- Fixed VERSION file (was 0.3.5, now 0.4.0)
- All version references now consistent across:
  - `VERSION` file
  - `pyproject.toml`
  - `README.md`
  - `docs/README.md`
  - `.codex/README.md`

---

## 📊 Command Count

**Total Commands**: 25 (unchanged)
- Command #1 is now `/arckit.plan` (NEW priority)
- All other commands renumbered accordingly

---

## 🚀 Installation

```bash
# Clone repository
git clone https://github.com/tractorjuice/arc-kit.git
cd arc-kit

# For Claude Code users - commands ready immediately
# Use: /arckit.plan, /arckit.stakeholders, etc.

# For Codex CLI users
export CODEX_HOME="$(pwd)/.codex"
codex --auto
# Use: /prompts:arckit.plan, /prompts:arckit.stakeholders, etc.

# For Gemini CLI users - commands ready immediately
# Use: arckit plan, arckit stakeholders, etc.
```

---

## 🗺️ Updated Workflow: Plan-First Approach

### Old Workflow (v0.3.6 and earlier)
```
1. Principles → 2. Stakeholders → 3. Risk → 4. Business Case → ...
```

### New Workflow (v0.4.0+)
```
0. PROJECT PLAN ← START HERE!
    ↓
    Tells you WHEN to run each command:

1. Principles (Week 7)
2. Stakeholders (Weeks 1-2)
3. Risk (Week 8)
4. Business Case (Week 8)
5. Requirements (Weeks 5-6 for BRs, Weeks 9-11 for detailed)
6. Data Model (Week 11)
7. Wardley Map (Week 10)
8. Vendor SOW (Weeks 11-12, if needed)
9. HLD Review (Week 18)
10. DLD Review (Week 25)
...
```

**Key Insight**: The plan shows you the critical path and dependencies.

---

## 📝 What's Included

### Added (v0.4.0)
- **`/arckit.plan`** command with comprehensive project planning
- **`docs/guides/plan.md`** - 660-line comprehensive planning guide
- **Expanded `design-review.md`** - Added 167 lines (Why it matters, integration, common gaps)
- **Expanded `procurement.md`** - Added 191 lines (Why it matters, integration, common gaps)
- **Multi-AI deployment** - Plan command in all three systems
- **Documentation updates** - All command docs updated with Phase 0

### Fixed (v0.4.0)
- VERSION file consistency (0.3.5 → 0.4.0)
- Version references across all documentation

### Removed (v0.4.0)
- Versioned PNG banner files (arckit-banner.png, arckit-v0.3.2-banner.png)

### Improved (v0.4.0)
- Workflow now emphasizes plan-first approach
- All guides follow consistent comprehensive format
- Better integration documentation between commands

---

## 🎯 Use Cases: When to Use `/arckit.plan`

### Scenario 1: Starting a New Project
```bash
# Day 1 of a new digital transformation project
/arckit.plan Create comprehensive plan for pension system modernization with 18-month timeline

# Output: Full project plan with Discovery → Alpha → Beta → Live
# Shows: When to run each command, gate approvals, team sizing
```

### Scenario 2: Validating an In-Flight Project
```bash
# Project already has stakeholders and requirements
/arckit.plan Review current patent system project and create timeline

# Output: Plan reads existing artifacts and adapts timeline
# Shows: Whether you're on track, what's missing, next gates
```

### Scenario 3: Pitching to Stakeholders
```bash
# Need executive buy-in for a new initiative
/arckit.plan Create high-level plan for NHS appointment system with budget £2M

# Output: Executive summary, timeline, gates, team sizing
# Use: Present Gantt chart and workflow to SRO for approval
```

### Scenario 4: Procurement Planning
```bash
# Need to procure vendor, want to show procurement timeline
/arckit.plan Create plan for cloud migration including vendor procurement

# Output: Plan shows vendor SOW (Weeks 11-12), evaluation (Weeks 13-15)
# Benefit: Proves you've thought through procurement timeline
```

---

## 🔜 What's Next

**v0.4.1 (Q4 2025)**: Additional compliance commands
- NCSC Cloud Security Principles assessment
- ISO 27001 compliance checker
- NIST Cybersecurity Framework mapping

**v0.5.0 (Q1 2026)**: Web UI Phase 1
- Next.js + FastAPI foundation
- Project dashboard with status tracking
- Requirements management interface
- Visual diagram viewers (Mermaid, C4, Wardley)
- Interactive Gantt chart viewer

---

## 📊 Version Summary

| Component | Change |
|-----------|--------|
| **Project Planning** | ✅ Added - `/arckit.plan` with GDS phases, Gantt, gates |
| **Planning Guide** | ✅ Added - 660-line comprehensive guide |
| **Design Review Guide** | ⬆️ Expanded - +167 lines (Why, integration, gaps) |
| **Procurement Guide** | ⬆️ Expanded - +191 lines (Why, integration, gaps) |
| **Documentation** | ⬆️ Updated - All command docs with Phase 0 |
| **Multi-AI Deployment** | ✅ Complete - All 3 systems have plan command |
| **Version Consistency** | 🔧 Fixed - All files now show v0.4.0 |
| **Versioned Assets** | 🗑️ Removed - PNG banners deleted |
| **Command Count** | 25 (unchanged, renumbered) |
| **Breaking Changes** | None |
| **Migration Required** | No |

---

## 🔗 Resources

- **GitHub Repository**: https://github.com/tractorjuice/arc-kit
- **Latest Release**: https://github.com/tractorjuice/arc-kit/releases/tag/v0.4.0
- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Planning Guide**: `docs/guides/plan.md`
- **Design Review Guide**: `docs/guides/design-review.md`
- **Procurement Guide**: `docs/guides/procurement.md`
- **Changelog**: `CHANGELOG.md`

---

## 💡 Philosophy: Plan First, Execute Right

### Before v0.4.0
Architects often jumped into stakeholder analysis or requirements without a clear roadmap, leading to:
- ❌ Unclear timelines and missed deadlines
- ❌ Gate approvals as afterthoughts
- ❌ No visibility into critical path
- ❌ Stakeholders surprised by timeline slippage

### With v0.4.0
Architects start with a comprehensive plan that:
- ✅ Shows the entire journey (Discovery → Alpha → Beta → Live)
- ✅ Identifies when to run each ArcKit command
- ✅ Provides gate approval criteria upfront
- ✅ Visualizes dependencies and critical paths
- ✅ Adapts to project complexity automatically
- ✅ Keeps stakeholders informed with Gantt charts

**Result**: Projects execute with confidence, governance is built-in, stakeholders stay informed.

---

## 📈 Impact Metrics

### Documentation Coverage
- **Guides**: 25/25 commands documented (100%)
- **Expanded Guides**: 3 guides now follow comprehensive format
- **Planning Guide**: New 660-line comprehensive guide

### Multi-AI Support
- **Claude Code**: ✅ 25/25 commands
- **Codex CLI**: ✅ 25/25 commands
- **Gemini CLI**: ✅ 25/25 commands
- **Coverage**: 100% across all three systems

### Project Phases
- **Discovery**: 6 commands mapped to timeline
- **Alpha**: 8 commands mapped to timeline
- **Beta**: 6 commands mapped to timeline
- **Live**: 2 commands mapped to timeline
- **Planning**: 1 command (NEW!)

---

## 🤝 Contributors

This release includes contributions from the community and the ArcKit team. Special thanks to all who provided feedback and testing.

---

## 🎉 Headline Features

1. **`/arckit.plan`** - Comprehensive project planning (GDS Agile Delivery)
2. **660-line planning guide** - Everything you need to know about project planning
3. **Expanded guides** - Design review and procurement guides now comprehensive
4. **Multi-AI deployment** - All three systems support project planning
5. **Version consistency** - All version references synchronized
6. **Plan-first workflow** - New recommended approach starts with planning

---

**Built with ❤️ for enterprise architects who want systematic, AI-assisted governance.**

**Start with a plan. Execute with confidence. Deliver with quality.**
