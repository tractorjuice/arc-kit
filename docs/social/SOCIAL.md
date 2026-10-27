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
| YouTube | youtube.com/@**arckitorg** (`@arckit` was taken) | Video guides | Narrated guides and explainers, grouped in playlists. Titles carry "(experimental)" while we test AI narration | Warm "we" in descriptions |

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

Link to `https://arckit.org/share/<slug>.html`, never to `article-viewer.html?a=…`: the share page is the article itself, with its own preview card, while the viewer only redirects to it. LinkedIn fixes a post's preview when it is published, so a wrong card means deleting and reposting, not editing. Add `?utm_campaign=show-your-working&utm_source=<channel>` to campaign links so Google Analytics can separate campaign traffic from release traffic. On Discord, wrap GitHub links in `<…>` to stop the generic GitHub embed.

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

### Q7. Decision documents lead with the decision — LinkedIn group (Question voice) — posted 8 October

Posted: <https://www.linkedin.com/feed/update/urn:li:groupPost:17641034-7514025369092517888>, and the same day in Discord #show-your-working (<https://discord.com/channels/1470672254831689893/1552141776607776858/1557821764518809794>), where it asks a question rather than announcing anything. The change is PR #921, merged to main on 8 October and released in ArcKit 6.18.0 on 10 October. No image, and nothing on the page or in #announcements until the release, because those are for released changes. The post promised a follow-up: Q8 to Q11 are that follow-up.

> How far into a business case does a board member get before they reach the recommendation?
>
> ArcKit's decision documents now lead with the decision. A Strategic Outline Business Case opens with the Go/No-Go recommendation and the preferred option. The reasons come next, then the context, costs and risks. Research findings open with the build-or-buy recommendation, and design reviews put their verdict in section 1. A risk that could change the decision sits beside the verdict, not at the bottom of a list.
>
> It's Barbara Minto's Pyramid Principle applied to the Green Book's five cases: the answer first, then the reasons, then the evidence.
>
> The change isn't in a release yet; we'll post here when it is.
>
> What does your board want to see in the first line?

### Q8. ArcKit 6.18.0, decision documents lead with the decision — LinkedIn page, with the `decision-first` image (Warm "we" voice) — posted 10 October

Posted: <https://www.linkedin.com/feed/update/urn:li:share:7514640144403025920/>. The release follow-up Q7 promised. It went out in the afternoon because the page had already posted *ArcKit Explained* Day 11 at 08:30. Image: `docs/social/out/campaigns/decision-first-1080x1350.png` (from `render.py`, `CAMPAIGN_SINGLES`), added before the text so the release link didn't replace it with a preview card. Alt text: *ArcKit card: Lead with the decision. The answer first, then the reasons. Business cases open with Go or No-Go. Research opens with build or buy. Design reviews give the verdict in section 1.*

> ArcKit 6.18.0 is out, and our decision documents now lead with the decision.
>
> A Strategic Outline Business Case now opens with the Go/No-Go recommendation and the recommended option, then the reasons, then the context, costs and risks. Research findings open with the build-or-buy recommendation, and high-level and detailed design reviews put their verdict in section 1. A risk that could change the decision sits right beside it.
>
> It's Barbara Minto's Pyramid Principle applied to the Green Book's five cases: the answer first, then the reasons, then the evidence.
>
> For French public sector teams, the digital resilience index (IRN) assessment now follows the official v1.2 grid, contributed by Thomas Jardinet.
>
> See what changed and update: https://github.com/tractorjuice/arc-kit/releases/tag/v6.18.0
>
> #EnterpriseArchitecture #GreenBook #PublicSector #OpenSource

### Q9. ArcKit 6.18.0 — LinkedIn group, reply in the Q7 thread (Question voice) — posted 10 October

Posted as a comment on <https://www.linkedin.com/feed/update/urn:li:groupPost:17641034-7514025369092517888>, keeping Q7's promise in the place it was made. No image.

