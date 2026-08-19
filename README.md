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

Four, all deliberate:

1. **Playback mode.** Figma loops the cohort (`loopMode: loop`); this plays once
   per tap and holds the final frame, which is the requested interaction.
2. **Typeface.** The readouts are specified in `One UI Sans GUI SemiBold`, a
   Samsung typeface with no web distribution. Substitutes measure ~84px against
   the 66px box Figma designed — enough to push the current pace over the slot
   the target pace slides into. `FitText.tsx` condenses each readout to its
   designed width (it only ever compresses, never stretches, so it is a no-op
   where the real font is installed).
3. **Rig root translation (480:8561).** Figma reports this track in coordinates
   whose origin does not match the node's layout box — its first keyframe is
   `8.52, 7.202` on a node the file places at `0, 0`. Applied raw as a CSS
   translate it would shove the 6px-wide figure across the 18px icon, so the
   track is applied as a delta from its own first keyframe. Verified against
   Figma's own render of `480:8559`: the rig lands in the same position and
   extent.
4. **`mask-clip` on the strip.** The Figma reference emits `mask-clip: no-clip`,
   which leaves whatever falls outside the mask image unmasked. Since the
   chevron's fill is inset to -4px horizontally, its right edge leaked as a hard
   red rectangle that Figma's own render does not show. The default `border-box`
   clip matches Figma.

Two notes on reading the idle frame: it is animation frame 0, not the state
Figma shows on canvas. At frame 0 the chevron sits 23px lower and unlit, the
glow has not begun its sweep, and both the runner rig and the target pace are at
opacity 0 — all of which Figma's canvas render shows in their resting state
instead.

One implementation note: `get_design_context` flattens the rotating wrapper
frames out of its output (480:8566, 8569, 8572, 8575, 8583, 8586, 8589, 8592 and
their copy-B twins). They are reinstated in `RunnerFigure.tsx` as full-bleed
wrappers.

## Verification

Checked against the Figma file with a headless Chromium pass:

- idle frame diffed against Figma's 600 x 600 render of `480:8550`;
- the runner rig diffed against Figma's render of `480:8559`, confirming the
  rig-root handling above;
- all 28 tracks probed over time — joints cycle within the 0.66–1.28s window the
  Figma `times` specify, copies A and B stay phase-offset, the chevron rises
  while its blur ramps, the glow sweeps and holds;
- a second tap restarts from frame 0.
