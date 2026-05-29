# Discovery Interview — CTO / Head of Security (extracted notes)

**Date:** 12 May 2026
**Interviewee:** Chief Technology Officer (synthetic role), Voltiq Analytics
**Interviewer:** Synthetic assessment lead
**Topics:** SOCI applicability, AESCSF supplier alignment, multi-tenant SaaS, data handling, supply chain

> ⚠️ **SYNTHETIC COMPOSITE — TEST FIXTURE.** Fictional interviewee/content. Not a real person or transcript.

---

**On what Voltiq is (and isn't)**

"We're a software and analytics business. We forecast DER, we calculate hosting capacity, and we run a Dynamic Operating Envelope calculation service that some of our DNSP clients consume. We do AESCSF and compliance advisory on the side. What we are *not* is a network operator or a critical asset. We run on Azure; we don't own a data centre. So when people ask 'are you SOCI-regulated?', the honest answer is no — we're not a responsible entity for a designated critical asset."

"But — and this is the bit procurement teams care about — our customers *are*. So their obligations land on us through contracts. We get asked for AESCSF alignment, SOC 2, incident-notification SLAs, data-residency, the lot. Being not-SOCI doesn't get us off the hook; it just changes the shape of the hook."

**On the sensitive-supplier angle**

"A couple of our customers have flagged that because we touch constraint data and our DOE outputs can influence how they operate their network, we might fall under the SOCI supplier-influence — 'sensitive supplier' — thinking. We're not the asset, but we're close enough to it that they have to care about us. We need a clean position on that."

**On the multi-tenant SaaS — the real risk**

"Architecturally, the thing that matters is tenant isolation. We've got several DNSPs and retailers as tenants on the same Azure platform. If one tenant could see another tenant's constraint data or customer DER data, that's catastrophic — both commercially and from a privacy point of view. We've designed for isolation but we haven't had it independently assured. The SOC 2 Type II is in progress and that's the main reason we're doing it."

**On data handling and privacy**

"We ingest customer DER data and sometimes NMI-level data on behalf of clients. So we're a data processor, mostly — but the line between processor and controller gets blurry when we derive forecasts and feed them back. Our Privacy Act posture is okay but not rigorous, and we haven't cleanly mapped which APP obligations are ours versus the client's."

**On the federal baseline**

"Essential Eight — we're customer-driven on it. ML1 across the board, ML2 on some strategies. It's patchy because we're a 120-person software company, not a bank. No formal ISM applicability statement."

**On supply chain (its own)**

"We've got open-source components in the analytics and DER stack — same libraries half the industry uses — and we lean on Azure plus a few sub-SaaS tools. We don't have a clean dependency inventory and our sub-processor disclosure to customers is ad hoc. That's a gap I already know about."

**On access**

"Our developers can get to client production data more easily than they should. Vetting is light-touch. For a business selling into critical-infrastructure customers, that's the thing I'd most want tightened."

**Anika's closing line:** "I don't want the assessment to just say 'you're not SOCI, relax.' I want it to say 'you're not SOCI — here's exactly what your SOCI-covered customers will hold you to, and here's where you fall short of it today.' That's the document that actually helps me sell."
