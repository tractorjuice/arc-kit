# Pricing the ArcKit Project: What Would an Investor Actually Pay?

The previous three articles in this collection inverted the usual consulting argument: that the deliverable was dead, that the visual wrap was dead, and that £25,000 a week was the sustainable cost of an alternative supplier. The thread tying those pieces together was the value ArcKit *displaces*. The question this article asks is the opposite: what is the project itself *worth*. If the maintainer woke up tomorrow and decided to sell the thing, what would land in the bank account.

The honest answer is two numbers. A financial investor would pay one figure based on disciplined revenue multiples and execution risk. A strategic acquirer would pay another, considerably higher, based on synergy, defensive value, and what owning the project would do to their existing business. The spread between the two is not a rhetorical flourish. It is the single most important number in the analysis, because it tells the maintainer (and any future maintainer of any similar open-source project) what kind of buyer to optimise for.

The two numbers are roughly £20 million for a financial investor and £80 million for a strategic acquirer, today, in current market conditions. The working below explains how those figures fall out, and what would move them up or down.

## The Pricing Model That Has to Exist First

ArcKit is currently free and open-source. To value it as an investor would, the analysis has to assume it eventually monetises. There is no pure-play valuation methodology for a Git repository.

Three commercial models are plausible. The first is per-seat enterprise licensing in the JetBrains and GitHub Enterprise tradition, where each developer or architect using the tool generates a per-month subscription. The second is per-organisation team licensing in the Linear and Vanta tradition, where the buyer is a department or company and the unit of revenue is the organisation rather than the seat. The third is a managed cloud plus paid premium features model in the Confluence and Notion tradition, where the open-source core stays free and the commercial product layers hosted infrastructure, role-based access controls, audit logging, single sign-on, and enterprise support.

For ArcKit specifically, per-organisation team licensing is the most defensible. The buyer for governance tooling is rarely an individual architect; it is an enterprise architecture function or a digital transformation team within a department or company. The unit of value is the organisation adopting the standard. This matches Vanta and Drata, the two closest comparables in the governance and compliance space, both of which sell per-organisation with bands that scale by size and complexity.

Sensible average contract values, anchored to those comparables: £5,000 a year for a small organisation, £15,000 a year for a mid-sized organisation, £50,000 a year for a large enterprise, and £100,000 or more for a UK central government department running ArcKit across a portfolio of programmes. The blended average across a realistic customer mix is somewhere between £15,000 and £25,000 per year.

## Addressable Market

The market builds up in three layers.

The UK public sector is the natural first beachhead, because the existing articles in this collection are aimed at it and the maintainer's network sits there. There are roughly 25 main central government departments, around 600 arms-length bodies, around 400 local authorities, around 80 NHS trusts, and a long tail of regulators, agencies, and devolved-nation equivalents. Total: approximately 1,500 entities. At a 10 per cent capture rate over five years and a £30,000 average contract value, the UK public-sector segment is about £4.5 million in steady-state ARR.

The international public sector adds materially more capacity. Australia, Canada, New Zealand, Ireland, and the EU member states have similar architectural governance needs and similar procurement structures. Anglophone first because the documentation and command set are English; the EU follows with the French and Austrian regulatory overlays already shipped in the codebase, which lowers entry friction for those markets. A conservative estimate puts global public-sector ARR potential at four times the UK figure: £18 million.

The private-sector enterprise governance buyer is the third and largest segment. The FTSE 350, the Eurostoxx 600, and the Forbes Global 1000 between them represent roughly 1,500 enterprises with material architecture functions, of which perhaps 500 have governance overhead heavy enough to justify a tool like ArcKit. Banks, insurers, telcos, utilities, defence, and large pharmaceutical and consumer-goods companies all qualify. A 10 per cent capture at £50,000 average contract value gives a further £25 million of ARR.

Layered together, the realistic three-to-five-year ARR potential is in the range of £20 million to £50 million. Twenty million is the conservative case, with adoption concentrated in the UK and a handful of strategic international wins. Fifty million is the optimistic case, with broad international public-sector traction and meaningful enterprise penetration. The midpoint of £35 million is the figure used for the valuation maths below.

## The PE and Growth Equity Case

Private equity and growth equity buyers price companies on disciplined revenue multiples. Comparables matter, current market conditions matter, and the multiple that gets paid is constrained by what the buyer thinks they can flip the asset for to the next buyer.

