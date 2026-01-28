# Algorithmic Transparency Recording Standard Playbook

`/arckit.atrs` generates an Algorithmic Transparency Recording Standard (ATRS) record for AI and algorithmic tools used in public services.

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
/arckit.atrs Create ATRS record for <algorithmic tool>
```

Output: `projects/<id>/ARC-<id>-ATRS-v1.0.md`

---

## ATRS Record Structure

| Section | Contents |
|---------|----------|
| Basic Information | Name, owner, description, deployment date |
| Purpose and Scope | Why the tool exists and what decisions it supports |
| How It Works | Technical overview (accessible to public) |
| Data Used | Input data, sources, personal data handling |
| Human Oversight | How humans are involved in the process |
| Risk Management | Identified risks and mitigations |
| Impact Assessment | Who is affected and how |
| Performance Monitoring | How accuracy and fairness are measured |
| Contact Information | Who to contact for questions |

---

## ATRS Tiers

| Tier | Description | Disclosure Level |
|------|-------------|------------------|
| Tier 1 | Low impact, simple algorithms | Basic disclosure |
| Tier 2 | Moderate impact, ML-based | Standard disclosure |
| Tier 3 | High impact, complex AI | Full disclosure |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define algorithmic tool and impact | `/arckit.requirements`, `/arckit.stakeholders` |
| Assessment | Assess AI compliance and risks | `/arckit.ai-playbook`, `/arckit.dpia` |
| Transparency | Create ATRS record | `/arckit.atrs` |
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
