# ArcKit — UK Food Safety Overlay

`[COMMUNITY]` — **EXPERIMENTAL**. This overlay is maintained by the community, is switched off by default, and has not been reviewed by a food safety professional. Read "Not legal advice" below before you use it.

## What it is for

A small catering business in England or Wales has to keep food safety management documents. The Food Standards Agency (FSA) publishes a free pack for this, *Safer food, better business for caterers*. This overlay helps a business turn that pack into a set of documents of its own: its own answers, its own methods, and a named person who has read them and confirmed them.

It is for small caterers (cafes, takeaways, restaurants, pubs, mobile caterers and similar) in England and Wales. It is also for the people who maintain it. It does not cover Scotland or Northern Ireland, and it does not cover the FSA's other packs (retailers, childminders, care homes and other cuisines).

## What it produces today

- A business profile.
- The five sections of safe methods from the pack: cross-contamination, cleaning, chilling, cooking and management.
- The business's own additional methods.
- A completion record that says what is finished, what is still waiting for an answer, and what has been signed off.
- Sign-off by a named person, recorded with their name, role and the version they confirmed.

## What later plans will add

These are planned. They are not in this overlay yet, and there are no dates.

- Allergens.
- The cleaning schedule.
- Blank diary and record sheets.
- Training records.
- The 4-weekly review.

## How it works

The pack's wording is bundled with the overlay and is never rewritten. The business's answers live in worksheets, and nothing counts until a named person confirms it: an answer that is blank or only suggested is shown as not yet answered. The documents are built from the worksheets by a script, which prints the pack's wording unchanged, and a second check proves the document still matches what the script builds. A named person then signs off each finished document.

## Commands

In Claude Code the commands carry the overlay's name:

| Command | What it does | Document it writes |
|---|---|---|
| `/arckit-uk-food:uk-food-profile` | Records the business's profile: who runs it, where it is, what it sells, its equipment and staff, and whether it does any special process. | Business profile (`FOODPROF`) |
| `/arckit-uk-food:uk-food-safe-methods` | Works through one section of safe methods with you, one safe method at a time. Name the section by its code (`XC`, `CL`, `CH`, `CK` or `MG`) or by its name; with none, it takes the first one that is unfinished. | Cross-contamination (`FOODXC`), cleaning (`FOODCLN`), chilling (`FOODCHL`), cooking (`FOODCOOK`) or management (`FOODMGT`) |
| `/arckit-uk-food:uk-food-own-methods` | Records the business's own methods, and the written procedure for any special process, word for word. | Own methods (`FOODOWN`) |
| `/arckit-uk-food:uk-food-check` | Shows what is finished and what is still waiting, and writes the completion record. | Completion record (`FOODCMP`) |
| `/arckit-uk-food:uk-food-sign-off` | Records that a named person has read a finished document and confirms it, with their name, role and the version they confirmed. | None: it marks the signed document's header |

Start with the profile, then work through the five sections in any order, then add your own methods. Run the check whenever you want to see where things stand. The commands ask their questions in conversation and record only what you tell them, with your name and the date; an answer nobody has given shows in the documents as not yet answered. The commands run the overlay's helper script, which needs Node.

The other tools ArcKit supports name the commands their own way: for example `$arckit-uk-food-profile` in Codex and `/arckit-uk-food:uk-food-profile` in Gemini and OpenCode.

## What it does not do

- It does not keep the daily diary. The diary stays with people, on paper or in whatever the business uses today.
- It does not write procedures for special processes. If a business has its own, it records them word for word, and the business should contact its council's environmental health team about them.
- It does not carry the pack's bold and underlining into documents. The words are carried over; the formatting is not.
- It does not use the pack's pictures or the FSA's logo.
- It does not change the pack's wording to settle differences inside the pack. Where the pack says two things in two places, the documents print each place as the pack prints it. Maintainers can see the differences in the bundled note under `data/sfbb-caterers-2026-11-17/differences.md`.

## Not legal advice

This overlay is not legal advice. The food business operator is responsible for the safety of the food it sells and for keeping its own records. The council's environmental health team is the authority for a business's premises: ask them if you are not sure. Nothing this overlay produces has been approved, inspected or endorsed by the FSA or by any council.

## Requires arckit core plugin

```bash
claude plugin install arckit-uk-food --marketplace tractorjuice/arckit-claude
```

This adds the `arckit-claude` marketplace if you haven't added it and installs `arckit` (core) with the plugin. It needs Claude Code 2.1.275 or later.

Without `arckit` (core), the document codes (`FOODPROF`, `FOODXC`, `FOODCLN`, `FOODCHL`, `FOODCOOK`, `FOODMGT`, `FOODOWN`, `FOODCMP`) are not recognised by the file-name check.

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
