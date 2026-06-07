# FIPS 199 System Categorization (NIST SP 800-60)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-fisma-categorization`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-fisma-categorization` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: system under categorization, mission criticality, the FIPS 199 high-water mark determination (Low / Moderate / High), and a brief justification linking the categorization to downstream control-baseline selection in `/arckit:us-nist-800-53`.]

---

## 1. System Boundary Description

| Field | Value |
|-------|-------|
| **System Name** | [System name] |
| **System Acronym** | [Acronym used in agency inventory] |
| **System Type** | [Major Application / General Support System / Minor Application] |
| **Agency** | [Department / Agency] |
| **Bureau / Component** | [Sub-agency] |
| **System Owner** | [Name + role] |
| **Authorising Official (AO)** | [Name + role] |
| **System Categorization Date** | [YYYY-MM-DD] |
| **Authorisation Boundary Diagram** | [Reference to diagram artefact — `ARC-{P}-DIAG-NNN-v*`] |
| **Cloud Service Provider(s)** | [AWS GovCloud / Azure Government / GCP Assured Workloads / On-prem / Hybrid] |
| **FedRAMP Inheritance** | [Yes — Package ID(s) / No] |

### Authorisation Boundary Narrative

[Describe what is in-scope and what is out-of-scope for this authorisation boundary. List all components, networks, data stores, and supporting infrastructure within the boundary. Identify any shared services or general support systems the boundary inherits from.]

### Interconnections Summary

| Interconnected System | Owning Org | Connection Type | Data Exchanged | ISA / MoU Reference |
|----------------------|-----------|-----------------|----------------|---------------------|
| [System] | [Org] | [API / VPN / Direct Connect] | [Data type] | [Reference] |

---

## 2. Information Types Inventory

Categorize each information type processed, stored, or transmitted by the system per NIST SP 800-60 Vol 2 Rev 1.

| SP 800-60 Type ID | Description | Confidentiality | Integrity | Availability | Rationale |
|-------------------|-------------|-----------------|-----------|--------------|-----------|
| C.2.8.12 | [General Information — Public Affairs] | [Low] | [Low] | [Low] | [Public-facing information; no PII] |
| C.3.5.1 | [Personal Identity and Authentication] | [Moderate] | [Moderate] | [Low] | [Contains PII used for identity proofing] |
| C.3.5.8 | [Income Information] | [Moderate] | [Moderate] | [Low] | [Financial PII; harm if disclosed] |
| D.14.2 | [System Development] | [Low] | [Moderate] | [Low] | [Internal development artefacts] |

[Add additional rows for every information type the system processes. Reference SP 800-60 Vol 2 Rev 1 Appendix C / D for the canonical type catalogue.]

---

## 3. CIA Impact Matrix per Information Type

Summarise the per-type CIA scores and the resulting per-type high-water mark.

| Information Type | C | I | A | Type High-Water Mark | Notes |
|------------------|---|---|---|----------------------|-------|
| [Type ID — Description] | [L/M/H] | [L/M/H] | [L/M/H] | [L/M/H] | [Notes] |

---

## 4. High-Water-Mark Categorization

| CIA Objective | Impact Level | Driving Information Type(s) |
|---------------|--------------|------------------------------|
| **Confidentiality** | [Low / Moderate / High] | [Type ID(s)] |
| **Integrity** | [Low / Moderate / High] | [Type ID(s)] |
| **Availability** | [Low / Moderate / High] | [Type ID(s)] |

**Overall System Categorization (High-Water Mark)**: **[LOW / MODERATE / HIGH]**

[Narrative justification: the overall categorization is driven by the highest impact level across any single CIA objective for any single information type processed by the system. Explain which type drives the mark and why.]

---

## 5. Supporting Rationale

### Confidentiality Rationale

[Why this impact level was selected. Reference unauthorised disclosure scenarios, regulatory citations (Privacy Act, HIPAA, CUI categories), and business-impact narratives.]

### Integrity Rationale

[Why this impact level was selected. Reference unauthorised modification scenarios, data-trust requirements, and downstream-system dependencies on data quality.]

### Availability Rationale

[Why this impact level was selected. Reference outage tolerance, mission impact of unavailability, RTO/RPO requirements, and downstream-system dependencies.]

---

## 6. Agency-Specific Overlays

[Identify any departmental or bureau tailoring that adjusts the categorization above the FIPS 199 default. Common drivers include CUI safeguarding obligations (NIST SP 800-171), agency-specific high-value-asset (HVA) designation, OMB Circular A-130 special factors, and mission-specific overlays.]

| Overlay Source | Tailoring Applied | Justification |
|----------------|-------------------|---------------|
| [Agency policy reference] | [Adjustment] | [Justification] |

---

## 7. References

| Reference | Citation | URL |
|-----------|----------|-----|
| FIPS 199 | Standards for Security Categorization of Federal Information and Information Systems | <https://doi.org/10.6028/NIST.FIPS.199> |
| NIST SP 800-60 Vol 1 Rev 1 | Guide for Mapping Types of Information and Information Systems to Security Categories | <https://doi.org/10.6028/NIST.SP.800-60v1r1> |
| NIST SP 800-60 Vol 2 Rev 1 | Appendices to Guide for Mapping Types of Information | <https://doi.org/10.6028/NIST.SP.800-60v2r1> |
| NIST SP 800-37 Rev 2 | Risk Management Framework for Information Systems and Organizations | <https://doi.org/10.6028/NIST.SP.800-37r2> |
| OMB Circular A-130 | Managing Information as a Strategic Resource | <https://www.whitehouse.gov/omb/circulars-a130/> |

---

## 8. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| System Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| Senior Agency Official for Privacy (SAOP) | [Name] | [Signature] | [YYYY-MM-DD] |
| Authorising Official (AO) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-fisma-categorization` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
