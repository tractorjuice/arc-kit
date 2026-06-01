# AU Energy Live Generation Review

## Run Summary

- Date: 2026-05-30
- Method: Practical live model pass in the current Codex session using the public synthetic AU energy fixtures.
- Scope: Representative generation review for `au-aescsf` and `au-energy-compliance`, focused on whether the new inventory/register enrichment is naturally used by the model.
- Fixtures: Fixture A Eastland Energy Networks and Fixture B Voltiq Analytics.
- Limitation: This is not a full ArcKit plugin-runtime execution and not a legal, regulatory, or certification assessment. It is a live prompt-response quality check against synthetic evidence.

## Review Question

Does the synthetic data trigger the new inventory/register and visualisation guidance added to the AU energy commands and templates?

The review looked for these signals:

- `Asset, Interface, and Evidence Inventory` usage from `au-aescsf`.
- `Regulated Asset, Interface, and Data Inventory` usage from `au-energy-compliance`.
- Asset, interface, data, vendor-access, evidence, and obligation registers.
- Source-of-truth register or inventory references.
- ServiceNow / CMDB or service-inventory handoff.
- Data-model, DFD, diagram, traceability, risk, maturity, and graph-report handoffs.
- Visualisation or scoring language such as criticality colour, risk heat, maturity, readiness, or coverage score.
- Different behaviour for a regulated DNSP critical-asset case and a non-SOCI supplier case.

## Scoring Rubric

| Score | Meaning | Interpretation |
|-------|---------|----------------|
| Strong | Feature is clearly triggered by fixture evidence | Generated output should include specific rows, owners, source-of-truth references, and risk/maturity/criticality treatment. |
| Moderate | Feature is triggered but with narrower scope | Generated output should include the feature, but only for the subset supported by the fixture. |
| Partial | Feature is recommended but fixture evidence is incomplete | Generated output may identify the missing source of truth, such as absent CMDB or project-graph evidence. |
| N/A | Feature should not be forced | Generated output should explicitly mark the feature not applicable or out of scope. |

## Fixture A - Eastland Energy Networks

Live generation result: strong trigger for the new inventory/register features.

Fixture A strongly triggered the inventory/register enrichment because it includes OT asset, interface, evidence, ring-fencing, and compliance-register source material.

| Feature Signal | Observed Use | Evidence Trigger |
|----------------|--------------|------------------|
| OT asset inventory | Yes | `OT_pseudo_asset_inventory.md` includes sites, assets, criticality, health, anti-pattern flags, work orders, patch/lifecycle state, and failure-mode mappings. |
| Source-of-truth register framing | Yes | `Evidence_Index.md`, `OT_asset_register_sample.md`, `SOCI_CIRMP_attestation_register.md`, and `Ring_fencing_register_extract.md` provide named register-style sources. |
| Interface register | Yes | AEMO interfaces, MSATS, B2B e-Hub, DER Register, CER Data Exchange, DOE, CSIP-AUS, AMI, telemetry, and vendor access were surfaced. |
| Visualisation / scoring | Yes | Criticality, health, anti-pattern flags, MIL blockers, risk heat, and compliance/readiness scoring language were naturally used. |
| ServiceNow / CMDB handoff | Partial | The model used CMDB/service-inventory language and proposed a `/arckit:servicenow` handoff, but the fixture does not include an actual ServiceNow export. |
| Risk and maturity scoring | Yes | MIL-1 blockers, red/amber/green-style health, residual risk, and AESCSF maturity constraints were identified. |
| Graph-report / traceability coverage | Partial | The model suggested graph-report and traceability coverage checks, but no live project graph exists in the fixture-only run. |

Representative generated inventory row:

| Register / Inventory | Source of Truth | Items in Scope | Owner | Visualisation / Scoring | Gap |
|----------------------|-----------------|----------------|-------|-------------------------|-----|
| OT asset inventory | OT pseudo asset inventory / OT asset register | Zone substations, control centres, DERMS, AMI, OT WAN, relays, RTUs, jump hosts, historian | Head of Network Control / OT | Criticality, health, anti-pattern flag, open work order, patch lifecycle | Asset register lags ADMS/DERMS rollout and should be reconciled to CMDB/service inventory. |
| Market and AEMO interface register | Architecture diagrams / evidence index | MSATS, B2B e-Hub, DER Register, CER Data Exchange, DOE, CSIP-AUS, NEMWeb | GM Regulation & Compliance / Digital owner | Availability, compliance status, ring-fencing impact | Interface register needs explicit regulated/unregulated data-flow ownership. |
| Vendor remote-access register | OT asset inventory / vendor stack / risk register | ADMS vendor, protection vendor, jump hosts, always-on VPNs | CISO / OT owner | Residual risk heat and control status | Standing access and session recording gaps should feed AESCSF EDM and SOCI supply-chain risk. |

Fixture A conclusion:

The positive DNSP case exercises the new feature well. It naturally produces asset and interface inventory findings, register source-of-truth checks, colour/scoring language, and risk/maturity handoffs. The only partial areas are ServiceNow/CMDB and graph-report because the synthetic fixture includes register-like evidence but not a live CMDB export or ArcKit project graph.

## Fixture B - Voltiq Analytics

Live generation result: selective trigger for supplier-focused inventory/register features.

Fixture B selectively triggered the inventory/register enrichment because it has supplier, flow-down, service, data, subprocessor, and access evidence, while correctly lacking OT asset inventory evidence.

