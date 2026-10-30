---
description: "[COMMUNITY] Record the secure-software evidence a US federal agency asks of a software producer under EO 14028 and OMB M-26-05: what the agency's policy or contract requires, the Secure Software Development Attestation Form where the agency uses it, and an SBOM to the CISA 2026 Minimum Elements in CycloneDX or SPDX."
doc-type: SBOM
argument-hint: "<project ID or software product, e.g. '001', 'Agency Citizen Services Portal'>"
effort: high
handoffs:
  - command: us-nist-800-53
    description: SR (Supply Chain Risk Management) and SA (System and Services Acquisition) control family implementations must cross-reference the attestation and SBOM.
  - command: adr
    description: SBOM format choice (CycloneDX vs SPDX), signing strategy (Sigstore, in-toto, SLSA level), and attestation exception requests warrant ADRs.
  - command: risk
    description: Components with known unmitigated vulnerabilities or attestation exceptions feed the risk register.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified US federal counsel, your agency's Senior Agency Official
> for Privacy (SAOP), CISO, Chief AI Officer (CAIO), and (for FedRAMP matters) the agency PMO
> and 3PAO before reliance.
>
> **Statutory currency**: EO 14110 was **revoked January 2025**; the active AI assurance mandates
> are **OMB M-25-21** (use and governance of AI; it rescinded and replaced M-24-10 on 3 April 2025)
> and **OMB M-25-22** (acquisition of AI; it replaced M-24-18). FedRAMP completed the
> transition to NIST 800-53 **Rev 5** baselines in 2024 — Rev 4 references are deprecated.
> **OMB M-26-05** (23 January 2026) rescinded M-22-18 and M-23-16, so the secure-software
> attestation is no longer a government-wide requirement. Verify
> all citations against the current Federal Register, OMB Circulars page, NIST publications, and
> FedRAMP.gov before relying on this output.

You are an enterprise architect recording the **secure-software evidence** for a software product used by a US federal civilian agency, under EO 14028 §4 and OMB M-26-05: what the agency requires, the **Secure Software Development Attestation Form** where the agency uses it, and an accompanying **Software Bill of Materials (SBOM)**.

## User Input

```text
$ARGUMENTS
```

## Context

Executive Order 14028 ("Improving the Nation's Cybersecurity", 12 May 2021) §4 is still in force and has not been amended. It had NIST issue secure software development guidance (SP 800-218, the Secure Software Development Framework or SSDF), had the Department of Commerce publish minimum elements for an SBOM (§4(f)), and directed OMB to require agencies to comply with the NIST guidance (§4(k)). OMB did that through M-22-18 (September 2022) and M-23-16 (June 2023), which required agencies to obtain a self-attestation from each software producer, and CISA published the common Secure Software Development Attestation Form in March 2024.

**OMB M-26-05 (23 January 2026) rescinded M-22-18 and M-23-16.** It sets out what is now required and what is the agency's choice:

- **Required of every agency**: "maintain a complete inventory of software and hardware and develop software and hardware assurance policies and processes that match their risk determinations and mission needs". Each agency "should validate provider security utilizing secure development principles and based on a comprehensive risk assessment".
- **Agency choice**: agencies "may choose to use" the resources developed under M-22-18, such as the Secure Software Development Attestation Form, and "may also choose to adopt contractual terms that require a software producer to provide a current software bill of materials (SBOM) upon request". For a cloud platform, such a term should require an SBOM of the runtime production environment.

No government-wide rule now requires the attestation. EO 14306 (6 June 2025) struck the sections of EO 14144 that would have had attestations lodged with CISA and validated by it. On 6 March 2026 the FAR Council withdrew FAR Case 2023-002 (Supply Chain Software Security), because M-26-05 had rescinded the memoranda it implemented. A software producer therefore owes an attestation, an SBOM or other artefacts only where the agency's assurance policy or the contract asks for them. CISA has archived its attestation-form landing page and the user guide for its online repository (RSAA), and the repository at softwaresecurity.cisa.gov did not resolve when checked on 28 October 2026. The form itself (OMB control number 1670-0052, expiring 31 March 2027) is still published, and its instructions allow a signed PDF to be emailed to the agency.

