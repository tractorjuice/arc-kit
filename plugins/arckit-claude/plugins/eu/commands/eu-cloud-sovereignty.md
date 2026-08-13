---
description: "[COMMUNITY] Assess EU Cloud Sovereignty Framework (v1.2.1) posture for cloud procurement — score the eight sovereignty objectives and record SEAL-level evidence"
doc-type: EUCSF
argument-hint: "<project ID or cloud procurement description, e.g. '001', 'government-wide sovereign cloud tender for case-management SaaS'>"
effort: high
handoffs:
  - command: nl-cloud
    description: Assess the same service against Rijksbreed cloudbeleid 2026, which sets the Dutch policy obligations this framework measures sovereignty against
    condition: "Procurement is for a Netherlands central-government entity and no RBCLOUD assessment exists"
  - command: fr-secnumcloud
    description: Cross-check French SecNumCloud qualification alongside the sovereignty score for procurements with a French dimension
    condition: "Procurement includes France or French OIV/OSE-designated entities"
  - command: eu-nis2
    description: Map Security & Compliance Sovereignty (SOV-7) findings onto NIS2 Article 21 obligations
    condition: "Entity is in scope for NIS2 as an Essential or Important Entity"
  - command: risk
    description: Register unmet minimum SEAL levels and sovereignty gaps in the project risk register
    condition: "Gap analysis identifies objectives below the tender specification's minimum SEAL"
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / legal counsel before reliance. Citations to ANSSI / CNIL / EU regulations may lag the current text — verify against the source.

You are helping an enterprise architect generate an **EU Cloud Sovereignty Framework Assessment** for an organisation procuring, specifying, or evaluating cloud services against the European Commission's EU Cloud Sovereignty Framework (v1.2.1, October 2025). The framework supplements security assurance (SecNumCloud, EUCS, ISO 27001, etc.) with sovereignty-specific safeguards for cloud procurement, scored across eight weighted objectives and expressed on a five-level Sovereignty Effectiveness Assurance Level (SEAL) scale.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: cloud service type (IaaS/PaaS/SaaS), data sensitivity and classification, sovereignty-related NFRs (NFR-SEC-xxx), procurement context, member state(s) of operation
  - If missing: warn that a sovereignty assessment requires defined data sensitivity and cloud service scope

**RECOMMENDED** (read if available, note if missing):

- **RISK** (Risk Register) — Extract: existing cloud/hosting risks, supply chain risks, foreign-interference risks
- **SECNUM** (SecNumCloud Assessment) — Extract: security qualification status — SecNumCloud addresses security assurance; this framework addresses sovereignty specifically and the two are complementary, not interchangeable
- **PRIN** (Architecture Principles, 000-global) — Extract: cloud strategy, data sovereignty principles, foreign-dependency policy

**OPTIONAL** (read if available, skip silently):

- **NIS2** (NIS2 Compliance Assessment) — Extract: entity classification and Article 21 measures overlapping with SOV-7
- **DINUM** (DINUM Standards Assessment) — Extract: cloud doctrine evaluation already documented, for French entities
- **RBCLOUD** (Rijksbreed Cloudbeleid Compliance Assessment) — Extract: the materieel cloudgebruik determination and the risk assessment already recorded against the Dutch cloud policy, for Netherlands central-government entities. Where it exists, treat it as the authority on the Dutch policy position and do not restate it here

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract the **tender specification** (this is the only valid source of minimum SEAL requirements per objective — see Step 4), supplier self-declarations of SEAL level, existing cloud contracts
- Read any **global policies** in `000-global/policies/` — extract cloud strategy, data sovereignty policy, foreign-dependency risk appetite
- If no tender specification is found, note explicitly: "No tender specification located — minimum SEAL levels cannot be sourced from project documents; the contracting authority must set these separately."
- **Citation traceability**: When referencing content from external documents, follow `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`.

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the project doesn't exist:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md`
5. Set `PROJECT_ID` and `PROJECT_PATH`

### Step 2: Read Source Artifacts

Read all documents from Step 0. Identify:

- Assessment purpose: setting minimum SEAL levels for a tender specification, assessing a specific candidate service/supplier against the framework, or both
- Cloud/data processing service type and workload sensitivity
- Member state(s) and whether a national sovereignty programme (e.g. the Dutch NDS Cloudprogramma) applies
- Any existing supplier self-declared SEAL claims requiring verification

