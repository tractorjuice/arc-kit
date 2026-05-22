# How ArcKit tidies Wardley Map labels: a deterministic placement engine, stepped through

A Wardley Map is only as useful as it is readable. ArcKit's `/arckit:wardley` command renders each map as a Mermaid `wardley-beta` block, and Mermaid draws every component label at the same default offset from its node. On a sparse map that is fine. On a real strategic map, where related components naturally cluster, those default labels land on top of each other and on top of neighbouring nodes. The map is correct and unreadable at the same time.

ArcKit v5 fixes this automatically. A PostToolUse hook watches for Wardley artefacts being written and rewrites the `label [x, y]` offsets in the Mermaid block so no two labels collide. The hook itself is small. The interesting part is the placement engine it calls, a pure, deterministic optimiser that decides where forty or fifty labels should sit. This article steps through that algorithm in full.

## Where the hook sits

An ArcKit Wardley artefact is a Markdown file holding two fenced code blocks: a canonical `wardley` block in OnlineWardleyMaps syntax, and a `mermaid` block in `wardley-beta` syntax for rendering. The tidy hook is deliberately narrow. It touches only the `mermaid` block. The OWM block, the prose, the Document Control table and everything else are left byte-for-byte unchanged.

The hook fires on `Write` and `Edit`, scoped by a path glob to `projects/**/wardley-maps/**`, and it fails soft: if anything goes wrong, the file is left exactly as written and the turn is never blocked. All the real work happens in two vendored modules that ship alongside the hook, `wardley-tidy.mjs` and `wardley-label-placement.mjs`. Everything below lives in those two files.

## From map source to pixels

Tidying one map is a six-step pipeline. The source text goes in, a rewritten source text comes out, and the labels in between have been treated as a geometry problem.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 584" role="img" aria-label="The six-step tidy pipeline, from wardley-beta source text through parse, project, build obstacles, place, invert and rewrite, to tidied source text" style="display:block;margin:1.75rem auto;width:100%;max-width:520px;height:auto;" font-family="Arial, Helvetica, sans-serif">
  <defs>
    <marker id="tw-arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 z" fill="#626a6e"/>
    </marker>
  </defs>
  <rect width="720" height="584" fill="#ffffff"/>
  <g stroke="#626a6e" stroke-width="1.8" marker-end="url(#tw-arrow)">
    <line x1="360" y1="70"  x2="360" y2="90"/>
    <line x1="360" y1="140" x2="360" y2="160"/>
    <line x1="360" y1="210" x2="360" y2="230"/>
    <line x1="360" y1="280" x2="360" y2="300"/>
    <line x1="360" y1="350" x2="360" y2="370"/>
    <line x1="360" y1="420" x2="360" y2="440"/>
    <line x1="360" y1="490" x2="360" y2="510"/>
  </g>
  <rect x="200" y="24" width="320" height="46" rx="23" fill="#1d70b8"/>
  <text x="360" y="52" text-anchor="middle" font-size="15" font-weight="bold" fill="#ffffff">wardley-beta source text</text>
  <g>
    <rect x="200" y="94" width="320" height="46" rx="6" fill="#ffffff" stroke="#b1b4b6" stroke-width="1.5"/>
    <circle cx="200" cy="117" r="15" fill="#1d70b8"/>
    <text x="200" y="122" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">1</text>
    <text x="372" y="122" text-anchor="middle" font-size="15" fill="#0b0c0c">Line-oriented parse</text>
    <rect x="200" y="164" width="320" height="46" rx="6" fill="#ffffff" stroke="#b1b4b6" stroke-width="1.5"/>
    <circle cx="200" cy="187" r="15" fill="#1d70b8"/>
    <text x="200" y="192" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">2</text>
    <text x="372" y="192" text-anchor="middle" font-size="15" fill="#0b0c0c">Project to pixel coordinates</text>
    <rect x="200" y="234" width="320" height="46" rx="6" fill="#ffffff" stroke="#b1b4b6" stroke-width="1.5"/>
    <circle cx="200" cy="257" r="15" fill="#1d70b8"/>
    <text x="200" y="262" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">3</text>
    <text x="372" y="262" text-anchor="middle" font-size="15" fill="#0b0c0c">Build label boxes and obstacles</text>
    <rect x="200" y="304" width="320" height="46" rx="6" fill="#ffffff" stroke="#b1b4b6" stroke-width="1.5"/>
    <circle cx="200" cy="327" r="15" fill="#1d70b8"/>
    <text x="200" y="332" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">4</text>
    <text x="372" y="332" text-anchor="middle" font-size="15" fill="#0b0c0c">Run the placement engine</text>
    <rect x="200" y="374" width="320" height="46" rx="6" fill="#ffffff" stroke="#b1b4b6" stroke-width="1.5"/>
    <circle cx="200" cy="397" r="15" fill="#1d70b8"/>
    <text x="200" y="402" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">5</text>
    <text x="372" y="402" text-anchor="middle" font-size="15" fill="#0b0c0c">Invert each rect to a label offset</text>
    <rect x="200" y="444" width="320" height="46" rx="6" fill="#ffffff" stroke="#b1b4b6" stroke-width="1.5"/>
    <circle cx="200" cy="467" r="15" fill="#1d70b8"/>
    <text x="200" y="472" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">6</text>
    <text x="372" y="472" text-anchor="middle" font-size="15" fill="#0b0c0c">Rewrite the component lines</text>
  </g>
  <rect x="200" y="514" width="320" height="46" rx="23" fill="#1d70b8"/>
  <text x="360" y="542" text-anchor="middle" font-size="15" font-weight="bold" fill="#ffffff">Tidied wardley-beta source text</text>