> It's out now, in ArcKit 6.18.0. Business cases, research findings and design reviews open with the recommendation, and if you've customised one of those templates, your copy keeps its old order. If you try it on your next business case, tell us whether that first line is the one your board wants to read.
> https://github.com/tractorjuice/arc-kit/releases/tag/v6.18.0

### Q10. ArcKit 6.18.0 — Discord #announcements — posted 10 October, with the `decision-first` image

Posted: <https://discord.com/channels/1470672254831689893/1552141762754121738/1558433787212472412>. Existing users will notice the change in their next business case, research findings or design review, so it belongs in #announcements. The fr-irn line credits the contributor.

> 🧭 **Decision documents now lead with the decision**
> ArcKit 6.18.0 is out. The summary of these documents now opens with the answer:
> • Business cases: the Go/No-Go recommendation and the recommended option first, then the reasons, then costs and risks
> • Research findings: the build-or-buy recommendation first, the research scope at the end
> • HLD and DLD reviews: the executive summary is now section 1, with the verdict in its first sentence
> A risk that could change the decision now sits beside the verdict. If you've customised one of these templates, your copy keeps its old order.
> French public sector users: /arckit:fr-irn now follows the aDRI's IRN v1.2 grid, built around the digital assets in scope. Thanks to Thomas Jardinet (@thomas-jardinet on GitHub) for the contribution.
> Update to ArcKit 6.18.0 to get both, and tell us how your next summary reads in #show-your-working
> <https://github.com/tractorjuice/arc-kit/releases/tag/v6.18.0>

### Q11. ArcKit 6.18.0 — Discord #show-your-working, reply to Q7's Discord post — posted 10 October

Posted: <https://discord.com/channels/1470672254831689893/1552141776607776858/1558445561357803674>, as a Discord reply to the 8 October post, which ended "It isn't in a release yet". A reply rather than an edit, so the original and its question stay as they were.

> It's in ArcKit 6.18.0 now, released today: update and your next business case, research findings or design review opens with the decision. Details in #announcements. The question still stands: what does your board want to read in the first line?

### Q12. 2,634 directory installs — LinkedIn page, with the 30s `arckit-directory-installs` video (Warm "we" voice) — posted 12 October

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7515470852335976449/>. Video: `~/hyperframes/arckit-directory-installs/renders/arckit-directory-installs.mp4` (30 seconds, 1080 × 1350, silent), made with HyperFrames as a sequel to the `arckit-traction` video; the upload was `arckit-directory-installs-linkedin.mp4`, a 5.7 MB copy. LinkedIn ignores a video file supplied by browser automation (an image is accepted), so the maintainer attached the video by hand and the text was pasted in after. Upload the video before pasting the text, or the link turns into a preview card that replaces it. The page posts *ArcKit Explained* at 08:30 until 13 October, so this takes the week's free slot, in the afternoon. The numbers are the Claude plugin directory's Usage tab for each plugin, data through 10 October 2026, read on 12 October, and they are installs only (rule 3). The posts say nothing about the core plugin being in the directory, so *Now in the Claude plugin directory* keeps its day.

> For the first time, we can see how often ArcKit's plugins are installed from the Claude plugin directory: 2,634 times, to 10 October.
>
> Each overlay adds the commands for one jurisdiction's or sector's rules. The Austrian overlay leads with 611 installs, then the EU overlay (431) and NHS clinical safety (424). Most installs started on a plugin's page on Claude.ai (1,676), and 491 came from browsing plugins in Cowork.
>
> ArcKit itself still never phones home: these are the directory's counts of installs, not of who uses ArcKit. The overlays build on the core ArcKit plugin, and arckit.org shows how to install both.
>
> If your team uses ArcKit, tell us: named, anonymously or privately.
> https://arckit.org/public-sector?utm_campaign=show-your-working&utm_source=linkedin-page
>
> #EnterpriseArchitecture #PublicSector #OpenSource #Governance

