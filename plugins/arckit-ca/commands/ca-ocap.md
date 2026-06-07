---
description: "[COMMUNITY] Generate a First Nations OCAP® (Ownership, Control, Access, Possession) sovereignty assessment — FNIGC pre-engagement gate, per-dataset OCAP mapping, USAI and ITK considerations, repatriation and co-governance plan. Not a substitute for direct FNIGC and community engagement."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: data-model
    description: OCAP-mapped data classifications and access controls feed the data model's stewardship and access policies.
  - command: ca-pia
    description: Personal-information processing of Indigenous data inherits the PIA controls plus OCAP-derived restrictions.
  - command: ca-atip
    description: ATIP severance design must reflect OCAP access and control determinations for Indigenous datasets.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel, your departmental ATIP coordinator,
> ITSEC officer, and (for FITAA matters) the Office of the Commissioner of Foreign Influence
> Transparency before reliance.
>
> **Statutory currency**: FITAA was enacted June 2024 with regulations still emerging through 2025–2026.
> The Commissioner's office is newly stood up and operational guidance will evolve. Verify all
> citations against the current Justice Laws Website text and Commissioner's published guidance
> before relying on this output.

> 🪶 **OCAP® notice**: OCAP® (Ownership, Control, Access, Possession) is a registered trademark of
> the First Nations Information Governance Centre (FNIGC). The OCAP® principles describe a
> *relationship*, not a checklist. This command produces a planning scaffold and assessment;
> it is **not a substitute for direct engagement with FNIGC and the affected First Nation(s),
> Métis, and Inuit communities**. The architect must engage FNIGC and community representatives
> before relying on any OCAP determinations made here.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a First Nations OCAP® sovereignty assessment for a federal information system that processes Indigenous data.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, DR, and DMOD artefacts (if present)
   - The project's `ARC-<id>-PIA-v*.md` if the `ca-pia` command has run
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-ocap-template.md` (user override)
   - **Then**, `.arckit/templates/ca-ocap-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-ocap-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> OCAP --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header. Note that OCAP-relevant artefacts may carry community-protected information that exceeds the federal classification scheme; mark accordingly and flag in the Open Items section.
5. Generate the following sections (the template provides skeletons for each). **The FNIGC Pre-Engagement Confirmation gate in step 5.1 is structurally enforced — if engagement is not confirmed, STOP at the planning scaffold and do NOT generate sections 5.2–5.10.**

   1. **FNIGC Pre-Engagement Confirmation Block** — the architect MUST confirm:
      - Has an FNIGC pre-engagement been booked or is it in progress? (`yes` / `no` / `in progress` / `N/A — explain`)
      - Date of engagement (if scheduled)
      - Designated engagement contact at FNIGC and within the affected First Nation(s)
      - Nature of engagement: scoping conversation / data-sharing-agreement workshop / governance review / other

      **Gate behaviour**:

      - If the answer is `yes` or `in progress` (with a scheduled date and named contacts), proceed to sections 5.2–5.10.
      - If the answer is `no` and the engagement is **not** in progress, the command MUST stop here and emit a **planning scaffold only**, which:
        - Records the absence of FNIGC engagement and the reason given
        - Provides a template engagement-letter shape to send to FNIGC (purpose, datasets in scope, proposed timeline, named departmental signatory)
        - Flags the assessment header `Status: PLANNING SCAFFOLD — INCOMPLETE`
        - Does **NOT** generate a self-declared OCAP register, DSA terms, or co-governance arrangement
        - Stops generating subsequent sections and surfaces a single Open Item: "FNIGC pre-engagement required before this assessment can be completed."
      - If the answer is `N/A`, the architect must justify in writing why no Indigenous data is in scope (with cross-reference to DR and DMOD); if justification is sound, the artefact is closed with an N/A finding and no further sections are generated.

   2. **Indigenous Data Inventory** — per dataset: First Nation(s) of origin, nature of data (administrative, statistical, traditional knowledge, biological, image, audio, video), current custodianship arrangement, transfer history, sensitivity tier.

   3. **OCAP Principles Mapping (per dataset)**:
      - **Ownership** — who holds collective ownership; how it is asserted; supporting agreements.
      - **Control** — who decides on use, sharing, publication, deletion, secondary analysis; governance body; veto rights.
      - **Access** — who accesses, on what terms; access tiering; consent withdrawal mechanism.
      - **Possession** — physical and digital custody; backup arrangements; repatriation triggers.

   4. **USAI Considerations** — Métis Nation OCAS / USAI-aligned principles for Métis data: Utility, Self-Determination, Access, Inter-relationships. Apply where Métis populations are in scope. Do NOT collapse into OCAP.

   5. **ITK Principles Considerations** — Inuit Tapiriit Kanatami *National Inuit Strategy on Research* and Inuit-Crown Partnership Committee guidance. Apply where Inuit populations are in scope. Do NOT collapse into OCAP.

   6. **Data Sharing Agreement Terms** (where applicable) — the form an OCAP-aligned DSA should take: Indigenous co-signatory, purpose limitation, time-bounded, revocability, audit rights, sub-processor restrictions.

   7. **Repatriation Plan** — where data was historically taken without informed consent: a plan for return-or-destroy, including format-portability for return.

   8. **Co-Governance Arrangements** — Indigenous representation on the data-stewardship governance body; decision-making authority (consensus vs majority); appeal pathway.

   9. **Risks and Mitigation Register** — cultural, legal, reputational risks: misuse of traditional knowledge, secondary analysis without consent, breach of trust, *UNDA / UNDRIP* implications.

   10. **Open Items** — including any unresolved community-protected classification, pending FNIGC follow-up, and outstanding USAI / ITK community engagements.

