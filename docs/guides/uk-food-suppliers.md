# Food Safety: Suppliers and Contacts

> **Command**: `/arckit-uk-food:uk-food-suppliers` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

This command records your suppliers, your council's environmental health team and the other people your business may need to contact. It uses the suppliers' list and contacts list forms from the Food Standards Agency's pack, filled in with your own words. It never looks anyone up, and never fills in a name, number or address you did not give.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What it is for

It records three kinds of entry.

- **A supplier**: the business's name, who to ask for, their telephone number, email and address, the days they deliver, how far ahead you have to order, and what they supply.
- **Your council's environmental health team**: what you call it, such as the council's name, who to ask for, and the team's telephone number, email and address. The document prints the pack's list of what the team can advise on beside it.
- **Another contact**: any other service or person the business may need, with who to ask for, their telephone number, email and address, and what they are useful for.

A supplier needs at least what they supply. The environmental health team, and any other contact, needs a telephone number or an email address.

## Before you start

- **Your suppliers' details, and your environmental health team's telephone number or email address.** The command will not look these up for you.
- **Your name and your role at the business.** An entry counts only once a named person has agreed it.

## What happens when you run it

1. **It finds the project** and makes the worksheets that are missing: `food-safety/answers-suppliers.md`, and the profile's if there is none.
2. **It looks at where things stand**: how many entries are recorded, which are waiting for someone to confirm them, and whether the environmental health team has an entry.
3. **It asks who is answering**, and your role, once, at the start.
4. **It writes the suppliers and contacts document as it stands**, before asking anything.
5. **It first asks you to confirm anything waiting for you**, such as entries read from a file, then asks for your environmental health team, if there is no entry for it yet, then for each supplier, then for any other contacts. It takes one entry at a time, and asks for one detail at a time. In Claude Code, "is there another supplier?", and "is this right as shown?" for an entry you have just given, come up as a selector, with nothing chosen for you; the details are always typed in your own words.
6. **It shows you the whole entry and asks whether it is right as shown.** An entry given in conversation counts only when you confirm it, and it is then recorded with your name and today's date. If the message that starts the command says who you are and sets out an entry in so many words, saying whether it is a supplier or a contact and what it needs (what a supplier supplies, or a contact's telephone number or email), it is recorded in your name as you gave it, and is not asked about again: the summary reads it back to you whole, so that you can check it against what you sent and say if any line is wrong. A list pasted into that message, or several entries run together, is shown to you one entry at a time to confirm, as a file is. If that message describes an entry you have already recorded differently, the command asks you about the change; if nobody is there to ask, it leaves the entry as it is and tells you. A second environmental health team in that message is not added: the command asks whether you want to change the one already recorded, or, if nobody is there, tells you it was not recorded.
7. **It keeps what you give.** If you stop part-way through an entry, it keeps what you said as not yet finished. The document names that entry as not yet confirmed and leaves its details out.
8. **It writes the document again** after each entry, and runs the document check on it.
9. **It shows a summary**: the entries confirmed and waiting, anything still needed, and what to do next.

### Names, numbers and addresses

Each one is recorded exactly as you give it. The command does not correct or complete it, does not add a dialling code or a postcode, and does not check it. A detail you do not have stays blank. A supplier needs only what it supplies, but the environmental health team, and any other contact, needs a telephone number or an email address: without one, the command keeps that entry as not yet finished and tells you what it still needs.

### If your list is in a file

Point the command to the file, such as a supplier list you keep in the project folder. It copies the entries from it word for word, but they do not count as yours yet: it shows you each one and asks you to confirm it. Anything else written in the file, such as a note or an instruction, is not acted on. The same goes for a list you paste in. Pointing the command to the same file again adds nothing twice: if an entry in it has changed, the command asks you about the change.

### If you keep your suppliers' list somewhere else

