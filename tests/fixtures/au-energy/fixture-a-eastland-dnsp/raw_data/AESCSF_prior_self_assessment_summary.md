# AESCSF Self-Assessment Summary — FY2024 (extract)

**Entity:** Eastland Energy Networks Pty Ltd
**Framework:** AESCSF (v2-era), AEMO
**CAT result:** **High** criticality
**Target maturity:** MIL-3 for operationally critical domains; MIL-2 elsewhere
**Assessment date:** Q3 FY2024 (≈18 months old at time of this engagement)
**Status:** STALE — predates the ADMS replacement and the DERMS / DOE build

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE.** Illustrative MIL ratings only; not a real AESCSF assessment. Domain names per the `au-aescsf` canonical list. See `../../REFERENCES_AND_METHODOLOGY.md`.

## MIL by domain (self-assessed FY2024)

| # | Domain | Code | Current MIL | Target MIL | Notes |
|---|--------|------|-------------|------------|-------|
| 1 | Asset, Change & Configuration Mgmt | ACM | MIL-2 | MIL-3 | OT asset register exists but lags ADMS/DERMS additions |
| 2 | Threat & Vulnerability Mgmt | TVM | MIL-1 | MIL-3 | Legacy OT controllers unpatchable; no OT vuln program |
| 3 | Risk Management | RM | MIL-2 | MIL-3 | Committees + register in place |
| 4 | Identity & Access Mgmt | IAM | MIL-1 | MIL-3 | Fragmented identity; shared OT console logins |
| 5 | Situational Awareness | SA | MIL-1 | MIL-3 | **No dedicated OT monitoring** — SIEM is IT-centric |
| 6 | Information Sharing & Comms | ISC | MIL-2 | MIL-2 | AESCSF/AEMO threat-sharing participation |
| 7 | Event & Incident Response / Continuity | IR | MIL-2 | MIL-3 | Plan exists; **OT 12-hr pipeline untested**; DR not cyber-failover tested |
| 8 | Supply Chain & External Dependencies | EDM | MIL-1 | MIL-3 | Always-on vendor VPNs; patchy flow-down; OSS deps untracked |
| 9 | Workforce Management | WM | MIL-1 | MIL-2 | Inconsistent OT contractor vetting |
| 10 | Cybersecurity Architecture | CA | MIL-1 | MIL-3 | Flat OT-IT segments (rural); OT→IT data flow uncontrolled |
| 11 | Cybersecurity Program Mgmt | CPM | MIL-2 | MIL-3 | Documented program; funded uplift |

**Overall MIL (lowest-domain rule): MIL-1.** Headline pinned by TVM, IAM, SA, EDM, WM, CA.

## Lagging-domain commentary

The strong governance domains (RM, CPM, ISC) mask the operational gaps. The headline MIL-1 is driven by the OT-facing technical domains — exactly the area the ADMS/DERMS programs have since changed, which is why the assessment is now stale and a refresh is the recommended first action.
