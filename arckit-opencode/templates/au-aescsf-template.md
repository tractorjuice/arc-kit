# AU AESCSF Maturity Assessment

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-aescsf`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Document Type: AUAESCSF -->
<!-- Classification line, where applicable, MUST be: -->
<!-- | Classification | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-aescsf` command | PENDING | PENDING |

---

## Executive Summary

[Summarise AESCSF scope, target maturity, current posture, highest-risk gaps, architecture evidence gaps, and top uplift priorities.]

---

## Energy Context and AESCSF Scope

[Describe the energy sub-sector, entity role, asset or platform, market participation, operational context, and AESCSF applicability assumptions.]

---

## Criticality and Target Maturity Profile

| Dimension | Current Position | Target / Rationale | Evidence |
|-----------|------------------|--------------------|----------|
| Service criticality | [Position] | [Target] | [Evidence] |
| Safety / reliability impact | [Position] | [Target] | [Evidence] |
| Market impact | [Position] | [Target] | [Evidence] |
| SOCI relevance | [Position] | [Target] | [AUSOCI reference] |
| Target AESCSF maturity | [Position] | [Target] | [Rationale] |

---

## Domain Maturity Assessment

| AESCSF Domain / Capability Area | Current Maturity | Target Maturity | Evidence | Gap | Owner |
|---------------------------------|------------------|-----------------|----------|-----|-------|
| [Domain] | [Current] | [Target] | [Evidence] | [Gap] | [Owner] |

---

## OT/IT and Grid-Edge Findings

[Summarise OT/IT boundary findings, grid-edge dependencies, DERMS / DOE / CSIP-AUS flows, telemetry, metering, vendor access, and operational constraints.]

---

## Architecture Evidence

| Evidence Required | Status | Artefact / Link | Owner | Gap |
|-------------------|--------|-----------------|-------|-----|
| OT/IT zone and conduit diagrams | [Current / Partial / Missing] | [Diagram] | [Owner] | [Gap] |
| IT/OT data flows | [Current / Partial / Missing] | [DFD] | [Owner] | [Gap] |
| DERMS / DOE / CSIP-AUS flows | [Current / Partial / Missing / N/A] | [DFD / diagram] | [Owner] | [Gap] |
| Vendor remote-access paths | [Current / Partial / Missing] | [Register / diagram] | [Owner] | [Gap] |
| Energy data-model dependencies | [Current / Partial / Missing] | [Data model] | [Owner] | [Gap] |
| Traceability and risk links | [Current / Partial / Missing] | [Traceability / risk] | [Owner] | [Gap] |

---

## IT/OT and Market Data Flows

| Flow | Source | Destination | Protocol / Interface | Data | Control | Evidence |
|------|--------|-------------|----------------------|------|---------|----------|
| [Flow] | [Source] | [Destination] | [Interface] | [Data] | [Control] | [Evidence] |

---

## Energy Data Model Dependencies

| Data Domain | Dependency | Owner | Classification / Sensitivity | Control / Evidence |
|-------------|------------|-------|------------------------------|--------------------|
| Asset / network model | [Dependency] | [Owner] | [Classification] | [Evidence] |
| DER / grid-edge | [Dependency] | [Owner] | [Classification] | [Evidence] |
| Metering / NMI | [Dependency] | [Owner] | [Classification] | [Evidence] |
| Settlement / market | [Dependency] | [Owner] | [Classification] | [Evidence] |
| Customer / billing | [Dependency] | [Owner] | [Classification] | [Evidence] |
| Telemetry / operations | [Dependency] | [Owner] | [Classification] | [Evidence] |

---

## Asset, Interface, and Evidence Inventory

| Register / Inventory | Source of Truth | Items in Scope | Owner | Visualisation / Scoring | Gap |
|----------------------|-----------------|----------------|-------|-------------------------|-----|
| OT asset inventory | [CMDB / asset register / AUOT] | [Zones, conduits, devices, control systems] | [Owner] | [Criticality / risk colour coding] | [Gap] |
| IT / service inventory | [ServiceNow / CMDB / diagram] | [Applications, services, infrastructure CIs] | [Owner] | [Support tier / dependency score] | [Gap] |
| Market and AEMO interface register | [Interface register / DFD] | [APIs, portals, B2B/B2M, files, telemetry] | [Owner] | [Availability / compliance status] | [Gap] |
| DER / metering / telemetry inventory | [Data model / asset register] | [DERMS, DOE, CSIP-AUS, meters, telemetry paths] | [Owner] | [Maturity / risk heat] | [Gap] |
| Vendor remote-access register | [Access register / AUOT / risk] | [Vendors, jump hosts, privileged sessions] | [Owner] | [Residual risk / control status] | [Gap] |
| Evidence and control register | [Traceability / graph-report / risk] | [Controls, obligations, evidence, tests] | [Owner] | [Coverage / readiness score] | [Gap] |

