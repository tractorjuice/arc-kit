# Australian DISP Member Self-Attestation Pack Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-disp-attestation` generates a Defence Industry Security Program (DISP) Member self-attestation pack. It consolidates the evidence base across the 4 DISP security domains (Governance, Personnel Security, Physical Security, Information &amp; Cyber), captures the Foreign Ownership Control & Influence (FOCI) declaration, surfaces the supply-chain security posture, and structures the annual board attestation that DISP membership requires.

DISP is the Department of Defence's supplier-side security accreditation. Level 2 (the most common operational ceiling for non-classified Defence work) requires demonstrable evidence across all four domains and depends on E8 ML2 as the cyber baseline. This pack is the consolidation artefact that the other AU commands feed into — run it last.

---

## Inputs

This is the consolidation artefact. It draws from every other AU command's output:

| Artefact | Purpose |
|----------|---------|
| `/arckit:au-e8-posture` (`ARC-<id>-AUE8-v1.0.md`) | E8 ML2+ baseline for the cyber domain |
| `/arckit:au-ism-controls` (`ARC-<id>-AUISM-v1.0.md`) | ISM SoA underpinning Information & Cyber |
| `/arckit:au-pia` (`ARC-<id>-AUPIA-v1.0.md`) | Personal information handling for Information & Cyber |
| `/arckit:au-ndb-playbook` (`ARC-<id>-AUNDB-v1.0.md`) | Breach response capability |
| `/arckit:au-pspf` (`ARC-<id>-AUPSPF-v1.0.md`) | PSPF maturity for Governance, Personnel, Physical, Information |
| `/arckit:au-ai-assurance` (`ARC-<id>-AUAIA-v1.0.md`) | AI assurance for Defence-facing AI systems |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Accountable authority, security advisor, FOCI signatory |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | Supplier-side risks |

---

## Command

```bash
/arckit:au-disp-attestation <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUDISP-v1.0.md`

---

## Pack Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | DISP level targeted, attestation status, headline gaps, board action required |
| Member Identity | Legal entity, ABN, ownership tree, accountable individuals |
| Foreign Ownership Control & Influence (FOCI) Declaration | Ownership, control, influence; mitigation arrangements where required |
| Domain 1 — Governance | Security governance, risk, accountability; evidence cross-references to PSPF Outcome 1 |
| Domain 2 — Personnel Security | Vetting, ongoing suitability, separation; evidence from PSPF Outcome 3 |
| Domain 3 — Physical Security | Premises, certified zones, custody; evidence from PSPF Outcome 4 |
| Domain 4 — Information & Cyber | E8, ISM, PIA, NDB evidence; AI assurance for AI-enabled Defence services |
| Supply Chain Security | Sub-contractor vetting, supply-chain risk register, security clauses |
| Incident History | Material security incidents in attestation window |
| Annual Board Attestation | Statement signed by accountable authority confirming the posture |
| Maintenance Cadence | Annual attestation cycle; per-incident updates |

---

## Regulatory Anchors

- **DISP Member Manual** — authoritative source for DISP-level requirements
- **Defence Security Principles Framework (DSPF)** — incorporated by reference for DISP suppliers
- **ASD Essential Eight Maturity Model** — ML2 baseline for DISP Level 2
- **ASD Information Security Manual** — control evidence base for Domain 4
- **Privacy Act 1988 (Cth)** — for personal information handling
- **Protective Security Policy Framework** — referenced across Domains 1, 2, 3, 4
- **Cyber Security Act 2024 (Cth)** — incident-reporting interactions

---

## When to Run

- During DISP application or upgrade (Level 1 → 2 → 3)
- Annually for ongoing DISP members (the attestation cycle)
- On material change to FOCI, leadership, or the security posture (re-attestation may be required)
- On significant security incident in attestation window

---

## Common Pitfalls

- **Treating it as paperwork** — DISP attestation is a board-level statement of fact. Inaccuracies create criminal exposure under Defence security legislation. Validate every cross-reference.
- **Thin FOCI declaration** — full ownership tree is required, including indirect control. Engage corporate counsel early if ownership is non-trivial.
- **Inheriting evidence without verification** — if Domain 4 cites the ISM SoA, the underlying SoA must be current and accurate. Don't cite stale evidence.
- **Missing sub-contractor coverage** — DISP suppliers carry obligations across the supply chain. Sub-contractor vetting evidence must be in the pack.

---

## Handoff

This is the consolidation artefact for DISP attestation. It is read by the Department of Defence, Defence Industry Security Branch, and (where relevant) procurement-side security assessors. After board sign-off, the attestation cycle resets for 12 months.
