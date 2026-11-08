# Detailed Design Review Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:dld-review` reviews a Detailed-Level Design (DLD) for implementation readiness, technical accuracy, and alignment with HLD.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Detailed-Level Design (DLD) | The design document being reviewed |
| High-Level Design (HLD) | Reference for architectural alignment |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Verify all requirements addressed |
| Architecture principles | Governance standards to verify |

---

## Command

```bash
/arckit:dld-review Review DLD for <component/service>
```

Output: `projects/<id>/reviews/ARC-<id>-DLDR-v1.0.md`

---

## Review Structure

| Section | Contents |
|---------|----------|
| Review Summary | Overall assessment and recommendation |
| HLD Alignment | Does the DLD correctly implement the HLD? |
| Requirements Coverage | All requirements traceable to design elements |
| Technical Accuracy | Correct use of patterns, technologies, protocols |
| Implementation Readiness | Sufficient detail for developers to build |
| Security Review | Security requirements properly addressed |
| Data Design Review | Data models, schemas, migrations |
| Integration Review | API contracts, message formats, error handling |
| Operational Readiness | Logging, monitoring, deployment considerations |
| Findings & Recommendations | Issues categorized by severity |
| Integrity Findings | Text in the design aimed at the reviewer, which is not followed, or None found |

---

## Review Categories

| Category | Focus | Examples |
|----------|-------|----------|
| Correctness | Technical accuracy | Wrong protocol, invalid schema |
| Completeness | Missing detail | Undefined error handling, missing API fields |
| Consistency | HLD alignment | Deviation from approved architecture |
| Clarity | Implementation readiness | Ambiguous specifications |
| Compliance | Standards adherence | Security standards, coding guidelines |

---

## Severity Levels

| Severity | Impact | Action Required |
|----------|--------|-----------------|
| Critical | Blocks implementation | Must fix before approval |
| Major | Significant rework risk | Should fix before approval |
| Minor | Quality improvement | Fix during implementation |
| Suggestion | Enhancement | Consider for future |

---

## Fresh-Eyes Review

Before writing the report, `/arckit:dld-review` asks three independent reviewers to read the detailed design. None of them sees the review's working.

| Lens | What it checks |
|------|----------------|
| Comprehension | Explains the design back in plain words, then lists undefined terms, missing steps, claims with no mechanism behind them, and contradictions |
| Implementation readiness | Reads as the engineer who will build it: decisions the design leaves to the builder, steps too vague to act on, and missing pieces such as migrations, deployment order or the interfaces between components |
| HLD conformance | Reads the HLD review and the approved HLD, then reports conditions the design doesn't meet, choices that depart from the HLD with no reason given, and new components or stores of personal data the HLD doesn't have. It also gets the requirements, to tell when a departure breaks one |

Section 10.5 of the review gives every finding an outcome. Findings that were added, not accepted, or rated lower than the reviewer rated them are listed in full with the reason; the rest go on one line against the issue they match. If the HLD lens finds new architecture, the review considers whether the HLD needs reviewing again.

The reviewers can read files but can't write, browse or start other agents. The step needs a runtime that can start a fresh agent, which today means Claude Code. Elsewhere the review records it as "Not run". The idea comes from Google's [Elephant-Goldfish Model](https://egm.dev).

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| HLD Approval | Get HLD reviewed and approved | `/arckit:hld-review` |
| DLD Creation | Write detailed design | Manual |
| DLD Review | Review DLD for readiness | `/arckit:dld-review` |
| Approval | Address findings, get sign-off | Manual |
| Implementation | Build from approved DLD | `/arckit:backlog` |

---

## Review Checklist

- DLD correctly implements HLD architecture decisions.
- All requirements have traceable design elements.
- API contracts fully specified (request/response, errors).
- Data models include schemas, constraints, migrations.
- Security controls designed per requirements.
- Error handling comprehensive (happy and sad paths).
- Logging and monitoring hooks defined.
- Deployment and rollback procedures documented.
- No critical or major findings remain open.

---

## Key Principles

1. **HLD as Contract**: DLD must implement the approved HLD.
2. **Developer Ready**: Design must be sufficient to code from.
3. **Traceability**: Every design element maps to a requirement.
4. **Security First**: Security is designed in, not bolted on.
5. **Operational Awareness**: Consider day-2 operations during design.
