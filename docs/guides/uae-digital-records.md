# UAE Digital Records Plan Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-digital-records` generates a Digital Records Plan under the UAE Government Services Digital Records Policy. Captures the source-of-truth register per service, retention schedule, records-as-official-source designation, and lifecycle / disposal procedures.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service scope and record-producing flows |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Record categories collected |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Entity-level ownership inputs |
| Architecture (`ARC-<id>-ARCH-v1.0.md`) | Storage and lifecycle components |
| Smart Data Classification Register (`ARC-<id>-CLAS-v*.md`) | Sensitivity → retention rules |

---

## Command

```bash
/arckit.uae-digital-records <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-DREC-v1.0.md`

---

## Plan Structure

| Section | Contents |
|---------|----------|
| Source-of-Truth Register | Per-record-type owner, system, and authoritative store |
| Retention Schedule | Retention period, trigger, and disposal action per record type |
| Records-as-Official-Source Designation | Which records are the federal source of truth |
| Records Lifecycle | Creation → active → semi-active → disposal flow |
| Audit & Disposal Procedures | Audit trail, witness, evidence retention |
| External References | Digital Records Policy citations |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Inventory | Records produced and consumed | `/arckit.requirements`, `/arckit.data-model` |
| Records | Source-of-truth + retention | `/arckit.uae-digital-records` |
| Sharing | Official-source feeds downstream shares | `/arckit.uae-data-sharing` |
| Compliance | PDPL retention reconciliation | `/arckit.uae-pdpl` |

---

## Review Checklist

- Every record type has a single named source of truth.
- Retention period stated for every record type (no "indefinite" without justification).
- Records-as-official-source designation explicit per category.
- Disposal procedure has audit trail and witness role.
- Source-of-truth designations reconcile with data model entity ownership.
- Retention reconciles with PDPL minimisation.

---

## Key Notes

- **Ownership ambiguity**: Cabinet Affairs vs National Archives ownership of the Digital Records Policy is flagged as `[NEEDS VERIFICATION]` in the overlay maintenance log — confirm the current authority before publication.
- **Source-of-truth conflict**: If multiple systems claim the same record category, this command surfaces the conflict — resolve via ADR before sign-off.
- **Run order**: Best after data model is stable so entity ownership inputs are available.
- **Community-contributed**: Output should be reviewed by qualified records-management and federal compliance counsel before reliance.
