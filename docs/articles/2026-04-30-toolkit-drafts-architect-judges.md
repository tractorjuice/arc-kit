# The Toolkit Drafts. The Architect Judges.

The ArcKit toolkit moves the architect's time from drafting to judging.

That sentence is the whole argument. Everything else in this article is exposition of what it means in practice, why it matters more than the productivity claims that usually surround agentic AI tools, and what an architect's working day actually looks like once the shift has taken hold.

The sentence is short on purpose. It is the kind of claim that sounds like marketing on first reading and turns out to be load-bearing on second reading. The shape of the architect's day, the ratio of architects to engineers a programme can sustain, the apprenticeship structure of the team, the economic case for any large-scale architecture programme: all of these depend on whether the sentence is true in the room where the work is done. If it is, the implications are large. If it is not, the toolkit is a productivity tweak, not an operating model change.

## What the Architect's Day Looks Like Today

A senior solution architect in an enterprise or government function, asked to produce a requirements specification for a new service, will spend most of the calendar time on drafting. The decomposition is recognisable to anyone who has done the work.

There is structural drafting, the work of deciding what sections the document needs, what their order should be, where the traceability tables go, and how the document control header is laid out. There is prose drafting, the work of writing the sentences that explain why a non-functional requirement around availability is set to 99.95 per cent rather than 99.9 per cent, or why a particular integration is a hard dependency rather than a deferred one. There is cross-referencing, the work of making sure that BR-3 actually traces forward to the FR-x set that satisfies it, that DR-7 has a corresponding entity in the data model, that NFR-SEC-2 is reflected in the integration design.

There is formatting drafting, which is the unglamorous half of the job: getting the Markdown tables to render, getting the document control fields aligned, putting the citation markers in the right places, ensuring the revision history is up to date, applying the right classification banner.

And there is editorial drafting, which is the second pass after the first pass, the third pass after stakeholder feedback, the fourth pass after the security review, the fifth pass after the risk register cross-check.

Add it up across a single requirements document and a competent architect spends twelve to fifteen working days on drafting before the document is in a state to circulate for ratification. Repeat the exercise across the ten to twelve artefacts a single new service requires (requirements, stakeholders, risks, data model, integration, vendor research, build versus reuse, ADRs, business case, Wardley map, framework) and the working time per service lands in the eighteen to twenty-two weeks of architect effort that any large programme is used to budgeting for.

Drafting is the dominant cost of the architect's working week. It is not the dominant value of the architect's professional contribution.

## What the Toolkit Actually Does

ArcKit is not an AI assistant in the loose sense in which the term is now used. It is a structured library of templates, each one paired with a slash command that knows how to read the project's existing artefacts, prompt the AI assistant in the architect's IDE to draft the new artefact against the template, apply the document control header, embed citation markers, and write the result to disk in the correct location with the correct filename and the correct version.

The architect runs `/arckit.requirements` and a complete requirements specification appears in the project directory in five to ten minutes. The document is structured. It carries the document control header. Its requirement IDs are stable. Its non-functional families are populated. Its traceability columns are filled in. Its citation markers point at the source documents in the project's external references section. It is not a perfect document. It is a substantively complete starting draft.

The architect runs `/arckit.data-model` and an entity model with relationships, attribute definitions, and a Mermaid diagram appears, derived from the data requirements that the requirements command produced. They run `/arckit.adr` and an architecture decision record for a specific decision lands in the project directory, auto-numbered, ready to be filled with the architect's reasoning. They run `/arckit.sobc` overnight and a five-case Strategic Outline Business Case appears the next morning, drawing on every prior artefact in the project.

In each case, the toolkit has absorbed the structural drafting, the prose drafting, the cross-referencing, the formatting, and the citation work. What it has not absorbed, and cannot absorb, is the editorial judgement that turns the draft into a ratified artefact.

That is the work that is left for the architect.

## What Judging Actually Means

Judging is what the architect does with the draft once it exists. It is a different cognitive operation from drafting, and it is the operation the architect's professional accountability is anchored to.

Judging asks: is the BR-set actually complete, or is there a business need we have failed to capture? Is the NFR-P target defensible, or have we set an availability bar the underlying platform cannot meet without a budget conversation we have not had? Does the data model reflect the way data actually flows in the real-world process, or have we modelled the process the way the policy document describes it rather than the way it works? Is the ADR for the agentic orchestration runtime supported by genuine evidence, or is the evidence post-hoc rationalisation of a vendor we have already decided to choose?

Judging is also an act of attribution. The architect's name on the document is a statement of professional accountability. If the document is wrong, the architect carries the consequence. The signature is the moment the artefact becomes ratified, and ratification is the irreducible act that no tool can perform on the architect's behalf.

The judging load per artefact is roughly two to three days for a senior architect, regardless of whether the draft was produced by hand or by a competent toolkit. The cognitive work of editorial judgement does not compress the way the cognitive work of drafting compresses. The architect still has to read the document end to end, hold the dependencies in their head, cross-reference the claims against the source material, and apply professional judgement to the framing. That is the work the architect is paid for.

## The Economics of the Shift

Once drafting and judging are seen as separable activities, the economics of architecture work change in ways that programme sponsors notice quickly.

