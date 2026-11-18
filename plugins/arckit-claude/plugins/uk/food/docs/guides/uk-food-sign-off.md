# Food Safety: Sign-off

> **Command**: `/arckit-uk-food:uk-food-sign-off` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

A sign-off records that a named person at the business has read one finished food safety document and confirms it is right for the business. It records their name, their role and the version they read. It is the business's own confirmation, and only ever made in that person's name and at their request.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What it is for

You can sign off these documents, each on its own: the business profile, the five sections of safe methods (cross-contamination, cleaning, chilling, cooking and management) and your own methods. The completion record is a report, and is not signed off.

A document can be signed off only when it is finished. The overlay's helper script decides that, not the command:

- every worksheet the document needs is there, with no problems;
- every question in it is confirmed by a named person;
- the document is written, at the version you are signing, and passes its document check;
- for your own methods, every special process the profile confirms has its own entry.

## Before you start

- **A finished document.** Run `/arckit-uk-food:uk-food-check` to see which documents are finished.
- **The profile last.** You can sign each document off as soon as it is finished. Sign the profile off last: it lists each safe method's status and your own methods, so it changes when one of those does.
- **Your name and your role**, in the message that runs the command. If either is missing, the command asks.
- **Whether a printed copy has been signed**, if you keep one. Say so, and the record notes it. The documents are plain text files (Markdown) that any text editor or Markdown viewer can open and print.

## What happens when you run it

1. **It finds the project.**
2. **It works out what is to be signed, and by whom.** Name one document, or several to sign each in turn. A general request such as "sign everything off" is not enough: the command lists each document not yet signed off, with its file and version and the name and role it would record, and asks which ones.
3. **It signs only in the name of the person asking.** If you ask it to sign for someone else, it tells you that person has to do it themselves, and records nothing.
4. **It tells you the file and version it is about to record, and waits for your yes**, unless you named the version yourself. A sign-off says you read that version, so you need to know which one it is.
5. **It asks the helper script to record the sign-off.** If the script refuses, the command shows you its reasons unchanged, and stops. Nothing is recorded, and the command never tries to work round a refusal.
6. **If the sign-off is recorded**, the command marks the document's header: Status `APPROVED`, and Reviewed By and Approved By both set to the name, role and date, such as `Sam Okafor, Owner, 2026-11-18`. In this overlay, `APPROVED` means only that: signed off by the named person at the business. It also fills in that version's row in the Revision History.
7. **It runs the document check again**, and looks at where the document stands, to prove that marking the header changed nothing else in the file.
8. **It shows a summary.**

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
> **Claude:** The cooking document is `ARC-001-FOODCOOK-v1.0.md`, version 1.0. Shall I record that you, Sam Okafor, Owner, have read version 1.0 and confirm it?
>
> **Sam:** Yes.
>
> **Claude:** Recorded: signed off by Sam Okafor, Owner, on 2026-11-18. The header now shows `APPROVED`, which here means signed off by you, the named person at the business, and nothing more. The diary and its daily signature stay with you: this overlay does not keep the diary. If the answers change, the document is written again as a new version, which needs signing off again.

And if someone asks on another person's behalf:

> **Tom:** Sign the cleaning document off for Sam.
>
> **Claude:** Sam has to do that themselves. A sign-off is that person's own statement that they have read the document, so I can only record one in the name of the person asking. Nothing has been recorded.

## What you get

- A record in `projects/001-bramble-cafe/food-safety/sign-offs.json`: the document, its version and file, the name, role and date, whether a printed copy was signed, and a fingerprint of the file as you signed it, so that any later change to it shows.
- The document's header marked as signed off, as above.

## What a sign-off covers

A sign-off covers the whole document, exactly as it reads when you sign it: the pack's wording, your answers, and everything else in the file.

- **If something the document says changes**, the sign-off no longer counts. That happens when an answer it prints is changed, and when anyone adds to the file or edits it by hand. `/arckit-uk-food:uk-food-check` then says the document is no longer signed off, and why. The document's command writes it again as a new version, and that version needs signing off.
- **If something it does not say changes**, the sign-off stands. Adding a member of staff to the profile, for example, changes the profile document and nothing else.
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
