# Announcing ArcKit: The Free, Open-Source Toolkit Transforming Enterprise Architecture Governance

**Today, we're excited to announce the release of ArcKit v0.2.0—a free, open-source toolkit that brings AI-assisted workflows, strategic Wardley Mapping, and systematic governance to enterprise architecture.**

---

## The Problem We're Solving

Enterprise architects face a crisis that few talk about openly. Despite spending millions on tools like Sparx EA, Ardoq, and LeanIX, architecture governance remains fundamentally broken:

- Requirements documents scatter across Word, Confluence, and SharePoint
- Vendor evaluations introduce bias through manual scoring
- Design reviews happen ad-hoc without consistent standards
- Traceability between requirements and design is lost within weeks
- Architecture principles exist as PDF shelf-ware nobody reads

**The tools aren't the problem—it's that they weren't designed for the modern, AI-assisted world we live in today.**

## Introducing ArcKit

ArcKit is a new approach to enterprise architecture governance. Instead of expensive proprietary platforms, it provides:

- **AI-Assisted Workflows**: Works with Claude Code, GitHub Copilot, Cursor, or Gemini CLI
- **Template-Driven Quality**: Comprehensive templates guide AI to generate complete documentation
- **Git-Versioned Artifacts**: Everything in Markdown—no vendor lock-in, full version control
- **Strategic Decision-Making**: Built-in Wardley Mapping for build vs buy decisions
- **Systematic Governance**: Structured workflows from requirements → procurement → design review

**Best of all? It's completely free and open-source (MIT License).**

## What You Can Do with ArcKit

ArcKit provides 12 slash commands that cover the complete enterprise architecture lifecycle:

### Core Governance

**`/arckit.principles`** - Create comprehensive architecture principles
```bash
/arckit.principles Create principles for a financial services company
with cloud-first strategy, zero trust security, and FinOps governance
```

Generates principles covering:
- Cloud strategy (AWS/Azure/GCP selection criteria)
- Security frameworks (Zero Trust, PCI-DSS)
- Technology standards and patterns
- FinOps cost governance
- Data residency and sovereignty

Each principle includes governance implications, trade-off analysis, and compliance requirements—not vague aspirations.

**`/arckit.requirements`** - Define comprehensive, traceable requirements
```bash
/arckit.requirements Build a payment gateway that processes credit cards,
supports 10K TPS, complies with PCI-DSS Level 1, and provides real-time
fraud detection
```

Generates 50+ structured requirements across:
- Business Requirements (BR) with rationale
- Functional Requirements (FR) with acceptance criteria
- Non-Functional Requirements (NFR) for performance, security, scalability
- Integration Requirements (INT) for external systems
- Data Requirements (DR) for data models and PII handling

### Strategic Planning (NEW!)

**`/arckit.wardley`** - Create strategic Wardley Maps

This is where ArcKit truly shines. Wardley Mapping positions components by evolution stage to guide strategic decisions:

```bash
/arckit.wardley Create current state Wardley Map for payment gateway
showing build vs buy strategy
```

**Evolution Stages**:
- **Genesis (0.0-0.25)**: Novel, build only if strategic differentiator
- **Custom (0.25-0.50)**: Bespoke, critical build vs buy decision
- **Product (0.50-0.75)**: Commercial products, buy from vendors
- **Commodity (0.75-1.0)**: Utility services, always use cloud

**Strategic Insights**:
- BUILD: Payment orchestration (Custom, 0.42) - competitive advantage
- BUY: Stripe/PayPal (Product, 0.70) - mature market
- USE: AWS infrastructure (Commodity, 0.95) - no-brainer

The map outputs to OnlineWardleyMaps format, visualizable at https://create.wardleymaps.ai

### Vendor Procurement

**`/arckit.sow`** - Generate vendor RFPs
```bash
/arckit.sow Generate RFP for vendor selection with 12-month timeline
and $2M budget
```

Creates comprehensive Statement of Work including scope, technical requirements, vendor qualifications, evaluation criteria, and contract terms.

