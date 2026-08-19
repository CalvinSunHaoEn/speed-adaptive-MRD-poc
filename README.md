# Adaptive Speed Display — Meta Ray-Ban Display POC

A web prototype of Figma frame **`480:8550` "Speed up Icon+STRIP META POC"**
([Adaptive Speed Display](https://www.figma.com/design/6LyB9UDTJOIJCJPtdoLUnX/Adaptive-Speed-Display?node-id=480-8550)),
built to be opened in the browser on Meta Ray-Ban Display glasses.

Tap the neural band to play the animation. Tap again to restart it from the top.

## Interaction

| | |
| --- | --- |
| **Play / restart** | Neural band tap (arrives as an ordinary pointer event), a click, or Enter / Space |
| **Playback** | Plays the 4.221s timeline once, then holds the last frame |
| **Before the first tap** | Frame 0, held static |
| **Canvas** | Authored at the display's native 600 × 600, scaled uniformly to fit the viewport |

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
redrawn or substituted. All 22 SVGs are vendored into
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
  └ 480:8630  SpeedUpStrip.tsx     chevron + glow sweep
```

All keyframe data lives in [`src/motion/timeline.ts`](src/motion/timeline.ts),
transcribed from the Figma motion context and keyed by node id.

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
4. **No inner shadow on the chevron.** Figma's Arrow carries an inner-shadow
   effect that the reference translates to `box-shadow: … inset`. The chevron's
   mask is not a chevron but a full-box radial-gradient vignette, so a box-level
   inset shadow floods the whole 240 × 150 rectangle. Dropping it takes the strip
   from 11.37 mean error against Figma's render to 0.53.

## Reading the exported motion data

Three places where the export cannot be taken literally. Each was settled by
measuring against a frame export of the Figma timeline, not the static canvas
render — the canvas render cannot decide any of them, because the runner is
fully transparent at t=0.

- **The rig's keyframes are one iteration of a loop.** They pack a single stride
  into t=0.156..0.303 with holds at t=0 and t=1. Read literally the figure runs
  for 0.62s and freezes, and since it only fades in at 1.18s just 0.10s of its
  2.40s on screen would move. The window is seamless, so `cycle()` rescales it
  into a standalone ~0.62s loop that repeats through the timeline.
- **The rig-root translate (480:8561) is a real translate.** Applied as given it
  puts the figure's box centre at (12.27, 9.70) in icon coordinates, against a
  measured (11.07, 9.71) in Figma — the vertical agreement is exact. Treating it
  as a delta from its own first keyframe instead leaves the head at y −6.97..−2.83,
  clipped away entirely.
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
