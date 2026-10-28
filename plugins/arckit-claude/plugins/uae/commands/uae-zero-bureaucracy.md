---
description: "[COMMUNITY] Generate a Service Catalogue review under the UAE Code for Government Services and Zero Bureaucracy. Captures service catalogue mapping, bureaucracy-elimination baseline, and customer-experience KPIs."
doc-type: ZBUR
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: uae-priorities-alignment
    description: Service-level bureaucracy elimination feeds the National Priorities Alignment Statement.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a Service Catalogue Review under the UAE Code for Government Services and the Zero Bureaucracy programme.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ and BKLG (product backlog, for user stories) artefacts, and any journey maps or KPI baselines the project holds (if present)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-zero-bureaucracy-template.md` (user override)
   - **Then**, `.arckit/templates/uae-zero-bureaucracy-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/uae-zero-bureaucracy-template.md`
3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.
4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> ZBUR {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **Service Catalogue Mapping** — every service this project delivers, with the federal entity service catalogue ID (where the entity already publishes one), the customer journey it sits on, and its current Zero Bureaucracy status.
   - **Bureaucracy Elimination Baseline** — for each service, capture the current-vs-target metrics across (a) number of process steps, (b) number of fields the customer must supply, (c) end-to-end time to outcome, and (d) total customer cost. The Zero Bureaucracy programme requires a credible reduction trajectory against each metric.
   - **Customer Experience KPIs** — define and target the KPIs the service will report monthly: Customer Satisfaction (CSAT), Net Promoter Score (NPS), First-Time Right rate, Digital Adoption %, and Failure Demand %.
   - **Code Compliance Statement** — explicit statement against each of the eight pillars of the UAE Code for Government Services, one row per pillar: (1) a simpler, easier and faster experience (تجربة أبسط وأسهل وأسرع); (2) customer first (المتعامل أولاً); (3) humanising services (أنسنة الخدمات); (4) a consistent experience across all service channels (اتساق التجربة عبر مختلف قنوات الخدمة); (5) flexible and secure digital systems (أنظمة رقمية مرنة وآمنة); (6) a culture of excellent service (ثقافة الخدمة المتميزة); (7) participatory design (التصميم التشاركي); (8) service and systems efficiency (كفاءة الخدمة والأنظمة). For each pillar, evidence how the redesigned service complies. The Arabic text of the Cabinet's announcement lists the pillars; the English text does not, so the English names are translations: keep the Arabic term beside each. The announcement names the pillars without defining them, so where the entity holds the Code's own text, use its definitions and cite it; otherwise state how each pillar was interpreted.
7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The 23 April 2026 UAE Cabinet meeting announcement (Code for Government Services + Zero Bureaucracy) MUST appear in the Document Register with its primary URL and the verification date, together with its Arabic text, which the Code Compliance Statement cites for the pillars.
8. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **ZBUR** per-type checks pass. Fix any failures before proceeding.
9. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
10. Show only a summary to the user (one paragraph plus the headline reduction commitments per service).

## Authoritative anchor

UAE Code for Government Services and Zero Bureaucracy — adopted by the UAE Cabinet on 23 April 2026. Primary URL (UAE Cabinet announcement): <https://uaecabinet.ae/en/news/under-directives-of-uae-president-and-in-world-first-mohammed-bin-rashid-reveals-new-uae-government-framework-to-deploy-agentic-ai-across-50-of-government-sectors-operations-within-two-years>. The Dubai Media Office carries the same text: <https://mediaoffice.ae/en/news/2026/april/23-04/mohammed-bin-rashid-chairs-uae-cabinet-meeting>. The Code's eight pillars (مرتكزات) are listed only in the Arabic text of the Cabinet's announcement: <https://uaecabinet.ae/ar/news/under-directives-of-uae-president-and-in-world-first-mohammed-bin-rashid-reveals-new-uae-government-framework-to-deploy-agentic-ai-across-50-of-government-sectors-operations-within-two-years>. Neither announcement names the federal body that owns or administers the Code, and it is not listed among the public policies on the UAE Legislation Platform, so do not attribute it to a ministry or office unless the entity has that in writing.

## Important notes

- Zero Bureaucracy is not a one-off audit — it is a continuous-reduction programme. Frame the baseline as the first measurement, not the end-state.
- The Code for Government Services applies to *every* federal customer-facing service; do not scope it to only the redesigned journeys.
- Reduction commitments must be measurable and time-bound — avoid aspirational language.
