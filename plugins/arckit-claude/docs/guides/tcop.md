# Technology Code of Practice (TCoP): 13 points and assessment evidence

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

The Technology Code of Practice (TCoP) is the UK government's 13-point standard for designing, building and buying technology. This guide lists the points, the evidence an assessor looks for, and how `/arckit:tcop` writes a review.

> **Parent standard**: TCoP supports [GovS 005 — Government Functional Standard for Digital](https://www.gov.uk/government/publications/government-functional-standard-govs-005-digital), which sets expectations for technology decisions through it (GovS 005 §1.3). A TCoP review is evidence for GovS 005's technology clauses; it doesn't assess the rest of the standard.

---

## Who TCoP applies to

GOV.UK's [TCoP guidance](https://www.gov.uk/guidance/the-technology-code-of-practice) says: "You should use the TCoP for all of your technology projects or programmes." Where legacy technology limits a project's ability to meet the code, the guidance says the team must explain this to the GDS Assurance team.

## How TCoP is assessed since April 2026

On 1 April 2026 the [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook) replaced the Cabinet Office digital and technology spend controls.

- Organisations run their own approvals for most spend, usually through an investment board, and their own assurers carry out most assurance.
- Initiatives above the organisation's delegated authority limit, or that are novel, contentious or repercussive, need HM Treasury approval. GDS supports those reviews.
- Organisations share a pipeline of upcoming spend with HM Treasury: every cryptographic product, and other digital and technology delivery from £5 million whole-life cost.
- Assurers base their scrutiny on codified best practice, and the playbook lists TCoP among the government's digital and technology standards.

GOV.UK's TCoP page (last updated July 2025) still describes TCoP as part of the Cabinet Office spend control process. Ask your organisation's assurance team how it applies TCoP under the playbook.

---

## The 13 points

| # | Point | Typical evidence | ArcKit commands |
|---|-------|------------------|-----------------|
| 1 | [Define user needs](https://www.gov.uk/guidance/define-user-needs) | Stakeholder analysis, user research notes | `/arckit:stakeholders`, `/arckit:requirements` |
| 2 | [Make things accessible and inclusive](https://www.gov.uk/guidance/make-things-accessible) | NFRs (WCAG), accessibility test results, statement draft | `/arckit:requirements`, `/arckit:service-assessment` |
| 3 | [Be open and use open source](https://www.gov.uk/guidance/be-open-and-use-open-source) | Repo links, OSS usage policy, publishing plan | `/arckit:research`, design reviews |
| 4 | [Make use of open standards](https://www.gov.uk/guidance/make-use-of-open-standards) | API specs, schema definitions, GOV.UK Design System adoption | `/arckit:diagram`, `/arckit:hld-review` |
| 5 | [Use cloud first](https://www.gov.uk/guidance/use-cloud-first) | Deployment diagram, hosting decision log, cost model | `/arckit:diagram`, `/arckit:secure` |
| 6 | [Make things secure](https://www.gov.uk/guidance/make-things-secure) | Secure by Design assessment, threat model, cyber assurance | `/arckit:secure`, `/arckit:risk` |
| 7 | [Make privacy integral](https://www.gov.uk/guidance/make-privacy-integral) | DPIA, data model, retention schedule | `/arckit:dpia`, `/arckit:data-model` |
| 8 | [Share, reuse and collaborate](https://www.gov.uk/guidance/share-and-reuse-technology) | Use of GOV.UK components, shared code, community contributions | `/arckit:research`, `/arckit:story` |
| 9 | [Integrate and adapt technology](https://www.gov.uk/guidance/integrate-and-adapt-technology) | Integration requirements, migration plan, legacy dependencies | `/arckit:requirements`, `/arckit:diagram` |
| 10 | [Make better use of data](https://www.gov.uk/guidance/make-better-use-of-data) | Data strategy, quality metrics, analytics plan | `/arckit:data-model`, `/arckit:story` |
| 11 | [Define your purchasing strategy](https://www.gov.uk/guidance/define-your-purchasing-strategy) | Procurement route, approval evidence | `/arckit:sow`, `/arckit:evaluate` |
| 12 | [Make your technology sustainable](https://www.gov.uk/guidance/make-your-technology-sustainable) | Hosting carbon data, efficiency plan, end-of-life strategy | `/arckit:plan`, service design |
| 13 | [Meet the Service Standard](https://www.gov.uk/service-manual/service-standard) | Assessment preparation, metrics, operating model | `/arckit:service-assessment`, `/arckit:servicenow` |

---

## Preparing for a TCoP assessment

### Readiness checklist

- All 13 points assessed, each with a compliance status and evidence, or a gap logged with an owner and due date.
- User research evidence documented (point 1).
- Accessibility approach defined (point 2).
- Open source preference followed (point 3).
- Cloud-first approach justified (point 5).
- Security assessment completed (point 6).
- DPIA completed if the service handles personal data (point 7).
- Purchasing strategy defined (point 11).
- Sustainability approach recorded (point 12).
- Deviations justified and escalated where policy allows, and legacy constraints explained to the assurance team.
- Approval and assurance papers updated with the latest TCoP results.
- Assessment report shared with the SRO, delivery manager and service owner.
- GovS 005 governance obligations reviewed (SRO appointment, lifecycle stage, approvals).

### Compliance levels

| Level | Description |
|-------|-------------|
| Compliant | Fully meets the point with evidence |
| Partially Compliant | Meets some aspects, gaps identified |
| Not Compliant | Does not meet the point |
| Not Applicable | Point doesn't apply to this project |

### When to review

| Stage | Frequency | Focus |
|-------|-----------|-------|
| Discovery / Alpha | Once | Baseline compliance, identify blockers |
| Beta (private/public) | Quarterly or before assessments | Track remediation and new gaps |
| Live | Every six months | Check the service still meets its obligations |

---

## Using /arckit:tcop

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What the project delivers |
| Architecture diagrams | Technical design and components |
| Architecture principles | Governance alignment |
| Stakeholder drivers | Business context |

### Command

```bash
/arckit:tcop Create TCoP review for <project>
```

Output: `projects/<id>/ARC-<id>-TCOP-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

### What the review contains

| Section | Contents |
|---------|----------|
| Executive Summary | Overall compliance status |
| Project Overview | What's being delivered |
| 13 Points Assessment | Compliance against each TCoP point |
| Evidence Summary | Supporting documentation |
| Gaps & Recommendations | Non-compliance with remediation |
| Approval Readiness | Ready for your organisation's approval and assurance route |

### One-page workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and users | `/arckit:requirements`, `/arckit:stakeholders` |
| Architecture | Design solution | `/arckit:diagram`, `/arckit:hld-review` |
| Compliance | Create TCoP review | `/arckit:tcop` |
| Approval | Submit through your organisation's assurance and approval route (HM Treasury above the delegated authority limit) | Manual |
| Delivery | Build with TCoP compliance | `/arckit:backlog` |

---

## Key Principles

1. **User First**: Start with user needs, not technology.
2. **Open by Default**: Use open source and open standards.
3. **Cloud First**: Default to cloud unless justified otherwise.
4. **Security Built-In**: Security from the start, not bolted on.
5. **Reuse Before Build**: Check for existing solutions first.
6. **GovS 005 Traceability**: Map each TCoP point to the GovS 005 v2.2 clauses that cover the same ground, for the audit trail. GovS 005 numbers nine principles in section 2 but does not name them or map them to TCoP points.

---

## Useful Links

- [The Technology Code of Practice](https://www.gov.uk/guidance/the-technology-code-of-practice) (GOV.UK)
- [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook) (in force from 1 April 2026)
- [GovS 005 — Government Functional Standard for Digital](https://www.gov.uk/government/publications/government-functional-standard-govs-005-digital)
- [The Service Standard](https://www.gov.uk/service-manual/service-standard)
- [TCoP evidence matrix summary](uk-government/technology-code-of-practice.md), the short reference version of the table above