The relevant comparables for ArcKit are the governance and compliance SaaS companies that sit in adjacent product space.

Vanta is the closest. Its July 2025 Series D round valued the company at $4.15 billion on $100 million of ARR, a multiple of approximately 41 times. That number reflects strong growth and a hot category, and it is generally considered the high end of what governance SaaS can command at present.

Drata raised at a $2 billion valuation in late 2022 on $30 million of forward-looking ARR, a forward multiple of around 67 times that has since compressed sharply. By early 2025 Drata had reached approximately $100 million of actual ARR, putting the implied current multiple at around 20 times if the valuation has held flat through subsequent unmarked rounds. Realistically, Drata would clear at a lower multiple in today's market, probably 12 to 15 times.

OneTrust is the largest privacy and governance SaaS company by revenue, generating over $500 million of ARR. It was valued at $4.5 billion in 2023, a multiple of approximately 9 times, and is reportedly exploring a private equity sale in late 2025 at rumoured valuations exceeding $10 billion, which would push the multiple back to around 18 to 20 times. The wider market signals that PE buyers are willing to pay materially above public-market multiples for companies of this profile.

The broader public SaaS market provides the floor. As of early 2026, the median enterprise-value-to-revenue multiple for publicly traded SaaS companies is around 3.4 times, with the average closer to 6.6 times once high-growth outliers are included. Governance and compliance SaaS trades at a premium to that median, partly because the regulatory tailwinds are real and partly because customer retention in compliance tooling is structurally high. Call the relevant private-market multiple range 8 to 15 times current ARR for a growth-stage governance SaaS company in 2026.

Apply that range to ArcKit's projected steady-state ARR of £35 million and the implied enterprise value at maturity is between £280 million and £525 million. That is the valuation a PE buyer would pay for the company three to five years out, assuming the projected ARR materialises and the market remains roughly where it is today.

But ArcKit today is not at £35 million ARR. ArcKit today is at zero ARR. The pre-revenue discount is significant. Three independent factors compress the valuation:

Execution risk, which captures the probability that the projected ARR does not materialise on schedule, typically discounts a forward valuation by 40 to 60 per cent at the seed-to-Series-A stage.

Single-founder risk, which captures the dependency on the maintainer continuing to lead the project, discounts a further 20 to 30 per cent unless mitigated by a credible succession plan or commercial team build-out.

Pre-revenue discount, which captures the gap between paper ARR projections and audited revenue, compresses a further 30 to 50 per cent for an asset with no current paying customers.

Stacking those discounts conservatively (60 per cent execution, 25 per cent founder, 40 per cent pre-revenue) on the midpoint of the mature valuation range (£400 million) gives a present-value range of £15 million to £40 million. Twenty million pounds is a defensible central estimate for what a financial investor would pay for ArcKit today, expecting to flip it to a strategic acquirer or take it to IPO at a higher multiple in three to five years.

## The Strategic Acquirer Case

Strategic acquirers pay more than financial investors because they capture synergies that financial investors cannot. The relevant question for ArcKit is who would want to own it and what owning it would do to their existing business.

Four buyer categories are credible.

The Big 4 firms (Deloitte, EY, KPMG, PwC) and the next tier of strategy houses (Accenture, Capgemini, BCG Platinion, McKinsey Digital) have a defensive interest in owning ArcKit. The previous three articles in this collection have argued, fairly directly, that ArcKit erodes the margin on their public-sector scoping engagements. Owning the tool would let them control its commercial trajectory, integrate it into their delivery methodology as a competitive differentiator rather than a margin threat, and prevent a competitor from doing the same. Defensive acquisitions in this category tend to clear at premium multiples because the buyer is paying not just for the asset but to neutralise a threat.

Governance and compliance SaaS companies (Vanta, Drata, OneTrust, Hyperproof) have a product-extension interest. ArcKit is adjacent to their existing product surfaces (security and privacy compliance attestation) but covers an architectural and procurement-readiness layer they do not currently address. The buyer would acquire customer overlap, cross-sell potential, and a credible expansion of their governance footprint into earlier project lifecycle stages. This is the natural acquirer category if ArcKit matures into a steady commercial business; the fit is closer than any of the others.

