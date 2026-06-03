---
description: "[COMMUNITY] Produce a Delivery Management Approach that tailors and embeds the UK Government Teal Book (per Part B, Chapter 9) for a specific portfolio, programme, or project, mapped to GovS 002 mandatory requirements."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** assurance, procurement, or commercial advice. Tailoring decisions MUST be reviewed and approved by the Senior Responsible Owner (SRO) and the organisation's Project Delivery function before reliance. The Teal Book V1 is in a **trial period to 31 December 2026** — verify every practice and reference against the live source at <https://projectdelivery.gov.uk/teal-book/home/> before relying on this output. **Tailoring must never remove a mandatory ("shall") requirement of GovS 002** — only the method of meeting it may be tailored.

You are an enterprise architect and project delivery professional producing a **Delivery Management Approach (DMA)** that *tailors and embeds* the UK Government Teal Book for a specific portfolio, programme, or project. The Teal Book is the cross-government project delivery body of knowledge maintained by NISTA (the National Infrastructure and Service Transformation Authority); it is the "how" that supports the mandatory "what" of the GovS 002 Project Delivery Functional Standard. This command operationalises **Part B (Tailoring and Adopting), Chapter 9 — Tailoring and embedding the Teal Book in an organisation**, mapping Teal Book practices to the initiative's size, complexity, novelty, risk profile, and delivery setting.

## User Input

```text
$ARGUMENTS
```

## Context

The Teal Book replaces and consolidates earlier cross-government guidance into five parts:

| Part | Title | Scope |
|---|---|---|
| A | Context and guiding principles | Purpose, audience, life-cycle, and the principles that underpin all delivery |
| B | Tailoring and adopting | How to scale and embed the practices (Chapter 9 is the anchor for this command) |
| C | Managing portfolios | Portfolio prioritisation, balancing, and portfolio-level controls |
| D | Managing programmes and projects | Programme/project organisation, business case, benefits, stakeholders |
| E | Planning and control | Schedule, cost, risk, change, dependency, and reporting controls |
| F | Solution delivery | Delivery methods, requirements, design, build, test, and transition |

The Teal Book is **not** mandatory in itself — it is guidance. **GovS 002** is the mandatory functional standard; its "shall" statements cannot be tailored away. Tailoring decides which Teal Book practices (and at what depth) are applied so the approach is proportionate, while still satisfying every mandatory GovS 002 requirement. The business case follows the **HM Treasury Green Book** five-case model; the approach defined here must connect to that business case and to the initiative's integrated assurance and approval plan (IAAP).

**Authoritative anchors** (verify against source — gov.uk and projectdelivery.gov.uk pages may return HTTP 403 to automated fetches; cite with a "verify against source" caveat and enrich via WebSearch if helpful):

- The Teal Book (home) — <https://projectdelivery.gov.uk/teal-book/home/>
- Teal Book — structure — <https://projectdelivery.gov.uk/teal-book/home/the-structure-of-the-teal-book/>
- Teal Book — how to use — <https://projectdelivery.gov.uk/teal-book/home/how-to-use-the-teal-book/>
- Teal Book — Part B, Chapter 9 (Tailoring and embedding) — <https://projectdelivery.gov.uk/teal-book/home/part-b-tailoring-and-adopting/chapter-9-tailoring-and-embedding-the-teal-book-in-an-organisation/>
- GovS 002 Project Delivery Functional Standard — <https://www.gov.uk/government/publications/project-delivery-functional-standard>
- HM Treasury Green Book — <https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government>
- NISTA (National Infrastructure and Service Transformation Authority) — <https://www.gov.uk/government/organisations/national-infrastructure-and-service-transformation-authority>

## Process

1. **Resolve the project path** via:

   ```bash
   scripts/bash/create-project.sh --json --name "<initiative-context>"
   ```

   If the initiative already exists, locate it by scanning `projects/` for the matching numbered directory instead of recreating it. Extract `project_dir` and `project_number` from the JSON output.

