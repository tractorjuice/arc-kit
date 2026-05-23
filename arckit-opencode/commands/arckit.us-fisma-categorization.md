---
description: "[COMMUNITY] Generate FIPS 199 system categorization (Low/Moderate/High water-mark) for a US federal civilian information system, mapping information types to NIST SP 800-60 Vol 2 and recording the CIA impact matrix."
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

You are an enterprise architect generating a **FIPS 199 Security Categorization** for a US federal civilian agency information system under FISMA (Federal Information Security Modernization Act of 2014).

## User Input

```text
$ARGUMENTS
```

## Context

FIPS Publication 199 is the mandatory federal standard for categorizing information and information systems by impact level. Every federal civilian system must be categorized as **Low**, **Moderate**, or **High** across the three security objectives — Confidentiality, Integrity, and Availability — before any NIST SP 800-53 Rev 5 baseline can be selected or a FedRAMP authorization pursued. The categorization is the foundational artefact of the Risk Management Framework (RMF) Step 1 (Categorize) per NIST SP 800-37 Rev 2.

The methodology decomposes the system into its constituent **information types** (using NIST SP 800-60 Vol 2 Rev 1 as the authoritative catalogue of federal information types), scores each information type across CIA at L/M/H, and derives the system high-water mark by taking the maximum impact across all information types and all three objectives. Provisional impact values from SP 800-60 may be adjusted upward (rarely downward) based on agency mission context, aggregation effects, and special factors.

**Authoritative anchors**:

- FIPS Publication 199 (Standards for Security Categorization of Federal Information and Information Systems) — <https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.199.pdf>
- NIST SP 800-60 Vol 2 Rev 1 (Guide for Mapping Types of Information and Systems to Security Categories: Appendices) — <https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-60v2r1.pdf>
- NIST SP 800-60 Vol 1 Rev 1 (Volume I: Guide) — <https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-60v1r1.pdf>
- NIST SP 800-37 Rev 2 (Risk Management Framework for Information Systems and Organizations) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-37r2.pdf>
- Federal Information Security Modernization Act of 2014 (FISMA, 44 U.S.C. §3551 et seq.)

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract `DR-*` (data requirements), `NFR-SEC-*` (security NFRs), `INT-*` (integration requirements)
   - The project's DATA / data-model artefact (if present) — for entity-level sensitivity classification
   - The project's STKE artefact (if present) — for mission-criticality framing
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-fisma-categorization-template.md` (user override)
   - **Then**, `.arckit/templates/us-fisma-categorization-template.md`
   - **Fallback**, `.arckit/templates/us-fisma-categorization-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> FIPS199 --filename` for the artefact filename. The type code for this command is `FIPS199`.

5. Generate the following sections:

   - **System Identification** — system name, agency owner, mission/business function, system boundary summary, system type (General Support System / Major Application / Minor Application / Subsystem).
   - **Information Type Inventory** — enumerate every information type processed, stored, or transmitted, mapping each to the NIST SP 800-60 Vol 2 appendix taxonomy (e.g. `C.2.8.12 Personal Identity and Authentication`, `D.3.1 Customer Services`, `C.3.5.1 Income Information`). For each type record: information type ID + name, SP 800-60 reference, brief description, source/origin.
   - **CIA Impact Matrix** — for each information type score Confidentiality / Integrity / Availability at Low / Moderate / High. Capture the SP 800-60 provisional values then the adjusted values with rationale for any deviation. Aggregate into a single matrix row per information type.
   - **System Security Category (Water-Mark Derivation)** — apply the high-water-mark rule: `SC_system = {(confidentiality, MAX), (integrity, MAX), (availability, MAX)}` across all information types. Show the calculation explicitly.
   - **Special Factors and Adjustments** — document any upward adjustments for aggregation (e.g. large volumes of individually low-impact PII aggregating to Moderate), criticality-of-mission, life-safety considerations, or national-security overlap. Downward adjustments are rare and must be justified against SP 800-60 §3.2.
   - **Agency-Specific Overlays** — note any agency-specific information-type overlays (e.g. CUI categories per 32 CFR Part 2002, HHS-specific health information types, IRS Publication 1075 FTI overlays) that apply.
   - **Rationale and Open Issues** — narrative justification for the water-mark and a register of any provisional or contested classifications requiring SISO/AO review.

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — system name, derived water-mark (e.g. `MODERATE / MODERATE / LOW → MODERATE`), count of information types, and any open issues. Do not echo the full artefact.

## Handoffs

The categorization output directly feeds `/arckit:us-nist-800-53` (the water-mark selects the Low / Moderate / High baseline). If any information type contains PII, run `/arckit:us-privacy-pia` next to discharge the E-Government Act §208 PIA obligation. Any ambiguous or upgraded categorizations should be logged into the project risk register via `/arckit:risk` for AO visibility.

## Important Notes

- **The high-water mark is one-way upward** — once an information type drives an impact level up, it stays up unless the type itself is removed from the system. Removing information types to lower the water-mark is a boundary change and a Major Modification under RMF.
- **Aggregation effects matter** — many individually-Low PII elements can aggregate to a Moderate or High confidentiality impact. SP 800-60 §3.2 explicitly requires consideration of aggregation; do not ignore it to keep the baseline at Low.
- **CUI is not automatic Moderate** — CUI Specified categories with safeguarding/dissemination controls (e.g. Export Controlled, Privacy, Tax) typically map to Moderate or higher, but CUI Basic does not by itself force Moderate. Apply 32 CFR Part 2002 plus the National Archives CUI Registry.
- **National Security Systems are out of scope for FIPS 199** — they follow CNSSI 1253. Do not use this command for NSS; route to the agency CISO and DoD/CNSS counterparts.
- **The categorization is a living artefact** — re-run when information types are added, when mission criticality changes, or when an Authority To Operate is renewed.
- **Provisional impact values from SP 800-60 are starting points, not endpoints** — agency mission context, downstream impact of unavailability, and adversary-attractiveness considerations frequently require upward adjustment. Document the adjustment rationale; an unadjusted SP 800-60 mapping is not, by itself, a defensible categorization.
- **Coordinate with the SISO and the AO before publishing** — categorization changes a system's downstream control baseline, monitoring posture, and audit burden. The decision is the AO's, not the project team's.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-nist-800-53` -- The FIPS 199 high-water mark drives the NIST SP 800-53 Rev 5 baseline (Low / Moderate / High) for control tailoring.
- `/arckit:us-privacy-pia` -- Information types containing PII trigger an E-Government Act §208 PIA; the FIPS 199 inventory seeds the PIA personal-information register.
- `/arckit:risk` -- Categorization rationale and any ambiguous information-type mappings feed the project risk register.
