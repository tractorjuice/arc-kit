# ArcKit v6.22.0: Research Reports the Evidence, You Make the Decision

**ArcKit v6.22.0 is out. `/arckit:research` now reports what it found and stops there: no scores, no ranking, no build-or-buy verdict. It also reads prices from G-Cloud pricing documents, so more options arrive with a real price.**

*Mark Craddock · medium.com/arckit*

---

## Research stops deciding

`/arckit:research` used to score each option, rank them and give a build-or-buy verdict for every category. I've taken that out.

A verdict from a research report looks more certain than it is. The report found what's on the market. It doesn't know how your organisation wants to source things, and it hasn't appraised value for money. Putting "Buy" at the top of a table invited people to skip both.

So the report now tells you what each option offers, what it lacks and what it costs, with the source for each. For every capability it also gives the market evidence:

- **How many products cover it**, and from how many vendors.
- **Whether a utility, a GOV.UK platform or an open-source project already does it.**

That's the evidence a sourcing decision needs. The decision is made elsewhere, by the commands built for it.

## Where each decision is made now

`/arckit:wardley` decides how to source each capability, from how evolved it is. A capability sold by many vendors as a commodity is a different sourcing question from one nobody sells yet, and a map shows that better than a score does.

`/arckit:sobc` appraises value for money. It now reads the research report's costs and the Wardley map's sourcing, so the business case starts from both.

`/arckit:evaluate` and `/arckit:score` score suppliers, as before.

If you've been lifting the verdict straight out of the research report, run `/arckit:wardley` after it instead.

## Prices from G-Cloud pricing documents

Suppliers publish their G-Cloud prices in a PDF linked from the listing. Web fetch can't read it, so those options had no price in the report, and none for the business case either.

For the leading options in each category, ArcKit now downloads that PDF from the Digital Marketplace and reads the prices from it. This one needs Claude Code.

## A fairer measure for each option

Research used to measure every product against the whole project's capability list. A good dashboard tool looked weak for not being a forms tool.

Each option is now measured against the category it was found in. A product that does more than its category asks no longer looks worse for it.

## Also in this release

- **The command films are easier to read.** I'm re-making every film with larger text, because the first versions were hard to read on a phone. The first 101 are live, including all 76 core command films. The guide pages and the commands page link to the new ones, and the old links still play.
- **`arckit init` sends Claude Code users to the right marketplace.** It was still naming the older one. If you added that one, it still works, but don't add both: every plugin gets registered twice.
- **arckit.org tells agents where ArcKit's plugins are.** The site now publishes a discovery manifest that lists the seven public plugin and extension archives and the four reference skills, so a registry or an agent can find them.
- **The sitemap says when each guide last changed**, so a search engine can tell when a guide has been corrected.

## Get it

```bash
# Claude Code
/plugin marketplace add tractorjuice/arckit-claude
claude plugin install arckit
```

Already using ArcKit? Run `claude plugin update arckit@arckit-claude`.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). The full list of changes is in the [6.22.0 release notes](https://github.com/tractorjuice/arc-kit/releases/tag/v6.22.0).*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
