# Discovery Interview — Head of Network Control / OT (extracted notes)

**Date:** 7 May 2026
**Interviewee:** Head of Network Control / OT (synthetic role), Eastland Energy Networks
**Interviewer:** Synthetic assessment lead
**Topics:** SCADA/ADMS/DERMS, OT network & segmentation, control centre, vendor remote access, DER comms, anti-patterns

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE.** Fictional interviewee and content; illustrative of a DNSP OT/control discovery conversation. Not a real person or transcript.

---

**On the control systems estate**

"Heart of it is the SCADA/DMS. The incumbent SCADA is fifteen-plus years old and we're partway through replacing it with a full ADMS — Advanced Distribution Management System. The ADMS gives us the unified network model, real-time state, power-flow, switching. It pulls the model from GIS and it's increasingly the thing that talks to the DERMS. Outage Management is integrated to it, and OMS in turn talks to the customer comms platform on the IT side — so a real outage event now touches OT, IT and the customer portal in one flow."

**On DER, DERMS and Dynamic Operating Envelopes**

"The DERMS and the Dynamic Operating Envelope engine are new builds. The DOE engine calculates how much each connection point can import/export without breaching network limits, and we publish those envelopes out to customer inverters. The comms standard is CSIP-AUS — the Australian Common Smart Inverter Profile, which sits on IEEE 2030.5. Some of our early export-control work leaned on the kind of open-source patterns the industry's been sharing — there's a well-known open dynamic-export client out there — before we hardened our own gateway."

"What people underestimate is that this is a *control path to customer premises*. We are sending signals that curtail or enable generation at someone's house. The Victorian Emergency Backstop work is the extreme version — we have to be able to remotely back off customer solar in an emergency. That's a real-time control action that starts in our OT, goes out over comms we don't fully own, to a device we definitely don't own."

**On the OT network and segmentation**

"The backbone is private fibre between the big sites, point-to-point radio in places, and increasingly 4G/5G for pole-top devices and the grid edge. The cellular expansion worries me from a security point of view — every one of those is a little endpoint sitting on a public carrier."

"Segmentation is a work in progress. In the metro zone substations we've got proper OT-IT separation. Out in the rural areas there are still flat segments — historically the protection and the comms and the local HMI all sat on the one network because that's how it was built in the nineties. Closing those out is in the uplift program but it's not done."

**On the control centre**

"Primary control room plus a secondary DR site. The DR site is real but we haven't full-failover tested it under a cyber scenario — only for the 'building's on fire' scenario. Operators run the consoles 24/7. In the modern areas everyone's got a named login. In a couple of the legacy console setups there's still a shared operator login — it's a single role account that whoever's on shift uses. I know it's a problem; the platform makes per-user painful and it's never been the priority. It means I can't always tell you *which person* issued a given command."

**On vendor remote access**

"The ADMS vendor and the protection-relay vendor both need to get in for support. The way it *should* work is brokered, time-boxed access through a jump host with someone watching. The way it works for a couple of the older contracts is an always-on VPN that's just… up. We've been meaning to retire those. If you're writing down anti-patterns, write that one in capital letters."

**On legacy controllers**

"We've got modern IEDs in the refurbished substations, but there's a long tail of older relays and RTUs. Some of them can't take a security patch — there isn't one, the vendor's moved on, and we can't just rip and replace 220 substations overnight. So they sit there, doing their job, unpatched. Asset lifecycles in this industry are measured in decades."

**On the IT/OT data flow**

"The data platform team loves our OT telemetry — it feeds predictive maintenance and the DER forecasting models. So there's now a steady flow of OT data *out* into Azure. I'm comfortable with the value; I'm less comfortable that nobody's drawn the line clearly on what flows, how, and whether anything could come *back* the other way through that pipe."

**Anti-patterns Mark volunteered (for the record)**

- Flat OT-IT networks in rural zone substations.
- Shared operator console logins in legacy control areas.
- Always-on vendor VPNs for OT support.
- Unpatchable legacy relays/RTUs with no compensating monitoring.
- No OT-specific security monitoring (echoing the CISO).
- DR control centre never failover-tested under a cyber scenario.

**Mark's closing line:** "The grid will keep the lights on — that's what we're built to do. What I can't yet prove is that I'd *know* if someone was in my OT network, and that I could operate through it. That's the gap."
