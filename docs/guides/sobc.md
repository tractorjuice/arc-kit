# Strategic Outline Business Case Playbook

`/arckit.sobc` creates a Strategic Outline Business Case (SOBC) using the UK Government Green Book 5-case model.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What the project must deliver |
| Stakeholder drivers | Business context and strategic alignment |
| Risk register | Key risks and assumptions |
| Architecture principles | Technology constraints and standards |

---

## Command

```bash
/arckit.sobc Create SOBC for <initiative>
```

Output: `projects/<id>/ARC-<id>-SOBC-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## SOBC Structure (5-Case Model)

| Case | Contents |
|------|----------|
| **Strategic Case** | Why is change needed? Strategic fit, policy alignment, objectives |
| **Economic Case** | What delivers best value? Options analysis, cost-benefit, VfM |
| **Commercial Case** | How will it be procured? Procurement strategy, market engagement |
| **Financial Case** | Is it affordable? Funding, budget, financial implications |
| **Management Case** | How will it be delivered? Governance, timeline, assurance |

---

## Strategic Case Components

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

---

## Economic Case - Options

| Option Type | Description |
|-------------|-------------|
| Do Nothing | Continue as-is (baseline) |
| Do Minimum | Minimal intervention |
| Do Something (Options 1-3) | Alternative approaches |
| Preferred Option | Recommended approach with rationale |

---

## Business Case Lifecycle

| Stage | Document | Purpose |
|-------|----------|---------|
| Pre-SOC | Strategic Assessment | Initial exploration |
| SOC | Strategic Outline Case | Strategic direction |
| **SOBC** | Strategic Outline Business Case | Preferred way forward |
| OBC | Outline Business Case | Detailed analysis |
| FBC | Full Business Case | Investment decision |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and stakeholders | `/arckit.requirements`, `/arckit.stakeholders` |
| Risk | Identify and assess risks | `/arckit.risk` |
| Business Case | Create SOBC | `/arckit.sobc` |
| Architecture | High-level design | `/arckit.diagram`, `/arckit.hld-review` |
| Procurement | Market engagement | `/arckit.sow`, `/arckit.gcloud-search` |

---

## Review Checklist

- Strategic fit with government and departmental priorities clear.
- Case for change compelling with evidence.
- Investment objectives are SMART.
- At least 4 options considered (including do nothing).
- Preferred option has clear rationale.
- Benefits identified with measurement approach.
- Key risks and mitigations documented.
- Procurement route identified.
- Funding requirements clear.
- Governance and delivery approach outlined.

---

## Treasury Approval Thresholds

| Threshold | Approval Required |
|-----------|-------------------|
| <£5m | Departmental |
| £5m-£25m | Department + CDDO |
| >£25m | HMT + IPA |

*Note: Thresholds vary by department and project type*

---

## Key Principles

1. **Evidence-Based**: All claims supported by data and analysis.
2. **Options Appraisal**: Genuinely consider alternatives.
3. **Benefits Focus**: Clear, measurable benefits with owners.
4. **Risk Awareness**: Honest about risks and uncertainties.
5. **Proportionate**: Detail appropriate to investment size.
