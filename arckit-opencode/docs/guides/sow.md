# Statement of Work Playbook

`/arckit.sow` generates a Statement of Work (SOW) or RFP document for vendor procurement.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What must be delivered |
| Architecture principles | Technical standards and constraints |
| Stakeholder drivers | Business context and success criteria |
| Risk register | Risks for vendor to manage |

---

## Command

```bash
/arckit.sow Create Statement of Work for <project>
```

Output: `projects/<id>/ARC-<id>-SOW-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## SOW Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Brief overview of the requirement |
| Background | Organization context and current situation |
| Scope of Work | What's included and excluded |
| Requirements | Detailed requirements (functional, non-functional) |
| Deliverables | Specific outputs expected |
| Acceptance Criteria | How deliverables will be accepted |
| Timeline & Milestones | Key dates and phases |
| Governance | Reporting, meetings, escalation |
| Commercial Terms | Pricing model, payment terms |
| Evaluation Criteria | How proposals will be scored |
| Submission Requirements | What vendors must provide |

---

## Scope Definition

| Element | Contents |
|---------|----------|
| In Scope | Explicitly included work |
| Out of Scope | Explicitly excluded work |
| Assumptions | Conditions assumed true |
| Dependencies | External factors required |
| Constraints | Boundaries and limitations |

---

## Deliverable Types

| Type | Examples |
|------|----------|
| Documents | Design docs, reports, manuals |
| Software | Code, configurations, deployments |
| Services | Training, support, operations |
| Outcomes | Measurable results achieved |

---

## Acceptance Criteria Format

| Deliverable | Acceptance Criteria | Verification Method |
|-------------|---------------------|---------------------|
| System Design | Approved by architecture review | Review meeting sign-off |
| Working Software | Passes all test cases | Test execution report |
| User Training | 90% satisfaction score | Training evaluation forms |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements | `/arckit.requirements`, `/arckit.stakeholders` |
| Preparation | Create SOW/RFP | `/arckit.sow` |
| Procurement | Issue to market | Via G-Cloud, DOS, or direct |
| Evaluation | Score proposals | `/arckit.evaluate` |
| Award | Negotiate and contract | Manual |

---

## Review Checklist

- Scope is clear with explicit in/out boundaries.
- Requirements traceable to deliverables.
- Acceptance criteria specific and measurable.
- Timeline realistic with appropriate milestones.
- Evaluation criteria total 100% with weightings.
- Commercial model appropriate (fixed price, T&M, outcome).
- Governance appropriate for contract size.
- Submission requirements clear and achievable.

---

## Commercial Models

| Model | When to Use | Risk Profile |
|-------|-------------|--------------|
| Fixed Price | Well-defined scope | Vendor carries risk |
| Time & Materials | Uncertain scope | Buyer carries risk |
| Outcome-Based | Measurable outcomes | Shared risk |
| Mixed | Combination | Balanced risk |

---

## Key Principles

1. **Clarity**: Vendors must understand exactly what's required.
2. **Fairness**: Requirements shouldn't favor one vendor.
3. **Measurability**: Deliverables must be objectively assessable.
4. **Completeness**: Cover all aspects of the engagement.
5. **Flexibility**: Allow for appropriate change management.
