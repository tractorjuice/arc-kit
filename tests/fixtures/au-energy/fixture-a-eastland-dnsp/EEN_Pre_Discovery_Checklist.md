# Eastland Energy Networks — Pre-Discovery Information Request

**Engagement:** Critical Infrastructure Cyber & Compliance Assessment (Phase 1)
**Prepared by:** Synthetic assessment team | May 2026 | Public synthetic evaluation fixture

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE ONLY.** Items below describe the *kinds* of evidence a real DNSP assessment would request; for the fixture, representative answers are captured in the interviews and `raw_data/` stubs. See `../REFERENCES_AND_METHODOLOGY.md`.

This checklist lists information helpful to have before kickoff, organised into nine sections. Where an item isn't available, that absence is itself a useful finding.

| # | Section | Primary source |
|---|---------|----------------|
| 1 | Corporate, regulatory & critical-asset status | Regulation & Compliance |
| 2 | AESCSF & cyber program | CISO / Security |
| 3 | OT / control systems | Head of Network Control / OT |
| 4 | SOCI / CIRMP | Regulation & Compliance / CISO |
| 5 | Identity, access & federal baseline (E8/ISM) | CISO / IT |
| 6 | Corporate IT & data platform | Chief Digital & Information Officer |
| 7 | Supply chain & OT vendors | Procurement / OT |
| 8 | Ring-fencing & Eastland Connect | Regulation & Compliance |
| 9 | Privacy & customer data | Privacy Officer / Customer |

---

## Section 1 — Corporate, Regulatory & Critical-Asset Status

1.1 Corporate structure, ownership (incl. any foreign ownership/control) and board/committee structure.
1.2 Current AER determination status (2026–31) and the regulated vs unregulated service classification.
1.3 Confirmation of designation as a critical electricity asset and entry in the CISC register of critical infrastructure assets.
1.4 Register of applicable regulatory obligations (NER, SOCI, AESCSF, AER ring-fencing, Privacy Act).

## Section 2 — AESCSF & Cyber Program

2.1 Most recent AESCSF self-assessment (date, version, CAT band, MIL results by domain).
2.2 Target MIL profile and rationale per domain.
2.3 Cyber & OT Security Uplift program scope, funding and milestones.
2.4 SOC operating model (internal vs MSSP), SIEM coverage, and **OT monitoring** coverage.
2.5 Current open cyber risks / known anti-patterns.

## Section 3 — OT / Control Systems

3.1 OT asset inventory: SCADA/DMS, ADMS, OMS, DERMS/DOE, AMI head-end/MDM, protection relays/RTUs/IEDs.
3.2 OT network architecture and **segmentation** status (incl. OT-IT boundary and rural zone substations).
3.3 Control-centre design (primary + DR), operator access model, console login practices.
3.4 OT vendor remote-access arrangements (VPNs, jump hosts, always-on connections).
3.5 ICS protocol usage and any legacy/unpatchable controllers.
3.6 DER comms stack — CSIP-AUS / IEEE 2030.5 implementation, DOE engine, any open-source components.

## Section 4 — SOCI / CIRMP

4.1 Current CIRMP document and the four-hazard coverage (cyber, personnel, physical, supply chain).
4.2 Accountable officer and governance for the CIRMP.
4.3 Last **board-approved CIRMP annual report** (date) and evidence of attestation.
4.4 Cyber incident-response plan and the **12-hour / 72-hour** reporting pipeline (detection → escalation → CISC/ASD).
4.5 Any cyber incidents reported in the last 24 months and lessons learned.

## Section 5 — Identity, Access & Federal Baseline (E8 / ISM)

5.1 Existing Essential Eight maturity assessment (level per strategy; OT carve-outs).
5.2 ISM applicability statement / SSP coverage (IT and OT zones).
5.3 Identity architecture (Entra ID, on-prem AD, OT-local accounts) and privileged-access management.
5.4 Joiner-mover-leaver process for employees, field crews and contractors.

## Section 6 — Corporate IT & Data Platform

6.1 M365 / Azure tenancy and SAP S/4HANA scope.
6.2 GIS, EAM, CRM and customer self-service portal.
6.3 Azure data platform — what OT telemetry flows into IT analytics, and the controls on that flow.
6.4 Any AI/ML models in use (predictive maintenance, DER forecasting, customer chatbot).
6.5 Market-data interfaces (AEMO MMS/EMMS via NEMWeb; any open-source tooling such as OpenNEM).

## Section 7 — Supply Chain & OT Vendors

7.1 Register of OT and critical IT suppliers (ADMS vendor, protection vendor, MSSP, SI partners).
7.2 Vendor security attestations held (SOC 2, ISO 27001, IRAP) and contract security flow-down.
7.3 Any "sensitive supplier" considerations under SOCI supplier-influence provisions.
7.4 Open-source dependency inventory in the DER/market stack.

## Section 8 — Ring-fencing & Eastland Connect

8.1 List of Eastland Connect activities and how they relate to the regulated business.
8.2 Shared staff, systems (SharePoint, CRM, identity) and the access-segregation controls in place.
8.3 Information-flow controls preventing network data from advantaging the unregulated arm.
8.4 Ring-fencing compliance statement and any waivers.
8.5 Cost-allocation methodology between regulated and unregulated activities.

## Section 9 — Privacy & Customer Data

9.1 Privacy policy, collection notices and APP compliance posture.
9.2 Handling of the **life-support customer register** and vulnerable-customer data.
9.3 NMI / standing data handling and any sharing with Eastland Connect (APP 6).
9.4 NDB scheme breach-response process and its interaction with SOCI reporting.

---

*Synthetic test-fixture document. Not a real information request.*
