# Rijksbreed Cloudbeleid Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:nl-cloud`
>
> ⚠️ **Community-contributed** — not yet validated against current Rijksoverheid / EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:nl-cloud` | [PENDING] | [PENDING] |

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
| VIRBI 2025 rubricering | [Applicable / N/A — see `/arckit:nl-tbb`] | Rijksoverheid |
| BIO2 | [Applicable / N/A — see `/arckit:nl-bio`] | OBDO |
| Cyberbeveiligingswet (Cbw) / Wet weerbaarheid kritieke entiteiten (Wwke) | [Applicable / N/A] | Rijksoverheid |
| GDPR / AVG | [Data categories] | Autoriteit Persoonsgegevens |

## 2. Risk Assessment (clause 3.1)

### 2.1 Integral Risk Assessment

Required for materieel cloudgebruik, based on the application's BIV/TBB classification (see `/arckit:nl-tbb`).

| Aspect | Assessment | Mitigation |
|--------|-----------|------------|
| Risk of foreign-government interference | [Assessment] | [Mitigated as far as possible — describe measures] |
| [Aspect 2 — per current clause 3.1 text] | [Assessment] | [Mitigation] |
| [Aspect 3 — per current clause 3.1 text] | [Assessment] | [Mitigation] |
| [Aspect 4 — per current clause 3.1 text] | [Assessment] | [Mitigation] |
| [Aspect 5 — per current clause 3.1 text] | [Assessment] | [Mitigation] |

> Clause 3.1 requires five aspects to be weighed. This assessment enumerates the aspect specified in current guidance (foreign-government interference); confirm the remaining four against the current published clause 3.1 text before finalising.

### 2.2 Pre-scan DPIA / Full DPIA

| Trigger | Applies | Status |
|---------|---------|--------|
| Personal data processed | [Yes / No] | [Pre-scan DPIA / Full DPIA / Not required] |

### 2.3 DTIA (Data Transfer Impact Assessment)

| Trigger | Applies | Status |
|---------|---------|--------|
| Transfer to a third country without an adequacy decision | [Yes / No] | [DTIA completed / DTIA required / Not required] |

## 3. Eligibility Determination

### 3.1 Prohibition Check (clause 5.2)

| Data category | TBB / rubricering | Public cloud status |
|---------------|-------------------|---------------------|
| [Data category] | [From `/arckit:nl-tbb`: TBB 1–4 / Stg. level / ongerubriceerd] | [PROHIBITED if staatsgeheim gerubriceerd or TBB 1–3 / Not prohibited under 5.2] |

> Public cloud is **prohibited** for staatsgeheim gerubriceerde informatie and for Te Beschermen Belangen niveau 1, 2, and 3. If the TBB category has not been determined, run `/arckit:nl-tbb` before finalising this determination.

### 3.2 Email and File Storage — Clause 4.5 Cumulative Conditions

Complete only if the service in scope is email or document/workplace/file storage. All three conditions must be met.

| Condition | Met | Evidence |
|-----------|-----|----------|
| (a) Independently established that continuity of service is otherwise at risk | [Yes / No] | [Evidence] |
| (b) Risk analysis and exit plan produced and tested under this policy | [Yes / No] | [Reference to `/arckit:nl-exit` output] |
| (c) Decision agreed by the responsible minister in agreement with the bewindspersoon voor digitalisering | [Yes / No] | [Evidence] |

**Overall clause 4.5 status**: [All three met — eligible / One or more not met — not eligible]

### 3.3 Basisregistraties (clause 5.4)

| Question | Answer |
|----------|--------|
| Does this system hold or source basisregistratie data? | [Yes / No] |
| If yes: is the basisregistratie (solely) hosted in public cloud? | [Must be No — source data are not managed in public cloud] |

## 4. Cybersecurity Requirements (clause 4.2)

| Requirement | Status |
|-------------|--------|
| C2000 criteria assessed | [Status] |
| ABRO assessed | [Status] |
| AIVD and/or MIVD threat and security advice obtained | [Status] |

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
| The exit plan (`/arckit:nl-exit`) | [Publication planned / Carries a rubricering — publication withheld] |

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

## 9. Exit-Plan Obligation (clause 3.2)

[If materieel cloudgebruik: an exit plan is mandatory within twelve months, covering a planned exit and a disruptive interruption of service, reviewed annually. See `/arckit:nl-exit` for the full plan — do not duplicate it here.]

## 10. Decision and Recommendation

| Element | Value |
|---------|-------|
| Eligibility (clause 5.2) | [Eligible / Prohibited] |
| Clause 4.5 conditions (if applicable) | [All met / Not met] |
| Overall recommendation | [Proceed / Proceed with conditions / Do not proceed] |

> No published Dutch cloud-provider qualification list exists. This assessment does not name, shortlist, or endorse any specific commercial cloud provider as compliant or qualified.

**Next steps**: Run `/arckit:nl-exit` if not already produced and materieel cloudgebruik applies. Run `/arckit:nl-bio` for the hosting environment's BIO2 conformance. Run `/arckit:risk` to integrate identified risks into the risk register.

---

**Generated by**: ArcKit `/arckit:nl-cloud` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
