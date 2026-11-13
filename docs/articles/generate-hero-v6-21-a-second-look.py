"""Generate the hero image for the ArcKit v6.21.0 release article.

Left, a design review read by three fresh readers; right, two scores settled by
a moderator who isn't told whose is whose. A strip of facts underneath and a
line for detailed designs. Same house style as the sibling generate-hero-*.py
scripts.

    uv run --with pillow python docs/articles/generate-hero-v6-21-a-second-look.py
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


def box(xy, title, lines, colour, title_size=28):
    x0, y0, x1, y1 = xy
    d.rounded_rectangle(xy, radius=16, fill=PANEL, outline=colour, width=3)
    d.text(((x0 + x1) / 2, y0 + 36), title, font=font(title_size, True), fill=TEXT, anchor="mm")
    for i, line in enumerate(lines):
        d.text(((x0 + x1) / 2, y0 + 76 + i * 30), line, font=font(21), fill=MUTED, anchor="mm")


def arrow(x0, x1, y, colour):
    d.line((x0, y, x1 - 14, y), fill=colour, width=5)
    d.polygon([(x1, y), (x1 - 18, y - 11), (x1 - 18, y + 11)], fill=colour)


d.text((80, 62), "ArcKit v6.21.0", font=font(28, True), fill=GOLD)
d.text((80, 104), "A second look from someone", font=font(58, True), fill=TEXT)
d.text((80, 172), "who wasn't in the room", font=font(58, True), fill=TEXT)
d.text((80, 254), "Fresh readers for design reviews, a moderator for split scores", font=font(28), fill=MUTED)

# Left: a design review and its three fresh readers.
TOP = 330
box((80, TOP + 60, 330, TOP + 210), "Design review", ["Its working stays", "in the session"], LINE)
readers = ("Comprehension", "Principles", "Requirements")
for i, name in enumerate(readers):
    y = TOP + i * 74
    d.rounded_rectangle((420, y, 720, y + 58), radius=12, fill=PANEL, outline=CYAN, width=3)
    d.text((570, y + 29), name, font=font(24, True), fill=TEXT, anchor="mm")
    d.line((330, TOP + 135, 420, y + 29), fill=CYAN, width=3)
d.text((570, TOP + 236), "Design, principles, requirements: nothing else", font=font(20, True), fill=CYAN, anchor="mm")

# Right: two scores, a moderator, a final score.
d.rounded_rectangle((860, TOP, 1080, TOP + 70), radius=12, fill=PANEL, outline=LINE, width=2)
d.text((970, TOP + 35), "Evaluator A: 1", font=font(24, True), fill=TEXT, anchor="mm")
d.rounded_rectangle((860, TOP + 140, 1080, TOP + 210), radius=12, fill=PANEL, outline=LINE, width=2)
d.text((970, TOP + 175), "Evaluator B: 2", font=font(24, True), fill=TEXT, anchor="mm")
d.line((1080, TOP + 35, 1140, TOP + 105), fill=GOLD, width=4)
d.line((1080, TOP + 175, 1140, TOP + 105), fill=GOLD, width=4)
box((1140, TOP + 30, 1360, TOP + 180), "Moderator", ["Not told whose", "score is whose"], GOLD, 26)
arrow(1360, 1410, TOP + 105, GREEN)
d.rounded_rectangle((1410, TOP + 45, 1520, TOP + 165), radius=16, fill=PANEL, outline=GREEN, width=3)
d.text((1465, TOP + 72), "Final", font=font(22, True), fill=MUTED, anchor="mm")
d.text((1465, TOP + 122), "2", font=font(52, True), fill=GREEN, anchor="mm")

Y = 640
facts = (
    ("34 findings, 10 new to the review", CYAN),
    ("Verdict checked again", GOLD),
    ("Both first scores kept", GREEN),
)
widths = (560, 420, 460)
x = 80
for (text, colour), width in zip(facts, widths):
    d.rounded_rectangle((x, Y, x + width - 20, Y + 76), radius=14, fill=PANEL, outline=LINE, width=2)
    d.text((x + (width - 20) / 2, Y + 38), text, font=font(25, True), fill=colour, anchor="mm")
    x += width

d.line((80, 762, 1520, 762), fill=LINE, width=2)
d.text((80, 790), "Also new: the same three-reader check for detailed designs, against the approved HLD", font=font(28), fill=TEXT)
d.text((80, 836), "From ArcKit's own tests on a fictional design and a sample bid", font=font(22), fill=MUTED)

out = Path(__file__).with_name("2026-11-09-arckit-v6-21-a-second-look-hero.png")
img.save(out, optimize=True)
print(out)
