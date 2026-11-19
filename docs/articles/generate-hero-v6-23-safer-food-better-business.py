"""Generate the hero image for the ArcKit v6.23.0 release article.

Three panels left to right: the pack's own words, the business's own answers,
and a named person's sign-off. A strip of facts underneath. Same house style as
the sibling generate-hero-*.py scripts.

    uv run --with pillow python docs/articles/generate-hero-v6-23-safer-food-better-business.py
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


def arrow(x0, y, x1, colour):
    d.line((x0, y, x1 - 16, y), fill=colour, width=4)
    d.polygon([(x1, y), (x1 - 18, y - 11), (x1 - 18, y + 11)], fill=colour)


d.text((80, 62), "ArcKit v6.23.0", font=font(28, True), fill=GOLD)
d.text((80, 104), "Safer food, better business (SFBB)", font=font(58, True), fill=TEXT)
d.text((80, 172), "for caterers: complete your pack.", font=font(58, True), fill=TEXT)
d.text((80, 254), "Food safety documents that say only what the business said. England and Wales.", font=font(28), fill=MUTED)

# Three panels: where each part of a document comes from.
TOP = 330
panels = (
    ("The pack's words", CYAN, ("Safer food, better business", "for caterers, from the", "Food Standards Agency", "Printed unchanged")),
    ("Your answers", GOLD, ("Confirmed by a named", "person at the business", "Anything else reads", "NOT YET ANSWERED")),
    ("Signed off", GREEN, ("A named person has read", "this version", "Change an answer and", "it needs signing again")),
)
WIDTH, GAP = 440, 60
for i, (title, colour, lines) in enumerate(panels):
    x = 80 + i * (WIDTH + GAP)
    d.rounded_rectangle((x, TOP, x + WIDTH, TOP + 270), radius=16, fill=PANEL, outline=colour, width=3)
    d.text((x + WIDTH / 2, TOP + 44), title, font=font(32, True), fill=TEXT, anchor="mm")
    for j, line in enumerate(lines):
        d.text((x + WIDTH / 2, TOP + 104 + j * 40), line, font=font(25, j == 3), fill=colour if j == 3 else MUTED, anchor="mm")
    if i < len(panels) - 1:
        arrow(x + WIDTH + 6, TOP + 135, x + WIDTH + GAP - 6, colour)

Y = 640
facts = (
    ("Five commands, from profile to sign-off", GREEN),
    ("It never suggests an answer", CYAN),
)
x = 80
for text, colour in facts:
    d.rounded_rectangle((x, Y, x + 710, Y + 76), radius=14, fill=PANEL, outline=LINE, width=2)
    d.text((x + 355, Y + 38), text, font=font(25, True), fill=colour, anchor="mm")
    x += 730

d.line((80, 762, 1520, 762), fill=LINE, width=2)
d.text((80, 790), "Experimental, and switched off until you enable it", font=font(28), fill=TEXT)
d.text((80, 836), "Not legal advice. The Food Standards Agency has not reviewed or endorsed it.", font=font(22), fill=MUTED)

out = Path(__file__).with_name("2026-11-19-arckit-v6-23-safer-food-better-business-sfbb-for-caterers-hero.png")
img.save(out, optimize=True)
print(out)