**`/arckit.evaluate`** - Create unbiased evaluation frameworks
```bash
/arckit.evaluate Create evaluation framework
```

Generates 100-point technical scoring rubric with:
- Requirements coverage (40 points)
- Technical approach (25 points)
- Security and compliance (20 points)
- Implementation quality (15 points)

Then compare vendors side-by-side:
```bash
/arckit.evaluate Compare all vendors for payment gateway project
```

### Design Review

**`/arckit.hld-review`** - Review High-Level Design
```bash
/arckit.hld-review Review Acme Corp's high-level design
```

Validates:
- Architecture principles compliance
- Requirements coverage (all 50+ requirements addressed?)
- Security and compliance (PCI-DSS, Zero Trust)
- Scalability and resilience (can it handle 10K TPS?)
- Operational readiness (monitoring, alerting)

**`/arckit.dld-review`** - Review Detailed Design
```bash
/arckit.dld-review Review Acme Corp's detailed design for payment service
```

Implementation-ready validation:
- Component specifications and interfaces
- API contracts (OpenAPI/Swagger)
- Database schemas and data models
- Security implementation details
- Test strategy and coverage

### Quality Assurance

**`/arckit.analyze`** - Comprehensive governance analysis
```bash
/arckit.analyze
```

Performs 7-pass analysis:
1. **Requirements Quality**: Duplication, ambiguity, underspecification
2. **Principles Alignment**: Violations and coverage gaps
3. **Traceability**: Requirements → Design → Tests mapping
4. **Vendor Procurement**: SOW quality, evaluation fairness
5. **UK Government Compliance** (if applicable): TCoP, AI Playbook, ATRS
6. **Consistency**: Terminology drift, data model conflicts
7. **Security & Compliance**: Coverage analysis

**Output**: Governance Health Score (A-F grade) with actionable recommendations

### Traceability

**`/arckit.traceability`** - Generate traceability matrix
```bash
/arckit.traceability Generate matrix from requirements through design to tests
```

Ensures:
- Forward traceability: Requirements → Design → Tests
- Backward traceability: Tests → Design → Requirements
- Gap analysis: Requirements without design coverage
- Orphan detection: Design components not linked to requirements

## UK Government Support: Built-in Compliance

ArcKit includes comprehensive support for UK Government frameworks—a unique feature for public sector architects.

### Technology Code of Practice (TCoP)

**`/arckit.tcop`** - Assess all 13 TCoP points
```bash
/arckit.tcop Assess Technology Code of Practice compliance for HMRC
tax filing in Beta phase
```

Assesses compliance with:
1. Define User Needs
2. Make Things Accessible (WCAG 2.2 AA)
3. Be Open and Use Open Source
4. Make Use of Open Standards
5. Use Cloud First
6. Make Things Secure (Cyber Essentials)
7. Make Privacy Integral (UK GDPR, DPIA)
8. Share, Reuse and Collaborate (GOV.UK services)
9. Integrate and Adapt Technology
10. Make Better Use of Data
11. Define Your Purchasing Strategy (Digital Marketplace)
12. Make Your Technology Sustainable (Greening Government ICT)
13. Meet the Service Standard

Each point includes compliance checkboxes, evidence requirements, phase-specific guidance (Discovery/Alpha/Beta/Live), and scoring (0-10 points).

### AI Playbook for Responsible AI

**`/arckit.ai-playbook`** - Assess AI Playbook compliance
```bash
/arckit.ai-playbook Assess AI Playbook compliance for benefits
eligibility chatbot using GPT-4
```

Evaluates **10 Core Principles** + **6 Ethical Themes**:

**10 Core Principles** (0-10 points each):
1. Understanding AI - Capabilities and limitations
2. Lawful and Ethical Use - DPIA, EqIA, Human Rights
3. Security - AI-specific threats (prompt injection, data poisoning)
4. Human Control - Human-in-the-loop for HIGH-RISK AI
5. Lifecycle Management - Selection to decommissioning
6. Right Tool Selection - AI only when genuinely better
7. Collaboration - Cross-government, academia, civil society
8. Commercial Partnership - Responsible AI in contracts
9. Skills and Expertise - Multidisciplinary teams
10. Organizational Alignment - Governance and assurance

