import { useEffect } from 'react'

/**
 * Taps and horizontal swipes, from whatever the device actually emits.
 *
 * How the neural band's gestures reach a page on the Ray-Ban Display isn't
 * documented, so every plausible route is wired up at once: pointer events
 * (which also cover a mouse drag for desktop review), raw touch events in case
 * they arrive without pointer events, arrow keys, and horizontal wheel deltas.
 * Whichever the band produces, the prototype responds.
 *
 * A tap and a swipe start identically, so a tap can only be recognised on
 * release: press, then release having travelled less than `TAP_SLOP`. Firing on
 * press — as this did before there was anything to swipe — would play the
 * animation on the first touch of every swipe.
 */

/** Movement below this on release is a tap, not a swipe. */
const TAP_SLOP = 10
/** Horizontal travel needed to count as a swipe, and it must beat the vertical. */
const SWIPE_MIN = 40
/** Wheel deltas arrive in a stream; ignore the tail of one already handled. */
const WHEEL_COOLDOWN_MS = 600

type Handlers = {
  onTap: () => void
  onSwipe: (direction: 'left' | 'right') => void
}

export function useGesture({ onTap, onSwipe }: Handlers) {
  useEffect(() => {
    let startX = 0
    let startY = 0
    let tracking = false
    let lastWheel = 0
    // A touch gesture also emits pointer events, so one swipe would be handled
    // twice. Touch wins where it fires and pointer events are ignored in its
    // wake; where touch never fires, pointer runs unimpeded. This must not
    // become a cooldown on gestures in general — two deliberate actions a
    // moment apart are both real.
    let lastTouchEnd = 0
    const fromTouchEcho = () => Date.now() - lastTouchEnd < 500

    const begin = (x: number, y: number) => {
      startX = x
      startY = y
      tracking = true
    }

    const end = (x: number, y: number) => {
      if (!tracking) return
      tracking = false
      const dx = x - startX
      const dy = y - startY
      if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx < 0 ? 'left' : 'right')
      } else if (Math.hypot(dx, dy) < TAP_SLOP) {
        onTap()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (fromTouchEcho()) return
      begin(e.clientX, e.clientY)
    }
    const onPointerUp = (e: PointerEvent) => {
      if (fromTouchEcho()) return
      end(e.clientX, e.clientY)
    }
    const onPointerCancel = () => { tracking = false }

    const onTouchStart = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      if (t) begin(t.clientX, t.clientY)
      lastTouchEnd = Date.now()
    }
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      if (t) end(t.clientX, t.clientY)
      lastTouchEnd = Date.now()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); onSwipe('left') }
      else if (e.key === 'ArrowRight') { e.preventDefault(); onSwipe('right') }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap() }
    }

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 30 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      const now = Date.now()
      if (now - lastWheel < WHEEL_COOLDOWN_MS) return
      lastWheel = now
      onSwipe(e.deltaX < 0 ? 'left' : 'right')
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerCancel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('wheel', onWheel)
    }
  }, [onTap, onSwipe])
}
