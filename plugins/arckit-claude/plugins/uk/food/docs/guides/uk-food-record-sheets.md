# Food Safety: Diary and Record Sheets

> **Command**: `/arckit-uk-food:uk-food-record-sheets` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

This command gives you the blank pages from the pack that you fill in as you work: the diary's cover, the opening and closing checks, a week page and the prove it records. It puts them in one document for you to print, or copy. It asks you nothing about them, and it never fills any of them in.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What you get

`projects/001-bramble-cafe/ARC-001-FOODREC-v1.0.md`, holding these forms from the pack, in this order:

- **Diary**: the diary's cover. Your business's name is printed on it once your profile confirms it; the rest is for you to fill in.
- **Opening checks** and **Closing checks**: the pack's lists of checks to tick when you open and when you close, then your own checks, if you have added any, and a few empty rows for checks you write in by hand.
- **Extra checks**: the pack's note on the checks you do less often than the opening and closing checks.
- **Week**: one week page, with a row for each day and a box at the end for the extra checks you did that week.
- **Prove it: records**: a table for noting how you showed that one of your safe methods works, and when.

## How to use it

1. Run the command.
2. Print the document, or copy its forms into whatever you keep your records in, kept apart from this file.
3. Print or copy one week page for each week.
4. Fill in and sign the pages as you work, and keep them.

The pages are yours to fill in, sign and keep. This tool never keeps your diary, and never fills in a form, ticks a check or says that a check has been done.

## Your own checks

The pack lets you add checks of your own to the opening and closing lists. The overlay takes them from your answers in the Management section of safe methods: run `/arckit-uk-food:uk-food-safe-methods MG` and answer its questions about your opening and closing checks. Once a named person at the business has confirmed those answers, run this command again, and your checks are printed under the pack's. The pack's own checks are always printed in full, whatever you add. The command never suggests a check for you.

## Signing

This document is never signed off in the tool, because it is blank forms: each page is signed by the people who fill it in. `/arckit-uk-food:uk-food-sign-off` refuses it, and its status stays `DRAFT`.

## Running it again

Running the command again prints the forms afresh into the same file, at the same version: for example after you add your own checks, or once your profile confirms your business's name. The document never collects versions.

It changes only the forms between the file's `UK-FOOD` markers and the date the file was last changed, and if that date's cell held something other than a date, it tells you what. If a line of the header, or of its revision history, says the document was signed off or approved, it puts that line back, because nobody signs this document off, and tells you what the line held. Everything else in the file is left as you left it: its title, a row you added to its revision history, a value you typed in its header.

## If you typed into the file itself

Printing the forms afresh replaces everything between the file's markers, so anything typed into the forms would be lost. So if the command finds that the forms have been changed by hand, such as a form filled in on the file, it writes nothing. A note you add to the file outside the forms does not stop it: it prints the forms afresh, leaves the note where it is, and tells you it did. It writes nothing either when the header's sign-off lines have been written in and the forms differ from a fresh print, because it cannot then tell forms that are only out of date from forms someone filled in. It shows you what the document check found, and tells you to copy what you filled in to a printout or to a copy kept apart from the file. When you have, tell it that what you typed has been copied, or that it is not wanted: later in the same conversation, or in your message when you run it again. Only then does it print the forms afresh; a note you added elsewhere in the file stays where it is, for you to take out if you no longer want it. A note saying so in the file itself does not count. If the file's marker lines have gone, one of the pack's headings has been pasted outside the forms, or its Document ID or Version no longer matches its name, it writes nothing even then, because printing the forms afresh would not put any of these right: put them back, or take the heading out, or move the file out of the project folder once anything in it is copied, and the next run writes a new one. A build, or a run with nobody there, leaves such a file alone and says so, whatever its message says.

If only the header's sign-off lines were written in and the forms are exactly as printed, nothing on them can be lost, so the command prints the forms afresh, puts those lines back to `DRAFT` and `[PENDING]`, and tells you what each held.

A program that tidies Markdown files (a formatter) may rewrite the tables in the file, and the document check then fails just as it does for a form filled in on the file. Run the command again and say that nothing typed on the file is wanted. Do not edit those lines by hand.

## Before you start

- **A business project.** If there is none, the command makes one, as the profile command does.
- **The profile worksheet.** If it is missing, the command makes a blank one and tells you that `/arckit-uk-food:uk-food-profile` fills it in. Until the profile confirms your business's name, that space on the diary's cover is left empty.

## An example

Sam Okafor owns Bramble Cafe, an invented café.

> **Sam:** `/arckit-uk-food:uk-food-record-sheets 001`
>
> **Claude:** I've written your diary and record sheets, `ARC-001-FOODREC-v1.0.md`, and the document check passed. They hold the pack's diary cover, opening and closing checks, a week page and prove it records, blank, for you and your staff to fill in by hand. Print the week page, or copy it, once for each week. The pages are filled in, signed and kept by people at the business, on paper or in a copy kept apart from this file, because writing the document again prints the forms afresh. Your own opening and closing checks come from your answers in the Management section of safe methods, and are added there with `/arckit-uk-food:uk-food-safe-methods MG`. Nothing is waiting for these forms.

## What it will not do, and why

- **It will not fill in a form.** A tick, a name or a signature written by a tool would be a record nobody at the business made.
- **It will not suggest checks of your own.** Your own checks are the ones you give in the Management section.
- **It will not keep the diary.** The diary stays with you, on paper or in a copy you keep apart from this file.
- **It does not yet include** the pack's staff training record or its regular review of the diary.

## What to do next

Run [`/arckit-uk-food:uk-food-check`](uk-food-check.md) to see what is finished and what is still waiting across all your documents.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-record-sheets` in Codex and `/arckit-uk-food-record-sheets` in GitHub Copilot.