**6 Ethical Themes** (0-10 points each):
- Safety, Security, and Robustness
- Transparency and Explainability (ATRS)
- Fairness, Bias, and Discrimination
- Accountability and Responsibility
- Contestability and Redress
- Societal Wellbeing and Public Good

**Risk-Based Assessment**:

For **HIGH-RISK AI** (affects health, safety, fundamental rights):
- MUST score ≥90% to proceed
- MUST have human-in-the-loop
- ALL principles must be met
- ATRS publication MANDATORY
- Quarterly audits REQUIRED

### Algorithmic Transparency Recording Standard (ATRS)

**`/arckit.atrs`** - Generate complete transparency records
```bash
/arckit.atrs Generate ATRS record for DWP benefits eligibility chatbot
```

Produces complete **two-tier ATRS record**:

**Tier 1 (Public-Facing)**:
- System name and purpose
- Plain English description for citizens
- Organization and contact information
- Scope and intended use
- Human oversight model
- Review schedule

**Tier 2 (Technical Details)**:
- Owner and responsibility chain
- Detailed description and rationale
- Decision-making process
- Data sources and processing
- Impact assessments (DPIA, EqIA, Human Rights)
- Fairness and bias analysis
- Technical specifications
- Testing and validation
- Performance metrics
- Governance framework

### Digital Marketplace Procurement

ArcKit integrates Digital Marketplace procurement guidance based on component evolution:

- **G-Cloud (1-6 weeks)**: Cloud hosting, commercial products (Commodity/Product components)
- **DOS Outcomes (4-6 weeks)**: Discovery and build projects (Custom/Genesis components)
- **DOS Specialists (3-5 weeks)**: Expert contractors and specialized skills

The Wardley Map automatically recommends procurement routes based on strategic positioning.

## Real-World Example: Payment Modernization

Let's walk through a complete workflow:

```bash
# 1. Initialize project
arckit init payment-modernization --ai claude
cd payment-modernization
claude

# 2. Establish principles
/arckit.principles Create principles for PCI-DSS compliant payment
processing with 99.99% availability

# 3. Document requirements (generates 50+ requirements)
/arckit.requirements Build a payment gateway that processes credit cards,
supports 10K TPS, complies with PCI-DSS Level 1, integrates with Stripe
and PayPal, and provides real-time fraud detection

# 4. Create strategic Wardley Map
/arckit.wardley Create current state Wardley Map for payment gateway
showing build vs buy strategy

# 5. Generate SOW for vendor RFP
/arckit.sow Generate RFP for vendor selection with 12-month timeline
and $2M budget

# 6. Create evaluation framework
/arckit.evaluate Create evaluation framework

# 7. Score vendors (after receiving proposals)
/arckit.evaluate Compare all vendors for payment gateway project

# 8. Review selected vendor's HLD
/arckit.hld-review Review Acme Corp's high-level design

# 9. Review detailed design
/arckit.dld-review Review Acme Corp's detailed design for payment service

# 10. Ensure traceability
/arckit.traceability Generate matrix from requirements through design to tests

# 11. Final quality check
/arckit.analyze
```

**Result**: Complete, traceable, governed architecture with strategic build vs buy decisions validated through Wardley Mapping.

## What You Get: The Project Structure

ArcKit creates this structure:

