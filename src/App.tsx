import { useCallback, useEffect, useState } from 'react'
import { Stage } from './scene/Stage'

/**
 * Tap-driven playback.
 *
 * On the Meta Ray-Ban Display the neural band's tap gesture arrives in the
 * browser as an ordinary pointer event, so no bespoke API is needed — the same
 * handler makes the prototype clickable on a desktop for review. Enter and
 * Space are wired up for keyboard review.
 *
 * A tap bumps `runId`, which remounts the whole scene: every one of the 28
 * animated nodes restarts from t=0 together rather than each drifting on its
 * own clock. Playback runs once and holds its final frame; before the first tap
 * the scene sits on frame 0.
 */
export default function App() {
  const [runId, setRunId] = useState(0)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(() => {
    setRunId((n) => n + 1)
    setPlaying(true)
  }, [])

  useEffect(() => {
    const onPointerDown = () => play()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        play()
      }
    }

    // pointerdown only — pairing it with click would fire two restarts per tap.
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [play])

  return (
    <div className="viewport">
      <div className="fit">
        <Stage key={runId} playing={playing} />
      </div>
    </div>
  )
}
