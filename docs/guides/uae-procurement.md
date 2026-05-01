# UAE Federal Procurement Strategy Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-procurement` generates a federal procurement strategy under UAE Federal Decree-Law No. 11 of 2023 on Procurements in the Federal Government. Produces ITT / RFP packs aligned with the Ministry of Finance Digital Procurement Platform (DPP) templates, an In-Country Value (ICV) plan, the evaluation report structure, and the contract register.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Scope to be procured |
| SOBC (`ARC-<id>-SOBC-v*.md`) | Strategic case and budget |
| Risk register (`ARC-<id>-RISK-v*.md`) | Risks to allocate to supplier vs entity |
| Prior procurement / vendor research artefacts (if present) | Market scan inputs |

---

## Command

```bash
/arckit.uae-procurement <project ID or procurement scope>
```

Output: `projects/<id>/ARC-<id>-FPRO-v1.0.md`

---

## Strategy Structure

| Section | Contents |
|---------|----------|
| Procurement Strategy | Route to market, lot structure, contract type, term, options |
| ITT / RFP Pack Outline (DPP-aligned) | Sections, evaluation criteria placeholders, mandatory annexes |
| ICV Plan | In-Country Value targets and supplier obligations |
| Evaluation Methodology | Mandatory / quality / commercial weights and scoring rubric |
| Contract Register Schema | Contract metadata, milestones, KPIs, penalty regime |
| External References | Federal Decree-Law 11/2023 and DPP citations |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Strategic case | Business case and budget | `/arckit.sobc` |
| Procurement | Strategy + ITT / RFP pack + ICV | `/arckit.uae-procurement` |
| Market | Vendor research and shortlist | `/arckit.research` |
| Evaluation | Formal supplier evaluation | `/arckit.evaluate` |

---

## Review Checklist

- Route to market matches Decree-Law 11/2023 thresholds and exemption criteria.
- ITT / RFP follows DPP template sections (no custom annexes that conflict with DPP requirements).
- ICV target is stated with measurement methodology.
- Evaluation weights add to 100% and are pre-published.
- Mandatory criteria (pass / fail) listed before scored criteria.
- Contract register schema captures KPIs and penalty regime.
- Procurement strategy and ICV plan handed off to SOBC.

---

## Key Notes

- **DPP alignment**: All federal procurements above threshold are run through the MoF Digital Procurement Platform — the ITT / RFP pack must conform to DPP templates.
- **ICV is mandatory**: In-Country Value scoring is non-optional for many federal procurements — define the target before going to market.
- **Evaluation parity**: Use `/arckit.evaluate` to drive the formal supplier evaluation against the methodology defined here.
- **Community-contributed**: Output should be reviewed by qualified federal procurement counsel before reliance.
