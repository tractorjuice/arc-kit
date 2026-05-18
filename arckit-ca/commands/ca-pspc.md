---
description: "[COMMUNITY] Generate a federal Canadian procurement strategy — PSPC Supply Manual route selection, Standing Offer / AgileIQ / RFP analysis, Procurement Strategy for Indigenous Business (PSAB 5%), CFTA/CETA threshold mapping, security-clearance prerequisites and lead times."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: evaluate
    description: PSPC route selection feeds the vendor evaluation framework's scoring rubric.
  - command: sobc
    description: Procurement strategy feeds the Strategic Outline Business Case's procurement and commercial pillars.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel and the relevant departmental authority
> (ATIP coordinator, ITSEC officer, OCHRO language lead, CIO branch) before reliance. Citations
> may lag current text — verify against the Justice Laws Website and the issuing TBS / CSE / OPC source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a federal Canadian procurement strategy for a federal digital service.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ artefact (if present) — scope, value drivers, integration surface
   - The project's SOBC artefact (if present) — affordability envelope, commercial case, route hypothesis
   - The project's `ca-itsg-33` artefact if present — security control profile drives clearance posture and supplier security obligations
   - The project's `ca-cloud-residency` artefact if present — sub-processor analysis, residency and CSP shortlist where cloud is in scope of the procurement
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-pspc-template.md` (user override)
   - **Then**, `.arckit/templates/ca-pspc-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-pspc-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> PROC --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **Procurement Scope** — what is being procured: goods, professional services, cloud, software licences, managed services. Per item, capture description, estimated value range, term, and any extension options. Aggregate to a single estimated procurement value used downstream for threshold analysis.
   - **Threshold Analysis** — apply the *Canadian Free Trade Agreement* (CFTA) threshold matrix and the international agreements: CETA, CPTPP, and the WTO Agreement on Government Procurement (WTO-AGP). For each agreement: state the current threshold, whether this procurement value crosses it, the coverage scope (goods / services / construction / set-aside carve-outs), and the open-tendering obligation that attaches. Note any set-aside thresholds and trade-agreement carve-outs that allow a Procurement Strategy for Indigenous Business (PSAB) set-aside.
   - **Route Selection** — assess each candidate route. For each, list the fit, the risk posture, and the expected timeline:
     - **Standing Offer / Supply Arrangement** — e.g. SBIPS (Solutions-Based Informatics Professional Services), TBIPS (Task-Based Informatics Professional Services), ProServices, SA-AIDP (AI Data Profile), SA-Cyber. Confirm the instrument is current and that the service falls within its scope notice.
     - **AgileIQ / Agile Procurement Process** — when iterative scope and rapid award are required and the service can be expressed as a series of incremental task statements rather than a fixed scope.
     - **RFP / RFSO / RFSA bespoke** — when no Standing Offer or Supply Arrangement fits the scope, value, or evaluation model.
     - **Set-aside (PSAB)** — mandatory or voluntary set-aside under the *Procurement Strategy for Indigenous Business*, with reference to the supplier-pool sufficiency and the trade-agreement carve-out that permits the set-aside.
   - **Procurement Strategy for Indigenous Business** — 5% target plan: how this procurement contributes to the departmental rolling 5% target. Whether the procurement uses a mandatory set-aside (Indigenous-only competition), a voluntary set-aside, or a sub-contracting plan. Identify the supplier pool through Indigenous Services Canada's PSAB-registered supplier directory; document the contribution explicitly so the departmental return can roll it up. Note that the 5% is a department-level rolling target — any individual procurement contributes to it; no single procurement is judged in isolation.
   - **Security Clearance Requirements** — per role: Reliability Status / Secret / Top Secret / Top Secret SCI. For each role, capture the clearance level required, the holder count, the typical PSPC processing lead time (Reliability days–weeks; Secret weeks–months; Top Secret commonly 6–12+ months for new applicants; SCI longer), and the operational risk if clearance is the critical path. Where existing clearances can be reused or transferred, document that as a delivery accelerator.
   - **Evaluation Framework Outline** — high-level scoring dimensions: mandatory criteria (pass/fail, traceable to requirements), point-rated criteria (technical and approach, with weights), and financial. The detailed evaluation framework lives in `evaluate`; this section sets the dimensions and weight envelope so that downstream tool can populate the rubric.
   - **Bid Solicitation Schedule** — milestones from market notice through award: market engagement (RFI / Industry Day if applicable), draft solicitation, formal posting on CanadaBuys, bid-receipt window, evaluation, debriefing, standstill periods, contract award, and any post-award PSAB reporting milestones. Identify owners and dependencies for each.
   - **Risks** — including but not limited to: insufficient supplier pool (especially for set-aside or niche services), security-clearance bottleneck on critical path, threshold disputes with bidders, ITQ vs ITT vs RFP shape confusion, contract-award challenge under CFTA Chapter 5 / CITT, sub-processor residency conflict (cross-reference `ca-cloud-residency`), and OLA / accessibility obligations on the supplier delivery surface.
   - **Open Items** — outstanding decisions, pending instrument confirmations, deferred risk treatments, owners, and review dates.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The PSPC *Supply Manual*, the *Canadian Free Trade Agreement* (CFTA), CETA, CPTPP, the WTO Agreement on Government Procurement (WTO-AGP), the Indigenous Services Canada *Procurement Strategy for Indigenous Business*, and the Canadian International Trade Tribunal (CITT) procurement complaint regime MUST appear in the Document Register with their primary URLs and verification dates.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the recommended route, the binding trade agreements, the PSAB contribution posture, the longest clearance lead time on the critical path, and any open items that block solicitation posting).

## Authoritative anchor

PSPC *Supply Manual* (current edition); the *Canadian Free Trade Agreement* (CFTA); CETA, CPTPP, WTO-AGP; Indigenous Services Canada *Procurement Strategy for Indigenous Business*; the PSPC Standing Offers and Supply Arrangements catalogue. URL: <https://www.tpsgc-pwgsc.gc.ca/app-acq/sa-sm/index-eng.html> (Supply Manual). Authority: Public Services and Procurement Canada (PSPC); Canadian International Trade Tribunal (CITT) for procurement complaints.

## Important notes

- **Standing Offers are not "the easy button"** — they are still subject to CFTA / trade-agreement obligations and CITT review. Choose the instrument by fit to scope, value, and evaluation model, not by the convenience of an existing call-up mechanism.
- **PSAB 5% is a department-level rolling target, not per-procurement** — any individual procurement contributes to the departmental rolling target; document the contribution explicitly so the departmental return can roll it up. Treating each procurement as if it must individually hit 5% misreads the policy.
- **Security clearance is often the critical path** — Top Secret / SCI clearance can take 6 to 12 or more months for new applicants; budget accordingly and identify clearance-eligible incumbents who can deliver during the clearance window for new joiners.
- **CFTA thresholds change** — re-verify current thresholds at the verification date; thresholds adjust biennially and trade-agreement coverage evolves. A procurement designed against last year's thresholds can fall on the wrong side of an obligation when posted.
