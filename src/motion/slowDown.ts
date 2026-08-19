/**
 * Slow Down — keyframe data for Figma frame 499:9370
 * "Slow Down Icon+STRIP ＭETA POC".
 *
 * The companion to `speedUp.ts`: the same animation in a cyan colourway, with
 * the strip rotated 180deg so the chevron points down. Transcribed from the
 * Figma MCP motion context (one cohort, 4.218s, 26 animated nodes), with the
 * same deliberate change — `repeat: Infinity` is dropped, because this
 * prototype plays once per tap and holds its last frame.
 */

import {
  CYCLE_REPEATS,
  EASE_INOUT,
  EASE_SMOOTH,
  cycle,
  joint,
  type ModeTracks,
  type RigTracks,
  type Track,
} from './core'
import { RIG_PIVOTS, RIG_TIMES, RIG_TIMES_FOR, RIG_VALUES, retime } from './rig'

const DURATION_S = 4.218

const GLOW_WHITE =
  '0px 0px 4px 0px #FFF inset, 0px 0px 12px 0px rgba(255, 255, 255, 0.5) inset'
/*
 * Cyan rather than red, and halved for the same reason as Speed Up's: the glow
 * is lit over exactly the window where the pill sits at 2x, and a CSS transform
 * scales a box-shadow's blur along with everything else, so the designed
 * 4px/12px blurs are pre-divided to render at their intended size.
 */
const GLOW_CYAN = '0px 0px 2px 0px #00F6FF inset, 0px 0px 6px 0px #00F6FF inset'

// ---------------------------------------------------------------------------
// Speed Indicator pill — 499:9379
// ---------------------------------------------------------------------------

