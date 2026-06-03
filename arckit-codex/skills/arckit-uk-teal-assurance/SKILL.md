---
name: arckit-uk-teal-assurance
description: "[COMMUNITY] Generate an Integrated Assurance and Approval Plan (IAAP) aligning the project's business-case approval points to a coordinated, proportionate schedule of assurance activities (IPA/NISTA gateway reviews, three lines of defence) per the UK Government Teal Book and GovS 002."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** assurance or audit advice and **does not constitute an IPA/NISTA assurance review**. The plan produced here is a planning artefact only: it must be agreed with the SRO, the department's assurance function, and — for GMPP / major projects — NISTA before any reliance is placed on it. The UK Government **Teal Book V1 is in a trial period running to 31 December 2026** and may be revised; verify every reference against the live source at <https://projectdelivery.gov.uk/teal-book/home/> before use.

You are an enterprise architect and project-delivery assurance specialist generating an **Integrated Assurance and Approval Plan (IAAP)** for a UK central-government project or programme. An IAAP maps the project's **approval points** (the business-case decision points under HM Treasury's Green Book five-case model — SOBC → OBC → FBC — plus any portfolio, spend-control or HMT/NISTA approval gates) to a single, coordinated schedule of **assurance activities** so that assurance is proportionate to risk and value, joined up across providers, and timed to *inform* each key decision rather than duplicate effort.

## User Input

```text
$ARGUMENTS
```

## Context

The IAAP is the cornerstone of integrated assurance in UK government, set out in the **Teal Book** (the cross-government project-delivery body of knowledge), underpinned by **GovS 002 (the Project Delivery functional standard)** and operated through the **IPA/NISTA assurance and approvals regime**. Its purpose is to prevent the long-standing failure mode of uncoordinated, overlapping or mistimed reviews by sequencing all planned assurance — IPA Gateway Reviews (Gates 0–5), Project Assessment Reviews (PARs), Project Validation Reviews (PVRs), departmental internal audit, technical/architecture review, and commercial assurance — against the approval points the reviews exist to support.

**Authoritative anchors** (WebFetch of gov.uk may return HTTP 403 — cite with a "verify against source" caveat and use WebSearch to enrich; if WebSearch surfaces a current canonical "Integrated Assurance and Approval Plans" or "Gateway review" gov.uk guidance URL, add it to the citations):

- The Teal Book (home) — <https://projectdelivery.gov.uk/teal-book/home/>
- Teal Book — structure — <https://projectdelivery.gov.uk/teal-book/home/the-structure-of-the-teal-book/>
- GovS 002 Project Delivery Functional Standard — <https://www.gov.uk/government/publications/project-delivery-functional-standard>
- IPA / Cabinet Office — Assurance and approvals (collection) — <https://www.gov.uk/government/collections/assurance-and-approvals>
- HM Treasury Green Book — <https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government>
- NISTA (National Infrastructure and Service Transformation Authority) — <https://www.gov.uk/government/organisations/national-infrastructure-and-service-transformation-authority>

**Approval points ↔ assurance activities (typical mapping):**

| Approval point (Green Book) | Decision it supports | Typical aligned assurance |
|---|---|---|
| Strategic Outline Case (SOBC) | Programme start / strategic fit | Gate 0 (Strategic Assessment), Starting Gate / PVR |
| Outline Business Case (OBC) | Preferred option / investment decision | Gate 1 (Business Justification), Gate 2 (Delivery Strategy) |
| Full Business Case (FBC) | Investment / contract award | Gate 3 (Investment Decision) |
| Delivery / implementation | Readiness to deliver / go-live | Gate 4 (Readiness for Service) |
| Operation / benefits | Operational running / benefits realisation | Gate 5 (Operations Review and Benefits Realisation) |

**Three lines of defence (3LoD):**

| Line | Role | Examples in the IAAP |
|---|---|---|
| 1st | Management / delivery owns risk and control | Project team self-assessment, design reviews, stage-gate readiness checks |
| 2nd | Oversight & functional assurance | Departmental PMO / assurance function, commercial assurance, technical/architecture review, conformance assessment |
| 3rd | Independent assurance | Internal audit, IPA/NISTA Gateway Reviews / PARs, external review |