### Q13. 2,634 directory installs — LinkedIn group (Question voice), with the 60s `arckit-directory-installs-long` video — posted 12 October

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7515471725409656833/>, after Q12, with the video attached by hand (`arckit-directory-installs-long-linkedin.mp4`, a 7.7 MB copy). Video: `~/hyperframes/arckit-directory-installs-long/renders/arckit-directory-installs-long.mp4` (60 seconds, 1080 × 1350, silent). It adds a spotlight on the top three, with what each overlay covers taken from its `plugin.json` description.

> Which rules does your architecture work answer to?
>
> The Claude plugin directory now counts installs for the ArcKit plugins listed there: 2,634 to 10 October. The Austrian overlay has the most (611), covering data protection, cybersecurity, federal procurement and accessibility law. The EU overlay, covering GDPR, the AI Act, DORA, NIS2, the Cyber Resilience Act and more, has 431, and NHS clinical safety (DCB0129, DCB0160, DTAC) has 424. There are overlays for the US, Canada, the UAE, France, the Netherlands, Australia (federal and energy) and UK payments too.
>
> These are installs, not users: ArcKit still never phones home.
>
> Which jurisdiction or sector should get an overlay next?

### Q14. 2,634 directory installs — Discord #show-your-working, with the 30s video — posted 12 October

Posted: <https://discord.com/channels/1470672254831689893/1552141776607776858/1559227999058927728>, before the LinkedIn posts while the video was being attached there. Not #announcements: nothing changes for people who already use ArcKit. Video: `~/hyperframes/arckit-directory-installs/renders/arckit-directory-installs-discord.mp4`, a 2 MB copy of Q12's video, re-encoded to fit Discord's 10 MB upload limit for servers without a boost. The 9:16 cut, `~/hyperframes/arckit-directory-installs-vertical/renders/arckit-directory-installs-vertical.mp4`, is for YouTube Shorts if we try it (see *Where ArcKit posts*).

> 📈 First numbers from the Claude plugin directory: 2,634 installs of ArcKit plugins, to 10 October. Austria's overlay is out in front with 611; the EU and NHS clinical safety overlays are close behind at 431 and 424.
> ArcKit itself still sends us nothing, so this channel is where we hear how it's going. Which overlay would you want next?

### Q15. ArcKit 6.18.2 — Discord #announcements, reply to Q6 — posted 13 October

Posted: <https://discord.com/channels/1470672254831689893/1552141762754121738/1559464583196844055>, as a reply to Q6, the status-line post, so the original stays as written. 6.18.2 takes the status line out again, so people who read Q6 need to know.

> **ArcKit 6.18.2 is out**
> The status line above the prompt has been removed. Taking it out lets the core plugin be listed in the Claude plugin directory, which sends any plugin that adds to Claude Code's own interface for a manual review first.
> Everything else works as before: `/arckit:health` still reports stale drafts and overdue reviews, and the stale-document notice still appears when a session starts. If you set `ARCKIT_NO_STATUS_BAND`, you can delete it.
> Update with `claude plugin update arckit@arckit-claude`
> <https://github.com/tractorjuice/arc-kit/releases/tag/v6.18.2>

### Q16. ArcKit on YouTube, ArcKit for Beginners — LinkedIn page, with the guide thumbnail (Warm "we" voice) — posted 13 October

