# Rijksbreed Cloudbeleid Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:nl-cloud` produces a Rijksbreed Cloudbeleid Compliance Assessment for Dutch central government (Rijksoverheid) cloud use under the Herziening rijksbreed cloudbeleid 2026 (Ministerie van Economische Zaken en Klimaat, 3 July 2026, definitief). It determines whether the use is materieel publiek cloudgebruik (clause 4.1), runs the clause 3.1 risk assessment, and states the eligibility determination against clauses 5.2, 4.5 and 5.4. It also covers cybersecurity (4.2), critical or essential entities (4.3), Woo publication (4.4), data location and encryption (4.6), and the governance obligations in clauses 3.3 and 3.4. The policy applies to all central government except the Hoge Colleges van Staat, and the Ministry of Defence is explicitly exempt. Existing cloud use gets a four-year transition; exit plans must be produced within twelve months.

See also: [Netherlands overlay guide](nl-overlay.md)

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | **Mandatory.** Data sensitivity, hosting requirements, security NFRs (NFR-SEC-xxx), integration requirements (INT-xxx), any prior TBB or BIO2 references. The command warns if it is missing. |
| TBB determination (`ARC-<id>-TBB-v1.0.md`) | **Recommended.** TBB category and BIV scores, used directly for clause 5.2. The command does not re-derive a category. |
| BIO2 assessment (`ARC-<id>-BIO2-v1.0.md`) | **Recommended.** Existing conformance status relevant to the cloud environment |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | **Recommended.** Existing cloud and hosting, third-party, and foreign-interference risks |
| Global principles (`ARC-000-PRIN-v1.0.md`) | **Recommended.** Cloud strategy and data sovereignty principles |
| DPIA (`ARC-<id>-DPIA-v1.0.md`) | **Optional.** Personal data processing details for the DPIA section |
| Secure by Design (`ARC-<id>-SECD-v1.0.md`) | **Optional.** Security controls relevant to cloud hosting |
| External documents (`external/`) | Prior cloud risk assessments, CISO Rijk correspondence, existing provider contracts |
| Global policies (`000-global/policies/`) | Cloud strategy, data classification policy |

---

## Command

```bash
/arckit:nl-cloud <project ID or cloud service description>
```

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so the command is `/arckit-nl:nl-cloud`.

Example: `/arckit:nl-cloud Cloud hosting assessment for 001, departmental email and document collaboration service currently under review for public cloud migration`

Output: `projects/<id>/ARC-<id>-RBCLOUD-v1.0.md`

---

## Eligibility Tests

| Clause | Applies to | How the command treats it |
|--------|------------|---------------------------|
| 5.2 | Staatsgeheim gerubriceerde informatie and Te Beschermen Belangen niveau 1, 2 and 3 | Public cloud is prohibited, whatever the mitigation. It is not presented as a risk-acceptance decision. If the TBB category is unknown, the command says so and recommends `/arckit:nl-tbb`; it does not guess. |
| 4.5 | Email or document/workplace/file storage | Three cumulative conditions, each assessed separately: (a) continuity of service independently established as otherwise at risk; (b) risk analysis and exit plan produced and tested under this policy; (c) decision agreed by the responsible minister in agreement with the bewindspersoon voor digitalisering. Partial satisfaction is not eligible. |
| 5.4 | Systems holding or sourcing basisregistratie data | Basisregistraties are not (solely) held in public cloud inside or outside the EEA, and source data are not managed in public cloud. |

There is no published Dutch cloud-provider qualification list. The assessment never names, shortlists or implies that a commercial cloud provider is compliant or qualified.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Executive Summary | Scope, materieel determination, overall eligibility, key findings |
| 1. Context and Scope | System and hosting scenario; clause 4.1 tests (primary or core task, large-scale personal data); applicable regulatory framework |
| 2. Risk Assessment (clause 3.1) | Integral risk assessment, including foreign-government interference, with the remaining aspects to confirm against the published clause 3.1 text; pre-scan or full DPIA; DTIA |
| 3. Eligibility Determination | Clause 5.2 prohibition check, clause 4.5 cumulative conditions, clause 5.4 basisregistraties |
| 4. Cybersecurity Requirements (clause 4.2) | C2000 criteria, ABRO, AIVD and/or MIVD threat and security advice |
| 5. Critical or Essential Entity Considerations (clause 4.3) | Vitale aanbieder, Wwke and Cbw status, and non-EU/EEA supplier jurisdiction; public cloud "afgeraden" (discouraged, not prohibited) where these hold |
| 6. Openbaarheid / Woo (clause 4.4) | Publication posture for the risk analysis and the exit plan |
| 7. Data Location and Encryption (clause 4.6) | EEA plus Switzerland (not Caribisch Nederland), encryption at rest, in transit and in processing, key custody, special categories of personal data |
| 8. Governance Obligations | Melding en beoordeling to CISO Rijk (3.3); gekend gebruik registration and annual report to CIO Rijk (3.4) |
| 9. Exit-Plan Obligation (clause 3.2) | Pointer to `/arckit:nl-exit`, not a duplicate plan |
| 10. Decision and Recommendation | Clause 5.2 eligibility, clause 4.5 status, Proceed / Proceed with conditions / Do not proceed |
| 11. External References | Herziening rijksbreed cloudbeleid 2026 and VIRBI 2025 in the Document Register with verification dates |

---

## Review Checklist

- The materieel publiek cloudgebruik determination has a stated rationale, including when the answer is no.
- Every clause 5.2, 4.5 and 5.4 conclusion cites its clause, and the clause 5.2 conclusion cites the TBB category it depends on or flags it as pending `/arckit:nl-tbb`.
- Foreign-government interference is assessed and mitigated as far as possible, and any clause 3.1 aspect not yet covered is flagged for the assessor.
- Where the organisation proceeds despite the clause 4.3 discouragement, the risk-acceptance rationale is recorded.
- The clause 3.2 exit plan and the clause 3.3 CISO Rijk notification both appear as actions.
- No commercial cloud provider is named as compliant or qualified.
- Qualified counsel, the departmental CISO and CISO Rijk review the output before anyone relies on it.

---

## Next Steps

- `/arckit:nl-tbb` — determine the TBB category before finalising the clause 5.2 check, if it is not yet known.
- `/arckit:nl-exit` — produce the mandatory clause 3.2 exit plan once materieel cloudgebruik is confirmed and no plan exists.
- `/arckit:nl-bio` — assess BIO2 conformance for the hosting environment and security controls.
- `/arckit:risk` — add cloud sovereignty, foreign-interference and provider-concentration risks to the risk register.
