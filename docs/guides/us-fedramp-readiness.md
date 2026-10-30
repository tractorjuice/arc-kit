# US FedRAMP Readiness Self-Assessment

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-fedramp-readiness` generates an **internal readiness self-assessment** in the format of the FedRAMP Readiness Assessment Report (RAR). FedRAMP's RAR templates invite CSPs to complete exactly this kind of self-assessment before engaging a 3PAO. It scores the CSP's technical capability, documentation maturity, and the presence of the foundational evidence (architecture, ICAM, encryption, audit, ConMon, IR) against the RAR's six Federal Mandates and its FedRAMP Requirements, and records the gaps to close before a 3PAO arrives.

It is not the official RAR. A FedRAMP-recognized Third Party Assessment Organization (3PAO) prepares that report, owns its content and signs its attestation; the FedRAMP PMO then decided whether to designate the CSO "FedRAMP Ready", a Marketplace status valid for one year. ArcKit can produce neither the 3PAO's RAR nor a Ready designation. Under the FedRAMP Consolidated Rules for 2026, FedRAMP stopped accepting FedRAMP Ready submissions on 28 July 2026 and is replacing Ready with Class A certification, so check fedramp.gov for the current route before planning around it. There is no JAB route: OMB M-24-15 (July 2024) replaced the Joint Authorization Board with the FedRAMP Board. A FedRAMP Certification now has a type (Rev 5 or 20x), a path (Agency, through a sponsoring agency, or Program, directly from FedRAMP) and a class (A–D), and the command recommends one. Self-assessment findings shape the POA&M and surface the gating gaps.

Reviewed and approved inside the CSP by the readiness lead, the System Owner and the CISO. It carries no 3PAO signature. Re-run it after remediation and before engaging the 3PAO.

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
2. Answer the six RAR Federal Mandates (FIPS 140-validated cryptography, PIV / CAC authentication, digital identity level, vulnerability remediation within 30 / 90 / 180 days, federal records management, DNSSEC); any No blocks a 3PAO RAR.
3. Walk the remaining RAR Template sections (capability statement, architecture, ICAM, encryption, audit, ConMon, IR, supply chain) and answer each check Met or Not Met, with evidence citations. As the RAR does with its Yes / No questions, a partly met check is Not Met, with what is missing recorded.
4. Give each gap an ArcKit severity (a Federal Mandate answered No is Critical) and build the POA&M for Not Met items with realistic dates and owners.
5. Recommend the certification route: type, path and class.
6. Capture the Customer Responsibility Matrix (CRM) and shared-responsibility narrative.

---

## Regulatory Anchors

- **FedRAMP RAR Template (legacy since 23 June 2026)** — <https://www.fedramp.gov/legacy/>
- **FedRAMP Consolidated Rules for 2026 (FedRAMP Ready retired 28 July 2026)** — <https://www.fedramp.gov/2026/timeline/>
- **FedRAMP Consolidated Rules for 2026: Choosing a Certification Path** — <https://www.fedramp.gov/2026/providers/start/path/>
- **OMB M-24-15 (Modernizing FedRAMP)** — <https://www.whitehouse.gov/wp-content/uploads/2024/07/M-24-15-Modernizing-the-Federal-Risk-and-Authorization-Management-Program.pdf>

---

## Example Usage

```bash
/arckit:us-fedramp-readiness 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Optimistic POA&M dates.** A POA&M full of "30-day" dates that quietly slip undermines confidence. Set defensible dates tied to engineering capacity, not best-case.
- **Leaving the penetration test too late.** The RAR does not require one, but the 3PAO reviews any results that exist, and the full initial assessment of a Moderate or High system does require one. Schedule it now.
- **Presenting the self-assessment as a RAR.** Only the 3PAO's RAR carries an attestation. Never add a 3PAO signature or attestation to this artefact.
- **Not articulating the CRM.** The Customer Responsibility Matrix must enumerate every customer-side control. "Customer is responsible for managing accounts" is too vague.
- **Treating readiness as the destination.** Readiness is a milestone, not authorization. Plan the 3PAO assessment and the sponsoring agency or FedRAMP Program engagement on the same timeline.
- **Reading ArcKit's severities as FedRAMP's.** The RAR records Yes / No answers and the 3PAO's overall judgement. Critical / High / Moderate / Low is ArcKit's way of ordering the remediation work.

---

## Handoffs

- **`service-assessment`** — RAR readiness feeds the broader service assessment posture
- **`roadmap`** — POA&M dates shape the authorization roadmap
- **`risk`** — Not Met items flow into the risk register as authorisation-blocking risks
