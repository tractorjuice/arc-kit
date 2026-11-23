# UK Food Safety Overlay

> **Overlay**: `arckit-uk-food` | **Covers**: England and Wales | **Status**: Experimental, community-maintained, switched off until you enable it

The UK Food Safety Overlay helps a small catering business in England or Wales build its food safety documents from the Food Standards Agency's free pack, *Safer food, better business for caterers*. You answer the pack's questions in ordinary conversation, and list your dishes and their allergens, what you clean, and your suppliers and contacts, in your own words. The overlay puts the pack's own wording, unchanged, beside your answers, and a named person at the business signs the finished documents off. It also gives you the pack's blank diary and record sheets, to print and fill in by hand.

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

**Worksheets hold your answers.** Each section of the pack, the business profile and your own methods has a worksheet in your project's `food-safety` folder. It lists every question, and under each one the answer, its state, who gave it and when. Your allergen information, your cleaning schedule and your suppliers and contacts each have a worksheet too, which holds an entry for each dish, each thing you clean or each supplier and contact, with who confirmed it and when.

**An answer counts only when a named person gives it.** Each answer is in one of three states:

- *unanswered*: nobody has answered it yet;
- *proposed*: it came from a file you pointed to, or from a message that named nobody, or, for a dish in your allergen information, from the message that starts the command or from a label's wording, and nobody has agreed it yet;
- *confirmed*: a named person at the business gave it or agreed it, and their name and the date are recorded.

Only a confirmed answer is printed in your documents as the business's answer. A proposed answer is shown beside **NOT YET ANSWERED**, with where it came from, so you can see what is waiting for you, and a question nobody has answered reads **NOT YET ANSWERED** on its own. In your allergen information, cleaning schedule and suppliers and contacts, a dish or an entry nobody has confirmed is named as not yet confirmed, with its details left out, and in a confirmed dish an allergen that nothing you have given settles reads **NOT CONFIRMED**. Nothing ever takes a default, and the assistant never suggests an answer: a document built from the worksheets is the business's own statement of what it does.

**A script builds each document, and checks it.** The overlay's helper script prints the body of each document from the pack's wording and your answers: a confirmed answer as the business's own, a proposed one beside **NOT YET ANSWERED** with where it came from. The pack's wording was typed into the overlay once, from the pack, and checked against it. After every write, the script runs the *document check*. It proves that the body of the document, the part between its two `UK-FOOD` marker lines, still matches a fresh print from that bundled copy and your worksheets, so a change to the pack's wording or to your answers on the way into the document is caught. It also fails a document whose header says it is signed off when no sign-off is recorded. The rest of the file (its title, header and footer) is not compared with anything until the document is signed off; from then on, the sign-off covers the whole file. The script runs on your computer, needs only Node, and sends nothing anywhere.

**A named person signs each document off.** When a document is finished, a named person at the business reads it and signs it off. The sign-off records their name, their role and the version they read. Until then, every document's status is `DRAFT`. After it, the status is `APPROVED`, which here means only that a named person at the business signed it off. Two documents are never signed off, and always stay `DRAFT`: the completion record, which is a report, and the diary and record sheets, which are blank forms whose pages are signed by the people who fill them in. A sign-off covers the document exactly as it reads when it is signed. If a line of it changes afterwards, in the body or anywhere else in the file, the sign-off no longer counts. `/arckit-uk-food:uk-food-check` and the completion record then say so. The header inside the changed file may still read `APPROVED`: the commands that write documents never rewrite a signed file, and only the sign-off command puts such a header back to `DRAFT`, when it is asked to sign that version and cannot. So go by the check and not by that header.

**You can change what you have recorded.** Run the command again and say what has changed: an answer, a safe method you now do differently, one of your own methods, or a dish, a thing you clean or a supplier or contact. The change is recorded in your words, with your name and the date, and nothing else is changed. A changed dish or entry stops counting until a named person confirms it again. In your allergen information, tell the command when a recipe, an ingredient, a brand or a supplier changes: each dish that may use it stops counting until a named person agrees it again, and a dish that does use it is checked again first.

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
| 2 | `/arckit-uk-food:uk-food-safe-methods` | Works through one of the five sections of safe methods with you, one safe method and one question at a time | [Safe methods](uk-food-safe-methods.md) |
| 3 | `/arckit-uk-food:uk-food-own-methods` | Records your own controls that the pack does not cover, and your written procedure for any special process, word for word | [Own methods](uk-food-own-methods.md) |
| 4 | `/arckit-uk-food:uk-food-allergens` | Records each dish against the fourteen allergens, one dish and one detail at a time, from the labels, product specifications and suppliers' statements you give | [Allergen information](uk-food-allergens.md) |
| 5 | `/arckit-uk-food:uk-food-cleaning-schedule` | Records what you clean, how often, what to take care over and how, one item at a time in your own words | [Cleaning schedule](uk-food-cleaning-schedule.md) |
| 6 | `/arckit-uk-food:uk-food-suppliers` | Records your suppliers, your council's environmental health team and your other contacts, one entry at a time in your own words | [Suppliers and contacts](uk-food-suppliers.md) |
| 7 | `/arckit-uk-food:uk-food-record-sheets` | Gives you the pack's blank diary and record sheets, to print or copy and fill in by hand | [Diary and record sheets](uk-food-record-sheets.md) |
| Any time | `/arckit-uk-food:uk-food-check` | Shows what is finished and what is still waiting, and writes the completion record | [Where things stand](uk-food-check.md) |
| Last | `/arckit-uk-food:uk-food-sign-off` | Records that a named person has read a finished document and confirms it | [Sign-off](uk-food-sign-off.md) |

