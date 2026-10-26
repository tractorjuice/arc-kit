# G-Cloud Security Assertions Guide

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:security` generates the G-Cloud 15 (RM1557.15) security answers and evidence document for a
service, laid out for its lot. Each lot asks its own security questions, and the answers appear on
the listing. The command answers them with GCA's own options, maps each answer to the NCSC cloud
security principle it evidences, records the certifications the lot requires, and builds an
evidence register behind every claim. On Lots 2a/2b and 3 it also shows the mark each award
criterion earns.

---

## Command

```bash
/arckit:security <service project or service name>
```

Output:

```text
projects/<NNN>-<service-name>/ARC-<NNN>-SECA-v1.0.md
```

---

## When to Use

- After the service design (and ideally the SDD) is drafted.
- Before pricing and review, so security claims are evidence-backed.
- When certificates, penetration test, clearance or hosting-location evidence must be tied to the
  service and its lot's requirements.

---

## Inputs

| Input | Purpose |
|-------|---------|
| Supplier profile (`SUPP`) | Certifications, clearances, data centres and contacts |
| Service design (`SVCD`) | The lot (`1a`, `1b`, `2a`, `2b` or `3`) and service scope |
| Service Definition Document (`SDD`) | Its security answers are the starting point; the two must agree |
| Lot questions (`LOTQ`) | On Lots 2a/2b and 3, award-criteria answers that must match the service answers |
| Security evidence | Certificates, pen-test summaries and control records |

---

## Security Sections by Lot

| Section | 1a/1b | 2a/2b | 3 |
|---------|:-----:|:-----:|:-:|
| Data-in-transit protection | ✓ | ✓ | |
| Asset protection; availability and resilience | ✓ | ✓ | |
| Separation between users | ✓ | | |
| Governance (2a/2b add the Software Security Code of Practice) | ✓ | ✓ | |
| Operational security, including post-quantum cryptography | ✓ | ✓ | |
| Staff security (1b: SC or DV only) | ✓ | ✓ | ✓ |
| Secure development | ✓ | ✓ | |
| Identity and authentication (1a/1b add management devices) | ✓ | ✓ | |
| Audit information for users | ✓ | ✓ | |

Lot 3 answers only staff security, so its document centres on screening, clearance, Cyber
Essentials and standards. The NCSC principles use their current names, including "Separation between
customers" and "Audit information and alerting for customers".

---

## Certifications by Lot

| Lot | Required | Also asked |
|-----|----------|------------|
| 1a / 1b | ISO 9001, ISO/IEC 20000-1, ISO/IEC 27001; ISO 14001 and ISO/IEC 27017 unless you resell and rely on the provider's accreditations; ISO/IEC 27018 if offered on public cloud; post-quantum and FOCUS commitments; Cyber Essentials Plus for every call-off (a call-off warning if missing, not a bid failure) | ISO 28000:2022, QMS, CSA STAR, PCI DSS |
| 1b extra | An accredited secure facility within 6 months of the framework start, security-cleared staff, Security Aspects Letters | |
| 2a / 2b | Cyber Essentials, mandatory for every call-off but not for the bid; FOCUS commitment | ISO/IEC 27001, ISO 28000:2022, ISO 9001, QMS, CSA STAR, PCI DSS, Cyber Essentials Plus |
| 3 | Cyber Essentials, mandatory for every call-off but not for the bid | As 2a/2b |

---

## Output Sections

| Section | Purpose |
|---------|---------|
| Lot security profile | Which sections the lot asks, and the NCSC principle each evidences |
| Service security answers | Every security question for the lot, with evidence |
| NCSC principles coverage | Evidenced, partly evidenced, gap, or not asked for the lot |
| Certifications and standards | Required and optional certificates, scope, number and expiry |
| Security testing | Penetration testing and vulnerability scanning |
| Lot award criteria consistency | Lots 2a/2b and 3: each criterion's answer and mark |
| Evidence register | What to provide and what to keep back |

---

## Review Checklist

- Every answer uses GCA's own wording and has evidence, or is `[PENDING]`.
- Answers agree with the SDD and, on Lots 2a/2b and 3, with the lot questions.
- No certificate is recorded as held without evidence; certificates whose scope excludes the
  service evidence nothing for it.
- Full audit reports, pen-test findings and staff clearance records are kept back.

---

## Related Commands

- `/arckit:lot-questions` - The lot's certificates, conditions of participation and award criteria.
- `/arckit:dpia` - Next step when the service processes personal data.
- `/arckit:secure` - General secure-by-design assessment.
- `/arckit:review` - Final G-Cloud readiness check.
