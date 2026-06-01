# Key Systems & Vendor Stack — Eastland Energy Networks (Fixture A, Track B)

**Entity:** Eastland Energy Networks Pty Ltd
**Artefact type:** Application/technology portfolio (synthetic) — names **representative real vendor products** to make the estate authentic.

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE ONLY.** The vendor products named below are **real, publicly-known commercial products**, used here as *illustrative, representative* choices typical of an Australian electricity DNSP estate. This is **not** any real network's actual procurement or system-of-record list, and no endorsement or real customer relationship is implied. Vendor selection follows the composite method (typical-of-archetype, not copied from one network). See [`../../REFERENCES_AND_METHODOLOGY.md`](../../REFERENCES_AND_METHODOLOGY.md).

---

## 1. Core platform stack (representative)

| Capability | Role | Representative vendor / product | Layer | Alternatives typical in AU |
|------------|------|----------------------------------|-------|----------------------------|
| **ADMS** | Advanced Distribution Mgmt (model + real-time + power-flow) | **GE Vernova** (PowerOn / GridOS) | OT | Schneider EcoStruxure ADMS |
| **SCADA / EMS (legacy)** | Real-time control (being retired) | **OSI** (Open Systems International) monarch | OT | GE / Schneider legacy SCADA |
| **OMS** | Outage management | GE ADMS OMS module | OT | Schneider, Oracle NMS |
| **DERMS / DOE** | DER mgmt + Dynamic Operating Envelopes | **GE GridOS DERMS** / AutoGrid-class | OT/Market | SwitchDin, Gridsight, Plexigrid (AU DOE) |
| **Historian** | Process/operations historian | **AVEVA PI (OSIsoft PI)** | OT | GE Proficy Historian |
| **AMI meters** | Smart meters | **Landis+Gyr** / **Itron** | Edge | (VIC AMI installed base) |
| **AMI head-end** | Meter comms | **Itron** head-end | OT/IT | Landis+Gyr Gridstream |
| **MDM** | Meter Data Management | **Oracle Utilities MDM** | IT | Itron MDM |
| **Protection relays / IEDs** | Protection & control | **SEL (Schweitzer)**, **ABB**, Siemens, GE Multilin | OT | — |
| **RTUs** | Telemetry | **SEL**, Schneider **SCADAPack**, ABB | OT | — |
| **GIS** | Network model (spatial, CIM) | **GE Smallworld** | IT | Esri ArcGIS Utility Network |
| **EAM** | Enterprise asset mgmt / works | **IBM Maximo** | IT | SAP PM |
| **ERP / finance / asset accounting** | ERP | **SAP S/4HANA** | IT | — |
| **Billing / CIS (market)** | Billing engine | **SAP S/4HANA Utilities (IS-U)** | IT/Market | Gentrack, Hansen (AU) |
| **CRM / customer portal** | Customer engagement | **Salesforce** / SAP | IT | — |
| **Data platform / analytics** | Lake + analytics | **Microsoft Azure + Databricks** | IT | — |
| **BI / reporting** | Reporting | **Microsoft Power BI** | IT | — |
| **Predictive-maintenance / DER AI** | Analytics/ML | **Azure ML** + vendor PHM models | IT | — |
| **Field mobility / scheduling** | Works execution | **SAP Field Service** / Click | IT/OT | — |
| **Integration / middleware (ESB)** | OT↔IT↔market integration backbone | **Software AG webMethods** | IT/OT | MuleSoft, TIBCO, SAP PI/PO, IBM ACE |

## 2. Security & identity stack (representative)

