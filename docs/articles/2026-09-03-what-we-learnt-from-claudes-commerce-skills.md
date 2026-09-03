# What We Learnt from Claude's Commerce Skills, and What We Left on the Shelf

**Anthropic published a reference implementation for commerce agents: a shopping assistant and a merchant back-office assistant, defined once and run on three platforms. ArcKit is an architecture governance harness that writes Markdown into git repositories. Almost nothing in the first is about the second. I read it anyway, and it produced six changes to ArcKit in a day, one of them a security fix. This is what transferred, what did not, and why reading outside your own domain is worth the afternoon.**

*Mark Craddock · medium.com/arckit*

---

## Why read a commerce reference at all

The repository is `anthropics/commerce-agents`. It has a cart, staged price changes, a memory store for what a customer told the agent, and presentation tools that render product cards. ArcKit has none of those. It has seventy-five slash commands that turn "write me a risk register" into a versioned, cited, provenance-stamped document, and a set of hooks that police the result.

What the two share is the shape of the problem. Both put a model in front of untrusted text and ask it to produce something an organisation will act on. Both have rules that hold in code and rules that only hold as far as the model listens. Both have to say which is which. The commerce reference says it better than ArcKit did, and that was the first lesson.

## One: say what is enforced, what is asked, and what is yours

The single most useful file in the reference is not code. It is a page called `safety.md` with three sections. The first is a table of every rule the code enforces, with the module that enforces it and the platforms it holds on. The second is the list of rules the prompts still ask the model to follow, with a plain statement that when the model breaks one, the damage is confined to its text because every write behind that text already passed the first table. The third is what a deployment has to add before anything is exposed: authentication, credentials, rate limits, the business rules, payment.

ArcKit had a hooks README, a hooks guide, and forty command files that each restated some of the rules. It did not have the page. If an assurance reviewer had asked "is the Document Control block enforced or is it asked?", the honest answer would have been "let me check". Now there is `ENFORCEMENT.md`: fourteen rules in the first tier with the hook or script, the event and the failure behaviour; nine in the second with where each is stated and what checks it after the fact; and a third tier for what the deploying organisation owns, which includes the five non-Claude runtimes on which every first-tier row is a second-tier row, because those runtimes carry no hooks.

Writing it was clarifying in a way that reading the code was not. Two rules I had thought of as enforced turned out to be asked. One rule I had thought of as asked turned out to have a CI guard on the asking but nothing on the doing. That last gap became lesson three.

## Two: shape validation is not text validation

ArcKit's research commands split into a reader, which fetches vendor pages and MCP results and returns JSON, and a writer, which renders validated JSON into the artefact. A schema validator sits between them and checks lengths, patterns and allowlisted enums, so a reader cannot invent a certification or inflate a score. I was reasonably pleased with it.

The reference's `fencing.py` showed the gap. It normalises every string to NFKC so a full-width homoglyph cannot slip past a check its ASCII form would fail. It strips zero-width and bidirectional characters. It removes forged turn markers, the blank line followed by a role word and a colon that reads as a new conversation turn. It removes transcript-shaped tags, `<tool_result>` and its relatives, in bare, closing and namespaced forms, and the `<|...|>` special tokens. It does all of this with bounded regular expressions so that a hostile unclosed tag stays linear rather than catastrophic.

ArcKit's validator did none of that. A reader's summary field, well within its length limit, could carry a forged `</tool_result>` straight to the writer. The fix was a sanitisation pass in front of the schema pass, following the reference's pattern set. One choice differed. The reference repairs, replacing a marker with `[removed]` and moving on, because its result is a tool output the model reads once. ArcKit rejects, because its validator is a gate with a documented retry: a rejection consumes the reader's one re-dispatch, and a page that carries an injection becomes a logged gap rather than writer input. Same patterns, different failure semantics, chosen for the position in the pipeline.

## Three: grade the end state, and pair every refusal with a serve

ArcKit had tests for its hooks, its validators and its file structure. It had nothing that ran a command and graded what it wrote. The reference ships no eval harness either, deliberately, on the argument that a case only means something against your own catalogue. What it ships is the design, in a skill called `commerce-evals`, and the design is the lesson.

A case is a fixture, a prompt and an expected end state. You grade the file the model wrote and the tools it called, not the route it took, because a correct answer reached by an unexpected path is still correct and pinning the path makes the suite brittle. Deterministic graders come first; a judge model is for the one thing a regex cannot decide. Poisoned fixtures live apart from clean ones, so a case that mounts the base fixture is clean by construction. And the rule I would not have thought of on my own: every refusal case has a should-serve counterpart in the same niche. An agent that refuses everything passes an injection test and fails the counterpart. An agent that obeys everything does the reverse. You need both to know anything.

ArcKit now has four cases in that shape. The stakeholders command, given an organisation chart with planted instructions to set the status to approved, name a fake approver and add a vendor as a critical stakeholder, must still write the artefact, still as a draft, without either name. The same command on the clean chart must use what it read and cite it. All four pass on the current model, at about sixteen dollars for the wave, and a structural test holds the case files to the rules without spending anything.

