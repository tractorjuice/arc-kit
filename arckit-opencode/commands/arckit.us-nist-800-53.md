---
description: "[COMMUNITY] Tailor the NIST SP 800-53 Rev 5 control catalog against the Low / Moderate / High baseline for a US federal information system, recording implementation status, inheritance from cloud providers, parameter assignments, and compensating controls."
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

You are an enterprise architect tailoring **NIST SP 800-53 Rev 5** controls for a US federal civilian information system under the Risk Management Framework (NIST SP 800-37 Rev 2).

## User Input

```text
$ARGUMENTS
```

## Context

NIST SP 800-53 Rev 5 is the federal control catalogue — 20 control families (AC, AT, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PM, PS, PT, RA, SA, SC, SI, SR) plus dozens of control enhancements per family. NIST SP 800-53B publishes the three baselines (Low / Moderate / High) and the Privacy Control Baseline. RMF Step 2 (Select) requires choosing the baseline, tailoring it (adding, removing, or scoping controls), assigning organisation-defined parameters, and documenting compensating controls where a primary control cannot be implemented.

For systems pursuing FedRAMP authorization, the FedRAMP Rev 5 Baselines (Low / Moderate / High / LI-SaaS) extend SP 800-53B with FedRAMP-specific additions and parameter values. As of 2024 FedRAMP no longer accepts Rev 4 packages — all new and continuing authorizations must be Rev 5. Where the system inherits controls from a FedRAMP-authorized Cloud Service Offering (CSO), the tailoring statement records inheritance and customer responsibility per the CSP's Customer Responsibility Matrix (CRM).

**Authoritative anchors**:

- NIST SP 800-53 Rev 5 (Security and Privacy Controls for Information Systems and Organizations) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf>
- NIST SP 800-53B (Control Baselines for Information Systems and Organizations) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53B.pdf>
- NIST SP 800-53A Rev 5 (Assessment Procedures) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53Ar5.pdf>
- FedRAMP Rev 5 Baselines — <https://www.fedramp.gov/rev5/baselines/>
- NIST SP 800-37 Rev 2 (Risk Management Framework) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf>
- NIST OSCAL (Open Security Controls Assessment Language) — <https://pages.nist.gov/OSCAL/>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - **REQUIRED**: The project's FIPS 199 artefact — the system water-mark selects the baseline. If absent, stop and direct the user to run `/arckit:us-fisma-categorization` first.
   - The project's REQ artefact — extract `NFR-SEC-*` (security NFRs), `DR-*` (data requirements), `INT-*` (integration requirements)
   - Any prior ADRs touching identity, encryption, logging, network architecture
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-nist-800-53-template.md` (user override)
   - **Then**, `.arckit/templates/us-nist-800-53-template.md`
   - **Fallback**, `.arckit/templates/us-nist-800-53-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> NIST --filename` for the artefact filename. The type code for this command is `NIST`.

5. Generate the following sections:

   - **Baseline Selection** — derive the baseline from the FIPS 199 water-mark (Low / Moderate / High). If pursuing FedRAMP, record whether FedRAMP Low, Moderate, High, or LI-SaaS applies and cite the FedRAMP Rev 5 Baseline source.
   - **Inheritance Model** — identify FedRAMP-authorized CSPs in the boundary (e.g. AWS GovCloud, Azure Government, GCP Assured Workloads, Salesforce Government Cloud). For each, link to the CSP's Customer Responsibility Matrix (CRM) and list the control families wholly or partially inherited.
   - **Control Tailoring Matrix** — for every control in the selected baseline, record: Control ID (e.g. `AC-2`, `AC-2(1)`), title, implementation status (`Implemented` / `Inherited` / `Hybrid` / `Planned` / `Not Applicable`), responsible party (System Owner / CSP / Shared), implementation description (1–3 sentences), and assessment objective satisfaction. Group by control family.
   - **Organisation-Defined Parameter (ODP) Assignments** — table of every `[Assignment:` and `[Selection:` parameter with the agency value (e.g. `AC-2.j organization-defined frequency = annually`). FedRAMP-specified parameter values must be honoured where the system is pursuing FedRAMP — call out any deviation with rationale.
   - **Compensating Controls Register** — where a primary control cannot be implemented as written, document the compensating control, the rationale, the residual risk, and the AO acceptance posture.
   - **Privacy Controls Overlay** — if PII is processed, additionally tailor the SP 800-53B Privacy Control Baseline (PT family + privacy enhancements). Cross-reference the PIA.
   - **CUI Overlay (if applicable)** — for systems handling Controlled Unclassified Information, layer NIST SP 800-171 Rev 3 requirements per 32 CFR Part 2002.
   - **OSCAL Readiness** — note whether the implementation is published in OSCAL machine-readable format (FedRAMP increasingly mandates OSCAL SSP submission); flag as a roadmap item if not yet.

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — baseline selected, control counts (Implemented / Inherited / Hybrid / Planned / N/A), open compensating controls, and OSCAL readiness. Do not echo the full artefact.

## Handoffs

The tailored control matrix is the source-of-truth for the FedRAMP SSP (`/arckit:us-fedramp-ssp`) and the input to the Zero Trust scoring (`/arckit:us-zero-trust`). The SR (Supply Chain Risk Management) family controls cross-reference the EO 14028 attestation and SBOM via `/arckit:us-sbom-eo-14028`. Any non-trivial compensating controls, inheritance-boundary calls, or parameter-value deviations should be captured as ADRs via `/arckit:adr`.

## Important Notes

- **Rev 5 is the only acceptable revision for new federal systems** — Rev 4 packages are no longer accepted by FedRAMP and are deprecated by NIST. Do not generate Rev 4 control tailoring under any circumstances.
- **Inheritance is not "the CSP handles it"** — inheriting a control still requires the system owner to document the customer-side configuration that activates the inherited posture (e.g. inheriting AWS GovCloud's physical-security controls still requires the system owner to document how they consume those controls and configure account-level guardrails).
- **Privacy controls are not optional for PII systems** — the SP 800-53B Privacy Control Baseline is mandatory whenever PII is processed. Do not omit it on the grounds that "the PIA covers it"; the PIA documents the assessment, the privacy controls implement the safeguards.
- **OSCAL is the future tense quickly becoming present tense** — FedRAMP is progressively requiring OSCAL machine-readable submission. Track this on the roadmap even if the current submission is still Word-based.
- **CUI overlay is additive** — for CUI systems, NIST SP 800-171 Rev 3 requirements layer on top of SP 800-53 selection; they do not replace it for federal-system contexts.
- **FedRAMP parameter values bind FedRAMP submissions** — where FedRAMP specifies an ODP value (e.g. specific frequencies, retention periods, encryption strengths), the system must adopt the FedRAMP value or document a deviation with PMO approval. Silent variance is a finding.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-fedramp-ssp` -- The tailored control set and implementation statements drop directly into the FedRAMP SSP control-implementation tables.
- `/arckit:us-zero-trust` -- Control selections (especially AC, IA, SC families) feed the CISA Zero Trust Maturity Model scoring.
- `/arckit:us-sbom-eo-14028` -- Supply-chain controls (SR family) cross-reference the EO 14028 secure-software attestation and SBOM register.
- `/arckit:adr` -- Significant tailoring decisions (compensating controls, control inheritance boundaries, parameter values) warrant ADRs.
