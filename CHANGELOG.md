# Changelog

All notable changes to ArcKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2025-10-21

### Changed

- **BREAKING CHANGE: MOD Secure by Design - RMADS Removed**:
  - `/arckit.mod-secure` updated to align with current MOD framework (August 2023)
  - RMADS (Risk Management and Accreditation Documentation Set) REMOVED
  - Point-in-time accreditation process REPLACED with continuous assurance
  - **CAAT** (Cyber Activity and Assurance Tracker): Self-assessment tool now mandatory
    - All programmes must register on CAAT in Discovery/Alpha
    - Based on 7 SbD Principles question sets
    - Continuously updated throughout lifecycle (not one-time submission)
    - Available through MOD Secure by Design portal (DefenceGateway account)
  - **New Roles**:
    - Delivery Team Security Lead (DTSL): Owns security (First Line of Defence)
    - Security Assurance Coordinator (SAC): Supports DTSL
    - IAO/IAA roles replaced/redefined
  - **Terminology Changes**:
    - "Accreditation" → "Continuous assurance"
    - "Accreditation blockers" → "Deployment blockers"
    - "RMADS documentation submitted" → "CAAT self-assessment completed"
    - "Accreditation approval" → "Security governance review"
  - Supplier attestation required for vendor-delivered systems (ISN 2023/10)
  - SROs and capability owners accountable (not delegated to accreditation authority)
  - Cyber security is a "licence to operate" - cannot be traded out

- **Enhanced Analysis Command**:
  - `/arckit.analyze` updated to analyze all artifacts from v0.2.1-v0.3.1
  - **New Detection Passes**:
    - **E. Stakeholder Traceability Analysis** (if stakeholder-drivers.md exists):
      - Requirements traced to stakeholder goals
      - Orphan requirements (not linked to stakeholder goals)
      - Requirement conflicts documented and resolved
      - RACI governance alignment (risk owners, data owners from RACI)
    - **F. Risk Management Analysis** (if risk-register.md exists):
      - High/Very High risks have mitigation in requirements/design
      - Risk owners aligned with RACI matrix
      - Risk-SOBC alignment (strategic risks, financial risks in Economic Case)
      - Risk-requirements alignment (mitigation actions to requirements)
    - **G. Business Case Alignment** (if sobc.md exists):
      - Benefits traced to stakeholder goals and requirements
      - Benefits measurable and verifiable
      - Option analysis quality (Do Nothing baseline, build vs buy)
      - SOBC-requirements alignment (drivers, benefits, budget, delivery)
      - SOBC-risk alignment (risks in Management Case Part E)
    - **H. Data Model Consistency** (if data-model.md exists):
      - DR-xxx requirements mapped to entities
      - Data model-design alignment (schemas match entities, CRUD aligns)
      - Data governance alignment (owners from RACI, PII identified, GDPR)
      - Data model quality (ERD renderable, complete specs, relationships)
    - **J. MOD Secure by Design Compliance** (if mod-secure-by-design.md exists):
      - 7 SbD Principles assessment
      - NIST CSF coverage (Identify, Protect, Detect, Respond, Recover)
      - CAAT continuous assurance process (registration, self-assessment)
      - Three Lines of Defence implementation
      - Supplier attestation (ISN 2023/10)
      - Classification-specific requirements
  - **Enhanced Report Structure**:
    - Stakeholder Traceability Analysis section
    - Risk Management Analysis section
    - Business Case Analysis section
    - Data Model Analysis section
    - MOD Secure by Design Analysis section (separate from UK Gov TCoP)
  - **New Severity Criteria**:
    - CRITICAL: Orphan requirements, high/very high risks unmitigated, benefits not traced, DR-xxx unmapped, PII not identified, CAAT not registered
    - HIGH: Conflicts unresolved, medium risks unmitigated, benefits not measurable, schema mismatch, SbD gaps
    - MEDIUM: Missing stakeholder/risk/SOBC/data-model artifacts (recommended)
  - **Updated Metrics Dashboard**:
    - Stakeholder traceability score
    - Risk management score
    - Business case score
    - Data model score
    - MOD SbD score (separate from UK Gov compliance)

