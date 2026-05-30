# AU Energy Compliance Pack

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:au-energy-compliance`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Document Type: AUENERGY -->
<!-- Classification line, where applicable, MUST be: -->
<!-- | Classification | UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:au-energy-compliance` command | PENDING | PENDING |

---

## Executive Summary

[Summarise energy-sector applicability, ring-fencing posture, NER / NGR and AEMO interface implications, SOCI escalation gaps, architecture evidence status, and recommendations.]

---

## Energy-Sector Applicability

[Identify energy sub-sector, entity role, regulated services, affiliates, market participant status, system-operator interactions, gas or electricity context, DER, metering, settlement, and customer data scope.]

---

## AER Ring-Fencing Assessment

| Boundary / Obligation Area | Current Position | Evidence | Gap | Qualified Review Needed |
|----------------------------|------------------|----------|-----|-------------------------|
| Regulated / unregulated business boundary | [Position] | [Evidence] | [Gap] | [Yes / No] |
| Shared services | [Position] | [Evidence] | [Gap] | [Yes / No] |
| Staff and system access | [Position] | [Evidence] | [Gap] | [Yes / No] |
| Affiliate data sharing | [Position] | [Evidence] | [Gap] | [Yes / No] |
| Waivers / exemptions | [Position] | [Evidence] | [Gap] | [Yes / No / N/A] |

---

## NER / NGR and AEMO Obligation Mapping

| Obligation Area | Source | Architecture Impact | Evidence | Owner |
|-----------------|--------|---------------------|----------|-------|
| [NER / NGR / AEMO area] | [Source] | [Impact] | [Evidence] | [Owner] |

---

## Energy-Specific SOCI Interpretation

| SOCI Topic | Applicability | Evidence | Escalation / Follow-up |
|------------|---------------|----------|------------------------|
| Critical asset class | [Position] | [AUSOCI reference] | [Follow-up] |
| CIRMP hazard | [Position] | [Evidence] | [Follow-up] |
| Protected information | [Position] | [Evidence] | [Follow-up] |
| SOCI incident escalation | [Position] | [Runbook / contact path] | [Follow-up] |

---

## Market and System-Operator Interface Register

| Interface | Operator / Counterparty | Purpose | Data | Control | Evidence |
|-----------|-------------------------|---------|------|---------|----------|
| [AEMO / market / system interface] | [Counterparty] | [Purpose] | [Data] | [Control] | [Evidence] |

---

## DER, Metering, Settlement, and Customer Data Implications

| Domain | Data / Process | Regulated Impact | Privacy / Security Impact | Evidence |
|--------|----------------|------------------|---------------------------|----------|
| DER / DERMS / DOE / CSIP-AUS | [Data / process] | [Impact] | [Impact] | [Evidence] |
| Metering / NMI | [Data / process] | [Impact] | [Impact] | [Evidence] |
| Settlement / market | [Data / process] | [Impact] | [Impact] | [Evidence] |
| Customer / billing | [Data / process] | [Impact] | [Impact] | [Evidence] |

---

## Regulated Asset, Interface, and Data Inventory

| Register / Inventory | Source of Truth | Items in Scope | Owner | Visualisation / Scoring | Gap |
|----------------------|-----------------|----------------|-------|-------------------------|-----|
| Regulated service inventory | [Service catalogue / CMDB] | [Regulated services, shared services, support tiers] | [Owner] | [Ring-fencing status / criticality colour] | [Gap] |
| Critical asset inventory | [SOCI register / asset register / AUSOCI] | [Critical electricity, gas, market, or system assets] | [Owner] | [SOCI applicability / residual risk] | [Gap] |
| AEMO and market interface register | [Interface register / DFD] | [APIs, portals, B2B/B2M, files, telemetry] | [Owner] | [Compliance / availability status] | [Gap] |
| Regulated / unregulated data register | [Data model / data catalogue] | [Customer, NMI, meter, settlement, affiliate, operational data] | [Owner] | [Permitted use / classification] | [Gap] |
| Vendor and affiliate access register | [Access register / contracts / AUOT] | [Vendor, affiliate, support, privileged paths] | [Owner] | [Control status / risk heat] | [Gap] |
| Obligation and evidence register | [Traceability / graph-report] | [NER, NGR, AER, AEMO, SOCI, privacy evidence] | [Owner] | [Coverage / readiness score] | [Gap] |

---

## Architecture Evidence