| Capability | Role | Representative vendor / product | Layer |
|------------|------|----------------------------------|-------|
| **Identity (corporate)** | IAM / MFA | **Microsoft Entra ID** (+ on-prem AD) | IT/OT |
| **OT security monitoring** | OT visibility / anomaly | **Claroty** [alt: **Nozomi Networks**, **Dragos**] *(funded, not yet deployed)* | OT security |
| **SIEM** | Detection / SOC | **Microsoft Sentinel** [alt: Splunk] | IT security |
| **Privileged access / jump host** | Vendor remote access | PAM (e.g., **CyberArk**) + jump host *(some legacy always-on VPNs)* | OT security |
| **OT firewall** | OT-IT boundary | Next-gen firewall (e.g., **Fortinet / Palo Alto**) | OT security |
| **DER comms** | Inverter comms | **CSIP-AUS / IEEE 2030.5** gateway (SwitchDin/Gridsight-class) | Edge/OT |
| **OT WAN / telecoms** | Grid-edge comms | Private fibre + **Cisco** + carrier **4G/5G** | Network |
| **Network segmentation** | OT/IT zones & conduits (IEC 62443) | Firewalled zones + VLAN / micro-segmentation | OT/Network |
| **NAC** | Network access control | **Cisco ISE** | Network |
| **IDS/IPS** | Intrusion detection | OT IDS sensors (Claroty/Nozomi) + network IPS | OT/IT security |
| **Data diode** | One-way OT→IT egress (historian) | **Owl / Fox-IT-class** unidirectional gateway *(target state; not yet deployed)* | OT security |
| **Secure remote access** | OT vendor access | Brokered jump host + **CyberArk** PAM *(legacy always-on VPNs to retire)* | OT security |

## 2b. Network segmentation & security architecture (current vs target)

Modelled on the **Purdue model** and **IEC 62443 zones & conduits**.

| Zone / control | Current state | Gap / anti-pattern |
|----------------|---------------|--------------------|
| **L4/L5 Enterprise IT ↔ L3 OT** | NGFW-separated; IT/OT **DMZ** in metro | Rural sites retain **flat OT-IT segments** |
| **OT-IT DMZ (conduit)** | Firewall + vendor jump host | OT IDS sensor **not yet deployed**; some **always-on vendor VPNs** |
| **OT→IT data egress (historian → lake)** | Firewalled flow today | **Data diode (one-way)** is target state, not deployed → bidirectional risk |
| **Field / substation (L1/L2)** | Metro segmented; modern IEDs | Legacy relays/RTUs on shared segments; **cellular pole-top** edge |
| **Network access control (NAC)** | Cisco ISE on corporate | OT-side NAC coverage **partial** |
| **Micro-segmentation** | Planned in uplift program | Not yet implemented inside OT |
| **Secure remote access (PAM)** | CyberArk + jump host (new contracts) | Legacy contracts bypass PAM |
| **Detection** | Microsoft Sentinel SIEM (IT) | **No OT monitoring** feeding the SOC yet (Claroty funded) |

These map directly to **AESCSF CA** (architecture/segmentation), **SA** (monitoring), **EDM** (vendor access) and the **SOCI cyber hazard** (segmentation, detection, network resilience).

## 3. Why this matters to the assessment (supply-chain hooks)

Naming the real stack makes the **AESCSF EDM (External Dependencies)** and **SOCI supply-chain hazard** concrete and testable:

- **OT vendor remote access** — GE Vernova (ADMS), SEL/ABB (protection), AVEVA (PI) all require support access → brokered vs always-on VPN (anti-pattern).
- **Critical OT vendor concentration** — GE Vernova spans ADMS + OMS + DERMS → single-vendor dependency risk.
- **Attestations to collect** — SOC 2 / ISO 27001 / IRAP from each (flow-down completeness).
- **Open-source in the DER stack** — CSIP-AUS / IEEE 2030.5 components (dependency inventory gap).
- **Sensitive-supplier analysis** — which vendors touch DOE/constraint data or hold standing OT access.

## 4. Composite note

Where public market context suggests multiple plausible vendors (e.g., **GE vs Schneider** ADMS; **Itron vs Landis+Gyr** AMI; **Gentrack/Hansen vs SAP IS-U** billing), the catalogue picks a primary and lists the realistic alternative — keeping the fixture credible without asserting any single real network's actual choices.

*Synthetic test-fixture document. Vendor products are real and public; their use here is illustrative only.*
