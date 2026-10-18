# FedRAMP System Security Plan (Moderate / High Baseline)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-fedramp-ssp`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-fedramp-ssp` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: cloud service offering (CSO) being described, baseline being targeted (Moderate / High), authorisation path (Agency / JAB / Tailored), current readiness state, and target ATO timeline.]

> **Structure**: this plan has 14 sections. Each one feeds a section or appendix of the FedRAMP Rev 5 SSP template (12 front-matter sections, Appendices A–Q); Section 14 maps every appendix to its source. FedRAMP marked that template legacy on 23 June 2026 under the FedRAMP Consolidated Rules for 2026 — confirm the template your submission must use on fedramp.gov.

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
| **Digital Identity Level** | [IAL2/AAL2/FAL2 / IAL3/AAL3/FAL3 — from the Digital Identity Worksheet] |
| **Operational Status** | [Operational / Under Development / Major Modification] |
| **Fully Operational as of** | [YYYY-MM-DD] |
| **Authorisation Boundary Diagram** | [Reference: ARC-{P}-DIAG-NNN-v*] |
| **Data Flow Diagram** | [Reference: ARC-{P}-DIAG-NNN-v*] |

---

## Section 2 — System Categorization

[Cross-reference the FIPS 199 categorization artefact (`ARC-{P}-FIPS199-v*`). Summarise the high-water mark and the driving information types.]

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

### Separation of Duties

[Security control AC-5. One row per duty, one column per role with access to the system; mark X where a role performs the duty. Add roles and duties as the system requires.]

| Duty | Information Owner | Security Officer | Privacy Officer | System Administrator | Agency Administrator | Agency Customer |
|------|-------------------|------------------|-----------------|----------------------|----------------------|-----------------|
| Adds / removes privileged administrators | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Adds / removes non-privileged administrators | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Adds / removes customer administrators | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Enforces physical access authorisations | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Defines least privilege needed to perform tasks | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Reviews / approves policy | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Enforces policy | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

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

### 6.1 Leveraged FedRAMP-Authorized Services

[Only services listed as Authorized on the FedRAMP Marketplace belong here; "In Process" and "FedRAMP Ready" are not authorizations. Leverage services at the same or a higher impact level.]

| CSP / CSO Name (as on the Marketplace) | Services and Features Used | Authorization Type and FedRAMP Package ID | Nature of Agreement | Impact Level | Data Types | Authorized Users / Authentication |
|----------------------------------------|----------------------------|-------------------------------------------|---------------------|--------------|------------|-----------------------------------|
| [CSP / CSO] | [Services] | [Agency / JAB — FR-NNNNN] | [EULA / SLA / contract] | [High / Moderate / Low / LI-SaaS] | [SP 800-60 data types] | [Roles + authentication method] |

### 6.2 External Systems and Services Without FedRAMP Authorization

[Every connection to a system, service, API or CLI that lacks a FedRAMP authorization at the same or higher impact level, including corporate shared services and update services. No overlap with 6.1.]

| System / Service / API / CLI | Category (Non-FedRAMP Cloud / Corporate Shared / Update Service) | Connection Details (Inbound / Outbound) | Data Types and Categorization | Other Compliance Programs | Risk / Impact / Mitigation |
|------------------------------|------------------------------------------------------------------|------------------------------------------|-------------------------------|---------------------------|----------------------------|
| [Name + vendor] | [Category] | [Direction + method] | [Data types — Low / Moderate / High] | [SOC 2 / ISO 27001 / none] | [Risk if its CIA is compromised; mitigation] |

### 6.3 Boundary Interconnections

| Interconnected System | Owning Org | FedRAMP Package ID | Agreement (ICA / MOU / ISA) | Data Direction | Ports / Protocols | Data Exchanged and Sensitivity | Authorisation Status |
|----------------------|-----------|--------------------|-----------------------------|----------------|-------------------|--------------------------------|----------------------|
| [System] | [Org] | [FR-NNNNN / N/A] | [ISA-NNN / MOU-NNN] | [Inbound / Outbound / Both] | [TCP 443 / HTTPS] | [Data type + classification] | [ATO date / Pending] |

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

[Cross-reference the tailored 800-53 control set artefact (`ARC-{P}-NIST-v*`). Summarise the baseline selection and the count of controls implemented / inherited / hybrid / not-applicable / planned. The full Tailoring Matrix lives in the 800-53 artefact; do not duplicate it here.]

| Source | Count |
|--------|-------|
| FedRAMP [Moderate / High] baseline controls | [Count] |
| Implemented | [Count] |
| Inherited from CSP | [Count] |
| Hybrid | [Count] |
| Planned (POA&M tracked) | [Count] |
| Not Applicable | [Count] |

### Control Origination and Customer Responsibility

[One row for every control that is not wholly Service Provider originated. This feeds the FedRAMP CIS/CRM Workbook (Appendix J).]

| Control ID | Implementation Status | Control Origination | Customer Responsibility |
|------------|-----------------------|---------------------|-------------------------|
| [AC-2] | [Implemented / Partial / Planned] | [Service Provider Corporate / SP System Specific / Configured by Customer / Provided by Customer / Shared / Inherited] | [What the customer agency must do — required for every Shared control] |

---

## Section 9 — Types of Users

