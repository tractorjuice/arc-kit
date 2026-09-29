![Is max effort worth it? Requirements on Opus 5.5 at high and max effort, with max costing more than three times as much and taking four times as long for the same 100 requirements, beside the real problem: 13 of 55 templates contradicted their own commands.](https://arckit.org/articles/2026-09-29-is-max-effort-worth-it-hero.png)

# Is Max Effort Worth It? What 53 Test Runs Taught Us About ArcKit

**When Claude Sonnet 5.5 arrived, Anthropic advised using the highest effort settings only where testing shows a gain. ArcKit ran 18 of its commands at the highest setting without ever having measured it. So I measured it. Across 53 test runs costing about $150, the highest setting mostly made documents longer, slower and three to four times more expensive, not better. The gaps it did close came from something much cheaper to fix: templates whose own examples contradicted the instructions they came with.**

*Mark Craddock · medium.com/arckit*

---

## Why I tested

Every ArcKit command tells Claude how hard to think. Most run at "high". The heaviest (requirements, business cases, Wardley maps, research) ran at "max", on the reasonable-sounding theory that governance documents deserve the most careful reasoning available.

Then Claude Sonnet 5.5 shipped, with a guide that said two things I couldn't ignore. Effort levels had been recalibrated, so a level no longer means what it meant on the previous model. And the extra-high and max levels should be used "only where your evals show a quality gain".

I had no evals that showed a gain. I had an assumption. Sonnet 5.5 is also the first Sonnet with the cybersecurity safeguards Anthropic uses on its most capable models, and ArcKit's Secure by Design commands spend a lot of time describing attacks. So there were two questions. Does Sonnet 5.5 get in the way of security work? And does max effort earn its cost?

## How I tested

ArcKit has a small set of behavioural tests. Each one runs a real command, exactly as you would type it, against a fictional project: Ashcombe District Council's housing benefits portal, with a requirements document, a stakeholder analysis and a set of principles. Then automatic checks read what was produced. Is the document where it should be? Is it marked as a draft? Does every requirement have acceptance criteria? Did any response come back as a refusal?

These checks are deliberately mechanical. They can tell whether something is there, not whether it is wise. So alongside pass or fail I recorded what the checks can count: how many requirements, how many acceptance criteria, how many words, how often a business case mentions net present value or optimism bias. I also recorded what each run cost and how long it took, because an architect waiting 48 minutes for a requirements document is a real cost too.

To compare effort levels fairly, the test tool now runs a command at a level you choose, leaving everything else identical. I ran each comparison on both Opus 5.5 (Claude Code's default) and Sonnet 5.5, usually twice at each level.

## What I found

### Sonnet 5.5 is fine for security work

I asked `/arckit:secure` for a full Secure by Design assessment with a STRIDE threat model, twice, pinned to Sonnet 5.5. Every response came from Sonnet 5.5. Nothing was refused and nothing was handed to an older model. The assessments contained 32 and 26 threats, including payment diversion through account takeover and insider snooping by caseworkers. Each run cost about $1.20.

That's two runs of one command, so it shows the safeguard doesn't trip on routine assessment work, not that it never will. If your organisation restricts which models people can use, keep the older fallback models allowed. When a safeguard does trip, Claude Code quietly re-runs the request on one of them.

### Max effort mostly buys length

On Opus 5.5, `/arckit:requirements` at max produced the same number of requirements as at high, about 100, with about the same number of acceptance criteria. It cost $9.82 instead of $2.90 and took 48 minutes instead of 12.

The business case was similar on both models. Max made it about 30% longer and cost two and a half to three times as much, but the financial appraisal didn't get deeper. Net present value, benefit-cost ratio and optimism bias were covered no better. On Opus, the high-effort runs actually covered them slightly more.

The exception was Sonnet 5.5 writing requirements. There, max produced a clearly deeper document: 108 requirements against 89, and four times as many acceptance criteria. That result turned out to be the most useful clue of the whole exercise.

### The real problem was the templates

Architecture principles showed the same pattern, in a form that was easy to diagnose. The command tells Claude that every principle must have a rationale and a set of implications. At high effort, every run on both models left the rationale off about five principles and the implications off about eight. At max, none did.

The reason was in the template. Of its 16 example principles, six had no rationale and eight had no implications. At normal effort, Claude copied the examples. Only at max did it notice that the examples disagreed with the instructions and follow the instructions instead.

That changes the question. Max effort wasn't making Claude cleverer. It was paying Claude to overrule a bad example. Fixing the example is free.

So I audited all 55 command and template pairs for the same fault, a command requiring something of every item while its template's examples leave it out. Thirteen had it, and the worst was requirements. The command says every requirement must have acceptance criteria and a rationale. The template's examples had 30 requirements. Only one had acceptance criteria, and only one had a rationale. Every requirements run I had made, at every effort level, had left acceptance criteria off between 36 and 61 requirements. That's why Sonnet at max looked better: it was overruling the template more often.

### Fixing the templates worked

I fixed all 13 templates, then tested them live at normal effort.

With the principles template fixed, all four runs at high on both models gave every principle its rationale and implications, at the normal cost of under $2 a run.

With the requirements template fixed, all four runs at high gave every requirement acceptance criteria and a rationale. Sonnet 5.5 at high went from 52 acceptance-criteria mentions to 132, most of the way to what max had produced, at a third of the cost.

The other templates each got one test run on Sonnet 5.5. Security actions now name an owner (the old documents gave every action a priority and a deadline, but never said who). Every operational runbook has prerequisites, detection, verification and rollback steps. The "do nothing" option in a decision record now carries its own three-year cost, because staying put costs money too. The data protection impact assessment uses the command's own risk scale, and ties consultation with the ICO to a high residual risk, as UK GDPR requires, rather than to a "very high" level the scale doesn't have. The maturity model gives transition criteria for each dimension, and the Wardley doctrine, gameplay and climate assessments carry the columns their commands ask for.

One fix only partly worked. The business case template's third option now has a risks section, and runs on the old template missed that option's risks every time, six out of six. On the fixed template, two of three runs got it right. That's better, but it isn't solved, and it needs a second nudge.

### My checks needed checking too

Six of my automatic checks were wrong the first time they ran. None of the documents were at fault. One expected "L1" where the document said "Level 1". Another mistook a monitoring procedure for a runbook. Two looked for the wrong file name. One was case-sensitive about a heading written in capitals. And one gave up at the first sub-heading inside an option. Each time I fixed the check and re-scored the recording, without paying for another run. If you build tests like these, read the output before you trust the verdict.

## What's changing

These changes are in review now and will arrive in the next release.

`/arckit:requirements` and `/arckit:sobc` move from max to high. Requirements finish in about a quarter of the time, and business cases in about a third. You shouldn't lose depth, because the templates now show the depth the commands always asked for.

Thirteen templates now agree with their commands. Your principles, requirements, security assessments, runbooks, decision records, data protection assessments, maturity models and Wardley assessments should come out complete on the first pass.

Non-functional requirements now use the same Must/Should/Could/Won't priorities as the others. That means the backlog's check for a requirement that is quietly downgraded now covers performance, security and compliance requirements too, and those were the ones that most needed it.

## What I'd recommend

**If a document looks thin, check the template before raising the effort.** And if you have customised templates of your own, check them first. A customised copy carries whatever gaps the original had when you copied it, so after upgrading, compare yours with the new version.

**Choose the model for the job, not the effort level.** Opus 5.5 at high gave the deepest requirements and business cases short of max. With the fixed templates, Sonnet 5.5 at high came close for about 60% of the price, and it handled security work without trouble. In these tests, choosing between the two models mattered more than choosing the effort level.

**If you build tools like this, make your examples agree with your instructions.** The model follows the example, and it only overrules it when you pay for more thinking. Measure before you raise effort, and record cost and time as well as pass or fail.

**Treat these numbers as a snapshot.** Most comparisons rest on two runs, the max runs sometimes on one, and all of them use one fictional project. The tests stay in the repository, so they can be re-run when the next model arrives.

## What it cost

Everything above cost about $150 in model usage. The recorded runs total $137.26, and that's the figure I'd stand behind.

- Sonnet 5.5 security check: $1.30 for one run.
- The existing test suite, re-run in full: $7.20 for five runs.
- Max against high on requirements and business cases: $48.78 for twelve runs.
- Max against high on principles: $21.24 for eight runs.
- Principles re-test after the template fix: $4.94 for four runs.
- Requirements re-test after the template fix: $9.58 for four runs.
- The other fixed templates: $33.64 for thirteen runs.
- Building test inputs that some commands need first: $3.32 for a data model and $7.26 for a Wardley map.

Four more runs left no cost record. Two max runs hit the old 30-minute limit and were cut off, and I stopped two more early to stay in budget. I estimate them at $12 to $17, which brings the total to about $150. That excludes the Claude Code session that organised the tests and made the fixes.

For comparison: a single requirements document at max on Opus cost $9.82. The fix that makes high effort produce a complete one cost nothing to run.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). Current release: v6.16.5.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
