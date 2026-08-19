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

Pushing to `claude/figma-meta-rayna-prototype-x6m6j7` deploys to GitHub Pages via
`.github/workflows/deploy.yml`. **This needs enabling once:** repo *Settings →
Pages → Source: **GitHub Actions***. After that the prototype lives at
`https://<owner>.github.io/speed-adaptive-MRD-poc/` — open that in the glasses.

## Figma assets — action required

Every visual is an export of a component authored in the Figma file; nothing is
redrawn or substituted. The exports are listed in
[`src/assets/figma/exports.json`](src/assets/figma/exports.json).

They currently resolve to **Figma's temporary MCP export URLs, which expire
about 7 days after they were generated.** To make the build self-contained:

```bash
node scripts/vendor-figma-assets.mjs
git add src/assets/figma/*.svg && git commit -m "Vendor Figma SVG exports"
```

The script writes the SVGs into `src/assets/figma/`, where
[`index.ts`](src/assets/figma/index.ts) picks them up automatically in
preference to the remote URLs. If it reports HTTP errors the ids have expired
and need regenerating from the Figma file.

> The environment this prototype was built in blocks outbound traffic to
> `www.figma.com`, so the SVGs could not be vendored at authoring time. Run the
> script from a machine with normal Figma access.

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

Three, all deliberate:

1. **Playback mode.** Figma loops the cohort (`loopMode: loop`); this plays once
   per tap and holds the final frame, which is the requested interaction.
2. **Typeface.** The readouts are specified in `One UI Sans GUI SemiBold`, a
   Samsung typeface with no web distribution. A system sans stack stands in. The
   readout widths (66px / 67px) are pinned in code so the substitute font cannot
   shift the layout or the −74.5px slide of the target pace.
3. **Rig root translation (480:8561).** Figma reports this track in coordinates
   whose origin does not match the node's layout box — its first keyframe is
   `8.52, 7.202` on a node the file places at `0, 0`. Applied raw as a CSS
   translate it would shove the 6px-wide figure across the 18px icon, so the
   track is applied as a delta from its own first keyframe. The rest pose lands
   where Figma renders it and the ~0.3 × 0.7px run-cycle bob is preserved.

One implementation note: `get_design_context` flattens the rotating wrapper
frames out of its output (480:8566, 8569, 8572, 8575, 8583, 8586, 8589, 8592 and
their copy-B twins). They are reinstated in `RunnerFigure.tsx` as full-bleed
wrappers, and the eight animated leaves use exports rooted at themselves so
their resting rotation is not baked into the SVG *and* applied again as a
transform.
