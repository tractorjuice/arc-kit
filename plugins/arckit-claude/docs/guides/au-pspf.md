# Australian Protective Security Policy Framework Scorecard Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-pspf` generates a scorecard against the Australian Government Protective Security Policy Framework (PSPF). It captures alignment with the 4 PSPF outcomes (security governance, information security, personnel security, physical security), evaluates against the 16 core requirements, surfaces the maturity posture per requirement, and captures the action plan for areas below target maturity.

The PSPF is the umbrella protective-security policy for Australian federal entities. The scorecard is read by accountable authorities (PGPA Act 2013 s16 duties) and by sectoral regulators (Defence, intelligence agencies, critical infrastructure operators). For DISP suppliers it underpins the security domains the DISP attestation pack consolidates.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, hosting model, personnel requirements |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Accountable authority, security advisor, vetting officer |
| `/arckit:au-ism-controls` output (`ARC-<id>-AUISM-v1.0.md`) | Information security evidence for Outcome 4 |
| `/arckit:au-e8-posture` output (`ARC-<id>-AUE8-v1.0.md`) | Cyber baseline for Outcome 4 |
| HLD (`ARC-<id>-HLD-v1.0.md`) | Physical environment, personnel scope, information flows |

---

## Command

```bash
/arckit:au-pspf <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUPSPF-v1.0.md`

---

## Scorecard Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Outcome-level maturity posture, headline gaps, board / accountable-authority attention |
| Scope | Business unit / service / system covered; out-of-scope statement |
| Outcome 1 — Security Governance | 4 core requirements: leadership, risk, accountability, security culture |
| Outcome 2 — Information Security | 4 core requirements: information assets, sharing, IT systems, accreditation |
| Outcome 3 — Personnel Security | 4 core requirements: ongoing suitability, separation, foreign influence, AGSVA |
| Outcome 4 — Physical Security | 4 core requirements: physical environments, certified zones, custody, equipment |
| Per-Requirement Scoring | For each of 16: target maturity, current maturity, evidence, gap analysis, action plan |
| Cross-References | Citations to ISM SoA, E8 posture, PIA, DSS conformance, DISP attestation |
| Maintenance Cadence | Annual refresh minimum; on material change to scope or environment |

---

## Regulatory Anchors

- **Protective Security Policy Framework (PSPF)** — Attorney-General's Department, current edition
- **PSPF Implementation Guides** — per-requirement interpretation
- **ASD Information Security Manual** — incorporated by reference for Outcome 4
- **PGPA Act 2013 s16** — federal accountable-authority duties; PSPF is the operational expression
- **Australian Government Security Vetting Agency (AGSVA)** — clearance authority for Outcome 3
- **Cyber Security Act 2024 (Cth)** — adjacent incident-reporting obligations on Outcome 4

---

## When to Run

- During design and pre-launch as part of the accreditation evidence base
- Annually as part of the accountable-authority assurance cycle
- On material change to the security scope: new physical premises, new personnel population, new classification ceiling
- DISP Level 2+ suppliers refresh on attestation cadence

---

## Common Pitfalls

- **Treating Outcome 2 as redundant with the ISM SoA** — the PSPF Outcome 2 view is wider (information assets including non-digital, sharing arrangements, accreditation). The ISM SoA is the technical evidence base, not a substitute.
- **Skipping personnel separation** — Outcome 3.2 (separation) is regularly under-evidenced. Document the off-boarding workflow with named owners.
- **Missing AGSVA vetting evidence** — claims about cleared personnel require concrete evidence (clearance ID, currency date) — not narrative.

---

## Handoff

Foundational input to `/arckit:au-disp-attestation` (DISP physical security, personnel security, and information protection domains draw directly from the PSPF scorecard). Cross-references back to `/arckit:au-ism-controls`, `/arckit:au-e8-posture`, and `/arckit:au-pia` (information protection evidence).
