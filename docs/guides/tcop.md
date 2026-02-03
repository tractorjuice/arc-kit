# Technology Code of Practice Playbook

`/arckit.tcop` generates a Technology Code of Practice (TCoP) review document for UK Government technology projects.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What the project delivers |
| Architecture diagrams | Technical design and components |
| Architecture principles | Governance alignment |
| Stakeholder drivers | Business context |

---

## Command

```bash
/arckit.tcop Create TCoP review for <project>
```

Output: `projects/<id>/ARC-<id>-TCOP-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## TCoP Review Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Overall compliance status |
| Project Overview | What's being delivered |
| 13 Points Assessment | Compliance against each TCoP point |
| Evidence Summary | Supporting documentation |
| Gaps & Recommendations | Non-compliance with remediation |
| Approval Readiness | Ready for spend control assessment |

---

## 13 TCoP Points

| # | Point | Focus |
|---|-------|-------|
| 1 | Define user needs | User research and service design |
| 2 | Make things accessible | Accessibility and inclusion |
| 3 | Be open and use open source | Open standards, open source |
| 4 | Make use of open standards | Interoperability |
| 5 | Use cloud first | Cloud hosting preference |
| 6 | Make things secure | Security by design |
| 7 | Make privacy integral | Privacy and data protection |
| 8 | Share, reuse and collaborate | Cross-government sharing |
| 9 | Integrate and adapt technology | Legacy integration |
| 10 | Make better use of data | Data-driven decisions |
| 11 | Define your purchasing strategy | Procurement approach |
| 12 | Meet the Service Standard | GDS Service Standard alignment |
| 13 | Spend controls | Comply with spending requirements |

---

## Compliance Levels

| Level | Description |
|-------|-------------|
| Compliant | Fully meets the point with evidence |
| Partially Compliant | Meets some aspects, gaps identified |
| Not Compliant | Does not meet the point |
| Not Applicable | Point doesn't apply to this project |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and users | `/arckit.requirements`, `/arckit.stakeholders` |
| Architecture | Design solution | `/arckit.diagram`, `/arckit.hld-review` |
| Compliance | Create TCoP review | `/arckit.tcop` |
| Approval | Submit for spend control | Manual |
| Delivery | Build with TCoP compliance | `/arckit.backlog` |

---

## Review Checklist

- All 13 TCoP points assessed.
- Each point has compliance status with evidence.
- Gaps have remediation actions with owners.
- User research evidence documented (Point 1).
- Accessibility approach defined (Point 2).
- Open source preference followed (Point 3).
- Cloud-first approach justified (Point 5).
- Security assessment completed (Point 6).
- DPIA completed if personal data (Point 7).
- Procurement strategy defined (Point 11).

---

## Spend Control Thresholds

| Threshold | Review Required |
|-----------|-----------------|
| <£100k | Departmental only |
| £100k-£5m | CDDO case-by-case |
| >£5m | CDDO mandatory |

*Note: Thresholds may vary by department*

---

## Key Principles

1. **User First**: Start with user needs, not technology.
2. **Open by Default**: Use open source and open standards.
3. **Cloud First**: Default to cloud unless justified otherwise.
4. **Security Built-In**: Security from the start, not bolted on.
5. **Reuse Before Build**: Check for existing solutions first.