### Documentation

- Updated MOD Secure by Design command documentation with:
  - CAAT continuous assurance process
  - ISN 2023/09 and ISN 2023/10 references
  - JSP 453 Digital Policies
  - https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design
- Updated analysis command documentation with new detection passes and report sections
- Deployed to all 7 test repositories

### Resources

- MOD Secure by Design portal: https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design
- Launched 28 July 2023, mandatory from August 2023
- Replaces point-in-time accreditation with continual assurance

## [0.3.1] - 2025-10-21

### Added
- **Data Modeling Command**: `/arckit.data-model` for comprehensive data modeling with ERD, GDPR compliance, and data governance
  - Visual Entity-Relationship Diagram (ERD) using Mermaid syntax
  - Detailed entity catalog (E-001, E-002, etc.) with attributes, types, validation rules
  - PII identification and GDPR/DPA 2018 compliance (retention, erasure, subject access rights)
  - Data governance matrix (business owners from stakeholder RACI, stewards, custodians)
  - CRUD matrix showing which components Create/Read/Update/Delete each entity
  - Data integration mapping (upstream sources, downstream consumers)
  - Sector-specific compliance (PCI-DSS for payments, HIPAA for health, FCA for finance, Government classifications)
  - Data quality framework with measurable metrics (accuracy, completeness, consistency, timeliness, uniqueness)
  - Complete traceability: DR-xxx requirements → Entities → Attributes → Stakeholders
- `templates/data-model-template.md` (720 lines) - Comprehensive data modeling template
- `.claude/commands/arckit.data-model.md` - Data modeling command specification
- `.codex/prompts/arckit.data-model.md` - Data modeling command for OpenAI Codex CLI

### Changed
- **WORKFLOW UPDATE**: Data modeling now positioned after requirements, before vendor selection
  - Old workflow: Requirements → SOW → Vendor selection
  - New workflow: Requirements → **Data Model** → SOW → Vendor selection
- Total command count increased from 19 to 20

### Documentation
- Updated `README.md`:
  - Added Phase 5.5: Data Modeling
  - Updated feature list to include data modeling, risk management, and SOBC
  - Added data-model to Core Commands table
  - Updated payment gateway example workflow to include data modeling step
  - Updated project structure to include data-model.md
  - Renumbered subsequent phases (6→7, 7→8, 8→9, 9→10)
- Updated `.claude/COMMANDS.md`:
  - Added section 6 for `/arckit.data-model`
  - Renumbered subsequent sections (6→7, 7→8, 8→9, 9→10, 10→11)
  - Updated workflow overview and best practices
  - Updated common patterns to include data modeling
- Updated `.codex/README.md`:
  - Added Phase 5.5: Data Model
  - Updated to v0.3.1 with 20 commands
  - Updated file structure to show data-model files
- Deployed to all 7 test repositories

### Integration
- Data model integrates with:
  - **Input**: Requires `requirements.md` (extracts DR-xxx Data Requirements)
  - **Input**: Uses `stakeholder-drivers.md` (for data ownership RACI matrix)
  - **Input**: References `sobc.md` (for data-related costs and benefits)
  - **Output**: Feeds into `/arckit.hld-review` (validates database technology choices)
  - **Output**: Feeds into `/arckit.dld-review` (validates schema design, indexes, query patterns)
  - **Output**: Supports `/arckit.traceability` (DR-xxx → Entity → Attribute → HLD Component)

## [0.3.0] - 2025-10-21

### Added
- **Strategic Outline Business Case (SOBC) Command**: `/arckit.sobc` implementing HM Treasury Green Book 5-case model
  - Strategic Case: Problem, drivers, stakeholder goals, scope
  - Economic Case: Options analysis (Do Nothing, Minimal, Balanced, Comprehensive), benefits mapping, NPV, ROI
  - Commercial Case: Procurement strategy, Digital Marketplace routes (UK Gov)
  - Financial Case: Budget, TCO, affordability, Value for Money
  - Management Case: Governance, delivery, change management, benefits realization, risk management
