import { motion } from 'motion/react'
import { anim, rigA, rigB, rigRoot, runnerIcon } from '../motion/timeline'
import { RunnerFigure, type RigAssets } from './RunnerFigure'
import { asset } from '../assets/figma'

/**
 * `pacing-run 2` (480:8559) — the animated runner that replaces the static
 * pace-setter glyph while the pill is expanded.
 *
 * Figma stores two full copies of the figure (480:8562-8592 and, nested one
 * level deeper in 480:8594, 480:8595-8625). They share every vector export and
 * differ only in the phase of their joint rotations.
 */

const copyA: RigAssets = {
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

const copyB: RigAssets = {
  ...copyA,
  end1: asset.n8602,
  end2: asset.n8608,
  end3: asset.n8619,
  end4: asset.n8625,
}

export function RunnerIcon({ playing }: { playing: boolean }) {
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
          <RunnerFigure copy="A" tracks={rigA} assets={copyA} playing={playing} />
          {/* 480:8594 */}
          <RunnerFigure copy="B" tracks={rigB} assets={copyB} playing={playing} />
        </motion.div>
      </div>
    </motion.div>
  )
}
