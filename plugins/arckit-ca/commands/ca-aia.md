---
description: "[COMMUNITY] Generate a Canada Algorithmic Impact Assessment per the TBS Directive on Automated Decision-Making — Levels I–IV questionnaire scoring across the six dimensions, transparency notice, peer review trigger, human-in-the-loop design, recourse mechanism."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: risk
    description: AIA findings — bias, drift, contestability — feed the operational risk register.
  - command: adr
    description: Material AIA outcomes (vendor selection, autonomy tier, recourse design) warrant Architecture Decision Records.
  - command: ca-pia
    description: Personal-information feeding the algorithmic system inherits PIA controls; AIA depth must match PIA depth.
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

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a Canada Algorithmic Impact Assessment for an automated decision-making system in a federal entity.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ artefact (in particular any NFR-AI / NFR-DEC requirements covering automated decision-making, bias, contestability, or human override)
   - The project's `ARC-<id>-PIA-v*.md` (`ca-pia` artefact) where present — AIA depth must match PIA depth
   - The project's DR and DMOD artefacts (training-data lineage, decision boundary inputs)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-aia-template.md` (user override)
   - **Then**, `.arckit/templates/ca-aia-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-aia-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AIA --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **System Description** — purpose of the system, the specific decisions automated (or assisted), training-data lineage (sources, vintage, licensing), vendor / open-source provenance (model family, supplier, hosting jurisdiction), and the stewardship chain (owner, operator, accountable executive).
   - **Levels I–IV Questionnaire Scoring** — score each of the six dimensions (Project, System, Algorithm, Decision, Impact, Data) 0–N with evidence cited, then compute the overall Impact Level (I, II, III, or IV) per the TBS Directive's threshold matrix. Show the workings — the questionnaire output is the source of truth, not a self-declared level.
   - **Per-Level Mitigation Requirements** — apply the Directive's mandated mitigations for the computed Level, including:
     - Peer review (Level II/III/IV — internal at II, external at III/IV; named reviewers and lead time)
     - Notification (transparency notice — bilingual per `ca-ola`; published 30 days pre-launch for Level III/IV)
     - Human-in-the-loop design (override paths, escalation thresholds, training of reviewers)
     - Quality assurance plan (training/test data validation, ongoing monitoring, drift-detection cadence)
     - Recourse mechanism (appeal path to a human decision-maker; explanation rights for affected individuals)
   - **Algorithmic Risks Register** — bias (selection, label, deployment), drift (data and concept), proxy variables, contestability gaps, distributional fairness across protected grounds (sex, age, disability, race, religion, etc.), and consequence severity for affected individuals.
   - **Training-Data Provenance and Update Cadence** — provenance per dataset (source, licence, vintage), refresh cadence, drift-detection triggers, and the responsible steward for each dataset.
   - **Disclosure Plan** — publication of the AIA per the Directive's open-publication rule (the AIA is published unless a specific exemption applies). Note exceptions for national-security uses (cross-reference `ca-soia`) and any Protected B/C content that must be severed before publication.
   - **Reassessment Triggers** — material change to data, model, decision boundary, or operating environment. Include a periodic reassessment cadence (annual default, accelerated for Level III/IV systems).
   - **Open Items** — explicit list of unresolved questionnaire scores, pending peer-review nominations, or downstream artefacts that must be produced before launch.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The TBS *Directive on Automated Decision-Making* and the *Algorithmic Impact Assessment Tool* MUST appear in the Document Register with their primary URLs and the verification date.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the computed Impact Level, the headline mitigations triggered by that level, and any open peer-review or reassessment items).

## Authoritative anchor

TBS *Directive on Automated Decision-Making* (current version) and the *Algorithmic Impact Assessment Tool* (open-source TBS questionnaire). Authority: Treasury Board of Canada Secretariat. Primary URL: <https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32592> (Directive). The AIA tool is published on the Government of Canada's Open Government portal — link the current questionnaire release in the Document Register.

## Important notes

- **Levels I–IV are determined by score, not by self-declaration** — the questionnaire output across the six dimensions is the source of truth. Show the workings; reviewers will check the score-to-level mapping against the Directive's threshold matrix.
- **Level III and IV require external peer review** — engage academic / civil society reviewers; note the lead time. Internal peer review is sufficient only at Level II. Treating peer review as optional is a Directive breach.
- **Open publication is the default** — the AIA is published on the Open Government portal unless a specific exemption applies (e.g. national-security carve-out via `ca-soia`). Treat the public version as the authoritative version; sever Protected B/C content explicitly rather than withholding the whole document.
- **AIA is not a one-off** — re-trigger on material change to data, model, decision boundary, or operating environment. Schedule periodic reassessment (annual default; accelerated for Level III/IV systems). A static AIA produced at launch is not compliant with the Directive over the system's lifecycle.
- **Bilingualism is mandatory** — the transparency notice, recourse mechanism, and any individual-facing explanation must be available in both official languages per the Official Languages Act. Cross-reference `ca-ola`.