| Evidence Required | Status | Artefact / Link | Owner | Gap |
|-------------------|--------|-----------------|-------|-----|
| Ring-fencing boundary diagrams | [Current / Partial / Missing] | [Diagram] | [Owner] | [Gap] |
| Regulated / unregulated data-flow maps | [Current / Partial / Missing] | [DFD] | [Owner] | [Gap] |
| AEMO interface maps | [Current / Partial / Missing / N/A] | [Diagram / interface register] | [Owner] | [Gap] |
| SOCI incident escalation | [Current / Partial / Missing / N/A] | [AUSOCI / runbook] | [Owner] | [Gap] |
| Energy data model | [Current / Partial / Missing] | [Data model] | [Owner] | [Gap] |

---

## Regulated / Unregulated Data Flows

| Flow | Source | Destination | Data Classification | Ring-Fencing Control | Evidence |
|------|--------|-------------|---------------------|----------------------|----------|
| [Flow] | [Source] | [Destination] | [Classification] | [Control] | [Evidence] |

---

## Energy Data Model Dependencies

| Entity / Data Domain | Regulated Use | Unregulated Use | Owner | Control / Evidence |
|----------------------|---------------|-----------------|-------|--------------------|
| Network asset | [Use] | [Use] | [Owner] | [Evidence] |
| Customer / account | [Use] | [Use] | [Owner] | [Evidence] |
| NMI / meter | [Use] | [Use] | [Owner] | [Evidence] |
| DER / device | [Use] | [Use] | [Owner] | [Evidence] |
| Market transaction / settlement | [Use] | [Use] | [Owner] | [Evidence] |
| Telemetry / operational event | [Use] | [Use] | [Owner] | [Evidence] |

---

## Diagram and Traceability Handoffs

| Handoff | Required Update | Owner | Status |
|---------|-----------------|-------|--------|
| DFD | [Regulated/unregulated, market, AEMO, customer, DER flows] | [Owner] | [Status] |
| Diagram | [Ring-fencing boundary and AEMO interface maps] | [Owner] | [Status] |
| Data Model | [Energy data dependencies and permitted usage] | [Owner] | [Status] |
| ServiceNow / CMDB | [Service CIs, support tiers, dependencies, owners] | [Owner] | [Status] |
| Traceability | [Obligations, requirements, controls, evidence] | [Owner] | [Status] |
| Graph Report | [Coverage, cross-reference density, missing evidence links] | [Owner] | [Status] |

---

## Architecture Decision Seeds

| Decision Topic | Why It Matters | Options / Notes | Recommended Owner |
|----------------|----------------|-----------------|-------------------|
| [ADR topic] | [Reason] | [Options] | [Owner] |

---

## Evidence Gaps and Recommendations

| Priority | Gap | Recommendation | Owner | Due Date | Qualified Review |
|----------|-----|----------------|-------|----------|------------------|
| [Priority] | [Gap] | [Recommendation] | [Owner] | [Date] | [Reviewer] |

---

## External References

| Ref | Source | Version / Date Verified | Access Date | Relevance |
|-----|--------|-------------------------|-------------|-----------|
| AER-RF | AER ring-fencing guideline | [Version / date verified] | [YYYY-MM-DD] | Ring-fencing obligations |
| AER | Australian Energy Regulator | [Date verified] | [YYYY-MM-DD] | Regulatory context |
| AEMC-NER | AEMC National Electricity Rules | [Version / date verified] | [YYYY-MM-DD] | Electricity obligations |
| AEMC-NGR | AEMC National Gas Rules | [Version / date verified] | [YYYY-MM-DD] | Gas obligations |
| AEMO | AEMO energy systems and interfaces | [Date verified] | [YYYY-MM-DD] | Market and operator interfaces |
| CISC-SOCI | CISC SOCI Act 2018 guidance | [Date verified] | [YYYY-MM-DD] | Critical-infrastructure obligations |
| OAIC | OAIC Privacy Act and Australian Privacy Principles | [Date verified] | [YYYY-MM-DD] | Customer and personal information |

---

## Document Register

| Item | Value |
|------|-------|
| Document Type | AUENERGY |
| Template Origin | Community |
| Command | `/arckit:au-energy-compliance` |
| AER / AEMC / AEMO / CISC Versions Checked | [Versions / dates] |
| Access Date | [YYYY-MM-DD] |
| Qualified Review Required | [Legal / regulatory / energy compliance / privacy / cyber / OT reviewer] |

---

**Generated by**: ArcKit `/arckit:au-energy-compliance` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
