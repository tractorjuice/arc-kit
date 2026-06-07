# Canada ATIP Reconciliation Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-atip` generates a Canada federal ATIP (Access to Information / Privacy Act) Reconciliation under the Access to Information Act (R.S.C., 1985, c. A-1) and the Privacy Act (R.S.C., 1985, c. P-21). It produces an information holdings inventory categorised Public / Protected / Classified, an exemption mapping per holding under the ATI Act (§13, §14, §15, §16 and §16.1–§16.6, §19, §21, §23, §24), a Privacy Act §4–§8 use and disclosure register with §8(2)(a)–(m) routine-use letters individually analysed, a severance design with field-level rules and an audit log schema, the §7 30-day request workflow with §9 extension and §27 consultation handling, and the annual report mapping for OIC, OPC and TBS InfoSource.

ATIP reconciliation sits between the Privacy Impact Assessment and the data model. The PIA establishes lawful authority and the personal-information inventory; the data model carries the field-level structure and classification flags. ATIP reconciles the two against the disclosure regime — proving that every disclosure has a Privacy Act §8 basis, every redaction has an ATI Act exemption head, and every hybrid public/protected view has explicit severance rules with a per-field audit trail. Public/protected hybrid systems (e.g. registers carrying both a transparency view and an investigative back-end) are the most common pattern and the most common defect: if you cannot answer "what is suppressed in the public view, under which exemption, and how is the redaction logged?", you are not ATIP-ready.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Disclosure scenarios, programme description, third-party touchpoints |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Per-element sensitivity flags and disclosure recipients |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Field-level structure that the severance rules act on |
| Privacy Impact Assessment (`ARC-<id>-PIA-v1.0.md`) | Authoritative source for the §4–§8 register and PIB references |

---

## Command

```bash
/arckit:ca-atip <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-ATIP-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Holdings posture, headline exemptions, §8(2) letters in play, severance summary |
| Information Holdings Inventory | Per-holding category Public/Protected/Classified, PIB ref, owner, lifecycle |
| Access to Information Act Mapping | Exemption section per holding (§13, §14, §15, §16/§16.1–§16.6, §19, §21, §23, §24) with justification |
| Privacy Act §4–§8 Register | Collection (§4, §5/§5(2)(3)), use (§7/§7(a)), disclosure (§8 with §8(2)(a)–(m) individually) |
| Severance Design | Field-level rules table, audit log schema, re-identification risk register |
| ATIP Request Workflow | §7 30-day clock, §9 extensions, §27 consultation; SLA per step; extension justification template |
| Annual Report Mapping | OIC, OPC, TBS InfoSource feeds and reporting cadences |
| Open Issues | Unresolved exemption rationales, missing PIBs, pending consultations, severance `<TBC>` |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- After the PIA is drafted — the PIA's personal-information inventory is the authoritative source for the §4–§8 register here, and re-deriving it would create drift.
- Before launch — severance design, third-party consultation lists, and PIB updates must be signed off before the public register opens.
- After a substantial change to information holdings (new dataset, new disclosure recipient, new processor, new jurisdiction).
- After a change in disclosure recipients or routine-use letters — adding or removing a §8(2) letter is a substantial change.

---

## Common pitfalls

- **Treating §19 as automatic.** §19 (personal information) is not a blanket exemption. Privacy Act §8(2) routine-use disclosures may still apply, including §8(2)(a) consistent use, §8(2)(b) consent, and §8(2)(m) public-interest disclosure with notice to the OPC. Test §19 against §8(2)(a)–(m) before invoking.
- **Missing the 30-day clock.** §7 of the ATI Act starts the clock at receipt of the request (and any required fee). §9 extensions require written notice with reasons and a stated timeline before the clock expires. Failure exposes the institution to OIC complaints under §30 and Federal Court review under §41.
- **Under-modelling re-identification.** Hybrid public/protected systems can leak through cumulative disclosures, metadata gaps, and small-cell aggregates. Build a re-identification risk register; do not assert "anonymised" without a k-anonymity threshold or differential-privacy parameter.
- **Forgetting PIB updates.** Personal Information Bank registration in TBS InfoSource is required under §13 of the Privacy Act. New holdings or changed purposes require a PIB update; an unregistered or stale PIB undermines the §12 access right and is a §30 complaint waiting to happen.
- **Asserting §16 or §15 without identifying the head.** Each section has multiple heads (§16(1)(a) ongoing investigation, §16(1)(b) techniques, §16(1)(c) injurious-to-enforcement; §15 international affairs vs defence vs national security). Reviewers and the OIC expect the specific head, not the bare section number.
- **Aggregating dissimilar §8(2) disclosures.** Each §8(2)(a)–(m) routine-use letter must match the actual disclosure scenario. Do not group disclosures to different recipients or for different purposes under one letter.

---

## Handoffs

- **`data-model`** — Severance rules in this artefact feed back into the data model's classification flags, role-based access controls, and field-level masking. Update the data model with a `severance:` annotation per field that maps to the rules in the Severance Design section so the runtime enforcement is auditable against the policy.
- **`ca-pia`** — The PIA is the upstream artefact and the authoritative source for the §4–§8 register here. If a §8(2) letter is added or a recipient changes during ATIP reconciliation, push the change back into the PIA rather than letting the two artefacts drift.

---

## Statutory currency

The Access to Information Act was substantially amended by the Access to Information Modernization Act (Bill C-58, 2019), which introduced proactive publication obligations under Part 2 and expanded the OIC's order-making powers. Post-2019 jurisprudence is still being settled — cite carefully and check Federal Court / FCA decisions current at the date of generation. The Privacy Act is comparatively stable but is itself under reform consideration; cite the current consolidated text and verify against the Justice Laws Website. Record the verification date in the Document Register. Provincial access and privacy regimes (FIPPA in Ontario, Loi sur l'accès in Quebec, BC FIPPA, etc.) layer on top where the programme involves provincial or private-sector partners and are out of scope for this federal reconciliation.
