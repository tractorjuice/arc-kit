# AU Energy Fixture Evaluation Results

## Run Summary

- Date: 2026-05-29
- Method: Manual evaluation of command and recipe design against public synthetic fixtures, supported by deterministic fixture-coverage evaluation for the `au-aescsf` and `au-energy-compliance` skill prompts/templates.
- Automation status: The focused pytest suite verifies fixture hygiene, recipe dependencies, document type registration, generated output presence, and synthetic evidence anchors for both new skills. Full live LLM artefact quality remains subject to human review.
- Summary report: `tests/fixtures/au-energy/EVAL_SUMMARY_REPORT.md`

## Synthetic skill compatibility evaluation

Test command:

```text
pytest tests/plugin/test_au_energy_menu.py -q
```

Expected result:

```text
5 passed
```

The deterministic evaluation checks that:

- `au-aescsf` includes the expected AESCSF, OT/IT, architecture evidence, data-flow, data-model, federal baseline, and risk-treatment sections.
- `au-energy-compliance` includes the expected applicability, ring-fencing, NER/NGR/AEMO, market-interface, regulated/unregulated data-flow, architecture-decision, and recommendation sections.
- Fixture A provides the positive DNSP / critical electricity asset evidence anchors required by those sections.
- Fixture B provides the negative supplier / non-SOCI-covered-entity evidence anchors required by those sections.

## Fixture A - Eastland Energy Networks

Observed against expected design:

- Positive DNSP applicability path is represented in the fixture pack.
- AESCSF domain hooks are present for all 11 domains.
- MIL-1 blocker evidence is present for TVM, IAM, SA, EDM, WM, and CA.
- OT/IT convergence hooks are present across SCADA, ADMS, DERMS, DOE, vendor remote access, CSIP-AUS, and grid-edge connectivity.
- AER ring-fencing hooks are present through Eastland Connect, shared platforms, information-flow risk, shared staff, and branding pressure points.
- SOCI/CIRMP applicability hooks are present for a critical electricity asset, CIRMP hazards, board attestation, and incident reporting.
- The fixture exercises `au-aescsf` and `au-energy-compliance` command paths for architecture evidence, IT/OT data flows, energy data-model dependencies, AEMO interfaces, NMI/settlement flows, and ADR handoff seeds.

Result: Fixture A: Pass for synthetic skill compatibility and fixture/design coverage. Human review remains required for any generated artefact before external use.

## Fixture B - Voltiq Analytics

Observed against expected design:

- Negative SOCI-covered-entity path is represented in the fixture pack.
- Supplier flow-down obligations are represented.
- Supplier-scoped AESCSF and customer obligation risks are represented.
- OT overlay non-applicability is represented unless customer access changes.
- SaaS, tenant isolation, sensitive-supplier, data handling, and notification flow-down hooks are represented.
- The fixture exercises `au-aescsf` and `au-energy-compliance` command paths for supplier-scoped applicability, non-SOCI handling, flow-down obligations, customer energy data, tenant isolation, notification timing, and sensitive-supplier exposure.

Result: Fixture B: Pass for synthetic skill compatibility and fixture/design coverage of negative applicability and supplier flow-down expectations. Human review remains required for any generated artefact before external use.

## Known Limits

- Results are fixture/design and deterministic prompt-coverage validation, not legal advice or formal AESCSF assessment.
- Human assessor review remains required before using generated artefacts for external compliance decisions.
- Future improvements can add VPP, EV/V2G, gas pipeline, and market participant edge-case fixtures.