export const speedIndicator: Track = {
  transformOrigin: '50% 0%',
  initial: { scaleX: 1, scaleY: 1, width: 127, x: 0, borderRadius: 24 },
  animate: {
    scaleX: [1, 1, 2, 2, 1, 1],
    scaleY: [1, 1, 2, 2, 1, 1],
    width: [127, 127, 48, 48, 127, 127],
    x: [0, 0, 39, 39, 0, 0],
    // Counter-scaled so the 24px radius Figma holds constant still renders at
    // 24 once the pill is at 2x, instead of rounding into a circle.
    borderRadius: [24, 24, 12, 12, 24, 24],
  },
  transition: {
    scaleX: {
      duration: DURATION_S,
      times: [0, 0.2364, 0.3474, 0.8149, 0.8872, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    scaleY: {
      duration: DURATION_S,
      times: [0, 0.2364, 0.3474, 0.8149, 0.8872, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    width: {
      duration: DURATION_S,
      times: [0, 0.1267, 0.2166, 0.9052, 0.9995, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    x: {
      duration: DURATION_S,
      times: [0, 0.1267, 0.2166, 0.9052, 0.9995, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    borderRadius: {
      duration: DURATION_S,
      times: [0, 0.2364, 0.3474, 0.8149, 0.8872, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
  },
}

export const speedIndicatorGlow: Track = {
  initial: { boxShadow: GLOW_WHITE },
  animate: {
    boxShadow: [
      GLOW_WHITE,
      GLOW_WHITE,
      GLOW_WHITE,
      GLOW_CYAN,
      GLOW_CYAN,
      GLOW_CYAN,
      GLOW_WHITE,
      GLOW_WHITE,
    ],
  },
  transition: {
    boxShadow: {
      duration: DURATION_S,
      times: [0, 0.236, 0.2361, 0.3474, 0.8143, 0.8144, 0.8855, 1],
      ease: ['linear', 'linear', EASE_SMOOTH, 'linear', 'linear', EASE_INOUT, 'linear'],
    },
  },
}

// ---------------------------------------------------------------------------
// Runner icon — 499:9381
// ---------------------------------------------------------------------------

export const runnerIcon: Track = {
  initial: { opacity: 0, scaleX: 1, scaleY: 1 },
  animate: {
    opacity: [0, 0, 1, 1, 0, 0],
    scaleX: [1, 1, 1.4, 1.4, 1, 1],
    scaleY: [1, 1, 1.4, 1.4, 1, 1],
  },
  transition: {
    opacity: {
      duration: DURATION_S,
      times: [0, 0.2227, 0.2794, 0.8156, 0.8725, 1],
      ease: ['linear', EASE_SMOOTH, 'linear', EASE_SMOOTH, 'linear'],
    },
    scaleX: {
      duration: DURATION_S,
      times: [0, 0.236, 0.3463, 0.8165, 0.8865, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    scaleY: {
      duration: DURATION_S,
      times: [0, 0.236, 0.3463, 0.8165, 0.8865, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
  },
}

// ---------------------------------------------------------------------------
// Runner rig — 499:9383 and its joints
//
// Slow Down's stride is the same curve as Speed Up's — every joint matches in
// amplitude and phase — but it runs over a longer window, which is the whole
// point of the mode. Figma samples that window more densely; the samples are
// mapped onto it with `retime` rather than carried as a second near-identical
// copy of twenty arrays.
// ---------------------------------------------------------------------------

/** Figma's cycle window for this frame: t=0.1557..0.3875, ~0.98s per stride. */
const CYCLE_START = 0.1557
const CYCLE_END = 0.3875

const sdTimes = (name: keyof typeof RIG_TIMES) =>
  retime(RIG_TIMES[name], CYCLE_START, CYCLE_END)

const ROOT_X = [
  8.52, 8.52, 8.566, 8.594, 8.606, 8.634, 8.65, 8.658, 8.659, 8.66, 8.658,
  8.65, 8.634, 8.621, 8.606, 8.566, 8.52, 8.474, 8.46, 8.434, 8.406, 8.39,
  8.382, 8.382, 8.38, 8.382, 8.39, 8.406, 8.409, 8.434, 8.474, 8.52, 8.52,
]
const ROOT_Y = [
  7.202, 7.202, 7.372, 7.521, 7.586, 7.748, 7.828, 7.836, 7.814, 7.798, 7.72,
  7.6, 7.44, 7.36, 7.27, 7.166, 7.202, 7.372, 7.448, 7.586, 7.748, 7.828,
  7.836, 7.827, 7.798, 7.72, 7.6, 7.44, 7.419, 7.27, 7.166, 7.202, 7.202,
]

const relative = (values: number[]) => values.map((v) => v - values[0])
const rootTimes = sdTimes('T_D')
const rootX = cycle(relative(ROOT_X), rootTimes, DURATION_S)
const rootY = cycle(relative(ROOT_Y), rootTimes, DURATION_S)

/**
 * Applied as a delta from its own first keyframe, for the reason set out in
 * `speedUp.ts`: Figma reports this track in coordinates whose origin is not the
 * node's layout box, and taken raw it displaces the figure out of the icon.
 */
export const rigRoot: Track = {
  initial: { x: rootX.values[0], y: rootY.values[0] },
  animate: { x: rootX.values, y: rootY.values },
  transition: {
    x: { duration: rootX.duration, times: rootX.times, ease: 'linear', repeat: CYCLE_REPEATS, delay: rootX.delay },
    y: { duration: rootY.duration, times: rootY.times, ease: 'linear', repeat: CYCLE_REPEATS, delay: rootY.delay },
  },
}

const buildRig = (copy: 'A' | 'B'): RigTracks =>
  Object.fromEntries(
    (Object.keys(RIG_PIVOTS) as (keyof typeof RIG_PIVOTS)[]).map((k) => [
      k,
      joint(RIG_PIVOTS[k], RIG_VALUES[copy][k], sdTimes(RIG_TIMES_FOR[copy][k]), DURATION_S),
    ]),
  ) as RigTracks

export const rigA = buildRig('A')
export const rigB = buildRig('B')

// ---------------------------------------------------------------------------
// Pace readouts and pace-setter icon — 499:9449 / 9450 / 9451
// ---------------------------------------------------------------------------

export const paceCurrent: Track = {
  initial: { opacity: 1 },
  animate: { opacity: [1, 1, 0, 0] },
  transition: {
    opacity: {
      duration: DURATION_S,
      times: [0, 0.1267, 0.2166, 1],
      ease: ['linear', EASE_INOUT, 'linear'],
    },
  },
}

export const paceTarget: Track = {
  initial: { opacity: 0, x: 0 },
  animate: { opacity: [0, 0, 1, 1], x: [0, 0, -74.5, -74.5] },
  transition: {
    opacity: {
      duration: DURATION_S,
      times: [0, 0.8539, 0.9489, 1],
      ease: ['linear', EASE_SMOOTH, 'linear'],
    },
    x: { duration: DURATION_S, times: [0, 0.7852, 0.8796, 1], ease: 'linear' },
  },
}

export const paceSetterIcon: Track = {
  initial: { opacity: 1 },
  animate: { opacity: [1, 1, 0, 0, 1, 1] },
  transition: {
    opacity: {
      duration: DURATION_S,
      times: [0, 0.2227, 0.2794, 0.8151, 0.8727, 1],
      ease: ['linear', EASE_SMOOTH, 'linear', EASE_SMOOTH, 'linear'],
    },
  },
}

// ---------------------------------------------------------------------------
// Slow down STRIP — 499:9455 (chevron) and 499:9457 (glow sweep)
//
// The Arrow here has no `filter` track at all, so unlike Speed Up there is no
// uniform blur to leave off — its softness comes entirely from the asset.
// ---------------------------------------------------------------------------

export const arrow: Track = {
  initial: { y: 23 },
  animate: { y: [23, 0, 0] },
  transition: {
    y: { duration: DURATION_S, times: [0, 0.3281, 1], ease: [EASE_SMOOTH, 'linear'] },
  },
}

/**
 * Visibility envelope for the whole SpeedUpArrow group (499:9453).
 *
 * As in Speed Up, this is the alpha of the Arrow's `boxShadow` track — the
 * Arrow is a VECTOR whose colour is its inner shadow, so the shadow's alpha is
 * what makes the layer appear and disappear. Applied to the group rather than
 * the chevron alone so the glow ellipse, which the timeline also leaves
 * mid-sweep (here at y = -168.6), is cleared with it.
 */
export const strip: Track = {
  initial: { opacity: 0 },
  animate: { opacity: [0, 1, 1, 1, 0, 0] },
  transition: {
    opacity: {
      duration: DURATION_S,
      times: [0, 0.3281, 0.9051, 0.9052, 0.9995, 1],
      ease: [EASE_SMOOTH, 'linear', 'linear', EASE_SMOOTH, 'linear'],
    },
  },
}

export const ellipseGlow: Track = {
  initial: { y: 73.992 },
  animate: {
    y: [
      73.992, 73.992, 71.812, 9.759, -65.501, -121.246, -156.441, -176.948,
      -188.333, -194.451, -197.664, -199.322, -200.166, -200.591, -200.803,
      -200.908, -200.959, -200.962, -201.008, 73.991, 28.762, -48.511,
      -109.701, -149.444, -172.967, -186.157, -193.295, -197.062, -199.013,
      -200.009, -200.512, -200.764, -200.888, -200.95, -200.957, -200.962,
      73.992, 73.991, 46.382, -30.393, -96.839, -141.48, -168.379, -183.628,
      -191.943, -196.355, -198.649, -199.825, -200.419, -200.717, -200.865,
      -200.939, -200.962, 73.992, 73.991, 61.188, -11.428, -82.619, -132.454,
      -163.103, -180.694, -190.363, -195.524, -198.221, -199.606, -200.309,
      -200.662, -200.838, -200.925, -200.962, 73.992, 73.991, 71.203, 7.932,
      -67.041, -122.272, -157.056, -168.61,
    ],
  },
  transition: {
    y: {
      duration: DURATION_S,
      times: [
        0, 0.3279, 0.3319, 0.3556, 0.3793, 0.403, 0.4267, 0.4505, 0.4742,
        0.4979, 0.5216, 0.5453, 0.569, 0.5927, 0.6164, 0.6401, 0.6638, 0.6655,
        0.6656, 0.6657, 0.6875, 0.7112, 0.735, 0.7587, 0.7824, 0.8061, 0.8298,
        0.8535, 0.8772, 0.9009, 0.9246, 0.9483, 0.972, 0.9956, 0.9957, 0.9958,
        0.9959, 0.996, 0.9961, 0.9962, 0.9963, 0.9964, 0.9965, 0.9966, 0.9967,
        0.9968, 0.9969, 0.997, 0.9971, 0.9972, 0.9973, 0.9974, 0.9975, 0.9976,
        0.9977, 0.9978, 0.9979, 0.998, 0.9981, 0.9982, 0.9983, 0.9984, 0.9985,
        0.9986, 0.9987, 0.9988, 0.9989, 0.999, 0.9991, 0.9992, 0.9993, 0.9994,
        0.9995, 0.9996, 0.9997, 0.9998, 0.9999, 1,
      ],
      ease: 'linear',
    },
  },
}

/** Everything the scene needs for Slow Down. */
export const slowDown: ModeTracks = {
  durationS: DURATION_S,
  speedIndicator,
  speedIndicatorGlow,
  runnerIcon,
  rigRoot,
  rigA,
  rigB,
  paceCurrent,
  paceTarget,
  paceSetterIcon,
  arrow,
  ellipseGlow,
  strip,
}
