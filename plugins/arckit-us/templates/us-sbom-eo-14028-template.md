# EO 14028 Secure-Software Self-Attestation + SBOM

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-sbom-eo-14028`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-sbom-eo-14028` command | PENDING | PENDING |

---

## Executive Summary

[Two paragraphs: software being attested, SSDF practices attested, SBOM coverage, and submission status to the CISA Repository for Software Attestation and Artifacts.]

---

## 1. Producer / Software Information

| Field | Value |
|-------|-------|
| **Software Producer (Vendor)** | [Organisation name] |
| **Producer UEI / SAM Identifier** | [UEI from SAM.gov] |
| **Software Product Name** | [Product name] |
| **Product Version Attested** | [Version + build identifier] |
| **Software Identifier (CPE / PURL / SWID)** | [Identifier] |
| **Federal Customer (Agency)** | [Agency receiving the attestation] |
| **Attestation Scope** | [Specific product / all products / version range] |
| **Attestation Type** | [Self-attestation / Third-party assessment] |
| **CISA Form Submission Date** | [YYYY-MM-DD] |

---

## 2. CISA Self-Attestation Form Fields

Per OMB M-22-18 and M-23-16, complete each field of the CISA Secure Software Development Attestation Form.

### Section 1 — Software Producer

| Field | Value |
|-------|-------|
| Producer name | [Name] |
| Producer address | [Address] |
| Producer UEI | [UEI] |
| Producer point of contact | [Name + email + phone] |
| Signing official (CEO or designee) | [Name + title] |

### Section 2 — Software Identification

| Field | Value |
|-------|-------|
| Software product name | [Name] |
| Software version(s) | [Version(s)] |
| Software identifier (CPE / PURL / SWID) | [Identifier] |
| Software type | [On-prem / Cloud-hosted / Embedded / Firmware] |

### Section 3 — Federal Customer

| Field | Value |
|-------|-------|
| Agency | [Agency] |
| Contract / Order # | [Contract number] |
| Agency point of contact | [Name + email] |

### Section 4 — Attestation Statement

[The signing official affirms that the software is developed in conformance with the secure development practices identified in Section 5 of this artefact, derived from NIST SSDF SP 800-218.]

**Signing official**: [Name + title + date + signature]

---

## 3. Secure Development Practices Attested (NIST SSDF SP 800-218)

Map attestation to the four NIST SSDF practice groups: Prepare the Organisation (PO), Protect the Software (PS), Produce Well-Secured Software (PW), Respond to Vulnerabilities (RV).

### PO — Prepare the Organisation

| SSDF Practice | Attested? | Evidence |
|---------------|-----------|----------|
| PO.1 Define Security Requirements for Software Development | [Yes / No / Partial] | [Evidence] |
| PO.2 Implement Roles and Responsibilities | [Yes / No / Partial] | [Evidence] |
| PO.3 Implement Supporting Toolchains | [Yes / No / Partial] | [Evidence] |
| PO.4 Define and Use Criteria for Software Security Checks | [Yes / No / Partial] | [Evidence] |
| PO.5 Implement and Maintain Secure Environments for Software Development | [Yes / No / Partial] | [Evidence] |

### PS — Protect the Software

| SSDF Practice | Attested? | Evidence |
|---------------|-----------|----------|
| PS.1 Protect All Forms of Code from Unauthorised Access and Tampering | [Yes / No / Partial] | [Evidence] |
| PS.2 Provide a Mechanism for Verifying Software Release Integrity | [Yes / No / Partial] | [Evidence] |
| PS.3 Archive and Protect Each Software Release | [Yes / No / Partial] | [Evidence] |

### PW — Produce Well-Secured Software

| SSDF Practice | Attested? | Evidence |
|---------------|-----------|----------|
| PW.1 Design Software to Meet Security Requirements and Mitigate Security Risks | [Yes / No / Partial] | [Evidence] |
| PW.2 Review the Software Design to Verify Compliance with Security Requirements | [Yes / No / Partial] | [Evidence] |
| PW.4 Reuse Existing, Well-Secured Software When Feasible | [Yes / No / Partial] | [Evidence] |
| PW.5 Create Source Code by Adhering to Secure Coding Practices | [Yes / No / Partial] | [Evidence] |
| PW.6 Configure Compilation, Interpreter, and Build Processes to Improve Executable Security | [Yes / No / Partial] | [Evidence] |
| PW.7 Review and/or Analyse Human-Readable Code to Identify Vulnerabilities | [Yes / No / Partial] | [Evidence] |
| PW.8 Test Executable Code to Identify Vulnerabilities and Verify Compliance | [Yes / No / Partial] | [Evidence] |
| PW.9 Configure Software to Have Secure Settings by Default | [Yes / No / Partial] | [Evidence] |

### RV — Respond to Vulnerabilities

| SSDF Practice | Attested? | Evidence |
|---------------|-----------|----------|
| RV.1 Identify and Confirm Vulnerabilities on an Ongoing Basis | [Yes / No / Partial] | [Evidence] |
| RV.2 Assess, Prioritise, and Remediate Vulnerabilities | [Yes / No / Partial] | [Evidence] |
| RV.3 Analyse Vulnerabilities to Identify Their Root Causes | [Yes / No / Partial] | [Evidence] |

---

## 4. SBOM Metadata

