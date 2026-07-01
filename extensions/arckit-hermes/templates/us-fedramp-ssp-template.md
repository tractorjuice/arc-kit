# FedRAMP System Security Plan (Moderate / High Baseline)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-fedramp-ssp`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-fedramp-ssp` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: cloud service offering (CSO) being described, baseline being targeted (Moderate / High), authorisation path (Agency / JAB / Tailored), current readiness state, and target ATO timeline.]

---

## Section 1 — System Identification

| Field | Value |
|-------|-------|
| **Cloud Service Offering (CSO) Name** | [CSO name] |
| **CSO Identifier** | [Unique product identifier] |
| **Cloud Service Provider (CSP) Name** | [CSP organisation] |
| **FedRAMP Package ID** | [FR-MOD-NNNNN — assigned upon submission] |
| **CSO Type** | [IaaS / PaaS / SaaS] |
| **Deployment Model** | [Government Community Cloud / Private Cloud / Hybrid] |
| **Authorisation Path** | [Agency ATO / JAB P-ATO / FedRAMP Tailored Low-Impact SaaS] |
| **Sponsoring Agency** | [Agency name (Agency path only)] |
| **Baseline Targeted** | [Moderate / High] |
| **Authorisation Boundary Diagram** | [Reference: ARC-{P}-DIAG-NNN-v*] |
| **Data Flow Diagram** | [Reference: ARC-{P}-DIAG-NNN-v*] |

---

## Section 2 — System Categorization

[Cross-reference the FIPS 199 categorization artefact (`ARC-{P}-FISMA-v*`). Summarise the high-water mark and the driving information types.]

| CIA Objective | Impact Level |
|---------------|--------------|
| Confidentiality | [Low / Moderate / High] |
| Integrity | [Low / Moderate / High] |
| Availability | [Low / Moderate / High] |
| **Overall (High-Water Mark)** | **[LOW / MODERATE / HIGH]** |

---

## Section 3 — System Owner & Authorising Official

| Role | Name | Title | Organisation | Email | Phone |
|------|------|-------|--------------|-------|-------|
| System Owner | [Name] | [Title] | [Org] | [Email] | [Phone] |
| Authorising Official (AO) | [Name] | [Title] | [Org] | [Email] | [Phone] |
| CSP Point of Contact (Technical) | [Name] | [Title] | [CSP] | [Email] | [Phone] |
| CSP Point of Contact (Management) | [Name] | [Title] | [CSP] | [Email] | [Phone] |
| ISSO | [Name] | [Title] | [Org] | [Email] | [Phone] |
| ISSM | [Name] | [Title] | [Org] | [Email] | [Phone] |
| CISO | [Name] | [Title] | [Org] | [Email] | [Phone] |
| 3PAO Lead | [Name] | [Title] | [3PAO firm] | [Email] | [Phone] |

---

## Section 4 — System Description

### Concept of Operations

[Describe what the system does, how it serves federal agency customers, and the operational model. Include the mission statement, primary use cases, and target user populations.]

### Customer Use Cases

| Use Case ID | Description | Customer Type | Data Sensitivity |
|-------------|-------------|---------------|------------------|
| UC-001 | [Use case] | [Federal civilian / DoD / SLT] | [Public / CUI / Other] |

### Customer Sectors Targeted

[Federal civilian, DoD, intelligence community, state/local/tribal, federal contractors, etc.]

---

## Section 5 — System Environment

### Architecture Overview

[High-level narrative of the system architecture. Reference the authorisation-boundary diagram and the data-flow diagram.]

**Authorisation Boundary Diagram**: [Embed or reference]

**Data Flow Diagram**: [Embed or reference]

### Components Inventory

| Component | Function | Vendor / Version | Hosted In | FedRAMP Inherited? |
|-----------|----------|------------------|-----------|--------------------|
| [Component] | [Function] | [Vendor + version] | [CSP region] | [Yes — Package ID / No] |

### Hardware / Software / Network Inventory

[Reference the full hardware, software, and network inventory artefact maintained per CM-8. Summarise the count of each asset class within the authorisation boundary.]

---

## Section 6 — System Interconnections

| Interconnected System | Owning Org | System Type (Internal / External) | Connection Method | Data Exchanged | ISA / MoU Reference | Authorisation Status |
|----------------------|-----------|------------------------------------|-------------------|----------------|---------------------|---------------------|
| [System] | [Org] | [Internal / External] | [API / VPN / Direct Connect / Public Internet] | [Data type + classification] | [ISA-NNN / MoU-NNN] | [ATO date / Pending] |

[List every interconnection that crosses the authorisation boundary.]

---

## Section 7 — Applicable Laws and Regulations

