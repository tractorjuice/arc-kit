# ASD Operational Technology Cyber Security Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-ot-security`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line, where applicable, MUST be: -->
<!-- | Classification | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-ot-security` command | PENDING | PENDING |

---

## Executive Summary

[Summarise the OT environment, operational impact, safety constraints, overall OT cyber posture, key connectivity risks, and the top remediation priorities.]

---

## OT Environment Context

| Field | Value |
|-------|-------|
| **System / Environment Name** | [Name] |
| **Operational Function** | [SCADA / ICS / BMS / field telemetry / industrial process / other] |
| **Business Owner** | [Name / role] |
| **Operational Owner** | [Name / role] |
| **Safety Owner** | [Name / role] |
| **Cyber Owner** | [Name / role] |
| **Classification** | [UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / N/A] |
| **Critical Infrastructure Relevance** | [Yes / No / To be assessed] |
| **Safety Impact** | [Human safety / environmental / public service / operational continuity / none] |
| **Availability Requirement** | [RTO / RPO / maximum tolerable outage] |
| **Assessment Date** | [YYYY-MM-DD] |

---

## ASD OT Guidance Alignment

| Guidance Area | Current Position | Evidence | Gap | Action |
|---------------|------------------|----------|-----|--------|
| Principles of OT cyber security | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| Definitive OT architecture view | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| Secure OT connectivity | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| AI in OT, if applicable | [N/A / Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| ISM / E8 cross-reference | [Implemented / Partial / Gap] | [AUISM / AUE8 references] | [Gap] | [Action] |

---

## Definitive OT Architecture View

| Required View | Status | Evidence | Owner | Review Cadence |
|---------------|--------|----------|-------|----------------|
| OT asset inventory | [Current / Partial / Missing] | [CMDB / OT inventory / diagrams] | [Owner] | [Cadence] |
| Data flows and protocols | [Current / Partial / Missing] | [Network map / flow matrix] | [Owner] | [Cadence] |
| Connectivity paths | [Current / Partial / Missing] | [Firewall rules / remote-access register] | [Owner] | [Cadence] |
| Trust boundaries | [Current / Partial / Missing] | [Zone model / conduit diagram] | [Owner] | [Cadence] |
| Supplier access paths | [Current / Partial / Missing] | [Supplier register / PAM records] | [Owner] | [Cadence] |
| Safety dependencies | [Current / Partial / Missing] | [Safety case / operations manual] | [Owner] | [Cadence] |

---

## ArcKit Architecture Evidence Map

| Evidence Area | ArcKit Artefact | How It Supports OT Assessment | Gap / Follow-up |
|---------------|-----------------|-------------------------------|-----------------|
| Architecture diagrams | `/arckit:diagram` / ARC-*-DIAG-* | Context, container, deployment, network zone, and trust-boundary evidence | [Gap / follow-up] |
| Data flow diagrams | `/arckit:dfd` / ARC-*-DFD-* | OT data flows, protocols, stores, ingress/egress, and cross-boundary transfers | [Gap / follow-up] |
| Data model | `/arckit:data-model` / ARC-*-DATA-* | OT telemetry, event, asset, configuration, maintenance, and personal-information entities | [Gap / follow-up] |
| ServiceNow / CMDB | `/arckit:servicenow` / ARC-*-SNOW-* | CMDB CIs, ownership, support groups, SLAs, incident routing, and change controls | [Gap / follow-up] |
| Risk register | `/arckit:risk` / ARC-*-RISK-* | Residual OT cyber, safety, availability, and supplier-access risks | [Gap / follow-up] |
| Traceability matrix | `/arckit:traceability` / ARC-*-TRAC-* | Mapping from requirements to diagrams, flows, controls, risks, and recommendations | [Gap / follow-up] |
| Graph report | `/arckit:graph-report` | Coverage view across AU compliance, architecture, risk, traceability, and operations artefacts | [Gap / follow-up] |
| Maturity model | `/arckit:maturity-model` | Maturity view across architecture visibility, connectivity, monitoring, suppliers, and recovery | [Gap / follow-up] |

---

## IT/OT Segmentation and Trust Boundaries

[Describe zones, conduits, DMZs, jump hosts, PAWs, protocol gateways, firewall policy, monitoring points, and any direct or temporary exceptions.]

| Boundary | Purpose | Control | Monitoring | Residual Risk |
|----------|---------|---------|------------|---------------|
| [Boundary] | [Purpose] | [Control] | [Monitoring] | [Risk] |

---

## Secure Connectivity and Remote Access

| Connectivity Pattern | Business Case | Exposure | Control Position | Gap / Risk |
|----------------------|---------------|----------|------------------|------------|
| Vendor remote support | [Required / not required] | [Inbound / brokered / outbound only] | [MFA / PAM / JIT / logging] | [Gap] |
| OT-to-enterprise data flow | [Purpose] | [Boundary] | [Gateway / broker / protocol validation] | [Gap] |
| Cloud or SaaS integration | [Purpose] | [Boundary] | [Outbound / DMZ / API gateway] | [Gap] |
| Emergency access | [Purpose] | [Boundary] | [Break-glass process] | [Gap] |
| Obsolete device connectivity | [Purpose] | [Boundary] | [Compensating controls] | [Gap] |

---

## Supplier and Managed-Service Access

| Supplier / Provider | Access Needed | Privilege Level | Control Evidence | Review Cadence |
|---------------------|---------------|-----------------|------------------|----------------|
| [Supplier] | [Access] | [Privilege] | [Contract / PAM / logs] | [Cadence] |

---

## Monitoring, Logging, and Incident Response

| Capability | Current Position | Evidence | Gap | Action |
|------------|------------------|----------|-----|--------|
| OT event logging | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| Boundary monitoring | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| SOC integration | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| Operational escalation | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| Isolation / containment | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |
| Recovery / manual fallback | [Implemented / Partial / Gap] | [Evidence] | [Gap] | [Action] |

---

## Safety, Availability, and Recovery Constraints

[Document constraints that affect patching, isolation, monitoring, authentication, remote access, testing, and recovery. Include safety owner approval requirements.]

---

## AI-in-OT Considerations

| Question | Answer | Evidence / Follow-up |
|----------|--------|----------------------|
| Is AI used in OT monitoring, control, prediction, optimisation, or maintenance? | [Yes / No / Planned] | [Evidence] |
| Has an OT business case for AI been approved? | [Yes / No / N/A] | [Evidence] |
| Are AI outputs safety-impacting or advisory only? | [Safety-impacting / Advisory / N/A] | [Evidence] |
| Are testing, monitoring, human oversight, and failsafe mechanisms defined? | [Yes / Partial / No / N/A] | [Evidence] |
| Does this trigger `/arckit:au-ai-assurance`? | [Yes / No] | [Reason] |

---

## ISM and E8 Cross-Reference

| Artefact | Reference | How Used |
|----------|-----------|----------|
| AUE8 | [ARC-{P}-AUE8-v*] | Enterprise cyber baseline; note OT constraints and compensating controls |
| AUISM | [ARC-{P}-AUISM-v*] | ISM control evidence for IT/OT systems, monitoring, gateways, data transfer, incidents |
| RISK | [ARC-{P}-RISK-v*] | Residual OT risks and treatment plan |
| AUSOCI | [ARC-{P}-AUSOCI-v* if present] | CIRMP cyber and information security hazard evidence |

---

## Operations, CMDB, and Traceability Integration

| Integration Point | Source Artefact | Target Artefact / Register | Evidence to Maintain |
|-------------------|-----------------|----------------------------|----------------------|
| OT component ownership | ARC-*-DIAG-* / ARC-*-SNOW-* | CMDB CI owner and support group | [Owner / support group / SLA] |
| OT flow and dependency | ARC-*-DFD-* / ARC-*-DATA-* | CMDB relationship and traceability row | [Flow / data entity / dependency] |
| OT finding | ARC-*-AUOT-* | Risk register and maturity-model assessment | [Risk ID / maturity domain] |
| OT control gap | ARC-*-AUISM-* / ARC-*-AUE8-* | Traceability matrix and graph-report coverage | [Control / requirement / evidence status] |

---

## Recommendations

| Priority | Action | Owner | Due Date | Evidence Update | Residual Risk |
|----------|--------|-------|----------|-----------------|---------------|
| Immediate | [Action] | [Owner] | [Date] | [Artefact / control] | [Risk] |
| 30-90 days | [Action] | [Owner] | [Date] | [Artefact / control] | [Risk] |
| 90-180 days | [Action] | [Owner] | [Date] | [Artefact / control] | [Risk] |
| Strategic | [Action] | [Owner] | [Date] | [Artefact / control] | [Risk] |

Note any sector-specific obligations separately in the relevant sector overlay or custom command.

---

## External References

| Ref | Source | Version / Date Verified | Relevance |
|-----|--------|-------------------------|-----------|
| OT-1 | ASD / ACSC Operational Technology environments | [Date verified] | OT guidance landing page |
| OT-2 | Principles of operational technology cyber security | [Date verified] | Safety, availability, and OT cyber principles |
| OT-3 | Creating and maintaining a definitive view of your operational technology architecture | [Date verified] | Architecture visibility and asset/data-flow record |
| OT-4 | Secure connectivity principles for Operational Technology | [Date verified] | Connectivity, exposure, remote access, and boundary controls |
| OT-5 | Principles for the secure integration of Artificial Intelligence in Operational Technology | [Date verified / N/A] | AI-in-OT governance and safeguards |
| AUISM | ASD Information Security Manual | [Edition / date verified] | Control evidence cross-reference |
| AUE8 | ASD Essential Eight | [Version / date verified] | Enterprise cyber baseline |

---

## Visual Evidence Decision Rule

Generate companion visual artefacts only when the available evidence includes enough structure to identify real nodes and relationships. If evidence is incomplete but structurally useful, create a clearly marked draft visual with `Pending Input` labels. If structural evidence is insufficient, do not create a diagram; record a Visual Evidence Gap and list the minimum inputs needed.

---

**Generated by**: ArcKit `/arckit:au-ot-security` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