| Feature Signal | Observed Use | Evidence Trigger |
|----------------|--------------|------------------|
| OT asset inventory | Not applicable | Fixture B explicitly states Voltiq has no OT of its own and should mark the OT overlay N/A unless customer access changes. |
| Source-of-truth register framing | Partial | The fixture has customer flow-down requirements, engagement scope, and interview evidence, but no formal CMDB, asset inventory, or service catalogue export. |
| Interface register | Yes | Client APIs, DOE outputs, customer data ingestion, support access, Azure hosting, and subprocessor disclosures were surfaced. |
| Visualisation / scoring | Yes | Supplier criticality, tenant-isolation risk, notification timing, and subprocessor/dependency gaps were framed as risk or readiness status. |
| ServiceNow / CMDB handoff | Partial | The model proposed service inventory / CMDB evidence as an optional handoff for SaaS components and support ownership, but fixture data does not provide SNOW-style CI evidence. |
| Risk and maturity scoring | Yes | Supplier-scoped AESCSF gaps, SOC 2 readiness, E8 maturity, privacy handling, and incident notification flow-down were scored qualitatively. |
| Graph-report / traceability coverage | Partial | The model proposed traceability from customer obligations to controls and evidence, but no live project graph exists in the fixture-only run. |

Representative generated inventory row:

| Register / Inventory | Source of Truth | Items in Scope | Owner | Visualisation / Scoring | Gap |
|----------------------|-----------------|----------------|-------|-------------------------|-----|
| Supplier service inventory | Engagement scope / SaaS architecture evidence | Multi-tenant Azure SaaS, DOE calculation service, client data ingestion, support access | CTO / Head of Security | Tenant criticality and support-risk status | No formal service catalogue or CMDB extract is provided. |
| Customer flow-down obligation register | Customer flow-down requirements | AESCSF alignment, incident notification, data residency, sensitive-supplier provisions, audit rights | CTO / commercial owner | Coverage/readiness score by obligation | Flow-down obligations are identified but not mapped to named controls and evidence. |
| Data and subprocessor register | Strategic context / CTO interview | DER/NMI data, Azure regions, sub-SaaS tools, open-source dependencies | Security / platform owner | Privacy classification, fourth-party risk heat | Subprocessor disclosure and dependency inventory are ad hoc. |

Fixture B conclusion:

The negative supplier case correctly does not force OT asset inventory or SOCI-responsible-entity inventory. It does trigger supplier-appropriate inventories: customer flow-down obligations, SaaS/service inventory, client data handling, access paths, subprocessors, and open-source dependency gaps. This is useful evidence that the new feature behaves proportionately rather than treating every energy-sector participant as a DNSP.

Negative assertion: a correct Fixture B output should not invent a DNSP-style OT asset register, SOCI responsible-entity register, or AER ring-fencing register for Voltiq. It should mark those areas not applicable and pivot to supplier-scoped service, data, access, customer-flow-down, and subprocessor inventories.

## Overall Findings

| New Feature Area | Fixture A | Fixture B | Evaluation Note |
|------------------|-----------|-----------|-----------------|
| Asset inventory | Strong | N/A | DNSP asset evidence triggers this strongly; supplier case correctly marks it not applicable. |
| Interface register | Strong | Moderate | AEMO/market/DER interfaces trigger strongly in Fixture A; client API/DOE interfaces trigger in Fixture B. |
| Data register / catalogue | Strong | Strong | Both fixtures trigger data register thinking, with different regulated-vs-supplier scope. |
| Vendor/subprocessor register | Strong | Strong | Fixture A triggers OT vendor remote access; Fixture B triggers Azure/sub-SaaS/open-source dependency inventory. |
| ServiceNow / CMDB | Partial | Partial | The commands now request it, but neither fixture contains a real CMDB export. Optional `SERVICE_INVENTORY` remains appropriately default-off. |
| Visualisation / scoring | Strong | Moderate | Fixture A naturally supports criticality, health, anti-pattern, MIL, and risk heat views. Fixture B supports risk/readiness scoring but less infrastructure colour coding. |
| Graph-report / traceability | Partial | Partial | Useful as a recommended handoff, but requires a live ArcKit project graph rather than fixture-only inputs. |

## Recommendation

Keep the inventory/register enrichment in the PR. The live pass shows the feature is used when evidence exists and does not overreach when evidence is absent.

## Future PR Candidates

The most useful future fixture improvement would be to add an optional synthetic service inventory / CMDB extract for both fixtures:

- Fixture A: regulated service CIs, OT/IT dependencies, support criticality, and owner fields.
- Fixture B: SaaS components, Azure services, subprocessors, customer data stores, support paths, and owner fields.

That would let a future run exercise the default-off `SERVICE_INVENTORY` target more fully without making ServiceNow mandatory for the recipe.

Additional future evaluation improvements:

- Add an expected visualisation rubric for colour-coded criticality, maturity, risk heat, and register-coverage scoring.
- Add generated sample excerpts for a small number of inventory/register rows, while avoiding full generated artefact bloat.
- Add a third synthetic fixture for a retailer, VPP, EV charging operator, gas participant, or market participant edge case.
- Add a repeatable live-generation harness if ArcKit gains a standard plugin-runtime test runner for command outputs.

Related AU federal follow-up:

- Apply the same inventory/register enrichment pattern to the main AU federal menu, especially `au-ot-security` and `au-soci-cirmp`.
- Reuse this synthetic data where appropriate because Fixture A already includes OT asset inventory, SOCI/CIRMP, vendor access, evidence index, and register-style source material, while Fixture B exercises supplier flow-down and non-applicability behaviour.
- Keep the federal enhancement general and cross-sector: CMDB/service inventory, asset and interface registers, vendor access registers, evidence/control registers, visual scoring, and traceability/graph-report handoffs should not be energy-only concepts.