6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The First Nations Principles of OCAP® (FNIGC) and the *United Nations Declaration on the Rights of Indigenous Peoples Act* (S.C. 2021, c. 14) MUST appear in the Document Register with their primary URLs and verification dates.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the FNIGC engagement status, the count of datasets mapped, and any open items). If the artefact is a planning scaffold, say so plainly in the summary.

## Authoritative anchor

- First Nations Principles of OCAP® — First Nations Information Governance Centre (FNIGC). Primary URL: <https://fnigc.ca/ocap-training/take-the-course/the-first-nations-principles-of-ocap/>.
- *United Nations Declaration on the Rights of Indigenous Peoples Act* (S.C. 2021, c. 14) — UNDRIP Act. Primary URL: <https://laws-lois.justice.gc.ca/eng/acts/U-2.2/>.
- Métis Nation USAI (Utility, Self-Determination, Access, Inter-relationships) — applied via the Métis Nation Council and provincial governing members.
- Inuit Tapiriit Kanatami — *National Inuit Strategy on Research* (NISR).

Authority: FNIGC (federal-level OCAP training and certification); the affected First Nation(s) in any specific case; respective Métis Nation and Inuit institutions.

## Important notes

- **OCAP is a relationship, not a register field** — community engagement is the primary control; the assessment artefact records and supports the relationship rather than substituting for it.
- **FNIGC pre-engagement is mandatory** — the gate in Process step 5.1 is not advisory. If the architect cannot confirm engagement, the artefact must remain a planning scaffold and subsequent sections must NOT be drafted.
- **Distinct nations have distinct frameworks** — apply OCAP for First Nations data, USAI / equivalent for Métis data, and ITK guidance for Inuit data. Do not collapse "Indigenous data" into a single regime.
- **UNDRIP changes the landscape** — Canada's *UNDRIP Act* (2021) commits the Crown to align federal laws with the Declaration; Article 31 (cultural heritage and intellectual property) is directly relevant to any system handling traditional knowledge, language data, or cultural artefacts.
- **OCAP® trademark discipline** — OCAP® is a registered trademark of FNIGC. Use the ® symbol on first reference and where the principles are named in formal headings; cite respectfully and never imply self-certification.
