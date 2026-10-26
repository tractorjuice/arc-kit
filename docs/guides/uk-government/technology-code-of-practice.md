# Technology Code of Practice (TCoP) Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:tcop` assembles evidence for the 13-point Technology Code of Practice, flagging gaps and recommended actions.

> **Full guide**: [Technology Code of Practice (TCoP)](../tcop.md) covers who TCoP applies to, how it is assessed under the Digital Assurance Playbook since April 2026, each point's GOV.UK guidance and the readiness checklist. This page is the short evidence-matrix summary.

---

## Command

```bash
/arckit:tcop Assess Technology Code of Practice compliance for <project>
```

Output: `projects/<id>/ARC-<id>-TCOP-v1.0.md`.

---

## Evidence Matrix

| Point | Theme | Typical Evidence | Linked Commands |
|-------|-------|------------------|-----------------|
| 1 | User needs | Stakeholder analysis, user research notes | `/arckit:stakeholders`, `/arckit:requirements` |
| 2 | Accessibility & inclusion | NFRs (WCAG), accessibility test results, statement draft | `/arckit:requirements`, `/arckit:service-assessment` |
| 3 | Open & open source | Repo links, OSS usage policy, publishing plan | `/arckit:research`, design reviews |
| 4 | Open standards | API specs, schema definitions, GOV.UK Design System adoption | `/arckit:diagram`, `/arckit:hld-review` |
| 5 | Cloud first | Deployment diagram, hosting decision log, cost model | `/arckit:diagram`, `/arckit:secure` |
| 6 | Security | Secure by Design assessment, threat model, cyber assurance | `/arckit:secure`, `/arckit:risk` |
| 7 | Privacy | DPIA, data model, retention schedule | `/arckit:dpia`, `/arckit:data-model` |
| 8 | Reuse & collaboration | Use of GOV.UK components, shared code, community contributions | `/arckit:research`, `/arckit:story` |
| 9 | Integrate & adapt | Integration requirements, migration plan, legacy dependencies | `/arckit:requirements`, `/arckit:diagram` |
| 10 | Use data better | Data strategy, quality metrics, analytics plan | `/arckit:data-model`, `/arckit:story` |
| 11 | Purchasing strategy | Procurement route, approval evidence | `/arckit:sow`, `/arckit:evaluate` |
| 12 | Sustainability | Hosting carbon data, efficiency plan, end-of-life strategy | `/arckit:plan`, service design |
| 13 | Service Standard | Assessment prep doc, metrics, ops model | `/arckit:service-assessment`, `/arckit:servicenow` |

---

## Readiness Checklist

- Evidence attached for each point (or gap logged with owner/due date).
- Deviations justified and escalated where policy allows.
- Approval and assurance papers updated with the latest TCoP results.
- Assessment report shared with SRO, Delivery Manager, Service Owner.
- GovS 005 governance obligations reviewed (SRO appointment, lifecycle stage, approvals).

---

## Cadence

| Stage | Frequency | Focus |
|-------|-----------|-------|
| Discovery / Alpha | Once | Baseline compliance, identify blockers |
| Beta (private/public) | Quarterly or before assessments | Track remediation and new gaps |
| Live | Semi-annual | Ensure service continues to meet obligations |

---

## Useful Links

- Official guidance: [Technology Code of Practice](https://www.gov.uk/guidance/the-technology-code-of-practice)
- Assurance and approvals from 1 April 2026: [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook)
- Parent standard: [GovS 005 — Government Functional Standard for Digital](https://www.gov.uk/government/publications/government-functional-standard-govs-005-digital)
- Align results with `/arckit:plan` gates and `/arckit:story` retrospectives for governance history.
