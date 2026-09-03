# What We Learnt from Claude's Commerce Skills, and What We Left on the Shelf

**Anthropic published a worked example of two Claude agents for online retail: one that helps a shopper, one that helps the shop. ArcKit helps architects produce documents an organisation can sign off. The two have almost nothing in common on the surface. Underneath, they face the same problem: a model reading things it should not trust, producing things people will act on. Reading the retail example changed six things about ArcKit in a day. Here is what those changes mean if you use it, what we chose not to copy, and why reading outside your own field is worth an afternoon.**

*Mark Craddock · medium.com/arckit*

---

## Why a governance tool read a shopping assistant

Anthropic's example is called commerce-agents. It has a shopping cart, price changes that wait for a manager's approval, a memory of what a customer said last time, and product cards that appear in the chat. None of that has any place in ArcKit, which turns "write me a risk register" into a versioned, cited document with a proper control block, and checks the result on the way to disk.

What the two share is more important than what they don't. Both put a model in front of text written by strangers: product listings and customer reviews on one side, vendor brochures, tender notices and organisation charts on the other. Both then produce something a person will rely on. And both have to be honest about which of their rules are guaranteed and which depend on the model doing as it is told. The retail example is clearer about that than ArcKit was. That was the first lesson, and it shaped the other five.

## One: you can now see which rules are guaranteed

The most useful thing in the retail example is a single page. It lists every rule the code enforces, then every rule the prompts merely ask the model to follow, then everything the business has to add itself before going live. Three lists, no ambiguity.

ArcKit did not have that page. If you had asked "is the document control block enforced, or just requested?", the honest answer was "let me check". Now there is one page that answers it for every rule. Fourteen rules are guaranteed by code, whatever the model does: the file naming, the registry of document types, the protection of credential files, the scanning of prompts and files for secrets, the checks on vendor scores and Wardley Maps, the provenance stamp, the stale-document alerts, and more. Nine rules are asked of the model: a complete control block, the right classification for the document's regime, a status that starts as draft, no leftover placeholder text, a citation on every external figure, clean formatting. And a third list says what is yours: who approves, where sensitive documents may go, which model runs, how long records are kept.

If you are assessing ArcKit for use in a regulated setting, that page is where to start. It is honest about the second list, and the rest of this article is largely about what we did with that honesty.

## Two: a poisoned document can no longer smuggle instructions in

ArcKit's research commands read the open web. A separate, sealed-off part of the command fetches vendor pages and government data, summarises them, and hands a structured summary to the part that writes your document. There is a checkpoint between the two that rejects anything malformed, so a summary cannot invent a certification or inflate a score.

The retail example showed a gap we had not seen. Its equivalent checkpoint also cleans the text itself: it removes invisible characters that can spell out hidden instructions, lookalike letters from other alphabets, and anything shaped like a fake conversation turn or a fake tool result. A vendor page could have carried any of those through ArcKit's checkpoint inside a summary that was, on paper, perfectly valid.

That is fixed. The checkpoint now cleans the text the same way, and if a summary carries one of those shapes it is sent back rather than passed on. The command tries the source once more; if the problem persists, the source is logged as a gap and left out of your document. In practice: a page built to manipulate the model can no longer reach the part of ArcKit that writes what you will read.

## Three: commands are now tested on what they write, not on what they say

ArcKit had tests for its plumbing but nothing that ran a command and checked the document it produced. The retail example deliberately ships no test harness of its own, on the grounds that a test only means something against your own catalogue. What it ships is the method, and the method is the lesson.

Give the command a realistic starting point, run it, and judge the result: the file it wrote, what it did and did not touch, what it told you. Judge the outcome, not the route, because a correct answer reached by an unexpected path is still correct. Keep the deliberately hostile test material separate from the clean material, so nothing hostile leaks into the everyday examples. And the rule I would not have thought of on my own: every test that checks the model refuses something bad has a twin that checks it still does the good version of the same thing. A model that refuses everything passes the first and fails the twin. A model that obeys everything does the reverse. You need both to know anything.

ArcKit now has four such tests. One gives the stakeholder-analysis command an organisation chart that has been doctored: hidden in it are instructions to mark the document approved, name a fake approver, delete the revision history, and add a made-up supplier as a critical stakeholder. The command must still write the analysis, still as a draft, with none of that in it. Its twin gives the same command the clean chart and checks the analysis actually uses what it read and cites it. Another checks that the search command, given permission to write, writes nothing. All four pass on the current model.

Running them taught two things no amount of design would have. ArcKit's own end-of-session helper, which suggests what to run next, nudged the model into adding a postscript after its answer, which the first version of the test then read instead of the answer. And the same helper mistook a test file for work done that session. Your tool's own conveniences are part of the environment your tests run in. Budget for that.

