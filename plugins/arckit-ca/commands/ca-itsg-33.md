---
description: "[COMMUNITY] Generate an ITSG-33 Statement of Applicability with TBS Standard on Security Categorization — Protected A/B/C, Secret, Top Secret tailoring, control profile selection (PBMM / PBMM-Cloud / Secret-High), CMVP / FIPS 140-3 module validation, supply chain security, and continuous monitoring plan."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: ca-cloud-residency
    description: Categorisation and control profile feed the sovereign cloud residency assessment.
  - command: risk
    description: Residual security risks and tailoring deviations become entries in the operational risk register.
  - command: adr
    description: Material control tailoring or compensating-control decisions warrant Architecture Decision Records.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel and the relevant departmental authority
> (ATIP coordinator, ITSEC officer, OCHRO language lead, CIO branch) before reliance. Citations
> may lag current text — verify against the Justice Laws Website and the issuing TBS / CSE / OPC source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating an ITSG-33 Statement of Applicability for a federal information system.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ artefact, paying particular attention to NFR-SEC-* security requirements
   - The project's DR artefact for data sensitivity classifications
   - The project's PIA artefact (`ARC-<id>-PIA-*.md`) for personal-information-driven categorisation drivers
   - The project's SOIA artefact (`ARC-<id>-SOIA-*.md`) if classified information is in scope
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-itsg-33-template.md` (user override)
   - **Then**, `.arckit/templates/ca-itsg-33-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-itsg-33-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> ITSG --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **Information Asset Categorisation** — for each information asset, score Confidentiality (C), Integrity (I), and Availability (A) as Low / Medium / High using the TBS *Standard on Security Categorization* injury-based scoring matrix. Aggregate per-asset scores to a system-level categorisation (the high-water mark across the inventory) and map to one of UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET. Show the working — categorisation drives the rest of the artefact and audit trails on the C/I/A reasoning are mandatory.
   - **Control Profile Selection** — pick the CSE-published profile matching the categorisation: PBMM (Protected B Medium-Medium) for the typical federal Protected B baseline; PBMM-Cloud where the system is cloud-hosted; Secret-High where the categorisation crosses to Secret; Top-Secret-High for Top Secret. State the rationale for the chosen profile and any tailoring (additions, removals, or parameter values) and identify the approver. Tailoring deviations from the published profile must be justified, not preferred.
   - **Statement of Applicability** — for each of the 16 ITSG-33 / NIST SP 800-53-derived control families (AC, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PS, RA, SA, SC, SI), list each control as Applicable / Not Applicable / Compensating Control with justification. Render as a per-family table. Where a compensating control is used, name the substitute and the residual-risk acceptance rationale.
   - **Cryptographic Module Validation** — list every cryptographic module in the system with its CMVP / FIPS 140-3 certificate number, validation level, and algorithm scope. Flag any module not on the active CMVP list as a finding. Non-CMVP-validated cryptography protecting Protected B and above is a finding, not a discussion item.
   - **Supply Chain Security** — apply the TBS *Direction on Vulnerable Suppliers* and the published sanctioned-entities list to the supplier inventory. Identify any vendor of concern, sub-processor of concern, or PSPC-restricted telecommunications equipment. Note dependencies on managed services that themselves carry inherited supply chain risk.
   - **Continuous Monitoring Plan** — assessment frequency per control family; the tooling that produces the evidence; the reporting cadence and recipients; and the explicit triggers for re-categorisation (new data elements, new processing, change of operating environment, change of supplier, security incident materially altering the threat picture).
   - **Authorisation Chain** — System Owner → Security Authority → Authorising Official, identified by role; specify the authorisation cycle, the conditions attaching to the authorisation, and the re-authorisation triggers.
   - **Open Items** — outstanding tailoring decisions, unfinished CMVP checks, unresolved supplier flags, and any condition the authorising official has placed on go-live.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. ITSG-33, the TBS *Standard on Security Categorization*, the *Direction on Vulnerable Suppliers*, and the CMVP active modules list MUST appear in the Document Register with their primary URLs and verification dates.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the system-level categorisation, the chosen profile, the count of Compensating Controls, and any open lawful-authority or supplier-flag items).

## Authoritative anchor

ITSG-33 *IT Security Risk Management: A Lifecycle Approach* (Communications Security Establishment / Canadian Centre for Cyber Security); TBS *Standard on Security Categorization*; TBS *Policy on Government Security*. Authority: Communications Security Establishment / Canadian Centre for Cyber Security; Treasury Board Secretariat Chief Information Officer Branch. Primary URLs: <https://cyber.gc.ca/en/guidance/itsg-33> and <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=16578>.

## Important notes

- **Categorisation drives everything.** Get the C / I / A scoring right — downstream profile selection, tailoring scope, control parameter values, and the authorisation cycle all derive from it. A wrong categorisation propagates silently and is expensive to unwind post-authorisation.
- **Tailoring is rationale-driven, not preference-driven.** Every tailoring deviation from the published CSE profile (control removal, parameter relaxation, compensating substitution) must be justified in the SoA with an explicit residual-risk statement and named acceptance.
- **CMVP-validated modules are mandatory** for cryptography protecting Protected B information and above. Non-validated modules are a finding, not a topic for discussion. Verify each module against the active CMVP list, not the historical list — modules can be moved to historical status with material consequences.
- **Supply chain controls extend beyond the prime contractor.** The *Direction on Vulnerable Suppliers* attaches to sub-processors, telecommunications equipment subject to PSPC restrictions, and managed services that carry their own inherited supplier dependencies. Screen the full inventory, not just the contracted party.
