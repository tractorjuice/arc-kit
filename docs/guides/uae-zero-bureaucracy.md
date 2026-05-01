# UAE Zero Bureaucracy & Code for Government Services Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-zero-bureaucracy` generates a Service Catalogue Review under the UAE Code for Government Services and the Zero Bureaucracy programme. Captures service-catalogue mapping, bureaucracy-elimination baseline, and customer-experience KPIs.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service scope and user outcomes |
| User stories (`ARC-<id>-USTY-v1.0.md`) | End-to-end user journeys |
| Journey maps (`ARC-<id>-JRNY-v1.0.md`) | Step-by-step interactions |
| KPI artefacts (`ARC-<id>-KPI-v*.md`) | Existing performance baseline |

---

## Command

```bash
/arckit.uae-zero-bureaucracy <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-ZBUR-v1.0.md`

---

## Review Structure

| Section | Contents |
|---------|----------|
| Service Catalogue Mapping | Each service mapped to Code for Government Services entry |
| Bureaucracy Elimination Baseline | Steps / forms / documents / wait time before vs after |
| Customer Experience KPIs | Satisfaction, completion rate, time-to-outcome targets |
| Code Compliance Statement | Per-clause compliance against the Code for Government Services |
| External References | Zero Bureaucracy programme and Code for Government Services citations |

---

## Bureaucracy Elimination Levers

| Lever | Example |
|-------|---------|
| Eliminate steps | Remove redundant approvals |
| Eliminate documents | Replace paper with verified Pass claim |
| Eliminate visits | Online completion end-to-end |
| Eliminate fields | Pre-fill from federal registers |
| Reduce time | Same-day decisioning vs multi-day |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Service catalogue, user journeys | `/arckit.requirements`, `/arckit.story` |
| Zero Bureaucracy | Catalogue review and baseline | `/arckit.uae-zero-bureaucracy` |
| Alignment | National-priorities statement | `/arckit.uae-priorities-alignment` |
| Records | Source-of-truth designations | `/arckit.uae-digital-records` |

---

## Review Checklist

- Every service in scope mapped to a Code for Government Services entry.
- Baseline (steps, documents, time) captured for "before" and "after".
- KPIs have measurable targets (no qualitative-only goals).
- Each Code clause has an explicit compliance statement (compliant / partial / non-compliant + plan).
- Bureaucracy-elimination outcomes feed `/arckit.uae-priorities-alignment`.

---

## Key Notes

- **Programme alignment**: Outputs feed the federal Zero Bureaucracy reporting cadence.
- **Baseline first**: Capture the "before" measurement explicitly — improvement claims require it.
- **Run order**: Best executed once user stories and journeys are stable.
- **Community-contributed**: Output should be reviewed by qualified service-design and federal compliance counsel before reliance.
