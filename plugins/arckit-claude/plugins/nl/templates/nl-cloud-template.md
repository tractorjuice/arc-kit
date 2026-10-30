# Rijksbreed Cloudbeleid Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit-nl:nl-cloud`
>
> ⚠️ **Community-contributed** — not yet validated against current Rijksoverheid / EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit-nl:nl-cloud` | [PENDING] | [PENDING] |

## Executive Summary

**Assessment scope**: [Description of the system or service and the cloud hosting scenario under consideration]

**Materieel publiek cloudgebruik**: [Yes / No] — [one-line rationale]

**Overall eligibility**: [Eligible / Not eligible / Eligible with conditions]

**Key findings**:

- [Finding 1]
- [Finding 2]
- [Finding 3]

---

## 1. Context and Scope

### 1.1 System and Hosting Scenario

[Describe the system, the data it processes, and the cloud hosting option(s) under consideration]

### 1.2 Materieel Publiek Cloudgebruik Determination (clause 4.1)

| Test | Applies | Rationale |
|------|---------|-----------|
| Use for the organisation's primary or core task | [Yes / No] | [Rationale] |
| Large-scale processing of personal data | [Yes / No] | [Rationale] |

**Determination**: [Materieel cloudgebruik / Not materieel cloudgebruik] — [If materieel: clause 3.1 risk assessment, clause 3.2 exit plan, clause 3.3 melding, and clause 3.4 register obligations all apply. If not: lighter-touch path — record the decision rationale for audit.]

### 1.3 Applicable Regulatory Framework

| Framework | Applicability | Source |
|-----------|--------------|--------|
| Herziening rijksbreed cloudbeleid 2026 | [Applicable / N/A] | Ministerie van Economische Zaken en Klimaat |
| VIRBI 2025 rubricering | [Applicable / N/A — existing marking as recorded by `/arckit-nl:nl-tbb`] | Rijksoverheid |
| BIO2 | [Applicable / N/A — see `/arckit-nl:nl-bio`] | OBDO |
| Cyberbeveiligingswet (Cbw) / Wet weerbaarheid kritieke entiteiten (Wwke) | [Applicable / N/A] | Rijksoverheid |
| GDPR / AVG | [Data categories] | Autoriteit Persoonsgegevens |

## 2. Risk Assessment (clause 3.1)

### 2.1 Integral Risk Assessment

Required for materieel cloudgebruik, based on the application's BIV/TBB classification (see `/arckit-nl:nl-tbb`).

| Aspect | Assessment | Mitigation |
|--------|-----------|------------|
| 1. Characteristics of the cloud use — main provider and any sub-providers, service type (public / private / hybrid / community cloud), region of processing and storage | [Assessment] | [Mitigation] |
| 2. The provider's role in security and continuity, and how it is assured | [Assessment] | [Mitigation] |
| 3. How the provider admits, or reports on, audit and accountability investigations | [Assessment] | [Mitigation] |
| 4. Risk of foreign-government interference with confidentiality and availability | [Assessment] | [Mitigated as far as possible — describe measures] |
| 5. Risk of the provider abusing a large supplier dependency (forcing technology choices or commercial conditions) | [Assessment] | [Mitigation] |

> Clause 3.1 lists these five aspects in addition to the regular topics of security, continuity and privacy. It also requires that the implementatiekader is followed (sections 2.4 to 2.8), that residual risk is documented and formally accepted within the organisation, that the responsible bestuurder's decision is traceable and auditable ("toetsbaar en auditeerbaar"), and that mitigations depending on the provider are written into the contract.

**Risk analysis formally adopted (vastgesteld) by**: [Name / role under the departmental mandateringsregeling, date] (implementatiekader Art. 4.4)

**Residual risk accepted by**: [Name / role, date]

**Decision record**: [Where the decision and its basis are recorded, so that it can be traced and audited]

### 2.2 Pre-scan DPIA / Full DPIA

| Trigger | Applies | Status |
|---------|---------|--------|
| Personal data processed | [Yes / No] | [Pre-scan DPIA / Full DPIA / Not required] |

| Pre-scan DPIA element (implementatiekader Art. 8.1) | Covered |
|-----------------------------------------------------|---------|
| (a) Description of the processing: types of personal data (content, telemetry, diagnostic, website and helpdesk data), size of the data set and of the processing, data subjects, process supported | [Yes / No — reference] |
| (b) User groups, including those who take the service and those who receive the information | [Yes / No — reference] |
| (c) Reasoned conclusion on whether a formal DPIA is needed | [Conclusion] |
| Formal DPIA uses the government-wide (rijksbrede) model and is formally adopted (Art. 8, 8.2) | [Yes / No / Not required] |
| If no formal DPIA: how the privacy requirements are met, that the measures work, and the (low) residual risks (Art. 8.3) | [Reference / N/A] |

### 2.3 DTIA (Data Transfer Impact Assessment)

| Trigger | Applies | Status |
|---------|---------|--------|
| Transfer to a third country without an adequacy decision | [Yes / No] | [DTIA completed / DTIA required / Not required] |

> Implementatiekader Art. 8.4: the DTIA follows EDPB Recommendations 01/2020, and special categories of personal data call for extra restraint.

### 2.4 Implementatiekader Risicoafweging Cloudgebruik

| Item | Value |
|------|-------|
| Version applied | [v1.1, 5 January 2023 (adopted by the ICBR 20 December 2022) / later version if CIO Rijk has published the announced revision — state it] |
| Scope (Art. 1a) | [Materieel public cloudgebruik — mandatory / Hybrid — applied where relevant / Private — advised, not mandatory] |
| Articles citing 2022 voorwaarden (Arts. 11–13) | [Where one no longer fits the 2026 policy, the 2026 clause followed instead — or None] |
| Questions or departures raised with CIO Rijk (Art. 15) | [None / Summarise] |

> Clause 3.1 calls this document the *implementatiekader risicobeheersing cloudgebruik*; its own title is *Implementatiekader risicoafweging cloudgebruik*. It is not the optional *Handreiking risicobeheersing toepassing public cloud*.

### 2.5 Roles (implementatiekader Art. 3a)

| Activity | Responsible (proceseigenaar) | Accountable (Bestuursraad or delegate) | Consulted | Informed |
|----------|------------------------------|----------------------------------------|-----------|----------|
| Risk analysis | [Name / role] | [Name / role] | SLM Rijk / inkoop | — |
| (Pre-scan) DPIA and any DTIA | [Name / role] | [Name / role] | FG (and PAR for rijksbrede voorzieningen); SLM Rijk / inkoop | — |
| C2000 assessment | [Name / role] | [Name / role] | AIVD and/or MIVD | — |
| Exit strategy | [Name / role] | [Name / role] | SLM Rijk / inkoop | — |
| Processing (special categories of) personal data in the cloud | [Name / role] | [Name / role] | FG / PAR | CIO Rijk |
| Processing basisregistraties in the cloud | [Name / role] | [Name / role] | CIO Rijk | — |
| Recording and reporting materieel cloudgebruik | [Name / role] | [Name / role] | — | CIO Rijk |

**Delegate (gedelegeerde) recorded in**: [Departmental cloud policy / mandateringsregeling — reference]

### 2.6 Contents of the Risk Analysis (implementatiekader Art. 4)

| Requirement | Covered | Reference |
|-------------|---------|-----------|
| Formally adopted BIO risk-management methodology used, before the service is used (Art. 4.1–4.2) | [Yes / No] | [Method] |
| SLM Rijk consulted for reuse of earlier analyses and a joint approach (Art. 4.2) | [Yes / No] | [Reference] |
| (a) Context and characteristics: intended benefits, main provider and sub-suppliers, service model (IaaS / PaaS / SaaS), data sensitivity, region of processing and storage | [Yes / No] | [Section] |
| (b) Relevant risks: C2000 criteria (section 4), NBV risk scenarios (section 2.7), comparison with on-premise processing | [Yes / No] | [Section] |
| (b) Risks to the safety of people at extra risk if their personal data leak | [Yes / No / N/A] | [Section] |
| (b) Continuity risks, including for the performance of tasks | [Yes / No] | [Section] |
| (c) Technical and organisational measures meet the information-security requirements (having regard to chapter 15 of the BIO), covering the provider admitting accountability investigations or reporting on them, the exit strategy (section 9), and how the provider assesses its own suppliers for chain risks | [Yes / No] | [Section] |
| (d) Design and existence (opzet en bestaan) of the measures assessed; operating effectiveness (werking) from the first update | [Yes / No] | [Section] |
| (e) Risks judged sufficiently mitigated; residual risks and how they are safeguarded | [Yes / No] | [Section] |
| Main-provider selection (Art. 5): necessity (subsidiarity), privacy conditions negotiated in advance, public values such as open source, human rights and sustainability | [Yes / No] | [How weighed] |

### 2.7 NBV Public-Cloud Risk Scenarios (implementatiekader Bijlage 2)

| Scenario | Damage-limitation / disaster-recovery plan |
|----------|---------------------------------------------|
| 1. A (state) actor has compromised the government tenant and had long-term access to the data | [Plan] |
| 2. A (state) actor has compromised the provider's cloud fabric and had long-term access to the tenant and the data | [Plan] |
| 3. The provider's country has gained access to the tenant and its data through extraterritorial legal powers | [Plan] |
| 4. The provider's country, or another country, has put political or commercial pressure on the provider, raising suspicion of espionage or sabotage | [Plan] |
| 5. The service is down for a long time through failure or sabotage, including countries sabotaging or blocking it on their territory, affecting government posts abroad | [Plan] |
| 6. The provider ends the tenant contract or the whole service, whether or not under pressure from its own or another country | [Plan] |

**Also considered**: [The coupling between the on-premise environment and the public cloud (complexity, larger attack surface); state actors' interest in personal data, including large data sets and basisregistraties]

### 2.8 Review Cycle (implementatiekader Art. 9)

| Item | Value |
|------|-------|
| Trigger for update | Material change in the service or its risks |
| Latest date for next update of the risk analysis, exit strategy and DPIA | [Date — at least every three years] |
| Updated versions re-shared with CIO Rijk | [Yes / Not previously shared] |

## 3. Eligibility Determination

### 3.1 Prohibition Check (clause 5.2)

| Data category | TBB / rubricering | Public cloud status |
|---------------|-------------------|---------------------|
| [Data category] | [From `/arckit-nl:nl-tbb`: final TBB 1–4, plus the existing marking it records — Stg. level / ongerubriceerd / none recorded] | [PROHIBITED if staatsgeheim gerubriceerd or TBB 1–3 / Not prohibited under 5.2] |

> Public cloud is **prohibited** for staatsgeheim gerubriceerde informatie and for Te Beschermen Belangen niveau 1, 2, and 3. This includes NATO information above NATO RESTRICTED (implementatiekader Art. 1f). If the TBB category has not been determined, run `/arckit-nl:nl-tbb` before finalising this determination.

### 3.2 Email and File Storage — Clause 4.5 Cumulative Conditions

Complete only if the service in scope is email or document/workplace/file storage. All three conditions must be met.

| Condition | Met | Evidence |
|-----------|-----|----------|
| (a) Independently established that continuity of service is otherwise at risk | [Yes / No] | [Evidence] |
| (b) Risk analysis and exit plan produced and tested under this policy | [Yes / No] | [Reference to `/arckit-nl:nl-exit` output] |
| (c) Decision agreed by the responsible minister in agreement with the bewindspersoon voor digitalisering | [Yes / No] | [Evidence] |

**Overall clause 4.5 status**: [All three met — eligible / One or more not met — not eligible]

### 3.3 Basisregistraties (clause 5.4)

| Question | Answer |
|----------|--------|
| Does this system hold or source basisregistratie data? | [Yes / No] |
| If yes: is the basisregistratie (solely) hosted in public cloud? | [Must be No — source data are not managed in public cloud] |
| If any basisregistratie data are stored or processed in public cloud: CIO Rijk's prior advice requested, with the explain, via CISORijk@minbzk.nl (implementatiekader Art. 12) | [Requested on / Advice received / N/A] |

## 4. Cybersecurity Requirements (clause 4.2)

| Requirement | Status |
|-------------|--------|
| C2000 criteria assessed | [Status] |
| ABRO assessed | [Status] |
| AIVD and/or MIVD threat and security advice obtained | [Status] |

| C2000 criterion (implementatiekader Bijlage 1; assessed together, Art. 6.1) | Assessment |
|------------------------------------------------------------------------------|------------|
| 1. Provider from, or controlled from, a country whose laws oblige cooperation with its government (in particular intelligence or military bodies), or a state company | [Assessment] |
| 2. Provider from a country with an active offensive intelligence programme aimed at the Netherlands, or with strained relations | [Assessment] |
| 3A. Provider gets extensive access to sensitive locations, ICT systems or vital infrastructure where misuse could be a national-security risk | [Assessment] |
| 3B. Control measures possible and achievable that sufficiently protect the national-security risks | [Assessment — where not, such parties are excluded where possible (Art. 6.3)] |

## 5. Critical or Essential Entity Considerations (clause 4.3)

| Question | Answer |
|----------|--------|
| Organisation designated vitale aanbieder? | [Yes / No] |
| Organisation falls under the Wwke? | [Yes / No] |
| Organisation in the Cbw essential-entity category? | [Yes / No] |
| Supplier for the primary process wholly/partly under non-EU/EEA jurisdiction? | [Yes / No] |

**Guidance**: Public cloud use is **discouraged** ("afgeraden") — not prohibited — where all of the above hold together. Document the risk-acceptance rationale if proceeding.

## 6. Openbaarheid / Woo (clause 4.4)

| Item | Woo publication status |
|------|------------------------|
| This risk analysis | [Publication planned / Carries a rubricering — publication withheld] |
| The exit plan (`/arckit-nl:nl-exit`) | [Publication planned / Carries a rubricering — publication withheld] |
| Decision-making, including on the DPIAs and any PAR advice — published no later than three months after the service goes into use (implementatiekader Art. 10) | [Publication date / Due by] |

## 7. Data Location and Encryption (clause 4.6)

| Requirement | Status |
|-------------|--------|
| Storage and processing within the EEA plus Switzerland (excludes Caribisch Nederland) | [Status] |
| Encryption at rest | [Status] |
| Encryption in transit | [Status] |
| Encryption in processing (where applicable) | [Status] |
| Key management NOT held by the cloud provider | [Status — preferred posture] |
| Special categories of personal data | [Preferably not in public cloud; if unavoidable, Privacy Enhancing Technologies applied — Status] |

## 8. Governance Obligations

### 8.1 Melding en Beoordeling (clause 3.3)

| Requirement | Status |
|-------------|--------|
| Prior notification to CISO Rijk before implementation | [Status] |
| Any aanwijzingen (directions) issued by CISO Rijk | [None / Summarise] |

### 8.2 Gekend Gebruik (clause 3.4)

| Requirement | Status |
|-------------|--------|
| Material public-cloud use registered | [Status] |
| Annual report to CIO Rijk, including chosen provider | [Status / Next report due] |
| Record holds the organisational unit, the business process and its responsible line manager, the current risk analysis and DPIA, and the provider and cloud services taken (implementatiekader Art. 13.1) | [Status] |
| Record updated at material change and at least annually; annual report through the IB-beeld reporting cycle (Art. 13) | [Status] |

## 9. Exit-Plan Obligation (clause 3.2)

[If materieel cloudgebruik: an exit plan is mandatory within twelve months, covering a planned exit and a disruptive interruption of service, reviewed annually. See `/arckit-nl:nl-exit` for the full plan — do not duplicate it here.]

| Exit-strategy part (implementatiekader Art. 7; described in the risk analysis, Art. 4.3(c)) | Summary |
|------------------------------------------------------------------------------------------------|---------|
| Conditions on the provider and its sub-suppliers for data portability, service portability and data destruction | [One line] |
| An alternative provider or an internal landing place | [One line] |
| A strategy, conditions and budget for leaving at once in a crisis or a sudden (geopolitical) development | [One line] |
| A strategy and budget for the regular end of the contract | [One line] |

## 10. Decision and Recommendation

| Element | Value |
|---------|-------|
| Eligibility (clause 5.2) | [Eligible / Prohibited] |
| Clause 4.5 conditions (if applicable) | [All met / Not met] |
| Overall recommendation | [Proceed / Proceed with conditions / Do not proceed] |

> No published Dutch cloud-provider qualification list exists. This assessment does not name, shortlist, or endorse any specific commercial cloud provider as compliant or qualified.

**Next steps**: Run `/arckit-nl:nl-exit` if not already produced and materieel cloudgebruik applies. Run `/arckit-nl:nl-bio` for the hosting environment's BIO2 conformance. Run `/arckit:risk` to integrate identified risks into the risk register.

## 11. External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| WEB-1 | <https://www.tweedekamer.nl/downloads/document?id=2026D35295> | Web URL | tweedekamer.nl | Herziening rijksbreed cloudbeleid 2026 (3 July 2026, definitief), Kamerstuk 26643 nr. 1541. Verified [YYYY-MM-DD] |
| WEB-2 | <https://wetten.overheid.nl/BWBR0051482> | Web URL | wetten.overheid.nl | VIRBI 2025 — Besluit voorschrift informatiebeveiliging rijksdienst bijzondere informatie 2025 (BWBR0051482), in force 9 September 2025. Verified [YYYY-MM-DD] |
| WEB-3 | <https://zoek.officielebekendmakingen.nl/blg-1070754.pdf> | Web URL | officielebekendmakingen.nl | Implementatiekader risicoafweging cloudgebruik, v1.1 (5 January 2023), bijlage to Kamerstuk 26643 nr. 964 — or the later version applied. Verified [YYYY-MM-DD] |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit-nl:nl-cloud` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