Posted: <https://www.linkedin.com/feed/update/urn:li:share:7515679273064525824/>, about 08:45, after the page's last scheduled *ArcKit Explained* post at 08:30. Image: `~/hyperframes/arckit-beginners-guide/renders/thumbnail-1280x720.png`, attached before the text so the link doesn't replace it with a preview card, with alt text. The guide (63 minutes, plus four parts of 11 to 22 minutes) was made with HyperFrames from `ArcKit_for_Beginners__Command_by_Command_from_Stra.md`; the narration is a Kokoro synthetic voice, which is why every title says "(experimental)". Playlist: <https://www.youtube.com/playlist?list=PLHAFN5RjB5As>. Videos: full guide <https://youtu.be/AWaSJAnDXlA>, Part 1 <https://youtu.be/9GLUdUmjMgc>, Part 2 <https://youtu.be/3GUjyWB6s2Q>, Part 3 <https://youtu.be/8zpM9Jncack>, Part 4 <https://youtu.be/7i7ddGkKuOc>. Description links stay unclickable until the channel's one-off phone verification.

> ArcKit is now on YouTube, starting with an experimental guide for anyone new to it.
>
> ArcKit for Beginners follows one fictional project, Northbridge Council modernising its customer portal, from architecture principles to the release decision. At each step it shows what ArcKit drafts and where a named person checks the work and decides. Watch it as one guide of just over an hour, with chapters, or in four parts of 11 to 22 minutes:
>
> 1. Set up the project and establish governance
> 2. Turn business intent into architectural decisions
> 3. Connect procurement, design review and delivery
> 4. Verify the evidence and keep it current
>
> The narration is AI-generated, so we're treating the series as an experiment. Tell us in the comments what works and what doesn't, and we'll use it to shape what we make next.
>
> https://www.youtube.com/playlist?list=PLHAFN5RjB5As
>
> #EnterpriseArchitecture #PublicSector #OpenSource #Governance

### Q17. ArcKit for Beginners — LinkedIn group (Question voice) — posted 13 October

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7515679437095616512/>, straight after Q16. No image: the playlist link makes a YouTube preview card, which takes readers straight to the videos.

> How do you bring someone new up to speed on your architecture governance?
>
> We've been trying a video guide. ArcKit for Beginners, on ArcKit's new YouTube channel, follows one fictional council project through every command and approval gate, from principles to the release decision. It runs just over an hour, or in four parts of 11 to 22 minutes, and the narration is AI-generated.
>
> It's an experiment, so we'd value your view: is video useful for this, is the pace right, and which step would you want covered in more depth?
>
> https://www.youtube.com/playlist?list=PLHAFN5RjB5As

### Q18. ArcKit on YouTube — Discord #show-your-working — posted 13 October

Posted: <https://discord.com/channels/1470672254831689893/1552141776607776858/1559472608741826572>. Not #announcements: nothing changes for people who already use ArcKit. The channel and explainer links are wrapped in `<…>`, so only the playlist shows an embed.

> 🧪 ArcKit now has a YouTube channel: <https://www.youtube.com/@arckitorg>
> First up is an experimental, AI-narrated ArcKit for Beginners guide: one fictional council project, command by command from principles to the release decision. One hour with chapters, or four shorter parts:
> https://www.youtube.com/playlist?list=PLHAFN5RjB5As
> New to ArcKit altogether? ArcKit explained gives the overview in under eight minutes: <https://youtu.be/-oQ5VRpkxp0>
> Tell us here what works and what doesn't.

### Q19. ArcKit commands series — LinkedIn page, with a frame from the principles film (Warm "we" voice) — posted 13 October

Posted: <https://www.linkedin.com/feed/update/urn:li:share:7515712597132951552/>, about 10:58, the page's third post that day after the 08:30 *ArcKit Explained* post and Q16. Image: the real-output scene of `03-arckit-principles.mp4` (ARC-000-PRIN-v1.0 from the public test project arckit-test-project-v19-gov-api-aggregator), attached before the text, with alt text.

The series has 76 films, one per core command, each 73 to 90 seconds. They were made with HyperFrames in `~/hyperframes/arckit-command-videos` and narrated by a Kokoro synthetic voice, so every title says "(experimental)". Each film shows a real output from a public test project, a template outline where no test project has one yet, or a labelled illustrative terminal output for commands that write no document.

