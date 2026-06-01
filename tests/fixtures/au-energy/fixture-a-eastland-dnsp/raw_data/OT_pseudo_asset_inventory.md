# OT Pseudo Asset Data Inventory — Eastland Energy Networks (Fixture A, Track B)

**Entity:** Eastland Energy Networks Pty Ltd
**Artefact type:** Pseudo asset data inventory (synthetic) — Track-B evidence for the `au-energy` validation
**Schema basis:** IBM **AssetOpsBench** (`site → asset → sensors → failure modes → failure-mode↔sensor mapping → history → work orders`), adapted to electricity-distribution grid assets.

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE ONLY.** Every asset, ID, sensor reading, failure mode and work order below is fabricated for `au-energy` validation. **Not** real network data. The structure is derived from the open IBM AssetOpsBench schema (repo Apache-2.0; dataset licence to be verified on the HF card) — AssetOpsBench data is **not** reproduced here; this is our own synthetic inventory generated *using their schema as method*. See [`../../REFERENCES_AND_METHODOLOGY.md`](../../REFERENCES_AND_METHODOLOGY.md) and [`../../INTERNATIONAL_DATA_SOURCES.md`](../../INTERNATIONAL_DATA_SOURCES.md).

---

## 1. Sites (asset locations)

| site_id | name | type | criticality | note |
|---------|------|------|-------------|------|
| ZS-MARLOWE | Marlowe Zone Substation | Zone substation (urban) | Critical | Modern; segmented OT |
| ZS-ASHBOURNE | Ashbourne Zone Substation | Zone substation (suburban) | Critical | Mixed-vintage |
| ZS-REDGUM | Redgum Zone Substation | Zone substation (peri-urban) | High | Refurb in progress |
| ZS-CARRINGTON | Carrington Zone Substation | Zone substation (rural) | High | **Flat OT-IT segment (anti-pattern)** |
| CC-PRIMARY | Network Control Centre (primary) | Control centre | Critical | SCADA/ADMS operators |
| CC-DR | Control Centre (DR site) | Control centre | Critical | **Not cyber-failover tested** |
| PLAT-DERMS | DERMS / DOE platform | OT/IT platform | High | CSIP-AUS / IEEE 2030.5 |
| PLAT-AMI | AMI head-end + MDM | OT/IT platform | High | ~760k meters |
| NET-OTWAN | OT WAN / comms | Network | High | Fibre + radio + 4G/5G |

## 2. Asset inventory (sample — representative, not exhaustive)

> Health: 🟢 healthy · 🟡 watch · 🔴 act. "AP" = anti-pattern flag for the AESCSF assessment.

| asset_id | asset_class | site | criticality | key sensors | candidate failure modes | health | patch/lifecycle | AP | open WO |
|----------|-------------|------|-------------|-------------|-------------------------|--------|-----------------|----|---------|
| TX-MAR-01 | Power transformer | ZS-MARLOWE | Critical | oil_temp, winding_temp, load_pct, DGA_H2, tap_position | insulation_degradation, overload, bushing_fault | 🟡 | OEM-supported | — | WO-2291 |
| TX-ASH-02 | Power transformer | ZS-ASHBOURNE | Critical | oil_temp, winding_temp, load_pct, DGA_C2H2 | DGA_arcing, overload | 🔴 | OEM-supported | — | WO-2295 |
| RTU-MAR-01 | RTU (remote terminal unit) | ZS-MARLOWE | High | comms_status, cpu_load, last_poll_ts | comms_loss, config_drift | 🟢 | Patchable | — | — |
| RLY-MAR-11 | Protection relay (modern IED) | ZS-MARLOWE | Critical | trip_count, pickup_setting, comms_status | relay_misoperation, setting_drift | 🟢 | Patchable | — | — |
| RLY-CAR-07 | Protection relay (**legacy**) | ZS-CARRINGTON | Critical | trip_count, aux_supply_v | relay_misoperation, hw_failure | 🟡 | **Unpatchable (EoL, no vendor patch)** | AP | WO-2310 |
| RTU-CAR-03 | RTU (legacy) | ZS-CARRINGTON | High | comms_status, cpu_load | comms_loss | 🟡 | **Unpatchable** | AP | WO-2311 |
| REC-2207 | Pole-top recloser (4G) | ZS-REDGUM/FDR-22 | Medium | trip_count, battery_v, signal_rssi | battery_depletion, comms_dropout | 🟢 | Patchable (OTA) | AP (cellular edge) | — |
| REC-2244 | Pole-top recloser (4G) | ZS-CARRINGTON/FDR-44 | Medium | trip_count, battery_v, signal_rssi | battery_depletion | 🟡 | Patchable (OTA) | AP (cellular edge) | WO-2350 |
| VR-RED-05 | Voltage regulator | ZS-REDGUM | Medium | tap_ops_count, output_v | tap_changer_wear | 🟡 | OEM-supported | — | WO-2351 |
| CAP-ASH-02 | Capacitor bank | ZS-ASHBOURNE | Medium | switch_ops, harmonic_thd | capacitor_fail, switch_wear | 🟢 | OEM-supported | — | — |
| BATT-MAR-DC | Substation DC battery | ZS-MARLOWE | High | cell_v, internal_res, temp | depletion, cell_failure | 🟡 | Serviceable | — | WO-2360 |
| SCADA-FE-01 | SCADA front-end server (legacy) | CC-PRIMARY | Critical | cpu, mem, svc_status | service_failure, patch_gap | 🟡 | **Extended support (retiring)** | AP | WO-2370 |
| ADMS-APP-01 | ADMS application server | CC-PRIMARY | Critical | cpu, mem, model_sync_status | model_desync, svc_failure | 🟢 | Current | — | — |
| ADMS-APP-DR | ADMS application server (DR) | CC-DR | Critical | cpu, mem, replication_lag | failover_failure | 🟡 | Current | AP (failover untested) | WO-2371 |
| OMS-APP-01 | Outage Mgmt System | CC-PRIMARY | High | queue_depth, integ_status | integration_break | 🟢 | Current | — | — |
| DOE-ENG-1 | DOE calculation service | PLAT-DERMS | High | calc_latency_ms, csip_msg_errors, envelope_age | stale_envelope, csip_auth_fail | 🟡 | Current | — | WO-2333 |
| DERMS-GW-1 | DER comms gateway (CSIP-AUS) | PLAT-DERMS | High | tls_cert_expiry, 2030_5_session_errors | cert_expiry, auth_fail | 🔴 | Current | AP (OSS deps untracked) | WO-2334 |
| AMI-HE-01 | AMI head-end | PLAT-AMI | High | msg_throughput, meter_offline_pct | head_end_overload | 🟢 | Current | — | — |
| MDM-01 | Meter Data Mgmt | PLAT-AMI | High | etl_lag, dq_exceptions | data_quality_fail | 🟡 | Current | — | WO-2380 |
| FW-OT-MAR | OT firewall | ZS-MARLOWE | Critical | rule_hit_rate, fw_version | misconfig, unpatched | 🟢 | Patchable | — | — |
| JUMP-OT-01 | OT vendor jump host | CC-PRIMARY | Critical | session_count, mfa_status | shared_session, standing_access | 🔴 | Patchable | **AP (always-on vendor VPN nearby)** | WO-2390 |
| HIST-01 | Process historian | CC-PRIMARY | High | ingest_rate, disk_pct | egress_uncontrolled | 🟡 | Current | AP (OT→IT egress) | WO-2391 |