</svg>

The reason every step matters is that the placement engine works in pixels, but the map source is written in Wardley coordinates: visibility and evolution, each a number between 0 and 1. To place a label well you have to know where the label and its node will actually be drawn, which means reproducing Mermaid's renderer exactly.

## Steps one to three: parse, project, build the field

**The parse** is line-oriented rather than a full grammar. It walks the source once and recognises the lines that carry geometry: the `size` directive, `component` declarations with their visibility and evolution coordinates and any author-supplied `label` offset, `pipeline` blocks and their child components, and links between components. Anchors, annotations and notes are recorded as obstacles but never relabelled, because the `wardley-beta` grammar has no label offset for them. Everything the parser does not recognise is left verbatim, which is what keeps the rewrite minimal.

**The projection** is an exact replica of Mermaid's `wardley-beta` renderer. The same constants are used: a 900 by 600 canvas, 48 pixels of padding, a 6-pixel node radius, a 10-point label font. A coordinate is projected with

```
chartWidth  = width  - 2 * padding
projectX(v) = padding + (v / 100) * chartWidth
projectY(v) = height - padding - (v / 100) * chartHeight
```

The Y axis is inverted because visibility runs bottom to top on a Wardley Map but top to bottom in screen pixels. Pipelines get a pre-pass of their own: the parent square is repositioned to the midpoint of its children and the pipeline box is recorded as a rectangle.

**Building the field** turns the projected map into the two inputs the engine needs. Every component becomes a `LabelBox`: an anchor point at the node, and a width and height for the label text. The label box is estimated rather than measured, with `width = textLength * fontSize * 0.6` and `height = fontSize * 1.2`. Estimating instead of measuring avoids a DOM round-trip and, more importantly, keeps the result deterministic and testable. Every node, link and pipeline box also becomes an `Obstacle`: a circle for a node marker, a line segment for a link, a rectangle for a pipeline box.

So the engine receives a list of labels that want a home, and a list of obstacles they must avoid.

## Step four: candidates and scoring

