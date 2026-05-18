# Australian Federal / DISP-supplier Overlay Guide

> **Overlay Origin**: Community-contributed | **Domain co-maintainer**: @royster70 | **ArcKit Version**: [VERSION]

The Australian Federal / DISP-supplier Overlay adds 8 community-contributed commands covering the eleven regulatory anchors that apply to Australian Federal entities and Defence-cleared suppliers (DISP Members). It is anchored on ASD Essential Eight + Information Security Manual, the DTA Digital Service Standard, the Privacy Act 1988 + 13 Australian Privacy Principles, the OAIC Notifiable Data Breach scheme, the Defence Industry Security Program (DISP, Levels 1–3), the Protective Security Policy Framework, the November 2025 Commonwealth Procurement Rules overhaul, the DTA AI Assurance Framework + Responsible AI Policy v2.0, the PGPA Act s16 financial-management duties, and IRAP for cloud-service assessment.

The overlay closes [#424](https://github.com/tractorjuice/arc-kit/issues/424). A sibling sector recipe `au-energy` covering AESCSF, SOCI Act CIRMP, and AER ring-fencing for energy-sector / SOCI-covered critical-asset operators is drafted in [#440](https://github.com/tractorjuice/arc-kit/issues/440) but held until a sector test fixture is in place.

---

## Purpose

Five jobs in one overlay:

1. **Make ASD's cyber stack a first-class architectural artefact**, not a security-team afterthought — Essential Eight maturity posture and ISM Statement of Applicability sit alongside requirements and HLD.
2. **Replace UK GDPR / DPA 2018 with Privacy Act 1988**, including the Tranche 1 reforms (December 2024) and the December 2026 AI-decision notification provisions.
3. **Replace UK GDS Service Standard with DTA Digital Service Standard** as the citizen-service quality gate.
4. **Make DISP Member self-attestation auditable** — the four DISP security domains (governance, personnel, physical, information & cyber) each get an evidence trail, plus FOCI declaration, supply chain, and annual board attestation.
5. **Ground AI delivery in DTA AI Assurance Framework v2.0** with explicit AI Accountable Officer designation and Privacy-Act-aligned automated-decision notification.

---

## When to Use

Use the overlay if any of the following apply to the project:

- The contracting authority is an **Australian Federal entity** (department, agency, statutory authority) or a Commonwealth-controlled corporate entity.
- The project handles **personal information** of Australian residents and is in scope of the **Privacy Act 1988** (APP entity threshold: $3M annual turnover or any health-service provider).
- The project provides services to the **Department of Defence** or its supply chain — **DISP membership** is required for Levels 1–3 supplier accreditation.
- The system is in scope of **PSPF** (Protective Security Policy Framework) — applies to all non-corporate Commonwealth entities under PGPA Act.
- The procurement is run under the **November 2025 Commonwealth Procurement Rules** overhaul (AUD 125k SME-only thresholds, AI transparency clauses, ethical conduct in VfM).
- The project includes AI/ML/LLM in scope and is subject to the **DTA AI Assurance Framework + Responsible AI Policy v2.0** (effective December 2025) and the **NAIC Essential AI Practices ("AI6")** operational guidance.

For non-AU projects the overlay is dormant: existing UK, MOD, EU, French, Austrian, UAE, and Canada overlays are unchanged.

---

## Prerequisites

Before running the commands, set the plugin userConfig values:

| userConfig key | Value |
|---|---|
| `governance_framework` | `AU Federal` |
| `classification_scheme` | `PSPF` (UNOFFICIAL → TOP SECRET ladder) |
| `organisation_name` | the Federal entity name (or the contracting Defence supplier name) |
| `default_classification` | one of `UNOFFICIAL`, `OFFICIAL`, `OFFICIAL:Sensitive`, `PROTECTED`, `SECRET`, `TOP SECRET` |

> **Note on rendering**: The PSPF classification taxonomy is applied to AU artefacts via a per-command override at the marker-resolution step (mirrors the Canadian-overlay pattern in `ca-pia.md:32`). Each `au-*` command instructs the resolver to swap the standard UK classification line for `UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET`, so the AU artefacts come out with PSPF rendering regardless of these userConfig values. The `governance_framework` and `classification_scheme` settings are still useful as documented intent (project records, downstream tooling, traceability), and a future enhancement (a dedicated `document-control-au.md` partial + extended `RENDERING.md` routing) will make them drive global rendering for **non-AU** artefacts produced inside an AU project too. Until then, set these for clarity but do not rely on them to switch the global Document Control header.

If you are a Defence supplier rather than a Federal entity, set `organisation_name` to your supplier name and use the `au-disp-attestation` command to produce the DISP Member self-attestation pack — the rest of the overlay still applies to the project itself, with the contracting Federal entity treated as the "system owner".

---

## The 8 Commands

### Security baseline

#### `/arckit.au-e8-posture`

Generates an ASD Essential Eight maturity posture assessment covering all 8 mitigation strategies (Application Control, Patch Applications, Configure MS Office Macro Settings, User Application Hardening, Restrict Administrative Privileges, Patch Operating Systems, Multi-factor Authentication, Regular Backups) at maturity levels ML0 through ML3. Anchored on the ASD Essential Eight Maturity Model. Handoffs: `au-ism-controls` (E8 maturity feeds ISM Domain 9 — System Hardening), `au-disp-attestation` (E8 ML2 evidence is primary input to DISP Domain 4 — Information & Cyber Security), and `au-aescsf` in the sibling `au-energy` recipe.

#### `/arckit.au-ism-controls`

Generates an ASD Information Security Manual Statement of Applicability across all 17 control domains (Cyber Security Roles & Responsibilities; Cyber Security Incidents; Outsourced Services; Security Documentation; Personnel Security; Physical Security; Communications Infrastructure; Communications Systems; Enterprise Mobility; Evaluated Products; Information Technology Equipment; Media; System Hardening; System Management; System Monitoring; Software Development; Database Systems & Servers; Network Security; Cryptography; Gateways; Data Transfers). ISM extends E8 — produces the comprehensive control set on top of the mitigation baseline. Handoffs: `risk` (gaps and treatment plan), `au-pspf` (Outcome 2 — information security — instantiated by ISM), `au-disp-attestation` (cross-refs Domain 4).

### Privacy + Incident Response

#### `/arckit.au-pia`

Generates a Privacy Impact Assessment under Privacy Act 1988 s33D (introduced by the Tranche 1 reforms, December 2024) including assessment against all 13 Australian Privacy Principles (APP 1 — Open and transparent management of personal information; APP 2 — Anonymity and pseudonymity; APP 3 — Collection of solicited personal information; APP 4 — Dealing with unsolicited personal information; APP 5 — Notification of collection; APP 6 — Use or disclosure; APP 7 — Direct marketing; APP 8 — Cross-border disclosure; APP 9 — Adoption / use / disclosure of government related identifiers; APP 10 — Quality of personal information; APP 11 — Security of personal information; APP 12 — Access to personal information; APP 13 — Correction of personal information). Replaces the UK `dpia` command for AU projects. Handoffs: `au-ndb-playbook` (NDB depends on PIA — APP 11 + Privacy Officer designation), `au-ai-assurance` (APP 1, 5, 10, 12 cross-refs for AI-decision notification per the December 2026 amendments), `data-model` (per-entity sensitivity), `risk`.

#### `/arckit.au-ndb-playbook`

Generates an OAIC Notifiable Data Breach scheme operational response playbook (Privacy Act Part IIIC). Documents the 30-day notification timeline, the eligible-data-breach assessment criteria, the OAIC reporting workflow, and the affected-individual notification template. Operational artefact — depends on `au-pia` because it requires the designated Privacy Officer (APP 1) and APP 11 control inventory from the PIA. Handoffs: `au-disp-attestation` (DISP incident reporting cross-refs NDB), `risk`.

### Service + AI compliance

#### `/arckit.au-dss`

Generates a DTA Digital Service Standard conformance assessment against all 13 criteria (1. Understand user needs; 2. Solve a whole problem; 3. Provide a joined-up experience; 4. Make it simple and intuitive; 5. Use ATO/digital-government building blocks; 6. Build a multidisciplinary team; 7. Iterate and improve frequently; 8. Use open standards; 9. Make it accessible and inclusive; 10. Test the service; 11. Measure performance; 12. Provide an unbroken digital service; 13. Use trusted hosting and supplier arrangements). Replaces the UK `tcop` command for AU projects (DTA DSS is the AU equivalent of UK TCoP). Handoffs: `au-e8-posture` (Criterion 13 cross-refs E8/IRAP-assessed hosting), `au-pia` (Criterion 7 cross-refs PIA + privacy notice).

#### `/arckit.au-pspf`

Generates a Protective Security Policy Framework outcomes scorecard against the 4 outcomes (Security Governance; Information Security; Personnel Security; Physical Security) and 16 core requirements. PSPF Outcome 2 (Information Security) is instantiated by `au-ism-controls` — the PSPF scorecard pulls from the ISM Statement of Applicability. Handoffs: `au-disp-attestation` (DISP Domain 1 — Governance — cross-refs PSPF Outcome 1; Domain 3 — Physical — cross-refs PSPF Outcome 4), `risk`.

#### `/arckit.au-ai-assurance`

Generates a DTA AI Assurance Framework baseline aligned to Responsible AI Policy v2.0 (effective December 2025), incorporating ISO 42001 readiness mapping, AI Accountable Officer designation, foundation-model selection and sovereignty, AI-use disclosure requirements, and Privacy Act AI-decision notification provisions (December 2026 commencement). Also covers **AU Essential AI Practices ("AI6")** — the National AI Centre's 6 essential practices for safe and responsible AI adoption (accountability / impact assessment / risk management / information sharing / testing-and-monitoring / human control), with each practice anchored to the canonical [ai.gov.au Foundations](https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-foundations) and [Implementation Guidance](https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-implementation-guidance) pages. Handoffs: `au-pia` (APP cross-refs for AI-decision notification), `au-e8-posture` (DLP cross-refs), `risk` (AI-specific risks), `adr` (AI/LLM provider decision is architecturally significant).

### DISP attestation (consolidation)

#### `/arckit.au-disp-attestation`

Generates a DISP Member self-attestation pack — the apex artefact for Defence-supplier scope. Consolidates the four DISP security domains (Governance & Personnel; Personnel Security; Physical Security; Information & Cyber Security) plus FOCI (Foreign Ownership, Control and Influence) declaration, supply chain assurance, and the annual board attestation. **Run last in the AU stream** — it pulls evidence from `au-e8-posture` (Domain 4), `au-ism-controls` (Domain 4 + cross-domain), `au-pia` + `au-ndb-playbook` (privacy alignment + incident reporting), and `au-pspf` (Domain 1 + Domain 3 cross-refs). Per the DISP framework, attestation level (1, 2, or 3) determines the rigour expected — Level 2 is the typical Federal-supplier baseline, Level 3 applies to higher-classification work.

---

## Build recipe

Recipe: [`au-federal.yaml`](../../arckit-au/recipes/au-federal.yaml)

35 targets across 9 build waves + 2 post-build hooks. The recipe swaps three commands from the `uk-saas` baseline (per maintainer guidance on #424):

- `arckit:tcop` → `arckit:au-dss` (DTA DSS replaces UK TCoP)
- `arckit:secure` → `arckit:au-e8-posture` (E8 ML2 replaces UK Secure-by-Design)
- `arckit:dpia` → `arckit:au-pia` (Privacy Act 1988 replaces UK GDPR/DPA 2018)

The wave shape mirrors `ca-federal-fitaa` — foundation → research wave + early domain artefacts → mid-domain → late ADRs → flagship → synthesis. `AU_DISP` is the consolidation flagship in W5, depending on `AU_E8`, `AU_ISM`, `AU_PIA`, `AU_NDB`, and `AU_PSPF` having completed in earlier waves.

To run:

```bash
# In a Claude Code session with the ArcKit plugin enabled:
/arckit:build <project-name> --recipe au-federal --plan      # wave-plan dry run
/arckit:build <project-name> --recipe au-federal             # full build
```

Reference test fixture: [`arckit-test-project-v44-australian-gov`](https://github.com/tractorjuice/arckit-test-project-v44-australian-gov) — the Australian Government PoC test repo.

---

## Migration from UK ladder

If you are migrating an existing UK-classified ArcKit project to the AU overlay:

1. Update plugin userConfig: switch `governance_framework` to `AU Federal`, `classification_scheme` to `PSPF`, and pick a `default_classification` from the PSPF taxonomy. (See the *Note on rendering* in Prerequisites — under the current per-command override approach these settings record intent; the AU artefacts get PSPF rendering through their own commands rather than via global routing.)
2. Re-run `/arckit:health` to validate the Document Control headers in any newly-generated AU artefacts against the PSPF ladder.
3. Replace UK-specific artefacts where AU equivalents exist:
   - `ARC-*-DPIA-*.md` → re-generate as `ARC-*-AUPIA-*.md` via `/arckit.au-pia`
   - `ARC-*-SECD-*.md` (Secure-by-Design) → re-generate as `ARC-*-AUE8-*.md` via `/arckit.au-e8-posture`
   - `ARC-*-TCOP-*.md` → re-generate as `ARC-*-AUDSS-*.md` via `/arckit.au-dss`
4. Add the Defence-supplier and Federal-entity-specific artefacts:
   - `/arckit.au-ism-controls` for ISM SoA
   - `/arckit.au-pspf` for PSPF outcomes scorecard
   - `/arckit.au-ndb-playbook` for NDB response
   - `/arckit.au-ai-assurance` if AI is in scope
   - `/arckit.au-disp-attestation` if Defence supply-chain accreditation is in scope
5. Run `/arckit:traceability` to refresh the cross-reference matrix.

---

## Co-maintenance

The overlay is currently solo-maintained by [@royster70](https://github.com/royster70). An Australian Federal enterprise architect (or DISP-cleared supplier architect) is being recruited as domain co-maintainer before the overlay can be re-evaluated for official-baseline promotion. If you have relevant Federal/DISP architecture experience and are interested in co-maintaining, [open an issue](https://github.com/tractorjuice/arc-kit/issues) or DM [@tractorjuice](https://github.com/tractorjuice).

---

## References

- [ASD Essential Eight Maturity Model](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight/essential-eight-maturity-model)
- [ASD Information Security Manual](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism)
- [DTA Digital Service Standard](https://www.dta.gov.au/help-and-advice/digital-service-standard)
- [Privacy Act 1988 (Cth)](https://www.legislation.gov.au/Details/C2024C00301)
- [OAIC Notifiable Data Breach scheme](https://www.oaic.gov.au/privacy/notifiable-data-breaches)
- [Defence Industry Security Program (DISP)](https://www.defence.gov.au/business-industry/programs/defence-industry-security-program)
- [Protective Security Policy Framework (PSPF)](https://www.protectivesecurity.gov.au/)
- [Commonwealth Procurement Rules](https://www.finance.gov.au/government/procurement/commonwealth-procurement-rules) (November 2025 overhaul)
- [DTA AI Assurance Framework + Responsible AI Policy v2.0](https://www.digital.gov.au/policy/ai/policy)
- [NAIC Essential AI Practices (AI6) — Foundations](https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-foundations)
- [NAIC Essential AI Practices — Implementation Guidance](https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-implementation-guidance)
- [PGPA Act 2013 s16](https://www.legislation.gov.au/Details/C2024C00310)
- [Information Security Registered Assessors Program (IRAP)](https://www.cyber.gov.au/about-us/programs-and-services/irap)
