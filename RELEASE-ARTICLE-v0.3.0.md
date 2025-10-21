**TL;DR:** I've released ArcKit v0.3.0 — a free, open-source toolkit that brings AI-assisted workflows, HM Treasury Green Book & Orange Book compliance, strategic Wardley Mapping, and complete stakeholder-to-requirement traceability to enterprise architecture governance.

# ArcKit v0.3.0 - Green Book & Orange Book Edition

ArcKit transforms EA governance into systematic, AI-assisted workflows using Claude Code or OpenAI Codex CLI.

**19 Slash Commands. Complete Governance. Zero Cost.**

## Install

```bash
# Install
pip install git+https://github.com/tractorjuice/arc-kit.git

# Initialise
arckit init payment-modernisation --ai claude
cd payment-modernisation
claude

# Use commands
/arckit.principles Create principles for financial services
/arckit.stakeholders Analyze stakeholders for payment modernization
/arckit.risk Create risk register for payment gateway project
/arckit.sobc Create Strategic Outline Business Case with £2M investment
/arckit.requirements Build a payment processing system...
/arckit.wardley Create strategic map showing build vs buy
/arckit.sow Generate vendor RFP
/arckit.evaluate Compare vendor proposals
/arckit.hld-review Review high-level design
/arckit.dld-review Review detailed design
/arckit.traceability Generate requirements matrix
/arckit.analyze Comprehensive governance quality check
/arckit.tcop Assess UK Government TCoP compliance
/arckit.ai-playbook Assess AI Playbook compliance
/arckit.atrs Generate ATRS transparency record
```

## What's New in v0.3.0

### 🎯 HM Treasury Green Book Compliance - Business Cases

**Strategic Outline Business Case (SOBC)** - `/arckit.sobc`

- **5-Case Model**: Strategic, Economic, Commercial, Financial, Management
- **Options Analysis**: Systematic evaluation (Do Nothing, Minimal, Balanced, Comprehensive)
- **Benefits Mapping**: Complete traceability to stakeholder goals
- **Risk-Adjusted Costs**: Optimism bias from risk assessment
- **UK Government Ready**: Digital Marketplace, Social Value, Green Book discount rates
- **1,012-line template** following HM Treasury best practices

**Business Case Lifecycle:**
- **SOBC** (this release): Strategic outline with ROM estimates
- **OBC** (future): Outline case with refined costs
- **FBC** (future): Full case with accurate costs for final approval

### 🛡️ HM Treasury Orange Book Compliance - Risk Management

**Comprehensive Risk Register** - `/arckit.risk`

- **Orange Book 2023 Framework**: Part I (5 Principles) + Part II (Risk Control Framework)
- **6 Risk Categories**: Strategic, Operational, Financial, Compliance, Reputational, Technology
- **4Ts Response**: Tolerate, Treat, Transfer, Terminate
- **5×5 Risk Matrix**: Inherent vs Residual risk (Likelihood × Impact)
- **Stakeholder Integration**: Every risk has owner from RACI matrix
- **Risk Appetite**: Monitor compliance with organizational thresholds
- **900-line template** with complete Orange Book compliance

**Risk Zones:**
- 🟥 Critical (20-25): Immediate escalation
- 🟧 High (13-19): Management attention
- 🟨 Medium (6-12): Monitoring
- 🟩 Low (1-5): Routine

### 👥 Stakeholder-Driven Governance

**Stakeholder Analysis** - `/arckit.stakeholders`

- **Power-Interest Grid**: Identify and prioritize stakeholders
- **Driver → Goal → Outcome**: Complete traceability chain
- **7 Driver Types**: Strategic, Operational, Financial, Compliance, Personal, Risk, Customer
- **Conflict Resolution**: Systematic analysis and resolution strategies
- **RACI Matrix**: Clear decision authorities and risk ownership
- **400-line template** for comprehensive stakeholder mapping

### 🔗 Complete End-to-End Traceability

```
Stakeholder → Driver → Goal → Risk → Benefit → Requirement → Design → Test
```

**Example Flow:**
```
CFO (Stakeholder)
  → Reduce datacenter costs (Driver - FINANCIAL, HIGH)
    → 40% cost reduction by end of Year 1 (Goal)
      → Cloud costs exceed budget (Risk R-004, Score: 9)
        → £2M annual savings (SOBC Benefit B-001)
          → Migrate to AWS (Requirement BR-001)
            → Cloud architecture (HLD Component)
              → Infrastructure as Code (Implementation)
                → Cost monitoring tests (Test TC-001)
```

Every decision links back to stakeholder value.

## Updated Workflow

```
1. /arckit.principles      (establishes governance rules)
   ↓
2. /arckit.stakeholders    (understand who cares and why)
   ↓
3. /arckit.risk            (identify and assess risks - Orange Book) ← NEW!
   ↓
4. /arckit.sobc            (create business case - Green Book) ← NEW!
   ↓
5. /arckit.requirements    (if approved, define detailed requirements)
   ↓
6. /arckit.sow             (creates RFP for vendors)
   ↓
7. /arckit.evaluate        (scores vendor proposals)
   ↓
8. /arckit.hld-review      (reviews architecture before build)
   ↓
9. /arckit.dld-review      (reviews technical details before code)
   ↓
10. /arckit.traceability   (verifies all requirements met)
   ↓
11. Release!
```

