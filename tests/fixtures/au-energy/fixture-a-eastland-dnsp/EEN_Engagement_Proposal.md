**PROPOSAL**

**Critical Infrastructure Cyber & Compliance Assessment**

Prepared for

**Chief Information Security Officer (synthetic role)**

Eastland Energy Networks Pty Ltd (trading as Eastland Power)

Prepared by

**Synthetic Assessment Lead**

Independent advisory role

May 2026

**SYNTHETIC PUBLIC EVALUATION FIXTURE**

---

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE ONLY.** Eastland Energy Networks is a fictional composite DNSP built to validate the ArcKit `au-energy` recipe. It does not represent any real network or client. See `EEN_Strategic_Context_Brief.md` and `../REFERENCES_AND_METHODOLOGY.md` for sources and method.

---

# 1. Context

Eastland Energy Networks (EEN) is a Victorian electricity Distribution Network Service Provider serving ~770,000 customers across ~55,000 km of network and ~220 zone substations. EEN is a **designated critical electricity asset** under the Security of Critical Infrastructure Act 2018 (SOCI Act) and an AEMO market participant, and it operates an unregulated arm — **Eastland Connect** (EV charging, behind-the-meter solar/battery, contestable connections, dark-fibre leasing).

EEN is mid-transition on a large IT/OT-convergent program portfolio (ADMS replacement, DERMS / Dynamic Operating Envelopes, CER Data Exchange onboarding, dynamic-tariff billing, and a Cyber & OT Security Uplift). The convergence of operational technology and corporate IT — together with the SOCI, AESCSF and AER ring-fencing obligations stacked on top — has outpaced the organisation's current security and compliance evidence base.

This proposal covers a **Phase 1 Critical Infrastructure Cyber & Compliance Assessment**: an evidence-based baseline of EEN's posture against the energy-sector regulatory stack, designed to compose on top of an existing federal compliance baseline (Essential Eight, ISM, Privacy/NDB) rather than re-derive it.

# 2. Why Now

- **A designated critical asset under live obligations.** The SOCI CIRMP must be board-attested annually and the 12-hour / 72-hour cyber incident-reporting pipeline must actually work. The last AESCSF self-assessment predates the current OT estate.
- **OT/IT convergence has changed the risk surface.** ADMS, DERMS and the Azure data platform now move OT telemetry into IT systems and push control signals out to customer devices (CSIP-AUS / IEEE 2030.5). The security model was built for a more separated world.
- **Ring-fencing scrutiny.** With Eastland Connect competing in contestable markets, the AER expects demonstrable separation — especially of network information flows.
- **Capital is committed.** The 2026–31 Cyber & OT Security Uplift is funded; leadership needs a defensible current-state baseline to direct that spend and to evidence it to the AER and the Board.

# 3. Scope of Work

## Phase 1: Critical Infrastructure Cyber & Compliance Assessment

A structured, evidence-led review across four regulatory lenses, with the IT/OT convergence seam as the connecting theme.

**Workstream A — AESCSF Capability Assessment**

- Confirm the AEMO Criticality Assessment Tool (CAT) banding and target Maturity Indicator Level (MIL) profile.
- Assess all **11 AESCSF domains** at MIL-1 / MIL-2 / MIL-3 with practice-level evidence.
- Apply the **OT Security Overlay** (ICS/SCADA inventory, OT segmentation, OT monitoring, vendor remote access, ICS protocol security).
- Surface **anti-patterns** (shared OT credentials, flat OT-IT networks, unpatched legacy controllers, missing OT monitoring).

**Workstream B — SOCI Act / CIRMP**

- Confirm critical-asset designation and responsible-entity / accountable-officer accountabilities.
- Assess the CIRMP across the **four hazard categories** (cyber, personnel, physical, supply chain).
- Test the **12-hour / 72-hour cyber incident reporting** capability (detection → escalation → CISC/ASD notification).
- Review the **annual board attestation** cycle and evidence retention.

**Workstream C — AER Ring-fencing**

- Map regulated vs Eastland Connect activities, shared staff/systems, branding, and **information-flow controls**.
- Identify ring-fencing risks and the controls (technical and procedural) needed to evidence separation.

**Workstream D — Federal Baseline Composition**

- Cite and reconcile existing **Essential Eight (E8)**, **ISM**, **Privacy/APP** and **NDB** positions; reconcile the NDB 30-day clock with the SOCI 12/72-hour clocks.
- Identify where OT scope is carved out of the federal baseline and what that means for the energy obligations.

**Deliverables:**

- AESCSF Capability Assessment (11-domain maturity matrix + OT overlay + anti-patterns + remediation plan).
- SOCI CIRMP assessment (four-hazard mitigation summary, incident-reporting capability, board-attestation readiness, material-risk register).
- Ring-fencing findings note (information-flow control gaps + remediation).
- Consolidated executive read-out: prioritised remediation grouped Quick Wins / Short-Term / Medium-Term.

## Phase 2 (Optional): Remediation & Uplift Roadmap

If the assessment warrants it, a follow-on phase would sequence the Cyber & OT Security Uplift program against the findings (OT monitoring, segmentation, IAM convergence, supply-chain controls, CIRMP closure) with an investment case mapped to the 2026–31 determination.

# 4. Approach & Investment

Phase 1 is structured across four weeks.

| Week | Activity | Output |
|------|----------|--------|
| Week 1 | Kickoff, document review, stakeholder interviews (CISO, OT/control, regulation), control-centre walkthrough | Interview notes, evidence index |
| Week 2 | AESCSF domain assessment + OT overlay; SOCI CIRMP review | Draft Workstreams A & B |
| Week 3 | Ring-fencing review; federal-baseline composition; anti-pattern validation | Draft Workstreams C & D |
| Week 4 | Synthesis, maturity matrices, remediation plan, executive read-out | Final deliverables |

**Investment:** Out of scope for this public evaluation fixture. Timing and role assumptions are illustrative only.

# 5. Engagement Assumptions

This fixture assumes the assessment is run as a time-boxed discovery and validation activity using the evidence sources listed above. Role labels, interview groups, and delivery milestones are synthetic placeholders used only to make the proposal format realistic for ArcKit recipe validation.

# 6. Next Steps

- Confirm Phase 1 scope and evaluation assumptions.
- Schedule kickoff and a **control-centre walkthrough** (primary + DR site).
- Provide read access to the AESCSF prior self-assessment, the current CIRMP and last board attestation, the ring-fencing compliance statement, the OT asset register, and the E8/ISM artefacts.
- Provide the pre-discovery information listed in the accompanying checklist.

## Public Fixture Handling

This document is synthetic public test data. It is designed to exercise ArcKit recipe behaviour without using confidential, client, or real network information.

**Synthetic Assessment Lead** — Independent advisory role

*(Synthetic test-fixture document. Not a real engagement.)*
