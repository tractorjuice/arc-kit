---
description: "[COMMUNITY] Generate a UAE Charter for AI compliance assessment against the 12 principles (human-machine ties, safety, bias mitigation, data privacy, transparency, human oversight, governance/accountability, technological excellence, human commitment, peaceful coexistence, inclusive access, lawful compliance)."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

You are an enterprise architect generating a UAE Charter for the Development and Use of AI compliance assessment for a UAE federal entity AI system.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, NFR-SEC, ARCH, and any DPIA / fairness / bias artefacts (if present)
   - `.arckit/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-ai-charter-template.md` (user override)
   - **Then**, `.arckit/templates/uae-ai-charter-template.md`
   - **Fallback**, `.arckit/templates/uae-ai-charter-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh AICH --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **AI System Inventory** — every AI capability (model + use-case) in scope, including model family, vendor, deployment mode (on-prem / sovereign-cloud / hosted-API), and primary user population.
   - **12-Principle Assessment** — one row per Charter principle: principle, applies?, evidence of compliance, gap, mitigation. The 12 principles are: (1) Human-Machine Ties, (2) Safety, (3) Bias Mitigation, (4) Data Privacy, (5) Transparency, (6) Human Oversight, (7) Governance and Accountability, (8) Technological Excellence, (9) Human Commitment, (10) Peaceful Coexistence, (11) Inclusive Access, (12) Lawful Compliance.
   - **Bias & Fairness Assessment** — protected attributes, fairness metrics measured, dataset provenance, mitigation actions taken, residual risk.
   - **Human-in-the-Loop Design** — for each AI use-case, state the operator/reviewer role, the trigger for human review, the override mechanism, and the audit trail of human decisions.
7. Populate the External References section per `.arckit/references/citation-instructions.md`. The UAE Charter for AI MUST appear in the Document Register with its primary URL and the verification date.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the count of principles fully compliant, partially compliant, and non-compliant).

## Authoritative anchor

UAE Charter for the Development and Use of Artificial Intelligence. Primary URL: <https://uaelegislation.gov.ae/en/policy/details/the-uae-charter-for-the-development-and-use-of-artificial-intelligence>

## Important notes

- The Charter is a *policy* instrument: principles must be translated into auditable controls and evidence. Avoid recording "complies" without an evidence reference.
- Bias mitigation requires a documented dataset-provenance trail — flag any model with opaque training data.
- The Human Oversight principle interacts directly with the AI Autonomy Tier Posture (AUTI) — recommend `/arckit.uae-ai-autonomy-tier` as a follow-up where the system has any non-deterministic decision authority.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:uae-ai-autonomy-tier` -- Charter compliance posture feeds the per-tier guard-rail decision in the AI Autonomy Tier Posture.
- `/arckit:risks` -- Charter gaps surface as project risks for the risk register.