## Process

1. **Resolve the project path.** Run:

   ```bash
   scripts/bash/create-project.sh --json --name "<initiative-context>"
   ```

   If the project already exists, locate it by scanning `projects/` for the matching numbered directory instead of recreating it. Extract `project_dir` and `project_number` from the JSON.

2. **Generate the filename.** Run:

   ```bash
   scripts/bash/generate-document-id.sh <PROJECT_NUMBER> TEALIAAP --filename
   ```

   This produces a filename of the form `ARC-NNN-TEALIAAP-v1.0.md`. **TEALIAAP** is the doc-type code for this artefact. It is a **single-instance** artefact — do not pass `--next-num`.

3. **Read the template and partials** (check `.arckit/templates-custom/` first, then `.arckit/templates-custom/`, then fall back to the plugin copy):

   - `.arckit/templates-custom/uk-teal-assurance-template.md` → `.arckit/templates-custom/uk-teal-assurance-template.md` → `.arckit/templates/uk-teal-assurance-template.md`
   - `.arckit/templates/_partials/RENDERING.md` — resolves the `<!-- DOC-CONTROL-HEADER -->` marker and the Classification substitution
   - `.arckit/references/citation-instructions.md` — inline citation marker format and External References block requirements

4. **Gather context.** Read (if present):

   - `projects/000-global/ARC-000-PRIN-*.md` — architecture principles
   - `ARC-{PID}-REQ-*.md` — for scope, value drivers and NFRs that shape assurance focus
   - `ARC-{PID}-RISK-*.md` — the Orange Book risk register; the assurance schedule should target the highest residual risks
   - `ARC-{PID}-SOBC-*.md` and any OBC/FBC or business-case artefact — to extract the actual approval points, their dates, and approving authorities
   - any `ARC-{PID}-TEALDMA-*.md` delivery-management-approach artefact — for delivery stages and gate alignment
   - `ARC-{PID}-CONF-*.md` conformance artefact — as technical-assurance evidence feeding the schedule
   - `projects/<project_dir>/external/` — any departmental assurance policy, prior gateway/PAR reports, or NISTA correspondence placed there by the user

5. **Build the approvals map (§3).** Identify each approval point on the project's path: the business-case decision points (SOBC/OBC/FBC), and any portfolio board, spend-control, departmental investment committee, or HMT/NISTA approval gate. For each, record the decision it authorises, the approving authority, the expected date, and the evidence required.

6. **Build the integrated assurance schedule (§4)** as a table. For **each planned assurance activity** record: type (e.g. IPA Gateway Review 0–5 / PAR, PVR, internal audit, technical/architecture review, commercial assurance, conformance assessment), timing relative to the approval point and delivery stage, the **decision it informs**, the **line of defence (1st/2nd/3rd)**, the responsible body, and status. Ensure each major approval point has at least one aligned assurance activity *upstream* of the decision date.

7. **Build the three-lines-of-defence mapping (§5), the proportionality assessment (§6), the gateway/assurance readiness checklist (§7), and the action/recommendation tracker (§8).** For proportionality, determine the project's risk/value tier — reference GMPP / IPA risk tiering where relevant (e.g. low / medium / high; GMPP for major projects) — and scale assurance intensity accordingly, explaining the rationale. The readiness checklist enumerates the evidence and artefacts a review team will expect (business case, plan, risk register, RAID, benefits map, delivery confidence assessment, conformance evidence, etc.).

8. **Populate the External References section** per `.arckit/references/citation-instructions.md`. The Teal Book, GovS 002, the IPA/NISTA assurance-and-approvals collection, the Green Book, and NISTA MUST appear in the Document Register, each with a "verify against source" note where the URL could not be fetched.

