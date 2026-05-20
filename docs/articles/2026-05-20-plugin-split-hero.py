"""Generate hero image for the plugin-split token-budget article.

Matches docs/articles hero style: #0d1117 background, subtle grid,
gradient bars, rounded accent cards, bottom stats bar.
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os
import random

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (72, 79, 88)

INDIGO = (99, 102, 241)
INDIGO_TEXT = (165, 180, 252)
ORANGE = (217, 119, 67)
ORANGE_TEXT = (232, 149, 106)
PURPLE = (168, 85, 247)
PURPLE_TEXT = (192, 132, 252)
GREEN = (34, 197, 94)
GREEN_TEXT = (134, 239, 172)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# --- Subtle grid ---
for x in range(0, WIDTH, 28):
    draw.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 8), width=1)
for y in range(0, HEIGHT, 28):
    draw.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 8), width=1)


def gradient_bar(y0, y1, alpha):
    for x in range(WIDTH):
        t = x / WIDTH
        if t < 0.25:
            r, g, b = INDIGO
        elif t < 0.5:
            f = (t - 0.25) / 0.25
            r = int(INDIGO[0] + (ORANGE[0] - INDIGO[0]) * f)
            g = int(INDIGO[1] + (ORANGE[1] - INDIGO[1]) * f)
            b = int(INDIGO[2] + (ORANGE[2] - INDIGO[2]) * f)
        elif t < 0.75:
            f = (t - 0.5) / 0.25
            r = int(ORANGE[0] + (PURPLE[0] - ORANGE[0]) * f)
            g = int(ORANGE[1] + (PURPLE[1] - ORANGE[1]) * f)
            b = int(ORANGE[2] + (PURPLE[2] - ORANGE[2]) * f)
        else:
            f = (t - 0.75) / 0.25
            r = int(PURPLE[0] + (GREEN[0] - PURPLE[0]) * f)
            g = int(PURPLE[1] + (GREEN[1] - PURPLE[1]) * f)
            b = int(PURPLE[2] + (GREEN[2] - PURPLE[2]) * f)
        draw.line([(x, y0), (x, y1)], fill=(r, g, b, alpha))


gradient_bar(0, 4, 200)
gradient_bar(HEIGHT - 3, HEIGHT, 150)

# --- Fonts ---
font_bold_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
]
font_regular_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
]
font_mono_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
]


def load_font(paths, size):
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


font_title = load_font(font_bold_paths, 40)
font_subtitle = load_font(font_regular_paths, 18)
font_badge_mono = load_font(font_mono_paths, 13)
font_cmd_mono = load_font(font_mono_paths, 14)
font_cmd_desc = load_font(font_regular_paths, 12)
font_stat_value = load_font(font_bold_paths, 24)
font_stat_label = load_font(font_regular_paths, 11)

# --- Decorative network nodes (top right) ---
random.seed(7)
node_positions = []
clusters = [
    (840, 90, 110, 9),
    (970, 140, 95, 7),
    (1070, 80, 75, 6),
    (900, 190, 85, 5),
]
node_colours = [INDIGO, PURPLE, ORANGE, GREEN]
for ci, (cx, cy, radius, count) in enumerate(clusters):
    colour = node_colours[ci % len(node_colours)]
    for _ in range(count):
        angle = random.uniform(0, 2 * math.pi)
        r = random.uniform(0, radius)
        nx = int(cx + r * math.cos(angle))
        ny = int(cy + r * math.sin(angle))
        if 20 < nx < WIDTH - 20 and 20 < ny < HEIGHT - 20:
            size = random.randint(2, 5)
            alpha = random.randint(50, 130)
            node_positions.append((nx, ny, size, (*colour, alpha)))

for i, (x1, y1, _, _) in enumerate(node_positions):
    for j, (x2, y2, _, _) in enumerate(node_positions):
        if i >= j:
            continue
        if math.hypot(x2 - x1, y2 - y1) < 90:
            draw.line([(x1, y1), (x2, y2)], fill=(99, 102, 241, 20), width=1)

for nx, ny, size, colour in node_positions:
    draw.ellipse([(nx - size, ny - size), (nx + size, ny + size)], fill=colour)

# --- ArcKit badge (top right) ---
badge_text = "ArcKit v5.0.0"
bb = draw.textbbox((0, 0), badge_text, font=font_badge_mono)
bw = bb[2] - bb[0] + 28
bh = bb[3] - bb[1] + 16
bx = WIDTH - bw - 56
draw.rounded_rectangle(
    [(bx, 24), (bx + bw, 24 + bh)],
    radius=6, fill=(99, 102, 241, 13), outline=(99, 102, 241, 77), width=1,
)
draw.text((bx + 14, 30), badge_text, fill=INDIGO_TEXT, font=font_badge_mono)

# --- Title ---
tx, ty = 56, 52
draw.text((tx, ty), "One Plugin Became", fill=TEXT_PRIMARY, font=font_title)
draw.text((tx, ty + 50), "Seven. The Reason", fill=TEXT_PRIMARY, font=font_title)
draw.text((tx, ty + 100), "Was a Token Count.", fill=ORANGE_TEXT, font=font_title)

draw.text(
    (tx, ty + 168),
    "Splitting jurisdictional overlays out of the ArcKit core plugin,",
    fill=TEXT_SECONDARY, font=font_subtitle,
)
draw.text(
    (tx, ty + 194),
    "so a session pays only for the jurisdictions it actually opens.",
    fill=TEXT_SECONDARY, font=font_subtitle,
)

# --- Plugin cards: core + overlays ---
card_y = 332
card_h = 78
card_x = 56

# core card (wide)
core_w = 232
draw.rounded_rectangle(
    [(card_x, card_y), (card_x + core_w, card_y + card_h)],
    radius=12, fill=(*GREEN, 14), outline=(*GREEN, 90), width=1,
)
draw.text((card_x + 22, card_y + 18), "arckit  (core)", fill=GREEN_TEXT, font=font_cmd_mono)
draw.text((card_x + 22, card_y + 42), "71 commands + shared infra", fill=TEXT_SECONDARY, font=font_cmd_desc)

# arrow from core to overlays
ay = card_y + card_h // 2
ax0 = card_x + core_w + 8
ax1 = card_x + core_w + 34
draw.line([(ax0, ay), (ax1 - 6, ay)], fill=(255, 255, 255, 45), width=2)
draw.polygon([(ax1, ay), (ax1 - 7, ay - 4), (ax1 - 7, ay + 4)], fill=(255, 255, 255, 45))

# six overlay chips
overlays = [
    ("uae", ORANGE, ORANGE_TEXT),
    ("fr", PURPLE, PURPLE_TEXT),
    ("ca", INDIGO, INDIGO_TEXT),
    ("eu", GREEN, GREEN_TEXT),
    ("au", ORANGE, ORANGE_TEXT),
    ("at", PURPLE, PURPLE_TEXT),
]
chip_x = card_x + core_w + 46
chip_w = 142
chip_h = 36
chip_gap_x = 12
chip_gap_y = 6
for idx, (name, col, coltext) in enumerate(overlays):
    cxp = chip_x + (idx % 3) * (chip_w + chip_gap_x)
    cyp = card_y + (idx // 3) * (chip_h + chip_gap_y)
    draw.rounded_rectangle(
        [(cxp, cyp), (cxp + chip_w, cyp + chip_h)],
        radius=8, fill=(*col, 12), outline=(*col, 70), width=1,
    )
    draw.text((cxp + 14, cyp + 9), f"arckit-{name}", fill=coltext, font=font_cmd_desc)
    obb = draw.textbbox((0, 0), "opt-in", font=font_cmd_desc)
    draw.text(
        (cxp + chip_w - (obb[2] - obb[0]) - 14, cyp + 9),
        "opt-in", fill=TEXT_TERTIARY, font=font_cmd_desc,
    )

# caption under chips
draw.text(
    (chip_x, card_y + 2 * chip_h + chip_gap_y + 8),
    "each overlay a separate plugin  ~  install only what you need",
    fill=TEXT_TERTIARY, font=font_cmd_desc,
)

# --- Stats bar ---
stats_y = 524
stat_items = [
    ("~15,291", "ALWAYS-ON TOKENS, PRE-SPLIT"),
    ("~5,249", "SAVED FOR SINGLE-JURISDICTION USERS"),
    ("~34%", "SMALLER ALWAYS-ON FOOTPRINT"),
    ("7", "MARKETPLACE PLUGINS"),
]
stats_x_start = 56
stat_spacing = 272
for i, (value, label) in enumerate(stat_items):
    sx = stats_x_start + i * stat_spacing
    if i > 0:
        draw.line(
            [(sx - 24, stats_y), (sx - 24, stats_y + 44)],
            fill=(255, 255, 255, 20), width=1,
        )
    draw.text((sx, stats_y), value, fill=TEXT_PRIMARY, font=font_stat_value)
    draw.text((sx, stats_y + 32), label, fill=TEXT_TERTIARY, font=font_stat_label)

# --- Save ---
final = Image.new("RGB", (WIDTH, HEIGHT), BG)
final.paste(img, mask=img.split()[3])
output_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "2026-05-20-plugin-split-token-budget-hero.png",
)
final.save(output_path, "PNG")
print(f"Hero image saved to {output_path}")
print(f"Size: {final.size[0]}x{final.size[1]}")
