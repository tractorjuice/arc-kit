# Business case template: Green Book five case model and SOBC

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A business case is the document that gives a decision maker the evidence and options appraisal needed to assess a spending proposal. UK government business cases follow HM Treasury's Five Case Model. This guide covers the five cases, the stages from strategic outline to full business case, who approves them, and how `/arckit:sobc` drafts a Strategic Outline Business Case (SOBC).

---

## The Green Book and the Five Case Model

[The Green Book](https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government) (2026 edition) is HM Treasury's guidance on appraisal: comparing the costs, benefits and risks of options for meeting government objectives. It is mandatory for UK government departments and arm's length bodies when they develop proposals that involve significant public spending, and it should be used proportionately.

HM Treasury's [Guidance on Developing Business Cases](https://www.gov.uk/government/publications/guidance-on-developing-business-cases) sets out the Five Case Model. It was updated on 30 June 2026 after the 2025 Green Book Review and now covers projects and programmes in one document. It says business cases are a mandatory requirement for significant spending decisions in the UK Government and the Welsh Government, and that everyone who develops, reviews or approves spending proposals there must be trained and accredited through the Better Business Cases programme.

The five cases are linked views of the same proposal, developed together rather than as five separate documents:

| Case | What it shows | Contents (HM Treasury) |
|------|---------------|------------------------|
| **Strategic** | Strategic fit and a compelling case for change | Strategic assessment, case for change, SMART objectives, existing arrangements, business needs, potential scope and service requirements, benefits, risks, constraints and dependencies |
| **Economic** | Best value for money | Critical success factors, longlist of options, preferred way forward, shortlist of options, analysis of social costs, benefits and risks, optimism bias, summary metrics of social value, sensitivity analysis, preferred option |
| **Commercial** | Viable commercial arrangements with suppliers | Procurement strategy, required inputs and outputs, risk allocation, payment mechanisms, contractual arrangements |
| **Financial** | Affordability and agreed funding | Budgeting treatment, accounting treatment, funding statement, contingency |
| **Management** | The proposal is set up for successful delivery | Governance, management, assurance and approvals; plan for delivery; change, benefits, risk and contract management; monitoring and evaluation |

---

## Business case stages

HM Treasury's guidance builds a project business case up in stages, each reviewed by the approving authority before the next begins:

| Stage | HM Treasury name | Purpose | Assurance | ArcKit document |
|-------|------------------|---------|-----------|-----------------|
| 0 | Strategic assessment | Initial planning: strategic fit and an initial view on feasibility | Reviewed by the approving authority | Not generated |
| 1 | Strategic Outline Case (SOC) | Scoping: the case for change and the preferred way forward, from a longlist narrowed to a shortlist | Gate 1: Business Justification | **SOBC** (`/arckit:sobc`) |
| 2 | Outline Business Case (OBC) | Planning: shortlist appraisal, the preferred option, and more detail on commercial, financial and management arrangements | Gate 2: Delivery Strategy | Not generated |
| 3 | Full Business Case (FBC) | Procurement and final arrangements, ready for the investment decision | Gate 3: Investment Decision | Not generated |

ArcKit calls its first-stage document a Strategic Outline Business Case (SOBC). HM Treasury's guidance calls this stage the Strategic Outline Case (SOC). The SOC focuses mainly on the strategic and economic cases, but must begin the commercial, financial and management cases too.

For a simple project whose strategic case has already been made in a programme business case, the guidance allows the SOC and OBC stages to be combined. It says this is not appropriate for more significant projects, or for projects with no overarching programme.

---

## Options appraisal

The economic case starts with a longlist of options. HM Treasury recommends the options framework filter for generating and narrowing them. Longlist appraisal should then identify around five shortlisted options:

| Option | Meaning |
|--------|---------|
| Business as usual (BAU) | What happens if current arrangements continue. It must always go to the shortlist as the benchmark. Don't assume the organisation would do nothing: BAU still has costs, benefits and risks |
| Do minimum | The option that just meets the objectives. It must go to the shortlist |
| Preferred way forward | The option that appears to best meet the objectives and critical success factors and offer the best value for money |
| More ambitious preferred way forward | More social benefits, at higher social costs or with more risk |
| Less ambitious preferred way forward | Lower social benefits, with lower social costs or less risk. It may be left out if the preferred way forward is also the do minimum |

Options that do not meet the proposal's objectives must not go to the shortlist, apart from BAU.

---

## Who approves a business case

