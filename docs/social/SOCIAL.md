# ArcKit — social kit

What goes where, in what voice, and what never goes on a post. Borrowed in shape from the Forking Chefing social kit: one page that says which file fits which slot, a small set of rules that bind every post, a voice test judged on the platforms' own numbers, and every card rendered from code so a figure is corrected once and re-rendered, not edited in an image editor.

It serves the Q4 campaign, *Show Your Working* (`docs/plans/2026-09-22-marketing-strategy-q4.md`). The campaign's goal is named adopters and case studies, not reach, so a post earns its place by moving someone one step along: aware → tried it → told us → case study.

**Status:** draft for the maintainer. Nothing here has been posted.

---

## Where ArcKit posts

One job per channel, and never the same text in two places. Decided 30 September 2026, when the page had 1 follower and the group 161 members (663 active, 1,093 post views in 15 days), so the group is where the reach is for now.

| Channel | Address | Its job | What goes there | Voice |
|---|---|---|---|---|
| LinkedIn group | linkedin.com/groups/17641034 | **Main place to reach people** | Findings framed as a question, asks for feedback, the adopter ask, office hours. Posts appear under the maintainer's name | Question, "we" |
| LinkedIn page | linkedin.com/company/**arckit-org** | The official record | Releases and articles, with one image or carousel each. **Not** linkedin.com/company/arckit, which is an unrelated education firm in Dublin | Warm "we" |
| Maintainer's own LinkedIn | — | Reach | A reshare of the page post with a line of the maintainer's own. The maintainer's call each time, and theirs to post | Theirs |
| Discord #announcements | ArcKit server (read-only) | For existing users | Releases and "what changed for you", short, linked | Short "we" |
| Discord #show-your-working | ArcKit server (open) | Conversation | Results, adopter chat, help; the private route for adopters who can't post a public GitHub issue | Informal |
| Medium | medium.com/arckit | Article mirrors | The article, unchanged | Article |

**Order for each new piece:**

1. Post it on the ArcKit page.
2. The same day, post the group's question version, worded differently.
3. The maintainer reshares it on their own profile, if they choose to.
4. Post in Discord #announcements only if it changes something for people who already use ArcKit, such as a release or template fixes.

The primary audience (UK public sector architects) is on LinkedIn and in the cross-government architecture community, not on TikTok or Instagram. The chef kit needed seven platforms because diners are everywhere; ArcKit needs two done well. **YouTube Shorts is the one addition worth trying**, for the 30-second video below, because a Short can be embedded in the landing page and linked from LinkedIn.

## What to upload where

| Slot | Size | File |
|---|---|---|
| LinkedIn document carousel | PDF, 1080 × 1350 pages | `docs/social/out/<series>/carousel.pdf` |
| LinkedIn single image | 1200 × 627 | the article hero, via its share link |
| Link preview (any platform) | 1200 × 630 | automatic from `https://arckit.org/share/<slug>.html` |
| Discord | any | attach slide 1 of a series; link the share page |
| Instagram / portrait (if ever used) | 1080 × 1350 | `docs/social/out/<series>/slide-N-1080x1350.png` |

Link to `https://arckit.org/share/<slug>.html`, never to `article-viewer.html?a=…`: the viewer is rendered in the browser, so link previews only ever see a generic card. LinkedIn fixes a post's preview when it is published, so a wrong card means deleting and reposting, not editing. Add `?utm_campaign=show-your-working&utm_source=<channel>` to campaign links so Google Analytics can separate campaign traffic from release traffic. On Discord, wrap GitHub links in `<…>` to stop the generic GitHub embed.

Render the cards with:

```bash
uv run --no-project --with pillow python docs/social/render.py
```

## Series

A series is a recurring shape of post, so each one is quick to make and readers learn what to expect.

1. **Measured.** One finding from ArcKit's own tests, with the number it rests on and what it means for the reader. Costs stay in the article, where there is room to explain them (see Voice). The first was the effort testing, posted on 30 September as *Getting the best from Sonnet 5.5*. Runs whenever the evals produce a result worth telling. It carries the campaign's first message, *same AI, with its working shown*, better than any claim.
2. **Show your working.** The adopter ask (carousel `show-your-working`). Once a fortnight, rotating the three routes: named, anonymous, not listed. Each time a real adopter joins, a spotlight post with their permission replaces one ask.
3. **One artefact.** From the campaign plan: one governance document made on a public test repository, with a screenshot and what it shows the reader. Lead with what the document gives them, not with what had to be fixed by hand; no timed claims until the pilot workshops produce one honest number (rule 3).
4. **Office hours.** A date card and a one-line agenda, a week before and on the day. **Only once a date is booked**; see *Before any of this goes up*.
5. **Release notes.** Only releases that change something for the user, written the way the articles are: what changed for you, then why.

From 30 September the page posts daily: *ArcKit Explained* (`series-arckit-explained.md`, 30 September to 13 October), then *From the Articles* (`series-from-the-articles.md`, 14 to 27 October), both scheduled in LinkedIn's scheduler. Keep one slot a week free for anything reactive, such as a release that changes something for users.

**After 27 October**, three campaigns, each with its own file:

- *Regulation week* (`campaign-regulation-week.md`): 28 October to 1 November, five page posts on what the community EU overlay drafts for NIS2, the CRA, the Data Act, GDPR and the AI Act, on one fictional product, with cards in `out/regulation-week/`.
- *Bring your own template* (`campaign-bring-your-own-template.md`): call for templates on 2 November, reminder on 16 November, then a monthly showcase. Templates come in through the `template-share` issue form.
- *Now in the Claude plugin directory* (`campaign-directory-launch.md`, article draft in `drafts/`): goes out the day the core plugin is approved, whichever day that is; it takes that day's slot.

## Voice

**To be tested, the way the chef kit tests its voices.** Three voices on the same content, one post each, a week apart, judged on LinkedIn's own analytics seven days after each goes up (impressions, reactions, comments, clicks to the share page, and the one that matters: adopter-form submissions that week). Nothing changes the articles' voice; this is for posts only.

- **Warm "we", first.** The ArcKit page speaking, warm and competent, led by what the reader can use: *"Here's what we learned about getting the best from Sonnet 5.5 with ArcKit."* This replaced the first-person practitioner voice before the first post went out (30 September), because "I" on a company page leaves readers asking who "I" is.
- **Plain evidence, second.** No first person. The finding, the number, the cost, the link. Reads like a good briefing note.
- **Question, third.** Opens on the reader's own situation: *"How long does your next spend-control pack take to draft?"* Then the evidence.

Whatever the voice: lead with what the reader can use (a model, a practice, a template), not with costs or with what we got wrong. Costs and the full method belong in the article, where there is room to explain them. Plain words, short sentences, no hype words ("revolutionary", "game-changing", "10x"), no emoji beyond the occasional one in Discord, and "GitHub Copilot" always in full. LinkedIn page posts end with three or four hashtags (#EnterpriseArchitecture first); group posts and Discord carry none. Every post ends with one clear next step, or a question for the group.

## What never goes on one of these

A post is harder to correct than a web page: it is reshared and screenshotted. These rules bind every voice.

1. **No usage claims that haven't been confirmed.** "Used across UK Government and the NHS" is third-party reporting, not ours to repeat. Name an adopter only if they chose the named tier, and only in the words they approved.
2. **No department logos or crests,** and no artefact from a real organisation. Screenshots come from the public test repositories or the fictional Ashcombe District Council used in the tests.
3. **Numbers only from something recorded,** with the date or the source: an eval run, a traction report, a public record. Costs are list-price model costs. No "saves X hours" or "Y% faster" until the pilot workshops produce one honest timed number, which the campaign plan asks for.
4. **Say "GitHub Copilot" in full,** never "Copilot" alone. Most civil servants' Copilot is Microsoft 365 Copilot, where ArcKit doesn't run.
5. **Never "your data never leaves your repository".** Prompts go to the model provider. Say what is true: *nothing is sent to us*, and every artefact stays in your repository.
6. **No paid promotion** until the campaign's week-7 review releases the optional budget, and then only for a case-study post.

## Before any of this goes up

- **Office hours have no date yet.** The launch article promised them "starting in October". The adopter carousel says *"An open call from October"*, which is still true; don't post a date card until the slot is booked.
- **Four pilot workshops are offered** in the carousel, as in the launch article. If fewer than four can be run this quarter, change the slide first.
- **The testing article went live on 29 September** (`arckit.org/share/2026-09-29-is-max-effort-worth-it.html`), and the changes it describes shipped in ArcKit 6.16.6. Posts say so; never "in the next release".
- **Nobody has used the adopter form yet.** The first post in *Show your working* should say so honestly, as the launch article did: an empty list is better than a padded one.

---

## Post queue

Copy is ready to paste. Links carry UTM tags. Post each only on the maintainer's go-ahead. Page posts live beside their article as `<slug>-linkedin.md`, so the copy sits with what it promotes; shorter posts for the group and Discord live here. Drafted with the marketing plugin's `draft-content` skill and checked with its `brand-review` skill against the rules above.

### Q1. Getting the best from Sonnet 5.5 — LinkedIn page, with the `sonnet-5-5` image (Warm "we" voice) — posted 30 September

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7511127330174541824/>. Copy: `docs/articles/2026-09-29-is-max-effort-worth-it-linkedin.md`, which follows the archive's convention for channel versions (`<slug>-linkedin.md`, `<slug>-medium.md`). It went out with `docs/social/out/sonnet-5-5/sonnet-5-5-1080x1350.png` and the alt text recorded in that file. The `effort` carousel and the article's link preview were left off because both show costs. The Medium mirror is `docs/articles/2026-09-29-is-max-effort-worth-it-medium.md`.

### Q2. Getting the best from Sonnet 5.5 — LinkedIn group (Question voice) — posted 30 September, with the `sonnet-5-5` image

> Has anyone moved their architecture work onto Claude Sonnet 5.5 yet?
>
> We've been testing it with ArcKit, and a few things stood out. It handled full Secure by Design threat models without any trouble. The highest effort setting rarely made documents better, only longer. And where max effort did help, it was because the model was overruling the examples in our own templates. Once we brought the templates into line, high effort was enough.
>
> We'd like to compare notes. What have you noticed with the new model, and have you found your templates shaping the output more than the settings do?
>
> Full write-up: https://arckit.org/share/2026-09-29-is-max-effort-worth-it.html?utm_campaign=show-your-working&utm_source=linkedin-group

### Q3. Getting the best from Sonnet 5.5 — Discord #announcements — posted 30 September, with the `sonnet-5-5` image

> 📝 **Getting the best from Claude Sonnet 5.5**
> We ran 53 tests with ArcKit on Sonnet 5.5 and Opus 5.5. Here's what we found:
> • Security work runs cleanly: full Secure by Design threat models, nothing refused
> • Max effort is rarely needed: once the template is right, high is enough
> • 13 templates now have examples that match their instructions, shipped in ArcKit 6.16.6
> Tried Sonnet 5.5 with ArcKit? Tell us what you're seeing in #show-your-working
> <https://arckit.org/share/2026-09-29-is-max-effort-worth-it.html?utm_campaign=show-your-working&utm_source=discord>

### Q4. Adopter ask — LinkedIn page, with the `show-your-working` carousel (Plain evidence voice)

Copy: `docs/articles/2026-09-23-show-your-working-linkedin.md`. Attach `docs/social/out/show-your-working/carousel.pdf` as a document.

### Q5. 30-second vertical video — script (for YouTube Shorts, LinkedIn)

The chef kit's template: 30 seconds, 1080 × 1920, six cards of about five seconds, a music bed and no voice. Use only music ArcKit holds a licence for, or royalty-free music, and keep the licence on file. Here the cards are the `sonnet-5-5` image's four points, one per card, re-set vertically; render them from `render.py` before cutting.

1. *Getting the best from Sonnet 5.5.*
2. *Use it for security work.* (26 and 32 threats, nothing refused)
3. *Max effort is rarely needed.*
4. *Check the template first.*
5. *Then high effort is enough.* (every requirement complete)
6. *arckit.org* — ArcKit logo, and the share link as a QR code.

No stock footage of offices or people typing, and no screen recording of anyone's real project: rule 2.

### Q6. Status line above the prompt — Discord #announcements — posted 5 October

Posted: <https://discord.com/channels/1470672254831689893/1552141762754121738/1556496369064345601>. The status line shipped in ArcKit 6.17.3, and 6.17.5 made it show in the Claude desktop app's Code tab, so existing users will see it. Discord only: the page had *ArcKit Explained* scheduled every day that week.

> 📊 **New: your projects at a glance, above the prompt**
> We've added a status line to ArcKit. In Claude Code, one line above where you type now shows:
> • how many projects and documents you have
> • how many are still DRAFT
> • how many reviews are overdue
> When something needs attention, the line turns yellow and points you to /arckit:health. It works in the terminal and in the Claude desktop app's Code tab, and it never changes anything Claude does.
> Update to ArcKit 6.17.5 to get it (needs Claude Code v2.1.287 or later). To switch it off, set the ARCKIT_NO_STATUS_BAND environment variable.
> Tell us how it reads on your projects in #show-your-working
> <https://github.com/tractorjuice/arc-kit/releases/tag/v6.17.5>
