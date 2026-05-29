# Discovery Interview — CISO (extracted notes)

**Date:** 6 May 2026
**Interviewee:** Chief Information Security Officer (synthetic role), Eastland Energy Networks
**Interviewer:** Synthetic assessment lead
**Topics:** AESCSF, cyber & OT security program, SOC/monitoring, SOCI cyber hazard, supply chain

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE.** Fictional interviewee and content; illustrative of a DNSP CISO discovery conversation. Not a real person or transcript.

---

**On the cyber mandate and scope**

"I own cyber across both IT and OT — which is still unusual for a network this size; a lot of my peers only really own the IT side and OT sits under the control-room. We merged it about two years ago when the ADMS program started, because once you're piping real-time data into Azure you can't pretend they're two separate worlds anymore. The problem is the *org chart* merged faster than the *controls* did."

**On AESCSF maturity**

"Our last formal AESCSF self-assessment was the FY2024 cycle. We came out High on the Criticality Assessment Tool, so our target is MIL-3 on the operationally critical domains and MIL-2 across the rest. The honest position is we're sitting around MIL-1 to MIL-2 depending on the domain. Governance domains — Risk Management, Program Management — those are genuinely MIL-2, we've got the committees and the documented program. Where we fall over is **Cybersecurity Architecture**, **Situational Awareness**, and **External Dependencies / supply chain**. And because the overall MIL is the *lowest* domain, those three pull the headline number right down."

"That FY2024 assessment is also stale now. It predates most of the ADMS and the entire DERMS build. So whatever it says about our OT architecture is describing an estate we no longer have."

**On situational awareness / monitoring**

"This is my biggest gap and I'll say it plainly: we do not have dedicated OT security monitoring. The SIEM is good — for IT. It sees Entra, the endpoints, the servers, M365. It does not meaningfully see the OT network. We've scoped a Claroty-or-Nozomi-class OT monitoring platform in the uplift program but it's not deployed. So if something moved laterally from IT into the OT segment, our mean-time-to-detect in OT is… not a number I'd want to attest to."

"The SOC itself is hybrid — a small internal team plus an MSSP for 24/7. The MSSP's runbooks are IT-centric. They wouldn't know an abnormal SCADA command if they saw one, and right now they mostly can't see them anyway."

**On the SOCI cyber hazard and incident reporting**

"We're a designated critical electricity asset, so the CIRMP cyber chapter has to be real. On paper our incident-response plan references the SOCI 12-hour and 72-hour clocks. What we have *not* done is test that pipeline for an OT-origin incident. The 12-hour clock starts when we 'become aware' — and my honest worry is that for an OT event we might not become aware for a long time, because of the monitoring gap. So the clock is almost a red herring; the real exposure is detection."

"There's also a messy interaction with the NDB scheme. If a breach hits customer data we've got the 30-day NDB assessment timeline; if it hits the asset we've got the 12/72-hour SOCI timeline. Those two processes aren't reconciled in one playbook. Different teams, different clocks."

**On identity and access**

"Identity is fragmented and it's the root of a lot of findings. Corporate is on Entra ID with MFA basically everywhere. But there's still an authoritative on-prem AD for some OT-adjacent systems, and then OT itself has its own local accounts. Privileged access on the OT side is weak — there are shared operator console logins in some of the older control areas, so you can't always attribute an action to a person. Joiner-mover-leaver for field crews and contractors lags badly; we've found active accounts for people who left months ago."

**On supply chain / external dependencies**

"Supply chain is the one that keeps me up. The ADMS vendor and the protection vendor both need remote access for support. Some of those connections are still always-on VPNs rather than brokered, time-boxed jump-host access — legacy arrangements we haven't closed out. We hold SOC 2 or ISO 27001 from the big vendors but the flow-down into the smaller OT integrators is patchy. And there are open-source components in the DER export-control stack — which is fine, lots of the industry uses them, but we don't have a clean dependency inventory or a process for tracking vulnerabilities in them."

**On the Essential Eight baseline**

"On corporate IT we're ML1 solid, ML2 on most strategies. The asterisk is OT — application control and patching get carved out for the legacy controllers because we literally can't patch some of them inside vendor support. So if you read the E8 number without reading the OT carve-out, you'd overestimate where we are."

**Quick wins she'd expect the assessment to confirm**

- Close the always-on vendor VPNs / move to brokered access.
- Kill the shared OT console logins where the platform allows per-user accounts.
- Fix contractor joiner-mover-leaver.
- Refresh the AESCSF self-assessment against the *current* OT estate.

**CISO closing line:** "I don't need you to tell me we have gaps — I need a defensible, evidence-backed map of them that I can take to the Board and the AER, and that lines up AESCSF, SOCI and the E8 baseline so we're not telling three different stories."
