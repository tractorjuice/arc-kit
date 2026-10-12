# Canada Security of Information Act Handling Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-soia` generates a Canada *Security of Information Act* (SOIA) handling plan for a federal information system that processes Special Operational Information (SOI) or other classified material. The artefact captures the SOI inventory under the s.8 statutory definition, the marking and handling matrix, the transmission-channel matrix, the compartment and need-to-know register, destruction and sanitisation routes, the CSIS Act §16 / §19 coordination map, the RCMP National Security Programme liaison points, the breach-response runbook, and the personnel-reliability envelope.

SOIA handling sits on top of the ITSG-33 security baseline. The ITSG-33 Statement of Applicability fixes the categorisation, the control profile, and the cryptographic envelope; the SOIA plan layers the statutory handling rules — compartmentation, the Third-Party Rule for foreign-shared product, and the breach-response timing that distinguishes SOI from material that is merely classified. Run `ca-itsg-33` first; the SOIA artefact reads its categorisation as a prerequisite. Note that the SOIA plan itself will frequently warrant a SECRET or higher classification — store, mark, and handle the artefact accordingly.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Functional context and the SOI-relevant data flows |
| ITSG-33 Statement of Applicability (`ARC-<id>-ITSG-v1.0.md`) | System-level categorisation, control profile, and CMVP envelope — prerequisite |
| FITAA Compliance Assessment (`ARC-<id>-FITAA-v1.0.md`) | Where present, the protected investigative dataset overlaps with SOI |
| Privacy Impact Assessment (`ARC-<id>-PIA-v1.0.md`) | Personal-information drivers for any identities subject to s.8 protection |

---

## Command

```bash
/arckit:ca-soia <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-SOIA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) — note the artefact itself is likely classified |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | SOI scope, highest classification handled, compartment count, breach-response posture |
| SOI Inventory | Per-asset s.8 categorisation with originator and stewardship |
| Marking Matrix | Classification, caveats (CEO / NOFORN / FVEY), compartments, releasability |
| Handling Rules | At rest, in transit, in use — tiered per classification level |
| Transmission Channel Matrix | Allowed / Not Allowed per classification × channel with caveat footnotes |
| Compartment / Need-to-Know Register | Owners, access-list size, audit cadence, indoctrination |
| Destruction and Sanitisation | Per-media-class methods anchored on CSE ITSP.40.006 |
| CSIS Act §16 / §19 Coordination | System role, coordinating contacts, artefacts |
| RCMP NSP Liaison | INSET / SI&IS / Federal Policing triggers and contacts |
| Breach Response Runbook | Timed runbook from minutes-to-30-days plus severity escalation table |
| Personnel Reliability | Per-role clearance, cycle, briefing, indoctrination |
| Open Items | Statutory-currency caveats, pending MOUs, indoctrination backlog |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- Any system that processes SOI or other classified material — the SOIA plan is mandatory before the system handles its first SOI artefact.
- Vendor-managed services touching classified material — the supplier-side handling rules must be designed before the contract authorises classified processing.
- Pre-authorisation for any TOP SECRET system — the authorising official will not grant Authority to Operate without a SOIA handling plan.
- Significant change to the compartment design — adding a compartment, dissolving a compartment, expanding the access list beyond a baseline threshold, or changing the indoctrination requirement.

---

## Common pitfalls

- **Treating compartmentation as a label rather than a control.** Compartmentation defaults to deny; every access decision is an explicit need-to-know determination. A compartment with a stale access list, no audit cadence, or default-allow indoctrination is functionally a non-compartment, and the auditor will say so.
- **Third-Party Rule violations on foreign-shared product.** CANADIAN EYES ONLY, NOFORN, and FVEY-restricted material can only be redistributed with the originator's consent. Routing CEO product over allied-shared infrastructure, or onward-sharing FVEY material to a non-FVEY recipient without consent, is a reportable breach.
- **Clearance-by-role rather than clearance-per-task.** A SECRET clearance authorises the holder to access SECRET material on a need-to-know basis; it does not authorise access to every SECRET system in the department. Build the access list per task, not per role title.
- **Under-defining breach-response timing.** Initial containment must occur within minutes — revoke access, isolate the system, suspend the account. Waiting for forensic completeness before containment is the second-highest-impact failure mode after default-allow on a compartment.
- **Conflating SOIA with the *Access to Information Act* §15 exemption analysis.** SOIA governs how SOI is created, marked, transmitted, stored, and destroyed across its lifecycle; ATIP §15 (international affairs and defence) and §16 (law enforcement) govern whether SOI is *disclosed* in response to an access request. They are different regimes with different decision-makers; the SOIA plan does not pre-empt the ATIP severance review, and vice versa.

---

## Handoffs

- **`ca-itsg-33`** — SOIA handling rules sit on top of the ITSG-33 security baseline. Categorisation and control profile are the prerequisite layer; run `ca-itsg-33` first so the SOIA plan can read the system-level categorisation as an input rather than re-deriving it.
- **`risk`** — SOIA-specific residual risks (compartment compromise, suspected unauthorised disclosure, supplier-side mishandling, compartment-MOU expiry) flow into the operational risk register. Carry the risk IDs forward so the residual posture is traceable in the same register as the ITSG-33 residuals.
- **`adr`** — Compartment design, MOU choices with CSIS or RCMP, and tier-promotion thresholds (when does a Protected C system promote to SECRET because the SOI envelope has expanded) warrant Architecture Decision Records. The SOIA plan captures the rule; the ADR captures the architectural rationale and the alternatives considered.

---

## Statutory currency

The *Security of Information Act* itself is comparatively stable, but the surrounding statutory envelope is not. CSIS Act amendments via Bill C-26 (cyber security) and Bill C-70 (foreign interference) are still settling, and Ministerial Directives shape § 16 collection and § 19 disclosure practice on shorter cycles than the Act. Cite the consolidated Justice Laws Website text and record the verification date in the External References section so a reviewer can audit currency.

---

The artefact produced by `/arckit:ca-soia` is itself often classified. Apply the same marking, storage, and handling rules to the plan as to the SOI it describes — store in a TBS-approved system, mark per the classification line in the Document Control header, and treat its distribution as a compartment access decision under the same need-to-know rules captured inside it.
