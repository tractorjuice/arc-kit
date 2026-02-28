# CISO (Chief Information Security Officer) — ArcKit Command Guide

> **DDaT Role Family**: [Chief Digital and Data](https://ddat-capability-framework.service.gov.uk/role/chief-information-security-officer)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The CISO sets security strategy and risk appetite for the organisation. You use ArcKit's security and compliance commands at a strategic level — ensuring security assessments are consistent, risk registers are maintained, and architecture conforms to security standards.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.secure` | Review Secure by Design assessments across projects | [Guide](#docs/guides/secure.md) |
| `/arckit.mod-secure` | Review MOD Secure by Design assessments (if MOD) | [Guide](#docs/guides/mod-secure.md) |
| `/arckit.dpia` | Oversee DPIAs for data protection compliance | [Guide](#docs/guides/dpia.md) |
| `/arckit.risk` | Set risk appetite and review risk registers | [Guide](#docs/guides/risk.md) |
| `/arckit.conformance` | Monitor security conformance across the portfolio | [Guide](#docs/guides/conformance.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.principles` | Define security principles (Zero Trust, defence in depth) | [Guide](#docs/guides/principles.md) |
| `/arckit.requirements` | Review NFR-SEC security requirements standards | [Guide](#docs/guides/requirements.md) |
| `/arckit.tcop` | Review TCoP compliance for security-related points | [Guide](#docs/guides/tcop.md) |
| `/arckit.analyze` | Review governance quality for security gaps | [Guide](#docs/guides/analyze.md) |
| `/arckit.health` | Monitor for stale security artifacts | [Guide](#docs/guides/artifact-health.md) |
| `/arckit.ai-playbook` | Review AI safety and security controls | [Guide](#docs/guides/ai-playbook.md) |
| `/arckit.jsp-936` | Review MOD AI assurance (if applicable) | [Guide](#docs/guides/jsp-936.md) |

## Typical Workflow

```text
principles (security) → risk → secure / mod-secure → conformance → analyze
```

### Step-by-step

1. **Define security principles**: Set organisational security principles in `/arckit.principles`
2. **Set risk appetite**: Review `/arckit.risk` registers across projects
3. **Review assessments**: Review `/arckit.secure` or `/arckit.mod-secure` outputs
4. **Check conformance**: Run `/arckit.conformance` to verify security decisions are implemented
5. **Monitor quality**: Review `/arckit.analyze` for security governance gaps

## Key Artifacts You Oversee

- `ARC-{PID}-SECD-v*.md` — Secure by Design assessments (owned by Security Architect)
- `ARC-{PID}-SECD-MOD-v*.md` — MOD Secure by Design assessments
- `ARC-{PID}-RISK-v*.md` — Risk registers
- `ARC-{PID}-DPIA-v*.md` — Data Protection Impact Assessments
- `ARC-{PID}-CONF-v*.md` — Conformance assessments

## Related Roles

- [Security Architect](security-architect.md) — implements your security strategy at project level
- [CTO/CDIO](cto-cdio.md) — aligns security and technology strategy
- [CDO](cdo.md) — co-owns data protection
- [Enterprise Architect](enterprise-architect.md) — ensures security principles are embedded in governance
