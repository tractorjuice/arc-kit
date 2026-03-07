# UK Government Project Path

## When This Path Applies

- UK Government civilian departments (non-MOD)
- Projects subject to GDS Service Standard
- Projects subject to Technology Code of Practice (TCoP)
- NCSC Cyber Assessment Framework applies
- G-Cloud or Digital Outcomes procurement likely

## Compliance Frameworks

- GDS Service Standard (14 points)
- Technology Code of Practice (TCoP)
- NCSC Cyber Assessment Framework (CAF)
- Secure by Design (civilian)
- Green Book / Orange Book (HM Treasury)

## Phased Command Sequence

### Phase 1: Foundation (Mandatory)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 1 | `/prompts:arckit.principles` | Governance foundation — must align with GDS and TCoP | ARC-000-PRIN-v1.0.md |
| 2 | `/prompts:arckit.stakeholders` | Map DDaT roles, SROs, policy owners | ARC-{PID}-STKE-v1.0.md |
| 3 | `/prompts:arckit.risk` | HMG Orange Book risk methodology | ARC-{PID}-RISK-v1.0.md |

### Phase 2: Business Justification

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 4 | `/prompts:arckit.sobc` | HM Treasury Green Book SOBC with 5-case model | ARC-{PID}-SOBC-v1.0.md |
| 5 | `/prompts:arckit.requirements` | Requirements aligned to GDS service standard | ARC-{PID}-REQ-v1.0.md |

### Phase 3: Design and Analysis

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 6 | `/prompts:arckit.datascout` | Discover UK Gov open data sources (TCoP Point 10) | ARC-{PID}-DSCT-v1.0.md |
| 7 | `/prompts:arckit.data-model` | Data architecture with GDPR/DPA considerations | ARC-{PID}-DMOD-v1.0.md |
| 8 | `/prompts:arckit.dpia` | Data Protection Impact Assessment (mandatory for personal data) | ARC-{PID}-DPIA-v1.0.md |
| 9 | `/prompts:arckit.research` | Technology research with Crown Commercial focus | ARC-{PID}-RES-v1.0.md |
| 10 | `/prompts:arckit.wardley` | Strategic positioning for GaaP components | ARC-{PID}-WARD-001-v1.0.md |
| 11 | `/prompts:arckit.roadmap` | Roadmap aligned to spending review cycles | ARC-{PID}-ROAD-v1.0.md |
| 12 | `/prompts:arckit.diagram` | Architecture diagrams (C4, sequence, DFD) | ARC-{PID}-DIAG-001-v1.0.md |

### Phase 4: Procurement (G-Cloud / DOS)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 13 | `/prompts:arckit.gcloud-search` | Search Digital Marketplace for G-Cloud services | Console output |
| 14 | `/prompts:arckit.gcloud-clarify` | Generate clarification questions for shortlisted services | ARC-{PID}-GCLR-v1.0.md |
| 15 | `/prompts:arckit.sow` | Statement of work for procurement | ARC-{PID}-SOW-v1.0.md |
| 16 | `/prompts:arckit.evaluate` | Vendor evaluation with value-for-money assessment | ARC-{PID}-EVAL-v1.0.md |

### Phase 5: Design Reviews

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 17 | `/prompts:arckit.hld-review` | HLD review against GDS patterns | ARC-{PID}-HLDR-v1.0.md |
| 18 | `/prompts:arckit.dld-review` | DLD review for security and performance | ARC-{PID}-DLDR-v1.0.md |
| 19 | `/prompts:arckit.adr` | Architecture Decision Records | ARC-{PID}-ADR-001-v1.0.md |

### Phase 6: Implementation

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 20 | `/prompts:arckit.backlog` | Product backlog from requirements and design | ARC-{PID}-BKLG-v1.0.md |

### Phase 7: Operations and Quality

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 21 | `/prompts:arckit.devops` | CI/CD aligned to GDS technology standards | ARC-{PID}-DVOP-v1.0.md |
| 22 | `/prompts:arckit.operationalize` | Operational readiness, service desk integration | ARC-{PID}-OPS-v1.0.md |
| 23 | `/prompts:arckit.traceability` | End-to-end traceability matrix | ARC-{PID}-TRACE-v1.0.md |

### Phase 8: Compliance (UK Government Specific)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 24 | `/prompts:arckit.tcop` | Technology Code of Practice assessment | ARC-{PID}-TCOP-v1.0.md |
| 25 | `/prompts:arckit.secure` | Secure by Design assessment (NCSC CAF) | ARC-{PID}-SEC-v1.0.md |
| 26 | `/prompts:arckit.principles-compliance` | Principles adherence | ARC-{PID}-PCOMP-v1.0.md |
| 27 | `/prompts:arckit.conformance` | ADR conformance checking | ARC-{PID}-CONF-v1.0.md |
| 28 | `/prompts:arckit.analyze` | Deep governance analysis | ARC-{PID}-ANAL-v1.0.md |
| 29 | `/prompts:arckit.service-assessment` | GDS Service Assessment readiness | ARC-{PID}-SA-v1.0.md |

### Phase 9: Reporting

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 30 | `/prompts:arckit.story` | Project narrative for governance boards | ARC-{PID}-STORY-v1.0.md |
| 31 | `/prompts:arckit.pages` | GitHub Pages documentation site | docs/index.html |

## Optional Commands

These can be added at the appropriate phase if needed:

| Command | When to Add | Phase |
|---------|-------------|-------|
| `/prompts:arckit.strategy` | Executive strategy synthesis needed | After Phase 3 |
| `/prompts:arckit.platform-design` | Government as a Platform (GaaP) service | Phase 3 |
| `/prompts:arckit.data-mesh-contract` | Federated data products | Phase 3, after data-model |
| `/prompts:arckit.dos` | Digital Outcomes and Specialists procurement | Phase 4 (alternative to G-Cloud) |
| `/prompts:arckit.finops` | Cloud cost management | Phase 7 |
| `/prompts:arckit.servicenow` | ServiceNow CMDB integration | Phase 7 |
| `/prompts:arckit.presentation` | Governance board slide deck | Phase 9 |

## Minimum Viable Path

For Alpha assessment preparation:

1. `/prompts:arckit.principles`
2. `/prompts:arckit.stakeholders`
3. `/prompts:arckit.requirements`
4. `/prompts:arckit.research`
5. `/prompts:arckit.tcop`
6. `/prompts:arckit.secure`

## Duration

- **Full path**: 6-12 months
- **Minimum viable**: 2-4 weeks