HM Treasury's [Treasury approvals process for programmes and projects](https://www.gov.uk/government/publications/treasury-approvals-process-for-programmes-and-projects) (updated 1 April 2026) sets out when the Treasury must approve:

- HM Treasury sets Delegated Authority Limits (DALs) for each department. A project or programme needs Treasury approval if its relevant costs meet or exceed any applicable DAL.
- It also needs Treasury approval if it is novel, contentious, or could cause repercussions elsewhere in the public sector.
- Departments should obtain Treasury approval of a project business case at each of the three key stages (SOC, OBC and FBC). They should usually get the SOC approved before making any public announcement.
- A project whose costs start below the DAL but later rise above it also comes under the process.
- Qualifying projects are considered at a single integrated approval point in HM Treasury.
- The National Infrastructure and Service Transformation Authority (NISTA) arranges independent assurance reviews for projects on the Government Major Projects Portfolio. The April 2026 update replaced the guidance's references to the IPA with NISTA.

Departments submit a business case to HM Treasury only after their own internal assurance. For digital and technology spend, the [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook) replaced the digital and technology spend controls on 1 April 2026.

---

## Using /arckit:sobc

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What the project must deliver |
| Stakeholder drivers | Business context and strategic alignment |
| Risk register | Key risks and assumptions |
| Architecture principles | Technology constraints and standards |

### Command

```bash
/arckit:sobc Create SOBC for <initiative>
```

Output: `projects/<id>/ARC-<id>-SOBC-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

### SOBC Structure (5-Case Model)

| Case | Contents |
|------|----------|
| **Strategic Case** | Why is change needed? Strategic fit, policy alignment, objectives |
| **Economic Case** | What delivers best value? Options analysis, cost-benefit, VfM |
| **Commercial Case** | How will it be procured? Procurement strategy, market engagement |
| **Financial Case** | Is it affordable? Funding, budget, financial implications |
| **Management Case** | How will it be delivered? Governance, timeline, assurance |

### Strategic Case Components

| Component | Contents |
|-----------|----------|
| Strategic Context | Policy drivers, strategic priorities |
| Case for Change | Current situation, problems, why change is needed |
| Investment Objectives | SMART objectives for the investment |
| Existing Arrangements | Current state and its limitations |
| Business Needs | What the organization requires |
| Scope | What's included/excluded |
| Benefits | Expected benefits and how measured |
| Risks | Key strategic risks |
| Constraints | Boundaries and limitations |
| Dependencies | Related projects and external factors |

### Economic Case Options

The command follows HM Treasury's shortlist. By default it appraises five options: Option 0, business as usual (BAU), which is not "do nothing" and always has its own costs, benefits and risks; do minimum; the preferred way forward; and more and less ambitious versions of it. It appraises three when the preferred way forward is the do minimum, and more than five when alternatives differ in design. At SOC stage the result is the preferred way forward; the preferred option comes at OBC. See the [options appraisal](#options-appraisal) guidance above.

### One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and stakeholders | `/arckit:requirements`, `/arckit:stakeholders` |
| Risk | Identify and assess risks | `/arckit:risk` |
| Business Case | Create SOBC | `/arckit:sobc` |
| Architecture | High-level design | `/arckit:diagram`, `/arckit:hld-review` |
| Procurement | Market engagement | `/arckit:sow`, `/arckit:gcloud-search` |

### Review Checklist

- Strategic fit with government and departmental priorities clear.
- Case for change compelling with evidence.
- Investment objectives are SMART.
- Around five shortlisted options, including business as usual and do minimum.
- Preferred option has clear rationale.
- Benefits identified with measurement approach.
- Key risks and mitigations documented.
- Procurement route identified.
- Funding requirements clear.
- Governance and delivery approach outlined.
- Approval route confirmed: your department's delegated authority limits, and whether HM Treasury approval is needed.

---

## Key Principles

1. **Evidence-Based**: All claims supported by data and analysis.
2. **Options Appraisal**: Genuinely consider alternatives.
3. **Benefits Focus**: Clear, measurable benefits with owners.
4. **Risk Awareness**: Honest about risks and uncertainties.
5. **Proportionate**: Detail appropriate to investment size.

---

## Useful Links

- [The Green Book](https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government) (HM Treasury)
- [Guidance on Developing Business Cases](https://www.gov.uk/government/publications/guidance-on-developing-business-cases) (the Five Case Model)
- [Treasury approvals process for programmes and projects](https://www.gov.uk/government/publications/treasury-approvals-process-for-programmes-and-projects)
- [The Green Book: templates and support material](https://www.gov.uk/government/publications/the-green-book-templates-and-support-material)
