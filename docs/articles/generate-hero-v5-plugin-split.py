"""Hero for 2026-05-18-arckit-v5-plugin-split.md.

Concept: hub-and-spoke visualisation of the v5.0.0 marketplace topology.
Centre: `arckit` core plugin (71 commands, the UK Government baseline).
Six surrounding nodes: the community overlay plugins, each with a
jurisdiction flag-like indicator. Lines from each overlay back to the
core represent the `dependencies` field auto-installing core.

Distinct from prior hero layouts (flat grids, tiered stacks) by using
a radial hub-and-spoke composition.
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

WIDTH = 1200
HEIGHT = 630

BG = (13, 17, 23)
TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (88, 96, 110)

INDIGO = (99, 102, 241)
INDIGO_TEXT = (165, 180, 252)
INDIGO_DIM = (49, 46, 129)

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
    """Top/bottom gradient accent strips."""
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


font_eyebrow = load_font(font_mono_paths, 11)
font_title = load_font(font_bold_paths, 38)
font_subtitle = load_font(font_regular_paths, 16)
font_core_label = load_font(font_bold_paths, 22)
font_core_sub = load_font(font_mono_paths, 11)
font_node_label = load_font(font_bold_paths, 13)
font_node_flag = load_font(font_bold_paths, 16)
font_node_meta = load_font(font_mono_paths, 9)
font_footer_stat = load_font(font_bold_paths, 14)
font_footer_meta = load_font(font_mono_paths, 10)

# --- Header text block (top-left aligned) ---
PAD = 64

draw.text((PAD, 38), "ARCKIT V5.0.0", font=font_eyebrow, fill=INDIGO_TEXT)
draw.text((PAD, 60), "One toolkit. Seven plugins.", font=font_title, fill=TEXT_PRIMARY)
draw.text((PAD, 108), "Install only what you need.", font=font_title, fill=TEXT_SECONDARY)
draw.text((PAD, 162), "The community-overlay split: arckit core + six per-jurisdiction plugins.",
          font=font_subtitle, fill=TEXT_SECONDARY)

# --- Hub-and-spoke layout ---
CENTRE_X = WIDTH // 2
CENTRE_Y = 380

# Core node geometry
CORE_W = 240
CORE_H = 110
core_x0 = CENTRE_X - CORE_W // 2
core_y0 = CENTRE_Y - CORE_H // 2
core_x1 = CENTRE_X + CORE_W // 2
core_y1 = CENTRE_Y + CORE_H // 2

# Overlay nodes around the core (6 plugins).
# Place them on a roughly elliptical orbit with the long axis horizontal,
# leaving room above for the header and below for the footer.
NODE_W = 168
NODE_H = 72
RADIUS_X = 380
RADIUS_Y = 158

# (name, label, flag emoji, command count, ring colour, text colour)
overlays = [
    ("arckit-uae", "UAE Federal", "AE", "12 cmds", PURPLE, (192, 132, 252)),
    ("arckit-fr", "French Public Sector", "FR", "12 cmds", ORANGE, (232, 149, 106)),
    ("arckit-ca", "Canada Federal", "CA", "12 cmds", SALMON, (253, 164, 175)),
    ("arckit-eu", "EU Regulatory", "EU", "7 cmds", GOLD, (250, 204, 21)),
    ("arckit-at", "Austrian Gov", "AT", "3 cmds", CYAN, (103, 232, 249)),
    ("arckit-au", "Australian Federal", "AU", "8 cmds", GREEN, (134, 239, 172)),
]

# Angle assignments (radians), 6 plugins around the hub.
# Skip the very top and bottom so the title and footer stay clean.
angles = [
    math.radians(150),  # upper left
    math.radians(210),  # lower left
    math.radians(270 - 12),  # below-centre, left
    math.radians(270 + 12),  # below-centre, right
    math.radians(330),  # lower right
    math.radians(30),   # upper right
]

node_positions = []
for (name, label, flag, count, ring, text_col), angle in zip(overlays, angles):
    nx = CENTRE_X + int(math.cos(angle) * RADIUS_X)
    ny = CENTRE_Y + int(math.sin(angle) * RADIUS_Y)
    node_positions.append((name, label, flag, count, ring, text_col, nx, ny))

# Draw the connection lines first so the nodes sit on top.
for (_, _, _, _, ring, _, nx, ny) in node_positions:
    # Compute the edge of the core rectangle along the direction of the node.
    dx = nx - CENTRE_X
    dy = ny - CENTRE_Y
    if dx == 0:
        sx = CENTRE_X
        sy = core_y0 if dy < 0 else core_y1
    else:
        slope = dy / dx
        if abs(slope) * (CORE_W / 2) <= CORE_H / 2:
            sx = CENTRE_X + (CORE_W // 2) * (1 if dx > 0 else -1)
            sy = CENTRE_Y + slope * (CORE_W / 2) * (1 if dx > 0 else -1)
        else:
            sy_off = CORE_H // 2 * (1 if dy > 0 else -1)
            sx = CENTRE_X + (sy_off / slope)
            sy = CENTRE_Y + sy_off
    # And the edge of the overlay rectangle along the same line.
    if dx == 0:
        ex = nx
        ey = ny + (NODE_H // 2 if dy < 0 else -NODE_H // 2)
    else:
        slope = dy / dx
        if abs(slope) * (NODE_W / 2) <= NODE_H / 2:
            ex = nx - (NODE_W // 2) * (1 if dx > 0 else -1)
            ey = ny - slope * (NODE_W / 2) * (1 if dx > 0 else -1)
        else:
            ey_off = NODE_H // 2 * (1 if dy > 0 else -1)
            ex = nx - (ey_off / slope)
            ey = ny - ey_off
    # Dashed line in the ring colour.
    total = ((ex - sx) ** 2 + (ey - sy) ** 2) ** 0.5
    if total < 1:
        continue
    steps = max(int(total // 14), 2)
    for i in range(steps):
        a = i / steps
        b = (i + 0.55) / steps
        x1 = sx + (ex - sx) * a
        y1 = sy + (ey - sy) * a
        x2 = sx + (ex - sx) * b
        y2 = sy + (ey - sy) * b
        draw.line([(x1, y1), (x2, y2)], fill=ring + (160,), width=2)

# --- Core node ---
# Drop shadow.
shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
sdraw.rounded_rectangle((core_x0 + 4, core_y0 + 6, core_x1 + 4, core_y1 + 6),
                        radius=14, fill=(0, 0, 0, 130))
img.alpha_composite(shadow)

# Card.
draw.rounded_rectangle((core_x0, core_y0, core_x1, core_y1),
                       radius=14, fill=(22, 27, 34, 255), outline=INDIGO + (255,), width=3)
# Eyebrow + name + meta.
draw.text((CENTRE_X, core_y0 + 14), "CORE", font=font_eyebrow, fill=INDIGO_TEXT, anchor="mt")
draw.text((CENTRE_X, core_y0 + 34), "arckit", font=font_core_label, fill=TEXT_PRIMARY, anchor="mt")
draw.text((CENTRE_X, core_y0 + 68), "71 commands · UK baseline", font=font_core_sub,
          fill=TEXT_SECONDARY, anchor="mt")
draw.text((CENTRE_X, core_y0 + 86), "hooks · MCP · doc-types", font=font_core_sub,
          fill=TEXT_TERTIARY, anchor="mt")

# --- Overlay nodes ---
for (name, label, flag, count, ring, text_col, nx, ny) in node_positions:
    nx0 = nx - NODE_W // 2
    ny0 = ny - NODE_H // 2
    nx1 = nx + NODE_W // 2
    ny1 = ny + NODE_H // 2

    # Drop shadow.
    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((nx0 + 3, ny0 + 5, nx1 + 3, ny1 + 5),
                            radius=11, fill=(0, 0, 0, 110))
    img.alpha_composite(shadow)

    draw.rounded_rectangle((nx0, ny0, nx1, ny1),
                           radius=11, fill=(22, 27, 34, 255), outline=ring + (255,), width=2)

    # Flag-style tag chip on the left.
    chip_x0 = nx0 + 8
    chip_y0 = ny0 + 8
    chip_x1 = chip_x0 + 28
    chip_y1 = chip_y0 + 18
    draw.rounded_rectangle((chip_x0, chip_y0, chip_x1, chip_y1),
                           radius=4, fill=ring + (255,))
    draw.text(((chip_x0 + chip_x1) // 2, (chip_y0 + chip_y1) // 2 - 1),
              flag, font=font_node_meta, fill=(13, 17, 23), anchor="mm")

    # Plugin name (mono, bold, accent colour).
    draw.text((chip_x1 + 8, chip_y0 + 8), name, font=font_node_label, fill=text_col,
              anchor="lm")
    # Human label.
    draw.text((nx0 + 12, ny0 + 38), label, font=font_node_meta, fill=TEXT_PRIMARY)
    # Command count.
    draw.text((nx1 - 12, ny1 - 12), count, font=font_node_meta, fill=TEXT_TERTIARY,
              anchor="rb")

# --- Footer stat strip ---
footer_y = HEIGHT - 56
draw.text((PAD, footer_y),
          "125 commands  ·  7 marketplace plugins  ·  6 jurisdictions  ·  exact-version dependencies",
          font=font_footer_stat, fill=TEXT_PRIMARY)
draw.text((PAD, footer_y + 22),
          "arckit.org  ·  v5.0.0  ·  Released 18 May 2026",
          font=font_footer_meta, fill=TEXT_TERTIARY)

# --- Save ---
out_path = os.path.join(os.path.dirname(__file__) or ".", "2026-05-18-arckit-v5-plugin-split-hero.png")
img.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path}")
