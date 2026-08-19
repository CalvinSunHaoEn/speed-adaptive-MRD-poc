/**
 * Keyframe data for Figma frame 480:8550 "Speed up Icon+STRIP META POC".
 *
 * Transcribed verbatim from the Figma MCP motion context (one timeline cohort,
 * 4.221s, 28 animated nodes) with a single deliberate change: Figma's
 * `repeat: Infinity` is dropped, because this prototype plays once per neural
 * band tap and holds its last frame.
 *
 * Track names carry their Figma node id so every value is traceable back to
 * the file.
 */

import type { Target, Transition, TargetAndTransition } from 'motion/react'

/** Figma cohort duration for 480:8550. */
export const DURATION_S = 4.221

export type Track = {
  initial: Target
  animate: TargetAndTransition
  transition: Transition
  /** Figma's rotation/scale pivot, applied by the component as CSS. */
  transformOrigin?: string
}

/** Motion props for a track, honouring the idle (pre-first-tap) state. */
export function anim(track: Track, playing: boolean) {
  return {
    initial: track.initial,
    animate: playing ? track.animate : track.initial,
    transition: playing ? track.transition : { duration: 0 },
  }
}

const EASE_INOUT = [0.25, 0.1, 0.25, 1] as const
const EASE_SMOOTH = [0.5, 0, 0.5, 1] as const

const GLOW_WHITE =
  '0px 0px 4px 0px #FFF inset, 0px 0px 12px 0px rgba(255, 255, 255, 0.5) inset'
/*
 * The red glow is red over exactly the window where the pill sits at 2x, and a
 * CSS transform scales a box-shadow's blur along with everything else. Halving
 * the designed 4px/12px blurs makes them render at their designed size once
 * scaled, matching the tight ring Figma draws instead of a doubled, diffuse one.
 */
const GLOW_RED = '0px 0px 2px 0px #F00 inset, 0px 0px 6px 0px #F00 inset'

// ---------------------------------------------------------------------------
// Shared `times` arrays for the runner rig. Figma emits per-joint arrays that
// differ from one another in the fourth decimal; they are kept distinct rather
// than rounded together.
// ---------------------------------------------------------------------------

// 480:8561 (rig root translation)
const T_ROOT = [
  0, 0.1555, 0.1616, 0.1658, 0.1677, 0.1738, 0.1799, 0.186, 0.1895, 0.1921,
  0.1982, 0.2043, 0.2104, 0.2132, 0.2164, 0.2225, 0.2286, 0.2347, 0.2369,
  0.2408, 0.2469, 0.253, 0.2591, 0.2606, 0.2652, 0.2713, 0.2774, 0.2835,
  0.2843, 0.2899, 0.296, 0.3021, 1,
]

// 480:8563 / 8572 / 8583 / 8586
const T_B = [
  0, 0.1564, 0.1625, 0.1658, 0.1686, 0.1747, 0.1808, 0.1869, 0.1895, 0.193,
  0.1991, 0.2052, 0.2113, 0.2132, 0.2173, 0.2234, 0.2295, 0.2356, 0.2369,
  0.2417, 0.2478, 0.2539, 0.26, 0.2606, 0.2661, 0.2722, 0.2783, 0.2843,
  0.2844, 0.2905, 0.2966, 0.3027, 1,
]

// 480:8566 / 8569 / 8575
const T_C = [
  0, 0.1573, 0.1634, 0.1658, 0.1695, 0.1756, 0.1817, 0.1878, 0.1895, 0.1939,
  0.1999, 0.206, 0.2121, 0.2132, 0.2182, 0.2243, 0.2304, 0.2365, 0.2369,
  0.2426, 0.2487, 0.2548, 0.2606, 0.2609, 0.267, 0.2731, 0.2792, 0.2843,
  0.2853, 0.2914, 0.2975, 0.3036, 1,
]

