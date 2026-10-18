# SCA-RTS Per-Exemption Matrix Block

> **Template Origin**: Community | **ArcKit Version**: [VERSION]
> **Usage**: This template defines the shape of one per-exemption entry in §3 of the master
> `uk-fs-sca-rts-template.md`. The `/arckit:uk-fs-sca-rts` command generates one block per
> UK SCA-RTS exemption (Articles 10, 10A, 11, 12, 13, 14, 15, 16, 17, 18). An exemption that does
> not fit the firm's channels gets a DO_NOT_APPLY block with the reason. Copy and fill this block
> for each exemption — do not include this header comment in the generated artefact.

---

## Per-Exemption Block

### Exemption: {{EXEMPTION_NAME}} (SCA-RTS Article {{ARTICLE_NUMBER}})

**Reference**: [SCA-RTS Article {{ARTICLE_NUMBER}}]({{CITATION_URL}})
(the FCA's Technical Standards on Strong Customer Authentication and Common and Secure Methods of
Communication, made under PSRs 2017 Reg 106A — current text in the FCA Handbook)

**Decision**: {{APPLY | DO_NOT_APPLY | CONDITIONAL}}

**Applicability rationale**:

<!-- One to two paragraphs: why this exemption is or is not applied to this firm's payment flows -->
{{APPLICABILITY_RATIONALE}}

**Conditions / thresholds**:

- {{CONDITION_1}}
- {{CONDITION_2}}
- {{CONDITION_3}}

**Audit-trail fields logged**:

- `exemption_code`: {{ARTICLE_CODE}} (e.g., `ART10`, `ART10A`, `ART11`, `ART12`, `ART13`, etc.)
- {{FIELD_2}}
- {{FIELD_3}}

**Fraud rate target / ETV**: {{REFERENCE_FRAUD_RATE_AND_ETV}}
(Article 18 only: the reference fraud rate and exemption threshold value from the UK SCA-RTS
Appendix. For every other exemption, record N/A here; Article 21 quarterly monitoring still applies.)

**Owning team**: {{TEAM}}

**Last review date**: {{LAST_REVIEW_DATE}}

**Next review date**: {{NEXT_REVIEW_DATE}}

---
