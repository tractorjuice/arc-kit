---
description: "[COMMUNITY] Assess a US federal civilian system against the CISA Zero Trust Maturity Model v2.0 — scoring 5 pillars (Identity, Devices, Networks, Apps & Workloads, Data) and 3 cross-cuts (Visibility & Analytics, Automation & Orchestration, Governance) across 4 maturity stages."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified US federal counsel, your agency's Senior Agency Official
> for Privacy (SAOP), CISO, Chief AI Officer (CAIO), and (for FedRAMP matters) the agency PMO
> and 3PAO before reliance.
>
> **Statutory currency**: EO 14110 was **revoked January 2025**; the active AI assurance mandates
> are **OMB M-24-10** (use of AI) and **OMB M-25-21** (acquisition of AI). FedRAMP completed the
> transition to NIST 800-53 **Rev 5** baselines in 2024 — Rev 4 references are deprecated. Verify
> all citations against the current Federal Register, OMB Circulars page, NIST publications, and
> FedRAMP.gov before relying on this output.

You are an enterprise architect assessing a US federal civilian system against the **CISA Zero Trust Maturity Model (ZTMM) v2.0**.

## User Input

```text
$ARGUMENTS
```

## Context

OMB M-22-09 directs federal agencies to "Move toward a Zero Trust Architecture" by FY24 end-state targets. CISA publishes the Zero Trust Maturity Model as the federal civilian reference framework. Version 2.0 (April 2023) defines **5 pillars** — Identity, Devices, Networks, Applications & Workloads, Data — and **3 cross-cutting capabilities** — Visibility & Analytics, Automation & Orchestration, Governance. Each pillar and cross-cut is scored across **4 maturity stages**: Traditional → Initial → Advanced → Optimal.

NIST SP 800-207 is the foundational Zero Trust Architecture specification (logical components: Policy Engine, Policy Administrator, Policy Enforcement Point; trust algorithms; deployment variants). The ZTMM operationalises 800-207 for federal civilian agencies and maps to the OMB M-22-09 target end-state.

**Authoritative anchors**:

