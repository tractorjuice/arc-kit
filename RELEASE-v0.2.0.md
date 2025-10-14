# ArcKit v0.2.0 - UK Government Compliance Edition

**Release Date**: 2025-10-14

## 🎉 Major Features

### UK Government Framework Support

ArcKit now provides **comprehensive support for UK Government compliance frameworks**, making it the go-to toolkit for public sector enterprise architecture:

#### 🏛️ Technology Code of Practice (TCoP) - `/arckit.tcop`

Complete assessment framework for all **13 mandatory TCoP points**:

1. ✅ Define User Needs
2. ✅ Make Things Accessible and Inclusive (WCAG 2.2 AA)
3. ✅ Be Open and Use Open Source
4. ✅ Make Use of Open Standards
5. ✅ Use Cloud First
6. ✅ Make Things Secure (Cyber Essentials)
7. ✅ Make Privacy Integral (UK GDPR, DPIA)
8. ✅ Share, Reuse and Collaborate (GOV.UK services)
9. ✅ Integrate and Adapt Technology (API-first)
10. ✅ Make Better Use of Data
11. ✅ Define Your Purchasing Strategy (Digital Marketplace)
12. ✅ Make Your Technology Sustainable (carbon impact)
13. ✅ Meet the Service Standard

**Features**:
- Phase-specific guidance (Discovery, Alpha, Beta, Live)
- Scoring system (0-130 points)
- Evidence-based assessment
- Gap analysis and remediation planning
- Requirements mapping

#### 🤖 AI Playbook - `/arckit.ai-playbook`

Responsible AI deployment framework with **10 core principles + 6 ethical themes**:

**10 Core Principles** (100 points):
1. ✅ Understanding AI - Capabilities and limitations
2. ✅ Lawful and Ethical Use - DPIA, EqIA, Human Rights
3. ✅ Security - AI-specific threats (prompt injection, data poisoning)
4. ✅ Human Control - Human-in-the-loop for high-risk
5. ✅ Lifecycle Management - Selection to decommissioning
6. ✅ Right Tool Selection - AI only when genuinely better
7. ✅ Collaboration - Cross-government, academia, civil society
8. ✅ Commercial Partnership - Responsible AI in contracts
9. ✅ Skills and Expertise - Multidisciplinary teams
10. ✅ Organizational Alignment - Governance and assurance

**6 Ethical Themes** (60 points):
- Safety, Security, and Robustness
- Transparency and Explainability (ATRS)
- Fairness, Bias, and Discrimination
- Accountability and Responsibility
- Contestability and Redress
- Societal Wellbeing and Public Good

**Features**:
- Risk-based assessment (High/Medium/Low risk AI)
- Mandatory documentation tracking (ATRS, DPIA, EqIA, Human Rights)
- AI-specific security threat assessment
- Human oversight models (human-in-the-loop, human-on-the-loop)
- Go/No-Go decision framework
- Strict requirements for high-risk AI (≥90% score, ALL principles met)

#### 📋 Digital Marketplace Procurement Guide

Comprehensive guide covering all three procurement routes:

**G-Cloud Framework** (1-6 weeks):
- Cloud hosting and software (AWS, Azure, GCP)
- Quick procurement for standard services
- £100M+ annual spend

**Digital Outcomes and Specialists (DOS)** (3-6 weeks):
- Outcomes: Project delivery with deliverables
- Specialists: Day-rate contractors (£300-£1000/day)
- User research, development, architecture roles

**Crown Hosting** (last resort):
- Physical data centre hosting
- Only when cloud not feasible

**Features**:
- Step-by-step procurement workflows
- ArcKit command mapping for each route
- Evaluation frameworks tailored to Digital Marketplace
- Best practices and common pitfalls
- Compliance requirements (IR35, security clearance)

### 📚 Comprehensive Documentation

**New documentation guides** (6,000+ lines):

- **[Architecture Principles Guide](docs/principles.md)** (527 lines)
  - How to establish governance frameworks
  - Essential principle categories
  - Industry-specific examples (Financial Services, Healthcare, Government)
  - Best practices and anti-patterns

- **[Requirements Guide](docs/requirements.md)** (628 lines)
  - 5 requirement types (BR, FR, NFR, INT, DR)
  - Writing effective requirements with acceptance criteria
  - Complete workflow from stakeholder interviews to traceability

- **[Vendor Procurement Guide](docs/procurement.md)** (503 lines)
  - RFP generation and SOW creation
  - Vendor evaluation frameworks
  - Scoring and comparison methodologies
  - Best practices for fair, unbiased evaluation

- **[Design Review Guide](docs/design-review.md)** (668 lines)
  - HLD review process (architecture gate)
  - DLD review process (implementation gate)
  - Compliance checklists and quality gates
  - Decision criteria for approval/rejection

- **[Traceability Guide](docs/traceability.md)** (639 lines)
  - Requirements → Design → Implementation → Tests mapping
  - Forward and backward traceability
  - Coverage metrics and gap analysis
  - Go/no-go decision frameworks