Start with the profile, then work through the five sections (cross-contamination, cleaning, chilling, cooking and management) in any order, then add your own methods. Steps 4 to 6 can come in any order once the profile is started. Your allergen information repeats your answers in the Management section on how customers are told about allergens, so answer those there. Write the diary and record sheets once the profile has the business's name, and again after you add your own opening and closing checks in the Management section. You can stop at any point and carry on later: nothing confirmed is lost.

Sign each document off when it is finished, and sign the profile off last. The completion record and the diary and record sheets are never signed off. A sign-off lasts until what that document says changes, and changing an answer changes only the documents that print it. Two things are worth knowing. The business's name is printed in every document, so changing it changes them all; so does changing the nation to or from one outside England and Wales, because every document then says so. And the profile lists each safe method's status (whether it applies, is not relevant or is done differently, with the reason and who decided) and your own methods by name, kind and environmental health review, so it changes when any of those does. That is why the profile goes last. Anything else you change in one of your own methods changes the own methods document only. Your allergen information prints your answers in the Management section on how customers are told about allergens, so it changes when they do. There is one exception to all this: your own methods document needs an entry for every special process or food the profile says you do. If you answer yes to one that has no entry yet, own methods goes back to unfinished, though nothing in it has changed. Record the entry, and the document is written again: in place if nobody had signed it off, and as a new version to sign off if somebody had. A signed-off document whose answers have changed is written again as a new version, and that version needs signing off.

The documents land in your project folder, for example:

```text
projects/001-bramble-cafe/
  README.md                  what the folder is, and what to run next
  external/                  documents of your own for the assistant to read
  food-safety/
    answers-profile.md  answers-XC.md  answers-CL.md  answers-CH.md
    answers-CK.md  answers-MG.md  answers-own.md  answers-allergens.md
    answers-cleaning.md  answers-suppliers.md  sign-offs.json
  ARC-001-FOODPROF-v1.0.md   the business profile
  ARC-001-FOODXC-v1.0.md     cross-contamination
  ARC-001-FOODCLN-v1.0.md    cleaning
  ARC-001-FOODCHL-v1.0.md    chilling
  ARC-001-FOODCOOK-v1.0.md   cooking
  ARC-001-FOODMGT-v1.0.md    management
  ARC-001-FOODOWN-v1.0.md    your own methods
  ARC-001-FOODALG-v1.0.md    your allergen information
  ARC-001-FOODCS-v1.0.md     your cleaning schedule
  ARC-001-FOODSUP-v1.0.md    your suppliers and contacts
  ARC-001-FOODREC-v1.0.md    the blank diary and record sheets
  ARC-001-FOODCMP-v1.0.md    the completion record
```

The first command makes this folder, with a short note in it for you: what the folder is, where the worksheets and documents are, and which command to run next. The project folder holds the names of the people who work in the business. Keep it somewhere private, and if it is a git repository that is pushed anywhere, keep that private too. The assistant you run the commands in also keeps its own record of each session on the computer, outside the project folder. In Claude Code that is the `.claude` folder in your home folder. The record holds what the commands read and wrote, names included, so treat that computer as private too.

