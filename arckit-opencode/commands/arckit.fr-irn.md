---
description: "[COMMUNITY] Structure an IRN (Indice de Résilience Numérique) self-assessment following the aDRI framework — 8 resilience pillars × 5 organisational layers, with scoring scaffold and handoff to official aDRI methodology"
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed before reliance.

> **Note on methodology**: This command structures an IRN self-assessment but does **not** reproduce the aDRI scoring criteria for two explicit reasons:
>
> 1. **Living repository** — the IRN framework evolves actively at [gitlab.com/digitalresilienceinitiative/adri-irn](https://gitlab.com/digitalresilienceinitiative/adri-irn). Embedding a copy would create a frozen snapshot that diverges from the official methodology.
>
> 2. **Licence incompatibility** — the IRN is published under CC BY-NC-ND 4.0 (non-commercial, no derivatives). ArcKit is MIT (commercial use permitted). These two licences are incompatible for any derived content.
>
> **To score your assessment**: consult the official aDRI repository, download the evaluation grid (`Questionnaire_IRN_v0.4.xlsx`), apply R/NR criteria per pillar and layer, then report your scores in the generated document.

You are helping an enterprise architect structure an **IRN (Indice de Résilience Numérique)** self-assessment following the aDRI framework. The IRN is a strategic resilience index — not a compliance checklist — designed to give executive committees an objective view of their technological dependencies.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

### Step 0: Read existing artifacts from the project context

**RECOMMENDED** (read if available, note if missing):

- **REQ** (Requirements) — Extract: infrastructure choices, SaaS/cloud dependencies, integration points, data sovereignty requirements
- **STKE** (Stakeholder Analysis) — Extract: organisation type, strategic priorities, key dependencies, vendor relationships
- **PRIN** (Architecture Principles, 000-global) — Extract: sovereignty principles, cloud strategy, open-source commitments
- **RSCH** (Research) — Extract: vendor landscape, identified single points of failure

**OPTIONAL** (read if available, skip silently):

- **SECNUM** (SecNumCloud Assessment) — pre-populate RES-6 cloud infrastructure section
- **ANSSI** (ANSSI Security Posture) — pre-populate RES-7 cybersecurity section
- **EBIOS** (Risk Study) — pre-populate RES-4 operational resilience section
- **RGPD** / **CNIL** (GDPR Assessments) — pre-populate RES-2 regulatory compliance section

### Step 0b: Read external documents

- Read any documents in `external/` — extract existing vendor contracts, SLA reports, cloud audits, dependency maps
- Read any `000-global/policies/` — extract cloud strategy, open-source policy, data sovereignty policy

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist, create it via `create-project.sh --json`.

### Step 2: Determine scope

From the artifacts, determine which of the 5 IRN organisational layers are relevant:

| Layer | In Scope? | Justification |
|-------|-----------|---------------|
| Applicative | ? | Based on identified SaaS/software dependencies |
| Data | ? | Based on data assets, AI/analytics usage |
| Platform | ? | Based on dev/deploy/orchestration tooling |
| Infrastructure | ? | Based on cloud, compute, storage, network |
| Compétences | ? | Based on internal skill assessment, outsourcing level |

If no artifacts exist, include all 5 layers and note that scope confirmation is required.

### Step 3: Read Template

- **First**, check if `.arckit/templates/fr-irn-template.md` exists in the project root
- **If found**: use the user's customised template
- **If not found**: use `.arckit/templates/fr-irn-template.md`

### Step 4: Generate IRN Assessment Document

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Detect version**: Check for existing `ARC-{PROJECT_ID}-IRN-v*.md` files
2. **Document ID**: `ARC-{PROJECT_ID}-IRN-v{VERSION}`
3. **Classification**: OFFICIAL-SENSITIVE (dependency mapping reveals strategic vulnerabilities)

For each of the **8 IRN pillars**, create a structured section:

**RES-1 — Résilience Stratégique** (Vision & roadmap, independence strategy, IT governance)
**RES-2 — Résilience Économique et Juridique** (Regulatory compliance, legal sovereignty, audit)
**RES-3 — Résilience Data & IA** (Data control, AI infrastructure, ethics & transparency)
**RES-4 — Résilience Opérationnelle** (Business continuity, incident management, recovery plans)
**RES-5 — Résilience Supply-Chain** (Critical suppliers, diversification, contracts & SLAs)
**RES-6 — Résilience Technologique** (Infrastructure & cloud, applications & SaaS, open source)
**RES-7 — Résilience Sécurité** (Cybersecurity, data protection, risk management)
**RES-8 — Résilience Environnementale** (Carbon footprint, green IT, digital sustainability)

For each pillar × organisational layer in scope:

- Summarise what is known from project artifacts (pre-populate where possible)
- Leave a scoring placeholder (R / NR / ? — to be filled using the official aDRI grid)
- Flag any obvious dependencies or risks identified from existing artifacts
- **Do NOT attempt to score R/NR yourself** — the official criteria are in the aDRI evaluation grid

4. **Scoring Summary table**: Create a placeholder table showing the 8 pillars × 5 layers with R/NR cells to be filled by the assessor after consulting the official methodology.

5. **Gap Analysis**: Based on what is observable from existing artifacts (NOT from reproduced aDRI criteria), flag obvious dependency concentrations, single-vendor risks, or regulatory exposure as preliminary observations.

Before writing, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass.

Write to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-IRN-v{VERSION}.md
```

### Step 5: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ IRN Assessment Scaffold Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-IRN-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🔒 Classification: OFFICIAL-SENSITIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Scope
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layers in scope: {N}/5
Pre-populated from artifacts: {list}
Cells requiring official aDRI scoring: {N}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Preliminary observations from existing artifacts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{List obvious risks/dependencies visible from project artifacts}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next steps:
1. Download the official aDRI evaluation grid:
   https://gitlab.com/digitalresilienceinitiative/adri-irn
2. Score each pillar × layer cell (R/NR) using the official methodology
3. Report scores in the generated document and re-run for gap analysis
{If cloud gaps: 4. Run /arckit.fr-secnumcloud for sovereign hosting assessment}
{If GDPR gaps: 5. Run /arckit.eu-rgpd for full data compliance assessment}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| IRN official repository (evaluation grid v0.4) | aDRI | https://gitlab.com/digitalresilienceinitiative/adri-irn |
| aDRI official website | aDRI | https://thedigitalresilience.org/ |
| IRN licence (CC BY-NC-ND 4.0) | Creative Commons | https://creativecommons.org/licenses/by-nc-nd/4.0/ |

> **Why we reference instead of reproduce**: The IRN scoring criteria are published under CC BY-NC-ND 4.0 (non-commercial, no derivatives). ArcKit is MIT-licensed (commercial use permitted). These licences are incompatible for derived content. Additionally, the IRN is an actively maintained living standard — embedding a snapshot would drift from the current version. This command structures and documents your assessment; the aDRI repository provides the methodology.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-IRN-v{VERSION}.md`
- ✅ All 8 IRN pillars present as document sections
- ✅ 5 organisational layers scoped (in/out of scope justified)
- ✅ Existing project artifacts used to pre-populate observable context
- ✅ R/NR scoring placeholders created — NOT pre-filled by AI
- ✅ Link to official aDRI evaluation grid clearly displayed
- ✅ Licence incompatibility and living-repo rationale explained in document
- ✅ Preliminary observations from artifacts noted (dependency concentrations, single vendors)
- ✅ Classification: OFFICIAL-SENSITIVE

## Example Usage

```text
/arckit.fr-irn IRN self-assessment for project 001 — AI-driven HR SaaS platform using AWS eu-west-3 with US-based sub-processors

/arckit.fr-irn Assess IRN for a French bank running on Azure with Microsoft 365 across 5,000 employees

/arckit.fr-irn IRN scaffold for a public hospital group — 3 sites, OVHcloud infrastructure, Epic HRIS, strong open-source policy
```

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:fr-secnumcloud` -- Assess SecNumCloud qualification for sovereign cloud hosting *(when RES-6 (Technological Resilience) or RES-5 (Supply-Chain) reveals critical cloud dependency gaps)*
- `/arckit:eu-rgpd` -- Full GDPR compliance assessment for RES-2 regulatory gaps *(when RES-2 (Economic and Legal Resilience) identifies GDPR compliance gaps)*
- `/arckit:eu-nis2` -- NIS2 compliance assessment for essential/important entity obligations *(when RES-2 or RES-7 identifies NIS2 obligations)*
- `/arckit:fr-anssi` -- ANSSI hygiene assessment for RES-7 cybersecurity gaps *(when RES-7 (Security Resilience) reveals significant gaps)*
- `/arckit:fr-ebios` -- EBIOS risk study for operational resilience gaps *(when RES-4 (Operational Resilience) reveals significant risk management gaps)*
