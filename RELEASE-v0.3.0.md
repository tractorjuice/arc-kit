# ArcKit v0.3.0 Release Notes

**Release Date:** 2025-10-21
**Release Type:** Minor Feature Release
**Previous Version:** v0.2.2

---

## 🎉 Major New Features

### 1. Strategic Outline Business Case (SOBC) - Green Book Compliance

Added `/arckit.sobc` command implementing HM Treasury Green Book 5-case model for creating Strategic Outline Business Cases.

**Key Features:**
- **Green Book 5-Case Model**: Strategic, Economic, Commercial, Financial, Management cases
- **Business Case Lifecycle**: SOBC (strategic outline) → OBC (outline) → FBC (full business case)
- **Options Analysis**: Systematic evaluation of Do Nothing, Minimal, Balanced, and Comprehensive options
- **Benefits Mapping**: Complete traceability from stakeholder goals to business benefits
- **Risk-Adjusted Costs**: Integration with risk register for optimism bias calculations
- **UK Government Compliance**: Digital Marketplace, Social Value, Green Book discount rates

**Files Added:**
- `.claude/commands/arckit.sobc.md` (290 lines)
- `templates/sobc-template.md` (1,012 lines)
- `.codex/prompts/arckit.sobc.md` (Codex CLI support)

**Workflow Position:**
```
stakeholders → SOBC → requirements
```

**Output:** `projects/NNN-project-name/sobc.md`

**Use Cases:**
- Justify major technology investments to Board/Treasury
- Secure approval and funding before detailed requirements
- Evaluate strategic options with cost-benefit analysis
- Demonstrate value for money and ROI

---

### 2. Risk Management - Orange Book Compliance

Added `/arckit.risk` command implementing HM Treasury Orange Book 2023 framework for comprehensive risk management.

**Key Features:**
- **Orange Book 2023 Compliance**: Part I (5 Principles) + Part II (Risk Control Framework)
- **6 Risk Categories**: Strategic, Operational, Financial, Compliance, Reputational, Technology
- **4Ts Response Framework**: Tolerate, Treat, Transfer, Terminate
- **5×5 Risk Matrix**: Inherent vs Residual risk assessment (Likelihood × Impact)
- **Complete Stakeholder Integration**: Every risk has owner from RACI matrix
- **Risk Appetite Monitoring**: Track compliance with organizational risk thresholds
- **SOBC Integration**: Risk register feeds into Management Case Part E

**Orange Book 2023 Framework:**

**Part I - Risk Management Principles:**
- A. Governance and Leadership
- B. Integration
- C. Collaboration and Best Information
- D. Risk Management Processes
- E. Continual Improvement

**Part II - Risk Control Framework:**
- Risk appetite and tolerance thresholds
- Risk ownership and governance
- Risk assessment methodology (5×5 matrix)
- Control effectiveness measurement

**Risk Assessment:**
- **Inherent Risk** (before controls): Likelihood (1-5) × Impact (1-5) = Score (1-25)
- **Residual Risk** (after controls): Same scales showing control effectiveness
- **Risk Zones**: 🟥 Critical (20-25) | 🟧 High (13-19) | 🟨 Medium (6-12) | 🟩 Low (1-5)

**Files Added:**
- `.claude/commands/arckit.risk.md` (480+ lines)
- `templates/risk-register-template.md` (900+ lines)
- `.codex/prompts/arckit.risk.md` (Codex CLI support)

**Workflow Position:**
```
stakeholders → risk → SOBC → requirements
```

**Output:** `projects/NNN-project-name/risk-register.md`

**Risk Register Contents:**
- Executive Summary with risk profile
- Inherent & Residual Risk Matrices (5×5 grids)
- Top 10 Risks ranked table
- Detailed risk profiles (R-001, R-002, etc.)
- Risk category analysis
- Risk ownership matrix
- 4Ts distribution summary
- Risk appetite compliance
- Prioritized action plan
- SOBC integration points
- Monitoring framework
- Orange Book compliance checklist

**Use Cases:**
- Identify and assess project risks systematically
- Demonstrate Orange Book compliance for UK Government assurance
- Link risks to stakeholder concerns and objectives
- Inform business case with risk-adjusted costs
- Enable informed go/no-go decisions

---

## 📋 Updated Workflow

The complete ArcKit workflow now includes business case and risk management:

