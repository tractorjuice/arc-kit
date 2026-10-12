# AU AESCSF Maturity Assessment

`/arckit:au-aescsf` generates an Australian Energy Sector Cyber Security Framework (AESCSF) maturity assessment for Australian electricity, gas, energy-market, DER, OT, or energy-sector supplier projects.

AESCSF is energy-specific, but it should not be run as an isolated cyber checklist. It composes the AU federal community overlay: `au-e8-posture` and `au-ism-controls` provide the ASD cyber baseline, while optional `au-ot-security` and `au-soci-cirmp` add connected OT and critical-infrastructure evidence where they apply.

## Prerequisites

| Artefact | Why it helps |
|----------|--------------|
| `/arckit:requirements` | Source for resilience, safety, customer, market, and regulatory requirements |
| `/arckit:stakeholders` | Identifies responsible entity, operator, accountable officer, market participants, suppliers, and regulators |
| `/arckit:au-e8-posture` (`ARC-<id>-AUE8-v1.0.md`) | Enterprise cyber baseline for AESCSF maturity evidence |
| `/arckit:au-ism-controls` (`ARC-<id>-AUISM-v1.0.md`) | Broader ASD control evidence and IRAP/cloud inheritance context |
| `/arckit:au-ot-security` (`ARC-<id>-AUOT-v1.0.md`) | Optional OT evidence for IT/OT convergence, segmentation, remote access, telemetry, and recovery constraints |
| `/arckit:au-soci-cirmp` (`ARC-<id>-AUSOCI-v1.0.md`) | Optional SOCI/CIRMP evidence for critical asset and all-hazards governance |
| `/arckit:dfd` and `/arckit:diagram` | IT/OT, market, DER, customer, vendor, and telemetry data-flow evidence |
| `/arckit:data-model` | NMI, meter, DER, customer, life-support, outage, settlement, and network-constraint data relationships |
| `/arckit:traceability` | Links AESCSF domains to requirements, controls, risks, diagrams, decisions, and evidence |

## Usage

```text
/arckit:au-aescsf 001
/arckit:au-aescsf "DNSP ADMS/DERMS Program"
```

Output: `projects/<id>/ARC-<id>-AUAESCSF-v1.0.md`

## What It Produces

- AESCSF scope and energy-sector operating context.
- Current and target maturity assessment.
- Evidence mapped from E8, ISM, OT security, SOCI/CIRMP, architecture, and operating records.
- IT/OT convergence, DER, market, supplier, and grid-edge considerations.
- Gap register, uplift pathway, and residual risk handoff.
- Traceability back to requirements, risks, diagrams, data models, and ADRs.

## Source Currency

AEMO source material can be intermittently unavailable. At run time, verify the current AESCSF package, version, guidance material, and source availability rather than relying on cached assumptions.

## Evaluation Fixtures

The public AU energy fixture corpus under `tests/fixtures/au-energy` is synthetic, including organisations, scenarios, evidence, and personas. It is intended for public evaluation, regression testing, and community improvement.
