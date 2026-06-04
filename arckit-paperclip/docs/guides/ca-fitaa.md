# Canada FITAA Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-fitaa` generates a Canada Foreign Influence Transparency and Accountability Act (FITAA) compliance assessment under Bill C-70 (2024). It scopes registrable activity, designs the public-vs-protected arrangement register, lays out the registration workflow and severance rules, captures the Commissioner liaison protocol, and surfaces a Charter §2 risk register.

The Office of the Commissioner of Foreign Influence Transparency is newly stood up. Regulations are still being made through 2025–2026, so this command treats unsettled section numbers and offence references as `<TBC at draft time>` placeholders that the reviewer must reconcile against the consolidated Justice Laws Website text before relying on the output.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Activity description and arrangement triggers |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Foreign principals, registrants, civil-society stakeholders |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Register data fields, public vs protected flags |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Arrangement / registrant / foreign-principal entities |

---

## Command

```bash
/arckit:ca-fitaa <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-FITAA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | FITAA exposure, registration model, headline Charter §2 findings |
| Activity Scoping | Statutory triggers, exclusions, decision tree mapped to project activities |
| Arrangement Register Design | Per-field schema with Public / Protected flag, 14-day update cadence |
| Registration Workflow | Submission, identity verification, acknowledgement, material-change update |
| Public Register vs Protected Investigative Data | Data flow, severance rules, withdrawal / correction process |
| Commissioner Liaison Protocol | Triggers, cadence, contacts, RCMP / CSIS coordination |
| Charter Risk Register | s.2(b) chilling-effect and s.2(d) association mitigations with residual rating |
| Compliance Schedule | Registrant-side triggers, 14-day clock, penalty exposures |
| Open Items | Statutory currency caveats with `<TBC>` markers |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- A project introduces a registration or transparency scheme for arrangements with foreign principals.
- A federal department is designing the public-facing FITAA register or its protected investigative back-end.
- A programme touches advocacy, journalism, diaspora engagement, or political activity and needs to assess registrability.
- A reviewer needs a structured Charter §2 risk register before service-design sign-off.

---

## Common pitfalls

- **Confusing FITAA with the Lobbying Act or Conflict of Interest Act.** These are separate transparency regimes with different scopes and registrars; FITAA targets foreign-principal arrangements, not domestic lobbying.
- **Treating Charter analysis as optional.** Any registration scheme that captures advocacy, journalism, or political activity is presumptively engaging Charter §2(b) and §2(d). The `ca-charter` handoff is unconditional.
- **Conflating public and protected views.** The public register and the investigative back-end must be designed as separate logical systems with audited severance rules. Mixing them creates ATIP-Act exposure under §15 (national security) and §16 (law enforcement).
- **Using stale statutory cites.** FITAA section numbering and offence references are still settling. Treat any unconfirmed cite as `<TBC at draft time>` and reconcile against the current Justice Laws text before publication.
- **Skipping bilingual review.** The public-facing register, registration forms, acknowledgements, and notices must be available in both official languages. Skipping `ca-ola` produces a non-compliant artefact.

---

## Handoffs

- **`ca-charter`** — Charter §2 expression and association analysis is required for any registration scheme that engages protected speech or association. Treat as unconditional after FITAA.
- **`ca-pia`** — Privacy Impact Assessment for personal information collected during arrangement registration. Required before the system collects or processes registrant or foreign-principal personal data.
- **`ca-atip`** — Reconciles the public-facing register against the protected investigative dataset; required severance design for hybrid public / protected views.
- **`ca-aia`** — Algorithmic Impact Assessment is triggered when registration triage uses any automated decision-making, scoring, or risk classification.

---

## Statutory currency

FITAA was enacted in June 2024 with regulations still emerging through 2025–2026. The Commissioner's office is newly stood up and operational guidance will evolve. Verify all citations against the current Justice Laws Website text and the Commissioner's published guidance before relying on this output. Where section numbers or offence references are unsettled, the template uses `<TBC at draft time>` placeholders that the reviewer must reconcile before publication.