**If a later version of the overlay words things differently.** Each worksheet carries the overlay's own guidance at the top, and the wording of each question on lines that start with `>`. When a newer version of the overlay changes that wording, a worksheet you filled in earlier is reported as made by a different version, and its answers stop counting until it is brought up to date. The command you are running then shows you every line it would take out or put in, and writes them only when you agree. If nobody is there to agree, it writes nothing: it says the worksheet was made by a different version, leaves it as it is, and carries on with whatever does not need that worksheet. Your answers, names and dates are not touched, and the worksheet as it was is kept beside the new one. The kept copy's name starts with `before-upgrade-`. Before the command writes anything, it checks each question it would change: the lines under its heading must hold that question's own words from the pack, which do not change from one version of the overlay to the next while the pack is the same edition. What can differ is the overlay's own: the note in brackets after a question that says what form the answer takes, and which of the pack's headings are printed above a question. (A profile question that names no special process or food is the overlay's own, so its own words are the question itself, as this version words it or as an earlier version did.) If the lines under a heading are another question's, the heading has been moved over another question: the command refuses, names the questions, and leaves the heading for you to put back. If they are no question's words, the command refuses and asks you to look at them. That means a line has been typed over, or the worksheet holds wording that this version does not know. For each question it would change, it shows you that question's own line as it stands and as this version prints it. Anything you typed on one of those lines cannot be told from old wording, so it is shown to you before it is taken out: say so if it is an answer you want kept, and the assistant records it in its proper place.

## When the pack does not fit your business

The pack is written for most small caterers. Where it does not fit yours, you decide, and the overlay records your decision in your words.

- **A safe method is not relevant** to your business, because it covers something you never do. Tell the assistant why. It records your reason, and your name as the person who decided.
- **You do a safe method differently.** Tell the assistant four things: what the business does instead, why, how you know your way works, and who decided. Until all four are given, the safe method stays as it is in the pack.
- **You have a control of your own** that the pack does not cover. `/arckit-uk-food:uk-food-own-methods` records it: what could go wrong, what you do about it, how you check it and what you do if it fails, and any limit you work to with where that figure comes from.

The assistant may point out that a safe method sounds not relevant from what you have said, but it never decides for you.

## Your allergen information

`/arckit-uk-food:uk-food-allergens` records each dish you serve, what goes into it, and, for each of the fourteen allergens in the pack, whether the dish contains it. Have your labels, product specifications and suppliers' statements to hand: you can paste their wording in, or put them in the project folder and point the command to them.

- **"Contains"** comes only from those labels, specifications and statements, or, for a single whole food with nothing added, from what the person who looked at it says.
- **"Does not contain"** is only ever your own statement. Once every ingredient of a dish has been checked against a label, a specification, a statement or a look at a whole food, the command tells you which allergens it found named and which it did not, and asks you which of those not found the dish does not contain.
- **An allergen that nothing settles reads NOT CONFIRMED**, and the document stays unfinished until it is filled in.
- **A dish counts only once a named person who is there has been shown it whole and agreed it**, even one set out in full in the message that starts the command, which is recorded as given and waits until then.

The command never works an allergen out from the name of a dish or an ingredient, never looks a product up, and never says a dish is free from anything or suitable for anyone. If your business already makes a "free from" statement, it records your exact words and prints the pack's conditions for making one beside them; it does not suggest one or reword yours. A label's "may contain" warning goes in the dish's notes, word for word. The [allergen information guide](uk-food-allergens.md) says how each answer is recorded, and what happens when a recipe or a supplier changes.

## Your cleaning schedule, and your suppliers and contacts

`/arckit-uk-food:uk-food-cleaning-schedule` fills in the pack's cleaning schedule form: each thing you clean, how often, what to take care over and how you clean it. `/arckit-uk-food:uk-food-suppliers` fills in the pack's suppliers' list and contacts list: your suppliers, your council's environmental health team and the other people you may need to contact.

Both take one entry at a time, in your own words. An entry counts only once a named person has agreed it: by confirming it as shown, or by setting it out in full, having said who they are, in the message that starts the command. Neither suggests anything: the cleaning schedule command never suggests what to clean, how, how often or with what, and the suppliers command never looks anyone up or fills in a name, number or address you did not give. If you already keep either list somewhere else, such as a folder in the kitchen or a book by the till, tell the command where, and the document says so. See the [cleaning schedule guide](uk-food-cleaning-schedule.md) and the [suppliers and contacts guide](uk-food-suppliers.md).

## The diary and record sheets

`/arckit-uk-food:uk-food-record-sheets` gives you the pack's blank pages for the work you record as you go: the diary's cover, the opening and closing checks, a week page and the prove it records. It asks you nothing about them and never fills any of them in. Print the document, or copy its forms into whatever you keep your records in, and print or copy one week page for each week. The pages are yours to fill in, sign and keep.

Your own opening and closing checks come from your answers in the Management section of safe methods. Once a named person has confirmed them there, run the command again, and they are printed under the pack's own checks. Running it again prints the forms afresh, so fill them in on paper or in a copy kept apart from the file: if someone has typed into the forms in the file, the command writes nothing over them until you say that what was typed has been copied or is not wanted. The [diary and record sheets guide](uk-food-record-sheets.md) says exactly what a second run changes.

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

