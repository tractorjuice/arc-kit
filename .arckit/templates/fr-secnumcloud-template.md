# SecNumCloud 3.2 Compliance Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit.fr-secnumcloud`
>
> ⚠️ **Community-contributed** — not yet validated against current ANSSI/CNIL/EU regulatory text. Verify all citations before relying on output.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit.fr-secnumcloud` | [PENDING] | [PENDING] |

## Executive Summary

**Assessment scope**: [Description of the cloud procurement or hosting scenario]

**Overall recommendation**: [Proceed with / Do not proceed with / Proceed conditionally with] [Provider/Option]

**Key findings**:

- [Finding 1]
- [Finding 2]
- [Finding 3]

---

## 1. Context and Scope

### 1.1 Project Sensitivity Level

[Describe data types, classification level, regulatory obligations]

### 1.2 Applicable Regulatory Framework

| Framework | Applicability | Source |
|-----------|--------------|--------|
| SecNumCloud 3.2 | [Required / Recommended / N/A] | ANSSI |
| LPM (OIV obligations) | [Yes / No] | SGDSN |
| NIS2 / OSE designation | [Yes / No] | ANSSI |
| IGI 1300 | [Applicable / N/A] | SGDSN |
| GDPR / CNIL | [Data categories] | CNIL |
| DORA | [Financial sector / N/A] | EBA |

## 2. SecNumCloud 3.2 Qualification Matrix

### 2.1 Current Qualification Status (as of assessment date)

| Provider | Product | Status | Scope | Valid Until | Notes |
|----------|---------|--------|-------|-------------|-------|
| S3NS (Thales/Google) | PREMI3NS | Qualified | IaaS/PaaS | TBC | Full SNCloud 3.2 — residual FISA-702 risk |
| Outscale (Dassault) | Outscale Cloud | Qualified | IaaS | TBC | Best fit for air-gap scenarios |
| OVHcloud | SecNumCloud offer | In progress | IaaS | TBC | Provisional Visa — monitor status |
| Bleu (CapGemini/Orange/Microsoft) | Bleu | In progress | IaaS/PaaS/SaaS | TBC | Residual FISA-702 risk — Azure lineage |
| NumSpot | NumSpot | In progress | IaaS | TBC | Banque des Territoires / Docaposte |
| Cloud Temple | Trusted Cloud | Visa only | IaaS | TBC | Visa ≠ Qualification — procurement risk |

> ⚠️ **Critical distinction**: A SecNumCloud **Visa** (provisional) does NOT confer the same assurance level as a full **Qualification**. Procurement documents must specify which level is required.

### 2.2 Criteria Assessment for Shortlisted Providers

| Criterion | Requirement | [Provider A] | [Provider B] |
|-----------|-------------|-------------|-------------|
| Extraterritorial immunity | No non-EU law applicable | [Status] | [Status] |
| Sovereign personnel | EU nationals only for privileged access | [Status] | [Status] |
| Data in France/EU | Data residency EU only | [Status] | [Status] |
| Sovereign encryption | Keys controlled by customer | [Status] | [Status] |
| ANSSI audit | Passed full ANSSI audit | [Status] | [Status] |

Legend: ✅ Confirmed | ⚠️ Residual risk | 🔄 In progress | ❌ Not met

## 3. Extraterritorial Legal Risk Assessment

### 3.1 Risk Framework

| Legislation | Jurisdiction | Mechanism | Risk Level |
|-------------|-------------|-----------|------------|
| Cloud Act | USA | Compelled disclosure to US law enforcement | 🔴 High for US-lineage providers |
| FISA Section 702 | USA | Intelligence collection on non-US persons | 🔴 High for US-lineage providers |
| ITAR / EAR | USA | Export control on defence-related data | 🟠 Medium — context dependent |
| UK Investigatory Powers Act | UK | Post-Brexit surveillance powers | 🟡 Low for FR-hosted |

### 3.2 Provider Exposure Matrix

[Map each shortlisted provider against the extraterritorial legislation above]

> ⚠️ **ANSSI position**: SecNumCloud 3.2 requires providers to demonstrate that no foreign law can compel data access. Providers with US parent companies carry residual FISA-702 risk that qualification does not fully eliminate.

## 4. OIV/OSE Obligation Mapping

### 4.1 OIV Obligations (LPM Article 22 + ANSSI sector orders)

[Complete if project entity is designated OIV]

| Obligation | Reference | Applicable | Status |
|-----------|-----------|-----------|--------|
| Critical Information System (SIIV) declaration | LPM Art. 22 | [Yes/No] | [Status] |
| ANSSI sector-specific security rules | Sector order | [Yes/No] | [Status] |
| Information system security accreditation (Homologation) | RGS v2.0 | [Yes/No] | [Status] |
| ANSSI incident notification | LPM Art. 22 | [Yes/No] | [Status] |

### 4.2 OSE Obligations (NIS2 transposition)

[Complete if project entity is designated OSE under NIS2]

| Obligation | Reference | Applicable |
|-----------|-----------|-----------|
| NIS security measures | ANSSI NIS guide | [Yes/No] |
| Incident notification within 24h | NIS2 Art. 23 | [Yes/No] |
| Security audit every 3 years | ANSSI | [Yes/No] |

## 5. Architecture Recommendations

### 5.1 Recommended Patterns for Sensitive Workloads

**Pattern A — Full air-gap** (highly sensitive data, OIV/SIIV designation)

- Dedicated infrastructure, no internet connectivity
- Sovereign HSM for key management
- Recommended provider: Outscale dedicated zones

**Pattern B — Qualified sovereign cloud** (sensitive data, public administration)

- SecNumCloud 3.2 qualified IaaS
- Customer-managed encryption keys (BYOK/HYOK)
- Recommended providers: Outscale, S3NS PREMI3NS (with FISA risk acceptance)

**Pattern C — Sovereign hybrid cloud** (mixed-sensitivity data)

- Sensitive workloads on qualified cloud
- Non-sensitive on standard commercial cloud
- Clear data classification and flow control required

### 5.2 Key Management Requirements

| Scenario | Recommendation |
|---------|---------------|
| Health data (HDS) | Sovereign HSM + HDS certification |
| Classified data (DR level) | IGI 1300 compliant solution required |
| Sensitive personal data | BYOK minimum, HYOK recommended |

## 6. Procurement Guidance

### 6.1 UGAP Catalogue Alignment

[Identify available SecNumCloud-qualified services in the UGAP catalogue]

| Category | UGAP Framework | Available Qualified Providers |
|----------|---------------|------------------------------|
| Sovereign IaaS | [UGAP ref] | [Providers] |
| Encrypted storage | [UGAP ref] | [Providers] |

### 6.2 Code de la Commande Publique Considerations

- For lots above EU thresholds: JOUE publication required
- Security clauses to include: data residency, sovereignty, right to audit, incident notification
- Recommended contractual annexes: ANSSI security annex, GDPR data processing agreement, reversibility clause

## 7. Residual Risk Register

| Risk ID | Description | Likelihood | Impact | Mitigation |
|---------|-------------|-----------|--------|------------|
| SECNUM-R01 | No fully qualified provider for required SaaS category | Medium | High | Compensating controls + ANSSI consultation |
| SECNUM-R02 | FISA-702 residual risk on US-lineage qualified provider | Low | High | Legal opinion + risk acceptance at appropriate level |
| SECNUM-R03 | Qualification status changes during contract period | Low | Medium | Contractual clause requiring maintained qualification |

## 8. Decision Matrix and Recommendation

| Provider | SecNumCloud Status | Extraterritorial Risk | OIV Fit | Recommended |
|---------|-------------------|----------------------|---------|-------------|
| [Provider A] | [Status] | [Risk] | [Fit] | [Yes/No/Conditional] |
| [Provider B] | [Status] | [Risk] | [Fit] | [Yes/No/Conditional] |

**Recommendation**: [Shortlist with clear rationale]

**Next steps**: Run `/arckit.fr-marche-public` for procurement procedure, `/arckit.eu-nis2` for NIS2 compliance mapping.

---

**Generated by**: ArcKit `/arckit.fr-secnumcloud` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
