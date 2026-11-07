# Bring Your Own Template

<!-- markdownlint-disable MD018 -- hashtag lines at the end of each post are post text, not headings -->

A recurring campaign for architects whose organisation already has a house format: "we have our own templates" is the most common reason a team doesn't try ArcKit. We invite people to share a template, then show ArcKit drafting in it on a fictional project, crediting them the way they choose.

Voice and rules: `SOCIAL.md` (the maintainer's voice, lead with what the reader can use, no costs, no mistakes, no usage claims, "GitHub Copilot" in full).

## How it works

1. **Someone shares a template** through the [Share a template](https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml) form (`.github/ISSUE_TEMPLATE/template-share.yml`), or privately on Discord or the LinkedIn group. The form asks for templates that are public or cleared for release, with internal names, personal data and markings above OFFICIAL removed.
2. **We bring it into ArcKit.** If it reshapes a built-in document (a requirements or business case format), `/arckit:customize <name>` copies the built-in template to `.arckit/templates-custom/`, where it is edited to match; ArcKit commands use the custom copy first, and updates leave it alone. If it is a document ArcKit doesn't have, `/arckit:template-builder` builds a new template from it, marked as a community template.
3. **We draft in it** on the fictional Ashcombe housing benefits project (the evals fixtures), and publish the template, the ArcKit copy and the draft side by side in a public test repository.
4. **We post a showcase**: what the format does, what ArcKit produced in it, credit as chosen. Drafts are for qualified people to review, as always.

Never: publish anything that looks sensitive, even if submitted; name an organisation without the "name" credit option; say an organisation "uses" ArcKit because it shared a template.

## Cadence

- **Call for templates**: on the page on Monday 2 November 2026 (after *Regulation week*). The group version hadn't gone out by 7 November, so post it before the reminder. A reminder in the group on Monday 16 November.
- **Showcase**: monthly, from the first submission. If nothing has arrived by Monday 23 November, seed the first showcase with a template a UK public body has already published, credited to it as a public document, and say that's what it is.

## Posts

### Call for templates: ArcKit page (posted Monday 2 November)

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

We're looking for house templates to try with ArcKit: requirements, a business case, a design authority submission, anything your team relies on.

If you've got one that's public or cleared for release, please share it. We'll draft a document in it on a fictional project and publish the two side by side, so you can see what carries over. Take out anything sensitive first. We'll credit you however you like, or not at all.

Share one here: https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml
Or get in touch through the group.

### Reminder: LinkedIn group (Monday 16 November)

Still after a few house templates to try with ArcKit. If you've got one that's public or cleared to share, please get in touch: https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml

### Discord #announcements (Monday 2 November)

> 📝 **Bring your own template**
> Looking for house formats to try with ArcKit: requirements, business cases, design reviews. If you've got one that's public or cleared for release, share it and we'll draft in it on a fictional project.
> <https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml>
> Questions: #show-your-working

### Showcase post: template (fill in per submission)

> [What the format does that a standard one doesn't, in the submitter's words.]
>
> [Credit as chosen: "Shared by [name], [organisation]" / "Shared by an architect at a central government department" / no credit.]
>
> Brought it into ArcKit with [/arckit:customize <name> | /arckit:template-builder], then drafted [document] for our fictional Ashcombe housing benefits project.
>
> What carried over: [two or three specifics]. What ArcKit added: [traceability to requirements, citations, document control, as applicable]. It's a draft for qualified people to review.
>
> The template, ArcKit's copy and the draft, side by side: [public test repository link]
>
> Got a format of your own? Please share it: https://github.com/tractorjuice/arc-kit/issues/new?template=template-share.yml
>
> #EnterpriseArchitecture #DigitalGovernment #OpenSource

## How we'll know it worked

- Templates shared (form plus private), and how many submitters later use the adopter form.
- Group comments on the call and the reminder.
- Pull requests or community templates that come out of a showcase.
