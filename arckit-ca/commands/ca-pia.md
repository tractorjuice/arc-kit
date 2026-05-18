---
description: "[COMMUNITY] Generate a Canada Privacy Impact Assessment per the Privacy Act and TBS Directive on Privacy Impact Assessment — personal-information inventory, lawful authority, necessity and proportionality, OPC notification trigger, and mitigation tracker."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: risk
    description: PIA findings feed the privacy and regulatory entries in the risk register.
  - command: ca-atip
    description: Personal-information disclosure register continues into the Access to Information / Privacy Act reconciliation.
  - command: ca-aia
    description: Required when automated decision-making touches personal information; the AIA inherits the PIA personal-information inventory.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel and the relevant departmental authority
> (ATIP coordinator, ITSEC officer, OCHRO language lead, CIO branch) before reliance. Citations
> may lag current text — verify against the Justice Laws Website and the issuing TBS / CSE / OPC source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a Canada Privacy Impact Assessment (PIA) for a federal entity.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, DR, DMOD, and STKE artefacts (if present)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-pia-template.md` (user override)
   - **Then**, `.arckit/templates/ca-pia-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-pia-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> PIA --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **Programme / System Description** — what the system does, who operates it, the personal information lifecycle (collect → use → disclose → retain → dispose) and the subject populations affected.
   - **Lawful Authority** — Privacy Act §4 authority to collect; cite the enabling statute or regulation that authorises the collection. Where the authority is unclear, mark as `<TBC>` and flag as a blocker for OPC notification — collection without statutory authority is not lawful.
   - **Personal Information Inventory** — for each element: source, purpose of collection, sensitivity, retention period, disclosure recipients, and link to a Personal Information Bank (PIB) entry where applicable.
   - **Necessity and Proportionality** — Oakes-derived four-step analysis: pressing and substantial objective, rational connection between collection and objective, minimal impairment of privacy, proportional effects (benefits versus privacy intrusion).
   - **Privacy Risks and Mitigations Register** — risks, likelihood, impact, mitigations, and residual risk. Cross-reference `risk` for the project-level register continuation.
   - **Transfers and Disclosures** — Privacy Act §7 use limited to the purpose of collection or a consistent use; §8 disclosure with §8(2)(a)–(m) routine uses analysed where applicable. Cross-border transfer flags cross-reference `ca-cloud-residency`.
   - **Individual Rights** — §12 access, §13 PIB registration with Treasury Board Secretariat InfoSource, correction and annotation procedures, and complaint pathways to the OPC.
   - **OPC Notification Trigger Analysis** — which findings warrant pre-implementation consultation with the Office of the Privacy Commissioner. The TBS Directive on PIA requires notification at least 30 days before launch for new programmes / substantial modifications.
   - **PIA Approval Chain** — departmental ATIP coordinator → ADM → head of institution, with TBS notification and OPC consultation positioned at the right gates.
   - **Action Tracker** — open mitigations with owner, due date, status, and the link back to the privacy-risk register entry.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The Privacy Act and the TBS Directive on Privacy Impact Assessment MUST appear in the Document Register with their primary URLs and verification dates.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the headline privacy risks, OPC notification decision, and any open lawful-authority items).

## Authoritative anchor

Privacy Act (R.S.C., 1985, c. P-21) and the TBS *Directive on Privacy Impact Assessment* (current version). Authority: Office of the Privacy Commissioner of Canada (OPC) for consultation and review; Treasury Board Secretariat for the Directive. Primary URL for the Privacy Act: <https://laws-lois.justice.gc.ca/eng/acts/P-21/>.

## Important notes

- **Mandatory pre-launch consultation with OPC** for high-risk programmes — the TBS Directive on PIA requires notification a minimum of 30 days before launch of a new programme or substantial modification. Build the OPC review window into the delivery plan; do not treat it as a sign-off formality.
- **Personal Information Banks (PIBs)** must be registered in TBS InfoSource. Create or update the PIB entry as part of this PIA; an unregistered PIB exposes the institution under §13 of the Privacy Act and undermines the §12 right of access.
- **PIA is not a one-shot artefact** — re-trigger on substantial modifications: new data elements, new purposes, new disclosure recipients, change of contractor or processor, change of jurisdiction (including cloud region), or any change that materially shifts the privacy risk profile.
- **Distinction from PIPEDA and provincial laws** — the federal Privacy Act applies to the federal public sector only. Do not conflate it with PIPEDA (federal private-sector), Loi 25 (Quebec), FIPPA (Ontario), BC PIPA, or other provincial regimes. If the programme involves provincial or private-sector partners, those regimes layer on top and require their own assessments.
