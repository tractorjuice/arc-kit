/**
 * Estimate a label's bounding box from its text and font size.
 * Uses an average glyph-width factor for sans-serif fonts. This avoids a
 * DOM measurement round-trip and keeps placement deterministic and testable.
 */
const GLYPH_WIDTH_FACTOR = 0.6;
const LINE_HEIGHT_FACTOR = 1.2;
export const estimateLabelBox = (text, fontSize) => ({
    width: Math.max(1, text.length) * fontSize * GLYPH_WIDTH_FACTOR,
    height: fontSize * LINE_HEIGHT_FACTOR,
});
/** Area of intersection between two axis-aligned rects (0 if disjoint). */
export const rectsOverlapArea = (a, b) => {
    const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    return xOverlap * yOverlap;
};
/** True if a circle intersects (or touches) an axis-aligned rect. */
export const circleRectOverlap = (circle, rect) => {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
};
/** True if a line segment crosses or lies inside an axis-aligned rect. */
export const segmentIntersectsRect = (seg, rect) => {
    const { x, y, width, height } = rect;
    // Endpoint inside the rect.
    // Inclusive comparisons are intentional: a point flush with an edge counts as
    // inside (touching = overlap), which is the conservative choice for collision
    // detection and prevents "fix me" refactors that would weaken the check.
    const inside = (px, py) => px >= x && px <= x + width && py >= y && py <= y + height;
    if (inside(seg.x1, seg.y1) || inside(seg.x2, seg.y2)) {
        return true;
    }
    // Segment/segment intersection against the four rect edges.
    const cross = (ax, ay, bx, by, cx, cy) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    const segIntersect = (p1, p2, p3, p4) => {
        const d1 = cross(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);
        const d2 = cross(p3.x, p3.y, p4.x, p4.y, p2.x, p2.y);
        const d3 = cross(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        const d4 = cross(p1.x, p1.y, p2.x, p2.y, p4.x, p4.y);
        return d1 > 0 !== d2 > 0 && d3 > 0 !== d4 > 0;
    };
    const a = { x: seg.x1, y: seg.y1 };
    const b = { x: seg.x2, y: seg.y2 };
    const corners = [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
    ];
    for (let i = 0; i < 4; i++) {
        if (segIntersect(a, b, corners[i], corners[(i + 1) % 4])) {
            return true;
        }
    }
    return false;
};
/** Area of `rect` that lies outside `bounds`. */
export const areaOutsideBounds = (rect, bounds) => {
    const inside = rectsOverlapArea(rect, bounds);
    return rect.width * rect.height - inside;
};
// 8 compass directions, diagonals normalized to unit length.
const SQRT1_2 = Math.SQRT1_2;
const COMPASS = [
    { x: 1, y: 0 }, // E
    { x: SQRT1_2, y: -SQRT1_2 }, // NE
    { x: 0, y: -1 }, // N
    { x: -SQRT1_2, y: -SQRT1_2 }, // NW
    { x: -1, y: 0 }, // W
    { x: -SQRT1_2, y: SQRT1_2 }, // SW
    { x: 0, y: 1 }, // S
    { x: SQRT1_2, y: SQRT1_2 }, // SE
];
const rectAround = (center, width, height) => ({
    x: center.x - width / 2,
    y: center.y - height / 2,
    width,
    height,
});
/** Center point of a rect. */
const rectCenter = (rect) => ({
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
});
// Penalty weights. Internal constants — deliberately not exposed as config.
const WEIGHT_LABEL_OVERLAP = 5;
const WEIGHT_MARKER_OVERLAP = 800;
const WEIGHT_OUT_OF_BOUNDS = 50;
const WEIGHT_LINK_CROSS = 120;
// Per-px² penalty for overlapping a rect obstacle (e.g. a pipeline box).
const WEIGHT_RECT_OVERLAP = 4;
const WEIGHT_DISTANCE = 0.05;
const WEIGHT_DIRECTION = 6;
// Soft pull toward an author-specified position; replaces the distance +
// direction terms when a candidate is scored against a manual label.
const WEIGHT_PREFERRED = 0.05;
// Preferred direction: up-right (NE), matching the legacy default offset.
const PREFERRED_DIRECTION = { x: SQRT1_2, y: -SQRT1_2 };
/**
 * Score a candidate position. Lower is better. A score near 0 is an
 * unobstructed placement close to the anchor in the preferred direction.
 * When `preferredCenter` is supplied, the soft distance/direction terms are
 * replaced by a single pull toward that point (used to bias a re-placed
 * manual label back toward the author's intended position).
 * `preferredDirection` (a unit vector) overrides the default NE direction
 * bias — pipeline child components pass S so their labels prefer to sit
 * underneath. It is ignored when `preferredCenter` is set.
 */
export const scoreCandidate = (candidate, obstacles, bounds, anchor, placedRects = [], preferredCenter, preferredDirection) => {
    let penalty = 0;
    const { rect } = candidate;
    for (const placed of placedRects) {
        penalty += rectsOverlapArea(rect, placed) * WEIGHT_LABEL_OVERLAP;
    }
    for (const obstacle of obstacles) {
        if (obstacle.type === 'circle') {
            if (circleRectOverlap(obstacle, rect)) {
                penalty += WEIGHT_MARKER_OVERLAP;
            }
        }
        else if (obstacle.type === 'rect') {
            penalty += rectsOverlapArea(rect, obstacle) * WEIGHT_RECT_OVERLAP;
        }
        else if (segmentIntersectsRect(obstacle, rect)) {
            penalty += WEIGHT_LINK_CROSS;
        }
    }
    penalty += areaOutsideBounds(rect, bounds) * WEIGHT_OUT_OF_BOUNDS;
    if (preferredCenter) {
        // Soft pull toward the author's intended position.
        const { x: cx, y: cy } = rectCenter(rect);
        penalty += Math.hypot(cx - preferredCenter.x, cy - preferredCenter.y) * WEIGHT_PREFERRED;
    }
    else {
        penalty += candidate.distance * WEIGHT_DISTANCE;
        // Direction deviation: 0 when aligned with preferred, up to 2 when opposite.
        const dir = preferredDirection ?? PREFERRED_DIRECTION;
        const dot = candidate.direction.x * dir.x + candidate.direction.y * dir.y;
        penalty += (1 - dot) * WEIGHT_DIRECTION;
    }
    return penalty;
};
/**
 * Decide whether a manual label's authored position (`manualRect`) is
 * collision-free and may be kept as-is. A manual label is kept unless its
 * rect overlaps another node's marker, overlaps a rect obstacle (e.g. a
 * pipeline box), spills outside the chart bounds, or overlaps another manual
 * label's rect.
 *
 * Crossing a link line does NOT, on its own, reject a manual label: link
 * lines are thin, an author who placed a label across one accepted that, and
 * on dense maps treating every clipped link as a collision re-places labels
 * that looked fine. Link segments are still a soft penalty for auto-placed
 * labels (see `scoreCandidate`).
 *
 * The label's OWN node marker — the circle centred on `label.anchor` — is
 * ignored: a normal label sits snugly against its own node, and counting that
 * as a collision would reject almost every tightly authored label.
 *
 * `otherManualRects` must exclude this label's own `manualRect`.
 */
export const isManualLabelKept = (label, obstacles, bounds, otherManualRects) => {
    const rect = label.manualRect;
    if (!rect) {
        return false;
    }
    if (areaOutsideBounds(rect, bounds) > 0) {
        return false;
    }
    for (const obstacle of obstacles) {
        if (obstacle.type === 'circle') {
            // Skip the label's own node marker.
            if (obstacle.x === label.anchor.x && obstacle.y === label.anchor.y) {
                continue;
            }
            if (circleRectOverlap(obstacle, rect)) {
                return false;
            }
        }
        else if (obstacle.type === 'rect' && rectsOverlapArea(rect, obstacle) > 0) {
            return false;
        }
        // Link segments are intentionally not checked — see the doc comment.
    }
    for (const other of otherManualRects) {
        if (rectsOverlapArea(rect, other) > 0) {
            return false;
        }
    }
    return true;
};
/** The two unit vectors on the perpendicular axis of a link label hint. */
const perpendicularDirections = (hint) => {
    const h = hint ?? { x: 0, y: 1 };
    const len = Math.hypot(h.x, h.y);
    // Fall back to the default axis when the hint is undefined or effectively zero-length,
    // so we always produce two proper non-zero perpendicular-side directions.
    const ux = len < Number.EPSILON ? 0 : h.x / len;
    const uy = len < Number.EPSILON ? 1 : h.y / len;
    // Both sides of the preferred offset direction.
    return [
        { x: ux, y: uy },
        { x: -ux, y: -uy },
    ];
};
/**
 * Generate the set of candidate positions for a label.
 * Component / anchor / annotation labels use the 8 compass directions at each
 * supplied distance. Link labels use only the perpendicular axis (both sides).
 * When the label has a `manualRect`, the author's exact position is appended
 * as one extra candidate.
 */
export const generateCandidates = (label, distances) => {
    const candidates = [];
    const directions = label.kind === 'link' ? perpendicularDirections(label.preferredOffset) : COMPASS;
    for (const distance of distances) {
        for (const direction of directions) {
            const center = {
                x: label.anchor.x + direction.x * distance,
                y: label.anchor.y + direction.y * distance,
            };
            candidates.push({
                rect: rectAround(center, label.width, label.height),
                direction,
                distance,
            });
        }
    }
    if (label.manualRect) {
        const { x: cx, y: cy } = rectCenter(label.manualRect);
        const dx = cx - label.anchor.x;
        const dy = cy - label.anchor.y;
        const distance = Math.hypot(dx, dy);
        const direction = distance < Number.EPSILON ? { x: 0, y: 0 } : { x: dx / distance, y: dy / distance };
        candidates.push({ rect: { ...label.manualRect }, direction, distance });
    }
    return candidates;
};
/**
 * Generate compass candidates centred on `origin` — used to add a second ring
 * of candidates around the manual rect center for re-placed labels so that the
 * `preferredCenter` bias can resolve to a nearby slot even when the anchor is
 * far away.
 *
 * NOTE: The `direction` and `distance` fields on these candidates are
 * origin-relative (relative to `origin`, not the node anchor) and are
 * deliberately unused by the scorer. These candidates are only ever scored
 * with `preferredCenter` set, which ignores `direction`/`distance` entirely,
 * and `needsLeader` recomputes distance independently from the anchor. Do not
 * rely on those fields for geometry.
 */
const compassCandidatesAround = (origin, label, slotDistances) => {
    const extra = [];
    for (const distance of slotDistances) {
        for (const direction of COMPASS) {
            const center = {
                x: origin.x + direction.x * distance,
                y: origin.y + direction.y * distance,
            };
            extra.push({
                rect: rectAround(center, label.width, label.height),
                direction,
                distance,
            });
        }
    }
    return extra;
};
/** The center of a manual rect, used to bias re-placed manual labels. */
const preferredCenterOf = (label) => {
    if (!label.manualRect) {
        return undefined;
    }
    return rectCenter(label.manualRect);
};
/**
 * Place all labels in `pool` using the greedy most-constrained-first algorithm
 * followed by a refinement pass. Returns the `PlacedLabel` for each pooled
 * label (in pool iteration order — caller keys by id).
 *
 * `keptObstacleRects` are the rects of manual labels that were kept as-is and
 * therefore act as fixed obstacles for pool placement.
 */
const placePool = (pool, obstacles, bounds, keptObstacleRects, config) => {
    const { slotDistances, leaderThreshold, refinementCount } = config;
    // Count candidates under obstacle/boundary pressure (incl. kept rects);
    // labels with more such candidates have fewer good options, placed first.
    const constraintOf = (label) => {
        const candidates = generateCandidates(label, slotDistances);
        let blocked = 0;
        for (const candidate of candidates) {
            if (scoreCandidate(candidate, obstacles, bounds, label.anchor, keptObstacleRects) > 1) {
                blocked++;
            }
        }
        return blocked;
    };
    // Sort most-constrained first; ties broken deterministically by priority.
    const order = [...pool].sort((a, b) => {
        const diff = constraintOf(b) - constraintOf(a);
        return diff !== 0 ? diff : a.priority - b.priority;
    });
    const placed = new Map();
    const placeAll = (sequence) => {
        for (const label of sequence) {
            // Obstacle rects = kept manual labels + every other pooled label placed.
            const others = [...keptObstacleRects];
            for (const [id, entry] of placed) {
                if (id !== label.id) {
                    others.push(entry.scored.candidate.rect);
                }
            }
            // For pooled manual labels, augment with candidates around the
            // manualRect center so the bias toward the authored position can
            // actually resolve to a nearby slot even when the anchor is far away.
            const preferred = preferredCenterOf(label);
            const anchorCandidates = generateCandidates(label, slotDistances);
            const candidates = preferred !== undefined
                ? [...anchorCandidates, ...compassCandidatesAround(preferred, label, slotDistances)]
                : anchorCandidates;
            let best;
            for (const candidate of candidates) {
                const score = scoreCandidate(candidate, obstacles, bounds, label.anchor, others, preferred, label.preferredDirection);
                if (best === undefined || score < best.score) {
                    best = { candidate, score };
                }
            }
            placed.set(label.id, { label, scored: best });
        }
    };
    // First pass.
    placeAll(order);
    // Refinement pass: re-place the worst-scoring labels against the full layout.
    const worst = [...placed.values()]
        .sort((a, b) => b.scored.score - a.scored.score)
        .slice(0, Math.max(0, refinementCount))
        .map((entry) => entry.label);
    placeAll(worst);
    return pool.map((label) => {
        const { scored } = placed.get(label.id);
        const center = rectCenter(scored.candidate.rect);
        const dist = Math.hypot(center.x - label.anchor.x, center.y - label.anchor.y);
        return {
            id: label.id,
            rect: scored.candidate.rect,
            anchor: label.anchor,
            needsLeader: dist > leaderThreshold,
        };
    });
};
/**
 * Place every label to minimise overlap with other labels, node markers, the
 * chart boundary, and link lines.
 *
 * A label carrying a `manualRect` (an author-specified `label [x, y]`) is kept
 * exactly when that position is collision-free; such kept labels become fixed
 * obstacles. Every other label — untuned labels and manual labels whose
 * authored position collided — is placed by the greedy algorithm: most
 * constrained first, ties broken by `priority`, then a refinement pass. A
 * re-placed manual label is biased back toward its authored position.
 * Pure and deterministic.
 */
export const autoPlaceLabels = (labels, obstacles, bounds, config) => {
    if (labels.length === 0) {
        return [];
    }
    if (config.slotDistances.length === 0) {
        throw new Error('autoPlaceLabels: config.slotDistances must be non-empty');
    }
    // Partition manual (author-positioned) labels from untuned ones.
    const manualLabels = labels.filter((label) => label.manualRect !== undefined);
    const untunedLabels = labels.filter((label) => label.manualRect === undefined);
    // Classify each manual label: kept (collision-free) or pooled (collided).
    const finalById = new Map();
    const keptObstacleRects = [];
    const pooledManual = [];
    for (const label of manualLabels) {
        const otherManualRects = manualLabels
            .filter((other) => other.id !== label.id)
            .map((other) => other.manualRect);
        if (isManualLabelKept(label, obstacles, bounds, otherManualRects)) {
            // A kept label stays at the authored position, but if the author placed
            // it far from the node it still gets a leader line — same threshold as
            // re-placed labels — so it does not look detached.
            const keptCenter = rectCenter(label.manualRect);
            const keptDist = Math.hypot(keptCenter.x - label.anchor.x, keptCenter.y - label.anchor.y);
            finalById.set(label.id, {
                id: label.id,
                rect: { ...label.manualRect },
                anchor: label.anchor,
                needsLeader: keptDist > config.leaderThreshold,
            });
            keptObstacleRects.push(label.manualRect);
        }
        else {
            pooledManual.push(label);
        }
    }
    // The pool: untuned labels + manual labels whose authored position collided.
    const pool = [...untunedLabels, ...pooledManual];
    if (pool.length > 0) {
        for (const p of placePool(pool, obstacles, bounds, keptObstacleRects, config)) {
            finalById.set(p.id, p);
        }
    }
    // Output in the original input order for stable consumers.
    return labels.map((label) => finalById.get(label.id));
};
