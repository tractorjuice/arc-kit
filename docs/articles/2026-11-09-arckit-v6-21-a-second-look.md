# High-Level Design Review: A Second Look from Three AI Reviewers in ArcKit v6.21.0

**ArcKit v6.21.0 gives every high-level design review and detailed design review a second look from three AI reviewers that haven't seen the session. Every vendor score gets one too: a second AI scorer, and an AI moderator to settle any difference.**

**Before you start:** the second look needs Claude Code. The other assistants skip it, and the review says so. It checks ArcKit's own work, and doesn't replace your design authority or your evaluation panel's moderation.

*Mark Craddock*

---

## Three AI reviewers who weren't in the room

You can't proofread your own work, because you read what you expect to see. A review written in a long session has the same problem: by the time it's done, it has explained its own gaps to itself.

So before `/arckit:hld-review` writes the review, three fresh AI reviewers now read the design, one each for comprehension, principles and requirements. They get the design, the principles and the requirements. They don't get the conversation, the draft findings, the scores or the verdict. You run the command as before.

- **The comprehension reviewer explains the design back in plain words.** Where its account differs from what the supplier meant, the design is unclear, and that's a finding.
- **Every finding gets an outcome.** It's added to the review, matched to an issue the review already raised, or turned down with a reason. Nothing is dropped quietly.
- **A new blocking finding means the verdict is checked again** before the review is written.

In ArcKit's own tests on 8 November 2026, on a fictional housing benefits portal, the three AI reviewers raised 34 findings. The review already had 23 of them, 10 were new, and one was turned down with its reason written down. Two of the new ones were blocking: the components had no interfaces between them, and nothing owned citizen accounts and sessions. The verdict was already Rejected and stayed that way.

## The same for detailed designs

`/arckit:dld-review` gets three AI reviewers too. One explains the design back. One reads it as the engineer who'll build it and lists every decision it leaves to the builder. One checks it against the approved high-level design and its review's conditions, and reports any condition that isn't met, any departure that isn't explained, and any new component or store of personal data the high-level design doesn't have. If there's new architecture, the review asks whether the high-level design needs another look.

## Two scores, and a moderator

Public-sector evaluators score a bid on their own, then meet to agree a final score. `/arckit:score` and `/arckit:evaluate` now check ArcKit's own scores in a similar way before you see them. Both scorers are AI, so this is a check on the first score. Your panel's moderation is still yours to run.

After a supplier is scored, a second AI scorer scores the same claims against the same criteria. It never sees the first scores, the conversation or the vendor's name, and it can't open a file, so it can't go and look.

Where the two scores differ, an AI moderator decides. It sees both scores and their reasons as Evaluator A and Evaluator B, with nothing to say which is which, and gives a reason for the final score. "Averaged" doesn't count as one. Its decision is recorded as it stands: ArcKit can tell you it disagrees, but it can't change it. Both first scores are kept, so anyone checking later can see how the final score was reached.

On a borderline sample bid in ArcKit's own tests, one AI scorer gave a 1 and the other a 2. The AI moderator settled on 2, because the criterion as worded named neither of the unfinished features.

## What it needs

Claude Code can start an AI reviewer with no memory of the session. The other assistants can't, which is why they skip the step. A review takes a little longer, because three more AI reviewers have to finish before it's written.

## Five short films

I've made five 30-second films on how this works. They went out one a day on the [ArcKit LinkedIn page](https://www.linkedin.com/company/arckit-org/) from 9 to 13 November 2026. They're silent, so they work with the sound off.

## Where the idea came from

The reviewers' lenses are adapted from the [Elephant-Goldfish Model](https://egm.dev), which pairs a reviewer who knows everything with one who knows nothing. It's an open-source project on Google's GitHub, built on an essay by Dave Rensin, and it isn't an official Google product.

## Get it

```bash
# Claude Code
/plugin marketplace add tractorjuice/arckit-claude
claude plugin install arckit
```

Already using ArcKit? Run `claude plugin update arckit@arckit-claude`.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). The full list of changes is in the [6.21.0 release notes](https://github.com/tractorjuice/arc-kit/releases/tag/v6.21.0).*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
