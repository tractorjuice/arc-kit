# Canada Privacy Impact Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-pia` generates a Canada federal Privacy Impact Assessment (PIA) under the Privacy Act (R.S.C., 1985, c. P-21) and the TBS Directive on Privacy Impact Assessment. It scopes the programme, establishes lawful authority for collection, builds a per-element personal information inventory, runs an Oakes-derived necessity and proportionality analysis, registers privacy risks with mitigations, captures Privacy Act §7/§8 disclosure rationale, and surfaces the OPC notification decision.

A federal PIA is mandatory for any new programme or substantial modification involving personal information, and the TBS Directive requires notification of the Office of the Privacy Commissioner at least 30 days before launch. The artefact this command produces is therefore not optional — treat it as a delivery gate, not a sign-off formality. Where lawful authority is unclear, mark it `<TBC>` and resolve before launch: collection without statutory authority is not lawful under §4 of the Privacy Act.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Programme description, processing activities, decision logic |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Per-element personal information inventory and sensitivity flags |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Entities and relationships carrying personal information |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Subject populations, partner agencies, processors |

---

## Command

```bash
/arckit:ca-pia <project ID or service description>
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
| Individual Rights | §12 access, §13 PIB registration, correction, complaint to OPC |
| OPC Notification Trigger Analysis | Trigger-by-trigger NOTIFY / N/A decision and date |
| PIA Approval Chain | ATIP coordinator → ADM → head of institution, OPC and TBS notifications |
| Action Tracker | Open mitigations with owner, due date, status |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- A new federal programme or service is being designed and personal information will be collected, used, or disclosed.
- A substantial modification is proposed: new data elements, new purposes, new disclosure recipients, change of contractor or processor, change of jurisdiction (including cloud region).
- Pre-launch — at least 30 days before go-live to satisfy the TBS Directive's OPC notification window.
- A previous PIA needs to be refreshed because the programme has materially evolved or sensitivity classification has changed.

---

## Common pitfalls

- **Treating PIA as a one-shot artefact.** The PIA is a living document. Re-trigger it on substantial modifications — new data, new purpose, new recipient, new processor, new jurisdiction.
- **Missing the OPC 30-day window.** The TBS Directive requires notification at least 30 days before launch for new programmes or substantial modifications. Build the OPC review window into the delivery plan from the start.
- **Using PIPEDA framing for a federal programme.** PIPEDA is the federal private-sector regime. The Privacy Act governs federal public-sector institutions. They have different lawful-basis structures, different disclosure rules, and different oversight bodies — do not cross-cite them as if interchangeable.
- **Under-citing lawful authority.** A vague reference to a programme name is not statutory authority. Cite the enabling statute or regulation that authorises collection. If there is none, mark `<TBC>` and treat it as a launch blocker.
- **Forgetting the Personal Information Bank.** PIB registration in TBS InfoSource is required under §13. An unregistered PIB undermines the §12 access right and exposes the institution.
- **Conflating §7 and §8.** §7 governs use after collection; §8 governs disclosure to third parties. Each §8(2)(a)–(m) routine-use letter must match the actual disclosure scenario — do not aggregate dissimilar disclosures under one letter.

---

## Handoffs

- **`risk`** — PIA findings feed the privacy and regulatory entries in the project-level risk register. Carry the Privacy Risks and Mitigations table forward with the same risk IDs so the residual posture is traceable.
- **`ca-atip`** — The personal-information disclosure register continues into the Access to Information / Privacy Act reconciliation. The same severance and disclosure rules drive both the §12 access response and the broader ATIP regime.
- **`ca-aia`** — Required when automated decision-making touches personal information. The Algorithmic Impact Assessment inherits the PIA personal-information inventory; do not duplicate, link.

---

## Statutory currency

The Privacy Act is comparatively stable, but the TBS Directive on Privacy Impact Assessment evolves and the OPC issues operational guidance regularly. Cite the current version of the Directive (TBS Doc ID 18308) and the most recent OPC guidance documents at the time of generation, and record the verification date in the Document Register. Provincial privacy regimes (Loi 25 in Quebec, FIPPA in Ontario, BC PIPA, etc.) layer on top where the programme involves provincial or private-sector partners — those require their own assessments and are out of scope for this PIA.
