"""Render ArcKit's social carousels.

Typographic cards in the house style of the article heroes (dark panel, gold,
cyan and violet accents). Every card is built from the text below, so a
figure that changes is changed here and re-rendered, never edited in an image
editor. Output goes to docs/social/out/, one folder per series.

    uv run --no-project --with pillow python docs/social/render.py

Sizes: 1080 x 1350 portrait, which LinkedIn shows as a document carousel (after
converting the series to a PDF, see SOCIAL.md) and Instagram shows as a
carousel post.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
LOGO = HERE.parent / "assets" / "ArcKit_Logo_Horizontal_Dark@2x.png"
OUT = HERE / "out"

W, H = 1080, 1350
BG = (13, 17, 23)
PANEL = (22, 27, 34)
LINE = (48, 54, 61)
TEXT = (230, 237, 243)
MUTED = (139, 148, 158)
DIM = (88, 96, 110)
GOLD = (234, 179, 8)
CYAN = (34, 211, 238)
VIOLET = (139, 92, 246)
GREEN = (52, 211, 153)


def font(size, bold=False, mono=False):
    if mono:
        paths = ["/System/Library/Fonts/Menlo.ttc",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf" if bold
                 else "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"]
    else:
        paths = ["/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold
                 else "/System/Library/Fonts/Supplemental/Arial.ttf",
                 "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold
                 else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    for p in paths:
        try:
            if p.endswith(".ttc"):
                return ImageFont.truetype(p, size, index=1 if bold else 0)
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(d, text, f, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if d.textlength(trial, font=f) <= width:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def base(series, n, total, kicker):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for x in range(0, W, 40):
        d.line((x, 0, x, H), fill=(18, 24, 31))
    for y in range(0, H, 40):
        d.line((0, y, W, y), fill=(18, 24, 31))
    for x in range(W):
        t = x / W
        a, b, f = (GOLD, CYAN, t / 0.5) if t < 0.5 else (CYAN, VIOLET, (t - 0.5) / 0.5)
        col = tuple(int(a[i] + (b[i] - a[i]) * f) for i in range(3))
        d.line((x, 0, x, 8), fill=col)
    d.text((72, 72), kicker, font=font(30, True, True), fill=CYAN)
    if total > 1:
        d.text((W - 72, 72), f"{n}/{total}", font=font(30, True, True), fill=DIM, anchor="ra")
    logo = Image.open(LOGO).convert("RGBA")
    lw = 260
    logo = logo.resize((lw, int(logo.height * lw / logo.width)))
    img.paste(logo, (72, H - 72 - logo.height), logo)
    d.text((W - 72, H - 72 - 20), "arckit.org", font=font(26, False, True), fill=DIM, anchor="rm")
    return img, d


def headline(d, y, text, size=76, color=TEXT, width=W - 144):
    f = font(size, True)
    for line in wrap(d, text, f, width):
        d.text((72, y), line, font=f, fill=color)
        y += int(size * 1.18)
    return y


def body(d, y, text, size=36, color=MUTED, width=W - 144, gap=1.4):
    f = font(size)
    for line in wrap(d, text, f, width):
        d.text((72, y), line, font=f, fill=color)
        y += int(size * gap)
    return y


def bar_pair(d, y, label, hi, mx, hs, ms, scale):
    d.text((72, y), label, font=font(34, True), fill=TEXT)
    y += 56
    for v, s, col, tag in ((hi, hs, CYAN, "high"), (mx, ms, VIOLET, "max")):
        L = int(560 * v / scale)
        d.rounded_rectangle((72, y, 72 + L, y + 46), 10, fill=col)
        d.text((72 + L + 18, y + 6), f"{tag}  {s}", font=font(30, True, True), fill=col)
        y += 62
    return y + 30


def card(d, box, title, lines, color):
    x0, y0, x1, y1 = box
    d.rounded_rectangle(box, 22, fill=PANEL, outline=color, width=3)
    d.text((x0 + 32, y0 + 28), title, font=font(40, True), fill=color)
    y = y0 + 96
    for ln in lines:
        for w in wrap(d, ln, font(34), x1 - x0 - 64):
            d.text((x0 + 32, y), w, font=font(34), fill=MUTED)
            y += 46


# ── Series 1: Is max effort worth it? ─────────────────────────────────


def effort_series():
    k, T, out = "ARCKIT · TESTING", 5, OUT / "effort"
    slides = []

    img, d = base("effort", 1, T, k)
    y = headline(d, 260, "We told the AI to think harder.", 84)
    y = headline(d, y + 10, "Mostly, it just wrote more.", 84, GOLD)
    body(d, y + 60, "53 test runs of ArcKit on Claude Opus 5.5 and Sonnet 5.5, $137 of recorded model time. Here's what the highest effort setting actually bought.")
    slides.append(img)

    img, d = base("effort", 2, T, k)
    y = headline(d, 200, "Same requirements. Four times the wait.", 64)
    y = body(d, y + 20, "One requirements document, Claude Opus 5.5, normal effort against max.", 32)
    y += 50
    y = bar_pair(d, y, "Cost", 2.90, 9.82, "$2.90", "$9.82", 11)
    y = bar_pair(d, y, "Minutes", 12, 48, "12", "48", 54)
    bar_pair(d, y, "Requirements written (average)", 100, 100, "100", "100", 112)
    slides.append(img)

    img, d = base("effort", 3, T, k)
    y = headline(d, 200, "The real problem was the examples.", 64)
    y = body(d, y + 20, "13 of the 55 ArcKit command templates we audited showed examples that contradicted their own instructions. At normal effort, the AI copies the example.", 34)
    card(d, (72, y + 50, W - 72, y + 420), "Requirements template",
         ["The instruction: every requirement needs acceptance criteria.",
          "The examples: 1 in 30 had them.",
          "The result: every run left them off 36 to 61 requirements, even at max."], GOLD)
    slides.append(img)

    img, d = base("effort", 4, T, k)
    y = headline(d, 200, "Fix the example, not the effort.", 70, GREEN)
    y = body(d, y + 20, "With the templates fixed, at normal effort:", 34)
    card(d, (72, y + 40, W - 72, y + 300), "Requirements",
         ["Every requirement complete in 4 of 4 runs, on both models.",
          "Sonnet 5.5: mentions of acceptance criteria, 52 → 132."], GREEN)
    card(d, (72, y + 330, W - 72, y + 590), "12 other templates",
         ["Security actions now have owners. Runbooks have rollback steps.",
          "The 'do nothing' option now has a cost."], CYAN)
    slides.append(img)

    img, d = base("effort", 5, T, k)
    y = headline(d, 200, "What we'd take from it", 70)
    for i, (t, s) in enumerate([
        ("Check the template before raising the effort.", "Including your own customised copies."),
        ("Choose the model, not the effort level.", "In these tests it mattered more."),
        ("Measure cost and time, not just pass or fail.", "A 48-minute wait is a cost too."),
    ], 1):
        y += 40
        d.text((72, y), f"{i}", font=font(64, True), fill=GOLD)
        yy = y + 6
        for line in wrap(d, t, font(36, True), W - 144 - 90):
            d.text((162, yy), line, font=font(36, True), fill=TEXT)
            yy += 46
        d.text((162, yy + 4), s, font=font(30), fill=MUTED)
        y = yy + 60
    body(d, y + 50, "Full write-up, method and every cost: arckit.org/articles", 32, CYAN)
    slides.append(img)
    return out, slides


# ── Series 2: Show your working (adopter ask) ─────────────────────────


def adopter_series():
    k, T, out = "ARCKIT · SHOW YOUR WORKING", 4, OUT / "show-your-working"
    slides = []

    img, d = base("adopters", 1, T, k)
    y = headline(d, 260, "Who uses ArcKit?", 96)
    y = headline(d, y + 10, "Honestly, we don't know.", 84, GOLD)
    body(d, y + 60, "ArcKit collects no usage data, by design. Nothing phones home. So the only way to find out is to ask.")
    slides.append(img)

    img, d = base("adopters", 2, T, k)
    y = headline(d, 200, "Tell us your way.", 76)
    y += 40
    for title, text, col in [
        ("Named", "Your organisation, and a line about what you use it for.", GOLD),
        ("Anonymous", "Counted by sector only: \"a central government department\".", CYAN),
        ("Not listed", "Only the maintainer knows. It still shapes the roadmap.", VIOLET),
    ]:
        card(d, (72, y, W - 72, y + 230), title, [text], col)
        y += 260
    slides.append(img)

    img, d = base("adopters", 3, T, k)
    y = headline(d, 200, "What you get back.", 76)
    y += 40
    for title, text, col in [
        ("Monthly office hours", "An open call from October. A short demo, then your questions.", GREEN),
        ("A free pilot workshop", "Two hours with your team, on your project or a public test one. Four this quarter.", GREEN),
        ("A case study, if you want one", "Your problem in your words. You approve every word.", GREEN),
    ]:
        card(d, (72, y, W - 72, y + 250), title, [text], col)
        y += 280
    slides.append(img)

    img, d = base("adopters", 4, T, k)
    y = headline(d, 260, "Two minutes.", 96, GOLD)
    y = body(d, y + 30, "Search \"I use ArcKit\" on the ArcKit GitHub issues page, or follow the link in the post.", 36, TEXT)
    y = body(d, y + 30, "Can't post publicly? Message us on Discord or in the ArcKit LinkedIn group instead.", 34)
    body(d, y + 80, "github.com/tractorjuice/arc-kit", 36, CYAN)
    slides.append(img)
    return out, slides


# ── Single: Getting the best from Sonnet 5.5 ──────────────────────────


def sonnet_single():
    """One image for the Sonnet 5.5 post. No costs: the post is about using the model."""
    out = OUT / "sonnet-5-5"
    img, d = base("sonnet", 1, 1, "ARCKIT · CLAUDE SONNET 5.5")
    y = headline(d, 170, "Getting the best from Sonnet 5.5", 72)
    y = body(d, y + 10, "What 53 test runs showed us.", 36)
    for i, (t, s) in enumerate([
        ("Use it for security work.", "Two Secure by Design assessments: 26 and 32 threats, nothing refused."),
        ("Max effort is rarely needed.", "Mostly it gave longer documents, not better ones."),
        ("Check the template first.", "Where max helped, it was overruling the template's examples."),
        ("Then high effort is enough.", "Acceptance-criteria mentions rose from 52 to 132, every requirement complete."),
    ], 1):
        y += 44
        d.text((72, y), f"{i}", font=font(64, True), fill=GOLD)
        yy = y + 6
        for line in wrap(d, t, font(38, True), W - 144 - 90):
            d.text((162, yy), line, font=font(38, True), fill=TEXT)
            yy += 48
        for line in wrap(d, s, font(30), W - 144 - 90):
            d.text((162, yy + 4), line, font=font(30), fill=MUTED)
            yy += 40
        y = yy + 20
    body(d, y + 16, "Template fixes shipped in ArcKit 6.16.6", 34, CYAN)
    return out, [img]


# ── Series 3: ArcKit Explained (14 days) ──────────────────────────────

EXPLAINED = [
    ("What ArcKit is", "76 commands", ["Drafts governance documents from templates", "Works in GitHub Copilot, Claude Code, Gemini CLI and more", "Drafts for qualified people to review"]),
    ("Getting started", "/arckit:init  /arckit:start", ["Installs as a plugin, or with the arckit tool", "Creates a projects/ folder in your repository", "Suggests which commands to run, in order"]),
    ("Principles first", "/arckit:principles", ["Each principle with its rationale and implications", "Every later document checks back against them", "Departures are flagged, not hidden"]),
    ("Stakeholders", "/arckit:stakeholders", ["Who has a stake, and what drives them", "Goals with measurable outcomes", "Where they agree, and where they differ"]),
    ("Requirements you can trace", "/arckit:requirements", ["Business, functional, non-functional, integration, data", "Priority, rationale and acceptance criteria on each", "Traced back to stakeholder goals"]),
    ("A risk register", "/arckit:risk", ["In the Orange Book's structure", "Likelihood and impact, before and after controls", "An owner and a response for every risk"]),
    ("Wardley maps", "/arckit:wardley", ["Components, dependencies and maturity", "Buy or reuse the mature, build the novel", "Open and edit at create.wardleymaps.ai"]),
    ("Research, with sources", "/arckit:research", ["Products, open source and government platforms", "A build-or-buy view for each capability", "Every claim cited to its source"]),
    ("The business case", "/arckit:sobc", ["The Green Book's five cases", "Options include doing nothing", "Built on the work already done"]),
    ("Data model and DPIA", "/arckit:data-model  /arckit:dpia", ["Entities, relationships and a diagram", "UK GDPR considerations for each", "A DPIA draft for your DPO to review"]),
    ("Diagrams and decisions", "/arckit:diagram  /arckit:adr", ["Mermaid or C4 diagrams, as text in git", "Each decision with the options considered", "Traced to the requirements it serves"]),
    ("Security and the TCoP", "/arckit:secure  /arckit:tcop", ["Secure by Design, with an owner for each action", "All 13 Technology Code of Practice points", "A structured start for your assessors"]),
    ("Joining it up", "/arckit:traceability  /arckit:health", ["Requirements traced to design and tests", "Stale research and open decisions found", "Service Standard readiness, all 14 points"]),
    ("Show your working", "/arckit:pages", ["Sources cited inline", "How each document was made, recorded", "A documentation site for the whole team"]),
]


def explained_series():
    T, out = len(EXPLAINED), OUT / "explained"
    slides = []
    for n, (title, cmd, points) in enumerate(EXPLAINED, 1):
        img, d = base("explained", n, T, "ARCKIT EXPLAINED")
        y = headline(d, 240, title, 92)
        y += 16
        for line in wrap(d, cmd, font(44, True, True), W - 144):
            d.text((72, y), line, font=font(44, True, True), fill=GOLD)
            y += 60
        y += 70
        for point in points:
            d.rounded_rectangle((72, y + 14, 88, y + 30), 4, fill=CYAN)
            for line in wrap(d, point, font(46), W - 144 - 50):
                d.text((122, y), line, font=font(46), fill=TEXT)
                y += 60
            y += 54
        note = "Everything ArcKit writes is a draft for qualified people to review." if n in (1, T) else "Example: Ashcombe District Council (fictional)"
        if n != 2:
            body(d, H - 250, note, 28, DIM)
        slides.append(img)
    return out, slides


# ── Series 4: From the Articles (14 days) ─────────────────────────────

FROM_ARTICLES = [
    ("ArcKit drafts, you judge", "The toolkit drafts, the architect judges", ["ArcKit takes the drafting and cross-references", "You judge completeness, targets and evidence", "Trust the draft enough to skip the rewrite"]),
    ("Check before you build", "/arckit:gov-reuse", ["Search 24,500+ UK government repositories", "Score candidates: fork, library, reference", "Gaps become genuine build items"]),
    ("The five Wardley commands", "/arckit:wardley and four companions", ["Start with the value chain, not a blank canvas", "Each command reads the others' output", "Feed gameplay back into a revised map"]),
    ("Wardley maps belong in git", "/arckit:wardley", ["Mermaid maps render in any GitHub Markdown file", "Review a moved component in a pull request", "Editor text and Mermaid kept in step"]),
    ("Ground it in award data", "/arckit:tenders and /arckit:competitors", ["Notices from all five UK publication portals", "Every figure links to its official notice", "An award is not the same as spend"]),
    ("Find UK funding", "/arckit:grants", ["Seven kinds of UK funder researched", "Each scored High, Medium or Low, with reasons", "Check deadlines with each funder before applying"]),
    ("One recipe, a full set", "/arckit:build", ["Parallel waves, one git commit per wave", "Resumes where an interrupted build stopped", "Run --plan first to see the waves"]),
    ("Enforce, ask, measure", "One page, three tiers", ["Rules enforced in code, whatever the model does", "Rules asked of the model, now tested", "What your organisation supplies"]),
    ("NHS clinical safety", "Community overlay: arckit-uk-nhs", ["DCB0129 and DCB0160 safety case drafts", "Follows the open SAFETY.md specification", "For review by a Clinical Safety Officer"]),
    ("UK payments", "Community overlay: arckit-uk-finance", ["SCA-RTS, safeguarding, Consumer Duty, CTPs", "Adds a layer on top of the core baseline", "Sign-off stays with the firm's accountable people"]),
    ("Install only what you need", "Core plugin plus overlays", ["Core holds the foundations and the checks", "Overlays add a jurisdiction or a sector", "Installing an overlay brings the core with it"]),
    ("TOGAF's ADM, governed", "Community overlay: arckit-togaf-adm", ["Nine ADM steps as versioned documents", "Linked to requirements, principles and decisions", "togaf-adm-full recipe builds the sequence"]),
    ("Governed AI agents", "Community overlay: agent architecture", ["Inventory first: which agents, what they reach", "Design, integration, governance, security", "The toolkit drafts, the architect judges"]),
    ("Show your working", "Using ArcKit on real work? Tell us.", ["Named, anonymous by sector, or not listed", "Nothing is sent to us, so we have to ask", "The adopters list is still empty"]),
]


def cards_series(items, kicker, out, note_for):
    """Numbered single-idea cards: title, a gold line (a command or key phrase), three points."""
    T, slides = len(items), []
    for n, (title, line2, points) in enumerate(items, 1):
        img, d = base(out.name, n, T, kicker)
        y = headline(d, 240, title, 92)
        y += 16
        mono = line2.startswith("/")
        f2 = font(44, True, mono) if mono else font(44, True)
        for line in wrap(d, line2, f2, W - 144):
            d.text((72, y), line, font=f2, fill=GOLD)
            y += 60
        y += 70
        for point in points:
            d.rounded_rectangle((72, y + 14, 88, y + 30), 4, fill=CYAN)
            for line in wrap(d, point, font(46), W - 144 - 50):
                d.text((122, y), line, font=font(46), fill=TEXT)
                y += 60
            y += 54
        note = note_for(n, T)
        if note:
            body(d, H - 250, note, 28, DIM)
        slides.append(img)
    return out, slides


def from_articles_series():
    return cards_series(FROM_ARTICLES, "ARCKIT · FROM THE ARTICLES", OUT / "from-the-articles",
                        lambda n, T: "Read the full article at arckit.org/articles")


# ── Campaigns: Regulation week, directory launch, bring your own template ──

REGULATION_WEEK = [
    (
        "NIS2: who you are first",
        "/arckit-eu:eu-nis2",
        [
            "Essential, Important or out of scope",
            "Ten Article 21 measures with gaps",
            "24h, 72h and one-month reporting stages",
        ],
    ),
    (
        "CRA: the product itself",
        "/arckit-eu:eu-cra",
        [
            "Default, Class I or Class II",
            "Twelve Annex I security requirements",
            "SBOM in SPDX or CycloneDX, 24h reporting",
        ],
    ),
    (
        "Data Act: who gets the data",
        "/arckit-eu:eu-data-act",
        [
            "Roles first: manufacturer, data holder",
            "User access: free, machine-readable",
            "Fair B2B terms and trade secret safeguards",
        ],
    ),
    (
        "GDPR: screen first",
        "/arckit-eu:eu-rgpd",
        [
            "Nine EDPB criteria; two or more needs a DPIA",
            "Lawful basis and rights for each activity",
            "Transfers and 72-hour breach notification",
        ],
    ),
    (
        "AI Act: prohibited first",
        "/arckit-eu:eu-ai-act",
        [
            "Is it an AI system? Provider or deployer?",
            "Article 5 prohibited practices checked first",
            "High, limited or minimal risk, then the work",
        ],
    ),
]

CAMPAIGN_SINGLES = {
    "directory-launch": ('Now in the plugin directory', 'Find ArcKit and install it inside Claude', ['The core plugin joins the overlays already listed', 'Nothing in ArcKit approves an action for you', 'Marketplace install still works as before']),
    "bring-your-own-template": ("Bring your own template", "/arckit:customize  /arckit:template-builder", ["Share a house template, public or cleared", "We draft in it on a fictional project", "Published side by side, credited your way"]),
    "decision-first": ("Lead with the decision", "The answer first, then the reasons", ["Business cases open with Go or No-Go", "Research opens with build or buy", "Design reviews give the verdict in section 1"]),
}


def regulation_week_series():
    return cards_series(REGULATION_WEEK, "ARCKIT · REGULATION WEEK", OUT / "regulation-week",
                        lambda n, T: "Community EU overlay. Drafts for qualified review.")


def campaign_singles():
    """One card per campaign, saved under its own name (no 1/N counter)."""
    out = OUT / "campaigns"
    out.mkdir(parents=True, exist_ok=True)
    for name, item in CAMPAIGN_SINGLES.items():
        _, (img,) = cards_series([item], "ARCKIT", out, lambda n, T: None)
        img.save(out / f"{name}-1080x1350.png", optimize=True)
    return out, []


def main():
    out, (img,) = sonnet_single()
    out.mkdir(parents=True, exist_ok=True)
    img.save(out / "sonnet-5-5-1080x1350.png", optimize=True)
    print(f"wrote 1 image to {out.relative_to(HERE.parent.parent)}")
    campaign_singles()
    print("wrote campaign cards to docs/social/out/campaigns")
    for build in (effort_series, adopter_series, explained_series, from_articles_series, regulation_week_series):
        out, slides = build()
        out.mkdir(parents=True, exist_ok=True)
        for i, img in enumerate(slides, 1):
            p = out / f"slide-{i}-1080x1350.png"
            img.save(p, optimize=True)
        # LinkedIn document carousels are uploaded as a PDF.
        slides[0].save(out / "carousel.pdf", save_all=True, append_images=slides[1:], resolution=150)
        print(f"wrote {len(slides)} slides + carousel.pdf to {out.relative_to(HERE.parent.parent)}")


if __name__ == "__main__":
    main()
