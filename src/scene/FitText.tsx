import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

/**
 * Renders a line of text inside the exact box Figma measured for it.
 *
 * The readouts are specified in `One UI Sans GUI SemiBold`, a Samsung typeface
 * with no web distribution. Substitute fonts are wider at the same size, which
 * pushed "8'10"/km" past the pill's padding and over the slot the target pace
 * slides into. Condensing the glyphs to the designed width keeps the pill's
 * composition — and the -74.5px slide — matching the source design.
 *
 * The scale only ever compresses, never stretches, so a narrower font is left
 * alone. Where the real typeface is installed this is a no-op.
 */
export function FitText({
  width,
  style,
  children,
}: {
  width: number
  style?: CSSProperties
  children: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current
      if (!el) return
      // offsetWidth is a layout value, so the stage's own scale doesn't skew it.
      const natural = el.offsetWidth
      if (natural > 0) setScale(Math.min(1, width / natural))
    }
    measure()
    // Re-measure once webfonts settle, in case the fallback was swapped out.
    document.fonts?.ready.then(measure)
  }, [width, children])

  return (
    <p
      ref={ref}
      style={{
        ...style,
        display: 'inline-block',
        // The parent is a column flex box, which would otherwise stretch this
        // to the container width and make the measurement below meaningless.
        alignSelf: 'center',
        flexShrink: 0,
        whiteSpace: 'nowrap',
        margin: 0,
        transform: `scaleX(${scale})`,
        transformOrigin: 'center',
      }}
    >
      {children}
    </p>
  )
}
