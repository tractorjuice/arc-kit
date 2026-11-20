# Differences between the FSA's individual sheets and the full pack

Source: *Safer food, better business for caterers*, published by the Food Standards Agency at <https://www.gov.uk/government/publications/safer-food-better-business-for-caterers>, retrieved 17 November 2026.

Contains public sector information licensed under the Open Government Licence v3.0.

The full pack, `sfbb-caterers-pack-fixed_0_3.pdf` (100 pages), is the source of truth for this overlay. The same publication page also offers the pack as 38 individual sheets. This note lists every place where a sheet's wording differs from the full pack's. In every case the overlay uses the full pack's wording.

## How the sheets were compared

- Each sheet's text layer was extracted with `scripts/uk-food/extract-textlayer.py`, and each sheet page was matched to the full-pack page it shares the most words with. Six sheets (06, 08, 09, 11, 12 and 14) have Chinese or Indian cuisine file names but hold the caterers wording, so they were matched by their content, not their names.
- The words were compared in reading order, ignoring capital letters, punctuation at the start or end of a word, line breaks, spacing, a word split at the end of a line, and page furniture (the footer and the "SAFE METHOD:" label). Pictures were not compared.
- Where a sheet's text layer gives a block of text in a different order from the full pack's, both printed pages were compared by eye. A block printed in the same place on both pages is not a difference.
- Pages 1 to 12, 27 and 28, 38 and 39, 48 and 49, and 64 and 65 (the front matter and the section title and introduction pages) have no individual sheet.

Words in **bold** are the ones that differ.

## Differences that change a figure, a time, a temperature or a legal statement

No sheet changes a printed figure or temperature. Three differences change a time limit, a legal statement or a time:

1. `22-sfbb-caterer-cooking-07-ready-to-eat-food.pdf`, pack page 63 (CK-07 Ready-to-eat food). The sheet applies the 3-day limit only to high-risk ready-to-eat foods, as the full pack's page 40 (CH-01) also does; the full pack's page 63 applies it to all ready-to-eat foods.
   - Full pack: "Ready-to-eat foods should be kept for a maximum of 3 days in total (day of cook/opening + 2) unless you have evidence that it is safe to keep them for longer."
   - Sheet: "**High risk** ready-to-eat foods should be kept for a maximum of 3 days in total (day of cook/opening + 2) unless you have evidence that it is safe to keep them for longer."
2. `26-sfbb-management-03-managing-food-allergen-information_2_3.pdf`, pack page 70 (MG-04 Managing food allergen information). The full pack says a business making prepacked for direct sale food is required to label it; the sheet says it is "regulated to label" it.
   - Full pack: "Since October 2021, any business that produces prepacked for direct sale (PPDS) food is **required** to label it with the name of the food and a full ingredients list, with allergenic ingredients emphasised within the list."
   - Sheet: "Since October 2021, any business that produces prepacked for direct sale (PPDS) food is **regulated** to label it with the name of the food and a full ingredients list, with allergenic ingredients emphasised within the list."
3. `33-sfbb-diary-02-introduction_4.pdf`, pack page 81 (the diary introduction). The sheet adds a sentence giving the time the diary should take; the full pack does not print it.
   - Full pack: the bullet "your safe methods have been followed" is followed by the paragraph "If anything different happens, …".
   - Sheet: between the two is the paragraph "**The diary should take about one minute a day to complete, unless you have something special to write down.**"

The overlay uses the full pack's wording for all three.

## Sheets whose wording differs

### `02-sfbb-caterers-personal_hygiene_0_0.pdf`

Pack pages 13 and 14 (XC-01 Personal hygiene and fitness to work).

- Page 13, the opening paragraph.
  - Full pack: "… to help prevent foodborne illnesses due to bacteria and viruses spreading to food."
  - Sheet: "… to help prevent foodborne illnesses due to bacteria and viruses **from** spreading to food."

The overlay uses the full pack.

### `05-sfbb-caterers-separating-foods_2.pdf`

Pack pages 17 and 18 (XC-03 Separating foods).

- Page 17.
  - Full pack: "Raw foods include raw meats **and** unwashed salad, vegetables and fruits."
  - Sheet: "Raw foods include raw meats **&** unwashed salad, vegetables and fruits."
