# Canada Privacy Impact Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-ca:ca-pia` generates a Canada federal Privacy Impact Assessment (PIA) under the Privacy Act (R.S.C., 1985, c. P-21) and the TBS Standard on Privacy Impact Assessment. It scopes the programme, establishes lawful authority for collection, builds a per-element personal information inventory, runs an Oakes-derived necessity and proportionality analysis, registers privacy risks with mitigations, captures Privacy Act §7/§8 disclosure rationale, and surfaces the OPC notification decision.

A federal PIA must be completed before a new programme or activity that uses personal information for an administrative purpose starts, and updated before a substantial modification (Standard on Privacy Impact Assessment C.2.2.9). Every completed PIA goes to TBS and the Office of the Privacy Commissioner (C.2.2.12), and the institution must tell both about planned initiatives early enough for them to review and discuss the issues (Policy on Privacy Protection 4.2.2). There is no fixed notice period. The artefact this command produces is therefore not optional — treat it as a delivery gate, not a sign-off formality. Where lawful authority is unclear, mark it `<TBC>` and resolve before launch: collection without statutory authority is not lawful under §4 of the Privacy Act.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Programme description, processing activities, decision logic |
| Data requirements (`DR-*` in `ARC-<id>-REQ-v*.md`) | Per-element personal information inventory and sensitivity flags |
| Data model (`ARC-<id>-DATA-v*.md`) | Entities and relationships carrying personal information |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Subject populations, partner agencies, processors |

---

## Command

```bash
/arckit-ca:ca-pia <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-PIA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Programme, lawful authority posture, headline privacy risks, OPC notification decision |
| Programme / System Description | Description, owner, subject populations, lifecycle stage, personal information lifecycle |
| Lawful Authority | Privacy Act §4 collection authority and the enabling statute or regulation |
| Personal Information Inventory | Per-element source, purpose, sensitivity, retention, disclosure recipients, PIB ref |
| Necessity and Proportionality | Oakes four-step: pressing and substantial objective, rational connection, minimal impairment, proportional effects |
| Privacy Risks and Mitigations | Risk register with likelihood, impact, mitigations, residual |
| Transfers and Disclosures | §7 use, §8 disclosure with §8(2)(a)–(m) routine-use mapping, cross-border flags |
| Individual Rights | §12 access, §10 PIB registration, correction, complaint to OPC |
| OPC Notification Trigger Analysis | Trigger-by-trigger NOTIFY / N/A decision and date |
| PIA Approval Chain | ATIP coordinator → ADM → head of institution, OPC and TBS notifications |
| Action Tracker | Open mitigations with owner, due date, status |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- A new federal programme or service is being designed and personal information will be collected, used, or disclosed.
- A substantial modification is proposed: new data elements, new purposes, new disclosure recipients, change of contractor or processor, change of jurisdiction (including cloud region).
- Early in design, not at go-live. The decision to start or update a PIA is recorded on TBS's Privacy Checklist before the programme starts (C.2.2.6), and the completed PIA goes to TBS and the OPC before launch, with time to act on their recommendations (C.2.2.12–C.2.2.13).
- A previous PIA needs to be refreshed because the programme has materially evolved or sensitivity classification has changed.

---

## Common pitfalls

- **Treating PIA as a one-shot artefact.** The PIA is a living document. Re-trigger it on substantial modifications — new data, new purpose, new recipient, new processor, new jurisdiction.
- **Leaving TBS and the OPC until the end.** There is no fixed notice period, but the Policy on Privacy Protection requires notification at a sufficiently early stage for TBS and the OPC to review and discuss the issues, and the Standard requires the institution to consider and respond to their recommendations on the PIA. Build that review into the delivery plan from the start.
- **Using PIPEDA framing for a federal programme.** PIPEDA is the federal private-sector regime. The Privacy Act governs federal public-sector institutions. They have different lawful-basis structures, different disclosure rules, and different oversight bodies — do not cross-cite them as if interchangeable.
- **Under-citing lawful authority.** A vague reference to a programme name is not statutory authority. Cite the enabling statute or regulation that authorises collection. If there is none, mark `<TBC>` and treat it as a launch blocker.
- **Forgetting the Personal Information Bank.** Personal information banks are required under §10, registered with TBS and published in InfoSource (the §11 index). An unregistered PIB undermines the §12 access right and exposes the institution.
- **Conflating §7 and §8.** §7 governs use after collection; §8 governs disclosure to third parties. Each §8(2)(a)–(m) routine-use letter must match the actual disclosure scenario — do not aggregate dissimilar disclosures under one letter.

---

## Handoffs

- **`risk`** — PIA findings feed the privacy and regulatory entries in the project-level risk register. Carry the Privacy Risks and Mitigations table forward with the same risk IDs so the residual posture is traceable.
- **`ca-atip`** — The personal-information disclosure register continues into the Access to Information / Privacy Act reconciliation. The same severance and disclosure rules drive both the §12 access response and the broader ATIP regime.
- **`ca-aia`** — Required when automated decision-making touches personal information. The Algorithmic Impact Assessment inherits the PIA personal-information inventory; do not duplicate, link.

---

## Statutory currency

The Privacy Act is comparatively stable, but the TBS instruments change and the OPC issues operational guidance regularly. The *Directive on Privacy Impact Assessment* (TBS Doc ID 18308) was rescinded on 9 October 2024. Its requirements now sit in Appendix C, *Standard on Privacy Impact Assessment*, of the *Directive on Privacy Practices* (TBS Doc ID 18309), under the *Policy on Privacy Protection* (TBS Doc ID 12510). Cite the current versions of both and the most recent OPC guidance documents at the time of generation, and record the verification date in the Document Register. Provincial privacy regimes (Loi 25 in Quebec, FIPPA in Ontario, BC PIPA, etc.) layer on top where the programme involves provincial or private-sector partners — those require their own assessments and are out of scope for this PIA.
