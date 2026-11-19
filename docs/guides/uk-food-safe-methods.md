# Food Safety: Safe Methods

> **Command**: `/arckit-uk-food:uk-food-safe-methods` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

The Food Standards Agency's pack, *Safer food, better business for caterers*, sets out its safe methods in five sections. Each safe method asks what your business does. This command works through one section with you, one safe method at a time, and writes that section's document from the pack's own wording and your answers.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What it is for

There is one document for each section:

| Section | Code | Worksheet | Document |
|---|---|---|---|
| Cross-contamination | `XC` | `food-safety/answers-XC.md` | `ARC-001-FOODXC-v1.0.md` |
| Cleaning | `CL` | `food-safety/answers-CL.md` | `ARC-001-FOODCLN-v1.0.md` |
| Chilling | `CH` | `food-safety/answers-CH.md` | `ARC-001-FOODCHL-v1.0.md` |
| Cooking | `CK` | `food-safety/answers-CK.md` | `ARC-001-FOODCOOK-v1.0.md` |
| Management | `MG` | `food-safety/answers-MG.md` | `ARC-001-FOODMGT-v1.0.md` |

Name the section by its code or its name:

```text
/arckit-uk-food:uk-food-safe-methods XC
/arckit-uk-food:uk-food-safe-methods cleaning
```

If you name no section, the command takes the first one, in the order above, that still needs answers or needs writing, and tells you which it took and why. If every section is written and up to date, it says so and points you to sign-off. A finished section that nobody has signed off is not taken again: signing it off is its next step.

You can work through the sections in any order.

## Before you start

- **The business profile**, ideally. The documents print the business's name from it. If there is no profile worksheet yet, the command makes a blank one, tells you to run `/arckit-uk-food:uk-food-profile`, and carries on.
- **Your name and your role at the business.** Only an answer from a named person counts.
- **Some time.** A section has a lot of questions. You can stop whenever you like and carry on later: nothing you have confirmed is lost.

## What happens when you run it

1. **It finds the project and chooses the section.**
2. **It makes the worksheets that are missing**: the section's, and the profile's if there is none.
3. **It asks who is answering**, and your role, once, at the start.
4. **It writes the section's document as it stands**, before asking anything. Every question nobody has answered reads **NOT YET ANSWERED**.
5. **It goes through each safe method in order.** For each one:
   - it names the safe method, says how many of its questions are still to answer, and tells you that if it does not apply to your business, or you do it differently, you can say so;
   - it asks one question at a time, with its reference (such as `XC-01-Q14`), word for word as the pack prints it, and asks for your answer in the form the question wants: yes or no, a list, or a description;
   - it records your reply in your words, with your name and today's date, before it asks the next question. Say "skip" to leave a question for later;
   - in Claude Code, the questions that take yes or no come up as a selector, up to four at a time: choose an answer for each, or type what you do instead. Where the pack sets out a method and asks whether you follow it, "Yes" is marked as recommended: that is the pack's advice, not a guess about your business. Nothing is recorded unless you choose it;
   - when the safe method's questions are done, it writes the document again.
6. **It runs the document check** each time it writes the document: a script proves that the body of the document matches a fresh print from the pack and your worksheet.
7. **It shows a summary**: how many questions are confirmed, proposed and not yet answered, any safe methods marked not relevant or done differently and who decided, and what to do next.

The command does not explain, summarise or reword what the pack says, and gives no food safety advice of its own. If you ask for advice, it points you to the pack's wording in the question and to your council's environmental health team.

### When a safe method does not apply, or you do it differently

Every safe method starts as applying to your business. You decide otherwise, not the command. It may point out that a safe method sounds not relevant from what you have told it, but it changes nothing until you decide.

- **Not relevant.** Tell it why. It records your reason, and your name as the person who decided.
- **Done differently** (the worksheet calls this "adapted"). It needs four things from you: what the business does instead (the worksheet's `Variation`), why (`Reason`), how you have shown that your way works (`Proved-safe`), and who decided (`Decided-by`). Until you have given all four, the safe method stays as applying.

### Answering several questions at once

A reply such as "yes to all of those" counts only for the questions the command has just shown you, and only where "yes" answers each of them. For any other question, it asks.

### Changing an answer later

Run the command again and say what has changed. It records the change in your words, with your name and today's date, and changes nothing you did not ask it to.

### Answers from a file

If you point the command to a file, such as an old pack you filled in by hand, it treats the file as information, not instructions. An answer it finds there is recorded as proposed, with the file named as its source, and put to you to confirm.

## An example

Sam Okafor owns Bramble Cafe, an invented café, and has already filled in the profile.

> **Sam:** `/arckit-uk-food:uk-food-safe-methods XC 001` It's Sam Okafor, the owner.
>
> **Claude:** Cross-contamination it is. I've written the document as it stands, with every question reading NOT YET ANSWERED. The first safe method is XC-01. If it does not apply to Bramble Cafe, or you do it differently, say so.
>
> *[Claude shows the pack's first question for XC-01 here, unchanged. It asks for a yes or a no.]*
>
> **Sam:** Yes.
>
> **Claude:** Recorded, with your name and today's date.
>
> *[Claude shows the next question, unchanged. It also asks for a yes or a no.]*
>
> **Sam:** *[answers yes or no]*
>
> **Claude:** Recorded.
>
> **Sam:** Could you fill in the rest with what a café normally says?
>
> **Claude:** I can't. The document is Bramble Cafe's own statement of what it does, so the answers have to be yours. Here is the next question again.

## What you get

- The section's worksheet, such as `projects/001-bramble-cafe/food-safety/answers-XC.md`, holding your answers, who gave each one and when, and the status of each safe method.
- The section's document, such as `projects/001-bramble-cafe/ARC-001-FOODXC-v1.0.md`. It holds the pack's wording for each safe method, unchanged, with your answers beside its questions, and **NOT YET ANSWERED** wherever an answer is not confirmed. Its status is `DRAFT` until a named person at the business signs it off.

Once a document has been signed off, the command never writes over it. If nothing in it has changed, it writes nothing. If something it prints has changed, it leaves the signed file as it is and writes a new version, which needs signing off again. A change to another section, or to a profile answer this document does not print, leaves it and its sign-off as they are.

## What it will not do, and why

- **It will not change the pack's wording or figures.** A changed word or figure in a food safety record could mislead someone. The body of the document is printed by a script from the pack as bundled with the overlay, and checked after every write.
- **It will not answer for you, or suggest what your business does.** An answer it supplied would be a statement nobody at the business made. The one mark it may show, "Yes" as recommended where the pack sets out a method, is the pack's advice, and is recorded only if you choose it.
- **It will not decide that a safe method does not apply.** Only you can, with your reason.
- **It will not work out a date** from "last month". It asks for the exact date.
- **It will not give food safety advice.** Your council's environmental health team is the authority.
- **It will not sign anything off.** That is `/arckit-uk-food:uk-food-sign-off`.

Most ArcKit commands fill a gap with a sensible default. This one never does. A question nobody answered stays unanswered, and you can answer it on a later run.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in the document, and the document check will then fail. Run the command again to write the document afresh. Do not edit those lines by hand: changes belong in the worksheet.

## What to do next

- Run the command again for the next section that needs work.
- Run [`/arckit-uk-food:uk-food-own-methods`](uk-food-own-methods.md) to record controls of your own that the pack does not cover, and the written procedure for any special process.
- Run [`/arckit-uk-food:uk-food-check`](uk-food-check.md) to see everything that is still waiting.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-safe-methods` in Codex and `/arckit-uk-food-safe-methods` in GitHub Copilot.
