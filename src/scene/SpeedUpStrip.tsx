import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { anim, arrow, ellipseGlow } from '../motion/timeline'
import { asset } from '../assets/figma'

/**
 * `Speed up STRIP` (480:8630) — the chevron that rises from the bottom of the
 * display, plus the ellipse glow that sweeps up behind it five times.
 *
 * Both layers are alpha-masked by vectors exported from Figma: the chevron
 * masks a gradient fill, and the glow is clipped to an ellipse.
 *
 * The Figma reference emits `mask-clip: no-clip` here. That leaves whatever
 * falls outside the mask image unmasked — the chevron's fill is inset to -4px
 * horizontally, and its right edge leaked as a hard red rectangle that Figma's
 * own render does not show. The default `border-box` clip matches Figma, and
 * the artwork fits the 240 x 150 box exactly, so nothing intended is lost.
 */

const masked = (src: string, size: string, position?: string): CSSProperties => ({
  maskImage: `url("${src}")`,
  WebkitMaskImage: `url("${src}")`,
  maskMode: 'alpha',
  maskComposite: 'intersect',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskSize: size,
  WebkitMaskSize: size,
  ...(position ? { maskPosition: position, WebkitMaskPosition: position } : null),
})

export function SpeedUpStrip({ playing }: { playing: boolean }) {
  return (
    <div
      data-node-id="480:8630"
      style={{ position: 'absolute', left: 70, top: 350, width: 240, height: 150 }}
    >
      {/* 480:8633 — Arrow */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 240,
          height: 150,
          ...masked(asset.arrowMask, '240px 150px'),
        }}
        {...anim(arrow, playing)}
      >
        <div style={{ position: 'absolute', inset: '-0.67% -1.67% 6.74% -1.67%' }}>
          <img
            alt=""
            src={asset.arrowFill}
            style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
          />
        </div>
      </motion.div>

      {/* 480:8635 — glow sweep, clipped to the ellipse mask */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          ...masked(asset.ellipseMask, '248px 140.896px', '-4px -0.999px'),
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            left: 'calc(50% - 0.3px)',
            top: 40.77,
            width: 159.403,
            height: 162.475,
          }}
          {...anim(ellipseGlow, playing)}
        >
          <img
            alt=""
            src={asset.ellipseGlow}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              maxWidth: 'none',
              display: 'block',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