Playlist: <https://www.youtube.com/playlist?list=PLOxB2ULF5XX0>. Films 01 to 04 were public when this went up. YouTube's daily upload limit for a new, unverified channel stopped the rest, so they go up over the following days.

> A short film for every ArcKit command, starting today.
>
> Each one takes about a minute and a half to show what the command is for, when to run it, what it reads first, what to check and what to run next. Each also shows a real output: a document the command wrote in one of our public test projects, so you can see what you'll get before you run it.
>
> There are 76 commands, so the films are going up over the next couple of days. The first four are live now: start, init, principles and stakeholders.
>
> As with the beginners' guide, the narration is AI-generated, so we're treating the series as an experiment. Tell us which commands you'd like covered in more depth.
>
> https://www.youtube.com/playlist?list=PLOxB2ULF5XX0
>
> #EnterpriseArchitecture #PublicSector #OpenSource #Governance

### Q20. ArcKit commands series — LinkedIn group (Question voice) — posted 13 October

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7515712722928312320/>, straight after Q19. No image: the playlist link makes a YouTube preview card.

> Which ArcKit command would you most like to see in action?
>
> We've started a series of short films, one for each of the 76 commands. Each shows when to run the command, what it reads, a real document it wrote in one of the public test projects, and what to check before you rely on it. Four are up now, and the rest follow over the next couple of days.
>
> It's an experiment with AI narration, so tell us what's missing or unclear and we'll use it for the next round.
>
> https://www.youtube.com/playlist?list=PLOxB2ULF5XX0

### Q21. ArcKit commands series — Discord #show-your-working — posted 13 October

Posted: <https://discord.com/channels/1470672254831689893/1552141776607776858/1559505876086161438>. Not #announcements: nothing changes for people who already use ArcKit.

> 🧪 New: a short film for every ArcKit command, about 90 seconds each: when to run it, what it reads, a real output from a public test project, what to check and what to run next.
> The first four are up (start, init, principles, stakeholders), and the rest land over the next couple of days: https://www.youtube.com/playlist?list=PLOxB2ULF5XX0
> Which command should we look at more closely next?

### Q22. All 76 command films live — LinkedIn page (Warm "we" voice) — posted 15 October

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7516375246296334336/>. No image: the playlist link makes the preview card. The last films, 60 to 76, went public on 15 October, which completed the playlist (76 videos).

> All 76 ArcKit command films are now on YouTube.
>
> Each one takes about a minute and a half to show what a command is for, when to run it, what it reads first, a real output from one of our public test projects, what to check and what to run next. The set runs from /arckit:start to /arckit:import-okf.
>
> Pick the command you're about to run and watch that one first.
>
> The narration is AI-generated, so we're still treating the series as an experiment. Tell us which films help and which need another pass.
>
> https://www.youtube.com/playlist?list=PLOxB2ULF5XX0
>
> #EnterpriseArchitecture #PublicSector #OpenSource #Governance

### Q23. All 76 command films live — LinkedIn group (Question voice) — posted 15 October

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7516375393084284928/>, straight after Q22. No image: the playlist link makes a YouTube preview card.

> Which ArcKit command will you run next? There's now a short film for it.
>
> All 76 command films are up, about 90 seconds each: when to run the command, what it reads, a real document it wrote in one of the public test projects, and what to check before you rely on it.
>
> They're AI-narrated and still an experiment, so tell us which ones help and which need a clearer explanation.
>
> https://www.youtube.com/playlist?list=PLOxB2ULF5XX0

### Q24. All 76 command films live — Discord #show-your-working, reply to Q21 — posted 15 October

Posted: <https://discord.com/channels/1470672254831689893/1552141776607776858/1560168646486261810>, as a reply to Q21. Q21 promised the rest "over the next couple of days", so the reply closes that loop and leaves the original as written.

