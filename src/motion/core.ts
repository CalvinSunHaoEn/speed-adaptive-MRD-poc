/**
 * Machinery shared by both mode timelines.
 *
 * The Speed Up and Slow Down frames are the same animation in two colourways,
 * so everything structural lives here and each mode contributes only its
 * keyframe values. See `speedUp.ts` and `slowDown.ts`.
 */

import type { Target, Transition, TargetAndTransition } from 'motion/react'

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

export const EASE_INOUT = [0.25, 0.1, 0.25, 1] as const
export const EASE_SMOOTH = [0.5, 0, 0.5, 1] as const

/**
 * The rig's exported keyframes are one run cycle packed into a dense window,
 * padded by a hold at t=0 and another at t=1. Read literally the figure runs
 * for a fraction of a second and then freezes — and since it only fades in
 * partway through, almost none of its time on screen would show movement.
 * Figma runs it continuously the whole time it is visible: the export captures
 * a single iteration of a nested looping animation, and the window is seamless
 * (its first and last values are identical), so it is meant to repeat.
 *
 * `cycle` drops the two padding holds and rescales the window into a standalone
 * loop, repeated enough times to outlast the timeline and then stopped, so
 * nothing keeps animating under an invisible layer.
 */
export const CYCLE_REPEATS = 6

export function cycle(
  values: readonly number[],
  times: readonly number[],
  durationS: number,
) {
  const first = 1
  const last = times.length - 2
  const span = times[last] - times[first]
  return {
    values: values.slice(first, last + 1),
    times: times.slice(first, last + 1).map((t) => (t - times[first]) / span),
    duration: span * durationS,
    // Hold the rest pose until the point in the timeline where Figma starts the
    // cycle, so the strides land on the same beat as the source.
    delay: times[first] * durationS,
  }
}

/** A joint of the runner rig: a looping linear `rotate` cycle about a pivot. */
export function joint(
  transformOrigin: string,
  values: readonly number[],
  times: readonly number[],
  durationS: number,
): Track {
  const c = cycle(values, times, durationS)
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

/** Every track one mode's scene needs. */
export type ModeTracks = {
  durationS: number
  speedIndicator: Track
  speedIndicatorGlow: Track
  runnerIcon: Track
  rigRoot: Track
  rigA: RigTracks
  rigB: RigTracks
  paceCurrent: Track
  paceTarget: Track
  paceSetterIcon: Track
  arrow: Track
  ellipseGlow: Track
  strip: Track
}
