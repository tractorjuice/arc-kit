# ArcKit v0.2.2 - OpenAI Codex CLI Support & Enhanced Stakeholder Analysis

**Release Date**: 2025-10-20

## 🎉 Major Features

### 🤖 OpenAI Codex CLI Support

ArcKit now supports **OpenAI Codex CLI** in addition to Claude Code! Codex CLI is OpenAI's coding agent included with ChatGPT Plus, Pro, Business, Edu, and Enterprise plans.

**Why This Matters**:
- ✅ **Same powerful workflows** on OpenAI's platform
- ✅ **No additional infrastructure** - Codex CLI already exists
- ✅ **Included with ChatGPT Plus** ($20/month, no API costs)
- ✅ **Local file system access** with bash script execution
- ✅ **Custom slash commands** via `.codex/prompts/`

**How to Use**:

```bash
# Set CODEX_HOME for project-specific commands
export CODEX_HOME="$(pwd)/.codex"
codex --auto

# Use ArcKit commands with /prompts: prefix
/prompts:arckit.principles Create principles for financial services
/prompts:arckit.stakeholders Analyze stakeholders for cloud migration
/prompts:arckit.requirements Create comprehensive requirements
```

**What's Included**:
- 📁 `.codex/` folder structure with 17 prompts
- 📚 Comprehensive `.codex/README.md` setup guide (400+ lines)
- 🔧 Approval modes documentation (--auto, --read-only, --network)
- 🆚 Comparison guide: Codex CLI vs Claude Code
- 🐛 Troubleshooting section

**Supported AI Agents** (now 3 total):
1. **Claude Code** ✅ (Recommended)
2. **OpenAI Codex CLI** ✅ (NEW in v0.2.2)
3. **Gemini CLI** ✅

---

### 👥 Enhanced Stakeholder Analysis (v0.2.1)

Comprehensive stakeholder analysis framework that identifies **who** cares about your project and **why**, with complete traceability from drivers to outcomes.

**New Command**: `/arckit.stakeholders`

```bash
/arckit.stakeholders Analyze stakeholders for cloud migration where CFO wants cost savings, CTO wants innovation, and Operations is worried about downtime
```

**Key Features**:

#### 1. **Power-Interest Grid**
Classify stakeholders by engagement strategy:
- **Manage Closely**: High power, high interest (key players)
- **Keep Satisfied**: High power, low interest (influential)
- **Keep Informed**: Low power, high interest (advocates)
- **Monitor**: Low power, low interest (minimal engagement)

#### 2. **Seven Types of Drivers**
Deep analysis of what motivates each stakeholder:
- **STRATEGIC**: Competitive advantage, market position, innovation
- **OPERATIONAL**: Efficiency, quality, speed, reliability
- **FINANCIAL**: Cost reduction, revenue growth, ROI
- **COMPLIANCE**: Regulatory requirements, audit findings, risk mitigation
- **PERSONAL**: Career advancement, workload reduction, reputation
- **RISK**: Avoiding penalties, preventing failures
- **CUSTOMER**: Satisfaction, retention, acquisition

#### 3. **Complete Traceability**
Map from motivations to measurable outcomes:

```
Stakeholder → Driver → Goal → Outcome
   CFO    → Cost reduction → 40% savings by Q4 → £2M annual savings
```

#### 4. **Conflict Analysis & Resolution**
Systematic approach to handling competing stakeholder needs:

**Common Conflicts**:
- **Speed vs Quality**: CFO wants fast delivery vs Operations wants thorough testing
- **Cost vs Features**: Finance wants minimal spend vs Product wants rich features
- **Security vs Usability**: Security wants MFA vs Users want seamless experience
- **Flexibility vs Standardization**: Business wants customization vs IT wants standards

**Resolution Strategies**:
1. **PRIORITIZE**: Choose one stakeholder over another (with justification)
2. **COMPROMISE**: Find middle ground that partially satisfies both
3. **PHASE**: Satisfy both but at different times (MVP vs Phase 2)
4. **INNOVATE**: Find creative solution that satisfies both

