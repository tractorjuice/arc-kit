# Spec: Generic UI for an Object Tracking Model

**Date:** 2026-08-05
**Status:** Draft
**Author:** Mark Craddock (via Claude Code)
**ArcKit version at time of writing:** 6.8.0

## 1. Summary

This document specifies a generic, model-agnostic user interface for operating,
inspecting, and correcting the output of a multi-object tracking (MOT) model.
The UI sits in front of any tracker that consumes video (file or live stream)
and emits per-frame detections grouped into persistent tracks — e.g. SORT,
DeepSORT, ByteTrack, OC-SORT, or a proprietary model. Nothing in this spec
assumes a particular architecture, class taxonomy, or deployment target.

The UI serves three jobs:

1. **Operate** — feed video into the model, configure it, and watch tracking
   happen live or against recorded footage.
2. **Inspect** — understand what the model did: which objects it tracked, where
   identities switched or fragmented, and how confident it was.
3. **Correct** — repair tracker mistakes (merge, split, relabel, delete tracks)
   and export the corrected result as ground truth or downstream input.

## 2. Goals and Non-Goals

### Goals

- Work with any tracking model via a defined integration contract (Section 8).
- Support both **offline** (recorded video, batch results) and **live**
  (streaming inference) modes from the same interface.
- Make track identity legible: a human can follow one object across the whole
  clip in under a minute.
- Support human-in-the-loop correction with full undo and an auditable edit
  history.
- Surface tracking quality metrics (MOTA, IDF1, HOTA) when ground truth is
  available.
- Meet WCAG 2.2 AA accessibility requirements.

### Non-Goals

- Training or fine-tuning the model. The UI consumes model output only.
- Frame-level polygon/segmentation annotation. Bounding boxes (and optionally
  oriented boxes / keypoints) are the supported geometry.
- Multi-camera cross-view re-identification. Single video source per session;
  multi-camera is a future extension (Section 12).
- Video editing, transcoding, or storage management beyond what playback needs.

## 3. Users

| Persona | Primary job | Key needs |
|---------|-------------|-----------|
| ML engineer | Debug tracker behaviour | Frame-accurate scrubbing, per-track confidence curves, ID-switch highlighting, raw payload inspection |
| Annotator / QA reviewer | Correct tracks to produce ground truth | Fast keyboard-driven review, merge/split tools, progress tracking, export |
| Operator | Monitor a live feed | Low-latency overlay, alerting on classes/zones of interest, minimal configuration surface |
| Product / analyst | Assess fitness for purpose | Summary metrics, class distribution, exportable reports |

## 4. Concepts and Terminology

- **Detection** — one bounding box in one frame: class label, geometry,
  confidence score.
- **Track** — a sequence of detections across frames sharing a persistent
  **track ID**, representing one physical object.
- **ID switch** — the tracker reassigns an object's detections to a different
  track ID mid-sequence.
- **Fragmentation** — one physical object covered by several short tracks with
  gaps between them.
- **Occlusion** — the object is hidden; the tracker may coast (predict) or drop
  the track.
- **Ground truth** — human-verified tracks used to score the model.
- **Session** — one video source plus its tracking results, configuration, and
  edit history.

## 5. Information Architecture

```text
App
├── Sessions (list / create / open)
└── Session workspace
    ├── Viewer          — video canvas + overlays + playback controls
    ├── Timeline        — per-track lanes under the scrubber
    ├── Track inspector — details and edit tools for the selected track(s)
    ├── Configuration   — model, thresholds, classes, zones
    ├── Metrics         — quality dashboard (requires ground truth)
    └── Export          — corrected tracks, clips, reports
```

The Viewer, Timeline, and Track inspector are the default three-pane workspace.
Configuration, Metrics, and Export open as secondary views without discarding
playback position or selection state.

## 6. Functional Requirements

Requirement IDs follow the ArcKit convention (`FR-xxx` functional, `NFR-xxx`
non-functional, `INT-xxx` integration, `DR-xxx` data).

### 6.1 Video ingest and playback

- **FR-001** Load a recorded video file (MP4/H.264 baseline; WebM optional) or
  connect to a live stream (RTSP/WebRTC/HLS, deployment-dependent).
