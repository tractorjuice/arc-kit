# AU Energy Fixture Evaluation Results

## Run Summary

- Date: 2026-05-29
- Method: Manual evaluation of command and recipe design against public synthetic fixtures, supported by deterministic repository tests for fixture hygiene, recipe dependencies, document type registration, and generated output presence.
- Automation status: Full end-to-end ArcKit command execution is agent-mediated and not represented as an automated pytest result in this PR.

## Fixture A - Eastland Energy Networks

Observed against expected design:

- Positive DNSP applicability path is represented in the fixture pack.
- AESCSF domain hooks are present for all 11 domains.
- MIL-1 blocker evidence is present for TVM, IAM, SA, EDM, WM, and CA.
- OT/IT convergence hooks are present across SCADA, ADMS, DERMS, DOE, vendor remote access, CSIP-AUS, and grid-edge connectivity.
- AER ring-fencing hooks are present through Eastland Connect, shared platforms, information-flow risk, shared staff, and branding pressure points.
- SOCI/CIRMP applicability hooks are present for a critical electricity asset, CIRMP hazards, board attestation, and incident reporting.

Result: Pass for fixture/design coverage; command-output behaviour remains to be validated by end-to-end execution.

## Fixture B - Voltiq Analytics

Observed against expected design:

- Negative SOCI-covered-entity path is represented in the fixture pack.
- Supplier flow-down obligations are represented.
- Supplier-scoped AESCSF and customer obligation risks are represented.
- OT overlay non-applicability is represented unless customer access changes.
- SaaS, tenant isolation, sensitive-supplier, data handling, and notification flow-down hooks are represented.

Result: Pass for fixture/design coverage of negative applicability and supplier flow-down expectations; command-output behaviour remains to be validated by end-to-end execution.

## Known Limits

- Results are fixture/design validation, not legal advice or formal AESCSF assessment.
- Human assessor review remains required before using generated artefacts for external compliance decisions.
- Future improvements can add VPP, EV/V2G, gas pipeline, and market participant edge-case fixtures.
