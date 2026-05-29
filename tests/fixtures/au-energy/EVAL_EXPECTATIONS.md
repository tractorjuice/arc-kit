# AU Energy Fixture Evaluation Expectations

## Fixture A - Eastland Energy Networks

Expected result: applicable DNSP / critical electricity asset case.

- AESCSF assessment identifies all 11 domains.
- Overall maturity is constrained by MIL-1 domains.
- Expected MIL-1 blockers include TVM, IAM, SA, EDM, WM, and CA.
- OT overlay is populated, including SCADA, ADMS, DERMS, DOE, vendor remote access, CSIP-AUS, and grid-edge connectivity.
- SOCI/CIRMP applies and uses the general `au-soci-cirmp` baseline.
- AER ring-fencing applies because the regulated DNSP and Eastland Connect share systems, staff, data, identity, and branding pressure points.
- Energy compliance findings include AEMO market/system interfaces, NER obligations, DER data exchange, dynamic operating envelopes, and incident escalation.

## Fixture B - Voltiq Analytics

Expected result: supplier / negative SOCI-covered-entity case.

- SOCI applicability states "Not a SOCI-covered entity" for Voltiq itself.
- The output still surfaces flow-down obligations from covered energy customers.
- AESCSF is supplier-scoped rather than DNSP/operator-scoped.
- OT overlay is explicitly not applicable unless Voltiq is granted direct OT access by a customer.
- Findings focus on tenant isolation, customer energy data, DER analytics, sensitive-supplier exposure, secure development, and notification flow-down.

## Evaluation Success Criteria

- Positive and negative applicability paths are both exercised.
- Energy-specific obligations are not folded into the general AU federal recipe.
- `au-energy` consumes `au-ot-security` and `au-soci-cirmp` outputs rather than duplicating those commands.
- Evaluation notes identify expected-vs-observed gaps clearly enough for future contributors to improve fixtures or command prompts.