- **FR-002** Playback controls: play/pause, frame step (±1), jump (±1 s, ±10 s),
  playback rate 0.1×–8×, loop over a marked range.
- **FR-003** Frame-accurate scrubber showing current frame index and timestamp;
  scrubbing updates overlays synchronously (no stale boxes).
- **FR-004** In live mode, display end-to-end latency (capture → overlay) and a
  "LIVE" indicator; allow pausing into a buffered review mode and returning to
  live.

### 6.2 Overlay rendering

- **FR-010** Render each visible detection as a bounding box with a per-track
  colour stable for the life of the track ID.
- **FR-011** Configurable label content per box: track ID, class, confidence —
  each independently toggleable.
- **FR-012** Toggleable **trail** rendering: the object's centroid path over the
  last N frames (N configurable, default 30).
- **FR-013** Confidence filter: a slider hides detections below a threshold
  without re-running the model.
- **FR-014** Class filter: show/hide by class; filters apply to overlays,
  timeline, and track list consistently.
- **FR-015** Distinguish **predicted/coasted** boxes (tracker output during
  occlusion) from detection-backed boxes, e.g. dashed vs solid stroke.
- **FR-016** Overlay density control: at >50 concurrent boxes, labels collapse
  to IDs only; at >200, boxes render without labels unless hovered.

### 6.3 Track selection and inspection

- **FR-020** Click a box (canvas) or a lane (timeline) to select a track;
  selection highlights the track everywhere and dims others ("focus mode",
  toggleable).
- **FR-021** Track inspector shows: track ID, class, first/last frame, duration,
  gap count, mean/min confidence, and a confidence-over-time sparkline.
- **FR-022** "Follow" mode: playback keeps the selected track centred (digital
  pan/zoom) until released.
- **FR-023** Jump-to navigation: next/previous appearance of the selected
  track, next flagged event (Section 6.5).
- **FR-024** Raw payload view: the underlying JSON for the selected track or
  the current frame, copyable.

### 6.4 Timeline

- **FR-030** One horizontal lane per track, aligned to the scrubber; lane
  segments show presence, gaps show absence.
- **FR-031** Lane ordering options: first appearance (default), duration,
  class, track ID.
- **FR-032** Event markers on lanes: ID switches, low-confidence spans, zone
  entries/exits.
- **FR-033** Timeline virtualises beyond ~100 tracks; a mini-map summarises
  overall track density across the clip.

### 6.5 Model events and flags

- **FR-040** The UI computes and flags **review candidates**: tracks with gaps
  above a threshold, abrupt geometry jumps, class flips within one track, and
  near-simultaneous end/start pairs suggesting an ID switch.
- **FR-041** Flags appear as a filterable review queue; keyboard `j`/`k` steps
  through it, seeking the viewer to each event.
- **FR-042** In live mode, user-defined alert rules (class + optional zone +
  optional dwell time) raise visual alerts and an event log entry; no
  destructive/actuating side effects are in scope.

### 6.6 Correction tools (offline mode)

- **FR-050** **Merge**: combine two or more tracks into one ID; overlapping
  frames resolve by higher confidence, with a conflict prompt if both are
  human-edited.
- **FR-051** **Split**: cut a track at the current frame into two IDs.
- **FR-052** **Relabel**: change a track's class, whole-track or from the
  current frame onward.
- **FR-053** **Delete**: remove a track or a frame range within it (false
  positives).
- **FR-054** **Adjust**: move/resize a box on a given frame; optionally
  interpolate the adjustment across a selected range.
- **FR-055** **Create**: draw a new box and extend it across frames by
  interpolation to cover missed objects.
- **FR-056** Every edit is undoable/redoable (per-session history, minimum 200
  steps) and recorded in an edit log: who, when, what, affected frames.
- **FR-057** Edited tracks are visually distinguished from raw model output,
  and a per-track provenance state is maintained: `model`, `edited`,
  `verified`.

### 6.7 Configuration

- **FR-060** Model selection from the configured backend registry, showing
  name, version, and supported classes.
