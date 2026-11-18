# UK Food Safety Overlay

> **Overlay**: `arckit-uk-food` | **Covers**: England and Wales | **Status**: Experimental, community-maintained, switched off until you enable it

The UK Food Safety Overlay helps a small catering business in England or Wales build its food safety documents from the Food Standards Agency's free pack, *Safer food, better business for caterers*. You answer the pack's questions in ordinary conversation. The overlay puts the pack's own wording, unchanged, beside your answers, and a named person at the business signs each document off.

It is for cafés, takeaways, restaurants, pubs, mobile caterers and similar small food businesses, and for the people who help them. You do not need to be technical: you type to an assistant, and it asks the questions.

## Not legal advice

This overlay is not legal advice. The food business operator is responsible for the safety of the food the business sells and for keeping its own records. Your council's environmental health team is the authority for your premises: ask them if you are not sure about anything. The Food Standards Agency has not reviewed or endorsed this overlay or anything it produces, and no council has either.

The overlay is experimental and community-maintained, and no food safety professional has reviewed it yet. Treat everything it produces as a draft that you, the business owner, must read and confirm.

## The source pack

| | |
|---|---|
| Title | *Safer food, better business for caterers* |
| Publisher | Food Standards Agency |
| Published at | <https://www.gov.uk/government/publications/safer-food-better-business-for-caterers> |
| Retrieved | 17 November 2026 |

Contains public sector information licensed under the Open Government Licence v3.0.

The pack's wording is bundled with the overlay, so the documents are built on your own computer with no internet connection needed. The overlay does not use the pack's pictures or the Food Standards Agency's logo. The overlay's own code and files are MIT licensed.

## How it works

**Worksheets hold your answers.** Each section of the pack, the business profile and your own methods has a worksheet in your project's `food-safety` folder. It lists every question, and under each one the answer, its state, who gave it and when.

**An answer counts only when a named person gives it.** Each answer is in one of three states:

- *unanswered*: nobody has answered it yet;
- *proposed*: it came from a file you pointed to, or from a message that named nobody, and nobody has agreed it yet;
- *confirmed*: a named person at the business gave it or agreed it, and their name and the date are recorded.

Only confirmed answers reach your documents. Everywhere else, the document reads **NOT YET ANSWERED**. Nothing ever takes a default, and the assistant never suggests an answer: a document built from the worksheets is the business's own statement of what it does.

**A script builds each document, and checks it.** The overlay's helper script prints the body of each document from the pack's wording and your confirmed answers. Nobody types the pack's text, so a word or a figure cannot be changed on the way in. After every write, the script checks that the document still matches a fresh print. The script runs on your computer, needs only Node, and sends nothing anywhere.

**A named person signs each document off.** When a document is finished, a named person at the business reads it and signs it off. The sign-off records their name, their role and the version they read. Until then, every document's status is `DRAFT`. After it, the status is `APPROVED`, which here means only that a named person at the business signed it off.

**The completion record shows where things stand.** It is the pack's own record of which safe methods have been worked through, filled in from your documents and sign-offs, followed by a list of everything still unfinished.

## Installing it

The overlay needs the ArcKit core plugin and Claude Code 2.1.319 or later. It is switched off when it is installed, so switch it on as well:

```bash
claude plugin install arckit-uk-food --marketplace tractorjuice/arckit-claude
claude plugin enable arckit-uk-food
```

The first line also installs ArcKit core if you have not installed it.

## The order to work in

| Step | Command | What it does | Guide |
|---|---|---|---|
| 1 | `/arckit-uk-food:uk-food-profile` | Records the business profile: who runs it, where it is, what it sells, its equipment and staff, and whether it does any special process or food that needs extra care | [Business profile](uk-food-profile.md) |
| 2 | `/arckit-uk-food:uk-food-safe-methods` | Works through one of the five sections of safe methods with you, one safe method at a time | [Safe methods](uk-food-safe-methods.md) |
| 3 | `/arckit-uk-food:uk-food-own-methods` | Records your own controls that the pack does not cover, and your written procedure for any special process, word for word | [Own methods](uk-food-own-methods.md) |
| Any time | `/arckit-uk-food:uk-food-check` | Shows what is finished and what is still waiting, and writes the completion record | [Where things stand](uk-food-check.md) |
| Last | `/arckit-uk-food:uk-food-sign-off` | Records that a named person has read a finished document and confirms it | [Sign-off](uk-food-sign-off.md) |

Start with the profile, then work through the five sections (cross-contamination, cleaning, chilling, cooking and management) in any order, then add your own methods. You can stop at any point and carry on later: nothing confirmed is lost.

Sign the documents off once all of them are finished, and sign the profile off last. A change to the profile puts every other document out of step, because each of them is built partly from it. A change to any section or to your own methods puts the profile out of step, because the profile lists the safe methods and your own methods. A document that goes out of step after it was signed off is written again as a new version, and that version needs signing off again.

The documents land in your project folder, for example:

