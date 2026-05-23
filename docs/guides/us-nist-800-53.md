# US NIST SP 800-53 Rev 5 Tailored Control Set

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-nist-800-53` generates a tailored NIST SP 800-53 Revision 5 control set for the system, starting from the SP 800-53B baseline (Low / Moderate / High / Privacy) keyed to the system's FIPS 199 categorization. It documents parameter assignments, tailoring decisions (adds, removes, scoping statements), inheritance from FedRAMP-authorised Cloud Service Providers (CSPs), and compensating controls where the baseline implementation is not feasible.

The output is the **control selection artefact** that feeds the FedRAMP System Security Plan (SSP) and the agency Authority-to-Operate (ATO) package. It is the foundation for assessment procedures (SP 800-53A Rev 5), POA&M management, and continuous monitoring (`/arckit:us-fedramp-readiness`, `/arckit:us-zero-trust`).

Reviewed by the ISSO, System Owner, Common Control Provider (CCP) representatives, and the Authorizing Official. Privacy controls are reviewed by the agency Senior Agency Official for Privacy (SAOP).

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| FIPS 199 Categorization (`ARC-<id>-FIPS199-v1.0.md`) | Determines the high-water mark baseline (Low / Moderate / High) |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | `NFR-SEC-*` and `INT-*` drive control tailoring |
| Architecture Principles (`ARC-<id>-PRIN-v1.0.md`) | Inheritance posture and tailoring guidance |

---

## Output

- **Doc-type**: `NIST`
- **Filename**: `ARC-<PID>-NIST-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Select the SP 800-53B baseline (Low / Moderate / High) plus the Privacy overlay.
2. Identify inheritable controls from FedRAMP-authorised CSPs (IaaS, PaaS) using the CSP's Customer Responsibility Matrix (CRM).
3. Apply tailoring: scoping considerations, parameter assignments, supplemental controls, compensating controls.
4. Document every tailoring decision with rationale traceable to FIPS 199, mission needs, or compensating risk acceptance.
5. Surface gaps as POA&M candidates and feed them into the risk register.

---

## Regulatory Anchors

- **NIST SP 800-53 Rev 5** — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf>
- **NIST SP 800-53B (Control Baselines)** — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53B.pdf>
- **FedRAMP Rev 5 Baselines** — <https://www.fedramp.gov/rev5/baselines/>

---

## Example Usage

```bash
/arckit:us-nist-800-53 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Failing to inherit from FedRAMP-authorised CSPs.** If you are deploying on a FedRAMP-authorised IaaS/PaaS, dozens of controls are provider-inherited. Not claiming inheritance forces you to re-evidence them and burdens the assessor.
- **Missing parameter assignments.** Controls like AC-2(2) or AU-6(1) include organisation-defined parameters (e.g. "frequency"). Leaving these blank is an audit finding.
- **Not documenting compensating controls.** Where a control cannot be implemented as written, a compensating control must be documented with rationale, residual risk, and AO acceptance.
- **Ignoring control enhancements at higher baselines.** Moderate and High baselines include enhancements that are not optional. Treat them as in-scope by default.

---

## Handoffs

- **`us-fedramp-ssp`** — control set is consumed by the FedRAMP System Security Plan
- **`us-zero-trust`** — control selection cross-references CISA ZTMM pillars
- **`us-sbom-eo-14028`** — Supply Chain (SR) family aligns with secure-software attestation
- **`adr`** — significant tailoring decisions warrant an ADR
