---
description: "[COMMUNITY] Generate an Official Languages Act review — Parts IV (services), V (language of work), VI (federal language obligations); service-equivalence matrix EN/FR; bilingual public-facing surface; active offer; Translation Bureau pipeline; OQLF acknowledgement where federal-Quebec overlap applies."
argument-hint: "<project ID or service name>"
effort: high
handoffs:
  - command: ca-gc-digital-standards
    description: OLA service equivalence is a baseline expectation under the GC Digital Standards conformance scorecard.
  - command: service-assessment
    description: OLA review feeds the service assessment evidence base for bilingualism and active offer.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel and the relevant departmental authority
> (ATIP coordinator, ITSEC officer, OCHRO language lead, CIO branch) before reliance. Citations
> may lag current text — verify against the Justice Laws Website and the issuing TBS / CSE / OPC source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating an Official Languages Act review for a federal digital service.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ artefact (if present)
   - The project's service-assessment artefact (if present)
   - The project's `ca-fitaa` artefact if present (any public register triggers Part IV bilingual obligations)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-ola-template.md` (user override)
   - **Then**, `.arckit/templates/ca-ola-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-ola-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> OLA --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **Service Surface Inventory** — every user-facing surface that must be language-equivalent: screens, forms, notifications, error messages, public registers, accessibility statements, printed correspondence, IVR scripts, and social media. Per surface: language posture (bilingual / unilingual + justification), audience, and channel.
   - **Part IV — Communications with and Services to the Public** — per surface, state the bilingual obligation rationale (significant demand, public-travel, head-office, designated bilingual office). Active offer at first contact (greeting, signage, written initiation). Bilingual capacity at time of service.
   - **Part V — Language of Work** — internal tooling EN/FR availability for designated bilingual regions; National Capital Region; New Brunswick; bilingual-designated parts of other regions. Tooling supervision and language of supervision.
   - **Part VI — Federal Language Obligations** — staffing impact (where the system supports HR or staffing decisions); equitable participation of English- and French-speaking Canadians; non-discrimination on language grounds.
   - **Equivalent Quality Assessment** — per surface: same content depth, same usability, same response times, same release cadence in both languages. No "translation lag" releases.
   - **Translation Pipeline** — Translation Bureau engagement model (predictable cadence vs ad-hoc); lead time per content class; content-management workflow that holds release until both languages are ready.
   - **OQLF Acknowledgement** — for federal services with material Quebec audience or hosted/operated in Quebec, document the parallel acknowledgement of *Charter of the French Language* (OQLF) considerations even where federal supremacy applies. Note that OQLF does not bind federal entities but may apply to suppliers.
   - **Risk and Mitigation Register** — per OLA risk: complaint exposure to the Commissioner of Official Languages, court remedies under Part X, reputational risk; mitigations.
   - **Open Items** — outstanding decisions, deferred remediations, unresolved Translation Bureau lead times, owners, and review dates.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The *Official Languages Act*, *An Act for the Substantive Equality of Canada's Official Languages* (Bill C-13, 2023), the TBS *Policy on Official Languages*, and the *Directive on the Implementation of the Official Languages (Communications with and Services to the Public) Regulations* MUST appear in the Document Register with their primary URLs and verification dates.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the headline OLA posture per Part, top three remediation actions, any "translation lag" risks identified, and any surfaces where active offer is missing).

## Authoritative anchor

*Official Languages Act* (R.S.C., 1985, c. 31 (4th Supp.)), as amended by *An Act for the Substantive Equality of Canada's Official Languages* (S.C. 2023, c. 15). TBS *Policy on Official Languages* and the *Directive on the Implementation of the Official Languages (Communications with and Services to the Public) Regulations*. URL: <https://laws-lois.justice.gc.ca/eng/acts/O-3.01/>. Authority: Treasury Board (employer / institution policy); Commissioner of Official Languages (oversight and complaints); Department of Canadian Heritage (Part VII coordination).

## Important notes

- **Active offer is a verb, not a checkbox** — initiating contact in both official languages is the baseline; a passive bilingual sign does not satisfy active offer. The greeting, the screen, the IVR opening, and the written initiation must all extend the offer before the user has to ask.
- **Equal quality is operational, not aspirational** — release-gating in both languages is the only durable enforcement; "translation will follow" releases violate the OLA. Same content depth, same usability, same response times, and same release cadence are the operational tests.
- **Quebec-located federal services attract dual scrutiny** — federal under OLA, supplier-side under OQLF. OQLF does not bind federal entities directly, but it does bind their Quebec-based suppliers and contractors. Document both perspectives in the OQLF Acknowledgement section.
- **Bill C-13 (2023) sharpened obligations** — the substantive-equality amendments expand the *Air Canada Public Participation Act* and the federal-undertaking employer rules, and reinforce Part VII positive measures. Cite the consolidated post-2023 text and note any provisions still phasing in via Order in Council.
- **Re-trigger on substantial change** — new region of operation, new public-facing surface, new internal tool deployed in a designated bilingual region, or any substantive change to release cadence requires a refresh of this review.
