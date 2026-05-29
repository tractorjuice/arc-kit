# International / Open Data Sources for the Energy Eval

**Purpose:** scout sources *beyond Australia* — especially GitHub and open data — that could enrich the `au-energy` evaluation data, with a focus on **pseudo asset data inventories**.
**Author:** Synthetic fixture authors | May 2026
**Status:** Exploratory shortlist. **AssetOpsBench is now in use** as the schema basis for `fixture-a-eastland-dnsp/raw_data/OT_pseudo_asset_inventory.md` (added 2026-05-21; see [`REFERENCES_AND_METHODOLOGY.md`](./REFERENCES_AND_METHODOLOGY.md) refs 45–47). Other sources remain candidates; they get added to provenance if/when adopted.

---

## 1. How international data fits an Australian recipe

The AU **regulatory frameworks** (AESCSF, SOCI, AER ring-fencing) are jurisdiction-specific and can't be substituted. But two layers travel internationally:

- **The framework lineage.** AESCSF is built on **NIST CSF + DOE C2M2**, so international control catalogues map almost 1:1 — useful to deepen the AU assessment *and* to seed future non-AU energy recipes.
- **The OT / asset / raw-evidence layer.** SCADA, ADMS, transformers, sensors, failure modes, work orders, network models — these are universal, and there's a lot of openly-licensed material.

So international sources can be used in **three modes**:

| Mode | What it means | Best sources |
|------|---------------|--------------|
| **A. Enrich the AU fixtures** | Make Eastland's OT/asset detail richer & more authentic | AssetOpsBench, IEEE test feeders, PyPSA |
| **B. Track-B evidence** | Add real/structured "raw data" artefacts for evidence-enriched runs | AssetOpsBench, Open Power System Data, ENTSO-E |
| **C. Seed non-AU recipes** | Build UK/US/EU energy fixtures + future recipes | NCSC CAF, NERC CIP, Ofgem RIIO, C2M2 |

---

## 2. Headline recommendation — for "pseudo asset data inventories"

**Use IBM AssetOpsBench as the backbone for a pseudo asset data inventory.** It already *is* synthetic/simulated industrial asset data (no confidentiality issue), it's openly licensed (repo **Apache-2.0**), and its schema is exactly an asset inventory:

```text
site → asset → sensors → failure modes → failure-mode↔sensor mapping → history (time series) → work orders
```

It ships 141 scenarios across **9 asset classes** (Chiller, AHU, Pump, Motor, Bearing, Engine, Rotors, Boilers, Turbine) with four agent tool-sets (IoT: get_sites/get_assets/get_sensors/get_history; FMSR: failure modes + sensor mapping; TSFM: forecasting + anomaly detection; WO: work-order generation). Crucially, its **open "call for scenario contribution" explicitly wants Transformers added** — i.e. grid assets are in-scope and we could even contribute energy scenarios back.

**Fit to our eval:** its asset/sensor/failure-mode structure maps straight onto a DNSP's OT estate (zone-substation transformer → RTU/protection relay → sensors → failure modes → work orders), and feeds:

- AESCSF **ACM** (asset/config mgmt), **SA** (monitoring/anomaly), **TVM** (condition/vuln),
- the composite's **predictive-maintenance AI** (→ `au-ai-assurance`),
- SOCI **physical/asset resilience** and material-risk register.

**Licence caveat (do this before redistributing anything):** the *code* repo is Apache-2.0; **verify the Hugging Face dataset card licence separately** — a dataset can carry different terms from the code. Safer pattern: use AssetOpsBench's **schema and approach** to generate our *own* pseudo inventory (clearly synthetic, our IP), citing AssetOpsBench as the methodological source, rather than bundling their data into the ArcKit PR.

---

## 3. Curated source shortlist

### 3a. Pseudo asset inventories & OT asset-ops (Mode A/B)

