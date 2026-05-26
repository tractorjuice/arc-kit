# SCA-RTS Per-Exemption Matrix Block

> **Template Origin**: Community | **ArcKit Version**: [VERSION]
> **Usage**: This template defines the shape of one per-exemption entry in §3 of the master
> `uk-fs-sca-rts-template.md`. The `/arckit:uk-fs-sca-rts` command generates one block per
> in-scope SCA-RTS Article (10, 10A, 11, 13, 14, 15, 16, 17, 18). Article 12 is excluded from
> scope. Copy and fill this block for each exemption — do not include this header comment in the
> generated artefact.

---

## Per-Exemption Block

### Exemption: {{EXEMPTION_NAME}} (SCA-RTS Article {{ARTICLE_NUMBER}})

**Reference**: [SCA-RTS Article {{ARTICLE_NUMBER}}]({{CITATION_URL}})
(UK Technical Standards on SCA, FCA 2020/70 as amended — implemented under PSRs 2017 Reg 106A)

**Decision**: {{APPLY | DO_NOT_APPLY | CONDITIONAL}}

**Applicability rationale**:

<!-- One to two paragraphs: why this exemption is or is not applied to this firm's payment flows -->
{{APPLICABILITY_RATIONALE}}

**Conditions / thresholds**:

- {{CONDITION_1}}
- {{CONDITION_2}}
- {{CONDITION_3}}

**Audit-trail fields logged**:

- `exemption_code`: {{ARTICLE_CODE}} (e.g., `ART10`, `ART10A`, `ART11`, `ART13`, etc.)
- {{FIELD_2}}
- {{FIELD_3}}

**Fraud rate target / band**: {{N_BPS_REFERENCE_FRAUD_RATE}}
(Reference: UK SCA-RTS Article 18 table — applicable only where TRA is the basis for this exemption)

**Owning team**: {{TEAM}}

**Last review date**: {{LAST_REVIEW_DATE}}

**Next review date**: {{NEXT_REVIEW_DATE}}

---