- Page 17.
  - Full pack: "**Additionally,** allergen free **food** should be **kept** separately **where possible to avoid cross contamination.**"
  - Sheet: "**Where possible,** allergen free **foods** should be **prepared** separately **from allergen containing foods.**"
- Page 17.
  - Full pack: "Guidance on how to vacuum pack **your** chilled **food products safely can be found on the FSA website.**"
  - Sheet: "**Read** guidance on how to vacuum pack chilled **foods.**"
- Page 18.
  - Full pack: "You should **never** use the same equipment, such as vacuum packing machines, slicers and mincers, for both raw and ready-to-eat food."
  - Sheet: "You should **not** use the same equipment, such as vacuum packing machines, slicers and mincers, for both raw and ready-to-eat food."

The overlay uses the full pack.

### `07-sfbb-caterers-pack-pest-control_0_4.pdf`

Pack pages 23 and 24 (XC-06 Pest control).

- Page 23.
  - Full pack: "Make sure bins for storing **food waste** have close-fitting lids and are easy to clean and clean and disinfect regularly."
  - Sheet: "Make sure bins for storing **foods** have close-fitting lids and are easy to clean and clean and disinfect regularly."
- Page 23, the table of pests.
  - Full pack: "Flies and flying insects **for example,** moths"
  - Sheet: "Flies and flying insects **e.g.** moths"
- Page 24.
  - Full pack: "Make sure no food or dirty plates etc. are left **out** when the business is closed …"
  - Sheet: "Make sure no food or dirty plates etc. are left when the business is closed …"

The overlay uses the full pack.

### `09-sfbb-indian-cuisines-handwashing_0.pdf`

Pack pages 29 and 30 (CL-01 Handwashing).

- Page 30, a box heading.
  - Full pack: "WHEN TO WASH YOUR HANDS **(see some examples below)**"
  - Sheet: "WHEN TO WASH YOUR HANDS"
- Page 30.
  - Full pack: "When entering the kitchen **for example,** after a break or going to the toilet."
  - Sheet: "When entering the kitchen **e.g.** after a break or going to the toilet."

The overlay uses the full pack.

### `17-sfbb-caterer-cooking-01-cooking-safely_0.pdf`

Pack pages 50 and 51 (CK-01 Cooking safely).

- Page 50.
  - Full pack: "Preheat equipment such as ovens and grills before cooking as per **manufacturer** instructions if available. **Read more in 'Cooking Safely'.**"
  - Sheet: "Preheat equipment,such as ovens and grills,before cooking, as per **manufacturers** instructions if available. **Read FSA guidance: Cooking safely in your business.**"
- Page 50.
  - Full pack: "… make sure all of the outside surfaces are fully cooked, **e.g.** by sealing in a pan."
  - Sheet: "… make sure all of the outside surfaces are fully cooked, **for example,** by sealing in a pan"
- Page 50.
  - Full pack: "Whole cuts of meat, such as steaks **and** joints, only ever have bacteria on the outside surface of the meat."
  - Sheet: "Whole cuts of meat, such as steaks **ad** joints, only ever have bacteria on the outside surface of the meat."
- Page 50.
  - Full pack: "… must be cooked to a safe temperature in the centre of the meat (see ‘Prove it’). **Read more in 'Cooking Safely'.**"
  - Sheet: "… must be cooked to a safe temperature in the centre of the meat (see ‘Prove it’). **Cooking safely in your business.**"
- Page 50.
  - Full pack: "Turn meat during cooking. **Read more in 'Cooking Safely'.**"
  - Sheet: "Turn meat during cooking, **read cooking safely in your business.**"
- Page 51. The full pack's "ares" reads as a misprint of the sheet's "area".
  - Full pack: "Check whole birds are cooked to a safe temperature in the thickest **ares** which is between the leg and breast. (see ‘Prove it’)."
  - Sheet: "Check whole birds are cooked to a safe temperature in the thickest **area** which is between the leg and **the** breast (see ‘Prove it’)."

The overlay uses the full pack.

### `19-sfbb-caterer-cooking-03-reheating_2.pdf`

Pack pages 54 and 55 (CK-03 Reheating).

