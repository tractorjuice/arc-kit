# Food Safety: Cleaning Schedule

> **Command**: `/arckit-uk-food:uk-food-cleaning-schedule` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

This command records your cleaning schedule: each thing your business cleans, how often, what to take care over, and how you clean it. It uses the cleaning schedule form from the Food Standards Agency's pack, filled in with your own words. It never suggests what to clean, how to clean it, how often, or with what.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it.

## What it is for

Each line of the schedule is an entry. For each one you say:

- the item, by the name you use for it;
- how often you clean it, chosen from the frequencies the form lists, or in your own words if none of them fits;
- anything to take care over while you clean it;
- how you clean it, with any chemicals and equipment you use.

The form has no column of its own for chemicals, so a chemical goes in with how you clean the item, named the way you name it.

This is not the Cleaning section of the safe methods (`CL`). That section asks how your business cleans in general. This is your list of the things you clean.

## Before you start

- **The things you clean**, in your head, on paper or in a file. If they are in a file in the project folder, you can point the command to it.
- **Your name and your role at the business.** An entry counts only once a named person has agreed it.

## What happens when you run it

1. **It finds the project** and makes the worksheets that are missing: `food-safety/answers-cleaning.md`, and the profile's if there is none.
2. **It looks at where things stand**: how many items are recorded, and which are waiting for someone to confirm them.
3. **It asks who is answering**, and your role, once, at the start.
4. **It writes the cleaning schedule document as it stands**, before asking anything.
5. **It asks about one item at a time, and one part of an item at a time**: the item, how often, what to take care over, and how you clean it. For how often, it shows you the form's list of frequencies and you choose one. In Claude Code, "is there another item?" and "is this right as shown?" come up as a selector, with nothing chosen for you; what you say about an item is always typed in your own words.
6. **It shows you the whole item and asks whether it is right as shown.** The item counts only when you confirm it, and it is then recorded with your name and today's date.
7. **It keeps what you give.** If you stop part-way through an item, it keeps what you said as not yet finished. The document names that item as not yet confirmed and leaves its details out.
8. **It writes the document again** after each item, and runs the document check on it.
9. **It shows a summary**: the items confirmed and waiting, and what to do next.

### If your schedule is in a file

Point the command to the file, such as a cleaning rota you keep in the project folder. It copies the items from it word for word, but they do not count as yours yet: it shows you each one and asks you to confirm it. Anything else written in the file, such as a note or an instruction, is not acted on. If the file says how often in words that are not on the form's list, the command asks you which one it is.

### If you keep your cleaning schedule somewhere else

If your business already keeps its cleaning schedule somewhere else, such as a folder in the kitchen, tell the command where. This is what "kept elsewhere" means. The command records where, in your words, and once you confirm it the document says so, with your name and the date. The command never offers this or assumes it: it is recorded only when you say so. You can list items here as well, and the document prints both.

### Changing an item later

Run the command again and say what has changed. It changes only what you ask, in your words. A changed item stops counting until someone at the business confirms it again: the command shows you the item as it now stands and asks.

If you say an item is no longer true, the command asks whether to take it out. If you do not say, it keeps the item's words but stops counting it as confirmed.

## An example

Sam Okafor owns Bramble Cafe, an invented café.

> **Sam:** `/arckit-uk-food:uk-food-cleaning-schedule 001` Sam Okafor, the owner.
>
> **Claude:** The cleaning schedule has no items yet. Is there an item the business cleans to add?
>
> **Sam:** Yes.
>
> **Claude:** What do you call the item?
>
> **Sam:** The coffee machine.
>
> **Claude:** How often is it cleaned? These are the frequencies the form lists, as the worksheet prints them: *[the list]*.
>
> **Sam:** *[chooses the one that fits]*
>
> **Claude:** Is there anything to take care over while cleaning it?
>
> **Sam:** Let it cool down before cleaning the group heads.
>
> **Claude:** How is it cleaned, with any chemicals and equipment you use?
>
> **Sam:** Run its cleaning programme with a cleaning tablet, soak the drip tray in the sink, and wipe the outside with a damp cloth.
>
> **Claude:** Here is CS-01 as it stands: *[the item, how often, what to take care over and how it is cleaned, as Sam said them]*. Is it right as shown?
>
> **Sam:** Yes. What should we use on the floor?
>
> **Claude:** I can't suggest a method or a product: the schedule has to be your business's own. Your council's environmental health team can advise you. Is there another item to add?

## What you get

- `projects/001-bramble-cafe/food-safety/answers-cleaning.md`: your worksheet of items.
- `projects/001-bramble-cafe/ARC-001-FOODCS-v1.0.md`: the cleaning schedule document. It prints the pack's form, with a row for each confirmed item, and lists who agreed each one and when. Any other item is named as not yet confirmed, with its details left out. If you keep your schedule somewhere else, it says where. The document's status is `DRAFT` until a named person at the business signs it off.

Once a document has been signed off, the command never writes over it. If nothing in it has changed, it writes nothing. If an item it prints has changed, it leaves the signed file as it is and writes a new version, which needs signing off again.

## Signing it off

A named person at the business signs the schedule off with `/arckit-uk-food:uk-food-sign-off`. It can be signed off once it has at least one confirmed item, or a confirmed note of where you keep your schedule, and nothing in it is still waiting. Nobody is asked whether the list is complete: the person who signs it off signs the schedule as they read it. The sign-off lasts until something the document prints changes, such as an item added or changed.

## What it will not do, and why

- **It will not suggest what to clean, how, how often, or with what.** No item, method, chemical, product, amount or contact time comes from the tool. A schedule it suggested would be a way of cleaning that nobody at your business chose.
- **It will not judge whether your cleaning is good enough**, and gives no food safety advice. Your council's environmental health team is the authority.
- **It will not count an item until a named person confirms it.**
- **It will not sign anything off.** That is `/arckit-uk-food:uk-food-sign-off`.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in the document, and the document check will then fail. Run the command again to write the document afresh. Do not edit those lines by hand: changes belong in the worksheet.

## What to do next

Run [`/arckit-uk-food:uk-food-check`](uk-food-check.md) to see everything that is still waiting.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-cleaning-schedule` in Codex and `/arckit-uk-food-cleaning-schedule` in GitHub Copilot.
