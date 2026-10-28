---
description: "[COMMUNITY] Assess Rijksbreed cloudbeleid compliance — materieel cloudgebruik determination, clause 5.2/4.5 eligibility, risk assessment, and governance obligations for Dutch central government cloud use"
doc-type: RBCLOUD
argument-hint: "<project ID or cloud service description, e.g. '001', 'case management platform for a ministry'>"
effort: high
handoffs:
  - command: nl-tbb
    description: Determine the TBB category for the data in scope before finalising the clause 5.2 eligibility check
    condition: "TBB category not yet determined for the data processed by this system"
  - command: nl-exit
    description: Produce the mandatory clause 3.2 exit plan once materieel cloudgebruik is confirmed
    condition: "Materieel cloudgebruik determined and no exit plan exists yet"
  - command: nl-bio
    description: Assess BIO2 conformance for the hosting environment and security controls
    condition: "BIO2 baseline assessment not yet documented for this system"
  - command: risk
    description: Integrate cloud sovereignty, foreign-interference, and provider-concentration risks into the risk register
    condition: "Risks identified in this assessment are not yet reflected in ARC-*-RISK"
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---


> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified counsel, the departmental CISO, and CISO Rijk before reliance. Citations to Dutch government policy, VIRBI 2025, and EU instruments may lag the current text — verify against the source.

You are helping an enterprise architect generate a **Rijksbreed Cloudbeleid Compliance Assessment** for Dutch central government (Rijksoverheid) cloud use. The Herziening rijksbreed cloudbeleid 2026 (Ministerie van Economische Zaken en Klimaat, 3 July 2026, definitief) is the governing policy — it applies to all central government except the Hoge Colleges van Staat, and the Ministry of Defence is explicitly exempt. Existing cloud use gets a four-year transition; exit plans must be produced within twelve months.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### Step 0: Read existing artifacts from the project context

**MANDATORY** (warn if missing):

- **REQ** (Requirements) — Extract: data sensitivity, hosting requirements, security NFRs (NFR-SEC-xxx), integration requirements (INT-xxx), any prior TBB or BIO2 references
  - If missing: warn that the eligibility determination (Section 3) requires a defined data classification

**RECOMMENDED** (read if available, note if missing):

- **TBB** (Te Beschermen Belangen determination, from `/arckit-nl:nl-tbb`) — Extract: TBB category and BIV scores. Use this directly; do not re-derive a TBB category inside this command.
- **BIO2** (BIO2 Conformance Assessment, from `/arckit-nl:nl-bio`) — Extract: existing conformance status relevant to the cloud environment
- **RISK** (Risk Register) — Extract: existing cloud/hosting risks, third-party risks, foreign-interference risks
- **PRIN** (Architecture Principles, 000-global) — Extract: cloud strategy, data sovereignty principles

**OPTIONAL** (read if available, skip silently):

- **DPIA** — Extract: personal data processing details relevant to Section 2.2
- **SECD** (Secure by Design) — Extract: security controls relevant to cloud hosting

### Step 0b: Read external documents and policies

- Read any **external documents** in `external/` — extract prior cloud risk assessments, CISO Rijk correspondence, existing provider contracts
- Read any **global policies** in `000-global/policies/` — extract cloud strategy, data classification policy
- If no external cloud documentation exists, note: "No external cloud documentation found — assessment will be based on requirements and user input."

### Step 1: Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number
2. Calculate the next number (zero-padded to 3 digits)
3. Slugify the project name (lowercase, hyphens)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with project name, ID, and date
5. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### Step 2: Read Source Artifacts

Read all documents from Step 0. Extract and note the TBB category (if determined), data categories, and any existing provider under consideration for use in the assessment.

### Step 3: Template Reading

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/nl-cloud-template.md` exists in the project root, then `.arckit/templates/nl-cloud-template.md`
- **If found**: Read the user's customized template
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/nl-cloud-template.md`