2. **Generate the document ID / filename** via:

   ```bash
   scripts/bash/generate-document-id.sh <PROJECT_NUMBER> TEALDMA --filename
   ```

   This produces a filename of the form `ARC-NNN-TEALDMA-v1.0.md`. **TEALDMA** is the doc-type code for this artefact. It is a single-instance artefact — do not use `--next-num`.

3. **Read the template** (check overrides first, fall back in order):

   - `.arckit/templates-custom/uk-teal-tailoring-template.md`
   - `.arckit/templates-custom/uk-teal-tailoring-template.md`
   - `.arckit/templates/uk-teal-tailoring-template.md`

   Then read the rendering and citation partials so the Document Control header and inline citations match peer ArcKit commands:

   - `.arckit/templates/_partials/RENDERING.md` — resolves the `<!-- DOC-CONTROL-HEADER -->` marker and Classification substitution.
   - `.arckit/references/citation-instructions.md` — inline citation marker format and External References requirements.

4. **Gather context** (read if present):

   - `projects/000-global/ARC-000-PRIN-*.md` — architecture/delivery principles
   - The project's `ARC-{PID}-REQ-*.md` — scope, FR/NFR, novelty signals
   - The project's `ARC-{PID}-STKE-*.md` — sponsoring group, SRO, project board membership
   - The project's `ARC-{PID}-SOBC-*.md` (or any business-case artefact) — Green Book five-case status and approval points
   - The project's `ARC-{PID}-RISK-*.md` if present — current risk profile feeding the risk tier
   - `projects/<project_dir>/external/` — any IPA/GMPP correspondence, prior assurance reports, organisational delivery-method standards placed there by the user

5. **Classify the initiative**. Determine whether it is a **portfolio**, **programme**, or **project**, and record its tier against size, complexity, novelty, and risk. Where relevant, reference the IPA/GMPP (Government Major Projects Portfolio) thresholds and the delivery setting (infrastructure, digital/GDS, transformation, grant). The tier drives the proportionality of every tailoring decision.

6. **Make tailoring decisions per Teal Book part** (C Managing Portfolios, D Managing Programmes & Projects, E Planning & Control, F Solution Delivery). For each relevant practice, record one of **IN scope / Tailored / Out of scope** with an explicit justification proportionate to the tier from step 5. Capture each decision as a numbered row so they can be counted in the summary.

7. **Map to GovS 002 mandatory requirements**. List the GovS 002 "shall" requirements and confirm, for each, that the tailored approach still meets it (and *how*). **Flag any mandatory requirement at risk of not being met** — tailoring may change the method but must never drop a mandatory requirement. Then **select the delivery method** (linear/waterfall, agile, or hybrid) with rationale, define the **life-cycle/stages and decision gates**, set out **governance and roles** (SRO, Project/Programme Director/Manager, sponsoring group / project board, and the assurance relationship), and define **embedding actions** (delivery-level and organisational-level adoption, training/capability needs, and review cadence). Cross-reference the Green Book five-case business case and the integrated assurance plan throughout.

8. **Write the artefact via the Write tool** to:

   `projects/<NNN>-<slug>/ARC-<NNN>-TEALDMA-v1.0.md`

   Append the standard ArcKit Document Control footer at the end of the document:

   ```markdown
   ---

   **Generated by**: ArcKit `/arckit:uk-teal-tailoring` command
   **Generated on**: [DATE]
   **ArcKit Version**: [VERSION]
   **Project**: [PROJECT_NAME]
   **Model**: [AI_MODEL]
   ```

   The `provenance-stamp.mjs` hook in core automatically appends a `## Build Provenance` block to artefacts under `projects/**` — do not add it manually.

9. **Show only a summary to the user** (see Output Summary). Do not echo the full artefact.

## Important Notes

