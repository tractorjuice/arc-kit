# How ArcKit Is Quietly Destroying a Billion-Pound Consulting Business

For twenty years, UK public sector transformation has run on a predictable engine. A department identifies a problem, procures a Big 4 or MBB firm through G-Cloud or DOS, and six months later receives a 120-page PDF. The PDF contains a stakeholder map, a requirements catalogue, a target operating model, a risk register, a business case, and, if the engagement was expensive enough, a Wardley map someone fetched from a training course.

The PDF costs between £250k and £2m. The senior partner who sold it spent a handful of hours on it. The drafting was done by a 26-year-old associate in Canary Wharf at 11pm, working from a template the firm has been reusing since 2014.

Open-source generative toolkits are the first thing to make that engine unnecessary. Not obsolete, unnecessary. The work still needs doing. The pipeline that produced it does not.

This is not a future-state argument. ArcKit, the open-source toolkit I maintain, is six months old (first commit 14 October 2025) and as of writing has **1,669 GitHub stars, 195 forks, and trended on GitHub Daily on 19 April 2026**. It ships **68 baseline commands** covering the architecture lifecycle (requirements, ADRs, SOBC, vendor scorecards, Wardley maps, risk registers, TOMs) and another **19 community-contributed regulatory overlays** for EU and French sovereign delivery (AI Act, CRA, Data Act, DORA, DSA, NIS2, RGPD; ANSSI, SecNumCloud, EBIOS, DINUM, marche-public, and others). The Australian Investment Promotion Agency Data Framework is the first non-UK reference deployment. None of this required a vendor.

## What You Were Actually Paying For

Strip the consulting proposition back to its components and four distinct things come out:

1. **Artefacts**: SOBCs, requirements, ADRs, risk registers, TOMs, vendor shortlists, TCO models.
2. **Research**: desk work synthesising markets, vendors, regulations, case studies.
3. **Facilitation**: workshops, interviews, stakeholder brokering, political cover.
4. **Accountability**: a name on the front page when it goes wrong.

Industry estimates put items 1 and 2 at roughly two-thirds of billable hours and closer to a fifth of realised client value. You pay associate rates (£800 to £1,500 per day) for template population, manager rates (£1,500 to £2,500 per day) for quality-assuring the template population, and partner rates (£3,000 to £5,000 per day) for the front-page logo.

ArcKit reduces items 1 and 2 to near-zero marginal cost. A requirements document that used to take a team of three four weeks now takes a Claude session closer to an afternoon. The ArcKit version is not uniformly better. A senior architect writing from scratch will still produce sharper thinking on novel problems, and the toolkit has nothing to say about ambiguous strategic trade-offs. But on structure, traceability, consistent IDs, GDS Service Standard mapping, and source citation, the ArcKit draft routinely beats the £200k engagement draft. Those are the dimensions the template-populating layer was supposed to deliver, and the ones it was least good at.

Multiply that across 68 commands covering the architecture lifecycle (and another 19 regulatory overlays for non-UK delivery), and the artefact-production layer of the industry compresses.

## The Defensive Moves

Three responses from the large firms are already audible.

**"Our AI is better."** Every firm is standing up a Gen AI practice that rebadges the same underlying models. The claimed moat is proprietary methodology, which is exactly what open-source toolkits neutralise. A Deloitte SOBC template is not IP. It is a Word document with their logo on it. When 195 forks of a six-month-old project are quietly customising the same templates inside their own organisations, the proprietary-methodology claim gets harder to make with a straight face.

**"You need our assurance."** This is the strongest remaining card, and it is being played hard. You cannot trust an AI with a £50m business case. True. You also cannot trust a 26-year-old associate, which is why partner review exists. The live question is whether partner review of an AI draft is cheaper than partner review of a human draft. It is, by an order of magnitude.

