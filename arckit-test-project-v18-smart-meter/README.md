# UK Smart Meter Data Consumer Mobile App

**Architecture governance project for a mobile application enabling citizens to access and visualise their smart meter energy consumption data.**

## Project Context

The **Smart Metering Implementation Programme (SMIP)** has deployed over 34 million smart meters across Great Britain. The **Data Communications Company (DCC)** operates the communications infrastructure connecting smart meters to energy suppliers and authorised third parties.

This project designs a consumer-facing mobile application that:

- **Authenticates** consumers and links to their smart meter(s)
- **Retrieves** half-hourly gas and electricity consumption data from SMETS1 and SMETS2 meters
- **Visualises** real-time and historical energy usage with intuitive charts and dashboards
- **Recommends** personalised energy-saving actions based on consumption patterns
- **Compares** tariffs using actual consumption data to help consumers switch
- **Alerts** consumers to unusual consumption, budget thresholds, and prepayment reminders

## Key Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| Department for Energy Security & Net Zero (DESNZ) | Smart metering policy |
| Ofgem | Energy regulation, consumer data access rights |
| Data Communications Company (DCC) | Smart meter communications infrastructure |
| Energy Suppliers | Data providers, consumer relationship owners |
| Citizens / Energy Consumers | App users seeking to understand and reduce energy costs |
| Smart Energy GB | Consumer engagement and awareness |
| ICO | Data protection for personal energy consumption data |

## Regulatory Context

- **Smart Energy Code (SEC)** - Governs data access and security for smart metering
- **Ofgem Supplier Licence Conditions** - Consumer rights to access their energy data
- **UK GDPR / Data Protection Act 2018** - Energy consumption is personal data
- **Privacy and Electronic Communications Regulations (PECR)** - Electronic communications
- **GDS Service Standard** - 14-point assessment for government digital services
- **Technology Code of Practice (TCoP)** - 13-point UK Government technology standards
- **Accessibility Regulations (Public Sector Bodies) 2018** - Mobile accessibility

## Getting Started

1. Start your AI assistant (Claude Code, Gemini CLI, or Codex CLI)
2. Run `/arckit.principles` to establish architecture governance
3. Run `/arckit.stakeholders` to analyze stakeholder drivers and goals
4. Run `/arckit.requirements` to define requirements for the smart meter app

## Available Commands

Once you start your AI assistant, you'll have access to these commands:

### Core Workflow
- `/arckit.principles` - Create or update architecture principles
- `/arckit.stakeholders` - Analyze stakeholder drivers, goals, and outcomes
- `/arckit.risk` - Create comprehensive risk register (Orange Book)
- `/arckit.sobc` - Create Strategic Outline Business Case (Green Book 5-case)
- `/arckit.requirements` - Define comprehensive requirements
- `/arckit.data-model` - Create data model with ERD, GDPR compliance, data governance
- `/arckit.research` - Research mobile frameworks, smart meter APIs, cloud services
- `/arckit.wardley` - Create strategic Wardley Maps for build vs buy and procurement strategy

### Vendor Procurement
- `/arckit.sow` - Generate Statement of Work (RFP)
- `/arckit.dos` - Digital Outcomes and Specialists (DOS) procurement
- `/arckit.gcloud-search` - Search G-Cloud services on UK Digital Marketplace
- `/arckit.gcloud-clarify` - Validate G-Cloud services and generate clarification questions
- `/arckit.evaluate` - Create vendor evaluation framework and score vendors

### Design & Delivery
- `/arckit.diagram` - Generate visual architecture diagrams using Mermaid
- `/arckit.hld-review` - Review High-Level Design
- `/arckit.dld-review` - Review Detailed Design
- `/arckit.backlog` - Generate prioritised product backlog with GDS user stories
- `/arckit.devops` - Create DevOps strategy with CI/CD pipelines
- `/arckit.finops` - Create FinOps strategy for cloud cost management

### UK Government Compliance
- `/arckit.service-assessment` - GDS Service Standard assessment preparation
- `/arckit.tcop` - Technology Code of Practice assessment
- `/arckit.ai-playbook` - AI Playbook compliance for responsible AI
- `/arckit.dpia` - Data Protection Impact Assessment (UK GDPR Article 35)
- `/arckit.secure` - UK Government Secure by Design assessment

### Service Management
- `/arckit.servicenow` - Generate ServiceNow service design
- `/arckit.operationalize` - Create operational readiness pack with runbooks and DR/BCP
- `/arckit.traceability` - Generate requirements traceability matrix
- `/arckit.analyze` - Comprehensive governance quality analysis

## Project Structure

```
arckit-test-project-v18-smart-meter/
├── .arckit/
│   ├── scripts/bash/
│   └── templates/
├── .claude/commands/
├── .codex/prompts/arckit/
├── .gemini/commands/arckit/
├── docs/
│   ├── guides/
│   └── README.md
├── projects/
│   ├── 000-global/
│   │   └── ARC-000-PRIN-v1.0.md
│   └── 001-smart-meter-app/
└── DEPENDENCY-MATRIX.md
```

## Documentation

- [ArcKit Documentation](https://tractorjuice.github.io/arc-kit/)
- [Smart Energy Code (SEC)](https://smartenergycodecompany.co.uk/)
- [DCC - Data Communications Company](https://www.smartdcc.co.uk/)
- [Ofgem - Smart Metering](https://www.ofgem.gov.uk/energy-policy-and-regulation/policy-and-regulatory-programmes/smart-metering)
- [Smart Energy GB](https://www.smartenergygb.org/)
