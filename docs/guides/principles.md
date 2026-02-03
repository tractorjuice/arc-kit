# Architecture Principles Guide

`/arckit.principles` generates an organisation-wide set of architecture principles. Treat them as the contract for design decisions and compliance reviews.

---

## Quick Start

```bash
/arckit.principles Create architecture principles for <organisation>
```

Result: `projects/000-global/ARC-000-PRIN-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Principle Template

Use this structure when editing or adding principles:

| Field | Description |
|-------|-------------|
| ID & Name | Short identifier (e.g. `CLOUD-001`) and descriptive title |
| Statement | MUST / SHOULD statement that is testable |
| Rationale | Why the principle exists (business, regulatory, technical) |
| Evidence | Artefacts that demonstrate compliance (requirements, reviews, designs) |
| Validation Gates | Checklist items used during `/arckit.principles-compliance` or design reviews |
| Exceptions | Process, approver, expiry |

Example snippet:

```markdown
### CLOUD-001 Cloud Native First
**Statement**: New services MUST prefer managed or serverless cloud services unless an exception is approved.
**Rationale**: Supports resilience, cost transparency, and platform operations model.
**Validation Gates**:
- [ ] Service uses managed PaaS/FaaS components (not bespoke VMs)
- [ ] Infrastructure-as-Code committed to repo
- [ ] Disaster recovery targets align with resilience policy
**Exceptions**: Submit via Architecture Review Board; max 12 months with remediation plan.
```

---

## Maintenance Tips

- Review principles at least annually alongside enterprise strategy.
- Flag deprecated principles but keep history for audit.
- Link principles to relevant standards (TCoP, Cyber Essentials, ISO, internal policies).
- Keep counts manageable (10–20 core principles plus domain extensions).
- Use the same IDs in `/arckit.principles-compliance`, design reviews, and vendor contracts.
