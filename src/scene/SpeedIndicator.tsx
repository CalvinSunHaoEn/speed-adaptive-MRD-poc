import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import {
  anim,
  paceCurrent,
  paceSetterIcon,
  paceTarget,
  speedIndicator,
  speedIndicatorGlow,
} from '../motion/timeline'
import { FitText } from './FitText'
import { RunnerIcon } from './RunnerIcon'
import { asset } from '../assets/figma'

/**
 * `Speed Indicator` (480:8558) — the pace pill.
 *
 * It shrinks from 127px to 48px while scaling 2x about its top centre, swaps
 * its glyph from the static pace-setter icon to the animated runner, swaps its
 * readout from the current pace to the target pace, and flips its inset glow
 * from white to red.
 */

/**
 * Figma sets these in `One UI Sans GUI SemiBold`. The box widths are pinned to
 * the values Figma measured, and `FitText` condenses the glyphs to fit them, so
 * the layout holds under whatever font the device actually has.
 */
const readout: CSSProperties = {
  position: 'relative',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  lineHeight: 0,
  fontSize: 15,
  fontWeight: 600,
  fontStyle: 'normal',
  color: '#fff',
  textAlign: 'center',
  letterSpacing: '0.7875px',
  whiteSpace: 'nowrap',
  wordBreak: 'break-word',
}

const line: CSSProperties = { lineHeight: 'normal', margin: 0 }

export function SpeedIndicator({ playing }: { playing: boolean }) {
  return (
    <motion.div
      data-node-id="480:8558"
      style={{
        position: 'absolute',
        left: 127,
        top: 0,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 12,
        paddingRight: 19,
        paddingTop: 12,
        paddingBottom: 12,
        overflow: 'hidden',
        transformOrigin: speedIndicator.transformOrigin,
      }}
      {...anim(speedIndicator, playing)}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }}
      />

      <RunnerIcon playing={playing} />

      {/* 480:8627 */}
      <motion.div style={{ ...readout, width: 66 }} {...anim(paceCurrent, playing)}>
        <FitText width={66} style={line}>
          8&rsquo;10&rdquo;/km
        </FitText>
      </motion.div>

      {/* 480:8628 */}
      <motion.div style={{ ...readout, width: 67 }} {...anim(paceTarget, playing)}>
        <FitText width={67} style={line}>
          7&rsquo;30&rdquo;/km
        </FitText>
      </motion.div>

      {/* 480:8629 — ic_exercise_pace_setter */}
      <motion.div
        style={{ position: 'absolute', left: 12, top: 12, width: 24, height: 24 }}
        {...anim(paceSetterIcon, playing)}
      >
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '15.58% 15.32% 12.99% 24.68%' }}>
            <img alt="" src={asset.iconPaceA} style={leafImg} />
          </div>
          <div style={{ position: 'absolute', inset: '15.58% 33.5% 12.99% 6.49%' }}>
            <img alt="" src={asset.iconPaceB} style={leafImg} />
          </div>
        </div>
      </motion.div>

      {/* Inset glow, painted over the pill contents */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
        }}
        {...anim(speedIndicatorGlow, playing)}
      />
    </motion.div>
  )
}

const leafImg: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  maxWidth: 'none',
  display: 'block',
}
