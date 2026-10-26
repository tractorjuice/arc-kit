# AU AESCSF Maturity Assessment

`/arckit:au-aescsf` generates an Australian Energy Sector Cyber Security Framework (AESCSF) maturity assessment for Australian electricity, gas, energy-market, DER, OT, or energy-sector supplier projects.

AESCSF is energy-specific, but it should not be run as an isolated cyber checklist. It reads the AU federal community overlay's artefacts when they exist: `au-e8-posture` and `au-ism-controls` provide the ASD cyber baseline, and `au-ot-security` and `au-soci-cirmp` add connected OT and critical-infrastructure evidence where they apply. All four are optional inputs; the `au-energy` recipe runs them first. `au-energy-compliance` reads the finished assessment as cyber-posture context, so run this command before it.

## Prerequisites

| Artefact | Requirement | Why it helps |
|----------|-------------|--------------|
| `/arckit:requirements` | Recommended | Source for resilience, safety, customer, market, and regulatory requirements |
| `/arckit:stakeholders` | Recommended | Identifies responsible entity, operator, accountable officer, market participants, suppliers, and regulators |
| `/arckit:au-e8-posture` (`ARC-<id>-AUE8-v1.0.md`) | Optional | Enterprise cyber baseline for AESCSF maturity evidence |
| `/arckit:au-ism-controls` (`ARC-<id>-AUISM-v1.0.md`) | Optional | Broader ASD control evidence and IRAP/cloud inheritance context |
| `/arckit:au-ot-security` (`ARC-<id>-AUOT-v1.0.md`) | Optional | OT evidence for IT/OT convergence, segmentation, remote access, telemetry, and recovery constraints |
| `/arckit:au-soci-cirmp` (`ARC-<id>-AUSOCI-v1.0.md`) | Optional | SOCI/CIRMP evidence for critical asset and all-hazards governance |
| `/arckit:dfd` and `/arckit:diagram` | Optional | IT/OT, market, DER, customer, vendor, and telemetry data-flow evidence |
| `/arckit:data-model` | Optional | NMI, meter, DER, customer, life-support, outage, settlement, and network-constraint data relationships |
| `/arckit:traceability` | Optional | Links AESCSF findings to requirements, obligations, controls, and evidence |
| `/arckit:risk` | Optional | Existing risk register entries for maturity gaps and treatments |
| `/arckit:servicenow` | Optional | CMDB and service inventory for asset, dependency, owner, and support-criticality evidence |
| `/arckit:maturity-model` | Optional | Maturity criteria to calibrate AESCSF capability levels and evidence thresholds |
| `/arckit:principles` | Optional | Architecture principles the assessment should respect |

## Usage

```text
/arckit:au-aescsf 001
/arckit:au-aescsf "DNSP ADMS/DERMS Program"
```

Output: `projects/<id>/ARC-<id>-AUAESCSF-v1.0.md`

## What It Produces

- Energy context and AESCSF scope, with applicability assumptions.
- Criticality and target maturity profile.
- Domain maturity assessment: current and target maturity, evidence, gaps, and owners for each AESCSF capability domain.
- OT/IT and grid-edge findings, IT/OT and market data flows, and energy data-model dependencies.
- Architecture evidence status, and an asset, interface, and evidence inventory naming the source-of-truth register for each class.
- Diagram and traceability handoffs listing the DFD, diagram, data-model, ServiceNow, traceability, risk, and graph-report updates needed.
- AESCSF anti-pattern register.
- Federal baseline cross-reference to the E8, ISM, OT security, and SOCI/CIRMP artefacts.
- Maturity gaps converted into risk treatments, and an uplift roadmap (immediate, 30-90 days, 90-180 days, strategic).

## Source Currency

AEMO source material can be intermittently unavailable. At run time, verify the current AESCSF package, version, guidance material, and source availability rather than relying on cached assumptions.

## Evaluation Fixtures

The public AU energy fixture corpus under `tests/fixtures/au-energy` is synthetic, including organisations, scenarios, evidence, and personas. It is intended for public evaluation, regression testing, and community improvement.
