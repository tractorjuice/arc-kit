# AU Energy Synthetic Skill Evaluation Summary

## Run Summary

- Date: 2026-05-29
- Method: Synthetic skill compatibility evaluation using deterministic fixture-coverage evaluation against the `au-aescsf` and `au-energy-compliance` command prompts/templates.
- Test command: `pytest tests/plugin/test_au_energy_menu.py -q`
- Result: Pass
- Scope: Public synthetic fixtures only. All organisations, people, findings, asset identifiers, ABNs, and figures are fictional composites.
- Limitation: This is not legal, regulatory, AESCSF certification, or live LLM quality assurance. It verifies that the new skills have enough structured synthetic evidence to exercise their expected reasoning paths.
- Live review: `LIVE_GENERATION_REVIEW.md` records a practical Codex generation pass for the inventory/register enrichment added to the AU energy commands.

## Skills Tested

| Skill | Fixture A - Eastland Energy Networks | Fixture B - Voltiq Analytics | Result |
|-------|--------------------------------------|------------------------------|--------|
| `au-aescsf` | Full DNSP path with all AESCSF domains, OT overlay, MIL-1 blockers, SCADA/ADMS/DERMS/DOE, CSIP-AUS, vendor remote access, and architecture evidence | Supplier-scoped path with OT overlay marked non-applicable unless customer access changes | Pass |
| `au-energy-compliance` | Energy compliance path with AER ring-fencing, AEMO interfaces, NER/AEMO evidence hooks, regulated/unregulated data flows, privacy/NDB hooks, SOCI escalation, diagrams, and ADR seeds | Negative SOCI supplier path with customer flow-down, tenant isolation, energy data handling, notification timing, and sensitive-supplier exposure | Pass |

## Fixture A: Pass

Eastland Energy Networks exercises the positive DNSP / critical electricity asset path:

- AESCSF evidence covers all 11 domains and includes expected MIL-1 blockers: TVM, IAM, SA, EDM, WM, and CA.
- OT and grid-edge evidence includes SCADA, ADMS, DERMS, DOE, CSIP-AUS, telemetry, vendor remote access, segmentation gaps, and OT-to-IT egress.
- Energy compliance evidence includes AER ring-fencing, Eastland Connect affiliate interactions, shared systems/staff, AEMO market/system interfaces, NMI and settlement flows, DER data exchange, and SOCI/CIRMP escalation.
- Diagram, data-flow, data-model, traceability, risk, and ADR handoff hooks are present through architecture diagrams, pseudo asset inventory, evidence index, vendor stack, and registers.

## Fixture B: Pass

Voltiq Analytics exercises the negative supplier / non-SOCI-covered-entity path:

- SOCI is expected to be stated as "Not a SOCI-covered entity" for Voltiq itself.
- Customer flow-down obligations remain testable, so the expected output should not collapse to "nothing to do".
- AESCSF is supplier-scoped with OT overlay explicitly non-applicable unless a customer grants direct OT access.
- Energy compliance evidence focuses on tenant isolation, DER analytics data handling, supplier notification obligations, secure development, sensitive-supplier exposure, and customer contractual flow-down.

## Summary Finding

The new `au-aescsf` and `au-energy-compliance` skills can be tested with the synthetic data. The fixture set exercises both the positive regulated-energy path and the negative supplier path, and the focused pytest coverage now verifies the key evidence anchors required by the command prompts and templates.

The live generation review confirms that the new inventory/register features are used where the fixture evidence supports them. Fixture A strongly triggers asset, interface, evidence, risk, and maturity inventory views. Fixture B triggers supplier-appropriate service, data, flow-down, subprocessor, and access inventories while correctly avoiding a forced OT asset inventory.

Future PR notes are captured in `LIVE_GENERATION_REVIEW.md`: add synthetic CMDB/service-inventory fixture data and richer evaluation rubrics later, and apply the same inventory/register enrichment pattern to the main AU federal menu using this synthetic data where it exercises cross-sector OT, SOCI/CIRMP, vendor access, and supplier flow-down behaviour.
