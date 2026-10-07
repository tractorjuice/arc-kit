---
name: Cloud Security & Compliance
description: "Answers a G-Cloud supplier's questions about security certifications and compliance evidence: which certificates each G-Cloud 15 lot requires (Cyber Essentials Plus and ISO 9001/20000-1/27001 for Lots 1a/1b, Cyber Essentials for 2a, 2b and 3), ISO 27001, SOC 2, CSA STAR, PCI DSS, ISO 28000, DSPT, the Carbon Reduction Plan, the NCSC 14 cloud security principles, post-quantum cryptography, the Software Security Code of Practice, UK GDPR, BPSS, SC and DV clearances, and what evidence a submission needs. Not needed when the request is for a security evidence document or an SDD security section; /arckit-uk-gcloud:security and the sdd-lot commands produce those."
---

# Cloud Security & Compliance

Conversational knowledge about security certifications, NCSC principles, compliance frameworks, evidence requirements, and UK government security standards relevant to G-Cloud service providers.

## Purpose

Provide instant answers to common questions about security and compliance requirements for G-Cloud without requiring document generation. This covers certifications, frameworks, clearances, and evidence guidance.

## When to Use

Activate when users ask about:

- Whether they need a specific certification (ISO 27001, Cyber Essentials, SOC 2, etc.)
- What the NCSC 14 cloud security principles are
- UK GDPR requirements for cloud services
- Security clearance levels and when they apply
- What evidence to provide (and what NOT to provide)
- Certification costs, timelines, and renewal cycles
- NHS DSPT requirements
- AI governance and the AI Playbook

## Quick Reference: Key Certifications

| Certification | G-Cloud Importance | Validity | Typical Cost |
|---------------|-------------------|----------|-------------|
| ISO 27001 | High — expected by most buyers | 3 years (annual surveillance) | £5K–£50K+ |
| Cyber Essentials | High — mandatory for personal data | 12 months | £300–£500 |
| Cyber Essentials Plus | High — independent verification | 12 months | £1,500–£5,000 |
| SOC 2 Type II | Medium-High — sophisticated buyers | Annual reports | £20K–£80K |
| CSA STAR | Medium — cloud-native services | Varies by level | Varies |
| PCI DSS | Required for payment processing | Annual | Varies by level |

## Quick Reference: G-Cloud 15 Certification Questions

| Lot | Required | Also asked |
|-----|----------|-----------|
| 1a/1b | Cyber Essentials Plus; ISO 9001, ISO 20000-1, ISO 27001; ISO 14001, ISO 27017 and (if public cloud is offered) ISO 27018 unless you resell and rely on your cloud provider's accreditations; a Carbon Reduction Plan | ISO 28000:2022, QMS, CSA STAR, PCI DSS |
| 2a/2b | Cyber Essentials | Cyber Essentials Plus, ISO/IEC 27001, ISO 9001, ISO 28000:2022, QMS, CSA STAR, PCI DSS |
| 3 | Cyber Essentials (also a scored award criterion) | As 2a/2b |

Cyber Essentials for Lots 2a, 2b and 3, and ISO 27018 for any 1a/1b service with public cloud, were made mandatory in GCA's Updates to Tender Documents; the question export still shows the earlier wording. If you don't yet hold a certificate, the export offers "working towards it by framework award" or an IASME-certified equivalent.

New G-Cloud 15 service questions: **post-quantum cryptography** ("Are you compliant with NCSC guidance on post-quantum cryptography?", Lots 1a/1b and 2a/2b), the **Software Security Code of Practice** (2a/2b governance), an **AI chatbot** before reaching a person (user support), and web chat accessibility (WCAG 2.2 or EN 301 549). All lots need a Technical Ability Certificate.

## Quick Reference: NCSC 14 Principles

| # | Principle | Category |
|---|-----------|----------|
| 1 | Data in transit protection | Data Protection |
| 2 | Asset protection and resilience | Data Protection |
| 3 | Separation between customers | Separation |
| 4 | Governance framework | Governance |
| 5 | Operational security | Operations |
| 6 | Personnel security | Personnel |
| 7 | Secure development | Development |
| 8 | Supply chain security | Supply Chain |
| 9 | Secure user management | Access |
| 10 | Identity and authentication | Access |
| 11 | External interface protection | Infrastructure |
| 12 | Secure service administration | Administration |
| 13 | Audit information and alerting for customers | Audit |
| 14 | Secure use of the service | Usage |

## Quick Reference: Security Clearances

| Level | Typical Use | Timeline |
|-------|-------------|----------|
| BPSS | Standard government access, including OFFICIAL-SENSITIVE (a handling caveat within OFFICIAL, not a higher classification) | 1–2 weeks |
| CTC | Airport, defence | 6–8 weeks |
| SC | Regular access to SECRET, occasional TOP SECRET | 6–8 weeks |
| DV | Regular access to TOP SECRET | 6–12 months |
| eDV | TOP SECRET, enhanced | 12+ months |

## Quick Reference: Evidence to Provide

| Certification | Provide | Do NOT Provide |
|---------------|---------|----------------|
| ISO 27001 | Certificate (scope must cover service) | Full audit reports |
| Cyber Essentials | Certificate with badge | Internal assessments |
| SOC 2 | Management assertion letter | Full SOC 2 report |
| CSA STAR | Registry entry link | Detailed assessment |
| NHS DSPT | Published status | Internal toolkit data |
| PCI DSS | Attestation of Compliance (AOC) | Pen test findings |

General rule: never provide full audit reports, pen test findings, detailed vulnerability data, internal policy documents, or unredacted contracts.

## Answering Questions

When answering security and compliance questions:

1. **Check the quick reference tables above first** for common lookups
2. **Consult `references/compliance-frameworks.md`** for detailed requirements, the Technology Code of Practice (13 points), AI Playbook (10 principles), NHS DSPT assertion areas, UK GDPR specifics, and certification renewal schedules
3. **Be specific about what's mandatory vs. recommended**: on G-Cloud 15, Lots 1a/1b require Cyber Essentials Plus and several ISO certificates as conditions of participation; Lots 2a/2b and 3 require Cyber Essentials, and the other standards are asked but optional.
4. **Consider the lot**: Lot 3 (Cloud Support) answers only staff security and standards questions; Lots 1a/1b and 2a/2b answer the full security sections, which follow the NCSC cloud security principles

## Related Commands

These ArcKit commands generate security-related documents:

| Command | Security Area |
|---------|--------------|
| `/arckit-uk-gcloud:security` | Comprehensive security evidence document |
| `/arckit-uk-gcloud:sdd-lot1a`, `sdd-lot1b`, `sdd-lot2a`, `sdd-lot2b`, `sdd-lot3` | Security sections within SDDs |
| `/arckit-uk-gcloud:lot-questions` | Lot certifications and conditions of participation |
| `/arckit-uk-gcloud:declaration` | Procurement Act declaration (exclusion grounds are declared on the Central Digital Platform) |

## Additional Resources

### Reference Files

- **`references/compliance-frameworks.md`** — Complete reference covering what G-Cloud 15 requires by lot, all certifications (ISO 27001, Cyber Essentials, SOC 2, CSA STAR, PCI DSS, ISO 22301, ISO 20000-1), UK government frameworks (NCSC principles, Technology Code of Practice, AI Playbook, NHS DSPT), data protection (UK GDPR, DPA requirements), security clearances, evidence guidance, and certification renewal schedules. Consult for any detail not covered by the quick reference tables above.