#### 5. **RACI Matrix**
Document decision authority for governance:
- **Responsible**: Who does the work
- **Accountable**: Who makes the final decision
- **Consulted**: Who provides input
- **Informed**: Who needs to know

**Template**: `templates/stakeholder-drivers-template.md` (400+ lines)

---

### 🔄 Updated Requirements Workflow

**CRITICAL CHANGE**: Stakeholder analysis now **MUST** come **BEFORE** requirements.

**Old Workflow** ❌:
```
Principles → Requirements → Design
```

**New Workflow** ✅:
```
Principles → Stakeholders → Requirements → Design
```

**Why This Matters**:
- Requirements should address **stakeholder goals**, not invented needs
- Prioritization should reflect **stakeholder power/interest**, not gut feel
- Conflicts between requirements often stem from **stakeholder conflicts**

**Enhanced `/arckit.requirements` Command**:

1. **Checks for stakeholder analysis first**:
   ```
   If stakeholder analysis doesn't exist:
   → Strongly recommend running /arckit.stakeholders first
   ```

2. **Traces requirements back to stakeholder goals**:
   ```markdown
   BR-001: Reduce infrastructure costs 40% by Q4 2025
   Rationale: Addresses CFO's goal G-1 (cost reduction driver)
   Stakeholder: CFO (High Power, High Interest)
   ```

3. **Identifies and resolves requirement conflicts**:
   ```markdown
   ## Requirement Conflicts & Resolutions

   ### Conflict C-1: Timeline vs Quality

   **Conflicting Requirements**:
   - FR-001: Deliver MVP in 3 months (CEO driver: market pressure)
   - NFR-Q-002: 95% test coverage (CTO driver: quality standards)

   **Trade-off Analysis**:
   | Option | Pros | Cons | Impact |
   |--------|------|------|--------|
   | Prioritize Speed | ✅ Meet market window | ❌ Higher bugs | CEO happy, CTO concerned |
   | Prioritize Quality | ✅ Quality reputation | ❌ Miss market | CTO happy, CEO frustrated |
   | Compromise | ✅ Balance | ❌ Neither fully satisfied | Both somewhat satisfied |
   | Innovate | ✅ Automated testing | ❌ Higher cost | Both satisfied if works |

   **Decision**: INNOVATE - Invest in automated testing pipeline
   **Rationale**: Pays off long-term, satisfies both stakeholders
   **Decision Authority**: CTO (per RACI matrix)
   **Impact**: FR-001 timeline extended to 4 months, NFR-Q-002 achieved via automation
   ```

4. **Documents stakeholder management**:
   - Who "won" and who "lost" in conflicts
   - How to communicate with losing stakeholders
   - What was deferred to future phases

**Template**: Updated `templates/requirements-template.md` with conflict resolution section

---

## 📊 Statistics

- **20 files changed**
- **6,342+ lines added**
- **1 new command** (`/arckit.stakeholders`)
- **1 new folder structure** (`.codex/` for OpenAI Codex CLI)
- **17 prompts** for Codex CLI users
- **1 comprehensive setup guide** (`.codex/README.md`)
- **1 integration strategy document** (`OPENAI-INTEGRATION-PLAN.md`)
- **Enhanced workflow**: Stakeholders now inform requirements

---

## 🎯 Use Cases

### Cloud Migration with Competing Stakeholders

