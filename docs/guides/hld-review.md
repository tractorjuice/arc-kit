# High-Level Design Review Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:hld-review` reviews a High-Level Design (HLD) against architecture principles, requirements, and governance standards.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| High-Level Design (HLD) | The design document being reviewed |
| Architecture principles | Governance standards to verify against |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Verify all requirements addressed |
| Risk register | Ensure risks are mitigated in design |

---

## Command

```bash
/arckit:hld-review Review HLD for <project/service>
```

Output: `projects/<id>/reviews/ARC-<id>-HLDR-v1.0.md`

---

## Review Structure

| Section | Contents |
|---------|----------|
| Review Summary | Overall assessment and recommendation |
| Principles Alignment | How design aligns with each principle |
| Requirements Coverage | All requirements traceable to components |
| Risk Mitigation | How identified risks are addressed |
| Non-Functional Assessment | Performance, security, scalability |
| Integration Review | External system interactions |
| Technology Choices | Appropriateness of selected technologies |
| Governance Compliance | Standards and policy adherence |
| Findings & Recommendations | Issues categorized by severity |
| Integrity Findings | Text in the design aimed at the reviewer, which is not followed, or None found |

---

## Review Categories

| Category | Focus | Examples |
|----------|-------|----------|
| Architecture | Structural soundness | Layering, separation of concerns |
| Principles | Governance alignment | Cloud-first, open standards |
| Requirements | Coverage completeness | Missing or misinterpreted requirements |
| Security | Security posture | Authentication, encryption, boundaries |
| Scalability | Growth capacity | Horizontal scaling, bottlenecks |
| Integration | External interactions | API design, data flows |

---

## Severity Levels

| Severity | Impact | Action Required |
|----------|--------|-----------------|
| Critical | Fundamental flaw | Must fix before approval |
| Major | Significant risk | Should fix before approval |
| Minor | Improvement opportunity | Fix in detailed design |
| Observation | Best practice | Consider for future |

---

## Fresh-Eyes Review

A review written in a long session can miss a gap it has already explained to itself. Before writing the report, `/arckit:hld-review` asks three independent reviewers to read the design. Each one sees only the design, the principles and the requirements, and none of the review's working.

| Lens | What it checks |
|------|----------------|
| Comprehension | Explains the design back in plain words, then lists undefined terms, missing steps, claims with no mechanism behind them, and contradictions |
| Principles | Departures from each principle, unnecessary complexity, and proprietary components where the principles favour a platform or open standard |
| Requirements | Requirements that are not met, partly met, contradicted, or have a target with nothing in the design to achieve it |

Section 11.5 of the review gives every finding they raise an outcome. A finding that was added to the issues list, not accepted, or rated lower than the reviewer rated it is listed in full with the reason. One the review had already raised goes on a single line against the issue it matches, so the section stays short. It also includes the comprehension reviewer's account of what the design does, so the supplier can see what their document actually communicates.

The reviewers can read files but can't write, browse or start other agents. The step needs a runtime that can start a fresh agent, which today means Claude Code. Elsewhere the review records it as "Not run". The idea comes from Google's [Elephant-Goldfish Model](https://egm.dev).

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Foundation | Define principles and requirements | `/arckit:principles`, `/arckit:requirements` |
| Risk | Identify and assess risks | `/arckit:risk` |
| Design | Create HLD | Manual or `/arckit:diagram` |
| Review | Review HLD against standards | `/arckit:hld-review` |
| Approval | Address findings, get sign-off | Manual |

---

## Review Checklist

- Every architecture principle has a design alignment statement.
- All requirements (BR, FR, NFR, INT) traceable to design elements.
- Identified risks have corresponding design mitigations.
- Security architecture addresses all NFR-SEC requirements.
- Integration points have defined contracts and error handling.
- Technology choices align with standards and principles.
- No critical or major findings remain unaddressed.

---

## Principles Alignment Format

| Principle | Alignment | Evidence |
|-----------|-----------|----------|
| Cloud-First | Aligned | Uses Azure PaaS services |
| Open Standards | Partial | REST APIs, but proprietary auth |
| Security by Design | Aligned | Defense in depth, zero trust |

---

## Key Principles

1. **Principles as Guardrails**: Design must demonstrably align with principles.
2. **Traceability**: Every component should trace to requirements.
3. **Risk Awareness**: Design should address identified risks.
4. **Early Feedback**: Review early to avoid costly rework.
5. **Constructive Critique**: Focus on improving the design, not blocking.