| Citation | Title | Applicability |
|----------|-------|---------------|
| FISMA 2014 | Federal Information Security Modernization Act | [Applies — all federal info systems] |
| FedRAMP | Federal Risk and Authorization Management Program | [Applies — CSP authorisation] |
| EO 14028 | Improving the Nation's Cybersecurity | [Applies — secure software, SBOM, EDR] |
| OMB M-22-09 | Federal Zero Trust Strategy | [Applies — ZTMM uplift required] |
| OMB M-22-18 | Enhancing the Security of the Software Supply Chain | [Applies — SSDF self-attestation] |
| OMB M-23-16 | Update on M-22-18 attestation | [Applies — attestation deadlines + CISA form] |
| OMB M-24-10 | Advancing Governance, Innovation, and Risk Management for Agency Use of AI | [Applies — if AI in use] |
| OMB M-25-21 | Acquisition of AI in the Federal Government | [Applies — if AI procured] |
| Privacy Act of 1974 (5 USC §552a) | Privacy Act | [Applies — if SoR triggered] |
| E-Government Act §208 | Privacy Impact Assessment requirement | [Applies — if PII processed] |
| FIPS 199 / FIPS 200 | Categorization + Minimum Security Requirements | [Applies] |
| Agency-Specific | [Departmental policy citation] | [Applies as overlay] |

---

## Section 8 — Minimum Security Controls

[Cross-reference the tailored 800-53 control set artefact (`ARC-{P}-NIST53-v*`). Summarise the baseline selection and the count of controls implemented / inherited / hybrid / not-applicable / planned. The full Tailoring Matrix lives in the 800-53 artefact; do not duplicate it here.]

| Source | Count |
|--------|-------|
| FedRAMP [Moderate / High] baseline controls | [Count] |
| Implemented | [Count] |
| Inherited from CSP | [Count] |
| Hybrid | [Count] |
| Planned (POA&M tracked) | [Count] |
| Not Applicable | [Count] |

---

## Section 9 — Types of Users

| User Role | Description | Internal / External | Privileged? | Authentication Assurance (IAL / AAL / FAL) | Training Required |
|-----------|-------------|---------------------|-------------|--------------------------------------------|--------------------|
| [Role] | [Description] | [Internal / External] | [Yes / No] | [IAL2 / AAL2 / FAL2] | [Annual privacy + security] |
| Administrator | [System administration] | [Internal] | [Yes] | [IAL3 / AAL3 / FAL2] | [Annual + role-specific] |
| End User | [Customer agency user] | [External] | [No] | [IAL2 / AAL2 / FAL2] | [Agency-managed] |
| Auditor | [3PAO / IG] | [External] | [Read-only Privileged] | [IAL3 / AAL3 / FAL2] | [Annual] |

---

## Section 10 — Network Architecture

### Subnet / Segmentation Diagram

[Reference diagram artefact. Show VPC / VNet, subnet tiers (public, private, data), security groups, and trust zones.]

### Segmentation Strategy

| Zone | Purpose | Trust Level | Inbound | Outbound |
|------|---------|-------------|---------|----------|
| Public DMZ | [Load balancers, WAF] | [Low — Internet-exposed] | [HTTPS 443] | [Restricted to app tier] |
| Application Tier | [Workloads] | [Moderate] | [From DMZ only] | [Data tier + egress proxy] |
| Data Tier | [Databases] | [High] | [App tier only] | [None — except backup] |
| Management Tier | [Admin jump hosts] | [High] | [VPN / SSO only] | [Restricted to mgmt plane] |

[Describe encryption-in-transit posture (TLS 1.2 minimum, TLS 1.3 preferred), east-west encryption strategy, and any private-link / service-endpoint configurations.]

---

## Section 11 — Control Implementations

For each control family, document implementation narratives. Full control-by-control narrative lives in the OSCAL representation; this section is a per-family summary.

### AC — Access Control

[Narrative summarising the family-level implementation: identity store, MFA posture, account lifecycle, privileged access. Reference ICAM artefact.]

### AT — Awareness and Training

[Annual security + privacy training programme, role-based training, phishing simulations.]

### AU — Audit and Accountability

[Audit log collection, SIEM, retention, SOC review cadence.]

### CA — Assessment, Authorization, and Monitoring

[Assessment cadence, ConMon plan, ATO timeline.]

### CM — Configuration Management

[Baseline configurations, change management, configuration drift detection.]

### CP — Contingency Planning

[Contingency plan, backups, DR exercises, RTO/RPO.]

### IA — Identification and Authentication

[IdP, MFA, FIPS 140-3 validated cryptographic modules.]

### IR — Incident Response

[IR plan, IR team, US-CERT reporting cadence, IR testing.]

### MA — Maintenance

[Maintenance windows, remote maintenance controls.]

### MP — Media Protection

[Media handling, sanitisation, encryption-at-rest.]

### PE — Physical and Environmental Protection

