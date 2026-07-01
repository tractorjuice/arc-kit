# Canada Federal Procurement Strategy Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-pspc` generates a federal Canadian procurement strategy under the Public Services and Procurement Canada (PSPC) *Supply Manual*. It scopes the procurement, applies the *Canadian Free Trade Agreement* (CFTA), CETA, CPTPP, and WTO-AGP threshold matrix, evaluates the Standing Offer / Supply Arrangement / AgileIQ / bespoke RFP / set-aside route landscape, captures the Procurement Strategy for Indigenous Business (PSAB) contribution to the departmental 5% rolling target, builds the security-clearance lead-time picture, sets out the evaluation-framework dimensions, and lays a bid-solicitation schedule consistent with Supply Manual standstill and debriefing rules.

PSPC is the federal contracting authority for most goods and services procurements above departmental delegations. Federal procurement operates under a layered set of trade-agreement obligations — CFTA domestically, CETA / CPTPP / WTO-AGP internationally — and a Procurement Strategy for Indigenous Business that targets a 5% rolling departmental contribution to Indigenous-business procurement. Treat this artefact as a delivery gate: the route, the trade-agreement coverage, the PSAB posture, and the clearance-lead-time picture must be set before market engagement, because reversing them after a posting attracts CITT review and rework cost.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Scope, value drivers, integration surface |
| Strategic outline business case (`ARC-<id>-SOBC-v1.0.md`) | Affordability envelope, commercial case, route hypothesis |
| ITSG-33 control profile (`ARC-<id>-ITSG-v1.0.md`) | Security control profile drives clearance posture and supplier security obligations |
| Cloud residency assessment (`ARC-<id>-CACR-v1.0.md`) | Sub-processor analysis and CSP shortlist where cloud is in scope of the procurement |

---

## Command

```bash
/arckit:ca-pspc <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-PROC-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Recommended route, binding trade agreements, PSAB posture, longest clearance lead time, blocking open items |
| Procurement Scope | Goods/services breakdown, estimated value, term, options |
| Threshold Analysis | CFTA, CETA, CPTPP, WTO-AGP coverage and open-tendering obligations; set-aside carve-outs |
| Route Selection | Standing Offer / Supply Arrangement / AgileIQ / RFP / set-aside fit, risk, timeline |
| Procurement Strategy for Indigenous Business | Set-aside decision, sub-contracting plan, departmental 5% contribution |
| Security Clearance Requirements | Per-role clearance level, lead time, critical-path posture |
| Evaluation Framework Outline | Mandatory / point-rated / financial dimensions and weight envelope |
| Bid Solicitation Schedule | Milestones from market engagement to award, with standstill and debriefing |
| Risks | Supplier-pool, clearance, threshold, instrument-shape, CITT, residency, OLA / accessibility risks |
| Open Items | Outstanding decisions, instrument confirmations, owners, review dates |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- After SOBC — once the affordability envelope and commercial case are set, the route and instrument can be sized.
- Before market engagement — the route, the trade-agreement coverage, and the PSAB posture must be set before any RFI / Industry Day to avoid contradictory market signals.
- After a material scope or value change — a procurement designed against last quarter's scope can fall on the wrong side of a CFTA / CETA / CPTPP / WTO-AGP threshold when value moves.
- Pre-posting refresh — re-verify thresholds at posting; thresholds adjust biennially and trade-agreement coverage evolves.
- Before contract extension or option exercise — option years roll value past thresholds and may re-trigger trade-agreement obligations even when the base award sat below them.

---

## Route shortlist at a glance

| Need | First-look instrument | Notes |
|------|-----------------------|-------|
| Outcome-based informatics solution | SBIPS | Confirm scope notice covers the deliverable shape |
| Resource-based informatics task | TBIPS | Resource-classification stream and security clearance must match |
| Multi-disciplinary professional services | ProServices | Useful when scope spans multiple professional categories |
| AI / data professional services | SA-AIDP | Newer instrument; confirm currency and renewal status |
| Cybersecurity services | SA-Cyber | Confirm clearance prerequisites in the supply arrangement |
| Iterative scope, rapid award | AgileIQ / Agile Procurement Process | Requires scope expressible as iterative task statements |
| No instrument fits | Bespoke RFP / RFSO / RFSA | Justify against the scope, value, and evaluation model in the route-selection table |
| Indigenous-business participation | PSAB set-aside or sub-contracting plan | Validate supplier pool through Indigenous Services Canada directory |

---

## Common pitfalls

- **Defaulting to a Standing Offer without CFTA analysis.** A Standing Offer is still subject to trade-agreement obligations and CITT review. Choose the instrument by fit to scope, value, and evaluation model, not by the convenience of an existing call-up mechanism.
- **Missing PSAB consideration entirely.** Even where a set-aside is not used, the PSAB analysis must be documented — the supplier-pool assessment, the carve-out reasoning, and the contribution to the departmental rolling 5% target. Silence on PSAB reads as oversight.
- **Under-budgeting clearance lead time.** Top Secret and SCI clearances commonly take 6 to 12 or more months for new applicants. A schedule that assumes weeks rather than months attracts a critical-path risk that can reset the whole award timeline.
- **Conflating ITQ, ITT, and RFP shapes.** Each solicitation form has different evaluation rules, different bidder rights, and different challenge pathways. Choose the form against the route-selection table; do not mix vocabulary across the artefact.
- **Treating PSAB 5% as a per-procurement target.** The 5% is a department-level rolling target. Any one procurement contributes to it; no single procurement is judged against 5% in isolation. Document the contribution explicitly so the departmental return rolls up correctly.

---

## Handoffs

- **`evaluate`** — PSPC route selection feeds the vendor evaluation framework's scoring rubric. The high-level mandatory / point-rated / financial dimensions and weight envelope set here are inherited by the detailed evaluation rubric, where per-criterion scoring guidance and mandatory-evidence requirements live.
- **`sobc`** — The procurement strategy feeds the Strategic Outline Business Case's procurement and commercial pillars. The recommended route, the trade-agreement coverage, the PSAB posture, and the clearance-lead-time picture inform the affordability envelope and the commercial-case narrative; cross-link rather than duplicate.

---

## Statutory currency

CFTA thresholds adjust biennially and the international agreements (CETA, CPTPP, WTO-AGP) carry their own coverage schedules and threshold cycles. Re-verify the current thresholds at the verification date in the Document Register; a procurement designed against last year's thresholds can fall on the wrong side of an obligation when posted. PSPC Standing Offers and Supply Arrangements cycle through renewals — re-verify the current instrument numbers (SBIPS, TBIPS, ProServices, SA-AIDP, SA-Cyber, and others) at posting, since a lapsed instrument reference invalidates the call-up. The PSAB is administered by Indigenous Services Canada and the registered supplier directory evolves; check the directory before relying on supplier-pool sufficiency for a set-aside decision.