- Page 54.
  - Full pack: "… reheat food that you have cooked, you should stir it while reheating."
  - Sheet: "… reheat food that you have cooked **yourself,** you should stir it while reheating."
- Page 54.
  - Full pack: "The manufacturer has tested **its** instructions to make sure that products will be properly reheated."
  - Sheet: "The manufacturer has tested **their** instructions to make sure that products will be properly reheated."
- Page 54.
  - Full pack: "Serve reheated food immediately, **or put it** straight into hot holding."
  - Sheet: "Serve reheated food immediately, **unless it is going** straight into hot holding."
- Page 55.
  - Full pack: "Check your equipment is working correctly."
  - Sheet: "Check **that** your equipment is working correctly."

The overlay uses the full pack.

### `22-sfbb-caterer-cooking-07-ready-to-eat-food.pdf`

Pack pages 62 and 63 (CK-07 Ready-to-eat food).

- Page 63: "High risk" ready-to-eat foods, listed first above under the differences that change a time limit.

The overlay uses the full pack.

### `26-sfbb-management-03-managing-food-allergen-information_2_3.pdf`

Pack pages 70 to 72 (MG-04 Managing food allergen information). Pages 71 and 72 do not differ.

- Page 70: "required" against "regulated", listed first above under the differences that change a legal statement.
- Page 70.
  - Full pack: "… a sign must be displayed informing the **customer** where the information can be found)"
  - Sheet: "… a sign must be displayed informing the **customers** where the information can be found"
- Page 70.
  - Full pack: "Staff should know where allergen information can be found (**e.g.** recipe sheets, food labels) …"
  - Sheet: "Staff should know where allergen information can be found (**for example,** recipe sheets, food labels) …"
- Page 70.
  - Full pack: "**Customer** with hypersensitivities (allergy, intolerance and Coeliac Disease) need to know …"
  - Sheet: "**Customers** with hypersensitivities (allergy, intolerance and Coeliac Disease) need to know …"
- Page 70. The full pack's sentence lacks the word "found".
  - Full pack: "Technical guidance on food allergen **labeling** and information requirements, as well as information on the fourteen regulated allergens can be **on the FSA website:** General background on allergens."
  - Sheet: "Technical guidance on food allergen **labelling** and information requirements, as well as information on the fourteen regulated allergens can be **found here: Food allergen labelling and information requirements technical guidance:** General background on allergens."
- Page 70. The full pack's sentence lacks a verb after "where to".
  - Full pack: "… there must be clear signposting letting customers know where to this information if they need it."
  - Sheet: "… there must be clear signposting letting customers know where to **obtain** this information if they need it."
- Page 70.
  - Full pack: "This helps people with food **hypersensitivities** to spot which dishes contain certain ingredients."
  - Sheet: "This helps people with food **hypersensitivity** to spot which dishes contain certain ingredients."

The overlay uses the full pack.

### `27-sfbb-management-04-training-and-supervison-customers_4.pdf`

Pack pages 73 and 74 (MG-05 Training and supervision, MG-06 Customers).

- Page 73.
  - Full pack: "More information on food hygiene training **can** be found on the FSA website: online food safety training. Allergy **and** intolerance training can also be completed on the FSA website."
  - Sheet: "More information on food hygiene training **ca** be found on the FSA website: online food safety training Allergy Intolerance training **which** can also be completed on the FSA website: **FSA Food Allergy training.**"
- Page 73.
  - Full pack: "Sometimes there may be more than one person responsible during the day, **e.g.** when there is more than one shift, …"
  - Sheet: "Sometimes there may be more than one person responsible during the day, **for example,** when there is more than one shift, …"
- Page 74.
  - Full pack: "It may also be appropriate to inform the supplier who provided you with the food if the problem may have arisen at their premises. **More information in our Root Cause Analysis Training.**"
  - Sheet: "It may also be appropriate to inform the supplier who provided you with the food if the problem may have arisen at their premises."

The overlay uses the full pack.

### `33-sfbb-diary-02-introduction_4.pdf`

Pack pages 81 and 82 (the diary introduction; opening and closing checks, extra checks). Page 82 does not differ.

- Page 81: the added sentence "The diary should take about one minute a day to complete, unless you have something special to write down.", listed first above under the differences that change a time.

The overlay uses the full pack.