Also read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` — the template's `<!-- DOC-CONTROL-HEADER -->` marker is resolved against these rules before the artefact is written (see Step 13).

### Step 4: Materieel Cloudgebruik Determination (clause 4.1)

Determine whether this is **materieel publiek cloudgebruik**:

1. Is the use for the organisation's primary or core task?
2. Does it involve large-scale processing of personal data?

If either holds, treat the use as materieel — clauses 3.1 (risk assessment), 3.2 (exit plan), 3.3 (notification), and 3.4 (register) all apply. If neither holds, record the rationale for the lighter-touch determination; do not skip the write-up.

### Step 5: Risk Assessment (clause 3.1)

1. **Integral risk assessment**, required for materieel cloudgebruik, based on the BIV/TBB classification (pull from `/arckit-nl:nl-tbb` output if available; if not available, warn and proceed on user-supplied classification)
2. Weigh the five aspects clause 3.1 lists, besides the regular topics of security, continuity and privacy:
   1. The characteristics of the cloud use — the main provider and any sub-providers, the type of service (public / private / hybrid / community cloud), and the geographic region where data are processed and stored
   2. The provider's role in security and continuity, and how it is assured
   3. How it is arranged that the provider admits audit and accountability investigations (controle- en verantwoordingsonderzoeken), or reports on them
   4. The risk of interference by a foreign government with confidentiality and availability — this must be explicitly weighed and mitigated as far as possible
   5. The risk that the provider abuses a large supplier dependency, for example by forcing unwanted technology choices or commercial conditions

   Clause 3.1 also requires that the implementatiekader is followed (Step 5a), that residual risk is documented and formally accepted within the organisation, that the responsible bestuurder's decision is traceable and auditable ("toetsbaar en auditeerbaar"), and that mitigations depending on what the provider must do (or not do) are written into the contract
3. **Pre-scan DPIA / Full DPIA** — required where personal data are processed. Under implementatiekader Art. 8 the pre-scan shows at least (a) a description of the processing: the types of personal data (content, telemetry, diagnostic, website and helpdesk data), the size of the data set and of the processing, the data subjects and the process supported; (b) the user groups, including those who take the service and those who receive the information; (c) a reasoned conclusion on whether a formal DPIA is needed. The kader expects a DPIA to be needed almost always for materieel cloudgebruik. A formal DPIA uses the government-wide (rijksbrede) model and is formally adopted under the departmental mandateringsregeling. If no formal DPIA is done, record how the privacy requirements are met, the assessment that the measures work, and the (low) residual risks
4. **DTIA** — required where data transfer to a third country without an adequacy decision is in scope, following EDPB Recommendations 01/2020; special categories of personal data call for extra restraint (implementatiekader Art. 8.4)

### Step 5a: Implementatiekader Risicoafweging Cloudgebruik

Clause 3.1 says the implementatiekader "moet hierbij worden gevolgd" and calls it the *implementatiekader risicobeheersing cloudgebruik*. The document's own title is **Implementatiekader risicoafweging cloudgebruik**: version 1.1, 5 January 2023, adopted by the ICBR on 20 December 2022 and maintained by CIO Rijk (bijlage to Kamerstuk 26 643, nr. 964). It is mandatory ("Beleid en verplicht"). Don't confuse it with the optional *Handreiking risicobeheersing toepassing public cloud*.

Version 1.1 was written for the 2022 cloud policy. The Kamerbrief of 3 July 2026 and the answers to Kamervragen of 29 September 2026 say it will be revised to match the 2026 policy. Check whether CIO Rijk has published that revision; if it has, use it and record its version. Until then, apply v1.1. Its Arts. 11–13 cite numbered voorwaarden of the 2022 policy; where one of them no longer fits the 2026 text, follow the 2026 clause on the same point (3.3, 3.4, 4.6 or 5.4) and say so. Art. 15 says to ask CIO Rijk for advice on correct application, and to consult CIO Rijk if the department cannot comply (for example because an analysis contains information that may not be shared).

v1.1 applies to materieel public cloudgebruik by the Rijksdienst, to hybrid cloud where relevant, and is advised but not mandatory for private cloud (Art. 1a). Record:

1. **Roles (Art. 3a, RACI table)**: the process owner (proceseigenaar) is Responsible for the risk analysis, the (pre-scan) DPIA and any DTIA, the C2000 assessment, the exit strategy, processing (special categories of) personal data or basisregistraties in the cloud, and recording and reporting materieel cloudgebruik. The departmental Bestuursraad is Accountable, or the delegate (gedelegeerde) the department names in its cloud policy or mandateringsregeling ("A (R)" in the table). Consulted: SLM Rijk / inkoop on the risk analysis, the DPIA and the exit strategy; the FG on the DPIA and on personal-data processing, and the PAR as well for rijksbrede voorzieningen; AIVD and/or MIVD on the C2000 criteria; CIO Rijk on basisregistraties. CIO Rijk is informed of the materieel cloudgebruik records and, in brackets in the table, of personal-data processing
2. **Method (Art. 4.1–4.2)**: the analysis follows the organisation's formally adopted risk-management methodology under the BIO and is done before the service is used. SLM Rijk is consulted so that earlier analyses can be reused and, where possible, a joint approach taken
3. **Contents of the risk analysis (Art. 4.3)**: at least
   - (a) the context and characteristics: intended benefits, the choice of main provider and its sub-suppliers, the service model (IaaS / PaaS / SaaS), the sensitivity of the data, and the region of processing and storage
   - (b) the relevant risks: the C2000 criteria (Step 7), the NBV public-cloud risk scenarios (item 4) and a comparison with on-premise processing; risks to the safety of people who face extra risk if their personal data leak (the kader's examples are members of the government, well-known public figures, intelligence staff, and witnesses and lawyers in major criminal trials); and continuity risks, including for the performance of tasks
   - (c) the technical and organisational measures, showing that the organisation's own implementation, the service and the provider meet the information-security requirements, having regard to chapter 15 of the BIO. This covers the provider admitting accountability investigations (verantwoordingsonderzoeken) or reporting on them, a description of the exit strategy (Step 12), and how the provider assesses its own suppliers for chain risks
   - (d) an assessment of the measures' design and existence (opzet en bestaan) and, from the first update, their operating effectiveness (werking)
   - (e) the judgement that the risks are sufficiently mitigated, with the residual risks and how they are safeguarded
4. **NBV risk scenarios (Bijlage 2)**: the NBV (part of the AIVD) advises damage-limitation and disaster-recovery plans for at least these six scenarios: (1) a (state) actor has compromised the government tenant and had access to the data for a long time; (2) a (state) actor has compromised the provider's cloud fabric and had long-term access to the tenant and the data; (3) the provider's country has gained access to the tenant and its data through extraterritorial legal powers; (4) the provider's country, or another country, has put political or commercial pressure on the provider, raising suspicion of espionage or sabotage; (5) the service is down for a long time through failure or sabotage, including countries sabotaging or blocking it on their territory, which affects government posts abroad; (6) the provider ends the tenant contract or the whole service, under pressure from its own or another country or not. The analysis also takes into account the coupling between the on-premise environment and the public cloud (complexity and a larger attack surface) and state actors' interest in personal data, including large data sets and basisregistraties
5. **Main-provider selection (Art. 5)**: the necessity (subsidiarity) of the cloud use; privacy conditions, negotiated in advance; and frameworks for public values such as open source, human rights and sustainability. Record how these were weighed. This does not mean naming or endorsing a provider as compliant
6. **Formal adoption (Art. 4.4, Art. 1c)**: the risk analysis is formally adopted (vastgesteld) under the cloud policy and the departmental mandateringsregeling. Decisions, risk acceptance, supervision and monitoring follow the regular arrangements: ministerial responsibility, the mandateringsregeling, the CIO-stelsel and the BVA-stelsel. Record who adopted the analysis and accepted the residual risk, and when
7. **Review (Art. 9)**: the risk analysis, the exit strategy and the DPIA are updated when the service or its risks change materially, and at least every three years. If they were shared with CIO Rijk, the updated versions are shared again. Clause 3.2 asks more of the exit plan: an annual review

### Step 6: Eligibility Determination (clauses 5.2, 4.5, 5.4)

This is the section a reader of this assessment will look for first — do not leave it implicit.

1. **Clause 5.2 prohibition check**: Pull the TBB category for the data in scope, and any existing rubricering the `/arckit-nl:nl-tbb` determination records (it records a marking; it never assigns one). Public cloud is **prohibited** for staatsgeheim gerubriceerde informatie and for Te Beschermen Belangen niveau 1, 2, and 3. The implementatiekader adds that the prohibition covers NATO information above NATO RESTRICTED (Art. 1f). If the TBB category is not yet known, state that explicitly and recommend running `/arckit-nl:nl-tbb` before the assessment can be finalised — do not guess a category.
2. **Clause 4.5 email/file-storage conditions**: If the service in scope is email or document/workplace/file storage, assess all **three cumulative conditions** individually — (a) it is independently established that continuity of service is otherwise at risk, (b) a risk analysis and exit plan have been produced and tested under this policy, (c) the decision is agreed by the responsible minister in agreement with the bewindspersoon voor digitalisering. All three must hold; do not treat partial satisfaction as eligible.
3. **Clause 5.4 basisregistraties**: If the system holds or sources basisregistratie data, state that basisregistraties are not (solely) held in public cloud inside or outside the EEA, and that source data are not managed in public cloud. Implementatiekader Art. 12, written for the 2022 policy's basisregistraties rule, has CIO Rijk advise before a basisregistratie is stored or processed in public cloud: the request goes to CISORijk@minbzk.nl with an explain (why cloud use is necessary, the risk analysis and, where personal data are processed, the DPIA, any DTIA and the residual privacy risks), and the kader asks for a month after all documents are delivered. Existing public-cloud use by a basisregistratie or its sources is reported to CIO Rijk as soon as possible.
4. **No provider qualification list**: State explicitly that, unlike some other jurisdictions, there is no published Dutch cloud-provider qualification list. Do not name, shortlist, or imply that any specific commercial cloud provider is compliant or qualified.

### Step 7: Cybersecurity Requirements (clause 4.2)

Assess against C2000 criteria, ABRO, and whether threat and security advice has been obtained from AIVD and/or MIVD.

The implementatiekader sets out the C2000 criteria (Bijlage 1) and says they are assessed together, as complementary (Art. 6.1):

1. Does the provider come from, or is it controlled by a party from, a country whose laws oblige companies to cooperate with its government, in particular bodies with an intelligence or military task — or is it a state company?
2. Does it come from a country with an active offensive intelligence programme aimed at the Netherlands and Dutch interests, or one with which relations are so strained that action against Dutch interests is conceivable?
3. (A) Does it get extensive access to sensitive locations, sensitive ICT systems or vital infrastructure, where misuse could be a national-security risk? (B) Are control measures possible and achievable that sufficiently protect the national-security risks at stake?

Where the criteria raise risks, threat and security advice is obtained from AIVD and/or MIVD in time (Art. 6.2). Where national-security risks cannot be sufficiently controlled (criterion 3B), such parties are excluded where possible (Art. 6.3).

### Step 8: Critical or Essential Entity Considerations (clause 4.3)

Determine whether the organisation is a designated vitale aanbieder, falls under the Wwke, or is in the Cbw essential-entity category, **and** whether the supplier for its primary process falls wholly or partly under non-EU/EEA jurisdiction. Where both hold, public cloud use is discouraged ("afgeraden") — this is guidance, not a prohibition; document the risk-acceptance rationale if the organisation proceeds anyway.

### Step 9: Openbaarheid / Woo (clause 4.4)

Note that the risk analysis and exit plan are subject to Woo publication of relevant decision-making, and that the risk analysis and exit plan may themselves carry a rubricering that withholds publication. Implementatiekader Art. 10: the owner publishes the decision-making, including on the DPIAs and any PAR advice, no later than three months after the service goes into use.

### Step 10: Data Location and Encryption (clause 4.6)

Assess storage and processing location (EEA plus Switzerland — this does **not** extend to Caribisch Nederland), encryption at rest, in transit, and possibly in processing, key management custody (preferably not held by the cloud provider), and the posture for special categories of personal data (preferably not in public cloud; if unavoidable, additional measures such as Privacy Enhancing Technologies).

### Step 11: Governance Obligations (clauses 3.3, 3.4)

1. **Melding en beoordeling**: prior notification to CISO Rijk before implementation, and any aanwijzingen (directions) CISO Rijk has issued
2. **Gekend gebruik**: registration of material public-cloud use and the annual report to CIO Rijk, including the chosen provider. Implementatiekader Art. 13: the record holds at least the organisational unit, the business process and its responsible line manager, the risks (through a current risk analysis and DPIA), and the provider and the cloud services taken. It is updated at material change and at least annually, and the annual report to CIO Rijk goes through the information-security (IB-beeld) reporting cycle

### Step 12: Exit-Plan Cross-Reference (clause 3.2)

State that an exit plan is mandatory, documented, self-tested, covers two scenarios (planned exit; disruptive interruption of service), addresses destruction of data at the provider after migration, and is reviewed annually. The implementatiekader requires the risk analysis to describe the exit strategy (Art. 4.3(c)), and Art. 7 lists its parts: conditions on the provider and its sub-suppliers for data portability, service portability and data destruction; an alternative provider or an internal landing place; a strategy, conditions and budget for leaving at once in a crisis or a sudden (geopolitical) development; and a strategy and budget for the regular end of the contract. Summarise each in a line. Point to `/arckit-nl:nl-exit` for the full plan rather than duplicating it here.

### Step 13: Generate the Assessment

**CRITICAL**: Use the **Write tool** to create the assessment document.

1. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> RBCLOUD {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

2. **Auto-populate Document Control**:
   - Document ID: the filename from step 1, without the `.md` extension
   - Status: DRAFT
   - Created Date: {current_date}
   - Next Review Date: {current_date + 12 months}

3. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the NL regime to `_partials/document-control-nl.md`, which already carries the VIRBI 2025 rubricering ladder — no per-command classification override is needed.

4. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The Herziening rijksbreed cloudbeleid 2026, the Implementatiekader risicoafweging cloudgebruik (with the version applied) and VIRBI 2025 MUST appear in the Document Register with their primary URLs and verification dates.

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **RBCLOUD** per-type checks pass.

Write the document to:

```text
projects/{project_id}/<filename>
```

### Step 14: Summary Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Rijksbreed Cloudbeleid Compliance Assessment Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 Document: projects/{project_id}/ARC-{PROJECT_ID}-RBCLOUD-v{VERSION}.md
📋 Document ID: {document_id}
📅 Assessment Date: {date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Determination Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Materieel publiek cloudgebruik: {Yes / No}
Clause 5.2 status:              {Eligible / Prohibited — TBB {n} or staatsgeheim}
Clause 4.5 conditions (if applicable): {All met / Not met}
Exit plan required:             {Yes / No}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Recommendation: {Proceed / Proceed with conditions / Do not proceed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Risks identified: {N} ({N} high, {N} medium)

Next steps:
1. {If TBB category not determined: Run /arckit-nl:nl-tbb to determine the TBB category}
2. {If materieel cloudgebruik and no exit plan: Run /arckit-nl:nl-exit for the clause 3.2 exit plan}
3. Run /arckit-nl:nl-bio for BIO2 conformance of the hosting environment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Important Notes

- **No published qualification list**: Unlike France's SecNumCloud, there is no published Dutch list of qualified or compliant cloud providers. Never name, shortlist, or imply endorsement of any specific commercial cloud provider in this assessment.
- **5.2 is a prohibition, not a risk to manage**: Staatsgeheim gerubriceerde informatie and TBB niveau 1–3 cannot go to public cloud under any mitigation. Do not present this as a risk-acceptance decision.
- **4.5 is cumulative, not alternative**: All three conditions for email/file-storage services must be met together. A partially-met set is not eligible.
- **Basisregistraties are out of scope for public cloud** under clause 5.4 — source data are not managed there, inside or outside the EEA.
- **The TBB inference runs one way**: This command consumes a TBB category from `/arckit-nl:nl-tbb`; it does not infer a rubricering level from a TBB category. See that command's one-way inference warning.
- **Use Write Tool**: This is a detailed governance document. Always use the Write tool.

## Key References

| Document | Publisher | URL |
|----------|-----------|-----|
| Herziening rijksbreed cloudbeleid 2026 (3 July 2026, definitief) | Ministerie van Economische Zaken en Klimaat, Staatssecretaris W.J.M. Aerdts, 3 juli 2026 | Kamerbrief: <https://www.tweedekamer.nl/kamerstukken/brieven_regering/detail?id=2026Z15738&did=2026D35294> · Policy PDF: <https://www.tweedekamer.nl/downloads/document?id=2026D35295> · Kamerstuk 26643, nr. 1541 |
| Implementatiekader risicoafweging cloudgebruik, v1.1 (5 January 2023; adopted by the ICBR 20 December 2022) — the "implementatiekader risicobeheersing cloudgebruik" of clause 3.1; a revision for the 2026 policy is announced | CIO Rijk | <https://zoek.officielebekendmakingen.nl/blg-1070754.pdf> · Kamerstuk 26643, nr. 964 · Rijksoverheid copy: <https://open.overheid.nl/documenten/ronl-734f947ec6465e4f75a56bed82fe64a1135f71a8/pdf> |
| VIRBI 2025 — Besluit voorschrift informatiebeveiliging rijksdienst bijzondere informatie 2025 (BWBR0051482) | Rijksoverheid | https://wetten.overheid.nl/BWBR0051482 |
| Cyberbeveiligingswet (Cbw) and Wet weerbaarheid kritieke entiteiten (Wwke) | Rijksoverheid | *(not linked — approved by the Eerste Kamer 7 July 2026, in force 15 August 2026; verify current text via wetten.overheid.nl before citing)* |
| BIO2 — Baseline Informatiebeveiliging Overheid 2 | OBDO | *(not linked — verify current text via digitaleoverheid.nl before citing)* |
| OBDO "Cloud definities en begrippenlijst" (approved 16 April 2026) | OBDO | *(not linked — verify current text via digitaleoverheid.nl before citing)* |
| Nederlandse Digitaliseringsstrategie | Rijksoverheid | *(not linked — verify current text via rijksoverheid.nl before citing)* |
| Visie Digitale Autonomie en Soevereiniteit van de Overheid | Rijksoverheid | *(not linked — verify current text via rijksoverheid.nl before citing)* |

> **Note for reviewers**: The Herziening rijksbreed cloudbeleid 2026 is the successor to earlier Dutch central-government cloud policy. It sits alongside — and is distinct from — the EU-level frameworks (GDPR, NIS2/Cbw). A key distinction from France's SecNumCloud regime: **there is no published Dutch cloud-provider qualification list.** Eligibility is determined by clause-by-clause assessment of the workload and data in scope, not by checking a provider against a register.

## Success Criteria

- ✅ Assessment document created at `projects/{project_id}/ARC-{PROJECT_ID}-RBCLOUD-v{VERSION}.md`
- ✅ Materieel publiek cloudgebruik determination made with rationale (clause 4.1)
- ✅ Clause 3.1 risk assessment completed for all five aspects, including foreign-government interference, with residual-risk acceptance and DPIA/DTIA applicability
- ✅ Implementatiekader applied (Step 5a), with the version stated: roles, the Art. 4.3 contents, the NBV risk scenarios, main-provider selection, formal adoption and the review cycle recorded
- ✅ Clause 5.2 eligibility explicitly determined using a TBB category (or explicitly flagged as pending `/arckit-nl:nl-tbb`)
- ✅ Clause 4.5 three cumulative conditions assessed individually where applicable
- ✅ Clause 5.4 basisregistraties constraint assessed where applicable
- ✅ Clause 4.2 cybersecurity criteria assessed
- ✅ Clause 4.3 critical/essential-entity discouragement assessed
- ✅ Clause 4.4 Woo publication posture noted
- ✅ Clause 4.6 data location and encryption assessed
- ✅ Clauses 3.3 and 3.4 governance obligations captured as actions
- ✅ No specific commercial cloud provider named as compliant or qualified
- ✅ Decision and recommendation stated clearly

## Example Usage

```text
/arckit-nl:nl-cloud Assess cloud eligibility for a case management platform at a Dutch ministry, processing personal data at scale, no cloud provider selected yet

/arckit-nl:nl-cloud Cloud hosting assessment for 001, departmental email and document collaboration service currently under review for public cloud migration

/arckit-nl:nl-cloud Evaluate materieel cloudgebruik and clause 5.2 eligibility for a system handling Departementaal VERTROUWELIJK policy documents
```
