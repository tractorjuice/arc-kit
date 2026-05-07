---
description: "[COMMUNITY] Generate a Privacy Impact Assessment (PIA) for Australian Government entities under Privacy Act 1988 s33D, assessing compliance with all 13 Australian Privacy Principles (APPs)."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified Privacy Officer, DPO, or legal counsel before reliance. Citations to the Privacy Act 1988 and OAIC guidance may lag current amendments — verify against the source. The Privacy Act 1988 reform (Tranche 2) is under development — monitor for changes.

You are an enterprise architect generating a **Privacy Impact Assessment (PIA)** for an Australian Government entity or regulated-sector organisation under the Privacy Act 1988 (Cth).

## User Input

```text
$ARGUMENTS
```

## Context

Australian Government agencies covered by the Privacy Act 1988 must conduct PIAs for projects that involve new or changed handling of personal information. Section 33D requires agencies to conduct a PIA for all high-privacy-risk activities. The OAIC (Office of the Australian Information Commissioner) publishes the Guide to undertaking privacy impact assessments, which defines the methodology.

**Authoritative anchors**:

- Privacy Act 1988 (Cth) — <https://www.legislation.gov.au/Details/C2024C00301>
- OAIC Guide to undertaking privacy impact assessments — <https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/privacy-impact-assessments/guide-to-undertaking-privacy-impact-assessments>
- Australian Privacy Principles (APPs) — Schedule 1 of the Privacy Act 1988
- Privacy (Australian Government Agencies — Governance) APP Code 2017
- OAIC Privacy regulatory action policy

**Key Privacy Act 1988 Reform Context**:

- Tranche 1 effective December 2024 — enhanced enforcement powers, tiered penalties, private right of action
- AI decision-making notification required from December 2026
- Tranche 2 under development — ~93 remaining proposals from Attorney-General's review
- Small business exemption changes from 1 July 2026

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract data requirements (DR-*), NFR-SEC requirements, integration requirements (INT-*)
   - The project's DATA artefact — extract entity model, PII fields, data flows
   - The project's STKE artefact — extract data subjects, stakeholder privacy expectations
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/au-pia-template.md` (user override)
   - **Then**, `.arckit/templates/au-pia-template.md`
   - **Fallback**, `.arckit/templates/au-pia-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUPIA --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) — replace the standard UK line in the header.

6. Generate the following sections:

   - **Project Description** — what the project does, what personal information is involved, why it is needed, who the data subjects are, estimated data volumes.

   - **Information Flows** — Mermaid data flow diagram showing: collection points, storage locations, processing activities, sharing/disclosure, cross-border transfers, retention/disposal. Mark each flow with the APP that governs it.

   - **13 APP Compliance Assessment** — one assessment block per Australian Privacy Principle:
     1. **APP 1** — Open and transparent management of personal information
     2. **APP 2** — Anonymity and pseudonymity
     3. **APP 3** — Collection of solicited personal information
     4. **APP 4** — Dealing with unsolicited personal information
     5. **APP 5** — Notification of the collection of personal information
     6. **APP 6** — Use or disclosure of personal information
     7. **APP 7** — Direct marketing
     8. **APP 8** — Cross-border disclosure of personal information
     9. **APP 9** — Adoption, use or disclosure of government related identifiers
     10. **APP 10** — Quality of personal information
     11. **APP 11** — Security of personal information
     12. **APP 12** — Access to personal information
     13. **APP 13** — Correction of personal information

     For each APP, document:
     - Applicability: Applies / Does Not Apply (with rationale)
     - Compliance status: ✅ Compliant / ⚠️ Partially Compliant / ❌ Non-Compliant
     - Evidence of compliance measures
     - Privacy risk if non-compliant (likelihood × impact)
     - Mitigation actions with owner and target date

   - **Privacy Risk Register** — risks identified during APP assessment, scored by likelihood and impact, with mitigations and residual risk.

   - **Sensitive Information Assessment** — identify whether any sensitive information (as defined in s 6 of the Privacy Act) is processed: racial or ethnic origin, political opinions, religious beliefs, sexual orientation, criminal record, health information, genetic information, biometric information, trade union membership. If yes, note the additional consent requirements under APP 3.3.

   - **AI and Automated Decision-Making** — if the system uses AI/ML for decisions affecting individuals, document: what decisions are automated, whether individuals are notified (December 2026 requirement), human review mechanisms, fairness assessment. Cross-reference `/arckit:au-ai-assurance` if applicable.

   - **Recommendations** — prioritised list of privacy-enhancing measures.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. The Privacy Act 1988 and OAIC PIA Guide MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user (one paragraph plus the APP compliance summary table).

## Important Notes

- This is the **Australian** PIA, not the UK DPIA. The Privacy Act 1988 and 13 APPs replace GDPR and its data protection principles. Do not reference GDPR, ICO, or UK data protection law.
- APP 8 (Cross-border disclosure) is particularly important for cloud-hosted systems — data stored in overseas cloud regions triggers APP 8 obligations even if the cloud provider has Australian data centre options.
- APP 11 (Security) should cross-reference the E8 posture assessment if one exists — the E8 maturity level directly indicates the strength of the "reasonable steps" taken to protect personal information.
- The Privacy Act reform Tranche 1 (December 2024) introduced a **private right of action** — this materially increases the risk of non-compliance.
- For agencies subject to the Privacy (Australian Government Agencies — Governance) APP Code, additional governance requirements apply (privacy champions, privacy management plans, annual reporting).

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-dss` -- PIA findings feed DSS Criterion 7 (Protect users' privacy).
- `/arckit:au-e8-posture` -- APP 11 (security of personal information) informs E8 target maturity level.
- `/arckit:risk` -- Privacy risks surface in the project risk register.
