# Product backlog and user story template

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A product backlog is the ordered list of work a team needs to do to improve a product, and user stories are a common way to write its items. This guide covers what a backlog holds, a user story template with acceptance criteria, how to prioritise, and how `/arckit:backlog` builds a sprint-ready backlog from your requirements.

---

## What a product backlog is

The [Scrum Guide](https://scrumguides.org/scrum-guide.html) (November 2020) says: "The Product Backlog is an emergent, ordered list of what is needed to improve the product. It is the single source of work undertaken by the Scrum Team."

- **Ownership**: the Product Owner is accountable for managing it. That means setting and communicating the Product Goal, creating and explaining backlog items, ordering them, and making sure the backlog is visible and understood.
- **Product Goal**: a future state of the product that the Scrum Team plans against. The Scrum Guide places it in the Product Backlog.
- **Refinement**: breaking items down into smaller, more precise ones, and adding details such as a description, order and size. This is an ongoing activity, not a one-off event.
- **Sizing**: the Developers who will do the work are responsible for sizing it.
- **Ready for selection**: an item the team can finish within one sprint is ready to be picked at Sprint Planning.

The Scrum Guide does not mention user stories or story points. They are common practices that teams add to it.

The GOV.UK Service Manual's [agile tools and techniques](https://www.gov.uk/service-manual/agile-delivery/agile-tools-techniques) page describes the product backlog as where a team stores the user stories it has not started yet, in order of priority. Teams following Scrum also keep a sprint backlog for the stories they agreed to work on in that sprint. GOV.UK's guide to deciding on priorities adds that a backlog is likely to hold other kinds of work too, such as support tickets and tasks to deal with technical debt.

---

## User story template

The GOV.UK Service Manual's guide to [writing user stories](https://www.gov.uk/service-manual/agile-delivery/writing-user-stories) uses this structure:

```text
As a... [who is the user?]
I need/want/expect to... [what does the user want to do?]
So that... [why does the user want to do this?]
```

You can use a different format, but every story should name the actor, the narrative and the goal. The goal matters most: it tells the team which problem it is solving and when the story is done. If you can't write the goal, question whether the feature is needed.

Add **acceptance criteria**: a checklist of outcomes that show the story meets the user need, often written as a list that starts "it's done when...".

```text
As a new user
I want to create an account with my email address and a password
So that I can come back to the service and see my saved preferences

It's done when:
- the user can create an account with an email address and password
- the user gets a confirmation email
- the user can sign in with the new account
```

A story that would take more than a few weeks to develop and test is an **epic**. Where you can, split epics into stories that fit within one iteration (sprint).

---

## Prioritising the backlog

GOV.UK's guide to [deciding on priorities](https://www.gov.uk/service-manual/agile-delivery/deciding-on-priorities) says priorities should be decided regularly, and based on performance analysis, user research and input from stakeholders. The person leading the exercise should use a clear method and involve the delivery team and stakeholders.

One method it describes is MoSCoW, which sorts items into:

| Category | Meaning |
|----------|---------|
| Must have | The product can't work without it |
| Should have | Greatly improves the product, but isn't essential to it working |
| Could have | Improves the service; leaving it out for now does little harm |
| Will not have | Low priority; the team has agreed not to do it |

---

## Using /arckit:backlog

`/arckit:backlog` converts requirements into groomed stories, groups them into sprints, and exports markdown, CSV, and JSON for tooling.

### Input Readiness

| Must Have | Why it matters |
|-----------|----------------|
| `ARC-<id>-REQ-v1.0.md` with BR/FR/NFR/INT/DR IDs | Feeds epics, stories, and non-functional tasks |
| Approved HLD/DLD | Ensures stories reference actual components |
| Stakeholder analysis | Provides personas for story wording |

*Strongly recommended*: risk register (for priority), business case (for value), traceability matrix (for gaps).

### Command Patterns

```bash
/arckit:backlog                      # default: 8 sprints, 20 pts each
/arckit:backlog VELOCITY=25 SPRINTS=12 FORMAT=all
/arckit:backlog PRIORITY=risk        # other options: value, moscow, multi
```

Outputs land in `projects/<id>/ARC-<id>-BKLG-v1.0.*`.

### Backlog Workflow

| Stage | Action |
|-------|--------|
| 1. Gather inputs | Confirm artefacts above are up to date |
| 2. Run command | Choose velocity/sprint count that matches team capacity |
| 3. Review exports | Check epic grouping, dependencies, and MoSCoW tags |
| 4. Sprint slicing | Adjust sprint boundaries to respect change freeze / compliance windows |
| 5. Tool import | Use CSV/JSON for Jira, Azure DevOps, or Trello |

**Totals are checked.** The command always writes `ARC-*-BKLG-*.json` alongside the Markdown, and writes it first. In Claude Code a hook recomputes every total from the items when the JSON is saved (story count, points per epic and per MoSCoW category, sprint numbers) and sends any mismatch back to the model to fix. The same hook blocks a requirement delivered at a lower MoSCoW priority than the requirements document gives it, unless the reason is recorded as `priority_change` on its traceability row. When you re-run the command on an existing backlog, story points of unchanged items are kept and every re-estimate is listed in the Revision History.

---

## Sprint Planning Checklist

- Stories tie back to requirement IDs in description.
- Acceptance criteria reflect regulatory constraints (WCAG, GDPR, security).
- Risks flagged as HIGH appear in Sprint 1–2 for mitigation.
- Each sprint finishes a vertical slice (discovery, build, test).
- Service management work (e.g., `/arckit:servicenow`) placed before go-live.

---

## Useful References

- [The Scrum Guide](https://scrumguides.org/scrum-guide.html) (2020), for the product backlog, refinement and sprint definitions.
- GOV.UK Service Manual: [writing user stories](https://www.gov.uk/service-manual/agile-delivery/writing-user-stories), [deciding on priorities](https://www.gov.uk/service-manual/agile-delivery/deciding-on-priorities) and [agile tools and techniques](https://www.gov.uk/service-manual/agile-delivery/agile-tools-techniques).
- `/arckit:traceability` to spot requirements without coverage before backlog generation.
