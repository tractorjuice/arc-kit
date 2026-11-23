# Food Safety: Where Things Stand

> **Command**: `/arckit-uk-food:uk-food-check` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

This command shows you what is finished and what is still waiting across all your food safety documents, and writes the completion record. It asks nothing about the business and changes none of your answers, so you can run it whenever you want to see where things stand.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What it is for

It tells you, for each document:

- how many of its questions, or for a list such as the cleaning schedule its entries, are confirmed, out of how many, and how many are proposed and waiting for a named person to confirm them;
- whether the document has been written, and whether it is in step with its worksheet, or what is wrong with it;
- whether it has been signed off, and if so by whom, in what role and on what date.

It also says whether the completion record already written is up to date, and lists the special processes and foods the profile confirms, with the own entry that covers each one (or none), and any entry still waiting for your council's environmental health review.

Then it gives the list of everything still unfinished, exactly as the overlay's helper script prints it, and says which command moves each item on.

It also writes the **completion record**: the pack's own record of which safe methods have been worked through, filled in from your documents and sign-offs, followed by the list of everything still unfinished. The per-document counts and the summary of special processes are shown to you, not written into the record.

## Before you start

- **A business project.** If there is none, the command tells you that `/arckit-uk-food:uk-food-profile` starts a business's documents, and writes nothing. It never makes a project itself.
- **The profile worksheet**, ideally. If it is missing, the command says so and carries on: the record shows which worksheets have not been started.

## What happens when you run it

1. **It finds the project.**
2. **It reads where things stand** from the helper script. Whether something is finished is what the script says, not the command's view of your answers.
3. **It writes the completion record.** It rewrites the same file each time, at the same version: the record describes the project as it is now, so it never collects versions.
4. **It runs the document check** on the record, against a fresh print.
5. **It shows a summary.**

It changes none of your answers and no other document. The one thing it may do to a worksheet is bring the overlay's own wording in it up to date, when a later version of the overlay words it differently: it shows you each line it would take out or put in, and writes them only when you agree. With nobody there to agree, it writes nothing to the worksheet, and says so. Anything else that needs putting right is put right with the other commands.

## An example

Sam Okafor owns Bramble Cafe, an invented café. Part of the way through, Sam runs the check.

> **Sam:** `/arckit-uk-food:uk-food-check 001`
>
> **Claude:** I've written the completion record, `ARC-001-FOODCMP-v1.0.md`, and its document check passed. Here is where each document stands, followed by everything still unfinished and the command that moves each item on.

The lines for each document look like these, from a copy of the example project the overlay is tested against, with its cooking document written and signed off:

```text
FOODPROF (Business profile): 20 of 20 questions confirmed; not written; not signed off
FOODXC (Cross-contamination): 23 of 50 questions confirmed, 2 proposed; not written; not signed off
FOODCLN (Cleaning): 0 of 23 questions confirmed; adapted: CL-04; not written; not signed off
FOODCOOK (Cooking): 41 of 41 questions confirmed; not relevant: CK-06; ARC-001-FOODCOOK-v1.0.md in step with its worksheets; signed off by Sam Okafor, Owner, on 2026-11-18
FOODOWN (Own methods): 2 of 2 own entries confirmed; not written; not signed off
FOODREC (Diary and record sheets): not written
FOODCMP (Completion record): ARC-001-FOODCMP-v1.0.md up to date
```

The last of those lines is about the completion record itself. Once anything it reports on has changed, that line says the record is out of date, and running this command again brings it up to date. If a document was changed after it was signed off, its line says so in place of "signed off by", and the unfinished list says what to do. If a document is signed off but its header has not yet been marked to show it, its line says that too: running `/arckit-uk-food:uk-food-sign-off` for that document finishes the marking, and no new sign-off is needed.

Lines in the unfinished list look like these:

```text
- FOODPROF: document not written yet: write the document from its worksheet
- FOODXC: 2 answers in food-safety/answers-XC.md are proposed but not confirmed (XC-02-Q01 and XC-06-Q02): an answer counts when its State is confirmed and By and On are filled in
- FOODOWN: own entry OWN-02 (Sous vide eggs) is awaiting environmental health review: once the council has replied, record the review's date and outcome in the entry's EH-review field
```

What moves each item on:

| What is waiting | What to run |
|---|---|
| Profile questions not yet answered or only proposed | `/arckit-uk-food:uk-food-profile` |
| Section questions not yet answered or only proposed | `/arckit-uk-food:uk-food-safe-methods` with the section's code, such as `XC` |
| Own entries, special processes, environmental health reviews | `/arckit-uk-food:uk-food-own-methods` |
| Dishes in your allergen information not yet confirmed, or none recorded, or an allergen not filled in | `/arckit-uk-food:uk-food-allergens` |
| Your answers on how customers are told about allergens, which the allergen information repeats | `/arckit-uk-food:uk-food-safe-methods MG` |
| Cleaning schedule items not yet confirmed, or none recorded | `/arckit-uk-food:uk-food-cleaning-schedule` |
| Suppliers and contacts not yet confirmed, or none recorded, or no environmental health team | `/arckit-uk-food:uk-food-suppliers` |
| The diary and record sheets not written yet, or out of date | `/arckit-uk-food:uk-food-record-sheets` |
| A document not written yet, or out of date | The command that writes that document |
| A finished document not yet signed off | `/arckit-uk-food:uk-food-sign-off` |

## What you get

`projects/001-bramble-cafe/ARC-001-FOODCMP-v1.0.md`, the completion record. It is a report, so nobody signs it off: each document it lists is signed off on its own. Its status stays `DRAFT`.

## What it will not do, and why

- **It will not change your answers or other documents.** The record is only as true as what it reads, so anything wrong is put right at its source, with the command that owns it.
- **It will not judge your answers.** It reports what the helper script says.
- **It will not cover the daily diary.** The diary stays with you, on paper or however the business keeps it today. Its blank pages come from `/arckit-uk-food:uk-food-record-sheets`.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in the record, and the document check will then fail. Run the command again to write the record afresh. Do not edit those lines by hand.

## What to do next

For each finished document that has not been signed off, run [`/arckit-uk-food:uk-food-sign-off`](uk-food-sign-off.md). Sign the profile off last.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-check` in Codex and `/arckit-uk-food-check` in GitHub Copilot.