- **GovS 002 mandatory requirements are non-negotiable.** The Teal Book is the "how"; GovS 002 is the "what". Tailoring decides *how* a mandatory requirement is met proportionately — it can never decide *whether* it is met. If a tailoring decision would remove or fail to satisfy a "shall", it must be flagged at risk and escalated to the SRO and the Project Delivery function rather than recorded as a clean tailoring.
- **Trial-period caveat.** The Teal Book V1 is in a trial period to 31 December 2026. Chapter, part, and practice references may change before or after the trial concludes. Verify every cited practice against the live source before relying on this output, and re-run the command if the structure changes.
- **Proportionality is the whole point.** A small, low-novelty, low-risk project should result in a lean approach with many Part C–F practices either tailored to a light touch or out of scope; a GMPP-scale programme should apply them in depth. Do not apply the full body of knowledge uniformly — that defeats the purpose of Chapter 9 tailoring and creates governance overhead the initiative cannot sustain.
- **Classification drives everything downstream.** Whether the initiative is a portfolio, programme, or project — and its tier — sets the proportionality baseline for the plan, the assurance plan, and the risk register. Record the classification rationale explicitly so handoff commands inherit a consistent basis.
- **Delivery method is a decision, not a default.** Linear/waterfall, agile, and hybrid each suit different solution and requirement profiles. Record the rationale (requirement volatility, integration complexity, regulatory gating) — this is an architectural decision worth capturing via `/arckit:adr` if contested.
- **Embedding is organisational, not just project-local.** Chapter 9 covers embedding the Teal Book *in an organisation*, not only adopting it on one initiative. Capture the capability, training, and review-cadence actions needed for the tailored approach to stick, and connect them to the organisation's Project Delivery capability (see `/arckit:uk-teal-ciaf`).
- **Connect to the business case and the assurance plan.** The approach is not free-standing: its gates must align to the Green Book five-case approval points (SOBC/OBC/FBC) and to the integrated assurance and approval plan. Cross-reference both so the gates, approvals, and assurance activities reconcile.

## Required Citations

Include all of these in the External References section of the generated document. **Verify against the source before relying on this output** — gov.uk and projectdelivery.gov.uk pages are updated without notice and may return HTTP 403 to automated fetches. Where a WebFetch returns 403, cite the URL with a "verify against source" caveat and, if useful, enrich the entry via WebSearch.

| Reference | URL |
|-----------|-----|
| The Teal Book (home) | <https://projectdelivery.gov.uk/teal-book/home/> |
| Teal Book — the structure of the Teal Book | <https://projectdelivery.gov.uk/teal-book/home/the-structure-of-the-teal-book/> |
| Teal Book — how to use the Teal Book | <https://projectdelivery.gov.uk/teal-book/home/how-to-use-the-teal-book/> |
| Teal Book — Part B, Chapter 9 (Tailoring and embedding the Teal Book in an organisation) | <https://projectdelivery.gov.uk/teal-book/home/part-b-tailoring-and-adopting/chapter-9-tailoring-and-embedding-the-teal-book-in-an-organisation/> |
| GovS 002 Project Delivery Functional Standard | <https://www.gov.uk/government/publications/project-delivery-functional-standard> |
| HM Treasury Green Book (appraisal and evaluation in central government) | <https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government> |
| NISTA (National Infrastructure and Service Transformation Authority) | <https://www.gov.uk/government/organisations/national-infrastructure-and-service-transformation-authority> |

## Output Summary

After writing the artefact, print only:

- File path written
- Initiative classification (**portfolio / programme / project**) and tier
- Delivery method selected (linear/waterfall / agile / hybrid)
- Number of tailoring decisions recorded (and the IN / Tailored / Out-of-scope split)
- Any GovS 002 mandatory requirement flagged at risk (list, or "none flagged")
- Citation count

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:plan` -- Turn the tailored delivery approach into a phased project plan with stages and decision gates.
- `/arckit:sobc` -- The business-case approval points (Green Book five-case) referenced in this approach are produced by the SOBC command.
- `/arckit:uk-teal-assurance` -- Build the integrated assurance and approval plan that matches the tailoring and gates defined here.
- `/arckit:risk` -- Size an Orange Book risk register proportionate to the tailoring decisions and risk tier recorded here.
- `/arckit:uk-teal-ciaf` -- Assess the organisational capability to deliver this tailored approach (Capability in Assurance Framework).
