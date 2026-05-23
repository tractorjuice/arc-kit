---
description: "[COMMUNITY] Generate a Privacy Impact Assessment under E-Government Act §208 and OMB M-03-22 for a US federal civilian system handling PII, including Privacy Act §552a alignment and SORN trigger check."
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

You are an enterprise architect producing a **Privacy Impact Assessment (PIA)** for a US federal civilian agency system under E-Government Act §208 and OMB M-03-22.

## User Input

```text
$ARGUMENTS
```

## Context

Section 208 of the E-Government Act of 2002 requires federal agencies to conduct a PIA before developing or procuring information technology that collects, maintains, or disseminates personally identifiable information (PII), and before initiating a new electronic collection of PII from ten or more persons (excluding agencies, instrumentalities, or employees of the Federal Government). OMB M-03-22 is the implementing guidance and specifies PIA content and process.

The PIA must align with the **Privacy Act of 1974** (5 U.S.C. §552a). If the system meets the Privacy Act definition of a System of Records — records about individuals retrieved by a personal identifier — the agency must publish (or update) a **System of Records Notice (SORN)** in the Federal Register before the system goes operational. PII handling must conform to the Privacy Act's Fair Information Practice Principles, NIST SP 800-122 protections, and any sector-specific overlays (HIPAA, FERPA, IRS Publication 1075 for Federal Tax Information, CJIS for criminal-justice information).

This US PIA is distinct from the Canadian PIA (`/arckit:ca-pia`), Australian PIA (`/arckit:au-pia`), and UK DPIA (`/arckit:dpia`) — do not confuse the statutory bases, terminology, or oversight bodies. The PIA is signed off by the agency's **Senior Agency Official for Privacy (SAOP)** and published (with appropriate redactions) on the agency's privacy page per M-03-22 §II.B.4.

**Authoritative anchors**:

