"""Hero for 2026-05-22-tidy-wardley-labels.md.

Concept: the same Wardley Map twice. On the left, BEFORE: every label is
drawn at Mermaid's default offset, so the clustered components collide
into an unreadable pile. On the right, AFTER: the placement engine has
scored each label into a clean, non-overlapping slot. A wardley-tidy
pill sits in the gap, the transform between the two states.

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
CYAN = (34, 211, 238)
GREEN = (34, 197, 94)
GOLD = (234, 179, 8)
SALMON = (251, 113, 133)
PURPLE = (168, 85, 247)

CARD_BG = (22, 27, 34, 255)
CARD_CHROME = (32, 38, 46, 255)

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
        if t < 0.25:
            r, g, b = INDIGO
        elif t < 0.5:
            f = (t - 0.25) / 0.25
            r = int(INDIGO[0] + (CYAN[0] - INDIGO[0]) * f)
            g = int(INDIGO[1] + (CYAN[1] - INDIGO[1]) * f)
            b = int(INDIGO[2] + (CYAN[2] - INDIGO[2]) * f)
        elif t < 0.75:
            f = (t - 0.5) / 0.25
            r = int(CYAN[0] + (GREEN[0] - CYAN[0]) * f)
            g = int(CYAN[1] + (GREEN[1] - CYAN[1]) * f)
            b = int(CYAN[2] + (GREEN[2] - CYAN[2]) * f)
        else:
            f = (t - 0.75) / 0.25
            r = int(GREEN[0] + (GOLD[0] - GREEN[0]) * f)
            g = int(GREEN[1] + (GOLD[1] - GREEN[1]) * f)
            b = int(GREEN[2] + (GOLD[2] - GREEN[2]) * f)
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
font_title = load_font(font_bold_paths, 38)
font_subtitle = load_font(font_regular_paths, 16)
font_card_eyebrow = load_font(font_mono_paths, 11)
font_card_meta = load_font(font_mono_paths, 10)
font_node = load_font(font_bold_paths, 10)
font_axis = load_font(font_mono_paths, 10)
font_footer_stat = load_font(font_bold_paths, 15)
font_footer_meta = load_font(font_mono_paths, 10)

PAD = 56

# --- Row 1: Title block ---
draw.text((PAD, 32), "ARCKIT  ·  WARDLEY MAPPING  ·  MAY 2026",
          font=font_eyebrow, fill=INDIGO_TEXT)
draw.text((PAD, 56), "Untangling the map.",
          font=font_title, fill=TEXT_PRIMARY)
draw.text((PAD, 102),
          "A deterministic engine scores every label slot, so no two collide.",
          font=font_subtitle, fill=TEXT_SECONDARY)


# --- Card scaffolding ---
def draw_card(x0, y0, x1, y1, accent, eyebrow):
    shadow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle((x0 + 4, y0 + 6, x1 + 4, y1 + 6),
                            radius=14, fill=(0, 0, 0, 130))
    img.alpha_composite(shadow)

    draw.rounded_rectangle((x0, y0, x1, y1),
                           radius=14, fill=CARD_BG, outline=accent + (255,), width=2)

    chrome_h = 30
    draw.rounded_rectangle((x0, y0, x1, y0 + chrome_h),
                           radius=14, fill=CARD_CHROME)
    draw.rectangle((x0, y0 + 14, x1, y0 + chrome_h), fill=CARD_CHROME)
    for i, col in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        cx = x0 + 14 + i * 14
        cy = y0 + 15
        draw.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=col)
    draw.text((x1 - 16, y0 + 15), "wardley-beta",
              font=font_card_meta, fill=TEXT_TERTIARY, anchor="rm")
    draw.text((x0 + 18, y0 + chrome_h + 10),
              eyebrow, font=font_card_eyebrow, fill=accent)


# Shared map: a tight three-component cluster whose default labels pile
# into an unreadable heap, plus spaced-out nodes that are fine either way.
# (x evolution 0..1, y visibility 0..1 bottom-up, label, sourcing, after-dir)
COMPONENTS = [
    (0.88, 0.90, "Citizen portal",   None,    "NE"),
    (0.58, 0.66, "Booking service",  "build", "W"),
    (0.65, 0.61, "Notifications",    "buy",   "NE"),
    (0.61, 0.55, "Case store",       "build", "S"),
    (0.38, 0.38, "Identity",         "buy",   "SW"),
    (0.20, 0.74, "Foundation model", None,    "NW"),
    (0.09, 0.93, "Compute",          "buy",   "E"),
]
EDGES = [(0, 1), (1, 2), (1, 3), (3, 4), (2, 4), (4, 5), (5, 6)]

SOURCING_COLOUR = {"build": GREEN, "buy": GOLD}
DIRS = {
    "E": (1, 0), "NE": (0.71, -0.71), "N": (0, -1), "NW": (-0.71, -0.71),
    "W": (-1, 0), "SW": (-0.71, 0.71), "S": (0, 1), "SE": (0.71, 0.71),
}


def draw_wardley_map(x0, y0, x1, y1, accent, tidy):
    """Draw the shared map. tidy=False piles labels at the default offset;
    tidy=True spreads each label into its scored slot."""
    plot_x0 = x0 + 56
    plot_y0 = y0 + 16
    plot_x1 = x1 - 18
    plot_y1 = y1 - 34

    draw.line([(plot_x0, plot_y0), (plot_x0, plot_y1)], fill=TEXT_TERTIARY, width=1)
    draw.line([(plot_x0, plot_y1), (plot_x1, plot_y1)], fill=TEXT_TERTIARY, width=1)

    stage_w = (plot_x1 - plot_x0) / 4
    for i in range(1, 4):
        gx = int(plot_x0 + stage_w * i)
        for dy in range(plot_y0, plot_y1, 6):
            draw.line([(gx, dy), (gx, dy + 3)], fill=(255, 255, 255, 25), width=1)
    for i, lab in enumerate(["GENESIS", "CUSTOM", "PRODUCT", "COMMODITY"]):
        lab_x = int(plot_x0 + stage_w * (i + 0.5))
        draw.text((lab_x, plot_y1 + 6), lab,
                  font=font_axis, fill=TEXT_TERTIARY, anchor="mt")
    draw.text((plot_x0 - 46, plot_y0), "VISIBLE", font=font_axis, fill=TEXT_TERTIARY)
    draw.text((plot_x0 - 46, plot_y1 - 10), "INVIS.", font=font_axis, fill=TEXT_TERTIARY)

    px = [int(plot_x0 + c[0] * (plot_x1 - plot_x0)) for c in COMPONENTS]
    py = [int(plot_y1 - c[1] * (plot_y1 - plot_y0)) for c in COMPONENTS]

    for a, b in EDGES:
        draw.line([(px[a], py[a]), (px[b], py[b])],
                  fill=(139, 148, 158, 170), width=1)

    # Labels first when tidy (so node markers sit on top); for the pile,
    # draw labels last so the overlap is visibly messy.
    def draw_nodes():
        for i, (xf, yf, label, sourcing, after) in enumerate(COMPONENTS):
            cx, cy = px[i], py[i]
            ring = accent if sourcing is None else SOURCING_COLOUR.get(sourcing, accent)
            draw.ellipse((cx - 5, cy - 5, cx + 5, cy + 5),
                         fill=(13, 17, 23, 255), outline=ring + (255,), width=2)

    def draw_labels():
        for i, (xf, yf, label, sourcing, after) in enumerate(COMPONENTS):
            cx, cy = px[i], py[i]
            if tidy:
                dx, dy = DIRS[after]
                dist = 20
                lx = cx + int(dx * dist) + (5 if dx >= 0 else -5)
                ly = cy + int(dy * dist)
                anchor = "lm" if dx >= 0 else "rm"
                # Faint leader line from node to a long-offset label.
                draw.line([(cx, cy), (cx + int(dx * dist), cy + int(dy * dist))],
                          fill=(139, 148, 158, 90), width=1)
                draw.text((lx, ly), label, font=font_node,
                          fill=TEXT_PRIMARY, anchor=anchor)
            else:
                # Mermaid default: every label up-and-right by the same offset.
                lx = cx + 8
                ly = cy - 9
                draw.text((lx, ly), label, font=font_node,
                          fill=(230, 237, 243, 205), anchor="lm")

    if tidy:
        draw_labels()
        draw_nodes()
    else:
        draw_nodes()
        draw_labels()


CARD_TOP = 158
CARD_BOTTOM = HEIGHT - 92
CARD_GAP = 30
CARD_W = (WIDTH - PAD * 2 - CARD_GAP) // 2

LEFT_X0 = PAD
LEFT_X1 = LEFT_X0 + CARD_W
draw_card(LEFT_X0, CARD_TOP, LEFT_X1, CARD_BOTTOM,
          accent=SALMON, eyebrow="BEFORE  ·  DEFAULT LABEL OFFSETS")
draw_wardley_map(LEFT_X0, CARD_TOP + 46, LEFT_X1, CARD_BOTTOM,
                 accent=SALMON, tidy=False)

RIGHT_X0 = LEFT_X1 + CARD_GAP
RIGHT_X1 = RIGHT_X0 + CARD_W
draw_card(RIGHT_X0, CARD_TOP, RIGHT_X1, CARD_BOTTOM,
          accent=GREEN, eyebrow="AFTER  ·  SCORED PLACEMENT")
draw_wardley_map(RIGHT_X0, CARD_TOP + 46, RIGHT_X1, CARD_BOTTOM,
                 accent=GREEN, tidy=True)

# --- Connecting pill between the cards ---
LINK_CX = WIDTH // 2
LINK_CY = (CARD_TOP + CARD_BOTTOM) // 2
PILL_W, PILL_H = 134, 58
draw.rounded_rectangle((LINK_CX - PILL_W // 2, LINK_CY - PILL_H // 2,
                        LINK_CX + PILL_W // 2, LINK_CY + PILL_H // 2),
                       radius=10, fill=CARD_BG, outline=CYAN + (255,), width=2)
draw.text((LINK_CX, LINK_CY - 11), "wardley-tidy",
          font=font_card_eyebrow, fill=CYAN, anchor="mm")
draw.text((LINK_CX, LINK_CY + 9), "place + score",
          font=font_card_meta, fill=TEXT_SECONDARY, anchor="mm")
# Small arrowheads either side of the pill.
for sx, sdir in ((LINK_CX - PILL_W // 2 - 14, 1), (LINK_CX + PILL_W // 2 + 14, 1)):
    draw.polygon([(sx, LINK_CY - 5), (sx, LINK_CY + 5), (sx + 8, LINK_CY)],
                 fill=CYAN)

# --- Footer stat strip ---
FOOTER_Y = HEIGHT - 58
draw.text((PAD, FOOTER_Y),
          "32 candidate slots per label  ·  most-constrained-first  ·  weighted collision scoring  ·  idempotent by design",
          font=font_footer_stat, fill=TEXT_PRIMARY)
draw.text((PAD, FOOTER_Y + 22),
          "/arckit:wardley  ·  labels auto-tidied by a PostToolUse hook on every write  ·  arckit.org",
          font=font_footer_meta, fill=TEXT_TERTIARY)

# --- Save ---
out_path = os.path.join(os.path.dirname(__file__) or ".",
                        "2026-05-22-tidy-wardley-labels-hero.png")
img.convert("RGB").save(out_path, "PNG", optimize=True)
print(f"Wrote {out_path}")
