# LinkedIn Version: A Bid Can't Mark Its Own Homework

Post on the ArcKit page with the article hero, `docs/articles/2026-11-07-arckit-v6-20-a-bid-cant-mark-its-own-homework-hero.png`; the alt text is below the post. Attach the image before pasting the text, so the link doesn't replace it with a preview card. Maintainer's voice.

## LinkedIn Post Body

ArcKit 6.20.0 stops a supplier's bid marking its own homework.

A supplier wants a high score, and hiding an instruction in a proposal is a cheap way to try for one. So reading a bid and scoring it are now separate. A read-only reader opens one supplier's documents at a time and returns short claims against each criterion. Scoring sees the claims and never the bid.

No claim, no marks. A bid that can't be read stays unscored. Every score traces back to a file and a location, and planted text gets reported, not followed.

It isn't bulletproof. Scoring is still a judgement on what a supplier claims, so check the claims behind any close result.

Also in this release: arc42 from your existing artefacts, thanks to Chris McKelt, and NORA and GEMMA for Dutch government, thanks to @trednets.

https://arckit.org/share/2026-11-07-arckit-v6-20-a-bid-cant-mark-its-own-homework.html

#EnterpriseArchitecture #Procurement #DigitalGovernment #OpenSource

## Image Alt Text

ArcKit v6.20.0: a bid can't mark its own homework. A supplier's bid goes to a read-only reader, one supplier at a time, and stops at a wall. Only short claims cross it to the scoring, where each score traces to a file and a location. No claim, no marks. Planted text is reported, not followed. An unreadable bid stays unscored. Also new: arc42 from your existing artefacts, and NORA and GEMMA for Dutch government.
