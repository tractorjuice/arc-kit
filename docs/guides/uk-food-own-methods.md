# Food Safety: Own Methods and Special Processes

> **Command**: `/arckit-uk-food:uk-food-own-methods` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

The Food Standards Agency's pack does not cover everything a business does. This command records the food safety controls that are your business's own, and your own written procedure for any special process the business does, word for word. It never writes a method or a procedure for you.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What it is for

It records two kinds of entry.

**A control of your own** (the worksheet calls this kind "additional"): something your business does that the pack does not cover. You say:

- what could go wrong (the hazard);
- what you do about it (the control);
- how you check it;
- what you do if it fails.

You can also give a limit you work to, but only together with where that figure comes from.

**A special process** (the worksheet calls this kind "special-process"): the profile asks whether the business does each of the special processes and foods that the pack names as needing extra care. For each one it does, this overlay asks for an entry holding the business's own written procedure. The own methods document cannot be signed off until each one has its entry. Each entry records:

- which special process or food it covers, by the name the pack uses;
- your written procedure, word for word;
- your council's environmental health review: pending, until you tell the command the date and outcome of the council's review.

## Before you start

- **The business profile, with its special processes answered.** If there is no profile worksheet yet, the command makes a blank one, tells you to run `/arckit-uk-food:uk-food-profile`, and carries on.
- **Your written procedure for each special process**, typed out or in a file. If the business has not written one yet, write it first. Your council's environmental health team is the one to ask about it.
- **Your name and your role at the business.** Only an entry from a named person counts.

## What happens when you run it

1. **It finds the project** and makes the worksheets that are missing: `food-safety/answers-own.md`, and the profile's if there is none.
2. **It looks at where things stand**: which special processes and foods the profile confirms, and whether each already has an entry.
3. **It asks who is answering**, and your role, once, at the start.
4. **It writes the own methods document as it stands**, before asking anything.
5. **It offers to record each special process that has no entry**, then asks whether the business has any other controls of its own. It takes one entry at a time, and asks for one part of an entry at a time. In Claude Code the opening offers come up as a yes or no selector; what you say about a method is always typed in your own words.
6. **It keeps what you give, and asks for the rest.** If you give only part of an entry and stop, it records that part in your words as not yet finished. A part-given entry is named in the document as not yet confirmed, with its contents left out, and the own methods document cannot be signed off until the entry is finished or you ask for it to be taken out.
7. **It records the entry in your words**, with your name and today's date, writes the document again and runs the document check on it. The entry's name is yours too, unchanged. If you give no name for a special process, the entry takes the pack's name for that process.
8. **It shows a summary**: the entries confirmed and waiting, each special process with its entry (or none) and its review, and what to do next.

### Recording a special process

- **Which one.** The command shows you the list of names exactly as the worksheet prints it, and asks which one your procedure covers. The entry uses that name exactly.
- **Your procedure, word for word.** Paste it in, or point the command to the file it is in. The command keeps every line as you wrote it, with its blank lines and its indentation. It does not correct spelling, figures or order, and does not shorten, reword or add to it. The document prints it in a box of its own, exactly as written.
- **The council's review.** The entry records the environmental health review as pending. If the council has already replied, or replies later, run the command and give the date and what they said: it records them in that entry, in your words, and changes no other field. The entry then carries the name of the person who recorded the reply and the date they recorded it, because whoever changes an entry is confirming it as it now stands, procedure included. The command tells you this before it records the change. If you say "last month", it asks for the exact date.
- **No procedure yet.** The command writes no procedure for you. It keeps anything else you have told it about the process as an entry that is not yet finished, and it tells you that the business needs to write its own, that your council's environmental health team is the one to ask about it, and that the command will record it word for word once it is written.

### Changing an entry later

Run the command again and say what has changed. It records the change in your words, with your name and today's date, and changes nothing you did not ask it to.

If you say an entry is no longer true, the command asks whether to take it out. If you do not say, it keeps the entry's words but stops counting it as confirmed, so it drops out of the document until someone at the business confirms it again.

### Recording a control of your own

The command records the hazard, the control, the check and what you do if it fails, all in your words. It records a limit only if you give one, and then it needs to know where the figure comes from. It never supplies a figure or a source itself, and never takes one from the pack.

## An example

Sam Okafor owns Bramble Cafe, an invented café. The profile says the café does two special processes.

> **Sam:** `/arckit-uk-food:uk-food-own-methods 001` Sam Okafor, the owner.
>
> **Claude:** Your profile says Bramble Cafe does two special processes, and neither has an entry yet. Shall we record your written procedure for the first? These are the names the worksheet allows, as it prints them: *[the list]*. Which one does your procedure cover?
>
> **Sam:** *[names one of the listed special processes]*. Here's our written procedure. *[Sam pastes the café's own procedure.]*
>
> **Claude:** I've recorded it word for word, every line as you wrote it, and I've recorded the council's review as pending. Do you confirm the entry?
>
> **Sam:** Yes. Could you also tidy it up and add anything that's missing?
>
> **Claude:** No. A procedure I wrote or changed would be a control nobody at Bramble Cafe has tested, presented as yours. If you are not sure it is complete, ask your council's environmental health team.

## What you get

- `projects/001-bramble-cafe/food-safety/answers-own.md`: your worksheet of own entries.
- `projects/001-bramble-cafe/ARC-001-FOODOWN-v1.0.md`: the own methods document. It shows only confirmed entries. Any other entry is named as not yet confirmed, with its contents left out. A written procedure appears as the business's own text, marked as not written or checked by this tool. The document's status is `DRAFT` until a named person at the business signs it off.

Once a document has been signed off, the command never writes over it. If nothing in it has changed, it writes nothing. If an entry it prints has changed, it leaves the signed file as it is and writes a new version, which needs signing off again. One case is worth knowing. If the profile now says you do a special process or food that has no entry here, this document counts as unfinished although nothing in it has changed. There is nothing new to write, so the command tells you which entry is missing; once you have given it, the new version is written.

## What it will not do, and why

- **It will not write, finish, correct or improve a procedure**, whatever the reason given. A procedure written by this tool would be a control that nobody at the business has tested, presented as theirs.
- **It will not suggest a method, a hazard, a limit or a source.** An entry it supplied would be a statement nobody at the business made.
- **It will not judge whether a method or procedure is adequate**, and gives no food safety advice. Your council's environmental health team is the authority.
- **It will not sign anything off.** That is `/arckit-uk-food:uk-food-sign-off`.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in the document, and the document check will then fail. Run the command again to write the document afresh. Do not edit those lines by hand: changes belong in the worksheet.

## What to do next

Run [`/arckit-uk-food:uk-food-check`](uk-food-check.md) to see everything that is still waiting, including any special process whose environmental health review is still pending.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-own-methods` in Codex and `/arckit-uk-food-own-methods` in GitHub Copilot.