9. **Write the artefact via the Write tool.** Create `projects/<project_dir>/assurance/` if it does not exist, then save to:

   `projects/<NNN>-<slug>/assurance/ARC-<NNN>-TEALIAAP-v1.0.md`

   Append the standard ArcKit Document Control footer at the end. The `provenance-stamp.mjs` hook in core automatically appends a `## Build Provenance` block to artefacts under `projects/**` — **do not add it manually**.

10. **Show only the summary** described under `## Output Summary`. Do not echo the full artefact.

## Important Notes

- **Assurance informs decisions; it does not replace them.** Every planned activity in the schedule must be timed *before* the approval point it supports, with enough lead time for findings to be actioned. An assurance review that lands after the decision it was meant to inform has failed its purpose — flag any such misalignment explicitly.
- **Proportionality is the governing principle.** The Teal Book and GovS 002 require assurance to be proportionate to a project's risk, value and complexity. Do not propose a full IPA Gateway sequence for a low-tier project, nor a single light-touch review for a GMPP major project. State the assumed tier and the rationale, and make clear that the final tiering is set by the department's assurance function / NISTA, not by this artefact.
- **Avoid duplicate and uncoordinated reviews — that is the whole point of the IAAP.** Where two activities would examine the same evidence (e.g. a departmental technical review and an architecture conformance assessment), say how their scope is deconflicted or combined. Reuse existing evidence (conformance, risk register, prior gateway reports) rather than commissioning fresh reviews.
- **GMPP / major-project status changes the regime.** If the project is (or is likely to become) a Government Major Projects Portfolio entry, the assurance and approval requirements are heavier (regular IPA reporting, mandated PARs, Delivery Confidence Assessments). Note this and flag for confirmation rather than assuming.
- **The three lines of defence must be genuinely independent at the third line.** Internal audit and IPA/NISTA reviews are third-line and must not be conflated with first-line self-assessment or second-line functional assurance. Map each activity to exactly one line and check the third line is real, independent assurance.
- **This is a living plan.** The IAAP is reviewed and updated at each approval point and whenever the project's risk profile, scope or schedule changes materially. Record the review cadence in Document Control and state that the plan must be re-agreed after major change.
- **Teal Book trial period.** Teal Book V1 is in trial to 31 December 2026. Terminology, gate names and structure may change; pin the version consulted and verify against the live source before reliance.

## Required Citations

Include all of these in the External References section of the generated document. WebFetch of gov.uk may return HTTP 403; where a URL could not be fetched, cite it with a "verify against source" caveat and corroborate via WebSearch. gov.uk and HM Treasury publications are updated without prior notice.

| Reference | URL |
|-----------|-----|
| The Teal Book (home) | <https://projectdelivery.gov.uk/teal-book/home/> |
| Teal Book — structure | <https://projectdelivery.gov.uk/teal-book/home/the-structure-of-the-teal-book/> |
| GovS 002 Project Delivery Functional Standard | <https://www.gov.uk/government/publications/project-delivery-functional-standard> |
| IPA / Cabinet Office — Assurance and approvals (collection) | <https://www.gov.uk/government/collections/assurance-and-approvals> |
| HM Treasury Green Book — appraisal and evaluation | <https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government> |
| NISTA — National Infrastructure and Service Transformation Authority | <https://www.gov.uk/government/organisations/national-infrastructure-and-service-transformation-authority> |

## Output Summary

After writing the artefact, print only:

- File path written
- Number of approval points mapped
- Number of planned assurance activities in the schedule
- Project risk/value tier assumed (and whether GMPP)
- Next assurance milestone (type + date)
- Citation count

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-risk` -- Assurance activities should target the highest Orange Book risks — cross-reference the project risk register so reviews focus on what matters.
- `$arckit-sobc` -- The IAAP schedules assurance around the business-case approval points (SOBC/OBC/FBC) — run sobc first if the business case is not present.
- `$arckit-plan` -- Align the planned assurance reviews to the project plan's stage gates and milestones.
- `$arckit-conformance` -- The architecture conformance assessment is a source of technical-assurance evidence feeding the IAAP schedule.
- `$arckit-uk-teal-ciaf` -- Assess the organisation's underlying assurance capability and integrated assurance framework maturity.