- E-Government Act of 2002 §208 — <https://www.justice.gov/opcl/e-government-act-2002>
- OMB M-03-22 (OMB Guidance for Implementing the Privacy Provisions of the E-Government Act of 2002) — <https://www.whitehouse.gov/wp-content/uploads/2017/11/203-M-03-22-OMB-Guidance-for-Implementing-the-Privacy-Provisions-of-the-E-Government-Act-of-2002-1.pdf>
- Privacy Act of 1974 (5 U.S.C. §552a) — <https://www.justice.gov/opcl/privacy-act-1974>
- NIST SP 800-122 (Guide to Protecting the Confidentiality of Personally Identifiable Information) — <https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-122.pdf>
- OMB Circular A-130 (Managing Information as a Strategic Resource) — <https://www.whitehouse.gov/wp-content/uploads/legacy_drupal_files/omb/circulars/A130/a130revised.pdf>
- DOJ Office of Privacy and Civil Liberties — <https://www.justice.gov/opcl>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract `DR-*` (data requirements), `NFR-SEC-*` (security NFRs), `INT-*` (integration requirements)
   - The project's DATA / data-model artefact — for PII inventory, retention, lineage
   - The project's STKE artefact — for affected individuals and data subjects
   - The project's ICAM artefact (if present) — for identity-proofing PII flows
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-privacy-pia-template.md` (user override)
   - **Then**, `.arckit/templates/us-privacy-pia-template.md`
   - **Fallback**, `.arckit/templates/us-privacy-pia-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> USPIA --filename` for the artefact filename. The type code for this command is `USPIA` (US-prefixed to avoid collision with the Canadian `PIA` doc type).

5. Generate the following sections:

   - **System Overview** — system name, agency component owner, mission served, in-scope IT components, user populations, operational status.
   - **PII Inventory** — table of every PII element: data element name, category (sensitive vs non-sensitive per NIST SP 800-122), source (subject / third party / government records), purpose of collection, lawful authority citation, retention period, disposal method.
   - **PII Lifecycle Map** — Mermaid data-flow diagram covering Collection → Use → Disclosure → Retention → Disposal, with each flow annotated by the lawful authority and any Privacy Act §552a(b) exception relied upon.
   - **Lawful Authority** — statutory or regulatory basis to collect each category of PII; flag any element without clear authority as a blocker.
   - **Privacy Act §552a Alignment** — does the collection constitute a System of Records (records about individuals retrieved by personal identifier)? If yes, identify the relevant SORN(s) and whether a new SORN or a modification is required.
   - **SORN Trigger Check** — explicit determination: New SORN required / Modify existing SORN [cite SORN number] / No SORN required, with reasoning. If a SORN is required, capture the routine uses, retention schedule, and Federal Register publication timeline (typically 30 days post-publication before operational use).
   - **Fair Information Practice Principles (FIPPs) Conformance** — assessment against the eight FIPPs commonly cited in federal practice (Transparency, Individual Participation, Purpose Specification, Data Minimisation, Use Limitation, Data Quality and Integrity, Security, Accountability and Auditing).
   - **M-03-22 Content Checklist** — confirm all M-03-22 required PIA topics are covered: information collected and reason; intended use; with whom shared; whether individuals have opportunity to decline or consent; security; system-of-records status; relationship to existing SORNs.
   - **Sector-Specific Overlays** — if applicable, document HIPAA Security/Privacy Rule, FERPA, IRS Publication 1075 (FTI), CJIS, GLBA, COPPA, or agency-specific privacy regimes.
   - **Privacy Risk Register and Mitigations** — risks scored by likelihood and impact, with mitigations and residual risk; cross-reference the project risk register.
   - **SAOP Sign-Off Block** — agency SAOP reviewer, date, scope of approval, publication URL (post-redaction), and re-assessment cadence.

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — PII element count, SORN verdict, M-03-22 checklist satisfaction, top three privacy risks, SAOP review status, and intended publication date. Do not echo the full artefact.

## Handoffs

Identity-proofing PII flows reconcile with `/arckit:us-icam`. AI systems processing PII require `/arckit:us-ai-impact` for the M-24-10 rights-impacting determination. PII elements, lawful authorities, and retention rules flow into `/arckit:data-model` as data classifications and access-control attributes.

## Important Notes

- **This is the US PIA, not the Canadian PIA, UK DPIA, or Australian PIA** — different statutory bases, different oversight bodies (SAOP, not OPC / ICO / OAIC), different terminology (SORN, not PIB / ROPA). Do not blend frameworks; the `/arckit:ca-pia`, `/arckit:au-pia`, and `/arckit:dpia` commands exist precisely because the regimes differ.
- **SORN publication is a hard prerequisite** — if a SORN is required, the SORN must be published in the Federal Register and the comment period closed (typically 30 days) before the System of Records is operational. Do not treat this as a parallel task to launch.
- **SAOP sign-off is non-delegable for high-risk systems** — agency policy may permit privacy-officer sign-off for low-risk PIAs, but high-risk systems require the SAOP. Confirm the agency's delegation policy before assuming any officer can sign.
- **PIAs are not one-shot** — re-trigger on substantial modifications: new PII elements, new uses, new disclosure recipients, change of processor / contractor, change of cloud region or hosting model, or any change that materially alters the privacy risk posture.
- **Publication is mandatory** — M-03-22 §II.B.4 requires publication of the PIA on the agency website, subject only to legitimate redactions for sensitive information. An unpublished PIA fails the statutory transparency obligation.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-icam` -- PII collected by identity proofing (IAL2/IAL3) and authentication processes is documented in the PIA; the ICAM data flows must reconcile with the PIA inventory.
- `/arckit:us-ai-impact` -- AI systems processing PII require both the PIA and the M-24-10 rights-impacting determination; the PIA feeds the AI Impact Assessment.
- `/arckit:data-model` -- PII fields and lawful authorities surface as data-model attributes and access-control rules.