### `39-sfbb-diary-07-diary-and-4-weekly-review-fixed_0.pdf`

Pack pages 94 to 100 (the diary week, with the worked example on page 94, and the 4-weekly review, with the worked example on page 99). Pages 99 and 100 do not differ.

- Pages 94 to 98, the prompt in the EXTRA CHECKS box of every week page, the worked example included.
  - Full pack: "EXTRA CHECKS **Any problems or changes – what did you do?**"
  - Sheet: "EXTRA CHECKS **We have performed the following extra checks this week**"

The overlay uses the full pack.

## Sheets whose wording does not differ

These sheets match the full pack word for word, apart from line breaks, spacing, page furniture and the order in which their text layer gives the blocks of a page.

| Sheet | Pack pages | Content |
| --- | --- | --- |
| `03-sfbb-caterers-pack-food-allergies_0.pdf` | 19, 20 | XC-04 Food hypersensitivity |
| `04-sfbb-caterers-cloths_0.pdf` | 15, 16 | XC-02 Cloths |
| `06-fsa-sfbb-chinese-cuisine-cross-contamination-physical_and_chemical_contamination_2__1_.pdf` | 21, 22 | XC-05 Physical and chemical contamination |
| `08-fsa-sfbb-chinese-cuisine-pack-maintenance_1.pdf` | 25, 26 | XC-07 Maintenance |
| `10-sfbb-cleaning-04-your-cleaning-schedule-fix_1.pdf` | 36, 37 | CL-04 Your cleaning schedule |
| `11-sfbb-chinese-cleaning-02-cleaning-effectively.pdf` | 31 to 33 | CL-02 Cleaning effectively |
| `12-sfbb-indian-cuisines-clean-clear-as-you-go_0.pdf` | 34, 35 | CL-03 Clear and clean as you go |
| `13-sfbb-chilling-01-chilled-storage-and-display_4.pdf` | 40, 41 | CH-01 Chilled storage and displaying chilled food |
| `14-fsa-sfbb-chinese-cuisine-chilling_1.pdf` | 42, 43 | CH-02 Chilling down hot food |
| `15-sfbb-chilling-03-defrosting_3_1.pdf` | 44, 45 | CH-03 Defrosting |
| `16-sfbb-chilling-04-freezing.pdf` | 46, 47 | CH-04 Freezing |
| `18-sfbb-caterer-cooking-02-foods-that-need-extra-care_0.pdf` | 52, 53 | CK-02 Foods that need extra care |
| `20-sfbb-caterer-cooking-05-checking-your-menu_0.pdf` | 58, 59 | CK-05 Checking your menu |
| `21-sfbb-caterer-cooking-06-hot-holding_0.pdf` | 60, 61 | CK-06 Hot holding |
| `23-sfbb-caterer-cooking-04-acrylamide_0.pdf` | 56, 57 | CK-04 Acrylamide |
| `24-sfbb-management-01-opening-closing-checks__1__1.pdf` | 66, 67 | MG-01 Opening and closing checks, MG-02 Extra checks |
| `25-sfbb-management-02-prove-it_4.pdf` | 68, 69 | MG-03 Prove it |
| `28-sfbb-management-05-suppliers-and-contractors.pdf` | 75 | MG-07 Suppliers and contractors |
| `29-sfbb-management-06-stock-control_4.pdf` | 76 | MG-08 Stock control |
| `30-sfbb-management-07-product-recall_4.pdf` | 77 | MG-09 Product withdrawal and recall |
| `31-sfbb-management-08-safe-method-completion-record.pdf` | 78, 79 | Safe method completion record |
| `32-fsa-sfbb-diary-front-cover_0.pdf` | 80 | Diary cover |
| `34-fsa-sfbb-diary-training-record_0.pdf` | 83 to 86 | Staff training record |
| `35-fsa-sfbb-diary-suppliers-list_1.pdf` | 87, 88 | Suppliers' list |
| `36-fsa-sfbb-contacts-list_0.pdf` | 89, 90 | Contacts list |
| `37-fsa-sfbb-cleaning-schedule_0.pdf` | 91, 92 | Cleaning schedule |
| `38-fsa-sfbb-prove-it.pdf` | 93 | Prove it: records |
