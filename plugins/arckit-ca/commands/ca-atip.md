---
description: "[COMMUNITY] Generate a Canada ATIP reconciliation — Access to Information Act exemption mapping, Privacy Act §4–§8 use/disclosure register, severance design for hybrid public/protected systems, ATIP request workflow."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: data-model
    description: Severance rules in the ATIP reconciliation feed back into the data model's classification flags and access controls.
  - command: ca-pia
    description: Personal-information register from the Privacy Impact Assessment is the authoritative source for the §4–§8 use/disclosure register here.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel and the relevant departmental authority
> (ATIP coordinator, ITSEC officer, OCHRO language lead, CIO branch) before reliance. Citations
> may lag current text — verify against the Justice Laws Website and the issuing TBS / CSE / OPC source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a Canada ATIP (Access to Information / Privacy Act) Reconciliation for a federal entity.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, DR, and DMOD artefacts (if present)
   - The project's PIA artefact if present (`projects/<project-id>/ARC-<project-id>-PIA-v*.md`) — its personal-information inventory is the authoritative source for the Privacy Act §4–§8 register here
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-atip-template.md` (user override)
   - **Then**, `.arckit/templates/ca-atip-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-atip-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> ATIP --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **Information Holdings Inventory** — categorise every dataset / holding as Public, Protected, or Classified. Map each holding to its Personal Information Bank (PIB) where applicable, and identify the owner and lifecycle stage. The inventory MUST account for every data element that surfaces in the data model, not just personal information.
   - **Access to Information Act Mapping** — per holding, list applicable exemptions and explain why they apply:
     - §13 obtained in confidence (other governments / international organisations)
     - §14 federal-provincial affairs
     - §15 international affairs, defence, and national security
     - §16 law enforcement and investigations (including §16.1–§16.6 specific investigation contexts where relevant — e.g. §16.1 designated investigative bodies, §16.5 audits, §16.6 protected disclosures)
     - §19 personal information (refers across to the Privacy Act — note that §19 is not a blanket exemption; §8(2) routine-use disclosures may still apply)
     - §21 advice and recommendations to government
     - §23 solicitor-client privilege
     - §24 statutory prohibitions (Schedule II)
   - **Privacy Act §4–§8 Register** — table every collection, use, and disclosure with the corresponding Privacy Act section authority:
     - §4 lawful collection authority (relevant to an operating programme)
     - §5 direct collection (and the §5(2)/(3) exceptions where collection is indirect)
     - §7 use limited to the purpose of collection, or consistent use under §7(a)
     - §8 disclosure restrictions, with §8(2)(a) through §8(2)(m) routine-use letters individually analysed where invoked (do not aggregate dissimilar disclosures under one letter)
   - **Severance Design** for hybrid public/protected systems (e.g. registers carrying both a public transparency view and a protected investigative view — directly relevant to the FITAA arrangement register pattern):
     - Field-level severance rules (per field: which exemptions apply, what is masked, what is revealed)
     - Severance audit log schema (every redaction must be auditable: reviewer, exemption claimed, justification, output)
     - Re-identification risk analysis where public data could be combined with adjacent disclosures or open data to re-identify subjects, with mitigations
   - **ATIP Request Workflow** — the 30-day clock under §7 of the ATI Act, extension justifications under §9 (written notification with reasons and timeline), consultation under §27 (third-party notice), and publication of refusals. Include intake → triage → consultation → severance → release flow with SLA per step.
   - **Annual Report Mapping** — alignment to TBS InfoSource, the departmental ATI / Privacy annual report, and the Office of the Information Commissioner / Office of the Privacy Commissioner reporting cycle. Identify what feeds which report and on what cadence.
   - **Open Issues** — explicit list of unresolved exemption rationales, missing PIB updates, pending consultation responses, and any severance rules that remain `<TBC>`.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The Access to Information Act and the Privacy Act MUST appear in the Document Register with their primary URLs (Justice Laws Website) and verification dates. TBS directives and OIC / OPC guidance documents should be cited where relied on.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the headline exemption posture, the §8(2) letters in play, the severance design summary, and any open issues).

## Authoritative anchor

Access to Information Act (R.S.C., 1985, c. A-1) and Privacy Act (R.S.C., 1985, c. P-21). Authority: Office of the Information Commissioner (OIC) and Office of the Privacy Commissioner (OPC); Treasury Board Secretariat issues directives. Primary URLs: <https://laws-lois.justice.gc.ca/eng/acts/A-1/> and <https://laws-lois.justice.gc.ca/eng/acts/P-21/>.

## Important notes

- **Severance audit logs are mandatory** — every redaction must be auditable (reviewer, exemption claimed, justification, output). A severance regime without per-field audit trails will not survive an OIC investigation under §30 of the ATI Act.
- **The 30-day clock under §7 of the ATI Act is unforgiving** — extensions under §9 require written notification with reasons and a stated timeline. Failure to meet the clock or properly invoke §9 exposes the institution to OIC complaints under §30 and to Federal Court review under §41.
- **§19 (personal information) is not a blanket exemption** — disclosure under Privacy Act §8(2) may still be permissible (consent, routine use, public-interest disclosure under §8(2)(m), etc.). The §19 reflex must be tested against §8(2)(a)–(m), not asserted by default.
- **Public/protected hybrid systems are an ATIP-Act risk** — re-identification by combining a public register view with adjacent open data, or with protected-view metadata leaking through severance gaps, must be modelled, not assumed away. Cross-reference the FITAA arrangement register pattern where hybrid public/investigative views co-exist.
