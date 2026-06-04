# Canada First Nations OCAP® Sovereignty Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-ocap` generates a First Nations OCAP® (Ownership, Control, Access, Possession) sovereignty assessment for any federal information system that processes Indigenous data. The output is a per-dataset OCAP mapping anchored on the First Nations Information Governance Centre (FNIGC) framework, with separate tracks for Métis data (USAI principles) and Inuit data (ITK *National Inuit Strategy on Research*). It is not a substitute for direct engagement with FNIGC, the affected First Nation(s), Métis Nation governing members, or Inuit organisations.

The command enforces a structural FNIGC pre-engagement gate. If the architect cannot confirm that an FNIGC pre-engagement is booked or in progress, the artefact remains a planning scaffold only — the per-dataset OCAP register, USAI / ITK considerations, DSA terms, repatriation plan, and co-governance arrangement are deferred until engagement is confirmed. OCAP is a relationship; the artefact records and supports the relationship rather than substituting for it.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | System scope and Indigenous-data triggers |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Per-element collection / use / disclosure |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Entity-level data classifications |
| Privacy Impact Assessment (`ARC-<id>-PIA-v*.md`) | Privacy controls inherited; OCAP layers community sovereignty over the PIA's federal privacy posture |

---

## Command

```bash
/arckit:ca-ocap <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-OCAP-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification with community-protected override note |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Indigenous data in scope, FNIGC engagement status, headline OCAP findings or planning-scaffold flag |
| FNIGC Pre-Engagement Confirmation | Engagement status, contacts, nature; Planning Scaffold Mode checkbox; engagement-letter scaffold |
| Indigenous Data Inventory | Per dataset: First Nation(s) of origin, data nature, custodianship, transfer history, sensitivity |
| OCAP Principles Mapping | Per dataset: Ownership / Control / Access / Possession sub-tables |
| USAI Considerations | Métis data: Utility, Self-Determination, Access, Inter-relationships |
| ITK Principles Considerations | Inuit data: NISR principles per Inuit Nunangat region |
| Data Sharing Agreement Terms | Indigenous co-signatory, purpose limitation, time-bound, revocability, audit rights, sub-processor restrictions |
| Repatriation Plan | Per dataset: historical context, return / destroy decision, method, owner, date |
| Co-Governance Arrangements | Body, Indigenous representation, decision rule, appeal pathway |
| Risks and Mitigation Register | Cultural, legal, reputational risks with residual rating |
| Open Items | FNIGC follow-up, classification overrides, USAI / ITK engagement gaps, DSA signatures, UNDRIP review |
| External References | Document Register (FNIGC OCAP®, UNDRIP Act, USAI, ITK NISR, Privacy Act), Citations, Unreferenced |

---

## When to run

- Any federal system processes administrative, statistical, traditional-knowledge, biological, image, audio, or video data originating from First Nations, Métis, or Inuit populations.
- A project is in pre-engagement scoping and needs a planning scaffold to brief FNIGC and community contacts.
- Pre-launch of any service that will hold Indigenous data, before the system goes live.
- A substantive change to the data, custodianship arrangement, or sharing scope of an existing system holding Indigenous data.
- A repatriation request or community-led review prompts a re-assessment of an existing system's OCAP posture.

The earlier this command is run, the more useful the planning scaffold becomes — running `ca-ocap` once design is locked-in tends to surface community-protected classifications and possession arrangements that should have shaped the design itself.

If the assessment exists in planning-scaffold mode for an extended period, treat the engagement gap itself as a delivery risk and escalate it through the project's risk register.

---

## Common pitfalls

- **Treating OCAP as a checklist.** OCAP is a relationship. The artefact supports the relationship; it does not replace direct engagement with FNIGC and the affected nation.
- **Collapsing First Nations, Métis, and Inuit into one regime.** OCAP applies to First Nations data; Métis data is governed by USAI; Inuit data follows ITK NISR. Maintain distinct engagement tracks and contacts.
- **Skipping FNIGC pre-engagement.** The gate in step 5.1 is mandatory. If engagement is not confirmed, the artefact must remain a planning scaffold.
- **Assuming federal authority overrides community sovereignty.** It does not. Community-protected classifications can exceed the federal scheme; record the override and raise an Open Item.
- **Permitting secondary analysis without renewed consent.** Each new use requires a renewed community consent path; do not rely on the original collection consent.

---

## Handoffs

- **`data-model`** — OCAP-mapped data classifications and access controls feed the data model's stewardship and access policies. Where a dataset is community-controlled, the data model must record the controlling body and the access tier.
- **`ca-pia`** — Personal-information processing of Indigenous data inherits the federal PIA controls plus OCAP-derived restrictions. Run `ca-pia` if any personal information is in scope; the OCAP register layers community sovereignty on top of the PIA's federal privacy posture.
- **`ca-atip`** — ATIP severance design must reflect OCAP access and control determinations for Indigenous datasets. Where access is community-controlled, ATIP exemptions and severance must align so federal access requests do not bypass community decision authority.

---

## Statutory currency

The *United Nations Declaration on the Rights of Indigenous Peoples Act* (S.C. 2021, c. 14) commits the Crown to align federal laws with the Declaration through an evolving Action Plan. Cite the current Action Plan version published by the Department of Justice. FNIGC training and guidance is the authoritative source on OCAP® application; verify the current FNIGC course and guidance pages before relying on the output. USAI guidance evolves through the Métis Nation Council and provincial governing members; ITK guidance evolves through the *National Inuit Strategy on Research* and the Inuit-Crown Partnership Committee.

---

OCAP® is a registered trademark of the First Nations Information Governance Centre. This command and the artefacts it produces support — but do not substitute for — direct, respectful engagement with FNIGC, the affected First Nation(s), Métis Nation governing members, and Inuit organisations. Treat every assessment as a record of an ongoing relationship rather than a one-time governance checkpoint.
