"""Generate the hero image for the ArcKit v6.20.0 release article.

A supplier's bid stops at a wall. A read-only reader passes short claims
through it to the scoring, with a strip for what follows from that and a line
for the two new overlays. Same house style as the sibling generate-hero-*.py
scripts.

    uv run --with pillow python docs/articles/generate-hero-v6-20-a-bid-cant-mark-its-own-homework.py
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
RED = (248, 113, 113)

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


def box(xy, title, lines, colour):
    x0, y0, x1, y1 = xy
    d.rounded_rectangle(xy, radius=18, fill=PANEL, outline=colour, width=3)
    d.text(((x0 + x1) / 2, y0 + 44), title, font=font(30, True), fill=TEXT, anchor="mm")
    for i, line in enumerate(lines):
        d.text(((x0 + x1) / 2, y0 + 94 + i * 34), line, font=font(22), fill=MUTED, anchor="mm")


def arrow(x0, x1, y, colour, label=None):
    d.line((x0, y, x1 - 14, y), fill=colour, width=5)
    d.polygon([(x1, y), (x1 - 18, y - 11), (x1 - 18, y + 11)], fill=colour)
    if label:
        d.text(((x0 + x1) / 2, y - 26), label, font=font(21, True), fill=colour, anchor="mm")


d.text((80, 62), "ArcKit v6.20.0", font=font(28, True), fill=GOLD)
d.text((80, 104), "A bid can't mark its own homework", font=font(62, True), fill=TEXT)
d.text((80, 190), "Scoring sees short claims, never the bid", font=font(30), fill=MUTED)

TOP, BOTTOM = 290, 490
MID = (TOP + BOTTOM) // 2
box((80, TOP, 370, BOTTOM), "Supplier's bid", ["Written by someone", "who wants a high score"], RED)
arrow(370, 470, MID, RED)
box((470, TOP, 760, BOTTOM), "Reader", ["Read-only, and one", "supplier at a time"], CYAN)

# The wall: the bid stops here, and only claims cross it.
WALL = 806
for y in range(TOP - 26, BOTTOM + 26, 26):
    d.line((WALL, y, WALL, y + 14), fill=GOLD, width=6)
d.text((WALL, BOTTOM + 52), "The bid stops here", font=font(22, True), fill=GOLD, anchor="mm")

d.line((760, MID, WALL, MID), fill=GREEN, width=5)
arrow(WALL, 1000, MID, GREEN, "Short claims")
box((1000, TOP, 1520, BOTTOM), "Scoring", ["Each score traces to", "a file and a location"], GREEN)

Y = 600
facts = (
    ("No claim, no marks", GREEN),
    ("Planted text is reported, not followed", GOLD),
    ("Unreadable bid stays unscored", CYAN),
)
widths = (360, 620, 480)
x = 80
for (text, colour), width in zip(facts, widths):
    d.rounded_rectangle((x, Y, x + width - 20, Y + 76), radius=14, fill=PANEL, outline=LINE, width=2)
    d.text((x + (width - 20) / 2, Y + 38), text, font=font(25, True), fill=colour, anchor="mm")
    x += width

d.line((80, 736, 1520, 736), fill=LINE, width=2)
d.text((80, 766), "Also new: arc42 from your existing artefacts, and NORA and GEMMA for Dutch government", font=font(29), fill=TEXT)
d.text((80, 816), "Checks on your artefacts now stop the write when they can't run", font=font(25), fill=MUTED)

out = Path(__file__).with_name("2026-11-07-arckit-v6-20-a-bid-cant-mark-its-own-homework-hero.png")
img.save(out, optimize=True)
print(out)
