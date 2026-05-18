"""Hero for 2026-05-18-arckit-v5-plugin-split.md.

Concept: vertical hierarchy.
  Row 1 — title block (left aligned, eyebrow + headline + subtitle).
  Row 2 — single core plugin card centred.
  Row 3 — six community-overlay plugin cards in a 3 wide x 2 tall grid.
  Row 4 — stat strip footer.

Dashed dependency lines run from every community card up to the core card,
illustrating the v5 `dependencies` field auto-install behaviour.

1200x630 (Open Graph standard). Dark background.
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (88, 96, 110)

INDIGO = (99, 102, 241)
INDIGO_TEXT = (165, 180, 252)

ORANGE = (217, 119, 67)
PURPLE = (168, 85, 247)
GREEN = (34, 197, 94)
GOLD = (234, 179, 8)
SALMON = (251, 113, 133)
CYAN = (34, 211, 238)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# --- Subtle grid background ---
for x in range(0, WIDTH, 28):
    draw.line([(x, 0), (x, HEIGHT)], fill=(255, 255, 255, 8), width=1)
for y in range(0, HEIGHT, 28):
    draw.line([(0, y), (WIDTH, y)], fill=(255, 255, 255, 8), width=1)


def draw_gradient_bar(y_start, y_end, alpha):
    for x in range(WIDTH):
        t = x / WIDTH
        if t < 0.2:
            r, g, b = INDIGO
        elif t < 0.4:
            f = (t - 0.2) / 0.2
            r = int(INDIGO[0] + (CYAN[0] - INDIGO[0]) * f)
            g = int(INDIGO[1] + (CYAN[1] - INDIGO[1]) * f)
            b = int(INDIGO[2] + (CYAN[2] - INDIGO[2]) * f)
        elif t < 0.6:
            f = (t - 0.4) / 0.2
            r = int(CYAN[0] + (GREEN[0] - CYAN[0]) * f)
            g = int(CYAN[1] + (GREEN[1] - CYAN[1]) * f)
            b = int(CYAN[2] + (GREEN[2] - CYAN[2]) * f)
        elif t < 0.8:
            f = (t - 0.6) / 0.2
            r = int(GREEN[0] + (GOLD[0] - GREEN[0]) * f)
            g = int(GREEN[1] + (GOLD[1] - GREEN[1]) * f)
            b = int(GREEN[2] + (GOLD[2] - GREEN[2]) * f)
        else:
            f = (t - 0.8) / 0.2
            r = int(GOLD[0] + (SALMON[0] - GOLD[0]) * f)
            g = int(GOLD[1] + (SALMON[1] - GOLD[1]) * f)
            b = int(GOLD[2] + (SALMON[2] - GOLD[2]) * f)
        draw.line([(x, y_start), (x, y_end)], fill=(r, g, b, alpha))


draw_gradient_bar(0, 4, 220)
draw_gradient_bar(HEIGHT - 3, HEIGHT, 170)

# --- Fonts ---
font_bold_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
]
font_regular_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]
font_mono_paths = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]


def load_font(paths, size):
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


font_eyebrow = load_font(font_mono_paths, 12)
font_title = load_font(font_bold_paths, 40)
font_subtitle = load_font(font_regular_paths, 16)

font_core_eyebrow = load_font(font_mono_paths, 11)
font_core_name = load_font(font_bold_paths, 26)
font_core_meta = load_font(font_mono_paths, 11)

font_node_name = load_font(font_bold_paths, 14)
font_node_label = load_font(font_regular_paths, 11)
font_node_meta = load_font(font_mono_paths, 9)

font_footer_stat = load_font(font_bold_paths, 15)
font_footer_meta = load_font(font_mono_paths, 10)

PAD = 56

# --- Row 1: Title block (top, left-aligned) ---
draw.text((PAD, 32), "ARCKIT V5.0.0  ·  RELEASED 18 MAY 2026", font=font_eyebrow, fill=INDIGO_TEXT)
draw.text((PAD, 56), "One toolkit. Seven plugins.", font=font_title, fill=TEXT_PRIMARY)
draw.text((PAD, 100), "Install only what you need.", font=font_title, fill=TEXT_SECONDARY)
draw.text((PAD, 152),
          "v5.0.0 splits ArcKit into seven marketplace plugins. Core plus six per-jurisdiction overlays.",
          font=font_subtitle, fill=TEXT_SECONDARY)

# --- Row 2: Core plugin card, centred ---
CORE_W = 320
CORE_H = 96
CORE_X0 = (WIDTH - CORE_W) // 2
CORE_Y0 = 200
CORE_X1 = CORE_X0 + CORE_W
CORE_Y1 = CORE_Y0 + CORE_H
CORE_CENTRE_X = (CORE_X0 + CORE_X1) // 2

# Drop shadow
shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
sdraw.rounded_rectangle((CORE_X0 + 4, CORE_Y0 + 6, CORE_X1 + 4, CORE_Y1 + 6),
                        radius=14, fill=(0, 0, 0, 130))
img.alpha_composite(shadow)

draw.rounded_rectangle((CORE_X0, CORE_Y0, CORE_X1, CORE_Y1),
                       radius=14, fill=(22, 27, 34, 255), outline=INDIGO + (255,), width=3)

draw.text((CORE_CENTRE_X, CORE_Y0 + 12), "CORE  ·  REQUIRED BY ALL OVERLAYS",
          font=font_core_eyebrow, fill=INDIGO_TEXT, anchor="mt")
draw.text((CORE_CENTRE_X, CORE_Y0 + 30), "arckit",
          font=font_core_name, fill=TEXT_PRIMARY, anchor="mt")
draw.text((CORE_CENTRE_X, CORE_Y0 + 64), "71 cmds  ·  hooks  ·  MCP  ·  doc-types  ·  validators",
          font=font_core_meta, fill=TEXT_SECONDARY, anchor="mt")

# --- Row 3: Six community-overlay cards in a 3-wide x 2-tall grid ---
NODE_W = 280
NODE_H = 76
GRID_GAP_X = 24
GRID_GAP_Y = 18
GRID_TOTAL_W = NODE_W * 3 + GRID_GAP_X * 2
GRID_LEFT = (WIDTH - GRID_TOTAL_W) // 2
GRID_TOP = 330

# (plugin name, jurisdiction label, code, command count, accent colour, label colour)
overlays = [
    ("arckit-uae", "UAE Federal",         "AE", "12 cmds + 2 recipes", PURPLE, (216, 180, 254)),
    ("arckit-fr",  "French Public Sector", "FR", "12 cmds",            ORANGE, (251, 180, 142)),
    ("arckit-ca",  "Canada Federal",      "CA", "12 cmds + 1 recipe",  SALMON, (253, 175, 184)),
    ("arckit-eu",  "EU Regulatory",       "EU", "7 cmds",              GOLD,   (250, 215, 76)),
    ("arckit-at",  "Austrian Government", "AT", "3 cmds",              CYAN,   (125, 234, 246)),
    ("arckit-au",  "Australian Federal",  "AU", "8 cmds + 1 recipe",   GREEN,  (140, 240, 178)),
]

node_rects = []
for idx, (name, label, code, count, ring, text_col) in enumerate(overlays):
    col = idx % 3
    row = idx // 3
    nx0 = GRID_LEFT + col * (NODE_W + GRID_GAP_X)
    ny0 = GRID_TOP + row * (NODE_H + GRID_GAP_Y)
    nx1 = nx0 + NODE_W
    ny1 = ny0 + NODE_H
    node_rects.append((nx0, ny0, nx1, ny1, name, label, code, count, ring, text_col))

# Connection lines first so cards sit on top.
# Top-row cards draw a short line up from their top edge to the core's bottom edge.
# Bottom-row cards draw a longer line up through the gap.
for (nx0, ny0, nx1, ny1, name, label, code, count, ring, text_col) in node_rects:
    node_top_centre_x = (nx0 + nx1) // 2
    # Connection enters the core at a point on its bottom edge nearest the node.
    enter_x = max(CORE_X0 + 18, min(CORE_X1 - 18, node_top_centre_x))
    enter_y = CORE_Y1
    leave_x = node_top_centre_x
    leave_y = ny0
    # Two-segment vertical-then-vertical (with a tiny horizontal jog if needed),
    # rendered as a dashed line. Use a single straight line for simplicity.
    total_len = ((leave_x - enter_x) ** 2 + (leave_y - enter_y) ** 2) ** 0.5
    steps = max(int(total_len // 12), 3)
    for s in range(steps):
        a = s / steps
        b = (s + 0.55) / steps
        x1 = enter_x + (leave_x - enter_x) * a
        y1 = enter_y + (leave_y - enter_y) * a
        x2 = enter_x + (leave_x - enter_x) * b
        y2 = enter_y + (leave_y - enter_y) * b
        draw.line([(x1, y1), (x2, y2)], fill=ring + (130,), width=2)

# Render the cards.
for (nx0, ny0, nx1, ny1, name, label, code, count, ring, text_col) in node_rects:
    # Drop shadow
    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((nx0 + 3, ny0 + 5, nx1 + 3, ny1 + 5),
                            radius=11, fill=(0, 0, 0, 110))
    img.alpha_composite(shadow)

    draw.rounded_rectangle((nx0, ny0, nx1, ny1),
                           radius=11, fill=(22, 27, 34, 255), outline=ring + (255,), width=2)

    # Country code chip on the left.
    chip_x0 = nx0 + 12
    chip_y0 = ny0 + 14
    chip_x1 = chip_x0 + 32
    chip_y1 = chip_y0 + 20
    draw.rounded_rectangle((chip_x0, chip_y0, chip_x1, chip_y1),
                           radius=4, fill=ring + (255,))
    draw.text(((chip_x0 + chip_x1) // 2, (chip_y0 + chip_y1) // 2 - 1),
              code, font=font_node_meta, fill=(13, 17, 23), anchor="mm")

    # Plugin name (mono, bold, accent colour) next to chip.
    draw.text((chip_x1 + 12, chip_y0 + 10), name,
              font=font_node_name, fill=text_col, anchor="lm")

    # Human label on second row.
    draw.text((nx0 + 14, ny0 + 44), label, font=font_node_label, fill=TEXT_PRIMARY)

    # Command count on right, second row.
    draw.text((nx1 - 14, ny1 - 12), count,
              font=font_node_meta, fill=TEXT_TERTIARY, anchor="rb")

# --- Row 4: Footer stat strip ---
FOOTER_Y = HEIGHT - 56
draw.text((PAD, FOOTER_Y),
          "125 commands  ·  7 marketplace plugins  ·  6 jurisdictions  ·  exact-version dependencies",
          font=font_footer_stat, fill=TEXT_PRIMARY)
draw.text((PAD, FOOTER_Y + 22),
          "arckit.org/getting-started.html  ·  claude plugin install arckit arckit-{uae,fr,ca,eu,at,au}",
          font=font_footer_meta, fill=TEXT_TERTIARY)

# --- Save ---
out_path = os.path.join(os.path.dirname(__file__) or ".",
                       "2026-05-18-arckit-v5-plugin-split-hero.png")
img.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path}")
