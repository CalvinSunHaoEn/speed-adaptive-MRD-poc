import { motion } from 'motion/react'
import { anim } from '../motion/core'
import { RunnerFigure } from './RunnerFigure'
import type { Mode } from './modes'

/**
 * `pacing-run 2` (480:8559) — the animated runner that replaces the static
 * pace-setter glyph while the pill is expanded.
 *
 * Figma stores two full copies of the figure, nested one level deeper. They
 * share every vector export and differ only in the phase of their joint
 * rotations. Both frames use the same construction; the mode supplies the
 * artwork (red for Speed Up, cyan for Slow Down) and the timing.
 */

export function RunnerIcon({ mode, playing }: { mode: Mode; playing: boolean }) {
  const { runnerIcon, rigRoot, rigA, rigB } = mode.tracks
  return (
    <motion.div
      data-node-id="480:8559"
      style={{
        position: 'relative',
        flexShrink: 0,
        width: 18,
        height: 18,
        overflow: 'hidden',
      }}
      {...anim(runnerIcon, playing)}
    >
      {/* 480:8560 — the rig is taller than the icon and is clipped by it */}
      <div
        style={{
          position: 'absolute',
          left: 0.75,
          top: -6.972726,
          width: 6,
          height: 18.945452,
        }}
      >
        {/* 480:8561 — run-cycle bob shared by both copies */}
        <motion.div
          style={{ position: 'absolute', inset: 0 }}
          {...anim(rigRoot, playing)}
        >
          <RunnerFigure copy="A" tracks={rigA} assets={mode.rigA} playing={playing} />
          {/* 480:8594 */}
          <RunnerFigure copy="B" tracks={rigB} assets={mode.rigB} playing={playing} />
        </motion.div>
      </div>
    </motion.div>
  )
}