> All 76 are up now, from /arckit:start to /arckit:import-okf: https://www.youtube.com/playlist?list=PLOxB2ULF5XX0
> Which one should we look at more closely next?

### Q25. Overlay command films — LinkedIn page (Warm "we" voice) — posted 16 October

Posted: <https://www.linkedin.com/feed/update/urn:li:share:7516774593865547776/>, the page's second post that day after the scheduled *From the Articles* post. No image: the channel link makes a YouTube preview card. The 102 overlay films, one per command in the 14 community overlays, went public on 15 and 16 October in one playlist per overlay (`~/hyperframes/arckit-overlay-videos/uploads.json`).

> Every ArcKit overlay now has its own short films.
>
> We've made one for each command in the 14 community overlays: 102 films, about a minute and a half each. They cover the EU, France, Austria, the Netherlands, Canada, US federal, the UAE, Australia and Australian energy, plus TOGAF ADM, Open Agile Architecture, AI agent architecture, UK finance and the NHS.
>
> Each film shows what the command is for, what it reads first, the document it writes (a real example where one of our public test projects has one, otherwise the template it fills in), what to check, and what to run next.
>
> The overlays are community-contributed, so have qualified reviewers check what they draft before you rely on it. The narration is AI-generated, so the films are still an experiment. Tell us which ones help.
>
> Every overlay has its own playlist: https://www.youtube.com/@arckitorg/playlists
>
> #EnterpriseArchitecture #Compliance #OpenSource #Governance

### Q26. Overlay command films — LinkedIn group (Question voice) — posted 16 October

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7516774781136887808/>, straight after Q25. No image: the channel link makes a YouTube preview card.

> Working with the EU AI Act, Canada's ITSG-33, FedRAMP or the NHS clinical safety standards? There's now a short film for the ArcKit command that covers it.
>
> We've added 102 films for the 14 community overlays, one per command and about 90 seconds each: what the command reads, the document it drafts, and what to check before you rely on it. The overlays are community-contributed, so a qualified reviewer should still check their output.
>
> They're AI-narrated and still an experiment. Which overlay do you use, and is there a framework we haven't covered yet?
>
> https://www.youtube.com/@arckitorg/playlists

### Q27. Overlay command films — Discord #show-your-working — posted 16 October

Posted: <https://discord.com/channels/1470672254831689893/1552141776607776858/1560567997951647766>. Not #announcements: nothing changes for people who already use ArcKit.

> 🧪 New: a short film for every command in the community overlays, 102 in all across 14 overlays: EU, France, Austria, Netherlands, Canada, US federal, UAE, Australia, Australian energy, TOGAF ADM, Open Agile Architecture, AI agent architecture, UK finance and UK NHS.
> Each one shows what the command reads, the document it drafts and what to check. One playlist per overlay: https://www.youtube.com/@arckitorg/playlists
> Which overlay should we look at more closely next?

### Q28. ArcKit recipes explainer — LinkedIn page (Warm "we" voice) — posted 17 October

Posted: <https://www.linkedin.com/feed/update/urn:li:share:7517136873409134592/>. No image: the video link makes the preview card. The film (1:19, <https://youtu.be/b1EVJenis0M>) is in the "ArcKit explainers" playlist with en-GB captions.

> Build a whole project's governance documents in one run, with an ArcKit recipe.
>
> A recipe lists the documents a project needs and what each one depends on. /arckit:build follows it and drafts the set in waves: principles first, then requirements and stakeholders, then the decision records, each wave waiting for the documents it needs.
>
> Our new short film shows what's inside a recipe, part of the uk-saas recipe that ships with ArcKit, and what to check before you build. There are recipes for defence, the NHS and payments too, and in our overlays for the UAE, Canada, Australia and the US. Copy one into .arckit/recipes to make it your own.
>
> Every document it drafts is a starting point for qualified people to review.
>
> https://youtu.be/b1EVJenis0M
>
> #EnterpriseArchitecture #Governance #OpenSource #PublicSector