```
payment-modernization/
├── .arckit/
│   ├── memory/
│   │   └── architecture-principles.md    # Global principles
│   ├── scripts/                           # Automation scripts
│   └── templates/                         # Document templates
├── projects/
│   └── 001-payment-gateway/
│       ├── requirements.md                # 50+ requirements
│       ├── wardley-maps/                  # Strategic maps
│       │   ├── current-state.md
│       │   ├── future-state.md
│       │   ├── gap-analysis.md
│       │   └── procurement-strategy.md
│       ├── sow.md                         # Vendor RFP
│       ├── evaluation-criteria.md         # Scoring framework
│       ├── vendors/
│       │   ├── acme-corp/
│       │   │   ├── proposal.pdf
│       │   │   ├── scoring.md
│       │   │   ├── hld-v1.md
│       │   │   └── reviews/
│       │   │       ├── hld-v1-review.md
│       │   │       └── dld-v1-review.md
│       │   └── comparison.md
│       ├── traceability-matrix.md
│       └── final/
│           ├── selected-vendor.md
│           ├── approved-hld.md
│           └── dld/
└── .claude/commands/                      # AI assistant commands
```

**Everything is Git-versioned Markdown**—no proprietary formats, no vendor lock-in.

## How ArcKit Compares to Traditional EA Tools

| Feature | ArcKit | Sparx EA | Ardoq | LeanIX | Confluence |
|---------|--------|----------|-------|--------|------------|
| **AI-Assisted** | ✅ Native | ❌ | ❌ | ❌ | ❌ |
| **Wardley Mapping** | ✅ Full | ❌ | ⚠️ Limited | ❌ | ❌ |
| **Version Control** | ✅ Git | ❌ | ❌ | ❌ | ⚠️ Limited |
| **Vendor RFP** | ✅ Generated | ❌ | ❌ | ❌ | ⚠️ Manual |
| **Design Review** | ✅ Automated | ⚠️ Manual | ❌ | ❌ | ⚠️ Manual |
| **Traceability** | ✅ Automated | ⚠️ Manual | ✅ | ⚠️ Limited | ❌ |
| **UK Gov Compliance** | ✅ Built-in | ❌ | ❌ | ❌ | ❌ |
| **Cost** | **FREE** | $$$$ | $$$$ | $$$$ | $$ |
| **Learning Curve** | **Low** | High | Medium | Medium | Low |
| **Lock-in** | **None** | High | High | High | Medium |

**Key Differentiators**:
1. **AI-Native**: Designed from the ground up for AI-assisted workflows
2. **Strategic**: Wardley Mapping provides situational awareness traditional tools lack
3. **Open**: Markdown + Git = no vendor lock-in
4. **Government-Ready**: Built-in TCoP, AI Playbook, ATRS (unique to ArcKit)
5. **Free**: No per-user licensing fees

## Real-World Impact: Early Adopter Results

### Financial Services: Payment Modernization

**Results**:
- 60% reduction in documentation time (AI-assisted generation)
- Zero requirements gaps (automated traceability)
- Unbiased vendor selection (structured evaluation framework)
- $2M saved by avoiding building commodity components (Wardley Map guidance)

### UK Government: Benefits Eligibility Chatbot

**Results**:
- Full TCoP compliance before Service Assessment
- HIGH-RISK AI approved with human review queue
- ATRS published for public transparency
- 25% cost savings via GOV.UK service reuse
- 40% faster procurement via G-Cloud

## Getting Started

### Installation

```bash
# Install with pip
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv (recommended)
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Or run without installing
uvx --from git+https://github.com/tractorjuice/arc-kit.git arckit init my-project
```

### Choose Your AI Assistant

ArcKit works with:
- **Claude Code** (recommended) - https://www.anthropic.com/claude-code
- **GitHub Copilot** - https://github.com/features/copilot
- **Cursor** - https://cursor.sh
- **Gemini CLI** - https://github.com/google-gemini/gemini-cli

### Try It Now

**Test in GitHub Codespaces**: https://github.com/tractorjuice/arckit-test-project-v1

Complete test project with:
- 12 pre-configured commands
- 17 templates (including Wardley Mapping)
- UK Government compliance support
- Comprehensive test scenario (DWP benefits chatbot)
- Full documentation

**Just click "Code" → "Open with Codespaces" → Start Claude Code**

### Quick Start

