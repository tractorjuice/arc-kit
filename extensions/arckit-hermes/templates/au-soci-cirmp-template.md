# SOCI Act / Critical Infrastructure Risk Management Program Pack

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-soci-cirmp`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line, where applicable, MUST be: -->
<!-- | Classification | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET | -->
<!-- Note: SOCI protected information is distinct from PSPF PROTECTED classification. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-soci-cirmp` command | PENDING | PENDING |

---

## Executive Summary

[Summarise likely SOCI applicability, critical asset context, CIRMP readiness, highest material risks, reporting obligations, and immediate evidence gaps.]

---

## Critical Asset and Responsible Entity Context

| Field | Value |
|-------|-------|
| **Asset / System Name** | [Name] |
| **SOCI Sector** | [Communications / Financial services and markets / Data storage or processing / Defence industry / Higher education and research / Energy / Food and grocery / Healthcare and medical / Space technology / Transport / Water and sewerage / To be confirmed] |
| **Asset Class** | [Asset class / threshold / to be confirmed] |
| **Responsible Entity** | [Entity] |
| **Operator** | [Entity] |
| **Direct Interest Holders** | [Known / to be confirmed] |
| **Regulator** | [CISC / sector regulator / other] |
| **Board / Governing Body** | [Board / council / governing body] |
| **Protected Information Handling Required** | [Yes / No / To be confirmed] |
| **Assessment Date** | [YYYY-MM-DD] |

---

## SOCI Applicability Assessment

| Obligation Area | Applies? | Evidence | Gap / Legal Confirmation Needed |
|-----------------|----------|----------|---------------------------------|
| Critical asset registration | [Yes / No / Unclear] | [Evidence] | [Gap] |
| Responsible entity obligations | [Yes / No / Unclear] | [Evidence] | [Gap] |
| Written CIRMP | [Yes / No / Unclear] | [Evidence] | [Gap] |
| Annual CIRMP report | [Yes / No / Unclear] | [Evidence] | [Gap] |
| Cyber incident reporting | [Yes / No / Unclear] | [Evidence] | [Gap] |
| Protected information obligations | [Yes / No / Unclear] | [Evidence] | [Gap] |
| Government assistance powers awareness | [Yes / No / Unclear] | [Evidence] | [Gap] |

---

## ArcKit Architecture and Data Evidence Map

| Evidence Area | ArcKit Artefact | How It Supports CIRMP | Gap / Follow-up |
|---------------|-----------------|-----------------------|-----------------|
| Architecture diagrams | `/arckit:diagram` / ARC-*-DIAG-* | Critical components, boundaries, deployment zones, third parties, and operational dependencies | [Gap / follow-up] |
| Data flow diagrams | `/arckit:dfd` / ARC-*-DFD-* | Protected information flows, operational data flows, external entities, stores, and reporting pathways | [Gap / follow-up] |
| Data model | `/arckit:data-model` / ARC-*-DATA-* | Protected information, personal information, critical data, classification, retention, and owners | [Gap / follow-up] |
| ServiceNow / CMDB | `/arckit:servicenow` / ARC-*-SNOW-* | CMDB CIs, service dependencies, support groups, SLAs, incident queues, and change controls | [Gap / follow-up] |
| Risk register | `/arckit:risk` / ARC-*-RISK-* | Material risks, residual risks, treatments, and risk owners | [Gap / follow-up] |
| Traceability matrix | `/arckit:traceability` / ARC-*-TRAC-* | Mapping from SOCI obligations to requirements, evidence, owners, controls, and actions | [Gap / follow-up] |
| Graph report | `/arckit:graph-report` | Coverage view across AU compliance, architecture, risk, traceability, and operations artefacts | [Gap / follow-up] |
| Maturity model | `/arckit:maturity-model` | Maturity view across cyber, personnel, supply chain, physical, natural hazard, and governance domains | [Gap / follow-up] |

