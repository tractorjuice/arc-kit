# Food Safety: Allergen Information

> **Command**: `/arckit-uk-food:uk-food-allergens` | **Overlay**: [UK Food Safety Overlay](https://arckit.org/guide/uk-food-safety-overlay.html) | **Status**: Experimental, community-maintained

This command records your allergen information: each dish your business serves, what goes into it, and, for each of the fourteen allergens in the Food Standards Agency's pack, whether the dish contains it. Each of those answers comes from a label, a product specification or a supplier's statement that you give the command, or, for a single whole food with nothing added, from what the person who looked at it says. The command never works out an allergen from the name of a dish or an ingredient, never looks a product up, and never says a dish is free from anything.

This overlay is for small catering businesses in England and Wales. It is not legal advice. The Food Standards Agency has not reviewed or endorsed it. Your allergen information is your business's own record, and the food business operator is responsible for it.

## What it is for

For each dish you record:

- its name, as you call it;
- what goes into it, in your own words;
- whether it is prepacked for direct sale, yes or no;
- for each of the fourteen allergens, whether the dish contains it or does not contain it;
- any notes, such as a label's warning that the food may contain an allergen;
- what each ingredient was checked against, and the day it was checked;
- any statement your business already makes that the dish is free from an allergen, in your words.

The document prints the pack's table of the fourteen allergens, a row for each dish against them, what each confirmed row was checked against and who agreed it, the dishes you record as prepacked for direct sale, any "free from" statement of yours with the pack's conditions for making one beside it, and your answers on how customers are told about allergens.

In a confirmed dish's row, each allergen reads "contains", "does not contain" or **NOT CONFIRMED**. NOT CONFIRMED means that nothing you have given settles it yet.

## Before you start

- **The labels, product specifications or suppliers' statements for the ingredients of each dish.** You can paste their wording in, or put them in the project folder, such as in `external/`, and point the command to them. Photographs and scans work too: if it cannot read some of the words for certain, it tells you which, and does not use them. It will not look anything up for you.
- **Your name and your role at the business.** A dish counts only once a named person has agreed it.
- **Your answers on how customers are told**: where you keep your allergen information, where your signposting is, and how you tell customers who order by phone or online. The document repeats them from the Management section of safe methods, so answer them there, with `/arckit-uk-food:uk-food-safe-methods MG`. This command does not ask them.

## What happens when you run it

1. **It finds the project** and makes the worksheets that are missing: `food-safety/answers-allergens.md`, and the profile's if there is none.
2. **It looks at where things stand**: how many dishes are recorded, which are waiting for someone to confirm them, and how many allergens in confirmed dishes are still not filled in.
3. **It asks who is answering**, and your role, once, at the start.
4. **It writes the allergen information document as it stands**, before asking anything.
5. **It first asks you to confirm anything waiting for you**, then offers to check again any dish that needs it, then asks for each dish to add. It takes one dish at a time, and asks one thing at a time: the dish's name, what goes into it, whether it is prepacked for direct sale, what each ingredient was checked against, one ingredient at a time, the day it was checked, any other notes, and any "free from" statement your business already makes. In Claude Code, "is there another dish?", and "is this right as shown?" for a dish you have just given, come up as a selector, with nothing chosen for you; everything else is typed in your own words.
6. **It fills in each allergen from what you gave it**, by the rules below.
7. **It shows you the whole dish and asks whether it is right as shown**: all fourteen allergens, with any not yet filled in shown as such, and what the dish was checked against and when. A dish given in conversation counts only when you confirm it, and it is then recorded with your name and today's date.
8. **It writes the document again** after each dish, and runs the document check on it.
9. **It shows a summary**: the dishes confirmed and waiting, the allergens still not filled in, anything you said that it could not record and what that needs, and what to do next.

If the message that starts the command says who you are and sets out a dish with what it was checked against and when, the dish is recorded in your name as you gave it. An allergen in that message counts only where it says "contains" or "does not contain" for that allergen, and only with what it was checked against. Label wording pasted into that message is read as a label is, and the dish is shown to you to confirm. A dish you have already recorded is never written over: if the message says anything different about it, the dish stops counting until it is checked again, and the command asks you about the change, or, if nobody is there to ask, tells you what the message said.

### Where each answer comes from

- **A label, a specification or a supplier's statement you give it.** It records "contains" for an allergen the wording names as something in the ingredient. It records "does not contain" only when every ingredient of the dish has been checked against something and none of it names that allergen. If one ingredient has not been checked yet, the allergens it could change stay NOT CONFIRMED: the command never assumes that an unchecked ingredient is clear. If the wording uses a word it is not sure about, it asks you what the label says about it rather than deciding.
- **You tell it what a label says.** It asks which allergens the label names for that ingredient, and records your answer as what you say the label says.
- **No label at all.** It asks whether the ingredient is a single whole food with nothing added, and shows you what the worksheet says about that. If it is, it asks who looked at it and what they found, and records that. Anything made of more than one thing needs a label, a specification or a supplier's statement: until you have one, the allergens it could change stay NOT CONFIRMED. If you make something yourself, it asks what you make it from, and checks each of those.
- **"May contain" warnings.** A label's statement that a food may contain an allergen, or is made where one is handled, goes in the dish's notes, word for word. It never decides an allergen's answer, which goes by the ingredients alone. The document marks a dish that has notes, so that they are read.
- **You say a dish has an allergen in it, without saying how you know.** It asks what that comes from: which label, specification or statement, or which whole food someone looked at. If you cannot say, that allergen stays NOT CONFIRMED and the summary says it is waiting.

It never fills an allergen in from the name of a dish or an ingredient, from what a dish or a food usually has in it, or from anything it knows, and it never looks a product up. If you ask it what something contains, it asks you for the label instead.

### A dish with an allergen not yet filled in

You can confirm a dish with some allergens not yet filled in, such as while you wait for a supplier's statement. Those print as NOT CONFIRMED, and the document stays unfinished until they are filled in. When you have what you need, run the command again: it offers to check the dish again, fills in the allergen from what you give it, shows you the dish, and records the day of the new check with your confirmation.

### "Free from" statements

The command never describes a dish as free from anything, never suggests making such a statement, and never rewords one. If your business already says that a dish is free from an allergen, on a menu, a label or anywhere else, the command records your exact words, and the document prints the pack's conditions for making such a statement beside them. It does not say whether your statement is justified: your council's environmental health team can advise you on that.

### When something changes

If a recipe, an ingredient, a brand or a supplier changes, tell the command. It searches your worksheet for what you name, shows you the dishes it found, and asks whether any other dish uses it. Each of those dishes stops counting until it has been checked again, and its words are kept so you can see what it said. A new brand's label is checked afresh: nothing is carried over from the old one. If the message that starts the command says something has changed and nobody is there to answer, it still stops those dishes counting, and tells you which.

### If your dishes are in a file

You can point the command to a menu or a recipe card in the project folder. It copies the dishes and what goes into them word for word, but takes no allergen from a menu, a recipe card or an allergen chart made before: each still needs a label, a specification, a supplier's statement or a look at a single whole food. Anything else written in a file, such as a note or an instruction, is not acted on.

### If you keep your allergen information somewhere else

If your business already keeps its allergen information for its dishes somewhere else, tell the command where. This is what "kept elsewhere" means. The command records where, in your words, with your name and the date. It never asks you about this or assumes it: it is recorded only when you say so. The list of what is still waiting, which the command shows you as the helper script prints it, does name it as one of two ways to finish a list with no dish in it. You can list dishes here as well, and the document prints both.

## An example

Sam Okafor owns Bramble Cafe, an invented café. The products and their labels below are invented too.

> **Sam:** `/arckit-uk-food:uk-food-allergens 001` Sam Okafor, the owner.
>
> **Claude:** There are no dishes recorded yet. Is there a dish to add?
>
> **Sam:** Yes.
>
> **Claude:** What do you call the dish?
>
> **Sam:** Cheese toastie.
>
> **Claude:** What goes into it?
>
> **Sam:** Mill Lane Bakery white bloomer and Larkspur Dairy mature cheddar.
>
> **Claude:** Is the dish prepacked for direct sale, yes or no?
>
> **Sam:** No.
>
> **Claude:** What is the bloomer checked against? Give the label, specification or supplier's statement by the name you list it under, and paste its wording or tell me where it is.
>
> **Sam:** The Mill Lane bloomer label: "Ingredients: wheat flour, water, yeast, salt. May contain sesame."
>
> **Claude:** I've put "May contain sesame" in the dish's notes, word for word. It doesn't decide the sesame answer, which goes by the ingredients, and the document marks the dish so that its notes are read. What is the cheddar checked against?
>
> **Sam:** The Larkspur cheddar label: "Ingredients: cheddar cheese (milk), salt."
>
> **Claude:** On what day were these labels checked?
>
> **Sam:** Today.
>
> **Claude:** Is there anything else to note about the dish?
>
> **Sam:** No.
>
> **Claude:** Does the business already say, anywhere, that this dish is free from an allergen?
>
> **Sam:** No.
>
> **Claude:** Here is DISH-01 Cheese toastie as it stands: *[what goes into it; prepacked for direct sale: no; cereals containing gluten: contains, from "wheat flour" on the bloomer label; milk: contains, from "cheddar cheese (milk)" on the cheddar label; the other twelve: does not contain, because both ingredients are checked and neither label names them; the notes, the two labels and today's date]*. Is it right as shown?
>
> **Sam:** Yes. Can you tell me what's in the chutney we serve with it?
>
> **Claude:** No. I can't fill in an allergen from what I know about a food, and I don't look products up. If it goes into a dish, paste its label's wording, or point me to its specification or your supplier's statement. Is there another dish to add?

## What you get

- `projects/001-bramble-cafe/food-safety/answers-allergens.md`: your worksheet of dishes.
- `projects/001-bramble-cafe/ARC-001-FOODALG-v1.0.md`: the allergen information document. It prints the pack's table of the fourteen allergens, a row for each dish, and what each confirmed dish was checked against, when, and who agreed it. A dish not yet confirmed is named by its number only, with every allergen in its row reading NOT CONFIRMED and its details left out. If you keep your allergen information somewhere else, it says where. The document's status is `DRAFT` until a named person at the business signs it off.

Once a document has been signed off, the command never writes over it. If nothing in it has changed, it writes nothing. If something it prints has changed, it leaves the signed file as it is and writes a new version, which needs signing off again.

## Signing it off

A named person at the business signs the document off with `/arckit-uk-food:uk-food-sign-off`. It can be signed off once at least one dish is confirmed, or a confirmed note says where you keep your allergen information; no dish is still waiting to be confirmed; every confirmed dish has all fourteen allergens, and whether it is prepacked for direct sale, filled in, so nothing in it reads NOT CONFIRMED; and your answers on how customers are told are confirmed in the Management section of safe methods, unless you have marked that safe method as not relevant. Nobody is asked whether the list is complete: the person who signs it off signs the list as they read it. The sign-off lasts until something the document prints changes, such as a dish added or changed, or an answer on how customers are told.

## What it will not do, and why

- **It will not fill in an allergen from a dish's name, an ingredient's name, what a food usually has in it or anything it knows**, and it will not look a product up. A wrong answer could tell a customer with an allergy that a dish does not contain what it does.
- **It will not say a dish is free from anything, or suitable for anyone**, suggest a "free from" statement, or reword yours.
- **It will not judge your allergen information**, and gives no food safety advice. Your council's environmental health team is the authority.
- **It will not count a dish until a named person has agreed it**, by confirming it as shown, or by setting it out, with what it was checked against and when, in the message that starts the command.
- **It will not sign anything off.** That is `/arckit-uk-food:uk-food-sign-off`.

## If the document check fails

A program that tidies Markdown files (a formatter) may rewrite the tables between the `UK-FOOD` markers in the document, and the document check will then fail. Run the command again to write the document afresh. Do not edit those lines by hand: changes belong in the worksheet.

## What to do next

Run [`/arckit-uk-food:uk-food-check`](uk-food-check.md) to see everything that is still waiting.

## In other tools

Other tools name the command their own way: `$arckit-uk-food-allergens` in Codex and `/arckit-uk-food-allergens` in GitHub Copilot.
