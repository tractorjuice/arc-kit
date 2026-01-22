# Changelog

All notable changes to ArcKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.11.0] - 2026-01-22

### Added

- **New Command**: `/arckit.pages` (40th ArcKit command) - Generate GitHub Pages documentation site
  - **Auto-Discovery**: Scans repository for all known ArcKit artifacts across all projects
  - **Document Categories**: Discovery, Planning, Architecture, Governance, Compliance, Operations, Procurement, Diagrams, Decisions
  - **Mermaid Support**: Auto-renders all Mermaid diagrams (flowcharts, sequence, C4, ERD, Gantt, state, class)
  - **GOV.UK Styling**: Professional government design system (GOV.UK Frontend 5.13.0)
  - **Manifest Generation**: Creates `docs/manifest.json` for programmatic access to document index
  - **Hash-Based Routing**: Shareable URLs to specific documents (`#projects/001-name/requirements.md`)
  - **Mobile Responsive**: Works on all screen sizes with collapsible sidebar
  - **Lazy Loading**: Documents fetched on demand with in-memory caching
  - **Template**: `pages-template.html` - Full HTML/CSS/JS single-page application
  - **Guide**: `docs/guides/pages.md` - Usage guide with workflow and setup instructions
  - **Workflow Position**: Tier 12: Documentation Publishing (utility command)
  - **Use Cases**: Project documentation portals, architecture documentation sites, stakeholder communication

- **Command Guides**: Added 21 comprehensive guides for complete command coverage
  - All 40 commands now have dedicated playbooks in `docs/guides/`
  - Each guide includes: inputs, command usage, outputs, workflow position, review checklist, key principles
  - Guides for: ai-playbook, analyze, atrs, backlog, data-mesh-contract, devops, dld-review, dos, dpia, evaluate, finops, gcloud-clarify, gcloud-search, hld-review, jsp-936, mlops, mod-secure, operationalize, pages, platform-design, servicenow

### Changed

- **Documentation Site**: Enhanced `docs/index.html` with interactive features
  - Added Mermaid.js for workflow diagram rendering
  - Made Command and Status columns sticky for better navigation
  - Reduced table row height with tighter padding
  - Expanded example links to show multiple test projects per command
  - Changed workflow diagram to vertical layout for better readability

- **Dependency Matrix**: Updated to include pages command
  - Added pages column with Recommended (R) dependencies on all document-producing commands
  - Added Tier 12: Documentation Publishing
  - Total commands: 40

### Fixed

- Mermaid diagram syntax for cross-subgraph connections
- DOS and G-Cloud commands status changed to experimental
- Missing example links in command reference tables

## [0.10.0] - 2026-01-21

### Added

- **New Command**: `/arckit.finops` (39th ArcKit command) - Create FinOps strategy for cloud financial management
  - **Cost Visibility**: Tagging strategy, cost allocation, reporting cadence, dashboards
  - **Cost Optimization**: Rightsizing, reserved instances/savings plans, spot instances, storage tiering
  - **Commitment Management**: RI/SP inventory, utilization tracking, purchase recommendations
  - **Showback/Chargeback**: Allocation methodology, unit economics, internal billing processes
  - **Budgeting & Forecasting**: Budget types, alert thresholds, forecasting methodology
  - **Anomaly Detection**: Alert configuration, investigation workflow, escalation matrix
  - **Governance**: Cloud policies, approval workflows, exception processes
  - **Sustainability**: Carbon footprint visibility, green region preferences, sustainable practices
  - **UK Government Context**: Cabinet Office spend controls, Treasury Green Book, G-Cloud tracking
  - **Template**: `finops-template.md` (800+ lines) with 16 comprehensive sections
  - **Workflow Position**: Run AFTER /arckit.devops (Tier 8: Operations)
  - **Use Cases**: Cloud cost management, FinOps maturity assessment, cost optimization initiatives

- **New Command**: `/arckit.operationalize` (36th ArcKit command) - Create operational readiness pack for production services
  - **SRE Best Practices**: SLIs, SLOs, error budgets, golden signals monitoring
  - **Support Model**: Tiered support (L1/L2/L3), escalation procedures, on-call rotations
  - **Runbook Library**: 6 detailed runbooks (startup, shutdown, backup/restore, incident response, scaling, failover)
  - **DR/BCP**: Disaster recovery procedures, business continuity planning, RTO/RPO targets
  - **Operational Handover**: Knowledge transfer, training materials, handover checklists
  - **UK Government Context**: Service Standard operations alignment, NCSC CAF operational security
  - **Template**: `operationalize-template.md` (1,000+ lines) with 17 comprehensive sections
  - **Workflow Position**: Run AFTER /arckit.servicenow (Tier 8: Operations)
  - **Use Cases**: Production readiness, operations handover, SRE implementation, support model design

- **New Command**: `/arckit.devops` (35th ArcKit command) - Create comprehensive DevOps strategy
  - **CI/CD Pipeline Design**: Build automation, testing strategy, quality gates, artifact management
  - **Infrastructure as Code**: Terraform/Pulumi/CloudFormation patterns, module structure, state management
  - **Container Strategy**: Docker, container registries, image scanning, orchestration (Kubernetes/ECS)
  - **GitOps**: ArgoCD/Flux patterns, deployment strategies (blue-green, canary, rolling)
  - **DevSecOps**: Shift-left security, SAST/DAST/SCA integration, compliance as code
  - **Developer Experience**: Local development, devcontainers, inner loop optimization, self-service
  - **DORA Metrics**: Deployment frequency, lead time, MTTR, change failure rate tracking
  - **UK Government Context**: Cloud First (TCoP Point 5), open standards, Digital Marketplace compatibility
  - **Template**: `devops-template.md` (1,200+ lines) with 17 comprehensive sections
  - **Workflow Position**: Run AFTER /arckit.servicenow (Tier 8: Operations)