---

## Diagram and Traceability Handoffs

| Handoff | Required Update | Owner | Status |
|---------|-----------------|-------|--------|
| DFD | [IT/OT, market, DER, vendor access flows] | [Owner] | [Status] |
| Diagram | [Zones, conduits, market interfaces, grid-edge context] | [Owner] | [Status] |
| Data Model | [Energy data dependencies and ownership] | [Owner] | [Status] |
| ServiceNow / CMDB | [CIs, service dependencies, owners, support criticality] | [Owner] | [Status] |
| Traceability | [Requirements, controls, evidence, obligations] | [Owner] | [Status] |
| Risk | [Maturity gaps and treatment actions] | [Owner] | [Status] |
| Graph Report | [Coverage, cross-reference density, missing evidence links] | [Owner] | [Status] |

---

## AESCSF Anti-Pattern Register

| Anti-Pattern | Evidence | Impact | Treatment |
|--------------|----------|--------|-----------|
| [Anti-pattern] | [Evidence] | [Impact] | [Treatment] |

---

## Federal Baseline Cross-Reference

| Artefact | Reference | How Used | Gap / Follow-up |
|----------|-----------|----------|-----------------|
| AUE8 | [ARC-{P}-AUE8-v*] | [Enterprise cyber baseline] | [Gap] |
| AUISM | [ARC-{P}-AUISM-v*] | [Control evidence] | [Gap] |
| AUOT | [ARC-{P}-AUOT-v*] | [OT evidence] | [Gap] |
| AUSOCI | [ARC-{P}-AUSOCI-v*] | [Critical-infrastructure evidence] | [Gap] |

---

## Maturity Gaps and Risk Treatment

| Gap | Risk | Treatment | Owner | Due Date | Residual Risk |
|-----|------|-----------|-------|----------|---------------|
| [Gap] | [Risk] | [Treatment] | [Owner] | [Date] | [Residual risk] |

---

## Uplift Roadmap

| Horizon | Action | Owner | Evidence Update | Success Measure |
|---------|--------|-------|-----------------|-----------------|
| Immediate | [Action] | [Owner] | [Artefact] | [Measure] |
| 30-90 days | [Action] | [Owner] | [Artefact] | [Measure] |
| 90-180 days | [Action] | [Owner] | [Artefact] | [Measure] |
| Strategic | [Action] | [Owner] | [Artefact] | [Measure] |

---

## External References

| Ref | Source | Version / Publication Date | Access Date | Relevance |
|-----|--------|----------------------------|-------------|-----------|
| AESCSF | AEMO Australian Energy Sector Cyber Security Framework | [Version / date verified] | [YYYY-MM-DD] | Authoritative AESCSF anchor |
| AEMO-CYBER | AEMO cyber security resources | [Date verified] | [YYYY-MM-DD] | Energy-sector cyber context |
| AEMO-SYSTEMS | AEMO energy systems and interfaces | [Date verified] | [YYYY-MM-DD] | Market and operator interface context |
| CISC-SOCI | CISC SOCI Act 2018 guidance | [Date verified] | [YYYY-MM-DD] | Critical-infrastructure cross-reference |
| ASD-E8 | ASD Essential Eight | [Version / date verified] | [YYYY-MM-DD] | Enterprise cyber baseline |
| ASD-ISM | ASD Information Security Manual | [Edition / date verified] | [YYYY-MM-DD] | Control evidence baseline |

---

## Document Register

| Item | Value |
|------|-------|
| Document Type | AUAESCSF |
| Template Origin | Community |
| Command | `/arckit:au-aescsf` |
| AESCSF Version / Publication Date Verified | [Version / date] |
| AEMO Access Date | [YYYY-MM-DD] |
| AEMO Availability Notes | [Available / unavailable / partial; record attempts] |
| Qualified Review Required | [Energy cyber / OT / legal / regulatory / operational risk reviewer] |

---

**Generated by**: ArcKit `/arckit:au-aescsf` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
