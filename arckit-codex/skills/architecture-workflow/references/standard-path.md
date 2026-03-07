# Standard Project Path

## When This Path Applies

- Private sector projects
- Non-UK government public sector
- No AI/ML components
- No specific compliance framework requirements

## Phased Command Sequence

### Phase 1: Foundation (Mandatory)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 1 | `/prompts:arckit.principles` | Governance foundation — 21 downstream commands depend on this | ARC-000-PRIN-v1.0.md |
| 2 | `/prompts:arckit.stakeholders` | Identify who cares and what they need — drives everything downstream | ARC-{PID}-STKE-v1.0.md |
| 3 | `/prompts:arckit.risk` | Identify what could go wrong before committing resources | ARC-{PID}-RISK-v1.0.md |

### Phase 2: Business Justification

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 4 | `/prompts:arckit.sobc` | Justify the investment before detailed technical work | ARC-{PID}-SOBC-v1.0.md |
| 5 | `/prompts:arckit.requirements` | Central artifact — 38 commands depend on this | ARC-{PID}-REQ-v1.0.md |

### Phase 3: Design and Analysis

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 6 | `/prompts:arckit.data-model` | Define data structures from DR-xxx requirements | ARC-{PID}-DMOD-v1.0.md |
| 7 | `/prompts:arckit.research` | Technology options, build vs buy, vendor landscape | ARC-{PID}-RES-v1.0.md |
| 8 | `/prompts:arckit.wardley` | Strategic positioning and evolution analysis | ARC-{PID}-WARD-001-v1.0.md |
| 9 | `/prompts:arckit.roadmap` | Multi-year timeline from strategy analysis | ARC-{PID}-ROAD-v1.0.md |
| 10 | `/prompts:arckit.diagram` | Architecture diagrams (C4, DFD, sequence) | ARC-{PID}-DIAG-001-v1.0.md |

### Phase 4: Procurement (If Applicable)

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 11 | `/prompts:arckit.sow` | Statement of work / RFP for vendors | ARC-{PID}-SOW-v1.0.md |
| 12 | `/prompts:arckit.evaluate` | Vendor evaluation framework and scoring | ARC-{PID}-EVAL-v1.0.md |

### Phase 5: Design Reviews

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 13 | `/prompts:arckit.hld-review` | Validate high-level design against requirements | ARC-{PID}-HLDR-v1.0.md |
| 14 | `/prompts:arckit.dld-review` | Validate detailed design | ARC-{PID}-DLDR-v1.0.md |
| 15 | `/prompts:arckit.adr` | Record key architecture decisions | ARC-{PID}-ADR-001-v1.0.md |

### Phase 6: Implementation

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 16 | `/prompts:arckit.backlog` | Product backlog from requirements and design | ARC-{PID}-BKLG-v1.0.md |
| 17 | `/prompts:arckit.trello` | Export backlog to Trello (optional) | Trello board |

### Phase 7: Operations and Quality

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 18 | `/prompts:arckit.devops` | CI/CD, IaC, container orchestration strategy | ARC-{PID}-DVOP-v1.0.md |
| 19 | `/prompts:arckit.operationalize` | Operational readiness, SRE, runbooks | ARC-{PID}-OPS-v1.0.md |
| 20 | `/prompts:arckit.traceability` | End-to-end traceability matrix | ARC-{PID}-TRACE-v1.0.md |
| 21 | `/prompts:arckit.principles-compliance` | Principles adherence assessment | ARC-{PID}-PCOMP-v1.0.md |
| 22 | `/prompts:arckit.conformance` | ADR conformance checking | ARC-{PID}-CONF-v1.0.md |
| 23 | `/prompts:arckit.analyze` | Deep governance analysis | ARC-{PID}-ANAL-v1.0.md |

### Phase 8: Reporting

| # | Command | Rationale | Artifacts |
|---|---------|-----------|-----------|
| 24 | `/prompts:arckit.story` | Comprehensive project narrative | ARC-{PID}-STORY-v1.0.md |
| 25 | `/prompts:arckit.pages` | GitHub Pages documentation site | docs/index.html |

## Optional Commands

These can be added at the appropriate phase if needed:

| Command | When to Add | Phase |
|---------|-------------|-------|
| `/prompts:arckit.strategy` | Executive strategy synthesis needed | After Phase 3 |
| `/prompts:arckit.platform-design` | Multi-sided platform or marketplace | Phase 3 |
| `/prompts:arckit.datascout` | External data sources needed | Phase 3, before data-model |
| `/prompts:arckit.dpia` | Personal data is processed | Phase 3, after data-model |
| `/prompts:arckit.finops` | Cloud cost management needed | Phase 7 |
| `/prompts:arckit.servicenow` | ServiceNow CMDB integration | Phase 7 |
| `/prompts:arckit.presentation` | Governance board slide deck | Phase 8 |

## Minimum Viable Path

For quick prototype documentation or proof of concept:

1. `/prompts:arckit.principles`
2. `/prompts:arckit.stakeholders`
3. `/prompts:arckit.requirements`
4. `/prompts:arckit.research`
5. `/prompts:arckit.diagram`

## Duration

- **Full path**: 4-8 months
- **Minimum viable**: 1-2 weeks