```bash
# 1. Initialize project
arckit init cloud-migration --ai codex  # NEW: Codex CLI support!
cd cloud-migration

export CODEX_HOME="$(pwd)/.codex"
codex --auto

# 2. Establish principles
/prompts:arckit.principles Create cloud-first principles with FinOps

# 3. Analyze stakeholders (NEW STEP - DO THIS BEFORE REQUIREMENTS!)
/prompts:arckit.stakeholders Analyze stakeholders where:
- CFO wants £2M annual cost savings
- CTO wants modern tech stack to attract talent
- Operations Director is worried about downtime during migration
- CISO needs enhanced security controls for compliance

# Output includes:
# - Power-Interest Grid classifying all stakeholders
# - Driver analysis for each (FINANCIAL, STRATEGIC, RISK, COMPLIANCE)
# - SMART goals mapped to each driver
# - Measurable outcomes with KPIs
# - Conflict analysis: CFO speed vs Operations safety
# - Resolution strategy: Phased approach (low-risk apps first)
# - RACI matrix for decision authority

# 4. Create requirements informed by stakeholder goals
/prompts:arckit.requirements Create cloud migration requirements

# Output includes:
# - BR-001: "Reduce infrastructure costs 40% by Q4 2025"
#   Addresses CFO's goal G-1 (cost reduction driver)
# - NFR-P-001: "Maintain 99.95% uptime during migration"
#   Addresses Operations Director's goal G-3 (risk mitigation driver)
# - Requirement Conflicts section documenting:
#   * Conflict C-1: Speed (CFO) vs Safety (Operations)
#   * Resolution: PHASE - Start with low-risk apps
#   * Decision Authority: CTO (per RACI matrix)

# 5. Continue with design reviews
/prompts:arckit.hld-review Review high-level design for cloud architecture
```

### UK Government AI Project with Complex Stakeholder Landscape

```bash
# Initialize for government AI project
arckit init benefits-chatbot --ai claude

# Analyze government stakeholders
/arckit.stakeholders Analyze stakeholders for DWP benefits chatbot where:
- Minister wants quick delivery for manifesto commitment
- Permanent Secretary needs proper governance to avoid NAO criticism
- Service Delivery wants to reduce call center volume
- Citizens need accurate, accessible answers
- ICO requires data protection compliance
- Treasury demands value for money

# Output includes UK-specific drivers:
# - POLITICAL: Minister responds to parliamentary questions
# - RISK/ACCOUNTABILITY: Permanent Secretary avoids audit findings
# - OPERATIONAL: Service Delivery improves citizen experience
# - USER: Citizens get fast, accurate service
# - REGULATORY: ICO enforces GDPR compliance
# - FINANCIAL: Treasury controls spending

# Requirements will trace back to these drivers:
# - BR-001: "Launch MVP in 6 months" (Minister's manifesto commitment)
# - NFR-C-001: "GDPR compliance with DPIA" (ICO regulatory requirement)
# - FR-001: "Answer 90% of benefits queries" (Service Delivery operational driver)
# - Conflict C-1: Speed (Minister) vs Due Diligence (Permanent Secretary)
#   Resolution: PHASE - Alpha with limited scope, Beta adds full compliance

# Create requirements aligned with stakeholder goals
/arckit.requirements Create requirements for benefits eligibility chatbot

# Assess compliance
/arckit.ai-playbook Assess AI Playbook compliance for benefits chatbot (HIGH-RISK)
/arckit.tcop Assess TCoP compliance for Beta phase
```

---

## 🔧 What's Changed

### Added

#### OpenAI Codex CLI Support (v0.2.2)
- **Folder**: `.codex/` with prompts and setup guide
- **File**: `.codex/README.md` - Comprehensive Codex CLI setup guide (400+ lines)
- **File**: `.codex/prompts/*.md` - All 17 ArcKit commands for Codex
- **File**: `OPENAI-INTEGRATION-PLAN.md` - Integration strategy document
- **Updated**: `README.md` - Added Codex CLI to supported agents table
- **Updated**: All 7 test repositories with `.codex/` support

#### Stakeholder Analysis (v0.2.1)
- **Command**: `/arckit.stakeholders` - Comprehensive stakeholder driver analysis
- **Template**: `templates/stakeholder-drivers-template.md` (400+ lines)
  - Power-Interest Grid
  - 7 types of drivers (STRATEGIC, OPERATIONAL, FINANCIAL, COMPLIANCE, PERSONAL, RISK, CUSTOMER)
  - Driver → Goal → Outcome traceability
  - Conflict analysis framework
  - Resolution strategies (PRIORITIZE, COMPROMISE, PHASE, INNOVATE)
  - RACI matrix
  - Engagement plan

#### Enhanced Requirements Process (v0.2.1)
- **Updated**: `/arckit.requirements` command
  - Now checks for stakeholder analysis first
  - Traces requirements back to stakeholder goals
  - Identifies and resolves requirement conflicts
  - Documents stakeholder management (who won/lost)