// 480:8580 / 8589 / 8596 / 8599 / 8602 / 8605 / 8608 / 8619
const T_D = [
  0, 0.1555, 0.1616, 0.1658, 0.1677, 0.1738, 0.1799, 0.186, 0.1895, 0.1921,
  0.1982, 0.2043, 0.2104, 0.2132, 0.2165, 0.2225, 0.2286, 0.2347, 0.2369,
  0.2408, 0.2469, 0.253, 0.2591, 0.2606, 0.2652, 0.2713, 0.2774, 0.2835,
  0.2843, 0.2896, 0.2957, 0.3018, 1,
]

// 480:8592
const T_E = [
  0, 0.1564, 0.1625, 0.1658, 0.1686, 0.1747, 0.1808, 0.1869, 0.1895, 0.193,
  0.199, 0.2051, 0.2112, 0.2132, 0.2173, 0.2234, 0.2295, 0.2356, 0.2369,
  0.2417, 0.2478, 0.2539, 0.26, 0.2606, 0.2661, 0.2722, 0.2783, 0.2843,
  0.2844, 0.2905, 0.2966, 0.3027, 1,
]

// 480:8613 / 8616 / 8622 / 8625
const T_F = [
  0, 0.1555, 0.1616, 0.1658, 0.1677, 0.1738, 0.1799, 0.186, 0.1895, 0.1921,
  0.1982, 0.2043, 0.2104, 0.2132, 0.2164, 0.2225, 0.2286, 0.2347, 0.2369,
  0.2408, 0.2469, 0.253, 0.2591, 0.2606, 0.2652, 0.2713, 0.2774, 0.2835,
  0.2843, 0.2888, 0.2949, 0.301, 1,
]

/**
 * The rig's exported keyframes are one run cycle packed into a dense window
 * (about t=0.156..0.303), padded by a hold at t=0 and another at t=1. Read
 * literally that makes the figure run for 0.62s and then freeze — and since the
 * runner only fades in at 1.18s, just 0.10s of its 2.40s on screen would show
 * any movement at all. Figma runs it continuously the whole time it is visible:
 * the export captures a single iteration of a nested looping animation, and the
 * window is seamless (its first and last values are identical), so it is meant
 * to repeat.
 *
 * `cycle` drops the two padding holds and rescales the window into a standalone
 * ~0.62s loop. It repeats enough times to outlast the 4.221s timeline and then
 * stops, so nothing keeps animating under an invisible layer.
 */
const CYCLE_REPEATS = 6

function cycle(values: number[], times: number[]) {
  const first = 1
  const last = times.length - 2
  const span = times[last] - times[first]
  return {
    values: values.slice(first, last + 1),
    times: times.slice(first, last + 1).map((t) => (t - times[first]) / span),
    duration: span * DURATION_S,
    // Hold the rest pose until the point in the timeline where Figma starts the
    // cycle, so the strides land on the same beat as the source.
    delay: times[first] * DURATION_S,
  }
}

/** A joint of the runner rig: a looping linear `rotate` cycle about a pivot. */
function joint(transformOrigin: string, values: number[], times: number[]): Track {
  const c = cycle(values, times)
  return {
    transformOrigin,
    initial: { rotate: c.values[0] },
    animate: { rotate: c.values },
    transition: {
      rotate: {
        duration: c.duration,
        times: c.times,
        ease: 'linear',
        repeat: CYCLE_REPEATS,
        delay: c.delay,
      },
    },
  }
}

// ---------------------------------------------------------------------------
// Speed Indicator pill — 480:8558
// ---------------------------------------------------------------------------

