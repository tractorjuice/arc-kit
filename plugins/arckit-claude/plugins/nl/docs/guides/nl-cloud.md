# Rijksbreed Cloudbeleid Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-nl:nl-cloud` produces a Rijksbreed Cloudbeleid Compliance Assessment for Dutch central government (Rijksoverheid) cloud use under the Herziening rijksbreed cloudbeleid 2026 (Ministerie van Economische Zaken en Klimaat, 3 July 2026, definitief). It determines whether the use is materieel publiek cloudgebruik (clause 4.1), runs the clause 3.1 risk assessment, and states the eligibility determination against clauses 5.2, 4.5 and 5.4. It also covers cybersecurity (4.2), critical or essential entities (4.3), Woo publication (4.4), data location and encryption (4.6), and the governance obligations in clauses 3.3 and 3.4. The policy applies to all central government except the Hoge Colleges van Staat, and the Ministry of Defence is explicitly exempt. Existing cloud use gets a four-year transition; exit plans must be produced within twelve months.

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
/arckit-nl:nl-cloud <project ID or cloud service description>
```

In Claude Code the overlay installs as its own plugin, `arckit-nl`, so the command is `/arckit-nl:nl-cloud`.

Example: `/arckit-nl:nl-cloud Cloud hosting assessment for 001, departmental email and document collaboration service currently under review for public cloud migration`

Output: `projects/<id>/ARC-<id>-RBCLOUD-v1.0.md`

---

## Eligibility Tests

| Clause | Applies to | How the command treats it |
|--------|------------|---------------------------|
| 5.2 | Staatsgeheim gerubriceerde informatie and Te Beschermen Belangen niveau 1, 2 and 3 | Public cloud is prohibited, whatever the mitigation. It is not presented as a risk-acceptance decision. If the TBB category is unknown, the command says so and recommends `/arckit-nl:nl-tbb`; it does not guess. |
| 4.5 | Email or document/workplace/file storage | Three cumulative conditions, each assessed separately: (a) continuity of service independently established as otherwise at risk; (b) risk analysis and exit plan produced and tested under this policy; (c) decision agreed by the responsible minister in agreement with the bewindspersoon voor digitalisering. Partial satisfaction is not eligible. |
| 5.4 | Systems holding or sourcing basisregistratie data | Basisregistraties are not (solely) held in public cloud inside or outside the EEA, and source data are not managed in public cloud. |

There is no published Dutch cloud-provider qualification list. The assessment never names, shortlists or implies that a commercial cloud provider is compliant or qualified.

---

## The Implementatiekader

Clause 3.1 says the risk analysis must follow the implementatiekader, which it calls the *implementatiekader risicobeheersing cloudgebruik*. The document's own title is the **Implementatiekader risicoafweging cloudgebruik**. The current version is 1.1, dated 5 January 2023, adopted by the ICBR on 20 December 2022 and maintained by CIO Rijk ([bijlage to Kamerstuk 26 643, nr. 964](https://zoek.officielebekendmakingen.nl/blg-1070754.pdf)). It is mandatory. The optional *Handreiking risicobeheersing toepassing public cloud* is a separate document.

Version 1.1 was written for the 2022 cloud policy. The government said on 3 July 2026, and again in answers to Kamervragen on 29 September 2026, that it will revise it to match the 2026 policy. No revision had been published by 28 October 2026. The command applies v1.1 unless a later version has appeared, and records which version it used. Arts. 11–13 cite the 2022 policy's numbered voorwaarden; where one of them no longer fits, the command follows the 2026 clause on the same point and says so.

| Article | What it requires | Where the assessment records it |
|---------|------------------|----------------------------------|
| 1a | Mandatory for materieel public cloudgebruik by the Rijksdienst, applied to hybrid cloud where relevant, advised for private cloud | 2.4 |
| 1c, 4.4 | The risk analysis is formally adopted (vastgesteld) under the departmental mandateringsregeling; decisions and risk acceptance follow ministerial responsibility, the CIO-stelsel and the BVA-stelsel | 2.1 |
| 1f | The public-cloud prohibition for staatsgeheim information covers NATO information above NATO RESTRICTED | 3.1 |
| 3a | RACI: the process owner (proceseigenaar) is Responsible; the departmental Bestuursraad, or its delegate, is Accountable; SLM Rijk / inkoop, the FG / PAR, AIVD and/or MIVD and CIO Rijk are consulted or informed per activity | 2.5 |
| 4.1–4.3 | A risk analysis under the organisation's BIO risk-management method, before use, consulting SLM Rijk, covering: context and characteristics (benefits, main provider and sub-suppliers, IaaS / PaaS / SaaS, data sensitivity, region); the C2000 criteria, the NBV risk scenarios and a comparison with on-premise processing; the safety of people at extra risk from a data leak; continuity; the measures against BIO chapter 15, including audit access, the exit strategy and the provider's own supplier checks; design, existence and later effectiveness of the measures; residual risks | 2.6 |
| 5 | Main-provider selection weighs necessity, privacy conditions negotiated in advance, and public values (open source, human rights, sustainability) | 2.6 |
| 6, Bijlage 1 | The C2000 criteria assessed together; AIVD and/or MIVD advice in time where they raise risks; exclusion where national-security risks cannot be controlled | 4 |
| 7 | The exit strategy's four parts, summarised and passed to `/arckit-nl:nl-exit` | 9 |
| 8 | Pre-scan DPIA contents, the government-wide DPIA model, formal adoption, and a DTIA under EDPB Recommendations 01/2020 | 2.2, 2.3 |
| 9 | Risk analysis, exit strategy and DPIA updated at material change and at least every three years | 2.8 |
| 10 | Decision-making, including on DPIAs and PAR advice, published within three months of going live | 6 |
| 12 | CIO Rijk's prior advice where basisregistratie data are stored or processed in public cloud | 3.3 |
| 13 | What the register of materieel cloudgebruik holds, updated at least annually | 8.2 |
| 15 | Questions and departures go to CIO Rijk | 2.4 |
| Bijlage 2 | Damage-limitation and disaster-recovery plans for six NBV public-cloud scenarios | 2.7 |

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Executive Summary | Scope, materieel determination, overall eligibility, key findings |
| 1. Context and Scope | System and hosting scenario; clause 4.1 tests (primary or core task, large-scale personal data); applicable regulatory framework |
| 2. Risk Assessment (clause 3.1) | Integral risk assessment of the five clause 3.1 aspects (characteristics of the cloud use, the provider's security and continuity role, audit and accountability, foreign-government interference, supplier-dependency abuse), formal adoption and residual-risk acceptance; pre-scan or full DPIA; DTIA; the implementatiekader version applied, roles, the contents of the risk analysis, the NBV risk scenarios and the review cycle |
| 3. Eligibility Determination | Clause 5.2 prohibition check, clause 4.5 cumulative conditions, clause 5.4 basisregistraties |
| 4. Cybersecurity Requirements (clause 4.2) | C2000 criteria (each one, as set out in the implementatiekader), ABRO, AIVD and/or MIVD threat and security advice |
| 5. Critical or Essential Entity Considerations (clause 4.3) | Vitale aanbieder, Wwke and Cbw status, and non-EU/EEA supplier jurisdiction; public cloud "afgeraden" (discouraged, not prohibited) where these hold |
| 6. Openbaarheid / Woo (clause 4.4) | Publication posture for the risk analysis and the exit plan |
| 7. Data Location and Encryption (clause 4.6) | EEA plus Switzerland (not Caribisch Nederland), encryption at rest, in transit and in processing, key custody, special categories of personal data |
| 8. Governance Obligations | Melding en beoordeling to CISO Rijk (3.3); gekend gebruik registration and annual report to CIO Rijk (3.4) |
| 9. Exit-Plan Obligation (clause 3.2) | One line on each of the implementatiekader's four exit-strategy parts, and a pointer to `/arckit-nl:nl-exit`, not a duplicate plan |
| 10. Decision and Recommendation | Clause 5.2 eligibility, clause 4.5 status, Proceed / Proceed with conditions / Do not proceed |
| 11. External References | Herziening rijksbreed cloudbeleid 2026, the implementatiekader version applied, and VIRBI 2025 in the Document Register with verification dates |

---

## Review Checklist

- The materieel publiek cloudgebruik determination has a stated rationale, including when the answer is no.
- Every clause 5.2, 4.5 and 5.4 conclusion cites its clause, and the clause 5.2 conclusion cites the TBB category it depends on or flags it as pending `/arckit-nl:nl-tbb`.
- All five clause 3.1 aspects are assessed, foreign-government interference is mitigated as far as possible, and residual risk is formally accepted within the organisation.
- The assessment says which implementatiekader version it applied. The risk analysis shows the Art. 4.3 contents and a plan for each NBV scenario, names the Responsible process owner and the Accountable Bestuursraad or delegate, records who adopted it under the mandateringsregeling, and has a next-update date no more than three years out.
- Where the organisation proceeds despite the clause 4.3 discouragement, the risk-acceptance rationale is recorded.
- The clause 3.2 exit plan and the clause 3.3 CISO Rijk notification both appear as actions.
- No commercial cloud provider is named as compliant or qualified.
- Qualified counsel, the departmental CISO and CISO Rijk review the output before anyone relies on it.

---

## Next Steps

- `/arckit-nl:nl-tbb` — determine the TBB category before finalising the clause 5.2 check, if it is not yet known.
- `/arckit-nl:nl-exit` — produce the mandatory clause 3.2 exit plan once materieel cloudgebruik is confirmed and no plan exists.
- `/arckit-nl:nl-bio` — assess BIO2 conformance for the hosting environment and security controls.
- `/arckit:risk` — add cloud sovereignty, foreign-interference and provider-concentration risks to the risk register.
