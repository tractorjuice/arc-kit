# Food Safety: Sign-off

> **Command**: `/arckit-uk-food:uk-food-sign-off` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

A sign-off records that a named person at the business has read one finished food safety document and confirms it is right for the business. It records their name, their role and the version they read. It is the business's own confirmation, and only ever made in that person's name and at their request.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What it is for

You can sign off these documents, each on its own: the business profile, the five sections of safe methods (cross-contamination, cleaning, chilling, cooking and management), your own methods, your allergen information, your cleaning schedule, and your suppliers and contacts. Two are never signed off: the completion record, which is a report, and the diary and record sheets, which are blank forms that people at the business fill in and sign themselves as they use them.

A document can be signed off only when it is finished. The overlay's helper script decides that, not the command:

- every worksheet the document needs is there, with no problems;
- every question or entry in it is confirmed by a named person, and it shows nothing else as not yet answered or not yet confirmed;
- the document is written, at the version you are signing, and passes its document check;
- the lines of its header that a sign-off rewrites hold only what the overlay's commands write there (`DRAFT` and `[PENDING]`, or an earlier sign-off, and a date), because signing off rewrites those lines and must change nothing else;
- for your own methods, every special process the profile confirms has its own entry;
- for your allergen information, at least one dish is confirmed, or a confirmed note says where you keep it; every confirmed dish has all fourteen allergens, and whether it is prepacked for direct sale, filled in, so nothing in it reads NOT CONFIRMED; and your answers on how customers are told about allergens, which you give in the Management section of safe methods, are confirmed there, unless that safe method is marked not relevant;
- for your cleaning schedule, at least one item is confirmed, or a confirmed note says where you keep your schedule;
- for your suppliers and contacts, your environmental health team's entry is confirmed, and at least one supplier is confirmed or a confirmed note says where you keep your suppliers' list;
- if the file holds anything outside the part the helper checks, such as a note or a section of your own, you have been shown it and have said you have read it.

A list finished only by a confirmed note of where you keep it, with nothing of the list confirmed in the document (for your suppliers and contacts, no supplier), can be signed off. The document then says that it holds nothing of that record and that nothing in it was checked against it, and the completion record lists it under Kept elsewhere.

## Before you start

- **A finished document.** Run `/arckit-uk-food:uk-food-check` to see which documents are finished.
- **The profile last.** You can sign each document off as soon as it is finished. Sign the profile off last: it lists each safe method's status, and your own methods by name, kind and environmental health review, so it changes when any of those does.
- **Your name and your role**, in the message that runs the command. If either is missing, the command asks.
- **Whether a printed copy has been signed**, if you keep one. Say so, and the record notes it. The documents are plain text files (Markdown) that any text editor or Markdown viewer can open and print.

## What happens when you run it

1. **It finds the project.**
2. **It works out what is to be signed, and by whom.** Name one document, or several to sign each in turn. If you say just "cleaning", it asks whether you mean the Cleaning section of safe methods or your cleaning schedule; if nobody is there to answer, it records nothing. A general request such as "sign everything off" is not enough: the command lists each document not yet signed off, with its file and version and the name and role it would record, and asks which ones.
3. **It signs only in the name of the person asking.** If you ask it to sign for someone else, it tells you that person has to do it themselves, and records nothing.
4. **It tells you the file and version it is about to record, and waits for your yes**, unless you named the version yourself. A sign-off says you read that version, so you need to know which one it is.
5. **It shows you the document's header, and any text in the file that the helper has not checked.** It shows the Document Control table and the Revision History rows as they stand in the file, because your sign-off covers them. A document written by the overlay's commands has nothing else outside its checked part. If someone has added a note, a section, a comment or a row of their own, the command shows you each of those lines too, and asks whether you have read all of it and it is yours.
6. **It asks the helper script to record the sign-off.** If the script refuses, the command shows you its reasons unchanged. Nothing is recorded, and the command never tries to work round a refusal. If an earlier sign-off of the document still stands, the command goes on to make sure the header shows that one. If none does, it leaves the header reading `DRAFT` and stops. If you have already signed this version off and nothing in it has changed since, nothing new is recorded: the command tells you it is already signed off, by you and on what date, and whether its header shows it. If you have signed a printed copy since, say so, and that is recorded.
7. **If the sign-off is recorded**, the command marks the document's header: Status `APPROVED`, and Reviewed By and Approved By both set to the name, role and date, such as `Sam Okafor, Owner, 2026-11-18`. In this overlay, `APPROVED` means only that: signed off by the named person at the business. It also fills in that version's row in the Revision History. If a second person signs the same document later, the header is rewritten to show their sign-off, as the newest. If an earlier run recorded your sign-off but did not finish marking the header, the command finishes the marking and records nothing new. If the header was left showing something else, such as an earlier person's sign-off or a slip in one of its lines, the command first puts those lines back to `DRAFT` and `[PENDING]`, and running it once more marks them.
8. **It runs the document check again**, and looks at where the document stands, to prove that marking the header changed nothing else in the file and that the header now shows your sign-off. It does not stop while the header still reads `DRAFT`. If marking the header changed anything else in the file, inside the checked part or outside it, the command puts that back first. The command ends in one of two ways and tells you which. Either the document is signed off and its header shows it; or the header reads `DRAFT` and `[PENDING]`, and the command gives you the helper's own words for what is wrong and what to do. That holds however the command stops: when the helper refuses, when something it needs is missing, and when the marking cannot be finished. It never leaves a header reading `APPROVED` on a document that is not signed off. It never changes the file of an earlier version.
9. **It shows a summary.**