```text
projects/001-bramble-cafe/
  food-safety/
    answers-profile.md  answers-XC.md  answers-CL.md  answers-CH.md
    answers-CK.md  answers-MG.md  answers-own.md  sign-offs.json
  ARC-001-FOODPROF-v1.0.md   the business profile
  ARC-001-FOODXC-v1.0.md     cross-contamination
  ARC-001-FOODCLN-v1.0.md    cleaning
  ARC-001-FOODCHL-v1.0.md    chilling
  ARC-001-FOODCOOK-v1.0.md   cooking
  ARC-001-FOODMGT-v1.0.md    management
  ARC-001-FOODOWN-v1.0.md    your own methods
  ARC-001-FOODCMP-v1.0.md    the completion record
```

## When the pack does not fit your business

The pack is written for most small caterers. Where it does not fit yours, you decide, and the overlay records your decision in your words.

- **A safe method is not relevant** to your business, because it covers something you never do. Tell the assistant why. It records your reason, and your name as the person who decided.
- **You do a safe method differently.** Tell the assistant four things: what the business does instead, why, how you know your way works, and who decided. Until all four are given, the safe method stays as it is in the pack.
- **You have a control of your own** that the pack does not cover. `/arckit-uk-food:uk-food-own-methods` records it: what could go wrong, what you do about it, how you check it and what you do if it fails, and any limit you work to with where that figure comes from.

The assistant may point out that a safe method sounds not relevant from what you have said, but it never decides for you.

## Special processes and your council

The pack names some processes and foods that need extra care, and the profile asks whether the business does each one. This overlay does not write a procedure for any of them, and will not finish, correct or improve one, even if you ask. A procedure written by a tool would be a control that nobody at the business has tested.

If the business does a special process:

1. Contact your council's environmental health team about it.
2. Write your own procedure for it.
3. Record it with `/arckit-uk-food:uk-food-own-methods`, which keeps it word for word and notes that the council's review is pending.
4. When the council replies, run the command again to record the date and what they said.

The own methods document cannot be signed off until each special process the profile confirms has its entry.

## Building the drafts in one go

The overlay ships a build recipe, `uk-food-sfbb`, for ArcKit's build command in Claude Code. A build has nobody to answer, and only an answer a named person gives can be confirmed, so **a build confirms nothing**. It makes the worksheets that are missing and writes the draft documents from the answers already confirmed. On a new project, every answer in them reads NOT YET ANSWERED. A build never signs anything off. Do not expect a finished pack from it: the answers come from running the commands above with the person who knows the business.

The recipe builds the profile, the five sections and the completion record. Your own methods are left out by default: with no entries, that document is too short for the build's checks, so record your own methods with the command instead.

Run the profile command once first, so the project exists. Then, for project `001`:

```text
/arckit:build 001 --recipe uk-food-sfbb
```

## What it does not cover

- **Scotland and Northern Ireland.** The pack, and this overlay, cover England and Wales only. If the profile says the business is anywhere else, the documents say so plainly.
- **Other kinds of food business.** The overlay uses the pack for caterers only. The Food Standards Agency's other packs, for retailers, childminders, care homes and other cuisines, are not covered.
- **The daily diary.** The diary stays with you, on paper or however the business keeps it today. The overlay does not keep it.
- **Procedures for special processes.** See above.
- **The pack's formatting.** Bold and underlining in the pack are not carried into the documents. The words are.
- **One layout detail.** On two pages, the pack prints its line about noting a problem in your diary after a later box. The documents print that line with the box about what to do when things go wrong.
- **Places where the pack disagrees with itself.** In two places the pack says the same thing in two different ways. The documents print each place exactly as the pack prints it, and the overlay does not choose between them. If one of these matters to you, read both places in the pack and ask your council's environmental health team. Maintainers can find both places in the limits check sheet that [`scripts/uk-food/render-limits-check.py`](../../scripts/uk-food/render-limits-check.py) prints, and in the [differences note](../../plugins/arckit-uk-food/data/sfbb-caterers-2026-11-17/differences.md) bundled with the data.

## What is planned

These are planned. They are not in the overlay yet, and there are no dates.

- Allergens.
- The cleaning schedule.
- Blank diary and record sheets.
- Training records.
- The pack's regular review of the diary.

## If a check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in a document, and the check will then fail. The fix is to run the document's command again, not to edit those lines by hand: changes belong in the worksheet.

## Other tools

Claude Code names the commands as above. The other tools ArcKit supports name them their own way: for example `$arckit-uk-food-profile` in Codex and `/arckit-uk-food-profile` in GitHub Copilot.

## Help wanted: a food safety co-maintainer

The overlay is looking for a food safety co-maintainer. If you are an environmental health practitioner or a food safety consultant, please open an issue at <https://github.com/tractorjuice/arc-kit/issues> tagged `co-maintainer: uk-food`. Until someone with that background has reviewed the overlay, treat everything it produces as a draft that the business owner must read and confirm.