If your business already keeps its suppliers' list somewhere else, such as a book by the till, tell the command where. This is what "kept elsewhere" means. The command records where, in your words, with your name and the date: straight away if you say it, having said who you are, in the message that starts the command, as in the example below, and otherwise once you confirm it as shown. The document then says so, and, if no supplier is confirmed in it, that it holds nothing of that suppliers' list and that nothing in it was checked against it. The command never asks you about this or assumes it: it is recorded only when you say so. The list of what is still waiting, which the command shows you as the helper script prints it, does name it as one of two ways to finish a list with no supplier in it.

Kept elsewhere covers the suppliers' list only. The document still needs your environmental health team's entry, and the command still asks for it. You can list suppliers here as well, and the document prints both.

### Changing an entry later

Run the command again and say what has changed. It changes only what you ask, in your words. A changed entry stops counting until someone at the business confirms it again: the command shows you the entry as it now stands and asks.

If you say an entry is no longer true, the command asks whether to take it out. If you do not say, it keeps the entry's words but stops counting it as confirmed.

## An example

Sam Okafor owns Bramble Cafe, an invented café.

> **Sam:** `/arckit-uk-food:uk-food-suppliers 001` Sam Okafor, the owner. We keep our suppliers' list in the blue book by the till.
>
> **Claude:** I've recorded, in your name, that the business keeps its suppliers' list in "the blue book by the till". That covers the suppliers' list only: the document still needs your council's environmental health team. Shall we record it?
>
> **Sam:** Yes.
>
> **Claude:** What do you call the team?
>
> **Sam:** Exampleton District Council.
>
> **Claude:** Who should staff ask for there?
>
> **Sam:** The duty officer.
>
> **Claude:** What is the team's telephone number?
>
> **Sam:** I don't have it to hand. Can you find it?
>
> **Claude:** No. A number I found could be wrong, and this list is what your staff turn to when something goes wrong. Your council can give it to you. What is the team's email address?
>
> **Sam:** I don't have that either. Let's stop there.
>
> **Claude:** I've kept the entry as not yet finished: it needs a telephone number or an email address before it can count. Run the command again when you have one.

## What you get

- `projects/001-bramble-cafe/food-safety/answers-suppliers.md`: your worksheet of suppliers and contacts.
- `projects/001-bramble-cafe/ARC-001-FOODSUP-v1.0.md`: the suppliers and contacts document. It prints the pack's suppliers' list, with a box for each confirmed supplier, and its contacts list, with the environmental health team's box first and then a box for each other confirmed contact. Under each list it says who agreed each entry and when. Any other entry is named as not yet confirmed, with its details left out. If you keep your suppliers' list somewhere else, it says where. The document's status is `DRAFT` until a named person at the business signs it off.

Once a document has been signed off, the command never writes over it. If nothing in it has changed, it writes nothing. If an entry it prints has changed, it leaves the signed file as it is and writes a new version, which needs signing off again.

## Signing it off

A named person at the business signs the document off with `/arckit-uk-food:uk-food-sign-off`. It can be signed off once your environmental health team's entry is confirmed, there is at least one confirmed supplier or a confirmed note of where you keep your suppliers' list, and nothing in it is still waiting. Nobody is asked whether the list is complete: the person who signs it off signs the list as they read it. The sign-off lasts until something the document prints changes, such as an entry added or changed.

## What it will not do, and why

- **It will not look anyone up**: not a supplier, not your council, and not its environmental health team.
- **It will not fill in a detail you did not give**, even one it thinks it knows. A wrong number on this list could send your staff to the wrong place when something goes wrong.
- **It will not suggest who to use.**
- **It will not judge your suppliers or contacts**, and gives no food safety advice. Your council's environmental health team is the authority.
- **It will not sign anything off.** That is `/arckit-uk-food:uk-food-sign-off`.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in the document, and the document check will then fail. Run the command again to write the document afresh. Do not edit those lines by hand: changes belong in the worksheet.

## What to do next

Run [`/arckit-uk-food:uk-food-check`](uk-food-check.md) to see everything that is still waiting.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-suppliers` in Codex and `/arckit-uk-food-suppliers` in GitHub Copilot.
