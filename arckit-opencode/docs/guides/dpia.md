# Data Protection Impact Assessment (DPIA) Guide

`/arckit.dpia` delivers a GDPR-compliant DPIA whenever processing could present high risk to individuals.

---

## Minimum Inputs

| Artefact | Purpose |
|----------|---------|
| `ARC-<id>-DATA-v1.0.md` | Supplies PII inventory, lawful basis, retention |
| Stakeholder analysis | Highlights vulnerable groups, consultation needs |
| Risk register | Seeds privacy risk scoring and mitigations |

---

## Trigger Checklist

Tick any that apply (two or more = DPIA mandatory per ICO):
- Evaluation or scoring (profiling, ranking, credit risk)
- Automated decisions with legal/significant effect
- Systematic monitoring or surveillance
- Special category or criminal offence data
- Large scale processing (volume, geography, duration)
- Dataset matching/combining
- Vulnerable data subjects (children, patients, benefit claimants, etc.)
- Innovative technology (AI/ML, biometrics, IoT)
- Restricts ability to exercise data rights

ArcKit screens these automatically; use the list to confirm completeness.

---

## Command

```bash
/arckit.dpia Generate DPIA for <project>
```

Output: `projects/<id>/ARC-<id>-DPIA-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Action Flow

```text
1. Confirm prerequisites (data model + stakeholders + risks)
2. Run /arckit.dpia
3. Review:
   - Screening result and justification
   - Risk table and residual scores
   - Mitigation action plan and owners
4. Log actions in backlog/assurance tracker
5. Re-run after mitigations; seek ICO consultation if residual risk remains “High”
```

---

## Sections to Validate

| Section | Focus | Reviewer |
|---------|-------|----------|
| Screening | Criteria flagged for Article 35 | Data Protection Officer |
| Processing Description | Purposes, categories, data flows | Service Owner / Product |
| Risk & Impact | Harm scenarios, likelihood, severity | Security, Legal |
| Mitigations & Controls | Technical/organisational measures | Engineering & Operations |
| Sign-off | DPO, SIRO/SRO, Project Lead | Governance board |

---

## Linkages

- Feed mitigation actions into `/arckit.risk` and `/arckit.servicenow`.
- Reference DPIA outcomes in `/arckit.ai-playbook` and `/arckit.secure`.
- Store signed versions with review cadence (minimum annual refresh or when processing changes).
