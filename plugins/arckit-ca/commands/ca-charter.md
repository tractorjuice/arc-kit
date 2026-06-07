---
description: "[COMMUNITY] Generate a Canada Charter rights design review — s.2 (expression and association), s.7 (life, liberty, security of person), s.8 (search and seizure), s.15 (equality) — applying Oakes proportionality framing to system design with mitigation tracker and DOJ counsel sign-off block."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: ca-fitaa
    description: Charter §2 expression and association analysis is a mandatory companion to FITAA; the FITAA artefact references this review.
  - command: ca-pia
    description: §8 search-and-seizure analysis is grounded in the personal-information categories captured in the Privacy Impact Assessment.
  - command: risk
    description: Residual Charter risks per right feed the operational risk register with appropriate severity.
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

You are an enterprise architect generating a Canada Charter Rights Design Review for a federal system that materially engages Charter-protected interests.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ artefact (in particular any NFR-SEC, NFR-AI, NFR-DEC, or NFR-EQ requirements that touch protected speech, association, liberty, search/seizure, or differential impact)
   - The project's STKE artefact (subject populations, advocacy/journalism/diaspora stakeholders, protected-ground populations)
   - The project's `ARC-<id>-PIA-v*.md` (`ca-pia` artefact) where present — §8 reasonable-expectation-of-privacy analysis is grounded in the personal-information categories captured by the PIA
   - The project's `ARC-<id>-FITAA-v*.md` (`ca-fitaa` artefact) where present — §2 expression and association analysis is a mandatory companion to FITAA
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-charter-template.md` (user override)
   - **Then**, `.arckit/templates/ca-charter-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-charter-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> CHRT --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **Charter Engagement Surface** — which sections of the Charter are engaged by the system, with a one-paragraph reasoning per engaged section. The default engaged sections for FITAA-class apps are s.2(b), s.2(d), s.7, s.8, and s.15; mark "Not engaged" only with a stated justification.
   - **s.2 Analysis** (per sub-section where engaged):
     - 2(a) freedom of conscience and religion
     - 2(b) freedom of thought, belief, opinion, and expression — chilling effect on advocacy / journalism / academic inquiry
     - 2(c) freedom of peaceful assembly
     - 2(d) freedom of association — disincentive to legitimate civil-society engagement, diaspora communities
   - **s.7 Analysis** (where engaged) — life, liberty, and security of the person; principles of fundamental justice; identify any deprivation and the procedural safeguards in design.
   - **s.8 Analysis** (where engaged) — reasonable expectation of privacy; warrant requirement; production-order interfaces; relationship to the *Hunter v Southam* and *R v Spencer* lines.
   - **s.15 Analysis** — equality; protected grounds; differential-impact assessment; substantive equality test.
   - **Oakes Proportionality Analysis** for each engaged right — four-step:
     - Pressing and substantial objective
     - Rational connection to the means
     - Minimal impairment
     - Proportional effects (deleterious vs salutary)
   - **Mitigation Register** — per identified Charter risk, mitigation, residual.
   - **DOJ Counsel Sign-Off Block** — explicit field for departmental Justice counsel and the Department of Justice constitutional advisor where the risk warrants it; date and conditions of sign-off.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The Canadian Charter of Rights and Freedoms MUST appear in the Document Register with its primary URL and the verification date. Cite the key jurisprudence below where applicable.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the engaged Charter sections, the headline risks per right, and any open DOJ-counsel sign-off items).

## Authoritative anchor

Canadian Charter of Rights and Freedoms, Part I of the *Constitution Act, 1982*, Schedule B to the Canada Act 1982 (UK), c. 11. URL: <https://laws-lois.justice.gc.ca/eng/const/page-12.html>. Authority: Department of Justice (constitutional advisory). Key jurisprudence to cite where applicable: *R v Oakes* [1986] 1 SCR 103 (proportionality); *Hunter v Southam* [1984] 2 SCR 145 (s.8); *R v Spencer* [2014] 2 SCR 212 (s.8 in digital contexts); *Carter v Canada* [2015] 1 SCR 331 (s.7 framework).

## Important notes

- **DOJ counsel involvement is not optional** — anything beyond a routine internal-tooling review requires departmental Justice counsel sign-off; constitutional matters route to DOJ HQ constitutional advisors. A Charter design review without named counsel sign-off is not an artefact — it is a draft.
- **Oakes is structural, not narrative** — every engaged right must be analysed through all four steps (pressing-and-substantial objective, rational connection, minimal impairment, proportional effects). Partial proportionality analysis is a common review failure and a reliable rejection trigger at DOJ review.
- **Charter analysis evolves with technology** — *R v Spencer* expanded s.8 to digital subscriber identifiers and the s.8 jurisprudence continues to develop around metadata, cell-tower data, and platform-mediated communications. Treat technology-specific jurisprudence as binding and re-verify the most recent SCC decisions before publication.
- **Differential impact under s.15 is a substantive-equality test** — formal equality (everyone treated the same) is insufficient; test for disproportionate burden across protected grounds (race, national or ethnic origin, colour, religion, sex, age, mental or physical disability, plus analogous grounds recognised by the courts). A facially neutral design that lands harder on a protected group is a s.15 problem regardless of intent.