When the helper script refuses, its reasons look like this:

```text
FOODXC is not signed off, and nothing was written, because:
- 25 questions in food-safety/answers-XC.md are not yet answered (XC-03-Q01, XC-03-Q03, XC-03-Q04, XC-03-Q05, XC-03-Q06 and 20 more): an answer counts when its State is confirmed and By and On are filled in
- 2 answers in food-safety/answers-XC.md are proposed but not confirmed (XC-02-Q01 and XC-06-Q02): an answer counts when its State is confirmed and By and On are filled in
- document not written yet: write the document from its worksheet
```

Each reason says what is missing; here, the questions are answered with `/arckit-uk-food:uk-food-safe-methods XC`, which then writes the document.

## An example

Sam Okafor owns Bramble Cafe, an invented café. Every document is finished, and Sam is signing them off, leaving the profile until last.

> **Sam:** `/arckit-uk-food:uk-food-sign-off cooking 001` Sam Okafor, Owner.
>
> **Claude:** The cooking document is `ARC-001-FOODCOOK-v1.0.md`, version 1.0. Before I record anything, here is its header as it stands in the file, because your sign-off covers it: *[the Document Control table and the Revision History rows]*. Nobody has added anything else to the file. Have you read version 1.0 and this header, and shall I record that you, Sam Okafor, Owner, confirm it?
>
> **Sam:** Yes.
>
> **Claude:** Marked. Recorded: signed off by Sam Okafor, Owner, on 2026-11-18. The header now shows `APPROVED`, which here means signed off by you, the named person at the business, and nothing more. The diary and its daily signature stay with you: this overlay does not keep the diary. If the answers change, the document is written again as a new version, which needs signing off again.

And if someone asks on another person's behalf:

> **Tom:** Sign the cooking document off for Sam.
>
> **Claude:** Sam has to do that themselves. A sign-off is that person's own statement that they have read the document, so I can only record one in the name of the person asking. Nothing has been recorded.

## What you get

- A record in `projects/001-bramble-cafe/food-safety/sign-offs.json`: the document, its version and file, the name, role and date, whether a printed copy was signed, whether you were shown text that someone had added outside the checked part (`otherTextRead`, which is `false` when there was none), and a fingerprint of the file as you signed it, so that any later change to it shows. The newest sign-off is not recorded a second time: if nothing in the file has changed and nobody has signed it since you did, asking again only finishes the header, or, if the header already shows it, says that the document is already signed off. Your name and role are compared as you gave them: given another way, such as `owner` for `Owner`, they make a new record, and the header then shows that one. That is also how a name or role recorded with a slip in it is put right. A printed copy signed later is recorded, as a record of its own.
- The document's header marked as signed off, as above.

## What a sign-off covers

A sign-off covers the whole document, exactly as it reads when you sign it: the pack's wording, your answers, and everything else in the file.

- **If an answer the document prints changes**, the sign-off no longer counts. `/arckit-uk-food:uk-food-check` then says the document is no longer signed off, and why. The document's command writes it again as a new version, and that version needs signing off. The same happens if the text between the document's two `UK-FOOD` marker lines is changed by hand.
- **If anyone adds to the file, or changes it, outside that checked part**, the sign-off no longer counts either, but no new version is needed, because what the document prints from your answers has not changed. Take the change out again, or sign the document off again as it now reads: before anything is recorded, you are shown the header's tables as they now read, and any other text someone has added.
- **If something it does not say changes**, the sign-off stands, with one exception. Adding a member of staff to the profile, for example, changes the profile document and nothing else. The exception is your own methods document. It needs an entry for every special process or food the profile says you do, so answering yes to a new one in the profile puts own methods back to unfinished until that entry is recorded.
- **The lines that show the sign-off are part of it.** Once a document is signed off, its Status reads `APPROVED`, and Reviewed By and Approved By read exactly the name, role and date that were recorded. A word added to any of them ends the sign-off, and the document check says which line. ArcKit stamps a Build Provenance table at the foot of the file and rewrites it itself; that table is outside what you sign for only while each line of it is in the form ArcKit writes. Anything else put into it ends the sign-off.
- **If a worksheet cannot be read**, because a line in it was changed in a way the helper script does not understand, the documents built from it show as not checked, and not signed off, until that line is put right. Nothing is lost: once the worksheet reads again, a document that has not changed is signed off as before.
- **The business's name is printed in every document**, so changing it changes them all. So does changing the nation to or from one outside England and Wales, because every document then says so.
- **The date is the day you sign.** A date that has not come yet is refused.

A document whose header says it is signed off, when no sign-off is recorded for it, fails the document check: only this command marks a header.

## What it will not do, and why

- **It will not sign a document that is not finished.** The helper script refuses, and the command shows you why.
- **It will not sign in anyone else's name**, or take a name from your computer's settings or from a document. A sign-off is that person's own statement.
- **It will not work round a refusal**, by editing a worksheet, the document or the record of sign-offs.
- **It will not keep the diary.** The diary and its daily signature stay with the business. A sign-off here covers one version of one document, nothing more.
- **It is not a check by anyone outside the business.** Neither the Food Standards Agency nor your council has reviewed or endorsed the documents or the sign-off.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in the document, and the document check will then fail. Write the document again with its own command. Do not edit those lines by hand.

## What to do next

Run [`/arckit-uk-food:uk-food-check`](uk-food-check.md) to bring the completion record up to date, so it shows the sign-off and what is still waiting.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-sign-off` in Codex and `/arckit-uk-food-sign-off` in GitHub Copilot.
