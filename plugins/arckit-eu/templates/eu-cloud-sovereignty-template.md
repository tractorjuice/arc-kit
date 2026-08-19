# EU Cloud Sovereignty Framework Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:eu-cloud-sovereignty`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:eu-cloud-sovereignty` | [PENDING] | [PENDING] |

## Executive Summary

**Assessment context**: [Tender minimum-setting / Candidate service assessment / Both]

**Framework version**: EU Cloud Sovereignty Framework v1.2.1 (October 2025)

**Overall SEAL**: [SEAL-0 to SEAL-4] — the lowest SEAL evidenced across all eight objectives, a minimum never an average or mode (Implementation guidance p.9). Governing objective: [SOV-n — objective name]. Governing criterion: [contributing factor that set the minimum]. This is the framework's actual rejection gate — see Section 3.3.

**Sovereignty Score**: [N]% (weighted award-criterion contribution, used only to compare offers that have already reached the minimum SEAL — see Section 3)

**Verification status**: [N] of 8 objectives evidenced; [N] remain self-declared/unverified claims

| Objective | Weight | SEAL Claimed | SEAL Evidenced | Minimum SEAL (tender) | Meets Minimum? |
|-----------|--------|-------------|-----------------|------------------------|-----------------|
| SOV-1 Strategic Sovereignty | 15% | [SEAL-0 to SEAL-4] | [SEAL-0 to SEAL-4] | [SEAL / Not yet set] | ☐ |
| SOV-2 Legal & Jurisdictional Sovereignty | 10% | [SEAL] | [SEAL] | [SEAL / Not yet set] | ☐ |
| SOV-3 Data & AI Sovereignty | 10% | [SEAL] | [SEAL] | [SEAL / Not yet set] | ☐ |
| SOV-4 Operational Sovereignty | 15% | [SEAL] | [SEAL] | [SEAL / Not yet set] | ☐ |
| SOV-5 Supply Chain Sovereignty | 20% | [SEAL] | [SEAL] | [SEAL / Not yet set] | ☐ |
| SOV-6 Technology Sovereignty | 15% | [SEAL] | [SEAL] | [SEAL / Not yet set] | ☐ |
| SOV-7 Security & Compliance Sovereignty | 10% | [SEAL] | [SEAL] | [SEAL / Not yet set] | ☐ |
| SOV-8 Environmental Sustainability | 5% | [SEAL] | [SEAL] | [SEAL / Not yet set] | ☐ |

> ⚠️ This document is an **assessment record**, not a certification. There is no published EU list of providers assessed against this framework — no commercial cloud provider is named as sovereign, compliant, or achieving any SEAL level in this document.

---

## 1. Procurement Context and Scope

### 1.1 Assessment Context

[Describe whether this document defines minimum SEAL levels for a forthcoming tender specification, assesses an already-specified or candidate service, or both]

### 1.2 Cloud Service and Workload

| Attribute | Value |
|-----------|-------|
| Cloud service type | [IaaS / PaaS / SaaS / Edge] |
| Workload description | [Description] |
| Data sensitivity classification | [Classification] |
| Member state(s) of operation | [Member state(s)] |
| National sovereignty programme (if any) | [e.g. NDS Cloudprogramma / None identified] |

## 2. Minimum Assurance Levels (Tender Specification)

> ⚠️ **Critical distinction**: Minimum SEAL levels below are set by the **contracting authority** in the tender specification as a Minimum Assurance Level. They are **not** fixed by the EU Cloud Sovereignty Framework itself — the framework defines the objectives, weights, and SEAL scale, not the pass threshold for any given procurement. A tender that does not consistently reach the required minimum across all objectives is rejected.

| Objective | Minimum SEAL Required | Source |
|-----------|------------------------|--------|
| SOV-1 Strategic Sovereignty | [SEAL-0 to SEAL-4 / Not yet set by contracting authority] | [Tender specification reference / —] |
| SOV-2 Legal & Jurisdictional Sovereignty | [SEAL] | [Source] |
| SOV-3 Data & AI Sovereignty | [SEAL] | [Source] |
| SOV-4 Operational Sovereignty | [SEAL] | [Source] |
| SOV-5 Supply Chain Sovereignty | [SEAL] | [Source] |
| SOV-6 Technology Sovereignty | [SEAL] | [Source] |
| SOV-7 Security & Compliance Sovereignty | [SEAL] | [Source] |
| SOV-8 Environmental Sustainability | [SEAL] | [Source] |

## 3. Sovereignty Score — Methodology and Result

### 3.0 SEAL Level Definitions

