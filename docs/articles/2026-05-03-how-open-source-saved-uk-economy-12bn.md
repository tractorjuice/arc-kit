# I have saved the UK economy £24 billion. ArcKit is the third time.

> **Publication target:** Medium
> **Drafted:** 2026-05-03
> **Status:** DRAFT — awaiting review

*The pattern: open source, a small team, the right architecture. The savings follow.*

![£24bn hero](2026-05-03-how-open-source-saved-uk-economy-12bn-hero.png)

---

## Twenty-four billion pounds, twice

I have spent many years building things that saved the UK government an enormous amount of money. The numbers are not modest. G-Cloud, the procurement framework I helped build at Cabinet Office in 2012, has saved roughly £12 billion against what the same services would have cost on the legacy System Integrator contracts (The Oligopoly). The UN Global Platform, the system I built for the United Nations between 2017 and 2020, fed real-time shipping and aviation data to the Treasury and the Bank of England during COVID. This saved the UK economy an estimated £12 billion.

Twenty-four billion pounds saved by the same playbook applied to two different problems. Now I am building a third thing that is going to do it again. It is called ArcKit. This article is about why I think the pattern repeats, and why the next round of savings is going to come from the part of government IT that nobody talks about: enterprise architecture.

## The first £12 billion: G-Cloud

### Breaking the Oligopoly

In 2011 the UK government bought IT through a handful of giant System Integrators on contracts that ran for a decade and cost taxpayers a fortune. A small team inside the Cabinet Office set out to break that model. I led the original CloudStore, the marketplace that turned a procurement framework into something a buyer could actually use. We built it on Magento Community Edition because that was what we could ship in weeks rather than years. Buyers compared services. Contracts were signed in days. A £4 million quote on the legacy framework became a £50,000 line on G-Cloud. The same software. A different route to market.

### What the numbers say

The numbers tell themselves. Annual sales through G-Cloud grew from £18.2 million in 2012/13 to £2.91 billion in 2024/25. The cumulative public sector spend has crossed £16 billion. The Crown Commercial Service estimates direct commercial benefits of £2.3 billion. SME share of that spend has held at 37 to 47 per cent throughout the framework's life, where SME share of central government technology procurement had been 6.8 per cent in 2010. The conservative estimate of total saving against what the legacy framework would have cost is £12 billion. G-Cloud is now in its 15th iteration. Other countries have studied it as a model.

It is the single largest deliberate redirection of public procurement towards smaller suppliers in the UK's history.

## The second £12 billion: the UN Global Platform during COVID

### The question

In 2017 the UN Statistical Commission asked a difficult question. National statistics offices around the world were sitting on the same problem: how do you produce official statistics from satellite imagery, mobile phone data, shipping AIS feeds and other non-traditional sources, when most NSOs cannot afford a single data scientist, let alone a cloud platform?

### Building the platform

I was Solution Architect at the UK Office for National Statistics and Lead Solutions Architect of the UN Global Working Group on Big Data for Official Statistics. I led the build. The original proof of concept that I demonstrated at UN Headquarters in New York in March 2018 cost a total of $2,857 in cloud credits. By handover on 1 June 2020 the production system was processing roughly 600 million records per day across seven core services, four regional hubs and two global hubs, in five languages, on four cloud providers simultaneously: Amazon Web Services, Google Cloud, Microsoft Azure and Alibaba Cloud. Multi-cloud was a political requirement, not a technical preference. You cannot ask 193 member states to trust a platform that runs exclusively on the servers of one country.

### Bean's warning, and the data that answered it

Then the pandemic hit, and a system built for international official statistics became something nobody had quite designed it to be: the UK Treasury's emergency economic dashboard.

