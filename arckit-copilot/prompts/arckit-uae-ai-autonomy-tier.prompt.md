---
description: 'Generate a three-tier AI autonomy posture (Tier 1 internal-productivity, Tier 2 investor-facing-with-approval, Tier 3 regulated/financial). Captures per-tier guard-rails, approval gates, audit obligations, and tier-promotion criteria.'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

You are an enterprise architect generating a three-tier AI Autonomy Posture for a UAE federal entity AI deployment. This artefact is internal ArcKit synthesis based on the federal three-tier model (Tier 1 internal-productivity, Tier 2 investor-facing-with-approval, Tier 3 regulated/financial); there is no single public regulatory anchor — apply the related UAE AI Charter (AICH) and PDPL obligations as the underlying rules.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, NFR-SEC, ARCH, and any AICH (UAE AI Charter) artefact (if present)
   - `.arckit/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-ai-autonomy-tier-template.md` (user override)
   - **Then**, `.arckit/templates/uae-ai-autonomy-tier-template.md`
   - **Fallback**, `.arckit/templates/uae-ai-autonomy-tier-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh AUTI --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **AI Use-Case Inventory (mapped to tier)** — every AI use-case in scope, mapped to Tier 1, Tier 2, or Tier 3 with rationale.
     - Tier 1 — internal productivity (drafting, summarisation, internal Q&A) — low blast radius.
     - Tier 2 — investor-facing or external content, with mandatory human approval before release.
     - Tier 3 — regulated or financial decisions (eligibility, payments, risk scoring) — strict guard-rails, approval gates, audit obligations.
   - **Per-Tier Guard-Rail Matrix** — for each tier, state the technical guard-rails (input filtering, output filtering, retrieval grounding, hallucination controls, refusal policy, prompt-injection defences).
   - **Approval Gates per Tier** — who approves what, before deployment and before each release; for Tier 3, the regulator-facing approval where applicable.
   - **Audit Obligations per Tier** — logging detail (prompt, response, model version, retrieval context, human reviewer), retention, audit cadence, and reporting line.
   - **Tier-Promotion Criteria** — the criteria that must be evidenced before a use-case is promoted from Tier 1 to Tier 2, or Tier 2 to Tier 3.
7. Populate the External References section per `.arckit/references/citation-instructions.md`. Where the tier framing references the UAE AI Charter, cite the Charter directly.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the count of use-cases per tier and any tier-promotion proposals).

## Authoritative anchor

This artefact is internal ArcKit synthesis lifted from federal practice (no single public regulatory anchor for the three-tier model). The supporting public anchors are:

- UAE Charter for the Development and Use of Artificial Intelligence: <https://uaelegislation.gov.ae/en/policy/details/the-uae-charter-for-the-development-and-use-of-artificial-intelligence>
- Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data: <https://uaelegislation.gov.ae/en/legislations/1972/download>

## Important notes

- Tier classification is determined by *blast radius*, not by model capability. A high-capability model used only for internal draft summaries is still Tier 1.
- A use-case may NOT skip tiers — Tier 3 promotion requires evidenced Tier 2 operation.
- Tier 3 use-cases involving financial or regulated decisions may additionally fall under the Central Bank of the UAE supervisory perimeter — flag for sector-regulator engagement and treat that engagement as not-verified within ArcKit until separately confirmed.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-adr` -- Tier-promotion decisions are architecturally significant and warrant an ADR.
- `/arckit-risks` -- Per-tier residual risks feed the project risk register.
