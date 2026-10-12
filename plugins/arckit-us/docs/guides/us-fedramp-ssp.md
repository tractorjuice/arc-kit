# US FedRAMP System Security Plan

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-fedramp-ssp` produces a FedRAMP System Security Plan (SSP) using the current Rev 5 SSP template structure. It documents the authorization boundary, system architecture, control implementations, shared responsibility (customer vs. CSP), interconnections, data flows, and the personnel and roles supporting Authority-to-Operate. The SSP is the **primary artefact** in the FedRAMP authorization package — every other artefact (SAP, SAR, POA&M, ConMon) references and is constrained by it.

The SSP is read end-to-end by the 3PAO during the assessment, by the JAB or sponsoring Agency's AO during the authorization decision, and by FedRAMP PMO during package review. Errors in the authorization boundary or shared-responsibility matrix surface as ATO blockers; weak control narratives drive extensive 3PAO interview cycles. Treat the SSP as a serious technical document, not a marketing artefact.

Reviewed by the CSP's CISO, the System Owner, ISSO, AO, and the FedRAMP PMO. Mandatory peer review of the authorization boundary diagram before 3PAO assessment kick-off.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| FIPS 199 Categorization (`ARC-<id>-FIPS199-v1.0.md`) | Impact level for baseline selection |
| Tailored Control Set (`ARC-<id>-NIST-v1.0.md`) | Control implementations to document |
| ICAM Architecture (`ARC-<id>-ICAM-v1.0.md`) | Identity, credential, access management posture |
| Architecture Principles (`ARC-<id>-PRIN-v1.0.md`) | Agency-specific posture statements |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Functional context, integration points |

---

## Output

- **Doc-type**: `FRSSP`
- **Filename**: `ARC-<PID>-FRSSP-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Define authorization boundary — what is in, what is out, where leased services attach.
2. Document system architecture, data flows, ports / protocols / services.
3. Detail every selected control implementation with parameter values and shared-responsibility split.
4. Capture interconnections, system inventory, personnel roles, training.
5. Validate against the FedRAMP Authorization Boundary Guidance before publishing.

---

## Regulatory Anchors

- **FedRAMP SSP Template Rev 5** — <https://www.fedramp.gov/documents-templates/>
- **FedRAMP Authorization Boundary Guidance** — <https://www.fedramp.gov/assets/resources/documents/CSP_A_FedRAMP_Authorization_Boundary_Guidance.pdf>
- **NIST SP 800-37 Rev 2** — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf>

---

## Example Usage

```bash
/arckit:us-fedramp-ssp 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Misdrawing the authorisation boundary.** Boundaries that exclude services that handle federal data, or include services owned by other parties, are the leading cause of FedRAMP rework. Apply the Boundary Guidance heuristics literally.
- **Conflating shared-responsibility controls.** Every shared control must say who does what. "Inherited from AWS" is not an answer; the CRM line must be specific.
- **Under-specifying interconnections.** Every external system connection must include the data exchanged, frequency, encryption posture, ICAM, and the agreement (ISA/MOU) reference.
- **Treating the SSP as a checkbox.** Narratives must describe *how* the control is implemented, not restate the control statement.

---

## Handoffs

- **`us-fedramp-readiness`** — SSP feeds the Readiness Assessment Report (RAR)
- **`us-zero-trust`** — boundary and ICAM posture link to ZTMM maturity claims
- **`us-icam`** — ICAM section of the SSP cites the ICAM architecture artefact
