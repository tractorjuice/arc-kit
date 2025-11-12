# Document Control Standard

Every ArcKit-generated artifact begins with a consistent **Document Control** block followed by a **Revision History** table. Commands must populate these sections before writing the remainder of the document.

## Canonical Document Control Table

| Field | Description |
|-------|-------------|
| **Document ID** | Use `./scripts/bash/generate-document-id.sh <PROJECT_ID> <DOC_CODE> <VERSION>` (e.g., `ARC-001-REQ-v1.0`) |
| **Document Type** | Friendly name such as “Requirements Specification”, “Strategic Architecture Roadmap”, etc. |
| **Project** | Always `PROJECT_NAME (Project PROJECT_ID)` so artifacts remain traceable. |
| **Classification** | Set according to information sensitivity (PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET). |
| **Status** | Workflow state (DRAFT, IN_REVIEW, APPROVED, PUBLISHED, SUPERSEDED, ARCHIVED). |
| **Version** | Semantic document version (start at 1.0 for new docs). |
| **Created Date** | ISO date the document was first generated. |
| **Last Modified** | ISO date of the latest update. |
| **Review Cycle** | Cadence for scheduled review (Monthly / Quarterly / Annual / On-Demand). |
| **Next Review Date** | Next planned review checkpoint. |
| **Owner** | Accountable role or individual (e.g., “Enterprise Architect – Digital Platforms”). |
| **Reviewed By** | Reviewer name and review date, or `PENDING` if not yet reviewed. |
| **Approved By** | Approver name and approval date, or `PENDING` if not yet approved. |
| **Distribution** | Distribution list or access scope (e.g., “Architecture Review Board”, “Programme SteerCo”). |

> Commands may append additional rows (e.g., “Financial Years Covered”, “ADR Number”) **after** the standard rows when domain-specific metadata is required.

## Canonical Revision History Table

| Column | Description |
|--------|-------------|
| Version | Matches the document version column. |
| Date | Date the change was recorded. |
| Author | Responsible person/agent (default `ArcKit AI`). |
| Changes | Summary of the change set. |
| Approved By | Name of the approver for that revision (or `PENDING`). |
| Approval Date | Date the revision was approved (or `PENDING`). |

Initial row template:

```
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |
```

## Command Checklist

1. **Read `.arckit/VERSION`** and capture `ARC_VERSION` for metadata footers.
2. **Generate Document ID** via `generate-document-id.sh`.
3. **Fill mandatory fields** listed above before writing any narrative content.
4. **Add optional fields** only when the template or command requires additional control data.
5. **Update revision history** whenever the document changes (new version, material edits, approvals).

This standard is referenced by every template in `.arckit/templates/` to ensure consistent governance metadata across the toolkit.