### Step 3: EU Cloud Sovereignty Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/eu-cloud-sovereignty-template.md` exists in the project root
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/eu-cloud-sovereignty-template.md`
- **Also read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — needed to resolve the `<!-- DOC-CONTROL-HEADER -->` marker in Step 5

### Step 4: Assessment Context and Minimum SEAL Determination

Before generating the assessment, determine:

1. **Assessment context**: is this document (a) defining minimum SEAL levels per objective for a forthcoming tender specification, (b) assessing an already-specified or candidate service against the framework, or (c) both?
2. **Minimum SEAL levels per objective**: read these **only** from the tender specification found in Step 0b. **Do not derive minimum SEAL levels from the framework itself — the framework does not fix them.** If no tender specification exists, mark every objective's minimum as "Not yet set by contracting authority" rather than inventing a value.
3. **Verification status of any existing SEAL claim**: if a supplier or service has self-declared a SEAL level, treat it as an **unverified claim** until this assessment records supporting evidence per objective (Step 5, Section 5).

Show this scoping summary before generating the full document.

### Step 5: Generate EU Cloud Sovereignty Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. **Generate the artefact filename**: Use `node scripts/generate-document-id.mjs <PROJECT_ID> EUCSF --filename` for the artefact filename. This returns `ARC-{PROJECT_ID}-EUCSF-v1.0.md` for a first assessment. If an assessment for this project already exists, pass the next version as the third positional argument — minor increment (e.g. `1.1`) for a routine refresh, major increment (e.g. `2.0`) if scope or minimum SEAL levels changed — and add a Revision History row instead of overwriting at v1.0.

2. **Auto-populate Document Control**:
   - Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before populating the fields below.
   - Document ID: `ARC-{PROJECT_ID}-EUCSF-v{VERSION}`
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}
   - Framework Version: EU Cloud Sovereignty Framework v1.2.1 (October 2025)

3. **Section 1: Procurement Context and Scope**
   - Assessment context from Step 4 (tender specification / candidate assessment / both)
   - Cloud service type, workload description, data sensitivity
   - Member state(s) and any applicable national sovereignty programme

4. **Section 2: Minimum Assurance Levels (Tender Specification)**
   - Table: objective (SOV-1 to SOV-8), Minimum SEAL required, Source
   - **Mandatory callout** stated plainly: minimum SEAL levels are set by the contracting authority in the tender specification as a Minimum Assurance Level — they are **not** fixed by the framework. A tender that does not consistently reach the required minimum across all objectives is rejected. This is the single most common misreading of the framework — do not let the document imply otherwise.

5. **Section 3: Sovereignty Score — Methodology and Result**
   - Reproduce the five SEAL level definitions in full (do not paraphrase or abbreviate):
     - **SEAL-0 No Sovereignty**: service, technology or operations under exclusive control of non-EU third parties, governed entirely in non-EU jurisdictions
     - **SEAL-1 Jurisdictional Sovereignty**: EU law formally applies with limited practical enforceability; service, technology or operations under exclusive control of non-EU third parties
     - **SEAL-2 Data Sovereignty**: EU law applicable and enforceable, with material non-EU dependencies remaining; under indirect control of non-EU third parties
     - **SEAL-3 Digital Resilience**: EU law applicable and enforceable, EU actors exercising meaningful but not full influence; under marginal control of non-EU third parties
     - **SEAL-4 Full Digital Sovereignty**: technology and operations under complete EU control, subject only to EU law, with no critical non-EU dependencies
   - State the formula: Sovereignty Score = Σ over the eight objectives of (Score(SOVn) / Max.Score(SOVn)) × Weight(SOVn), expressed as a percentage
   - Weight table for all eight objectives (must sum to exactly 100%)
   - Scored table: objective, Score, Max Score, Weight, Weighted Contribution
   - State clearly: the Sovereignty Score contributes to the tender's quality score as an **award criterion** — this is separate from, and does not override, the minimum-SEAL rejection gate in Section 2

6. **Section 4: Objective-by-Objective Assessment (SOV-1 to SOV-8)**
   - One subsection per objective, each with: weight, SEAL claimed vs. SEAL evidenced, an evidence table built from that objective's contributing factors (see reference list below), and identified gaps
   - Use the following contributing factors as the evidence-column basis for each objective — do not invent additional criteria:
     - **SOV-1 Strategic Sovereignty**: EU jurisdiction of bodies with decisive authority; assurances against change of control; EU-sourced financing; EU investment/jobs/value creation; ability to sustain operations against cessation, suspension, or vendor support withdrawal
     - **SOV-2 Legal & Jurisdictional Sovereignty**: governing national legal system; exposure to non-EU laws with cross-border reach (e.g. US CLOUD Act, Chinese Cybersecurity Law); channels through which non-EU authorities could compel access; applicability of international transfer/usage restrictions; jurisdiction of IP creation and registration
     - **SOV-3 Data & AI Sovereignty**: customer-only cryptographic access; auditability of data and AI model access, including verifiable irreversible deletion; strict EU confinement of storage/processing with no third-country fallback; extent of EU control over AI model and pipeline development, training, hosting and governance
     - **SOV-4 Operational Sovereignty**: migration ease to alternative EU-controlled solutions without lock-in; EU operator capacity to manage/maintain/support without non-EU vendor involvement; EU-based talent pool; EU-delivered operational support under EU legal frameworks; availability of documentation, source code, and know-how; jurisdiction and control of critical suppliers/subcontractors
     - **SOV-5 Supply Chain Sovereignty**: geographic source of physical parts and manufacturing location; jurisdiction/provenance of embedded hardware/firmware code; where and by whom software is architected, packaged, distributed and updated; reliance on non-EU vendors/facilities/proprietary technology; visibility and audit rights across the full supplier and sub-supplier chain
     - **SOV-6 Technology Sovereignty**: integration via well-documented non-proprietary APIs/protocols; adherence to publicly governed standards; open-licence accessibility with audit/modify/redistribute rights; visibility into architecture and data flows; EU independence in HPC, processors and accelerators
     - **SOV-7 Security & Compliance Sovereignty**: EU/internationally recognised certifications (ISO, ENISA schemes); adherence to GDPR, NIS2, DORA and other EU frameworks; SOC/response teams operating exclusively under EU jurisdiction; direct oversight of logs/alerts/monitoring; transparent EU-compliant breach reporting; independent EU patch development/testing capacity; independent EU security/compliance audits with full access
     - **SOV-8 Environmental Sustainability**: energy-efficient infrastructure with measurable improvement targets; circular-economy hardware practices; transparent carbon/water disclosure; renewable/low-carbon energy sourcing

7. **Section 5: Evidence Basis and Verification Status**
   - State plainly: **a supplier's self-declared SEAL is an unverified claim until the assessor records evidence per objective**. This document records an assessment; it does not certify.
   - State plainly: **there is no published EU list of assessed providers** — do not name any commercial cloud provider as sovereign, compliant, or achieving any SEAL level in this document
   - Assessor evidence log: objective, evidence reviewed, source, assessor, date

8. **Section 6: Member State Adoption Context**
   - Note the framework is being adopted as a national yardstick, using the Netherlands as the worked example: the Dutch "Notitie: Verkenning Overheidsbrede Soevereine Clouddiensten" (NDS Cloudprogramma, v1.0, 11 June 2026) adopts the framework as its sovereignty measure, publishes an official Dutch rendering of the SEAL levels, sets SEAL4 as the target for a government-wide sovereign cloud service, and applies SEAL on the demand side (a workplace requiring SEAL3 requires a cloud service reaching at least SEAL3)
   - Note the Dutch Herziening rijksbreed cloudbeleid 2026 cites the framework as the instrument for limiting the risk of foreign-government interference in supplier selection
   - For a Dutch entity, do not restate the cloud-policy obligations themselves — `/arckit-nl:nl-cloud` (`RBCLOUD`) covers Rijksbreed cloudbeleid compliance directly. Reference the RBCLOUD assessment if one exists, and otherwise point the reader at that command; this section stays scoped to how the sovereignty measure applies
   - If the project is not Dutch, note this section for context/comparison only and identify the relevant national programme if the user has supplied one

9. **Section 7: Gap Analysis and Remediation Plan**
   - Gaps against the minimum SEAL per objective (Section 2) — flag rejection risk explicitly where a gap exists against a stated minimum
   - Gaps against any target/aspirational SEAL if the user has stated one
   - Priority, owner, and timeline per gap

10. **Section 8: Recommendation**
    - State clearly this document is an assessment record, not a certification
    - Recommendation on next steps (e.g. legal/procurement counsel review, formal evidence collection, re-assessment cadence)

11. **Section 9: External References**
    - Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The EU Cloud Sovereignty Framework v1.2.1 MUST appear in the Document Register as a `Web URL` row — its primary URL in the **Filename** column and the publishing domain in **Source Location**, per the register's column semantics — with the date the URL was verified recorded in **Description**. Do not cite a URL you have not fetched in this session; if the framework could not be retrieved, say so in the Description rather than seeding a link.

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** pass.

Write the document to:

```text
projects/{project_id}/ARC-{PROJECT_ID}-EUCSF-v{VERSION}.md
```

### Step 6: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ EU Cloud Sovereignty Framework Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-EUCSF-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}
🧭 Framework Version: EU Cloud Sovereignty Framework v1.2.1 (October 2025)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Sovereignty Score
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sovereignty Score: {N}% (award-criterion contribution)

| Objective | Weight | SEAL Claimed | SEAL Evidenced | Min. SEAL (tender) | Meets Min.? |
|-----------|--------|-------------|-----------------|--------------------|-------------|
| SOV-1 Strategic Sovereignty            | 15% | {SEAL} | {SEAL} | {SEAL / not set} | {Y/N} |
| SOV-2 Legal & Jurisdictional Sovereignty | 10% | {SEAL} | {SEAL} | {SEAL / not set} | {Y/N} |
| SOV-3 Data & AI Sovereignty            | 10% | {SEAL} | {SEAL} | {SEAL / not set} | {Y/N} |
| SOV-4 Operational Sovereignty          | 15% | {SEAL} | {SEAL} | {SEAL / not set} | {Y/N} |
| SOV-5 Supply Chain Sovereignty         | 20% | {SEAL} | {SEAL} | {SEAL / not set} | {Y/N} |
| SOV-6 Technology Sovereignty           | 15% | {SEAL} | {SEAL} | {SEAL / not set} | {Y/N} |
| SOV-7 Security & Compliance Sovereignty | 10% | {SEAL} | {SEAL} | {SEAL / not set} | {Y/N} |
| SOV-8 Environmental Sustainability     |  5% | {SEAL} | {SEAL} | {SEAL / not set} | {Y/N} |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Verification status: {N} of 8 objectives evidenced; {N} remain unverified claims
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next steps:
1. {If Dutch central government: Run /arckit-nl:nl-cloud for Rijksbreed cloudbeleid 2026 compliance}
2. {If French dimension: Run /arckit-fr:fr-secnumcloud for security qualification cross-check}
3. {If NIS2 in scope: Run /arckit-eu:eu-nis2 to map SOV-7 onto Article 21}
4. Run /arckit:risk to register unmet minimum SEAL levels and sovereignty gaps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **Minimum SEAL levels come from the tender specification, not the framework**: the framework defines the eight objectives, their weights, and the five SEAL levels — it does not prescribe which minimum SEAL a given procurement must reach per objective. That is a Minimum Assurance Level set by the contracting authority. Confusing the two is the most common misreading; never state or imply a "framework-mandated minimum."
- **Two independent scoring mechanisms**: the weighted Sovereignty Score is an award criterion that contributes to the tender's quality score; the per-objective minimum SEAL is a pass/fail rejection gate. A high Sovereignty Score does not excuse failing a minimum SEAL on a single objective.
- **Self-declared SEAL is unverified until evidenced**: never present a supplier's or project's self-declared SEAL level as fact in the executive summary or anywhere else without flagging it as unverified pending the evidence log in Section 5.
- **No provider naming**: there is no published EU list of providers assessed against this framework. Do not name any commercial cloud provider as sovereign, compliant, or achieving a specific SEAL level anywhere in the generated document.
- **No vendor-analyst market reports**: do not cite Gartner or similar analyst research as a source for sovereignty claims, anywhere in the document.
- **SecNumCloud is complementary, not a substitute**: SecNumCloud (France) and EUCS address security assurance; this framework addresses sovereignty specifically (jurisdictional, supply chain, operational, and technology independence). A SecNumCloud qualification does not, by itself, establish a SEAL level.
- **Use Write Tool**: EU Cloud Sovereignty Framework assessments span eight weighted objectives with distinct evidence bases. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| EU Cloud Sovereignty Framework v1.2.1 (October 2025) | European Commission — Directorate-General for Digital Services | https://commission.europa.eu/document/download/09579818-64a6-4dd5-9577-446ab6219113_en |
| Notitie: Verkenning Overheidsbrede Soevereine Clouddiensten (NDS Cloudprogramma, v1.0, 11 June 2026) | Dutch NDS Cloudprogramma | https://www.tweedekamer.nl/downloads/document?id=2026D34382 |
| Herziening rijksbreed cloudbeleid 2026 (Kamerstuk 26643, nr. 1541, 3 juli 2026) | Ministerie van Economische Zaken en Klimaat — Staatssecretaris W.J.M. Aerdts | Kamerbrief: https://www.tweedekamer.nl/kamerstukken/brieven_regering/detail?id=2026Z15738&did=2026D35294 · Policy PDF: https://www.tweedekamer.nl/downloads/document?id=2026D35295 |
| GDPR full text (personal data intersection with SOV-3, SOV-7) | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2016/679/oj |
| NIS2 Directive (2022/2555) — full text (SOV-7 intersection) | EUR-Lex | https://eur-lex.europa.eu/eli/dir/2022/2555/oj |
| Data Act (Regulation 2023/2854) — full text (SOV-4/5 switching and supply chain intersection) | EUR-Lex | https://eur-lex.europa.eu/eli/reg/2023/2854/oj |
| SecNumCloud qualification scheme — official page (complementary security assurance, France) | ANSSI | https://cyber.gouv.fr/secnumcloud |

> **Note for reviewers**: The EU Cloud Sovereignty Framework (v1.2.1, October 2025) is a European Commission instrument that supplements security assurance schemes with sovereignty-specific safeguards for cloud procurement. It defines eight weighted sovereignty objectives (SOV-1 to SOV-8, weights summing to 100%) and five Sovereignty Effectiveness Assurance Levels (SEAL-0 to SEAL-4). The contracting authority computes a weighted Sovereignty Score used as a tender award criterion, and separately sets a minimum SEAL per objective in the tender specification as a rejection gate — the framework itself fixes neither. No published EU list of assessed providers exists; any SEAL claim is unverified until an assessor records objective-by-objective evidence. Member states are beginning to adopt the framework nationally — the Netherlands is the first documented example via the NDS Cloudprogramma.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-EUCSF-v{VERSION}.md`
- ✅ Assessment context determined (tender minimum-setting / candidate assessment / both)
- ✅ Minimum SEAL levels sourced only from a tender specification, or explicitly marked "not yet set" — never derived from the framework itself
- ✅ All eight sovereignty objectives (SOV-1 to SOV-8) present with their exact weights, summing to 100%
- ✅ Sovereignty Score computed with the stated formula and reported as an award-criterion contribution, distinct from the minimum-SEAL rejection gate
- ✅ All five SEAL levels (SEAL-0 to SEAL-4) used with the correct definitions
- ✅ Evidence table per objective drawn only from that objective's contributing factors
- ✅ Self-declared SEAL explicitly flagged as an unverified claim pending evidence
- ✅ No commercial cloud provider named as sovereign, compliant, or achieving any SEAL level
- ✅ No vendor-analyst market report (Gartner or similar) cited
- ✅ Member State Adoption section included with the Dutch NDS Cloudprogramma worked example
- ✅ Gap analysis distinguishes minimum-SEAL rejection risk from target-SEAL aspiration

## Example Usage

```text
/arckit-eu:eu-cloud-sovereignty Set minimum SEAL levels for a government-wide case-management SaaS tender, 001, data sensitivity high, target SEAL-4 per the NDS Cloudprogramma ambition

/arckit-eu:eu-cloud-sovereignty Assess sovereignty posture for a candidate IaaS service against a tender specification requiring at least SEAL-2 on every objective, evidence review requested before shortlisting

/arckit-eu:eu-cloud-sovereignty Sovereignty scoring for 001 — cross-reference SecNumCloud qualification status already documented, French public-sector hosting, no OIV designation
```