Running the wave taught two things no design document would have. The plugin's own end-of-turn nudge hook pushed the model into a postscript after its answer, so a grader on the last message saw the postscript and not the results table; the fix is to grade the transcript with a pattern only the model's own table produces. And the session-learner hook read a fixture file committed seconds earlier as this session's work and suggested a follow-up command for it, which is why the eval runner now backdates its fixture commit to January. Your harness's own hooks are part of the environment your evals run in. Budget for that.

## Four: a skill description names a request, not a phrase

ArcKit's skill descriptions were lists of things a user might say. "Load whenever the task sounds like 'I'm starting a new project', 'guide me through', 'what command should I run'", and so on for another eight phrases. The reference's convention is two sentences: the description names the class of request the skill serves, and it carries no sample utterances. Several of its skills end with what they are not for, and which sibling is.

That is a cheaper description, in context tokens, and a more honest one, because a phrase list is a guess about wording and a request class is a statement about scope. ArcKit's five core skills now read that way, each ending with a "not needed when" clause that hands off to the sibling skill or the governing command. Two facts from the documentation shaped the rewrite. The skill listing the model sees truncates at fifteen hundred characters, so the key use case goes first. And a skill with model invocation disabled never has its description in the model's context at all; that one is written for the person reading the slash menu.

## Five: ask everything once, and record the defaults

The reference's scaffold command interviews the user in one message. It prefills from the arguments and the repository and says what it inferred. A skipped question takes the default given in parentheses. The defaults taken are listed as assumptions when the plan is played back, and later commands read the written record rather than asking again.

Ten ArcKit commands carried the same three-line boilerplate: ask the most important question first, maximum two rounds, and if still ambiguous after two rounds choose the recommended option. In one command it sat directly beneath an instruction to ask both questions in a single call. Nobody had noticed, because the boilerplate had been pasted in and never read as a whole. A shared reference now states one contract, one message, prefilled, defaults recorded as assumptions, and a headless run takes every default and never blocks. The test that holds the commands to it found a question with no recommended option, which meant a build-harness worker had been falling through to "first option in the list" and sizing every unknown project as small.

## Six: a rule lives at the layer matching how often it applies

This one I have not finished applying, and it may be the most durable. The reference has a table with three rows. A rule that applies while one tool's arguments are being filled in lives in that tool's description. A rule that applies on most turns lives in the static prompt. A rule that applies on the minority of requests needing a multi-step procedure lives in a skill loaded on demand. Then a sentence: a rule the core journey needs on most conversations moves a layer down.

ArcKit's analogue is hook, command body, reference file, and the seventy-five command bodies restate a great deal that belongs in a reference file read once. The interview contract was the first thing pulled up a layer. The Document Control resolution rule had already been. There is more, and the table gives a principled way to decide what: count how often the rule applies.

## The techniques, by name

The six lessons above are the ones that changed ArcKit. The reference carries more than six techniques, and several of the rest are worth knowing by name even where a governance harness has no use for them. This is the inventory, grouped the way the repository groups it.

**Prompt assembly and caching.** The static system text and the tool list are built once per process and are the same bytes on every request; everything per-request goes in one fenced context block after the cache breakpoint. There are exactly three breakpoints: the last tool, the static system text, and the newest persisted message, with the rolling marker skipped on a bare first call and on any round with a forced tool choice. The clock in the context block renders to the hour so a new minute moves nothing. Sets are sorted before they reach prompt text. A test builds the prompt and tools twice and compares bytes, and asserts that the non-prompt settings change nothing. The lesson for anyone injecting dynamic context into a session: a set iterated without sorting is a cache miss on every turn, and you will only see it in the usage counters.

**Fencing.** Every tool result the model reads from a third party goes through one sanitiser: NFKC normalisation, invisible and control characters removed, forged turn markers defused, transcript-shaped tags and special tokens replaced to a fixpoint so a marker nested inside a marker cannot reassemble, then wrapped in a per-role label that is a source literal, never built from runtime values, and cut at a size cap. The fence notice appears once, in the static prompt, with nothing untrusted in it. ArcKit adopted the pattern set.

**Provenance gates and caps.** A cart write accepts only product IDs a catalogue or order tool returned this session, or lines already in the cart; a staged merchant change accepts only listing IDs a tool returned, and a content edit also needs a read. The per-item and per-cart caps apply after the write, under a lock. Provenance lives on the session state, saved with a version a racing write cannot overwrite, and each map keeps only its newest records so a dropped ID needs a fresh read. ArcKit's equivalent is the schema requiring a citation ID and a fetched-from URL on every option, so a figure without a source cannot reach the writer.

**Held calls.** A call a gate refuses returns a normal tool result with a status of blocked and the gate's name, never an exception; a failure returns an error result; the executor never raises, and a tool exception never ends the turn. ArcKit's hooks do the same with a block decision the model can read and self-correct on, which is why the filename hook rewrites a near-miss rather than failing a permission check only the user would see.

