# Changelog

All notable changes to ArcKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Future v0.2.2 → v0.2.3: Bug fixes only (patch)
- Future v0.2.x → v1.0.0: Breaking changes to workflow or API (major)
