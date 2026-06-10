---
name: Cloud Security & Compliance
description: This skill should be used when the user asks about "ISO 27001", "Cyber Essentials", "NCSC principles", "cloud security", "what certifications", "SOC 2", "data protection", "UK GDPR", "security clearance", "PCI DSS", "compliance framework", "CSA STAR", "DSPT", "Technology Code of Practice", "AI Playbook", "what evidence do I need", "security certification", "NHS data", "BPSS", "SC clearance", "DV clearance", "what security do I need", "certification cost", "ISO 22301", or needs guidance on security certifications, compliance requirements, and evidence for G-Cloud submissions.
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

## Quick Reference: NCSC 14 Principles

| # | Principle | Category |
|---|-----------|----------|
| 1 | Data in transit protection | Data Protection |
| 2 | Asset protection and resilience | Data Protection |
| 3 | Separation between users | Separation |
| 4 | Governance framework | Governance |
| 5 | Operational security | Operations |
| 6 | Personnel security | Personnel |
| 7 | Secure development | Development |
| 8 | Supply chain security | Supply Chain |
| 9 | Secure user management | Access |
| 10 | Identity and authentication | Access |
| 11 | External interface protection | Infrastructure |
| 12 | Secure service administration | Administration |
| 13 | Audit information for users | Audit |
| 14 | Secure use of the service | Usage |

## Quick Reference: Security Clearances

| Level | Typical Use | Timeline |
|-------|-------------|----------|
| BPSS | Standard government access | 1–2 weeks |
| CTC | Airport, defence | 6–8 weeks |
| SC | OFFICIAL-SENSITIVE data | 6–8 weeks |
| DV | SECRET classification | 6–12 months |
| eDV | TOP SECRET classification | 12+ months |

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
3. **Be specific about what's mandatory vs. recommended** — ISO 27001 is "strongly expected" not technically mandatory; Cyber Essentials Plus IS mandatory for handling personal data
4. **Consider the lot** — Lot 3 (Cloud Support/consultancy) has different security expectations than Lots 1 & 2 (hosting/software)

## Related Commands

These ArcKit commands generate security-related documents:

| Command | Security Area |
|---------|--------------|
| `/arckit:security` | Comprehensive security evidence document |
| `/arckit:sdd-lot1`, `sdd-lot2`, `sdd-lot3` | Security sections within SDDs |
| `/arckit:declaration` | Legal compliance and exclusion grounds |

## Additional Resources

### Reference Files

- **`references/compliance-frameworks.md`** — Complete reference covering all certifications (ISO 27001, Cyber Essentials, SOC 2, CSA STAR, PCI DSS, ISO 22301, ISO 20000-1), UK government frameworks (NCSC principles, Technology Code of Practice, AI Playbook, NHS DSPT), data protection (UK GDPR, DPA requirements), security clearances, evidence guidance, and certification renewal schedules. Consult for any detail not covered by the quick reference tables above.
