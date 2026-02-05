# Requirements Guide

`/arckit.requirements` produces a single living document covering business, functional, non-functional, integration, and data requirements.

---

## Preparation

| Artefact | Why it matters |
|----------|----------------|
| Stakeholder analysis | Links goals and success criteria |
| Architecture principles | Provides constraints and validation gates |
| Risk register | Captures early compliance and delivery risks |

---

## Command

```bash
/arckit.requirements Create requirements for <project>
```

Output: `projects/<id>/ARC-<id>-REQ-v1.0.md`.

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Requirements Matrix

| Type | Prefix | Purpose | Example prompts |
|------|--------|---------|-----------------|
| Business | `BR-###` | Outcomes, KPIs, investment cases | “Reduce payment processing costs by 30%” |
| Functional | `FR-###` | User-facing features & flows | “Process card payments and provide receipts” |
| Non-Functional | `NFR-<category>-###` | Performance, security, availability, accessibility | “P95 latency < 500ms”, “WCAG 2.2 AA” |
| Integration | `INT-###` | Interfaces with external systems | “Integrate with HMRC PAYE API” |
| Data | `DR-###` | Entities, retention, PII | “Store audit logs for 7 years encrypted at rest” |

For public sector projects, MoSCoW priorities are automatically assigned.

---

## Review Checklist

- Every requirement includes acceptance criteria and traceability references (stakeholder IDs, risks, principles).
- Conflicts and dependencies are called out (e.g. BR vs NFR tension).
- Regulatory obligations (TCoP, GDPR, WCAG, PCI-DSS) are captured explicitly.
- Integration requirements specify protocols, authentication, and error handling.
- Data requirements include lawful basis and retention aligned with DPIA outputs.

---

## After Generation

1. Workshop with stakeholders to confirm priorities and resolve conflicts.
2. Feed requirements into `/arckit.sow`, `/arckit.diagram`, `/arckit.backlog`.
3. For data mesh architectures, DR-xxx requirements inform `/arckit.data-mesh-contract` SLAs and quality rules.
4. Re-run the command whenever scope changes; commit deltas for audit.
5. Pair with `/arckit.traceability` to ensure design, tests, and operational artefacts stay aligned.