| Source | What it gives | Licence | Caveat | Link |
|--------|---------------|---------|--------|------|
| **IBM AssetOpsBench** | Synthetic asset/sensor/failure-mode/work-order schema + 141 scenarios; 9 asset classes | Code **Apache-2.0**; dataset = verify on HF card | Process assets > grid assets; we'd adapt/extend with grid classes | https://github.com/IBM/AssetOpsBench · https://huggingface.co/datasets/ibm-research/AssetOpsBench · paper https://arxiv.org/abs/2506.03828 |
| **IEEE PES Test Feeders** | Canonical distribution network models (13/34/123-node, etc.) | Publicly available (IEEE PES) | Models, not asset inventories — pair with AssetOpsBench | https://cmte.ieee.org/pes-testfeeders/ |
| **PyPSA / PyPSA-Eur, pandapower** | Open network models + example grids (Python) | PyPSA MIT; data largely CC-BY; pandapower BSD | European-centric; transmission-leaning | https://github.com/PyPSA/pypsa-eur · https://github.com/e2nIEE/pandapower |

### 3b. Open power-system / market data (Mode B)

| Source | What it gives | Licence | Caveat | Link |
|--------|---------------|---------|--------|------|
| **Open Power System Data (OPSD)** | Cleaned EU power-system datasets | Open; **per-source terms vary** | Check each table's source licence | https://open-power-system-data.org/ · https://github.com/Open-Power-System-Data |
| **ENTSO-E Transparency Platform** | EU TSO generation/load/transmission data | Free under ENTSO-E terms (registration) | Redistribution restrictions — flag | https://transparency.entsoe.eu/ |
| **openmod transmission datasets** | Index of open grid/network datasets | Varies | Aggregator — check each | https://wiki.openmod-initiative.org/wiki/Transmission_network_datasets |

### 3c. OT/ICS security frameworks (Mode A/C — map to AESCSF)

| Source | What it gives | Licence | Use | Link |
|--------|---------------|---------|-----|------|
| **NIST CSF 2.0** | The framework AESCSF derives from | US Gov / public | Deepen domain assessment; non-AU skeleton | https://www.nist.gov/cyberframework |
| **NIST SP 800-82 r3** | OT security guide (ICS, OT, cloud, supply chain) | US Gov / public | OT overlay depth; anti-pattern catalogue | https://csrc.nist.gov/pubs/sp/800/82/r3/final |
| **DOE C2M2 v2.1** | AESCSF's parent maturity model + CSF mapping | US Gov / public | Direct AESCSF MIL analogue | https://www.energy.gov/ceser/cybersecurity-capability-maturity-model-c2m2 |
| **MITRE ATT&CK for ICS** | Adversary TTP taxonomy for OT | Free w/ attribution (MITRE) | Threat modelling, anti-patterns | https://attack.mitre.org/matrices/ics/ |
| **ISA/IEC 62443** | OT technical control standard | Standards (purchase) | Technical implementation layer | https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards |

### 3d. Non-AU regulatory analogues (Mode C — seed future recipes)

| Source | Analogue to | Licence | Why | Link |
|--------|-------------|---------|-----|------|
| **UK NCSC Cyber Assessment Framework (CAF)** | AESCSF (essential services / NIS) | Crown / OGL | Cleanest basis for a UK energy recipe; maps to NIST CSF | https://www.ncsc.gov.uk/collection/cyber-assessment-framework |
| **US NERC CIP** | SOCI critical-asset obligations (electricity) | NERC standards (downloadable) | US bulk-electric-system compliance recipe | https://www.nerc.com/pa/Stand/Pages/CIPStandards.aspx |
| **Ofgem RIIO-ED2 business plans + Digitalisation Strategy & Action Plans** | AER reg submissions | Crown / OGL + company-published | Detailed UK DNO current-state/major-programs; DSO transition | https://www.ofgem.gov.uk/publications/riio-ed2-business-plan-guidance · e.g. UKPN https://ed2.ukpowernetworks.co.uk/ · SP Energy Networks DSO strategy |

### 3e. Reference-only (do NOT bundle)