The placement engine never solves for a label's position analytically. It generates a fixed set of candidate positions and scores each one. For an ordinary component label there are thirty-two candidates: eight compass directions at four distances from the node.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540" role="img" aria-label="A node marker at the centre of four dashed rings at distances 12, 22, 36 and 54 pixels, crossed by eight compass spokes; a candidate dot sits at every ring and spoke intersection, 32 in total, with one north-east candidate highlighted as the chosen lowest-scoring slot" style="display:block;margin:1.75rem auto;width:100%;max-width:620px;height:auto;" font-family="Arial, Helvetica, sans-serif">
  <rect width="720" height="540" fill="#ffffff"/>
  <g stroke="#e0e0e0" stroke-width="1">
    <line x1="300" y1="246" x2="496"   y2="246"/>
    <line x1="300" y1="246" x2="438.6" y2="107.4"/>
    <line x1="300" y1="246" x2="300"   y2="50"/>
    <line x1="300" y1="246" x2="161.4" y2="107.4"/>
    <line x1="300" y1="246" x2="104"   y2="246"/>
    <line x1="300" y1="246" x2="161.4" y2="384.6"/>
    <line x1="300" y1="246" x2="300"   y2="442"/>
    <line x1="300" y1="246" x2="438.6" y2="384.6"/>
  </g>
  <g fill="none" stroke="#b1b4b6" stroke-width="1.2" stroke-dasharray="4 4">
    <circle cx="300" cy="246" r="46"/>
    <circle cx="300" cy="246" r="86"/>
    <circle cx="300" cy="246" r="134"/>
    <circle cx="300" cy="246" r="196"/>
  </g>
  <g fill="#6f777b">
    <circle cx="346"   cy="246"   r="3.6"/><circle cx="332.5" cy="213.5" r="3.6"/>
    <circle cx="300"   cy="200"   r="3.6"/><circle cx="267.5" cy="213.5" r="3.6"/>
    <circle cx="254"   cy="246"   r="3.6"/><circle cx="267.5" cy="278.5" r="3.6"/>
    <circle cx="300"   cy="292"   r="3.6"/><circle cx="332.5" cy="278.5" r="3.6"/>
    <circle cx="386"   cy="246"   r="3.6"/><circle cx="360.8" cy="185.2" r="3.6"/>
    <circle cx="300"   cy="160"   r="3.6"/><circle cx="239.2" cy="185.2" r="3.6"/>
    <circle cx="214"   cy="246"   r="3.6"/><circle cx="239.2" cy="306.8" r="3.6"/>
    <circle cx="300"   cy="332"   r="3.6"/><circle cx="360.8" cy="306.8" r="3.6"/>
    <circle cx="434"   cy="246"   r="3.6"/><circle cx="394.8" cy="151.2" r="3.6"/>
    <circle cx="300"   cy="112"   r="3.6"/><circle cx="205.2" cy="151.2" r="3.6"/>
    <circle cx="166"   cy="246"   r="3.6"/><circle cx="205.2" cy="340.8" r="3.6"/>
    <circle cx="300"   cy="380"   r="3.6"/><circle cx="394.8" cy="340.8" r="3.6"/>
    <circle cx="496"   cy="246"   r="3.6"/><circle cx="438.6" cy="107.4" r="3.6"/>
    <circle cx="300"   cy="50"    r="3.6"/><circle cx="161.4" cy="107.4" r="3.6"/>
    <circle cx="104"   cy="246"   r="3.6"/><circle cx="161.4" cy="384.6" r="3.6"/>
    <circle cx="300"   cy="442"   r="3.6"/><circle cx="438.6" cy="384.6" r="3.6"/>
  </g>
  <g font-size="11" fill="#505a5f" text-anchor="end">
    <text x="291" y="204">12</text>
    <text x="291" y="164">22</text>
    <text x="291" y="116">36</text>
    <text x="291" y="54">54</text>
  </g>
  <g font-size="11" font-weight="bold" fill="#505a5f" text-anchor="middle">
    <text x="300"   y="34">N</text>
    <text x="452.7" y="97">NE</text>
    <text x="516"   y="250">E</text>
    <text x="452.7" y="403">SE</text>
    <text x="300"   y="466">S</text>
    <text x="147.3" y="403">SW</text>
    <text x="84"    y="250">W</text>
    <text x="147.3" y="97">NW</text>
  </g>
  <rect x="163.2" y="329.8" width="84" height="22" rx="3" fill="#f3f2f1" stroke="#b1b4b6" stroke-width="1.4"/>
  <text x="205.2" y="344.5" text-anchor="middle" font-size="11" fill="#505a5f">label box</text>
  <rect x="318.8" y="174.2" width="84" height="22" rx="3" fill="#d6ebe0" stroke="#00703c" stroke-width="2"/>
  <text x="360.8" y="189" text-anchor="middle" font-size="11" font-weight="bold" fill="#00703c">chosen</text>
  <circle cx="300" cy="246" r="9" fill="#ffffff" stroke="#1d70b8" stroke-width="2.5"/>
  <g>
    <circle cx="520" cy="150" r="4" fill="#6f777b"/>
    <text x="536" y="154" font-size="12" fill="#0b0c0c">Candidate position</text>
    <rect x="508" y="180" width="24" height="16" rx="2" fill="#f3f2f1" stroke="#b1b4b6" stroke-width="1.4"/>
    <text x="540" y="192" font-size="12" fill="#0b0c0c">Label bounding box</text>
    <rect x="508" y="212" width="24" height="16" rx="2" fill="#d6ebe0" stroke="#00703c" stroke-width="1.6"/>
    <text x="540" y="224" font-size="12" fill="#0b0c0c">Chosen (lowest score)</text>
    <circle cx="520" cy="260" r="7" fill="#ffffff" stroke="#1d70b8" stroke-width="2.2"/>
    <text x="536" y="264" font-size="12" fill="#0b0c0c">Node marker</text>
  </g>
  <text x="300" y="512" text-anchor="middle" font-size="13" fill="#0b0c0c">8 compass directions &#215; 4 slot distances = 32 candidate positions per label</text>