- **Risk Management Command**: `/arckit.risk` implementing HM Treasury Orange Book 2023 framework
  - Part I: 5 Risk Management Principles (Governance, Integration, Collaboration, Risk Processes, Continual Improvement)
  - Part II: Risk Control Framework (4-pillar structure)
  - 6 risk categories: Strategic, Operational, Financial, Compliance, Reputational, Technology
  - 4Ts response framework: Tolerate, Treat, Transfer, Terminate
  - 5×5 risk matrix: Inherent vs Residual risk (Likelihood × Impact)
  - Complete stakeholder integration (risk owners from RACI matrix)
  - Risk appetite compliance monitoring
- `templates/sobc-template.md` (1,012 lines) - Comprehensive Green Book 5-case business case template
- `templates/risk-register-template.md` (900 lines) - Comprehensive Orange Book risk register template
- `.codex/prompts/arckit.sobc.md` - SOBC command for OpenAI Codex CLI
- `.codex/prompts/arckit.risk.md` - Risk command for OpenAI Codex CLI

### Changed
- **CRITICAL WORKFLOW CHANGE**: Risk assessment and business case now come BEFORE requirements
  - Old workflow: Principles → Stakeholders → Requirements
  - New workflow: Principles → Stakeholders → **Risk** → **SOBC** → Requirements
- Updated `/arckit.requirements` to reference SOBC approval as prerequisite
- Enhanced SOBC to use risk register for:
  - Strategic Case urgency ("Why Now?" uses strategic risks)
  - Economic Case risk-adjusted costs (optimism bias from risk scores)
  - Management Case Part E (full risk register included)
  - Recommendation (high-risk profile influences option selection)
- Total command count increased from 17 to 19

### Documentation
- Updated `README.md`:
  - Added Phase 3: Risk Assessment
  - Added Phase 4: Business Case Justification (SOBC)
  - Renumbered all subsequent phases
  - Added risk and SOBC to Core Commands table
  - Updated payment gateway example workflow
  - Updated project structure to include risk-register.md and sobc.md
- Updated `.claude/COMMANDS.md`:
  - Added section 3: Risk Management (Orange Book) - 220+ lines
  - Added section 4: Strategic Outline Business Case (SOBC)
  - Renumbered all subsequent sections (requirements=5, sow=6, evaluate=7, hld=8, dld=9, traceability=10)
  - Updated workflow overview
  - Updated Best Practices to include risk and SOBC
  - Updated Common Patterns examples
  - Updated file structure reference
- Updated `.codex/README.md`:
  - Added Phase 3: Risk Assessment (NEW - v0.3.0)
  - Added Phase 4: Business Case (updated from v0.2.3)
  - Renumbered subsequent phases
  - Added Orange Book and Green Book framework overviews
  - Documented SOBC-risk integration
- Deployed to all 7 test repositories:
  - arckit-test-project-v0-mod-chatbot
  - arckit-test-project-v1-m365
  - arckit-test-project-v2-hmrc-chatbot
  - arckit-test-project-v3-windows11
  - arckit-test-project-v4
  - arckit-test-project-v5
  - arckit-test-project-v6-patent-system

### UK Government Compliance
- **Green Book Compliance**: Full 5-case business case model for investment appraisal
  - Options analysis with do-nothing baseline
  - Benefits mapping to stakeholder goals
  - Digital Marketplace procurement routes
  - Social value (minimum 10% weighting)
  - Green Book discount rates (3.5% standard)
  - Optimism bias adjustment from risk assessment
  - Whole-life costs (3-year TCO)
- **Orange Book Compliance**: Comprehensive risk management framework
  - Systematic risk identification (6 categories)
  - Inherent vs Residual risk assessment
  - 4Ts response framework (Tolerate, Treat, Transfer, Terminate)
  - Risk appetite and tolerance monitoring
  - Risk ownership from stakeholder RACI matrix
  - Continual improvement and monitoring framework
- UK-specific risks included:
  - Strategic: Policy/ministerial changes, machinery of government, parliamentary scrutiny
  - Compliance: HMT spending controls, NAO audits, PAC scrutiny, FOI, judicial review
  - Reputational: Media scrutiny, citizen complaints, select committees
  - Operational: GDS Service Assessment, CDDO controls, security clearances

