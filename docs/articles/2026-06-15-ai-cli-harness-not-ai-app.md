# Don't Build an AI App. Build an AI CLI Harness.

**If your product creates long-running AI work, a standalone SaaS app inherits the worst part of the business: inference cost. A harness around the AI CLIs your users already pay for gives you a different shape of product, a better cost boundary, and a workflow that lives where the work already happens.**

---

## The old instinct: build the app

The reflex in AI software is still to build an app. Put a chat box in the middle, add a few workflows around it, proxy the calls through your backend, meter usage, and charge a monthly subscription. It looks like SaaS because SaaS is the shape we know how to sell.

For shallow use cases, that can work. A few summarisation calls, a short extraction workflow, a tidy classification step — those are bounded. The model bill is legible. The user gets a controlled surface. The product can hide the provider and present one clean experience.

Architecture governance is not that kind of workload.

The useful jobs are long. They read a repository, infer context, interview the user, write a set of governed documents, cross-reference them, run checks, revise, and keep going. The better the workflow gets, the more tokens it uses. The best users are often the most expensive users. If you build that as a conventional API-backed app, your happiest customer can become your worst gross-margin customer.

That is not a product-design footnote. It changes the architecture.

## The data point

SemiAnalysis published a useful four-post thread asking whether subscription or API is the better business model for an AI lab. The thread is worth reading in full: [original X thread](https://x.com/SemiAnalysis_/status/2064815042374074396), [unrolled thread data](https://api.fxtwitter.com/2/thread/2064815042374074396).

The interesting part for builders is not just the conclusion that API has better margins. It is the shape of the subscription entitlement.

SemiAnalysis bought Anthropic and OpenAI subscription plans, then ran long-horizon coding tasks until the weekly limits were exhausted. Their [second post](https://x.com/SemiAnalysis_/status/2064815044085318040) estimates that a $200/month Claude Max 20x plan can represent about $8,000/month of API-equivalent usage at maximum utilisation, while a $200/month ChatGPT Pro 20x plan can represent about $14,000/month. Their [third post](https://x.com/SemiAnalysis_/status/2064815045767213400) then models how subscription margins collapse as utilisation rises, assuming API list prices carry 75 percent gross margin.

Those figures are not a promise of future limits, and they are not a recommendation to abuse subscriptions. They are a reminder that the economic boundary matters. If you are paying API list prices inside your own app, you sit on one side of that boundary. If the user is working through a CLI attached to their own subscription or provider account, you sit on another.

## What the app inherits

An API-backed AI app has to own the whole inference problem.

It has to decide how much work a user is allowed to do. It has to set limits before the power users find them. It has to explain why the "unlimited" plan is not unlimited. It has to build metering, billing, abuse controls, retries, queues and fallbacks. It has to carry the risk that a model launch changes usage behaviour overnight. It has to watch every feature request through the lens of cost of goods sold.

The better the agent, the worse this can get. A tool that generates one document is simple to price. A tool that keeps reading, planning, delegating, checking, rewriting and compiling evidence is not. The whole point of an agentic workflow is that the work continues until the job is done. That is exactly the property that makes it hard to sell as a fixed-price app backed by metered API calls.

The app also inherits a trust problem. To do serious work it wants the repository, the architecture docs, the procurement evidence, the risks, the decisions and the unfinished thinking. That means uploads, permissions, retention policies, security review, data residency and another place where project knowledge can fragment.

You can solve those problems. Many teams will. But they are not free.

## What changes with the CLI

The AI CLI changes the unit of integration.

Claude Code, Codex CLI, Gemini CLI, OpenCode and Copilot are already installed where the work happens: in the project, beside the files, with the user's identity, subscription, provider terms and local context. They already know how to read and write the repository. They already hold the long-running conversation. They already expose tools for editing, testing, searching and committing.

A harness built on top of those CLIs does not need to pretend to be the model provider. It does not need to resell inference. It can leave the subscription and API relationship where it belongs: between the user and the lab.

That is the core product shift. The value moves from "we run the model for you" to "we make the model useful, repeatable and governed in your own environment."

The product surface becomes:

- commands that encode the right workflow
- templates that shape the output
- project structure that keeps artifacts findable
- naming rules and document control
- traceability between stakeholders, requirements, risks, decisions and tests
- hooks that catch broken or unsafe output
- checks that tell the user what is missing
- cross-assistant packaging, so the same method works on more than one CLI

None of that is raw inference. All of it is product.

## Why this fits architecture governance

Architecture work is a strange fit for a chat app and a good fit for a harness.

The output is not one answer. It is a system of artifacts. Requirements feed risks. Risks feed business cases. Business cases feed options. Options feed architecture decisions. Architecture decisions feed designs, diagrams, backlog items, test evidence and assurance gates. If one document changes, the rest need to know.

That is why ArcKit is shaped as an AI harness rather than an AI architecture app. It wraps the assistants architects already use and gives them a governed operating model:

- `/arckit:requirements` writes typed requirements with stable identifiers
- `/arckit:risk` produces a risk register that can cite upstream drivers
- `/arckit:adr` records decisions against options and trade-offs
- `/arckit:traceability` connects the chain rather than trusting prose
- `/arckit:health` checks for stale, missing or orphaned artifacts
- community overlays add jurisdiction and sector rules without changing the base workflow

The assistant still does the generative work. The harness constrains it, names it, stores it, checks it and gives the next command somewhere sensible to start.

This is also why multi-CLI support is not just distribution. It is resilience. If the frontier model changes, the harness can move. If one lab withholds a model from subscription plans, users can still choose another CLI. If a team has already standardised on Copilot, Codex, Gemini or Claude Code, the governance method follows the team instead of forcing the team into a new app.

## The cost model becomes someone else's abstraction

This is the uncomfortable but practical point.

When you build an AI app, every workflow improvement is also a cost-model decision. Should the agent search more? Should it run another critique pass? Should it spawn a second worker? Should it read every file or only the top ten? Every "yes" can hit your margin.

When you build a CLI harness, those decisions are still real, but the cost boundary is different. The user is spending from the entitlement or account they already chose. The harness should still be efficient, honest and respectful of limits, but it is not pretending a token-heavy governance workflow can be resold indefinitely for a thin SaaS subscription.

That makes room for better product behaviour. ArcKit can be explicit about long-running work. It can tell the user when a build harness will be expensive in model time. It can split a large job into stages and let the CLI enforce its own limits. It can preserve outputs locally so a resumed session does not start from zero. It can optimise for useful governance artifacts rather than for hiding COGS.

The user gets the same benefit. Their sensitive work stays in the project. Their existing assistant does the execution. Their subscription is not duplicated inside another vendor's pricing model. Their artifacts are files they can inspect, commit, diff and audit.

## The trade-off

There is a reason apps keep getting built. They are easier to onboard, easier to brand, easier to instrument and easier to sell to a buyer who wants one invoice and one dashboard. A CLI harness is more developer- and operator-shaped. It assumes the user is close to a repository and comfortable with commands.

That is not a universal product surface.

But for serious AI work — coding, architecture, compliance, procurement, assurance — the command line is not a step backwards. It is where the context is. It is where the files are. It is where review, version control and automation already live. A browser app has to rebuild that world. A harness can use it.

The right question is not "can this be an app?" Almost anything can. The right question is "does the app make the economics, trust boundary and workflow better, or just more familiar?"

For ArcKit, the answer is clear. The product is the method, not the model call. The assistant is the engine. The CLI is the cockpit. The harness is the governance layer that makes the work usable.

## Build above the model, not around it

SemiAnalysis' thread is about lab economics, but the lesson for builders is sharper: do not accidentally become an inference reseller unless that is actually your business.

If your durable value is workflow, evidence, governance, traceability, templates and domain judgment, build there. Let the labs fight over models, subscriptions, API prices and margin. Let users bring the AI surface they already trust and already pay for. Make that surface do better work.

The next generation of AI products will not all be apps with chat boxes. Some of the best will be harnesses: thin, opinionated layers that turn general-purpose AI CLIs into governed production systems.

That is the bet behind ArcKit.

---

Sources: SemiAnalysis' [original X thread](https://x.com/SemiAnalysis_/status/2064815042374074396), the [subscription-plan data post](https://x.com/SemiAnalysis_/status/2064815044085318040), the [subscription-margin post](https://x.com/SemiAnalysis_/status/2064815045767213400), and the [unrolled thread data](https://api.fxtwitter.com/2/thread/2064815042374074396).

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** — real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** — announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** — code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
