# Statement of work (SOW): template and what to include

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A statement of work (SOW) is the document that sets out what a supplier will deliver, how each deliverable will be accepted, when it is due and how it will be paid for. This guide covers what a statement of work contains, how UK public sector frameworks use one, and how `/arckit:sow` drafts one from your requirements.

---

## What a statement of work contains

A statement of work turns a requirement into work a supplier can be held to. Whatever the template, it needs to answer the same questions: what is in and out of scope, what will be delivered, how you will know each deliverable is done, who is involved, when it is due, and what it costs.

The statement of work template in the UK government's [Digital Outcomes and Specialists 7 framework](https://www.gca.gov.uk/agreements/RM1043.9) (Framework schedule 6) is a good example of a complete one. It asks for:

- **SOW details**: title, call-off contract reference, start and end dates, key buyer and supplier staff, and any subcontractors.
- **Context**: background, an overview of the requirement, and the delivery phases it covers (such as discovery, alpha, beta and live).
- **Accountability model**: Sole Responsibility (Outsource), Self Directed Team (Borrow) or Rainbow Team (Bridge). The template aligns these with the delivery models in the Digital, Data and Technology Playbook.
- **Working conditions**: security and staff vetting, Cyber Essentials, dependencies, a mobilisation plan, intellectual property, sites and data processing.
- **Deliverables and milestones**: each with a description, acceptance criteria and a due date.
- **Delivery and performance**: a delivery plan, a resource plan, applicable standards and key performance indicators.
- **Worker engagement route**: including whether roles are inside or outside IR35.
- **Reporting**: management information the supplier must provide, and how often.
- **Charges**: the pricing mechanism (capped time and materials, fixed price or another method), the maximum value, rate cards and expenses.
- **Signatures**: from both buyer and supplier.

---

## Statements of work in UK public sector buying

On a framework such as Digital Outcomes and Specialists 7 (RM1043.9), a statement of work orders work under a call-off contract. It is not the tender. On that framework:

- Buyers must run a further competition between suppliers on the framework. There is no direct award.
- The call-off contract is formed when both parties sign the order form, or agree a binding electronic purchase order.
- The first statement of work starts when the call-off contract is signed. For more work within the contract's scope, the buyer and supplier agree and sign a further statement of work, which then becomes part of the call-off contract.
- Every statement of work must fall within the call-off contract's specification.

Digital Outcomes and Specialists 7 started on 30 January 2026 as an open framework under the Procurement Act 2023. Its predecessors were Digital Outcomes 6 (RM1043.8) and Digital Specialists and Programmes (RM6263). It is run by the Government Commercial Agency, which was the Crown Commercial Service until 1 April 2026.

The rules for how public bodies buy goods and services changed on 24 February 2025, when the [Procurement Act 2023](https://www.gov.uk/government/publications/procurement-act-2023-short-guides/the-procurement-act-2023-a-short-guide-for-suppliers-html) came into force.

`/arckit:sow` writes a document you can take to market: it carries the scope, requirements, evaluation criteria and submission instructions a request for proposal needs, as well as the deliverables and acceptance criteria that later go into a signed statement of work. For a Digital Outcomes opportunity, use [`/arckit:dos`](dos.md).

---

## Using /arckit:sow

`/arckit:sow` generates a Statement of Work (SOW) or RFP document for vendor procurement.

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What must be delivered |
| Architecture principles | Technical standards and constraints |
| Stakeholder drivers | Business context and success criteria |
| Risk register | Risks for vendor to manage |

### Command

```bash
/arckit:sow Create Statement of Work for <project>
```

Output: `projects/<id>/ARC-<id>-SOW-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

### SOW Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Brief overview of the requirement |
| Background | Organisation context and current situation |
| Scope of Work | What's included and excluded |
| Requirements | Detailed requirements (functional, non-functional) |
| Deliverables | Specific outputs expected |
| Acceptance Criteria | How deliverables will be accepted |
| Timeline & Milestones | Key dates and phases |
| Governance | Reporting, meetings, escalation |
| Commercial Terms | Pricing model, payment terms |
| Evaluation Criteria | How proposals will be scored |
| Submission Requirements | What vendors must provide |

### Scope Definition

| Element | Contents |
|---------|----------|
| In Scope | Explicitly included work |
| Out of Scope | Explicitly excluded work |
| Assumptions | Conditions assumed true |
| Dependencies | External factors required |
| Constraints | Boundaries and limitations |

### Deliverable Types

| Type | Examples |
|------|----------|
| Documents | Design docs, reports, manuals |
| Software | Code, configurations, deployments |
| Services | Training, support, operations |
| Outcomes | Measurable results achieved |

### Acceptance Criteria Format

| Deliverable | Acceptance Criteria | Verification Method |
|-------------|---------------------|---------------------|
| System Design | Approved by architecture review | Review meeting sign-off |
| Working Software | Passes all test cases | Test execution report |
| User Training | 90% satisfaction score | Training evaluation forms |

### One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements | `/arckit:requirements`, `/arckit:stakeholders` |
| Preparation | Create SOW/RFP | `/arckit:sow` |
| Procurement | Issue to market | Via G-Cloud, DOS, or direct |
| Evaluation | Score proposals | `/arckit:evaluate` |
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

On Digital Outcomes and Specialists 7, a statement of work uses capped time and materials, fixed price, or another pricing mechanism the buyer selected in the order form.

---

## Key Principles

1. **Clarity**: Vendors must understand exactly what's required.
2. **Fairness**: Requirements shouldn't favour one vendor.
3. **Measurability**: Deliverables must be objectively assessable.
4. **Completeness**: Cover all aspects of the engagement.
5. **Flexibility**: Allow for appropriate change management.

---

## Useful Links

- [Digital Outcomes and Specialists 7 (RM1043.9)](https://www.gca.gov.uk/agreements/RM1043.9) (Government Commercial Agency), including the order form and statement of work template in Framework schedule 6
- [The Procurement Act 2023: a short guide for suppliers](https://www.gov.uk/government/publications/procurement-act-2023-short-guides/the-procurement-act-2023-a-short-guide-for-suppliers-html) (GOV.UK)
