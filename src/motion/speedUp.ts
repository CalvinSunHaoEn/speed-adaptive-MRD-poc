/**
 * Speed Up — keyframe data for Figma frame 480:8550
 * "Speed up Icon+STRIP META POC".
 *
 * Transcribed verbatim from the Figma MCP motion context (one timeline cohort,
 * 4.221s, 28 animated nodes) with one deliberate change: Figma's
 * `repeat: Infinity` is dropped, because this prototype plays once per neural
 * band tap and holds its last frame.
 *
 * Track names carry their Figma node id so every value is traceable back to
 * the file. Shared helpers live in `core.ts`.
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
import { RIG_PIVOTS, RIG_VALUES } from './rig'

const DURATION_S = 4.221

const GLOW_WHITE =
  '0px 0px 4px 0px #FFF inset, 0px 0px 12px 0px rgba(255, 255, 255, 0.5) inset'
/*
 * The red glow is red over exactly the window where the pill sits at 2x, and a
 * CSS transform scales a box-shadow's blur along with everything else. Halving
 * the designed 4px/12px blurs makes them render at their designed size once
 * scaled, matching the tight ring Figma draws instead of a doubled, diffuse one.
 */
const GLOW_RED = '0px 0px 2px 0px #F00 inset, 0px 0px 6px 0px #F00 inset'

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

const rootX = cycle(ROOT_X, T_ROOT, DURATION_S)
const rootY = cycle(ROOT_Y, T_ROOT, DURATION_S)

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

/** Copy A — Figma nodes 480:8563 / 8566 / 8569 / 8572 / 8575 / 8580 / 8583 / 8586 / 8589 / 8592. */
export const rigA: RigTracks = {
  upper1: joint(RIG_PIVOTS.upper1, RIG_VALUES.A.upper1, T_B, DURATION_S),
  mid1: joint(RIG_PIVOTS.mid1, RIG_VALUES.A.mid1, T_C, DURATION_S),
  end1: joint(RIG_PIVOTS.end1, RIG_VALUES.A.end1, T_C, DURATION_S),
  upper2: joint(RIG_PIVOTS.upper2, RIG_VALUES.A.upper2, T_B, DURATION_S),
  end2: joint(RIG_PIVOTS.end2, RIG_VALUES.A.end2, T_C, DURATION_S),
  upper3: joint(RIG_PIVOTS.upper3, RIG_VALUES.A.upper3, T_D, DURATION_S),
  mid3: joint(RIG_PIVOTS.mid3, RIG_VALUES.A.mid3, T_B, DURATION_S),
  end3: joint(RIG_PIVOTS.end3, RIG_VALUES.A.end3, T_B, DURATION_S),
  upper4: joint(RIG_PIVOTS.upper4, RIG_VALUES.A.upper4, T_D, DURATION_S),
  end4: joint(RIG_PIVOTS.end4, RIG_VALUES.A.end4, T_E, DURATION_S),
}

/** Copy B — Figma nodes 480:8596 / 8599 / 8602 / 8605 / 8608 / 8613 / 8616 / 8619 / 8622 / 8625. */
export const rigB: RigTracks = {
  upper1: joint(RIG_PIVOTS.upper1, RIG_VALUES.B.upper1, T_D, DURATION_S),
  mid1: joint(RIG_PIVOTS.mid1, RIG_VALUES.B.mid1, T_D, DURATION_S),
  end1: joint(RIG_PIVOTS.end1, RIG_VALUES.B.end1, T_D, DURATION_S),
  upper2: joint(RIG_PIVOTS.upper2, RIG_VALUES.B.upper2, T_D, DURATION_S),
  end2: joint(RIG_PIVOTS.end2, RIG_VALUES.B.end2, T_D, DURATION_S),
  upper3: joint(RIG_PIVOTS.upper3, RIG_VALUES.B.upper3, T_F, DURATION_S),
  mid3: joint(RIG_PIVOTS.mid3, RIG_VALUES.B.mid3, T_F, DURATION_S),
  end3: joint(RIG_PIVOTS.end3, RIG_VALUES.B.end3, T_D, DURATION_S),
  upper4: joint(RIG_PIVOTS.upper4, RIG_VALUES.B.upper4, T_F, DURATION_S),
  end4: joint(RIG_PIVOTS.end4, RIG_VALUES.B.end4, T_F, DURATION_S),
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
  initial: { y: 23 },
  animate: { y: [23, 0, 0] },
  transition: {
    y: {
      duration: DURATION_S,
      times: [0, 0.3279, 1],
      ease: [EASE_SMOOTH, 'linear'],
    },
  },
}

/**
 * Visibility envelope for the whole SpeedUpArrow group (480:8631) — chevron and
 * glow ellipse together.
 *
 * The curve is the alpha of the Arrow's `boxShadow` track, which is what makes
 * the arrow appear and disappear (see the note above). It is applied to the
 * group rather than the chevron alone because the ellipse needs it too: the
 * timeline leaves the ellipse mid-sweep at y = -175, still poking into the top
 * of the mask. Figma loops straight back to t=0 and never dwells there, but
 * this prototype holds its last frame, so that sliver would sit on screen
 * indefinitely — measured at 60 max red against Figma's 0.
 */
export const strip: Track = {
  initial: { opacity: 0 },
  animate: { opacity: [0, 1, 1, 1, 0, 0] },
  transition: {
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

/** Everything the scene needs for Speed Up. */
export const speedUp: ModeTracks = {
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