Professor Sir Charles Bean had spelled the underlying problem out in his 2016 Independent Review of UK Economic Statistics. The UK published the fastest first GDP estimate in the G7, at T+25 days. But only 47 per cent of the underlying output data was available at that point. To get to 90 per cent, you needed T+89 days. In normal times that gap is uncomfortable. In a crisis it is catastrophic. UK weekly GDP runs at roughly £44 billion. If the Treasury is making decisions about furlough extensions, business support and emergency lending while flying blind for three months, the cost of getting those decisions slightly wrong is measured in tens of billions.

The UN Global Platform happened to be ingesting the AIS Automatic Identification System feed at around 28 million ship messages per day, monitoring 1,200 ports weekly. The ONS Data Science Campus had built the Faster Indicators project on it during 2019, turning that feed into weekly UK shipping indicators. When COVID hit, the same pipeline was extended to ADS-B aviation transponders. The output was a Treasury and Bank of England product that arrived over a weekend, not quarterly. The Economic Statistics Centre of Excellence later confirmed the indicators "successfully capture economic conditions in real-time" and were "essential ingredients in real-time estimation."

### What £12 billion of value looks like

That is what £12 billion of value looks like in policy terms. It is the difference between a Treasury that can adjust the size of furlough by a few percentage points in a given week and one that has to wait three months to find out whether the last decision was right.

The whole stack was open source. Kubernetes, Helm, Docker, Apache Spark, Hadoop, GeoMesa, GeoServer, Apache NiFi, JupyterHub, GitLab, Moodle. Apache NiFi was built by the NSA over eight years before being donated to the Apache Foundation. Some of the Helm charts were forked from InseeFrLab, the French national statistics innovation lab. None of it was new. All of it was free. The genius was in the assembly, not the parts.

## The pattern

Read those two stories side by side and the pattern is obvious.

A small team, never more than six people on the critical path. An open source stack, assembled from things other people had already built. A platform deliberately designed to lower the cost of doing the next thing by an order of magnitude. Ruthless transparency: published prices, published methods, published code. A determined refusal to let the incumbents own the artefact. And a target chosen carefully: the part of the system where the gap between what the incumbents charge and what the work actually costs is widest.

Both programmes also benefited from a particular kind of timing. G-Cloud arrived just as cloud infrastructure was becoming credible for government workloads. The UN Global Platform arrived just as the cost of multi-cloud orchestration was collapsing. In both cases the technology and the commercial moment converged, and the small team got there first because they were not waiting for permission.

That timing is happening again right now. The thing collapsing this time is the cost of producing a high-quality enterprise architecture artefact.

## The third £12 billion: ArcKit

### What ArcKit does

Enterprise architecture is the last redoubt of the slow expensive PDF. Architects across UK government still spend months drafting requirements documents, business cases, risk registers, design reviews, traceability matrices, principles compliance reports and operational handover packs. A Big 4 consultancy charges £250,000 to £2,000,000 for a phase-zero pack that arrives long after the decision needed making. The Government Digital Marketplace lists hundreds of suppliers happy to take that money. The architects on the inside know the work is repeatable. They have not had the tooling to make it repeatable at the speed of the decision.

ArcKit is that tooling. It is free, open source, and AI-assisted. Seventy AI commands across the GDS Agile Delivery phases, from stakeholder analysis through to operational handover. You run a command, the AI drafts the artefact from a battle-tested template, you review and refine. The architect's job shifts from drafting to judging, which is where the value was always going to be. It works in Claude Code, Codex CLI, Gemini CLI, OpenCode CLI and GitHub Copilot. It is aligned to the Technology Code of Practice, the GDS Service Standard, NCSC CAF and Secure by Design. It searches 24,500 UK government repositories so you can reuse before you build. It has 34 community-contributed regulatory overlays for UAE, EU and French regimes, with more arriving.

### The arithmetic

Now do the arithmetic.

UK central government spends in the order of £6 billion a year on consulting and professional services. Conservative published estimates put the share that goes to enterprise architecture and design work in the £400 to £800 million range per year. If ArcKit displaces even half of that work over the next five years (because the architect now does it in-house with AI tooling, not because anyone passes a regulation) the saving against the consulting baseline is £1 to £2 billion a year. Over the lifetime of the toolkit, on the same scale that G-Cloud and the UN Global Platform produced, £12 billion is not an aggressive forecast. It is the conservative one.

