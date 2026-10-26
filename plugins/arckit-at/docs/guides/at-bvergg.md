# Austrian Federal Procurement Act (BVergG 2018) Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:at-bvergg` generates Austrian public procurement documentation aligned with the **Bundesvergabegesetz 2018**, as amended by the **Vergaberechtsgesetz 2026** (BGBl. I Nr. 8/2026, in force 1 March 2026; eForms from 1 October 2026). Covers Oberschwellen / Unterschwellen determination, ANKÖ publication requirements, BVergGVS secondary rules, and the BVwG review pathway.

---

## Inputs

| Artefact | Requirement | Purpose |
|----------|-------------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Mandatory (warns if missing) | Scope to be procured — the Leistungsbeschreibung is traced to FR / NFR / INT |
| Risk register (`ARC-<id>-RISK-v*.md`) | Recommended | Vendor, lock-in, sovereignty and supply-chain risks |
| AT DSGVO assessment (`ARC-<id>-ATDSG-v*.md`) | Recommended | Auftragsverarbeitung clauses where processors of personal data are involved |
| AT NISG assessment (`ARC-<id>-ATNISG-v*.md`) | Recommended | Supply-chain clauses where the contracting entity is Essential or Important |
| Secure by Design assessment (`ARC-<id>-SECD-v*.md`) | Recommended | Security controls to require of the supplier |
| Architecture principles, data model | Optional | Open-source and cloud policy; data categories that drive DPA and sovereignty clauses |

The business case (`/arckit:sobc`) usually comes first in the workflow below, but the command does not read it — give the Auftragswert in the arguments or the requirements.

---

## Command

```bash
/arckit:at-bvergg <project ID or procurement description>
```

Output: `projects/<id>/ARC-<id>-BVERGG-v1.0.md`

---

## Strategy Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Auftragswert, threshold tier, procedure and publication at a glance |
| 1. Contracting Authority and Procedure | Auftraggeber classification, procedure selection (open / restricted / negotiated / competitive dialogue / innovation partnership), threshold determination against current EU thresholds |
| 2. Leistungsbeschreibung | Functional, non-functional, integration and data scope traced to requirements; accessibility (EN 301 549) |
| 3. Eignung | Ausschlussgründe (§78), financial and technical suitability, proportionality |
| 4. Zuschlagskriterien | Bestbieter award criteria, weights and scoring method |
| 5. Vertragliche Regelungen | SLA, Auftragsverarbeitung (DSGVO), NISG supply-chain clauses, IP / open source / exit, governing law |
| 6. Publication and Timeline | ANKÖ and TED notices, eForms, Angebotsfrist, Q&A, standstill, award |
| 7. Review and Remedies | BVwG / Landesverwaltungsgerichte, fees, interim measures |
| 8. Vergabeakt | Procurement file structure, retention, audit trail, ESPD annex |
| External References | BVergG 2018 (idF Vergaberechtsgesetz 2026) + EU directive transposition citations |

---

## Threshold Reference

| Tier | Trigger |
|------|---------|
| Oberschwellen | Above EU threshold — full BVergG regime, ANKÖ publication, EU OJ |
| Unterschwellen | Below EU threshold — lighter regime, national publication |

> EU thresholds are updated every two years — confirm the current value against the latest EU threshold regulation.

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Strategic case | Business case and budget | `/arckit:sobc` |
| Compliance pre-checks | Personal data + critical-entity status | `/arckit:at-dsgvo`, `/arckit:at-nisg` |
| Procurement | BVergG strategy + tender pack | `/arckit:at-bvergg` |
| Evaluation | Score vendor responses | `/arckit:evaluate` |
| Traceability | Link procurement requirements back | `/arckit:traceability` |

---

## Review Checklist

- Threshold determination cites the current EU threshold regulation.
- Procurement procedure choice has documented rationale (matches BVergG criteria).
- ANKÖ publication timing, content, and language meet BVergG §§ requirements.
- Award criteria pre-published with weights summing to 100%.
- DSGVO processor clauses included where personal data is processed.
- NISG supply-chain clauses included where contracting entity is Essential / Important.
- Accessibility clause cites EN 301 549 **v3.2.1** (WCAG 2.1 AA), not 2.2 AA — see Key Notes.
- Standstill period and BVwG review pathway documented in vendor pack.

---

## Key Notes

- **Vergaberechtsgesetz 2026**: the BVergG 2018 was substantially amended (BGBl. I Nr. 8/2026, in force 1 March 2026; eForms from 1 October 2026) — permanent Direktvergabe limits (supplies/services €143K, works €200K; document ≥3 offers from €50K), harmonised Ausschlussgründe/Selbstreinigung, eForms below-threshold, and a tiered Nachprüfungs-fee system. The BVergG 2018 keeps its name and numbering.
- **Threshold drift**: EU procurement thresholds change every two years — items marked `[NEEDS VERIFICATION]` must be confirmed against the latest regulation before external publication.
- **Accessibility standard version**: §107 BVergG invokes EN 301 549, and the version that matters is the one cited in the Official Journal, because that is what carries a presumption of conformity. Today that is **v3.2.1**, which normatively references **WCAG 2.1 AA**. The revision carrying WCAG 2.2 AA (v4.1.1, drafted as v4.1.0 for public review in November 2025) is expected to be OJ-cited around October 2026 `[NEEDS VERIFICATION]`. Specifying 2.2 AA before that citation raises the bar above what the law requires without saying so, which is a defensible choice for a long contract but has to be a stated decision rather than a copied figure. Note this differs from the UK, where SI 2022/1097 replaced the fixed WCAG reference with a rolling one and 2.2 AA is already the monitored target — that UK position does not transfer to an EU-derived regime.
- **Defence, concessions and utilities follow other rules**: defence and security procurement falls under the BVergGVS 2012, concessions under the BVergGKonz 2018, and utilities (Sektorenauftraggeber) under the sector provisions of the BVergG 2018 itself — confirm which applies before relying on the standard BVergG path.
- **Run after pre-checks**: `/arckit:at-dsgvo` and `/arckit:at-nisg` should run first if either applies — their clauses feed the vendor pack.
- **Community-contributed**: Output should be reviewed by qualified Vergabejurist / Rechtsabteilung before reliance.
