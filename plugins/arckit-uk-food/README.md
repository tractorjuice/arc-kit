# ArcKit — UK Food Safety Overlay

`[COMMUNITY]` — **EXPERIMENTAL**. This overlay is maintained by the community, is switched off by default, and has not been reviewed by a food safety professional. Read "Not legal advice" below before you use it.

## What it is for

A small catering business in England or Wales has to keep food safety management documents. The Food Standards Agency (FSA) publishes a free pack for this, *Safer food, better business for caterers*. This overlay helps a business turn that pack into a set of documents of its own: its own answers, its own methods, and a named person who has read them and confirmed them.

It is for small caterers (cafes, takeaways, restaurants, pubs, mobile caterers and similar) in England and Wales. It is also for the people who maintain it. It does not cover Scotland or Northern Ireland, and it does not cover the FSA's other packs (retailers, childminders, care homes and other cuisines).

## What it produces today

Twelve documents, written by eight of its nine commands; the ninth records sign-off:

- A business profile.
- The five sections of safe methods from the pack: cross-contamination, cleaning, chilling, cooking and management.
- The business's own methods, and its written procedure for any special process, word for word.
- Its allergen information: each dish against the fourteen allergens, from the labels, product specifications and suppliers' statements the business gives.
- Its cleaning schedule, on the pack's form, in the business's own words.
- Its suppliers and contacts, on the pack's forms, in the business's own words: its suppliers, its council's environmental health team and its other contacts.
- The pack's diary and record sheets, blank, for people at the business to print or copy, fill in and sign by hand.
- A completion record that says what is finished, what is still waiting for an answer, and what has been signed off.

A named person signs off the profile, each of the five sections, the own methods, the allergen information, the cleaning schedule and the suppliers and contacts, and the sign-off records their name, role and the version they confirmed. Nobody signs off the completion record, which is a report, or the diary and record sheets, which are blank forms: their pages are signed by the people who fill them in.

## What later plans will add

Every safe method in the pack is in the five section documents now, training (MG-05 TRAINING AND SUPERVISION) among them. Two parts of the pack are planned, and there are no dates:

- The pack's STAFF TRAINING RECORD, with training material.
- The pack's regular review of the diary.

## How it works

The pack's wording is bundled with the overlay and is never rewritten. The business's answers live in worksheets, and nothing counts until a named person confirms it: an answer that is blank or only proposed is shown as not yet answered, and a dish or an entry in a list that nobody has confirmed is shown as not yet confirmed. The documents are built from the worksheets by a script, which prints the pack's wording unchanged, and a second check proves the document still matches what the script builds, and that its header does not say it is signed off when no sign-off is recorded. A named person then signs off each finished document, except the completion record and the diary and record sheets, which nobody signs. A sign-off covers the document exactly as it reads when it is signed, the whole file: a line of that document added or changed afterwards ends it. Only two changes do not: the sign-off command writing the sign-off into the header, and ArcKit rewriting its own Build Provenance section at the foot of the file. The paragraph on signing off, below, says what else does.

## Commands

In Claude Code the commands carry the overlay's name:

| Command | What it does | Document it writes |
|---|---|---|
| `/arckit-uk-food:uk-food-profile` | Records the business's profile: who runs it, where it is, what it sells, its equipment and staff, and whether it does any special process. | Business profile (`FOODPROF`) |
| `/arckit-uk-food:uk-food-safe-methods` | Works through one section of safe methods with you, one safe method and one question at a time. Name the section by its code (`XC`, `CL`, `CH`, `CK` or `MG`) or by its name; with none, it takes the first one that still needs answers or needs writing. | Cross-contamination (`FOODXC`), cleaning (`FOODCLN`), chilling (`FOODCHL`), cooking (`FOODCOOK`) or management (`FOODMGT`) |
| `/arckit-uk-food:uk-food-own-methods` | Records the business's own methods, and the written procedure for any special process, word for word. | Own methods (`FOODOWN`) |
| `/arckit-uk-food:uk-food-allergens` | Records the business's allergen information, one dish and one detail at a time: what goes into each dish and, for each of the fourteen allergens, whether it contains it. "Contains" comes only from the labels, product specifications and suppliers' statements the business gives, or a named person's look at a single whole food; "does not contain" only as the named person's own statement, made in conversation after the command has shown what it found, or in so many words in the message that starts it. A dish counts only once a named person who is there has been shown it whole and agreed it. It never works an allergen out from a dish's name, looks nothing up, and never says a dish is free from anything or suitable for anyone. | Allergen information (`FOODALG`) |
| `/arckit-uk-food:uk-food-cleaning-schedule` | Records the business's cleaning schedule on the pack's form, one item and one detail at a time, in the business's own words: how often each item is cleaned, what to take care over and how it is cleaned. It suggests none of it. | Cleaning schedule (`FOODCS`) |
| `/arckit-uk-food:uk-food-suppliers` | Records the business's suppliers, its council's environmental health team and its other contacts on the pack's forms, one entry and one detail at a time, in the business's own words. It looks nobody up. | Suppliers and contacts (`FOODSUP`) |
| `/arckit-uk-food:uk-food-record-sheets` | Writes the pack's blank diary cover, opening and closing checks (with the business's own checks from its Management safe methods, once confirmed), a week page to print or copy for each week, and its prove it records, for people at the business to fill in and sign by hand. It asks nothing about the forms, fills in no form, and is never signed off. Running it again prints the forms afresh. Outside the forms it changes only the file's Last Modified date and any sign-off cell holding something else, which it puts back to `DRAFT` or `[PENDING]` and tells you what that cell held; everything else in the file, a note someone added included, it leaves as it is. Once someone has typed into its forms, it writes nothing over them until the person running it says that what was typed has been copied or is not wanted, and a build never does. | Diary and record sheets (`FOODREC`) |
| `/arckit-uk-food:uk-food-check` | Shows what is finished and what is still waiting, and writes the completion record. | Completion record (`FOODCMP`) |
| `/arckit-uk-food:uk-food-sign-off` | Records that a named person has read a finished document and confirms it, with their name, role and the version they confirmed. | None: it marks the signed document's header |

Start with the profile, then work through the five sections in any order, then add your own methods. Your allergen information, cleaning schedule and suppliers and contacts can come in any order after the profile; the allergen information repeats your answers in the Management section on how customers are told about allergens, so answer those there. Write the diary and record sheets once the profile has the business's name, and again after you add your own opening and closing checks in the Management section. Run the check whenever you want to see where things stand.

The commands that gather answers ask their questions in conversation. An answer counts only when a named person at the business gives or confirms it, and is recorded with their name and the date; anything else, including an answer taken from a file or from a request that names nobody, shows in the documents as not yet answered, with what was proposed and where it came from beside it. In the cleaning schedule and the suppliers and contacts, an entry counts once a named person confirms it as shown, or sets it out in so many words, having said who they are, in the message that starts the command. In the allergen information, a dish counts only once a named person who is there has been shown it whole and agreed it, even one set out in full in the message that starts the command. Until then the document names the dish or the entry as not yet confirmed and leaves its details out. The commands run the overlay's helper script, which needs Node.

Sign each document off when it is finished, and sign the profile off last. The completion record and the diary and record sheets are never signed off. A sign-off lasts until what that document says changes, and changing an answer changes only the documents that print it. The business's name is printed in every document, so a change to it changes them all, and so does a change of nation into or out of England and Wales. The profile also lists each safe method's status, and your own methods by name, kind and environmental health review, so it changes when any of those does; anything else you change in one of your own methods changes the own methods document only. The allergen information prints your answers in the Management section on how customers are told about allergens, so it changes when they do. There is one exception: your own methods document needs an entry for every special process or food the profile says you do, so answering yes to a new one in the profile puts own methods back to unfinished until that entry is recorded. A signed-off document whose answers have changed is written again as a new version, and that version needs signing off.

