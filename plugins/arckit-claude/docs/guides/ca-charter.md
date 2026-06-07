# Canada Charter Rights Design Review Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:ca-charter` generates a Canada Charter Rights Design Review for a federal system that materially engages Charter-protected interests. It identifies which sections of the Canadian Charter of Rights and Freedoms are engaged (default for FITAA-class apps: s.2(b), s.2(d), s.7, s.8, s.15), runs the *Oakes* four-step proportionality test against each engaged right, registers risks and mitigations with residual posture, and captures the DOJ counsel sign-off block.

Charter review is mandatory for any federal system that limits a Charter-protected interest. *R v Oakes* structures the analysis: any limit must be prescribed by law and demonstrably justified through (1) a pressing and substantial objective, (2) a rational connection between the means and the objective, (3) minimal impairment of the right, and (4) proportional effects. The artefact this command produces is a design-stage instrument — DOJ counsel sign-off remains a delivery gate, not a sign-off formality.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Engagement surface — speech, association, liberty, search, equality requirements |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Subject populations, advocacy / journalism / diaspora stakeholders, protected-ground populations |
| Privacy Impact Assessment (`ARC-<id>-PIA-v1.0.md`) | s.8 reasonable-expectation-of-privacy analysis grounded in personal-information categories |
| FITAA Compliance Assessment (`ARC-<id>-FITAA-v1.0.md`) | s.2 expression and association engagement — Charter review is a mandatory companion to FITAA |

---

## Command

```bash
/arckit:ca-charter <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-CHRT-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Document Control | Canadian classification (UNCLASSIFIED / Protected A–C / CONFIDENTIAL / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | Engaged Charter sections, headline risks per right, residual posture, DOJ counsel sign-off status |
| Charter Engagement Surface | Per-section engagement decision with reasoning; default-engaged for FITAA-class apps: s.2(b), s.2(d), s.7, s.8, s.15 |
| s.2 Analysis | Sub-section tables for 2(a) conscience and religion, 2(b) expression, 2(c) peaceful assembly, 2(d) association |
| s.7 Analysis | Engagement, deprivation, procedural safeguard, residual; principles of fundamental justice per *Carter* |
| s.8 Analysis | Reasonable-expectation-of-privacy analysis per *Hunter v Southam* and *R v Spencer*; warrant or production-order interface |
| s.15 Analysis | Protected grounds, differential impact, substantive-equality test, residual |
| Oakes Proportionality Analysis | Four-step test (pressing-and-substantial, rational connection, minimal impairment, proportional effects) for each engaged right |
| Mitigation Register | Charter risk, mitigation, owner, status, residual |
| DOJ Counsel Sign-Off Block | Departmental Justice counsel and DOJ HQ constitutional advisor where the risk warrants; date and conditions |
| External References | Document Register, Citations, Unreferenced |

---

## When to run

- A federal system introduces or modifies a registration scheme, surveillance capability, or automated decision-making process that touches Charter-protected interests.
- A FITAA-class app is being designed — Charter §2 expression and association analysis is unconditional after `/arckit:ca-fitaa`.
- A programme will collect, retain, or disclose personal information in a way that engages s.8 reasonable expectation of privacy — typically after the PIA has scoped the personal-information inventory.
- Pre-launch — before service-design sign-off and before any external-facing release of the system or its register.
- On material change — to data, decision boundary, disclosure regime, or operating environment that re-opens any of the engaged rights.

---

## Common pitfalls

- **Skipping Oakes steps.** Every engaged right requires the full four-step test (pressing-and-substantial, rational connection, minimal impairment, proportional effects). Partial proportionality analysis is the most common review failure and a reliable rejection trigger at DOJ review.
- **Treating s.15 as formal equality.** The substantive-equality test asks whether the design creates or perpetuates disadvantage for a protected group, not whether everyone is treated identically. A facially neutral design that lands harder on a protected group is a s.15 problem regardless of intent.
- **Under-citing technology-specific jurisprudence.** *R v Spencer* expanded s.8 to digital subscriber identifiers, and the s.8 jurisprudence continues to develop around metadata, cell-tower data, and platform-mediated communications. A Charter review that cites only *Hunter v Southam* without the modern digital line is incomplete.
- **Sidelining DOJ counsel.** Anything beyond a routine internal-tooling review requires departmental Justice counsel sign-off; constitutional matters route to DOJ HQ constitutional advisors. A Charter design review without named counsel sign-off is a draft, not an artefact.
- **Conflating engagement with limitation.** A Charter section can be engaged without being limited; the proportionality analysis only runs where the design imposes a limit. The engagement surface and the Oakes analysis are separate questions and must be answered separately.

---

## Handoffs

- **`ca-fitaa`** — Charter §2 expression and association analysis is a mandatory companion to FITAA; the FITAA artefact references this review and the public-vs-protected severance design feeds the s.2 mitigation register. If `/arckit:ca-fitaa` has been run, `/arckit:ca-charter` is not optional.
- **`ca-pia`** — §8 search-and-seizure analysis is grounded in the personal-information categories captured in the Privacy Impact Assessment. The PIA inventory drives the reasonable-expectation-of-privacy analysis; do not duplicate, link.
- **`risk`** — Residual Charter risks per right feed the operational risk register with appropriate severity. Carry the Mitigation Register entries forward with the same risk identifiers so the residual posture is traceable.

---

## Statutory currency

Charter jurisprudence is fast-moving in digital contexts. Cite the most recent SCC decisions on s.8 (digital privacy, metadata, cell-tower data), s.7 (procedural-fairness in administrative regimes touching liberty), s.15 (substantive-equality methodology), and s.1 (proportionality refinements) at the time of generation, and record the verification date in the Document Register. Section numbers are stable; the binding effect of jurisprudence is not. Treat any pre-2020 case as load-bearing only after checking subsequent SCC treatment, and re-verify before publication.