## Key Features

### Strategic Wardley Mapping (Unique to ArcKit)
- Position components by evolution stage (Genesis → Custom → Product → Commodity)
- Guide build vs buy decisions strategically
- Visualise at https://create.wardleymaps.ai

### UK Government Support (Built-in)
- **Green Book**: 5-case business case model (SOBC → OBC → FBC)
- **Orange Book**: Risk management framework (6 categories, 4Ts response)
- **Technology Code of Practice**: 13 mandatory points
- **AI Playbook**: 10 principles + 6 ethical themes
- **ATRS**: Algorithmic Transparency Recording Standard
- **Digital Marketplace**: G-Cloud, DOS procurement guidance

### Quality Assurance
- 7-pass governance analysis
- Automated traceability checking
- A-F governance health scoring
- Orange Book compliance checklist
- Green Book compliance verification

### Template-Driven Quality
- **1,900+ lines of new templates** (SOBC + Risk Register)
- Comprehensive templates guide AI generation
- Nothing forgotten, consistent quality
- Git-versioned Markdown (no lock-in)

### Multi-AI Support
- **Claude Code** (recommended)
- **OpenAI Codex CLI** (ChatGPT Plus/Pro/Enterprise)
- **GitHub Copilot**
- **Cursor**
- **Gemini CLI**

## Use Cases

### 1. UK Government Digital Services
- Complete Green Book and Orange Book compliance
- HMT approval pack creation
- Service Standard assessment preparation
- Digital Marketplace procurement routes

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

## Example: Payment Gateway Modernization

```bash
# Phase 1: Governance
/arckit.principles Create principles for PCI-DSS compliant payments

# Phase 2: Stakeholders (BEFORE requirements!)
/arckit.stakeholders Analyze stakeholders where CFO wants cost reduction,
CTO wants modern architecture, and Compliance needs PCI-DSS Level 1

# Phase 3: Risk Assessment (NEW!)
/arckit.risk Create risk register for payment gateway project

# Phase 4: Business Case (NEW!)
/arckit.sobc Create SOBC for payment gateway modernization with £2M investment

# Phase 5: Requirements (if SOBC approved)
/arckit.requirements Build payment gateway: 10K TPS, PCI-DSS Level 1,
integrates with Stripe/PayPal, real-time fraud detection

# Phase 6: Strategic Planning
/arckit.wardley Create current state map showing build vs buy strategy

# Phase 7: Vendor Procurement
/arckit.sow Generate RFP for vendor selection
/arckit.evaluate Compare Vendor A vs Vendor B proposals

# Phase 8: Design Reviews
/arckit.hld-review Review Acme Corp's high-level design
/arckit.dld-review Review Acme Corp's detailed design

# Phase 9: Verification
/arckit.traceability Generate matrix from requirements through design to tests
```

## Try It Now

**GitHub Codespaces:** https://github.com/tractorjuice/arckit-test-project-v1

Complete test project ready to go, just click "Open with Codespaces."

**Quick Start:**
```bash
arckit init my-project --ai claude
cd my-project
claude

/arckit.principles Create principles for my organization
/arckit.stakeholders Analyze stakeholders for cloud migration
/arckit.risk Create risk register using Orange Book
/arckit.sobc Create SOBC to justify £5M investment
```

**For OpenAI Codex CLI users:**
```bash
export CODEX_HOME="$(pwd)/.codex"
codex --auto

/prompts:arckit.stakeholders Analyze stakeholders
/prompts:arckit.risk Create risk register
/prompts:arckit.sobc Create business case
```

## Statistics

**v0.3.0 Release:**
- **19 commands** (was 12 in v0.2.0)
- **~3,900 lines** of new functionality
- **1,012-line** Green Book SOBC template
- **900-line** Orange Book risk register template
- **7 test repositories** deployed

**Complete Compliance:**
- ✅ HM Treasury Green Book (Business Cases)
- ✅ HM Treasury Orange Book (Risk Management)
- ✅ UK Government Technology Code of Practice
- ✅ UK Government AI Playbook
- ✅ Algorithmic Transparency Recording Standard
- ✅ UK Government Service Standard (alignment)

## Get Involved

- **GitHub:** https://github.com/tractorjuice/arc-kit
- **Docs:** https://github.com/tractorjuice/arc-kit/blob/main/README.md
- **Latest Release:** https://github.com/tractorjuice/arc-kit/releases/tag/v0.3.0
- **Issues:** https://github.com/tractorjuice/arc-kit/issues
- **Discussions:** https://github.com/tractorjuice/arc-kit/discussions

Open-source (MIT License). Community-driven. Built by architects, for architects.

Inspired by Spec Kit, adapted for enterprise architecture workflows.

## What's Next?

Future releases may include:
- **Outline Business Case (OBC)** - Refined costs after design
- **Full Business Case (FBC)** - Accurate costs for final approval
- **Risk Appetite Framework** - Organizational risk thresholds
- **Benefits Realization Tracking** - Measure actual vs expected benefits
- **Post-Implementation Review** - Lessons learned and value delivered

---

**The future of EA governance is AI-assisted, strategic, stakeholder-driven, and free.**

**Welcome to ArcKit v0.3.0 - Green Book & Orange Book Edition.**
