import { useCallback, useState } from 'react'
import { Stage } from './scene/Stage'
import { MODES, MODE_FOR_DIRECTION, type ModeId } from './scene/modes'
import { useGesture } from './useGesture'

/**
 * Tap to play, swipe to switch mode.
 *
 * On the Meta Ray-Ban Display the neural band's tap and swipes reach the page
 * as ordinary input events, so no bespoke API is needed — the same handlers
 * make the prototype usable with a mouse and keyboard for desktop review. See
 * `useGesture` for which routes are covered and why a tap is only recognised
 * on release.
 *
 * A tap or a mode switch bumps `runId`, which remounts the whole scene: every
 * animated node restarts from t=0 together rather than each drifting on its own
 * clock. Playback runs once and holds its final frame. Switching mode lands on
 * frame 0 of the new frame and waits for a tap, so a demo can line the mode up
 * before playing it.
 */
export default function App() {
  const [runId, setRunId] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [modeId, setModeId] = useState<ModeId>('speedUp')

  const play = useCallback(() => {
    setRunId((n) => n + 1)
    setPlaying(true)
  }, [])

  const switchMode = useCallback((direction: 'left' | 'right') => {
    const next = MODE_FOR_DIRECTION[direction]
    setModeId((current) => {
      if (current === next) return current
      setRunId((n) => n + 1)
      setPlaying(false)
      return next
    })
  }, [])

  useGesture({ onTap: play, onSwipe: switchMode })

  return (
    <div className="viewport">
      <div className="fit">
        <Stage key={runId} mode={MODES[modeId]} playing={playing} />
      </div>
    </div>
  )
}
