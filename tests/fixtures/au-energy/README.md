# `au-energy` Validation Fixtures (Synthetic Test Data)

Synthetic discovery packs to validate the ArcKit **`au-energy`** recipe (`arckit-au/recipes/au-energy.yaml`) end-to-end — closing the merge blocker noted in the recipe YAML: *"validation against an energy-sector / SOCI test fixture is required before merge."*

> ⚠️ **All data here is SYNTHETIC.** Both organisations are fictional composites built with the Forrester-TEI composite method from public sources. They do not represent any real network, supplier, person, or client. **Method, full reference list, provenance map and validation log:** see [`REFERENCES_AND_METHODOLOGY.md`](./REFERENCES_AND_METHODOLOGY.md).

---

## The two fixtures

| | Fixture A — **Eastland Energy Networks** | Fixture B — **Voltiq Analytics** |
|---|---|---|
| Archetype | Mid-size Victorian electricity **DNSP** | Energy DER/analytics **SaaS + advisory supplier** |
| Case | **Applicable** — triggers every energy path | **Negative** — non-SOCI supplier |
| SOCI | Designated **critical electricity asset** → CIRMP applies | **Not** a covered entity → tests graceful non-applicability + flow-down |
| AESCSF | Full 11-domain + **OT overlay** + anti-patterns | Supplier-scoped, **OT overlay N/A** (IT-only) |
| AER ring-fencing | Applies (runs unregulated **Eastland Connect**) | N/A |
| Purpose | Validate `au-aescsf` + `au-soci-cirmp` produce credible findings | Validate the recipe's applicability logic in the *other* direction |

## File manifest

```text
tests/fixtures/au-energy/
├── README.md                          ← this file
├── REFERENCES_AND_METHODOLOGY.md      ← method, citations, provenance, validation log
├── INTERNATIONAL_DATA_SOURCES.md      ← beyond-AU / GitHub sources (AssetOpsBench, SGAM, etc.)
├── EVAL_EXPECTATIONS.md               ← expected positive/negative skill outcomes
├── EVAL_RESULTS.md                    ← detailed synthetic skill evaluation results
├── EVAL_SUMMARY_REPORT.md             ← PR-ready synthetic skill evaluation summary
├── LIVE_GENERATION_REVIEW.md          ← live Codex generation review for inventory/register feature usage
├── fixture-a-eastland-dnsp/
│   ├── EEN_Strategic_Context_Brief.md      ← centrepiece (org, network, estate, programs, posture)
│   ├── EEN_Engagement_Proposal.md          ← engagement scope (four regulatory lenses)
│   ├── EEN_Pre_Discovery_Checklist.md      ← 9-section evidence request
│   ├── EEN_Assessment_Engagement_Primer.md ← framing / north star
│   ├── interviews/
│   │   ├── 01_CISO_interview_extracted.md
│   │   ├── 02_Network_Control_OT_interview_extracted.md
│   │   └── 03_Regulation_Compliance_interview_extracted.md
│   └── raw_data/
│       ├── AESCSF_prior_self_assessment_summary.md
│       ├── OT_asset_register_sample.md
│       ├── OT_pseudo_asset_inventory.md      ← AssetOpsBench-schema pseudo inventory (Track B)
│       ├── Architecture_Diagrams.md          ← Mermaid system/data-flow/Purdue diagrams (Track B)
│       ├── Key_Systems_Vendor_Stack.md       ← real vendor products + middleware + segmentation/security (Track B)
│       ├── SOCI_CIRMP_attestation_register.md
│       ├── Ring_fencing_register_extract.md
│       └── Evidence_Index.md
└── fixture-b-voltiq-supplier/
    ├── VOLTIQ_Strategic_Context_Brief.md
    ├── VOLTIQ_Engagement_Scope.md
    ├── VOLTIQ_Customer_Flowdown_Requirements.md
    └── interviews/
        └── 01_CTO_Security_interview_extracted.md
```

---

## Coverage matrix — does the fixture exercise the standard?

### AESCSF (11 domains) — Fixture A

| # | Domain | Seeded hook in fixture | Expected MIL signal |
|---|--------|------------------------|---------------------|
| 1 | Asset, Change & Config (ACM) | OT asset register lags ADMS/DERMS additions | MIL-2 |
| 2 | Threat & Vulnerability (TVM) | Unpatchable legacy relays/RTUs; no OT vuln program | MIL-1 |
| 3 | Risk Management (RM) | Committees + register present | MIL-2 |
| 4 | Identity & Access (IAM) | Fragmented identity; shared OT console logins | MIL-1 |
| 5 | Situational Awareness (SA) | **No dedicated OT monitoring** | MIL-1 |
| 6 | Information Sharing (ISC) | AEMO/AESCSF threat-sharing participation | MIL-2 |
| 7 | Incident Response / Continuity (IR) | Plan exists; OT 12-hr untested; DR not cyber-tested | MIL-2 |
| 8 | Supply Chain / External Deps (EDM) | Always-on vendor VPNs; OSS deps untracked | MIL-1 |
| 9 | Workforce Management (WM) | Inconsistent OT contractor vetting | MIL-1 |
| 10 | Cybersecurity Architecture (CA) | Flat OT-IT rural segments; OT→IT data egress | MIL-1 |
| 11 | Cybersecurity Program Mgmt (CPM) | Documented + funded program | MIL-2 |
| — | **Anti-patterns** | Shared OT creds, flat networks, legacy controllers, no OT monitoring, always-on VPNs | Multiple present |
| — | **OT overlay** | SCADA/ADMS/DERMS, segmentation, vendor remote access, ICS protocols, CSIP-AUS | Rich |