A document that is already there is taken as done, whatever has been answered since. The build writes it again only if you name its target with `--refresh` (`PROFILE`, `XC`, `CL`, `CH`, `CK`, `MG`, `CS`, `SUP`, `OWN`, `ALG`, `REC` or `CHECK`), or if a document it is built after has changed since the last build. To bring one document up to date, run its own command.

Do not expect a finished pack from a build: the answers come from running the commands above with the person who knows the business.

The recipe builds the profile, the five sections, your own methods, your allergen information, your cleaning schedule, your suppliers and contacts, the blank diary and record sheets, and the completion record. A build never prints the diary and record sheets afresh over forms someone has typed into.

Run the profile command once first, so the project exists. The build saves its work with a git commit after each wave of documents; a records folder is rarely a git repository, so add `--no-commit` unless yours is one. For project `001`:

```text
/arckit:build 001 --recipe uk-food-sfbb --no-commit
```

The recipe passes ArcKit's recipe checks. A dry run of the build planned its first eight documents as it should: the profile first, then the five sections together, then your own methods, then the completion record. The four added since (the allergen information, the cleaning schedule, the suppliers and contacts, and the diary and record sheets) have not yet been through a dry run. Nobody has yet run the recipe end to end through the build.

ArcKit's notices about drafts that have not changed for a while leave these documents out, and its general health check does not count them as long-running drafts: only the sign-off command changes a document's status, and the completion record and the diary and record sheets always stay drafts. If you give a document a next review date, ArcKit still says when that date has passed. Its health check is written for architecture documents, so the next step it suggests then does not fit these documents: use the overlay's own commands instead.

## What it does not cover

- **Scotland and Northern Ireland.** The pack, and this overlay, cover England and Wales only. If the profile says the business is anywhere else, every document opens by saying so plainly.
- **Other kinds of food business.** The overlay uses the pack for caterers only. The Food Standards Agency's other packs, for retailers, childminders, care homes and other cuisines, are not covered.
- **The daily diary.** The diary stays with you, on paper or however the business keeps it today. The overlay does not keep it: `/arckit-uk-food:uk-food-record-sheets` gives you its blank pages to print or copy, and you fill them in.
- **Procedures for special processes.** See above.
- **Working out what is in your food.** The allergen information records what your labels, specifications and suppliers' statements say, and what you say a dish does not contain. The overlay never looks a product up, and never says a dish is free from anything or suitable for anyone.
- **Suggestions for your lists.** The overlay does not suggest what to clean, how or how often, and does not look up a supplier, your council or any other contact.
- **The pack's formatting.** Bold and underlining in the pack are not carried into the documents. The words are.
- **One layout detail.** On two pages, the pack prints its line about noting a problem in your diary after a later box. The documents print that line with the box about what to do when things go wrong.
- **Places where the pack disagrees with itself.** In two places the pack words the same limit in two different ways. In CK-06 HOT HOLDING, one limit is worded two slightly different ways on the same page. CH-01 CHILLED STORAGE AND DISPLAYING CHILLED FOOD and CK-07 READY-TO-EAT FOOD describe differently which ready-to-eat foods one of their limits covers. The documents print each place exactly as the pack prints it, and the overlay does not choose between them. If one of these matters to you, read both places in your documents and ask your council's environmental health team. Maintainers can find both places, with their pages, in the limits check sheet that [`scripts/uk-food/render-limits-check.py`](../../scripts/uk-food/render-limits-check.py) prints.

## What is there now, and what is planned

Every safe method in the pack is in the five section documents, training (MG-05 TRAINING AND SUPERVISION) among them. Beside them, the overlay records your allergen information, your cleaning schedule and your suppliers and contacts, and prints the pack's blank diary and record sheets.

Two parts of the pack are still to come, and there are no dates:

- The pack's STAFF TRAINING RECORD, with training material.
- The pack's regular review of the diary.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in a document, and the document check will then fail. The fix is to run the document's command again, not to edit those lines by hand: changes belong in the worksheet. For the diary and record sheets, say too that nothing typed on the file is wanted, or the command leaves the file alone.

The documents are not edited by hand anywhere else either. A note added to a signed-off document ends its sign-off, because nobody signed the note. Something the business wants to say about how it works belongs in its own methods, recorded with `/arckit-uk-food:uk-food-own-methods`.

## Other tools

Claude Code names the commands as above. The other tools ArcKit supports name them their own way: for example `$arckit-uk-food-profile` in Codex and `/arckit-uk-food-profile` in GitHub Copilot.

## Help wanted: a food safety co-maintainer

The overlay is looking for a food safety co-maintainer. If you are an environmental health practitioner or a food safety consultant, please open an issue at <https://github.com/tractorjuice/arc-kit/issues> tagged `co-maintainer: uk-food`. Until someone with that background has reviewed the overlay, treat everything it produces as a draft that the business owner must read and confirm.