- **New Command**: `/arckit.mlops` (34th ArcKit command) - Create MLOps strategy for AI/ML projects
  - **Model Lifecycle**: Training, serving, monitoring, retirement workflows
  - **Training Pipeline**: Experiment tracking, hyperparameter optimization, model versioning
  - **Feature Engineering**: Feature stores, data versioning, feature quality checks
  - **Model Registry**: Model storage, metadata, approval workflow, promotion stages
  - **Model Monitoring**: Data drift, concept drift, performance degradation, fairness monitoring
  - **Retraining Strategy**: Automated triggers, champion-challenger deployment, rollback procedures
  - **LLM/GenAI Operations**: Prompt management, guardrails, token monitoring, RAG pipelines
  - **Responsible AI**: Bias detection, explainability (SHAP/LIME), human oversight mechanisms
  - **UK Government Context**: AI Playbook principles, ATRS compliance, JSP 936 for MOD projects
  - **Template**: `mlops-template.md` (1,100+ lines) with 15 comprehensive sections
  - **Workflow Position**: Run AFTER /arckit.devops for AI projects (Tier 8: Operations)

- **New Command**: `/arckit.platform-design` (33rd ArcKit command) - Design multi-sided platforms using Platform Design Toolkit (PDT) methodology
  - **8 PDT Canvases**: Ecosystem Canvas, Entity-Role Portraits, Motivations Matrix, Transactions Board, Learning Engine Canvas, Platform Experience Canvas, MVP Canvas, Platform Design Canvas
  - **Platform Economics**: Transaction cost reduction analysis (search, information, negotiation, coordination, enforcement costs)
  - **Network Effects**: Same-side, cross-side, data, and learning network effects for defensibility
  - **Auto-Population**: Extracts stakeholders → entity portraits, requirements → platform capabilities, Wardley maps → build vs buy, principles → governance
  - **Ecosystem Mapping**: Supply side, demand side, supporting entities with Mermaid relationship diagrams
  - **Entity Portraits**: 3-5 detailed portraits with context, performance pressures, goals, gains (pain relievers, gain creators)
  - **Motivations Matrix**: Cross-entity synergies and conflicts with mitigation strategies
  - **Transactions Board**: 10-20 transactions with cost analysis, data flows, platform services that reduce each cost
  - **Learning Engine**: 5+ services that help ecosystem participants improve (data sources, feedback loops, network learning effects)
  - **Platform Experience**: 2+ journey maps (onboarding, transaction, touchpoints, emotions, business model, unit economics)
  - **MVP Canvas**: Assumption-risk matrix, minimum feature set, liquidity bootstrapping strategy, validation metrics
  - **Liquidity Bootstrapping**: Solves chicken-and-egg problem (seed supply, incentivize demand, staged rollout, validation strategy)
  - **UK Government Context**: Government as a Platform (GaaP), TCoP Point 8 (share/reuse/collaborate), Digital Marketplace integration
  - **Template**: `platform-design-template.md` (1,800+ lines) with all 8 canvases, comprehensive PDT methodology
  - **Guide**: `docs/guides/platform-design.md` - What is PDT, when to use, 8 canvas explanations, GaaP context, examples, common pitfalls
  - **Workflow Position**: Run AFTER /arckit.requirements (Tier 3.5: Strategic Planning), BEFORE detailed design (Tier 4)
  - **Use Cases**: Government as a Platform services, data marketplaces, multi-sided platforms, NHS appointment booking, training marketplaces
  - **Based on**: Platform Design Toolkit v2.2.1 from Boundaryless.io (CC-BY-SA license)

### Changed

### Fixed

### Removed

## [0.9.1] - 2025-11-12

### Added

- **Document Control Standard**: New reference in `docs/templates/document-control.md` plus README cross-links so every command references the same metadata expectations (Document ID, classification, review cadence, distribution, revision history, etc.).
- **Guides**: Added roadmap and ADR playbooks under `docs/guides/` to document the new workflows released in 0.9.0 and highlight where document control fits in those processes.

### Changed

- **Template Alignment**: All Markdown templates in `.arckit/templates/` now share the canonical Document Control table and revision history format, with doc-specific fields (e.g., ADR Number, Financial Years) appended below the standard block.
- **Command Updates**: Claude/Codex/Gemini instructions explicitly reference the new standard, require `generate-document-id.sh`, and ensure commands populate metadata before writing body content.
- **Dynamic Version Metadata**: `/arckit.sobc` and `/arckit.service-assessment` prompts (for every agent) read `.arckit/VERSION` so generated artifacts always show the current ArcKit release.
- **Docs Refresh**: README, docs index, workflow diagrams, dependency matrix, and command references updated to advertise v0.9.1 as the latest release.

### Fixed

- **Version Drift**: Removed remaining hardcoded `v0.9.0` strings so prompts either reference `.arckit/VERSION` or historical sections only.

## [0.9.0] - 2025-01-06

### Added

