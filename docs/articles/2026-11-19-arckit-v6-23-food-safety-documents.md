# ArcKit v6.23.0: Food Safety Documents That Say Only What the Business Said

**ArcKit v6.23.0 is out. A new optional overlay helps a small catering business in England or Wales build its food safety documents from the Food Standards Agency's *Safer food, better business for caterers* pack. It prints the pack's wording unchanged, and it never fills in an answer for you.**

*Mark Craddock · medium.com/arckit*

---

## An overlay for a kitchen

This overlay isn't for architects. It's for a café, a takeaway, a restaurant, a pub kitchen or a mobile caterer.

A food business has to keep food safety management documents. The Food Standards Agency publishes a free pack for that, *Safer food, better business for caterers*: 100 pages and 31 safe methods, each asking how your business does it.

`arckit-uk-food` turns the pack into a set of documents of the business's own: its answers, its own methods, and a named person who has read each one and signed it off. It's experimental, and it's switched off until you enable it.

## Two rules

Everything in it follows from two rules.

**The pack's wording isn't rewritten.** All 100 pages come with the overlay. The assistant doesn't write that text into your document. A script prints it, unchanged, and a second check proves the document still matches. So a temperature or a time in your document is the one the pack prints.

**A document says only what the business said.** Anything nobody at the business has confirmed reads NOT YET ANSWERED. The commands never suggest an answer. If nobody is there to answer, nothing is confirmed and nothing is signed.

One of the tests shows what that means. The owner of an invented café gives four answers about cooking, then says "for everything else just put whatever is usual for a cafe like ours". The document comes out with those four answers in it, and the other 42 questions reading NOT YET ANSWERED.

## Five commands, in order

- `/arckit-uk-food:uk-food-profile` records the business: who runs it, where it is, what it sells, its equipment and staff, and whether it does anything that needs extra care.
- `/arckit-uk-food:uk-food-safe-methods` works through one of the pack's five sections with you, one safe method at a time: cross-contamination, cleaning, chilling, cooking and management.
- `/arckit-uk-food:uk-food-own-methods` records the business's own methods, word for word.
- `/arckit-uk-food:uk-food-check` shows what's finished, what's still waiting for an answer and what has been signed off.
- `/arckit-uk-food:uk-food-sign-off` records a named person's sign-off of a finished document.

Setting up is done once, by someone comfortable with a terminal. After that you answer in ordinary words.

## A sign-off means someone read it

A sign-off records a name, a role, a date and the version that person read. It covers the document exactly as it reads when it's signed.

Change an answer afterwards and the sign-off no longer counts. The document is written again as a new version, and that version needs signing. A document whose header says it's signed off when no sign-off is recorded fails the check.

## What it won't do, even if you ask

Most of the reviewing went into the ways a helpful assistant could quietly make a food safety document untrue. These are the ones that changed how the overlay works.

- **It won't offer you the usual answers** to approve with one "yes". An answer has to come from you.
- **It won't make up a reason or a date.** Where the pack asks for one and you haven't given it, the command asks you. Until then the answer stays unconfirmed.
- **It won't tidy your words.** A procedure you wrote is kept exactly as you wrote it, and so is the name you gave it.
- **It won't let a changed document stay signed.** A reviewer tried fifteen kinds of edit to a signed file. Each one ended the sign-off.
- **It won't undo sign-offs that still hold.** Add a member of staff and the profile needs signing again. The documents that don't print the staff list stay signed.

## Special processes stay with you and your council

The pack names processes and foods that need extra care, such as vacuum packing, sous vide and less than thoroughly cooked burgers. The profile asks whether the business does each one.

The overlay won't write a procedure for any of them, and it won't finish or improve one if you ask. A procedure written by a tool would be a control nobody at the business has tested.

What it does is tell you to contact your council's environmental health team, record your own procedure word for word, and add the council's reply when it comes.

## What it doesn't do

- **It isn't legal advice.** The food business operator is responsible for the safety of the food and for keeping the records. Your council's environmental health team is the authority for your premises. The Food Standards Agency hasn't reviewed or endorsed the overlay, and no food safety professional has reviewed it yet. Treat everything it produces as a draft to read and confirm.
- **England and Wales only**, and the caterers' pack only.
- **It doesn't keep the diary.** That stays with you, on paper or however you keep it today.
- **It doesn't choose where the pack disagrees with itself.** In two places the pack words the same limit two ways. Your documents print each as the pack prints it. If one matters to you, ask your council's environmental health team.
- **The pack's separate sheets aren't in it yet**: the cleaning schedule, the training record, the suppliers' and contacts lists, and allergen information for each dish. There are no dates for those.

## How it was built

It was built with Claude Code over two days, starting from the pack itself: 39 PDFs, the main one 100 pages.

- **The check came first.** Before any of the pack was typed up, every word on every page was saved from the PDF's own text: 27,967 words. A test then held the overlay's copy of the pack to exactly those words, page by page.
- **Two readings.** Each section was then read a second time, by a reader that never saw the first transcription, and the two were compared.
- **The figures.** The pack prints 84 figures and named standards: temperatures, times, British Standards. Each was checked against a picture of its page by a separate AI reader that saw only the pictures. All 84 matched.
- **A builder and a reviewer.** Each piece was built by one AI agent from a written brief, then reviewed by a separate one whose job was to break it. The fixes were checked again.
- **Decisions on the record.** 95 decisions were written down as they were made, each with what it would cost if it turned out wrong.
- **Live runs.** The commands were run more than twenty times against the invented café. Each run was judged on what it did to the files, not on what it said it had done.

No real business has used it yet. That's why it's marked experimental.

## Help wanted

I'm looking for a food safety co-maintainer. If you're an environmental health practitioner or a food safety consultant, please [open an issue](https://github.com/tractorjuice/arc-kit/issues) tagged `co-maintainer: uk-food`.

## Also in this release

- **A build recipe can say how short a document may be.** `/arckit:build` used to fail any document of 100 lines or fewer. A recipe can now set its own minimum for each document. Existing recipes build as before.
- **ArcKit no longer tells you to promote a draft that only its own command can change.** The health check and the notice at the start of a session leave those drafts alone. An overdue review is still reported.
- **Gemini CLI: a command that runs a bundled script now finds it.** This affected the food and legacy IT overlays, `/arckit:tenders`, `/arckit:competitors` and two of the Netherlands commands.
- **Paperclip: two bundled scripts run from the published package again.**

## Get it

```bash
# Claude Code
claude plugin install arckit-uk-food --marketplace tractorjuice/arckit-claude
claude plugin enable arckit-uk-food

# then start Claude Code in a folder for the business's records
/arckit-uk-food:uk-food-profile Bramble Cafe
```

The [overview guide](https://arckit.org/guide/uk-food-safety-overlay.html) covers the order to work in, special processes and what to do when the pack doesn't fit your business.

Already using ArcKit? Run `claude plugin update arckit@arckit-claude`.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). The full list of changes is in the [6.23.0 release notes](https://github.com/tractorjuice/arc-kit/releases/tag/v6.23.0).*

*The overlay is built on Safer food, better business for caterers, published by the Food Standards Agency. Contains public sector information licensed under the Open Government Licence v3.0.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