For SBOM content, CISA's **2026 Minimum Elements for a Software Bill of Materials** (29 July 2026, with NSA, FBI and international partners) "updates and replaces" the NTIA Minimum Elements of July 2021. It sets 17 data fields and 6 practices and processes, and it does not create new requirements: it sets out how organisations should generate and request SBOMs. The two widely used formats are **CycloneDX** (ECMA-424) and **SPDX** (ISO/IEC 5962). Provenance attestations (in-toto, an SLSA level claim, Sigstore signatures) often accompany the SBOM. The current SLSA specification is version 1.2, which has two tracks: the Build track, levels Build L0 to L3, and the Source track, levels Source L1 to L4. Versions 1.0 and 1.1 are retired and had only the Build track. There is no Build L4, and the single "SLSA 1–4" scale of the pre-1.0 drafts no longer exists. The SSDF in force is SP 800-218 version 1.1; NIST published version 1.2 (SP 800-218 Rev. 1) as an initial public draft on 17 December 2025, and it is not yet final.

**Authoritative anchors**:

- EO 14028 (Improving the Nation's Cybersecurity) — <https://www.federalregister.gov/documents/2021/05/17/2021-10460/improving-the-nations-cybersecurity>
- OMB M-26-05 (Adopting a Risk-based Approach to Software and Hardware Security, 23 January 2026) — <https://www.whitehouse.gov/wp-content/uploads/2026/01/M-26-05-Adopting-a-Risk-based-Approach-to-Software-and-Hardware-Security.pdf>
- EO 14306 (6 June 2025; amends EO 14144) — <https://www.federalregister.gov/d/2025-10804>
- FAR Case 2023-002 withdrawn 6 March 2026 (Unified Agenda, 14 August 2026, entry 345) — <https://www.federalregister.gov/documents/2026/08/14/2026-16612/regulatory-agenda>
- CISA Secure Software Development Attestation Form (agency choice under M-26-05) — <https://www.cisa.gov/resources-tools/resources/secure-software-development-attestation-form>
- NIST SP 800-218 (Secure Software Development Framework v1.1) — <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf>; v1.2 initial public draft (SP 800-218 Rev. 1) — <https://csrc.nist.gov/pubs/sp/800/218/r1/ipd>
- CISA 2026 Minimum Elements for a Software Bill of Materials — <https://www.cisa.gov/resources-tools/resources/2026-minimum-elements-software-bill-materials-sbom>
- CISA Hardware Bill of Materials (HBOM) Framework (September 2023) — <https://www.cisa.gov/resources-tools/resources/hardware-bill-materials-hbom-framework-supply-chain-risk-management>
- CycloneDX specification — <https://cyclonedx.org/specification/overview/>
- SPDX specification — <https://spdx.dev/specifications/>
- SLSA (Supply-chain Levels for Software Artifacts) v1.2 — <https://slsa.dev/spec/v1.2/>
- Rescinded by M-26-05, for reference only: OMB M-22-18 — <https://bidenwhitehouse.archives.gov/wp-content/uploads/2022/09/M-22-18.pdf>; OMB M-23-16 — <https://bidenwhitehouse.archives.gov/wp-content/uploads/2023/06/M-23-16-Update-to-M-22-18-Enhancing-Software-Security.pdf> (archived copies)

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract `INT-*` (integration requirements), `NFR-SEC-*`, plus any procurement requirements
   - The project's NIST 800-53 control-tailoring artefact — for SR and SA family implementation evidence
   - Any vendor HLD / DLD documents under `projects/<id>/vendors/` — for component inventory and build pipeline architecture
   - Any vendor / third-party software inventory under `projects/<id>/vendors/`
   - Any agency software assurance policy, solicitation or contract clauses under `projects/<id>/external/` — these decide what the producer must supply
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-sbom-eo-14028-template.md` (user override)
   - **Then**, `.arckit/templates/us-sbom-eo-14028-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/us-sbom-eo-14028-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> SBOM {VERSION} --filename` for the artefact filename. The type code for this command is `SBOM`. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the US regime to `_partials/document-control-us.md`, which already carries the EO 13526 / 32 CFR Part 2002 marking ladder — no per-command classification override is needed.

6. Generate the following sections:

   - **Software Product Identification** — producer name, product name, version, release date, deployment targets, whether the product is delivered as software, SaaS, IaaS/PaaS-hosted application, or hybrid, and whether it includes hardware components.
   - **Agency Requirements (OMB M-26-05)** — for each item, record whether the acquiring agency's software assurance policy or the contract requires it, and cite the policy or clause: the attestation form; an SBOM on request (for a cloud platform, of the runtime production environment); a third-party assessment; a hardware bill of materials (HBOM) where the product includes hardware; any other artefacts. Where the agency asks for nothing, say so, and keep the SSDF evidence and SBOM below as the producer's own good practice. Do not describe any item as a government-wide requirement.
   - **Form Scope** — only where the agency uses the form, apply the form's own scope: software developed after 14 September 2022, software developed earlier but changed by a major version since then, or software delivered by continuous change (such as SaaS) is in scope. Out of scope: software developed by federal agencies, open-source software that an agency obtains freely and directly, third-party open-source and proprietary components incorporated into the product, and software that is freely obtained and publicly available. Note the producer of record for each open-source component.
   - **Secure Software Development Attestation Form** — only where the agency uses it. Section I: new attestation, attestation following an extension or waiver, or revised attestation; company-wide, individual product, or multiple products or versions, with product names, versions and release dates. Section II: producer information and primary contact. Section III, the four attestation items as the form words them: (1) the software is developed and built in secure environments, secured at a minimum by (a) separating and protecting each development and build environment, (b) regularly logging, monitoring and auditing trust relationships used for access to those environments and among their components, (c) enforcing multi-factor authentication and conditional access, (d) documenting and minimising software products that create undue risk in those environments, (e) encrypting sensitive data such as credentials, to the extent practicable and based on risk, and (f) defensive practices including continuous monitoring and incident response; (2) a good-faith effort to maintain trusted source-code supply chains using automated tools or comparable processes for internal code and third-party components; (3) provenance maintained for internal code and third-party components to the greatest extent feasible; (4) automated tools or comparable processes that check for security vulnerabilities, with (a) checks run on an ongoing basis and before product, version or update releases, (b) a policy or process to address discovered vulnerabilities before release, and (c) a vulnerability disclosure programme. For each item: Yes or No, and the evidence. Record the signatory (the CEO or a designee with authority to bind the company), or the attached assessment by a FedRAMP-certified 3PAO or another 3PAO approved in writing by an agency official, which the form accepts instead of a signature.
   - **SSDF Practice Crosswalk** — table mapping each form item to its EO 14028 §4(e) clause and the SP 800-218 practices and tasks given in the form's appendix, and to NIST 800-53 SR / SA family controls. Where the form is not used, record the same evidence against the SSDF practice groups (PO, PS, PW, RV).
   - **SBOM Format Choice** — CycloneDX or SPDX, with rationale. Note the version (e.g. CycloneDX 1.6, SPDX 2.3), avoiding any version the format's maintainers have deprecated, and the tooling used to generate the SBOM.
   - **SBOM Minimum Elements Checklist (CISA 2026)** — confirm the 17 data fields. SBOM metadata: SBOM Author, SBOM Author Signature, SBOM Data Format Name, SBOM Data Format Version, SBOM Generation Context, SBOM Timestamp (RFC 9557), SBOM Tool Name, SBOM Tool Version, SBOM Version. Component data: Component Producer, Component Name, Component Version, Component Identifiers (CPE, PURL or others), Component Hash Value, Component Hash Algorithm, Component License, Component Dependency Relationship. Then the 6 practices and processes: Accommodation of Updates to SBOM Data, Coverage (all components, including transitive dependencies), Distribution and Delivery, Explicitly Identifying Unknown Information (unknown versus withheld), Frequency (a new SBOM for each build or release), and Machine-Processable Data.
   - **Provenance and Signing** — SLSA v1.2 Build track level claim (Build L0, L1, L2 or L3) with rationale, any Source track level claimed for the source repository (Source L1 to L4), signing strategy (Sigstore cosign, GPG, vendor key), in-toto attestation layout if used.
   - **Vulnerability Management Posture** — VEX (Vulnerability Exploitability eXchange) or CSAF advisory production cadence, CVE disclosure policy, coordinated-disclosure contact, mean-time-to-patch targets.
   - **Gaps and POA&M** — for any form item that cannot be attested, or any SBOM term the agency asked for that cannot be met: which items, why, the practices in place to mitigate the risk, a plan of action and milestones (POA&M) with dates, and the agency's decision under its own risk-based policy. M-26-05 sets no OMB extension or waiver process; the form's instructions still describe this route.
   - **Distribution Plan** — how the attestation, if any, reaches the agency (as its policy or contract specifies, for example the signed PDF emailed to the agency's address), how the SBOM is delivered (on request, with the installation, at a version-specific URL or through an API), and the access-control posture for SBOM consumers.

7. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SBOM** per-type checks pass. Fix any failures before proceeding.
8. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.mjs`.

9. Emit a short summary to the user — what the agency requires (form, SBOM, both or neither), attestation status where the form is used (Full / Gaps with POA&M), SBOM format and component count, SLSA Build level claim, open POA&M items, and the delivery date target. Do not echo the full artefact.

## Handoffs

The attestation and SBOM directly evidence NIST 800-53 SR and SA family controls in `/arckit-us:us-nist-800-53`. SBOM-format choice, signing strategy, and any attestation gaps should be captured as ADRs via `/arckit:adr`. Components with known unmitigated vulnerabilities and any open attestation gaps feed `/arckit:risk`.

## Important Notes

- **Check what the agency actually asks for** — since 23 January 2026 the attestation form and an SBOM are what the agency's policy or contract requires, not a government-wide mandate. Never present them as required by M-22-18, M-23-16 or the FAR.
- **The attestation is from the software producer, not the agency** — if the agency is procuring software and uses the form, the supplier signs it. Software developed by federal agencies is outside the form's scope: for in-house software, record the agency's own SSDF evidence and SBOM against its assurance policy. Identify the producer of record before drafting.
- **CycloneDX vs SPDX is not interchangeable per-asset** — pick one format per software product and maintain it consistently across versions. Switching formats mid-lifecycle complicates downstream consumer tooling.
- **The CISA 2026 Minimum Elements are a floor, not a ceiling** — they already add a signed SBOM, component hashes and licences to the 2021 NTIA list. VEX or CSAF advisories and signed provenance go beyond them.
- **SLSA level claims must be verifiable** — the Build track stops at Build L3. Build L2 needs provenance generated and signed by a hosted build platform; Build L3 adds a hardened platform that stops runs influencing one another and keeps the provenance signing secret away from user-defined build steps. Never claim "SLSA 4" or Build L4: Build L4 is only a future direction in the specification, and hermetic or reproducible builds are not requirements of any current level. Source L4 (two-party review) belongs to the Source track and says nothing about the build. If you cannot evidence a level, claim one lower.
- **POA&Ms are time-bound** — each gap needs dates, mitigations and a remediation plan, and the agency's decision recorded. Treat it as a clock running down, not as a permanent carve-out.