---

## CIRMP Governance Model

| Governance Element | Current Position | Evidence | Owner | Gap |
|--------------------|------------------|----------|-------|-----|
| Accountable executive | [Defined / Partial / Missing] | [Evidence] | [Owner] | [Gap] |
| Board / governing body approval | [Defined / Partial / Missing] | [Evidence] | [Owner] | [Gap] |
| Risk committee oversight | [Defined / Partial / Missing] | [Evidence] | [Owner] | [Gap] |
| Annual report preparation | [Defined / Partial / Missing] | [Evidence] | [Owner] | [Gap] |
| Evidence repository | [Defined / Partial / Missing] | [Evidence] | [Owner] | [Gap] |
| Review cadence | [Defined / Partial / Missing] | [Evidence] | [Owner] | [Gap] |

---

## CIRMP Hazard Domain Assessment

| Hazard Domain | Material Risks | Relevant Impact | Existing Controls | Evidence | Gap | Owner |
|---------------|----------------|-----------------|-------------------|----------|-----|-------|
| Cyber and information security | [Risks] | [Impact] | [Controls] | [AUE8 / AUISM / AUOT / AUPIA / AUNDB] | [Gap] | [Owner] |
| Personnel | [Risks] | [Impact] | [Controls] | [Screening / access / training] | [Gap] | [Owner] |
| Supply chain | [Risks] | [Impact] | [Controls] | [Supplier register / contracts / assurance] | [Gap] | [Owner] |
| Physical security | [Risks] | [Impact] | [Controls] | [Facility controls / access logs] | [Gap] | [Owner] |
| Natural hazards | [Risks] | [Impact] | [Controls] | [BCP / DR / resilience plan] | [Gap] | [Owner] |

---

## Cyber and Information Security Evidence

| Evidence Source | Reference | Use in CIRMP |
|-----------------|-----------|--------------|
| AUE8 | [ARC-{P}-AUE8-v*] | Essential Eight cyber baseline |
| AUISM | [ARC-{P}-AUISM-v*] | ISM control applicability and gaps |
| AUOT | [ARC-{P}-AUOT-v* / N/A] | OT cyber evidence where the asset includes OT |
| AUPIA | [ARC-{P}-AUPIA-v*] | Privacy and information handling evidence |
| AUNDB | [ARC-{P}-AUNDB-v*] | Breach and incident notification process |
| RISK | [ARC-{P}-RISK-v*] | Residual material risks and treatments |

---

## Personnel, Supply Chain, Physical Security, and Natural Hazard Evidence

| Domain | Evidence Held | Evidence Gap | Action |
|--------|---------------|--------------|--------|
| Personnel | [Screening, access governance, critical worker controls] | [Gap] | [Action] |
| Supply chain | [Major supplier list, privileged supplier access, contracts] | [Gap] | [Action] |
| Physical security | [Physical critical components, access control, visitor process] | [Gap] | [Action] |
| Natural hazards | [BCP, resilience plan, disaster recovery, dependency maps] | [Gap] | [Action] |

---

## Incident Reporting and Notification Pathways

| Scenario | Reporting Trigger | Timeframe | Owner | Evidence / Procedure |
|----------|-------------------|-----------|-------|----------------------|
| Cyber incident with relevant impact | [Trigger] | [12-hour / 72-hour / other] | [Owner] | [Procedure] |
| Personal information breach | [NDB trigger] | [OAIC timeframe] | [Owner] | [AUNDB reference] |
| Physical security incident | [Trigger] | [Timeframe] | [Owner] | [Procedure] |
| Supplier incident | [Trigger] | [Timeframe] | [Owner] | [Procedure] |
| Protected information disclosure issue | [Trigger] | [Timeframe] | [Owner] | [Procedure] |

---

## Annual Report and Attestation Readiness