- **Updated**: `templates/requirements-template.md`
  - Added "Requirement Conflicts & Resolutions" section
  - Added trade-off analysis tables
  - Added stakeholder traceability references
  - Added 6 common conflict patterns with resolutions

#### Documentation
- **Updated**: `README.md` - Corrected workflow order (stakeholders before requirements)
- **Updated**: `.claude/COMMANDS.md` - Added stakeholder analysis step

### Changed

#### Workflow Order (BREAKING CONCEPT CHANGE)
**Old**: Principles → Requirements → Design
**New**: Principles → **Stakeholders** → Requirements → Design

**Impact**: Requirements are now informed by stakeholder goals, not invented needs.

**Migration**:
- No code changes required
- Recommend running `/arckit.stakeholders` before `/arckit.requirements` on new projects
- Existing projects can add stakeholder analysis retroactively

---

## 🚀 Migration from v0.2.1

### For Existing Projects

**No breaking changes** - all v0.2.1 commands continue to work.

**Recommended for new projects**:
1. Run `/arckit.stakeholders` **before** `/arckit.requirements`
2. When running `/arckit.requirements`, it will read your stakeholder analysis and:
   - Trace requirements back to stakeholder goals
   - Identify conflicts from stakeholder conflicts
   - Suggest resolutions based on stakeholder power/interest

**For OpenAI Codex CLI users**:
1. Pull latest code with `.codex/` folder
2. Set `export CODEX_HOME="$(pwd)/.codex"`
3. Start `codex --auto`
4. Use `/prompts:arckit.*` format for commands

### For Test Repositories

All 7 test repositories updated with:
- `.codex/` folder and README
- Updated `README.md` mentioning Codex CLI support
- Updated `QUICKSTART.md` with stakeholder analysis step

---

## 📦 Installation

```bash
# Install latest version
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Or run without installing
uvx --from git+https://github.com/tractorjuice/arc-kit.git arckit init my-project

# Initialize with Codex CLI support
arckit init my-project --ai codex
```

---

## 🎓 Key Learnings

### Why Stakeholders Come Before Requirements

**The Problem**: Traditional requirements gathering often starts with "what do we need?" This leads to:
- ❌ Requirements driven by personal opinions, not stakeholder goals
- ❌ Arbitrary prioritization based on gut feel
- ❌ Conflicts discovered late when stakeholders review
- ❌ Poor stakeholder buy-in because their needs weren't understood

**The Solution**: Start with "who cares and why?"
- ✅ Requirements trace to real stakeholder goals
- ✅ Prioritization based on stakeholder power/interest
- ✅ Conflicts identified early from stakeholder analysis
- ✅ Strong buy-in because stakeholders see their goals addressed

**Example**:

**Bad (Old Way)**:
```
Requirement: "System must have <2 second response time"
Why? "Because fast is good"
Priority? "HIGH because I think it's important"
```

**Good (New Way)**:
```
Requirement: "System must have <2 second response time"
Why? "Addresses Product Manager's goal G-3: Improve conversion rate 25%"
Context: "PM's driver D-2: Competitive pressure (STRATEGIC, HIGH intensity)"
Evidence: "PM's research shows 1-second delay = 7% conversion drop"
Priority: MUST (PM is High Power, High Interest stakeholder)
Conflict: None (CISO wants security, no conflict with performance)
```

---

## 🙏 Acknowledgements

This release builds on:
- **OpenAI Codex CLI** - For providing an excellent AI coding agent
- **Claude Code** - For pioneering the AI-assisted architecture workflow
- **User feedback** - For requesting multi-agent support
- **UK Government frameworks** - TCoP, AI Playbook, ATRS (from v0.2.0)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 📈 What's Next (v0.3.0)

Potential future enhancements:
- **GitHub Actions integration** - Automated compliance checks in CI/CD
- **Dashboard generation** - Visual stakeholder maps and traceability charts
- **Template versioning** - Track template evolution over time
- **Multi-project support** - Cross-project principle inheritance
- **API mode** - Programmatic access for custom tooling

---

**Full Changelog**: https://github.com/tractorjuice/arc-kit/compare/v0.2.1...v0.2.2