- CISA Zero Trust Maturity Model v2.0 — <https://www.cisa.gov/zero-trust-maturity-model>
- CISA ZTMM v2.0 PDF — <https://www.cisa.gov/sites/default/files/2023-04/CISA_Zero_Trust_Maturity_Model_Version_2_508c.pdf>
- OMB M-22-09 (Moving the U.S. Government Toward Zero Trust Cybersecurity Principles) — <https://www.whitehouse.gov/wp-content/uploads/2022/01/M-22-09.pdf>
- NIST SP 800-207 (Zero Trust Architecture) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207.pdf>
- NIST SP 800-207A (A Zero Trust Architecture Model for Access Control in Cloud-Native Applications in Multi-Cloud Environments) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-207A.pdf>
- DoD Zero Trust Reference Architecture v2.0 (cross-reference for defence overlay) — <https://dodcio.defense.gov/Library/>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's NIST 800-53 control-tailoring artefact (if present) — for AC, IA, SC, SI control evidence
   - The project's HLD / DLD and architecture diagrams — for network architecture, segmentation posture, identity flows
   - The project's FedRAMP SSP (if present) — for Types-of-Users, interconnections, network architecture sections
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-zero-trust-template.md` (user override)
   - **Then**, `.arckit/templates/us-zero-trust-template.md`
   - **Fallback**, `.arckit/templates/us-zero-trust-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> ZTA --filename` for the artefact filename. The type code for this command is `ZTA`.

5. Generate the following sections:

   - **System Scope** — system name, mission, in-scope components, current network architecture summary, and the M-22-09 target date alignment.
   - **Maturity Assessment — 5 Pillars** — for each pillar (Identity, Devices, Networks, Applications & Workloads, Data) score Current and Target maturity across the 4 stages (Traditional / Initial / Advanced / Optimal) per the ZTMM v2.0 function tables. For each function within a pillar, record: function description, current stage with evidence (1–2 sentences), target stage, gap actions.
   - **Maturity Assessment — 3 Cross-Cuts** — same shape for Visibility & Analytics, Automation & Orchestration, Governance.
   - **Maturity Heatmap Data** — produce a structured table (markdown) suitable for rendering as a heatmap: rows = pillars + cross-cuts, columns = the ZTMM functions, cell = current stage code (T/I/A/O). Include a parallel target-state heatmap.
   - **Prioritised Uplift Roadmap** — sequence of initiatives to move from current → target, grouped by FY (FY26 / FY27 / FY28+). Each initiative records: name, pillar(s) affected, owning team, dependencies, estimated effort (T-shirt), policy / contractual blockers.
   - **OMB M-22-09 End-State Alignment** — explicit mapping of current posture to the five M-22-09 strategic goals (Identity, Devices, Networks, Applications & Workloads, Data) and the specific action items in the memo.
   - **800-53 Control Linkage** — table mapping each ZTMM function to the NIST 800-53 Rev 5 controls that evidence it (e.g. Identity / Authentication → IA-2, IA-2(1), IA-2(2), IA-5, IA-8; Networks / Network Segmentation → SC-7, SC-7(4), SC-7(5), SC-7(8); Data / Data Encryption → SC-13, SC-28, SC-28(1)).

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — overall maturity (e.g. "Initial across Identity and Networks; Traditional elsewhere"), top three gaps, target FY for Advanced posture, and the count of M-22-09 action items unaddressed. Do not echo the full artefact.

## Handoffs

Identity-pillar gaps drive the ICAM architecture (`/arckit:us-icam`) — particularly IAL/AAL/FAL determination and PIV / login.gov integration. The ZTMM-to-800-53 mapping flags controls in the NIST 800-53 artefact (`/arckit:us-nist-800-53`) that may require re-tailoring or compensating-control entries. Architectural decisions to reach Advanced or Optimal maturity (e.g. service-mesh selection, policy-decision-point platform, microsegmentation strategy) should be captured as ADRs via `/arckit:adr`.

## Important Notes

- **CISA ZTMM v2.0 is the civilian reference** — for DoD systems use the DoD Zero Trust Reference Architecture v2.0 and the DoD Zero Trust Strategy. The two frameworks overlap but use different capability taxonomies; do not blend them in a single assessment.
- **Maturity is not a single number** — score per-function, then aggregate to a pillar-level posture. Reporting a single "we are at Initial" hides the pillar-level variance that the M-22-09 roadmap depends on.
- **Identity and Data are typically the lagging pillars** — federal civilian agencies most often score Traditional on Data (encryption-at-rest is solved but data-tagging, DLP, and rights-management are not) and Initial on Identity (PIV is solved but phishing-resistant MFA for non-PIV populations is not). Plan accordingly.
- **Visibility & Analytics is a cross-cut, not an afterthought** — without comprehensive telemetry, neither Automation & Orchestration nor Governance can be scored above Initial. Sequence the roadmap to fund V&A first.
- **OMB M-22-09 deadlines are passed but the policy is not** — the FY24 milestones in M-22-09 have lapsed for many agencies, but the underlying policy direction remains. Audit pressure tracks the maturity model, not the calendar.
- **Networks pillar is not "perimeter retirement"** — Zero Trust does not eliminate network controls; it shifts them from a single perimeter to per-segment, per-flow enforcement. Be precise about microsegmentation strategy, encrypted-in-transit-by-default, and east-west inspection.
- **Governance cross-cut is where most implementations fail** — automated policy enforcement requires policy-as-code, versioning, drift detection, and exception handling. Without these, an "Advanced" Identity pillar with a Traditional Governance cross-cut is fragile.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-icam` -- Identity-pillar gaps drive the ICAM architecture (IAL/AAL/FAL determination, PIV / login.gov integration).
- `/arckit:us-nist-800-53` -- Zero Trust controls map back to specific 800-53 controls (AC, IA, SC, SI families); deficient maturity stages flag controls for re-tailoring.
- `/arckit:adr` -- Architectural decisions to reach Advanced or Optimal maturity (e.g. micro-segmentation strategy, policy-decision-point selection) warrant ADRs.