| Level | Name | Definition |
|-------|------|------------|
| SEAL-0 | No Sovereignty | Service, technology or operations under exclusive control of non-EU third parties, governed entirely in non-EU jurisdictions |
| SEAL-1 | Jurisdictional Sovereignty | EU law formally applies with limited practical enforceability; service, technology or operations under exclusive control of non-EU third parties |
| SEAL-2 | Data Sovereignty | EU law applicable and enforceable, with material non-EU dependencies remaining; under indirect control of non-EU third parties |
| SEAL-3 | Digital Resilience | EU law applicable and enforceable, EU actors exercising meaningful but not full influence; under marginal control of non-EU third parties |
| SEAL-4 | Full Digital Sovereignty | Technology and operations under complete EU control, subject only to EU law, with no critical non-EU dependencies |

### 3.0b Per-Objective SEAL Requirements (SEAL-2 to SEAL-4)

> **Note**: This table reproduces Implementation guidance p.10 and starts at SEAL-2 because SEAL-2 was the minimum level set for the Commission's own competition — the table below is that worked example's requirements, not a floor the framework itself imposes. A tender with a lower stated minimum (SEAL-0 or SEAL-1) is still assessable: fall back to the general SEAL level definitions in 3.0 for those levels rather than reading the missing rows as "not assessable."

| Objective | SEAL-2 | SEAL-3 | SEAL-4 |
|-----------|--------|--------|--------|
| SOV-1 Strategic Sovereignty | An autonomous entity in its organization, but not in its technical choices. The service continues but no longer has access to updates and security patches in the event of a break in access to the underlying technology. | Access to the roadmap. Complete guarantee of operations continuity. | Decision-making centres exclusively in the EU. Priority European customers in roadmap arbitrations. |
| SOV-2 Legal & Jurisdictional Sovereignty | Isolation by creating separate entities. Limited exposure to export control-type measures. | Complete insulation guaranteeing the inapplicability of non-EU legislation. No exposure of Member States to export control measures. | Operations are designed and carried out exclusively in the EU. Protection of international institutions against export control measures. |
| SOV-3 Data & AI Sovereignty | Full control of the data, including encryption control, data localization and deletion guarantee. Logs available. | EU design AI. Logs recorded in real time in the EU. | Immutability of logs, audits carried out by European teams. |
| SOV-4 Operational Sovereignty | Operations carried out and documented locally. Expertise from outside the EU may be necessary. Open and documented alternatives exist. | Availability of expertise in Europe, including subcontractors. Processes are designed and documented locally. | Complete European autonomy, including security clearances and the integration of key skills of subcontractors. |
| SOV-5 Supply Chain Sovereignty | Majority of the supply chains are documented. Deployments are carried out locally, according to procedures that can be external. Critical suppliers and subcontractors can be audited. | The majority of services are designed in the EU. They are deployed and orchestrated locally. No subcontractors involved in critical services. | EU-certified components origin. EU design, build and compliance check. No dependence on non-EU suppliers. Complete auditability of suppliers and subcontractors. |
| SOV-6 Technology Sovereignty | The services are partially interoperable. HPC is hosted on-premises. | European and public standards for core services. Open-source majority and predominance of European contributors. Auditability of the architecture. | Full compliance: EU Open AI, public standard, open source. |
| SOV-7 Security & Compliance Sovereignty | EAL2 level security. Local operations, transparent and immediate feedback of information, audits allowed. | ELA 3. | EAL 4-5, ENISA integration, immutable logs. |
| SOV-8 Environmental Sustainability | Documented and transparent approach. | *(not specified in source)* | EU-certified lifecycle, EU-audited reporting. |

**Formula**: Sovereignty Score = Σ over the eight objectives of (Score(SOVn) / Max.Score(SOVn)) × Weight(SOVn), expressed as a percentage.

### 3.1 Objective Weights

| Objective | Weight |
|-----------|--------|
| SOV-1 Strategic Sovereignty | 15% |
| SOV-2 Legal & Jurisdictional Sovereignty | 10% |
| SOV-3 Data & AI Sovereignty | 10% |
| SOV-4 Operational Sovereignty | 15% |
| SOV-5 Supply Chain Sovereignty | 20% |
| SOV-6 Technology Sovereignty | 15% |
| SOV-7 Security & Compliance Sovereignty | 10% |
| SOV-8 Environmental Sustainability | 5% |
| **Total** | **100%** |

### 3.2 Scored Result

