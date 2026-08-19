# Adaptive Speed Display — Meta Ray-Ban Display POC

A web prototype of Figma frame **`480:8550` "Speed up Icon+STRIP META POC"**
([Adaptive Speed Display](https://www.figma.com/design/6LyB9UDTJOIJCJPtdoLUnX/Adaptive-Speed-Display?node-id=480-8550)),
built to be opened in the browser on Meta Ray-Ban Display glasses.

Two modes: **Speed up** (Figma `480:8550`) and **Slow down** (`499:9370`). Tap
the neural band to play the current one; swipe to switch between them.

## Interaction

| | |
| --- | --- |
| **Play / restart** | Tap, click, or Enter / Space |
| **Switch mode** | Swipe left → Slow down, swipe right → Speed up. Arrow keys work too |
| **Playback** | Plays the timeline once (4.221s / 4.218s), then holds the last frame |
| **After a switch** | Frame 0 of the new mode, waiting for a tap — switching never auto-plays |
| **Before the first tap** | Frame 0, held static |
| **Canvas** | Authored at the display's native 600 × 600, scaled uniformly to fit the viewport |

How the band's gestures reach the page isn't documented, so
[`useGesture.ts`](src/useGesture.ts) listens on every plausible route at once —
pointer, touch, keyboard and horizontal wheel. A tap is only recognised on
release, after travelling less than 10px; otherwise the first touch of every
swipe would fire playback.

Every tap remounts the scene, which restarts all 28 animated nodes at exactly
t = 0 — they stay in sync rather than each drifting on its own clock.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173/speed-adaptive-MRD-poc/ (--host is on, so a LAN IP works too)
npm run build
npm run preview
```

Pushing to `main` deploys to GitHub Pages via
`.github/workflows/deploy.yml`, and the prototype is live at
**https://calvinsunhaoen.github.io/speed-adaptive-MRD-poc/** — open that in the
glasses.

Only `main` deploys: GitHub Pages accepts deployments from the default branch
only, so wiring other branches in would build fine and then fail at the deploy
step every time. To preview a branch before merging, run it locally with
`npm run dev` and open the printed Network URL on the glasses.

## Figma assets

Every visual is an export of a component authored in the Figma file — nothing is
redrawn or substituted. All 43 SVGs — both modes' exports — are vendored into
[`src/assets/figma/`](src/assets/figma/) and inlined into the bundle at build
time, so the app has no runtime dependency on Figma.

To refresh them after the design changes, regenerate the export ids from the
Figma file into [`exports.json`](src/assets/figma/exports.json) and re-run:

```bash
node scripts/vendor-figma-assets.mjs
```

Eight of the exports (`n8569`, `n8575`, `n8586`, `n8592` and their copy-B twins)
are rooted at the animated node itself rather than at its parent. Rooting at the
parent bakes that node's resting rotation into the SVG, which would double up
against the `rotate` track applied to the same node.

## How the design maps to the code

```
480:8550  Stage.tsx          600 × 600 frame
└ 480:8553                   380 × 500 stage, mix-blend-mode: screen
  ├ 480:8558  SpeedIndicator.tsx   the pace pill
  │  ├ 480:8559  RunnerIcon.tsx    "pacing-run 2", hosts both figure copies
  │  │  └ 480:8561               RunnerFigure.tsx × 2 (copy A + copy B)
  │  ├ 480:8627 / 8628           pace readouts, cross-fade + slide
  │  └ 480:8629                  ic_exercise_pace_setter
  └ 480:8630  Strip.tsx            chevron + glow sweep
```

Slow down (`499:9370`) has the same tree with its own node ids, so one set of
components renders either mode.

Keyframe data lives in [`src/motion/`](src/motion): the shared helpers and
`Track` type in [`core.ts`](src/motion/core.ts), the runner rig's joint values
in [`rig.ts`](src/motion/rig.ts) (both modes run the same stride over different
windows), and one file per mode — [`speedUp.ts`](src/motion/speedUp.ts) and
[`slowDown.ts`](src/motion/slowDown.ts) — each exporting the same `ModeTracks`
shape, transcribed from the Figma motion context and keyed by node id.
[`src/scene/modes.ts`](src/scene/modes.ts) pairs each timeline with its
per-mode geometry and the swipe-direction mapping.

## Deviations from the Figma file

1. **Playback mode.** Figma loops the cohort (`loopMode: loop`); this plays once
   per tap and holds the final frame, which is the requested interaction.
2. **Typeface.** The readouts are specified in `One UI Sans GUI SemiBold`, a
   Samsung typeface with no web distribution. Substitutes measure ~84px against
   the 66px box Figma designed — enough to push the current pace over the slot
   the target pace slides into. `FitText.tsx` condenses each readout to its
   designed width (it only ever compresses, never stretches, so it is a no-op
   where the real font is installed).
3. **`mask-clip` on the strip.** The Figma reference emits `mask-clip: no-clip`,
   which leaves whatever falls outside the mask image unmasked. Since the
   chevron's fill is inset to -4px horizontally, its right edge leaked as a hard
   red rectangle that Figma's own render does not show. The default `border-box`
   clip matches Figma.
4. **The chevron's inner shadow is carried as opacity.** Figma's Arrow is a
   VECTOR whose colour *is* its inner shadow, and the reference translates that
   to `box-shadow: … inset`. Applied literally it floods the whole 240 × 150
   rectangle, because the chevron's mask is not a chevron but a full-box
   radial-gradient vignette (11.37 mean error against Figma's render, versus
   0.53 without it). The shadow's *alpha*, though, is the layer's visibility
   envelope — drop it and the chevron never fades in or out. So the colour is
   baked into the exported SVG and the alpha is animated as `opacity` on the
   arrow group.
5. **The slow-down chevron is derived from its export, not used as shipped.**
   `vendor-figma-assets.mjs` rewrites two things in `499:9455`'s SVG and fails
   loudly if either stops matching, because both are cases where the stored file
   disagrees with what Figma renders:

   - *Colour.* The export bakes the inner shadow red, inherited from the Speed Up
     frame this one was duplicated from. Slow down is cyan throughout — the
     designer's call, and the node's own motion track (`#00F6FF`) and Figma's
     video render agree: not one pixel of the rendered frame is red-dominant. The
     red that Figma's static canvas render shows is a preview bug.
   - *Shadow offset.* Figma applies a shadow's offset in canvas space — it does
     not rotate with the layer. The strip is rotated 180°, and the export bakes
     the offset as `dy=-23` in the node's own unrotated space, so carrying the
     SVG through that rotation lights the top of the chevron instead of its tip.
     Negating it cancels the rotation, which puts the falloff back where the
     export has it: down the centre line at the plateau, Figma reads
     4/19/55/108/166/217 and this build 9/27/60/108/161/209.
   - *Edge softness.* Speed Up's `arrowFill` ends its filter chain with a 2px
     foreground blur; this export has none, so the chevron keeps a hard alpha
     edge — the `hardAlpha` step multiplies coverage by 127, quantising it to 0
     or 1 — and its arms stair-step. Figma's own render of the frame steps the
     same way; this is the one place the build deliberately departs from it, at
     the designer's request, by appending the same 2px blur Speed Up carries.

6. **The slow-down glow mask is repositioned.** Figma emits
   `mask-position: -4px 10.103px` for the glow (`499:9457`), which lands its
   chevron 11.1px below the one the Arrow draws and leaves a hard second
   silhouette crossing the shape. The two exports frame their artwork
   differently — Speed Up's `arrowFill` is 248 × 140.896 with the chevron inset
   4px, the same framing as the mask, while slow down's is a bare 240 × 132.896
   — so its fill box sits 4px inside the mask box and the mask has to move with
   it. At `-4px -0.999px` the two layers share one edge, as they do in Speed Up.

## Reading the exported motion data

Three places where the export cannot be taken literally. Each was settled by
measuring against a frame export of the Figma timeline, not the static canvas
render — the canvas render cannot decide any of them, because the runner is
fully transparent at t=0.

- **The rig's keyframes are one iteration of a loop.** They pack a single stride
  into t=0.156..0.303 with holds at t=0 and t=1. Read literally the figure runs
  for 0.62s and freezes, and since it only fades in at 1.18s just 0.10s of its
  2.40s on screen would move. The window is seamless, so `cycle()` rescales it
  into a standalone ~0.62s loop that repeats through the timeline. Slow down
  packs the same stride into t=0.156..0.388 — same values, a wider window — so
  `retime()` in [`rig.ts`](src/motion/rig.ts) resamples one shared set of joint
  keyframes for both modes.
- **The rig-root translate (480:8561) is a real translate.** Applied as given it
  puts the figure's box centre at (12.27, 9.70) in icon coordinates, against a
  measured (11.07, 9.71) in Figma — the vertical agreement is exact. Treating it
  as a delta from its own first keyframe instead leaves the head at y −6.97..−2.83,
  clipped away entirely. Slow down's root (499:9383) is the same track sampled
  more densely, and needs the same reading — taken as a delta it strands a
  two-limb fragment in the top-left of the icon.
- **A CSS transform scales more than Figma's does.** The pill's 2× scale drags
  its corner radius and its glow's blur along with it, turning the 48 × 48 box
  into a circle with a doubled ring. Both are counter-scaled so they render at
  their designed 24px radius and 4px/12px blurs.

One structural note: `get_design_context` flattens the rotating wrapper frames
out of its output (480:8566, 8569, 8572, 8575, 8583, 8586, 8589, 8592 and their
copy-B twins) — exactly the nodes carrying rotation keyframes. They are
reinstated in `RunnerFigure.tsx` as full-bleed wrappers.

The idle frame is animation frame 0, not the state Figma shows on canvas: the
chevron sits 23px lower and unlit, the glow has not begun its sweep, and both the
runner and the target pace are at opacity 0.

## Verification

Measured against a frame export of the Figma timeline with a headless Chromium
pass, rather than eyeballed:

- runner centroid x = 299.4–300.0 against Figma's 299.7–300.2 (pill centre 300);
- strip region 0.53 mean per-channel error against Figma's render of the frame;
- pill 127 × 48 radius 24 → 96 × 96 radius 12, rendering at its designed 24;
- joint angles change at every sample across the runner's visible window;
- a second tap restarts from frame 0; no console errors, no external requests.