| Field | Value |
|-------|-------|
| **SBOM Format** | [CycloneDX 1.5 / SPDX 2.3] |
| **Schema Version** | [Schema version] |
| **Generation Tool** | [Tool name + version — e.g., Syft 0.NN / cdxgen / SPDX SBOM Generator] |
| **Generation Method** | [Build-time / Source-analysis / Binary-analysis] |
| **SBOM Identifier** | [URN / UUID] |
| **SBOM Author** | [Name + organisation] |
| **Generation Timestamp** | [YYYY-MM-DDTHH:MM:SSZ] |
| **SBOM Hash** | [SHA-256 of the SBOM file] |
| **SBOM Location** | [Repository URL / artefact reference] |

---

## 5. SBOM Minimum Elements Checklist (NTIA)

Per the NTIA "Minimum Elements for a Software Bill of Materials" published July 2021.

| NTIA Element | Required Value | Present? Y/N | Notes |
|--------------|----------------|--------------|-------|
| Supplier Name | [Vendor producing the component] | [Y/N] | [Notes] |
| Component Name | [Component name] | [Y/N] | [Notes] |
| Version of Component | [SemVer / vendor-specific version] | [Y/N] | [Notes] |
| Other Unique Identifiers (e.g., PURL, CPE, SWID) | [PURL preferred] | [Y/N] | [Notes] |
| Dependency Relationships | [Graph of upstream / downstream dependencies] | [Y/N] | [Notes] |
| Author of SBOM Data | [Person / system generating the SBOM] | [Y/N] | [Notes] |
| Timestamp (when SBOM was created) | [Generation timestamp] | [Y/N] | [Notes] |

**Coverage Summary**:

| Metric | Value |
|--------|-------|
| Total components in SBOM | [Count] |
| Components with full NTIA element coverage | [Count + %] |
| Components missing one or more NTIA elements | [Count + %] |
| Direct dependencies | [Count] |
| Transitive dependencies | [Count] |

---

## 6. Provenance Attestations

| Field | Value |
|-------|-------|
| **SLSA Level Achieved** | [SLSA 1 / 2 / 3 / 4] |
| **SLSA Provenance Format** | [in-toto Statement v1] |
| **Provenance Signed By** | [Signing identity — Sigstore / GPG key ID] |
| **Signature Verified** | [Yes — verification command + output] |
| **Build Platform** | [GitHub Actions / Tekton Chains / Buildkit / other] |
| **Build Trigger** | [Tag / commit SHA] |
| **Builder Identity** | [Builder image + digest] |
| **In-toto Attestation Chain** | [Chain reference — attesting layers: source, build, deploy] |

[Reference the actual SLSA provenance document / in-toto attestation chain in `external/` or vendor portal.]

---

## 7. Exception Request

[If a secure development practice cannot be attested, an exception with a Plan of Action and Milestones (POA&M) is required per M-22-18 / M-23-16.]

**Exception Required?**: [Yes / No]

| Practice Not Attested | Reason | POA&M ID | Remediation Plan | Target Completion |
|----------------------|--------|----------|------------------|-------------------|
| [SSDF practice] | [Why cannot be attested] | [POA&M ID] | [Plan] | [YYYY-MM-DD] |

---

## 8. Cross-Reference to NIST 800-53 SR (Supply Chain Risk) Family

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

## 9. Distribution

| Recipient | Submission Method | Date | Reference |
|-----------|-------------------|------|-----------|
| CISA Repository for Software Attestation and Artifacts (RSAA) | [Form upload via repository.cisa.gov] | [YYYY-MM-DD] | [Submission ID] |
| Agency Contracting Officer | [Contract delivery] | [YYYY-MM-DD] | [Contract / DO #] |
| Agency CISO | [Email / portal] | [YYYY-MM-DD] | [Reference] |

---

## 10. References

| Reference | Citation | URL |
|-----------|----------|-----|
| EO 14028 | Improving the Nation's Cybersecurity | <https://www.federalregister.gov/d/2021-10460> |
| OMB M-22-18 | Enhancing the Security of the Software Supply Chain through Secure Software Development Practices | <https://www.whitehouse.gov/wp-content/uploads/2022/09/M-22-18.pdf> |
| OMB M-23-16 | Update to Memorandum M-22-18 | <https://www.whitehouse.gov/wp-content/uploads/2023/06/M-23-16-Update-to-M-22-18-Enhancing-Software-Security-.pdf> |
| CISA Self-Attestation Form | Secure Software Development Attestation Form | <https://www.cisa.gov/secure-software-attestation-form> |
| NTIA Minimum Elements for SBOM | The Minimum Elements For a Software Bill of Materials | <https://www.ntia.doc.gov/files/ntia/publications/sbom_minimum_elements_report.pdf> |
| NIST SP 800-218 | Secure Software Development Framework (SSDF) | <https://doi.org/10.6028/NIST.SP.800-218> |
| SLSA | Supply-chain Levels for Software Artifacts | <https://slsa.dev/> |
| CycloneDX | CycloneDX SBOM Standard | <https://cyclonedx.org/> |
| SPDX | SPDX SBOM Standard | <https://spdx.dev/> |

---

## 11. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Software Producer Signing Official | [Name + title] | [Signature] | [YYYY-MM-DD] |
| Producer Security Officer | [Name] | [Signature] | [YYYY-MM-DD] |
| Agency Contracting Officer | [Name] | [Signature] | [YYYY-MM-DD] |
| Agency CISO (receipt) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-sbom-eo-14028` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