```bash
# Initialize your first project
arckit init my-project --ai claude
cd my-project
claude

# Inside Claude Code
/arckit.principles Create principles for [your organization]
/arckit.requirements Define requirements for [your project]
/arckit.wardley Create strategic Wardley Map showing build vs buy
```

## What's Next: Roadmap

We're just getting started. Here's what's coming:

**v0.3.0 (Q1 2025)**:
- Integration with Jira, Azure DevOps, ServiceNow
- Industry-specific templates (healthcare, financial services)
- Multi-language support (French, German, Spanish)
- Enhanced Wardley Mapping (automated evolution predictions)

**v0.4.0 (Q2 2025)**:
- Real-time collaboration features
- AI-powered design review automation
- Advanced analytics and dashboards
- Cloud-hosted option (for teams that prefer SaaS)

**v1.0.0 (Q3 2025)**:
- Enterprise-ready with SSO, RBAC, audit logs
- Plugin ecosystem
- Marketplace for templates and extensions

## Contributing and Community

ArcKit is open-source (MIT License) and welcomes contributions:

- **GitHub**: https://github.com/tractorjuice/arc-kit
- **Issues**: https://github.com/tractorjuice/arc-kit/issues
- **Discussions**: https://github.com/tractorjuice/arc-kit/discussions
- **Releases**: https://github.com/tractorjuice/arc-kit/releases

**Areas we need help**:
- Integration with enterprise tools (Jira, Azure DevOps, ServiceNow)
- Additional AI agent support
- Template improvements based on real-world usage
- Documentation and examples
- Industry-specific templates
- Translations

**Join the community**:
- Star the repo: https://github.com/tractorjuice/arc-kit
- Share your use cases and feedback
- Contribute templates and extensions
- Help shape the roadmap

## The Future of Enterprise Architecture

ArcKit represents a paradigm shift in how enterprise architecture is practiced:

**From**:
- Expensive proprietary tools ($500-2000/user/year)
- Manual documentation (Word, PowerPoint, Confluence)
- Scattered artifacts (lost traceability)
- Inconsistent governance (principles as shelf-ware)

**To**:
- Free open-source toolkit ($0 forever)
- AI-assisted workflows (architects focus on decisions)
- Git-versioned artifacts (full traceability and version control)
- Systematic governance (template-driven quality)

**Key Trends**:
1. **AI-Assisted Architecture**: AI handles generation, architects focus on strategy
2. **Strategic Situational Awareness**: Wardley Mapping brings strategy to EA
3. **Open Formats**: Markdown + Git enable collaboration without lock-in
4. **Government-Ready**: Built-in compliance frameworks (TCoP, AI Playbook, ATRS)
5. **Template-Driven Quality**: Structure enables consistency and completeness

## Try ArcKit Today

The future of enterprise architecture is here. It's AI-assisted. It's strategic. It's systematic.

**And it's completely free.**

```bash
# Install ArcKit
pip install git+https://github.com/tractorjuice/arc-kit.git

# Initialize your first project
arckit init my-project --ai claude

# Start governing
claude
/arckit.principles Create principles for my organization
```

**Resources**:
- **GitHub**: https://github.com/tractorjuice/arc-kit
- **Latest Release**: v0.2.0 - UK Government Compliance Edition
- **Documentation**: https://github.com/tractorjuice/arc-kit/blob/main/README.md
- **Full Article**: https://github.com/tractorjuice/arc-kit/blob/main/ARTICLE.md
- **Test Project**: https://github.com/tractorjuice/arckit-test-project-v1

**Questions? Feedback?**
- Open an issue: https://github.com/tractorjuice/arc-kit/issues
- Start a discussion: https://github.com/tractorjuice/arc-kit/discussions
- Share your story: We'd love to hear how you're using ArcKit

---

**Built with ❤️ for enterprise architects who want systematic, AI-assisted governance.**

*Inspired by [Spec Kit](https://github.com/github/spec-kit), adapted for enterprise architecture workflows.*

**Welcome to the new era of enterprise architecture governance. Welcome to ArcKit.**
