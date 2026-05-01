# UAE Smart Data Classification Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-classification` generates a UAE Smart Data Classification Register, mapping every dataset in scope to one of `Open`, `Shared`, `Confidential`, `Secret`, or `Top Secret` with handling rules and a declassification schedule. Anchored on the UAE Smart Data Framework.

This is the **upstream artefact** for the UAE federal overlay — most other UAE commands consume it.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles (`ARC-000-PRIN-*.md`) | Federal principles applied to classification |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Datasets in scope of the service |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Per-entity sensitivity inputs |
| `governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data` user-config |

---

## Command

```bash
/arckit.uae-classification <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-CLAS-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Classification Levels Used | Open / Shared / Confidential / Secret / Top Secret with anchor definitions |
| Dataset Register | Per-dataset row with classification, owner, source, and rationale |
| Handling Rules per Level | Storage, transit, access, retention, declassification |
| Cross-Reference Index | Links from dataset → data model entity, requirements, residency rule |
| External References | Smart Data Framework citations |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define service and datasets | `/arckit.requirements`, `/arckit.data-model` |
| Classification | Map datasets to Smart Data ladder | `/arckit.uae-classification` |
| Residency | Validate per-classification residency | `/arckit.uae-cloud-residency` |
| Privacy | Map PDPL lawful basis to classified data | `/arckit.uae-pdpl` |
| Sharing | Per-share sensitivity controls | `/arckit.uae-data-sharing` |

---

## Review Checklist

- Every dataset in the service appears in the Dataset Register.
- Each classification has a documented rationale (not "default to Confidential").
- Handling rules cover storage, transit, access, retention, and declassification.
- Cross-references back to data model entities resolve.
- Confidential and above flagged for sovereign-cloud residency.
- Owner named for every dataset (no "TBD").

---

## Key Notes

- **Upstream artefact**: `uae-cloud-residency`, `uae-pdpl`, and `uae-data-sharing` all depend on this register being in place.
- **userConfig must be set**: Without `governance_framework: UAE Federal` and `classification_scheme: UAE Smart Data`, the Document Control header will not render the UAE ladder.
- **Migration**: To switch an existing UK-classified project, run `arckit migrate-classification --root projects --apply` (see `uae-overlay.md`).
- **Community-contributed**: Output should be reviewed by qualified DPO / federal compliance counsel before reliance.
