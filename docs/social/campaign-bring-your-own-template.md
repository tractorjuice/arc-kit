# Bring Your Own Template

<!-- markdownlint-disable MD018 -- hashtag lines at the end of each post are post text, not headings -->

A recurring campaign for architects whose organisation already has a house format: "we have our own templates" is the most common reason a team doesn't try ArcKit. We invite people to share a template, then show ArcKit drafting in it on a fictional project, crediting them the way they choose.

Voice and rules: `SOCIAL.md` (warm "we", lead with what the reader can use, no costs, no mistakes, no usage claims, "GitHub Copilot" in full).

## How it works

1. **Someone shares a template** through the [Share a template](https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml) form (`.github/ISSUE_TEMPLATE/template-share.yml`), or privately on Discord or the LinkedIn group. The form asks for templates that are public or cleared for release, with internal names, personal data and markings above OFFICIAL removed.
2. **We bring it into ArcKit.** If it reshapes a built-in document (a requirements or business case format), `/arckit:customize <name>` copies the built-in template to `.arckit/templates-custom/`, where it is edited to match; ArcKit commands use the custom copy first, and updates leave it alone. If it is a document ArcKit doesn't have, `/arckit:template-builder` builds a new template from it, marked as a community template.
3. **We draft in it** on the fictional Ashcombe housing benefits project (the evals fixtures), and publish the template, the ArcKit copy and the draft side by side in a public test repository.
4. **We post a showcase**: what the format does, what ArcKit produced in it, credit as chosen. Drafts are for qualified people to review, as always.

Never: publish anything that looks sensitive, even if submitted; name an organisation without the "name" credit option; say an organisation "uses" ArcKit because it shared a template.

## Cadence

- **Call for templates**: Monday 2 November 2026 (after *Regulation week*), on the page, in the group and on Discord. A reminder in the group on Monday 16 November.
- **Showcase**: monthly, from the first submission. If nothing has arrived by Monday 23 November, seed the first showcase with a template a UK public body has already published, credited to it as a public document, and say that's what it is.

## Posts

### Call for templates: ArcKit page (Monday 2 November)

Does your organisation already have its own template for requirements, a business case or a design review?

Most teams do. It's often the first question we're asked: can ArcKit draft in our format, not just its own?

It can, and we'd like to show you. Share a template with us, and we'll draft a document in it on a fictional project and publish the result side by side, so you can see exactly what changes and what doesn't.

Two ways in:

→ For a document ArcKit already knows, such as requirements or a business case, /arckit:customize copies our template into your project for you to reshape. ArcKit uses your copy from then on, and updates leave it alone.
→ For a document ArcKit doesn't have, /arckit:template-builder asks about your format and builds a new template from it.

Only share a template that is public or cleared for release, with internal names and anything sensitive removed. We'll credit you however you prefer, or not at all.

Share one here:
https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml

What's the one template your team couldn't work without?

#EnterpriseArchitecture #DigitalGovernment #OpenSource

### Call for templates: LinkedIn group (Monday 2 November)

What's the one document template your team couldn't work without?

We're inviting architects to share a house template, for requirements, a business case, a design authority submission or anything else, and we'll show ArcKit drafting in that format on a fictional project, published side by side. Only templates that are public or cleared for release, with anything sensitive removed; we'll credit you however you prefer.

Share one here: https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml
Or send it privately to the maintainer through the group.

### Reminder: LinkedIn group (Monday 16 November)

Still looking for a few house templates to show ArcKit drafting in your format. If your team has one it's proud of, and it's public or cleared to share, we'd love to see it: https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml

### Discord #announcements (Monday 2 November)

> 📝 **Bring your own template**
> Got a house format for requirements, business cases or design reviews? Share it (public or cleared for release, nothing sensitive) and we'll show ArcKit drafting in it on a fictional project.
> <https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml>
> Questions: #show-your-working

### Showcase post: template (fill in per submission)

> [One line on what the format does that a standard one doesn't, in the submitter's words.]
>
> [Credit as chosen: "Shared by [name], [organisation]" / "Shared by an architect at a central government department" / no credit.]
>
> We brought it into ArcKit with [/arckit:customize <name> | /arckit:template-builder], then drafted [document] for our fictional Ashcombe housing benefits project.
>
> What carried over: [two or three specifics]. What ArcKit added: [traceability to requirements, citations, document control, as applicable]. As always, the result is a draft for qualified people to review.
>
> The template, ArcKit's copy and the draft are side by side here: [public test repository link]
>
> Got a format of your own? https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml
>
> #EnterpriseArchitecture #DigitalGovernment #OpenSource

## How we'll know it worked

- Templates shared (form plus private), and how many submitters later use the adopter form.
- Group comments on the call and the reminder.
- Pull requests or community templates that come out of a showcase.
