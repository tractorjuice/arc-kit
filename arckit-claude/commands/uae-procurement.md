---
description: "Generate a federal procurement strategy under UAE Federal Decree-Law 11/2023. Produces ITT/RFP packs against the MoF Digital Procurement Platform templates, In-Country Value (ICV) plan, evaluation report structure, and contract register."
argument-hint: "<project ID or procurement scope>"
effort: high
handoffs:
  - command: evaluate
    description: The evaluation methodology produced here drives the formal supplier evaluation.
  - command: sobc
    description: Procurement strategy and ICV plan feed the Strategic Outline Business Case.
---

You are an enterprise architect generating a federal procurement strategy under UAE Federal Decree-Law No. 11 of 2023 on Procurements in the Federal Government.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, SOBC, RISK, and any prior procurement / vendor research artefacts (if present)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-procurement-template.md` (user override)
   - **Then**, `.arckit/templates/uae-procurement-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/uae-procurement-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh FPRO --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **Procurement Strategy** — scope, value bracket, route to market (open / restricted / direct award), use of framework agreements, justification for the chosen route under the Decree-Law, indicative timeline, and risks.
   - **ITT/RFP Pack Outline (DPP-aligned)** — sections of the Invitation to Tender / Request for Proposal pack aligned with the MoF Digital Procurement Platform (DPP) templates: cover page, instructions to bidders, scope of work, technical specification, mandatory and desirable requirements, ICV obligations, evaluation criteria and weights, contract terms, response forms.
   - **ICV Plan** — In-Country Value scoring criteria, target score for the procurement, supplier ICV evidence requirements, and the ongoing ICV reporting obligation post-award.
   - **Evaluation Methodology** — score model (technical / commercial weights), pass/fail thresholds, panel composition (including independence from the bidding pool), conflict-of-interest declarations, evaluation report structure.
   - **Contract Register Schema** — the columns the federal entity will maintain in the contract register: contract ID, supplier, value, term, ICV target/actual, performance KPIs, renewal trigger date, owner.
7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Federal Decree-Law No. 11 of 2023 MUST appear in the Document Register with its primary URL and the verification date.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the headline route to market, ICV target, and evaluation weights).

## Authoritative anchor

UAE Federal Decree-Law No. 11 of 2023 on Procurements in the Federal Government. Issuer: Ministry of Finance. Primary URL: <https://mof.gov.ae/wp-content/uploads/2024/01/Federal-Law-No.-11-of-2023-on-Procurements-in-the-Federal-Government.pdf>

## Important notes

- The MoF Digital Procurement Platform (DPP) is the mandatory transactional channel for in-scope federal procurements. Off-platform procurement requires explicit derogation — flag any plan that bypasses DPP.
- ICV is not optional for federal procurements. State the target score and the evidence regime — do not record "ICV will be considered".
- Direct-award routes require explicit justification under the Decree-Law (sole source, urgency, security). Where direct award is proposed, document the justification and the approver.