The first command makes the business's project folder, with a short README in it that says what the folder is, where the worksheets and documents are and which command to run next. The project folder holds the names of the people who work in the business. Keep it somewhere private, and if it is a git repository that is pushed anywhere, keep that private too. The assistant you run the commands in also keeps its own record of each session on the computer, outside the project folder. In Claude Code that is the `.claude` folder in your home folder. The record holds what the commands read and wrote, names included, so treat that computer as private too.

If a later version of the overlay changes the wording of a worksheet's guidance or questions, a worksheet filled in earlier is reported as made by a different version. The commands then show each line that would be taken out or put in, and write them only when a person agrees: with nobody to ask, nothing is written. The helper's `upgrade-worksheet` does the work, changes no answer and keeps the worksheet as it was. Before it writes, it checks that the lines under each question's heading hold the words that identify that question: the pack's own words for it, which do not change within one edition of the pack, or, for a profile question that names no special process or food, the question itself, as this version words it or as an earlier version did. It refuses when they are another question's (a heading that has been moved) or no question's (lines typed over, or wording this version does not know).

The other tools ArcKit supports name the commands their own way: for example `$arckit-uk-food-profile` in Codex and `/arckit-uk-food-profile` in GitHub Copilot.

## Guides

Each command has a guide written for the person running the business: [business profile](docs/guides/uk-food-profile.md), [safe methods](docs/guides/uk-food-safe-methods.md), [own methods and special processes](docs/guides/uk-food-own-methods.md), [allergen information](docs/guides/uk-food-allergens.md), [cleaning schedule](docs/guides/uk-food-cleaning-schedule.md), [suppliers and contacts](docs/guides/uk-food-suppliers.md), [diary and record sheets](docs/guides/uk-food-record-sheets.md), [where things stand](docs/guides/uk-food-check.md) and [sign-off](docs/guides/uk-food-sign-off.md). The [overlay guide](https://arckit.org/guide/uk-food-safety-overlay.html) explains how it all fits together, the order to work in and what the overlay does not cover.

## Build recipe

Recipe: `uk-food-sfbb` (the business profile, the five sections of safe methods, the business's own methods, the allergen information, the cleaning schedule, the suppliers and contacts, the blank diary and record sheets, and the completion record). A build has nobody to answer, and its prompts give no named person's answers, so it confirms nothing: it makes the worksheets that are missing and writes each document that does not exist yet as a draft, from the answers a named person has already confirmed. A document that is already there is taken as done and left as it is: the build writes it again only if you name its target with `--refresh`, or a document it is built after has changed since the last build. To bring one document up to date with answers confirmed since, run its own command. On a new project every answer in the documents reads NOT YET ANSWERED, and a build never signs anything off. Run the profile command once before a build, so the project exists. The build makes a git commit after each wave; a business's records folder is rarely a git repository, so run it with `--no-commit` unless yours is one. The recipe has no post-build step: ArcKit's health check is written for architecture documents. For these documents only the sign-off command changes a document's status, and ArcKit's notices about old drafts leave them out.

## What it does not do

- It does not keep the daily diary. The diary stays with people, on paper or in whatever the business uses today. The record sheets command prints the diary's blank pages; people at the business fill them in.
- It does not work out allergens. It marks "contains" only from the labels, product specifications and suppliers' statements the business gives, or a named person's look at a single whole food, and "does not contain" only as a named person's own statement. It never looks a product up, never says a dish is free from anything or suitable for anyone, and never suggests or rewords a "free from" statement.
- It does not suggest what to clean, how or how often, and it does not look up a supplier, a council or any other contact. The cleaning schedule and the suppliers and contacts record what the business says.
- It does not write procedures for special processes. If a business has its own, it records them word for word, and the business should contact its council's environmental health team about them.
- It does not carry the pack's bold and underlining into documents. The words are carried over; the formatting is not.
- It does not use the pack's pictures or the FSA's logo.
- It does not change the pack's wording to settle differences inside the pack. Where the pack says two things in two places, the documents print each place as the pack prints it: in CK-06 HOT HOLDING, one limit is worded two slightly different ways, and CH-01 CHILLED STORAGE AND DISPLAYING CHILLED FOOD and CK-07 READY-TO-EAT FOOD describe differently which ready-to-eat foods one of their limits covers. Maintainers can find both places, with their pages, in the limits check sheet printed by `scripts/uk-food/render-limits-check.py` in the ArcKit source repository.
- Its build recipe, `uk-food-sfbb`, passes the repository's recipe checks. ArcKit's build planned its first eight targets in a dry run; the four added since (the allergen information, the cleaning schedule, the suppliers and contacts, and the diary and record sheets) have not yet been planned by it, and the recipe has not yet been run end to end.

## For maintainers

The bundled data under a data identifier never changes once it has shipped, and neither does the wording a worksheet or document prints from it. A business holds worksheets and signed-off documents made from that data, and a change would quietly make them out of date. A correction ships under a new data identifier, together with the upgrade a business then needs to bring its own worksheets across. `tests/plugin/uk-food-frozen.test.mjs` holds the first release's blank worksheets and documents to this.

The three list worksheets (`allergens`, `cleaning` and `suppliers`) and the four documents added since the first release (`FOODALG`, `FOODCS`, `FOODSUP` and `FOODREC`) are not in that test yet. No release has shipped them, and a ruling that changes their wording may still be overturned before one does. Their wording freezes the day a release first ships them, for the same reasons, so they are added to the test in the last commit before that release.

## Not legal advice

This overlay is not legal advice. The food business operator is responsible for the safety of the food it sells and for keeping its own records. The council's environmental health team is the authority for a business's premises: ask them if you are not sure. Nothing this overlay produces has been approved, inspected or endorsed by the FSA or by any council.

## Requires arckit core plugin

```bash
claude plugin install arckit-uk-food --marketplace tractorjuice/arckit-claude
claude plugin enable arckit-uk-food
```

This adds the `arckit-claude` marketplace if you haven't added it and installs `arckit` (core) with the plugin. The overlay is switched off when it is installed, so the second line switches it on. It needs Claude Code 2.1.319 or later.

Without `arckit` (core), the document codes (`FOODPROF`, `FOODXC`, `FOODCLN`, `FOODCHL`, `FOODCOOK`, `FOODMGT`, `FOODOWN`, `FOODALG`, `FOODCS`, `FOODSUP`, `FOODREC`, `FOODCMP`) are not recognised by the file-name check.

## Source and licence

- Title: *Safer food, better business for caterers*
- Publisher: Food Standards Agency
- Published at: <https://www.gov.uk/government/publications/safer-food-better-business-for-caterers>
- Retrieved: 17 November 2026

Contains public sector information licensed under the Open Government Licence v3.0.

The Food Standards Agency has not reviewed or endorsed this overlay. The code and the overlay's own files are MIT licensed.

## Data

This overlay adds commands, templates, bundled data and a helper script. The helper script runs on your computer, needs only Node, and sends nothing anywhere. It has no hooks and no MCP servers. Its commands run in Claude alongside the `arckit` core plugin, whose README lists what that plugin sends and when. Privacy policy: <https://arckit.org/privacy.html>.

## Maintainer

`[COMMUNITY]` — **EXPERIMENTAL**. Recruiting a food safety co-maintainer. Help wanted: if you are an environmental health practitioner or a food safety consultant, please open an issue at <https://github.com/tractorjuice/arc-kit/issues> tagged `co-maintainer: uk-food`. Until someone with that background has reviewed it, treat everything this overlay produces as a draft that the business owner must read and confirm.
