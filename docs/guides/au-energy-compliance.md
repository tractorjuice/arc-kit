# AU Energy Compliance Pack

`/arckit:au-energy-compliance` generates an Australian energy-sector compliance architecture pack covering AER ring-fencing, AEMC NER/NGR obligations, AEMO market and system-operator interfaces, DER, metering, settlement, and customer data, and SOCI escalation evidence, with handoffs to diagrams, data flows, the data model, traceability, and ADRs.

Use it after the AU federal community baseline is in place. It reads the `au-aescsf`, `au-soci-cirmp`, `au-ot-security`, `au-pia`, and `au-ndb-playbook` artefacts when they exist and cross-references them rather than reassessing them; none of them is required. Cyber maturity stays in `au-aescsf`, so where both commands are in scope run `au-aescsf` first, as the `au-energy` recipe does.

## Prerequisites

| Artefact | Requirement | Why it helps |
|----------|-------------|--------------|
| `/arckit:requirements` | Recommended | Source for energy-market, customer, resilience, safety, and regulatory obligations |
| `/arckit:stakeholders` | Recommended | Identifies regulated entity, affiliate, ring-fenced business unit, market participant, regulator, customer, privacy, OT, and supplier stakeholders |
| `/arckit:au-aescsf` (`ARC-<id>-AUAESCSF-v1.0.md`) | Optional | AESCSF maturity gaps, cited as cyber-posture context in the findings they affect |
| `/arckit:au-soci-cirmp` (`ARC-<id>-AUSOCI-v1.0.md`) | Optional | SOCI/CIRMP critical-infrastructure applicability and incident escalation evidence |
| `/arckit:au-ot-security` (`ARC-<id>-AUOT-v1.0.md`) | Optional | Connected OT, grid-edge, and secure-connectivity evidence |
| `/arckit:au-pia` (`ARC-<id>-AUPIA-v1.0.md`) | Optional | Privacy Act evidence for customer, metering, life-support, DER, and operational data |
| `/arckit:au-ndb-playbook` (`ARC-<id>-AUNDB-v1.0.md`) | Optional | Breach-notification and escalation pathways for customer, metering, and DER data |
| `/arckit:dfd`, `/arckit:diagram`, and `/arckit:data-model` | Optional | Evidence for regulated/unregulated, market, AEMO, metering, DER, and customer data flows and boundaries |
| `/arckit:adr` | Optional | Existing decisions on ring-fencing, AEMO integration, CSIP-AUS, remote access, data sharing, and resilience trade-offs |
| `/arckit:traceability` | Optional | Links energy obligations to requirements, controls, evidence, and residual gaps |
| `/arckit:risk` | Optional | Existing risk register entries for compliance and resilience gaps |
| `/arckit:servicenow` | Optional | CMDB and service inventory for regulated services, CIs, dependencies, owners, and support tiers |
| `/arckit:principles` | Optional | Architecture principles the pack should respect |

## Usage

```text
/arckit:au-energy-compliance 001
/arckit:au-energy-compliance "Retailer DER orchestration platform"
```

Output: `projects/<id>/ARC-<id>-AUENERGY-v1.0.md`

## What It Produces

- Energy-sector applicability: sub-sector, regulated services, market participant roles, asset classes, and system-operator touchpoints.
- AER ring-fencing assessment of the regulated/unregulated boundary, shared services, staff and system access, affiliate data sharing, branding and cross-promotion, and waivers.
- NER / NGR and AEMO obligation mapping at architecture level, positioned for specialist confirmation.
- Energy-specific SOCI interpretation, cross-referenced to the SOCI/CIRMP artefact.
- Market and system-operator interface register.
- DER, metering, settlement, and customer data implications, including privacy and security impact.
- Regulated asset, interface, and data inventory naming the source-of-truth register for each class.
- Architecture evidence status, regulated/unregulated data flows (permitted and prohibited), and energy data-model dependencies.
- Diagram and traceability handoffs listing the DFD, diagram, data-model, ServiceNow, traceability, and graph-report updates needed.
- Architecture decision seeds for ADRs, and prioritised evidence gaps and recommendations.

The pack does not assess AESCSF maturity or build the traceability matrix itself: those come from `/arckit:au-aescsf` and `/arckit:traceability`.

## Source Currency

Verify the current AER ring-fencing guideline, NER and NGR versions, AEMO procedures and guidance availability, and CISC SOCI guidance at run time. The command records the version and access date of each source in the artefact's External References.

## Evaluation Fixtures

The public AU energy fixture corpus under `tests/fixtures/au-energy` is synthetic, including organisations, scenarios, evidence, and personas. It is intended for public evaluation, regression testing, and community improvement.