```
1. /arckit.principles
   ↓ (establishes governance rules)

2. /arckit.stakeholders
   ↓ (understand who cares, what they need, why)

3. /arckit.risk ← NEW!
   ↓ (identify and assess risks - Orange Book)

4. /arckit.sobc ← NEW!
   ↓ (create business case using risk register - Green Book)

5. /arckit.requirements
   ↓ (if approved, define detailed requirements)

6. /arckit.sow
   ↓ (creates RFP for vendors)

7. /arckit.evaluate
   ↓ (scores vendor proposals)

8. /arckit.hld-review
   ↓ (reviews architecture before build)

9. /arckit.dld-review
   ↓ (reviews technical details before code)

10. Implementation happens
   ↓

11. /arckit.traceability
   ↓ (verifies all requirements met)

12. Release!
```

---

## 🔗 Integration Between Components

### Stakeholders → Risk → SOBC Flow

**Complete Traceability:**
```
Stakeholder: CFO (from stakeholder-drivers.md)
  → Driver D-001: Reduce costs (FINANCIAL, HIGH)
    → Risk R-004: Cloud costs exceed budget 40% (FINANCIAL, Score: 9)
      → Risk Owner: CFO (from RACI matrix)
        → SOBC Economic Case: £500K risk contingency (optimism bias)
          → SOBC Benefit B-001: £2M cost savings (maps to CFO Goal G-1)
            → SOBC Management Case: Full risk register included
              → SOBC Recommendation: Option 2 (balanced approach)
```

### Risk Register → SOBC Integration

**Strategic Case:**
- Strategic risks demonstrate urgency ("Why Now?")

**Economic Case:**
- Financial risks inform risk-adjusted costs
- Optimism bias calculations from risk scores

**Management Case Part E:**
- Full risk register required
- Top 10 risks highlighted
- Risk ownership matrix
- Monitoring framework

**Recommendation:**
- High-risk profile influences option selection
- May recommend phased approach to de-risk

---

## 📊 Command Count

**Total Commands:** 19 (was 17 in v0.2.2)

**New Commands:**
- `/arckit.sobc` - Strategic Outline Business Case
- `/arckit.risk` - Risk Management (Orange Book)

---

## 🇬🇧 UK Government Compliance

### Green Book (Business Cases)
- ✅ 5-case model (Strategic, Economic, Commercial, Financial, Management)
- ✅ Options analysis with do-nothing baseline
- ✅ Benefits mapping to stakeholder goals
- ✅ Digital Marketplace procurement routes
- ✅ Social value (minimum 10% weighting)
- ✅ Green Book discount rates (3.5% standard)
- ✅ Optimism bias adjustment
- ✅ Whole-life costs (TCO)

### Orange Book (Risk Management)
- ✅ Part I: 5 Risk Management Principles
- ✅ Part II: Risk Control Framework (4-pillar structure)
- ✅ Systematic risk identification (6 categories)
- ✅ Inherent vs Residual risk assessment
- ✅ 4Ts response framework
- ✅ Risk appetite and tolerance
- ✅ Risk ownership and governance
- ✅ Continual improvement and monitoring

### UK-Specific Risks Included
- **Strategic**: Policy/ministerial changes, manifesto commitments, machinery of government
- **Compliance**: HMT spending controls, NAO audits, PAC scrutiny, FOI, judicial review
- **Reputational**: Parliamentary questions, media scrutiny, select committees
- **Operational**: GDS Service Assessment, CDDO controls, security clearances

---

## 📚 Documentation Updates

### Updated Files
- ✅ `README.md` - Added Phase 3 (Risk) and Phase 4 (SOBC)
- ✅ `.claude/COMMANDS.md` - Added sections 3 and 4, renumbered all subsequent sections
- ✅ `.codex/README.md` - Added Phases 3 and 4 for OpenAI Codex CLI users
- ✅ `CHANGELOG.md` - Updated with v0.3.0 changes

### Template Files
- ✅ `templates/sobc-template.md` (1,012 lines) - Green Book 5-case model
- ✅ `templates/risk-register-template.md` (900 lines) - Orange Book risk register

---

## 🚀 Getting Started

### Create a Strategic Outline Business Case

```bash
# 1. Analyze stakeholders first (MANDATORY)
/arckit.stakeholders Analyze stakeholders for cloud migration project

# 2. Assess risks (MANDATORY for SOBC)
/arckit.risk Create risk register for cloud migration

# 3. Create SOBC using stakeholder goals and risk register
/arckit.sobc Create SOBC for cloud migration with £2M investment
```

### Example: Payment Gateway Modernization

```bash
# Phase 1: Governance
/arckit.principles Create principles for PCI-DSS compliant payments

# Phase 2: Stakeholders
/arckit.stakeholders Analyze stakeholders where CFO wants cost reduction,
CTO wants modern architecture, and Compliance needs PCI-DSS Level 1

# Phase 3: Risk Assessment
/arckit.risk Create risk register for payment gateway project

# Phase 4: Business Case
/arckit.sobc Create SOBC for payment gateway modernization with £2M investment

# Phase 5: Requirements (if SOBC approved)
/arckit.requirements Build payment gateway for 10K TPS, PCI-DSS Level 1...
```

