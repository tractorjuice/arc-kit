# Eastland Energy Networks — Strategic Context Brief

## Critical Infrastructure Cyber & Compliance Assessment: Phase 1

**Prepared:** 4 May 2026
**Author:** Synthetic assessment team
**Client:** Eastland Energy Networks Pty Ltd (trading as "Eastland Power")
**Sponsor:** Chief Information Security Officer (synthetic role)
**Purpose:** Consolidated strategic context for ArcKit `au-energy` modelling — AESCSF capability assessment, SOCI Act / CIRMP, and AER ring-fencing — composing on top of the `au-federal` baseline (E8, ISM, Privacy/NDB).

---

> ## ⚠️ SYNTHETIC COMPOSITE — TEST FIXTURE ONLY
>
> **Eastland Energy Networks (EEN) is a fictional composite organisation** created solely to validate the ArcKit `au-energy` recipe (`au-aescsf`, `au-soci-cirmp`) and the AER ring-fencing ADR seeds. Following the **Forrester TEI "composite organisation" method**, EEN's profile is assembled from *publicly available* sources: AER 2026–31 Victorian DNSP regulatory proposals (and the 2024–29 NSW / 2025–30 SA & QLD resets), AER/EMCa expenditure reviews, and AEMO public program materials. **It does not represent, and must not be attributed to, any real distribution network, any named individual, or any real advisor's past clients.** All entity names, financials, system names, and findings are illustrative. Real third-party standards, programs, and open-source projects (AESCSF, SOCI Act, CER Data Exchange, CSIP-AUS, etc.) are cited only as the public backdrop a network of this archetype would operate within.

---

## 1. COMPANY PROFILE

### Identity

- **Legal Entity:** Eastland Energy Networks Pty Ltd (ABN illustrative; incorporated Victoria)
- **Trading Name:** Eastland Power
- **Sector:** Electricity Distribution Network Service Provider (DNSP) — regulated monopoly
- **Jurisdiction:** Victoria (National Electricity Market participant)
- **Regulatory period:** AER electricity distribution determination 2026–31 (current revised proposal lodged)
- **Headcount:** ~1,150 employees + ~600 field/works contractors at peak
- **Geographic footprint:** Eastern/peri-urban Melbourne corridor plus rural east — mixed CBD-fringe, suburban, and long rural feeders

### Network at a glance (illustrative composite figures)

| Metric | Value |
|--------|-------|
| Customer connections | ~770,000 |
| Distribution line length | ~55,000 km (overhead + underground) |
| Zone substations | ~220 |
| Distribution transformers | ~95,000 |
| Smart meters (AMI) | ~760,000 (near-universal, post-Victorian AMI rollout) |
| Regulated Asset Base (RAB) | ~$4.6B |
| 2026–31 proposed total revenue | ~$3.2B |
| 2026–31 proposed total capex | ~$2.1B (≈ +20% on 2021–26, consistent with sector trend) |

### Ownership & control

- **50/50 consortium:** *Meridian Infrastructure Partners* (Australian superannuation-backed infrastructure investor) and *Hanwell Asset Management* (offshore infrastructure investor, Singapore-domiciled fund).
- Offshore co-ownership means **FIRB history and SOCI ownership/control considerations** are live — relevant to the SOCI "register of critical infrastructure assets" obligations and any foreign-influence assessment.
- Board: 8 directors (4 per shareholder) + independent Chair. **Risk & Audit Committee** is the body that approves the annual SOCI CIRMP attestation.

### Leadership (illustrative)

| Role | Holder | Notes |
|------|--------|-------|
| CEO | Synthetic role holder | Ex-transmission, 20+ yrs network operations |
| Chief Operating Officer (Networks) | Synthetic role holder | Owns field, control room, asset management |
| Chief Information Security Officer | Synthetic role holder | **Engagement sponsor**; owns cyber across IT + OT |
| Head of Network Control / OT | Synthetic role holder | Control centre, SCADA/ADMS, protection, OT comms |
| Chief Digital & Information Officer | Synthetic role holder | Corporate IT, data platform, ADMS/DERMS programs |
| GM Regulation & Compliance | Synthetic role holder | AER determination, ring-fencing, SOCI lodgements |
| GM Eastland Connect (unregulated) | Synthetic role holder | Contestable connections, EV, solar/battery, fibre |

---

## 2. REGULATORY & MARKET CONTEXT

EEN sits inside an unusually dense regulatory stack — this is what makes it a meaningful `au-energy` test fixture.

### 2.1 Economic regulation (AER)

- Revenue-capped DNSP under the **National Electricity Rules**; 2026–31 determination in train.
- **AER Ring-fencing Guideline (electricity DNSPs)** applies because EEN runs an unregulated arm (**Eastland Connect** — see §4). This drives separation of regulated/unregulated activities, staff-sharing controls, branding separation, and **information-flow controls** (e.g. network data must not advantage the unregulated DER/EV business).

