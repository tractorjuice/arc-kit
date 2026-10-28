# UAE Zero Bureaucracy & Code for Government Services Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-uae:uae-zero-bureaucracy` generates a Service Catalogue Review under the UAE Code for Government Services and the Zero Bureaucracy programme. Captures service-catalogue mapping, bureaucracy-elimination baseline, and customer-experience KPIs.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service scope and user outcomes |
| User stories (`ARC-<id>-BKLG-v*.md`, from `/arckit:backlog`) | End-to-end user journeys |
| Journey maps (held by the project, for example under `external/`) | Step-by-step interactions |
| KPI baselines (held by the project, for example under `external/`) | Existing performance baseline |

---

## Command

```bash
/arckit-uae:uae-zero-bureaucracy <project ID or service name>
```

Output: `projects/<id>/ARC-<id>-ZBUR-v1.0.md`

---

## Review Structure

| Section | Contents |
|---------|----------|
| Service Catalogue Mapping | Each service mapped to Code for Government Services entry |
| Bureaucracy Elimination Baseline | Steps / forms / documents / wait time before vs after |
| Customer Experience KPIs | Satisfaction, completion rate, time-to-outcome targets |
| Code Compliance Statement | Compliance against each of the Code for Government Services' eight pillars, one row per pillar |
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
| Discovery | Service catalogue, user journeys | `/arckit:requirements`, `/arckit:story` |
| Zero Bureaucracy | Catalogue review and baseline | `/arckit-uae:uae-zero-bureaucracy` |
| Alignment | National-priorities statement | `/arckit-uae:uae-priorities-alignment` |
| Records | Source-of-truth designations | `/arckit-uae:uae-digital-records` |

---

## Review Checklist

- Every service in scope mapped to a Code for Government Services entry.
- Baseline (steps, documents, time) captured for "before" and "after".
- KPIs have measurable targets (no qualitative-only goals).
- Each of the Code's eight pillars has an explicit compliance statement (compliant / partial / non-compliant + plan).
- Bureaucracy-elimination outcomes feed `/arckit-uae:uae-priorities-alignment`.

---

## Code Pillars

The UAE Cabinet adopted the Code for Government Services and Zero Bureaucracy on 23 April 2026. The Arabic text of its announcement says the Code's general framework has eight pillars (مرتكزات). The English text doesn't list them, so the English names below are translations, with the Arabic term beside each:

| # | Pillar | Arabic |
|---|--------|--------|
| 1 | A simpler, easier and faster experience | تجربة أبسط وأسهل وأسرع |
| 2 | Customer first | المتعامل أولاً |
| 3 | Humanising services | أنسنة الخدمات |
| 4 | A consistent experience across all service channels | اتساق التجربة عبر مختلف قنوات الخدمة |
| 5 | Flexible and secure digital systems | أنظمة رقمية مرنة وآمنة |
| 6 | A culture of excellent service | ثقافة الخدمة المتميزة |
| 7 | Participatory design | التصميم التشاركي |
| 8 | Service and systems efficiency | كفاءة الخدمة والأنظمة |

Source: UAE Cabinet announcement of 23 April 2026, Arabic text, <https://uaecabinet.ae/ar/news/under-directives-of-uae-president-and-in-world-first-mohammed-bin-rashid-reveals-new-uae-government-framework-to-deploy-agentic-ai-across-50-of-government-sectors-operations-within-two-years> (English text: <https://uaecabinet.ae/en/news/under-directives-of-uae-president-and-in-world-first-mohammed-bin-rashid-reveals-new-uae-government-framework-to-deploy-agentic-ai-across-50-of-government-sectors-operations-within-two-years>). The announcement names the pillars but does not define them, and the Code's own text is not published. Where the entity holds the Code, use its definitions and cite it. Otherwise, say how each pillar was interpreted.

---

## Key Notes

- **Programme alignment**: Outputs feed the federal Zero Bureaucracy reporting cadence.
- **Baseline first**: Capture the "before" measurement explicitly — improvement claims require it.
- **Run order**: Best executed once user stories and journeys are stable.
- **Community-contributed**: Output should be reviewed by qualified service-design and federal compliance counsel before reliance.
