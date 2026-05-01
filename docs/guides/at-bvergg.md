# Austrian Federal Procurement Act (BVergG 2018) Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.at-bvergg` generates Austrian public procurement documentation aligned with **Bundesvergabegesetz 2018**. Covers Oberschwellen / Unterschwellen determination, ANKÖ publication requirements, BVergGVS secondary rules, and the BVwG review pathway.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Scope to be procured |
| SOBC (`ARC-<id>-SOBC-v*.md`) | Strategic case and budget |
| Risk register (`ARC-<id>-RISK-v*.md`) | Risks allocated supplier vs entity |
| AT DSGVO assessment (`ARC-<id>-ATDSG-v*.md`) | If processors of personal data are involved |
| AT NISG assessment (`ARC-<id>-ATNISG-v*.md`) | If contracting entity is Essential or Important |

---

## Command

```bash
/arckit.at-bvergg <project ID or procurement description>
```

Output: `projects/<id>/ARC-<id>-BVERGG-v1.0.md`

---

## Strategy Structure

| Section | Contents |
|---------|----------|
| Scope and Threshold Determination | Oberschwellen vs Unterschwellen calculation against current EU thresholds |
| Procurement Procedure Selection | Open / restricted / negotiated / competitive dialogue / innovation partnership |
| ANKÖ Publication Plan | Notice timing, language, content per BVergG §§ |
| Award Criteria | Mandatory / quality / price weights and scoring rubric |
| BVergGVS Secondary Rules | Defence / security / utilities / concessions where applicable |
| Vendor Security & Data-Protection Clauses | DSGVO processor clauses, NISG supply-chain clauses |
| BVwG Review Pathway | Standstill, pre-review request, BVwG appeal route and timing |
| External References | BVergG 2018 + EU directive transposition citations |

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
| Strategic case | Business case and budget | `/arckit.sobc` |
| Compliance pre-checks | Personal data + critical-entity status | `/arckit.at-dsgvo`, `/arckit.at-nisg` |
| Procurement | BVergG strategy + tender pack | `/arckit.at-bvergg` |
| Evaluation | Score vendor responses | `/arckit.evaluate` |
| Traceability | Link procurement requirements back | `/arckit.traceability` |

---

## Review Checklist

- Threshold determination cites the current EU threshold regulation.
- Procurement procedure choice has documented rationale (matches BVergG criteria).
- ANKÖ publication timing, content, and language meet BVergG §§ requirements.
- Award criteria pre-published with weights summing to 100%.
- DSGVO processor clauses included where personal data is processed.
- NISG supply-chain clauses included where contracting entity is Essential / Important.
- Standstill period and BVwG review pathway documented in vendor pack.

---

## Key Notes

- **Threshold drift**: EU procurement thresholds change every two years — items marked `[NEEDS VERIFICATION]` must be confirmed against the latest regulation before external publication.
- **Defence / utilities / concessions**: BVergGVS imposes additional rules — confirm sectoral scope before relying on the standard BVergG path.
- **Run after pre-checks**: `/arckit.at-dsgvo` and `/arckit.at-nisg` should run first if either applies — their clauses feed the vendor pack.
- **Community-contributed**: Output should be reviewed by qualified Vergabejurist / Rechtsabteilung before reliance.
