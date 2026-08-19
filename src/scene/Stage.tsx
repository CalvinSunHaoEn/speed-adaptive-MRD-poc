import { SpeedIndicator } from './SpeedIndicator'
import { SpeedUpStrip } from './SpeedUpStrip'

/**
 * Frame 480:8550 "Speed up Icon+STRIP META POC" — 600 x 600, the native panel
 * size of the Meta Ray-Ban Display.
 *
 * Remounting this subtree (via a changing `key`) is what restarts every track
 * in the 4.221s cohort at exactly t=0, which keeps all 28 animated nodes in
 * sync on every tap.
 */
export function Stage({ playing }: { playing: boolean }) {
  return (
    <div
      data-node-id="480:8550"
      style={{
        position: 'relative',
        width: 600,
        height: 600,
        borderRadius: 40,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* 480:8553 */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 50,
          width: 380,
          height: 500,
          mixBlendMode: 'screen',
          overflow: 'hidden',
        }}
      >
        <SpeedIndicator playing={playing} />
        <SpeedUpStrip playing={playing} />
      </div>
    </div>
  )
}