### 2.2 Market participation (AEMO)

- Registered DNSP in the NEM; interfaces to **MSATS**, **B2B e-Hub**, metering/settlement (post **5-minute & Global Settlement**), and the **DER Register**.
- Actively onboarding to AEMO's **Consumer Energy Resources (CER) Data Exchange** (AEMO's industry co-designed common digital infrastructure for CER; an independent cost-benefit analysis cited multi-billion-dollar 20-year sector benefits).
- Building **Dynamic Operating Envelopes (DOE)** capability and DER comms via **CSIP-AUS** (the Australian Common Smart Inverter Profile, built on **IEEE 2030.5 / SEP2**, developed under ARENA's DEIP).
- Exposed to the **NEM Reform Program** workstreams: **Flexible Trading Arrangements (FTA)**, **Integrating Price-Responsive Resources (IPRR)**, and ongoing settlement reform — all of which push market/IT logic deeper into network/OT operations.
- Subject to the **Victorian Emergency Backstop Mechanism (VEBM)** — must be able to remotely curtail customer solar (a control action that spans customer device → comms → DERMS → OT).

### 2.3 Critical infrastructure (SOCI Act 2018)

- EEN operates a **distribution network servicing > 100,000 customers** → a **designated "critical electricity asset"** under the SOCI Act and the **Security of Critical Infrastructure (Critical infrastructure risk management program) Rules (LIN 23/006)**.
- Consequences: a **Critical Infrastructure Risk Management Program (CIRMP)** covering the four hazard categories (cyber, personnel, physical, supply chain); **annual board-approved CIRMP report** to CISC (Department of Home Affairs); and **mandatory cyber incident reporting** (12 hours for critical impact, 72 hours for relevant impact).
- The cyber hazard chapter of the CIRMP must adopt a recognised framework — EEN uses **AESCSF** (and maps to E8 ML2 / ISM).

### 2.4 Energy-sector cyber maturity (AESCSF)

- **AEMO Criticality Assessment Tool (CAT)** result: **High** criticality → target maturity profile pursues **MIL-3** for the most safety/operationally-critical domains, **MIL-2** elsewhere.
- Last AESCSF self-assessment (FY2024 cycle) is ~18 months old and predates the ADMS/DERMS build — i.e. **stale relative to the current OT estate**.

---

## 3. ASSESSMENT NORTH STAR

Five dimensions the assessment measures current state against (energy-sector adaptation):

1. **OT/IT Convergence Security** — as ADMS, DERMS and analytics pull OT telemetry into IT platforms, is the security model keeping pace, or are IT and OT still governed as separate worlds?
2. **AESCSF Maturity** — credible, evidence-backed MIL position per domain, with the OT overlay and anti-patterns surfaced (not just an IT-centric E8 view).
3. **SOCI / CIRMP Defensibility** — an all-hazards CIRMP that would survive a CISC review, with a board-attestable annual report and a tested 12-hour incident-reporting pipeline.
4. **Ring-fencing Integrity** — demonstrable separation between the regulated network and Eastland Connect, especially information flows and shared systems.
5. **Critical-Asset Resilience** — control-centre redundancy, OT supplier dependency, and the ability to operate the network through a cyber or comms event.

---

## 4. OPERATING MODEL & THE UNREGULATED ARM (RING-FENCING)

EEN runs two businesses under one corporate roof:

- **Regulated DNSP (the network):** poles, wires, zone substations, control room, metering, connections to the standard control service.
- **Eastland Connect (unregulated, contestable):** public **EV charging** network, **behind-the-meter solar & battery** sales/installation, **contestable connection** works, and a small **dark-fibre / OT-telco leasing** business (spare capacity on EEN's private fibre).

**Ring-fencing pressure points (seeded for the assessment):**

- Eastland Connect staff also hold roles in the regulated business; **shared SharePoint and CRM** tenancy with imperfect information barriers.
- Network data (constraint maps, DOE outputs, connection pipeline) is operationally useful to the EV/solar arm → **AER ring-fencing information-flow risk**.
- Shared corporate services (HR, finance, parts of IT/identity) need a **documented cost-allocation and access-segregation** position.
- Branding separation between "Eastland Power" (network) and "Eastland Connect" not consistently applied.

---

## 5. TECHNOLOGY ESTATE — CURRENT STATE

> EEN is **hybrid**, not pure-cloud: a regulated network necessarily runs real-time OT on-premises and at the grid edge, while corporate IT and analytics are cloud-first. The convergence seam between the two is the central risk theme.

### 5.1 Operational Technology (OT) — control & grid edge

| System / layer | Current state | Convergence / risk note |
|----------------|---------------|--------------------------|
| **SCADA / DMS** | Legacy vendor SCADA (15+ yrs), being replaced under the ADMS program | Real-time control; historically air-gapped, now feeding IT analytics |
| **ADMS (new)** | Advanced Distribution Management System mid-rollout (network model + real-time + power-flow) | Pulls from **GIS** (IT) and pushes to **DERMS/DOE** — IT/OT/market blur |
| **OMS** | Outage Management System integrated to ADMS and the customer comms/IT platform | Outbound SMS/portal = IT; inbound device data = OT |
| **DERMS / DOE engine** | New build; calculates Dynamic Operating Envelopes; talks **CSIP-AUS / IEEE 2030.5** to customer inverters | Spans customer device → comms → network OT → AEMO market |
| **AMI head-end + MDM** | Near-universal smart meters; head-end system + Meter Data Management | Meter data used for billing (IT), settlement (market) **and** LV visibility (OT) |
| **Protection & control** | ~220 zone substations; mix of modern IEDs and **legacy relays/RTUs, some unpatchable** | Anti-pattern candidate: legacy controllers, long lifecycles |
| **OT network / telecoms** | Private fibre backbone + point-to-point radio + **growing 4G/5G for pole-top devices** | Cellular grid-edge expands the OT attack surface |
| **Control centre** | Primary control room + secondary DR site | DR site dependency; some **shared operator console logins** in legacy areas (anti-pattern) |
| **Vendor remote access** | ADMS and protection vendors connect for support | Some **legacy always-on VPNs / jump-host gaps** (anti-pattern + SOCI supply-chain) |

### 5.2 Information Technology (IT) — corporate & data

- **Microsoft 365 + Azure** tenant (Entra ID); on-prem **Active Directory** still authoritative for some OT-adjacent systems → **fragmented identity**.
- **SAP S/4HANA** — ERP, finance, asset accounting, regulatory cost allocation.
- **GIS** (network model / spatial; CIM-based feed to ADMS).
- **EAM** (enterprise asset management — works, inspections, maintenance).
- **CRM + customer self-service portal** (connections, outages, life-support register).
- **Azure data platform (Databricks-class)** — network analytics, predictive maintenance, DER forecasting; ingests OT telemetry → **OT-to-IT data egress** is a security/architecture question.
- **Power BI** — regulatory, operational and board reporting.
- Market data interfaces draw on AEMO's **MMS/EMMS data model** via **NEMWeb**; some teams use open tooling (**OpenNEM/`nemweb`**, NEMOSIS) for analysis.

### 5.3 Identity, monitoring & people

- **SOC:** hybrid — internal security team + external **MSSP**; SIEM covers IT well, **OT telemetry coverage is partial** (no dedicated OT monitoring platform yet — funded under the uplift program).
- **IAM:** MFA broadly on IT; **privileged access to OT is weaker** (shared/console accounts, slow joiner-mover-leaver for field/contractor staff).
- **Workforce:** field crews and contractors have OT access; **vetting/clearance for OT contractors is inconsistent** (personnel-hazard candidate).

---

## 6. MAJOR PROGRAMS 2026–31 (THE IT/OT-CONVERGENT PORTFOLIO)

These are modelled on the program *types* DNSPs are actually funding in the 2026–31 (and 2024–29 / 2025–30) resets and on AEMO's public reform program. They are the substance the assessment will test.

1. **ADMS Replacement & SCADA Convergence** — retire legacy SCADA/DMS; stand up modern ADMS with a unified real-time network model. Highest OT-security blast radius.
2. **DER Integration & Dynamic Operating Envelopes** — DERMS build + DOE engine + **CSIP-AUS / IEEE 2030.5** customer-inverter comms; pilots referenced **Project EDGE**-style operating-envelope work and open-source export-control patterns (e.g. `open-dynamic-export`).
3. **CER Data Exchange Onboarding** — connect to AEMO's CER Data Exchange common digital infrastructure (data sharing, market access, DER coordination).
4. **Dynamic Tariff & Billing Uplift (FTA-ready)** — metering/billing modernisation to support dynamic/flexible tariffs and Private Metering Arrangements (mirrors the publicly reported ~$200m+ dynamic-tariff billing investments in the sector).
5. **AMI Refresh & Metering Contestability** — head-end + MDM upgrade; readiness for metering contestability reforms.
6. **Cyber & OT Security Uplift Program** (~$45–60m over the period) — IT/OT SOC convergence, **OT network monitoring (Claroty/Nozomi-class)**, OT-IT segmentation, IAM uplift, E8 ML2 sustainment, **AESCSF MIL-2 → MIL-3** for critical domains, and **SOCI CIRMP gap closure**. *(The AER's own consultant reviews of DNSP cyber expenditure explicitly weigh E8 and CIRMP — this program is the test fixture's compliance engine.)*
7. **Victorian Emergency Backstop Compliance** — remote DER/solar curtailment capability end-to-end (device → comms → DERMS → OT).
8. **Field Mobility & GIS Modernisation** — ruggedised field devices, switching/ADMS mobile, CIM-based GIS feeding ADMS/DERMS.
9. **OT WAN / Telecoms Modernisation** — private fibre + 4G/5G + radio refresh for the grid edge (expands and must secure the OT comms layer).
10. **Cloud & Data Platform** — Azure data lake/analytics for predictive maintenance and DER forecasting (governs the OT→IT telemetry flow).

---

## 7. CYBER & COMPLIANCE POSTURE (CURRENT)

| Framework | Current state | Gap signal for the assessment |
|-----------|---------------|-------------------------------|
| **ASD Essential Eight** | ML1 broadly; ML2 targeted on corporate IT | OT carve-outs (legacy patching, app control) drag the real posture |
| **ASD ISM** | Aligned for IT; partial for OT | OT control mapping incomplete; no current SSP for the OT zone |
| **AESCSF** | Self-assessed ~MIL-1/2 (FY2024, stale) | Overall MIL likely pinned by **Cybersecurity Architecture (CA)**, **Situational Awareness (SA)** and **Supply Chain (EDM)** lagging domains |
| **SOCI / CIRMP** | Designated critical electricity asset; CIRMP documented; **FY2024 annual report lodged, board-attested** | FY2025 attestation in progress; **personnel & supply-chain hazard chapters thin**; 12-hr OT detection-to-escalation pipeline **untested** |
| **AER Ring-fencing** | Compliance statement filed | Information-flow controls to Eastland Connect **not demonstrably enforced** |
| **Privacy Act / APP** | Privacy policy + collection notices in place | **Life-support register** and vulnerable-customer data are highly sensitive; some customer data visible to Eastland Connect (APP 6 concern) |
| **NDB scheme** | IR plan references NDB | Interaction between NDB 30-day assessment and SOCI 12/72-hr clocks **not reconciled** |

---

## 8. KNOWN ISSUES / ANTI-PATTERN CANDIDATES (DELIBERATELY SEEDED)

The following are *intentionally present* so the recipe has real findings to surface. They are realistic for a mid-transition DNSP:

- **Flat OT-IT segments** remain in some rural zone substations (no enforced segmentation).
- **Shared OT operator console logins** in legacy control areas (no per-user attribution).
- **Legacy protection relays / RTUs** that cannot be patched within vendor support.
- **No dedicated OT security monitoring** platform yet (SIEM is IT-centric).
- **Always-on vendor VPNs** for some OT support contracts (supply-chain + access risk).
- **Fragmented identity** (Entra ID vs on-prem AD vs OT-local accounts).
- **Inconsistent OT contractor vetting** (personnel hazard).
- **Network data leakage path** to the unregulated Eastland Connect arm (ring-fencing + privacy).
- **Stale AESCSF self-assessment** predating the ADMS/DERMS build.
- **Untested 12-hour SOCI cyber-incident reporting** pipeline for OT-origin incidents.

---

## 9. WORKING HYPOTHESES (FOR THE ASSESSMENT TO CONFIRM/REFUTE)

1. **H1 — Convergence outpaces controls.** The ADMS/DERMS programs have pulled OT data into IT platforms faster than the security model has adapted; the OT overlay will reveal MIL-1 architecture gaps.
2. **H2 — Overall AESCSF MIL is pinned by a few domains.** Strong governance (RM, CPM) masks weak CA, SA and EDM; the *lowest* domain sets the headline.
3. **H3 — SOCI is documented but not operationally proven.** The CIRMP exists on paper and is board-attested, but the personnel/supply-chain chapters and the 12-hr OT reporting pipeline are not evidence-backed.
4. **H4 — Ring-fencing is asserted, not enforced.** Information-flow controls between the network and Eastland Connect are policy, not technically enforced.
5. **H5 — Identity fragmentation is the common root cause** behind several E8, AESCSF IAM and SOCI personnel findings.
6. **H6 — Supply-chain (OT vendor remote access) is the single highest residual risk** — it spans AESCSF EDM, SOCI supply-chain hazard, and ISM.

---

## 10. ASSESSMENT SCOPE NOTE

This Phase 1 covers the **regulated DNSP and its OT estate**, with Eastland Connect in scope **only** for ring-fencing and information-flow questions. AEMO market-system internals and customer-premises devices are out of scope except where they create network-side OT exposure (e.g. DOE/CSIP-AUS comms). The assessment composes on the `au-federal` baseline: where E8/ISM/Privacy artefacts already exist they are cited, not re-derived.

---

*Prepared as a synthetic test fixture for the ArcKit `au-energy` recipe. Not a real engagement.*