## 3. Failure-mode ↔ sensor mapping (FMSR-style, sample)

| failure_mode | asset_class | primary sensors | early-warning signal |
|--------------|-------------|-----------------|----------------------|
| insulation_degradation | Power transformer | DGA_H2, oil_temp | rising dissolved-gas trend |
| DGA_arcing | Power transformer | DGA_C2H2 (acetylene) | acetylene step-change |
| relay_misoperation | Protection relay | trip_count, pickup_setting | unexpected trip / setting drift |
| comms_loss | RTU / recloser | comms_status, last_poll_ts | poll gaps |
| battery_depletion | Recloser / DC battery | battery_v, internal_res | voltage decline under load |
| stale_envelope | DOE service | envelope_age, calc_latency | envelope older than threshold |
| csip_auth_fail | DER gateway | 2030_5_session_errors, tls_cert_expiry | auth error spike / cert near expiry |

## 4. Sample work orders (WO-style)

| wo_id | asset_id | trigger | priority | hazard linkage |
|-------|----------|---------|----------|----------------|
| WO-2295 | TX-ASH-02 | DGA acetylene step-change (🔴) | P1 | SOCI physical/asset resilience |
| WO-2310 | RLY-CAR-07 | Legacy relay EoL, no patch | P2 | AESCSF TVM; SOCI cyber |
| WO-2334 | DERMS-GW-1 | TLS cert near expiry; OSS deps untracked | P1 | AESCSF EDM/CA; CSIP-AUS integrity |
| WO-2390 | JUMP-OT-01 | Standing vendor session detected | P1 | AESCSF EDM; SOCI supply-chain |
| WO-2391 | HIST-01 | Uncontrolled OT→IT egress | P2 | AESCSF CA; ring-fencing/data-flow |

## 5. Roll-up (for the assessment)

- **Assets sampled:** 22 across 9 sites and 13 asset classes.
- **Criticality:** Critical 9 · High 9 · Medium 4.
- **Unpatchable / EoL:** 3 (RLY-CAR-07, RTU-CAR-03, SCADA-FE-01) → AESCSF **TVM** drag.
- **Anti-pattern flags:** 8 (flat segment, legacy controllers, cellular edge, untested DR failover, OSS-dep gateway, always-on vendor access, OT→IT egress) → feed **CA / SA / EDM** + SOCI cyber/supply-chain.
- **Health 🔴 act-now:** 3 (TX-ASH-02, DERMS-GW-1, JUMP-OT-01).

## 6. Cross-links (what this artefact feeds)

- **AESCSF:** ACM (asset/config completeness), TVM (unpatchable assets), SA (sensor/anomaly monitoring), CA (segmentation/egress), EDM (vendor access, OSS deps).
- **`au-ai-assurance`:** the predictive-maintenance/anomaly models that consume these sensors (bias/drift/data-exposure).
- **SOCI / CIRMP:** physical & asset-resilience evidence; supply-chain (vendor jump host); material-risk register.
- **Provenance:** schema method = AssetOpsBench (see references doc, ref §F).