---

## 🔧 OpenAI Codex CLI Support

Both new commands are fully supported in OpenAI Codex CLI:

```bash
# Set up Codex CLI
export CODEX_HOME="$(pwd)/.codex"
codex --auto

# Use new commands
/prompts:arckit.risk Create risk register for cloud migration
/prompts:arckit.sobc Create SOBC for payment gateway
```

---

## 💡 Use Cases

### 1. UK Government Digital Services
- Complete Green Book and Orange Book compliance
- Digital Marketplace procurement routes
- Service Standard assessment preparation
- HMT approval pack creation

### 2. Large Enterprise Technology Investments
- Board-level business case justification
- Enterprise risk management integration
- Multi-million pound investment decisions
- Stakeholder-driven governance

### 3. Regulated Industries (Financial, Healthcare)
- Compliance-driven risk assessment
- Audit trail for regulatory review
- Systematic options evaluation
- Value for money demonstration

---

## 📈 Benefits

### For Enterprise Architects
- **Systematic Governance**: End-to-end workflow from stakeholders to business case
- **Compliance Built-in**: UK Government frameworks embedded
- **Complete Traceability**: Stakeholders → Risks → Benefits → Requirements
- **Professional Quality**: 1,900+ lines of templates following best practices

### For Project Managers
- **Risk Management**: Orange Book compliant risk registers
- **Business Cases**: Green Book compliant SOBCs
- **Decision Support**: Systematic options analysis
- **Audit Ready**: Full traceability and documentation

### For CFOs/Finance Teams
- **Value for Money**: Economic appraisal with NPV, ROI, payback
- **Risk-Adjusted Costs**: Optimism bias from risk assessment
- **Financial Controls**: Budget, funding, affordability analysis
- **Benefits Tracking**: Quantified benefits linked to stakeholder goals

---

## 🐛 Bug Fixes

- Fixed command ordering in `.claude/COMMANDS.md` (stakeholders now correctly positioned before SOBC)
- Improved commit messages for documentation updates
- Corrected workflow documentation alignment

---

## 📦 Installation

### New Projects

```bash
# Install ArcKit CLI
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Initialize project
arckit init my-project --ai claude
cd my-project
```

### Existing Projects

```bash
# Pull latest from arc-kit repository
cd your-arckit-project
git pull

# Or reinitialize with latest version
arckit init . --ai claude --force
```

---

## 🔄 Migration from v0.2.2

No breaking changes. New commands are additive.

**Updated Workflow:**
If you're currently using:
```
principles → stakeholders → requirements
```

You can now insert risk and SOBC:
```
principles → stakeholders → risk → SOBC → requirements
```

**Prerequisites:**
- SOBC requires stakeholder analysis (existing requirement)
- Risk requires stakeholder analysis (new requirement for risk owners)

---

## 📊 Statistics

**Lines of Code Added:** ~3,900 lines
- SOBC command: ~290 lines
- SOBC template: ~1,012 lines
- Risk command: ~480 lines
- Risk template: ~900 lines
- Documentation updates: ~1,200 lines

**Files Created:** 6 new files
- 2 command files (.claude/commands/)
- 2 templates (templates/)
- 2 Codex prompts (.codex/prompts/)

**Documentation Updated:** 3 files
- README.md
- .claude/COMMANDS.md
- .codex/README.md

---

## 🙏 Acknowledgments

This release implements:
- **HM Treasury Green Book** (2022) - Management of Public Money, 5-case business case model
- **HM Treasury Orange Book** (2023) - Management of Risk, Principles and Concepts
- **UK Government Digital Marketplace** procurement routes
- **UK Government Service Standard** assessment alignment

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

## 🔗 Resources

- **GitHub Repository**: https://github.com/tractorjuice/arc-kit
- **Documentation**: README.md, .claude/COMMANDS.md
- **Templates**: `templates/sobc-template.md`, `templates/risk-register-template.md`
- **Green Book**: https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-governent
- **Orange Book**: https://www.gov.uk/government/publications/orange-book

---

## 🚀 What's Next

Future releases may include:
- Outline Business Case (OBC) command - refined costs after design
- Full Business Case (FBC) command - accurate costs for final approval
- Risk appetite framework command
- Benefits realization tracking
- Post-implementation review

---

**Full Release:** v0.3.0
**Tag:** `v0.3.0`
**Commit:** [SHA to be added after tag]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
