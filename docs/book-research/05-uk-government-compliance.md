# UK Government Compliance Coverage

## Overview

ArcKit has deep UK public sector compliance coverage, making it uniquely suited for government architecture governance. Many commands specifically target UK frameworks and standards.

## Frameworks and Standards Covered

### HM Treasury

- **Green Book** (2026 edition): Appraisal and evaluation. Covered by `/arckit.sobc` with Theory of Change, SMART objectives, options analysis (BAU/Do Minimum/Preferred Way Forward), Analytical Supportability Test (AST), Value for Money (VFM) balanced judgment
- **Orange Book**: Risk management. Covered by `/arckit.risk` with 6 treatment options (not the old 4Ts), Three Lines Model, cascade analysis, cost-benefit action plans

### Government Digital Service (GDS)

- **GDS Service Standard**: 14-point assessment via `/arckit.service-assessment`
- **Technology Code of Practice (TCoP)**: Review via `/arckit.tcop`
- **G-Cloud/DOS procurement**: `/arckit.dos` for Digital Outcomes and Specialists

### National Cyber Security Centre (NCSC)

- **Cyber Assessment Framework (CAF)**: Covered by `/arckit.secure` with CAF Maturity Summary (% per objective), Principles-to-CAF Traceability Matrix, Security Remediation Roadmap (25-33 items with GDS phase/owners/costs)

### Ministry of Defence

- **JSP 453 (Secure by Design)**: `/arckit.mod-secure` with CAAT continuous assurance process
- **JSP 936**: `/arckit.jsp-936` assessment

### AI and Data

- **UK Government AI Playbook**: `/arckit.ai-playbook` for responsible AI deployment
- **Algorithmic Transparency Recording Standard (ATRS)**: `/arckit.atrs`
- **Data Protection Impact Assessment (DPIA)**: `/arckit.dpia`

### Government Code Reuse

- **govreposcrape** MCP integration: Semantic search over 24,500+ UK government repositories
- Three commands: `gov-reuse`, `gov-code-search`, `gov-landscape`
- Wired into research, datascout, and cloud research agents

### UK Funding

- **Grants command**: Searches UKRI, Innovate UK, NIHR, DSIT, DASA, Wellcome, Nesta, Health Foundation, 360Giving/GrantNav, and accelerator programmes

## Document Classification

Templates support UK Government classification levels:

- PUBLIC
- OFFICIAL
- OFFICIAL-SENSITIVE
- SECRET

## Real-World Test Projects

ArcKit has been tested on 22 real-world projects, many UK Government focused:

| Project | Domain |
|---------|--------|
| m365 | Microsoft 365 migration |
| hmrc-chatbot | HMRC chatbot |
| windows11 | Windows 11 deployment |
| patent-system | Patent system modernization |
| nhs-appointment | NHS appointment booking |
| ons-data-platform | ONS data platform |
| cabinet-office-genai | Cabinet Office GenAI |
| training-marketplace | UK Government Training Marketplace |
| national-highways-data | National Highways data architecture |
| scottish-courts | Scottish Courts GenAI strategy |
| doctors-appointment | Doctors Online Appointment System |
| fuel-prices | UK Government Fuel Price Transparency Service |
| smart-meter | UK Smart Meter Data Consumer Mobile App |
| gov-api-aggregator | UK Government API Aggregator |
| criminal-courts | Independent Review of Criminal Courts - Technology & AI |
