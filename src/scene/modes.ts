import { asset, sdArrowFillCyan } from '../assets/figma'
import type { ModeTracks } from '../motion/core'
import { slowDown } from '../motion/slowDown'
import { speedUp } from '../motion/speedUp'
import type { RigAssets } from './RunnerFigure'

/**
 * The two frames the prototype can show, each bundling its keyframe data with
 * the artwork and the handful of geometry values that differ between them.
 *
 * Slow Down (Figma 499:9370) is Speed Up (480:8550) in a cyan colourway with
 * the strip rotated so the chevron points down. Everything else — the pill, the
 * runner rig, the stage — is the same construction driven by different data.
 */

export type ModeId = 'speedUp' | 'slowDown'

export type Mode = {
  id: ModeId
  label: string
  tracks: ModeTracks
  /** The pace the readout slides to. */
  targetPace: string
  rigA: RigAssets
  rigB: RigAssets
  iconPaceA: string
  iconPaceB: string
  strip: {
    /** Slow Down wraps the strip in rotate(180deg) so the chevron points down. */
    rotated: boolean
    arrowMask: string
    arrowFill: string
    arrowFillInset: string
    ellipseMask: string
    ellipseMaskSize: string
    ellipseMaskPosition: string
    ellipseGlow: string
  }
}

const speedUpRigA: RigAssets = {
  upper1Vec: asset.n8564,
  mid1Vec: asset.n8567,
  end1: asset.n8569,
  upper2Vec: asset.n8573,
  end2: asset.n8575,
  torso: asset.n8577,
  head: asset.n8579,
  upper3Vec: asset.n8581,
  mid3Vec: asset.n8584,
  end3: asset.n8586,
  upper4Vec: asset.n8590,
  end4: asset.n8592,
}

const slowDownRigA: RigAssets = {
  upper1Vec: asset.sdN8564,
  mid1Vec: asset.sdN8567,
  end1: asset.sdN8569,
  upper2Vec: asset.sdN8573,
  end2: asset.sdN8575,
  torso: asset.sdN8577,
  head: asset.sdN8579,
  upper3Vec: asset.sdN8581,
  mid3Vec: asset.sdN8584,
  end3: asset.sdN8586,
  upper4Vec: asset.sdN8590,
  end4: asset.sdN8592,
}

export const MODES: Record<ModeId, Mode> = {
  speedUp: {
    id: 'speedUp',
    label: 'Speed up',
    tracks: speedUp,
    targetPace: '7’30”/km',
    rigA: speedUpRigA,
    rigB: { ...speedUpRigA, end1: asset.n8602, end2: asset.n8608, end3: asset.n8619, end4: asset.n8625 },
    iconPaceA: asset.iconPaceA,
    iconPaceB: asset.iconPaceB,
    strip: {
      rotated: false,
      arrowMask: asset.arrowMask,
      arrowFill: asset.arrowFill,
      arrowFillInset: '-0.67% -1.67% 6.74% -1.67%',
      ellipseMask: asset.ellipseMask,
      ellipseMaskSize: '248px 140.896px',
      ellipseMaskPosition: '-4px -0.999px',
      ellipseGlow: asset.ellipseGlow,
    },
  },
  slowDown: {
    id: 'slowDown',
    label: 'Slow down',
    tracks: slowDown,
    targetPace: '9’30”/km',
    rigA: slowDownRigA,
    rigB: { ...slowDownRigA, end1: asset.sdN8602, end2: asset.sdN8608, end3: asset.sdN8619, end4: asset.sdN8625 },
    // The pace-setter glyph is byte-identical across the two frames.
    iconPaceA: asset.iconPaceA,
    iconPaceB: asset.iconPaceB,
    strip: {
      rotated: true,
      arrowMask: asset.sdArrowMask,
      arrowFill: sdArrowFillCyan,
      arrowFillInset: '2% 0 9.4% 0',
      ellipseMask: asset.sdEllipseMask,
      ellipseMaskSize: '248px 140.896px',
      ellipseMaskPosition: '-4px 10.103px',
      ellipseGlow: asset.sdEllipseGlow,
    },
  },
}

/** Left swipe goes to Slow Down, right to Speed Up — fixed, never a toggle. */
export const MODE_FOR_DIRECTION: Record<'left' | 'right', ModeId> = {
  left: 'slowDown',
  right: 'speedUp',
}