### Integration
- Complete traceability chain: Stakeholder → Driver → Goal → Risk → Benefit → Requirement
- Risk register feeds into SOBC Management Case Part E
- Financial risks inform Economic Case cost contingency (optimism bias)
- Strategic risks demonstrate urgency in Strategic Case
- Stakeholder RACI matrix provides risk owners
- Risk appetite compliance enables go/no-go decisions

### Bug Fixes
- Fixed command ordering in `.claude/COMMANDS.md` (stakeholders correctly positioned before risk/SOBC)
- Improved documentation commit messages for clarity
- Corrected workflow documentation alignment across all files

## [0.2.2] - 2025-10-20

### Added
- **OpenAI Codex CLI Support**: Complete `.codex/` folder structure with 17 prompts for OpenAI Codex CLI users
- `.codex/README.md` - Comprehensive 400+ line setup guide for Codex CLI
- `OPENAI-INTEGRATION-PLAN.md` - Integration strategy document comparing Codex CLI to alternative approaches
- Codex CLI support deployed to all 7 test repositories
- All ArcKit commands now available with `/prompts:arckit.*` format for Codex CLI users

### Changed
- Updated `README.md` to list OpenAI Codex CLI as supported AI agent
- Updated `.codex/README.md` version to v0.2.2
- Added Codex CLI usage examples throughout documentation
- Supported AI agents increased from 4 to 5 (added Codex CLI)

### Documentation
- Created `RELEASE-v0.2.2.md` with complete release notes
- Updated `RELEASE-ANNOUNCEMENT.md` to v0.2.2
- Updated version references throughout documentation

## [0.2.1] - 2025-10-19

### Added
- **Stakeholder Analysis Command**: `/arckit.stakeholders` for comprehensive stakeholder driver analysis
- `templates/stakeholder-drivers-template.md` (400+ lines) - Stakeholder analysis template with:
  - Power-Interest Grid for stakeholder identification
  - 7 types of drivers (STRATEGIC, OPERATIONAL, FINANCIAL, COMPLIANCE, PERSONAL, RISK, CUSTOMER)
  - Driver → Goal → Outcome traceability mapping
  - Conflict analysis and resolution framework
  - RACI matrix for governance
  - Engagement plan templates
- **Conflict Resolution Framework** in requirements workflow:
  - Systematic identification of conflicting requirements
  - Trade-off analysis tables
  - 4 resolution strategies (PRIORITIZE, COMPROMISE, PHASE, INNOVATE)
  - Stakeholder management documentation (who won/lost)
  - Decision authority tracking

### Changed
- **CRITICAL WORKFLOW CHANGE**: Stakeholder analysis now comes **BEFORE** requirements
  - Old workflow: Principles → Requirements → Design
  - New workflow: Principles → **Stakeholders** → Requirements → Design
- Enhanced `/arckit.requirements` command to:
  - Check for stakeholder analysis first (recommends `/arckit.stakeholders` if missing)
  - Trace requirements back to stakeholder goals
  - Identify requirement conflicts stemming from stakeholder conflicts
  - Document conflict resolutions with stakeholder impact
- Updated `templates/requirements-template.md` with:
  - "Requirement Conflicts & Resolutions" section
  - Stakeholder traceability references
  - 6 common conflict patterns with example resolutions

### Documentation
- Updated `README.md` workflow to show stakeholders before requirements
- Updated `.claude/COMMANDS.md` with stakeholder analysis step
- Updated all 7 test repositories with:
  - New `/arckit.stakeholders` command
  - Enhanced requirements template
  - Updated README files showing 17 total commands

## [0.2.0] - 2025-10-14

### Added
- **UK Government Compliance Support**: Comprehensive support for UK Government frameworks
- `/arckit.tcop` - Technology Code of Practice assessment (13 mandatory points)
- `/arckit.ai-playbook` - AI Playbook compliance assessment (10 principles + 6 ethical themes)
- `/arckit.atrs` - Algorithmic Transparency Recording Standard assessment
- `/arckit.mod-secure` - MOD Secure by Design review (JSP 440, IAMM)
- `templates/uk-gov-tcop-template.md` (718 lines) - TCoP assessment structure
- `templates/uk-gov-ai-playbook-template.md` (853 lines) - AI Playbook assessment structure
- `templates/uk-gov-atrs-template.md` - ATRS transparency documentation
- `templates/mod-secure-by-design-template.md` - MOD security review template

