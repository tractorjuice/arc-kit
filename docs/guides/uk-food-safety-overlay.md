# UK Food Safety Overlay

> **Overlay**: `arckit-uk-food` | **Covers**: England and Wales | **Status**: Experimental, community-maintained, switched off until you enable it

The UK Food Safety Overlay helps a small catering business in England or Wales build its food safety documents from the Food Standards Agency's free pack, *Safer food, better business for caterers*. You answer the pack's questions in ordinary conversation. The overlay puts the pack's own wording, unchanged, beside your answers, and a named person at the business signs each document off.

It is for cafés, takeaways, restaurants, pubs, mobile caterers and similar small food businesses, and for the people who help them. Setting it up is a one-off job for someone comfortable installing software and typing a command in a terminal: see [Getting started](#getting-started). After that, you type to an assistant in ordinary words, and it asks the questions.

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

**A few words first.** The pack is in five sections, and each section is made of *safe methods*: each covers one topic, sets out the pack's safety points, and asks what your business does. ArcKit keeps each business's records in a *project*: a numbered folder such as `projects/001-bramble-cafe/`. Your documents are *Markdown* files: plain text with a little formatting, which any text editor or Markdown viewer can open and print.

**Worksheets hold your answers.** Each section of the pack, the business profile and your own methods has a worksheet in your project's `food-safety` folder. It lists every question, and under each one the answer, its state, who gave it and when.

**An answer counts only when a named person gives it.** Each answer is in one of three states:

- *unanswered*: nobody has answered it yet;
- *proposed*: it came from a file you pointed to, or from a message that named nobody, and nobody has agreed it yet;
- *confirmed*: a named person at the business gave it or agreed it, and their name and the date are recorded.

Only a confirmed answer is printed in your documents as the business's answer. A proposed answer is shown beside **NOT YET ANSWERED**, with where it came from, so you can see what is waiting for you, and a question nobody has answered reads **NOT YET ANSWERED** on its own. Nothing ever takes a default, and the assistant never suggests an answer: a document built from the worksheets is the business's own statement of what it does.

**A script builds each document, and checks it.** The overlay's helper script prints the body of each document from the pack's wording and your answers: a confirmed answer as the business's own, a proposed one beside **NOT YET ANSWERED** with where it came from. The pack's wording was typed into the overlay once, from the pack, and checked against it. After every write, the script runs the *document check*. It proves that the body of the document, the part between its two `UK-FOOD` marker lines, still matches a fresh print from that bundled copy and your worksheets, so a change to the pack's wording or to your answers on the way into the document is caught. It also fails a document whose header says it is signed off when no sign-off is recorded. The rest of the file (its title, header and footer) is not compared with anything until the document is signed off; from then on, the sign-off covers the whole file. The script runs on your computer, needs only Node, and sends nothing anywhere.

**A named person signs each document off.** When a document is finished, a named person at the business reads it and signs it off. The sign-off records their name, their role and the version they read. Until then, every document's status is `DRAFT`. After it, the status is `APPROVED`, which here means only that a named person at the business signed it off. A sign-off covers the document exactly as it reads when it is signed. If a line of it changes afterwards, in the body or anywhere else in the file, the sign-off no longer counts. `/arckit-uk-food:uk-food-check` and the completion record then say so. The header inside the changed file still reads `APPROVED`, because nothing rewrites a signed file, so go by the check and not by that header.

**You can change what you have recorded.** Run the command again and say what has changed: an answer, a safe method you now do differently, or one of your own methods. The change is recorded in your words, with your name and the date, and nothing else is changed.

**The completion record shows where things stand.** It is the pack's own record of which safe methods have been worked through, filled in from your documents and sign-offs, followed by a list of everything still unfinished.

## Getting started

Setting up is done once, by someone comfortable installing software and typing commands in a terminal. After that, you type to the assistant in ordinary words.

1. **Install Claude Code, and Node.** ArcKit's [getting-started page](https://arckit.org/getting-started.html) shows how to install Claude Code. This overlay needs Claude Code 2.1.319 or later, and Claude Code needs a Claude account to sign in with. Node is the free program the overlay's helper script runs on, from [nodejs.org](https://nodejs.org/).
2. **Make a folder for the business's records**, such as `bramble-cafe-food-safety`. The commands keep everything in a `projects` folder inside it.
3. **Install the overlay and switch it on.** In a terminal, run:

   ```bash
   claude plugin install arckit-uk-food --marketplace tractorjuice/arckit-claude
   claude plugin enable arckit-uk-food
   ```

   The first line adds ArcKit's marketplace if it is not there yet, and installs ArcKit core with the overlay. The overlay is switched off when it is installed, so the second line switches it on.
4. **Start Claude Code in the records folder.** In the terminal, go to that folder and type `claude`. The commands keep your records in the folder Claude Code was started in, so always start it there.
5. **Run the first command.** Type `/arckit-uk-food:uk-food-profile` followed by the business's name, and say who you are and your role. The assistant takes it from there.

## The order to work in

| Step | Command | What it does | Guide |
|---|---|---|---|
| 1 | `/arckit-uk-food:uk-food-profile` | Records the business profile: who runs it, where it is, what it sells, its equipment and staff, and whether it does any special process or food that needs extra care | [Business profile](uk-food-profile.md) |
| 2 | `/arckit-uk-food:uk-food-safe-methods` | Works through one of the five sections of safe methods with you, one safe method at a time | [Safe methods](uk-food-safe-methods.md) |
| 3 | `/arckit-uk-food:uk-food-own-methods` | Records your own controls that the pack does not cover, and your written procedure for any special process, word for word | [Own methods](uk-food-own-methods.md) |
| Any time | `/arckit-uk-food:uk-food-check` | Shows what is finished and what is still waiting, and writes the completion record | [Where things stand](uk-food-check.md) |
| Last | `/arckit-uk-food:uk-food-sign-off` | Records that a named person has read a finished document and confirms it | [Sign-off](uk-food-sign-off.md) |

Start with the profile, then work through the five sections (cross-contamination, cleaning, chilling, cooking and management) in any order, then add your own methods. You can stop at any point and carry on later: nothing confirmed is lost.

Sign each document off when it is finished, and sign the profile off last. A sign-off lasts until what that document says changes, and changing an answer changes only the documents that print it. Two things are worth knowing. The business's name is printed in every document, so changing it changes them all; so does changing the nation to or from one outside England and Wales, because every document then says so. And the profile lists each safe method's status (whether it applies, is not relevant or is done differently, with the reason and who decided) and your own methods by name, kind and environmental health review, so it changes when any of those does. That is why the profile goes last. Anything else you change in one of your own methods changes the own methods document only. There is one exception to all this: your own methods document needs an entry for every special process or food the profile says you do. If you answer yes to one that has no entry yet, own methods goes back to unfinished, though nothing in it has changed. Record the entry, and the document is written again: in place if nobody had signed it off, and as a new version to sign off if somebody had. A signed-off document whose answers have changed is written again as a new version, and that version needs signing off.

The documents land in your project folder, for example:

```text
projects/001-bramble-cafe/
  README.md                  what the folder is, and what to run next
  external/                  documents of your own for the assistant to read
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

The first command makes this folder, with a short note in it for you: what the folder is, where the worksheets and documents are, and which command to run next. The project folder holds the names of the people who work in the business. Keep it somewhere private, and if it is a git repository that is pushed anywhere, keep that private too.

**If a later version of the overlay words things differently.** Each worksheet carries the overlay's own guidance at the top, and the wording of each question on lines that start with `>`. When a newer version of the overlay changes that wording, a worksheet you filled in earlier is reported as made by a different version, and its answers stop counting until it is brought up to date. The command you are running then shows you every line it would replace, and asks before it writes anything. Your answers, names and dates are not touched, and the worksheet as it was is kept beside the new one. Anything you typed on one of those lines cannot be told from old wording, so it is shown to you before it is taken out: say so if it is an answer you want kept, and the assistant records it in its proper place.

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
4. When the council replies, run `/arckit-uk-food:uk-food-own-methods` again and give it the date and what they said. It records them in that entry, in your words, and changes no other field. The entry then carries the name of the person who recorded the reply and the date they recorded it, because whoever changes an entry is confirming it as it now stands, procedure included.

The own methods document cannot be signed off until each special process the profile confirms has its entry.

## Building the drafts in one go

The overlay ships a build recipe, `uk-food-sfbb`, for ArcKit's build command in Claude Code. A build has nobody to answer, and only an answer a named person gives can be confirmed, so **a build confirms nothing**. It makes the worksheets that are missing and writes each document that does not exist yet as a draft, from the answers already confirmed. On a new project, every answer in them reads NOT YET ANSWERED. A build never signs anything off.

A document that is already there is taken as done, whatever has been answered since. The build writes it again only if you name its target with `--refresh` (`PROFILE`, `XC`, `CL`, `CH`, `CK`, `MG`, `OWN` or `CHECK`), or if a document it is built after has changed since the last build. To bring one document up to date, run its own command.

Do not expect a finished pack from a build: the answers come from running the commands above with the person who knows the business.

The recipe builds the profile, the five sections, your own methods and the completion record.

Run the profile command once first, so the project exists. The build saves its work with a git commit after each wave of documents; a records folder is rarely a git repository, so add `--no-commit` unless yours is one. For project `001`:

```text
/arckit:build 001 --recipe uk-food-sfbb --no-commit
```

The recipe passes ArcKit's recipe checks, but nobody has yet run it end to end through the build.

ArcKit's notices about drafts that have not changed for a while leave these documents out, and its general health check does not count them as long-running drafts: only the sign-off command changes a document's status, and the completion record always stays a draft. If you give a document a next review date, ArcKit still says when that date has passed. Its health check is written for architecture documents, so the next step it suggests then does not fit these documents: use the overlay's own commands instead.

## What it does not cover

- **Scotland and Northern Ireland.** The pack, and this overlay, cover England and Wales only. If the profile says the business is anywhere else, every document opens by saying so plainly.
- **Other kinds of food business.** The overlay uses the pack for caterers only. The Food Standards Agency's other packs, for retailers, childminders, care homes and other cuisines, are not covered.
- **The daily diary.** The diary stays with you, on paper or however the business keeps it today. The overlay does not keep it.
- **Procedures for special processes.** See above.
- **The pack's formatting.** Bold and underlining in the pack are not carried into the documents. The words are.
- **One layout detail.** On two pages, the pack prints its line about noting a problem in your diary after a later box. The documents print that line with the box about what to do when things go wrong.
- **Places where the pack disagrees with itself.** In two places the pack words the same limit in two different ways. In CK-06 HOT HOLDING, one limit is worded two slightly different ways on the same page. CH-01 CHILLED STORAGE AND DISPLAYING CHILLED FOOD and CK-07 READY-TO-EAT FOOD describe differently which ready-to-eat foods one of their limits covers. The documents print each place exactly as the pack prints it, and the overlay does not choose between them. If one of these matters to you, read both places in your documents and ask your council's environmental health team. Maintainers can find both places, with their pages, in the limits check sheet that [`scripts/uk-food/render-limits-check.py`](../../scripts/uk-food/render-limits-check.py) prints.

## What is there now, and what is planned

Every safe method in the pack is in the five section documents now, including those on allergens (XC-04 FOOD HYPERSENSITIVITY and MG-04 MANAGING FOOD ALLERGEN INFORMATION), the cleaning schedule (CL-04 YOUR CLEANING SCHEDULE), training (MG-05 TRAINING AND SUPERVISION) and suppliers (MG-07 SUPPLIERS AND CONTRACTORS).

What is planned is the rest of the pack: its separate sheets and records, filled in for the business. There are no dates.

- The business's allergen information for each dish. The pack has no separate sheet for this.
- The pack's CLEANING SCHEDULE sheet.
- Blank copies of the pack's diary pages, its OPENING CHECKS, CLOSING CHECKS and EXTRA CHECKS sheet, and its PROVE IT: RECORDS sheet, to print and fill in.
- The pack's SUPPLIERS' LIST and CONTACTS LIST.
- The pack's STAFF TRAINING RECORD, with training material.
- The pack's regular review of the diary.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in a document, and the document check will then fail. The fix is to run the document's command again, not to edit those lines by hand: changes belong in the worksheet.

The documents are not edited by hand anywhere else either. A note added to a signed-off document ends its sign-off, because nobody signed the note. Something the business wants to say about how it works belongs in its own methods, recorded with `/arckit-uk-food:uk-food-own-methods`.

## Other tools

Claude Code names the commands as above. The other tools ArcKit supports name them their own way: for example `$arckit-uk-food-profile` in Codex and `/arckit-uk-food-profile` in GitHub Copilot.

## Help wanted: a food safety co-maintainer

The overlay is looking for a food safety co-maintainer. If you are an environmental health practitioner or a food safety consultant, please open an issue at <https://github.com/tractorjuice/arc-kit/issues> tagged `co-maintainer: uk-food`. Until someone with that background has reviewed the overlay, treat everything it produces as a draft that the business owner must read and confirm.