That is before you count the second-order savings. An architecture pack that arrives in days rather than months means delivery teams stop waiting. Decisions get made earlier. Bad ideas get killed earlier, when killing them is cheap. Good ideas get to procurement faster, where G-Cloud is waiting to make the procurement itself a five-figure job rather than a seven-figure one. The two systems compose: G-Cloud cut the cost of buying technology, ArcKit cuts the cost of deciding what to buy. The combined pattern is what changes the baseline.

### The trajectory

I am not the only person who can see this happening. Three months after the v4 release ArcKit was trending on GitHub. Government CTO offices across departments are running it. There are pilots in the UK, UAE, France, Austria and Australia. The community of people building on it is growing weekly, with no marketing budget. It just hits a sweet spot with Architects. The trajectory is the same one G-Cloud had in 2013 and the UN Global Platform had in 2018: a thing that solves a real problem, available for free, growing on word of mouth.

## The principle

The throughline across all three programmes is not technology. It is consent. Every one of these was an attempt to replace consent-by-default for an expensive incumbent with consent-by-default for a cheaper, more transparent, more inclusive alternative. The savings follow. They always follow.

If you are an architect inside a UK government department right now, the choice you are about to make is not whether to use AI tooling. It is whether the AI tooling you use is one that locks your organisation into another decade of vendor capture, or one that hands you back the work and lets you keep the value inside the building. ArcKit is the second option. It is at arckit.org. It is free. Use it.

The third £12 billion is going to happen. I would prefer the savings landed in the UK economy this time, rather than in a consulting partner's bonus pool.

---

*Mark Craddock is the architect behind the UK Government CloudStore (G-Cloud), the UN Global Platform, the Unified Patent Court's digital estate, and ArcKit. Co-author of the UN Global Platform Handbook on Information Technology Strategy and the UN Privacy Enhancing Computation Techniques Handbook amongst others.*

## Sources and supporting research

- [How Open Source saved the UK Economy £12Bn — FOSS4G Argentina 2021](https://av.tib.eu/media/57272) (DOI: 10.5446/57272)
- [UN Global Platform — UN Statistics Division](https://unstats.un.org/bigdata/un-global-platform.cshtml)
- [Independent Review of UK Economic Statistics (Bean Review, 2016)](https://www.gov.uk/government/publications/independent-review-of-uk-economic-statistics-final-report)
- [ONS Faster Indicators of UK Economic Activity — Shipping](https://datasciencecampus.ons.gov.uk/projects/faster-indicators-of-uk-economic-activity-shipping/)
- [ESCoE Discussion Paper 2021-10: UK Economic Conditions During the Pandemic](https://www.escoe.ac.uk/publications/uk-economic-conditions-during-the-pandemic-assessing-the-economy-using-ons-faster-indicators/)
- [Crown Commercial Service / GCA G-Cloud Power BI dashboard](https://app.powerbi.com/view?r=eyJrIjoiNjhlYmE2M2EtZWFiMy00ZDc4LWE2MWMtOTQ2NDlmZTQ5YjExIiwidCI6IjlmOGMwZDc5LTNlODctNGNkMy05Nzk5LWMzNDQzMTQ2ZWE1ZSIsImMiOjh9) (canonical, monthly refresh; £16.10bn cumulative as at 27 April 2026)
- [UK Government G-Cloud — Wikipedia](https://en.wikipedia.org/wiki/UK_Government_G-Cloud)
- [ArcKit — official site](https://arckit.org)
- Supporting research note: `2026-05-03-research-gcloud-spend-actuals.md` (CCS dashboard figures)
- Supporting research note: `2026-05-03-research-mark-craddock-books.md` (Mark Craddock published bibliography)
