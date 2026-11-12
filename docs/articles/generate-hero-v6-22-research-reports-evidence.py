"""Generate the hero image for the ArcKit v6.22.0 release article.

Left, the research report and what it now holds; right, the three commands the
decisions moved to. A strip of facts underneath. Same house style as the
sibling generate-hero-*.py scripts.

    uv run --with pillow python docs/articles/generate-hero-v6-22-research-reports-evidence.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1600, 900
BG = (13, 17, 23)
PANEL = (22, 27, 34)
LINE = (48, 54, 61)
TEXT = (230, 237, 243)
MUTED = (139, 148, 158)
GOLD = (234, 179, 8)
CYAN = (34, 211, 238)
GREEN = (52, 211, 153)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def font(size, bold=False):
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def arrow(x0, y0, x1, y1, colour):
    d.line((x0, y0, x1 - 16, y1), fill=colour, width=4)
    d.polygon([(x1, y1), (x1 - 18, y1 - 11), (x1 - 18, y1 + 11)], fill=colour)


d.text((80, 62), "ArcKit v6.22.0", font=font(28, True), fill=GOLD)
d.text((80, 104), "Research reports the evidence.", font=font(58, True), fill=TEXT)
d.text((80, 172), "You make the decision.", font=font(58, True), fill=TEXT)
d.text((80, 254), "No scores, no ranking, no build-or-buy verdict in the research report", font=font(28), fill=MUTED)

# Left: the research report and what it holds.
TOP = 330
d.rounded_rectangle((80, TOP, 640, TOP + 250), radius=16, fill=PANEL, outline=CYAN, width=3)
d.text((360, TOP + 40), "Research report", font=font(30, True), fill=TEXT, anchor="mm")
for i, line in enumerate((
    "What each option offers and lacks",
    "What it costs, with the source",
    "How many products and vendors",
    "Utility, GOV.UK platform or open source",
)):
    d.text((120, TOP + 84 + i * 38), "•  " + line, font=font(23), fill=MUTED)

# Right: where each decision is made.
decisions = (
    ("Wardley map", "decides how to source", GOLD),
    ("Business case", "appraises value for money", GREEN),
    ("Evaluate and score", "score the suppliers", CYAN),
)
for i, (name, does, colour) in enumerate(decisions):
    y = TOP + i * 88
    d.rounded_rectangle((820, y, 1520, y + 72), radius=14, fill=PANEL, outline=colour, width=3)
    d.text((850, y + 36), name, font=font(26, True), fill=TEXT, anchor="lm")
    d.text((1490, y + 36), does, font=font(23), fill=MUTED, anchor="rm")
    arrow(640, TOP + 125, 820, y + 36, colour)

Y = 640
facts = (
    ("Prices read from G-Cloud pricing PDFs", GREEN),
    ("Each option measured in its own category", CYAN),
)
widths = (720, 720)
x = 80
for (text, colour), width in zip(facts, widths):
    d.rounded_rectangle((x, Y, x + width - 20, Y + 76), radius=14, fill=PANEL, outline=LINE, width=2)
    d.text((x + (width - 20) / 2, Y + 38), text, font=font(25, True), fill=colour, anchor="mm")
    x += width

d.line((80, 762, 1520, 762), fill=LINE, width=2)
d.text((80, 790), "Also new: larger text in the first 101 command films", font=font(28), fill=TEXT)
d.text((80, 836), "G-Cloud price reading needs Claude Code", font=font(22), fill=MUTED)

out = Path(__file__).with_name("2026-11-12-arckit-v6-22-research-reports-evidence-hero.png")
img.save(out, optimize=True)
print(out)