- **[UK Government Digital Marketplace Guide](docs/uk-government-digital-marketplace.md)** (684 lines)
  - Complete guide to all three procurement frameworks
  - ArcKit integration for each route
  - Practical workflows and examples
  - Compliance and best practices

### 🎯 Templates

**New comprehensive templates** (1,500+ lines):

- **[UK Government TCoP Template](templates/uk-gov-tcop-template.md)** (718 lines)
  - Assessment structure for all 13 TCoP points
  - Evidence gathering frameworks
  - Scoring methodology (0-10 per point)
  - Phase-specific validation gates
  - Requirements mapping

- **[UK Government AI Playbook Template](templates/uk-gov-ai-playbook-template.md)** (853 lines)
  - 10 principles + 6 ethical themes assessment
  - Risk-based evaluation framework
  - Mandatory documentation checklists
  - AI-specific security threat assessment
  - Human oversight model documentation
  - Bias and fairness testing frameworks

## 📊 Statistics

- **12 files changed**
- **6,096+ lines added** of comprehensive documentation and templates
- **2 new slash commands** (`/arckit.tcop`, `/arckit.ai-playbook`)
- **6 new comprehensive guides**
- **2 new assessment templates**
- **100% coverage** of UK Government compliance frameworks

## 🎯 Use Cases

### Central Government Departments

```bash
# Initialize project for government department
arckit init digital-service-modernization --ai claude
cd digital-service-modernization
claude

# Assess Technology Code of Practice compliance
/arckit.tcop Assess TCoP compliance for HMRC tax filing in Beta phase

# Assess AI Playbook compliance for AI system
/arckit.ai-playbook Assess AI Playbook compliance for benefits eligibility chatbot

# Generate requirements aligned with TCoP
/arckit.requirements Define requirements for GOV.UK service with WCAG 2.2 AA

# Procure via Digital Marketplace
/arckit.sow Generate SOW for G-Cloud procurement of AWS hosting

# Evaluate vendors from Digital Marketplace
/arckit.evaluate Create evaluation framework for G-Cloud suppliers
```

### Local Authorities

```bash
# TCoP assessment for local council
/arckit.tcop Assess TCoP for council tax payment system in Alpha phase

# Digital Marketplace procurement
/arckit.sow Generate DOS Outcomes SOW for digital transformation project
```

### NHS and Health

```bash
# AI Playbook assessment for healthcare AI
/arckit.ai-playbook Assess AI compliance for diagnostic AI system (HIGH-RISK)

# TCoP with healthcare-specific requirements
/arckit.requirements Define requirements for NHS patient portal with IG Toolkit
```

## 🔧 What's Changed

### Added

- **Command**: `/arckit.tcop` - Technology Code of Practice assessment
- **Command**: `/arckit.ai-playbook` - AI Playbook compliance assessment
- **Template**: `templates/uk-gov-tcop-template.md` - TCoP assessment structure
- **Template**: `templates/uk-gov-ai-playbook-template.md` - AI Playbook assessment structure
- **Guide**: `docs/principles.md` - Architecture Principles Guide
- **Guide**: `docs/requirements.md` - Requirements Guide
- **Guide**: `docs/procurement.md` - Vendor Procurement Guide
- **Guide**: `docs/design-review.md` - Design Review Guide
- **Guide**: `docs/traceability.md` - Traceability Guide
- **Guide**: `docs/uk-government-digital-marketplace.md` - Digital Marketplace Guide

### Updated

- **README.md**: Added comprehensive UK Government support section
- **README.md**: Added TCoP and AI Playbook to commands table
- **README.md**: Added UK Government example workflows
- **README.md**: Added "Built-in UK Government Support" section with compliance features

## 🎓 Learning Resources

All guides include:
- ✅ Real-world examples
- ✅ Step-by-step workflows
- ✅ Best practices and anti-patterns
- ✅ Common pitfalls to avoid
- ✅ Integration with ArcKit commands
- ✅ Industry-specific guidance

## 🚀 Migration from v0.1.0

No breaking changes. All v0.1.0 commands and workflows continue to work.

**New capabilities**:
- Run `/arckit.tcop` for Technology Code of Practice assessment
- Run `/arckit.ai-playbook` for AI Playbook compliance
- Consult new documentation guides in `docs/` directory
- Use new UK Government templates in `templates/` directory

## 📦 Installation

```bash
# Install latest version
pip install git+https://github.com/tractorjuice/arc-kit.git

# Or with uv
uv tool install arckit-cli --from git+https://github.com/tractorjuice/arc-kit.git

# Or run without installing
uvx --from git+https://github.com/tractorjuice/arc-kit.git arckit init my-project
```

## 🙏 Acknowledgements

This release is built on guidance from:
- [UK Government Technology Code of Practice](https://www.gov.uk/guidance/the-technology-code-of-practice)
- [UK Government AI Playbook](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government)
- [UK Government Digital Marketplace](https://www.digitalmarketplace.service.gov.uk/)
- [Algorithmic Transparency Recording Standard (ATRS)](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard)
- [GDS Service Manual](https://www.gov.uk/service-manual)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

**Full Changelog**: https://github.com/tractorjuice/arc-kit/compare/v0.1.0...v0.2.0
