# OpenAI made Forward Deploy Engineering a category. Here is the UK public sector version.

A name change with a different operating model behind it.

OpenAI launched The OpenAI Deployment Company yesterday with around four billion dollars of initial investment, nineteen capital partners, and a hundred and fifty engineers folded in from the Tomoro acquisition. What matters is not the headline number. It is the name they chose for the people doing the work. Not consultants. Forward Deployed Engineers.

That distinction is not cosmetic. Read the [OpenAI page on FDE](https://openai.com/business/the-openai-deployment-company/) and the model is clear. Engineers embedded inside the customer environment, building AI systems against the actual constraints that live there: security models, permissions, compliance, legacy infrastructure, governance. The constraints are the operating environment, not edge cases.

That is exactly the model UK public sector architecture needs. So today we are launching [ArcKit FDE](https://tractorjuice.github.io/arckit-fde/): forward deploy engineering for UK public sector programmes, running on ArcKit, priced as a fixed weekly engagement.

## Why this shape fits UK public sector

Public sector programmes do not fail in greenfield workshops. They fail at the seam between policy intent and operational reality. Classification rules. Legacy estates with twenty-year contracts. Supplier lock-in that pre-dates the senior responsible owner. Assurance routes the SRO inherited and does not yet trust. Departmental governance with three accountable boards. Ministerial timelines that move on Wednesday afternoons. AI policy boundaries that change between two Cabinet Office notes.

Big consultancy bench delivery does not survive this. Too many people, too far from the decision, optimising for deliverables that age out before they reach the board.

Embedded senior architects do survive it. One or two people, inside the room, running a toolkit that compresses three months of evidence into a week. That is what Forward Deploy Engineering looks like when the customer is a public sector programme rather than a Fortune 500 manufacturer.

## The four shapes of FDE work

ArcKit FDE engagements come in two layers.

**Layer one is the first sprint.** Five days, twenty-five thousand pounds, four artefacts. Principles, requirements, risk, stakeholders. By Friday afternoon the programme has a board-readable governance pack with Green Book, Orange Book, Service Standard and TCoP evidence baked in.

**Layer two is the embedded follow-on.** Same engineer stays. Same toolkit. Weekly cadence. Typical work falls into four categories:

1. *Design and decisions.* ADRs, high-level design, traceability matrices, conformance reviews. Decisions that survive contact with delivery.
2. *Procurement and vendor.* SOW, evaluation frameworks, scoring, G-Cloud and DOS clarifications, build versus buy. Requirements that procurement can actually go to market with.
3. *Assurance and AI.* Service assessment readiness, Secure by Design, DPIA, ATRS, AI Playbook compliance. The evidence the gatekeepers ask for, in the format they accept.
4. *Team enablement.* The client team stands up ArcKit, Claude Code and the governance cadence themselves. The FDE leaves a team that can keep running without them.

The first sprint unlocks the next decision. The follow-on keeps the architecture position alive as the programme moves through it.

## What the first sprint actually produces

It is the same shape you get when you run ArcKit yourself, just compressed and with a senior architect in the room.

Principles are decision rules that connect policy intent to delivery trade-offs. Not aspirational posters. Things like "every architecture choice records its public outcome, user need and policy objective before solution preferences are locked in." Tagged to Green Book point one and Service Standard point one.

Requirements are split user, policy, data, security, integration and operational. Each one carries an evidence tag so when the technical authority asks why a constraint exists, the link to TCoP or Service Standard is there. Procurement can take this set to market without inventing language.

Risks are written in the cause, event, effect, owner, controls, treatment, escalation pattern. Orange Book aligned. Boards recognise the shape. Auditors recognise the shape. Most importantly the SRO can answer the question every SRO eventually gets asked: which of these would I lose sleep over.

Stakeholders are mapped against decision rights, evidence needs and likely objections. The SRO, the technical authority, commercial, user research, operational staff, devolved partners, regulators. Each group gets the part of the evidence they actually need, not the whole eight-hundred-page pack.

The mix is deliberate. Four artefacts is enough to unlock most gates, and small enough that one architect can produce a defensible version in a week.

## Why twenty-five thousand a week is the right number

Three reasons.

It is bounded. Both sides know what comes out on Friday. There is no open-ended discovery phase to scope-creep.

It is honest about what the customer is buying. Senior architecture judgement, applied inside the programme, using a toolkit that does the structural work. Not a team of twelve juniors learning the programme from scratch.

It is small enough to spend on a hunch and big enough to take seriously. The first sprint costs less than the legal review of one supplier contract. The output unlocks the supplier conversation.

## Where to start

If you have a programme that is heading into a board, a procurement, an assurance review or an architecture gate, and you are not yet sure the evidence holds up, the first sprint is what it was built for.

Site: [arckit.org/fde](https://tractorjuice.github.io/arckit-fde/)

Examples: real ArcKit outputs from [NHS Appointment Booking](https://tractorjuice.github.io/arckit-test-project-v7-nhs-appointment/), [HMRC Tax Assistant](https://tractorjuice.github.io/arckit-test-project-v2-hmrc-chatbot/), [Cabinet Office GenAI Platform](https://tractorjuice.github.io/arckit-test-project-v9-cabinet-office-genai/), [Scottish Courts GenAI Strategy](https://tractorjuice.github.io/arckit-test-project-v14-scottish-courts/), plus fifteen more on [arckit.org/use-cases](https://arckit.org/use-cases.html).

Enquiry: mark.craddock@mcc.co.uk
