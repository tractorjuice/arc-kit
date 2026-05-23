---
description: "[COMMUNITY] Produce an EO 14028 secure-software self-attestation (per OMB M-22-18 / M-23-16) and an accompanying Software Bill of Materials (SBOM) conforming to NTIA Minimum Elements in CycloneDX or SPDX format."
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

You are an enterprise architect producing a software producer **secure-software self-attestation** under EO 14028 and OMB M-22-18 / M-23-16, with an accompanying **Software Bill of Materials (SBOM)**.

## User Input

```text
$ARGUMENTS
```

## Context

Executive Order 14028 ("Improving the Nation's Cybersecurity", May 2021) directs federal civilian agencies to require secure-software practices from their software suppliers. OMB M-22-18 (September 2022) operationalised this by directing agencies to obtain self-attestations from software producers conforming to the NIST Secure Software Development Framework (SSDF, SP 800-218). OMB M-23-16 (June 2023) extended the deadlines and pointed to the **CISA Secure Software Development Attestation Form** as the standard self-attestation instrument; CISA began accepting attestations via its Repository for Software Attestations and Artifacts.

Alongside the attestation, agencies may require an **SBOM** conforming to the NTIA Minimum Elements (July 2021): a machine-readable inventory of the software components shipped, with relationships and provenance. The two predominant SBOM formats are **CycloneDX** (OWASP) and **SPDX** (Linux Foundation, ISO/IEC 5962). Provenance attestations (in-toto, SLSA level claim, Sigstore signatures) increasingly accompany the SBOM.

**Authoritative anchors**:

