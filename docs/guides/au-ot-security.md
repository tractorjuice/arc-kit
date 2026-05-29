# AU OT Security

`/arckit.au-ot-security` generates an ASD-aligned operational technology cyber security assessment for Australian Government, regulated-sector, and critical-infrastructure projects with connected OT, ICS, SCADA, building-management, field-device, or cyber-physical environments.

Use it when OT security matters but you do not necessarily need SOCI/CIRMP coverage. The command complements `au-e8-posture` and `au-ism-controls`: E8 and ISM provide the AU cyber baseline, while this command records OT-specific architecture, connectivity, safety, availability, supplier access, monitoring, and recovery constraints.

## Prerequisites

| Artefact | Why it helps |
|----------|--------------|
| `/arckit.requirements` | Source for availability, safety, OT, remote-access, and supplier-access requirements |
| `/arckit.stakeholders` | Identifies operational owner, safety owner, CISO, suppliers, and managed-service providers |
| `/arckit.au-e8-posture` (`ARC-<id>-AUE8-v1.0.md`) | Enterprise cyber baseline |
| `/arckit.au-ism-controls` (`ARC-<id>-AUISM-v1.0.md`) | Broader ASD control evidence for IT and OT systems |
| `/arckit.risk` | Receives residual OT cyber and safety risks |

## Usage

```text
/arckit.au-ot-security 001
/arckit.au-ot-security "Water SCADA Platform"
```

Output: `projects/<id>/ARC-<id>-AUOT-v1.0.md`

## What It Produces

- OT environment context and safety/availability profile.
- ASD OT guidance alignment.
- Definitive OT architecture and asset-view assessment.
- IT/OT segmentation and trust-boundary assessment.
- Secure connectivity, remote access, and supplier access review.
- Monitoring, logging, incident response, and recovery constraints.
- AI-in-OT considerations where relevant.
- Cross-reference back to AUE8, AUISM, RISK, and AUSOCI where applicable.

## Notes

This is a general Australian OT security command, not an energy-sector command. The later `au-energy` recipe should consume this artefact before adding AESCSF and energy-market obligations.
