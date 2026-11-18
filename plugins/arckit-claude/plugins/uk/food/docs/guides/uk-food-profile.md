# Food Safety: Business Profile

> **Command**: `/arckit-uk-food:uk-food-profile` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

The business profile is the first of your food safety documents. It records who runs the business, where it is, what it sells, its equipment and staff, and whether it does any of the special processes or foods that need extra care. Everything in it is in your own words.

This overlay is for small catering businesses in England and Wales. It builds your documents from the Food Standards Agency's free pack, *Safer food, better business for caterers*. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What it is for

The profile has twenty questions. The first ten are about the business:

- what it is called, and who the food business operator is: the person or company legally responsible for it;
- the address of the premises, the council it is registered with, and the date it registered;
- which nation it is in;
- who is in charge of keeping your food safety pack up to date;
- what food and drink it sells, the equipment it uses, and who works with food and in what role.

The other ten ask, one at a time, whether the business does each of the special processes and foods that the pack names as needing extra care.

Your other documents print the business's name from the profile, so it comes first.

## Before you start

- **ArcKit and this overlay, set up.** The overlay guide's [Getting started](https://arckit.org/guide/uk-food-safety-overlay.html#getting-started) list says what is needed: Claude Code, Node, and a folder for the business's records, with Claude Code started in that folder. The overlay's helper script runs on your computer and sends nothing anywhere.
- **Your name and your role at the business.** Only an answer from a named person counts.
- **Any files you want it to read**, if you like, such as your menu or an old pack. An answer taken from a file is only proposed until you confirm it.

## What happens when you run it

1. **It finds or makes the business's project.** It uses the project you name, by number (`001`) or by name. If there is none, it makes one named after the business, such as `projects/001-bramble-cafe/`.
2. **It makes the profile worksheet**, `food-safety/answers-profile.md`, if there is not one yet. Your answers are kept there. Once a worksheet exists it is never made again, because that would lose your answers.
3. **It asks who is answering**, and your role, once, at the start.
4. **It writes the profile document as it stands**, before asking anything. Every question nobody has answered reads **NOT YET ANSWERED**.
5. **It asks the questions a few at a time**: first the ten about the business, then the ten about special processes and foods. It shows each question as it is written, and asks for the answer in the form the question wants: a name, a date, yes or no, or a list.
6. **It records each answer in your words**, with your name and today's date, and writes the document again after each reply. You can stop at any time: everything you have confirmed is already in the document.
7. **It runs the document check** each time it writes the document: a script proves that the body of the document matches a fresh print from your worksheet.
8. **It shows a summary**: how many questions are confirmed, how many are proposed and waiting for someone to confirm them, how many are not yet answered, and what to do next.

Some answers lead somewhere else:

- **A special process or food.** If you say the business does one, the command says plainly that it will not write a procedure for it. It tells you to contact your council's environmental health team about it, and that `/arckit-uk-food:uk-food-own-methods` can record your own written procedure for it, word for word.
- **A business outside England and Wales.** The command says plainly that the pack and this overlay cover England and Wales only. It records your answer, and does not suggest any next step. Every document then opens by saying that the business is outside what the pack covers.
- **A safe method that does not apply to you.** You can say so while you go through the profile. The command may point out which of the pack's safe methods that sounds like, but it records a decision only when you make it, with your reason and your name. The decision is kept in that section's worksheet. That section's document is then out of date until you run `/arckit-uk-food:uk-food-safe-methods` for the section, which writes it again.

You can also give answers when you start the command. If you give your name in the same message, they count as yours. If you give no name, they are recorded as proposed, and the summary asks who gave them.

### Changing an answer later

Run the command again and say what has changed. It records the change in your words, with your name and today's date, and changes nothing you did not ask it to.

## An example

Sam Okafor owns Bramble Cafe, an invented café.

> **Sam:** `/arckit-uk-food:uk-food-profile Bramble Cafe` I'm Sam Okafor, the owner.
>
> **Claude:** I've made the project `projects/001-bramble-cafe/` and the profile worksheet, and written the profile document. All twenty questions read NOT YET ANSWERED for now. First, the business. What is the business called? And who is the food business operator: the person or company legally responsible for the business?
>
> **Sam:** Bramble Cafe. The operator is Bramble Cafe Ltd, and I'm its director.
>
> **Claude:** I've recorded both in your words, with your name and today's date, and written the document again. What is the address of the premises? Which council is the business registered with, and on what date was it registered?
>
> **Sam:** 4 Mill Lane, Exampleton. Exampleton District Council. Some time last spring.
>
> **Claude:** I've recorded the address and the council. I can only record the date as you give it, so what was the exact date?

## What you get

- `projects/001-bramble-cafe/food-safety/answers-profile.md`: your worksheet. Each question has its answer, its state (unanswered, proposed or confirmed), who gave it and when.
- `projects/001-bramble-cafe/ARC-001-FOODPROF-v1.0.md`: the business profile. Its status is `DRAFT` until a named person at the business signs it off.
- `projects/001-bramble-cafe/README.md`, when the folder is first made: a short note for you that says what the folder is, where the worksheets and documents are, and which command to run next. It also asks you to keep the folder private, because it holds the names of the people who work in the business.

The profile also lists every safe method from the five sections, showing any you have marked not relevant or done differently, with the reason and who decided. And it lists your own methods by name, with each one's kind and where its environmental health review stands. So it changes when you mark a safe method not relevant or done differently, or change that reason or who decided; and when you add, confirm or take out one of your own methods, or change its name, kind or review. That is why the profile is signed off last, once everything else is finished. An answer you change inside a section does not change the profile, and nor does anything else you change in one of your own methods: that changes the own methods document only.

Your other documents print the business's name from the profile, and say so at the top if the profile puts the business outside England and Wales. Changing any other profile answer leaves them as they are, and leaves their sign-offs standing, with one exception. Your own methods document needs an entry for every special process or food the profile says you do. If you answer yes to one that has no entry yet, own methods goes back to unfinished and no longer counts as signed off. Record that entry with [`/arckit-uk-food:uk-food-own-methods`](uk-food-own-methods.md). The earlier sign-off does not come back: the own methods document then says something new, so it is written again, as a new version if it had been signed off, and that is the one to sign.

Once a document has been signed off, the command never writes over it. If nothing in it has changed, it writes nothing. If something it prints has changed, it leaves the signed file as it is and writes a new version, which needs signing off again.

## What it will not do, and why

- **It will not answer for you.** An answer it made up would be a statement nobody at the business made. If you ask it to "put the usual", it says the answer has to be yours, and asks again.
- **It will not suggest answers**, even for you to agree to. An answer you only agreed to would still be the tool's answer, not the business's.
- **It will not take your name from anywhere else**, such as your computer's settings or an old document. Only you can say who you are.
- **It will not work out a date.** If you say "last spring", it asks for the exact date.
- **It will not give food safety advice.** If you ask, it points you to your council's environmental health team.
- **It will not write a procedure for a special process.** The business writes its own.
- **It will not sign the document off.** That is a separate step, `/arckit-uk-food:uk-food-sign-off`, for when everything is finished.

Most ArcKit commands fill a gap with a sensible default. This one never does. A question nobody answered stays unanswered, and you can answer it on a later run.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in the document, and the document check will then fail. Run the command again to write the document afresh. Do not edit those lines by hand: changes belong in the worksheet.

## What to do next

Run `/arckit-uk-food:uk-food-safe-methods` to work through the five sections of safe methods, starting with cross-contamination. If the business is outside England and Wales, this overlay has no next step for it.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-profile` in Codex and `/arckit-uk-food-profile` in GitHub Copilot.