</svg>

Each candidate is the label's bounding box, centred at one of those thirty-two points. Scoring a candidate is a weighted sum of penalties, and lower is better. A score near zero is an unobstructed slot close to the node in the preferred direction.

The penalties are deliberately uneven, because the things they punish are not equally bad:

- Overlapping another label's box costs 5 per square pixel of overlap. Ugly, but survivable.
- Overlapping a node marker costs a flat 800. This is the cardinal sin: a label sitting on a node makes the map actively wrong, so the weight is large enough that no candidate with a marker collision can win against one without.
- Spilling outside the chart bounds costs 50 per square pixel.
- Crossing a link line costs a flat 120.
- Overlapping a pipeline box costs 4 per square pixel.
- Distance from the node costs 0.05 per pixel, a gentle pull inward so labels stay close to what they describe.
- Pointing the wrong way costs up to 6, scaled by how far the candidate's direction deviates from the preferred direction, which is up and to the right by default. Pipeline children prefer to sit underneath instead.

The two soft terms, distance and direction, are what break ties between otherwise-equal slots. They are the reason a tidied map still looks intentional rather than scattered: given two collision-free positions, the engine prefers the closer one in the conventional direction.

## Step five inside step four: most-constrained-first

Scoring tells you how good one position is. It does not tell you the order in which to place labels, and order matters: a label placed early has an empty canvas, a label placed last has to fit around everything else. Placing them in the wrong order gives an early, easy label a slot that a later, desperate label needed.

