# Australian Protective Security Policy Framework Scorecard Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-pspf` generates a scorecard against the Australian Government Protective Security Policy Framework (PSPF). It assesses the six security domains of the current PSPF release (Governance, Risk, Information, Technology, Personnel, Physical), scores each in-scope numbered requirement with evidence and gaps, records the annual protective security report position, and captures the action plan for requirements not yet implemented.

The PSPF is the umbrella protective-security policy for Australian federal entities, administered by the Department of Home Affairs and re-released annually. Non-corporate Commonwealth entities must apply it (PGPA Act s 21); service providers implement the parts their deeds or agreements require. The scorecard is read by accountable authorities (PGPA Act 2013 s16 duties) and by sectoral regulators (Defence, intelligence agencies, critical infrastructure operators). For DISP suppliers it underpins the security domains the DISP attestation pack consolidates.

Earlier PSPF editions used four outcomes and 16 core requirements. The current release replaces that structure with six named domains and individually numbered requirements (for example `Requirement 0084 | TECH | All entities`); this command assesses against the current structure.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service description, hosting model, personnel requirements |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Accountable authority, security advisor, vetting officer |
| `/arckit:au-ism-controls` output (`ARC-<id>-AUISM-v1.0.md`) | ISM evidence for the Technology domain |
| `/arckit:au-e8-posture` output (`ARC-<id>-AUE8-v1.0.md`) | Essential Eight evidence for the Technology domain (Maturity Level Two requirement) |
| Vendor HLD (`vendors/*/hld-v*.md`) | Physical environment, personnel scope, information flows |

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
| Executive Summary | Applicability, release assessed, posture by domain, key gaps, annual report status |
| Entity Profile | Entity type, applicability driver, applicability tags, CSO and CISO, release assessed, last annual report |
| Requirement Scoping | Requirements in scope and scoped out per domain, from the PSPF List of Requirements |
| Governance Domain (GOV) | Security roles and governance, security planning, incidents, training, protective security reporting |
| Risk Domain (RISK) | Security risk management, third-party risk, countering foreign interference and espionage, contingency planning |
| Information Domain (INFO) | Classifications and caveats, information holdings, disposal, sharing |
| Technology Domain (TECH) | Technology lifecycle management with the ISM applied, cyber security strategy and Essential Eight Maturity Level Two, cyber security programs |
| Personnel Domain (PER) | Pre-employment screening, access to resources, security clearances and vetting, ongoing assessment, separation |
| Physical Domain (PHYS) | Physical security lifecycle, security zones, physical security measures and controls |
| Annual Protective Security Report | Reporting obligation, period, channel, submitter, submission to Home Affairs, Accountable Authority approval, Minister, ASD Cyber Security Survey |
| Compliance Summary | One row per domain: requirements in scope, implemented, partial, not implemented, N/A |
| Recommendations | Quick Wins / Short-Term / Medium-Term, each tagged to a domain and requirement number |
| ArcKit Evidence Integration | Diagram, data model, ServiceNow, risk, traceability, graph-report and maturity-model evidence |
| External References | Document register (PSPF release and List of Requirements), citations, unreferenced documents, verification dates |
| Visual Evidence Decision Rule | When a companion diagram is drawn, drafted with `Pending Input` labels, or recorded as a visual evidence gap |

Each domain section carries one row per in-scope requirement: requirement number, PSPF section, the requirement paraphrased, its reporting type (Performance, Yes/No, or Yes/No/Not Applicable), status, evidence, gap and remediation.

---

## Regulatory Anchors

- **Protective Security Policy Framework (PSPF)** — Department of Home Affairs; current annual release and its List of Requirements
- **PSPF Standards and PSPF Guidelines** — additional mandatory requirements and recommended approaches
- **ASD Information Security Manual** — applied under the Technology domain
- **ASD Essential Eight Maturity Model** — Maturity Level Two required under the Technology domain
- **PGPA Act 2013 s16 and s21** — accountable-authority duties; non-corporate Commonwealth entities must apply the PSPF
- **Australian Government Security Vetting Agency (AGSVA)** — the Authorised Vetting Agency for most entities (Personnel domain)
- **Cyber Security Act 2024 (Cth)** — adjacent incident-reporting obligations alongside the Governance domain's security incident requirements

---

## When to Run

- During design and pre-launch as part of the accreditation evidence base
- Annually as part of the accountable-authority assurance cycle, and when a new PSPF release is published
- On material change to the security scope: new physical premises, new personnel population, new classification ceiling
- DISP Level 2+ suppliers refresh on attestation cadence

---

## Common Pitfalls

- **Assessing against the old structure** — "Outcome 1–4" and "CR1–CR16" belong to earlier PSPF editions. Use the six domains and the requirement numbers from the List of Requirements for the release you are assessing.
- **Treating the Technology domain as redundant with the ISM SoA** — the Technology domain also covers system authorisation, the technology asset stocktake, Essential Eight Maturity Level Two and gateway arrangements. The ISM SoA is the technical evidence base, not a substitute.
- **Skipping personnel separation** — separation requirements in the Personnel domain are regularly under-evidenced. Document the off-boarding workflow with named owners.
- **Missing AGSVA vetting evidence** — claims about cleared personnel require concrete evidence (clearance level, currency date) — not narrative.

---

## Handoff

Foundational input to `/arckit:au-disp-attestation` (DISP physical security, personnel security, and information protection domains draw directly from the PSPF scorecard). Cross-references back to `/arckit:au-ism-controls`, `/arckit:au-e8-posture`, and `/arckit:au-pia` (information protection evidence).
