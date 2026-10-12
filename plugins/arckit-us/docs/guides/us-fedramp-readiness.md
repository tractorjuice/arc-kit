# US FedRAMP Readiness Assessment Report

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-fedramp-readiness` generates a FedRAMP Readiness Assessment Report (RAR) — the 3PAO-led capability-and-evidence assessment that determines whether a CSP is ready to enter a full FedRAMP authorization. The RAR scores the CSP's technical capability, documentation maturity, and the presence of the foundational evidence (architecture, ICAM, encryption, audit, ConMon, IR) demanded by the JAB or sponsoring Agency.

A "FedRAMP Ready" designation, published on the FedRAMP Marketplace, is the public signal that a CSP can credibly pursue authorization. RAR findings shape the POA&M, surface the gating gaps, and feed the JAB prioritisation discussion. Optimistic POA&M dates are the single most common reason a Ready package is bounced back to the CSP.

Reviewed by the 3PAO (lead assessor signature required), the CSP's CISO, and FedRAMP PMO during marketplace review. Independent re-review every 12 months while the designation is active.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| FedRAMP SSP (`ARC-<id>-FRSSP-v1.0.md`) | System Security Plan being assessed for readiness |
| Tailored Control Set (`ARC-<id>-NIST-v1.0.md`) | Control selection underpinning the SSP |
| All supporting evidence artefacts | ICAM, encryption inventory, audit catalogue, IR plan, ConMon strategy |

---

## Output

- **Doc-type**: `FRRR`
- **Filename**: `ARC-<PID>-FRRR-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Confirm the SSP scope and authorisation boundary are stable.
2. Walk the FedRAMP RAR Template sections (capability statement, architecture, ICAM, encryption, audit, ConMon, IR, supply chain).
3. Score each section: Met / Partially Met / Not Met, with evidence citations.
4. Build the POA&M for Partially Met / Not Met items with realistic dates and owners.
5. Capture the Customer Responsibility Matrix (CRM) and shared-responsibility narrative.

---

## Regulatory Anchors

- **FedRAMP RAR Template** — <https://www.fedramp.gov/documents-templates/>
- **FedRAMP Agency Authorization Playbook** — <https://www.fedramp.gov/agency-authorization/>
- **FedRAMP JAB Prioritization Criteria** — <https://www.fedramp.gov/jab-prioritization/>

---

## Example Usage

```bash
/arckit:us-fedramp-readiness 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Optimistic POA&M dates.** A POA&M full of "30-day" dates that quietly slip undermines confidence. Set defensible dates tied to engineering capacity, not best-case.
- **Missing penetration-test evidence.** A current independent pentest report is a hard requirement; many CSPs skimp here and bounce back from PMO review.
- **Not articulating the CRM.** The Customer Responsibility Matrix must enumerate every customer-side control. "Customer is responsible for managing accounts" is too vague.
- **Treating Ready as the destination.** Ready is a milestone, not authorization. Plan the post-Ready 3PAO assessment and JAB / Agency engagement on the same timeline.

---

## Handoffs

- **`service-assessment`** — RAR readiness feeds the broader service assessment posture
- **`roadmap`** — POA&M dates shape the authorization roadmap
- **`risk`** — Not Met items flow into the risk register as authorisation-blocking risks