The engine borrows a classic constraint-satisfaction heuristic: most-constrained-first. Before placing anything, it counts, for each label, how many of its thirty-two candidates are already blocked by obstacles. A label hemmed in by nodes and boundaries has few good options left and is placed first, while the canvas is still open. A label out in clear space is placed last, because it will be fine wherever it lands. Ties are broken by a stable `priority` field so the result never depends on input ordering.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 500" role="img" aria-label="Placement decision flow: labels with no author offset go to the pool; labels with an offset are kept if collision-free or pooled if not; the pool is placed greedily, most-constrained first then a refinement pass on the three worst; kept labels and pool results combine into the final layout" style="display:block;margin:1.75rem auto;width:100%;max-width:600px;height:auto;" font-family="Arial, Helvetica, sans-serif">
  <defs>
    <marker id="tw-arrow2" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
      <path d="M0,0 L7,3 L0,6 z" fill="#626a6e"/>
    </marker>
  </defs>
  <rect width="680" height="500" fill="#ffffff"/>
  <g stroke="#626a6e" stroke-width="1.8" fill="none">
    <line x1="150" y1="132" x2="70" y2="132"/>
    <line x1="140" y1="262" x2="70" y2="262"/>
    <line x1="70"  y1="132" x2="70" y2="378"/>
    <line x1="70"  y1="378" x2="90" y2="378" marker-end="url(#tw-arrow2)"/>
  </g>
  <g stroke="#626a6e" stroke-width="1.8" fill="none" marker-end="url(#tw-arrow2)">
    <line x1="250" y1="60"  x2="250" y2="80"/>
    <line x1="250" y1="182" x2="250" y2="208"/>
    <line x1="360" y1="262" x2="428" y2="262"/>
    <polyline points="250,422 250,460 318,460"/>
    <polyline points="520,288 520,460 482,460"/>
  </g>
  <g font-size="12" fill="#505a5f" font-weight="bold">
    <text x="108" y="125" text-anchor="middle">No</text>
    <text x="103" y="255" text-anchor="middle">No</text>
    <text x="264" y="200">Yes</text>
    <text x="378" y="255">Yes</text>
  </g>
  <rect x="170" y="20" width="160" height="40" rx="20" fill="#1d70b8"/>
  <text x="250" y="45" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">All labels</text>
  <polygon points="250,80 352,132 250,184 148,132" fill="#fff7e6" stroke="#f47738" stroke-width="1.6"/>
  <text x="250" y="127" text-anchor="middle" font-size="13" fill="#0b0c0c">Has an author</text>
  <text x="250" y="144" text-anchor="middle" font-size="13" fill="#0b0c0c">label offset?</text>
  <polygon points="250,208 362,262 250,316 138,262" fill="#fff7e6" stroke="#f47738" stroke-width="1.6"/>
  <text x="250" y="257" text-anchor="middle" font-size="13" fill="#0b0c0c">Is that offset</text>
  <text x="250" y="274" text-anchor="middle" font-size="13" fill="#0b0c0c">collision-free?</text>
  <rect x="428" y="236" width="184" height="52" rx="6" fill="#e8f5ec" stroke="#00703c" stroke-width="1.6"/>
  <text x="520" y="258" text-anchor="middle" font-size="13" font-weight="bold" fill="#0b0c0c">Kept</text>
  <text x="520" y="276" text-anchor="middle" font-size="12" fill="#505a5f">frozen as a fixed obstacle</text>
  <rect x="90" y="334" width="320" height="88" rx="6" fill="#f3f2f1" stroke="#b1b4b6" stroke-width="1.6"/>
  <text x="250" y="358" text-anchor="middle" font-size="13" font-weight="bold" fill="#0b0c0c">Pool</text>
  <text x="250" y="377" text-anchor="middle" font-size="12" fill="#505a5f">Untuned labels + collided manual labels</text>
  <text x="250" y="396" text-anchor="middle" font-size="12" fill="#505a5f">Placed by the greedy engine: most-constrained</text>
  <text x="250" y="413" text-anchor="middle" font-size="12" fill="#505a5f">first, then a refinement pass on the 3 worst</text>
  <rect x="320" y="438" width="162" height="44" rx="22" fill="#1d70b8"/>
  <text x="401" y="464" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">Final layout</text>