Hyperscale cloud and AI tooling providers (Microsoft, AWS, Google, Anthropic, Salesforce) have an ecosystem interest. ArcKit drives consumption of Claude and indirectly of the underlying cloud infrastructure, and an explicit strategic relationship would tighten the integration. Anthropic in particular has an interest in being seen as the platform of choice for serious enterprise architecture work, and owning the most successful example of that work would be a credible part of an enterprise positioning strategy. AWS and Microsoft would acquire similar positioning for Bedrock and Azure AI Foundry respectively.

Enterprise tooling consolidators (Atlassian, ServiceNow, IBM) have a portfolio interest. IBM in particular has demonstrated willingness to pay premium multiples for strategic infrastructure assets: the $6.4 billion HashiCorp acquisition in 2024 was struck at approximately 10 times annual revenue for a public, profitable, infrastructure-tooling company. Atlassian has a similar appetite for adjacent enterprise tools that extend the developer-and-architect persona footprint. ServiceNow is increasingly positioning as the architecture-and-governance platform for large organisations.

Strategic premiums in this kind of acquisition typically run 50 to 100 per cent above the financial-investor floor, depending on competitive dynamics. A single bidder in a non-competitive process pays at the lower end. A two-or-three-bidder competitive auction with defensive interest from a Big 4 and product interest from a governance SaaS clears at the higher end.

Apply that premium range to the £20 million central PE valuation and the strategic case lands between £30 million and £150 million. The midpoint of £80 million is the defensible central estimate for what a strategic acquirer would pay today in a normally-competitive process. A genuinely contested auction with multiple credible bidders could push that materially higher. A quiet sale to a single buyer with no competing interest would land closer to the lower bound.

## The Spread, and What Determines Which Exit Clears

The spread between the financial-investor floor (£20 million) and the strategic-acquirer central estimate (£80 million) is approximately four times. That spread is large enough that the choice of exit type is the single biggest valuation driver. The maintainer of any open-source project that displaces consulting or professional services spend should understand which of the two routes their project naturally points to, because optimising for the wrong one leaves a lot of money on the table.

Three conditions push toward a strategic exit. First, market consolidation in the buyer's category, which intensifies the defensive-acquisition logic. The governance and compliance SaaS market is consolidating right now (the OneTrust PE auction is one signal of that), which is favourable for ArcKit. Second, public visibility: an asset that has trended on GitHub, attracted media coverage, and built a recognisable name commands a strategic premium that an obscure asset does not. ArcKit trended on GitHub in April 2026 and has accumulating coverage in the consulting and public-sector trade press; the visibility curve is favourable. Third, a credible competitive threat to one or more named buyers. The Big 4 specifically have a defensive interest because the article arc that the maintainer has been publishing makes the threat explicit.

Three conditions push toward a financial exit. First, revenue traction without sufficient strategic positioning, which makes the asset look like a commodity SaaS to financial buyers and removes the synergy premium. Second, founder fatigue without a clear succession story, which any buyer will price into the deal. Third, market fragmentation in the buyer's category, which dilutes the defensive-acquisition logic.

For ArcKit specifically, the conditions favour a strategic exit. The combination of explicit market positioning against a vulnerable buyer category (Big 4 consulting), public visibility, and category consolidation is unusually well-aligned. The maintainer's optimal strategy, if exit is the goal, is to optimise for strategic visibility rather than to grind out early revenue at the expense of brand.

## The Honest Caveats That Knock Multiples Down

A valuation analysis that ignores its own weaknesses is marketing, not analysis. Five caveats apply to the figures above and any of them, materialising adversely, pushes the numbers down.

Open-source heritage means competitors can fork the project and offer a competing commercial distribution. Vanta and Drata do not have this exposure because they were closed-source from the start; ArcKit does. A serious commercial competitor, particularly one backed by an existing governance SaaS company, could meaningfully reduce ArcKit's strategic value by demonstrating that the technology can be reproduced.

Single-founder concentration risk is the single largest discount factor at the financial-investor level. Until there is a credible commercial team in place (head of product, head of sales, head of customer success, and a backstop technical lead), the valuation will be discounted regardless of traction.

Zero current revenue means everything is forward-looking. Any buyer will discount paper projections heavily. The fastest way to compress this discount is to convert open-source users into paying customers, even at low ACVs, because a converting funnel is itself an asset.