| Source | Why useful | Why not bundle |
|--------|------------|----------------|
| **iTrust SWaT / WADI** (Singapore) | Real ICS testbed attack datasets | **Request-gated** — signed form; not freely redistributable. Use for inspiration only. |
| Vendor public ICS threat reports (Dragos, Claroty, Nozomi) | Realistic anti-pattern / TTP texture | Copyrighted — cite, don't copy |

### 3f. Reference architectures / public diagrams (Mode A — DNSPs & AEMO share these)

DNSPs, AEMO and industry bodies publish reference architectures and high-level designs that are ideal *structural* sources for synthetic diagrams (draw your own; don't lift a proprietary diagram). **Now in use** for `fixture-a-eastland-dnsp/raw_data/Architecture_Diagrams.md`.

| Source | What it gives | Licence | Link |
|--------|---------------|---------|------|
| **SGAM** (Smart Grid Architecture Model) | The canonical 5-layer smart-grid reference architecture | CEN-CENELEC-ETSI (cite) | https://link.springer.com/chapter/10.1007/978-3-319-49229-2_3 |
| **AEMO CER Data Exchange — High-Level Design (Attachment A)** | Public HLD architecture for CER data exchange | Crown/industry (cite) | https://arena.gov.au/assets/2025/08/AEMO-%E2%80%93-CER-Data-Exchange-Industry-Co-Design-Attachment-A-High-Level-Design.pdf |
| **Open Energy Networks (AEMO + Energy Networks Australia)** | DSO capability/architecture reference | ENA/AEMO (cite) | https://www.energynetworks.com.au/assets/uploads/open_energy_networks_-_required_capabilities_and_recommended_actions_report_22_july_2019.pdf |
| **CSIP-AUS** | DER comms reference architecture (IEEE 2030.5) | Industry (cite) | https://www.csipaus.org/ |
| **NIST Smart Grid Framework** | US smart-grid interoperability reference | US Gov / public | https://www.nist.gov/programs-projects/smart-grid-national-coordination/smart-grid-framework |

> Note: individual DNSPs also publish system/architecture detail in regulatory ICT business cases and (in the UK) Ofgem Digitalisation Strategies — useful as reference, but **draw synthetic diagrams**, never reproduce a specific network's proprietary architecture.

### 3g. ARENA innovation projects — edge cases & sample architectures (AU open knowledge-sharing)

ARENA-funded DER/VPP projects must publish **knowledge-sharing reports** (public; typically CC BY — verify per report). They provide (a) **new edge-case entity archetypes** and (b) **sample/reference architectures** (VPP orchestration, DER aggregation, DOE/SOE engines, market interfaces). Domestic AU, but open — complements the regulatory grounding.

| Project | Edge case / what it gives | Architecture? | Link |
|---------|---------------------------|---------------|------|
| **Project Symphony** (WA — Western Power/Synergy/AEMO) | VPP orchestration; aggregator/FRMP; DER services | Yes (DER services + aggregator reports) | https://arena.gov.au/knowledge-bank/project-symphony-final-lessons-learnt-report/ |
| **Project Converge** (ACT — Evoenergy) | Shaped vs Dynamic Operating Envelopes | Yes (DOE/SOE engine) | https://arena.gov.au/knowledge-bank/project-converge-act-distributed-energy-resources-pilot-final-knowledge-sharing-report/ |
| **DER Integration & Automation Project** | DER integration/automation patterns | Yes | https://arena.gov.au/projects/der-integration-and-automation-project/ |
| **Amber V2G / EV smart charging** | EV/V2G aggregator; price-responsive control of vehicles | In trial reports | https://arena.gov.au/news/batteries-on-wheels-unlocking-value-for-customers-through-smarter-charging/ |
| **ANU BSGIP** | DER/operating-envelope research + open tools | Research + code | https://bsgip.com/research/publications/ |

**Candidate edge-case archetypes (each forces a *different* recipe answer — ideal stress tests / future mini-fixtures):**

| Archetype | AESCSF | SOCI | AER ring-fencing | Why a good edge case |
|-----------|--------|------|------------------|----------------------|
| **VPP aggregator / FRMP** | supplier-scoped; light OT | usually NOT designated → flow-down | N/A | market participant but not an asset owner |
| **Community/neighbourhood battery** | OT-light | usually NOT designated (threshold) | N/A or embedded network | small DER asset; designation-threshold edge |
| **EV charging / V2G network** | supplier-scoped + safety | NOT designated | like the unregulated arm | bidirectional control of *customer vehicles* |
| **Microgrid / embedded-network operator** | OT present | size-dependent | embedded-network exemption | different regulatory regime |
| **DERMS / DOE platform provider** | supplier-scoped, IT-only | NOT designated → sensitive supplier | N/A | supply-chain-into-OT integrity (cf. Voltiq) |

> Any of these could become a lightweight additional fixture or scenario variant. Because each trips a *different* applicability path, they are exactly what good edge cases should do.

---

## 4. Licensing & ethics guardrails (carry over from the AU build)

1. **Permissive licences only** for anything bundled into the ArcKit PR (Apache-2.0, MIT, BSD, CC-BY, OGL — with attribution). Verify *dataset* licences separately from *code* licences.
2. **Prefer "generate our own from their schema"** over redistributing third-party data — keeps the composite synthetic-and-ours, and sidesteps most licence friction.
3. **Request-gated / copyrighted sources = reference only** (SWaT/WADI, vendor reports).
4. **Keep the synthetic-composite discipline** — no real entity/client as subject; international sources cited as public backdrop only.
5. **Every new source gets added to the provenance map** in `REFERENCES_AND_METHODOLOGY.md` when actually used.

---

## 5. Concrete proposal — a pseudo asset data inventory for Eastland (illustrative)

Adopt the AssetOpsBench schema, adapted to grid assets, as a new Track-B artefact (`fixture-a-eastland-dnsp/raw_data/OT_pseudo_asset_inventory.md`). Illustrative slice:

| site | asset_id | asset_class | sensors (examples) | failure_modes | criticality | patch_status | open_work_orders |
|------|----------|-------------|--------------------|---------------|-------------|--------------|------------------|
| ZS-Marlowe | TX-014 | Zone-substation transformer | oil_temp, winding_temp, load_A, DGA_H2 | insulation_degradation, overload, bushing_fault | Critical | N/A (asset) | WO-2291 (DGA trend) |
| ZS-Marlowe | RTU-014 | RTU / protection | comms_status, relay_trip_count | comms_loss, relay_misoperation | High | **Unpatchable (legacy)** | WO-2310 (firmware EoL) |
| FEEDER-22 | REC-2207 | Pole-top recloser (4G) | trip_count, battery_v, signal_rssi | battery_depletion, comms_dropout | Medium | Patchable | — |
| DERMS | DOE-ENG-1 | DOE calc service | envelope_calc_latency, csip_msg_errors | stale_envelope, csip_auth_fail | High | Current | WO-2333 (cert rotation) |

This single artefact would feed AESCSF **ACM/SA/TVM**, the predictive-maintenance **AI assurance** angle, and SOCI **asset-resilience** — and is trivially extensible to hundreds of rows generated from the AssetOpsBench failure-mode/sensor catalogue.

---

## 6. Suggested next steps (pick any)

- **Build the pseudo asset inventory** for Eastland (full version of §5), AssetOpsBench-schema, grid-adapted, clearly synthetic.
- **Seed a non-AU recipe** — most natural is **UK (NCSC CAF + Ofgem RIIO)** given the framework lineage and rich public filings; a matching composite DNO fixture would follow the same method.
- **Contribute back** grid/transformer scenarios to AssetOpsBench's open call (community goodwill + a real artefact for your portfolio).
- **Park as reference** — keep this doc as the source register and revisit after the AU end-to-end validation run.

*Synthetic-data scouting note for ArcKit fixture development. All listed sources are public; licences to be re-verified before any redistribution.*
