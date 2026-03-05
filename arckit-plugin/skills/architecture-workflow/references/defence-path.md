# Defence Project Path

## When This Path Applies

- Ministry of Defence (MOD) projects
- Defence contractors working on MOD programmes
- Projects subject to JSP 440 (Defence Manual of Security)
- IAMM (Information Assurance Maturity Model) applies
- Digital Outcomes and Specialists (DOS) procurement likely
- Security clearance requirements for team

## Compliance Frameworks

- JSP 440 (Defence Manual of Security)
- IAMM (Information Assurance Maturity Model)
- MOD Secure by Design
- Technology Code of Practice (TCoP)
- JSP 936 (MOD AI Assurance) — if AI/ML components
- Green Book / Orange Book (HM Treasury)

## Phased Command Sequence

### Phase 1: Foundation (Mandatory)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 1 | `/arckit:principles` | Governance foundation — must align with MOD architecture standards | ARC-000-PRIN-v1.0.md |
| 2 | `/arckit:stakeholders` | Map DDaT roles, SROs, security officers, DG/2* sponsors | ARC-{PID}-STKE-v1.0.md |
| 3 | `/arckit:risk` | MOD risk methodology with security classification | ARC-{PID}-RISK-v1.0.md |

### Phase 2: Business Justification

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 4 | `/arckit:sobc` | HM Treasury Green Book SOBC with defence-specific considerations | ARC-{PID}-SOBC-v1.0.md |
| 5 | `/arckit:requirements` | Requirements with security and interoperability constraints | ARC-{PID}-REQ-v1.0.md |

### Phase 3: Design and Analysis

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 6 | `/arckit:datascout` | Discover data sources within MOD and cross-government | ARC-{PID}-DSCT-v1.0.md |
| 7 | `/arckit:data-model` | Data architecture with classification levels | ARC-{PID}-DMOD-v1.0.md |
| 8 | `/arckit:dpia` | Data Protection Impact Assessment | ARC-{PID}-DPIA-v1.0.md |
| 9 | `/arckit:research` | Technology research with defence supplier focus | ARC-{PID}-RES-v1.0.md |
| 10 | `/arckit:wardley` | Strategic positioning for defence capabilities | ARC-{PID}-WARD-001-v1.0.md |
| 11 | `/arckit:roadmap` | Multi-year roadmap aligned to defence planning rounds | ARC-{PID}-ROAD-v1.0.md |
| 12 | `/arckit:diagram` | Architecture diagrams (C4, sequence, DFD) | ARC-{PID}-DIAG-001-v1.0.md |

### Phase 4: Procurement (DOS)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 13 | `/arckit:dos` | Digital Outcomes and Specialists opportunity | ARC-{PID}-DOS-v1.0.md |
| 14 | `/arckit:sow` | Statement of work for procurement | ARC-{PID}-SOW-v1.0.md |
| 15 | `/arckit:evaluate` | Vendor evaluation with security vetting requirements | ARC-{PID}-EVAL-v1.0.md |

### Phase 5: Design Reviews

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 16 | `/arckit:hld-review` | HLD review against MOD architecture standards | ARC-{PID}-HLDR-v1.0.md |
| 17 | `/arckit:dld-review` | DLD review with security architecture focus | ARC-{PID}-DLDR-v1.0.md |
| 18 | `/arckit:adr` | Architecture Decision Records | ARC-{PID}-ADR-001-v1.0.md |

### Phase 6: Implementation

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 19 | `/arckit:backlog` | Product backlog from requirements and design | ARC-{PID}-BKLG-v1.0.md |

### Phase 7: Operations and Quality

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 20 | `/arckit:devops` | CI/CD with secure pipeline requirements | ARC-{PID}-DVOP-v1.0.md |
| 21 | `/arckit:operationalize` | Operational readiness with MOD service management | ARC-{PID}-OPS-v1.0.md |
| 22 | `/arckit:traceability` | End-to-end traceability matrix | ARC-{PID}-TRACE-v1.0.md |

### Phase 8: Compliance (Defence Specific)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 23 | `/arckit:tcop` | Technology Code of Practice assessment | ARC-{PID}-TCOP-v1.0.md |
| 24 | `/arckit:mod-secure` | MOD Secure by Design (JSP 440, IAMM) | ARC-{PID}-MSEC-v1.0.md |
| 25 | `/arckit:principles-compliance` | Principles adherence | ARC-{PID}-PCOMP-v1.0.md |
| 26 | `/arckit:conformance` | ADR conformance checking | ARC-{PID}-CONF-v1.0.md |
| 27 | `/arckit:analyze` | Deep governance analysis | ARC-{PID}-ANAL-v1.0.md |
| 28 | `/arckit:service-assessment` | Service assessment readiness | ARC-{PID}-SA-v1.0.md |

### Phase 9: Reporting

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 29 | `/arckit:story` | Project narrative for governance boards | ARC-{PID}-STORY-v1.0.md |
| 30 | `/arckit:pages` | GitHub Pages documentation site | docs/index.html |

## AI/ML Additions

> See ai-ml-path.md for full AI/ML additions; the entries below are defence-specific supplements only.

If the defence project includes AI/ML components, add these commands:

| # | Command | Where to Insert | Rationale | Artifacts |
|---|---------|-----------------|-----------|-----------|
| — | `/arckit:mlops` | Phase 7, after devops | ML model lifecycle, training pipelines | ARC-{PID}-MLOP-v1.0.md |
| — | `/arckit:jsp-936` | Phase 8, after mod-secure | MOD AI Assurance (JSP 936) | ARC-{PID}-JSP936-v1.0.md |

### Critical Gates for AI Projects

- JSP 936 risk classification determines approval pathway:
  - **Critical**: 2PUS/Ministerial approval
  - **Severe/Major**: Defence-Level JROC/IAC approval
  - **Moderate/Minor**: TLB-Level approval

## Optional Commands

| Command | When to Add | Phase |
|---------|-------------|-------|
| `/arckit:strategy` | Executive strategy synthesis needed | After Phase 3 |
| `/arckit:platform-design` | Defence platform or shared service | Phase 3 |
| `/arckit:data-mesh-contract` | Federated data products across TLBs | Phase 3 |
| `/arckit:gcloud-search` | G-Cloud procurement (alternative to DOS) | Phase 4 |
| `/arckit:finops` | Cloud cost management | Phase 7 |
| `/arckit:servicenow` | ServiceNow CMDB integration | Phase 7 |
| `/arckit:presentation` | Governance board slide deck | Phase 9 |

## Minimum Viable Path

For initial security assessment preparation:

1. `/arckit:principles`
2. `/arckit:stakeholders`
3. `/arckit:requirements`
4. `/arckit:risk`
5. `/arckit:mod-secure`

## Duration

- **Non-AI projects**: 12-24 months
- **AI projects**: 18-36 months
- **Minimum viable**: 3-6 weeks

## Critical Gates

- MOD Secure by Design (JSP 440, IAMM) required before Beta
- Security clearances required for all team members
- JSP 936 AI assurance required before Beta (AI projects only)
