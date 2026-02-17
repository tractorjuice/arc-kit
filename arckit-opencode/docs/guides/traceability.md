# Traceability Guide

`/arckit.traceability` produces a forward/backward traceability matrix linking requirements to design, implementation, tests, and operational artefacts.

---

## Inputs

| Artefact | Used for |
|----------|----------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Source requirements with IDs |
| Design reviews, diagrams | Map requirement → component |
| Backlog/test evidence | Link to implementation and verification |
| Service design / ops docs | Close the loop to run and monitor |

Run after design reviews or at least once per sprint to maintain coverage.

---

## Command

```bash
/arckit.traceability Generate traceability matrix for <project>
```

Output: `projects/<id>/ARC-<id>-TRAC-v1.0.md` (traceability matrix with coverage metrics and gap analysis)

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Matrix Snapshot

| Requirement | Design | Implementation | Tests | Ops |
|-------------|--------|----------------|-------|-----|
| FR-012 Payment approvals | PaymentService (HLD), Approval Workflow (DLD) | `services/payment.py` | `tests/payment/test_approvals.py` | Runbook section 3 |
| NFR-S-004 Encryption at rest | Security architecture | Terraform KMS module | `tests/security/test_kms_rotation.py` | `/arckit.secure` evidence |

Gaps appear when any column lacks references.

---

## Gap Triage Checklist

- Missing tests? Create stories and flag as release blocker if “MUST” requirement.
- Design mismatch? Update HLD/DLD or retire redundant components.
- Orphan artefacts? Remove or link to new requirements to avoid scope creep.
- Compliance evidence absent? Run relevant commands (`/arckit.secure`, `/arckit.dpia`, `/arckit.ai-playbook`).

---

## Tips

- Automate matrix generation in CI to detect regressions.
- Use coverage percentages in governance packs and release go/no-go meetings.
- Keep matrix lightweight by referencing artefact IDs/paths rather than copying content.