| User Role | Description | Internal / External | Privileged? | Clearance / Citizenship Requirement | Authentication Mechanism | Authentication Assurance (IAL / AAL / FAL) | Training Required |
|-----------|-------------|---------------------|-------------|-------------------------------------|--------------------------|--------------------------------------------|--------------------|
| [Role] | [Description] | [Internal / External] | [Yes / No] | [None / Public Trust / US Persons] | [PIV / login.gov / federated] | [IAL2 / AAL2 / FAL2] | [Annual privacy + security] |
| Administrator | [System administration] | [Internal] | [Yes] | [Per agency requirement] | [PIV / phishing-resistant MFA] | [IAL3 / AAL3 / FAL2] | [Annual + role-specific] |
| End User | [Customer agency user] | [External] | [No] | [Per agency requirement] | [PIV / federated] | [IAL2 / AAL2 / FAL2] | [Agency-managed] |
| Auditor | [3PAO / IG] | [External] | [Read-only Privileged] | [Per agency requirement] | [PIV / federated] | [IAL3 / AAL3 / FAL2] | [Annual] |

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

### Services, Ports, and Protocols

[Every service, port and transport protocol enabled in the CSO (CM-7, CM-7(1)). Keep it consistent with the diagrams and Section 6.]

| Service Name | Port # | Transport Protocol | Ref # | Purpose | Used By |
|--------------|--------|--------------------|-------|---------|---------|
| [HTTPS] | [443] | [TCP] | [Ref # in the cryptographic modules table] | [Web access] | [Components] |

### Cryptographic Modules for Data at Rest and Data in Transit

[Every place cryptography protects federal data: data at rest, data in transit across and within the boundary, remote access and key management (SC-8, SC-8(1), SC-13, SC-28, SC-28(1)). Raise a POA&M item for any area without FIPS 140-validated cryptography. Feeds FedRAMP Appendix Q.]

| Ref # | Data Area or Flow | Source → Destination | Cryptographic Module | FIPS 140 Certificate # | Approved Mode Confirmed? |
|-------|-------------------|----------------------|----------------------|------------------------|--------------------------|
| [1] | [Data at rest — database] | [N/A] | [Module name + version] | [CMVP #NNNN] | [Yes / No — POA&M ref] |

---

## Section 11 — Control Implementations

For each control family, document implementation narratives. Full control-by-control narrative lives in Appendix A or the OSCAL representation; this section is a per-family summary.

NIST SP 800-53 Rev 5 has 20 control families. The FedRAMP Rev 5 baselines draw their controls from 18 of them: they include no PM (Program Management) or PT (PII Processing and Transparency) controls. Complete PM and PT only where the sponsoring agency assigns those controls — FedRAMP treats PM as an agency responsibility and leaves privacy controls to the agency, according to the data the system holds.

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

[Cross-ref PIA artefact (`ARC-{P}-USPIA-v*`). Privacy notices, consent, opt-out.]

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
| Web application scan | [Monthly] | [SOC + AppSec] |
| Container image scan | [Monthly / every build] | [SOC + Platform team] |
| Database scan | [Monthly] | [SOC + Data team] |
| Configuration compliance scan | [Quarterly] | [Platform team + AO] |
| Penetration test | [Annual] | [AO + FedRAMP PMO] |
| POA&M review | [Monthly] | [AO + sponsoring agency] |
| Annual assessment (1/3 controls) | [Annual] | [AO + 3PAO + FedRAMP PMO] |
| ConMon deliverables to FedRAMP PMO | [Monthly] | [FedRAMP PMO] |

[Cross-ref the POA&M artefact for open findings.]

---

## Section 14 — Appendices Inventory

The appendices the FedRAMP Rev 5 SSP template lists in its Section 12, with the source of each. Appendices C, D, F, G, H and I are not required for LI-SaaS.

| Appendix | Document Title | Source in This Plan | Location / Reference |
|----------|----------------|---------------------|----------------------|
| A | FedRAMP Security Controls (one template per baseline) | Sections 8 and 11 | [ARC-{P}-NIST-v*] + [Appendix A file] |
| B | Related Acronyms | — | [Reference] |
| C | Information Security Policies and Procedures | — | [Reference] |
| D | User Guide | — | [Reference] |
| E | Digital Identity Worksheet | Section 9 | [ARC-{P}-ICAM-v*] |
| F | Rules of Behavior (RoB) | — | [Reference] |
| G | Information System Contingency Plan (ISCP) | — | [Reference] |
| H | Configuration Management Plan (CMP) | Section 12 | [Reference] |
| I | Incident Response Plan (IRP) | — | [Reference] |
| J | Control Implementation Summary (CIS) and Customer Responsibility Matrix (CRM) Workbook | Section 8 | [Reference] |
| K | FIPS 199 Categorization | Section 2 | [ARC-{P}-FIPS199-v*] |
| L | CSO-Specific Laws and Regulations | Section 7 | [Reference] |
| M | Integrated Inventory Workbook (IIW) | Section 5 | [Reference] |
| N | Continuous Monitoring Plan | Section 13 | [Reference] |
| O | Plan of Action and Milestones (POA&M) | Section 13 | [Reference] |
| P | Supply Chain Risk Management Plan (SCRMP) | — | [Reference; SBOM evidence in ARC-{P}-SBOM-v*] |
| Q | Cryptographic Modules Table | Section 10 | [Reference] |

[The Rev 5 template has no Privacy Impact Assessment appendix. Where the agency requires its E-Government Act §208 PIA alongside the package, reference it separately: ARC-{P}-USPIA-v*.]

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