Governance overhead in running both an open-source community and a commercial business is non-trivial. Many projects have failed at this transition (the Redis and Elastic licensing disputes are cautionary examples). A buyer will price in the risk that the community fork the project in response to a perceived commercial encroachment.

AI tooling regulatory exposure is the youngest and least quantifiable risk. The EU AI Act and emerging UK and US frameworks could impose disclosure and accountability requirements on architectural decision-support tools that materially change the cost base. ArcKit ships an EU AI Act compliance overlay in the codebase, which is helpful, but the regulatory environment is in flux and any buyer will discount accordingly.

## What the Numbers Mean

A defensible range for what an investor would pay for ArcKit today is approximately £20 million to £80 million, with the lower bound being a financial-investor central estimate and the upper bound being a strategic-acquirer central estimate in a normally-competitive process. A genuinely contested strategic auction could push the upper bound to £150 million or more; a quiet financial sale with no competitive tension could clear at the lower bound or below.

Two reference points anchor those figures. Twenty million pounds is approximately one tenth of what HM Treasury reportedly spent on consultants in a single year before the November 2024 controls. Eighty million pounds is approximately what a single Big 4 firm makes in margin from twenty UK government scoping engagements. ArcKit's potential acquisition value is, in other words, a small fraction of the consulting spend it is making contestable. That asymmetry is the structural reason the numbers hold: the value displaced is so much larger than the value captured that even modest capture supports a substantial price tag.

For the maintainer, the practical implication is that the optimal strategy depends on the time horizon. A three-to-five-year hold and grind-to-revenue strategy lands the asset at the high end of the financial-investor range, perhaps £40 to £60 million. A one-to-two-year visibility-and-positioning strategy aimed at a strategic acquirer lands the asset at the central or upper strategic estimate, £80 to £150 million, but carries the risk of a missed window or a softer market when the time comes to transact.

For the broader category of open-source projects that displace consulting and professional-services spend, ArcKit is a useful data point. The category does not need venture capital to produce assets with eight-figure exit values. What it needs is structural alignment with a vulnerable consulting category, public visibility that makes the alignment obvious, and a maintainer willing to either build the commercial scaffolding themselves or hand the project to a buyer who can.

The arithmetic, again, is in the open.

## Sources

- [Vanta closes $150 million Series D at $4.15 billion valuation, July 2025 (CNBC)](https://www.cnbc.com/2025/07/23/crowdstrike-backed-vanta-is-valued-at-4-billion-in-new-funding-round.html)
- [Drata $2bn valuation Series C, December 2022 (Sacra)](https://sacra.com/c/drata/)
- [OneTrust on track to surpass $500m ARR (OneTrust newsroom)](https://www.onetrust.com/news/onetrust-trustweek-2024-momentum/)
- [OneTrust private equity sale exploration at $10bn+ rumoured (Secure Privacy)](https://secureprivacy.ai/blog/onetrust-private-equity-deal-2026)
- [IBM acquires HashiCorp for $6.4bn enterprise value, April 2024 (TechCrunch)](https://techcrunch.com/2024/04/24/ibm-moves-deeper-into-hybrid-cloud-management-with-6-4b-hashicorp-acquisition/)
- [SaaS valuation multiples 2015-2026 (Aventis Advisors)](https://aventis-advisors.com/saas-valuation-multiples/)
- [Government tightens consultancy spending to save £1.2bn by 2026 (Cabinet Office)](https://www.gov.uk/government/news/new-controls-across-government-to-curb-consultancy-spend-and-save-over-12-billion-by-2026)
- [NAO: Government lacks a clear picture on how much it spends on consultants (NAO)](https://www.nao.org.uk/press-releases/government-lacks-a-clear-picture-on-how-much-it-spends-on-consultants/)

<!-- arckit:related-articles -->
## Related Articles

- [From Brief to Investment-Ready in Four £25k Weeks](article-viewer.html?a=2026-04-27-bootstrap-25k-week)
- [From ArcKit to McKinsey-Style Infographics in an Afternoon](article-viewer.html?a=2026-04-27-mckinsey-decks-from-arckit)
- [How ArcKit Is Quietly Destroying a Billion-Pound Consulting Business](article-viewer.html?a=2026-04-20-consulting-deliverable-is-dead)
- [Launching ArcKit FDE: Embedded Architects for UK Public Sector](article-viewer.html?a=2026-05-12-arckit-fde-launch)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