| Objective | Score | Max Score | Weight | Weighted Contribution |
|-----------|-------|-----------|--------|-------------------------|
| SOV-1 Strategic Sovereignty | [Score] | [Max] | 15% | [%] |
| SOV-2 Legal & Jurisdictional Sovereignty | [Score] | [Max] | 10% | [%] |
| SOV-3 Data & AI Sovereignty | [Score] | [Max] | 10% | [%] |
| SOV-4 Operational Sovereignty | [Score] | [Max] | 15% | [%] |
| SOV-5 Supply Chain Sovereignty | [Score] | [Max] | 20% | [%] |
| SOV-6 Technology Sovereignty | [Score] | [Max] | 15% | [%] |
| SOV-7 Security & Compliance Sovereignty | [Score] | [Max] | 10% | [%] |
| SOV-8 Environmental Sustainability | [Score] | [Max] | 5% | [%] |
| **Sovereignty Score** | | | | **[N]%** |

> **Context**: The Sovereignty Score contributes to the tender's quality score as an **award criterion**. This is separate from, and does not override, the minimum-SEAL rejection gate in Section 2 — a high Sovereignty Score does not excuse failing a stated minimum SEAL on any single objective.

### 3.3 Overall SEAL Determination

The framework defines an aggregate SEAL, and it is a **minimum** — never an average and never a mode. Two levels of the derivation apply, cited separately:

