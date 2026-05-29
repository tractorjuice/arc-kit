"""Generate the ArcKit ARCHITECTURE hero image (bottom-up flow).

Reads BOTTOM -> TOP. The Enterprise Governance Harness fires hooks across
the WHOLE session lifecycle (not just around tool calls):

  GOVERNED ARTIFACTS  (projects/)                     <- top (outputs)
        ^ generates (governed)
  THE ENTERPRISE GOVERNANCE HARNESS  (perimeter)
        [after]  PostCompact . Stop                   (top rails)
        [after]  PostToolUse OBSERVERS
        ----  ARCKIT CORE ENGINE  (overlays + MCP)  ----
        [before] PreToolUse GATES                      (bottom rails)
        [before] Permission & Access
        [before] UserPromptSubmit
        [before] SessionStart
        ^ tool calls
  AI CODING ASSISTANTS  (surfaces)                    <- bottom (inputs)

1200x700. #0d1117 flat background, gradient rails.
"""

from PIL import Image, ImageDraw, ImageFont
import os

WIDTH, HEIGHT = 1200, 766

BG = (13, 17, 23)
PANEL = (22, 27, 34)
PANEL_2 = (28, 34, 43)
BORDER = (48, 54, 61)
NAVY = (11, 31, 51)

TEXT_PRIMARY = (236, 241, 246)
TEXT_SECONDARY = (236, 241, 246)
TEXT_TERTIARY = (214, 221, 229)

INDIGO = (99, 102, 241);  INDIGO_T = (165, 180, 252)
ORANGE = (217, 119, 67);  ORANGE_T = (232, 149, 106)
PURPLE = (168, 85, 247);  PURPLE_T = (192, 132, 252)
GREEN = (34, 197, 94);    GREEN_T = (134, 239, 172)
RED = (239, 83, 80);      RED_T = (248, 142, 140)
CYAN = (56, 189, 248);    CYAN_T = (125, 211, 252)

