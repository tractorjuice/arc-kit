# LinkedIn Version: Is Max Effort Worth It?

Post on the ArcKit page with the `docs/social/out/sonnet-5-5/sonnet-5-5-1080x1350.png` image (alt text below the post). The `effort` carousel and the article hero both show costs, so neither is used. Warm "we" voice, framed around using Claude Sonnet 5.5 and with no costs (revised before posting); the first of the three voices under test in `docs/social/SOCIAL.md`.

## LinkedIn Post Body

Claude Sonnet 5.5 arrived with some useful advice: effort levels have been recalibrated, and the highest settings should be used only where your own testing shows a gain. We test ArcKit regularly, but not yet on Sonnet 5.5, so we ran 53 tests, on Sonnet 5.5 and Opus 5.5, to find out what the new model needs.

Here's what we learned about getting the best from Sonnet 5.5 with ArcKit.

→ It's good at security work. Sonnet 5.5 is the first Sonnet with Anthropic's cybersecurity safeguards, so we checked it wouldn't get in the way. We asked for two full Secure by Design assessments with STRIDE threat models. Nothing was refused, and each came back with 26 to 32 specific threats.

→ Max effort is rarely needed. Across most commands, the highest setting gave longer, slower documents rather than better ones.

→ The one exception taught us the most. On requirements, Sonnet at max did go deeper, because it was overruling our own template. That template asked for acceptance criteria on every requirement, but only 1 of its 30 examples had them. We found the same kind of mismatch in 13 of our 55 templates.

→ Fix the template, and high effort is enough. With the templates corrected, Sonnet 5.5 at high went from 52 acceptance-criteria mentions to 132, most of the way to what max produced, with every requirement complete.

The fixes are in ArcKit 6.16.6, so if you've updated, you're ready to use Sonnet 5.5 with ArcKit's standard settings.

A good habit with any new model: check your templates before you turn the effort up.

The full write-up covers the method and the results:
https://arckit.org/share/2026-09-29-is-max-effort-worth-it.html?utm_campaign=show-your-working&utm_source=linkedin

Have you started using Sonnet 5.5 for architecture work? We'd like to hear what you're finding.

#EnterpriseArchitecture #AIGovernance #DigitalGovernment #OpenSource

## Image Alt Text

Getting the best from Claude Sonnet 5.5: what 53 ArcKit test runs showed. 1. Use it for security work: two Secure by Design assessments found 26 and 32 threats, nothing refused. 2. Max effort is rarely needed: mostly it gave longer documents, not better ones. 3. Check the template first: where max helped, it was overruling the template's examples. 4. Then high effort is enough: acceptance-criteria mentions rose from 52 to 132, every requirement complete. Template fixes shipped in ArcKit 6.16.6.

<!-- arckit:related-articles -->
## Related Articles

- [Is Max Effort Worth It? What 53 Test Runs Taught Us About ArcKit](article-viewer.html?a=2026-09-29-is-max-effort-worth-it)
- [ArcKit v6.14.0: What the Harness Enforces, What It Asks, and What It Now Measures](article-viewer.html?a=2026-09-03-arckit-v6-14-enforce-ask-measure)
- [Show Your Working: Who Uses ArcKit?](article-viewer.html?a=2026-09-23-show-your-working)

<!-- arckit:community-block -->
## Join the ArcKit Community

- **Discord** - real-time conversation, help with commands, and what people are building: [discord.gg/HsA4Y3hQ4](https://discord.gg/HsA4Y3hQ4)
- **LinkedIn Group** - announcements, case studies, and longer-form discussion: [linkedin.com/groups/17641034](https://www.linkedin.com/groups/17641034/)
- **GitHub** - code, issues, and contributions: [github.com/tractorjuice/arc-kit](https://github.com/tractorjuice/arc-kit)
