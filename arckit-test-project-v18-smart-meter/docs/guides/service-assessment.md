# GDS Service Assessment Guide

`/arckit.service-assessment` packages evidence for Discovery→Alpha, Alpha→Beta, and Beta→Live assessments against the 14-point Service Standard.

---

## Command

```bash
/arckit.service-assessment PHASE=<alpha|beta|live> DATE=<YYYY-MM-DD optional>
```

Output: `projects/<id>/ARC-<id>-SVCASS-v1.0.md`.

---

## Evidence Mapping (Summary)

| Service Standard Area | ArcKit Sources | Notes |
|-----------------------|----------------|-------|
| Understand users & solve the whole problem (Points 1–3) | Stakeholder analysis, requirements, Wardley Maps | Ensure latest research notes attached |
| Simple, accessible service (Points 4–5) | Requirements (WCAG), `/arckit.secure` outputs, journey maps | Include accessibility testing evidence |
| Team & delivery approach (Points 6–8) | Project plan, backlog, retrospectives, vendor governance | Highlight multidisciplinary team and agile cadence |
| Security, privacy, performance (Points 9–10,14) | `/arckit.secure`, `/arckit.dpia`, `/arckit.servicenow`, NFRs | Provide incident response and monitoring plans |
| Technology & openness (Points 11–13) | `/arckit.research`, `/arckit.tcop`, design reviews, repos | Reference open-source/code-reuse commitments |

---

## Prep Checklist

- Evidence heatmap reviewed; gaps assigned owners.
- Show-and-tell deck created (use summary of prep doc).
- Service metrics dashboard ready (alpha/beta) or plan to publish (live).
- Accessibility and security testing signed off.
- Service manual guidance referenced for each point.
- Assessment logistics: presenter list, dry run scheduled, Q&A roles agreed.

---

## Assessment Day Tips

- Keep walkthrough to 30 minutes; leave 90+ minutes for Q&A.
- Use real artefacts (screenshots, repo links) rather than talking points.
- Note assessor actions live and add to backlog within 24 hours.
- Update the prep doc with outcomes (Green/Amber/Red, conditions, owners).