- **New Command**: `/arckit.data-mesh-contract` (32nd ArcKit command) - Create federated data product contracts for mesh architectures
  - **ODCS Compliance**: Open Data Contract Standard v3.0.2 with full YAML export
  - **10 Core Sections**: Fundamentals, Schema, Data Quality, SLA, Access Methods, Security, Governance, Consumer Obligations, Pricing, Infrastructure
  - **Auto-Population**: Extracts entities from data-model.md (→ objects), DR-xxx requirements (→ quality rules), NFR-xxx (→ SLA targets), stakeholders (→ ownership roles)
  - **Schema Management**: Semantic versioning (MAJOR.MINOR.PATCH), breaking change policy with 90-day notice, backward compatibility guarantees
  - **Data Quality**: ODCS-compatible automated rules (null_check, uniqueness, referential_integrity, regex, range) executable by data quality engines
  - **SLA Commitments**: Availability (99.9%), response time (p95 <200ms), freshness (<5min), retention policies
  - **Access Methods**: REST API, GraphQL, SQL query, data lake, event streams with authentication, rate limits, consumer onboarding
  - **GDPR Compliance**: PII inventory, legal basis, data subject rights, cross-border transfers, DPIA integration, audit logging
  - **Federated Governance**: Change management (minor 7-day notice, major 90-day notice), quarterly reviews, deprecation policy
  - **Consumer Obligations**: Attribution, usage constraints, quality feedback, security requirements
  - **UK Government Context**: Technology Code of Practice alignment, National Data Strategy pillars, Data Quality Framework (5 dimensions)
  - **Template**: `data-mesh-contract-template.md` (1,100+ lines) with 16 sections, ODCS YAML export, comprehensive guidance
  - **Guide**: `docs/guides/data-mesh-contract.md` - What is data mesh, domain ownership, data as product, computational governance
  - **Workflow Position**: Run AFTER /arckit.data-model (entities → objects) and /arckit.requirements (DR-xxx → quality rules)
  - **Use Cases**: Data mesh architectures, federated data ownership, data product management, multi-domain data sharing, self-serve analytics

- **New Command**: `/arckit.dpia` (30th ArcKit command) - Generate Data Protection Impact Assessment for UK GDPR Article 35 compliance
  - **ICO 9-Criteria Screening**: Automated assessment (evaluation, automated decisions, monitoring, sensitive data, large scale, dataset matching, vulnerable subjects, innovative tech, rights prevention)
  - **Auto-Population**: Extracts entities, PII, special category data from data-model.md; processing purposes from requirements.md; data subjects from stakeholder-drivers.md
  - **Risk Assessment**: Focus on impact on individuals (privacy harm, discrimination, physical harm, financial loss), not organizational risk
  - **Likelihood × Severity Matrix**: Remote/Possible/Probable × Minimal/Significant/Severe = Low/Medium/High risk
  - **Risk Register Integration**: Bidirectional links with DPIA-xxx risk IDs in risk register
  - **Mitigation Extraction**: Links security controls from secure-by-design-assessment.md as DPIA mitigations
  - **Data Subject Rights**: Implementation checklist for SAR, rectification, erasure, portability, objection, restriction, automated decision-making
  - **Children's Data Assessment**: Age verification, parental consent, best interests, child-friendly privacy notices
  - **AI/ML Assessment**: Algorithmic bias, explainability, human oversight, links to ai-playbook and ATRS
  - **ICO Prior Consultation**: Automatic flagging when residual high risks require ICO consultation before processing
  - **International Transfers**: Safeguards assessment (SCCs, BCRs, adequacy decisions)
  - **Template**: `dpia-template.md` (1,000+ lines) with 16 sections following ICO guidance
  - **Legal Context**: UK GDPR Article 35 REQUIRES DPIAs for high-risk processing; failure to conduct when required can result in ICO enforcement
  - **Workflow Position**: Run AFTER /arckit.data-model (needs data inventory), BEFORE /arckit.research (must assess privacy risks before tech selection)
  - **Use Cases**: Health data processing, AI/ML systems, large-scale profiling, children's services, vulnerable groups, cross-border transfers

- **New Command**: `/arckit.principles-compliance` (31st ArcKit command) - Assess project compliance with architecture principles
  - **Dynamic Principle Extraction**: Extracts ALL principles from architecture-principles.md (supports 5, 10, 20+ principles - never assumes fixed count)
  - **RAG Status System**: Four-level assessment (🟢 GREEN: Fully compliant | 🟠 AMBER: Partial compliance | 🔴 RED: Non-compliant | ⚪ NOT ASSESSED: Insufficient evidence)
  - **Evidence-Based Assessment**: All RAG statuses must link to specific file:section:line references from project artifacts
  - **Validation Gates**: Each principle's validation checklist assessed individually with PASS/FAIL/N/A status
  - **Comprehensive Evidence Search**: Requirements coverage, design evidence (HLD/DLD), implementation artifacts, compliance assessments (TCoP, Secure by Design), validation results
  - **Gap Identification**: For AMBER/RED principles - specific gaps with impact, severity, remediation plan, responsible owner, target date
  - **Exception Management**: Time-bound waivers with CTO/CIO approval workflow, expiry dates, quarterly review process
  - **Point-in-Time Assessment**: Run at project gates (Discovery, Alpha, Beta, Live) and quarterly for ongoing compliance monitoring
  - **Gate Decision Support**: Overall recommendation (❌ BLOCK / ⚠️ CONDITIONAL APPROVAL / ✅ PROCEED) with prioritized action plan
  - **Template**: `principles-compliance-assessment-template.md` (340+ lines) with executive summary, compliance scorecard, detailed assessments, exception register
  - **Integration**: Feeds into /arckit.analyze and /arckit.service-assessment for comprehensive quality/compliance checks
  - **Use Cases**: Project gate reviews, quarterly compliance audits, architecture governance, demonstrating principles adoption, identifying architecture drift
  - **Workflow Position**: Run AFTER design reviews when evidence exists, BEFORE major project gates for go/no-go decisions

- **New Command**: `/arckit.story` (29th ArcKit command) - Generate comprehensive project story with timeline analysis
  - **Timeline Analysis**: 4 visualization types (Gantt chart, linear flowchart, detailed table, phase duration pie chart)
  - **Timeline Metrics**: Project duration, velocity, phase analysis, critical path identification
  - **Complete Timeline**: All events from git log or file modification dates with days-from-start
  - **8 Narrative Chapters**: Foundation → Business Case → Requirements → Research → Procurement → Design → Delivery → Compliance
  - **Traceability Demonstration**: End-to-end chains with Mermaid diagrams showing stakeholder → goals → requirements → stories → sprints
  - **Governance Achievements**: Showcase compliance (TCoP, Service Standard, NCSC CAF), risk management, decision rationale
  - **Strategic Context**: Wardley Map insights, build vs buy decisions, vendor selection rationale
  - **Lessons Learned**: Pacing analysis, timeline deviations, recommendations for future projects
  - **Comprehensive Appendices**: Artifact register, chronological activity log, DSM, command reference, glossary
  - **Template**: `story-template.md` (1,200+ lines) with timeline-first approach
  - **Use Cases**: Project milestones, completion reporting, stakeholder communication, portfolio reporting, demonstrating ArcKit governance value