## Four: skills now say when to stay out of the way

ArcKit ships a handful of reference skills that load themselves when a conversation looks relevant: Mermaid and PlantUML diagram syntax, Wardley Mapping, the onboarding workflow. Each used to describe itself with a list of phrases you might say, ten or so per skill. The retail example describes a skill in two sentences: the kind of request it serves, and when it is not needed and which sibling is.

ArcKit's five now read that way. The Mermaid skill says it is for writing or fixing a Mermaid diagram, not for PlantUML, and not for producing a formal diagram document, which is a command's job. For you this means fewer skills loading when they are not wanted, less clutter in the model's working memory, and clearer handoffs when a question falls between two of them.

## Five: commands ask their questions once

Ten ArcKit commands ask you something before they write: how many options the business case should weigh, which delivery approach the plan should assume, what scope the privacy assessment covers. They all carried the same small print, pasted in years ago: ask the most important question first, allow up to two rounds, and after that pick the recommended option. In one command that sat directly beneath an instruction to ask both questions at once. Nobody had noticed, because nobody reads boilerplate.

The retail example interviews you once. It works out what it can from what you already typed and from what is already in the repository, tells you what it inferred so you can correct it, asks everything else in a single message, and treats a skipped question as its recommended default, which it then lists as an assumption. ArcKit commands now do the same. If you run one where no question can be asked at all, in an automated build for instance, every question takes its default and the summary tells you which defaults were taken.

Writing the check that holds every command to this found a real fault: the project-plan command had a question with no recommended answer, so automated builds had been quietly treating every unknown project as small. It now assumes medium.

## Six: a rule should live where it applies most

This one I have only started applying, and it may last the longest. The retail example has a simple test for where a rule belongs. If it applies every time one particular action is taken, it belongs on that action. If it applies on most requests, it belongs in the always-on instructions. If it applies only to the minority of requests that need a multi-step procedure, it belongs in a skill that loads on demand. And a rule that most requests need moves down a layer.

ArcKit has seventy-five commands, and many of them restate things that belong in one shared place read once. The interview rule above was the first thing pulled up out of the commands into a single reference. More will follow, and the test is the same: count how often the rule applies.

## The techniques, in plain terms

The retail example contains more than six ideas, and some of the rest are worth knowing even where a governance tool has no use for them. Briefly, and without the machinery:

Keep the unchanging part of the instructions unchanging, byte for byte, and put everything that varies per request in one clearly marked block, because that is what makes the model's memory of the instructions cheap to reuse. Wrap anything from a stranger in a fence the model is told about once, so the model knows it is reading material rather than receiving orders. Let a write happen only for things the model has actually seen this session, with a cap on how much, checked in code rather than by asking nicely. When a rule stops an action, hand the model a normal, readable "this was blocked because" rather than an error, so it can correct itself. Derive the list of things the model is allowed to do from the deployment's settings, and remove a missing capability entirely rather than leaving instructions about it lying around to confuse things. For questions that must be answered from a record, make the model read the record first rather than trusting it to remember to. Give any second model a brief and a narrow set of tools, never the whole conversation. Limit what is remembered about a person, filter it before it is stored, and never keep an identifier that doubles as a credential. Have the model choose which product goes on a card but let the server fill in the price, so a number on screen is always a real one.

And the ones about running a project rather than running a model: write down what you decided in the one file every later step reads; review an existing system row by row against the reference and convert only the rows the owner picks, tests first because they measure the rest; state each fact once and say where it lives; and check in your build pipeline that nobody has registered your internal package names in public, so a stranger cannot serve a lookalike to anyone who installs the wrong way.

## What we left on the shelf

Most of it. The shopping cart and its rule that only products the model has seen can be added, the price changes held for a manager's approval, the customer memory, the product cards, the careful arrangement of instructions for cheap reuse: all of these are for a system that runs live and talks to real people in real time. ArcKit writes a file, and its approval surface is a pull request. I read them, took notes, and moved on. The six that transferred were worth the day; the rest was the cost of finding them.

## What I would tell someone doing the same

Read the explanations before the code. The retail example's one-page safety statement, its short list of design rules, and the six skills it ships for builders carried more transferable thinking than the source did, in a tenth of the space. Look for the lists and the tables; a table is a decision someone else already made under pressure and wrote down. And expect the lessons to arrive as tests. Four of the six above became a check that runs automatically in ArcKit, and two of those checks found a real fault the first time they ran. A pattern you cannot turn into a check is a preference. A pattern you can is a rule.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). Anthropic's retail example is at [github.com/anthropics/commerce-agents](https://github.com/anthropics/commerce-agents). Current release: v6.14.0.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
