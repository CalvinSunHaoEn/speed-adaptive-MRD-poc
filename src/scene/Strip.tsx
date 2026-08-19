import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { anim } from '../motion/core'
import type { Mode } from './modes'

/**
 * The chevron strip — `Speed up STRIP` (480:8630) and `Slow down STRIP`
 * (499:9452), which are the same construction in two colourways.
 *
 * Both layers are alpha-masked by vectors exported from Figma: the chevron
 * masks a gradient fill, and the glow is clipped to an ellipse. Slow Down wraps
 * the whole thing in `rotate(180deg)` so the chevron points down, which also
 * flips its inner shadow to the tip — that is where its red comes from, under
 * the cyan glow sweeping through the body.
 *
 * Blur is left to the assets, which carry it baked into their own SVG filters.
 * Speed Up's export additionally reports a flat `filter: blur(10px)` on the
 * node; applying it double-blurs the artwork and flattens the tip, so it is not
 * applied. Slow Down's Arrow has no filter track at all.
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

export function Strip({ mode, playing }: { mode: Mode; playing: boolean }) {
  const { arrow, ellipseGlow, strip } = mode.tracks
  const s = mode.strip

  return (
    <div
      data-node-id="480:8630"
      style={{
        position: 'absolute',
        left: 70,
        top: 350,
        width: 240,
        height: 150,
        transform: s.rotated ? 'rotate(180deg)' : undefined,
      }}
    >
      {/* SpeedUpArrow — the group Figma fades in and out as one */}
      <motion.div
        data-node-id="480:8631"
        style={{ position: 'absolute', inset: 0 }}
        {...anim(strip, playing)}
      >
        {/* Arrow */}
        <motion.div
          style={{ position: 'absolute', left: 0, top: 0, width: 240, height: 150 }}
          {...anim(arrow, playing)}
        >
          <div style={{ position: 'absolute', inset: 0, ...masked(s.arrowMask, '240px 150px') }}>
            <div style={{ position: 'absolute', inset: s.arrowFillInset }}>
              <img
                alt=""
                src={s.arrowFill}
                style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Glow sweep, clipped to the ellipse mask */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            ...masked(s.ellipseMask, s.ellipseMaskSize, s.ellipseMaskPosition),
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              // The reference emits `left: calc(50% - 0.3px)` with no centring
              // translate, which parks the ellipse off to the right and blooms
              // one arm of the chevron. Half its width recentres it; verified
              // against Figma's render of the frame.
              left: 'calc(50% - 0.3px - 79.7015px)',
              top: 40.77,
              width: 159.403,
              height: 162.475,
            }}
            {...anim(ellipseGlow, playing)}
          >
            <img
              alt=""
              src={s.ellipseGlow}
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
      </motion.div>
    </div>
  )
}
