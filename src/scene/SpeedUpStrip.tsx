import { motion } from 'motion/react'
import type { CSSProperties } from 'react'
import { anim, arrow, ellipseGlow, strip } from '../motion/timeline'
import { asset } from '../assets/figma'

/**
 * `Speed up STRIP` (480:8630) — the chevron that rises from the bottom of the
 * display, plus the ellipse glow that sweeps up behind it five times.
 *
 * Both layers are alpha-masked by vectors exported from Figma: the chevron
 * masks a gradient fill, and the glow is clipped to an ellipse.
 *
 * The chevron reads sharp at the tip and diffuse toward the bottom. That grading
 * is already baked into `arrowFill.svg`, whose path carries an SVG filter with
 * the Arrow's inner shadow (feGaussianBlur stdDeviation 18) and a foreground
 * blur (stdDeviation 2). The export additionally reports a flat `filter:
 * blur(10px)` on the node; applying that on top double-blurs the asset and
 * flattens the whole shape — measured down a frame of the Figma timeline, it
 * drops the horizontal edge gradient to a constant 2 per row against Figma's 68
 * at the tip falling to 4 at the bottom, and dims the tip from 186 to 93. So the
 * blur is left to the asset that already contains it.
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
      {/* 480:8631 — SpeedUpArrow, the group Figma fades in and out as one */}
      <motion.div
        data-node-id="480:8631"
        style={{ position: 'absolute', inset: 0 }}
        {...anim(strip, playing)}
      >
        {/* 480:8633 — Arrow */}
        <motion.div
          style={{ position: 'absolute', left: 0, top: 0, width: 240, height: 150 }}
          {...anim(arrow, playing)}
        >
          <div style={{ position: 'absolute', inset: 0, ...masked(asset.arrowMask, '240px 150px') }}>
            <div style={{ position: 'absolute', inset: '-0.67% -1.67% 6.74% -1.67%' }}>
              <img
                alt=""
                src={asset.arrowFill}
                style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
              />
            </div>
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
      </motion.div>
    </div>
  )
}
