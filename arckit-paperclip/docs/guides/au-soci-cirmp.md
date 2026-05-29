# AU SOCI CIRMP

`/arckit.au-soci-cirmp` generates a Security of Critical Infrastructure Act 2018 (SOCI Act) / Critical Infrastructure Risk Management Program (CIRMP) governance and evidence pack for Australian critical infrastructure assets.

Use it when a project may involve a SOCI-regulated critical infrastructure asset or when you need a reusable cross-sector CIRMP evidence pack. It is deliberately separate from `au-ot-security`: some SOCI assets do not have OT, and some OT environments may not trigger SOCI obligations.

## Prerequisites

| Artefact | Why it helps |
|----------|--------------|
| `/arckit.requirements` | Source for criticality, service, data, continuity, and regulatory obligations |
| `/arckit.stakeholders` | Identifies responsible entity, operator, accountable officer, regulator, and suppliers |
| `/arckit.au-e8-posture` (`ARC-<id>-AUE8-v1.0.md`) | Cyber and information security hazard evidence |
| `/arckit.au-ism-controls` (`ARC-<id>-AUISM-v1.0.md`) | Broader ASD control evidence |
| `/arckit.au-pia` (`ARC-<id>-AUPIA-v1.0.md`) | Privacy and information handling evidence |
| `/arckit.au-ndb-playbook` (`ARC-<id>-AUNDB-v1.0.md`) | Incident notification and breach response evidence |
| `/arckit.au-ot-security` (`ARC-<id>-AUOT-v1.0.md`) | Optional OT cyber evidence when the critical asset includes OT |

## Usage

```text
/arckit.au-soci-cirmp 001
/arckit.au-soci-cirmp "Critical Data Platform"
```

Output: `projects/<id>/ARC-<id>-AUSOCI-v1.0.md`

## What It Produces

- Critical asset and responsible entity context.
- SOCI applicability assessment.
- CIRMP governance model.
- Hazard-domain assessment across cyber and information security, personnel, supply chain, physical security, and natural hazards.
- Incident reporting and protected-information handling pathways.
- Annual report and board/governing-body approval readiness.
- Cross-sector vs sector-specific obligation split.

## Notes

This command covers general SOCI/CIRMP obligations. Sector-specific obligations such as AESCSF, AER ring-fencing, NER/NGR, and AEMO market or system-operator obligations belong in the later `au-energy` recipe.