[Inherited from CSP — reference CSP physical security attestation.]

### PL — Planning

[SSP, ConMon plan, IR plan, contingency plan, configuration management plan.]

### PM — Program Management

[Information security programme, risk management strategy.]

### PS — Personnel Security

[Background checks, position risk designation, separation procedures.]

### PT — PII Processing and Transparency

[Cross-ref PIA artefact (`ARC-{P}-PIA-v*`). Privacy notices, consent, opt-out.]

### RA — Risk Assessment

[Risk assessment cadence, vulnerability scanning, threat modelling.]

### SA — System and Services Acquisition

[SDLC, secure development, supply-chain risk, EO 14028 SSDF self-attestation.]

### SC — System and Communications Protection

[Boundary protection, encryption, key management, DNSSEC.]

### SI — System and Information Integrity

[Flaw remediation, malware protection, monitoring, input validation.]

### SR — Supply Chain Risk Management

[SBOM, vendor assessment, EO 14028 attestations, FedRAMP-authorised dependencies.]

---

## Section 12 — Configuration Management

| Element | Reference |
|---------|-----------|
| Configuration Management Plan (CMP) | [Reference: CMP-NNN] |
| Baseline Configuration Definitions | [DISA STIG / CIS Benchmarks Level 1] |
| Change Control Board | [Cadence; voting members] |
| Configuration Item (CI) Inventory | [Reference] |
| Drift Detection Tool | [Tool name] |
| Drift Review Frequency | [Daily / Weekly] |

---

## Section 13 — Continuous Monitoring

| Activity | Frequency | Reporting Audience |
|----------|-----------|--------------------|
| Authenticated vulnerability scan | [Weekly] | [SOC + AO] |
| External / unauthenticated scan | [Monthly] | [SOC] |
| Configuration compliance scan | [Quarterly] | [Platform team + AO] |
| Penetration test | [Annual] | [AO + FedRAMP PMO] |
| POA&M review | [Monthly] | [AO + sponsoring agency] |
| Annual assessment (1/3 controls) | [Annual] | [AO + 3PAO + FedRAMP PMO] |
| ConMon deliverables to FedRAMP PMO | [Monthly] | [FedRAMP PMO] |

[Cross-ref the POA&M artefact for open findings.]

---

## Section 14 — Attachments Inventory

| Attachment | Document Title | Location / Reference |
|-----------|----------------|----------------------|
| Attachment 1 | Information Security Policies and Procedures | [Reference] |
| Attachment 2 | User Guide | [Reference] |
| Attachment 3 | Digital Identity Worksheet | [Reference] |
| Attachment 4 | Privacy Impact Assessment (PIA) | [ARC-{P}-PIA-v*] |
| Attachment 5 | Rules of Behavior (RoB) | [Reference] |
| Attachment 6 | Information System Contingency Plan (ISCP) | [Reference] |
| Attachment 7 | Configuration Management Plan (CMP) | [Reference] |
| Attachment 8 | Incident Response Plan (IRP) | [Reference] |
| Attachment 9 | Continuous Monitoring Plan (ConMon) | [Reference] |
| Attachment 10 | Plan of Action and Milestones (POA&M) | [Reference] |
| Attachment 11 | Authenticated Vulnerability Scan Reports | [Reference] |
| Attachment 12 | Penetration Test Report | [Reference] |
| Attachment 13 | Customer Responsibility Matrix (CRM) | [Reference] |
| Attachment 14 | FIPS 199 Categorization | [ARC-{P}-FISMA-v*] |
| Attachment 15 | Separation of Duties Matrix | [Reference] |
| Attachment 16 | Training Records | [Reference] |

---

## References

| Reference | Citation | URL |
|-----------|----------|-----|
| FedRAMP SSP Template (Rev 5) | FedRAMP System Security Plan Template | <https://www.fedramp.gov/documents-templates/> |
| FedRAMP Authorization Boundary Guidance | Authorization Boundary Guidance | <https://www.fedramp.gov/assets/resources/documents/Authorization_Boundary_Guidance.pdf> |
| NIST SP 800-37 Rev 2 | Risk Management Framework | <https://doi.org/10.6028/NIST.SP.800-37r2> |
| NIST SP 800-53 Rev 5 | Controls Catalog | <https://doi.org/10.6028/NIST.SP.800-53r5> |
| NIST SP 800-18 Rev 1 | Guide for Developing Security Plans | <https://doi.org/10.6028/NIST.SP.800-18r1> |

---

## Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| System Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| ISSO | [Name] | [Signature] | [YYYY-MM-DD] |
| ISSM | [Name] | [Signature] | [YYYY-MM-DD] |
| CISO | [Name] | [Signature] | [YYYY-MM-DD] |
| Authorising Official (AO) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-fedramp-ssp` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
