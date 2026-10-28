# EO 14028 Secure-Software Self-Attestation + SBOM

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-sbom-eo-14028`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-sbom-eo-14028` command | PENDING | PENDING |

---

## Executive Summary

[Two paragraphs: the software in scope, what the acquiring agency requires under its software assurance policy and the contract (OMB M-26-05), the SSDF practices attested or evidenced, SBOM coverage against the CISA 2026 Minimum Elements, and delivery status.]

---

## 1. Producer / Software Information

| Field | Value |
|-------|-------|
| **Software Producer (Vendor)** | [Organisation name] |
| **Producer UEI / SAM Identifier** | [UEI from SAM.gov] |
| **Software Product Name** | [Product name] |
| **Product Version(s)** | [Version + build identifier] |
| **Software Identifier (CPE / PURL / SWID)** | [Identifier] |
| **Delivery Model** | [On-premises software / SaaS / IaaS- or PaaS-hosted application / Hybrid] |
| **Hardware Components** | [None / Yes — list] |
| **Federal Customer (Agency)** | [Agency] |
| **Contract / Order #** | [Contract number] |
| **Attestation Type (if the form is used)** | [Self-attestation / Third-party assessment / Form not used] |
| **Attestation Date (if the form is used)** | [YYYY-MM-DD] |

---

## 2. Agency Requirements (OMB M-26-05)

OMB M-26-05 (23 January 2026) rescinded M-22-18 and M-23-16. Agencies must keep a complete inventory of software and hardware and set software and hardware assurance policies that match their risk determinations and mission needs. Using the attestation form, and contract terms requiring an SBOM on request, are each the agency's choice.

| Item | Required for this product? | Source (agency policy / solicitation / contract clause) | Notes |
|------|----------------------------|---------------------------------------------------------|-------|
| Secure Software Development Attestation Form | [Yes / No] | [Reference] | [Agency choice under M-26-05] |
| SBOM provided on request | [Yes / No] | [Clause] | [For a cloud platform: SBOM of the runtime production environment] |
| Third-party (3PAO) assessment instead of a signed form | [Yes / No / Not applicable] | [Reference] | [Notes] |
| Hardware bill of materials (HBOM) | [Yes / No / Not applicable] | [Reference] | [CISA HBOM Framework, September 2023] |
| Other agency-specific artefacts | [List / None] | [Reference] | [Notes] |

