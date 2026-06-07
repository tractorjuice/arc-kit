"""Generate the primary ArcKit hero image.

Explains the product at a glance:
  - the arckit CORE (commands / agents / skills / MCP / doc-types)
  - THE GOVERNANCE HARNESS framing the core, studded with hooks (the
    governance gates + observers that wrap the AI coding assistant)
  - DISTRIBUTION formats (Claude Code, Codex, Gemini, OpenCode, Copilot, CLI)
  - SECTOR & JURISDICTION OVERLAYS (9 community plugins)

Matches docs/articles hero style: #0d1117 background, subtle grid,
gradient rails, rounded accent cards, chip rows. 1200x630 (OG size).
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH, HEIGHT = 1200, 630

# --- Palette (ArcKit / GitHub-dark) ---
BG = (13, 17, 23)
PANEL = (22, 27, 34)
PANEL_2 = (28, 34, 43)
BORDER = (48, 54, 61)
NAVY = (11, 31, 51)            # brand navy #0B1F33

TEXT_PRIMARY = (230, 237, 243)
TEXT_SECONDARY = (139, 148, 158)
TEXT_TERTIARY = (90, 98, 108)

INDIGO = (99, 102, 241)
INDIGO_T = (165, 180, 252)
ORANGE = (217, 119, 67)
ORANGE_T = (232, 149, 106)
PURPLE = (168, 85, 247)
PURPLE_T = (192, 132, 252)
GREEN = (34, 197, 94)
GREEN_T = (134, 239, 172)
RED = (239, 83, 80)
RED_T = (248, 142, 140)
CYAN = (56, 189, 248)
CYAN_T = (125, 211, 252)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# --- Subtle dotted texture (faint grid intersections, not full lines) ---
for x in range(0, WIDTH, 32):
    for y in range(0, HEIGHT, 32):
        draw.point((x, y), fill=(255, 255, 255, 16))

# --- Fonts ---
BOLD = ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"]
REG = ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
       "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"]
MONO = ["/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"]
MONO_R = ["/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
          "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"]


def load(paths, size):
    for p in paths:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


f_brand = load(BOLD, 50)
f_tag = load(REG, 19)
f_url = load(MONO_R, 14)
f_section = load(BOLD, 13)
f_card_title = load(BOLD, 17)
f_stat_v = load(BOLD, 26)
f_stat_l = load(REG, 12)
f_item = load(REG, 14)
f_chip = load(MONO, 12)
f_chip_r = load(REG, 13)
f_hook = load(MONO, 11)
f_core_sub = load(REG, 13)


def tw(font, text):
    return draw.textlength(text, font=font)


def rrect(box, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def gradient_rail(y0, y1, alpha):
    stops = [INDIGO, CYAN, ORANGE, PURPLE, GREEN]
    seg = WIDTH / (len(stops) - 1)
    for x in range(WIDTH):
        i = min(int(x / seg), len(stops) - 2)
        f = (x - i * seg) / seg
        a, b = stops[i], stops[i + 1]
        r = int(a[0] + (b[0] - a[0]) * f)
        g = int(a[1] + (b[1] - a[1]) * f)
        bl = int(a[2] + (b[2] - a[2]) * f)
        draw.line([(x, y0), (x, y1)], fill=(r, g, bl, alpha))


gradient_rail(0, 5, 230)
gradient_rail(HEIGHT - 4, HEIGHT, 170)

# ============================================================
# Header
# ============================================================
draw.text((48, 34), "ArcKit", font=f_brand, fill=TEXT_PRIMARY)
bw = tw(f_brand, "ArcKit")
# small registered-mark style accent square
rrect((48 + bw + 12, 50, 48 + bw + 28, 66), 3, fill=ORANGE)
draw.text((48, 92), "The Enterprise Architecture Governance Harness",
          font=f_tag, fill=TEXT_SECONDARY)

# top-right url + version badge
url = "arckit.org"
draw.text((WIDTH - 48 - tw(f_url, url), 44), url, font=f_url, fill=TEXT_TERTIARY)
vb = "v5.5"
vbw = tw(f_chip, vb) + 20
rrect((WIDTH - 48 - vbw, 66, WIDTH - 48, 88), 11, fill=NAVY, outline=INDIGO, width=1)
draw.text((WIDTH - 48 - vbw + 10, 70), vb, font=f_chip, fill=INDIGO_T)

# ============================================================
# THE GOVERNANCE HARNESS frame
# ============================================================
FX0, FY0, FX1, FY1 = 48, 150, WIDTH - 48, 470
rrect((FX0, FY0, FX1, FY1), 16, fill=(18, 23, 30, 255), outline=BORDER, width=2)

# corner "bolts" of the harness
for cx, cy in [(FX0, FY0), (FX1, FY0), (FX0, FY1), (FX1, FY1)]:
    draw.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=PANEL_2, outline=ORANGE, width=2)

# frame label tab
tab = " THE GOVERNANCE HARNESS "
tabw = tw(f_section, tab) + 16
rrect((FX0 + 22, FY0 - 12, FX0 + 22 + tabw, FY0 + 12), 12, fill=NAVY, outline=ORANGE, width=1)
draw.text((FX0 + 30, FY0 - 6), tab.strip(), font=f_section, fill=ORANGE_T)


def hook_chip(x, y, label, dot):
    """Small bolt-style hook pill; returns x advance."""
    label = label
    w = tw(f_hook, label) + 28
    rrect((x, y, x + w, y + 22), 11, fill=PANEL, outline=BORDER, width=1)
    draw.ellipse((x + 9, y + 7, x + 17, y + 15), fill=dot)
    draw.text((x + 22, y + 5), label, font=f_hook, fill=TEXT_SECONDARY)
    return w + 8


# --- Top hook rail: GATES ---
draw.text((FX0 + 28, FY0 + 24), "HOOKS — GATES", font=f_section, fill=RED_T)
gates = ["file-protection", "secret-detection", "validate-arc-filename",
         "score-validator", "validate-wardley-math"]
hx = FX0 + 28 + tw(f_section, "HOOKS — GATES") + 18
for g in gates:
    hx += hook_chip(hx, FY0 + 22, g, RED)

# --- Bottom hook rail: OBSERVERS ---
oy = FY1 - 46
draw.text((FX0 + 28, oy + 4), "OBSERVERS", font=f_section, fill=GREEN_T)
obs = ["provenance-stamp", "graph-inject", "telemetry", "update-manifest",
       "postcompact-rehydrate", "session-learner"]
hx = FX0 + 28 + tw(f_section, "OBSERVERS") + 18
for o in obs:
    hx += hook_chip(hx, oy, o, GREEN)

# ============================================================
# Inner cards: DISTRIBUTION + CORE
# ============================================================
IY0, IY1 = FY0 + 56, oy - 14

# --- Distribution card (left) ---
DX0, DX1 = FX0 + 28, FX0 + 300
rrect((DX0, IY0, DX1, IY1), 12, fill=PANEL, outline=BORDER, width=1)
draw.text((DX0 + 16, IY0 + 12), "DISTRIBUTION", font=f_section, fill=CYAN_T)
formats = ["Claude Code  (plugin)", "Codex CLI", "Gemini CLI",
           "OpenCode CLI", "GitHub Copilot", "Python CLI  (pip / uv)"]
fy = IY0 + 40
for fmt in formats:
    draw.ellipse((DX0 + 16, fy + 5, DX0 + 22, fy + 11), fill=CYAN)
    draw.text((DX0 + 32, fy), fmt, font=f_item, fill=TEXT_PRIMARY)
    fy += 25

# connector line distribution -> core
draw.line([(DX1, (IY0 + IY1) // 2), (DX1 + 30, (IY0 + IY1) // 2)],
          fill=BORDER, width=2)

# --- CORE card (right) ---
CX0, CX1 = DX1 + 30, FX1 - 28
rrect((CX0, IY0, CX1, IY1), 12, fill=NAVY, outline=INDIGO, width=2)
# core title
draw.text((CX0 + 20, IY0 + 14), "arckit", font=f_card_title, fill=TEXT_PRIMARY)
cw = tw(f_card_title, "arckit")
core_tab = "CORE PLUGIN"
ctw = tw(f_chip, core_tab) + 18
rrect((CX0 + 24 + cw, IY0 + 13, CX0 + 24 + cw + ctw, IY0 + 33), 10,
      fill=PANEL_2, outline=INDIGO, width=1)
draw.text((CX0 + 33 + cw, IY0 + 16), core_tab, font=f_chip, fill=INDIGO_T)

# stat blocks
stats = [("71", "commands"), ("16", "agents"), ("5", "skills"),
         ("22", "hooks"), ("128", "doc-types")]
sx = CX0 + 20
sy = IY0 + 48
gap = (CX1 - CX0 - 40) / len(stats)
for i, (v, l) in enumerate(stats):
    x = sx + i * gap
    draw.text((x, sy), v, font=f_stat_v, fill=INDIGO_T)
    draw.text((x, sy + 30), l, font=f_stat_l, fill=TEXT_SECONDARY)

# divider
dyl = sy + 56
draw.line([(CX0 + 20, dyl), (CX1 - 20, dyl)], fill=(255, 255, 255, 22), width=1)

# MCP chips
draw.text((CX0 + 20, dyl + 12), "MCP", font=f_section, fill=PURPLE_T)
mcps = ["aws-knowledge", "microsoft-learn", "google-dev", "datacommons", "govreposcrape"]
mx = CX0 + 20 + tw(f_section, "MCP") + 14
my = dyl + 8
for m in mcps:
    w = tw(f_chip, m) + 20
    if mx + w > CX1 - 16:
        break
    rrect((mx, my, mx + w, my + 22), 11, fill=PANEL_2, outline=PURPLE, width=1)
    draw.text((mx + 10, my + 4), m, font=f_chip, fill=PURPLE_T)
    mx += w + 7

# tagline strip inside core
draw.text((CX0 + 20, my + 32),
          "templates  -  traceability  -  provenance  -  assurance",
          font=f_core_sub, fill=TEXT_SECONDARY)

# ============================================================
# SECTOR & JURISDICTION OVERLAYS
# ============================================================
OY = FY1 + 26
draw.text((48, OY), "SECTOR & JURISDICTION OVERLAYS", font=f_section, fill=ORANGE_T)
note = "community plugins  -  compose with the core"
draw.text((48 + tw(f_section, "SECTOR & JURISDICTION OVERLAYS") + 16, OY + 1),
          note, font=f_stat_l, fill=TEXT_TERTIARY)

# right-aligned legend: jurisdiction (indigo) / sector (purple)
leg_sector_w = tw(f_stat_l, "sector (UK)")
sx = WIDTH - 48 - leg_sector_w
draw.text((sx, OY + 1), "sector (UK)", font=f_stat_l, fill=TEXT_SECONDARY)
draw.ellipse((sx - 16, OY + 4, sx - 8, OY + 12), fill=PURPLE)
leg_jur_w = tw(f_stat_l, "jurisdiction")
jx = sx - 16 - 22 - leg_jur_w
draw.text((jx, OY + 1), "jurisdiction", font=f_stat_l, fill=TEXT_SECONDARY)
draw.ellipse((jx - 16, OY + 4, jx - 8, OY + 12), fill=INDIGO)

overlays = [
    ("UAE", "12", INDIGO, INDIGO_T),
    ("France", "12", INDIGO, INDIGO_T),
    ("Canada", "12", INDIGO, INDIGO_T),
    ("USA Federal", "10", INDIGO, INDIGO_T),
    ("Australia", "8", INDIGO, INDIGO_T),
    ("EU", "7", INDIGO, INDIGO_T),
    ("Austria", "3", INDIGO, INDIGO_T),
    ("UK Finance", "4", PURPLE, PURPLE_T),
    ("UK NHS", "4", PURPLE, PURPLE_T),
]
cy = OY + 26
cx = 48
for name, cnt, col, colt in overlays:
    label = f"{name}"
    w = tw(f_chip_r, label) + tw(f_chip, cnt) + 38
    rrect((cx, cy, cx + w, cy + 30), 15, fill=PANEL, outline=col, width=1)
    draw.text((cx + 14, cy + 7), label, font=f_chip_r, fill=TEXT_PRIMARY)
    # count badge
    bx = cx + 14 + tw(f_chip_r, label) + 8
    draw.text((bx, cy + 8), cnt, font=f_chip, fill=colt)
    cx += w + 10

img.convert("RGB").save("/workspaces/arc-kit/docs/arckit-hero.png", "PNG")
print("wrote docs/arckit-hero.png")