**"Transformation is about people, not documents."** Correct, and convenient, because it is the one part of the stack that does not commoditise. It is also the part the large firms have historically under-invested in, because workshops do not scale and partners do not like running them.

## What Survives

The consulting role does not disappear. It narrows.

**Facilitation.** Getting a Director of Digital, a CFO, and a head of procurement in a room and extracting coherent requirements from them is genuinely hard. Models do not do rooms.

**Judgement.** Novel problems, ambiguous trade-offs, "should we even do this" questions. These are not template-shaped, and the toolkits do not pretend to answer them.

**Accountability.** If the artefact is largely automated, the premium for a name on the cover page is the remaining judgement work plus the insurance. That is a day-rate conversation, not a seven-figure engagement.

**Delivery.** Build, integrate, operate. The actual technology work. This was always the honest part of the industry, and it remains.

## The Pattern Travels

A reasonable objection to all of this is "fine for the UK, but our regulatory environment is different". The toolkit is six months old and already has working overlays for the EU regulatory stack (AI Act, Cyber Resilience Act, Data Act, DORA, DSA, NIS2, GDPR), the French sovereign stack (ANSSI, SecNumCloud, EBIOS, DINUM, marche-public, IRN, PSSI, code-reuse policy), and an Australian test deployment. None of those overlays were written by me. They were contributed by practitioners in those jurisdictions, in days, not months.

The implication for procurement is straightforward: if a firm's pitch rests on "we know your regulatory environment", check whether an overlay already exists, or could be authored in a fortnight by one engineer. The answer is increasingly yes.

## The Uncomfortable Maths

UK central government spent roughly £2.8bn on consulting in 2023 (Cabinet Office reporting, broadly consistent with Tussell's estimates). The share of that spend routed into document drafting and desk research is contested, but even conservative industry accounts put it above a third. That is a billion-pound order of magnitude of work that is now doable in-house by a department with the capability, the appetite, and a Claude subscription.

Put it more plainly. A single open-source repository, six months old, maintained largely on evenings and weekends, has eliminated the economic justification for roughly a billion pounds of annual UK central-government consulting spend. Not the relationships. Not the workshops. Not the partner accountability. Just the deliverable, the part the invoices were actually attached to. ArcKit did not disrupt a billion-pound business. It quietly removed the reason that business existed in its current form. The disruption is what the firms do next, and on current evidence that conversation has not started.

Whether departments actually reclaim it is a different question. The tooling is the easy part. The hard part (civil service capability, Treasury appetite for in-house-generated artefacts, framework lock-in) is real, and is covered in other pieces in this collection.

The firms will not die. Accenture's earnings call will not mention this. But the pyramid staffing model (partner at the top, army of associates at the bottom) does not survive when the associate work is done by software. Expect smaller graduate intakes, thinner mid-career layers, and rising day rates for the remaining seniors as the work that survives is genuinely harder.

## So, Do We Still Need Consultants?

Yes, for a narrower, more honest scope. Advisors who facilitate, judge, and stand behind the work. Partners in delivery, rather than vendors of paperwork.

What we do not need, and should not pay for again, is a £400k engagement to produce a document that a free open-source toolkit, with 1,669 stars and 195 forks six months in, now writes in an afternoon. That era is over. The only remaining question is how long departments, and the firms that sell to them, keep pretending it is not.

<!-- arckit:related-articles -->
## Related Articles

- [Internal Memo, Somewhere in a Big 4 Consulting Company](article-viewer.html?a=2026-05-01-consulting-internal-memo)
- [From ArcKit to McKinsey-Style Infographics in an Afternoon](article-viewer.html?a=2026-04-27-mckinsey-decks-from-arckit)
- [Launching ArcKit FDE: Embedded Architects for UK Public Sector](article-viewer.html?a=2026-05-12-arckit-fde-launch)
- [The Toolkit Drafts. The Architect Judges.](article-viewer.html?a=2026-04-30-toolkit-drafts-architect-judges)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