### SOCI / CIRMP (4 hazards + applicability)

| Element | Fixture A (applicable) | Fixture B (negative) |
|---------|------------------------|----------------------|
| Applicability | Designated critical electricity asset → **applies** | **Not** a covered entity → non-applicability statement |
| Cyber hazard | Developing; OT detection gap | Flow-down only |
| Personnel hazard | **Thin** — OT contractor vetting | Light dev vetting (flow-down) |
| Physical hazard | Established; DR untested | N/A (Azure) |
| Supply-chain hazard | **Thin** — flow-down patchy | Sensitive-supplier exposure |
| 12/72-hr reporting | Documented, **untested for OT** | Notify customers fast enough for *their* clocks |
| Board attestation | FY2024 lodged & board-approved; FY2025 in progress | N/A |

### AER ring-fencing — Fixture A

| Trigger | Hook |
|---------|------|
| Unregulated arm | Eastland Connect (EV, solar/battery, contestable connections, dark fibre) |
| Information flow risk | Network constraint/DOE data valuable to the unregulated arm (policy-only control) |
| Shared systems/staff | Shared SharePoint/CRM/identity; dual-role staff; inconsistent branding |
| Cross-link | Customer data → unregulated arm = ring-fencing **+** APP 6 |

### Federal baseline (composed on `au-federal`)

E8 (ML1/ML2 with OT carve-outs), ISM (IT-aligned, partial OT), Privacy/APP (life-support register, NMI data), NDB (clock reconciliation gap) — hooks present in both fixtures.

---

## How to run the validation

These fixtures are **Track A (clean-slate)** discovery inputs. To validate the recipe:

1. **Stand up a project** for each fixture (e.g. `projects/003-eastland-dnsp/` and `projects/004-voltiq-supplier/`) and point discovery inputs at the relevant `tests/fixtures/au-energy/fixture-*` folder.
2. **Establish the federal baseline first** (the `au-energy` recipe composes on `au-federal`): run `au-e8-posture`, `au-ism-controls`, `au-pia` as needed so the energy commands have their prerequisites.
3. **Run the energy commands:**
   - Fixture A: `au-aescsf 003` then `au-soci-cirmp 003`.
   - Fixture B: `au-aescsf 004` then `au-soci-cirmp 004`.
4. **Score against expected outcomes:**
   - **A — AESCSF:** overall MIL pinned at **MIL-1** by the lagging domains (TVM, IAM, SA, EDM, WM, CA); OT overlay populated; anti-patterns surfaced.
   - **A — SOCI:** applies; four-hazard table with **thin personnel & supply-chain**; untested 12-hr OT pipeline flagged; board-attestation cycle recorded.
   - **B — SOCI:** **"Not a SOCI-covered entity"** statement **plus** flow-down + sensitive-supplier exposure (not a bare "nothing to do").
   - **B — AESCSF:** supplier-scoped; **OT overlay explicitly N/A**; tenant-isolation / data-handling / supply-chain findings.
5. **Record results** in `REFERENCES_AND_METHODOLOGY.md` §6 (Validation Log) and `EVAL_RESULTS.md`. The current build includes a deterministic synthetic skill compatibility check for the two new energy skills; live generated artefact quality still requires human review.

---

## Verification performed (this build)

- ✅ Every fixture file carries the **SYNTHETIC COMPOSITE** disclaimer.
- ✅ No real-network, real-person, or client names used as the fixture subject (real networks appear only as cited public references).
- ✅ Each AESCSF domain, each SOCI hazard, the applicability split, and each AER ring-fencing trigger has at least one seeded hook (coverage matrix above).
- ✅ Synthetic skill compatibility evaluation covers `au-aescsf` and `au-energy-compliance` against Fixture A and Fixture B evidence anchors.
- ✅ Live generation review confirms the inventory/register enrichment is naturally used where fixture evidence supports it, and records partial coverage where the fixtures do not include CMDB or project-graph evidence.
- ⏳ Live LLM artefact quality review remains a human-review step before any external compliance reliance.

See [`REFERENCES_AND_METHODOLOGY.md`](./REFERENCES_AND_METHODOLOGY.md) for the audit trail.