- **FR-061** Expose the backend's declared tunables (Section 8) as typed
  controls: detection threshold, NMS/IoU threshold, max coasting age, class
  allowlist. Unknown tunables render generically from their JSON schema.
- **FR-062** Re-run tracking over the loaded video with changed settings;
  results version as **runs** within the session, comparable side by side
  (A/B overlay of two runs, colour-coded).
- **FR-063** Zone editor: draw named polygon zones on the frame for use in
  filters, alerts, and metrics.

### 6.8 Metrics (requires ground truth)

- **FR-070** Import ground truth (MOT Challenge format and the native export
  format, Section 9) or promote a fully `verified` run to ground truth.
- **FR-071** Dashboard: MOTA, MOTP, IDF1, HOTA, ID switches, fragmentations,
  FP/FN counts — overall and per class.
- **FR-072** Metric deltas between runs of the same session.
- **FR-073** Click any aggregate (e.g. "17 ID switches") to open the underlying
  events in the review queue.

### 6.9 Export

- **FR-080** Export tracks as: native JSON (Section 9), MOT Challenge CSV, and
  COCO-video JSON.
- **FR-081** Export scope options: all tracks, filtered set, selected tracks,
  or a frame range.
- **FR-082** Export burned-in overlay video for a marked range (offline
  render, progress reported).
- **FR-083** Export the metrics dashboard as a standalone report (HTML or
  PDF).

## 7. Interaction Design

### 7.1 Keyboard map (defaults, remappable)

| Key | Action |
|-----|--------|
| `Space` | Play / pause |
| `←` / `→` | Frame step back / forward |
| `Shift+←/→` | Jump 1 s |
| `J` / `K` | Previous / next flagged event |
| `F` | Toggle follow mode on selection |
| `M` | Merge selected tracks |
| `S` | Split selected track at playhead |
| `Delete` | Delete selection (with confirm for whole tracks) |
| `Ctrl/Cmd+Z` / `Shift+Ctrl/Cmd+Z` | Undo / redo |
| `1`–`9` | Toggle class filters |
| `Esc` | Clear selection / exit mode |

### 7.2 States and feedback

- **Empty session**: prominent ingest call-to-action; sample clip offered.
- **Processing**: determinate progress for batch runs (frames processed /
  total, ETA); tracking results stream into the timeline as they arrive rather
  than blocking on completion.
- **Live degraded**: if inference falls behind the stream, the UI drops overlay
  frames (never buffers unboundedly), shows a "model lagging: Xs" badge, and
  logs the degradation.
- **Backend lost**: playback of already-received results continues; a
  reconnect banner with retry/backoff status appears; edits remain local until
  reconnection.
- **Conflict**: concurrent edits to the same track in a multi-user deployment
  resolve last-writer-wins with a non-blocking toast linking both versions in
  the edit log.

## 8. Model Integration Contract (INT)

The UI communicates with the tracking backend through a thin adapter. Any model
that can satisfy this contract is supported.

- **INT-001** `GET /models` — list available models: `id`, `name`, `version`,
  `classes[]`, `tunables` (JSON Schema for FR-061).
- **INT-002** `POST /runs` — start a run: source (upload ref or stream URL),
  model id, tunable values. Returns `run_id`.
- **INT-003** Results delivery — either streaming (WebSocket/SSE, one message
  per frame batch) or polling (`GET /runs/{id}/results?from_frame=`). Both
  carry the same frame payload (Section 9).
- **INT-004** `DELETE /runs/{id}` — cancel a run.
- **INT-005** Timestamps: every frame payload carries `frame_index` and
  `timestamp_ms` relative to source start; live sources also carry capture
  wall-clock time so latency (FR-004) is computable.
- **INT-006** The adapter must tolerate out-of-order and duplicate frame
  payloads (idempotent by `run_id` + `frame_index`).
- **INT-007** Authentication between UI and backend is deployment-defined
  (token header baseline); the UI never embeds credentials in exported
  artefacts.

## 9. Data Model (DR)

- **DR-001** Native track interchange format (JSON):

