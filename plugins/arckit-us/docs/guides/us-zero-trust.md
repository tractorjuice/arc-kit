# US CISA ZTMM v2.0 Maturity Posture

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-zero-trust` produces a CISA Zero Trust Maturity Model v2.0 posture assessment for the system. It scores maturity across the five pillars (Identity, Devices, Networks, Applications & Workloads, Data) and the three cross-cutting capabilities (Visibility & Analytics, Automation & Orchestration, Governance), at four maturity stages (Traditional, Initial, Advanced, Optimal). The output is anchored on CISA ZTMM v2.0, OMB M-22-09, and NIST SP 800-207.

The assessment is the **federal civilian zero-trust evidence artefact**. M-22-09 set agency-wide zero-trust targets for FY24, and CISA ZTMM is the agreed measuring stick. The artefact is consumed by agency CIO/CISO offices reporting M-22-09 progress, by FedRAMP authorisation packages cross-referencing ZTMM claims, and by the JAB / sponsoring AO during ATO review.

Reviewed by the agency CISO, ISSO, and the System Owner. Roadmap uplift items are co-owned with the agency Zero Trust Strategy Office where one exists.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Tailored Control Set (`ARC-<id>-NIST-v1.0.md`) | Control selection informs the pillar maturity claims |
| ICAM Architecture (`ARC-<id>-ICAM-v1.0.md`) | Identity pillar evidence |
| Architecture Principles (`ARC-<id>-PRIN-v1.0.md`) | Agency ZT strategy alignment |

---

## Output

- **Doc-type**: `ZTA`
- **Filename**: `ARC-<PID>-ZTA-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Score current posture for each of the 5 pillars and 3 cross-cuts across the 4 maturity stages.
2. Cite supporting evidence — controls implemented, telemetry sources, automation in place.
3. Identify gaps blocking the next maturity stage; capture proposed uplift initiatives with owner, timeline, and dependency.
4. Tie the roadmap to M-22-09 milestones where they still apply, and to agency-specific ZT strategy targets.

---

## Regulatory Anchors

- **CISA Zero Trust Maturity Model v2.0** — <https://www.cisa.gov/zero-trust-maturity-model>
- **OMB M-22-09** — <https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf>
- **NIST SP 800-207** — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf>

---

## Example Usage

```bash
/arckit:us-zero-trust 001-citizen-benefits-portal
```

---

## Common Pitfalls

- **Over-claiming maturity for pilot/POC.** A pilot in production for one tenant is not Advanced. ZTMM scoring is system-wide; pilots score the stage they actually cover.
- **Ignoring cross-cuts (V&A, A&O, Governance).** The three cross-cutting capabilities are not optional — a high pillar score with weak visibility is not credible.
- **No measurable uplift roadmap.** "Plans to mature" is not a roadmap. Each uplift needs owner, date, capability target, and evidence of funding.
- **Treating zero trust as a product purchase.** ZT is a strategy plus a stack of controls; vendor labels do not score themselves.

---

## Handoffs

- **`us-icam`** — Identity pillar evidence draws heavily on the ICAM architecture
- **`us-nist-800-53`** — control selection should mature in lockstep with pillar uplift
- **`adr`** — strategic ZT pivots (e.g. moving identity to login.gov, network to SASE) deserve ADRs
