# Algorithmic Transparency Recording Standard Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:atrs` generates an Algorithmic Transparency Recording Standard (ATRS) record for AI and algorithmic tools used in public services.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | System purpose and user impact |
| AI Playbook assessment | Responsible AI context |
| Data model | Data sources and processing |
| Stakeholder drivers | Business context and affected groups |

---

## Command

```bash
/arckit:atrs Create ATRS record for <algorithmic tool>
```

Output: `projects/<id>/ARC-<id>-ATRS-v1.0.md`

---

## ATRS Record Structure

The record has two tiers, following the published standard. Tier 1 is a plain-language summary for the public. Tier 2 is the detail for specialists.

| Part | Contents |
|------|----------|
| Tier 1: Basic Information | Name, description, website URL, contact email |
| Tier 1: Organisation and Phase | Organisation, function, geographic region, phase |
| Tier 2, Section 1: Owner and Responsibility | Organisation, team, senior responsible owner, external suppliers |
| Section 2: Description and Rationale | Detailed description, scope, benefit, previous process, alternatives considered |
| Section 3: Decision-Making Process | Process integration, information provided, scale of use, human review, training, appeals |
| Section 4: Data | Sources, sharing, quality, storage and security |
| Section 5: Impact Assessments | DPIA, equality, human rights and other assessments |
| Section 6: Fairness, Bias and Discrimination | Bias risks and how they are tested for |
| Section 7: Technical Details | Model, architecture and dependencies |
| Section 8: Testing and Assurance | Testing, assurance and evaluation |
| Section 9: Transparency and Explainability | How decisions can be explained |
| Section 10: Governance and Oversight | Accountability and oversight arrangements |
| Section 11: Compliance | Legal and policy compliance |
| Section 12: Performance and Outcomes | Performance measures and results |
| Section 13: Review and Updates | Review cycle and change control |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define algorithmic tool and impact | `/arckit:requirements`, `/arckit:stakeholders` |
| Assessment | Assess AI compliance and risks | `/arckit:ai-playbook`, `/arckit:dpia` |
| Transparency | Create ATRS record | `/arckit:atrs` |
| Publication | Publish record to gov.uk | Manual process |
| Review | Regular review and updates | Annual cycle |

---

## Review Checklist

- Tool purpose and scope clearly described in plain language.
- Technical description accessible to non-technical readers.
- All data sources identified with personal data flagged.
- Human oversight mechanisms documented.
- Risk mitigations in place for identified risks.
- Impact assessment covers all affected groups.
- Performance metrics defined for ongoing monitoring.
- Contact information current and accessible.

---

## Publication Requirements

| Requirement | Description |
|-------------|-------------|
| Format | Structured format per CDDO guidance |
| Location | Published on gov.uk algorithmic transparency hub |
| Review Cycle | Annual review minimum |
| Updates | Material changes require record update |

---

## Key Principles

1. **Plain Language**: Records must be understandable by the public.
2. **Proactive Disclosure**: Publish before being asked.
3. **Living Document**: Update when the system changes.
4. **Honest Assessment**: Acknowledge limitations and risks.
5. **Accessibility**: Information available to all affected citizens.
