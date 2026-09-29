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
    body(d, y + 60, "53 test runs of ArcKit on Claude Opus 5.5 and Sonnet 5.5, about $150 of model time. Here's what the highest effort setting actually bought.")
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


def main():
    for build in (effort_series, adopter_series):
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
