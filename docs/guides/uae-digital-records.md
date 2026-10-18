# UAE Digital Records Plan Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:uae-digital-records` generates a Digital Records Plan under the UAE Government Services Digital Records Policy. Captures the source-of-truth register per service, retention schedule, records-as-official-source designation, and lifecycle / disposal procedures.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service scope and record-producing flows |
| Data requirements (`DR-*` in `ARC-<id>-REQ-v*.md`) | Record categories collected |
| Data model (`ARC-<id>-DATA-v*.md`) | Entity-level ownership inputs |
| Architecture (`diagrams/ARC-<id>-DIAG-*-v*.md`) | Storage and lifecycle components |
| Smart Data Classification Register (`ARC-<id>-CLAS-v*.md`) | Sensitivity → retention rules |

---

## Command

```bash
/arckit:uae-digital-records <project ID or service name>
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
| Inventory | Records produced and consumed | `/arckit:requirements`, `/arckit:data-model` |
| Records | Source-of-truth + retention | `/arckit:uae-digital-records` |
| Sharing | Official-source feeds downstream shares | `/arckit:uae-data-sharing` |
| Compliance | PDPL retention reconciliation | `/arckit:uae-pdpl` |

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

- **Who owns the policy**: The UAE Cabinet approved the Government Services Digital Records Policy on 23 April 2026. The Cabinet's announcement (<https://uaecabinet.ae/en/news/under-directives-of-uae-president-and-in-world-first-mohammed-bin-rashid-reveals-new-uae-government-framework-to-deploy-agentic-ai-across-50-of-government-sectors-operations-within-two-years>) and the Dubai Media Office release carry the same text: the policy sets a national framework for managing government services data, makes digital records the official source of core data, and adds a comprehensive records guide. Neither names the body that owns or administers the policy, and neither names the Ministry of Cabinet Affairs or the National Library and Archives. The command therefore does not attribute it to either. It records the administering body only when the entity has it in writing, and otherwise lists it as an open item for the entity's records or data office.
- **Source-of-truth conflict**: If multiple systems claim the same record category, this command surfaces the conflict — resolve via ADR before sign-off.
- **Run order**: Best after data model is stable so entity ownership inputs are available.
- **Community-contributed**: Output should be reviewed by qualified records-management and federal compliance counsel before reliance.