**Where the agency asks for nothing**: [State it. Sections 4–7 then record the producer's own SSDF evidence and SBOM practice.]

### 2.1 Form Scope (only if the form is used)

| Test | Result | Notes |
|------|--------|-------|
| Developed after 14 September 2022 | [Yes / No] | [Notes] |
| Developed earlier, with a major version change after 14 September 2022 | [Yes / No] | [Notes] |
| Delivered by continuous change (e.g. SaaS, continuous delivery) | [Yes / No] | [Notes] |
| Excluded: developed by a federal agency; open-source software obtained freely and directly by an agency; third-party components incorporated into the product; freely obtained, publicly available software | [None apply / Which one] | [Notes] |

---

## 3. Secure Software Development Attestation Form (if the agency uses it)

CISA common form, OMB control number 1670-0052 (expires 31 March 2027). Agency-specific requirements, if any, go in an addendum.

### Section I — Attestation and Products

| Field | Value |
|-------|-------|
| Attestation | [New / Following extension or waiver / Revised] |
| Type | [Company-wide / Individual product / Multiple products or specific versions] |
| Product name(s), version number(s), release / publish date(s) | [List] |

### Section II — Software Producer Information

| Field | Value |
|-------|-------|
| Company name and address | [Name, address, city, state or province, postal code, country] |
| Company website | [URL] |
| Primary contact (individual, role or group) | [Name, title, address, phone, email] |

### Section III — Attestation and Signature

| # | Attestation item (as worded on the form) | Attested? | Evidence | EO 14028 §4(e) | SSDF practices and tasks |
|---|------------------------------------------|-----------|----------|----------------|--------------------------|
| 1a | Separating and protecting each environment involved in developing and building software | [Yes / No] | [Evidence] | 4e(i)(A) | PO.5.1 |
| 1b | Regularly logging, monitoring and auditing trust relationships used for authorization and access to development and build environments, and among components within each environment | [Yes / No] | [Evidence] | 4e(i)(B) | PO.5.1 |
| 1c | Enforcing multi-factor authentication and conditional access across the development and build environments | [Yes / No] | [Evidence] | 4e(i)(C) | PO.5.1, PO.5.2 |
| 1d | Documenting and minimising use or inclusion of software products that create undue risk within the development and build environments | [Yes / No] | [Evidence] | 4e(i)(D) | PO.5.1 |
| 1e | Encrypting sensitive data, such as credentials, to the extent practicable and based on risk | [Yes / No] | [Evidence] | 4e(i)(E) | PO.5.2 |
| 1f | Defensive cybersecurity practices, including continuous monitoring of operations and alerts and responding to suspected and confirmed cyber incidents | [Yes / No] | [Evidence] | 4e(i)(F) | PO.3.2, PO.3.3, PO.5.1, PO.5.2 |
| 2 | Good-faith effort to maintain trusted source code supply chains, using automated tools or comparable processes to address the security of internal code and third-party components and manage related vulnerabilities | [Yes / No] | [Evidence] | 4e(iii) | PO.1.1, PO.3.1, PO.3.2, PO.5.1, PO.5.2, PS.1.1, PS.2.1, PS.3.1, PW.4.1, PW.4.4, PW.7.1, PW.8.1, RV.1.1 |
| 3 | Provenance maintained for internal code and third-party components incorporated into the software, to the greatest extent feasible | [Yes / No] | [Evidence] | 4e(vi) | PO.1.3, PO.3.2, PO.5.1, PO.5.2, PS.3.1, PS.3.2, PW.4.1, PW.4.4, RV.1.1, RV.1.2 |
| 4a | Automated tools or comparable processes check for security vulnerabilities on an ongoing basis and before product, version or update releases | [Yes / No] | [Evidence] | 4e(iv) | Item 4: PO.4.1, PO.4.2, PS.1.1, PW.2.1, PW.4.4, PW.5.1, PW.6.1, PW.6.2, PW.7.1, PW.7.2, PW.8.2, PW.9.1, PW.9.2, RV.1.1, RV.1.2, RV.1.3, RV.2.1, RV.2.2, RV.3.3 |
| 4b | A policy or process to address discovered security vulnerabilities before product release | [Yes / No] | [Evidence] | 4e(iv) | As item 4 |
| 4c | A vulnerability disclosure programme that accepts, reviews and addresses disclosed vulnerabilities in a timely fashion | [Yes / No] | [Evidence] | 4e(iv) | As item 4 |

**Undertaking**: the producer will notify each agency it submitted the form to if it stops making consistent use of these practices.

**Signature**: [CEO or designee with authority to bind the company — name, title, date] **or** [Assessment by a FedRAMP-certified 3PAO, or another 3PAO approved in writing by an agency official, attached in place of the signature — assessor and reference]

---

## 4. Secure Development Practices (NIST SSDF SP 800-218 v1.1)

Evidence against the four SSDF practice groups: Prepare the Organisation (PO), Protect the Software (PS), Produce Well-Secured Software (PW), Respond to Vulnerabilities (RV). SSDF v1.2 (SP 800-218 Rev. 1) is an initial public draft (17 December 2025); use v1.1 until NIST publishes the final.

### PO — Prepare the Organisation

| SSDF Practice | Implemented? | Evidence |
|---------------|--------------|----------|
| PO.1 Define Security Requirements for Software Development | [Yes / No / Partial] | [Evidence] |
| PO.2 Implement Roles and Responsibilities | [Yes / No / Partial] | [Evidence] |
| PO.3 Implement Supporting Toolchains | [Yes / No / Partial] | [Evidence] |
| PO.4 Define and Use Criteria for Software Security Checks | [Yes / No / Partial] | [Evidence] |
| PO.5 Implement and Maintain Secure Environments for Software Development | [Yes / No / Partial] | [Evidence] |

### PS — Protect the Software

| SSDF Practice | Implemented? | Evidence |
|---------------|--------------|----------|
| PS.1 Protect All Forms of Code from Unauthorised Access and Tampering | [Yes / No / Partial] | [Evidence] |
| PS.2 Provide a Mechanism for Verifying Software Release Integrity | [Yes / No / Partial] | [Evidence] |
| PS.3 Archive and Protect Each Software Release | [Yes / No / Partial] | [Evidence] |

### PW — Produce Well-Secured Software

| SSDF Practice | Implemented? | Evidence |
|---------------|--------------|----------|
| PW.1 Design Software to Meet Security Requirements and Mitigate Security Risks | [Yes / No / Partial] | [Evidence] |
| PW.2 Review the Software Design to Verify Compliance with Security Requirements | [Yes / No / Partial] | [Evidence] |
| PW.4 Reuse Existing, Well-Secured Software When Feasible | [Yes / No / Partial] | [Evidence] |
| PW.5 Create Source Code by Adhering to Secure Coding Practices | [Yes / No / Partial] | [Evidence] |
| PW.6 Configure Compilation, Interpreter, and Build Processes to Improve Executable Security | [Yes / No / Partial] | [Evidence] |
| PW.7 Review and/or Analyse Human-Readable Code to Identify Vulnerabilities | [Yes / No / Partial] | [Evidence] |
| PW.8 Test Executable Code to Identify Vulnerabilities and Verify Compliance | [Yes / No / Partial] | [Evidence] |
| PW.9 Configure Software to Have Secure Settings by Default | [Yes / No / Partial] | [Evidence] |

### RV — Respond to Vulnerabilities

| SSDF Practice | Implemented? | Evidence |
|---------------|--------------|----------|
| RV.1 Identify and Confirm Vulnerabilities on an Ongoing Basis | [Yes / No / Partial] | [Evidence] |
| RV.2 Assess, Prioritise, and Remediate Vulnerabilities | [Yes / No / Partial] | [Evidence] |
| RV.3 Analyse Vulnerabilities to Identify Their Root Causes | [Yes / No / Partial] | [Evidence] |

---

## 5. SBOM Metadata

| Field | Value |
|-------|-------|
| **SBOM Scope** | [Product as shipped / Runtime production environment (cloud platform)] |
| **SBOM Author** | [Full name of the entity that generated the SBOM] |
| **SBOM Author Signature** | [Signature method + signing identity / key ID] |
| **SBOM Data Format Name** | [CycloneDX / SPDX] |
| **SBOM Data Format Version** | [e.g. CycloneDX 1.6 / SPDX 2.3 — not a deprecated version] |
| **SBOM Generation Context** | [Before build / Build / After build] |
| **SBOM Timestamp** | [RFC 9557 date-time] |
| **SBOM Tool Name** | [Tool — e.g. Syft / cdxgen / SPDX SBOM Generator] |
| **SBOM Tool Version** | [Version] |
| **SBOM Version** | [e.g. 1.0] |
| **SBOM Identifier** | [URN / UUID] |
| **SBOM Hash** | [SHA-256 of the SBOM file] |
| **SBOM Location** | [Repository URL / artefact reference] |

---

## 6. SBOM Minimum Elements Checklist (CISA 2026)

Per CISA's "2026 Minimum Elements for a Software Bill of Materials" (29 July 2026), which updates and replaces the NTIA Minimum Elements of July 2021. Where a value is not provided, say whether it is unknown to the SBOM author or withheld.

### 6.1 Data Fields

| Category | Element | Present? Y/N | Unknown / Withheld | Notes |
|----------|---------|--------------|--------------------|-------|
| SBOM metadata | SBOM Author | [Y/N] | [—] | [Notes] |
| SBOM metadata | SBOM Author Signature | [Y/N] | [—] | [Notes] |
| SBOM metadata | SBOM Data Format Name | [Y/N] | [—] | [Notes] |
| SBOM metadata | SBOM Data Format Version | [Y/N] | [—] | [Notes] |
| SBOM metadata | SBOM Generation Context | [Y/N] | [—] | [Notes] |
| SBOM metadata | SBOM Timestamp | [Y/N] | [—] | [Notes] |
| SBOM metadata | SBOM Tool Name | [Y/N] | [—] | [Notes] |
| SBOM metadata | SBOM Tool Version | [Y/N] | [—] | [Notes] |
| SBOM metadata | SBOM Version | [Y/N] | [—] | [Notes] |
| Component data | Component Producer | [Y/N] | [Count unknown / withheld] | [Notes] |
| Component data | Component Name | [Y/N] | [Count] | [Notes] |
| Component data | Component Version | [Y/N] | [Count] | [Notes] |
| Component data | Component Identifiers (CPE, PURL, others) | [Y/N] | [Count] | [Notes] |
| Component data | Component Hash Value | [Y/N] | [Count] | [Notes] |
| Component data | Component Hash Algorithm | [Y/N] | [Count] | [Notes] |
| Component data | Component License | [Y/N] | [Count] | [Notes] |
| Component data | Component Dependency Relationship | [Y/N] | [Count] | [Notes] |

### 6.2 Practices and Processes

| Element | Met? | How |
|---------|------|-----|
| Accommodation of Updates to SBOM Data | [Y/N] | [Correction process] |
| Coverage — all components, including transitive dependencies | [Y/N] | [Notes] |
| Distribution and Delivery | [Y/N] | [Delivery route and access controls] |
| Explicitly Identifying Unknown Information | [Y/N] | [Unknown vs withheld; process for recipients to ask about withheld data] |
| Frequency — a new SBOM for each build or release | [Y/N] | [Notes] |
| Machine-Processable Data | [Y/N] | [Format] |

**Coverage Summary**:

| Metric | Value |
|--------|-------|
| Total components in SBOM | [Count] |
| Components with every component data field present | [Count + %] |
| Components with one or more fields marked unknown or withheld | [Count + %] |
| Direct dependencies | [Count] |
| Transitive dependencies | [Count] |

---

## 7. Provenance Attestations

| Field | Value |
|-------|-------|
| **SLSA Build Level Achieved (v1.2)** | [Build L0 / L1 / L2 / L3] |
| **SLSA Source Level (v1.2, if claimed)** | [Not claimed / Source L1 / L2 / L3 / L4] |
| **SLSA Provenance Format** | [in-toto Statement v1] |
| **Provenance Signed By** | [Signing identity — Sigstore / GPG key ID] |
| **Signature Verified** | [Yes — verification command + output] |
| **Build Platform** | [GitHub Actions / Tekton Chains / Buildkit / other] |
| **Build Trigger** | [Tag / commit SHA] |
| **Builder Identity** | [Builder image + digest] |
| **In-toto Attestation Chain** | [Chain reference — attesting layers: source, build, deploy] |

[Reference the actual SLSA provenance document / in-toto attestation chain in `external/` or vendor portal.]

---

## 8. Gaps and POA&M

[Where a form item cannot be attested, or an SBOM term the agency asked for cannot be met. OMB M-26-05 sets no OMB extension or waiver process: the producer identifies the gap, documents the practices that mitigate the risk and submits a plan of action and milestones (POA&M), as the form's instructions describe, and the agency decides under its own risk-based policy.]

**Gaps?**: [Yes / No]

| Item (form item / SBOM element) | Reason | Mitigating Practices | POA&M ID | Target Completion | Agency Decision |
|---------------------------------|--------|----------------------|----------|-------------------|-----------------|
| [Item] | [Why it cannot be met] | [Mitigation] | [POA&M ID] | [YYYY-MM-DD] | [Accepted / Not accepted / Pending] |

---

## 9. Cross-Reference to NIST 800-53 SR (Supply Chain Risk) Family

| 800-53 Control | Mapping | Notes |
|----------------|---------|-------|
| SR-1 Policy and Procedures | [Cross-ref organisational SCRM policy] | [Notes] |
| SR-2 Supply Chain Risk Management Plan | [Cross-ref SCRM plan] | [Notes] |
| SR-3 Supply Chain Controls and Processes | [SSDF practices PO + PS] | [Notes] |
| SR-4 Provenance | [SLSA provenance + in-toto] | [Notes] |
| SR-5 Acquisition Strategies, Tools, and Methods | [Procurement contract clauses] | [Notes] |
| SR-6 Supplier Assessments and Reviews | [Vendor security review] | [Notes] |
| SR-8 Notification Agreements | [Vendor vulnerability-disclosure agreement] | [Notes] |
| SR-11 Component Authenticity | [Signed artefacts; signature verification] | [Notes] |

---

## 10. Distribution

| Recipient | Method | Date | Reference |
|-----------|--------|------|-----------|
| Acquiring agency (attestation, if required) | [As the agency's policy or contract specifies — e.g. signed PDF emailed to the agency] | [YYYY-MM-DD] | [Reference] |
| Agency Contracting Officer | [Contract delivery] | [YYYY-MM-DD] | [Contract / DO #] |
| Agency CISO / supply-chain risk function | [Email / portal] | [YYYY-MM-DD] | [Reference] |
| SBOM recipients | [On request / with the installation / version-specific URL / API] | [YYYY-MM-DD] | [Access controls] |

[CISA has archived the user guide for its online Repository for Software Attestations and Artifacts (RSAA), and softwaresecurity.cisa.gov did not resolve when checked on 28 October 2026; do not plan on lodging there.]

---

## 11. References

| Reference | Citation | URL |
|-----------|----------|-----|
| EO 14028 | Improving the Nation's Cybersecurity (12 May 2021), §4 | <https://www.federalregister.gov/d/2021-10460> |
| OMB M-26-05 | Adopting a Risk-based Approach to Software and Hardware Security (23 January 2026) | <https://www.whitehouse.gov/wp-content/uploads/2026/01/M-26-05-Adopting-a-Risk-based-Approach-to-Software-and-Hardware-Security.pdf> |
| EO 14306 | Sustaining Select Efforts to Strengthen the Nation's Cybersecurity (6 June 2025); amends EO 14144 | <https://www.federalregister.gov/d/2025-10804> |
| CISA Attestation Form | Secure Software Development Attestation Form (agency choice under M-26-05) | <https://www.cisa.gov/resources-tools/resources/secure-software-development-attestation-form> |
| CISA SBOM Minimum Elements | 2026 Minimum Elements for a Software Bill of Materials (29 July 2026) | <https://www.cisa.gov/resources-tools/resources/2026-minimum-elements-software-bill-materials-sbom> |
| CISA HBOM Framework | A Hardware Bill of Materials (HBOM) Framework for Supply Chain Risk Management (September 2023) | <https://www.cisa.gov/resources-tools/resources/hardware-bill-materials-hbom-framework-supply-chain-risk-management> |
| NIST SP 800-218 | Secure Software Development Framework (SSDF) v1.1 | <https://doi.org/10.6028/NIST.SP.800-218> |
| NIST SP 800-218 Rev. 1 | SSDF v1.2 — initial public draft (17 December 2025) | <https://csrc.nist.gov/pubs/sp/800/218/r1/ipd> |
| SLSA | Supply-chain Levels for Software Artifacts v1.2 (Build track L0–L3, Source track L1–L4) | <https://slsa.dev/spec/v1.2/> |
| CycloneDX | CycloneDX SBOM Standard | <https://cyclonedx.org/> |
| SPDX | SPDX SBOM Standard | <https://spdx.dev/> |
| OMB M-22-18 (rescinded) | Enhancing the Security of the Software Supply Chain through Secure Software Development Practices — rescinded by M-26-05; archived copy | <https://bidenwhitehouse.archives.gov/wp-content/uploads/2022/09/M-22-18.pdf> |
| OMB M-23-16 (rescinded) | Update to Memorandum M-22-18 — rescinded by M-26-05; archived copy | <https://bidenwhitehouse.archives.gov/wp-content/uploads/2023/06/M-23-16-Update-to-M-22-18-Enhancing-Software-Security.pdf> |

---

## 12. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Software Producer Signing Official (if the form is used) | [Name + title] | [Signature] | [YYYY-MM-DD] |
| Producer Security Officer | [Name] | [Signature] | [YYYY-MM-DD] |
| Agency Contracting Officer | [Name] | [Signature] | [YYYY-MM-DD] |
| Agency CISO (receipt) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-sbom-eo-14028` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
