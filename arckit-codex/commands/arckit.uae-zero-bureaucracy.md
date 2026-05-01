---
description: "[COMMUNITY] Generate a Service Catalogue review under the UAE Code for Government Services and Zero Bureaucracy. Captures service catalogue mapping, bureaucracy-elimination baseline, and customer-experience KPIs."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

You are an enterprise architect generating a Service Catalogue Review under the UAE Code for Government Services and the Zero Bureaucracy programme.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, USTY (user stories), JRNY (journeys), and any KPI artefacts (if present)
   - `.arckit/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-zero-bureaucracy-template.md` (user override)
   - **Then**, `.arckit/templates/uae-zero-bureaucracy-template.md`
   - **Fallback**, `.arckit/templates/uae-zero-bureaucracy-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh ZBUR --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **Service Catalogue Mapping** — every service this project delivers, with the federal entity service catalogue ID (where the entity already publishes one), the customer journey it sits on, and its current Zero Bureaucracy status.
   - **Bureaucracy Elimination Baseline** — for each service, capture the current-vs-target metrics across (a) number of process steps, (b) number of fields the customer must supply, (c) end-to-end time to outcome, and (d) total customer cost. The Zero Bureaucracy programme requires a credible reduction trajectory against each metric.
   - **Customer Experience KPIs** — define and target the KPIs the service will report monthly: Customer Satisfaction (CSAT), Net Promoter Score (NPS), First-Time Right rate, Digital Adoption %, and Failure Demand %.
   - **Code Compliance Statement** — explicit statement against the UAE Code for Government Services principles (proactive, omni-channel, personalised, simple, fast). For each principle, evidence how the redesigned service complies.
7. Populate the External References section per `.arckit/references/citation-instructions.md`. The 23 April 2026 UAE Cabinet meeting announcement (Code for Government Services + Zero Bureaucracy) MUST appear in the Document Register with its primary URL and the verification date.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the headline reduction commitments per service).

## Authoritative anchor

UAE Code for Government Services and the Zero Bureaucracy programme — Cabinet decision, 23 April 2026 (Cabinet Affairs). Primary URL: <https://mediaoffice.ae/en/news/2026/april/23-04/mohammed-bin-rashid-chairs-uae-cabinet-meeting>

## Important notes

- Zero Bureaucracy is not a one-off audit — it is a continuous-reduction programme. Frame the baseline as the first measurement, not the end-state.
- The Code for Government Services applies to *every* federal customer-facing service; do not scope it to only the redesigned journeys.
- Reduction commitments must be measurable and time-bound — avoid aspirational language.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:uae-priorities-alignment` -- Service-level bureaucracy elimination feeds the National Priorities Alignment Statement.