- EO 14028 (Improving the Nation's Cybersecurity) — <https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity>
- OMB M-22-18 (Enhancing the Security of the Software Supply Chain through Secure Software Development Practices) — <https://www.whitehouse.gov/wp-content/uploads/2022/09/M-22-18.pdf>
- OMB M-23-16 (Update to M-22-18) — <https://www.whitehouse.gov/wp-content/uploads/2023/06/M-23-16-Update-to-M-22-18-Enhancing-Software-Security-.pdf>
- CISA Secure Software Development Attestation Form — <https://www.cisa.gov/secure-software-attestation-form>
- NIST SP 800-218 (Secure Software Development Framework v1.1) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf>
- NTIA Minimum Elements for an SBOM — <https://www.ntia.doc.gov/files/ntia/publications/sbom_minimum_elements_report.pdf>
- CycloneDX specification — <https://cyclonedx.org/specification/overview/>
- SPDX specification — <https://spdx.dev/specifications/>
- SLSA (Supply-chain Levels for Software Artifacts) — <https://slsa.dev/>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract `INT-*` (integration requirements), `NFR-SEC-*`, plus any procurement requirements
   - The project's NIST 800-53 control-tailoring artefact — for SR and SA family implementation evidence
   - The project's HLD / DLD artefact — for component inventory and build pipeline architecture
   - Any vendor / third-party software inventory under `projects/<id>/vendors/`
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-sbom-eo-14028-template.md` (user override)
   - **Then**, `.arckit/templates/us-sbom-eo-14028-template.md`
   - **Fallback**, `.arckit/templates/us-sbom-eo-14028-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> SBOM --filename` for the artefact filename. The type code for this command is `SBOM`.

5. Generate the following sections:

   - **Software Product Identification** — producer name, product name, version, release date, deployment targets, whether the product is delivered as software, SaaS, IaaS/PaaS-hosted application, or hybrid.
   - **Applicability Determination** — does M-22-18 apply? Cite the M-22-18 §2 definition of covered software (software developed after 14 September 2022 used by the federal government). Note any open-source components and the producer-of-record for each.
   - **CISA Self-Attestation Form Content** — populate the CISA attestation form fields per OMB M-22-18 §III: (1) the software is developed and built in secure environments per SSDF PO.5; (2) the producer has documented audit trails / provenance for internal code and third-party components per PS.3, PW.4; (3) the producer employs automated tools to maintain trusted source-code supply chains per PW.4, PW.7, PW.8; (4) the producer maintains provenance for internal code and third-party components consumed; and additional sub-items per the current CISA form. Each item: status (Yes / No / Partial), evidence references, remediation plan.
   - **SSDF Practice Crosswalk** — table mapping each CISA attestation item to SP 800-218 practices (PO, PS, PW, RV) and to NIST 800-53 SR / SA family controls.
   - **SBOM Format Choice** — CycloneDX or SPDX, with rationale. Note the version (e.g. CycloneDX 1.6, SPDX 2.3) and the tooling used to generate the SBOM.
   - **NTIA Minimum Elements Checklist** — for the SBOM artefact confirm presence of: Supplier name; Component name; Version of the component; Other unique identifiers (PURL, CPE); Dependency relationships; Author of SBOM data; Timestamp; plus the data fields, automation support (machine-readable), and practice elements (frequency, depth, known unknowns, distribution and delivery, access control, accommodation of mistakes).
   - **Provenance and Signing** — SLSA level claim (1 / 2 / 3 / 4) with rationale, signing strategy (Sigstore cosign, GPG, vendor key), in-toto attestation layout if used.
   - **Vulnerability Management Posture** — VEX (Vulnerability Exploitability eXchange) production cadence, CVE disclosure policy, coordinated-disclosure contact, mean-time-to-patch targets.
   - **Exception Request** — if a self-attestation cannot be made for one or more items, document the M-22-18 exception process: which items, why, compensating controls, agency CIO + OMB notification status, expiry of the exception.
   - **Distribution Plan** — where the attestation will be lodged (CISA Repository for Software Attestations and Artifacts), where the SBOM will be distributed (agency CSO portal, supplier portal), and the access-control posture for SBOM consumers.

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — attestation status (Full / Partial / Exception), SBOM format and component count, SLSA level claim, open exceptions, and the lodging date target. Do not echo the full artefact.

## Handoffs

The attestation and SBOM directly evidence NIST 800-53 SR and SA family controls in `/arckit:us-nist-800-53`. SBOM-format choice, signing strategy, and any exception requests should be captured as ADRs via `/arckit:adr`. Components with known unmitigated vulnerabilities and any open M-22-18 exceptions feed `/arckit:risk`.

## Important Notes

- **The attestation is from the software producer, not the agency** — if the agency is procuring software, the supplier signs the CISA form. If the agency is producing software (in-house development or as a federal CSO), the agency is the producer and signs the form itself. Identify the producer-of-record before drafting.
- **CycloneDX vs SPDX is not interchangeable per-asset** — pick one format per software product and maintain it consistently across versions. Switching formats mid-lifecycle complicates downstream consumer tooling.
- **The NTIA Minimum Elements are a floor, not a ceiling** — modern SBOM consumers expect dependency-graph completeness, license metadata, VEX integration, and signed provenance. Treat the NTIA list as the minimum, then exceed it.
- **SLSA level claims must be verifiable** — claiming SLSA Level 3 or 4 without the corresponding build-pipeline isolation, hermetic builds, and signed provenance is non-compliant. If you cannot evidence the level, claim one lower.
- **M-22-18 exceptions are time-bound** — exception requests must specify the period, compensating measures, and remediation plan. Treat the exception as a clock running down, not as a permanent carve-out.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-nist-800-53` -- SR (Supply Chain Risk Management) and SA (System and Services Acquisition) control family implementations must cross-reference the attestation and SBOM.
- `/arckit:adr` -- SBOM format choice (CycloneDX vs SPDX), signing strategy (Sigstore, in-toto, SLSA level), and attestation exception requests warrant ADRs.
- `/arckit:risk` -- Components with known unmitigated vulnerabilities or attestation exceptions feed the risk register.