```json
{
  "session_id": "uuid",
  "run_id": "uuid",
  "source": { "type": "file|stream", "uri": "...", "fps": 30.0, "width": 1920, "height": 1080 },
  "model": { "id": "bytetrack-x", "version": "1.4.2" },
  "tracks": [
    {
      "track_id": 17,
      "class": "vehicle",
      "provenance": "model|edited|verified",
      "detections": [
        {
          "frame_index": 1042,
          "timestamp_ms": 34733,
          "bbox": [x, y, w, h],
          "confidence": 0.91,
          "coasted": false
        }
      ]
    }
  ],
  "edits": [
    { "op": "merge", "actor": "user@example.com", "at": "2026-08-05T10:12:00Z", "detail": { "from": [17, 22], "into": 17 } }
  ]
}
```

- **DR-002** Coordinates are pixels in source resolution, origin top-left;
  the UI owns all display scaling.
- **DR-003** Track IDs are unique within a run; merges retain the surviving ID
  and record the absorbed IDs in the edit log.
- **DR-004** Sessions persist: source reference, all runs, edit history, zones,
  and UI state (filters, last position). Video content is referenced, not
  copied, unless the deployment opts into managed storage.
- **DR-005** Retention and classification of exported artefacts follow the
  hosting organisation's data governance policy; the UI stamps exports with
  session ID, run ID, model version, and export time for traceability.

## 10. Non-Functional Requirements

- **NFR-P-001** Overlay rendering sustains source frame rate up to 60 fps with
  ≤200 concurrent boxes on a mid-range laptop (canvas/WebGL rendering, not DOM
  elements per box).
- **NFR-P-002** Scrub-to-render latency ≤100 ms for loaded results.
- **NFR-P-003** Live mode end-to-end overlay latency target ≤500 ms measured
  UI-side (model latency excluded from the UI's budget but displayed).
- **NFR-P-004** Timeline and track list stay responsive (interaction ≤100 ms)
  at 10,000 tracks / 1 M detections via virtualisation and level-of-detail
  rendering.
- **NFR-SEC-001** All backend traffic over TLS; no video frames or results
  sent to third-party services.
- **NFR-SEC-002** Edit log entries are append-only and attributable
  (user identity from the deployment's auth provider).
- **NFR-A11Y-001** WCAG 2.2 AA: full keyboard operability, visible focus,
  and text alternatives for overlay state ("Track 17, vehicle, entered zone
  Gate-A at 00:34").
- **NFR-A11Y-002** Track colours drawn from a colour-vision-deficiency-safe
  palette; colour is never the only identity signal (ID labels always
  available).
- **NFR-A11Y-003** Respect `prefers-reduced-motion`: trails and follow-mode
  animation degrade to static presentation.
- **NFR-I18N-001** All UI strings externalised; timestamps rendered in the
  user's locale with the source-relative timecode always available.
- **NFR-C-001** Browser baseline: last two versions of evergreen browsers;
  no plugin requirements.

## 11. Acceptance Criteria (representative)

1. Given a 10-minute 30 fps clip and a completed run, a user can select any
   object on screen and view its entire track lifespan (timeline lane +
   follow mode) within three interactions.
2. Given a run with a known ID switch, the review queue flags it, `K` seeks to
   it, and a two-track merge (FR-050) resolves it, with the merge visible in
   the edit log and reversible via undo.
3. Given ground truth for the clip, the metrics dashboard reports MOTA/IDF1/
   HOTA, and re-running with a changed detection threshold produces a second
   run whose metric deltas are shown (FR-072).
4. Given a live RTSP source and a backend that falls behind, the overlay drops
   frames, displays the lag badge, and never grows memory unboundedly over a
   one-hour session.
5. An annotator using only the keyboard can complete criterion 2 end to end.

## 12. Open Questions and Future Extensions

- Multi-camera sessions with cross-view identity stitching (excluded for now).
- Segmentation-mask overlays as an optional geometry alongside boxes.
- Collaborative real-time review (shared cursors, assignment of review-queue
  slices to multiple annotators).
- Active-learning loop: exporting `verified` corrections in a form the model
  team's training pipeline consumes automatically.
- Whether zone definitions should be shareable across sessions on the same
  camera source.