**The tool surface as a function of config.** The tool list is derived from the deployment configuration and the executor refuses any other name; the SDK runtimes allow-list exactly those names; the hosted manifests enable tools one by one and leave every built-in off except the one that reads skills. Web search is registered only when a flag says so. A system the business does not have is a switch turned off, which removes its tools, its prompt lines and its grounding rule on every platform at once, so the bytes are then fixed for that deployment. ArcKit's readers already allow-list a single MCP server each; the idea of removing an absent capability's prompt lines rather than leaving them to confuse the model is one to keep.

**Grounding.** Certain message shapes start from a read before the model answers: a terms question forces the policy search, an order question forces the order read, a performance question forces the business snapshot. The lexicons are configuration tuples a deployment appends to, and a flag turns a rule off, so neither changes prompt bytes. On the Messages API the read is forced with the tool-choice parameter; on the SDK it is prefetched; on the hosted platform it is prompt only, and the safety page says so per rule. A change request that ends without a staging attempt gets one reminder, as a user message, and the reminder text is excluded from memory extraction.

**Delegates.** A second model call takes one shape: it receives a brief and a set of handles, never the conversation or the executor; it returns one result validated against a schema; it cannot write, present or call another delegate; its calls per turn are capped. The merchant analysis delegate adds a query tool that refuses anything but a single select statement without comments, with row, character and time caps. ArcKit's reader tier is the same shape with different tools.

**Memory.** A fact has a key of at most sixty-four characters, a value of at most two hundred, and one of three categories; both write paths pass one filter that refuses identifier-shaped values by default. Extraction reads only the user's and assistant's text of the last exchange, never tool results, and drops its batch if the subject was purged meanwhile. A saved fact carries a digest of the writing session, not the session ID, because the session ID is also the request credential and must never be logged.

**Presentation tools.** A UI component is a tool call. The model's arguments carry its judgement, which IDs, in what order, what reason for each; the server joins every fact from records tools returned this session, drops IDs without provenance and reports them, and refuses a component with nothing left. Suggestion chips are sanitised and capped at four, and a round of clean presentation calls that includes the suggestions tool ends the turn. Nothing here applies to a harness that writes Markdown, but the principle that the model never authors a figure the UI displays is the same one behind ArcKit's citation rule.

**Evals.** A case is a precondition state, one turn unless the behaviour under test is carrying state across turns, and an expected block holding only the keys the case is about. Every key but the rubric is a code grader. The rubric is one pass condition and one fail condition that no response satisfies both of, naming the fixture fact that decides it. The judge runs at temperature zero on a pinned model, and the recording carries a fingerprint of both so a change to either invalidates every stored verdict. Replay re-scores stored outcomes with no API access; the baseline is keyed by case and scorer, so a baselined case that starts failing a different scorer is a new failure; a dataset with no recordings is pending, not passed. Poisoned listings live in eval-only fixtures under a third-party brand and none of their IDs appears in demo data. ArcKit adopted the case shape, the pairing rule, the poisoned-fixture rule and the replay gate.

**Plugin conventions.** A skill description names the request class and carries no sample utterances. A command that scaffolds a project interviews in one message and writes what it decided to a decision record in the project's own instructions file, which later commands read instead of asking again. A review command maps an existing agent row by row, presents a conversion table with the reference pattern for each row and the module that implements it, and converts only the rows the user picks, evals row first because it measures the rest. The repository's own instructions file says each fact appears once, naming its module, with no history, dates or process narrative, and that a change to prompt text, a tool description, a skill or a fence notice re-derives the hosted system prompt, which a consistency script compares. A CI job checks that the internal package names are unregistered on the public index, so a squatter cannot serve a same-named package to anyone installing outside the editable flow.

## What did not transfer

Most of the repository. Cart provenance, where a write accepts only product IDs a tool returned this session, has no analogue when the model's only write is a Markdown file. Staged merchant changes applied by a host approval surface map loosely to "the artefact stays a draft until a person signs it", which ArcKit already said. The memory store, the presentation tools with server-side enrichment, and the byte-stable prompt assembly for cache hits are runtime concerns a plugin does not have. I read them, took notes, and moved on. The five that transferred were worth the day; the rest was the cost of finding them.

## What I would tell someone doing the same

Read the docs before the code. The reference's `safety.md`, its `CLAUDE.md` design rules, and the six plugin skills carried more transferable thinking than the Python did, and they are a tenth of the size. Look for the tables: where a rule lives, what is enforced versus asked, the case shape for evals. A table is a decision someone else already made under pressure, written down. And expect the lessons to arrive as tests. Four of the six above became a CI check or an eval case in ArcKit, and two of those checks found a real defect on the first run. A pattern you cannot turn into a check is a preference. A pattern you can is a rule.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). The commerce-agents reference is at [github.com/anthropics/commerce-agents](https://github.com/anthropics/commerce-agents). Current release: v6.14.0.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
