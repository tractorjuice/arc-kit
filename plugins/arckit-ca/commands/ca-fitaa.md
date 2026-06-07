---
description: "[COMMUNITY] Generate a Canada FITAA (Foreign Influence Transparency and Accountability Act, Bill C-70 2024) compliance assessment — activity scoping, arrangement register design, public vs protected views, Commissioner liaison protocol, Charter §2 risk register."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: ca-charter
    description: Charter §2 expression and association analysis is required for any registration scheme that engages protected speech or association.
  - command: ca-pia
    description: Privacy Impact Assessment for personal information collected during arrangement registration.
  - command: ca-atip
    description: Reconciles the public-facing register against the protected investigative dataset; required severance design for hybrid views.
  - command: ca-aia
    description: Triggered when registration triage uses any automated decision-making, scoring, or risk classification.
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

You are an enterprise architect generating a Canada FITAA Compliance Assessment for a federal entity.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, STKE, DR, and DMOD artefacts (if present)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-fitaa-template.md` (user override)
   - **Then**, `.arckit/templates/ca-fitaa-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-fitaa-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> FITAA --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **Activity Scoping** — statutory triggers (covered arrangements with foreign principals to influence government / political processes / public discourse), excluded categories (journalism, academic research subject to standard exemptions), and a decision tree mapping the project's specific activities. Cite specific FITAA provisions where statute numbering is settled; mark as `<TBC at draft time>` where regulations are still pending.
   - **Arrangement Register Design** — data fields per registration (registrant identity, foreign principal, activity type, start/end dates, financial flows where required), public-facing fields (transparency objective), protected fields (national-security exemptions), and the 14-day update cadence for material changes.
   - **Registration Workflow** — submission channel (web / paper / both — bilingual per `ca-ola`), identity verification approach, acknowledgement and registration ID issuance, material-change update flow.
   - **Public Register vs Protected Investigative Data** — data flow diagram (textual or Mermaid), severance rules (cross-reference `ca-atip`), withdrawal/correction process.
   - **Commissioner Liaison Protocol** — interface with the Office of the Commissioner of Foreign Influence Transparency, reporting cadence (suspected non-registration, suspected falsification), RCMP / CSIS coordination touchpoints (cross-reference `ca-soia`).
   - **Charter Risk Register** (cross-reference `ca-charter`) — s.2(b) freedom of expression chilling-effect mitigations, s.2(d) freedom of association proportionality analysis, mitigation tracker.
   - **Compliance Schedule (registrant-side)** — arrangement triggers, the 14-day clock, penalty exposures (cite specific FITAA offence sections where settled; otherwise `<TBC>`).
   - **Open Items** — explicit list of statutory currency caveats: which regulations may post-date the artefact, which guidance from the Commissioner is still pending.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The Foreign Influence Transparency and Accountability Act (Bill C-70, 2024) MUST appear in the Document Register with its primary URL (Justice Laws Website) and the verification date.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the headline Charter §2 risk findings and any open statutory-currency items).

## Authoritative anchor

Foreign Influence Transparency and Accountability Act (FITAA), enacted June 2024 as part of Bill C-70 (An Act respecting countering foreign interference). Authority: Office of the Commissioner of Foreign Influence Transparency. Primary URL: <https://laws-lois.justice.gc.ca/> (search for the consolidated FITAA text).

The FITAA Regulations status MUST be flagged as "verified as of [date]" in the External References section because regulations are still being made — see the FITAA-specific banner above for the warning.

## Important notes

- **Do NOT confuse FITAA with the Lobbying Act or the Conflict of Interest Act** — those are separate transparency regimes with different scopes and registrars.
- **Charter §2 engagement is mandatory** — any registration scheme that captures advocacy, journalism, or political activity is presumptively engaging Charter §2(b) and §2(d). The `ca-charter` handoff is unconditional for FITAA outputs.
- **Public vs protected severance is not optional** — the public register and the investigative back-end must be designed as separate logical systems with audited severance rules; conflating them creates ATIP-Act exposure under §16 (law enforcement) and §15 (national security).
- **Statutory cite numbering** — where FITAA section numbers are not yet settled in the consolidated text, use `<TBC at draft time>` placeholders. The reviewer can fill these in once the consolidated text is published.
- **Bilingualism is mandatory** — the public-facing register, registration forms, acknowledgements, and notices must be available in both official languages per the Official Languages Act. Cross-reference `ca-ola`.
