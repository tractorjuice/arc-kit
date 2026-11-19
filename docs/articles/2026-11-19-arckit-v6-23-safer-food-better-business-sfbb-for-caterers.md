# Safer Food, Better Business (SFBB) for Caterers: Complete Your Pack with ArcKit v6.23.0

**Safer food, better business (SFBB) for caterers is the Food Standards Agency's food safety pack for small catering businesses. ArcKit v6.23.0 adds an optional overlay that walks you through your SFBB pack one step at a time: it asks about each safe method, keeps SFBB's wording exactly as the Food Standards Agency wrote it, and records your answers in your own words.**

**Before you start:** this is an experimental tool, not legal advice. The Food Standards Agency hasn't reviewed or endorsed it. It covers the pack's safe methods. The diary and the record sheets stay with you.

*Mark Craddock*

---

## What is Safer food, better business (SFBB)?

The pack is free, and the caterers' version is, in its own words, "for small catering businesses such as restaurants, cafés and takeaways".

The pack says the law requires you to write down what you do to make sure food is safe. It's the Food Standards Agency's pack to help a small caterer in England or Wales do that. It has 100 pages and 31 safe methods in five sections: cross-contamination, cleaning, chilling, cooking and management. To complete the pack you work through each section and fill in every safe method that applies to your business.

## Completing your SFBB pack with ArcKit

ArcKit is an open-source toolkit that runs inside Claude Code, an AI assistant you type to. Until now it has been for architects. This part of it is for a café, a takeaway, a restaurant, a pub kitchen or a mobile caterer.

It turns the pack into your own food safety documents: your answers, your own methods, and a named person who has read each one and signed it off. You'll need Claude Code, a Claude account to sign in with, and someone comfortable with a terminal to set it up once. After that you answer in ordinary words.

## Two things you can rely on

**SFBB's wording isn't rewritten.** All 100 pages come with ArcKit. The AI doesn't retype that text into your document. ArcKit prints it, unchanged, from its own copy of the pack, and then checks the document still matches. So a temperature or a time in your document is the one the pack prints.

**Your answers are yours.** ArcKit asks the questions and you answer them. Anything nobody at your business has confirmed reads NOT YET ANSWERED, so you can always see what is still to do. If nobody is there to answer, nothing is confirmed and nothing is signed.

One of the tests shows what that means. The owner of an invented café gives four answers about cooking, then says "for everything else just put whatever is usual for a cafe like ours". The document comes out with those four answers in it, and the other 42 questions reading NOT YET ANSWERED.

## The five steps

1. **Describe your business.** `/arckit-uk-food:uk-food-profile` records who runs it, where it is, what you sell, your equipment and staff, and whether you do anything that needs extra care.
2. **Work through the safe methods.** `/arckit-uk-food:uk-food-safe-methods` takes one of the pack's five sections at a time, one safe method at a time: cross-contamination, cleaning, chilling, cooking and management.
3. **Add your own methods.** `/arckit-uk-food:uk-food-own-methods` records how you do things, word for word.
4. **See what's left to do.** `/arckit-uk-food:uk-food-check` shows what's finished, what's still waiting for an answer and what has been signed off.
5. **Sign off each document.** `/arckit-uk-food:uk-food-sign-off` records a named person's sign-off of a finished document.

## A sign-off means someone read it

A sign-off records a name, a role, a date and the version that person read. It covers the document exactly as it reads when it's signed.

Change an answer afterwards and the sign-off no longer counts. ArcKit writes the document again as a new version, and that version needs signing. A document that says it's signed off when no sign-off is recorded fails ArcKit's check.

## What stays in your hands

- **Every answer comes from you.** ArcKit asks. It doesn't offer a usual answer for you to approve.
- **Reasons and dates are yours too.** Where the pack asks for one, ArcKit asks you and waits.
- **Your words stay as you wrote them**, including the name you give a method.
- **A sign-off always matches what was read.** Change the document and it needs signing again.
- **Other documents keep their sign-off.** Add a member of staff and only the profile needs signing again.

## Special processes stay with you and your council

The pack names processes and foods that need extra care, such as vacuum packing, sous vide and less than thoroughly cooked burgers. ArcKit asks whether you do each one.

It doesn't write a procedure for any of them, and it doesn't finish or improve one. A procedure written by a tool would be a control nobody at your business has tested.

It tells you to contact your council's environmental health team, records your own procedure word for word, and adds the council's reply when it comes.

## What it doesn't cover

- **It isn't legal advice.** The food business operator is responsible for the safety of the food and for keeping the records. Your council's environmental health team is the authority for your premises. The Food Standards Agency hasn't reviewed or endorsed it, and no food safety professional has reviewed it yet. Treat everything it produces as a draft to read and confirm.
- **England and Wales only**, and the caterers' pack only.
- **It doesn't keep the SFBB diary.** That stays with you, on paper or however you keep it today.
- **It doesn't choose where the pack disagrees with itself.** In two places the pack words the same limit two ways. Your documents print each as the pack prints it. If one matters to you, ask your council's environmental health team.
- **The pack's separate sheets aren't in it yet**: the cleaning schedule, the training record, the suppliers' and contacts lists, and allergen information for each dish. There are no dates for those.

## How it was built

I built it with Claude Code over two days, 17 and 18 November 2026, starting from the pack itself: 39 PDFs, the main one 100 pages.

- **The check came first.** Every word on every page was saved from the PDF's own text, 27,967 words, and a test held ArcKit's copy of the pack to exactly those words.
- **Two readings.** An AI reader that never saw the first transcription read each section again, and the two were compared.
- **The figures.** ArcKit keeps a table of 84 figures and named standards from the pack. A separate AI reader checked each against a picture of its page. All 84 matched.
- **A builder and a reviewer.** One AI agent built each piece and a separate one tried to break it. It tried 15 kinds of edit to a signed document, and each one ended the sign-off.
- **Live runs.** The commands were run more than 20 times against the invented café, and judged on what they did to the files.

No real business has used it yet. That's why it's marked experimental.

## Help wanted

I'm looking for a food safety co-maintainer. If you're an environmental health practitioner or a food safety consultant, please [open an issue](https://github.com/tractorjuice/arc-kit/issues) tagged `co-maintainer: uk-food`.

## For existing ArcKit users

Also in 6.23.0:

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

The overlay is switched off when it's installed, so the second line switches it on. The [overview guide](https://arckit.org/guide/uk-food-safety-overlay.html) covers the order to work in, special processes and what to do when the pack doesn't fit your business.

Already using ArcKit? Run `claude plugin update arckit@arckit-claude`.

---

*ArcKit is MIT licensed and maintained at [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit). The full list of changes is in the [6.23.0 release notes](https://github.com/tractorjuice/arc-kit/releases/tag/v6.23.0).*

*The overlay is built on Safer food, better business for caterers, published by the Food Standards Agency. Contains public sector information licensed under the Open Government Licence v3.0.*

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