img = Image.new("RGBA", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# (flat background — no grid or dot texture)

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


f_brand = load(BOLD, 38)
f_tag = load(REG, 15)
f_url = load(MONO_R, 13)
f_band = load(BOLD, 12)
f_surface = load(BOLD, 13)
f_core_title = load(BOLD, 16)
f_stat_v = load(BOLD, 22)
f_stat_l = load(REG, 11)
f_chip = load(MONO, 10)
f_hook = load(MONO, 12)
f_small = load(REG, 12)
f_flow = load(MONO_R, 11)


def tw(font, t):
    return draw.textlength(t, font=font)


def rrect(box, r, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def ctext(cx, y, t, font, fill):
    draw.text((cx - tw(font, t) / 2, y), t, font=font, fill=fill)


def gradient_rail(y0, y1, alpha):
    stops = [INDIGO, CYAN, ORANGE, PURPLE, GREEN]
    seg = WIDTH / (len(stops) - 1)
    for x in range(WIDTH):
        i = min(int(x / seg), len(stops) - 2)
        f = (x - i * seg) / seg
        a, b = stops[i], stops[i + 1]
        draw.line([(x, y0), (x, y1)], fill=(
            int(a[0] + (b[0] - a[0]) * f),
            int(a[1] + (b[1] - a[1]) * f),
            int(a[2] + (b[2] - a[2]) * f), alpha))


def arrow_up(x, yb, yt, color, label=None):
    draw.line([(x, yb), (x, yt + 9)], fill=color, width=3)
    draw.polygon([(x - 7, yt + 9), (x + 7, yt + 9), (x, yt)], fill=color)
    if label:
        draw.text((x + 16, (yb + yt) / 2 - 8), label, font=f_flow, fill=TEXT_SECONDARY)


def arrow_h(x0, x1, y, color):
    if x1 > x0:
        draw.line([(x0, y), (x1 - 8, y)], fill=color, width=3)
        draw.polygon([(x1 - 8, y - 6), (x1 - 8, y + 6), (x1, y)], fill=color)
    else:
        draw.line([(x0, y), (x1 + 8, y)], fill=color, width=3)
        draw.polygon([(x1 + 8, y - 6), (x1 + 8, y + 6), (x1, y)], fill=color)


gradient_rail(0, 5, 230)
gradient_rail(HEIGHT - 4, HEIGHT, 170)

# ============================================================
# Header
# ============================================================
draw.text((48, 24), "ArcKit", font=f_brand, fill=TEXT_PRIMARY)
bw = tw(f_brand, "ArcKit")
rrect((48 + bw + 11, 37, 48 + bw + 25, 51), 3, fill=ORANGE)
draw.text((48, 67), "The Enterprise Governance Harness  -  reference architecture",
          font=f_tag, fill=TEXT_SECONDARY)

draw.text((WIDTH - 48 - tw(f_url, "arckit.org"), 30), "arckit.org",
          font=f_url, fill=TEXT_TERTIARY)
vb = "v5.5"
vbw = tw(f_chip, vb) + 20
rrect((WIDTH - 48 - vbw, 52, WIDTH - 48, 74), 11, fill=NAVY, outline=INDIGO, width=1)
draw.text((WIDTH - 48 - vbw + 10, 56), vb, font=f_chip, fill=INDIGO_T)

CX = 600
HX0, HX1 = 64, WIDTH - 64

# ============================================================
# TOP — GOVERNED ARTIFACTS as the TRACEABILITY GRAPH (outputs)
# ============================================================
AY0, AY1 = 96, 224
rrect((HX0, AY0, HX1, AY1), 12, fill=PANEL, outline=BORDER, width=1)
draw.text((HX0 + 18, AY0 + 10), "GOVERNED ARTIFACTS", font=f_band, fill=ORANGE_T)
draw.text((HX0 + 18 + tw(f_band, "GOVERNED ARTIFACTS") + 12, AY0 + 11),
          "every document is a linked node in the traceability graph  -  graph-inject + graph-rollups keep it live",
          font=f_stat_l, fill=TEXT_TERTIARY)

# graph nodes: (x, y, label, kind)  kind: hub | node | more
NODES = {
    "stake": (158, 134, "Stakeholders", "node"),
    "goals": (158, 200, "Goals", "node"),
    "req":   (360, 167, "Requirements", "hub"),
    "dec":   (575, 134, "Decisions", "node"),
    "risk":  (575, 167, "Risk Register", "node"),
    "data":  (575, 200, "Data Model", "node"),
    "diag":  (790, 134, "Diagrams", "node"),
    "more":  (790, 167, "+60 more", "more"),
    "ward":  (790, 200, "Wardley Maps", "node"),
    "bcase": (1005, 134, "Business Case", "node"),
    "road":  (1005, 167, "Roadmap", "node"),
    "priv":  (1005, 200, "Privacy", "node"),
}
EDGES = [("stake", "req"), ("goals", "req"),
         ("req", "dec"), ("req", "risk"), ("req", "data"), ("req", "more"),
         ("dec", "diag"), ("data", "diag"), ("data", "ward"),
         ("risk", "bcase"), ("req", "bcase"), ("req", "priv"),
         ("diag", "road"), ("ward", "road"), ("bcase", "road")]

# edges first (behind nodes)
for a, b in EDGES:
    x1, y1 = NODES[a][0], NODES[a][1]
    x2, y2 = NODES[b][0], NODES[b][1]
    draw.line([(x1, y1), (x2, y2)], fill=(99, 102, 241, 150), width=2)

# nodes on top
for x, y, label, kind in NODES.values():
    w = tw(f_small, label) + 22
    box = (x - w / 2, y - 13, x + w / 2, y + 13)
    if kind == "hub":
        rrect(box, 13, fill=NAVY, outline=INDIGO, width=2)
        colt = INDIGO_T
    elif kind == "more":
        rrect(box, 13, fill=PANEL_2, outline=GREEN, width=1)
        colt = GREEN_T
    else:
        rrect(box, 13, fill=PANEL_2, outline=INDIGO, width=1)
        colt = TEXT_PRIMARY
    draw.text((x - tw(f_small, label) / 2, y - 8), label, font=f_small, fill=colt)

# arrow UP: harness -> artifacts
arrow_up(CX, 254, AY1 + 2, GREEN, "generates  (provenance-stamped + traceable)")

# ============================================================
# MIDDLE — THE ENTERPRISE GOVERNANCE HARNESS (perimeter)
# ============================================================
HY0, HY1 = 258, 658
rrect((HX0, HY0, HX1, HY1), 16, fill=(18, 23, 30, 255), outline=ORANGE, width=2)
for cx, cy in [(HX0, HY0), (HX1, HY0), (HX0, HY1), (HX1, HY1)]:
    draw.ellipse((cx - 5, cy - 5, cx + 5, cy + 5), fill=PANEL_2, outline=ORANGE, width=2)
tab = "THE ENTERPRISE GOVERNANCE HARNESS"
tabw = tw(f_band, tab) + 18
rrect((HX0 + 22, HY0 - 11, HX0 + 22 + tabw, HY0 + 11), 11, fill=NAVY, outline=ORANGE, width=1)
draw.text((HX0 + 31, HY0 - 5), tab, font=f_band, fill=ORANGE_T)
cap = "hooks fire at every lifecycle stage"
capx = HX1 - 22 - tw(f_flow, cap)
draw.rectangle((capx - 8, HY0 - 7, capx + tw(f_flow, cap) + 8, HY0 + 9), fill=BG)
draw.text((capx, HY0 - 5), cap, font=f_flow, fill=TEXT_TERTIARY)


def hook_row(y, label, label_col, items, dot):
    """Draw an event-labelled rail of hook pills; wraps if too wide."""
    lx = HX0 + 22
    draw.text((lx, y + 6), label, font=f_band, fill=label_col)
    start = lx + tw(f_band, label) + 14
    cx = start
    max_x = HX1 - 22
    ly = y
    for it in items:
        w = tw(f_hook, it) + 30
        if cx + w > max_x:
            ly += 30
            cx = start
        rrect((cx, ly, cx + w, ly + 24), 12, fill=PANEL, outline=BORDER, width=1)
        draw.ellipse((cx + 9, ly + 8, cx + 17, ly + 16), fill=dot)
        draw.text((cx + 22, ly + 5), it, font=f_hook, fill=TEXT_SECONDARY)
        cx += w + 8


# --- TOP rails: AFTER tool / session end (exit toward artifacts) ---
hook_row(HY0 + 18, "PostCompact  .  Stop", PURPLE_T,
         ["postcompact-rehydrate", "session-learner"], PURPLE)
hook_row(HY0 + 52, "PostToolUse  OBSERVERS", GREEN_T,
         ["provenance-stamp", "update-manifest", "tidy-wardley-labels", "telemetry"], GREEN)

# --- CORE ENGINE (centre) ---
EX0, EY0, EX1, EY1 = 372, 350, 828, 502
rrect((EX0, EY0, EX1, EY1), 12, fill=NAVY, outline=INDIGO, width=2)
ctext((EX0 + EX1) / 2, EY0 + 12, "ARCKIT  CORE  ENGINE", f_core_title, TEXT_PRIMARY)
stats = [("71", "commands"), ("16", "agents"), ("5", "skills"), ("128", "doc-types")]
syl = EY0 + 42
gw = (EX1 - EX0) / len(stats)
for i, (v, l) in enumerate(stats):
    cxc = EX0 + gw * i + gw / 2
    ctext(cxc, syl, v, f_stat_v, INDIGO_T)
    ctext(cxc, syl + 28, l, f_stat_l, TEXT_SECONDARY)
draw.line([(EX0 + 18, syl + 50), (EX1 - 18, syl + 50)], fill=(255, 255, 255, 22), width=1)
ctext((EX0 + EX1) / 2, syl + 60,
      "templates  -  scoring rubrics  -  handoff schemas  -  traceability graph",
      f_small, TEXT_SECONDARY)

# --- OVERLAYS panel (left, composes INTO core) ---
OX0, OX1 = HX0 + 22, EX0 - 34
rrect((OX0, EY0, OX1, EY1), 10, fill=PANEL, outline=PURPLE, width=1)
draw.text((OX0 + 12, EY0 + 9), "OVERLAYS", font=f_band, fill=PURPLE_T)
draw.text((OX0 + 12, EY0 + 25), "9 sector / jurisdiction", font=f_stat_l, fill=TEXT_TERTIARY)
ov = [["UAE", "France", "Canada", "USA", "Australia"],
      ["EU", "Austria", "UK Finance", "UK NHS"]]
colw = (OX1 - OX0 - 24) / 2
for c, col in enumerate(ov):
    for r, name in enumerate(col):
        x = OX0 + 12 + c * colw
        y = EY0 + 46 + r * 18
        draw.ellipse((x, y + 4, x + 6, y + 10), fill=PURPLE)
        draw.text((x + 12, y), name, font=f_small, fill=TEXT_PRIMARY)
arrow_h(OX1 + 4, EX0 - 2, (EY0 + EY1) / 2, PURPLE)
draw.text((OX1 + 2, (EY0 + EY1) / 2 - 24), "compose", font=f_flow, fill=TEXT_TERTIARY)

# --- MCP panel (right, feeds INTO core) ---
MX0, MX1 = EX1 + 34, HX1 - 22
rrect((MX0, EY0, MX1, EY1), 10, fill=PANEL, outline=CYAN, width=1)
draw.text((MX0 + 12, EY0 + 9), "MCP  KNOWLEDGE", font=f_band, fill=CYAN_T)
draw.text((MX0 + 12, EY0 + 25), "live external grounding", font=f_stat_l, fill=TEXT_TERTIARY)
for r, m in enumerate(["aws-knowledge", "microsoft-learn", "google-dev",
                       "datacommons", "govreposcrape"]):
    y = EY0 + 46 + r * 18
    draw.ellipse((MX0 + 12, y + 4, MX0 + 18, y + 10), fill=CYAN)
    draw.text((MX0 + 24, y), m, font=f_small, fill=TEXT_PRIMARY)
arrow_h(MX0 - 4, EX1 + 2, (EY0 + EY1) / 2, CYAN)
draw.text((EX1 + 8, (EY0 + EY1) / 2 - 24), "feeds", font=f_flow, fill=TEXT_TERTIARY)

# --- BOTTOM rails: BEFORE tool / session start (entry from assistants) ---
hook_row(EY1 + 16, "PreToolUse  GATES", RED_T,
         ["file-protection", "secret-file-scanner", "validate-arc-filename",
          "score-validator", "validate-wardley-math"], RED)
hook_row(EY1 + 50, "Permission & Access", ORANGE_T,
         ["allow-mcp-tools", "allow-plugin-internals", "inject-agent-context"], ORANGE)
hook_row(EY1 + 84, "UserPromptSubmit", CYAN_T,
         ["arckit-context", "secret-detection", "graph-inject", "sync-guides"], CYAN)
hook_row(EY1 + 118, "SessionStart", CYAN_T,
         ["arckit-session", "version-check", "v5-migration-banner",
          "notify-stale-artifacts"], CYAN)

# ============================================================
# BOTTOM — AI CODING ASSISTANTS (inputs)
# ============================================================
arrow_up(CX, 688, HY1 + 2, CYAN, "tool calls  (Write / Edit / Bash ...)")

SY0, SY1 = 690, 736
surfaces = ["Claude Code", "Codex", "Gemini", "OpenCode", "Copilot", "CLI"]
sx0, sx1 = 250, 950
n = len(surfaces)
gap = 12
bw_s = (sx1 - sx0 - gap * (n - 1)) / n
draw.text((sx0, SY0 - 18), "AI CODING ASSISTANTS", font=f_band, fill=CYAN_T)
for i, s in enumerate(surfaces):
    x = sx0 + i * (bw_s + gap)
    rrect((x, SY0, x + bw_s, SY1), 9, fill=PANEL, outline=CYAN, width=1)
    ctext(x + bw_s / 2, SY0 + 14, s, f_surface, TEXT_PRIMARY)

img.convert("RGB").save("/workspaces/arc-kit/docs/arckit-architecture-hero.png", "PNG")
print("wrote docs/arckit-architecture-hero.png")
