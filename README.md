# Speed Adaptive Display — Meta Ray-Ban Display PoC

A web prototype of the Figma frame **`Speed up Icon+STRIP META POC`** (600×600,
node `480:8550` in the *Adaptive Speed Display* file), built to be opened in the
browser on Meta Ray-Ban Display glasses and driven by a Neural Band tap.

- **Tap** → the 4.221 s timeline plays once and holds its last frame.
- **Tap again** → it replays from the first frame.
- **Before the first tap** → frame 0 is on screen, static.

600×600 is the display's addressable area, so on the glasses the frame lands
1:1. Anywhere else it scales down as a whole rather than reflowing, so a phone
or a laptop shows the same composition.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173, --host so the glasses can reach it
npm run build      # regenerates keyframes.css, typechecks, bundles
npm run preview
```

`npm run build` writes into `dist/` with the base path
`/speed-adaptive-MRD-poc/` (GitHub Pages). Set `BASE_PATH=/` to serve from a
domain root instead.

### GitHub Pages

`.github/workflows/deploy.yml` builds and deploys on every push to
`claude/figma-react-web-prototype-bxuyfl` and `main`. It needs Pages switched to
the Actions source once, by hand:
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

## How the design got here

| Concern | Where it lives |
| --- | --- |
| Node boxes (position, size) | inline in `src/components/*`, via `box()` in `src/figma.ts` |
| The 28 animated nodes | `tools/motion/tracks.mjs`, transcribed from Figma's `get_motion_context` |
| The CSS that plays them | `src/styles/keyframes.css` — **generated**, `npm run gen:keyframes` |
| Vector artwork | `src/assets/figma/` (see the README there) |
| Playback / tap handling | `src/App.tsx` |

Every DOM node carries its Figma `data-node-id`, and `keyframes.css` binds
animations by that id — so a node in the browser inspector maps straight back to
a layer in the Figma file.

### Why the animation is plain CSS

`get_motion_context` returns each track's keyframe times, values and per-segment
easing curves. Those map exactly onto `@keyframes` with per-keyframe
`animation-timing-function`, so no animation runtime is needed — which keeps the
bundle small and avoids asking the glasses' browser to run a JS animation loop.
`tools/motion/build-keyframes.mjs` turns the raw data into CSS and validates it
(mismatched times/values arrays fail the build).

Playback is gated by a single custom property, `--fig-play-state`. Replaying
remounts the stage under a new React key, which is the one reliable way to
rewind CSS animations across engines.

### Tap handling

The Neural Band's tap arrives as a pointer event, so the whole surface is the
hit target (`pointerdown`, with a 120 ms debounce so one tap is one gesture).
<kbd>Enter</kbd>/<kbd>Space</kbd> are bound as well, so the same build is
drivable from a keyboard or a paired remote.

## Known gaps

- **The artwork is placeholder.** See `src/assets/figma/README.md` — the build
  environment could not reach Figma's asset hosts. Geometry and timing are
  right; the vectors are stand-ins until the real exports are dropped in.
- **Text is artwork, not type.** The pace readouts ship as SVG rather than live
  text, because the design uses One UI Sans GUI, which can't be redistributed.
  Changing the numbers means re-exporting those two nodes.
- **The glasses' browser is unverified.** `mix-blend-mode: screen`,
  `mask-image` and `filter: blur()` each carry the design; if any of them turns
  out to be unsupported on-device, they are isolated to
  `src/styles/layout.css` and `src/components/SpeedUpStrip.tsx`.
