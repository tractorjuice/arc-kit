# Architecture & Data-Flow Diagrams — Eastland Energy Networks (Fixture A, Track B)

**Entity:** Eastland Energy Networks Pty Ltd
**Artefact type:** Reference architecture + data-flow diagrams (synthetic) — Track-B discovery evidence for `au-energy`.
**Scope:** Asset-management & key OT/IT systems landscape — **data, frequency, and downstream systems**.

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE ONLY.** These are fabricated, illustrative diagrams for `au-energy` validation — **not** any real network's architecture. They are drawn *using public reference architectures as structural method* (SGAM; AEMO CER Data Exchange High-Level Design; CSIP-AUS; AEMO + Energy Networks Australia "Open Energy Networks") — no proprietary DNSP diagram is reproduced. See [`../../REFERENCES_AND_METHODOLOGY.md`](../../REFERENCES_AND_METHODOLOGY.md) and [`../../INTERNATIONAL_DATA_SOURCES.md`](../../INTERNATIONAL_DATA_SOURCES.md).

---

## 1. System / integration landscape (OT ↔ IT ↔ Market ↔ Customer)

Shows the convergence seam and the two ring-fencing/privacy leakage paths to the unregulated arm. *(Validated — renders as a Mermaid flowchart.)*

```mermaid
flowchart LR
  subgraph EDGE["Customer / Grid edge"]
    INV["Customer inverters / DER"]
    REC["Pole-top reclosers 4G"]
    MTR["Smart meters (Itron/L+G)"]
  end
  subgraph OT["OT / Control L1-3"]
    RTU["RTUs / relays (SEL/ABB)"]
    SCADA["SCADA / DMS legacy (OSI)"]
    ADMS["ADMS (GE Vernova)"]
    OMS["Outage Mgmt OMS"]
    DERMS["DERMS / DOE (GridOS)"]
    AMIHE["AMI head-end (Itron)"]
    HIST["Historian (AVEVA PI)"]
  end
  subgraph INTEG["Integration"]
    ESB["ESB middleware (webMethods)"]
  end
  subgraph IT["Corporate IT / Data L4-5"]
    GIS["GIS (GE Smallworld)"]
    EAM["EAM (IBM Maximo)"]
    SAP["SAP S/4HANA + IS-U"]
    CRM["CRM (Salesforce)"]
    LAKE["Azure data lake"]
    PMAI["Predictive-maintenance AI"]
  end
  subgraph MKT["Market AEMO"]
    MSATS["MSATS / B2B"]
    CER["CER Data Exchange"]
  end
  subgraph UNREG["Eastland Connect unregulated"]
    EVDER["EV / solar / battery platform"]
  end
  INV -->|CSIP-AUS / IEEE 2030.5| DERMS
  REC --> RTU
  MTR --> AMIHE
  RTU --> SCADA
  SCADA --> ADMS
  ADMS --> OMS
  ADMS <--> DERMS
  GIS -->|CIM model| ESB
  ESB --> ADMS
  AMIHE --> ESB
  ESB --> LAKE
  ESB -->|settlement| MSATS
  ESB --> SAP
  EAM --> ESB
  OMS --> ESB
  ESB --> CRM
  DERMS <-->|envelopes / DER data| CER
  SCADA --> HIST
  HIST -->|data diode one-way| LAKE
  LAKE --> PMAI
  PMAI --> EAM
  ADMS -.constraint/DOE data ring-fencing risk.-> EVDER
  LAKE -.customer data APP6 risk.-> EVDER
```

## 2. Asset-management data flow (with frequency)

From sensor to work order — the data path behind the pseudo asset inventory.

```mermaid
flowchart TD
  S["Asset sensors: DGA, oil/winding temp, trip counts, battery V"]
  SCADA["SCADA / RTU"]
  HIST["Historian"]
  EAM["EAM asset register"]
  LAKE["Data lake / analytics"]
  PMAI["Predictive-maintenance / anomaly AI"]
  WO["Work-order generation"]
  FIELD["Field mobility crews"]
  S -->|real-time streaming| SCADA
  SCADA -->|seconds| HIST
  HIST -->|near-real-time| LAKE
  EAM -->|daily batch| LAKE
  LAKE -->|daily| PMAI
  PMAI -->|event-driven| WO
  WO -->|dispatch| FIELD
  FIELD -->|completion data| EAM
```

## 3. OT network zones (Purdue) with anti-patterns

```mermaid
flowchart TB
  subgraph L45["L4/L5 Enterprise IT"]
    ITZ["Corporate IT, M365, data lake"]
    NAC["NAC (Cisco ISE)"]
  end
  subgraph DMZ["IT/OT DMZ (IEC 62443 conduit)"]
    FW["OT firewall (NGFW)"]
    JUMP["Vendor jump host + PAM"]
    IDS["OT IDS (Claroty/Nozomi)"]
    DIODE["Data diode one-way OT to IT"]
  end
  subgraph L3["L3 OT operations"]
    CC["Control centre SCADA/ADMS"]
    HISTZ["Historian (AVEVA PI)"]
  end
  subgraph FIELDZ["L1/L2 Field"]
    ZMETRO["Metro zone substations segmented"]
    ZRURAL["Rural zone substations flat segment"]
  end
  ITZ --> FW
  FW --> CC
  IDS -.monitors.-> CC
  JUMP -.always-on vendor VPN anti-pattern.-> CC
  CC --> ZMETRO
  CC --> ZRURAL
  HISTZ --> DIODE
  DIODE --> ITZ
  ZRURAL -.flat OT-IT segment anti-pattern.-> ITZ
```

## 4. Asset-management data register — data, frequency, downstream systems

| data domain | source system | frequency | downstream systems | classification / note |
|-------------|---------------|-----------|--------------------|-----------------------|
| SCADA telemetry (status, analogs) | RTU → SCADA/ADMS | Real-time (sub-second–seconds) | Historian, ADMS, DERMS | OT-critical; basis for control |
| Transformer condition (DGA, temp) | Substation sensors → historian | Periodic + event | Data lake, predictive-maintenance AI, EAM | Asset-health; feeds WO |
| Protection events (trips, settings) | Relays/IEDs → SCADA | Event-driven | ADMS, historian, EAM | Safety-critical |
| Smart-meter data | Meters → AMI head-end → MDM | Interval (e.g. 5–30 min) + daily | Billing, settlement (MSATS), data lake, LV analytics | Customer PII; market + OT use |
| DER / envelope data | Inverters ↔ DERMS (CSIP-AUS) ↔ CER Data Exchange | Near-real-time | DERMS, AEMO CER, network ops | Customer + market; integrity-critical |
| Network model (assets, topology) | GIS (CIM) | Daily/weekly publish | ADMS, DERMS, EAM | Master data |
| Asset register & maintenance | EAM | Batch (daily) | Data lake, SAP, work mgmt | Asset lifecycle |
| Outage data | OMS | Event-driven | CRM/portal, customer comms, regulator reporting | Customer-facing |
| Analytics / AI features | Data lake | Daily/continuous | Predictive-maintenance AI, DER forecasting | OT→IT egress (governance concern) |

## 5. What these feed in the assessment

- **AESCSF CA** (architecture, segmentation, OT→IT egress), **SA** (where monitoring sits), **ACM** (master data flows), **EDM** (vendor access path).
- **SOCI** cyber-hazard (segmentation), physical (control centre), supply-chain (jump host); dependency mapping for material risk.
- **AER ring-fencing** — the two dotted leakage paths to Eastland Connect.
- **Provenance:** structural method = SGAM + AEMO CER Data Exchange HLD + CSIP-AUS + Open Energy Networks (see references doc).