The conventional headcount model assumes that the architect's day is roughly seventy per cent drafting and thirty per cent judging. The required headcount to produce N artefacts in T weeks is calculated against that ratio. A typical large-programme architecture function lands at one architect per two engineers, which is the only ratio that keeps the artefact production rate ahead of the engineering delivery rate.

Under the toolkit-absorbs-drafting model, the same architect produces the same artefact in roughly thirty per cent of the calendar time, because the seventy per cent that was drafting is now compressed into a fraction of itself. The required headcount per N artefacts in T weeks falls accordingly. The architect-to-engineer ratio that the function can sustain shifts from one to two towards one to five or one to six.

That is not a productivity improvement. That is a different operating model. It changes how programmes are budgeted, how teams are structured, how junior architects are trained, and how the senior architect's working week is allocated.

For any organisation running an architecture function at scale, the ratio change is the line item that matters. A seven-person architecture function can support a thirty-five person engineering bench under the new ratio. The same function can support a fourteen person engineering bench under the old one. Two and a half times the delivery throughput from the same architecture headcount is not a marginal claim. It is the claim that makes ambitious delivery timelines arithmetically tractable.

## The Two Failure Modes

There are two ways to get the drafting-to-judging shift wrong, and both of them are common in the first three months of adoption.

The first failure mode is the architect who cannot let go of drafting. They run the command, they receive the draft, and then they rewrite it. They restructure the sections. They rephrase the prose. They reformat the tables. They produce, after twelve days of editorial intervention, a document that is essentially a hand-written version of what the toolkit gave them on day one. This architect has used the toolkit to make their drafting ten per cent faster, not their judging ten times more efficient. The working day has not actually changed.

The second failure mode is the architect who does not apply enough judging. They run the command, they read the draft superficially, they rubber-stamp it, and they ship it. The artefact appears on disk in record time. It also contains a non-functional requirement that contradicts the security policy ceiling, an integration assumption that is wrong about the upstream system, and a vendor recommendation that has not been cross-checked against the relevant security reference. The artefact is fast and wrong. The next iteration has to fix what the first iteration shipped, and the cadence collapses retroactively.

Neither failure is a tooling problem. Both are professional discipline problems. The first comes from architects who under-trust the toolkit, the second from architects who over-trust it. The right calibration is in the middle: trust the draft enough to spend the time on judging, distrust it enough to do the judging properly.

## The New Architect's Day

The architect's working day under the toolkit-absorbs-drafting model has a recognisable shape.

The architect starts a session with the AI assistant in their IDE. They review the existing artefacts in the project directory and decide which command to run next based on the prerequisite chain that ArcKit's handoffs schema makes explicit. They invoke the command, let it run for the few minutes it takes to produce the draft, and switch to other work while it completes.

The draft is ready. The architect reads it end to end, takes notes on the assumptions they want to challenge, the cross-references they want to verify, the framing they want to refine. They do not rewrite the prose unless the prose is genuinely wrong. They do not reformat the document unless the format breaks the project's hook validation. They focus on the substantive editorial questions.

They verify the cross-references against the source material, run the citation traceability check that ArcKit's external references section provides, apply their amendments through targeted edits rather than wholesale rewrites, and circulate the draft for stakeholder review. The questions the stakeholder review will ask are anticipated and answered before they are asked.

By the end of the day, the artefact is on disk, classified, citation-traceable, ready to integrate into the service's overall set. The architect has spent six to eight hours on the artefact. The same artefact would have taken two to three weeks the conventional way. The compression is structural, not motivational.

This is the working day the toolkit assumes. If most of the architect's day looks like this, the productivity claim holds. If it does not, the productivity claim does not hold and the toolkit is being adopted on paper rather than in practice.

## What This Means for the Profession

The longer-term implication, beyond the immediate productivity case, is a redefinition of what the architect's role consists of.

The architect of 2030, in any organisation that has adopted agentic toolkits seriously, will spend most of the working week on judging, ratifying, framing, and stakeholder negotiation. Drafting will be a residual activity, performed only when the toolkit has produced something that genuinely needs to be rewritten rather than refined. The architect's professional accountability will be unchanged: the signature on the artefact is still a statement of personal responsibility, and the consequences of getting the artefact wrong still flow back to the human in the chair.

What changes is the apprenticeship structure of the function. Junior architects today learn the craft by drafting. They produce the work, the senior architect reviews it, and the editorial conversation is the training mechanism. If the toolkit absorbs the drafting load, the junior architect's apprenticeship surface has to be reconstituted around judging tasks: paired review of toolkit output, structured feedback on editorial decisions, explicit calibration of the trust-but-verify discipline that the new working day requires.

This is a real change to how architecture functions are built and how professional development is sequenced. It is also a question that any organisation adopting these tools at scale has to think through deliberately, because the apprenticeship problem does not solve itself.

## The Sentence in Full

The ArcKit toolkit moves the architect's time from drafting to judging. The sentence is a statement of fact about the toolkit, and it is also a statement of choice for the architect. The toolkit can move the time only if the architect lets it. The architect lets it by trusting the draft enough to skip the rewrite and applying the judging properly to what the draft says.

When that happens, the working day changes, the architecture-to-engineering ratio changes, the cadence of any programme that depends on the function changes, and the economics of architecture work changes with it. When it does not happen, the toolkit is a productivity tweak and the working day is recognisably the same as it always was.

The sentence is short. The choice it asks the architect to make is not.