### Changed

- **LICENSE**: Updated copyright holder from "GitHub" to "Mark Craddock"
- **Project README template**: Now documents all 30 commands (previously only 8)
  - Added Phase 15: Project Story & Reporting with `/arckit.story` command
  - Added 10 organized categories: Project Planning, Core Workflow, Vendor Procurement, Design Review, Architecture Diagrams, Sprint Planning, Service Management, Traceability & Quality, UK Government Compliance, Security Assessment
  - Improves command discoverability for new ArcKit projects
- **DEPENDENCY-MATRIX.md**: Added story command as Tier 11 (final reporting tier)
  - All dependencies are optional (O) - scans whatever artifacts exist
  - Added to all 5 critical paths as final reporting step
  - 29×29 matrix now complete
- **WORKFLOW-DIAGRAMS.md**: Added story command to all 5 workflow diagrams
  - Added as gold/yellow box (Tier 11: Reporting)
  - Updated legend to include gold boxes for reporting tier
  - Story command is final step in all workflow paths

### Removed

- **Obsolete documentation files** (7 files, ~123KB):
  - `PUSH-TO-GITHUB.md` - Initial push instructions (no longer needed)
  - `OPENAI-INTEGRATION-PLAN.md` - Planning doc (implemented in .codex/)
  - `UI-IMPLEMENTATION-PLAN.md` - Future planning (not current priority)
  - `arckit-backlog-command-design.md` - Design doc (command implemented)
  - `gds-service-assessment-command-design.md` - Design doc (command implemented)
  - `ARTICLE.md` - Marketing article draft
  - `GITHUB-DISCUSSION-POST.md` - Discussion post draft

## [0.8.3] - 2025-11-02

### Fixed

- **Command Template Synchronization**: Ensured all 28 commands are synchronized across Claude Code, Codex CLI, and Gemini CLI platforms
  - Fixed missing dependency checks in command templates
  - Validated all M/R/O dependencies are properly enforced

### Changed

- **Documentation Cleanup**: Removed completed dependency gap analysis files
  - Removed `DEPENDENCY-GAPS-SUMMARY.md` (Phase 1-2 fixes complete)
  - Removed `DEPENDENCY-MATRIX-GAPS.md` (all critical gaps resolved)
  - Updated `README.md` to remove gap file references
  - Updated `CHANGELOG.md` to note Phase 1-2 completion
  - Updated `CLAUDE.md` developer documentation
  - Gap analysis preserved in git history (commits 4a3f631, 5da8a62, 561902d)

- **Test Repository Updates**: All 10 arckit-test-project repositories synchronized with v0.8.3
  - Updated all commands, templates, and scripts
  - Pushed WORKFLOW-DIAGRAMS.md with Phase 2 R-level dependency visualizations
  - Removed obsolete gap analysis files
  - Repository rename: arckit-test-project-v8-cabinet-office-genai → v9-cabinet-office-genai

## [0.8.2] - 2025-11-01

### Fixed

- **Dependency Matrix Accuracy**: Corrected 4 critical (M-level) dependency errors
  - `dos` now correctly requires principles (M) - ensures evaluation framework aligned with architecture governance
  - `evaluate` now correctly requires principles (M) - ensures vendor scoring criteria match organizational standards
  - `hld-review` now correctly requires principles (M) - validates design decisions against documented principles
  - `dld-review` now correctly requires principles (M) - ensures implementation adheres to architectural standards

- **High-Priority Dependencies**: Added 9 recommended (R-level) dependencies to improve quality
  - `plan` now recommends stakeholders (R), requirements (R), principles (R), sobc (R), risk (R) - creates realistic timelines based on project scope
  - `principles` now recommends gcloud-search (R) for G-Cloud procurement - ensures search criteria align with principles
  - `stakeholders` now recommends research (R), dos (R) - better procurement strategy and vendor requirements
  - `data-model` now recommends research (R) - data modeling informed by vendor research and technology choices
  - `service-assessment` now recommends plan (R) - validates timelines and delivery approach

- **Artifact Summary Counts**: Corrected consumer counts in dependency matrix
  - `principles.md` consumer count: 10 → 14 commands (added dos, gcloud-search, service-assessment)
  - `stakeholders.md` consumer count: 7 → 9 commands (added research, dos, service-assessment)

### Added

- **Comprehensive Dependency Documentation** (3 new documents):
  - `DEPENDENCY-MATRIX.md` (191 lines) - 28×28 Dependency Structure Matrix showing all command dependencies
    - Matrix legend (M=Mandatory, R=Recommended, O=Optional)
    - 10-tier dependency hierarchy (Tier 0: Foundation → Tier 10: Compliance)
    - 5 critical paths (Standard, UK Gov, UK Gov AI, MOD Defence, MOD Defence AI)
    - Artifact fan-in/fan-out analysis (requirements.md consumed by 22 commands)
    - Design notes explaining dependency rationale
    - All critical and high-priority dependencies implemented (Phase 1-2 complete)
  - `WORKFLOW-DIAGRAMS.md` (431 lines) - Visual workflow diagrams for all 5 project paths
    - Mermaid flowcharts showing decision gates and command flows
    - Standard Project workflow (12 steps)
    - UK Government Project workflow (16 steps)
    - UK Government AI Project workflow (15 steps)
    - MOD Defence Project workflow (16 steps)
    - MOD Defence AI Project workflow (17 steps)

### Changed

