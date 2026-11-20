# Build vs Buy: Research That Reports the Evidence and Published G-Cloud Prices in ArcKit v6.22.0

**A build vs buy decision needs evidence first: what each option offers, what it lacks and what it costs. From ArcKit v6.22.0, `/arckit:research` reports that for every option, with the source, and reads published prices from G-Cloud pricing documents, so more options arrive with a price. The sourcing decision itself moves to the Wardley map and the business case.**

**Before you update:** a research report now carries the evidence, with no scores, ranking or build-or-buy verdict. If you've been lifting the verdict from the report, run `/arckit:wardley` after it.

*Mark Craddock*

---

## What the research report gives you

The report tells you what each option offers, what it lacks and what it costs, with the source for each. For every capability it also gives the market evidence:

- **How many products cover it**, and from how many vendors.
- **Whether a utility, a GOV.UK platform or an open-source project already does it.**

That's the evidence a sourcing decision needs.

`/arckit:research` used to go further. It scored each option, ranked them and gave a build-or-buy verdict for every category, and I've taken that out. A verdict from a research report looks more certain than it is. The report found what's on the market. It doesn't know how your organisation wants to source things, and it hasn't appraised value for money. Putting "Buy" at the top of a table invited people to skip both.

## Where each decision is made now

`/arckit:wardley` works out how to source each capability, from how evolved it is. A capability sold by many vendors as a commodity is a different sourcing question from one nobody sells yet, and a map shows that better than a score does. The map is a draft until you approve it.

`/arckit:sobc` appraises value for money. It now reads the research report's costs and the Wardley map's sourcing, so the business case starts from both.

`/arckit:evaluate` and `/arckit:score` score suppliers, as before.

## Prices from G-Cloud pricing documents

Suppliers publish their G-Cloud prices in a PDF linked from the listing. Web fetch can't read it, so those options had no price in the report, and none for the business case either.

For the leading options in each category, ArcKit now downloads that PDF from the Digital Marketplace and reads the prices from it. These are the supplier's published prices, not a quote. This one needs Claude Code.

## A fairer measure for each option

Research used to measure every product against the whole project's capability list. A good dashboard tool looked weak for not being a forms tool.

Each option is now measured against the category it was found in. A product that does more than its category asks no longer looks worse for it.

## How research works

`/arckit:research` splits the work so that nothing read from the web can reach the part that writes your report. A separate AI reader gathers the evidence for each category, from supplier pages, the Digital Marketplace and open-source projects. ArcKit checks what each AI reader hands back. An AI writer with no web access then turns the checked evidence into the report.

## A second look at research itself

The last release gave design reviews and vendor scores a second look, using lenses adapted from the [Elephant-Goldfish Model](https://egm.dev), an open-source project built on an essay by Dave Rensin, which pairs a reviewer who knows everything with one who knows nothing. On 10 November 2026 I pointed the same idea at research, on a fictional council's requirements across three areas: forms, dashboards and documents.

I tried two checks. A second AI reader gathered the same evidence again, knowing nothing of the first AI reader's work. And a build estimate was made blind, without seeing any supplier's price.

- **The second AI reader disagreed on 41 of 144 fields.** It changed the leading dashboard option for a real reason: the first AI reader had missed a capability the project needs.
- **Seeing prices moved the build estimate.** It came out higher in five of six comparisons when supplier prices were visible.
- **22 of 44 options had no usable price.** Most were G-Cloud listings with the price in a PDF.

Neither check is in this release. What they showed me was where research itself was weak, and that's what 6.22.0 changes: the missing prices, the measure that marked a product down for doing more, and a verdict resting on both. Once the G-Cloud documents could be read, six of nine gave a usable price.

## Also in this release

- **The command films are easier to read on a phone.** I'm re-making every film with larger text. The first 101 are live, including all 76 core command films. The guide pages and the commands page link to the new ones, and the old links still play.
- **`arckit init` sends Claude Code users to the `tractorjuice/arckit-claude` marketplace.** If you added the older marketplace, it still works, but don't add both: every plugin gets registered twice.

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