/** Pill geometry: width / position / scale. Pivot is the pill's top centre. */
export const speedIndicator: Track = {
  transformOrigin: '50% 0%',
  initial: { scaleX: 1, scaleY: 1, width: 127, x: 0, borderRadius: 24 },
  animate: {
    scaleX: [1, 1, 2, 2, 1, 1],
    scaleY: [1, 1, 2, 2, 1, 1],
    width: [127, 127, 48, 48, 127, 127],
    x: [0, 0, 39, 39, 0, 0],
    // Figma keeps the 24px corner radius constant while the pill scales, so the
    // open state reads as a rounded square. A CSS transform scales the radius
    // with everything else, which turns the 48x48 box into a circle at 2x, so
    // the radius is counter-scaled to hold its rendered size at 24.
    borderRadius: [24, 24, 12, 12, 24, 24],
  },
  transition: {
    scaleX: {
      duration: DURATION_S,
      times: [0, 0.2362, 0.3471, 0.8143, 0.8865, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    scaleY: {
      duration: DURATION_S,
      times: [0, 0.2362, 0.3471, 0.8143, 0.8865, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    width: {
      duration: DURATION_S,
      times: [0, 0.1266, 0.2164, 0.9045, 0.9988, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    x: {
      duration: DURATION_S,
      times: [0, 0.1266, 0.2164, 0.9045, 0.9988, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    borderRadius: {
      duration: DURATION_S,
      times: [0, 0.2362, 0.3471, 0.8143, 0.8865, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
  },
}

/**
 * Pill inset glow, white -> red. Figma keys this on the same node as the
 * geometry above; it lives on the overlay element so it paints over the pill's
 * contents the way it does on the Figma canvas.
 */
export const speedIndicatorGlow: Track = {
  initial: { boxShadow: GLOW_WHITE },
  animate: {
    boxShadow: [
      GLOW_WHITE,
      GLOW_WHITE,
      GLOW_WHITE,
      GLOW_RED,
      GLOW_RED,
      GLOW_RED,
      GLOW_WHITE,
      GLOW_WHITE,
    ],
  },
  transition: {
    boxShadow: {
      duration: DURATION_S,
      times: [0, 0.2359, 0.236, 0.3471, 0.8137, 0.8138, 0.8849, 1],
      ease: ['linear', 'linear', EASE_INOUT, 'linear', 'linear', EASE_INOUT, 'linear'],
    },
  },
}

// ---------------------------------------------------------------------------
// Runner icon — 480:8559 (fades and scales the whole rig in and out)
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
      times: [0, 0.2234, 0.2801, 0.8482, 0.8962, 1],
      ease: ['linear', EASE_SMOOTH, 'linear', EASE_SMOOTH, 'linear'],
    },
    scaleX: {
      duration: DURATION_S,
      times: [0, 0.2368, 0.3469, 0.8168, 0.8867, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
    scaleY: {
      duration: DURATION_S,
      times: [0, 0.2368, 0.3469, 0.8168, 0.8867, 1],
      ease: ['linear', EASE_INOUT, 'linear', EASE_INOUT, 'linear'],
    },
  },
}

// ---------------------------------------------------------------------------
// Rig root — 480:8561
//
// These are real CSS translates and are applied as given. The figure's box is
// 6 x 18.945 at (0.75, -6.973) inside the 18 x 18 icon, so the translate lands
// it at (9.27, 0.229) — box centre (12.27, 9.70) in icon coordinates.
//
// Measured against a frame export of the Figma timeline, the figure's centroid
// while the pill is open sits at (11.07, 9.71) in those same coordinates: the
// vertical agreement is exact, and the horizontal difference is just the
// figure's mass sitting left of its box centre.
//
// An earlier version subtracted the first keyframe from this track, on the
// reasoning that a translate of +8.52 across an 18px icon looked like a
// coordinate-space mismatch. That was wrong, and only the static canvas render
// was available to check it against — which cannot tell the two apart because
// the runner is transparent at t=0. Untranslated, the figure's head sits at
// y -6.97..-2.83 and is clipped away entirely, leaving the mid-body fragment
// visible in the deployed build.
// ---------------------------------------------------------------------------

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

const rootX = cycle(ROOT_X, T_ROOT)
const rootY = cycle(ROOT_Y, T_ROOT)

export const rigRoot: Track = {
  initial: { x: rootX.values[0], y: rootY.values[0] },
  animate: { x: rootX.values, y: rootY.values },
  transition: {
    x: { duration: rootX.duration, times: rootX.times, ease: 'linear', repeat: CYCLE_REPEATS, delay: rootX.delay },
    y: { duration: rootY.duration, times: rootY.times, ease: 'linear', repeat: CYCLE_REPEATS, delay: rootY.delay },
  },
}

// ---------------------------------------------------------------------------
// Runner rig joints.
//
// The figure is duplicated in Figma: copy A (480:8562-8592) and copy B
// (480:8595-8625) share identical geometry and differ only in phase, so one
// component renders both from these two track sets.
// ---------------------------------------------------------------------------

export type RigTracks = {
  upper1: Track
  mid1: Track
  end1: Track
  upper2: Track
  end2: Track
  upper3: Track
  mid3: Track
  end3: Track
  upper4: Track
  end4: Track
}

/** Copy A — Figma nodes 480:8563 / 8566 / 8569 / 8572 / 8575 / 8580 / 8583 / 8586 / 8589 / 8592. */
export const rigA: RigTracks = {
  upper1: joint('50% 10.032%', [
    -4, -4, -14.73, -19.64, -23.67, -29.94, -33.66, -35.47, -35.701, -36,
    -35.47, -33.66, -29.94, -27.918, -23.67, -14.73, -4, 6.73, 8.599, 15.67,
    21.94, 25.66, 27.47, 27.521, 28, 27.47, 25.66, 22.005, 21.94, 15.67, 6.73,
    -4, -4,
  ], T_B),
  mid1: joint('50% 15.196%', [
    63.87, 63.87, 58.91, 56.178, 52.15, 45.03, 38.6, 33.16, 31.802, 28.49,
    24.16, 19.92, 15.92, 15.388, 12.92, 12.05, 14.13, 19.09, 19.523, 25.85,
    32.97, 39.4, 44.572, 44.84, 49.51, 53.84, 58.08, 61.43, 62.08, 65.08,
    65.95, 63.87, 63.87,
  ], T_C),
  end1: joint('50% 27.723%', [
    -70, -70, -74.69, -76.274, -78.61, -81.35, -82.97, -83.77, -83.837, -84,
    -83.77, -82.97, -81.35, -80.864, -78.61, -74.69, -70, -65.31, -65.059,
    -61.39, -58.65, -57.03, -56.269, -56.23, -56, -56.23, -57.03, -58.387,
    -58.65, -61.39, -65.31, -70, -70,
  ], T_C),
  upper2: joint('50% 13.208%', [
    30, 30, 21.96, 18.269, 15.24, 10.54, 7.76, 6.4, 6.226, 6, 6.4, 7.76,
    10.54, 12.056, 15.24, 21.96, 30, 38.04, 39.445, 44.76, 49.46, 52.24, 53.6,
    53.638, 54, 53.6, 52.24, 49.509, 49.46, 44.76, 38.04, 30, 30,
  ], T_B),
  end2: joint('50% 20.896%', [
    -79.17, -79.17, -76.52, -76.342, -76.08, -77.39, -79.66, -82.33, -83.162,
    -85.19, -88.41, -92.31, -97.09, -98.073, -102.63, -108.23, -112.83,
    -115.48, -115.508, -115.92, -114.61, -112.34, -109.801, -109.67, -106.81,
    -103.59, -99.69, -95.687, -94.91, -89.37, -83.77, -79.17, -79.17,
  ], T_C),
  upper3: joint('50% 10.032%', [
    -4, -4, 6.73, 12.959, 15.67, 21.94, 25.66, 27.47, 27.779, 28, 27.47,
    25.66, 21.94, 18.993, 15.67, 6.73, -4, -14.73, -17.919, -23.67, -29.94,
    -33.66, -35.47, -35.599, -36, -35.47, -33.66, -29.94, -29.125, -23.67,
    -14.73, -4, -4,
  ], T_D),
  mid3: joint('50% 15.196%', [
    14.13, 14.13, 19.09, 22.803, 25.85, 32.97, 39.4, 44.84, 46.876, 49.51,
    53.84, 58.08, 62.08, 63.047, 65.08, 65.95, 63.87, 58.91, 57.497, 52.15,
    45.03, 38.6, 33.16, 32.712, 28.49, 24.16, 19.92, 15.99, 15.92, 12.92,
    12.05, 14.13, 14.13,
  ], T_B),
  end3: joint('50% 27.723%', [
    -70, -70, -65.31, -63.157, -61.39, -58.65, -57.03, -56.23, -56.13, -56,
    -56.23, -57.03, -58.65, -59.534, -61.39, -65.31, -70, -74.69, -75.51,
    -78.61, -81.35, -82.97, -83.77, -83.792, -84, -83.77, -82.97, -81.378,
    -81.35, -78.61, -74.69, -70, -70,
  ], T_B),
  upper4: joint('50% 13.208%', [
    30, 30, 38.04, 42.722, 44.76, 49.46, 52.24, 53.6, 53.833, 54, 53.6, 52.24,
    49.46, 47.251, 44.76, 38.04, 30, 21.96, 19.563, 15.24, 10.54, 7.76, 6.4,
    6.303, 6, 6.4, 7.76, 10.54, 11.151, 15.24, 21.96, 30, 30,
  ], T_D),
  end4: joint('50% 20.896%', [
    -112.83, -112.83, -115.48, -115.723, -115.92, -114.61, -112.34, -109.67,
    -108.416, -106.81, -103.59, -99.69, -94.91, -93.11, -89.37, -83.77,
    -79.17, -76.52, -76.427, -76.08, -77.39, -79.66, -82.33, -82.611, -85.19,
    -88.41, -92.31, -97.018, -97.09, -102.63, -108.23, -112.83, -112.83,
  ], T_E),
}

/** Copy B — Figma nodes 480:8596 / 8599 / 8602 / 8605 / 8608 / 8613 / 8616 / 8619 / 8622 / 8625. */
export const rigB: RigTracks = {
  upper1: joint('50% 10.032%', [
    -4, -4, -14.73, -20.959, -23.67, -29.94, -33.66, -35.47, -35.779, -36,
    -35.47, -33.66, -29.94, -26.993, -23.67, -14.73, -4, 6.73, 9.919, 15.67,
    21.94, 25.66, 27.47, 27.599, 28, 27.47, 25.66, 21.94, 21.125, 15.67, 6.73,
    -4, -4,
  ], T_D),
  mid1: joint('50% 15.196%', [
    63.87, 63.87, 58.91, 54.2, 52.15, 45.03, 38.6, 33.16, 30.436, 28.49,
    24.16, 19.92, 15.92, 14.51, 12.92, 12.05, 14.13, 19.09, 21.501, 25.85,
    32.97, 39.4, 44.84, 45.977, 49.51, 53.84, 58.08, 62.08, 62.47, 65.08,
    65.95, 63.87, 63.87,
  ], T_D),
  end1: joint('50% 27.723%', [
    -70, -70, -74.69, -77.421, -78.61, -81.35, -82.97, -83.77, -83.904, -84,
    -83.77, -82.97, -81.35, -80.062, -78.61, -74.69, -70, -65.31, -63.912,
    -61.39, -58.65, -57.03, -56.23, -56.174, -56, -56.23, -57.03, -58.65,
    -59.006, -61.39, -65.31, -70, -70,
  ], T_D),
  upper2: joint('50% 13.208%', [
    30, 30, 21.96, 17.278, 15.24, 10.54, 7.76, 6.4, 6.167, 6, 6.4, 7.76,
    10.54, 12.749, 15.24, 21.96, 30, 38.04, 40.437, 44.76, 49.46, 52.24, 53.6,
    53.697, 54, 53.6, 52.24, 49.46, 48.849, 44.76, 38.04, 30, 30,
  ], T_D),
  end2: joint('50% 20.896%', [
    -79.17, -79.17, -76.52, -76.213, -76.08, -77.39, -79.66, -82.33, -83.999,
    -85.19, -88.41, -92.31, -97.09, -99.694, -102.63, -108.23, -112.83,
    -115.48, -115.637, -115.92, -114.61, -112.34, -109.67, -108.974, -106.81,
    -103.59, -99.69, -94.91, -94.19, -89.37, -83.77, -79.17, -79.17,
  ], T_D),
  upper3: joint('50% 10.032%', [
    -4, -4, 6.73, 12.96, 15.67, 21.94, 25.66, 27.47, 27.779, 28, 27.47, 25.66,
    21.94, 18.992, 15.67, 6.73, -4, -14.73, -17.92, -23.67, -29.94, -33.66,
    -35.47, -35.599, -36, -35.47, -33.66, -29.94, -29.005, -23.67, -14.73, -4,
    -4,
  ], T_F),
  mid3: joint('50% 15.196%', [
    14.13, 14.13, 19.09, 23.801, 25.85, 32.97, 39.4, 44.84, 47.565, 49.51,
    53.84, 58.08, 62.08, 63.49, 65.08, 65.95, 63.87, 58.91, 56.498, 52.15,
    45.03, 38.6, 33.16, 32.023, 28.49, 24.16, 19.92, 15.92, 15.473, 12.92,
    12.05, 14.13, 14.13,
  ], T_F),
  end3: joint('50% 27.723%', [
    -70, -70, -65.31, -62.579, -61.39, -58.65, -57.03, -56.23, -56.096, -56,
    -56.23, -57.03, -58.65, -59.938, -61.39, -65.31, -70, -74.69, -76.088,
    -78.61, -81.35, -82.97, -83.77, -83.826, -84, -83.77, -82.97, -81.35,
    -80.994, -78.61, -74.69, -70, -70,
  ], T_D),
  upper4: joint('50% 13.208%', [
    30, 30, 38.04, 42.723, 44.76, 49.46, 52.24, 53.6, 53.833, 54, 53.6, 52.24,
    49.46, 47.25, 44.76, 38.04, 30, 21.96, 19.562, 15.24, 10.54, 7.76, 6.4,
    6.303, 6, 6.4, 7.76, 10.54, 11.152, 15.24, 21.96, 30, 30,
  ], T_F),
  end4: joint('50% 20.896%', [
    -112.83, -112.83, -115.48, -115.787, -115.92, -114.61, -112.34, -109.67,
    -108.001, -106.81, -103.59, -99.69, -94.91, -92.305, -89.37, -83.77,
    -79.17, -76.52, -76.363, -76.08, -77.39, -79.66, -82.33, -83.027, -85.19,
    -88.41, -92.31, -97.09, -97.811, -102.63, -108.23, -112.83, -112.83,
  ], T_F),
}

// ---------------------------------------------------------------------------
// Pace readouts and pace-setter icon — 480:8627 / 8628 / 8629
// ---------------------------------------------------------------------------

/** "8'10"/km" — the current pace, fades out as the target pace arrives. */
export const paceCurrent: Track = {
  initial: { opacity: 1 },
  animate: { opacity: [1, 1, 0, 0] },
  transition: {
    opacity: {
      duration: DURATION_S,
      times: [0, 0.1266, 0.2164, 1],
      ease: ['linear', EASE_INOUT, 'linear'],
    },
  },
}

/** "7'30"/km" — the target pace, slides left into the vacated slot. */
export const paceTarget: Track = {
  initial: { opacity: 0, x: 0 },
  animate: { opacity: [0, 0, 1, 1], x: [0, 0, -74.5, -74.5] },
  transition: {
    opacity: {
      duration: DURATION_S,
      times: [0, 0.8533, 0.9483, 1],
      ease: ['linear', EASE_SMOOTH, 'linear'],
    },
    x: {
      duration: DURATION_S,
      times: [0, 0.7846, 0.8789, 1],
      ease: 'linear',
    },
  },
}

/** ic_exercise_pace_setter — cross-fades against the animated runner. */
export const paceSetterIcon: Track = {
  initial: { opacity: 1 },
  animate: { opacity: [1, 1, 0, 0, 1, 1] },
  transition: {
    opacity: {
      duration: DURATION_S,
      times: [0, 0.2225, 0.2792, 0.8473, 0.8953, 1],
      ease: ['linear', EASE_SMOOTH, 'linear', EASE_SMOOTH, 'linear'],
    },
  },
}

// ---------------------------------------------------------------------------
// Speed up STRIP — 480:8633 (chevron) and 480:8635 (glow sweep)
// ---------------------------------------------------------------------------

/**
 * The chevron rises, softens, and lights up red.
 *
 * Figma emits the `filter` track with two trailing times beyond the end of the
 * timeline (1.7886 / 1.7887); both keyframes repeat the value already reached
 * at 0.3277, so they are folded into a single hold at 1.
 */
/**
 * Chevron rise and layer blur. These ride the unmasked outer element: CSS
 * applies `filter` before masking, so blurring the masked element itself would
 * let the mask's box clip the blur into a hard rectangle. Figma blurs the shape
 * after forming it, which is what the outer/inner split reproduces.
 */
export const arrow: Track = {
  initial: { y: 23, filter: 'blur(0px)', opacity: 0 },
  animate: {
    y: [23, 0, 0],
    filter: ['blur(0px)', 'blur(10px)', 'blur(10px)'],
    opacity: [0, 1, 1, 1, 0, 0],
  },
  transition: {
    y: {
      duration: DURATION_S,
      times: [0, 0.3279, 1],
      ease: [EASE_SMOOTH, 'linear'],
    },
    filter: {
      duration: DURATION_S,
      times: [0, 0.3277, 1],
      ease: [EASE_SMOOTH, 'linear'],
    },
    // Figma's Arrow is a vector whose red IS its inner shadow, so the shadow's
    // alpha doubles as the layer's visibility envelope — see the note above.
    opacity: {
      duration: DURATION_S,
      times: [0, 0.3277, 0.9044, 0.9045, 0.9985, 1],
      ease: [EASE_SMOOTH, 'linear', 'linear', EASE_SMOOTH, 'linear'],
    },
  },
}

/*
 * On the Arrow's `boxShadow` track.
 *
 * Figma's Arrow is a VECTOR whose red comes from an inner-shadow effect, which
 * the reference translates to `box-shadow: … inset`. Applied literally that
 * floods the layer: the chevron's mask is not a chevron but a full-box
 * radial-gradient vignette, so a box-level inset shadow fills the whole
 * 240 x 150 rectangle instead of hugging the shape.
 *
 * Its alpha, however, is the arrow's visibility envelope — transparent at t=0,
 * red across the middle, transparent again by the end. Sampling mean red over
 * the strip in a frame export of the Figma timeline confirms it: 2 at t=0,
 * rising to a plateau of 23 by ~1.2s, back to 1 at t=4.2s, with the ramps
 * landing exactly on this track's times. So the alpha is carried as `opacity`
 * on the arrow layer, and the shadow's colour is left to the gradient fill.
 *
 * The earlier version of this note claimed the effect was "effectively
 * invisible" and dropped it outright. That was measured against Figma's static
 * canvas render, which happens to sit at a moment where the shadow is off — the
 * same trap that hid the runner bug. A static render cannot decide a track that
 * exists to vary over time.
 */

/** The glow ellipse sweeping up behind the chevron, five passes. */
export const ellipseGlow: Track = {
  initial: { y: 73.992 },
  animate: {
    y: [
      73.992, 73.992, 71.787, 9.219, -66.349, -122.07, -157.09, -177.402,
      -188.627, -194.632, -197.771, -199.383, -200.2, -200.609, -200.813,
      -200.913, -200.962, -201.008, 73.991, 73.988, 21.957, -55.235, -114.604,
      -152.602, -174.866, -187.249, -193.904, -197.394, -199.191, -200.103,
      -200.561, -200.789, -200.901, -200.956, -200.962, 73.992, 73.991,
      71.482, 34.274, -43.588, -106.568, -147.705, -172.076, -185.725,
      -193.095, -196.974, -198.976, -199.995, -200.507, -200.762, -200.888,
      -200.95, -200.962, 73.992, 73.991, 45.821, -31.468, -97.942, -142.371,
      -169.011, -184.042, -192.198, -196.506, -198.737, -199.874, -200.446,
      -200.732, -200.873, -200.943, -200.962, 73.992, 73.991, 56.161, -18.962,
      -88.717, -136.573, -165.647, -175.125,
    ],
  },
  transition: {
    y: {
      duration: DURATION_S,
      times: [
        0, 0.3277, 0.3317, 0.3554, 0.3791, 0.4027, 0.4264, 0.4501, 0.4738,
        0.4975, 0.5212, 0.5449, 0.5686, 0.5923, 0.616, 0.6397, 0.6631, 0.6632,
        0.6633, 0.6634, 0.687, 0.7107, 0.7344, 0.7581, 0.7818, 0.8055, 0.8292,
        0.8529, 0.8766, 0.9003, 0.924, 0.9476, 0.9713, 0.995, 0.9957, 0.9958,
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