### Documentation (6,000+ lines added)
- `docs/principles.md` (527 lines) - Architecture Principles Guide
- `docs/requirements.md` (628 lines) - Requirements Guide
- `docs/procurement.md` (503 lines) - Vendor Procurement Guide
- `docs/design-review.md` (668 lines) - Design Review Guide
- `docs/traceability.md` (639 lines) - Traceability Guide
- `docs/uk-government-digital-marketplace.md` (684 lines) - Digital Marketplace Guide

### Changed
- Updated `README.md` with UK Government support section
- Added UK Government example workflows
- Updated supported commands from 7 to 14

## [0.1.0] - 2025-10-13

### Added
- Initial release of ArcKit
- `/arckit.principles` - Create architecture principles
- `/arckit.requirements` - Define comprehensive requirements
- `/arckit.wardley` - Create Wardley Maps for strategic planning
- `/arckit.diagram` - Generate architecture diagrams with Mermaid
- `/arckit.sow` - Generate Statement of Work for RFPs
- `/arckit.evaluate` - Create vendor evaluation frameworks
- `/arckit.hld-review` - Review High-Level Design
- `/arckit.dld-review` - Review Detailed Design
- `/arckit.secure` - UK Government Secure by Design review
- `/arckit.traceability` - Generate requirements traceability matrix
- `/arckit.analyze` - Analyze architecture complexity
- `/arckit.servicenow` - Export to ServiceNow CMDB

### Templates
- `templates/architecture-principles-template.md`
- `templates/requirements-template.md`
- `templates/wardley-map-template.md`
- `templates/architecture-diagram-template.md`
- `templates/sow-template.md`
- `templates/evaluation-criteria-template.md`
- `templates/vendor-scoring-template.md`
- `templates/hld-review-template.md`
- `templates/dld-review-template.md`
- `templates/ukgov-secure-by-design-template.md`
- `templates/traceability-matrix-template.md`

### CLI Tool
- `arckit init` command to bootstrap new projects
- Support for Claude Code, GitHub Copilot, Cursor, and Gemini CLI
- Bash and PowerShell script support

### Documentation
- Comprehensive README.md with examples
- Quick start guide
- Agent compatibility matrix

---

## Release Links

- [v0.3.1](https://github.com/tractorjuice/arc-kit/releases/tag/v0.3.1) - Data Modeling with ERD, GDPR Compliance, and Data Governance
- [v0.3.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.3.0) - Green Book & Orange Book Edition (SOBC + Risk Management)
- [v0.2.2](https://github.com/tractorjuice/arc-kit/releases/tag/v0.2.2) - OpenAI Codex CLI Support & Enhanced Stakeholder Analysis
- [v0.2.1](https://github.com/tractorjuice/arc-kit/releases/tag/v0.2.1) - Stakeholder Analysis & Conflict Resolution
- [v0.2.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.2.0) - UK Government Compliance Edition
- [v0.1.0](https://github.com/tractorjuice/arc-kit/releases/tag/v0.1.0) - Initial Release

---

## Version Numbering

ArcKit follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Incompatible API changes or breaking workflow changes
- **MINOR** version (0.X.0): New features added in a backward-compatible manner
- **PATCH** version (0.0.X): Backward-compatible bug fixes and documentation updates

**Examples**:
- v0.1.0 → v0.2.0: Added UK Government support (new features)
- v0.2.0 → v0.2.1: Added stakeholder analysis (new feature)
- v0.2.1 → v0.2.2: Added Codex CLI support (new feature)
- v0.2.2 → v0.3.0: Added Green Book SOBC + Orange Book risk management (significant new features)
- v0.3.0 → v0.3.1: Added data modeling command (new feature)
- Future v0.3.1 → v0.3.2: Bug fixes only (patch)
- Future v0.3.x → v1.0.0: Breaking changes to workflow or API (major)