| Requirement | Current Position | Evidence | Gap |
|-------------|------------------|----------|-----|
| CIRMP documented and approved | [Ready / Partial / Gap] | [Evidence] | [Gap] |
| CIRMP operating evidence collected | [Ready / Partial / Gap] | [Evidence] | [Gap] |
| Material risks reviewed | [Ready / Partial / Gap] | [Evidence] | [Gap] |
| Board / governing body approval path | [Ready / Partial / Gap] | [Evidence] | [Gap] |
| Annual report submission owner | [Ready / Partial / Gap] | [Evidence] | [Gap] |

---

## Operations, CMDB, and Traceability Integration

| Integration Point | Source Artefact | Target Artefact / Register | Evidence to Maintain |
|-------------------|-----------------|----------------------------|----------------------|
| Critical component ownership | ARC-*-DIAG-* / ARC-*-SNOW-* | CMDB CI owner, support group, SLA, and incident queue | [Owner / support / SLA] |
| Protected-information flow | ARC-*-DFD-* / ARC-*-DATA-* | Traceability matrix and protected-information register | [Flow / entity / classification] |
| CIRMP material risk | ARC-*-AUSOCI-* | Risk register and maturity-model assessment | [Risk ID / maturity domain] |
| Annual report evidence | ARC-*-AUSOCI-* / ARC-*-TRAC-* | Graph-report coverage and board/governing-body evidence pack | [Evidence status / approver] |

---

## Cross-Sector vs Sector-Specific Obligations

This artefact covers general SOCI/CIRMP obligations. Record sector-specific overlays separately.

| Sector-Specific Area | In Scope Here? | Follow-up Artefact |
|----------------------|----------------|--------------------|
| AESCSF energy maturity | No | `/arckit:au-aescsf` when available |
| AER ring-fencing | No | `/arckit:au-energy-compliance` when available |
| NER / NGR obligations | No | `/arckit:au-energy-compliance` when available |
| AEMO market/system obligations | No | `/arckit:au-energy-compliance` when available |
| Other sector regulator obligations | No | Sector-specific overlay or custom command |

---

## Recommendations

| Priority | Action | Owner | Due Date | Evidence Update | Residual Risk |
|----------|--------|-------|----------|-----------------|---------------|
| Immediate | [Action] | [Owner] | [Date] | [Artefact / register] | [Risk] |
| 30-90 days | [Action] | [Owner] | [Date] | [Artefact / register] | [Risk] |
| 90-180 days | [Action] | [Owner] | [Date] | [Artefact / register] | [Risk] |
| Strategic | [Action] | [Owner] | [Date] | [Artefact / register] | [Risk] |

---

## External References

| Ref | Source | Version / Date Verified | Relevance |
|-----|--------|-------------------------|-----------|
| SOCI-1 | Security of Critical Infrastructure Act 2018 (SOCI) | [Date verified] | Primary legal framework |
| SOCI-2 | Security of Critical Infrastructure Act 2018, Federal Register of Legislation | [Compilation / date verified] | Authoritative legal text |
| SOCI-3 | CISC Regulatory obligations | [Date verified] | Operational obligation guidance |
| SOCI-4 | Responsible Entity CIRMP annual report guidance | [Date verified] | Annual reporting and approval expectation |
| SOCI-5 | Protected information under the SOCI Act | [Date verified] | Protected-information handling |
| AUE8 | ASD Essential Eight | [Version / date verified] | Cyber baseline evidence |
| AUISM | ASD Information Security Manual | [Edition / date verified] | Control evidence cross-reference |

---

## Visual Evidence Decision Rule

Generate companion visual artefacts only when the available evidence includes enough structure to identify real nodes and relationships. If evidence is incomplete but structurally useful, create a clearly marked draft visual with `Pending Input` labels. If structural evidence is insufficient, do not create a diagram; record a Visual Evidence Gap and list the minimum inputs needed.

---

**Generated by**: ArcKit `/arckit:au-soci-cirmp` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
