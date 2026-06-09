"""Hero for 2026-06-09-arckit-fde-site-generator.md.

1200 x 630 (Open Graph). Dark background. Left: a 'wizard' input stack
(brand, colour, pricing, contact). Centre: an arrow labelled /arckit-fde:create.
Right: a rendered single-page FDE site card. Footer: a stat strip.
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (13, 17, 23)
PANEL = (22, 27, 34)
LINE = (48, 54, 61)
TEXT = (230, 237, 243)
MUTED = (139, 148, 158)
GREEN = (14, 122, 95)
GREEN_BRIGHT = (30, 211, 198)
GOLD = (234, 179, 8)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

def font(size, bold=False):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf" % ("-Bold" if bold else ""),
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()

def rrect(box, radius, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

# Eyebrow + headline
d.text((60, 48), "NEW IN ARCKIT  ·  ARCKIT-FDE PLUGIN", font=font(22, True), fill=GREEN_BRIGHT)
d.text((60, 86), "Your FDE site in one command", font=font(46, True), fill=TEXT)

# Left: wizard inputs
rrect((60, 170, 430, 470), 16, fill=PANEL, outline=LINE, width=2)
d.text((84, 188), "/arckit-fde:create", font=font(20, True), fill=GREEN_BRIGHT)
rows = [
    ("Brand", "Your firm"),
    ("Colour", "#0e7a5f"),
    ("Pricing", "GBP 25K / 35K"),
    ("Contact", "you@firm.com"),
]
y = 232
for label, val in rows:
    d.text((84, y), label, font=font(18, True), fill=MUTED)
    rrect((200, y - 6, 406, y + 30), 8, fill=(13, 17, 23), outline=LINE, width=1)
    d.text((212, y), val, font=font(18), fill=TEXT)
    y += 58

# Centre arrow
d.text((470, 300), "→", font=font(64, True), fill=GOLD)

# Right: rendered site card
rrect((560, 150, 1140, 488), 16, fill=PANEL, outline=GREEN, width=2)
rrect((560, 150, 1140, 250), 16, fill=(5, 34, 29))
d.text((588, 184), "Your FDE", font=font(30, True), fill=GREEN_BRIGHT)
d.text((588, 220), "Bootstrap any project in a week.", font=font(18), fill=TEXT)
for i, chip in enumerate(["Principles", "Requirements", "Risk", "Stakeholders"]):
    cx = 588 + i * 132
    rrect((cx, 290, cx + 120, 330), 8, fill=(13, 17, 23), outline=LINE, width=1)
    d.text((cx + 12, 300), chip, font=font(15), fill=MUTED)
d.text((588, 360), "GBP 25K intensive   ·   GBP 35K spread", font=font(18, True), fill=GOLD)
d.text((588, 400), "Published to docs/  →  GitHub Pages", font=font(17), fill=MUTED)

# Footer stat strip
d.line((60, 540, 1140, 540), fill=LINE, width=1)
d.text((60, 562), "1 command   ·   white-label   ·   2 market presets   ·   Claude Code only   ·   arckit.org",
       font=font(18), fill=MUTED)

img.save("docs/articles/2026-06-09-arckit-fde-site-generator-hero.png")
print("wrote hero")