</svg>

Placement is greedy. Each label in the sorted order is given the lowest-scoring of its candidates, scored against the obstacles plus every label already placed. A single greedy pass can still leave a few labels poorly placed, because the labels placed first could not see the ones that came later. So a refinement pass takes the three worst-scoring labels and re-places them against the now-complete layout. Three is enough in practice: the worst cases are almost always a small number of labels that were boxed in by decisions made after them.

Finally, any label whose chosen position ended up more than 34 pixels from its node is flagged as needing a leader line, so a long offset still reads as belonging to its node.

## Step six and the author: keep what was tuned

Not every label is the engine's to move. An author can write an explicit `label [x, y]` offset on a component, and a good tool does not overrule a human who has deliberately positioned something.

So before placement begins, the engine partitions labels into two groups. Untuned labels, with no author offset, go straight into the pool described above. Manual labels, the ones with an author offset, are first tested for collisions. A manual label is kept exactly as written unless its box overlaps another node's marker, overlaps a pipeline box, spills outside the chart, or overlaps another manual label. Crossing a link line does not, on its own, reject it: link lines are thin, an author who placed a label across one accepted that, and treating every clipped link as a collision would re-place labels that looked perfectly fine.

A kept label is frozen and added to the obstacle list, so the engine routes every other label around it. A manual label that fails the collision test is dropped into the pool and re-placed like any other, except that its score gains a soft pull back toward the position the author originally chose. The author's intent is treated as a strong hint even when it could not be honoured exactly.

## Inversion, rewrite, and the fixpoint

The engine returns a pixel rectangle for each label. Step five of the pipeline inverts that back into the `label [ox, oy]` offset the `wardley-beta` grammar expects, by subtracting the node's pixel position. Step six rewrites only the component lines whose offset actually changed, leaving every other byte of the block alone.

There is one last subtlety. A single tidy pass is not always a fixpoint. The first pass auto-places an untuned map; a second pass re-reads its own output, now sees every label as an authored offset, and a few keep-or-replace decisions can flip. Most maps settle within two passes. A handful have two equally good candidate slots that swap on every pass, a stable two-cycle that never reaches a true fixpoint.

`tidyToFixpoint` handles both. It runs the pass repeatedly until the output stops changing, and if it detects a cycle it returns the lexicographically smallest member of that cycle. The result is that tidying is idempotent: tidying an already-tidied map produces an identical file, which is exactly the property a Write hook needs so it never fights the user with cosmetic churn.

## Why every step is deterministic

The recurring word in this design is deterministic, and that is not an accident. The placement engine is a pure function: the same map in always produces the same map out, on any machine, with no clock, no randomness and no DOM. Label sizes are estimated arithmetically rather than measured in a browser. The placement order is sorted with a stable tie-break. The fixpoint loop canonicalises cycles.

This matters because the engine runs inside a hook on every `Write` and `Edit` of a Wardley artefact. A non-deterministic tidier would rewrite the file differently each time it ran, producing noisy diffs, fighting version control, and making the hook impossible to test. A deterministic one can be unit tested against fixed expected output, runs offline with no install step, and rewrites a file once and then leaves it alone. The algorithm is sophisticated, a weighted soft-constraint optimiser with a constraint-ordering heuristic and a refinement pass, but it behaves like a formatter. That is the point.

You can see it work by running `/arckit:wardley` and watching the `label` offsets appear in the Mermaid block of the artefact it writes. The hook has already tidied them before you open the file.

---

ArcKit is an open-source enterprise architecture governance toolkit for AI coding assistants. The Wardley tidy engine ships with the core plugin. Explore the full command set at [arckit.org](https://arckit.org).