- **Per-objective SEAL** = the minimum SEAL across every criterion answered within that objective (see each objective's "SEAL evidenced" in Section 4). This level is a property of the framework; the Annex calculator does not compute it, and the workbook holds no per-objective SEAL cell.
- **Overall SEAL** = the minimum SEAL evidenced across all eight objectives. Implementation guidance p.9, quoted verbatim: "The overall SEAL level is **the lowest SEAL level achieved in any of the objectives**." The Annex calculator XLSX implements exactly this at cell F2: `="SEAL-"&MIN(H5:H251)` — the workbook's only `MIN()`, spanning every answer row across all eight objectives, where each row's SEAL is `=IF(E<n>,1*F<n>,"")`.

These two levels agree only because an objective's SEAL is itself the minimum across its criteria — the Overall SEAL is a minimum-of-minimums.

> **Inert-criterion property** (Implementation guidance p.9, quoted verbatim): "When all responses grant SEAL-4, it must be understood that the criterion has no impact on the SEAL calculation." A criterion whose every recorded answer is SEAL-4 can never bind the minimum and can never be the governing criterion below — it still contributes to the weighted Sovereignty Score in Section 3.2, but it is inert for this gate.

> **Prevalence of SEAL over Sovereignty Score** (Implementation guidance p.10, quoted verbatim): "It is important to emphasize the prevalence of the SEAL criterion over the Sovereignty Score. In the context of cloud services procurement, the Contracting Authority decides what is the minimum SEAL required. Sovereignty score is used to compare the offers that have reached the minimum required SEAL." The **Overall SEAL below, not the Sovereignty Score above, is the framework's actual rejection gate** against the tender's stated minimum.

| Field | Value |
|-------|-------|
| **Overall SEAL** | [SEAL-0 to SEAL-4] |
| Governing objective | [SOV-n — objective name] |
| Governing criterion | [Contributing factor within that objective that set the minimum] |
| Basis | [Cross-reference to the governing objective's evidence table in Section 4] |

> **SEAL-4 attainability caveat** — European Commission, Implementation guidance for the EU Cloud Sovereignty Framework, "Lessons learnt" (p.13, published 1 June 2026), quoted verbatim: "The level SEAL-4, however relevant, since it describes the highest level of Sovereignty, is not today relevant in the context of EU Sovereignty considering existing dependence to specific supply chains (chips, hardware). Relaxing the level SEAL-4, at least temporarily, would allow to make more difference between providers, especially when it comes to sensitiveness to hostile take-overs." The Commission frames this as a limitation of the current framework version that it proposes to revisit, not a permanent property of SEAL-4 — it does not change how the Overall SEAL above is computed.

## 4. Objective-by-Objective Assessment

> **SEAL evidenced**, per objective below, is the minimum SEAL across every contributing factor evidenced in that objective's table — never an average. Name the binding contributing factor explicitly where it is not obvious; Section 3.3 cites it as the "governing criterion" for whichever objective sets the Overall SEAL.

### 4.1 SOV-1 Strategic Sovereignty (Weight: 15%)

**SEAL claimed**: [SEAL-0 to SEAL-4] | **SEAL evidenced**: [SEAL-0 to SEAL-4]

| Contributing Factor | Evidence | Status |
|----------------------|----------|--------|
| EU jurisdiction of bodies with decisive authority over the service | [Evidence] | ☐ |
| Assurances against change of control | [Evidence] | ☐ |
| Reliance on EU-sourced financing | [Evidence] | ☐ |
| Investment, jobs and value creation in the EU | [Evidence] | ☐ |
| Ability to sustain secure operations against cessation/suspension requests or vendor support withdrawal | [Evidence] | ☐ |

**Gaps**: [Gap description]

### 4.2 SOV-2 Legal & Jurisdictional Sovereignty (Weight: 10%)

**SEAL claimed**: [SEAL] | **SEAL evidenced**: [SEAL]

| Contributing Factor | Evidence | Status |
|----------------------|----------|--------|
| National legal system governing operations and contracts | [Evidence] | ☐ |
| Exposure to non-EU laws with cross-border reach (e.g. US CLOUD Act, Chinese Cybersecurity Law) | [Evidence] | ☐ |
| Legal, contractual or technical channels for non-EU compelled access | [Evidence] | ☐ |
| Applicability of international regimes restricting usage or transfer | [Evidence] | ☐ |
| Location and jurisdiction of IP creation and registration | [Evidence] | ☐ |

**Gaps**: [Gap description]

### 4.3 SOV-3 Data & AI Sovereignty (Weight: 10%)

**SEAL claimed**: [SEAL] | **SEAL evidenced**: [SEAL]

| Contributing Factor | Evidence | Status |
|----------------------|----------|--------|
| Only the customer holds effective cryptographic access to their data | [Evidence] | ☐ |
| Visibility into when/where/by whom data is accessed, incl. AI model usage auditability and verifiable irreversible deletion | [Evidence] | ☐ |
| Strict confinement of storage/processing to European jurisdictions, no third-country fallback | [Evidence] | ☐ |
| Extent of EU control over AI model and data pipeline development, training, hosting and governance | [Evidence] | ☐ |

**Gaps**: [Gap description]

### 4.4 SOV-4 Operational Sovereignty (Weight: 15%)

**SEAL claimed**: [SEAL] | **SEAL evidenced**: [SEAL]

| Contributing Factor | Evidence | Status |
|----------------------|----------|--------|
| Ease of migrating workloads to alternative EU-controlled solutions without lock-in | [Evidence] | ☐ |
| EU operator capacity to manage, maintain and support without non-EU vendor involvement | [Evidence] | ☐ |
| EU-based talent pool | [Evidence] | ☐ |
| Operational support delivered from within the EU under EU legal frameworks | [Evidence] | ☐ |
| Availability of full documentation, source code and operational know-how | [Evidence] | ☐ |
| Location and legal control of critical suppliers and subcontractors | [Evidence] | ☐ |

**Gaps**: [Gap description]

### 4.5 SOV-5 Supply Chain Sovereignty (Weight: 20%)

**SEAL claimed**: [SEAL] | **SEAL evidenced**: [SEAL]

| Contributing Factor | Evidence | Status |
|----------------------|----------|--------|
| Geographic source of key physical parts and manufacturing location | [Evidence] | ☐ |
| Jurisdiction and provenance of embedded code controlling hardware and firmware | [Evidence] | ☐ |
| Where and by whom software is architected, packaged, distributed and updated | [Evidence] | ☐ |
| Reliance on non-EU vendors, facilities or proprietary technologies | [Evidence] | ☐ |
| Visibility into the entire supplier and sub-supplier chain, including audit rights | [Evidence] | ☐ |

**Gaps**: [Gap description]

### 4.6 SOV-6 Technology Sovereignty (Weight: 15%)

**SEAL claimed**: [SEAL] | **SEAL evidenced**: [SEAL]

| Contributing Factor | Evidence | Status |
|----------------------|----------|--------|
| Integration through well-documented non-proprietary APIs and protocols | [Evidence] | ☐ |
| Adherence to publicly governed standards | [Evidence] | ☐ |
| Accessibility under open licences with rights to audit, modify and redistribute | [Evidence] | ☐ |
| Visibility into design and functioning, incl. architecture documentation and data flows | [Evidence] | ☐ |
| EU independence in high-performance computing, processors and accelerators | [Evidence] | ☐ |

**Gaps**: [Gap description]

### 4.7 SOV-7 Security & Compliance Sovereignty (Weight: 10%)

**SEAL claimed**: [SEAL] | **SEAL evidenced**: [SEAL]

| Contributing Factor | Evidence | Status |
|----------------------|----------|--------|
| EU and internationally recognised certifications (ISO, ENISA schemes) | [Evidence] | ☐ |
| Adherence to GDPR, NIS2, DORA and other EU frameworks | [Evidence] | ☐ |
| Security operations centres and response teams operating exclusively under EU jurisdiction | [Evidence] | ☐ |
| Customer/EU-authority ability to oversee logs, alerts and monitoring directly | [Evidence] | ☐ |
| Transparent EU-compliant breach reporting | [Evidence] | ☐ |
| Capacity to develop, test and apply security patches independently of non-EU vendors | [Evidence] | ☐ |
| Independent EU security and compliance audits with full access | [Evidence] | ☐ |

**Gaps**: [Gap description]

### 4.8 SOV-8 Environmental Sustainability (Weight: 5%)

**SEAL claimed**: [SEAL] | **SEAL evidenced**: [SEAL]

| Contributing Factor | Evidence | Status |
|----------------------|----------|--------|
| Energy-efficient infrastructure with measurable improvement targets | [Evidence] | ☐ |
| Circular-economy practices for hardware reuse, refurbishment and end-of-life | [Evidence] | ☐ |
| Transparent disclosure of carbon emissions and water usage | [Evidence] | ☐ |
| Sourcing of renewable or low-carbon energy | [Evidence] | ☐ |

**Gaps**: [Gap description]

## 5. Evidence Basis and Verification Status

> ⚠️ **A self-declared SEAL is an unverified claim** until this assessment records supporting evidence per objective. This document records an assessment; it does not certify.
>
> ⚠️ **No published EU list of assessed providers exists.** No commercial cloud provider is named as sovereign, compliant, or achieving any SEAL level in this document.

| Objective | Evidence Reviewed | Source | Assessor | Date |
|-----------|---------------------|--------|----------|------|
| SOV-1 | [Evidence] | [Source] | [Name] | [YYYY-MM-DD] |
| SOV-2 | [Evidence] | [Source] | [Name] | [YYYY-MM-DD] |
| SOV-3 | [Evidence] | [Source] | [Name] | [YYYY-MM-DD] |
| SOV-4 | [Evidence] | [Source] | [Name] | [YYYY-MM-DD] |
| SOV-5 | [Evidence] | [Source] | [Name] | [YYYY-MM-DD] |
| SOV-6 | [Evidence] | [Source] | [Name] | [YYYY-MM-DD] |
| SOV-7 | [Evidence] | [Source] | [Name] | [YYYY-MM-DD] |
| SOV-8 | [Evidence] | [Source] | [Name] | [YYYY-MM-DD] |

## 6. Member State Adoption Context

The EU Cloud Sovereignty Framework is being adopted as a national yardstick by member states. The Netherlands is the worked example documented here:

| Instrument | Detail |
|------------|--------|
| Notitie: Verkenning Overheidsbrede Soevereine Clouddiensten | NDS Cloudprogramma, v1.0, 11 June 2026 — adopts the framework as its sovereignty measure |
| Dutch SEAL rendering | SEAL0 Geen soevereiniteit; SEAL1 Jurisdictionele soevereiniteit; SEAL2 Data-soevereiniteit; SEAL3 Digitale veerkracht; SEAL4 Volledige digitale soevereiniteit |
| Target | SEAL4 for a government-wide sovereign cloud service |
| Application | Demand-side: a workplace requiring SEAL3 requires a cloud service reaching at least SEAL3 |
| Herziening rijksbreed cloudbeleid 2026 | Cites the framework as the instrument for limiting the risk of foreign-government interference in supplier selection |

[If this project is Dutch: state applicability directly. If not: note this section is for context/comparison and identify the relevant national programme if supplied by the user.]

## 7. Gap Analysis and Remediation Plan

| Gap | Objective | Against | Priority | Owner | Target Date |
|-----|-----------|---------|----------|-------|--------------|
| [Gap description] | [SOV-x] | [Minimum SEAL — rejection risk / Target SEAL — aspirational] | 🔴 High | [Owner] | [Date] |

## 8. Recommendation

**Status**: This document is an assessment record, not a certification.

**Recommendation**: [Proceed / Proceed conditionally / Do not proceed] with [rationale]

**Next steps**: [Legal/procurement counsel review / Formal evidence collection / Re-assessment cadence]

## 9. External References

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| WEB-1 | [full URL of the framework as published] | Web URL | [domain] | EU Cloud Sovereignty Framework v1.2.1 (October 2025) — sovereignty objectives, weights, and SEAL scale. Verified [YYYY-MM-DD] |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:eu-cloud-sovereignty` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
