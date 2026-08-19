import { motion } from 'motion/react'
import type { CSSProperties, ReactNode } from 'react'
import { anim, type RigTracks, type Track } from '../motion/timeline'

/**
 * One copy of the runner figure from `pacing-run 2` (480:8559).
 *
 * Coordinates are the 6 x 18.945452px box of Figma node 480:8560. The percentage
 * insets come straight from the Figma reference output; the rotating wrapper
 * frames that the reference flattens away (480:8566, 8569, 8572, 8575, 8583,
 * 8586, 8589, 8592 and their copy-B twins) are reinstated here as full-bleed
 * `Joint`s so their keyframed rotation has something to act on.
 */

export type RigAssets = {
  /** 480:8564 / 8597 */ upper1Vec: string
  /** 480:8567 / 8600 */ mid1Vec: string
  /** 480:8569 / 8602 */ end1: string
  /** 480:8573 / 8606 */ upper2Vec: string
  /** 480:8575 / 8608 */ end2: string
  /** 480:8577 / 8610 */ torso: string
  /** 480:8579 / 8612 */ head: string
  /** 480:8581 / 8614 */ upper3Vec: string
  /** 480:8584 / 8617 */ mid3Vec: string
  /** 480:8586 / 8619 */ end3: string
  /** 480:8590 / 8623 */ upper4Vec: string
  /** 480:8592 / 8625 */ end4: string
}

const fill: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  maxWidth: 'none',
  display: 'block',
}

/** A static Figma frame: a positioned box, nothing more. */
function Box({ inset, children }: { inset: string; children: ReactNode }) {
  return <div style={{ position: 'absolute', inset }}>{children}</div>
}

/** A Figma vector exported as SVG, drawn at its designed box. */
function Leaf({ inset, src }: { inset: string; src: string }) {
  return (
    <div style={{ position: 'absolute', inset }}>
      <img alt="" src={src} style={fill} />
    </div>
  )
}

/** A rotating rig wrapper. Defaults to full-bleed, which is how Figma stores them. */
function Joint({
  name,
  track,
  playing,
  inset = 0,
  children,
}: {
  name: string
  track: Track
  playing: boolean
  inset?: string | number
  children: ReactNode
}) {
  return (
    <motion.div
      data-joint={name}
      style={{ position: 'absolute', inset, transformOrigin: track.transformOrigin }}
      {...anim(track, playing)}
    >
      {children}
    </motion.div>
  )
}

export function RunnerFigure({
  copy,
  tracks,
  assets,
  playing,
}: {
  copy: 'A' | 'B'
  tracks: RigTracks
  assets: RigAssets
  playing: boolean
}) {
  return (
    <div data-copy={copy} style={{ position: 'absolute', inset: 0 }}>
      {/* 480:8562 — near-side limb pair */}
      <Box inset="17.66% 40.61% 0 0">
        <Joint name="upper1" track={tracks.upper1} playing={playing} inset="27.97% 36.73% 0 0">
          <Leaf inset="0 0 45.95% 0" src={assets.upper1Vec} />
          {/* 480:8565 */}
          <Box inset="33.98% 0 0 0">
            <Joint name="mid1" track={tracks.mid1} playing={playing}>
              <Leaf inset="0 0 20.59% 0" src={assets.mid1Vec} />
              {/* 480:8568 */}
              <Box inset="50.49% 4.84% 0 4.84%">
                <Joint name="end1" track={tracks.end1} playing={playing}>
                  <img alt="" src={assets.end1} style={fill} />
                </Joint>
              </Box>
            </Joint>
          </Box>
        </Joint>

        {/* 480:8571 */}
        <Box inset="0 0 50.58% 42.86%">
          <Joint name="upper2" track={tracks.upper2} playing={playing}>
            <Leaf inset="0 0 36.79% 0" src={assets.upper2Vec} />
            {/* 480:8574 */}
            <Box inset="36.79% 0 0 0">
              <Joint name="end2" track={tracks.end2} playing={playing}>
                <img alt="" src={assets.end2} style={fill} />
              </Joint>
            </Box>
          </Joint>
        </Box>
      </Box>

      {/*
        480:8577 — torso, held at a static -159deg. Figma reports this node by
        its rotated bounding box (4.542 x 7.1557 at 0.2526, 3.1374); the box
        below is the pre-rotation geometry that produces it, centred on the same
        point, so the artwork keeps its designed proportions.
      */}
      <div
        style={{
          position: 'absolute',
          left: 1.39627,
          top: 3.31545,
          width: 2.25466,
          height: 6.79955,
          transform: 'rotate(-159deg)',
          transformOrigin: 'center',
        }}
      >
        <img alt="" src={assets.torso} style={fill} />
      </div>

      {/* 480:8579 — head */}
      <Leaf inset="0 0 78.12% 30.91%" src={assets.head} />

      {/* 480:8580 — far-side limb */}
      <Joint name="upper3" track={tracks.upper3} playing={playing} inset="40.69% 52.73% 0 9.7%">
        <Leaf inset="0 0 45.95% 0" src={assets.upper3Vec} />
        {/* 480:8582 */}
        <Box inset="33.98% 0 0 0">
          <Joint name="mid3" track={tracks.mid3} playing={playing}>
            <Leaf inset="0 0 20.59% 0" src={assets.mid3Vec} />
            {/* 480:8585 */}
            <Box inset="50.49% 4.84% 0 4.84%">
              <Joint name="end3" track={tracks.end3} playing={playing}>
                <img alt="" src={assets.end3} style={fill} />
              </Joint>
            </Box>
          </Joint>
        </Box>
      </Joint>

      {/* 480:8588 — far-side arm */}
      <Box inset="17.66% 30.91% 41.65% 35.15%">
        <Joint name="upper4" track={tracks.upper4} playing={playing}>
          <Leaf inset="0 0 36.79% 0" src={assets.upper4Vec} />
          {/* 480:8591 */}
          <Box inset="36.79% 0 0 0">
            <Joint name="end4" track={tracks.end4} playing={playing}>
              <img alt="" src={assets.end4} style={fill} />
            </Joint>
          </Box>
        </Joint>
      </Box>
    </div>
  )
}