### Q29. ArcKit recipes explainer — LinkedIn group (Question voice) — posted 17 October

Posted: <https://www.linkedin.com/feed/update/urn:li:activity:7517137057115205632/>, straight after Q28.

> How many governance documents does your next project need, and in what order?
>
> An ArcKit recipe answers that up front. It lists the documents and what each depends on, and /arckit:build drafts them in waves. Our new 80-second film walks through one: the uk-saas recipe that ships with ArcKit.
>
> If you've written your own recipe, or there's one you'd like us to add, tell us below.
>
> https://youtu.be/b1EVJenis0M

### Q30. ArcKit recipes explainer — Discord #show-your-working — posted 17 October

Posted: <https://discord.com/channels/1470672254831689893/1552141776607776858/1560930209593819198>.

> 🧪 New short film: how ArcKit recipes work. What's inside one, part of the uk-saas recipe, and what to check before /arckit:build drafts the set in waves: https://youtu.be/b1EVJenis0M
> Which recipe should we look at next?

### Q31. ArcKit 6.18.3 — LinkedIn group (Question voice) — posted 27 October

Posted: <https://www.linkedin.com/feed/update/urn:li:groupPost:17641034-7520736929206820865>. No image: the release link makes GitHub's text-only card. Not on the page: it had *From the Articles* scheduled that day, and *Regulation week* starts on 28 October. The free Awareness certification shipped in the same release but is left for a post of its own.

> How do you show a review board what changed in a risk register since they last saw it?
>
> ArcKit 6.18.3 is out, and running a command again now keeps the version you had. Any command that writes one document per project, the risk register, stakeholder analysis and data model among them, writes the next version beside the earlier one: 1.1 for a refresh, 2.0 when the scope has changed. It adds a row to the Revision History and sets the status back to DRAFT, ready for review. ArcKit's overlays for other countries and sectors do the same.
>
> Commands also pick up more of what you've already written, such as your cloud research, data model or JSP 936 assessment, and our guides now open with what each standard is and who needs it.
>
> How does your team keep earlier versions of its governance documents: in the repository, in SharePoint, or somewhere else?
>
> https://github.com/tractorjuice/arc-kit/releases/tag/v6.18.3

### Q32. ArcKit 6.18.3 — Discord #announcements — posted 27 October

Posted: <https://discord.com/channels/1470672254831689893/1552141762754121738/1564529811697831997>, before Q31. Existing users will notice the versioning change the next time they re-run a command, so it belongs in #announcements. It credits the two contributors by their GitHub names.

> 📄 **ArcKit 6.18.3: run a command again and your earlier version stays**
> Any command that writes one document per project, such as /arckit:risk, /arckit:stakeholders or /arckit:data-model, now writes the next version beside the earlier one: 1.1 for a refresh, 2.0 when the scope changes. It adds a Revision History row, sets Status back to DRAFT and leaves the earlier file as it was. Overlay commands do the same.
> Also in 6.18.3:
> • Commands that rely on your cloud research (AWS, Azure and now Google Cloud), data model or JSP 936 assessment now find it
> • Traceability and analysis use each requirement's own priority
> • Guides open with what the standard or document is and who needs it, with their facts checked at source
> • /arckit:gcloud-search covers G-Cloud 15, and /arckit:dos covers DOS7 on the Contract Award Service
> • The helper scripts run on a Mac
> Thanks to @johnfelipe on GitHub for two security fixes: the secret scanner now checks your own docs, READMEs and changelogs, and a file or folder name can't pass itself off as an instruction to Claude. And to @trednets: the EU Cloud Sovereignty scorer now runs in Codex, Gemini and the other AI tools too.
> Update with `claude plugin update arckit@arckit-claude`, and tell us how it goes in #show-your-working
> <https://github.com/tractorjuice/arc-kit/releases/tag/v6.18.3>
