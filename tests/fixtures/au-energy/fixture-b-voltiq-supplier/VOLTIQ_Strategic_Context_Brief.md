# Voltiq Analytics — Strategic Context Brief

## Supplier Cyber Posture Assessment (AESCSF alignment + SOCI supply-chain): Phase 1

**Prepared:** 11 May 2026
**Author:** Synthetic assessment team
**Client:** Voltiq Analytics Pty Ltd
**Sponsor:** Chief Technology Officer (synthetic role)
**Purpose:** Strategic context for an `au-energy` validation of the **negative / non-SOCI** case — a software & advisory supplier to the energy sector that is **not** a designated critical-asset operator.

---

> ## ⚠️ SYNTHETIC COMPOSITE — TEST FIXTURE ONLY
>
> **Voltiq Analytics is a fictional composite organisation** created solely to validate the ArcKit `au-energy` recipe's handling of the **non-SOCI supplier** case — i.e. the recipe's graceful "Not a SOCI-covered entity" path and its **supplier-scoping** behaviour (assess the supplier's exposure surface, not the client's full estate). Built using the Forrester TEI composite method from public information about the Australian DER/analytics vendor landscape. **Not a real company, person, or client.** See `../REFERENCES_AND_METHODOLOGY.md`.

---

## 1. COMPANY PROFILE

- **Legal entity:** Voltiq Analytics Pty Ltd (incorporated Victoria; illustrative)
- **What it does:** Energy data analytics **SaaS + advisory** — DER/network forecasting, **Dynamic Operating Envelope (DOE) calculation-as-a-service**, hosting-capacity analytics, and AESCSF/compliance advisory.
- **Customers:** Electricity DNSPs and energy retailers (several of which are themselves SOCI-designated critical-asset operators).
- **Headcount:** ~120 (Melbourne HQ + Sydney).
- **Hosting:** Pure cloud — **Microsoft Azure** (Australia East / Southeast). No data centres of its own.
- **Ownership:** Founder-led; minority VC investment.

## 2. WHY THIS IS THE NEGATIVE CASE

Voltiq is squarely in the energy sector but is **not** a responsible entity for a designated critical asset:

- It does **not** operate a network, generation, or market-critical asset.
- It does **not** run a *critical* data centre (it consumes Azure) → not a "data storage or processing" critical asset.
- It is **not** AEMO-registered as a network/market participant in any critical-asset sense.

→ The `au-soci-cirmp` recipe should conclude **"Not a SOCI-covered entity / not a responsible entity for a designated critical asset"** and produce the useful non-applicability statement (valuable for tender responses), **while** noting two real exposures:

1. **Flow-down obligations** — its SOCI-covered customers contractually push SOCI supply-chain and cyber requirements onto Voltiq.
2. **Sensitive-supplier exposure** — because Voltiq touches DOE/constraint data and feeds outputs that can influence a client's network operations, customers may treat it as a sensitive supplier under SOCI supplier-influence provisions.

This is precisely the behaviour the `au-energy` validation needs to confirm.

## 3. AESCSF — SUPPLIER-SCOPED

Voltiq's customers require AESCSF alignment for suppliers touching their data and OT-adjacent systems. So `au-aescsf` should run **scoped to Voltiq's exposure surface** — what Voltiq systems touch client OT/IT/market data — **not** a client's full estate. Key points:

- **OT overlay = N/A** — Voltiq has no OT of its own. The recipe should explicitly record the **IT-only scope** rather than skipping the overlay silently.
- The exposure surface is its **multi-tenant Azure SaaS**, its **client data ingestion** (constraint data, customer DER data via APIs / CSIP-AUS / CER Data Exchange), its **DOE calculation outputs** (which a client may consume into operational decisions), and its **remote access** into/adjacent to client environments for support.

## 4. EXPOSURE SURFACE & ESTATE

| Element | Detail | Risk note |
|---------|--------|-----------|
| Multi-tenant SaaS | Several DNSP/retailer tenants co-resident on Azure | **Tenant isolation** is the headline risk |
| Data ingested | Network constraint data, customer DER/NMI-level data | Privacy (APP) + client-confidential + flow-down |
| DOE calc service | Outputs may influence client network operations | Supply-chain-into-operations integrity vector |
| Client connectivity | API integration; support remote access | Access into/adjacent to SOCI-covered clients |
| Open-source components | Used in the analytics/DER stack | Dependency inventory incomplete |
| Subprocessors | Azure + a few sub-SaaS tools | Fourth-party risk; flow-down |

## 5. COMPLIANCE POSTURE (CURRENT)

| Framework | State | Gap |
|-----------|-------|-----|
| AESCSF (supplier-scoped) | Informal alignment; no formal assessment | First formal supplier-scoped assessment is this engagement |
| SOCI | **Not a covered entity** | Must evidence flow-down + sensitive-supplier posture to customers |
| Essential Eight | Customer-driven; ~ML1, ML2 in parts | Patchy across the dev estate |
| ISM | Loosely aligned | No formal applicability statement |
| Privacy Act / APP | Handles client + customer data | DER/NMI-level data handling needs APP rigour; data-processor role vs controller unclear |
| NDB | Basic breach process | Interaction with customers' SOCI clocks undefined |
| SOC 2 | **Type II in progress** | Customers increasingly require it |

## 6. CITATION SCOPE (Track A)

Citeable inputs for an `au-energy` run against Fixture B: this brief, `VOLTIQ_Engagement_Scope.md`, `interviews/01_CTO_Security_interview_extracted.md`, and `VOLTIQ_Customer_Flowdown_Requirements.md`.

---

*Prepared as a synthetic test fixture for the ArcKit `au-energy` recipe (negative case). Not a real engagement.*