- **Command Template Enforcement**: Updated 4 command templates to enforce critical dependencies
  - `.claude/commands/arckit.dos.md` - Added principles (M) check with guidance
  - `.claude/commands/arckit.evaluate.md` - Added principles (M) check with guidance
  - `.claude/commands/arckit.hld-review.md` - Added principles (M) check with guidance
  - `.claude/commands/arckit.dld-review.md` - Added principles (M) check with guidance

### Why This Matters

The dependency matrix work ensures ArcKit commands are executed in the correct order, preventing:
- **Quality Issues**: Running evaluate without principles means vendor scoring isn't aligned with organizational standards
- **Rework**: Running hld-review/dld-review without principles means design decisions may violate governance
- **Incomplete Analysis**: Running plan without requirements means timelines don't reflect actual scope
- **Procurement Failures**: Running dos without stakeholders means vendor requirements don't address real needs

The comprehensive dependency documentation provides:
- **Clear Guidance**: 5 workflow diagrams showing exactly which commands to run for different project types
- **Traceability**: Complete dependency chain from foundation commands to final compliance assessments
- **Quality Assurance**: Artifact fan-in analysis shows requirements.md consumed by 22 commands (highest)

This release completes the dependency analysis initiative (Issue #9) with:
- Phase 1: 4 critical (M-level) fixes ✅
- Phase 2: 9 high-priority (R-level) enhancements ✅
- Phase 3: 26 optional (O-level) enhancements (future work)

## [0.8.1] - 2025-11-01

### Fixed

- **Installation compatibility**: Added fallback path for system-wide pip installs
  - Resolves issues when ArcKit installed globally vs in virtual environment
  - Improved template and script discovery across different installation methods

## [0.8.0] - 2025-11-01

### Added

- **Enterprise document control system**: Complete version control and document management
  - Document metadata (version, status, approvers, classification)
  - Comprehensive change log tracking
  - Version control best practices
  - Distribution and access control
  - Applied to all generated documents

- **Enhanced backlog template**: Updated with document control metadata

### Fixed

- **Package distribution**: Added .arckit directory to package distribution
  - Templates and scripts now properly included in pip/uv installs
  - Fixed missing templates issue in fresh installations

- **Script paths**: Corrected script paths in all command files
  - Scripts now reference correct `/scripts/` directory
  - Improved script execution reliability

### Changed

- **Repository organization**: Consolidated scripts to root /scripts directory
  - Removed duplicate root templates directory
  - Cleaner repository structure
  - Improved maintainability

## [0.7.0] - 2025-10-31

### Added

- **`/arckit.jsp-936` command**: MOD JSP 936 AI assurance documentation generator
  - Comprehensive JSP 936 (Dependable Artificial Intelligence in Defence) compliance documentation
  - 5 Ethical Principles assessment: Human-Centricity, Responsibility, Understanding, Bias & Harm Mitigation, Reliability
  - AI ethical risk classification using likelihood × impact matrix (1-5 scale)
  - 5 Risk Classification Levels (Critical/Severe/Major/Moderate/Minor) with approval pathways
  - 8 AI Lifecycle Phases: Planning, Requirements, Architecture, Algorithm Design, Model Development, V&V, Integration & Use, Quality Assurance
  - Governance structure documentation (RAISOs, Ethics Managers, Independent Assurance)
  - Approval pathways (2PUS/Ministerial → Defence-Level JROC/IAC → TLB-Level)
  - Human-AI teaming strategy (human-in-loop, human-on-loop, human-out-of-loop models)
  - AI-specific security threats and controls (adversarial examples, data poisoning, model extraction, model inversion, backdoors, drift)
  - Supplier assurance for third-party AI components
  - Continuous monitoring and re-assessment plan (drift detection, retraining triggers, annual review)
  - Comprehensive compliance matrix (27 JSP 936 requirements)
  - Output: `.arckit/jsp-936/jsp-936-assessment.md`

- **docs/guides/jsp-936.md**: Comprehensive 1,000+ line user guide
  - JSP 936 framework overview (5 principles, 5 risk levels, 8 lifecycle phases, governance)
  - When to run JSP 936 assessment (Discovery/Alpha/Beta/Live phases)
  - AI component types identified (7 categories: ML models, AI algorithms, autonomous systems, decision support, NLP, computer vision, generative AI)
  - Ethical risk assessment methodology (likelihood × impact matrix)
  - Five ethical principles deep dive (requirements, assessment approach)
  - Human-AI teaming models explained (HIL/HOL/HOOL with examples)
  - AI-specific security threats (6 categories with mitigations)
  - Continuous monitoring and re-assessment requirements
  - Approval pathways for each risk classification
  - Integration with other ArcKit commands
  - Common JSP 936 patterns (image classification, decision support, autonomous vehicles, LLMs)
  - JSP 936 compliance checklist
  - FAQs (mandatory assessment, timelines, roles, COTS AI, JSP 440 relationship, risk escalation, monitoring, human control)
  - Example scenarios (satellite imagery analysis, predictive maintenance, autonomous drone)
  - Additional resources (MOD references, UK Government AI guidance, international standards)

- **`.arckit/templates/jsp-936-template.md`**: Complete JSP 936 assessment template
  - Executive summary structure
  - AI system inventory with detailed component cataloging
  - Ethical risk assessment matrices for each AI component
  - Five ethical principles compliance sections
  - Eight AI lifecycle phase documentation structures
  - Governance and approval tracking
  - Human-AI teaming strategy documentation
  - Secure by Design evidence structure
  - Supplier assurance section
  - Continuous monitoring plan
  - JSP 936 compliance matrix (27 requirements)
  - 10 appendices (risk methodology, checklists, model cards, bias reports, V&V reports, security tests, training materials, dashboards)

### Changed

- **Command count**: 27 → 28 commands
- **README.md**:
  - Added `/arckit.jsp-936` to Security Assessment commands table
  - Added JSP 936 information to MOD Projects section
  - Added JSP 936 example usage
  - Added MOD JSP 936 AI Assurance to Built-in UK Government Support list
- **docs/index.html**: To be updated with JSP 936 command (28 commands)
- **Version**: Updated from v0.6.0 to v0.7.0

### Why This Matters

JSP 936 (Dependable Artificial Intelligence in Defence), published November 2024, establishes the UK Ministry of Defence's mandatory framework for safe and responsible adoption of AI/ML systems. Defence projects using AI must complete JSP 936 assessments to receive approval at the appropriate level (2PUS/Ministerial for Critical, Defence-Level for Severe/Major, TLB-Level for Moderate/Minor).

Without JSP 936 compliance, defence AI projects face:
- Approval blockages (no deployment without JSP 936 assessment)
- Ethical risks unidentified until late stages
- Unclear accountability for AI decisions
- Inadequate bias testing and harm mitigation
- Missing security controls for AI-specific threats
- No continuous monitoring or drift detection

The `/arckit.jsp-936` command automates the creation of comprehensive JSP 936 compliance documentation, guiding project teams through:
- Systematic identification of all AI/ML components
- Ethical risk classification using MOD's likelihood × impact methodology
- Assessment against all 5 ethical principles (Human-Centricity, Responsibility, Understanding, Bias & Harm Mitigation, Reliability)
- Documentation for all 8 AI lifecycle phases
- Human-AI teaming strategy design
- AI-specific security threat assessment
- Continuous monitoring and re-assessment planning

This command ensures MOD AI projects have the documentation required for approval while embedding best practices for responsible AI throughout the lifecycle.

## [0.6.0] - 2025-10-30

### Added

- **`/arckit.backlog` command**: Product backlog generation from ArcKit artifacts
  - Automatically converts requirements to GDS-format user stories ("As a... I want... So that...")
  - Multi-factor prioritization (MoSCoW + risk + value + dependencies)
  - Groups stories into epics (from Business Requirements)
  - Generates technical tasks from NFRs and infrastructure needs
  - Creates sprint plan with capacity balancing (60% features, 20% technical, 15% testing, 5% buffer)
  - Respects dependencies (auth before features, database before operations)
  - Maintains traceability matrix (requirements → stories → sprints)
  - Exports to multiple formats: markdown, CSV (Jira/Azure DevOps), JSON (API integration)
  - Time savings: 75%+ reduction (4-6 weeks manual → 3-5 days)
  - Output: `projects/{project-dir}/backlog.md` (+ optional CSV/JSON)

- **docs/guides/backlog.md**: Comprehensive 700+ line guide
  - GDS user story format and best practices
  - Multi-factor prioritization explained (algorithms and examples)
  - Sprint planning and capacity allocation strategies
  - Velocity calibration and story point estimation
  - Backlog management best practices (refinement schedule, DoD)
  - Real-world example (NHS Appointment Booking with 8 sprints)
  - Dependency management and risk-based prioritization
  - Tool integration (Jira, Azure DevOps, GitHub Projects)
  - Common issues and solutions
  - FAQs and tips for success

- **arckit-backlog-command-design.md**: 15,000+ word design specification
  - Research findings from GDS Service Manual on user stories and backlog management
  - Conversion algorithms (FR→Story, NFR→Task, BR→Epic)
  - Multi-factor prioritization algorithm (weighted scoring)
  - Sprint planning algorithm with dependency checking
  - Story point estimation guidelines (Fibonacci 1-13)
  - Template structures and output formats
  - Integration with other ArcKit commands
  - Success criteria and future enhancements

- **`.arckit/templates/backlog-template.md`**: Complete backlog template
  - Executive summary structure
  - Epic breakdown format
  - User story template (GDS format)
  - Sprint plan structure
  - Appendices (traceability, dependencies, DoD)

### Changed

- **Command count**: 26 → 27 commands
- **README.md**: Added `/arckit.backlog` as Phase 10 (Sprint Planning), renumbered subsequent phases
- **docs/index.html**: To be updated with backlog command in phase sections
- **Version**: Updated from v0.5.0 to v0.6.0 across all files

### Why This Matters

Product backlog creation is one of the most time-consuming tasks when transitioning from design (Alpha) to implementation (Beta). Teams spend 4-6 weeks manually converting requirements into user stories, estimating effort, prioritising work, and organising into sprints. This command automates that process in minutes, saving 75%+ of the time while maintaining GDS compliance and best practices.

The backlog command bridges the gap between ArcKit's design phase commands (`/arckit.requirements`, `/arckit.hld`) and implementation, providing a sprint-ready backlog that development teams can immediately use for sprint planning.

## [0.5.0] - 2025-10-30

### Added

- **`/arckit.service-assessment` command**: GDS Service Standard assessment preparation
  - Analyzes evidence against all 14 Service Standard points
  - Generates RAG (Red/Amber/Green) ratings per point and overall readiness score
  - Provides phase-appropriate gap analysis (alpha/beta/live)
  - Creates actionable recommendations with priorities (Critical/High/Medium) and timelines
  - Includes comprehensive assessment day preparation guidance
  - Maps all ArcKit artifacts to Service Standard evidence requirements
  - Output: `projects/{project-dir}/service-assessment-{phase}-prep.md`

- **docs/guides/service-assessment.md**: Comprehensive 600+ line guide
  - GDS Service Standard overview (14 points explained)
  - Assessment process and timings (alpha/beta/live)
  - Phase-appropriate evidence requirements
  - Complete workflow (Week 0 to assessment day)
  - Real-world examples (NHS Appointment Booking alpha prep)
  - Common pitfalls and how ArcKit helps
  - Integration with other ArcKit commands
  - Tips for success and assessment day guidance

- **gds-service-assessment-command-design.md**: 800+ line design specification
  - Research findings from actual GDS assessment reports
  - Design rationale and decision log
  - Evidence discovery algorithm
  - Phase-specific evidence matrices (alpha/beta/live)
  - Recommendation generation approach
  - Success criteria and future enhancements

### Changed

- **Command count**: 25 → 26 commands
- **README.md**: Added service-assessment to Phase 13 (UK Government Compliance)
- **docs/index.html**: Added new "UK Government Compliance" section with service-assessment command
- **Version**: Updated from v0.4.1 to v0.5.0 across all files

### Deployment

Deployed to 6 test repositories:
- arckit-test-project-v1-m365
- arckit-test-project-v2-hmrc-chatbot
- arckit-test-project-v3-windows11
- arckit-test-project-v6-patent-system
- arckit-test-project-v7-nhs-appointment
- arckit-test-project-v8-cabinet-office-genai (new)

## [0.4.1] - 2025-10-29

### Added

- **CONTRIBUTING.md**: Comprehensive contribution guide (241 lines)
  - Getting started workflow (fork, clone, branch)
  - Types of contributions (bugs, features, docs, commands, code)
  - Command structure and standards
  - Documentation style guidelines (UK English, GOV.UK principles)
  - Commit message conventions (conventional commits)
  - Pull request process
  - Testing guidelines
  - UK Government standards compliance requirements
  - Command naming conventions
  - Code of conduct

### Changed

- **docs/index.html**: Complete redesign using GOV.UK Design System v5.13.0
  - Professional, accessible, mobile-responsive design
  - Official GDS components: phase banner, buttons, tags, typography, grid
  - Reduced file size 45% (978 → 542 lines)
  - CDN-hosted GOV.UK Frontend assets
  - WCAG 2.1 AA accessibility compliance
  - Progressive enhancement with js-enabled detection

- **Documentation Expansion** (+1,336 lines across 4 guides):
  - **docs/guides/analyze.md**: 535 → 876 lines (+341)
    - Added "Integration with Other Requirements" section (145 lines)
    - Added "Common Gaps and How to Fix Them" section (8 gaps, 192 lines)
  - **docs/guides/diagram.md**: 525 → 857 lines (+332)
    - Added "Integration with Other Requirements" section (139 lines)
    - Added "Common Gaps and How to Fix Them" section (8 gaps, 208 lines)
  - **docs/guides/traceability.md**: 639 → 808 lines (+169)
    - Added "Integration with Other Requirements" section (163 lines)
  - **docs/guides/wardley-mapping.md**: 112 → 606 lines (+494)
    - Added "Integration with Other Requirements" section (168 lines)
    - Added "Common Gaps and How to Fix Them" section (8 gaps, 323 lines)

- **scripts/converter.py**: Moved from root to scripts/ directory
  - Better organization alongside other tools
  - Updated all references in documentation
  - Added comprehensive section to scripts/README.md

- **scripts/bash/create-project.sh**: Removed empty file creation
  - Commands use Write tool to create files with content
  - Empty touch commands removed (requirements.md, sow.md, etc.)
  - Enhanced project README template with complete GDS workflow

### Fixed

- **Font Licensing Compliance**: GDS Transport font override for non-gov.uk domains
  - GDS Transport licensed only for *.gov.uk, *.service.gov.uk, *.blog.gov.uk
  - Added explicit system font override: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial
  - Complies with GDS typography guidelines for non-government services
  - Transparent footer note explaining font choice
  - Reference: https://design-system.service.gov.uk/styles/typeface/

- **Broken Links**: Created missing CONTRIBUTING.md (was returning 404)

### Removed

- **SETUP.md**: Deleted outdated development artifact (329 lines)
  - Referenced only 8 templates (now 25 commands)
  - Had TODOs for already-implemented commands
  - Superseded by README.md, .claude/COMMANDS.md, .codex/README.md

- **docs/index.html from test repositories**: Removed from all 8 test projects
  - Website hosting only needed in main arc-kit repository
  - Test projects are for testing commands, not hosting website

- **arckit.digital-marketplace command**: Deprecated command fully removed
  - Replaced by focused commands: `/arckit.dos` and `/arckit.gcloud-search`
  - Removed from Claude, Codex, and Gemini command sets
  - Total commands reduced from 26 to 25

## [0.4.0] - 2025-10-28

### Added

- **`/arckit.plan`**: Comprehensive project planning command
  - Generates project plans with GDS Agile Delivery phases (Discovery → Alpha → Beta → Live)
  - Mermaid Gantt charts with timeline visualization
  - Workflow diagrams showing decision gates
  - Phase-by-phase activity tables with ArcKit command recommendations
  - Approval criteria for each phase
  - Risk mitigation strategies
  - Resource allocation planning
  - Success metrics and KPIs
  - Comprehensive 660-line planning guide

### Changed

- **Documentation Guides**: Expanded procurement and design-review guides
  - **docs/guides/procurement.md**: Enhanced with detailed DOS and G-Cloud workflows
  - **docs/guides/design-review.md**: Added comprehensive 10-section assessment checklist

- **Multi-AI Deployment**: Plan command deployed to all three AI systems
  - `.claude/prompts/arckit.plan.md` - Claude Code version
  - `.codex/prompts/arckit.plan.md` - Codex CLI version
  - `.gemini/commands/arckit/plan.toml` - Gemini CLI version

- **Workflow Enhancement**: Added Phase 0 (Planning) to GDS Agile Delivery framework
  - Updated all documentation to show: Phase 0 → Discovery → Alpha → Beta → Live
  - Planning phase runs before Discovery to establish project foundation

### Fixed

- **Version Consistency**: Synchronized all version references to v0.4.0
  - VERSION file: Updated to 0.4.0
  - pyproject.toml: version = "0.4.0"
  - README.md: Latest Release links
  - docs/README.md: ArcKit Version
  - .codex/README.md: version and What's New

## [0.3.6] - 2025-10-27

### Added

- **Gemini CLI Support**: Full support for Google Gemini CLI across all commands
  - Added `scripts/converter.py` to convert Claude markdown commands to Gemini TOML format
  - All 24 commands now available for Gemini CLI (`.gemini/commands/arckit/*.toml`)
  - Automatic conversion maintains command functionality and arguments
  - Complete parity: Claude, Codex, and Gemini now have identical command sets
  - Credit: @umag (PR #5)

- **Digital Marketplace Command Split**: Split monolithic command into three focused commands
  - **`/arckit.dos`** - Digital Outcomes and Specialists (custom development)
    - ~400 lines (focused, clean - down from 754 lines)
    - Covers 95% of arc-kit use cases
    - Essential vs desirable skills extraction
    - Evaluation framework (40% Technical, 30% Team, 20% Quality, 10% Value)
    - Technology-agnostic success criteria
    - No branching logic (DOS only)
  - **`/arckit.gcloud-search`** - G-Cloud with Live Marketplace Search
    - ~500 lines with WebSearch integration
    - **Live Digital Marketplace search** using WebSearch
    - Searches: `site:digitalmarketplace.service.gov.uk g-cloud [keywords]`
    - Finds actual services with suppliers, prices, features, links
    - Service comparison table (top 3-5 services)
    - Recommendations based on requirements match
    - Covers 5% of use cases (cloud services only)
  - **`/arckit.gcloud-clarify`** - G-Cloud Service Validation (NEW!)
    - **Bridge between search and evaluation** - validates services before supplier engagement
    - Systematic gap analysis (MUST/SHOULD requirements vs service descriptions)
    - Detects three gap types: ✅ Confirmed, ⚠️ Ambiguous, ❌ Not mentioned
    - Generates prioritised questions (🔴 Critical / 🟠 High / 🔵 Medium / 🟢 Low)
    - Risk assessment matrix for each service
    - Email templates for supplier engagement
    - Evidence requirements specification
    - Completes the G-Cloud workflow: Search → Clarify → Evaluate

### Changed

- **Command Count**: Now 25 commands per AI assistant (22 original + 3 new G-Cloud commands)
- **README**: Updated to reflect new DOS, G-Cloud search, and G-Cloud clarify commands
- **Complete G-Cloud Workflow**: Requirements → Search → Clarify → Engage → Evaluate → Award


### Benefits

- **Clearer Purpose**: No framework confusion (DOS vs G-Cloud)
- **More Powerful**: G-Cloud search finds actual services, not just requirements
- **Complete Validation**: Gap analysis identifies missing/ambiguous requirements before supplier engagement
- **Risk Mitigation**: Identifies blockers BEFORE contacting suppliers
- **Better UX**: Users know which command to use at each workflow stage
- **Easier Maintenance**: Smaller, focused templates (400-500 lines vs 754)
- **Time Savings**:
  - G-Cloud search: 30+ minutes of manual marketplace searching automated
  - G-Cloud clarify: 30-60 minutes of manual gap analysis automated
  - Total: 1-2 hours saved per procurement
- **Structured Process**: End-to-end G-Cloud workflow from discovery to contract award

## [0.3.5] - 2025-10-26

### Added

- **Codex CLI Integration**: Full support for OpenAI Codex CLI in `arckit init`
  - Added `codex` to AGENT_CONFIG with proper installation URL
  - Automatic `.envrc` generation for Codex projects with `CODEX_HOME` environment variable
  - Auto-creates `.gitignore` entries to exclude auth tokens while preserving prompts
  - Copies slash commands to `.codex/prompts/` directory
  - Added Codex to interactive AI assistant selection menu
  - Enhanced next steps output with Codex-specific setup instructions (direnv recommended)
- Added `.envrc` and updated `.gitignore` for main arc-kit repository

### Changed

- Updated `arckit init` help text to include `codex` as supported AI assistant option
- Commands are now copied for both Claude and Codex (previously Claude-only)

## [0.3.4] - 2025-10-23

### Fixed

- **Critical Installation Bug**: Fixed package distribution to properly include markdown files
  - Added `[tool.hatch.build.targets.wheel.shared-data]` configuration to pyproject.toml
  - Templates, scripts, and .claude commands now correctly packaged in wheel
  - Enhanced `get_data_paths()` function to locate installed package data:
    - Supports uv tool installs (`~/.local/share/uv/tools/arckit-cli/share/arckit/`)
    - Supports pip installs (site-packages)
    - Supports platformdirs locations
    - Fallback to source directory for development mode
  - Added debug output showing resolved data paths during `arckit init`
  - Added warning messages if templates/scripts/commands not found
  - Fixed: `arckit init` now works correctly when installed via pip or uv
  - Credit: @umag (PR #3)

### Added

- **UI Implementation Plan**: Comprehensive plan for building a web-based user interface
  - Next.js 14 + FastAPI architecture for hybrid CLI/UI approach
  - Interactive dashboard with project visualization and status tracking
  - Requirements management interface with filtering, sorting, and graph views
  - Traceability matrix visualization (interactive graph + table views)
  - Diagram viewers for Mermaid diagrams and Wardley Maps
  - Vendor comparison dashboard with side-by-side evaluation
  - AI assistant chat integration for executing slash commands from UI
  - Real-time sync between CLI and UI using file watchers and WebSockets
  - 5-phase implementation roadmap (12-16 weeks)
  - Multiple deployment options: local web server, desktop app (Electron), cloud
  - Maintains markdown files as source of truth (no database lock-in)
  - Full technical specifications, API design, and risk assessment

### Documentation

- Added `UI-IMPLEMENTATION-PLAN.md` with complete architecture and implementation strategy
- Detailed backend API specifications with FastAPI endpoints
- Frontend component structure and technology stack recommendations
- Data flow diagrams showing CLI-to-UI synchronization
- Risk assessment and mitigation strategies
- Budget and resource requirements
- Success metrics and KPIs

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
- Support for Claude Code, OpenAI Codex CLI, and Gemini CLI
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
