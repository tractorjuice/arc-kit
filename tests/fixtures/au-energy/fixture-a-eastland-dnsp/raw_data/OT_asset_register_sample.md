# OT Asset Register — Sample Extract

**Entity:** Eastland Energy Networks
**Scope:** Operational technology in the assessment boundary (illustrative sample, not exhaustive)

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE.** Representative OT inventory; figures illustrative. See `../../REFERENCES_AND_METHODOLOGY.md`.

## Control & management systems

| Asset class | System (illustrative) | Criticality | Patch/lifecycle status | Notes |
|-------------|----------------------|-------------|------------------------|-------|
| SCADA / DMS (legacy) | Incumbent SCADA, 15+ yrs | Critical | Extended support; being retired | Replaced under ADMS program |
| ADMS (new) | Advanced Distribution Mgmt System | Critical | Current; mid-rollout | Network model + real-time + power-flow |
| OMS | Outage Management System | High | Current | Integrated to ADMS + customer comms (IT) |
| DERMS / DOE engine | DER Mgmt + Dynamic Operating Envelope | High | New build | CSIP-AUS / IEEE 2030.5 to customer inverters |
| AMI head-end + MDM | Smart-meter head-end + Meter Data Mgmt | High | Current | Feeds billing (IT), settlement (market), LV visibility (OT) |
| Historian | Process historian | Medium | Current | Feeds Azure analytics |

## Field & substation

| Asset class | Count (illustrative) | Patch status | Anti-pattern flag |
|-------------|----------------------|--------------|-------------------|
| Zone substations | ~220 | Mixed | Rural sites: flat OT-IT segments |
| Protection relays / IEDs (modern) | majority | Patchable | — |
| Legacy relays / RTUs | long tail | **Unpatchable** (no vendor patch) | Compensating monitoring absent |
| Pole-top devices (4G/5G) | growing | Varies | Expanding cellular attack surface |

## Network, comms & control centre

| Item | State | Anti-pattern flag |
|------|-------|-------------------|
| OT WAN | Private fibre + P2P radio + 4G/5G | Cellular grid-edge endpoints |
| OT-IT segmentation | Enforced in metro; **flat in rural** | Yes (CA domain) |
| Control centre | Primary + DR site | DR not cyber-failover tested |
| Operator access | Named logins (modern); **shared console login (legacy)** | Yes (IAM domain) |
| Vendor remote access | Brokered (some); **always-on VPN (legacy contracts)** | Yes (EDM domain) |

## DER / market interfaces

- DER comms: **CSIP-AUS** (IEEE 2030.5 / SEP2); DOE outputs published to inverters.
- Market data: AEMO **MMS/EMMS via NEMWeb**; analytics teams also use open tooling (OpenNEM-class).
- Open-source components present in the DER export-control stack (dependency inventory incomplete).
