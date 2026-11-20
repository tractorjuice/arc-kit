![Legacy IT assessment in ArcKit v6.19.0: assess your legacy systems, one test at a time, against the UK government's updated definition of legacy IT. Five steps: run the seven tests on every system you name; see the evidence, dated, for each result; follow the risk through each dependency; check the risk score, out of 30 and kept separate; agree the actions, each with an owner and a date. Outcomes are Accepted, Action-Required or Legacy, and the owner of the risk decides. Plus 12 security fixes.](https://arckit.org/articles/2026-11-02-arckit-v6-19-is-it-legacy-hero.png)

# Legacy Systems: Assess Yours Against the UK Government's Definition of Legacy IT with ArcKit v6.19.0

**The UK government's updated definition of legacy IT asks whether the risk or burden of keeping a system running is one its owner can accept, and says nothing about age. ArcKit v6.19.0 adds an optional overlay from Chris Nesbitt-Smith that assesses your legacy systems against it, follows the risk through their dependencies and turns each finding into an action with an owner. It also brings 12 security fixes from @johnfelipe.**

**Before you start:** the overlay is experimental and switched off until you enable it. It isn't a government tool and carries no government endorsement. It proposes a classification from the evidence it finds, and the owner of the risk decides.

*Mark Craddock*

---

## What is legacy IT under the updated definition?

In August 2026 the Government Digital Service and the Central Digital and Data Office published an [updated definition of legacy IT](https://www.gov.uk/government/publications/guidance-on-the-legacy-it-risk-assessment-framework/updated-definition-of-legacy-it). It deliberately says nothing about age. A system is legacy when keeping it running carries a burden or a risk that its owner finds unacceptable, and it can no longer be supported or secured effectively or economically. The definition sets seven tests: the system is out of support; its contracts are missing or inadequate; the skills to run it aren't there; it can't meet user or business needs; its hardware is unsuitable; it fails minimum cyber security standards; or it relies on something that is itself legacy.

Each test ends in one of three outcomes. **Accepted** means the system is operating within normal risk. **Action-Required** means it isn't legacy yet, but will be within 12 months if nothing is done. **Legacy** means the risk or burden is unacceptable and fixing it is an urgent priority. The guidance is clear that legacy is a yes-or-no classification, not a score, and that where the lines fall is set by the owner of the risk.

That is a better question than "how old is it?", and a harder one to answer well. It needs dated evidence, someone who owns the thresholds, and an honest record of what you don't know yet.

## Assessing your legacy systems with ArcKit

Install the overlay and run `/arckit-uk-legacy:uk-legacy-assessment` against a project. It works through each system in scope, or just the ones you name, and gives every system a result on all seven tests, each backed by the evidence it found and the date of that evidence. Each result is a proposal for the owner of the risk to accept or change.

**It follows the risk through your dependencies.** A brand-new reporting application with good controls of its own still comes out Legacy if it can't work without a payments system whose support ended last month. The report shows the path the risk took, so the answer isn't a surprise and the fix is in the right place.

**It marks what it doesn't know.** If your organisation hasn't approved its thresholds yet, the assessment proposes some, marks every finding that depends on them as provisional, and says so. Missing evidence stays visible as a gap and never counts as a pass. A planned migration doesn't count as done, and every approval stays with you.

**It keeps the score apart from the answer.** Alongside the classification, it calculates the separate numerical score from the government's published [Legacy IT Risk Assessment Framework](https://www.gov.uk/government/publications/guidance-on-the-legacy-it-risk-assessment-framework/guidance-on-the-legacy-it-risk-assessment-framework), where 16 or above out of 30 is red-rated. The guidance treats the two as different things, and so does the report. A system can be red-rated and Accepted, or Legacy with a modest score, and the report won't blur them into a single readiness percentage. The framework itself is under review to line up with the new definition, and the report says that too.

**It ends in actions.** The findings feed an action plan. Each action names an accountable owner, the immediate containment, the longer-term fix, its funding status and a date for the next review. Where a finding has no action, or an action has no owner, budget or date, that shows as a gap too, ready to carry into your business case, roadmap and delivery plan.

You get a written report, the data behind it, a chart of each system's risk score against the red-rated line, and a breakdown by component. The framework sources travel with the overlay, so the assessment never has to look anything up online, and the calculations are checked against the report before it claims to be verified.

Try it first on one system you know well, where you can judge whether the evidence and the outcome ring true. It works in Claude Code and in the other assistants ArcKit supports.

## 12 security fixes: update to get them

@johnfelipe sent 12 security fixes. Most of them close a way that something in your repository, or something an AI research helper read on the web, could make ArcKit do what you didn't ask. If you already use ArcKit, run `claude plugin update arckit@arckit-claude` to get them.

**Your published site.** A document, a file name or a folder name can no longer run code in the browser of someone reading the site ArcKit builds from your project. Research notes imported from a knowledge bundle show any HTML they contain as plain text. And files you've told git to ignore inside a project you publish now stay out of the site's index, not just ignored whole projects.

**Your files.** The guard that stops ArcKit editing credentials now checks where a write will actually land, so a harmless-looking link in your repository can't redirect an edit onto a secrets file or your git settings. Every environment file is protected, apart from the example, sample and template copies meant to be shared. The health check won't write its report through a link, and the check that corrects document names no longer creates folders before you've approved anything.

**What Claude reads.** When an AI research helper's reply fails its checks, it is now withheld rather than passed on, so text copied from a vendor's web page can't reach the part of a session that can write files and run commands. Your session history and the names of new files in a project's external folder now reach Claude clearly marked as data, so a commit message can't pose as an instruction.

**The other assistants.** The Codex version now refuses any shell command that names a credentials file, and no longer approves reads of its own files or calls to its own scripts on your behalf. The Kimi version's file tools are now checked by the same protections as Claude's, though that hasn't yet been tested on a live Kimi installation.

## Overlays checked against their sources

The regional, sector and method overlays had another round of fact-checking in Claude Code, with every flagged claim traced back to the law or the framework it cites. Australia's critical infrastructure pack now covers the enhanced risk management rules and their 2027 and 2028 compliance dates. The US software bill of materials command reflects that the secure software attestation form is now each agency's choice. The NHS overlay follows version 2.0 of the Digital Technology Assessment Criteria. The full list is in the changelog.

## Thank you

Thank you to @chrisns, Chris Nesbitt-Smith, for the legacy assessment. He brought a careful reading of the guidance, a calculator that reproduces the government's own worked example, and the patience to rebuild it as a separate overlay when asked. And thank you again to @johnfelipe, whose security work has now made ArcKit safer across two releases.

## Get it

```bash
# Claude Code
claude plugin install arckit-uk-legacy --marketplace tractorjuice/arckit-claude
claude plugin enable arckit-uk-legacy

# then, in a repository with a project
/arckit-uk-legacy:uk-legacy-assessment 001
```

The first line adds the ArcKit marketplace if you haven't added it, and installs the core plugin with the overlay. The overlay is switched off when it's installed, so the second line switches it on. You only need it if you have an estate to assess.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). The full list of changes is in the [6.19.0 release notes](https://github.com/tractorjuice/arc-kit/releases/tag/v6.19.0).*

*The overlay includes the government's updated definition of legacy IT and its guidance on the Legacy IT Risk Assessment Framework. Contains public sector information licensed under the Open Government Licence v3.0.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
