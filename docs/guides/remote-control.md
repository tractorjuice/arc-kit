# Govern Architecture from Anywhere: Using Claude Code Remote Control with ArcKit

Enterprise architecture governance shouldn't be chained to a single workstation. With Claude Code's **Remote Control** feature, you can start an ArcKit session at your desk, then continue it from your phone during a commute, a stakeholder meeting, or from a browser on any other machine — all while your local environment, MCP servers, and project files stay exactly where they are.

This guide explains what Remote Control is, why it matters for ArcKit workflows, and how to set it up.

---

## What Is Remote Control?

Remote Control is a Claude Code feature (available on Pro and Max plans) that lets you connect to a running local Claude Code session from [claude.ai/code](https://claude.ai/code) or the Claude mobile app ([iOS](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684) / [Android](https://play.google.com/store/apps/details?id=com.anthropic.claude)).

The key distinction: **your session never leaves your machine**. Claude Code continues running locally with full access to your filesystem, ArcKit plugin, MCP servers (AWS Knowledge, Microsoft Learn, Google Developer Knowledge), and project configuration. The web or mobile interface is simply a window into that local session.

This means:
- Your `projects/` directory, templates, and generated artifacts stay local
- All 53 ArcKit commands and 5 research agents remain fully available
- MCP servers for cloud research (AWS, Azure, GCP) keep working
- Automation hooks (session init, project context injection, filename enforcement) continue to fire
- You can send messages from terminal, browser, and phone interchangeably — the conversation stays in sync

---

## Why This Matters for Architecture Governance

Architecture governance is inherently collaborative and multi-context. You draft a requirements document at your desk, present it in a boardroom, refine it during a train journey, and share it in a stakeholder review. Remote Control bridges those contexts without losing your session state.

### Five Scenarios Where Remote Control Transforms ArcKit Workflows

#### 1. Kick Off Research, Monitor from Mobile

ArcKit's research agents (`/arckit.research`, `/arckit.datascout`, `/arckit.aws-research`, `/arckit.azure-research`, `/arckit.gcp-research`) perform dozens of web searches and produce detailed market analysis, vendor evaluations, and cloud service comparisons. These can take several minutes.

With Remote Control, you can start a research task at your desk:

```
/arckit.research Evaluate low-code platforms for citizen development
```

Then step away. Open the Claude app on your phone to check progress, review the output when it's ready, and request follow-up analysis — all from the same session.

#### 2. Architecture Review Meetings

During a design review or architecture board meeting, you can present ArcKit outputs on a shared screen (via browser at `claude.ai/code`) while controlling the session from your phone or laptop. Need to regenerate a diagram with different scope? Run `/arckit.diagram` from your phone while the audience watches the output appear on the big screen.

#### 3. Stakeholder Walkthroughs

Walking a stakeholder through a business case (`/arckit.sobc`) or risk register (`/arckit.risk`)? Open the session on their screen via the browser URL, then drive the conversation from your own device. They see the artifacts in real-time without needing their own Claude Code setup.

#### 4. Multi-Site and Field Work

Visiting a data centre, attending a vendor briefing, or working from a client site? Your full ArcKit environment travels with you. Open your phone, connect to the running session, and you have access to every project artifact, every template, and every command — without VPN tunnelling or remote desktop overhead.

#### 5. End-of-Day Handoff to Yourself

Start a complex requirements specification (`/arckit.requirements`) before leaving the office. Continue reviewing and refining it from your tablet at home. The session, conversation history, and all generated files persist seamlessly.

---

## Getting Started

### Prerequisites

- **Claude Code** installed locally with the ArcKit plugin enabled
- **Pro or Max plan** on claude.ai (API keys are not supported for Remote Control)
- Signed in via `/login` in Claude Code
- Workspace trust accepted for your project directory

### Start a Remote Control Session

**Option A — New session:**

Navigate to your ArcKit project directory and run:

```bash
claude remote-control
```

This starts a session and displays a URL and QR code. Scan the QR code with the Claude mobile app, or open the URL in any browser.

**Option B — From an existing session:**

If you're already working in Claude Code with ArcKit, type:

```
/remote-control
```

(or `/rc` for short)

Your current conversation — including any ArcKit artifacts you've generated — carries over to the remote connection.

> **Tip:** Use `/rename` before `/remote-control` to give your session a descriptive name like "Payment Modernization - Requirements" so you can find it easily in the session list.

### Connect from Another Device

Once the session is active, connect from any device:

- **Scan the QR code** shown in the terminal to open it directly in the Claude mobile app
- **Open the session URL** in any browser to connect via [claude.ai/code](https://claude.ai/code)
- **Browse the session list** in the Claude app or on claude.ai/code — active Remote Control sessions show a green status dot

### Always-On Remote Control

If you want every Claude Code session to be remotely accessible by default, run `/config` inside Claude Code and set **Enable Remote Control for all sessions** to `true`. This is particularly useful if you regularly switch between devices during architecture work.

---

## How It Works Under the Hood

Remote Control uses outbound HTTPS connections only — it never opens inbound ports on your machine. Your local Claude Code instance registers with the Anthropic API and polls for work. When you connect from another device, messages are routed through the Anthropic API over TLS.

This means:
- **No firewall changes needed** — works behind corporate firewalls and NAT
- **Same transport security** as any Claude Code session
- **Short-lived, scoped credentials** for each connection

Your ArcKit project files, architecture artifacts, and MCP server connections remain entirely local. Only the conversation messages travel through the API.

---

## Things to Keep in Mind

- **One remote session per Claude Code instance.** If you need multiple parallel sessions, run multiple Claude Code instances in different terminal windows.
- **Keep the terminal open.** Remote Control runs as a local process. If you close the terminal or stop the `claude` process, the session ends. Re-run `claude remote-control` to start a new one.
- **Network interruptions are handled gracefully.** If your machine sleeps or loses connectivity briefly, the session reconnects automatically. Extended outages (roughly 10+ minutes) will time out the session.
- **Not available on Team or Enterprise plans** — currently limited to Pro and Max plans as a research preview.

---

## Recommended Workflow

Here's a practical workflow combining ArcKit and Remote Control for a typical architecture engagement:

1. **Morning at your desk** — Start a new ArcKit project, run `/arckit.principles` and `/arckit.stakeholders` from your terminal
2. **Commute** — Open the Claude app, review the generated artifacts, run `/arckit.requirements` from your phone
3. **Client meeting** — Share the session URL on a conference room screen, run `/arckit.diagram` and `/arckit.wardley` to present visual artifacts live
4. **Afternoon** — Back at your desk, continue in the terminal to run research agents and vendor evaluation
5. **Evening review** — From your tablet, review outputs and run `/arckit.adr` to capture key decisions before they go cold

---

## Learn More

- [Claude Code Remote Control Documentation](https://code.claude.com/docs/en/remote-control)
- [ArcKit Plugin Installation Guide](https://github.com/tractorjuice/arc-kit)
- [Claude Mobile App — iOS](https://apps.apple.com/us/app/claude-by-anthropic/id6473753684) | [Android](https://play.google.com/store/apps/details?id=com.anthropic.claude)
