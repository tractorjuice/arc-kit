# AU SOCI CIRMP

`/arckit-au:au-soci-cirmp` generates a Security of Critical Infrastructure Act 2018 (SOCI Act) / Critical Infrastructure Risk Management Program (CIRMP) governance and evidence pack for Australian critical infrastructure assets.

Use it when a project may involve a SOCI-regulated critical infrastructure asset or when you need a reusable cross-sector CIRMP evidence pack. It is deliberately separate from `au-ot-security`: some SOCI assets do not have OT, and some OT environments may not trigger SOCI obligations.

## Prerequisites

| Artefact | Why it helps |
|----------|--------------|
| `/arckit:requirements` | Source for criticality, service, data, continuity, and regulatory obligations |
| `/arckit:stakeholders` | Identifies responsible entity, operator, accountable officer, regulator, and suppliers |
| `/arckit-au:au-e8-posture` (`ARC-<id>-AUE8-v1.0.md`) | Cyber and information security hazard evidence |
| `/arckit-au:au-ism-controls` (`ARC-<id>-AUISM-v1.0.md`) | Broader ASD control evidence |
| `/arckit-au:au-pia` (`ARC-<id>-AUPIA-v1.0.md`) | Privacy and information handling evidence |
| `/arckit-au:au-ndb-playbook` (`ARC-<id>-AUNDB-v1.0.md`) | Incident notification and breach response evidence |
| `/arckit-au:au-ot-security` (`ARC-<id>-AUOT-v1.0.md`) | Optional OT cyber evidence when the critical asset includes OT |

## Usage

```text
/arckit-au:au-soci-cirmp 001
/arckit-au:au-soci-cirmp "Critical Data Platform"
```

Output: `projects/<id>/ARC-<id>-AUSOCI-v1.0.md`

## What It Produces

- Critical asset and responsible entity context.
- SOCI applicability assessment, including the CIRMP tier (baseline, enhanced or TSRMP).
- CIRMP governance model.
- Hazard-domain assessment across cyber and information security, personnel, supply chain, physical security, and natural hazards, plus credential compromise and lateral movement for enhanced-tier assets.
- Enhanced CIRMP requirements, each against its compliance date, for enhanced-tier assets.
- The cyber framework the CIRMP complies with (for example the Essential Eight at Maturity Level One for the baseline tier, Level Two for the enhanced tier).
- Incident reporting and protected-information handling pathways.
- Annual report and board/governing-body approval readiness.
- Cross-sector vs sector-specific obligation split.

## Enhanced CIRMP

The *Security of Critical Infrastructure Legislation Amendment (Enhanced Critical Infrastructure Risk Management Program) Rules 2026* commenced on 10 June 2026. They add enhanced requirements to the [CIRMP Rules](https://www.legislation.gov.au/F2023L00112/latest/text) for critical broadcasting, domain name system, electricity, energy market operator, freight infrastructure, freight services, gas, liquid fuel and water assets (s 4A(1)). A CIRMP for those assets must meet both the baseline and the enhanced requirements. The other CIRMP asset classes (data storage or processing, food and grocery, designated hospitals and payment systems) stay on the baseline.

The enhanced requirements add:

- additional material risks: prejudice to social or economic stability, national security or defence, foreign ownership, control or influence, and offshore or remote access to critical components or business critical data (s 6A)
- cyber material risks such as late patching and legacy systems, and a stronger cyber framework, for example the Essential Eight at Maturity Level Two instead of One (s 8A)
- phishing-resistant multi-factor authentication where the chosen framework does not already require it (s 8B), and network segregation of critical systems (s 8C)
- personnel access management and critical-worker suitability through AusCheck background checks or a Negative Vetting 1 or higher clearance (s 9A)
- supply-chain mapping and major-supplier assessment (s 10A), and central management of physical security and natural hazards (s 11A)

For an asset that was a critical infrastructure asset before 10 June 2026, the [CISC factsheet](https://www.cisc.gov.au/resources-subsite/Documents/enhanced-cirmp-implementation-factsheet.pdf) gives 10 June 2027 for the new material risks (ss 6A, 8A(2) and 9A(2)) and 10 June 2028 for everything else. An asset that becomes one later has 12 and 24 months from that date. The 2025–26 annual report need not cover the enhanced requirements.

## Notes

This command covers general SOCI/CIRMP obligations. Sector-specific obligations such as AESCSF, AER ring-fencing, NER/NGR, and AEMO market or system-operator obligations belong in the `au-energy` recipe (`arckit-au-energy` overlay).
