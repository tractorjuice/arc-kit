# Security Architect — ArcKit Command Guide

> **DDaT Role Family**: [Architecture](https://ddat-capability-framework.service.gov.uk/role/security-architect)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Security Architect ensures solutions meet security and compliance requirements. You own ArcKit's security assessment commands — from risk registers to Secure by Design artefacts and MOD-specific assurance.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.risk` | Create risk register following HM Treasury Orange Book principles | [Guide](#docs/guides/risk.md) |
| `/arckit.secure` | Generate Secure by Design assessment (NCSC CAF, Cyber Essentials, UK GDPR) | [Guide](#docs/guides/secure.md) |
| `/arckit.mod-secure` | MOD Secure by Design assessment (JSP 440, IAMM, CAAT) | [Guide](#docs/guides/mod-secure.md) |
| `/arckit.dpia` | Data Protection Impact Assessment for UK GDPR Article 35 | [Guide](#docs/guides/dpia.md) |
| `/arckit.conformance` | Check architecture drift and security control implementation | [Guide](#docs/guides/conformance.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.principles` | Define security principles (confidentiality, integrity, availability) | [Guide](#docs/guides/principles.md) |
| `/arckit.requirements` | Review NFR-SEC-xxx security requirements | [Guide](#docs/guides/requirements.md) |
| `/arckit.tcop` | Review TCoP compliance for security-related points | [Guide](#docs/guides/tcop.md) |
| `/arckit.ai-playbook` | Assess AI safety and security controls | [Guide](#docs/guides/ai-playbook.md) |
| `/arckit.atrs` | Review algorithmic transparency for security implications | [Guide](#docs/guides/atrs.md) |
| `/arckit.jsp-936` | MOD AI assurance for defence AI/ML systems | [Guide](#docs/guides/jsp-936.md) |
| `/arckit.hld-review` | Review HLD for security architecture patterns | [Guide](#docs/guides/hld-review.md) |
| `/arckit.diagram` | Review network and data flow diagrams for security boundaries | [Guide](#docs/guides/diagram.md) |
| `/arckit.analyze` | Review governance quality for security gaps | [Guide](#docs/guides/analyze.md) |

## Typical Workflow

```text
principles → risk → requirements (NFR-SEC) → dpia → secure → conformance
```

### For MOD projects

```text
principles → risk → requirements (NFR-SEC) → dpia → mod-secure → jsp-936 → conformance
```

### Step-by-step

1. **Set security principles**: Contribute to `/arckit.principles` — security-specific principles (Zero Trust, defence in depth, least privilege)
2. **Assess risks**: Run `/arckit.risk` to identify threats, vulnerabilities, and mitigations
3. **Define security requirements**: Ensure NFR-SEC-xxx requirements exist in `/arckit.requirements`
4. **Privacy assessment**: Run `/arckit.dpia` for personal data processing
5. **Secure by Design**: Run `/arckit.secure` for civilian projects or `/arckit.mod-secure` for MOD
6. **AI assurance**: Run `/arckit.jsp-936` if the project involves AI/ML (MOD only)
7. **Check conformance**: Run `/arckit.conformance` to verify security decisions are implemented

## Key Artifacts You Own

- `ARC-{PID}-RISK-v*.md` — Risk register
- `ARC-{PID}-SECD-v*.md` — Secure by Design assessment (civilian)
- `ARC-{PID}-SECD-MOD-v*.md` — MOD Secure by Design assessment
- `ARC-{PID}-DPIA-v*.md` — Data Protection Impact Assessment (co-owned with Data Architect)
- `ARC-{PID}-CONF-v*.md` — Conformance assessment (co-owned with Enterprise Architect)

## UK Government Security Context

- **Civilian**: NCSC Cyber Assessment Framework (CAF), Cyber Essentials, UK GDPR, GovS 007
- **MOD**: JSP 440 (Defence Manual of Security), IAMM, JSP 604, CAAT continuous assurance
- **AI systems**: JSP 936 (Dependable AI in Defence), AI Playbook safety controls
- **Classification**: PUBLIC, OFFICIAL, OFFICIAL-SENSITIVE, SECRET

## Related Roles

- [CISO](ciso.md) — sets security strategy you implement at project level
- [Enterprise Architect](enterprise-architect.md) — governs the principles your assessments validate against
- [Data Architect](data-architect.md) — co-owns DPIA with you
- [Solution Architect](solution-architect.md) — designs the solution you assess for security
