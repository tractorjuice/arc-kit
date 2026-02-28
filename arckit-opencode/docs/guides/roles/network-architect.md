# Network Architect — ArcKit Command Guide

> **DDaT Role Family**: [Architecture](https://ddat-capability-framework.service.gov.uk/role/network-architect)
> **Framework**: [UK Government DDaT Capability Framework](https://ddat-capability-framework.service.gov.uk/)

## Overview

The Network Architect designs network infrastructure, connectivity, and security boundaries. You contribute to ArcKit's design and security commands — ensuring network topology, segmentation, and connectivity patterns are documented and reviewed.

## Primary Commands

| Command | Purpose | Guide |
|---------|---------|-------|
| `/arckit.diagram` | Create network topology, data flow, and security boundary diagrams | [Guide](#docs/guides/diagram.md) |
| `/arckit.secure` | Contribute network security controls to Secure by Design assessment | [Guide](#docs/guides/secure.md) |
| `/arckit.hld-review` | Review HLD for network architecture patterns and connectivity | [Guide](#docs/guides/hld-review.md) |

## Secondary Commands

| Command | Your Involvement | Guide |
|---------|-----------------|-------|
| `/arckit.requirements` | Define network NFRs (bandwidth, latency, availability, connectivity) | [Guide](#docs/guides/requirements.md) |
| `/arckit.risk` | Identify network-specific risks (single points of failure, DDoS, connectivity) | [Guide](#docs/guides/risk.md) |
| `/arckit.dld-review` | Review DLD for network implementation details | [Guide](#docs/guides/dld-review.md) |
| `/arckit.adr` | Record network technology decisions (SD-WAN, VPN, CDN, load balancing) | [Guide](#docs/guides/adr.md) |
| `/arckit.azure-research` | Research Azure networking services (VNet, ExpressRoute, Front Door) | [Guide](#docs/guides/azure-research.md) |
| `/arckit.aws-research` | Research AWS networking services (VPC, Direct Connect, CloudFront) | [Guide](#docs/guides/aws-research.md) |
| `/arckit.operationalize` | Contribute to network monitoring and DR/BCP sections | [Guide](#docs/guides/operationalize.md) |

## Typical Workflow

```text
requirements (NFR-NET) → cloud-research → adr → diagram → secure → hld-review
```

### Step-by-step

1. **Define network requirements**: Ensure NFR requirements cover bandwidth, latency, availability, and connectivity
2. **Research networking services**: Run cloud-specific research for networking options
3. **Record decisions**: Run `/arckit.adr` for network technology choices
4. **Create diagrams**: Run `/arckit.diagram` with focus on network topology and data flows
5. **Assess security**: Review `/arckit.secure` for network security controls (firewalls, segmentation, encryption in transit)
6. **Review HLD**: Participate in `/arckit.hld-review` for network architecture validation

## Key Artifacts You Contribute To

- `ARC-{PID}-DIAG-{NUM}-v*.md` — Network and data flow diagrams
- `ARC-{PID}-SECD-v*.md` — Network security sections of Secure by Design
- `ARC-{PID}-HLDR-v*.md` — Network sections of HLD review
- `ARC-{PID}-ADR-{NUM}-v*.md` — Network technology decisions

## Related Roles

- [Technical Architect](technical-architect.md) — designs the infrastructure your network supports
- [Security Architect](security-architect.md) — sets security controls for network boundaries
- [Solution Architect](solution-architect.md) — defines the solution topology you implement
