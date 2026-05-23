---
description: "[COMMUNITY] Design a US federal Identity, Credential, and Access Management architecture per OMB M-19-17 and NIST SP 800-63-3, determining IAL/AAL/FAL levels per use case and selecting PIV / login.gov / agency-specific identity providers."
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

You are an enterprise architect designing the **Identity, Credential, and Access Management (ICAM)** architecture for a US federal civilian system under OMB M-19-17.

## User Input

```text
$ARGUMENTS
```

## Context

OMB M-19-17 ("Enabling Mission Delivery through Improved Identity, Credential, and Access Management") sets the federal ICAM policy framework. It directs agencies to adopt a risk-based approach to identity assurance using **NIST SP 800-63-3** Digital Identity Guidelines, which decompose identity assurance into three orthogonal levels:

- **IAL (Identity Assurance Level)** 1 / 2 / 3 — strength of identity proofing
- **AAL (Authenticator Assurance Level)** 1 / 2 / 3 — strength of authentication
- **FAL (Federation Assurance Level)** 1 / 2 / 3 — strength of federated assertion

Federal employees and contractors authenticate using **PIV** (Personal Identity Verification) credentials per **FIPS 201-3**. Public-facing federal services predominantly federate to **login.gov** (operated by GSA / Technology Transformation Services) which provides IAL1, IAL2, and AAL2 services. Agencies may operate additional federated identity providers (e.g. HHS IAM, VA.gov).

**Authoritative anchors**:

- OMB M-19-17 (Enabling Mission Delivery through Improved Identity, Credential, and Access Management) — <https://www.whitehouse.gov/wp-content/uploads/2019/05/M-19-17.pdf>
- NIST SP 800-63-3 (Digital Identity Guidelines) — <https://pages.nist.gov/800-63-3/>
- NIST SP 800-63A (Enrollment and Identity Proofing) — <https://pages.nist.gov/800-63-3/sp800-63a.html>
- NIST SP 800-63B (Authentication and Lifecycle Management) — <https://pages.nist.gov/800-63-3/sp800-63b.html>
- NIST SP 800-63C (Federation and Assertions) — <https://pages.nist.gov/800-63-3/sp800-63c.html>
- FIPS 201-3 (Personal Identity Verification of Federal Employees and Contractors) — <https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.201-3.pdf>
- login.gov technical documentation — <https://developers.login.gov/>
- GSA IDmanagement.gov ICAM Architecture — <https://www.idmanagement.gov/>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract `NFR-SEC-*` (security NFRs), `INT-*` (integration requirements), `DR-*` (data requirements)
   - The project's FIPS 199 artefact — system water-mark influences AAL minimums
   - The project's STKE artefact — for user populations (federal employees, contractors, citizens, partners)
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-icam-template.md` (user override)
   - **Then**, `.arckit/templates/us-icam-template.md`
   - **Fallback**, `.arckit/templates/us-icam-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> ICAM --filename` for the artefact filename. The type code for this command is `ICAM`.

5. Generate the following sections:

   - **User Populations and Use Cases** — enumerate the user populations the system serves: Federal Employees, Contractors, Citizens (public-facing), Partner Agencies, Privileged Administrators, Service Accounts. For each population list the use cases (e.g. "claim a benefit", "process a case", "administer the cloud account").
   - **IAL / AAL / FAL Determination Matrix** — for each use case score IAL (1/2/3), AAL (1/2/3), FAL (1/2/3) per the SP 800-63-3 risk assessment methodology. Capture the rationale referencing the impact categories (inconvenience/distress, financial loss, harm to programs, unauthorized release of sensitive info, personal safety, civil/criminal violations).
   - **Identity Proofing Architecture** — for IAL2/IAL3 use cases, document the proofing process: collected evidence (STRONG / SUPERIOR / FAIR), in-person vs remote (supervised) proofing, identity-proofing provider (login.gov, ID.me, agency-operated), proofing data retention and disposal policy. Cross-reference the PIA.
   - **Authenticator Selection** — for each AAL tier select acceptable authenticators per SP 800-63B (e.g. AAL2: Multi-Factor OTP + Memorised Secret, MF Cryptographic Software; AAL3: MF Cryptographic Hardware such as PIV card or FIDO2 hardware key with verifier impersonation resistance).
   - **Federal Employee / Contractor Pattern** — PIV-card-as-primary-credential per HSPD-12 and FIPS 201-3. Document PIV derivation for mobile (Derived PIV per SP 800-157 Rev 1). Identify cross-agency PIV interoperability requirements via the Federal PKI.
   - **Public-Facing Citizen Pattern** — login.gov as the default per M-19-17 direction. Document login.gov tenant configuration: IAL/AAL requirements, attribute bundles, redirect/logout flows, SAML vs OIDC, branded vs unbranded interface.
   - **Federation Pattern** — SAML 2.0 vs OIDC; SP-initiated vs IdP-initiated; assertion encryption; session management; single-logout (SLO) handling.
   - **Privileged Access Management (PAM)** — break-glass accounts, just-in-time elevation, session recording, separation of duties, MFA-bound to hardware roots of trust for AAL3.
   - **Credential Lifecycle** — issuance, suspension, revocation, re-issuance, renewal; PIV-specific lifecycle per FIPS 201-3 §5.
   - **Authorization Model** — RBAC / ABAC / ReBAC choice with rationale; policy decision point (PDP), policy information point (PIP), policy enforcement point (PEP) placement; integration with the Zero Trust policy engine.

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — user-population count, highest IAL/AAL/FAL required, selected identity providers (login.gov, PIV, agency IdP), and any open architecture decisions. Do not echo the full artefact.

## Handoffs

ICAM is the foundation of the Zero Trust Identity pillar — feed IAL/AAL/FAL outputs into `/arckit:us-zero-trust` scoring. The proofing data flows (especially at IAL2/IAL3) collect significant PII, so trigger `/arckit:us-privacy-pia`. Identity-provider selection and federation pattern decisions should be captured as ADRs via `/arckit:adr`.

## Important Notes

- **IAL / AAL / FAL are orthogonal** — do not equate IAL2 with AAL2 with FAL2. A use case can require IAL2 (proofed identity) with AAL3 (phishing-resistant MFA) and FAL2 (encrypted assertion). The xALs are chosen independently per risk impact.
- **login.gov is the federal default for public-facing services** — per M-19-17 direction. Agencies operating their own consumer IdP must justify the deviation. Internal-employee patterns continue to use PIV.
- **PIV-Derived credentials are first-class** — Derived PIV (SP 800-157 Rev 1) provides PIV-equivalent authentication on mobile devices and is now widely accepted. Do not block mobile use cases on a misconception that only physical PIV cards qualify.
- **NIST SP 800-63 Rev 4 is in flight** — the draft introduces material changes (phishing-resistant authenticators required at AAL2, syncable authenticators, broader IAL options). Track the Rev 4 publication and update this artefact when it lands.
- **Federation Assurance Level often gets shortcut** — FAL1 (bearer assertion over TLS) is the default for SAML/OIDC, but high-impact use cases require FAL2 (encrypted assertion) or FAL3 (holder-of-key). Do not default everything to FAL1 by accident.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-zero-trust` -- ICAM is the foundation of the Zero Trust Identity pillar; IAL/AAL/FAL selections directly score ZTMM Identity functions.
- `/arckit:us-privacy-pia` -- Identity proofing collects and processes PII (especially IAL2/IAL3); the ICAM data flows feed the PIA personal-information inventory.
- `/arckit:adr` -- Identity provider selection (PIV vs login.gov vs agency-specific) and federation pattern decisions warrant ADRs.
