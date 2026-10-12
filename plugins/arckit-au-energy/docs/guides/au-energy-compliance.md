# AU Energy Compliance Pack

`/arckit:au-energy-compliance` generates an Australian energy compliance pack that integrates AESCSF maturity with energy-market obligations, IT/OT evidence, privacy, notifiable data breach readiness, traceability, diagrams/data flows, data modelling, and ADR decisions.

Use it after the AU federal community baseline is in place. The command depends on `au-aescsf` and can compose optional `au-ot-security` and `au-soci-cirmp` outputs when connected OT or SOCI/CIRMP obligations are in scope.

## Prerequisites

| Artefact | Why it helps |
|----------|--------------|
| `/arckit:requirements` | Source for energy-market, customer, resilience, safety, and regulatory obligations |
| `/arckit:stakeholders` | Identifies responsible entity, operator, market participant, regulator, customer, privacy, OT, and supplier stakeholders |
| `/arckit:au-pia` (`ARC-<id>-AUPIA-v1.0.md`) | Privacy Act evidence for customer, metering, life-support, DER, and operational data |
| `/arckit:au-ndb-playbook` (`ARC-<id>-AUNDB-v1.0.md`) | Breach-response and notification evidence |
| `/arckit:au-ot-security` (`ARC-<id>-AUOT-v1.0.md`) | Optional connected OT and secure-connectivity evidence |
| `/arckit:au-soci-cirmp` (`ARC-<id>-AUSOCI-v1.0.md`) | Optional SOCI/CIRMP critical-infrastructure evidence |
| `/arckit:au-aescsf` (`ARC-<id>-AUAESCSF-v1.0.md`) | AESCSF maturity baseline and uplift plan |
| `/arckit:dfd`, `/arckit:diagram`, and `/arckit:data-model` | Evidence for IT/OT, DER, market, telemetry, customer, and supplier data flows |
| `/arckit:adr` | Decisions for ring-fencing, AEMO integration, CSIP-AUS, remote access, data sharing, and resilience trade-offs |
| `/arckit:traceability` | Links energy obligations to requirements, controls, risks, diagrams, data models, and decisions |

## Usage

```text
/arckit:au-energy-compliance 001
/arckit:au-energy-compliance "Retailer DER orchestration platform"
```

Output: `projects/<id>/ARC-<id>-AUENERGY-v1.0.md`

## What It Produces

- Energy-sector scope and obligation profile.
- AESCSF evidence integration and uplift dependencies.
- AER ring-fencing, NER/NGR, AEMO, DER, market, and customer-data considerations.
- IT/OT and vendor connectivity evidence, including data-flow and diagram references.
- Privacy and Notifiable Data Breach evidence for customer, metering, DER, outage, life-support, and market data.
- ADR summary for architecturally significant compliance and resilience decisions.
- Traceability matrix linking obligations, controls, evidence, risks, diagrams, data models, and decisions.

## Source Currency

Verify the current AESCSF package/version, AEMO guidance availability, AER guidance, NER/NGR obligations, and any market-procedure references at run time. The command should record the source version and access date used for the assessment.

## Evaluation Fixtures

The public AU energy fixture corpus under `tests/fixtures/au-energy` is synthetic, including organisations, scenarios, evidence, and personas. It is intended for public evaluation, regression testing, and community improvement.
